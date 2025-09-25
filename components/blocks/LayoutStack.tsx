"use client"

import type { ReactNode } from "react"
import type { BlockConfig } from "@/lib/grid-v2/types"

interface LayoutStackProps {
  direction?: "vertical" | "horizontal"
  gap?: "xs" | "sm" | "md" | "lg"
  sections?: Array<{ id: string; title: string; description?: string }>
  slots?: Record<string, BlockConfig | null>
  onSlotClick?: (slotId: string) => void
  isEditMode?: boolean
  renderSlot?: (slotId: string, block: BlockConfig, isEditMode: boolean) => ReactNode
}

const gapClass: Record<NonNullable<LayoutStackProps["gap"]>, string> = {
  xs: "gap-2",
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-6",
}

export function LayoutStack({
  direction = "vertical",
  gap = "md",
  sections,
  slots,
  onSlotClick,
  isEditMode = false,
  renderSlot,
}: LayoutStackProps) {
  const fallbackSections = sections ?? [
    { id: "section-1", title: "Section 1", description: "Use this area for primary content." },
    { id: "section-2", title: "Section 2", description: "Add supporting details or actions." },
  ]

  const sectionEntries = fallbackSections.map((section) => ({
    ...section,
    block: slots?.[section.id] ?? null,
  }))

  const isHorizontal = direction === "horizontal"

  const handleSlotClick = (slotId: string) => {
    if (!isEditMode || !onSlotClick) return
    onSlotClick(slotId)
  }

  return (
    <div
      className={`h-full flex ${isHorizontal ? "flex-row" : "flex-col"} ${gapClass[gap] ?? gapClass.md}`}
      style={{ containerType: "inline-size" }}
    >
      {sectionEntries.map(({ id, title, description, block }) => (
        <div
          key={id}
          className={`flex-1 rounded-lg border border-dashed border-border/70 bg-card/60 p-4 min-h-[100px] flex flex-col gap-2 ${
            isEditMode ? "cursor-pointer hover:border-border/80 hover:bg-card/80 transition-colors" : ""
          }`}
          onClick={() => handleSlotClick(id)}
        >
          <span className="text-xs font-semibold text-foreground truncate">{title}</span>
          {block && renderSlot ? (
            <div className="text-xs text-muted-foreground/80">{renderSlot(id, block, isEditMode)}</div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              {isEditMode && <div className="text-2xl text-muted-foreground/60 mb-2">+</div>}
              <span className="text-[11px] text-muted-foreground leading-relaxed">
                {isEditMode ? "Click to add a block" : description || "Stack blocks to build detail panes or onboarding steps."}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
