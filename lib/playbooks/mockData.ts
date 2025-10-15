// Mock Playbooks Data

import type { Playbook, PlaybookSummary, TriggerTypeOption } from "./types"

// ============================================================================
// Trigger Type Options (for UI dropdown)
// ============================================================================

export const TRIGGER_TYPE_OPTIONS: TriggerTypeOption[] = [
  {
    value: "workflow_stage_change",
    label: "Workflow Stage Change",
    description: "When an item enters, exits, or completes a workflow stage",
    icon: "GitBranch",
    category: "workflow",
  },
  {
    value: "task_completion",
    label: "Task Completion",
    description: "When a specific task is completed",
    icon: "CheckCircle2",
    category: "task",
  },
  {
    value: "order_accepted",
    label: "Order Accepted",
    description: "When an order is accepted and ready to start",
    icon: "PackageCheck",
    category: "order",
  },
  {
    value: "order_completed",
    label: "Order Completed",
    description: "When an order is fully completed",
    icon: "PackageX",
    category: "order",
  },
  {
    value: "date_based",
    label: "Date-Based",
    description: "On a specific date or relative to order dates",
    icon: "Calendar",
    category: "time",
  },
  {
    value: "time_based",
    label: "Time-Based",
    description: "Daily, weekly, or monthly schedule",
    icon: "Clock",
    category: "time",
  },
  {
    value: "capacity_based",
    label: "Capacity Threshold",
    description: "When team capacity reaches a threshold",
    icon: "Gauge",
    category: "resource",
  },
  {
    value: "order_completion_previous",
    label: "Previous Order Complete",
    description: "When a previous order completes",
    icon: "ArrowLeft",
    category: "order",
  },
]

// ============================================================================
// Mock Playbooks
// ============================================================================

export const MOCK_PLAYBOOKS: Playbook[] = [
  {
    id: "playbook-001",
    name: "Order Acceptance Playbook",
    description: "Automated tasks that kick off when an order is accepted, ensuring all prep work is assigned and tracked.",
    active: true,
    plays: [
      {
        id: "play-001",
        playbookId: "playbook-001",
        sequence: 1,
        title: "Order fabric from supplier",
        description: "Contact supplier and place order for fabric based on order requirements",
        trigger: {
          type: "order_accepted",
        },
        taskTemplate: {
          title: "Order fabric from supplier",
          description: "Review order BOM and place fabric order with primary supplier. Confirm lead time and delivery date.",
          priority: "high",
          estimatedMinutes: 60,
          tags: ["procurement", "fabric", "urgent"],
        },
        assignment: {
          type: "role_team",
          mode: "team",
          teamId: "team-procurement",
          teamName: "Procurement",
        },
        dependencies: [],
        enabled: true,
        createdAt: "2025-10-01T10:00:00Z",
        updatedAt: "2025-10-01T10:00:00Z",
        createdBy: "user-001",
      },
      {
        id: "play-002",
        playbookId: "playbook-001",
        sequence: 2,
        title: "Order trims and accessories",
        description: "Place order for all trims, buttons, zippers, and other accessories",
        trigger: {
          type: "order_accepted",
        },
        taskTemplate: {
          title: "Order trims and accessories",
          description: "Review order BOM for trims (buttons, zippers, labels, etc.) and place orders with suppliers.",
          priority: "high",
          estimatedMinutes: 45,
          tags: ["procurement", "trims"],
        },
        assignment: {
          type: "role_team",
          mode: "team",
          teamId: "team-procurement",
          teamName: "Procurement",
        },
        dependencies: [],
        enabled: true,
        createdAt: "2025-10-01T10:00:00Z",
        updatedAt: "2025-10-01T10:00:00Z",
        createdBy: "user-001",
      },
      {
        id: "play-003",
        playbookId: "playbook-001",
        sequence: 3,
        title: "Finalize and grade pattern",
        description: "Ensure pattern is graded for all sizes in the order",
        trigger: {
          type: "order_accepted",
        },
        taskTemplate: {
          title: "Finalize and grade pattern",
          description: "Review tech pack, finalize pattern adjustments, and grade for all required sizes.",
          priority: "critical",
          estimatedMinutes: 180,
          tags: ["pattern", "technical"],
        },
        assignment: {
          type: "role_team",
          mode: "role",
          roleId: "role-pattern-maker",
          roleName: "Pattern Maker",
        },
        dependencies: [],
        enabled: true,
        createdAt: "2025-10-01T10:00:00Z",
        updatedAt: "2025-10-01T10:00:00Z",
        createdBy: "user-001",
      },
      {
        id: "play-004",
        playbookId: "playbook-001",
        sequence: 4,
        title: "Print patterns for all sizes",
        description: "Print full-size patterns ready for cutting",
        trigger: {
          type: "task_completion",
          taskId: "play-003",
          taskTitle: "Finalize and grade pattern",
        },
        taskTemplate: {
          title: "Print patterns for all sizes",
          description: "Print full-size patterns on plotter for all sizes in the order.",
          priority: "high",
          estimatedMinutes: 30,
          tags: ["pattern", "printing"],
        },
        assignment: {
          type: "role_team",
          mode: "team",
          teamId: "team-technical",
          teamName: "Technical Team",
        },
        dependencies: [
          {
            playId: "play-003",
            playTitle: "Finalize and grade pattern",
            type: "finish_to_start",
          },
        ],
        enabled: true,
        createdAt: "2025-10-01T10:00:00Z",
        updatedAt: "2025-10-01T10:00:00Z",
        createdBy: "user-001",
      },
      {
        id: "play-005",
        playbookId: "playbook-001",
        sequence: 5,
        title: "Schedule fabric inspection upon receipt",
        description: "Create calendar event for fabric inspection when fabric arrives",
        trigger: {
          type: "date_based",
          mode: "relative_to_order",
          relativeOffset: {
            days: 3,
            relativeTo: "order_accepted",
          },
        },
        taskTemplate: {
          title: "Inspect incoming fabric",
          description: "Check fabric quality, color match, and quantity upon delivery.",
          priority: "medium",
          estimatedMinutes: 45,
          tags: ["quality", "fabric", "inspection"],
        },
        assignment: {
          type: "role_team",
          mode: "role",
          roleId: "role-qc-inspector",
          roleName: "QC Inspector",
        },
        dependencies: [],
        enabled: true,
        createdAt: "2025-10-01T10:00:00Z",
        updatedAt: "2025-10-01T10:00:00Z",
        createdBy: "user-001",
      },
    ],
    createdAt: "2025-10-01T10:00:00Z",
    updatedAt: "2025-10-10T14:30:00Z",
    createdBy: "user-001",
    lastModifiedBy: "user-001",
  },
  {
    id: "playbook-002",
    name: "Cutting Stage Playbook",
    description: "Essential prep tasks when items move into the cutting stage of production.",
    active: true,
    plays: [
      {
        id: "play-101",
        playbookId: "playbook-002",
        sequence: 1,
        title: "Change thread color for order",
        description: "Set up machines with correct thread color for this order",
        trigger: {
          type: "workflow_stage_change",
          workflowId: "wf-cut-sew-v4",
          workflowName: "Cut & Sew Apparel v4",
          stageId: "stage-cutting",
          stageName: "Cutting",
          condition: "enters",
        },
        taskTemplate: {
          title: "Change thread color for order",
          description: "Review order specs and set up all sewing machines with the correct thread color.",
          priority: "high",
          estimatedMinutes: 20,
          tags: ["setup", "sewing", "preparation"],
        },
        assignment: {
          type: "role_team",
          mode: "team",
          teamId: "team-sewing",
          teamName: "Sewing Team",
        },
        dependencies: [],
        enabled: true,
        createdAt: "2025-10-05T09:00:00Z",
        updatedAt: "2025-10-05T09:00:00Z",
        createdBy: "user-001",
      },
      {
        id: "play-102",
        playbookId: "playbook-002",
        sequence: 2,
        title: "Rest fabric for 24 hours",
        description: "Allow fabric to rest and relax after unwrapping from roll",
        trigger: {
          type: "workflow_stage_change",
          workflowId: "wf-cut-sew-v4",
          workflowName: "Cut & Sew Apparel v4",
          stageId: "stage-cutting",
          stageName: "Cutting",
          condition: "enters",
        },
        taskTemplate: {
          title: "Rest fabric for 24 hours",
          description: "Lay fabric flat and allow it to rest for 24 hours before cutting to prevent distortion.",
          priority: "medium",
          estimatedMinutes: 15,
          tags: ["fabric", "preparation", "quality"],
        },
        assignment: {
          type: "role_team",
          mode: "team",
          teamId: "team-cutting",
          teamName: "Cutting Team",
        },
        dependencies: [],
        enabled: true,
        createdAt: "2025-10-05T09:00:00Z",
        updatedAt: "2025-10-05T09:00:00Z",
        createdBy: "user-001",
      },
      {
        id: "play-103",
        playbookId: "playbook-002",
        sequence: 3,
        title: "Perform shrinkage test",
        description: "Test fabric shrinkage before cutting full order",
        trigger: {
          type: "workflow_stage_change",
          workflowId: "wf-cut-sew-v4",
          workflowName: "Cut & Sew Apparel v4",
          stageId: "stage-cutting",
          stageName: "Cutting",
          condition: "enters",
        },
        taskTemplate: {
          title: "Perform shrinkage test",
          description: "Cut sample piece, wash/dry per care instructions, measure shrinkage percentage.",
          priority: "critical",
          estimatedMinutes: 90,
          tags: ["testing", "quality", "fabric"],
        },
        assignment: {
          type: "role_team",
          mode: "role",
          roleId: "role-qc-inspector",
          roleName: "QC Inspector",
        },
        dependencies: [],
        enabled: true,
        createdAt: "2025-10-05T09:00:00Z",
        updatedAt: "2025-10-05T09:00:00Z",
        createdBy: "user-001",
      },
      {
        id: "play-104",
        playbookId: "playbook-002",
        sequence: 4,
        title: "Lay fabric on cutting table",
        description: "Spread fabric on cutting table in preparation for cutting",
        trigger: {
          type: "task_completion",
          taskId: "play-102",
          taskTitle: "Rest fabric for 24 hours",
        },
        taskTemplate: {
          title: "Lay fabric on cutting table",
          description: "Carefully spread and align fabric layers on cutting table, ensuring no wrinkles or tension.",
          priority: "high",
          estimatedMinutes: 45,
          tags: ["cutting", "preparation"],
        },
        assignment: {
          type: "role_team",
          mode: "team",
          teamId: "team-cutting",
          teamName: "Cutting Team",
        },
        dependencies: [
          {
            playId: "play-102",
            playTitle: "Rest fabric for 24 hours",
            type: "finish_to_start",
          },
        ],
        enabled: true,
        createdAt: "2025-10-05T09:00:00Z",
        updatedAt: "2025-10-05T09:00:00Z",
        createdBy: "user-001",
      },
    ],
    createdAt: "2025-10-05T09:00:00Z",
    updatedAt: "2025-10-05T09:00:00Z",
    createdBy: "user-001",
    lastModifiedBy: "user-001",
  },
  {
    id: "playbook-003",
    name: "Weekly Maintenance Routines",
    description: "Recurring maintenance tasks to keep equipment running smoothly.",
    active: true,
    plays: [
      {
        id: "play-201",
        playbookId: "playbook-003",
        sequence: 1,
        title: "Weekly machine maintenance check",
        description: "Inspect and maintain all sewing machines",
        trigger: {
          type: "time_based",
          frequency: "weekly",
          time: "07:00",
          weekday: 1, // Monday
          timezone: "America/New_York",
        },
        taskTemplate: {
          title: "Weekly machine maintenance check",
          description: "Oil machines, check tension, clean lint, replace needles as needed.",
          priority: "medium",
          estimatedMinutes: 120,
          tags: ["maintenance", "equipment"],
        },
        assignment: {
          type: "role_team",
          mode: "role",
          roleId: "role-maintenance",
          roleName: "Maintenance Technician",
        },
        dependencies: [],
        enabled: true,
        createdAt: "2025-09-20T08:00:00Z",
        updatedAt: "2025-09-20T08:00:00Z",
        createdBy: "user-001",
      },
      {
        id: "play-202",
        playbookId: "playbook-003",
        sequence: 2,
        title: "Cutting table calibration",
        description: "Calibrate automated cutting equipment",
        trigger: {
          type: "time_based",
          frequency: "weekly",
          time: "08:00",
          weekday: 3, // Wednesday
          timezone: "America/New_York",
        },
        taskTemplate: {
          title: "Cutting table calibration",
          description: "Run calibration routine on automated cutting machines, check blade sharpness.",
          priority: "high",
          estimatedMinutes: 60,
          tags: ["maintenance", "cutting", "calibration"],
        },
        assignment: {
          type: "specific_people",
          userIds: ["user-004", "user-005"],
        },
        dependencies: [],
        enabled: true,
        createdAt: "2025-09-20T08:00:00Z",
        updatedAt: "2025-09-20T08:00:00Z",
        createdBy: "user-001",
      },
    ],
    createdAt: "2025-09-20T08:00:00Z",
    updatedAt: "2025-09-20T08:00:00Z",
    createdBy: "user-001",
    lastModifiedBy: "user-001",
  },
]

// ============================================================================
// Playbook Summaries (for index page)
// ============================================================================

export const MOCK_PLAYBOOK_SUMMARIES: PlaybookSummary[] = [
  {
    id: "playbook-001",
    name: "Order Acceptance Playbook",
    description: "Automated tasks that kick off when an order is accepted, ensuring all prep work is assigned and tracked.",
    playCount: 5,
    activePlayCount: 5,
    active: true,
    lastModified: "2025-10-10T14:30:00Z",
    totalTasksCreated: 127,
    completedTasks: 119,
    averageTaskCompletionTime: 52,
    peopleInvolved: 8,
    efficiencyScore: 94,
    recentExecutions: 23,
  },
  {
    id: "playbook-002",
    name: "Cutting Stage Playbook",
    description: "Essential prep tasks when items move into the cutting stage of production.",
    playCount: 4,
    activePlayCount: 4,
    active: true,
    lastModified: "2025-10-05T09:00:00Z",
    totalTasksCreated: 89,
    completedTasks: 83,
    averageTaskCompletionTime: 38,
    peopleInvolved: 5,
    efficiencyScore: 93,
    recentExecutions: 18,
  },
  {
    id: "playbook-003",
    name: "Weekly Maintenance Routines",
    description: "Recurring maintenance tasks to keep equipment running smoothly.",
    playCount: 2,
    activePlayCount: 2,
    active: true,
    lastModified: "2025-09-20T08:00:00Z",
    totalTasksCreated: 34,
    completedTasks: 32,
    averageTaskCompletionTime: 85,
    peopleInvolved: 3,
    efficiencyScore: 94,
    recentExecutions: 8,
  },
]

// ============================================================================
// Mock Users (for assignment picker)
// ============================================================================

export const MOCK_USERS = [
  {
    id: "user-001",
    name: "Sarah Chen",
    avatar: "/placeholder-user.jpg",
    role: "Production Manager",
  },
  {
    id: "user-002",
    name: "Marcus Williams",
    avatar: "/placeholder-user.jpg",
    role: "Pattern Maker",
  },
  {
    id: "user-003",
    name: "Elena Rodriguez",
    avatar: "/placeholder-user.jpg",
    role: "QC Inspector",
  },
  {
    id: "user-004",
    name: "James Park",
    avatar: "/placeholder-user.jpg",
    role: "Maintenance Tech",
  },
  {
    id: "user-005",
    name: "Aisha Patel",
    avatar: "/placeholder-user.jpg",
    role: "Cutting Specialist",
  },
  {
    id: "user-006",
    name: "David Kim",
    avatar: "/placeholder-user.jpg",
    role: "Procurement Lead",
  },
]

// ============================================================================
// Mock Roles (for role-based assignment)
// ============================================================================

export const MOCK_ROLES = [
  { id: "role-pattern-maker", name: "Pattern Maker" },
  { id: "role-qc-inspector", name: "QC Inspector" },
  { id: "role-maintenance", name: "Maintenance Technician" },
  { id: "role-cutter", name: "Cutter" },
  { id: "role-sewer", name: "Sewer" },
  { id: "role-finisher", name: "Finisher" },
  { id: "role-packer", name: "Packer" },
]

