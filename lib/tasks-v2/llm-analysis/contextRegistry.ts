/**
 * Context Registry - Event-Driven Index
 * 
 * Features across the application write events to this registry.
 * The registry maintains a real-time index of operational changes.
 */

export type ISODateTime = string
export type UUID = string

export type ContextEventType =
  | 'task.created'
  | 'task.updated'
  | 'task.completed'
  | 'task.blocked'
  | 'task.rescheduled'
  | 'task.assigned'
  | 'task.unblocked'
  | 'playbook.executed'
  | 'play.triggered'
  | 'workflow.stage_changed'
  | 'workflow.item_moved'
  | 'calendar.event_scheduled'
  | 'calendar.event_updated'
  | 'order.accepted'
  | 'order.completed'
  | 'order.deadline_changed'
  | 'team.capacity_changed'
  | 'team.member_assigned'
  | 'dependency.resolved'
  | 'blocker.created'
  | 'blocker.resolved'

export type ContextEventSource =
  | 'tasks'
  | 'playbooks'
  | 'workflows'
  | 'calendar'
  | 'orders'
  | 'teams'

export interface ContextEvent {
  id: string
  type: ContextEventType
  timestamp: ISODateTime
  source: ContextEventSource
  entityId: string
  entityType: string
  action: 'created' | 'updated' | 'completed' | 'blocked' | 'resolved' | 'assigned' | 'scheduled' | 'moved' | 'rescheduled'
  data: Record<string, any> // Event-specific payload
  metadata: {
    userId?: string
    teamId?: string
    linkedEntityIds?: string[] // Related entities (e.g., orderId, workflowId)
  }
}

export interface EventFilters {
  since?: ISODateTime
  until?: ISODateTime
  types?: ContextEventType[]
  sources?: ContextEventSource[]
  teamIds?: string[]
  entityIds?: string[]
  entityTypes?: string[]
}

/**
 * Context Registry - In-memory event store
 * 
 * In production, this would be backed by persistent storage (Convex/DB)
 */
class ContextRegistry {
  private events: ContextEvent[] = []
  private snapshotCache: Map<string, { snapshot: any; expiresAt: number }> = new Map()

  /**
   * Register an event - Features call this to write events
   */
  async registerEvent(event: Omit<ContextEvent, 'id' | 'timestamp'>): Promise<ContextEvent> {
    const fullEvent: ContextEvent = {
      ...event,
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    }

    this.events.push(fullEvent)

    // Invalidate relevant snapshots
    this.invalidateSnapshots(event.type, event.source)

    // In production: Also write to persistent storage
    // await db.contextEvents.insert(fullEvent)

    return fullEvent
  }

  /**
   * Query events with filters
   */
  async queryEvents(filters: EventFilters = {}): Promise<ContextEvent[]> {
    let results = [...this.events]

    // Filter by time range
    if (filters.since) {
      results = results.filter(e => e.timestamp >= filters.since!)
    }
    if (filters.until) {
      results = results.filter(e => e.timestamp <= filters.until!)
    }

    // Filter by event types
    if (filters.types && filters.types.length > 0) {
      results = results.filter(e => filters.types!.includes(e.type))
    }

    // Filter by sources
    if (filters.sources && filters.sources.length > 0) {
      results = results.filter(e => filters.sources!.includes(e.source))
    }

    // Filter by teams
    if (filters.teamIds && filters.teamIds.length > 0) {
      results = results.filter(e => 
        e.metadata.teamId && filters.teamIds!.includes(e.metadata.teamId)
      )
    }

    // Filter by entity IDs
    if (filters.entityIds && filters.entityIds.length > 0) {
      results = results.filter(e => filters.entityIds!.includes(e.entityId))
    }

    // Filter by entity types
    if (filters.entityTypes && filters.entityTypes.length > 0) {
      results = results.filter(e => filters.entityTypes!.includes(e.entityType))
    }

    // Sort by timestamp (newest first)
    return results.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  }

  /**
   * Get recent events within a time window
   */
  async getRecentEvents(windowHours: number = 24): Promise<ContextEvent[]> {
    const since = new Date(Date.now() - windowHours * 60 * 60 * 1000).toISOString()
    return this.queryEvents({ since })
  }

  /**
   * Invalidate snapshots when relevant events occur
   */
  private invalidateSnapshots(eventType: ContextEventType, source: ContextEventSource) {
    // Invalidate snapshots based on event type
    const snapshotKeys = this.getSnapshotKeysForEvent(eventType, source)
    snapshotKeys.forEach(key => {
      this.snapshotCache.delete(key)
    })
  }

  /**
   * Determine which snapshot keys to invalidate based on event
   */
  private getSnapshotKeysForEvent(
    eventType: ContextEventType,
    source: ContextEventSource
  ): string[] {
    const keys: string[] = []

    // Always invalidate source-specific snapshot
    keys.push(`snapshot:${source}`)

    // Also invalidate related snapshots
    if (eventType.startsWith('task.')) {
      keys.push('snapshot:tasks')
      keys.push('snapshot:teams') // Team workload affected
    }
    if (eventType.startsWith('workflow.')) {
      keys.push('snapshot:workflows')
      keys.push('snapshot:tasks') // May trigger task creation
    }
    if (eventType.startsWith('calendar.')) {
      keys.push('snapshot:calendar')
      keys.push('snapshot:tasks') // May affect task scheduling
    }
    if (eventType.startsWith('order.')) {
      keys.push('snapshot:orders')
      keys.push('snapshot:workflows') // May trigger workflow stages
    }
    if (eventType.startsWith('team.')) {
      keys.push('snapshot:teams')
    }
    if (eventType.startsWith('playbook.')) {
      keys.push('snapshot:playbooks')
      keys.push('snapshot:tasks') // Playbooks create tasks
    }

    return keys
  }

  /**
   * Store a snapshot with TTL
   */
  storeSnapshot(key: string, snapshot: any, ttlMinutes: number = 60) {
    this.snapshotCache.set(key, {
      snapshot,
      expiresAt: Date.now() + ttlMinutes * 60 * 1000
    })
  }

  /**
   * Get a snapshot if valid, otherwise return null
   */
  getSnapshot(key: string): any | null {
    const cached = this.snapshotCache.get(key)
    if (!cached) return null

    if (Date.now() > cached.expiresAt) {
      this.snapshotCache.delete(key)
      return null
    }

    return cached.snapshot
  }

  /**
   * Clear all events (useful for testing)
   */
  clear() {
    this.events = []
    this.snapshotCache.clear()
  }

  /**
   * Get event count (for monitoring)
   */
  getEventCount(): number {
    return this.events.length
  }
}

// Singleton instance
export const contextRegistry = new ContextRegistry()

// Helper functions for easy event registration
export const registerTaskEvent = async (
  action: 'created' | 'updated' | 'completed' | 'blocked' | 'rescheduled' | 'assigned' | 'unblocked',
  entityId: string,
  data: Record<string, any>,
  metadata?: Partial<ContextEvent['metadata']>
) => {
  return contextRegistry.registerEvent({
    type: `task.${action}` as ContextEventType,
    source: 'tasks',
    entityId,
    entityType: 'task',
    action: action === 'unblocked' ? 'resolved' : action === 'rescheduled' ? 'rescheduled' : action,
    data,
    metadata: metadata || {}
  })
}

export const registerWorkflowEvent = async (
  action: 'stage_changed' | 'item_moved',
  entityId: string,
  data: Record<string, any>,
  metadata?: Partial<ContextEvent['metadata']>
) => {
  return contextRegistry.registerEvent({
    type: `workflow.${action}` as ContextEventType,
    source: 'workflows',
    entityId,
    entityType: action === 'stage_changed' ? 'stage' : 'item',
    action: 'moved',
    data,
    metadata: metadata || {}
  })
}

export const registerCalendarEvent = async (
  action: 'scheduled' | 'updated',
  entityId: string,
  data: Record<string, any>,
  metadata?: Partial<ContextEvent['metadata']>
) => {
  return contextRegistry.registerEvent({
    type: `calendar.event_${action}` as ContextEventType,
    source: 'calendar',
    entityId,
    entityType: 'calendar_event',
    action: action === 'scheduled' ? 'created' : 'updated',
    data,
    metadata: metadata || {}
  })
}

export const registerPlaybookEvent = async (
  action: 'executed' | 'triggered',
  entityId: string,
  data: Record<string, any>,
  metadata?: Partial<ContextEvent['metadata']>
) => {
  return contextRegistry.registerEvent({
    type: action === 'executed' ? 'playbook.executed' : 'play.triggered',
    source: 'playbooks',
    entityId,
    entityType: action === 'executed' ? 'playbook' : 'play',
    action: 'created',
    data,
    metadata: metadata || {}
  })
}

export const registerOrderEvent = async (
  action: 'accepted' | 'completed' | 'deadline_changed',
  entityId: string,
  data: Record<string, any>,
  metadata?: Partial<ContextEvent['metadata']>
) => {
  return contextRegistry.registerEvent({
    type: `order.${action}` as ContextEventType,
    source: 'orders',
    entityId,
    entityType: 'order',
    action: action === 'accepted' ? 'created' : action === 'completed' ? 'completed' : 'updated',
    data,
    metadata: metadata || {}
  })
}

export const registerTeamEvent = async (
  action: 'capacity_changed' | 'member_assigned',
  entityId: string,
  data: Record<string, any>,
  metadata?: Partial<ContextEvent['metadata']>
) => {
  return contextRegistry.registerEvent({
    type: `team.${action}` as ContextEventType,
    source: 'teams',
    entityId,
    entityType: 'team',
    action: action === 'capacity_changed' ? 'updated' : 'assigned',
    data,
    metadata: metadata || {}
  })
}

