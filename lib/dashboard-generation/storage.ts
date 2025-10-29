/**
 * Dashboard Storage Utilities
 * Manages localStorage persistence for custom dashboards
 */

// Use PageTemplate's DashboardState type for compatibility
export type GridPos = {
  x: number
  y: number
  w: number
  h: number
  i: string
}

export type Block = {
  id: string
  type: string
  title?: string
  props?: Record<string, any>
  extensions?: Block[]
}

export type DashboardState = {
  mode: "edit" | "save"
  layout: GridPos[]
  blocks: Record<string, Block>
}

const DASHBOARDS_KEY = 'groovy-dashboards'
const DASHBOARD_PREFIX = 'dashboard-'

export interface DashboardMetadata {
  id: string
  name: string
  isGenerated: boolean
  timestamp: number
  description?: string
}

/**
 * Get all dashboard metadata
 */
export function getAllDashboards(): DashboardMetadata[] {
  try {
    const stored = localStorage.getItem(DASHBOARDS_KEY)
    if (!stored) return []
    return JSON.parse(stored)
  } catch (error) {
    console.error('Error loading dashboards:', error)
    return []
  }
}

/**
 * Create a new blank dashboard entry
 */
export function createBlankDashboard(name: string): DashboardMetadata {
  const dashboards = getAllDashboards()
  
  // Generate unique ID
  const id = `dashboard-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  
  const newDashboard: DashboardMetadata = {
    id,
    name,
    isGenerated: false,
    timestamp: Date.now()
  }
  
  // Add to dashboards list
  dashboards.push(newDashboard)
  localStorage.setItem(DASHBOARDS_KEY, JSON.stringify(dashboards))
  
  return newDashboard
}

/**
 * Save dashboard state to localStorage
 */
export function saveDashboard(id: string, state: DashboardState, metadata?: Partial<DashboardMetadata>): void {
  try {
    // Save the grid state
    const storageKey = `${DASHBOARD_PREFIX}${id}`
    localStorage.setItem(storageKey, JSON.stringify(state))
    
    // Update metadata if provided
    if (metadata) {
      const dashboards = getAllDashboards()
      const index = dashboards.findIndex(d => d.id === id)
      
      if (index !== -1) {
        dashboards[index] = {
          ...dashboards[index],
          ...metadata
        }
        localStorage.setItem(DASHBOARDS_KEY, JSON.stringify(dashboards))
      }
    }
  } catch (error) {
    console.error('Error saving dashboard:', error)
    throw error
  }
}

/**
 * Load dashboard state from localStorage
 */
export function loadDashboard(id: string): DashboardState | null {
  try {
    const storageKey = `${DASHBOARD_PREFIX}${id}`
    const stored = localStorage.getItem(storageKey)
    
    if (!stored) return null
    
    return JSON.parse(stored)
  } catch (error) {
    console.error('Error loading dashboard:', error)
    return null
  }
}

/**
 * Get dashboard metadata by ID
 */
export function getDashboardMetadata(id: string): DashboardMetadata | null {
  const dashboards = getAllDashboards()
  return dashboards.find(d => d.id === id) || null
}

/**
 * Delete a dashboard and its state
 */
export function deleteDashboard(id: string): void {
  try {
    // Remove the dashboard state
    const storageKey = `${DASHBOARD_PREFIX}${id}`
    localStorage.removeItem(storageKey)
    
    // Remove from dashboards list
    const dashboards = getAllDashboards()
    const filtered = dashboards.filter(d => d.id !== id)
    localStorage.setItem(DASHBOARDS_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error('Error deleting dashboard:', error)
    throw error
  }
}

/**
 * Update dashboard metadata
 */
export function updateDashboardMetadata(id: string, updates: Partial<DashboardMetadata>): void {
  try {
    const dashboards = getAllDashboards()
    const index = dashboards.findIndex(d => d.id === id)
    
    if (index !== -1) {
      dashboards[index] = {
        ...dashboards[index],
        ...updates
      }
      localStorage.setItem(DASHBOARDS_KEY, JSON.stringify(dashboards))
    }
  } catch (error) {
    console.error('Error updating dashboard metadata:', error)
    throw error
  }
}

/**
 * Check if a dashboard name already exists
 */
export function dashboardNameExists(name: string): boolean {
  const dashboards = getAllDashboards()
  return dashboards.some(d => d.name.toLowerCase() === name.toLowerCase())
}

