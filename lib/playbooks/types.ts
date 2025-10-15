// Playbooks System Types
// Automation layer between workflows and tasks

export type UUID = string
export type ISODateTime = string

// ============================================================================
// Trigger Types
// ============================================================================

export type TriggerType =
  | "workflow_stage_change"
  | "task_completion"
  | "order_accepted"
  | "order_completed"
  | "date_based"
  | "time_based"
  | "capacity_based"
  | "order_completion_previous"

export type WorkflowStageTrigger = {
  type: "workflow_stage_change"
  workflowId: string
  workflowName: string
  stageId: string
  stageName: string
  condition: "enters" | "exits" | "completes"
}

export type TaskCompletionTrigger = {
  type: "task_completion"
  taskId?: string
  taskTitle?: string
  taskSource?: "manual" | "planner" | "workflow" | "order" | "automation" | "playbook"
  anyTaskMatching?: {
    titleContains?: string
    tags?: string[]
    teamId?: string
  }
}

export type OrderAcceptedTrigger = {
  type: "order_accepted"
  // No additional configuration needed
}

export type OrderCompletedTrigger = {
  type: "order_completed"
  orderId?: string // Specific order, or any order if not specified
}

export type DateBasedTrigger = {
  type: "date_based"
  mode: "specific_date" | "relative_to_order"
  specificDate?: ISODateTime
  relativeOffset?: {
    days: number
    relativeTo: "order_accepted" | "order_start" | "order_due"
  }
}

export type TimeBasedTrigger = {
  type: "time_based"
  frequency: "daily" | "weekly" | "monthly"
  time: string // "09:00"
  weekday?: number // 0-6 for weekly
  dayOfMonth?: number // 1-31 for monthly
  timezone: string
}

export type CapacityBasedTrigger = {
  type: "capacity_based"
  teamId: string
  teamName: string
  thresholdType: "below" | "above"
  thresholdPercent: number // 0-100
}

export type OrderCompletionPreviousTrigger = {
  type: "order_completion_previous"
  lookbackOrders: number // How many orders back (1 = previous order)
}

export type TriggerCondition =
  | WorkflowStageTrigger
  | TaskCompletionTrigger
  | OrderAcceptedTrigger
  | OrderCompletedTrigger
  | DateBasedTrigger
  | TimeBasedTrigger
  | CapacityBasedTrigger
  | OrderCompletionPreviousTrigger

// ============================================================================
// Assignment Types
// ============================================================================

export type AssignmentType = "specific_people" | "role_team"

export type SpecificPersonAssignment = {
  type: "specific_people"
  userIds: UUID[]
}

export type RoleTeamAssignment = {
  type: "role_team"
  mode: "team" | "role"
  teamId?: string
  teamName?: string
  roleId?: string
  roleName?: string
}

export type PlayAssignment = SpecificPersonAssignment | RoleTeamAssignment

// ============================================================================
// Task Priority from tasks-v2
// ============================================================================

export type TaskPriority = "critical" | "high" | "medium" | "low"

// ============================================================================
// Play Dependency
// ============================================================================

export type PlayDependency = {
  playId: UUID
  playTitle: string
  type: "finish_to_start" // Only this type for v1, more types later
}

// ============================================================================
// Play (Individual Rule)
// ============================================================================

export interface Play {
  id: UUID
  playbookId: UUID
  sequence: number // Order in playbook
  
  // Basic info
  title: string
  description?: string
  
  // Trigger configuration
  trigger: TriggerCondition
  
  // Task template (what gets created)
  taskTemplate: {
    title: string
    description?: string
    priority: TaskPriority
    estimatedMinutes?: number
    tags?: string[]
  }
  
  // Assignments
  assignment: PlayAssignment
  
  // Dependencies (other plays that must complete first)
  dependencies: PlayDependency[]
  
  // Status
  enabled: boolean
  
  // Metadata
  createdAt: ISODateTime
  updatedAt: ISODateTime
  createdBy: UUID
}

// ============================================================================
// Playbook (Container)
// ============================================================================

export interface Playbook {
  id: UUID
  name: string
  description?: string
  
  // Plays in this playbook
  plays: Play[]
  
  // Status
  active: boolean
  
  // Scope (for future filtering)
  scope?: {
    workflowIds?: string[] // Which workflows this applies to
    orderTypes?: string[] // Which order types
  }
  
  // Metadata
  createdAt: ISODateTime
  updatedAt: ISODateTime
  createdBy: UUID
  lastModifiedBy: UUID
}

// ============================================================================
// Helper Types for UI
// ============================================================================

export interface PlaybookSummary {
  id: UUID
  name: string
  description?: string
  playCount: number
  activePlayCount: number
  active: boolean
  lastModified: ISODateTime
  // Analytics
  totalTasksCreated?: number
  completedTasks?: number
  averageTaskCompletionTime?: number // in minutes
  peopleInvolved?: number // unique people assigned
  efficiencyScore?: number // 0-100
  recentExecutions?: number // executions in last 30 days
}

export interface TriggerTypeOption {
  value: TriggerType
  label: string
  description: string
  icon: string // Lucide icon name
  category: "workflow" | "task" | "order" | "time" | "resource"
}

// ============================================================================
// Creation Input Types
// ============================================================================

export interface PlayCreationInput {
  title: string
  trigger: TriggerCondition
  taskTemplate: Play["taskTemplate"]
  assignment: PlayAssignment
  dependencies?: PlayDependency[]
  enabled?: boolean
}

export interface PlaybookCreationInput {
  name: string
  description?: string
  plays?: PlayCreationInput[]
  active?: boolean
}

// ============================================================================
// Execution Context (for future backend)
// ============================================================================

export interface PlaybookExecutionContext {
  playbookId: UUID
  playId: UUID
  triggeredBy: TriggerCondition
  triggeredAt: ISODateTime
  contextData: {
    orderId?: string
    itemId?: string
    workflowId?: string
    stageId?: string
    taskId?: string
    [key: string]: unknown
  }
}

// ============================================================================
// Integration with tasks-v2
// ============================================================================

// Tasks created by playbooks will use TaskCreationInput from tasks-v2/types.ts
// with these specific values:
// - source: "automation" (from TaskSource union)
// - contexts: Will include playbook/play references
// - Additional metadata will store playbookId and playId

