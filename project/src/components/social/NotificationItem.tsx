import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { 
  Bell, 
  UserPlus, 
  Award, 
  CheckSquare, 
  MessageSquare,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { Notification } from '../../types/notification';
import { useSocial } from '../../context/SocialContext';

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { markNotificationAsRead, acceptFriendRequest } = useSocial();
  
  const getIcon = () => {
    switch(notification.type) {
      case 'friend-request':
        return <UserPlus size={18} className="text-accent" />;
      case 'friend-accepted':
        return <UserPlus size={18} className="text-success" />;
      case 'task-reminder':
        return <AlertCircle size={18} className="text-warning" />;
      case 'task-completed':
        return <CheckSquare size={18} className="text-success" />;
      case 'achievement-unlocked':
        return <Award size={18} className="text-accent" />;
      case 'level-up':
        return <TrendingUp size={18} className="text-accent" />;
      case 'encouragement':
        return <MessageSquare size={18} className="text-accent" />;
      default:
        return <Bell size={18} className="text-accent" />;
    }
  };
  
  const handleMarkAsRead = () => {
    markNotificationAsRead(notification.id);
  };
  
  const showAcceptButton = notification.type === 'friend-request' && !notification.read;

  return (
    <motion.div 
      className={`
        p-4 rounded-lg 
        ${notification.read ? 'bg-background-secondary' : 'bg-accent bg-opacity-5 border border-accent border-opacity-10'}
      `}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
    >
      <div className="flex">
        <div className="mr-3 mt-1">
          {getIcon()}
        </div>
        
        <div className="flex-1">
          <p className={`${notification.read ? 'text-white' : 'text-white font-medium'}`}>
            {notification.content}
          </p>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-text-secondary">
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
            </span>
            
            <div className="flex space-x-2">
              {showAcceptButton && (
                <button 
                  className="text-xs px-3 py-1 rounded-full bg-accent text-text-accent font-medium hover:bg-accent-hover"
                  onClick={() => acceptFriendRequest(notification.id)}
                >
                  Accept
                </button>
              )}
              
              {!notification.read && (
                <button 
                  className="text-xs px-3 py-1 rounded-full bg-background text-text-secondary hover:text-white"
                  onClick={handleMarkAsRead}
                >
                  Mark as read
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationItem;