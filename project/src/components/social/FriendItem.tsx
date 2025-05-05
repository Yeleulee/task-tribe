import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, BarChart2, Award } from 'lucide-react';
import { User } from '../../types/user';
import { useSocial } from '../../context/SocialContext';

interface FriendItemProps {
  friend: User;
}

const FriendItem: React.FC<FriendItemProps> = ({ friend }) => {
  const { sendEncouragement } = useSocial();
  const [showEncourage, setShowEncourage] = useState(false);
  const [encourageMessage, setEncourageMessage] = useState('');
  
  const handleSendEncouragement = () => {
    if (encourageMessage.trim()) {
      sendEncouragement(friend.id, encourageMessage);
      setEncourageMessage('');
      setShowEncourage(false);
    }
  };

  return (
    <motion.div 
      className="bg-background-secondary rounded-lg p-4 shadow-md"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center">
        <img 
          src={friend.avatar}
          alt={friend.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-background"
        />
        
        <div className="ml-3 flex-1">
          <h3 className="font-medium text-white">{friend.name}</h3>
          <div className="flex items-center space-x-2 mt-1 text-xs text-text-secondary">
            <span className="flex items-center">
              <Award size={12} className="mr-1" /> Level {friend.level}
            </span>
            <span>•</span>
            <span className="flex items-center">
              <BarChart2 size={12} className="mr-1" /> {friend.points} pts
            </span>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 bg-background rounded-lg text-accent hover:bg-accent hover:text-background transition-colors"
          onClick={() => setShowEncourage(!showEncourage)}
        >
          <MessageSquare size={18} />
        </motion.button>
      </div>
      
      {showEncourage && (
        <motion.div 
          className="mt-4 bg-background rounded-lg p-3 space-y-3"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <input
            type="text"
            placeholder="Send an encouragement message..."
            value={encourageMessage}
            onChange={(e) => setEncourageMessage(e.target.value)}
            className="w-full px-3 py-2 bg-background-tertiary rounded-lg text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
          />
          
          <div className="flex space-x-2">
            <button 
              className="text-sm px-3 py-1 rounded-lg bg-background-tertiary text-text-secondary hover:text-white transition-colors"
              onClick={() => setShowEncourage(false)}
            >
              Cancel
            </button>
            <button 
              className="text-sm px-3 py-1 rounded-lg bg-accent text-text-accent font-medium hover:bg-accent-hover transition-colors"
              onClick={handleSendEncouragement}
              disabled={!encourageMessage.trim()}
            >
              Send
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FriendItem;