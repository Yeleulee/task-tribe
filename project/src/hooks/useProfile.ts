import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

interface UserProfile {
  displayName?: string;
  photoURL?: string;
  email: string;
  createdAt: number;
  bio?: string;
  tasksCompleted?: number;
  level?: number;
  points?: number;
}

export const useProfile = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile
  const fetchProfile = async () => {
    if (!currentUser?.uid) return;
    
    setLoading(true);
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        setProfile(userSnap.data() as UserProfile);
      } else {
        // Create a new profile if it doesn't exist
        const newProfile: UserProfile = {
          email: currentUser.email || '',
          createdAt: Date.now(),
          tasksCompleted: 0,
          level: 1,
          points: 0
        };
        await setDoc(userRef, newProfile);
        setProfile(newProfile);
      }
    } catch (err) {
      setError((err as Error).message);
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser?.uid) return;
    
    setLoading(true);
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, data);
      setProfile(prev => prev ? { ...prev, ...data } : null);
      return true;
    } catch (err) {
      setError((err as Error).message);
      console.error('Error updating profile:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Initialize profile when user changes
  useEffect(() => {
    if (currentUser) {
      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [currentUser]);

  return { profile, loading, error, updateProfile, fetchProfile };
};

export default useProfile; 