import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { 
  CheckSquare, 
  Circle, 
  Clock, 
  AlertTriangle,
  MoreVertical,
  Trash2,
  Edit,
  Play,
  Bot,
  Flame
} from 'lucide-react';
import { Task, Priority, TaskStatus } from '../../types/task';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import TaskAiSuggestion from './TaskAiSuggestion';

interface TaskItemProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit }) => {
  const { updateTaskStatus, deleteTask } = useTasks();
  const { getStreakStatus } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showAiHelp, setShowAiHelp] = useState(false);
  const [showStreakUpdate, setShowStreakUpdate] = useState(false);
  
  const handleStatusChange = (newStatus: TaskStatus) => {
    const wasCompleted = task.status === 'completed';
    const willBeCompleted = newStatus === 'completed';
    
    // Show streak animation when completing a task
    if (!wasCompleted && willBeCompleted) {
      setShowStreakUpdate(true);
      setTimeout(() => setShowStreakUpdate(false), 3000);
    }
    
    updateTaskStatus(task.id, newStatus);
  };
  
  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowMenu(false);
    }
  };

  const getPriorityLabel = (priority: Priority) => {
    switch(priority) {
      case 1: return 'Low';
      case 2: return 'Medium';
      case 3: return 'High';
      default: return 'Low';
    }
  };
  
  const getPriorityColor = (priority: Priority) => {
    switch(priority) {
      case 1: return 'bg-background-tertiary';
      case 2: return 'bg-warning';
      case 3: return 'bg-error';
      default: return 'bg-background-tertiary';
    }
  };
  
  const getStatusIcon = () => {
    switch(task.status) {
      case 'not-started':
        return <Circle size={18} className="text-text-secondary" aria-hidden="true" />;
      case 'in-progress':
        return <Clock size={18} className="text-warning" aria-hidden="true" />;
      case 'completed':
        return <CheckSquare size={18} className="text-success" aria-hidden="true" />;
      case 'overdue':
        return <AlertTriangle size={18} className="text-error" aria-hidden="true" />;
    }
  };
  
  const getStatusBadge = () => {
    switch(task.status) {
      case 'not-started':
        return 'bg-background-tertiary text-white';
      case 'in-progress':
        return 'bg-warning bg-opacity-20 text-warning';
      case 'completed':
        return 'bg-success bg-opacity-20 text-success';
      case 'overdue':
        return 'bg-error bg-opacity-20 text-error';
    }
  };
  
  const getStatusText = () => {
    switch(task.status) {
      case 'not-started': return 'Not Started';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'overdue': return 'Overdue';
    }
  };

  const streakData = getStreakStatus();
  const pointsForPriority = task.priority === 3 ? 30 : task.priority === 2 ? 20 : 10;
  const menuId = `task-menu-${task.id}`;

  return (
    <motion.article 
      className="bg-background-secondary rounded-lg p-4 shadow-md relative overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
    >
      {/* Streak update notification */}
      <AnimatePresence>
        {showStreakUpdate && (
          <motion.div 
            className="absolute top-0 left-0 right-0 bg-gradient-to-r from-accent to-purple-500 text-background p-2 flex items-center justify-center text-sm font-medium"
            initial={{ y: -40 }}
            animate={{ y: 0 }}
            exit={{ y: -40 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            role="status"
            aria-live="polite"
          >
            <Flame className="mr-2" size={16} aria-hidden="true" />
            <span>
              {streakData.current > 1 
                ? `Great work! Streak: ${streakData.current} days • +${pointsForPriority} points` 
                : `Streak started! • +${pointsForPriority} points`}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex items-start">
        <button 
          className="mt-1 mr-3 w-6 h-6 rounded-full flex items-center justify-center border border-accent hover:bg-accent hover:bg-opacity-20 transition-all"
          onClick={() => handleStatusChange(task.status === 'completed' ? 'not-started' : 'completed')}
          aria-label={task.status === 'completed' ? `Mark "${task.title}" as not started` : `Mark "${task.title}" as completed`}
          aria-pressed={task.status === 'completed'}
        >
          {task.status === 'completed' ? (
            <CheckSquare size={14} className="text-accent" aria-hidden="true" />
          ) : (
            <span className="w-3 h-3 rounded-full bg-accent bg-opacity-0 hover:bg-opacity-50 transition-colors" aria-hidden="true" />
          )}
        </button>
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-text-secondary' : 'text-white'}`}>
              {task.title}
            </h3>
            
            <div className="relative flex items-center">
              <button 
                className="p-1 text-text-secondary hover:text-white rounded-full hover:bg-background-tertiary mr-1"
                onClick={() => setShowAiHelp(!showAiHelp)}
                aria-label={showAiHelp ? "Hide AI assistance" : "Show AI assistance"}
                aria-expanded={showAiHelp}
              >
                <Bot size={16} className={showAiHelp ? "text-accent" : "text-text-secondary"} aria-hidden="true" />
              </button>
              
              <button 
                className="p-1 text-text-secondary hover:text-white rounded-full hover:bg-background-tertiary"
                onClick={() => setShowMenu(!showMenu)}
                aria-label="Task options"
                aria-haspopup="true"
                aria-expanded={showMenu}
                aria-controls={menuId}
              >
                <MoreVertical size={16} aria-hidden="true" />
              </button>
              
              {showMenu && (
                <div 
                  id={menuId}
                  className="absolute right-0 mt-1 w-36 bg-background shadow-lg rounded-lg z-10 py-1 border border-background-tertiary"
                  onMouseLeave={() => setShowMenu(false)}
                  onKeyDown={handleMenuKeyDown}
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="task-options-button"
                >
                  <button 
                    className="w-full text-left px-4 py-2 text-sm hover:bg-background-tertiary flex items-center"
                    onClick={() => {
                      setShowMenu(false);
                      if (onEdit) onEdit(task);
                    }}
                    role="menuitem"
                  >
                    <Edit size={14} className="mr-2" aria-hidden="true" />
                    Edit
                  </button>
                  {task.status !== 'in-progress' && (
                    <button 
                      className="w-full text-left px-4 py-2 text-sm hover:bg-background-tertiary flex items-center"
                      onClick={() => {
                        setShowMenu(false);
                        handleStatusChange('in-progress');
                      }}
                      role="menuitem"
                    >
                      <Play size={14} className="mr-2" aria-hidden="true" />
                      Start
                    </button>
                  )}
                  <button 
                    className="w-full text-left px-4 py-2 text-sm hover:bg-background-tertiary text-error flex items-center"
                    onClick={() => {
                      setShowMenu(false);
                      deleteTask(task.id);
                    }}
                    role="menuitem"
                  >
                    <Trash2 size={14} className="mr-2" aria-hidden="true" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {task.description && (
            <p className="text-sm text-text-secondary mt-1 mb-3">
              {task.description}
            </p>
          )}
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
              <div className={`text-xs px-2 py-1 rounded ${getStatusBadge()}`} role="status">
                {getStatusText()}
              </div>
              
              <div className={`text-xs px-2 py-1 rounded bg-background flex items-center space-x-1`}>
                <span className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} aria-hidden="true"></span>
                <span>Priority: {getPriorityLabel(task.priority)}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 text-xs text-text-secondary">
              <span><span className="sr-only">Estimated time:</span> {task.estimatedTime} min</span>
              <span><span className="sr-only">Due date:</span> {format(new Date(task.deadline), 'MMM d')}</span>
            </div>
          </div>
          
          {showAiHelp && <TaskAiSuggestion taskName={task.title} />}
        </div>
      </div>
    </motion.article>
  );
};

export default TaskItem;