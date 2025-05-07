import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Google provider
const googleProvider = new GoogleAuthProvider();
// Clear any existing custom parameters and set new ones
googleProvider.setCustomParameters({
  // Using fewer parameters to avoid potential conflicts
  prompt: 'select_account'
});
console.log("Google provider initialized");

// Function to check if Firebase is properly initialized
export const isFirebaseInitialized = () => {
  const initialized = !!app && !!auth;
  console.log("Firebase initialized check:", initialized);
  return initialized;
};

export const loginWithGoogle = async () => {
  if (!isFirebaseInitialized()) {
    console.error("Firebase is not initialized properly - Cannot log in with Google");
    throw new Error("Firebase is not initialized properly");
  }
  
  try {
    console.log("Attempting to log in with Google...");
    
    // Create a fresh provider for each login attempt
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    
    const result = await signInWithPopup(auth, provider);
    console.log("Google sign-in successful:", result.user.uid);
    return result.user;
  } catch (error) {
    console.error("Google sign-in error:", error);
    
    // Handle specific error cases
    const errorCode = (error as any)?.code;
    if (errorCode === 'auth/configuration-not-found') {
      console.error("This error typically occurs when:");
      console.error("1. Google Sign-In is not enabled in the Firebase console");
      console.error("2. Your app domain is not authorized in the Firebase console");
      console.error("3. Your OAuth client ID is missing or incorrect");
    }
    
    throw error;
  }
};

export default app; 