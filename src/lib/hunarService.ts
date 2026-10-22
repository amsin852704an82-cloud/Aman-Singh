import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  arrayUnion, 
  increment 
} from 'firebase/firestore';
import { db } from './firebase';
import { HunarPost, HunarCategory, HunarLevel, HunarOfferType, User } from '../types/bharatConnect';

export const INITIAL_HUNAR_POSTS: HunarPost[] = [
  {
    id: 'hunar_01',
    authorUid: 'usr_01',
    authorName: 'Aarav Sharma',
    authorPhotoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    authorHandle: '@aarav',
    author: {
      id: 'usr_01',
      uid: 'usr_01',
      username: 'aarav_sharma',
      fullName: 'Aarav Sharma',
      handle: '@aarav',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      bio: 'Software Engineer & tech creator from Bengaluru.',
      location: 'Bengaluru, Karnataka',
      verified: true,
      followersCount: 14820,
      followingCount: 340,
      postCount: 12,
      language: 'hi'
    },
    title: 'React & TypeScript में Web Apps बनाना सीखें 💻',
    description: 'शुरुआत से लेकर प्रोडक्शन-ग्रेड वेब ऐप्स बनाने की गाइड। Git, Components, APIs और स्टेट मैनेजमेंट सरल हिंदी व अंग्रेजी में।',
    category: 'coding',
    level: 'intermediate',
    offerType: 'teach',
    mediaUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    learnersCount: 240,
    learnerUids: [],
    location: 'ऑनलाइन (Online) · भारत',
    createdAt: '2 घंटे पहले'
  },
  {
    id: 'hunar_02',
    authorUid: 'usr_02',
    authorName: 'Priya Patel',
    authorPhotoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    authorHandle: '@priya_ux',
    author: {
      id: 'usr_02',
      uid: 'usr_02',
      username: 'priya_creations',
      fullName: 'Priya Patel',
      handle: '@priya_ux',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      bio: 'Traveler & food explorer. Celebrating Indian art ✨',
      location: 'Mumbai, Maharashtra',
      verified: true,
      followersCount: 28400,
      followingCount: 420,
      postCount: 28,
      language: 'hi'
    },
    title: 'पारंपरिक गुजराती थेपला और ढोकला रेसिपी 🍲',
    description: 'दादी-नानी के असली मसाले और मुलायम थेपले बनाने का राज। सिर्फ 30 मिनट में घर पर बनाएं रेस्टोरेंट जैसा स्वाद।',
    category: 'cooking',
    level: 'beginner',
    offerType: 'teach',
    mediaUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    learnersCount: 185,
    learnerUids: [],
    location: 'Mumbai / ऑनलाइन',
    createdAt: '5 घंटे पहले'
  },
  {
    id: 'hunar_03',
    authorUid: 'usr_03',
    authorName: 'Vikramaditya Rao',
    authorPhotoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    authorHandle: '@vikram_rao',
    author: {
      id: 'usr_03',
      uid: 'usr_03',
      username: 'vikram_founder',
      fullName: 'Vikramaditya Rao',
      handle: '@vikram_rao',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      bio: 'Startup enthusiast & guitar lover 🎸',
      location: 'New Delhi, Delhi',
      verified: true,
      followersCount: 42100,
      followingCount: 180,
      postCount: 45,
      language: 'en'
    },
    title: 'एकॉस्टिक गिटार: 4 कॉर्ड्स से 50+ हिंदी गाने बजाना 🎸',
    description: 'G, Em, C, D कॉर्ड्स और स्ट्रमिंग पैटर्न सीखें। पहली क्लास के बाद ही आप अपना पहला गाना खुद गाकर बजा सकेंगे।',
    category: 'guitar',
    level: 'beginner',
    offerType: 'teach',
    mediaUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    learnersCount: 312,
    learnerUids: [],
    location: 'Delhi NCR / ऑनलाइन',
    createdAt: '1 दिन पहले'
  },
  {
    id: 'hunar_04',
    authorUid: 'usr_04',
    authorName: 'Ananya Sundaram',
    authorPhotoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    authorHandle: '@ananya_s',
    author: {
      id: 'usr_04',
      uid: 'usr_04',
      username: 'ananya_art',
      fullName: 'Ananya Sundaram',
      handle: '@ananya_s',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      bio: 'Classical Carnatic music & visual aesthetics 🪷',
      location: 'Chennai, Tamil Nadu',
      verified: false,
      followersCount: 19350,
      followingCount: 290,
      postCount: 18,
      language: 'ta'
    },
    title: 'मधुबनी और तंजौर पेंटिंग की प्राचीन कला 🎨',
    description: 'भारतीय लोक कला की बारीक रेखाएं, प्राकृतिक रंगों की पहचान और कैनवास पर देवी-देवताओं व प्रकृति के सुंदर रूपांकन।',
    category: 'painting',
    level: 'pro',
    offerType: 'teach',
    mediaUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    learnersCount: 142,
    learnerUids: [],
    location: 'Chennai / ऑनलाइन',
    createdAt: '2 दिन पहले'
  }
];

export interface CreateHunarParams {
  authorUid: string;
  authorName: string;
  authorPhotoURL: string;
  authorHandle: string;
  title: string;
  description: string;
  category: HunarCategory;
  level: HunarLevel;
  offerType: HunarOfferType;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  location?: string;
}

export function subscribeToHunarPosts(callback: (posts: HunarPost[]) => void): () => void {
  try {
    const q = query(collection(db, 'hunar_posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          callback(INITIAL_HUNAR_POSTS);
          return;
        }

        const firestoreList: HunarPost[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            authorUid: data.authorUid || '',
            authorName: data.authorName || 'भारत हुनरमंद',
            authorPhotoURL: data.authorPhotoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
            authorHandle: data.authorHandle || '@hunar',
            author: data.author || {
              id: data.authorUid,
              uid: data.authorUid,
              username: (data.authorHandle || '').replace('@', '') || 'hunar_creator',
              fullName: data.authorName || 'हुनर क्रिएटर',
              handle: data.authorHandle || '@hunar',
              avatar: data.authorPhotoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
              bio: 'Hunar Skill Master on BharatConnect',
              location: data.location || 'भारत',
              verified: true,
              followersCount: 120,
              followingCount: 15,
              postCount: 1,
              language: 'hi'
            },
            title: data.title || '',
            description: data.description || '',
            category: (data.category as HunarCategory) || 'coding',
            level: (data.level as HunarLevel) || 'beginner',
            offerType: (data.offerType as HunarOfferType) || 'teach',
            mediaUrl: data.mediaUrl || '',
            mediaType: data.mediaType || 'image',
            learnersCount: typeof data.learnersCount === 'number' ? data.learnersCount : 0,
            learnerUids: Array.isArray(data.learnerUids) ? data.learnerUids : [],
            location: data.location || 'ऑनलाइन · भारत',
            createdAt: data.createdAt || 'अभी-अभी'
          };
        });

        // Merge with initial posts if user has added custom posts
        const mergedIds = new Set(firestoreList.map((p) => p.id));
        const remainingInitial = INITIAL_HUNAR_POSTS.filter((p) => !mergedIds.has(p.id));
        callback([...firestoreList, ...remainingInitial]);
      },
      (error) => {
        console.warn('Firestore hunar_posts subscription fallback:', error);
        callback(INITIAL_HUNAR_POSTS);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('Failed to listen to hunar_posts:', err);
    callback(INITIAL_HUNAR_POSTS);
    return () => {};
  }
}

export async function createFirestoreHunarPost(params: CreateHunarParams): Promise<string> {
  const newId = `hunar_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const docRef = doc(db, 'hunar_posts', newId);

  const payload = {
    id: newId,
    authorUid: params.authorUid,
    authorName: params.authorName,
    authorPhotoURL: params.authorPhotoURL,
    authorHandle: params.authorHandle,
    title: params.title.trim(),
    description: params.description.trim(),
    category: params.category,
    level: params.level,
    offerType: params.offerType,
    mediaUrl: params.mediaUrl || '',
    mediaType: params.mediaType || 'image',
    learnersCount: 0,
    learnerUids: [],
    location: params.location?.trim() || 'ऑनलाइन · भारत',
    createdAt: new Date().toISOString()
  };

  await setDoc(docRef, payload);
  return newId;
}

export async function deleteFirestoreHunarPost(hunarId: string): Promise<void> {
  const docRef = doc(db, 'hunar_posts', hunarId);
  await deleteDoc(docRef);
}

export async function registerHunarInterest(hunarId: string, userUid: string): Promise<void> {
  if (hunarId.startsWith('hunar_0')) {
    // Demo seed post, return gracefully
    return;
  }
  const docRef = doc(db, 'hunar_posts', hunarId);
  await updateDoc(docRef, {
    learnersCount: increment(1),
    learnerUids: arrayUnion(userUid)
  });
}
