/**
 * Floor Calendar Mock Data
 * 
 * Calendar events and milestones for workers
 */

export type CalendarEventType = 
  | 'task'
  | 'milestone'
  | 'deadline'
  | 'meeting'
  | 'break'
  | 'shift'

export type CalendarEvent = {
  id: string
  type: CalendarEventType
  title: string
  description?: string
  date: string              // ISO date string
  startTime?: string        // HH:MM format
  endTime?: string          // HH:MM format
  allDay: boolean
  priority: 'low' | 'medium' | 'high' | 'critical'
  scheduleStatus?: 'ahead' | 'on-time' | 'behind' | 'at-risk'
  relatedTaskId?: string
  relatedItemCodeId?: string
  relatedOrderId?: string
  assignedTo: string[]      // Worker IDs
  location?: string
  completed: boolean
}

// Helper to get dates
const today = new Date()
const getDateOffset = (days: number) => {
  const date = new Date(today)
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
}

export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
  // Today
  {
    id: 'cal-001',
    type: 'shift',
    title: 'Morning Shift',
    date: getDateOffset(0),
    startTime: '08:00',
    endTime: '16:00',
    allDay: false,
    priority: 'medium',
    assignedTo: ['worker-001'],
    location: 'Factory A',
    completed: false
  },
  {
    id: 'cal-002',
    type: 'task',
    title: 'Complete Sewing Stage - JKT-M-001',
    description: 'Finish sewing operation for Aurora jacket',
    date: getDateOffset(0),
    startTime: '09:00',
    endTime: '11:00',
    allDay: false,
    priority: 'high',
    scheduleStatus: 'behind',
    relatedTaskId: 'task-001',
    relatedItemCodeId: 'IC-001',
    assignedTo: ['worker-001'],
    location: 'Factory A - Sewing Line A',
    completed: false
  },
  {
    id: 'cal-003',
    type: 'break',
    title: 'Lunch Break',
    date: getDateOffset(0),
    startTime: '12:15',
    endTime: '13:00',
    allDay: false,
    priority: 'low',
    assignedTo: ['worker-001'],
    location: 'Factory A - Cafeteria',
    completed: false
  },
  {
    id: 'cal-004',
    type: 'meeting',
    title: 'Safety Briefing',
    description: 'Weekly safety and equipment maintenance briefing',
    date: getDateOffset(0),
    startTime: '15:00',
    endTime: '15:30',
    allDay: false,
    priority: 'medium',
    assignedTo: ['worker-001'],
    location: 'Factory A - Conference Room',
    completed: false
  },
  
  // Tomorrow
  {
    id: 'cal-005',
    type: 'milestone',
    title: 'Order ORD-2025-001 Deadline',
    description: 'Aurora Flight Jacket order must be ready for shipment',
    date: getDateOffset(1),
    allDay: true,
    priority: 'critical',
    scheduleStatus: 'on-time',
    relatedOrderId: 'ORD-2025-001',
    assignedTo: ['worker-001'],
    completed: false
  },
  {
    id: 'cal-006',
    type: 'task',
    title: 'Prepare Next Production Batch',
    description: 'Set up materials for next jacket batch',
    date: getDateOffset(1),
    startTime: '10:00',
    endTime: '11:00',
    allDay: false,
    priority: 'medium',
    scheduleStatus: 'ahead',
    relatedTaskId: 'task-202',
    assignedTo: ['worker-001'],
    location: 'Factory A - Production Floor',
    completed: false
  },
  {
    id: 'cal-007',
    type: 'task',
    title: 'Weekly Material Inventory',
    description: 'Count and verify fabric rolls',
    date: getDateOffset(1),
    startTime: '14:00',
    endTime: '15:00',
    allDay: false,
    priority: 'low',
    scheduleStatus: 'on-time',
    relatedTaskId: 'task-203',
    assignedTo: ['worker-001'],
    location: 'Factory A - Materials Storage',
    completed: false
  },
  
  // Day after tomorrow
  {
    id: 'cal-008',
    type: 'deadline',
    title: 'Component Assembly Due',
    description: 'All components for hybrid jacket must be ready',
    date: getDateOffset(2),
    startTime: '12:00',
    allDay: false,
    priority: 'high',
    scheduleStatus: 'on-time',
    assignedTo: ['worker-001'],
    completed: false
  },
  
  // 3 days from now
  {
    id: 'cal-009',
    type: 'meeting',
    title: 'Team Standup',
    description: 'Weekly production team meeting',
    date: getDateOffset(3),
    startTime: '09:00',
    endTime: '09:30',
    allDay: false,
    priority: 'medium',
    assignedTo: ['worker-001'],
    location: 'Factory A - Conference Room B',
    completed: false
  },
  
  // 4 days from now
  {
    id: 'cal-010',
    type: 'milestone',
    title: 'New Order Kickoff',
    description: 'Start production on new tactical vest order',
    date: getDateOffset(4),
    allDay: true,
    priority: 'high',
    assignedTo: ['worker-001'],
    completed: false
  },
  
  // Next week
  {
    id: 'cal-011',
    type: 'task',
    title: 'Equipment Maintenance Day',
    description: 'Monthly maintenance for all sewing machines',
    date: getDateOffset(7),
    startTime: '08:00',
    endTime: '12:00',
    allDay: false,
    priority: 'medium',
    assignedTo: ['worker-001'],
    location: 'Factory A - Sewing Line A & B',
    completed: false
  }
]

export function getEventsByWorkerAndDateRange(
  workerId: string, 
  startDate: Date, 
  endDate: Date
): CalendarEvent[] {
  const startStr = startDate.toISOString().split('T')[0]
  const endStr = endDate.toISOString().split('T')[0]
  
  return MOCK_CALENDAR_EVENTS
    .filter(event => 
      event.assignedTo.includes(workerId) &&
      event.date >= startStr &&
      event.date <= endStr
    )
    .sort((a, b) => {
      // Sort by date first
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date)
      }
      // Then by start time
      if (a.startTime && b.startTime) {
        return a.startTime.localeCompare(b.startTime)
      }
      // All-day events come first
      if (a.allDay && !b.allDay) return -1
      if (!a.allDay && b.allDay) return 1
      return 0
    })
}

export function getEventsForWeek(workerId: string, weekStart: Date): CalendarEvent[] {
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)
  return getEventsByWorkerAndDateRange(workerId, weekStart, weekEnd)
}

export function getEventsForDay(workerId: string, date: Date): CalendarEvent[] {
  const dateStr = date.toISOString().split('T')[0]
  return MOCK_CALENDAR_EVENTS
    .filter(event => 
      event.assignedTo.includes(workerId) &&
      event.date === dateStr
    )
    .sort((a, b) => {
      if (a.startTime && b.startTime) {
        return a.startTime.localeCompare(b.startTime)
      }
      if (a.allDay && !b.allDay) return -1
      if (!a.allDay && b.allDay) return 1
      return 0
    })
}

export function getEventTypeColor(type: CalendarEventType) {
  switch (type) {
    case 'task': return { bg: 'bg-white', border: 'border-blue-500', text: 'text-slate-900', accent: 'bg-blue-500' }
    case 'milestone': return { bg: 'bg-white', border: 'border-purple-500', text: 'text-slate-900', accent: 'bg-purple-500' }
    case 'deadline': return { bg: 'bg-white', border: 'border-red-500', text: 'text-slate-900', accent: 'bg-red-500' }
    case 'meeting': return { bg: 'bg-white', border: 'border-green-500', text: 'text-slate-900', accent: 'bg-green-500' }
    case 'break': return { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700', accent: 'bg-slate-400' }
    case 'shift': return { bg: 'bg-white', border: 'border-amber-500', text: 'text-slate-900', accent: 'bg-amber-500' }
  }
}

export function getCurrentWeekStart(): Date {
  const today = new Date()
  const day = today.getDay()
  const diff = today.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
  const monday = new Date(today.setDate(diff))
  monday.setHours(0, 0, 0, 0)
  return monday
}

export function getWeekDays(weekStart: Date): Date[] {
  const days: Date[] = []
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart)
    day.setDate(day.getDate() + i)
    days.push(day)
  }
  return days
}

