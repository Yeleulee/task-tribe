import React from 'react';
import { NavLink } from 'react-router-dom';
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
  X 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocial } from '../../context/SocialContext';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { getUnreadNotificationsCount } = useSocial();
  const unreadCount = getUnreadNotificationsCount();

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { 
      x: window.innerWidth < 768 ? '-100%' : 0, 
      transition: { type: 'spring', stiffness: 300, damping: 30 } 
    }
  };

  const navItems = [
    { path: '/dashboard', icon: <Home size={20} />, label: 'Dashboard' },
    { path: '/dashboard/tasks', icon: <CheckSquare size={20} />, label: 'Tasks' },
    { path: '/dashboard/friends', icon: <Users size={20} />, label: 'Friends' },
    { path: '/dashboard/leaderboard', icon: <Award size={20} />, label: 'Leaderboard' },
    { path: '/dashboard/stats', icon: <BarChart2 size={20} />, label: 'Statistics' },
    { path: '/dashboard/notifications', icon: <Bell size={20} />, label: 'Notifications', badge: unreadCount }
  ];

  return (
    <>
      <button 
        className="md:hidden fixed z-30 top-4 left-4 p-2 rounded-full bg-background-secondary text-white"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <motion.div 
        className="fixed top-0 left-0 h-full z-20 w-64 bg-background-secondary text-white shadow-lg flex flex-col md:translate-x-0"
        variants={sidebarVariants}
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
      >
        <div className="p-4 border-b border-background-tertiary flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-accent rounded-lg p-1">
              <CheckSquare className="text-background" size={24} />
            </div>
            <h1 className="text-xl font-bold">TaskTribe</h1>
          </div>
          <button className="md:hidden" onClick={toggleSidebar}>
            <X size={20} />
          </button>
        </div>

        <div className="p-4 border-b border-background-tertiary">
          {user && (
            <div className="flex items-center space-x-3">
              <img 
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{user.name}</p>
                <div className="flex items-center space-x-1 text-xs text-text-secondary">
                  <span>Level {user.level}</span>
                  <span>•</span>
                  <span>{user.points} pts</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="ml-auto bg-accent text-background text-xs font-bold px-2 py-1 rounded-full">
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
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </motion.div>

      {/* Overlay for mobile */}
      {isOpen && (
        <motion.div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;