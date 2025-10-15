# Playbooks System

**Status**: Active Development  
**Version**: 1.0  
**Last Updated**: October 14, 2025

## Overview

The Playbooks system is an automation layer that sits between Workflows (stage tracking) and Tasks (detailed work items). It enables factory managers to define repeatable sets of tasks that automatically trigger based on events like workflow stage changes, order acceptance, task completion, dates, capacity thresholds, and more.

## Problem Statement

In manufacturing, many tasks are predictable and repeatable:
- When an order is accepted, someone needs to order fabric, trims, finalize patterns, etc.
- When items enter the "Cutting" stage, thread colors need changing, fabric needs resting, shrinkage tests must be performed
- Weekly maintenance routines need scheduling
- Capacity-based staffing adjustments are required

Manually creating these tasks for every order is tedious and error-prone. **Playbooks solve this by automating task creation through trigger-based rules.**

## Core Concepts

### Playbook
A container for related automation rules. Examples:
- "Order Acceptance Playbook"
- "Cutting Stage Playbook"
- "Weekly Maintenance Routines"

**Properties**:
- Name and description
- Active/inactive status
- Collection of plays
- Optional scope (which workflows/order types it applies to)

### Play
An individual automation rule within a playbook. Each play defines:
- **Trigger**: What event activates this play
- **Task Template**: What task should be created (title, description, priority)
- **Assignment**: Who should be assigned (specific people or roles/teams)
- **Dependencies**: Other plays that must complete first
- **Enabled/disabled**: Individual play on/off switch

### Trigger Types

#### 1. Workflow Stage Change
```typescript
{
  type: "workflow_stage_change",
  workflowId: "wf-cut-sew-v4",
  workflowName: "Cut & Sew Apparel v4",
  stageId: "stage-cutting",
  stageName: "Cutting",
  condition: "enters" | "exits" | "completes"
}
```
**Use case**: "When items enter the Cutting stage, create task to change thread colors"

#### 2. Task Completion
```typescript
{
  type: "task_completion",
  taskTitle: "Finalize and grade pattern"
}
```
**Use case**: "When pattern grading completes, create task to print patterns"

#### 3. Order Accepted
```typescript
{
  type: "order_accepted"
}
```
**Use case**: "When order is accepted, create tasks to order fabric and trims"

#### 4. Order Completed
```typescript
{
  type: "order_completed",
  orderId?: string  // Optional: specific order or any order
}
```
**Use case**: "When order completes, create follow-up quality review task"

#### 5. Date-Based
```typescript
{
  type: "date_based",
  mode: "relative_to_order",
  relativeOffset: {
    days: 3,
    relativeTo: "order_accepted"
  }
}
```
**Use case**: "3 days after order acceptance, create fabric inspection task"

#### 6. Time-Based
```typescript
{
  type: "time_based",
  frequency: "weekly",
  time: "07:00",
  weekday: 1,  // Monday
  timezone: "America/New_York"
}
```
**Use case**: "Every Monday at 7am, create machine maintenance task"

#### 7. Capacity-Based
```typescript
{
  type: "capacity_based",
  teamId: "team-cutting",
  teamName: "Cutting Team",
  thresholdType: "below",
  thresholdPercent: 50
}
```
**Use case**: "When Cutting Team capacity drops below 50%, create task to adjust staffing"

#### 8. Previous Order Completion
```typescript
{
  type: "order_completion_previous",
  lookbackOrders: 1  // 1 = immediately previous order
}
```
**Use case**: "When previous order completes, create task to prepare production line for next order"

## Integration with Tasks v2

### Task Creation Flow

When a play's trigger conditions are met (executed by backend/Convex):

1. **Map Play to TaskCreationInput**:
```typescript
const taskInput: TaskCreationInput = {
  title: play.taskTemplate.title,
  description: play.taskTemplate.description,
  priority: play.taskTemplate.priority,
  source: "automation",  // Important: indicates playbook-created
  estimatedMinutes: play.taskTemplate.estimatedMinutes,
  tags: [...play.taskTemplate.tags, "playbook-generated"],
  
  // Context linking
  contexts: [
    {
      id: generateId(),
      taskId: taskId,
      type: "custom",
      referenceId: play.playbookId,
      label: `Playbook: ${playbookName}`,
      role: "supporting",
      metadata: {
        playbookId: play.playbookId,
        playbookName: playbookName,
        playId: play.id,
        playTitle: play.title,
        triggeredBy: triggerCondition,
        triggeredAt: timestamp
      }
    },
    // ... additional contexts based on trigger
    // (e.g., order context, item context, workflow context)
  ],
  
  // Assignment resolution
  assignments: resolveAssignments(play.assignment),
  
  // Dependencies
  dependencies: play.dependencies.map(dep => ({
    taskId: newTaskId,
    dependsOn: resolvePlayDependency(dep.playId),
    type: "finish_to_start"
  }))
}
```

2. **Resolve Assignments**:
   - **Specific People**: Direct mapping to user IDs
   - **Role/Team**: Query active users with matching role or team membership at execution time

3. **Create Task**: Insert into tasks database with `source: "automation"`

4. **Link Dependencies**: If play has dependencies on other plays, map those to task dependencies

### Traceability

Every task created by a playbook maintains full traceability:

**In Task metadata**:
- `source: "automation"` identifies playbook-generated tasks
- `contexts` array includes playbook/play reference
- Tags include "playbook-generated"

**Metadata stored**:
```typescript
{
  playbookId: "playbook-001",
  playbookName: "Order Acceptance Playbook",
  playId: "play-003",
  playTitle: "Finalize and grade pattern",
  triggeredBy: { type: "order_accepted", ... },
  triggeredAt: "2025-10-14T10:30:00Z"
}
```

**Benefits**:
- Audit trail: Know which playbook created which tasks
- Analytics: Track playbook effectiveness (task completion rates)
- Debugging: Identify which triggers fired and when
- Rollback: Ability to disable playbooks and identify affected tasks

## Backend Execution Strategy

### Trigger Monitoring (Convex Implementation)

**Event-Driven Architecture**:

1. **Workflow Stage Changes**:
   - Listen to workflow state transitions
   - When item moves stages, query active playbooks with matching stage triggers
   - Execute plays for each match

2. **Task Completions**:
   - Subscribe to task status changes
   - When task moves to "completed", check for playbooks waiting on that task
   - Execute dependent plays

3. **Order Events**:
   - Monitor order status changes
   - On "accepted" or "completed", query playbooks with order triggers
   - Execute all matching plays

4. **Date/Time-Based**:
   - Scheduled jobs (cron-like) check for due plays
   - Calculate relative dates based on order/item dates
   - Execute plays when time conditions met

5. **Capacity-Based**:
   - Monitor team workload metrics
   - When capacity crosses thresholds, evaluate playbooks
   - Execute capacity-triggered plays

### Execution Engine (Pseudocode)

```typescript
async function executePlay(
  play: Play,
  context: ExecutionContext
): Promise<Task> {
  // 1. Validate trigger conditions still met
  if (!validateTrigger(play.trigger, context)) {
    log("Trigger conditions not met, skipping")
    return null
  }
  
  // 2. Check dependencies
  const dependenciesMet = await checkDependencies(play.dependencies, context)
  if (!dependenciesMet) {
    log("Dependencies not satisfied, deferring")
    return null
  }
  
  // 3. Resolve assignments
  const assignments = await resolveAssignments(
    play.assignment,
    context
  )
  
  if (assignments.length === 0) {
    log("No assignees found, skipping")
    return null
  }
  
  // 4. Build task
  const task = buildTaskFromPlay(play, context, assignments)
  
  // 5. Create task
  const createdTask = await createTask(task)
  
  // 6. Log execution
  await logPlayExecution(play.id, createdTask.id, context)
  
  return createdTask
}
```

### Role/Team Resolution

**At Execution Time** (not at playbook creation):

```typescript
async function resolveAssignments(
  assignment: PlayAssignment,
  context: ExecutionContext
): Promise<TaskAssignment[]> {
  if (assignment.type === "specific_people") {
    // Direct mapping
    return assignment.userIds.map(userId => ({
      taskId: context.taskId,
      userId: userId,
      role: "owner",
      requiredAck: false
    }))
  }
  
  if (assignment.type === "role_team") {
    if (assignment.mode === "team") {
      // Get active team members
      const teamMembers = await getActiveTeamMembers(assignment.teamId)
      return teamMembers.map(member => ({
        taskId: context.taskId,
        userId: member.id,
        role: "collaborator",
        requiredAck: false
      }))
    }
    
    if (assignment.mode === "role") {
      // Get users with role
      const usersWithRole = await getUsersByRole(assignment.roleId)
      
      // Optionally: Load balancing
      const assignee = selectLeastBusyUser(usersWithRole)
      
      return [{
        taskId: context.taskId,
        userId: assignee.id,
        role: "owner",
        requiredAck: true
      }]
    }
  }
  
  return []
}
```

## Data Model

See `lib/playbooks/types.ts` for full TypeScript definitions.

**Key Entities**:
- `Playbook`: Container for plays
- `Play`: Individual automation rule
- `TriggerCondition`: Union type for all trigger variants
- `PlayAssignment`: Supports specific people or roles/teams
- `PlayDependency`: Links between plays

**Storage** (Future Convex schema):
```typescript
// playbooks table
{
  _id: Id<"playbooks">,
  name: string,
  description?: string,
  active: boolean,
  scope?: { workflowIds?: string[], orderTypes?: string[] },
  createdAt: number,
  createdBy: Id<"users">
}

// plays table
{
  _id: Id<"plays">,
  playbookId: Id<"playbooks">,
  sequence: number,
  title: string,
  trigger: TriggerCondition,  // JSON
  taskTemplate: object,  // JSON
  assignment: PlayAssignment,  // JSON
  dependencies: PlayDependency[],  // JSON array
  enabled: boolean,
  createdAt: number
}

// play_executions table (audit log)
{
  _id: Id<"play_executions">,
  playId: Id<"plays">,
  playbookId: Id<"playbooks">,
  taskId: Id<"tasks">,
  triggeredBy: object,  // JSON
  triggeredAt: number,
  status: "success" | "failed" | "skipped",
  errorMessage?: string
}
```

## UI Components

### Component Architecture

```
app/playbooks/
  ├── page.tsx                    # Index page with playbook grid
  └── [id]/
      └── page.tsx                # Builder/editor page

components/playbooks/
  ├── TriggerBuilder.tsx          # Configurable trigger selector
  ├── AssignmentPicker.tsx        # People vs role/team picker
  └── PlayCard.tsx                # Individual play card component

lib/playbooks/
  ├── types.ts                    # TypeScript definitions
  └── mockData.ts                 # Mock playbooks for demo
```

### Lego-Style UI Pattern

The playbook builder uses the **Lego-style UI pattern** (see `docs/LEGO_STYLE_UI_PATTERN.md`):

- Start minimal: Just playbook name
- Add optional sections: "+ Add description"
- Add plays: "+ Add play" button
- Each play is collapsible card
- Inline expansion/removal
- No modals, everything in-document flow

## Future Enhancements

### Phase 2 (Planned)
- **Conditional Logic**: If/then branching within plays
- **Testing Mode**: Simulate playbook execution without creating tasks
- **Analytics Dashboard**: Track playbook effectiveness, task completion rates
- **Playbook Templates**: Pre-built playbooks for common scenarios
- **Bulk Operations**: Enable/disable multiple plays at once
- **Version History**: Track playbook changes over time

### Phase 3 (Possible)
- **Visual Flow Builder**: Drag-and-drop canvas for complex playbooks
- **AI Suggestions**: Recommend playbooks based on patterns
- **Cross-Playbook Dependencies**: Plays that reference other playbooks
- **Advanced Scheduling**: Blackout periods, holiday awareness
- **Multi-trigger Plays**: AND/OR logic for multiple triggers
- **External Webhooks**: Trigger plays from external systems

## Best Practices

### Playbook Design

1. **Keep Playbooks Focused**: One playbook = one workflow stage or event type
2. **Name Clearly**: "Order Acceptance Playbook", not "Playbook 1"
3. **Document Dependencies**: Use play dependencies to enforce sequence
4. **Test Assignments**: Verify roles/teams resolve to actual users
5. **Start Simple**: Add complexity gradually as needs emerge

### Play Creation

1. **Descriptive Task Titles**: Users should understand task immediately
2. **Set Realistic Durations**: Helps with capacity planning
3. **Use Appropriate Priority**: Critical → blocks production, Low → nice-to-have
4. **Leverage Tags**: Enable filtering and reporting
5. **Add Context**: Detailed descriptions help assignees complete tasks

### Maintenance

1. **Review Regularly**: Disable outdated plays
2. **Monitor Execution**: Check play_executions logs for failures
3. **Update Assignments**: As teams change, update role/team assignments
4. **Version Control**: Document major playbook changes
5. **Gather Feedback**: Ask users which automated tasks are helpful

## Support & Troubleshooting

### Common Issues

**Play not triggering**:
- Check playbook is active
- Check play is enabled
- Verify trigger conditions match actual events
- Review execution logs for errors

**Wrong people assigned**:
- Check role/team membership
- Verify assignment resolution logic
- Consider using specific people for critical tasks

**Too many tasks created**:
- Review trigger conditions (too broad?)
- Check for duplicate plays
- Consider adding dependencies to sequence tasks

**Tasks missing context**:
- Ensure triggers properly capture context data
- Verify context linking in execution engine
- Check task metadata includes playbook references

## Related Systems

- **Workflows**: High-level stage tracking (`docs/workflow-v2-manual-builder.md`)
- **Tasks v2**: Detailed work item management (`docs/taskmaster.md`)
- **Items**: Production tracking (`docs/ITEMS_DATA_MODEL.md`)
- **Orders**: Order lifecycle (`docs/orders-page-system.md`)

## Glossary

- **Playbook**: Container for automation rules
- **Play**: Individual rule that creates a task when triggered
- **Trigger**: Event that activates a play
- **Assignment Resolution**: Converting roles/teams to actual users at runtime
- **Play Dependency**: Requirement that one play completes before another executes
- **Execution Context**: Data available when play triggers (order ID, item ID, etc.)

---

**Maintainer**: Groovy Team  
**Feedback**: Submit issues or suggestions via the feedback system

