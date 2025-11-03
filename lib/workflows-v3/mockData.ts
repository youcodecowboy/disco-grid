// Mock Data for Workflows V3

import type { WorkflowV3, WorkflowV3Summary, WorkflowStageV3, LimboZone } from "./types"

// ============================================================================
// Mock Workflow Summaries (for library landing page)
// ============================================================================

export const MOCK_WORKFLOW_SUMMARIES: WorkflowV3Summary[] = [
  {
    id: "wf-denim-001",
    name: "Denim Manufacturing Workflow",
    description: "Complete denim production from cutting to packaging",
    industry: "Fashion Manufacturing",
    active: true,
    clientName: "Blue Denim Co.",
    stageCount: 7,
    lastExecutionAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    activeItemCount: 145,
    totalExecutions: 1250,
    completionRate: 94,
    averageDuration: 180, // 3 hours
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "wf-tshirt-001",
    name: "T-Shirt Production",
    description: "Fast production workflow for basic t-shirts",
    industry: "Fashion Manufacturing",
    active: true,
    clientName: "Basic Tees Inc.",
    stageCount: 5,
    lastExecutionAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min ago
    activeItemCount: 320,
    totalExecutions: 3400,
    completionRate: 97,
    averageDuration: 90,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "wf-jacket-001",
    name: "Leather Jacket Assembly",
    description: "Multi-component jacket with leather and denim pieces",
    industry: "Fashion Manufacturing",
    active: true,
    clientName: "Premium Outerwear",
    stageCount: 9,
    lastExecutionAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    activeItemCount: 45,
    totalExecutions: 380,
    completionRate: 91,
    averageDuration: 300,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "wf-custom-001",
    name: "Custom Order Workflow",
    description: "Flexible workflow for custom client orders",
    industry: "Fashion Manufacturing",
    active: false,
    stageCount: 6,
    lastExecutionAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    activeItemCount: 0,
    totalExecutions: 120,
    completionRate: 88,
    averageDuration: 240,
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  }
]

// ============================================================================
// Mock Full Workflows (for workflow builder)
// ============================================================================

export const MOCK_WORKFLOWS: WorkflowV3[] = [
  {
    id: "wf-denim-001",
    name: "Denim Manufacturing Workflow",
    description: "Complete denim production from cutting to packaging",
    industry: "Fashion Manufacturing",
    active: true,
    clientName: "Blue Denim Co.",
    stages: [
      {
        id: "stage-001",
        workflowId: "wf-denim-001",
        sequence: 1,
        name: "Fabric Inspection",
        description: "Inspect incoming fabric for quality",
        icon: "Eye",
        color: "#3B82F6",
        type: "sequential",
        inputs: [
          {
            id: "input-001",
            type: "qr_scan",
            label: "Scan fabric roll QR code",
            required: true
          }
        ],
        dependencies: [],
        outputs: [
          {
            id: "output-001",
            type: "form_submit",
            label: "Fabric quality report",
            required: true
          }
        ],
        assignedTeam: "Warehouse Team",
        estimatedDuration: 10,
        isExpanded: false,
        isComplete: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "stage-002",
        workflowId: "wf-denim-001",
        sequence: 2,
        name: "Cutting",
        description: "Cut fabric panels according to pattern",
        icon: "Scissors",
        color: "#8B5CF6",
        type: "sequential",
        happensAfter: ["stage-001"],
        inputs: [
          {
            id: "input-002",
            type: "qr_scan",
            label: "Scan cutting order",
            required: true
          }
        ],
        dependencies: [
          {
            id: "dep-001",
            type: "task_completion",
            description: "Pattern must be finalized",
            details: {
              taskTitle: "Finalize cutting pattern",
              taskTags: ["pattern", "preparation"]
            }
          }
        ],
        outputs: [
          {
            id: "output-002",
            type: "measurement",
            label: "Record cut piece dimensions",
            required: true
          },
          {
            id: "output-003",
            type: "photo",
            label: "Photo of cut pieces",
            required: false
          }
        ],
        assignedTeam: "Cutting Team",
        estimatedDuration: 20,
        isExpanded: false,
        isComplete: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "stage-003",
        workflowId: "wf-denim-001",
        sequence: 3,
        name: "Sewing",
        description: "Sew cut pieces together",
        icon: "Layers",
        color: "#10B981",
        type: "sequential",
        happensAfter: ["stage-002"],
        inputs: [
          {
            id: "input-003",
            type: "qr_scan",
            label: "Scan cut pieces",
            required: true
          }
        ],
        dependencies: [],
        outputs: [
          {
            id: "output-004",
            type: "form_submit",
            label: "Sewing completion checklist",
            required: true
          },
          {
            id: "output-005",
            type: "photo",
            label: "Photo of sewn garment",
            required: true
          }
        ],
        assignedTeam: "Sewing Team",
        estimatedDuration: 45,
        isExpanded: false,
        isComplete: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    limboZones: [
      {
        id: "limbo-001",
        workflowId: "wf-denim-001",
        betweenStages: ["stage-002", "stage-003"],
        dependencies: [
          {
            id: "limbo-dep-001",
            type: "time_based",
            description: "Allow fabric to rest",
            details: {
              delayAmount: 2,
              delayUnit: "hours"
            }
          }
        ]
      }
    ],
    lastExecutionAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    activeItemCount: 145,
    totalExecutions: 1250,
    completionRate: 94,
    averageDuration: 180,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: "user-001"
  }
]

// Helper function to get workflow by ID
export function getWorkflowById(id: string): WorkflowV3 | undefined {
  return MOCK_WORKFLOWS.find(w => w.id === id)
}

// Helper function to create empty workflow
export function createEmptyWorkflow(): WorkflowV3 {
  const now = new Date().toISOString()
  return {
    id: `wf-${Date.now()}`,
    name: "",
    description: undefined,
    industry: undefined,
    active: false,
    stages: [],
    limboZones: [],
    activeItemCount: 0,
    totalExecutions: 0,
    createdAt: now,
    updatedAt: now,
    createdBy: "user-001"
  }
}

// Helper function to create empty stage
export function createEmptyStage(workflowId: string, sequence: number): WorkflowStageV3 {
  const now = new Date().toISOString()
  return {
    id: `stage-${Date.now()}`,
    workflowId,
    sequence,
    name: "",
    type: "sequential",
    inputs: [],
    dependencies: [],
    outputs: [],
    isExpanded: true,
    isComplete: false,
    createdAt: now,
    updatedAt: now
  }
}

// Helper function to create empty limbo zone
export function createEmptyLimboZone(workflowId: string, fromStageId: string, toStageId: string): LimboZone {
  return {
    id: `limbo-${Date.now()}`,
    workflowId,
    betweenStages: [fromStageId, toStageId],
    dependencies: []
  }
}













