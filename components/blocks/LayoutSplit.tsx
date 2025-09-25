"use client"

import type { ReactNode } from "react"
import type { BlockConfig } from "@/lib/grid-v2/types"

interface LayoutSplitProps {
  direction?: "horizontal" | "vertical"
  ratio?: number
  primaryTitle?: string
  secondaryTitle?: string
  primaryNode?: ReactNode
  secondaryNode?: ReactNode
  slots?: Record<string, BlockConfig | null>
  onSlotClick?: (slotId: string) => void
  isEditMode?: boolean
  renderSlot?: (slotId: string, block: BlockConfig, isEditMode: boolean) => ReactNode
}

export function LayoutSplit({
  direction = "horizontal",
  ratio = 60,
  primaryTitle = "Primary Pane",
  secondaryTitle = "Secondary Pane",
  primaryNode,
  secondaryNode,
  slots,
  onSlotClick,
  isEditMode = false,
  renderSlot,
}: LayoutSplitProps) {
  const clampedRatio = Math.min(90, Math.max(10, ratio))
  const isVertical = direction === "vertical"

  const primaryFlex = isVertical ? undefined : `${clampedRatio}%`
  const secondaryFlex = isVertical ? undefined : `${100 - clampedRatio}%`

  const slotConfigs = {
    primary: slots?.primary ?? null,
    secondary: slots?.secondary ?? null,
  }

  const handleSlotClick = (slotId: "primary" | "secondary") => {
    if (!isEditMode || !onSlotClick) return
    onSlotClick(slotId)
  }

  const renderPane = (
    slotId: "primary" | "secondary",
    block: BlockConfig | null,
    fallbackTitle: string,
    fallbackCopy: string,
    fallbackNode?: ReactNode,
  ) => {
    if (block && renderSlot) {
      return renderSlot(slotId, block, isEditMode)
    }

    if (fallbackNode) {
      return fallbackNode
    }

    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        {isEditMode && <div className="text-2xl text-muted-foreground/60 mb-2">+</div>}
        <span className="text-[11px] text-muted-foreground">
          {isEditMode ? "Click to add a block" : fallbackCopy}
        </span>
      </div>
    )
  }

  return (
    <div
      className={`h-full flex ${isVertical ? "flex-col" : "flex-row"} gap-3 sm:gap-4`}
      style={{ containerType: "inline-size" }}
    >
      <div
        className={`flex-1 rounded-lg border border-dashed border-border/70 bg-muted/40 p-4 flex flex-col gap-2 min-h-[120px] ${
          isEditMode ? "cursor-pointer hover:border-border/80 hover:bg-muted/60 transition-colors" : ""
        }`}
        style={isVertical ? undefined : { flexBasis: primaryFlex }}
        onClick={() => handleSlotClick("primary")}
      >
        <span className="text-xs font-semibold text-foreground truncate">{primaryTitle}</span>
        {renderPane(
          "primary",
          slotConfigs.primary,
          "Primary Content",
          "Use split layouts for side-by-side editors, detail views, or summary vs timeline panes.",
          primaryNode,
        )}
      </div>
      <div
        className={`flex-1 rounded-lg border border-dashed border-border/50 bg-muted/20 p-4 flex flex-col gap-2 min-h-[120px] ${
          isEditMode ? "cursor-pointer hover:border-border/80 hover:bg-muted/40 transition-colors" : ""
        }`}
        style={isVertical ? undefined : { flexBasis: secondaryFlex }}
        onClick={() => handleSlotClick("secondary")}
      >
        <span className="text-xs font-semibold text-foreground truncate">{secondaryTitle}</span>
        {renderPane(
          "secondary",
          slotConfigs.secondary,
          "Secondary Content",
          "Adjust the ratio to allocate space between primary and contextual content.",
          secondaryNode,
        )}
      </div>
    </div>
  )
}
