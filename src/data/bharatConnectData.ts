import { User, Post, Story, Reel, AppNotification, ReportTicket } from '../types/bharatConnect';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_01',
    username: 'aarav_sharma',
    fullName: 'Aarav Sharma',
    handle: '@aarav',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    bio: 'Software Engineer & tech creator from Bengaluru. Building for Digital Bharat 🇮🇳',
    location: 'Bengaluru, Karnataka',
    verified: true,
    followersCount: 14820,
    followingCount: 340,
    postCount: 12,
    isFollowing: false,
    language: 'hi'
  },
  {
    id: 'usr_02',
    username: 'priya_creations',
    fullName: 'Priya Patel',
    handle: '@priya_ux',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    bio: 'Traveler, designer & food explorer. Celebrating Indian art & street food ✨',
    location: 'Mumbai, Maharashtra',
    verified: true,
    followersCount: 28400,
    followingCount: 420,
    postCount: 28,
    isFollowing: true,
    language: 'hi'
  },
  {
    id: 'usr_03',
    username: 'vikram_founder',
    fullName: 'Vikramaditya Rao',
    handle: '@vikram_rao',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    bio: 'Startup enthusiast & angel backer. India is the global innovation hub 🚀',
    location: 'New Delhi, Delhi',
    verified: true,
    followersCount: 42100,
    followingCount: 180,
    postCount: 45,
    isFollowing: true,
    language: 'en'
  },
  {
    id: 'usr_04',
    username: 'ananya_art',
    fullName: 'Ananya Sundaram',
    handle: '@ananya_s',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    bio: 'Classical Carnatic music & visual aesthetics. Chennai vibes 🪷',
    location: 'Chennai, Tamil Nadu',
    verified: false,
    followersCount: 19350,
    followingCount: 290,
    postCount: 18,
    isFollowing: false,
    language: 'ta'
  },
  {
    id: 'usr_05',
    username: 'rahul_tech',
    fullName: 'Rahul Sharma',
    handle: '@rahul_sharma',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    bio: 'Android & Web developer. Excited to connect on BharatConnect! 📱',
    location: 'Noida, Uttar Pradesh',
    verified: true,
    followersCount: 240,
    followingCount: 65,
    postCount: 3,
    isFollowing: false,
    language: 'hi'
  }
];

export const CURRENT_USER: User = INITIAL_USERS[4]; // Rahul Sharma (User's account)

export const SAMPLE_POST_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80',
    title: 'Varanasi Evening Ganga Aarti',
    location: 'Varanasi, Uttar Pradesh'
  },
  {
    url: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80',
    title: 'Jaipur Hawa Mahal Palace',
    location: 'Jaipur, Rajasthan'
  },
  {
    url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
    title: 'Historic Indian Architecture',
    location: 'Delhi, India'
  },
  {
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
    title: 'Bengaluru Tech Co-working',
    location: 'Bengaluru, Karnataka'
  },
  {
    url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
    title: 'Traditional Masala Chai & Samosa',
    location: 'Indore, Madhya Pradesh'
  }
];

export const INITIAL_STORIES: Story[] = [
  {
    id: 'story_01',
    author: INITIAL_USERS[1], // Priya
    imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&auto=format&fit=crop&q=80',
    title: 'Evening peace at Dashashwamedh Ghat 🌅',
    viewCount: 1420,
    createdAt: '2h ago',
    hasSeen: false
  },
  {
    id: 'story_02',
    author: INITIAL_USERS[0], // Aarav
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
    title: 'Hackathon weekend in Bengaluru 💻⚡',
    viewCount: 980,
    createdAt: '4h ago',
    hasSeen: false
  },
  {
    id: 'story_03',
    author: INITIAL_USERS[2], // Vikram
    imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&auto=format&fit=crop&q=80',
    title: 'Jaipur startup summit day 1 🏰',
    viewCount: 2350,
    createdAt: '6h ago',
    hasSeen: false
  },
  {
    id: 'story_04',
    author: INITIAL_USERS[3], // Ananya
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=80',
    title: 'Morning classical raga session 🎶',
    viewCount: 890,
    createdAt: '8h ago',
    hasSeen: true
  }
];

// Exact dummy data requested by user (for React Native / Web compatibility)
export const initialDummyPosts = [
  {
    id: 'railway_1',
    user: 'railway_shayar_aman',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100',
    location: 'नई दिल्ली रेलवे स्टेशन 🚆',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800',
    caption: 'मंज़िल की तलाश में पटरियों पर दौड़ती ज़िंदगी... 🚆🇮🇳 वन्दे भारत एक्सप्रेस! भारतीय रेल हमारी शान है। #IndianRailways #BharatConnect ❤️',
    likes: 4850,
    comments: 312,
    timestamp: 'अभी-अभी (Just now)',
  },
  {
    id: '1',
    user: 'संत कबीर वाणी',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    location: 'काशी (Desi Haat)',
    type: 'audio',
    content: 'बुरा जो देखन मैं चला, बुरा न मिलिया कोय। जो दिल खोजा आपना, मुझसे बुरा न कोय॥ 🎙️✨',
    audioDuration: '0:45',
    likes: 1240,
    comments: 88,
    timestamp: '2 घंटे पहले',
  },
  {
    id: '2',
    user: 'प्रियंका शर्मा',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100',
    location: 'जयपुर, राजस्थान',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=600',
    caption: 'आज देसी हाट में हाथ से बनी राजस्थानी बंधनी साड़ी देखी! बेहद खूबसूरत। 🧵✨',
    likes: 432,
    comments: 29,
    timestamp: '4 घंटे पहले',
  },
  {
    id: '3',
    user: 'राहुल वर्मा',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100',
    location: 'वाराणसी घाट',
    type: 'text',
    content: 'शाम की गंगा आरती का सुकून ही कुछ अलग है। हर हर गंगे! 🙏',
    likes: 850,
    comments: 45,
    timestamp: '5 घंटे पहले',
  },
  {
    id: '4',
    user: 'अमृता कौर',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
    location: 'अमृतसर, पंजाब',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1588096344356-9b5847413693?w=600',
    caption: 'अमृतसर स्वर्ण मंदिर की पावन प्रभा और लंगर की निःस्वार्थ सेवा। वाहेगुरु जी का खालसा, वाहेगुरु जी की फतेह! 🪔🕊️',
    likes: 3420,
    comments: 112,
    timestamp: '6 घंटे पहले',
  },
  {
    id: '5',
    user: 'मिर्ज़ा ग़ालिब शायरी',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    location: 'पुरानी दिल्ली',
    type: 'audio',
    content: 'हज़ारों ख़्वाहिशें ऐसी कि हर ख़्वाहिश पे दम निकले\nबहुत निकले मिरे अरमाँ लेकिन फिर भी कम निकले... 🎙️📖',
    audioDuration: '0:52',
    likes: 2150,
    comments: 94,
    timestamp: '7 घंटे पहले',
  },
  {
    id: '6',
    user: 'आनंद नारायणन',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100',
    location: 'अलेप्पी (Alleppey), केरल',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600',
    caption: 'केरल बैकवाटर्स की शांत लहरें, हाउसबोट और नारियल के झुरमुट। गॉड्स ओन कंट्री सच में स्वर्ग है। 🌴🛶',
    likes: 1890,
    comments: 64,
    timestamp: '8 घंटे पहले',
  },
  {
    id: '7',
    user: 'रोहित मेहरा',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    location: 'पैंगोंग लेक, लद्दाख',
    type: 'text',
    content: '14,000 फीट पर लद्दाख की पैंगोंग झील और रात में तारों भरा आकाशगंगा (Milky Way)। भारत की असली सुंदरता इसकी प्रकृति में है! 🌌🏔️',
    likes: 2740,
    comments: 138,
    timestamp: '9 घंटे पहले',
  },
  {
    id: '8',
    user: 'श्रेया चटर्जी',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100',
    location: 'कोलकाता, पश्चिम बंगाल',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600',
    caption: 'ढाक की गूंज और सिंदूर खेला की खुशियां! कोलकाता में दुर्गा पूजा की चमक हमेशा दिल छू लेती है। 🥁🌸',
    likes: 4120,
    comments: 230,
    timestamp: '11 घंटे पहले',
  },
  {
    id: '9',
    user: 'हरिवंश राय बच्चन काव्य',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100',
    location: 'प्रयागराज संगम',
    type: 'audio',
    content: 'लहरों से डर कर नौका पार नहीं होती, कोशिश करने वालों की कभी हार नहीं होती... 🎙️🌊',
    audioDuration: '1:10',
    likes: 5640,
    comments: 320,
    timestamp: '12 घंटे पहले',
  },
  {
    id: '10',
    user: 'विक्रम सिंह राठौड़',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100',
    location: 'सैम ड्यून्स, जैसलमेर',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600',
    caption: 'थार मरुस्थल में ऊंटों का कारवां और राजस्थानी लोकगीतों की गूंजती शाम। पधारो म्हारे देस! 🐪🏜️',
    likes: 1560,
    comments: 58,
    timestamp: '14 घंटे पहले',
  },
  {
    id: '11',
    user: 'कविता कृष्णमूर्ति',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    location: 'मदुरै, तमिलनाडु',
    type: 'text',
    content: 'मीनाक्षी अम्मन मंदिर के गोपुरम की ऐतिहासिक नक्काशी और आध्यात्मिक वातावरण। हमारी भारतीय प्राचीन वास्तुकला अद्वितीय है। 🛕🙏',
    likes: 1980,
    comments: 76,
    timestamp: '16 घंटे पहले',
  },
  {
    id: '12',
    user: 'इरफ़ान खान',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100',
    location: 'चांदनी चौक, दिल्ली',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600',
    caption: 'पुरानी दिल्ली के चांदनी चौक की गरमा-गरम जलेबी और मलाईदार रबड़ी! देसी स्वाद की बात ही निराली है। 🍯😋',
    likes: 3450,
    comments: 185,
    timestamp: '18 घंटे पहले',
  },
  {
    id: '13',
    user: 'गोस्वामी तुलसीदास अमृतवाणी',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    location: 'अयोध्या धाम',
    type: 'audio',
    content: 'धीरज धर्म मित्र अरु नारी, आपद काल परिखिअहिं चारी। मंगल भवन अमंगल हारी... 🎙️🪔',
    audioDuration: '0:48',
    likes: 4820,
    comments: 260,
    timestamp: '20 घंटे पहले',
  },
  {
    id: '14',
    user: 'नेहा कुलकर्णी',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100',
    location: 'मरीन ड्राइव, मुंबई',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=600',
    caption: 'क्वीन्स नेकलेस की चमक और अरब सागर की ठंडी हवा। मुंबई सिर्फ एक शहर नहीं, एक जज़्बा है! 🌊🏙️✨',
    likes: 2890,
    comments: 142,
    timestamp: '22 घंटे पहले',
  },
  {
    id: '15',
    user: 'गुलज़ार की डायरी',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100',
    location: 'पुणे, महाराष्ट्र',
    type: 'text',
    content: 'हाथ छूटे भी तो रिश्ते नहीं छूटा करते, वक़्त की शाख़ से लम्हे नहीं टूटा करते... ज़िंदगी मुस्कुराती रहे! 🍂📖',
    likes: 3120,
    comments: 198,
    timestamp: '1 दिन पहले',
  },
  {
    id: '16',
    user: 'सुधीर पटेल',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    location: 'कच्छ का सफ़ेद रण, गुजरात',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600',
    caption: 'कच्छ नहीं देखा तो कुछ नहीं देखा! सफ़ेद नमक के रेगिस्तान पर चांद की रोशनी में रण उत्सव का जादू। 🌕🐪✨',
    likes: 2630,
    comments: 120,
    timestamp: '1 दिन पहले',
  },
  {
    id: '17',
    user: 'उस्ताद बिस्मिल्लाह फ़ैंस',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    location: 'दशाश्वमेध घाट, काशी',
    type: 'audio',
    content: 'काशी की सुबह और पावन शहनाई की मंगल धुन। शास्त्रीय संगीत की आत्मा भारत की धरोहर है। 🎶🪔',
    audioDuration: '0:58',
    likes: 3890,
    comments: 175,
    timestamp: '1 दिन पहले',
  },
  {
    id: '18',
    user: 'मयंक जोशी',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100',
    location: 'ऋषिकेश, उत्तराखंड',
    type: 'text',
    content: 'लक्ष्मण झूला, गंगा तट और हिमालय की ताज़ा बयार में सुबह का योग व ध्यान। आंतरिक शांति का वास्तविक केंद्र! 🧘‍♂️🏔️',
    likes: 1750,
    comments: 82,
    timestamp: '2 दिन पहले',
  }
];

// Helper to convert dummy post to comprehensive Post model
function createDummyPostModel(item: typeof initialDummyPosts[0]): Post {
  const authorUser: User = {
    id: `usr_${item.id}`,
    username: item.user.toLowerCase().replace(/[^a-z0-9]/g, '') || `user_${item.id}`,
    fullName: item.user,
    name: item.user,
    handle: `@${item.user.toLowerCase().replace(/[^a-z0-9]/g, '') || `user_${item.id}`}`,
    avatar: item.avatar,
    photoURL: item.avatar,
    bio: `${item.user} - भारत कनेक्ट समुदाय 🇮🇳`,
    location: item.location,
    verified: true,
    followersCount: item.likes * 2,
    followingCount: 150,
    postCount: 12,
    language: 'hi'
  };

  const isAudio = item.type === 'audio';
  const isImage = item.type === 'image';

  return {
    id: `post_dummy_${item.id}`,
    postId: `post_dummy_${item.id}`,
    author: authorUser,
    caption: item.caption || item.content || '',
    text: item.content || item.caption || '',
    mediaUrl: item.mediaUrl,
    imageUrl: item.mediaUrl,
    imageURL: item.mediaUrl,
    mediaType: (item.type as 'audio' | 'image' | 'text'),
    audioURL: isAudio ? 'https://actions.google.com/sounds/v1/ambiences/daytime_forest_bonanza.ogg' : undefined,
    audioDuration: item.audioDuration || '0:45',
    audioTitle: isAudio ? item.content : undefined,
    likesCount: item.likes,
    likeCount: item.likes,
    commentsCount: item.comments,
    sharesCount: Math.round(item.likes * 0.15),
    isLiked: false,
    isSaved: false,
    locationName: item.location,
    createdAt: item.timestamp,
    language: 'hi',
    tags: [item.location.split(' ')[0].replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '') || 'BharatConnect', 'DesiVibes'],
    comments: [
      {
        id: `c_${item.id}_1`,
        author: INITIAL_USERS[0],
        text: 'बहुत सुंदर प्रस्तुति! जय हिन्द 🇮🇳',
        createdAt: '1h ago',
        likesCount: 12
      }
    ]
  };
}

export const INITIAL_POSTS: Post[] = initialDummyPosts.map(createDummyPostModel);

export const INITIAL_REELS: Reel[] = [
  {
    id: 'reel_00_railway',
    author: {
      id: 'usr_railway_aman',
      username: 'railway_shayar_aman',
      fullName: 'Aman | भारतीय रेल प्रेमी',
      name: 'Aman | भारतीय रेल प्रेमी',
      handle: '@railway_shayar_aman',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100',
      photoURL: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100',
      bio: 'Indian Railway & Train Lover ❤️ | Deep Hindi Shayari & Quotes',
      location: 'नई दिल्ली',
      verified: true,
      followersCount: 48200,
      followingCount: 182,
      postCount: 74,
      language: 'hi'
    },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1510519138171-eb1362e5b888?w=800',
    caption: 'वंदे भारत एक्सप्रेस - 130 km/h स्पीड ट्रायल 🔥🚆 मंज़िल की तलाश में दौड़ती भारतीय रेल! #IndianRailways #BharatConnect',
    audioTitle: 'देश रंगीला — Sarod Instrumental · railway_shayar_aman',
    likesCount: 24800,
    commentsCount: 940,
    isLiked: true,
    tags: ['IndianRailways', 'VandeBharat', 'ReelsIndia']
  },
  {
    id: 'reel_01',
    author: INITIAL_USERS[1],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&auto=format&fit=crop&q=80',
    caption: 'Ganga Aarti magic captured at 60fps ✨ Har Har Gange! #Varanasi #Peace',
    audioTitle: 'Mera Bharat Mahan · Acoustic Sitar Chill',
    likesCount: 14800,
    commentsCount: 520,
    isLiked: false,
    tags: ['Varanasi', 'Spiritual', 'ReelsIndia']
  },
  {
    id: 'reel_02',
    author: INITIAL_USERS[0],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
    caption: 'How we scaled our cache to 50k QPS on a ₹0 budget! ⚡ #TechBharat #DevLife',
    audioTitle: 'Lo-Fi Coding Beats · Bengaluru Indie',
    likesCount: 9400,
    commentsCount: 290,
    isLiked: true,
    tags: ['Coding', 'Startup', 'Developer']
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    notificationId: 'notif_01',
    id: 'notif_01',
    recipientUid: 'u_user',
    senderUid: INITIAL_USERS[1].id,
    senderName: INITIAL_USERS[1].fullName,
    senderPhotoURL: INITIAL_USERS[1].avatar,
    type: 'like',
    postId: 'post_01',
    message: 'ने आपकी पोस्ट को लाइक किया',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    actor: INITIAL_USERS[1],
    postPreview: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&auto=format&fit=crop&q=80',
    timeAgo: '15m ago',
    isRead: false
  },
  {
    notificationId: 'notif_02',
    id: 'notif_02',
    recipientUid: 'u_user',
    senderUid: INITIAL_USERS[0].id,
    senderName: INITIAL_USERS[0].fullName,
    senderPhotoURL: INITIAL_USERS[0].avatar,
    type: 'comment',
    postId: 'post_01',
    message: 'ने आपकी पोस्ट पर टिप्पणी की',
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    actor: INITIAL_USERS[0],
    postPreview: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=100&auto=format&fit=crop&q=80',
    timeAgo: '1h ago',
    isRead: false
  },
  {
    notificationId: 'notif_03',
    id: 'notif_03',
    recipientUid: 'u_user',
    senderUid: INITIAL_USERS[3].id,
    senderName: INITIAL_USERS[3].fullName,
    senderPhotoURL: INITIAL_USERS[3].avatar,
    type: 'follow',
    message: 'ने आपको फ़ॉलो करना शुरू किया',
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    actor: INITIAL_USERS[3],
    timeAgo: '3h ago',
    isRead: true
  },
  {
    notificationId: 'notif_04',
    id: 'notif_04',
    recipientUid: 'u_user',
    senderUid: INITIAL_USERS[2].id,
    senderName: INITIAL_USERS[2].fullName,
    senderPhotoURL: INITIAL_USERS[2].avatar,
    type: 'mention',
    message: 'ने आपको मेंशन किया',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    actor: INITIAL_USERS[2],
    timeAgo: '1d ago',
    isRead: true
  }
];

export const INITIAL_REPORTS: ReportTicket[] = [
  {
    id: 'rep_101',
    reportedPostId: 'post_03',
    reportedPostCaption: 'गुलाबी नगर जयपुर की ऐतिहासिक धरोहर...',
    reportedPostImage: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=200&auto=format&fit=crop&q=80',
    reportedUser: INITIAL_USERS[2],
    reporterUser: INITIAL_USERS[0],
    reason: 'Misleading copyright attribution',
    details: 'Requested credit for historical facts citation.',
    status: 'pending',
    createdAt: '2026-10-21 08:30:00'
  }
];
