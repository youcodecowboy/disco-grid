/**
 * Operations Context - Prompt Builder
 * 
 * Builds optimized prompts with few-shot learning examples and constraints.
 */

import {
  OPS_MODEL_EXAMPLES,
  PLANNING_METHOD_EXAMPLES,
  STAGES_EXAMPLES,
  CAPACITY_EXAMPLES,
  SHIFTS_EXAMPLES,
  STORAGE_SYSTEM_EXAMPLES,
  QR_BARCODE_EXAMPLES,
  type ExtractionExample
} from './examples';
import { getPatternHints } from './patterns';
import { buildBalancedOperationsPrompt } from './balanced-prompt';

export type PromptStrategy = 'minimal' | 'optimized' | 'balanced' | 'few_shot' | 'constrained';

export interface PromptBuilderOptions {
  strategy?: PromptStrategy;
  exampleCount?: number; // For few-shot learning (1-3)
  includePatterns?: boolean;
  constrainOutput?: boolean; // Strict JSON format, no explanations
}

/**
 * Build optimized prompt for operations context
 */
export function buildOperationsPrompt(options: PromptBuilderOptions = {}): string {
  const {
    strategy = 'optimized',
    exampleCount = 2,
    includePatterns = true,
    constrainOutput = true
  } = options;

  if (strategy === 'minimal') {
    return buildMinimalPrompt(constrainOutput);
  }

  if (strategy === 'balanced') {
    return buildBalancedOperationsPrompt();
  }

  if (strategy === 'few_shot') {
    return buildFewShotPrompt(exampleCount, includePatterns, constrainOutput);
  }

  if (strategy === 'constrained') {
    return buildConstrainedPrompt(includePatterns);
  }

  // Default: optimized
  return buildOptimizedPrompt(includePatterns, constrainOutput);
}

/**
 * Minimal prompt - ultra concise, relies on reference library
 * 
 * NOTE: We MUST include type names even in minimal - the model needs to know
 * what types to use (ops_model, planning_method, etc.), otherwise it will
 * guess generic types that won't match our domain schema.
 */
function buildMinimalPrompt(constrainOutput: boolean): string {
  const outputFormat = constrainOutput
    ? `{"entities":[{"type":"string","value":"any","confidence":1|2|3}]}`
    : `Return JSON with entities array.`;

  // Include type names - model needs these to return correct domain types
  return `Extract operations data.

Types: ops_model, planning_method, stages_list, capacity_monthly_pcs, shifts, storage_system, qr_or_barcode_use

${outputFormat}`;
}

/**
 * Optimized prompt - balanced guidance without examples
 */
function buildOptimizedPrompt(includePatterns: boolean, constrainOutput: boolean): string {
  const outputFormat = constrainOutput
    ? `ONLY return this structure, no explanations:
{"entities":[{"type":"string","value":"any","confidence":1|2|3}]}`
    : `Return JSON with entities array.`;

  const patterns = includePatterns ? `\n\n${getPatternHints()}` : '';

  return `Extract operations entities.

Types: ops_model, planning_method, stages_list, capacity_monthly_pcs, capacity, shifts, storage_system, qr_or_barcode_use
Valid values: MTO|MTS|hybrid, ManualBoard|Spreadsheet|ERP|Verbal, Racks|DefinedBins|Carts

IMPORTANT FORMAT RULES:
- stages_list: Extract as SEPARATE entities (one per stage), NOT as an array
  Example: Extract "cutting, sewing, washing" as THREE entities:
  {"type":"stages_list","value":"Cutting"}, {"type":"stages_list","value":"Sewing"}, {"type":"stages_list","value":"Washing"}
- capacity: Extract as NUMBER (e.g., 50000), not string
- Numbers: Extract as numbers, not strings (e.g., 50000 not "50k")

${outputFormat}${patterns}`;
}

/**
 * Few-shot prompt - includes examples for better accuracy
 */
function buildFewShotPrompt(
  exampleCount: number,
  includePatterns: boolean,
  constrainOutput: boolean
): string {
  const examples = [
    ...OPS_MODEL_EXAMPLES.slice(0, Math.min(exampleCount, 2)),
    ...PLANNING_METHOD_EXAMPLES.slice(0, Math.min(exampleCount, 2)),
    ...STAGES_EXAMPLES.slice(0, Math.min(exampleCount, 1))
  ].slice(0, exampleCount * 2); // Mix of different types

  const examplesText = examples
    .map((ex, i) => `Example ${i + 1}:\nInput: "${ex.input}"\nOutput: ${JSON.stringify(ex.output)}`)
    .join('\n\n');

  const outputFormat = constrainOutput
    ? `ONLY return this structure, no explanations:
{"entities":[{"type":"string","value":"any","confidence":1|2|3}]}`
    : `Return JSON with entities array.`;

  const patterns = includePatterns ? `\n\n${getPatternHints()}` : '';

  return `Extract operations entities from text.

Examples:
${examplesText}

${outputFormat}${patterns}`;
}

/**
 * Constrained prompt - strict output format to minimize tokens
 */
function buildConstrainedPrompt(includePatterns: boolean): string {
  const patterns = includePatterns ? `\n\n${getPatternHints()}` : '';

  return `Extract operations data. Return ONLY JSON, no text:
{"entities":[{"type":"string","value":"any","confidence":1|2|3}]}${patterns}`;
}

/**
 * Get examples for specific entity types
 */
export function getExamplesForEntityType(
  entityType: string,
  count: number = 2
): ExtractionExample[] {
  switch (entityType) {
    case 'ops_model':
      return OPS_MODEL_EXAMPLES.slice(0, count);
    case 'planning_method':
      return PLANNING_METHOD_EXAMPLES.slice(0, count);
    case 'stages_list':
      return STAGES_EXAMPLES.slice(0, count);
    case 'capacity_monthly_pcs':
      return CAPACITY_EXAMPLES.slice(0, count);
    case 'shifts':
      return SHIFTS_EXAMPLES.slice(0, count);
    case 'storage_system':
      return STORAGE_SYSTEM_EXAMPLES.slice(0, count);
    case 'qr_or_barcode_use':
      return QR_BARCODE_EXAMPLES.slice(0, count);
    default:
      return [];
  }
}

