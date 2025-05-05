export type Priority = 1 | 2 | 3;

export type TaskStatus = 'not-started' | 'in-progress' | 'completed' | 'overdue';

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  priority: Priority;
  estimatedTime: number; // in minutes
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  projectId?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  userId: string;
  createdAt: Date;
}