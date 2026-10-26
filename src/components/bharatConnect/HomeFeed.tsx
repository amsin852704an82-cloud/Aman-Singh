import React, { useState } from 'react';
import { useBharatConnect } from '../../context/BharatConnectContext';
import { Post, Story } from '../../types/bharatConnect';
import { StoryModal } from './StoryModal';
import { CommentDrawer } from './CommentDrawer';
import { ReportModal } from './ReportModal';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MoreHorizontal, 
  CheckCircle2, 
  MapPin, 
  Plus, 
  TrendingUp, 
  Sparkles, 
  Smartphone,
  Share2,
  Trash2,
  Users,
  Edit3,
  X,
  Check,
  Loader2,
  Mic,
  Radio
} from 'lucide-react';
import { AwaazAudioCard } from './AwaazAudioCard';
import { AwaazRecordModal } from './AwaazRecordModal';
import { FloatingActionButton } from './FloatingActionButton';
import { SkeletonFeedCard } from './SkeletonFeedCard';
import { ProgressiveImage } from './ProgressiveImage';
import { triggerHaptic } from '../../lib/deviceOptimization';

export const HomeFeed: React.FC = () => {
  const { 
    posts, 
    stories, 
    currentUser, 
    users, 
    t, 
    toggleLikePost, 
    toggleSavePost, 
    toggleFollowUser,
    addComment,
    setActiveTab,
    setToastMessage,
    deletePost,
    updatePostCaption,
    openUserProfile,
    followingIds
  } = useBharatConnect();

  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [commentingPost, setCommentingPost] = useState<Post | null>(null);
  const [reportingPost, setReportingPost] = useState<Post | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editCaptionText, setEditCaptionText] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [openMenuPostId, setOpenMenuPostId] = useState<string | null>(null);
  const [likedAnimPostId, setLikedAnimPostId] = useState<string | null>(null);
  const [inlineComments, setInlineComments] = useState<{ [postId: string]: string }>({});
  const [feedTab, setFeedTab] = useState<'explore' | 'following' | 'awaaz'>('explore');
  const [isAwaazRecordOpen, setIsAwaazRecordOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    triggerHaptic('light');
    setTimeout(() => {
      setVisibleCount((prev) => prev + 10);
      setIsLoadingMore(false);
    }, 350);
  };

  const handleStartEdit = (post: Post) => {
    setEditingPost(post);
    setEditCaptionText(post.text || post.caption || '');
    setOpenMenuPostId(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;
    const txt = editCaptionText.trim();
    if (!txt) {
      setToastMessage('कैप्शन खाली नहीं हो सकता');
      return;
    }
    setIsSavingEdit(true);
    try {
      await updatePostCaption(editingPost.id, txt);
      setEditingPost(null);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDoubleTapLike = (post: Post) => {
    triggerHaptic('doubleTap');
    if (!post.isLiked) {
      toggleLikePost(post.id);
    }
    setLikedAnimPostId(post.id);
    setTimeout(() => setLikedAnimPostId(null), 800);
  };

  const handleLikeClick = (postId: string) => {
    triggerHaptic('medium');
    toggleLikePost(postId);
  };

  const handleSaveClick = (postId: string) => {
    triggerHaptic('light');
    toggleSavePost(postId);
  };

  const handleShare = (post: Post) => {
    navigator.clipboard.writeText(`https://bharatconnect.app/p/${post.id}`);
    setToastMessage('पोस्ट लिंक कॉपी हो गया! (Post Link Copied)');
  };

  const handleInlineCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const txt = inlineComments[postId]?.trim();
    if (!txt) return;
    addComment(postId, txt);
    setInlineComments((prev) => ({ ...prev, [postId]: '' }));
  };

  const currentUid = currentUser.uid || currentUser.id;
  const suggestedUsers = users.filter((u) => u.id !== currentUid && (u.uid ? u.uid !== currentUid : true));

  return (
    <div className="max-w-4xl mx-auto pb-24 pt-2">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Column (8 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Authenticated User Profile Banner on Home Feed */}
          <div className="bg-gradient-to-r from-orange-950/40 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-orange-500 via-amber-400 to-emerald-500 shadow-md">
                  <img
                    src={currentUser.photoURL || currentUser.avatar}
                    alt={currentUser.name || currentUser.fullName}
                    className="w-full h-full rounded-full object-cover border-2 border-slate-950"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full" title="सक्रिय (Online)" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-orange-400 font-semibold">नमस्ते 🇮🇳</span>
                  <span className="text-sm font-bold text-white truncate max-w-[180px]">
                    {currentUser.name || currentUser.fullName}
                  </span>
                  {currentUser.verified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20 shrink-0" />
                  )}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {currentUser.handle} {currentUser.email && `· ${currentUser.email}`}
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('create')}
              className="px-3 py-2 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-orange-400 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 shrink-0"
              title="नई पोस्ट बनाएं"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">नई पोस्ट (+)</span>
            </button>
          </div>

          {/* Stories Horizontal Strip */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 overflow-x-auto no-scrollbar shadow-sm">
            <div className="flex items-center gap-3.5 min-w-max">
              {/* Current User Story / Add Story */}
              <div 
                onClick={() => setActiveTab('create')}
                className="flex flex-col items-center gap-1.5 cursor-pointer group select-none"
              >
                <div className="relative w-15 h-15 rounded-full p-0.5 border border-slate-700">
                  <img
                    src={currentUser.photoURL || currentUser.avatar}
                    alt={currentUser.name || currentUser.fullName}
                    className="w-full h-full rounded-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 w-4.5 h-4.5 bg-orange-500 text-white rounded-full flex items-center justify-center border-2 border-slate-900">
                    <Plus className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-300 truncate max-w-[64px]">
                  {currentUser.name ? currentUser.name.split(' ')[0] : 'आपकी स्टोरी'}
                </span>
              </div>

              {/* Other Stories */}
              {stories.map((story) => (
                <div
                  key={story.id}
                  onClick={() => setActiveStory(story)}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group select-none"
                >
                  <div className={`w-15 h-15 rounded-full p-0.5 transition-transform group-hover:scale-105 ${
                    story.hasSeen
                      ? 'border-2 border-slate-700'
                      : 'bg-gradient-to-tr from-orange-500 via-amber-400 to-emerald-400'
                  }`}>
                    <img
                      src={story.author.avatar}
                      alt={story.author.fullName}
                      className="w-full h-full rounded-full object-cover border-2 border-slate-900"
                    />
                  </div>
                  <span className="text-[11px] font-medium text-slate-300 truncate max-w-[64px]">
                    {story.author.fullName.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Feed Switcher Tabs: Explore vs Following vs Awaaz */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 shadow-sm">
            <button
              onClick={() => setFeedTab('explore')}
              className={`flex-1 py-2 text-[11px] sm:text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                feedTab === 'explore'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>एक्सप्लोर</span>
            </button>

            <button
              onClick={() => setFeedTab('following')}
              className={`flex-1 py-2 text-[11px] sm:text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                feedTab === 'following'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>फ़ॉलोइंग ({followingIds.length})</span>
            </button>

            <button
              onClick={() => setFeedTab('awaaz')}
              className={`flex-1 py-2 text-[11px] sm:text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                feedTab === 'awaaz'
                  ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white shadow-md shadow-purple-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-orange-400" />
              <span>🎙️ आवाज़</span>
            </button>
          </div>

          {/* Awaaz Banner when Awaaz tab is selected */}
          {feedTab === 'awaaz' && (
            <div className="bg-gradient-to-r from-purple-950/50 via-slate-900 to-orange-950/50 border border-purple-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>आवाज़ (Awaaz) Feed</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">
                      ऑडियो व शायरी
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300">
                    अपनी आवाज़ में कविता, शायरी, लोकगीत या विचार रिकॉर्ड करें व सुनें।
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAwaazRecordOpen(true)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-500 hover:to-orange-400 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition cursor-pointer"
              >
                <Mic className="w-4 h-4" />
                <span>नई आवाज़ रिकॉर्ड करें</span>
              </button>
            </div>
          )}

          {/* Posts Stream */}
          <div className="space-y-4">
            {(() => {
              const photoPosts = posts.filter((p) => p.mediaType !== 'audio' && !p.audioURL);
              const audioPosts = posts.filter((p) => p.mediaType === 'audio' || Boolean(p.audioURL));

              const displayedPosts = feedTab === 'following'
                ? posts.filter((p) => {
                    const authorUid = p.authorUid || p.authorId || p.author?.id || p.author?.uid;
                    return authorUid && followingIds.includes(authorUid);
                  })
                : feedTab === 'awaaz'
                ? audioPosts
                : posts;

              if (feedTab === 'following' && displayedPosts.length === 0) {
                return (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 mx-auto flex items-center justify-center shadow-inner">
                      <Users className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-white">आपने अभी तक किसी को फॉलो नहीं किया है</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                      जब आप क्रिएटर्स को फ़ॉलो करेंगे, तो उनके ताज़ा विचार और तस्वीरें यहाँ दिखाई देंगी।
                    </p>
                    <button
                      onClick={() => setFeedTab('explore')}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold shadow-md active:scale-95 transition cursor-pointer"
                    >
                      एक्सप्लोर फ़ीड देखें (Explore)
                    </button>
                  </div>
                );
              }

              if (feedTab === 'awaaz' && displayedPosts.length === 0) {
                return (
                  <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-8 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mx-auto flex items-center justify-center shadow-inner">
                      <Mic className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-white">अभी कोई आवाज़ पोस्ट नहीं है</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                      पहली आवाज़ आपकी हो सकती है! अपनी पसंदीदा शायरी, दोहा या विचार रिकॉर्ड करें।
                    </p>
                    <button
                      onClick={() => setIsAwaazRecordOpen(true)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-orange-500 text-white text-xs font-bold shadow-md active:scale-95 transition cursor-pointer"
                    >
                      🎙️ आवाज़ रिकॉर्ड करें
                    </button>
                  </div>
                );
              }

              const paginatedPosts = displayedPosts.slice(0, visibleCount);
              const hasMorePosts = displayedPosts.length > visibleCount;

              return (
                <>
                  {paginatedPosts.map((post) => {
              const authorName = post.author?.name || post.author?.fullName || post.authorName || 'भारत नागरिक';
                const authorAvatar = post.author?.photoURL || post.author?.avatar || post.authorPhotoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';
                const authorHandle = post.author?.handle || `@${authorName.toLowerCase().replace(/\s+/g, '')}`;
                const isMyPost = (post.authorUid && currentUser.uid && post.authorUid === currentUser.uid) ||
                                 (post.authorId && currentUser.uid && post.authorId === currentUser.uid) ||
                                 (post.author?.id && post.author.id === currentUser.id);
                const postText = post.text || post.caption || '';
                const postImg = post.imageUrl || post.imageURL || post.mediaUrl || '';
                const currentLikes = typeof post.likeCount === 'number' ? post.likeCount : (post.likesCount || 0);

                return (
                  <article
                    key={post.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm"
                  >
                    {/* Post Header */}
                    <div className="p-3.5 flex items-center justify-between">
                      <div 
                        onClick={() => {
                          if (!post.isAnonymous && post.author) {
                            openUserProfile(post.author);
                          }
                        }}
                        className={`flex items-center gap-2.5 ${post.isAnonymous ? 'cursor-default' : 'cursor-pointer group'}`}
                        title={post.isAnonymous ? 'दिल से / गुप्त पोस्ट (Anonymous)' : 'प्रोफ़ाइल देखें (View Profile)'}
                      >
                        <img
                          src={authorAvatar}
                          alt={authorName}
                          className={`w-9 h-9 rounded-full object-cover border transition ${
                            post.isAnonymous 
                              ? 'border-purple-400/80 bg-purple-950/50' 
                              : 'border-slate-700 group-hover:border-orange-500/60'
                          }`}
                        />
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`font-bold text-xs ${post.isAnonymous ? 'text-purple-300' : 'text-white group-hover:text-orange-400 transition'}`}>
                              {authorName}
                            </span>
                            {post.isAnonymous ? (
                              <span className="px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[9px] font-bold flex items-center gap-0.5">
                                <span>🔒</span>
                                <span>दिल से</span>
                              </span>
                            ) : (
                              post.author?.verified && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 fill-orange-400/20" />
                              )
                            )}
                            <span className="text-[11px] text-slate-400 font-normal">
                              {authorHandle}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-slate-400">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            <span className="truncate max-w-[180px]">{post.locationName || 'भारत'}</span>
                            <span aria-hidden="true">·</span>
                            <span>{post.createdAt}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions: 3-dot options menu for own posts, report for others */}
                      <div className="relative flex items-center gap-1.5">
                        {isMyPost && (
                          <span className="hidden sm:inline px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30 text-[10px] font-bold">
                            आपकी पोस्ट
                          </span>
                        )}

                        <button
                          onClick={() => setOpenMenuPostId((prev) => (prev === post.id ? null : post.id))}
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
                          title="विकल्प (Options)"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {/* Options Dropdown Menu */}
                        {openMenuPostId === post.id && (
                          <div className="absolute right-0 top-8 z-30 w-48 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl py-1.5 text-xs text-slate-200 animate-fade-in backdrop-blur-md">
                            {isMyPost ? (
                              <>
                                <button
                                  onClick={() => handleStartEdit(post)}
                                  className="w-full px-3.5 py-2 text-left hover:bg-slate-800/80 flex items-center gap-2.5 text-slate-200 transition"
                                >
                                  <Edit3 className="w-3.5 h-3.5 text-orange-400" />
                                  <span>कैप्शन बदलें (Edit Caption)</span>
                                </button>
                                <button
                                  onClick={() => {
                                    toggleSavePost(post.id);
                                    setOpenMenuPostId(null);
                                  }}
                                  className="w-full px-3.5 py-2 text-left hover:bg-slate-800/80 flex items-center gap-2.5 text-slate-200 transition"
                                >
                                  <Bookmark className={`w-3.5 h-3.5 ${post.isSaved ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
                                  <span>{post.isSaved ? 'सेव से हटाएं (Unsave)' : 'पोस्ट सेव करें (Save Post)'}</span>
                                </button>
                                <button
                                  onClick={() => {
                                    handleShare(post);
                                    setOpenMenuPostId(null);
                                  }}
                                  className="w-full px-3.5 py-2 text-left hover:bg-slate-800/80 flex items-center gap-2.5 text-slate-200 transition"
                                >
                                  <Share2 className="w-3.5 h-3.5 text-blue-400" />
                                  <span>लिंक कॉपी करें (Share)</span>
                                </button>
                                <div className="my-1 border-t border-slate-800" />
                                <button
                                  onClick={() => {
                                    setOpenMenuPostId(null);
                                    if (confirm('क्या आप वाकई अपनी यह पोस्ट हटाना चाहते हैं?')) {
                                      deletePost(post.id);
                                    }
                                  }}
                                  className="w-full px-3.5 py-2 text-left hover:bg-rose-500/10 text-rose-400 flex items-center gap-2.5 transition"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>पोस्ट हटाएं (Delete)</span>
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    toggleSavePost(post.id);
                                    setOpenMenuPostId(null);
                                  }}
                                  className="w-full px-3.5 py-2 text-left hover:bg-slate-800/80 flex items-center gap-2.5 text-slate-200 transition"
                                >
                                  <Bookmark className={`w-3.5 h-3.5 ${post.isSaved ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
                                  <span>{post.isSaved ? 'सेव से हटाएं (Unsave)' : 'पोस्ट सेव करें (Save Post)'}</span>
                                </button>
                                <button
                                  onClick={() => {
                                    handleShare(post);
                                    setOpenMenuPostId(null);
                                  }}
                                  className="w-full px-3.5 py-2 text-left hover:bg-slate-800/80 flex items-center gap-2.5 text-slate-200 transition"
                                >
                                  <Share2 className="w-3.5 h-3.5 text-blue-400" />
                                  <span>लिंक कॉपी करें</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setReportingPost(post);
                                    setOpenMenuPostId(null);
                                  }}
                                  className="w-full px-3.5 py-2 text-left hover:bg-rose-500/10 text-rose-400 flex items-center gap-2.5 transition"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>रिपोर्ट करें</span>
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Post Content: Audio Player OR Image with Double-Tap Gesture OR Stylized Text Card */}
                    {post.mediaType === 'audio' || Boolean(post.audioURL) ? (
                      <AwaazAudioCard post={post} />
                    ) : postImg ? (
                      <div
                        onDoubleClick={() => handleDoubleTapLike(post)}
                        className="relative aspect-square sm:aspect-[4/3] bg-slate-950 overflow-hidden cursor-pointer select-none group"
                      >
                        <ProgressiveImage
                          src={postImg}
                          alt={postText || 'Post image'}
                          aspectRatioClass="aspect-square sm:aspect-[4/3]"
                          onDoubleClick={() => handleDoubleTapLike(post)}
                        />

                        {/* Instagram Double-Tap Heart Explosion */}
                        {likedAnimPostId === post.id && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                            <div className="relative flex items-center justify-center">
                              <Heart className="w-28 h-28 fill-rose-500 text-rose-500 drop-shadow-[0_10px_25px_rgba(244,63,94,0.6)] animate-ping" />
                              <Heart className="absolute w-24 h-24 fill-rose-500 text-rose-500 drop-shadow-2xl" />
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        onDoubleClick={() => handleDoubleTapLike(post)}
                        className="relative min-h-[140px] p-6 bg-gradient-to-br from-orange-950/30 via-slate-950 to-emerald-950/30 border-y border-slate-800/80 flex flex-col items-center justify-center text-center cursor-pointer select-none"
                      >
                        <p className="text-sm sm:text-base font-semibold text-white leading-relaxed max-w-lg">
                          "{postText}"
                        </p>
                        <span className="text-[10px] text-orange-400 mt-2 font-mono">🇮🇳 BharatConnect Post</span>
                        {likedAnimPostId === post.id && (
                          <div className="absolute inset-0 flex items-center justify-center animate-ping">
                            <Heart className="w-20 h-20 fill-rose-500 text-rose-500 drop-shadow-xl" />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons Bar */}
                    <div className="p-3.5 pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* Like button with haptic feedback */}
                          <button
                            onClick={() => handleLikeClick(post.id)}
                            className={`min-h-[44px] min-w-[44px] flex items-center justify-center transition-transform active:scale-125 cursor-pointer ${
                              post.isLiked ? 'text-rose-500' : 'text-slate-200 hover:text-rose-400'
                            }`}
                          >
                            <Heart className={`w-6 h-6 ${post.isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                          </button>

                          {/* Comment button */}
                          <button
                            onClick={() => setCommentingPost(post)}
                            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-200 hover:text-blue-400 transition-colors cursor-pointer"
                          >
                            <MessageCircle className="w-6 h-6" />
                          </button>

                          {/* Share button */}
                          <button
                            onClick={() => handleShare(post)}
                            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-200 hover:text-emerald-400 transition-colors cursor-pointer"
                          >
                            <Send className="w-5 h-5 -rotate-12" />
                          </button>
                        </div>

                        {/* Bookmark Save button with haptic feedback */}
                        <button
                          onClick={() => handleSaveClick(post.id)}
                          className={`min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors cursor-pointer ${
                            post.isSaved ? 'text-amber-400' : 'text-slate-200 hover:text-amber-300'
                          }`}
                        >
                          <Bookmark className={`w-6 h-6 ${post.isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
                        </button>
                      </div>

                      {/* Likes Count */}
                      <p className="text-xs font-bold text-white mt-1 font-mono tabular-nums">
                        {currentLikes.toLocaleString()} {t.likes}
                      </p>

                      {/* Caption (only if image was present, or to show author attribution) */}
                      {postImg && postText && (
                        <div className="text-xs text-slate-200 mt-1.5 leading-relaxed">
                          <span className="font-bold mr-1 text-white">{authorName}</span>
                          <span className="whitespace-pre-line">{postText}</span>
                        </div>
                      )}

                      {/* Hashtags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2 text-xs font-medium text-orange-400">
                          {post.tags.map((tg) => (
                            <span key={tg} className="hover:underline cursor-pointer">
                              #{tg}
                            </span>
                          ))}
                        </div>
                      )}

                  {/* Comments Preview */}
                  {post.comments.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80">
                      <button
                        onClick={() => setCommentingPost(post)}
                        className="text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer block mb-1 font-medium"
                      >
                        सभी {post.comments.length} टिप्पणियां देखें...
                      </button>
                      <div className="text-xs text-slate-300 truncate">
                        <span className="font-semibold text-slate-200 mr-1.5">
                          {post.comments[0].author.fullName}:
                        </span>
                        <span>{post.comments[0].text}</span>
                      </div>
                    </div>
                  )}

                  {/* Inline comment form */}
                  <form
                    onSubmit={(e) => handleInlineCommentSubmit(post.id, e)}
                    className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-800/60"
                  >
                    <input
                      type="text"
                      value={inlineComments[post.id] || ''}
                      onChange={(e) =>
                        setInlineComments({ ...inlineComments, [post.id]: e.target.value })
                      }
                      placeholder={t.writeComment}
                      className="flex-1 bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!inlineComments[post.id]?.trim()}
                      className="text-xs font-bold text-orange-400 disabled:text-slate-600 cursor-pointer"
                    >
                      {t.postComment}
                    </button>
                  </form>
                </div>
              </article>
                    );
                  })}

                  {/* Shimmer Skeleton Loader when loading more */}
                  {isLoadingMore && (
                    <div className="space-y-4 pt-1">
                      <SkeletonFeedCard />
                    </div>
                  )}

                  {/* Pagination: Load More Posts Button */}
                  {hasMorePosts && !isLoadingMore && (
                    <div className="pt-2 text-center">
                      <button
                        onClick={handleLoadMore}
                        className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold transition flex items-center justify-center gap-2 active:scale-98 shadow-sm cursor-pointer"
                      >
                        <span>और पोस्ट देखें (Load More Posts)</span>
                        <span className="text-[11px] text-orange-400 font-mono">
                          · {paginatedPosts.length} / {displayedPosts.length}
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Instagram-style All Caught Up Banner */}
                  {!hasMorePosts && displayedPosts.length > 5 && (
                    <div className="py-6 px-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-center space-y-1.5 backdrop-blur-sm">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                      <p className="text-xs font-bold text-slate-200">आप सभी पोस्ट्स देख चुके हैं (You're All Caught Up)</p>
                      <p className="text-[11px] text-slate-500">आपने पिछले कुछ घंटों की सभी ताज़ा पोस्ट्स पढ़ ली हैं।</p>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>

        {/* Right Sidebar Column (5 cols on lg, hidden on mobile) */}
        <div className="hidden lg:block lg:col-span-5 space-y-4">
          {/* User Account Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.fullName}
                className="w-11 h-11 rounded-full object-cover border-2 border-orange-500/40"
              />
              <div>
                <span className="font-bold text-sm text-white block">{currentUser.fullName}</span>
                <span className="text-xs text-slate-400 font-mono">{currentUser.handle}</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('profile')}
              className="text-xs font-semibold text-orange-400 hover:text-orange-300 cursor-pointer"
            >
              {t.profile}
            </button>
          </div>

          {/* ₹0 Budget Beginner Guide Card (Hindi) */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/30 rounded-2xl p-4.5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>₹0 शुरुआती गाइड (Android Mobile)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              नमस्ते राहुल जी! यह ऐप पूरी तरह से मुफ़्त (Zero Budget) पर काम करता है:
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li>होम फ़ीड, रील्स, नई पोस्ट और प्रोफ़ाइल लाइव हैं।</li>
              <li>पोस्ट पर डबल-टैप करके लाइक करें।</li>
              <li>नीचे के मेनू से रील्स और नई पोस्ट बनाकर देखें।</li>
            </ul>
          </div>

          {/* Suggested Indian Creators */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">{t.suggestedCreators}</span>
              <button 
                onClick={() => setActiveTab('search')}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                सभी देखें
              </button>
            </div>

            <div className="space-y-3">
              {suggestedUsers.slice(0, 4).map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div 
                    onClick={() => openUserProfile(user)}
                    className="flex items-center gap-2.5 cursor-pointer group"
                    title="प्रोफ़ाइल देखें (View Profile)"
                  >
                    <img
                      src={user.photoURL || user.avatar}
                      alt={user.fullName || user.name}
                      className="w-9 h-9 rounded-full object-cover group-hover:ring-2 ring-orange-500/50 transition"
                    />
                    <div>
                      <span className="text-xs font-semibold text-white block truncate max-w-[120px] group-hover:text-orange-400 transition">
                        {user.fullName || user.name}
                      </span>
                      <span className="text-[11px] text-slate-400 truncate max-w-[120px] block">
                        {user.followersCount} फ़ॉलोअर्स
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFollowUser(user)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      user.isFollowing
                        ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                        : 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm'
                    }`}
                  >
                    {user.isFollowing ? 'फ़ॉलो किया' : t.follow}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Trending in Bharat */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <TrendingUp className="w-4 h-4 text-orange-400" />
              <span>{t.trendingTopics}</span>
            </div>

            <div className="space-y-2 pt-1 font-medium">
              <div className="flex justify-between items-center text-slate-300 hover:text-orange-400 cursor-pointer">
                <span>#DigitalIndia</span>
                <span className="text-[11px] text-slate-500 font-mono">84.2K</span>
              </div>
              <div className="flex justify-between items-center text-slate-300 hover:text-orange-400 cursor-pointer">
                <span>#VocalForLocal</span>
                <span className="text-[11px] text-slate-500 font-mono">51.9K</span>
              </div>
              <div className="flex justify-between items-center text-slate-300 hover:text-orange-400 cursor-pointer">
                <span>#BengaluruTech</span>
                <span className="text-[11px] text-slate-500 font-mono">38.4K</span>
              </div>
              <div className="flex justify-between items-center text-slate-300 hover:text-orange-400 cursor-pointer">
                <span>#IncredibleIndia</span>
                <span className="text-[11px] text-slate-500 font-mono">92.1K</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <StoryModal
        story={activeStory}
        onClose={() => setActiveStory(null)}
      />

      <CommentDrawer
        post={commentingPost}
        onClose={() => setCommentingPost(null)}
      />

      <ReportModal
        targetPost={reportingPost}
        onClose={() => setReportingPost(null)}
      />

      {/* Edit Post Caption Modal */}
      {editingPost && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-orange-400" />
                <h3 className="font-bold text-sm text-white">
                  पोस्ट का कैप्शन बदलें (Edit Caption)
                </h3>
              </div>
              <button
                onClick={() => setEditingPost(null)}
                className="text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Post Thumbnail Preview if image exists */}
            {(editingPost.imageUrl || editingPost.imageURL) && (
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                <img
                  src={editingPost.imageUrl || editingPost.imageURL}
                  alt="Post preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Edit Caption Form */}
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="text-slate-300 font-medium">नया कैप्शन लिखें:</label>
                  <span className="text-[11px] text-slate-500">{editCaptionText.length} / 500</span>
                </div>
                <textarea
                  value={editCaptionText}
                  onChange={(e) => setEditCaptionText(e.target.value)}
                  maxLength={500}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500 transition resize-none leading-relaxed"
                  placeholder="नया कैप्शन दर्ज करें..."
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  disabled={isSavingEdit}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  रद्द करें (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={!editCaptionText.trim() || isSavingEdit}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 active:scale-95"
                >
                  {isSavingEdit ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                      <span>सेव हो रहा है...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>बदलाव सेव करें</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Awaaz Live Audio Recorder / Shayari Modal */}
      <AwaazRecordModal 
        isOpen={isAwaazRecordOpen} 
        onClose={() => setIsAwaazRecordOpen(false)} 
      />

      {/* Mobile-first Floating Action Button (FAB) with Image, Reel, and Mic quick actions */}
      <FloatingActionButton />
    </div>
  );
};
