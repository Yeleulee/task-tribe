import React, { useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  CheckSquare, 
  Users, 
  Award, 
  BarChart2, 
  Bell, 
  LogOut, 
  Menu, 
  X,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocial } from '../../context/SocialContext';
import useProfile from '../../hooks/useProfile';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { currentUser, logout } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { getUnreadNotificationsCount } = useSocial();
  const unreadCount = getUnreadNotificationsCount();

  const needsProfileSetup = !profile?.displayName;

  useEffect(() => {
    console.log("Sidebar - Auth state:", {
      currentUser: currentUser?.uid,
      profileLoading,
      hasProfile: !!profile
    });
  }, [currentUser, profile, profileLoading]);

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { 
      x: window.innerWidth < 768 ? '-100%' : 0, 
      transition: { type: 'spring', stiffness: 300, damping: 30 } 
    }
  };

  const navItems = [
    { path: '/dashboard', icon: <Home size={20} aria-hidden="true" />, label: 'Dashboard' },
    { path: '/dashboard/tasks', icon: <CheckSquare size={20} aria-hidden="true" />, label: 'Tasks' },
    { path: '/dashboard/friends', icon: <Users size={20} aria-hidden="true" />, label: 'Friends' },
    { path: '/dashboard/leaderboard', icon: <Award size={20} aria-hidden="true" />, label: 'Leaderboard' },
    { path: '/dashboard/stats', icon: <BarChart2 size={20} aria-hidden="true" />, label: 'Statistics' },
    { path: '/dashboard/notifications', icon: <Bell size={20} aria-hidden="true" />, label: 'Notifications', badge: unreadCount }
  ];

  const sidebarId = "main-sidebar";

  // Generate initials for avatar if no profile photo
  const generateInitials = () => {
    if (profile?.displayName) {
      return profile.displayName.split(' ').map(name => name[0]).join('').toUpperCase().substring(0, 2);
    }
    return currentUser?.email?.substring(0, 2).toUpperCase() || 'U';
  };

  // If no current user, don't render the sidebar
  if (!currentUser) {
    return null;
  }

  return (
    <>
      <button 
        className="md:hidden fixed z-30 top-4 left-4 p-2 rounded-full bg-background-secondary text-white"
        onClick={toggleSidebar}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        aria-controls={sidebarId}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <motion.aside 
        id={sidebarId}
        className="fixed top-0 left-0 h-full z-20 w-64 bg-background-secondary text-white shadow-lg flex flex-col md:translate-x-0"
        variants={sidebarVariants}
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        aria-label="Main navigation"
        aria-hidden={!isOpen && window.innerWidth < 768}
      >
        <div className="p-4 border-b border-background-tertiary flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-accent rounded-lg p-1">
              <CheckSquare className="text-background" size={24} aria-hidden="true" />
            </div>
            <h1 className="text-xl font-bold">TaskTribe</h1>
          </div>
          <button 
            className="md:hidden" 
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 border-b border-background-tertiary">
          {currentUser && (
            <div className="flex items-center space-x-3">
              {profileLoading ? (
                <div className="w-10 h-10 rounded-full bg-background-tertiary animate-pulse" />
              ) : (
                <>
                  {profile?.photoURL ? (
                    <img 
                      src={profile.photoURL}
                      alt="User avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#e5fb26] text-black flex items-center justify-center font-medium">
                      {generateInitials()}
                    </div>
                  )}
                </>
              )}
              <div>
                {profileLoading ? (
                  <div className="h-5 w-24 bg-background-tertiary rounded animate-pulse" />
                ) : (
                  <p className="font-medium">{profile?.displayName || currentUser.email?.split('@')[0] || 'User'}</p>
                )}
                {needsProfileSetup ? (
                  <Link to="/profile-setup" className="flex items-center text-xs text-[#e5fb26] hover:underline">
                    <UserPlus size={12} className="mr-1" />
                    Complete profile
                  </Link>
                ) : (
                  <div className="flex items-center space-x-1 text-xs text-text-secondary">
                    <span>0 points</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center space-x-3 p-3 rounded-lg transition-colors
                ${isActive 
                  ? 'bg-background text-accent' 
                  : 'text-text-secondary hover:bg-background-tertiary hover:text-white'
                }
              `}
              onClick={() => {
                if (window.innerWidth < 768) {
                  toggleSidebar();
                }
              }}
              aria-current={({ isActive }) => isActive ? 'page' : undefined}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="ml-auto bg-accent text-background text-xs font-bold px-2 py-1 rounded-full" aria-label={`${item.badge} unread notifications`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-background-tertiary">
          <button 
            onClick={logout}
            className="flex items-center space-x-3 p-3 rounded-lg text-text-secondary hover:bg-background-tertiary hover:text-white w-full transition-colors"
            aria-label="Log out"
          >
            <LogOut size={20} aria-hidden="true" />
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <motion.div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;