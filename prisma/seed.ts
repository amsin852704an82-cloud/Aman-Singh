import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting BharatConnect Database Seeding...');

  // 1. Seed 5 Demo Users
  const demoUsers = [
    {
      id: 'usr_aarav_01',
      uid: 'firebase_uid_aarav',
      username: 'aarav_sharma',
      fullName: 'आरव शर्मा (Aarav)',
      email: 'aarav@bharatconnect.in',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'Bengaluru | Building tech for Bharat 🇮🇳 | Open Source Enthusiast',
      verified: true,
      accountType: 'Developer'
    },
    {
      id: 'usr_priya_02',
      uid: 'firebase_uid_priya',
      username: 'priya_patel',
      fullName: 'प्रिया पटेल (Priya)',
      email: 'priya@bharatconnect.in',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      bio: 'Mumbai | Indic UI/UX Designer | Vocal For Local 🎨',
      verified: true,
      accountType: 'Creator'
    },
    {
      id: 'usr_vikram_03',
      uid: 'firebase_uid_vikram',
      username: 'vikram_rao',
      fullName: 'विक्रमादित्य राव (Vikram)',
      email: 'vikram@bharatconnect.in',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      bio: 'New Delhi | Agritech & AI Innovator | Digital India Evangelist 🚀',
      verified: true,
      accountType: 'Founder'
    },
    {
      id: 'usr_ananya_04',
      uid: 'firebase_uid_ananya',
      username: 'ananya_deshmukh',
      fullName: 'अनन्या देशमुख (Ananya)',
      email: 'ananya@bharatconnect.in',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      bio: 'Pune | Classical Vocalist & Heritage Conservationist 🎶',
      verified: true,
      accountType: 'Artist'
    },
    {
      id: 'usr_rohit_05',
      uid: 'firebase_uid_rohit',
      username: 'rohit_verma',
      fullName: 'रोहित वर्मा (Rohit)',
      email: 'rohit@bharatconnect.in',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      bio: 'Jaipur | Handloom Artisan & Desi Haat Seller 🧵',
      verified: true,
      accountType: 'Artisan'
    }
  ];

  for (const user of demoUsers) {
    await prisma.user.upsert({
      where: { username: user.username },
      update: user,
      create: user
    });
  }
  console.log('✅ 5 Demo Users seeded.');

  // 2. Seed 10 Posts
  const demoPosts = [
    {
      id: 'post_01',
      authorId: 'usr_aarav_01',
      content: 'आज बेंगलुरु में नए ओपन सोर्स इंडिक ट्रांसलेशन इंजन का पहला प्रिव्यू टेस्ट किया। 12 भारतीय भाषाओं में 99.4% सटीकता! 🇮🇳🚀 #TechBharat #DigitalIndia',
      imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      likesCount: 1240,
      commentsCount: 142,
      sharesCount: 88,
      tags: ['TechBharat', 'DigitalIndia', 'OpenSource']
    },
    {
      id: 'post_02',
      authorId: 'usr_priya_02',
      content: 'भारतीय संस्कृति और त्योहारों के रंगों से प्रेरित होकर नया UI कंपोनेंट सिस्टम तैयार किया है। केसरिया और मोरपंखी शेड्स अद्भुत लग रहे हैं! 🎨✨ #DesignBharat #VocalForLocal',
      imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&auto=format&fit=crop&q=80',
      likesCount: 890,
      commentsCount: 94,
      sharesCount: 45,
      tags: ['DesignBharat', 'VocalForLocal']
    },
    {
      id: 'post_03',
      authorId: 'usr_vikram_03',
      content: 'ग्रामीण भारत के किसानों के लिए सौर ऊर्जा से संचालित कोल्ड स्टोरेज प्रोजेक्ट अब 50 गांवों में लाइव है। आत्मनिर्भर भारत की सच्ची ताकत जमीन से आती है! 🌾☀️',
      imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&auto=format&fit=crop&q=80',
      likesCount: 3410,
      commentsCount: 310,
      sharesCount: 520,
      tags: ['Agritech', 'AtmanirbharBharat', 'RuralIndia']
    },
    {
      id: 'post_04',
      authorId: 'usr_ananya_04',
      content: 'काशी के अस्सी घाट पर आज सुबह की राग भैरवी की प्रस्तुति। गंगा जी की लहरों के साथ सुरों का मिलन एक अलौकिक अनुभव देता है। 🙏🎶 #KashiSangeet #IndianClassical',
      imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80',
      likesCount: 2150,
      commentsCount: 180,
      sharesCount: 190,
      tags: ['KashiSangeet', 'IncredibleIndia']
    },
    {
      id: 'post_05',
      authorId: 'usr_rohit_05',
      content: 'जयपुर के पारंपरिक ब्लॉक प्रिंट से तैयार की गई कॉटन साड़ियां अब सीधे देसी हाट पर उपलब्ध हैं। हर साड़ी को तैयार करने में 3 दिन की बारीक कारीगरी लगी है। 🧵🛍️',
      imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
      likesCount: 980,
      commentsCount: 65,
      sharesCount: 82,
      tags: ['DesiHaat', 'HandmadeIndia', 'JaipurCrafts']
    },
    {
      id: 'post_06',
      authorId: 'usr_aarav_01',
      content: 'दिल से (गुमनाम विचार): कई बार जब कोड कंपाइल नहीं होता तो लगता है कि सब छोड़ कर हिमालय चला जाऊं, फिर एक चाय और समोसा सब ठीक कर देता है! ☕🥟 #DilSe #CoderLife',
      likesCount: 1650,
      commentsCount: 240,
      sharesCount: 110,
      isDilSe: true,
      tags: ['DilSe', 'DesiVibes']
    },
    {
      id: 'post_07',
      authorId: 'usr_priya_02',
      content: 'मुंबई की शाम और मरीन ड्राइव की ठंडी हवा। इस शहर की ऊर्जा सचमुच अद्वितीय है! ❤️🌆 #MumbaiDiaries #AamchiMumbai',
      imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=80',
      likesCount: 1420,
      commentsCount: 112,
      sharesCount: 67,
      tags: ['MumbaiDiaries', 'IncredibleIndia']
    },
    {
      id: 'post_08',
      authorId: 'usr_vikram_03',
      content: 'भारत 100+ यूनिकॉर्न्स का देश बन चुका है, लेकिन असली क्रांति टियर-2 और टियर-3 शहरों से आ रही है जहां जमीनी समस्याओं के टेक समाधान बन रहे हैं। 🇮🇳💡',
      likesCount: 4200,
      commentsCount: 450,
      sharesCount: 620,
      tags: ['StartupIndia', 'TechBharat']
    },
    {
      id: 'post_09',
      authorId: 'usr_ananya_04',
      content: 'पुणे संगीत महोत्सव की तैयारियां जोरों पर हैं। इस बार 20 से अधिक युवा कलाकारों को मंच मिलेगा। कला और संस्कृति ही हमारी पहचान है। 🪕🪘',
      imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
      likesCount: 1150,
      commentsCount: 78,
      sharesCount: 54,
      tags: ['Culture', 'Sanskriti']
    },
    {
      id: 'post_10',
      authorId: 'usr_rohit_05',
      content: 'हमारी पारंपरिक कला को नई पीढ़ी तक पहुंचाने के लिए वर्कशॉप शुरू कर रहे हैं। हस्तकला भारत की आत्मा है। ✋🪵 #VocalForLocal',
      likesCount: 790,
      commentsCount: 52,
      sharesCount: 39,
      tags: ['VocalForLocal', 'ArtisansOfIndia']
    }
  ];

  for (const post of demoPosts) {
    await prisma.post.upsert({
      where: { id: post.id },
      update: post,
      create: post
    });
  }
  console.log('✅ 10 Posts seeded.');

  // 3. Seed 5 Groups
  const demoGroups = [
    {
      id: 'grp_tech_bharat',
      name: 'Tech Bharat Developers',
      hindiName: 'टेक भारत डेवलपर्स',
      description: 'भारतीय सॉफ्टवेयर इंजीनियर्स, AI रिसर्चर्स और हार्डवेयर इनोवेटर्स का सबसे बड़ा तकनीकी समुदाय।',
      icon: '💻',
      banner: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      category: 'Technology',
      membersCount: 12450,
      postsCount: 3840
    },
    {
      id: 'grp_desi_foodies',
      name: 'Desi Foodies & Zaika',
      hindiName: 'देसी फूडीज और जायका',
      description: 'कश्मीर के वाज़वान से कन्याकुमारी के डोसा तक — भारत के पारंपरिक स्वादों की खोज और रेसिपी चर्चा।',
      icon: '🍲',
      banner: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80',
      category: 'Food',
      membersCount: 28900,
      postsCount: 8420
    },
    {
      id: 'grp_startup_india',
      name: 'Startup India Hub',
      hindiName: 'स्टार्टअप इंडिया हब',
      description: 'फाउंडर्स, एंजल इन्वेस्टर्स और मेंटर्स का मंच। पिच शेयर करें, को-फाउंडर खोजें और मार्गदर्शन पाएं।',
      icon: '🚀',
      banner: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop&q=80',
      category: 'Startups',
      membersCount: 18700,
      postsCount: 4210
    },
    {
      id: 'grp_sanskriti',
      name: 'Bharatiya Sanskriti & Virasat',
      hindiName: 'भारतीय संस्कृति और विरासत',
      description: 'भारतीय इतिहास, वास्तुकला, वेद, उपनिषद, शास्त्रीय संगीत और लोक कलाओं का संरक्षण और संवर्धन।',
      icon: '🛕',
      banner: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80',
      category: 'Culture',
      membersCount: 34200,
      postsCount: 9150
    },
    {
      id: 'grp_cricket_lovers',
      name: 'Cricket Lovers Adda',
      hindiName: 'क्रिकेट लवर्स अड्डा',
      description: 'टीम इंडिया के मैच एनालिसिस, लाइव स्कोर कमेंट्री, गली क्रिकेट यादें और आईपीएल चर्चा।',
      icon: '🏏',
      banner: 'https://images.unsplash.com/photo-1531415074868-036b1c57e329?w=800&auto=format&fit=crop&q=80',
      category: 'Sports',
      membersCount: 45600,
      postsCount: 14200
    }
  ];

  for (const group of demoGroups) {
    await prisma.group.upsert({
      where: { id: group.id },
      update: group,
      create: group
    });
  }
  console.log('✅ 5 Groups seeded.');

  // 4. Seed 5 Events
  const demoEvents = [
    {
      id: 'evt_diwali_tech',
      title: 'Diwali Tech Conclave 2026',
      hindiTitle: 'दीवाली टेक कॉन्क्लेव 2026',
      description: 'भारत के 500+ शीर्ष तकनीकी लीडर्स का वार्षिक सम्मेलन। AI, वेब3 और सेमीकंडक्टर निर्माण पर विशेष सत्र।',
      category: 'Tech Summit',
      date: '15 नवंबर 2026',
      time: 'सुबह 10:00 - शाम 6:00 IST',
      location: 'NIMHANS Convention Centre, Hosur Road',
      city: 'Bengaluru',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
      organizer: 'Tech Bharat Foundation',
      totalSeats: 500,
      rsvpCount: 420
    },
    {
      id: 'evt_kashi_sangeet',
      title: 'Kashi Classical Music Mela',
      hindiTitle: 'काशी शास्त्रीय संगीत संध्या',
      description: 'गंगा घाट की पावन छटा में बनारस घराने के मूर्धन्य कलाकारों द्वारा सितार, तबला और ठुमरी की प्रस्तुति।',
      category: 'Cultural',
      date: '22 नवंबर 2026',
      time: 'शाम 6:30 - रात 10:30 IST',
      location: 'Assi Ghat, Ganga Kinare',
      city: 'Varanasi',
      image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80',
      organizer: 'Kashi Sanskriti Parishad',
      totalSeats: 300,
      rsvpCount: 285
    },
    {
      id: 'evt_bengaluru_chai',
      title: 'Bengaluru Founders Chai Meet',
      hindiTitle: 'बेंगलुरु फाउंडर्स चाय मीट',
      description: 'प्रारंभिक दौर के संस्थापकों के लिए अनौपचारिक नेटवर्किंग। कोई प्रेजेंटेशन नहीं, केवल असली चर्चा और चाय।',
      category: 'Networking',
      date: '28 नवंबर 2026',
      time: 'शाम 5:00 - 8:00 IST',
      location: 'Indiranagar Social, 100ft Road',
      city: 'Bengaluru',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
      organizer: 'IndieFounders Bharat',
      totalSeats: 80,
      rsvpCount: 78
    },
    {
      id: 'evt_jaipur_crafts',
      title: 'Jaipur Heritage Crafts Fair',
      hindiTitle: 'जयपुर हैंडीक्राफ्ट्स और कला मेला',
      description: 'राजस्थान के 100+ मास्टर कारीगरों द्वारा ब्लू पॉटरी, बंधेज और कठपुतली कला की लाइव प्रदर्शनी और कार्यशाला।',
      category: 'Exhibition',
      date: '05 दिसंबर 2026',
      time: 'सुबह 11:00 - रात 9:00 IST',
      location: 'Jawahar Kala Kendra',
      city: 'Jaipur',
      image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
      organizer: 'Rajasthan Karigar Sangh',
      totalSeats: 400,
      rsvpCount: 310
    },
    {
      id: 'evt_pune_hackathon',
      title: 'Bharat AI Hackathon Pune',
      hindiTitle: 'भारत एआई हैकाथॉन पुणे',
      description: '36-घंटे का निरंतर हैकाथॉन जिसमें भारतीय कृषि, स्वास्थ्य और शिक्षा के लिए बहुभाषी AI मॉडल्स विकसित किए जाएंगे।',
      category: 'Hackathon',
      date: '12 दिसंबर 2026',
      time: 'सुबह 9:00 - शाम 9:00 IST',
      location: 'COEP Technological University',
      city: 'Pune',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
      organizer: 'AI Bharat Initiative',
      totalSeats: 250,
      rsvpCount: 240
    }
  ];

  for (const event of demoEvents) {
    await prisma.event.upsert({
      where: { id: event.id },
      update: event,
      create: event
    });
  }
  console.log('✅ 5 Events seeded.');

  // 5. Seed 5 Products
  const demoProducts = [
    {
      id: 'prd_banarasi_saree',
      title: 'Pure Katan Banarasi Silk Saree',
      hindiTitle: 'शुद्ध कटान बनारसी सिल्क साड़ी',
      description: 'प्रामाणिक बनारसी हथकरघा साड़ी, शुद्ध ज़री के साथ हस्तनिर्मित। जीआई टैग प्रमाणित कारीगर द्वारा निर्मित।',
      price: 8499,
      originalPrice: 12999,
      discount: '35% छूट',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
      category: 'Textiles',
      artisanName: 'रफीक अहमद बुनकर',
      artisanLocation: 'Varanasi, Uttar Pradesh',
      rating: 4.9,
      reviewsCount: 128,
      isHandmade: true,
      inStock: true
    },
    {
      id: 'prd_darjeeling_tea',
      title: 'First Flush Organic Darjeeling Tea',
      hindiTitle: 'फर्स्ट फ्लश ऑर्गेनिक दार्जिलिंग चाय (250g)',
      description: 'हिमालय की वादियों से चुनी गई प्रीमियम खुशबूदार चाय पत्तियां। 100% कीटनाशक मुक्त और जीआई सर्टिफाइड।',
      price: 1250,
      originalPrice: 1600,
      discount: '22% छूट',
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
      category: 'Organic Food',
      artisanName: 'माकीबाड़ी टी एस्टेट',
      artisanLocation: 'Darjeeling, West Bengal',
      rating: 4.8,
      reviewsCount: 94,
      isHandmade: false,
      inStock: true
    },
    {
      id: 'prd_brass_nataraja',
      title: 'Handcrafted Brass Nataraja Idol',
      hindiTitle: 'हस्तनिर्मित पीतल नटराज मूर्ति (12 इंच)',
      description: 'तंजावुर शैली में ढली पारंपरिक पीतल की नटराज मूर्ति। घर और मंदिर की शोभा बढ़ाने वाली उत्कृष्ट कलाकृति।',
      price: 3899,
      originalPrice: 5500,
      discount: '29% छूट',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
      category: 'Handicrafts',
      artisanName: 'मुुरुगन स्थपति',
      artisanLocation: 'Thanjavur, Tamil Nadu',
      rating: 5.0,
      reviewsCount: 76,
      isHandmade: true,
      inStock: true
    },
    {
      id: 'prd_kolhapuri_chappal',
      title: 'Authentic Leather Kolhapuri Chappals',
      hindiTitle: 'प्रामाणिक लेदर कोल्हापुरी चप्पल',
      description: 'शुद्ध वनस्पति टैन लेदर से हाथ से सिली हुई आरामदायक और टिकाऊ पारंपरिक कोल्हापुरी चप्पल।',
      price: 1850,
      originalPrice: 2400,
      discount: '23% छूट',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80',
      category: 'Footwear',
      artisanName: 'सचिन कांबले',
      artisanLocation: 'Kolhapur, Maharashtra',
      rating: 4.7,
      reviewsCount: 112,
      isHandmade: true,
      inStock: true
    },
    {
      id: 'prd_kashmir_saffron',
      title: 'Pure Pampore Mongra Saffron (Kesar 5g)',
      hindiTitle: 'शुद्ध पम्पोर मोंगरा केसर (5 ग्राम)',
      description: 'कश्मीर की पम्पोर घाटी से उच्चतम ग्रेड का गहरा लाल केसर। शुद्धता और तीखी खुशबू की गारंटी।',
      price: 2499,
      originalPrice: 3200,
      discount: '22% छूट',
      image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&auto=format&fit=crop&q=80',
      category: 'Organic Food',
      artisanName: 'बशीर मीर केसर फार्म',
      artisanLocation: 'Pampore, Kashmir',
      rating: 4.9,
      reviewsCount: 205,
      isHandmade: true,
      inStock: true
    }
  ];

  for (const product of demoProducts) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: product,
      create: product
    });
  }
  console.log('✅ 5 Products seeded.');

  console.log('🎉 Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
