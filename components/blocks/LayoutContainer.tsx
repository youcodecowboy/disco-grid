"use client"

import type { ReactNode } from "react"
import type { BlockConfig } from "@/lib/grid-v2/types"

interface LayoutContainerProps {
  title?: string
  description?: string
  padding?: "none" | "xs" | "sm" | "md" | "lg"
  background?: "surface" | "muted" | "subtle"
  border?: boolean
  slots?: Record<string, BlockConfig | null>
  onSlotClick?: (slotId: string) => void
  isEditMode?: boolean
  renderSlot?: (slotId: string, block: BlockConfig, isEditMode: boolean) => ReactNode
}

const paddingClass: Record<NonNullable<LayoutContainerProps["padding"]>, string> = {
  none: "p-0",
  xs: "p-2",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
}

const backgroundClass: Record<NonNullable<LayoutContainerProps["background"]>, string> = {
  surface: "bg-card",
  muted: "bg-muted",
  subtle: "bg-muted/60",
}

export function LayoutContainer({
  title = "Container",
  description = "Use containers to group related blocks and establish visual rhythm.",
  padding = "md",
  background = "surface",
  border = true,
  slots,
  onSlotClick,
  isEditMode = false,
  renderSlot,
}: LayoutContainerProps) {
  const defaultSlotMeta: Array<{ id: string; label: string; description: string }> = [
    {
      id: "primary",
      label: "Primary Content",
      description: "Drop key metrics or charts here.",
    },
    {
      id: "secondary",
      label: "Secondary Content",
      description: "Use containers to keep dashboards readable.",
    },
  ]

  const slotEntries = slots
    ? Object.entries(slots)
    : defaultSlotMeta.map(({ id }) => [id, null as BlockConfig | null])

  const resolveMeta = (slotId: string, index: number) =>
    defaultSlotMeta[index] ?? {
      id: slotId,
      label: slotId,
      description: "Select a block to populate this slot via the layout editor.",
    }

  return (
    <div
      className={`h-full rounded-xl ${paddingClass[padding] ?? paddingClass.md} ${backgroundClass[background] ?? backgroundClass.surface} ${border ? "border border-border" : ""} shadow-sm transition-colors`}
      style={{ containerType: "inline-size" }}
    >
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground truncate">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        <div className="grid gap-3 sm:grid-cols-2 text-xs text-muted-foreground/80">
          {slotEntries.map(([slotId, slotBlock], index) => {
            const meta = resolveMeta(slotId, index)
            const handleClick = () => {
              if (!isEditMode || !onSlotClick) return
              onSlotClick(slotId)
            }

            return (
              <div
                key={slotId}
                className={`rounded-lg border border-dashed border-border/60 p-3 flex flex-col gap-1 min-h-[100px] ${
                  isEditMode ? "cursor-pointer hover:border-border/80 hover:bg-muted/20 transition-colors" : ""
                }`}
                onClick={handleClick}
              >
                <span className="font-medium text-foreground truncate">{meta.label}</span>
                {slotBlock && renderSlot ? (
                  <div className="text-xs text-muted-foreground/80">{renderSlot(slotId, slotBlock, isEditMode)}</div>
                ) : (
                  <span className="text-muted-foreground leading-relaxed">
                    {isEditMode ? "Click to add a block" : meta.description}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
