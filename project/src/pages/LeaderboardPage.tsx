import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Users, Search } from 'lucide-react';
import { useSocial } from '../context/SocialContext';
import LeaderboardItem from '../components/social/LeaderboardItem';

const LeaderboardPage: React.FC = () => {
  const { leaderboard } = useSocial();
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Filter leaderboard by search term
  const filteredLeaderboard = searchTerm.trim()
    ? leaderboard.filter(entry => 
        entry.userName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : leaderboard;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold flex items-center justify-center mb-2">
            <Trophy className="mr-3 text-accent" size={28} />
            Leaderboard
          </h1>
          <p className="text-text-secondary max-w-md mx-auto">
            See how you stack up against other productivity warriors. Gain points by completing tasks and maintaining streaks!
          </p>
        </div>
        
        {leaderboard.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="col-span-1 md:col-span-3 mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64 px-4 py-2 pl-10 bg-background-secondary rounded-lg text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={18} />
              </div>
            </div>
            
            {leaderboard.slice(0, 3).map((entry, index) => (
              <motion.div
                key={entry.userId}
                className="bg-background-secondary rounded-xl p-6 text-center relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className={`
                  absolute top-0 left-0 right-0 h-1.5
                  ${index === 0 ? 'bg-[#FFD700]' : index === 1 ? 'bg-[#C0C0C0]' : 'bg-[#CD7F32]'}
                `}></div>
                
                <div className="flex justify-center mb-4">
                  <div className={`
                    w-16 h-16 rounded-full flex items-center justify-center
                    ${index === 0 
                      ? 'bg-[#FFD700] bg-opacity-20' 
                      : index === 1 
                        ? 'bg-[#C0C0C0] bg-opacity-20' 
                        : 'bg-[#CD7F32] bg-opacity-20'
                    }
                  `}>
                    <Medal className={`
                      ${index === 0 
                        ? 'text-[#FFD700]' 
                        : index === 1 
                          ? 'text-[#C0C0C0]' 
                          : 'text-[#CD7F32]'
                      }
                    `} size={32} />
                  </div>
                </div>
                
                <div className="mb-2">
                  <img 
                    src={entry.userAvatar}
                    alt={entry.userName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-background mx-auto"
                  />
                </div>
                
                <h3 className="font-bold text-lg">{entry.userName}</h3>
                <p className="text-text-secondary text-sm mb-2">Level {entry.level}</p>
                
                <div className="text-2xl font-bold text-accent">{entry.points}</div>
                <p className="text-text-secondary text-sm">points</p>
                
                <div className="mt-3 text-sm flex items-center justify-center text-warning">
                  <div className="flex items-center">
                    <Trophy size={14} className="mr-1" />
                    <span>#{entry.rank}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      <h2 className="text-lg font-medium mb-4 flex items-center">
        <Users className="mr-2 text-accent" size={20} />
        Full Rankings
      </h2>
      
      <div className="space-y-3">
        {filteredLeaderboard.length === 0 ? (
          <div className="bg-background-secondary rounded-lg p-6 text-center">
            <p className="text-text-secondary">No users found matching "{searchTerm}"</p>
          </div>
        ) : (
          filteredLeaderboard.map((entry, index) => (
            <LeaderboardItem key={entry.userId} entry={entry} rank={index + 1} />
          ))
        )}
      </div>
    </motion.div>
  );
};

export default LeaderboardPage;