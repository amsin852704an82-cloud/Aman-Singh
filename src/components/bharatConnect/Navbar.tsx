import React from 'react';
import { useBharatConnect } from '../../context/BharatConnectContext';
import { LanguageCode } from '../../types/bharatConnect';
import { Globe, Shield, Smartphone, Monitor } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    t, 
    activeTab, 
    setActiveTab, 
    reports,
    isPhoneFrame,
    setIsPhoneFrame
  } = useBharatConnect();

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
        <div className="flex items-center gap-2">
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
        </div>
      </div>
    </header>
  );
};
