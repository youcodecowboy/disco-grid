# LLM Token Optimization Strategy

**Purpose:** Minimize token usage while maximizing accuracy and leveraging prompt caching where available.

---

## Understanding Token Usage

### Current State
- **Onboarding prompts:** ~2,000-3,000 tokens per context (988 lines in prompts.ts)
- **Embedded mappings:** Mappings are scattered throughout prompts
- **Cost:** ~$0.10 per 1M tokens (3B model), ~$0.80 per 1M tokens (120B model)

### Key Insight
**The mappings are already being sent** - they're embedded in the prompt text. The question is: can we be smarter about how we use them?

---

## Three Strategies Compared

### Strategy 1: Current Approach ❌
**Full mappings embedded in prompt**

```typescript
// Current: All mappings embedded in prompt
const prompt = `Extract operations model.
Mapping: "made to order" → MTO, "custom order" → MTO, "bespoke" → MTO, 
"make to stock" → MTS, "stock" → MTS, "warehouse" → MTS, ...
[100+ more mappings]`;
```

**Token Usage:** ~2,500-3,000 tokens per prompt
**Pros:** Everything in one place
**Cons:** Massive token usage, hard to maintain

---

### Strategy 2: Optimized Approach ✅ (Recommended)
**Only relevant mappings per context**

```typescript
// Optimized: Only include mappings relevant to this context
const prompt = `Extract operations model.
Valid values: MTO, MTS, hybrid
Common phrases: made to order, custom order, stock, warehouse
[Only 10-15 most common mappings]`;
```

**Token Usage:** ~800-1,200 tokens per prompt (60-70% reduction)
**Pros:** Significant token savings, still accurate
**Cons:** Need to maintain which mappings are "most common"

---

### Strategy 3: Minimal + Post-Processing ✅✅ (Best for accuracy)
**Minimal prompt + reference library for validation**

```typescript
// Minimal prompt
const prompt = `Extract operations model from text.
Return: { "ops_model": "value", "confidence": 1-3 }`;

// Post-process with reference library
const extracted = await llm.extract(userInput, prompt);
const normalized = mapNaturalLanguageToEnum(extracted.ops_model, NL_TO_OPS_MODEL);
```

**Token Usage:** ~300-500 tokens per prompt (80-85% reduction)
**Pros:** Massive token savings, library ensures accuracy
**Cons:** Requires post-processing step

---

## Prompt Caching (Together.ai)

### What is Prompt Caching?
Together.ai supports **prompt caching** where:
- System prompts can be cached
- Only the cache ID is sent after first request
- **Massive token savings** for repeated prompts

### How It Works

```typescript
// First request: Full prompt sent, cache ID returned
const response1 = await together.chat.completions.create({
  model: 'meta-llama/Llama-3.2-3B-Instruct-Turbo',
  messages: [
    { role: 'system', content: longPrompt }, // ~2000 tokens
    { role: 'user', content: userInput }
  ]
});
// Cache ID returned in response

// Subsequent requests: Only cache ID sent
const response2 = await together.chat.completions.create({
  model: 'meta-llama/Llama-3.2-3B-Instruct-Turbo',
  messages: [
    { role: 'system', content: 'cache://abc123' }, // ~1 token!
    { role: 'user', content: userInput2 }
  ]
});
```

### Token Savings with Caching
- **Without caching:** 2,000 tokens (prompt) + 100 tokens (user) = 2,100 tokens
- **With caching:** 1 token (cache ID) + 100 tokens (user) = 101 tokens
- **Savings:** ~95% reduction for system prompt tokens!

### Limitations
- Caching works best when system prompt is **identical** across requests
- Different contexts (operations vs workflows) = different prompts = separate caches
- User input still counts toward tokens

---

## Recommended Architecture

### Hybrid Approach: Minimal Prompts + Reference Library + Caching

```typescript
// 1. Minimal, cacheable prompts per context
const OPERATIONS_PROMPT = `Extract operations-related entities.
Valid ops_model: MTO, MTS, hybrid
Return JSON with type, value, confidence, rawText.`;

// 2. Post-process with reference library
import { mapNaturalLanguageToEnum, NL_TO_OPS_MODEL } from '@/lib/llm/references';

const extracted = await llm.extract(userInput, OPERATIONS_PROMPT);
const normalized = {
  ...extracted,
  ops_model: mapNaturalLanguageToEnum(extracted.ops_model, NL_TO_OPS_MODEL) || extracted.ops_model
};

// 3. Enable caching
const response = await together.chat.completions.create({
  model: 'meta-llama/Llama-3.2-3B-Instruct-Turbo',
  messages: [
    { role: 'system', content: OPERATIONS_PROMPT }, // Cacheable!
    { role: 'user', content: userInput }
  ],
  // Together.ai automatically caches if prompt is identical
});
```

### Benefits
1. **Minimal tokens:** ~300-500 tokens per prompt (vs 2,500-3,000)
2. **Cacheable:** System prompt cached, only ~1 token after first request
3. **Accurate:** Reference library ensures correct enum values
4. **Maintainable:** Mappings in code, not prompts

---

## Implementation Plan

### Phase 1: Measure Current Usage ✅
- [x] Create token measurement tools
- [x] Test current prompts
- [ ] Run actual API calls to get real token counts

### Phase 2: Create Optimized Prompts
- [ ] Extract minimal prompts per context
- [ ] Document which mappings are "most common" per context
- [ ] Create optimized prompt versions

### Phase 3: Implement Post-Processing
- [ ] Update extraction logic to use reference library
- [ ] Add normalization step after LLM extraction
- [ ] Test accuracy improvements

### Phase 4: Enable Caching
- [ ] Verify Together.ai caching support
- [ ] Update client to reuse cached prompts
- [ ] Monitor cache hit rates

### Phase 5: Measure & Optimize
- [ ] Compare token usage before/after
- [ ] Measure accuracy improvements
- [ ] Calculate cost savings

---

## Expected Results

### Token Usage Reduction
- **Current:** ~2,500 tokens per request
- **Optimized:** ~800 tokens per request (68% reduction)
- **With caching:** ~100 tokens per request after first (96% reduction for system prompt)

### Cost Savings
- **Per 1M requests:**
  - Current: ~$250 (2,500 tokens × $0.10/1M)
  - Optimized: ~$80 (800 tokens × $0.10/1M)
  - With caching: ~$10 (100 tokens × $0.10/1M) after cache warmup
- **Annual savings (assuming 10M requests/year):**
  - $1,700 (optimized) to $2,400 (with caching)

### Accuracy
- **Current:** Struggling (as reported)
- **Optimized:** Same or better (focused prompts)
- **With library:** Better (post-processing ensures canonical values)

---

## Testing

Run the test script to see actual comparisons:

```bash
# Measure ACTUAL token usage with real API calls
npx tsx scripts/test-token-usage.ts
```

This will:
- Make actual API calls to Together.ai
- Measure real token usage for each strategy
- Calculate actual cost savings
- Provide recommendations

**Note:** This script makes real API calls (~$0.0001 per test). Estimated total cost: ~$0.001 for full test suite.

Alternatively, run the estimation-only version (no API calls):

```bash
# Estimate token usage without API calls
npx tsx lib/llm/token-analysis/test-onboarding-prompts.ts
```

---

## Recommendations

1. **Immediate:** Use Strategy 2 (Optimized) - 60-70% token reduction with minimal changes
2. **Short-term:** Implement Strategy 3 (Minimal + Post-Processing) - 80-85% reduction with better accuracy
3. **Long-term:** Enable prompt caching - 95%+ reduction for system prompt tokens

The reference library we created is perfect for Strategy 3 - it ensures accuracy while keeping prompts minimal and cacheable.

