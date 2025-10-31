#!/usr/bin/env tsx
/**
 * Run LLM Extraction Evaluation
 * 
 * Tests different prompt strategies against ground truth test cases.
 */

import Together from 'together-ai';
import { OPERATIONS_TEST_CASES, calculateAccuracy, formatTestResults, type TestResult } from '../lib/llm/evaluation/test-suite';
import { buildBalancedOperationsPrompt } from '../lib/llm/references/contexts/operations/balanced-prompt';
import { buildEnhancedBalancedOperationsPrompt } from '../lib/llm/references/contexts/operations/enhanced-balanced-prompt';
import { buildOperationsPrompt } from '../lib/llm/references/contexts/operations/prompt-builder';
import { NL_TO_OPS_MODEL, NL_TO_PLANNING_METHOD } from '../lib/llm/references';

const apiKey = process.env.TOGETHER_API_KEY;
if (!apiKey) {
  console.error('❌ TOGETHER_API_KEY not found');
  process.exit(1);
}

const together = new Together({ apiKey });

// Model configurations
const MODELS = {
  '3b': {
    name: 'meta-llama/Llama-3.2-3B-Instruct-Turbo',
    costPer1M: 0.06
  },
  '20b': {
    name: 'openai/gpt-oss-20b',
    costPer1MInput: 0.05,  // $0.05 per 1M input tokens
    costPer1MOutput: 0.20  // $0.20 per 1M output tokens
  }
};

/**
 * Normalize extracted entities using reference library
 */
function normalizeEntities(entities: any[]): any[] {
  return entities.map(entity => {
    // Normalize ops_model
    if (entity.type === 'ops_model' && typeof entity.value === 'string') {
      const normalized = NL_TO_OPS_MODEL[entity.value.toLowerCase()] || entity.value;
      return { ...entity, value: normalized };
    }
    
    // Normalize planning_method
    if (entity.type === 'planning_method' && typeof entity.value === 'string') {
      const val = entity.value.toLowerCase();
      // Check direct mappings
      if (NL_TO_PLANNING_METHOD[val]) {
        return { ...entity, value: NL_TO_PLANNING_METHOD[val] };
      }
      // Check common patterns
      if (val.includes('whiteboard') || val.includes('board') || val.includes('manual')) {
        return { ...entity, value: 'ManualBoard' };
      }
      if (val.includes('excel') || val.includes('spreadsheet') || val.includes('sheet')) {
        return { ...entity, value: 'Spreadsheet' };
      }
      if (val.includes('erp') || val.includes('system') || val.includes('sap')) {
        return { ...entity, value: 'ERP' };
      }
      if (val.includes('verbal') || val.includes('talk') || val.includes('memory')) {
        return { ...entity, value: 'Verbal' };
      }
      return entity;
    }
    
    // Normalize capacity - convert strings to numbers and handle field name variants
    if ((entity.type === 'capacity' || entity.type === 'capacity_monthly_pcs') && typeof entity.value === 'string') {
      const numStr = entity.value.replace(/[,\s]/g, '').replace(/k/i, '000').replace(/units?.*/i, '').trim();
      const num = parseInt(numStr);
      if (!isNaN(num)) {
        return { ...entity, type: 'capacity', value: num };
      }
    }
    // Also normalize if already a number but wrong field name
    if (entity.type === 'capacity_monthly_pcs' && typeof entity.value === 'number') {
      return { ...entity, type: 'capacity', value: entity.value };
    }
    
    // Normalize shifts - convert strings to numbers
    if (entity.type === 'shifts' && typeof entity.value === 'string') {
      const numStr = entity.value.replace(/shifts?.*/i, '').trim();
      const num = parseInt(numStr);
      if (!isNaN(num)) {
        return { ...entity, value: num };
      }
    }
    
    // Normalize qr_or_barcode_use
    if (entity.type === 'qr_or_barcode_use' && typeof entity.value === 'string') {
      const val = entity.value.toLowerCase();
      if (val.includes('barcode')) return { ...entity, value: 'Barcodes' };
      if (val.includes('qr')) return { ...entity, value: 'QRCodes' };
      if (val.includes('none') || val.includes("don't")) return { ...entity, value: 'None' };
    }
    
    // Normalize stages_list - capitalize first letter
    if (entity.type === 'stages_list' && typeof entity.value === 'string') {
      const capitalized = entity.value.charAt(0).toUpperCase() + entity.value.slice(1).toLowerCase();
      return { ...entity, value: capitalized };
    }
    
    return entity;
  });
}

/**
 * Test a single case with a strategy and model
 */
async function testCase(
  testCase: typeof OPERATIONS_TEST_CASES[0],
  strategy: 'minimal' | 'optimized' | 'balanced' | 'enhanced',
  prompt: string,
  modelKey: '3b' | '20b' = '3b'
): Promise<TestResult> {
  const modelConfig = MODELS[modelKey];
  console.log(`\n🧪 Testing ${testCase.id} with ${strategy} strategy (${modelKey.toUpperCase()})...`);
  
  const startTime = Date.now();
  // Use high max_tokens to prioritize accuracy - let models complete their responses
  // 20B models need more tokens, balanced prompts generate more output
  const maxTokens = 4000; // High enough to not be a limiting factor
  
  const response = await together.chat.completions.create({
    model: modelConfig.name,
    messages: [
      { role: 'system', content: prompt },
      { role: 'user', content: testCase.input }
    ],
    temperature: 0.1,
    max_tokens: maxTokens,
    response_format: { type: 'json_object' }
  });
  const duration = Date.now() - startTime;
  
  const usage = response.usage!;
  // Calculate cost based on input/output pricing for 20B, or flat rate for 3B
  let cost: number;
  if (modelKey === '20b' && 'costPer1MInput' in modelConfig) {
    const inputCost = (usage.prompt_tokens / 1_000_000) * modelConfig.costPer1MInput;
    const outputCost = (usage.completion_tokens / 1_000_000) * modelConfig.costPer1MOutput;
    cost = inputCost + outputCost;
  } else {
    cost = (usage.total_tokens / 1_000_000) * (modelConfig as any).costPer1M;
  }
  
  const content = response.choices[0]?.message?.content;
  let extracted: any[] = [];
  
  try {
    const parsed = JSON.parse(content || '{}');
    let entities = parsed.entities || [];
    
    // Handle stages_list if returned as array - split into separate entities
    entities = entities.flatMap((e: any) => {
      if (e.type === 'stages_list' && Array.isArray(e.value)) {
        return e.value.map((stage: any) => ({
          type: 'stages_list',
          value: typeof stage === 'string' ? stage : String(stage),
          confidence: e.confidence || 3,
          rawText: e.rawText
        }));
      }
      return [e];
    });
    
    extracted = normalizeEntities(entities);
  } catch (e) {
    console.error(`   ❌ Failed to parse JSON: ${e}`);
    console.error(`   Raw response: ${content?.substring(0, 500)}`);
  }
  
  const accuracy = calculateAccuracy(testCase.expected, extracted);
  
  console.log(`   ✅ Precision: ${(accuracy.precision * 100).toFixed(1)}%, Recall: ${(accuracy.recall * 100).toFixed(1)}%, F1: ${(accuracy.f1 * 100).toFixed(1)}%`);
  console.log(`   ✅ Tokens: ${usage.total_tokens} (${usage.prompt_tokens} input, ${usage.completion_tokens} output)`);
  console.log(`   ✅ Cost: $${cost.toFixed(6)}, Duration: ${duration}ms`);
  
  // Debug: Show what was extracted vs expected
  console.log(`\n   📋 Expected: ${testCase.expected.length} entities`);
  testCase.expected.forEach(e => {
    // More flexible matching
    const found = extracted.find(ex => {
      if (ex.type !== e.type) return false;
      // For stages_list, check if value is in an array or matches directly
      if (e.type === 'stages_list') {
        if (Array.isArray(ex.value)) {
          return ex.value.some((v: any) => normalizeForComparison(v) === normalizeForComparison(e.value));
        }
        return normalizeForComparison(ex.value) === normalizeForComparison(e.value);
      }
      return normalizeForComparison(ex.value) === normalizeForComparison(e.value);
    });
    console.log(`      ${found ? '✅' : '❌'} ${e.type}: ${JSON.stringify(e.value)}`);
  });
  
  console.log(`\n   📋 Extracted: ${extracted.length} entities`);
  extracted.slice(0, 15).forEach(e => {
    // Check if matches expected
    const expected = testCase.expected.find(ex => {
      if (ex.type !== e.type) return false;
      if (e.type === 'stages_list' && Array.isArray(e.value)) {
        return e.value.some((v: any) => normalizeForComparison(v) === normalizeForComparison(ex.value));
      }
      return normalizeForComparison(e.value) === normalizeForComparison(ex.value);
    });
    console.log(`      ${expected ? '✅' : '⚠️ '} ${e.type}: ${JSON.stringify(e.value)}`);
  });
  if (extracted.length > 15) {
    console.log(`      ... and ${extracted.length - 15} more`);
  }
  
  // Helper function for comparison
  function normalizeForComparison(val: any): string {
    if (typeof val === 'string') return val.toLowerCase().trim();
    if (typeof val === 'number') return val.toString();
    if (typeof val === 'boolean') return val.toString();
    return JSON.stringify(val);
  }
  
  return {
    testCase,
    strategy: `${strategy}-${modelKey}`,
    extracted,
    accuracy,
    tokens: {
      input: usage.prompt_tokens,
      output: usage.completion_tokens,
      total: usage.total_tokens
    },
    cost
  };
}

async function runEvaluation() {
  console.log('🔬 LLM Extraction Evaluation');
  console.log('═'.repeat(70));
  console.log('\nTesting prompt strategies against ground truth test cases\n');
  
  const results: TestResult[] = [];
  
  // Get prompts for each strategy
  const minimalPrompt = buildOperationsPrompt({ strategy: 'minimal' });
  const optimizedPrompt = buildOperationsPrompt({ strategy: 'optimized' });
  const balancedPrompt = buildBalancedOperationsPrompt();
  const enhancedPrompt = buildEnhancedBalancedOperationsPrompt();
  
  console.log(`\n📏 Prompt sizes:`);
  console.log(`  Minimal: ~${Math.ceil(minimalPrompt.length / 4)} tokens`);
  console.log(`  Optimized: ~${Math.ceil(optimizedPrompt.length / 4)} tokens`);
  console.log(`  Balanced: ~${Math.ceil(balancedPrompt.length / 4)} tokens`);
  console.log(`  Enhanced: ~${Math.ceil(enhancedPrompt.length / 4)} tokens`);
  
  // Test each case with each strategy and model
  for (const testCaseItem of OPERATIONS_TEST_CASES) {
    // Test with 3B model
    console.log(`\n📊 Testing with 3B model:`);
    const resultMinimal3B = await testCase(testCaseItem, 'minimal', minimalPrompt, '3b');
    results.push(resultMinimal3B);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const resultOptimized3B = await testCase(testCaseItem, 'optimized', optimizedPrompt, '3b');
    results.push(resultOptimized3B);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const resultBalanced3B = await testCase(testCaseItem, 'balanced', balancedPrompt, '3b');
    results.push(resultBalanced3B);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test with 20B model
    console.log(`\n📊 Testing with 20B model:`);
    const resultMinimal20B = await testCase(testCaseItem, 'minimal', minimalPrompt, '20b');
    results.push(resultMinimal20B);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const resultOptimized20B = await testCase(testCaseItem, 'optimized', optimizedPrompt, '20b');
    results.push(resultOptimized20B);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const resultBalanced20B = await testCase(testCaseItem, 'balanced', balancedPrompt, '20b');
    results.push(resultBalanced20B);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test Enhanced strategy (few-shot examples)
    const resultEnhanced20B = await testCase(testCaseItem, 'enhanced', enhancedPrompt, '20b');
    results.push(resultEnhanced20B);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  console.log(formatTestResults(results));
  
  // Recommendations
  console.log('\n\n💡 MODEL COMPARISON');
  console.log('═'.repeat(70));
  
  // Group by model and strategy
  const results3B = results.filter(r => r.strategy.includes('3b'));
  const results20B = results.filter(r => r.strategy.includes('20b'));
  
  const strategies = ['minimal', 'optimized', 'balanced', 'enhanced'];
  
  console.log(`\n📊 3B Model Results:`);
  strategies.forEach(strategy => {
    const strategyResults = results3B.filter(r => r.strategy.startsWith(strategy));
    if (strategyResults.length > 0) {
      const avgF1 = strategyResults.reduce((sum, r) => sum + r.accuracy.f1, 0) / strategyResults.length;
      const avgTokens = strategyResults.reduce((sum, r) => sum + r.tokens.total, 0) / strategyResults.length;
      const avgCost = strategyResults.reduce((sum, r) => sum + r.cost, 0) / strategyResults.length;
      console.log(`  ${strategy}: F1=${(avgF1 * 100).toFixed(1)}%, Tokens=${avgTokens.toFixed(0)}, Cost=$${avgCost.toFixed(6)}`);
    }
  });
  
  console.log(`\n📊 20B Model Results:`);
  strategies.forEach(strategy => {
    const strategyResults = results20B.filter(r => r.strategy.startsWith(strategy));
    if (strategyResults.length > 0) {
      const avgF1 = strategyResults.reduce((sum, r) => sum + r.accuracy.f1, 0) / strategyResults.length;
      const avgTokens = strategyResults.reduce((sum, r) => sum + r.tokens.total, 0) / strategyResults.length;
      const avgCost = strategyResults.reduce((sum, r) => sum + r.cost, 0) / strategyResults.length;
      console.log(`  ${strategy}: F1=${(avgF1 * 100).toFixed(1)}%, Tokens=${avgTokens.toFixed(0)}, Cost=$${avgCost.toFixed(6)}`);
    }
  });
  
  // Compare best strategies
  const best3B = results3B.reduce((best, curr) => curr.accuracy.f1 > best.accuracy.f1 ? curr : best);
  const best20B = results20B.reduce((best, curr) => curr.accuracy.f1 > best.accuracy.f1 ? curr : best);
  
  console.log(`\n🏆 Best Results:`);
  console.log(`  3B: ${best3B.strategy} - F1=${(best3B.accuracy.f1 * 100).toFixed(1)}%, Cost=$${best3B.cost.toFixed(6)}`);
  console.log(`  20B: ${best20B.strategy} - F1=${(best20B.accuracy.f1 * 100).toFixed(1)}%, Cost=$${best20B.cost.toFixed(6)}`);
  
  const f1Improvement = ((best20B.accuracy.f1 - best3B.accuracy.f1) / best3B.accuracy.f1) * 100;
  const costIncrease = ((best20B.cost - best3B.cost) / best3B.cost) * 100;
  
  console.log(`\n📈 Comparison:`);
  console.log(`  F1 Improvement: ${f1Improvement > 0 ? '+' : ''}${f1Improvement.toFixed(1)}%`);
  console.log(`  Cost Increase: ${costIncrease > 0 ? '+' : ''}${costIncrease.toFixed(1)}%`);
  
  if (best20B.accuracy.f1 > best3B.accuracy.f1 + 0.1) {
    console.log(`\n✅ Recommended: 20B Model`);
    console.log(`   Significantly better accuracy (${((best20B.accuracy.f1 - best3B.accuracy.f1) * 100).toFixed(1)}% F1 improvement)`);
    console.log(`   Worth the ${costIncrease.toFixed(1)}% cost increase for better accuracy`);
  } else if (best20B.accuracy.f1 < best3B.accuracy.f1 - 0.05) {
    console.log(`\n✅ Recommended: 3B Model`);
    console.log(`   Better accuracy and lower cost`);
  } else {
    console.log(`\n✅ Recommended: 3B Model`);
    console.log(`   Similar accuracy at much lower cost (${Math.abs(costIncrease).toFixed(1)}% cheaper)`);
  }
}

if (require.main === module) {
  runEvaluation().catch(console.error);
}

