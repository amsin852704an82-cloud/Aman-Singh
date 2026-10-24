import React from 'react';
import { useBharatConnect } from '../../context/BharatConnectContext';
import { INITIAL_CREATOR_STATS } from '../../data/communityData';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Sparkles, 
  Calendar, 
  Clock, 
  Coins, 
  Award, 
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  FileText
} from 'lucide-react';

export const CreatorView: React.FC = () => {
  const { currentUser, posts, setToastMessage } = useBharatConnect();
  const stats = INITIAL_CREATOR_STATS;

  const userPosts = posts.filter((p) => p.author.id === currentUser.id || p.authorUid === currentUser.uid);

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 pb-28 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-orange-950/40 border border-slate-800 rounded-3xl p-5 shadow-sm backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-inner">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white flex items-center gap-2">
                <span>क्रिएटर स्टूडियो व एनालिटिक्स</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">
                  Creator Studio
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                अपनी रीच, दर्शक जुड़ाव (Engagement) और सामग्री के प्रभाव का विस्तृत विश्लेषण देखें
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>सत्यापित क्रिएटर (Level 2)</span>
          </span>
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>कुल दृश्य (Impressions)</span>
            <Eye className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">
            {stats.impressions.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% इस सप्ताह</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>कुल रीच (Total Reach)</span>
            <Users className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">
            {stats.reach.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+{stats.followerGrowthPercent}% वृद्धि</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>एंगेजमेंट दर (Engagement)</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">
            {stats.engagementRate}%
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>औसत से 2.4× अधिक</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>अनुमानित आय (Fund)</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-400 font-mono">
            ₹{stats.estimatedEarningsINR.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400">
            <span>क्रिएटर फंड व गिफ्ट्स</span>
          </div>
        </div>
      </div>

      {/* Insights & Recommendations Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 via-slate-900 to-amber-500/10 border border-orange-500/30 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-white">
            पोस्ट करने का सर्वश्रेष्ठ समय (Best Time To Post):
          </h4>
          <p className="text-xs text-slate-300">
            आपके अधिकांश दर्शक <strong className="text-orange-400">{stats.bestTimeToPost}</strong> के दौरान सबसे अधिक सक्रिय रहते हैं।
          </p>
        </div>
      </div>

      {/* Post Analytics List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-orange-400" />
          <span>आपकी हालिया पोस्ट्स का प्रदर्शन (Post Insights)</span>
        </h3>

        {userPosts.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-xs text-slate-400">
            अभी तक आपने कोई पोस्ट नहीं बनाई है। नई पोस्ट बनाकर यहाँ लाइव इनसाइट्स देखें!
          </div>
        ) : (
          <div className="space-y-2.5">
            {userPosts.slice(0, 5).map((post) => (
              <div
                key={post.id}
                className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt="Thumbnail"
                      className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-xs text-slate-400 shrink-0">
                      📝
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate max-w-sm">
                      {post.caption || post.text || 'पोस्ट'}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{post.createdAt}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                  <div className="text-center">
                    <span className="block font-bold text-rose-400">{post.likesCount}</span>
                    <span className="text-[10px] text-slate-500">पसंद</span>
                  </div>
                  <div className="text-center">
                    <span className="block font-bold text-blue-400">{post.commentsCount}</span>
                    <span className="text-[10px] text-slate-500">टिप्पणियां</span>
                  </div>
                  <div className="text-center">
                    <span className="block font-bold text-emerald-400">{post.sharesCount}</span>
                    <span className="text-[10px] text-slate-500">शेयर</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
