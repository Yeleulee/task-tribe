import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SignOutButtonProps {
  className?: string;
  variant?: 'icon' | 'text' | 'full';
}

const SignOutButton: React.FC<SignOutButtonProps> = ({ 
  className = '', 
  variant = 'full' 
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleSignOut}
        disabled={loading}
        className={`p-2 text-gray-400 hover:text-white rounded-full hover:bg-[#2a2a2a] transition-colors ${className}`}
        aria-label="Sign out"
      >
        <LogOut size={20} />
      </button>
    );
  }

  if (variant === 'text') {
    return (
      <button
        onClick={handleSignOut}
        disabled={loading}
        className={`text-gray-400 hover:text-white transition-colors ${className}`}
      >
        {loading ? 'Signing out...' : 'Sign out'}
      </button>
    );
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className={`flex items-center px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-colors ${className}`}
    >
      <LogOut size={18} className="mr-2" />
      {loading ? 'Signing out...' : 'Sign out'}
    </button>
  );
};

export default SignOutButton; 