import type React from "react"
import { useState, useEffect, useRef, useLayoutEffect } from "react"
import { generateId } from "@/lib/utils"
import { createBlockConfig, defaultBlockSize } from "@/lib/block-registry"
import type { GridState, BlockConfig, BlockType, GridCoordinates } from "./types"

const DEFAULT_ROW_HEIGHT = 40
const DEFAULT_VERTICAL_OFFSET = 8

interface GridOptions {
  autoFit?: boolean
  rowHeight?: number
  verticalOffset?: number
  defaultMinHeight?: number
  minHeight?: (item: GridCoordinates) => number
  cardSelector?: string
}

function isColliding(a: GridCoordinates, b: GridCoordinates) {
  const overlapsX = a.x < b.x + b.w && a.x + a.w > b.x
  const overlapsY = a.y < b.y + b.h && a.y + a.h > b.y
  return overlapsX && overlapsY
}

function resolveOverlaps(layout: GridCoordinates[]): GridCoordinates[] {
  const sorted = [...layout].sort((a, b) => (a.y - b.y) || (a.x - b.x))
  const positioned: GridCoordinates[] = []

  for (const item of sorted) {
    let candidate = { ...item }
    let safety = 0

    while (positioned.some((existing) => isColliding(candidate, existing)) && safety < 1000) {
      const blocker = positioned.find((existing) => isColliding(candidate, existing))
      if (!blocker) break
      candidate = { ...candidate, y: blocker.y + blocker.h }
      safety++
    }

    positioned.push(candidate)
  }

  const map = new Map(positioned.map((item) => [item.i, item]))
  return layout.map((item) => map.get(item.i) ?? item)
}

export function useGrid(
  initialState: GridState,
  storageKeyOrOptions?: string | GridOptions,
  maybeOptions?: GridOptions,
) {
  let storageKey: string | undefined
  let options: GridOptions | undefined

  if (typeof storageKeyOrOptions === "string" || storageKeyOrOptions === undefined) {
    storageKey = storageKeyOrOptions
    options = maybeOptions
  } else {
    options = storageKeyOrOptions
  }

  const autoFit = options?.autoFit ?? true
  const rowHeight = options?.rowHeight ?? DEFAULT_ROW_HEIGHT
  const verticalOffset = options?.verticalOffset ?? DEFAULT_VERTICAL_OFFSET
  const defaultMinHeight = options?.defaultMinHeight ?? 4
  const minHeightForItem = options?.minHeight
  const cardSelector = options?.cardSelector ?? "[data-grid-card-root]"

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
  const resizeFrame = useRef<number | null>(null)

  useEffect(() => {
    if (!storageKey) return

    const saved = localStorage.getItem(storageKey)
    if (!saved) return

    try {
      setState(JSON.parse(saved))
    } catch (error) {
      console.warn("Failed to load grid state from localStorage:", error)
    }
  }, [storageKey])

  useEffect(() => {
    if (!storageKey) return
    localStorage.setItem(storageKey, JSON.stringify(state))
  }, [state, storageKey])

  const toggleMode = () => {
    setState((prev) => ({ ...prev, mode: prev.mode === "edit" ? "save" : "edit" }))
  }

  const addBlock = (block: BlockConfig, position?: { x: number; y: number; w: number; h: number }) => {
    const maxY = Math.max(...state.layout.map((item) => item.y + item.h), 0)
    const newId = block.id || generateId("b")
    const defaults = createBlockConfig(block.type, {
      id: newId,
      title: block.title,
      props: block.props,
      extensions: block.extensions,
    })
    const size = defaultBlockSize(block.type)
    const newPosition = position || { x: 0, y: maxY, ...size }

    setState((prev) => {
      const nextLayout = resolveOverlaps([...prev.layout, { ...newPosition, i: newId }])
      return {
        ...prev,
        layout: nextLayout,
        blocks: {
          ...prev.blocks,
          [newId]: defaults,
        },
      }
    })

    return newId
  }

  const deleteBlock = (blockId: string) => {
    setState((prev) => {
      const filteredLayout = prev.layout.filter((item) => item.i !== blockId)
      return {
        ...prev,
        layout: resolveOverlaps(filteredLayout),
        blocks: Object.fromEntries(Object.entries(prev.blocks).filter(([id]) => id !== blockId)),
      }
    })
  }

  const updateBlock = (blockId: string, updates: Partial<BlockConfig>) => {
    setState((prev) => {
      const current = prev.blocks[blockId]
      if (!current) return prev

      const mergedProps = updates.props
        ? { ...(current.props || {}), ...updates.props }
        : current.props

      const mergedExtensions = updates.extensions ?? current.extensions
      const mergedSlots = updates.slots ?? current.slots

      const next = createBlockConfig(current.type, {
        id: current.id,
        title: updates.title ?? current.title,
        props: mergedProps,
        extensions: mergedExtensions,
        slots: mergedSlots,
      })

      return {
        ...prev,
        blocks: {
          ...prev.blocks,
          [blockId]: next,
        },
      }
    })
  }

  const setBlockProps = (blockId: string, props: BlockConfig["props"] | undefined) => {
    setState((prev) => {
      const current = prev.blocks[blockId]
      if (!current) return prev

      const next = createBlockConfig(current.type, {
        id: current.id,
        title: current.title,
        props,
        extensions: current.extensions,
        slots: current.slots,
      })

      return {
        ...prev,
        blocks: {
          ...prev.blocks,
          [blockId]: next,
        },
      }
    })
  }

  const setBlockConfig = (blockId: string, nextConfig: BlockConfig) => {
    setState((prev) => {
      const current = prev.blocks[blockId]
      if (!current) return prev

      const typeChanged = current.type !== nextConfig.type
      const normalized = createBlockConfig(nextConfig.type, {
        id: blockId,
        title: nextConfig.title ?? current.title,
        props: nextConfig.props,
        extensions: nextConfig.extensions,
        slots: nextConfig.slots,
      })

      let nextLayout = prev.layout
      if (typeChanged) {
        const size = defaultBlockSize(nextConfig.type)
        nextLayout = resolveOverlaps(
          prev.layout.map((item) =>
            item.i === blockId
              ? {
                  ...item,
                  w: size.w,
                  h: size.h,
                }
              : item,
          ),
        )
      }

      return {
        ...prev,
        blocks: {
          ...prev.blocks,
          [blockId]: normalized,
        },
        layout: nextLayout,
      }
    })
  }

  const extendBlock = (blockId: string, extensionBlock: BlockConfig) => {
    const extensionDefaults = createBlockConfig(extensionBlock.type, {
      id: extensionBlock.id || generateId(`${blockId}-ext`),
      props: extensionBlock.props,
      title: extensionBlock.title,
      extensions: extensionBlock.extensions,
    })

    setState((prev) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        [blockId]: {
          ...prev.blocks[blockId],
          extensions: [...(prev.blocks[blockId].extensions || []), extensionDefaults],
        },
      },
    }))
  }

  const replaceBlockType = (blockId: string, type: BlockType) => {
    setState((prev) => {
      const current = prev.blocks[blockId]
      if (!current || current.type === type) return prev

      const defaults = createBlockConfig(type, {
        id: blockId,
        title: current.title,
        props: current.props,
        extensions: current.extensions,
      })

      const size = defaultBlockSize(type)

      const updatedLayout = prev.layout.map((item) =>
        item.i === blockId
          ? {
              ...item,
              w: size.w,
              h: size.h,
            }
          : item,
      )

      return {
        ...prev,
        blocks: {
          ...prev.blocks,
          [blockId]: { ...defaults, id: blockId },
        },
        layout: resolveOverlaps(updatedLayout),
      }
    })
  }

  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    if (state.mode !== "edit") return

    const layoutItem = state.layout.find((item) => item.i === blockId)
    if (!layoutItem) return

    setDraggedBlock(blockId)
    dragStartPos.current = { x: layoutItem.x, y: layoutItem.y }
    setDragPreview({ x: layoutItem.x, y: layoutItem.y, w: layoutItem.w, h: layoutItem.h })

    e.dataTransfer.effectAllowed = "move"
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

    const totalWidth = rect.width
    const gridUnitWidth = totalWidth / 12

    const newX = Math.max(0, Math.min(11, Math.floor(mouseX / gridUnitWidth)))
    const newY = Math.max(0, Math.floor(mouseY / rowHeight))

    setDragPreview((prev) => {
      if (!prev) return null

      const layoutItem = state.layout.find((item) => item.i === draggedBlock)
      if (!layoutItem) return prev

      return {
        x: newX,
        y: newY,
        w: layoutItem.w,
        h: layoutItem.h,
      }
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (!draggedBlock || !gridRef.current || !dragPreview) return

    setState((prev) => {
      const updatedLayout = prev.layout.map((item) =>
        item.i === draggedBlock ? { ...item, x: dragPreview.x, y: dragPreview.y } : item,
      )

      return {
        ...prev,
        layout: resolveOverlaps(updatedLayout),
      }
    })

    setDraggedBlock(null)
    setDragPreview(null)
    dragStartPos.current = null

    const draggedElement = e.currentTarget as HTMLElement
    draggedElement.style.transition = ""
    draggedElement.style.opacity = ""
    draggedElement.style.transform = ""
  }

  const handleDragEnd = () => {
    setDraggedBlock(null)
    setDragPreview(null)
    dragStartPos.current = null
    setState((prev) => ({
      ...prev,
      layout: resolveOverlaps(prev.layout),
    }))
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

    if (resizeFrame.current) {
      cancelAnimationFrame(resizeFrame.current)
    }

    resizeFrame.current = requestAnimationFrame(() => {
      const deltaX = e.clientX - resizing.startX
      const deltaY = e.clientY - resizing.startY

      const gridSize = 100
      const deltaW = Math.round(deltaX / gridSize)
      const deltaH = Math.round(deltaY / rowHeight)

      setState((prev) => {
        let changed = false
        const updatedLayout = prev.layout.map((item) => {
          if (item.i !== resizing.blockId) return item

          let newW = item.w
          let newH = item.h

          if (resizing.direction === "se" || resizing.direction === "e") {
            const proposed = Math.max(2, Math.min(12 - item.x, resizing.startW + deltaW))
            if (proposed !== newW) {
              newW = proposed
              changed = true
            }
          }
          if (resizing.direction === "se" || resizing.direction === "s") {
            const proposed = Math.max(2, Math.min(20, resizing.startH + deltaH))
            if (proposed !== newH) {
              newH = proposed
              changed = true
            }
          }

          if (!changed) {
            return item
          }

          return { ...item, w: newW, h: newH }
        })

        if (!changed) {
          return prev
        }

        return {
          ...prev,
          layout: resolveOverlaps(updatedLayout),
        }
      })

      resizeFrame.current = null
    })
  }

  const handleResizeEnd = () => {
    if (resizeFrame.current) {
      cancelAnimationFrame(resizeFrame.current)
      resizeFrame.current = null
    }
    setResizing(null)
    setState((prev) => ({
      ...prev,
      layout: resolveOverlaps(prev.layout),
    }))
  }

  const toggleBlockCollapse = (blockId: string) => {
    setState((prev) => {
      const updatedLayout = prev.layout.map((item) =>
        item.i === blockId ? { ...item, h: item.h <= 4 ? 8 : 4 } : item,
      )

      return {
        ...prev,
        layout: resolveOverlaps(updatedLayout),
      }
    })
  }

  useEffect(() => {
    if (!resizing) return

    document.addEventListener("mousemove", handleResizeMove)
    document.addEventListener("mouseup", handleResizeEnd)
    return () => {
      document.removeEventListener("mousemove", handleResizeMove)
      document.removeEventListener("mouseup", handleResizeEnd)
    }
  }, [resizing])

  useEffect(() => {
    const handleGlobalDragEnd = () => {
      handleDragEnd()
    }

    document.addEventListener("dragend", handleGlobalDragEnd)
    return () => {
      document.removeEventListener("dragend", handleGlobalDragEnd)
      if (resizeFrame.current) {
        cancelAnimationFrame(resizeFrame.current)
      }
    }
  }, [])

  const maxY = Math.max(...state.layout.map((item) => item.y + item.h), 0)

  useLayoutEffect(() => {
    if (!autoFit) return
    if (draggedBlock || resizing) return

    const gridElement = gridRef.current
    if (!gridElement) return

    setState((prev) => {
      let changed = false

      const nextLayout = prev.layout.map((item) => {
        const blockElement = gridElement.querySelector<HTMLElement>(`[data-block-id="${item.i}"]`)
        if (!blockElement) {
          return item
        }

        const card = blockElement.querySelector<HTMLElement>(cardSelector)
        if (!card) {
          return item
        }

        const body = card.querySelector<HTMLElement>("[data-grid-card-body]")
        const inner = card.querySelector<HTMLElement>("[data-grid-card-inner]")

        const prevBlockHeight = blockElement.style.height
        const prevBlockMinHeight = blockElement.style.minHeight
        const prevBlockMaxHeight = blockElement.style.maxHeight
        blockElement.style.height = "auto"
        blockElement.style.minHeight = "0px"
        blockElement.style.maxHeight = "none"

        const prevCardHeight = card.style.height
        const prevCardMinHeight = card.style.minHeight
        const prevCardMaxHeight = card.style.maxHeight
        card.style.height = "auto"
        card.style.minHeight = "0px"
        card.style.maxHeight = "none"

        const prevBodyHeight = body?.style.height
        const prevBodyMinHeight = body?.style.minHeight
        const prevBodyMaxHeight = body?.style.maxHeight
        const prevBodyFlex = body?.style.flex
        const prevBodyDisplay = body?.style.display
        if (body) {
          body.style.height = "auto"
          body.style.minHeight = "0px"
          body.style.maxHeight = "none"
          body.style.flex = "initial"
          body.style.display = "block"
        }

        const prevInnerMinHeight = inner?.style.minHeight
        const prevInnerFlex = inner?.style.flex
        if (inner) {
          inner.style.minHeight = "0px"
          inner.style.flex = "initial"
        }

        const measuredHeight = Math.ceil(card.scrollHeight)

        blockElement.style.height = prevBlockHeight
        blockElement.style.minHeight = prevBlockMinHeight
        blockElement.style.maxHeight = prevBlockMaxHeight
        card.style.height = prevCardHeight
        card.style.minHeight = prevCardMinHeight
        card.style.maxHeight = prevCardMaxHeight
        if (body) {
          body.style.height = prevBodyHeight ?? ""
          body.style.minHeight = prevBodyMinHeight ?? ""
          body.style.maxHeight = prevBodyMaxHeight ?? ""
          body.style.flex = prevBodyFlex ?? ""
          body.style.display = prevBodyDisplay ?? ""
        }
        if (inner) {
          inner.style.minHeight = prevInnerMinHeight ?? ""
          inner.style.flex = prevInnerFlex ?? ""
        }

        if (!measuredHeight) {
          return item
        }

        const minUnits = Math.max(
          minHeightForItem ? minHeightForItem(item) : defaultMinHeight,
          1,
        )
        const desiredUnits = Math.max(
          minUnits,
          Math.ceil((measuredHeight + verticalOffset) / rowHeight),
        )

        if (desiredUnits > item.h) {
          changed = true
          return { ...item, h: desiredUnits }
        }

        return item
      })

      if (!changed) {
        return prev
      }

      return {
        ...prev,
        layout: resolveOverlaps(nextLayout),
      }
    })
  }, [
    autoFit,
    cardSelector,
    draggedBlock,
    minHeightForItem,
    resizing,
    rowHeight,
    verticalOffset,
    state.blocks,
    state.layout,
  ])

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
    setBlockConfig,
    setBlockProps,
    extendBlock,
    replaceBlockType,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    handleResizeStart,
    toggleBlockCollapse,
  }
}
