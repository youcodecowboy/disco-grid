/**
 * Context Collector - Aggregates operational data for LLM analysis
 * 
 * Collects data from:
 * - Event registry (real-time events)
 * - Task system (active/completed tasks)
 * - Workflows (active stages, bottlenecks)
 * - Calendar (upcoming events, deadlines)
 * - Playbooks (execution patterns)
 * - Teams (workloads, capacity)
 * - Orders (status, deadlines)
 * 
 * Normalizes and summarizes with equal weighting across all sources.
 */

import { contextRegistry, type EventFilters } from './contextRegistry'
import { MOCK_TASKS, MOCK_TEAMS, SYSTEM_ANALYTICS } from '../mockData'
import type { Task, TeamTaskAnalytics } from '../types'
import { MOCK_CALENDAR_EVENTS, type CalendarEvent } from '@/lib/data/floorCalendar'
import { MOCK_WORKFLOWS } from '@/lib/workflows-v3/mockData'
import type { WorkflowV3 } from '@/lib/workflows-v3/types'
import { MOCK_PLAYBOOKS } from '@/lib/playbooks/mockData'
import type { Playbook } from '@/lib/playbooks/types'
import { generateMockTeams, type Team } from '@/lib/data/teams'
import { subDays, addDays, isAfter, isBefore, parseISO } from 'date-fns'

export type ISODateTime = string

export interface LLMContext {
  // Equal weighting across all sources
  tasks: TaskContext
  workflows: WorkflowContext
  calendar: CalendarContext
  playbooks: PlaybookContext
  teams: TeamContext
  orders: OrderContext
  
  // Metadata
  collectedAt: ISODateTime
  timeHorizon: number // Days looked ahead/back
  totalEvents: number
  snapshotVersion: string
}

export interface TaskContext {
  active: TaskSummary[]
  completed: TaskSummary[]
  blocked: TaskSummary[]
  upcoming: TaskSummary[]
  recentCompletions: TaskSummary[]
  summary: {
    totalActive: number
    totalBlocked: number
    totalUpcoming: number
    completionRate: number
    averageCompletionTime: number
    blockedPercentage: number
  }
}

export interface WorkflowContext {
  active: WorkflowSummary[]
  bottlenecks: BottleneckSummary[]
  stageActivity: StageActivitySummary[]
  summary: {
    totalActive: number
    totalItemsInWorkflow: number
    averageCompletionRate: number
    bottlenecksCount: number
  }
}

export interface CalendarContext {
  upcoming: CalendarEventSummary[]
  deadlines: CalendarEventSummary[]
  meetings: CalendarEventSummary[]
  summary: {
    totalUpcoming: number
    criticalDeadlines: number
    scheduledMeetings: number
    next7Days: number
    next14Days: number
  }
}

export interface PlaybookContext {
  active: PlaybookSummary[]
  executionPatterns: ExecutionPattern[]
  summary: {
    totalActive: number
    totalExecutions: number
    averageExecutionRate: number
  }
}

export interface TeamContext {
  teams: TeamWorkloadSummary[]
  capacity: CapacitySummary
  summary: {
    totalTeams: number
    averageUtilization: number
    overloadedTeams: number
    underutilizedTeams: number
  }
}

export interface OrderContext {
  active: OrderSummary[]
  upcomingDeadlines: OrderSummary[]
  summary: {
    totalActive: number
    upcomingDeadlines: number
  }
}

// Summary types for normalized data
export interface TaskSummary {
  id: string
  title: string
  status: string
  priority: string
  teamId?: string
  teamName?: string
  dueDate?: ISODateTime
  assignees: string[]
  blockers: number
  isOverdue: boolean
}

export interface WorkflowSummary {
  id: string
  name: string
  activeItems: number
  currentStages: string[]
  completionRate?: number
  averageDuration?: number
}

export interface BottleneckSummary {
  workflowId: string
  workflowName: string
  stageId: string
  stageName: string
  itemsWaiting: number
  reason: string
}

export interface StageActivitySummary {
  stageId: string
  stageName: string
  workflowId: string
  workflowName: string
  itemsInStage: number
  averageTimeInStage?: number
}

export interface CalendarEventSummary {
  id: string
  title: string
  type: string
  date: string
  priority: string
  relatedTaskId?: string
  relatedOrderId?: string
  assignedTo: string[]
  isCritical: boolean
}

export interface PlaybookSummary {
  id: string
  name: string
  active: boolean
  playCount: number
  executionCount: number
}

export interface ExecutionPattern {
  playbookId: string
  playbookName: string
  triggerType: string
  frequency: number
  successRate: number
}

export interface TeamWorkloadSummary {
  teamId: string
  teamName: string
  activeTasks: number
  completedTasks: number
  blockedTasks: number
  utilizationRate: number
  capacity: number
  members: number
}

export interface CapacitySummary {
  totalCapacity: number
  usedCapacity: number
  availableCapacity: number
  utilizationPercentage: number
}

export interface OrderSummary {
  id: string
  orderNumber?: string
  status: string
  deadline?: ISODateTime
  isOverdue: boolean
}

export interface CollectContextOptions {
  timeHorizon?: number // Days to look ahead/back (default: 7)
  teamIds?: string[] // Filter by teams
  includeTypes?: string[] // Filter event types
}

/**
 * Collect context for LLM analysis
 */
export async function collectContextForLLM(
  options: CollectContextOptions = {}
): Promise<LLMContext> {
  const {
    timeHorizon = 7,
    teamIds,
    includeTypes
  } = options

  const now = new Date()
  const horizonStart = subDays(now, timeHorizon)
  const horizonEnd = addDays(now, timeHorizon * 2) // Look further ahead

  // 1. Query recent events from registry
  const eventFilters: EventFilters = {
    since: horizonStart.toISOString(),
    until: horizonEnd.toISOString(),
    teamIds,
    types: includeTypes as any
  }
  const recentEvents = await contextRegistry.queryEvents(eventFilters)

  // 2. Collect context from all sources with equal weighting
  const tasks = await collectTaskContext(timeHorizon, teamIds, horizonEnd)
  const workflows = await collectWorkflowContext()
  const calendar = await collectCalendarContext(horizonEnd)
  const playbooks = await collectPlaybookContext()
  const teams = await collectTeamContext(teamIds)
  const orders = await collectOrderContext(horizonEnd)

  return {
    tasks,
    workflows,
    calendar,
    playbooks,
    teams,
    orders,
    collectedAt: now.toISOString(),
    timeHorizon,
    totalEvents: recentEvents.length,
    snapshotVersion: '1.0'
  }
}

/**
 * Collect task context
 */
async function collectTaskContext(
  timeHorizon: number,
  teamIds?: string[],
  horizonEnd?: Date
): Promise<TaskContext> {
  // Filter tasks
  let tasks = [...MOCK_TASKS]
  if (teamIds && teamIds.length > 0) {
    tasks = tasks.filter(t => t.owningTeamId && teamIds.includes(t.owningTeamId))
  }

  const now = new Date()
  const horizonStart = subDays(now, timeHorizon)

  // Categorize tasks
  const active = tasks.filter(t => 
    !['completed', 'archived'].includes(t.status)
  )
  const completed = tasks.filter(t => 
    t.status === 'completed' && 
    t.completedAt && 
    parseISO(t.completedAt) >= horizonStart
  )
  const blocked = tasks.filter(t => t.status === 'blocked')
  const upcoming = tasks.filter(t => {
    if (!t.dueWindow?.end) return false
    const dueDate = parseISO(t.dueWindow.end)
    return isAfter(dueDate, now) && (!horizonEnd || isBefore(dueDate, horizonEnd))
  })

  // Calculate summary statistics
  const totalActive = active.length
  const totalBlocked = blocked.length
  const totalUpcoming = upcoming.length
  const completionRate = tasks.length > 0 
    ? (completed.length / tasks.length) * 100 
    : 0
  const averageCompletionTime = calculateAverageCompletionTime(completed)
  const blockedPercentage = totalActive > 0 
    ? (totalBlocked / totalActive) * 100 
    : 0

  return {
    active: normalizeTasks(active),
    completed: normalizeTasks(completed.slice(0, 50)), // Limit to recent 50
    blocked: normalizeTasks(blocked),
    upcoming: normalizeTasks(upcoming),
    recentCompletions: normalizeTasks(completed.slice(0, 20)), // Most recent 20
    summary: {
      totalActive,
      totalBlocked,
      totalUpcoming,
      completionRate,
      averageCompletionTime,
      blockedPercentage
    }
  }
}

/**
 * Collect workflow context
 */
async function collectWorkflowContext(): Promise<WorkflowContext> {
  const activeWorkflows = MOCK_WORKFLOWS.filter(w => w.active)
  
  const workflows: WorkflowSummary[] = activeWorkflows.map(w => ({
    id: w.id,
    name: w.name,
    activeItems: w.activeItemCount,
    currentStages: w.stages
      .filter(s => !s.isComplete)
      .map(s => s.name),
    completionRate: w.completionRate,
    averageDuration: w.averageDuration
  }))

  // Identify bottlenecks (stages with many dependencies or long waits)
  const bottlenecks: BottleneckSummary[] = []
  activeWorkflows.forEach(w => {
    w.stages.forEach(stage => {
      if (stage.dependencies.length > 2) {
        bottlenecks.push({
          workflowId: w.id,
          workflowName: w.name,
          stageId: stage.id,
          stageName: stage.name,
          itemsWaiting: Math.floor(Math.random() * 10) + 1, // Mock for now
          reason: `Multiple dependencies (${stage.dependencies.length})`
        })
      }
    })
  })

  // Stage activity
  const stageActivity: StageActivitySummary[] = []
  activeWorkflows.forEach(w => {
    w.stages.forEach(stage => {
      stageActivity.push({
        stageId: stage.id,
        stageName: stage.name,
        workflowId: w.id,
        workflowName: w.name,
        itemsInStage: Math.floor(Math.random() * 5), // Mock for now
        averageTimeInStage: stage.estimatedDuration
      })
    })
  })

  const totalItemsInWorkflow = workflows.reduce((sum, w) => sum + w.activeItems, 0)
  const averageCompletionRate = workflows.length > 0
    ? workflows.reduce((sum, w) => sum + (w.completionRate || 0), 0) / workflows.length
    : 0

  return {
    active: workflows,
    bottlenecks,
    stageActivity,
    summary: {
      totalActive: workflows.length,
      totalItemsInWorkflow,
      averageCompletionRate,
      bottlenecksCount: bottlenecks.length
    }
  }
}

/**
 * Collect calendar context
 */
async function collectCalendarContext(horizonEnd: Date): Promise<CalendarContext> {
  const now = new Date()
  
  const upcoming = MOCK_CALENDAR_EVENTS.filter(e => {
    const eventDate = parseISO(e.date)
    return isAfter(eventDate, now) && isBefore(eventDate, horizonEnd) && !e.completed
  })

  const deadlines = upcoming.filter(e => 
    e.type === 'deadline' || e.type === 'milestone'
  )
  const meetings = upcoming.filter(e => e.type === 'meeting')

  const next7Days = upcoming.filter(e => {
    const eventDate = parseISO(e.date)
    return isBefore(eventDate, addDays(now, 7))
  }).length

  const next14Days = upcoming.filter(e => {
    const eventDate = parseISO(e.date)
    return isBefore(eventDate, addDays(now, 14))
  }).length

  return {
    upcoming: normalizeCalendarEvents(upcoming),
    deadlines: normalizeCalendarEvents(deadlines),
    meetings: normalizeCalendarEvents(meetings),
    summary: {
      totalUpcoming: upcoming.length,
      criticalDeadlines: deadlines.filter(e => e.priority === 'critical' || e.priority === 'high').length,
      scheduledMeetings: meetings.length,
      next7Days,
      next14Days
    }
  }
}

/**
 * Collect playbook context
 */
async function collectPlaybookContext(): Promise<PlaybookContext> {
  const activePlaybooks = MOCK_PLAYBOOKS.filter(p => p.active)

  const playbooks: PlaybookSummary[] = activePlaybooks.map(p => ({
    id: p.id,
    name: p.name,
    active: p.active,
    playCount: p.plays.length,
    executionCount: Math.floor(Math.random() * 50) + 10 // Mock execution count
  }))

  // Execution patterns (mock for now - would come from execution history)
  const executionPatterns: ExecutionPattern[] = activePlaybooks.map(p => ({
    playbookId: p.id,
    playbookName: p.name,
    triggerType: p.plays[0]?.trigger.type || 'unknown',
    frequency: Math.floor(Math.random() * 20) + 5,
    successRate: 0.85 + Math.random() * 0.15
  }))

  const totalExecutions = playbooks.reduce((sum, p) => sum + p.executionCount, 0)
  const averageExecutionRate = playbooks.length > 0
    ? totalExecutions / playbooks.length
    : 0

  return {
    active: playbooks,
    executionPatterns,
    summary: {
      totalActive: playbooks.length,
      totalExecutions,
      averageExecutionRate
    }
  }
}

/**
 * Collect team context
 */
async function collectTeamContext(teamIds?: string[]): Promise<TeamContext> {
  let teams = generateMockTeams()
  if (teamIds && teamIds.length > 0) {
    teams = teams.filter(t => teamIds.includes(t.id))
  }

  const teamWorkloads: TeamWorkloadSummary[] = teams.map(team => {
    const analytics = SYSTEM_ANALYTICS.teamAnalytics.find(
      a => a.teamId === team.id
    ) || {
      activeTasks: 0,
      completedTasks: 0,
      blockedTasks: 0,
      completionRate: 0
    }

    return {
      teamId: team.id,
      teamName: team.name,
      activeTasks: analytics.activeTasks,
      completedTasks: analytics.completedTasks,
      blockedTasks: analytics.blockedTasks,
      utilizationRate: team.utilizationRate,
      capacity: team.capacity,
      members: team.memberIds.length
    }
  })

  const totalCapacity = teamWorkloads.reduce((sum, t) => sum + t.capacity, 0)
  const usedCapacity = teamWorkloads.reduce((sum, t) => sum + t.activeTasks, 0)
  const availableCapacity = totalCapacity - usedCapacity
  const utilizationPercentage = totalCapacity > 0
    ? (usedCapacity / totalCapacity) * 100
    : 0

  const averageUtilization = teamWorkloads.length > 0
    ? teamWorkloads.reduce((sum, t) => sum + t.utilizationRate, 0) / teamWorkloads.length
    : 0

  const overloadedTeams = teamWorkloads.filter(t => t.utilizationRate > 90).length
  const underutilizedTeams = teamWorkloads.filter(t => t.utilizationRate < 30).length

  return {
    teams: teamWorkloads,
    capacity: {
      totalCapacity,
      usedCapacity,
      availableCapacity,
      utilizationPercentage
    },
    summary: {
      totalTeams: teams.length,
      averageUtilization,
      overloadedTeams,
      underutilizedTeams
    }
  }
}

/**
 * Collect order context (mock for now)
 */
async function collectOrderContext(horizonEnd: Date): Promise<OrderContext> {
  // In production, this would query actual orders
  // For now, extract from calendar events and tasks
  const orderDeadlines = MOCK_CALENDAR_EVENTS
    .filter(e => e.relatedOrderId && e.type === 'deadline')
    .map(e => ({
      id: e.relatedOrderId!,
      orderNumber: e.relatedOrderId,
      status: 'active',
      deadline: e.date,
      isOverdue: parseISO(e.date) < new Date() && !e.completed
    }))

  return {
    active: orderDeadlines,
    upcomingDeadlines: orderDeadlines.filter(o => !o.isOverdue),
    summary: {
      totalActive: orderDeadlines.length,
      upcomingDeadlines: orderDeadlines.filter(o => !o.isOverdue).length
    }
  }
}

// Helper functions

function normalizeTasks(tasks: Task[]): TaskSummary[] {
  return tasks.map(t => ({
    id: t.id,
    title: t.title,
    status: t.status,
    priority: t.priority,
    teamId: t.owningTeamId,
    teamName: t.owningTeamLabel,
    dueDate: t.dueWindow?.end,
    assignees: t.assignments.map(a => a.userId),
    blockers: t.blockers.length,
    isOverdue: t.dueWindow?.end 
      ? parseISO(t.dueWindow.end) < new Date() && t.status !== 'completed'
      : false
  }))
}

function normalizeCalendarEvents(events: CalendarEvent[]): CalendarEventSummary[] {
  return events.map(e => ({
    id: e.id,
    title: e.title,
    type: e.type,
    date: e.date,
    priority: e.priority,
    relatedTaskId: e.relatedTaskId,
    relatedOrderId: e.relatedOrderId,
    assignedTo: e.assignedTo,
    isCritical: e.priority === 'critical' || e.scheduleStatus === 'behind'
  }))
}

function calculateAverageCompletionTime(completedTasks: Task[]): number {
  if (completedTasks.length === 0) return 0

  const times = completedTasks
    .filter(t => t.completedAt && t.createdAt)
    .map(t => {
      const created = parseISO(t.createdAt)
      const completed = parseISO(t.completedAt!)
      return (completed.getTime() - created.getTime()) / (1000 * 60) // minutes
    })
    .filter(t => t > 0 && t < 100000) // Reasonable bounds

  if (times.length === 0) return 0

  return times.reduce((sum, t) => sum + t, 0) / times.length
}

