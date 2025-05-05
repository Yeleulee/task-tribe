import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSocial } from '../../context/SocialContext';
import { useAuth } from '../../context/AuthContext';

const LeaderboardPreview: React.FC = () => {
  const { leaderboard } = useSocial();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Get top 3 and current user position
  const topThree = leaderboard.slice(0, 3);
  const currentUserRank = leaderboard.findIndex(entry => entry.userId === user?.id) + 1;
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="bg-background-secondary rounded-xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Trophy className="text-accent mr-2" size={20} />
          <h2 className="text-lg font-semibold text-white">Leaderboard</h2>
        </div>
        <button 
          className="text-accent text-sm font-medium flex items-center"
          onClick={() => navigate('/dashboard/leaderboard')}
        >
          Full Rankings <ArrowRight size={16} className="ml-1" />
        </button>
      </div>
      
      <motion.div 
        className="space-y-2 mb-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {topThree.map((entry, index) => (
          <motion.div 
            key={entry.userId}
            className={`
              flex items-center p-3 rounded-lg
              ${entry.userId === user?.id ? 'bg-accent bg-opacity-10' : 'bg-background'}
            `}
            variants={itemVariants}
          >
            <div className="w-8 flex justify-center mr-3">
              {index === 0 ? (
                <span className="text-[#FFD700] font-bold">1st</span>
              ) : index === 1 ? (
                <span className="text-[#C0C0C0] font-bold">2nd</span>
              ) : (
                <span className="text-[#CD7F32] font-bold">3rd</span>
              )}
            </div>
            
            <img 
              src={entry.userAvatar} 
              alt={entry.userName}
              className="w-8 h-8 rounded-full object-cover border-2 border-background-tertiary"
            />
            
            <div className="ml-3 flex-1">
              <div className="flex justify-between items-center">
                <span className={`font-medium ${entry.userId === user?.id ? 'text-accent' : 'text-white'}`}>
                  {entry.userName}
                </span>
                <span className="font-bold text-accent">
                  {entry.points}
                </span>
              </div>
              
              <div className="flex justify-between items-center text-xs text-text-secondary mt-1">
                <span>Level {entry.level}</span>
                <span>{entry.streak} day streak</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {!topThree.some(entry => entry.userId === user?.id) && user && (
        <div className="mt-6 pt-4 border-t border-background-tertiary">
          <div className="flex items-center p-3 rounded-lg bg-background-tertiary bg-opacity-30">
            <div className="w-8 flex justify-center mr-3">
              <span className="font-medium">{currentUserRank}</span>
            </div>
            
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border-2 border-accent"
            />
            
            <div className="ml-3 flex-1">
              <div className="flex justify-between items-center">
                <span className="font-medium text-white">
                  You
                </span>
                <span className="font-bold text-accent">
                  {user.points}
                </span>
              </div>
              
              <div className="flex justify-between items-center text-xs text-text-secondary mt-1">
                <span>Level {user.level}</span>
                <span>{user.streak} day streak</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default LeaderboardPreview;