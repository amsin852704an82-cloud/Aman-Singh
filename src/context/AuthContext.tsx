import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  googleProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  updateFirebaseAuthProfile,
  FirebaseUser 
} from '../lib/firebase';
import { saveOrUpdateUserProfile } from '../lib/userProfileService';
import { User } from '../types/bharatConnect';

export interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  error: string | null;
  isDemoMode: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (email: string, pass: string, fullName: string, username: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  enterDemoMode: () => void;
  exitDemoMode: () => void;
  clearError: () => void;
  reloadUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Monitor auth state changes in real-time
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        setIsDemoMode(false);
        try {
          // Sync with Firestore users collection using UID as document ID
          const profile = await saveOrUpdateUserProfile(currentUser);
          setUserProfile(profile);
        } catch (firestoreErr: any) {
          console.error('Firestore user profile sync error:', firestoreErr);
          const rawMessage = firestoreErr instanceof Error ? firestoreErr.message : String(firestoreErr);
          setError(`डेटाबेस त्रुटि (Firestore Error): ${rawMessage}`);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearError = () => setError(null);

  // Helper for clear Hindi error messages
  const getHindiErrorMessage = (err: any, defaultMsg: string): string => {
    const errCode = err?.code || '';
    const rawMessage = err?.message || String(err || '');

    switch (errCode) {
      case 'auth/email-already-in-use':
        return 'यह ईमेल पहले से पंजीकृत है। कृपया लॉगिन करें या दूसरा ईमेल चुनें।';
      case 'auth/invalid-email':
        return 'कृपया एक मान्य ईमेल पता (उदा. name@example.com) दर्ज करें।';
      case 'auth/weak-password':
        return 'सुरक्षा के लिए पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।';
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'अमान्य ईमेल या पासवर्ड। कृपया अपनी जानकारी दोबारा जांचें।';
      case 'auth/popup-blocked':
        return 'ब्राउज़र ने Google साइन-इन पॉप-अप रोक दिया। कृपया पॉप-अप की अनुमति दें या ईमेल/पासवर्ड से लॉगिन करें।';
      case 'auth/popup-closed-by-user':
        return 'Google साइन-इन विंडो बंद कर दी गई।';
      case 'auth/cancelled-popup-request':
        return 'साइन-इन प्रक्रिया रद्द हो गई।';
      case 'auth/network-request-failed':
        return 'इंटरनेट कनेक्शन में समस्या है। कृपया अपना नेटवर्क जांचें।';
      case 'auth/too-many-requests':
        return 'बहुत सारे असफल प्रयास। कृपया कुछ समय बाद पुनः प्रयास करें।';
      case 'auth/operation-not-allowed':
        return 'यह साइन-इन विकल्प Firebase Console में सक्रिय होना आवश्यक है।';
      default:
        if (rawMessage.includes('permission-denied') || rawMessage.includes('Missing or insufficient permissions')) {
          return 'Firestore सुरक्षा त्रुटि: प्रोफाइल सहेजने की अनुमति नहीं मिली।';
        }
        if (rawMessage.includes('offline') || rawMessage.includes('unavailable')) {
          return 'Firestore सेवा अनुपलब्ध है। कृपया अपना इंटरनेट कनेक्शन जांचें।';
        }
        return rawMessage || defaultMsg;
    }
  };

  const reloadUserProfile = async () => {
    if (user) {
      try {
        const profile = await saveOrUpdateUserProfile(user);
        setUserProfile(profile);
      } catch (err: any) {
        console.error('reloadUserProfile error:', err);
        setError(getHindiErrorMessage(err, 'प्रोफाइल लोड नहीं हो सकी।'));
      }
    }
  };

  // 1. Email & Password Sign Up
  const signUpWithEmail = async (
    email: string, 
    pass: string, 
    fullName: string, 
    username: string
  ): Promise<{ success: boolean; error?: string }> => {
    setError(null);
    try {
      const cleanEmail = email.trim();
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      const newUser = userCredential.user;

      // Update Firebase auth profile with display name
      await updateFirebaseAuthProfile(newUser, {
        displayName: fullName.trim(),
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
      });

      // Save user profile in Firestore "users/{uid}" collection
      // Document ID: newUser.uid
      // Fields: uid, name, email, photoURL, createdAt (passwords NEVER stored in database)
      try {
        const profile = await saveOrUpdateUserProfile(newUser, {
          name: fullName.trim(),
          username: username.trim()
        });
        setUserProfile(profile);
      } catch (firestoreErr: any) {
        console.error('Firestore save failed during signup:', firestoreErr);
        const errMsg = getHindiErrorMessage(firestoreErr, 'अकाउंट बन गया लेकिन प्रोफाइल डेटाबेस में सेव नहीं हो सकी।');
        setError(errMsg);
        return { success: false, error: errMsg };
      }

      setUser(newUser);
      setIsDemoMode(false);
      return { success: true };
    } catch (err: any) {
      const msg = getHindiErrorMessage(err, 'साइन अप विफल रहा। कृपया पुनः प्रयास करें।');
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // 2. Email & Password Login
  const loginWithEmail = async (
    email: string, 
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    setError(null);
    try {
      const cleanEmail = email.trim();
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      const loggedInUser = userCredential.user;

      // Save / Update Firestore user profile
      try {
        const profile = await saveOrUpdateUserProfile(loggedInUser);
        setUserProfile(profile);
      } catch (firestoreErr: any) {
        console.error('Firestore sync failed during login:', firestoreErr);
        const errMsg = getHindiErrorMessage(firestoreErr, 'लॉगिन सफल रहा लेकिन प्रोफाइल डेटाबेस लोड नहीं हो सकी।');
        setError(errMsg);
        return { success: false, error: errMsg };
      }

      setUser(loggedInUser);
      setIsDemoMode(false);
      return { success: true };
    } catch (err: any) {
      const msg = getHindiErrorMessage(err, 'लॉगिन विफल रहा। कृपया अपनी जानकारी जांचें।');
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // 3. Google Sign-In
  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;

      // Save / Update Firestore user profile in users collection with UID
      try {
        const profile = await saveOrUpdateUserProfile(googleUser);
        setUserProfile(profile);
      } catch (firestoreErr: any) {
        console.error('Firestore sync failed during Google login:', firestoreErr);
        const errMsg = getHindiErrorMessage(firestoreErr, 'Google लॉगिन हुआ परंतु Firestore प्रोफाइल सहेजी नहीं जा सकी।');
        setError(errMsg);
        return { success: false, error: errMsg };
      }

      setUser(googleUser);
      setIsDemoMode(false);
      return { success: true };
    } catch (err: any) {
      console.warn('Google sign-in error:', err);
      const msg = getHindiErrorMessage(err, 'Google साइन-इन विफल रहा। कृपया पुनः प्रयास करें।');
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // 4. Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
      setIsDemoMode(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // 5. Explicit Demo guest mode (only entered when user taps the button)
  const enterDemoMode = () => {
    setIsDemoMode(true);
    setError(null);
  };

  const exitDemoMode = () => {
    setIsDemoMode(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        error,
        isDemoMode,
        loginWithEmail,
        signUpWithEmail,
        loginWithGoogle,
        logout,
        enterDemoMode,
        exitDemoMode,
        clearError,
        reloadUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
