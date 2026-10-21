import React, { useState, useRef } from 'react';
import { useBharatConnect } from '../../context/BharatConnectContext';
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
  CheckCircle2
} from 'lucide-react';

const PRESET_IMAGES = [
  {
    name: 'दीपावली (Diwali)',
    url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&auto=format&fit=crop&q=80',
    tag: 'DiwaliVibes'
  },
  {
    name: 'ताजमहल (Taj Mahal)',
    url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=900&auto=format&fit=crop&q=80',
    tag: 'IncredibleIndia'
  },
  {
    name: 'बेंगलुरु टेक (Tech City)',
    url: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=900&auto=format&fit=crop&q=80',
    tag: 'DigitalIndia'
  },
  {
    name: 'मसाला चाय (Chai)',
    url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=900&auto=format&fit=crop&q=80',
    tag: 'ChaiLove'
  },
  {
    name: 'हवा महल (Jaipur)',
    url: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=900&auto=format&fit=crop&q=80',
    tag: 'RajasthanDiaries'
  },
  {
    name: 'भारतीय साड़ी (Handloom)',
    url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&auto=format&fit=crop&q=80',
    tag: 'VocalForLocal'
  }
];

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
  const { currentUser, createPost, t, setActiveTab } = useBharatConnect();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [caption, setCaption] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const [imageFileSize, setImageFileSize] = useState<string | null>(null);
  const [isPhoneUpload, setIsPhoneUpload] = useState(false);
  const [location, setLocation] = useState(currentUser.location || 'New Delhi, India');
  const [selectedTags, setSelectedTags] = useState<string[]>(['BharatConnect', 'DesiVibes']);
  
  // Loading & Error States
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Handle image selected from Android phone (gallery or camera)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation: Image type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('कृपया केवल वैध फोटो (.jpg, .jpeg, .png, .webp) चुनें।');
      return;
    }

    // Validation: Size (Max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      setErrorMessage('फ़ोटो का आकार 20MB से कम होना चाहिए।');
      return;
    }

    setIsReadingFile(true);
    const readableSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    setImageFileName(file.name);
    setImageFileSize(readableSize);

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
      setIsPhoneUpload(true);
      setIsReadingFile(false);
    };

    reader.onerror = () => {
      setIsReadingFile(false);
      setErrorMessage('फ़ोन से फ़ोटो पढ़ने में समस्या आई। कृपया पुनः प्रयास करें।');
    };

    reader.readAsDataURL(file);
    // Reset file input so user can pick again if needed
    e.target.value = '';
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImageFileName(null);
    setImageFileSize(null);
    setIsPhoneUpload(false);
    setErrorMessage(null);
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

  const handleSelectPreset = (preset: typeof PRESET_IMAGES[0]) => {
    setErrorMessage(null);
    setSelectedImage(preset.url);
    setImageFileName(preset.name);
    setImageFileSize('वेब फोटो');
    setIsPhoneUpload(false);
    if (!selectedTags.includes(preset.tag)) {
      setSelectedTags((prev) => [...prev, preset.tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation: Must have caption or image
    if (!selectedImage && !caption.trim()) {
      setErrorMessage('कृपया पोस्ट करने के लिए फ़ोटो चुनें या कैप्शन लिखें।');
      return;
    }

    setIsPublishing(true);

    // Realistic brief network delay for Android feedback
    setTimeout(() => {
      try {
        const finalImage = selectedImage || 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80';
        createPost(caption, finalImage, location, selectedTags);
        setIsPublishing(false);
        setSuccessNotice('आपकी पोस्ट सफलतापूर्वक होम फ़ीड में प्रकाशित हो गई!');
        
        // Context createPost already switches tab to 'home' and shows toast
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        setIsPublishing(false);
        setErrorMessage('पोस्ट प्रकाशित करते समय त्रुटि हुई। कृपया पुनः प्रयास करें।');
      }
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
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
              Android फोन से फोटो चुनें, कैप्शन लिखें और पूरे भारत में साझा करें
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

      {/* Error Message Alert */}
      {errorMessage && (
        <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2.5 animate-shake">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="font-medium">{errorMessage}</span>
          <button 
            onClick={() => setErrorMessage(null)} 
            className="ml-auto text-rose-400 hover:text-rose-200 text-sm font-bold"
          >
            ×
          </button>
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
        {/* Creator Info Card */}
        <div className="flex items-center gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80">
          <img
            src={currentUser.avatar}
            alt={currentUser.fullName}
            className="w-10 h-10 rounded-full object-cover border border-orange-500/50"
          />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{currentUser.fullName}</span>
              {currentUser.verified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
              )}
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {currentUser.handle} · {location}
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
            सार्वजनिक (Public)
          </span>
        </div>

        {/* 1. Android Photo Upload / Preview Zone */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-orange-400" />
              <span>फ़ोटो पूर्वावलोकन (Photo Preview)</span>
            </label>
            {selectedImage && (
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                {isPhoneUpload ? 'फ़ोन से चुनी गई फ़ोटो' : 'फ़ोटो चयनित'}
              </span>
            )}
          </div>

          {/* Reading File Spinner */}
          {isReadingFile && (
            <div className="aspect-video w-full rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col items-center justify-center gap-2 text-slate-300">
              <Loader2 className="w-7 h-7 text-orange-400 animate-spin" />
              <span className="text-xs font-medium">फ़ोन से फ़ोटो लोड हो रही है...</span>
            </div>
          )}

          {/* Active Image Preview Box */}
          {!isReadingFile && selectedImage ? (
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md group">
              <img
                src={selectedImage}
                alt="Selected post preview"
                className="w-full h-full object-cover transition duration-300"
              />

              {/* Bottom bar with file details and action buttons */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 flex items-center justify-between">
                <div className="text-[11px] text-slate-200 truncate max-w-[200px]">
                  <span className="font-semibold block truncate">{imageFileName || 'Image'}</span>
                  <span className="text-[10px] text-slate-400">{imageFileSize}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white text-[11px] font-semibold flex items-center gap-1.5 transition active:scale-95"
                  >
                    <Upload className="w-3.5 h-3.5 text-orange-400" />
                    <span>बदलें (Change)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition active:scale-95"
                    title="हटाएं (Remove)"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : !isReadingFile ? (
            /* Upload Dropzone / Touch Target */
            <div className="rounded-2xl border-2 border-dashed border-slate-800 hover:border-orange-500/50 bg-slate-900/40 p-5 text-center transition space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 mx-auto flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-xs font-bold text-white">
                  अपने Android फ़ोन से फ़ोटो चुनें
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  गैलरी से चुनें या तुरंत कैमरे से फोटो लें
                </p>
              </div>

              {/* Mobile Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 active:scale-95 transition"
                >
                  <Upload className="w-4 h-4" />
                  <span>गैलरी से फ़ोटो चुनें (Choose from Gallery)</span>
                </button>

                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 active:scale-95 transition"
                >
                  <Camera className="w-4 h-4 text-orange-400" />
                  <span>कैमरा खोलें (Take Photo)</span>
                </button>
              </div>
            </div>
          ) : null}

          {/* Hidden File Inputs */}
          <input
            ref={fileInputRef}
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
        </div>

        {/* 1-Click Indian Sample Presets (Ideal for mobile ₹0 testing without large data) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>या 1-क्लिक टेस्ट फ़ोटो चुनें (Sample Indian Photos):</span>
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {PRESET_IMAGES.map((preset) => {
              const isSelected = selectedImage === preset.url;
              return (
                <button
                  type="button"
                  key={preset.name}
                  onClick={() => handleSelectPreset(preset)}
                  className={`relative rounded-xl overflow-hidden aspect-square border-2 transition active:scale-95 cursor-pointer ${
                    isSelected
                      ? 'border-orange-500 ring-2 ring-orange-500/30'
                      : 'border-slate-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-black/80 px-1 py-0.5 text-[9px] text-white truncate text-center">
                    {preset.name.split(' ')[0]}
                  </div>
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
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

        {/* 5. Publish Submit Button with Loading State */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isPublishing || isReadingFile}
            className={`w-full py-3.5 rounded-2xl font-bold text-sm tracking-wide shadow-lg transition flex items-center justify-center gap-2 active:scale-[0.99] ${
              isPublishing || isReadingFile
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white shadow-orange-500/20 hover:opacity-95'
            }`}
          >
            {isPublishing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span>पोस्ट प्रकाशित हो रही है... (Publishing...)</span>
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
    </div>
  );
};
