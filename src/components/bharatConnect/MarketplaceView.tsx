import React, { useState } from 'react';
import { useBharatConnect } from '../../context/BharatConnectContext';
import { MarketplaceProduct } from '../../types/bharatConnect';
import { INITIAL_PRODUCTS } from '../../data/communityData';
import { 
  ShoppingBag, 
  Tag, 
  MapPin, 
  CheckCircle2, 
  MessageCircle, 
  Phone, 
  Plus, 
  Search, 
  Sparkles,
  Heart,
  Share2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const MarketplaceView: React.FC = () => {
  const { setToastMessage } = useBharatConnect();
  const [products, setProducts] = useState<MarketplaceProduct[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProduct, setActiveProduct] = useState<MarketplaceProduct | null>(null);

  const categories = [
    { id: 'all', label: 'सभी उत्पाद (All Items)' },
    { id: 'handloom', label: '🧵 हथकरघा व साड़ियाँ (Handloom)' },
    { id: 'tea_spices', label: '☕ चाय व मसाले (Tea & Spices)' },
    { id: 'handicrafts', label: '🪔 पीतल व हस्तशिल्प (Crafts)' },
    { id: 'footwear', label: '👞 कोल्हापुरी चप्पल (Leather)' },
    { id: 'art', label: '🎨 पारंपरिक चित्रकला व वास (Art)' }
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesQuery = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleBuyOnWhatsApp = (product: MarketplaceProduct) => {
    const message = encodeURIComponent(
      `नमस्ते! मैंने BharatConnect (देसी हाट) पर आपका उत्पाद देखा: "${product.title}" (मूल्य: ₹${product.price})। क्या यह अभी उपलब्ध है?`
    );
    window.open(`https://wa.me/${product.whatsappNumber.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
    setToastMessage('WhatsApp पर विक्रेता से चैट शुरू की जा रही है!');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 pb-28 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-orange-950/40 border border-slate-800 rounded-3xl p-5 shadow-sm backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white flex items-center gap-2">
                <span>देसी हाट बाज़ार</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                  Desi Haat / Marketplace
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                सीधे भारत के कारीगरों, बुनकरों और स्थानीय उत्पादकों से शुद्ध स्वदेशी सामान खरीदें
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setToastMessage('नया उत्पाद सूचीबद्ध करने का विक्रेता डैशबोर्ड जल्द उपलब्ध होगा!')}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>उत्पाद बेचें (List Item)</span>
        </button>
      </div>

      {/* Search & Categories */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="उत्पाद खोजें (उदा. साड़ी, दार्जिलिंग चाय, पीतल दिया)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer active:scale-95 ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden hover:border-slate-700 transition shadow-lg flex flex-col group"
          >
            {/* Image Box */}
            <div className="relative aspect-square w-full overflow-hidden bg-slate-950">
              <img
                src={prod.images[0]}
                alt={prod.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>सत्यापित कारीगर</span>
              </div>
            </div>

            {/* Details */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-lg font-black text-white font-mono">
                    ₹{prod.price.toLocaleString('en-IN')}
                  </span>
                  {prod.originalPrice && (
                    <span className="text-xs text-slate-500 line-through font-mono">
                      ₹{prod.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  {prod.originalPrice && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                      {Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)}% छूट
                    </span>
                  )}
                </div>

                <h3 className="text-xs font-bold text-white group-hover:text-emerald-300 transition line-clamp-2 leading-snug">
                  {prod.title}
                </h3>

                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                  {prod.description}
                </p>
              </div>

              {/* Seller & Location */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                <div className="flex items-center gap-2">
                  <img
                    src={prod.sellerAvatar}
                    alt={prod.sellerName}
                    className="w-5 h-5 rounded-full object-cover border border-slate-700"
                  />
                  <span className="text-[11px] font-semibold text-slate-300 truncate">
                    {prod.sellerName}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                  <span className="truncate">{prod.location}</span>
                </div>
              </div>

              {/* Buy on WhatsApp Action */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => handleBuyOnWhatsApp(prod)}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>सीधे खरीदें (Buy on WhatsApp)</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
