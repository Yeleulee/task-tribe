import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart2, 
  Calendar, 
  TrendingUp, 
  Clock, 
  CheckSquare,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';

const StatsPage: React.FC = () => {
  const { user } = useAuth();
  const { tasks } = useTasks();
  
  // In a real app, these would come from the API
  // Here we're just calculating some stats based on the mock data
  
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const highPriorityCompleted = tasks.filter(task => task.status === 'completed' && task.priority === 3).length;
  const highPriorityTotal = tasks.filter(task => task.priority === 3).length;
  const highPriorityRate = highPriorityTotal > 0 ? Math.round((highPriorityCompleted / highPriorityTotal) * 100) : 0;
  
  const overdueTasks = tasks.filter(task => task.status === 'overdue').length;
  const overdueRate = totalTasks > 0 ? Math.round((overdueTasks / totalTasks) * 100) : 0;
  
  const estimatedTime = tasks.reduce((total, task) => total + task.estimatedTime, 0);
  const completedTime = tasks
    .filter(task => task.status === 'completed')
    .reduce((total, task) => total + task.estimatedTime, 0);
  
  // Weekly completion data - in a real app, this would come from the API
  const weeklyData = [
    { day: 'Mon', completed: 3 },
    { day: 'Tue', completed: 5 },
    { day: 'Wed', completed: 2 },
    { day: 'Thu', completed: 7 },
    { day: 'Fri', completed: 4 },
    { day: 'Sat', completed: 1 },
    { day: 'Sun', completed: 0 }
  ];
  
  const maxCompleted = Math.max(...weeklyData.map(d => d.completed));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <BarChart2 className="mr-3 text-accent" size={24} />
        Performance Statistics
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div 
          className="bg-background-secondary rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-success bg-opacity-20 p-2 rounded-lg">
              <CheckSquare className="text-success" size={20} />
            </div>
            <h3 className="font-medium">Completion Rate</h3>
          </div>
          
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold">{completionRate}%</span>
            <span className="text-text-secondary text-sm">of tasks completed</span>
          </div>
          
          <div className="h-2 bg-background rounded-full mt-3 overflow-hidden">
            <motion.div 
              className="h-full bg-success"
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            />
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-background-secondary rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-warning bg-opacity-20 p-2 rounded-lg">
              <TrendingUp className="text-warning" size={20} />
            </div>
            <h3 className="font-medium">High Priority</h3>
          </div>
          
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold">{highPriorityRate}%</span>
            <span className="text-text-secondary text-sm">high priority completed</span>
          </div>
          
          <div className="h-2 bg-background rounded-full mt-3 overflow-hidden">
            <motion.div 
              className="h-full bg-warning"
              initial={{ width: 0 }}
              animate={{ width: `${highPriorityRate}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
            />
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-background-secondary rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-error bg-opacity-20 p-2 rounded-lg">
              <AlertTriangle className="text-error" size={20} />
            </div>
            <h3 className="font-medium">Overdue Rate</h3>
          </div>
          
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold">{overdueRate}%</span>
            <span className="text-text-secondary text-sm">tasks overdue</span>
          </div>
          
          <div className="h-2 bg-background rounded-full mt-3 overflow-hidden">
            <motion.div 
              className="h-full bg-error"
              initial={{ width: 0 }}
              animate={{ width: `${overdueRate}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.7 }}
            />
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-background-secondary rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-accent bg-opacity-20 p-2 rounded-lg">
              <Clock className="text-accent" size={20} />
            </div>
            <h3 className="font-medium">Time Invested</h3>
          </div>
          
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold">{completedTime} min</span>
            <span className="text-text-secondary text-sm">of {estimatedTime} min</span>
          </div>
          
          <div className="h-2 bg-background rounded-full mt-3 overflow-hidden">
            <motion.div 
              className="h-full bg-accent"
              initial={{ width: 0 }}
              animate={{ width: `${(completedTime / (estimatedTime || 1)) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
            />
          </div>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          className="bg-background-secondary rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold mb-6 flex items-center">
            <Calendar className="mr-2 text-accent" size={20} />
            Weekly Completion
          </h2>
          
          <div className="flex items-end h-40 space-x-2">
            {weeklyData.map((data, i) => (
              <div key={data.day} className="flex-1 flex flex-col items-center">
                <motion.div 
                  className="w-full bg-accent bg-opacity-30 rounded-t-md"
                  style={{ 
                    height: maxCompleted > 0 ? `${(data.completed / maxCompleted) * 100}%` : '0%'
                  }}
                  initial={{ height: 0 }}
                  animate={{ 
                    height: maxCompleted > 0 ? `${(data.completed / maxCompleted) * 100}%` : '0%' 
                  }}
                  transition={{ duration: 0.7, delay: 0.3 + (i * 0.1) }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xs font-medium">
                      {data.completed}
                    </span>
                  </div>
                </motion.div>
                <span className="text-xs text-text-secondary mt-2">{data.day}</span>
              </div>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-background-secondary rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold mb-6 flex items-center">
            <TrendingUp className="mr-2 text-accent" size={20} />
            Productivity Metrics
          </h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-text-secondary">Daily Average</span>
                <span className="text-sm font-medium">3.2 tasks</span>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-success"
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-text-secondary">Streak Consistency</span>
                <span className="text-sm font-medium">85%</span>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-accent"
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-text-secondary">Focus Time</span>
                <span className="text-sm font-medium">72%</span>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-warning"
                  initial={{ width: 0 }}
                  animate={{ width: '72%' }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.7 }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-text-secondary">Deadline Accuracy</span>
                <span className="text-sm font-medium">90%</span>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-success"
                  initial={{ width: 0 }}
                  animate={{ width: '90%' }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StatsPage;