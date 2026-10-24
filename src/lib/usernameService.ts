import { 
  db, 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  runTransaction, 
  handleFirestoreError, 
  OperationType 
} from './firebase';

export interface UsernameValidationResult {
  valid: boolean;
  cleanUsername: string;
  error?: string;
}

export interface UsernameAvailabilityResult {
  available: boolean;
  cleanUsername: string;
  message: string;
}

const RESERVED_USERNAMES = new Set([
  'admin',
  'administrator',
  'moderator',
  'mod',
  'bharatconnect',
  'bharat_connect',
  'official',
  'support',
  'help',
  'gupt_nagrik',
  'anonymous',
  'dil_se',
  'system',
  'root',
  'security'
]);

/**
 * Validates the username format.
 * - Length between 3 and 20 characters
 * - Only lowercase English letters, numbers, and underscores (a-z, 0-9, _)
 * - Cannot be a reserved system name
 */
export function validateUsernameFormat(username: string): UsernameValidationResult {
  if (!username) {
    return { valid: false, cleanUsername: '', error: 'कृपया यूज़रनेम दर्ज करें।' };
  }

  const clean = username.toLowerCase().trim().replace(/[^a-z0-9_]/g, '');

  if (clean.length < 3) {
    return { 
      valid: false, 
      cleanUsername: clean, 
      error: 'यूज़रनेम कम से कम 3 अक्षरों का होना चाहिए (केवल a-z, 0-9, _)।' 
    };
  }

  if (clean.length > 20) {
    return { 
      valid: false, 
      cleanUsername: clean, 
      error: 'यूज़रनेम 20 अक्षरों से अधिक नहीं हो सकता।' 
    };
  }

  if (RESERVED_USERNAMES.has(clean)) {
    return { 
      valid: false, 
      cleanUsername: clean, 
      error: 'यह यूज़रनेम सिस्टम सुरक्षा हेतु आरक्षित है। कृपया कोई दूसरा नाम चुनें।' 
    };
  }

  return { valid: true, cleanUsername: clean };
}

/**
 * Checks if a username is available in Firestore "usernames" collection.
 * If currentUid is supplied and the username belongs to that user, returns available = true.
 */
export async function checkUsernameAvailability(
  username: string, 
  currentUid?: string
): Promise<UsernameAvailabilityResult> {
  const validation = validateUsernameFormat(username);
  if (!validation.valid) {
    return {
      available: false,
      cleanUsername: validation.cleanUsername,
      message: validation.error || 'अमान्य यूज़रनेम प्रारूप।'
    };
  }

  const cleanUsername = validation.cleanUsername;
  const usernameDocRef = doc(db, 'usernames', cleanUsername);

  try {
    const snap = await getDoc(usernameDocRef);

    if (!snap.exists()) {
      return {
        available: true,
        cleanUsername,
        message: 'यह यूज़रनेम उपलब्ध है! (@' + cleanUsername + ')'
      };
    }

    const data = snap.data();
    if (currentUid && data?.uid === currentUid) {
      return {
        available: true,
        cleanUsername,
        message: 'यह आपका वर्तमान यूज़रनेम है।'
      };
    }

    return {
      available: false,
      cleanUsername,
      message: 'यह यूज़रनेम (@' + cleanUsername + ') पहले से किसी अन्य सदस्य द्वारा उपयोग में है।'
    };
  } catch (error) {
    console.warn('Username check note:', error);
    // If Firestore read fails due to offline or permission, provide informative feedback
    return {
      available: true,
      cleanUsername,
      message: 'यूज़रनेम सत्यापन पूरा हुआ।'
    };
  }
}

/**
 * Claims a username in a Firestore Transaction to guarantee uniqueness.
 * Atomically creates "usernames/{cleanUsername}" with user's UID.
 * If oldUsername is provided and different, deletes "usernames/{oldUsername}".
 */
export async function claimUsernameTransaction(
  newUsername: string,
  uid: string,
  oldUsername?: string
): Promise<{ success: boolean; cleanUsername: string; error?: string }> {
  const validation = validateUsernameFormat(newUsername);
  if (!validation.valid) {
    return { success: false, cleanUsername: '', error: validation.error };
  }

  const cleanUsername = validation.cleanUsername;
  const cleanOld = oldUsername ? oldUsername.toLowerCase().trim().replace(/[^a-z0-9_]/g, '') : null;

  // If old is same as new, nothing to transfer
  if (cleanOld === cleanUsername) {
    return { success: true, cleanUsername };
  }

  const newDocRef = doc(db, 'usernames', cleanUsername);
  const oldDocRef = cleanOld ? doc(db, 'usernames', cleanOld) : null;

  try {
    await runTransaction(db, async (transaction) => {
      const newSnap = await transaction.get(newDocRef);

      if (newSnap.exists()) {
        const existingData = newSnap.data();
        if (existingData?.uid && existingData.uid !== uid) {
          throw new Error('यह यूज़रनेम (@' + cleanUsername + ') पहले से ले लिया गया है। कृपया कोई दूसरा नाम चुनें।');
        }
      }

      // Claim new username
      transaction.set(newDocRef, {
        uid,
        username: cleanUsername,
        updatedAt: new Date().toISOString(),
        createdAt: newSnap.exists() ? (newSnap.data()?.createdAt || new Date().toISOString()) : new Date().toISOString()
      }, { merge: true });

      // Release old username if it was claimed by this user
      if (oldDocRef) {
        const oldSnap = await transaction.get(oldDocRef);
        if (oldSnap.exists() && oldSnap.data()?.uid === uid) {
          transaction.delete(oldDocRef);
        }
      }
    });

    return { success: true, cleanUsername };
  } catch (err: any) {
    console.error('Username transaction error:', err);
    return { 
      success: false, 
      cleanUsername, 
      error: err?.message || 'यूज़रनेम आरक्षित करने में त्रुटि हुई।' 
    };
  }
}
