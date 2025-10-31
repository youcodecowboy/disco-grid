# Path to 100% Accuracy: Improvement Plan

**Current State:** 75.3% F1 (20B Balanced)  
**Target:** >95% F1 (ideally 100%)  
**Strategy:** Multiple optimization approaches, prioritize accuracy over cost

---

## Current Failure Analysis

### Test 1 (76.2% F1): Missing 1 entity
- ✅ Got: planning_method, stages_list (all 7), production_flow
- ❌ Missing: **ops_model**, **capacity**

### Test 2 (90.9% F1): Perfect extraction!
- ✅ Got: All 10 entities correct
- ⚠️ 2 extras (but all correct entities found)

### Test 3 (58.8% F1): Missing 2 entities
- ✅ Got: stages_list (2), track_materials_internally, storage_system, shifts
- ❌ Missing: **subcontract_use**, **subcontract_stages**, **stage_durations**

### Common Failure Patterns:
1. **ops_model** - Not being extracted consistently
2. **Complex objects** - stage_durations (object with stage names as keys)
3. **Boolean flags** - subcontract_use (needs inference)
4. **Arrays** - subcontract_stages (needs multiple values)

---

## Improvement Strategies (Ordered by Likely Impact)

### Strategy 1: Comprehensive Few-Shot Examples (Highest Impact) 🎯

**Approach:** Add 3-5 complete examples showing perfect extraction for each entity type

**Expected Impact:** +15-20% F1 (90-95% target)

**Implementation:**
- Add examples for each entity type
- Show complex cases (objects, arrays, booleans)
- Include edge cases (missing values, inferred values)

**Token Cost:** +500-800 input tokens per request
**Estimated Cost:** $0.00065-0.00075 per request (vs $0.00046)

**Example Format:**
```json
EXAMPLES:

Example 1: Custom orders with whiteboard planning
Input: "We make custom orders. We use a whiteboard to plan."
Output: {
  "entities": [
    {"type": "ops_model", "value": "MTO", "confidence": 3},
    {"type": "planning_method", "value": "ManualBoard", "confidence": 3}
  ]
}

Example 2: Subcontracting with durations
Input: "We subcontract washing. Cutting takes 30 minutes, sewing takes 1 hour."
Output: {
  "entities": [
    {"type": "subcontract_use", "value": true, "confidence": 3},
    {"type": "subcontract_stages", "value": "Washing", "confidence": 3},
    {"type": "stage_durations", "value": {"Cutting": 0.5, "Sewing": 1.0}, "confidence": 3}
  ]
}
```

---

### Strategy 2: Chain-of-Thought Reasoning (High Impact) 🧠

**Approach:** Ask model to reason through extraction step-by-step

**Expected Impact:** +10-15% F1 (85-90% target)

**Implementation:**
- Add reasoning step before extraction
- Model explains what it's looking for
- Then extracts based on reasoning

**Token Cost:** +300-500 tokens (reasoning + extraction)
**Estimated Cost:** $0.00055-0.00065 per request

**Example:**
```
REASONING STEP:
1. Identify operations model (MTO/MTS/hybrid)
2. Extract all production stages
3. Identify planning method
4. Extract numeric values (capacity, shifts, durations)
5. Extract boolean flags (subcontract_use, track_materials)

Then extract entities...
```

---

### Strategy 3: Multi-Pass Extraction (High Impact) 🔄

**Approach:** Extract in multiple passes - simple entities first, then complex

**Expected Impact:** +10-15% F1 (85-90% target)

**Implementation:**
- Pass 1: Extract simple entities (strings, numbers, booleans)
- Pass 2: Extract complex entities (objects, arrays)
- Pass 3: Validate completeness

**Token Cost:** 3x requests = 3x cost
**Estimated Cost:** $0.00138 per request (3 × $0.00046)

---

### Strategy 4: Validation Pass (Medium Impact) ✅

**Approach:** After extraction, validate completeness and fill gaps

**Expected Impact:** +5-10% F1 (80-85% target)

**Implementation:**
- Extract entities
- Check if all expected types present
- If missing, ask model to re-extract missing types

**Token Cost:** +200-400 tokens
**Estimated Cost:** $0.00055-0.00065 per request

---

### Strategy 5: Enhanced Prompt with Explicit Rules (Medium Impact) 📋

**Approach:** Add very explicit rules for each entity type

**Expected Impact:** +5-10% F1 (80-85% target)

**Implementation:**
- Explicit rules for ops_model extraction
- Explicit rules for boolean inference
- Explicit rules for object/array extraction

**Token Cost:** +200-300 tokens
**Estimated Cost:** $0.00050-0.00055 per request

**Example:**
```
CRITICAL RULES:

1. ops_model: ALWAYS extract one of: "MTO", "MTS", "hybrid"
   - "custom orders" → "MTO"
   - "stock items" → "MTS"
   - "both custom and stock" → "hybrid"
   - If not mentioned, infer from context

2. subcontract_use: ALWAYS extract boolean
   - "subcontract" → true
   - "external partners" → true
   - If not mentioned → false

3. stage_durations: ALWAYS extract as object
   - "X takes Y minutes" → {"X": Y/60}
   - "X takes Y hours" → {"X": Y}
```

---

### Strategy 6: LoRA Fine-Tuning (Long-term, Highest Potential) 🎓

**Approach:** Fine-tune 20B model on domain-specific examples

**Expected Impact:** +20-25% F1 (95-100% target)

**Implementation:**
- Collect 500-1000 high-quality examples
- Fine-tune model on these examples
- Model learns domain-specific patterns

**Setup Cost:** $50-200 (one-time fine-tuning)
**Token Cost:** Same as current (no change)
**Estimated Cost:** $0.00046 per request (same)

**Pros:**
- Highest accuracy potential
- No ongoing token cost increase
- Model learns domain patterns

**Cons:**
- Requires training data collection
- One-time setup cost
- Takes time to implement

---

## Recommended Approach: Hybrid Strategy

### Phase 1: Immediate (This Week)
**Strategy 1: Comprehensive Few-Shot Examples**
- Expected: 90-95% F1
- Cost: $0.00065-0.00075 per request
- Effort: Medium (collect examples, update prompt)

### Phase 2: Short-term (Next Week)
**Strategy 5: Enhanced Prompt with Explicit Rules**
- Expected: 95-98% F1
- Cost: $0.00055-0.00065 per request
- Effort: Low (update prompt rules)

### Phase 3: Long-term (Next Month)
**Strategy 6: LoRA Fine-Tuning**
- Expected: 98-100% F1
- Cost: $0.00046 per request (same as current!)
- Effort: High (collect data, fine-tune)

---

## Cost Analysis: Getting to 100%

### Option A: Few-Shot Examples (Fastest)
- **Accuracy:** 90-95% F1
- **Cost per 1K:** $0.65-0.75
- **Setup Time:** 1-2 days
- **ROI:** High (quick improvement)

### Option B: Few-Shot + Enhanced Rules
- **Accuracy:** 95-98% F1
- **Cost per 1K:** $0.55-0.65
- **Setup Time:** 3-5 days
- **ROI:** Very High (best balance)

### Option C: LoRA Fine-Tuning (Best Long-term)
- **Accuracy:** 98-100% F1
- **Cost per 1K:** $0.46 (same as current!)
- **Setup Time:** 2-4 weeks
- **ROI:** Highest (no ongoing cost increase)

---

## Implementation Priority

1. **✅ Do Now:** Comprehensive Few-Shot Examples
2. **✅ Do Next:** Enhanced Prompt Rules
3. **✅ Do Soon:** LoRA Fine-Tuning

**Target:** 95%+ F1 within 2 weeks, 100% F1 within 1 month

