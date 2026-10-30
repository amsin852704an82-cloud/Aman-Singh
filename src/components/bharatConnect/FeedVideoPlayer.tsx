import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Heart, Clapperboard, Sparkles } from 'lucide-react';

export interface FeedVideoPlayerProps {
  mediaUrl?: string;
  videoUrl?: string;
  content?: string;
  caption?: string;
  posterUrl?: string;
  onDoubleTap?: () => void;
  likedAnim?: boolean;
}

// वीडियो फीड कार्ड कॉम्पोनेंट जिसमें ऑटो-प्ले और म्यूट/अनम्यूट कंट्रोल शामिल है
export default function FeedVideoPlayer({
  mediaUrl,
  videoUrl,
  content,
  caption,
  posterUrl,
  onDoubleTap,
  likedAnim = false
}: FeedVideoPlayerProps) {
  // Support either mediaUrl or videoUrl
  const effectiveUrl = mediaUrl || videoUrl || '';
  const effectiveContent = content || caption || '';

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // स्टेट्स
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [showCenterIcon, setShowCenterIcon] = useState<'play' | 'pause' | null>(null);
  const lastTapRef = useRef<number>(0);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // विज़ुअल टोस्ट ट्रिगर फंक्शन (1500ms टाइमआउट)
  const triggerToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    setShowToast(true);
    toastTimeoutRef.current = setTimeout(() => {
      setShowToast(false);
    }, 1500);
  };

  // ऑटो-प्ले एवं व्यू-पोर्ट ट्रैकिंग (IntersectionObserver)
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
            video.muted = isMuted;
            video
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => {
                video.muted = true;
                setIsMuted(true);
                video.play().then(() => setIsPlaying(true)).catch(() => {});
              });
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1.0]
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, [effectiveUrl, isMuted]);

  // वीडियो प्रोग्रेस बार अपडेट
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  // म्यूट / अनम्यूट टॉगल हैंडलर
  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;

    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);

    // यूजर ब्लूप्रिंट अनुसार टोस्ट ट्रिगर
    triggerToast(nextMuted ? '🔇 म्यूट (आवाज़ बंद)' : '🔊 आवाज़ चालू (Sound On)');
  };

  // प्ले / पॉज या डबल-टैप हैंडलर
  const handleContainerClick = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      if (onDoubleTap) onDoubleTap();
      lastTapRef.current = 0;
      return;
    }

    lastTapRef.current = now;

    setTimeout(() => {
      if (lastTapRef.current === now && videoRef.current) {
        if (videoRef.current.paused) {
          videoRef.current.play().then(() => {
            setIsPlaying(true);
            setShowCenterIcon('play');
            setTimeout(() => setShowCenterIcon(null), 800);
          }).catch(() => {});
        } else {
          videoRef.current.pause();
          setIsPlaying(false);
          setShowCenterIcon('pause');
          setTimeout(() => setShowCenterIcon(null), 800);
        }
      }
    }, 280);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[350px] bg-[#0F172A] rounded-xl overflow-hidden my-2 select-none group flex items-center justify-center shadow-lg border border-[#334155]"
    >
      {/* वीडियो / मीडिया प्रीव्यू सिमुलेशन */}
      <div 
        onClick={handleContainerClick}
        className="w-full h-full flex justify-center items-center cursor-pointer relative"
      >
        <video
          ref={videoRef}
          src={effectiveUrl}
          poster={posterUrl}
          loop
          playsInline
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          className="w-full h-full object-cover"
        />

        {/* टॉप-लेफ्ट वीडियो बैज */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/75 backdrop-blur-md border border-slate-700/60 text-[11px] font-bold text-orange-400 pointer-events-none">
          <Clapperboard className="w-3.5 h-3.5 text-orange-400" />
          <span>वीडियो</span>
          {isPlaying && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
          )}
        </div>

        {/* म्यूट/अनम्यूट फ्लोटिंग बटन (ब्लूप्रिंट स्टाइल) */}
        <button
          type="button"
          onClick={handleToggleSound}
          className="absolute bottom-4 right-4 z-30 min-h-[44px] min-w-[44px] bg-[rgba(30,41,59,0.85)] hover:bg-[rgba(30,41,59,0.95)] active:scale-95 transition-all p-2.5 rounded-full border border-[#334155] shadow-2xl flex items-center justify-center cursor-pointer text-white"
          title={isMuted ? 'आवाज़ चालू करें' : 'म्यूट करें'}
          aria-label={isMuted ? 'अनम्यूट करें' : 'म्यूट करें'}
        >
          <span className="text-base select-none">{isMuted ? '🔇' : '🔊'}</span>
        </button>

        {/* विज़ुअल टोस्ट नोटिफ़िकेशन (ब्लूप्रिंट स्टाइल: top 45%, border #FF6B00, font 13px bold) */}
        {showToast && (
          <div 
            style={{
              position: 'absolute',
              top: '45%',
              backgroundColor: 'rgba(15, 23, 42, 0.88)',
              paddingLeft: 16,
              paddingRight: 16,
              paddingTop: 8,
              paddingBottom: 8,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: '#FF6B00',
              zIndex: 40,
            }}
            className="flex items-center gap-2 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 pointer-events-none"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 }}>
              {toastMessage}
            </span>
          </div>
        )}

        {/* सेंटर प्ले/पॉज एनीमेशन फीडबैक */}
        {showCenterIcon && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white animate-out fade-out zoom-out duration-700">
              {showCenterIcon === 'play' ? (
                <Play className="w-7 h-7 fill-white translate-x-0.5" />
              ) : (
                <Pause className="w-7 h-7 fill-white" />
              )}
            </div>
          </div>
        )}

        {/* इंस्टाग्राम डबल-टैप हार्ट एनीमेशन */}
        {likedAnim && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="relative flex items-center justify-center">
              <Heart className="w-28 h-28 fill-rose-500 text-rose-500 drop-shadow-[0_10px_25px_rgba(244,63,94,0.6)] animate-ping" />
              <Heart className="absolute w-24 h-24 fill-rose-500 text-rose-500 drop-shadow-2xl" />
            </div>
          </div>
        )}

        {/* बॉटम टाइमलाइन प्रोग्रेस बार */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20 overflow-hidden pointer-events-none">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-[#FF6B00] transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// Named export for compatibility
export { FeedVideoPlayer };
