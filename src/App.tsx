/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BharatConnectProvider, useBharatConnect } from './context/BharatConnectContext';
import { Navbar } from './components/bharatConnect/Navbar';
import { BottomNav } from './components/bharatConnect/BottomNav';
import { HomeFeed } from './components/bharatConnect/HomeFeed';
import { ReelsView } from './components/bharatConnect/ReelsView';
import { CreatePostView } from './components/bharatConnect/CreatePostView';
import { SearchView } from './components/bharatConnect/SearchView';
import { NotificationsView } from './components/bharatConnect/NotificationsView';
import { ProfileView } from './components/bharatConnect/ProfileView';
import { AdminView } from './components/bharatConnect/AdminView';
import { AuthModal } from './components/bharatConnect/AuthModal';
import { CheckCircle2, Smartphone } from 'lucide-react';

const BharatConnectContent: React.FC = () => {
  const { activeTab, isPhoneFrame, toastMessage } = useBharatConnect();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeFeed />;
      case 'reels':
        return <ReelsView />;
      case 'create':
        return <CreatePostView />;
      case 'search':
        return <SearchView />;
      case 'notifications':
        return <NotificationsView />;
      case 'profile':
        return <ProfileView />;
      case 'admin':
        return <AdminView />;
      default:
        return <HomeFeed />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-orange-500 selection:text-white font-sans">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main Container: Supports native full width or simulated Android phone viewport */}
      <main className="flex-1 flex justify-center w-full">
        <div
          className={`w-full transition-all duration-300 ${
            isPhoneFrame
              ? 'max-w-[430px] my-4 rounded-[40px] border-[6px] border-slate-800 shadow-2xl bg-slate-950 overflow-hidden relative min-h-[844px]'
              : 'max-w-6xl'
          }`}
        >
          {/* Simulated Mobile Top Notch / Speaker when phone frame is active */}
          {isPhoneFrame && (
            <div className="sticky top-0 z-40 bg-slate-950 flex items-center justify-between px-6 py-2 border-b border-slate-900 text-[10px] text-slate-400">
              <span className="font-semibold text-white">9:41</span>
              <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto" />
              <div className="flex items-center gap-1">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>
          )}

          {/* Active View Content */}
          <div className="pb-24">{renderActiveView()}</div>
        </div>
      </main>

      {/* Mobile-First Sticky Bottom Navigation */}
      <BottomNav />

      {/* Login & Signup Modal */}
      <AuthModal />

      {/* Global Interactive Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 bg-slate-900/95 border border-orange-500/50 rounded-2xl shadow-2xl backdrop-blur-md text-xs text-slate-100 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <BharatConnectProvider>
      <BharatConnectContent />
    </BharatConnectProvider>
  );
}
