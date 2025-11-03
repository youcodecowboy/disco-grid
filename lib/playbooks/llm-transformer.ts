/**
 * LLM Playbook Transformer
 * 
 * Transforms LLM response to Playbook type structure
 * Validates data and handles missing/incomplete fields
 */

import type { Playbook, Play, TriggerCondition, PlayAssignment, PlayDependency, TaskPriority } from './types';

export interface LLMPlayResponse {
  sequence: number;
  title: string;
  description?: string;
  trigger: {
    type: string;
    workflowName?: string;
    stageName?: string;
    condition?: string;
    taskTitle?: string;
    taskSource?: string;
    mode?: string;
    relativeOffset?: {
      days: number;
      relativeTo: string;
    };
    frequency?: string;
    time?: string;
    weekday?: number;
    dayOfMonth?: number;
    timezone?: string;
    teamName?: string;
    thresholdType?: string;
    thresholdPercent?: number;
    lookbackOrders?: number;
  };
  taskTemplate: {
    title: string;
    description?: string;
    priority?: string;
    estimatedMinutes?: number;
    tags?: string[];
  };
  assignment: {
    type: string;
    mode?: string;
    teamName?: string;
    roleName?: string;
    userNames?: string[];
  };
  dependencies?: Array<{
    playTitle: string;
    type: string;
  }>;
}

export interface LLMPlaybookResponse {
  success: boolean;
  suggestedName?: string;
  suggestedDescription?: string;
  plays: LLMPlayResponse[];
}

/**
 * Transform LLM response to Playbook structure
 */
export function transformLLMResponseToPlaybook(
  llmResponse: LLMPlaybookResponse,
  playbookId: string,
  createdBy: string = "user-001"
): { playbook: Partial<Playbook>; plays: Play[]; issues: string[] } {
  const issues: string[] = [];
  const plays: Play[] = [];

  // Transform each play
  llmResponse.plays.forEach((llmPlay, index) => {
    try {
      const play = transformLLMPlayToPlay(llmPlay, playbookId, createdBy, llmResponse.plays);
      plays.push(play);
    } catch (error) {
      issues.push(`Failed to transform play ${index + 1} (${llmPlay.title || 'untitled'}): ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  // Sort plays by sequence
  plays.sort((a, b) => a.sequence - b.sequence);

  // Resolve dependencies by play title
  resolveDependencies(plays);

  return {
    playbook: {
      name: llmResponse.suggestedName || 'Untitled Playbook',
      description: llmResponse.suggestedDescription,
      plays: [],
      active: true,
    },
    plays,
    issues
  };
}

/**
 * Transform a single LLM play to Play type
 */
export function transformLLMPlayToPlay(
  llmPlay: LLMPlayResponse,
  playbookId: string,
  createdBy: string,
  allPlays: LLMPlayResponse[]
): Play {
  const now = new Date().toISOString();
  const id = `play-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Transform trigger
  const trigger = transformTrigger(llmPlay.trigger, llmPlay, allPlays);

  // Transform task template
  const taskTemplate = {
    title: llmPlay.taskTemplate.title || llmPlay.title || 'Untitled Task',
    description: llmPlay.taskTemplate.description || llmPlay.description,
    priority: (llmPlay.taskTemplate.priority?.toLowerCase() || 'medium') as TaskPriority,
    estimatedMinutes: llmPlay.taskTemplate.estimatedMinutes,
    tags: llmPlay.taskTemplate.tags || []
  };

  // Transform assignment
  const assignment = transformAssignment(llmPlay.assignment);

  // Transform dependencies (will be resolved later)
  const dependencies: PlayDependency[] = (llmPlay.dependencies || []).map(dep => ({
    playId: '', // Will be resolved later
    playTitle: dep.playTitle,
    type: 'finish_to_start' as const
  }));

  return {
    id,
    playbookId,
    sequence: llmPlay.sequence || 0,
    title: llmPlay.title || 'Untitled Play',
    description: llmPlay.description,
    trigger,
    taskTemplate,
    assignment,
    dependencies,
    enabled: true,
    createdAt: now,
    updatedAt: now,
    createdBy
  };
}

/**
 * Transform LLM trigger to Playbook TriggerCondition
 */
function transformTrigger(
  llmTrigger: LLMPlayResponse['trigger'],
  llmPlay: LLMPlayResponse,
  allPlays: LLMPlayResponse[]
): TriggerCondition {
  const type = llmTrigger.type;

  switch (type) {
    case 'order_accepted':
      return { type: 'order_accepted' };

    case 'order_completed':
      return {
        type: 'order_completed',
        orderId: undefined // Optional, can be specific order
      };

    case 'workflow_stage_change':
      return {
        type: 'workflow_stage_change',
        workflowId: '', // Will need resolution
        workflowName: llmTrigger.workflowName || '',
        stageId: '', // Will need resolution
        stageName: llmTrigger.stageName || '',
        condition: (llmTrigger.condition as 'enters' | 'exits' | 'completes') || 'enters'
      };

    case 'task_completion':
      return {
        type: 'task_completion',
        taskId: undefined,
        taskTitle: llmTrigger.taskTitle,
        taskSource: llmTrigger.taskSource as any || undefined,
        anyTaskMatching: llmTrigger.taskTitle ? {
          titleContains: llmTrigger.taskTitle
        } : undefined
      };

    case 'date_based':
      if (llmTrigger.mode === 'relative_to_order' && llmTrigger.relativeOffset) {
        return {
          type: 'date_based',
          mode: 'relative_to_order',
          relativeOffset: {
            days: llmTrigger.relativeOffset.days,
            relativeTo: llmTrigger.relativeOffset.relativeTo as any
          }
        };
      } else {
        return {
          type: 'date_based',
          mode: 'specific_date',
          specificDate: undefined // Will need user input
        };
      }

    case 'time_based':
      return {
        type: 'time_based',
        frequency: (llmTrigger.frequency as 'daily' | 'weekly' | 'monthly') || 'daily',
        time: llmTrigger.time || '09:00',
        weekday: llmTrigger.weekday,
        dayOfMonth: llmTrigger.dayOfMonth,
        timezone: llmTrigger.timezone || 'America/New_York'
      };

    case 'capacity_based':
      return {
        type: 'capacity_based',
        teamId: '', // Will need resolution
        teamName: llmTrigger.teamName || '',
        thresholdType: (llmTrigger.thresholdType as 'below' | 'above') || 'below',
        thresholdPercent: llmTrigger.thresholdPercent || 50
      };

    case 'order_completion_previous':
      return {
        type: 'order_completion_previous',
        lookbackOrders: llmTrigger.lookbackOrders || 1
      };

    default:
      // Default to order_accepted if type is unknown
      console.warn(`Unknown trigger type: ${type}, defaulting to order_accepted`);
      return { type: 'order_accepted' };
  }
}

/**
 * Transform LLM assignment to Playbook PlayAssignment
 */
function transformAssignment(llmAssignment: LLMPlayResponse['assignment']): PlayAssignment {
  if (llmAssignment.type === 'specific_people') {
    return {
      type: 'specific_people',
      userIds: [] // Will need resolution from userNames
    };
  } else {
    // role_team
    return {
      type: 'role_team',
      mode: (llmAssignment.mode as 'team' | 'role') || 'team',
      teamId: undefined, // Will need resolution
      teamName: llmAssignment.teamName,
      roleId: undefined, // Will need resolution
      roleName: llmAssignment.roleName
    };
  }
}

/**
 * Resolve dependencies by matching play titles to play IDs
 */
function resolveDependencies(plays: Play[]): void {
  // Create a map of play titles to play IDs
  const titleToIdMap = new Map<string, string>();
  plays.forEach(play => {
    titleToIdMap.set(play.title.toLowerCase(), play.id);
  });

  // Resolve dependencies
  plays.forEach(play => {
    play.dependencies = play.dependencies.map(dep => {
      const playId = titleToIdMap.get(dep.playTitle.toLowerCase());
      if (playId) {
        return {
          ...dep,
          playId
        };
      }
      // If not found, keep the original (will be marked as gap)
      return dep;
    });
  });
}

/**
 * Validate playbook structure
 */
export function validatePlaybook(playbook: Partial<Playbook>, plays: Play[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!playbook.name || playbook.name.trim() === '') {
    errors.push('Playbook name is required');
  }

  if (plays.length === 0) {
    errors.push('Playbook must have at least one play');
  }

  plays.forEach((play, index) => {
    if (!play.title || play.title.trim() === '') {
      errors.push(`Play ${index + 1} is missing a title`);
    }

    if (!play.taskTemplate.title || play.taskTemplate.title.trim() === '') {
      errors.push(`Play ${index + 1} is missing a task template title`);
    }

    // Check for unresolved dependencies
    play.dependencies.forEach((dep, depIndex) => {
      if (!dep.playId) {
        errors.push(`Play "${play.title}" has unresolved dependency "${dep.playTitle}"`);
      }
    });

    // Check for unresolved trigger IDs
    if (play.trigger.type === 'workflow_stage_change') {
      if (!play.trigger.workflowId || !play.trigger.stageId) {
        errors.push(`Play "${play.title}" has unresolved workflow/stage IDs`);
      }
    }

    if (play.trigger.type === 'capacity_based') {
      if (!play.trigger.teamId) {
        errors.push(`Play "${play.title}" has unresolved team ID`);
      }
    }

    // Check for unresolved assignment IDs
    if (play.assignment.type === 'role_team') {
      if (play.assignment.mode === 'team' && !play.assignment.teamId) {
        errors.push(`Play "${play.title}" has unresolved team ID`);
      }
      if (play.assignment.mode === 'role' && !play.assignment.roleId) {
        errors.push(`Play "${play.title}" has unresolved role ID`);
      }
    }

    if (play.assignment.type === 'specific_people') {
      if (!play.assignment.userIds || play.assignment.userIds.length === 0) {
        errors.push(`Play "${play.title}" has unresolved user IDs`);
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

