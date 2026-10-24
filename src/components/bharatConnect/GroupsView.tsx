import React, { useState } from 'react';
import { useBharatConnect } from '../../context/BharatConnectContext';
import { CommunityGroup } from '../../types/bharatConnect';
import { INITIAL_GROUPS } from '../../data/communityData';
import { 
  Users, 
  Plus, 
  Search, 
  Check, 
  Lock, 
  Globe2, 
  Tag, 
  MessageSquare, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Share2
} from 'lucide-react';

export const GroupsView: React.FC = () => {
  const { t, setToastMessage } = useBharatConnect();
  const [groups, setGroups] = useState<CommunityGroup[]>(INITIAL_GROUPS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGroup, setActiveGroup] = useState<CommunityGroup | null>(null);
  const [newDiscussionText, setNewDiscussionText] = useState('');

  const categories = [
    { id: 'all', label: 'सभी समूह (All)' },
    { id: 'tech', label: '💻 टेक भारत (Tech)' },
    { id: 'food', label: '🍲 स्वाद व रसोई (Food)' },
    { id: 'business', label: '🚀 स्टार्टअप्स (Business)' },
    { id: 'culture', label: '🪔 संस्कृति (Culture)' },
    { id: 'sports', label: '🏏 खेल (Sports)' }
  ];

  const filteredGroups = groups.filter((g) => {
    const matchesCat = selectedCategory === 'all' || g.category === selectedCategory;
    const matchesQuery = g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  const toggleJoinGroup = (groupId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const isNowJoined = !g.isJoined;
          setToastMessage(isNowJoined ? `आप '${g.name}' से जुड़ गए हैं!` : `आप '${g.name}' से अलग हो गए हैं।`);
          return {
            ...g,
            isJoined: isNowJoined,
            memberCount: isNowJoined ? g.memberCount + 1 : g.memberCount - 1
          };
        }
        return g;
      })
    );
  };

  const handlePostDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiscussionText.trim()) return;
    setToastMessage('आपकी चर्चा समूह में प्रकाशित हो गई!');
    setNewDiscussionText('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 pb-28 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-950/40 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-3xl p-5 shadow-sm backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-inner">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white flex items-center gap-2">
                <span>समुदाय एवं समूह</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 font-medium">
                  Communities
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                समान रुचि वाले भारतीय नागरिकों, डेवलपर्स, और कला प्रेमियों के साथ चर्चा करें
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setToastMessage('नया समूह बनाने का विकल्प जल्द ही सक्रिय होगा!')}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>नया समूह बनाएं</span>
        </button>
      </div>

      {/* Search & Category Pills */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="समूह या विषय खोजें (उदा. टेक, स्वाद, स्टार्टअप)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/60"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer active:scale-95 ${
                selectedCategory === cat.id
                  ? 'bg-orange-500 text-white font-bold shadow-md shadow-orange-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Group Modal / Detailed Discussion Box */}
      {activeGroup && (
        <div className="p-5 rounded-3xl bg-slate-900 border border-orange-500/40 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <img
                src={activeGroup.avatar}
                alt={activeGroup.name}
                className="w-12 h-12 rounded-2xl object-cover border border-slate-700"
              />
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{activeGroup.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                    {activeGroup.memberCount.toLocaleString('en-IN')} सदस्य
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{activeGroup.description}</p>
              </div>
            </div>
            <button
              onClick={() => setActiveGroup(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg text-xs"
            >
              ✕ बंद करें
            </button>
          </div>

          {/* Quick discussion form */}
          <form onSubmit={handlePostDiscussion} className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-orange-400" />
              <span>समूह में नई चर्चा शुरू करें:</span>
            </label>
            <textarea
              value={newDiscussionText}
              onChange={(e) => setNewDiscussionText(e.target.value)}
              placeholder="अपने विचार, प्रश्न या अनुभव यहाँ साझा करें..."
              rows={3}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/60 resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition active:scale-95 cursor-pointer shadow-md"
              >
                पोस्ट करें
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGroups.map((group) => (
          <div
            key={group.id}
            className="group relative rounded-3xl bg-slate-900/70 border border-slate-800/90 overflow-hidden hover:border-slate-700 transition shadow-lg flex flex-col"
          >
            {/* Cover Image banner */}
            <div className="h-28 w-full relative overflow-hidden bg-slate-950">
              <img
                src={group.coverImage}
                alt={group.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-slate-200 border border-white/10 font-medium">
                {group.isPrivate ? <Lock className="w-3 h-3 text-amber-400" /> : <Globe2 className="w-3 h-3 text-emerald-400" />}
                <span>{group.isPrivate ? 'निजी समूह' : 'सार्वजनिक'}</span>
              </div>
            </div>

            {/* Content & Avatar */}
            <div className="p-4 pt-0 flex-1 flex flex-col justify-between -mt-6 relative z-10 space-y-3">
              <div className="flex items-start gap-3">
                <img
                  src={group.avatar}
                  alt={group.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-900 shadow-md shrink-0 bg-slate-800"
                />
                <div className="flex-1 min-w-0 pt-6">
                  <h3 className="font-bold text-white text-sm truncate">{group.name}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span className="font-semibold text-slate-300 font-mono">
                      {group.memberCount.toLocaleString('en-IN')}
                    </span>
                    <span>सदस्य (Members)</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300/90 leading-relaxed line-clamp-2">
                {group.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {group.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[10px] text-orange-400/90 font-medium font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Activity indicator */}
              <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 pt-1">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{group.recentActivity}</span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleJoinGroup(group.id)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                    group.isJoined
                      ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                      : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md shadow-orange-500/20'
                  }`}
                >
                  {group.isJoined ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>जुड़े हुए हैं (Joined)</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>समूह से जुड़ें (Join)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveGroup(group)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-white text-xs font-medium border border-slate-700 flex items-center gap-1 transition active:scale-95 cursor-pointer"
                  title="समूह चर्चाएं देखें"
                >
                  <span>चर्चाएं</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
