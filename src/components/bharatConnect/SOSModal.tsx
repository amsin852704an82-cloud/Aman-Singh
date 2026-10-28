import React, { useState } from 'react';
import { useBharatConnect } from '../../context/BharatConnectContext';
import { 
  AlertTriangle, 
  X, 
  PhoneCall, 
  Share2, 
  MapPin, 
  Clock, 
  HeartHandshake, 
  PlusCircle, 
  ShieldAlert, 
  CheckCircle2, 
  Radio, 
  Flame, 
  Send
} from 'lucide-react';

export interface SOSAlert {
  id: string;
  category: 'blood' | 'medical' | 'road' | 'community';
  title: string;
  patientOrPerson: string;
  city: string;
  district: string;
  landmark: string;
  distanceKm: number;
  phone: string;
  description: string;
  isUrgent: boolean;
  postedAt: string;
  bloodGroup?: string;
  unitsNeeded?: number;
}

const INITIAL_SOS_ALERTS: SOSAlert[] = [
  {
    id: 'sos_1',
    category: 'blood',
    title: 'अति आवश्यक: B+ या O+ रक्तदान चाहिए',
    patientOrPerson: 'रमेश चंद्र गुप्ता (उम्र 58)',
    city: 'लखनऊ',
    district: 'लखनऊ',
    landmark: 'KGMU ट्रॉमा सेंटर, वार्ड 4',
    distanceKm: 3.2,
    phone: '9876543210',
    description: 'इमरजेंसी बाईपास सर्जरी के लिए 2 यूनिट B+ या O+ रक्त की तुरंत आवश्यकता है। डोनर कृपया सीधे संपर्क करें।',
    isUrgent: true,
    postedAt: '12 मिनट पहले',
    bloodGroup: 'B+ / O+',
    unitsNeeded: 2
  },
  {
    id: 'sos_2',
    category: 'medical',
    title: 'एम्बुलेंस व तत्काल ऑक्सीजन सपोर्ट',
    patientOrPerson: 'श्रीमती प्रभावती देवी (उम्र 64)',
    city: 'वाराणसी',
    district: 'वाराणसी',
    landmark: 'सिगरा चौराहा के पास',
    distanceKm: 4.8,
    phone: '9123456789',
    description: 'सांस लेने में भारी तकलीफ है। नजदीकी एम्बुलेंस या पोर्टेबल ऑक्सीजन सिलेंडर उपलब्ध कराने में मदद करें।',
    isUrgent: true,
    postedAt: '25 मिनट पहले'
  },
  {
    id: 'sos_3',
    category: 'road',
    title: 'रात में वाहन ब्रेकडाउन व सहायता',
    patientOrPerson: 'अमित कुमार (परिवार सहित)',
    city: 'नोएडा',
    district: 'गौतम बुद्ध नगर',
    landmark: 'नोएडा-ग्रेटर नोएडा एक्सप्रेसवे, माइलस्टोन 14',
    distanceKm: 6.5,
    phone: '9456123789',
    description: 'गाड़ी का दोनों पिछला टायर पंक्चर हो गया है और बैटरी काम नहीं कर रही है। परिवार साथ है, नजदीकी मैकेनिक या टोइंग सहायता चाहिए।',
    isUrgent: false,
    postedAt: '45 मिनट पहले'
  },
  {
    id: 'sos_4',
    category: 'community',
    title: 'वरिष्ठ नागरिक खोज सूचना (Missing Elder)',
    patientOrPerson: 'श्री रामस्वरूप जी (उम्र 72)',
    city: 'जयपुर',
    district: 'जयपुर',
    landmark: 'कस्तूरबा मार्ग, सी-स्कीम',
    distanceKm: 5.1,
    phone: '9829012345',
    description: 'नीला कुर्ता और चश्मा पहने हैं, सुबह टहलने निकले थे और रास्ता भूल गए हैं। किसी को दिखे तो तुरंत कॉल करें।',
    isUrgent: true,
    postedAt: '1 घंटा पहले'
  }
];

export const SOSModal: React.FC = () => {
  const { isSOSModalOpen, setIsSOSModalOpen, setToastMessage, currentUser } = useBharatConnect();
  const [activeTab, setActiveTab] = useState<'alerts' | 'create' | 'helplines'>('alerts');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [alerts, setAlerts] = useState<SOSAlert[]>(INITIAL_SOS_ALERTS);

  // Form State
  const [formData, setFormData] = useState({
    category: 'blood' as 'blood' | 'medical' | 'road' | 'community',
    title: '',
    patientOrPerson: '',
    city: 'लखनऊ',
    landmark: '',
    phone: '',
    bloodGroup: 'B+',
    description: '',
    isUrgent: true
  });

  if (!isSOSModalOpen) return null;

  const filteredAlerts = alerts.filter(a => {
    if (selectedCategory === 'all') return true;
    return a.category === selectedCategory;
  });

  const handleCreateSOS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.patientOrPerson || !formData.phone || !formData.landmark) {
      setToastMessage('कृपया सभी आवश्यक विवरण भरें');
      return;
    }

    const newAlert: SOSAlert = {
      id: `sos_${Date.now()}`,
      category: formData.category,
      title: formData.title,
      patientOrPerson: formData.patientOrPerson,
      city: formData.city,
      district: formData.city,
      landmark: formData.landmark,
      distanceKm: 1.5,
      phone: formData.phone,
      description: formData.description || 'तुरंत आपातकालीन सहायता की आवश्यकता है।',
      isUrgent: formData.isUrgent,
      postedAt: 'अभी-अभी',
      bloodGroup: formData.category === 'blood' ? formData.bloodGroup : undefined
    };

    setAlerts([newAlert, ...alerts]);
    setToastMessage('🚨 आपका SOS अलर्ट नजदीकी 5-10 किमी में प्रसारित कर दिया गया!');
    setActiveTab('alerts');

    // Trigger WhatsApp share prefill
    const shareText = `🚨 *आपातकालीन सहायता अलर्ट (BharatConnect SOS)* 🚨\n\n📌 प्रकार: ${formData.title}\n👤 मरीज/व्यक्ति: ${formData.patientOrPerson}\n📍 स्थान: ${formData.landmark}, ${formData.city}\n📞 संपर्क: ${formData.phone}\n📝 विवरण: ${formData.description}\n\n🙏 कृपया तुरंत मदद करें या आगे ग्रुप्स में शेयर करें!\n📲 भारत कनेक्ट ऐप: https://bharatconnect.app/sos`;
    
    // Auto-open WhatsApp share link in new context safely
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.location.href = waUrl;
  };

  const shareSOSAlert = (alert: SOSAlert) => {
    const text = `🚨 *आपातकालीन अलर्ट (BharatConnect SOS)* 🚨\n\n📌 ${alert.title}\n👤 मरीज/व्यक्ति: ${alert.patientOrPerson}\n📍 स्थान: ${alert.landmark}, ${alert.city} (~${alert.distanceKm} किमी)\n📞 तुरंत कॉल करें: ${alert.phone}\n📝 विवरण: ${alert.description}\n\n🙏 कृपया मदद करें और स्थानीय ग्रुप्स में शेयर करें!\n📲 BharatConnect: https://bharatconnect.app/sos`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setToastMessage('आपातकालीन संदेश कॉपी हो गया! WhatsApp पर शेयर करें');
    }
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.location.href = waUrl;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xl bg-slate-900 border-2 border-red-500/40 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-orange-950/80 p-4 border-b border-red-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center shadow-lg shadow-red-600/30">
              <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  भारत सहारा <span className="text-red-400">(SOS Network)</span>
                </h2>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium">
                5-10 किमी के भीतर स्थानीय आपातकालीन मदद, रक्तदान व सुरक्षा 🇮🇳
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSOSModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs inside Modal */}
        <div className="flex items-center justify-around border-b border-slate-800 bg-slate-950/60 p-2 gap-1.5">
          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'alerts'
                ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>सक्रिय अलर्ट ({filteredAlerts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'create'
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>SOS दर्ज करें (+)</span>
          </button>

          <button
            onClick={() => setActiveTab('helplines')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'helplines'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>हेल्पलाइन (112)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* TAB 1: ACTIVE ALERTS */}
          {activeTab === 'alerts' && (
            <>
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {[
                  { id: 'all', label: 'सभी' },
                  { id: 'blood', label: '🩸 रक्तदान' },
                  { id: 'medical', label: '🚑 एम्बुलेंस व चिकित्सा' },
                  { id: 'road', label: '🚗 सड़क सहायता' },
                  { id: 'community', label: '📢 नागरिक मदद' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-red-500 text-white shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Alerts List */}
              <div className="space-y-3">
                {filteredAlerts.map(alert => (
                  <div 
                    key={alert.id}
                    className="bg-slate-950/80 border border-slate-800 hover:border-red-500/40 rounded-2xl p-4 space-y-3 transition shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {alert.isUrgent && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white animate-pulse">
                              अति आवश्यक
                            </span>
                          )}
                          <span className="text-xs font-semibold text-slate-300">
                            {alert.category === 'blood' && '🩸 रक्तदान अनुरोध'}
                            {alert.category === 'medical' && '🚑 आपातकालीन चिकित्सा'}
                            {alert.category === 'road' && '🚗 सड़क ब्रेकडाउन'}
                            {alert.category === 'community' && '📢 सामुदायिक सूचना'}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-white leading-snug">
                          {alert.title}
                        </h3>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-orange-400 font-mono flex items-center gap-1 justify-end">
                          <MapPin className="w-3 h-3" />
                          <span>~{alert.distanceKm} किमी दूर</span>
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 justify-end mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{alert.postedAt}</span>
                        </span>
                      </div>
                    </div>

                    {/* Patient & Location info box */}
                    <div className="bg-slate-900/90 rounded-xl p-2.5 text-xs text-slate-300 space-y-1 border border-slate-800/80">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">मरीज/व्यक्ति:</span>
                        <span className="font-semibold text-white">{alert.patientOrPerson}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">स्थान / अस्पताल:</span>
                        <span className="font-medium text-slate-200">{alert.landmark}, {alert.city}</span>
                      </div>
                      {alert.bloodGroup && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">ब्लड ग्रुप:</span>
                          <span className="font-black text-red-400 bg-red-950/60 px-2 py-0.5 rounded">
                            {alert.bloodGroup} ({alert.unitsNeeded || 1} यूनिट)
                          </span>
                        </div>
                      )}
                      <p className="pt-1 text-[11px] text-slate-300 leading-relaxed italic border-t border-slate-800">
                        "{alert.description}"
                      </p>
                    </div>

                    {/* Action Buttons: 1-Tap Call & 1-Tap WhatsApp Help */}
                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={`tel:${alert.phone}`}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>तुरंत कॉल करें</span>
                      </a>

                      <button
                        onClick={() => shareSOSAlert(alert)}
                        className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>WhatsApp सहायता</span>
                      </button>

                      <button
                        onClick={() => shareSOSAlert(alert)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                        title="शेयर करें"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* TAB 2: CREATE NEW SOS ALERT */}
          {activeTab === 'create' && (
            <form onSubmit={handleCreateSOS} className="space-y-3.5">
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-3 text-xs text-red-300 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p>
                  यह सुविधा केवल वास्तविक आपातकाल के लिए है। आपका अनुरोध नजदीकी 5-10 किमी क्षेत्र के सभी भारत कनेक्ट उपयोगकर्ताओं को तुरंत भेजा जाएगा।
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  आपातकाल का प्रकार चुनें *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'blood', label: '🩸 रक्तदान (Blood)' },
                    { id: 'medical', label: '🚑 चिकित्सा / एम्बुलेंस' },
                    { id: 'road', label: '🚗 सड़क ब्रेकडाउन' },
                    { id: 'community', label: '📢 नागरिक / खोया-पाया' }
                  ].map(c => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setFormData({ ...formData, category: c.id as any })}
                      className={`p-2.5 rounded-xl text-xs font-semibold text-left transition border cursor-pointer ${
                        formData.category === c.id
                          ? 'bg-red-600/20 border-red-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  अनुरोध का शीर्षक (उदा. अति आवश्यक: B+ ब्लड चाहिए) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="उदा. AIIMS दिल्ली में O- रक्तदान आवश्यक"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    मरीज / व्यक्ति का नाम *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.patientOrPerson}
                    onChange={e => setFormData({ ...formData, patientOrPerson: e.target.value })}
                    placeholder="उदा. रमेश कुमार"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    संपर्क मोबाइल नंबर *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                    placeholder="10 अंकों का फोन नंबर"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
              </div>

              {formData.category === 'blood' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    आवश्यक ब्लड ग्रुप
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="A+">A+ (A Positive)</option>
                    <option value="A-">A- (A Negative)</option>
                    <option value="B+">B+ (B Positive)</option>
                    <option value="B-">B- (B Negative)</option>
                    <option value="O+">O+ (O Positive)</option>
                    <option value="O-">O- (O Negative)</option>
                    <option value="AB+">AB+ (AB Positive)</option>
                    <option value="AB-">AB- (AB Negative)</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    शहर / जिला *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    placeholder="उदा. लखनऊ, वाराणसी, पटना"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    अस्पताल / मुख्य लैंडमार्क *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.landmark}
                    onChange={e => setFormData({ ...formData, landmark: e.target.value })}
                    placeholder="उदा. सिविल अस्पताल, कमरा 12"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  अतिरिक्त विवरण (Details)
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="किसी विशेष निर्देश या स्थिति के बारे में लिखें..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="urgentCheck"
                  checked={formData.isUrgent}
                  onChange={e => setFormData({ ...formData, isUrgent: e.target.checked })}
                  className="w-4 h-4 rounded text-red-500 accent-red-600 focus:ring-red-500"
                />
                <label htmlFor="urgentCheck" className="text-xs font-semibold text-red-400 cursor-pointer">
                  यह अति आवश्यक (Immediate Emergency) अनुरोध है
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-red-600/30 active:scale-95 transition cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>नजदीकी 5-10 किमी में SOS प्रसारित करें</span>
              </button>
            </form>
          )}

          {/* TAB 3: OFFICIAL INDIAN EMERGENCY HELPLINES */}
          {activeTab === 'helplines' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-300">
                भारत सरकार की 24x7 निःशुल्क आधिकारिक आपातकालीन हेल्पलाइन सेवाएं:
              </p>

              {[
                { number: '112', title: 'राष्ट्रीय आपातकालीन नंबर (All-in-One Helpline)', desc: 'पुलिस, अग्निशमन और तत्काल राहत', color: 'from-red-600 to-rose-600' },
                { number: '108', title: 'आपातकालीन एम्बुलेंस व चिकित्सा सेवा', desc: 'निःशुल्क सरकारी एम्बुलेंस सेवा', color: 'from-emerald-600 to-teal-600' },
                { number: '102', title: 'गर्भवती महिला व नवजात शिशु एम्बुलेंस', desc: 'मातृ एवं शिशु स्वास्थ्य आपातकालीन वाहन', color: 'from-pink-600 to-purple-600' },
                { number: '1091', title: 'महिला सुरक्षा हेल्पलाइन (Women Safety)', desc: '24x7 महिला संकट निवारण व सुरक्षा', color: 'from-purple-600 to-indigo-600' },
                { number: '1930', title: 'राष्ट्रीय साइबर वित्तीय अपराध हेल्पलाइन', desc: 'ऑनलाइन धोखाधड़ी होने पर तत्काल खाता फ्रीज कराने हेतु', color: 'from-amber-600 to-orange-600' },
                { number: '1070', title: 'राज्य आपदा प्रबंधन व राहत बल', desc: 'बाढ़, भूकंप या प्राकृतिक आपदा सहायता', color: 'from-blue-600 to-cyan-600' }
              ].map(h => (
                <div 
                  key={h.number}
                  className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-md"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-base text-white bg-slate-900 border border-slate-700 px-2.5 py-0.5 rounded-lg">
                        {h.number}
                      </span>
                      <h4 className="text-xs font-bold text-white truncate">{h.title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{h.desc}</p>
                  </div>

                  <a
                    href={`tel:${h.number}`}
                    className={`px-3.5 py-2 rounded-xl bg-gradient-to-r ${h.color} text-white font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-md active:scale-95 transition`}
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>कॉल</span>
                  </a>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
