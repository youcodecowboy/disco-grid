'use client';

import { useState, useRef, useEffect } from 'react';
import { DiscoHeader } from '@/components/disco/DiscoHeader';
import { DiscoFooter } from '@/components/disco/DiscoFooter';
import { TodoList } from '@/components/disco/TodoList';
import { UnreadMessages } from '@/components/disco/UnreadMessages';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type GridPos = {
  x: number
  y: number
  w: number
  h: number
  i: string
}

type Block = {
  id: string
  type: string
  title: string
}

type DiscoState = {
  mode: "edit" | "save"
  layout: GridPos[]
  blocks: Record<string, Block>
}

const PlusIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
)

const EditIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
  </svg>
)

const Trash2Icon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2 2v-7" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
)

const initialState: DiscoState = {
  mode: "save",
  layout: [
    { x: 0, y: 0, w: 6, h: 8, i: 'todo-list' },
    { x: 6, y: 0, w: 6, h: 4, i: 'unread-messages' }
  ],
  blocks: {
    'todo-list': {
      id: 'todo-list',
      type: 'todo',
      title: 'Tasks'
    },
    'unread-messages': {
      id: 'unread-messages',
      type: 'messages',
      title: 'Messages'
    }
  }
}

export default function DiscoPage() {
  const [state, setState] = useState<DiscoState>(initialState)
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

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('disco-dashboard')
    if (saved) {
      try {
        setState(JSON.parse(saved))
      } catch (error) {
        console.warn("Failed to load disco state from localStorage:", error)
      }
    }
  }, [])

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('disco-dashboard', JSON.stringify(state))
  }, [state])

  const toggleMode = () => {
    setState((prev) => ({ ...prev, mode: prev.mode === "edit" ? "save" : "edit" }))
  }

  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    if (state.mode !== "edit") return
    
    const layoutItem = state.layout.find((item) => item.i === blockId)
    if (!layoutItem) return

    setDraggedBlock(blockId)
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
    
    if (!draggedBlock || !gridRef.current) return

    const rect = gridRef.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // Calculate grid position
    const totalWidth = rect.width
    const gridUnitWidth = totalWidth / 12 // 12-column grid
    const rowHeight = 40 // Height of one grid row
    
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
        h: layoutItem.h
      }
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (!draggedBlock || !gridRef.current || !dragPreview) return

    setState((prev) => ({
      ...prev,
      layout: prev.layout.map((item) =>
        item.i === draggedBlock ? { ...item, x: dragPreview.x, y: dragPreview.y } : item,
      ),
    }))

    setDraggedBlock(null)
    setDragPreview(null)

    // Remove transition effects
    const draggedElement = e.currentTarget as HTMLElement
    draggedElement.style.transition = ""
    draggedElement.style.opacity = ""
    draggedElement.style.transform = ""
  }

  const handleResizeStart = (e: React.MouseEvent, blockId: string, direction: "se" | "e" | "s") => {
    e.preventDefault()
    e.stopPropagation()

    if (state.mode !== "edit") return

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

  const deleteBlock = (blockId: string) => {
    setState((prev) => ({
      ...prev,
      layout: prev.layout.filter((item) => item.i !== blockId),
      blocks: Object.fromEntries(Object.entries(prev.blocks).filter(([id]) => id !== blockId)),
    }))
  }

  const renderComponent = (blockId: string) => {
    switch (blockId) {
      case 'todo-list':
        return <TodoList />;
      case 'unread-messages':
        return <UnreadMessages />;
      default:
        return <div>Unknown component</div>;
    }
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

  const maxY = Math.max(...state.layout.map((item) => item.y + item.h), 0)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DiscoHeader isEditMode={state.mode === "edit"} onToggleEdit={toggleMode} />
      
      <main className="flex-1 p-4 pt-20 pb-20">
        <div className="max-w-6xl mx-auto">

          <div
            ref={gridRef}
            className={`relative ${
              state.mode === "edit"
                ? "bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:28px_28px]"
                : ""
            }`}
            style={{ minHeight: `${(maxY + 6) * 40 + 100}px` }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {/* Drag Preview Indicator */}
            {dragPreview && state.mode === "edit" && (
              <div
                className="absolute pointer-events-none z-20"
                style={{
                  left: `calc(${(dragPreview.x / 12) * 100}% + ${dragPreview.x > 0 ? "8px" : "0px"})`,
                  top: `${dragPreview.y * 40 + (dragPreview.y > 0 ? 8 : 0)}px`,
                  width: `calc(${(dragPreview.w / 12) * 100}% - ${dragPreview.x + dragPreview.w < 12 ? "8px" : "0px"})`,
                  height: `${dragPreview.h * 40 - 8}px`,
                }}
              >
                <div className="w-full h-full border-2 border-blue-500 border-dashed bg-blue-50/30 rounded-lg shadow-lg animate-pulse">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-lg"></div>
                  <div className="absolute top-2 left-2 text-xs text-blue-600 font-medium bg-white/80 px-2 py-1 rounded">
                    Drop here
                  </div>
                </div>
              </div>
            )}

            <div className="relative">
              {state.layout.map((item) => {
                const block = state.blocks[item.i]
                if (!block) return null

                return (
                  <div
                    key={item.i}
                    className={`absolute group transition-all duration-200 ease-out ${state.mode === "edit" ? "cursor-move" : ""} ${draggedBlock === item.i ? "z-30" : "z-10"}`}
                    style={{
                      left: `calc(${(item.x / 12) * 100}% + ${item.x > 0 ? "8px" : "0px"})`,
                      top: `${item.y * 40 + (item.y > 0 ? 8 : 0)}px`,
                      width: `calc(${(item.w / 12) * 100}% - ${item.x + item.w < 12 ? "8px" : "0px"})`,
                      height: `${item.h * 40 - 8}px`,
                      transform: draggedBlock === item.i ? "rotate(2deg) scale(1.02)" : "rotate(0deg) scale(1)",
                      opacity: draggedBlock === item.i ? 0.8 : 1,
                      filter: draggedBlock === item.i ? "drop-shadow(0 10px 20px rgba(0,0,0,0.2))" : "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                    }}
                    draggable={state.mode === "edit"}
                    onDragStart={(e) => handleDragStart(e, item.i)}
                  >
                    <Card className="h-full shadow-sm border-2 rounded-lg relative">
                      {state.mode === "edit" && (
                        <>
                          {/* Resize handles */}
                          <div
                            className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500/50 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity"
                            onMouseDown={(e) => handleResizeStart(e, item.i, "se")}
                          />
                          <div
                            className="absolute top-4 right-0 w-1 h-8 bg-blue-500/30 cursor-e-resize opacity-0 group-hover:opacity-100 transition-opacity"
                            onMouseDown={(e) => handleResizeStart(e, item.i, "e")}
                          />
                          <div
                            className="absolute bottom-0 left-4 w-8 h-1 bg-blue-500/30 cursor-s-resize opacity-0 group-hover:opacity-100 transition-opacity"
                            onMouseDown={(e) => handleResizeStart(e, item.i, "s")}
                          />
                        </>
                      )}

                      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 border-b-2 h-8">
                        <h3 className="font-medium text-sm">{block.title}</h3>
                        {state.mode === "edit" && (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 hover:bg-red-100"
                              onClick={() => deleteBlock(item.i)}
                              title="Delete Block"
                            >
                              <Trash2Icon />
                            </Button>
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="p-0 flex flex-col min-h-0" style={{ height: "calc(100% - 32px)" }}>
                        <div className="flex-1 min-h-0 p-4 overflow-auto flex flex-col">
                          {renderComponent(block.id)}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>
      
      <DiscoFooter />
    </div>
  );
}
