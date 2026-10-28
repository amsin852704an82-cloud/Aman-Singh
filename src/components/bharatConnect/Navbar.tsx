import React from 'react';
import { useBharatConnect } from '../../context/BharatConnectContext';
import { LanguageCode } from '../../types/bharatConnect';
import { 
  Globe, 
  Shield, 
  Smartphone, 
  Monitor, 
  LogIn, 
  UserCheck, 
  Bell, 
  MessageSquare, 
  Sun, 
  Moon, 
  Compass,
  Home,
  GraduationCap,
  Clapperboard,
  Users,
  Calendar,
  ShoppingBag,
  BarChart3,
  Search,
  Sparkles
} from 'lucide-react';
import { InboxModal } from './InboxModal';

export const Navbar: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    theme,
    toggleTheme,
    t, 
    activeTab, 
    setActiveTab, 
    reports,
    unreadNotificationsCount,
    isPhoneFrame,
    setIsPhoneFrame,
    firebaseUser,
    setIsAuthModalOpen,
    currentUser,
    openSOSModal
  } = useBharatConnect();

  const [isInboxOpen, setIsInboxOpen] = React.useState(false);

  const pendingReportsCount = reports.filter((r) => r.status === 'pending').length;

  const toggleQuickLanguage = () => {
    setLanguage(language === 'hi' ? 'en' : 'hi');
  };

  const languages: { code: LanguageCode; label: string }[] = [
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'en', label: 'English' },
    { code: 'gu', label: 'ગુજરાતી' },
    { code: 'mr', label: 'मराठी' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'bn', label: 'বাংলা' }
  ];

  return (
    <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand Identity */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center space-x-2 cursor-pointer select-none"
        >
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black px-2.5 py-1 rounded-lg text-lg tracking-wider shadow-md">
            BC
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-tight">
              <h1 className="font-bold text-base leading-tight">
                Bharat<span className="text-orange-500">Connect</span>
              </h1>
              <span className="text-[10px] bg-orange-500/20 text-orange-400 font-semibold px-1.5 py-0.2 rounded border border-orange-500/30">
                Beta
              </span>
            </div>
            <p className="text-[10px] text-gray-400">
              {t.tagline || 'भारत का अपना सोशल मीडिया'}
            </p>
          </div>
        </div>

        {/* Right: Controls & Language */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Top Right Utility: SOS Button */}
          <button
            id="sosBtn"
            onClick={openSOSModal}
            className="flex items-center gap-1.5 text-xs bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/40 px-2.5 sm:px-3 py-1.5 rounded-full font-bold transition active:scale-95 cursor-pointer shadow-sm shadow-red-500/20"
            title="भारत सहारा (SOS Emergency Network)"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
            <span>SOS</span>
          </button>

          {/* Compass / Explore Button */}
          <button
            onClick={() => setActiveTab('search')}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-yellow-400 hover:bg-slate-800 flex items-center justify-center transition cursor-pointer"
            title="एक्सप्लोर (Explore)"
          >
            <Compass className="w-4 h-4" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-amber-400 hover:bg-slate-800 flex items-center justify-center transition cursor-pointer"
            title={theme === 'dark' ? 'लाइट थीम' : 'डार्क थीम'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Quick Language Toggle */}
          <button
            onClick={toggleQuickLanguage}
            className="h-8 px-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 flex items-center justify-center text-xs font-bold transition cursor-pointer"
            title="भाषा स्विच करें"
          >
            {language === 'hi' ? 'हिंदी' : 'EN'}
          </button>

          {/* BharatConnect Native App Mode Toggle */}
          <button
            onClick={() => setActiveTab(activeTab === 'app' ? 'home' : 'app')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'app'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 shadow-md scale-105'
                : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-400'
            }`}
            title="BharatConnect App View"
          >
            <Smartphone className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-[11px]">App</span>
          </button>

          {/* BharatConnect v2.0 Interface Toggle */}
          <button
            onClick={() => setActiveTab(activeTab === 'v2' ? 'home' : 'v2')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'v2'
                ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 text-slate-950 shadow-md scale-105'
                : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-orange-400'
            }`}
            title="BharatConnect v2.0 UI"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px]">v2.0</span>
          </button>

          {/* BharatConnect v2.1 Upgraded Audio & Tipping Interface Toggle */}
          <button
            onClick={() => setActiveTab(activeTab === 'v2.1' ? 'home' : 'v2.1')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'v2.1'
                ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 shadow-md scale-105'
                : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-400'
            }`}
            title="BharatConnect v2.1 Audio & Tipping UI"
          >
            <span className="text-[11px] font-black">v2.1</span>
          </button>

          {/* BharatConnect Optimized Auto-Pause & Vernacular Toggle */}
          <button
            onClick={() => setActiveTab(activeTab === 'optimized' ? 'home' : 'optimized')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'optimized'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md scale-105'
                : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-emerald-400'
            }`}
            title="BharatConnect Optimized Data-Saver & Vernacular UI"
          >
            <span className="text-[11px] font-black">⚡ Opt</span>
          </button>

          {/* Desktop Phone Frame Toggle */}
          <button
            onClick={() => setIsPhoneFrame((prev) => !prev)}
            className="hidden md:flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs text-slate-300 transition-colors cursor-pointer"
            title={isPhoneFrame ? 'स्विच टू डेस्कटॉप व्यू' : 'स्विच टू मोबाइल व्यू'}
          >
            {isPhoneFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[11px]">Full</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-[11px]">Frame</span>
              </>
            )}
          </button>

          {/* Notifications Button */}
          <button
            onClick={() => setActiveTab('notifications')}
            className={`relative p-2 rounded-lg border transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center ${
              activeTab === 'notifications'
                ? 'bg-slate-800 border-orange-500/50 text-orange-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="सूचनाएं / Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-orange-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center font-mono shadow-sm">
                {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Direct Messages Button */}
          <button
            onClick={() => setIsInboxOpen(true)}
            className="relative p-2 rounded-lg border bg-slate-900 border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
            title="संदेश / Direct Messages"
          >
            <MessageSquare className="w-4 h-4 text-orange-400" />
          </button>

          {/* Admin Moderation Button */}
          <button
            onClick={() => setActiveTab('admin')}
            className={`relative p-2 rounded-lg border transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center ${
              activeTab === 'admin'
                ? 'bg-slate-800 border-orange-500/50 text-orange-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="सामग्री मॉडरेशन / Admin Panel"
          >
            <Shield className="w-4 h-4" />
            {pendingReportsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center font-mono">
                {pendingReportsCount}
              </span>
            )}
          </button>

          {/* Firebase Auth Account Button */}
          <button
            onClick={() => {
              if (firebaseUser) {
                setActiveTab('profile');
              } else {
                setIsAuthModalOpen(true);
              }
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-semibold transition active:scale-95 cursor-pointer min-h-[40px]"
            title={firebaseUser ? `लॉगिन: ${currentUser.name || currentUser.fullName}` : 'Firebase लॉगिन / साइन अप'}
          >
            {firebaseUser ? (
              <>
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline text-[11px] font-bold text-slate-200 truncate max-w-[80px]">
                  {(currentUser.name || currentUser.fullName).split(' ')[0]}
                </span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span className="text-[11px] font-bold">लॉगिन</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <nav className="max-w-5xl mx-auto flex space-x-3 px-4 py-2 bg-zinc-900/50 border-b border-zinc-800 overflow-x-auto whitespace-nowrap scrollbar-none">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full font-semibold text-sm transition cursor-pointer ${
            activeTab === 'home'
              ? 'bg-orange-500 text-zinc-950 shadow-md shadow-orange-500/20'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
          }`}
        >
          <i className="fa-solid fa-house"></i>
          <span>होम</span>
        </button>

        <button
          onClick={() => setActiveTab('reels')}
          className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full font-medium text-sm transition cursor-pointer ${
            activeTab === 'reels'
              ? 'bg-orange-500 text-zinc-950 shadow-md shadow-orange-500/20 font-semibold'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
          }`}
        >
          <i className="fa-solid fa-video"></i>
          <span>रील्स</span>
        </button>

        <button
          onClick={() => setActiveTab('hunar')}
          className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full font-medium text-sm transition cursor-pointer ${
            activeTab === 'hunar'
              ? 'bg-orange-500 text-zinc-950 shadow-md shadow-orange-500/20 font-semibold'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
          }`}
        >
          <i className="fa-solid fa-graduation-cap"></i>
          <span>हुनर (Skills)</span>
        </button>

        <button
          onClick={() => setActiveTab('groups')}
          className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition active:scale-95 cursor-pointer ${
            activeTab === 'groups'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>समूह (Groups)</span>
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition active:scale-95 cursor-pointer ${
            activeTab === 'events'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>उत्सव व मेले (Events)</span>
        </button>

        <button
          onClick={() => setActiveTab('marketplace')}
          className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition active:scale-95 cursor-pointer ${
            activeTab === 'marketplace'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>देसी हाट</span>
        </button>

        <button
          onClick={() => setActiveTab('creator')}
          className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition active:scale-95 cursor-pointer ${
            activeTab === 'creator'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>स्टूडियो</span>
        </button>

        <button
          onClick={() => setActiveTab('search')}
          className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition active:scale-95 cursor-pointer ${
            activeTab === 'search'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>खोजें</span>
        </button>
      </nav>

      {/* Direct Messaging Inbox Modal */}
      <InboxModal
        isOpen={isInboxOpen}
        onClose={() => setIsInboxOpen(false)}
      />
    </header>
  );
};
