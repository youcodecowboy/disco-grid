import type { GridState } from "@/lib/grid-v2/types"

// Site element types
export type SiteElementType = "machine" | "storage" | "zone" | "production-line" | "station" | "equipment"

export type SiteElementStatus = "active" | "inactive" | "maintenance"

// Site element with properties
export interface SiteElement {
  id: string
  type: SiteElementType
  name: string
  description?: string
  icon?: string
  color?: string
  capacity?: number
  status: SiteElementStatus
  properties: Record<string, any>
  linkedAssetId?: string // Link to existing asset
  floor: string
  position: { x: number; y: number; w: number; h: number }
  createdAt: number
  updatedAt: number
}

// Floor configuration
export interface SiteFloor {
  id: string
  name: string
  level: number
  gridState: GridState
  dimensions: {
    width: number // in feet
    height: number // in feet
  }
}

// Zone cell (for grid painting)
export interface ZoneCell {
  x: number
  y: number
  zoneGroupId: string // unique ID for this contiguous zone group
  zoneType: string // type: production, storage, etc.
  zoneName: string // display name: PRODUCTION-1, STORAGE-2, etc.
  zoneColor: string
}

// Zone group (contiguous area)
export interface ZoneGroup {
  id: string
  type: string
  name: string // PRODUCTION-1, etc.
  color: string
  cells: { x: number; y: number }[]
  createdAt: number
  // Metadata
  description?: string
  subType?: string // e.g., "Assembly Line", "Packing Station", "Cold Storage"
  assignedTeams?: string[] // Team IDs or names
  supervisor?: string
  shiftSchedule?: string
  notes?: string
}

// Complete site map
export interface SiteMap {
  id: string
  name: string
  description?: string
  floors: SiteFloor[]
  elements: Record<string, SiteElement>
  zones: Record<string, ZoneCell[]> // floorId -> cells (legacy support)
  zoneGroups: Record<string, ZoneGroup[]> // floorId -> zone groups
  activeFloorId: string
}

// View mode
export type ViewMode = "map" | "table"

// For element palette
export interface ElementTemplate {
  type: SiteElementType
  label: string
  icon: string
  defaultColor: string
  description: string
}

