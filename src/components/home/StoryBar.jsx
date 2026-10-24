import React from 'react';
import { Plus } from 'lucide-react';

const mockStories = [
  {
    id: 'user-story',
    username: 'Your Story',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    isUser: true,
    hasUnseen: false,
  },
  {
    id: 'story-1',
    username: 'aarav_sharma',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
    hasUnseen: true,
  },
  {
    id: 'story-2',
    username: 'priya.patel',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    hasUnseen: true,
  },
  {
    id: 'story-3',
    username: 'rohan_tech',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    hasUnseen: true,
  },
  {
    id: 'story-4',
    username: 'ananya_dance',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    hasUnseen: false,
  },
  {
    id: 'story-5',
    username: 'vikram.clicks',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    hasUnseen: true,
  },
  {
    id: 'story-6',
    username: 'diya_arts',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80',
    hasUnseen: false,
  },
];

export const StoryBar = () => {
  return (
    <div className="w-full bg-slate-950 border-b border-slate-900 py-3">
      <div className="flex items-center gap-3.5 overflow-x-auto px-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {mockStories.map((story) => (
          <button
            key={story.id}
            type="button"
            className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
          >
            {/* Story Ring Container */}
            <div className="relative">
              <div
                className={`w-[66px] h-[66px] rounded-full p-[2.5px] transition-transform duration-200 group-hover:scale-105 group-active:scale-95 ${
                  story.isUser
                    ? 'border-2 border-dashed border-slate-700'
                    : story.hasUnseen
                    ? 'bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600'
                    : 'bg-slate-800'
                }`}
              >
                <div className="w-full h-full rounded-full bg-slate-950 p-[2px]">
                  <img
                    src={story.avatar}
                    alt={story.username}
                    className="w-full h-full rounded-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Add Story (+) Badge for Current User */}
              {story.isUser && (
                <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-orange-500 border-2 border-slate-950 flex items-center justify-center text-white shadow-md">
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </div>

            {/* Username Label */}
            <span
              className={`text-[11px] max-w-[68px] truncate tracking-tight text-center ${
                story.isUser
                  ? 'text-slate-300 font-medium'
                  : story.hasUnseen
                  ? 'text-slate-200 font-medium'
                  : 'text-slate-500'
              }`}
            >
              {story.username}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StoryBar;
