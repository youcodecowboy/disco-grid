"use client"

import { useState, useRef, type DragEvent, type MouseEvent } from "react"
import { useSiteMap } from "../context/SiteMapContext"
import BlockRenderer from "@/components/BlockRenderer"
import { elementTemplates } from "@/lib/site-map/mockData"
import type { SiteElement } from "@/lib/site-map/types"
import { useEffect } from "react"
import { ElementDetailsDrawer } from "./ElementDetailsDrawer"

export function SiteMapView() {
  const { siteMap, getCurrentFloor, updateFloorGridState, addElement, updateElement, deleteElement } = useSiteMap()
  const [draggingElementType, setDraggingElementType] = useState<string | null>(null)
  const [dragPreview, setDragPreview] = useState<{ x: number; y: number; w: number; h: number } | null>(null)
  const [draggingBlock, setDraggingBlock] = useState<string | null>(null)
  const [resizing, setResizing] = useState<{
    blockId: string
    direction: "se" | "e" | "s"
    startX: number
    startY: number
    startW: number
    startH: number
  } | null>(null)
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const dragStartPos = useRef<{ x: number; y: number } | null>(null)

  const currentFloor = getCurrentFloor()
  const gridState = currentFloor?.gridState || { mode: "edit", layout: [], blocks: {} }
  const maxY = Math.max(...gridState.layout.map((item) => item.y + item.h), 0)

  if (!currentFloor) {
    return <div className="flex items-center justify-center h-full text-gray-500">No floor selected</div>
  }

  const handlePaletteDragStart = (e: DragEvent, elementType: string) => {
    e.dataTransfer.effectAllowed = "copy"
    e.dataTransfer.setData("elementType", elementType)
    setDraggingElementType(elementType)
  }

  const handlePaletteDragOver = (e: DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"

    if (!gridRef.current || !draggingElementType) return

    const rect = gridRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const gridX = Math.floor((x / rect.width) * 12)
    const gridY = Math.floor(y / 40)

    const template = elementTemplates.find((t) => t.type === draggingElementType)
    const defaultW = template?.type === "production-line" ? 4 : template?.type === "zone" ? 3 : 2
    const defaultH = template?.type === "production-line" ? 2 : template?.type === "zone" ? 3 : 2

    setDragPreview({
      x: Math.max(0, Math.min(gridX, 12 - defaultW)),
      y: Math.max(0, gridY),
      w: defaultW,
      h: defaultH,
    })
  }

  const handlePaletteDrop = (e: DragEvent) => {
    e.preventDefault()

    const elementType = e.dataTransfer.getData("elementType")
    if (!elementType || !dragPreview) return

    const template = elementTemplates.find((t) => t.type === elementType)
    if (!template) return

    // Create new element
    const newElement: SiteElement = {
      id: `element-${Date.now()}`,
      type: template.type,
      name: template.label,
      description: template.description,
      icon: template.icon,
      color: template.defaultColor,
      status: "active",
      properties: {},
      floor: currentFloor.id,
      position: dragPreview,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    addElement(newElement)
    setDragPreview(null)
    setDraggingElementType(null)
  }

  const handlePaletteDragEnd = () => {
    setDragPreview(null)
    setDraggingElementType(null)
  }

  const handleBlockDragStart = (e: DragEvent, blockId: string) => {
    // Don't start dragging if we're resizing
    if (resizing) {
      e.preventDefault()
      return
    }
    
    e.stopPropagation()
    setDraggingBlock(blockId)
    const item = gridState.layout.find((i) => i.i === blockId)
    if (item && gridRef.current) {
      const rect = gridRef.current.getBoundingClientRect()
      dragStartPos.current = {
        x: e.clientX - rect.left - (item.x / 12) * rect.width,
        y: e.clientY - rect.top - item.y * 40,
      }
    }
  }

  const handleBlockDrag = (e: DragEvent) => {
    if (!draggingBlock || !gridRef.current || !dragStartPos.current) return
    e.preventDefault()

    const rect = gridRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - dragStartPos.current.x
    const y = e.clientY - rect.top - dragStartPos.current.y

    const gridX = Math.round((x / rect.width) * 12)
    const gridY = Math.round(y / 40)

    const item = gridState.layout.find((i) => i.i === draggingBlock)
    if (!item) return

    setDragPreview({
      x: Math.max(0, Math.min(gridX, 12 - item.w)),
      y: Math.max(0, gridY),
      w: item.w,
      h: item.h,
    })
  }

  const handleBlockDrop = (e: DragEvent) => {
    if (!draggingBlock || !dragPreview) return
    e.preventDefault()

    updateElement(draggingBlock, {
      position: dragPreview,
    })

    setDraggingBlock(null)
    setDragPreview(null)
    dragStartPos.current = null
  }

  const handleResizeStart = (e: MouseEvent, blockId: string, direction: "se" | "e" | "s") => {
    e.preventDefault()
    e.stopPropagation()

    const item = gridState.layout.find((i) => i.i === blockId)
    if (!item) return

    // Set the initial preview
    setDragPreview({
      x: item.x,
      y: item.y,
      w: item.w,
      h: item.h,
    })

    setResizing({
      blockId,
      direction,
      startX: e.clientX,
      startY: e.clientY,
      startW: item.w,
      startH: item.h,
    })
  }

  useEffect(() => {
    if (!resizing) return

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (!gridRef.current) return

      const rect = gridRef.current.getBoundingClientRect()
      const deltaX = e.clientX - resizing.startX
      const deltaY = e.clientY - resizing.startY

      const deltaGridX = Math.round((deltaX / rect.width) * 12)
      const deltaGridY = Math.round(deltaY / 40)

      let newW = resizing.startW
      let newH = resizing.startH

      if (resizing.direction === "se" || resizing.direction === "e") {
        newW = Math.max(1, Math.min(12, resizing.startW + deltaGridX))
      }
      if (resizing.direction === "se" || resizing.direction === "s") {
        newH = Math.max(1, resizing.startH + deltaGridY)
      }

      const item = gridState.layout.find((i) => i.i === resizing.blockId)
      if (item) {
        setDragPreview({
          x: item.x,
          y: item.y,
          w: newW,
          h: newH,
        })
      }
    }

    const handleMouseUp = () => {
      if (dragPreview && resizing) {
        updateElement(resizing.blockId, {
          position: dragPreview,
        })
      }
      setResizing(null)
      setDragPreview(null)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [resizing, dragPreview, updateElement, gridState.layout])

  const handleElementClick = (e: MouseEvent, elementId: string) => {
    // Don't open drawer if we're dragging or resizing
    if (draggingBlock || resizing) return
    
    // Don't open if clicking on controls
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('[data-resize-handle]')) {
      return
    }
    
    setSelectedElementId(elementId)
  }

  return (
    <div className="flex h-full">
      {/* Element palette */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Elements</h3>
        <div className="space-y-2">
          {elementTemplates.map((template) => (
            <div
              key={template.type}
              draggable
              onDragStart={(e) => handlePaletteDragStart(e, template.type)}
              onDragEnd={handlePaletteDragEnd}
              className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-grab active:cursor-grabbing border border-gray-200 transition-colors"
              style={{ borderLeftColor: template.defaultColor, borderLeftWidth: "3px" }}
            >
              <span className="text-2xl">{template.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">{template.label}</div>
                <div className="text-xs text-gray-500 truncate">{template.description}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>Tip:</strong> Drag elements onto the grid to build your site map. Drag existing elements to move
            them, or resize from the bottom-right corner.
          </p>
        </div>
      </div>

      {/* Grid area */}
      <div className="flex-1 overflow-auto p-6">
        <div
          ref={gridRef}
          className="relative bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:28px_28px]"
          style={{ minHeight: `${(maxY + 6) * 40 + 100}px` }}
          onDragOver={handlePaletteDragOver}
          onDrop={handlePaletteDrop}
        >
          {/* Drag preview */}
          {dragPreview && (
            <div
              className="absolute pointer-events-none z-20"
              style={{
                left: `calc(${(dragPreview.x / 12) * 100}% + ${dragPreview.x > 0 ? "8px" : "0px"})`,
                top: `${dragPreview.y * 40 + (dragPreview.y > 0 ? 8 : 0)}px`,
                width: `calc(${(dragPreview.w / 12) * 100}% - ${dragPreview.x + dragPreview.w < 12 ? "8px" : "0px"})`,
                height: `${dragPreview.h * 40 - 8}px`,
              }}
            >
              <div className="w-full h-full border-2 border-blue-500 border-dashed bg-blue-50/30 rounded-lg"></div>
            </div>
          )}

          {/* Render elements */}
          {gridState.layout.map((item) => {
            const block = gridState.blocks[item.i]
            if (!block) return null

            const isDragging = draggingBlock === item.i

            return (
              <div
                key={item.i}
                draggable={!resizing}
                onDragStart={(e) => handleBlockDragStart(e, item.i)}
                onDrag={handleBlockDrag}
                onDragEnd={handleBlockDrop}
                onClick={(e) => handleElementClick(e, item.i)}
                className={`absolute group ${isDragging ? "opacity-50" : ""} ${resizing?.blockId === item.i ? "z-30" : ""} cursor-pointer hover:ring-2 hover:ring-blue-400 rounded-lg transition-all`}
                style={{
                  left: `calc(${(item.x / 12) * 100}% + ${item.x > 0 ? "8px" : "0px"})`,
                  top: `${item.y * 40 + (item.y > 0 ? 8 : 0)}px`,
                  width: `calc(${(item.w / 12) * 100}% - ${item.x + item.w < 12 ? "8px" : "0px"})`,
                  height: `${item.h * 40 - 8}px`,
                }}
              >
                {/* Site element content */}
                <div className="w-full h-full pointer-events-none">
                  <BlockRenderer block={block} isEditing={false} />
                </div>

                {/* Control buttons */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedElementId(item.i)
                    }}
                    className="w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded flex items-center justify-center text-xs pointer-events-auto"
                    title="Edit details"
                  >
                    ✏
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteElement(item.i)
                    }}
                    className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded flex items-center justify-center text-xs pointer-events-auto"
                  >
                    ×
                  </button>
                </div>

                {/* Resize handle */}
                <div
                  data-resize-handle="true"
                  className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 rounded-tl cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-auto"
                  onMouseDown={(e) => handleResizeStart(e, item.i, "se")}
                  title="Drag to resize"
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Element Details Drawer */}
      <ElementDetailsDrawer elementId={selectedElementId} onClose={() => setSelectedElementId(null)} />
    </div>
  )
}

