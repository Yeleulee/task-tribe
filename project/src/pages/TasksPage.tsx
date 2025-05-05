import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, LayoutGrid, Filter } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import TaskItem from '../components/tasks/TaskItem';
import { Task, TaskStatus } from '../types/task';
import { useNavigate } from 'react-router-dom';

const TasksPage: React.FC = () => {
  const { tasks, projects } = useTasks();
  const navigate = useNavigate();
  
  const [view, setView] = useState<'all' | 'today' | 'upcoming'>('all');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [projectFilter, setProjectFilter] = useState<string | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<number | 'all'>('all');
  
  // Apply filters
  const filteredTasks = tasks.filter(task => {
    // Status filter
    if (statusFilter !== 'all' && task.status !== statusFilter) {
      return false;
    }
    
    // Project filter
    if (projectFilter !== 'all' && task.projectId !== projectFilter) {
      return false;
    }
    
    // Priority filter
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
      return false;
    }
    
    // View filter
    if (view === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const taskDate = new Date(task.deadline);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === today.getTime();
    }
    
    if (view === 'upcoming') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const taskDate = new Date(task.deadline);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() > today.getTime();
    }
    
    return true;
  });
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold">Your Tasks</h1>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-accent text-text-accent font-medium rounded-lg flex items-center"
          onClick={() => navigate('/tasks/new')}
        >
          <Plus size={18} className="mr-2" />
          New Task
        </motion.button>
      </div>
      
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-text-secondary mb-1">View</label>
          <div className="flex space-x-2">
            <button 
              className={`px-3 py-2 rounded-lg flex items-center text-sm ${
                view === 'all' 
                  ? 'bg-accent text-text-accent' 
                  : 'bg-background-secondary text-text-secondary hover:text-white'
              }`}
              onClick={() => setView('all')}
            >
              <LayoutGrid size={16} className="mr-2" />
              All
            </button>
            <button 
              className={`px-3 py-2 rounded-lg flex items-center text-sm ${
                view === 'today' 
                  ? 'bg-accent text-text-accent' 
                  : 'bg-background-secondary text-text-secondary hover:text-white'
              }`}
              onClick={() => setView('today')}
            >
              <Calendar size={16} className="mr-2" />
              Today
            </button>
            <button 
              className={`px-3 py-2 rounded-lg flex items-center text-sm ${
                view === 'upcoming' 
                  ? 'bg-accent text-text-accent' 
                  : 'bg-background-secondary text-text-secondary hover:text-white'
              }`}
              onClick={() => setView('upcoming')}
            >
              <Calendar size={16} className="mr-2" />
              Upcoming
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-xs text-text-secondary mb-1">Status</label>
          <select 
            className="w-full px-3 py-2 bg-background-secondary rounded-lg text-white border border-background-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
          >
            <option value="all">All Statuses</option>
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
        
        <div>
          <label className="block text-xs text-text-secondary mb-1">Project</label>
          <select 
            className="w-full px-3 py-2 bg-background-secondary rounded-lg text-white border border-background-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
          >
            <option value="all">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      {filteredTasks.length === 0 ? (
        <div className="bg-background-secondary rounded-lg p-8 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mx-auto w-16 h-16 bg-accent bg-opacity-10 rounded-full flex items-center justify-center mb-4">
              <Filter className="text-accent" size={24} />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No matching tasks</h3>
            <p className="text-text-secondary">
              Try adjusting your filters or create a new task to get started.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 px-4 py-2 bg-accent text-text-accent font-medium rounded-lg inline-flex items-center"
              onClick={() => navigate('/tasks/new')}
            >
              <Plus size={18} className="mr-2" />
              New Task
            </motion.button>
          </motion.div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onEdit={(task) => navigate(`/tasks/edit/${task.id}`)}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default TasksPage;