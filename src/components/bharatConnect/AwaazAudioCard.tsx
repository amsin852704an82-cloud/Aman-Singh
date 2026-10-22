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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-950 to-orange-950/40 border border-orange-500/30 p-4 sm:p-5 shadow-lg select-none">
      {/* Hidden Native Audio Element */}
      <audio ref={audioRef} src={audioSrc} preload="metadata" />

      {/* Background Soulful Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Tag: Awaaz (आवाज़) */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-400 border border-orange-500/40 text-[11px] font-bold flex items-center gap-1.5 shadow-sm">
            <Mic className="w-3 h-3 text-orange-400" />
            <span>आवाज़ (Awaaz Audio)</span>
          </div>
          {post.audioTitle && (
            <span className="text-xs font-semibold text-slate-200 truncate max-w-[200px]">
              {post.audioTitle}
            </span>
          )}
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
      <div className="flex items-center gap-4 py-2">
        {/* Big Circular Play / Pause Button */}
        <button
          type="button"
          onClick={togglePlay}
          className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-orange-500 via-amber-400 to-orange-600 hover:scale-105 active:scale-95 text-slate-950 flex items-center justify-center shadow-lg shadow-orange-500/30 transition shrink-0 cursor-pointer"
          title={isPlaying ? 'रोकें (Pause)' : 'सुने (Play)'}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 fill-slate-950 stroke-none" />
          ) : (
            <Play className="w-6 h-6 fill-slate-950 stroke-none ml-1" />
          )}
        </button>

        {/* Dynamic Waveform Visualizer */}
        <div className="flex-1 space-y-2 min-w-0">
          <div className="h-10 flex items-center gap-1 sm:gap-1.5 px-1 overflow-hidden">
            {barHeights.map((h, idx) => {
              const isPast = (idx / barHeights.length) <= progressRatio;
              return (
                <div
                  key={idx}
                  className="flex-1 rounded-full transition-all duration-150"
                  style={{
                    height: isPlaying ? `${Math.max(15, (h * (0.6 + Math.sin(currentTime * 5 + idx) * 0.4)))}%` : `${h * 0.65}%`,
                    backgroundColor: isPast ? '#f97316' : '#334155'
                  }}
                />
              );
            })}
          </div>

          {/* Scrubber Range Bar */}
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />

          {/* Time Progress */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-0.5">
            <span className="text-orange-400">{formatSeconds(currentTime)}</span>
            <span>{formatSeconds(duration || (typeof post.audioDuration === 'number' ? post.audioDuration : 60))}</span>
          </div>
        </div>
      </div>

      {/* Poetry / Lyrics Subtitle Quote if available */}
      {post.caption && (
        <div className="mt-3 pt-3 border-t border-slate-800/80">
          <p className="text-xs sm:text-sm text-slate-200 font-serif italic leading-relaxed whitespace-pre-line text-center px-2">
            "{post.caption}"
          </p>
        </div>
      )}
    </div>
  );
};
