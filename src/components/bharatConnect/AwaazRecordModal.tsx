import React, { useState, useRef, useEffect } from 'react';
import { useBharatConnect } from '../../context/BharatConnectContext';
import { uploadPostAudio } from '../../lib/postService';
import { 
  X, 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  Check, 
  Music, 
  Radio, 
  RefreshCw 
} from 'lucide-react';

interface AwaazRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_RECITATIONS = [
  {
    title: 'मिर्ज़ा ग़ालिब - हज़ारों ख़्वाहिशें ऐसी',
    caption: 'हज़ारों ख़्वाहिशें ऐसी कि हर ख़्वाहिश पे दम निकले\nबहुत निकले मिरे अरमाँ लेकिन फिर भी कम निकले ✨',
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/wind_in_trees.ogg',
    duration: 42,
    tag: 'Shayari'
  },
  {
    title: 'गुलज़ार शैली - वक़्त की बात',
    caption: 'वक़्त रहता नहीं कहीं टिक कर, इसकी आदत भी आदमी सी है 🍂\nज़िंदगी को गले लगाओ, कल किसने देखा है।',
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/daytime_forest_bonanza.ogg',
    duration: 35,
    tag: 'Kavita'
  },
  {
    title: 'कबीर दोहा - गुरु और गोविंद',
    caption: 'गुरु गोविंद दोऊ खड़े, काके लागूं पांय।\nबलिहारी गुरु आपने, गोविंद दियो बताय॥ 🙏',
    audioUrl: 'https://actions.google.com/sounds/v1/water/creek_water_lapping.ogg',
    duration: 30,
    tag: 'KabirDoha'
  },
  {
    title: 'सुबह का प्रेरक विचार (Motivational Thought)',
    caption: 'उठो, जागो और तब तक मत रुको जब तक लक्ष्य की प्राप्ति न हो जाए।\nआज का दिन आपका है! 🇮🇳🚀',
    audioUrl: 'https://actions.google.com/sounds/v1/animals/crows_calling.ogg',
    duration: 28,
    tag: 'Suvichar'
  }
];

export const AwaazRecordModal: React.FC<AwaazRecordModalProps> = ({ isOpen, onClose }) => {
  const { 
    currentUser, 
    createPost, 
    isFirebaseAuthLoggedIn, 
    setIsAuthModalOpen, 
    setToastMessage 
  } = useBharatConnect();

  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedTag, setSelectedTag] = useState('Shayari');
  const [selectedAudioUrl, setSelectedAudioUrl] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedDuration, setRecordedDuration] = useState<number>(0);

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!isOpen) return null;

  // Start Live Microphone Recording
  const startRecording = async () => {
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setRecordedBlob(audioBlob);
        setSelectedAudioUrl(URL.createObjectURL(audioBlob));
        setRecordedDuration(recordingSeconds);
        // Stop all audio tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 120) {
            stopRecording();
            return 120;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      console.error('Microphone error:', err);
      setErrorMessage('माइक्रोफ़ोन अनुमति नहीं मिल सकी। आप नीचे दिए गए 1-क्लिक सैम्पल का उपयोग कर सकते हैं।');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_RECITATIONS[0]) => {
    setErrorMessage(null);
    setTitle(sample.title);
    setCaption(sample.caption);
    setSelectedTag(sample.tag);
    setSelectedAudioUrl(sample.audioUrl);
    setRecordedBlob(null);
    setRecordedDuration(sample.duration);
    setToastMessage(`सैम्पल चयनित: ${sample.title.split('-')[0]}`);
  };

  const togglePreviewPlay = () => {
    if (!previewAudioRef.current) return;
    if (isPreviewPlaying) {
      previewAudioRef.current.pause();
      setIsPreviewPlaying(false);
    } else {
      previewAudioRef.current.play().then(() => setIsPreviewPlaying(true));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isFirebaseAuthLoggedIn) {
      setErrorMessage('पोस्ट करने के लिए कृपया पहले लॉगिन करें।');
      setIsAuthModalOpen(true);
      return;
    }

    if (!selectedAudioUrl && !recordedBlob) {
      setErrorMessage('कृपया अपनी आवाज़ रिकॉर्ड करें या कोई सैम्पल चुनें।');
      return;
    }

    if (!caption.trim()) {
      setErrorMessage('कृपया शायरी, कविता या विचार का विवरण लिखें।');
      return;
    }

    setIsPublishing(true);
    let finalAudioUrl = selectedAudioUrl || '';

    try {
      // If user recorded live voice, upload to Firebase Storage
      if (recordedBlob) {
        setUploadProgress(10);
        finalAudioUrl = await uploadPostAudio(recordedBlob, (prog) => {
          setUploadProgress(prog);
        });
      }

      await createPost(
        caption.trim(),
        '',
        currentUser.location || 'India',
        ['Awaaz', selectedTag, 'BharatConnect'],
        {
          audioURL: finalAudioUrl,
          audioDuration: recordedDuration || 45,
          audioTitle: title.trim() || 'मेरी आवाज़'
        }
      );

      setToastMessage('आपकी आवाज़ की पोस्ट प्रकाशित हो गई! 🎙️✨');
      onClose();
    } catch (err: any) {
      console.error('Error publishing Awaaz post:', err);
      setErrorMessage(err?.message || 'ऑडियो पोस्ट प्रकाशित करने में समस्या आई।');
    } finally {
      setIsPublishing(false);
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span>आवाज़ (Awaaz Audio Post)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold">
                  नया
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                अपनी आवाज़ में शायरी, कविता, विचार या लोकगीत साझा करें
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. Live Recording Card */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-3">
            <div className="flex items-center justify-center">
              {isRecording ? (
                <div className="relative flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-rose-500/20 animate-ping absolute" />
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="w-16 h-16 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/40 relative z-10 active:scale-95 transition"
                    title="रिकॉर्डिंग रोकें (Stop)"
                  >
                    <Square className="w-6 h-6 fill-white" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={startRecording}
                  className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 active:scale-95 transition cursor-pointer"
                  title="रिकॉर्ड शुरू करें"
                >
                  <Mic className="w-7 h-7" />
                </button>
              )}
            </div>

            <div>
              <span className={`text-base font-mono font-bold ${isRecording ? 'text-rose-400 animate-pulse' : 'text-slate-300'}`}>
                {isRecording ? `रिकॉर्डिंग चालू है... ${formatTimer(recordingSeconds)}` : 'माइक दबाकर अपनी आवाज़ रिकॉर्ड करें'}
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                अधिकतम 2 मिनट की ऑडियो क्लिप रिकॉर्ड कर सकते हैं।
              </p>
            </div>

            {/* Audio Preview if selected or recorded */}
            {selectedAudioUrl && !isRecording && (
              <div className="pt-2 flex items-center justify-center gap-3">
                <audio
                  ref={previewAudioRef}
                  src={selectedAudioUrl}
                  onEnded={() => setIsPreviewPlaying(false)}
                />
                <button
                  type="button"
                  onClick={togglePreviewPlay}
                  className="px-3.5 py-1.5 rounded-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/40 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
                >
                  {isPreviewPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-orange-400" />}
                  <span>{isPreviewPlaying ? 'रोकें' : 'सुनकर देखें (Listen Preview)'}</span>
                </button>

                {recordedBlob && (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="p-1.5 rounded-full text-slate-400 hover:text-white transition"
                    title="पुनः रिकॉर्ड करें"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 2. 1-Click Indian Audio Presets (Instant testing without microphone) */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>या 1-क्लिक सैम्पल शायरी व कविता चुनें:</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SAMPLE_RECITATIONS.map((sample) => {
                const isSelected = selectedAudioUrl === sample.audioUrl && !recordedBlob;
                return (
                  <button
                    type="button"
                    key={sample.title}
                    onClick={() => handleSelectSample(sample)}
                    className={`p-2.5 rounded-2xl border text-left transition active:scale-98 cursor-pointer ${
                      isSelected
                        ? 'bg-orange-500/15 border-orange-500 text-white'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-white truncate block">
                        {sample.title.split('-')[0]}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-orange-400 shrink-0" />}
                    </div>
                    <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                      {sample.caption.split('\n')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Title & Caption */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-200">
              ऑडियो का शीर्षक (Title)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="जैसे: मिर्ज़ा ग़ालिब की प्रसिद्ध ग़ज़ल या मेरी कविता"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-200">
              शायरी / कविता के शब्द (Caption / Lyrics)
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              placeholder="अपनी शायरी या कविता यहाँ लिखें ताकि सुनने वाले शब्द भी पढ़ सकें..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 resize-none leading-relaxed"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isPublishing || isRecording}
              className="w-full py-3 rounded-2xl font-bold text-xs sm:text-sm bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/20 hover:opacity-95 disabled:opacity-50 transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>प्रकाशित हो रहा है... {uploadProgress > 0 && `(${uploadProgress}%)`}</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>आवाज़ फ़ीड में पोस्ट करें (Publish Audio Post)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
