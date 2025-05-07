import React, { useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useProfile from '../../hooks/useProfile';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();

  // Enhanced debug logs
  useEffect(() => {
    console.log("%c PrivateRoute - Auth state:", "background: #333; color: #bada55; padding: 2px;", { 
      path: location.pathname,
      currentUser: currentUser?.uid, 
      loading,
      profileLoading,
      hasProfile: !!profile,
      timestamp: new Date().toISOString()
    });
    
    // Check if we're trying to access the dashboard specifically
    if (location.pathname.includes('dashboard')) {
      console.log("%c Attempting to access dashboard", "background: #333; color: #ff6b6b; padding: 2px;");
    }
  }, [currentUser, loading, profile, profileLoading, location]);

  // Handle loading state
  if (loading) {
    console.log("%c PrivateRoute - Auth still loading", "background: #333; color: #ffd166; padding: 2px;");
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e5fb26]"></div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!currentUser) {
    console.log("%c PrivateRoute - No user, redirecting to login", "background: #333; color: #ff6b6b; padding: 2px;");
    return <Navigate to="/login" />;
  }

  // Always render the children if user is logged in
  console.log("%c PrivateRoute - User is logged in, showing protected content", "background: #333; color: #06d6a0; padding: 2px;", {
    component: location.pathname.split('/').pop() || 'dashboard',
    userId: currentUser.uid
  });
  
  return <>{children}</>;
};

export default PrivateRoute; 