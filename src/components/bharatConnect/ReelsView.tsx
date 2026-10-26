import React, { useState, useRef, useEffect } from 'react';
import { useBharatConnect } from '../../context/BharatConnectContext';
import { Heart, MessageCircle, Share2, Music, CheckCircle2, MoreVertical, ChevronDown, ChevronUp, Volume2, VolumeX, Play, Pause, Radio } from 'lucide-react';
import { ReportModal } from './ReportModal';
import { Post } from '../../types/bharatConnect';

export const ReelsView: React.FC = () => {
  const { 
    reels, 
    toggleLikeReel, 
    toggleFollowUser, 
    users, 
    setToastMessage 
  } = useBharatConnect();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [likeHeartAnim, setLikeHeartAnim] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentReel = reels[currentIndex] || reels[0];
  const creatorUser = users.find((u) => u.id === currentReel?.author?.id) || currentReel?.author;

  // Sync Video & Audio playback, volume, and mute status
  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;

    if (video) {
      video.volume = 1.0;
      video.muted = isMuted;
      if (isPlaying) {
        video.play().catch(() => {
          // Autoplay policy fallback: mute first then play
          video.muted = true;
          video.play().catch(() => {});
        });
      } else {
        video.pause();
      }
    }

    if (audio) {
      audio.volume = 1.0;
      audio.muted = isMuted;
      if (isPlaying) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    }
  }, [currentIndex, isPlaying, isMuted]);

  const handleNext = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0); // loop
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(reels.length - 1);
    }
  };

  const handleToggleSound = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      videoRef.current.volume = 1.0;
    }
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
      audioRef.current.volume = 1.0;
      if (!nextMuted) {
        audioRef.current.play().catch(() => {});
      }
    }
  };

  const handleLike = () => {
    toggleLikeReel(currentReel.id);
    if (!currentReel.isLiked) {
      setLikeHeartAnim(true);
      setTimeout(() => setLikeHeartAnim(false), 700);
    }
  };

  const handleDoubleTap = () => {
    if (!currentReel.isLiked) {
      toggleLikeReel(currentReel.id);
    }
    setLikeHeartAnim(true);
    setTimeout(() => setLikeHeartAnim(false), 700);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`https://bharatconnect.app/reels/${currentReel.id}`);
    setToastMessage('रील लिंक कॉपी हो गया! (Reel Link Copied)');
  };

  // Convert reel to simulated post for ReportModal if needed
  const pseudoPost: Post = {
    id: currentReel.id,
    author: currentReel.author,
    caption: currentReel.caption,
    imageUrl: currentReel.posterUrl,
    likesCount: currentReel.likesCount,
    commentsCount: currentReel.commentsCount,
    sharesCount: 12,
    isLiked: currentReel.isLiked,
    isSaved: false,
    locationName: 'India',
    createdAt: 'Just now',
    language: 'hi',
    tags: currentReel.tags,
    comments: []
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] p-2 sm:p-4">
      <div className="relative w-full max-w-[390px] h-[680px] bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col justify-between">
        
        {/* Real HTML5 Video Playback Element */}
        <div 
          className="absolute inset-0 cursor-pointer select-none bg-black"
          onDoubleClick={handleDoubleTap}
          onClick={() => setIsPlaying((p) => !p)}
        >
          <video
            ref={videoRef}
            key={currentReel.id}
            src={currentReel.videoUrl}
            poster={currentReel.posterUrl}
            loop
            playsInline
            autoPlay
            muted={isMuted}
            className="w-full h-full object-cover"
          />

          {/* Dedicated Soundtrack Audio Element for ambient crisp audio */}
          <audio
            ref={audioRef}
            src="https://actions.google.com/sounds/v1/ambiences/outdoor_ambience.ogg"
            loop
            preload="auto"
          />

          {/* Subtle gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90 pointer-events-none" />

          {/* Interactive Tap-to-Unmute Pill Banner if muted */}
          {isMuted && (
            <button
              type="button"
              onClick={handleToggleSound}
              className="absolute top-16 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1.5 rounded-full bg-slate-900/90 text-orange-300 border border-orange-500/50 shadow-xl backdrop-blur-md flex items-center gap-2 text-xs font-bold hover:scale-105 active:scale-95 transition"
            >
              <VolumeX className="w-4 h-4 text-orange-400 animate-pulse" />
              <span>🔊 आवाज़ चालू करें (Tap to Unmute)</span>
            </button>
          )}

          {/* Pause overlay icon */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none z-20">
              <div className="w-16 h-16 rounded-full bg-black/60 flex items-center justify-center text-white backdrop-blur-sm animate-scale-in">
                <Play className="w-8 h-8 fill-white ml-1" />
              </div>
            </div>
          )}

          {/* Double tap heart animation */}
          {likeHeartAnim && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <Heart className="w-24 h-24 text-rose-500 fill-rose-500 animate-ping" />
            </div>
          )}
        </div>

        {/* Top Bar inside Reel */}
        <div className="relative z-10 px-4 pt-4 flex items-center justify-between text-white pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-orange-400 to-amber-200 bg-clip-text text-transparent">
              रील्स (Reels)
            </span>
            <span className="text-[11px] bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full font-medium">
              {currentIndex + 1} / {reels.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleToggleSound}
              className={`p-2 rounded-full backdrop-blur-md transition active:scale-95 cursor-pointer ${
                isMuted ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-black/50 text-white hover:bg-black/70'
              }`}
              aria-label="Toggle sound"
              title={isMuted ? 'आवाज़ चालू करें' : 'म्यूट करें'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
            <button 
              onClick={() => setReportModalOpen(true)}
              className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 active:scale-95 transition cursor-pointer"
              aria-label="Options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center / Navigation Indicators */}
        <div className="relative z-10 hidden sm:flex flex-col items-center gap-2 absolute right-2 top-1/2 -translate-y-1/2">
          <button 
            onClick={handlePrev} 
            className="w-8 h-8 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center backdrop-blur-sm transition active:scale-95"
            title="Previous Reel"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <button 
            onClick={handleNext} 
            className="w-8 h-8 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center backdrop-blur-sm transition active:scale-95"
            title="Next Reel"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Metadata & Right Actions */}
        <div className="relative z-10 p-4 flex items-end justify-between gap-4">
          {/* Reel Information */}
          <div className="flex-1 text-white pr-2 space-y-2">
            {/* Creator Row */}
            <div className="flex items-center gap-2.5">
              <img 
                src={creatorUser?.avatar || currentReel.author.avatar} 
                alt={creatorUser?.fullName} 
                className="w-10 h-10 rounded-full object-cover border-2 border-orange-500 shadow-md"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm leading-tight text-white drop-shadow-sm">
                    {creatorUser?.fullName}
                  </span>
                  {creatorUser?.verified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
                  )}
                </div>
                <span className="text-[12px] text-slate-300 drop-shadow-sm">
                  {creatorUser?.handle}
                </span>
              </div>

              {/* Follow Button */}
              {creatorUser && (
                <button
                  onClick={() => toggleFollowUser(creatorUser.id)}
                  className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition active:scale-95 ${
                    creatorUser.isFollowing
                      ? 'bg-white/20 text-white backdrop-blur-md border border-white/30'
                      : 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                  }`}
                >
                  {creatorUser.isFollowing ? 'फ़ॉलो कर रहे हैं' : 'फ़ॉलो करें'}
                </button>
              )}
            </div>

            {/* Caption & Tags */}
            <p className="text-xs text-slate-100 font-medium leading-relaxed drop-shadow line-clamp-2">
              {currentReel.caption}
            </p>
            <div className="flex flex-wrap gap-1.5 text-[11px] text-amber-300 font-medium">
              {currentReel.tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>

            {/* Audio Track with Animated Spinning Disc & Live Equalizer Waves */}
            <div 
              onClick={handleToggleSound}
              className="flex items-center gap-2 text-xs text-slate-200 bg-black/40 hover:bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full w-fit cursor-pointer transition select-none"
              title={isMuted ? 'साउंड ऑन करें' : 'साउंड म्यूट करें'}
            >
              <Music className={`w-3.5 h-3.5 ${!isMuted ? 'text-orange-400' : 'text-slate-400'}`} />
              <div className="overflow-hidden w-36 text-ellipsis whitespace-nowrap text-[11px] font-medium">
                {currentReel.audioTitle}
              </div>
              {!isMuted && isPlaying ? (
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 bg-emerald-400 rounded-full animate-bounce h-2.5" />
                  <span className="w-0.5 bg-amber-400 rounded-full animate-bounce h-3 delay-100" />
                  <span className="w-0.5 bg-orange-400 rounded-full animate-bounce h-2 delay-200" />
                </div>
              ) : (
                <VolumeX className="w-3 h-3 text-red-400" />
              )}
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-col items-center gap-4 pb-2">
            {/* Like */}
            <button 
              onClick={handleLike}
              className="flex flex-col items-center gap-1 group active:scale-90 transition"
            >
              <div className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition ${
                currentReel.isLiked ? 'bg-rose-500/20 text-rose-500' : 'bg-black/50 text-white'
              }`}>
                <Heart className={`w-6 h-6 ${currentReel.isLiked ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
              </div>
              <span className="text-[11px] font-semibold text-white drop-shadow">
                {currentReel.likesCount}
              </span>
            </button>

            {/* Comments */}
            <button 
              onClick={() => setToastMessage(`टिप्पणियां देखें (${currentReel.commentsCount})`)}
              className="flex flex-col items-center gap-1 group active:scale-90 transition"
            >
              <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white">
                <MessageCircle className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-semibold text-white drop-shadow">
                {currentReel.commentsCount}
              </span>
            </button>

            {/* Share */}
            <button 
              onClick={handleShare}
              className="flex flex-col items-center gap-1 group active:scale-90 transition"
            >
              <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white">
                <Share2 className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-semibold text-white drop-shadow">
                शेयर
              </span>
            </button>

            {/* Audio Disc spinning animation */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 p-0.5 animate-spin mt-2">
              <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Swipe Buttons helper */}
        <div className="sm:hidden absolute top-1/2 right-2 -translate-y-1/2 z-20 flex flex-col gap-2">
          <button 
            onClick={handlePrev} 
            className="w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center border border-white/20 active:scale-95"
            aria-label="Previous"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <button 
            onClick={handleNext} 
            className="w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center border border-white/20 active:scale-95"
            aria-label="Next"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* Report Modal */}
      {reportModalOpen && (
        <ReportModal 
          targetPost={pseudoPost} 
          onClose={() => setReportModalOpen(false)} 
        />
      )}
    </div>
  );
};
