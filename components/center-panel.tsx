"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Message } from '@/lib/types';
import { generateId } from '@/lib/utils';
import { TaskList } from '@/components/task-list';
import { GeneratedContentCard } from '@/components/generated-content-card';
import { SendHorizontal, Loader2 } from 'lucide-react';
import { sendMessageToAI } from '@/lib/api';

export function CenterPanel() {
  const { 
    messages, 
    addMessage, 
    isLoading, 
    setIsLoading,
    tasks,
    addTask,
    updateTaskStatus,
    updateBrowserState,
    addGeneratedContent
  } = useApp();
  
  const [inputValue, setInputValue] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    
    addMessage(userMessage);
    setInputValue('');
    
    // Focus the textarea after sending a message
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
    
    // Process the message
    setIsLoading(true);
    
    try {
      // Format conversation history for the API
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Send message to AI
      const response = await sendMessageToAI(inputValue, conversationHistory);
      
      // Add the AI's response to the messages
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: response.text,
        timestamp: new Date(),
      };
      
      addMessage(assistantMessage);
      
      // Process any browser actions
      if (response.browserActions && response.browserActions.length > 0) {
        const action = response.browserActions[0];
        updateBrowserState({ 
          url: action.url,
          isLoading: true,
          content: '',
          title: 'Loading...'
        });
        
        // Simulate browser loading
        setTimeout(async () => {
          try {
            const { content, title } = await fetch(`/api/browse?url=${encodeURIComponent(action.url)}`)
              .then(res => res.json());
            
            updateBrowserState({
              content,
              title,
              isLoading: false
            });
          } catch (error) {
            console.error('Error fetching browser content:', error);
            updateBrowserState({
              content: '<p>Failed to load content. Please try again.</p>',
              title: 'Error',
              isLoading: false
            });
          }
        }, 1500);
      }
      
      // Process any tasks
      if (response.tasks && response.tasks.length > 0) {
        response.tasks.forEach((task, index) => {
          // Add a slight delay between tasks for visual effect
          setTimeout(() => {
            addTask({
              id: generateId(),
              title: task.title,
              description: task.description,
              status: 'pending',
              createdAt: new Date(),
              progress: 0
            });
            
            // Simulate task progress
            const progressInterval = setInterval(() => {
              updateTaskStatus(generateId(), Math.random() > 0.8 ? 'completed' : 'pending');
            }, 2000 + Math.random() * 3000);
            
            // Clear interval after some time
            setTimeout(() => {
              clearInterval(progressInterval);
            }, 15000);
          }, index * 300);
        });
      }
      
      // Process any generated content
      if (response.generatedContent) {
        const { type, content, title } = response.generatedContent;
        addGeneratedContent(type, content, title);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Add an error message
      addMessage({
        id: generateId(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-resize textarea as user types
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    
    // Reset height to auto to get the correct scrollHeight
    e.target.style.height = 'auto';
    // Set new height based on scrollHeight (with a max height)
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-semibold">Chat</h2>
      </div>
      
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center p-8">
              <h3 className="text-xl font-medium mb-2">Welcome to AI Assistant</h3>
              <p className="text-muted-foreground mb-4">
                Ask me to search the web, generate content, or help with tasks.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-md mx-auto">
                <Button 
                  variant="outline" 
                  className="justify-start text-left"
                  onClick={() => setInputValue("Search for information about renewable energy")}
                >
                  Search the web
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start text-left"
                  onClick={() => setInputValue("Generate a document about climate change")}
                >
                  Generate content
                </Button>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <Card 
                key={message.id} 
                className={`${
                  message.role === 'user' ? 'bg-primary/5' : 'bg-card'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold min-w-14">
                      {message.role === 'user' ? 'You:' : 'AI:'}
                    </span>
                    <div className="flex-1">
                      {message.content.split('\n').map((paragraph, i) => (
                        <p key={i} className={i > 0 ? 'mt-2' : ''}>
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
          
          {isLoading && (
            <div className="flex flex-col items-center justify-center p-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Processing your request...</p>
              <Progress className="w-48 h-2 mt-2" value={65} />
            </div>
          )}
          
          {tasks.length > 0 && (
            <TaskList tasks={tasks} />
          )}
          
          {/* Generated content would be displayed here */}
          {messages.length > 0 && messages[messages.length - 1].role === 'assistant' && (
            <GeneratedContentCard />
          )}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-border">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleTextareaChange}
            placeholder="Type your message here..."
            className="resize-none min-h-[40px] max-h-[150px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!inputValue.trim() || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendHorizontal className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}