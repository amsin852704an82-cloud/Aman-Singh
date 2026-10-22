import React from 'react';
import { useBharatConnect } from '../../context/BharatConnectContext';
import { MainTab } from '../../types/bharatConnect';
import { Home, Clapperboard, Plus, Bell, GraduationCap } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, t, currentUser, unreadNotificationsCount } = useBharatConnect();

  const navItems: { id: MainTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'home',
      label: t.home,
      icon: <Home className={`w-5 h-5 ${activeTab === 'home' ? 'fill-orange-400 text-orange-400' : 'text-slate-400'}`} />
    },
    {
      id: 'hunar',
      label: 'हुनर',
      icon: <GraduationCap className={`w-5 h-5 ${activeTab === 'hunar' ? 'fill-orange-400 text-orange-400' : 'text-slate-400'}`} />
    },
    {
      id: 'create',
      label: t.create,
      icon: (
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-orange-500/30">
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </div>
      )
    },
    {
      id: 'reels',
      label: t.reels,
      icon: <Clapperboard className={`w-5 h-5 ${activeTab === 'reels' ? 'fill-orange-400 text-orange-400' : 'text-slate-400'}`} />
    },
    {
      id: 'notifications',
      label: 'अलर्ट',
      icon: <Bell className={`w-5 h-5 ${activeTab === 'notifications' ? 'fill-orange-400 text-orange-400' : 'text-slate-400'}`} />,
      badge: unreadNotificationsCount
    },
    {
      id: 'profile',
      label: t.profile,
      icon: (
        <div className={`w-6 h-6 rounded-full overflow-hidden border-2 transition-all ${
          activeTab === 'profile' ? 'border-orange-400 scale-105' : 'border-slate-600'
        }`}>
          <img src={currentUser.avatar} alt={currentUser.fullName} className="w-full h-full object-cover" />
        </div>
      )
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 px-1 sm:px-2 pt-1 pb-safe max-w-lg mx-auto sm:max-w-none">
      <div className="grid grid-cols-6 items-center justify-items-center h-14">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const isCreate = item.id === 'create';

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="relative flex flex-col items-center justify-center w-full min-h-[48px] py-1 cursor-pointer select-none group"
            >
              <div className="relative">
                {item.icon}
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center font-mono">
                    {item.badge}
                  </span>
                ) : null}
              </div>

              {!isCreate && (
                <span
                  className={`text-[10px] font-medium tracking-tight mt-1 transition-colors ${
                    isActive ? 'text-orange-400 font-semibold' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
