import React, { useState, useEffect } from 'react';
import { useBharatConnect } from '../../context/BharatConnectContext';
import { Post, PromoteCampaign } from '../../types/bharatConnect';
import { 
  X, 
  ArrowLeft, 
  Sparkles, 
  Check, 
  Flame, 
  FileText, 
  User as UserIcon, 
  BookOpen, 
  TrendingUp, 
  ShieldCheck, 
  Sliders, 
  Eye, 
  Heart, 
  Bookmark, 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  Play, 
  Pause, 
  Plus, 
  Zap,
  Globe,
  Tag,
  CreditCard,
  ChevronRight,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { triggerHaptic } from '../../lib/deviceOptimization';

interface PromoteModalProps {
  onClose?: () => void;
}

const AVAILABLE_GENRE_TAGS = [
  'कविता',
  'कहानी',
  'शायरी',
  'नॉन-फिक्शन',
  'विचार',
  'लोकगीत',
  'साहित्य',
  'प्रेरणा',
  'हस्तशिल्प',
  'संस्कृति'
];

const LANGUAGES = [
  { code: 'hi', label: 'हिंदी (Hindi)' },
  { code: 'en', label: 'English' },
  { code: 'mr', label: 'मराठी (Marathi)' },
  { code: 'gu', label: 'ગુજરાતી (Gujarati)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'bn', label: 'বাংলা (Bengali)' },
];

export const PromoteModal: React.FC<PromoteModalProps> = ({ onClose }) => {
  const { 
    isPromoteModalOpen, 
    closePromoteModal, 
    promotingPost, 
    promoteInitialStep, 
    currentUser, 
    posts, 
    campaigns, 
    activeCampaign,
    createCampaign, 
    toggleSmartPause, 
    togglePauseCampaign, 
    addBudgetToCampaign,
    setToastMessage 
  } = useBharatConnect();

  // Navigation state (1: Choose What to Boost, 2: Goal & Audience, 3: Budget & Creative, 4: Live Dashboard)
  const [step, setStep] = useState<number>(promoteInitialStep || 1);

  // If active campaign exists and user opened dashboard directly, initialize on step 4
  useEffect(() => {
    if (promoteInitialStep) {
      setStep(promoteInitialStep);
    } else if (activeCampaign && !promotingPost) {
      setStep(4);
    } else {
      setStep(1);
    }
  }, [promoteInitialStep, promotingPost]);

  // Selected post to boost (defaults to passed post, or user's most recent post, or sample)
  const defaultPost = promotingPost || posts.find((p) => p.author.id === currentUser.id) || posts[0];
  const [targetPost, setTargetPost] = useState<Post>(defaultPost);

  useEffect(() => {
    if (promotingPost) {
      setTargetPost(promotingPost);
    }
  }, [promotingPost]);

  // Screen 1: Objective State ('post' | 'profile' | 'series')
  const [objective, setObjective] = useState<'post' | 'profile' | 'series'>('post');

  // Screen 2: Goal & Audience State
  const [goal, setGoal] = useState<'engagement' | 'profile_visits'>('engagement');
  const [audienceType, setAudienceType] = useState<'auto' | 'custom'>('auto');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('hi');
  const [selectedTags, setSelectedTags] = useState<string[]>(['कविता', 'कहानी', 'साहित्य']);

  // Screen 3: Budget & Duration State
  const [dailyBudget, setDailyBudget] = useState<number>(50); // Min ₹50
  const [durationDays, setDurationDays] = useState<number>(5); // 3, 5, 7, 10
  const [abTestEnabled, setAbTestEnabled] = useState<boolean>(false);
  const [abTestHeadline, setAbTestHeadline] = useState<string>('हिंदी साहित्य की अनमोल धरोहर — अवश्य पढ़ें');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'upi' | 'wallet' | 'card'>('upi');

  // Add Budget Sub-modal state for Dashboard
  const [showAddBudgetModal, setShowAddBudgetModal] = useState<boolean>(false);
  const [additionalBudgetAmount, setAdditionalBudgetAmount] = useState<number>(100);

  if (!isPromoteModalOpen) return null;

  const handleClose = () => {
    triggerHaptic('light');
    if (onClose) onClose();
    closePromoteModal();
  };

  const handleTagToggle = (tag: string) => {
    triggerHaptic('light');
    setSelectedTags((prev) => 
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Calculations
  const totalBudget = dailyBudget * durationDays;
  const gstAmount = Math.round(totalBudget * 0.18);
  const grandTotal = totalBudget + gstAmount;

  // Dynamic estimated reach formula based on Indian digital reader CPM
  const minEstimatedDailyReach = Math.round(dailyBudget * 18);
  const maxEstimatedDailyReach = Math.round(dailyBudget * 24);
  const minTotalReach = minEstimatedDailyReach * durationDays;
  const maxTotalReach = maxEstimatedDailyReach * durationDays;

  // Determine CTA text based on objective & goal
  const getCtaText = () => {
    if (objective === 'profile' || goal === 'profile_visits') {
      return '👤 फॉलो करें (Follow)';
    }
    if (objective === 'series') {
      return '📚 पूरी सीरीज़ पढ़ें (Read Series)';
    }
    return '📖 पढ़ना जारी रखें (Continue Reading)';
  };

  // Launch Campaign Handler (Payment & Transition to Step 4 Live Dashboard)
  const handleLaunchCampaign = () => {
    triggerHaptic('medium');
    setIsProcessingPayment(true);

    setTimeout(() => {
      const newCamp: PromoteCampaign = {
        id: `camp_${Date.now()}`,
        postId: targetPost.id,
        postTitle: targetPost.text || targetPost.caption || 'रचना',
        postText: targetPost.text || targetPost.caption || '',
        postImageUrl: targetPost.imageUrl || targetPost.imageURL || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
        postAuthorName: targetPost.author?.name || targetPost.author?.fullName || currentUser.fullName,
        postAuthorAvatar: targetPost.author?.avatar || currentUser.avatar,
        postAuthorHandle: targetPost.author?.handle || currentUser.handle,
        objective,
        goal,
        audienceType,
        language: selectedLanguage,
        selectedTags,
        dailyBudget,
        durationDays,
        totalBudget,
        gstAmount,
        grandTotal,
        abTestEnabled,
        abTestHeadline: abTestEnabled ? abTestHeadline : undefined,
        ctaText: getCtaText(),
        status: 'running',
        daysLeft: durationDays,
        createdAt: 'अभी-अभी (Just now)',
        totalReach: 48,
        targetReach: minTotalReach,
        savesCount: 6,
        likesCount: 18,
        newFollowersCount: 4,
        costPerResult: 1.15,
        smartPauseEnabled: true,
      };

      createCampaign(newCamp);
      setIsProcessingPayment(false);
      setStep(4); // Move directly to Live Dashboard Screen
    }, 1200);
  };

  // Add Budget to active campaign
  const handleConfirmAddBudget = () => {
    if (activeCampaign) {
      addBudgetToCampaign(activeCampaign.id, additionalBudgetAmount);
      setShowAddBudgetModal(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-[430px] my-auto bg-[#121212] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top App Header with Navigation & Breadcrumb Stepper */}
        <div className="sticky top-0 z-30 px-4 py-3 bg-[#121212]/95 border-b border-slate-800/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {step > 1 && step < 4 && (
              <button 
                onClick={() => setStep((s) => s - 1)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition active:scale-95 cursor-pointer"
                aria-label="Back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <h2 className="text-sm font-bold text-white tracking-wide">
                  {step === 4 ? 'लाइव परफॉरमेंस डैशबोर्ड' : 'प्रमोट करें (Promote Content)'}
                </h2>
              </div>
              {step <= 3 && (
                <p className="text-[11px] text-slate-400">
                  चरण {step} / 3: {step === 1 ? 'ऑब्जेक्टिव चुनें' : step === 2 ? 'लक्ष्य और ऑडियंस' : 'बजट और प्रीव्यू'}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Dashboard shortcut button if active campaign exists */}
            {activeCampaign && step !== 4 && (
              <button
                onClick={() => setStep(4)}
                className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-orange-400 border border-orange-500/30 text-[10px] font-bold transition flex items-center gap-1 active:scale-95"
                title="सक्रिय कैंपेन ट्रैकर देखें"
              >
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span>लाइव ट्रैकर</span>
              </button>
            )}

            <button 
              onClick={handleClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition active:scale-95 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Progress Track (Only for Screens 1-3) */}
        {step <= 3 && (
          <div className="w-full bg-slate-900 h-1">
            <div 
              className="bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 h-1 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        )}

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* ======================================================== */}
          {/* SCREEN 1: प्रमोट ऑब्जेक्टिव चुनें (Choose What to Boost) */}
          {/* ======================================================== */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-white">आप क्या प्रमोट करना चाहते हैं?</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  केवल 3 आसान टैप्स में अपना कैंपेन लाइव करें। कोई जटिल ऐड्स मैनेजर नहीं।
                </p>
              </div>

              {/* Card Selection Grid */}
              <div className="space-y-3">
                {/* 1. यह पोस्ट (This Post) */}
                <div 
                  onClick={() => {
                    triggerHaptic('light');
                    setObjective('post');
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    objective === 'post'
                      ? 'bg-orange-500/10 border-orange-500 shadow-md shadow-orange-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    objective === 'post' ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-300'
                  }`}>
                    <FileText className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>📄 यह पोस्ट (This Post)</span>
                        <span className="text-[10px] text-orange-400 font-normal">अनुशंसित</span>
                      </h4>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        objective === 'post' ? 'border-orange-500 bg-orange-500' : 'border-slate-600'
                      }`}>
                        {objective === 'post' && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                      कविता, कहानी या लेख को सीधे प्रमोट करें और ज्यादा पाठकों तक पहुँचे।
                    </p>
                    
                    {/* Selected post preview thumbnail */}
                    {targetPost && (
                      <div className="mt-2.5 p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center gap-2">
                        {targetPost.imageUrl ? (
                          <img 
                            src={targetPost.imageUrl} 
                            alt="Post thumb" 
                            className="w-8 h-8 rounded-lg object-cover shrink-0" 
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-orange-950/60 text-orange-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                            भा
                          </div>
                        )}
                        <p className="text-[10px] text-slate-300 truncate">
                          "{targetPost.text || targetPost.caption || 'आपकी रचना'}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. मेरी प्रोफाइल (My Profile) */}
                <div 
                  onClick={() => {
                    triggerHaptic('light');
                    setObjective('profile');
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    objective === 'profile'
                      ? 'bg-blue-500/10 border-blue-500 shadow-md shadow-blue-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    objective === 'profile' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-300'
                  }`}>
                    <UserIcon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white">👤 मेरी प्रोफाइल (My Profile)</h4>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        objective === 'profile' ? 'border-blue-500 bg-blue-500' : 'border-slate-600'
                      }`}>
                        {objective === 'profile' && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1">
                      नए फॉलोअर्स बढ़ाने और अपनी लेखक पहचान स्थापित करने के लिए प्रोफाइल प्रमोट करें।
                    </p>

                    <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400">
                      <img 
                        src={currentUser.avatar} 
                        alt={currentUser.fullName} 
                        className="w-5 h-5 rounded-full object-cover border border-slate-700" 
                      />
                      <span className="font-semibold text-slate-200">{currentUser.fullName}</span>
                      <span>·</span>
                      <span className="text-blue-400 font-mono">{currentUser.followersCount.toLocaleString()} फॉलोअर्स</span>
                    </div>
                  </div>
                </div>

                {/* 3. पूरी सीरीज़/बुक (Series/Book) */}
                <div 
                  onClick={() => {
                    triggerHaptic('light');
                    setObjective('series');
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    objective === 'series'
                      ? 'bg-purple-500/10 border-purple-500 shadow-md shadow-purple-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    objective === 'series' ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-300'
                  }`}>
                    <BookOpen className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white">📚 पूरी सीरीज़/बुक (Series/Book)</h4>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        objective === 'series' ? 'border-purple-500 bg-purple-500' : 'border-slate-600'
                      }`}>
                        {objective === 'series' && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1">
                      अपनी किसी विशेष कहानी या धारावाहिक संग्रह की पूरी सीरीज को एक साथ हाइलाइट करें।
                    </p>
                    <div className="mt-2 text-[10px] text-purple-400 font-medium">
                      धारावाहिक उपन्यासों व काव्य-संग्रह के लिए आदर्श 📖
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Sticky Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('medium');
                    setStep(2);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-[0.98] transition cursor-pointer"
                >
                  <span>आगे बढ़ें (Next)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SCREEN 2: लक्ष्य और ऑडियंस सेट करें (Goal & Targeting)  */}
          {/* ======================================================== */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              {/* Section A: कैंपेन का उद्देश्य (Campaign Goal) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <span>🎯 कैंपेन का उद्देश्य (Campaign Goal)</span>
                  </h4>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  <div
                    onClick={() => {
                      triggerHaptic('light');
                      setGoal('engagement');
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      goal === 'engagement'
                        ? 'bg-orange-500/10 border-orange-500/80 text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                        <span className="text-xs font-bold">क्वालिटी रीच और एंगेजमेंट (Reach & Saves)</span>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        ज्यादा से ज्यादा सही पाठकों तक पहुँचना, लाइक्स और सेव्स बढ़ाना।
                      </p>
                    </div>

                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      goal === 'engagement' ? 'border-orange-500 bg-orange-500' : 'border-slate-600'
                    }`}>
                      {goal === 'engagement' && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      triggerHaptic('light');
                      setGoal('profile_visits');
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      goal === 'profile_visits'
                        ? 'bg-blue-500/10 border-blue-500/80 text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <UserIcon className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-xs font-bold">प्रोफाइल विज़िट्स (Profile Visits)</span>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        रीडर्स को आपकी लेखक प्रोफाइल पर लाना ताकि वे फॉलो कर सकें।
                      </p>
                    </div>

                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      goal === 'profile_visits' ? 'border-blue-500 bg-blue-500' : 'border-slate-600'
                    }`}>
                      {goal === 'profile_visits' && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section B: स्मार्ट ऑडियंस (Smart Audience) */}
              <div className="space-y-3 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <span>👥 स्मार्ट ऑडियंस (Target Audience)</span>
                  </h4>

                  {/* Auto vs Custom Selector Buttons */}
                  <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setAudienceType('auto');
                      }}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition ${
                        audienceType === 'auto'
                          ? 'bg-orange-500 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      🤖 ऑटो-स्मार्ट (AI)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setAudienceType('custom');
                      }}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition ${
                        audienceType === 'custom'
                          ? 'bg-orange-500 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      ⚙️ कस्टम
                    </button>
                  </div>
                </div>

                {/* AI Recommended Smart Audience Card */}
                {audienceType === 'auto' ? (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-orange-950/20 via-slate-900 to-slate-900 border border-orange-500/30 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-orange-400">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>AI Smart Recommended Audience</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      सिस्टम आपके पिछले कंटेंट और शब्दावली के आधार पर सही जॉनर प्रेमी (जैसे- हिंदी काव्य, विचार एवं शायरी पाठक) स्वतः चुन लेगा।
                    </p>

                    <div className="pt-1.5 flex flex-wrap gap-1.5 text-[10px]">
                      <span className="px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-300 font-medium">
                        ✓ काव्य प्रेमी
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-300 font-medium">
                        ✓ हिंदी साहित्य
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-300 font-medium">
                        ✓ कहानी वाचक
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-300 font-medium">
                        ✓ प्रेरणादायक विचार
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Custom Targeting Options */
                  <div className="space-y-3 p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                    {/* Language Dropdown */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                        <Globe className="w-3 h-3 text-orange-400" />
                        <span>लक्षित भाषा (Target Language):</span>
                      </label>
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-orange-500"
                      >
                        {LANGUAGES.map((lang) => (
                          <option key={lang.code} value={lang.code}>
                            {lang.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Genre Tags Chips (Tap on/off) */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3 text-orange-400" />
                          <span>जॉनर टैग्स (टैप करके चुनें):</span>
                        </span>
                        <span className="text-[10px] text-orange-400 font-mono">
                          {selectedTags.length} चयनित
                        </span>
                      </label>

                      <div className="flex flex-wrap gap-1.5">
                        {AVAILABLE_GENRE_TAGS.map((tag) => {
                          const isSelected = selectedTags.includes(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => handleTagToggle(tag)}
                              className={`px-2.5 py-1 rounded-xl text-xs font-medium transition active:scale-95 cursor-pointer ${
                                isSelected
                                  ? 'bg-orange-500 text-white shadow-sm border border-orange-400'
                                  : 'bg-slate-800/80 text-slate-300 border border-slate-700/60 hover:border-slate-600'
                              }`}
                            >
                              #{tag} {isSelected && '✓'}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('medium');
                    setStep(3);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-[0.98] transition cursor-pointer"
                >
                  <span>बजट और अवधि तय करें</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SCREEN 3: बजट, अवधि और प्रीव्यू (Budget & Creative)     */}
          {/* ======================================================== */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              {/* UI Section A: बजट और अवधि (Budget & Duration) */}
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span>दैनिक बजट (Daily Budget)</span>
                  </span>
                  <span className="text-sm font-black text-emerald-400 font-mono">
                    ₹{dailyBudget} <span className="text-[10px] font-normal text-slate-400">/ दिन</span>
                  </span>
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="25"
                  value={dailyBudget}
                  onChange={(e) => {
                    setDailyBudget(Number(e.target.value));
                    triggerHaptic('light');
                  }}
                  className="w-full accent-orange-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />

                {/* Quick Preset Buttons */}
                <div className="flex items-center gap-2">
                  {[50, 100, 200, 500].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setDailyBudget(amt);
                      }}
                      className={`flex-1 py-1 text-[11px] font-bold rounded-lg border transition ${
                        dailyBudget === amt 
                          ? 'bg-orange-500 text-white border-orange-400' 
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>

                {/* Real-time Estimated Reach Indicator */}
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-orange-400" />
                    <span className="text-[11px] text-slate-300">अनुमानित दैनिक रीच:</span>
                  </div>
                  <span className="text-xs font-bold text-orange-400 font-mono">
                    ~{minEstimatedDailyReach.toLocaleString()} - {maxEstimatedDailyReach.toLocaleString()} लोग
                  </span>
                </div>

                {/* Duration Pills */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>कैंपेन अवधि (Duration):</span>
                  </label>

                  <div className="grid grid-cols-4 gap-1.5">
                    {[3, 5, 7, 10].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          triggerHaptic('light');
                          setDurationDays(d);
                        }}
                        className={`py-2 text-xs font-bold rounded-xl border transition ${
                          durationDays === d 
                            ? 'bg-blue-600 text-white border-blue-400 shadow-sm' 
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        {d} दिन
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget Summary Breakdown */}
                <div className="text-[11px] text-slate-400 space-y-1 pt-1 border-t border-slate-800/80">
                  <div className="flex justify-between">
                    <span>कुल अनुमानित रीच ({durationDays} दिन):</span>
                    <span className="text-white font-mono font-semibold">
                      ~{minTotalReach.toLocaleString()} - {maxTotalReach.toLocaleString()} पाठक
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>बजट राशि (₹{dailyBudget} × {durationDays}):</span>
                    <span className="text-white font-mono">₹{totalBudget}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>+ 18% GST:</span>
                    <span className="text-slate-400 font-mono">₹{gstAmount}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-white pt-1 border-t border-slate-800">
                    <span>कुल देय राशि:</span>
                    <span className="text-emerald-400 font-mono text-sm">₹{grandTotal}</span>
                  </div>
                </div>
              </div>

              {/* UI Section B: क्रिएटिव प्रीव्यू (Live Preview Card) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>क्रिएटिव लाइव प्रीव्यू (Ad Preview)</span>
                  </span>
                  <span className="text-[10px] text-slate-400">फ़ीड में ऐसा दिखेगा</span>
                </div>

                {/* Live Ad Mock Card */}
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 shadow-lg">
                  {/* Header with Sponsored Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img 
                        src={targetPost.author?.avatar || currentUser.avatar} 
                        alt="Author" 
                        className="w-7 h-7 rounded-full object-cover border border-slate-700" 
                      />
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-white">
                            {targetPost.author?.name || currentUser.fullName}
                          </span>
                          <CheckCircle2 className="w-3 h-3 text-orange-400" />
                        </div>
                        {/* Promoted / Sponsored Pill */}
                        <div className="flex items-center gap-1 text-[10px] text-amber-400 font-medium">
                          <span>प्रमोटेड (Sponsored)</span>
                          <span>·</span>
                          <span className="text-slate-400">भारतीय साहित्य</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Creative Text & Media */}
                  <div className="text-xs text-slate-200 line-clamp-3 leading-relaxed">
                    "{abTestEnabled && abTestHeadline ? abTestHeadline : (targetPost.text || targetPost.caption || 'आपकी रचना')}"
                  </div>

                  {targetPost.imageUrl && (
                    <div className="rounded-xl overflow-hidden aspect-[16/9] bg-slate-950">
                      <img 
                        src={targetPost.imageUrl} 
                        alt="Creative Preview" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}

                  {/* Clear CTA Button */}
                  <div className="pt-1">
                    <div className="w-full py-2 px-3 rounded-xl bg-orange-500/20 border border-orange-500/50 text-orange-300 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm">
                      <span>{getCtaText()}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* A/B Test Toggle (Optional) */}
                <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-white flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>A/B टेस्ट टॉगल (वैकल्पिक)</span>
                      </span>
                      <p className="text-[10px] text-slate-400">
                        दो अलग-अलग टाइटल टेस्ट करके देखें कि कौन सा बेहतर परफॉर्म करता है।
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setAbTestEnabled(!abTestEnabled);
                      }}
                      className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                        abTestEnabled ? 'bg-orange-500' : 'bg-slate-700'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                        abTestEnabled ? 'left-5' : 'left-1'
                      }`} />
                    </button>
                  </div>

                  {abTestEnabled && (
                    <div className="pt-2 border-t border-slate-800 space-y-1 animate-fade-in">
                      <label className="text-[10px] font-semibold text-slate-300">
                        वैकल्पिक हेडलाइन (Variant B):
                      </label>
                      <input
                        type="text"
                        value={abTestHeadline}
                        onChange={(e) => setAbTestHeadline(e.target.value)}
                        placeholder="दूसरा टाइटल लिखें..."
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Secure Checkout / Pay & Launch Button */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={handleLaunchCampaign}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition cursor-pointer disabled:opacity-50"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>
                    {isProcessingPayment 
                      ? 'सुरक्षित भुगतान हो रहा है...' 
                      : `कैंपेन रिव्यू करें और पेमेंट करें (Pay ₹${grandTotal})`}
                  </span>
                </button>
                <p className="text-[10px] text-center text-slate-500 mt-2 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  <span>सुरक्षित UPI / कार्ड्स / वॉलेट द्वारा 1-क्लिक एक्टिवेशन</span>
                </p>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SCREEN 4: लाइव डैशबोर्ड और स्मार्ट कंट्रोल (Live Tracker) */}
          {/* ======================================================== */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              {/* Header Status Banner */}
              {activeCampaign ? (
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 space-y-2 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          activeCampaign.status === 'running' ? 'bg-emerald-400' : 'bg-amber-400'
                        }`} />
                        <span className={`relative inline-flex rounded-full h-3 w-3 ${
                          activeCampaign.status === 'running' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`} />
                      </span>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>
                          {activeCampaign.status === 'running' 
                            ? '🟢 कैंपेन एक्टिव है (Running)' 
                            : '⏸️ कैंपेन रुका हुआ है (Paused)'}
                        </span>
                      </h4>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
                      {activeCampaign.daysLeft} दिन शेष (4 days left)
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 line-clamp-1 italic">
                    "{activeCampaign.postTitle || activeCampaign.postText || 'प्रमोटेड रचना'}"
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
                  <p className="text-xs text-slate-300">वर्तमान में कोई एक्टिव कैंपेन नहीं है।</p>
                  <button
                    onClick={() => setStep(1)}
                    className="px-3 py-1.5 rounded-xl bg-orange-500 text-white text-xs font-bold"
                  >
                    नया कैंपेन शुरू करें
                  </button>
                </div>
              )}

              {/* Key Metrics Grid (4-Box Clean Layout as specified) */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  प्रमुख आँकड़े (Key Metrics)
                </span>

                <div className="grid grid-cols-2 gap-2.5">
                  {/* Box 1: कुल रीच (Total Reach) */}
                  <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-[10px] font-bold flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-blue-400" />
                        <span>कुल रीच</span>
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400">93%</span>
                    </div>

                    <div className="text-base font-extrabold text-white font-mono">
                      {activeCampaign?.totalReach || 840} <span className="text-xs text-slate-500 font-normal">/ {activeCampaign?.targetReach || 900}</span>
                    </div>

                    {/* Progress track */}
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min(100, Math.round(((activeCampaign?.totalReach || 840) / (activeCampaign?.targetReach || 900)) * 100))}%` }}
                      />
                    </div>
                  </div>

                  {/* Box 2: असली लाइक्स & सेव्स */}
                  <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-[10px] font-bold flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                        <span>लाइक्स & सेव्स</span>
                      </span>
                      <Bookmark className="w-3 h-3 text-amber-400" />
                    </div>

                    <div className="text-sm font-extrabold text-white font-mono truncate">
                      {activeCampaign?.savesCount || 42} <span className="text-[10px] font-normal text-slate-400">Saves</span> · {activeCampaign?.likesCount || 110} <span className="text-[10px] font-normal text-slate-400">Likes</span>
                    </div>
                    <p className="text-[9px] text-slate-400">100% प्रामाणिक पाठक सहभागिता</p>
                  </div>

                  {/* Box 3: नए फॉलोअर्स मिले */}
                  <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-[10px] font-bold flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-purple-400" />
                        <span>नए फॉलोअर्स</span>
                      </span>
                      <span className="text-[10px] font-mono text-purple-400 font-bold">+18</span>
                    </div>

                    <div className="text-base font-extrabold text-white font-mono">
                      {activeCampaign?.newFollowersCount || 18} <span className="text-xs text-slate-500 font-normal">पाठक</span>
                    </div>
                    <p className="text-[9px] text-slate-400">आपकी लेखक प्रोफाइल पर जुड़े</p>
                  </div>

                  {/* Box 4: प्रति परिणाम लागत (Cost per Result) */}
                  <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-[10px] font-bold flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                        <span>लागत / परिणाम</span>
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">किफायती</span>
                    </div>

                    <div className="text-base font-extrabold text-emerald-400 font-mono">
                      ₹{activeCampaign?.costPerResult?.toFixed(2) || '1.20'}
                    </div>
                    <p className="text-[9px] text-slate-400">प्रति एंगेज्ड पाठक लागत</p>
                  </div>
                </div>
              </div>

              {/* Smart Feature - "Smart Pause" Toggle (Auto-Protect Budget) */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-900 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white">स्मार्ट पॉज (Auto-Protect Budget)</h5>
                      <p className="text-[10px] text-slate-400">
                        {activeCampaign?.smartPauseEnabled 
                          ? 'सक्रिय [ON]: परफॉरमेंस गिरने पर ऑटो-पॉज' 
                          : 'निष्क्रिय [OFF]: लगातार चलता रहेगा'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      if (activeCampaign) toggleSmartPause(activeCampaign.id);
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      activeCampaign?.smartPauseEnabled ? 'bg-amber-500' : 'bg-slate-700'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      activeCampaign?.smartPauseEnabled ? 'left-6' : 'left-1'
                    }`} />
                  </button>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed pt-1 border-t border-slate-800/80">
                  🛡️ <strong>स्मार्ट फीचर:</strong> यदि एंगेजमेंट दर 2.5% से नीचे आती है, तो सिस्टम लेखक के पैसे सुरक्षित रखने के लिए कैंपेन स्वतः पॉज कर देगा।
                </p>
              </div>

              {/* Live Action Buttons (बजट बढ़ाएं | कैंपेन बंद करें | नया कैंपेन) */}
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  {/* Add Budget Button */}
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setShowAddBudgetModal(true);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 text-orange-300 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>बजट बढ़ाएं (+ ₹)</span>
                  </button>

                  {/* Pause/Stop Campaign Button */}
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('medium');
                      if (activeCampaign) togglePauseCampaign(activeCampaign.id);
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow-sm ${
                      activeCampaign?.status === 'running'
                        ? 'bg-rose-500/20 hover:bg-rose-500/30 border-rose-500/50 text-rose-300'
                        : 'bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-500/50 text-emerald-300'
                    }`}
                  >
                    {activeCampaign?.status === 'running' ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>कैंपेन रोकें (Pause)</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>पुनः चालू करें (Resume)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Create another campaign */}
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setStep(1);
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-orange-400" />
                  <span>एक और पोस्ट प्रमोट करें (Promote Another)</span>
                </button>
              </div>

              {/* Sub-modal: Quick Add Budget Dialog */}
              {showAddBudgetModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
                  <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-4 space-y-3.5 shadow-2xl">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                        <span>कैंपेन बजट बढ़ाएं</span>
                      </h4>
                      <button 
                        onClick={() => setShowAddBudgetModal(false)}
                        className="p-1 rounded-full text-slate-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-300">
                      अतिरिक्त बजट जोड़ने से आपका कैंपेन और अधिक नए पाठकों तक पहुंचेगा।
                    </p>

                    <div className="grid grid-cols-3 gap-2">
                      {[50, 100, 200].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setAdditionalBudgetAmount(amt)}
                          className={`py-2 rounded-xl text-xs font-bold border transition ${
                            additionalBudgetAmount === amt
                              ? 'bg-orange-500 text-white border-orange-400'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          + ₹{amt}
                        </button>
                      ))}
                    </div>

                    <div className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-xl">
                      अनुमानित अतिरिक्त रीच: <strong className="text-orange-400 font-mono">+{Math.round(additionalBudgetAmount * 18)} नए पाठक</strong>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddBudgetModal(false)}
                        className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                      >
                        रद्द करें
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmAddBudget}
                        className="flex-1 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold"
                      >
                        ₹{additionalBudgetAmount} जोड़ें
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
