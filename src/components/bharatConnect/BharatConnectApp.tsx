import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, MessageCircle, Share2, Send, Image as ImageIcon, Mic, 
  Sparkles, CheckCircle2, Shield, X, ArrowLeft, QrCode, Copy,
  Check, Play, Pause, Camera, Radio, Compass, Bell, AlertCircle,
  LogOut, LogIn, UserPlus, Lock, Mail, Loader2, Volume2, VolumeX,
  Search, Sun, Moon, Video, TrendingUp, DollarSign, Filter,
  ShoppingBag, Trophy, Star, MapPin, Users, Globe, ShoppingCart
} from 'lucide-react';
import FeedVideoPlayer from './FeedVideoPlayer';
import ProfileView from './ProfileView';
import { useBharatConnect } from '../../context/BharatConnectContext';
import { useAuth } from '../../context/AuthContext';
import { 
  auth, 
  db, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  updateDoc, 
  doc, 
  increment,
  FirebaseUser 
} from '../../lib/firebase';

// --- TYPES (Matching User Blueprint) ---
export type NavigationTab = 'feed' | 'reels' | 'live' | 'store' | 'leaderboard' | 'studio' | 'chat' | 'notifications' | 'profile';
export type Language = 'hi' | 'en' | 'gu';
export type ThemeMode = 'dark' | 'light';
export type StudioTab = 'photo' | 'reel' | 'story' | 'audio';
export type PhotoFilter = 'normal' | 'jaipur_warm' | 'kashi_gold' | 'charcoal';
export type GenreType = 'शायरी' | 'तकनीक' | 'फोटोग्राफी' | 'यात्रा';

export interface ProductItem {
  id: string;
  title: string;
  price: number;
  seller: string;
  image: string;
  rating: number;
}

export interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  badge: string;
  earnings: number;
  likes: number;
}

export interface ReelItem {
  id: string;
  author: string;
  avatar: string;
  caption: string;
  videoUrl: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
}

export interface PostItem {
  id: string;
  author: string;
  avatar: string;
  content: string;
  mediaUrl?: string;
  likes: number;
  comments: number;
  genre: GenreType;
  location?: string;
  badge?: string;
  isFollowing?: boolean;
  isLiked?: boolean;
  timeAgo?: string;
  createdAt?: any;
}

export interface ChatMessageItem {
  id: string;
  sender: 'me' | 'other';
  text?: string;
  mediaUrl?: string;
  audioDuration?: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  type?: 'like' | 'chat' | 'update' | 'tip';
}

// Fallback curated dummy posts with Location and Creator Badges
const FALLBACK_POSTS: PostItem[] = [
  {
    id: 'video_vande_bharat',
    author: 'रेलवे शायर अमन',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100',
    content: 'वंदे भारत एक्सप्रेस - 130 km/h स्पीड ट्रायल 🔥🚆 पटरियों पर दौड़ता नया भारत! #IndianRailways #BharatConnect 🇮🇳',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    likes: 1240,
    comments: 88,
    genre: 'यात्रा',
    location: 'Surat',
    badge: '👑 मास्टर क्रिएटर',
    isFollowing: true,
    timeAgo: 'अभी-अभी'
  },
  {
    id: '1',
    author: 'आकाश शर्मा (काशी)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    content: 'गंगा घाट की शाम और चाय की चुस्की... भारतीय संस्कृति की असली खूबसूरती यहीं बसती है। ☕✨ #भारतकनेक्ट',
    mediaUrl: 'https://images.unsplash.com/photo-1561359313-0639aad4986d?w=800&auto=format&fit=crop&q=80',
    likes: 342,
    comments: 45,
    genre: 'फोटोग्राफी',
    location: 'Jaunpur',
    badge: '📸 टॉप फोटोग्राफर',
    isFollowing: true,
    timeAgo: '15 मिनट पहले'
  },
  {
    id: '2',
    author: 'प्रिया वर्मा',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    content: 'लहरों से डर कर नौका पार नहीं होती, कोशिश करने वालों की कभी हार नहीं होती। 🌊✨ #शायरी #आत्मनिर्भर',
    mediaUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80',
    likes: 512,
    comments: 63,
    genre: 'शायरी',
    location: 'Bharuch',
    badge: '🌟 स्टार शाइर',
    isFollowing: false,
    timeAgo: '2 घंटे पहले'
  },
  {
    id: '3',
    author: 'रोहित टेक',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    content: 'भारत में AI और डिजिटल क्रांति अब हर गांव तक पहुंच रही है। मेड इन इंडिया टेक का स्वर्णिम युग! 🚀🇮🇳 #तकनीक',
    mediaUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    likes: 890,
    comments: 112,
    genre: 'तकनीक',
    location: 'Vadodara',
    badge: '⚡ टेक गुरु',
    isFollowing: true,
    timeAgo: '5 घंटे पहले'
  }
];

// स्वदेशी प्रोडक्ट्स (Swadeshi Creator Store)
const DUMMY_PRODUCTS: ProductItem[] = [
  { 
    id: '1', 
    title: 'स्पेशल सौंफ-धनिया चाय मसाला (200g)', 
    price: 180, 
    seller: 'देसी स्पाइसेस सूरत', 
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300', 
    rating: 4.8 
  },
  { 
    id: '2', 
    title: 'हैंडमेड वर्मीकंपोस्ट खाद (5kg)', 
    price: 250, 
    seller: 'ऑर्गेनिक फार्म्स गुजरात', 
    image: 'https://images.unsplash.com/photo-1585336261026-8f5786372966?w=300', 
    rating: 4.9 
  },
  { 
    id: '3', 
    title: 'भारतीय रेल आर्टवर्क कैनवास', 
    price: 499, 
    seller: 'रेलवे लवर्स आर्ट', 
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300', 
    rating: 4.7 
  },
  { 
    id: '4', 
    title: 'हस्तनिर्मित खादी डायरी व पेन सेट', 
    price: 320, 
    seller: 'खादी ग्रामोद्योग आश्रम', 
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300', 
    rating: 4.9 
  }
];

// साप्ताहिक क्रिएटर लीडरबोर्ड (Weekly Creator Leaderboard)
const DUMMY_LEADERBOARD: LeaderboardUser[] = [
  { id: '1', rank: 1, name: 'अमन सिंह 🇮🇳', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', badge: '👑 मास्टर क्रिएटर', earnings: 1450, likes: 1450 },
  { id: '2', rank: 2, name: 'प्रिया वर्मा', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', badge: '🌟 स्टार शाइर', earnings: 980, likes: 980 },
  { id: '3', rank: 3, name: 'आकाश शर्मा (काशी)', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', badge: '📸 टॉप फोटोग्राफर', earnings: 750, likes: 750 },
  { id: '4', rank: 4, name: 'रोहित टेक', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', badge: '⚡ टेक गुरु', earnings: 620, likes: 620 }
];

// त्रिभाषाई अनुवाद (Translations Dictionary: Hindi, English, Gujarati)
const translations = {
  hi: { 
    feed: '🏠 फ़ीड', 
    reels: '🎥 रील्स', 
    live: '🎙️ लाइव', 
    store: '🛍️ स्टोर', 
    leaderboard: '🏆 लीडरबोर्ड', 
    studio: '➕ स्टूडियो', 
    profile: '👤 प्रोफाइल',
    chat: '💬 चैट',
    notifications: '🔔 अलर्ट',
    searchPlaceholder: '🔍 पोस्ट्स, हैशटैग्स या क्रिएटर खोजें...',
    tip: 'टिप',
    liveRoomTitle: '🔴 भारत लाइव गोष्ठी रूम',
    liveTopic: '"साहित्य व तकनीक चौपाल #12"',
    startLive: '🎙️ गोष्ठी शुरू करें',
    endLive: 'लाइव समाप्त करें',
    buy: 'खरीदें',
    leaderboardSubtitle: 'प्रति लाइक ₹1 नीति के तहत सबसे ज्यादा कमाई करने वाले टॉप क्रिएटर्स'
  },
  en: { 
    feed: '🏠 Feed', 
    reels: '🎥 Reels', 
    live: '🎙️ Live', 
    store: '🛍️ Store', 
    leaderboard: '🏆 Ranks', 
    studio: '➕ Studio', 
    profile: '👤 Profile',
    chat: '💬 Chat',
    notifications: '🔔 Alerts',
    searchPlaceholder: '🔍 Search posts, hashtags or creators...',
    tip: 'Tip',
    liveRoomTitle: '🔴 Bharat Live Audio Room',
    liveTopic: '"Literature & Tech Chaupal #12"',
    startLive: '🎙️ Start Live Room',
    endLive: 'End Live Broadcast',
    buy: 'Buy Now',
    leaderboardSubtitle: 'Top earning creators under the ₹1 per like model'
  },
  gu: { 
    feed: '🏠 ફીડ', 
    reels: '🎥 રીલ્સ', 
    live: '🎙️ લાઈવ', 
    store: '🛍️ સ્ટોર', 
    leaderboard: '🏆 લીડરબોર્ડ', 
    studio: '➕ સ્ટુડિયો', 
    profile: '👤 પ્રોફાઇલ',
    chat: '💬 ચેટ',
    notifications: '🔔 એલર્ટ્સ',
    searchPlaceholder: '🔍 પોસ્ટ્સ, હેશટેગ્સ અથવા ક્રિએટર શોધો...',
    tip: 'ટિપ',
    liveRoomTitle: '🔴 ભારત લાઈવ ગોષ્ઠી રૂમ',
    liveTopic: '"સાહિત્ય અને ટેક ચોપાલ #12"',
    startLive: '🎙️ ગોષ્ઠી શરૂ કરો',
    endLive: 'લાઈવ સમાપ્ત કરો',
    buy: 'ખરીદો',
    leaderboardSubtitle: 'પ્રતિ લાઈક ₹1 નીતિ હેઠળ સૌથી વધુ કમાણી કરતા ટોપ ક્રિએટર્સ'
  },
};

const INITIAL_MESSAGES: ChatMessageItem[] = [
  { 
    id: '1', 
    sender: 'other', 
    text: 'नमस्ते! आपकी रील बहुत पसंद आई। क्या हम किसी नए प्रोजेक्ट पर साथ काम कर सकते हैं?', 
    timestamp: '10:15 AM' 
  },
  {
    id: '2',
    sender: 'me',
    text: 'नमस्ते जी! बिल्कुल, मिलकर कुछ बेहतरीन बनाते हैं।',
    timestamp: '10:18 AM'
  }
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: '1', title: 'नई पसंद ❤️', body: 'आकाश शर्मा ने आपकी रील को पसंद किया।', time: '10 मिनट पहले', unread: true, type: 'like' },
  { id: '2', title: 'संदेश 💬', body: 'प्रिया वर्मा ने आपको एक वॉयस नोट भेजा है।', time: '1 घंटा पहले', unread: true, type: 'chat' },
  { id: '3', title: 'सुपर थैंक्स 💖', body: 'रोहित टेक ने आपको ₹50 का UPI सुपर थैंक्स भेजा!', time: '2 घंटे पहले', unread: true, type: 'tip' },
  { id: '4', title: 'क्रिएटर अपडेट 🚀', body: 'आपकी रील "यात्रा" ट्रेंडिंग में आ गई है!', time: 'कल', unread: false, type: 'update' }
];

const INITIAL_REELS: ReelItem[] = [
  {
    id: 'reel_1',
    author: 'अमन शर्मा (रेलवे शायर)',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100',
    caption: 'वंदे भारत एक्सप्रेस - 130 km/h स्पीड ट्रायल 🔥🚆 पटरियों पर दौड़ता नया भारत! #IndianRailways #BharatConnect 🇮🇳',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    likes: 1240,
    comments: 88,
    shares: 45
  },
  {
    id: 'reel_2',
    author: 'नेहा गुप्ता (काशी दर्शन)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    caption: 'दशाश्वमेध घाट पर दिव्य महाआरती 🪔✨ अध्यात्म, शांति और भारतीय संस्कृति का पावन संगम। #Kashi #Varanasi',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    likes: 3820,
    comments: 490,
    shares: 420
  },
  {
    id: 'reel_3',
    author: 'रोहित टेक (Digital India)',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    caption: 'भारत का सेमीकंडक्टर मिशन और स्वदेशी सुपरकंप्यूटिंग 🚀🇮🇳 आत्मनिर्भर भारत की नई उड़ान! #TechIndia',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    likes: 2150,
    comments: 215,
    shares: 130
  }
];

export default function BharatConnectApp() {
  const { 
    currentUser, 
    openSOSModal, 
    setToastMessage,
    setActiveTab: setGlobalActiveTab
  } = useBharatConnect();
  const { user: globalAuthUser } = useAuth();

  // --- थीम व भाषा स्टेट्स (Theme & Multilingual) ---
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const isDark = theme === 'dark';
  const [lang, setLang] = useState<Language>('hi');
  const t = translations[lang];

  // --- ऑथेंटिकेशन स्टेट्स (Firebase Auth) ---
  const [user, setUser] = useState<FirebaseUser | null>(auth.currentUser || globalAuthUser || null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // --- नेविगेशन & स्टूडियो स्टेट्स ---
  const [currentTab, setCurrentTab] = useState<NavigationTab>('feed');
  const [studioTab, setStudioTab] = useState<StudioTab>('photo');
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<PhotoFilter>('normal');
  const [selectedGenre, setSelectedGenre] = useState<GenreType>('फोटोग्राफी');
  const [isCompressing, setIsCompressing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // --- स्थान फ़िल्टर (Location Filter) ---
  const [selectedLocation, setSelectedLocation] = useState<string>('सभी स्थान');

  // --- भारत लाइव गोष्ठी रूम स्टेट्स (Live Audio/Video Room) ---
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [liveListenersCount, setLiveListenersCount] = useState(45);

  // --- फ़ीड स्टेट्स (खोज, टैग्स & लाइव डेटा) ---
  const [feedTab, setFeedTab] = useState<'following' | 'foryou'>('foryou');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<'सभी' | GenreType>('सभी');
  const [posts, setPosts] = useState<PostItem[]>(FALLBACK_POSTS);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // --- रील्स स्टेट्स ---
  const [reelsList, setReelsList] = useState<ReelItem[]>(INITIAL_REELS);
  const [reelsMuted, setReelsMuted] = useState(true);

  // --- सुपर थैंक्स / UPI टिपिंग स्टेट्स ---
  const [tippingAuthor, setTippingAuthor] = useState<{ author: string; id: string } | null>(null);
  const [customTipAmount, setCustomTipAmount] = useState('50');
  const [tipSuccessState, setTipSuccessState] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // --- चैट स्टेट्स ---
  const [messages, setMessages] = useState<ChatMessageItem[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const chatMediaInputRef = useRef<HTMLInputElement | null>(null);

  // --- नोटिफिकेशन्स स्टेट्स ---
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const unreadCount = notifications.filter(n => n.unread).length;

  // --- ऑथेंटिकेशन लिसनर ---
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth();
  }, []);

  // --- फायरस्टोर से रियल-टाइम फीड लोड करना ---
  useEffect(() => {
    let unsubscribePosts: (() => void) | undefined;
    try {
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      unsubscribePosts = onSnapshot(q, (querySnapshot) => {
        if (!querySnapshot.empty) {
          const postsList: PostItem[] = [];
          querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            postsList.push({
              id: docSnap.id,
              author: data.author || 'भारतीय क्रिएटर',
              avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
              content: data.content || '',
              mediaUrl: data.mediaUrl || undefined,
              likes: data.likes || 0,
              comments: data.comments || 0,
              genre: (data.genre as GenreType) || 'फोटोग्राफी',
              location: data.location || 'Surat, Gujarat',
              badge: data.badge || '👑 ट्रेनर क्रिएटर',
              isFollowing: true,
              timeAgo: 'अभी-अभी'
            });
          });
          setPosts(postsList);
        } else {
          // If Firestore collection is empty, retain fallback posts
          setPosts(FALLBACK_POSTS);
        }
        setLoadingPosts(false);
      }, (error) => {
        console.warn("Firestore live feed note:", error);
        setPosts(FALLBACK_POSTS);
        setLoadingPosts(false);
      });
    } catch {
      setPosts(FALLBACK_POSTS);
      setLoadingPosts(false);
    }

    return () => {
      if (unsubscribePosts) unsubscribePosts();
    };
  }, []);

  // Voice recording timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

  // --- लॉगिन / साइन-अप हैंडलर ---
  const handleAuthAction = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);

    if (!email || !password) {
      setAuthError('कृपया ईमेल और पासवर्ड दर्ज करें।');
      return;
    }

    setIsAuthLoading(true);
    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email.trim(), password);
        setToastMessage?.('लॉगिन सफल रहा! 🇮🇳 स्वागत है।');
      } else {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
        setToastMessage?.('सफलता! नया अकाउंट बन गया है! 🎉');
      }
    } catch (error: any) {
      console.warn("Auth action note:", error);
      const friendlyMsg = error.code === 'auth/wrong-password' 
        ? 'गलत पासवर्ड। कृपया पुनः प्रयास करें।'
        : error.code === 'auth/user-not-found'
        ? 'इस ईमेल से कोई खाता नहीं मिला। रजिस्टर करें।'
        : error.code === 'auth/email-already-in-use'
        ? 'यह ईमेल पहले से पंजीकृत है। लॉगिन करें।'
        : (error.message || 'ऑथेंटिकेशन में त्रुटि हुई।');
      setAuthError(friendlyMsg);
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Quick Demo Login for instant evaluation
  const handleQuickDemoLogin = () => {
    const demoUser = {
      uid: 'demo_user_123',
      email: 'creator@bharatconnect.in',
      displayName: 'आकाश शर्मा (काशी)'
    } as FirebaseUser;
    setUser(demoUser);
    setToastMessage?.('डेमो क्रिएटर के रूप में लॉगिन किया गया! 🚀');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {
      // Local fallback
    }
    setUser(null);
    setToastMessage?.('आप सफलतापूर्वक लॉगआउट हो गए हैं।');
  };

  // --- मीडिया पिकर & कम्प्रेशन लॉजिक ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const url = URL.createObjectURL(file);

    if (isImage) {
      setIsCompressing(true);
      setTimeout(() => {
        setMediaUri(url);
        setIsCompressing(false);
        setToastMessage?.('इमेज चुनी गई (WebP 80% कम्प्रेशन लागू)');
      }, 400); // क्लाइंट-साइड WebP कम्प्रेशन सिमुलेशन
    } else {
      setMediaUri(url);
    }
  };

  // --- फायरस्टोर में पोस्ट पब्लिश करना ---
  const handlePublish = async () => {
    if (!mediaUri && !caption.trim()) {
      alert('खाली पोस्ट: कृपया कुछ लिखें या मीडिया जोड़ें।');
      return;
    }

    setIsPublishing(true);
    const authorName = user?.displayName || (user?.email ? user.email.split('@')[0] : 'भारतीय क्रिएटर');
    const avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100';

    try {
      // फायरस्टोर क्लाउड में पोस्ट जोड़ना
      await addDoc(collection(db, "posts"), {
        author: authorName,
        avatar: avatarUrl,
        content: caption.trim(),
        mediaUrl: mediaUri || '',
        likes: 0,
        comments: 0,
        genre: selectedGenre,
        location: selectedLocation !== 'सभी स्थान' ? selectedLocation : 'Surat, Gujarat',
        badge: '👑 ट्रेनर क्रिएटर',
        createdAt: new Date(),
      });

      setToastMessage?.(`सफलता! 🎉 आपकी ${studioTab.toUpperCase()} पोस्ट क्लाउड पर प्रकाशित हो गई है!`);
    } catch (error: any) {
      console.warn("Firestore publish note:", error);
      // Local state fallback if cloud Firestore is in offline mode
      const newPost: PostItem = {
        id: `local_${Date.now()}`,
        author: authorName,
        avatar: avatarUrl,
        content: caption.trim(),
        mediaUrl: mediaUri || undefined,
        likes: 0,
        comments: 0,
        genre: selectedGenre,
        location: selectedLocation !== 'सभी स्थान' ? selectedLocation : 'Surat, Gujarat',
        badge: '👑 ट्रेनर क्रिएटर',
        isFollowing: true,
        timeAgo: 'अभी-अभी'
      };
      setPosts(prev => [newPost, ...prev]);
      setToastMessage?.(`पोस्ट प्रकाशित हो गई है! 🎉`);
    } finally {
      setIsPublishing(false);
      setMediaUri(null);
      setCaption('');
      setCurrentTab('feed');
    }
  };

  // --- लाइक बढ़ाना (फायरस्टोर अपडेट) ---
  const handleLike = async (postId: string) => {
    // Optimistic UI update
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isNowLiked = !p.isLiked;
        return {
          ...p,
          isLiked: isNowLiked,
          likes: isNowLiked ? p.likes + 1 : Math.max(0, p.likes - 1)
        };
      }
      return p;
    }));

    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        likes: increment(1)
      });
    } catch (error) {
      console.warn("Like update note:", error);
    }
  };

  // --- UPI टिपिंग / सुपर थैंक्स ---
  const handleSupportCreator = (authorName: string, postId: string) => {
    setTippingAuthor({ author: authorName, id: postId });
    setTipSuccessState(false);
    setCustomTipAmount('50');
  };

  const executeTipPayment = (amount: string) => {
    const author = tippingAuthor?.author || 'क्रिएटर';
    setTipSuccessState(true);
    setTimeout(() => {
      setToastMessage?.(`₹${amount} सफलतापूर्वक ${author} को UPI द्वारा भेजे गए! 💖 धन्यवाद!`);
      setNotifications(prev => [
        {
          id: `tip_${Date.now()}`,
          title: 'सुपर थैंक्स भेजा 💖',
          body: `आपने ${author} को ₹${amount} की सहायता राशि भेजी।`,
          time: 'अभी-अभी',
          unread: true,
          type: 'tip'
        },
        ...prev
      ]);
      setTippingAuthor(null);
      setTipSuccessState(false);
    }, 1200);
  };

  // --- चैट फंक्शन्स ---
  const handleSendChatMessage = () => {
    if (!inputText.trim()) return;
    const newMsg: ChatMessageItem = {
      id: Date.now().toString(),
      sender: 'me',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'other',
          text: 'धन्यवाद संदेश के लिए! मैं जल्द ही उत्तर दूंगा। 🙏🇮🇳',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  const handleVoiceRecordToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      setToastMessage?.('🎙️ वॉयस नोट रिकॉर्ड हो रहा है...');
    } else {
      setIsRecording(false);
      const duration = recordingSeconds > 0 ? `${recordingSeconds}s` : '24s';
      const voiceMsg: ChatMessageItem = {
        id: Date.now().toString(),
        sender: 'me',
        text: `🎤 वॉयस संदेश (${duration})`,
        audioDuration: duration,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, voiceMsg]);
      setToastMessage?.('वॉयस संदेश भेजा गया! 🎙️');
    }
  };

  const handleChatImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const imgMsg: ChatMessageItem = {
      id: Date.now().toString(),
      sender: 'me',
      mediaUrl: url,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, imgMsg]);
    setToastMessage?.('फोटो भेजी गई 📷');
  };

  // --- AI कैप्शन जनरेशन (BharatAI) ---
  const handleGenerateAiCaption = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      const AI_CAPTIONS: Record<GenreType, string[]> = {
        'शायरी': [
          'हवाओं से कह दो अपनी हद में रहें, हम परों से नहीं हौसलों से उड़ते हैं। ✨🇮🇳 #शायरी #BharatConnect',
          'चाय की खुशबू और सुबह का अहसास, भारत की मिट्टी में है कुछ खास। ☕❤️ #काव्य #भारतीयता',
          'मंजिल उन्हीं को मिलती है जिनके सपनों में जान होती है, पंखों से कुछ नहीं होता हौसलों से उड़ान होती है! 🦅✨'
        ],
        'तकनीक': [
          'डिजिटल भारत की नई पहचान! जब तकनीक और परंपरा का संगम होता है, तब इतिहास बनता है। 💻🚀 #TechIndia #MadeInIndia',
          'आत्मनिर्भर भारत का सपना अब हकीकत बन रहा है। देशी इनोवेशन से दुनिया को दिशा दिखाएंगे! 🇮🇳⚙️',
          'AI और क्लाउड कंप्यूटिंग के नए युग में भारत का डंका बज रहा है। गर्व से भारतीय! 🌐⚡'
        ],
        'फोटोग्राफी': [
          'भारतीय संस्कृति के वो अनमोल रंग जो हर दिल को छू लें। कैमरे की नज़र से एक खूबसूरत पल! 📸✨ #BharatDarshan',
          'घाटों की शांति, दीपों की रोशनी और गंगा की पावन धारा... काशी का जादू! 🪔🌊',
          'सुबह की पहली किरण जब खेतों को चूमती है, तो भारत मुस्कुराता है। 🌅🌾'
        ],
        'यात्रा': [
          'हिमालय की चोटियों से लेकर दक्षिण के सागर तटों तक, हमारा भारत अतुल्य और अद्भुत है! 🏔️🚆 #IncredibleIndia',
          'वंदे भारत की रफ्तार और भारत का गौरव! यात्रा केवल रास्तों की नहीं, दिलों के जुड़ाव की है। 🇮🇳🛤️',
          'राजस्थान के ऐतिहासिक किलो की भव्यता और गौरवशाली गाथाएं। चलो भारत देखें! 🏰✨'
        ]
      };
      const list = AI_CAPTIONS[selectedGenre] || AI_CAPTIONS['फोटोग्राफी'];
      const randomCaption = list[Math.floor(Math.random() * list.length)];
      setCaption(randomCaption);
      setIsAiGenerating(false);
      setToastMessage?.('🤖 BharatAI ने आपके लिए नया आकर्षक कैप्शन तैयार कर दिया!');
    }, 600);
  };

  // --- रील लाइक हैंडलर (प्रति लाइक ₹1 मॉडल) ---
  const handleReelLike = (reelId: string) => {
    setReelsList(prev => prev.map(r => {
      if (r.id === reelId) {
        const isNowLiked = !r.isLiked;
        return {
          ...r,
          isLiked: isNowLiked,
          likes: isNowLiked ? r.likes + 1 : Math.max(0, r.likes - 1)
        };
      }
      return r;
    }));
  };

  const getFilterStyle = (f: PhotoFilter) => {
    switch (f) {
      case 'jaipur_warm':
        return 'sepia(0.25) saturate(1.35) contrast(1.05) brightness(1.02)';
      case 'kashi_gold':
        return 'sepia(0.4) saturate(1.45) brightness(1.08) contrast(1.1)';
      case 'charcoal':
        return 'grayscale(1) contrast(1.4) brightness(0.95)';
      default:
        return 'none';
    }
  };

  // =========================================================================
  // --- यदि यूज़र लॉग-इन नहीं है तो लॉगिन/रजिस्टर स्क्रीन दिखाएं ---
  // =========================================================================
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-4 font-sans text-slate-100">
        <div className="w-full max-w-sm bg-[#1E293B] border border-[#334155] rounded-3xl p-6 shadow-2xl relative">
          
          {/* Top Logo & App Title */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 mx-auto flex items-center justify-center text-3xl shadow-lg mb-3">
              🇮🇳
            </div>
            <h1 className="text-xl font-black text-[#F8FAFC]">
              भारतकनेक्ट <span className="text-orange-500 text-sm font-semibold">(BharatConnect)</span>
            </h1>
            <p className="text-[#94A3B8] text-xs mt-1">
              {isLoginMode ? 'अपने खाते में लॉगिन करें' : 'नया खाता बनाएं'}
            </p>
          </div>

          {/* Error Notice */}
          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAuthAction} className="space-y-3">
            <div>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input
                  type="email"
                  placeholder="ईमेल आईडी (Email)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FF6B00]"
                  required
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input
                  type="password"
                  placeholder="पासवर्ड (Password)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FF6B00]"
                  required
                />
              </div>
            </div>

            {/* Auth Action Button */}
            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full bg-[#FF6B00] hover:bg-orange-600 active:scale-[0.99] text-white font-bold py-3.5 rounded-xl text-sm transition shadow-lg shadow-orange-500/20 cursor-pointer flex items-center justify-center gap-2"
            >
              {isAuthLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>प्रतीक्षा करें...</span>
                </>
              ) : (
                <span>{isLoginMode ? 'लॉगिन करें' : 'रजिस्टर करें'}</span>
              )}
            </button>
          </form>

          {/* Toggle Login / Register */}
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setAuthError(null);
              }}
              className="text-[#38BDF8] hover:underline text-xs font-semibold cursor-pointer"
            >
              {isLoginMode ? 'नया खाता नहीं है? रजिस्टर करें' : 'पहिले से खाता है? लॉगिन करें'}
            </button>
          </div>

          {/* 1-Click Demo Login Divider & Button */}
          <div className="mt-5 pt-4 border-t border-slate-700/60 text-center">
            <p className="text-[11px] text-slate-400 mb-2.5">त्वरित परीक्षण के लिए:</p>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-orange-400 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>डेमो क्रिएटर के रूप में सीधे प्रवेश करें 🚀</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // --- मुख्य ऐप इंटरफेस (जब यूजर लॉग-इन हो) ---
  // =========================================================================

  // 1. फ़ीड (Feed View)
  const renderFeed = () => {
    let displayedPosts = feedTab === 'following' ? posts.filter(p => p.isFollowing) : posts;

    // Filter by Genre Tag
    if (selectedTag !== 'सभी') {
      displayedPosts = displayedPosts.filter(p => p.genre === selectedTag);
    }

    // Filter by Location
    if (selectedLocation !== 'सभी स्थान' && selectedLocation !== 'सभी') {
      displayedPosts = displayedPosts.filter(p => 
        (p.location && p.location.toLowerCase().includes(selectedLocation.toLowerCase()))
      );
    }

    // Filter by Search Query (content, author, genre, location)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      displayedPosts = displayedPosts.filter(p => 
        p.content.toLowerCase().includes(q) || 
        p.author.toLowerCase().includes(q) ||
        (p.genre && p.genre.toLowerCase().includes(q)) ||
        (p.location && p.location.toLowerCase().includes(q))
      );
    }

    return (
      <div className="flex-1 flex flex-col">
        {/* Following / For You SubHeader */}
        <div className={`flex items-center justify-center gap-2 px-4 py-2 border-b sticky top-0 z-20 transition-colors ${
          isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-slate-200'
        }`}>
          <button
            onClick={() => setFeedTab('following')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
              feedTab === 'following' 
                ? 'bg-[#FF6B00] text-white shadow-md' 
                : isDark ? 'text-[#94A3B8] hover:text-white' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            फॉलोइंग
          </button>
          <button
            onClick={() => setFeedTab('foryou')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
              feedTab === 'foryou' 
                ? 'bg-[#FF6B00] text-white shadow-md' 
                : isDark ? 'text-[#94A3B8] hover:text-white' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            ✨ आपके लिए (For You)
          </button>
        </div>

        {/* खोज बार, शैली टैग्स और लोकेशन फ़िल्टर बार */}
        <div className={`px-3 pt-2.5 pb-2 border-b transition-colors ${
          isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-slate-200'
        }`}>
          {/* Search Input */}
          <div className="relative mb-2">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            <input
              type="text"
              placeholder={t.searchPlaceholder || "🔍 पोस्ट्स, हैशटैग्स या क्रिएटर खोजें..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full ${
                isDark 
                  ? 'bg-[#0F172A] border-[#334155] text-white placeholder-slate-500' 
                  : 'bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-400'
              } border rounded-xl pl-9 pr-8 py-2 text-xs focus:outline-none focus:border-[#FF6B00] transition`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Genre Tag Chips */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1.5">
            {(['सभी', 'शायरी', 'तकनीक', 'फोटोग्राफी', 'यात्रा'] as const).map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-[#FF6B00] text-white shadow-sm'
                    : isDark
                    ? 'bg-[#0F172A] border border-[#334155] text-slate-300 hover:text-white'
                    : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tag === 'सभी' ? '🌐 सभी' : `#${tag}`}
              </button>
            ))}
          </div>

          {/* Location Filter Pills */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-1.5 border-t border-slate-700/30">
            {['सभी स्थान', 'Surat', 'Jaunpur', 'Bharuch', 'Vadodara'].map((loc) => (
              <button
                key={loc}
                onClick={() => setSelectedLocation(loc)}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
                  selectedLocation === loc
                    ? 'bg-[#FF6B00] text-white shadow-sm'
                    : isDark
                    ? 'bg-slate-800 text-slate-300 border border-slate-700'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <span>📍</span>
                <span>{loc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Posts List or Loader */}
        {loadingPosts ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#FF6B00]">
            <Loader2 className="w-8 h-8 animate-spin mb-3" />
            <p className="text-xs text-slate-400">फायरस्टोर से फ़ीड लोड हो रहा है...</p>
          </div>
        ) : displayedPosts.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-sm">
              {searchQuery || selectedTag !== 'सभी' || selectedLocation !== 'सभी स्थान' 
                ? 'कोई मेल खाती पोस्ट नहीं मिली।' 
                : 'कोई पोस्ट उपलब्ध नहीं है।'}
            </p>
            {searchQuery || selectedTag !== 'सभी' || selectedLocation !== 'सभी स्थान' ? (
              <button
                onClick={() => { setSearchQuery(''); setSelectedTag('सभी'); setSelectedLocation('सभी स्थान'); }}
                className="mt-3 px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-semibold"
              >
                फ़िल्टर साफ़ करें
              </button>
            ) : (
              <button
                onClick={() => setCurrentTab('studio')}
                className="mt-3 px-4 py-2 bg-[#FF6B00] text-white rounded-xl text-xs font-bold"
              >
                स्टूडियो से पहली पोस्ट डालें!
              </button>
            )}
          </div>
        ) : (
          <div className="p-3 space-y-3">
            {displayedPosts.map((item) => {
              // जितने लाइक्स, उतने पैसे (₹1 प्रति लाइक मॉडल)
              const currentEarnings = (item.likes || 0) * 1;

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl p-3.5 border shadow-lg transition-colors ${
                    isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-slate-200'
                  }`}
                >
                  {/* Header with Creator Info, Location, Badge & Earnings Badge */}
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.avatar}
                        alt={item.author}
                        className="w-9 h-9 rounded-full object-cover border border-[#FF6B00]"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold text-sm leading-tight`}>{item.author}</h4>
                          {item.badge && (
                            <span className="bg-orange-500/20 text-[#FF6B00] text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[#FF6B00] text-[10px] font-semibold">#{item.genre || 'सामान्य'}</span>
                          <span className="text-slate-400 text-[10px] flex items-center gap-0.5">
                            <MapPin size={10} />
                            <span>{item.location || 'भारत'}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* अर्निंग्स ट्रैकर बैज (₹1 प्रति लाइक) + टिप */}
                    <div className="flex items-center gap-1.5">
                      <div className="bg-emerald-500/15 border border-emerald-500/50 px-2 py-0.5 rounded-lg text-emerald-400 font-bold text-xs flex items-center gap-1 shadow-sm" title="प्रति लाइक ₹1 कमाई">
                        <span>💰</span>
                        <span className="font-mono">₹{currentEarnings}</span>
                      </div>

                      <button
                        onClick={() => handleSupportCreator(item.author, item.id)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#FF6B00] text-[#FF6B00] text-xs font-bold transition cursor-pointer ${
                          isDark ? 'bg-[#334155] hover:bg-orange-500/10' : 'bg-orange-50 hover:bg-orange-100'
                        }`}
                      >
                        <span>☕</span>
                        <span>{t.tip || 'टिप'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Text Content */}
                  <p className={`${isDark ? 'text-[#CBD5E1]' : 'text-slate-700'} text-sm leading-relaxed mb-2.5 whitespace-pre-line`}>
                    {item.content}
                  </p>

                  {/* Media: Video with Autoplay & Sound Toggle OR Image */}
                  {item.mediaUrl && (
                    /\.(mp4|webm|mov|m4v)/i.test(item.mediaUrl) || item.mediaUrl.includes('gtv-videos-bucket') || (item.genre === 'यात्रा' && item.mediaUrl.endsWith('.mp4')) ? (
                      <FeedVideoPlayer mediaUrl={item.mediaUrl} content={item.content} />
                    ) : (
                      <div className="mb-2.5 rounded-xl overflow-hidden border border-slate-700/60 bg-black">
                        <img
                          src={item.mediaUrl}
                          alt="पोस्ट मीडिया"
                          className="w-full max-h-80 object-cover"
                          loading="lazy"
                        />
                      </div>
                    )
                  )}

                  {/* Actions Bar */}
                  <div className={`flex items-center justify-around pt-2.5 border-t text-xs font-semibold ${
                    isDark ? 'border-[#334155] text-[#94A3B8]' : 'border-slate-100 text-slate-500'
                  }`}>
                    <button
                      onClick={() => handleLike(item.id)}
                      className={`flex items-center gap-1.5 transition active:scale-125 cursor-pointer ${
                        item.isLiked ? 'text-rose-500 font-bold' : 'hover:text-rose-400'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${item.isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{item.likes || 0}</span>
                    </button>

                    <button
                      onClick={() => alert(`टिप्पणियाँ: ${item.author} की इस पोस्ट पर बातचीत जल्द आ रही है!`)}
                      className="flex items-center gap-1.5 hover:text-blue-400 transition cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{item.comments || 0}</span>
                    </button>

                    <button
                      onClick={() => {
                        const msg = `🇮🇳 भारतकनेक्ट पर ${item.author} की पोस्ट देखें:\n"${item.content}"\n\n#BharatConnect #MadeInIndia`;
                        if (navigator.share) {
                          navigator.share({ title: 'BharatConnect', text: msg }).catch(() => {});
                        } else {
                          navigator.clipboard?.writeText(msg);
                          setToastMessage?.('शेयर लिंक कॉपी किया गया! ↗️');
                        }
                      }}
                      className="flex items-center gap-1.5 hover:text-emerald-400 transition cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>शेयर</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // 2. रील्स (Reels View - 9:16 Vertical Video Feed)
  const renderReels = () => (
    <div className="flex-1 flex flex-col bg-black overflow-y-auto">
      {reelsList.map((reel) => (
        <div 
          key={reel.id} 
          className="relative w-full h-[calc(100vh-130px)] min-h-[520px] flex flex-col justify-end bg-black border-b border-slate-900 overflow-hidden"
        >
          {/* Reel Video Player */}
          <video
            src={reel.videoUrl}
            autoPlay
            loop
            muted={reelsMuted}
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Video Gradient Overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90 pointer-events-none" />

          {/* Floating Sound Toggle */}
          <button
            onClick={() => {
              setReelsMuted(!reelsMuted);
              setToastMessage?.(reelsMuted ? 'ध्वनि चालू 🔊' : 'ध्वनि बंद 🔇');
            }}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center hover:bg-black/80 transition cursor-pointer"
            title={reelsMuted ? 'अनम्यूट करें' : 'म्यूट करें'}
          >
            {reelsMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          {/* Floating Right Actions */}
          <div className="absolute right-3 bottom-16 z-20 flex flex-col items-center gap-4">
            {/* Like & Earn Button */}
            <button
              onClick={() => handleReelLike(reel.id)}
              className="flex flex-col items-center gap-1 group cursor-pointer"
            >
              <div className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition ${
                reel.isLiked 
                  ? 'bg-rose-600 text-white scale-110 shadow-lg shadow-rose-600/50' 
                  : 'bg-black/60 text-white hover:bg-black/80 border border-white/20'
              }`}>
                <Heart className={`w-5 h-5 ${reel.isLiked ? 'fill-white text-white' : ''}`} />
              </div>
              <span className="text-[11px] font-bold text-white shadow-sm font-mono">{reel.likes}</span>
            </button>

            {/* Comments */}
            <button
              onClick={() => alert(`टिप्पणियाँ: ${reel.author} की रील पर बातचीत जल्द आ रही है!`)}
              className="flex flex-col items-center gap-1 cursor-pointer"
            >
              <div className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center hover:bg-black/80 transition">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-white shadow-sm font-mono">{reel.comments}</span>
            </button>

            {/* Share */}
            <button
              onClick={() => {
                const msg = `🇮🇳 भारतकनेक्ट पर ${reel.author} की रील देखें:\n"${reel.caption}"\n\n#BharatConnect #MadeInIndia`;
                if (navigator.share) {
                  navigator.share({ title: 'BharatConnect Reel', text: msg }).catch(() => {});
                } else {
                  navigator.clipboard?.writeText(msg);
                  setToastMessage?.('रील लिंक कॉपी किया गया! ↗️');
                }
              }}
              className="flex flex-col items-center gap-1 cursor-pointer"
            >
              <div className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center hover:bg-black/80 transition">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-white shadow-sm font-mono">{reel.shares}</span>
            </button>

            {/* Super Thanks Tip */}
            <button
              onClick={() => handleSupportCreator(reel.author, reel.id)}
              className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-600 to-orange-500 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition cursor-pointer"
              title="क्रिएटर को टिप दें"
            >
              <span className="text-base">☕</span>
            </button>
          </div>

          {/* Bottom Reel Details Overlay */}
          <div className="relative z-10 p-4 pr-16 space-y-2 select-none">
            {/* Real-time Earnings Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/25 border border-emerald-400/60 text-emerald-300 font-bold text-xs backdrop-blur-md shadow-md">
              <span className="text-sm">💰</span>
              <span>कमाई: ₹{reel.likes} (₹1 प्रति लाइक)</span>
            </div>

            {/* Author */}
            <div className="flex items-center gap-2.5">
              <img
                src={reel.avatar}
                alt={reel.author}
                className="w-9 h-9 rounded-full object-cover border-2 border-[#FF6B00]"
              />
              <span className="text-white font-bold text-sm drop-shadow">{reel.author}</span>
              <button
                onClick={() => setToastMessage?.(`${reel.author} को फॉलो किया गया! 🇮🇳`)}
                className="px-2.5 py-0.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-[11px] font-semibold backdrop-blur-md transition"
              >
                + फॉलो
              </button>
            </div>

            {/* Caption */}
            <p className="text-slate-100 text-xs leading-relaxed drop-shadow line-clamp-3">
              {reel.caption}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  // 3. स्टूडियो (Studio View)
  const renderStudio = () => (
    <div className={`flex-1 p-4 overflow-y-auto max-w-lg mx-auto w-full transition-colors ${
      isDark ? 'text-slate-100' : 'text-slate-900'
    }`}>
      {/* क्रिएटर अर्निंग्स पॉलिसी बैनर (Creator Studio Policy Banner) */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-800 to-amber-950/30 border border-emerald-500/40 rounded-2xl p-3.5 mb-4 text-xs shadow-md">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-base">🎯</span>
          <span className="font-bold text-emerald-400 text-sm">क्रिएटर अर्निंग्स पॉलिसी</span>
          <span className="ml-auto bg-emerald-500/20 text-emerald-300 font-extrabold px-2 py-0.5 rounded text-[10px] border border-emerald-500/30">
            1 लाइक = ₹1 कैश रिवॉर्ड
          </span>
        </div>
        <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} leading-relaxed text-[11px]`}>
          हर 1 लाइक पर आपको सीधे <strong className="text-emerald-400 font-bold">₹1</strong> की राशि मिलती है! बेहतरीन ओरिजिनल सामग्री बनाएं और भारतीय दर्शकों के प्यार से सीधे कमाई करें।
        </p>
      </div>

      {/* Studio Tabs Header */}
      <div className={`flex items-center justify-around p-2 rounded-xl mb-4 border transition-colors ${
        isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        {(['photo', 'reel', 'story', 'audio'] as StudioTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setStudioTab(tab);
              setMediaUri(null);
            }}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
              studioTab === tab ? 'bg-[#FF6B00] text-white shadow-md' : isDark ? 'text-[#94A3B8]' : 'text-slate-500'
            }`}
          >
            {tab === 'photo' ? '📸 फोटो' : tab === 'reel' ? '🎥 रील' : tab === 'story' ? '⭕ स्टोरी' : '🎙️ आवाज़'}
          </button>
        ))}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={studioTab === 'reel' ? 'video/*' : studioTab === 'audio' ? 'audio/*' : 'image/*'}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Preview Box */}
      <div
        className={`w-full rounded-xl flex flex-col justify-center items-center border mb-4 relative overflow-hidden transition-colors ${
          isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-slate-300 shadow-inner'
        } ${studioTab === 'reel' ? 'h-96' : 'h-60'}`}
      >
        {isCompressing ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-[#FF6B00] animate-spin" />
            <p className="text-[#FF6B00] text-xs font-semibold">WebP कम्प्रेशन सिमुलेशन...</p>
          </div>
        ) : mediaUri ? (
          <div className="relative w-full h-full">
            {studioTab === 'reel' ? (
              <video src={mediaUri} controls className="w-full h-full object-contain bg-black" />
            ) : studioTab === 'audio' ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                <Mic className="w-16 h-16 text-orange-500 mb-3 animate-pulse" />
                <p className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold text-sm`}>ऑडियो लोड हो गया है</p>
                <audio src={mediaUri} controls className="mt-4 w-full" />
              </div>
            ) : (
              <img
                src={mediaUri}
                alt="पूर्वावलोकन"
                style={{ filter: getFilterStyle(selectedFilter) }}
                className="w-full h-full object-cover"
              />
            )}
            <button
              onClick={() => setMediaUri(null)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-rose-600 transition"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center gap-2 p-6 text-center cursor-pointer"
          >
            <span className="text-3xl text-[#FF6B00] font-light">➕</span>
            <p className={`${isDark ? 'text-white' : 'text-slate-800'} font-semibold text-sm`}>
              {studioTab === 'reel' ? '9:16 रील वीडियो चुनें' : 'फोटो चुनें (WebP कम्प्रेशन)'}
            </p>
            <span className="text-[11px] text-slate-400">गैलरी या कैमरा से अपलोड करें</span>
          </button>
        )}
      </div>

      {/* Filter chips (Photo Studio) */}
      {studioTab === 'photo' && mediaUri && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
          {(['normal', 'jaipur_warm', 'kashi_gold', 'charcoal'] as PhotoFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition cursor-pointer whitespace-nowrap ${
                selectedFilter === f
                  ? 'border-[#FF6B00] text-[#FF6B00]'
                  : isDark ? 'border-[#334155] bg-[#1E293B] text-[#94A3B8]' : 'border-slate-300 bg-slate-100 text-slate-700'
              }`}
            >
              {f === 'normal' ? 'साधारण' : f === 'jaipur_warm' ? 'जयपुर वॉर्म' : f === 'kashi_gold' ? 'काशी गोल्ड' : 'चारकोल'}
            </button>
          ))}
        </div>
      )}

      {/* Genre Selection Chips */}
      <div className="mb-3">
        <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          शैली / श्रेणी (Genre):
        </label>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {(['शायरी', 'तकनीक', 'फोटोग्राफी', 'यात्रा'] as GenreType[]).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setSelectedGenre(g)}
              className={`px-3 py-1 rounded-xl text-xs font-bold border transition cursor-pointer ${
                selectedGenre === g
                  ? 'bg-orange-500/20 border-[#FF6B00] text-[#FF6B00]'
                  : isDark ? 'border-[#334155] text-slate-400' : 'border-slate-300 text-slate-600'
              }`}
            >
              #{g}
            </button>
          ))}
        </div>
      </div>

      {/* Caption Input Header with BharatAI Button */}
      <div className="flex justify-between items-center mb-1.5">
        <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          कैप्शन और विचार:
        </span>
        <button
          type="button"
          onClick={handleGenerateAiCaption}
          disabled={isAiGenerating}
          className="text-[11px] font-bold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 rounded-lg transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
        >
          {isAiGenerating ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
              <span>AI सोच रहा है...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>🤖 BharatAI से कैप्शन बनवाएं</span>
            </>
          )}
        </button>
      </div>

      {/* Caption Textarea */}
      <textarea
        placeholder="अपने विचार, प्रसंग या कविता साझा करें..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        rows={3}
        className={`w-full rounded-xl p-3 text-sm border resize-none mb-4 focus:outline-none focus:border-[#FF6B00] transition ${
          isDark 
            ? 'bg-[#1E293B] border-[#334155] text-white placeholder-slate-500' 
            : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
        }`}
      />

      {/* Cloud Publish Button */}
      <button
        onClick={handlePublish}
        disabled={isPublishing}
        className="w-full bg-[#FF6B00] hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl shadow-lg active:scale-[0.99] transition cursor-pointer flex items-center justify-center gap-2"
      >
        {isPublishing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>क्लाउड पर अपलोड हो रहा है...</span>
          </>
        ) : (
          <span>क्लाउड पर पब्लिश करें 🚀</span>
        )}
      </button>
    </div>
  );

  // 4. भारत लाइव ऑडियो/वीडियो रूम (Bharat Live Audio Room)
  const renderLive = () => (
    <div className={`flex-1 flex flex-col p-4 overflow-y-auto transition-colors ${
      isDark ? 'bg-[#0F172A]' : 'bg-[#F1F5F9]'
    }`}>
      <div className={`p-6 rounded-3xl border-2 text-center shadow-xl transition-all ${
        isDark ? 'bg-[#1E293B]' : 'bg-white'
      } ${isLiveActive ? 'border-red-500 shadow-red-500/20' : isDark ? 'border-slate-700' : 'border-slate-300'}`}>
        
        {/* Live Indicator Beacon */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/15 border border-red-500/40 text-red-500 text-xs font-bold mb-3">
          <span className={`w-2.5 h-2.5 rounded-full bg-red-500 ${isLiveActive ? 'animate-ping' : ''}`} />
          <span>{t.liveRoomTitle || '🔴 भारत लाइव गोष्ठी रूम'}</span>
        </div>

        <h2 className={`text-xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {t.liveTopic || '"साहित्य व तकनीक चौपाल #12"'}
        </h2>

        <p className={`text-xs leading-relaxed mb-6 max-w-xs mx-auto ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          {isLiveActive 
            ? `🎙️ आप लाइव हैं! ${liveListenersCount} श्रोता जुड़े हुए हैं।` 
            : 'लाइव ऑडियो या वीडियो रूम शुरू करने के लिए नीचे दबाएं।'}
        </p>

        {/* Audio Visualizer Waves if active */}
        {isLiveActive ? (
          <div className="my-5 p-4 rounded-2xl bg-black/40 border border-red-500/30">
            <div className="flex items-center justify-center gap-1.5 h-12 mb-3">
              {[40, 75, 95, 60, 85, 100, 70, 50, 90, 65, 80, 45].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-gradient-to-t from-red-500 to-amber-400 rounded-full animate-pulse"
                  style={{ height: `${h}%`, animationDelay: `${i * 80}ms` }}
                />
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ऑडियो ब्रॉडकास्ट सक्रिय (48 kHz HD)</span>
            </div>

            {/* Listener Avatars Row */}
            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-center gap-2">
              <span className="text-[11px] text-slate-400">श्रोता:</span>
              <div className="flex -space-x-2">
                {[
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60',
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60'
                ].map((img, idx) => (
                  <img key={idx} src={img} alt="Listener" className="w-7 h-7 rounded-full border-2 border-slate-900 object-cover" />
                ))}
              </div>
              <span className="text-xs text-orange-400 font-bold ml-1">+{liveListenersCount - 4}</span>
            </div>
          </div>
        ) : (
          <div className="my-6 p-6 rounded-2xl border border-dashed border-slate-700/80 flex flex-col items-center justify-center text-slate-400">
            <Mic className="w-12 h-12 text-[#FF6B00] mb-2 opacity-80" />
            <p className="text-xs">एक टैप में अपनी आवाज़ पूरे देश तक पहुंचाएं</p>
          </div>
        )}

        {/* Start / End Live Action Button */}
        <button
          onClick={() => {
            const nextState = !isLiveActive;
            setIsLiveActive(nextState);
            setToastMessage?.(nextState ? '🎙️ लाइव गोष्ठी शुरू हो गई है!' : 'लाइव गोष्ठी समाप्त हुई।');
            if (nextState) setLiveListenersCount(45 + Math.floor(Math.random() * 15));
          }}
          className={`w-full py-3.5 px-6 rounded-2xl text-sm font-bold text-white transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2 active:scale-98 ${
            isLiveActive 
              ? 'bg-[#EF4444] hover:bg-red-700 shadow-red-500/30' 
              : 'bg-[#10B981] hover:bg-emerald-600 shadow-emerald-500/30'
          }`}
        >
          <span>{isLiveActive ? (t.endLive || 'लाइव समाप्त करें') : (t.startLive || '🎙️ गोष्ठी शुरू करें')}</span>
        </button>
      </div>
    </div>
  );

  // 5. स्वदेशी क्रिएटर स्टोर / मार्केटप्लेस (Swadeshi Creator Store)
  const renderStore = () => (
    <div className={`flex-1 p-3.5 overflow-y-auto transition-colors ${
      isDark ? 'bg-[#0F172A]' : 'bg-[#F1F5F9]'
    }`}>
      <div className="mb-3">
        <h2 className={`text-base font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <span>{t.store || '🛍️ स्वदेशी क्रिएटर स्टोर'}</span>
        </h2>
        <p className="text-xs text-slate-400">भारतीय स्थानीय कारीगरों, किसानों व क्रिएटर्स के अनूठे उत्पाद</p>
      </div>

      <div className="grid grid-cols-2 gap-3 pb-8">
        {DUMMY_PRODUCTS.map((prod) => (
          <div
            key={prod.id}
            className={`rounded-2xl p-2.5 border shadow-sm flex flex-col justify-between transition-colors ${
              isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-slate-200'
            }`}
          >
            <div>
              <img
                src={prod.image}
                alt={prod.title}
                className="w-full h-28 object-cover rounded-xl mb-2"
              />
              <h4 className={`text-xs font-bold line-clamp-2 leading-tight mb-1 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {prod.title}
              </h4>
              <p className="text-[10px] text-slate-400">{prod.seller}</p>
              <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-400 font-bold">
                <span>⭐</span>
                <span>{prod.rating}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-700/40">
              <span className="text-emerald-400 font-bold text-sm font-mono">
                ₹{prod.price}
              </span>
              <button
                onClick={() => {
                  setToastMessage?.(`🛍️ ${prod.title} का ऑर्डर स्वीकार हुआ! डिलीवरी 2-3 दिन में।`);
                }}
                className="bg-[#FF6B00] hover:bg-orange-600 active:scale-95 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer shadow-sm"
              >
                {t.buy || 'खरीदें'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // 6. साप्ताहिक क्रिएटर लीडरबोर्ड (Weekly Creator Leaderboard)
  const renderLeaderboard = () => (
    <div className={`flex-1 p-4 overflow-y-auto transition-colors ${
      isDark ? 'bg-[#0F172A]' : 'bg-[#F1F5F9]'
    }`}>
      <div className="mb-4">
        <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {t.leaderboard || '🏆 साप्ताहिक क्रिएटर लीडरबोर्ड'}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {t.leaderboardSubtitle || 'प्रति लाइक ₹1 नीति के तहत सबसे ज्यादा कमाई करने वाले टॉप क्रिएटर्स'}
        </p>
      </div>

      <div className="space-y-2.5 pb-8">
        {DUMMY_LEADERBOARD.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 p-3 rounded-2xl border transition-colors shadow-sm ${
              isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-slate-200'
            }`}
          >
            <span className={`text-lg font-black w-6 text-center ${
              item.rank === 1 ? 'text-amber-400' : item.rank === 2 ? 'text-slate-300' : 'text-amber-600'
            }`}>
              #{item.rank}
            </span>

            <img
              src={item.avatar}
              alt={item.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-orange-500"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {item.name}
                </h4>
              </div>
              <span className="text-[#FF6B00] text-[10px] font-semibold block mt-0.5">
                {item.badge}
              </span>
            </div>

            <div className="text-right">
              <span className="text-emerald-400 font-bold text-sm font-mono block">
                ₹{item.earnings}
              </span>
              <span className="text-[10px] text-slate-400 block">
                {item.likes} लाइक्स
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // 7. चैट (Chat View)
  const renderChat = () => (
    <div className="flex-1 flex flex-col h-full bg-[#0F172A]">
      <input
        ref={chatMediaInputRef}
        type="file"
        accept="image/*"
        onChange={handleChatImageSelect}
        className="hidden"
      />

      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {messages.map((item) => (
          <div
            key={item.id}
            className={`flex ${item.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] p-2.5 rounded-xl ${
                item.sender === 'me'
                  ? 'bg-[#FF6B00] text-white'
                  : 'bg-[#1E293B] text-slate-100'
              }`}
            >
              {item.mediaUrl && (
                <img
                  src={item.mediaUrl}
                  alt="चैट मीडिया"
                  className="w-44 h-32 object-cover rounded-lg mb-1.5"
                />
              )}
              {item.text && <p className="text-sm leading-relaxed">{item.text}</p>}
              <span className="text-[9px] text-[#CBD5E1] block text-right mt-1">
                {item.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isRecording && (
        <div className="mx-4 mb-2 p-2 rounded-xl bg-rose-600/20 border border-rose-500/50 flex items-center justify-between text-xs text-rose-300 animate-pulse">
          <span>🎙️ वॉयस नोट रिकॉर्ड हो रहा है ({recordingSeconds}s)...</span>
          <button
            onClick={handleVoiceRecordToggle}
            className="text-white bg-rose-600 px-2.5 py-1 rounded-lg font-bold"
          >
            भेजें
          </button>
        </div>
      )}

      {/* Input Bar */}
      <div className="bg-[#1E293B] p-2 border-t border-[#334155] flex items-center gap-1.5">
        <button
          onClick={() => chatMediaInputRef.current?.click()}
          className="p-2 bg-[#334155] rounded-full text-slate-200 cursor-pointer"
        >
          📷
        </button>
        <button
          onClick={handleVoiceRecordToggle}
          className={`p-2 rounded-full cursor-pointer ${
            isRecording ? 'bg-[#EF4444] text-white animate-pulse' : 'bg-[#334155] text-slate-200'
          }`}
        >
          🎙️
        </button>
        <input
          type="text"
          placeholder="संदेश लिखें..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
          className="flex-1 bg-[#0F172A] border border-[#334155] rounded-full px-3.5 py-2 text-sm text-white placeholder-[#888] focus:outline-none focus:border-[#FF6B00]"
        />
        <button
          onClick={handleSendChatMessage}
          className="bg-[#FF6B00] text-white px-4 py-2 rounded-full text-xs font-bold cursor-pointer"
        >
          भेजें
        </button>
      </div>
    </div>
  );

  // 4. अलर्ट / नोटिफिकेशन्स (Notifications View)
  const renderNotifications = () => (
    <div className="flex-1 p-4 overflow-y-auto max-w-lg mx-auto w-full">
      <h3 className="text-white text-base font-bold mb-4">🔔 FCM पुश नोटिफिकेशन्स</h3>
      <div className="space-y-3">
        {notifications.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, unread: false } : n));
              if (item.type === 'chat') setCurrentTab('chat');
              else if (item.type === 'like' || item.type === 'update') setCurrentTab('feed');
            }}
            className={`bg-[#1E293B] rounded-xl p-3.5 border transition cursor-pointer ${
              item.unread ? 'border-[#FF6B00]' : 'border-[#334155]'
            }`}
          >
            <h4 className="text-[#F8FAFC] font-bold text-sm">{item.title}</h4>
            <p className="text-[#CBD5E1] text-xs mt-1">{item.body}</p>
            <span className="text-[#64748B] text-[11px] block mt-2">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // 5. प्रोफाइल व्यू (Profile View)
  const renderProfile = () => (
    <ProfileView userEmail={user?.email || undefined} onLogout={handleLogout} />
  );

  return (
    <div className={`w-full flex justify-center min-h-screen transition-colors ${
      isDark ? 'bg-[#0F172A]' : 'bg-slate-100'
    }`}>
      <div className={`w-full max-w-md min-h-screen flex flex-col shadow-2xl border-x relative font-sans transition-colors ${
        isDark ? 'bg-[#0F172A] border-[#334155] text-slate-100' : 'bg-[#F8FAFC] border-slate-200 text-slate-900'
      }`}>
        
        {/* मुख्य हेडर (Main Header with Language Switch, Theme Toggle, SOS, and Logout) */}
        <header className={`py-2.5 px-3 border-b flex items-center justify-between sticky top-0 z-30 transition-colors ${
          isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-1.5">
            <span className={`text-sm sm:text-base font-bold ${isDark ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
              🇮🇳 भारतकनेक्ट
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* भाषा टॉगल बटन (Language Switcher: HI / EN / GU) */}
            <button
              onClick={() => {
                const nextLang: Language = lang === 'hi' ? 'en' : lang === 'en' ? 'gu' : 'hi';
                setLang(nextLang);
                setToastMessage?.(`भाषा: ${nextLang === 'hi' ? 'हिंदी 🇮🇳' : nextLang === 'en' ? 'English 🌐' : 'ગુજરાતી 🇮🇳'}`);
              }}
              className="px-2 py-1 rounded-lg text-xs font-black bg-orange-500/15 border border-orange-500/40 text-[#FF6B00] active:scale-95 transition cursor-pointer"
              title="भाषा बदलें (Hindi / English / Gujarati)"
            >
              {lang.toUpperCase()}
            </button>

            {/* थीम टॉगल बटन (Light / Dark Mode Switcher) */}
            <button
              onClick={() => {
                const nextTheme = isDark ? 'light' : 'dark';
                setTheme(nextTheme);
                setToastMessage?.(nextTheme === 'dark' ? '🌙 डार्क मोड सक्रिय' : '☀️ लाइट मोड सक्रिय');
              }}
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer active:scale-95 ${
                isDark 
                  ? 'bg-slate-800 text-amber-300 border border-slate-700 hover:bg-slate-700' 
                  : 'bg-slate-100 text-slate-800 border border-slate-300 hover:bg-slate-200'
              }`}
              title="थीम बदलें"
            >
              <span>{isDark ? '☀️' : '🌙'}</span>
            </button>

            {/* चैट व अलर्ट शॉर्टकट */}
            <button
              onClick={() => setCurrentTab('chat')}
              className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                currentTab === 'chat' 
                  ? 'bg-orange-500/20 text-[#FF6B00]' 
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600'
              }`}
              title="चैट"
            >
              <MessageCircle size={15} />
            </button>

            <button
              onClick={() => setCurrentTab('notifications')}
              className={`p-1.5 rounded-lg text-xs relative transition cursor-pointer ${
                currentTab === 'notifications' 
                  ? 'bg-orange-500/20 text-[#FF6B00]' 
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600'
              }`}
              title="अलर्ट"
            >
              <Bell size={15} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#FF6B00]" />
              )}
            </button>

            {/* SOS बटन */}
            <button
              onClick={openSOSModal}
              className="px-2 py-0.5 bg-red-600/20 border border-red-500/40 text-red-400 rounded-lg text-[10px] font-bold active:scale-95 transition"
              title="SOS Emergency"
            >
              SOS
            </button>

            {/* लॉगआउट बटन */}
            <button
              onClick={handleLogout}
              className="text-[#EF4444] font-semibold text-xs hover:underline cursor-pointer flex items-center gap-0.5 ml-0.5 active:scale-95"
              title="लॉगआउट करें"
            >
              <LogOut size={13} />
            </button>
          </div>
        </header>

        {/* एक्टिव स्क्रीन व्यूज (Active Screen Views) */}
        <main className="flex-1 flex flex-col overflow-y-auto pb-16">
          {currentTab === 'feed' && renderFeed()}
          {currentTab === 'reels' && renderReels()}
          {currentTab === 'live' && renderLive()}
          {currentTab === 'store' && renderStore()}
          {currentTab === 'leaderboard' && renderLeaderboard()}
          {currentTab === 'studio' && renderStudio()}
          {currentTab === 'chat' && renderChat()}
          {currentTab === 'notifications' && renderNotifications()}
          {currentTab === 'profile' && renderProfile()}
        </main>

        {/* बॉटम नेविगेशन बार (अद्यतन टैब्स: फ़ीड, रील्स, लाइव, स्टोर, लीडरबोर्ड, स्टूडियो, प्रोफाइल) */}
        <nav className={`fixed bottom-0 max-w-md w-full border-t py-1 px-1 flex items-center justify-between z-40 select-none shadow-2xl overflow-x-auto no-scrollbar transition-colors ${
          isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-slate-200'
        }`}>
          {/* 1. Feed */}
          <button
            onClick={() => setCurrentTab('feed')}
            className={`flex flex-col items-center py-1 px-2 shrink-0 cursor-pointer transition ${
              currentTab === 'feed' ? 'text-[#FF6B00]' : isDark ? 'text-[#94A3B8]' : 'text-slate-500'
            }`}
          >
            <span className="text-sm">🏠</span>
            <span className={`text-[10px] mt-0.5 ${currentTab === 'feed' ? 'font-bold' : ''}`}>{t.feed}</span>
          </button>

          {/* 2. Reels */}
          <button
            onClick={() => setCurrentTab('reels')}
            className={`flex flex-col items-center py-1 px-2 shrink-0 cursor-pointer transition ${
              currentTab === 'reels' ? 'text-[#FF6B00]' : isDark ? 'text-[#94A3B8]' : 'text-slate-500'
            }`}
          >
            <span className="text-sm">🎥</span>
            <span className={`text-[10px] mt-0.5 ${currentTab === 'reels' ? 'font-bold' : ''}`}>{t.reels}</span>
          </button>

          {/* 3. Live */}
          <button
            onClick={() => setCurrentTab('live')}
            className={`flex flex-col items-center py-1 px-2 shrink-0 cursor-pointer transition ${
              currentTab === 'live' ? 'text-[#FF6B00]' : isDark ? 'text-[#94A3B8]' : 'text-slate-500'
            }`}
          >
            <span className="text-sm">🎙️</span>
            <span className={`text-[10px] mt-0.5 ${currentTab === 'live' ? 'font-bold' : ''}`}>{t.live}</span>
          </button>

          {/* 4. Store */}
          <button
            onClick={() => setCurrentTab('store')}
            className={`flex flex-col items-center py-1 px-2 shrink-0 cursor-pointer transition ${
              currentTab === 'store' ? 'text-[#FF6B00]' : isDark ? 'text-[#94A3B8]' : 'text-slate-500'
            }`}
          >
            <span className="text-sm">🛍️</span>
            <span className={`text-[10px] mt-0.5 ${currentTab === 'store' ? 'font-bold' : ''}`}>{t.store}</span>
          </button>

          {/* 5. Leaderboard */}
          <button
            onClick={() => setCurrentTab('leaderboard')}
            className={`flex flex-col items-center py-1 px-2 shrink-0 cursor-pointer transition ${
              currentTab === 'leaderboard' ? 'text-[#FF6B00]' : isDark ? 'text-[#94A3B8]' : 'text-slate-500'
            }`}
          >
            <span className="text-sm">🏆</span>
            <span className={`text-[10px] mt-0.5 ${currentTab === 'leaderboard' ? 'font-bold' : ''}`}>{t.leaderboard}</span>
          </button>

          {/* 6. Studio */}
          <button
            onClick={() => setCurrentTab('studio')}
            className={`flex flex-col items-center py-1 px-2 shrink-0 cursor-pointer transition ${
              currentTab === 'studio' ? 'text-[#FF6B00]' : isDark ? 'text-[#94A3B8]' : 'text-slate-500'
            }`}
          >
            <span className="text-sm">➕</span>
            <span className={`text-[10px] mt-0.5 ${currentTab === 'studio' ? 'font-bold' : ''}`}>{t.studio}</span>
          </button>

          {/* 7. Profile */}
          <button
            onClick={() => setCurrentTab('profile')}
            className={`flex flex-col items-center py-1 px-2 shrink-0 cursor-pointer transition ${
              currentTab === 'profile' ? 'text-[#FF6B00]' : isDark ? 'text-[#94A3B8]' : 'text-slate-500'
            }`}
          >
            <span className="text-sm">👤</span>
            <span className={`text-[10px] mt-0.5 ${currentTab === 'profile' ? 'font-bold' : ''}`}>{t.profile}</span>
          </button>
        </nav>

        {/* --- SUPER THANKS / UPI TIPPING MODAL --- */}
        {tippingAuthor && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1E293B] border border-[#334155] rounded-3xl p-5 max-w-sm w-full shadow-2xl relative animate-in fade-in zoom-in-95">
              <button
                onClick={() => setTippingAuthor(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-4">
                <span className="text-3xl">💖</span>
                <h3 className="text-white font-bold text-base mt-2">
                  क्रिएटर का सम्मान (Super Thanks)
                </h3>
                <p className="text-slate-300 text-xs mt-1">
                  <strong className="text-orange-400">{tippingAuthor.author}</strong> को UPI के माध्यम से समर्थन राशि भेजें:
                </p>
              </div>

              {tipSuccessState ? (
                <div className="py-6 text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                  <p className="text-white font-bold text-sm">UPI ट्रांसफर सफल! 🎉</p>
                  <p className="text-slate-400 text-xs">आपके समर्थन के लिए क्रिएटर की ओर से धन्यवाद।</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    {['10', '50', '100'].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => executeTipPayment(amt)}
                        className="py-2.5 px-3 bg-slate-900 border border-[#334155] hover:border-[#FF6B00] rounded-xl text-center transition cursor-pointer hover:bg-orange-500/10"
                      >
                        <span className="text-white font-bold text-sm">₹{amt}</span>
                        <span className="block text-[10px] text-orange-400 mt-0.5">
                          {amt === '10' ? 'चाय टिप ☕' : amt === '50' ? 'नाश्ता टिप 🥪' : 'सुपर 💖'}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">क्रिएटर UPI VPA:</span>
                      <div className="flex items-center gap-1.5 font-mono text-white">
                        <span>creator@bharatupi</span>
                        <button
                          onClick={() => {
                            navigator.clipboard?.writeText('creator@bharatupi');
                            setCopiedUpi(true);
                            setTimeout(() => setCopiedUpi(false), 2000);
                          }}
                          className="text-orange-400 hover:text-orange-300"
                        >
                          {copiedUpi ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      Google Pay, PhonePe, Paytm, BHIM UPI आदि किसी भी ऐप से तुरंत ट्रांसफर करें।
                    </p>
                  </div>

                  <button
                    onClick={() => executeTipPayment(customTipAmount)}
                    className="w-full bg-[#FF6B00] hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>UPI ऐप से सीधे भेजें</span>
                    <span>→</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
