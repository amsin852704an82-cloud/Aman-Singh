import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Post, Reel, Story, VirtualGift, User } from '../types';
import { 
  Heart, 
  MessageSquare, 
  Repeat2, 
  Share2, 
  Image, 
  Send, 
  CheckCircle2, 
  Play, 
  TrendingUp, 
  MapPin, 
  Bookmark, 
  Gift, 
  IndianRupee, 
  ShieldCheck, 
  Clock, 
  ArrowUpRight,
  Database,
  Layers,
  HardDrive
} from 'lucide-react';

export const AppFeedView: React.FC = () => {
  const { 
    posts, 
    reels, 
    stories, 
    gifts, 
    creatorEarnings, 
    currentUser, 
    users,
    setCurrentUserById,
    signupUser,
    createPost, 
    toggleLikePost, 
    toggleSavePost, 
    sendGift, 
    requestWithdrawal, 
    uploadMinioFile, 
    setActiveTab 
  } = useApp();

  const [content, setContent] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Post['language']>('English');
  const [selectedTag, setSelectedTag] = useState<string>('TechBharat');
  const [locationName, setLocationName] = useState('Indiranagar, Bengaluru');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  
  // Modals
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [activeReel, setActiveReel] = useState<Reel | null>(null);
  const [giftingPost, setGiftingPost] = useState<Post | null>(null);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmountRupees, setWithdrawAmountRupees] = useState('5000');
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [signupForm, setSignupForm] = useState({
    username: 'rahul_sharma',
    email: 'rahul@example.com',
    password: 'SecurePass123!',
    full_name: 'Rahul Sharma'
  });
  const [signupResult, setSignupResult] = useState<{ user: User; access_token: string } | null>(null);

  const myEarnings = creatorEarnings.find((ce) => ce.creatorId === currentUser.id) || creatorEarnings[0];

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    createPost(content.trim(), selectedLanguage, attachedImage || undefined, [selectedTag, 'BharatSocial'], locationName);
    setContent('');
    setAttachedImage(null);
  };

  const handleSimulateMediaUpload = () => {
    const sampleFiles = [
      'product_launch_blr.webp',
      'indic_design_tokens.webp',
      'delhi_metro_ai_iot.webp',
      'rural_fintech_pos.webp'
    ];
    const picked = sampleFiles[Math.floor(Math.random() * sampleFiles.length)];
    const uploadedUrl = uploadMinioFile('bharat-posts-images', picked, 310500, 'image/webp');
    setAttachedImage(uploadedUrl);
  };

  const handleSendGiftSubmit = (gift: VirtualGift) => {
    if (!giftingPost) return;
    sendGift(gift.id, giftingPost.id, giftingPost.userId);
    setGiftingPost(null);
  };

  const handleProcessWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(withdrawAmountRupees);
    if (isNaN(amountNum) || amountNum <= 0) return;
    const amountPaise = Math.round(amountNum * 100);
    requestWithdrawal(myEarnings.creatorId, amountPaise, myEarnings.upiId);
    setIsWithdrawOpen(false);
  };

  const handleExecuteSignup = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = signupUser(signupForm);
      setSignupResult(res);
    } catch {
      // error handled in notify
    }
  };

  const filteredPosts = posts.filter((p) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'indic') return p.language !== 'English';
    if (activeFilter === 'tech') return p.tags.some(t => ['TechStack', 'Redis', 'PostgreSQL', 'DeepTech', 'TechBharat'].includes(t));
    if (activeFilter === 'founders') return p.author.role === 'Founder' || p.tags.includes('Startups');
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Infrastructure Synced Banner */}
      <div className="mb-4 p-3.5 bg-slate-900/60 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-orange-400 font-semibold flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
            PostgreSQL 14+ Schema Live (20 Tables & Triggers)
          </span>
          <span aria-hidden="true">·</span>
          <span>DPDP Compliant</span>
          <span aria-hidden="true">·</span>
          <span>Sec. 194-O TDS Automated</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveTab('postgres')}
            className="text-slate-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span>Database Schema (20 Tables)</span>
          </button>
          <span className="text-slate-700">|</span>
          <button 
            onClick={() => setActiveTab('redis')}
            className="text-slate-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-red-400" />
            <span>Redis 7 Cache</span>
          </button>
          <span className="text-slate-700">|</span>
          <button 
            onClick={() => setActiveTab('minio')}
            className="text-slate-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            <HardDrive className="w-3.5 h-3.5 text-amber-400" />
            <span>MinIO S3 Buckets</span>
          </button>
        </div>
      </div>

      {/* Active User Session & Account Switcher Bar */}
      <div className="mb-6 p-4 bg-slate-900 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
            <img src={currentUser.avatar} alt={currentUser.fullName} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-100 text-sm">{currentUser.fullName}</span>
              {currentUser.verified && <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />}
              <span className="text-slate-500 font-mono">{currentUser.handle}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 mt-0.5">
              <span>{currentUser.role}</span>
              <span aria-hidden="true">·</span>
              <span>{currentUser.location}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-mono">JWT Bearer Active</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Switch Profile:</span>
            <select
              value={currentUser.id}
              onChange={(e) => setCurrentUserById(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-950 text-slate-200 rounded-lg border border-slate-800 font-medium focus:outline-none cursor-pointer"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName} ({u.handle})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              setSignupResult(null);
              setIsSignupOpen(true);
            }}
            className="px-3.5 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-300 rounded-lg font-semibold transition-colors cursor-pointer"
          >
            + Test signup(dto)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Stories Bar (24hr Ephemeral TTL) */}
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Bharat Stories (24hr TTL)
              </span>
              <span className="text-slate-500 font-mono tabular-nums">Auto-expires via DB trigger</span>
            </div>

            <div className="flex items-center gap-4 overflow-x-auto pb-1">
              {stories.map((story) => (
                <div
                  key={story.id}
                  onClick={() => setActiveStory(story)}
                  className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-orange-500 via-amber-400 to-emerald-400 group-hover:scale-105 transition-transform">
                    <img
                      src={story.author.avatar}
                      alt={story.author.fullName}
                      className="w-full h-full object-cover rounded-full border-2 border-slate-900"
                    />
                  </div>
                  <span className="text-[11px] font-medium text-slate-300 group-hover:text-white truncate max-w-[70px]">
                    {story.author.fullName.split(' ')[0]}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono tabular-nums">
                    {story.viewCount} views
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Post Composer */}
          <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 shadow-sm">
            <form onSubmit={handlePostSubmit}>
              <div className="flex gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-amber-600 flex items-center justify-center font-bold text-white shrink-0 text-sm">
                  {currentUser.fullName.charAt(0)}
                </div>
                <div className="flex-1">
                  <textarea
                    rows={3}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's happening in Bharat's creator & tech world?..."
                    className="w-full bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none resize-none text-sm leading-relaxed"
                  />
                  {attachedImage && (
                    <div className="mt-2 relative inline-flex items-center gap-2 p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-orange-400">
                      <Image className="w-4 h-4 text-orange-400" />
                      <span className="truncate max-w-xs">{attachedImage}</span>
                      <button
                        type="button"
                        onClick={() => setAttachedImage(null)}
                        className="text-slate-400 hover:text-slate-200 ml-1 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSimulateMediaUpload}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Image className="w-3.5 h-3.5 text-amber-400" />
                    <span>Attach Media</span>
                  </button>

                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value as Post['language'])}
                    className="bg-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none border-none cursor-pointer"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">हिंदी (Hindi)</option>
                    <option value="Tamil">தமிழ் (Tamil)</option>
                    <option value="Telugu">తెలుగు (Telugu)</option>
                    <option value="Bengali">বাংলা (Bengali)</option>
                  </select>

                  <select
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="bg-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none border-none cursor-pointer max-w-[150px] truncate"
                  >
                    <option value="Indiranagar, Bengaluru">Bengaluru</option>
                    <option value="Bandra West, Mumbai">Mumbai</option>
                    <option value="Connaught Place, New Delhi">New Delhi</option>
                    <option value="IIT Madras, Chennai">Chennai</option>
                    <option value="Hitec City, Hyderabad">Hyderabad</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={!content.trim()}
                  className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    content.trim()
                      ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm shadow-orange-500/20'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish</span>
                </button>
              </div>
            </form>
          </div>

          {/* Interactive Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Posts
            </button>
            <button
              onClick={() => setActiveFilter('tech')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeFilter === 'tech'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tech & Infrastructure
            </button>
            <button
              onClick={() => setActiveFilter('indic')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeFilter === 'indic'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Indic Languages
            </button>
            <button
              onClick={() => setActiveFilter('founders')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeFilter === 'founders'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Founders & Startups
            </button>
          </div>

          {/* Feed List */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="p-5 bg-slate-900 rounded-2xl border border-slate-800/90 hover:border-slate-700/80 transition-colors"
              >
                {/* Author row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-200 text-sm overflow-hidden shrink-0">
                      {post.author.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-sm text-slate-100 hover:text-orange-400 cursor-pointer">
                          {post.author.fullName}
                        </span>
                        {post.author.verified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />
                        )}
                        <span className="text-slate-500 text-xs font-normal">
                          {post.author.handle}
                        </span>
                      </div>
                      
                      {/* Quiet unboxed metadata per Zero-Pill rule */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span>{post.author.role}</span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-0.5">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {post.locationName || post.region}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{post.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                      <ShieldCheck className="w-3 h-3" />
                      DPDP OK
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {post.language}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line mb-3">
                  {post.content}
                </p>

                {/* Attached Media */}
                {post.mediaUrl && (
                  <div className="mb-3 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-4 flex flex-col items-center justify-center text-center">
                    <HardDrive className="w-8 h-8 text-orange-400/80 mb-2" />
                    <span className="text-xs font-mono text-slate-300">{post.mediaUrl}</span>
                    <span className="text-[11px] text-slate-500 mt-1">Stored in MinIO bucket `bharat-posts-images`</span>
                  </div>
                )}

                {/* Hashtags */}
                <div className="flex flex-wrap gap-2 text-xs text-orange-400 mb-4 font-medium">
                  {post.tags.map((t) => (
                    <span key={t} className="hover:underline cursor-pointer">
                      #{t.replace(/^#/, '')}
                    </span>
                  ))}
                </div>

                {/* Action Bar */}
                <div className="pt-3 border-t border-slate-800/70 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleLikePost(post.id)}
                      className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                        post.hasLiked ? 'text-rose-500' : 'hover:text-rose-400'
                      }`}
                      title="Trigger update_like_count() on PostgreSQL"
                    >
                      <Heart
                        className={`w-4 h-4 ${post.hasLiked ? 'fill-rose-500 text-rose-500' : ''}`}
                      />
                      <span className="font-mono tabular-nums">{post.likesCount.toLocaleString()}</span>
                    </button>

                    <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors cursor-pointer">
                      <MessageSquare className="w-4 h-4" />
                      <span className="font-mono tabular-nums">{post.commentCount.toLocaleString()}</span>
                    </button>

                    <button 
                      onClick={() => toggleSavePost(post.id)}
                      className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                        post.hasSaved ? 'text-amber-400' : 'hover:text-amber-400'
                      }`}
                      title="Toggle Save in saves table"
                    >
                      <Bookmark className={`w-4 h-4 ${post.hasSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
                      <span className="font-mono tabular-nums">{(post.saveCount || 0).toLocaleString()}</span>
                    </button>

                    <button className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors cursor-pointer">
                      <Repeat2 className="w-4 h-4" />
                      <span className="font-mono tabular-nums">{(post.shareCount || 0).toLocaleString()}</span>
                    </button>
                  </div>

                  {/* Virtual Gift Button */}
                  <button
                    onClick={() => setGiftingPost(post)}
                    className="px-2.5 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Gift className="w-3.5 h-3.5 text-amber-400" />
                    <span>Send Gift (70/30 Split)</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Right Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Creator Earnings & UPI Payouts Widget */}
          <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-emerald-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4" />
                Creator Earnings & UPI
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-300 font-mono">
                KYC Verified
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block mb-0.5">Available Balance</span>
              <h4 className="text-2xl font-black text-white font-mono tabular-nums">
                ₹{(myEarnings.availableBalancePaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">
                Total Earned: ₹{(myEarnings.totalEarnedPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800 text-[11px] font-mono space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>UPI ID:</span>
                <span className="text-slate-200">{myEarnings.upiId}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>PAN Number:</span>
                <span className="text-slate-200">{myEarnings.panNumber}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>TDS Rate:</span>
                <span className="text-emerald-400">1% (Section 194-O)</span>
              </div>
            </div>

            <button
              onClick={() => setIsWithdrawOpen(true)}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Instant Payout via UPI</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Virtual Gifts Catalog Preview */}
          <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Gift className="w-4 h-4 text-amber-400" />
              Virtual Gifts Catalog
            </h3>
            <p className="text-xs text-slate-400">
              Fans purchase coins; creators receive 70% in paise, platform retains 30%.
            </p>

            <div className="grid grid-cols-5 gap-2 pt-1 text-center">
              {gifts.map((g) => (
                <div key={g.id} className="p-2 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                  <div className="text-xl mb-1">{g.icon}</div>
                  <span className="text-[10px] text-slate-300 font-semibold block">{g.name}</span>
                  <span className="text-[10px] font-mono text-amber-400">{g.coinPrice}c</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trending in Bharat */}
          <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-400" />
                Trending in Bharat
              </h3>
              <span className="text-[11px] font-mono text-slate-500">Live (Redis ZSET)</span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between group cursor-pointer">
                <div>
                  <p className="font-semibold text-slate-200 group-hover:text-orange-400 transition-colors">
                    #DigitalIndia
                  </p>
                  <p className="text-[11px] text-slate-500">84.2K Posts · pg_trgm index</p>
                </div>
                <span className="font-mono tabular-nums text-slate-400 font-medium">99.4</span>
              </div>

              <div className="flex items-center justify-between group cursor-pointer">
                <div>
                  <p className="font-semibold text-slate-200 group-hover:text-orange-400 transition-colors">
                    #StartInBharat
                  </p>
                  <p className="text-[11px] text-slate-500">43.1K Posts · Startups & VC</p>
                </div>
                <span className="font-mono tabular-nums text-slate-400 font-medium">94.2</span>
              </div>

              <div className="flex items-center justify-between group cursor-pointer">
                <div>
                  <p className="font-semibold text-slate-200 group-hover:text-orange-400 transition-colors">
                    #UPI
                  </p>
                  <p className="text-[11px] text-slate-500">51.2K Posts · 14.9B Monthly</p>
                </div>
                <span className="font-mono tabular-nums text-slate-400 font-medium">87.1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gifting Modal */}
      {giftingPost && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Gift className="w-4 h-4 text-amber-400" />
                Send Gift to {giftingPost.author.fullName}
              </h4>
              <button
                onClick={() => setGiftingPost(null)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              70% directly credited to creator&apos;s UPI balance in paise, 30% platform commission.
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              {gifts.map((g) => {
                const totalPaise = g.coinPrice * 100;
                const creatorEarnPaise = Math.round(totalPaise * 0.7);
                return (
                  <button
                    key={g.id}
                    onClick={() => handleSendGiftSubmit(g)}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 flex items-center justify-between text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{g.icon}</span>
                      <div>
                        <span className="text-xs font-bold text-white group-hover:text-amber-400">
                          {g.name}
                        </span>
                        <span className="text-[11px] text-slate-400 block font-mono">
                          Creator gets ₹{(creatorEarnPaise / 100).toFixed(2)} (70%)
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-amber-400">
                      {g.coinPrice} Coins
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal Modal */}
      {isWithdrawOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="font-bold text-white text-base flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-emerald-400" />
                Withdraw to UPI (Razorpay Payouts)
              </h4>
              <button
                onClick={() => setIsWithdrawOpen(false)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProcessWithdrawal} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Withdrawal Amount (INR)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    min="100"
                    max={myEarnings.availableBalancePaise / 100}
                    value={withdrawAmountRupees}
                    onChange={(e) => setWithdrawAmountRupees(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-950 text-slate-200 font-mono text-sm rounded-lg border border-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* TDS Calculation Display */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono space-y-1.5 text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>Gross Payout:</span>
                  <span className="text-white">₹{parseFloat(withdrawAmountRupees || '0').toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>1% TDS (Sec 194-O):</span>
                  <span className="text-amber-400">-₹{(parseFloat(withdrawAmountRupees || '0') * 0.01).toFixed(2)}</span>
                </div>
                <div className="pt-1 border-t border-slate-800 flex justify-between font-bold text-emerald-400">
                  <span>Net Disbursed to UPI:</span>
                  <span>₹{(parseFloat(withdrawAmountRupees || '0') * 0.99).toFixed(2)}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Destination UPI ID</label>
                <input
                  type="text"
                  readOnly
                  value={myEarnings.upiId}
                  className="w-full px-3 py-2 bg-slate-950 text-slate-400 font-mono rounded-lg border border-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWithdrawOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg cursor-pointer"
                >
                  Confirm Payout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Story Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={activeStory.author.avatar}
                  alt={activeStory.author.fullName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-white text-xs">{activeStory.author.fullName}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">{activeStory.expiresAt}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveStory(null)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="aspect-[9/16] bg-slate-950 rounded-xl overflow-hidden relative border border-slate-800">
              <img
                src={activeStory.mediaUrl}
                alt="Story"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-slate-300 text-[10px] font-mono">
                {activeStory.viewCount} views
              </div>
            </div>
          </div>
        </div>
      )}
      {/* NestJS Signup DTO Modal */}
      {isSignupOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h4 className="font-bold text-white text-base">NestJS AuthService.signup(dto: SignupDto)</h4>
                <p className="text-xs text-slate-400">PostgreSQL 14+ User Creation & JWT Token Generation</p>
              </div>
              <button
                onClick={() => setIsSignupOpen(false)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteSignup} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">username</label>
                  <input
                    type="text"
                    required
                    value={signupForm.username}
                    onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 text-slate-200 font-mono rounded-lg border border-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">full_name</label>
                  <input
                    type="text"
                    required
                    value={signupForm.full_name}
                    onChange={(e) => setSignupForm({ ...signupForm, full_name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 text-slate-200 font-mono rounded-lg border border-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">email</label>
                <input
                  type="email"
                  required
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 text-slate-200 font-mono rounded-lg border border-slate-800 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">password</label>
                <input
                  type="password"
                  required
                  value={signupForm.password}
                  onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 text-slate-200 font-mono rounded-lg border border-slate-800 focus:outline-none focus:border-orange-500"
                />
              </div>

              {signupResult && (
                <div className="p-3 bg-slate-950 rounded-xl border border-emerald-500/40 space-y-1.5 font-mono text-[11px]">
                  <div className="flex items-center justify-between text-emerald-400 font-bold">
                    <span>201 Created — {signupResult.user.username}</span>
                    <span>bcrypt(12) OK</span>
                  </div>
                  <pre className="text-slate-300 overflow-x-auto max-h-36">
                    {JSON.stringify(signupResult, null, 2)}
                  </pre>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSignupOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-sm shadow-orange-500/20 cursor-pointer"
                >
                  Execute signup(dto)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
