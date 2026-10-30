import { 
  db, 
  auth, 
  doc, 
  setDoc, 
  updateDoc, 
  getDoc,
  collection, 
  onSnapshot, 
  query, 
  where,
  handleFirestoreError, 
  OperationType 
} from './firebase';
import { User, ChatMessage, ChatConversation } from '../types/bharatConnect';

/**
 * Returns a deterministic chat ID for two users.
 * Example: 'uidA_uidB' where IDs are alphabetically sorted.
 */
export function getDeterministicChatId(uid1: string, uid2: string): string {
  return [uid1, uid2].sort().join('_');
}

/**
 * Retrieves existing chat or initializes a new chat document in Firestore.
 */
export async function getOrCreateChat(
  currentUser: User,
  recipientUser: User
): Promise<string> {
  const currentUid = currentUser.uid || currentUser.id || auth.currentUser?.uid;
  const recipientUid = recipientUser.uid || recipientUser.id;

  if (!currentUid || !recipientUid) {
    throw new Error('चैट शुरू करने के लिए दोनों उपयोगकर्ताओं की आईडी आवश्यक है।');
  }

  if (currentUid === recipientUid) {
    throw new Error('आप स्वयं को संदेश नहीं भेज सकते।');
  }

  const chatId = getDeterministicChatId(currentUid, recipientUid);
  const chatRef = doc(db, 'chats', chatId);

  try {
    const chatSnap = await getDoc(chatRef);
    if (!chatSnap.exists()) {
      const nowIso = new Date().toISOString();
      const currentAvatar = currentUser.photoURL || currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';
      const recipientAvatar = recipientUser.photoURL || recipientUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';

      const newChatData: ChatConversation = {
        chatId,
        participants: [currentUid, recipientUid],
        participantProfiles: {
          [currentUid]: {
            uid: currentUid,
            name: currentUser.fullName || currentUser.name || 'उपयोगकर्ता',
            avatar: currentAvatar,
            handle: currentUser.handle || `@user`
          },
          [recipientUid]: {
            uid: recipientUid,
            name: recipientUser.fullName || recipientUser.name || 'क्रिएटर',
            avatar: recipientAvatar,
            handle: recipientUser.handle || `@creator`
          }
        },
        lastMessage: 'बातचीत शुरू हुई',
        lastMessageTimestamp: nowIso,
        lastSenderUid: currentUid,
        updatedAt: nowIso
      };

      await setDoc(chatRef, newChatData);
    }
    return chatId;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `chats/${chatId}`);
    throw error;
  }
}

/**
 * Sends a message in a conversation.
 * Creates document in `chats/{chatId}/messages/{messageId}` and updates chat metadata.
 */
export async function sendChatMessage(
  chatId: string,
  text: string,
  currentUser: User,
  mediaOptions?: { mediaUrl?: string; audioUrl?: string; audioDuration?: string }
): Promise<ChatMessage> {
  const currentUid = currentUser.uid || currentUser.id || auth.currentUser?.uid;
  if (!currentUid) {
    throw new Error('संदेश भेजने के लिए लॉगिन करें।');
  }

  const trimmedText = text.trim();
  const hasMedia = Boolean(mediaOptions?.mediaUrl || mediaOptions?.audioUrl);
  if (!trimmedText && !hasMedia) {
    throw new Error('संदेश खाली नहीं हो सकता।');
  }

  const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const nowIso = new Date().toISOString();
  const senderAvatar = currentUser.photoURL || currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';
  const senderName = currentUser.fullName || currentUser.name || 'उपयोगकर्ता';

  const defaultSummaryText = mediaOptions?.audioUrl 
    ? '🎤 वॉयस संदेश' 
    : mediaOptions?.mediaUrl 
    ? '📷 फोटो' 
    : trimmedText;

  const messagePayload: ChatMessage = {
    id: messageId,
    chatId,
    senderUid: currentUid,
    senderName,
    senderAvatar,
    text: trimmedText || defaultSummaryText,
    createdAt: nowIso,
    mediaUrl: mediaOptions?.mediaUrl,
    audioUrl: mediaOptions?.audioUrl,
    audioDuration: mediaOptions?.audioDuration
  };

  const messagePath = `chats/${chatId}/messages/${messageId}`;
  try {
    // 1. Write message document to subcollection
    await setDoc(doc(db, 'chats', chatId, 'messages', messageId), messagePayload);

    // 2. Update chat metadata (last message, timestamp, last sender)
    try {
      await updateDoc(doc(db, 'chats', chatId), {
        lastMessage: trimmedText || defaultSummaryText,
        lastMessageTimestamp: nowIso,
        lastSenderUid: currentUid,
        updatedAt: nowIso
      });
    } catch (e) {
      console.warn('Chat metadata update warning:', e);
    }

    return messagePayload;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, messagePath);
    throw error;
  }
}

/**
 * Subscribes in real-time to messages in `chats/{chatId}/messages`.
 * Returns the unsubscribe cleanup function.
 */
export function subscribeToChatMessages(
  chatId: string,
  onMessagesUpdate: (messages: ChatMessage[]) => void,
  onError?: (error: Error) => void
): () => void {
  if (!chatId) {
    onMessagesUpdate([]);
    return () => {};
  }

  const messagesColRef = collection(db, 'chats', chatId, 'messages');

  const unsubscribe = onSnapshot(
    messagesColRef,
    (snapshot) => {
      const messagesList: ChatMessage[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as ChatMessage;
        messagesList.push({
          ...data,
          id: data.id || docSnap.id,
          chatId: data.chatId || chatId
        });
      });

      // Sort chronological: oldest first so latest message appears at bottom
      messagesList.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeA - timeB;
      });

      onMessagesUpdate(messagesList);
    },
    (error) => {
      console.warn(`Messages subscription note for chat ${chatId}:`, error);
      if (onError) onError(error);
    }
  );

  return unsubscribe;
}

/**
 * Subscribes to all active conversations involving a user.
 */
export function subscribeToUserChats(
  userUid: string,
  onChatsUpdate: (chats: ChatConversation[]) => void,
  onError?: (error: Error) => void
): () => void {
  if (!userUid) {
    onChatsUpdate([]);
    return () => {};
  }

  const q = query(
    collection(db, 'chats'),
    where('participants', 'array-contains', userUid)
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const chatsList: ChatConversation[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as ChatConversation;
        chatsList.push({
          ...data,
          chatId: data.chatId || docSnap.id
        });
      });

      // Sort latest active chats first
      chatsList.sort((a, b) => {
        const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return timeB - timeA;
      });

      onChatsUpdate(chatsList);
    },
    (error) => {
      console.warn(`Chats list subscription note:`, error);
      if (onError) onError(error);
    }
  );

  return unsubscribe;
}
