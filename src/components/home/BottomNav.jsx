import React, { useState } from 'react';
import { Home, Search, PlusSquare, Clapperboard, User } from 'lucide-react';

export const BottomNav = ({ activeTab = 'home', onTabChange }) => {
  const [currentTab, setCurrentTab] = useState(activeTab);

  const handleTabClick = (tabId) => {
    setCurrentTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'create', label: 'Create', icon: PlusSquare },
    { id: 'reels', label: 'Reels', icon: Clapperboard },
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
                isActive
                  ? 'text-orange-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.id === 'create' ? (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 active:scale-95">
                  <PlusSquare className="w-5 h-5 stroke-[2.2]" />
                </div>
              ) : item.id === 'profile' ? (
                <div
                  className={`w-7 h-7 rounded-full p-[1.5px] transition-transform ${
                    isActive
                      ? 'ring-2 ring-orange-500 scale-105'
                      : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
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

              {/* Active Indicator Dot */}
              {isActive && item.id !== 'create' && (
                <span className="w-1 h-1 bg-orange-500 rounded-full mt-1 animate-in fade-in" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
