import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useProfile from '../hooks/useProfile';
import { CheckSquare } from 'lucide-react';

const ProfileSetupPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { profile, updateProfile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If user already has a profile with a display name, redirect to dashboard
    if (profile && profile.displayName) {
      navigate('/dashboard');
    }
    
    // If no user is logged in, redirect to login
    if (!currentUser) {
      navigate('/login');
    }
    
    // Pre-fill display name from Google auth if available
    if (currentUser?.displayName) {
      setDisplayName(currentUser.displayName);
    }
  }, [profile, currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!displayName.trim()) {
      setError('Display name is required');
      return;
    }
    
    setLoading(true);
    try {
      await updateProfile({
        displayName: displayName.trim(),
        bio: bio.trim() || undefined,
        // If user has a photo from Google auth, use it
        photoURL: currentUser?.photoURL || undefined
      });
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
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

          <button
            type="submit"
            disabled={loading || profileLoading}
            className={`w-full py-3 px-4 rounded-lg bg-[#e5fb26] text-black font-semibold transition-colors ${
              loading || profileLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#d4ea15]'
            }`}
          >
            {loading || profileLoading ? 'Saving...' : 'Continue to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetupPage; 