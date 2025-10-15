// Taskmaster v2 - Mock Data
import { addDays, addHours, subDays, subHours } from "date-fns"
import type {
    Task,
    TaskStatus,
    TaskPriority,
    SuggestedTask,
    TeamTaskAnalytics, SystemTaskAnalytics
} from "./types"

const BASE_DATE = new Date("2025-10-10T09:00:00-07:00")

// Mock users
export const MOCK_USERS = [
  { id: "person-1", name: "Sarah Chen", role: "Team Lead", teamId: "team-1", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
  { id: "person-2", name: "Marcus Johnson", role: "Machine Operator", teamId: "team-1", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" },
  { id: "person-3", name: "Elena Rodriguez", role: "Assembly Lead", teamId: "team-2", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena" },
  { id: "person-4", name: "James Wilson", role: "Assembly Tech", teamId: "team-2", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James" },
  { id: "person-5", name: "Priya Patel", role: "QA Inspector", teamId: "team-3", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" },
  { id: "person-6", name: "David Kim", role: "QA Lead", teamId: "team-3", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David" },
  { id: "person-7", name: "Maria Garcia", role: "Finishing Specialist", teamId: "team-4", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria" },
  { id: "person-8", name: "Alex Thompson", role: "Finishing Tech", teamId: "team-4", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
  { id: "person-9", name: "Lisa Anderson", role: "Logistics Coordinator", teamId: "team-5", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa" },
  { id: "person-10", name: "Michael Brown", role: "Shipping Lead", teamId: "team-5", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael" },
]

// Mock teams (aligned with lib/data/teams.ts)
export const MOCK_TEAMS = [
  { id: "team-1", name: "Alpha Sewing Line", color: "#3b82f6" },
  { id: "team-2", name: "Beta Assembly", color: "#8b5cf6" },
  { id: "team-3", name: "Quality Assurance", color: "#10b981" },
  { id: "team-4", name: "Finishing Team", color: "#f59e0b" },
  { id: "team-5", name: "Shipping & Logistics", color: "#ef4444" },
]

// Helper to generate task ID
let taskIdCounter = 1
function generateTaskId(): string {
  return `task-v2-${String(taskIdCounter++).padStart(4, "0")}`
}

// Generate comprehensive task data
export function generateMockTasks(): Task[] {
  const tasks: Task[] = []

  // Team 1: Alpha Sewing Line (15 tasks)
  tasks.push(
    createTask({
      title: "Set up production line for Aurora jackets",
      description: "Configure machines, test thread tension, and prepare workstations for the new order",
      status: "completed",
      priority: "high",
      teamId: "team-1",
      assignees: ["person-1", "person-2"],
      dueDate: subDays(BASE_DATE, 2),
      completedDate: subDays(BASE_DATE, 2),
      tags: ["setup", "aurora-order"],
    }),
    createTask({
      title: "QA check - sleeve attachments batch #1",
      description: "Inspect 50 units for proper seam alignment and stitch consistency",
      status: "in_progress",
      priority: "high",
      teamId: "team-1",
      assignees: ["person-1"],
      dueDate: addHours(BASE_DATE, 4),
      checklist: [
        { label: "Check seam alignment", done: true },
        { label: "Measure stitch density", done: true },
        { label: "Test fabric pull strength", done: false },
      ],
      tags: ["qa", "aurora-order"],
    }),
    createTask({
      title: "Repair stitching defects from yesterday",
      description: "Fix 12 units flagged by QA with irregular stitching patterns",
      status: "scheduled",
      priority: "medium",
      teamId: "team-1",
      assignees: ["person-2"],
      dueDate: addDays(BASE_DATE, 1),
      tags: ["rework", "qa-followup"],
    }),
    createTask({
      title: "Train new team member on overlock machines",
      description: "2-hour onboarding session covering safety, setup, and basic techniques",
      status: "scheduled",
      priority: "low",
      teamId: "team-1",
      assignees: ["person-1", "person-3"],
      dueDate: addDays(BASE_DATE, 2),
      tags: ["training", "onboarding"],
    }),
    createTask({
      title: "Weekly maintenance - Machine A3",
      description: "Clean, oil, and tension-test the overlock machine",
      status: "draft",
      priority: "medium",
      teamId: "team-1",
      assignees: ["person-2"],
      tags: ["maintenance"],
    }),
    createTask({
      title: "Complete collar assembly for 200 units",
      description: "Attach collars to jacket bodies, ensure alignment with center seam",
      status: "in_progress",
      priority: "critical",
      teamId: "team-1",
      assignees: ["person-1", "person-2", "person-3"],
      dueDate: addHours(BASE_DATE, 6),
      checklist: [
        { label: "Cut interfacing", done: true },
        { label: "Press collars", done: true },
        { label: "Attach to body", done: false },
        { label: "Topstitch edges", done: false },
      ],
      tags: ["aurora-order", "assembly"],
    }),
    createTask({
      title: "Inventory check - specialty threads",
      description: "Count remaining spools of gold and navy thread for upcoming orders",
      status: "blocked",
      priority: "medium",
      teamId: "team-1",
      assignees: ["person-3"],
      dueDate: BASE_DATE,
      blockers: [{ label: "Waiting for inventory system access", ownerId: "person-10" }],
      tags: ["inventory"],
    }),
    createTask({
      title: "Prepare samples for client review",
      description: "Select 3 best units from current batch for customer approval",
      status: "review",
      priority: "high",
      teamId: "team-1",
      assignees: ["person-1"],
      dueDate: addDays(BASE_DATE, 1),
      tags: ["aurora-order", "client"],
    }),
    createTask({
      title: "Update production log for week 41",
      description: "Record units completed, defects found, and machine downtime",
      status: "scheduled",
      priority: "low",
      teamId: "team-1",
      assignees: ["person-2"],
      dueDate: addDays(BASE_DATE, 3),
      tags: ["reporting"],
    }),
    createTask({
      title: "Order replacement needles for Juki machines",
      description: "Purchase 100 size 14 needles and 50 size 16 needles",
      status: "draft",
      priority: "low",
      teamId: "team-1",
      assignees: ["person-3"],
      tags: ["procurement"],
    })
  )

  // Team 2: Beta Assembly (12 tasks)
  tasks.push(
    createTask({
      title: "Assemble zipper panels for 150 units",
      description: "Install zippers, add pull tabs, and test functionality",
      status: "in_progress",
      priority: "high",
      teamId: "team-2",
      assignees: ["person-4", "person-5"],
      dueDate: addHours(BASE_DATE, 8),
      checklist: [
        { label: "Cut zipper tape to length", done: true },
        { label: "Attach to panels", done: false },
        { label: "Install pull tabs", done: false },
      ],
      tags: ["aurora-order", "assembly"],
    }),
    createTask({
      title: "Quality check - pocket assembly",
      description: "Inspect 100 pockets for proper stitching and alignment",
      status: "completed",
      priority: "medium",
      teamId: "team-2",
      assignees: ["person-4"],
      dueDate: subHours(BASE_DATE, 2),
      completedDate: subHours(BASE_DATE, 1),
      tags: ["qa"],
    }),
    createTask({
      title: "Install snap fasteners on 80 units",
      description: "Apply snap sets to front plackets using press machine",
      status: "scheduled",
      priority: "medium",
      teamId: "team-2",
      assignees: ["person-5"],
      dueDate: addDays(BASE_DATE, 1),
      tags: ["aurora-order", "hardware"],
    }),
    createTask({
      title: "Prepare workstation for new order batch",
      description: "Clear previous materials, organize tools, and verify machine settings",
      status: "draft",
      priority: "low",
      teamId: "team-2",
      assignees: ["person-6"],
      tags: ["setup"],
    }),
    createTask({
      title: "Label and bundle completed sub-assemblies",
      description: "Package 200 zipper units for transfer to final assembly",
      status: "in_progress",
      priority: "medium",
      teamId: "team-2",
      assignees: ["person-4", "person-6"],
      dueDate: addHours(BASE_DATE, 3),
      tags: ["packaging"],
    }),
    createTask({
      title: "Calibrate snap press machine",
      description: "Test pressure settings and replace worn dies",
      status: "blocked",
      priority: "high",
      teamId: "team-2",
      assignees: ["person-5"],
      dueDate: BASE_DATE,
      blockers: [{ label: "Waiting for replacement dies to arrive", ownerId: "person-10" }],
      tags: ["maintenance", "blocker"],
    }),
    createTask({
      title: "Document assembly process improvements",
      description: "Write up new zipper installation technique that reduces time by 15%",
      status: "review",
      priority: "low",
      teamId: "team-2",
      assignees: ["person-4"],
      dueDate: addDays(BASE_DATE, 5),
      tags: ["documentation", "process-improvement"],
    }),
    createTask({
      title: "Cross-train on pocket installation",
      description: "Learn backup role for pocket assembly process",
      status: "scheduled",
      priority: "low",
      teamId: "team-2",
      assignees: ["person-6"],
      dueDate: addDays(BASE_DATE, 4),
      tags: ["training"],
    })
  )

  // Team 3: Quality Assurance (10 tasks)
  tasks.push(
    createTask({
      title: "Final inspection - Aurora batch #1",
      description: "Complete quality audit of 100 finished jackets",
      status: "in_progress",
      priority: "critical",
      teamId: "team-3",
      assignees: ["person-7", "person-8"],
      dueDate: addHours(BASE_DATE, 2),
      checklist: [
        { label: "Visual inspection", done: true },
        { label: "Measurement verification", done: true },
        { label: "Functionality testing", done: false },
        { label: "Tag and label check", done: false },
      ],
      tags: ["aurora-order", "final-qa"],
    }),
    createTask({
      title: "Defect analysis report for week 41",
      description: "Compile defect types, frequencies, and root causes",
      status: "scheduled",
      priority: "medium",
      teamId: "team-3",
      assignees: ["person-7"],
      dueDate: addDays(BASE_DATE, 2),
      tags: ["reporting", "analysis"],
    }),
    createTask({
      title: "Random sampling - in-process check",
      description: "Pull 20 random units from production line for early QA",
      status: "completed",
      priority: "high",
      teamId: "team-3",
      assignees: ["person-8"],
      dueDate: subHours(BASE_DATE, 4),
      completedDate: subHours(BASE_DATE, 3),
      tags: ["qa", "sampling"],
    }),
    createTask({
      title: "Update QA checklist for new order type",
      description: "Add inspection points for water-resistant jacket features",
      status: "review",
      priority: "medium",
      teamId: "team-3",
      assignees: ["person-7"],
      dueDate: addDays(BASE_DATE, 3),
      tags: ["documentation", "process"],
    }),
    createTask({
      title: "Calibrate measurement tools",
      description: "Verify accuracy of rulers, gauges, and digital calipers",
      status: "draft",
      priority: "low",
      teamId: "team-3",
      assignees: ["person-8"],
      tags: ["maintenance", "calibration"],
    }),
    createTask({
      title: "Train new QA inspector on standards",
      description: "2-day training program covering inspection criteria and documentation",
      status: "scheduled",
      priority: "high",
      teamId: "team-3",
      assignees: ["person-7", "person-9"],
      dueDate: addDays(BASE_DATE, 1),
      tags: ["training", "onboarding"],
    }),
    createTask({
      title: "Investigate stitch density variance",
      description: "Test samples from Machine A3 to identify cause of inconsistent stitching",
      status: "in_progress",
      priority: "high",
      teamId: "team-3",
      assignees: ["person-8"],
      dueDate: addHours(BASE_DATE, 6),
      tags: ["investigation", "qa"],
    })
  )

  // Team 4: Finishing Team (8 tasks)
  tasks.push(
    createTask({
      title: "Press and steam 150 completed jackets",
      description: "Final pressing to remove wrinkles and set seams",
      status: "in_progress",
      priority: "high",
      teamId: "team-4",
      assignees: ["person-9"],
      dueDate: addHours(BASE_DATE, 4),
      tags: ["aurora-order", "finishing"],
    }),
    createTask({
      title: "Attach hang tags and care labels",
      description: "Apply brand tags and care instruction labels to 200 units",
      status: "scheduled",
      priority: "medium",
      teamId: "team-4",
      assignees: ["person-9", "person-10"],
      dueDate: addDays(BASE_DATE, 1),
      tags: ["aurora-order", "labeling"],
    }),
    createTask({
      title: "Spot clean marked units from QA",
      description: "Remove 8 units with minor soil marks before final packaging",
      status: "completed",
      priority: "medium",
      teamId: "team-4",
      assignees: ["person-10"],
      dueDate: subHours(BASE_DATE, 1),
      completedDate: subHours(BASE_DATE, 1),
      tags: ["cleaning"],
    }),
    createTask({
      title: "Replace steam press heating element",
      description: "Install new heating element in Press Station 2",
      status: "blocked",
      priority: "critical",
      teamId: "team-4",
      assignees: ["person-9"],
      dueDate: BASE_DATE,
      blockers: [{ label: "Part on backorder, ETA Monday", ownerId: "person-10" }],
      tags: ["maintenance", "blocker"],
    }),
    createTask({
      title: "Fold and bag finished units",
      description: "Properly fold, bag, and prepare 100 jackets for shipping",
      status: "scheduled",
      priority: "high",
      teamId: "team-4",
      assignees: ["person-10"],
      dueDate: addDays(BASE_DATE, 1),
      tags: ["aurora-order", "packaging"],
    })
  )

  // Team 5: Shipping & Logistics (7 tasks)
  tasks.push(
    createTask({
      title: "Coordinate Aurora shipment to warehouse",
      description: "Schedule pickup for 500 completed units to customer distribution center",
      status: "in_progress",
      priority: "critical",
      teamId: "team-5",
      assignees: ["person-10"],
      dueDate: addDays(BASE_DATE, 1),
      tags: ["aurora-order", "shipping"],
    }),
    createTask({
      title: "Generate packing slips for batch #1",
      description: "Create documentation for 200-unit shipment",
      status: "scheduled",
      priority: "high",
      teamId: "team-5",
      assignees: ["person-10"],
      dueDate: addHours(BASE_DATE, 4),
      tags: ["aurora-order", "documentation"],
    }),
    createTask({
      title: "Inventory count - shipping supplies",
      description: "Check stock levels for boxes, poly bags, and tape",
      status: "completed",
      priority: "low",
      teamId: "team-5",
      assignees: ["person-10"],
      dueDate: subDays(BASE_DATE, 1),
      completedDate: subDays(BASE_DATE, 1),
      tags: ["inventory"],
    }),
    createTask({
      title: "Receive inbound fabric shipment",
      description: "Check in delivery, verify quantities, and log into system",
      status: "scheduled",
      priority: "medium",
      teamId: "team-5",
      assignees: ["person-10"],
      dueDate: addDays(BASE_DATE, 2),
      tags: ["receiving"],
    }),
    createTask({
      title: "Update shipping carrier rates",
      description: "Review and update cost tables with latest carrier pricing",
      status: "draft",
      priority: "low",
      teamId: "team-5",
      assignees: ["person-10"],
      tags: ["admin"],
    })
  )

  return tasks
}

// Helper function to create a task
function createTask(params: {
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  teamId: string
  assignees: string[]
  dueDate?: Date
  completedDate?: Date
  checklist?: Array<{ label: string; done: boolean }>
  blockers?: Array<{ label: string; ownerId?: string }>
  tags?: string[]
}): Task {
  const taskId = generateTaskId()
  const team = MOCK_TEAMS.find((t) => t.id === params.teamId)!
  const now = BASE_DATE.toISOString()

  return {
    id: taskId,
    title: params.title,
    description: params.description,
    status: params.status,
    priority: params.priority,
    source: "manual",
    owningTeamId: params.teamId,
    owningTeamLabel: team.name,
    owningTeamColor: team.color,
    createdBy: "person-1",
    createdAt: subDays(BASE_DATE, Math.floor(Math.random() * 7)).toISOString(),
    updatedAt: now,
    completedAt: params.completedDate?.toISOString(),
    dueWindow: params.dueDate
      ? {
          start: subHours(params.dueDate, 2).toISOString(),
          end: params.dueDate.toISOString(),
          timezone: "America/Los_Angeles",
        }
      : undefined,
    schedule: params.dueDate
      ? {
          slotId: `slot-${taskId}`,
          calendarId: `cal-${params.teamId}`,
          start: subHours(params.dueDate, 2).toISOString(),
          end: params.dueDate.toISOString(),
          isAllDay: false,
        }
      : undefined,
    contexts: [
      {
        id: `ctx-${taskId}-team`,
        taskId,
        type: "team",
        referenceId: params.teamId,
        label: team.name,
        role: "primary",
      },
    ],
    assignments: params.assignees.map((userId) => {
      const user = MOCK_USERS.find((u) => u.id === userId)!
      return {
        taskId,
        userId,
        userName: user.name,
        userAvatar: user.avatar,
        role: params.assignees[0] === userId ? "owner" : "collaborator",
        requiredAck: params.assignees[0] === userId,
        acknowledgedAt: params.status === "in_progress" || params.status === "completed" ? now : undefined,
      }
    }),
    checklist: params.checklist
      ? params.checklist.map((item, idx) => ({
          id: `check-${taskId}-${idx}`,
          taskId,
          sequence: idx,
          label: item.label,
          required: false,
          done: item.done,
        }))
      : [],
    artifacts: [],
    dependencies: [],
    tags: params.tags || [],
    blockers: params.blockers
      ? params.blockers.map((blocker, idx) => ({
          id: `blocker-${taskId}-${idx}`,
          taskId,
          label: blocker.label,
          ownerId: blocker.ownerId,
          createdAt: now,
        }))
      : [],
  }
}

// Generate suggested tasks
export function generateSuggestedTasks(): SuggestedTask[] {
  return [
    {
      id: "suggest-001",
      title: "Schedule fabric inspection for incoming shipment",
      description: "Quality check required for 500 yards of water-resistant fabric arriving Monday",
      rationale: "Incoming shipment detected in planner with no QA task assigned. Historical pattern shows early inspection prevents downstream issues.",
      recommendedTeamId: "team-3",
      recommendedTeamLabel: "Quality Assurance",
      recommendedAssignee: { userId: "person-7", name: "Sarah Chen", avatar: MOCK_USERS[0].avatar },
      suggestedDueDate: addDays(BASE_DATE, 2).toISOString(),
      origin: "planner",
      expectedOutcome: "Fabric defects identified before cutting, preventing rework and maintaining production schedule.",
      highlights: [
        "Planner event scheduled for Monday 8:00 AM",
        "Team has capacity for additional task",
        "Similar shipments required 2 hours inspection time",
      ],
      confidence: 0.89,
      linkedContext: "Fabric Shipment • Receiving",
      contextType: "planner_event",
      contextId: "evt-fabric-001",
      priority: "high",
      estimatedMinutes: 120,
      tags: ["qa", "fabric", "inspection"],
      createdAt: BASE_DATE.toISOString(),
    },
    {
      id: "suggest-002",
      title: "Prepare cutting tables for next order phase",
      description: "Set up work area and tools for upcoming cutting operation on Order #OR-1024",
      rationale: "Order workflow indicates cutting stage begins in 48 hours. Team Alpha needs prep time based on previous order patterns.",
      recommendedTeamId: "team-1",
      recommendedTeamLabel: "Alpha Sewing Line",
      recommendedAssignee: { userId: "person-2", name: "Marcus Johnson", avatar: MOCK_USERS[1].avatar },
      suggestedDueDate: addDays(BASE_DATE, 1).toISOString(),
      origin: "order",
      expectedOutcome: "Cutting area ready with proper tools and fabric staged, preventing workflow delays.",
      highlights: [
        "Order OR-1024 enters cutting phase in 2 days",
        "Marcus has completed similar prep tasks efficiently",
        "Average prep time: 90 minutes",
      ],
      confidence: 0.82,
      linkedContext: "Order #OR-1024 • Preparation",
      contextType: "order",
      contextId: "ord-1024",
      priority: "medium",
      estimatedMinutes: 90,
      tags: ["setup", "cutting", "preparation"],
      createdAt: BASE_DATE.toISOString(),
    },
    {
      id: "suggest-003",
      title: "Update equipment maintenance log",
      description: "Record this week's maintenance activities and schedule next service dates",
      rationale: "Weekly maintenance log is 3 days overdue. Compliance requirement for ISO certification audit next month.",
      recommendedTeamId: "team-1",
      recommendedTeamLabel: "Alpha Sewing Line",
      recommendedAssignee: { userId: "person-3", name: "Elena Rodriguez", avatar: MOCK_USERS[2].avatar },
      suggestedDueDate: addHours(BASE_DATE, 8).toISOString(),
      origin: "signal",
      expectedOutcome: "Maintenance records current and compliant, supporting ISO audit requirements.",
      highlights: [
        "Last log entry: 6 days ago",
        "ISO audit scheduled for November 15",
        "Takes approximately 30 minutes to complete",
      ],
      confidence: 0.94,
      linkedContext: "Maintenance • Compliance",
      contextType: "document",
      contextId: "doc-maint-log",
      priority: "medium",
      estimatedMinutes: 30,
      tags: ["maintenance", "compliance", "documentation"],
      createdAt: BASE_DATE.toISOString(),
    },
    {
      id: "suggest-004",
      title: "Pre-ship quality audit for Aurora batch #2",
      description: "Final inspection checkpoint before 300 units ship to customer",
      rationale: "Shipping event scheduled for Friday. Standard procedure requires QA sign-off 24 hours before shipment.",
      recommendedTeamId: "team-3",
      recommendedTeamLabel: "Quality Assurance",
      recommendedAssignee: { userId: "person-8", name: "Alex Thompson", avatar: MOCK_USERS[7].avatar },
      suggestedDueDate: addDays(BASE_DATE, 3).toISOString(),
      origin: "planner",
      expectedOutcome: "Quality verified before shipment, preventing customer rejections and returns.",
      highlights: [
        "Shipment event: Friday 2:00 PM",
        "Historical audit time: 3-4 hours for 300 units",
        "Alex completed previous Aurora audits",
      ],
      confidence: 0.91,
      linkedContext: "Aurora Order • Shipping Prep",
      contextType: "order",
      contextId: "ord-aurora",
      priority: "critical",
      estimatedMinutes: 240,
      tags: ["qa", "aurora-order", "pre-ship"],
      createdAt: BASE_DATE.toISOString(),
    },
    {
      id: "suggest-005",
      title: "Organize workspace for efficiency study",
      description: "Prep Beta Assembly area for time-motion analysis by operations team",
      rationale: "Operations team requested workspace readiness for efficiency study starting Wednesday.",
      recommendedTeamId: "team-2",
      recommendedTeamLabel: "Beta Assembly",
      recommendedAssignee: { userId: "person-6", name: "David Kim", avatar: MOCK_USERS[5].avatar },
      suggestedDueDate: addDays(BASE_DATE, 2).toISOString(),
      origin: "message",
      expectedOutcome: "Work area organized and ready for study, maximizing value of efficiency analysis.",
      highlights: [
        "Study begins Wednesday morning",
        "Requires clear workstations and labeled tools",
        "30-45 minutes estimated",
      ],
      confidence: 0.76,
      linkedContext: "Efficiency Study • Beta Assembly",
      contextType: "message",
      contextId: "msg-efficiency-study",
      priority: "low",
      estimatedMinutes: 40,
      tags: ["setup", "efficiency", "operations"],
      createdAt: BASE_DATE.toISOString(),
    },
  ]
}

// Generate analytics data
export function generateSystemAnalytics(): SystemTaskAnalytics {
  const tasks = generateMockTasks()
  const teams = MOCK_TEAMS

  const teamAnalytics: TeamTaskAnalytics[] = teams.map((team) => {
    const teamTasks = tasks.filter((t) => t.owningTeamId === team.id)
    const activeTasks = teamTasks.filter((t) => !["completed", "archived"].includes(t.status))
    const completedTasks = teamTasks.filter((t) => t.status === "completed")
    const blockedTasks = teamTasks.filter((t) => t.status === "blocked")
    const overdueTasks = teamTasks.filter((t) => {
      if (!t.dueWindow?.end) return false
      return new Date(t.dueWindow.end) < BASE_DATE && t.status !== "completed"
    })

    return {
      teamId: team.id,
      teamName: team.name,
      teamColor: team.color,
      totalTasks: teamTasks.length,
      activeTasks: activeTasks.length,
      completedTasks: completedTasks.length,
      blockedTasks: blockedTasks.length,
      overdueTasks: overdueTasks.length,
      completionRate: teamTasks.length > 0 ? (completedTasks.length / teamTasks.length) * 100 : 0,
      averageCompletionTime: 180 + Math.random() * 120, // Mock: 180-300 minutes
      velocityLast7Days: Math.floor(completedTasks.length * 0.6),
      velocityLast30Days: completedTasks.length,
      efficiencyTrend: Array.from({ length: 7 }, () => 75 + Math.random() * 20),
      tasksByStatus: {
        draft: teamTasks.filter((t) => t.status === "draft").length,
        scheduled: teamTasks.filter((t) => t.status === "scheduled").length,
        in_progress: teamTasks.filter((t) => t.status === "in_progress").length,
        blocked: teamTasks.filter((t) => t.status === "blocked").length,
        review: teamTasks.filter((t) => t.status === "review").length,
        completed: teamTasks.filter((t) => t.status === "completed").length,
        archived: teamTasks.filter((t) => t.status === "archived").length,
      },
      tasksByPriority: {
        critical: teamTasks.filter((t) => t.priority === "critical").length,
        high: teamTasks.filter((t) => t.priority === "high").length,
        medium: teamTasks.filter((t) => t.priority === "medium").length,
        low: teamTasks.filter((t) => t.priority === "low").length,
      },
      lastUpdated: BASE_DATE.toISOString(),
    }
  })

  const totalTasks = tasks.length
  const activeTasks = tasks.filter((t) => !["completed", "archived"].includes(t.status)).length
  const completedTasks = tasks.filter((t) => t.status === "completed").length
  const blockedTasks = tasks.filter((t) => t.status === "blocked").length
  const overdueTasks = tasks.filter((t) => {
    if (!t.dueWindow?.end) return false
    return new Date(t.dueWindow.end) < BASE_DATE && t.status !== "completed"
  }).length

  const suggestedTasks = generateSuggestedTasks()
  const avgConfidence =
    suggestedTasks.reduce((sum, s) => sum + s.confidence, 0) / suggestedTasks.length

  return {
    totalTasks,
    activeTasks,
    completedTasks,
    blockedTasks,
    overdueTasks,
    completionRate: (completedTasks / totalTasks) * 100,
    averageCompletionTime: 210,
    totalTeams: teams.length,
    totalAssignees: MOCK_USERS.length,
    suggestedTasksCount: suggestedTasks.length,
    averageSuggestionConfidence: avgConfidence,
    teamAnalytics,
    personAnalytics: [], // Will be computed per person as needed
    lastUpdated: BASE_DATE.toISOString(),
  }
}

// Export all tasks
export const MOCK_TASKS = generateMockTasks()
export const SUGGESTED_TASKS = generateSuggestedTasks()
export const SYSTEM_ANALYTICS = generateSystemAnalytics()

