import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';
import { triggerHaptic } from '../../lib/deviceOptimization';

export const NetworkStatusBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      triggerHaptic('success');
      const timer = setTimeout(() => setShowReconnected(false), 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
      triggerHaptic('heavy');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) {
    return null;
  }

  return (
    <div className="fixed top-14 left-0 right-0 z-50 px-3 py-2 flex justify-center pointer-events-none animate-in fade-in slide-in-from-top-2 duration-300">
      {isOnline && showReconnected ? (
        <div className="pointer-events-auto max-w-md bg-emerald-600/95 text-white px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold backdrop-blur-md border border-emerald-400/40">
          <Wifi className="w-4 h-4 text-emerald-200 shrink-0" />
          <span>इंटरनेट पुनः कनेक्ट हो गया! (Back Online)</span>
        </div>
      ) : (
        <div className="pointer-events-auto max-w-md bg-rose-600/95 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center justify-between gap-3 text-xs font-medium backdrop-blur-md border border-rose-400/40">
          <div className="flex items-center gap-2.5">
            <WifiOff className="w-4 h-4 text-rose-200 shrink-0 animate-pulse" />
            <span>इंटरनेट कनेक्शन नहीं है (Offline) · डेटा सुरक्षित है</span>
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-2.5 py-1 rounded-xl bg-black/30 hover:bg-black/50 text-[11px] font-bold text-white flex items-center gap-1 transition active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>रीलोड</span>
          </button>
        </div>
      )}
    </div>
  );
};
