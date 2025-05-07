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
    if (!currentUser?.uid) {
      console.error('No current user found when fetching profile');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      console.log('Fetching profile for user:', currentUser.uid);
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        console.log('Existing profile found:', userSnap.data());
        setProfile(userSnap.data() as UserProfile);
      } else {
        console.log('No profile found, creating new profile');
        // Create a new profile if it doesn't exist
        const newProfile: UserProfile = {
          email: currentUser.email || '',
          createdAt: Date.now(),
          tasksCompleted: 0,
          level: 1,
          points: 0,
          displayName: currentUser.displayName || '',
          photoURL: currentUser.photoURL || ''
        };
        
        try {
          await setDoc(userRef, newProfile);
          console.log('New profile created successfully');
          setProfile(newProfile);
        } catch (createErr) {
          console.error('Error creating new profile:', createErr);
          throw createErr;
        }
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
    if (!currentUser?.uid) {
      const errMsg = 'No current user found when updating profile';
      console.error(errMsg);
      setError(errMsg);
      return false;
    }
    
    setLoading(true);
    try {
      console.log('Updating profile for user:', currentUser.uid, 'with data:', data);
      
      // Check if db is initialized
      if (!db) {
        const errMsg = 'Firebase DB not initialized';
        console.error(errMsg);
        setError(errMsg);
        return false;
      }
      
      const userRef = doc(db, 'users', currentUser.uid);
      console.log('User document reference created:', userRef.path);
      
      // Get current data to check if document exists
      try {
        const docSnap = await getDoc(userRef);
        console.log('Document exists check:', docSnap.exists());
        
        if (!docSnap.exists()) {
          // If document doesn't exist, create it first
          console.log('Profile document does not exist, creating it first');
          const newProfile: UserProfile = {
            email: currentUser.email || '',
            createdAt: Date.now(),
            tasksCompleted: 0,
            level: 1,
            points: 0,
            ...data
          };
          
          try {
            await setDoc(userRef, newProfile);
            console.log('New profile created successfully during update');
            setProfile(newProfile);
          } catch (createErr) {
            console.error('Error creating new profile during update:', createErr);
            const errDetails = createErr instanceof Error ? 
              `${createErr.name}: ${createErr.message}` : 
              String(createErr);
            setError(`Failed to create profile: ${errDetails}`);
            return false;
          }
        } else {
          // Update existing document
          try {
            await updateDoc(userRef, data);
            console.log('Profile document updated successfully');
            setProfile(prev => prev ? { ...prev, ...data } : null);
          } catch (updateErr) {
            console.error('Error updating profile document:', updateErr);
            const errDetails = updateErr instanceof Error ? 
              `${updateErr.name}: ${updateErr.message}` : 
              String(updateErr);
            setError(`Failed to update profile: ${errDetails}`);
            return false;
          }
        }
      } catch (docErr) {
        console.error('Error checking document existence:', docErr);
        const errDetails = docErr instanceof Error ? 
          `${docErr.name}: ${docErr.message}` : 
          String(docErr);
        setError(`Failed to check profile: ${errDetails}`);
        return false;
      }
      
      console.log('Profile update/creation completed successfully');
      return true;
    } catch (err) {
      const errDetails = err instanceof Error ? 
        `${err.name}: ${err.message}` : 
        String(err);
      setError(`Profile operation failed: ${errDetails}`);
      console.error('Error in profile operation:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Initialize profile when user changes
  useEffect(() => {
    if (currentUser) {
      console.log('User changed, fetching profile');
      fetchProfile();
    } else {
      console.log('No user, clearing profile');
      setProfile(null);
    }
  }, [currentUser]);

  return { profile, loading, error, updateProfile, fetchProfile };
};

export default useProfile; 