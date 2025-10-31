# LLM Integration Health Check & Consolidation Plan

**Date:** December 2024  
**Purpose:** Audit current LLM integrations, assess health, and propose consolidation strategy for building a custom SLM library

---

## Executive Summary

We currently have **5 active LLM integrations** across the application:
1. **Dashboard Component Generation** - Creates dashboard layouts with components
2. **Onboarding Entity Extraction** - Extracts structured data from natural language business descriptions
3. **Workflow Generation** - Generates workflow stages from process descriptions
4. **Workflow Refinement** - Refines individual workflow stage fields
5. **Component Selection** - Selects appropriate visualization components from natural language

**Current Health Status:** 🟡 **Moderate** - Functional but fragmented, opportunities for significant improvement

---

## Current State Analysis

### 1. LLM Integration Locations

| Integration | Route | Model | Temperature | Max Tokens | Status |
|------------|-------|-------|-------------|------------|--------|
| Dashboard Generation | `/api/dashboard/generate` | `meta-llama/Llama-3.2-3B-Instruct-Turbo` | 0.4 | 2000 | ✅ Active |
| Onboarding Extraction | `/api/nlp/extract` | `meta-llama/Llama-3.2-3B-Instruct-Turbo` | 0.1 | 1000 | ⚠️ Struggling |
| Workflow Generation | `/api/nlp/workflow/generate` | `openai/gpt-oss-120b` | 0.2 | 4000 | ✅ Active |
| Workflow Refinement | `/api/nlp/workflow/refine` | `openai/gpt-oss-120b` | 0.1 | 500 | ✅ Active |
| Component Selection | `/api/playground/generate-component` | `meta-llama/Llama-3.2-3B-Instruct-Turbo` | 0.3 | 800 | ✅ Active |

### 2. Prompt Architecture

**Current Structure:**
- **Dashboard:** Single comprehensive prompt (254 lines) in `app/api/dashboard/prompts/dashboardGeneration.ts`
- **Onboarding:** 9 context-specific prompts (988 lines total) in `app/api/nlp/extract/prompts.ts`
- **Workflow Generation:** Single prompt embedded in prompts.ts (`workflow_creation` context)
- **Workflow Refinement:** 5 field-specific prompts (149 lines) in `app/api/nlp/workflow/refinement-prompts.ts`
- **Component Selection:** Single prompt (221 lines) in `app/api/playground/prompts/componentSelection.ts`

**Total Prompt Tokens:** ~15,000+ tokens across all prompts

### 3. Model Selection Strategy

**Issues Identified:**
- ❌ **Inconsistent model choices:** Using 3B model for some tasks, 120B for others
- ❌ **No clear model selection criteria:** Workflow uses 120B, onboarding uses 3B
- ❌ **Cost optimization unclear:** 120B model costs ~100x more than 3B model
- ❌ **Performance trade-offs:** Larger model slower but potentially more accurate

**Current Models:**
- `meta-llama/Llama-3.2-3B-Instruct-Turbo` - Fast, cheap, good for structured extraction
- `openai/gpt-oss-120b` - Slower, expensive, better for complex reasoning

### 4. Prompt Quality Assessment

#### ✅ **Strengths:**
- Context-specific prompts reduce token usage (60-80% reduction)
- JSON mode enforced for structured output
- Keyword fallback strategies exist
- Some prompts include examples and clear formatting rules

#### ⚠️ **Weaknesses:**
- **Massive prompts:** Onboarding prompts are 988 lines, very verbose
- **No reference documentation:** Natural language → enum mappings scattered in prompts
- **Inconsistent structure:** Each prompt uses different formats
- **Hard to maintain:** Changes require editing massive prompt files
- **No versioning:** Can't track prompt evolution
- **Limited testing:** No systematic prompt testing framework

### 5. Natural Language → Structured Input Mapping

**Current State:**
- Mappings exist but are **embedded in prompts** (hard to reuse)
- Examples:
  - `"made to order" → ops_model: "MTO"` (in operations prompt)
  - `"cutting", "sewing" → workflow_stage: ["Cutting", "Sewing"]` (in workflows prompt)
  - `"breakdown", "percentage" → component: "v3.chart.donut"` (in component prompt)

**Problem:** As you mentioned, onboarding AI is struggling because:
- No centralized enum library
- Common phrases scattered across prompts
- No canonical value reference
- Hard to improve accuracy without editing massive prompt files

---

## Health Assessment by Integration

### 🟢 Dashboard Generation - **HEALTHY**
- **Status:** Working well
- **Strengths:** Clear prompt, good examples, fallback handling
- **Issues:** None critical
- **Recommendation:** Minor optimization opportunities

### 🔴 Onboarding Extraction - **NEEDS ATTENTION**
- **Status:** Struggling (as you mentioned)
- **Strengths:** Context-specific prompts, keyword fallback
- **Issues:**
  - ❌ Massive prompts (988 lines)
  - ❌ No reference documentation for enum mappings
  - ❌ Natural language → structured input mapping not centralized
  - ❌ Hard to debug extraction failures
  - ❌ No systematic way to improve accuracy
- **Recommendation:** **HIGH PRIORITY** - Needs reference library + prompt optimization

### 🟡 Workflow Generation - **MODERATE**
- **Status:** Working but expensive
- **Strengths:** Good extraction rules, clear structure
- **Issues:**
  - ⚠️ Using expensive 120B model (could potentially use smaller)
  - ⚠️ Large prompt embedded in prompts.ts
  - ⚠️ No clear cost/performance analysis
- **Recommendation:** Evaluate if 3B model could work, optimize prompt

### 🟢 Workflow Refinement - **HEALTHY**
- **Status:** Well optimized
- **Strengths:** Field-specific prompts, token tracking, cost optimization
- **Issues:** None critical
- **Recommendation:** Good example to follow for other integrations

### 🟢 Component Selection - **HEALTHY**
- **Status:** Working well
- **Strengths:** Clear selection rules, keyword fallback, confidence scoring
- **Issues:** None critical
- **Recommendation:** Minor optimization opportunities

---

## Critical Issues Identified

### 1. 🔴 **No Centralized LLM Configuration**
- Each route initializes `Together` client separately
- No shared configuration (API keys, defaults, retry logic)
- No centralized error handling
- No unified logging/monitoring

### 2. 🔴 **No Reference Documentation Library**
- **Problem:** Natural language → enum mappings scattered in prompts
- **Impact:** Hard to improve accuracy, maintain consistency
- **Solution Needed:** Centralized enum/reference library for:
  - Operations models: "made to order" → "MTO"
  - Workflow stages: "cutting" → "Cutting"
  - Component types: "trends" → "v3.chart.area"
  - Departments, KPIs, locations, etc.

### 3. 🟡 **Inconsistent Model Selection**
- 3B model for onboarding (struggling)
- 120B model for workflows (potentially overkill)
- No clear criteria for model selection
- Cost implications unclear

### 4. 🟡 **Prompt Maintenance Burden**
- Massive prompt files (988 lines)
- Changes require editing entire prompt files
- No versioning or A/B testing
- Hard to optimize incrementally

### 5. 🟡 **No Shared Utilities**
- Keyword extraction exists but duplicated
- No shared prompt building utilities
- No shared response validation
- No shared error handling patterns

---

## Proposed Architecture: SLM Library Foundation

### Phase 1: Core Infrastructure (Foundation)

```
lib/llm/
├── config/
│   ├── models.ts              # Model definitions, selection criteria
│   ├── defaults.ts            # Default configs per use case
│   └── provider.ts            # Together.ai client initialization
├── core/
│   ├── client.ts              # Unified LLM client wrapper
│   ├── prompt-builder.ts      # Prompt construction utilities
│   ├── response-validator.ts  # Response validation & normalization
│   └── error-handler.ts       # Centralized error handling
├── references/
│   ├── enums.ts               # All enum definitions
│   ├── mappings.ts            # Natural language → enum mappings
│   ├── examples.ts            # Example mappings for training
│   └── validation.ts          # Enum validation schemas
└── integrations/
    ├── dashboard/
    │   ├── prompt.ts          # Dashboard prompt (simplified)
    │   └── handler.ts         # Dashboard-specific logic
    ├── onboarding/
    │   ├── prompt.ts          # Onboarding prompt (optimized)
    │   ├── extractor.ts        # Entity extraction logic
    │   └── validator.ts       # Onboarding-specific validation
    ├── workflow/
    │   ├── generation/
    │   │   ├── prompt.ts      # Workflow generation prompt
    │   │   └── handler.ts
    │   └── refinement/
    │       ├── prompts.ts     # Refinement prompts (already good)
    │       └── handler.ts
    └── component/
        ├── prompt.ts          # Component selection prompt
        └── handler.ts
```

### Phase 2: Reference Library (Critical for Onboarding)

**Create:** `lib/llm/references/`

1. **`enums.ts`** - All canonical enum values
```typescript
export const OPERATIONS_MODELS = {
  MTO: 'MTO',
  MTS: 'MTS',
  HYBRID: 'hybrid',
  OTHER: 'Other'
} as const;

export const WORKFLOW_STAGES = [
  'Cutting', 'Sewing', 'Washing', 'Finishing', 
  'Packing', 'Quality', 'Inspection', ...
] as const;

export const COMPONENT_TYPES = {
  AREA_CHART: 'v3.chart.area',
  BAR_CHART: 'v3.chart.bar',
  DONUT_CHART: 'v3.chart.donut',
  // ... etc
} as const;
```

2. **`mappings.ts`** - Natural language → enum mappings
```typescript
export const NL_TO_OPS_MODEL: Record<string, string> = {
  'made to order': 'MTO',
  'custom order': 'MTO',
  'bespoke': 'MTO',
  'make to stock': 'MTS',
  'inventory': 'MTS',
  'stock': 'MTS',
  // ... comprehensive mapping
};

export const NL_TO_WORKFLOW_STAGE: Record<string, string> = {
  'cut': 'Cutting',
  'cutting': 'Cutting',
  'sew': 'Sewing',
  'sewing': 'Sewing',
  // ... comprehensive mapping
};

export const NL_TO_COMPONENT: Record<string, string> = {
  'trend': 'v3.chart.area',
  'over time': 'v3.chart.area',
  'compare': 'v3.chart.bar',
  'breakdown': 'v3.chart.donut',
  // ... comprehensive mapping
};
```

3. **`examples.ts`** - Training examples for prompts
```typescript
export const OPS_MODEL_EXAMPLES = [
  {
    input: "We make custom orders based on customer requests",
    output: { ops_model: "MTO" },
    confidence: 3
  },
  // ... more examples
];
```

### Phase 3: Unified Client & Prompt Builder

**Create:** `lib/llm/core/client.ts`
- Unified Together.ai client
- Retry logic
- Token tracking
- Cost monitoring
- Error handling

**Create:** `lib/llm/core/prompt-builder.ts`
- Template-based prompt construction
- Reference library integration
- Example injection
- Versioning support

### Phase 4: Integration Refactoring

Refactor each integration to:
1. Use unified client
2. Reference centralized enum/mapping library
3. Use prompt builder utilities
4. Share validation logic

---

## Implementation Priorities

### 🔴 **HIGH PRIORITY** (Address Onboarding Issues)

1. **Create Reference Library** (`lib/llm/references/`)
   - Extract all enum definitions
   - Create comprehensive NL → enum mappings
   - Document all canonical values
   - **Impact:** Immediate improvement to onboarding accuracy

2. **Refactor Onboarding Prompts**
   - Use reference library in prompts
   - Reduce prompt size by referencing mappings
   - Add examples from reference library
   - **Impact:** Better accuracy, easier maintenance

3. **Create Unified Client**
   - Centralize Together.ai initialization
   - Add retry logic
   - Add token/cost tracking
   - **Impact:** Better reliability, cost visibility

### 🟡 **MEDIUM PRIORITY** (Optimization)

4. **Evaluate Model Selection**
   - Test if 3B model works for workflows
   - Create model selection criteria
   - Add cost/performance tracking
   - **Impact:** Cost reduction, performance optimization

5. **Standardize Prompt Structure**
   - Create prompt template system
   - Add versioning
   - Enable A/B testing
   - **Impact:** Easier maintenance, incremental improvements

### 🟢 **LOW PRIORITY** (Future Enhancements)

6. **Add Prompt Testing Framework**
   - Systematic testing
   - Accuracy metrics
   - Regression testing
   - **Impact:** Confidence in changes

7. **Add Monitoring & Analytics**
   - Track accuracy rates
   - Monitor costs
   - Alert on failures
   - **Impact:** Proactive issue detection

---

## Next Steps & Recommendations

### ✅ COMPLETED

1. **✅ Reference Library Foundation Created**
   - Created `lib/llm/references/` structure
   - Extracted all enum definitions from contracts (`enums.ts`)
   - Extracted comprehensive NL → enum mappings from prompts (`mappings.ts`)
   - Extracted component type mappings (`component-mappings.ts`)
   - Created main export file (`index.ts`)
   - Created README documentation

### Immediate Actions (This Week)

1. **Create Unified Client**
   - Move Together.ai initialization to `lib/llm/core/client.ts`
   - Add basic retry logic
   - Add token tracking

2. **Refactor Onboarding Integration**
   - Update onboarding prompts to reference library
   - Test accuracy improvements
   - Measure before/after metrics

### Short Term (Next 2 Weeks)

4. **Expand Reference Library**
   - Add all enum types across app
   - Create comprehensive mappings
   - Add validation schemas

5. **Refactor Other Integrations**
   - Dashboard generation
   - Workflow generation
   - Component selection

6. **Create Prompt Builder**
   - Template system
   - Reference library integration
   - Example injection

### Long Term (Next Month)

7. **Model Optimization**
   - Test different models
   - Create selection criteria
   - Optimize costs

8. **Monitoring & Analytics**
   - Track accuracy
   - Monitor costs
   - Create dashboards

---

## Success Metrics

### Onboarding Accuracy
- **Current:** Unknown (struggling per your feedback)
- **Target:** 85%+ extraction accuracy
- **Measurement:** Track entity extraction success rate

### Cost Optimization
- **Current:** Using 120B model for workflows (~$0.80/1M tokens)
- **Target:** Use appropriate model size, reduce costs by 50%+
- **Measurement:** Track token usage and costs per integration

### Developer Experience
- **Current:** Editing 988-line prompt files
- **Target:** Small, focused prompt files using reference library
- **Measurement:** Time to add new enum/mapping

### Maintenance Burden
- **Current:** Scattered prompts, hard to maintain
- **Target:** Centralized, easy to update
- **Measurement:** Time to add new feature/improve accuracy

---

## Questions to Consider

1. **Model Selection Strategy:**
   - Should we standardize on one model size?
   - When is 120B necessary vs 3B sufficient?
   - Should we use different models for different tasks?

2. **Reference Library Scope:**
   - Should we include all domain enums (items, orders, etc.)?
   - How granular should mappings be?
   - Should we support multi-language mappings?

3. **Prompt Architecture:**
   - Should prompts be code-generated from reference library?
   - Should we use templates vs static prompts?
   - How do we version and test prompts?

4. **Cost vs Performance:**
   - What's acceptable latency?
   - What's acceptable cost per request?
   - Should we cache common extractions?

---

## Conclusion

**Current State:** Functional but fragmented, with clear opportunities for improvement, especially in onboarding.

**Recommendation:** Start with reference library creation and onboarding prompt refactoring. This addresses your immediate concern about onboarding accuracy while building the foundation for a more robust SLM library.

**Next Steps:** 
1. Create reference library structure
2. Extract and consolidate enum mappings
3. Refactor onboarding to use reference library
4. Measure improvement

This foundation will enable:
- Better accuracy through reference documentation
- Easier maintenance through centralized mappings
- Future custom SLM training using reference library as ground truth
- Systematic improvement across all integrations


