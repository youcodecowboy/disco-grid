import type { SiteMap, SiteFloor, SiteElement, ElementTemplate } from "./types"
import type { GridState } from "@/lib/grid-v2/types"

// Element templates for the palette
export const elementTemplates: ElementTemplate[] = [
  {
    type: "machine",
    label: "Machine",
    icon: "⚙️",
    defaultColor: "#3b82f6",
    description: "Manufacturing machine or equipment unit",
  },
  {
    type: "storage",
    label: "Storage",
    icon: "📦",
    defaultColor: "#8b5cf6",
    description: "Storage location or inventory area",
  },
  {
    type: "zone",
    label: "Zone",
    icon: "🏢",
    defaultColor: "#10b981",
    description: "Defined area or work zone",
  },
  {
    type: "production-line",
    label: "Production Line",
    icon: "🏭",
    defaultColor: "#f59e0b",
    description: "Production or assembly line",
  },
  {
    type: "station",
    label: "Station",
    icon: "🔧",
    defaultColor: "#06b6d4",
    description: "Work station or assembly point",
  },
  {
    type: "equipment",
    label: "Equipment",
    icon: "🔨",
    defaultColor: "#ef4444",
    description: "General equipment or tool",
  },
]

// Create a sample factory site map
export function createFactorySiteMap(): SiteMap {
  const now = Date.now()

  // Floor 1 elements
  const floor1Elements: Record<string, SiteElement> = {
    "machine-1": {
      id: "machine-1",
      type: "machine",
      name: "CNC Mill #1",
      description: "Primary CNC milling machine",
      icon: "⚙️",
      color: "#3b82f6",
      status: "active",
      properties: { model: "Haas VF-2", year: 2020 },
      floor: "floor-1",
      position: { x: 0, y: 0, w: 2, h: 2 },
      createdAt: now,
      updatedAt: now,
    },
    "machine-2": {
      id: "machine-2",
      type: "machine",
      name: "CNC Mill #2",
      description: "Secondary CNC milling machine",
      icon: "⚙️",
      color: "#3b82f6",
      status: "active",
      properties: { model: "Haas VF-2", year: 2020 },
      floor: "floor-1",
      position: { x: 2, y: 0, w: 2, h: 2 },
      createdAt: now,
      updatedAt: now,
    },
    "machine-3": {
      id: "machine-3",
      type: "machine",
      name: "Lathe #1",
      description: "CNC lathe",
      icon: "⚙️",
      color: "#3b82f6",
      status: "maintenance",
      properties: { model: "Mazak QT-250", year: 2019 },
      floor: "floor-1",
      position: { x: 4, y: 0, w: 2, h: 2 },
      createdAt: now,
      updatedAt: now,
    },
    "storage-1": {
      id: "storage-1",
      type: "storage",
      name: "Raw Materials",
      description: "Raw material storage area",
      icon: "📦",
      color: "#8b5cf6",
      capacity: 500,
      status: "active",
      properties: { type: "shelving", sections: 10 },
      floor: "floor-1",
      position: { x: 9, y: 0, w: 3, h: 3 },
      createdAt: now,
      updatedAt: now,
    },
    "storage-2": {
      id: "storage-2",
      type: "storage",
      name: "Finished Goods",
      description: "Completed product storage",
      icon: "📦",
      color: "#8b5cf6",
      capacity: 300,
      status: "active",
      properties: { type: "pallet-rack", sections: 8 },
      floor: "floor-1",
      position: { x: 9, y: 3, w: 3, h: 3 },
      createdAt: now,
      updatedAt: now,
    },
    "zone-1": {
      id: "zone-1",
      type: "zone",
      name: "Assembly Zone",
      description: "Main assembly area",
      icon: "🏢",
      color: "#10b981",
      status: "active",
      properties: { capacity: 12, workstations: 6 },
      floor: "floor-1",
      position: { x: 0, y: 3, w: 4, h: 4 },
      createdAt: now,
      updatedAt: now,
    },
    "zone-2": {
      id: "zone-2",
      type: "zone",
      name: "QA/Inspection",
      description: "Quality assurance and inspection zone",
      icon: "🏢",
      color: "#10b981",
      status: "active",
      properties: { capacity: 4, workstations: 2 },
      floor: "floor-1",
      position: { x: 4, y: 3, w: 2, h: 3 },
      createdAt: now,
      updatedAt: now,
    },
    "production-line-1": {
      id: "production-line-1",
      type: "production-line",
      name: "Main Production Line",
      description: "Primary assembly line",
      icon: "🏭",
      color: "#f59e0b",
      status: "active",
      properties: { stations: 8, throughput: "50 units/hour" },
      floor: "floor-1",
      position: { x: 0, y: 8, w: 6, h: 2 },
      createdAt: now,
      updatedAt: now,
    },
    "station-1": {
      id: "station-1",
      type: "station",
      name: "Welding Station #1",
      description: "Primary welding station",
      icon: "🔧",
      color: "#06b6d4",
      status: "active",
      properties: { equipment: ["MIG Welder", "TIG Welder"] },
      floor: "floor-1",
      position: { x: 6, y: 3, w: 2, h: 2 },
      createdAt: now,
      updatedAt: now,
    },
    "station-2": {
      id: "station-2",
      type: "station",
      name: "Welding Station #2",
      description: "Secondary welding station",
      icon: "🔧",
      color: "#06b6d4",
      status: "active",
      properties: { equipment: ["MIG Welder"] },
      floor: "floor-1",
      position: { x: 6, y: 5, w: 2, h: 2 },
      createdAt: now,
      updatedAt: now,
    },
  }

  // Floor 2 elements
  const floor2Elements: Record<string, SiteElement> = {
    "office-zone": {
      id: "office-zone",
      type: "zone",
      name: "Office Area",
      description: "Administrative offices",
      icon: "🏢",
      color: "#10b981",
      status: "active",
      properties: { desks: 15, conference_rooms: 2 },
      floor: "floor-2",
      position: { x: 0, y: 0, w: 6, h: 4 },
      createdAt: now,
      updatedAt: now,
    },
    "storage-3": {
      id: "storage-3",
      type: "storage",
      name: "Tool Storage",
      description: "Tooling and equipment storage",
      icon: "📦",
      color: "#8b5cf6",
      capacity: 200,
      status: "active",
      properties: { type: "tool-crib" },
      floor: "floor-2",
      position: { x: 6, y: 0, w: 3, h: 3 },
      createdAt: now,
      updatedAt: now,
    },
    "equipment-1": {
      id: "equipment-1",
      type: "equipment",
      name: "Air Compressor",
      description: "Industrial air compressor",
      icon: "🔨",
      color: "#ef4444",
      status: "active",
      properties: { model: "Atlas Copco GA37", capacity: "37 kW" },
      floor: "floor-2",
      position: { x: 9, y: 0, w: 2, h: 2 },
      createdAt: now,
      updatedAt: now,
    },
  }

  // Combine all elements
  const allElements = { ...floor1Elements, ...floor2Elements }

  // Create grid states for each floor
  const floor1GridState: GridState = {
    mode: "edit",
    layout: Object.values(floor1Elements).map((el) => ({
      i: el.id,
      x: el.position.x,
      y: el.position.y,
      w: el.position.w,
      h: el.position.h,
    })),
    blocks: Object.fromEntries(
      Object.values(floor1Elements).map((el) => [
        el.id,
        {
          id: el.id,
          type: `site.${el.type}` as any,
          title: el.name,
          props: {
            name: el.name,
            description: el.description,
            icon: el.icon,
            color: el.color,
            status: el.status,
            capacity: el.capacity,
            ...el.properties,
          },
        },
      ])
    ),
  }

  const floor2GridState: GridState = {
    mode: "edit",
    layout: Object.values(floor2Elements).map((el) => ({
      i: el.id,
      x: el.position.x,
      y: el.position.y,
      w: el.position.w,
      h: el.position.h,
    })),
    blocks: Object.fromEntries(
      Object.values(floor2Elements).map((el) => [
        el.id,
        {
          id: el.id,
          type: `site.${el.type}` as any,
          title: el.name,
          props: {
            name: el.name,
            description: el.description,
            icon: el.icon,
            color: el.color,
            status: el.status,
            capacity: el.capacity,
            ...el.properties,
          },
        },
      ])
    ),
  }

  // Create floors
  const floors: SiteFloor[] = [
    {
      id: "floor-1",
      name: "Floor 1 - Production",
      level: 1,
      gridState: floor1GridState,
      dimensions: { width: 100, height: 80 }, // 100ft x 80ft
    },
    {
      id: "floor-2",
      name: "Floor 2 - Support",
      level: 2,
      gridState: floor2GridState,
      dimensions: { width: 100, height: 80 },
    },
  ]

  return {
    id: "factory-1",
    name: "Main Factory",
    description: "Primary manufacturing facility",
    floors,
    elements: allElements,
    zones: {}, // Legacy support
    zoneGroups: {}, // Empty zone groups to start
    activeFloorId: "floor-1",
  }
}

// Create a blank site map
export function createBlankSiteMap(): SiteMap {
  const now = Date.now()

  const floor1GridState: GridState = {
    mode: "edit",
    layout: [],
    blocks: {},
  }

  const floors: SiteFloor[] = [
    {
      id: "floor-1",
      name: "Floor 1",
      level: 1,
      gridState: floor1GridState,
      dimensions: { width: 100, height: 80 },
    },
  ]

  return {
    id: `site-${now}`,
    name: "New Site",
    description: "",
    floors,
    elements: {},
    zones: {},
    zoneGroups: {},
    activeFloorId: "floor-1",
  }
}

