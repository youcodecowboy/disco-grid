// Disco Orchestrator - Routes actions to appropriate API endpoints

import type { ActionType } from './types';

interface OrchestrationResult {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Execute a workflow creation action
 */
export async function executeWorkflowAction(params: Record<string, any>): Promise<OrchestrationResult> {
  try {
    let description = params.description || params.initialDescription || 'Create a workflow';
    
    // If description is too short, enrich it first
    if (description.length < 50) {
      console.log('⚠️ Description too short, enriching...');
      const enrichResponse = await fetch('/api/disco/enrich-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          context: params.context || {},
        }),
      });

      if (enrichResponse.ok) {
        const enrichData = await enrichResponse.json();
        if (enrichData.success && enrichData.enrichedDescription) {
          description = enrichData.enrichedDescription;
          console.log('✅ Description enriched:', {
            original: params.description?.length || 0,
            enriched: description.length,
          });
        }
      } else {
        console.warn('⚠️ Enrichment failed, proceeding with original description');
      }
    }

    const response = await fetch('/api/nlp/workflow/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description,
        context: params.context || {},
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Execute a task creation action
 */
export async function executeTaskAction(params: Record<string, any>): Promise<OrchestrationResult> {
  try {
    // Use the LLM suggest endpoint to generate task details
    const response = await fetch('/api/tasks-v2/llm-suggest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userInput: params.goal || params.description || 'Create a task',
        context: params.context || {},
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Execute a playbook creation action
 */
export async function executePlaybookAction(params: Record<string, any>): Promise<OrchestrationResult> {
  try {
    let description = params.description || params.initialDescription || 'Create a playbook';
    
    // If description is too short, enrich it first
    if (description.length < 50) {
      console.log('⚠️ Description too short, enriching...');
      const enrichResponse = await fetch('/api/disco/enrich-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          context: params.context || {},
        }),
      });

      if (enrichResponse.ok) {
        const enrichData = await enrichResponse.json();
        if (enrichData.success && enrichData.enrichedDescription) {
          description = enrichData.enrichedDescription;
          console.log('✅ Description enriched:', {
            original: params.description?.length || 0,
            enriched: description.length,
          });
        }
      } else {
        console.warn('⚠️ Enrichment failed, proceeding with original description');
      }
    }

    const response = await fetch('/api/nlp/playbook/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description,
        context: params.context || {},
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Execute a dashboard creation action
 */
export async function executeDashboardAction(params: Record<string, any>): Promise<OrchestrationResult> {
  try {
    const response = await fetch('/api/dashboard/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: params.description || 'Create a dashboard',
        requirements: params.requirements || [],
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Main orchestrator function - routes actions to appropriate handlers
 */
export async function orchestrateAction(
  action: ActionType,
  params: Record<string, any>
): Promise<OrchestrationResult> {
  switch (action) {
    case 'create_workflow':
      return executeWorkflowAction(params);
    case 'create_task':
      return executeTaskAction(params);
    case 'create_playbook':
      return executePlaybookAction(params);
    case 'create_dashboard':
      return executeDashboardAction(params);
    case 'send_message':
      // TODO: Implement message sending
      return { success: false, error: 'Message sending not yet implemented' };
    case 'navigate':
      // Navigation is handled client-side
      return { success: true };
    case 'help':
      // Help is handled by the chat response
      return { success: true };
    default:
      return { success: false, error: `Unknown action: ${action}` };
  }
}

