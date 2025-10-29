/**
 * Optimized refinement prompts for workflow stage fields
 * These are intentionally short and focused for fast, low-cost responses
 */

export type RefinementField = 
  | 'teamId'
  | 'inputs'
  | 'outputs'
  | 'dependencies'
  | 'estimatedDuration';

interface RefinementPromptConfig {
  field: RefinementField;
  systemPrompt: string;
  expectedTokens: number; // Estimated token usage
}

/**
 * Base instruction for all refinement prompts (kept DRY)
 */
const BASE_INSTRUCTION = `Return ONLY valid JSON:
{
  "updates": { /* field(s) to update */ },
  "interpretation": "brief explanation",
  "confidence": 0.9
}`;

/**
 * Refinement prompt configurations - optimized for minimal token usage
 */
export const REFINEMENT_PROMPTS: Record<RefinementField, RefinementPromptConfig> = {
  teamId: {
    field: 'teamId',
    systemPrompt: `Extract team name from user's answer and normalize it.

${BASE_INSTRUCTION}

Example:
Input: "the printing guys"
Output: {"updates": {"teamId": "Printing Team"}, "interpretation": "Printing Team", "confidence": 0.85}`,
    expectedTokens: 150
  },

  inputs: {
    field: 'inputs',
    systemPrompt: `Extract input requirements and convert to structured format.

Input types: qr_scan, form_submission, photo_upload, manual_confirmation, barcode_scan, signature, measurement, inspection.

${BASE_INSTRUCTION}

Return: {"updates": {"inputs": [{"id": "uuid", "type": "qr_scan", "label": "Scan QR", "required": true}]}}`,
    expectedTokens: 200
  },

  outputs: {
    field: 'outputs',
    systemPrompt: `Extract output requirements and convert to structured format.

Output types: task_completion, form_submission, photo_upload, quality_check, quantity_confirmation, approval, signature.

${BASE_INSTRUCTION}

Return: {"updates": {"outputs": [{"id": "uuid", "type": "task_completion", "label": "Complete task", "required": true}]}}`,
    expectedTokens: 200
  },

  dependencies: {
    field: 'dependencies',
    systemPrompt: `Extract dependencies or return empty array if none.

If user says "none"/"no dependencies": return {"updates": {"dependencies": []}}

Types: task_completion, approval, time_delay, capacity, component_completion, quantity_threshold, material_arrival, custom_condition.

${BASE_INSTRUCTION}

Return: {"updates": {"dependencies": [{"id": "uuid", "type": "material_arrival", "description": "...", "required": true}]}}`,
    expectedTokens: 250
  },

  estimatedDuration: {
    field: 'estimatedDuration',
    systemPrompt: `Extract time duration and convert to minutes.

Examples:
- "2 hours" → 120
- "30 minutes" → 30
- "1 day" → 1440
- "15 mins" → 15

${BASE_INSTRUCTION}

Return: {"updates": {"estimatedDuration": 120}, "interpretation": "2 hours (120 minutes)", "confidence": 0.95}`,
    expectedTokens: 150
  }
};

/**
 * Get optimized prompt for a specific refinement field
 */
export function getRefinementPrompt(field: RefinementField): RefinementPromptConfig {
  const config = REFINEMENT_PROMPTS[field];
  if (!config) {
    throw new Error(`No refinement prompt configured for field: ${field}`);
  }
  return config;
}

/**
 * Calculate estimated cost for refinement call
 * Based on Together.ai pricing: ~$0.80 per 1M tokens for gpt-oss-120b
 */
export function estimateRefinementCost(field: RefinementField): {
  estimatedTokens: number;
  estimatedCostUSD: number;
} {
  const config = getRefinementPrompt(field);
  const estimatedTokens = config.expectedTokens;
  const costPerToken = 0.8 / 1_000_000; // $0.80 per 1M tokens
  
  return {
    estimatedTokens,
    estimatedCostUSD: estimatedTokens * costPerToken
  };
}

/**
 * Log token usage stats for optimization
 */
export function logRefinementStats(
  field: RefinementField,
  actualTokens: number,
  durationMs: number
) {
  const expected = REFINEMENT_PROMPTS[field].expectedTokens;
  const efficiency = (expected / actualTokens) * 100;
  
  console.log(`📊 Refinement Stats [${field}]:`, {
    expectedTokens: expected,
    actualTokens,
    efficiency: `${efficiency.toFixed(1)}%`,
    durationMs,
    costUSD: `$${(actualTokens * 0.8 / 1_000_000).toFixed(6)}`
  });
}

