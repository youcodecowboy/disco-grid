# Workflows V3: Dynamic Refinement Questions System

## Overview

The Refinement Questions system is an intelligent assistant that guides users through completing workflow stage configurations by dynamically detecting missing information and asking targeted questions.

## How It Works

### 1. Automatic Detection

When a stage card is expanded, the system analyzes the stage configuration and identifies missing or incomplete fields:

- **Team Assignment**: Is a team assigned to this stage?
- **Inputs**: What action begins this stage? (QR scan, form, photo, etc.)
- **Outputs**: What marks the completion of this stage?
- **Dependencies**: Are there conditions that must be met before starting?
- **Duration**: How long does this stage typically take?

### 2. Progressive Questioning

Questions are presented **one at a time** in a logical sequence:

```
Question 1/5: Which team is responsible for the "Cutting" stage?
User answers → System processes → Updates stage

Question 2/5: What input is required to BEGIN the "Cutting" stage?
User answers → System processes → Updates stage

... and so on
```

### 3. LLM-Powered Interpretation

Each answer is sent to the LLM with a **field-specific prompt** that:
- Extracts structured data from natural language
- Validates the response
- Returns confidence scores
- Handles edge cases (e.g., "none" for dependencies)

### 4. Real-Time Updates

As soon as an answer is processed:
- The stage object is updated immediately
- The next question appears automatically
- Progress bar advances
- If all questions are answered, shows "Stage information complete" badge

## User Interface

### Location
The refinement section appears at the **bottom of each expanded StageCard**, just above the "Complete stage configuration" footer button.

### Visual Design
- **Purple theme**: Distinguishes refinement section from main stage content
- **Progress indicator**: Shows "2 of 5" with visual progress bar
- **Context hints**: Each question shows what's missing (e.g., "Missing: No team assigned")
- **Keyboard shortcut**: `Cmd+Enter` to submit answer

### States

**Active (questions remaining)**
```
┌─────────────────────────────────────────────┐
│ ✨ Refinement Questions          2 of 5     │
│ ████████████████░░░░░░░░░░░░░░░ 40%         │
│                                              │
│ Which team is responsible for "Cutting"?    │
│ Missing: No team assigned                    │
│                                              │
│ [Type your answer...      ] [Submit ⌘↵]     │
└─────────────────────────────────────────────┘
```

**Complete (all fields filled)**
```
┌─────────────────────────────────────────────┐
│ ✓ Stage information complete                │
└─────────────────────────────────────────────┘
```

## LLM Integration

### API Endpoint
`POST /api/nlp/workflow/refine`

### Request Format
```json
{
  "stage": { /* WorkflowStageV3 object */ },
  "question": "Which team is responsible...",
  "answer": "the cutting team",
  "field": "teamId"
}
```

### Response Format
```json
{
  "success": true,
  "updatedStage": { /* Updated WorkflowStageV3 */ },
  "interpretation": "Assigned to Cutting Team",
  "confidence": 0.85
}
```

### Field-Specific Prompts

Each field type has a specialized prompt:

#### Team Assignment (`teamId`)
- Extracts team/department/role names
- Normalizes to consistent format (e.g., "Design Team")
- Returns: `{ teamId: "string" }`

#### Inputs (`inputs`)
- Identifies input types: qr_scan, form_submission, photo_upload, etc.
- Creates structured input objects
- Returns: `{ inputs: [{ id, type, description, required }] }`

#### Outputs (`outputs`)
- Identifies output types: task_completion, quality_check, approval, etc.
- Creates structured output objects
- Returns: `{ outputs: [{ id, type, description, required }] }`

#### Dependencies (`dependencies`)
- Handles "none" as empty array
- Identifies dependency types: task_completion, approval, time_delay, etc.
- Creates structured dependency objects with config
- Returns: `{ dependencies: [{ id, type, description, required, config }] }`

#### Duration (`estimatedDuration`)
- Extracts time values and converts to minutes
- Handles various formats: "2 hours", "30 minutes", "1 day"
- Returns: `{ estimatedDuration: <number> }`

## Implementation Details

### Component: `StageRefinementQuestions.tsx`

**State Management**
```typescript
const [questions, setQuestions] = useState<RefinementQuestion[]>([])
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
const [answer, setAnswer] = useState("")
const [isProcessing, setIsProcessing] = useState(false)
```

**Key Functions**
- `analyzeStage()`: Scans stage for missing fields and generates questions
- `handleSubmitAnswer()`: Sends answer to LLM and updates stage
- Keyboard handler for `Cmd+Enter` submission

**Integration**
- Imported and rendered in `StageCard.tsx` just before footer
- Receives `stage` prop and `onStageUpdate` callback
- Updates trigger re-analysis for new questions

### API Route: `/app/api/nlp/workflow/refine/route.ts`

**Model**
- Uses `openai/gpt-oss-120b` via Together.ai
- Temperature: 0.2 (deterministic)
- Max tokens: 1500
- Response format: JSON object

**Prompt Engineering**
- Base prompt defines JSON structure
- Field-specific instructions via `buildRefinementPrompt()`
- Examples provided for each field type
- Edge case handling (e.g., "none" for dependencies)

## User Flow Example

### Scenario: Creating a "Cutting" Stage

1. **User creates new stage** (either via LLM generation or manual "Add Stage")
2. **Stage expands** and shows incomplete fields
3. **Refinement section appears** with first question:

   > **Which team or department is responsible for the "Cutting" stage?**
   > Missing: No team assigned
   
4. **User types**: "the cutting team"
5. **User presses Cmd+Enter** or clicks Submit
6. **LLM processes** answer and updates stage:
   ```json
   { "teamId": "Cutting Team" }
   ```
7. **Next question appears**:

   > **What input or action is required to BEGIN the "Cutting" stage?**
   > Missing: No inputs defined
   
8. **User types**: "scan the fabric roll QR code"
9. **LLM interprets** and creates input:
   ```json
   {
     "inputs": [{
       "id": "input-1",
       "type": "qr_scan",
       "description": "Scan fabric roll QR code",
       "required": true
     }]
   }
   ```
10. **Process continues** until all 5 questions are answered
11. **"Stage information complete"** badge appears
12. **User clicks** "Complete stage configuration"
13. **Stage collapses** and shows summary

## Benefits

### For Users
- **Guided Experience**: No need to remember all required fields
- **Natural Language**: Answer in your own words
- **Progressive Disclosure**: One question at a time prevents overwhelm
- **Validation**: System ensures all critical info is captured
- **Flexibility**: Works for both LLM-generated and manual stages

### For the System
- **Data Quality**: Ensures complete and structured stage configurations
- **Consistency**: Standardized field formats across all workflows
- **Validation**: LLM interprets and validates user input
- **Extensibility**: Easy to add new question types
- **Training Data**: Collects Q&A pairs for future LoRA fine-tuning

## Future Enhancements

### Planned Features
1. **Smart Defaults**: Pre-fill common answers based on workflow type
2. **Multi-Field Questions**: "Does this stage require any approvals or time delays?"
3. **Conditional Logic**: Ask different questions based on previous answers
4. **Confidence Feedback**: Show when LLM is uncertain and needs clarification
5. **Batch Refinement**: "Refine all stages" button to process entire workflow
6. **Learning System**: Remember user's patterns and suggest answers
7. **Voice Input**: Speak answers for hands-free configuration

### LoRA Fine-Tuning
As users answer questions, we collect training data:
```json
{
  "context": "workflow: custom t-shirts, stage: printing",
  "question": "Which team is responsible?",
  "answer": "the printing guys",
  "extracted": { "teamId": "Printing Team" },
  "confidence": 0.85
}
```

This data will be used to fine-tune the model for:
- Industry-specific terminology
- Company-specific team names
- Common process patterns
- Edge case handling

## Technical Considerations

### Performance
- **Debouncing**: Questions only trigger after expansion, not on every change
- **Caching**: Could cache common interpretations
- **Batching**: Could batch multiple questions for faster processing

### Error Handling
- **Validation**: Checks for empty answers before submission
- **Retry Logic**: Could add automatic retry on API failure
- **Fallback**: Shows error message if LLM interpretation fails
- **Manual Override**: User can always manually edit fields directly

### Accessibility
- **Keyboard Navigation**: Full keyboard support with shortcuts
- **Screen Readers**: Proper ARIA labels and announcements
- **Visual Feedback**: Clear progress indicators and state changes
- **Error Messages**: Descriptive error messages for failures

## Testing Recommendations

### Unit Tests
- Test `analyzeStage()` with various stage configurations
- Test question generation logic
- Test LLM response parsing

### Integration Tests
- Test API endpoint with various field types
- Test prompt engineering for each field
- Test error handling and edge cases

### User Testing
- Test with manufacturing domain experts
- Test with non-technical users
- Measure time to complete stage vs manual entry
- Gather feedback on question phrasing

## Conclusion

The Dynamic Refinement Questions system transforms workflow configuration from a potentially overwhelming form-filling task into a guided conversation. By leveraging LLM intelligence, it makes the system accessible to users of all technical levels while ensuring data quality and completeness.













