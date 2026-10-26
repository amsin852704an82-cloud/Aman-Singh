import React from 'react';

export const SkeletonFeedCard: React.FC = () => {
  return (
    <article className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm animate-pulse select-none">
      {/* Header Shimmer */}
      <div className="p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-slate-800/80" />
          <div className="space-y-1.5">
            {/* Author Name */}
            <div className="w-28 h-3.5 bg-slate-800 rounded-md" />
            {/* Handle / Location */}
            <div className="w-20 h-2.5 bg-slate-800/60 rounded-md" />
          </div>
        </div>
        {/* 3-dot options */}
        <div className="w-6 h-6 rounded-lg bg-slate-800/50" />
      </div>

      {/* Media Image Shimmer */}
      <div className="w-full aspect-square sm:aspect-[4/3] bg-gradient-to-b from-slate-850 via-slate-800/60 to-slate-850 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>

      {/* Action Icons Shimmer */}
      <div className="p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-slate-800" />
            <div className="w-6 h-6 rounded-full bg-slate-800" />
            <div className="w-6 h-6 rounded-full bg-slate-800" />
          </div>
          <div className="w-6 h-6 rounded-full bg-slate-800" />
        </div>

        {/* Likes Count Shimmer */}
        <div className="w-24 h-3 bg-slate-800 rounded-md" />

        {/* Caption lines */}
        <div className="space-y-1.5 pt-1">
          <div className="w-3/4 h-3 bg-slate-800 rounded-md" />
          <div className="w-1/2 h-3 bg-slate-800/60 rounded-md" />
        </div>

        {/* Comment input placeholder */}
        <div className="w-full h-8 bg-slate-800/40 rounded-xl mt-2" />
      </div>
    </article>
  );
};
