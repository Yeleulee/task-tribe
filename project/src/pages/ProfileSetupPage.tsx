import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useProfile from '../hooks/useProfile';
import { CheckSquare, ArrowRight } from 'lucide-react';
import { isFirebaseInitialized, getFirebaseInitializationError, db } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';

const ProfileSetupPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { profile, updateProfile, loading: profileLoading, error: profileError } = useProfile();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  const addDebugLog = (message: string) => {
    console.log(message);
    setDebugLogs(prev => [...prev, `${new Date().toISOString().slice(11, 19)}: ${message}`]);
  };

  useEffect(() => {
    addDebugLog(`ProfileSetupPage - Current user: ${currentUser?.uid || 'no user'}`);
    addDebugLog(`Firebase initialized: ${isFirebaseInitialized()}`);
    
    if (!isFirebaseInitialized()) {
      const initError = getFirebaseInitializationError();
      addDebugLog(`Firebase initialization error: ${initError?.message || 'unknown error'}`);
    }
    
    addDebugLog(`ProfileSetupPage - Profile: ${profile ? 'exists' : 'not found'}`);
    
    // Pre-fill the form if user already has a profile
    if (profile) {
      if (profile.displayName) {
        setDisplayName(profile.displayName);
        addDebugLog(`Using existing displayName: ${profile.displayName}`);
      }
      if (profile.bio) {
        setBio(profile.bio);
        addDebugLog(`Using existing bio`);
      }
    }
    
    // If no user is logged in, redirect to login
    if (!currentUser) {
      addDebugLog("No user logged in, redirecting to login");
      navigate('/login');
    }
    
    // Pre-fill display name from Google auth if available and no profile exists
    if (currentUser?.displayName && !profile?.displayName) {
      addDebugLog(`Using displayName from Google auth: ${currentUser.displayName}`);
      setDisplayName(currentUser.displayName);
    }
  }, [profile, currentUser, navigate]);

  // Handle any profile errors
  useEffect(() => {
    if (profileError) {
      addDebugLog(`Profile error from useProfile: ${profileError}`);
      setError(profileError);
    }
  }, [profileError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!displayName.trim()) {
      setError('Display name is required');
      return;
    }
    
    if (!currentUser) {
      setError('You must be logged in to set up your profile');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const profileData = {
        displayName: displayName.trim(),
        bio: bio.trim() || undefined,
        photoURL: currentUser?.photoURL || undefined
      };
      
      addDebugLog(`Attempting to update profile: ${JSON.stringify(profileData)}`);
      
      const result = await updateProfile(profileData);
      
      if (result) {
        addDebugLog("Profile updated successfully, navigating to dashboard");
        navigate('/dashboard');
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      addDebugLog(`Error updating profile: ${errorMessage}`);
      setError(errorMessage || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Alternative direct Firestore write method
  const handleDirectSave = async () => {
    if (!currentUser?.uid) {
      setError('No user ID available');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      addDebugLog('Attempting direct Firestore write...');
      
      const userRef = doc(db, 'users', currentUser.uid);
      const profileData = {
        displayName: displayName.trim() || 'User',
        bio: bio.trim() || '',
        photoURL: currentUser.photoURL || '',
        email: currentUser.email || '',
        createdAt: Date.now(),
        tasksCompleted: 0,
        level: 1,
        points: 0
      };
      
      await setDoc(userRef, profileData);
      addDebugLog('Direct Firestore write successful');
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      addDebugLog(`Direct Firestore write error: ${errorMessage}`);
      setError(`Direct save failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Skip profile setup
  const handleSkip = () => {
    addDebugLog('User skipped profile setup');
    navigate('/dashboard');
  };

  // Show debug info
  const renderDebugInfo = () => {
    return (
      <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500 rounded">
        <h3 className="text-sm font-medium text-yellow-500">Debug Information</h3>
        <div className="text-xs text-gray-400 mt-1">
          <p>User ID: {currentUser?.uid || 'Not logged in'}</p>
          <p>Auth Provider: {currentUser?.providerData[0]?.providerId || 'Unknown'}</p>
          <p>Firebase Initialized: {String(isFirebaseInitialized())}</p>
          <p>Profile Status: {profile ? 'Exists' : 'Not Found'}</p>
          
          <div className="mt-2 border-t border-yellow-500/30 pt-2">
            <p className="mb-1">Debug Logs:</p>
            <div className="bg-black/20 p-2 rounded max-h-32 overflow-y-auto">
              {debugLogs.map((log, index) => (
                <div key={index} className="text-xs font-mono">{log}</div>
              ))}
            </div>
          </div>
          
          <div className="mt-2 pt-2 border-t border-yellow-500/30">
            <button 
              onClick={handleDirectSave}
              className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs mr-2"
              disabled={loading}
            >
              Try Direct Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#2a2a2a] p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center">
            <div className="bg-[#e5fb26] rounded-lg p-1.5 mr-2">
              <CheckSquare className="text-black" size={24} />
            </div>
            <span className="text-2xl font-bold text-[#e5fb26]">TaskTribe</span>
          </div>
          <h1 className="text-2xl font-bold mt-6">Set Up Your Profile</h1>
          <p className="text-gray-400 mt-2">Tell us a bit about yourself</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-white text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-1">
              Display Name*
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#e5fb26] focus:border-transparent"
              placeholder="How would you like to be called?"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">
              Bio <span className="text-gray-500">(optional)</span>
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#e5fb26] focus:border-transparent"
              placeholder="Tell us a bit about yourself"
            />
          </div>

          {currentUser?.photoURL && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Profile Photo
              </label>
              <div className="flex items-center space-x-4">
                <img 
                  src={currentUser.photoURL} 
                  alt="Profile" 
                  className="w-16 h-16 rounded-full object-cover"
                />
                <p className="text-sm text-gray-400">
                  We'll use your Google profile photo
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleSkip}
              className="flex items-center text-gray-400 hover:text-white text-sm"
            >
              Skip for now <ArrowRight size={14} className="ml-1" />
            </button>
            
            <button
              type="submit"
              disabled={loading || profileLoading}
              className={`py-3 px-4 rounded-lg bg-[#e5fb26] text-black font-semibold transition-colors ${
                loading || profileLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#d4ea15]'
              }`}
            >
              {loading || profileLoading ? 'Saving...' : 'Continue to Dashboard'}
            </button>
          </div>
        </form>
        
        {renderDebugInfo()}
      </div>
    </div>
  );
};

export default ProfileSetupPage; 