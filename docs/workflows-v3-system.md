# Workflows V3 System Documentation

**Status**: Active Development  
**Version**: 3.0  
**Last Updated**: October 18, 2025

## Overview

Workflows V3 is a form-based workflow creation system with natural language LLM intelligence. It replaces the canvas-based approach with an intuitive, mobile-friendly interface that makes workflow creation as easy as describing a process in plain English.

## Key Features

### 1. Natural Language Workflow Generation
- Describe your manufacturing process in plain English
- LLM extracts stages, dependencies, teams, inputs, and outputs
- Generates complete workflow structure automatically
- Uses Llama 3.1 70B for high-quality extraction
- Fine-tunable with LoRA adapters for industry-specific improvements

### 2. Form-Based Stage Builder
- **4-Section "Hamburger" Structure**:
  - **Section 1: Stage Info** (Top Bun) - Sequential/parallel, team assignment, timing
  - **Section 2: Inputs** (Lettuce) - What needs to happen to BEGIN the stage
  - **Section 3: Dependencies** (Meat) - Core prerequisite logic
  - **Section 4: Outputs** (Bottom Bun) - What needs to happen to COMPLETE the stage

### 3. Limbo Zones
- Special zones between stages
- Add dependencies that don't update item status
- Examples: "Change thread on machines", "Wait for fabric to rest", "Manager approval"
- Item location = "limbo" during these transitions

### 4. Comprehensive Dependency System
Nine dependency types cover all manufacturing scenarios:

1. **Task Completion**: Stage can't start until task X is done
2. **Task Creation**: Task must be created before stage begins
3. **Approval**: Manager/supervisor must approve
4. **Event Completion**: Planner event must be completed
5. **Time-Based**: Wait X hours/days after previous stage
6. **Capacity-Based**: Team must have Y% capacity available
7. **Component Completion**: All component items must finish
8. **Quantity Threshold**: X items must complete previous stage
9. **Custom Condition**: Item must meet attribute conditions

### 5. Lego-Style UI Pattern
- Start minimal, build organically
- "+ Add X" buttons for inputs, outputs, dependencies
- Inline expansion (no modals)
- "×" remove buttons
- Collapsible sections with auto-scroll

## Architecture

### Data Model

```typescript
WorkflowV3 {
  id, name, description, industry
  active, clientId
  stages: WorkflowStageV3[]
  limboZones: LimboZone[]
  lastExecutionAt, activeItemCount, totalExecutions
}

WorkflowStageV3 {
  id, sequence, name, type: "sequential" | "parallel"
  inputs: StageInput[]
  dependencies: StageDependency[]
  outputs: StageOutput[]
  assignedTeam, estimatedDuration
  isExpanded, isComplete
}

LimboZone {
  betweenStages: [fromStageId, toStageId]
  dependencies: StageDependency[]
}
```

### Component Structure

```
app/workflows-v3/
  ├── page.tsx                      # Library landing
  └── [id]/page.tsx                 # Builder

components/workflows-v3/
  ├── NaturalLanguageInput.tsx      # LLM input
  ├── StageCard.tsx                 # Main stage card
  ├── StageInfoSection.tsx          # Section 1
  ├── StageInputsSection.tsx        # Section 2
  ├── StageDependenciesSection.tsx  # Section 3
  ├── StageOutputsSection.tsx       # Section 4
  ├── DependencyBuilder.tsx         # Dependency config
  └── LimboZoneCard.tsx             # Limbo zones

lib/workflows-v3/
  ├── types.ts                      # TypeScript definitions
  ├── dependencyTypes.ts            # Dependency type library
  └── mockData.ts                   # Mock workflows

app/api/nlp/workflow/
  └── generate/route.ts             # LLM generation endpoint
```

## Usage Guide

### Creating a Workflow

1. **Navigate**: Go to `/workflows-v3` and click "New workflow"
2. **Describe**: Use natural language input to describe your process
3. **Generate**: LLM creates stages, dependencies, limbo zones automatically
4. **Refine**: Click on stages to expand and configure details
5. **Complete**: Click "Complete stage configuration" to collapse and move to next
6. **Save**: Click "Save workflow" to persist

### Manual Stage Creation

1. Click "+ Add stage" at bottom of page
2. Stage appears expanded with all 4 sections
3. Fill in stage name, type (sequential/parallel)
4. Add inputs (QR scan, form, photo, etc.)
5. Add dependencies (approvals, time delays, etc.)
6. Add outputs (form submit, approval, measurement, etc.)
7. Click "Complete stage configuration"
8. Stage collapses, auto-scrolls to next

### Limbo Zones

- Automatically appear between stages
- Click "+ Add dependency" to add requirements
- Examples:
  - Time delay: "Wait 2 hours for fabric to rest"
  - Approval: "Manager must approve before next stage"
  - Task: "Change thread on all sewing machines"

## LLM Integration

### System Prompt

Located in `app/api/nlp/extract/prompts.ts` under `workflow_creation` context.

**Key Extraction Rules:**
- Identify every process step mentioned
- Distinguish sequential vs parallel stages
- Extract team assignments
- Detect input/output requirements
- Identify dependencies (approvals, time delays, etc.)
- Find limbo zone requirements

### API Endpoint

`POST /api/nlp/workflow/generate`

**Request:**
```json
{
  "description": "We run a denim factory. Process: inspection, cutting, sewing, washing, finishing, QA, packing. Between cutting and sewing, fabric rests 2 hours. Sewing needs manager approval to start.",
  "context": {
    "industry": "Fashion Manufacturing",
    "clientName": "Blue Denim Co."
  }
}
```

**Response:**
```json
{
  "success": true,
  "stages": [
    {
      "name": "Fabric Inspection",
      "sequence": 1,
      "type": "sequential",
      "suggestedTeam": "Warehouse Team",
      "suggestedInputs": ["qr_scan"],
      "suggestedOutputs": ["form_submit"],
      "dependencies": []
    },
    // ... more stages
  ],
  "limboZones": [
    {
      "betweenStages": ["Cutting", "Sewing"],
      "dependencies": [
        {
          "type": "time_based",
          "description": "Wait for fabric to rest"
        }
      ]
    }
  ],
  "suggestedName": "Denim Manufacturing Workflow",
  "model": "llama-3.1-70b",
  "tokensUsed": 1234
}
```

## UI/UX Patterns

### Collapsible Behavior
- **Expanded by default** when created
- Shows all 4 sections
- Click "Complete stage configuration" → collapses
- **Auto-scrolls** to next stage/limbo zone
- Click anywhere on collapsed card to re-expand

### Endless Stage Creation
- Bottom of page always has "+ Add stage"
- No limit on number of stages
- Limbo zones automatically created between stages
- Clean, uncluttered interface

### Visual Hierarchy
- **Stage cards**: White background, blue accents, colored section labels
- **Limbo zones**: Gray background (#F8F9FA), subtle, smaller
- **Sequential badge**: Purple, shows sequence number
- **Parallel badge**: Amber, shows "||" symbol
- **Complete checkmark**: Green, shows stage is configured

## Dependency Types Reference

### 1. Task Completion
**Use when**: Stage can't start until a specific task is done
**Config**: Task title, tags, source
**Example**: "Cannot start cutting until fabric inspection task is complete"

### 2. Task Creation
**Use when**: A task must be created as a prerequisite
**Config**: Task title, assignee, priority
**Example**: "Create purchase order task before starting production"

### 3. Approval
**Use when**: Manager/supervisor must approve
**Config**: Approver role/user, notification message
**Example**: "Manager must approve before moving to next stage"

### 4. Event Completion
**Use when**: Planner event must be completed
**Config**: Event title, event type
**Example**: "Material delivery event must complete"

### 5. Time-Based
**Use when**: Must wait X time after previous stage
**Config**: Delay amount, delay unit (minutes/hours/days)
**Example**: "Wait 24 hours for fabric to rest"

### 6. Capacity-Based
**Use when**: Team must have sufficient capacity
**Config**: Team name, required capacity %, threshold
**Example**: "Sewing team must have 50% capacity available"

### 7. Component Completion
**Use when**: All component items must finish this stage first
**Config**: Component stage ID, all required flag
**Example**: "All jacket pieces must complete sewing before assembly"

### 8. Quantity Threshold
**Use when**: X items must complete previous stage
**Config**: Quantity, previous stage ID
**Example**: "500 items must complete cutting before batch sewing"

### 9. Custom Condition
**Use when**: Item must meet custom attribute conditions
**Config**: Attribute name, operator, value
**Example**: "Only items with fabricType = 'denim' need washing"

## Best Practices

### Workflow Design
1. **Start with natural language**: Describe the process first, refine manually after
2. **Keep stages focused**: Each stage = one major operation
3. **Use limbo zones**: For transitions that don't change status
4. **Leverage dependencies**: Model real manufacturing constraints
5. **Assign teams**: Help with capacity planning and routing

### Stage Configuration
1. **Name clearly**: "Cutting" not "Stage 1"
2. **Add descriptions**: Help floor workers understand context
3. **Choose right inputs**: QR scan for tracking, forms for data
4. **Define outputs**: What proves this stage is complete?
5. **Set realistic durations**: Helps with scheduling

### Dependencies
1. **Start simple**: Add basic dependencies first
2. **Test logic**: Ensure dependencies make sense in sequence
3. **Use time delays**: For resting, curing, cooling periods
4. **Add approvals**: For quality gates and management checkpoints
5. **Consider capacity**: Prevent bottlenecks with capacity checks

## Integration Points

### With Items System
- Workflows assigned to items
- Track execution per item
- Update item location during limbo
- Record completion timestamps

### With Tasks System
- Dependencies can reference tasks
- Create tasks from dependencies
- Track task completion for prerequisites

### With Teams System
- Assign stages to teams
- Check team capacity
- Route work based on availability

### With Planner
- Event completion dependencies
- Schedule-based triggers
- Deadline tracking

## Future Enhancements

### Phase 2
- **Refinement questions**: AI asks clarifying questions to fill gaps
- **Templates library**: Pre-built workflows for common industries
- **Analytics dashboard**: Track workflow performance metrics
- **Version control**: Track changes, rollback capability

### Phase 3
- **LoRA adapter training**: Fine-tune model on user workflows
- **Multi-language support**: Generate from non-English descriptions
- **Mobile builder**: Create workflows on tablets
- **Voice input**: Describe workflows via speech

### Phase 4
- **Workflow simulation**: Test before publishing
- **Real-time collaboration**: Multiple users editing simultaneously
- **Integration APIs**: Connect to ERP/MES systems
- **Marketplace**: Share workflows between organizations

## Troubleshooting

### LLM Generation Issues
**Problem**: Stages not generated correctly
**Solution**: Provide more detail in description, mention sequence explicitly

**Problem**: Dependencies missing
**Solution**: Explicitly state "X must happen before Y" in description

**Problem**: Teams not assigned
**Solution**: Mention team names in description: "cutting team", "QA inspectors"

### UI Issues
**Problem**: Stage won't collapse
**Solution**: Ensure name, at least one input, and one output are filled

**Problem**: Auto-scroll not working
**Solution**: Check browser console for errors, may need scroll polyfill

**Problem**: Limbo zone not appearing
**Solution**: Limbo zones only appear between stages, ensure 2+ stages exist

## Support

For issues, questions, or feature requests related to Workflows V3:
- Check this documentation first
- Review the plan document: `w.plan.md`
- Examine component source code in `components/workflows-v3/`
- Test with mock data in `lib/workflows-v3/mockData.ts`

## Glossary

- **Stage**: A step in the workflow (e.g., Cutting, Sewing, QA)
- **Limbo Zone**: Transition area between stages with its own dependencies
- **Sequential**: Stages that must happen in order
- **Parallel**: Stages that can run simultaneously
- **Input**: Requirement to BEGIN a stage (e.g., QR scan)
- **Output**: Requirement to COMPLETE a stage (e.g., form submit)
- **Dependency**: Prerequisite that must be satisfied before stage can start
- **Lego-Style**: UI pattern of additive building with + Add buttons
- **LoRA Adapter**: Fine-tuning technique for improving LLM on specific tasks

---

**Maintainer**: Groovy Team  
**Last Reviewed**: October 18, 2025





