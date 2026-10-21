import React, { createContext, useContext, useState } from 'react';
import { 
  User, 
  Post, 
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
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
  
  // Actions
  toggleLikePost: (postId: string) => void;
  toggleSavePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  toggleFollowUser: (userId: string) => void;
  createPost: (caption: string, imageUrl: string, locationName: string, tags: string[]) => void;
  deletePost: (postId: string) => void;
  toggleLikeReel: (reelId: string) => void;
  reportContent: (reportedUserId: string, reason: string, details?: string, postId?: string) => void;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  updateProfile: (fullName: string, bio: string, location: string, avatar?: string) => void;
  resolveReport: (reportId: string, action: 'dismissed' | 'resolved') => void;
  loginAs: (user: User) => void;
  logout: () => void;
}

const BharatConnectContext = createContext<BharatConnectContextType | null>(null);

export const BharatConnectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageCode>('hi'); // Default Hindi
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [reels, setReels] = useState<Reel[]>(INITIAL_REELS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [reports, setReports] = useState<ReportTicket[]>(INITIAL_REPORTS);
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);
  const [isPhoneFrame, setIsPhoneFrame] = useState(false); // Fluid by default, can toggle mobile frame
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const t = TRANSLATIONS[language] || TRANSLATIONS.hi;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  const toggleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.isLiked;
          return {
            ...p,
            isLiked: nextLiked,
            likesCount: p.likesCount + (nextLiked ? 1 : -1)
          };
        }
        return p;
      })
    );
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

  const addComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    const newComment = {
      id: `c_${Date.now()}`,
      author: currentUser,
      text: text.trim(),
      createdAt: 'Just now',
      likesCount: 0
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [newComment, ...p.comments]
          };
        }
        return p;
      })
    );
    showToast('टिप्पणी पोस्ट की गई (Comment Added)');
  };

  const toggleFollowUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextFollowing = !u.isFollowing;
          showToast(nextFollowing ? `आपने ${u.fullName} को फ़ॉलो किया` : `${u.fullName} को अनफ़ॉलो किया`);
          return {
            ...u,
            isFollowing: nextFollowing,
            followersCount: u.followersCount + (nextFollowing ? 1 : -1)
          };
        }
        return u;
      })
    );
  };

  const createPost = (caption: string, imageUrl: string, locationName: string, tags: string[]) => {
    const newPost: Post = {
      id: `post_${Date.now()}`,
      author: currentUser,
      caption: caption.trim(),
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80',
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      isLiked: false,
      isSaved: false,
      locationName: locationName || currentUser.location,
      createdAt: 'Just now',
      language,
      tags: tags.length ? tags : ['BharatConnect', 'DesiSocial'],
      comments: []
    };

    setPosts((prev) => [newPost, ...prev]);
    // Increment post count on currentUser
    setCurrentUser((prev) => ({ ...prev, postCount: prev.postCount + 1 }));
    setActiveTab('home');
    showToast('आपकी नई पोस्ट साझा हो गई है! (Post Published)');
  };

  const deletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    setCurrentUser((prev) => ({ ...prev, postCount: Math.max(0, prev.postCount - 1) }));
    showToast('पोस्ट हटा दी गई (Post Removed)');
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

  const updateProfile = (fullName: string, bio: string, location: string, avatar?: string) => {
    setCurrentUser((prev) => ({
      ...prev,
      fullName: fullName.trim() || prev.fullName,
      bio: bio.trim(),
      location: location.trim() || prev.location,
      avatar: avatar || prev.avatar
    }));

    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, fullName, bio, location } : u))
    );

    showToast('प्रोफ़ाइल सफलतापूर्वक अपडेट हुई! (Profile Updated)');
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
    // Switch to another demo user or reset
    setCurrentUser(INITIAL_USERS[0]);
    showToast('सफलतापूर्वक लॉग आउट हुआ (Logged Out)');
  };

  return (
    <BharatConnectContext.Provider
      value={{
        language,
        setLanguage,
        t,
        activeTab,
        setActiveTab,
        currentUser,
        users,
        posts: posts.filter((p) => !blockedUserIds.includes(p.author.id)),
        stories,
        reels,
        notifications,
        reports,
        blockedUserIds,
        isPhoneFrame,
        setIsPhoneFrame,
        isAuthModalOpen,
        setIsAuthModalOpen,
        toastMessage,
        setToastMessage,
        toggleLikePost,
        toggleSavePost,
        addComment,
        toggleFollowUser,
        createPost,
        deletePost,
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
