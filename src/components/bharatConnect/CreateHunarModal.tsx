import React, { useState } from 'react';
import { useBharatConnect } from '../../context/BharatConnectContext';
import { createFirestoreHunarPost } from '../../lib/hunarService';
import { uploadPostImage } from '../../lib/postService';
import { HunarCategory, HunarLevel, HunarOfferType } from '../../types/bharatConnect';
import { 
  X, 
  Sparkles, 
  GraduationCap, 
  Camera, 
  Upload, 
  Loader2, 
  Check, 
  AlertCircle, 
  MapPin, 
  BookOpen, 
  Code, 
  Utensils, 
  Music, 
  Palette, 
  Activity, 
  Image as ImageIcon 
} from 'lucide-react';

interface CreateHunarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORY_OPTIONS: { id: HunarCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'coding', label: '💻 कोडिंग व टेक (Coding)', icon: <Code className="w-4 h-4 text-blue-400" /> },
  { id: 'cooking', label: '🍲 भारतीय कुकिंग (Cooking)', icon: <Utensils className="w-4 h-4 text-amber-400" /> },
  { id: 'guitar', label: '🎸 गिटार व संगीत (Music)', icon: <Music className="w-4 h-4 text-purple-400" /> },
  { id: 'painting', label: '🎨 चित्रकला व आर्ट (Painting)', icon: <Palette className="w-4 h-4 text-pink-400" /> },
  { id: 'yoga', label: '🧘 योग व ध्यान (Yoga/Fitness)', icon: <Activity className="w-4 h-4 text-emerald-400" /> },
  { id: 'photography', label: '📸 फ़ोटोग्राफ़ी (Photography)', icon: <Camera className="w-4 h-4 text-orange-400" /> },
  { id: 'crafts', label: '🧵 हस्तशिल्प व कला (Crafts)', icon: <Sparkles className="w-4 h-4 text-yellow-400" /> }
];

const PRESET_SKILL_IMAGES = [
  { name: 'कोडिंग', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80' },
  { name: 'कुकिंग', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80' },
  { name: 'गिटार', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80' },
  { name: 'पेंटिंग', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80' },
  { name: 'योग', url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80' },
  { name: 'हस्तशिल्प', url: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=800&auto=format&fit=crop&q=80' }
];

export const CreateHunarModal: React.FC<CreateHunarModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { 
    currentUser, 
    firebaseUser, 
    isFirebaseAuthLoggedIn, 
    setIsAuthModalOpen, 
    setToastMessage 
  } = useBharatConnect();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HunarCategory>('coding');
  const [level, setLevel] = useState<HunarLevel>('beginner');
  const [offerType, setOfferType] = useState<HunarOfferType>('teach');
  const [location, setLocation] = useState(currentUser.location || 'ऑनलाइन · भारत');
  const [mediaUrl, setMediaUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('कृपया केवल इमेज फाइल चुनें।');
      return;
    }

    setSelectedFile(file);
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setMediaUrl('');
    setErrorMessage(null);
  };

  const handleSelectPreset = (url: string) => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(url);
    setMediaUrl(url);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('कृपया हुनर का शीर्षक (Skill Title) दर्ज करें।');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('कृपया हुनर के बारे में थोड़ा विवरण लिखें।');
      return;
    }

    if (!isFirebaseAuthLoggedIn && !firebaseUser) {
      setErrorMessage('हुनर पोस्ट करने के लिए कृपया पहले लॉगिन करें।');
      setIsAuthModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      let finalMediaUrl = mediaUrl;

      // Upload file to Firebase Storage if selected
      if (selectedFile) {
        try {
          finalMediaUrl = await uploadPostImage(selectedFile);
        } catch (uploadErr) {
          console.warn('Storage upload fallback, using sample image:', uploadErr);
          finalMediaUrl = PRESET_SKILL_IMAGES[0].url;
        }
      } else if (!finalMediaUrl) {
        // Pick category matching preset
        const matched = PRESET_SKILL_IMAGES.find((p) => p.name.toLowerCase().includes(category)) || PRESET_SKILL_IMAGES[0];
        finalMediaUrl = matched.url;
      }

      const currentUid = currentUser.uid || currentUser.id || firebaseUser?.uid || 'usr_05';
      const currentName = currentUser.name || currentUser.fullName || 'भारत हुनरमंद';
      const currentPhoto = currentUser.photoURL || currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';
      const currentHandle = currentUser.handle || '@hunar_creator';

      await createFirestoreHunarPost({
        authorUid: currentUid,
        authorName: currentName,
        authorPhotoURL: currentPhoto,
        authorHandle: currentHandle,
        title: title.trim(),
        description: description.trim(),
        category,
        level,
        offerType,
        mediaUrl: finalMediaUrl,
        mediaType: 'image',
        location: location.trim()
      });

      setToastMessage('आपका हुनर सफलतापूर्वक पोस्ट हो गया! 🎓✨');
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error creating hunar post:', err);
      setErrorMessage(err?.message || 'हुनर पोस्ट करने में त्रुटि हुई। पुनः प्रयास करें।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Modal Header with Saffron-White-Green Accent */}
        <div className="relative p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-orange-950/40 via-slate-900 to-emerald-950/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-slate-950 flex items-center justify-center shadow-md">
              <GraduationCap className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                <span>नया हुनर जोड़ें (Share Skill)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  Skill Exchange
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                दूसरों को सिखाएं या नया हुनर सीखने के लिए पोस्ट करें
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[78vh] overflow-y-auto">
          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Offer Type: Can Teach vs Want to Learn */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">आप क्या करना चाहते हैं?</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOfferType('teach')}
                className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                  offerType === 'teach'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-400 shadow-md'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>🎓 मैं सिखा सकता हूँ (Can Teach)</span>
              </button>

              <button
                type="button"
                onClick={() => setOfferType('learn')}
                className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                  offerType === 'learn'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white border-emerald-400 shadow-md'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>🙋‍♂️ सीखना चाहता हूँ (Want to Learn)</span>
              </button>
            </div>
          </div>

          {/* Skill Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              हुनर का शीर्षक (Skill Title) <span className="text-orange-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="उदा. क्लासिकल गिटार बेसिक्स, रिएक्ट वेब डेवलपमेंट, बिरयानी मेकिंग"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
              maxLength={80}
              required
            />
          </div>

          {/* Category & Level in 2 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">कैटेगरी (Category)</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as HunarCategory)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 transition"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">स्तर (Proficiency Level)</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as HunarLevel)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 transition"
              >
                <option value="beginner">शुरुआती (Beginner)</option>
                <option value="intermediate">मध्यम (Intermediate)</option>
                <option value="pro">विशेषज्ञ / मास्टर (Pro / Expert)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-300">
                हुनर का विवरण (Description & What You'll Learn) <span className="text-orange-400">*</span>
              </label>
              <span className="text-[10px] text-slate-500">{description.length}/350</span>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="विस्तार से बताएं कि आप क्या सिखाएंगे या क्या सीखना चाहते हैं..."
              rows={3}
              maxLength={350}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition resize-none leading-relaxed"
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-400" />
              <span>स्थान / माध्यम (Location or Online)</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="उदा. ऑनलाइन · गूगल मीट / दिल्ली एनसीआर / मुंबई"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
            />
          </div>

          {/* Photo Preview / Upload */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>हुनर की फोटो / थंबनेल</span>
              <span className="text-[10px] text-slate-500">फोटो अपलोड करें या प्रीसेट चुनें</span>
            </label>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {previewUrl ? (
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                <img src={previewUrl} alt="Skill Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    setMediaUrl('');
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-rose-600 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-800 hover:border-orange-500/50 rounded-xl p-4 text-center cursor-pointer transition bg-slate-950/40 space-y-1"
              >
                <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                <p className="text-xs font-medium text-slate-300">डिवाइस से फोटो अपलोड करें</p>
                <p className="text-[10px] text-slate-500">JPG, PNG, WebP (अधिकतम 10MB)</p>
              </div>
            )}

            {/* Preset Photo chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
              <span className="text-[10px] text-slate-500 shrink-0">त्वरित फोटो:</span>
              {PRESET_SKILL_IMAGES.map((img) => (
                <button
                  key={img.name}
                  type="button"
                  onClick={() => handleSelectPreset(img.url)}
                  className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-slate-300 hover:border-orange-500/60 whitespace-nowrap transition cursor-pointer"
                >
                  {img.name}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              रद्द करें
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>प्रकाशित हो रहा है...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>हुनर प्रकाशित करें (Publish)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
