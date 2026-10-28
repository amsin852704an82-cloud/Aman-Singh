import React from 'react';
import { useBharatConnect } from '../../context/BharatConnectContext';
import { MainTab } from '../../types/bharatConnect';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, unreadNotificationsCount } = useBharatConnect();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 px-4 py-2 flex justify-between items-center z-50 max-w-lg mx-auto sm:max-w-none shadow-2xl select-none">
      {/* 1. होम (Home) */}
      <button
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center text-xs transition cursor-pointer min-w-[48px] ${
          activeTab === 'home' ? 'text-orange-500 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        <i className="fa-solid fa-house text-lg"></i>
        <span className="mt-0.5 text-[11px]">होम</span>
      </button>

      {/* 2. हुनर (Hunar / Skills) */}
      <button
        onClick={() => setActiveTab('hunar')}
        className={`flex flex-col items-center text-xs transition cursor-pointer min-w-[48px] ${
          activeTab === 'hunar' ? 'text-orange-500 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        <i className="fa-solid fa-graduation-cap text-lg"></i>
        <span className="mt-0.5 text-[11px]">हुनर</span>
      </button>

      {/* 3. Central Plus Button (नई पोस्ट) */}
      <button
        onClick={() => setActiveTab('create')}
        className="w-12 h-12 bg-gradient-to-tr from-amber-500 to-orange-600 text-zinc-950 rounded-full flex items-center justify-center text-xl shadow-lg -mt-5 border-4 border-zinc-950 hover:scale-105 active:scale-95 transition cursor-pointer"
        title="नई पोस्ट बनाएं"
      >
        <i className="fa-solid fa-plus font-bold"></i>
      </button>

      {/* 4. रील्स (Reels) */}
      <button
        onClick={() => setActiveTab('reels')}
        className={`flex flex-col items-center text-xs transition cursor-pointer min-w-[48px] ${
          activeTab === 'reels' ? 'text-orange-500 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        <i className="fa-solid fa-video text-lg"></i>
        <span className="mt-0.5 text-[11px]">रील्स</span>
      </button>

      {/* 5. अलर्ट (Alerts / Notifications) */}
      <button
        onClick={() => setActiveTab('notifications')}
        className={`flex flex-col items-center text-xs transition cursor-pointer relative min-w-[48px] ${
          activeTab === 'notifications' ? 'text-orange-500 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        <div className="relative">
          <i className="fa-solid fa-bell text-lg"></i>
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-orange-500 text-zinc-950 rounded-full text-[9px] w-4 h-4 flex items-center justify-center font-bold">
              {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
            </span>
          )}
        </div>
        <span className="mt-0.5 text-[11px]">अलर्ट</span>
      </button>

      {/* 6. प्रोफ़ाइल (Profile) */}
      <button
        onClick={() => setActiveTab('profile')}
        className={`flex flex-col items-center text-xs transition cursor-pointer min-w-[48px] ${
          activeTab === 'profile' ? 'text-orange-500 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        <img
          src={currentUser.photoURL || currentUser.avatar}
          className={`w-5 h-5 rounded-full object-cover mt-0.5 border ${
            activeTab === 'profile' ? 'border-orange-500 scale-105' : 'border-zinc-700'
          }`}
          alt="Profile"
        />
        <span className="mt-0.5 text-[11px]">प्रोफ़ाइल</span>
      </button>
    </nav>
  );
};
