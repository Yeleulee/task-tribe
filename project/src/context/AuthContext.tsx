import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, getCurrentUser, loginUser, registerUser, logoutUser } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// User profile type
interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  streak: number;
  lastStreakUpdate: string | null;
  points: number;
}

// Define the context type
interface AuthContextType {
  currentUser: User | null;
  user: UserProfile | null; // Added user profile
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (email: string, password: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  logout: () => Promise<boolean>;
  error: string | null;
  // Added methods for dashboard
  updateStreak: (date: Date) => void;
  addPoints: (points: number) => void;
  getStreakStatus: () => { current: number; lastUpdated: string | null };
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  user: null, // Added user profile default
  loading: true,
  login: async () => { throw new Error('Not implemented'); },
  signup: async () => { throw new Error('Not implemented'); },
  loginWithGoogle: async () => { throw new Error('Not implemented'); },
  logout: async () => { throw new Error('Not implemented'); },
  error: null,
  // Added default implementations
  updateStreak: () => {},
  addPoints: () => {},
  getStreakStatus: () => ({ current: 0, lastUpdated: null })
});

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Added user profile state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Set up the auth state listener
  useEffect(() => {
    try {
      console.log("Setting up auth state listener");
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log("Auth state changed: User logged in", user.uid);
          // Create a basic user profile when user logs in
          setUserProfile({
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || undefined,
            photoURL: user.photoURL || undefined,
            streak: 0,
            lastStreakUpdate: null,
            points: 0
          });
        } else {
          console.log("Auth state changed: No user logged in");
          setUserProfile(null);
        }
        setCurrentUser(user);
        setLoading(false);
      });

      // Clean up the listener on unmount
      return unsubscribe;
    } catch (err) {
      console.error("Error setting up auth state listener:", err);
      setLoading(false);
      return () => {};
    }
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<User> => {
    try {
      setError(null);
      console.log("Attempting to log in with email");
      const user = await loginUser(email, password);
      console.log("Login successful with email");
      return user;
    } catch (err) {
      console.error("Login error:", err);
      setError((err as Error).message);
      throw err;
    }
  };

  // Signup function
  const signup = async (email: string, password: string): Promise<User> => {
    try {
      setError(null);
      console.log("Attempting to sign up with email");
      const user = await registerUser(email, password);
      console.log("Signup successful with email");
      return user;
    } catch (err) {
      console.error("Signup error:", err);
      setError((err as Error).message);
      throw err;
    }
  };
  
  // Google login function
  const signInWithGoogle = async (): Promise<User> => {
    try {
      setError(null);
      console.log("Attempting Google sign-in from AuthContext");
      
      // Create a fresh provider each time
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign-in successful from AuthContext, user:", result.user.uid);
      return result.user;
    } catch (err) {
      console.error("Google sign-in error from AuthContext:", err);
      
      // Handle specific error codes
      const errorCode = (err as any)?.code;
      if (errorCode === 'auth/configuration-not-found') {
        setError('Google sign-in is not configured properly. Please try another sign-in method or contact support.');
      } else if (errorCode === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed. Please try again.');
      } else {
        setError((err as Error).message);
      }
      throw err;
    }
  };

  // Logout function
  const logout = async (): Promise<boolean> => {
    try {
      setError(null);
      console.log("Attempting to log out");
      await logoutUser();
      console.log("Logout successful");
      return true;
    } catch (err) {
      console.error("Logout error:", err);
      setError((err as Error).message);
      throw err;
    }
  };

  // Update streak function
  const updateStreak = (date: Date) => {
    if (!userProfile) return;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const streakDate = new Date(date);
    streakDate.setHours(0, 0, 0, 0);
    
    // If streak was already updated today, no need to do anything
    if (userProfile.lastStreakUpdate === today.toISOString()) {
      console.log("Streak already updated today");
      return;
    }
    
    // Update the streak count
    setUserProfile({
      ...userProfile,
      streak: userProfile.streak + 1,
      lastStreakUpdate: today.toISOString()
    });
    
    console.log(`Streak updated: ${userProfile.streak + 1} days`);
  };
  
  // Add points function
  const addPoints = (points: number) => {
    if (!userProfile) return;
    
    setUserProfile({
      ...userProfile,
      points: userProfile.points + points
    });
    
    console.log(`Points added: ${points}, new total: ${userProfile.points + points}`);
  };
  
  // Get streak status
  const getStreakStatus = () => {
    return {
      current: userProfile?.streak || 0,
      lastUpdated: userProfile?.lastStreakUpdate
    };
  };

  const value = {
    currentUser,
    user: userProfile,
    loading,
    login,
    signup,
    loginWithGoogle: signInWithGoogle,
    logout,
    error,
    updateStreak,
    addPoints,
    getStreakStatus
  };

  // Always render children, even during loading
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;