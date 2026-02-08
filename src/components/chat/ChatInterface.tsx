// frontend/src/components/chat/ChatInterface.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Task } from '@/types/task';
import { Button } from '../Button';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatInterfaceProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => void;
  onUpdateTask: (id: number, updates: Partial<Task>) => void;
  onDeleteTask: (id: number) => void;
  onSetFilter: (filter: 'all' | 'active' | 'completed') => void;
  onSetSortBy: (sortBy: 'created_at' | 'title') => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onSetFilter,
  onSetSortBy
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Hello! I\'m your task assistant. You can ask me to add, edit, or view tasks. Try saying "Add a new task: Buy groceries"',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processUserCommand = (command: string): string => {
    const lowerCmd = command.toLowerCase().trim();

    // Add task command
    if (lowerCmd.includes('add') && (lowerCmd.includes('task') || lowerCmd.includes('new'))) {
      const titleMatch = command.match(/(?:add|create|new)\s+(?:a\s+)?(?:task|todo):\s*(.+)/i);
      if (titleMatch) {
        const title = titleMatch[1];
        onAddTask({
          title,
          description: '',
          completed: false,
          priority: 'medium',
          user_id: 0
        });
        return `Added task: "${title}"`;
      }

      // Alternative format: "Add task: Buy groceries"
      const altTitleMatch = command.match(/add\s+task:\s*(.+)/i);
      if (altTitleMatch) {
        const title = altTitleMatch[1];
        onAddTask({
          title,
          description: '',
          completed: false,
          priority: 'medium',
          user_id: 0
        });
        return `Added task: "${title}"`;
      }

      return "I didn't understand. Please say something like 'Add task: Buy groceries'";
    }

    // Complete task command
    if (lowerCmd.includes('complete') || lowerCmd.includes('finish') || lowerCmd.includes('done')) {
      const taskNumberMatch = command.match(/(\d+)/);
      if (taskNumberMatch) {
        const taskIndex = parseInt(taskNumberMatch[1]) - 1;
        if (taskIndex >= 0 && taskIndex < tasks.length) {
          const taskId = tasks[taskIndex].id;
          onUpdateTask(taskId, { completed: true });
          return `Marked task "${tasks[taskIndex].title}" as completed`;
        }
      }
      return "Please specify which task to complete by number";
    }

    // Delete task command
    if (lowerCmd.includes('delete') || lowerCmd.includes('remove')) {
      const taskNumberMatch = command.match(/(\d+)/);
      if (taskNumberMatch) {
        const taskIndex = parseInt(taskNumberMatch[1]) - 1;
        if (taskIndex >= 0 && taskIndex < tasks.length) {
          const taskId = tasks[taskIndex].id;
          onDeleteTask(taskId);
          return `Deleted task: "${tasks[taskIndex].title}"`;
        }
      }
      return "Please specify which task to delete by number";
    }

    // Show tasks command
    if (lowerCmd.includes('show') || lowerCmd.includes('view') || lowerCmd.includes('list')) {
      if (tasks.length === 0) {
        return "You don't have any tasks yet. Add some tasks first!";
      }

      let response = "Here are your tasks:\n";
      tasks.forEach((task, index) => {
        response += `${index + 1}. ${task.title} - ${task.completed ? '✓ Completed' : '○ Pending'}\n`;
      });
      return response;
    }

    // Filter tasks command
    if (lowerCmd.includes('active') || lowerCmd.includes('pending')) {
      onSetFilter('active');
      return "Now showing active tasks only";
    }

    if (lowerCmd.includes('completed')) {
      onSetFilter('completed');
      return "Now showing completed tasks only";
    }

    if (lowerCmd.includes('all')) {
      onSetFilter('all');
      return "Now showing all tasks";
    }

    // Sort tasks command
    if (lowerCmd.includes('sort') && lowerCmd.includes('title')) {
      onSetSortBy('title');
      return "Tasks sorted by title";
    }

    if (lowerCmd.includes('sort') && (lowerCmd.includes('date') || lowerCmd.includes('time'))) {
      onSetSortBy('created_at');
      return "Tasks sorted by date";
    }

    return "I can help you manage tasks. Try commands like:\n- 'Add task: Buy groceries'\n- 'Show tasks'\n- 'Complete task 1'\n- 'Delete task 2'\n- 'Show completed tasks'";
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Process the command locally for now
      // In a real implementation, you'd send this to an AI API
      const responseText = processUserCommand(inputValue);

      // Add bot response
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: responseText,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error processing your request.',
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-white rounded-full mr-2 animate-pulse"></div>
          <h3 className="text-lg font-semibold">Task Assistant</h3>
        </div>
        <p className="text-sm opacity-80">Ask me to manage your tasks</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-slate-50" style={{ maxHeight: '300px' }}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white rounded-br-none shadow-md'
                    : 'bg-slate-200 text-slate-800 rounded-bl-none shadow-md'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-100' : 'text-slate-500'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-200 text-slate-800 rounded-2xl rounded-bl-none p-4 shadow-md">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-slate-200 p-3 bg-white">
        <div className="flex">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me to manage your tasks..."
            className="flex-1 border border-slate-300 rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className="rounded-l-none py-3 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
        <div className="mt-2 text-xs text-slate-500">
          Examples: "Add task: Buy groceries", "Show tasks", "Complete task 1"
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;