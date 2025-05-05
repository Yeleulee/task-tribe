import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types/user';
import { currentUser } from '../utils/mockData';
import { isToday, isYesterday, differenceInCalendarDays } from 'date-fns';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateStreak: (taskCompletionDate: Date) => void;
  resetStreak: () => void;
  getStreakStatus: () => { current: number; lastUpdated: Date | null };
  addPoints: (points: number) => void;
}

interface StreakData {
  lastUpdated: Date | null;
  current: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STREAK_KEY = 'tasktribe_streak_data';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(currentUser); // Auto-logged in for demo
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Auto-authenticated for demo
  const [streakData, setStreakData] = useState<StreakData>(() => {
    // Try to load streak data from localStorage
    const savedData = localStorage.getItem(STREAK_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        return {
          lastUpdated: parsed.lastUpdated ? new Date(parsed.lastUpdated) : null,
          current: parsed.current || 0
        };
      } catch (e) {
        return { lastUpdated: null, current: 0 };
      }
    }
    return { lastUpdated: null, current: 0 };
  });

  // Update localStorage when streak data changes
  useEffect(() => {
    localStorage.setItem(STREAK_KEY, JSON.stringify(streakData));
  }, [streakData]);

  // Check streak status on load
  useEffect(() => {
    if (user && streakData.lastUpdated) {
      // If last update wasn't today or yesterday, check if streak should be reset
      if (!isToday(streakData.lastUpdated) && !isYesterday(streakData.lastUpdated)) {
        const daysSinceLastUpdate = differenceInCalendarDays(new Date(), streakData.lastUpdated);
        if (daysSinceLastUpdate > 1) {
          // More than 1 day has passed, reset streak
          resetStreak();
        }
      }
      
      // Update user object with current streak
      updateUserStreak(streakData.current);
    }
  }, []);

  const updateUserStreak = (streakCount: number) => {
    if (user) {
      setUser({
        ...user,
        streak: streakCount
      });
    }
  };

  const updateStreak = (taskCompletionDate: Date) => {
    if (!user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const completionDay = new Date(taskCompletionDate);
    completionDay.setHours(0, 0, 0, 0);
    
    // Only process if task was completed today
    if (completionDay.getTime() !== today.getTime()) return;
    
    // Check the last streak update date
    if (streakData.lastUpdated) {
      const lastUpdate = new Date(streakData.lastUpdated);
      lastUpdate.setHours(0, 0, 0, 0);
      
      if (lastUpdate.getTime() === today.getTime()) {
        // Already updated today, do nothing
        return;
      }

      if (isYesterday(lastUpdate)) {
        // Streak continues
        const newStreakCount = streakData.current + 1;
        setStreakData({
          lastUpdated: today,
          current: newStreakCount
        });
        updateUserStreak(newStreakCount);
      } else {
        // Streak broken, start new streak at 1
        setStreakData({
          lastUpdated: today,
          current: 1
        });
        updateUserStreak(1);
      }
    } else {
      // First time updating streak
      setStreakData({
        lastUpdated: today,
        current: 1
      });
      updateUserStreak(1);
    }
  };

  const resetStreak = () => {
    setStreakData({
      lastUpdated: null,
      current: 0
    });
    
    if (user) {
      updateUserStreak(0);
    }
  };

  const getStreakStatus = () => {
    return {
      current: streakData.current,
      lastUpdated: streakData.lastUpdated
    };
  };

  const addPoints = (points: number) => {
    if (user) {
      const newPoints = user.points + points;
      // Simple level calculation (every 100 points = 1 level)
      const newLevel = Math.floor(newPoints / 100);
      
      setUser({
        ...user,
        points: newPoints,
        level: newLevel
      });
    }
  };

  const login = async (email: string, password: string) => {
    // Simulating API call
    try {
      // In a real app, we would validate credentials against a backend
      setUser(currentUser);
      setIsAuthenticated(true);
      
      // Initialize streak data if it doesn't exist
      if (!streakData.lastUpdated) {
        setStreakData({
          lastUpdated: new Date(),
          current: currentUser.streak || 0
        });
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      logout, 
      updateStreak, 
      resetStreak, 
      getStreakStatus,
      addPoints
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};