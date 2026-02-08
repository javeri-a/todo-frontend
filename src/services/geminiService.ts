// frontend/src/services/geminiService.ts
import { Task } from '@/types/task';

// Define types for Gemini API response
interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

// Simple in-memory task processing for demonstration
// In a real implementation, you would connect to the Gemini API
export class GeminiService {
  private apiKey: string | undefined;
  private apiUrl: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    this.apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`;
  }

  // Check if API key is configured
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  // Process user command using local logic (would connect to Gemini in real implementation)
  async processCommand(command: string, tasks: Task[]): Promise<{ action: string; params: any }> {
    // In a real implementation, you would send the command to Gemini API
    // For now, we'll use local processing as a fallback
    
    const lowerCmd = command.toLowerCase().trim();
    
    // Add task command
    if (lowerCmd.includes('add') && (lowerCmd.includes('task') || lowerCmd.includes('new'))) {
      const titleMatch = command.match(/(?:add|create|new)\s+(?:a\s+)?(?:task|todo):\s*(.+)/i);
      if (titleMatch) {
        return {
          action: 'add_task',
          params: {
            title: titleMatch[1],
            description: '',
            completed: false,
            priority: 'medium'
          }
        };
      }
      
      // Alternative format: "Add task: Buy groceries"
      const altTitleMatch = command.match(/add\s+task:\s*(.+)/i);
      if (altTitleMatch) {
        return {
          action: 'add_task',
          params: {
            title: altTitleMatch[1],
            description: '',
            completed: false,
            priority: 'medium'
          }
        };
      }
    }

    // Complete task command
    if (lowerCmd.includes('complete') || lowerCmd.includes('finish') || lowerCmd.includes('done')) {
      const taskNumberMatch = command.match(/(\d+)/);
      if (taskNumberMatch) {
        const taskIndex = parseInt(taskNumberMatch[1]) - 1;
        if (taskIndex >= 0 && taskIndex < tasks.length) {
          return {
            action: 'update_task',
            params: {
              id: tasks[taskIndex].id,
              updates: { completed: true }
            }
          };
        }
      }
    }

    // Delete task command
    if (lowerCmd.includes('delete') || lowerCmd.includes('remove')) {
      const taskNumberMatch = command.match(/(\d+)/);
      if (taskNumberMatch) {
        const taskIndex = parseInt(taskNumberMatch[1]) - 1;
        if (taskIndex >= 0 && taskIndex < tasks.length) {
          return {
            action: 'delete_task',
            params: {
              id: tasks[taskIndex].id
            }
          };
        }
      }
    }

    // Show tasks command
    if (lowerCmd.includes('show') || lowerCmd.includes('view') || lowerCmd.includes('list')) {
      return {
        action: 'show_tasks',
        params: {}
      };
    }

    // Filter tasks command
    if (lowerCmd.includes('active') || lowerCmd.includes('pending')) {
      return {
        action: 'set_filter',
        params: { filter: 'active' }
      };
    }

    if (lowerCmd.includes('completed')) {
      return {
        action: 'set_filter',
        params: { filter: 'completed' }
      };
    }

    if (lowerCmd.includes('all')) {
      return {
        action: 'set_filter',
        params: { filter: 'all' }
      };
    }

    // Sort tasks command
    if (lowerCmd.includes('sort') && lowerCmd.includes('title')) {
      return {
        action: 'set_sort_by',
        params: { sortBy: 'title' }
      };
    }

    if (lowerCmd.includes('sort') && (lowerCmd.includes('date') || lowerCmd.includes('time'))) {
      return {
        action: 'set_sort_by',
        params: { sortBy: 'created_at' }
      };
    }

    // Default response
    return {
      action: 'unknown',
      params: { message: "I can help you manage tasks. Try commands like:\n- 'Add task: Buy groceries'\n- 'Show tasks'\n- 'Complete task 1'\n- 'Delete task 2'\n- 'Show completed tasks'" }
    };
  }

  // Method to send command to Gemini API (real implementation)
  async sendToGemini(prompt: string): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('Gemini API key not configured');
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();
      return data.candidates[0]?.content.parts[0]?.text || "Sorry, I couldn't process that request.";
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();