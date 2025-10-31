#!/usr/bin/env tsx
/**
 * Token Usage Test Script
 * 
 * Tests actual token usage for onboarding prompts with different strategies.
 * Run with: npx tsx scripts/test-token-usage.ts
 */

import Together from 'together-ai';
import { getPromptForContext } from '../app/api/nlp/extract/prompts';
import { estimateTokens } from '../lib/llm/token-analysis/measure-tokens';
import { 
  NL_TO_OPS_MODEL, 
  NL_TO_WORKFLOW_STAGE,
  OPERATIONS_MODELS,
  WORKFLOW_STAGES
} from '../lib/llm/references';

// Check for API key
const apiKey = process.env.TOGETHER_API_KEY;
if (!apiKey) {
  console.error('❌ TOGETHER_API_KEY not found in environment variables.');
  console.error('   Please set it in .env.local or export it before running.');
  console.error('   Falling back to estimation-only mode...\n');
}

const together = apiKey ? new Together({ apiKey }) : null;
const USE_REAL_API = !!apiKey;

// Test inputs (typical onboarding responses)
const TEST_INPUTS = {
  operations: "We make custom orders based on customer requests. Our process is cutting, then sewing, then washing, finishing, QA, and packing. We use a whiteboard for planning and track everything on paper.",
  workflows: "Our production flow starts with fabric inspection, then cutting, sewing, washing, finishing, quality check, and finally packing and shipping.",
  teams: "We have about 45 people total. We have cutting department with 8 people, sewing with 20, finishing with 10, QC with 5, and packing with 2. We communicate via WhatsApp."
};

/**
 * Strategy 1: Current approach (full prompt with mappings)
 */
async function testCurrentApproach(context: 'operations' | 'workflows' | 'teams') {
  const promptConfig = getPromptForContext(context);
  const userInput = TEST_INPUTS[context];
  
  // Determine model and pricing
  const model = context === 'workflows' ? "openai/gpt-oss-120b" : "meta-llama/Llama-3.2-3B-Instruct-Turbo";
  const costPer1M = model.includes('120b') ? 0.80 : 0.06;
  
  console.log(`\n📊 Testing CURRENT approach (${context})`);
  console.log(`   Model: ${model}`);
  console.log(`   Prompt length: ${promptConfig.systemPrompt.length} chars`);
  const estimated = estimateTokens(promptConfig.systemPrompt);
  console.log(`   Estimated tokens: ~${estimated}`);
  
  if (!USE_REAL_API) {
    const userInputTokens = estimateTokens(userInput);
    const totalEstimated = estimated + userInputTokens + 100; // +100 for response
    // Correct pricing: Same rate for input/output, different per model
    const cost = (totalEstimated / 1_000_000) * costPer1M;
    console.log(`   ⚠️  Estimation only (no API key)`);
    console.log(`   Estimated total: ~${totalEstimated} tokens`);
    console.log(`   Estimated cost: $${cost.toFixed(6)}`);
    return {
      strategy: 'Current',
      context,
      model,
      promptTokens: estimated,
      completionTokens: 100,
      totalTokens: totalEstimated,
      cost
    };
  }
  
  try {
    const response = await together!.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: promptConfig.systemPrompt },
        { role: 'user', content: userInput }
      ],
      temperature: 0.1,
      max_tokens: context === 'workflows' ? 4000 : 1000, // Workflows need more tokens
      response_format: { type: 'json_object' }
    });

    const usage = response.usage!;
    // Correct pricing: Same rate for input and output
    const cost = (usage.total_tokens / 1_000_000) * costPer1M;
    
    console.log(`   ✅ Actual tokens: ${usage.total_tokens}`);
    console.log(`      - Prompt: ${usage.prompt_tokens}`);
    console.log(`      - Completion: ${usage.completion_tokens}`);
    console.log(`      - Cost: $${cost.toFixed(6)}`);
    
    return {
      strategy: 'Current',
      context,
      model,
      promptTokens: usage.prompt_tokens,
      completionTokens: usage.completion_tokens,
      totalTokens: usage.total_tokens,
      cost
    };
  } catch (error) {
    console.error(`   ❌ Error: ${error instanceof Error ? error.message : 'Unknown'}`);
    return null;
  }
}

/**
 * Strategy 2: Optimized approach (minimal prompt, only common mappings)
 */
async function testOptimizedApproach(context: 'operations' | 'workflows' | 'teams') {
  let optimizedPrompt = '';
  
  if (context === 'operations') {
    optimizedPrompt = `You are an expert at extracting operational information from natural language.
Extract ONLY operations-related entities. Return valid JSON only.

Format:
{
  "entities": [
    {
      "type": "<entity_type>",
      "value": <extracted value>,
      "confidence": 1 | 2 | 3,
      "rawText": "<source text>"
    }
  ]
}

EXTRACT THESE ENTITY TYPES:

OPERATIONS MODEL:
- "ops_model": "MTO" | "MTS" | "hybrid"
  Common phrases: made to order, custom order, stock, warehouse, inventory

PRODUCTION STAGES:
- "stages_list": string[] - Extract stage names mentioned
  Common stages: ${Object.values(WORKFLOW_STAGES).slice(0, 8).join(', ')}

PLANNING METHOD:
- "planning_method": "ManualBoard" | "Spreadsheet" | "ERP" | "Verbal" | "Other"
  Look for: whiteboard, excel, erp, verbal

RULES:
- confidence: 3=explicit, 2=implied, 1=inferred
- Use canonical enum values where specified`;
  } else if (context === 'workflows') {
    optimizedPrompt = `You are an expert at extracting workflow information from natural language.
Extract ONLY workflow-related entities. Return valid JSON only.

Format:
{
  "entities": [
    {
      "type": "<entity_type>",
      "value": <extracted value>,
      "confidence": 1 | 2 | 3,
      "rawText": "<source text>"
    }
  ]
}

EXTRACT THESE ENTITY TYPES:

WORKFLOW STAGES:
- "workflow_stage": string - Process steps
  Common stages: ${Object.values(WORKFLOW_STAGES).slice(0, 10).join(', ')}

RULES:
- Extract ALL stages mentioned in chronological order
- Use canonical enum values`;
  } else {
    optimizedPrompt = `You are an expert at extracting team information from natural language.
Extract ONLY team-related entities. Return valid JSON only.

Format:
{
  "entities": [
    {
      "type": "<entity_type>",
      "value": <extracted value>,
      "confidence": 1 | 2 | 3,
      "rawText": "<source text>"
    }
  ]
}

EXTRACT THESE ENTITY TYPES:

DEPARTMENTS:
- "department": string - Department names
  Common: Cutting, Sewing, Finishing, QC, Packing

COMMUNICATION:
- "communication_method": "Verbal" | "WhatsApp" | "Paper" | "Software" | "Mixed"

RULES:
- confidence: 3=explicit, 2=implied, 1=inferred`;
  }

  const userInput = TEST_INPUTS[context];
  
  // Determine model and pricing
  const model = context === 'workflows' ? "openai/gpt-oss-120b" : "meta-llama/Llama-3.2-3B-Instruct-Turbo";
  const costPer1M = model.includes('120b') ? 0.80 : 0.06;
  
  console.log(`\n📊 Testing OPTIMIZED approach (${context})`);
  console.log(`   Model: ${model}`);
  console.log(`   Prompt length: ${optimizedPrompt.length} chars`);
  const estimated = estimateTokens(optimizedPrompt);
  console.log(`   Estimated tokens: ~${estimated}`);
  
  if (!USE_REAL_API) {
    const userInputTokens = estimateTokens(userInput);
    const totalEstimated = estimated + userInputTokens + 100;
    // Correct pricing: Same rate for input/output
    const cost = (totalEstimated / 1_000_000) * costPer1M;
    console.log(`   ⚠️  Estimation only (no API key)`);
    console.log(`   Estimated total: ~${totalEstimated} tokens`);
    console.log(`   Estimated cost: $${cost.toFixed(6)}`);
    return {
      strategy: 'Optimized',
      context,
      model,
      promptTokens: estimated,
      completionTokens: 100,
      totalTokens: totalEstimated,
      cost
    };
  }
  
  try {
    const response = await together!.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: optimizedPrompt },
        { role: 'user', content: userInput }
      ],
      temperature: 0.1,
      max_tokens: context === 'workflows' ? 4000 : 1000,
      response_format: { type: 'json_object' }
    });

    const usage = response.usage!;
    const cost = (usage.total_tokens / 1_000_000) * costPer1M;
    
    console.log(`   ✅ Actual tokens: ${usage.total_tokens}`);
    console.log(`      - Prompt: ${usage.prompt_tokens}`);
    console.log(`      - Completion: ${usage.completion_tokens}`);
    console.log(`      - Cost: $${cost.toFixed(6)}`);
    
    return {
      strategy: 'Optimized',
      context,
      model,
      promptTokens: usage.prompt_tokens,
      completionTokens: usage.completion_tokens,
      totalTokens: usage.total_tokens,
      cost
    };
  } catch (error) {
    console.error(`   ❌ Error: ${error instanceof Error ? error.message : 'Unknown'}`);
    return null;
  }
}

/**
 * Strategy 3: Minimal prompt (reference library used for post-processing)
 */
async function testMinimalApproach(context: 'operations' | 'workflows' | 'teams') {
  const minimalPrompt = `You are an expert at extracting structured information from natural language.
Extract entities mentioned in the user's description.

Return JSON format:
{
  "entities": [
    {
      "type": "<entity_type>",
      "value": <extracted value>,
      "confidence": 1 | 2 | 3,
      "rawText": "<source text>"
    }
  ]
}

${context === 'operations' ? 'Extract: ops_model, stages_list, planning_method, capacity, shifts' : ''}
${context === 'workflows' ? 'Extract: workflow_stage, department, quality_checkpoint' : ''}
${context === 'teams' ? 'Extract: department, team_size, communication_method, role_type' : ''}

confidence: 3=explicit, 2=implied, 1=inferred
Extract what's mentioned, use exact values from the text.`;

  const userInput = TEST_INPUTS[context];
  
  // Determine model and pricing
  const model = context === 'workflows' ? "openai/gpt-oss-120b" : "meta-llama/Llama-3.2-3B-Instruct-Turbo";
  const costPer1M = model.includes('120b') ? 0.80 : 0.06;
  
  console.log(`\n📊 Testing MINIMAL approach (${context})`);
  console.log(`   Model: ${model}`);
  console.log(`   Prompt length: ${minimalPrompt.length} chars`);
  const estimated = estimateTokens(minimalPrompt);
  console.log(`   Estimated tokens: ~${estimated}`);
  
  if (!USE_REAL_API) {
    const userInputTokens = estimateTokens(userInput);
    const totalEstimated = estimated + userInputTokens + 100;
    // Correct pricing: Same rate for input/output
    const cost = (totalEstimated / 1_000_000) * costPer1M;
    console.log(`   ⚠️  Estimation only (no API key)`);
    console.log(`   Estimated total: ~${totalEstimated} tokens`);
    console.log(`   Estimated cost: $${cost.toFixed(6)}`);
    return {
      strategy: 'Minimal',
      context,
      model,
      promptTokens: estimated,
      completionTokens: 100,
      totalTokens: totalEstimated,
      cost
    };
  }
  
  try {
    const response = await together!.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: minimalPrompt },
        { role: 'user', content: userInput }
      ],
      temperature: 0.1,
      max_tokens: context === 'workflows' ? 4000 : 1000,
      response_format: { type: 'json_object' }
    });

    const usage = response.usage!;
    const cost = (usage.total_tokens / 1_000_000) * costPer1M;
    
    console.log(`   ✅ Actual tokens: ${usage.total_tokens}`);
    console.log(`      - Prompt: ${usage.prompt_tokens}`);
    console.log(`      - Completion: ${usage.completion_tokens}`);
    console.log(`      - Cost: $${cost.toFixed(6)}`);
    
    return {
      strategy: 'Minimal',
      context,
      model,
      promptTokens: usage.prompt_tokens,
      completionTokens: usage.completion_tokens,
      totalTokens: usage.total_tokens,
      cost
    };
  } catch (error) {
    console.error(`   ❌ Error: ${error instanceof Error ? error.message : 'Unknown'}`);
    return null;
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('🧪 Token Usage Comparison Tests');
  console.log('═'.repeat(70));
  console.log('\n⚠️  Note: This will make actual API calls and incur costs.');
  console.log('   Estimated cost: ~$0.0001 per test (negligible)\n');

  const results: Array<{
    strategy: string;
    context: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    cost: number;
  }> = [];

  const contexts: Array<'operations' | 'workflows' | 'teams'> = ['operations', 'workflows', 'teams'];

  for (const context of contexts) {
    // Test current approach
    const current = await testCurrentApproach(context);
    if (current) results.push(current);
    
    // Wait a bit between calls
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test optimized approach
    const optimized = await testOptimizedApproach(context);
    if (optimized) results.push(optimized);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test minimal approach
    const minimal = await testMinimalApproach(context);
    if (minimal) results.push(minimal);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Summary
  console.log('\n\n📊 SUMMARY');
  console.log('═'.repeat(70));

  for (const context of contexts) {
    const ctxResults = results.filter(r => r.context === context);
    const current = ctxResults.find(r => r.strategy === 'Current');
    const optimized = ctxResults.find(r => r.strategy === 'Optimized');
    const minimal = ctxResults.find(r => r.strategy === 'Minimal');

    if (!current || !optimized || !minimal) continue;

    console.log(`\n📋 Context: ${context.toUpperCase()}`);
    console.log('─'.repeat(70));
    
    for (const result of ctxResults) {
      const savings = current.totalTokens - result.totalTokens;
      const savingsPct = ((savings / current.totalTokens) * 100).toFixed(1);
      
      console.log(`\n${result.strategy}:`);
      console.log(`  Total Tokens: ${result.totalTokens}`);
      console.log(`  Cost: $${result.cost.toFixed(6)}`);
      if (result !== current) {
        console.log(`  Savings: ${savings} tokens (${savingsPct}% reduction)`);
        console.log(`  Cost Savings: $${((savings / 1_000_000) * 0.10).toFixed(6)} per call`);
      }
    }
  }

  // Overall summary
  const totalCurrent = results
    .filter(r => r.strategy === 'Current')
    .reduce((sum, r) => sum + r.totalTokens, 0);
  const totalOptimized = results
    .filter(r => r.strategy === 'Optimized')
    .reduce((sum, r) => sum + r.totalTokens, 0);
  const totalMinimal = results
    .filter(r => r.strategy === 'Minimal')
    .reduce((sum, r) => sum + r.totalTokens, 0);

  console.log(`\n\n💰 OVERALL COMPARISON`);
  console.log('═'.repeat(70));
  console.log(`\nTotal tokens across all contexts:`);
  console.log(`  Current: ${totalCurrent.toLocaleString()}`);
  console.log(`  Optimized: ${totalOptimized.toLocaleString()} (${((1 - totalOptimized/totalCurrent) * 100).toFixed(1)}% reduction)`);
  console.log(`  Minimal: ${totalMinimal.toLocaleString()} (${((1 - totalMinimal/totalCurrent) * 100).toFixed(1)}% reduction)`);

  // Calculate average input/output tokens per request
  // Assuming ~80% input tokens, ~20% output tokens (typical for extraction tasks)
  // Calculate costs using correct pricing per context
  // Operations/Teams: 3B model = $0.06/1M tokens (same for input/output)
  // Workflows: 120B model = $0.80/1M tokens (same for input/output)
  
  // Get actual token breakdowns from results
  const operationsCurrent = results.find(r => r.context === 'operations' && r.strategy === 'Current');
  const workflowsCurrent = results.find(r => r.context === 'workflows' && r.strategy === 'Current');
  const teamsCurrent = results.find(r => r.context === 'teams' && r.strategy === 'Current');
  
  const operationsOptimized = results.find(r => r.context === 'operations' && r.strategy === 'Optimized');
  const workflowsOptimized = results.find(r => r.context === 'workflows' && r.strategy === 'Optimized');
  const teamsOptimized = results.find(r => r.context === 'teams' && r.strategy === 'Optimized');
  
  const operationsMinimal = results.find(r => r.context === 'operations' && r.strategy === 'Minimal');
  const workflowsMinimal = results.find(r => r.context === 'workflows' && r.strategy === 'Minimal');
  const teamsMinimal = results.find(r => r.context === 'teams' && r.strategy === 'Minimal');
  
  // Calculate costs with correct pricing
  const costCurrent = 
    (operationsCurrent?.totalTokens || 0) * 0.06 / 1_000_000 +
    (workflowsCurrent?.totalTokens || 0) * 0.80 / 1_000_000 +
    (teamsCurrent?.totalTokens || 0) * 0.06 / 1_000_000;
    
  const costOptimized = 
    (operationsOptimized?.totalTokens || 0) * 0.06 / 1_000_000 +
    (workflowsOptimized?.totalTokens || 0) * 0.80 / 1_000_000 +
    (teamsOptimized?.totalTokens || 0) * 0.06 / 1_000_000;
    
  const costMinimal = 
    (operationsMinimal?.totalTokens || 0) * 0.06 / 1_000_000 +
    (workflowsMinimal?.totalTokens || 0) * 0.80 / 1_000_000 +
    (teamsMinimal?.totalTokens || 0) * 0.06 / 1_000_000;
  
  // Cost per 1M requests (multiply by 1M)
  const costPer1MCurrent = costCurrent * 1_000_000;
  const costPer1MOptimized = costOptimized * 1_000_000;
  const costPer1MMinimal = costMinimal * 1_000_000;

  console.log(`\n💰 Cost per 1M requests:`);
  console.log(`  Current: $${costPer1MCurrent.toFixed(2)}`);
  console.log(`  Optimized: $${costPer1MOptimized.toFixed(2)} (saves $${(costPer1MCurrent - costPer1MOptimized).toFixed(2)})`);
  console.log(`  Minimal: $${costPer1MMinimal.toFixed(2)} (saves $${(costPer1MCurrent - costPer1MMinimal).toFixed(2)})`);
  
  // Calculate annual savings (assuming 10M requests/year)
  const annualSavingsOptimized = (costPer1MCurrent - costPer1MOptimized) * 10;
  const annualSavingsMinimal = (costPer1MCurrent - costPer1MMinimal) * 10;
  
  console.log(`\n💰 Annual savings (10M requests/year):`);
  console.log(`  Optimized: $${annualSavingsOptimized.toFixed(2)}`);
  console.log(`  Minimal: $${annualSavingsMinimal.toFixed(2)}`);

  console.log(`\n\n💡 RECOMMENDATION`);
  console.log('═'.repeat(70));
  const bestSavings = Math.max(
    totalCurrent - totalOptimized,
    totalCurrent - totalMinimal
  );
  if (bestSavings === totalCurrent - totalMinimal) {
    console.log(`\n✅ Use MINIMAL approach with reference library post-processing`);
    console.log(`   - ${((1 - totalMinimal/totalCurrent) * 100).toFixed(1)}% token reduction`);
    console.log(`   - Reference library ensures accuracy`);
    console.log(`   - Prompts are cacheable (even more savings)`);
  } else {
    console.log(`\n✅ Use OPTIMIZED approach`);
    console.log(`   - ${((1 - totalOptimized/totalCurrent) * 100).toFixed(1)}% token reduction`);
    console.log(`   - Still includes essential mappings`);
  }
}

// Run if executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

