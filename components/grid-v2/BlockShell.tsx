"use client"

import type { ReactNode } from "react"
import GridCard from "@/components/GridCard"
import type { GridCoordinates } from "@/lib/grid-v2/types"

interface BlockShellProps {
  blockId: string
  title: string
  mode: "edit" | "save"
  gridPos: GridCoordinates
  draggedBlock: string | null
  children: ReactNode
  controls?: ReactNode
  className?: string
  onDragStart: (event: React.DragEvent, blockId: string) => void
  onResizeStart: (event: React.MouseEvent, blockId: string, direction: "se" | "e" | "s") => void
  onToggleCollapse?: (blockId: string) => void
  onNotification?: (blockId: string) => void
  onAiAssistant?: (blockId: string) => void
  onEdit?: (blockId: string) => void
  onExtend?: (blockId: string) => void
  onDelete?: (blockId: string) => void
}

export default function BlockShell({
  blockId,
  title,
  mode,
  gridPos,
  draggedBlock,
  children,
  controls,
  className,
  onDragStart,
  onResizeStart,
  onToggleCollapse,
  onNotification,
  onAiAssistant,
  onEdit,
  onExtend,
  onDelete,
}: BlockShellProps) {
  return (
    <GridCard
      blockId={blockId}
      title={title}
      mode={mode}
      gridPos={gridPos}
      draggedBlock={draggedBlock}
      controls={controls}
      className={className}
      onDragStart={(event) => onDragStart(event, blockId)}
      onResizeStart={(event, _id, direction) => onResizeStart(event, blockId, direction)}
      onToggleCollapse={onToggleCollapse}
      onNotification={onNotification}
      onAiAssistant={onAiAssistant}
      onEdit={onEdit}
      onExtend={onExtend}
      onDelete={onDelete}
    >
      {children}
    </GridCard>
  )
}
