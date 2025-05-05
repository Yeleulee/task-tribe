import React from 'react';
import { motion } from 'framer-motion';
import { format, addDays, subDays, isSameDay } from 'date-fns';

const StreakCalendar: React.FC = () => {
  // This would come from the API in a real app
  // For demo purposes, we'll generate some random streak data
  const generateStreakData = () => {
    const today = new Date();
    const streakDays: Date[] = [];
    
    // Add 12 days of streak data (some might be missing to show gaps)
    for (let i = 13; i >= 0; i--) {
      const day = subDays(today, i);
      // Add most recent days, skip some older ones to create gaps in the streak
      if (i < 4 || Math.random() > 0.3) {
        streakDays.push(day);
      }
    }
    
    return streakDays;
  };
  
  const streakDays = generateStreakData();
  const today = new Date();
  
  // Get the last 7 days for the calendar
  const calendarDays = Array.from({ length: 7 }, (_, i) => 
    subDays(today, 6 - i)
  );
  
  const dayHasStreak = (date: Date) => 
    streakDays.some(streakDay => isSameDay(streakDay, date));
  
  const isToday = (date: Date) => 
    isSameDay(date, today);
  
  // Variables for next milestone
  const currentStreak = 12; // This would be calculated from the actual data
  const nextMilestone = Math.ceil(currentStreak / 10) * 10;
  const progressToMilestone = (currentStreak / nextMilestone) * 100;

  return (
    <motion.div 
      className="bg-background-secondary rounded-xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <h2 className="text-lg font-semibold text-white mb-6">Streak Calendar</h2>
      
      <div className="grid grid-cols-7 gap-2 mb-6">
        {calendarDays.map((date, index) => (
          <div key={index} className="flex flex-col items-center">
            <span className="text-xs text-text-secondary mb-2">
              {format(date, 'EEE')}
            </span>
            <motion.div 
              className={`
                w-10 h-10 rounded-full flex items-center justify-center
                ${isToday(date) 
                  ? 'border-2 border-accent' 
                  : 'border border-background-tertiary'
                }
                ${dayHasStreak(date) 
                  ? 'bg-accent bg-opacity-20' 
                  : 'bg-background'
                }
              `}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <span className={`
                text-sm font-medium
                ${dayHasStreak(date) ? 'text-accent' : 'text-text-secondary'}
              `}>
                {format(date, 'd')}
              </span>
            </motion.div>
          </div>
        ))}
      </div>
      
      <div className="bg-background rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Current Streak</span>
          <span className="text-accent font-bold">{currentStreak} days</span>
        </div>
        
        <div className="h-2 bg-background-tertiary rounded-full mb-2 overflow-hidden">
          <motion.div 
            className="h-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progressToMilestone}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        
        <div className="text-xs text-text-secondary text-right">
          Next milestone: {nextMilestone} days
        </div>
      </div>
    </motion.div>
  );
};

export default StreakCalendar;