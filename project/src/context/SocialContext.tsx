import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types/user';
import { Notification } from '../types/notification';
import { users as initialUsers, notifications as initialNotifications, leaderboard as initialLeaderboard } from '../utils/mockData';
import { useAuth } from './AuthContext';

interface SocialContextType {
  friends: User[];
  notifications: Notification[];
  leaderboard: any[];
  loading: boolean;
  sendFriendRequest: (userId: string) => void;
  acceptFriendRequest: (notificationId: string) => void;
  sendEncouragement: (friendId: string, message: string) => void;
  markNotificationAsRead: (id: string) => void;
  getUnreadNotificationsCount: () => number;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

export const SocialProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [leaderboard, setLeaderboard] = useState(initialLeaderboard);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setLoading(true);
      // In a real app, these would be API calls
      setTimeout(() => {
        // Get friends from the list of users based on user.friends array
        const userFriends = initialUsers.filter(u => 
          user.friends.includes(u.id) && u.id !== user.id
        );
        setFriends(userFriends);
        
        // Filter notifications for the current user
        setNotifications(initialNotifications.filter(n => n.userId === user.id));
        
        setLeaderboard(initialLeaderboard);
        setLoading(false);
      }, 500);
    }
  }, [user]);

  const sendFriendRequest = (userId: string) => {
    // This would be an API call in a real app
    console.log(`Friend request sent to user ${userId}`);
    // Add a simulated notification for demo
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      type: 'friend-request',
      content: `You sent a friend request to ${initialUsers.find(u => u.id === userId)?.name}`,
      read: false,
      createdAt: new Date(),
      userId: user?.id || '',
      data: {
        friendId: userId
      }
    };
    setNotifications([...notifications, newNotification]);
  };

  const acceptFriendRequest = (notificationId: string) => {
    // This would be an API call in a real app
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && notification.data?.friendId) {
      console.log(`Friend request accepted for user ${notification.data.friendId}`);
      // Mark the notification as read
      markNotificationAsRead(notificationId);
    }
  };

  const sendEncouragement = (friendId: string, message: string) => {
    // This would be an API call in a real app
    console.log(`Encouragement sent to ${friendId}: ${message}`);
    // Add a simulated notification for demo
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      type: 'encouragement',
      content: `You sent an encouragement to ${initialUsers.find(u => u.id === friendId)?.name}: "${message}"`,
      read: false,
      createdAt: new Date(),
      userId: user?.id || '',
      data: {
        friendId
      }
    };
    setNotifications([...notifications, newNotification]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(
      notifications.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const getUnreadNotificationsCount = () => {
    return notifications.filter(notification => !notification.read).length;
  };

  return (
    <SocialContext.Provider
      value={{
        friends,
        notifications,
        leaderboard,
        loading,
        sendFriendRequest,
        acceptFriendRequest,
        sendEncouragement,
        markNotificationAsRead,
        getUnreadNotificationsCount
      }}
    >
      {children}
    </SocialContext.Provider>
  );
};

export const useSocial = () => {
  const context = useContext(SocialContext);
  if (context === undefined) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
};