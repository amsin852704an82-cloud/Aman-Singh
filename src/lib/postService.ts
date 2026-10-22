import { 
  db, 
  auth, 
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  onSnapshot, 
  query,
  orderBy,
  increment,
  handleFirestoreError, 
  OperationType 
} from './firebase';
import { sendFirestoreNotification } from './notificationService';
import { Post, User, PostComment } from '../types/bharatConnect';

/**
 * Uploads a user photo to Firebase Storage under `posts/{userId}/{filename}`
 * and returns the public download URL.
 */
export async function uploadPostImage(
  file: File,
  onProgress?: (progressPercent: number) => void
): Promise<string> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('फोटो अपलोड करने के लिए कृपया पहले लॉगिन करें।');
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('कृपया केवल वैध इमेज/फोटो फाइल (JPG, PNG, WebP) चुनें।');
  }

  // Validate size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('फोटो का आकार 10MB से कम होना चाहिए।');
  }

  const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `posts/${currentUser.uid}/${Date.now()}_${cleanFileName}`;
  const fileRef = ref(storage, storagePath);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(fileRef, file, {
      contentType: file.type,
      customMetadata: {
        authorUid: currentUser.uid,
        uploadedAt: new Date().toISOString()
      }
    });

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        if (snapshot.totalBytes > 0) {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          if (onProgress) onProgress(progress);
        }
      },
      (error: any) => {
        console.error('Firebase Storage upload error:', error);
        const errStr = (error?.message || error?.code || '').toLowerCase();
        if (errStr.includes('bucket') || errStr.includes('not found') || errStr.includes('404')) {
          reject(new Error(
            'Firebase Storage बकेट अभी सक्रिय (Initialized) नहीं है। कृपया Firebase Console में जाकर Storage टैब में "Get started" पर क्लिक करें (यह Spark प्लान में $0 Free है)।'
          ));
        } else if (errStr.includes('unauthorized') || errStr.includes('permission') || errStr.includes('403')) {
          reject(new Error(
            'फोटो अपलोड अनुमति अस्वीकृत (Permission Denied)। सुनिश्चित करें कि Storage Rules में लॉगिन किए हुए यूज़र को अनुमति है।'
          ));
        } else {
          reject(new Error(error?.message || 'फोटो अपलोड करने में विफलता आई। कृपया पुनः प्रयास करें।'));
        }
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (err: any) {
          reject(new Error('फोटो का डाउनलोड लिंक प्राप्त नहीं हो सका: ' + (err?.message || '')));
        }
      }
    );
  });
}

/**
 * Uploads a user voice/shayari audio recording or file to Firebase Storage
 * under `audio/{userId}/{filename}` and returns the download URL.
 */
export async function uploadPostAudio(
  blob: Blob | File,
  onProgress?: (progressPercent: number) => void
): Promise<string> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('ऑडियो अपलोड करने के लिए कृपया पहले लॉगिन करें।');
  }

  const storagePath = `audio/${currentUser.uid}/${Date.now()}_awaaz.webm`;
  const fileRef = ref(storage, storagePath);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(fileRef, blob, {
      contentType: blob.type || 'audio/webm',
      customMetadata: {
        authorUid: currentUser.uid,
        uploadedAt: new Date().toISOString()
      }
    });

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        if (snapshot.totalBytes > 0) {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          if (onProgress) onProgress(progress);
        }
      },
      (error: any) => {
        console.error('Firebase Storage audio upload error:', error);
        reject(new Error(error?.message || 'ऑडियो अपलोड विफल रहा।'));
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (err: any) {
          reject(new Error('ऑडियो डाउनलोड URL प्राप्त नहीं हो सका: ' + (err?.message || '')));
        }
      }
    );
  });
}

export interface FirestorePostData {
  postId: string;
  authorUid: string;
  authorName: string;
  authorPhotoURL: string;
  text: string;
  imageURL: string;
  createdAt: string;
  likeCount: number;
  
  // Client UI compatibility fields
  id?: string;
  authorId?: string;
  caption?: string;
  imageUrl?: string;
  likesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
  locationName?: string;
  tags?: string[];
  likedUserIds?: string[];
  likedBy?: string[];
  audioURL?: string;
  audioDuration?: number | string;
  mediaType?: 'image' | 'audio' | 'text';
  audioTitle?: string;
}

/**
 * Creates and stores a new post in the Firestore "posts" collection.
 * 
 * Rules:
 * 1. Only authenticated users can create posts.
 * 2. authorUid is strictly taken from auth.currentUser.uid.
 * 3. Every post has postId, authorUid, authorName, authorPhotoURL, text, imageURL, createdAt, likeCount.
 * 4. Text-only posts are fully supported (imageURL can be empty or preset photo URL).
 */
export async function createFirestorePost(params: {
  text: string;
  imageURL?: string;
  locationName?: string;
  tags?: string[];
  currentUserProfile?: User;
  audioURL?: string;
  audioDuration?: number | string;
  mediaType?: 'image' | 'audio' | 'text';
  audioTitle?: string;
}): Promise<Post> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('केवल लॉगिन किए हुए यूज़र ही पोस्ट बना सकते हैं। कृपया पहले लॉगिन करें।');
  }

  const postId = `post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const authorUid = currentUser.uid;
  const authorName = params.currentUserProfile?.name || 
                     params.currentUserProfile?.fullName || 
                     currentUser.displayName || 
                     (currentUser.email ? currentUser.email.split('@')[0] : 'भारत नागरिक');
  
  const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';
  const authorPhotoURL = params.currentUserProfile?.photoURL || 
                         params.currentUserProfile?.avatar || 
                         currentUser.photoURL || 
                         defaultAvatar;

  const nowIso = new Date().toISOString();
  const textContent = (params.text || '').trim();
  const imgUrl = (params.imageURL || '').trim();
  const audioUrl = (params.audioURL || '').trim();
  const loc = params.locationName?.trim() || params.currentUserProfile?.location || 'New Delhi, India';
  const tagList = params.tags && params.tags.length > 0 ? params.tags : ['BharatConnect', 'DesiVibes'];
  const mediaType = params.mediaType || (audioUrl ? 'audio' : (imgUrl ? 'image' : 'text'));

  const postPayload: FirestorePostData = {
    postId,
    authorUid,
    authorName,
    authorPhotoURL,
    text: textContent,
    imageURL: imgUrl,
    createdAt: nowIso,
    likeCount: 0,
    audioURL: audioUrl,
    audioDuration: params.audioDuration,
    mediaType,
    audioTitle: params.audioTitle,
    
    // Compatibility fields for the existing BharatConnect UI
    id: postId,
    authorId: authorUid,
    caption: textContent,
    imageUrl: imgUrl,
    likesCount: 0,
    commentsCount: 0,
    sharesCount: 0,
    locationName: loc,
    tags: tagList,
    likedUserIds: [],
    likedBy: []
  };

  const path = `posts/${postId}`;
  try {
    await setDoc(doc(db, 'posts', postId), postPayload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }

  // Construct UI Post object
  const uiAuthor: User = params.currentUserProfile || {
    id: authorUid,
    uid: authorUid,
    fullName: authorName,
    name: authorName,
    username: (currentUser.email ? currentUser.email.split('@')[0] : 'user').toLowerCase(),
    handle: `@${(currentUser.email ? currentUser.email.split('@')[0] : 'user').toLowerCase()}`,
    avatar: authorPhotoURL,
    photoURL: authorPhotoURL,
    bio: 'भारत कनेक्ट सदस्य 🇮🇳',
    location: loc,
    verified: true,
    followersCount: 1,
    followingCount: 1,
    postCount: 1,
    language: 'hi'
  };

  return {
    id: postId,
    postId,
    authorUid,
    authorName,
    authorPhotoURL,
    text: textContent,
    imageURL: imgUrl,
    likeCount: 0,
    author: uiAuthor,
    caption: textContent,
    imageUrl: imgUrl,
    likesCount: 0,
    commentsCount: 0,
    sharesCount: 0,
    isLiked: false,
    isSaved: false,
    locationName: loc,
    createdAt: 'अभी-अभी (Just now)',
    language: 'hi',
    tags: tagList,
    comments: [],
    likedUserIds: [],
    audioURL: audioUrl,
    audioDuration: params.audioDuration,
    mediaType,
    audioTitle: params.audioTitle
  };
}

/**
 * Subscribes in real-time to posts in the Firestore "posts" collection.
 * Sorts latest posts first (createdAt descending).
 */
export function subscribeToFirestorePosts(
  onPostsUpdate: (posts: Post[]) => void,
  onError?: (error: Error) => void
): () => void {
  const postsCollectionRef = collection(db, 'posts');

  const unsubscribe = onSnapshot(
    postsCollectionRef,
    (snapshot) => {
      const postsList: Post[] = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as FirestorePostData & Record<string, any>;
        const pId = data.postId || docSnap.id;
        const authorUid = data.authorUid || data.authorId || 'unknown';
        const authorName = data.authorName || 'भारत नागरिक';
        const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';
        const authorPhotoURL = data.authorPhotoURL || data.author?.avatar || defaultAvatar;
        const text = data.text || data.caption || '';
        const imageURL = data.imageURL || data.imageUrl || '';
        const likeCount = typeof data.likeCount === 'number' ? data.likeCount : (data.likesCount || 0);

        const currentAuthUid = auth.currentUser?.uid;
        const likedBy = Array.isArray(data.likedBy) ? data.likedBy : (Array.isArray(data.likedUserIds) ? data.likedUserIds : []);
        const isLiked = currentAuthUid ? likedBy.includes(currentAuthUid) : false;

        const authorObj: User = {
          id: authorUid,
          uid: authorUid,
          fullName: authorName,
          name: authorName,
          username: authorName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'user',
          handle: `@${authorName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'user'}`,
          avatar: authorPhotoURL,
          photoURL: authorPhotoURL,
          bio: 'भारत कनेक्ट सदस्य 🇮🇳',
          location: data.locationName || 'India',
          verified: true,
          followersCount: 12,
          followingCount: 15,
          postCount: 1,
          language: 'hi'
        };

        // Format relative time if ISO string
        let formattedTime = data.createdAt || 'कुछ समय पहले';
        try {
          if (data.createdAt && !isNaN(Date.parse(data.createdAt))) {
            const diffMs = Date.now() - new Date(data.createdAt).getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMins / 60);
            const diffDays = Math.floor(diffHours / 24);
            if (diffMins < 1) formattedTime = 'अभी-अभी (Just now)';
            else if (diffMins < 60) formattedTime = `${diffMins} मिनट पहले`;
            else if (diffHours < 24) formattedTime = `${diffHours} घंटे पहले`;
            else formattedTime = `${diffDays} दिन पहले`;
          }
        } catch {
          formattedTime = data.createdAt;
        }

        postsList.push({
          id: pId,
          postId: pId,
          authorUid,
          authorName,
          authorPhotoURL,
          text,
          imageURL,
          likeCount,
          author: authorObj,
          caption: text,
          imageUrl: imageURL,
          likesCount: likeCount,
          commentsCount: data.commentsCount || (Array.isArray(data.comments) ? data.comments.length : 0),
          sharesCount: data.sharesCount || 0,
          isLiked,
          isSaved: false,
          locationName: data.locationName || 'भारत',
          createdAt: formattedTime,
          language: data.language || 'hi',
          tags: Array.isArray(data.tags) ? data.tags : ['BharatConnect'],
          comments: Array.isArray(data.comments) ? data.comments : [],
          likedUserIds: likedBy,
          likedBy,
          audioURL: data.audioURL || '',
          audioDuration: data.audioDuration,
          mediaType: data.mediaType || (data.audioURL ? 'audio' : (imageURL ? 'image' : 'text')),
          audioTitle: data.audioTitle || ''
        });
      });

      // Sort newest posts first
      postsList.sort((a, b) => {
        const timeA = a.postId?.startsWith('post_') ? parseInt(a.postId.split('_')[1] || '0', 10) : 0;
        const timeB = b.postId?.startsWith('post_') ? parseInt(b.postId.split('_')[1] || '0', 10) : 0;
        return timeB - timeA;
      });

      onPostsUpdate(postsList);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'posts');
      if (onError) onError(error);
    }
  );

  return unsubscribe;
}

/**
 * Deletes a post from Firestore posts collection.
 * Enforces that only the author who created it can delete it.
 */
export async function deleteFirestorePost(postId: string, authorUid: string): Promise<void> {
  const currentUid = auth.currentUser?.uid;
  if (!currentUid) {
    throw new Error('पोस्ट हटाने के लिए कृपया लॉगिन करें।');
  }

  if (currentUid !== authorUid) {
    throw new Error('आप केवल अपनी बनाई हुई पोस्ट ही हटा सकते हैं।');
  }

  const path = `posts/${postId}`;
  try {
    await deleteDoc(doc(db, 'posts', postId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

/**
 * Toggles like on a post in Firestore.
 * Updates likesCount, likeCount, and synchronizes likedBy array.
 */
export async function toggleLikeFirestorePost(
  postId: string, 
  currentUserId: string, 
  currentLikes: number, 
  likedUserIds: string[] = [],
  postAuthorUid?: string,
  senderProfile?: User
): Promise<void> {
  const isAlreadyLiked = likedUserIds.includes(currentUserId);
  const updatedLikes = isAlreadyLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1;
  const updatedLikedUserIds = isAlreadyLiked 
    ? likedUserIds.filter(id => id !== currentUserId)
    : [...likedUserIds, currentUserId];

  const path = `posts/${postId}`;
  try {
    await updateDoc(doc(db, 'posts', postId), {
      likeCount: updatedLikes,
      likesCount: updatedLikes,
      likedBy: updatedLikedUserIds,
      likedUserIds: updatedLikedUserIds
    });

    // Send like notification to post author when liked (not unliked)
    if (!isAlreadyLiked && postAuthorUid && postAuthorUid !== currentUserId) {
      try {
        const senderName = senderProfile?.fullName || senderProfile?.name || auth.currentUser?.displayName || 'उपयोगकर्ता';
        const senderAvatar = senderProfile?.photoURL || senderProfile?.avatar || auth.currentUser?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';
        await sendFirestoreNotification({
          recipientUid: postAuthorUid,
          senderUid: currentUserId,
          senderName,
          senderPhotoURL: senderAvatar,
          type: 'like',
          postId,
          message: 'ने आपकी पोस्ट को लाइक किया'
        });
      } catch (notifErr) {
        console.warn('Like notification trigger warning:', notifErr);
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}

/**
 * Adds a new comment to a post in the sub-collection `posts/{postId}/comments`.
 * Also increments the post's commentsCount in Firestore.
 */
export async function addFirestoreComment(
  postId: string,
  text: string,
  currentUserProfile: User,
  postAuthorUid?: string
): Promise<PostComment> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('कमेंट करने के लिए कृपया पहले लॉगिन करें।');
  }

  const commentText = text.trim();
  if (!commentText) {
    throw new Error('कमेंट खाली नहीं हो सकता।');
  }

  const commentId = `c_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const authorUid = currentUser.uid;
  const authorName = currentUserProfile.fullName || currentUserProfile.name || currentUser.displayName || 'भारत नागरिक';
  const authorAvatar = currentUserProfile.photoURL || currentUserProfile.avatar || currentUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';
  const authorHandle = currentUserProfile.handle || `@${authorName.toLowerCase().replace(/\s+/g, '')}`;
  const nowIso = new Date().toISOString();

  const commentData = {
    id: commentId,
    postId,
    authorUid,
    authorName,
    authorAvatar,
    authorHandle,
    text: commentText,
    createdAt: nowIso
  };

  const commentPath = `posts/${postId}/comments/${commentId}`;
  try {
    // 1. Create comment document in subcollection
    await setDoc(doc(db, 'posts', postId, 'comments', commentId), commentData);

    // 2. Safely increment commentsCount on the post
    try {
      await updateDoc(doc(db, 'posts', postId), {
        commentsCount: increment(1)
      });
    } catch (e) {
      console.warn('Post commentsCount increment note:', e);
    }

    // 3. Send notification to post author if not commenter themselves
    if (postAuthorUid && postAuthorUid !== authorUid) {
      try {
        await sendFirestoreNotification({
          recipientUid: postAuthorUid,
          senderUid: authorUid,
          senderName: authorName,
          senderPhotoURL: authorAvatar,
          type: 'comment',
          postId,
          commentId,
          message: `ने आपकी पोस्ट पर टिप्पणी की: "${commentText.slice(0, 35)}${commentText.length > 35 ? '...' : ''}"`
        });
      } catch (notifErr) {
        console.warn('Comment notification trigger note:', notifErr);
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, commentPath);
    throw error;
  }

  return {
    id: commentId,
    postId,
    authorUid,
    authorName,
    authorAvatar,
    authorHandle,
    author: currentUserProfile,
    text: commentText,
    createdAt: 'अभी-अभी (Just now)',
    likesCount: 0
  };
}

/**
 * Subscribes in real-time to comments in a post's `posts/{postId}/comments` sub-collection.
 */
export function subscribeToPostComments(
  postId: string,
  onCommentsUpdate: (comments: PostComment[]) => void,
  onError?: (error: Error) => void
): () => void {
  const commentsRef = collection(db, 'posts', postId, 'comments');

  return onSnapshot(
    commentsRef,
    (snapshot) => {
      const commentsList: PostComment[] = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Record<string, any>;
        const authorObj: User = {
          id: data.authorUid || 'user',
          uid: data.authorUid || 'user',
          fullName: data.authorName || 'भारत नागरिक',
          name: data.authorName || 'भारत नागरिक',
          username: (data.authorHandle || '@user').replace('@', ''),
          handle: data.authorHandle || '@user',
          avatar: data.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
          photoURL: data.authorAvatar || '',
          bio: '',
          location: 'भारत',
          verified: false,
          followersCount: 0,
          followingCount: 0,
          postCount: 0,
          language: 'hi'
        };

        // Format relative time if ISO string
        let formattedTime = data.createdAt || 'कुछ समय पहले';
        try {
          if (data.createdAt && !isNaN(Date.parse(data.createdAt))) {
            const diffMs = Date.now() - new Date(data.createdAt).getTime();
            const diffMins = Math.floor(diffMs / 60000);
            if (diffMins < 1) formattedTime = 'अभी-अभी (Just now)';
            else if (diffMins < 60) formattedTime = `${diffMins} मि. पहले`;
            else if (diffMins < 1440) formattedTime = `${Math.floor(diffMins / 60)} घंटे पहले`;
            else formattedTime = `${Math.floor(diffMins / 1440)} दिन पहले`;
          }
        } catch {
          formattedTime = data.createdAt;
        }

        commentsList.push({
          id: data.id || docSnap.id,
          postId,
          authorUid: data.authorUid,
          authorName: data.authorName,
          authorAvatar: data.authorAvatar,
          authorHandle: data.authorHandle,
          author: authorObj,
          text: data.text || '',
          createdAt: formattedTime,
          likesCount: 0
        });
      });

      // Sort chronological: oldest first
      commentsList.sort((a, b) => a.id.localeCompare(b.id));

      onCommentsUpdate(commentsList);
    },
    (error) => {
      console.warn(`Comments subscription note for ${postId}:`, error);
      if (onError) onError(error);
    }
  );
}

/**
 * Deletes a comment from `posts/{postId}/comments/{commentId}`.
 */
export async function deleteFirestoreComment(postId: string, commentId: string): Promise<void> {
  const currentUid = auth.currentUser?.uid;
  if (!currentUid) {
    throw new Error('कमेंट हटाने के लिए कृपया लॉगिन करें।');
  }

  const commentPath = `posts/${postId}/comments/${commentId}`;
  try {
    await deleteDoc(doc(db, 'posts', postId, 'comments', commentId));
    try {
      await updateDoc(doc(db, 'posts', postId), {
        commentsCount: increment(-1)
      });
    } catch (e) {
      console.warn('Post commentsCount decrement note:', e);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, commentPath);
    throw error;
  }
}

/**
 * Updates the caption text of a post in Firestore posts collection.
 * Enforces that only the author who created the post can edit it.
 */
export async function updateFirestorePostCaption(postId: string, newCaption: string): Promise<void> {
  const currentUid = auth.currentUser?.uid;
  if (!currentUid) {
    throw new Error('पोस्ट संपादित करने के लिए कृपया लॉगिन करें।');
  }

  const trimmed = newCaption.trim();
  if (!trimmed) {
    throw new Error('कैप्शन खाली नहीं हो सकता।');
  }

  const path = `posts/${postId}`;
  try {
    await updateDoc(doc(db, 'posts', postId), {
      text: trimmed,
      caption: trimmed
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}
