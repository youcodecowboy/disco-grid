// Dependency Type Definitions for Workflows V3

import type { StageDependencyType } from "./types"

export interface DependencyTypeDefinition {
  type: StageDependencyType
  label: string
  description: string
  icon: string // Lucide icon name
  configFields: string[]
  examples: string[]
}

export const DEPENDENCY_TYPES: Record<StageDependencyType, DependencyTypeDefinition> = {
  task_completion: {
    type: "task_completion",
    label: "Task Completion",
    description: "This stage cannot start until a specific task is completed",
    icon: "CheckSquare",
    configFields: ["taskTitle", "taskTags", "taskSource"],
    examples: [
      "Cannot start cutting until fabric inspection task is complete",
      "Must complete order review task before production begins",
      "Requires material preparation task to be finished"
    ]
  },
  
  task_creation: {
    type: "task_creation",
    label: "Task Creation",
    description: "A task must be created before this stage can start",
    icon: "PlusSquare",
    configFields: ["taskTitle", "assignedTo", "priority"],
    examples: [
      "Create purchase order task before starting production",
      "Generate quality inspection task when stage begins",
      "Create machine setup task as prerequisite"
    ]
  },
  
  approval: {
    type: "approval",
    label: "Approval Required",
    description: "Manager or supervisor must approve before proceeding",
    icon: "UserCheck",
    configFields: ["approverRole", "approverUser", "notificationMessage"],
    examples: [
      "Manager must approve before moving to next stage",
      "Quality supervisor sign-off required",
      "Client approval needed to proceed"
    ]
  },
  
  event_completion: {
    type: "event_completion",
    label: "Event Completion",
    description: "A planner event must be completed",
    icon: "Calendar",
    configFields: ["eventTitle", "eventType"],
    examples: [
      "Material delivery event must complete",
      "Machine maintenance event must be finished",
      "Training session must be completed"
    ]
  },
  
  time_based: {
    type: "time_based",
    label: "Time Delay",
    description: "Must wait X time after previous stage",
    icon: "Clock",
    configFields: ["delayAmount", "delayUnit"],
    examples: [
      "Wait 24 hours for fabric to rest",
      "Allow 2 hours for dye to cure",
      "Wait 15 minutes for adhesive to set"
    ]
  },
  
  capacity_based: {
    type: "capacity_based",
    label: "Capacity Check",
    description: "Team must have sufficient capacity available",
    icon: "Users",
    configFields: ["teamId", "teamName", "requiredCapacity", "thresholdPercent"],
    examples: [
      "Sewing team must have 50% capacity available",
      "Cutting team must have at least 30% bandwidth",
      "Quality team must have capacity for inspection"
    ]
  },
  
  component_completion: {
    type: "component_completion",
    label: "Component Completion",
    description: "All component items must complete this stage first",
    icon: "Layers",
    configFields: ["componentStageId", "allComponentsRequired"],
    examples: [
      "All jacket pieces must complete sewing before assembly",
      "Both leather and denim halves must be finished",
      "All components must pass QC before final assembly"
    ]
  },
  
  quantity_threshold: {
    type: "quantity_threshold",
    label: "Quantity Threshold",
    description: "X number of items must complete previous stage",
    icon: "Hash",
    configFields: ["quantity", "previousStageId"],
    examples: [
      "500 items must complete cutting before starting batch sewing",
      "100 units must finish assembly before packaging begins",
      "Full batch must complete washing before inspection"
    ]
  },
  
  custom_condition: {
    type: "custom_condition",
    label: "Custom Condition",
    description: "Item must meet custom attribute conditions",
    icon: "Filter",
    configFields: ["attributeName", "operator", "value"],
    examples: [
      "Only items with fabric type = 'denim' need washing",
      "Items with priority = 'urgent' skip queue",
      "Only items with color = 'custom' need dyeing"
    ]
  }
}

// Helper function to get dependency type definition
export function getDependencyType(type: StageDependencyType): DependencyTypeDefinition {
  return DEPENDENCY_TYPES[type]
}

// Helper function to get all dependency types as array
export function getAllDependencyTypes(): DependencyTypeDefinition[] {
  return Object.values(DEPENDENCY_TYPES)
}

// Helper function to get dependency icon name
export function getDependencyIcon(type: StageDependencyType): string {
  return DEPENDENCY_TYPES[type].icon
}

// Helper function to format dependency for display
export function formatDependencyDescription(type: StageDependencyType, description?: string): string {
  const def = DEPENDENCY_TYPES[type]
  return description || def.description
}





