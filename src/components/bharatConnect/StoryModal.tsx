import React, { useEffect, useState } from 'react';
import { Story } from '../../types/bharatConnect';
import { X, Eye } from 'lucide-react';

interface StoryModalProps {
  story: Story | null;
  onClose: () => void;
}

export const StoryModal: React.FC<StoryModalProps> = ({ story, onClose }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!story) return;
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          onClose();
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [story, onClose]);

  if (!story) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="relative w-full max-w-sm h-[82vh] max-h-[720px] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border border-slate-800">
        {/* Progress Bar */}
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-1">
          <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-100 ease-linear rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Top Header */}
        <div className="relative z-30 pt-6 px-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <img
              src={story.author.avatar}
              alt={story.author.fullName}
              className="w-9 h-9 rounded-full object-cover border-2 border-orange-500"
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-xs">{story.author.fullName}</span>
                <span className="text-[10px] text-slate-300 font-mono">{story.createdAt}</span>
              </div>
              <span className="text-[11px] text-slate-300 font-normal">{story.author.handle}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Story Image */}
        <div className="absolute inset-0 z-10">
          <img
            src={story.imageUrl}
            alt="Story"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />
        </div>

        {/* Bottom Story Caption */}
        <div className="relative z-30 p-5 space-y-2">
          {story.title && (
            <p className="text-sm font-semibold text-white drop-shadow-md leading-relaxed">
              {story.title}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-white/20">
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              {story.viewCount.toLocaleString()} दृश्य (views)
            </span>
            <span className="text-[10px] text-slate-400 font-mono">24h Ephemeral Story</span>
          </div>
        </div>
      </div>
    </div>
  );
};
