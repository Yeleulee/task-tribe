interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
      role: string;
    };
  }[];
}

const API_KEY = 'YOUR_GEMINI_API_KEY'; // Replace with your actual API key
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

/**
 * Sends a message to Gemini API and returns the response
 * @param messages Previous conversation history including the current user message
 * @returns The AI response text
 */
export const sendMessageToGemini = async (messages: GeminiMessage[]): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: messages,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini API');
    }
    
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return "I'm having trouble connecting to my knowledge base right now. Let me provide a helpful response based on what I know: " + getLocalFallbackResponse();
  }
};

/**
 * Provides a fallback response when the API call fails
 */
const getLocalFallbackResponse = (): string => {
  const fallbackResponses = [
    "Try breaking your task into smaller, manageable steps, and tackle them one at a time.",
    "Setting clear deadlines for each task can help you stay on track and prioritize effectively.",
    "Consider using the Pomodoro technique - work for 25 minutes, then take a 5-minute break.",
    "For better productivity, try to minimize distractions during your focused work periods.",
    "Remember to take regular breaks to prevent burnout and maintain consistent productivity."
  ];
  
  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
};

/**
 * Formats messages for the Gemini API
 * @param userMessages Array of user and AI messages in chronological order
 * @returns Formatted messages for the Gemini API
 */
export const formatMessagesForGemini = (
  userMessages: { content: string; sender: 'user' | 'ai' }[]
): GeminiMessage[] => {
  const systemPrompt: GeminiMessage = {
    role: 'user',
    parts: [{ 
      text: `You are TaskTribe Assistant, an AI helper focused on task management, productivity, and work organization. 
      
      Your primary capabilities include:
      1. Providing advice on task management, prioritization, and productivity
      2. Helping users break down complex tasks into manageable steps
      3. Suggesting time management techniques
      4. Assisting with calendar management and scheduling
      
      For calendar functions, respond as if you can handle them directly. The application will process commands like:
      - "Add an event called Meeting with Team on Friday at 3:00 PM"
      - "Remove the event called Project Deadline"
      - "Show my upcoming events"
      
      Keep your responses friendly, concise, and focused on providing practical advice.
      If asked about scheduling events, encourage the user to use commands like those above.
      When helping with task management, provide specific, actionable tips rather than general advice.`
    }]
  };

  const formattedMessages: GeminiMessage[] = [systemPrompt];

  userMessages.forEach(message => {
    formattedMessages.push({
      role: message.sender === 'user' ? 'user' : 'model',
      parts: [{ text: message.content }]
    });
  });

  return formattedMessages;
}; 