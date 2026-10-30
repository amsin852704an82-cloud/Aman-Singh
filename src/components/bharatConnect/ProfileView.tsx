import React, { useState, useEffect } from 'react';
import { useBharatConnect } from '../../context/BharatConnectContext';
import { useAuth } from '../../context/AuthContext';
import { 
  CheckCircle2, 
  MapPin, 
  Edit3, 
  LogOut, 
  Grid, 
  Bookmark, 
  Heart, 
  Trash2, 
  X, 
  Camera, 
  Sparkles, 
  Flame, 
  Check, 
  TrendingUp, 
  Eye, 
  Video, 
  DollarSign, 
  Send,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Post } from '../../types/bharatConnect';
import { subscribeToUserFollowers } from '../../lib/followService';
import { checkUsernameAvailability, validateUsernameFormat } from '../../lib/usernameService';

export interface ProfileViewProps {
  userEmail?: string;
  onLogout?: () => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'
];

export default function ProfileView({ userEmail, onLogout }: ProfileViewProps = {}) {
  const { 
    currentUser, 
    posts, 
    reels,
    updateProfile, 
    deletePost, 
    logout: contextLogout, 
    setIsAuthModalOpen,
    firebaseUser,
    t,
    setActiveTab,
    openPromoteModal,
    campaigns,
    activeCampaign,
    setToastMessage
  } = useBharatConnect();
  
  const { logout: authLogout, user: authUser, exitDemoMode } = useAuth();

  // Tab State matching blueprint: 'posts' | 'reels' | 'saved'
  const [activeTab, setActiveTabSub] = useState<'posts' | 'reels' | 'saved'>('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [liveFollowersCount, setLiveFollowersCount] = useState<number>(currentUser.followersCount || 1420);

  // UPI Super Thanks Earnings & Withdrawal Modal State
  const [creatorEarnings, setCreatorEarnings] = useState<number>(450.00);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [upiWithdrawId, setUpiWithdrawId] = useState('creator@bharatupi');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // Edit Profile Form State
  const effectiveEmail = userEmail || firebaseUser?.email || authUser?.email || 'creator@bharatconnect.in';
  const defaultUsername = userEmail ? userEmail.split('@')[0] : (currentUser.name || currentUser.username || 'भारतीय क्रिएटर');
  const [name, setName] = useState(currentUser.fullName || defaultUsername);
  const [editUsername, setEditUsername] = useState(currentUser.username || defaultUsername.toLowerCase().replace(/\s+/g, '_'));
  const [bio, setBio] = useState(currentUser.bio || '✨ काव्य, तकनीक और भारतीय संस्कृति का सफर। मिलकर कुछ नया सीखते हैं! 🇮🇳');
  const [location, setLocation] = useState(currentUser.location || 'India');
  const [avatar, setAvatar] = useState(currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200');
  const [isSaving, setIsSaving] = useState(false);
  const [usernameCheck, setUsernameCheck] = useState<{ checking: boolean; available?: boolean; message?: string }>({ checking: false });

  const myPosts = posts.filter((p) => p.author?.id === currentUser.id || p.authorId === currentUser.id);
  const savedPosts = posts.filter((p) => p.isSaved);
  const myReels = reels || [];

  // Username display for header
  const displayUsername = userEmail ? userEmail.split('@')[0] : (currentUser.fullName || currentUser.username || 'भारतीय क्रिएटर');
  const displayHandle = `@${displayUsername.toLowerCase().replace(/[^a-z0-9_]/g, '_')}`;

  // Sync edit form with currentUser when opened
  useEffect(() => {
    if (isEditing) {
      setName(currentUser.fullName || displayUsername);
      setEditUsername(currentUser.username || displayUsername.toLowerCase().replace(/\s+/g, '_'));
      setBio(currentUser.bio || '✨ काव्य, तकनीक और भारतीय संस्कृति का सफर। मिलकर कुछ नया सीखते हैं! 🇮🇳');
      setLocation(currentUser.location || 'India');
      setAvatar(currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200');
      setUsernameCheck({ checking: false });
    }
  }, [isEditing, currentUser, displayUsername]);

  // Check username availability when user changes username
  useEffect(() => {
    if (!isEditing || !editUsername.trim() || editUsername.toLowerCase().trim() === currentUser.username.toLowerCase()) {
      setUsernameCheck({ checking: false });
      return;
    }

    const timer = setTimeout(async () => {
      const val = validateUsernameFormat(editUsername);
      if (!val.valid) {
        setUsernameCheck({ checking: false, available: false, message: val.error });
        return;
      }

      setUsernameCheck({ checking: true });
      const currentUid = currentUser.uid || currentUser.id;
      const res = await checkUsernameAvailability(val.cleanUsername, currentUid);
      setUsernameCheck({ checking: false, available: res.available, message: res.message });
    }, 400);

    return () => clearTimeout(timer);
  }, [editUsername, isEditing, currentUser]);

  // Subscribe to live followers for current user in Firestore
  useEffect(() => {
    const currentUid = currentUser.uid || currentUser.id;
    if (!currentUid) return;
    const unsub = subscribeToUserFollowers(currentUid, (followerUids) => {
      if (followerUids.length > 0) {
        setLiveFollowersCount(followerUids.length);
      }
    });

    return () => unsub();
  }, [currentUser.uid, currentUser.id]);

  const handleLogoutAction = async () => {
    if (onLogout) {
      onLogout();
      return;
    }
    await authLogout();
    exitDemoMode();
    contextLogout();
    setToastMessage?.('लॉगआउट सफल रहा');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameCheck.available === false) return;
    setIsSaving(true);
    const success = await updateProfile(name, bio, location, avatar, editUsername);
    setIsSaving(false);
    if (success !== false) {
      setIsEditing(false);
      setToastMessage?.('प्रोफाइल सफलतापूर्वक अपडेट हो गई!');
    }
  };

  // Withdraw UPI earnings handler
  const handleExecuteWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiWithdrawId.trim() || creatorEarnings <= 0) return;

    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      setWithdrawSuccess(true);
      setTimeout(() => {
        setToastMessage?.(`₹${creatorEarnings.toFixed(2)} आपके UPI ID (${upiWithdrawId}) में ट्रांसफर कर दिए गए हैं! 🚀`);
        setCreatorEarnings(0);
        setIsWithdrawModalOpen(false);
        setWithdrawSuccess(false);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="w-full min-h-screen bg-[#0F172A] text-slate-100 font-sans pb-24">
      
      {/* 1. कवर बैनर (Cover Banner with Orange Overlay) */}
      <div className="w-full h-[130px] bg-[#1E293B] relative overflow-hidden">
        {/* Background gradient & decorative pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-950/40 via-slate-900 to-amber-950/40" />
        <div 
          style={{ backgroundColor: 'rgba(255, 107, 0, 0.15)' }} 
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent" />
      </div>

      {/* 2. प्रोफाइल हेडर सेक्शन (Profile Header Section) */}
      <div className="bg-[#1E293B] px-4 pb-4 border-b border-[#334155] rounded-b-3xl relative shadow-lg">
        
        {/* अवतार कंटेनर (Avatar with Overlap -45px & Border #FF6B00) */}
        <div className="flex justify-between items-start">
          <div className="-mt-[45px] mb-2.5 relative">
            <img
              src={currentUser.photoURL || currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
              alt={displayUsername}
              style={{
                width: 90,
                height: 90,
                borderRadius: 45,
                borderWidth: 3,
                borderColor: '#FF6B00'
              }}
              className="object-cover shadow-2xl bg-slate-900"
            />
            <button
              onClick={() => setIsEditing(true)}
              className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#1E293B] border border-[#FF6B00] text-[#FF6B00] hover:scale-110 active:scale-95 transition shadow-md"
              title="प्रोफाइल फोटो बदलें"
            >
              <Camera size={14} />
            </button>
          </div>

          {/* हेडर एक्शन्स: एडिट प्रोफाइल & लॉगआउट बटन */}
          <div className="flex items-center gap-2 pt-3">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#334155] hover:bg-slate-700 active:scale-95 transition px-3 py-1.5 rounded-2xl border border-[#FF6B00] text-[#FF6B00] text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Edit3 size={12} />
              <span>✏️ एडिट प्रोफाइल</span>
            </button>

            <button
              onClick={handleLogoutAction}
              className="bg-[#EF4444] hover:bg-rose-600 active:scale-95 transition px-3 py-1.5 rounded-2xl text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-sm"
              title="लॉगआउट करें"
            >
              <LogOut size={12} />
              <span>लॉगआउट</span>
            </button>
          </div>
        </div>

        {/* नाम और बायो */}
        <div className="mt-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h1 className="text-xl font-bold text-[#F8FAFC]">
              {displayUsername} 🇮🇳
            </h1>
            {currentUser.verified && (
              <CheckCircle2 size={16} className="text-blue-400 fill-blue-400/20" />
            )}
          </div>
          <p className="text-[#94A3B8] text-xs font-medium mb-2">
            {displayHandle}
          </p>
          <p className="text-[#CBD5E1] text-sm leading-relaxed mb-4">
            {currentUser.bio || bio}
          </p>
        </div>

        {/* 3. स्टैट्स रो (पोस्ट्स, फॉलोअर्स, फॉलोइंग) */}
        <div className="bg-[#0F172A] rounded-xl py-3 px-2 flex justify-around items-center border border-[#334155] mb-4 shadow-inner">
          <div className="text-center flex-1">
            <span className="text-white text-base font-bold block">
              {myPosts.length > 0 ? myPosts.length : 24}
            </span>
            <span className="text-[#94A3B8] text-xs mt-0.5 block">पोस्ट्स</span>
          </div>

          <div className="w-[1px] h-6 bg-[#334155]" />

          <div className="text-center flex-1">
            <span className="text-white text-base font-bold block">
              {liveFollowersCount > 999 ? `${(liveFollowersCount / 1000).toFixed(1)}K` : liveFollowersCount}
            </span>
            <span className="text-[#94A3B8] text-xs mt-0.5 block">फॉलोअर्स</span>
          </div>

          <div className="w-[1px] h-6 bg-[#334155]" />

          <div className="text-center flex-1">
            <span className="text-white text-base font-bold block">
              {currentUser.followingCount || 320}
            </span>
            <span className="text-[#94A3B8] text-xs mt-0.5 block">फॉलोइंग</span>
          </div>
        </div>

        {/* 4. UPI क्रिएटर अर्निंग्स कार्ड (₹1 प्रति लाइक मॉडल) */}
        <div 
          style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
          className="rounded-2xl p-4 flex justify-between items-center border border-emerald-500/50 mb-4 shadow-md bg-emerald-950/20"
        >
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400 text-xs font-bold">
                💰 कुल क्रिएटर कमाई (₹1 प्रति लाइक)
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 font-extrabold px-1.5 py-0.5 rounded text-[9px] border border-emerald-500/30">
                लाइव रिवॉर्ड
              </span>
            </div>
            <span className="text-emerald-400 text-xl font-black block mt-1 font-mono tracking-tight">
              ₹{creatorEarnings.toFixed(2)}
            </span>
            <span className="text-slate-400 text-[10px] block mt-0.5">
              प्रति लाइक ₹1 कैश | UPI से तत्काल निकासी
            </span>
          </div>

          <button
            onClick={() => {
              if (creatorEarnings <= 0) {
                setToastMessage?.('निकासी के लिए न्यूनतम बैलेंस ₹10 होना चाहिए');
                return;
              }
              setIsWithdrawModalOpen(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition text-white px-3.5 py-2.5 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-600/30"
          >
            <span>पैसे निकालें 💸</span>
          </button>
        </div>

        {/* 5. टैब्स (पोस्ट्स / रील्स / सेव्ड) */}
        <div className="flex justify-around border-t border-[#334155] pt-3">
          <button
            onClick={() => setActiveTabSub('posts')}
            className={`py-1.5 px-3 rounded-lg text-xs transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'posts' 
                ? 'bg-[#334155] text-[#FF6B00] font-bold' 
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <span>🖼️</span>
            <span>पोस्ट्स</span>
          </button>

          <button
            onClick={() => setActiveTabSub('reels')}
            className={`py-1.5 px-3 rounded-lg text-xs transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'reels' 
                ? 'bg-[#334155] text-[#FF6B00] font-bold' 
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <span>🎥</span>
            <span>रील्स</span>
          </button>

          <button
            onClick={() => setActiveTabSub('saved')}
            className={`py-1.5 px-3 rounded-lg text-xs transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'saved' 
                ? 'bg-[#334155] text-[#FF6B00] font-bold' 
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <span>🔖</span>
            <span>सेव किए गए</span>
          </button>
        </div>
      </div>

      {/* 6. ग्रिड कंटेंट (3-Column Media Grid) */}
      <div className="p-1 max-w-2xl mx-auto">
        {activeTab === 'posts' && (
          <div className="grid grid-cols-3 gap-1">
            {myPosts.length > 0 ? (
              myPosts.map((post, index) => (
                <div 
                  key={post.id || index}
                  className="aspect-square bg-[#1E293B] rounded-md overflow-hidden relative group cursor-pointer"
                >
                  {post.imageUrl || post.imageURL || post.mediaUrl ? (
                    <img 
                      src={post.imageUrl || post.imageURL || post.mediaUrl} 
                      alt="पोस्ट इमेज" 
                      className="w-full h-full object-cover transition group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-900 to-orange-950/40 p-2 flex flex-col justify-between text-[11px] text-slate-300">
                      <span className="text-[10px] text-orange-400 font-bold">📝 विचार</span>
                      <p className="line-clamp-3 italic">"{post.text || post.caption || ''}"</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 text-white text-xs font-bold">
                    <span className="flex items-center gap-1">
                      <Heart size={14} className="fill-rose-500 text-rose-500" />
                      {post.likesCount || 0}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              // 6 Blueprint Initial Media items
              [1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="aspect-square bg-[#1E293B] rounded-md overflow-hidden relative group cursor-pointer">
                  <img
                    src={`https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&sig=${item}`}
                    alt="ग्रिड मीडिया"
                    className="w-full h-full object-cover transition group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1">
                    <Heart size={14} className="fill-rose-500 text-rose-500" />
                    <span>{item * 42}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'reels' && (
          <div className="grid grid-cols-3 gap-1">
            {myReels.length > 0 ? (
              myReels.map((reel) => (
                <div key={reel.id} className="aspect-[9/16] bg-[#1E293B] rounded-md overflow-hidden relative group cursor-pointer">
                  <img 
                    src={reel.posterUrl || 'https://images.unsplash.com/photo-1510519138171-eb1362e5b888?w=400'} 
                    alt={reel.caption} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white">
                    <Video size={12} />
                  </div>
                  <div className="absolute bottom-1.5 left-1.5 text-[10px] text-white font-bold flex items-center gap-1 drop-shadow-md">
                    <Heart size={11} className="fill-white" />
                    <span>{reel.likesCount}</span>
                  </div>
                </div>
              ))
            ) : (
              [1, 2, 3].map((r) => (
                <div key={r} className="aspect-[9/16] bg-[#1E293B] rounded-md overflow-hidden relative group cursor-pointer">
                  <img 
                    src={`https://images.unsplash.com/photo-1510519138171-eb1362e5b888?w=400&sig=${r}`} 
                    alt="रील" 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white">
                    <Video size={12} />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="grid grid-cols-3 gap-1">
            {savedPosts.length > 0 ? (
              savedPosts.map((post) => (
                <div key={post.id} className="aspect-square bg-[#1E293B] rounded-md overflow-hidden relative group cursor-pointer">
                  {post.imageUrl || post.mediaUrl ? (
                    <img src={post.imageUrl || post.mediaUrl} alt="सेव पोस्ट" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full p-2 bg-slate-900 flex items-center justify-center text-center text-xs text-slate-300">
                      <p className="line-clamp-3">{post.caption || post.text}</p>
                    </div>
                  )}
                  <div className="absolute bottom-1 left-1 bg-black/70 px-1.5 py-0.5 rounded text-[9px] text-white">
                    @{post.author?.username || 'user'}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 py-16 text-center text-slate-400">
                <Bookmark size={32} className="mx-auto mb-2 text-slate-600" />
                <p className="text-sm font-semibold">कोई सहेजी गई पोस्ट नहीं है</p>
                <p className="text-xs text-slate-500 mt-1">होम फ़ीड में बुकमार्क आइकन दबाकर पोस्ट सहेजें।</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- EDIT PROFILE MODAL --- */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-[#334155] rounded-3xl p-5 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#334155] mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>✏️ एडिट प्रोफाइल</span>
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Avatar Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  प्रोफाइल अवतार चुनें:
                </label>
                <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
                  {AVATAR_PRESETS.map((p, idx) => (
                    <img
                      key={idx}
                      src={p}
                      alt="Preset"
                      onClick={() => setAvatar(p)}
                      className={`w-12 h-12 rounded-full object-cover cursor-pointer border-2 transition ${
                        avatar === p ? 'border-[#FF6B00] scale-110 shadow-lg' : 'border-slate-700 opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  पूरा नाम (Full Name)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF6B00]"
                  required
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  यूज़रनेम (@username)
                </label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF6B00]"
                  required
                />
                {usernameCheck.message && (
                  <p className={`text-[11px] mt-1 ${usernameCheck.available ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {usernameCheck.message}
                  </p>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  बायो (Bio)
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#FF6B00] resize-none"
                  placeholder="अपने बारे में कुछ बताएं..."
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700 transition"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={isSaving || usernameCheck.available === false}
                  className="flex-1 py-2.5 bg-[#FF6B00] hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-orange-500/20"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>सेव हो रहा है...</span>
                    </>
                  ) : (
                    <span>सेव करें 💾</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- UPI EARNINGS WITHDRAWAL MODAL --- */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-[#334155] rounded-3xl p-5 max-w-sm w-full shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsWithdrawModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-4">
              <span className="text-3xl">☕</span>
              <h3 className="text-white font-bold text-base mt-2">
                सुपर थैंक्स राशि निकालें
              </h3>
              <p className="text-slate-300 text-xs mt-1">
                कुल उपलब्ध बैलेंस: <strong className="text-[#FF6B00] font-mono text-sm">₹{creatorEarnings.toFixed(2)}</strong>
              </p>
            </div>

            {withdrawSuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <p className="text-white font-bold text-sm">UPI ट्रांसफर सफल! 🎉</p>
                <p className="text-slate-400 text-xs">राशि आपके बैंक खाते में जमा कर दी गई है।</p>
              </div>
            ) : (
              <form onSubmit={handleExecuteWithdrawal} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    अपना UPI ID (VPA) दर्ज करें:
                  </label>
                  <input
                    type="text"
                    value={upiWithdrawId}
                    onChange={(e) => setUpiWithdrawId(e.target.value)}
                    placeholder="उदा. yourname@okhdfcbank"
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF6B00] font-mono"
                    required
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Google Pay, PhonePe, BHIM, Paytm पर तत्काल 0% शुल्क ट्रांसफर।
                  </p>
                </div>

                <div className="bg-[#0F172A] p-3 rounded-xl border border-slate-800 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-300">
                    <span>निकासी राशि:</span>
                    <span className="font-bold text-white font-mono">₹{creatorEarnings.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>प्रोसेसिंग शुल्क:</span>
                    <span className="text-emerald-400 font-bold">₹0.00 (मुफ्त)</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isWithdrawing}
                  className="w-full bg-[#FF6B00] hover:bg-orange-600 active:scale-95 text-white font-bold py-3 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                >
                  {isWithdrawing ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>बैंक को ट्रांसफर हो रहा है...</span>
                    </>
                  ) : (
                    <span>सीधे बैंक खाते में ट्रांसफर करें 🚀</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

// Named export for compatibility
export { ProfileView };
