import React, { useState } from 'react';
import { useBharatConnect } from '../../context/BharatConnectContext';
import { 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  Compass, 
  Mic, 
  GraduationCap, 
  MapPin, 
  MessageSquare, 
  Heart, 
  Share2, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Moon, 
  Sun, 
  ArrowRight, 
  LogIn, 
  Smartphone, 
  Zap, 
  Flame, 
  Users,
  EyeOff,
  Feather
} from 'lucide-react';

export const LandingPageView: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    theme, 
    toggleTheme, 
    setActiveTab, 
    setIsAuthModalOpen, 
    firebaseUser 
  } = useBharatConnect();

  const isHindi = language === 'hi';

  // State for interactive preview tabs inside mockup
  const [previewTab, setPreviewTab] = useState<'feed' | 'hunar' | 'dilse' | 'awaaz'>('feed');
  
  // State for FAQ accordion
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex((prev) => (prev === idx ? null : idx));
  };

  const faqs = [
    {
      q: isHindi ? 'भारतकनेक्ट (BharatConnect) क्या है?' : 'What is BharatConnect?',
      a: isHindi 
        ? 'भारतकनेक्ट भारत का पहला समग्र स्वदेशी सोशल नेटवर्क है। यहाँ आप सामान्य पोस्ट के साथ-साथ हुनर (Skill Swap), आवाज़ (Voice Notes/Audio Shayari), और दिल से (Anonymous Confessions) का अनुभव पा सकते हैं।'
        : 'BharatConnect is an Indian-first social network combining standard multimedia feeds with Hunar (Skill Swap), Awaaz (Audio Notes), and Dil Se (Anonymous Confessions).'
    },
    {
      q: isHindi ? 'क्या भारतकनेक्ट उपयोग करने के लिए पूरी तरह मुफ़्त है?' : 'Is BharatConnect completely free to use?',
      a: isHindi 
        ? 'हाँ! ₹0 लागत पर आधारित आर्किटेक्चर से विकसित, BharatConnect सभी भारतीय नागरिकों के लिए 100% मुफ़्त है। किसी भी हिडन चार्ज या प्रीमियम शुल्क की आवश्यकता नहीं है।'
        : 'Yes! Built on an efficient ₹0 budget stack, BharatConnect is 100% free for all users with zero hidden charges.'
    },
    {
      q: isHindi ? '"दिल से" (Dil Se) एनोनिमस पोस्ट में मेरी प्राइवेसी कैसे सुरक्षित रहती है?' : 'How is my privacy protected in Dil Se anonymous posts?',
      a: isHindi 
        ? 'जब आप "गुमनाम पोस्ट करें" चालू करते हैं, तो आपकी प्रोफ़ाइल फोटो, नाम और हैंडल डेटाबेस में मास्क हो जाते हैं। फ़ीड पर केवल गुप्त नागरिक दिखाई देता है और यह अलग anonymous_posts संग्रह में रहता है।'
        : 'When you toggle Anonymous Mode, your identity is masked. The feed only shows Anonymous Citizen and posts are isolated in the anonymous_posts collection.'
    },
    {
      q: isHindi ? 'क्या मैं इसे Android फ़ोन पर एक ऐप (PWA) की तरह इंस्टॉल कर सकता हूँ?' : 'Can I install this on Android as a PWA app?',
      a: isHindi 
        ? 'हाँ! यह एक प्रगतिशील वेब ऐप (PWA) है। आप Chrome या किसी भी मोबाइल ब्राउज़र में "Add to Home Screen" (होम स्क्रीन पर जोड़ें) दबाकर इसे सामान्य Android ऐप की तरह चला सकते हैं।'
        : 'Yes! BharatConnect is a Progressive Web App (PWA). You can tap Add to Home Screen in Chrome for a full native-feeling Android app experience.'
    },
    {
      q: isHindi ? 'हुनर (Hunar - Skill Exchange) कैसे काम करता है?' : 'How does Hunar (Skill Exchange) work?',
      a: isHindi 
        ? 'यहाँ आप कोडिंग, कुकिंग, गिटार, पेंटिंग जैसे अपने हुनर शेयर कर सकते हैं। कोई भी "सीखना चाहता हूँ (Learn This)" बटन दबाकर सीधे आपके साथ चैट शुरू कर सकता है।'
        : 'Share your skills like coding, guitar, or cooking. Learners can tap Learn This to immediately launch a direct chat with you.'
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-slate-950 text-slate-100' 
        : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Navigation Bar */}
      <nav className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
        theme === 'dark' 
          ? 'bg-slate-950/90 border-slate-800/80' 
          : 'bg-white/90 border-slate-200'
      }`}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-400 to-emerald-500 p-0.5 shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <div className={`w-full h-full rounded-[10px] flex items-center justify-center font-black text-xs text-white ${
                theme === 'dark' ? 'bg-slate-950' : 'bg-slate-900'
              }`}>
                🇮🇳
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight leading-none">
                <span className="text-orange-500">Bharat</span>
                <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>Connect</span>
              </span>
              <span className="text-[10px] text-emerald-500 font-bold leading-none mt-1 tracking-wider uppercase">
                {isHindi ? 'भारत का अपना सोशल मीडिया' : 'India\'s Own Social Space'}
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#features" className="hover:text-orange-500 transition-colors">
              {isHindi ? 'विशेषताएं' : 'Features'}
            </a>
            <a href="#innovations" className="hover:text-orange-500 transition-colors">
              {isHindi ? 'हुनर व दिल से' : 'Innovations'}
            </a>
            <a href="#preview" className="hover:text-orange-500 transition-colors">
              {isHindi ? 'लाइव प्रीव्यू' : 'App Preview'}
            </a>
            <a href="#faq" className="hover:text-orange-500 transition-colors">
              FAQ
            </a>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(isHindi ? 'en' : 'hi')}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 shadow-sm'
              }`}
              title="भाषा बदलें / Change Language"
            >
              <span>🌐</span>
              <span>{isHindi ? 'English' : 'हिंदी'}</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border transition ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700 text-amber-400'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 shadow-sm'
              }`}
              title={theme === 'dark' ? 'लाइट मोड चालू करें' : 'डार्क मोड चालू करें'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Launch App CTA */}
            <button
              onClick={() => setActiveTab('home')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/20 transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <span>{isHindi ? 'ऐप खोलें' : 'Launch App'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-800/40">
        {/* Subtle Indian Tricolor Glow Background */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold mb-6 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span>🇮🇳 {isHindi ? '100% स्वदेशी, सुरक्षित और आधुनिक सोशल नेटवर्क' : '100% Indian, Secure & Modern Social Platform'}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto mb-6">
            {isHindi ? (
              <>
                भारत को जोड़ने वाला नया मंच —{' '}
                <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500 bg-clip-text text-transparent">
                  संस्कृति, हुनर और सच्ची बातें
                </span>
              </>
            ) : (
              <>
                Connecting a Billion Hearts —{' '}
                <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500 bg-clip-text text-transparent">
                  Culture, Skills & Real Voices
                </span>
              </>
            )}
          </h1>

          {/* Subheading */}
          <p className={`text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed ${
            theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
          }`}>
            {isHindi 
              ? 'इंस्टाग्राम की तरह सिर्फ दिखावा नहीं, बल्कि हुनर सीखें और सिखाएं, दिल की बात बिना नाम के शेयर करें और अपने क्षेत्र की लाइव अपडेट्स पाएं।'
              : 'Beyond just lifestyle updates. Swap real-world skills, share anonymous confessions from the heart, and explore hyper-local updates.'}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 mb-12">
            <button
              onClick={() => setActiveTab('home')}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all active:scale-95 flex items-center gap-2.5 cursor-pointer"
            >
              <Zap className="w-5 h-5 fill-white" />
              <span>{isHindi ? 'सीधे ऐप का अनुभव लें' : 'Experience BharatConnect'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {!firebaseUser && (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className={`px-6 py-3.5 rounded-2xl border font-bold text-sm sm:text-base transition active:scale-95 flex items-center gap-2 cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-slate-900 border-slate-700 hover:bg-slate-800 text-white'
                    : 'bg-white border-slate-300 hover:bg-slate-100 text-slate-800 shadow-sm'
                }`}
              >
                <LogIn className="w-4 h-4 text-orange-500" />
                <span>{isHindi ? 'मुफ़्त खाता बनाएं' : 'Create Free Account'}</span>
              </button>
            )}
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
            <div className={`p-3.5 rounded-xl border ${
              theme === 'dark' ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex items-center gap-2 text-xs font-bold text-orange-400 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>{isHindi ? '₹0 बजट आर्किटेक्चर' : '₹0 Budget Stack'}</span>
              </div>
              <p className={`text-[11px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                {isHindi ? 'Firebase Spark Free Tier पर पूरी तरह सुरक्षित' : 'Securely deployed on Firebase free tier'}
              </p>
            </div>

            <div className={`p-3.5 rounded-xl border ${
              theme === 'dark' ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex items-center gap-2 text-xs font-bold text-purple-400 mb-1">
                <Lock className="w-4 h-4" />
                <span>{isHindi ? 'पूर्ण गोपनीयता (Dil Se)' : 'Total Privacy'}</span>
              </div>
              <p className={`text-[11px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                {isHindi ? 'असली पहचान छिपाकर दिल की बातें लिखें' : 'Masked identities for authentic confessions'}
              </p>
            </div>

            <div className={`p-3.5 rounded-xl border ${
              theme === 'dark' ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1">
                <GraduationCap className="w-4 h-4" />
                <span>{isHindi ? 'हुनर (Skill Swap)' : 'Hunar Skills'}</span>
              </div>
              <p className={`text-[11px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                {isHindi ? 'कोडिंग, गिटार, कुकिंग सीखें और सिखाएं' : 'Learn guitar, coding, cooking from peers'}
              </p>
            </div>

            <div className={`p-3.5 rounded-xl border ${
              theme === 'dark' ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400 mb-1">
                <Smartphone className="w-4 h-4" />
                <span>{isHindi ? 'Android PWA रेडी' : 'Android PWA Ready'}</span>
              </div>
              <p className={`text-[11px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                {isHindi ? 'मोबाइल होम-स्क्रीन पर बिना ऐप स्टोर के इंस्टॉल' : 'Instant install right from Chrome'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Mobile Device Mockup Preview Section */}
      <section id="preview" className={`py-16 border-b transition-colors ${
        theme === 'dark' ? 'bg-slate-950/60 border-slate-800/60' : 'bg-slate-100/70 border-slate-200'
      }`}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-xs font-bold tracking-wider text-orange-500 uppercase">
              {isHindi ? 'लाइव इंटरैक्टिव अनुभव' : 'Live Interactive Mockup'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-1">
              {isHindi ? 'मोबाइल स्क्रीन पर भारतकनेक्ट का जादू' : 'See BharatConnect in Action'}
            </h2>
            <p className={`text-xs sm:text-sm mt-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              {isHindi ? 'नीचे दिए गए टैब पर क्लिक करके अलग-अलग इनोवेटिव फीचर्स का प्रीव्यू देखें' : 'Click the tabs below to preview the mobile experience'}
            </p>
          </div>

          {/* Mockup Tabs */}
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            <button
              onClick={() => setPreviewTab('feed')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                previewTab === 'feed'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : theme === 'dark' ? 'bg-slate-900 text-slate-300 hover:bg-slate-800' : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              <span>📸</span>
              <span>{isHindi ? 'स्वदेशी फ़ीड' : 'Desi Feed'}</span>
            </button>

            <button
              onClick={() => setPreviewTab('hunar')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                previewTab === 'hunar'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : theme === 'dark' ? 'bg-slate-900 text-slate-300 hover:bg-slate-800' : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              <span>🎸</span>
              <span>{isHindi ? 'हुनर (Hunar)' : 'Hunar (Skills)'}</span>
            </button>

            <button
              onClick={() => setPreviewTab('dilse')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                previewTab === 'dilse'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                  : theme === 'dark' ? 'bg-slate-900 text-slate-300 hover:bg-slate-800' : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              <span>🔒</span>
              <span>{isHindi ? 'दिल से (Anonymous)' : 'Dil Se (Secret)'}</span>
            </button>

            <button
              onClick={() => setPreviewTab('awaaz')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                previewTab === 'awaaz'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : theme === 'dark' ? 'bg-slate-900 text-slate-300 hover:bg-slate-800' : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              <span>🎙️</span>
              <span>{isHindi ? 'आवाज़ (Audio)' : 'Awaaz (Audio)'}</span>
            </button>
          </div>

          {/* Centered Phone Frame */}
          <div className="max-w-[360px] mx-auto rounded-[36px] p-3 bg-slate-900 border-4 border-slate-700/80 shadow-2xl relative overflow-hidden">
            {/* Camera notch */}
            <div className="w-24 h-4 bg-slate-950 rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-800" />
            </div>

            {/* Simulated Phone Screen */}
            <div className={`rounded-[28px] overflow-hidden min-h-[460px] flex flex-col justify-between p-3.5 ${
              theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
            }`}>
              {/* Mockup Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/40 text-xs">
                <span className="font-bold flex items-center gap-1">
                  <span className="text-orange-500">Bharat</span>Connect
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-bold">
                  {previewTab.toUpperCase()}
                </span>
              </div>

              {/* Dynamic Content inside mockup */}
              <div className="my-auto py-2">
                {previewTab === 'feed' && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs">
                      <img 
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                        alt="User" 
                        className="w-7 h-7 rounded-full object-cover border border-orange-500"
                      />
                      <div>
                        <p className="font-bold text-xs">आरव शर्मा</p>
                        <p className="text-[10px] text-slate-400">वाराणसी घाट, यूपी</p>
                      </div>
                    </div>
                    <div className="rounded-xl overflow-hidden aspect-video relative">
                      <img 
                        src="https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&auto=format&fit=crop&q=80" 
                        alt="Indian heritage" 
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 rounded text-[9px] text-white">#IncredibleIndia</span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1">
                      <div className="flex items-center gap-3">
                        <span className="text-rose-500 font-bold flex items-center gap-1">❤️ 2.4k</span>
                        <span className="text-slate-400 flex items-center gap-1">💬 142</span>
                      </div>
                      <span className="text-orange-400 text-[11px] font-medium">शेयर करें</span>
                    </div>
                  </div>
                )}

                {previewTab === 'hunar' && (
                  <div className="space-y-3 bg-slate-900/50 p-3 rounded-2xl border border-emerald-500/30">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        🎸 गिटार व संगीत · प्रो
                      </span>
                      <span className="text-[10px] text-slate-400">फ्री स्वैप</span>
                    </div>
                    <h3 className="font-bold text-xs text-white">
                      "मैं आपको 7 दिनों में भारतीय शास्त्रीय और बॉलीवुड कॉर्ड्स सिखा सकता हूँ!"
                    </h3>
                    <p className="text-[11px] text-slate-300">
                      बदले में मुझे बेसिक Python कोडिंग सीखनी है।
                    </p>
                    <button 
                      onClick={() => setActiveTab('hunar')}
                      className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm"
                    >
                      <span>सीखना चाहता हूँ (Learn This)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {previewTab === 'dilse' && (
                  <div className="space-y-3 bg-purple-950/40 p-3.5 rounded-2xl border border-purple-500/40">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center text-xs">
                        🔒
                      </div>
                      <div>
                        <p className="font-bold text-xs text-purple-200">गुप्त नागरिक (Anonymous)</p>
                        <p className="text-[10px] text-purple-300/70">दिल से · 10 मिनट पहले</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-200 italic leading-relaxed">
                      "कॉलेज प्लेसमेंट का बहुत तनाव है। परिवार को नहीं बता सकता क्योंकि वे चिंतित हो जाएंगे। बस यहाँ लिखना चाहता था..."
                    </p>
                    <div className="flex items-center gap-2 pt-1 border-t border-purple-500/20 text-[10px] text-purple-300">
                      <span>🤍 84 लोगों ने सहानुभूति जताई</span>
                      <span>·</span>
                      <span>💬 29 मददगार टिप्पणियां</span>
                    </div>
                  </div>
                )}

                {previewTab === 'awaaz' && (
                  <div className="space-y-3 bg-amber-950/30 p-3.5 rounded-2xl border border-amber-500/40">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center text-sm">
                        🎙️
                      </div>
                      <div>
                        <p className="font-bold text-xs text-amber-200">काव्य व शायरी (Awaaz)</p>
                        <p className="text-[10px] text-amber-300/80">0:45 ऑडियो · रिकॉर्ड की गई आवाज़</p>
                      </div>
                    </div>
                    <div className="h-6 flex items-center gap-1 px-2 bg-slate-900 rounded-lg">
                      <div className="w-1.5 h-3 bg-amber-400 rounded-full animate-bounce" />
                      <div className="w-1.5 h-5 bg-amber-400 rounded-full animate-bounce [animation-delay:100ms]" />
                      <div className="w-1.5 h-2 bg-amber-400 rounded-full" />
                      <div className="w-1.5 h-4 bg-amber-400 rounded-full animate-bounce [animation-delay:200ms]" />
                      <div className="w-1.5 h-6 bg-amber-400 rounded-full animate-bounce [animation-delay:300ms]" />
                      <div className="flex-1 ml-2 text-[10px] text-slate-400">प्ले करें ▶</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mockup Bottom Navigation */}
              <div className="pt-2 border-t border-slate-800/40 flex items-center justify-around text-slate-400 text-xs">
                <span className={previewTab === 'feed' ? 'text-orange-500 font-bold' : ''}>🏠 होम</span>
                <span className={previewTab === 'hunar' ? 'text-emerald-400 font-bold' : ''}>🎸 हुनर</span>
                <span className={previewTab === 'dilse' ? 'text-purple-400 font-bold' : ''}>🔒 दिल से</span>
                <span>👤 प्रोफ़ाइल</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Innovations Section */}
      <section id="innovations" className="py-16 border-b border-slate-800/40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-wider text-orange-500 uppercase">
              {isHindi ? 'विशेष नवाचार' : 'Groundbreaking Innovations'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black mt-2">
              {isHindi ? 'भारतकनेक्ट अन्य सोशल मीडिया से अलग क्यों है?' : 'Why BharatConnect is Different'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1: Hunar */}
            <div className={`p-6 rounded-3xl border transition-all duration-300 hover:scale-[1.02] ${
              theme === 'dark' 
                ? 'bg-slate-900/50 border-emerald-500/30 hover:border-emerald-500/60' 
                : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
            }`}>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-5">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] mb-2 uppercase">
                {isHindi ? 'स्किल एक्सचेंज' : 'Skill Swap'}
              </div>
              <h3 className="text-lg font-bold mb-2">
                {isHindi ? 'हुनर (Hunar) - सोशल लर्निंग' : 'Hunar (Skill Learning)'}
              </h3>
              <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                {isHindi 
                  ? 'सिर्फ फोटो लाइक करने के बजाय एक-दूसरे से कौशल सीखें। कोडिंग, पेंटिंग, गिटार या कुकिंग पोस्ट करें और "Learn This" से सीधे मेंटर से जुड़ें।'
                  : 'Swap real skills with creators. Post short guides or tutorials and connect directly to learn or teach.'}
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800/40 flex items-center justify-between text-xs font-semibold text-emerald-400">
                <span>Firestore 'hunar_posts'</span>
                <span className="cursor-pointer" onClick={() => setActiveTab('hunar')}>देखें →</span>
              </div>
            </div>

            {/* Feature 2: Dil Se */}
            <div className={`p-6 rounded-3xl border transition-all duration-300 hover:scale-[1.02] ${
              theme === 'dark' 
                ? 'bg-slate-900/50 border-purple-500/30 hover:border-purple-500/60' 
                : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
            }`}>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-5">
                <EyeOff className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-bold text-[10px] mb-2 uppercase">
                {isHindi ? 'एनोनिमस सेफ़ स्पेस' : 'Anonymous Safe Space'}
              </div>
              <h3 className="text-lg font-bold mb-2">
                {isHindi ? 'दिल से (Dil Se) - एनोनिमस बातें' : 'Dil Se (Safe Confessions)'}
              </h3>
              <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                {isHindi 
                  ? 'सोशल मीडिया के दिखावे से दूर, बिना नाम व फोटो उजागर किए अपनी सच्ची बातें, सवाल या मेंटल हेल्थ शेयर करें। आपकी पहचान 100% सुरक्षित रहती है।'
                  : 'Share unfiltered thoughts, life struggles, and questions completely anonymously with zero judgment.'}
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800/40 flex items-center justify-between text-xs font-semibold text-purple-400">
                <span>Firestore 'anonymous_posts'</span>
                <span className="cursor-pointer" onClick={() => setActiveTab('create')}>शेयर करें →</span>
              </div>
            </div>

            {/* Feature 3: Awaaz & Sthaan */}
            <div className={`p-6 rounded-3xl border transition-all duration-300 hover:scale-[1.02] ${
              theme === 'dark' 
                ? 'bg-slate-900/50 border-amber-500/30 hover:border-amber-500/60' 
                : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
            }`}>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-5">
                <Mic className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[10px] mb-2 uppercase">
                {isHindi ? 'ऑडियो व स्थानीय अपडेट्स' : 'Voice & Hyperlocal'}
              </div>
              <h3 className="text-lg font-bold mb-2">
                {isHindi ? 'आवाज़ (Awaaz) व स्थान (Sthaan)' : 'Awaaz Audio & Local Updates'}
              </h3>
              <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                {isHindi 
                  ? 'अपनी आवाज़ में कविता, शायरी या विचार सीधे रिकॉर्ड करें। साथ ही अपने शहर और मोहल्ले के लाइव इवेंट्स व ट्रैफिक अपडेट्स शेयर करें।'
                  : 'Record high quality audio voice notes, recite poetry, or share hyperlocal live alerts for your city.'}
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800/40 flex items-center justify-between text-xs font-semibold text-amber-400">
                <span>ऑडियो प्लेयर व मैप्स</span>
                <span className="cursor-pointer" onClick={() => setActiveTab('home')}>सुनें →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className={`py-16 border-b transition-colors ${
        theme === 'dark' ? 'bg-slate-950/40 border-slate-800/40' : 'bg-slate-100/50 border-slate-200'
      }`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-wider text-orange-500 uppercase">
              {isHindi ? 'सोशल टूल्स' : 'Platform Capabilities'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-2">
              {isHindi ? 'एक ही ऐप में सब कुछ' : 'Everything in One Cohesive Space'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
              theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold mb-1">{isHindi ? 'फ़ॉलो व क्रिएटर नेटवर्क' : 'Follow & Creator Network'}</h4>
                <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  {isHindi ? 'अपने पसंदीदा लेखकों, गायकों और विचारकों को एक क्लिक में फ़ॉलो करें।' : 'Follow peers and favorite creators with instant updates.'}
                </p>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
              theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold mb-1">{isHindi ? '1-on-1 डायरेक्ट इनबॉक्स' : 'Real-time Direct Inbox'}</h4>
                <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  {isHindi ? 'निजी संदेश और सीखने के लिए सीधी सुरक्षित बातचीत।' : 'Direct messages and real-time skill inquiries.'}
                </p>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
              theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold mb-1">{isHindi ? 'लाइक, कमेंट्स व सेव' : 'Likes, Comments & Bookmarks'}</h4>
                <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  {isHindi ? 'पसंदीदा पोस्ट्स को सेव करें और भारतीय भाषाओं में कमेंट करें।' : 'Interact with posts and bookmark valuable guides.'}
                </p>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
              theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <Feather className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold mb-1">{isHindi ? 'भारतीय भाषाएँ व लिपि' : 'Multi-Indian Languages'}</h4>
                <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  {isHindi ? 'हिंदी, अंग्रेज़ी, गुजराती, मराठी, तमिल और बांग्ला समर्थन।' : 'Native support for Hindi, English, Gujarati, Tamil and more.'}
                </p>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
              theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold mb-1">{isHindi ? 'डार्क व लाइट थीम' : 'Dark & Light Mode'}</h4>
                <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  {isHindi ? 'आँखों को सुकून देने वाला डार्क मोड और साफ़-सुथरा लाइट मोड।' : 'Seamless switching with your local preference remembered.'}
                </p>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
              theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold mb-1">{isHindi ? 'कंटेंट मॉडरेशन व सुरक्षा' : 'Safety & Content Moderation'}</h4>
                <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  {isHindi ? 'अनुचित सामग्री की रिपोर्टिंग और एडमिन मॉडरेशन पैनल।' : 'Report abusive content with instant community moderation.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) Section */}
      <section id="faq" className="py-16 border-b border-slate-800/40">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-xs font-bold tracking-wider text-orange-500 uppercase">
              FAQ
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-1">
              {isHindi ? 'अक्सर पूछे जाने वाले सवाल' : 'Frequently Asked Questions'}
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className={`rounded-2xl border transition-all ${
                    isOpen 
                      ? theme === 'dark' ? 'bg-slate-900 border-orange-500/40' : 'bg-white border-orange-300 shadow-sm'
                      : theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white/80 border-slate-200'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-sm cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="text-orange-500 shrink-0">
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className={`px-4 pb-4 pt-1 text-xs leading-relaxed ${
                      theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-tr from-orange-500/10 via-amber-500/10 to-emerald-500/10 border border-orange-500/30 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center mx-auto mb-4 font-black shadow-lg shadow-orange-500/30">
              🇮🇳
            </div>
            <h2 className="text-2xl sm:text-4xl font-black mb-3">
              {isHindi ? 'आज ही भारतकनेक्ट से जुड़ें' : 'Join BharatConnect Today'}
            </h2>
            <p className={`text-xs sm:text-sm max-w-xl mx-auto mb-6 ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {isHindi 
                ? 'भारत का अपना स्वदेशी सोशल मीडिया अनुभव करने के लिए एक क्लिक करें। कोई लंबा फॉर्म नहीं, कोई शुल्क नहीं।'
                : 'Experience the modern Indian social platform with one simple click. No credit cards, no cost.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setActiveTab('home')}
                className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-500/25 transition active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>{isHindi ? 'ऐप में प्रवेश करें' : 'Enter Social App'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className={`py-8 border-t text-center text-xs transition-colors ${
        theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
      }`}>
        <div className="max-w-5xl mx-auto px-4 space-y-4">
          <div className="flex items-center justify-center gap-2 font-bold text-sm">
            <span className="text-orange-500">BharatConnect</span>
            <span>·</span>
            <span>भारत का अपना सोशल मीडिया 🇮🇳</span>
          </div>
          <p className="text-[11px] max-w-md mx-auto text-slate-500">
            {isHindi 
              ? 'बजट ₹0 | Firebase Firestore और Auth द्वारा सुरक्षित | गोपनीयता व स्वदेशी तकनीक का संगम'
              : 'Built for India | ₹0 budget Spark Tier | Firestore & Auth Secured'}
          </p>
          <div className="flex items-center justify-center gap-4 text-[11px] pt-2">
            <button onClick={() => setActiveTab('home')} className="hover:text-orange-500">
              {isHindi ? 'होम फ़ीड' : 'Home Feed'}
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('hunar')} className="hover:text-orange-500">
              {isHindi ? 'हुनर (Hunar)' : 'Hunar Skills'}
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('admin')} className="hover:text-orange-500">
              {isHindi ? 'मॉडरेशन' : 'Moderation'}
            </button>
          </div>
          <p className="text-[10px] text-slate-500">
            © {new Date().getFullYear()} BharatConnect. Made with pride in India.
          </p>
        </div>
      </footer>
    </div>
  );
};
