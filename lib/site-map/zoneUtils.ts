import type { ZoneCell, ZoneGroup } from "./types";

// Check if two cells are adjacent (including diagonals)
export function areCellsAdjacent(
  cell1: { x: number; y: number },
  cell2: { x: number; y: number }
): boolean {
  const dx = Math.abs(cell1.x - cell2.x)
  const dy = Math.abs(cell1.y - cell2.y)
  return dx <= 1 && dy <= 1 && !(dx === 0 && dy === 0)
}

// Find which zone group a cell belongs to (if adjacent)
export function findAdjacentZoneGroup(
  cell: { x: number; y: number },
  zoneGroups: ZoneGroup[],
  zoneType: string
): ZoneGroup | null {
  for (const group of zoneGroups) {
    if (group.type !== zoneType) continue
    
    for (const groupCell of group.cells) {
      if (areCellsAdjacent(cell, groupCell)) {
        return group
      }
    }
  }
  return null
}

// Merge multiple zone groups that are now connected
export function mergeZoneGroups(groups: ZoneGroup[]): ZoneGroup {
  if (groups.length === 0) throw new Error("Cannot merge empty groups")
  if (groups.length === 1) return groups[0]

  // Use the first group as the base
  const baseGroup = groups[0]
  const allCells = [...baseGroup.cells]

  // Add cells from other groups (avoiding duplicates)
  for (let i = 1; i < groups.length; i++) {
    for (const cell of groups[i].cells) {
      if (!allCells.some((c) => c.x === cell.x && c.y === cell.y)) {
        allCells.push(cell)
      }
    }
  }

  return {
    ...baseGroup,
    cells: allCells,
  }
}

// Generate zone name with number (e.g., PRODUCTION-1, PRODUCTION-2)
export function generateZoneName(zoneType: string, existingGroups: ZoneGroup[]): string {
  const typeGroups = existingGroups.filter((g) => g.type === zoneType)
  const maxNumber = typeGroups.reduce((max, group) => {
    const match = group.name.match(/-(\d+)$/)
    return match ? Math.max(max, parseInt(match[1])) : max
  }, 0)

  const typeName = zoneType.toUpperCase().replace(/[^A-Z]/g, "")
  return `${typeName}-${maxNumber + 1}`
}

// Add cells to zone groups, creating or merging as needed
export function addCellsToZoneGroups(
  cells: { x: number; y: number }[],
  zoneType: string,
  zoneName: string,
  zoneColor: string,
  existingGroups: ZoneGroup[]
): ZoneGroup[] {
  const updatedGroups = [...existingGroups]
  const groupsToMerge: Set<string> = new Set()
  let targetGroup: ZoneGroup | null = null

  // For each new cell, check if it's adjacent to existing groups
  for (const cell of cells) {
    const adjacentGroup = findAdjacentZoneGroup(cell, updatedGroups, zoneType)
    if (adjacentGroup) {
      groupsToMerge.add(adjacentGroup.id)
    }
  }

  if (groupsToMerge.size === 0) {
    // Create new group
    const newGroup: ZoneGroup = {
      id: `zone-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: zoneType,
      name: generateZoneName(zoneType, existingGroups),
      color: zoneColor,
      cells: cells,
      createdAt: Date.now(),
    }
    updatedGroups.push(newGroup)
  } else if (groupsToMerge.size === 1) {
    // Add to existing group
    const groupId = Array.from(groupsToMerge)[0]
    const groupIndex = updatedGroups.findIndex((g) => g.id === groupId)
    if (groupIndex !== -1) {
      const group = updatedGroups[groupIndex]
      // Add new cells (avoiding duplicates)
      const newCells = [...group.cells]
      for (const cell of cells) {
        if (!newCells.some((c) => c.x === cell.x && c.y === cell.y)) {
          newCells.push(cell)
        }
      }
      updatedGroups[groupIndex] = { ...group, cells: newCells }
    }
  } else {
    // Merge multiple groups
    const groupsToMergeArray = updatedGroups.filter((g) => groupsToMerge.has(g.id))
    const mergedGroup = mergeZoneGroups(groupsToMergeArray)
    
    // Add new cells
    const newCells = [...mergedGroup.cells]
    for (const cell of cells) {
      if (!newCells.some((c) => c.x === cell.x && c.y === cell.y)) {
        newCells.push(cell)
      }
    }
    mergedGroup.cells = newCells

    // Remove old groups and add merged group
    const remainingGroups = updatedGroups.filter((g) => !groupsToMerge.has(g.id))
    remainingGroups.push(mergedGroup)
    return remainingGroups
  }

  return updatedGroups
}

// Convert zone groups to zone cells for rendering
export function zoneGroupsToCells(groups: ZoneGroup[]): ZoneCell[] {
  const cells: ZoneCell[] = []
  for (const group of groups) {
    for (const cell of group.cells) {
      cells.push({
        x: cell.x,
        y: cell.y,
        zoneGroupId: group.id,
        zoneType: group.type,
        zoneName: group.name,
        zoneColor: group.color,
      })
    }
  }
  return cells
}

