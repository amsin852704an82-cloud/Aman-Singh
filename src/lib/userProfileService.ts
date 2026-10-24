import { 
  db, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  handleFirestoreError, 
  OperationType, 
  FirebaseUser 
} from './firebase';
import { claimUsernameTransaction } from './usernameService';
import { User } from '../types/bharatConnect';

export interface UserProfileFirestoreData {
  uid: string;
  name: string;
  fullName: string;
  email: string;
  photoURL: string;
  avatar: string;
  username: string;
  handle: string;
  bio: string;
  location: string;
  verified: boolean;
  followersCount: number;
  followingCount: number;
  postCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Saves or updates a user profile document in Firestore "users/{uid}" collection.
 * 
 * Rules:
 * 1. Document ID is Firebase Auth user.uid.
 * 2. Saves uid, name, email, photoURL, and createdAt.
 * 3. If an existing profile is found, existing user data is protected and only
 *    missing/empty fields or necessary updates are merged.
 * 4. If Firestore is unavailable or permissions fail, throws a handled Firestore error.
 */
export async function saveOrUpdateUserProfile(
  user: FirebaseUser,
  extra?: { name?: string; username?: string }
): Promise<User> {
  const path = `users/${user.uid}`;
  const userDocRef = doc(db, 'users', user.uid);

  try {
    let docSnap;
    try {
      docSnap = await getDoc(userDocRef);
    } catch (getErr) {
      handleFirestoreError(getErr, OperationType.GET, path);
      throw getErr;
    }

    const cleanUsername = extra?.username
      ? extra.username.toLowerCase().trim().replace(/[^a-z0-9_]/g, '')
      : (user.email ? user.email.split('@')[0] : 'citizen');

    const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';
    const effectivePhotoURL = user.photoURL || defaultAvatar;
    const effectiveName = user.displayName || extra?.name || (user.email ? user.email.split('@')[0] : 'भारत नागरिक');

    // Securely store user's private email in private sub-collection: users/{uid}/private/account
    // This strictly isolates PII so only the account owner (request.auth.uid == userId) can read it
    if (user.email) {
      try {
        const privateAccountRef = doc(db, 'users', user.uid, 'private', 'account');
        await setDoc(privateAccountRef, {
          email: user.email,
          uid: user.uid,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (privErr) {
        console.warn('Private account subcollection save note:', privErr);
      }
    }

    if (docSnap.exists()) {
      const data = docSnap.data();
      const updates: Record<string, any> = {};

      // Preserve existing user fields; only update missing or newly provided essential fields
      if (!data.uid) updates.uid = user.uid;
      if (!data.id) updates.id = user.uid;
      if (!data.name && effectiveName) updates.name = effectiveName;
      if (!data.fullName && effectiveName) updates.fullName = effectiveName;
      if (!data.photoURL && user.photoURL) updates.photoURL = user.photoURL;
      if (!data.avatar) updates.avatar = data.photoURL || effectivePhotoURL;
      if (!data.username) updates.username = cleanUsername;
      if (!data.handle) updates.handle = `@${data.username || cleanUsername}`;
      if (!data.createdAt) updates.createdAt = new Date().toISOString();
      updates.updatedAt = new Date().toISOString();

      if (Object.keys(updates).length > 1) { // more than just updatedAt
        try {
          await updateDoc(userDocRef, updates);
        } catch (updateErr) {
          handleFirestoreError(updateErr, OperationType.UPDATE, path);
          throw updateErr;
        }
      }

      const mergedData = { ...data, ...updates };
      return {
        id: user.uid,
        uid: user.uid,
        username: mergedData.username || cleanUsername,
        name: mergedData.name || mergedData.fullName || effectiveName,
        fullName: mergedData.fullName || mergedData.name || effectiveName,
        email: user.email || '', // available only to the authenticated session
        photoURL: mergedData.photoURL || mergedData.avatar || effectivePhotoURL,
        avatar: mergedData.avatar || mergedData.photoURL || effectivePhotoURL,
        handle: mergedData.handle || `@${cleanUsername}`,
        bio: mergedData.bio || 'भारत का गौरवान्वित नागरिक 🇮🇳',
        location: mergedData.location || 'India',
        verified: mergedData.verified ?? true,
        followersCount: mergedData.followersCount || 1,
        followingCount: mergedData.followingCount || 2,
        postCount: mergedData.postCount || 0,
        language: mergedData.language || 'hi',
        createdAt: mergedData.createdAt || new Date().toISOString(),
        updatedAt: mergedData.updatedAt || new Date().toISOString()
      };
    } else {
      // Document does not exist yet -> Create new public profile in users collection (without exposing email in public doc)
      const newProfile: Omit<UserProfileFirestoreData, 'email'> & { id: string } = {
        uid: user.uid,
        id: user.uid,
        name: effectiveName,
        fullName: effectiveName,
        photoURL: effectivePhotoURL,
        avatar: effectivePhotoURL,
        username: cleanUsername,
        handle: `@${cleanUsername}`,
        bio: 'भारत का गौरवान्वित नागरिक 🇮🇳',
        location: 'India',
        verified: true,
        followersCount: 1,
        followingCount: 2,
        postCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      try {
        await setDoc(userDocRef, newProfile);
      } catch (createErr) {
        handleFirestoreError(createErr, OperationType.CREATE, path);
        throw createErr;
      }

      // Claim username document for uniqueness
      try {
        await claimUsernameTransaction(cleanUsername, user.uid);
      } catch (claimErr) {
        console.warn('Username reservation note:', claimErr);
      }

      return {
        ...newProfile,
        email: user.email || '',
        language: 'hi'
      };
    }
  } catch (error) {
    console.error('saveOrUpdateUserProfile error:', error);
    throw error;
  }
}

/**
 * Updates user profile details in Firestore with strict username uniqueness enforcement.
 */
export async function updateUserProfileDetails(
  uid: string,
  updates: { fullName?: string; bio?: string; location?: string; avatar?: string; username?: string },
  currentUsername?: string
): Promise<{ success: boolean; error?: string; cleanUsername?: string }> {
  try {
    const userDocRef = doc(db, 'users', uid);
    let finalUsername = currentUsername;

    if (updates.username && updates.username !== currentUsername) {
      const claimResult = await claimUsernameTransaction(updates.username, uid, currentUsername);
      if (!claimResult.success) {
        return { success: false, error: claimResult.error };
      }
      finalUsername = claimResult.cleanUsername;
    }

    const docUpdates: Record<string, any> = {
      updatedAt: new Date().toISOString()
    };
    if (updates.fullName !== undefined) {
      docUpdates.fullName = updates.fullName;
      docUpdates.name = updates.fullName;
    }
    if (updates.bio !== undefined) docUpdates.bio = updates.bio;
    if (updates.location !== undefined) docUpdates.location = updates.location;
    if (updates.avatar !== undefined) {
      docUpdates.avatar = updates.avatar;
      docUpdates.photoURL = updates.avatar;
    }
    if (finalUsername) {
      docUpdates.username = finalUsername;
      docUpdates.handle = `@${finalUsername}`;
    }

    await updateDoc(userDocRef, docUpdates);
    return { success: true, cleanUsername: finalUsername };
  } catch (err: any) {
    console.error('updateUserProfileDetails error:', err);
    return { success: false, error: err?.message || 'प्रोफाइल अपडेट करने में त्रुटि हुई।' };
  }
}
