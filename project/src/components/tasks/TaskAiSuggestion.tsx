import React from 'react';
import { motion } from 'framer-motion';
import { Bot, MessageSquare, ArrowRight } from 'lucide-react';
import { useAiAssistant } from '../../context/AiAssistantContext';

interface TaskAiSuggestionProps {
  taskName: string;
}

const TaskAiSuggestion: React.FC<TaskAiSuggestionProps> = ({ taskName }) => {
  const { suggestPrompt, addUserMessage } = useAiAssistant();
  
  const suggestedPrompt = suggestPrompt(taskName);
  
  const handleSuggestClick = () => {
    addUserMessage(suggestedPrompt);
  };
  
  return (
    <motion.div
      className="bg-background/95 backdrop-blur-sm p-4 rounded-lg mt-4 border border-background-tertiary"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        backgroundImage: 'linear-gradient(to bottom right, rgba(30, 30, 40, 0.9), rgba(30, 30, 50, 0.9))'
      }}
    >
      <div className="flex items-start space-x-3">
        <div className="bg-accent rounded-full p-2 flex-shrink-0">
          <Bot size={18} className="text-background" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-white mb-1">AI Task Assistant</h4>
          <p className="text-text-secondary text-sm mb-3">
            Need help with this task? I can provide guidance and suggestions.
          </p>
          <motion.div 
            className="bg-background-secondary p-3 rounded-lg cursor-pointer hover:bg-background-tertiary transition-colors flex items-center justify-between group"
            onClick={handleSuggestClick}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <span className="text-white text-sm">{suggestedPrompt}</span>
            <div className="bg-accent rounded-full p-1 ml-2 flex-shrink-0 group-hover:translate-x-1 transition-transform">
              <ArrowRight size={14} className="text-background" />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskAiSuggestion; 