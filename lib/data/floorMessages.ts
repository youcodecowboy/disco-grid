/**
 * Floor Messages Mock Data
 * 
 * Messages and notifications from management to floor workers
 */

export type MessagePriority = 'low' | 'normal' | 'high' | 'urgent'

export type MessageType = 
  | 'announcement' 
  | 'alert' 
  | 'task-update' 
  | 'schedule-change'
  | 'safety-notice'
  | 'quality-alert'

export type FloorMessage = {
  id: string
  type: MessageType
  priority: MessagePriority
  from: string              // Sender name
  fromId?: string           // Sender ID
  fromRole: string
  to?: string               // Recipient name
  toId?: string             // Recipient ID
  subject: string
  message: string
  timestamp: string
  read: boolean
  archived: boolean
  recipientId?: string      // Worker ID, undefined = broadcast
  sentBy?: string           // Worker ID if sent by worker
}

const now = new Date()

export const MOCK_FLOOR_MESSAGES: FloorMessage[] = [
  {
    id: "msg-001",
    type: "quality-alert",
    priority: "urgent",
    from: "Lauren Medina",
    fromRole: "Production Manager",
    subject: "Fabric Defect - Batch FR-2398",
    message: "Quality alert: Fabric roll FR-2398 has been flagged for defects. Please hold all items using this batch and await replacement panels. Check line items #005 and #006.",
    timestamp: new Date(now.getTime() - 25 * 60 * 1000).toISOString(), // 25 min ago
    read: false,
    archived: false,
    recipientId: "worker-001"
  },
  {
    id: "msg-002",
    type: "schedule-change",
    priority: "high",
    from: "Operations Team",
    fromRole: "Operations",
    subject: "Production Schedule Updated",
    message: "Aurora Flight Jacket order deadline moved up by 2 days. Priority increased on all remaining units. Please expedite current tasks.",
    timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    read: false,
    archived: false,
    recipientId: "worker-001"
  },
  {
    id: "msg-003",
    type: "task-update",
    priority: "normal",
    from: "James Chen",
    fromRole: "QC Lead",
    subject: "Excellent Work on Batch #1234",
    message: "Great job on the quality of items in batch #1234. Zero defects found during inspection. Keep up the excellent work!",
    timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    read: true,
    archived: false,
    recipientId: "worker-001"
  },
  {
    id: "msg-004",
    type: "announcement",
    priority: "normal",
    from: "Management",
    fromRole: "Management",
    subject: "Lunch Break Schedule",
    message: "Team lunch breaks will be staggered today starting at 11:30 AM. Your assigned time is 12:15 PM. Please plan accordingly.",
    timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    read: true,
    archived: false
  },
  {
    id: "msg-005",
    type: "safety-notice",
    priority: "high",
    from: "Safety Department",
    fromRole: "Safety",
    subject: "Machine Maintenance - Line A",
    message: "Sewing machines on Line A will undergo maintenance this afternoon from 3-4 PM. Please complete current tasks and clear the area by 2:45 PM.",
    timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    read: true,
    archived: false
  },
  {
    id: "msg-006",
    type: "announcement",
    priority: "low",
    from: "HR Department",
    fromRole: "HR",
    subject: "Weekly Team Meeting",
    message: "Weekly team standup meeting tomorrow at 9 AM in Conference Room B. Attendance is optional but encouraged.",
    timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    read: true,
    archived: false
  }
]

export function getMessagesByWorker(workerId: string, includeArchived = false): FloorMessage[] {
  return MOCK_FLOOR_MESSAGES.filter(msg => 
    (msg.recipientId === workerId || !msg.recipientId) && 
    (includeArchived || !msg.archived)
  ).sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
}

export function getUnreadMessageCount(workerId: string): number {
  return MOCK_FLOOR_MESSAGES.filter(msg => 
    (msg.recipientId === workerId || !msg.recipientId) && 
    !msg.read && 
    !msg.archived
  ).length
}

export function getMessageById(id: string): FloorMessage | undefined {
  return MOCK_FLOOR_MESSAGES.find(msg => msg.id === id)
}

export function getPriorityColor(priority: MessagePriority) {
  switch (priority) {
    case 'urgent': return { bg: 'bg-red-100', border: 'border-red-500', text: 'text-red-900', dot: 'bg-red-500' }
    case 'high': return { bg: 'bg-orange-100', border: 'border-orange-500', text: 'text-orange-900', dot: 'bg-orange-500' }
    case 'normal': return { bg: 'bg-blue-100', border: 'border-blue-500', text: 'text-blue-900', dot: 'bg-blue-500' }
    case 'low': return { bg: 'bg-slate-100', border: 'border-slate-500', text: 'text-slate-900', dot: 'bg-slate-500' }
  }
}

export function getSentMessagesByWorker(workerId: string): FloorMessage[] {
  return MOCK_FLOOR_MESSAGES
    .filter(msg => msg.sentBy === workerId)
    .sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
}

export function getMessageTypeIcon(type: MessageType): string {
  switch (type) {
    case 'announcement': return '📢'
    case 'alert': return '⚠️'
    case 'task-update': return '✅'
    case 'schedule-change': return '📅'
    case 'safety-notice': return '🦺'
    case 'quality-alert': return '🔍'
  }
}

