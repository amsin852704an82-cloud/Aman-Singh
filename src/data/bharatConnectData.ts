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

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post_01',
    author: INITIAL_USERS[1], // Priya
    caption: 'काशी की शाम, दीपों की रोशनी और मां गंगा का आशीर्वाद। ऐसा अनुभव जो हमेशा दिल में रह जाता है। हर हर गंगे! 🪔✨\n\nEvening bliss at the Ghats of Varanasi. The spiritual energy here is unmatched.',
    imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80',
    likesCount: 3840,
    commentsCount: 142,
    sharesCount: 310,
    isLiked: false,
    isSaved: true,
    locationName: 'Varanasi, Uttar Pradesh',
    createdAt: '2 hours ago',
    language: 'hi',
    tags: ['Varanasi', 'IncredibleIndia', 'GangaGhat', 'SpiritualBharat'],
    comments: [
      {
        id: 'c_01',
        author: INITIAL_USERS[0],
        text: 'अद्भुत फ़ोटो प्रिया जी! सच में शांति मिलती है यहां।',
        createdAt: '1h ago',
        likesCount: 24
      },
      {
        id: 'c_02',
        author: INITIAL_USERS[3],
        text: 'Magnificent shot! The brass lamp reflection on the water is surreal.',
        createdAt: '45m ago',
        likesCount: 12
      }
    ]
  },
  {
    id: 'post_02',
    author: INITIAL_USERS[0], // Aarav
    caption: 'Bengaluru tech campus looking stunning after the evening drizzle. Building our Indian social tech stack with high-concurrency systems! 🇮🇳💻\n\nProud of what the Indian developer community is creating for the next billion users.',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
    likesCount: 2490,
    commentsCount: 86,
    sharesCount: 195,
    isLiked: true,
    isSaved: false,
    locationName: 'Indiranagar, Bengaluru',
    createdAt: '5 hours ago',
    language: 'en',
    tags: ['BengaluruTech', 'DigitalIndia', 'StartInBharat', 'OpenSource'],
    comments: [
      {
        id: 'c_03',
        author: INITIAL_USERS[2],
        text: 'Incredible speed of execution Aarav! Indian tech leadership is real.',
        createdAt: '3h ago',
        likesCount: 18
      }
    ]
  },
  {
    id: 'post_03',
    author: INITIAL_USERS[2], // Vikram
    caption: 'गुलाबी नगर जयपुर की ऐतिहासिक धरोहर और हवा महल का बेमिसाल वास्तुशिल्प। भारतीय कारीगरी और इतिहास पर गर्व है।\n\nHawa Mahal palace standing tall since 1799. Pure architectural genius! 🏰',
    imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80',
    likesCount: 5120,
    commentsCount: 230,
    sharesCount: 420,
    isLiked: false,
    isSaved: false,
    locationName: 'Jaipur, Rajasthan',
    createdAt: '1 day ago',
    language: 'hi',
    tags: ['Jaipur', 'HawaMahal', 'RajasthanDiaries', 'HeritageIndia'],
    comments: [
      {
        id: 'c_04',
        author: INITIAL_USERS[1],
        text: 'The window honeycomb symmetry is simply breathtaking!',
        createdAt: '18h ago',
        likesCount: 31
      }
    ]
  },
  {
    id: 'post_04_awaaz',
    author: INITIAL_USERS[3], // Ananya Sundaram
    caption: 'हज़ारों ख़्वाहिशें ऐसी कि हर ख़्वाहिश पे दम निकले\nबहुत निकले मिरे अरमाँ लेकिन फिर भी कम निकले... 🎙️✨\n\nमिर्ज़ा ग़ालिब की अमर रचना, मेरी आवाज़ में। सुनिए और आनंद लीजिए।',
    audioURL: 'https://actions.google.com/sounds/v1/ambiences/daytime_forest_bonanza.ogg',
    audioDuration: 42,
    audioTitle: 'मिर्ज़ा ग़ालिब - हज़ारों ख़्वाहिशें ऐसी',
    mediaType: 'audio',
    likesCount: 1840,
    commentsCount: 68,
    sharesCount: 142,
    isLiked: false,
    isSaved: true,
    locationName: 'Chennai, Tamil Nadu',
    createdAt: '3 hours ago',
    language: 'hi',
    tags: ['Awaaz', 'Shayari', 'Ghalib', 'Kavita', 'IndianPoetry'],
    comments: [
      {
        id: 'c_05',
        author: INITIAL_USERS[0],
        text: 'वाह! आपकी आवाज़ में ग़ालिब साहब की शायरी बहुत पुरअसर लगी। 👏',
        createdAt: '2h ago',
        likesCount: 15
      }
    ]
  },
  {
    id: 'post_05_awaaz',
    author: INITIAL_USERS[0], // Aarav Sharma
    caption: 'गुरु गोविंद दोऊ खड़े, काके लागूं पांय।\nबलिहारी गुरु आपने, गोविंद दियो बताय॥ 🙏\n\nसंत कबीर का यह अनमोल दोहा हमारे जीवन की दिशा तय करता है।',
    audioURL: 'https://actions.google.com/sounds/v1/water/creek_water_lapping.ogg',
    audioDuration: 30,
    audioTitle: 'संत कबीर - अमर साखी व दोहा',
    mediaType: 'audio',
    likesCount: 3290,
    commentsCount: 114,
    sharesCount: 280,
    isLiked: true,
    isSaved: false,
    locationName: 'Bengaluru, Karnataka',
    createdAt: '6 hours ago',
    language: 'hi',
    tags: ['Awaaz', 'KabirDoha', 'Bhakti', 'SpiritualIndia'],
    comments: [
      {
        id: 'c_06',
        author: INITIAL_USERS[2],
        text: 'कबीर के विचार आज भी उतने ही प्रासंगिक हैं। बहुत सुंदर प्रस्तुति!',
        createdAt: '4h ago',
        likesCount: 22
      }
    ]
  }
];

export const INITIAL_REELS: Reel[] = [
  {
    id: 'reel_01',
    author: INITIAL_USERS[1],
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
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
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
    caption: 'How we scaled our cache to 50k QPS on a ₹0 budget! ⚡ #TechBharat #DevLife',
    audioTitle: 'Lo-Fi Coding Beats · Bengaluru Indie',
    likesCount: 9400,
    commentsCount: 290,
    isLiked: true,
    tags: ['Coding', 'Startup', 'Developer']
  },
  {
    id: 'reel_03',
    author: INITIAL_USERS[2],
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&auto=format&fit=crop&q=80',
    caption: '3 reasons why Tier-2 Indian cities are producing the next unicorns 🦄',
    audioTitle: 'Founders Anthem · Desi Beat',
    likesCount: 21300,
    commentsCount: 840,
    isLiked: false,
    tags: ['Unicorn', 'StartupIndia', 'Bharat']
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
