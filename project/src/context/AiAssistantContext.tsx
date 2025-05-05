import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useCalendar } from './CalendarContext';
import { sendMessageToGemini, formatMessagesForGemini } from '../utils/geminiService';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AiAssistantContextType {
  messages: Message[];
  isTyping: boolean;
  addUserMessage: (content: string) => void;
  clearMessages: () => void;
  suggestPrompt: (task: string) => string;
}

const AiAssistantContext = createContext<AiAssistantContextType | undefined>(undefined);

// AI assistant responses organized by categories for better context-awareness (used as fallback)
const FALLBACK_RESPONSES = {
  taskManagement: [
    "I recommend using the Eisenhower Matrix to prioritize your tasks: divide them into urgent/important, important/not urgent, urgent/not important, and neither urgent nor important.",
    "For better task management, try time-blocking your calendar. Allocate specific time slots for focused work on each task.",
    "Breaking down large tasks into smaller, manageable steps can help reduce overwhelm and improve your productivity.",
    "Consider setting specific deadlines for each task, even if they don't naturally have one. This creates urgency and helps with prioritization.",
    "The ABCDE method might help you: A tasks are vital, B are important, C are nice to do, D can be delegated, and E can be eliminated."
  ],
  productivity: [
    "The Pomodoro Technique could help boost your productivity - work for 25 minutes, then take a 5-minute break, and repeat.",
    "Research shows our brains work best in 90-minute focus cycles. Try working intensely for 90 minutes, then take a 20-minute break.",
    "Morning hours are typically best for deep, focused work. Try scheduling your most important tasks earlier in the day.",
    "Consider using the 2-minute rule: if a task takes less than 2 minutes, do it immediately rather than scheduling it for later.",
    "Remember to build in regular breaks - they're essential for maintaining focus and creativity throughout the day."
  ],
  teamwork: [
    "Clear communication is key for team collaboration. Consider setting up regular check-ins to ensure everyone is aligned.",
    "Using shared task boards can improve visibility across your team and help everyone understand priorities.",
    "When delegating tasks, make sure to clearly define the expected outcome and deadline.",
    "Consider each team member's strengths when assigning tasks for optimal efficiency and job satisfaction.",
    "For collaborative projects, establishing RACI (Responsible, Accountable, Consulted, Informed) roles can clarify responsibilities."
  ],
  motivation: [
    "Setting specific, measurable goals for each day can help maintain motivation and give you a sense of accomplishment.",
    "Remember to celebrate small wins along the way - not just the completion of an entire project.",
    "If you're feeling unmotivated, try the 'five-minute rule': commit to working on a task for just five minutes. Often, you'll continue once you've started.",
    "Consider finding an accountability partner to help you stay on track with your goals and commitments.",
    "Visualizing the successful completion of a task and how you'll feel afterward can boost motivation to get started."
  ],
  general: [
    "I'd be happy to help you break that down into manageable steps!",
    "That's a great question. Let me suggest some approaches...",
    "I've analyzed your task patterns, and I have some recommendations that might help.",
    "Based on productivity research, I can suggest a few strategies for your situation.",
    "I'm here to help! Let me know if you need more specific advice on any aspect of your tasks."
  ]
};

// Initial greeting message
const INITIAL_MESSAGE: Message = {
  id: '1',
  content: "I'm your TaskTribe assistant. I can help with task prioritization, productivity tips, and workflow optimization. I can also help manage your calendar events! What can I help you with today?",
  sender: 'ai',
  timestamp: new Date()
};

// Regular expressions for calendar commands
const ADD_EVENT_REGEX = /add\s+(an\s+)?event\s+(?:called|titled|named)?\s*(?:"([^"]*)"|([^"]+))\s+(?:on|for)\s+([^,]+)(?:,?\s+(?:from|at)\s+([^,]+)(?:\s+(?:to|until)\s+([^,]+))?)?/i;
const REMOVE_EVENT_REGEX = /(?:remove|delete|cancel)\s+(?:the\s+)?event\s+(?:called|titled|named)?\s*(?:"([^"]*)"|([^"]+))/i;
const LIST_EVENTS_REGEX = /(?:show|list|display|what are)\s+(?:my\s+)?(?:upcoming|scheduled)?\s*events/i;

export const AiAssistantProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const calendar = useCalendar();

  // Generate a contextually appropriate fallback response based on the user's message
  const generateFallbackResponse = (userMessage: string): string => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    // Determine which category of response to use based on keywords
    if (lowerCaseMessage.includes('priorit') || lowerCaseMessage.includes('important') || lowerCaseMessage.includes('urgent')) {
      return FALLBACK_RESPONSES.taskManagement[Math.floor(Math.random() * FALLBACK_RESPONSES.taskManagement.length)];
    }
    
    if (lowerCaseMessage.includes('productiv') || lowerCaseMessage.includes('focus') || lowerCaseMessage.includes('efficient') || lowerCaseMessage.includes('time')) {
      return FALLBACK_RESPONSES.productivity[Math.floor(Math.random() * FALLBACK_RESPONSES.productivity.length)];
    }
    
    if (lowerCaseMessage.includes('team') || lowerCaseMessage.includes('collaborat') || lowerCaseMessage.includes('delegate') || lowerCaseMessage.includes('together')) {
      return FALLBACK_RESPONSES.teamwork[Math.floor(Math.random() * FALLBACK_RESPONSES.teamwork.length)];
    }
    
    if (lowerCaseMessage.includes('motivat') || lowerCaseMessage.includes('inspir') || lowerCaseMessage.includes('stuck') || lowerCaseMessage.includes('procrastinat')) {
      return FALLBACK_RESPONSES.motivation[Math.floor(Math.random() * FALLBACK_RESPONSES.motivation.length)];
    }
    
    // Default to general responses if no specific category matches
    return FALLBACK_RESPONSES.general[Math.floor(Math.random() * FALLBACK_RESPONSES.general.length)];
  };

  // Process calendar commands
  const processCalendarCommand = (content: string): string | null => {
    // Check for add event command
    const addMatch = content.match(ADD_EVENT_REGEX);
    if (addMatch) {
      const title = addMatch[2] || addMatch[3]; // Quoted or unquoted title
      const dateStr = addMatch[4];
      const startTimeStr = addMatch[5] || '9:00 AM'; // Default start time
      const endTimeStr = addMatch[6] || addMatch[5] ? `${parseInt(startTimeStr) + 1}:00` : '10:00 AM'; // Default 1 hour after start or 10 AM
      
      try {
        // Parse date and times
        const dateObj = new Date(dateStr);
        
        // Create start and end date objects
        const startDate = new Date(dateObj);
        const endDate = new Date(dateObj);
        
        // Set times
        if (startTimeStr.toLowerCase().includes('am') || startTimeStr.toLowerCase().includes('pm')) {
          const [hourStr, minuteStr] = startTimeStr.replace(/am|pm/i, '').trim().split(':');
          const hour = parseInt(hourStr);
          const minute = minuteStr ? parseInt(minuteStr) : 0;
          const isPM = startTimeStr.toLowerCase().includes('pm');
          
          startDate.setHours(isPM && hour < 12 ? hour + 12 : hour, minute, 0, 0);
        }
        
        if (endTimeStr.toLowerCase().includes('am') || endTimeStr.toLowerCase().includes('pm')) {
          const [hourStr, minuteStr] = endTimeStr.replace(/am|pm/i, '').trim().split(':');
          const hour = parseInt(hourStr);
          const minute = minuteStr ? parseInt(minuteStr) : 0;
          const isPM = endTimeStr.toLowerCase().includes('pm');
          
          endDate.setHours(isPM && hour < 12 ? hour + 12 : hour, minute, 0, 0);
        }
        
        // Add event to calendar
        const eventId = calendar.addEvent({
          title,
          description: '',
          startDate,
          endDate,
          color: '#4f46e5'
        });
        
        return `I've added "${title}" to your calendar on ${dateObj.toDateString()} from ${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`;
      } catch (error) {
        console.error('Error adding calendar event:', error);
        return 'I had trouble adding that event to your calendar. Could you please specify the date and time more clearly?';
      }
    }
    
    // Check for remove event command
    const removeMatch = content.match(REMOVE_EVENT_REGEX);
    if (removeMatch) {
      const title = removeMatch[1] || removeMatch[2]; // Quoted or unquoted title
      
      // Find events with matching title
      const matchingEvents = calendar.events.filter(event => 
        event.title.toLowerCase() === title.toLowerCase()
      );
      
      if (matchingEvents.length === 0) {
        return `I couldn't find an event called "${title}" in your calendar.`;
      }
      
      // Remove the first matching event
      const success = calendar.removeEvent(matchingEvents[0].id);
      
      if (success) {
        return `I've removed "${title}" from your calendar.`;
      } else {
        return `I had trouble removing "${title}" from your calendar. Please try again.`;
      }
    }
    
    // Check for list events command
    const listMatch = content.match(LIST_EVENTS_REGEX);
    if (listMatch) {
      const upcomingEvents = calendar.getUpcomingEvents();
      
      if (upcomingEvents.length === 0) {
        return 'You have no upcoming events scheduled.';
      }
      
      const eventList = upcomingEvents.map(event => {
        const dateStr = new Date(event.startDate).toDateString();
        const timeStr = new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `• ${event.title} on ${dateStr} at ${timeStr}`;
      }).join('\n');
      
      return `Here are your upcoming events:\n${eventList}`;
    }
    
    return null;
  };

  // Add a user message and generate an AI response
  const addUserMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Check if the message is a calendar command
    const calendarResponse = processCalendarCommand(content);
    
    if (calendarResponse) {
      // If it's a calendar command, use the calendar response
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: calendarResponse,
          sender: 'ai',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, 800);
    } else {
      // Otherwise, use Gemini API
      try {
        // Format messages for Gemini
        const formattedMessages = formatMessagesForGemini(
          messages.concat(userMessage).map(msg => ({
            content: msg.content,
            sender: msg.sender
          }))
        );
        
        // Get response from Gemini
        const response = await sendMessageToGemini(formattedMessages);
        
        // Create AI message with response
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response,
          sender: 'ai',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        console.error('Error getting response from Gemini:', error);
        
        // Use fallback response if API call fails
        const fallbackResponse = generateFallbackResponse(content);
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: fallbackResponse,
          sender: 'ai',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  // Clear all messages except the initial greeting
  const clearMessages = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  // Generate task-specific prompts
  const suggestPrompt = (task: string): string => {
    const suggestions = [
      `How can I break down "${task}" into smaller steps?`,
      `What's the best way to approach "${task}"?`,
      `Can you suggest a time management strategy for "${task}"?`,
      `What resources might help me complete "${task}" more efficiently?`,
      `I'm feeling stuck on "${task}". Any suggestions to get moving?`,
      `Could you schedule "${task}" in my calendar?`
    ];
    
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  };

  return (
    <AiAssistantContext.Provider 
      value={{ 
        messages, 
        isTyping, 
        addUserMessage, 
        clearMessages,
        suggestPrompt
      }}
    >
      {children}
    </AiAssistantContext.Provider>
  );
};

export const useAiAssistant = (): AiAssistantContextType => {
  const context = useContext(AiAssistantContext);
  if (!context) {
    throw new Error('useAiAssistant must be used within an AiAssistantProvider');
  }
  return context;
}; 