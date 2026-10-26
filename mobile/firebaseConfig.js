/**
 * BharatConnect Mobile - Firebase Configuration
 * Project: flowing-impact-fw2pc
 * Database: ai-studio-bharatsocialinfr-b62a7245-991b-4ab7-b1a0-8b7c26a350b6
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  increment 
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytesResumable, 
  getDownloadURL 
} from 'firebase/storage';

export const firebaseConfig = {
  apiKey: "AIzaSyAtd_ITWtVhDt0xr7rkkMEvvTVDrrQaVac",
  authDomain: "flowing-impact-fw2pc.firebaseapp.com",
  projectId: "flowing-impact-fw2pc",
  storageBucket: "flowing-impact-fw2pc.firebasestorage.app",
  messagingSenderId: "34864845725",
  appId: "1:34864845725:web:34bbfb99e5554ab87c9574",
  firestoreDatabaseId: "ai-studio-bharatsocialinfr-b62a7245-991b-4ab7-b1a0-8b7c26a350b6"
};

// Initialize Firebase App without duplicate instance errors
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Authentication with AsyncStorage Persistence support for React Native / Expo
let authInstance;
try {
  // Dynamically load AsyncStorage if available in React Native environment
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch {
  authInstance = getAuth(app);
}

export const auth = authInstance;

// Initialize Cloud Firestore with BharatConnect Database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Storage
export const storage = getStorage(app);

export {
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  increment,
  ref,
  uploadBytesResumable,
  getDownloadURL
};

export default app;
