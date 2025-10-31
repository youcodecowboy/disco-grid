/**
 * Prompt Optimizer
 * 
 * Creates optimized prompts with constraints, examples, and token optimization.
 */

import { buildOperationsPrompt, type PromptStrategy } from './references/contexts/operations/prompt-builder';
import { buildWorkflowPrompt, type WorkflowPromptStrategy } from './references/contexts/workflows/prompt-builder';
import { buildBalancedOperationsPrompt } from './references/contexts/operations/balanced-prompt';
import { buildEnhancedBalancedOperationsPrompt } from './references/contexts/operations/enhanced-balanced-prompt';

export interface OptimizedPromptConfig {
  context: 'operations' | 'workflows' | 'teams' | 'company';
  strategy?: PromptStrategy | WorkflowPromptStrategy;
  exampleCount?: number;
  constrainOutput?: boolean;
  includePatterns?: boolean;
}

/**
 * Build optimized prompt for given context
 */
export function buildOptimizedPrompt(config: OptimizedPromptConfig): string {
  const {
    context,
    strategy = 'optimized',
    exampleCount = 2,
    constrainOutput = true,
    includePatterns = true
  } = config;

  switch (context) {
        case 'operations':
          // Handle balanced strategies specially
          if (strategy === 'balanced') {
            return buildBalancedOperationsPrompt();
          }
          if (strategy === 'enhanced') {
            return buildEnhancedBalancedOperationsPrompt();
          }
          return buildOperationsPrompt({
            strategy: strategy as PromptStrategy,
            exampleCount,
            constrainOutput,
            includePatterns
          });

    case 'workflows':
      return buildWorkflowPrompt({
        strategy: strategy as WorkflowPromptStrategy,
        exampleCount,
        constrainOutput
      });

    case 'teams':
      // TODO: Implement teams prompt builder
      return `Extract team entities. Return JSON only.`;

    case 'company':
      // TODO: Implement company prompt builder
      return `Extract company entities. Return JSON only.`;

    default:
      throw new Error(`Unknown context: ${context}`);
  }
}

/**
 * Estimate token usage for a prompt
 */
export function estimatePromptTokens(prompt: string): number {
  // Rough estimate: 1 token ≈ 4 characters for English text
  return Math.ceil(prompt.length / 4);
}

/**
 * Compare prompt strategies
 */
export function comparePromptStrategies(
  context: 'operations' | 'workflows',
  strategies: Array<PromptStrategy | WorkflowPromptStrategy>
): Array<{ strategy: string; tokens: number; prompt: string }> {
  return strategies.map(strategy => {
    const prompt = context === 'operations'
      ? buildOperationsPrompt({ strategy: strategy as PromptStrategy })
      : buildWorkflowPrompt({ strategy: strategy as WorkflowPromptStrategy });
    
    return {
      strategy,
      tokens: estimatePromptTokens(prompt),
      prompt
    };
  });
}

