import { useState, useEffect, useRef } from "react"
import { generateId } from '@/lib/utils'

export type GridPos = {
  x: number
  y: number
  w: number
  h: number
  i: string
}

export type BlockType =
  | "empty"
  | "note"
  | "table"
  | "table.orders"
  | "table.generic"
  | "table.malleable"
  | "metric"
  | "metric.kpi"
  | "metric.chart"
  | "metric.items"
  | "chart.line"
  | "chart.bar"
  | "chart.area"
  | "chart.donut"
  | "chart.area.interactive"
  | "chart.scatter"
  | "calendar"
  | "calendar.mini"
  | "activity.timeline"
  | "messages.preview"
  | "messages.panel"
  | "commands.quick"
  | "kanban.simple"
  | "capacity.tracker"
  | "notifications.panel"
  | "analytics.summary"
  | "materials.inbound.week"
  | "materials.usage"
  | "materials.overdue"
  | "materials.supplier.leadtime"
  | "tabs"
  | "filter.items"

export type Block = {
  id: string
  type: BlockType
  title?: string
  props?: Record<string, any>
  extensions?: Block[]
  slots?: Record<string, Block | null>
}

export type GridState = {
  mode: "edit" | "save"
  layout: GridPos[]
  blocks: Record<string, Block>
}

export function useGridSystem(initialState: GridState, storageKey?: string) {
  const [state, setState] = useState<GridState>(initialState)
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null)
  const [dragPreview, setDragPreview] = useState<{ x: number; y: number; w: number; h: number } | null>(null)
  const [resizing, setResizing] = useState<{
    blockId: string
    direction: "se" | "e" | "s"
    startX: number
    startY: number
    startW: number
    startH: number
  } | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const dragStartPos = useRef<{ x: number; y: number } | null>(null)

  // Load from localStorage if storageKey provided
  useEffect(() => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        try {
          setState(JSON.parse(saved))
        } catch (error) {
          console.warn("Failed to load grid state from localStorage:", error)
        }
      }
    }
  }, [storageKey])

  // Save to localStorage when state changes
  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(state))
    }
  }, [state, storageKey])

  const toggleMode = () => {
    setState((prev) => ({ ...prev, mode: prev.mode === "edit" ? "save" : "edit" }))
  }

  const addBlock = (block: Block, position?: { x: number; y: number; w: number; h: number }) => {
    const maxY = Math.max(...state.layout.map((item) => item.y + item.h), 0)
    const newId = block.id || generateId("b")
    const newPosition = position || { x: 0, y: maxY, w: 6, h: 8 }

    setState((prev) => ({
      ...prev,
      layout: [...prev.layout, { ...newPosition, i: newId }],
      blocks: {
        ...prev.blocks,
        [newId]: { ...block, id: newId },
      },
    }))

    return newId
  }

  const deleteBlock = (blockId: string) => {
    setState((prev) => ({
      ...prev,
      layout: prev.layout.filter((item) => item.i !== blockId),
      blocks: Object.fromEntries(Object.entries(prev.blocks).filter(([id]) => id !== blockId)),
    }))
  }

  const updateBlock = (blockId: string, updates: Partial<Block>) => {
    setState((prev) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        [blockId]: { ...prev.blocks[blockId], ...updates },
      },
    }))
  }

  const extendBlock = (blockId: string, extensionBlock: Block) => {
    setState((prev) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        [blockId]: {
          ...prev.blocks[blockId],
          extensions: [...(prev.blocks[blockId].extensions || []), extensionBlock],
        },
      },
    }))
  }

  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    if (state.mode !== "edit") return
    
    const layoutItem = state.layout.find((item) => item.i === blockId)
    if (!layoutItem) return

    setDraggedBlock(blockId)
    dragStartPos.current = { x: layoutItem.x, y: layoutItem.y }
    
    // Set initial preview position
    setDragPreview({ x: layoutItem.x, y: layoutItem.y, w: layoutItem.w, h: layoutItem.h })
    
    e.dataTransfer.effectAllowed = "move"
    
    // Add smooth transition class to the dragged element
    const draggedElement = e.currentTarget as HTMLElement
    draggedElement.style.transition = "none"
    draggedElement.style.opacity = "0.8"
    draggedElement.style.transform = "rotate(2deg) scale(1.02)"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    
    if (!draggedBlock || !gridRef.current || !dragStartPos.current) return

    const rect = gridRef.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // Calculate grid position with more accurate calculations
    // Account for the actual grid layout and spacing
    const totalWidth = rect.width
    const gridUnitWidth = totalWidth / 12 // 12-column grid
    const rowHeight = 40 // Height of one grid row
    
    // Calculate grid coordinates more precisely
    const newX = Math.max(0, Math.min(11, Math.floor(mouseX / gridUnitWidth)))
    const newY = Math.max(0, Math.floor(mouseY / rowHeight))

    // Update preview position smoothly
    setDragPreview((prev) => {
      if (!prev) return null
      
      const layoutItem = state.layout.find((item) => item.i === draggedBlock)
      if (!layoutItem) return prev

      return {
        x: newX,
        y: newY,
        w: layoutItem.w,
        h: layoutItem.h
      }
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (!draggedBlock || !gridRef.current || !dragPreview) return

    // Update the layout with the new position
    setState((prev) => ({
      ...prev,
      layout: prev.layout.map((item) =>
        item.i === draggedBlock ? { ...item, x: dragPreview.x, y: dragPreview.y } : item,
      ),
    }))

    // Reset drag state
    setDraggedBlock(null)
    setDragPreview(null)
    dragStartPos.current = null

    // Remove transition effects from the dragged element
    const draggedElement = e.currentTarget as HTMLElement
    draggedElement.style.transition = ""
    draggedElement.style.opacity = ""
    draggedElement.style.transform = ""
  }

  const handleDragEnd = () => {
    // Reset drag state if drag ends without drop
    setDraggedBlock(null)
    setDragPreview(null)
    dragStartPos.current = null
  }

  const handleResizeStart = (e: React.MouseEvent, blockId: string, direction: "se" | "e" | "s") => {
    e.preventDefault()
    e.stopPropagation()

    const layoutItem = state.layout.find((item) => item.i === blockId)
    if (!layoutItem) return

    setResizing({
      blockId,
      direction,
      startX: e.clientX,
      startY: e.clientY,
      startW: layoutItem.w,
      startH: layoutItem.h,
    })
  }

  const handleResizeMove = (e: MouseEvent) => {
    if (!resizing) return

    const deltaX = e.clientX - resizing.startX
    const deltaY = e.clientY - resizing.startY

    // Convert pixel movement to grid units with smoother calculations
    const gridSize = 100 // Approximate width of one grid unit
    const rowHeight = 40 // Height of one grid row
    
    const deltaW = Math.round(deltaX / gridSize)
    const deltaH = Math.round(deltaY / rowHeight)

    setState((prev) => ({
      ...prev,
      layout: prev.layout.map((item) => {
        if (item.i !== resizing.blockId) return item

        let newW = item.w
        let newH = item.h

        if (resizing.direction === "se" || resizing.direction === "e") {
          newW = Math.max(2, Math.min(12 - item.x, resizing.startW + deltaW))
        }
        if (resizing.direction === "se" || resizing.direction === "s") {
          newH = Math.max(2, Math.min(20, resizing.startH + deltaH))
        }

        return { ...item, w: newW, h: newH }
      }),
    }))
  }

  const handleResizeEnd = () => {
    setResizing(null)
  }

  const toggleBlockCollapse = (blockId: string) => {
    setState((prev) => ({
      ...prev,
      layout: prev.layout.map((item) =>
        item.i === blockId ? { ...item, h: item.h <= 4 ? 8 : 4 } : item,
      ),
    }))
  }

  // Set up resize event listeners
  useEffect(() => {
    if (resizing) {
      document.addEventListener("mousemove", handleResizeMove)
      document.addEventListener("mouseup", handleResizeEnd)
      return () => {
        document.removeEventListener("mousemove", handleResizeMove)
        document.removeEventListener("mouseup", handleResizeEnd)
      }
    }
  }, [resizing])

  // Set up global drag end listener
  useEffect(() => {
    const handleGlobalDragEnd = () => {
      handleDragEnd()
    }

    document.addEventListener("dragend", handleGlobalDragEnd)
    return () => {
      document.removeEventListener("dragend", handleGlobalDragEnd)
    }
  }, [])

  const maxY = Math.max(...state.layout.map((item) => item.y + item.h), 0)

  return {
    state,
    setState,
    draggedBlock,
    dragPreview,
    resizing,
    gridRef,
    maxY,
    toggleMode,
    addBlock,
    deleteBlock,
    updateBlock,
    extendBlock,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    handleResizeStart,
    toggleBlockCollapse,
  }
}
