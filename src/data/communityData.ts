import { CommunityGroup, CommunityEvent, MarketplaceProduct, CreatorStats } from '../types/bharatConnect';

export const INITIAL_GROUPS: CommunityGroup[] = [
  {
    id: 'grp_tech_bharat',
    name: 'Tech Bharat (टेक भारत)',
    description: 'भारत-स्तरीय स्केलेबल सिस्टम, ओपन-सोर्स और इंडिक एआई (Indic AI) पर चर्चा और सहयोग का सबसे बड़ा मंच।',
    category: 'tech',
    memberCount: 28400,
    isPrivate: false,
    avatar: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80',
    tags: ['TechBharat', 'IndicAI', 'WebDev', 'OpenSource'],
    isJoined: true,
    recentActivity: '25 मिनट पहले: "Indic LLMs पर बेंचमार्क परिणाम"'
  },
  {
    id: 'grp_desi_foodies',
    name: 'स्वाद भारत का (Desi Foodies)',
    description: 'हर राज्य का पारंपरिक स्वाद, गुप्त पारिवारिक रेसिपी, स्ट्रीट फूड और भारतीय मिठाइयों की महक।',
    category: 'food',
    memberCount: 45200,
    isPrivate: false,
    avatar: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=1000&auto=format&fit=crop&q=80',
    tags: ['DesiFood', 'ChaiLove', 'StreetFoodIndia', 'Rasoi'],
    isJoined: false,
    recentActivity: '1 घंटे पहले: "लखनवी बिरयानी व दम आलू की सीक्रेट रेसिपी"'
  },
  {
    id: 'grp_startup_india',
    name: 'स्टार्टअप क्रांति (Startup India & Founders)',
    description: 'भारतीय उद्यमियों, बूटस्ट्रैप्ड फाउंडर्स और टियर 2/3 शहरों से उभरते नए व्यवसायों का नेटवर्किंग हब।',
    category: 'business',
    memberCount: 32100,
    isPrivate: false,
    avatar: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1000&auto=format&fit=crop&q=80',
    tags: ['StartupIndia', 'MakeInIndia', 'Founders', 'Venture'],
    isJoined: true,
    recentActivity: '3 घंटे पहले: "UPI और ONDC से MSME बिक्री में 300% वृद्धि"'
  },
  {
    id: 'grp_sanskriti',
    name: 'भारतीय संस्कृति व धरोहर (Heritage Bharat)',
    description: 'प्राचीन वास्तुकला, वेद, शास्त्रीय संगीत, लोकनृत्य और भारत की ऐतिहासिक धरोहरों का संरक्षण।',
    category: 'culture',
    memberCount: 19800,
    isPrivate: false,
    avatar: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1000&auto=format&fit=crop&q=80',
    tags: ['Heritage', 'IncredibleIndia', 'Architecture', 'Sanskriti'],
    isJoined: false,
    recentActivity: '5 घंटे पहले: "हम्पी के विट्ठल मंदिर के संगीत स्तंभों का रहस्य"'
  },
  {
    id: 'grp_cricket',
    name: 'क्रिकेट प्रेमी संघ (Cricket Rasik)',
    description: 'गली क्रिकेट से लेकर विश्वकप तक, टीम इंडिया का हर मैच और लाइव स्कोर एनालिसिस।',
    category: 'sports',
    memberCount: 58900,
    isPrivate: false,
    avatar: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1000&auto=format&fit=crop&q=80',
    tags: ['CricketIndia', 'TeamIndia', 'IPL', 'BleedBlue'],
    isJoined: true,
    recentActivity: '10 मिनट पहले: "आगामी टी20 सीरीज के लिए संभावित प्लेइंग XI"'
  }
];

export const INITIAL_EVENTS: CommunityEvent[] = [
  {
    id: 'evt_tech_conclave',
    title: 'Bharat Tech Conclave 2026',
    description: 'नई दिल्ली में भारत के शीर्ष टेक लीडर्स, डेवलपर्स और एआई शोधकर्ताओं का महाकुंभ। कीनोट्स, हैंड्स-ऑन लैब्स और नेटवर्किंग।',
    date: '15 नवम्बर 2026',
    time: 'सुबह 09:30 बजे से',
    location: 'प्रगति मैदान, नई दिल्ली (Pragati Maidan, New Delhi)',
    isOnline: false,
    category: 'tech',
    bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80',
    attendeesCount: 3420,
    isRsvpd: true,
    organizer: 'Tech Bharat Foundation'
  },
  {
    id: 'evt_kashi_sangeet',
    title: 'काशी शास्त्रीय संगीत व गंगा उत्सव',
    description: 'माँ गंगा के पावन तट पर बनारस घराने के उस्तादों और युवा शास्त्रीय संगीत साधकों की अविस्मरणीय संध्या। सितार, तबला और ठुमरी।',
    date: '20 नवम्बर 2026',
    time: 'शाम 06:00 बजे से',
    location: 'दशाश्वमेध घाट, वाराणसी (Varanasi Ghats)',
    isOnline: false,
    category: 'music',
    bannerUrl: 'https://images.unsplash.com/photo-1561361066-61369324021a?w=1000&auto=format&fit=crop&q=80',
    attendeesCount: 5200,
    isRsvpd: false,
    organizer: 'संस्कृति मंत्रालय एवं काशी संगीत समाज'
  },
  {
    id: 'evt_bangalore_founders',
    title: 'Bengaluru Founders Chai Mixer',
    description: 'हर शनिवार को कोरमंगला में स्टार्टअप फाउंडर्स, एंजेल इन्वेस्टर्स और बिल्डर्स की अनौपचारिक चाय-चर्चा।',
    date: 'प्रत्येक शनिवार',
    time: 'सुबह 10:00 बजे',
    location: 'Third Wave Coffee, Indiranagar, Bengaluru',
    isOnline: false,
    category: 'startup',
    bannerUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1000&auto=format&fit=crop&q=80',
    attendeesCount: 180,
    isRsvpd: true,
    organizer: 'Bharat Founders Club'
  },
  {
    id: 'evt_jaipur_crafts',
    title: 'जयपुर हेरिटेज व हस्तशिल्प मेला',
    description: 'पारंपरिक राजस्थानी बंधेज, ब्लू पॉटरी, लाख की चूड़ियाँ और कठपुतली कला का भव्य चार दिवसीय उत्सव।',
    date: '02-05 दिसम्बर 2026',
    time: 'दिन भर (11:00 AM - 09:00 PM)',
    location: 'अल्बर्ट हॉल मैदान, जयपुर (Albert Hall, Jaipur)',
    isOnline: false,
    category: 'festival',
    bannerUrl: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1000&auto=format&fit=crop&q=80',
    attendeesCount: 8400,
    isRsvpd: false,
    organizer: 'राजस्थान हस्तशिल्प विकास निगम'
  }
];

export const INITIAL_PRODUCTS: MarketplaceProduct[] = [
  {
    id: 'prod_kanjivaram',
    title: 'शुद्ध मलबेरी कांचीपुरम सिल्क साड़ी (Kanjivaram Silk Saree)',
    description: 'प्रामाणिक कांचीपुरम बुनकरों द्वारा हाथ से बुनी गई 100% शुद्ध जरी बॉर्डर वाली सिल्क साड़ी। सिल्क मार्क प्रमाणित।',
    price: 6499,
    originalPrice: 8999,
    category: 'handloom',
    location: 'कांचीपुरम, तमिलनाडु',
    sellerName: 'लक्ष्मी हैंडलूम वीवर्स (Lakshmi Handlooms)',
    sellerHandle: '@lakshmi_weaves',
    sellerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80'
    ],
    verifiedSeller: true,
    whatsappNumber: '+919876543201',
    inStock: true
  },
  {
    id: 'prod_darjeeling_tea',
    title: 'फर्स्ट फ्लश दार्जिलिंग ऑर्गेनिक ब्लैक टी (Darjeeling Organic Tea 250g)',
    description: 'हिमालय की वादियों से हाथ से चुनी गई ताज़ा फर्स्ट फ्लश ऑर्गेनिक पत्तियाँ। बेजोड़ सुगंध और प्राकृतिक मिठास।',
    price: 850,
    originalPrice: 1100,
    category: 'tea_spices',
    location: 'दार्जिलिंग, पश्चिम बंगाल',
    sellerName: 'मकाईबारी टी एस्टेट (Makaibari Organics)',
    sellerHandle: '@makaibari_tea',
    sellerAvatar: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=150&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80'
    ],
    verifiedSeller: true,
    whatsappNumber: '+919876543202',
    inStock: true
  },
  {
    id: 'prod_brass_diya',
    title: 'हस्तनिर्मित मुरादाबादी पीतल मयूर दिया (Brass Peacock Diya)',
    description: 'मुरादाबाद के कारीगरों द्वारा गढ़ा गया ठोस पीतल का नक्काशीदार आरती दिया। दिवाली और पूजा के लिए उत्तम।',
    price: 1299,
    originalPrice: 1699,
    category: 'handicrafts',
    location: 'मुरादाबाद, उत्तर प्रदेश',
    sellerName: 'पीतल नगरी आर्टिज़न्स (Brass Arts Moradabad)',
    sellerHandle: '@peetal_nagri',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop&q=80'
    ],
    verifiedSeller: true,
    whatsappNumber: '+919876543203',
    inStock: true
  },
  {
    id: 'prod_kolhapuri',
    title: 'असली हस्तनिर्मित कोल्हापुरी चप्पल (Authentic Kolhapuri Chappals)',
    description: 'पारंपरिक वनस्पतिक टैनिंग विधि से तैयार शुद्ध चमड़े की आरामदायक और टिकाऊ कोल्हापुरी चप्पल।',
    price: 1850,
    originalPrice: 2400,
    category: 'footwear',
    location: 'कोल्हापुर, महाराष्ट्र',
    sellerName: 'छत्रपति लेदर गिल्ड (Chhatrapati Leathercraft)',
    sellerHandle: '@kolhapur_craft',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80'
    ],
    verifiedSeller: true,
    whatsappNumber: '+919876543204',
    inStock: true
  },
  {
    id: 'prod_blue_pottery',
    title: 'जयपुर ब्लू पॉटरी नक्काशीदार फूलदान (Jaipur Blue Pottery Vase)',
    description: 'पारंपरिक क्वार्ट्ज और मुल्तानी मिट्टी से निर्मित हस्तचित्रित इंडिगो फ्लोरल सिरेमिक वास।',
    price: 1450,
    originalPrice: 1950,
    category: 'art',
    location: 'जयपुर, राजस्थान',
    sellerName: 'सांगानेर पॉटरी स्टूडियो (Sanganer Blue Art)',
    sellerHandle: '@jaipur_pottery',
    sellerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80'
    ],
    verifiedSeller: true,
    whatsappNumber: '+919876543205',
    inStock: true
  }
];

export const INITIAL_CREATOR_STATS: CreatorStats = {
  impressions: 148500,
  reach: 92400,
  profileViews: 12850,
  followerGrowthPercent: 24.8,
  engagementRate: 8.6,
  estimatedEarningsINR: 34200,
  bestTimeToPost: 'शाम 07:30 बजे से 09:30 बजे (IST)'
};
