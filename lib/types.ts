export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed' | 'failed';
  progress?: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface BrowserState {
  url: string;
  content: string;
  title: string;
  isLoading: boolean;
}

export interface ApiResponse {
  text: string;
  tasks?: {
    title: string;
    description: string;
  }[];
  browserActions?: {
    url: string;
    action: 'navigate' | 'read' | 'search';
  }[];
  generatedContent?: {
    type: 'markdown' | 'pdf';
    title: string;
    content: string;
  };
}