import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  Sparkles,
  Award,
  Film,
  Bell,
  User,
  PlusCircle,
  Search,
  Heart,
  MessageCircle,
  Repeat,
  Share2,
  Bookmark,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Compass,
  CheckCircle2,
  Sun,
  Moon,
  Send,
  MoreHorizontal,
  DollarSign,
  Gift,
  X,
  Music,
  Code,
  Palette,
  Feather,
  Train,
  Sliders,
  Share,
  Link,
  ThumbsUp,
  Image as ImageIcon,
  MapPin,
  Mic,
  Smile,
  Check,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { useBharatConnect } from '../../context/BharatConnectContext';
import { useAuth } from '../../context/AuthContext';
import { Post as FirestorePost } from '../../types/bharatConnect';
import { createFirestorePost, subscribeToFirestorePosts } from '../../lib/postService';

// Interfaces
interface StoryItem {
  id: string;
  name: string;
  avatar: string;
  isUser?: boolean;
  hasUnseen?: boolean;
  badge?: string;
}

interface PostItem {
  id: string;
  author: {
    name: string;
    handle: string;
    location: string;
    timeAgo: string;
    avatar: string;
    verified: boolean;
    badgeType?: string;
  };
  type: 'audio' | 'image' | 'skill' | 'text';
  caption?: string;
  audioTitle?: string;
  audioSubtitle?: string;
  audioQuote?: string;
  imageUrl?: string;
  watermark?: string;
  likes: number;
  comments: number;
  reposts: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  canTip?: boolean;
  hashtags: string[];
  category: string;
}

// Sample Mock Data
const STORIES: StoryItem[] = [
  {
    id: 'my-story',
    name: 'आपकी स्टोरी',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isUser: true,
    hasUnseen: false,
  },
  {
    id: 'story-1',
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    hasUnseen: true,
    badge: 'Artisan',
  },
  {
    id: 'story-2',
    name: 'Aarav Patel',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    hasUnseen: true,
    badge: 'Coder',
  },
  {
    id: 'story-3',
    name: 'Vikramaditya',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    hasUnseen: false,
    badge: 'Railways',
  },
];

const INITIAL_POSTS: PostItem[] = [
  {
    id: 'post-1',
    author: {
      name: 'as9621302122',
      handle: '@as9621302122',
      location: 'India',
      timeAgo: '5 दिन पहले',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      verified: true,
      badgeType: 'Awaaz Creator',
    },
    type: 'audio',
    audioTitle: 'कबीर दोहा - गुरु गोविंद दोऊ खड़े',
    audioSubtitle: 'आवाज़ (Awaaz Audio) • 0:30 मि',
    audioQuote: '"गुरु गोविंद दोऊ खड़े, काके लागूं पांय। बलिहारी गुरु आपने, गोविंद दियो बताय॥ 🙏"',
    likes: 342,
    comments: 48,
    reposts: 19,
    isLiked: false,
    isBookmarked: false,
    hashtags: ['#Awaaz', '#KabirDoha', '#BharatConnect'],
    category: 'कला एवं संगीत',
  },
  {
    id: 'post-2',
    author: {
      name: 'railway_shayar_aman',
      handle: '@railwayshayaraman',
      location: 'नई दिल्ली रेलवे स्टेशन',
      timeAgo: 'अभी-अभी (Just now)',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      verified: true,
      badgeType: 'Rail Enthusiast',
    },
    type: 'image',
    caption: 'भारतीय रेल की भव्यता! WAP-7 लोकोमोटिव शाम के समय अपनी स्वर्णिम यात्रा पर। 🚆🇮🇳 #IndianRailways',
    imageUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&auto=format&fit=crop&q=80',
    watermark: 'BharatConnect @railwayshayaraman',
    likes: 1289,
    comments: 112,
    reposts: 84,
    isLiked: true,
    isBookmarked: true,
    hashtags: ['#IndianRailways', '#BharatConnect', '#TravelIndia'],
    category: 'लेखन एवं शायरी',
  },
  {
    id: 'post-3',
    author: {
      name: 'Devika Potteries',
      handle: '@devika_crafts',
      location: 'जयपुर, राजस्थान',
      timeAgo: '2 घंटे पहले',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      verified: true,
      badgeType: 'Artisan Verified',
    },
    type: 'skill',
    caption: 'पारंपरिक राजस्थानी ब्लू पॉटरी वर्क। क्या आपको हाथ की बनी वस्तुएं पसंद हैं? समर्थन करें! 🎨✨',
    imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
    likes: 520,
    comments: 31,
    reposts: 14,
    isLiked: false,
    isBookmarked: false,
    canTip: true,
    hashtags: ['#Hastshilp', '#MakeInIndia', '#Crafts'],
    category: 'हस्तशिल्प',
  }
];

const TRENDING_TAGS = [
  '#Awaaz',
  '#KabirDoha',
  '#BharatConnect',
  '#IndianRailways',
  '#MakeInIndia',
  '#DesiTech',
  '#VocalForLocal'
];

export default function BharatConnectV2() {
  const { currentUser, openSOSModal, setToastMessage, setActiveTab: setGlobalActiveTab } = useBharatConnect();
  const { user: firebaseAuthUser } = useAuth();

  // Theme & App State
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'reels' | 'skills' | 'explore' | 'alerts' | 'profile'>('home');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('सब (All)');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [language, setLanguage] = useState<'hi' | 'en'>('hi');
  
  // Modals & Panels
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);
  const [selectedCreatorForTip, setSelectedCreatorForTip] = useState<PostItem['author'] | null>(null);
  const [tipAmount, setTipAmount] = useState<number>(50);
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [activeStory, setActiveStory] = useState<StoryItem | null>(null);

  // Feed Posts Data (Curated + Firestore Realtime)
  const [posts, setPosts] = useState<PostItem[]>(INITIAL_POSTS);

  // New Post Form State
  const [newPostText, setNewPostText] = useState('');
  const [newPostImageUrl, setNewPostImageUrl] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('कला एवं संगीत');
  const [isPublishing, setIsPublishing] = useState(false);

  // Post Comments State
  const [postComments, setPostComments] = useState<{ [postId: string]: Array<{ user: string; text: string; time: string }> }>({
    'post-1': [
      { user: 'priya_sharma', text: 'अति सुंदर दोहा! कबीर साहेब की वाणी अमर है। 🙏', time: '1 दिन पहले' },
      { user: 'rohit_patel', text: 'बहुत ही मधुर और शांत ध्वनि।', time: '5 घंटे पहले' }
    ],
    'post-2': [
      { user: 'loco_fan_india', text: 'WAP-7 भारतीय रेल का असली शेर है! 🚆🇮🇳', time: '20 मिनट पहले' }
    ],
    'post-3': [
      { user: 'art_collector', text: 'हैंडमेड ब्लू पॉटरी की चमक ही अलग होती है। बहुत बढ़िया!', time: '1 घंटा पहले' }
    ]
  });
  const [newCommentText, setNewCommentText] = useState('');

  // Notifications State
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [notifications, setNotifications] = useState([
    { id: 1, user: 'Priya Sharma', text: 'आपकी पोस्ट को पसंद किया', time: '10 मि पहले', unread: true },
    { id: 2, user: 'Aarav Patel', text: 'आपको कमेंट में मेंशन किया', time: '1 घंटे पहले', unread: true },
    { id: 3, user: 'BharatConnect Team', text: 'आपके हुनर प्रोफाइल को वेरीफाई किया गया 🎉', time: '1 दिन पहले', unread: true },
  ]);

  // Sync real posts from Firestore
  useEffect(() => {
    const unsubscribe = subscribeToFirestorePosts((firestorePosts: FirestorePost[]) => {
      if (firestorePosts && firestorePosts.length > 0) {
        const mapped: PostItem[] = firestorePosts.map((fp) => ({
          id: fp.id || fp.postId || String(Math.random()),
          author: {
            name: fp.author?.name || fp.authorName || 'भारत नागरिक',
            handle: fp.author?.handle || `@${fp.authorName?.toLowerCase().replace(/\s+/g, '') || 'citizen'}`,
            location: fp.locationName || 'भारत',
            timeAgo: fp.createdAt || 'अभी-अभी',
            avatar: fp.author?.avatar || fp.authorPhotoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            verified: true,
            badgeType: fp.audioURL ? 'Awaaz Creator' : 'Founding Citizen'
          },
          type: fp.audioURL ? 'audio' : (fp.imageUrl || fp.imageURL ? 'image' : 'text'),
          caption: fp.caption || fp.text || '',
          audioTitle: fp.audioTitle || (fp.audioURL ? 'आवाज़ (Awaaz Audio)' : undefined),
          audioSubtitle: fp.audioDuration ? `आवाज़ • ${fp.audioDuration}` : 'आवाज़ (Awaaz Audio)',
          audioQuote: fp.audioURL ? (fp.caption || fp.text) : undefined,
          imageUrl: fp.imageUrl || fp.imageURL || undefined,
          watermark: `BharatConnect @${fp.author?.username || 'user'}`,
          likes: fp.likesCount || fp.likeCount || 0,
          comments: fp.commentsCount || (Array.isArray(fp.comments) ? fp.comments.length : 0),
          reposts: fp.sharesCount || 0,
          isLiked: Boolean(fp.isLiked),
          isBookmarked: Boolean(fp.isSaved),
          hashtags: fp.tags?.length ? fp.tags.map(t => t.startsWith('#') ? t : `#${t}`) : ['#BharatConnect'],
          category: (fp as any).category || 'कला एवं संगीत'
        }));

        setPosts(prev => {
          const ids = new Set(mapped.map(m => m.id));
          const uniques = prev.filter(p => !ids.has(p.id));
          return [...mapped, ...uniques];
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle Likes
  const toggleLike = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? Math.max(0, post.likes - 1) : post.likes + 1
        };
      }
      return post;
    }));
  };

  // Handle Bookmark
  const toggleBookmark = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isNowBookmarked = !post.isBookmarked;
        if (setToastMessage) {
          setToastMessage(isNowBookmarked ? 'पोस्ट सहेजी गई (Saved to bookmarks) 🔖' : 'बुकमार्क से हटाया गया');
        }
        return { ...post, isBookmarked: isNowBookmarked };
      }
      return post;
    }));
  };

  // Handle Repost
  const handleRepost = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, reposts: post.reposts + 1 };
      }
      return post;
    }));
    if (setToastMessage) {
      setToastMessage('अपनी फ़ीड पर पुनः साझा किया (Reposted to your feed) 🔁');
    }
  };

  // WhatsApp 1-Click Share
  const handleWhatsAppShare = (post: PostItem) => {
    const text = encodeURIComponent(
      `🇮🇳 BharatConnect - भारत का अपना सोशल मीडिया!\n\n` +
      `"${post.caption || post.audioQuote || post.hashtags.join(' ')}"\n\n` +
      `द्वारा: ${post.author.name} (${post.author.handle})\n` +
      `🔗 देखें: https://ais-pre-danma7ku6sq7x5cjtay4sj-37858070369.asia-northeast1.run.app\n` +
      `#BharatConnect #MakeInIndia`
    );
    const url = `https://api.whatsapp.com/send?text=${text}`;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(
        `BharatConnect | @${post.author.handle}: ${post.caption || post.audioQuote || ''} https://ais-pre-danma7ku6sq7x5cjtay4sj-37858070369.asia-northeast1.run.app`
      );
    }
    if (setToastMessage) {
      setToastMessage('WhatsApp शेयर लिंक कॉपी किया गया (Watermarked Link)! 🇮🇳');
    }
    try {
      window.open(url, '_blank');
    } catch {
      alert('Link copied with BharatConnect watermark!');
    }
  };

  // Add Comment
  const handleAddComment = (postId: string) => {
    if (!newCommentText.trim()) return;
    const authorName = currentUser?.username || firebaseAuthUser?.email?.split('@')[0] || 'as9621302122';
    
    setPostComments(prev => ({
      ...prev,
      [postId]: [
        ...(prev[postId] || []),
        { user: authorName, text: newCommentText.trim(), time: 'अभी-अभी' }
      ]
    }));

    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: p.comments + 1 } : p));
    setNewCommentText('');
    if (setToastMessage) setToastMessage('टिप्पणी प्रकाशित हुई! ✨');
  };

  // Create New Post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim() && !newPostImageUrl.trim()) return;

    setIsPublishing(true);
    const tagList = ['#BharatConnect', '#NewPost'];
    const extracted = newPostText.match(/#[a-zA-Z0-9_]+/g);
    if (extracted) {
      extracted.forEach(t => { if (!tagList.includes(t)) tagList.push(t); });
    }

    const currentUserName = currentUser?.name || currentUser?.fullName || 'Rahul Sharma';
    const currentHandle = currentUser?.handle || '@rahul_sharma';

    const newPostObj: PostItem = {
      id: `post_${Date.now()}`,
      author: {
        name: currentUserName,
        handle: currentHandle,
        location: 'India',
        timeAgo: 'अभी-अभी',
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        verified: true,
        badgeType: 'Creator'
      },
      type: newPostImageUrl ? 'image' : (newPostText.includes('दोहा') ? 'audio' : 'text'),
      caption: newPostText,
      imageUrl: newPostImageUrl || undefined,
      watermark: `BharatConnect ${currentHandle}`,
      likes: 0,
      comments: 0,
      reposts: 0,
      hashtags: tagList,
      category: newPostCategory
    };

    setPosts([newPostObj, ...posts]);

    try {
      await createFirestorePost({
        text: newPostText,
        imageURL: newPostImageUrl,
        locationName: 'India',
        tags: tagList,
        currentUserProfile: currentUser
      });
      if (setToastMessage) setToastMessage('आपकी पोस्ट भारतकनेक्ट पर लाइव हो गई है! 🇮🇳');
    } catch {
      if (setToastMessage) setToastMessage('पोस्ट स्थानीय रूप से प्रकाशित हुई');
    } finally {
      setIsPublishing(false);
      setNewPostText('');
      setNewPostImageUrl('');
      setIsCreateModalOpen(false);
    }
  };

  // Submit Tip
  const handleSendTip = () => {
    if (setToastMessage) {
      setToastMessage(`₹${tipAmount} का टिप ${selectedCreatorForTip?.name} को सफलतापूर्वक भेजा गया! 🎁 (5% प्लैटफ़ॉर्म कमीशन)`);
    }
    setIsTipModalOpen(false);
  };

  // Filter Posts based on tab & category filter
  const filteredPosts = posts.filter(post => {
    if (activeTab === 'skills' && post.type !== 'skill') return false;
    if (selectedSkillFilter !== 'सब (All)' && post.category !== selectedSkillFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchCaption = post.caption?.toLowerCase().includes(q);
      const matchAuthor = post.author.name.toLowerCase().includes(q) || post.author.handle.toLowerCase().includes(q);
      const matchTags = post.hashtags.some(t => t.toLowerCase().includes(q));
      return matchCaption || matchAuthor || matchTags;
    }
    return true;
  });

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans antialiased transition-colors duration-200 pb-20 md:pb-6`}>
      
      {/* Top Navigation Bar */}
      <header className={`sticky top-0 z-30 backdrop-blur-md border-b ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'} px-4 py-2.5 shadow-sm`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-500 to-emerald-600 flex items-center justify-center font-black text-white text-xl shadow-md shadow-orange-500/20">
              BC
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500 bg-clip-text text-transparent">
                  BharatConnect
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-500 font-bold border border-orange-500/20">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">भारत का अपना सोशल मीडिया</p>
            </div>
          </div>

          {/* Search Bar with Autocomplete */}
          <div className="relative flex-1 max-w-xs sm:max-w-md">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${darkMode ? 'bg-slate-800/80 border-slate-700 text-slate-200 focus-within:border-orange-500' : 'bg-slate-100 border-slate-300 text-slate-800 focus-within:border-orange-500'} transition-all`}>
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder={language === 'hi' ? "खोजें (#Awaaz, #KabirDoha, क्रिएटर्स)..." : "Search tags, creators..."}
                className="w-full bg-transparent text-xs focus:outline-none placeholder-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchDropdown(true)}
                onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
              />
              {searchQuery && (
                <X className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-orange-500" onClick={() => setSearchQuery('')} />
              )}
            </div>

            {/* Trending Autocomplete Dropdown */}
            {showSearchDropdown && (
              <div className={`absolute top-full left-0 right-0 mt-2 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'} shadow-2xl p-3 z-50`}>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-orange-500" /> ट्रेंडिंग हैशटैग्स (Trending)
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {TRENDING_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => { setSearchQuery(tag); setShowSearchDropdown(false); }}
                      className={`text-xs px-2.5 py-1 rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-700 hover:border-orange-500 text-slate-300' : 'bg-slate-100 border-slate-200 hover:border-orange-500 text-slate-700'} transition-all`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            {/* SOS Emergency button */}
            <button
              onClick={openSOSModal}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40 rounded-lg text-xs font-bold transition active:scale-95 shadow-sm"
              title="भारत सहारा (SOS Emergency)"
            >
              <Shield className="w-3.5 h-3.5 text-red-500" />
              <span>SOS</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(l => l === 'hi' ? 'en' : 'hi')}
              className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium ${darkMode ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'} transition cursor-pointer`}
              title="Change Language"
            >
              {language === 'hi' ? '🇮🇳 हिंदी' : '🌐 EN'}
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg border cursor-pointer ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-amber-400' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'} transition`}
              title="थीम टॉगल"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Portal back button */}
            <button
              onClick={() => setGlobalActiveTab('home')}
              className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium cursor-pointer ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'}`}
              title="पोर्टल पर लौटें"
            >
              पोर्टल ↗
            </button>

            {/* Profile Desktop Quick Link */}
            <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-700/50">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="Profile"
                className="w-8 h-8 rounded-full border-2 border-orange-500 object-cover cursor-pointer hover:scale-105 transition"
                onClick={() => setActiveTab('profile')}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="max-w-4xl mx-auto px-3 py-4 grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Main Feed Section (Width 8 Columns on desktop) */}
        <section className="md:col-span-8 space-y-4">
          
          {/* Top Main Navigation Tabs */}
          <div className={`flex items-center justify-between p-1.5 rounded-2xl border ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
            {[
              { id: 'home', label: 'होम (Home)', icon: Home },
              { id: 'reels', label: 'रील्स (Reels)', icon: Film },
              { id: 'skills', label: 'हुनर (Skills)', icon: Award },
              { id: 'explore', label: 'एक्सप्लोर', icon: Compass },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                      : darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sub Skill Tags Filter (Shown on Skills or Home tab) */}
          {(activeTab === 'home' || activeTab === 'skills') && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {['सब (All)', 'कला एवं संगीत', 'कोडिंग एवं टेक', 'हस्तशिल्प', 'लेखन एवं शायरी'].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedSkillFilter(category)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                    selectedSkillFilter === category
                      ? 'bg-orange-500 border-orange-500 text-white font-bold shadow-sm'
                      : darkMode
                      ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {/* Stories Carousel */}
          <div className={`p-3 rounded-2xl border ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
              {STORIES.map((story) => (
                <div
                  key={story.id}
                  onClick={() => setActiveStory(story)}
                  className="flex flex-col items-center gap-1 cursor-pointer shrink-0 group"
                >
                  <div className={`relative p-0.5 rounded-full ${story.isUser ? '' : story.hasUnseen ? 'bg-gradient-to-tr from-orange-500 via-amber-500 to-emerald-500 p-[2px]' : 'bg-slate-700'}`}>
                    <img
                      src={story.avatar}
                      alt={story.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-slate-900 group-hover:scale-105 transition-transform"
                    />
                    {story.isUser && (
                      <div className="absolute bottom-0 right-0 bg-orange-500 text-white rounded-full p-1 border-2 border-slate-900 shadow">
                        <PlusCircle className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-slate-300 truncate max-w-[68px] text-center">
                    {story.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Creator Box */}
          <div
            onClick={() => setIsCreateModalOpen(true)}
            className={`p-3.5 rounded-2xl border ${darkMode ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300'} shadow-sm cursor-pointer transition flex items-center gap-3`}
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Me"
              className="w-9 h-9 rounded-full object-cover border border-orange-500"
            />
            <div className={`flex-1 px-4 py-2 rounded-xl text-xs ${darkMode ? 'bg-slate-800/80 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
              राहुल, आज क्या नया साझा करना चाहते हैं? (Create Post...)
            </div>
            <button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-2 rounded-xl shadow-md">
              <PlusCircle className="w-4 h-4" />
            </button>
          </div>

          {/* Feed Posts List */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <PostCardItem
                key={post.id}
                post={post}
                darkMode={darkMode}
                onLike={() => toggleLike(post.id)}
                onBookmark={() => toggleBookmark(post.id)}
                onRepost={() => handleRepost(post.id)}
                onShare={() => handleWhatsAppShare(post)}
                onOpenComments={() => setActiveCommentsPostId(post.id)}
                onOpenTip={(creator) => {
                  setSelectedCreatorForTip(creator);
                  setIsTipModalOpen(true);
                }}
              />
            ))}
            {filteredPosts.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-sm">
                कोई पोस्ट नहीं मिली। कृपया फ़िल्टर बदलें या नया खोजें।
              </div>
            )}
          </div>
        </section>

        {/* Right Sidebar - Widgets & Trends (Width 4 Columns on desktop) */}
        <aside className="hidden md:block md:col-span-4 space-y-4">
          
          {/* User Quick Profile Widget */}
          <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
            <div className="flex items-center gap-3 mb-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="Rahul"
                className="w-12 h-12 rounded-full border-2 border-orange-500 object-cover"
              />
              <div>
                <div className="flex items-center gap-1 font-bold text-sm">
                  <span>नमस्ते 🇮🇳 Rahul Sharma</span>
                  <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500/20" />
                </div>
                <p className="text-xs text-slate-400">@rahul_sharma</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center py-2 border-y border-slate-800/50 my-2">
              <div>
                <div className="text-sm font-black text-orange-500">142</div>
                <div className="text-[10px] text-slate-400">पोस्ट्स</div>
              </div>
              <div>
                <div className="text-sm font-black text-emerald-500">1.2k</div>
                <div className="text-[10px] text-slate-400">फॉलोअर्स</div>
              </div>
              <div>
                <div className="text-sm font-black text-amber-500">380</div>
                <div className="text-[10px] text-slate-400">फॉलोइंग</div>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('profile')}
              className="w-full mt-2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              प्रोफ़ाइल देखें व संपादित करें
            </button>
          </div>

          {/* Monetization & Tip System Banner */}
          <div className="bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-emerald-500/10 border border-amber-500/30 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-5 h-5 text-amber-400" />
              <h4 className="font-bold text-sm text-amber-400">डिजिटल टिपिंग व गिफ्ट्स</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              अपने पसंदीदा स्थानीय कारीगरों और क्रिएटर्स को सीधे यूपीआई से टिप भेजें और उनका समर्थन करें।
            </p>
            <div className="mt-3 flex items-center justify-between text-[11px] text-amber-300/80 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
              <span>प्लेटफ़ॉर्म कमीशन: 5%</span>
              <span className="font-bold">डायरेक्ट बैंक ट्रांसफर</span>
            </div>
          </div>

          {/* Trending Skills Widget */}
          <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-orange-500" /> लोकप्रिय हुनर (Popular Skills)
            </h4>
            <div className="space-y-2.5">
              {[
                { name: 'कला एवं संगीत', count: '1.4k क्रिएटर्स', icon: Music },
                { name: 'हस्तशिल्प (Handicrafts)', count: '920 कारीगर', icon: Palette },
                { name: 'कोडिंग एवं टेक', count: '640 डेवलपर्स', icon: Code },
                { name: 'लेखन एवं शायरी', count: '2.1k लेखक', icon: Feather }
              ].map((skill, idx) => {
                const Icon = skill.icon;
                return (
                  <div 
                    key={idx} 
                    onClick={() => { setSelectedSkillFilter(skill.name.split(' ')[0]); setActiveTab('skills'); }}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/60 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-200">{skill.name}</p>
                        <span className="text-[10px] text-slate-400">{skill.count}</span>
                      </div>
                    </div>
                    <span className="text-xs text-orange-400 font-bold">→</span>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </main>

      {/* --- CREATE POST MODAL --- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-2xl p-5 animate-in zoom-in-95`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-orange-400 flex items-center gap-2">
                <PlusCircle className="w-4 h-4" /> नई पोस्ट बनाएं (Create Post)
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="mt-4 space-y-3">
              <textarea
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder="आप क्या सोच रहे हैं? यहाँ लिखें या दोहा/विचार साझा करें..."
                className={`w-full h-28 p-3 rounded-xl text-xs border focus:outline-none focus:border-orange-500 resize-none ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'}`}
              />

              <input
                type="text"
                value={newPostImageUrl}
                onChange={(e) => setNewPostImageUrl(e.target.value)}
                placeholder="फोटो लिंक (Optional Image URL)..."
                className={`w-full p-2.5 rounded-xl text-xs border focus:outline-none focus:border-orange-500 ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'}`}
              />

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">श्रेणी (Category):</span>
                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value)}
                  className={`flex-1 p-2 rounded-xl text-xs border focus:outline-none focus:border-orange-500 ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'}`}
                >
                  <option value="कला एवं संगीत">कला एवं संगीत</option>
                  <option value="कोडिंग एवं टेक">कोडिंग एवं टेक</option>
                  <option value="हस्तशिल्प">हस्तशिल्प</option>
                  <option value="लेखन एवं शायरी">लेखन एवं शायरी</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <div className="flex items-center gap-2 text-slate-400">
                  <button
                    type="button"
                    onClick={() => setNewPostImageUrl('https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80')}
                    className="p-2 hover:bg-slate-800 rounded-lg text-orange-400"
                    title="नमूना छवि"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPostText(t => t ? `${t} #Awaaz #KabirDoha` : 'कबीर दोहा - साधु ऐसा चाहिए, जैसा सूप सुभाय।')}
                    className="p-2 hover:bg-slate-800 rounded-lg text-amber-400"
                    title="दोहा टैग"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isPublishing || (!newPostText.trim() && !newPostImageUrl.trim())}
                  className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-xs font-bold hover:opacity-95 transition disabled:opacity-50 cursor-pointer"
                >
                  {isPublishing ? 'पब्लिश हो रहा है...' : 'पोस्ट प्रकाशित करें'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- CREATOR TIPPING MODAL --- */}
      {isTipModalOpen && selectedCreatorForTip && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-sm rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-2xl p-5 animate-in zoom-in-95`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-amber-400 flex items-center gap-2">
                <Gift className="w-4 h-4" /> डिजिटल टिप भेजें (Send Tip)
              </h3>
              <button onClick={() => setIsTipModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 text-center">
              <img
                src={selectedCreatorForTip.avatar}
                alt={selectedCreatorForTip.name}
                className="w-16 h-16 rounded-full mx-auto border-2 border-amber-500 object-cover mb-2"
              />
              <h4 className="font-bold text-sm text-slate-100">{selectedCreatorForTip.name}</h4>
              <p className="text-xs text-slate-400">{selectedCreatorForTip.handle}</p>
              <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {selectedCreatorForTip.badgeType || 'Creator'}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {[10, 50, 100, 500].map(amt => (
                <button
                  key={amt}
                  onClick={() => setTipAmount(amt)}
                  className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    tipAmount === amt
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md'
                      : darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 mb-4 space-y-1">
              <div className="flex justify-between">
                <span>टिप राशि:</span>
                <span className="font-bold text-slate-200">₹{tipAmount}</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>प्लेटफ़ॉर्म सहयोग (5%):</span>
                <span>₹{(tipAmount * 0.05).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleSendTip}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold rounded-xl text-xs hover:opacity-95 transition shadow-lg cursor-pointer"
            >
              ₹{tipAmount} अभी भेजें (UPI / कार्ड)
            </button>
          </div>
        </div>
      )}

      {/* --- COMMENTS MODAL --- */}
      {activeCommentsPostId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-2xl p-4 flex flex-col max-h-[80vh]`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-orange-500" /> टिप्पणियाँ (Comments)
              </h3>
              <button onClick={() => setActiveCommentsPostId(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-2 pr-1">
              {(postComments[activeCommentsPostId] || []).map((c, i) => (
                <div key={i} className={`p-2.5 rounded-xl border text-xs ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex justify-between text-[10px] text-slate-500 mb-0.5">
                    <span className="font-bold text-orange-400">@{c.user}</span>
                    <span>{c.time}</span>
                  </div>
                  <p className="text-slate-300">{c.text}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(activeCommentsPostId); }}
                placeholder="अपनी टिप्पणी लिखें..."
                className={`flex-1 p-2 rounded-xl text-xs border focus:outline-none focus:border-orange-500 ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'}`}
              />
              <button
                onClick={() => handleAddComment(activeCommentsPostId)}
                className="px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition cursor-pointer"
              >
                भेजें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- STORY VIEWER MODAL --- */}
      {activeStory && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-950 rounded-2xl overflow-hidden relative border border-slate-800 shadow-2xl">
            <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/80 to-transparent z-10 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <img src={activeStory.avatar} alt={activeStory.name} className="w-8 h-8 rounded-full border border-orange-500 object-cover" />
                <span className="text-xs font-bold">{activeStory.name}</span>
              </div>
              <button onClick={() => setActiveStory(null)} className="p-1 hover:text-orange-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <img src={activeStory.avatar} alt="Story visual" className="w-full h-96 object-cover" />
            <div className="p-4 bg-slate-900 text-center">
              <p className="text-xs text-slate-300">भारत कनेक्ट पर {activeStory.name} की लाइव स्टोरी 🇮🇳</p>
            </div>
          </div>
        </div>
      )}

      {/* --- MOBILE FIXED BOTTOM NAVIGATION BAR --- */}
      <nav className={`fixed bottom-0 left-0 right-0 md:hidden z-40 border-t ${darkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-200'} px-2 py-2 flex items-center justify-around select-none backdrop-blur-md`}>
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center py-1 px-2 cursor-pointer ${activeTab === 'home' ? 'text-orange-500 font-bold' : 'text-slate-400'}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">होम</span>
        </button>

        <button
          onClick={() => setActiveTab('reels')}
          className={`flex flex-col items-center py-1 px-2 cursor-pointer ${activeTab === 'reels' ? 'text-orange-500 font-bold' : 'text-slate-400'}`}
        >
          <Film className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">रील्स</span>
        </button>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-10 h-10 -mt-5 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-slate-900 hover:scale-105 active:scale-95 transition"
        >
          <PlusCircle className="w-5 h-5" />
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          className={`flex flex-col items-center py-1 px-2 cursor-pointer ${activeTab === 'skills' ? 'text-orange-500 font-bold' : 'text-slate-400'}`}
        >
          <Award className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">हुनर</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center py-1 px-2 cursor-pointer ${activeTab === 'profile' ? 'text-orange-500 font-bold' : 'text-slate-400'}`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">प्रोफ़ाइल</span>
        </button>
      </nav>
    </div>
  );
}

// Subcomponent: PostCardItem
function PostCardItem({
  post,
  darkMode,
  onLike,
  onBookmark,
  onRepost,
  onShare,
  onOpenComments,
  onOpenTip
}: {
  post: PostItem;
  darkMode: boolean;
  onLike: () => void;
  onBookmark: () => void;
  onRepost: () => void;
  onShare: () => void;
  onOpenComments: () => void;
  onOpenTip: (creator: PostItem['author']) => void;
}) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioTimerRef = useRef<NodeJS.Timeout | null>(null);

  const toggleAudio = () => {
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      if (audioTimerRef.current) clearInterval(audioTimerRef.current);
    } else {
      setIsPlayingAudio(true);
      setAudioProgress(0);
      audioTimerRef.current = setInterval(() => {
        setAudioProgress(p => {
          if (p >= 100) {
            setIsPlayingAudio(false);
            if (audioTimerRef.current) clearInterval(audioTimerRef.current);
            return 0;
          }
          return p + 3.3;
        });
      }, 1000);
    }
  };

  useEffect(() => {
    return () => {
      if (audioTimerRef.current) clearInterval(audioTimerRef.current);
    };
  }, []);

  return (
    <article className={`rounded-2xl border ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} shadow-sm overflow-hidden transition-all hover:border-slate-700`}>
      
      {/* Header */}
      <div className="flex items-center justify-between p-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full p-[1.5px] bg-gradient-to-tr from-orange-500 to-amber-500 shrink-0">
            <img src={post.author.avatar} alt={post.author.name} className="w-full h-full rounded-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-slate-100">{post.author.name}</span>
              {post.author.verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20" />}
              {post.author.badgeType && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 font-medium">
                  {post.author.badgeType}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
              <span>{post.author.handle}</span>
              <span>•</span>
              <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5 text-orange-400" />{post.author.location}</span>
              <span>•</span>
              <span>{post.author.timeAgo}</span>
            </div>
          </div>
        </div>

        <button className="text-slate-400 hover:text-slate-200 p-1">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Audio Widget for Kabir Doha or Audio Posts */}
      {post.type === 'audio' && (
        <div className="mx-3.5 mb-3 p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-orange-950/30 to-purple-950/20 border border-amber-500/30 shadow-inner">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Mic className="w-4 h-4 text-orange-500" />
              {post.audioTitle || 'आवाज़ (Awaaz Audio)'}
            </span>
            <span className="text-[10px] text-slate-400">{post.audioSubtitle || '0:30 मि'}</span>
          </div>

          <div className="flex items-center gap-3 my-2">
            <button
              onClick={toggleAudio}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md hover:scale-105 active:scale-95 transition cursor-pointer"
            >
              {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <div className="flex-1">
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-300"
                  style={{ width: isPlayingAudio ? `${audioProgress}%` : '40%' }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>{isPlayingAudio ? `0:${Math.floor((audioProgress / 100) * 30).toString().padStart(2, '0')}` : '0:00'}</span>
                <span>0:30</span>
              </div>
            </div>
          </div>

          {post.audioQuote && (
            <p className="text-sm font-serif italic text-slate-200 mt-3 text-center leading-relaxed bg-black/20 p-2.5 rounded-lg border border-amber-500/20">
              {post.audioQuote}
            </p>
          )}
        </div>
      )}

      {/* Caption if provided */}
      {post.caption && (
        <p className="px-3.5 pb-2 text-xs text-slate-200 leading-relaxed">
          {post.caption}
        </p>
      )}

      {/* Image Content */}
      {post.imageUrl && (
        <div className="w-full max-h-96 overflow-hidden bg-black relative select-none">
          <img src={post.imageUrl} alt="Post visual" className="w-full h-full object-cover" />
          {post.watermark && (
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-orange-400 border border-orange-500/30">
              {post.watermark}
            </div>
          )}
        </div>
      )}

      {/* Skill Card Tipping Button */}
      {post.canTip && (
        <div className="mx-3.5 my-2.5 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-amber-300 font-medium">कारीगर का समर्थन करें</span>
          </div>
          <button
            onClick={() => onOpenTip(post.author)}
            className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold rounded-lg text-xs hover:opacity-95 transition cursor-pointer"
          >
            टिप दें (Tip) ₹
          </button>
        </div>
      )}

      {/* Action Buttons Bar */}
      <div className="flex items-center justify-between px-3.5 py-3 border-t border-slate-800/60">
        <div className="flex items-center gap-4">
          {/* Like */}
          <button onClick={onLike} className="flex items-center gap-1.5 text-slate-400 hover:text-red-500 transition cursor-pointer">
            <Heart className={`w-5 h-5 ${post.isLiked ? 'text-red-500 fill-red-500 scale-110' : ''}`} />
            <span className="text-xs font-semibold">{post.likes}</span>
          </button>

          {/* Comment */}
          <button onClick={onOpenComments} className="flex items-center gap-1.5 text-slate-400 hover:text-orange-400 transition cursor-pointer">
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs font-semibold">{post.comments}</span>
          </button>

          {/* Repost */}
          <button onClick={onRepost} className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 transition cursor-pointer" title="Repost">
            <Repeat className="w-4 h-4" />
            <span className="text-xs font-semibold">{post.reposts}</span>
          </button>

          {/* WhatsApp Share */}
          <button onClick={onShare} className="text-slate-400 hover:text-emerald-500 transition cursor-pointer" title="1-Click WhatsApp Share">
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Bookmark */}
        <button onClick={onBookmark} className="text-slate-400 hover:text-amber-400 transition cursor-pointer">
          <Bookmark className={`w-5 h-5 ${post.isBookmarked ? 'text-amber-400 fill-amber-400' : ''}`} />
        </button>
      </div>

      {/* Hashtags */}
      <div className="px-3.5 pb-3 flex flex-wrap gap-1.5">
        {post.hashtags.map((tag, i) => (
          <span key={i} className="text-xs font-medium text-orange-400 hover:underline cursor-pointer">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
