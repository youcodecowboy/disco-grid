// Disco Chat Client - Handles communication with chat API

import type { DiscoChatResponse } from '../types';
import { collectContext } from './contextCollector';

export async function sendChatMessage(
  userMessage: string,
  conversationHistory?: Array<{ role: string; content: string }>
): Promise<DiscoChatResponse> {
  // Collect context
  const context = await collectContext();

  // Call API
  const response = await fetch('/api/disco/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: userMessage,
      context,
      conversationHistory: conversationHistory || [],
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `API error: ${response.status}`);
  }

  return response.json();
}

