export type LanguageCode = 'hi' | 'en' | 'gu' | 'mr' | 'ta' | 'bn';

export type MainTab = 'home' | 'reels' | 'create' | 'search' | 'notifications' | 'profile' | 'admin';

export interface User {
  id: string;
  username: string;
  fullName: string;
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
}

export interface PostComment {
  id: string;
  author: User;
  text: string;
  createdAt: string;
  likesCount: number;
}

export interface Post {
  id: string;
  author: User;
  caption: string;
  imageUrl: string;
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
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  actor: User;
  postPreview?: string;
  timeAgo: string;
  isRead: boolean;
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
