# Next Steps: Further Token Optimization

**Based on test results, here's our roadmap for additional improvements.**

---

## Current Baseline

- **Total Tokens:** 3,051 (current) → 1,584 (minimal)
- **Reduction:** 48.1%
- **Cost:** $732.24 → $380.16 per 1M requests
- **Savings:** $352.08 per 1M requests

---

## Optimization Opportunities

### 1. **Output Token Reduction** 🔴 HIGH IMPACT

**Problem:** Output tokens cost 4x more ($0.60/1M vs $0.15/1M input)

**Current Output Tokens:**
- Operations: 171 tokens
- Workflows: 481 tokens ⚠️ (highest)
- Teams: 277 tokens

**Solution:** Constrain JSON output structure

```typescript
const prompt = `
Extract operations model. Return ONLY this structure:
{"ops_model": "MTO|MTS|hybrid", "confidence": 1|2|3}

No explanations. No extra fields. No reasoning.
`;
```

**Expected Savings:**
- Reduce output tokens by 30-50%
- Operations: 171 → ~100 tokens (save $0.000043)
- Workflows: 481 → ~250 tokens (save $0.000139) ⭐
- Teams: 277 → ~150 tokens (save $0.000076)

**Potential Total Savings:** ~200 tokens per request = $0.00048 per request = $480 per 1M requests

---

### 2. **Few-Shot Learning with Examples** 🟡 MEDIUM IMPACT

**Problem:** LLM sometimes misses nuanced mappings

**Solution:** Include 2-3 examples in prompt (few-shot learning)

```typescript
const prompt = `
Extract operations model.

Examples:
1. "We make custom orders" → {"ops_model": "MTO"}
2. "We stock inventory" → {"ops_model": "MTS"}
3. "Mix of both" → {"ops_model": "hybrid"}

Extract from: "{userInput}"
`;
```

**Trade-off:**
- +50-100 input tokens (examples)
- -20-30 output tokens (better understanding)
- Net: +20-70 tokens but better accuracy

**Expected:** 5-10% accuracy improvement, slight token increase

---

### 3. **Context-Aware Prompt Selection** 🟢 HIGH IMPACT

**Problem:** One-size-fits-all approach doesn't optimize per context

**Solution:** Use best strategy per context

```typescript
const STRATEGY = {
  operations: 'minimal',    // 78.3% reduction
  workflows: 'optimized',   // 15.1% reduction
  teams: 'optimized',       // 8.4% reduction (minimal hurts)
};
```

**Expected Savings:** Already implemented, but can refine further

---

### 4. **Granular Reference System** 🟡 MEDIUM IMPACT

**Problem:** Large reference library, no context-specific examples

**Solution:** Build context-specific examples and patterns

```typescript
lib/llm/references/contexts/operations/
├── examples.ts    # Real-world examples
├── patterns.ts    # Pattern recognition
└── prompt-builder.ts  # Context-optimized prompts
```

**Expected:**
- Better accuracy (examples help LLM)
- Slightly more tokens (+50-100) but better results
- Foundation for future fine-tuning

---

### 5. **Two-Stage Extraction (RAG)** 🔴 HIGH IMPACT

**Problem:** Minimal prompts lack context, optimized prompts cost more

**Solution:** Extract with minimal, refine with reference library context

```typescript
// Stage 1: Minimal extraction (fast, cheap)
const extracted = await llm.extract(userInput, minimalPrompt);
// ~200 tokens

// Stage 2: Retrieve relevant mappings
const relevantMappings = findRelevantMappings(extracted, referenceLibrary);
// 0 tokens (local)

// Stage 3: Refine with context (only if needed)
if (needsRefinement(extracted)) {
  const refined = await llm.refine(extracted, relevantMappings);
  // ~100 tokens (only when needed)
}
```

**Expected:**
- Most requests: ~200 tokens (minimal only)
- Complex requests: ~300 tokens (minimal + refine)
- Average: ~250 tokens vs current 3,051
- **Potential:** 92% reduction!

---

### 6. **Prompt Caching** 🟢 VERY HIGH IMPACT

**Problem:** System prompts repeated every request

**Solution:** Leverage Together.ai prompt caching

**Expected:**
- First request: Full prompt (~200 tokens)
- Subsequent requests: Cache ID (~1 token)
- **Savings:** 95%+ for system prompt tokens

**Impact:** Could reduce total tokens to ~100-150 per request after cache warmup

---

## Prioritized Action Plan

### Week 1: Quick Wins
1. ✅ **Output Token Constraint** - Constrain JSON structure
   - Expected: ~200 token reduction, $480/1M savings
   - Effort: Low (prompt modification)
   - Risk: Low

2. ✅ **Context-Aware Selection** - Use best strategy per context
   - Expected: Already optimized, but document
   - Effort: Low (already working)
   - Risk: None

### Week 2: Foundation
3. ✅ **Granular Reference System** - Build context-specific examples
   - Expected: Better accuracy, foundation for future
   - Effort: Medium (structure + examples)
   - Risk: Low

4. ✅ **Few-Shot Learning** - Test with 1, 2, 3 examples
   - Expected: 5-10% accuracy improvement
   - Effort: Medium (example collection + testing)
   - Risk: Low

### Week 3: Advanced
5. ✅ **Two-Stage RAG** - Minimal + refinement approach
   - Expected: 92% token reduction potential
   - Effort: High (new architecture)
   - Risk: Medium (complexity)

6. ✅ **Prompt Caching** - Enable Together.ai caching
   - Expected: 95%+ reduction for system prompts
   - Effort: Medium (client modification)
   - Risk: Low

---

## Target Metrics

### Token Usage Targets

| Context | Current | Target | Method |
|---------|---------|--------|--------|
| Operations | 1,634 | <250 | Minimal + output constraint |
| Workflows | 803 | <400 | Optimized + output constraint |
| Teams | 598 | <300 | Optimized + output constraint |
| **Overall** | **3,051** | **<950** | **All optimizations** |

### Cost Targets

- **Current:** $732.24 per 1M requests
- **Target:** <$228 per 1M requests (69% reduction)
- **With Caching:** <$50 per 1M requests (93% reduction)

### Accuracy Targets

- **Current:** ~85% extraction accuracy
- **Target:** >95% extraction accuracy
- **Method:** Examples + patterns + reference library

---

## Testing Plan

1. **Baseline:** Current system (saved in test results)
2. **Output Constraint:** Test constrained JSON output
3. **Examples:** Test with 1, 2, 3 examples
4. **Granular:** Test context-specific examples
5. **RAG:** Test two-stage extraction
6. **Caching:** Test prompt caching

**Compare:** Token usage, accuracy, cost, response time

---

## Success Criteria

✅ **Token Reduction:** <1,000 tokens total (67% reduction)  
✅ **Cost Reduction:** <$240 per 1M requests (67% reduction)  
✅ **Accuracy:** >95% extraction accuracy  
✅ **Speed:** <3 seconds per request  

---

## Next Immediate Steps

1. **Implement output token constraint** (quick win)
2. **Build granular reference system** (foundation)
3. **Test few-shot learning** (accuracy improvement)
4. **Enable prompt caching** (massive savings)

**Let's start with output token constraint - it's the quickest win with highest impact!**

