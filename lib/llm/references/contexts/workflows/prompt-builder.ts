/**
 * Workflows Context - Prompt Builder
 * 
 * Builds optimized prompts for workflow generation with examples and constraints.
 */

import { getWorkflowExamples } from './examples';

export type WorkflowPromptStrategy = 'minimal' | 'optimized' | 'few_shot' | 'constrained';

export interface WorkflowPromptOptions {
  strategy?: WorkflowPromptStrategy;
  exampleCount?: number;
  constrainOutput?: boolean;
  complexity?: 'simple' | 'medium' | 'complex';
}

/**
 * Build optimized prompt for workflow generation
 */
export function buildWorkflowPrompt(options: WorkflowPromptOptions = {}): string {
  const {
    strategy = 'optimized',
    exampleCount = 2,
    constrainOutput = true,
    complexity
  } = options;

  if (strategy === 'minimal') {
    return buildMinimalWorkflowPrompt(constrainOutput);
  }

  if (strategy === 'few_shot') {
    return buildFewShotWorkflowPrompt(exampleCount, constrainOutput, complexity);
  }

  if (strategy === 'constrained') {
    return buildConstrainedWorkflowPrompt();
  }

  // Default: optimized
  return buildOptimizedWorkflowPrompt(constrainOutput);
}

/**
 * Minimal workflow prompt
 * 
 * NOTE: The JSON structure itself communicates the types (stages, limboZones),
 * so we don't need explicit type lists for workflows - the structure is self-documenting.
 */
function buildMinimalWorkflowPrompt(constrainOutput: boolean): string {
  const outputFormat = constrainOutput
    ? `{"stages":[{"name":"string","sequence":1,"type":"sequential|parallel"}],"limboZones":[]}`
    : `Return JSON with stages and limboZones.`;

  return `Extract workflow stages. ${outputFormat}`;
}

/**
 * Optimized workflow prompt
 */
function buildOptimizedWorkflowPrompt(constrainOutput: boolean): string {
  const outputFormat = constrainOutput
    ? `ONLY return this structure, no explanations:
{"stages":[{"name":"string","sequence":1,"type":"sequential|parallel"}],"limboZones":[]}`
    : `Return JSON with stages and limboZones.`;

  return `Extract workflow stages from text.

Rules:
- Extract ALL stages in order
- Sequential: "then", "after", "next"
- Parallel: "simultaneously", "at the same time"
- Dependencies: approvals, time delays, task completion

${outputFormat}`;
}

/**
 * Few-shot workflow prompt
 */
function buildFewShotWorkflowPrompt(
  exampleCount: number,
  constrainOutput: boolean,
  complexity?: 'simple' | 'medium' | 'complex'
): string {
  const examples = getWorkflowExamples(exampleCount, complexity);
  
  const outputFormat = constrainOutput
    ? `ONLY return this structure, no explanations:
{"stages":[{"name":"string","sequence":1,"type":"sequential|parallel"}],"limboZones":[]}`
    : `Return JSON with stages and limboZones.`;

  return `Extract workflow stages from text.

Examples:
${examples}

${outputFormat}`;
}

/**
 * Constrained workflow prompt - minimal tokens
 */
function buildConstrainedWorkflowPrompt(): string {
  return `Extract stages. Return ONLY JSON:
{"stages":[{"name":"string","sequence":1,"type":"sequential|parallel"}],"limboZones":[]}`;
}

