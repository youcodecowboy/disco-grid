"use client"

import { forwardRef, type DragEvent, type MouseEvent, type ReactNode } from "react"
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
  onDragStart: (event: DragEvent<HTMLDivElement>, blockId: string) => void
  onResizeStart: (event: MouseEvent<HTMLDivElement>, blockId: string, direction: "se" | "e" | "s") => void
  onToggleCollapse?: (blockId: string) => void
  onNotification?: (blockId: string) => void
  onAiAssistant?: (blockId: string) => void
  onEdit?: (blockId: string) => void
  onExtend?: (blockId: string) => void
  onDelete?: (blockId: string) => void
  onActivate?: (blockId: string) => void
  stepLabel?: string
}

const BlockShell = forwardRef<HTMLDivElement, BlockShellProps>(function BlockShell(
  {
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
    onActivate,
    stepLabel,
  },
  ref,
) {
  return (
    <GridCard
      ref={ref}
      blockId={blockId}
      title={title}
      mode={mode}
      gridPos={gridPos}
      draggedBlock={draggedBlock}
      controls={controls}
      className={className}
      onDragStart={onDragStart}
      onResizeStart={onResizeStart}
      onToggleCollapse={onToggleCollapse}
      onNotification={onNotification}
      onAiAssistant={onAiAssistant}
      onEdit={onEdit}
      onExtend={onExtend}
      onDelete={onDelete}
      onActivate={onActivate}
      stepLabel={stepLabel}
    >
      {children}
    </GridCard>
  )
})

export default BlockShell
