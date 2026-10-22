// BharatConnect - Firebase SDK Initialization & Configuration
// Project: flowing-impact-fw2pc
// Enabled Providers: Email/Password, Google Sign-In

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from 'firebase/firestore';

// Default configuration with fallback to provisioned flowing-impact-fw2pc credentials
// If you want to use your own separate Firebase project later, replace these values:
export const manualFirebaseConfig = {
  apiKey: "AIzaSyAtd_ITWtVhDt0xr7rkkMEvvTVDrrQaVac", // Replace with your Firebase API Key if needed
  authDomain: "flowing-impact-fw2pc.firebaseapp.com",
  projectId: "flowing-impact-fw2pc",
  storageBucket: "flowing-impact-fw2pc.firebasestorage.app",
  messagingSenderId: "34864845725",
  appId: "1:34864845725:web:34bbfb99e5554ab87c9574"
};

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(manualFirebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Cloud Firestore database
export const db = getFirestore(app, "ai-studio-bharatsocialinfr-b62a7245-991b-4ab7-b1a0-8b7c26a350b6");

// Export Auth & Firestore helpers
export {
  app,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  doc,
  getDoc,
  setDoc,
  updateDoc
};

export default app;
