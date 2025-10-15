/**
 * Floor Tasks Mock Data
 * 
 * Task assignments for floor workers
 */

export type TaskType = 
  | 'stage-completion' 
  | 'qc-check' 
  | 'material-scan' 
  | 'equipment-maintenance'
  | 'batch-processing'
  | 'inventory-count'

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical'

export type ScheduleStatus = 'ahead' | 'on-time' | 'behind' | 'at-risk'

export type FloorTask = {
  id: string
  type: TaskType
  title: string
  description: string
  assignedTo: string         // Worker ID
  assignedTeam: string
  lineItemId?: string        // Links to MOCK_LINE_ITEMS
  itemCodeId?: string        // Links to MOCK_ITEM_CODES
  stage?: string             // Workflow stage name
  priority: TaskPriority
  scheduleStatus: ScheduleStatus
  dueDate: string            // ISO timestamp
  scheduledFor?: string      // When task becomes active
  blockedBy?: string[]       // Task IDs that must complete first
  estimatedDuration: number  // Minutes
  completed: boolean
  completedAt?: string
  createdAt: string
  location: string
}

// Helper to create timestamps
const now = new Date()
const today = now.toISOString().split('T')[0]

export const MOCK_FLOOR_TASKS: FloorTask[] = [
  // High priority - behind schedule
  {
    id: "task-001",
    type: "stage-completion",
    title: "Complete Sewing Stage",
    description: "Finish sewing operation for JKT-AURORA-M-001",
    assignedTo: "worker-001",
    assignedTeam: "Production Ops",
    lineItemId: "LINE-JKT-M-001",
    itemCodeId: "IC-001",
    stage: "Sewing",
    priority: "high",
    scheduleStatus: "behind",
    dueDate: new Date(now.getTime() + 1 * 60 * 60 * 1000).toISOString(), // 1 hour from now
    estimatedDuration: 90,
    completed: false,
    createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
    location: "Factory A - Sewing Line A - Station 3"
  },
  
  // Critical - at risk
  {
    id: "task-002",
    type: "qc-check",
    title: "Quality Check - Hold Item",
    description: "Inspect JKT-AURORA-M-005 for fabric defect resolution",
    assignedTo: "worker-001",
    assignedTeam: "Production Ops",
    lineItemId: "LINE-JKT-M-005",
    itemCodeId: "IC-001",
    stage: "Sewing",
    priority: "critical",
    scheduleStatus: "at-risk",
    dueDate: new Date(now.getTime() + 30 * 60 * 1000).toISOString(), // 30 min from now
    estimatedDuration: 20,
    completed: false,
    createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
    location: "Factory A - Sewing Line B - Station 1"
  },
  
  // Medium priority - on time
  {
    id: "task-003",
    type: "stage-completion",
    title: "Begin Finishing Stage",
    description: "Move JKT-AURORA-M-003 to finishing station",
    assignedTo: "worker-001",
    assignedTeam: "Production Ops",
    lineItemId: "LINE-JKT-M-003",
    itemCodeId: "IC-001",
    stage: "Finishing",
    priority: "medium",
    scheduleStatus: "on-time",
    dueDate: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    estimatedDuration: 45,
    completed: false,
    createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
    location: "Factory A - Finishing - Station 2"
  },
  
  // Low priority - ahead
  {
    id: "task-004",
    type: "material-scan",
    title: "Scan Incoming Materials",
    description: "Log new fabric roll delivery batch #FR-2401",
    assignedTo: "worker-001",
    assignedTeam: "Production Ops",
    priority: "low",
    scheduleStatus: "ahead",
    dueDate: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
    estimatedDuration: 15,
    completed: false,
    createdAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
    location: "Factory A - Receiving Dock"
  },
  
  // Medium - on time
  {
    id: "task-005",
    type: "batch-processing",
    title: "Process Cut Pieces Batch",
    description: "Organize and verify cut pieces for next sewing batch",
    assignedTo: "worker-001",
    assignedTeam: "Production Ops",
    priority: "medium",
    scheduleStatus: "on-time",
    dueDate: new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours from now
    estimatedDuration: 60,
    completed: false,
    createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    location: "Factory A - Cutting"
  },
  
  // Completed tasks
  {
    id: "task-101",
    type: "stage-completion",
    title: "Complete QC Inspection",
    description: "Final quality check for JKT-AURORA-M-004",
    assignedTo: "worker-001",
    assignedTeam: "Production Ops",
    lineItemId: "LINE-JKT-M-004",
    itemCodeId: "IC-001",
    stage: "QC",
    priority: "high",
    scheduleStatus: "ahead",
    dueDate: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    estimatedDuration: 30,
    completed: true,
    completedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
    location: "Factory A - QC Station"
  },
  {
    id: "task-102",
    type: "material-scan",
    title: "Morning Material Scan",
    description: "Scan all materials received in morning delivery",
    assignedTo: "worker-001",
    assignedTeam: "Production Ops",
    priority: "medium",
    scheduleStatus: "on-time",
    dueDate: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
    estimatedDuration: 20,
    completed: true,
    completedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
    location: "Factory A - Receiving Dock"
  },
  {
    id: "task-103",
    type: "equipment-maintenance",
    title: "Check Sewing Machine #12",
    description: "Routine maintenance check and lubrication",
    assignedTo: "worker-001",
    assignedTeam: "Production Ops",
    priority: "low",
    scheduleStatus: "ahead",
    dueDate: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
    estimatedDuration: 15,
    completed: true,
    completedAt: new Date(now.getTime() - 5.5 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
    location: "Factory A - Sewing Line A"
  },
  
  // Upcoming/Scheduled tasks
  {
    id: "task-201",
    type: "stage-completion",
    title: "Begin QC Inspection",
    description: "Quality check for JKT-AURORA-M-003 after finishing",
    assignedTo: "worker-001",
    assignedTeam: "Production Ops",
    lineItemId: "LINE-JKT-M-003",
    itemCodeId: "IC-001",
    stage: "QC",
    priority: "high",
    scheduleStatus: "on-time",
    dueDate: new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours from now
    scheduledFor: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    blockedBy: ["task-003"], // Waiting on finishing stage
    estimatedDuration: 30,
    completed: false,
    createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
    location: "Factory A - QC Station"
  },
  {
    id: "task-202",
    type: "batch-processing",
    title: "Prepare Next Production Batch",
    description: "Set up materials and workspace for next jacket batch",
    assignedTo: "worker-001",
    assignedTeam: "Production Ops",
    priority: "medium",
    scheduleStatus: "ahead",
    dueDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    scheduledFor: new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours from now
    estimatedDuration: 45,
    completed: false,
    createdAt: now.toISOString(),
    location: "Factory A - Production Floor"
  },
  {
    id: "task-203",
    type: "inventory-count",
    title: "Weekly Material Inventory",
    description: "Count and verify fabric rolls and materials stock",
    assignedTo: "worker-001",
    assignedTeam: "Production Ops",
    priority: "low",
    scheduleStatus: "on-time",
    dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    scheduledFor: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    estimatedDuration: 60,
    completed: false,
    createdAt: now.toISOString(),
    location: "Factory A - Materials Storage"
  }
]

export function getTasksByWorker(workerId: string, includeCompleted = true): FloorTask[] {
  return MOCK_FLOOR_TASKS.filter(task => 
    task.assignedTo === workerId && (includeCompleted || !task.completed)
  )
}

export function getActiveTasksByWorker(workerId: string): FloorTask[] {
  const now = new Date();
  return getTasksByWorker(workerId, false)
    .filter(task => !task.scheduledFor || new Date(task.scheduledFor) <= now)
    .sort((a, b) => {
      // Sort by priority and schedule status
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
      const statusOrder = { 'at-risk': 0, behind: 1, 'on-time': 2, ahead: 3 }
      
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
      if (priorityDiff !== 0) return priorityDiff
      
      return statusOrder[a.scheduleStatus] - statusOrder[b.scheduleStatus]
    })
}

export function getCompletedTasksByWorker(workerId: string): FloorTask[] {
  return MOCK_FLOOR_TASKS
    .filter(task => task.assignedTo === workerId && task.completed)
    .sort((a, b) => {
      if (!a.completedAt || !b.completedAt) return 0
      return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    })
}

export function getUpcomingTasksByWorker(workerId: string): FloorTask[] {
  const now = new Date();
  return MOCK_FLOOR_TASKS
    .filter(task => 
      task.assignedTo === workerId && 
      !task.completed && 
      task.scheduledFor && 
      new Date(task.scheduledFor) > now
    )
    .sort((a, b) => {
      if (!a.scheduledFor || !b.scheduledFor) return 0;
      return new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime();
    });
}

export function getTaskById(id: string): FloorTask | undefined {
  return MOCK_FLOOR_TASKS.find(task => task.id === id)
}

export function getScheduleStatusColor(status: ScheduleStatus) {
  switch (status) {
    case 'ahead': return { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-900', accent: 'bg-green-500' }
    case 'on-time': return { bg: 'bg-yellow-50', border: 'border-yellow-500', text: 'text-yellow-900', accent: 'bg-yellow-500' }
    case 'behind': return { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-900', accent: 'bg-red-500' }
    case 'at-risk': return { bg: 'bg-rose-50', border: 'border-rose-900', text: 'text-rose-900', accent: 'bg-rose-900' }
  }
}

export function getPriorityBadge(priority: TaskPriority) {
  switch (priority) {
    case 'critical': return { bg: 'bg-red-600', text: 'text-white', label: 'CRITICAL' }
    case 'high': return { bg: 'bg-orange-500', text: 'text-white', label: 'HIGH' }
    case 'medium': return { bg: 'bg-blue-500', text: 'text-white', label: 'MEDIUM' }
    case 'low': return { bg: 'bg-slate-500', text: 'text-white', label: 'LOW' }
  }
}

