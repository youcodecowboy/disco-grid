/**
 * Playbook Gap Analyzer
 * 
 * Analyzes generated playbooks to identify missing or incomplete information
 * that needs follow-up questions.
 */

import type { Play, TriggerCondition } from '../types';

export interface PlaybookGap {
  type: 'missing_trigger_config' | 'missing_assignment' | 'missing_task_details' | 
        'unresolved_dependency' | 'missing_workflow_id' | 'missing_stage_id' | 
        'missing_team_id' | 'missing_role_id' | 'missing_user_ids' | 'missing_date_config' |
        'low_confidence' | 'ambiguous_trigger';
  severity: 'critical' | 'high' | 'medium' | 'low';
  playIndex?: number;
  playTitle?: string;
  playId?: string;
  field?: string;
  message: string;
  suggestion?: string;
  context?: Record<string, any>; // Additional context for question generation
}

export interface GeneratedPlaybook {
  suggestedName?: string;
  suggestedDescription?: string;
  plays: Play[];
}

/**
 * Analyze playbook for gaps and missing information
 */
export function analyzePlaybookGaps(playbook: GeneratedPlaybook): PlaybookGap[] {
  const gaps: PlaybookGap[] = [];

  // Check playbook-level information
  if (!playbook.suggestedName || playbook.suggestedName.trim() === '') {
    gaps.push({
      type: 'missing_task_details',
      severity: 'low',
      message: 'Playbook name is missing.',
      suggestion: 'What would you like to name this playbook?'
    });
  }

  // Analyze each play
  playbook.plays.forEach((play, index) => {
    // Check trigger configuration completeness
    if (play.trigger) {
      const triggerGaps = analyzeTrigger(play.trigger, play, index);
      gaps.push(...triggerGaps);
    }

    // Check assignment completeness
    if (play.assignment) {
      const assignmentGaps = analyzeAssignment(play.assignment, play, index);
      gaps.push(...assignmentGaps);
    }

    // Check task template completeness
    if (play.taskTemplate) {
      const taskGaps = analyzeTaskTemplate(play.taskTemplate, play, index);
      gaps.push(...taskGaps);
    }

    // Check dependencies
    const dependencyGaps = analyzeDependencies(play.dependencies, play, index, playbook.plays);
    gaps.push(...dependencyGaps);
  });

  return gaps;
}

/**
 * Analyze trigger for gaps
 */
function analyzeTrigger(trigger: TriggerCondition, play: Play, index: number): PlaybookGap[] {
  const gaps: PlaybookGap[] = [];

  switch (trigger.type) {
    case 'workflow_stage_change':
      if (!trigger.workflowId || trigger.workflowId.trim() === '') {
        gaps.push({
          type: 'missing_workflow_id',
          severity: 'critical',
          playIndex: index,
          playTitle: play.title,
          playId: play.id,
          field: 'trigger.workflowId',
          message: `Play "${play.title}" references workflow "${trigger.workflowName || 'unknown'}" but workflow ID is missing.`,
          suggestion: `Which workflow should trigger this play?`,
          context: {
            workflowName: trigger.workflowName,
            stageName: trigger.stageName
          }
        });
      }
      if (!trigger.stageId || trigger.stageId.trim() === '') {
        gaps.push({
          type: 'missing_stage_id',
          severity: 'critical',
          playIndex: index,
          playTitle: play.title,
          playId: play.id,
          field: 'trigger.stageId',
          message: `Play "${play.title}" references stage "${trigger.stageName || 'unknown'}" but stage ID is missing.`,
          suggestion: `Which stage should trigger this play?`,
          context: {
            workflowName: trigger.workflowName,
            workflowId: trigger.workflowId,
            stageName: trigger.stageName
          }
        });
      }
      break;

    case 'capacity_based':
      if (!trigger.teamId || trigger.teamId.trim() === '') {
        gaps.push({
          type: 'missing_team_id',
          severity: 'critical',
          playIndex: index,
          playTitle: play.title,
          playId: play.id,
          field: 'trigger.teamId',
          message: `Play "${play.title}" references team "${trigger.teamName || 'unknown'}" but team ID is missing.`,
          suggestion: `Which team should this capacity check monitor?`,
          context: {
            teamName: trigger.teamName
          }
        });
      }
      break;

    case 'date_based':
      if (trigger.mode === 'specific_date' && !trigger.specificDate) {
        gaps.push({
          type: 'missing_date_config',
          severity: 'high',
          playIndex: index,
          playTitle: play.title,
          playId: play.id,
          field: 'trigger.specificDate',
          message: `Play "${play.title}" uses date-based trigger but specific date is missing.`,
          suggestion: `What specific date should trigger this play?`
        });
      }
      break;

    case 'task_completion':
      if (!trigger.taskId && !trigger.taskTitle && !trigger.anyTaskMatching) {
        gaps.push({
          type: 'missing_trigger_config',
          severity: 'high',
          playIndex: index,
          playTitle: play.title,
          playId: play.id,
          field: 'trigger.taskTitle',
          message: `Play "${play.title}" uses task completion trigger but task identifier is missing.`,
          suggestion: `Which task should trigger this play?`
        });
      }
      break;
  }

  return gaps;
}

/**
 * Analyze assignment for gaps
 */
function analyzeAssignment(assignment: Play['assignment'], play: Play, index: number): PlaybookGap[] {
  const gaps: PlaybookGap[] = [];

  if (assignment.type === 'role_team') {
    if (assignment.mode === 'team') {
      if (!assignment.teamId || assignment.teamId.trim() === '') {
        gaps.push({
          type: 'missing_team_id',
          severity: 'critical',
          playIndex: index,
          playTitle: play.title,
          playId: play.id,
          field: 'assignment.teamId',
          message: `Play "${play.title}" is assigned to team "${assignment.teamName || 'unknown'}" but team ID is missing.`,
          suggestion: `Which team should be assigned to this task?`,
          context: {
            teamName: assignment.teamName
          }
        });
      }
    } else if (assignment.mode === 'role') {
      if (!assignment.roleId || assignment.roleId.trim() === '') {
        gaps.push({
          type: 'missing_role_id',
          severity: 'critical',
          playIndex: index,
          playTitle: play.title,
          playId: play.id,
          field: 'assignment.roleId',
          message: `Play "${play.title}" is assigned to role "${assignment.roleName || 'unknown'}" but role ID is missing.`,
          suggestion: `Which role should be assigned to this task?`,
          context: {
            roleName: assignment.roleName
          }
        });
      }
    }
  } else if (assignment.type === 'specific_people') {
    if (!assignment.userIds || assignment.userIds.length === 0) {
      gaps.push({
        type: 'missing_user_ids',
        severity: 'high',
        playIndex: index,
        playTitle: play.title,
        playId: play.id,
        field: 'assignment.userIds',
        message: `Play "${play.title}" is assigned to specific people but user IDs are missing.`,
        suggestion: `Which people should be assigned to this task?`
      });
    }
  }

  return gaps;
}

/**
 * Analyze task template for gaps
 */
function analyzeTaskTemplate(taskTemplate: Play['taskTemplate'], play: Play, index: number): PlaybookGap[] {
  const gaps: PlaybookGap[] = [];

  if (!taskTemplate.title || taskTemplate.title.trim() === '') {
    gaps.push({
      type: 'missing_task_details',
      severity: 'critical',
      playIndex: index,
      playTitle: play.title,
      playId: play.id,
      field: 'taskTemplate.title',
      message: `Play "${play.title}" is missing a task title.`,
      suggestion: `What should the task title be?`
    });
  }

  if (!taskTemplate.description || taskTemplate.description.trim().length < 20) {
    gaps.push({
      type: 'missing_task_details',
      severity: 'low',
      playIndex: index,
      playTitle: play.title,
      playId: play.id,
      field: 'taskTemplate.description',
      message: `Play "${play.title}" has a brief or missing task description.`,
      suggestion: `Can you provide more details about what this task should include?`
    });
  }

  return gaps;
}

/**
 * Analyze dependencies for gaps
 */
function analyzeDependencies(
  dependencies: Play['dependencies'],
  play: Play,
  index: number,
  allPlays: Play[]
): PlaybookGap[] {
  const gaps: PlaybookGap[] = [];

  // Handle undefined or null dependencies
  if (!dependencies || !Array.isArray(dependencies)) {
    return gaps;
  }

  dependencies.forEach((dep, depIndex) => {
    if (!dep.playId || dep.playId.trim() === '') {
      // Check if dependency play exists in playbook
      const dependencyPlay = allPlays.find(p => 
        p.title.toLowerCase() === dep.playTitle.toLowerCase()
      );

      if (!dependencyPlay) {
        gaps.push({
          type: 'unresolved_dependency',
          severity: 'high',
          playIndex: index,
          playTitle: play.title,
          playId: play.id,
          field: `dependencies[${depIndex}]`,
          message: `Play "${play.title}" depends on "${dep.playTitle}" but that play doesn't exist in this playbook.`,
          suggestion: `Should this dependency reference a different play, or is "${dep.playTitle}" missing from the playbook?`,
          context: {
            dependencyPlayTitle: dep.playTitle
          }
        });
      } else {
        // Play exists but dependency not resolved
        gaps.push({
          type: 'unresolved_dependency',
          severity: 'medium',
          playIndex: index,
          playTitle: play.title,
          playId: play.id,
          field: `dependencies[${depIndex}]`,
          message: `Play "${play.title}" depends on "${dep.playTitle}" but dependency link is not resolved.`,
          suggestion: `This dependency should be automatically resolved.`,
          context: {
            dependencyPlayTitle: dep.playTitle,
            dependencyPlayId: dependencyPlay.id
          }
        });
      }
    }
  });

  return gaps;
}

/**
 * Group gaps by priority for prioritized questioning
 */
export function groupGapsByPriority(gaps: PlaybookGap[]): {
  critical: PlaybookGap[];
  high: PlaybookGap[];
  medium: PlaybookGap[];
  low: PlaybookGap[];
} {
  return {
    critical: gaps.filter(g => g.severity === 'critical'),
    high: gaps.filter(g => g.severity === 'high'),
    medium: gaps.filter(g => g.severity === 'medium'),
    low: gaps.filter(g => g.severity === 'low')
  };
}

/**
 * Check if playbook is complete enough to save
 */
export function isPlaybookComplete(gaps: PlaybookGap[], allowIncomplete: boolean = false): {
  complete: boolean;
  blockingGaps: PlaybookGap[];
  warnings: PlaybookGap[];
} {
  const blockingGaps = gaps.filter(g => 
    !allowIncomplete && (g.severity === 'critical' || g.severity === 'high')
  );
  const warnings = gaps.filter(g => g.severity === 'medium' || g.severity === 'low');

  return {
    complete: blockingGaps.length === 0,
    blockingGaps,
    warnings
  };
}

