import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
    <div className="min-h-screen overflow-hidden bg-background text-white">
      {/* Header Section */}
      <header className="border-b border-background-tertiary">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-accent rounded-lg p-1.5">
              <CheckSquare className="text-background" size={20} />
            </div>
            <span className="text-xl font-bold">TaskTribe</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/dashboard')}
              className="flex items-center justify-center bg-accent hover:bg-accent/90 text-background font-medium py-2 px-6 rounded-lg transition-all shadow-lg"
            >
              <Zap size={18} className="mr-2" />
              <span>Try Dashboard</span>
            </motion.button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="pt-12 pb-24 relative overflow-hidden">
        <div className="absolute top-40 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-60 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              custom={1}
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="inline-block bg-background-secondary rounded-full px-4 py-1 text-accent text-sm font-medium mb-4"
            >
              Powered by Gemini AI
            </motion.div>
            
            <motion.h1 
              custom={2}
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
            >
              Transform your productivity with <span className="text-accent">AI assistance</span>
            </motion.h1>
            
            <motion.p 
              custom={3}
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto"
            >
              TaskTribe combines intelligent task management with advanced AI assistance to help you organize work, manage your calendar, and boost productivity.
            </motion.p>
            
            <motion.div
              custom={4}
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/dashboard')}
                className="bg-accent text-background font-semibold rounded-lg text-lg py-4 px-8 flex items-center w-full sm:w-auto justify-center"
              >
                Experience Dashboard
                <ArrowRight className="ml-2" size={20} />
              </motion.button>
              
              <div className="flex items-center space-x-2 text-text-secondary">
                <Star className="text-accent" size={20} />
                <span>4.9/5 from 1000+ users</span>
              </div>
            </motion.div>
          </div>
          
          {/* Preview Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { delay: 0.5, duration: 0.8 }
            }}
            className="mt-16 max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-background-tertiary"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none"></div>
              <img 
                src="https://i.imgur.com/XDPaqn6.png" 
                alt="TaskTribe Dashboard" 
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-background-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">AI-Powered Features</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Experience the next generation of task management with intelligent assistance at every step
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: index * 0.1, duration: 0.5 }
                }}
                viewport={{ once: true }}
                className="bg-background rounded-xl p-6 border border-background-tertiary hover:border-accent/30 transition-all"
              >
                <div className="bg-background-tertiary inline-block p-3 rounded-lg mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
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
                onClick={() => navigate('/dashboard')}
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
              onClick={() => navigate('/dashboard')}
              className="bg-accent text-background font-semibold rounded-lg text-lg py-4 px-8 flex items-center mx-auto"
            >
              Get Started Now
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