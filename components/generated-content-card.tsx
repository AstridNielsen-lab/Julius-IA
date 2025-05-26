"use client";

import React from 'react';
import { useApp } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { markdownToPdf } from '@/lib/utils';
import { FileDown, FileText, FileTerminal } from 'lucide-react';

export function GeneratedContentCard() {
  const { generatedContent } = useApp();
  
  // Only show the most recently generated content
  const latestContent = generatedContent.length > 0 
    ? generatedContent[generatedContent.length - 1] 
    : null;
  
  if (!latestContent) return null;
  
  const handleDownloadMarkdown = () => {
    const blob = new Blob([latestContent.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${latestContent.title.replace(/\s+/g, '-').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleDownloadPDF = () => {
    const pdfBlob = markdownToPdf(latestContent.content);
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${latestContent.title.replace(/\s+/g, '-').toLowerCase()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <Card className="bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <FileTerminal className="h-6 w-6 text-primary mt-1" />
          <div className="flex-1">
            <h3 className="font-medium mb-2">Generated Content: {latestContent.title}</h3>
            <div className="bg-card rounded-md p-3 max-h-60 overflow-y-auto text-sm">
              <pre className="whitespace-pre-wrap font-mono text-xs">
                {latestContent.content.substring(0, 600)}
                {latestContent.content.length > 600 && '...'}
              </pre>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 justify-end gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDownloadMarkdown}
        >
          <FileText className="h-4 w-4 mr-1" />
          Download MD
        </Button>
        <Button 
          variant="default" 
          size="sm"
          onClick={handleDownloadPDF}
        >
          <FileDown className="h-4 w-4 mr-1" />
          Download PDF
        </Button>
      </CardFooter>
    </Card>
  );
}