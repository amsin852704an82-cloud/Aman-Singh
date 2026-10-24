// BharatConnect Idempotent Database Seed Script
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

export async function seedDatabase() {
  console.log('🌱 [BharatConnect] डेटाबेस सीडिंग प्रक्रिया प्रारंभ हो रही है...');
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    console.warn('⚠️  DATABASE_URL सेट नहीं है। डेटाबेस सीड छोड़ दिया गया है।');
    console.log('💡 डेटाबेस सीड करने के लिए .env या Railway में DATABASE_URL सेट करें।');
    return;
  }

  try {
    // 1. 5 Demo Users (Aarav, Priya, Rohan, Ananya, Vikram)
    const demoUsers = [
      {
        id: 'usr_aarav_01',
        uid: 'firebase_uid_aarav',
        username: 'aarav_sharma',
        fullName: 'आरव शर्मा (Aarav)',
        email: 'aarav@bharatconnect.in',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        bio: 'बेंगलुरु | Building tech for Bharat 🇮🇳 | Open Source Enthusiast',
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
        bio: 'मुंबई | Indic UI/UX Designer | Vocal For Local 🎨',
        verified: true,
        accountType: 'Creator'
      },
      {
        id: 'usr_rohan_03',
        uid: 'firebase_uid_rohan',
        username: 'rohan_verma',
        fullName: 'रोहन वर्मा (Rohan)',
        email: 'rohan@bharatconnect.in',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        bio: 'जयपुर | Handloom Artisan & Desi Haat Seller 🧵',
        verified: true,
        accountType: 'Artisan'
      },
      {
        id: 'usr_ananya_04',
        uid: 'firebase_uid_ananya',
        username: 'ananya_deshmukh',
        fullName: 'अनन्या देशमुख (Ananya)',
        email: 'ananya@bharatconnect.in',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        bio: 'पुणे | Classical Vocalist & Heritage Conservationist 🎶',
        verified: true,
        accountType: 'Artist'
      },
      {
        id: 'usr_vikram_05',
        uid: 'firebase_uid_vikram',
        username: 'vikram_rao',
        fullName: 'विक्रम राव (Vikram)',
        email: 'vikram@bharatconnect.in',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        bio: 'नई दिल्ली | Agritech & AI Innovator | Digital India Evangelist 🚀',
        verified: true,
        accountType: 'Founder'
      }
    ];

    for (const user of demoUsers) {
      await prisma.user.upsert({
        where: { username: user.username },
        update: user,
        create: user
      });
    }
    console.log('✅ 5 Demo Users (Aarav, Priya, Rohan, Ananya, Vikram) सीड हुए।');

    // 2. 10 Posts (#VocalForLocal, #DigitalIndia, etc.)
    const demoPosts = [
      {
        id: 'post_01',
        authorId: 'usr_aarav_01',
        content: 'आज बेंगलुरु में नए ओपन सोर्स इंडिक ट्रांसलेशन इंजन का पहला प्रिव्यू टेस्ट किया। 12 भारतीय भाषाओं में 99.4% सटीकता! 🇮🇳🚀 #DigitalIndia #TechBharat',
        imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
        likesCount: 1240,
        commentsCount: 142,
        sharesCount: 88,
        tags: ['DigitalIndia', 'TechBharat', 'OpenSource']
      },
      {
        id: 'post_02',
        authorId: 'usr_priya_02',
        content: 'भारतीय संस्कृति और त्योहारों के रंगों से प्रेरित नया UI कंपोनेंट सिस्टम तैयार किया है। केसरिया और मोरपंखी शेड्स अद्भुत लग रहे हैं! 🎨✨ #VocalForLocal #DesignBharat',
        imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&auto=format&fit=crop&q=80',
        likesCount: 890,
        commentsCount: 94,
        sharesCount: 45,
        tags: ['VocalForLocal', 'DesignBharat']
      },
      {
        id: 'post_03',
        authorId: 'usr_vikram_05',
        content: 'ग्रामीण भारत के किसानों के लिए सौर ऊर्जा से संचालित कोल्ड स्टोरेज प्रोजेक्ट अब 50 गांवों में लाइव है। आत्मनिर्भर भारत की सच्ची ताकत जमीन से आती है! 🌾☀️ #DigitalIndia #Agritech',
        imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&auto=format&fit=crop&q=80',
        likesCount: 3410,
        commentsCount: 310,
        sharesCount: 520,
        tags: ['DigitalIndia', 'Agritech', 'AtmanirbharBharat']
      },
      {
        id: 'post_04',
        authorId: 'usr_ananya_04',
        content: 'काशी के अस्सी घाट पर आज सुबह की राग भैरवी की प्रस्तुति। गंगा जी की लहरों के साथ सुरों का मिलन एक अलौकिक अनुभव देता है। 🙏🎶 #KashiSangeet #IndianClassical',
        imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80',
        likesCount: 2150,
        commentsCount: 180,
        sharesCount: 190,
        tags: ['KashiSangeet', 'IndianClassical']
      },
      {
        id: 'post_05',
        authorId: 'usr_rohan_03',
        content: 'जयपुर के पारंपरिक ब्लॉक प्रिंट और खादी से तैयार की गई कॉटन साड़ियां अब सीधे देसी हाट पर उपलब्ध हैं। हर साड़ी में 3 दिन की बारीक कारीगरी लगी है। 🧵🛍️ #VocalForLocal #DesiHaat',
        imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
        likesCount: 980,
        commentsCount: 65,
        sharesCount: 82,
        tags: ['VocalForLocal', 'DesiHaat', 'HandmadeIndia']
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
        authorId: 'usr_vikram_05',
        content: 'भारत 100+ यूनिकॉर्न्स का देश बन चुका है, लेकिन असली क्रांति टियर-2 और टियर-3 शहरों से आ रही है। जमीनी समस्याओं के टेक समाधान बन रहे हैं। 🇮🇳💡 #DigitalIndia #StartupBharat',
        likesCount: 4200,
        commentsCount: 450,
        sharesCount: 620,
        tags: ['DigitalIndia', 'StartupBharat']
      },
      {
        id: 'post_09',
        authorId: 'usr_ananya_04',
        content: 'पुणे संगीत महोत्सव की तैयारियां जोरों पर हैं। इस बार 20 से अधिक युवा शास्त्रीय कलाकारों को मंच मिलेगा। 🪕🪘 #Sanskriti #IndianArt',
        imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
        likesCount: 1150,
        commentsCount: 78,
        sharesCount: 54,
        tags: ['Sanskriti', 'IndianArt']
      },
      {
        id: 'post_10',
        authorId: 'usr_rohan_03',
        content: 'हमारी पारंपरिक कला और दस्तकारी को नई पीढ़ी तक पहुंचाने के लिए डिजिटल कार्यशाला शुरू कर रहे हैं। हस्तकला भारत की आत्मा है। ✋🪵 #VocalForLocal',
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
    console.log('✅ 10 Posts (#VocalForLocal, #DigitalIndia) सीड हुए।');

    // 3. 5 Groups (Tech Bharat, Desi Foodies, Startup India, Bharatiya Sanskriti, Cricket Lovers)
    const demoGroups = [
      {
        id: 'grp_tech_bharat',
        name: 'Tech Bharat',
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
        name: 'Desi Foodies',
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
        name: 'Startup India',
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
        name: 'Bharatiya Sanskriti',
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
        name: 'Cricket Lovers',
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
    console.log('✅ 5 Groups (Tech Bharat, Desi Foodies, Startup India, Bharatiya Sanskriti, Cricket Lovers) सीड हुए।');

    // 4. 5 Events
    const demoEvents = [
      {
        id: 'evt_01',
        title: 'Diwali Tech Conclave Bengaluru',
        hindiTitle: 'दीवाली टेक कॉन्क्लेव (Bengaluru)',
        description: 'भारत के शीर्ष टेक लीडर्स, ओपन सोर्स डेवलपर्स और AI इनोवेटर्स का वार्षिक सम्मेलन।',
        category: 'Technology',
        date: '2026-11-05',
        time: '10:00 AM IST',
        location: 'Koramangala Indoor Stadium',
        city: 'Bengaluru',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
        organizer: 'Tech Bharat Community',
        totalSeats: 1500,
        rsvpCount: 840
      },
      {
        id: 'evt_02',
        title: 'Kashi Classical Music Evening',
        hindiTitle: 'काशी शास्त्रीय संगीत संध्या',
        description: 'गंगा घाट पर सूर्यास्त के समय राग और ताल की पावन संगीतमय प्रस्तुति।',
        category: 'Culture',
        date: '2026-11-12',
        time: '06:00 PM IST',
        location: 'Assi Ghat Stage',
        city: 'Varanasi',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80',
        organizer: 'Kashi Sanskriti Parishad',
        totalSeats: 800,
        rsvpCount: 620
      },
      {
        id: 'evt_03',
        title: 'Bengaluru Founders Chai Meet',
        hindiTitle: 'बेंगलुरु फाउंडर्स चाय मीट',
        description: 'अनौपचारिक नेटवर्किंग, पिच चर्चा और मसाला चाय के साथ फाउंडर्स और इन्वेस्टर्स की मुलाकात।',
        category: 'Startups',
        date: '2026-11-18',
        time: '04:30 PM IST',
        location: 'Chai Point Flagship, Indiranagar',
        city: 'Bengaluru',
        image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop&q=80',
        organizer: 'Startup India Adda',
        totalSeats: 120,
        rsvpCount: 115
      },
      {
        id: 'evt_04',
        title: 'Jaipur Handicrafts Mela',
        hindiTitle: 'जयपुर हैंडीक्राफ्ट्स मेला',
        description: 'राजस्थान के पारंपरिक बुनकरों, मूर्तिकारों और शिल्पकारों की राष्ट्रीय प्रदर्शनी।',
        category: 'Arts',
        date: '2026-12-01',
        time: '11:00 AM IST',
        location: 'Shilpgram, Jawahar Kala Kendra',
        city: 'Jaipur',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
        organizer: 'Rajasthan Hastshilp Board',
        totalSeats: 3000,
        rsvpCount: 1850
      },
      {
        id: 'evt_05',
        title: 'Mumbai Fintech Expo 2026',
        hindiTitle: 'मुंबई फिनटेक एक्सपो',
        description: 'UPI, CBDC, डिजिटल लेंडिंग और भारतीय डिजिटल पब्लिक इंफ्रास्ट्रक्चर की भविष्य की राह।',
        category: 'Business',
        date: '2026-12-10',
        time: '09:30 AM IST',
        location: 'Jio World Convention Centre, BKC',
        city: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
        organizer: 'Digital Payments Council of India',
        totalSeats: 2500,
        rsvpCount: 2100
      }
    ];

    for (const evt of demoEvents) {
      await prisma.event.upsert({
        where: { id: evt.id },
        update: evt,
        create: evt
      });
    }
    console.log('✅ 5 Events (दीवाली टेक कॉन्क्लेव, काशी संगीत, चाय मीट, जयपुर मेला, मुंबई एक्सपो) सीड हुए।');

    // 5. 5 Products
    const demoProducts = [
      {
        id: 'prod_01',
        title: 'Pure Banarasi Silk Saree',
        hindiTitle: 'बनारसी सिल्क साड़ी',
        description: 'वाराणसी के पारंपरिक जुलाहों द्वारा हाथ से बुनी गई शुद्ध कतान सिल्क साड़ी, असली ज़री बॉर्डर के साथ।',
        price: 4999,
        originalPrice: 8999,
        discount: '44% छूट',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
        category: 'Clothing',
        artisanName: 'विष्णु बुनकर (Varanasi Weavers)',
        artisanLocation: 'वाराणसी, उत्तर प्रदेश',
        rating: 4.9,
        reviewsCount: 312,
        isHandmade: true,
        inStock: true
      },
      {
        id: 'prod_02',
        title: 'First Flush Organic Darjeeling Tea',
        hindiTitle: 'दार्जिलिंग टी',
        description: 'हिमालय की वादियों से चुनी गई प्रीमियम ऑर्थोडॉक्स फर्स्ट फ्लश ऑर्गेनिक ब्लैक टी (250 ग्राम)।',
        price: 650,
        originalPrice: 950,
        discount: '31% छूट',
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
        category: 'Food',
        artisanName: 'माउंटेन टी कोऑपरेटिव',
        artisanLocation: 'दार्जिलिंग, पश्चिम बंगाल',
        rating: 4.8,
        reviewsCount: 184,
        isHandmade: false,
        inStock: true
      },
      {
        id: 'prod_03',
        title: 'Handcrafted Brass Nataraja Idol',
        hindiTitle: 'ब्रास नटराज',
        description: 'तंजावुर की प्राचीन लॉस्ट-वैक्स पद्धति से निर्मित 10 इंच का पीतल का नटराज स्वरूप।',
        price: 2499,
        originalPrice: 3999,
        discount: '37% छूट',
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80',
        category: 'Decor',
        artisanName: 'स्वामीनाथन मेटल क्राफ्ट्स',
        artisanLocation: 'तंजावुर, तमिलनाडु',
        rating: 5.0,
        reviewsCount: 96,
        isHandmade: true,
        inStock: true
      },
      {
        id: 'prod_04',
        title: 'Authentic Kolhapuri Chappal',
        hindiTitle: 'कोल्हापुरी चप्पल',
        description: 'प्राकृतिक लेदर से हाथ से सिले पारंपरिक कोल्हापुरी चप्पल, टिकाऊ और पैरों के लिए आरामदायक।',
        price: 1199,
        originalPrice: 1899,
        discount: '36% छूट',
        image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80',
        category: 'Footwear',
        artisanName: 'महादेव चर्मकार बंधु',
        artisanLocation: 'कोल्हापुर, महाराष्ट्र',
        rating: 4.7,
        reviewsCount: 220,
        isHandmade: true,
        inStock: true
      },
      {
        id: 'prod_05',
        title: 'Handwoven Kashmiri Pashmina Shawl',
        hindiTitle: 'कश्मीरी पश्मीना शॉल',
        description: 'लद्दाख की चांगथांगी बकरी के बालों से तैयार 100% असली कश्मीरी सुजनी कढ़ाईदार पश्मीना शॉल।',
        price: 7499,
        originalPrice: 12999,
        discount: '42% छूट',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
        category: 'Clothing',
        artisanName: 'गुलाम नबी आर्टिसन्स',
        artisanLocation: 'श्रीनगर, कश्मीर',
        rating: 4.9,
        reviewsCount: 145,
        isHandmade: true,
        inStock: true
      }
    ];

    for (const prod of demoProducts) {
      await prisma.product.upsert({
        where: { id: prod.id },
        update: prod,
        create: prod
      });
    }
    console.log('✅ 5 Products (बनारसी सिल्क साड़ी, दार्जिलिंग टी, ब्रास नटराज, कोल्हापुरी चप्पल, कश्मीरी पश्मीना शॉल) सीड हुए।');

    console.log('🎉 [BharatConnect] सभी 5 टेबल्स सफलतापूर्वक और Idempotently सीड हो गईं!');
  } catch (error) {
    console.error('❌ [BharatConnect] डेटाबेस सीड प्रक्रिया में त्रुटि:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (process.argv[1]?.endsWith('seed.ts')) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
