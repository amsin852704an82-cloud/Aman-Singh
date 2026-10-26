import React, { useState } from 'react';
import { useBharatConnect } from '../../context/BharatConnectContext';
import { 
  Plus, 
  X, 
  Image as ImageIcon, 
  Film, 
  Mic 
} from 'lucide-react';
import { AwaazRecordModal } from './AwaazRecordModal';
import { triggerHaptic } from '../../lib/deviceOptimization';

export const FloatingActionButton: React.FC = () => {
  const { setActiveTab } = useBharatConnect();
  const [expanded, setExpanded] = useState(false);
  const [isAwaazOpen, setIsAwaazOpen] = useState(false);

  const toggleMenu = () => {
    triggerHaptic('medium');
    setExpanded((prev) => !prev);
  };

  const handleOpenPhoto = () => {
    triggerHaptic('light');
    setExpanded(false);
    setActiveTab('create');
  };

  const handleOpenReels = () => {
    triggerHaptic('light');
    setExpanded(false);
    setActiveTab('reels');
  };

  const handleOpenAudio = () => {
    triggerHaptic('light');
    setExpanded(false);
    setIsAwaazOpen(true);
  };

  return (
    <>
      {/* Dimmed backdrop when FAB menu is expanded */}
      {expanded && (
        <div 
          onClick={() => setExpanded(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Floating Action Button Container */}
      <div className="fixed bottom-22 sm:bottom-8 right-5 z-40 flex flex-col items-center gap-3 select-none">
        {/* Expanded Options Menu */}
        {expanded && (
          <div className="flex flex-col items-end gap-2.5 animate-in fade-in slide-in-from-bottom-4 duration-200">
            {/* 1. Photo Post Option */}
            <div className="flex items-center gap-2.5">
              <span className="bg-slate-900/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-slate-700 shadow-md">
                फोटो पोस्ट (Photo)
              </span>
              <button
                type="button"
                onClick={handleOpenPhoto}
                className="w-11 h-11 rounded-full bg-slate-900 hover:bg-orange-500/20 text-orange-400 border border-slate-700 hover:border-orange-500/50 flex items-center justify-center shadow-lg active:scale-90 transition cursor-pointer"
                title="फोटो पोस्ट करें"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
            </div>

            {/* 2. Reel / Video Option */}
            <div className="flex items-center gap-2.5">
              <span className="bg-slate-900/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-slate-700 shadow-md">
                रील्स (Reels / Video)
              </span>
              <button
                type="button"
                onClick={handleOpenReels}
                className="w-11 h-11 rounded-full bg-slate-900 hover:bg-purple-500/20 text-purple-400 border border-slate-700 hover:border-purple-500/50 flex items-center justify-center shadow-lg active:scale-90 transition cursor-pointer"
                title="रील्स देखें व बनाएं"
              >
                <Film className="w-5 h-5" />
              </button>
            </div>

            {/* 3. Audio / Mic Option */}
            <div className="flex items-center gap-2.5">
              <span className="bg-slate-900/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-slate-700 shadow-md">
                आवाज़ / माइक (Audio Voice)
              </span>
              <button
                type="button"
                onClick={handleOpenAudio}
                className="w-11 h-11 rounded-full bg-slate-900 hover:bg-emerald-500/20 text-emerald-400 border border-slate-700 hover:border-emerald-500/50 flex items-center justify-center shadow-lg active:scale-90 transition cursor-pointer"
                title="आवाज़ व शायरी रिकॉर्ड करें"
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Main Saffron FAB Button (#FF9933) */}
        <button
          type="button"
          onClick={toggleMenu}
          aria-label={expanded ? 'मेनू बंद करें' : 'नई पोस्ट बनाएं'}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl shadow-orange-500/25 transition-all duration-300 active:scale-95 cursor-pointer ${
            expanded
              ? 'bg-slate-800 border-2 border-orange-500 rotate-90 text-orange-400'
              : 'bg-[#FF9933] hover:bg-[#f08c28] border-2 border-white/20'
          }`}
        >
          {expanded ? (
            <X className="w-7 h-7 stroke-[2.5]" />
          ) : (
            <Plus className="w-7 h-7 stroke-[2.5]" />
          )}
        </button>
      </div>

      {/* Awaaz Live Audio Recorder Modal */}
      <AwaazRecordModal
        isOpen={isAwaazOpen}
        onClose={() => setIsAwaazOpen(false)}
      />
    </>
  );
};
