/**
 * Playbook Updater
 * 
 * Applies answers from enrichment questions back to the playbook structure
 */

import type { GeneratedPlaybook } from './gap-analyzer';
import type { EnrichmentQuestion } from './question-generator';
import type { Play } from '../types';

export interface PlaybookUpdate {
  playIndex?: number;
  playId?: string;
  field: string;
  value: any;
}

/**
 * Map question answer to playbook field
 */
export function mapAnswerToPlaybookField(
  question: EnrichmentQuestion,
  answer: string
): PlaybookUpdate | null {
  if (!question.field) {
    return null;
  }

  // Map common field types based on question type and field path
  switch (question.type) {
    case 'trigger':
      // Handle trigger-related fields
      if (question.field.includes('trigger.workflowId')) {
        return {
          playIndex: question.playIndex,
          playId: question.playId,
          field: 'trigger.workflowId',
          value: answer
        };
      }
      if (question.field.includes('trigger.stageId')) {
        return {
          playIndex: question.playIndex,
          playId: question.playId,
          field: 'trigger.stageId',
          value: answer
        };
      }
      if (question.field.includes('trigger.teamId')) {
        return {
          playIndex: question.playIndex,
          playId: question.playId,
          field: 'trigger.teamId',
          value: answer
        };
      }
      if (question.field.includes('trigger.taskTitle')) {
        return {
          playIndex: question.playIndex,
          playId: question.playId,
          field: 'trigger.taskTitle',
          value: answer
        };
      }
      if (question.field.includes('trigger.specificDate')) {
        return {
          playIndex: question.playIndex,
          playId: question.playId,
          field: 'trigger.specificDate',
          value: answer
        };
      }
      break;

    case 'assignment':
      // Handle assignment-related fields
      if (question.field.includes('assignment.teamId')) {
        return {
          playIndex: question.playIndex,
          playId: question.playId,
          field: 'assignment.teamId',
          value: answer
        };
      }
      if (question.field.includes('assignment.roleId')) {
        return {
          playIndex: question.playIndex,
          playId: question.playId,
          field: 'assignment.roleId',
          value: answer
        };
      }
      if (question.field.includes('assignment.userIds')) {
        return {
          playIndex: question.playIndex,
          playId: question.playId,
          field: 'assignment.userIds',
          value: answer.split(',').map((id: string) => id.trim())
        };
      }
      break;

    case 'task':
      // Handle task template fields
      if (question.field.includes('taskTemplate.title')) {
        return {
          playIndex: question.playIndex,
          playId: question.playId,
          field: 'taskTemplate.title',
          value: answer
        };
      }
      if (question.field.includes('taskTemplate.description')) {
        return {
          playIndex: question.playIndex,
          playId: question.playId,
          field: 'taskTemplate.description',
          value: answer
        };
      }
      if (question.field.includes('taskTemplate.priority')) {
        return {
          playIndex: question.playIndex,
          playId: question.playId,
          field: 'taskTemplate.priority',
          value: answer.toLowerCase()
        };
      }
      break;

    case 'dependency':
      // Handle dependency linking
      if (question.field.startsWith('dependencies[')) {
        const depIndex = parseInt(question.field.match(/\[(\d+)\]/)?.[1] || '0');
        return {
          playIndex: question.playIndex,
          playId: question.playId,
          field: `dependencies[${depIndex}].playId`,
          value: answer
        };
      }
      break;
  }

  // Generic field mapping
  if (question.field) {
    return {
      playIndex: question.playIndex,
      playId: question.playId,
      field: question.field,
      value: answer
    };
  }

  return null;
}

/**
 * Apply a single update to playbook
 */
export function applyUpdateToPlaybook(
  playbook: GeneratedPlaybook,
  update: PlaybookUpdate
): GeneratedPlaybook {
  const updated = JSON.parse(JSON.stringify(playbook)) as GeneratedPlaybook;

  if (update.playIndex !== undefined && updated.plays[update.playIndex]) {
    const play = updated.plays[update.playIndex];
    applyUpdateToPlay(play, update);
  } else if (update.playId) {
    const play = updated.plays.find(p => p.id === update.playId);
    if (play) {
      applyUpdateToPlay(play, update);
    }
  }

  return updated;
}

/**
 * Apply update to a single play
 */
function applyUpdateToPlay(play: Play, update: PlaybookUpdate): void {
  // Handle nested fields like trigger.workflowId, assignment.teamId, etc.
  if (update.field.includes('.')) {
    const [parentField, childField] = update.field.split('.', 2);
    
    if (parentField === 'trigger') {
      // Update trigger fields
      if (childField === 'workflowId' && play.trigger.type === 'workflow_stage_change') {
        play.trigger.workflowId = update.value;
      } else if (childField === 'stageId' && play.trigger.type === 'workflow_stage_change') {
        play.trigger.stageId = update.value;
      } else if (childField === 'teamId' && play.trigger.type === 'capacity_based') {
        play.trigger.teamId = update.value;
      } else if (childField === 'taskTitle' && play.trigger.type === 'task_completion') {
        play.trigger.taskTitle = update.value;
      } else if (childField === 'specificDate' && play.trigger.type === 'date_based') {
        play.trigger.specificDate = update.value;
      }
    } else if (parentField === 'assignment') {
      // Update assignment fields
      if (childField === 'teamId' && play.assignment.type === 'role_team' && play.assignment.mode === 'team') {
        play.assignment.teamId = update.value;
      } else if (childField === 'roleId' && play.assignment.type === 'role_team' && play.assignment.mode === 'role') {
        play.assignment.roleId = update.value;
      } else if (childField === 'userIds' && play.assignment.type === 'specific_people') {
        play.assignment.userIds = update.value;
      }
    } else if (parentField === 'taskTemplate') {
      // Update task template fields
      if (childField === 'title') {
        play.taskTemplate.title = update.value;
      } else if (childField === 'description') {
        play.taskTemplate.description = update.value;
      } else if (childField === 'priority') {
        play.taskTemplate.priority = update.value as any;
      }
    }
  } else if (update.field.includes('[') && update.field.includes('].')) {
    // Handle array fields like dependencies[0].playId
    const [fieldName, rest] = update.field.split('[');
    const [indexStr, nestedField] = rest.split('].');
    const index = parseInt(indexStr);
    
    if (fieldName === 'dependencies' && play.dependencies[index]) {
      (play.dependencies[index] as any)[nestedField] = update.value;
    }
  } else {
    // Simple field assignment
    (play as any)[update.field] = update.value;
  }
}

/**
 * Apply multiple answers to playbook
 */
export function applyAnswersToPlaybook(
  playbook: GeneratedPlaybook,
  answers: Record<string, string>,
  questions: EnrichmentQuestion[]
): GeneratedPlaybook {
  let updatedPlaybook = playbook;

  // Process each answer
  Object.entries(answers).forEach(([questionId, answer]) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    const update = mapAnswerToPlaybookField(question, answer);
    if (update) {
      updatedPlaybook = applyUpdateToPlaybook(updatedPlaybook, update);
    }
  });

  return updatedPlaybook;
}

/**
 * Resolve team/role names to IDs (placeholder - would need actual team/role lookup)
 */
export function resolveTeamNameToId(teamName: string): string | null {
  // This would typically query a database or API
  // For now, return null to indicate resolution needed
  return null;
}

export function resolveRoleNameToId(roleName: string): string | null {
  // This would typically query a database or API
  // For now, return null to indicate resolution needed
  return null;
}

