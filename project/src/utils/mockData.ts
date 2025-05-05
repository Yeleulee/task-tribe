import { Task, Priority, TaskStatus, Project } from '../types/task';
import { User, Achievement, LeaderboardEntry } from '../types/user';
import { Notification } from '../types/notification';
import { addDays, subDays } from 'date-fns';

// Current user
export const currentUser: User = {
  id: 'user-1',
  name: 'Alex Morgan',
  email: 'alex@example.com',
  avatar: 'https://images.pexels.com/photos/6954169/pexels-photo-6954169.jpeg?auto=compress&cs=tinysrgb&w=150',
  createdAt: new Date('2023-01-15'),
  level: 8,
  points: 1250,
  streak: 12,
  friends: ['user-2', 'user-3', 'user-4']
};

// Users
export const users: User[] = [
  currentUser,
  {
    id: 'user-2',
    name: 'Jordan Smith',
    email: 'jordan@example.com',
    avatar: 'https://images.pexels.com/photos/3760778/pexels-photo-3760778.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: new Date('2023-01-18'),
    level: 9,
    points: 1450,
    streak: 21,
    friends: ['user-1', 'user-3']
  },
  {
    id: 'user-3',
    name: 'Taylor Reed',
    email: 'taylor@example.com',
    avatar: 'https://images.pexels.com/photos/11331587/pexels-photo-11331587.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: new Date('2023-02-10'),
    level: 7,
    points: 980,
    streak: 5,
    friends: ['user-1', 'user-2']
  },
  {
    id: 'user-4',
    name: 'Casey Dwyer',
    email: 'casey@example.com',
    avatar: 'https://images.pexels.com/photos/5393594/pexels-photo-5393594.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: new Date('2023-03-05'),
    level: 12,
    points: 2100,
    streak: 32,
    friends: ['user-1']
  }
];

// Projects
export const projects: Project[] = [
  {
    id: 'project-1',
    name: 'Work',
    description: 'Professional tasks and deadlines',
    color: '#FF5733',
    userId: 'user-1',
    createdAt: new Date('2023-03-10')
  },
  {
    id: 'project-2',
    name: 'Personal',
    description: 'Self-improvement and personal goals',
    color: '#33A1FF',
    userId: 'user-1',
    createdAt: new Date('2023-03-12')
  },
  {
    id: 'project-3',
    name: 'Health',
    description: 'Fitness and wellness goals',
    color: '#4CAF50',
    userId: 'user-1',
    createdAt: new Date('2023-04-05')
  }
];

// Tasks
export const tasks: Task[] = [
  {
    id: 'task-1',
    title: 'Complete quarterly report',
    description: 'Finalize Q1 financial analysis and submit to leadership',
    deadline: addDays(new Date(), 2),
    priority: 3 as Priority,
    estimatedTime: 120,
    status: 'in-progress' as TaskStatus,
    createdAt: subDays(new Date(), 5),
    updatedAt: subDays(new Date(), 1),
    userId: 'user-1',
    projectId: 'project-1'
  },
  {
    id: 'task-2',
    title: 'Daily meditation',
    description: '15 minutes of guided meditation',
    deadline: new Date(),
    priority: 2 as Priority,
    estimatedTime: 15,
    status: 'not-started' as TaskStatus,
    createdAt: subDays(new Date(), 7),
    updatedAt: subDays(new Date(), 7),
    userId: 'user-1',
    projectId: 'project-2'
  },
  {
    id: 'task-3',
    title: 'Weekly team sync',
    description: 'Update team on project status',
    deadline: addDays(new Date(), 1),
    priority: 2 as Priority,
    estimatedTime: 60,
    status: 'not-started' as TaskStatus,
    createdAt: subDays(new Date(), 3),
    updatedAt: subDays(new Date(), 3),
    userId: 'user-1',
    projectId: 'project-1'
  },
  {
    id: 'task-4',
    title: 'Morning run',
    description: '5km run around the park',
    deadline: addDays(new Date(), 1),
    priority: 1 as Priority,
    estimatedTime: 40,
    status: 'not-started' as TaskStatus,
    createdAt: subDays(new Date(), 1),
    updatedAt: subDays(new Date(), 1),
    userId: 'user-1',
    projectId: 'project-3'
  },
  {
    id: 'task-5',
    title: 'Read 30 pages',
    description: 'Continue with current book',
    deadline: new Date(),
    priority: 1 as Priority,
    estimatedTime: 45,
    status: 'completed' as TaskStatus,
    createdAt: subDays(new Date(), 10),
    updatedAt: subDays(new Date(), 1),
    userId: 'user-1',
    projectId: 'project-2'
  },
  {
    id: 'task-6',
    title: 'Client proposal',
    description: 'Draft new business proposal for client XYZ',
    deadline: subDays(new Date(), 1),
    priority: 3 as Priority,
    estimatedTime: 180,
    status: 'overdue' as TaskStatus,
    createdAt: subDays(new Date(), 8),
    updatedAt: subDays(new Date(), 1),
    userId: 'user-1',
    projectId: 'project-1'
  }
];

// Achievements
export const achievements: Achievement[] = [
  {
    id: 'achievement-1',
    title: 'First Steps',
    description: 'Complete your first task',
    icon: 'award',
    unlockedAt: subDays(new Date(), 10),
    userId: 'user-1'
  },
  {
    id: 'achievement-2',
    title: 'On A Roll',
    description: 'Maintain a 7-day streak',
    icon: 'flame',
    unlockedAt: subDays(new Date(), 5),
    userId: 'user-1'
  },
  {
    id: 'achievement-3',
    title: 'Task Master',
    description: 'Complete 10 high-priority tasks',
    icon: 'trophy',
    userId: 'user-1'
  },
  {
    id: 'achievement-4',
    title: 'Social Butterfly',
    description: 'Connect with 3 accountability partners',
    icon: 'users',
    unlockedAt: subDays(new Date(), 3),
    userId: 'user-1'
  }
];

// Notifications
export const notifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'task-reminder',
    content: 'Your task "Complete quarterly report" is due tomorrow!',
    read: false,
    createdAt: new Date(),
    userId: 'user-1',
    data: {
      taskId: 'task-1'
    }
  },
  {
    id: 'notif-2',
    type: 'encouragement',
    content: 'Jordan sent you an encouragement: "You\'re doing great with your streak!"',
    read: false,
    createdAt: subDays(new Date(), 1),
    userId: 'user-1',
    data: {
      friendId: 'user-2'
    }
  },
  {
    id: 'notif-3',
    type: 'achievement-unlocked',
    content: 'Achievement unlocked: "On A Roll"',
    read: true,
    createdAt: subDays(new Date(), 5),
    userId: 'user-1',
    data: {
      achievementId: 'achievement-2'
    }
  }
];

// Leaderboard
export const leaderboard: LeaderboardEntry[] = [
  {
    userId: 'user-4',
    userName: 'Casey Dwyer',
    userAvatar: 'https://images.pexels.com/photos/5393594/pexels-photo-5393594.jpeg?auto=compress&cs=tinysrgb&w=150',
    points: 2100,
    streak: 32,
    level: 12,
    rank: 1
  },
  {
    userId: 'user-2',
    userName: 'Jordan Smith',
    userAvatar: 'https://images.pexels.com/photos/3760778/pexels-photo-3760778.jpeg?auto=compress&cs=tinysrgb&w=150',
    points: 1450,
    streak: 21,
    level: 9,
    rank: 2
  },
  {
    userId: 'user-1',
    userName: 'Alex Morgan',
    userAvatar: 'https://images.pexels.com/photos/6954169/pexels-photo-6954169.jpeg?auto=compress&cs=tinysrgb&w=150',
    points: 1250,
    streak: 12,
    level: 8,
    rank: 3
  },
  {
    userId: 'user-3',
    userName: 'Taylor Reed',
    userAvatar: 'https://images.pexels.com/photos/11331587/pexels-photo-11331587.jpeg?auto=compress&cs=tinysrgb&w=150',
    points: 980,
    streak: 5,
    level: 7,
    rank: 4
  }
];