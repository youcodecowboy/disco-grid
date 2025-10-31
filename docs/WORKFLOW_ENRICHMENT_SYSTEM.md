# Workflow Enrichment System

**Purpose:** Dynamically enrich workflows with follow-up questions to ensure completeness before saving.

---

## Architecture

### Components

1. **Gap Analyzer** (`lib/llm/workflow-enrichment/gap-analyzer.ts`)
   - Analyzes generated workflows for missing information
   - Identifies gaps by type and severity
   - Determines if workflow is complete enough to save

2. **Question Generator** (`lib/llm/workflow-enrichment/question-generator.ts`)
   - Uses 20B model to generate natural, contextual follow-up questions
   - Converts technical gaps into conversational questions
   - Provides options when appropriate

3. **Workflow Updater** (`lib/llm/workflow-enrichment/workflow-updater.ts`)
   - Applies answers back to workflow structure
   - Maps question answers to workflow fields
   - Updates stages and limbo zones dynamically

4. **Enrichment API** (`app/api/nlp/workflow/enrich/route.ts`)
   - Analyzes workflow gaps
   - Generates follow-up questions
   - Returns completeness status

5. **UI Components**
   - `WorkflowEnrichmentQuestions` - Displays questions and collects answers
   - Updated `NaturalLanguageInput` - Integrates enrichment flow

---

## Flow

```
1. User describes workflow → Generate workflow (20B model)
   ↓
2. Analyze workflow for gaps → Identify missing information
   ↓
3. Generate follow-up questions → Use LLM to create natural questions
   ↓
4. Display questions → User answers or skips
   ↓
5. Apply answers → Update workflow structure
   ↓
6. Check completeness → All critical questions answered?
   ↓
7. Allow saving → Or show remaining questions
```

---

## Gap Types Detected

### Critical/High Priority
- **Missing Inputs** - Stage has no input requirements
- **Missing Outputs** - Stage has no output requirements  
- **Unlinked Dependencies** - Dependencies not linked to tasks/stages

### Medium Priority
- **Missing Team** - Stage has no team assignment
- **Missing Limbo Details** - Limbo zone has no dependencies

### Low Priority
- **Open-ended Descriptions** - Brief or vague descriptions
- **Missing Workflow Name** - No workflow name provided

---

## Question Generation

**Model:** openai/gpt-oss-20b (20B)  
**Strategy:** Generate natural, conversational questions based on gaps

**Example Questions:**
- "How do workers start the Cutting stage? Do they scan a QR code, fill out a form, or take a photo?"
- "Which team handles the Sewing stage? Is it the production team, sewing department, or another team?"
- "For the manager approval dependency, should this be linked to a specific approval task, or is it a general sign-off?"

---

## Save Validation

**Blocking:** Cannot save until all critical/high priority questions are answered  
**Warning:** Medium/low priority questions can be skipped  
**Override:** User can explicitly accept incomplete workflow

---

## Integration Points

1. **NaturalLanguageInput Component**
   - After workflow generation, calls enrichment API
   - Shows questions if gaps found
   - Updates workflow as user answers

2. **Workflow Builder Page**
   - Validates completeness before allowing save
   - Shows enrichment status
   - Blocks save if critical gaps remain

---

## Next Steps

- [ ] Add Card component if missing
- [ ] Test enrichment flow end-to-end
- [ ] Add workflow update persistence
- [ ] Improve answer mapping for complex fields
- [ ] Add batch question answering
- [ ] Test with various workflow complexities

