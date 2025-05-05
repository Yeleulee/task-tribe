import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame } from 'lucide-react';
import { LeaderboardEntry } from '../../types/user';
import { useAuth } from '../../context/AuthContext';

interface LeaderboardItemProps {
  entry: LeaderboardEntry;
  rank: number;
}

const LeaderboardItem: React.FC<LeaderboardItemProps> = ({ entry, rank }) => {
  const { user } = useAuth();
  const isCurrentUser = entry.userId === user?.id;
  
  // Customize badge for top ranks
  const getRankBadge = () => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 flex items-center justify-center bg-[#FFD700] bg-opacity-20 rounded-full">
          <Trophy className="text-[#FFD700]" size={16} />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 flex items-center justify-center bg-[#C0C0C0] bg-opacity-20 rounded-full">
          <Trophy className="text-[#C0C0C0]" size={16} />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 flex items-center justify-center bg-[#CD7F32] bg-opacity-20 rounded-full">
          <Trophy className="text-[#CD7F32]" size={16} />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 flex items-center justify-center bg-background-tertiary rounded-full">
        <span className="text-sm font-medium">{rank}</span>
      </div>
    );
  };

  return (
    <motion.div 
      className={`
        p-4 rounded-lg flex items-center
        ${isCurrentUser 
          ? 'bg-accent bg-opacity-10 border border-accent border-opacity-30' 
          : 'bg-background-secondary'
        }
      `}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: rank * 0.05 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      <div className="mr-4">
        {getRankBadge()}
      </div>
      
      <img 
        src={entry.userAvatar}
        alt={entry.userName}
        className="w-10 h-10 rounded-full object-cover border-2 border-background"
      />
      
      <div className="ml-3 flex-1">
        <div className="flex items-center">
          <h3 className={`font-medium ${isCurrentUser ? 'text-accent' : 'text-white'}`}>
            {isCurrentUser ? 'You' : entry.userName}
          </h3>
          {isCurrentUser && (
            <span className="ml-2 text-xs bg-accent text-background px-2 py-0.5 rounded-full">
              You
            </span>
          )}
        </div>
        
        <div className="flex items-center mt-1 text-xs text-text-secondary">
          <span>Level {entry.level}</span>
          <span className="mx-2">•</span>
          <div className="flex items-center">
            <Flame size={12} className="mr-1 text-warning" />
            <span>{entry.streak} day streak</span>
          </div>
        </div>
      </div>
      
      <div className="text-right">
        <span className="text-xl font-bold text-accent">{entry.points}</span>
        <div className="text-xs text-text-secondary">points</div>
      </div>
    </motion.div>
  );
};

export default LeaderboardItem;