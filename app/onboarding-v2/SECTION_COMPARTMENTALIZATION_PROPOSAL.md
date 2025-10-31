# Section Compartmentalization Proposal

## Problem Statement

The current onboarding system loads all questions upfront, but we want to:
1. Load questions section-by-section (company → operations → items → etc.)
2. Maintain LLM contract awareness across all sections
3. Allow partial application generation as sections complete
4. Enable the LLM to skip questions based on already-answered data from ANY section

## Proposed Solution: Section-Based Progressive Loading

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Contract State (Unified)                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │ Company  │  │Operations│  │  Items   │  │ Workflows│ │
│  │ Section  │  │ Section  │  │ Section  │  │ Section  │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
│                                                             │
│  All sections write to the SAME contract object           │
│  LLM always sees FULL contract for extraction/analysis   │
└─────────────────────────────────────────────────────────────┘
```

### Key Principles

1. **Unified Contract**: All sections write to the same `GenerationContractV1` object
2. **Progressive Loading**: Only load questions for the current section
3. **LLM Full Awareness**: LLM extraction always sees the complete contract
4. **Section Completion Tracking**: Track which sections are complete for partial generation

### Implementation Plan

#### Phase 1: Section-Aware Question Loading

```typescript
// New function: Load questions for a specific section
export function loadQuestionsForSection(
  section: SectionId,
  industry?: string,
  subIndustry?: string
): Question[] {
  const registry = getQuestionRegistry(industry, subIndustry);
  
  // Get section-specific question config
  const sectionConfig = registry.sections[section];
  if (!sectionConfig) return [];
  
  // Load only questions for this section
  const questions: Question[] = [];
  for (const loadPath of sectionConfig.loadOrder) {
    const questionObj = loadQuestionFile(loadPath);
    if (questionObj) {
      const sectionQuestions = Object.values(questionObj)
        .filter(q => q.section === section);
      questions.push(...sectionQuestions);
    }
  }
  
  return questions;
}
```

#### Phase 2: Section Navigation State

```typescript
interface SectionState {
  currentSection: SectionId;
  completedSections: Set<SectionId>;
  currentQuestionIndex: number; // Index within current section
}

// Navigation logic
function moveToNextSection(): void {
  // Mark current section as complete
  markSectionComplete(currentSection);
  
  // Move to next incomplete section
  const nextSection = getNextIncompleteSection();
  if (nextSection) {
    loadSection(nextSection);
  } else {
    showReview();
  }
}
```

#### Phase 3: Registry Structure Update

```json
{
  "questionSets": {
    "manufacturing.fashion": {
      "sections": {
        "company": {
          "loadOrder": [
            "manufacturing/fashion/company"
          ],
          "required": true,
          "order": 1
        },
        "operations": {
          "loadOrder": [
            "manufacturing/fashion/operations"
          ],
          "required": true,
          "order": 2
        },
        "items": {
          "loadOrder": [
            "manufacturing/common/items"
          ],
          "required": false,
          "order": 3
        }
      }
    }
  }
}
```

#### Phase 4: LLM Contract Awareness

The LLM always receives the FULL contract, regardless of current section:

```typescript
// When calling LLM extraction
async function extractEntities(text: string, context: ExtractionContext) {
  const response = await fetch('/api/nlp/extract', {
    method: 'POST',
    body: JSON.stringify({
      text,
      context,
      contract: contract, // FULL contract, not just current section
    }),
  });
  
  // LLM can see all sections
  // e.g., if company.description mentions operations, LLM can extract
  // operations fields and they'll be committed to operations section
}
```

#### Phase 5: Skip Logic Enhancement

```typescript
export function shouldShowQuestion(
  question: Question,
  contract: GenerationContractV1, // FULL contract
  currentSection: SectionId
): boolean {
  // Check if data already exists in ANY section
  const existsInContract = hasContractValue(contract, question.mapsTo);
  
  if (question.skipIfCommitted && existsInContract) {
    return false; // Skip if already answered (from any section)
  }
  
  // Other checks...
  return true;
}
```

### Benefits

1. **Cleaner Navigation**: Users see one section at a time
2. **Faster Initial Load**: Only load current section's questions
3. **Progressive Generation**: Can generate parts of app as sections complete
4. **LLM Intelligence**: LLM can extract cross-section data (e.g., operations info from company description)
5. **Better UX**: Clear progress per section

### Example Flow

```
1. User starts onboarding
   └─> Load company section questions (e.g., 40 questions)
   └─> Contract: { company: {...}, operations: {}, items: {} }

2. User answers company questions
   └─> LLM extracts: company.name, company.location, operations.overview_text
   └─> Contract: { company: {name: "Acme", ...}, operations: {overview_text: "..."}, items: {} }

3. Company section complete
   └─> Mark company section complete
   └─> Load operations section questions (e.g., 30 questions)
   └─> operations_overview_nlp is SKIPPED (already committed from step 2)

4. User answers operations questions
   └─> Contract: { company: {...}, operations: {...}, items: {} }

5. Operations section complete
   └─> Can generate operations dashboard NOW (partial generation)
   └─> Load items section questions
```

### Migration Path

1. **Step 1**: Update registry to support section-based loading (backward compatible)
2. **Step 2**: Add section navigation state management
3. **Step 3**: Update question loader to support section filtering
4. **Step 4**: Update UI to show section progress
5. **Step 5**: Enable partial generation per section

### LLM Contract Reference Solution

**Problem**: How does LLM know what's been answered across sections?

**Solution**: 
- LLM always receives FULL contract state
- Contract has `metadata.committedFields` array tracking all committed fields
- LLM prompt includes: "Based on the contract data provided, extract only missing information"
- Dynamic follow-up questions check full contract, not just current section

**Example Prompt Enhancement**:
```
You are extracting [operations] information. 

The user has already provided:
- Company name: Acme Manufacturing
- Location: Istanbul, Turkey
- Production model: MTO (from company.description)

Current contract state:
{
  "company": { "name": "Acme", "hqLocation": "Istanbul" },
  "operations": { "overview_text": "We produce custom jeans..." }
}

Extract ONLY operations-related entities that are NOT already in the contract.
Skip: overview_text (already provided)
Extract: stages_list, planning_method, etc.
```

### Next Steps

1. ✅ Simplify registry to only company + operations
2. ✅ Fix operations questions not showing
3. ⏳ Implement section-based loading
4. ⏳ Add section navigation UI
5. ⏳ Enable partial generation

