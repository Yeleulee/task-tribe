import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useProfile from '../hooks/useProfile';
import { isFirebaseInitialized } from '../config/firebase';

const DebugPage: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const fbInitialized = isFirebaseInitialized();

  useEffect(() => {
    console.log("Debug page mounted");
    console.log("Auth state:", { 
      currentUser: currentUser?.uid, 
      loading,
      profileLoading,
      hasProfile: !!profile,
      fbInitialized
    });
  }, [currentUser, loading, profile, profileLoading, fbInitialized]);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-xl font-bold mb-4">TaskTribe Debug Info</h1>
      
      <div className="bg-gray-800 p-4 rounded mb-4">
        <h2 className="text-lg font-semibold mb-2">Authentication State</h2>
        <p>Firebase Initialized: <span className={fbInitialized ? "text-green-400" : "text-red-400"}>{String(fbInitialized)}</span></p>
        <p>Auth Loading: <span className={loading ? "text-yellow-400" : "text-green-400"}>{String(loading)}</span></p>
        <p>User Authenticated: <span className={currentUser ? "text-green-400" : "text-red-400"}>{String(!!currentUser)}</span></p>
        {currentUser && (
          <div className="mt-2 border-t border-gray-700 pt-2">
            <p>User ID: {currentUser.uid}</p>
            <p>Email: {currentUser.email}</p>
            <p>Provider: {currentUser.providerData[0]?.providerId}</p>
          </div>
        )}
      </div>

      <div className="bg-gray-800 p-4 rounded mb-4">
        <h2 className="text-lg font-semibold mb-2">Profile State</h2>
        <p>Profile Loading: <span className={profileLoading ? "text-yellow-400" : "text-green-400"}>{String(profileLoading)}</span></p>
        <p>Profile Exists: <span className={profile ? "text-green-400" : "text-red-400"}>{String(!!profile)}</span></p>
        {profile && (
          <div className="mt-2 border-t border-gray-700 pt-2">
            <p>Display Name: {profile.displayName || 'Not set'}</p>
            <p>Email: {profile.email}</p>
            <p>Created At: {new Date(profile.createdAt).toLocaleString()}</p>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-3">
        <Link to="/" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded">Home</Link>
        <Link to="/login" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded">Login</Link>
        <Link to="/signup" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded">Signup</Link>
        <Link to="/dashboard" className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded">Dashboard</Link>
        <Link to="/profile-setup" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded">Profile Setup</Link>
      </div>
    </div>
  );
};

export default DebugPage; 