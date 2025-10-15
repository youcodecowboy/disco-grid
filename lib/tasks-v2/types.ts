// Taskmaster v2 - Enhanced Types
// Extended from base taskmaster.md spec with v2-specific additions

export type UUID = string
export type ISODateTime = string

export type TaskStatus =
  | "draft"
  | "scheduled"
  | "in_progress"
  | "blocked"
  | "review"
  | "completed"
  | "archived"

export type TaskPriority = "critical" | "high" | "medium" | "low"

export type TaskSource =
  | "manual"
  | "planner"
  | "workflow"
  | "order"
  | "automation"
  | "message"
  | "api"
  | "import"

export type TaskContextType =
  | "order"
  | "item"
  | "workflow"
  | "asset"
  | "team"
  | "planner_event"
  | "message"
  | "document"
  | "custom"

export interface TaskDueWindow {
  start?: ISODateTime
  end?: ISODateTime
  timezone: string
}

export interface TaskScheduleSlot {
  slotId: UUID
  calendarId: UUID
  start: ISODateTime
  end: ISODateTime
  isAllDay: boolean
  location?: string
  plannerEventId?: UUID
}

export interface TaskContextLink {
  id: UUID
  taskId: UUID
  type: TaskContextType
  referenceId: UUID
  label?: string
  role: "primary" | "supporting"
  metadata?: Record<string, unknown>
}

export interface TaskAssignment {
  taskId: UUID
  userId: UUID
  userName: string
  userAvatar?: string
  role: "owner" | "collaborator" | "watcher"
  requiredAck: boolean
  acknowledgedAt?: ISODateTime
  handoffAt?: ISODateTime
}

export interface TaskChecklistItem {
  id: UUID
  taskId: UUID
  sequence: number
  label: string
  required: boolean
  done: boolean
  ownerId?: UUID
  dueWindow?: TaskDueWindow
  blockedBy?: UUID[]
  estimatedMinutes?: number
  evidenceRequired?: boolean
}

export interface TaskArtifact {
  id: UUID
  taskId: UUID
  type: "file" | "image" | "note" | "link" | "telemetry"
  uri: string
  title?: string
  capturedBy: UUID
  capturedAt: ISODateTime
  metadata?: Record<string, unknown>
}

export interface TaskDependency {
  taskId: UUID
  dependsOn: UUID
  type: "finish_to_start" | "finish_to_finish" | "start_to_start" | "start_to_finish"
  lagMinutes?: number
}

export interface TaskBlocker {
  id: UUID
  taskId: UUID
  label: string
  description?: string
  ownerId?: UUID
  createdAt: ISODateTime
  resolvedAt?: ISODateTime
  notes?: string
}

export interface TaskSeriesRef {
  seriesId: UUID
  sequence: number
  nextInstanceAt?: ISODateTime
}

export interface Task {
  id: UUID
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  source: TaskSource
  owningTeamId?: UUID
  owningTeamLabel?: string
  owningTeamColor?: string
  createdBy: UUID
  createdAt: ISODateTime
  updatedAt: ISODateTime
  completedAt?: ISODateTime
  archivedAt?: ISODateTime
  dueWindow?: TaskDueWindow
  schedule?: TaskScheduleSlot
  contexts: TaskContextLink[]
  assignments: TaskAssignment[]
  checklist: TaskChecklistItem[]
  artifacts: TaskArtifact[]
  dependencies: TaskDependency[]
  tags: string[]
  blockers: TaskBlocker[]
  seriesRef?: TaskSeriesRef
  templateId?: UUID
  metrics?: { estimatedMinutes?: number; actualMinutes?: number; effortScore?: number }
}

// View Configuration Types
export type ViewMode = "list" | "kanban" | "timeline"

export type GroupByOption = "none" | "status" | "assignee" | "priority" | "dueDate"

export interface TableColumn {
  id: string
  label: string
  field: keyof Task | string
  visible: boolean
  width: number
  resizable: boolean
  sortable: boolean
  editable: boolean
  type: "text" | "status" | "priority" | "assignee" | "date" | "progress" | "tags" | "actions"
}

export interface ViewConfiguration {
  id: UUID
  userId: UUID
  teamId?: UUID
  viewMode: ViewMode
  groupBy: GroupByOption
  sortBy: string
  sortDirection: "asc" | "desc"
  filters: TaskFilters
  columns: TableColumn[]
  kanbanColumns?: KanbanColumn[]
  createdAt: ISODateTime
  updatedAt: ISODateTime
}

export interface TaskFilters {
  status?: TaskStatus[]
  priority?: TaskPriority[]
  assigneeIds?: UUID[]
  teamIds?: UUID[]
  tags?: string[]
  dueDateRange?: {
    start?: ISODateTime
    end?: ISODateTime
  }
  searchQuery?: string
}

export interface KanbanColumn {
  id: string
  label: string
  status: TaskStatus
  color?: string
  order: number
  taskIds: UUID[]
  collapsed: boolean
}

// Suggested Task Types
export interface SuggestedTask {
  id: UUID
  title: string
  description?: string
  rationale: string
  recommendedTeamId: UUID
  recommendedTeamLabel: string
  recommendedAssignee?: { userId: UUID; name: string; avatar?: string }
  suggestedDueDate: ISODateTime
  origin: "order" | "planner" | "signal" | "pattern" | "ai"
  expectedOutcome: string
  highlights: string[]
  confidence: number // 0-1
  linkedContext: string
  contextType: TaskContextType
  contextId: UUID
  priority: TaskPriority
  estimatedMinutes?: number
  tags?: string[]
  createdAt: ISODateTime
}

// Analytics Types
export interface TeamTaskAnalytics {
  teamId: UUID
  teamName: string
  teamColor?: string
  totalTasks: number
  activeTasks: number
  completedTasks: number
  blockedTasks: number
  overdueTasks: number
  completionRate: number // 0-100
  averageCompletionTime: number // minutes
  velocityLast7Days: number // tasks completed
  velocityLast30Days: number
  efficiencyTrend: number[] // last 7 days
  tasksByStatus: Record<TaskStatus, number>
  tasksByPriority: Record<TaskPriority, number>
  lastUpdated: ISODateTime
}

export interface PersonTaskAnalytics {
  userId: UUID
  userName: string
  userAvatar?: string
  teamId?: UUID
  activeTasks: number
  completedTasks: number
  overdueTasks: number
  completionRate: number
  averageCompletionTime: number
  workloadScore: number // 0-100, based on active tasks and deadlines
  velocityLast7Days: number
  lastCompletedAt?: ISODateTime
}

export interface SystemTaskAnalytics {
  totalTasks: number
  activeTasks: number
  completedTasks: number
  blockedTasks: number
  overdueTasks: number
  completionRate: number
  averageCompletionTime: number
  totalTeams: number
  totalAssignees: number
  suggestedTasksCount: number
  averageSuggestionConfidence: number
  teamAnalytics: TeamTaskAnalytics[]
  personAnalytics: PersonTaskAnalytics[]
  lastUpdated: ISODateTime
}

// Bulk Action Types
export interface BulkAction {
  type: "assign" | "unassign" | "status" | "priority" | "tag" | "delete" | "archive"
  taskIds: UUID[]
  payload: {
    assigneeId?: UUID
    status?: TaskStatus
    priority?: TaskPriority
    tags?: string[]
  }
}

// Task Activity Types
export interface TaskActivity {
  id: UUID
  taskId: UUID
  actorId: UUID
  actorName: string
  actorAvatar?: string
  eventType: "created" | "updated" | "assigned" | "status_changed" | "completed" | "commented" | "blocked"
  description: string
  metadata?: Record<string, unknown>
  timestamp: ISODateTime
}

// Comment Types
export interface TaskComment {
  id: UUID
  taskId: UUID
  authorId: UUID
  authorName: string
  authorAvatar?: string
  content: string
  mentions: UUID[]
  createdAt: ISODateTime
  updatedAt?: ISODateTime
  edited: boolean
}

