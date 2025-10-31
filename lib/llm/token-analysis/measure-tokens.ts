/**
 * Token Usage Analysis & Measurement
 * 
 * Tools to measure and compare token usage across different prompt strategies.
 */

import Together from 'together-ai';

// Lazy initialization to avoid errors when API key is missing
function getTogetherClient() {
  const apiKey = process.env.TOGETHER_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new Together({ apiKey });
}

export interface TokenUsageResult {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  costUSD: number;
  model: string;
}

export interface PromptComparison {
  strategy: string;
  promptLength: number;
  estimatedTokens: number;
  actualTokens?: TokenUsageResult;
}

/**
 * Estimate tokens using a simple heuristic (4 chars ≈ 1 token)
 * More accurate: use tiktoken library if available
 */
export function estimateTokens(text: string): number {
  // Rough estimate: 1 token ≈ 4 characters for English text
  // This is conservative - actual tokenization varies
  return Math.ceil(text.length / 4);
}

/**
 * Get actual token count from Together.ai API
 * Note: This makes an actual API call, so use sparingly
 */
export async function measureActualTokens(
  systemPrompt: string,
  userMessage: string,
  model: string = 'meta-llama/Llama-3.2-3B-Instruct-Turbo'
): Promise<TokenUsageResult> {
  const together = getTogetherClient();
  if (!together) {
    throw new Error('TOGETHER_API_KEY not found');
  }
  
  const response = await together.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ],
    temperature: 0.1,
    max_tokens: 100,
    response_format: { type: 'json_object' }
  });

  const usage = response.usage!;
  
  // Cost estimates (approximate, varies by model)
  const costPerToken = model.includes('3B') 
    ? 0.0000001  // ~$0.10 per 1M tokens for 3B models
    : 0.0000008; // ~$0.80 per 1M tokens for 120B models

  return {
    promptTokens: usage.prompt_tokens,
    completionTokens: usage.completion_tokens,
    totalTokens: usage.total_tokens,
    costUSD: usage.total_tokens * costPerToken,
    model
  };
}

/**
 * Compare different prompt strategies
 */
export async function comparePromptStrategies(
  userInput: string,
  strategies: {
    name: string;
    getPrompt: () => string;
  }[]
): Promise<PromptComparison[]> {
  const results: PromptComparison[] = [];

  for (const strategy of strategies) {
    const prompt = strategy.getPrompt();
    const estimated = estimateTokens(prompt);
    
    // Optionally measure actual tokens (costs API calls)
    // const actual = await measureActualTokens(prompt, userInput);
    
    results.push({
      strategy: strategy.name,
      promptLength: prompt.length,
      estimatedTokens: estimated,
      // actualTokens: actual
    });
  }

  return results;
}

/**
 * Format comparison results for display
 */
export function formatComparisonResults(results: PromptComparison[]): string {
  const baseline = results[0];
  let output = `\n📊 Token Usage Comparison\n`;
  output += `═${'═'.repeat(60)}\n\n`;
  
  for (const result of results) {
    const savings = baseline.estimatedTokens - result.estimatedTokens;
    const savingsPct = ((savings / baseline.estimatedTokens) * 100).toFixed(1);
    const relative = (result.estimatedTokens / baseline.estimatedTokens * 100).toFixed(1);
    
    output += `${result.strategy}:\n`;
    output += `  Prompt Length: ${result.promptLength.toLocaleString()} chars\n`;
    output += `  Estimated Tokens: ${result.estimatedTokens.toLocaleString()}\n`;
    if (result.actualTokens) {
      output += `  Actual Tokens: ${result.actualTokens.totalTokens.toLocaleString()}\n`;
      output += `  Cost: $${result.actualTokens.costUSD.toFixed(6)}\n`;
    }
    if (result !== baseline) {
      output += `  vs Baseline: ${relative}% (${savings > 0 ? '-' : '+'}${Math.abs(savings).toLocaleString} tokens, ${savingsPct}% ${savings > 0 ? 'savings' : 'increase'})\n`;
    }
    output += `\n`;
  }
  
  return output;
}

