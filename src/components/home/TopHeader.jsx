import React from 'react';
import { Bell, MessageSquareQuote } from 'lucide-react';

export const TopHeader = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 flex items-center justify-between transition-colors">
      {/* Brand Logo */}
      <div className="flex items-center gap-2 cursor-pointer select-none">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-500 to-emerald-500 p-[1.5px] shadow-sm shadow-orange-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <span className="text-sm font-extrabold bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">
              भा
            </span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-black tracking-tight text-white font-sans flex items-center">
            Bharat<span className="text-orange-500">Connect</span>
          </span>
          <span className="text-[9px] -mt-1 font-medium tracking-wider text-slate-400 uppercase">
            Apna Desh, Apna Network
          </span>
        </div>
      </div>

      {/* Right Actions: Notifications & Current User Avatar */}
      <div className="flex items-center gap-3.5">
        <button
          type="button"
          aria-label="Notifications"
          className="relative p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800/60 transition active:scale-95"
        >
          <Bell className="w-5 h-5 stroke-[2]" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-orange-500 rounded-full ring-2 ring-slate-950 animate-pulse" />
        </button>

        <button
          type="button"
          aria-label="Direct Messages"
          className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800/60 transition active:scale-95 hidden sm:flex"
        >
          <MessageSquareQuote className="w-5 h-5 stroke-[2]" />
        </button>

        {/* User Profile Thumbnail */}
        <div className="relative cursor-pointer group">
          <div className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-orange-500 to-amber-400 group-hover:scale-105 transition-transform">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              alt="My Profile"
              className="w-full h-full rounded-full object-cover border border-slate-950"
            />
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-950" />
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
