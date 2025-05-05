export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: Date;
  level: number;
  points: number;
  streak: number;
  friends: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  userId: string;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  userAvatar: string;
  points: number;
  streak: number;
  level: number;
  rank: number;
}