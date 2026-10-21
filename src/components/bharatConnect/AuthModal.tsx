import React, { useState } from 'react';
import { useBharatConnect } from '../../context/BharatConnectContext';
import { X, Lock, Mail, User as UserIcon, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { User } from '../../types/bharatConnect';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    loginAs, 
    users, 
    currentUser, 
    setToastMessage 
  } = useBharatConnect();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  
  // Form fields matching user payload:
  // username: "rahul_sharma", email: "rahul@example.com", password: "SecurePass123!", full_name: "Rahul Sharma"
  const [fullName, setFullName] = useState('Rahul Sharma');
  const [username, setUsername] = useState('rahul_sharma');
  const [email, setEmail] = useState('rahul@example.com');
  const [password, setPassword] = useState('SecurePass123!');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      // Simulate NestJS / Firebase signup
      const newUser: User = {
        id: `user_${Date.now()}`,
        username: username.toLowerCase().trim(),
        fullName: fullName.trim(),
        handle: `@${username.toLowerCase().trim()}`,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        bio: 'भारत का नया नागरिक | Tech Enthusiast 🇮🇳',
        location: 'New Delhi, India',
        verified: false,
        followersCount: 1,
        followingCount: 3,
        postCount: 0,
        language: 'hi'
      };

      loginAs(newUser);
      setLoading(false);
      setToastMessage(`खाता तैयार! स्वागत है, ${newUser.fullName} (JWT Token Issued)`);
    }, 700);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      // Find matching user or default to Rahul
      const found = users.find(
        (u) => u.username.toLowerCase() === username.toLowerCase()
      ) || users[0];

      loginAs(found);
      setLoading(false);
      setToastMessage(`लॉगिन सफल: ${found.fullName}`);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center font-black text-xs text-white">
              BC
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {mode === 'login' ? 'भारतकनेक्ट लॉगिन (Login)' : 'नया खाता बनाएं (Sign Up)'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {mode === 'login' ? 'अपने खाते में प्रवेश करें' : 'भारतीय सोशल मीडिया परिवार से जुड़ें'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              mode === 'login'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            लॉगिन (Login)
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              mode === 'signup'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            साइन अप (Sign Up)
          </button>
        </div>

        {/* 1-Click Demo Profiles to Test Right Now */}
        <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 space-y-2">
          <div className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>₹0 टेस्ट हेतु 1-क्लिक डेमो प्रोफाइल्स:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {users.slice(0, 4).map((u) => (
              <button
                type="button"
                key={u.id}
                onClick={() => loginAs(u)}
                className={`p-2 rounded-xl text-left border flex items-center gap-2 transition active:scale-95 ${
                  currentUser.id === u.id
                    ? 'bg-orange-500/20 border-orange-500/50 text-orange-300'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <img src={u.avatar} alt={u.fullName} className="w-7 h-7 rounded-full object-cover" />
                <div className="overflow-hidden">
                  <div className="text-[11px] font-bold truncate">{u.fullName.split(' ')[0]}</div>
                  <div className="text-[10px] text-slate-500 truncate">{u.handle}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={mode === 'login' ? handleLoginSubmit : handleSignupSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                पूरा नाम (Full Name)
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              यूज़रनेम (Username)
            </label>
            <div className="relative">
              <span className="text-slate-500 font-bold text-xs absolute left-3 top-1/2 -translate-y-1/2">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="rahul_sharma"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              ईमेल (Email)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              पासवर्ड (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-orange-500/20 active:scale-[0.99] transition flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <span className="animate-pulse">प्रक्रिया जारी है...</span>
            ) : (
              <>
                <span>{mode === 'login' ? 'लॉगिन करें (Continue)' : 'खाता बनाएं (Create Account)'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-[11px] text-center text-slate-500 flex items-center justify-center gap-1.5 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>DPDP Act 2023 अनुपालक और सुरक्षित</span>
        </div>
      </div>
    </div>
  );
};
