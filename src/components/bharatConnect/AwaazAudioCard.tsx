import React, { useState, useRef, useEffect } from 'react';
import { Post } from '../../types/bharatConnect';
import { Play, Pause, Mic, Volume2, VolumeX, Sparkles, Music } from 'lucide-react';

interface AwaazAudioCardProps {
  post: Post;
}

export const AwaazAudioCard: React.FC<AwaazAudioCardProps> = ({ post }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const audioSrc = post.audioURL || 'https://actions.google.com/sounds/v1/ambiences/outdoor_ambience.ogg';

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 1.0;
    audio.muted = false;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch((err) => {
        console.warn('Audio play note:', err);
      });
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatSeconds = (sec: number) => {
    if (isNaN(sec) || sec <= 0) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Generate pseudo waveform bars based on post ID
  const barHeights = [40, 65, 85, 50, 95, 70, 30, 80, 100, 60, 45, 90, 75, 55, 85, 60, 95, 40];
  const progressRatio = duration > 0 ? currentTime / duration : 0;

  return (
    <div className="mx-3 mb-3 p-4 bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-gray-800 shadow-md select-none">
      {/* Hidden Native Audio Element */}
      <audio ref={audioRef} src={audioSrc} preload="metadata" />

      {/* Top Header Tag: Awaaz (आवाज़) */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center space-x-2 text-orange-500 text-xs font-medium bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-md w-fit">
          <i className="fa-solid fa-microphone-lines animate-pulse"></i>
          <span>आवाज़ (Awaaz Audio) • {post.audioTitle || 'कबीर दोहा - गुरु और...'}</span>
        </div>

        <button
          type="button"
          onClick={toggleMute}
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title={isMuted ? 'अनम्यूट करें' : 'म्यूट करें'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-slate-400" />}
        </button>
      </div>

      {/* Main Player Visualizer Area */}
      <div className="flex items-center space-x-4">
        {/* Play / Pause Button */}
        <button
          type="button"
          onClick={togglePlay}
          className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 active:scale-95 transition shrink-0 cursor-pointer"
          title={isPlaying ? 'रोकें (Pause)' : 'सुने (Play)'}
        >
          {isPlaying ? (
            <i className="fa-solid fa-pause text-base"></i>
          ) : (
            <i className="fa-solid fa-play text-base ml-0.5"></i>
          )}
        </button>

        {/* Dynamic Waveform Visualizer & Progress */}
        <div className="flex-1 space-y-1.5 min-w-0">
          <div className="flex items-end justify-end space-x-1 mb-1 h-7 text-gray-500">
            {barHeights.slice(0, 12).map((h, idx) => {
              const isPast = (idx / 12) <= progressRatio;
              return (
                <div
                  key={idx}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isPlaying ? 'animate-pulse' : ''
                  }`}
                  style={{
                    height: isPlaying ? `${Math.max(20, (h * (0.6 + Math.sin(currentTime * 5 + idx) * 0.4)))}%` : `${h * 0.55}%`,
                    backgroundColor: isPast ? '#f97316' : '#4b5563'
                  }}
                />
              );
            })}
          </div>

          {/* Scrubber Track Bar */}
          <div 
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickPos = (e.clientX - rect.left) / rect.width;
              if (audioRef.current && duration > 0) {
                audioRef.current.currentTime = clickPos * duration;
                setCurrentTime(clickPos * duration);
              }
            }}
            className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden cursor-pointer relative"
          >
            <div 
              className="bg-orange-500 h-full rounded-full transition-all duration-100" 
              style={{ width: `${Math.min(100, Math.max(0, progressRatio * 100))}%` }}
            />
          </div>

          {/* Time Progress Info */}
          <div className="flex justify-between text-[10px] text-gray-400 font-mono pt-0.5">
            <span className="text-orange-400">{formatSeconds(currentTime)}</span>
            <span>{formatSeconds(duration || (typeof post.audioDuration === 'number' ? post.audioDuration : 30))}</span>
          </div>
        </div>
      </div>

      {/* Poetry / Lyrics Subtitle Quote matching user specification */}
      {post.caption && (
        <div className="mt-3 bg-slate-950/70 border-l-2 border-orange-500 p-3 rounded-r-lg text-center font-serif">
          <p className="text-xs sm:text-sm italic text-amber-100/90 leading-relaxed whitespace-pre-line">
            "{post.caption}"
          </p>
        </div>
      )}
    </div>
  );
};
