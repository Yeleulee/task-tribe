import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Users, UserSearch } from 'lucide-react';
import { useSocial } from '../context/SocialContext';
import FriendItem from '../components/social/FriendItem';
import { users } from '../utils/mockData';

const FriendsPage: React.FC = () => {
  const { friends, sendFriendRequest } = useSocial();
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // This would be a search against the API in a real app
  const searchResults = searchTerm.trim() 
    ? users.filter(
        user => 
          !friends.some(f => f.id === user.id) && 
          user.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold flex items-center">
          <Users className="mr-3 text-accent" size={24} />
          Accountability Partners
        </h1>
        
        <div className="relative">
          <input 
            type="text" 
            placeholder="Find new partners..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 px-4 py-2 pl-10 bg-background-secondary rounded-lg text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <UserSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={18} />
        </div>
      </div>
      
      {searchTerm.trim() && (
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <UserPlus className="mr-2 text-accent" size={18} />
            Search Results
          </h2>
          
          {searchResults.length === 0 ? (
            <div className="bg-background-secondary rounded-lg p-6 text-center">
              <p className="text-text-secondary">No results found for "{searchTerm}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {searchResults.map(user => (
                <motion.div
                  key={user.id}
                  className="bg-background-secondary rounded-lg p-4 flex items-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <img 
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-background"
                  />
                  
                  <div className="ml-3 flex-1">
                    <h3 className="font-medium text-white">{user.name}</h3>
                    <div className="text-xs text-text-secondary mt-1">
                      Level {user.level} • {user.points} points
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1 bg-accent text-text-accent font-medium rounded-lg text-sm"
                    onClick={() => {
                      sendFriendRequest(user.id);
                      setSearchTerm('');
                    }}
                  >
                    Connect
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
      
      <h2 className="text-lg font-medium mb-4">Your Partners ({friends.length})</h2>
      
      {friends.length === 0 ? (
        <div className="bg-background-secondary rounded-lg p-8 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mx-auto w-16 h-16 bg-accent bg-opacity-10 rounded-full flex items-center justify-center mb-4">
              <UserPlus className="text-accent" size={24} />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No partners yet</h3>
            <p className="text-text-secondary">
              Find friends to help keep you accountable on your productivity journey.
            </p>
          </motion.div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {friends.map(friend => (
            <FriendItem key={friend.id} friend={friend} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default FriendsPage;