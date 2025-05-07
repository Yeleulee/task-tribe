import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
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
  
  // Testimonials data
  const testimonials = [
    {
      quote: "TaskTribe's AI assistant completely changed how I manage projects. The calendar integration is seamless.",
      author: "Alex M., Product Manager",
      stars: 5
    },
    {
      quote: "I'm saving 2 hours every day since I started using the AI task breakdown feature. Game changer!",
      author: "Sarah K., Developer",
      stars: 5
    },
    {
      quote: "The smart scheduling and AI recommendations have improved my productivity by 25% in just two weeks.",
      author: "Michael T., Team Lead",
      stars: 4
    }
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      <header className="fixed w-full top-0 bg-[#1a1a1a]/80 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-[#e5fb26]">
            TaskTribe
          </Link>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="px-4 py-2 text-[#e5fb26] hover:text-[#d4ea15] transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-[#e5fb26] text-black rounded hover:bg-[#d4ea15] transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pt-32 pb-20 px-4"
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Collaborate with your{' '}
              <span className="text-[#e5fb26]">tribe</span>
            </h1>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Join TaskTribe and experience a new way of managing tasks with your team.
              Simple, intuitive, and designed for modern collaboration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="px-8 py-4 bg-[#e5fb26] text-black rounded-lg font-semibold hover:bg-[#d4ea15] transition-colors"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 border border-[#e5fb26] text-[#e5fb26] rounded-lg font-semibold hover:bg-[#e5fb26]/10 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 bg-[#2a2a2a]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose <span className="text-[#e5fb26]">TaskTribe</span>?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Real-time Collaboration',
                description: 'Work together with your team in real-time, seeing updates as they happen.'
              },
              {
                title: 'Smart Organization',
                description: 'Keep your tasks organized with intuitive categories and tags.'
              },
              {
                title: 'Progress Tracking',
                description: 'Track your team\'s progress with visual dashboards and reports.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="p-6 bg-[#1a1a1a] rounded-lg"
              >
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Chat Demo Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="flex-1"
            >
              <div className="inline-block bg-background-secondary rounded-full px-4 py-1 text-accent text-sm font-medium mb-4">
                Gemini-Powered AI
              </div>
              <h2 className="text-3xl font-bold mb-4">Intelligent Assistant That Never Sleeps</h2>
              <p className="text-text-secondary mb-6">
                Get personalized productivity advice, calendar management, and task help with our advanced AI assistant. From scheduling meetings to breaking down complex tasks, TaskTribe's AI has you covered.
              </p>
              
              <ul className="space-y-3 mb-8">
                {[
                  "Natural language calendar management",
                  "Personalized productivity recommendations",
                  "Smart task breakdown and organization",
                  "Work pattern analysis and optimization"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckSquare size={20} className="text-accent mr-2 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-accent text-background font-medium py-3 px-6 rounded-lg inline-flex items-center"
              >
                <MessageSquare size={18} className="mr-2" />
                Try AI Assistant
              </motion.button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="flex-1"
            >
              <div className="bg-background-secondary rounded-xl p-4 border border-background-tertiary shadow-xl relative max-w-md mx-auto">
                <div className="absolute -top-3 -right-3 bg-accent text-background text-xs font-bold px-3 py-1 rounded-full">
                  AI Demo
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="bg-accent rounded-full p-1.5 mr-2">
                    <MessageSquare className="text-background" size={18} />
                  </div>
                  <h4 className="font-semibold">TaskTribe Assistant</h4>
                </div>
                
                <div className="space-y-4 mb-4">
                  <div className="bg-background-tertiary text-white p-3 rounded-lg rounded-tl-none max-w-[80%]">
                    <p>Hi there! I'm your AI assistant. How can I help with your tasks today?</p>
                    <p className="text-xs opacity-70 mt-1">11:30 AM</p>
                  </div>
                  
                  <div className="flex justify-end">
                    <div className="bg-accent text-background p-3 rounded-lg rounded-tr-none max-w-[80%]">
                      <p>Can you help me schedule a team meeting for tomorrow?</p>
                      <p className="text-xs opacity-70 mt-1">11:31 AM</p>
                    </div>
                  </div>
                  
                  <div className="bg-background-tertiary text-white p-3 rounded-lg rounded-tl-none max-w-[80%]">
                    <p>I'd be happy to! Would you like me to add an event called "Team Meeting" to your calendar for tomorrow? What time works best for you?</p>
                    <p className="text-xs opacity-70 mt-1">11:31 AM</p>
                  </div>
                  
                  <div className="flex justify-end">
                    <div className="bg-accent text-background p-3 rounded-lg rounded-tr-none max-w-[80%]">
                      <p>2:00 PM would be perfect, thanks!</p>
                      <p className="text-xs opacity-70 mt-1">11:32 AM</p>
                    </div>
                  </div>
                  
                  <div className="bg-background-tertiary text-white p-3 rounded-lg rounded-tl-none max-w-[80%]">
                    <p>I've added "Team Meeting" to your calendar for tomorrow at 2:00 PM. Is there anything else you'd like me to do?</p>
                    <p className="text-xs opacity-70 mt-1">11:32 AM</p>
                  </div>
                </div>
                
                <div className="flex items-center bg-background rounded-full px-4 py-2 border border-background-tertiary">
                  <input
                    type="text"
                    placeholder="Message TaskTribe AI..."
                    className="bg-transparent border-none outline-none flex-1 text-sm"
                    disabled
                  />
                  <div className="bg-accent text-background p-1.5 rounded-full">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-background-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Discover how TaskTribe is transforming productivity for teams and individuals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: index * 0.1, duration: 0.5 }
                }}
                viewport={{ once: true }}
                className="bg-background rounded-xl p-6 border border-background-tertiary flex flex-col h-full"
              >
                <div className="flex-1">
                  <div className="flex mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        size={18} 
                        className={i < testimonial.stars ? "text-accent" : "text-background-tertiary"} 
                        fill={i < testimonial.stars ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <p className="text-text-secondary mb-4">"{testimonial.quote}"</p>
                </div>
                <p className="font-medium">{testimonial.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-gradient-to-br from-accent/20 to-purple-500/20 rounded-2xl p-8 md:p-12 text-center border border-accent/20"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Experience AI-Powered Productivity Today
            </h2>
            <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already transforming their workflow with TaskTribe's intelligent assistant.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-accent text-background font-semibold rounded-lg text-lg py-4 px-8 flex items-center mx-auto"
              onClick={() => navigate('/signup')}
            >
              Sign Up Now
              <ArrowRight className="ml-2" size={20} />
            </motion.button>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 bg-background-secondary">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-accent rounded-lg p-1.5 mr-2">
              <CheckSquare className="text-background" size={20} />
            </div>
            <span className="text-xl font-bold">TaskTribe</span>
          </div>
          <div className="text-center text-text-secondary">
            <p>© 2024 TaskTribe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;