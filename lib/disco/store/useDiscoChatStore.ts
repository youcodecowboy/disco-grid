// Disco Chat Assistant - State Management with Zustand

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { DiscoMessage, DiscoChatState, ActionConfirmation, ChatSession } from '../types';

interface DiscoChatStore extends DiscoChatState {
  // Drawer actions
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  
  // Session management
  createNewSession: () => void;
  loadSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  updateSessionTitle: (sessionId: string, title: string) => void;
  
  // Message actions
  addMessage: (message: Omit<DiscoMessage, 'id' | 'timestamp'>) => void;
  updateMessage: (id: string, updates: Partial<DiscoMessage>) => void;
  clearMessages: () => void;
  
  // Loading states
  setTyping: (isTyping: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Action flow
  setPendingAction: (action: ActionConfirmation | null) => void;
  setPendingNavigation: (url: string | null) => void;
  confirmAction: () => void;
  cancelAction: () => void;
  
  // Context
  setCurrentPage: (page: string) => void;
  
  // History sidebar
  toggleHistorySidebar: () => void;
  
  // Initialization
  initialize: () => void;
}

const STORAGE_KEY = 'disco-chat-state';

// Helper to generate session ID
function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Helper to generate message ID
function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Load initial messages (welcome message)
function getInitialMessages(): DiscoMessage[] {
  return [
    {
      id: generateMessageId(),
      role: 'system',
      type: 'text',
      content: 'Hi! I\'m Disco, your AI assistant. I can help you create workflows, tasks, send messages, and more. What would you like to do?',
      timestamp: new Date(),
    },
  ];
}

// Helper to generate session title from first user message
function generateSessionTitle(messages: DiscoMessage[]): string {
  const firstUserMessage = messages.find(msg => msg.role === 'user');
  if (firstUserMessage) {
    const content = firstUserMessage.content.trim();
    return content.length > 50 ? content.substring(0, 50) + '...' : content;
  }
  return 'New Chat';
}

export const useDiscoChatStore = create<DiscoChatStore>()(
  persist(
    (set, get) => {
      // Create initial session
      const initialSessionId = generateSessionId();
      const initialMessages = getInitialMessages();
      const initialSession: ChatSession = {
        id: initialSessionId,
        title: 'New Chat',
        messages: initialMessages,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return {
        // Initial state
        isOpen: false,
        isTyping: false,
        currentSessionId: initialSessionId,
        sessions: [initialSession],
        messages: initialMessages,
        pendingAction: null,
        pendingNavigation: null,
        isLoading: false,
        error: null,
        currentPage: '/',
        lastContextUpdate: new Date(),
        showHistorySidebar: false,
        
        // Drawer actions
        openDrawer: () => set({ isOpen: true }),
        closeDrawer: () => set({ isOpen: false }),
        toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),
        
        // Session management
        createNewSession: () => {
          const state = get();
          // Save current session before creating new one
          if (state.currentSessionId && state.messages.length > 1) {
            // Update current session title if needed
            const currentSession = state.sessions.find(s => s.id === state.currentSessionId);
            if (currentSession) {
              const title = generateSessionTitle(state.messages);
              const updatedSessions = state.sessions.map(s =>
                s.id === state.currentSessionId
                  ? { ...s, title, messages: state.messages, updatedAt: new Date() }
                  : s
              );
              set({ sessions: updatedSessions });
            }
          }
          
          // Create new session
          const newSessionId = generateSessionId();
          const newSession: ChatSession = {
            id: newSessionId,
            title: 'New Chat',
            messages: getInitialMessages(),
            createdAt: new Date(),
            updatedAt: new Date(),
            currentPage: state.currentPage,
          };
          
          set({
            currentSessionId: newSessionId,
            sessions: [...state.sessions, newSession],
            messages: getInitialMessages(),
            pendingAction: null,
            pendingNavigation: null,
          });
        },
        
        loadSession: (sessionId: string) => {
          const state = get();
          const session = state.sessions.find(s => s.id === sessionId);
          if (session) {
            // Save current session before switching
            if (state.currentSessionId && state.messages.length > 1) {
              const currentSession = state.sessions.find(s => s.id === state.currentSessionId);
              if (currentSession) {
                const title = generateSessionTitle(state.messages);
                const updatedSessions = state.sessions.map(s =>
                  s.id === state.currentSessionId
                    ? { ...s, title, messages: state.messages, updatedAt: new Date() }
                    : s
                );
                set({ sessions: updatedSessions });
              }
            }
            
            // Load the selected session
            set({
              currentSessionId: sessionId,
              messages: session.messages.map(msg => ({
                ...msg,
                timestamp: new Date(msg.timestamp),
              })),
              pendingAction: null,
              pendingNavigation: null,
            });
          }
        },
        
        deleteSession: (sessionId: string) => {
          const state = get();
          const updatedSessions = state.sessions.filter(s => s.id !== sessionId);
          
          // If deleting current session, switch to first available or create new
          if (state.currentSessionId === sessionId) {
            if (updatedSessions.length > 0) {
              const firstSession = updatedSessions[0];
              set({
                sessions: updatedSessions,
                currentSessionId: firstSession.id,
                messages: firstSession.messages.map(msg => ({
                  ...msg,
                  timestamp: new Date(msg.timestamp),
                })),
              });
            } else {
              // Create new session if none left
              const newSessionId = generateSessionId();
              const newSession: ChatSession = {
                id: newSessionId,
                title: 'New Chat',
                messages: getInitialMessages(),
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              set({
                sessions: [newSession],
                currentSessionId: newSessionId,
                messages: getInitialMessages(),
              });
            }
          } else {
            set({ sessions: updatedSessions });
          }
        },
        
        updateSessionTitle: (sessionId: string, title: string) => {
          const state = get();
          set({
            sessions: state.sessions.map(s =>
              s.id === sessionId ? { ...s, title, updatedAt: new Date() } : s
            ),
          });
        },
        
        // Message actions
        addMessage: (messageData) => {
          const message: DiscoMessage = {
            ...messageData,
            id: generateMessageId(),
            timestamp: new Date(),
          };
          set((state) => {
            const newMessages = [...state.messages, message];
            // Update current session's messages
            const updatedSessions = state.sessions.map(session =>
              session.id === state.currentSessionId
                ? { ...session, messages: newMessages, updatedAt: new Date() }
                : session
            );
            
            return {
              messages: newMessages,
              sessions: updatedSessions,
            };
          });
          
          // Auto-update session title from first user message
          const stateAfter = get();
          const currentSession = stateAfter.sessions.find(s => s.id === stateAfter.currentSessionId);
          if (currentSession && currentSession.title === 'New Chat' && messageData.role === 'user') {
            const title = generateSessionTitle([...stateAfter.messages, message]);
            get().updateSessionTitle(stateAfter.currentSessionId!, title);
          }
        },
        
        updateMessage: (id, updates) => {
          set((state) => {
            const updatedMessages = state.messages.map((msg) =>
              msg.id === id ? { ...msg, ...updates } : msg
            );
            
            // Update current session's messages
            const updatedSessions = state.sessions.map(session =>
              session.id === state.currentSessionId
                ? { ...session, messages: updatedMessages, updatedAt: new Date() }
                : session
            );
            
            return {
              messages: updatedMessages,
              sessions: updatedSessions,
            };
          });
        },
        
        clearMessages: () => {
          const initialState = getInitialMessages();
          set((state) => {
            const updatedSessions = state.sessions.map(session =>
              session.id === state.currentSessionId
                ? { ...session, messages: initialState, updatedAt: new Date() }
                : session
            );
            
            return {
              messages: initialState,
              sessions: updatedSessions,
            };
          });
        },
        
        // Loading states
        setTyping: (isTyping) => set({ isTyping }),
        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),
        
        // Action flow
        setPendingAction: (action) => set({ pendingAction: action }),
        setPendingNavigation: (url) => set({ pendingNavigation: url }),
        
        confirmAction: () => {
          const { pendingAction } = get();
          if (pendingAction) {
            // Add confirmation message
            get().addMessage({
              role: 'user',
              type: 'action',
              content: `Confirming: ${pendingAction.message}`,
              action: pendingAction.action as any,
              actionParams: pendingAction.params,
              actionConfirmed: true,
            });
            
            // Clear pending action
            set({ pendingAction: null });
          }
        },
        
        cancelAction: () => {
          set({
            pendingAction: null,
            pendingNavigation: null,
          });
          
          // Add cancellation message
          get().addMessage({
            role: 'assistant',
            type: 'text',
            content: 'Action cancelled. What else can I help you with?',
          });
        },
        
        // Context
        setCurrentPage: (page) => {
          set({
            currentPage: page,
            lastContextUpdate: new Date(),
          });
        },
        
        // History sidebar
        toggleHistorySidebar: () => set((state) => ({ showHistorySidebar: !state.showHistorySidebar })),
        
        // Initialization
        initialize: () => {
          // Restore from localStorage is handled by persist middleware
          // Additional initialization can go here
        },
      };
    },
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // Persist sessions and current session
      partialize: (state) => ({
        currentSessionId: state.currentSessionId,
        sessions: state.sessions.map(session => ({
          ...session,
          messages: session.messages.map(msg => ({
            ...msg,
            timestamp: msg.timestamp.toISOString(),
          })),
          createdAt: session.createdAt.toISOString(),
          updatedAt: session.updatedAt.toISOString(),
        })),
        currentPage: state.currentPage,
        lastContextUpdate: state.lastContextUpdate.toISOString(),
      }),
      // Custom deserializer to handle Date objects
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert ISO strings back to Date objects
          state.sessions = state.sessions.map(session => ({
            ...session,
            messages: session.messages.map(msg => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            })),
            createdAt: new Date(session.createdAt),
            updatedAt: new Date(session.updatedAt),
          }));
          
          // Load messages from current session
          const currentSession = state.sessions.find(s => s.id === state.currentSessionId);
          if (currentSession) {
            state.messages = currentSession.messages;
          } else if (state.sessions.length > 0) {
            // Fallback to first session if current doesn't exist
            state.currentSessionId = state.sessions[0].id;
            state.messages = state.sessions[0].messages;
          } else {
            // Create new session if none exist
            const newSessionId = generateSessionId();
            const newSession: ChatSession = {
              id: newSessionId,
              title: 'New Chat',
              messages: getInitialMessages(),
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            state.sessions = [newSession];
            state.currentSessionId = newSessionId;
            state.messages = getInitialMessages();
          }
          
          state.lastContextUpdate = new Date(state.lastContextUpdate);
        }
      },
    }
  )
);

