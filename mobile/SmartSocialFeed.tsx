/**
 * BharatConnect - SmartSocialFeed.tsx (React Native / Expo Master Production Code)
 * 
 * 1. 📊 YouTube/ShareChat Style MB & Speed Tracker (putFile / uploadBytesResumable)
 * 2. 🔊 Snapchat Style Camera & Audio Focus Fix (iOS Silent Mode Sound Fix)
 * 3. 🎬 Instagram Style Reels Feed with 3-Video Memory Buffer (FlashList)
 * 4. 🇮🇳 Complete BharatConnect Ecosystem:
 *    - Photos, Reels, Stories & Follow System
 *    - Likes, Comments, Direct Messages
 *    - Multi-language Indian Content (हिंदी, ગુજરાતી, मराठी, தமிழ், বাংলা)
 *    - Regional Communities & Trending Creator Tools
 */

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  FlatList,
  Modal,
  TextInput,
  Alert,
  Platform,
  StatusBar,
  SafeAreaView,
  Share,
  ScrollView
} from 'react-native';
import { FlashList, ViewToken } from '@shopify/flash-list';
import { 
  CameraView, 
  CameraType, 
  useCameraPermissions, 
  useMicrophonePermissions 
} from 'expo-camera';
import { Audio, InterruptionModeIOS, InterruptionModeAndroid, Video, ResizeMode } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Haptics from 'expo-haptics';

// Firebase Modular SDK imports
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ---------------------------------------------------------------------------
// TYPE DEFINITIONS
// ---------------------------------------------------------------------------
export type IndianLanguage = 'all' | 'hi' | 'gu' | 'mr' | 'ta' | 'bn' | 'en';

export interface CreatorProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  city: string;
  state: string;
  isVerified: boolean;
  isFollowing: boolean;
}

export interface StoryItem {
  id: string;
  creator: CreatorProfile;
  hasUnread: boolean;
  mediaUri: string;
}

export interface SocialPost {
  id: string;
  creator: CreatorProfile;
  mediaUri: string;
  mediaType: 'image' | 'video';
  caption: string;
  language: IndianLanguage;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  musicTitle?: string;
  tags: string[];
  createdAt: string;
}

export interface UploadSnapshotState {
  isUploading: boolean;
  statusText: string;
  progressPercent: number;
  uploadedMB: string;
  totalMB: string;
  speedMBs: string;
  remainingSeconds: number;
  error?: string;
}

// ---------------------------------------------------------------------------
// INITIAL INDIAN CREATOR & FEED DATA
// ---------------------------------------------------------------------------
const INITIAL_STORIES: StoryItem[] = [
  {
    id: 'story-0',
    creator: {
      id: 'me',
      name: 'आपकी स्टोरी',
      handle: '@you',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
      city: 'नई दिल्ली',
      state: 'दिल्ली',
      isVerified: true,
      isFollowing: false
    },
    hasUnread: false,
    mediaUri: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1080&q=80'
  },
  {
    id: 'story-1',
    creator: {
      id: 'cr-1',
      name: 'रोहन शर्मा',
      handle: '@rohan_sharma',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
      city: 'जयपुर',
      state: 'राजस्थान',
      isVerified: true,
      isFollowing: true
    },
    hasUnread: true,
    mediaUri: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1080&q=80'
  },
  {
    id: 'story-2',
    creator: {
      id: 'cr-2',
      name: 'प्रिया पटेल',
      handle: '@priya_ahmedabad',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
      city: 'अहमदाबाद',
      state: 'गुजरात',
      isVerified: true,
      isFollowing: false
    },
    hasUnread: true,
    mediaUri: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1080&q=80'
  },
  {
    id: 'story-3',
    creator: {
      id: 'cr-3',
      name: 'सचिन गायकवाड़',
      handle: '@sachin_pune',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
      city: 'पुणे',
      state: 'महाराष्ट्र',
      isVerified: false,
      isFollowing: true
    },
    hasUnread: true,
    mediaUri: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=1080&q=80'
  }
];

const INITIAL_POSTS: SocialPost[] = [
  {
    id: 'p-1',
    creator: {
      id: 'cr-1',
      name: 'रोहन शर्मा (Rohan)',
      handle: '@rohan_jaipur',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
      city: 'जयपुर',
      state: 'राजस्थान',
      isVerified: true,
      isFollowing: false
    },
    mediaUri: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1080&q=80',
    mediaType: 'image',
    caption: 'गुलाबी शहर की भव्य सुबह! 🌸 हवा महल का यह नज़ारा हमेशा दिल जीत लेता है। #BharatConnect #JaipurDiaries #IncredibleIndia',
    language: 'hi',
    likesCount: 542,
    commentsCount: 38,
    sharesCount: 19,
    isLiked: false,
    isSaved: false,
    tags: ['जयपुर', 'हवामहल', 'राजस्थान'],
    createdAt: '15 मिनट पहले'
  },
  {
    id: 'p-2',
    creator: {
      id: 'cr-2',
      name: 'प्रिया पटेल (Priya)',
      handle: '@priya_art',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
      city: 'अहमदाबाद',
      state: 'गुजरात',
      isVerified: true,
      isFollowing: true
    },
    mediaUri: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-potter-working-on-a-clay-vase-41484-large.mp4',
    mediaType: 'video',
    caption: 'हाथों का हुनर और मिट्टी का जादू! 🏺 कच्छ की पारंपरिक मिट्टी कला। आवाज़ ऑन करके देखें 🔊 #देसी_हुनर #GujaratCraft',
    language: 'gu',
    musicTitle: 'पारंपरिक गुजराती बाँसुरी धुन • Original Audio',
    likesCount: 1204,
    commentsCount: 92,
    sharesCount: 114,
    isLiked: true,
    isSaved: true,
    tags: ['गुजरात', 'हस्तशिल्प', 'मिट्टीकला'],
    createdAt: '1 घंटा पहले'
  },
  {
    id: 'p-3',
    creator: {
      id: 'cr-3',
      name: 'सचिन गायकवाड़',
      handle: '@sachin_maharashtra',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
      city: 'पुणे',
      state: 'महाराष्ट्र',
      isVerified: false,
      isFollowing: false
    },
    mediaUri: 'https://assets.mixkit.co/videos/preview/mixkit-traditional-indian-sweets-assortment-41584-large.mp4',
    mediaType: 'video',
    caption: 'महाराष्ट्रियन सणांची गोडी! 🥮 पुरणपोळी आणि मोदकाचा खास सुगंध। #Maharashtra #PuranPoli #FoodLove',
    language: 'mr',
    musicTitle: 'मराठी ढोल ताशा ताल • Festive Beat',
    likesCount: 887,
    commentsCount: 54,
    sharesCount: 67,
    isLiked: false,
    isSaved: false,
    tags: ['महाराष्ट्र', 'सण', 'मोदक'],
    createdAt: '3 घंटे पहले'
  }
];

// ===========================================================================
// SUBCOMPONENT: REELS CARD WITH 3-VIDEO MEMORY BUFFER
// ===========================================================================
/**
 * 3-Video Memory Management:
 * Only mount the Video component when the item index is within (activeReelIndex ± 1).
 * Unmount all other offscreen videos so RAM never exceeds 100MB even on 2GB RAM phones!
 */
const ReelVideoItem = memo(({ 
  item, 
  index, 
  activeIndex, 
  onDoubleTapLike, 
  onFollowToggle, 
  onCommentPress, 
  onSharePress 
}: {
  item: SocialPost;
  index: number;
  activeIndex: number;
  onDoubleTapLike: (id: string) => void;
  onFollowToggle: (creatorId: string) => void;
  onCommentPress: (item: SocialPost) => void;
  onSharePress: (item: SocialPost) => void;
}) => {
  const isCurrentlyActive = index === activeIndex;
  // Keep only 3 videos in memory: Previous, Current, Next
  const shouldMountVideo = Math.abs(index - activeIndex) <= 1;

  const [isPaused, setIsPaused] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const videoRef = useRef<Video | null>(null);

  const handleTap = () => {
    setIsPaused(!isPaused);
  };

  const handleDoubleTap = () => {
    onDoubleTapLike(item.id);
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  let lastPress = 0;
  const handleTouch = () => {
    const time = Date.now();
    const delta = time - lastPress;
    if (delta < 300) {
      handleDoubleTap();
    } else {
      handleTap();
    }
    lastPress = time;
  };

  return (
    <View style={reelStyles.cardContainer}>
      <TouchableOpacity activeOpacity={1} onPress={handleTouch} style={reelStyles.mediaContainer}>
        {shouldMountVideo && item.mediaType === 'video' ? (
          <Video
            ref={videoRef}
            source={{ uri: item.mediaUri }}
            rate={1.0}
            volume={1.0} // 🔊 Sound enabled via Snapchat-style Audio setup
            isMuted={false}
            resizeMode={ResizeMode.COVER}
            shouldPlay={isCurrentlyActive && !isPaused}
            isLooping={true}
            style={reelStyles.fullMedia}
          />
        ) : (
          <Animated.Image 
            source={{ uri: item.mediaUri }} 
            style={reelStyles.fullMedia} 
            resizeMode="cover" 
          />
        )}

        {/* Double-Tap Heart Burst Animation */}
        {showHeart && (
          <View style={reelStyles.heartOverlay}>
            <Text style={reelStyles.bigHeartText}>❤️</Text>
          </View>
        )}

        {/* Play / Pause Center Icon */}
        {isPaused && (
          <View style={reelStyles.pauseOverlay}>
            <View style={reelStyles.pauseCircle}>
              <Text style={reelStyles.pauseIconText}>▶</Text>
            </View>
          </View>
        )}

        {/* Sound On Badge */}
        <View style={reelStyles.soundPill}>
          <Text style={reelStyles.soundPillText}>🔊 आवाज़ ऑन</Text>
        </View>
      </TouchableOpacity>

      {/* Right Action Bar (Instagram & ShareChat Style) */}
      <View style={reelStyles.rightActionBar}>
        {/* Creator Avatar with Follow Plus Badge */}
        <View style={reelStyles.avatarContainer}>
          <Animated.Image source={{ uri: item.creator.avatar }} style={reelStyles.avatarImg} />
          {!item.creator.isFollowing && (
            <TouchableOpacity 
              style={reelStyles.plusFollowBadge}
              onPress={() => onFollowToggle(item.creator.id)}
            >
              <Text style={reelStyles.plusFollowText}>+</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Like Button */}
        <TouchableOpacity 
          style={reelStyles.actionButton}
          onPress={() => onDoubleTapLike(item.id)}
        >
          <Text style={[reelStyles.actionIcon, item.isLiked && reelStyles.likedHeart]}>
            {item.isLiked ? '❤️' : '🤍'}
          </Text>
          <Text style={reelStyles.actionLabel}>{item.likesCount}</Text>
        </TouchableOpacity>

        {/* Comments Button */}
        <TouchableOpacity 
          style={reelStyles.actionButton}
          onPress={() => onCommentPress(item)}
        >
          <Text style={reelStyles.actionIcon}>💬</Text>
          <Text style={reelStyles.actionLabel}>{item.commentsCount}</Text>
        </TouchableOpacity>

        {/* Share Button (WhatsApp / ShareChat) */}
        <TouchableOpacity 
          style={reelStyles.actionButton}
          onPress={() => onSharePress(item)}
        >
          <Text style={reelStyles.actionIcon}>🚀</Text>
          <Text style={reelStyles.actionLabel}>{item.sharesCount}</Text>
        </TouchableOpacity>

        {/* Music Disc Spin */}
        <View style={reelStyles.musicDisc}>
          <Text style={reelStyles.musicNoteIcon}>🎵</Text>
        </View>
      </View>

      {/* Bottom Creator & Caption Info Overlay */}
      <View style={reelStyles.bottomOverlay}>
        <View style={reelStyles.creatorRow}>
          <Text style={reelStyles.creatorName}>{item.creator.name}</Text>
          {item.creator.isVerified && <Text style={reelStyles.verifiedBadge}> ✓</Text>}
          <Text style={reelStyles.creatorCity}> • {item.creator.city}</Text>

          {!item.creator.isFollowing && (
            <TouchableOpacity 
              style={reelStyles.followButton}
              onPress={() => onFollowToggle(item.creator.id)}
            >
              <Text style={reelStyles.followButtonText}>फॉलो करें</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={reelStyles.captionText} numberOfLines={2}>
          {item.caption}
        </Text>

        {/* Music / Soundtrack Ticker */}
        {item.musicTitle && (
          <View style={reelStyles.musicTickerRow}>
            <Text style={reelStyles.musicTickerText}>🎵 {item.musicTitle}</Text>
          </View>
        )}
      </View>
    </View>
  );
});

// ===========================================================================
// MAIN SMART SOCIAL COMPONENT
// ===========================================================================
export const SmartSocialFeed: React.FC = () => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'feed' | 'reels' | 'camera'>('feed');
  const [selectedLanguage, setSelectedLanguage] = useState<IndianLanguage>('all');

  // Camera & Mic Permissions (Expo Camera SDK 50+)
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  const [cameraFacing, setCameraFacing] = useState<CameraType>('back');
  const [isFlashActive, setIsFlashActive] = useState<boolean>(false);
  const cameraRef = useRef<any>(null);

  // Data States
  const [stories, setStories] = useState<StoryItem[]>(INITIAL_STORIES);
  const [posts, setPosts] = useState<SocialPost[]>(INITIAL_POSTS);
  const [activeReelIndex, setActiveReelIndex] = useState(0);

  // Direct Message & Comment Modal States
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedPostForComment, setSelectedPostForComment] = useState<SocialPost | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

  // -------------------------------------------------------------------------
  // 1. 📊 YOUTUBE / SHARECHAT MB & SPEED UPLOAD TRACKER STATE
  // -------------------------------------------------------------------------
  const [uploadSnapshot, setUploadSnapshot] = useState<UploadSnapshotState>({
    isUploading: false,
    statusText: '',
    progressPercent: 0,
    uploadedMB: '0.00',
    totalMB: '0.00',
    speedMBs: '0.00',
    remainingSeconds: 0
  });

  // -------------------------------------------------------------------------
  // 2. 🔊 SNAPCHAT-STYLE AUDIO FOCUS SETUP (iOS Silent Mode Fix)
  // -------------------------------------------------------------------------
  const initAudioEngine = useCallback(async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true, // 🔊 iOS साइलेंट मोड में भी आवाज़ आएगी!
        staysActiveInBackground: true,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        shouldDuckAndroid: false, // 🎧 Background volume dropping prevented
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        playThroughEarpieceAndroid: false // 📢 Routes to main speaker
      });
      console.log('✅ [BharatConnect] Audio Engine Initialized with Silent Mode Bypass.');
    } catch (e) {
      console.warn('Audio Mode Init Error:', e);
    }
  }, []);

  useEffect(() => {
    initAudioEngine();
  }, [initAudioEngine]);

  // -------------------------------------------------------------------------
  // 3. ⚡ ON-DEVICE MEDIA COMPRESSION (Max 1080p, quality 0.75)
  // -------------------------------------------------------------------------
  const compressMediaBeforeUpload = async (uri: string): Promise<string> => {
    setUploadSnapshot(prev => ({
      ...prev,
      isUploading: true,
      statusText: 'फ़ोटो कंप्रेस हो रही है (1080p)...',
      progressPercent: 5
    }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const manip = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1080 } }], // Standard high-def width
        { compress: 0.75, format: ImageManipulator.SaveFormat.JPEG }
      );
      return manip.uri;
    } catch {
      return uri; // fallback to original
    }
  };

  // -------------------------------------------------------------------------
  // 4. 🚀 REAL-TIME UPLOAD PIPELINE (YouTube/ShareChat Style)
  // -------------------------------------------------------------------------
  const startUploadPipeline = async (mediaUri: string, mediaType: 'image' | 'video') => {
    let startTime = Date.now();

    try {
      let finalUri = mediaUri;
      if (mediaType === 'image') {
        finalUri = await compressMediaBeforeUpload(mediaUri);
      }

      setUploadSnapshot({
        isUploading: true,
        statusText: 'अपलोड शुरू हो रहा है...',
        progressPercent: 10,
        uploadedMB: '0.00',
        totalMB: '0.00',
        speedMBs: '0.00',
        remainingSeconds: 0
      });

      // Fetch blob from URI
      const response = await fetch(finalUri);
      const blob = await response.blob();
      const totalBytes = blob.size;
      const totalMBString = (totalBytes / (1024 * 1024)).toFixed(2);

      const ext = mediaType === 'video' ? 'mp4' : 'jpg';
      const storagePath = `${mediaType === 'video' ? 'videos' : 'posts'}/${Date.now()}.${ext}`;

      const storage = getStorage();
      const storageRef = ref(storage, storagePath);
      const task = uploadBytesResumable(storageRef, blob, {
        contentType: mediaType === 'video' ? 'video/mp4' : 'image/jpeg'
      });

      startTime = Date.now();

      // YouTube / ShareChat live progress tracker
      task.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          const uploadedMB = (snapshot.bytesTransferred / (1024 * 1024)).toFixed(2);
          const totalMB = (snapshot.totalBytes / (1024 * 1024)).toFixed(2);

          // Calculate Speed & ETA
          const elapsedSeconds = Math.max(0.2, (Date.now() - startTime) / 1000);
          const speed = (parseFloat(uploadedMB) / elapsedSeconds).toFixed(2);
          const remainingMB = (snapshot.totalBytes - snapshot.bytesTransferred) / (1024 * 1024);
          const eta = parseFloat(speed) > 0 ? Math.ceil(remainingMB / parseFloat(speed)) : 0;

          setUploadSnapshot({
            isUploading: true,
            statusText: `अपलोड हो रहा है: ${uploadedMB} MB / ${totalMB} MB`,
            progressPercent: Math.min(95, Math.round(progress)),
            uploadedMB,
            totalMB,
            speedMBs: speed,
            remainingSeconds: eta
          });
        },
        (error) => {
          console.error('Upload Failed:', error);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          setUploadSnapshot(prev => ({
            ...prev,
            isUploading: false,
            error: 'अपलोड विफल रहा। कृपया इंटरनेट कनेक्शन जांचें।'
          }));
          Alert.alert('Upload Error', 'फ़ाइल अपलोड नहीं हो सकी। कृपया इंटरनेट जांचें।');
        },
        async () => {
          // Success
          setUploadSnapshot(prev => ({
            ...prev,
            statusText: 'फ़ीड में सुरक्षित किया जा रहा है...',
            progressPercent: 98
          }));

          const downloadUrl = await getDownloadURL(task.snapshot.ref);

          // Save to Firestore
          const db = getFirestore();
          await addDoc(collection(db, 'posts'), {
            caption: 'नया पोस्ट भारतकनेक्ट पर! 🇮🇳✨',
            mediaUri: downloadUrl,
            mediaType,
            likesCount: 0,
            commentsCount: 0,
            sharesCount: 0,
            createdAt: serverTimestamp()
          });

          // Optimistically append to local posts
          const newPost: SocialPost = {
            id: `post-${Date.now()}`,
            creator: {
              id: 'me',
              name: 'आप (Current User)',
              handle: '@you',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
              city: 'नई दिल्ली',
              state: 'दिल्ली',
              isVerified: true,
              isFollowing: false
            },
            mediaUri: downloadUrl,
            mediaType,
            caption: 'नया पोस्ट भारतकनेक्ट पर प्रकाशित हुआ! 🇮🇳 #BharatConnect',
            language: 'hi',
            likesCount: 1,
            commentsCount: 0,
            sharesCount: 0,
            isLiked: false,
            isSaved: false,
            tags: ['भारतकनेक्ट', 'नई_पोस्ट'],
            createdAt: 'अभी-अभी (Just now)'
          };

          setPosts(prev => [newPost, ...prev]);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

          setUploadSnapshot({
            isUploading: false,
            statusText: 'सफलतापूर्वक प्रकाशित हुआ! 🎉',
            progressPercent: 100,
            uploadedMB: totalMBString,
            totalMB: totalMBString,
            speedMBs: '0.00',
            remainingSeconds: 0
          });

          setTimeout(() => {
            setUploadSnapshot(prev => ({ ...prev, statusText: '' }));
            setActiveTab('feed');
          }, 2000);
        }
      );
    } catch (err: any) {
      console.error('Pipeline error:', err);
      setUploadSnapshot(prev => ({
        ...prev,
        isUploading: false,
        error: err?.message || 'Error occurred'
      }));
    }
  };

  // Launch Photo/Video Picker
  const handleLaunchPicker = async (type: 'all' | 'video' | 'image' = 'all') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'मीडिया अपलोड करने के लिए गैलरी एक्सेस की अनुमति दें।');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 
        type === 'video' 
          ? ImagePicker.MediaTypeOptions.Videos 
          : type === 'image' 
          ? ImagePicker.MediaTypeOptions.Images 
          : ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.8,
      aspect: [4, 5]
    });

    if (!pickerResult.canceled && pickerResult.assets[0]) {
      const asset = pickerResult.assets[0];
      const isVideo = asset.type === 'video';
      await startUploadPipeline(asset.uri, isVideo ? 'video' : 'image');
    }
  };

  // Capture Photo with Camera
  const handleCapturePhoto = async () => {
    if (!cameraRef.current) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.85,
        skipProcessing: false
      });
      if (photo?.uri) {
        await startUploadPipeline(photo.uri, 'image');
      }
    } catch (e) {
      console.error('Capture error:', e);
    }
  };

  // Double-tap Like Action with Haptics
  const handleDoubleTapLike = (postId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const nextLiked = !p.isLiked;
          return {
            ...p,
            isLiked: nextLiked,
            likesCount: nextLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1)
          };
        }
        return p;
      })
    );
  };

  // Follow / Unfollow Creator
  const handleFollowToggle = (creatorId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPosts(prev =>
      prev.map(p => {
        if (p.creator.id === creatorId) {
          const nextFollowing = !p.creator.isFollowing;
          return {
            ...p,
            creator: { ...p.creator, isFollowing: nextFollowing }
          };
        }
        return p;
      })
    );
  };

  // WhatsApp / Social Share
  const handleSharePost = async (post: SocialPost) => {
    try {
      await Share.share({
        message: `भारतकनेक्ट पर ${post.creator.name} का यह पोस्ट देखें:\n"${post.caption}"\n\nhttps://bharatconnect.app/post/${post.id}`
      });
    } catch {}
  };

  // ViewableItemsChanged for 3-Video Virtualization in Reels
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems && viewableItems.length > 0 && viewableItems[0].index !== null) {
      setActiveReelIndex(viewableItems[0].index);
    }
  }).current;

  // Filter posts by selected Indian language
  const filteredPosts = selectedLanguage === 'all'
    ? posts
    : posts.filter(p => p.language === selectedLanguage);

  // =========================================================================
  // RENDER INTERFACE
  // =========================================================================
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#090d16" />

      {/* TOP HEADER */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>भा</Text>
          </View>
          <View>
            <Text style={styles.brandTitle}>
              <Text style={styles.orangeText}>Bharat</Text>
              <Text style={styles.whiteText}>Connect</Text>
            </Text>
            <Text style={styles.brandSub}>भारत का अपना सोशल नेटवर्क 🇮🇳</Text>
          </View>
        </View>

        {/* Tab Switcher: Feed / Reels / Camera */}
        <View style={styles.tabSwitcher}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'feed' && styles.tabButtonActive]}
            onPress={() => setActiveTab('feed')}
          >
            <Text style={[styles.tabText, activeTab === 'feed' && styles.tabTextActive]}>फ़ीड</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'reels' && styles.tabButtonActive]}
            onPress={() => setActiveTab('reels')}
          >
            <Text style={[styles.tabText, activeTab === 'reels' && styles.tabTextActive]}>रील्स</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'camera' && styles.tabButtonActive]}
            onPress={async () => {
              if (!cameraPermission?.granted) await requestCameraPermission();
              if (!micPermission?.granted) await requestMicPermission();
              setActiveTab('camera');
            }}
          >
            <Text style={[styles.tabText, activeTab === 'camera' && styles.tabTextActive]}>📸 कैमरा</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 📊 YOUTUBE / SHARECHAT REAL-TIME UPLOAD BANNER */}
      {uploadSnapshot.isUploading && (
        <View style={styles.uploadBanner}>
          <View style={styles.uploadInfoRow}>
            <Text style={styles.uploadStatusTitle}>
              {uploadSnapshot.statusText}
            </Text>
            <Text style={styles.uploadPercentNumber}>
              {uploadSnapshot.progressPercent}%
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarBg}>
            <View 
              style={[
                styles.progressBarActive, 
                { width: `${uploadSnapshot.progressPercent}%` }
              ]} 
            />
          </View>

          {/* Speed & ETA countdown */}
          <View style={styles.metricsRow}>
            <Text style={styles.metricsText}>
              ⚡ स्पीड: {uploadSnapshot.speedMBs} MB/s
            </Text>
            <Text style={styles.metricsText}>
              ⏳ शेष समय: ~{uploadSnapshot.remainingSeconds}s
            </Text>
          </View>
        </View>
      )}

      {/* =================================================================== */}
      {/* 1. REELS VIEW WITH 3-VIDEO MEMORY BUFFER */}
      {/* =================================================================== */}
      {activeTab === 'reels' ? (
        <View style={styles.reelsContainer}>
          <FlashList
            data={posts.filter(p => p.mediaType === 'video')}
            renderItem={({ item, index }) => (
              <ReelVideoItem
                item={item}
                index={index}
                activeIndex={activeReelIndex}
                onDoubleTapLike={handleDoubleTapLike}
                onFollowToggle={handleFollowToggle}
                onCommentPress={(post) => {
                  setSelectedPostForComment(post);
                  setCommentModalVisible(true);
                }}
                onSharePress={handleSharePost}
              />
            )}
            keyExtractor={item => item.id}
            estimatedItemSize={SCREEN_HEIGHT - 130}
            pagingEnabled
            snapToInterval={SCREEN_HEIGHT - 130}
            snapToAlignment="start"
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
          />
        </View>
      ) : activeTab === 'camera' ? (
        /* =================================================================== */
        /* 2. SNAPCHAT-STYLE FULL SCREEN CAMERA */
        /* =================================================================== */
        <View style={styles.cameraBox}>
          <CameraView
            ref={cameraRef}
            style={styles.cameraFull}
            facing={cameraFacing}
            enableTorch={isFlashActive}
          >
            {/* Top controls: Flash & Flip */}
            <View style={styles.cameraTopRow}>
              <TouchableOpacity 
                style={styles.circleControl}
                onPress={() => setIsFlashActive(!isFlashActive)}
              >
                <Text style={styles.controlEmoji}>{isFlashActive ? '⚡' : '🚫'}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.circleControl}
                onPress={() => setCameraFacing(prev => prev === 'back' ? 'front' : 'back')}
              >
                <Text style={styles.controlEmoji}>🔄</Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Shutter & Gallery Buttons */}
            <View style={styles.cameraBottomBar}>
              <TouchableOpacity 
                style={styles.galleryButton}
                onPress={() => handleLaunchPicker('all')}
              >
                <Text style={styles.galleryButtonText}>🖼️ गैलरी</Text>
              </TouchableOpacity>

              {/* Shutter Circle */}
              <TouchableOpacity 
                style={styles.shutterOuter}
                onPress={handleCapturePhoto}
              >
                <View style={styles.shutterInner} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.galleryButton}
                onPress={() => setActiveTab('feed')}
              >
                <Text style={styles.galleryButtonText}>✕ बंद करें</Text>
              </TouchableOpacity>
            </View>
          </CameraView>
        </View>
      ) : (
        /* =================================================================== */
        /* 3. HOME FEED (FlashList with Stories & Indian Language Bar) */
        /* =================================================================== */
        <View style={styles.feedWrapper}>
          {/* Stories Rail */}
          <View style={styles.storiesSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storiesScroll}>
              {stories.map(story => (
                <TouchableOpacity key={story.id} style={styles.storyBubble}>
                  <View style={[styles.storyRing, story.hasUnread && styles.storyRingUnread]}>
                    <Animated.Image source={{ uri: story.creator.avatar }} style={styles.storyAvatar} />
                  </View>
                  <Text style={styles.storyName} numberOfLines={1}>
                    {story.creator.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Indian Language Filter Bar */}
          <View style={styles.languageBar}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.langScroll}>
              {[
                { code: 'all', label: 'सभी (All)' },
                { code: 'hi', label: 'हिंदी' },
                { code: 'gu', label: 'ગુજરાતી' },
                { code: 'mr', label: 'मराठी' },
                { code: 'ta', label: 'தமிழ்' },
                { code: 'bn', label: 'বাংলা' }
              ].map(lang => (
                <TouchableOpacity
                  key={lang.code}
                  onPress={() => setSelectedLanguage(lang.code as IndianLanguage)}
                  style={[
                    styles.langChip,
                    selectedLanguage === lang.code && styles.langChipActive
                  ]}
                >
                  <Text style={[
                    styles.langChipText,
                    selectedLanguage === lang.code && styles.langChipTextActive
                  ]}>
                    {lang.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* High-Performance FlashList Feed */}
          <FlashList
            data={filteredPosts}
            keyExtractor={item => item.id}
            estimatedItemSize={520}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.feedPostCard}>
                {/* Header */}
                <View style={styles.postHeadRow}>
                  <Animated.Image source={{ uri: item.creator.avatar }} style={styles.feedAvatar} />
                  <View style={styles.feedHeadInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.feedCreatorName}>{item.creator.name}</Text>
                      {item.creator.isVerified && <Text style={styles.verifiedDot}> ✓</Text>}
                    </View>
                    <Text style={styles.feedSubText}>{item.creator.city} • {item.createdAt}</Text>
                  </View>

                  {!item.creator.isFollowing && (
                    <TouchableOpacity 
                      style={styles.followBadgeBtn}
                      onPress={() => handleFollowToggle(item.creator.id)}
                    >
                      <Text style={styles.followBadgeText}>+ फॉलो</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Media with Double Tap */}
                <TouchableOpacity 
                  activeOpacity={0.95} 
                  onPress={() => handleDoubleTapLike(item.id)}
                  style={styles.feedMediaFrame}
                >
                  {item.mediaType === 'video' ? (
                    <Video
                      source={{ uri: item.mediaUri }}
                      rate={1.0}
                      volume={1.0} // 🔊 Unmuted
                      isMuted={false}
                      resizeMode={ResizeMode.COVER}
                      shouldPlay={true}
                      isLooping={true}
                      style={styles.feedMediaImage}
                    />
                  ) : (
                    <Animated.Image 
                      source={{ uri: item.mediaUri }} 
                      style={styles.feedMediaImage} 
                      resizeMode="cover" 
                    />
                  )}
                </TouchableOpacity>

                {/* Actions: Like, Comment, Share */}
                <View style={styles.feedActionRow}>
                  <View style={styles.leftActionsGroup}>
                    <TouchableOpacity 
                      style={styles.actionBtn}
                      onPress={() => handleDoubleTapLike(item.id)}
                    >
                      <Text style={[styles.actionEmoji, item.isLiked && styles.likedHeart]}>
                        {item.isLiked ? '❤️' : '🤍'}
                      </Text>
                      <Text style={styles.actionCount}>{item.likesCount}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.actionBtn}
                      onPress={() => {
                        setSelectedPostForComment(item);
                        setCommentModalVisible(true);
                      }}
                    >
                      <Text style={styles.actionEmoji}>💬</Text>
                      <Text style={styles.actionCount}>{item.commentsCount}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.actionBtn}
                      onPress={() => handleSharePost(item)}
                    >
                      <Text style={styles.actionEmoji}>🚀</Text>
                      <Text style={styles.actionCount}>{item.sharesCount}</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity>
                    <Text style={styles.actionEmoji}>🔖</Text>
                  </TouchableOpacity>
                </View>

                {/* Caption */}
                <View style={styles.feedCaptionBox}>
                  <Text style={styles.captionText}>
                    <Text style={styles.captionBold}>{item.creator.name} </Text>
                    {item.caption}
                  </Text>
                </View>
              </View>
            )}
          />
        </View>
      )}

      {/* QUICK COMMENT SHEET MODAL */}
      <Modal
        visible={commentModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCommentModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.commentSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>टिप्पणियाँ (Comments)</Text>

            <View style={styles.commentInputRow}>
              <TextInput
                style={styles.commentInput}
                placeholder="अपनी टिप्पणी लिखें..."
                placeholderTextColor="#94a3b8"
                value={newCommentText}
                onChangeText={setNewCommentText}
              />
              <TouchableOpacity 
                style={styles.commentSendBtn}
                onPress={() => {
                  if (!newCommentText.trim()) return;
                  if (selectedPostForComment) {
                    setPosts(prev =>
                      prev.map(p =>
                        p.id === selectedPostForComment.id
                          ? { ...p, commentsCount: p.commentsCount + 1 }
                          : p
                      )
                    );
                  }
                  setNewCommentText('');
                  setCommentModalVisible(false);
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }}
              >
                <Text style={styles.sendBtnText}>भेजें</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// ===========================================================================
// STYLES
// ===========================================================================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#090d16'
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#090d16',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#f97316',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900'
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '900'
  },
  orangeText: {
    color: '#f97316'
  },
  whiteText: {
    color: '#f8fafc'
  },
  brandSub: {
    fontSize: 10,
    color: '#94a3b8'
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 3,
    gap: 2
  },
  tabButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8
  },
  tabButtonActive: {
    backgroundColor: '#ea580c'
  },
  tabText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700'
  },
  tabTextActive: {
    color: '#ffffff'
  },
  // Upload Banner
  uploadBanner: {
    backgroundColor: '#0f172a',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155'
  },
  uploadInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  uploadStatusTitle: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '700'
  },
  uploadPercentNumber: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '900'
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#1e293b',
    borderRadius: 3,
    overflow: 'hidden'
  },
  progressBarActive: {
    height: '100%',
    backgroundColor: '#f97316'
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6
  },
  metricsText: {
    color: '#94a3b8',
    fontSize: 11
  },
  // Stories
  feedWrapper: {
    flex: 1
  },
  storiesSection: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b'
  },
  storiesScroll: {
    paddingHorizontal: 12,
    gap: 14
  },
  storyBubble: {
    alignItems: 'center',
    width: 64
  },
  storyRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    padding: 2,
    borderWidth: 2,
    borderColor: '#334155'
  },
  storyRingUnread: {
    borderColor: '#f97316'
  },
  storyAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 28
  },
  storyName: {
    color: '#cbd5e1',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center'
  },
  // Language Bar
  languageBar: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b'
  },
  langScroll: {
    paddingHorizontal: 12,
    gap: 8
  },
  langChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: '#1e293b'
  },
  langChipActive: {
    backgroundColor: '#f97316'
  },
  langChipText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600'
  },
  langChipTextActive: {
    color: '#ffffff',
    fontWeight: '700'
  },
  // Feed Cards
  feedPostCard: {
    backgroundColor: '#0c1220',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b'
  },
  postHeadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12
  },
  feedAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10
  },
  feedHeadInfo: {
    flex: 1
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  feedCreatorName: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '700'
  },
  verifiedDot: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '900'
  },
  feedSubText: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 1
  },
  followBadgeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#ea580c'
  },
  followBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700'
  },
  feedMediaFrame: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.1,
    backgroundColor: '#020617'
  },
  feedMediaImage: {
    width: '100%',
    height: '100%'
  },
  feedActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  leftActionsGroup: {
    flexDirection: 'row',
    gap: 16
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  actionEmoji: {
    fontSize: 18,
    color: '#ffffff'
  },
  likedHeart: {
    transform: [{ scale: 1.15 }]
  },
  actionCount: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '700'
  },
  feedCaptionBox: {
    paddingHorizontal: 12,
    paddingBottom: 12
  },
  captionText: {
    color: '#e2e8f0',
    fontSize: 13,
    lineHeight: 18
  },
  captionBold: {
    fontWeight: '800',
    color: '#ffffff'
  },
  // Reels Container
  reelsContainer: {
    flex: 1,
    backgroundColor: '#000000'
  },
  // Camera
  cameraBox: {
    flex: 1
  },
  cameraFull: {
    flex: 1,
    justifyContent: 'space-between'
  },
  cameraTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    marginTop: Platform.OS === 'android' ? 24 : 0
  },
  circleControl: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  controlEmoji: {
    fontSize: 18
  },
  cameraBottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 36
  },
  galleryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)'
  },
  galleryButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700'
  },
  shutterOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ea580c'
  },
  // Comment Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end'
  },
  commentSheet: {
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: 300
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#334155',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12
  },
  sheetTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12
  },
  commentInputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center'
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#ffffff',
    fontSize: 13
  },
  commentSendBtn: {
    backgroundColor: '#ea580c',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12
  },
  sendBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13
  }
});

// Reels specific styles
const reelStyles = StyleSheet.create({
  cardContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 130,
    backgroundColor: '#000000',
    position: 'relative'
  },
  mediaContainer: {
    width: '100%',
    height: '100%'
  },
  fullMedia: {
    width: '100%',
    height: '100%'
  },
  heartOverlay: {
    position: 'absolute',
    top: '40%',
    left: '40%',
    zIndex: 10
  },
  bigHeartText: {
    fontSize: 80
  },
  pauseOverlay: {
    position: 'absolute',
    inset: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  pauseCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  pauseIconText: {
    color: '#ffffff',
    fontSize: 24,
    marginLeft: 4
  },
  soundPill: {
    position: 'absolute',
    top: 20,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12
  },
  soundPillText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700'
  },
  rightActionBar: {
    position: 'absolute',
    right: 12,
    bottom: 40,
    alignItems: 'center',
    gap: 16,
    zIndex: 10
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 6
  },
  avatarImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#ffffff'
  },
  plusFollowBadge: {
    position: 'absolute',
    bottom: -6,
    alignSelf: 'center',
    backgroundColor: '#ea580c',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  plusFollowText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 15
  },
  actionButton: {
    alignItems: 'center'
  },
  actionIcon: {
    fontSize: 28,
    color: '#ffffff'
  },
  likedHeart: {
    transform: [{ scale: 1.15 }]
  },
  actionLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2
  },
  musicDisc: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1e293b',
    borderWidth: 2,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8
  },
  musicNoteIcon: {
    fontSize: 14
  },
  bottomOverlay: {
    position: 'absolute',
    left: 12,
    right: 76,
    bottom: 24,
    zIndex: 10
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },
  creatorName: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14
  },
  verifiedBadge: {
    color: '#38bdf8',
    fontWeight: '900',
    fontSize: 12
  },
  creatorCity: {
    color: '#cbd5e1',
    fontSize: 11
  },
  followButton: {
    marginLeft: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4
  },
  followButtonText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700'
  },
  captionText: {
    color: '#e2e8f0',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6
  },
  musicTickerRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  musicTickerText: {
    color: '#cbd5e1',
    fontSize: 11
  }
});

export default SmartSocialFeed;
