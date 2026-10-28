import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  DollarSign, 
  BarChart2, 
  Globe, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  CheckCircle,
  Shield,
  ArrowLeft,
  X
} from 'lucide-react';
import { useBharatConnect } from '../../context/BharatConnectContext';

export default function UpgradedBharatConnect() {
  const { openSOSModal, setToastMessage, setActiveTab: setGlobalActiveTab } = useBharatConnect();

  // State Management for Upgrades
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [audioProgress, setAudioProgress] = useState(30); // in percentage
  
  // Tipping State
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipAmount, setTipAmount] = useState(50);
  const [customTip, setCustomTip] = useState('');
  const [tipSuccess, setTipSuccess] = useState(false);

  // Social Interaction States
  const [likeCount, setLikeCount] = useState(142);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [commentCount, setCommentCount] = useState(28);

  // Language State
  const [currentLang, setCurrentLang] = useState<'HI' | 'EN' | 'GU' | 'MR'>('HI'); // HI, EN, GU, MR

  // Analytics Tab State
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Timer Ref for Audio progress simulation
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Toggle Playback Speed
  const toggleSpeed = () => {
    setPlaybackSpeed(prev => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1));
  };

  // Audio Playback Timer
  useEffect(() => {
    if (isPlaying) {
      const step = 1.5 * playbackSpeed;
      progressTimerRef.current = setInterval(() => {
        setAudioProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return Math.min(100, prev + step);
        });
      }, 500);
    } else {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    }

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isPlaying, playbackSpeed]);

  const handleSendTip = () => {
    setTipSuccess(true);
    const amount = customTip ? Number(customTip) : tipAmount;
    if (setToastMessage) {
      setToastMessage(`₹${amount} की टिप सफलतापूर्वक भेजी गई! 🎁`);
    }
    setTimeout(() => {
      setTipSuccess(false);
      setShowTipModal(false);
      setCustomTip('');
    }, 2000);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `🇮🇳 BharatConnect v2.1\n` +
      `राहुल शर्मा का ऑडियो दोहा: "गुरु गोविंद दोउ खड़े, काके लागू पांय..."\n\n` +
      `🔗 अभी सुनें: https://ais-pre-danma7ku6sq7x5cjtay4sj-37858070369.asia-northeast1.run.app\n` +
      `#BharatConnect #Awaaz #MadeInIndia`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    if (setToastMessage) setToastMessage('व्हाट्सएप शेयर लिंक कॉपी किया गया!');
  };

  const toggleLike = () => {
    setIsLiked(prev => !prev);
    setLikeCount(prev => (isLiked ? prev - 1 : prev + 1));
  };

  const toggleBookmark = () => {
    setIsBookmarked(prev => !prev);
    if (setToastMessage) {
      setToastMessage(!isBookmarked ? 'बुकमार्क में सहेजा गया 🔖' : 'बुकमार्क से हटाया गया');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-slate-900 text-white min-h-screen font-sans pb-20 shadow-2xl relative overflow-hidden border-x border-slate-800">
      
      {/* Top Header with Language & Analytics Switch */}
      <header className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-900/80 sticky top-0 z-50 backdrop-blur">
        <div className="flex items-center space-x-2">
          <span className="bg-orange-500 text-xs px-2 py-1 rounded font-bold text-slate-950">BC v2.1</span>
          <h1 className="font-bold text-lg tracking-wide text-orange-400">BharatConnect</h1>
        </div>

        <div className="flex items-center space-x-2">
          {/* Bharat Sahara SOS button */}
          <button
            onClick={openSOSModal}
            className="flex items-center gap-1 bg-red-600/20 text-red-400 px-2 py-1 rounded-full text-xs border border-red-500/40 hover:bg-red-600/30 transition font-bold"
            title="Bharat SOS"
          >
            <Shield size={12} className="text-red-400" />
            <span>SOS</span>
          </button>

          {/* Multilingual Toggle */}
          <button 
            onClick={() => setCurrentLang(currentLang === 'HI' ? 'EN' : currentLang === 'EN' ? 'GU' : currentLang === 'GU' ? 'MR' : 'HI')}
            className="flex items-center space-x-1 bg-slate-800 px-2.5 py-1 rounded-full text-xs border border-slate-700 hover:bg-slate-700 transition cursor-pointer"
            title="भाषा स्विच करें"
          >
            <Globe size={14} className="text-orange-400" />
            <span>{currentLang}</span>
          </button>

          {/* Analytics Toggle Button */}
          <button 
            onClick={() => setShowAnalytics(!showAnalytics)}
            className={`p-1.5 rounded-full border transition cursor-pointer ${showAnalytics ? 'bg-orange-500 text-slate-950 border-orange-400' : 'bg-slate-800 border-slate-700 text-orange-400 hover:bg-slate-700'}`}
            title="Creator Analytics"
          >
            <BarChart2 size={18} />
          </button>

          {/* Return to Portal Button */}
          <button
            onClick={() => setGlobalActiveTab('home')}
            className="text-[10px] bg-slate-800 border border-slate-700 px-2 py-1 rounded-md text-slate-300 hover:text-white transition cursor-pointer"
            title="पोर्टल व्यू पर लौटें"
          >
            पोर्टल ↗
          </button>
        </div>
      </header>

      {/* Analytics Modal / View Overlay */}
      {showAnalytics && (
        <div className="bg-slate-800 p-4 m-4 rounded-xl border border-orange-500/30 animate-fadeIn shadow-xl">
          <h3 className="text-sm font-semibold text-orange-400 mb-2 flex items-center justify-between">
            <span>📊 क्रिएटर एनालिटिक्स डैशबोर्ड</span>
            <button onClick={() => setShowAnalytics(false)} className="text-xs text-slate-400 hover:text-white p-1">
              ✕ बंद करें
            </button>
          </h3>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <p className="text-[11px] text-slate-400">कुल रीच</p>
              <p className="font-bold text-sm text-green-400">45.2K</p>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <p className="text-[11px] text-slate-400">टिपिंग अर्निंग</p>
              <p className="font-bold text-sm text-yellow-400">₹1,250</p>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <p className="text-[11px] text-slate-400">एंगेजमेंट</p>
              <p className="font-bold text-sm text-blue-400">8.4%</p>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-700/50 flex justify-between text-[10px] text-slate-400">
            <span>शीर्ष दर्शक: उत्तर प्रदेश, दिल्ली, महाराष्ट्र</span>
            <span className="text-orange-400 font-semibold">5% प्लेटफ़ॉर्म शुल्क</span>
          </div>
        </div>
      )}

      {/* Feed Content: Upgraded Audio Player (Awaaz Component) */}
      <div className="p-4 space-y-4">
        
        {/* Post 1: Upgraded Audio Player */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 shadow-lg">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-gradient-to-tr from-orange-500 to-amber-400 rounded-full flex items-center justify-center font-bold text-sm text-slate-950">
                RS
              </div>
              <div>
                <p className="text-sm font-semibold flex items-center">
                  राहुल शर्मा <CheckCircle size={14} className="text-blue-400 ml-1 fill-blue-400/20" />
                </p>
                <p className="text-[10px] text-slate-400">नई दिल्ली • अभी-अभी</p>
              </div>
            </div>
            
            {/* Tipping Trigger Button */}
            <button 
              onClick={() => setShowTipModal(true)}
              className="flex items-center space-x-1 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 px-3 py-1 rounded-full text-xs font-bold shadow hover:opacity-95 transition cursor-pointer"
            >
              <DollarSign size={13} />
              <span>टिप दें</span>
            </button>
          </div>

          {/* Audio Waveform Card */}
          <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-700/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-orange-400 font-medium flex items-center gap-1">
                🎙️ आवाज़ (Awaaz Audio) - कबीर दोहा
              </span>
              <button 
                onClick={toggleSpeed}
                className="text-[10px] bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-slate-300 hover:bg-slate-700 cursor-pointer"
                title="प्लेबैक स्पीड बदलें"
              >
                स्पीड: {playbackSpeed}x
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-slate-950 shadow hover:bg-orange-400 transition cursor-pointer hover:scale-105 active:scale-95"
              >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
              </button>
              
              {/* Interactive Seek Bar / Waveform Simulation */}
              <div className="flex-1 space-y-1">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={audioProgress} 
                  onChange={(e) => setAudioProgress(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0:{Math.floor((audioProgress / 100) * 30).toString().padStart(2, '0')}</span>
                  <span>0:30</span>
                </div>
              </div>
            </div>

            <p className="text-xs italic text-slate-300 mt-3 text-center leading-relaxed">
              "गुरु गोविंद दोउ खड़े, काके लागू पांय। बलिहारी गुरु आपनो, जिन गोविंद दियो बताय॥ 🙏"
            </p>
          </div>

          {/* Social Interactions Bar */}
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-700/50 text-slate-400">
            <button onClick={toggleLike} className="flex items-center space-x-1 hover:text-red-500 text-xs cursor-pointer">
              <Heart size={16} className={isLiked ? "text-red-500 fill-red-500 scale-110 transition-transform" : "transition-transform"} /> 
              <span>{likeCount}</span>
            </button>
            <button onClick={() => setCommentCount(c => c + 1)} className="flex items-center space-x-1 hover:text-blue-400 text-xs cursor-pointer">
              <MessageCircle size={16} /> <span>{commentCount}</span>
            </button>
            <button onClick={handleWhatsAppShare} className="flex items-center space-x-1 hover:text-green-400 text-xs cursor-pointer" title="WhatsApp Share">
              <Share2 size={16} /> <span>शेयर</span>
            </button>
            <button onClick={toggleBookmark} className="hover:text-orange-400 cursor-pointer">
              <Bookmark size={16} className={isBookmarked ? "text-orange-400 fill-orange-400" : ""} />
            </button>
          </div>
        </div>

        {/* Post 2: Visual Railway Post */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 shadow-lg">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full flex items-center justify-center font-bold text-sm text-slate-950">
                RA
              </div>
              <div>
                <p className="text-sm font-semibold flex items-center">
                  railway_shayar_aman <CheckCircle size={14} className="text-blue-400 ml-1 fill-blue-400/20" />
                </p>
                <p className="text-[10px] text-slate-400">नई दिल्ली रेलवे स्टेशन • 10 मिनट पहले</p>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
              #IndianRailways
            </span>
          </div>

          <div className="rounded-xl overflow-hidden mb-3 border border-slate-700/60 relative">
            <img 
              src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&auto=format&fit=crop&q=80" 
              alt="Train" 
              className="w-full h-48 object-cover"
            />
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-orange-400 border border-orange-500/30">
              BharatConnect @railwayshayaraman
            </div>
          </div>

          <p className="text-xs text-slate-200 mb-3">
            भारतीय रेल की भव्यता! WAP-7 लोकोमोटिव शाम के समय अपनी स्वर्णिम यात्रा पर। 🚆🇮🇳
          </p>

          <div className="flex justify-between items-center pt-3 border-t border-slate-700/50 text-slate-400 text-xs">
            <span className="flex items-center gap-1 text-red-400">
              <Heart size={14} fill="currentColor" /> 1,289
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <MessageCircle size={14} /> 112 टिप्पणियाँ
            </span>
            <button onClick={handleWhatsAppShare} className="text-green-400 hover:underline">
              शेयर करें →
            </button>
          </div>
        </div>
      </div>

      {/* Upgraded Custom Tipping Modal */}
      {showTipModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 w-full max-w-xs space-y-4 shadow-2xl animate-scaleUp">
            {tipSuccess ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle size={48} className="text-green-500 mx-auto animate-bounce" />
                <h3 className="font-bold text-lg text-white">धन्यवाद! टिप सफलतापूर्वक भेज दी गई है।</h3>
                <p className="text-xs text-slate-300">क्रिएटर को आपकी आर्थिक सहायता पहुँच गई है।</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-orange-400">डिजिटल टिपिंग (Digital Tipping)</h3>
                  <button onClick={() => setShowTipModal(false)} className="text-slate-400 hover:text-white text-xs p-1">✕</button>
                </div>
                <p className="text-xs text-slate-300">कारीगर राहुल शर्मा को सीधे आर्थिक सहयोग दें (5% प्लेटफॉर्म शुल्क)।</p>
                
                <div className="grid grid-cols-4 gap-2">
                  {[10, 50, 100, 500].map((amt) => (
                    <button 
                      key={amt}
                      onClick={() => { setTipAmount(amt); setCustomTip(''); }}
                      className={`py-2 rounded-lg text-xs font-bold border transition cursor-pointer ${tipAmount === amt && !customTip ? 'bg-orange-500 border-orange-400 text-slate-950 shadow-md' : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-850'}`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>

                {/* Custom Amount Field */}
                <div>
                  <input 
                    type="number"
                    placeholder="अन्य राशि दर्ज करें (Custom Amount)"
                    value={customTip}
                    onChange={(e) => { setCustomTip(e.target.value); setTipAmount(0); }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="text-[10px] text-slate-400 flex justify-between px-1">
                  <span>नेट क्रिएटर शेयर: {customTip ? `₹${(Number(customTip) * 0.95).toFixed(1)}` : `₹${(tipAmount * 0.95).toFixed(1)}`}</span>
                  <span>सुरक्षित UPI पेमेंट 🔒</span>
                </div>

                <button 
                  onClick={handleSendTip}
                  disabled={!customTip && !tipAmount}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs shadow-lg hover:opacity-95 transition cursor-pointer disabled:opacity-50"
                >
                  UPI के माध्यम से भेजें {customTip ? `₹${customTip}` : `₹${tipAmount}`}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-900/95 border-t border-slate-800 px-4 py-2 flex justify-around items-center z-40 backdrop-blur">
        <button 
          onClick={() => setGlobalActiveTab('home')}
          className="flex flex-col items-center text-orange-500 text-[10px] cursor-pointer"
        >
          <span className="text-lg">🏠</span> होम
        </button>
        <button 
          onClick={() => setGlobalActiveTab('hunar')}
          className="flex flex-col items-center text-slate-400 text-[10px] hover:text-white cursor-pointer"
        >
          <span className="text-lg">🎨</span> हुनर
        </button>
        <button 
          onClick={() => setGlobalActiveTab('create')}
          className="bg-orange-500 text-slate-950 w-11 h-11 rounded-full flex items-center justify-center shadow-lg -mt-4 hover:scale-105 active:scale-95 transition cursor-pointer font-bold text-2xl"
          title="नई पोस्ट बनाएं"
        >
          +
        </button>
        <button 
          onClick={() => setGlobalActiveTab('reels')}
          className="flex flex-col items-center text-slate-400 text-[10px] hover:text-white cursor-pointer"
        >
          <span className="text-lg">🎬</span> रील्स
        </button>
        <button 
          onClick={() => setGlobalActiveTab('profile')}
          className="flex flex-col items-center text-slate-400 text-[10px] hover:text-white cursor-pointer"
        >
          <span className="text-lg">👤</span> प्रोफ़ाइल
        </button>
      </nav>

    </div>
  );
}
