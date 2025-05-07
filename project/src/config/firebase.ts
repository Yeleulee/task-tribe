import { initializeApp, FirebaseOptions, getApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAnalytics, isAnalyticsSupported } from "firebase/analytics";

// Enable Firebase debugging if specified in .env
if (import.meta.env.VITE_FIREBASE_DEBUG === 'true' && typeof window !== 'undefined') {
  console.log('Firebase debugging enabled');
  window.localStorage.setItem('firebase:debug', '*');
}

// Firebase configuration from environment variables
const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Fallback configuration for development if env variables are not set
if (!import.meta.env.VITE_FIREBASE_API_KEY) {
  console.warn("Firebase environment variables not found, using fallback configuration");
  Object.assign(firebaseConfig, {
    apiKey: "AIzaSyBYgjRnk4b6Busyi96aZvFyVqWlfs54XLA",
    authDomain: "task-tribe-7c91f.firebaseapp.com",
    projectId: "task-tribe-7c91f",
    storageBucket: "task-tribe-7c91f.appspot.com", // Corrected storage bucket URL
    messagingSenderId: "1001562984980",
    appId: "1:1001562984980:web:b1f40992055bae43a10d01",
    measurementId: "G-GZK85C06YH"
  });
}

// Debugging Firebase Config
console.log("Firebase Config:", {
  ...firebaseConfig,
  apiKey: "[HIDDEN]",
  appId: "[HIDDEN]",
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
});

let app;
let auth;
let db;
let googleProvider;
let analytics = null;
let initializationError = null;

// Retry Firebase initialization function
const initializeFirebase = async (retryCount = 0, maxRetries = 3) => {
  if (retryCount > maxRetries) {
    throw new Error(`Failed to initialize Firebase after ${maxRetries} attempts`);
  }
  
  try {
    console.log(`Initializing Firebase (attempt ${retryCount + 1}/${maxRetries + 1})...`);
    
    // Try to get an already initialized app first to prevent duplicate initialization
    try {
      app = getApp();
      console.log("Firebase was already initialized, reusing existing app instance");
    } catch (e) {
      // If no app exists, initialize a new one
      app = initializeApp(firebaseConfig);
      console.log("Firebase app initialized:", app.name);
    }
    
    // Initialize auth
    auth = getAuth(app);
    console.log("Firebase auth initialized");
    
    // Initialize Firestore
    db = getFirestore(app);
    console.log("Firebase Firestore initialized");
    
    // Initialize Google provider
    googleProvider = new GoogleAuthProvider();
    // Clear custom parameters and set only what's needed
    googleProvider.setCustomParameters({
      prompt: 'select_account' // Just use this essential parameter
    });
    console.log("Google provider initialized");
    
    // Initialize Analytics only in browser environments where it's supported
    if (typeof window !== 'undefined') {
      try {
        analytics = getAnalytics(app);
        console.log("Firebase Analytics initialized");
      } catch (error) {
        console.error("Analytics failed to initialize:", error);
      }
    }
    
    // Make Firebase available globally for debugging
    if (typeof window !== 'undefined') {
      window.firebase = {
        app,
        auth,
        db,
        googleProvider
      };
      console.log("Firebase objects added to window for debugging");
    }
    
    // Use local emulator if in development mode
    if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
      try {
        connectAuthEmulator(auth, 'http://localhost:9099');
        connectFirestoreEmulator(db, 'localhost', 8080);
        console.log("Connected to Firebase emulators");
      } catch (error) {
        console.error("Failed to connect to Firebase emulators:", error);
      }
    }
    
    // Check if initialization was successful
    if (!app || !auth || !db) {
      throw new Error("Firebase initialization incomplete - Some components failed to initialize");
    }
    
    // Successful initialization
    return true;
  } catch (error) {
    initializationError = error;
    console.error(`Firebase initialization error (attempt ${retryCount + 1}/${maxRetries + 1}):`, error);
    
    // Specific error handling
    if ((error as any)?.code === 'auth/configuration-not-found') {
      console.error("Authentication configuration not found. Check Firebase console settings.");
      console.error("Verify that Authentication is enabled in the Firebase console.");
      console.error("Ensure that your domain is authorized in the Firebase console.");
    }
    
    // If there are retries left, wait and try again
    if (retryCount < maxRetries) {
      const delay = 1000 * Math.pow(2, retryCount); // Exponential backoff
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return initializeFirebase(retryCount + 1, maxRetries);
    }
    
    throw error;
  }
};

// Perform initialization
try {
  initializeFirebase()
    .then(() => console.log("Firebase initialization complete"))
    .catch(err => console.error("Firebase initialization failed:", err));
} catch (error) {
  console.error("Error during Firebase initialization:", error);
  initializationError = error;
}

// Function to check if Firebase is properly initialized
export const isFirebaseInitialized = () => {
  const initialized = !!app && !!auth && !!db;
  console.log("Firebase initialized check:", initialized);
  return initialized;
};

// Function to get initialization error if any
export const getFirebaseInitializationError = () => {
  return initializationError;
};

export { app, auth, db, analytics, googleProvider };

// Authentication helper functions
export const registerUser = async (email: string, password: string) => {
  if (!isFirebaseInitialized()) {
    console.error("Firebase is not initialized properly - Cannot register user");
    throw new Error("Firebase is not initialized properly");
  }
  
  try {
    console.log(`Attempting to register user with email: ${email.substring(0, 3)}...`);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User registered successfully:", userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  if (!isFirebaseInitialized()) {
    console.error("Firebase is not initialized properly - Cannot log in user");
    throw new Error("Firebase is not initialized properly");
  }
  
  try {
    console.log(`Attempting to log in user with email: ${email.substring(0, 3)}...`);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in successfully:", userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
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
    
    // Use signInWithRedirect instead of popup if popup is causing issues
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

export const logoutUser = async () => {
  if (!isFirebaseInitialized()) {
    console.error("Firebase is not initialized properly - Cannot log out user");
    throw new Error("Firebase is not initialized properly");
  }
  
  try {
    console.log("Attempting to log out user...");
    await signOut(auth);
    console.log("User logged out successfully");
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

export const getCurrentUser = (): Promise<User | null> => {
  if (!isFirebaseInitialized()) {
    console.error("Firebase is not initialized properly - Cannot get current user");
    return Promise.resolve(null);
  }
  
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        console.log("Current user found:", user.uid);
      } else {
        console.log("No current user found");
      }
      resolve(user);
    });
  });
};