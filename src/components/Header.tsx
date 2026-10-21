import React from 'react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';

export const Header: React.FC<{ onOpenQuickStart: () => void }> = ({ onOpenQuickStart }) => {
  const { activeTab, setActiveTab } = useApp();

  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'app', label: 'Live App' },
    { id: 'postgres', label: 'Postgres DB' },
    { id: 'redis', label: 'Redis Cache' },
    { id: 'minio', label: 'MinIO S3' },
    { id: 'nestjs', label: 'NestJS API' },
    { id: 'compose', label: 'Docker Config' }
  ];

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      {/* Zone 1: Single text element wordmark in display face */}
      <div 
        onClick={() => setActiveTab('app')}
        className="cursor-pointer text-base font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2"
      >
        <span className="text-orange-500 font-black">BHARAT</span>
        <span className="text-slate-300 font-semibold">SOCIAL</span>
      </div>

      {/* Zone 2: 4–5 concise single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'text-orange-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenQuickStart}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-orange-400 to-amber-300 rounded-lg hover:from-orange-500 hover:to-amber-400 transition-all shadow-sm shadow-orange-500/20 whitespace-nowrap shrink-0 cursor-pointer"
        >
          Docker Compose Run
        </button>
      </div>
    </header>
  );
};
