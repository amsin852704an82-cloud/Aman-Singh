import React, { useState } from 'react';
import { useBharatConnect } from '../../context/BharatConnectContext';
import { Search, TrendingUp, Users, Tag, CheckCircle2, X, Heart, MessageCircle, Mic } from 'lucide-react';
import { User, Post } from '../../types/bharatConnect';

export const SearchView: React.FC = () => {
  const { 
    users, 
    posts, 
    currentUser, 
    toggleFollowUser, 
    toggleLikePost, 
    t, 
    setToastMessage,
    openUserProfile
  } = useBharatConnect();

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'users' | 'posts' | 'tags'>('all');

  const trendingTopics = [
    { tag: 'VocalForLocal', postsCount: '128K' },
    { tag: 'DigitalIndia', postsCount: '95K' },
    { tag: 'DesiFood', postsCount: '64K' },
    { tag: 'IncredibleIndia', postsCount: '210K' },
    { tag: 'IndianStartups', postsCount: '42K' },
    { tag: 'DiwaliVibes', postsCount: '315K' }
  ];

  const filteredUsers = users.filter((u) => {
    if (u.id === currentUser.id) return false;
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.handle.toLowerCase().includes(q) ||
      u.bio.toLowerCase().includes(q)
    );
  });

  const filteredPosts = posts.filter((p) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      p.caption.toLowerCase().includes(q) ||
      p.locationName.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q.replace('#', '')))
    );
  });

  const handleSelectTag = (tag: string) => {
    setQuery(tag);
    setFilterType('posts');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-24 space-y-6">
      {/* Search Input Box */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition shadow-inner"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        {[
          { key: 'all', label: 'सब कुछ (All)' },
          { key: 'users', label: 'क्रिएटर्स (Users)' },
          { key: 'posts', label: 'पोस्ट्स (Posts)' },
          { key: 'tags', label: 'ट्रेंड्स (Trends)' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterType(tab.key as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              filterType === tab.key
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Trending Section (if no query or 'all'/'tags' filter) */}
      {(filterType === 'all' || filterType === 'tags') && !query && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <TrendingUp className="w-4 h-4 text-orange-500" />
            <span>{t.trendingTopics} (Trending in India)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {trendingTopics.map((item) => (
              <button
                key={item.tag}
                onClick={() => handleSelectTag(item.tag)}
                className="flex flex-col items-start p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-orange-500/40 text-left transition active:scale-95 group"
              >
                <span className="text-xs font-bold text-slate-200 group-hover:text-orange-400 transition">
                  #{item.tag}
                </span>
                <span className="text-[11px] text-slate-500 mt-1">
                  {item.postsCount} पोस्ट्स
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Suggested / Matching Creators */}
      {(filterType === 'all' || filterType === 'users') && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Users className="w-4 h-4 text-orange-500" />
            <span>{t.suggestedCreators}</span>
          </div>

          <div className="divide-y divide-slate-800/60 bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden">
            {filteredUsers.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">कोई क्रिएटर नहीं मिला</div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.id} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-800/30 transition">
                  <div 
                    onClick={() => openUserProfile(user)}
                    className="flex items-center gap-3 cursor-pointer group flex-1 min-w-0"
                    title="प्रोफ़ाइल देखें (View Profile)"
                  >
                    <img
                      src={user.photoURL || user.avatar}
                      alt={user.fullName || user.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-700 group-hover:border-orange-500/60 transition shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-white group-hover:text-orange-400 transition truncate">
                          {user.fullName || user.name}
                        </span>
                        {user.verified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20 shrink-0" />
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 block truncate">
                        {user.handle} · {user.followersCount} फ़ॉलोअर्स
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFollowUser(user)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition active:scale-95 shrink-0 cursor-pointer ${
                      user.isFollowing
                        ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                        : 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm'
                    }`}
                  >
                    {user.isFollowing ? 'फ़ॉलो किया' : t.follow}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Matching Posts Grid */}
      {(filterType === 'all' || filterType === 'posts') && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Tag className="w-4 h-4 text-orange-500" />
            <span>{query ? `खोज परिणाम: "${query}"` : 'लोकप्रिय पोस्ट्स (Explore)'}</span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-2xl">
              <p className="text-xs text-slate-400">कोई पोस्ट नहीं मिली। कोई दूसरा कीवर्ड आज़माएं।</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 cursor-pointer shadow-sm"
                  onClick={() => toggleLikePost(post.id)}
                >
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.caption || 'Post image'}
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : post.mediaType === 'audio' || Boolean(post.audioURL) ? (
                    <div className="w-full h-full p-3 bg-gradient-to-br from-purple-950/70 via-slate-900 to-orange-950/70 flex flex-col justify-between select-none">
                      <span className="text-[10px] text-purple-300 font-bold flex items-center gap-1">
                        <Mic className="w-3 h-3 text-orange-400" /> आवाज़
                      </span>
                      <p className="text-xs text-white line-clamp-2 font-medium">
                        {post.audioTitle || post.caption || 'ऑडियो शायरी'}
                      </p>
                    </div>
                  ) : (
                    <div className="w-full h-full p-2 bg-gradient-to-br from-orange-950/40 to-slate-900 flex items-center justify-center text-center">
                      <p className="text-[10px] text-white line-clamp-3">"{post.text || post.caption}"</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
                    <div className="flex items-center gap-1 text-xs font-bold">
                      <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-rose-500 text-rose-500' : 'fill-white'}`} />
                      <span>{post.likesCount}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold">
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>{post.commentsCount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
