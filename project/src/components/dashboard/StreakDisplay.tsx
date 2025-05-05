import React from 'react';
import { Flame, Award, Calendar, CheckSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { motion } from 'framer-motion';

const StreakDisplay: React.FC = () => {
  const { user, getStreakStatus } = useAuth();
  const { getTasksCompletedToday, getCompletionStats } = useTasks();
  
  const streakData = getStreakStatus();
  const tasksToday = getTasksCompletedToday().length;
  const stats = getCompletionStats();
  
  // Determine if the streak is at risk (no tasks completed today)
  const isStreakAtRisk = streakData.current > 0 && tasksToday === 0;
  
  // Generate the last 7 days of streak history (filled circles for active days)
  const generateStreakHistory = () => {
    if (!streakData.lastUpdated) return Array(7).fill(false);
    
    const lastUpdated = new Date(streakData.lastUpdated);
    const history = [];
    const streakCount = Math.min(streakData.current, 7);
    
    // Start with today or yesterday if streak was updated yesterday
    let currentDay = new Date();
    if (tasksToday === 0) {
      // No tasks today, so start with yesterday
      currentDay.setDate(currentDay.getDate() - 1);
    }
    
    // Fill active days
    for (let i = 0; i < streakCount; i++) {
      history.push(true);
      
      if (i < streakCount - 1) {
        // Move back one day
        currentDay.setDate(currentDay.getDate() - 1);
      }
    }
    
    // Fill the rest with inactive days
    while (history.length < 7) {
      history.push(false);
    }
    
    return history;
  };
  
  const streakHistory = generateStreakHistory();

  return (
    <div className="bg-background-secondary rounded-xl p-5 border border-background-tertiary shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Productivity Streak</h3>
        <div className="bg-background-tertiary rounded-lg p-1.5">
          <Flame className={`${streakData.current > 0 ? 'text-orange-500' : 'text-text-secondary'}`} size={20} />
        </div>
      </div>
      
      <div className="flex items-center mb-6">
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className={`text-4xl font-bold mr-3 ${isStreakAtRisk ? 'text-orange-500' : 'text-white'}`}
        >
          {streakData.current}
        </motion.div>
        <div>
          <div className="text-sm text-text-secondary">Days in a row</div>
          {isStreakAtRisk && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs text-orange-500 font-medium mt-1"
            >
              Complete a task today to maintain your streak!
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Streak visualization - Last 7 days */}
      <div className="mb-5">
        <div className="text-xs text-text-secondary mb-2">Last 7 days</div>
        <div className="flex space-x-2">
          {streakHistory.reverse().map((active, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`h-3 w-3 rounded-full ${
                active ? 'bg-accent' : 'bg-background-tertiary'
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-background rounded-lg p-3 border border-background-tertiary">
          <div className="flex items-center">
            <CheckSquare size={16} className="text-accent mr-2" />
            <span className="text-xs text-text-secondary">Today</span>
          </div>
          <div className="text-lg font-semibold mt-1">{stats.today} tasks</div>
        </div>
        
        <div className="bg-background rounded-lg p-3 border border-background-tertiary">
          <div className="flex items-center">
            <Calendar size={16} className="text-accent mr-2" />
            <span className="text-xs text-text-secondary">This Week</span>
          </div>
          <div className="text-lg font-semibold mt-1">{stats.week} tasks</div>
        </div>
      </div>
      
      {/* Award message for significant streaks */}
      {streakData.current >= 7 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 flex items-center bg-accent/10 p-3 rounded-lg"
        >
          <Award className="text-accent mr-2" size={18} />
          <div className="text-sm">
            <span className="font-medium">Great job!</span> You've maintained your streak for 
            {streakData.current >= 30 ? ' a month' : streakData.current >= 14 ? ' two weeks' : ' a week'}!
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StreakDisplay; 