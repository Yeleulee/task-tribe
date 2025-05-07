import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, UserCircle, Settings, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import useProfile from '../../hooks/useProfile';
import SignOutButton from './SignOutButton';

const UserProfileMenu: React.FC = () => {
  const { currentUser } = useAuth();
  const { profile } = useProfile();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="flex items-center space-x-2 hover:opacity-80 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-[#e5fb26] focus:ring-opacity-50"
      >
        {profile?.photoURL ? (
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
            <p className="text-sm font-medium text-white">
              {profile?.displayName || 'User'}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {currentUser.email}
            </p>
          </div>

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