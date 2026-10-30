export type LanguageCode = 'hi' | 'en' | 'gu' | 'mr' | 'ta' | 'bn';

export type MainTab = 
  | 'landing' 
  | 'home' 
  | 'hunar' 
  | 'reels' 
  | 'create' 
  | 'search' 
  | 'notifications' 
  | 'profile' 
  | 'admin'
  | 'groups'
  | 'events'
  | 'marketplace'
  | 'creator'
  | 'app'
  | 'v2'
  | 'v2.1'
  | 'optimized';

export interface User {
  id: string;
  uid?: string;
  username: string;
  name?: string;
  fullName: string;
  email?: string;
  photoURL?: string;
  handle: string;
  avatar: string;
  bio: string;
  location: string;
  verified: boolean;
  followersCount: number;
  followingCount: number;
  postCount: number;
  isFollowing?: boolean;
  language: LanguageCode;
  createdAt?: string;
  updatedAt?: string;
}

export interface PostComment {
  id: string;
  postId?: string;
  authorUid?: string;
  authorName?: string;
  authorAvatar?: string;
  authorHandle?: string;
  author: User;
  text: string;
  createdAt: string;
  likesCount?: number;
}

export interface Post {
  id: string;
  postId?: string;
  authorUid?: string;
  authorId?: string;
  authorName?: string;
  authorPhotoURL?: string;
  text?: string;
  imageURL?: string;
  likeCount?: number;
  author: User;
  caption: string;
  imageUrl?: string;
  mediaUrl?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  locationName: string;
  createdAt: string;
  language: string;
  tags: string[];
  comments: PostComment[];
  likedUserIds?: string[];
  likedBy?: string[];
  audioURL?: string;
  audioDuration?: number | string;
  mediaType?: 'image' | 'audio' | 'text' | 'video';
  videoUrl?: string;
  posterUrl?: string;
  audioTitle?: string;
  isAnonymous?: boolean;
}

export interface Story {
  id: string;
  author: User;
  imageUrl: string;
  title?: string;
  viewCount: number;
  createdAt: string;
  hasSeen?: boolean;
}

export interface Reel {
  id: string;
  author: User;
  videoUrl: string;
  posterUrl: string;
  caption: string;
  audioTitle: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  tags: string[];
}

export interface AppNotification {
  notificationId: string;
  recipientUid: string;
  senderUid: string;
  senderName: string;
  senderPhotoURL: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  postId?: string;
  message: string;
  createdAt: string;
  isRead: boolean;

  // Compatibility fields for legacy UI and helpers
  id?: string;
  actor?: User;
  postPreview?: string;
  timeAgo?: string;
}

export interface ReportTicket {
  id: string;
  reportedPostId?: string;
  reportedPostCaption?: string;
  reportedPostImage?: string;
  reportedUser: User;
  reporterUser: User;
  reason: string;
  details?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderUid: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  createdAt: string;
  mediaUrl?: string;
  audioUrl?: string;
  audioDuration?: string;
}

export interface ChatParticipant {
  uid: string;
  name: string;
  avatar: string;
  handle: string;
}

export interface ChatConversation {
  chatId: string;
  participants: string[];
  participantProfiles?: { [uid: string]: ChatParticipant };
  lastMessage?: string;
  lastMessageTimestamp?: string;
  lastSenderUid?: string;
  updatedAt: string;
}

export type HunarCategory = 'all' | 'cooking' | 'coding' | 'guitar' | 'painting' | 'yoga' | 'photography' | 'language' | 'crafts';
export type HunarLevel = 'beginner' | 'intermediate' | 'pro';
export type HunarOfferType = 'teach' | 'learn';

export interface HunarPost {
  id: string;
  authorUid: string;
  authorName: string;
  authorPhotoURL: string;
  authorHandle: string;
  author?: User;
  title: string;
  description: string;
  category: HunarCategory;
  level: HunarLevel;
  offerType: HunarOfferType;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  learnersCount: number;
  learnerUids?: string[];
  location: string;
  createdAt: string;
}

export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  category: 'tech' | 'culture' | 'food' | 'business' | 'sports' | 'regional' | 'arts';
  memberCount: number;
  isPrivate: boolean;
  avatar: string;
  coverImage: string;
  tags: string[];
  isJoined?: boolean;
  recentActivity: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  isOnline: boolean;
  category: 'festival' | 'tech' | 'music' | 'startup' | 'literature';
  bannerUrl: string;
  attendeesCount: number;
  isRsvpd?: boolean;
  organizer: string;
}

export interface MarketplaceProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: 'handloom' | 'tea_spices' | 'handicrafts' | 'footwear' | 'art';
  location: string;
  sellerName: string;
  sellerHandle: string;
  sellerAvatar: string;
  images: string[];
  verifiedSeller: boolean;
  whatsappNumber: string;
  inStock: boolean;
}

export interface CreatorStats {
  impressions: number;
  reach: number;
  profileViews: number;
  followerGrowthPercent: number;
  engagementRate: number;
  estimatedEarningsINR: number;
  bestTimeToPost: string;
}

export interface PromoteCampaign {
  id: string;
  postId?: string;
  postTitle: string;
  postText?: string;
  postImageUrl?: string;
  postAuthorName: string;
  postAuthorAvatar: string;
  postAuthorHandle: string;
  objective: 'post' | 'profile' | 'series';
  goal: 'engagement' | 'profile_visits';
  audienceType: 'auto' | 'custom';
  language: string;
  selectedTags: string[];
  dailyBudget: number; // in ₹
  durationDays: number; // 3, 5, 7
  totalBudget: number;
  gstAmount: number;
  grandTotal: number;
  abTestEnabled: boolean;
  abTestHeadline?: string;
  abTestImageUrl?: string;
  ctaText: string;
  status: 'running' | 'paused' | 'completed';
  daysLeft: number;
  createdAt: string;

  // Real-time Key Metrics
  totalReach: number; // e.g. 840
  targetReach: number; // e.g. 900
  savesCount: number; // e.g. 42
  likesCount: number; // e.g. 110
  newFollowersCount: number; // e.g. 18
  costPerResult: number; // e.g. 1.20
  smartPauseEnabled: boolean; // Auto-Protect Budget toggle
}
