import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  Post, 
  PostComment,
  Story, 
  Reel, 
  AppNotification, 
  ReportTicket, 
  LanguageCode, 
  MainTab 
} from '../types/bharatConnect';
import { 
  INITIAL_USERS, 
  INITIAL_POSTS, 
  INITIAL_STORIES, 
  INITIAL_REELS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_REPORTS, 
  CURRENT_USER 
} from '../data/bharatConnectData';
import { TRANSLATIONS, Translations } from '../data/translations';
import { 
  auth, 
  db, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  signOut, 
  onAuthStateChanged, 
  updateFirebaseAuthProfile,
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  FirebaseUser 
} from '../lib/firebase';
import { saveOrUpdateUserProfile } from '../lib/userProfileService';
import { 
  validateUsernameFormat, 
  checkUsernameAvailability, 
  claimUsernameTransaction 
} from '../lib/usernameService';
import { 
  createFirestorePost, 
  subscribeToFirestorePosts, 
  deleteFirestorePost, 
  updateFirestorePostCaption,
  toggleLikeFirestorePost,
  addFirestoreComment
} from '../lib/postService';
import { 
  followUserInFirestore, 
  unfollowUserInFirestore, 
  subscribeToUserFollowings 
} from '../lib/followService';
import { 
  subscribeToUserNotifications, 
  markNotificationAsRead, 
  markNotificationAsUnread, 
  markAllNotificationsAsRead, 
  deleteFirestoreNotification 
} from '../lib/notificationService';

interface BharatConnectContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: Translations;
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  currentUser: User;
  users: User[];
  posts: Post[];
  stories: Story[];
  reels: Reel[];
  notifications: AppNotification[];
  reports: ReportTicket[];
  blockedUserIds: string[];
  isPhoneFrame: boolean;
  setIsPhoneFrame: (val: boolean | ((prev: boolean) => boolean)) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (val: boolean) => void;
  isSOSModalOpen: boolean;
  setIsSOSModalOpen: (val: boolean) => void;
  openSOSModal: () => void;
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
  
  // Firebase Auth State
  firebaseUser: FirebaseUser | null;
  isFirebaseAuthLoggedIn: boolean;
  isAuthLoading: boolean;
  signUpWithFirebase: (email: string, pass: string, fullName: string, username: string) => Promise<{ success: boolean; error?: string }>;
  loginWithFirebase: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  sendPasswordResetWithFirebase: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  logoutWithFirebase: () => Promise<void>;

  // Notifications System State & Actions
  unreadNotificationsCount: number;
  isNotificationsLoading: boolean;
  markNotificationRead: (notificationId: string) => Promise<void>;
  markNotificationUnread: (notificationId: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  deleteNotificationItem: (notificationId: string) => Promise<void>;

  // Instagram Follow System State & Actions
  followingIds: string[];
  viewingUser: User | null;
  setViewingUser: (user: User | null) => void;
  openUserProfile: (user: User) => void;
  toggleFollowUser: (target: string | User) => Promise<void>;

  // Other Actions
  toggleLikePost: (postId: string) => void;
  toggleSavePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  createPost: (
    caption: string, 
    imageUrl: string, 
    locationName: string, 
    tags: string[], 
    audioOptions?: { audioURL: string; audioDuration?: number | string; audioTitle?: string },
    isAnonymous?: boolean
  ) => Promise<boolean>;
  deletePost: (postId: string) => void;
  updatePostCaption: (postId: string, newCaption: string) => Promise<boolean>;
  toggleLikeReel: (reelId: string) => void;
  reportContent: (reportedUserId: string, reason: string, details?: string, postId?: string) => void;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  updateProfile: (fullName: string, bio: string, location: string, avatar?: string, newUsername?: string) => Promise<boolean> | void;
  resolveReport: (reportId: string, action: 'dismissed' | 'resolved') => void;
  loginAs: (user: User) => void;
  logout: () => void;
}

const BharatConnectContext = createContext<BharatConnectContextType | null>(null);

export const BharatConnectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageCode>('hi'); // Default Hindi
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      return (localStorage.getItem('bc_theme') as 'dark' | 'light') || 'dark';
    } catch {
      return 'dark';
    }
  });

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('bc_theme', next);
      } catch {}
      return next;
    });
  };

  useEffect(() => {
    try {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        document.body.classList.add('bg-slate-950', 'text-slate-100');
        document.body.classList.remove('bg-slate-50', 'text-slate-900');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
        document.body.classList.add('bg-slate-50', 'text-slate-900');
        document.body.classList.remove('bg-slate-950', 'text-slate-100');
      }
    } catch {}
  }, [theme]);
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [reels, setReels] = useState<Reel[]>(INITIAL_REELS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [reports, setReports] = useState<ReportTicket[]>(INITIAL_REPORTS);
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);
  const openSOSModal = () => setIsSOSModalOpen(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Firebase auth state
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Instagram-style Following & User Profile State
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [viewingUser, setViewingUser] = useState<User | null>(null);

  const openUserProfile = (u: User) => {
    setViewingUser(u);
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.hi;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 4500);
  };

  // Sync Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      setIsAuthLoading(false);

      if (user) {
        try {
          const profile = await saveOrUpdateUserProfile(user);
          if (!profile.fullName || profile.fullName.startsWith('as9621302122') || profile.username?.startsWith('as9621302122')) {
            profile.fullName = 'Aman | भारतीय रेल प्रेमी 🇮🇳';
            profile.name = 'Aman | भारतीय रेल प्रेमी 🇮🇳';
            profile.handle = '@railway_shayar_aman';
            profile.username = 'railway_shayar_aman';
            profile.bio = 'Indian Railway & Train Lover ❤️ | Deep Hindi Shayari & Quotes 🚆';
            profile.avatar = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200';
            profile.photoURL = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200';
          }
          setCurrentUser(profile);
          setUsers((prev) => {
            const exists = prev.some((u) => u.id === profile.id);
            return exists ? prev.map((u) => (u.id === profile.id ? profile : u)) : [profile, ...prev];
          });
        } catch (err: any) {
          console.error('Error syncing profile in BharatConnectContext:', err);
          const rawMsg = err instanceof Error ? err.message : String(err);
          showToast(`डेटाबेस त्रुटि: ${rawMsg}`);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Real-time Firestore posts subscription
  useEffect(() => {
    const unsubscribePosts = subscribeToFirestorePosts(
      (firestorePosts) => {
        if (firestorePosts && firestorePosts.length > 0) {
          // Merge real live Firestore posts with community posts so the feed is never empty!
          const firestoreIds = new Set(firestorePosts.map((p) => p.id));
          const communityPosts = INITIAL_POSTS.filter((p) => !firestoreIds.has(p.id));
          setPosts([...firestorePosts, ...communityPosts]);
        } else {
          // If Firestore is empty initially, display initial posts as starting content
          setPosts(INITIAL_POSTS);
        }
      },
      (error) => {
        console.warn('Firestore posts subscription note:', error);
      }
    );

    return () => unsubscribePosts();
  }, []);

  // Real-time Firestore followings subscription (persists follow state across page refresh)
  useEffect(() => {
    if (!firebaseUser) {
      setFollowingIds([]);
      return;
    }

    const unsubscribeFollows = subscribeToUserFollowings(
      firebaseUser.uid,
      (uids) => {
        setFollowingIds(uids);
        setCurrentUser((prev) => ({
          ...prev,
          followingCount: uids.length
        }));
      },
      (error) => {
        console.warn('Firestore followings subscription note:', error);
      }
    );

    return () => unsubscribeFollows();
  }, [firebaseUser]);

  // Notifications loading state
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);

  // Real-time Firestore notifications subscription for recipientUid == firebaseUser.uid
  // Listener cleanup is guaranteed on unmount or when firebaseUser changes
  useEffect(() => {
    if (!firebaseUser) {
      setNotifications(INITIAL_NOTIFICATIONS);
      setIsNotificationsLoading(false);
      return;
    }

    setIsNotificationsLoading(true);
    const unsubscribeNotifs = subscribeToUserNotifications(
      firebaseUser.uid,
      (firestoreNotifs) => {
        setNotifications(firestoreNotifs);
        setIsNotificationsLoading(false);
      },
      (error) => {
        console.warn('Notifications subscription note:', error);
        setIsNotificationsLoading(false);
      }
    );

    return () => unsubscribeNotifs();
  }, [firebaseUser]);

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  const markNotificationRead = async (notificationId: string) => {
    // Optimistic UI update
    setNotifications((prev) =>
      prev.map((n) => (n.notificationId === notificationId || n.id === notificationId ? { ...n, isRead: true } : n))
    );

    if (firebaseUser) {
      try {
        await markNotificationAsRead(firebaseUser.uid, notificationId);
      } catch (err) {
        console.warn('Error marking notification as read in Firestore:', err);
      }
    }
  };

  const markNotificationUnread = async (notificationId: string) => {
    // Optimistic UI update
    setNotifications((prev) =>
      prev.map((n) => (n.notificationId === notificationId || n.id === notificationId ? { ...n, isRead: false } : n))
    );

    if (firebaseUser) {
      try {
        await markNotificationAsUnread(firebaseUser.uid, notificationId);
      } catch (err) {
        console.warn('Error marking notification as unread in Firestore:', err);
      }
    }
  };

  const markAllNotificationsRead = async () => {
    const unreadList = notifications.filter((n) => !n.isRead);
    if (unreadList.length === 0) return;

    // Optimistic UI update
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('सभी सूचनाएं पढ़ी गईं (All marked as read)');

    if (firebaseUser) {
      try {
        await markAllNotificationsAsRead(firebaseUser.uid, unreadList);
      } catch (err) {
        console.warn('Error batch marking notifications as read:', err);
      }
    }
  };

  const deleteNotificationItem = async (notificationId: string) => {
    // Optimistic UI removal
    setNotifications((prev) =>
      prev.filter((n) => n.notificationId !== notificationId && n.id !== notificationId)
    );
    showToast('सूचना हटा दी गई (Notification Removed)');

    if (firebaseUser) {
      try {
        await deleteFirestoreNotification(firebaseUser.uid, notificationId);
      } catch (err) {
        console.warn('Error deleting notification from Firestore:', err);
      }
    }
  };

  // Firebase Sign Up with Email and Password
  const signUpWithFirebase = async (
    email: string, 
    pass: string, 
    fullName: string, 
    username: string
  ): Promise<{ success: boolean; error?: string }> => {
    // 1. Validate Username Format
    const val = validateUsernameFormat(username);
    if (!val.valid) {
      return { success: false, error: val.error };
    }

    // 2. Check Username Uniqueness in Firestore
    const availability = await checkUsernameAvailability(val.cleanUsername);
    if (!availability.available) {
      return { success: false, error: availability.message };
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      const user = cred.user;

      // Update auth profile
      await updateFirebaseAuthProfile(user, {
        displayName: fullName.trim(),
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
      });

      // Save user profile in Firestore users collection using UID as document ID
      const userProfile = await saveOrUpdateUserProfile(user, {
        name: fullName.trim(),
        username: val.cleanUsername
      });

      setCurrentUser(userProfile);
      setUsers((prev) => [userProfile, ...prev]);

      setIsAuthModalOpen(false);
      showToast(`स्वागत है, ${fullName}! आपका Firebase खाता तैयार है।`);
      return { success: true };
    } catch (err: any) {
      let friendlyError = 'साइन अप विफल रहा। कृपया पुनः प्रयास करें।';
      if (err.code === 'auth/email-already-in-use') {
        friendlyError = 'यह ईमेल पहले से पंजीकृत है। कृपया लॉगिन करें।';
      } else if (err.code === 'auth/weak-password') {
        friendlyError = 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।';
      } else if (err.code === 'auth/invalid-email') {
        friendlyError = 'कृपया एक मान्य ईमेल पता दर्ज करें।';
      } else if (err.code === 'auth/operation-not-allowed') {
        friendlyError = 'Firebase Console में "Email/Password" साइन-इन विधि चालू होनी चाहिए।';
      } else if (err?.message) {
        friendlyError = err.message;
      }
      return { success: false, error: friendlyError };
    }
  };

  // Send Password Reset Email with Firebase
  const sendPasswordResetWithFirebase = async (
    email: string
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      return { success: false, error: 'कृपया पंजीकृत ईमेल पता दर्ज करें।' };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return { success: false, error: 'कृपया एक मान्य ईमेल पता दर्ज करें।' };
    }

    const genericSuccessMsg = 'यदि यह ईमेल BharatConnect पर पंजीकृत है, तो पासवर्ड रीसेट लिंक भेज दिया गया है। कृपया अपना इनबॉक्स (Inbox) या स्पैम फ़ोल्डर चेक करें।';

    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      return { success: true, message: genericSuccessMsg };
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/user-not-found') {
        return { success: true, message: genericSuccessMsg };
      }
      let error = 'पासवर्ड रीसेट ईमेल नहीं भेजा जा सका।';
      if (code === 'auth/invalid-email') {
        error = 'ईमेल का प्रारूप अमान्य है। कृपया सही ईमेल दर्ज करें।';
      } else if (code === 'auth/too-many-requests') {
        error = 'बहुत अधिक अनुरोध किए गए हैं। कृपया कुछ समय प्रतीक्षा करें और पुनः प्रयास करें।';
      } else if (code === 'auth/network-request-failed') {
        error = 'नेटवर्क कनेक्शन विफल रहा। कृपया अपना इंटरनेट कनेक्शन जांचें।';
      } else if (err?.message) {
        error = err.message;
      }
      return { success: false, error };
    }
  };

  // Firebase Login with Email and Password
  const loginWithFirebase = async (
    email: string, 
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const user = cred.user;

      // Sync and load user profile from Firestore users/{uid}
      const userProfile = await saveOrUpdateUserProfile(user);
      setCurrentUser(userProfile);

      setIsAuthModalOpen(false);
      showToast(`सफलतापूर्वक लॉगिन: ${userProfile.fullName || user.email}`);
      return { success: true };
    } catch (err: any) {
      let friendlyError = 'लॉगिन विफल रहा। कृपया अपनी जानकारी जांचें।';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        friendlyError = 'अमान्य ईमेल या पासवर्ड। कृपया पुनः जांचें।';
      } else if (err.code === 'auth/invalid-email') {
        friendlyError = 'अमान्य ईमेल पता।';
      } else if (err.code === 'auth/operation-not-allowed') {
        friendlyError = 'Firebase Console में Email/Password विकल्प चालू होना चाहिए।';
      } else if (err?.message) {
        friendlyError = err.message;
      }
      return { success: false, error: friendlyError };
    }
  };

  // Firebase Logout
  const logoutWithFirebase = async () => {
    try {
      await signOut(auth);
      setFirebaseUser(null);
      // Revert to demo viewer
      setCurrentUser(INITIAL_USERS[0]);
      showToast('सफलतापूर्वक लॉग आउट हो गया (Logged Out)');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const toggleLikePost = async (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const currentLiked = post.isLiked;
    const nextLiked = !currentLiked;
    const nextLikesCount = Math.max(0, post.likesCount + (nextLiked ? 1 : -1));

    // Optimistic UI update
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            isLiked: nextLiked,
            likesCount: nextLikesCount,
            likeCount: nextLikesCount
          };
        }
        return p;
      })
    );

    // Sync to Firestore if authenticated
    if (firebaseUser) {
      try {
        const postAuthorUid = post.authorUid || post.authorId || post.author?.uid || post.author?.id;
        await toggleLikeFirestorePost(
          postId,
          firebaseUser.uid,
          post.likesCount,
          post.likedUserIds || [],
          postAuthorUid,
          currentUser
        );
      } catch (err) {
        console.warn('Firestore like sync notice:', err);
      }
    }
  };

  const toggleSavePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextSaved = !p.isSaved;
          showToast(nextSaved ? 'पोस्ट सहेजी गई (Post Saved)' : 'पोस्ट हटाई गई (Post Unsaved)');
          return {
            ...p,
            isSaved: nextSaved
          };
        }
        return p;
      })
    );
  };

  const addComment = async (postId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    if (!firebaseUser && !auth.currentUser) {
      showToast('कमेंट करने के लिए कृपया पहले लॉगिन करें।');
      setIsAuthModalOpen(true);
      return;
    }

    const post = posts.find((p) => p.id === postId);
    const isAnonPost = Boolean(post?.isAnonymous);
    const anonAvatar = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&auto=format&fit=crop&q=80';

    const optimisticComment: PostComment = {
      id: `c_${Date.now()}`,
      postId,
      author: isAnonPost ? {
        ...currentUser,
        id: 'anonymous',
        uid: 'anonymous',
        fullName: 'अनाम साथी',
        name: 'अनाम साथी',
        username: 'gupt',
        handle: '@gupt',
        photoURL: anonAvatar,
        avatar: anonAvatar
      } : currentUser,
      authorUid: isAnonPost ? 'anonymous' : (currentUser.uid || currentUser.id),
      authorName: isAnonPost ? 'अनाम साथी' : (currentUser.fullName || currentUser.name),
      authorAvatar: isAnonPost ? anonAvatar : (currentUser.photoURL || currentUser.avatar),
      authorHandle: isAnonPost ? '@gupt' : currentUser.handle,
      text: trimmed,
      createdAt: 'अभी-अभी (Just now)',
      likesCount: 0
    };

    // Optimistically update post's commentsCount and comments list
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...(p.comments || []), optimisticComment]
          };
        }
        return p;
      })
    );

    showToast(isAnonPost ? 'अनाम टिप्पणी पोस्ट की गई (Dil Se)' : 'टिप्पणी पोस्ट की गई (Comment Added)');

    // Save to Firestore sub-collection posts/{postId}/comments
    try {
      const postAuthorUid = isAnonPost ? 'anonymous' : (post?.authorUid || post?.authorId || post?.author?.uid || post?.author?.id);
      await addFirestoreComment(postId, trimmed, currentUser, postAuthorUid, isAnonPost);
    } catch (err: any) {
      console.error('Error saving comment to Firestore subcollection:', err);
      showToast(err?.message || 'कमेंट सेव करने में त्रुटि हुई।');
    }
  };

  const toggleFollowUser = async (target: string | User) => {
    const targetUser = typeof target === 'string'
      ? users.find((u) => u.id === target || u.uid === target) || { id: target, fullName: 'क्रिएटर', name: 'क्रिएटर' }
      : target;

    const targetId = ('uid' in targetUser && targetUser.uid) ? targetUser.uid : targetUser.id;
    const currentUid = firebaseUser?.uid || auth.currentUser?.uid;

    if (!currentUid) {
      showToast('फ़ॉलो करने के लिए कृपया पहले लॉगिन करें।');
      setIsAuthModalOpen(true);
      return;
    }

    // Requirement 5: User cannot follow themselves
    if (currentUid === targetId) {
      showToast('आप स्वयं को फ़ॉलो नहीं कर सकते!');
      return;
    }

    const isCurrentlyFollowing = followingIds.includes(targetId);
    const targetName = targetUser.fullName || targetUser.name || 'क्रिएटर';

    // Optimistic UI updates
    if (isCurrentlyFollowing) {
      setFollowingIds((prev) => prev.filter((id) => id !== targetId));
      setUsers((prev) =>
        prev.map((u) =>
          u.id === targetId || u.uid === targetId
            ? { ...u, isFollowing: false, followersCount: Math.max(0, u.followersCount - 1) }
            : u
        )
      );
      setCurrentUser((prev) => ({
        ...prev,
        followingCount: Math.max(0, prev.followingCount - 1)
      }));
      showToast(`आपने ${targetName} को अनफ़ॉलो किया (Unfollowed)`);
    } else {
      setFollowingIds((prev) => [...prev.filter((id) => id !== targetId), targetId]);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === targetId || u.uid === targetId
            ? { ...u, isFollowing: true, followersCount: u.followersCount + 1 }
            : u
        )
      );
      setCurrentUser((prev) => ({
        ...prev,
        followingCount: prev.followingCount + 1
      }));
      showToast(`आपने ${targetName} को फ़ॉलो किया! (Following)`);
    }

    // Persist to Firestore
    try {
      if (isCurrentlyFollowing) {
        await unfollowUserInFirestore(targetId);
      } else {
        await followUserInFirestore(targetUser);
      }
    } catch (err: any) {
      console.error('Firestore follow toggle error:', err);
      // Revert optimistic update on error
      if (isCurrentlyFollowing) {
        setFollowingIds((prev) => [...prev, targetId]);
      } else {
        setFollowingIds((prev) => prev.filter((id) => id !== targetId));
      }
      showToast(err?.message || 'फ़ॉलो करने में त्रुटि हुई।');
    }
  };

  const createPost = async (
    caption: string, 
    imageUrl: string, 
    locationName: string, 
    tags: string[],
    audioOptions?: { audioURL: string; audioDuration?: number | string; audioTitle?: string },
    isAnonymous?: boolean
  ): Promise<boolean> => {
    // Constraint: Only authenticated users can create posts
    if (!firebaseUser && !auth.currentUser) {
      showToast('केवल लॉगिन किए हुए यूज़र ही पोस्ट बना सकते हैं! कृपया पहले लॉगिन करें।');
      setIsAuthModalOpen(true);
      return false;
    }

    try {
      const newPost = await createFirestorePost({
        text: caption,
        imageURL: imageUrl,
        locationName,
        tags,
        currentUserProfile: currentUser,
        audioURL: audioOptions?.audioURL,
        audioDuration: audioOptions?.audioDuration,
        audioTitle: audioOptions?.audioTitle,
        mediaType: audioOptions?.audioURL ? 'audio' : (imageUrl ? 'image' : 'text'),
        isAnonymous
      });

      // Optimistically place new post at top of feed
      setPosts((prev) => [newPost, ...prev.filter((p) => p.id !== newPost.id)]);
      setCurrentUser((prev) => ({ ...prev, postCount: prev.postCount + 1 }));
      setActiveTab('home');
      showToast(isAnonymous ? 'आपकी गुमनाम पोस्ट (दिल से) सफलतापूर्वक प्रकाशित हो गई!' : 'आपकी नई पोस्ट Firestore में सफलतापूर्वक प्रकाशित हो गई!');
      return true;
    } catch (err: any) {
      console.error('Error creating post in Firestore:', err);
      const msg = err?.message || 'पोस्ट प्रकाशित करने में समस्या आई।';
      showToast(`त्रुटि: ${msg}`);
      throw err;
    }
  };

  const deletePost = async (postId: string) => {
    const postToDelete = posts.find((p) => p.id === postId);
    const authorUid = postToDelete?.authorUid || postToDelete?.author?.uid || postToDelete?.author?.id;

    // Immediate UI removal
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    setCurrentUser((prev) => ({ ...prev, postCount: Math.max(0, prev.postCount - 1) }));

    if (firebaseUser && authorUid) {
      try {
        await deleteFirestorePost(postId, authorUid);
        showToast('पोस्ट Firestore से हटा दी गई (Post Removed)');
      } catch (err: any) {
        console.error('Error deleting post from Firestore:', err);
        showToast('पोस्ट हटाने में समस्या आई।');
      }
    } else {
      showToast('पोस्ट हटा दी गई (Post Removed)');
    }
  };

  const updatePostCaption = async (postId: string, newCaption: string): Promise<boolean> => {
    const trimmed = newCaption.trim();
    if (!trimmed) {
      showToast('कैप्शन खाली नहीं हो सकता');
      return false;
    }

    // Optimistic UI update
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            text: trimmed,
            caption: trimmed
          };
        }
        return p;
      })
    );

    showToast('कैप्शन सफलतापूर्वक अपडेट हो गया! (Caption Updated)');

    if (firebaseUser) {
      try {
        await updateFirestorePostCaption(postId, trimmed);
      } catch (err: any) {
        console.error('Error updating caption in Firestore:', err);
        showToast('कैप्शन अपडेट करने में समस्या आई।');
        return false;
      }
    }
    return true;
  };

  const toggleLikeReel = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) => {
        if (r.id === reelId) {
          const nextLiked = !r.isLiked;
          return {
            ...r,
            isLiked: nextLiked,
            likesCount: r.likesCount + (nextLiked ? 1 : -1)
          };
        }
        return r;
      })
    );
  };

  const reportContent = (reportedUserId: string, reason: string, details?: string, postId?: string) => {
    const reportedUser = users.find((u) => u.id === reportedUserId) || users[0];
    const postObj = posts.find((p) => p.id === postId);

    const ticket: ReportTicket = {
      id: `rep_${Date.now()}`,
      reportedPostId: postId,
      reportedPostCaption: postObj?.caption,
      reportedPostImage: postObj?.imageUrl,
      reportedUser,
      reporterUser: currentUser,
      reason,
      details,
      status: 'pending',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };

    setReports((prev) => [ticket, ...prev]);
    showToast(t.reportSubmitted);
  };

  const blockUser = (userId: string) => {
    setBlockedUserIds((prev) => [...new Set([...prev, userId])]);
    showToast(t.blockedSuccess);
  };

  const unblockUser = (userId: string) => {
    setBlockedUserIds((prev) => prev.filter((id) => id !== userId));
    showToast('उपयोगकर्ता को अनब्लॉक कर दिया गया है');
  };

  const updateProfile = async (
    fullName: string, 
    bio: string, 
    location: string, 
    avatar?: string,
    newUsername?: string
  ): Promise<boolean> => {
    const currentUsername = currentUser.username;
    let finalUsername = currentUsername;

    if (newUsername && newUsername.toLowerCase().trim() !== currentUsername) {
      const val = validateUsernameFormat(newUsername);
      if (!val.valid) {
        showToast(val.error || 'अमान्य यूज़रनेम');
        return false;
      }

      if (firebaseUser) {
        const claimRes = await claimUsernameTransaction(val.cleanUsername, firebaseUser.uid, currentUsername);
        if (!claimRes.success) {
          showToast(claimRes.error || 'यह यूज़रनेम पहले से किसी अन्य सदस्य द्वारा उपयोग में है।');
          return false;
        }
        finalUsername = claimRes.cleanUsername;
      } else {
        finalUsername = val.cleanUsername;
      }
    }

    const updated = {
      fullName: fullName.trim() || currentUser.fullName,
      name: fullName.trim() || currentUser.fullName,
      bio: bio.trim(),
      location: location.trim() || currentUser.location,
      avatar: avatar || currentUser.avatar,
      photoURL: avatar || currentUser.avatar,
      username: finalUsername,
      handle: `@${finalUsername}`
    };

    setCurrentUser((prev) => ({ ...prev, ...updated }));
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, ...updated } : u))
    );

    // Sync to Firebase if logged in
    if (firebaseUser) {
      updateDoc(doc(db, 'users', firebaseUser.uid), {
        ...updated,
        updatedAt: new Date().toISOString()
      }).catch((e) =>
        console.warn('Firestore profile sync warning:', e)
      );
      updateFirebaseAuthProfile(firebaseUser, {
        displayName: updated.fullName,
        photoURL: updated.avatar
      }).catch((e) => console.warn('Auth update error:', e));
    }

    showToast('प्रोफ़ाइल सफलतापूर्वक अपडेट हुई! (Profile Updated)');
    return true;
  };

  const resolveReport = (reportId: string, action: 'dismissed' | 'resolved') => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          return { ...r, status: action };
        }
        return r;
      })
    );

    if (action === 'resolved') {
      const rep = reports.find((r) => r.id === reportId);
      if (rep?.reportedPostId) {
        setPosts((prev) => prev.filter((p) => p.id !== rep.reportedPostId));
      }
      showToast('कार्रवाई की गई: पोस्ट हटा दी गई (Post Removed)');
    } else {
      showToast('रिपोर्ट खारिज कर दी गई (Report Dismissed)');
    }
  };

  const loginAs = (user: User) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    showToast(`सफलतापूर्वक लॉगिन: ${user.fullName}`);
  };

  const logout = () => {
    if (firebaseUser) {
      logoutWithFirebase();
    } else {
      setCurrentUser(INITIAL_USERS[0]);
      showToast('सफलतापूर्वक लॉग आउट हुआ (Logged Out)');
    }
  };

  return (
    <BharatConnectContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        toggleTheme,
        t,
        activeTab,
        setActiveTab,
        currentUser,
        users: users.map((u) => ({
          ...u,
          isFollowing: followingIds.includes(u.id) || (u.uid ? followingIds.includes(u.uid) : false)
        })),
        posts: posts.filter((p) => !blockedUserIds.includes(p.author.id)),
        stories,
        reels,
        notifications,
        unreadNotificationsCount,
        isNotificationsLoading,
        markNotificationRead,
        markNotificationUnread,
        markAllNotificationsRead,
        deleteNotificationItem,
        reports,
        blockedUserIds,
        isPhoneFrame,
        setIsPhoneFrame,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isSOSModalOpen,
        setIsSOSModalOpen,
        openSOSModal,
        toastMessage,
        setToastMessage,
        firebaseUser,
        isFirebaseAuthLoggedIn: !!firebaseUser,
        isAuthLoading,
        signUpWithFirebase,
        loginWithFirebase,
        sendPasswordResetWithFirebase,
        logoutWithFirebase,
        followingIds,
        viewingUser,
        setViewingUser,
        openUserProfile,
        toggleLikePost,
        toggleSavePost,
        addComment,
        toggleFollowUser,
        createPost,
        deletePost,
        updatePostCaption,
        toggleLikeReel,
        reportContent,
        blockUser,
        unblockUser,
        updateProfile,
        resolveReport,
        loginAs,
        logout
      }}
    >
      {children}
    </BharatConnectContext.Provider>
  );
};

export const useBharatConnect = () => {
  const context = useContext(BharatConnectContext);
  if (!context) {
    throw new Error('useBharatConnect must be used within BharatConnectProvider');
  }
  return context;
};
