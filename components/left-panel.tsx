"use client";

import React, { useState } from 'react';
import { useApp } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDate, truncateText } from '@/lib/utils';
import { FilePenLine, History, FileText, Trash2 } from 'lucide-react';

export function LeftPanel() {
  const { messages, clearMessages, generatedContent } = useApp();
  const [activeTab, setActiveTab] = useState('history');
  
  // Group messages by date for the conversation history
  const messagesByDate = messages.reduce((acc, message) => {
    if (message.role === 'user') {
      const date = new Date(message.timestamp).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(message);
    }
    return acc;
  }, {} as Record<string, typeof messages>);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-semibold">AI Assistant</h2>
      </div>
      
      <Tabs 
        defaultValue="history" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <div className="px-4 pt-2">
          <TabsList className="w-full">
            <TabsTrigger value="history" className="flex-1">
              <History className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex-1">
              <FileText className="w-4 h-4 mr-2" />
              Documents
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="history" className="flex-1 flex flex-col p-4 pt-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Conversation History</h3>
            {messages.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearMessages}
                className="h-8 px-2"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
          
          <ScrollArea className="flex-1">
            {Object.keys(messagesByDate).length > 0 ? (
              Object.entries(messagesByDate).map(([date, dateMessages]) => (
                <div key={date} className="mb-6">
                  <h4 className="text-xs font-medium text-muted-foreground mb-2">{date}</h4>
                  {dateMessages.map(message => (
                    <Card key={message.id} className="mb-2 hover:bg-accent/10 transition-colors">
                      <CardHeader className="p-3 pb-1">
                        <CardTitle className="text-sm font-medium">
                          {truncateText(message.content, 50)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <CardDescription className="text-xs">
                          {formatDate(message.timestamp)}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground p-4">
                <History className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>No conversation history yet</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="documents" className="flex-1 flex flex-col p-4 pt-2">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Generated Documents</h3>
          
          <ScrollArea className="flex-1">
            {generatedContent.length > 0 ? (
              generatedContent.map((doc, index) => (
                <Card key={index} className="mb-3 hover:bg-accent/10 transition-colors">
                  <CardHeader className="p-3 pb-1 flex flex-row justify-between items-start">
                    <CardTitle className="text-sm font-medium">
                      {doc.title}
                    </CardTitle>
                    <FilePenLine className="w-4 h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <CardDescription className="text-xs">
                      {doc.type.toUpperCase()} • {formatDate(new Date())}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center text-muted-foreground p-4">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>No documents generated yet</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}