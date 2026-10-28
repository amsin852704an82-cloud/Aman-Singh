import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signOut, 
  onAuthStateChanged,
  updateProfile as updateFirebaseAuthProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  initializeFirestore,
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp,
  increment,
  writeBatch,
  runTransaction
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytesResumable, 
  getDownloadURL 
} from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firebase Storage
// getStorage(app) natively binds to app.options.storageBucket ("flowing-impact-fw2pc.firebasestorage.app")
// without malformed gs:// protocol prefix issues on modern Firebase storage domains.
export const storage = getStorage(app);

// Configure realistic retry timeouts so uploads never hang at 0% for 10 minutes
try {
  storage.maxUploadRetryTime = 25000; // 25 seconds timeout for uploads
  storage.maxOperationRetryTime = 25000;
} catch (e) {
  console.warn('Storage timeout configuration note:', e);
}

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Firestore (with databaseId support & long polling for iframe preview stability)
const firestoreDbId = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? firebaseConfig.firestoreDatabaseId
  : undefined;

export const db = (() => {
  try {
    return initializeFirestore(app, {
      experimentalForceLongPolling: true,
    }, firestoreDbId);
  } catch {
    return firestoreDbId ? getFirestore(app, firestoreDbId) : getFirestore(app);
  }
})();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const rawMsg = error instanceof Error ? error.message : String(error);
  const errorCode = (error as any)?.code || '';

  // Silently handle temporary offline/unavailable network events without breaking the app
  if (errorCode === 'unavailable' || rawMsg.includes('unavailable') || rawMsg.includes('offline') || rawMsg.includes('could not be completed')) {
    console.info(`[Firestore ${operationType} on ${path || 'unknown'}]: operating in offline-first mode.`);
    return;
  }

  const errInfo: FirestoreErrorInfo = {
    error: rawMsg,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateFirebaseAuthProfile,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp,
  increment,
  writeBatch,
  runTransaction,
  ref,
  uploadBytesResumable,
  getDownloadURL
};
export type { FirebaseUser };

