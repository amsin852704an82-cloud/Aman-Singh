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
  Trash2
} from 'lucide-react';

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
    setActiveTab,
    setToastMessage,
    deletePost
  } = useBharatConnect();

  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [commentingPost, setCommentingPost] = useState<Post | null>(null);
  const [reportingPost, setReportingPost] = useState<Post | null>(null);
  const [likedAnimPostId, setLikedAnimPostId] = useState<string | null>(null);
  const [inlineComments, setInlineComments] = useState<{ [postId: string]: string }>({});

  const handleDoubleTapLike = (post: Post) => {
    if (!post.isLiked) {
      toggleLikePost(post.id);
    }
    setLikedAnimPostId(post.id);
    setTimeout(() => setLikedAnimPostId(null), 800);
  };

  const handleShare = (post: Post) => {
    navigator.clipboard.writeText(`https://bharatconnect.app/p/${post.id}`);
    setToastMessage('पोस्ट लिंक कॉपी हो गया! (Post Link Copied)');
  };

  const handleInlineCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const txt = inlineComments[postId]?.trim();
    if (!txt) return;
    const post = posts.find((p) => p.id === postId);
    if (post) {
      post.comments.push({
        id: `c_${Date.now()}`,
        author: currentUser,
        text: txt,
        createdAt: 'Just now',
        likesCount: 0
      });
      post.commentsCount += 1;
      setInlineComments((prev) => ({ ...prev, [postId]: '' }));
      setToastMessage('टिप्पणी पोस्ट की गई (Comment Added)');
    }
  };

  const suggestedUsers = users.filter((u) => u.id !== currentUser.id && !u.isFollowing);

  return (
    <div className="max-w-4xl mx-auto pb-24 pt-2">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Column (8 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
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
                    src={currentUser.avatar}
                    alt={currentUser.fullName}
                    className="w-full h-full rounded-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 w-4.5 h-4.5 bg-orange-500 text-white rounded-full flex items-center justify-center border-2 border-slate-900">
                    <Plus className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-300 truncate max-w-[64px]">
                  आपकी स्टोरी
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

          {/* Posts Stream */}
          <div className="space-y-4">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm"
              >
                {/* Post Header */}
                <div className="p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={post.author.avatar}
                      alt={post.author.fullName}
                      className="w-9 h-9 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-xs text-white hover:text-orange-400 cursor-pointer">
                          {post.author.fullName}
                        </span>
                        {post.author.verified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 fill-orange-400/20" />
                        )}
                        <span className="text-[11px] text-slate-400 font-normal">
                          {post.author.handle}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span className="truncate max-w-[180px]">{post.locationName}</span>
                        <span aria-hidden="true">·</span>
                        <span>{post.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: delete if own post, report if others */}
                  <div className="flex items-center gap-1.5">
                    {post.author.id === currentUser.id ? (
                      <>
                        <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30 text-[10px] font-bold">
                          आपकी पोस्ट
                        </span>
                        <button
                          onClick={() => {
                            if (confirm('क्या आप वाकई अपनी यह पोस्ट हटाना चाहते हैं?')) {
                              deletePost(post.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg transition"
                          title="पोस्ट हटाएं (Delete Post)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setReportingPost(post)}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                        title="रिपोर्ट या विकल्प"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Post Image with Double-Tap Gesture */}
                <div
                  onDoubleClick={() => handleDoubleTapLike(post)}
                  className="relative aspect-square sm:aspect-[4/3] bg-slate-950 overflow-hidden cursor-pointer select-none group"
                >
                  <img
                    src={post.imageUrl}
                    alt={post.caption}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* Double tap heart explosion animation */}
                  {likedAnimPostId === post.id && (
                    <div className="absolute inset-0 flex items-center justify-center animate-ping">
                      <Heart className="w-24 h-24 fill-rose-500 text-rose-500 drop-shadow-xl" />
                    </div>
                  )}
                </div>

                {/* Action Buttons Bar */}
                <div className="p-3.5 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Like button */}
                      <button
                        onClick={() => toggleLikePost(post.id)}
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

                    {/* Bookmark Save button */}
                    <button
                      onClick={() => toggleSavePost(post.id)}
                      className={`min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors cursor-pointer ${
                        post.isSaved ? 'text-amber-400' : 'text-slate-200 hover:text-amber-300'
                      }`}
                    >
                      <Bookmark className={`w-6 h-6 ${post.isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>

                  {/* Likes Count */}
                  <p className="text-xs font-bold text-white mt-1 font-mono tabular-nums">
                    {post.likesCount.toLocaleString()} {t.likes}
                  </p>

                  {/* Caption */}
                  <div className="text-xs text-slate-200 mt-1.5 leading-relaxed">
                    <span className="font-bold mr-1 text-white">{post.author.fullName}</span>
                    <span className="whitespace-pre-line">{post.caption}</span>
                  </div>

                  {/* Hashtags */}
                  <div className="flex flex-wrap gap-1.5 mt-2 text-xs font-medium text-orange-400">
                    {post.tags.map((t) => (
                      <span key={t} className="hover:underline cursor-pointer">
                        #{t}
                      </span>
                    ))}
                  </div>

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
            ))}
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
              {suggestedUsers.slice(0, 3).map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={user.avatar}
                      alt={user.fullName}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <span className="text-xs font-semibold text-white block truncate max-w-[120px]">
                        {user.fullName}
                      </span>
                      <span className="text-[11px] text-slate-400 truncate max-w-[120px] block">
                        {user.location.split(',')[0]}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFollowUser(user.id)}
                    className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    {t.follow}
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
    </div>
  );
};
