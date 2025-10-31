# Server-Side Optimization Explained

**Question:** Where do reference libraries come in? Can we optimize inputs before sending?

---

## Two-Stage Architecture

### Stage 1: LLM Extraction (What We're Testing)
**Input:** User's natural language text  
**Process:** LLM extracts entities  
**Output:** Raw extracted entities (may have variations)

### Stage 2: Server-Side Normalization (Reference Library)
**Input:** Raw extracted entities from LLM  
**Process:** Reference library normalizes values  
**Output:** Clean, canonical entities

---

## How Reference Library Works (Server-Side)

### Example Flow:

**1. User Input:**
```
"We make custom orders. We use a whiteboard to plan."
```

**2. LLM Extracts:**
```json
{
  "entities": [
    {"type": "ops_model", "value": "custom orders", "confidence": 3},
    {"type": "planning_method", "value": "whiteboard", "confidence": 3}
  ]
}
```

**3. Server-Side Normalization (Reference Library):**
```typescript
// lib/llm/references/mappings.ts
const NL_TO_OPS_MODEL = {
  "custom orders": "MTO",
  "made to order": "MTO",
  "customer requests": "MTO",
  // ... more mappings
};

const NL_TO_PLANNING_METHOD = {
  "whiteboard": "ManualBoard",
  "board": "ManualBoard",
  "manual": "ManualBoard",
  // ... more mappings
};

// Normalize function (runs server-side, NOT sent to LLM)
function normalizeEntities(entities) {
  return entities.map(entity => {
    if (entity.type === 'ops_model') {
      const normalized = NL_TO_OPS_MODEL[entity.value.toLowerCase()] || entity.value;
      return { ...entity, value: normalized };
    }
    if (entity.type === 'planning_method') {
      const normalized = NL_TO_PLANNING_METHOD[entity.value.toLowerCase()] || entity.value;
      return { ...entity, value: normalized };
    }
    return entity;
  });
}
```

**4. Final Output:**
```json
{
  "entities": [
    {"type": "ops_model", "value": "MTO", "confidence": 3},
    {"type": "planning_method", "value": "ManualBoard", "confidence": 3}
  ]
}
```

---

## Why Reference Library is Server-Side

### ✅ **Benefits:**
1. **No token cost** - Reference library NOT sent to LLM
2. **Flexible** - Can update mappings without changing prompts
3. **Comprehensive** - Can have thousands of mappings
4. **Fast** - Simple lookup, no API calls

### ❌ **If we sent it to LLM:**
- Would add 5,000+ tokens to every request
- Cost: $0.25+ per request just for mappings!
- Not needed - LLM just needs to extract, we normalize server-side

---

## Input Pre-Processing: Is It Worth It?

### What We Could Do:

**Pre-processing (before sending to LLM):**
```typescript
function preprocessInput(userInput: string): string {
  // Remove filler words
  let cleaned = userInput
    .replace(/\b(um|uh|like|you know)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Expand abbreviations
  cleaned = cleaned.replace(/\bERP\b/gi, 'Enterprise Resource Planning');
  
  // Normalize spacing
  cleaned = cleaned.replace(/\s*,\s*/g, ', ');
  
  return cleaned;
}
```

### Analysis:

**User Input Size:** Typically 50-200 tokens

**Potential Savings:**
- Remove filler words: ~5-10 tokens saved
- Cost savings: $0.0000003 per request (negligible)

**Risks:**
- Might remove important context
- Could change meaning
- User inputs are already relatively clean

**Verdict:** ❌ **Not Worth It**
- User inputs are small (50-200 tokens)
- Savings: <$0.000001 per request
- Risk: Could break extraction
- Better to let LLM handle natural language

---

## Where Optimization Actually Happens

### 1. **Prompt Optimization** (What We're Testing) ✅
- **Impact:** High (75% → 77% F1)
- **Cost:** +22% tokens
- **ROI:** Good

### 2. **Server-Side Normalization** (Reference Library) ✅
- **Impact:** Ensures consistency
- **Cost:** $0 (runs server-side)
- **ROI:** Excellent

### 3. **Input Pre-Processing** ❌
- **Impact:** Negligible (<1% token savings)
- **Cost:** Development time
- **ROI:** Poor (not worth the risk)

### 4. **Output Post-Processing** ✅ (Next Step)
- **Impact:** Filter extras, validate values
- **Cost:** $0 (runs server-side)
- **ROI:** Excellent

---

## Current Architecture

```
User Input (50-200 tokens)
    ↓
[Pre-processing] ❌ Skip - not worth it
    ↓
LLM Prompt (950-2,380 tokens)
    ↓
LLM Extraction (2,000-4,000 tokens)
    ↓
[Server-Side Normalization] ✅ Reference Library
    ↓
[Server-Side Filtering] ✅ TODO - filter extras
    ↓
Final Output
```

---

## Next Optimization: Output Post-Processing

**Current Issue:** Enhanced strategy has 100% recall but lower precision (extras)

**Solution:** Server-side filtering

```typescript
function filterExtras(entities: Entity[], expectedTypes: string[]): Entity[] {
  return entities.filter(entity => {
    // Filter by confidence
    if (entity.confidence < 2) return false;
    
    // Filter by expected types
    if (!expectedTypes.includes(entity.type)) return false;
    
    // Validate values against reference library
    if (!isValidValue(entity.type, entity.value)) return false;
    
    return true;
  });
}
```

**Expected Impact:**
- Reduce extras by 50-70%
- Improve precision to 85-90%
- Keep 100% recall
- **Cost:** $0 (server-side)

---

## Summary

**Reference Library:**
- ✅ Runs server-side (no token cost)
- ✅ Normalizes extracted values
- ✅ Ensures consistency
- ✅ Can be updated without changing prompts

**Input Pre-Processing:**
- ❌ Not worth it (user inputs are small)
- ❌ Risk > reward
- ❌ Savings negligible

**Output Post-Processing:**
- ✅ Next optimization target
- ✅ Filter extras server-side
- ✅ Improve precision without token cost

**Current Focus:**
- ✅ Prompt optimization (enhanced strategy)
- ✅ Server-side normalization (reference library)
- 🔜 Output filtering (reduce extras)

