"use client"

import type { ReactNode } from "react"
import type { BlockConfig } from "@/lib/grid-v2/types"

interface GridArea {
  id: string
  title: string
  span?: string
}

interface LayoutGridProps {
  columns?: number
  gap?: "xs" | "sm" | "md" | "lg"
  areas?: GridArea[]
  slots?: Record<string, BlockConfig | null>
  onSlotClick?: (slotId: string) => void
  isEditMode?: boolean
  renderSlot?: (slotId: string, block: BlockConfig, isEditMode: boolean) => ReactNode
}

const gapClass: Record<NonNullable<LayoutGridProps["gap"]>, string> = {
  xs: "gap-2",
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-6",
}

export function LayoutGridBlock({
  columns = 2,
  gap = "md",
  areas,
  slots,
  onSlotClick,
  isEditMode = false,
  renderSlot,
}: LayoutGridProps) {
  const safeColumns = Math.min(4, Math.max(1, columns))

  const fallbackAreas = areas ?? [
    { id: "tile-1", title: "Tile 1" },
    { id: "tile-2", title: "Tile 2" },
    { id: "tile-3", title: "Tile 3" },
    { id: "tile-4", title: "Tile 4" },
  ]

  const areaEntries = fallbackAreas.map((area) => ({
    ...area,
    block: slots?.[area.id] ?? null,
  }))

  const handleSlotClick = (slotId: string) => {
    if (!isEditMode || !onSlotClick) return
    onSlotClick(slotId)
  }

  return (
    <div
      className={`h-full ${gapClass[gap] ?? gapClass.md} grid`}
      style={{
        containerType: "inline-size",
        gridTemplateColumns: `repeat(${safeColumns}, minmax(0, 1fr))`,
      }}
    >
      {areaEntries.map(({ id, title, span, block }) => (
        <div
          key={id}
          className={`rounded-lg border border-dashed border-border/60 bg-muted/30 p-3 flex flex-col gap-1 min-h-[80px] ${
            isEditMode ? "cursor-pointer hover:border-border/80 hover:bg-muted/50 transition-colors" : ""
          }`}
          style={span ? { gridColumn: span } : undefined}
          onClick={() => handleSlotClick(id)}
        >
          <span className="text-xs font-semibold text-foreground truncate">{title}</span>
          {block && renderSlot ? (
            <div className="text-xs text-muted-foreground/80">{renderSlot(id, block, isEditMode)}</div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              {isEditMode && <div className="text-2xl text-muted-foreground/60 mb-2">+</div>}
              <span className="text-[11px] text-muted-foreground">
                {isEditMode ? "Click to add a block" : "Place cards or KPIs inside this nested grid."}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
