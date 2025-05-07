import React, { useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useProfile from '../hooks/useProfile';

// Import components with Error Boundary
const ProgressSummary = React.lazy(() => import('../components/dashboard/ProgressSummary'));
const TasksOverview = React.lazy(() => import('../components/dashboard/TasksOverview'));
const StreakDisplay = React.lazy(() => import('../components/dashboard/StreakDisplay'));
const LeaderboardPreview = React.lazy(() => import('../components/dashboard/LeaderboardPreview'));
const AchievementList = React.lazy(() => import('../components/dashboard/AchievementList'));

// Loading fallback component
const ComponentLoading = () => (
  <div className="bg-background-secondary rounded-xl p-6 animate-pulse min-h-[200px]">
    <div className="h-5 bg-background-tertiary rounded w-1/3 mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-background-tertiary rounded w-full"></div>
      <div className="h-4 bg-background-tertiary rounded w-5/6"></div>
      <div className="h-4 bg-background-tertiary rounded w-3/4"></div>
    </div>
  </div>
);

// Error fallback component
const ErrorFallback = ({ componentName }: { componentName: string }) => (
  <div className="bg-background-secondary rounded-xl p-6 min-h-[200px] border border-red-500/30">
    <div className="text-red-400 font-semibold mb-2">Error loading {componentName}</div>
    <p className="text-text-secondary text-sm">
      There was an error loading this component. Try refreshing the page.
    </p>
  </div>
);

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [showProfileBanner, setShowProfileBanner] = React.useState(true);
  
  useEffect(() => {
    console.log("%c DashboardPage - Component mounted", "background: #333; color: #ff9e00; padding: 2px;", {
      timestamp: new Date().toISOString()
    });
  }, []);
  
  useEffect(() => {
    console.log("%c DashboardPage - Auth state updated:", "background: #333; color: #ff9e00; padding: 2px;", {
      currentUser: currentUser?.uid,
      profileLoading,
      hasProfile: !!profile,
      timestamp: new Date().toISOString()
    });
    
    if (!currentUser) {
      console.log("%c DashboardPage - No current user detected", "background: #333; color: #ff6b6b; padding: 2px;");
    } else {
      console.log("%c DashboardPage - User authenticated", "background: #333; color: #06d6a0; padding: 2px;");
    }
  }, [currentUser, profile, profileLoading]);

  // Show loading state if still authenticating
  if (!currentUser) {
    console.log("%c DashboardPage - Showing loading spinner, no current user", "background: #333; color: #ff6b6b; padding: 2px;");
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e5fb26] mb-4"></div>
        <p className="text-gray-400">Loading dashboard...</p>
      </div>
    );
  }

  const needsProfileSetup = !profileLoading && !profile?.displayName;
  console.log("%c DashboardPage - Rendering dashboard content", "background: #333; color: #06d6a0; padding: 2px;", {
    userId: currentUser.uid,
    needsProfileSetup,
    hasProfileData: !!profile
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="px-1 py-2" // Add padding to ensure content doesn't touch edges
    >
      {needsProfileSetup && showProfileBanner && (
        <motion.div 
          className="bg-[#3a3a3a] rounded-lg p-4 mb-6 flex items-center justify-between"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center">
            <div className="bg-[#e5fb26] p-2 rounded-full mr-4">
              <UserPlus size={20} className="text-black" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Complete your profile</h3>
              <p className="text-sm text-gray-300">Add a display name and customize your TaskTribe experience</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link 
              to="/profile-setup" 
              className="px-4 py-2 bg-[#e5fb26] text-black text-sm font-medium rounded-md hover:bg-[#d4ea15]"
            >
              Complete Profile
            </Link>
            <button 
              onClick={() => setShowProfileBanner(false)}
              className="p-1 hover:bg-[#4a4a4a] rounded-full"
              aria-label="Dismiss"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 space-y-6">
          <Suspense fallback={<ComponentLoading />}>
            <ProgressSummary />
          </Suspense>
          <Suspense fallback={<ComponentLoading />}>
            <TasksOverview />
          </Suspense>
        </div>
        
        <div className="space-y-6">
          <Suspense fallback={<ComponentLoading />}>
            <StreakDisplay />
          </Suspense>
          <Suspense fallback={<ComponentLoading />}>
            <LeaderboardPreview />
          </Suspense>
        </div>
      </div>
      
      <div className="mb-6">
        <Suspense fallback={<ComponentLoading />}>
          <AchievementList />
        </Suspense>
      </div>
    </motion.div>
  );
};

export default DashboardPage;