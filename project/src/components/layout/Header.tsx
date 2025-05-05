import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, Menu } from 'lucide-react';
import { useSocial } from '../../context/SocialContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  toggleSidebar: () => void;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, title }) => {
  const { notifications } = useSocial();
  const navigate = useNavigate();
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-background-secondary backdrop-blur-sm sticky top-0 z-10 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <button 
            className="md:hidden mr-4 text-white p-2 rounded-lg hover:bg-background-tertiary"
            onClick={toggleSidebar}
          >
            <Menu size={20} />
          </button>
          <h1 className="text-xl font-bold text-white">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <input 
              type="text" 
              placeholder="Search..." 
              className="py-2 pl-10 pr-4 w-48 lg:w-64 bg-background-tertiary rounded-lg text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={18} />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 bg-background-tertiary rounded-lg text-white hover:bg-background/80"
            onClick={() => navigate('/dashboard/notifications')}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-background text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Header;