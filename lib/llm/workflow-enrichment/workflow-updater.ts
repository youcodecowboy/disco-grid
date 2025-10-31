/**
 * Workflow Updater
 * 
 * Applies answers from enrichment questions back to the workflow structure
 */

import type { GeneratedWorkflow, WorkflowStage, WorkflowLimboZone } from './gap-analyzer';
import type { EnrichmentQuestion } from './question-generator';

export interface WorkflowUpdate {
  stageIndex?: number;
  limboZoneIndex?: number;
  field: string;
  value: any;
}

/**
 * Apply answers to workflow structure
 */
export function applyAnswersToWorkflow(
  workflow: GeneratedWorkflow,
  answers: Record<string, string>
): GeneratedWorkflow {
  const updatedWorkflow = JSON.parse(JSON.stringify(workflow)) as GeneratedWorkflow;

  // This will be populated by processing each answer
  // For now, return the workflow as-is
  // Full implementation will map answers to workflow fields
  
  return updatedWorkflow;
}

/**
 * Map question answer to workflow field
 */
export function mapAnswerToWorkflowField(
  question: EnrichmentQuestion,
  answer: string
): WorkflowUpdate | null {
  if (!question.field || question.stageIndex === undefined) {
    return null;
  }

  // Map common field types
  switch (question.type) {
    case 'input':
      return {
        stageIndex: question.stageIndex,
        field: 'suggestedInputs',
        value: [answer]
      };

    case 'output':
      return {
        stageIndex: question.stageIndex,
        field: 'suggestedOutputs',
        value: [answer]
      };

    case 'team':
      return {
        stageIndex: question.stageIndex,
        field: 'suggestedTeam',
        value: answer
      };

    case 'dependency':
      // Handle dependency linking
      if (question.field.startsWith('dependencies[')) {
        const depIndex = parseInt(question.field.match(/\[(\d+)\]/)?.[1] || '0');
        return {
          stageIndex: question.stageIndex,
          field: `dependencies[${depIndex}].linkedTo`,
          value: answer
        };
      }
      break;

    case 'description':
      return {
        stageIndex: question.stageIndex,
        field: 'description',
        value: answer
      };
  }

  return null;
}

/**
 * Apply a single update to workflow
 */
export function applyUpdateToWorkflow(
  workflow: GeneratedWorkflow,
  update: WorkflowUpdate
): GeneratedWorkflow {
  const updated = JSON.parse(JSON.stringify(workflow)) as GeneratedWorkflow;

  if (update.stageIndex !== undefined && updated.stages[update.stageIndex]) {
    const stage = updated.stages[update.stageIndex];
    
    // Handle nested fields like dependencies[0].linkedTo
    if (update.field.includes('[') && update.field.includes('].')) {
      const [fieldName, rest] = update.field.split('[');
      const [indexStr, nestedField] = rest.split('].');
      const index = parseInt(indexStr);
      
      if (fieldName === 'dependencies' && stage.dependencies?.[index]) {
        (stage.dependencies[index] as any)[nestedField] = update.value;
      }
    } else {
      // Simple field assignment
      (stage as any)[update.field] = update.value;
    }
  }

  if (update.limboZoneIndex !== undefined && updated.limboZones[update.limboZoneIndex]) {
    const limbo = updated.limboZones[update.limboZoneIndex];
    
    if (update.field.includes('[') && update.field.includes('].')) {
      const [fieldName, rest] = update.field.split('[');
      const [indexStr, nestedField] = rest.split('].');
      const index = parseInt(indexStr);
      
      if (fieldName === 'dependencies' && limbo.dependencies?.[index]) {
        (limbo.dependencies[index] as any)[nestedField] = update.value;
      }
    } else {
      (limbo as any)[update.field] = update.value;
    }
  }

  return updated;
}

