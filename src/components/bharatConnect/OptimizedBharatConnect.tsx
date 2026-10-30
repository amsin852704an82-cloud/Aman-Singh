import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  DollarSign, 
  Globe, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  CheckCircle, 
  Sparkles,
  Shield,
  Film,
  User,
  Plus
} from 'lucide-react';
import { useBharatConnect } from '../../context/BharatConnectContext';
import { useAuth } from '../../context/AuthContext';
import { Post as FirestorePost } from '../../types/bharatConnect';

// पोस्ट डेटा इंटरफेस
interface Post {
  id: string;
  username: string;
  location: string;
  audioUrl?: string;
  caption: string;
  likes: number;
  commentsCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  timeAgo?: string;
}

export default function OptimizedBharatConnect() {
  const { openSOSModal, setToastMessage, setActiveTab: setGlobalActiveTab, posts: globalPosts } = useBharatConnect();
  const { user: firebaseAuthUser } = useAuth();

  // स्टेट मैनेजमेंट
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      username: 'राहुल शर्मा',
      location: 'नई दिल्ली',
      audioUrl: 'sample_audio.mp3',
      caption: 'गुरु गोविंद दोउ खड़े, काके लागू पांय...',
      likes: 142,
      commentsCount: 28,
      timeAgo: 'अभी-अभी'
    },
    {
      id: '2',
      username: 'अमित कुमार',
      location: 'वाराणसी',
      caption: 'हाथकरघा और पारंपरिक भारतीय हस्तशिल्प का प्रदर्शन। #Hunar #MakeInIndia',
      likes: 310,
      commentsCount: 45,
      timeAgo: '2 घंटे पहले'
    }
  ]);

  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // टिपिंग स्टेट
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipAmount, setTipAmount] = useState(50);
  const [customTip, setCustomTip] = useState('');
  const [tipSuccess, setTipSuccess] = useState(false);
  const [selectedCreatorName, setSelectedCreatorName] = useState('राहुल शर्मा');

  // भाषा और नेविगेशन टैब स्टेट
  const [currentLang, setCurrentLang] = useState<'HI' | 'EN' | 'GU' | 'MR'>('HI');
  const [activeTab, setActiveTab] = useState<'home' | 'hunar' | 'reels' | 'profile'>('home');

  // सिंक विद ग्लोबल कॉन्टेक्स्ट पोस्ट्स (Shared real-time post state)
  useEffect(() => {
    if (globalPosts && globalPosts.length > 0) {
      const mapped: Post[] = globalPosts.map(fp => ({
        id: fp.id || fp.postId || String(Math.random()),
        username: fp.author?.name || fp.authorName || 'भारत नागरिक',
        location: fp.locationName || 'भारत',
        audioUrl: fp.audioURL || undefined,
        caption: fp.caption || fp.text || '',
        likes: fp.likesCount || fp.likeCount || 0,
        commentsCount: fp.commentsCount || (Array.isArray(fp.comments) ? fp.comments.length : 0),
        timeAgo: fp.createdAt || 'कुछ समय पहले'
      }));

      setPosts(prev => {
        const ids = new Set(mapped.map(m => m.id));
        const uniques = prev.filter(p => !ids.has(p.id));
        return [...mapped, ...uniques];
      });
    }
  }, [globalPosts]);

  // परफॉर्मेंस ऑप्टिमाइजेशन: जब यूजर फीड में स्क्रॉल करे, तो ऑडियो प्लेबैक अपने आप पॉज़ हो जाए ताकि डेटा और बैटरी बचे
  useEffect(() => {
    const handleScroll = () => {
      if (isPlaying) {
        setIsPlaying(false);
        setActiveAudioId(null);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPlaying]);

  // ऑडियो प्रोग्रेस टाइमर
  useEffect(() => {
    if (isPlaying && activeAudioId) {
      const step = 3.3 * playbackSpeed;
      audioIntervalRef.current = setInterval(() => {
        setAudioProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            setActiveAudioId(null);
            return 0;
          }
          return Math.min(100, prev + step);
        });
      }, 1000);
    } else {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    }

    return () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
  }, [isPlaying, activeAudioId, playbackSpeed]);

  const toggleAudio = (id: string) => {
    if (activeAudioId === id) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveAudioId(id);
      setIsPlaying(true);
      setAudioProgress(0);
    }
  };

  const toggleLike = (id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        const isNowLiked = !p.isLiked;
        return {
          ...p,
          isLiked: isNowLiked,
          likes: isNowLiked ? p.likes + 1 : Math.max(0, p.likes - 1)
        };
      }
      return p;
    }));
  };

  const toggleBookmark = (id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        const isNowBookmarked = !p.isBookmarked;
        if (setToastMessage) {
          setToastMessage(isNowBookmarked ? 'पोस्ट सहेजी गई (Saved) 🔖' : 'बुकमार्क से हटाया गया');
        }
        return { ...p, isBookmarked: isNowBookmarked };
      }
      return p;
    }));
  };

  const handleShare = (post: Post) => {
    const text = encodeURIComponent(
      `🇮🇳 BharatConnect ⚡\n` +
      `${post.username} की पोस्ट: "${post.caption}"\n\n` +
      `🔗 देखें: https://ais-pre-danma7ku6sq7x5cjtay4sj-37858070369.asia-northeast1.run.app\n` +
      `#BharatConnect #MakeInIndia`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    if (setToastMessage) setToastMessage('व्हाट्सएप शेयर लिंक तैयार है!');
  };

  const handleSendTip = () => {
    setTipSuccess(true);
    const amt = customTip ? Number(customTip) : tipAmount;
    if (setToastMessage) {
      setToastMessage(`₹${amt} की टिप ${selectedCreatorName} को सफलतापूर्वक भेजी गई! 🎁`);
    }
    setTimeout(() => {
      setTipSuccess(false);
      setShowTipModal(false);
      setCustomTip('');
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto bg-slate-950 text-white min-h-screen font-sans pb-24 shadow-2xl relative overflow-hidden border-x border-slate-800">
      
      {/* टॉप हेडर */}
      <header className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-50 backdrop-blur">
        <div className="flex items-center space-x-2">
          <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 text-xs px-2.5 py-1 rounded-full font-extrabold shadow">
            BharatConnect ⚡
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* भारत सहारा SOS */}
          <button 
            onClick={openSOSModal} 
            className="flex items-center space-x-1 bg-red-600/20 text-red-400 px-2 py-1 rounded-full text-xs border border-red-500/40 hover:bg-red-600/30 transition font-bold"
            title="Bharat Sahara Emergency SOS"
          >
            <Shield size={12} className="text-red-400" />
            <span>SOS</span>
          </button>

          {/* बहुभाषी (Multilingual) टॉगल */}
          <button 
            onClick={() => setCurrentLang(currentLang === 'HI' ? 'EN' : currentLang === 'EN' ? 'GU' : currentLang === 'GU' ? 'MR' : 'HI')}
            className="flex items-center space-x-1 bg-slate-800 px-2.5 py-1 rounded-full text-xs border border-slate-700 hover:bg-slate-700 transition cursor-pointer"
            title="भाषा स्विच करें"
          >
            <Globe size={13} className="text-orange-400" />
            <span className="font-semibold">{currentLang}</span>
          </button>

          {/* पोर्टल पर वापसी */}
          <button
            onClick={() => setGlobalActiveTab('home')}
            className="text-[10px] bg-slate-800 border border-slate-700 px-2 py-1 rounded-md text-slate-300 hover:text-white transition cursor-pointer"
            title="पोर्टल व्यू पर लौटें"
          >
            पोर्टल ↗
          </button>
        </div>
      </header>

      {/* नेविगेशन टैब्स */}
      <div className="flex bg-slate-900/80 border-b border-slate-800 px-4 py-2 space-x-4 overflow-x-auto text-xs font-semibold">
        <button 
          onClick={() => setActiveTab('home')}
          className={`pb-1 border-b-2 transition cursor-pointer ${activeTab === 'home' ? 'border-orange-500 text-orange-400' : 'border-transparent text-slate-400'}`}
        >
          होम फीड
        </button>
        <button 
          onClick={() => setActiveTab('hunar')}
          className={`pb-1 border-b-2 transition flex items-center space-x-1 cursor-pointer ${activeTab === 'hunar' ? 'border-orange-500 text-orange-400' : 'border-transparent text-slate-400'}`}
        >
          <Sparkles size={12} /> <span>हुनर मार्केटप्लेस</span>
        </button>
        <button 
          onClick={() => setActiveTab('reels')}
          className={`pb-1 border-b-2 transition cursor-pointer ${activeTab === 'reels' ? 'border-orange-500 text-orange-400' : 'border-transparent text-slate-400'}`}
        >
          रील्स
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`pb-1 border-b-2 transition cursor-pointer ${activeTab === 'profile' ? 'border-orange-500 text-orange-400' : 'border-transparent text-slate-400'}`}
        >
          प्रोफ़ाइल
        </button>
      </div>

      {/* मुख्य कंटेंट एरिया */}
      <main className="p-4 space-y-4">
        {activeTab === 'home' && posts.map((post) => (
          <div key={post.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
            
            {/* यूजर इन्फो और टिपिंग बटन */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 bg-gradient-to-tr from-orange-500 to-amber-400 rounded-full flex items-center justify-center font-bold text-slate-950 text-sm">
                  {post.username.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold flex items-center text-slate-100">
                    {post.username} <CheckCircle size={14} className="text-blue-400 ml-1 fill-blue-400/20" />
                  </p>
                  <p className="text-[10px] text-slate-400">{post.location} • {post.timeAgo || 'Firebase Connected'}</p>
                </div>
              </div>

              <button 
                onClick={() => {
                  setSelectedCreatorName(post.username);
                  setShowTipModal(true);
                }}
                className="flex items-center space-x-1 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 px-3 py-1 rounded-full text-xs font-bold shadow hover:opacity-95 transition cursor-pointer"
              >
                <DollarSign size={13} />
                <span>टिप दें</span>
              </button>
            </div>

            {/* ऑडियो प्लेयर कॉम्पोनेंट */}
            {post.audioUrl && (
              <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-orange-400 font-medium">🎙️ आवाज़ (Awaaz Audio)</span>
                  <button 
                    onClick={() => setPlaybackSpeed(prev => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1))}
                    className="text-[10px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-300 cursor-pointer"
                  >
                    स्पीड: {playbackSpeed}x
                  </button>
                </div>

                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => toggleAudio(post.id)}
                    className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-slate-950 shadow hover:bg-orange-400 transition cursor-pointer hover:scale-105 active:scale-95"
                  >
                    {activeAudioId === post.id && isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                  </button>

                  <div className="flex-1 space-y-1">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={activeAudioId === post.id ? audioProgress : 0} 
                      onChange={(e) => setAudioProgress(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>0:{Math.floor(((activeAudioId === post.id ? audioProgress : 0) / 100) * 30).toString().padStart(2, '0')}</span>
                      <span>0:30</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs italic text-slate-300 mt-2 text-center">
                  "{post.caption}"
                </p>
              </div>
            )}

            {!post.audioUrl && (
              <p className="text-sm text-slate-200 leading-relaxed">{post.caption}</p>
            )}

            {/* इंटरैक्शन बार */}
            <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-slate-400 text-xs">
              <button onClick={() => toggleLike(post.id)} className="flex items-center space-x-1 hover:text-red-500 transition cursor-pointer">
                <Heart size={16} className={post.isLiked ? "text-red-500 fill-red-500 scale-110" : ""} /> 
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-blue-400 transition cursor-pointer">
                <MessageCircle size={16} /> <span>{post.commentsCount}</span>
              </button>
              <button onClick={() => handleShare(post)} className="flex items-center space-x-1 hover:text-green-400 transition cursor-pointer" title="WhatsApp Share">
                <Share2 size={16} /> <span>शेयर</span>
              </button>
              <button onClick={() => toggleBookmark(post.id)} className="hover:text-orange-400 transition cursor-pointer">
                <Bookmark size={16} className={post.isBookmarked ? "text-orange-400 fill-orange-400" : ""} />
              </button>
            </div>
          </div>
        ))}

        {activeTab === 'hunar' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center space-y-3">
            <Sparkles size={32} className="text-orange-400 mx-auto" />
            <h3 className="font-bold text-base text-white">हुनर मार्केटप्लेस (Hunar Hub)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              यहाँ स्थानीय कारीगर और कलाकार अपनी कला का प्रदर्शन कर सकते हैं और सीधे डिजिटल टिप प्राप्त कर सकते हैं।
            </p>
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              {['हस्तशिल्प', 'मिट्टी के बर्तन', 'पारंपरिक संगीत', 'स्थानीय व्यंजन'].map((cat, i) => (
                <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-left">
                  <p className="text-xs font-bold text-slate-200">{cat}</p>
                  <span className="text-[10px] text-orange-400">देखें →</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reels' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
            <Film size={36} className="text-orange-400 mx-auto animate-bounce" />
            <h3 className="font-bold text-base text-white">रील्स (Vertical Shorts)</h3>
            <p className="text-xs text-slate-400">क्षेत्रीय और भारतीय क्रिएटर्स की छोटी वीडियो यहाँ लोड हो रही हैं।</p>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 mx-auto p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center font-bold text-orange-400 text-lg">
                {firebaseAuthUser?.email?.charAt(0)?.toUpperCase() || 'R'}
              </div>
            </div>
            <h3 className="font-bold text-base text-white">{firebaseAuthUser?.displayName || 'राहुल शर्मा'}</h3>
            <p className="text-xs text-slate-400">{firebaseAuthUser?.email || 'as9621302122@gmail.com'}</p>
            <span className="inline-block px-2.5 py-0.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full text-xs font-semibold">
              वेरीफाइड सदस्य 🇮🇳
            </span>
          </div>
        )}
      </main>

      {/* डिजिटल टिपिंग मोडल */}
      {showTipModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 w-full max-w-xs space-y-4 shadow-2xl">
            {tipSuccess ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle size={48} className="text-green-500 mx-auto animate-bounce" />
                <h3 className="font-bold text-base text-white">टिप सफलतापूर्वक भेजी गई!</h3>
                <p className="text-xs text-slate-400">{selectedCreatorName} को आर्थिक सहयोग प्राप्त हुआ।</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-orange-400">डिजिटल टिपिंग (Digital Tipping)</h3>
                  <button onClick={() => setShowTipModal(false)} className="text-slate-400 hover:text-white text-xs p-1">✕</button>
                </div>
                <p className="text-xs text-slate-300">कारीगर <strong>{selectedCreatorName}</strong> को सीधे UPI द्वारा आर्थिक सहयोग दें।</p>
                
                <div className="grid grid-cols-4 gap-1.5">
                  {[10, 50, 100, 500].map((amt) => (
                    <button 
                      key={amt}
                      onClick={() => { setTipAmount(amt); setCustomTip(''); }}
                      className={`py-2 rounded-lg text-xs font-bold border transition cursor-pointer ${tipAmount === amt && !customTip ? 'bg-orange-500 border-orange-400 text-slate-950' : 'bg-slate-950 border-slate-800 text-slate-300'}`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>

                <div>
                  <input 
                    type="number"
                    placeholder="अन्य राशि दर्ज करें (Custom Amount)"
                    value={customTip}
                    onChange={(e) => { setCustomTip(e.target.value); setTipAmount(0); }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <button 
                  onClick={handleSendTip}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs shadow-lg hover:opacity-95 transition cursor-pointer"
                >
                  UPI से भेजें {customTip ? `₹${customTip}` : `₹${tipAmount}`}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* बॉटम नेविगेशन बार */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-900/95 border-t border-slate-800 px-4 py-2 flex justify-around items-center z-40 backdrop-blur select-none">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center text-[10px] cursor-pointer ${activeTab === 'home' ? 'text-orange-500 font-bold' : 'text-slate-400'}`}>
          <span className="text-lg">🏠</span> होम
        </button>
        <button onClick={() => setActiveTab('hunar')} className={`flex flex-col items-center text-[10px] cursor-pointer ${activeTab === 'hunar' ? 'text-orange-500 font-bold' : 'text-slate-400'}`}>
          <span className="text-lg">🎨</span> हुनर
        </button>
        <button onClick={() => setGlobalActiveTab('create')} className="bg-orange-500 text-slate-950 w-11 h-11 rounded-full flex items-center justify-center shadow-lg -mt-4 hover:scale-105 active:scale-95 transition cursor-pointer font-bold text-2xl" title="नई पोस्ट बनाएं">
          +
        </button>
        <button onClick={() => setActiveTab('reels')} className={`flex flex-col items-center text-[10px] cursor-pointer ${activeTab === 'reels' ? 'text-orange-500 font-bold' : 'text-slate-400'}`}>
          <span className="text-lg">🎬</span> रील्स
        </button>
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center text-[10px] cursor-pointer ${activeTab === 'profile' ? 'text-orange-500 font-bold' : 'text-slate-400'}`}>
          <span className="text-lg">👤</span> प्रोफ़ाइल
        </button>
      </nav>

    </div>
  );
}
