// Disco Chat Assistant - Type Definitions

export type MessageRole = 'user' | 'assistant' | 'system' | 'action';

export type MessageType = 'text' | 'action' | 'confirmation' | 'error';

export type ActionType = 
  | 'create_workflow'
  | 'create_task'
  | 'send_message'
  | 'create_dashboard'
  | 'create_playbook'
  | 'navigate'
  | 'help'
  | 'ask_clarification';

export interface DiscoMessage {
  id: string;
  role: MessageRole;
  type: MessageType;
  content: string;
  timestamp: Date;
  
  // Action-related fields
  action?: ActionType;
  actionParams?: Record<string, any>;
  actionPreview?: any; // Preview of what will be created
  actionConfirmed?: boolean;
  
  // UI state
  isLoading?: boolean;
  error?: string;
}

export interface ActionConfirmation {
  action: ActionType;
  params: Record<string, any>;
  preview: any;
  message: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: DiscoMessage[];
  createdAt: Date;
  updatedAt: Date;
  currentPage?: string;
}

export interface DiscoChatState {
  // Drawer state
  isOpen: boolean;
  isTyping: boolean;
  
  // Current session
  currentSessionId: string | null;
  sessions: ChatSession[];
  
  // Messages (from current session)
  messages: DiscoMessage[];
  
  // Current action flow
  pendingAction: ActionConfirmation | null;
  pendingNavigation: string | null; // URL to navigate to
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Context
  currentPage: string;
  lastContextUpdate: Date;
  
  // Chat history sidebar
  showHistorySidebar: boolean;
}

export interface DiscoChatResponse {
  text: string;
  action?: ActionType;
  actionParams?: Record<string, any>;
  navigation?: string;
  suggestedActions?: string[];
  needsClarification?: boolean;
  clarificationQuestions?: string[];
}

export interface DiscoSystemContext {
  currentPage: string;
  userData?: {
    teams?: any[];
    recentItems?: any[];
    recentOrders?: any[];
  };
  availableActions: string[];
}

