"use client";

import React from 'react';
import { useApp } from '@/context/app-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCcw, ArrowLeft, ArrowRight, Home, Search } from 'lucide-react';
import { simulateBrowsing } from '@/lib/utils';

export function RightPanel() {
  const { browserState, updateBrowserState } = useApp();
  const [urlInput, setUrlInput] = React.useState(browserState.url);
  
  React.useEffect(() => {
    setUrlInput(browserState.url);
  }, [browserState.url]);
  
  const handleBrowse = async (url: string) => {
    if (!url) return;
    
    // Format URL if needed
    if (!url.startsWith('http')) {
      url = `https://${url}`;
    }
    
    updateBrowserState({
      url,
      isLoading: true,
      title: 'Loading...',
      content: ''
    });
    
    try {
      const { content, title } = await simulateBrowsing(url);
      
      updateBrowserState({
        content,
        title,
        isLoading: false
      });
    } catch (error) {
      console.error('Error browsing:', error);
      updateBrowserState({
        content: '<p>Failed to load content. Please try again.</p>',
        title: 'Error',
        isLoading: false
      });
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-semibold">AI Browser</h2>
      </div>
      
      <div className="p-2 border-b border-border">
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <RefreshCcw className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <Home className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 flex items-center px-2 py-1 rounded-md border border-input bg-background">
            <Search className="h-3.5 w-3.5 text-muted-foreground mr-2" />
            <Input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleBrowse(urlInput);
                }
              }}
              className="border-0 h-7 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Enter URL or search..."
            />
          </div>
        </div>
      </div>
      
      <div className="p-2 border-b border-border flex items-center">
        <h3 className="text-sm font-medium truncate flex-1">
          {browserState.isLoading ? 'Loading...' : browserState.title || 'New Tab'}
        </h3>
      </div>
      
      <ScrollArea className="flex-1">
        {browserState.isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-3/4 h-4" />
            <Skeleton className="w-full h-32" />
            <Skeleton className="w-1/2 h-4" />
            <Skeleton className="w-full h-20" />
          </div>
        ) : browserState.content ? (
          <div 
            className="p-6"
            dangerouslySetInnerHTML={{ __html: browserState.content }}
          />
        ) : (
          <Card className="m-6 border-dashed">
            <CardContent className="p-6 text-center">
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
              <h3 className="text-lg font-medium mb-2">Browser Ready</h3>
              <p className="text-muted-foreground mb-4">
                Ask the AI to search for information or enter a URL above to start browsing.
              </p>
            </CardContent>
          </Card>
        )}
      </ScrollArea>
    </div>
  );
}