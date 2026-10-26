import React, { useState, useRef } from 'react';
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
  HardDrive
} from 'lucide-react';
import { AwaazRecordModal } from './AwaazRecordModal';

const POPULAR_LOCATIONS = [
  'New Delhi, Delhi',
  'Varanasi, Uttar Pradesh',
  'Mumbai, Maharashtra',
  'Bengaluru, Karnataka',
  'Jaipur, Rajasthan',
  'Ahmedabad, Gujarat',
  'Kolkata, West Bengal',
  'Hyderabad, Telangana'
];

const SUGGESTED_TAGS = [
  'BharatConnect',
  'VocalForLocal',
  'IncredibleIndia',
  'DesiVibes',
  'DigitalIndia',
  'AtmanirbharBharat',
  'IndianCulture',
  'StreetFoodIndia'
];

const QUICK_EMOJIS = ['🇮🇳', '✨', '🙏', '🪔', '❤️', '🌸', '🚀', '📸'];

export const CreatePostView: React.FC = () => {
  const { 
    currentUser, 
    createPost, 
    t, 
    setActiveTab, 
    isFirebaseAuthLoggedIn, 
    setIsAuthModalOpen,
    setToastMessage 
  } = useBharatConnect();

  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const [imageFileSize, setImageFileSize] = useState<string | null>(null);
  const [isPhoneUpload, setIsPhoneUpload] = useState(false);
  const [location, setLocation] = useState(currentUser.location || 'New Delhi, India');
  const [selectedTags, setSelectedTags] = useState<string[]>(['BharatConnect', 'DesiVibes']);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  // File inputs ref
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Loading & Progress & Error States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStats, setUploadStats] = useState<SmartUploadProgress | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [isAwaazOpen, setIsAwaazOpen] = useState(false);

  // Handle file selection from Gallery or Camera
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('कृपया केवल फोटो/इमेज फाइल (JPG, PNG, WebP) चुनें।');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('फोटो का आकार 10MB से अधिक नहीं होना चाहिए। (Max 10MB)');
      return;
    }

    setErrorMessage(null);
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setSelectedImage(objectUrl);
    setImageFileName(file.name);
    setImageFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
    setIsPhoneUpload(true);
  };

  const handleApplyCustomUrl = () => {
    setErrorMessage(null);
    const url = customUrlInput.trim();
    if (!url) return;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setErrorMessage('कृपया मान्य वेब फ़ोटो URL (https://...) दर्ज करें।');
      return;
    }
    setSelectedFile(null);
    setSelectedImage(url);
    setImageFileName('वेब फ़ोटो URL');
    setImageFileSize('वेब लिंक');
    setIsPhoneUpload(false);
    setCustomUrlInput('');
  };

  const handleRemoveImage = () => {
    if (selectedImage && selectedImage.startsWith('blob:')) {
      URL.revokeObjectURL(selectedImage);
    }
    setSelectedFile(null);
    setSelectedImage(null);
    setImageFileName(null);
    setImageFileSize(null);
    setIsPhoneUpload(false);
    setErrorMessage(null);
    setUploadProgress(0);
    setUploadStats(null);
    if (galleryInputRef.current) galleryInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags((prev) => prev.filter((t) => t !== tag));
    } else {
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  const handleAddEmoji = (emoji: string) => {
    setCaption((prev) => prev + emoji);
  };

  // Immediate fallback: Publish caption without photo if Storage bucket is uninitialized
  const handlePublishWithoutPhoto = async () => {
    if (!caption.trim()) {
      setErrorMessage('कृपया पोस्ट करने के लिए कुछ टेक्स्ट लिखें।');
      return;
    }
    setErrorMessage(null);
    setIsPublishing(true);
    try {
      await createPost(caption, '', location, selectedTags, undefined, isAnonymous);
      setIsPublishing(false);
      setSuccessNotice(isAnonymous ? 'आपकी गुमनाम पोस्ट प्रकाशित हो गई!' : 'आपकी टेक्स्ट पोस्ट Firestore में प्रकाशित हो गई!');
    } catch (err: any) {
      setIsPublishing(false);
      setErrorMessage(err?.message || 'पोस्ट प्रकाशित करने में त्रुटि हुई।');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Rule 8: Only logged-in users can create posts
    if (!isFirebaseAuthLoggedIn) {
      setErrorMessage('केवल लॉगिन किए हुए यूज़र ही पोस्ट बना सकते हैं। कृपया पहले लॉगिन करें।');
      setIsAuthModalOpen(true);
      return;
    }

    // Must have at least caption or image
    if (!caption.trim() && !selectedImage && !selectedFile) {
      setErrorMessage('कृपया पोस्ट करने के लिए कुछ टेक्स्ट लिखें या फ़ोटो चुनें।');
      return;
    }

    setIsPublishing(true);
    let finalImageUrl = '';

    try {
      // 1. If user selected a local file from Gallery or Camera, upload to Firebase Storage
      if (selectedFile) {
        setIsUploading(true);
        setUploadProgress(5);
        try {
          finalImageUrl = await uploadPostImage(
            selectedFile, 
            (stats) => {
              setUploadStats(stats);
              setUploadProgress(stats.percent);
            },
            isAnonymous
          );
        } catch (uploadErr: any) {
          setIsUploading(false);
          setIsPublishing(false);
          const msg = uploadErr?.message || 'Upload failed. Please check your internet connection.';
          setErrorMessage(msg);
          return;
        }
        setIsUploading(false);
      } else if (selectedImage && !selectedImage.startsWith('blob:')) {
        // Direct web URL
        finalImageUrl = selectedImage;
      }

      // 2. Save post document to Firestore (posts & anonymous_posts)
      await createPost(caption, finalImageUrl, location, selectedTags, undefined, isAnonymous);
      setCaption('');
      handleRemoveImage();
      const successMsg = isAnonymous ? 'आपकी गुमनाम पोस्ट प्रकाशित हो गई! (Dil Se Anonymous Post Live)' : 'आपकी पोस्ट सफलतापूर्वक प्रकाशित हो गई! 🎉 (Post Published)';
      setSuccessNotice(successMsg);
      setToastMessage(successMsg);
      setActiveTab('home');
    } catch (err: any) {
      setIsPublishing(false);
      setIsUploading(false);
      const msg = err?.message || 'पोस्ट प्रकाशित करते समय त्रुटि हुई। कृपया पुनः प्रयास करें।';
      setErrorMessage(msg);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
      {/* Hidden File Inputs for Gallery and Camera */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">
              {t.createNewPost} (Create Post)
            </h1>
            <p className="text-[11px] text-slate-400">
              गैलरी से फोटो चुनें, कैमरा से लें या सीधे टेक्स्ट पोस्ट करें
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('home')}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Switch to Awaaz Audio / Shayari Post Banner */}
      <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-orange-950/40 border border-purple-500/30 flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">आवाज़ (Awaaz) - ऑडियो व शायरी पोस्ट</p>
            <p className="text-[11px] text-slate-400">अपनी आवाज़ में शायरी, कविता या विचार रिकॉर्ड करें</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsAwaazOpen(true)}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-500 hover:to-orange-400 text-white text-xs font-bold shadow-md transition active:scale-95 shrink-0 cursor-pointer"
        >
          🎙️ रिकॉर्डर खोलें
        </button>
      </div>

      {/* Auth Login Required Warning */}
      {!isFirebaseAuthLoggedIn && (
        <div className="mb-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold text-amber-300">लॉगिन आवश्यक है (Firebase Login Required)</p>
              <p className="text-[11px] text-amber-200/80">
                Firestore डेटाबेस में असली पोस्ट बनाने के लिए कृपया अपने खाते से लॉगिन करें।
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition active:scale-95 shrink-0"
          >
            लॉगिन / साइन-अप करें
          </button>
        </div>
      )}

      {/* Error Message Alert with Instant Fallback */}
      {errorMessage && (
        <div className="mb-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-200 text-xs space-y-2 animate-shake">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-rose-300">त्रुटि (Error):</p>
              <p className="text-[11px] leading-relaxed text-rose-200/90">{errorMessage}</p>
            </div>
            <button 
              onClick={() => setErrorMessage(null)} 
              className="text-rose-400 hover:text-rose-200 text-sm font-bold p-1"
            >
              ×
            </button>
          </div>

          {/* Retry Button and Fallback options */}
          <div className="pt-2 border-t border-rose-500/20 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={(e) => handleSubmit(e as any)}
              disabled={isUploading || isPublishing}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>पुनः प्रयास करें (Retry Upload)</span>
            </button>

            {caption.trim() && (
              <button
                type="button"
                onClick={handlePublishWithoutPhoto}
                disabled={isPublishing}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-[11px] transition flex items-center gap-1 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <span>बिना फ़ोटो के टेक्स्ट पोस्ट करें</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Success Notification */}
      {successNotice && (
        <div className="mb-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{successNotice}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 'दिल से' / Anonymous Post Toggle Switch */}
        <div className={`p-4 rounded-2xl border transition-all duration-300 ${
          isAnonymous 
            ? 'bg-purple-950/40 border-purple-500/50 shadow-lg shadow-purple-950/30' 
            : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                isAnonymous 
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' 
                  : 'bg-slate-800 text-slate-400 border border-slate-700/60'
              }`}>
                <Lock className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white tracking-wide">
                    गुमनाम पोस्ट करें (Post Anonymously)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                    दिल से / गुप्त
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  {isAnonymous 
                    ? 'आपकी असली पहचान, नाम और फोटो होम फ़ीड पर पूरी तरह छिपी रहेगी।' 
                    : 'बिना पहचान उजागर किए अपने दिल की बात, मेंटल हेल्थ या सवाल शेयर करें।'}
                </p>
              </div>
            </div>

            {/* Toggle Switch Button */}
            <button
              type="button"
              role="switch"
              aria-checked={isAnonymous}
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                isAnonymous ? 'bg-purple-600' : 'bg-slate-700'
              }`}
            >
              <span className="sr-only">गुमनाम पोस्ट चालू या बंद करें</span>
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  isAnonymous ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {isAnonymous && (
            <div className="mt-3 pt-3 border-t border-purple-500/20 flex items-center gap-2 text-[11px] text-purple-200/90">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse shrink-0"></span>
              <span>
                यह पोस्ट Firestore के <strong>'anonymous_posts'</strong> संग्रह में सुरक्षित होगी।
              </span>
            </div>
          )}
        </div>

        {/* Creator Info Card - Transforms dynamically when anonymous */}
        <div className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
          isAnonymous 
            ? 'bg-purple-900/20 border-purple-500/30' 
            : 'bg-slate-900/60 border-slate-800/80'
        }`}>
          <img
            src={
              isAnonymous 
                ? 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&auto=format&fit=crop&q=80'
                : (currentUser.photoURL || currentUser.avatar)
            }
            alt={isAnonymous ? 'Anonymous' : (currentUser.name || currentUser.fullName)}
            className={`w-10 h-10 rounded-full object-cover border ${
              isAnonymous ? 'border-purple-400' : 'border-orange-500/50'
            }`}
          />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{isAnonymous ? 'गुप्त नागरिक (Anonymous)' : (currentUser.name || currentUser.fullName)}</span>
              {!isAnonymous && currentUser.verified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
              )}
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {isAnonymous ? '@gupt_nagrik · भारत' : `${currentUser.handle} · ${location}`}
            </div>
          </div>
          <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold border ${
            isAnonymous 
              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' 
              : 'bg-slate-800 text-slate-300 border-slate-700'
          }`}>
            {isAnonymous ? '🔒 गुप्त (Anonymous)' : 'सार्वजनिक (Public)'}
          </span>
        </div>

        {/* 1. Photo Selection Zone (Gallery & Camera) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-orange-400" />
              <span>फ़ोटो जोड़ें (Photo Upload / Camera)</span>
            </label>
            {selectedImage && (
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                {isPhoneUpload ? 'फ़ोन से चुनी गई फ़ोटो' : 'फ़ोटो चयनित'}
              </span>
            )}
          </div>

          {/* Active Image Preview Box */}
          {selectedImage ? (
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md group">
              <img
                src={selectedImage}
                alt="Selected post preview"
                className="w-full h-full object-cover transition duration-300"
              />

              {/* Upload Progress Overlay */}
              {isUploading && (
                <div className="absolute inset-0 bg-slate-950/85 flex flex-col items-center justify-center gap-3 p-5 text-white z-20 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 text-orange-400 animate-spin" />
                    <span className="text-sm font-bold bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                      Posting... (Uploading) · {uploadProgress}%
                    </span>
                  </div>

                  {/* Real-time Progress Bar */}
                  <div className="w-full max-w-xs bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700 shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 h-full transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>

                  {/* YouTube-style MB, Speed, and Time Remaining */}
                  {uploadStats ? (
                    <div className="space-y-1.5 text-center font-mono">
                      <p className="text-xs text-slate-200 font-semibold tracking-wide">
                        अपलोड: <span className="text-orange-400">{uploadStats.uploadedMB} MB</span> / {uploadStats.totalMB} MB ({uploadStats.speedMBps} MB/s)
                      </p>
                      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>{uploadProgress >= 100 ? 'सत्यापित हो रहा है...' : `~${uploadStats.timeRemainingSec} सेकंड बचे हैं`}</span>
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <HardDrive className="w-3 h-3" />
                          <span>{uploadStats.originalSizeMB} MB ➔ {uploadStats.compressedSizeMB} MB</span>
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          <span>1080p स्मार्ट कम्प्रेशन</span>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 font-mono">अपलोड शुरू हो रहा है...</span>
                  )}
                </div>
              )}

              {/* Bottom bar with file details and action buttons */}
              {!isUploading && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 flex items-center justify-between">
                  <div className="text-[11px] text-slate-200 truncate max-w-[200px]">
                    <span className="font-semibold block truncate">{imageFileName || 'Image'}</span>
                    <span className="text-[10px] text-slate-400">{imageFileSize}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[11px] font-semibold flex items-center gap-1.5 transition active:scale-95"
                      title="फ़ोटो हटाएं"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>फ़ोटो हटाएं (Remove)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Upload Dropzone with Active Mobile Gallery & Camera Buttons */
            <div className="rounded-2xl border-2 border-dashed border-slate-800 bg-slate-900/40 p-5 text-center space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 mx-auto flex items-center justify-center shadow-inner">
                <Camera className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-xs font-bold text-white">
                  फ़ोन गैलरी से फ़ोटो चुनें या कैमरा से फ़ोटो खींचें
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 max-w-md mx-auto">
                  फ़ोटो Firebase Storage पर अपलोड होगी और उसका लिंक Firestore में सुरक्षित सेव होगा।
                </p>
              </div>

              {/* Active Mobile Gallery and Camera Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-95 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 active:scale-95 transition cursor-pointer"
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>गैलरी से फ़ोटो चुनें (Gallery)</span>
                </button>

                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-white text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 active:scale-95 transition cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-orange-400" />
                  <span>कैमरा खोलें (Take Photo)</span>
                </button>
              </div>

              {/* Optional Web Photo URL Input */}
              <div className="pt-2 border-t border-slate-800/80 text-left">
                <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                  या वेब फ़ोटो लिंक (Direct Image URL) डालें:
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="url"
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                    <Link2 className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCustomUrl}
                    className="px-3.5 py-2 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30 text-xs font-bold transition active:scale-95 shrink-0"
                  >
                    लिंक जोड़ें
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>


        {/* 2. Caption Textarea & Emoji Toolbar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-200">
              {t.writeCaption} (Post Caption)
            </label>
            <span className={`text-[11px] ${caption.length > 450 ? 'text-amber-400' : 'text-slate-500'}`}>
              {caption.length} / 500
            </span>
          </div>

          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={500}
            placeholder="आज आप क्या साझा करना चाहते हैं? (जैसे: बनारस के घाटों पर शाम का दृश्य #IncredibleIndia 🇮🇳)"
            rows={3}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition resize-none shadow-inner leading-relaxed"
          />

          {/* Quick Emoji Bar for Mobile Android keyboards */}
          <div className="flex items-center gap-1.5 pt-0.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] text-slate-500 flex items-center gap-1 mr-1">
              <Smile className="w-3.5 h-3.5" />
              त्वरित इमोजी:
            </span>
            {QUICK_EMOJIS.map((emoji) => (
              <button
                type="button"
                key={emoji}
                onClick={() => handleAddEmoji(emoji)}
                className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-center text-xs active:scale-90 transition shrink-0"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Location Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-orange-400" />
            <span>{t.addLocation}</span>
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
          />
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_LOCATIONS.map((loc) => (
              <button
                type="button"
                key={loc}
                onClick={() => setLocation(loc)}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition ${
                  location === loc
                    ? 'bg-orange-500/20 text-orange-400 border-orange-500/40 font-semibold'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                {loc.split(',')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Hashtags */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-orange-400" />
            <span>{t.addTags}</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_TAGS.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`text-xs px-3 py-1 rounded-full font-medium transition active:scale-95 ${
                    active
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm font-semibold'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Publish Submit Button with Loading & Progress State */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isPublishing || isUploading}
            className={`w-full py-3.5 rounded-2xl font-bold text-sm tracking-wide shadow-lg transition flex items-center justify-center gap-2 active:scale-[0.99] ${
              isPublishing || isUploading
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white shadow-orange-500/20 hover:opacity-95 cursor-pointer'
            }`}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span>
                  {uploadStats
                    ? `Posting... ${uploadStats.uploadedMB}/${uploadStats.totalMB} MB (${uploadStats.speedMBps} MB/s) · ${uploadProgress}%`
                    : `Posting... (Uploading) · ${uploadProgress}%`}
                </span>
              </>
            ) : isPublishing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span>Posting... (Saving to Feed)</span>
              </>
            ) : !isFirebaseAuthLoggedIn ? (
              <>
                <AlertCircle className="w-4 h-4 text-amber-300" />
                <span>पोस्ट करने के लिए पहले लॉगिन करें (Login to Publish)</span>
              </>
            ) : (
              <>
                <span>{t.publish}</span>
                <span>· (Publish Post to Home Feed)</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Awaaz Live Audio Recorder / Shayari Modal */}
      <AwaazRecordModal
        isOpen={isAwaazOpen}
        onClose={() => setIsAwaazOpen(false)}
      />
    </div>
  );
};
