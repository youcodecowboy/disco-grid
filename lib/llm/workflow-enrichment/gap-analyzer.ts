/**
 * Workflow Gap Analyzer
 * 
 * Analyzes generated workflows to identify missing or incomplete information
 * that needs follow-up questions.
 */

export interface WorkflowGap {
  type: 'missing_input' | 'missing_output' | 'missing_team' | 'unlinked_dependency' | 
        'open_ended_description' | 'low_confidence' | 'ambiguous_decision' | 'missing_limbo_details';
  severity: 'critical' | 'high' | 'medium' | 'low';
  stageIndex?: number;
  stageName?: string;
  limboZoneIndex?: number;
  field?: string;
  message: string;
  suggestion?: string;
}

export interface WorkflowStage {
  name: string;
  sequence: number;
  type: 'sequential' | 'parallel';
  description?: string;
  suggestedTeam?: string;
  suggestedInputs?: string[];
  suggestedOutputs?: string[];
  dependencies?: Array<{
    type: string;
    description: string;
    linkedTo?: string;
  }>;
  parallelWith?: string[];
}

export interface WorkflowLimboZone {
  betweenStages: string[];
  dependencies?: Array<{
    type: string;
    description: string;
    linkedTo?: string;
  }>;
}

export interface GeneratedWorkflow {
  stages: WorkflowStage[];
  limboZones: WorkflowLimboZone[];
  suggestedName?: string;
  suggestedIndustry?: string;
}

/**
 * Analyze workflow for gaps and missing information
 */
export function analyzeWorkflowGaps(workflow: GeneratedWorkflow): WorkflowGap[] {
  const gaps: WorkflowGap[] = [];

  // Analyze each stage
  workflow.stages.forEach((stage, index) => {
    // Check for missing inputs
    if (!stage.suggestedInputs || stage.suggestedInputs.length === 0) {
      gaps.push({
        type: 'missing_input',
        severity: 'high',
        stageIndex: index,
        stageName: stage.name,
        field: 'suggestedInputs',
        message: `Stage "${stage.name}" has no input requirements specified.`,
        suggestion: 'Would you like this stage to begin with a QR scan, form entry, photo, or other input?'
      });
    }

    // Check for missing outputs
    if (!stage.suggestedOutputs || stage.suggestedOutputs.length === 0) {
      gaps.push({
        type: 'missing_output',
        severity: 'high',
        stageIndex: index,
        stageName: stage.name,
        field: 'suggestedOutputs',
        message: `Stage "${stage.name}" has no output requirements specified.`,
        suggestion: 'Should this stage end with a form submission, approval, measurement, or other output?'
      });
    }

    // Check for missing team assignment
    if (!stage.suggestedTeam || stage.suggestedTeam.trim() === '') {
      gaps.push({
        type: 'missing_team',
        severity: 'medium',
        stageIndex: index,
        stageName: stage.name,
        field: 'suggestedTeam',
        message: `Stage "${stage.name}" has no team assigned.`,
        suggestion: 'Which team or department handles this stage?'
      });
    }

    // Check for open-ended descriptions
    if (!stage.description || stage.description.length < 20) {
      gaps.push({
        type: 'open_ended_description',
        severity: 'low',
        stageIndex: index,
        stageName: stage.name,
        field: 'description',
        message: `Stage "${stage.name}" has a brief description.`,
        suggestion: 'Can you provide more details about what happens in this stage?'
      });
    }

    // Check for unlinked dependencies
    if (stage.dependencies && stage.dependencies.length > 0) {
      stage.dependencies.forEach((dep, depIndex) => {
        if (!dep.linkedTo && dep.type !== 'time_based') {
          gaps.push({
            type: 'unlinked_dependency',
            severity: 'high',
            stageIndex: index,
            stageName: stage.name,
            field: `dependencies[${depIndex}]`,
            message: `Dependency "${dep.description}" in stage "${stage.name}" is not linked to a specific task or stage.`,
            suggestion: `What should this dependency be linked to? Is it a task, approval, or completion of another stage?`
          });
        }
      });
    }
  });

  // Analyze limbo zones
  workflow.limboZones.forEach((limbo, index) => {
    // Check for missing limbo zone details
    if (!limbo.dependencies || limbo.dependencies.length === 0) {
      gaps.push({
        type: 'missing_limbo_details',
        severity: 'medium',
        limboZoneIndex: index,
        message: `Limbo zone between "${limbo.betweenStages[0]}" and "${limbo.betweenStages[1]}" has no dependencies specified.`,
        suggestion: 'What happens between these stages? Is there a wait time, approval, or setup task?'
      });
    } else {
      // Check for unlinked dependencies in limbo zones
      limbo.dependencies.forEach((dep, depIndex) => {
        if (!dep.linkedTo && dep.type !== 'time_based') {
          gaps.push({
            type: 'unlinked_dependency',
            severity: 'high',
            limboZoneIndex: index,
            field: `dependencies[${depIndex}]`,
            message: `Dependency "${dep.description}" in limbo zone is not linked to a specific task.`,
            suggestion: 'What should this dependency be linked to?'
          });
        }
      });
    }
  });

  // Check for overall missing workflow-level information
  if (!workflow.suggestedName || workflow.suggestedName.trim() === '') {
    gaps.push({
      type: 'open_ended_description',
      severity: 'low',
      message: 'Workflow name is missing.',
      suggestion: 'What would you like to name this workflow?'
    });
  }

  return gaps;
}

/**
 * Group gaps by type for prioritized questioning
 */
export function groupGapsByPriority(gaps: WorkflowGap[]): {
  critical: WorkflowGap[];
  high: WorkflowGap[];
  medium: WorkflowGap[];
  low: WorkflowGap[];
} {
  return {
    critical: gaps.filter(g => g.severity === 'critical'),
    high: gaps.filter(g => g.severity === 'high'),
    medium: gaps.filter(g => g.severity === 'medium'),
    low: gaps.filter(g => g.severity === 'low')
  };
}

/**
 * Check if workflow is complete enough to save
 */
export function isWorkflowComplete(gaps: WorkflowGap[], allowIncomplete: boolean = false): {
  complete: boolean;
  blockingGaps: WorkflowGap[];
  warnings: WorkflowGap[];
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

