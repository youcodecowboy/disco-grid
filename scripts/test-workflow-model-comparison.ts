#!/usr/bin/env tsx
/**
 * Workflow Model Comparison Test
 * 
 * Tests if 3B model can handle complex workflow generation (currently uses 120B).
 * Compares accuracy and token usage between models.
 */

import Together from 'together-ai';
import { getPromptForContext } from '../app/api/nlp/extract/prompts';

const apiKey = process.env.TOGETHER_API_KEY;
if (!apiKey) {
  console.error('❌ TOGETHER_API_KEY not found');
  process.exit(1);
}

const together = new Together({ apiKey });

// Complex workflow test inputs
const WORKFLOW_TESTS = [
  {
    name: "Simple Sequential",
    input: "Our process is cutting, then sewing, then washing, finishing, QA, and packing."
  },
  {
    name: "Complex with Dependencies",
    input: "We run a denim factory. Process: inspection, cutting, sewing, washing, finishing, QA, packing. Between cutting and sewing, fabric rests 2 hours. Sewing needs manager approval to start. After washing, we wait 4 hours before finishing."
  },
  {
    name: "Parallel Stages",
    input: "We produce jackets with two halves. The left side and right side are cut and sewn simultaneously, then assembled together, followed by washing, finishing, and packing."
  },
  {
    name: "Multi-Department",
    input: "Fabric arrives and is inspected by QC. Then cutting department cuts pieces. Sewing department assembles. Washing department processes. Finishing adds tags and labels. Final QC inspection. Packing ships out. Each stage has different teams."
  }
];

async function testModel(
  model: string,
  testName: string,
  userInput: string
) {
  const promptConfig = getPromptForContext('workflow_creation');
  const costPer1M = model.includes('120b') ? 0.80 : 0.06;
  
  console.log(`\n🧪 Testing ${testName} with ${model}`);
  console.log(`   Input: ${userInput.substring(0, 80)}...`);
  
  try {
    const startTime = Date.now();
    const response = await together.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: promptConfig.systemPrompt },
        { role: 'user', content: userInput }
      ],
      temperature: 0.2,
      max_tokens: model.includes('120b') ? 4000 : 2000, // Allow more for 120B
      response_format: { type: 'json_object' }
    });
    const duration = Date.now() - startTime;
    
    const usage = response.usage!;
    const cost = (usage.total_tokens / 1_000_000) * costPer1M;
    
    const content = response.choices[0]?.message?.content;
    let parsed;
    let stages = [];
    let limboZones = [];
    let isValid = false;
    
    try {
      parsed = JSON.parse(content || '{}');
      stages = parsed.stages || [];
      limboZones = parsed.limboZones || [];
      isValid = Array.isArray(stages) && stages.length > 0;
    } catch (e) {
      isValid = false;
    }
    
    console.log(`   ✅ Tokens: ${usage.total_tokens} (${usage.prompt_tokens} input, ${usage.completion_tokens} output)`);
    console.log(`   ✅ Cost: $${cost.toFixed(6)}`);
    console.log(`   ✅ Duration: ${duration}ms`);
    console.log(`   ✅ Stages extracted: ${stages.length}`);
    console.log(`   ✅ Limbo zones: ${limboZones.length}`);
    console.log(`   ${isValid ? '✅' : '❌'} Valid JSON: ${isValid}`);
    
    if (isValid && stages.length > 0) {
      console.log(`   📋 Sample stages: ${stages.slice(0, 3).map((s: any) => s.name).join(', ')}`);
    }
    
    return {
      model,
      testName,
      tokens: usage.total_tokens,
      inputTokens: usage.prompt_tokens,
      outputTokens: usage.completion_tokens,
      cost,
      duration,
      isValid,
      stagesCount: stages.length,
      limboZonesCount: limboZones.length,
      parsed
    };
  } catch (error) {
    console.error(`   ❌ Error: ${error instanceof Error ? error.message : 'Unknown'}`);
    return {
      model,
      testName,
      error: error instanceof Error ? error.message : 'Unknown',
      isValid: false
    };
  }
}

async function runComparison() {
  console.log('🔬 Workflow Model Comparison Test');
  console.log('═'.repeat(70));
  console.log('\nTesting if 3B model can handle complex workflow generation');
  console.log('(Currently uses 120B model - much more expensive)\n');
  
  const results: any[] = [];
  
  for (const test of WORKFLOW_TESTS) {
    // Test with 120B (current)
    const result120B = await testModel(
      "openai/gpt-oss-120b",
      test.name,
      test.input
    );
    results.push(result120B);
    
    await new Promise(resolve => setTimeout(resolve, 2000)); // Rate limit
    
    // Test with 3B (potential alternative)
    const result3B = await testModel(
      "meta-llama/Llama-3.2-3B-Instruct-Turbo",
      test.name,
      test.input
    );
    results.push(result3B);
    
    await new Promise(resolve => setTimeout(resolve, 2000)); // Rate limit
  }
  
  // Summary
  console.log('\n\n📊 COMPARISON SUMMARY');
  console.log('═'.repeat(70));
  
  const model120B = results.filter(r => r.model?.includes('120b'));
  const model3B = results.filter(r => r.model?.includes('3B'));
  
  const avgTokens120B = model120B.reduce((sum, r) => sum + (r.tokens || 0), 0) / model120B.length;
  const avgTokens3B = model3B.reduce((sum, r) => sum + (r.tokens || 0), 0) / model3B.length;
  
  const avgCost120B = model120B.reduce((sum, r) => sum + (r.cost || 0), 0) / model120B.length;
  const avgCost3B = model3B.reduce((sum, r) => sum + (r.cost || 0), 0) / model3B.length;
  
  const avgDuration120B = model120B.reduce((sum, r) => sum + (r.duration || 0), 0) / model120B.length;
  const avgDuration3B = model3B.reduce((sum, r) => sum + (r.duration || 0), 0) / model3B.length;
  
  const accuracy120B = (model120B.filter(r => r.isValid).length / model120B.length) * 100;
  const accuracy3B = (model3B.filter(r => r.isValid).length / model3B.length) * 100;
  
  const avgStages120B = model120B.reduce((sum, r) => sum + (r.stagesCount || 0), 0) / model120B.length;
  const avgStages3B = model3B.reduce((sum, r) => sum + (r.stagesCount || 0), 0) / model3B.length;
  
  console.log(`\n120B Model (Current):`);
  console.log(`  Avg Tokens: ${avgTokens120B.toFixed(0)}`);
  console.log(`  Avg Cost: $${avgCost120B.toFixed(6)}`);
  console.log(`  Avg Duration: ${avgDuration120B.toFixed(0)}ms`);
  console.log(`  Accuracy: ${accuracy120B.toFixed(1)}%`);
  console.log(`  Avg Stages Extracted: ${avgStages120B.toFixed(1)}`);
  
  console.log(`\n3B Model (Potential):`);
  console.log(`  Avg Tokens: ${avgTokens3B.toFixed(0)}`);
  console.log(`  Avg Cost: $${avgCost3B.toFixed(6)}`);
  console.log(`  Avg Duration: ${avgDuration3B.toFixed(0)}ms`);
  console.log(`  Accuracy: ${accuracy3B.toFixed(1)}%`);
  console.log(`  Avg Stages Extracted: ${avgStages3B.toFixed(1)}`);
  
  const costSavings = ((avgCost120B - avgCost3B) / avgCost120B) * 100;
  const tokenSavings = ((avgTokens120B - avgTokens3B) / avgTokens120B) * 100;
  
  console.log(`\n💰 Comparison:`);
  console.log(`  Cost Savings: ${costSavings.toFixed(1)}% ($${avgCost120B.toFixed(6)} → $${avgCost3B.toFixed(6)})`);
  console.log(`  Token Reduction: ${tokenSavings.toFixed(1)}%`);
  console.log(`  Speed Improvement: ${((avgDuration120B - avgDuration3B) / avgDuration120B * 100).toFixed(1)}%`);
  console.log(`  Accuracy Difference: ${(accuracy120B - accuracy3B).toFixed(1)}%`);
  
  console.log(`\n💡 Recommendation:`);
  if (accuracy3B >= accuracy120B - 5 && avgStages3B >= avgStages120B * 0.9) {
    console.log(`  ✅ 3B model performs well enough - consider switching to save costs`);
    console.log(`     Savings: ${costSavings.toFixed(1)}% cost reduction`);
  } else if (accuracy3B < accuracy120B - 10) {
    console.log(`  ⚠️  3B model accuracy too low (${accuracy3B.toFixed(1)}% vs ${accuracy120B.toFixed(1)}%)`);
    console.log(`     Keep 120B for complex workflows`);
  } else {
    console.log(`  🟡 3B model shows promise but needs refinement`);
    console.log(`     Consider hybrid: 3B for simple, 120B for complex`);
  }
  
  return results;
}

if (require.main === module) {
  runComparison().catch(console.error);
}

