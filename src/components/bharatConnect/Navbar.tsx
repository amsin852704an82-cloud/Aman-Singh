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
  Search
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
    currentUser
  } = useBharatConnect();

  const [isInboxOpen, setIsInboxOpen] = React.useState(false);

  const pendingReportsCount = reports.filter((r) => r.status === 'pending').length;

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
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-400 to-emerald-500 flex items-center justify-center p-0.5 shadow-sm shadow-orange-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-xs text-white">
              BC
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-base tracking-tight leading-none text-white">
              <span className="text-orange-500">Bharat</span>
              <span className="text-slate-100">Connect</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">
              {t.tagline}
            </span>
          </div>
        </div>

        {/* Center: Demo Mode Info Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-300 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{t.demoMode}</span>
        </div>

        {/* Right: Controls & Language */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Landing Page Link */}
          <button
            onClick={() => setActiveTab('landing')}
            className={`p-2 rounded-lg border transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center ${
              activeTab === 'landing'
                ? 'bg-orange-500/20 border-orange-500/50 text-orange-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="लैंडिंग पेज / Landing Page"
          >
            <Compass className="w-4 h-4 text-orange-400" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border bg-slate-900 border-slate-800 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
            title={theme === 'dark' ? 'लाइट थीम चालू करें' : 'डार्क थीम चालू करें'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Language Selector */}
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="pl-7 pr-2.5 py-1 bg-slate-900 text-slate-200 text-xs rounded-lg border border-slate-800 focus:outline-none focus:border-orange-500/60 cursor-pointer appearance-none"
              title="भाषा चुनें / Choose Language"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

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
                <span className="text-[11px]">Mobile</span>
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

      {/* Module Sub-Navigation Bar */}
      <div className="max-w-5xl mx-auto flex items-center gap-1.5 overflow-x-auto pt-2 pb-0.5 scrollbar-none">
        <button
          onClick={() => setActiveTab('home')}
          className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition active:scale-95 cursor-pointer ${
            activeTab === 'home'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>होम</span>
        </button>

        <button
          onClick={() => setActiveTab('reels')}
          className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition active:scale-95 cursor-pointer ${
            activeTab === 'reels'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Clapperboard className="w-3.5 h-3.5" />
          <span>रील्स</span>
        </button>

        <button
          onClick={() => setActiveTab('hunar')}
          className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition active:scale-95 cursor-pointer ${
            activeTab === 'hunar'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
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
      </div>

      {/* Direct Messaging Inbox Modal */}
      <InboxModal
        isOpen={isInboxOpen}
        onClose={() => setIsInboxOpen(false)}
      />
    </header>
  );
};
