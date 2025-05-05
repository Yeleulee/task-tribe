import React from 'react';
import { motion } from 'framer-motion';
import ProgressSummary from '../components/dashboard/ProgressSummary';
import TasksOverview from '../components/dashboard/TasksOverview';
import StreakDisplay from '../components/dashboard/StreakDisplay';
import LeaderboardPreview from '../components/dashboard/LeaderboardPreview';
import AchievementList from '../components/dashboard/AchievementList';
import { useAuth } from '../context/AuthContext';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProgressSummary />
          <TasksOverview />
        </div>
        
        <div className="space-y-6">
          <StreakDisplay />
          <LeaderboardPreview />
        </div>
      </div>
      
      <div className="mt-6">
        <AchievementList />
      </div>
    </motion.div>
  );
};

export default DashboardPage;