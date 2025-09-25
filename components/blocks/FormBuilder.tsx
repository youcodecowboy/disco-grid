"use client"

import { useState, type ReactNode } from "react"
import { Plus, GripVertical } from "lucide-react"
import type { BlockConfig } from "@/lib/grid-v2/types"

interface FormBuilderProps {
  title?: string
  data?: {
    submitLabel?: string
    description?: string
    isMultiStep?: boolean
    currentStep?: number
  }
  slots?: Record<string, BlockConfig | null>
  onSlotClick?: (slotId: string) => void
  isEditMode?: boolean
  renderSlot?: (slotId: string, block: BlockConfig, isEditMode: boolean) => ReactNode
}

export default function FormBuilder({
  title = "Form Builder",
  data = {},
  slots,
  onSlotClick,
  isEditMode = false,
  renderSlot,
}: FormBuilderProps) {
  const {
    submitLabel = "Submit",
    description = "Fill out this form to continue.",
    isMultiStep = false,
    currentStep = 0,
  } = data

  const [formData, setFormData] = useState<Record<string, unknown>>({})

  const slotEntries = Object.entries(slots ?? { "element-0": null as BlockConfig | null })
    .sort(([a], [b]) => {
      const aIndex = Number(a.split("-")[1] ?? 0)
      const bIndex = Number(b.split("-")[1] ?? 0)
      return aIndex - bIndex
    })

  const handleSlotClick = (slotId: string) => {
    if (!isEditMode || !onSlotClick) return
    onSlotClick(slotId)
  }

  const handleAddElement = () => {
    if (!isEditMode || !onSlotClick) return
    const nextIndex = slotEntries.length
    onSlotClick(`element-${nextIndex}`)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log("Form submitted:", formData)
  }

  return (
    <div className="h-full flex flex-col" style={{ containerType: "inline-size" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground truncate">{title}</h3>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>
        {isEditMode && (
          <span className="text-xs text-muted-foreground">
            {slotEntries.length} element{slotEntries.length === 1 ? "" : "s"}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="space-y-4 flex-1">
          {slotEntries.map(([slotId, slotBlock]) => (
            <div key={slotId} className={isEditMode ? "group" : undefined}>
              {slotBlock ? (
                <div className="relative">
                  {isEditMode && (
                    <div className="absolute -left-6 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                    </div>
                  )}
                  {renderSlot ? renderSlot(slotId, slotBlock, isEditMode) : null}
                </div>
              ) : (
                <div
                  className={`border border-dashed border-border/60 rounded-lg p-4 text-center ${
                    isEditMode ? "cursor-pointer hover:border-border/80 hover:bg-muted/20 transition-colors" : ""
                  }`}
                  onClick={() => handleSlotClick(slotId)}
                >
                  {isEditMode ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-lg text-muted-foreground/60">+</div>
                      <span className="text-xs text-muted-foreground">Click to add form element</span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">Empty form element</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {isEditMode ? (
          <div className="mt-4 pt-4 border-t border-border">
            <button
              type="button"
              onClick={handleAddElement}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add form element
            </button>
          </div>
        ) : (
          <div className="mt-6 pt-4 border-t border-border">
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {submitLabel}
            </button>
          </div>
        )}
      </form>

      <div className="mt-auto pt-2 text-[10px] text-muted-foreground/60">
        {isEditMode
          ? `Form builder mode${isMultiStep ? ` — Step ${currentStep + 1}` : ""}`
          : `${slotEntries.filter(([, block]) => block !== null).length} form elements`}
      </div>
    </div>
  )
}
