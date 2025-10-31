#!/usr/bin/env tsx
/**
 * Granular Optimization Test
 * 
 * Tests the impact of granular reference system with examples, patterns, and constraints.
 */

import Together from 'together-ai';
import { buildOptimizedPrompt } from '../lib/llm/prompt-optimizer';
import { estimatePromptTokens } from '../lib/llm/prompt-optimizer';

const apiKey = process.env.TOGETHER_API_KEY;
if (!apiKey) {
  console.error('❌ TOGETHER_API_KEY not found');
  process.exit(1);
}

const together = new Together({ apiKey });

// Test inputs
const TEST_INPUTS = {
  operations: "We make custom orders based on customer requests. We use a whiteboard to plan production. Our process is cutting, then sewing, then washing, finishing, QA, and packing. We produce about 50,000 units per month.",
  workflows: "Our process is cutting, then sewing, then washing, finishing, QA, and packing. Between cutting and sewing, fabric rests 2 hours."
};

async function testStrategy(
  context: 'operations' | 'workflows',
  strategy: string,
  userInput: string
) {
  const prompt = buildOptimizedPrompt({
    context,
    strategy: strategy as any,
    constrainOutput: true
  });

  const model = context === 'workflows' 
    ? "meta-llama/Llama-3.2-3B-Instruct-Turbo"  // Now using 3B!
    : "meta-llama/Llama-3.2-3B-Instruct-Turbo";
  
  const costPer1M = 0.06; // 3B model
  
  console.log(`\n🧪 Testing ${strategy.toUpperCase()} (${context})`);
  console.log(`   Prompt tokens: ~${estimatePromptTokens(prompt)}`);
  
  try {
    const startTime = Date.now();
    const response = await together.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: userInput }
      ],
      temperature: 0.1,
      max_tokens: context === 'workflows' ? 2000 : 1000,
      response_format: { type: 'json_object' }
    });
    const duration = Date.now() - startTime;
    
    const usage = response.usage!;
    const cost = (usage.total_tokens / 1_000_000) * costPer1M;
    
    const content = response.choices[0]?.message?.content;
    let isValid = false;
    try {
      JSON.parse(content || '{}');
      isValid = true;
    } catch (e) {
      isValid = false;
    }
    
    console.log(`   ✅ Tokens: ${usage.total_tokens} (${usage.prompt_tokens} input, ${usage.completion_tokens} output)`);
    console.log(`   ✅ Cost: $${cost.toFixed(6)}`);
    console.log(`   ✅ Duration: ${duration}ms`);
    console.log(`   ${isValid ? '✅' : '❌'} Valid JSON: ${isValid}`);
    
    return {
      strategy,
      context,
      promptTokens: usage.prompt_tokens,
      completionTokens: usage.completion_tokens,
      totalTokens: usage.total_tokens,
      cost,
      duration,
      isValid
    };
  } catch (error) {
    console.error(`   ❌ Error: ${error instanceof Error ? error.message : 'Unknown'}`);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Granular Optimization Test');
  console.log('═'.repeat(70));
  console.log('\nTesting impact of examples, patterns, and constraints\n');
  
  const results: any[] = [];
  
  // Test operations context
  for (const strategy of ['minimal', 'optimized', 'few_shot', 'constrained']) {
    const result = await testStrategy('operations', strategy, TEST_INPUTS.operations);
    if (result) results.push(result);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limit
  }
  
  // Test workflows context
  for (const strategy of ['minimal', 'optimized', 'few_shot', 'constrained']) {
    const result = await testStrategy('workflows', strategy, TEST_INPUTS.workflows);
    if (result) results.push(result);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limit
  }
  
  // Summary
  console.log('\n\n📊 RESULTS SUMMARY');
  console.log('═'.repeat(70));
  
  const operationsResults = results.filter(r => r?.context === 'operations');
  const workflowsResults = results.filter(r => r?.context === 'workflows');
  
  console.log('\n📋 Operations Context:');
  operationsResults.forEach(r => {
    console.log(`  ${r.strategy}: ${r.totalTokens} tokens, $${r.cost.toFixed(6)}, ${r.isValid ? '✅' : '❌'}`);
  });
  
  console.log('\n📋 Workflows Context:');
  workflowsResults.forEach(r => {
    console.log(`  ${r.strategy}: ${r.totalTokens} tokens, $${r.cost.toFixed(6)}, ${r.isValid ? '✅' : '❌'}`);
  });
  
  // Find best strategy per context
  const bestOps = operationsResults.reduce((best, curr) => 
    curr.totalTokens < best.totalTokens && curr.isValid ? curr : best
  );
  const bestWorkflows = workflowsResults.reduce((best, curr) => 
    curr.totalTokens < best.totalTokens && curr.isValid ? curr : best
  );
  
  console.log('\n💡 Recommendations:');
  console.log(`  Operations: Use "${bestOps.strategy}" (${bestOps.totalTokens} tokens, $${bestOps.cost.toFixed(6)})`);
  console.log(`  Workflows: Use "${bestWorkflows.strategy}" (${bestWorkflows.totalTokens} tokens, $${bestWorkflows.cost.toFixed(6)})`);
  
  // Calculate savings vs baseline
  const baselineOps = operationsResults.find(r => r.strategy === 'optimized');
  const baselineWorkflows = workflowsResults.find(r => r.strategy === 'optimized');
  
  if (baselineOps && bestOps !== baselineOps) {
    const savings = ((baselineOps.totalTokens - bestOps.totalTokens) / baselineOps.totalTokens * 100).toFixed(1);
    console.log(`\n  Operations savings: ${savings}% vs optimized baseline`);
  }
  
  if (baselineWorkflows && bestWorkflows !== baselineWorkflows) {
    const savings = ((baselineWorkflows.totalTokens - bestWorkflows.totalTokens) / baselineWorkflows.totalTokens * 100).toFixed(1);
    console.log(`  Workflows savings: ${savings}% vs optimized baseline`);
  }
}

if (require.main === module) {
  runTests().catch(console.error);
}

