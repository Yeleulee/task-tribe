import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Task, TaskStatus, Priority, Project } from '../types/task';
import { tasks as initialTasks, projects as initialProjects } from '../utils/mockData';
import { useAuth } from './AuthContext';

interface TaskContextType {
  tasks: Task[];
  projects: Project[];
  loading: boolean;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  getTasksByProject: (projectId: string) => Task[];
  getTasksByStatus: (status: TaskStatus) => Task[];
  getTasksByPriority: (priority: Priority) => Task[];
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  getTasksCompletedToday: () => Task[];
  getCompletionStats: () => { today: number; week: number; month: number; total: number };
  getStreak: () => number | null;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const { updateStreak, addPoints, user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [loading, setLoading] = useState<boolean>(false);

  // Simulating API fetch
  useEffect(() => {
    setLoading(true);
    // In a real app, we would fetch from an API
    setTimeout(() => {
      setTasks(initialTasks);
      setProjects(initialProjects);
      setLoading(false);
    }, 500);
  }, []);

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const existingTask = tasks.find(task => task.id === id);
    const wasCompleted = existingTask?.status === 'completed';
    const isNowCompleted = updates.status === 'completed';
    
    // If task is being set to completed for the first time
    if (!wasCompleted && isNowCompleted) {
      // Update streak with completion date
      updateStreak(new Date());
      
      // Award points based on priority
      if (existingTask) {
        const pointsToAward = existingTask.priority === 3 ? 30 : 
                             existingTask.priority === 2 ? 20 : 10;
        addPoints(pointsToAward);
      }
    }

    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    updateTask(id, { status });
  };

  const getTasksByProject = (projectId: string) => {
    return tasks.filter((task) => task.projectId === projectId);
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  const getTasksByPriority = (priority: Priority) => {
    return tasks.filter((task) => task.priority === priority);
  };

  const addProject = (project: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...project,
      id: `project-${Date.now()}`,
      createdAt: new Date()
    };
    setProjects([...projects, newProject]);
  };

  const getTasksCompletedToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return tasks.filter(task => 
      task.status === 'completed' && 
      task.updatedAt >= today && 
      task.updatedAt < tomorrow
    );
  };

  const getCompletionStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const completedTasks = tasks.filter(task => task.status === 'completed');
    
    return {
      today: completedTasks.filter(task => 
        task.updatedAt >= today
      ).length,
      week: completedTasks.filter(task => 
        task.updatedAt >= weekStart
      ).length,
      month: completedTasks.filter(task => 
        task.updatedAt >= monthStart
      ).length,
      total: completedTasks.length
    };
  };

  const getStreak = () => {
    return user ? user.streak : null;
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        projects,
        loading,
        addTask,
        updateTask,
        deleteTask,
        updateTaskStatus,
        getTasksByProject,
        getTasksByStatus,
        getTasksByPriority,
        addProject,
        getTasksCompletedToday,
        getCompletionStats,
        getStreak
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};