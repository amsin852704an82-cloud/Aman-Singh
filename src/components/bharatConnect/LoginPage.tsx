import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Lock, 
  Mail, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Loader2, 
  AlertCircle,
  Flame,
  CheckCircle2,
  Compass,
  KeyRound,
  ArrowLeft,
  Check,
  X
} from 'lucide-react';
import { checkUsernameAvailability, validateUsernameFormat } from '../../lib/usernameService';

export const LoginPage: React.FC = () => {
  const { 
    loginWithEmail, 
    signUpWithEmail, 
    loginWithGoogle, 
    sendPasswordReset,
    enterDemoMode,
    error: authContextError, 
    clearError 
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot_password'>('login');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  // Real-time username check state
  const [usernameCheck, setUsernameCheck] = useState<{
    checking: boolean;
    available?: boolean;
    message?: string;
  }>({ checking: false });

  const displayError = localError || authContextError;

  const handleTabChange = (newMode: 'login' | 'signup' | 'forgot_password') => {
    setMode(newMode);
    setLocalError(null);
    setResetSuccessMessage(null);
    clearError();
  };

  // Debounced username availability checker
  useEffect(() => {
    if (mode !== 'signup' || !username.trim()) {
      setUsernameCheck({ checking: false });
      return;
    }

    const timer = setTimeout(async () => {
      const validation = validateUsernameFormat(username);
      if (!validation.valid) {
        setUsernameCheck({
          checking: false,
          available: false,
          message: validation.error
        });
        return;
      }

      setUsernameCheck({ checking: true });
      const res = await checkUsernameAvailability(validation.cleanUsername);
      setUsernameCheck({
        checking: false,
        available: res.available,
        message: res.message
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [username, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setResetSuccessMessage(null);
    clearError();

    // Mode: Forgot Password
    if (mode === 'forgot_password') {
      if (!email.trim()) {
        setLocalError('कृपया अपना पंजीकृत ईमेल पता दर्ज करें।');
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
        setLocalError(res.error);
      }
      return;
    }

    // Validation for login & signup
    if (!email.trim() || !password) {
      setLocalError('कृपया ईमेल और पासवर्ड दोनों दर्ज करें।');
      return;
    }

    if (mode === 'signup') {
      if (!fullName.trim() || !username.trim()) {
        setLocalError('कृपया अपना पूरा नाम और यूज़रनेम दर्ज करें।');
        return;
      }
      if (password.length < 6) {
        setLocalError('पासवर्ड सुरक्षा के लिए कम से कम 6 अक्षरों का होना चाहिए।');
        return;
      }

      const val = validateUsernameFormat(username);
      if (!val.valid) {
        setLocalError(val.error || 'अमान्य यूज़रनेम प्रारूप।');
        return;
      }

      setLoading(true);
      const res = await signUpWithEmail(email, password, fullName, val.cleanUsername);
      setLoading(false);
      if (!res.success && res.error) {
        setLocalError(res.error);
      }
    } else {
      setLoading(true);
      const res = await loginWithEmail(email, password);
      setLoading(false);
      if (!res.success && res.error) {
        setLocalError(res.error);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setLocalError(null);
    setResetSuccessMessage(null);
    clearError();
    setGoogleLoading(true);
    const res = await loginWithGoogle();
    setGoogleLoading(false);
    if (!res.success && res.error) {
      setLocalError(res.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-8 font-sans antialiased relative selection:bg-orange-500 selection:text-white">
      {/* Decorative Indian Tricolor Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-72 bg-gradient-to-b from-orange-500/15 via-emerald-500/10 to-transparent blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* BharatConnect Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-1 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-400 to-emerald-500 shadow-xl shadow-orange-500/20 mb-1">
            <div className="w-14 h-14 rounded-xl bg-slate-950 flex items-center justify-center">
              <span className="text-2xl font-black bg-gradient-to-r from-orange-400 via-white to-emerald-400 bg-clip-text text-transparent">
                भा
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center justify-center gap-1.5">
            <span>Bharat</span>
            <span className="text-orange-500">Connect</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            भारत का अपना सोशल नेटवर्क 🇮🇳 | जुड़ें, शेयर करें और पहचान बनाएं
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl space-y-5">
          {mode !== 'forgot_password' ? (
            /* Toggle between Login and Signup */
            <div className="flex bg-slate-950/70 p-1 rounded-2xl border border-slate-800/80">
              <button
                type="button"
                onClick={() => handleTabChange('login')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  mode === 'login'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                लॉगिन करें (Log In)
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('signup')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  mode === 'signup'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                नया खाता बनाएं (Sign Up)
              </button>
            </div>
          ) : (
            /* Forgot Password Top Navigation */
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <button
                type="button"
                onClick={() => handleTabChange('login')}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition py-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>लॉगिन पर वापस जाएं</span>
              </button>
              <span className="text-xs font-bold text-orange-400 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5" />
                <span>पासवर्ड रीसेट</span>
              </span>
            </div>
          )}

          {/* Success Banner */}
          {resetSuccessMessage && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-2xl flex items-start gap-3 text-xs text-emerald-300 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-emerald-200">रीसेट ईमेल भेजा गया!</p>
                <p className="text-[11px] text-emerald-300/90 leading-relaxed">{resetSuccessMessage}</p>
              </div>
            </div>
          )}

          {/* Error Banner in Simple Hindi */}
          {displayError && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/40 rounded-2xl flex items-start gap-2.5 text-xs text-rose-300 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold">{displayError}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'forgot_password' && (
              <div className="space-y-1">
                <p className="text-xs text-slate-300 font-medium">
                  अपना पंजीकृत ईमेल पता दर्ज करें:
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  हम आपको पासवर्ड बदलने का सुरक्षित लिंक ईमेल करेंगे। लिंक पर क्लिक कर आप तुरंत नया पासवर्ड सेट कर सकते हैं।
                </p>
              </div>
            )}

            {mode === 'signup' && (
              <>
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-300">
                    पूरा नाम (Full Name)
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="उदा. राहुल शर्मा (Rahul Sharma)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                      required
                    />
                  </div>
                </div>

                {/* Unique Username with Live Availability Indicator */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-slate-300">
                      यूज़रनेम (Unique Username Handle)
                    </label>
                    {username.trim().length > 0 && (
                      <span className="text-[10px] flex items-center gap-1">
                        {usernameCheck.checking ? (
                          <span className="text-slate-400 flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" /> जाँच हो रही है...
                          </span>
                        ) : usernameCheck.available ? (
                          <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> उपलब्ध है
                          </span>
                        ) : usernameCheck.message ? (
                          <span className="text-rose-400 font-medium flex items-center gap-0.5">
                            <X className="w-3 h-3" /> अनुपलब्ध
                          </span>
                        ) : null}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <span className="text-xs text-slate-500 font-bold absolute left-3.5 top-1/2 -translate-y-1/2">
                      @
                    </span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      placeholder="उदा. rahul_sharma"
                      className={`w-full bg-slate-950 border rounded-xl pl-8 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 transition ${
                        usernameCheck.available === false
                          ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500'
                          : usernameCheck.available === true
                          ? 'border-emerald-500/60 focus:border-emerald-500 focus:ring-emerald-500'
                          : 'border-slate-800 focus:border-orange-500 focus:ring-orange-500'
                      }`}
                      required
                    />
                  </div>
                  {usernameCheck.message && !usernameCheck.available && (
                    <p className="text-[10px] text-rose-400">{usernameCheck.message}</p>
                  )}
                </div>
              </>
            )}

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300">
                ईमेल (Email Address)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                  required
                />
              </div>
            </div>

            {/* Password (only in login and signup) */}
            {mode !== 'forgot_password' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-300">
                    पासवर्ड (Password)
                  </label>
                  {mode === 'signup' ? (
                    <span className="text-[10px] text-slate-500">न्यूनतम 6 अक्षर</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleTabChange('forgot_password')}
                      className="text-[11px] text-orange-400 hover:text-orange-300 font-medium transition hover:underline"
                    >
                      पासवर्ड भूल गए? (Forgot?)
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || googleLoading || (mode === 'signup' && usernameCheck.available === false)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>प्रक्रिया चल रही है...</span>
                </>
              ) : mode === 'forgot_password' ? (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>पासवर्ड रीसेट लिंक भेजें (Send Reset Link)</span>
                </>
              ) : mode === 'login' ? (
                <>
                  <span>लॉगिन करें (Log In)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>नया खाता बनाएं (Create Account)</span>
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

              {/* Google Sign-In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading || googleLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-3 transition active:scale-95 shadow-md disabled:opacity-50"
              >
                {googleLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                    <span>Google से जुड़ रहे हैं...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Google के साथ जारी रखें (Continue with Google)</span>
                  </>
                )}
              </button>

              {/* Instant Guest / Demo Mode Button */}
              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={enterDemoMode}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-orange-400 transition underline underline-offset-4"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>डेमो मोड में देखें (Explore Demo / Guest Mode)</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Security & DPDP compliance notice */}
        <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-3.5 text-center space-y-1 text-[11px] text-slate-400">
          <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>सुरक्षित प्रमाणीकरण (Firebase Auth) एवं DPDP Act 2023 अनुपालन</span>
          </div>
          <p className="text-[10px] text-slate-500">
            पासवर्ड सीधे Firebase द्वारा सुरक्षित रूप से एन्क्रिप्ट किए जाते हैं। ₹0 मुफ़्त सेवा।
          </p>
        </div>
      </div>
    </div>
  );
};
