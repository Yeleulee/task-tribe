export type NotificationType = 
  | 'friend-request'
  | 'friend-accepted'
  | 'task-reminder'
  | 'task-completed'
  | 'achievement-unlocked'
  | 'level-up'
  | 'encouragement';

export interface Notification {
  id: string;
  type: NotificationType;
  content: string;
  read: boolean;
  createdAt: Date;
  userId: string;
  data?: {
    taskId?: string;
    friendId?: string;
    achievementId?: string;
  };
}