import { 
  db, 
  auth, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  collection, 
  onSnapshot, 
  query, 
  where, 
  increment,
  handleFirestoreError, 
  OperationType 
} from './firebase';
import { sendFirestoreNotification } from './notificationService';

export interface FollowRecord {
  id: string;
  followerUid: string;
  followingUid: string;
  followerName: string;
  followingName: string;
  createdAt: string;
}

/**
 * Follow a user in Firestore.
 * 
 * Guarantees:
 * 1. Only authenticated users can follow.
 * 2. User cannot follow themselves (throws error).
 * 3. Deterministic ID `${followerUid}_${targetUid}` naturally prevents duplicate records.
 * 4. Updates follower and following counts in users collection if documents exist.
 */
export async function followUserInFirestore(targetUser: {
  id: string;
  uid?: string;
  fullName?: string;
  name?: string;
}): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('यूज़र को फ़ॉलो करने के लिए कृपया पहले लॉगिन करें।');
  }

  const targetUid = targetUser.uid || targetUser.id;
  if (!targetUid) {
    throw new Error('मान्य यूज़र आईडी नहीं मिली।');
  }

  // Requirement 5: User cannot follow themselves
  if (currentUser.uid === targetUid) {
    throw new Error('आप स्वयं को फ़ॉलो नहीं कर सकते हैं।');
  }

  // Requirement 6: Deterministic ID prevents duplicate entries
  const followId = `${currentUser.uid}_${targetUid}`;
  const path = `follows/${followId}`;

  const followPayload: FollowRecord = {
    id: followId,
    followerUid: currentUser.uid,
    followingUid: targetUid,
    followerName: currentUser.displayName || (currentUser.email ? currentUser.email.split('@')[0] : 'भारत नागरिक'),
    followingName: targetUser.fullName || targetUser.name || 'क्रिएटर',
    createdAt: new Date().toISOString()
  };

  try {
    // 1. Create or overwrite follow document
    await setDoc(doc(db, 'follows', followId), followPayload);

    // 2. Safely increment followingCount on current user's profile
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        followingCount: increment(1)
      });
    } catch (e) {
      // Ignore if user profile doc does not have update permission or is offline
      console.warn('Following count update notice:', e);
    }

    // 3. Safely increment followersCount on target user's profile
    try {
      await updateDoc(doc(db, 'users', targetUid), {
        followersCount: increment(1)
      });
    } catch (e) {
      console.warn('Target followers count update notice:', e);
    }

    // 4. Send real-time notification to target user
    try {
      await sendFirestoreNotification({
        recipientUid: targetUid,
        senderUid: currentUser.uid,
        senderName: currentUser.displayName || (currentUser.email ? currentUser.email.split('@')[0] : 'भारत नागरिक'),
        senderPhotoURL: currentUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        type: 'follow',
        message: 'ने आपको फ़ॉलो करना शुरू किया'
      });
    } catch (notifErr) {
      console.warn('Follow notification trigger notice:', notifErr);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

/**
 * Unfollow a user in Firestore.
 * Deletes the follow document and decrements counts.
 */
export async function unfollowUserInFirestore(targetUserId: string): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('अनफ़ॉलो करने के लिए कृपया पहले लॉगिन करें।');
  }

  if (currentUser.uid === targetUserId) {
    throw new Error('अमान्य अनुरोध।');
  }

  const followId = `${currentUser.uid}_${targetUserId}`;
  const path = `follows/${followId}`;

  try {
    // 1. Delete follow document
    await deleteDoc(doc(db, 'follows', followId));

    // 2. Decrement followingCount on current user
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        followingCount: increment(-1)
      });
    } catch (e) {
      console.warn('Following count decrement notice:', e);
    }

    // 3. Decrement followersCount on target user
    try {
      await updateDoc(doc(db, 'users', targetUserId), {
        followersCount: increment(-1)
      });
    } catch (e) {
      console.warn('Followers count decrement notice:', e);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

/**
 * Subscribes to the list of user IDs that a specific user is currently following.
 * Ensures follow status persists across page reloads and device switches.
 */
export function subscribeToUserFollowings(
  followerUid: string,
  onUpdate: (followingUids: string[]) => void,
  onError?: (error: Error) => void
): () => void {
  const q = query(
    collection(db, 'follows'),
    where('followerUid', '==', followerUid)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const followingUids: string[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as FollowRecord;
        if (data.followingUid) {
          followingUids.push(data.followingUid);
        }
      });
      onUpdate(followingUids);
    },
    (error) => {
      console.warn('Followings subscription notice:', error);
      if (onError) onError(error);
    }
  );
}

/**
 * Subscribes to the list of followers for a specific user to get accurate live count.
 */
export function subscribeToUserFollowers(
  targetUserId: string,
  onUpdate: (followerUids: string[]) => void,
  onError?: (error: Error) => void
): () => void {
  const q = query(
    collection(db, 'follows'),
    where('followingUid', '==', targetUserId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const followerUids: string[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as FollowRecord;
        if (data.followerUid) {
          followerUids.push(data.followerUid);
        }
      });
      onUpdate(followerUids);
    },
    (error) => {
      console.warn('Followers subscription notice:', error);
      if (onError) onError(error);
    }
  );
}
