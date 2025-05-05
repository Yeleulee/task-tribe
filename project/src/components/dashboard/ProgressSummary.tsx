import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Flame,
  ArrowUp,
  BarChart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';

const ProgressSummary: React.FC = () => {
  const { user } = useAuth();
  const { tasks } = useTasks();
  
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const overdueTasks = tasks.filter(task => task.status === 'overdue').length;
  const totalTasks = tasks.length;
  
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };
  
  const progressVariants = {
    initial: { width: '0%' },
    animate: { width: `${completionRate}%`, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  return (
    <motion.div 
      className="bg-background-secondary rounded-xl p-6 shadow-lg"
      initial="initial"
      animate="animate"
      variants={cardVariants}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Progress Summary</h2>
        <div className="flex items-center space-x-1 bg-background rounded-full px-3 py-1">
          <Flame className="text-accent" size={16} />
          <span className="text-sm font-medium">{user?.streak || 0} day streak</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-background rounded-lg p-4 flex items-center space-x-4">
          <div className="bg-success bg-opacity-20 p-3 rounded-lg">
            <CheckCircle2 className="text-success" size={20} />
          </div>
          <div>
            <p className="text-sm text-text-secondary">Completed</p>
            <p className="text-xl font-bold">{completedTasks}</p>
          </div>
        </div>
        
        <div className="bg-background rounded-lg p-4 flex items-center space-x-4">
          <div className="bg-warning bg-opacity-20 p-3 rounded-lg">
            <Clock className="text-warning" size={20} />
          </div>
          <div>
            <p className="text-sm text-text-secondary">In Progress</p>
            <p className="text-xl font-bold">{inProgressTasks}</p>
          </div>
        </div>
        
        <div className="bg-background rounded-lg p-4 flex items-center space-x-4">
          <div className="bg-error bg-opacity-20 p-3 rounded-lg">
            <AlertCircle className="text-error" size={20} />
          </div>
          <div>
            <p className="text-sm text-text-secondary">Overdue</p>
            <p className="text-xl font-bold">{overdueTasks}</p>
          </div>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between mb-2">
          <div className="flex items-center space-x-2">
            <BarChart className="text-accent" size={18} />
            <span className="font-medium">Task Completion Rate</span>
          </div>
          <div className="flex items-center space-x-1">
            <ArrowUp className={completionRate >= 50 ? "text-success" : "text-error"} size={16} />
            <span className={`font-bold ${completionRate >= 50 ? "text-success" : "text-error"}`}>
              {completionRate}%
            </span>
          </div>
        </div>
        
        <div className="h-2 bg-background rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-accent"
            variants={progressVariants}
            initial="initial"
            animate="animate"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ProgressSummary;