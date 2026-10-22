import { 
  db, 
  auth, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  onSnapshot, 
  query, 
  writeBatch,
  handleFirestoreError, 
  OperationType 
} from './firebase';
import { AppNotification, User } from '../types/bharatConnect';

export interface SendNotificationParams {
  recipientUid: string;
  senderUid: string;
  senderName: string;
  senderPhotoURL?: string;
  type: 'like' | 'comment' | 'follow';
  postId?: string;
  message?: string;
  commentId?: string;
}

/**
 * Helper to compute deterministic notification IDs to prevent duplicate spam entries.
 */
export function getNotificationId(params: SendNotificationParams): string {
  if (params.type === 'like' && params.postId) {
    return `notif_like_${params.senderUid}_${params.postId}`;
  }
  if (params.type === 'follow') {
    return `notif_follow_${params.senderUid}_${params.recipientUid}`;
  }
  if (params.type === 'comment' && params.commentId) {
    return `notif_comment_${params.commentId}`;
  }
  return `notif_${params.type}_${params.senderUid}_${Date.now()}`;
}

/**
 * Creates and writes a notification document to `users/{recipientUid}/notifications/{notificationId}`.
 * Strictly prevents self-notifications.
 */
export async function sendFirestoreNotification(params: SendNotificationParams): Promise<void> {
  const { recipientUid, senderUid, type, postId = '' } = params;

  // Strict check: User should never receive notification for their own actions
  if (!recipientUid || !senderUid || recipientUid === senderUid) {
    return;
  }

  const notificationId = getNotificationId(params);
  const nowIso = new Date().toISOString();

  // Determine localized friendly message if not provided
  let messageText = params.message;
  if (!messageText) {
    if (type === 'like') {
      messageText = 'ने आपकी पोस्ट को लाइक किया';
    } else if (type === 'comment') {
      messageText = 'ने आपकी पोस्ट पर टिप्पणी की';
    } else if (type === 'follow') {
      messageText = 'ने आपको फ़ॉलो करना शुरू किया';
    } else {
      messageText = 'ने आपको सूचना भेजी';
    }
  }

  const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';
  const photoUrl = params.senderPhotoURL || defaultAvatar;

  const notifPayload: AppNotification = {
    notificationId,
    recipientUid,
    senderUid,
    senderName: params.senderName || 'उपयोगकर्ता',
    senderPhotoURL: photoUrl,
    type,
    postId,
    message: messageText,
    createdAt: nowIso,
    isRead: false,
    
    // Compatibility helpers
    id: notificationId,
    actor: {
      id: senderUid,
      uid: senderUid,
      fullName: params.senderName || 'उपयोगकर्ता',
      name: params.senderName || 'उपयोगकर्ता',
      username: (params.senderName || 'user').toLowerCase().replace(/\s+/g, ''),
      handle: `@${(params.senderName || 'user').toLowerCase().replace(/\s+/g, '')}`,
      avatar: photoUrl,
      photoURL: photoUrl,
      bio: '',
      location: 'भारत',
      verified: false,
      followersCount: 0,
      followingCount: 0,
      postCount: 0,
      language: 'hi'
    }
  };

  const docPath = `users/${recipientUid}/notifications/${notificationId}`;
  try {
    await setDoc(doc(db, 'users', recipientUid, 'notifications', notificationId), notifPayload);
  } catch (error) {
    console.warn(`Could not save notification (${docPath}):`, error);
    // Don't throw to prevent interrupting the primary user action (like/comment/follow)
  }
}

/**
 * Format relative time helper in Hindi/English
 */
export function formatTimeAgo(isoString: string): string {
  try {
    if (!isoString || isNaN(Date.parse(isoString))) {
      return 'कुछ समय पहले';
    }
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'अभी-अभी (Just now)';
    if (diffMins < 60) return `${diffMins} मि. पहले`;
    if (diffHours < 24) return `${diffHours} घंटे पहले`;
    if (diffDays === 1) return 'कल';
    if (diffDays < 7) return `${diffDays} दिन पहले`;
    return new Date(isoString).toLocaleDateString('hi-IN');
  } catch {
    return 'कुछ समय पहले';
  }
}

/**
 * Subscribes in real-time to a user's notifications in Firestore sub-collection:
 * `users/{recipientUid}/notifications`
 * Returns the unsubscribe callback function for clean unmount.
 */
export function subscribeToUserNotifications(
  recipientUid: string,
  onNotificationsUpdate: (notifications: AppNotification[]) => void,
  onError?: (error: Error) => void
): () => void {
  if (!recipientUid) {
    onNotificationsUpdate([]);
    return () => {};
  }

  const notifsColRef = collection(db, 'users', recipientUid, 'notifications');

  const unsubscribe = onSnapshot(
    notifsColRef,
    (snapshot) => {
      const items: AppNotification[] = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as AppNotification;
        const notifId = data.notificationId || docSnap.id;
        const senderAvatar = data.senderPhotoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';
        const senderName = data.senderName || 'उपयोगकर्ता';

        const actorObj: User = data.actor || {
          id: data.senderUid,
          uid: data.senderUid,
          fullName: senderName,
          name: senderName,
          username: senderName.toLowerCase().replace(/\s+/g, ''),
          handle: `@${senderName.toLowerCase().replace(/\s+/g, '')}`,
          avatar: senderAvatar,
          photoURL: senderAvatar,
          bio: '',
          location: 'भारत',
          verified: false,
          followersCount: 0,
          followingCount: 0,
          postCount: 0,
          language: 'hi'
        };

        items.push({
          ...data,
          id: notifId,
          notificationId: notifId,
          recipientUid: data.recipientUid || recipientUid,
          senderUid: data.senderUid,
          senderName,
          senderPhotoURL: senderAvatar,
          type: data.type || 'like',
          postId: data.postId || '',
          message: data.message || '',
          createdAt: data.createdAt,
          isRead: Boolean(data.isRead),
          actor: actorObj,
          timeAgo: formatTimeAgo(data.createdAt)
        });
      });

      // Sort newest notifications first (by createdAt ISO string descending)
      items.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });

      onNotificationsUpdate(items);
    },
    (error) => {
      console.warn(`Notifications subscription note for user ${recipientUid}:`, error);
      if (onError) onError(error);
    }
  );

  return unsubscribe;
}

/**
 * Mark a single notification as read in Firestore
 */
export async function markNotificationAsRead(
  recipientUid: string,
  notificationId: string
): Promise<void> {
  if (!recipientUid || !notificationId) return;

  const docRef = doc(db, 'users', recipientUid, 'notifications', notificationId);
  try {
    await updateDoc(docRef, { isRead: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${recipientUid}/notifications/${notificationId}`);
    throw error;
  }
}

/**
 * Mark a notification as unread in Firestore
 */
export async function markNotificationAsUnread(
  recipientUid: string,
  notificationId: string
): Promise<void> {
  if (!recipientUid || !notificationId) return;

  const docRef = doc(db, 'users', recipientUid, 'notifications', notificationId);
  try {
    await updateDoc(docRef, { isRead: false });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${recipientUid}/notifications/${notificationId}`);
    throw error;
  }
}

/**
 * Mark all unread notifications as read for a recipient user
 */
export async function markAllNotificationsAsRead(
  recipientUid: string,
  unreadNotifications: AppNotification[]
): Promise<void> {
  if (!recipientUid || unreadNotifications.length === 0) return;

  try {
    const batch = writeBatch(db);
    unreadNotifications.forEach((n) => {
      const docRef = doc(db, 'users', recipientUid, 'notifications', n.notificationId);
      batch.update(docRef, { isRead: true });
    });
    await batch.commit();
  } catch (error) {
    console.error('Error batch updating notifications as read:', error);
    // Fallback: parallel updates if batch fails
    await Promise.allSettled(
      unreadNotifications.map((n) =>
        updateDoc(doc(db, 'users', recipientUid, 'notifications', n.notificationId), { isRead: true })
      )
    );
  }
}

/**
 * Delete a notification document
 */
export async function deleteFirestoreNotification(
  recipientUid: string,
  notificationId: string
): Promise<void> {
  if (!recipientUid || !notificationId) return;

  const docRef = doc(db, 'users', recipientUid, 'notifications', notificationId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `users/${recipientUid}/notifications/${notificationId}`);
    throw error;
  }
}
