# Smart Onboarding System

**Intelligent, adaptive onboarding that minimizes redundant questions and fills gaps automatically.**

---

## 🎯 Core Concept

### The Problem
Traditional onboarding asks every question in sequence, even if you've already provided the answer earlier.

### The Solution
**Progressive Disclosure + Gap Filling**

1. **Smart Skipping**: If user mentions company name in first general question, don't ask "What's your company name?" later
2. **Contract-Driven**: Track exactly which required fields have been satisfied
3. **Intelligent Gap Filling**: At the end, identify missing required fields and ask targeted questions

---

## 🧠 How It Works

### Phase 1: Data Collection with Smart Skipping

```
User: "We are a denim manufacturing company in Istanbul with 45 employees"

System extracts:
✅ company.name ← "denim manufacturing company"
✅ company.industry ← "manufacturing"  
✅ company.locations ← [Istanbul]
✅ company.size ← "10-50" (from 45 employees)
✅ items.categories ← ["denim"]

Later questions are automatically skipped:
⏭️ "What's your company name?" - SKIP (already have it)
⏭️ "What industry are you in?" - SKIP (already have it)
⏭️ "Where is your facility?" - SKIP (already have it)
✅ "What is your operations model?" - SHOW (still need this)
```

### Phase 2: Gap Analysis

Before final review, the system checks:

```typescript
const completeness = analyzeContractCompleteness(contract);

completeness.missingRequired = [
  { path: 'operations.model', description: 'Operations model' },
  { path: 'workflows.stages', description: 'Workflow stages' }
]
```

### Phase 3: Dynamic Gap Filling

If missing fields exist, system generates natural questions:

```
Question 1 of 2: "What is your primary operations model?"
→ User answers: "We work make-to-order"

Question 2 of 2: "What are the main stages in your production process?"
→ User answers: "Cutting, sewing, quality control, packing"

✅ All required fields satisfied!
```

---

## 📂 File Structure

```
/app/onboarding-v2/
├── lib/
│   ├── contract-completeness.ts    ← Core intelligence
│   │   - analyzeContractCompleteness()
│   │   - shouldSkipQuestion()
│   │   - generateGapFillingQuestions()
│   │
│   ├── conditional-logic.ts         ← Question filtering
│   │   - Integrates smart skipping
│   │   - Shows gap_filling only when needed
│   │
│   └── llm-extraction.ts            ← Entity extraction
│
├── components/
│   ├── GapFillingQuestions.tsx     ← Gap-filling UI
│   └── StepContainer.tsx            ← Renders gap_filling step
│
└── content/
    └── questions.en.json            ← Includes gap_filling question
```

---

## 🔧 Implementation Details

### 1. Contract Field Definitions

All required vs. optional fields are defined in `contract-completeness.ts`:

```typescript
export const CONTRACT_FIELD_DEFINITIONS = {
  // REQUIRED
  'company.name': { required: true, description: 'Company name' },
  'company.industry': { required: true, description: 'Industry type' },
  'operations.model': { required: true, description: 'Operations model' },
  'workflows.stages': { required: true, description: 'Workflow stages' },
  
  // OPTIONAL  
  'company.logoUrl': { required: false, description: 'Company logo' },
  'operations.monthlyCapacity': { required: false, description: 'Monthly capacity' },
  ...
}
```

### 2. Smart Question Skipping

In `conditional-logic.ts`:

```typescript
export function shouldShowQuestion(question: Question, contract: GenerationContractV1): boolean {
  // Skip if data already satisfied from previous answers
  if (shouldSkipQuestion(contract, question.mapsTo)) {
    console.log(`⏭️ Skipping "${question.id}" - data already provided`);
    return false;
  }
  
  // Normal conditional logic
  ...
}
```

### 3. Field Satisfaction Check

```typescript
function isFieldSatisfied(contract: GenerationContractV1, path: string): boolean {
  const value = getValueAtPath(contract, path);
  
  // Empty checks
  if (value === undefined || value === null) return false;
  if (value === '') return false;
  if (Array.isArray(value) && value.length === 0) return false;
  
  // Check for placeholder values
  if (value === 'unknown' || value === 'n/a' || value === 'tbd') return false;
  
  return true;
}
```

### 4. Gap Filling Logic

```typescript
// Only show gap_filling question if there are missing required fields
if (question.type === 'gap_filling') {
  const completeness = analyzeContractCompleteness(contract);
  return completeness.missingRequired.length > 0;
}
```

---

## 📊 Example Flow

### Scenario: Comprehensive First Answer

**User's first input:**
> "We are a denim jeans manufacturer in Istanbul. We have 45 employees and produce about 10,000 units per month. Our process includes cutting, sewing, washing, and quality control."

**Extracted automatically:**
- ✅ Company name: "denim jeans manufacturer"
- ✅ Industry: "manufacturing"  
- ✅ Location: Istanbul, Turkey
- ✅ Team size: "10-50" (45 people)
- ✅ Products: ["denim", "jeans"]
- ✅ Capacity: 10,000 units/month
- ✅ Workflow stages: ["Cutting", "Sewing", "Washing", "Quality Control"]

**Questions automatically skipped:**
1. ⏭️ "What's your company name?"
2. ⏭️ "What industry are you in?"
3. ⏭️ "Where is your facility?"
4. ⏭️ "How many employees?"
5. ⏭️ "What do you produce?"
6. ⏭️ "What's your monthly capacity?"
7. ⏭️ "Describe your workflow stages"

**Questions still shown:**
1. ✅ "What is your operations model?" (MTO/MTS/hybrid) - still needed
2. ✅ "How many shifts do you run?" - still needed  
3. ✅ "What are your key metrics?" - still needed

**At the end:**
- Check for missing required fields
- If any exist → show gap-filling questions
- If none → skip straight to review

---

## 💡 Benefits

### 1. **Faster Onboarding**
- User provides comprehensive answers early
- Skip redundant questions automatically
- Could reduce 30-minute flow to 10-15 minutes

### 2. **Better UX**
- No frustration from repetitive questions
- Natural conversation flow
- Progressive disclosure feels intelligent

### 3. **Complete Data**
- Gap filling ensures no required fields are missed
- Contract validation before generation
- Clear visibility into what's still needed

### 4. **Provenance Tracking**
- Know which data came from NLP vs. manual input
- Track confidence levels
- Can ask for confirmation on low-confidence extractions

---

## 🎯 Progress Tracking

### Current Implementation

```typescript
const completeness = analyzeContractCompleteness(contract);

// Overall status
completeness.overallComplete → true/false
completeness.percentComplete → 0-100

// Detailed breakdown
completeness.requiredFields → all required fields with status
completeness.missingRequired → fields still needed
completeness.lowConfidenceFields → might need confirmation
```

### Future Enhancements

1. **Real-time progress indicator**
   ```
   ✅ 85% complete
   
   Still needed:
   - Operations model
   - Key metrics
   
   Please confirm (low confidence):
   - Lead time (we guessed 14 days)
   ```

2. **Smart suggestions**
   ```
   💡 Tip: Mentioning your shift schedule will help us 
   skip 2 more questions!
   ```

3. **LLM-generated gap questions**
   Instead of static questions, use LLM to generate contextual ones:
   ```
   Based on your answers so far, you mentioned Istanbul
   and denim manufacturing. What's your typical order
   lead time for custom jeans orders?
   ```

---

## 🚀 Usage

### For Developers

**Adding a new required field:**

1. Add to `CONTRACT_FIELD_DEFINITIONS`:
```typescript
'newSection.newField': { 
  required: true, 
  description: 'Description of field' 
}
```

2. That's it! The system automatically:
   - Checks if it's satisfied
   - Skips related questions if already filled
   - Includes in gap-filling if missing

### For Content Designers

**Creating questions:**

Just ensure `mapsTo` field points to contract path:
```json
{
  "id": "company_name",
  "type": "text_input",
  "mapsTo": "company.name",  ← Links to contract field
  "prompt": "What's your company name?",
  ...
}
```

System automatically skips this question if `company.name` is already satisfied.

---

## 📈 Metrics to Track

- **Skip rate**: % of questions skipped due to prior answers
- **Gap fill rate**: % of onboardings requiring gap-filling
- **Average questions asked**: vs. total questions defined
- **Completion time**: Before vs. after smart skipping
- **Data quality**: Completeness of generated contracts

---

## 🔮 Future Vision

### Conversational Onboarding
```
System: "Tell me about your business in your own words."

User: "We make custom leather bags in Brooklyn. Small batch, 
high quality. Each bag takes about a week to make..."

System extracts 20+ data points, skips 15 questions

System: "Got it! Just a few more things:
1. How many bags do you typically make per month?
2. What's your main quality checkpoint?"

✅ Complete in 5 minutes vs. 30 minutes
```

### Adaptive Learning
- Learn which questions users struggle with
- Automatically adjust prompt contexts
- Suggest better placeholder text based on common answers

---

**Last Updated:** October 17, 2025

