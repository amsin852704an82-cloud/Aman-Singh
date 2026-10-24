import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  MapPin,
} from 'lucide-react';

export const PostCard = ({
  user = {
    name: 'aarav_sharma',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
    location: 'Varanasi, Uttar Pradesh',
  },
  image = 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
  caption = 'Ganga Aarti at Dashashwamedh Ghat. The spiritual energy of Bharat is truly unmatched! ✨🇮🇳 #Varanasi #IncredibleIndia',
  likesCount = 1240,
  timeAgo = '2 hours ago',
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(likesCount);
  const [isSaved, setIsSaved] = useState(false);
  const [showHeartPop, setShowHeartPop] = useState(false);

  const handleLikeToggle = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikes((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikes((prev) => prev + 1);
    }
  };

  const handleDoubleTap = () => {
    if (!isLiked) {
      setIsLiked(true);
      setLikes((prev) => prev + 1);
    }
    setShowHeartPop(true);
    setTimeout(() => setShowHeartPop(false), 800);
  };

  return (
    <article className="w-full bg-slate-950 border-b border-slate-900 pb-3">
      {/* 1. Post Header: Avatar, Username, Location & Three Dots */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-9 h-9 rounded-full p-[1.5px] bg-gradient-to-tr from-amber-500 to-orange-500">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full rounded-full object-cover border border-slate-950"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white tracking-tight leading-none hover:underline">
              {user.name}
            </span>
            {user.location && (
              <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 leading-none">
                <MapPin className="w-2.5 h-2.5 text-orange-400 shrink-0" />
                {user.location}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          aria-label="Post Options"
          className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/60 transition active:scale-90"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Post Image (Aspect Square) with Double-Tap Like animation */}
      <div
        className="relative w-full aspect-square bg-slate-900 overflow-hidden cursor-pointer select-none"
        onDoubleClick={handleDoubleTap}
      >
        <img
          src={image}
          alt={caption}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.01]"
          loading="lazy"
        />

        {/* Floating Heart Popup on Double Tap */}
        {showHeartPop && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-in fade-in zoom-in-50 duration-200">
            <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-2xl animate-pulse" />
          </div>
        )}
      </div>

      {/* 3. Action Buttons Row: Like, Comment, Share, Bookmark */}
      <div className="px-4 pt-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Like Button */}
          <button
            type="button"
            onClick={handleLikeToggle}
            aria-label={isLiked ? 'Unlike post' : 'Like post'}
            className="transition-transform active:scale-75 focus:outline-none"
          >
            <Heart
              className={`w-6 h-6 transition-colors duration-200 ${
                isLiked
                  ? 'fill-rose-500 text-rose-500 scale-110 animate-in zoom-in-75'
                  : 'text-slate-200 hover:text-white'
              }`}
            />
          </button>

          {/* Comment Button */}
          <button
            type="button"
            aria-label="Comment on post"
            className="text-slate-200 hover:text-white transition active:scale-90 focus:outline-none"
          >
            <MessageCircle className="w-6 h-6 stroke-[1.8]" />
          </button>

          {/* Share Button */}
          <button
            type="button"
            aria-label="Share post"
            className="text-slate-200 hover:text-white transition active:scale-90 focus:outline-none"
          >
            <Send className="w-5 h-5 stroke-[1.8] -rotate-12" />
          </button>
        </div>

        {/* Save/Bookmark Button */}
        <button
          type="button"
          onClick={() => setIsSaved(!isSaved)}
          aria-label={isSaved ? 'Remove from saved' : 'Save post'}
          className="text-slate-200 hover:text-white transition active:scale-90 focus:outline-none"
        >
          <Bookmark
            className={`w-6 h-6 transition-colors duration-200 ${
              isSaved
                ? 'fill-amber-400 text-amber-400 scale-105'
                : 'stroke-[1.8]'
            }`}
          />
        </button>
      </div>

      {/* 4. Likes Count */}
      <div className="px-4 pt-2">
        <span className="text-sm font-semibold text-white tracking-tight">
          {likes.toLocaleString('en-IN')} likes
        </span>
      </div>

      {/* 5. Caption & Timestamp */}
      <div className="px-4 pt-1 space-y-1">
        <p className="text-sm text-slate-200 leading-snug">
          <span className="font-semibold text-white mr-1.5">{user.name}</span>
          {caption}
        </p>

        <div className="flex items-center gap-2 pt-0.5">
          <time className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">
            {timeAgo}
          </time>
          <span className="text-[11px] text-orange-400/90 font-medium">
            • Translate to Hindi
          </span>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
