import { 
  User, 
  Post, 
  Reel, 
  Story, 
  VirtualGift, 
  GiftTransaction, 
  CreatorEarningsState, 
  WithdrawalRecord, 
  DatabaseTable, 
  RedisKeyItem, 
  MinioObjectItem, 
  ApiEndpoint 
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    username: 'aarav_dev',
    fullName: 'Aarav Sharma',
    handle: '@aarav',
    email: 'aarav@bharat.dev',
    phone: '+919876543210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Building Bharat-scale systems with Rust & Postgres. Bengaluru.',
    location: 'Bengaluru, Karnataka',
    verified: true,
    role: 'Developer',
    followersCount: 14820,
    followingCount: 340,
    postCount: 84,
    language: 'hi'
  },
  {
    id: 'b1ffcd88-8b1a-3de7-aa5c-5aa8ac270b22',
    username: 'priya_ux',
    fullName: 'Priya Patel',
    handle: '@priya_ux',
    email: 'priya@bharat.design',
    phone: '+919876543211',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bio: 'Design systems for the next billion users in Indic languages. Mumbai.',
    location: 'Mumbai, Maharashtra',
    verified: true,
    role: 'Creator',
    followersCount: 28400,
    followingCount: 512,
    postCount: 142,
    language: 'hi'
  },
  {
    id: 'c2eedd77-7a2b-2cd6-994b-4bb7bd160c33',
    username: 'vikram_founder',
    fullName: 'Vikramaditya Rao',
    handle: '@vikram_rao',
    email: 'vikram@bharat.vc',
    phone: '+919876543212',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Deeptech & Agritech founder. Backing Bharat innovators.',
    location: 'New Delhi, Delhi',
    verified: true,
    role: 'Founder',
    followersCount: 42100,
    followingCount: 180,
    postCount: 96,
    language: 'en'
  },
  {
    id: 'd3ffcc66-6f3c-1bc5-883a-3aa6ac050d44',
    username: 'ananya_chennai',
    fullName: 'Ananya Sundaram',
    handle: '@ananya_s',
    email: 'ananya@bharat.ai',
    phone: '+919876543213',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    bio: 'AI researcher at IIT Madras. Open-source Indic LLMs.',
    location: 'Chennai, Tamil Nadu',
    verified: true,
    role: 'Developer',
    followersCount: 19350,
    followingCount: 290,
    postCount: 65,
    language: 'ta'
  },
  {
    id: 'e4aab776-8f2c-4ef1-992a-4bb6bd280c55',
    username: 'rahul_sharma',
    fullName: 'Rahul Sharma',
    handle: '@rahul_sharma',
    email: 'rahul@example.com',
    phone: '+919811223344',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    bio: 'Software engineer building on Bharat Social platform.',
    location: 'Noida, Uttar Pradesh',
    verified: true,
    role: 'Developer',
    followersCount: 0,
    followingCount: 0,
    postCount: 0,
    language: 'hi'
  }
];

export const CURRENT_USER: User = INITIAL_USERS[4]; // Default to newly registered Rahul Sharma!

export const VIRTUAL_GIFTS: VirtualGift[] = [
  { id: 'gift_01', name: 'Rose', icon: '🌹', coinPrice: 10 },
  { id: 'gift_02', name: 'Heart', icon: '❤️', coinPrice: 50 },
  { id: 'gift_03', name: 'Diamond', icon: '💎', coinPrice: 100 },
  { id: 'gift_04', name: 'Crown', icon: '👑', coinPrice: 500 },
  { id: 'gift_05', name: 'Rocket', icon: '🚀', coinPrice: 1000 }
];

export const INITIAL_STORIES: Story[] = [
  {
    id: 'story_01',
    userId: INITIAL_USERS[1].id,
    author: INITIAL_USERS[1],
    mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
    mediaType: 'image',
    durationSeconds: 5,
    viewCount: 1840,
    expiresAt: 'In 18 hours',
    createdAt: '6h ago'
  },
  {
    id: 'story_02',
    userId: INITIAL_USERS[0].id,
    author: INITIAL_USERS[0],
    mediaUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=80',
    mediaType: 'image',
    durationSeconds: 5,
    viewCount: 920,
    expiresAt: 'In 21 hours',
    createdAt: '3h ago'
  },
  {
    id: 'story_03',
    userId: INITIAL_USERS[2].id,
    author: INITIAL_USERS[2],
    mediaUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&auto=format&fit=crop&q=80',
    mediaType: 'image',
    durationSeconds: 5,
    viewCount: 3100,
    expiresAt: 'In 14 hours',
    createdAt: '10h ago'
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'f4eeaa55-5d4e-0ab4-7729-2bb5bd940e55',
    userId: INITIAL_USERS[0].id,
    author: INITIAL_USERS[0],
    content: 'Just migrated our social feed cache to Redis 7 with LRU eviction! Handling 50k QPS on a single node without breaking a sweat. The speed of open-source infra for Bharat is unreal. 🇮🇳⚡\n\nPostgres 14+ with pg_trgm indices + Redis + MinIO S3 is pure productivity.',
    tags: ['TechStack', 'Redis', 'PostgreSQL', 'DigitalIndia'],
    language: 'English',
    likesCount: 1243,
    commentCount: 88,
    saveCount: 340,
    shareCount: 142,
    viewCount: 28400,
    moderationStatus: 'approved',
    createdAt: '12m ago',
    region: 'Bengaluru',
    locationName: 'Indiranagar, Bengaluru'
  },
  {
    id: 'e5ffbb44-4c5d-9bc3-6618-1aa4ac830f66',
    userId: INITIAL_USERS[1].id,
    author: INITIAL_USERS[1],
    content: 'भारतीय भाषाओं में UI/UX डिज़ाइन करना सिर्फ़ फ़ॉन्ट बदलना नहीं है, बल्कि लेआउट और इमोशन को समझना है। हमने 8 प्रमुख भारतीय लिपियों के लिए नया टाइपोग्राफ़ी सिस्टम जारी किया है।\n\nआपकी क्या राय है?',
    tags: ['DesignBharat', 'IndicTech', 'Devnagari'],
    language: 'Hindi',
    likesCount: 2890,
    commentCount: 215,
    saveCount: 820,
    shareCount: 380,
    viewCount: 64100,
    moderationStatus: 'approved',
    createdAt: '45m ago',
    region: 'Mumbai',
    locationName: 'Bandra West, Mumbai'
  },
  {
    id: 'd6eedd33-3b6c-8cd2-5507-0bb3bd720a77',
    userId: INITIAL_USERS[2].id,
    author: INITIAL_USERS[2],
    content: 'Huge milestone: India recorded 14.9 Billion UPI transactions this month. Next frontier is localized social commerce and vernacular creator monetisation directly via ONDC and UPI auto-pay.',
    tags: ['UPI', 'Fintech', 'IndiaGrowth', 'Startups'],
    language: 'English',
    likesCount: 4510,
    commentCount: 312,
    saveCount: 1290,
    shareCount: 890,
    viewCount: 98000,
    moderationStatus: 'approved',
    createdAt: '2h ago',
    region: 'Delhi NCR',
    locationName: 'Connaught Place, New Delhi'
  },
  {
    id: 'c7ffcc22-2a7b-7bc1-4496-9aa2ac610b88',
    userId: INITIAL_USERS[3].id,
    author: INITIAL_USERS[3],
    content: 'எங்கள் தமிழ் AI மொழி மாதிரி இப்போது திறந்த மூலமாக கிடைக்கிறது! தமிழ் இலக்கியம் மற்றும் தொழில்நுட்ப கலந்துரையாடல்களுக்கு சிறப்பாக செயல்படுகிறது. அனைவரும் சோதித்துப் பாருங்கள்.',
    tags: ['TamilAI', 'OpenSource', 'DeepTech'],
    language: 'Tamil',
    likesCount: 1670,
    commentCount: 94,
    saveCount: 410,
    shareCount: 230,
    viewCount: 32000,
    moderationStatus: 'approved',
    createdAt: '4h ago',
    region: 'Chennai',
    locationName: 'IIT Madras Research Park'
  }
];

export const INITIAL_REELS: Reel[] = [
  {
    id: 'reel_01',
    author: INITIAL_USERS[0],
    title: 'Dockerizing PostgreSQL 14+ & Redis in 60s',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    duration: 45,
    soundTrack: 'Original Audio · Tech Beats India',
    views: 42300,
    likes: 3820,
    tags: ['DevOps', 'Docker', 'Postgres']
  },
  {
    id: 'reel_02',
    author: INITIAL_USERS[1],
    title: '5 Indian Startup UI Mistakes to Avoid in 2026',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    duration: 52,
    soundTrack: 'Lo-Fi Sitar Chillhop',
    views: 89200,
    likes: 9140,
    tags: ['UIUX', 'Startups', 'Figma']
  },
  {
    id: 'reel_03',
    author: INITIAL_USERS[2],
    title: 'Venture Capital in Tier-2 Indian Cities',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    duration: 58,
    soundTrack: 'Founders Grind · Ambient Mix',
    views: 65100,
    likes: 5410,
    tags: ['Startups', 'Bharat', 'Investing']
  }
];

export const INITIAL_GIFT_TRANSACTIONS: GiftTransaction[] = [
  {
    id: 'gtx_01',
    senderId: INITIAL_USERS[2].id,
    senderName: 'Vikramaditya Rao',
    receiverId: INITIAL_USERS[1].id,
    receiverName: 'Priya Patel',
    giftName: 'Diamond',
    giftIcon: '💎',
    postId: INITIAL_POSTS[1].id,
    coinAmount: 100,
    creatorEarningPaise: 7000, // ₹70.00 (70%)
    platformCommissionPaise: 3000, // ₹30.00 (30%)
    createdAt: '25m ago'
  },
  {
    id: 'gtx_02',
    senderId: INITIAL_USERS[0].id,
    senderName: 'Aarav Sharma',
    receiverId: INITIAL_USERS[1].id,
    receiverName: 'Priya Patel',
    giftName: 'Crown',
    giftIcon: '👑',
    postId: INITIAL_POSTS[1].id,
    coinAmount: 500,
    creatorEarningPaise: 35000, // ₹350.00 (70%)
    platformCommissionPaise: 15000, // ₹150.00 (30%)
    createdAt: '1h ago'
  },
  {
    id: 'gtx_03',
    senderId: INITIAL_USERS[3].id,
    senderName: 'Ananya Sundaram',
    receiverId: INITIAL_USERS[0].id,
    receiverName: 'Aarav Sharma',
    giftName: 'Rocket',
    giftIcon: '🚀',
    postId: INITIAL_POSTS[0].id,
    coinAmount: 1000,
    creatorEarningPaise: 70000, // ₹700.00 (70%)
    platformCommissionPaise: 30000, // ₹300.00 (30%)
    createdAt: '3h ago'
  }
];

export const INITIAL_CREATOR_EARNINGS: CreatorEarningsState[] = [
  {
    creatorId: INITIAL_USERS[1].id, // Priya
    totalEarnedPaise: 4200000, // ₹42,000.00
    availableBalancePaise: 2850000, // ₹28,500.00
    withdrawnPaise: 1350000, // ₹13,500.00
    upiId: 'priyapatel@okhdfcbank',
    kycVerified: true,
    panNumber: 'ABCDE1234F'
  },
  {
    creatorId: INITIAL_USERS[0].id, // Aarav
    totalEarnedPaise: 1850000, // ₹18,500.00
    availableBalancePaise: 1250000, // ₹12,500.00
    withdrawnPaise: 600000, // ₹6,000.00
    upiId: 'aarav.sharma@okaxis',
    kycVerified: true,
    panNumber: 'FGHIJ5678K'
  }
];

export const INITIAL_WITHDRAWALS: WithdrawalRecord[] = [
  {
    id: 'wdr_01',
    creatorId: INITIAL_USERS[1].id,
    amountPaise: 1000000, // ₹10,000.00
    tdsPaise: 10000, // ₹100.00 (1% TDS Section 194-O)
    netAmountPaise: 990000, // ₹9,900.00
    status: 'completed',
    upiId: 'priyapatel@okhdfcbank',
    razorpayPayoutId: 'pout_RZP9812401',
    createdAt: '2026-10-18 14:20:00'
  },
  {
    id: 'wdr_02',
    creatorId: INITIAL_USERS[0].id,
    amountPaise: 600000, // ₹6,000.00
    tdsPaise: 6000, // ₹60.00 (1% TDS)
    netAmountPaise: 594000, // ₹5,940.00
    status: 'completed',
    upiId: 'aarav.sharma@okaxis',
    razorpayPayoutId: 'pout_RZP7721839',
    createdAt: '2026-10-15 11:05:00'
  }
];

// All 20 tables from user's schema
export const INITIAL_DB_TABLES: DatabaseTable[] = [
  // 1. Users
  {
    name: 'users',
    category: 'Core Social',
    description: 'Registered accounts with DPDP compliance, phone, Indic language, and counts',
    rowCount: 5,
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true },
      { name: 'username', type: 'VARCHAR(30)' },
      { name: 'email', type: 'VARCHAR(255)' },
      { name: 'phone', type: 'VARCHAR(15)' },
      { name: 'full_name', type: 'VARCHAR(100)' },
      { name: 'language', type: 'VARCHAR(5)' },
      { name: 'is_verified', type: 'BOOLEAN' },
      { name: 'follower_count', type: 'INT' },
      { name: 'following_count', type: 'INT' },
      { name: 'post_count', type: 'INT' },
      { name: 'deleted_at', type: 'TIMESTAMP' }
    ],
    rows: [
      { id: INITIAL_USERS[0].id, username: 'aarav_dev', email: 'aarav@bharat.dev', phone: '+919876543210', full_name: 'Aarav Sharma', language: 'hi', is_verified: true, follower_count: 14820, following_count: 340, post_count: 84, deleted_at: null },
      { id: INITIAL_USERS[1].id, username: 'priya_ux', email: 'priya@bharat.design', phone: '+919876543211', full_name: 'Priya Patel', language: 'hi', is_verified: true, follower_count: 28400, following_count: 512, post_count: 142, deleted_at: null },
      { id: INITIAL_USERS[2].id, username: 'vikram_founder', email: 'vikram@bharat.vc', phone: '+919876543212', full_name: 'Vikramaditya Rao', language: 'en', is_verified: true, follower_count: 42100, following_count: 180, post_count: 96, deleted_at: null },
      { id: INITIAL_USERS[3].id, username: 'ananya_chennai', email: 'ananya@bharat.ai', phone: '+919876543213', full_name: 'Ananya Sundaram', language: 'ta', is_verified: true, follower_count: 19350, following_count: 290, post_count: 65, deleted_at: null },
      { id: INITIAL_USERS[4].id, username: 'rahul_sharma', email: 'rahul@example.com', phone: '+919811223344', full_name: 'Rahul Sharma', language: 'hi', is_verified: true, follower_count: 0, following_count: 0, post_count: 0, deleted_at: null }
    ]
  },

  // 2. Follows
  {
    name: 'follows',
    category: 'Core Social',
    description: 'Unidirectional user following relationships with auto-trigger counts',
    rowCount: 4,
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true },
      { name: 'follower_id', type: 'UUID', isForeign: true },
      { name: 'following_id', type: 'UUID', isForeign: true },
      { name: 'created_at', type: 'TIMESTAMP' }
    ],
    rows: [
      { id: 'f001-uuid', follower_id: INITIAL_USERS[0].id, following_id: INITIAL_USERS[1].id, created_at: '2026-02-01 10:00:00' },
      { id: 'f002-uuid', follower_id: INITIAL_USERS[0].id, following_id: INITIAL_USERS[2].id, created_at: '2026-02-05 12:30:00' },
      { id: 'f003-uuid', follower_id: INITIAL_USERS[1].id, following_id: INITIAL_USERS[0].id, created_at: '2026-02-10 14:15:00' },
      { id: 'f004-uuid', follower_id: INITIAL_USERS[2].id, following_id: INITIAL_USERS[0].id, created_at: '2026-02-12 18:45:00' }
    ]
  },

  // 3. Posts
  {
    name: 'posts',
    category: 'Core Social',
    description: 'User feed posts with geolocations, moderation_status, and DPDP soft delete',
    rowCount: 4,
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true },
      { name: 'user_id', type: 'UUID', isForeign: true },
      { name: 'caption', type: 'TEXT' },
      { name: 'media_type', type: 'VARCHAR(20)' },
      { name: 'location_name', type: 'VARCHAR(200)' },
      { name: 'like_count', type: 'INT' },
      { name: 'comment_count', type: 'INT' },
      { name: 'moderation_status', type: 'VARCHAR(20)' },
      { name: 'created_at', type: 'TIMESTAMP' }
    ],
    rows: [
      { id: INITIAL_POSTS[0].id, user_id: INITIAL_USERS[0].id, caption: 'Just migrated our social feed cache to Redis 7 with LRU eviction! Handling 50k QPS...', media_type: 'image', location_name: 'Indiranagar, Bengaluru', like_count: 1243, comment_count: 88, moderation_status: 'approved', created_at: '2026-10-21 11:32:00' },
      { id: INITIAL_POSTS[1].id, user_id: INITIAL_USERS[1].id, caption: 'भारतीय भाषाओं में UI/UX डिज़ाइन करना सिर्फ़ फ़ॉन्ट बदलना नहीं है...', media_type: 'carousel', location_name: 'Bandra West, Mumbai', like_count: 2890, comment_count: 215, moderation_status: 'approved', created_at: '2026-10-21 11:00:00' },
      { id: INITIAL_POSTS[2].id, user_id: INITIAL_USERS[2].id, caption: 'Huge milestone: India recorded 14.9 Billion UPI transactions this month...', media_type: 'image', location_name: 'Connaught Place, New Delhi', like_count: 4510, comment_count: 312, moderation_status: 'approved', created_at: '2026-10-21 09:45:00' },
      { id: INITIAL_POSTS[3].id, user_id: INITIAL_USERS[3].id, caption: 'எங்கள் தமிழ் AI மொழி மாதிரி இப்போது திறந்த மூலமாக கிடைக்கிறது!...', media_type: 'image', location_name: 'IIT Madras Research Park', like_count: 1670, comment_count: 94, moderation_status: 'approved', created_at: '2026-10-21 07:15:00' }
    ]
  },

  // 4. Post Media
  {
    name: 'post_media',
    category: 'Core Social',
    description: 'Carousel items and video files with CloudFront/MinIO CDN URLs and display_order',
    rowCount: 3,
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true },
      { name: 'post_id', type: 'UUID', isForeign: true },
      { name: 'media_url', type: 'TEXT' },
      { name: 'media_type', type: 'VARCHAR(20)' },
      { name: 'file_size_bytes', type: 'BIGINT' },
      { name: 'display_order', type: 'INT' }
    ],
    rows: [
      { id: 'pm-01', post_id: INITIAL_POSTS[0].id, media_url: 's3://bharat-posts-images/arch_diagram_v1.webp', media_type: 'image', file_size_bytes: 248102, display_order: 0 },
      { id: 'pm-02', post_id: INITIAL_POSTS[1].id, media_url: 's3://bharat-posts-images/indic_type_slide1.webp', media_type: 'image', file_size_bytes: 412000, display_order: 0 },
      { id: 'pm-03', post_id: INITIAL_POSTS[1].id, media_url: 's3://bharat-posts-images/indic_type_slide2.webp', media_type: 'image', file_size_bytes: 389000, display_order: 1 }
    ]
  },

  // 5. Hashtags
  {
    name: 'hashtags',
    category: 'Core Social',
    description: 'Indexed trending tags with pg_trgm GIN search index',
    rowCount: 6,
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true },
      { name: 'tag', type: 'VARCHAR(100)' },
      { name: 'post_count', type: 'INT' },
      { name: 'created_at', type: 'TIMESTAMP' }
    ],
    rows: [
      { id: 'ht-01', tag: 'DigitalIndia', post_count: 84210, created_at: '2026-01-01 00:00:00' },
      { id: 'ht-02', tag: 'StartInBharat', post_count: 43190, created_at: '2026-01-01 00:00:00' },
      { id: 'ht-03', tag: 'BengaluruTech', post_count: 28940, created_at: '2026-01-01 00:00:00' },
      { id: 'ht-04', tag: 'UPI', post_count: 51200, created_at: '2026-01-01 00:00:00' },
      { id: 'ht-05', tag: 'DesignBharat', post_count: 14800, created_at: '2026-01-01 00:00:00' },
      { id: 'ht-06', tag: 'TamilAI', post_count: 9800, created_at: '2026-01-01 00:00:00' }
    ]
  },

  // 6. Post Hashtags (Many-to-Many)
  {
    name: 'post_hashtags',
    category: 'Core Social',
    description: 'Many-to-many junction joining posts to hashtags',
    rowCount: 4,
    columns: [
      { name: 'post_id', type: 'UUID', isPrimary: true, isForeign: true },
      { name: 'hashtag_id', type: 'UUID', isPrimary: true, isForeign: true }
    ],
    rows: [
      { post_id: INITIAL_POSTS[0].id, hashtag_id: 'ht-01' },
      { post_id: INITIAL_POSTS[0].id, hashtag_id: 'ht-03' },
      { post_id: INITIAL_POSTS[1].id, hashtag_id: 'ht-05' },
      { post_id: INITIAL_POSTS[2].id, hashtag_id: 'ht-04' }
    ]
  },

  // 7. Likes
  {
    name: 'likes',
    category: 'Engagement & Stories',
    description: 'Unique post likes with trigger auto-incrementing posts.like_count',
    rowCount: 3,
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true },
      { name: 'user_id', type: 'UUID', isForeign: true },
      { name: 'post_id', type: 'UUID', isForeign: true },
      { name: 'created_at', type: 'TIMESTAMP' }
    ],
    rows: [
      { id: 'lk-01', user_id: INITIAL_USERS[0].id, post_id: INITIAL_POSTS[1].id, created_at: '2026-10-21 11:15:00' },
      { id: 'lk-02', user_id: INITIAL_USERS[2].id, post_id: INITIAL_POSTS[1].id, created_at: '2026-10-21 11:20:00' },
      { id: 'lk-03', user_id: INITIAL_USERS[1].id, post_id: INITIAL_POSTS[0].id, created_at: '2026-10-21 11:35:00' }
    ]
  },

  // 8. Comments
  {
    name: 'comments',
    category: 'Engagement & Stories',
    description: 'Threaded replies with parent_id and auto-updating comment_count trigger',
    rowCount: 3,
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true },
      { name: 'post_id', type: 'UUID', isForeign: true },
      { name: 'user_id', type: 'UUID', isForeign: true },
      { name: 'parent_id', type: 'UUID', isForeign: true },
      { name: 'text', type: 'TEXT' },
      { name: 'like_count', type: 'INT' },
      { name: 'created_at', type: 'TIMESTAMP' }
    ],
    rows: [
      { id: 'cm-01', post_id: INITIAL_POSTS[1].id, user_id: INITIAL_USERS[0].id, parent_id: null, text: 'The typography scales look incredible Priya! Great job.', like_count: 14, created_at: '2026-10-21 11:10:00' },
      { id: 'cm-02', post_id: INITIAL_POSTS[1].id, user_id: INITIAL_USERS[1].id, parent_id: 'cm-01', text: 'Thanks Aarav! Next step is open-sourcing the Figma tokens.', like_count: 8, created_at: '2026-10-21 11:14:00' },
      { id: 'cm-03', post_id: INITIAL_POSTS[0].id, user_id: INITIAL_USERS[3].id, parent_id: null, text: 'Are you using BullMQ for the Redis job queue as well?', like_count: 5, created_at: '2026-10-21 11:40:00' }
    ]
  },

  // 9. Saves
  {
    name: 'saves',
    category: 'Engagement & Stories',
    description: 'Bookmarked posts by users',
    rowCount: 2,
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true },
      { name: 'user_id', type: 'UUID', isForeign: true },
      { name: 'post_id', type: 'UUID', isForeign: true },
      { name: 'created_at', type: 'TIMESTAMP' }
    ],
    rows: [
      { id: 'sv-01', user_id: INITIAL_USERS[0].id, post_id: INITIAL_POSTS[1].id, created_at: '2026-10-21 11:12:00' },
      { id: 'sv-02', user_id: INITIAL_USERS[2].id, post_id: INITIAL_POSTS[0].id, created_at: '2026-10-21 11:38:00' }
    ]
  },

  // 10. Stories
  {
    name: 'stories',
    category: 'Engagement & Stories',
    description: 'Ephemeral stories with 24-hour TTL (NOW + 24 hours)',
    rowCount: 3,
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true },
      { name: 'user_id', type: 'UUID', isForeign: true },
      { name: 'media_url', type: 'TEXT' },
      { name: 'media_type', type: 'VARCHAR(20)' },
      { name: 'view_count', type: 'INT' },
      { name: 'expires_at', type: 'TIMESTAMP' },
      { name: 'created_at', type: 'TIMESTAMP' }
    ],
    rows: [
      { id: 'st-01', user_id: INITIAL_USERS[1].id, media_url: 's3://bharat-stories/priya_story_1.webp', media_type: 'image', view_count: 1840, expires_at: '2026-10-22 05:00:00', created_at: '2026-10-21 05:00:00' },
      { id: 'st-02', user_id: INITIAL_USERS[0].id, media_url: 's3://bharat-stories/aarav_story_1.webp', media_type: 'image', view_count: 920, expires_at: '2026-10-22 08:00:00', created_at: '2026-10-21 08:00:00' },
      { id: 'st-03', user_id: INITIAL_USERS[2].id, media_url: 's3://bharat-stories/vikram_story_1.webp', media_type: 'image', view_count: 3100, expires_at: '2026-10-22 01:00:00', created_at: '2026-10-21 01:00:00' }
    ]
  },

  // 11. Story Views
  {
    name: 'story_views',
    category: 'Engagement & Stories',
    description: 'Unique viewers tracking per story',
    rowCount: 2,
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true },
      { name: 'story_id', type: 'UUID', isForeign: true },
      { name: 'viewer_id', type: 'UUID', isForeign: true },
      { name: 'viewed_at', type: 'TIMESTAMP' }
    ],
    rows: [
      { id: 'stv-01', story_id: 'st-01', viewer_id: INITIAL_USERS[0].id, viewed_at: '2026-10-21 06:15:00' },
      { id: 'stv-02', story_id: 'st-01', viewer_id: INITIAL_USERS[2].id, viewed_at: '2026-10-21 07:30:00' }
    ]
  },

  // 12. Conversations & Messages
  {
    name: 'conversations',
    category: 'DMs & Moderation',
    description: 'Direct messaging pairs with user1_id < user2_id order check constraint',
    rowCount: 2,
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true },
      { name: 'user1_id', type: 'UUID', isForeign: true },
      { name: 'user2_id', type: 'UUID', isForeign: true },
      { name: 'last_message_at', type: 'TIMESTAMP' }
    ],
    rows: [
      { id: 'conv-01', user1_id: INITIAL_USERS[0].id, user2_id: INITIAL_USERS[1].id, last_message_at: '2026-10-21 11:25:00' },
      { id: 'conv-02', user1_id: INITIAL_USERS[0].id, user2_id: INITIAL_USERS[2].id, last_message_at: '2026-10-20 18:40:00' }
    ]
  },

  {
    name: 'messages',
    category: 'DMs & Moderation',
    description: 'Encrypted direct messages with text, media and read status',
    rowCount: 3,
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true },
      { name: 'conversation_id', type: 'UUID', isForeign: true },
      { name: 'sender_id', type: 'UUID', isForeign: true },
      { name: 'text', type: 'TEXT' },
      { name: 'is_read', type: 'BOOLEAN' },
      { name: 'created_at', type: 'TIMESTAMP' }
    ],
    rows: [
      { id: 'msg-01', conversation_id: 'conv-01', sender_id: INITIAL_USERS[0].id, text: 'Hey Priya, loved the new Devnagari font styles!', is_read: true, created_at: '2026-10-21 11:20:00' },
      { id: 'msg-02', conversation_id: 'conv-01', sender_id: INITIAL_USERS[1].id, text: 'Thank you Aarav! Are we syncing tomorrow on the API?', is_read: true, created_at: '2026-10-21 11:25:00' },
      { id: 'msg-03', conversation_id: 'conv-02', sender_id: INITIAL_USERS[2].id, text: 'Great progress on Bharat Social architecture.', is_read: true, created_at: '2026-10-20 18:40:00' }
    ]
  },

  // 13. Notifications
  {
    name: 'notifications',
    category: 'DMs & Moderation',
    description: 'In-app and FCM push notification events (like, comment, follow, gift)',
    rowCount: 4,
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true },
      { name: 'user_id', type: 'UUID', isForeign: true },
      { name: 'actor_id', type: 'UUID', isForeign: true },
      { name: 'type', type: 'VARCHAR(30)' },
      { name: 'is_read', type: 'BOOLEAN' },
      { name: 'created_at', type: 'TIMESTAMP' }
    ],
    rows: [
      { id: 'nt-01', user_id: INITIAL_USERS[1].id, actor_id: INITIAL_USERS[0].id, type: 'like', is_read: true, created_at: '2026-10-21 11:15:00' },
      { id: 'nt-02', user_id: INITIAL_USERS[1].id, actor_id: INITIAL_USERS[2].id, type: 'comment', is_read: false, created_at: '2026-10-21 11:20:00' },
      { id: 'nt-03', user_id: INITIAL_USERS[0].id, actor_id: INITIAL_USERS[1].id, type: 'follow', is_read: false, created_at: '2026-10-21 10:45:00' },
      { id: 'nt-04', user_id: INITIAL_USERS[1].id, actor_id: INITIAL_USERS[0].id, type: 'gift', is_read: false, created_at: '2026-10-21 11:45:00' }
    ]
  },

  // 14. Reports (Moderation)
  {
    name: 'reports',
    category: 'DMs & Moderation',
    description: 'Content safety and moderation queue with statuses (pending, reviewed, action_taken)',
    rowCount: 2,
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true },
      { name: 'reporter_id', type: 'UUID', isForeign: true },
      { name: 'reason', type: 'VARCHAR(50)' },
      { name: 'status', type: 'VARCHAR(20)' },
      { name: 'created_at', type: 'TIMESTAMP' }
    ],
    rows: [
      { id: 'rep-01', reporter_id: INITIAL_USERS[3].id, reason: 'Spam / Automated bot activity', status: 'pending', created_at: '2026-10-21 09:10:00' },
      { id: 'rep-02', reporter_id: INITIAL_USERS[0].id, reason: 'Copyright infringement on reel audio', status: 'reviewed', created_at: '2026-10-20 15:40:00' }
    ]
  },

  // 15. Blocks
  {
    name: 'blocks',
    category: 'DMs & Moderation',
    description: 'User blocking relationship to prevent stalking or harassment',
    rowCount: 1,
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true },
      { name: 'blocker_id', type: 'UUID', isForeign: true },
      { name: 'blocked_id', type: 'UUID', isForeign: true },
      { name: 'created_at', type: 'TIMESTAMP' }
    ],
    rows: [
      { id: 'blk-01', blocker_id: INITIAL_USERS[1].id, blocked_id: 'spammer-bot-992', created_at: '2026-10-19 12:00:00' }
    ]
  },

  // 16. Gifts Catalog
  {
    name: 'gifts',
    category: 'Creator Economy & UPI',
    description: 'Virtual gift tokens purchased by fans (Rose, Heart, Diamond, Crown, Rocket)',
    rowCount: 5,
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true },
      { name: 'name', type: 'VARCHAR(100)' },
      { name: 'icon_url', type: 'TEXT' },
      { name: 'coin_price', type: 'INT' },
      { name: 'is_active', type: 'BOOLEAN' }
    ],
    rows: [
      { id: 'gft-01', name: 'Rose', icon_url: '🌹', coin_price: 10, is_active: true },
      { id: 'gft-02', name: 'Heart', icon_url: '❤️', coin_price: 50, is_active: true },
      { id: 'gft-03', name: 'Diamond', icon_url: '💎', coin_price: 100, is_active: true },
      { id: 'gft-04', name: 'Crown', icon_url: '👑', coin_price: 500, is_active: true },
      { id: 'gft-05', name: 'Rocket', icon_url: '🚀', coin_price: 1000, is_active: true }
    ]
  },

  // 17. Gift Transactions (70% Creator / 30% Platform in Paise)
  {
    name: 'gift_transactions',
    category: 'Creator Economy & UPI',
    description: 'Monetization records with 70% creator share & 30% platform cut in paise',
    rowCount: 3,
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true },
      { name: 'sender_id', type: 'UUID', isForeign: true },
      { name: 'receiver_id', type: 'UUID', isForeign: true },
      { name: 'coin_amount', type: 'INT' },
      { name: 'creator_earning_paise', type: 'INT' },
      { name: 'platform_commission_paise', type: 'INT' },
      { name: 'created_at', type: 'TIMESTAMP' }
    ],
    rows: [
      { id: 'gtx_01', sender_id: INITIAL_USERS[2].id, receiver_id: INITIAL_USERS[1].id, coin_amount: 100, creator_earning_paise: 7000, platform_commission_paise: 3000, created_at: '2026-10-21 11:20:00' },
      { id: 'gtx_02', sender_id: INITIAL_USERS[0].id, receiver_id: INITIAL_USERS[1].id, coin_amount: 500, creator_earning_paise: 35000, platform_commission_paise: 15000, created_at: '2026-10-21 10:45:00' },
      { id: 'gtx_03', sender_id: INITIAL_USERS[3].id, receiver_id: INITIAL_USERS[0].id, coin_amount: 1000, creator_earning_paise: 70000, platform_commission_paise: 30000, created_at: '2026-10-21 08:30:00' }
    ]
  },

  // 18. Creator Earnings (Aggregated)
  {
    name: 'creator_earnings',
    category: 'Creator Economy & UPI',
    description: 'Aggregated creator balances in paise with verified UPI ID and PAN number',
    rowCount: 2,
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true },
      { name: 'creator_id', type: 'UUID', isForeign: true },
      { name: 'total_earned_paise', type: 'BIGINT' },
      { name: 'available_balance_paise', type: 'BIGINT' },
      { name: 'withdrawn_paise', type: 'BIGINT' },
      { name: 'upi_id', type: 'VARCHAR(100)' },
      { name: 'kyc_verified', type: 'BOOLEAN' },
      { name: 'pan_number', type: 'VARCHAR(10)' }
    ],
    rows: [
      { id: 'ce-01', creator_id: INITIAL_USERS[1].id, total_earned_paise: 4200000, available_balance_paise: 2850000, withdrawn_paise: 1350000, upi_id: 'priyapatel@okhdfcbank', kyc_verified: true, pan_number: 'ABCDE1234F' },
      { id: 'ce-02', creator_id: INITIAL_USERS[0].id, total_earned_paise: 1850000, available_balance_paise: 1250000, withdrawn_paise: 600000, upi_id: 'aarav.sharma@okaxis', kyc_verified: true, pan_number: 'FGHIJ5678K' }
    ]
  },

  // 19. Withdrawals (Payouts & TDS 194-O)
  {
    name: 'withdrawals',
    category: 'Creator Economy & UPI',
    description: 'UPI bank settlements with 1% TDS deduction under Section 194-O & Razorpay Payout ID',
    rowCount: 2,
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true },
      { name: 'creator_id', type: 'UUID', isForeign: true },
      { name: 'amount_paise', type: 'BIGINT' },
      { name: 'tds_paise', type: 'BIGINT' },
      { name: 'net_amount_paise', type: 'BIGINT' },
      { name: 'status', type: 'VARCHAR(20)' },
      { name: 'upi_id', type: 'VARCHAR(100)' },
      { name: 'razorpay_payout_id', type: 'VARCHAR(100)' },
      { name: 'created_at', type: 'TIMESTAMP' }
    ],
    rows: [
      { id: 'wdr_01', creator_id: INITIAL_USERS[1].id, amount_paise: 1000000, tds_paise: 10000, net_amount_paise: 990000, status: 'completed', upi_id: 'priyapatel@okhdfcbank', razorpay_payout_id: 'pout_RZP9812401', created_at: '2026-10-18 14:20:00' },
      { id: 'wdr_02', creator_id: INITIAL_USERS[0].id, amount_paise: 600000, tds_paise: 6000, net_amount_paise: 594000, status: 'completed', upi_id: 'aarav.sharma@okaxis', razorpay_payout_id: 'pout_RZP7721839', created_at: '2026-10-15 11:05:00' }
    ]
  }
];

export const INITIAL_REDIS_KEYS: RedisKeyItem[] = [
  {
    key: 'feed:global:trending',
    type: 'zset',
    ttl: 300,
    value: '["post_f4ee": 4510, "post_e5ff": 2890, "post_c7ff": 1670, "post_d6ee": 1243]',
    sizeBytes: 420,
    updatedAt: '2s ago'
  },
  {
    key: 'feed:user:a0ee:timeline',
    type: 'zset',
    ttl: 600,
    value: '["post_f4ee": 1734891120, "post_e5ff": 1734889200, "post_d6ee": 1734884700]',
    sizeBytes: 310,
    updatedAt: '12s ago'
  },
  {
    key: 'trending:hashtags',
    type: 'zset',
    ttl: 120,
    value: '["#DigitalIndia": 99.4, "#StartInBharat": 94.2, "#BengaluruTech": 88.5, "#UPI": 87.1]',
    sizeBytes: 290,
    updatedAt: '8s ago'
  },
  {
    key: 'session:bharat_usr_a0ee',
    type: 'hash',
    ttl: 86400,
    value: '{"userId":"a0ee","roles":["developer","verified"],"lang":"hi","region":"KA"}',
    sizeBytes: 180,
    updatedAt: '1m ago'
  },
  {
    key: 'rate_limit:ip:103.21.244.2',
    type: 'string',
    ttl: 48,
    value: '14',
    sizeBytes: 24,
    updatedAt: '4s ago'
  },
  {
    key: 'queue:payout_disbursement:jobs',
    type: 'list',
    ttl: -1,
    value: '["job_9912:payout_priya_razorpay_upi","job_9913:gift_split_70_30"]',
    sizeBytes: 198,
    updatedAt: '10s ago'
  }
];

export const INITIAL_MINIO_OBJECTS: MinioObjectItem[] = [
  {
    name: 'bharat-posts-images/arch_diagram_v1.webp',
    bucket: 'bharat-posts-images',
    size: 248102,
    mimeType: 'image/webp',
    url: 'http://localhost:9000/bharat-posts-images/arch_diagram_v1.webp',
    lastModified: '2026-10-21 11:32:00'
  },
  {
    name: 'bharat-posts-images/indic_type_slide1.webp',
    bucket: 'bharat-posts-images',
    size: 412000,
    mimeType: 'image/webp',
    url: 'http://localhost:9000/bharat-posts-images/indic_type_slide1.webp',
    lastModified: '2026-10-21 11:00:00'
  },
  {
    name: 'bharat-reels-video/reel_01_720p.mp4',
    bucket: 'bharat-reels-video',
    size: 4819000,
    mimeType: 'video/mp4',
    url: 'http://localhost:9000/bharat-reels-video/reel_01_720p.mp4',
    lastModified: '2026-10-20 18:00:00'
  },
  {
    name: 'bharat-avatars/aarav_avatar.jpg',
    bucket: 'bharat-avatars',
    size: 64200,
    mimeType: 'image/jpeg',
    url: 'http://localhost:9000/bharat-avatars/aarav_avatar.jpg',
    lastModified: '2026-10-10 10:20:00'
  },
  {
    name: 'bharat-avatars/priya_avatar.jpg',
    bucket: 'bharat-avatars',
    size: 71400,
    mimeType: 'image/jpeg',
    url: 'http://localhost:9000/bharat-avatars/priya_avatar.jpg',
    lastModified: '2026-10-12 14:15:00'
  }
];

export const INITIAL_API_ENDPOINTS: ApiEndpoint[] = [
  {
    method: 'POST',
    path: '/api/v1/auth/register',
    tag: 'Auth & Onboarding',
    summary: 'Register new user account in PostgreSQL 14+ users table and create Redis session',
    requestBody: JSON.stringify({
      username: 'rahul_sharma',
      email: 'rahul@example.com',
      password: 'SecurePass123!',
      full_name: 'Rahul Sharma'
    }, null, 2),
    mockResponse: {
      statusCode: 201,
      message: 'User registered successfully in PostgreSQL 14+ users table and session initiated in Redis',
      user: {
        id: 'e4aab776-8f2c-4ef1-992a-4bb6bd280c55',
        username: 'rahul_sharma',
        email: 'rahul@example.com',
        full_name: 'Rahul Sharma',
        language: 'hi',
        follower_count: 0,
        following_count: 0,
        post_count: 0,
        is_verified: true,
        created_at: '2026-10-21T12:07:53.000Z'
      },
      tokens: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlNGFhYjc3Ni04ZjJjLTRlZjEtOTkyYS00YmI2YmQyODBjNTUiLCJ1c2VybmFtZSI6InJhaHVsX3NoYXJtYSIsImlhdCI6MTczNDg5NDg3M30.7w8q-98124',
        tokenType: 'Bearer',
        expiresIn: '7d'
      }
    }
  },
  {
    method: 'GET',
    path: '/api/v1/health',
    tag: 'System',
    summary: 'Healthcheck across Postgres (5432), Redis (6379), and MinIO (9000)',
    mockResponse: {
      status: 'ok',
      timestamp: '2026-10-21T12:00:00.000Z',
      services: {
        postgres: { status: 'healthy', database: 'bharat_social', latency: '1.9ms', version: 'PostgreSQL 15.8' },
        redis: { status: 'healthy', used_memory: '28.4MB', max_memory: '512MB', latency: '0.3ms' },
        minio: { status: 'healthy', endpoint: 'http://minio:9000', buckets: 4 }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/v1/posts/feed',
    tag: 'Feed',
    summary: 'Retrieve paginated user feed with DPDP compliance & Redis caching layer',
    mockResponse: {
      data: INITIAL_POSTS,
      pagination: { cursor: 'post_c7ff', hasMore: true, limit: 10 },
      source: 'redis_cache_hit'
    }
  },
  {
    method: 'POST',
    path: '/api/v1/gifts/send',
    tag: 'Creator Monetization',
    summary: 'Send virtual gift to creator with automated 70% paise split & 30% platform commission',
    requestBody: JSON.stringify({
      giftId: 'gift_04',
      postId: INITIAL_POSTS[1].id,
      receiverId: INITIAL_USERS[1].id,
      coinAmount: 500
    }, null, 2),
    mockResponse: {
      success: true,
      transactionId: 'gtx_90218',
      gift: 'Crown 👑',
      creatorPaiseEarned: 35000,
      creatorRupees: '₹350.00',
      platformCommissionPaise: 15000,
      platformRupees: '₹150.00'
    }
  },
  {
    method: 'POST',
    path: '/api/v1/creators/withdraw',
    tag: 'UPI Payouts',
    summary: 'Trigger instant UPI payout via Razorpay with 1% Section 194-O TDS deduction',
    requestBody: JSON.stringify({
      creatorId: INITIAL_USERS[1].id,
      amountPaise: 1000000,
      upiId: 'priyapatel@okhdfcbank'
    }, null, 2),
    mockResponse: {
      success: true,
      withdrawalId: 'wdr_rzp_9901',
      grossAmountRupees: '₹10,000.00',
      tdsRupees: '₹100.00 (1% TDS Section 194-O)',
      netDisbursedRupees: '₹9,900.00',
      payoutMethod: 'UPI Instant Payout',
      razorpayPayoutId: 'pout_RZP9812401',
      status: 'completed'
    }
  },
  {
    method: 'GET',
    path: '/api/v1/trends/india',
    tag: 'Trends',
    summary: 'Fetch real-time trending hashtags from Redis ZSET',
    mockResponse: {
      region: 'IN',
      updatedAt: '2026-10-21T12:00:00Z',
      trends: [
        { tag: '#DigitalIndia', count: 84210, score: 99.4 },
        { tag: '#StartInBharat', count: 43190, score: 94.2 },
        { tag: '#BengaluruTech', count: 28940, score: 88.5 },
        { tag: '#UPI', count: 51200, score: 87.1 }
      ]
    }
  }
];

// The exact full 20-part schema provided by the user
export const INIT_SQL_TEMPLATE = `-- ============================================
-- BHARAT SOCIAL MEDIA - DATABASE SCHEMA
-- PostgreSQL 14+
-- ============================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For search

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    bio TEXT,
    profile_pic_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_private BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    follower_count INT DEFAULT 0,
    following_count INT DEFAULT 0,
    post_count INT DEFAULT 0,
    fcm_token TEXT, -- For push notifications
    language VARCHAR(5) DEFAULT 'hi',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login_at TIMESTAMP,
    deleted_at TIMESTAMP -- Soft delete for DPDP compliance
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

-- ============================================
-- 2. FOLLOWS TABLE (Unidirectional)
-- ============================================
CREATE TABLE IF NOT EXISTS follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(follower_id, following_id),
    CHECK(follower_id != following_id)
);

CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id);

-- ============================================
-- 3. POSTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    caption TEXT,
    media_type VARCHAR(20) NOT NULL CHECK(media_type IN ('image', 'video', 'carousel')),
    location_name VARCHAR(200),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    save_count INT DEFAULT 0,
    share_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    is_flagged BOOLEAN DEFAULT FALSE,
    moderation_status VARCHAR(20) DEFAULT 'pending' 
        CHECK(moderation_status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_posts_user ON posts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC) WHERE deleted_at IS NULL;

-- ============================================
-- 4. POST MEDIA TABLE (For carousel support)
-- ============================================
CREATE TABLE IF NOT EXISTS post_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,      -- CloudFront CDN URL
    thumbnail_url TEXT,           -- Small thumbnail
    media_type VARCHAR(20) NOT NULL CHECK(media_type IN ('image', 'video')),
    width INT,
    height INT,
    duration_seconds INT,          -- For videos
    file_size_bytes BIGINT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_post_media_post ON post_media(post_id, display_order);

-- ============================================
-- 5. HASHTAGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS hashtags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tag VARCHAR(100) UNIQUE NOT NULL,
    post_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hashtags_tag ON hashtags USING gin(tag gin_trgm_ops);

-- ============================================
-- 6. POST HASHTAGS (Many-to-Many)
-- ============================================
CREATE TABLE IF NOT EXISTS post_hashtags (
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    hashtag_id UUID NOT NULL REFERENCES hashtags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, hashtag_id)
);

-- ============================================
-- 7. LIKES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, post_id)
);

CREATE INDEX IF NOT EXISTS idx_likes_post ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_user ON likes(user_id);

-- ============================================
-- 8. COMMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- For replies
    text TEXT NOT NULL,
    like_count INT DEFAULT 0,
    is_flagged BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);

-- ============================================
-- 9. SAVES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS saves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, post_id)
);

-- ============================================
-- 10. STORIES TABLE (24hr TTL)
-- ============================================
CREATE TABLE IF NOT EXISTS stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    media_type VARCHAR(20) NOT NULL CHECK(media_type IN ('image', 'video')),
    thumbnail_url TEXT,
    duration_seconds INT DEFAULT 5,
    view_count INT DEFAULT 0,
    expires_at TIMESTAMP NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stories_user_expires ON stories(user_id, expires_at);
CREATE INDEX IF NOT EXISTS idx_stories_expires ON stories(expires_at);

-- ============================================
-- 11. STORY VIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS story_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    viewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(story_id, viewer_id)
);

-- ============================================
-- 12. MESSAGES TABLE (DM)
-- ============================================
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user2_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    last_message_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user1_id, user2_id),
    CHECK(user1_id < user2_id) -- Ensure consistent ordering
);

CREATE INDEX IF NOT EXISTS idx_conversations_user1 ON conversations(user1_id, last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_user2 ON conversations(user2_id, last_message_at DESC);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text TEXT,
    media_url TEXT,
    media_type VARCHAR(20),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at DESC);

-- ============================================
-- 13. NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL CHECK(type IN 
        ('like', 'comment', 'follow', 'mention', 'dm', 'story_view')),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, created_at DESC);

-- ============================================
-- 14. REPORTS TABLE (Moderation)
-- ============================================
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    reported_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reason VARCHAR(50) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' 
        CHECK(status IN ('pending', 'reviewed', 'action_taken', 'dismissed')),
    action_taken VARCHAR(50),
    reviewed_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    reviewed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status, created_at);

-- ============================================
-- 15. BLOCKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blocker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    blocked_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(blocker_id, blocked_id),
    CHECK(blocker_id != blocked_id)
);

-- ============================================
-- 16. VIRTUAL GIFTS CATALOG
-- ============================================
CREATE TABLE IF NOT EXISTS gifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    icon_url TEXT NOT NULL,
    coin_price INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Seed gift data
INSERT INTO gifts (name, icon_url, coin_price) VALUES
('Rose', '🌹', 10),
('Heart', '❤️', 50),
('Diamond', '💎', 100),
('Crown', '👑', 500),
('Rocket', '🚀', 1000)
ON CONFLICT DO NOTHING;

-- ============================================
-- 17. GIFT TRANSACTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS gift_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    gift_id UUID NOT NULL REFERENCES gifts(id),
    post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
    coin_amount INT NOT NULL,
    creator_earning_paise INT NOT NULL, -- 70% of coin value in paise
    platform_commission_paise INT NOT NULL, -- 30%
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gift_tx_receiver ON gift_transactions(receiver_id, created_at DESC);

-- ============================================
-- 18. CREATOR EARNINGS (Aggregated)
-- ============================================
CREATE TABLE IF NOT EXISTS creator_earnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    total_earned_paise BIGINT DEFAULT 0,
    available_balance_paise BIGINT DEFAULT 0,
    withdrawn_paise BIGINT DEFAULT 0,
    upi_id VARCHAR(100),
    kyc_verified BOOLEAN DEFAULT FALSE,
    pan_number VARCHAR(10),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 19. WITHDRAWALS (Payouts)
-- ============================================
CREATE TABLE IF NOT EXISTS withdrawals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount_paise BIGINT NOT NULL,
    tds_paise BIGINT DEFAULT 0, -- 1% TDS under Section 194-O
    net_amount_paise BIGINT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' 
        CHECK(status IN ('pending', 'processing', 'completed', 'failed')),
    upi_id VARCHAR(100) NOT NULL,
    razorpay_payout_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

-- ============================================
-- 20. TRIGGER: Auto-update counts
-- ============================================

-- Like count trigger
CREATE OR REPLACE FUNCTION update_like_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts SET like_count = like_count + 1 WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts SET like_count = like_count - 1 WHERE id = OLD.post_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_like_count ON likes;
CREATE TRIGGER trg_like_count
AFTER INSERT OR DELETE ON likes
FOR EACH ROW EXECUTE FUNCTION update_like_count();

-- Follow count trigger
CREATE OR REPLACE FUNCTION update_follow_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE users SET follower_count = follower_count + 1 WHERE id = NEW.following_id;
        UPDATE users SET following_count = following_count + 1 WHERE id = NEW.follower_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE users SET follower_count = follower_count - 1 WHERE id = OLD.following_id;
        UPDATE users SET following_count = following_count - 1 WHERE id = OLD.follower_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_follow_count ON follows;
CREATE TRIGGER trg_follow_count
AFTER INSERT OR DELETE ON follows
FOR EACH ROW EXECUTE FUNCTION update_follow_count();

-- Comment count trigger
CREATE OR REPLACE FUNCTION update_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts SET comment_count = comment_count - 1 WHERE id = OLD.post_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_comment_count ON comments;
CREATE TRIGGER trg_comment_count
AFTER INSERT OR DELETE ON comments
FOR EACH ROW EXECUTE FUNCTION update_comment_count();

-- Post count trigger
CREATE OR REPLACE FUNCTION update_post_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE users SET post_count = post_count + 1 WHERE id = NEW.user_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE users SET post_count = post_count - 1 WHERE id = OLD.user_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_post_count ON posts;
CREATE TRIGGER trg_post_count
AFTER INSERT OR DELETE ON posts
FOR EACH ROW EXECUTE FUNCTION update_post_count();
`;

export const DOCKER_COMPOSE_RAW = `version: '3.9'

services:
  # PostgreSQL 14+ Database
  postgres:
    image: postgres:15-alpine
    container_name: bharat_postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: bharat
      POSTGRES_PASSWORD: bharat_pass_2026
      POSTGRES_DB: bharat_social
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U bharat"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis (Cache + Queue)
  redis:
    image: redis:7-alpine
    container_name: bharat_redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes --maxmemory 512mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  # MinIO (Local S3 for development)
  minio:
    image: minio/minio:latest
    container_name: bharat_minio
    restart: unless-stopped
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin123
    ports:
      - "9000:9000"   # API
      - "9001:9001"   # Console
    volumes:
      - minio_data:/data
    command: server /data --console-address ":9001"

  # Backend (NestJS)
  backend:
    build: ./backend
    container_name: bharat_backend
    restart: unless-stopped
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      minio:
        condition: service_started
    environment:
      DATABASE_URL: postgresql://bharat:bharat_pass_2026@postgres:5432/bharat_social
      REDIS_URL: redis://redis:6379
      MINIO_ENDPOINT: minio
      MINIO_PORT: 9000
      MINIO_ACCESS_KEY: minioadmin
      MINIO_SECRET_KEY: minioadmin123
      JWT_SECRET: bharat_social_jwt_super_secret_key_2026
      PORT: 3000

volumes:
  postgres_data:
  redis_data:
  minio_data:
`;

export const ENV_TEMPLATE = `# =========================================================
# Bharat Social Media — Environment Configuration (.env)
# =========================================================

NODE_ENV=development
PORT=3000

# 1. PostgreSQL 14+ Connection
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=bharat
POSTGRES_PASSWORD=bharat_pass_2026
POSTGRES_DB=bharat_social
DATABASE_URL=postgresql://bharat:bharat_pass_2026@localhost:5432/bharat_social

# 2. Redis 7 (Cache & BullMQ Queue)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_URL=redis://localhost:6379
REDIS_MAX_MEMORY=512mb

# 3. MinIO S3 Object Storage
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_BUCKET_POSTS=bharat-posts-images
MINIO_BUCKET_REELS=bharat-reels-video
MINIO_BUCKET_AVATARS=bharat-avatars

# 4. Creator Monetization & UPI Payouts
RAZORPAY_KEY_ID=rzp_live_bharat_monetize_key
RAZORPAY_KEY_SECRET=rzp_live_secret_token
TDS_SECTION_194O_RATE=0.01

# 5. Security & JWT
JWT_SECRET=bharat_social_super_secure_key_2026
JWT_EXPIRATION=7d
`;
