/**
 * Missing Fields Detection
 * 
 * Detects missing or incomplete fields in plays for visual flagging
 */

import type { Play, TriggerCondition } from '../types';

export interface MissingField {
  field: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  suggestion?: string;
}

/**
 * Detect missing fields in a play
 */
export function detectMissingFields(play: Play): MissingField[] {
  const missing: MissingField[] = [];

  // Check title
  if (!play.title || play.title.trim() === '') {
    missing.push({
      field: 'title',
      severity: 'critical',
      message: 'Play title is missing',
      suggestion: 'Enter a descriptive title for this play'
    });
  }

  // Check task template title
  if (!play.taskTemplate.title || play.taskTemplate.title.trim() === '') {
    missing.push({
      field: 'taskTemplate.title',
      severity: 'critical',
      message: 'Task title is missing',
      suggestion: 'Enter what task should be created'
    });
  }

  // Check trigger configuration
  const triggerMissing = detectTriggerMissingFields(play.trigger);
  missing.push(...triggerMissing);

  // Check assignment configuration
  const assignmentMissing = detectAssignmentMissingFields(play.assignment);
  missing.push(...assignmentMissing);

  // Check dependencies
  const dependencyMissing = detectDependencyMissingFields(play.dependencies);
  missing.push(...dependencyMissing);

  return missing;
}

/**
 * Detect missing fields in trigger
 */
function detectTriggerMissingFields(trigger: TriggerCondition): MissingField[] {
  const missing: MissingField[] = [];

  switch (trigger.type) {
    case 'workflow_stage_change':
      if (!trigger.workflowId || trigger.workflowId.trim() === '') {
        missing.push({
          field: 'trigger.workflowId',
          severity: 'critical',
          message: 'Workflow ID is missing',
          suggestion: `Select which workflow should trigger this play${trigger.workflowName ? ` (currently: ${trigger.workflowName})` : ''}`
        });
      }
      if (!trigger.stageId || trigger.stageId.trim() === '') {
        missing.push({
          field: 'trigger.stageId',
          severity: 'critical',
          message: 'Stage ID is missing',
          suggestion: `Select which stage should trigger this play${trigger.stageName ? ` (currently: ${trigger.stageName})` : ''}`
        });
      }
      break;

    case 'capacity_based':
      if (!trigger.teamId || trigger.teamId.trim() === '') {
        missing.push({
          field: 'trigger.teamId',
          severity: 'critical',
          message: 'Team ID is missing',
          suggestion: `Select which team to monitor${trigger.teamName ? ` (currently: ${trigger.teamName})` : ''}`
        });
      }
      break;

    case 'date_based':
      if (trigger.mode === 'specific_date' && !trigger.specificDate) {
        missing.push({
          field: 'trigger.specificDate',
          severity: 'high',
          message: 'Specific date is missing',
          suggestion: 'Select the date when this play should trigger'
        });
      }
      break;

    case 'task_completion':
      if (!trigger.taskId && !trigger.taskTitle && !trigger.anyTaskMatching) {
        missing.push({
          field: 'trigger.taskTitle',
          severity: 'high',
          message: 'Task identifier is missing',
          suggestion: 'Specify which task should trigger this play'
        });
      }
      break;
  }

  return missing;
}

/**
 * Detect missing fields in assignment
 */
function detectAssignmentMissingFields(assignment: Play['assignment']): MissingField[] {
  const missing: MissingField[] = [];

  if (assignment.type === 'role_team') {
    if (assignment.mode === 'team') {
      if (!assignment.teamId || assignment.teamId.trim() === '') {
        missing.push({
          field: 'assignment.teamId',
          severity: 'critical',
          message: 'Team ID is missing',
          suggestion: `Select which team should be assigned${assignment.teamName ? ` (currently: ${assignment.teamName})` : ''}`
        });
      }
    } else if (assignment.mode === 'role') {
      if (!assignment.roleId || assignment.roleId.trim() === '') {
        missing.push({
          field: 'assignment.roleId',
          severity: 'critical',
          message: 'Role ID is missing',
          suggestion: `Select which role should be assigned${assignment.roleName ? ` (currently: ${assignment.roleName})` : ''}`
        });
      }
    }
  } else if (assignment.type === 'specific_people') {
    if (!assignment.userIds || assignment.userIds.length === 0) {
      missing.push({
        field: 'assignment.userIds',
        severity: 'high',
        message: 'User IDs are missing',
        suggestion: 'Select which people should be assigned to this task'
      });
    }
  }

  return missing;
}

/**
 * Detect missing fields in dependencies
 */
function detectDependencyMissingFields(dependencies: Play['dependencies']): MissingField[] {
  const missing: MissingField[] = [];

  dependencies.forEach((dep, index) => {
    if (!dep.playId || dep.playId.trim() === '') {
      missing.push({
        field: `dependencies[${index}].playId`,
        severity: 'high',
        message: `Dependency "${dep.playTitle}" is unresolved`,
        suggestion: `This dependency may reference a play that doesn't exist or needs to be resolved`
      });
    }
  });

  return missing;
}

/**
 * Get summary of missing fields for a play
 */
export function getMissingFieldsSummary(play: Play): {
  critical: number;
  high: number;
  medium: number;
  low: number;
  total: number;
} {
  const missing = detectMissingFields(play);
  
  return {
    critical: missing.filter(m => m.severity === 'critical').length,
    high: missing.filter(m => m.severity === 'high').length,
    medium: missing.filter(m => m.severity === 'medium').length,
    low: missing.filter(m => m.severity === 'low').length,
    total: missing.length
  };
}

