// Workflows V3 Types
// Form-based workflow creation with natural language LLM input

export type UUID = string
export type ISODateTime = string

// ============================================================================
// Core Workflow Types
// ============================================================================

export interface WorkflowV3 {
  id: UUID
  name: string
  description?: string
  industry?: string
  
  // Status
  active: boolean
  clientId?: UUID // Brand/client this workflow is for
  clientName?: string
  
  // Stages
  stages: WorkflowStageV3[]
  limboZones: LimboZone[]
  
  // Analytics
  lastExecutionAt?: ISODateTime // Last time a stage was executed
  activeItemCount: number // Items currently in this workflow
  totalExecutions: number
  completionRate?: number // Percentage of items that complete
  averageDuration?: number // Average time to complete workflow (minutes)
  
  // Metadata
  createdAt: ISODateTime
  updatedAt: ISODateTime
  createdBy: UUID
}

export interface WorkflowStageV3 {
  id: UUID
  workflowId: UUID
  sequence: number
  
  // Core identity
  name: string
  description?: string
  icon?: string
  color?: string
  type: "sequential" | "parallel"
  parallelWith?: UUID[] // Stage IDs if parallel
  
  // Section 1: Stage Info
  happensBefore?: UUID[] // Stage IDs
  happensAfter?: UUID[] // Stage IDs
  
  // Section 2: Inputs (to BEGIN stage)
  inputs: StageInput[]
  
  // Section 3: Dependencies (CORE)
  dependencies: StageDependency[]
  
  // Section 4: Outputs (to COMPLETE stage)
  outputs: StageOutput[]
  
  // Team assignment
  assignedTeam?: string
  assignedTeamId?: UUID
  assignedRole?: string
  
  // Timing
  estimatedDuration?: number // Minutes
  
  // UI state
  isExpanded: boolean
  isComplete: boolean // Configuration complete
  
  // Metadata
  createdAt: ISODateTime
  updatedAt: ISODateTime
}

// ============================================================================
// Stage Input Types
// ============================================================================

export type StageInputType = 
  | "qr_scan"
  | "form"
  | "photo"
  | "location_check"
  | "time_delay"

export interface StageInput {
  id: UUID
  type: StageInputType
  label: string
  required: boolean
  validation?: any
  placeholder?: string
}

// ============================================================================
// Stage Dependency Types
// ============================================================================

export type StageDependencyType = 
  | "task_completion"
  | "task_creation"
  | "approval"
  | "event_completion"
  | "time_based"
  | "capacity_based"
  | "component_completion"
  | "quantity_threshold"
  | "custom_condition"

export interface StageDependency {
  id: UUID
  type: StageDependencyType
  description: string
  details: DependencyDetails
  checklistItems?: string[] // Sub-requirements
}

export type DependencyDetails = 
  | TaskCompletionDetails
  | TaskCreationDetails
  | ApprovalDetails
  | EventCompletionDetails
  | TimeBasedDetails
  | CapacityBasedDetails
  | ComponentCompletionDetails
  | QuantityThresholdDetails
  | CustomConditionDetails

export interface TaskCompletionDetails {
  taskTitle?: string
  taskTags?: string[]
  taskSource?: "manual" | "planner" | "workflow" | "order" | "automation" | "playbook"
}

export interface TaskCreationDetails {
  taskTitle: string
  assignedTo?: UUID
  priority?: "critical" | "high" | "medium" | "low"
}

export interface ApprovalDetails {
  approverRole?: string
  approverUser?: UUID
  approverUserName?: string
  notificationMessage?: string
}

export interface EventCompletionDetails {
  eventTitle?: string
  eventType?: string
}

export interface TimeBasedDetails {
  delayAmount: number
  delayUnit: "minutes" | "hours" | "days"
}

export interface CapacityBasedDetails {
  teamId: UUID
  teamName: string
  requiredCapacity?: number
  thresholdPercent: number
}

export interface ComponentCompletionDetails {
  componentStageId: UUID
  allComponentsRequired: boolean
}

export interface QuantityThresholdDetails {
  quantity: number
  previousStageId: UUID
}

export interface CustomConditionDetails {
  attributeName: string
  operator: "equals" | "contains" | "greater" | "less" | "not_equals"
  value: any
}

// ============================================================================
// Stage Output Types
// ============================================================================

export type StageOutputType = 
  | "qr_scan"
  | "form_submit"
  | "photo"
  | "approval"
  | "measurement"
  | "count"
  | "sign_off"

export interface StageOutput {
  id: UUID
  type: StageOutputType
  label: string
  required: boolean
  options?: string[] // For select/radio outputs
}

// ============================================================================
// Limbo Zone
// ============================================================================

export interface LimboZone {
  id: UUID
  workflowId: UUID
  betweenStages: [UUID, UUID] // [fromStageId, toStageId]
  dependencies: StageDependency[]
  description?: string
}

// ============================================================================
// Workflow Summary (for library landing page)
// ============================================================================

export interface WorkflowV3Summary {
  id: UUID
  name: string
  description?: string
  industry?: string
  active: boolean
  clientId?: UUID
  clientName?: string
  stageCount: number
  lastExecutionAt?: ISODateTime
  activeItemCount: number
  totalExecutions: number
  completionRate?: number
  averageDuration?: number
  createdAt: ISODateTime
  updatedAt: ISODateTime
}

// ============================================================================
// LLM Generation Types
// ============================================================================

export interface WorkflowGenerationInput {
  description: string
  context?: {
    industry?: string
    clientName?: string
  }
}

export interface WorkflowGenerationResult {
  stages: GeneratedStage[]
  limboZones: GeneratedLimboZone[]
  suggestedName?: string
  suggestedIndustry?: string
}

export interface GeneratedStage {
  name: string
  sequence: number
  type: "sequential" | "parallel"
  description?: string
  suggestedTeam?: string
  suggestedInputs?: StageInputType[]
  suggestedOutputs?: StageOutputType[]
  dependencies?: GeneratedDependency[]
  parallelWith?: string[] // Stage names
}

export interface GeneratedDependency {
  type: StageDependencyType
  description: string
  details?: Partial<DependencyDetails>
}

export interface GeneratedLimboZone {
  betweenStages: [string, string] // Stage names
  dependencies: string[] // Dependency descriptions
}

// ============================================================================
// Refinement Question Types
// ============================================================================

export interface RefinementQuestion {
  id: UUID
  stageId: UUID
  type: "missing_info" | "optimization" | "dependency_hint" | "best_practice"
  question: string
  targetField: string // Which field this question aims to fill
  priority: "high" | "medium" | "low"
  answered: boolean
}

export interface RefinementAnswer {
  questionId: UUID
  answer: string
  suggestedUpdates?: Partial<WorkflowStageV3>
  confidence?: number
}

// ============================================================================
// UI Helper Types
// ============================================================================

export interface StageCardProps {
  stage: WorkflowStageV3
  allStages: WorkflowStageV3[]
  onChange: (updated: WorkflowStageV3) => void
  onRemove: () => void
  onComplete: () => void
}

export interface LimboZoneProps {
  limboZone: LimboZone
  allStages: WorkflowStageV3[]
  onChange: (updated: LimboZone) => void
}





