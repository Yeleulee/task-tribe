import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { auth, getCurrentUser, loginUser, registerUser, logoutUser, loginWithGoogle } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Define the context type
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (email: string, password: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  logout: () => Promise<boolean>;
  error: string | null;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  login: async () => { throw new Error('Not implemented'); },
  signup: async () => { throw new Error('Not implemented'); },
  loginWithGoogle: async () => { throw new Error('Not implemented'); },
  logout: async () => { throw new Error('Not implemented'); },
  error: null
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

  // Set up the auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Clean up the listener on unmount
    return unsubscribe;
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<User> => {
    try {
      setError(null);
      const user = await loginUser(email, password);
      return user;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  // Signup function
  const signup = async (email: string, password: string): Promise<User> => {
    try {
      setError(null);
      const user = await registerUser(email, password);
      return user;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };
  
  // Google login function
  const signInWithGoogle = async (): Promise<User> => {
    try {
      setError(null);
      const user = await loginWithGoogle();
      return user;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  // Logout function
  const logout = async (): Promise<boolean> => {
    try {
      setError(null);
      await logoutUser();
      return true;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    signup,
    loginWithGoogle: signInWithGoogle,
    logout,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;