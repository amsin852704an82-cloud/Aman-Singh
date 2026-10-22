import React, { useState, useEffect } from 'react';
import { useBharatConnect } from '../../context/BharatConnectContext';
import { 
  HunarPost, 
  HunarCategory, 
  HunarLevel, 
  HunarOfferType, 
  User 
} from '../../types/bharatConnect';
import { 
  subscribeToHunarPosts, 
  deleteFirestoreHunarPost, 
  registerHunarInterest 
} from '../../lib/hunarService';
import { CreateHunarModal } from './CreateHunarModal';
import { ChatModal } from './ChatModal';
import { 
  GraduationCap, 
  Plus, 
  Search, 
  Users, 
  Sparkles, 
  MessageCircle, 
  MapPin, 
  CheckCircle2, 
  Trash2, 
  Filter, 
  Code, 
  Utensils, 
  Music, 
  Palette, 
  Activity, 
  Camera, 
  BookOpen, 
  ArrowRight,
  Heart,
  Share2,
  Check
} from 'lucide-react';

const CATEGORIES: { id: HunarCategory; label: string; icon: string }[] = [
  { id: 'all', label: 'सभी हुनर', icon: '✨' },
  { id: 'coding', label: 'कोडिंग व टेक', icon: '💻' },
  { id: 'cooking', label: 'कुकिंग व रेसिपी', icon: '🍲' },
  { id: 'guitar', label: 'गिटार व संगीत', icon: '🎸' },
  { id: 'painting', label: 'चित्रकला व आर्ट', icon: '🎨' },
  { id: 'yoga', label: 'योग व ध्यान', icon: '🧘' },
  { id: 'photography', label: 'फ़ोटोग्राफ़ी', icon: '📸' },
  { id: 'crafts', label: 'हस्तशिल्प कला', icon: '🧵' }
];

export const HunarView: React.FC = () => {
  const { 
    currentUser, 
    firebaseUser, 
    isFirebaseAuthLoggedIn, 
    setIsAuthModalOpen, 
    setToastMessage,
    openUserProfile 
  } = useBharatConnect();

  const [hunarPosts, setHunarPosts] = useState<HunarPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<HunarCategory>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'teach' | 'learn'>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [chatRecipient, setChatRecipient] = useState<User | null>(null);
  const [chatInitialMessage, setChatInitialMessage] = useState<string>('');
  const [joinedSkillIds, setJoinedSkillIds] = useState<{ [skillId: string]: boolean }>({});

  useEffect(() => {
    const unsub = subscribeToHunarPosts((posts) => {
      setHunarPosts(posts);
    });

    return () => unsub();
  }, []);

  const currentUid = currentUser.uid || currentUser.id || firebaseUser?.uid;

  // Filter posts
  const filteredPosts = hunarPosts.filter((post) => {
    // Category match
    if (selectedCategory !== 'all' && post.category !== selectedCategory) {
      return false;
    }
    // Offer type match
    if (selectedType !== 'all' && post.offerType !== selectedType) {
      return false;
    }
    // Level match
    if (selectedLevel !== 'all' && post.level !== selectedLevel) {
      return false;
    }
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const inTitle = post.title.toLowerCase().includes(q);
      const inDesc = post.description.toLowerCase().includes(q);
      const inAuthor = post.authorName.toLowerCase().includes(q);
      if (!inTitle && !inDesc && !inAuthor) return false;
    }
    return true;
  });

  // Handle "Learn This" or "I can teach this" click -> Connect to chat with teacher/learner
  const handleConnectSkill = async (post: HunarPost) => {
    const isOwnPost = (post.authorUid && post.authorUid === currentUid) ||
                      (post.author?.id && post.author.id === currentUser.id);

    if (isOwnPost) {
      setToastMessage('यह आपकी खुद की हुनर पोस्ट है!');
      return;
    }

    // Register interest in Firestore
    if (currentUid && !joinedSkillIds[post.id]) {
      registerHunarInterest(post.id, currentUid);
      setJoinedSkillIds((prev) => ({ ...prev, [post.id]: true }));
    }

    // Prepare recipient user
    const recipient: User = post.author || {
      id: post.authorUid,
      uid: post.authorUid,
      username: post.authorHandle.replace('@', ''),
      fullName: post.authorName,
      handle: post.authorHandle,
      avatar: post.authorPhotoURL,
      bio: 'Hunar Mentor on BharatConnect',
      location: post.location || 'भारत',
      verified: true,
      followersCount: 120,
      followingCount: 15,
      postCount: 1,
      language: 'hi'
    };

    if (post.offerType === 'teach') {
      setChatInitialMessage(`नमस्ते ${post.authorName}! मुझे आपका हुनर '${post.title}' सीखना है। क्या आप मुझे सिखा सकते हैं? 🙏`);
    } else {
      setChatInitialMessage(`नमस्ते ${post.authorName}! मैंने आपकी हुनर सीखने की पोस्ट '${post.title}' देखी। मैं आपको यह सिखा सकता हूँ! 🎓`);
    }

    setChatRecipient(recipient);
    setToastMessage(`'${post.authorName}' के साथ चैट खुल रही है! 💬`);
  };

  const handleDeleteHunar = async (hunarId: string) => {
    if (confirm('क्या आप वाकई इस हुनर पोस्ट को हटाना चाहते हैं?')) {
      try {
        await deleteFirestoreHunarPost(hunarId);
        setToastMessage('हुनर पोस्ट सफलतापूर्वक हटा दी गई।');
      } catch (err: any) {
        setToastMessage(err?.message || 'हटाने में त्रुटि हुई।');
      }
    }
  };

  const handleShareSkill = (post: HunarPost) => {
    navigator.clipboard.writeText(`https://bharatconnect.app/hunar/${post.id}`);
    setToastMessage('हुनर पोस्ट लिंक कॉपी हो गया! (Link Copied)');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 pb-28 space-y-6">
      {/* Indian Touch Hero Banner with Mandala motif and Tricolor Accents */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-950/60 via-slate-900 to-emerald-950/60 border border-slate-800 p-5 sm:p-7 shadow-xl bg-mandala">
        {/* Subtle Decorative Mandala/Radial Graphic */}
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-gradient-to-br from-orange-500/10 via-amber-400/5 to-emerald-500/10 pointer-events-none blur-2xl" />
        <div className="absolute -left-8 -bottom-8 w-44 h-44 rounded-full bg-gradient-to-tr from-emerald-500/10 via-teal-400/5 to-orange-500/10 pointer-events-none blur-2xl" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/20 via-white/10 to-emerald-500/20 border border-orange-500/30 text-[11px] font-semibold text-orange-300">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
              <span>भारत का हुनर मंच · Skill Exchange 🇮🇳</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              हुनर (Hunar) — सीखो और सिखाओ
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              गिटार, कोडिंग, कुकिंग, चित्रकला या योग — अपनी स्किल्स देश भर के लोगों के साथ साझा करें 
              और सीधे 1-on-1 चैट करके नए हुनर सीखें।
            </p>
          </div>

          {/* Add Skill Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="self-start sm:self-center px-4 py-3 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-orange-500/25 flex items-center gap-2 transition active:scale-95 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ अपना हुनर जोड़ें</span>
          </button>
        </div>
      </div>

      {/* Search & Filters Section */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="हुनर खोजें (उदा. गिटार, कोडिंग, थेपला, पेंटिंग, योग)..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition shadow-inner"
          />
        </div>

        {/* Category Horizontal Scroll Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-400 shadow-sm'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sub-Filters: Offer Type & Level */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
          {/* Offer Type Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                selectedType === 'all'
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              सभी ({hunarPosts.length})
            </button>
            <button
              onClick={() => setSelectedType('teach')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                selectedType === 'teach'
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🎓 सिखा रहे हैं
            </button>
            <button
              onClick={() => setSelectedType('learn')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                selectedType === 'learn'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🙋‍♂️ सीखना चाहते हैं
            </button>
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500">स्तर:</span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="bg-slate-900 text-slate-300 text-xs px-2.5 py-1 rounded-xl border border-slate-800 focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="all">सभी स्तर (All Levels)</option>
              <option value="beginner">शुरुआती (Beginner)</option>
              <option value="intermediate">मध्यम (Intermediate)</option>
              <option value="pro">मास्टर / प्रो (Pro)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 mx-auto flex items-center justify-center shadow-inner">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">कोई हुनर पोस्ट नहीं मिला</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            इस कैटेगरी में अभी तक कोई हुनर नहीं जोड़ा गया है। आप पहले व्यक्ति बनकर अपना हुनर साझा कर सकते हैं!
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold shadow-md transition active:scale-95 cursor-pointer"
          >
            + अपना हुनर जोड़ें (Create First Post)
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPosts.map((post) => {
            const isOwn = (post.authorUid && post.authorUid === currentUid) ||
                          (post.author?.id && post.author.id === currentUser.id);

            const levelColor = 
              post.level === 'pro'
                ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                : post.level === 'intermediate'
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';

            const levelLabel =
              post.level === 'pro'
                ? 'मास्टर (Pro)'
                : post.level === 'intermediate'
                ? 'मध्यम (Intermediate)'
                : 'शुरुआती (Beginner)';

            const hasJoined = joinedSkillIds[post.id];

            return (
              <article
                key={post.id}
                className="bg-slate-900/90 border border-slate-800/90 rounded-3xl overflow-hidden shadow-md flex flex-col justify-between hover:border-slate-700 transition group"
              >
                <div>
                  {/* Card Header: Author Info */}
                  <div className="p-4 pb-3 flex items-center justify-between">
                    <div 
                      onClick={() => post.author && openUserProfile(post.author)}
                      className="flex items-center gap-2.5 cursor-pointer"
                    >
                      <img
                        src={post.authorPhotoURL}
                        alt={post.authorName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-700 group-hover:border-orange-500 transition"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white group-hover:text-orange-400 transition">
                            {post.authorName}
                          </span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <span>{post.authorHandle}</span>
                          <span>·</span>
                          <span className="flex items-center gap-0.5">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            <span className="truncate max-w-[120px]">{post.location}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Own post delete or share button */}
                    <div className="flex items-center gap-1">
                      {isOwn ? (
                        <button
                          onClick={() => handleDeleteHunar(post.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
                          title="हुनर हटाएं (Delete)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleShareSkill(post)}
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                          title="शेयर करें"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Media Thumbnail */}
                  {post.mediaUrl && (
                    <div className="relative aspect-video bg-slate-950 overflow-hidden">
                      <img
                        src={post.mediaUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        loading="lazy"
                      />
                      {/* Badge in top corner */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md ${
                          post.offerType === 'teach'
                            ? 'bg-orange-950/80 text-orange-300 border-orange-500/40'
                            : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                        }`}>
                          {post.offerType === 'teach' ? '🎓 सिखा रहे हैं' : '🙋‍♂️ सीखना चाहते हैं'}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md ${levelColor}`}>
                          {levelLabel}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Content details */}
                  <div className="p-4 space-y-2">
                    <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {post.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Learners Count & Primary Action Button */}
                <div className="p-4 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3 bg-slate-950/30">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Users className="w-3.5 h-3.5 text-orange-400" />
                    <span className="font-medium">
                      {(post.learnersCount + (hasJoined ? 1 : 0))} लोग जुड़े
                    </span>
                  </div>

                  {/* Action Button: "Learn This" or "I Can Teach This" */}
                  {isOwn ? (
                    <span className="px-3 py-1.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/30 text-xs font-bold">
                      आपकी पोस्ट (Your Post)
                    </span>
                  ) : post.offerType === 'teach' ? (
                    <button
                      onClick={() => handleConnectSkill(post)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Learn This (यह सीखें)</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleConnectSkill(post)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>I can teach this (सिखाएं)</span>
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Create Hunar Modal */}
      <CreateHunarModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          // Handled via realtime snapshot
        }}
      />

      {/* 1-on-1 Chat Modal with Skill Creator */}
      {chatRecipient && (
        <ChatModal
          recipientUser={chatRecipient}
          onClose={() => setChatRecipient(null)}
          initialMessage={chatInitialMessage}
        />
      )}
    </div>
  );
};
