// Disco Context Collector - Gathers current page context and user data

import type { DiscoSystemContext } from './types';

export async function collectContext(): Promise<DiscoSystemContext> {
  // Get current page pathname
  const currentPage = typeof window !== 'undefined' ? window.location.pathname : '/';

  // Build context object
  const context: DiscoSystemContext = {
    currentPage,
    availableActions: [
      'create_workflow',
      'create_task',
      'send_message',
      'create_dashboard',
      'create_playbook',
      'navigate',
      'help',
    ],
  };

  // In the future, we can add:
  // - User data (teams, items, orders)
  // - Recent activities
  // - Current page state

  return context;
}

