import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Loader, Trash2, Clock, CheckSquare, Users, Award, Calendar, Flame } from 'lucide-react';
import { useAiAssistant } from '../../context/AiAssistantContext';
import { useAuth } from '../../context/AuthContext';
import { useCalendar } from '../../context/CalendarContext';
import { useTasks } from '../../context/TaskContext';

interface SuggestionCard {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  prompt: string;
}

const AiChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, getStreakStatus } = useAuth();
  const calendar = useCalendar();
  const { getTasksCompletedToday, getCompletionStats } = useTasks();
  const { messages, isTyping, addUserMessage, clearMessages } = useAiAssistant();
  
  const streakData = getStreakStatus();
  const tasksToday = getTasksCompletedToday().length;
  const isStreakAtRisk = streakData.current > 0 && tasksToday === 0;

  // Scroll to bottom when messages change
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    // Hide welcome screen once user has sent at least one message
    if (messages.length > 1) {
      setShowWelcome(false);
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    addUserMessage(inputValue);
    setInputValue('');
  };

  const handleSuggestionClick = (prompt: string) => {
    addUserMessage(prompt);
    setShowWelcome(false);
  };

  const getUpcomingEventSummary = () => {
    const upcomingEvents = calendar.getUpcomingEvents(3);
    
    if (upcomingEvents.length === 0) {
      return null;
    }
    
    return (
      <div className="bg-background/40 rounded-lg p-3 mt-2">
        <div className="flex items-center space-x-2 mb-2">
          <Calendar size={16} className="text-accent" />
          <span className="text-xs font-medium">Upcoming Events</span>
        </div>
        <div className="space-y-1.5">
          {upcomingEvents.map(event => (
            <div key={event.id} className="text-xs">
              <div className="flex justify-between">
                <span className="font-medium">{event.title}</span>
                <span className="text-text-secondary">{new Date(event.startDate).toLocaleDateString()}</span>
              </div>
              <div className="text-text-secondary">
                {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const getStreakSummary = () => {
    if (streakData.current === 0) return null;
    
    return (
      <div className={`bg-background/40 rounded-lg p-3 mt-3 ${isStreakAtRisk ? 'border border-orange-500/30' : ''}`}>
        <div className="flex items-center space-x-2 mb-2">
          <Flame size={16} className={isStreakAtRisk ? "text-orange-500" : "text-accent"} />
          <span className="text-xs font-medium">Current Streak</span>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <span className={`text-lg font-bold ${isStreakAtRisk ? "text-orange-500" : "text-white"}`}>{streakData.current}</span>
            <span className="text-text-secondary text-xs ml-1">days</span>
          </div>
          {isStreakAtRisk && (
            <div className="text-xs text-orange-500 font-medium">
              Complete a task today!
            </div>
          )}
        </div>
      </div>
    );
  };

  // Dynamic suggestions based on streak status
  const getAdditionalSuggestions = () => {
    if (isStreakAtRisk) {
      return {
        icon: <Flame size={20} className="text-background" />,
        title: "Save Your Streak",
        subtitle: `${streakData.current}-day streak at risk`,
        prompt: "Show me quick tasks I can complete today to maintain my streak"
      };
    }
    
    if (streakData.current >= 7) {
      return {
        icon: <Award size={20} className="text-background" />,
        title: "Streak Analysis",
        subtitle: `${streakData.current}-day streak insights`,
        prompt: "Analyze my productivity patterns based on my current streak"
      };
    }
    
    return null;
  };

  let suggestionCards: SuggestionCard[] = [
    {
      icon: <Clock size={20} className="text-background" />,
      title: "Task Prioritization",
      subtitle: "Productivity Tips",
      prompt: "How should I prioritize my tasks for today?"
    },
    {
      icon: <CheckSquare size={20} className="text-background" />,
      title: "Break Down Tasks",
      subtitle: "Task Management",
      prompt: "Help me break down my large tasks into smaller ones"
    },
    {
      icon: <Calendar size={20} className="text-background" />,
      title: "Schedule Event",
      subtitle: "Calendar Management",
      prompt: "Add an event called Team Meeting on tomorrow at 2:00 PM"
    }
  ];
  
  // Add streak-related suggestion if applicable
  const additionalSuggestion = getAdditionalSuggestions();
  if (additionalSuggestion) {
    // Insert at beginning if streak is at risk, otherwise add to end
    if (isStreakAtRisk) {
      suggestionCards = [additionalSuggestion, ...suggestionCards];
    } else {
      suggestionCards = [...suggestionCards, additionalSuggestion];
    }
  }
  
  return (
    <>
      {/* Chat button */}
      <motion.button
        className="fixed bottom-6 right-6 bg-accent text-background p-3 rounded-full shadow-lg z-20"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(prev => !prev)}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>
      
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-6 w-80 md:w-96 lg:w-[450px] bg-background/95 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden z-20 flex flex-col"
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: '500px' }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            style={{
              backgroundImage: 'linear-gradient(to bottom right, rgba(30, 30, 40, 0.95), rgba(30, 30, 50, 0.95))'
            }}
          >
            {/* Chat header */}
            <div className="p-4 border-b border-background-tertiary flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-accent rounded-full p-1.5">
                  <Bot className="text-background" size={18} />
                </div>
                <h3 className="font-semibold text-white">TaskTribe Assistant</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  className="text-text-secondary hover:text-white"
                  onClick={clearMessages}
                  title="Clear conversation"
                >
                  <Trash2 size={18} />
                </button>
                <button 
                  className="text-text-secondary hover:text-white"
                  onClick={() => setIsOpen(false)}
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            
            {/* Messages or Welcome screen */}
            {showWelcome ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-accent rounded-full p-3 mb-4">
                  <Bot size={24} className="text-background" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-1">
                  Hi, {user?.name || 'there'}
                </h2>
                <h3 className="text-lg font-medium text-white mb-3">
                  Can I help you with anything?
                </h3>
                <p className="text-text-secondary mb-6 max-w-md">
                  Ready to assist you with task management, productivity tips, and calendar scheduling.
                  Let's get started!
                </p>
                
                {getUpcomingEventSummary()}
                {getStreakSummary()}
                
                <div className="grid grid-cols-1 gap-3 w-full mt-6">
                  {suggestionCards.map((card, index) => (
                    <motion.div 
                      key={index}
                      className={`bg-background-secondary rounded-lg p-3 cursor-pointer hover:bg-background-tertiary transition-colors
                        ${card.title === "Save Your Streak" ? "border border-orange-500/30" : ""}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSuggestionClick(card.prompt)}
                    >
                      <div className="flex items-center">
                        <div className={`${card.title === "Save Your Streak" ? "bg-orange-500" : "bg-accent"} rounded-lg p-2 mr-3`}>
                          {card.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-white">{card.title}</h4>
                          <p className="text-xs text-text-secondary">{card.subtitle}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[85%] p-3 rounded-lg ${
                        message.sender === 'user' 
                          ? 'bg-accent text-background rounded-tr-none' 
                          : 'bg-background-tertiary text-white rounded-tl-none'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-background-tertiary text-white p-3 rounded-lg rounded-tl-none max-w-[80%] flex items-center space-x-2">
                      <Loader className="animate-spin" size={16} />
                      <span>Typing...</span>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
            
            {/* Input area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-background-tertiary flex items-center space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask TaskTribe anything..."
                className="flex-1 bg-background-secondary rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent text-white"
              />
              <motion.button 
                type="submit"
                className="bg-accent text-background p-2 rounded-full hover:bg-accent/90 transition-colors"
                disabled={!inputValue.trim() || isTyping}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send size={20} />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AiChat; 