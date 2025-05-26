import { ApiResponse } from '@/lib/types';
import { simulateBrowsing } from '@/lib/utils';

// These would be stored in environment variables in a real app
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
const API_KEY = "AIzaSyAuFi5KtPsMJI5IC8c5FjvYD5IbuBdwH_U";

export async function sendMessageToAI(
  userMessage: string,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[]
): Promise<ApiResponse> {
  try {
    // For demonstration purposes, we'll simulate the API call
    // In a real application, you would make an actual API call to Gemini
    
    if (userMessage.toLowerCase().includes('search') || 
        userMessage.toLowerCase().includes('find information') ||
        userMessage.toLowerCase().includes('look up')) {
      
      // Extract search query
      const searchTerm = userMessage.split(' ').slice(1).join(' ').replace(/[?.,]/g, '');
      
      // Simulate browsing
      const browserResult = await simulateBrowsing(searchTerm);
      
      return {
        text: `I've searched for information about "${searchTerm}" and found some relevant content. You can see the results in the browser panel.`,
        browserActions: [
          {
            url: `https://search.example.com?q=${encodeURIComponent(searchTerm)}`,
            action: 'navigate'
          }
        ]
      };
    }
    
    if (userMessage.toLowerCase().includes('generate') && 
        (userMessage.toLowerCase().includes('document') || 
         userMessage.toLowerCase().includes('article') || 
         userMessage.toLowerCase().includes('content'))) {
      
      // Simulate document generation
      const title = userMessage.includes('about') 
        ? userMessage.split('about')[1].trim().replace(/[?.,]/g, '')
        : "Generated Document";
      
      return {
        text: `I've generated a document about "${title}" for you. You can view it and download it as markdown or PDF.`,
        tasks: [
          { title: "Research content", description: "Gathering information" },
          { title: "Structure document", description: "Creating outline" },
          { title: "Draft content", description: "Writing initial draft" },
          { title: "Format document", description: "Adding proper formatting" }
        ],
        generatedContent: {
          type: 'markdown',
          title: title,
          content: `# ${title}\n\n## Introduction\n\nThis is a generated document about ${title}. It contains several sections with relevant information.\n\n## Background\n\nHere is some background information about the topic.\n\n## Key Points\n\n- Important point 1\n- Critical information 2\n- Relevant data 3\n\n## Analysis\n\nAn in-depth analysis of the topic with supporting evidence and expert opinions.\n\n## Conclusion\n\nSummarizing the main points and providing a comprehensive conclusion.`
        }
      };
    }
    
    // Default response for other queries
    return {
      text: "I'm your AI assistant with web browsing capabilities. I can search for information, generate documents, and help with various tasks. What would you like me to do?\n\nTry asking me to:\n- Search for information about a topic\n- Generate a document about a subject\n- Create a step-by-step guide"
    };
  } catch (error) {
    console.error('Error calling AI API:', error);
    return {
      text: "I'm sorry, I encountered an error while processing your request. Please try again later."
    };
  }
}