# LLM Task Assistant - Context Collector Architecture

## Overview

The Context Collector is the "all-seeing eye" that aggregates operational data from across the entire application. It functions as both:
1. **Event-Driven Index** (push) - Features write events that update the context in real-time
2. **Query-Based Aggregator** (pull) - When LLM analysis runs, it queries the aggregated context

## Core Architecture Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION FEATURES                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  Tasks   │  │Playbooks │  │ Workflows│  │ Calendar  │  ...   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
│       │             │             │             │               │
│       └─────────────┴─────────────┴─────────────┘               │
│                          │                                       │
│                    Event Emitter                                 │
│                    (write events)                                │
└──────────────────────────┼───────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              CONTEXT COLLECTOR (Event Index)                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  ContextRegistry: Real-time event index                   │  │
│  │  - TaskCreated, TaskUpdated, TaskCompleted              │  │
│  │  - PlaybookExecuted, WorkflowStageChanged                │  │
│  │  - CalendarEventScheduled, OrderAccepted                 │  │
│  │  - TeamCapacityChanged, BlockerResolved                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  ContextSnapshot: Time-windowed aggregations            │  │
│  │  - Last 7 days of task completions                        │  │
│  │  - Active workflows with current stage status            │  │
│  │  - Upcoming calendar events (next 14 days)              │  │
│  │  - Team workload snapshots                               │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────────────────────┬───────────────────────────────────────┘
                            │
                            │ Query Context
                            │ (when LLM analysis runs)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│              CONTEXT AGGREGATOR                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  collectContextForLLM():                                 │  │
│  │  1. Query ContextRegistry for relevant events             │  │
│  │  2. Aggregate ContextSnapshots                            │  │
│  │  3. Normalize and summarize data                          │  │
│  │  4. Apply equal weighting across all sources              │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────────────────────┬───────────────────────────────────────┘
                            │
                            │ Normalized Context Data
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│              PROMPT BUILDER                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  buildTaskAnalysisPrompt(context, options):             │  │
│  │  1. Use Reference Library for schemas/examples           │  │
│  │  2. Inject context data into prompt structure             │  │
│  │  3. Include optimization goal weights                      │  │
│  │  4. Add few-shot examples from reference library          │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────────────────────┬───────────────────────────────────────┘
                            │
                            │ Optimized Prompt
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│              LLM API CALL                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Together.ai - openai/gpt-oss-20b                       │  │
│  │  - System prompt (from Prompt Builder)                   │  │
│  │  - Context data (from Context Aggregator)                │  │
│  │  - Returns: Suggestions + Optimizations                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### 1. Context Registry (Event-Driven Index)

**Location**: `lib/tasks-v2/llm-analysis/contextRegistry.ts`

**Purpose**: Real-time event index that features write to whenever something changes.

**Architecture**:
```typescript
interface ContextEvent {
  id: string
  type: ContextEventType
  timestamp: ISODateTime
  source: 'tasks' | 'playbooks' | 'workflows' | 'calendar' | 'orders' | 'teams'
  entityId: string
  entityType: string
  action: 'created' | 'updated' | 'completed' | 'blocked' | 'resolved' | ...
  data: Record<string, any>  // Event-specific payload
  metadata: {
    userId?: string
    teamId?: string
    linkedEntityIds?: string[]  // Related entities
  }
}

type ContextEventType =
  | 'task.created'
  | 'task.updated'
  | 'task.completed'
  | 'task.blocked'
  | 'task.rescheduled'
  | 'playbook.executed'
  | 'workflow.stage_changed'
  | 'calendar.event_scheduled'
  | 'order.accepted'
  | 'order.completed'
  | 'team.capacity_changed'
  | 'dependency.resolved'
  // ... etc
```

**Key Methods**:
- `registerEvent(event: ContextEvent)` - Features call this to write events
- `queryEvents(filters: EventFilters)` - Query events by type, time range, entity
- `getRecentEvents(window: TimeWindow)` - Get events in time window

**How Features Write to It**:

Every feature in the application should emit events:

```typescript
// Example: When a task is created (in task creation flow)
import { contextRegistry } from '@/lib/tasks-v2/llm-analysis/contextRegistry'

async function createTask(taskData: TaskCreationInput) {
  const task = await db.tasks.create(taskData)
  
  // Write to context registry
  await contextRegistry.registerEvent({
    type: 'task.created',
    source: 'tasks',
    entityId: task.id,
    entityType: 'task',
    action: 'created',
    data: {
      title: task.title,
      priority: task.priority,
      teamId: task.owningTeamId,
      dueDate: task.dueWindow?.end,
      assignees: task.assignments.map(a => a.userId)
    },
    metadata: {
      userId: currentUser.id,
      teamId: task.owningTeamId
    }
  })
  
  return task
}

// Example: When a workflow stage changes
async function moveItemToStage(itemId: string, stageId: string) {
  await db.items.update(itemId, { currentStageId: stageId })
  
  await contextRegistry.registerEvent({
    type: 'workflow.stage_changed',
    source: 'workflows',
    entityId: itemId,
    entityType: 'item',
    action: 'updated',
    data: {
      workflowId: workflow.id,
      previousStageId: item.currentStageId,
      newStageId: stageId,
      itemCode: item.code
    },
    metadata: {
      linkedEntityIds: [workflow.id, item.orderId]
    }
  })
}
```

### 2. Context Snapshot (Time-Windowed Aggregations)

**Location**: `lib/tasks-v2/llm-analysis/contextSnapshot.ts`

**Purpose**: Pre-computed aggregations of context data for efficient querying.

**Architecture**:
```typescript
interface ContextSnapshot {
  id: string
  snapshotType: 'tasks' | 'workflows' | 'calendar' | 'teams' | 'playbooks'
  windowStart: ISODateTime
  windowEnd: ISODateTime
  data: {
    // Snapshot-specific aggregated data
    activeTasks: TaskSummary[]
    completedTasksLast7Days: TaskSummary[]
    upcomingDeadlines: CalendarEventSummary[]
    activeWorkflows: WorkflowSummary[]
    teamWorkloads: TeamWorkloadSummary[]
    // ... etc
  }
  computedAt: ISODateTime
  ttl: number  // Time to live (refresh interval)
}

// Snapshots are periodically refreshed or on-demand
```

**Refresh Strategy**:
- **On-demand**: When LLM analysis runs, refresh if snapshot is stale
- **Periodic**: Background job refreshes snapshots every hour
- **Event-driven**: Invalidate snapshot when relevant events occur

### 3. Context Aggregator (Query & Normalize)

**Location**: `lib/tasks-v2/llm-analysis/contextCollector.ts`

**Purpose**: Collects and normalizes context from registry + snapshots for LLM consumption.

**Key Method**:
```typescript
async function collectContextForLLM(options: {
  timeHorizon?: number  // Days to look ahead/back
  teamIds?: string[]   // Filter by teams
  includeTypes?: ContextEventType[]  // Filter event types
}): Promise<LLMContext> {
  
  // 1. Query recent events from registry
  const recentEvents = await contextRegistry.queryEvents({
    since: subDays(now(), options.timeHorizon || 7),
    types: options.includeTypes,
    teamIds: options.teamIds
  })
  
  // 2. Get or refresh snapshots
  const taskSnapshot = await getOrRefreshSnapshot('tasks', {
    window: { start: subDays(now(), 7), end: addDays(now(), 14) }
  })
  const workflowSnapshot = await getOrRefreshSnapshot('workflows')
  const calendarSnapshot = await getOrRefreshSnapshot('calendar')
  const teamSnapshot = await getOrRefreshSnapshot('teams')
  const playbookSnapshot = await getOrRefreshSnapshot('playbooks')
  
  // 3. Normalize and summarize
  return {
    // Equal weighting across all sources
    tasks: normalizeTaskContext(recentEvents, taskSnapshot),
    workflows: normalizeWorkflowContext(workflowSnapshot),
    calendar: normalizeCalendarContext(calendarSnapshot),
    teams: normalizeTeamContext(teamSnapshot),
    playbooks: normalizePlaybookContext(playbookSnapshot),
    
    // Metadata
    collectedAt: now(),
    timeHorizon: options.timeHorizon || 7,
    totalEvents: recentEvents.length
  }
}
```

**Normalization Strategy**:
- Summarize high-volume data (don't send 1000 tasks, send summaries)
- Extract key insights (bottlenecks, patterns, opportunities)
- Equal weighting: All sources contribute equally to the prompt
- Token optimization: Keep context under 4000 tokens for OSS 20B

### 4. Reference Library Integration

**Location**: `lib/llm/references/`

**Purpose**: Provides schemas, examples, patterns, and mappings for prompt building.

**How It's Used**:
```typescript
import { 
  getTaskExamples,
  getOptimizationPatterns,
  TASK_PRIORITY_ENUMS,
  TASK_STATUS_ENUMS
} from '@/lib/llm/references/contexts affinities/tasks'

function buildTaskAnalysisPrompt(context: LLMContext, options: PromptOptions) {
  // 1. Base system prompt with business context
  const systemPrompt = `You are an expert operations analyst...`
  
  // 2. Inject reference library examples
  const examples = getTaskExamples(options.exampleCount || 2)
  const examplesText = examples.map(ex => 
    `Example: ${ex.input} → ${JSON.stringify(ex.output)}`
  ).join('\n')
  
  // 3. Add patterns from reference library
  const patterns = getOptimizationPatterns()
  
  // 4. Build full prompt
  return `${systemPrompt}

Reference Examples:
${examplesText}

Common Patterns:
${patterns}

Current Context:
${JSON.stringify(context, null, 2)}`
}
```

**Reference Library Structure** (extends existing):
```
lib/llm/references/
├── contexts/
│   ├── tasks/              # NEW: Task-specific references
│   │   ├── enums.ts       # TaskPriority, TaskStatus, etc.
│   │   ├── mappings.ts    # NL → task attribute mappings
│   │   ├── examples.ts    # Few-shot examples for task suggestions
│   │   ├── patterns.ts    # Common optimization patterns
│   │   └── prompt-builder.ts
│   ├── operations/        # Existing
│   ├── workflows/         # Existing
│   └── ...
```

### 5. Prompt Builder

**Location**: `lib/tasks-v2/llm-analysis/prompts.ts`

**Purpose**: Builds optimized prompts using context + reference library.

**Architecture**:
```typescript
interface PromptConfig {
  strategy: 'minimal' | 'optimized' | 'few_shot'
  optimizationWeights: {
    capacityUtilization: number    // 0-1
    timelineOptimization: number    // 0-1
    processEfficiency: number      // 0-1
  }
  includeExamples: boolean
  includePatterns: boolean
}

function buildTaskAnalysisPrompt(
  context: LLMContext,
  config: PromptConfig
): { systemPrompt: string; userMessage: string } {
  
  // 1. System prompt with business context
  const systemPrompt = buildSystemPrompt(config)
  
  // 2. Context summary (normalized)
  const contextSummary = summarizeContextForPrompt(context)
  
  // 3. User message with context
  const userMessage = `Analyze the following operational context and provide:
1. New task suggestions (with rationale)
2. Task optimizations (reschedule, reassign, reprioritize)

Context:
${contextSummary}`

  return { systemPrompt, userMessage }
}
```

## Production Integration Strategy

### Phase 1: Event Emission Points

Every feature that creates/modifies relevant data should emit events:

**Tasks Module** (`lib/tasks-v2/`):
- Task created → `task.created`
- Task updated → `task.updated`
- Task completed → `task.completed`
- Task blocked → `task.blocked`
- Task assigned → `task.assigned`

**Playbooks Module** (`lib/playbooks/`):
- Playbook executed → `playbook.executed`
- Play triggered → `play.triggered`

**Workflows Module** (`lib/workflows-v3/`):
- Stage changed → `workflow.stage_changed`
- Item moved → `workflow.item_moved`

**Calendar Module** (`lib/data/floorCalendar.ts`):
- Event scheduled → `calendar.event_scheduled`
- Event updated → `calendar.event_updated`

**Orders Module** (`lib/orders-v2/`):
- Order accepted → `order.accepted`
- Order completed → `order.completed`

**Teams Module** (`lib/data/teams.ts`):
- Capacity changed → `team.capacity_changed`
- Member assigned → `team.member_assigned`

### Phase 2: Registry Implementation

Start with in-memory registry, evolve to persistent storage:

```typescript
// lib/tasks-v2/llm-analysis/contextRegistry.ts

class ContextRegistry {
  private events: Map<string, ContextEvent[]> = new Map()
  private snapshots: Map<string, ContextSnapshot> = new Map()
  
  async registerEvent(event: ContextEvent) {
    // Store event
    const key = `${event.type}:${event.entityId}`
    if (!this.events.has(key)) {
      this.events.set(key, [])
    }
    this.events.get(key)!.push(event)
    
    // Invalidate relevant snapshots
    this.invalidateSnapshots(event.type)
    
    // In production: Also write to persistent storage (Convex/DB)
  }
  
  async queryEvents(filters: EventFilters): Promise<ContextEvent[]> {
    // Query in-memory or persistent storage
  }
}
```

### Phase 3: Reference Library Extensions

Extend existing reference library with task-specific content:

- `lib/llm/references/contexts/tasks/enums.ts` - Task enums
- `lib/llm/references/contexts/tasks/examples.ts` - Task suggestion examples
- `lib/llm/references/contexts/tasks/patterns.ts` - Optimization patterns
- `lib/llm/references/contexts/tasks/prompt-builder.ts` - Task prompt builder

## Data Flow Example

**Scenario**: LLM analysis is triggered (daily schedule or manual refresh)

1. **Trigger**: `/api/tasks-v2/llm-suggest` is called
2. **Context Collection**: 
   ```typescript
   const context = await collectContextForLLM({
     timeHorizon: 14,  // Look 14 days ahead
     teamIds: undefined  // All teams
   })
   ```
3. **Prompt Building**:
   ```typescript
   const prompt = buildTaskAnalysisPrompt(context, {
     strategy: 'optimized',
     optimizationWeights: {
       capacityUtilization: 0.4,
       timelineOptimization: 0.4,
       processEfficiency: 0.2
     }
   })
   ```
4. **LLM Call**:
   ```typescript
   const response = await together.chat.completions.create({
     model: 'openai/gpt-oss-20b',
     messages: [
       { role: 'system', content: prompt.systemPrompt },
       { role: 'user', content: prompt.userMessage }
     ]
   })
   ```
5. **Response Processing**:
   ```typescript
   const { suggestions, optimizations } = parseLLMResponse(response)
   await suggestionStore.save(suggestions, optimizations)
   ```

## Key Benefits

1. **Real-time Updates**: Features write events immediately, context is always current
2. **Efficient Queries**: Snapshots pre-aggregate data, avoid expensive queries
3. **Scalable**: Event-driven architecture scales with application growth
4. **Extensible**: New features just need to emit events
5. **Token Optimized**: Normalization keeps LLM context manageable
6. **Reference-Driven**: Leverages existing reference library patterns

## Migration Path

1. **MVP**: In-memory registry, manual event emission in key features
2. **Beta**: Persistent storage, more comprehensive event coverage
3. **Production**: Full event coverage, optimized snapshots, caching layer

