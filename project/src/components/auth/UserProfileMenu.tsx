import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, UserCircle, Settings, HelpCircle, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import useProfile from '../../hooks/useProfile';
import SignOutButton from './SignOutButton';

const UserProfileMenu: React.FC = () => {
  const { currentUser } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("UserProfileMenu - Auth state:", {
      currentUser: currentUser?.uid,
      profileLoading,
      hasProfile: !!profile
    });
  }, [currentUser, profile, profileLoading]);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Generate initial avatar if no custom photo exists
  const generateInitials = () => {
    if (profile?.displayName) {
      return profile.displayName.split(' ').map(name => name[0]).join('').toUpperCase().substring(0, 2);
    }
    return currentUser?.email?.substring(0, 2).toUpperCase() || 'U';
  };

  if (!currentUser) return null;

  const needsProfileSetup = !profileLoading && !profile?.displayName;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="flex items-center space-x-2 hover:opacity-80 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-[#e5fb26] focus:ring-opacity-50"
      >
        {profileLoading ? (
          <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse"></div>
        ) : profile?.photoURL ? (
          <img
            src={profile.photoURL}
            alt="User avatar"
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#e5fb26] text-black flex items-center justify-center font-medium">
            {generateInitials()}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-[#2a2a2a] rounded-lg shadow-lg py-2 z-50">
          <div className="px-4 py-3 border-b border-[#3a3a3a]">
            {profileLoading ? (
              <div className="h-5 w-24 bg-gray-700 rounded animate-pulse mb-2"></div>
            ) : (
              <p className="text-sm font-medium text-white">
                {profile?.displayName || 'User'}
              </p>
            )}
            <p className="text-xs text-gray-400 truncate">
              {currentUser.email}
            </p>
          </div>

          {needsProfileSetup && (
            <div className="px-4 py-3 mb-2 bg-[#3a3a3a]/50">
              <div className="flex items-center mb-2">
                <UserPlus size={16} className="text-[#e5fb26] mr-2" />
                <p className="text-sm font-medium text-white">Complete your profile</p>
              </div>
              <p className="text-xs text-gray-400 mb-2">
                Set up your profile to get the most out of TaskTribe
              </p>
              <Link
                to="/profile-setup"
                className="block w-full text-center px-3 py-2 text-sm bg-[#e5fb26] text-black font-medium rounded-md hover:bg-[#d4ea15]"
                onClick={() => setIsOpen(false)}
              >
                Complete Profile
              </Link>
            </div>
          )}

          <div className="py-1">
            <Link
              to="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-[#3a3a3a] hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <User size={16} className="mr-3" />
              Your Profile
            </Link>
            <Link
              to="/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-[#3a3a3a] hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <Settings size={16} className="mr-3" />
              Settings
            </Link>
            <Link
              to="/help"
              className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-[#3a3a3a] hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <HelpCircle size={16} className="mr-3" />
              Help & Support
            </Link>
          </div>

          <div className="py-1 border-t border-[#3a3a3a]">
            <SignOutButton 
              variant="text" 
              className="w-full text-left px-4 py-2 text-sm hover:bg-[#3a3a3a]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileMenu; 