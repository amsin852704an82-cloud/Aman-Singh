import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, GraduationCap, Video, Bell, User, Plus, Search, Heart, MessageCircle, 
  Share2, Bookmark, Send, Image as ImageIcon, Mic, MoreVertical, Compass, CheckCircle2, 
  ArrowLeft, Settings, Shield, Lock, Volume2, VolumeX, Play, Pause, Sparkles, X, MapPin
} from 'lucide-react';
import { useBharatConnect } from '../../context/BharatConnectContext';
import { useAuth } from '../../context/AuthContext';
import { Post, User as UserType } from '../../types/bharatConnect';
import { createFirestorePost, subscribeToFirestorePosts } from '../../lib/postService';

interface LocalPost {
  id: string | number;
  postId?: string;
  username: string;
  userAvatar?: string;
  location: string;
  time: string;
  audioTitle?: string | null;
  audioQuote?: string | null;
  audioURL?: string | null;
  image?: string | null;
  tags: string[];
  likesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
}

export default function BharatConnectApp() {
  const { 
    currentUser, 
    openSOSModal, 
    setToastMessage,
    unreadNotificationsCount,
    setActiveTab: setGlobalActiveTab,
    toggleLikePost: globalToggleLikePost
  } = useBharatConnect();
  const { user: firebaseAuthUser } = useAuth();

  // Navigation & Active Tab State
  const [activeTab, setActiveTab] = useState<'home' | 'skills' | 'reels' | 'alerts' | 'profile' | 'explore' | 'chat'>('home');
  
  // Interactive States
  const [likes, setLikes] = useState<{ [key: string]: boolean }>({ '1': false, '2': false });
  const [likeCounts, setLikeCounts] = useState<{ [key: string]: number }>({ '1': 48, '2': 124 });
  const [savedPosts, setSavedPosts] = useState<{ [key: string]: boolean }>({});
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);

  // Audio Playback State for Kabir Doha & Audio Cards
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Modal & Post Creation States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [newPostLocation, setNewPostLocation] = useState('India');
  const [newPostImageUrl, setNewPostImageUrl] = useState('');
  const [newPostAudioTitle, setNewPostAudioTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Comment State
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | number | null>(null);
  const [commentInput, setCommentInput] = useState<{ [key: string]: string }>({});
  const [postComments, setPostComments] = useState<{ [key: string]: Array<{ user: string; text: string; time: string }> }>({
    '1': [
      { user: 'priya_sharma', text: 'कबीर साहेब का यह दोहा जीवन का सबसे बड़ा सत्य है। 🙏', time: '1 दिन पहले' },
      { user: 'rohit_patel', text: 'अति सुंदर प्रस्तुति!', time: '3 घंटे पहले' }
    ],
    '2': [
      { user: 'travel_lover', text: 'भारतीय रेल की यात्रा का अपना ही आनंद है! 🚂', time: '10 मिनट पहले' }
    ]
  });

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Initial Curated Posts
  const [posts, setPosts] = useState<LocalPost[]>([
    {
      id: '1',
      username: 'as9621302122',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
      location: 'India',
      time: '5 दिन पहले',
      audioTitle: 'आवाज़ (Awaaz Audio) - कबीर दोहा - गुरु और गोविंद',
      audioQuote: '"गुरु गोविंद दोउ खड़े, काके लागू पांय। बलिहारी गुरु आपनो, जिन गोविंद दियो बताय॥ 🙏"',
      audioURL: 'https://actions.google.com/sounds/v1/ambiences/outdoor_water_spring.ogg',
      image: null,
      tags: ['#Awaaz', '#KabirDoha', '#BharatConnect'],
      likesCount: 48,
      isLiked: false
    },
    {
      id: '2',
      username: 'railway_shayar_aman',
      userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80',
      location: 'नई दिल्ली रेलवे स्टेशन',
      time: 'अभी-अभी (Just now)',
      audioTitle: null,
      audioQuote: null,
      audioURL: null,
      image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80',
      tags: ['#IndianRailways', '#Travel', '#BharatConnect'],
      likesCount: 124,
      isLiked: false
    }
  ]);

  // Sync real posts from Firestore
  useEffect(() => {
    const unsubscribe = subscribeToFirestorePosts((firestorePosts: Post[]) => {
      if (firestorePosts && firestorePosts.length > 0) {
        const mapped: LocalPost[] = firestorePosts.map((fp) => ({
          id: fp.id || fp.postId || String(Math.random()),
          postId: fp.postId || fp.id,
          username: fp.author?.username || fp.authorName || 'user',
          userAvatar: fp.author?.avatar || fp.authorPhotoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
          location: fp.locationName || 'India',
          time: fp.createdAt || 'कुछ समय पहले',
          audioTitle: fp.audioTitle || (fp.audioURL ? 'आवाज़ (Awaaz Audio)' : null),
          audioQuote: fp.audioURL ? (fp.caption || fp.text) : null,
          audioURL: fp.audioURL || null,
          image: fp.imageUrl || fp.imageURL || null,
          tags: fp.tags?.length ? fp.tags.map(t => t.startsWith('#') ? t : `#${t}`) : ['#BharatConnect'],
          likesCount: fp.likesCount || fp.likeCount || 0,
          isLiked: Boolean(fp.isLiked)
        }));

        setPosts((prev) => {
          // Merge unique posts
          const ids = new Set(mapped.map(m => String(m.id)));
          const defaultUniques = prev.filter(p => !ids.has(String(p.id)));
          return [...mapped, ...defaultUniques];
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Chat/DM State
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; isUser: boolean; time: string }>>([
    { sender: 'Rahul Sharma', text: 'नमस्ते! भारत कनेक्ट पर आपका स्वागत है। 🇮🇳', isUser: false, time: '10:30 AM' },
    { sender: 'Rahul Sharma', text: 'कैसा चल रहा है प्रोजेक्ट?', isUser: false, time: '10:31 AM' },
    { sender: 'Me', text: 'नमस्ते राहुल जी! ऐप बहुत शानदार और तेज़ बन रहा है।', isUser: true, time: '10:32 AM' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Audio Playback Handler
  const togglePlayAudio = (id: string) => {
    if (playingAudioId === id) {
      // Pause
      setPlayingAudioId(null);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    } else {
      // Play
      setPlayingAudioId(id);
      setAudioProgress(0);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);

      audioIntervalRef.current = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setPlayingAudioId(null);
            if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
            return 0;
          }
          return prev + 3.3; // 30 seconds simulation
        });
      }, 1000);
    }
  };

  useEffect(() => {
    return () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
  }, []);

  // Handle Like Toggle
  const handleLike = async (postId: string | number) => {
    const key = String(postId);
    const isCurrentlyLiked = likes[key] ?? false;
    const currentCount = likeCounts[key] ?? 0;

    setLikes(prev => ({ ...prev, [key]: !isCurrentlyLiked }));
    setLikeCounts(prev => ({
      ...prev,
      [key]: isCurrentlyLiked ? Math.max(0, currentCount - 1) : currentCount + 1
    }));

    // If it is a Firestore post, persist like
    try {
      if (globalToggleLikePost) {
        globalToggleLikePost(key);
      }
    } catch (err) {
      console.warn('Like sync note:', err);
    }
  };

  // Handle Save Toggle
  const handleSave = (postId: string | number) => {
    const key = String(postId);
    const isSaved = !savedPosts[key];
    setSavedPosts({ ...savedPosts, [key]: isSaved });
    if (setToastMessage) {
      setToastMessage(isSaved ? 'पोस्ट सहेजी गई (Saved to bookmarks) 🔖' : 'बुकमार्क से हटाया गया');
    }
  };

  // 1-Click WhatsApp Share with Automatic Watermark
  const handleWhatsAppShare = (post: LocalPost) => {
    const watermark = encodeURIComponent(
      `🇮🇳 BharatConnect - भारत का अपना सोशल मीडिया!\n\n` +
      `${post.username} की पोस्ट: "${post.audioQuote || post.tags.join(' ')}"\n\n` +
      `🔗 अभी देखें: https://ais-pre-danma7ku6sq7x5cjtay4sj-37858070369.asia-northeast1.run.app\n` +
      `#BharatConnect #MadeInIndia`
    );

    const shareUrl = `https://api.whatsapp.com/send?text=${watermark}`;
    
    // Attempt copy to clipboard as well
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(
        `BharatConnect Post by @${post.username}: ${post.audioQuote || post.tags.join(' ')} | https://ais-pre-danma7ku6sq7x5cjtay4sj-37858070369.asia-northeast1.run.app`
      );
    }

    if (setToastMessage) {
      setToastMessage('WhatsApp शेयर लिंक कॉपी किया गया! वॉटरमार्क तैयार है 🇮🇳');
    }

    // Open WhatsApp in new window safely
    try {
      window.open(shareUrl, '_blank');
    } catch {
      alert('WhatsApp Share Link Copied to clipboard with watermark!');
    }
  };

  // Add Comment
  const handleAddComment = (postId: string | number) => {
    const key = String(postId);
    const text = commentInput[key]?.trim();
    if (!text) return;

    const newComment = {
      user: currentUser?.username || firebaseAuthUser?.displayName || 'as9621302122',
      text,
      time: 'अभी-अभी'
    };

    setPostComments(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), newComment]
    }));

    setCommentInput(prev => ({ ...prev, [key]: '' }));
    if (setToastMessage) {
      setToastMessage('टिप्पणी प्रकाशित की गई! ✨');
    }
  };

  // Send Chat Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = {
      sender: 'Me',
      text: inputMessage.trim(),
      isUser: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');

    // Simulate smart auto-reply from Rahul Sharma
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          sender: 'Rahul Sharma',
          text: 'बहुत खूब! भारत कनेक्ट पर आपसे बात करके खुशी हुई। 🇮🇳',
          isUser: false,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  // Add New Post (with Firestore Persistence)
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim() && !newPostImageUrl.trim()) return;

    setIsSubmitting(true);
    const postTags = ['#BharatConnect', '#NewPost'];
    
    // Extract any #tags from text
    const extractedTags = newPostText.match(/#[a-zA-Z0-9_]+/g);
    if (extractedTags) {
      extractedTags.forEach(t => {
        if (!postTags.includes(t)) postTags.push(t);
      });
    }

    const currentUserName = currentUser?.username || firebaseAuthUser?.email?.split('@')[0] || 'as9621302122';
    const effectiveLocation = newPostLocation || 'India';

    const newLocalEntry: LocalPost = {
      id: `post_${Date.now()}`,
      username: currentUserName,
      userAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
      location: effectiveLocation,
      time: 'अभी-अभी',
      audioTitle: newPostAudioTitle || (newPostText.includes('दोहा') ? 'आवाज़ (Awaaz Audio)' : 'यूज़र पोस्ट'),
      audioQuote: newPostText,
      image: newPostImageUrl || null,
      tags: postTags,
      likesCount: 0,
      isLiked: false
    };

    setPosts([newLocalEntry, ...posts]);

    // Persist to Firebase Firestore
    try {
      await createFirestorePost({
        text: newPostText,
        imageURL: newPostImageUrl,
        locationName: effectiveLocation,
        tags: postTags,
        audioTitle: newPostAudioTitle || undefined
      });
      if (setToastMessage) {
        setToastMessage('आपकी पोस्ट भारतकनेक्ट पर लाइव हो गई है! 🇮🇳');
      }
    } catch (err) {
      console.warn('Firestore post creation note:', err);
      if (setToastMessage) {
        setToastMessage('पोस्ट स्थानीय रूप से प्रकाशित हुई (Local Mode)');
      }
    } finally {
      setIsSubmitting(false);
      setNewPostText('');
      setNewPostImageUrl('');
      setNewPostAudioTitle('');
      setShowCreateModal(false);
    }
  };

  // Filter posts by search query or selected tag
  const filteredPosts = posts.filter(post => {
    if (selectedTagFilter) {
      return post.tags.some(t => t.toLowerCase() === selectedTagFilter.toLowerCase());
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      post.username.toLowerCase().includes(q) ||
      post.location.toLowerCase().includes(q) ||
      (post.audioQuote && post.audioQuote.toLowerCase().includes(q)) ||
      (post.audioTitle && post.audioTitle.toLowerCase().includes(q)) ||
      post.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-zinc-950 text-zinc-100 font-sans relative overflow-hidden shadow-2xl border-x border-zinc-800">
      
      {/* Top Header */}
      <header className="sticky top-0 flex items-center justify-between px-4 py-3 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800 z-30">
        <div className="flex items-center space-x-2">
          {activeTab === 'chat' && (
            <button onClick={() => setActiveTab('home')} className="mr-2 text-zinc-300 hover:text-amber-400 transition cursor-pointer">
              <ArrowLeft size={22} />
            </button>
          )}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-zinc-950 font-black text-sm shadow-md">
              BC
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              BharatConnect
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Bharat Sahara SOS button */}
          <button 
            onClick={openSOSModal} 
            className="px-2 py-1 bg-red-600/20 border border-red-500/40 text-red-400 rounded-lg text-xs font-bold hover:bg-red-600/30 transition flex items-center gap-1 cursor-pointer"
            title="Bharat Sahara Emergency SOS"
          >
            <Shield size={14} className="text-red-400" />
            <span>SOS</span>
          </button>

          <button 
            onClick={() => setActiveTab('explore')} 
            className={`p-2 rounded-lg transition cursor-pointer ${activeTab === 'explore' ? 'text-amber-400 bg-zinc-800' : 'text-zinc-300 hover:text-amber-400'}`}
            title="एक्सप्लोर (Explore)"
          >
            <Compass size={20} />
          </button>

          <button 
            onClick={() => setActiveTab('chat')} 
            className={`p-2 rounded-lg transition cursor-pointer relative ${activeTab === 'chat' ? 'text-amber-400 bg-zinc-800' : 'text-zinc-300 hover:text-amber-400'}`}
            title="चैट (Chat & Direct Messages)"
          >
            <MessageCircle size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
          </button>

          <button
            onClick={() => setGlobalActiveTab('home')}
            className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md text-[10px] font-semibold transition cursor-pointer"
            title="पोर्टल व्यू पर लौटें"
          >
            पोर्टल ↗
          </button>
        </div>
      </header>

      {/* Main Dynamic Container */}
      <main className="flex-1 overflow-y-auto pb-24">
        
        {/* --- 1. HOME TAB (फीड, स्टोरीज, पोस्ट्स) --- */}
        {activeTab === 'home' && (
          <div>
            {/* Tag Filter Reset Bar if Active */}
            {selectedTagFilter && (
              <div className="flex items-center justify-between px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-xs text-amber-400">
                <span>फ़िल्टर सक्रिय: <strong>{selectedTagFilter}</strong></span>
                <button onClick={() => setSelectedTagFilter(null)} className="flex items-center gap-1 text-zinc-400 hover:text-zinc-100">
                  <X size={14} /> हटाएँ
                </button>
              </div>
            )}

            {/* Stories Section */}
            <div className="flex space-x-3 p-3 bg-zinc-900/50 border-b border-zinc-800/60 overflow-x-auto no-scrollbar">
              <div 
                className="flex flex-col items-center flex-shrink-0 cursor-pointer"
                onClick={() => setShowCreateModal(true)}
              >
                <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 to-orange-500 relative">
                  <img 
                    src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"} 
                    alt="Story" 
                    className="w-full h-full rounded-full object-cover border-2 border-zinc-950" 
                  />
                  <div className="absolute bottom-0 right-0 bg-orange-600 rounded-full p-1 text-white border border-zinc-950">
                    <Plus size={10} />
                  </div>
                </div>
                <span className="text-xs mt-1 text-zinc-400 truncate w-16 text-center">आपकी स्टोरी</span>
              </div>

              {[
                { name: 'Priya', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80' },
                { name: 'Aarav', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80' },
                { name: 'Vikramaditya', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
                { name: 'Neha', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' }
              ].map((creator, idx) => (
                <div 
                  key={idx} 
                  className="flex flex-col items-center flex-shrink-0 cursor-pointer"
                  onClick={() => {
                    if (setToastMessage) setToastMessage(`${creator.name} की स्टोरी लोड हो रही है...`);
                  }}
                >
                  <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500">
                    <img 
                      src={creator.avatar} 
                      alt={creator.name} 
                      className="w-full h-full rounded-full object-cover border-2 border-zinc-950" 
                    />
                  </div>
                  <span className="text-xs mt-1 text-zinc-300 truncate w-16 text-center">{creator.name}</span>
                </div>
              ))}
            </div>

            {/* Posts Feed */}
            {filteredPosts.map((post) => {
              const postKey = String(post.id);
              const isLiked = likes[postKey] ?? post.isLiked ?? false;
              const likeCount = likeCounts[postKey] ?? post.likesCount ?? 0;
              const isSaved = savedPosts[postKey] ?? post.isSaved ?? false;
              const isAudioPlaying = playingAudioId === postKey;

              return (
                <div key={post.id} className="bg-zinc-900 border-b border-zinc-800 mb-3">
                  {/* Post Header */}
                  <div className="flex items-center justify-between p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 p-[2px]">
                        <img 
                          src={post.userAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"} 
                          className="w-full h-full rounded-full object-cover" 
                          alt="avatar" 
                        />
                      </div>
                      <div>
                        <div className="flex items-center space-x-1">
                          <span className="font-semibold text-sm text-zinc-100">{post.username}</span>
                          <CheckCircle2 size={14} className="text-blue-500 fill-blue-500/20" />
                        </div>
                        <span className="text-[11px] text-zinc-400">{post.location} · {post.time}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleSave(post.id)}
                      className="text-zinc-400 hover:text-zinc-200 p-1"
                    >
                      <MoreVertical size={18} />
                    </button>
                  </div>

                  {/* Audio Widget / Media Content */}
                  {post.audioTitle && (
                    <div className="mx-3 mb-3 p-3 bg-gradient-to-r from-amber-950/40 to-orange-950/30 border border-amber-500/30 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-amber-400 flex items-center gap-1">
                          <Mic size={14} /> {post.audioTitle}
                        </span>
                        {isAudioPlaying && (
                          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 animate-pulse">
                            ● बज रहा है (Playing)
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => togglePlayAudio(postKey)}
                          className="w-10 h-10 bg-amber-500 hover:bg-amber-400 rounded-full flex items-center justify-center text-zinc-950 font-bold shadow-lg hover:scale-105 active:scale-95 transition cursor-pointer"
                        >
                          {isAudioPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                        </button>
                        <div className="flex-1">
                          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden relative">
                            <div 
                              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-300"
                              style={{ width: isAudioPlaying ? `${audioProgress}%` : '35%' }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
                            <span>{isAudioPlaying ? `0:${Math.floor((audioProgress / 100) * 30).toString().padStart(2, '0')}` : '0:00'}</span>
                            <span>0:30</span>
                          </div>
                        </div>
                      </div>
                      {post.audioQuote && (
                        <p className="text-sm text-zinc-200 italic mt-3 text-center leading-relaxed font-serif">
                          {post.audioQuote}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Image Post Content */}
                  {post.image && (
                    <div className="w-full max-h-80 overflow-hidden bg-black select-none">
                      <img 
                        src={post.image} 
                        alt="Post content" 
                        className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-300" 
                      />
                    </div>
                  )}

                  {/* Action Buttons Bar */}
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center space-x-4">
                      {/* Like button */}
                      <button 
                        onClick={() => handleLike(post.id)} 
                        className="flex items-center space-x-1.5 text-zinc-300 hover:text-red-500 transition cursor-pointer"
                      >
                        <Heart 
                          size={22} 
                          className={isLiked ? "text-red-500 fill-red-500 scale-110 transition-transform" : "transition-transform"} 
                        />
                        <span className="text-xs font-medium">{likeCount}</span>
                      </button>

                      {/* Comment button */}
                      <button 
                        onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)} 
                        className="flex items-center space-x-1 text-zinc-300 hover:text-amber-400 transition cursor-pointer"
                      >
                        <MessageCircle size={22} />
                        <span className="text-xs font-medium">
                          {(postComments[postKey] || []).length}
                        </span>
                      </button>

                      {/* 1-Click WhatsApp Share */}
                      <button 
                        onClick={() => handleWhatsAppShare(post)}
                        className="text-zinc-300 hover:text-green-500 transition cursor-pointer" 
                        title="1-Click WhatsApp Status / Share"
                      >
                        <Share2 size={22} />
                      </button>
                    </div>

                    {/* Bookmark / Save */}
                    <button 
                      onClick={() => handleSave(post.id)} 
                      className="text-zinc-300 hover:text-amber-400 transition cursor-pointer"
                    >
                      <Bookmark size={22} className={isSaved ? "text-amber-400 fill-amber-400" : ""} />
                    </button>
                  </div>

                  {/* Hashtags */}
                  <div className="px-4 pb-3 flex flex-wrap gap-1.5">
                    {post.tags.map((tag, i) => (
                      <span 
                        key={i} 
                        onClick={() => setSelectedTagFilter(tag)}
                        className="text-xs text-amber-400 font-medium cursor-pointer hover:underline"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Comments Section */}
                  {activeCommentPostId === post.id && (
                    <div className="px-4 pb-3 space-y-2 border-t border-zinc-800/60 pt-2 animate-in fade-in">
                      <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                        {(postComments[postKey] || []).map((c, ci) => (
                          <div key={ci} className="text-xs bg-zinc-950 p-2 rounded-lg border border-zinc-800/60">
                            <span className="font-semibold text-amber-400 mr-1.5">{c.user}:</span>
                            <span className="text-zinc-300">{c.text}</span>
                            <span className="text-[10px] text-zinc-500 block mt-0.5">{c.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Comment Input Preview */}
                  <div className="px-4 py-2 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
                    <input 
                      type="text" 
                      value={commentInput[postKey] || ''}
                      onChange={(e) => setCommentInput({ ...commentInput, [postKey]: e.target.value })}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(post.id); }}
                      placeholder="अपनी टिप्पणी लिखें..." 
                      className="bg-transparent flex-1 focus:outline-none text-zinc-200 placeholder:text-zinc-500 text-xs mr-2"
                    />
                    <button 
                      onClick={() => handleAddComment(post.id)}
                      className="text-amber-500 hover:text-amber-400 font-semibold cursor-pointer shrink-0"
                    >
                      भेजें
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* --- 2. SKILLS TAB (हुनर) --- */}
        {activeTab === 'skills' && (
          <div className="p-4 text-center">
            <h2 className="text-lg font-bold text-amber-400 mb-1">BharatConnect हुनर (Skills)</h2>
            <p className="text-xs text-zinc-400 mb-4">अपने हुनर और कला को पूरी दुनिया के सामने लाएं।</p>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { title: 'कला एवं संगीत', desc: 'गायन, वाद्य यंत्र और नृत्य', tag: '#ArtAndMusic', count: '1.4K' },
                { title: 'कोडिंग एवं टेक', desc: 'वेब, ऍप्स एवं सॉफ्टवेयर', tag: '#Coding', count: '850' },
                { title: 'हस्तशिल्प', desc: 'मिट्टी, वस्त्र व शिल्पकला', tag: '#Handicrafts', count: '620' },
                { title: 'लेखन एवं शायरी', desc: 'कविताएं, दोहे व कहानियाँ', tag: '#Poetry', count: '2.1K' }
              ].map((skill, idx) => (
                <div 
                  key={idx} 
                  onClick={() => {
                    setSelectedTagFilter(skill.tag);
                    setActiveTab('home');
                  }}
                  className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-left hover:border-amber-500 transition cursor-pointer group"
                >
                  <GraduationCap className="text-amber-500 mb-2 group-hover:scale-110 transition-transform" size={24} />
                  <h3 className="font-bold text-sm text-zinc-200">{skill.title}</h3>
                  <p className="text-[11px] text-zinc-400 mt-1">{skill.desc}</p>
                  <span className="text-[10px] text-amber-400 mt-2 block font-medium">{skill.count} क्रिएटर्स देखें →</span>
                </div>
              ))}
            </div>

            {/* Showcase Banner */}
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-4 text-left">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">हुनर सीखें या सिखाएं</span>
              <p className="text-xs text-zinc-300">
                स्थानीय कारीगरों और कलाकारों से सीधे जुड़ें। अपनी पहली कौशल वीडियो पोस्ट करें और 'Founding Creator' बैज अर्जित करें।
              </p>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="mt-3 px-3 py-1.5 bg-amber-500 text-zinc-950 font-bold rounded-lg text-xs hover:bg-amber-400 transition"
              >
                + अपना हुनर जोड़ें
              </button>
            </div>
          </div>
        )}

        {/* --- 3. REELS TAB (रील्स) --- */}
        {activeTab === 'reels' && (
          <div className="min-h-[70vh] flex flex-col items-center justify-center bg-black relative p-6 text-center">
            <Video size={54} className="text-amber-500 mb-3 animate-bounce" />
            <h2 className="text-lg font-bold text-zinc-100">BharatConnect Reels</h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-xs">
              वर्टिकल वीडियो फीड लोड हो रही है। यहाँ क्षेत्रीय और भारतीय क्रिएटर्स के शॉर्ट वीडियोज़ का मज़ा लें।
            </p>
            <div className="flex flex-col gap-2 mt-5 w-full max-w-xs">
              <button 
                onClick={() => {
                  if (setToastMessage) setToastMessage('रील्स प्लेयर सक्रिय हो रहा है... 🎥');
                }}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-zinc-950 font-bold rounded-xl text-xs shadow-lg hover:opacity-95 transition cursor-pointer"
              >
                रील्स देखना शुरू करें
              </button>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-200 font-medium rounded-xl text-xs hover:bg-zinc-800 transition cursor-pointer"
              >
                + शॉर्ट वीडियो / ऑडियो अपलोड करें
              </button>
            </div>
          </div>
        )}

        {/* --- 4. ALERTS / NOTIFICATIONS TAB (अलर्ट) --- */}
        {activeTab === 'alerts' && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-zinc-100">सूचनाएं (Notifications)</h2>
              <span className="text-[11px] text-amber-500 font-medium cursor-pointer">सभी को पढ़ा हुआ चिन्हित करें</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold shrink-0">
                  RS
                </div>
                <div className="flex-1">
                  <p className="text-xs text-zinc-200"><strong className="text-zinc-100">Rahul Sharma</strong> ने आपकी पोस्ट को लाइक किया।</p>
                  <span className="text-[10px] text-zinc-400">2 मिनट पहले</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold shrink-0">
                  BC
                </div>
                <div className="flex-1">
                  <p className="text-xs text-zinc-200"><strong className="text-zinc-100">BharatConnect Team</strong> ने आपको वेरीफाइड बैज दिया!</p>
                  <span className="text-[10px] text-zinc-400">1 घंटा पहले</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">
                  PS
                </div>
                <div className="flex-1">
                  <p className="text-xs text-zinc-200"><strong className="text-zinc-100">Priya Sharma</strong> ने आपके दोहे पर टिप्पणी की।</p>
                  <span className="text-[10px] text-zinc-400">1 दिन पहले</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- 5. PROFILE TAB (प्रोफ़ाइल) --- */}
        {activeTab === 'profile' && (
          <div className="p-4">
            <div className="flex flex-col items-center bg-zinc-900 border border-zinc-800 p-6 rounded-2xl text-center">
              <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-amber-500 to-orange-500 mb-3">
                <img 
                  src={currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"} 
                  className="w-full h-full rounded-full object-cover" 
                  alt="Profile" 
                />
              </div>
              <div className="flex items-center space-x-1">
                <h2 className="font-bold text-base text-zinc-100">
                  {currentUser?.username || firebaseAuthUser?.email?.split('@')[0] || 'as9621302122'}
                </h2>
                <CheckCircle2 size={16} className="text-blue-500 fill-blue-500/20" />
              </div>
              <p className="text-xs text-zinc-400 mt-1">भारत का अपना सोशल मीडिया क्रिएटर 🇮🇳</p>
              
              <div className="flex justify-around w-full mt-4 py-3 border-t border-b border-zinc-800">
                <div>
                  <span className="block font-bold text-sm text-zinc-100">{posts.length}</span>
                  <span className="text-[10px] text-zinc-400">पोस्ट्स</span>
                </div>
                <div>
                  <span className="block font-bold text-sm text-zinc-100">1.2K</span>
                  <span className="text-[10px] text-zinc-400">फॉलोअर्स</span>
                </div>
                <div>
                  <span className="block font-bold text-sm text-zinc-100">140</span>
                  <span className="text-[10px] text-zinc-400">फॉलोइंग</span>
                </div>
              </div>

              <div className="w-full mt-4 flex gap-2">
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="flex-1 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-zinc-950 font-bold rounded-xl text-xs hover:opacity-95 transition"
                >
                  नई पोस्ट बनाएं
                </button>
                <button 
                  onClick={() => {
                    if (setToastMessage) setToastMessage('प्रोफ़ाइल लिंक कॉपी किया गया!');
                  }}
                  className="px-4 py-2 bg-zinc-800 border border-zinc-700 text-zinc-200 font-medium rounded-xl text-xs hover:bg-zinc-750 transition"
                >
                  शेयर करें
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- 6. EXPLORE / SEARCH TAB (एक्सप्लोर) --- */}
        {activeTab === 'explore' && (
          <div className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 text-zinc-500" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="यूज़र्स, हैशटैग या आवाज़ खोजें..." 
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-amber-500" 
              />
            </div>

            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">ट्रेंडिंग हैशटैग्स</h3>
            <div className="space-y-2">
              {[
                { tag: '#Awaaz', count: '14.2K' },
                { tag: '#KabirDoha', count: '12.5K' },
                { tag: '#BharatConnect', count: '28.9K' },
                { tag: '#IndianRailways', count: '9.4K' },
                { tag: '#MakeInIndia', count: '31.0K' }
              ].map((item, i) => (
                <div 
                  key={i} 
                  onClick={() => {
                    setSelectedTagFilter(item.tag);
                    setActiveTab('home');
                  }}
                  className="flex justify-between items-center p-3 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-amber-500/50 cursor-pointer transition"
                >
                  <span className="text-sm font-semibold text-amber-400">{item.tag}</span>
                  <span className="text-xs text-zinc-500">{item.count} पोस्ट्स</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- 7. CHAT / DM SYSTEM (चैट) --- */}
        {activeTab === 'chat' && (
          <div className="flex flex-col h-[75vh]">
            <div className="p-3 bg-zinc-900 border-b border-zinc-800 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
                  className="w-full h-full rounded-full object-cover" 
                  alt="Chat User" 
                />
              </div>
              <div>
                <h4 className="font-bold text-sm text-zinc-100">Rahul Sharma</h4>
                <span className="text-[10px] text-green-500 flex items-center gap-1">● ऑनलाइन</span>
              </div>
            </div>

            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              {messages.map((m, idx) => (
                <div 
                  key={idx}
                  className={
                    m.isUser 
                      ? "bg-amber-500 text-zinc-950 p-3 rounded-2xl rounded-tr-none max-w-[80%] ml-auto text-xs font-medium shadow-sm"
                      : "bg-zinc-900 p-3 rounded-2xl rounded-tl-none max-w-[80%] text-xs text-zinc-200 border border-zinc-800 shadow-sm"
                  }
                >
                  <p>{m.text}</p>
                  <span className={`text-[9px] block text-right mt-1 ${m.isUser ? 'text-zinc-900/70' : 'text-zinc-500'}`}>
                    {m.time}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 bg-zinc-900 border-t border-zinc-800 flex items-center space-x-2">
              <input 
                type="text" 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="संदेश भेजें..." 
                className="flex-1 bg-zinc-950 border border-zinc-800 px-4 py-2 rounded-full text-xs text-zinc-200 focus:outline-none focus:border-amber-500" 
              />
              <button 
                type="submit" 
                className="p-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-full hover:scale-105 active:scale-95 transition cursor-pointer"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        )}

      </main>

      {/* --- CREATE POST MODAL --- */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col justify-end p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-2xl max-w-md mx-auto w-full animate-in slide-in-from-bottom duration-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-sm text-amber-400">नई पोस्ट बनाएं</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-zinc-400 hover:text-zinc-100 text-sm p-1">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleCreatePost}>
              <textarea 
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder="आप क्या सोच रहे हैं? यहाँ लिखें या दोहा साझा करें..." 
                className="w-full h-28 bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-amber-500 resize-none mb-3"
              />

              {/* Optional Image or Audio fields */}
              <div className="space-y-2 mb-3">
                <input 
                  type="text"
                  value={newPostImageUrl}
                  onChange={(e) => setNewPostImageUrl(e.target.value)}
                  placeholder="फोटो लिंक (Optional Image URL)..."
                  className="w-full bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-amber-500"
                />
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={newPostLocation}
                    onChange={(e) => setNewPostLocation(e.target.value)}
                    placeholder="स्थान (Location, e.g. नई दिल्ली)..."
                    className="flex-1 bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-amber-500"
                  />
                  <input 
                    type="text"
                    value={newPostAudioTitle}
                    onChange={(e) => setNewPostAudioTitle(e.target.value)}
                    placeholder="ऑडियो शीर्षक (Optional)..."
                    className="flex-1 bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                <div className="flex items-center space-x-2 text-zinc-400">
                  <button 
                    type="button" 
                    onClick={() => setNewPostImageUrl('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80')}
                    className="p-2 hover:text-amber-400 hover:bg-zinc-800 rounded-lg cursor-pointer" 
                    title="नमूना तस्वीर जोड़ें"
                  >
                    <ImageIcon size={18} />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setNewPostAudioTitle('आवाज़ (Awaaz Audio) - मधुर कविता')}
                    className="p-2 hover:text-amber-400 hover:bg-zinc-800 rounded-lg cursor-pointer" 
                    title="ऑडियो टैग जोड़ें"
                  >
                    <Mic size={18} />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || (!newPostText.trim() && !newPostImageUrl.trim())}
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-zinc-950 font-bold rounded-xl text-xs hover:opacity-95 transition disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'पोस्ट हो रहा है...' : 'पोस्ट करें'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Fixed Bottom Navigation Bar --- */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-zinc-900 border-t border-zinc-800 px-2 py-2 flex items-center justify-around z-40 select-none">
        {/* 1. होम (Home) */}
        <button
          onClick={() => { setActiveTab('home'); setSelectedTagFilter(null); }}
          className={`flex flex-col items-center py-1 px-2 cursor-pointer transition ${activeTab === 'home' ? 'text-amber-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          <Home size={20} />
          <span className="text-[10px] mt-1 font-medium">होम</span>
        </button>

        {/* 2. हुनर (Skills) */}
        <button
          onClick={() => setActiveTab('skills')}
          className={`flex flex-col items-center py-1 px-2 cursor-pointer transition ${activeTab === 'skills' ? 'text-amber-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          <GraduationCap size={20} />
          <span className="text-[10px] mt-1 font-medium">हुनर</span>
        </button>

        {/* 3. Central Plus (+) Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-11 h-11 -mt-5 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-zinc-950 font-bold shadow-lg hover:scale-105 active:scale-95 transition cursor-pointer border-2 border-zinc-950"
          title="नई पोस्ट बनाएं"
        >
          <Plus size={24} />
        </button>

        {/* 4. रील्स (Reels) */}
        <button
          onClick={() => setActiveTab('reels')}
          className={`flex flex-col items-center py-1 px-2 cursor-pointer transition ${activeTab === 'reels' ? 'text-amber-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          <Video size={20} />
          <span className="text-[10px] mt-1 font-medium">रील्स</span>
        </button>

        {/* 5. अलर्ट (Alerts / Notifications) */}
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex flex-col items-center py-1 px-2 relative cursor-pointer transition ${activeTab === 'alerts' ? 'text-amber-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          <Bell size={20} />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 bg-orange-500 rounded-full"></span>
          )}
          <span className="text-[10px] mt-1 font-medium">अलर्ट</span>
        </button>

        {/* 6. प्रोफ़ाइल (Profile) */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center py-1 px-2 cursor-pointer transition ${activeTab === 'profile' ? 'text-amber-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          <User size={20} />
          <span className="text-[10px] mt-1 font-medium">प्रोफ़ाइल</span>
        </button>
      </nav>
    </div>
  );
}
