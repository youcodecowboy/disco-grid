"use client"

import React, { ReactNode } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Icons
const NotificationIcon = () => (
  <svg className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 lg:h-4 lg:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

const BotIcon = () => (
  <svg className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 lg:h-4 lg:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </svg>
)

const EditIcon = () => (
  <svg className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 lg:h-4 lg:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
  </svg>
)

const ExpandIcon = () => (
  <svg className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 lg:h-4 lg:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M15 3h6v6" />
    <path d="M9 21H3v-6" />
    <path d="M21 3l-7 7" />
    <path d="M3 21l7-7" />
  </svg>
)

const Trash2Icon = () => (
  <svg className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 lg:h-4 lg:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2 2v-7" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
)

interface GridCardProps {
  blockId: string
  title: string
  children: ReactNode
  mode: "edit" | "save"
  gridPos: { x: number; y: number; w: number; h: number; i: string }
  draggedBlock: string | null
  onDragStart: (e: React.DragEvent, blockId: string) => void
  onResizeStart: (e: React.MouseEvent, blockId: string, direction: "se" | "e" | "s") => void
  onToggleCollapse?: (blockId: string) => void
  onNotification?: (blockId: string) => void
  onAiAssistant?: (blockId: string) => void
  onEdit?: (blockId: string) => void
  onExtend?: (blockId: string) => void
  onDelete?: (blockId: string) => void
  className?: string
}

export default function GridCard({
  blockId,
  title,
  children,
  mode,
  gridPos,
  draggedBlock,
  onDragStart,
  onResizeStart,
  onToggleCollapse,
  onNotification,
  onAiAssistant,
  onEdit,
  onExtend,
  onDelete,
  className = ""
}: GridCardProps) {
  const isDragging = draggedBlock === blockId

  return (
    <div
      className={`absolute group transition-all duration-200 ease-out ${
        mode === "edit" ? "cursor-move" : ""
      } ${isDragging ? "z-30" : "z-10"} ${className}`}
      style={{
        left: `calc(${(gridPos.x / 12) * 100}% + ${gridPos.x > 0 ? "8px" : "0px"})`,
        top: `${gridPos.y * 40 + (gridPos.y > 0 ? 8 : 0)}px`,
        width: `calc(${(gridPos.w / 12) * 100}% - ${gridPos.x + gridPos.w < 12 ? "8px" : "0px"})`,
        height: `${gridPos.h * 40 - 8}px`,
        transform: isDragging ? "rotate(2deg) scale(1.02)" : "rotate(0deg) scale(1)",
        opacity: isDragging ? 0.8 : 1,
        filter: isDragging ? "drop-shadow(0 10px 20px rgba(0,0,0,0.2))" : "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
      }}
      draggable={mode === "edit"}
      onDragStart={(e) => onDragStart(e, blockId)}
    >
      <Card className="h-full shadow-sm border-2 rounded-none relative transition-all duration-200 ease-out hover:shadow-md">
        {mode === "edit" && (
          <>
            {/* Bottom-right corner: resize both width and height */}
            <div
              className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500/60 cursor-se-resize opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out rounded-tl-md hover:bg-blue-500/80"
              onMouseDown={(e) => onResizeStart(e, blockId, "se")}
            >
              <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-white"></div>
            </div>
            {/* Right edge: resize width only */}
            <div
              className="absolute top-4 right-0 w-2 h-8 bg-blue-500/40 cursor-e-resize opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out hover:bg-blue-500/60"
              onMouseDown={(e) => onResizeStart(e, blockId, "e")}
            />
            {/* Bottom edge: resize height only */}
            <div
              className="absolute bottom-0 left-4 w-8 h-2 bg-blue-500/40 cursor-s-resize opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out hover:bg-blue-500/60"
              onMouseDown={(e) => onResizeStart(e, blockId, "s")}
            />
            {onToggleCollapse && (
              <div
                className="absolute top-2 right-2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out cursor-pointer hover:text-foreground hover:bg-muted/50 px-1 py-0.5 rounded"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleCollapse(blockId)
                }}
              >
                ⤢
              </div>
            )}
          </>
        )}

        <CardHeader className="flex flex-row items-center justify-between space-y-0 px-2 sm:px-3 md:px-4 border-b-2 h-6 sm:h-7 md:h-8 transition-all duration-200 ease-out">
          <h3 className="font-medium text-[8px] sm:text-[10px] md:text-xs lg:text-sm truncate flex-1 min-w-0 pr-2">{title}</h3>
          {mode === "edit" && (
            <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
              {onNotification && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 hover:bg-yellow-100 transition-all duration-150 ease-out hover:scale-105"
                  onClick={() => onNotification(blockId)}
                  title="Set Notifications"
                >
                  <NotificationIcon />
                </Button>
              )}
              {onAiAssistant && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 hover:bg-blue-100 transition-all duration-150 ease-out hover:scale-105"
                  onClick={() => onAiAssistant(blockId)}
                  title="AI Assistant"
                >
                  <BotIcon />
                </Button>
              )}
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 hover:bg-green-100 transition-all duration-150 ease-out hover:scale-105"
                  onClick={() => onEdit(blockId)}
                  title="Edit Block"
                >
                  <EditIcon />
                </Button>
              )}
              {onExtend && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 hover:bg-purple-100 transition-all duration-150 ease-out hover:scale-105"
                  onClick={() => onExtend(blockId)}
                  title="Extend Block"
                >
                  <ExpandIcon />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 hover:bg-red-100 transition-all duration-150 ease-out hover:scale-105"
                  onClick={() => onDelete(blockId)}
                  title="Delete Block"
                >
                  <Trash2Icon />
                </Button>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0 flex flex-col transition-all duration-200 ease-out" style={{ height: "calc(100% - 32px)" }}>
          <div className="flex-1 min-h-0 flex flex-col">
            {children}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
