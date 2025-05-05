import React from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  Flame, 
  Trophy, 
  Users, 
  CheckSquare,
  Calendar,
  Clock,
  AlertCircle,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Achievement } from '../../types/user';
import { achievements as mockAchievements } from '../../utils/mockData';

const AchievementList: React.FC = () => {
  const { user } = useAuth();
  
  // Normally this would come from user data through an API
  const achievements = mockAchievements;
  
  const getAchievementIcon = (icon: string) => {
    switch(icon) {
      case 'award': return <Award size={20} />;
      case 'flame': return <Flame size={20} />;
      case 'trophy': return <Trophy size={20} />;
      case 'users': return <Users size={20} />;
      case 'check-square': return <CheckSquare size={20} />;
      case 'calendar': return <Calendar size={20} />;
      case 'clock': return <Clock size={20} />;
      case 'alert-circle': return <AlertCircle size={20} />;
      default: return <Award size={20} />;
    }
  };

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
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="bg-background-secondary rounded-xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <h2 className="text-lg font-semibold text-white mb-6">Achievements</h2>
      
      <motion.div 
        className="grid grid-cols-2 gap-3"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {achievements.map(achievement => (
          <motion.div 
            key={achievement.id}
            className={`
              rounded-lg p-4 relative overflow-hidden
              ${achievement.unlockedAt 
                ? 'bg-background' 
                : 'bg-background-tertiary bg-opacity-30'
              }
            `}
            variants={itemVariants}
          >
            <div className="flex items-start space-x-3">
              <div className={`
                p-2 rounded-lg
                ${achievement.unlockedAt 
                  ? 'bg-accent bg-opacity-20 text-accent' 
                  : 'bg-background-tertiary text-text-secondary'
                }
              `}>
                {achievement.unlockedAt 
                  ? getAchievementIcon(achievement.icon)
                  : <Lock size={20} />
                }
              </div>
              
              <div>
                <h3 className={`font-medium ${achievement.unlockedAt ? 'text-white' : 'text-text-secondary'}`}>
                  {achievement.title}
                </h3>
                <p className="text-xs text-text-secondary mt-1">
                  {achievement.description}
                </p>
                
                {achievement.unlockedAt && (
                  <div className="text-xs text-accent font-medium mt-2">
                    Unlocked
                  </div>
                )}
              </div>
            </div>
            
            {achievement.unlockedAt && (
              <div className="absolute -bottom-6 -right-6 bg-accent rounded-full w-12 h-12 bg-opacity-10"></div>
            )}
          </motion.div>
        ))}
      </motion.div>
      
      <div className="mt-4 pt-4 border-t border-background-tertiary flex items-center justify-between">
        <span className="text-sm text-text-secondary">
          {achievements.filter(a => a.unlockedAt).length} of {achievements.length} unlocked
        </span>
        
        <div className="h-2 bg-background rounded-full overflow-hidden flex-1 mx-4">
          <motion.div 
            className="h-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${(achievements.filter(a => a.unlockedAt).length / achievements.length) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        
        <span className="text-sm text-accent font-medium">
          {Math.round((achievements.filter(a => a.unlockedAt).length / achievements.length) * 100)}%
        </span>
      </div>
    </motion.div>
  );
};

export default AchievementList;