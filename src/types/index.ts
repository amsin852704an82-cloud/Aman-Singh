export type ActiveTab = 'app' | 'postgres' | 'redis' | 'minio' | 'nestjs' | 'compose';

export interface User {
  id: string;
  username: string;
  fullName: string;
  handle: string;
  avatar: string;
  bio: string;
  location: string;
  verified: boolean;
  role: 'Developer' | 'Creator' | 'Founder' | 'Community';
  followersCount: number;
  followingCount?: number;
  postCount?: number;
  phone?: string;
  email?: string;
  language?: string;
  isPrivate?: boolean;
}

export interface PostMediaItem {
  id: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  mediaType: 'image' | 'video';
  displayOrder: number;
}

export interface Post {
  id: string;
  userId: string;
  author: User;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'carousel';
  mediaItems?: PostMediaItem[];
  tags: string[];
  language: 'English' | 'Hindi' | 'Tamil' | 'Telugu' | 'Bengali';
  likesCount: number;
  commentCount: number;
  saveCount?: number;
  shareCount?: number;
  viewCount?: number;
  hasLiked?: boolean;
  hasSaved?: boolean;
  moderationStatus?: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  region: string;
  locationName?: string;
}

export interface Reel {
  id: string;
  author: User;
  title: string;
  videoUrl: string;
  duration: number; // in seconds
  soundTrack: string;
  views: number;
  likes: number;
  tags: string[];
}

export interface Story {
  id: string;
  userId: string;
  author: User;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  durationSeconds: number;
  viewCount: number;
  expiresAt: string;
  createdAt: string;
}

export interface VirtualGift {
  id: string;
  name: string;
  icon: string;
  coinPrice: number;
}

export interface GiftTransaction {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  giftName: string;
  giftIcon: string;
  postId?: string;
  coinAmount: number;
  creatorEarningPaise: number; // 70% in paise
  platformCommissionPaise: number; // 30% in paise
  createdAt: string;
}

export interface CreatorEarningsState {
  creatorId: string;
  totalEarnedPaise: number;
  availableBalancePaise: number;
  withdrawnPaise: number;
  upiId: string;
  kycVerified: boolean;
  panNumber: string;
}

export interface WithdrawalRecord {
  id: string;
  creatorId: string;
  amountPaise: number;
  tdsPaise: number; // 1% Section 194-O
  netAmountPaise: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  upiId: string;
  razorpayPayoutId: string;
  createdAt: string;
}

export interface DatabaseRow {
  [key: string]: string | number | boolean | null;
}

export interface DatabaseTable {
  name: string;
  category: 'Core Social' | 'Engagement & Stories' | 'DMs & Moderation' | 'Creator Economy & UPI';
  description: string;
  rowCount: number;
  columns: { name: string; type: string; isPrimary?: boolean; isForeign?: boolean }[];
  rows: DatabaseRow[];
}

export interface RedisKeyItem {
  key: string;
  type: 'string' | 'hash' | 'zset' | 'list';
  ttl: number; // -1 for persistent
  value: string;
  sizeBytes: number;
  updatedAt: string;
}

export interface MinioObjectItem {
  name: string;
  bucket: string;
  size: number; // bytes
  mimeType: string;
  url: string;
  lastModified: string;
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  tag: string;
  summary: string;
  requestBody?: string;
  mockResponse: Record<string, unknown>;
}
