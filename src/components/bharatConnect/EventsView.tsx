import React, { useState } from 'react';
import { useBharatConnect } from '../../context/BharatConnectContext';
import { CommunityEvent } from '../../types/bharatConnect';
import { INITIAL_EVENTS } from '../../data/communityData';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Share2, 
  Check, 
  Plus, 
  Sparkles,
  Search,
  Ticket,
  CalendarCheck
} from 'lucide-react';

export const EventsView: React.FC = () => {
  const { setToastMessage } = useBharatConnect();
  const [events, setEvents] = useState<CommunityEvent[]>(INITIAL_EVENTS);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'सभी आयोजन (All Events)' },
    { id: 'tech', label: '💻 टेक व डेवलपर' },
    { id: 'festival', label: '🪔 उत्सव व हस्तशिल्प' },
    { id: 'music', label: '🎶 संगीत व कला' },
    { id: 'startup', label: '🚀 स्टार्टअप मीट्स' }
  ];

  const filteredEvents = events.filter((evt) => {
    const matchesCat = filterCategory === 'all' || evt.category === filterCategory;
    const matchesQuery = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const toggleRsvp = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          const nextRsvp = !e.isRsvpd;
          setToastMessage(nextRsvp ? `RSVP सफल! '${e.title}' के लिए आपकी सीट सुरक्षित है।` : `RSVP रद्द किया गया।`);
          return {
            ...e,
            isRsvpd: nextRsvp,
            attendeesCount: nextRsvp ? e.attendeesCount + 1 : e.attendeesCount - 1
          };
        }
        return e;
      })
    );
  };

  const handleShareEvent = (event: CommunityEvent) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`https://bharatconnect.app/events/${event.id}`);
      setToastMessage('आयोजन लिंक कॉपी हो गया!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 pb-28 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-orange-950/40 border border-slate-800 rounded-3xl p-5 shadow-sm backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white flex items-center gap-2">
                <span>आयोजन एवं उत्सव</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-medium">
                  Events & Melas
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                भारत भर में होने वाले तकनीकी कॉन्क्लेव, सांस्कृतिक मेले और सम्मेलनों में भाग लें
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setToastMessage('नया इवेंट लिस्ट करने के लिए फॉर्म जल्द उपलब्ध होगा!')}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>आयोजन जोड़ें</span>
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="शहर, शीर्षक या आयोजन खोजें (उदा. दिल्ली, काशी, बेंगलुरु)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer active:scale-95 ${
                filterCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden hover:border-slate-700 transition shadow-xl flex flex-col md:flex-row group"
          >
            {/* Banner Image */}
            <div className="md:w-72 h-44 md:h-auto relative overflow-hidden bg-slate-950 shrink-0">
              <img
                src={evt.bannerUrl}
                alt={evt.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-bold text-amber-400 flex items-center gap-1.5 shadow-md">
                <Ticket className="w-3.5 h-3.5" />
                <span>निःशुल्क प्रवेश (Free Entry)</span>
              </div>
            </div>

            {/* Event Details */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{evt.date}</span>
                  <span className="text-slate-600">·</span>
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-400 font-normal">{evt.time}</span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition leading-snug">
                  {evt.title}
                </h3>

                <p className="text-xs text-slate-300/90 mt-1.5 leading-relaxed line-clamp-2">
                  {evt.description}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="truncate">{evt.location}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-semibold text-slate-200 font-mono">
                      {evt.attendeesCount.toLocaleString('en-IN')}
                    </span>
                    <span>लोग भाग ले रहे हैं (Going)</span>
                  </div>
                  <span className="text-slate-500 text-[10px]">आयोजक: {evt.organizer}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => toggleRsvp(evt.id)}
                  className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                    evt.isRsvpd
                      ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black shadow-md shadow-amber-500/20'
                  }`}
                >
                  {evt.isRsvpd ? (
                    <>
                      <CalendarCheck className="w-4 h-4 text-emerald-400" />
                      <span>स्थान आरक्षित है (Seat Confirmed)</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>RSVP करें (सीट बुक करें)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleShareEvent(evt)}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 transition active:scale-95 cursor-pointer"
                  title="इवेंट लिंक साझा करें"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
