import React, { useState, useRef, useEffect } from 'react';
import { useBharatConnect } from '../../context/BharatConnectContext';
import { uploadPostImage, SmartUploadProgress } from '../../lib/postService';
import { 
  Camera, 
  Upload, 
  MapPin, 
  Tag, 
  Sparkles, 
  Check, 
  X, 
  AlertCircle, 
  Loader2, 
  Image as ImageIcon,
  Trash2,
  Smile,
  CheckCircle2,
  Lock,
  Link2,
  FolderOpen,
  ArrowRight,
  Mic,
  RotateCw,
  Zap,
  Clock,
  HardDrive,
  Film,
  Video,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Palette,
  Sun,
  Flame,
  Moon,
  Feather
} from 'lucide-react';
import { AwaazRecordModal } from './AwaazRecordModal';
import { triggerHaptic } from '../../lib/deviceOptimization';

type StudioTab = 'photo' | 'reel' | 'story' | 'audio';
type PhotoFilter = 'normal' | 'jaipur_warm' | 'kashi_gold' | 'charcoal';

const FILTER_STYLES: Record<PhotoFilter, { name: string; filterCss: string; previewBadge: string }> = {
  normal: { 
    name: 'सामान्य (Normal)', 
    filterCss: 'none', 
    previewBadge: 'bg-slate-800 text-slate-300' 
  },
  jaipur_warm: { 
    name: 'जयपुर वार्म (Jaipur)', 
    filterCss: 'sepia(25%) saturate(140%) brightness(105%) contrast(105%)', 
    previewBadge: 'bg-amber-500/20 text-amber-400 border border-amber-500/40' 
  },
  kashi_gold: { 
    name: 'काशी गोल्ड (Kashi)', 
    filterCss: 'contrast(115%) saturate(130%) brightness(110%) hue-rotate(-10deg)', 
    previewBadge: 'bg-orange-500/20 text-orange-400 border border-orange-500/40' 
  },
  charcoal: { 
    name: 'डार्क चारकोल (Charcoal)', 
    filterCss: 'grayscale(100%) contrast(140%) brightness(95%)', 
    previewBadge: 'bg-zinc-800 text-zinc-200 border border-zinc-700' 
  }
};

const SAMPLE_REEL_VIDEOS = [
  {
    title: 'बनारस के घाट और गंगा आरती',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    poster: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80',
    tags: ['Varanasi', 'GangaAarti', 'SpiritualBharat']
  },
  {
    title: 'भारतीय हस्तशिल्प और बुनकर कला',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    poster: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80',
    tags: ['Hunar', 'MakeInIndia', 'Handicraft']
  },
  {
    title: 'हिमालय की वादियों में भोर',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    poster: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    tags: ['Himalayas', 'IncredibleIndia', 'Nature']
  }
];

const SAMPLE_PHOTOS = [
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1080&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1080&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1080&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1080&auto=format&fit=crop&q=80'
];

const POPULAR_LOCATIONS = [
  'नई दिल्ली, भारत',
  'वाराणसी, उत्तर प्रदेश',
  'मुंबई, महाराष्ट्र',
  'जयपुर, राजस्थान',
  'बेंगलुरु, कर्नाटक',
  'अहमदाबाद, गुजरात',
  'ऋषिकेश, उत्तराखंड',
  'कोलकाता, पश्चिम बंगाल'
];

const SUGGESTED_TAGS = [
  'BharatConnect',
  'DesiVibes',
  'Kavita',
  'IncredibleIndia',
  'Hunar',
  'Shayari',
  'Suvichar',
  'VocalForLocal'
];

const QUICK_EMOJIS = ['🇮🇳', '✨', '🙏', '🪔', '❤️', '🌸', '🚀', '📸'];

export const CreatePostView: React.FC = () => {
  const { 
    currentUser, 
    createPost, 
    createStory,
    createReel,
    t, 
    setActiveTab, 
    isFirebaseAuthLoggedIn, 
    setIsAuthModalOpen,
    setToastMessage 
  } = useBharatConnect();

  // Studio Mode Switcher
  const [activeTab, setActiveTabMode] = useState<StudioTab>('photo');
  const [selectedFilter, setSelectedFilter] = useState<PhotoFilter>('normal');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState(currentUser.location || 'नई दिल्ली, भारत');
  const [selectedTags, setSelectedTags] = useState<string[]>(['BharatConnect', 'DesiVibes']);
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Media States
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaFileName, setMediaFileName] = useState<string | null>(null);
  const [mediaFileSize, setMediaFileSize] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionSavings, setCompressionSavings] = useState<string | null>(null);

  // Video Reel Specific States
  const [videoPosterUrl, setVideoPosterUrl] = useState<string>('');
  const [audioTrackTitle, setAudioTrackTitle] = useState('ओरिजिनल ऑडियो - ' + (currentUser.fullName || 'भारत क्रिएटर'));
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  // Modals & UI States
  const [isAwaazOpen, setIsAwaazOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState('');

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);

  // Reset or adjust media when tab changes
  const handleTabChange = (tab: StudioTab) => {
    triggerHaptic('light');
    setActiveTabMode(tab);
    setErrorMessage(null);

    if (tab === 'audio') {
      setIsAwaazOpen(true);
    } else if (tab === 'reel' && mediaType !== 'video') {
      // Clear image media if switching to reel
      setMediaUri(null);
      setMediaType(null);
    } else if ((tab === 'photo' || tab === 'story') && mediaType === 'video') {
      // Clear video media if switching to photo/story
      setMediaUri(null);
      setMediaType(null);
    }
  };

  // Real client-side canvas WebP compression
  const compressImageToWebP = (file: File): Promise<{ blob: Blob; url: string; originalSize: number; compressedSize: number }> => {
    return new Promise((resolve, reject) => {
      const originalSize = file.size;
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const maxDim = 1080;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('WebP compression failed'));
              return;
            }
            const compressedUrl = URL.createObjectURL(blob);
            resolve({
              blob,
              url: compressedUrl,
              originalSize,
              compressedSize: blob.size
            });
          },
          'image/webp',
          0.85 // 85% high-fidelity WebP
        );
      };

      img.onerror = (err) => reject(err);
      img.src = objectUrl;
    });
  };

  // Handle Photo selection
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('कृपया मान्य फोटो (JPG, PNG, WebP) चुनें।');
      return;
    }

    setErrorMessage(null);
    setIsCompressing(true);
    setMediaFileName(file.name);

    try {
      const res = await compressImageToWebP(file);
      setMediaUri(res.url);
      setMediaType('image');
      setSelectedFile(file);
      const originalMb = (res.originalSize / (1024 * 1024)).toFixed(2);
      const compressedKb = (res.compressedSize / 1024).toFixed(0);
      setMediaFileSize(`${compressedKb} KB (WebP 1080p)`);
      setCompressionSavings(`मूल ${originalMb}MB से घटकर मात्र ${compressedKb}KB रह गई!`);
      triggerHaptic('medium');
    } catch {
      // Fallback: direct object URL
      const directUrl = URL.createObjectURL(file);
      setMediaUri(directUrl);
      setMediaType('image');
      setSelectedFile(file);
      setMediaFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
    } finally {
      setIsCompressing(false);
    }
  };

  // Handle Reel (Video) selection
  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setErrorMessage('कृपया मान्य वीडियो (MP4, WebM) चुनें।');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setErrorMessage('रील वीडियो का आकार 50MB से कम होना चाहिए।');
      return;
    }

    setErrorMessage(null);
    setSelectedFile(file);
    const videoUrl = URL.createObjectURL(file);
    setMediaUri(videoUrl);
    setMediaType('video');
    setMediaFileName(file.name);
    setMediaFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
    setVideoPosterUrl('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80');
    triggerHaptic('medium');
  };

  const handleSelectSampleReel = (sample: typeof SAMPLE_REEL_VIDEOS[0]) => {
    triggerHaptic('light');
    setMediaUri(sample.url);
    setMediaType('video');
    setMediaFileName(sample.title);
    setMediaFileSize('HD 9:16 Streaming');
    setVideoPosterUrl(sample.poster);
    setSelectedTags(sample.tags);
    if (!caption) setCaption(sample.title);
  };

  const handleSelectSamplePhoto = (url: string) => {
    triggerHaptic('light');
    setMediaUri(url);
    setMediaType('image');
    setMediaFileName('देसी रॉयल्टी-फ्री फोटो');
    setMediaFileSize('1080p WebP');
  };

  const handleRemoveMedia = () => {
    if (mediaUri && mediaUri.startsWith('blob:')) {
      URL.revokeObjectURL(mediaUri);
    }
    setMediaUri(null);
    setMediaType(null);
    setSelectedFile(null);
    setMediaFileName(null);
    setMediaFileSize(null);
    setCompressionSavings(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const toggleTag = (tag: string) => {
    triggerHaptic('light');
    if (selectedTags.includes(tag)) {
      setSelectedTags((prev) => prev.filter((t) => t !== tag));
    } else {
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  // Main Publish Action
  const handlePublish = async () => {
    triggerHaptic('medium');
    setErrorMessage(null);

    // 1. Validation
    if (!mediaUri && !caption.trim() && activeTab !== 'audio') {
      setErrorMessage('कृपया कुछ विचार लिखें या फोटो/वीडियो मीडिया चुनें।');
      return;
    }

    setIsPublishing(true);

    try {
      if (activeTab === 'story') {
        // Publish 24h Story
        const storyImg = mediaUri || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1080&auto=format&fit=crop&q=80';
        await createStory(storyImg, caption || 'आपकी स्टोरी');
      } else if (activeTab === 'reel') {
        // Publish Reel Video
        const vidUrl = mediaUri || SAMPLE_REEL_VIDEOS[0].url;
        await createReel(
          vidUrl,
          caption || 'भारतीय रील #BharatConnect',
          audioTrackTitle,
          selectedTags,
          videoPosterUrl || SAMPLE_REEL_VIDEOS[0].poster
        );
      } else {
        // Publish Normal / Photo Post
        const finalImgUrl = mediaUri || '';
        await createPost(
          caption,
          finalImgUrl,
          location,
          selectedTags,
          undefined,
          isAnonymous
        );
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'प्रकाशन में समस्या आई। पुनः प्रयास करें।');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-3 sm:p-5 space-y-4 font-sans">
      {/* Studio Header Card */}
      <div className="bg-[#121212] border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-white tracking-wide">
                भारत स्टूडियो (Creator Studio)
              </h2>
              <p className="text-[11px] text-slate-400">
                उच्च गुणवत्ता में फोटो, रील, 24h स्टोरी और विचार प्रकाशित करें
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('home')}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Studio Tabs: 📸 फोटो | 🎥 रील | ⭕ स्टोरी | 🎙️ आवाज़ */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-950/80 rounded-2xl border border-slate-800/80">
          <button
            type="button"
            onClick={() => handleTabChange('photo')}
            className={`py-2 px-1 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'photo'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 shrink-0" />
            <span>📸 फोटो</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('reel')}
            className={`py-2 px-1 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'reel'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Film className="w-3.5 h-3.5 shrink-0" />
            <span>🎥 रील</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('story')}
            className={`py-2 px-1 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'story'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>⭕ स्टोरी</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('audio')}
            className={`py-2 px-1 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'audio'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mic className="w-3.5 h-3.5 shrink-0" />
            <span>🎙️ आवाज़</span>
          </button>
        </div>
      </div>

      {/* Hidden Native File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoSelect}
        className="hidden"
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        onChange={handleVideoSelect}
        className="hidden"
      />

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-2xl flex items-center gap-2 text-xs text-red-200 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span className="flex-1">{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Media Preview Box */}
      <div className={`relative w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 flex flex-col items-center justify-center transition-all ${
        activeTab === 'reel' ? 'min-h-[460px] max-h-[520px]' : 'min-h-[300px] max-h-[400px]'
      }`}>
        {isCompressing ? (
          <div className="p-8 flex flex-col items-center justify-center space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-white">WebP 1080p में फ़ाइल कंप्रेस हो रही है...</p>
              <p className="text-xs text-slate-400">
                0-क्वालिटी लॉस के साथ तेज़ अपलोडिंग तैयार की जा रही है
              </p>
            </div>
          </div>
        ) : mediaUri ? (
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            {mediaType === 'video' ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <video
                  ref={videoPlayerRef}
                  src={mediaUri}
                  poster={videoPosterUrl}
                  loop
                  playsInline
                  autoPlay
                  muted={isVideoMuted}
                  className="w-full h-full max-h-[500px] object-cover"
                />

                {/* Video Controls Overlay */}
                <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
                  <button
                    type="button"
                    onClick={() => setIsVideoMuted((m) => !m)}
                    className="p-2 rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80 transition"
                  >
                    {isVideoMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveMedia}
                    className="p-2 rounded-full bg-rose-600/80 text-white backdrop-blur-md hover:bg-rose-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="absolute bottom-3 left-3 z-20 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-mono text-orange-400 flex items-center gap-1.5 border border-orange-500/30">
                  <Film className="w-3.5 h-3.5" />
                  <span>9:16 वर्टिकल रील ({mediaFileSize || 'MP4'})</span>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={mediaUri}
                  alt="Preview"
                  style={{ filter: FILTER_STYLES[selectedFilter].filterCss }}
                  className="w-full h-full max-h-[400px] object-cover transition-all duration-300"
                />

                {/* Remove & Filter Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md ${FILTER_STYLES[selectedFilter].previewBadge}`}>
                    {FILTER_STYLES[selectedFilter].name}
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveMedia}
                    className="p-2 rounded-full bg-rose-600/80 text-white backdrop-blur-md hover:bg-rose-600 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {compressionSavings && (
                  <div className="absolute bottom-3 left-3 z-20 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 backdrop-blur-md text-[11px] text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{compressionSavings}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Empty Upload Prompt */
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-4">
            <button
              type="button"
              onClick={() => {
                if (activeTab === 'reel') {
                  videoInputRef.current?.click();
                } else {
                  fileInputRef.current?.click();
                }
              }}
              className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-orange-500/20 to-amber-500/20 border-2 border-dashed border-orange-500/40 hover:border-orange-500 text-orange-400 flex items-center justify-center hover:scale-105 active:scale-95 transition cursor-pointer shadow-inner"
            >
              {activeTab === 'reel' ? <Film className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
            </button>

            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">
                {activeTab === 'reel'
                  ? 'गैलरी से 9:16 वर्टिकल रील चुनें'
                  : activeTab === 'story'
                  ? '24h स्टोरी के लिए फोटो चुनें'
                  : 'फ़ोन या कंप्यूटर से फोटो चुनें'}
              </h3>
              <p className="text-xs text-slate-400">
                {activeTab === 'reel'
                  ? 'MP4, WebM समर्थित (अधिकतम 60 सेकंड)'
                  : 'ऑटोमैटिक 1080p WebP कम्प्रेशन (85% क्वालिटी)'}
              </p>
            </div>

            {/* Quick Sample Media Pickers so user can test instantly */}
            <div className="pt-2 border-t border-slate-800/80 w-full max-w-sm space-y-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                या तुरंत टेस्ट करने के लिए सैंपल चुनें:
              </span>

              {activeTab === 'reel' ? (
                <div className="grid grid-cols-3 gap-2">
                  {SAMPLE_REEL_VIDEOS.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSampleReel(sample)}
                      className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-orange-500/50 text-left transition group"
                    >
                      <img src={sample.poster} alt="poster" className="w-full h-12 object-cover rounded-lg mb-1" />
                      <p className="text-[9px] text-slate-300 font-medium truncate group-hover:text-orange-400">
                        {sample.title}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {SAMPLE_PHOTOS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSamplePhoto(url)}
                      className="rounded-xl overflow-hidden aspect-square border border-slate-800 hover:border-orange-500/50 transition group"
                    >
                      <img src={url} alt="sample" className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Desi Photo Filters (Active only in Photo & Story tab when image selected) */}
      {(activeTab === 'photo' || activeTab === 'story') && mediaUri && (
        <div className="p-3.5 rounded-2xl bg-[#121212] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-orange-400" />
              <span>देशी फिल्टर्स (Desi Presets):</span>
            </span>
            <span className="text-[10px] text-slate-400">1-क्लिक टोन एनहांसमेंट</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['normal', 'jaipur_warm', 'kashi_gold', 'charcoal'] as PhotoFilter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setSelectedFilter(f);
                }}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                  selectedFilter === f
                    ? 'bg-orange-500/20 text-orange-300 border-orange-500 shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                {f === 'jaipur_warm' && <Sun className="w-3.5 h-3.5 text-amber-400" />}
                {f === 'kashi_gold' && <Flame className="w-3.5 h-3.5 text-orange-400" />}
                {f === 'charcoal' && <Moon className="w-3.5 h-3.5 text-slate-300" />}
                {f === 'normal' && <Check className="w-3.5 h-3.5 text-slate-400" />}
                <span className="truncate">{FILTER_STYLES[f].name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reel Soundtrack Info (Only in Reel mode) */}
      {activeTab === 'reel' && (
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5 text-purple-400" />
            <span>ऑडियो ट्रैक का नाम (Audio Track):</span>
          </label>
          <input
            type="text"
            value={audioTrackTitle}
            onChange={(e) => setAudioTrackTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-orange-500"
            placeholder="उदा. ओरिजिनल ऑडियो - राहुल शर्मा"
          />
        </div>
      )}

      {/* Caption & Thoughts Input Area */}
      <div className="bg-[#121212] border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-slate-300 flex items-center gap-1">
            <Feather className="w-3.5 h-3.5 text-orange-400" />
            <span>
              {activeTab === 'story'
                ? 'स्टोरी विचार (Story Text)'
                : activeTab === 'reel'
                ? 'रील कैप्शन & टैग्स'
                : 'कविता, शायरी या विचार (Caption)'}
            </span>
          </span>
          <span className="font-mono text-[11px]">{caption.length} / 500</span>
        </div>

        <textarea
          rows={3}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder={
            activeTab === 'story'
              ? 'स्टोरी पर कुछ सुविचार या शायरी लिखें (24 घंटे में स्वतः समाप्त)...'
              : activeTab === 'reel'
              ? 'रील के बारे में लिखें... #BharatReels #DesiVibes'
              : 'अपने विचार, काव्य या प्रसंग साझा करें #भारतकनेक्ट...'
          }
          className="w-full p-3 bg-slate-950 rounded-2xl border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 resize-none transition"
        />

        {/* Quick Emoji Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setCaption((prev) => prev + emoji);
              }}
              className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-sm transition active:scale-95"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Location & Tags (Optional for Photos and Reels) */}
        {activeTab !== 'story' && (
          <div className="pt-2 border-t border-slate-800/80 space-y-3">
            {/* Location selector */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-orange-400" />
                <span>स्थान (Location):</span>
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-orange-500"
              >
                {POPULAR_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags Pills */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <Tag className="w-3 h-3 text-orange-400" />
                <span>सुझाए गए टैग्स:</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_TAGS.map((tg) => {
                  const isSelected = selectedTags.includes(tg);
                  return (
                    <button
                      key={tg}
                      type="button"
                      onClick={() => toggleTag(tg)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-medium transition cursor-pointer ${
                        isSelected
                          ? 'bg-orange-500 text-white shadow-sm'
                          : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      #{tg} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Anonymous Toggle (दिल से) */}
            {activeTab === 'photo' && (
              <div className="pt-2 flex items-center justify-between p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/30">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-purple-300 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-purple-400" />
                    <span>दिल से (गुमनाम पोस्ट)</span>
                  </span>
                  <p className="text-[10px] text-slate-400">
                    आपका नाम व फोटो छिपा रहेगा, केवल विचार दिखेगा।
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                    isAnonymous ? 'bg-purple-600' : 'bg-slate-700'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    isAnonymous ? 'left-5' : 'left-1'
                  }`} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Publish Action Button */}
        <div className="pt-2">
          <button
            type="button"
            disabled={isPublishing || isCompressing}
            onClick={handlePublish}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-[0.98] transition cursor-pointer disabled:opacity-50"
          >
            {isPublishing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>प्रकाशित हो रहा है...</span>
              </>
            ) : (
              <>
                <span>
                  {activeTab === 'story'
                    ? '24h स्टोरी साझा करें ⭕'
                    : activeTab === 'reel'
                    ? 'रील पब्लिश करें 🎥'
                    : 'पोस्ट पब्लिश करें 🚀'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Awaaz Record Modal */}
      {isAwaazOpen && (
        <AwaazRecordModal
          isOpen={isAwaazOpen}
          onClose={() => {
            setIsAwaazOpen(false);
            if (activeTab === 'audio') setActiveTabMode('photo');
          }}
        />
      )}
    </div>
  );
};
