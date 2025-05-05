import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckSquare,
  Circle,
  Clock,
  ArrowRight, 
  AlertTriangle
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { format } from 'date-fns';
import { Task } from '../../types/task';
import { useNavigate } from 'react-router-dom';

const TasksOverview: React.FC = () => {
  const { tasks, updateTaskStatus } = useTasks();
  const navigate = useNavigate();
  
  // Get today's tasks (due today or overdue)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const urgentTasks = tasks.filter(task => 
    (task.status === 'not-started' || task.status === 'in-progress' || task.status === 'overdue') &&
    (new Date(task.deadline) <= new Date() || task.priority === 3)
  ).slice(0, 3);
  
  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    updateTaskStatus(taskId, newStatus);
  };
  
  // Status icon mapping
  const getStatusIcon = (status: Task['status']) => {
    switch(status) {
      case 'not-started':
        return <Circle size={16} className="text-text-secondary" />;
      case 'in-progress':
        return <Clock size={16} className="text-warning" />;
      case 'completed':
        return <CheckSquare size={16} className="text-success" />;
      case 'overdue':
        return <AlertTriangle size={16} className="text-error" />;
    }
  };
  
  // Priority indicator
  const getPriorityIndicator = (priority: number) => {
    const colors = {
      1: 'bg-background-tertiary',
      2: 'bg-warning',
      3: 'bg-error'
    };
    
    return (
      <div className="flex space-x-1">
        <div className={`w-2 h-2 rounded-full ${colors[priority as keyof typeof colors]}`}></div>
        {priority > 1 && <div className={`w-2 h-2 rounded-full ${colors[priority as keyof typeof colors]}`}></div>}
        {priority > 2 && <div className={`w-2 h-2 rounded-full ${colors[priority as keyof typeof colors]}`}></div>}
      </div>
    );
  };

  return (
    <motion.div 
      className="bg-background-secondary rounded-xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-white">Urgent Tasks</h2>
        <button 
          className="text-accent text-sm font-medium flex items-center"
          onClick={() => navigate('/dashboard/tasks')}
        >
          View All <ArrowRight size={16} className="ml-1" />
        </button>
      </div>
      
      {urgentTasks.length === 0 ? (
        <div className="bg-background rounded-lg p-8 text-center">
          <p className="text-text-secondary">No urgent tasks for today!</p>
          <p className="text-sm text-text-secondary mt-2">Great job staying on top of things.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {urgentTasks.map((task, index) => (
            <motion.div 
              key={task.id}
              className="bg-background rounded-lg p-4 flex items-start"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <div className="mr-3 mt-1">
                <button 
                  className="w-5 h-5 rounded-full border border-accent flex items-center justify-center hover:bg-accent hover:bg-opacity-20 transition-colors"
                  onClick={() => handleStatusChange(
                    task.id, 
                    task.status === 'completed' ? 'not-started' : 'completed'
                  )}
                >
                  {task.status === 'completed' ? (
                    <CheckSquare size={12} className="text-accent" />
                  ) : (
                    <span></span>
                  )}
                </button>
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-text-secondary' : ''}`}>
                    {task.title}
                  </h3>
                  {getPriorityIndicator(task.priority)}
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(task.status)}
                    <span className="text-xs text-text-secondary">
                      Due {format(new Date(task.deadline), 'MMM d')}
                    </span>
                  </div>
                  
                  <span className="text-xs px-2 py-1 rounded bg-background-tertiary">
                    {task.estimatedTime} min
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-4 bg-accent text-text-accent font-medium py-3 rounded-lg hover:bg-accent-hover transition-colors flex items-center justify-center"
        onClick={() => navigate('/dashboard/tasks/new')}
      >
        <CheckSquare size={16} className="mr-2" />
        Create New Task
      </motion.button>
    </motion.div>
  );
};

export default TasksOverview;