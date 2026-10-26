import React, { useState } from 'react';
import { Image as ImageIcon, RefreshCw } from 'lucide-react';
import { getOptimizedImageUrl } from '../../lib/deviceOptimization';

interface ProgressiveImageProps {
  src: string;
  alt?: string;
  className?: string;
  containerClassName?: string;
  aspectRatioClass?: string;
  width?: number;
  quality?: number;
  onDoubleClick?: () => void;
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt = 'Post media',
  className = 'w-full h-full object-cover',
  containerClassName = '',
  aspectRatioClass = 'aspect-square sm:aspect-[4/3]',
  width = 1080,
  quality = 80,
  onDoubleClick
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const optimizedSrc = getOptimizedImageUrl(src, width, quality);

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasError(false);
    setIsLoaded(false);
    setRetryKey((k) => k + 1);
  };

  return (
    <div
      onDoubleClick={onDoubleClick}
      className={`relative w-full overflow-hidden bg-slate-900 ${aspectRatioClass} ${containerClassName}`}
    >
      {/* Instagram-style Shimmer Skeleton while loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-slate-900 overflow-hidden flex items-center justify-center">
          <div className="w-full h-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.8s_infinite]" />
          <ImageIcon className="absolute w-8 h-8 text-slate-700/60" />
        </div>
      )}

      {/* Error state */}
      {hasError ? (
        <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center gap-2 p-4 text-center text-slate-400">
          <ImageIcon className="w-8 h-8 text-slate-600" />
          <span className="text-xs">फ़ोटो लोड नहीं हो सकी</span>
          <button
            type="button"
            onClick={handleRetry}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-orange-400 border border-slate-700 flex items-center gap-1 transition active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>पुनः प्रयास करें (Retry)</span>
          </button>
        </div>
      ) : (
        <img
          key={`${optimizedSrc}_${retryKey}`}
          src={optimizedSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`${className} transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};
