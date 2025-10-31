/**
 * Test Script: Compare Token Usage for Onboarding Prompts
 * 
 * This script tests different prompt strategies to measure token usage:
 * 1. Current approach (mappings embedded in prompt)
 * 2. Optimized approach (only relevant mappings per context)
 * 3. Reference-only approach (library used for post-processing)
 */

import { estimateTokens } from './measure-tokens';
import { getPromptForContext } from '@/app/api/nlp/extract/prompts';
import { 
  NL_TO_OPS_MODEL, 
  NL_TO_WORKFLOW_STAGE,
  NL_TO_DEPARTMENT,
  OPERATIONS_MODELS,
  WORKFLOW_STAGES,
  DEPARTMENTS
} from '../references';

// Test user inputs (typical onboarding responses)
const TEST_INPUTS = {
  operations: [
    "We make custom orders based on customer requests. Our process is cutting, then sewing, then washing, finishing, QA, and packing. We use a whiteboard for planning and track everything on paper.",
    "We're a make-to-stock manufacturer. We produce about 50,000 units per month. We run two shifts per day. We plan using Excel spreadsheets.",
    "Made to order, custom pieces. We subcontract washing and finishing. We track materials manually using clipboards."
  ],
  workflows: [
    "Our production flow starts with fabric inspection, then cutting, sewing, washing, finishing, quality check, and finally packing and shipping.",
    "We receive orders, cut fabric, sew pieces together, wash them, do finishing work, inspect quality, and pack for shipping."
  ],
  teams: [
    "We have about 45 people total. We have cutting department with 8 people, sewing with 20, finishing with 10, QC with 5, and packing with 2. We communicate via WhatsApp.",
    "Our team structure: 35 operators, 4 supervisors, 3 quality inspectors, 2 maintenance staff, and 1 admin person. We use verbal communication mostly."
  ]
};

/**
 * Strategy 1: Current Approach (Full prompt with all mappings embedded)
 */
function getCurrentPrompt(context: 'operations' | 'workflows' | 'teams'): string {
  const promptConfig = getPromptForContext(context);
  return promptConfig.systemPrompt;
}

/**
 * Strategy 2: Optimized Approach (Only relevant mappings per context)
 */
function getOptimizedPrompt(context: 'operations' | 'workflows' | 'teams'): string {
  const baseInstruction = `You are an expert at extracting structured information from natural language.
Extract ONLY relevant entities. Return valid JSON only.

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
}`;

  if (context === 'operations') {
    return `${baseInstruction}

EXTRACT THESE ENTITY TYPES:

OPERATIONS MODEL:
- "ops_model": "MTO" | "MTS" | "hybrid"
  Common phrases: ${Object.keys(NL_TO_OPS_MODEL).slice(0, 10).join(', ')}

PRODUCTION STAGES:
- "stages_list": string[] - Extract stage names
  Common stages: ${Object.values(WORKFLOW_STAGES).slice(0, 8).join(', ')}

PLANNING METHOD:
- "planning_method": "ManualBoard" | "Spreadsheet" | "ERP" | "Verbal" | "Other"
  Look for: whiteboard, excel, erp, verbal

RULES:
- confidence: 3=explicit, 2=implied, 1=inferred
- Use canonical enum values where specified`;
  }

  if (context === 'workflows') {
    return `${baseInstruction}

EXTRACT THESE ENTITY TYPES:

WORKFLOW STAGES:
- "workflow_stage": string - Process steps
  Common stages: ${Object.values(WORKFLOW_STAGES).slice(0, 10).join(', ')}
  Stage mappings: ${Object.keys(NL_TO_WORKFLOW_STAGE).slice(0, 15).join(', ')} → Use canonical names

DEPARTMENTS:
- "department": string - Team/department names
  Common departments: ${Object.values(DEPARTMENTS).slice(0, 8).join(', ')}

RULES:
- Extract ALL stages mentioned in chronological order
- Use canonical enum values`;
  }

  return baseInstruction;
}

/**
 * Strategy 3: Minimal Prompt + Post-Processing (Reference library for validation)
 */
function getMinimalPrompt(context: 'operations' | 'workflows' | 'teams'): string {
  return `You are an expert at extracting structured information from natural language.
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
}

/**
 * Run comparison tests
 */
export function runTokenComparisonTests() {
  console.log('🧪 Running Token Usage Comparison Tests\n');
  console.log('═'.repeat(70));

  const results: Array<{
    context: string;
    strategy: string;
    promptLength: number;
    estimatedTokens: number;
    sampleInput: string;
  }> = [];

  // Test each context
  for (const [context, inputs] of Object.entries(TEST_INPUTS)) {
    const sampleInput = inputs[0];
    
    // Strategy 1: Current
    const currentPrompt = getCurrentPrompt(context as any);
    const currentTokens = estimateTokens(currentPrompt);
    
    // Strategy 2: Optimized
    const optimizedPrompt = getOptimizedPrompt(context as any);
    const optimizedTokens = estimateTokens(optimizedPrompt);
    
    // Strategy 3: Minimal
    const minimalPrompt = getMinimalPrompt(context as any);
    const minimalTokens = estimateTokens(minimalPrompt);

    results.push(
      {
        context,
        strategy: 'Current (Full Mappings)',
        promptLength: currentPrompt.length,
        estimatedTokens: currentTokens,
        sampleInput
      },
      {
        context,
        strategy: 'Optimized (Context-Specific)',
        promptLength: optimizedPrompt.length,
        estimatedTokens: optimizedTokens,
        sampleInput
      },
      {
        context,
        strategy: 'Minimal (Post-Process)',
        promptLength: minimalPrompt.length,
        estimatedTokens: minimalTokens,
        sampleInput
      }
    );
  }

  // Group by context and calculate savings
  const contexts = ['operations', 'workflows', 'teams'];
  
  for (const ctx of contexts) {
    const ctxResults = results.filter(r => r.context === ctx);
    const current = ctxResults.find(r => r.strategy.includes('Current'))!;
    const optimized = ctxResults.find(r => r.strategy.includes('Optimized'))!;
    const minimal = ctxResults.find(r => r.strategy.includes('Minimal'))!;

    console.log(`\n📋 Context: ${ctx.toUpperCase()}`);
    console.log('─'.repeat(70));
    
    for (const result of ctxResults) {
      const savings = current.estimatedTokens - result.estimatedTokens;
      const savingsPct = ((savings / current.estimatedTokens) * 100).toFixed(1);
      const relative = (result.estimatedTokens / current.estimatedTokens * 100).toFixed(1);
      
      console.log(`\n${result.strategy}:`);
      console.log(`  Prompt: ${result.promptLength.toLocaleString()} chars`);
      console.log(`  Tokens: ~${result.estimatedTokens.toLocaleString()}`);
      if (result !== current) {
        console.log(`  Savings: ${Math.abs(savings).toLocaleString()} tokens (${savingsPct}% reduction)`);
        console.log(`  Relative: ${relative}% of baseline`);
      }
    }

    // Calculate cost savings (assuming $0.10 per 1M tokens for 3B model)
    const costPer1M = 0.10;
    const optimizedSavings = ((current.estimatedTokens - optimized.estimatedTokens) / 1_000_000) * costPer1M;
    const minimalSavings = ((current.estimatedTokens - minimal.estimatedTokens) / 1_000_000) * costPer1M;
    
    console.log(`\n💰 Cost Savings (per 1M requests):`);
    console.log(`  Optimized: $${optimizedSavings.toFixed(4)}`);
    console.log(`  Minimal: $${minimalSavings.toFixed(4)}`);
  }

  // Summary
  console.log(`\n\n📊 SUMMARY`);
  console.log('═'.repeat(70));
  
  const totalCurrent = results
    .filter(r => r.strategy.includes('Current'))
    .reduce((sum, r) => sum + r.estimatedTokens, 0);
  const totalOptimized = results
    .filter(r => r.strategy.includes('Optimized'))
    .reduce((sum, r) => sum + r.estimatedTokens, 0);
  const totalMinimal = results
    .filter(r => r.strategy.includes('Minimal'))
    .reduce((sum, r) => sum + r.estimatedTokens, 0);

  console.log(`\nTotal tokens across all contexts:`);
  console.log(`  Current: ${totalCurrent.toLocaleString()}`);
  console.log(`  Optimized: ${totalOptimized.toLocaleString()} (${((1 - totalOptimized/totalCurrent) * 100).toFixed(1)}% reduction)`);
  console.log(`  Minimal: ${totalMinimal.toLocaleString()} (${((1 - totalMinimal/totalCurrent) * 100).toFixed(1)}% reduction)`);

  const totalSavingsOptimized = ((totalCurrent - totalOptimized) / 1_000_000) * 0.10;
  const totalSavingsMinimal = ((totalCurrent - totalMinimal) / 1_000_000) * 0.10;
  
  console.log(`\n💰 Estimated cost savings per 1M requests:`);
  console.log(`  Optimized: $${totalSavingsOptimized.toFixed(2)}`);
  console.log(`  Minimal: $${totalSavingsMinimal.toFixed(2)}`);

  return results;
}

// Run if executed directly
if (require.main === module) {
  runTokenComparisonTests();
}

