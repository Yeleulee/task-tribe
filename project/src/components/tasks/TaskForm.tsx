import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Calendar, Clock, Flag, X } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { Task, Priority } from '../../types/task';
import { useNavigate } from 'react-router-dom';

interface TaskFormProps {
  editingTask?: Task;
  onCancel?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ editingTask, onCancel }) => {
  const { addTask, updateTask, projects } = useTasks();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState(editingTask?.title || '');
  const [description, setDescription] = useState(editingTask?.description || '');
  const [deadline, setDeadline] = useState(
    editingTask?.deadline 
      ? new Date(editingTask.deadline).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  );
  const [priority, setPriority] = useState<Priority>(editingTask?.priority || 1);
  const [estimatedTime, setEstimatedTime] = useState(editingTask?.estimatedTime || 30);
  const [projectId, setProjectId] = useState(editingTask?.projectId || projects[0]?.id);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }
    
    const taskData = {
      title,
      description,
      deadline: new Date(deadline),
      priority,
      estimatedTime,
      status: editingTask?.status || 'not-started',
      userId: user?.id || '',
      projectId: projectId || undefined
    };
    
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData as any);
    }
    
    if (onCancel) {
      onCancel();
    } else {
      navigate('/tasks');
    }
  };
  
  return (
    <motion.div 
      className="bg-background-secondary rounded-xl p-6 shadow-lg max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <CheckSquare className="text-accent" size={24} />
          <h2 className="text-xl font-semibold text-white">
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </h2>
        </div>
        
        {onCancel && (
          <button 
            onClick={onCancel}
            className="text-text-secondary hover:text-white p-2 rounded-full hover:bg-background-tertiary"
          >
            <X size={20} />
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-2">
            Task Title*
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full px-4 py-3 bg-background border border-background-tertiary rounded-lg text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details about this task..."
            className="w-full px-4 py-3 bg-background border border-background-tertiary rounded-lg text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent h-24 resize-none"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-text-secondary mb-2 flex items-center">
              <Calendar size={16} className="mr-2" />
              Deadline*
            </label>
            <input
              type="date"
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-background-tertiary rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>
          
          <div>
            <label htmlFor="estimatedTime" className="block text-sm font-medium text-text-secondary mb-2 flex items-center">
              <Clock size={16} className="mr-2" />
              Estimated Time (minutes)
            </label>
            <input
              type="number"
              id="estimatedTime"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(parseInt(e.target.value) || 0)}
              min="1"
              className="w-full px-4 py-3 bg-background border border-background-tertiary rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2 flex items-center">
              <Flag size={16} className="mr-2" />
              Priority
            </label>
            <div className="flex space-x-4">
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p as Priority)}
                  className={`
                    flex-1 py-2 rounded-lg border 
                    ${priority === p 
                      ? p === 1 
                        ? 'bg-background-tertiary border-background text-white' 
                        : p === 2 
                          ? 'bg-warning bg-opacity-20 border-warning text-warning' 
                          : 'bg-error bg-opacity-20 border-error text-error'
                      : 'border-background-tertiary text-text-secondary'
                    }
                  `}
                >
                  {p === 1 ? 'Low' : p === 2 ? 'Medium' : 'High'}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label htmlFor="project" className="block text-sm font-medium text-text-secondary mb-2">
              Project
            </label>
            <select
              id="project"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-background-tertiary rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">None</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={() => {
              if (onCancel) {
                onCancel();
              } else {
                navigate('/tasks');
              }
            }}
            className="flex-1 py-3 rounded-lg bg-background text-text-secondary hover:text-white transition-colors"
          >
            Cancel
          </button>
          <motion.button
            type="submit"
            className="flex-1 py-3 rounded-lg bg-accent text-text-accent font-medium hover:bg-accent-hover transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {editingTask ? 'Update Task' : 'Create Task'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default TaskForm;