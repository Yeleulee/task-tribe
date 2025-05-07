import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  CheckSquare, 
  Calendar, 
  Brain,
  Star,
  ArrowRight,
  MessageSquare,
  Clock,
  BarChart2,
  Layout,
  Zap
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }
    })
  };
  
  // Features data
  const features = [
    {
      icon: <Brain className="text-accent" size={28} />,
      title: "AI Assistant",
      description: "Intelligent task management powered by Gemini API with personalized productivity tips"
    },
    {
      icon: <Calendar className="text-accent" size={28} />,
      title: "Smart Calendar",
      description: "Manage events, get reminders, and schedule tasks directly through the AI chat"
    },
    {
      icon: <CheckSquare className="text-accent" size={28} />,
      title: "Task Breakdown",
      description: "Automatically break complex projects into manageable steps with AI guidance"
    },
    {
      icon: <BarChart2 className="text-accent" size={28} />,
      title: "Performance Analytics",
      description: "Track productivity trends and receive personalized improvement suggestions"
    }
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-[#1a1a1a] text-white">
      {/* Header Section */}
      <header className="py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-[#e5fb26] p-2 rounded">
              <CheckSquare className="text-black" size={24} />
            </div>
            <span className="text-xl font-bold">TaskTribe</span>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/signup')}
            className="bg-[#e5fb26] hover:bg-[#d4ea15] text-black font-medium py-2 px-6 rounded flex items-center gap-2"
          >
            <Zap size={20} />
            Try Dashboard
          </motion.button>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="pt-16 pb-24 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            custom={1}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="inline-block bg-[#2a2a2a] rounded-full px-4 py-1 text-[#e5fb26] text-sm font-medium mb-6"
          >
            Powered by Gemini AI
          </motion.div>
          
          <motion.h1 
            custom={2}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Transform your productivity with{' '}
            <span className="text-[#e5fb26]">AI assistance</span>
          </motion.h1>
          
          <motion.p 
            custom={3}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto"
          >
            TaskTribe combines intelligent task management with advanced AI assistance
            to help you organize work, manage your calendar, and boost productivity.
          </motion.p>
          
          <motion.div
            custom={4}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/signup')}
              className="bg-[#e5fb26] text-black font-semibold rounded text-lg py-3 px-8 flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Experience Dashboard
              <ArrowRight size={20} />
            </motion.button>
            
            <div className="flex items-center gap-2 text-gray-300">
              <Star className="text-[#e5fb26]" size={20} />
              <span>4.9/5 from 1000+ users</span>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Rest of the sections remain the same */}
      {/* ... existing code ... */}
    </div>
  );
};

export default LandingPage; 