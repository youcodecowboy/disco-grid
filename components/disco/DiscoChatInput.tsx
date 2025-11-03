'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useDiscoChatStore } from '@/lib/disco/store/useDiscoChatStore';
import { sendChatMessage } from '@/lib/disco/chatClient';

export function DiscoChatInput() {
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { addMessage, setTyping, setLoading } = useDiscoChatStore();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || isSending) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    addMessage({
      role: 'user',
      type: 'text',
      content: userMessage,
    });

    // Add loading message
    const loadingMessageId = `loading-${Date.now()}`;
    addMessage({
      role: 'assistant',
      type: 'text',
      content: '',
      isLoading: true,
    });

    setIsSending(true);
    setTyping(true);
    setLoading(true);

    try {
      // Get conversation history for context
      const messages = useDiscoChatStore.getState().messages;
      const recentMessages = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      // Send to API
      const response = await sendChatMessage(userMessage, recentMessages);
      
      // Remove loading message and add response
      const currentMessages = useDiscoChatStore.getState().messages;
      const updatedMessages = currentMessages.filter(msg => !msg.isLoading);
      
      useDiscoChatStore.setState({ messages: updatedMessages });
      
      addMessage({
        role: 'assistant',
        type: response.action ? 'action' : 'text',
        content: response.text,
        action: response.action,
        actionParams: response.actionParams,
      });

      // Handle action confirmation
      if (response.action && response.actionParams) {
        useDiscoChatStore.getState().setPendingAction({
          action: response.action,
          params: response.actionParams,
          preview: response.actionParams,
          message: response.text,
        });
      }

      // Handle clarification requests
      if (response.needsClarification && response.clarificationQuestions) {
        // Don't show action confirmation, just show the clarification message
        // The user will respond with more details
      }

      // Handle navigation if needed
      if (response.navigation) {
        useDiscoChatStore.getState().setPendingNavigation(response.navigation);
      }
    } catch (error) {
      // Remove loading message
      const messages = useDiscoChatStore.getState().messages;
      const updatedMessages = messages.filter(msg => !msg.isLoading);
      
      useDiscoChatStore.setState({ messages: updatedMessages });
      
      addMessage({
        role: 'assistant',
        type: 'error',
        content: error instanceof Error ? error.message : 'Sorry, something went wrong. Please try again.',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsSending(false);
      setTyping(false);
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Disco anything..."
          rows={1}
          className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          disabled={isSending}
        />
      </div>
      <button
        onClick={handleSend}
        disabled={!input.trim() || isSending}
        className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex-shrink-0"
        aria-label="Send message"
      >
        {isSending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}

