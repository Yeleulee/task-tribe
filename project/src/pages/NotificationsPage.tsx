import React from 'react';
import { motion } from 'framer-motion';
import { useSocial } from '../context/SocialContext';
import NotificationItem from '../components/social/NotificationItem';
import { Bell, CheckSquare } from 'lucide-react';

const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationAsRead } = useSocial();
  
  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);
  
  const markAllAsRead = () => {
    unreadNotifications.forEach(notification => {
      markNotificationAsRead(notification.id);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold flex items-center">
          <Bell className="mr-3 text-accent" size={24} />
          Notifications
        </h1>
        
        {unreadNotifications.length > 0 && (
          <button 
            className="px-4 py-2 bg-background-secondary text-text-secondary hover:text-white rounded-lg flex items-center text-sm"
            onClick={markAllAsRead}
          >
            <CheckSquare size={16} className="mr-2" />
            Mark all as read
          </button>
        )}
      </div>
      
      {unreadNotifications.length > 0 && (
        <div className="mb-8">
          <h2 className="font-medium text-lg mb-4">New ({unreadNotifications.length})</h2>
          <div className="space-y-3">
            {unreadNotifications.map(notification => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </div>
        </div>
      )}
      
      <div>
        <h2 className="font-medium text-lg mb-4">Earlier</h2>
        {readNotifications.length === 0 ? (
          <div className="bg-background-secondary rounded-lg p-8 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mx-auto w-16 h-16 bg-accent bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <Bell className="text-accent" size={24} />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No notifications</h3>
              <p className="text-text-secondary">
                You're all caught up! We'll notify you when there's new activity.
              </p>
            </motion.div>
          </div>
        ) : (
          <div className="space-y-3">
            {readNotifications.map(notification => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default NotificationsPage;