"use client";

import { useState, useEffect } from 'react';
import { LeftPanel } from '@/components/left-panel';
import { CenterPanel } from '@/components/center-panel';
import { RightPanel } from '@/components/right-panel';
import { AppProvider } from '@/context/app-context';

export function AppLayout() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  return (
    <AppProvider>
      <div className="flex flex-col md:flex-row h-screen w-full bg-background overflow-hidden">
        {/* Left Panel - History */}
        <div className={`${isMobile ? 'hidden' : 'w-1/4 border-r border-border'} h-full`}>
          <LeftPanel />
        </div>
        
        {/* Center Panel - Chat */}
        <div className={`${isMobile ? 'w-full' : 'w-2/5'} h-full border-r border-border`}>
          <CenterPanel />
        </div>
        
        {/* Right Panel - AI Browser */}
        <div className={`${isMobile ? 'hidden' : 'w-5/12'} h-full`}>
          <RightPanel />
        </div>
      </div>
    </AppProvider>
  );
}