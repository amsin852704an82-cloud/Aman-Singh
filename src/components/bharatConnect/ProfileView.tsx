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
  User as UserIcon,
  Sparkles,
  Camera,
  Flame,
  ShieldCheck,
  Mic,
  Music
} from 'lucide-react';
import { Post } from '../../types/bharatConnect';
import { subscribeToUserFollowers } from '../../lib/followService';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'
];

export const ProfileView: React.FC = () => {
  const { 
    currentUser, 
    posts, 
    updateProfile, 
    deletePost, 
    logout: contextLogout, 
    setIsAuthModalOpen,
    firebaseUser,
    t,
    setActiveTab 
  } = useBharatConnect();
  const { logout: authLogout, user: authUser, exitDemoMode } = useAuth();

  const [activeTabSub, setActiveTabSub] = useState<'posts' | 'saved'>('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [liveFollowersCount, setLiveFollowersCount] = useState<number>(currentUser.followersCount || 0);

  // Edit form state
  const [name, setName] = useState(currentUser.fullName);
  const [bio, setBio] = useState(currentUser.bio);
  const [location, setLocation] = useState(currentUser.location);
  const [avatar, setAvatar] = useState(currentUser.avatar);

  const myPosts = posts.filter((p) => p.author.id === currentUser.id);
  const savedPosts = posts.filter((p) => p.isSaved);

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

  useEffect(() => {
    if (typeof currentUser.followersCount === 'number') {
      setLiveFollowersCount(currentUser.followersCount);
    }
  }, [currentUser.followersCount]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(name, bio, location, avatar);
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 space-y-6">
      {/* Profile Header */}
      <div className="bg-slate-900/60 rounded-3xl p-5 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar with Indian Flag Gradient ring */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-orange-500 via-amber-400 to-emerald-500 shadow-lg">
              <img
                src={currentUser.photoURL || currentUser.avatar}
                alt={currentUser.name || currentUser.fullName}
                className="w-full h-full rounded-full object-cover border-2 border-slate-950"
              />
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="absolute bottom-0 right-0 p-1.5 rounded-full bg-slate-900 border border-slate-700 text-orange-400 shadow-md hover:scale-105 transition"
              title="Edit Profile"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                {currentUser.name || currentUser.fullName}
              </h2>
              {currentUser.verified && (
                <CheckCircle2 className="w-4 h-4 text-blue-400 fill-blue-400/20" />
              )}
              <span className="text-xs text-slate-400">{currentUser.handle}</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-md">
              {currentUser.bio}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-orange-400" />
                <span>{currentUser.location}</span>
              </div>
              <span>·</span>
              {firebaseUser ? (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>UID: {firebaseUser.uid.slice(0, 8)}...</span>
                  </span>
                  <span className="text-slate-400 text-[11px]">{firebaseUser.email}</span>
                </div>
              ) : (
                <span className="text-emerald-400 font-medium">सत्यापित भारतीय नागरिक (Verified)</span>
              )}
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
              <button
                onClick={() => {
                  setName(currentUser.fullName);
                  setBio(currentUser.bio);
                  setLocation(currentUser.location);
                  setAvatar(currentUser.avatar);
                  setIsEditing(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition active:scale-95"
              >
                <Edit3 className="w-3.5 h-3.5 text-orange-400" />
                <span>{t.editProfile}</span>
              </button>

              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-semibold transition active:scale-95"
              >
                {firebaseUser ? 'खाता बदलें (Switch)' : 'Firebase लॉगिन / खाता (Login)'}
              </button>

              <button
                onClick={async () => {
                  await authLogout();
                  exitDemoMode();
                  contextLogout();
                }}
                className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
                title={t.logout}
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>लॉग आउट (Log Out)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Counts Row */}
        <div className="grid grid-cols-3 divide-x divide-slate-800 border-t border-slate-800/80 pt-4 text-center">
          <div>
            <div className="text-lg font-black text-white">{myPosts.length}</div>
            <div className="text-[11px] text-slate-400">{t.posts}</div>
          </div>
          <div>
            <div className="text-lg font-black text-white">{liveFollowersCount}</div>
            <div className="text-[11px] text-slate-400">{t.followers}</div>
          </div>
          <div>
            <div className="text-lg font-black text-white">{currentUser.followingCount}</div>
            <div className="text-[11px] text-slate-400">{t.following}</div>
          </div>
        </div>
      </div>

      {/* Tabs: My Posts vs Saved */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTabSub('posts')}
          className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition ${
            activeTabSub === 'posts'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>मेरी पोस्ट्स ({myPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTabSub('saved')}
          className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition ${
            activeTabSub === 'saved'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>सहेजी गई पोस्ट्स ({savedPosts.length})</span>
        </button>
      </div>

      {/* Posts Grid */}
      {activeTabSub === 'posts' ? (
        myPosts.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
            <Camera className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">अभी तक कोई पोस्ट नहीं की है</p>
            <p className="text-xs text-slate-500">अपनी पहली तस्वीर या विचार BharatConnect पर साझा करें!</p>
            <button
              onClick={() => setActiveTab('create')}
              className="px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-semibold shadow-md active:scale-95 transition"
            >
              + पहली पोस्ट बनाएं
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {myPosts.map((post) => (
              <div
                key={post.id}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-sm"
              >
                {post.imageUrl ? (
                  <img
                    src={post.imageUrl}
                    alt={post.caption || 'Post image'}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : post.mediaType === 'audio' || Boolean(post.audioURL) ? (
                  <div className="w-full h-full p-3.5 bg-gradient-to-br from-purple-950/70 via-slate-900 to-orange-950/70 flex flex-col justify-between select-none">
                    <div className="flex items-center justify-between">
                      <span className="p-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        <Mic className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-[10px] text-orange-400 font-mono">🎙️ आवाज़</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-white line-clamp-2">
                        {post.audioTitle || post.caption || 'ऑडियो शायरी'}
                      </p>
                      <div className="flex items-center gap-0.5 h-3">
                        {[40, 75, 55, 90, 60, 80, 45, 95].map((h, i) => (
                          <div 
                            key={i} 
                            style={{ height: `${h}%` }} 
                            className="w-1 bg-purple-400/80 rounded-full" 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full p-3 bg-gradient-to-br from-orange-950/30 to-slate-900 flex items-center justify-center text-center p-3">
                    <p className="text-xs text-slate-200 line-clamp-4 italic">
                      "{post.text || post.caption}"
                    </p>
                  </div>
                )}
                
                {/* Overlay with stats & delete */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 text-white">
                  <div className="flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('क्या आप वाकई इस पोस्ट को हटाना चाहते हैं?')) {
                          deletePost(post.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-red-500/80 hover:bg-red-600 text-white transition active:scale-90"
                      title="Delete post"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      {post.likesCount}
                    </span>
                    <span>{post.commentsCount} टिप्पणियां</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        savedPosts.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800">
            <Bookmark className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">कोई सहेजी गई पोस्ट नहीं है</p>
            <p className="text-xs text-slate-500 mt-1">होम फ़ीड में बुकमार्क आइकन दबाकर पोस्ट सहेजें।</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {savedPosts.map((post) => (
              <div
                key={post.id}
                className="relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-800"
              >
                {post.imageUrl ? (
                  <img
                    src={post.imageUrl}
                    alt={post.caption || 'Saved post'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full p-3 bg-gradient-to-br from-purple-950/50 to-slate-900 flex flex-col justify-between">
                    <span className="text-[10px] text-purple-300 font-bold flex items-center gap-1">
                      <Mic className="w-3 h-3" /> आवाज़
                    </span>
                    <p className="text-xs text-slate-200 line-clamp-3">
                      {post.caption || post.text}
                    </p>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded-lg text-[10px] text-white">
                  @{post.author.username}
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-orange-500" />
                {t.editProfile}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Avatar Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  प्रोफ़ाइल फ़ोटो चुनें (Choose Avatar)
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {AVATAR_PRESETS.map((url, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setAvatar(url)}
                      className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition shrink-0 ${
                        avatar === url ? 'border-orange-500 scale-105' : 'border-slate-700 opacity-60'
                      }`}
                    >
                      <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {t.fullName}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              {/* Bio */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {t.bio}
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              {/* Location */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {t.location}
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition shadow-md"
                >
                  {t.saveChanges}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
