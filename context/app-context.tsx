"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Message, Task, BrowserState } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface AppContextType {
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTaskStatus: (id: string, status: 'pending' | 'completed' | 'failed') => void;
  browserState: BrowserState;
  updateBrowserState: (state: Partial<BrowserState>) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  generatedContent: { type: string; content: string; title: string }[];
  addGeneratedContent: (type: string, content: string, title: string) => void;
}

const AppContext = createContext<AppContextType>({
  messages: [],
  addMessage: () => {},
  clearMessages: () => {},
  tasks: [],
  addTask: () => {},
  updateTaskStatus: () => {},
  browserState: { url: '', content: '', title: '', isLoading: false },
  updateBrowserState: () => {},
  isLoading: false,
  setIsLoading: () => {},
  generatedContent: [],
  addGeneratedContent: () => {},
});

export const useApp = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [browserState, setBrowserState] = useState<BrowserState>({ 
    url: '', 
    content: '', 
    title: '',
    isLoading: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{ type: string; content: string; title: string }[]>([]);
  const { toast } = useToast();

  // Load data from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('ai-assistant-messages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }

    const savedTasks = localStorage.getItem('ai-assistant-tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }

    const savedContent = localStorage.getItem('ai-assistant-content');
    if (savedContent) {
      setGeneratedContent(JSON.parse(savedContent));
    }
  }, []);

  // Save data to localStorage when updated
  useEffect(() => {
    localStorage.setItem('ai-assistant-messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('ai-assistant-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('ai-assistant-content', JSON.stringify(generatedContent));
  }, [generatedContent]);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const addTask = (task: Task) => {
    setTasks(prev => [...prev, task]);
  };

  const updateTaskStatus = (id: string, status: 'pending' | 'completed' | 'failed') => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id 
          ? { ...task, status, completedAt: status === 'completed' ? new Date() : undefined } 
          : task
      )
    );

    if (status === 'completed') {
      toast({
        title: "Task completed",
        description: `Task "${tasks.find(t => t.id === id)?.title}" has been completed.`,
      });
    }
  };

  const updateBrowserState = (state: Partial<BrowserState>) => {
    setBrowserState(prev => ({ ...prev, ...state }));
  };

  const addGeneratedContent = (type: string, content: string, title: string) => {
    setGeneratedContent(prev => [...prev, { type, content, title }]);
  };

  return (
    <AppContext.Provider value={{
      messages,
      addMessage,
      clearMessages,
      tasks,
      addTask,
      updateTaskStatus,
      browserState,
      updateBrowserState,
      isLoading,
      setIsLoading,
      generatedContent,
      addGeneratedContent
    }}>
      {children}
    </AppContext.Provider>
  );
};