import React, { useEffect, useState } from 'react';
import { useBharatConnect } from '../../context/BharatConnectContext';
import { User, Post } from '../../types/bharatConnect';
import { subscribeToUserFollowers } from '../../lib/followService';
import { 
  X, 
  CheckCircle2, 
  MapPin, 
  UserPlus, 
  UserCheck, 
  Grid, 
  Heart, 
  MessageCircle, 
  Camera, 
  Share2,
  Sparkles,
  Mic
} from 'lucide-react';
import { ChatModal } from './ChatModal';

interface UserProfileModalProps {
  user: User | null;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onClose }) => {
  const { 
    currentUser, 
    posts, 
    toggleFollowUser, 
    toggleLikePost, 
    followingIds, 
    isFirebaseAuthLoggedIn, 
    setIsAuthModalOpen,
    setToastMessage 
  } = useBharatConnect();

  const [liveFollowersCount, setLiveFollowersCount] = useState<number>(user?.followersCount || 0);
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (!user) return null;

  const currentUid = currentUser.uid || currentUser.id;
  const targetUid = user.uid || user.id;
  const isOwnProfile = currentUid === targetUid;
  const isFollowing = followingIds.includes(targetUid);

  // Subscribe to live followers for this user from Firestore
  useEffect(() => {
    if (!targetUid) return;
    const unsub = subscribeToUserFollowers(targetUid, (followerUids) => {
      // If we have followers in Firestore, use that count; otherwise keep existing or user count
      if (followerUids.length > 0) {
        setLiveFollowersCount(followerUids.length);
      }
    });

    return () => unsub();
  }, [targetUid]);

  // Keep local count in sync with user props if it changed
  useEffect(() => {
    setLiveFollowersCount(user.followersCount);
  }, [user.followersCount]);

  const userPosts = posts.filter(
    (p) => 
      (p.authorUid && (p.authorUid === targetUid || p.authorUid === user.id)) ||
      (p.authorId && (p.authorId === targetUid || p.authorId === user.id)) ||
      (p.author?.id && (p.author.id === targetUid || p.author.id === user.id))
  );

  const handleFollowClick = async () => {
    if (!isFirebaseAuthLoggedIn) {
      setToastMessage('फ़ॉलो करने के लिए कृपया पहले लॉगिन करें।');
      setIsAuthModalOpen(true);
      return;
    }

    if (isOwnProfile) {
      setToastMessage('आप स्वयं को फ़ॉलो नहीं कर सकते!');
      return;
    }

    await toggleFollowUser(user);
  };

  const handleShareProfile = () => {
    navigator.clipboard.writeText(`https://bharatconnect.app/u/${user.username}`);
    setToastMessage('प्रोफ़ाइल लिंक कॉपी हो गया! (Profile Link Copied)');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        {/* Top Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-white tracking-tight">{user.handle}</span>
            {user.verified && (
              <CheckCircle2 className="w-4 h-4 text-blue-400 fill-blue-400/20" />
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareProfile}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Share Profile"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 space-y-5 flex-1">
          {/* User Info Header */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Avatar with Gradient Border */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full p-1 bg-gradient-to-tr from-orange-500 via-amber-400 to-emerald-500 shadow-md">
                <img
                  src={user.photoURL || user.avatar}
                  alt={user.fullName || user.name}
                  className="w-full h-full rounded-full object-cover border-2 border-slate-950"
                />
              </div>
            </div>

            {/* Stats: Posts, Followers, Following */}
            <div className="flex-1 grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-xl bg-slate-950/40 border border-slate-800/60">
                <div className="text-base sm:text-lg font-black text-white">{userPosts.length}</div>
                <div className="text-[10px] sm:text-xs text-slate-400">पोस्ट्स</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/40 border border-slate-800/60">
                <div className="text-base sm:text-lg font-black text-white">{liveFollowersCount}</div>
                <div className="text-[10px] sm:text-xs text-slate-400">फ़ॉलोअर्स</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/40 border border-slate-800/60">
                <div className="text-base sm:text-lg font-black text-white">{user.followingCount}</div>
                <div className="text-[10px] sm:text-xs text-slate-400">फ़ॉलोइंग</div>
              </div>
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-1.5">
            <h2 className="text-base font-bold text-white flex items-center gap-1.5">
              <span>{user.fullName || user.name}</span>
              {user.verified && (
                <CheckCircle2 className="w-4 h-4 text-blue-400 fill-blue-400/20" />
              )}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
              {user.bio || 'भारत कनेक्ट सदस्य 🇮🇳'}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-0.5">
              <MapPin className="w-3.5 h-3.5 text-orange-400" />
              <span>{user.location || 'भारत'}</span>
            </div>
          </div>

          {/* Action Button: Instagram Follow / Following & Message */}
          <div className="pt-1">
            {isOwnProfile ? (
              <div className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold text-center">
                यह आपकी अपनी प्रोफ़ाइल है (Your Profile)
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleFollowClick}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-md active:scale-[0.98] cursor-pointer ${
                    isFollowing
                      ? 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
                      : 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white shadow-orange-500/20 hover:opacity-95'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                      <span>फ़ॉलो किया</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>फ़ॉलो करें</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsChatOpen(true)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm active:scale-[0.98] cursor-pointer"
                  title="संदेश भेजें"
                >
                  <MessageCircle className="w-4 h-4 text-orange-400" />
                  <span>संदेश (Message)</span>
                </button>
              </div>
            )}
          </div>

          {/* User's Posts Grid */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white border-t border-slate-800/80 pt-4">
              <Grid className="w-4 h-4 text-orange-400" />
              <span>पोस्ट्स ({userPosts.length})</span>
            </div>

            {userPosts.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/40 border border-slate-800/60 rounded-2xl space-y-2">
                <Camera className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">अभी तक कोई पोस्ट नहीं की है।</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {userPosts.map((post) => {
                  const postImg = post.imageUrl || post.imageURL;
                  const postText = post.text || post.caption || '';
                  return (
                    <div
                      key={post.id}
                      onClick={() => toggleLikePost(post.id)}
                      className="group relative aspect-square rounded-xl overflow-hidden bg-slate-950 border border-slate-800 cursor-pointer shadow-sm select-none"
                    >
                      {postImg ? (
                        <img
                          src={postImg}
                          alt={postText}
                          className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : post.mediaType === 'audio' || Boolean(post.audioURL) ? (
                        <div className="w-full h-full p-2 bg-gradient-to-br from-purple-950/70 via-slate-900 to-orange-950/70 flex flex-col justify-between">
                          <span className="text-[10px] text-purple-300 font-bold flex items-center gap-1">
                            <Mic className="w-3 h-3 text-orange-400" /> आवाज़
                          </span>
                          <p className="text-[10px] text-white line-clamp-2 font-medium">
                            {post.audioTitle || postText || 'ऑडियो शायरी'}
                          </p>
                        </div>
                      ) : (
                        <div className="w-full h-full p-2 bg-gradient-to-br from-orange-950/40 to-slate-900 flex items-center justify-center text-center">
                          <p className="text-[10px] text-white line-clamp-3">"{postText}"</p>
                        </div>
                      )}

                      {/* Stats Overlay on Hover */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 text-white text-xs font-bold">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                          {post.likesCount || post.likeCount || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3.5 h-3.5 fill-white" />
                          {post.commentsCount || (post.comments ? post.comments.length : 0)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 1-on-1 Direct Messaging Modal */}
      {isChatOpen && (
        <ChatModal
          recipientUser={user}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
};
