import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TestDashboard: React.FC = () => {
  const { currentUser, user } = useAuth();

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Dashboard Test Page</h1>
        
        <div className="p-4 bg-[#2a2a2a] rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#3a3a3a] p-4 rounded-lg">
              <h3 className="font-medium mb-2">Auth Status</h3>
              <p>User logged in: {currentUser ? 'Yes' : 'No'}</p>
              {currentUser && (
                <>
                  <p className="mt-2">User ID: {currentUser.uid}</p>
                  <p>Email: {currentUser.email}</p>
                </>
              )}
            </div>
            <div className="bg-[#3a3a3a] p-4 rounded-lg">
              <h3 className="font-medium mb-2">User Profile</h3>
              <p>Profile available: {user ? 'Yes' : 'No'}</p>
              {user && (
                <>
                  <p className="mt-2">Display Name: {user.displayName || 'Not set'}</p>
                  <p>Streak: {user.streak}</p>
                  <p>Points: {user.points}</p>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Progress Summary Placeholder */}
          <div className="col-span-1 md:col-span-2 bg-[#2a2a2a] p-6 rounded-lg">
            <h2 className="font-semibold mb-4">Progress Summary</h2>
            <div className="h-40 bg-[#3a3a3a] rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Progress Summary Component</p>
            </div>
          </div>
          
          {/* Streak Display Placeholder */}
          <div className="bg-[#2a2a2a] p-6 rounded-lg">
            <h2 className="font-semibold mb-4">Streak Display</h2>
            <div className="h-40 bg-[#3a3a3a] rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Streak Display Component</p>
            </div>
          </div>
          
          {/* Tasks Overview Placeholder */}
          <div className="col-span-1 md:col-span-2 bg-[#2a2a2a] p-6 rounded-lg">
            <h2 className="font-semibold mb-4">Tasks Overview</h2>
            <div className="h-40 bg-[#3a3a3a] rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Tasks Overview Component</p>
            </div>
          </div>
          
          {/* Leaderboard Preview Placeholder */}
          <div className="bg-[#2a2a2a] p-6 rounded-lg">
            <h2 className="font-semibold mb-4">Leaderboard Preview</h2>
            <div className="h-40 bg-[#3a3a3a] rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Leaderboard Preview Component</p>
            </div>
          </div>
        </div>
        
        {/* Achievement List Placeholder */}
        <div className="bg-[#2a2a2a] p-6 rounded-lg mb-6">
          <h2 className="font-semibold mb-4">Achievement List</h2>
          <div className="h-40 bg-[#3a3a3a] rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Achievement List Component</p>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <Link 
            to="/dashboard" 
            className="px-4 py-2 bg-[#e5fb26] text-black font-medium rounded-md hover:bg-opacity-90"
          >
            Go to Real Dashboard
          </Link>
          <Link 
            to="/diagnostic" 
            className="px-4 py-2 bg-gray-700 text-white font-medium rounded-md hover:bg-gray-600"
          >
            Go to Diagnostic Tool
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TestDashboard; 