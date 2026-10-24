import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Home as HomeIcon,
  Search,
  PlusSquare,
  Film,
  User,
  MoreHorizontal,
  Bell,
  MapPin,
  Sparkles,
} from 'lucide-react';

// ==========================================
// 1. MOCK DATA (No Backend Needed)
// ==========================================

const MOCK_STORIES = [
  {
    id: 'user-0',
    username: 'Your Story',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    isUser: true,
    hasUnseen: false,
  },
  {
    id: 'story-1',
    username: 'aarav_sharma',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    hasUnseen: true,
  },
  {
    id: 'story-2',
    username: 'priya.patel',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    hasUnseen: true,
  },
  {
    id: 'story-3',
    username: 'rohan_tech',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    hasUnseen: true,
  },
  {
    id: 'story-4',
    username: 'ananya_dance',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    hasUnseen: false,
  },
  {
    id: 'story-5',
    username: 'vikram.clicks',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    hasUnseen: true,
  },
  {
    id: 'story-6',
    username: 'diya_arts',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80',
    hasUnseen: false,
  },
];

const MOCK_POSTS = [
  {
    id: 'post-1',
    user: {
      name: 'aarav_sharma',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
      location: 'Varanasi, Uttar Pradesh',
    },
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1000&q=80',
    caption: 'Ganga Aarti at Dashashwamedh Ghat. The spiritual energy of Bharat is truly unmatched! ✨🪔 #Varanasi #IncredibleIndia',
    likesCount: 1420,
    timeAgo: '2 hours ago',
  },
  {
    id: 'post-2',
    user: {
      name: 'priya.patel',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      location: 'Lake Pichola, Udaipur',
    },
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80',
    caption: 'Golden hour in the City of Lakes. Cherishing every reflection on the water. 🏰🌅 #RajasthanDiaries #BharatTravel',
    likesCount: 2890,
    timeAgo: '4 hours ago',
  },
  {
    id: 'post-3',
    user: {
      name: 'rohan_tech',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      location: 'Bengaluru, Karnataka',
    },
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80',
    caption: 'Building BharatConnect for 1.4 Billion citizens! Late night chai & code with the dream team. 💻☕🇮🇳 #StartupIndia #MakeInIndia',
    likesCount: 954,
    timeAgo: '6 hours ago',
  },
  {
    id: 'post-4',
    user: {
      name: 'ananya_dance',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      location: 'Chennai, Tamil Nadu',
    },
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1000&q=80',
    caption: 'Margazhi season classical rehearsals in full swing! Connecting traditional roots with modern Bharat. 💃✨ #Bharatanatyam #IndianClassical',
    likesCount: 3120,
    timeAgo: '8 hours ago',
  },
];

// ==========================================
// 2. SUB-COMPONENTS
// ==========================================

// Top Header Component
function TopHeader() {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-2.5 cursor-pointer select-none">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-400 to-emerald-500 p-[1.5px] shadow-sm shadow-orange-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <span className="text-xs font-black bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">
              भा
            </span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-black tracking-tight text-white flex items-center">
            Bharat<span className="text-orange-500">Connect</span>
          </span>
          <span className="text-[9px] -mt-1 font-medium tracking-wider text-slate-400 uppercase">
            Apna Desh, Apna Network
          </span>
        </div>
      </div>

      {/* Right Action Icons: Notification Bell & User Avatar */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="relative p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition active:scale-90"
        >
          <Bell className="w-5 h-5 stroke-[2]" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-orange-500 rounded-full ring-2 ring-slate-950 animate-pulse" />
        </button>

        <div className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-orange-500 to-amber-400 cursor-pointer hover:scale-105 transition-transform">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
            alt="My Profile"
            className="w-full h-full rounded-full object-cover border border-slate-950"
          />
        </div>
      </div>
    </header>
  );
}

// Story Bar Component (Horizontal Scrolling with Gradient Rings)
function StoryBar() {
  return (
    <section className="w-full bg-slate-950 border-b border-slate-900 py-3">
      <div className="flex items-center gap-3.5 overflow-x-auto px-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {MOCK_STORIES.map((story) => (
          <button
            key={story.id}
            type="button"
            className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
          >
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

              {story.isUser && (
                <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-orange-500 border-2 border-slate-950 flex items-center justify-center text-white shadow-md text-xs font-bold leading-none">
                  +
                </div>
              )}
            </div>

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
    </section>
  );
}

// Post Card Component (Full Instagram Interaction)
function PostCard({ user, image, caption, likesCount, timeAgo }) {
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
      {/* 1. Header: Avatar, Name, Location & Menu */}
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
              <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-1 leading-none">
                <MapPin className="w-2.5 h-2.5 text-orange-400 shrink-0" />
                {user.location}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          aria-label="Options"
          className="p-1.5 rounded-full text-slate-400 hover:text-white transition active:scale-90"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Large Aspect-Square Image with Double Tap Heart */}
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

        {showHeartPop && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-in fade-in zoom-in-50 duration-200">
            <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-2xl animate-pulse" />
          </div>
        )}
      </div>

      {/* 3. Action Buttons Row */}
      <div className="px-4 pt-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleLikeToggle}
            aria-label={isLiked ? 'Unlike' : 'Like'}
            className="transition-transform active:scale-75 focus:outline-none"
          >
            <Heart
              className={`w-6 h-6 transition-colors duration-200 ${
                isLiked
                  ? 'fill-rose-500 text-rose-500 scale-110'
                  : 'text-slate-200 hover:text-white'
              }`}
            />
          </button>

          <button
            type="button"
            aria-label="Comment"
            className="text-slate-200 hover:text-white transition active:scale-90 focus:outline-none"
          >
            <MessageCircle className="w-6 h-6 stroke-[1.8]" />
          </button>

          <button
            type="button"
            aria-label="Share"
            className="text-slate-200 hover:text-white transition active:scale-90 focus:outline-none"
          >
            <Send className="w-5 h-5 stroke-[1.8] -rotate-12" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsSaved(!isSaved)}
          aria-label={isSaved ? 'Unsave' : 'Save'}
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

      {/* 4. Likes Counter */}
      <div className="px-4 pt-2">
        <span className="text-sm font-semibold text-white tracking-tight">
          {likes.toLocaleString('en-IN')} likes
        </span>
      </div>

      {/* 5. Caption & Metadata */}
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
}

// Fixed Bottom Navigation Component
function BottomNav({ activeTab = 'home', onTabChange }) {
  const [currentTab, setCurrentTab] = useState(activeTab);

  const handleTabClick = (tabId) => {
    setCurrentTab(tabId);
    if (onTabChange) onTabChange(tabId);
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'create', label: 'Create', icon: PlusSquare },
    { id: 'reels', label: 'Reels', icon: Film },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 w-full bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-2">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleTabClick(item.id)}
              aria-label={item.label}
              className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 active:scale-90 ${
                isActive ? 'text-orange-500' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.id === 'create' ? (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 active:scale-95">
                  <PlusSquare className="w-5 h-5 stroke-[2.2]" />
                </div>
              ) : item.id === 'profile' ? (
                <div
                  className={`w-7 h-7 rounded-full p-[1.5px] transition-transform ${
                    isActive ? 'ring-2 ring-orange-500 scale-105' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              ) : (
                <Icon
                  className={`w-6 h-6 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
              )}

              {isActive && item.id !== 'create' && (
                <span className="w-1 h-1 bg-orange-500 rounded-full mt-1 animate-in fade-in" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ==========================================
// 3. MAIN COMPONENT (Default Export)
// ==========================================

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex justify-center selection:bg-orange-500 selection:text-white">
      {/* Mobile-first centered frame (Like Instagram App) */}
      <div className="w-full max-w-md min-h-screen bg-slate-950 border-x border-slate-900 flex flex-col relative pb-20 shadow-2xl">
        {/* 1. Sticky Top Header */}
        <TopHeader />

        {/* 2. Instagram Story Bar */}
        <StoryBar />

        {/* 3. Main Post Feed */}
        <main className="flex-1 divide-y divide-slate-900">
          {MOCK_POSTS.map((post) => (
            <PostCard
              key={post.id}
              user={post.user}
              image={post.image}
              caption={post.caption}
              likesCount={post.likesCount}
              timeAgo={post.timeAgo}
            />
          ))}
        </main>

        {/* 4. Fixed Bottom Navigation Bar */}
        <BottomNav activeTab="home" />
      </div>
    </div>
  );
}
