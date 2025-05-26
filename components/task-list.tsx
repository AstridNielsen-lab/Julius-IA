"use client";

import React from 'react';
import { Task } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  // Only show tasks that are pending or recently completed (within the last 5 minutes)
  const recentTasks = tasks.filter(task => 
    task.status === 'pending' || 
    (task.status === 'completed' && 
     task.completedAt && 
     new Date().getTime() - new Date(task.completedAt).getTime() < 5 * 60 * 1000)
  );
  
  if (recentTasks.length === 0) return null;
  
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="font-medium mb-3">Tasks in Progress</h3>
      <div className="space-y-3">
        {recentTasks.map(task => (
          <div key={task.id} className="flex items-start gap-3">
            <div className="mt-0.5">
              {task.status === 'completed' ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : task.status === 'failed' ? (
                <AlertCircle className="h-5 w-5 text-destructive" />
              ) : (
                <Clock className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">{task.title}</span>
                <span className="text-xs text-muted-foreground">
                  {task.status === 'completed' ? 'Completed' : 
                   task.status === 'failed' ? 'Failed' : 
                   'In progress'}
                </span>
              </div>
              {task.description && (
                <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
              )}
              {task.status === 'pending' && (
                <Progress 
                  value={task.progress ?? Math.random() * 100} 
                  className="h-1.5"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}