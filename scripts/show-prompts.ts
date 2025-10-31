#!/usr/bin/env tsx
/**
 * Show actual prompts for different strategies
 */

import { buildOptimizedPrompt } from '../lib/llm/prompt-optimizer';

console.log('═'.repeat(70));
console.log('OPERATIONS MINIMAL PROMPT');
console.log('═'.repeat(70));
console.log(buildOptimizedPrompt({context:'operations',strategy:'minimal'}));
console.log(`\nTokens: ~${Math.ceil(buildOptimizedPrompt({context:'operations',strategy:'minimal'}).length / 4)}`);

console.log('\n\n' + '═'.repeat(70));
console.log('OPERATIONS OPTIMIZED PROMPT');
console.log('═'.repeat(70));
console.log(buildOptimizedPrompt({context:'operations',strategy:'optimized'}));
console.log(`\nTokens: ~${Math.ceil(buildOptimizedPrompt({context:'operations',strategy:'optimized'}).length / 4)}`);

console.log('\n\n' + '═'.repeat(70));
console.log('OPERATIONS BALANCED PROMPT');
console.log('═'.repeat(70));
console.log(buildOptimizedPrompt({context:'operations',strategy:'balanced'}));
console.log(`\nTokens: ~${Math.ceil(buildOptimizedPrompt({context:'operations',strategy:'balanced'}).length / 4)}`);

console.log('\n\n' + '═'.repeat(70));
console.log('WORKFLOWS MINIMAL PROMPT');
console.log('═'.repeat(70));
console.log(buildOptimizedPrompt({context:'workflows',strategy:'minimal'}));
console.log(`\nTokens: ~${Math.ceil(buildOptimizedPrompt({context:'workflows',strategy:'minimal'}).length / 4)}`);

console.log('\n\n' + '═'.repeat(70));
console.log('WORKFLOWS OPTIMIZED PROMPT');
console.log('═'.repeat(70));
console.log(buildOptimizedPrompt({context:'workflows',strategy:'optimized'}));
console.log(`\nTokens: ~${Math.ceil(buildOptimizedPrompt({context:'workflows',strategy:'optimized'}).length / 4)}`);

