"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { SiteMap, SiteElement, SiteFloor, ViewMode, ZoneGroup } from "@/lib/site-map/types"
import type { GridState } from "@/lib/grid-v2/types"
import { loadSiteMap, saveSiteMap } from "@/lib/site-map/storage"
import { createFactorySiteMap } from "@/lib/site-map/mockData"
import { addCellsToZoneGroups, zoneGroupsToCells } from "@/lib/site-map/zoneUtils"

interface SiteMapContextValue {
  siteMap: SiteMap
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  updateElement: (id: string, updates: Partial<SiteElement>) => void
  addElement: (element: SiteElement) => void
  deleteElement: (id: string) => void
  switchFloor: (floorId: string) => void
  addFloor: (floor: SiteFloor) => void
  deleteFloor: (floorId: string) => void
  updateFloorGridState: (floorId: string, gridState: GridState) => void
  updateFloorDimensions: (floorId: string, width: number, height: number) => void
  paintZone: (floorId: string, cells: { x: number; y: number }[], zoneType: string, zoneColor: string) => void
  clearZones: (floorId: string) => void
  getZoneGroups: (floorId: string) => ZoneGroup[]
  selectZoneGroup: (floorId: string, groupId: string) => ZoneGroup | undefined
  updateZoneGroup: (floorId: string, groupId: string, updates: Partial<ZoneGroup>) => void
  deleteZoneGroup: (floorId: string, groupId: string) => void
  getCurrentFloor: () => SiteFloor | undefined
  getElementsByFloor: (floorId: string) => SiteElement[]
  getElementsByType: (type: string) => SiteElement[]
  resetToDefault: () => void
}

const SiteMapContext = createContext<SiteMapContextValue | undefined>(undefined)

export function useSiteMap() {
  const context = useContext(SiteMapContext)
  if (!context) {
    throw new Error("useSiteMap must be used within SiteMapProvider")
  }
  return context
}

interface SiteMapProviderProps {
  children: ReactNode
}

export function SiteMapProvider({ children }: SiteMapProviderProps) {
  const [siteMap, setSiteMap] = useState<SiteMap>(createFactorySiteMap())
  const [viewMode, setViewMode] = useState<ViewMode>("map")
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage only on client after hydration
  useEffect(() => {
    const saved = loadSiteMap()
    if (saved) {
      // Migrate legacy data: add dimensions to floors if missing
      const migratedFloors = saved.floors.map((floor) => ({
        ...floor,
        dimensions: floor.dimensions || { width: 100, height: 80 },
      }))
      // Ensure zones and zoneGroups properties exist
      const zones = saved.zones || {}
      const zoneGroups = saved.zoneGroups || {}
      setSiteMap({ ...saved, floors: migratedFloors, zones, zoneGroups })
    }
    setIsHydrated(true)
  }, [])

  // Save to localStorage whenever siteMap changes (but only after hydration)
  useEffect(() => {
    if (isHydrated) {
      saveSiteMap(siteMap)
    }
  }, [siteMap, isHydrated])

  const updateElement = useCallback((id: string, updates: Partial<SiteElement>) => {
    setSiteMap((prev) => {
      const element = prev.elements[id]
      if (!element) return prev

      const updatedElement = { ...element, ...updates, updatedAt: Date.now() }
      const updatedElements = { ...prev.elements, [id]: updatedElement }

      // Also update the grid state block props
      const floor = prev.floors.find((f) => f.id === element.floor)
      if (!floor) return { ...prev, elements: updatedElements }

      const updatedBlocks = { ...floor.gridState.blocks }
      if (updatedBlocks[id]) {
        updatedBlocks[id] = {
          ...updatedBlocks[id],
          title: updates.name || updatedBlocks[id].title,
          props: {
            ...updatedBlocks[id].props,
            ...updates,
          },
        }
      }

      const updatedFloors = prev.floors.map((f) =>
        f.id === floor.id
          ? {
              ...f,
              gridState: {
                ...f.gridState,
                blocks: updatedBlocks,
              },
            }
          : f
      )

      return {
        ...prev,
        elements: updatedElements,
        floors: updatedFloors,
      }
    })
  }, [])

  const addElement = useCallback((element: SiteElement) => {
    setSiteMap((prev) => {
      const updatedElements = { ...prev.elements, [element.id]: element }

      // Add to the floor's grid state
      const floor = prev.floors.find((f) => f.id === element.floor)
      if (!floor) return { ...prev, elements: updatedElements }

      const newLayout = [
        ...floor.gridState.layout,
        {
          i: element.id,
          x: element.position.x,
          y: element.position.y,
          w: element.position.w,
          h: element.position.h,
        },
      ]

      const newBlocks = {
        ...floor.gridState.blocks,
        [element.id]: {
          id: element.id,
          type: `site.${element.type}` as any,
          title: element.name,
          props: {
            name: element.name,
            description: element.description,
            icon: element.icon,
            color: element.color,
            status: element.status,
            capacity: element.capacity,
            ...element.properties,
          },
        },
      }

      const updatedFloors = prev.floors.map((f) =>
        f.id === floor.id
          ? {
              ...f,
              gridState: {
                ...f.gridState,
                layout: newLayout,
                blocks: newBlocks,
              },
            }
          : f
      )

      return {
        ...prev,
        elements: updatedElements,
        floors: updatedFloors,
      }
    })
  }, [])

  const deleteElement = useCallback((id: string) => {
    setSiteMap((prev) => {
      const element = prev.elements[id]
      if (!element) return prev

      const { [id]: removed, ...updatedElements } = prev.elements

      // Remove from floor's grid state
      const floor = prev.floors.find((f) => f.id === element.floor)
      if (!floor) return { ...prev, elements: updatedElements }

      const updatedLayout = floor.gridState.layout.filter((item) => item.i !== id)
      const { [id]: removedBlock, ...updatedBlocks } = floor.gridState.blocks

      const updatedFloors = prev.floors.map((f) =>
        f.id === floor.id
          ? {
              ...f,
              gridState: {
                ...f.gridState,
                layout: updatedLayout,
                blocks: updatedBlocks,
              },
            }
          : f
      )

      return {
        ...prev,
        elements: updatedElements,
        floors: updatedFloors,
      }
    })
  }, [])

  const switchFloor = useCallback((floorId: string) => {
    setSiteMap((prev) => ({ ...prev, activeFloorId: floorId }))
  }, [])

  const addFloor = useCallback((floor: SiteFloor) => {
    setSiteMap((prev) => ({
      ...prev,
      floors: [...prev.floors, floor],
      activeFloorId: floor.id,
    }))
  }, [])

  const deleteFloor = useCallback((floorId: string) => {
    setSiteMap((prev) => {
      if (prev.floors.length <= 1) {
        // Don't delete the last floor
        return prev
      }

      const updatedFloors = prev.floors.filter((f) => f.id !== floorId)

      // Delete all elements on this floor
      const updatedElements = Object.fromEntries(
        Object.entries(prev.elements).filter(([_, el]) => el.floor !== floorId)
      )

      // If we're deleting the active floor, switch to the first remaining floor
      const newActiveFloorId = prev.activeFloorId === floorId ? updatedFloors[0].id : prev.activeFloorId

      return {
        ...prev,
        floors: updatedFloors,
        elements: updatedElements,
        activeFloorId: newActiveFloorId,
      }
    })
  }, [])

  const updateFloorGridState = useCallback((floorId: string, gridState: GridState) => {
    setSiteMap((prev) => {
      const updatedFloors = prev.floors.map((f) => (f.id === floorId ? { ...f, gridState } : f))
      return { ...prev, floors: updatedFloors }
    })
  }, [])

  const getCurrentFloor = useCallback(() => {
    return siteMap.floors.find((f) => f.id === siteMap.activeFloorId)
  }, [siteMap])

  const getElementsByFloor = useCallback(
    (floorId: string) => {
      return Object.values(siteMap.elements).filter((el) => el.floor === floorId)
    },
    [siteMap]
  )

  const getElementsByType = useCallback(
    (type: string) => {
      return Object.values(siteMap.elements).filter((el) => el.type === type)
    },
    [siteMap]
  )

  const updateFloorDimensions = useCallback((floorId: string, width: number, height: number) => {
    setSiteMap((prev) => {
      const updatedFloors = prev.floors.map((f) =>
        f.id === floorId ? { ...f, dimensions: { width, height } } : f
      )
      return { ...prev, floors: updatedFloors }
    })
  }, [])

  const paintZone = useCallback(
    (floorId: string, cells: { x: number; y: number }[], zoneType: string, zoneColor: string) => {
      setSiteMap((prev) => {
        const existingGroups = prev.zoneGroups[floorId] || []

        // Add cells to zone groups (creates or merges as needed)
        const updatedGroups = addCellsToZoneGroups(cells, zoneType, "", zoneColor, existingGroups)

        // Convert groups to cells for rendering (legacy support)
        const zoneCells = zoneGroupsToCells(updatedGroups)

        return {
          ...prev,
          zoneGroups: { ...prev.zoneGroups, [floorId]: updatedGroups },
          zones: { ...prev.zones, [floorId]: zoneCells },
        }
      })
    },
    []
  )

  const clearZones = useCallback((floorId: string) => {
    setSiteMap((prev) => {
      const { [floorId]: removedZones, ...remainingZones } = prev.zones
      const { [floorId]: removedGroups, ...remainingGroups } = prev.zoneGroups
      return { ...prev, zones: remainingZones, zoneGroups: remainingGroups }
    })
  }, [])

  const getZoneGroups = useCallback(
    (floorId: string) => {
      return siteMap.zoneGroups[floorId] || []
    },
    [siteMap]
  )

  const selectZoneGroup = useCallback(
    (floorId: string, groupId: string) => {
      const groups = siteMap.zoneGroups[floorId] || []
      return groups.find((g) => g.id === groupId)
    },
    [siteMap]
  )

  const updateZoneGroup = useCallback((floorId: string, groupId: string, updates: Partial<ZoneGroup>) => {
    setSiteMap((prev) => {
      const groups = prev.zoneGroups[floorId] || []
      const updatedGroups = groups.map((g) => (g.id === groupId ? { ...g, ...updates } : g))
      const zoneCells = zoneGroupsToCells(updatedGroups)

      return {
        ...prev,
        zoneGroups: { ...prev.zoneGroups, [floorId]: updatedGroups },
        zones: { ...prev.zones, [floorId]: zoneCells },
      }
    })
  }, [])

  const deleteZoneGroup = useCallback((floorId: string, groupId: string) => {
    setSiteMap((prev) => {
      const groups = prev.zoneGroups[floorId] || []
      const updatedGroups = groups.filter((g) => g.id !== groupId)
      const zoneCells = zoneGroupsToCells(updatedGroups)

      return {
        ...prev,
        zoneGroups: { ...prev.zoneGroups, [floorId]: updatedGroups },
        zones: { ...prev.zones, [floorId]: zoneCells },
      }
    })
  }, [])

  const resetToDefault = useCallback(() => {
    setSiteMap(createFactorySiteMap())
  }, [])

  const value: SiteMapContextValue = {
    siteMap,
    viewMode,
    setViewMode,
    updateElement,
    addElement,
    deleteElement,
    switchFloor,
    addFloor,
    deleteFloor,
    updateFloorGridState,
    updateFloorDimensions,
    paintZone,
    clearZones,
    getZoneGroups,
    selectZoneGroup,
    updateZoneGroup,
    deleteZoneGroup,
    getCurrentFloor,
    getElementsByFloor,
    getElementsByType,
    resetToDefault,
  }

  return <SiteMapContext.Provider value={value}>{children}</SiteMapContext.Provider>
}

