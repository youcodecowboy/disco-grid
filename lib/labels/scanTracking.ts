/**
 * Scan Tracking System
 * 
 * Track QR code scans, generate analytics, and manage scan history
 */

import { ScanEvent, ScanAnalytics, ScanAction } from './types'

const STORAGE_KEY = 'groovy:scan-events:v1'

/**
 * Mock scan events for demo
 */
export const MOCK_SCAN_EVENTS: ScanEvent[] = [
  {
    id: 'scan-001',
    labelId: 'label-001',
    entityId: 'LINE-JKT-M-001',
    entityType: 'lineItem',
    entityName: 'Aurora Flight Jacket - M #001',
    action: 'update-stage',
    location: 'Factory A - Sewing Line A - Station 3',
    scannedBy: 'Maria Rodriguez',
    scannedByRole: 'Production Worker',
    notes: 'Completed sewing stage',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    deviceType: 'mobile'
  },
  {
    id: 'scan-002',
    labelId: 'label-002',
    entityId: 'LINE-JKT-M-002',
    entityType: 'lineItem',
    entityName: 'Aurora Flight Jacket - M #002',
    action: 'view',
    location: 'Factory A - Sewing Line A - Station 5',
    scannedBy: 'James Chen',
    scannedByRole: 'Production Worker',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    deviceType: 'mobile'
  },
  {
    id: 'scan-003',
    labelId: 'label-003',
    entityId: 'LINE-JKT-M-003',
    entityType: 'lineItem',
    entityName: 'Aurora Flight Jacket - M #003',
    action: 'qc-check',
    location: 'Factory A - Finishing - Station 2',
    scannedBy: 'Sarah Johnson',
    scannedByRole: 'QC Inspector',
    notes: 'Quality check passed',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    deviceType: 'tablet'
  },
  {
    id: 'scan-004',
    labelId: 'label-005',
    entityId: 'LINE-JKT-M-005',
    entityType: 'lineItem',
    entityName: 'Aurora Flight Jacket - M #005',
    action: 'report-issue',
    location: 'Factory A - Sewing Line B - Station 1',
    scannedBy: 'Production Manager',
    scannedByRole: 'Manager',
    notes: 'Fabric defect detected - awaiting replacement panel',
    timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    deviceType: 'mobile'
  },
  {
    id: 'scan-005',
    labelId: 'label-001',
    entityId: 'LINE-JKT-M-001',
    entityType: 'lineItem',
    entityName: 'Aurora Flight Jacket - M #001',
    action: 'move-location',
    location: 'Factory A - Finishing - Station 1',
    scannedBy: 'Maria Rodriguez',
    scannedByRole: 'Production Worker',
    notes: 'Moved to finishing',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    deviceType: 'mobile'
  }
]

/**
 * Get all scan events
 */
export function getAllScanEvents(): ScanEvent[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const userScans = JSON.parse(stored) as ScanEvent[]
      return [...MOCK_SCAN_EVENTS, ...userScans]
    }
  } catch (error) {
    console.error('Failed to load scan events:', error)
  }
  return MOCK_SCAN_EVENTS
}

/**
 * Get scan events for specific entity
 */
export function getScanEventsForEntity(entityId: string): ScanEvent[] {
  return getAllScanEvents().filter(e => e.entityId === entityId)
}

/**
 * Add new scan event
 */
export function addScanEvent(event: Omit<ScanEvent, 'id' | 'timestamp'>): ScanEvent {
  const newEvent: ScanEvent = {
    ...event,
    id: `scan-${Date.now()}`,
    timestamp: new Date().toISOString()
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const events: ScanEvent[] = stored ? JSON.parse(stored) : []
    events.push(newEvent)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
  } catch (error) {
    console.error('Failed to save scan event:', error)
  }
  
  return newEvent
}

/**
 * Get scan analytics
 */
export function getScanAnalytics(): ScanAnalytics {
  const events = getAllScanEvents()
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  // Calculate metrics
  const totalScans = events.length
  const scansToday = events.filter(e => new Date(e.timestamp) >= todayStart).length
  const uniqueItems = new Set(events.map(e => e.entityId)).size
  
  // Most scanned item
  const itemCounts: Record<string, { name: string; count: number }> = {}
  events.forEach(e => {
    if (!itemCounts[e.entityId]) {
      itemCounts[e.entityId] = { name: e.entityName, count: 0 }
    }
    itemCounts[e.entityId].count++
  })
  
  const mostScanned = Object.entries(itemCounts)
    .sort(([, a], [, b]) => b.count - a.count)[0]
  
  const mostScannedItem = mostScanned 
    ? { id: mostScanned[0], name: mostScanned[1].name, count: mostScanned[1].count }
    : null
  
  // Scans by hour (last 24 hours)
  const scansByHour: Record<string, number> = {}
  for (let i = 0; i < 24; i++) {
    scansByHour[i.toString()] = 0
  }
  events.forEach(e => {
    const hour = new Date(e.timestamp).getHours()
    scansByHour[hour.toString()]++
  })
  
  // Scans by location
  const scansByLocation: Record<string, number> = {}
  events.forEach(e => {
    scansByLocation[e.location] = (scansByLocation[e.location] || 0) + 1
  })
  
  // Scans by user
  const scansByUser: Record<string, number> = {}
  events.forEach(e => {
    scansByUser[e.scannedBy] = (scansByUser[e.scannedBy] || 0) + 1
  })
  
  // Scans by action
  const scansByAction: Record<ScanAction, number> = {
    'view': 0,
    'update-stage': 0,
    'report-issue': 0,
    'move-location': 0,
    'qc-check': 0
  }
  events.forEach(e => {
    scansByAction[e.action]++
  })
  
  return {
    totalScans,
    scansToday,
    uniqueItemsScanned: uniqueItems,
    mostScannedItem,
    scansByHour,
    scansByLocation,
    scansByUser,
    scansByAction
  }
}

/**
 * Filter scan events
 */
export function filterScanEvents(params: {
  startDate?: Date
  endDate?: Date
  location?: string
  user?: string
  action?: ScanAction
  entityType?: string
}): ScanEvent[] {
  let events = getAllScanEvents()
  
  if (params.startDate) {
    events = events.filter(e => new Date(e.timestamp) >= params.startDate!)
  }
  
  if (params.endDate) {
    events = events.filter(e => new Date(e.timestamp) <= params.endDate!)
  }
  
  if (params.location) {
    events = events.filter(e => e.location === params.location)
  }
  
  if (params.user) {
    events = events.filter(e => e.scannedBy === params.user)
  }
  
  if (params.action) {
    events = events.filter(e => e.action === params.action)
  }
  
  if (params.entityType) {
    events = events.filter(e => e.entityType === params.entityType)
  }
  
  return events
}

/**
 * Export scan events to CSV
 */
export function exportScansToCSV(events: ScanEvent[]): string {
  const headers = ['Timestamp', 'Item', 'Type', 'Action', 'Location', 'Scanned By', 'Role', 'Notes']
  const rows = events.map(e => [
    e.timestamp,
    e.entityName,
    e.entityType,
    e.action,
    e.location,
    e.scannedBy,
    e.scannedByRole,
    e.notes || ''
  ])
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')
  
  return csvContent
}

