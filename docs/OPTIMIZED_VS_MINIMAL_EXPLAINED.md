# Optimized vs Minimal: When to Use Each Approach

## The Difference

### **Optimized Approach**
**What it is:** Prompt includes essential mappings and guidance, but more concise than current.

**Example:**
```
Extract operations model from text.

Valid values: MTO, MTS, hybrid
Common phrases: made to order, custom order, stock, warehouse
Look for these keywords when extracting.

Rules:
- confidence: 3=explicit, 2=implied, 1=inferred
- Use canonical enum values
```

**Token Count:** ~200-300 tokens
**Output Tokens:** ~180-310 (moderate, guided)

### **Minimal Approach**
**What it is:** Ultra-concise prompt with no mappings, relies on reference library for post-processing.

**Example:**
```
Extract operations model from text.
Return: { "ops_model": "value", "confidence": 1-3 }
```

**Token Count:** ~120-200 tokens
**Output Tokens:** ~157-431 (varies, can be verbose without guidance)

---

## User Behavior Differences

### **Optimized Approach - User Experience**

**What users see:**
- ✅ Consistent extraction quality
- ✅ Accurate enum mapping (LLM + post-processing)
- ✅ Moderate response time
- ✅ Lower cost than current

**How it works:**
1. User types: "We make custom orders"
2. LLM extracts: "custom orders" → ops_model: "custom orders"
3. Reference library normalizes: "custom orders" → "MTO"
4. Result: Accurate enum value

**Best for:**
- Production use (reliable, consistent)
- Contexts where output token control matters
- When you want LLM to understand mappings

### **Minimal Approach - User Experience**

**What users see:**
- ⚠️ Can be less consistent (depends on context)
- ✅ Still accurate (reference library ensures correctness)
- ✅ Faster (fewer input tokens)
- ✅ Lower cost (if output tokens don't explode)

**How it works:**
1. User types: "We make custom orders"
2. LLM extracts: "custom orders" → ops_model: "custom orders" (might be verbose)
3. Reference library normalizes: "custom orders" → "MTO"
4. Result: Accurate enum value (but may have wasted output tokens)

**Best for:**
- Operations context (huge savings: 78.3%)
- When input token reduction is critical
- Testing/experimentation

---

## When to Use Each

### Use **Optimized** When:
- ✅ You need consistent output token counts
- ✅ Context benefits from guidance (teams, workflows)
- ✅ Production reliability is critical
- ✅ You want LLM to understand canonical values

### Use **Minimal** When:
- ✅ Operations context (massive savings)
- ✅ Input token reduction is priority
- ✅ You're okay with post-processing doing heavy lifting
- ✅ Testing/experimentation phase

---

## Hybrid Strategy (Recommended)

**Context-Aware Prompt Selection:**

```typescript
const PROMPT_STRATEGY = {
  operations: 'minimal',    // 78.3% reduction
  workflows: 'optimized',   // 15.1% reduction (minimal only 25.2%)
  teams: 'optimized',       // 8.4% reduction (minimal increases tokens!)
  // ... other contexts
};
```

**Why this works:**
- Maximize savings where minimal excels (operations)
- Use optimized where minimal hurts (teams)
- Balance cost and reliability

---

## Real-World Impact

### Current User Flow (All Contexts):
1. User types natural language → LLM extracts → System processes
2. **Cost:** $0.000732 per request
3. **Time:** ~4-5 seconds

### Optimized User Flow:
1. User types natural language → LLM extracts (guided) → Reference library normalizes → System processes
2. **Cost:** $0.000414 per request (43.5% cheaper)
3. **Time:** ~3-4 seconds (faster prompt processing)

### Minimal User Flow (Operations):
1. User types natural language → LLM extracts (minimal guidance) → Reference library normalizes → System processes
2. **Cost:** $0.000035 per request (78.3% cheaper for operations)
3. **Time:** ~2-3 seconds (much faster)

**User sees:** Same experience, lower cost, potentially faster

---

## Next Level: Granular Reference System

Instead of one large reference library, we could build:

```
lib/llm/references/
├── operations/
│   ├── enums.ts           # Operations-specific enums
│   ├── mappings.ts        # NL → enum mappings for operations
│   ├── examples.ts        # Real-world examples
│   └── patterns.ts        # Common patterns and edge cases
├── workflows/
│   ├── enums.ts
│   ├── mappings.ts
│   ├── examples.ts
│   └── patterns.ts
└── teams/
    └── ...
```

**Benefits:**
- More context-specific examples in prompts
- Better accuracy per context
- Ability to optimize each context independently
- Reference library stays modular

---

## Summary

**Optimized = Reliable, guided, production-ready**  
**Minimal = Experimental, maximum savings, context-dependent**

**Best approach:** Hybrid - use minimal for operations, optimized for others.

