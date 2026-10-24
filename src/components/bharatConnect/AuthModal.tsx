import React, { useState, useEffect } from 'react';
import { useBharatConnect } from '../../context/BharatConnectContext';
import { useAuth } from '../../context/AuthContext';
import { 
  X, 
  Lock, 
  Mail, 
  User as UserIcon, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Loader2, 
  AlertCircle,
  Flame,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  Check
} from 'lucide-react';
import { checkUsernameAvailability, validateUsernameFormat } from '../../lib/usernameService';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    signUpWithFirebase,
    loginWithFirebase,
    loginAs, 
    users, 
    currentUser 
  } = useBharatConnect();
  const { loginWithGoogle, sendPasswordReset } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot_password'>('login');
  
  // Form fields
  const [fullName, setFullName] = useState('Rahul Sharma');
  const [username, setUsername] = useState('rahul_sharma');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  // Real-time username check state
  const [usernameCheck, setUsernameCheck] = useState<{
    checking: boolean;
    available?: boolean;
    message?: string;
  }>({ checking: false });

  // Debounced username check for signup mode
  useEffect(() => {
    if (mode !== 'signup' || !username.trim()) {
      setUsernameCheck({ checking: false });
      return;
    }

    const timer = setTimeout(async () => {
      const val = validateUsernameFormat(username);
      if (!val.valid) {
        setUsernameCheck({
          checking: false,
          available: false,
          message: val.error
        });
        return;
      }

      setUsernameCheck({ checking: true });
      const res = await checkUsernameAvailability(val.cleanUsername);
      setUsernameCheck({
        checking: false,
        available: res.available,
        message: res.message
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [username, mode]);

  if (!isAuthModalOpen) return null;

  const handleTabChange = (newMode: 'login' | 'signup' | 'forgot_password') => {
    setMode(newMode);
    setAuthError(null);
    setResetSuccessMessage(null);
  };

  const handleGoogleSubmit = async () => {
    setAuthError(null);
    setResetSuccessMessage(null);
    setGoogleLoading(true);
    const res = await loginWithGoogle();
    setGoogleLoading(false);
    if (res.success) {
      setIsAuthModalOpen(false);
    } else if (res.error) {
      setAuthError(res.error);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setResetSuccessMessage(null);

    if (!email.trim()) {
      setAuthError('कृपया अपना पंजीकृत ईमेल पता दर्ज करें।');
      return;
    }

    setLoading(true);
    const res = await sendPasswordReset(email);
    setLoading(false);

    if (res.success) {
      setResetSuccessMessage(
        res.message || 'पासवर्ड रीसेट लिंक आपके ईमेल पर भेज दिया गया है। कृपया अपना इनबॉक्स या स्पैम फ़ोल्डर चेक करें।'
      );
    } else if (res.error) {
      setAuthError(res.error);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!email || !password || !fullName || !username) {
      setAuthError('कृपया सभी फ़ील्ड भरें।');
      return;
    }

    if (password.length < 6) {
      setAuthError('पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।');
      return;
    }

    const val = validateUsernameFormat(username);
    if (!val.valid) {
      setAuthError(val.error || 'अमान्य यूज़रनेम प्रारूप।');
      return;
    }

    setLoading(true);
    const result = await signUpWithFirebase(email, password, fullName, val.cleanUsername);
    setLoading(false);

    if (!result.success && result.error) {
      setAuthError(result.error);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!email || !password) {
      setAuthError('कृपया ईमेल और पासवर्ड दर्ज करें।');
      return;
    }

    setLoading(true);
    const result = await loginWithFirebase(email, password);
    setLoading(false);

    if (!result.success && result.error) {
      setAuthError(result.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md">
              <Flame className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>
                  {mode === 'forgot_password' 
                    ? 'पासवर्ड रीसेट (Forgot Password)' 
                    : mode === 'login' 
                    ? 'Firebase लॉगिन (Login)' 
                    : 'Firebase खाता बनाएं (Sign Up)'}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {mode === 'forgot_password'
                  ? 'पंजीकृत ईमेल पर पासवर्ड रीसेट लिंक प्राप्त करें'
                  : mode === 'login'
                  ? 'अपने सुरक्षित खाते में प्रवेश करें'
                  : 'ईमेल एवं पासवर्ड द्वारा ₹0 मुफ़्त पंजीकरण'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        {mode !== 'forgot_password' ? (
          <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => handleTabChange('login')}
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
              onClick={() => handleTabChange('signup')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                mode === 'signup'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              नया खाता (Sign Up)
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between pb-1">
            <button
              type="button"
              onClick={() => handleTabChange('login')}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>लॉगिन पर वापस जाएं</span>
            </button>
            <span className="text-xs text-orange-400 font-semibold flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5" /> पासवर्ड सहायता
            </span>
          </div>
        )}

        {/* Success Alert */}
        {resetSuccessMessage && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/40 rounded-xl flex items-start gap-2.5 text-xs text-emerald-300 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold text-emerald-200">ईमेल भेजा गया!</p>
              <p className="text-[11px] text-emerald-300/90 leading-relaxed">{resetSuccessMessage}</p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {authError && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/40 rounded-xl flex items-start gap-2 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        {/* Form */}
        <form 
          onSubmit={
            mode === 'forgot_password' 
              ? handleForgotPasswordSubmit 
              : mode === 'login' 
              ? handleLoginSubmit 
              : handleSignupSubmit
          } 
          className="space-y-3"
        >
          {mode === 'forgot_password' && (
            <p className="text-[11px] text-slate-300 leading-relaxed">
              अपना ईमेल पता दर्ज करें। हम आपको पासवर्ड रीसेट करने का लिंक भेजेंगे।
            </p>
          )}

          {mode === 'signup' && (
            <>
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

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-400">
                    यूज़रनेम (Unique Username Handle)
                  </label>
                  {username.trim().length > 0 && (
                    <span className="text-[10px] flex items-center gap-1">
                      {usernameCheck.checking ? (
                        <span className="text-slate-400 flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" /> जाँच...
                        </span>
                      ) : usernameCheck.available ? (
                        <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> उपलब्ध
                        </span>
                      ) : usernameCheck.message ? (
                        <span className="text-rose-400 font-medium">अनुपलब्ध</span>
                      ) : null}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <span className="text-slate-500 font-bold text-xs absolute left-3 top-1/2 -translate-y-1/2">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="rahul_sharma"
                    className={`w-full bg-slate-950 border rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none transition ${
                      usernameCheck.available === false
                        ? 'border-rose-500/60'
                        : usernameCheck.available === true
                        ? 'border-emerald-500/60'
                        : 'border-slate-800 focus:border-orange-500'
                    }`}
                    required
                  />
                </div>
                {usernameCheck.message && !usernameCheck.available && (
                  <p className="text-[10px] text-rose-400 mt-1">{usernameCheck.message}</p>
                )}
              </div>
            </>
          )}

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              ईमेल (Email Address)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aapka_email@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                required
              />
            </div>
          </div>

          {mode !== 'forgot_password' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-slate-400">
                  पासवर्ड (Password)
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => handleTabChange('forgot_password')}
                    className="text-[10px] text-orange-400 hover:text-orange-300 transition hover:underline"
                  >
                    पासवर्ड भूल गए?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="कम से कम 6 अक्षर"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || googleLoading || (mode === 'signup' && usernameCheck.available === false)}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-orange-500/20 active:scale-[0.99] transition flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>प्रक्रिया जारी है...</span>
              </>
            ) : mode === 'forgot_password' ? (
              <>
                <KeyRound className="w-4 h-4" />
                <span>पासवर्ड रीसेट लिंक भेजें</span>
              </>
            ) : (
              <>
                <span>{mode === 'login' ? 'Firebase से लॉगिन करें (Log In)' : 'नया खाता पंजीकृत करें (Sign Up)'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {mode !== 'forgot_password' && (
          <>
            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-slate-900 px-3 text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                या (OR)
              </span>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSubmit}
              disabled={loading || googleLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-2.5 transition active:scale-95 shadow-md disabled:opacity-50"
            >
              {googleLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                  <span>Google से जुड़ रहे हैं...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google के साथ जारी रखें (Continue with Google)</span>
                </>
              )}
            </button>

            {/* 1-Click Test Accounts (Useful for instant testing) */}
            <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80 space-y-2">
              <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>त्वरित 1-क्लिक टेस्ट प्रोफाइल्स (Demo Switcher):</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {users.slice(0, 4).map((u) => (
                  <button
                    type="button"
                    key={u.id}
                    onClick={() => loginAs(u)}
                    className={`p-1.5 rounded-xl text-left border flex items-center gap-2 transition active:scale-95 ${
                      currentUser.id === u.id
                        ? 'bg-orange-500/20 border-orange-500/50 text-orange-300'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <img src={u.avatar} alt={u.fullName} className="w-6 h-6 rounded-full object-cover" />
                    <div className="overflow-hidden">
                      <div className="text-[11px] font-bold truncate">{u.fullName.split(' ')[0]}</div>
                      <div className="text-[9px] text-slate-500 truncate">{u.handle}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="text-[10px] text-center text-slate-500 flex items-center justify-center gap-1.5 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>सुरक्षित Firebase Auth एवं DPDP Act 2023 अनुपालन</span>
        </div>
      </div>
    </div>
  );
};
