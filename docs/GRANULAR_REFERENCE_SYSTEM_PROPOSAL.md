# Granular Reference System Architecture

**Goal:** Build a more robust, context-specific reference system with examples, patterns, and subpages to further optimize token usage and accuracy.

---

## Current Architecture

```
lib/llm/references/
├── enums.ts              # All enums (150+)
├── mappings.ts           # All mappings (2000+)
├── component-mappings.ts # Component mappings
└── index.ts             # Main exports
```

**Limitation:** One-size-fits-all approach, no context-specific examples or patterns.

---

## Proposed Granular Architecture

```
lib/llm/references/
├── core/
│   ├── enums.ts              # Core enum definitions
│   ├── base-mappings.ts      # Base mappings (shared)
│   └── utils.ts              # Helper functions
│
├── contexts/
│   ├── operations/
│   │   ├── enums.ts          # Operations-specific enums
│   │   ├── mappings.ts       # Operations NL → enum mappings
│   │   ├── examples.ts       # Real-world extraction examples
│   │   ├── patterns.ts       # Common patterns and edge cases
│   │   ├── prompt-builder.ts # Context-specific prompt builder
│   │   └── index.ts
│   │
│   ├── workflows/
│   │   ├── enums.ts
│   │   ├── mappings.ts
│   │   ├── examples.ts
│   │   ├── patterns.ts
│   │   ├── prompt-builder.ts
│   │   └── index.ts
│   │
│   ├── teams/
│   │   └── ...
│   │
│   └── company/
│       └── ...
│
├── components/
│   ├── mappings.ts
│   ├── examples.ts
│   └── patterns.ts
│
└── index.ts              # Main exports
```

---

## Benefits of Granular System

### 1. **Context-Specific Examples**

Instead of generic mappings, provide real examples per context:

```typescript
// contexts/operations/examples.ts
export const OPERATIONS_EXAMPLES = {
  ops_model: [
    {
      input: "We make custom orders based on customer requests",
      output: { ops_model: "MTO", confidence: 3 },
      keywords: ["custom", "customer requests", "made to order"]
    },
    {
      input: "We produce stock items for our warehouse",
      output: { ops_model: "MTS", confidence: 3 },
      keywords: ["stock", "warehouse", "inventory"]
    }
  ],
  planning_method: [
    {
      input: "We use a whiteboard to plan our production",
      output: { planning_method: "ManualBoard", confidence: 3 },
      keywords: ["whiteboard", "board", "manual"]
    }
  ]
};
```

**Impact:** LLM learns from examples, reduces extraction errors.

### 2. **Pattern Recognition**

Capture common patterns and edge cases:

```typescript
// contexts/operations/patterns.ts
export const OPERATIONS_PATTERNS = {
  capacity_phrases: [
    "produce {number} units per month",
    "capacity of {number} pieces",
    "make {number} items monthly"
  ],
  shift_patterns: [
    "run {number} shifts",
    "{number} shifts per day",
    "operate {number} shifts"
  ]
};
```

**Impact:** Better extraction of structured data (numbers, units, timeframes).

### 3. **Context-Specific Prompt Builders**

Build optimal prompts per context using examples and patterns:

```typescript
// contexts/operations/prompt-builder.ts
export function buildOperationsPrompt(strategy: 'minimal' | 'optimized' | 'examples') {
  if (strategy === 'examples') {
    return `
Extract operations model from text.

Examples:
${OPERATIONS_EXAMPLES.ops_model.map(e => 
  `Input: "${e.input}" → Output: ${JSON.stringify(e.output)}`
).join('\n')}

Common patterns:
${OPERATIONS_PATTERNS.capacity_phrases.join(', ')}

Extract similar entities from user input.
`;
  }
  // ... other strategies
}
```

**Impact:** Optimal prompt per context, balanced token usage and accuracy.

---

## Additional Optimization Opportunities

### 1. **Few-Shot Learning with Examples**

Include 2-3 examples in prompt (few-shot learning):

```typescript
const prompt = `
Extract operations model.

Examples:
1. "We make custom orders" → MTO
2. "We stock inventory" → MTS
3. "Mix of both" → hybrid

Extract from: "{userInput}"
`;
```

**Expected:** Better accuracy, slightly more tokens but better results.

### 2. **Output Token Constraint**

Constrain JSON structure to reduce output tokens:

```typescript
const prompt = `
Extract operations model. Return ONLY:
{"ops_model": "MTO|MTS|hybrid", "confidence": 1-3}

No explanations, no extra fields.
`;
```

**Expected:** Reduce output tokens by 30-50% (output is 4x more expensive).

### 3. **Prompt Templates with Variables**

Template-based prompts reduce redundancy:

```typescript
const TEMPLATE = `
Extract {entity_type} from text.
Valid values: {valid_values}
Examples: {examples}
`;
```

**Expected:** Consistent prompts, easier to optimize.

### 4. **Reference Library as RAG**

Use reference library as retrieval-augmented generation:

```typescript
// 1. Extract with minimal prompt
const extracted = await llm.extract(userInput, minimalPrompt);

// 2. Retrieve relevant mappings from reference library
const relevantMappings = findRelevantMappings(extracted, NL_TO_OPS_MODEL);

// 3. Refine with context-aware prompt
const refined = await llm.refine(extracted, relevantMappings);
```

**Expected:** Better accuracy, minimal prompt tokens, context-aware refinement.

---

## Implementation Plan

### Phase 1: Granular Structure (Week 1)
- [ ] Create context-specific directories
- [ ] Split enums and mappings by context
- [ ] Extract examples from existing prompts
- [ ] Create pattern recognition files

### Phase 2: Example Collection (Week 2)
- [ ] Collect real-world examples from production
- [ ] Categorize by confidence level
- [ ] Create example sets per context
- [ ] Test example impact on accuracy

### Phase 3: Prompt Builders (Week 3)
- [ ] Build context-specific prompt builders
- [ ] Implement few-shot learning prompts
- [ ] Test different example counts (1, 2, 3 examples)
- [ ] Measure token usage vs accuracy

### Phase 4: Output Optimization (Week 4)
- [ ] Constrain JSON output structures
- [ ] Test output token reduction
- [ ] Measure accuracy impact
- [ ] Implement best approach

### Phase 5: Hybrid RAG System (Week 5)
- [ ] Implement retrieval from reference library
- [ ] Build context-aware refinement prompts
- [ ] Test two-stage extraction (minimal → refine)
- [ ] Measure overall improvement

---

## Expected Improvements

### Token Usage Targets

| Metric | Current | Target | Method |
|--------|---------|--------|--------|
| Operations | 1,634 | <300 | Minimal + output constraint |
| Workflows | 803 | <500 | Optimized + examples |
| Teams | 598 | <400 | Optimized + output constraint |
| **Overall** | **3,051** | **<1,200** | **Hybrid approach** |

### Accuracy Targets

- **Current:** ~85% extraction accuracy
- **Target:** >95% extraction accuracy
- **Method:** Examples + patterns + reference library normalization

### Cost Targets

- **Current:** $732.24 per 1M requests
- **Target:** <$300 per 1M requests (60% reduction)
- **Method:** Token reduction + output optimization

---

## Testing Strategy

1. **Baseline Test:** Current system (saved in test results)
2. **Granular Test:** New granular reference system
3. **Examples Test:** With 1, 2, 3 examples in prompts
4. **Output Test:** With constrained JSON output
5. **Hybrid Test:** Minimal + refinement approach

**Compare:** Token usage, accuracy, cost, response time

---

## Next Steps

1. **Start with examples** - Collect real-world examples, test impact
2. **Output token optimization** - Constrain JSON, measure savings
3. **Context-specific builders** - Build optimal prompts per context
4. **Iterate and measure** - Compare against baseline, optimize further

**Goal:** Reduce below 1,200 tokens total while improving accuracy to >95%.

