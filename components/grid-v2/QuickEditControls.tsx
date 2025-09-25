"use client"

import { useMemo, useState } from "react"
import type { BlockConfig, BlockType } from "@/lib/grid-v2/types"
import type { BlockDefinition } from "@/lib/block-registry"
import { getBlockDefinition, getBlockVariants } from "@/lib/block-registry"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { DataSourceBrowser } from "./DataSourceBrowser"

interface QuickEditControlsProps {
  block: BlockConfig
  definition?: BlockDefinition
  onVariantChange: (nextType: BlockType) => void
  onPropChange: (partialProps: Record<string, unknown>) => void
  onToggleSize: () => void
  onOpenFullEdit: () => void
  onDataSourceChange: (source: { type: string; table: string } | null) => void
  onExtend?: () => void
  onDelete?: () => void
}

const quickEditTimeRanges = [
  { label: "7d", value: "7d" },
  { label: "14d", value: "14d" },
  { label: "30d", value: "30d" },
]

const chartIcons: Record<BlockType, string> = {
  "chart.line": "📈",
  "chart.bar": "📊",
  "chart.area": "🌄",
  "chart.donut": "🍩",
  "chart.scatter": "🔢",
  "metric.kpi": "📈",
  "metric.chart": "📊",
  "metric.items": "📦",
  // fallback
  empty: "▫️",
  note: "📝",
  table: "🗂️",
  "table.orders": "🧾",
  "table.generic": "🗂️",
  "table.malleable": "📋",
  metric: "📈",
  "chart.area.interactive": "📈",
  calendar: "📅",
  "calendar.mini": "🗓️",
  "activity.timeline": "🕒",
  "messages.preview": "✉️",
  "messages.panel": "💬",
  "commands.quick": "⚡",
  "kanban.simple": "🗃️",
  "capacity.tracker": "📊",
  "notifications.panel": "🔔",
  "analytics.summary": "✨",
  "materials.inbound.week": "🚚",
  "materials.usage": "🏭",
  "materials.overdue": "⏰",
  "materials.supplier.leadtime": "🔗",
  tabs: "📑",
  "filter.items": "🔎",
}

const mockDataSources = [
  { table: "orders", label: "Orders" },
  { table: "items", label: "Items" },
  { table: "suppliers", label: "Suppliers" },
  { table: "production_runs", label: "Production Runs" },
]

const QuickEditIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M12 1v4" />
    <path d="M12 19v4" />
    <path d="M4.22 4.22 7.05 7.05" />
    <path d="M16.95 16.95l2.83 2.83" />
    <path d="M1 12h4" />
    <path d="M19 12h4" />
    <path d="M4.22 19.78 7.05 16.95" />
    <path d="M16.95 7.05l2.83-2.83" />
  </svg>
)

const DataSourceIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
    <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
  </svg>
)

const EditIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M11 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
    <path d="M18 2a2 2 0 0 1 2 2 2 2 0 0 1-.59 1.41l-7.83 7.83-3.58.75.75-3.58 7.83-7.83A2 2 0 0 1 18 2Z" />
  </svg>
)

const CollapseIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M4 9h16" />
    <path d="M4 15h16" />
    <path d="M10 3h4" />
    <path d="M10 21h4" />
  </svg>
)

const ExtendIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
)

const DeleteIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
)

export function QuickEditControls({
  block,
  definition,
  onVariantChange,
  onPropChange,
  onToggleSize,
  onOpenFullEdit,
  onDataSourceChange,
  onExtend,
  onDelete,
}: QuickEditControlsProps) {
  const [isQuickEditOpen, setQuickEditOpen] = useState(false)
  const [isDataSourceOpen, setDataSourceOpen] = useState(false)
  const [isDataBrowserOpen, setDataBrowserOpen] = useState(false)

  const variants = useMemo(() => {
    const base = definition?.variants ?? getBlockVariants(block.type)
    return base.map((variant) => ({
      type: variant,
      definition: getBlockDefinition(variant),
    }))
  }, [block.type, definition])

  const controls = definition?.controls ?? []
  const showDataSource = controls.includes("datasource")
  const currentSource = (block.props as any)?.source as { type: string; table: string } | undefined

  const handleVariantSelect = (variantType: BlockType) => {
    setQuickEditOpen(false)
    onVariantChange(variantType)
  }

  const handleTimeRange = (value: string) => {
    onPropChange({ timeRange: value })
  }

  const handleDensity = (value: string) => {
    onPropChange({ density: value })
  }

  const handleAddColumn = () => {
    const existing = Array.isArray((block.props as any)?.columns)
      ? ([...(block.props as any).columns] as unknown[])
      : []
    const nextIndex = existing.length + 1
    onPropChange({
      columns: [...existing, `Column ${nextIndex}`],
    })
  }

  const renderVariants = () => {
    if (variants.length === 0) return null
    return (
      <div className="space-y-2">
        <div className="text-xs font-medium text-muted-foreground">Variants</div>
        <div className="flex flex-wrap gap-2">
          {variants.map(({ type, definition }) => (
            <Button
              key={type}
              variant={type === block.type ? "default" : "outline"}
              size="sm"
              className="text-xs flex items-center gap-1"
              onClick={() => handleVariantSelect(type)}
            >
              <span>{chartIcons[type] ?? "🔁"}</span>
              <span>{definition?.label ?? type}</span>
            </Button>
          ))}
        </div>
      </div>
    )
  }

  const renderTimeRange = () => {
    if (!controls.includes("timeRange")) return null
    return (
      <div className="space-y-2">
        <div className="text-xs font-medium text-muted-foreground">Time Range</div>
        <div className="flex gap-2">
          {quickEditTimeRanges.map((option) => (
            <Button
              key={option.value}
              variant={(block.props as any)?.timeRange === option.value ? "default" : "outline"}
              size="sm"
              className="text-xs"
              onClick={() => handleTimeRange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    )
  }

  const renderDensity = () => {
    if (!controls.includes("density")) return null
    const currentDensity = (block.props as any)?.density ?? "comfortable"
    return (
      <div className="space-y-2">
        <div className="text-xs font-medium text-muted-foreground">Row Density</div>
        <div className="flex gap-2">
          {[
            { value: "comfortable", label: "Comfort" },
            { value: "compact", label: "Compact" },
          ].map((option) => (
            <Button
              key={option.value}
              variant={currentDensity === option.value ? "default" : "outline"}
              size="sm"
              className="text-xs"
              onClick={() => handleDensity(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    )
  }

  const renderColumns = () => {
    if (!controls.includes("columns")) return null
    return (
      <div className="space-y-2">
        <div className="text-xs font-medium text-muted-foreground">Columns</div>
        <Button variant="outline" size="sm" className="text-xs" onClick={handleAddColumn}>
          + Add Column
        </Button>
      </div>
    )
  }

  const hasQuickControls =
    variants.length > 0 || controls.includes("timeRange") || controls.includes("density") || controls.includes("columns")

  return (
    <>
      <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 hover:bg-slate-100 transition-all duration-150 ease-out hover:scale-105"
        onClick={onToggleSize}
        title="Toggle block height"
      >
        <CollapseIcon />
      </Button>

      {hasQuickControls && (
        <Popover open={isQuickEditOpen} onOpenChange={setQuickEditOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 hover:bg-blue-100 transition-all duration-150 ease-out hover:scale-105"
              title="Quick Edit"
            >
              <QuickEditIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 space-y-4" align="end">
            {renderVariants()}
            {renderTimeRange()}
            {renderDensity()}
            {renderColumns()}

            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-xs text-muted-foreground">Need more?</span>
              <Button
                variant="link"
                className="text-xs px-0"
                onClick={() => {
                  setQuickEditOpen(false)
                  onOpenFullEdit()
                }}
              >
                Open full editor
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}

      {showDataSource && (
        <Popover open={isDataSourceOpen} onOpenChange={setDataSourceOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 hover:bg-purple-100 transition-all duration-150 ease-out hover:scale-105"
              title="Select data source"
            >
              <DataSourceIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72" align="end">
            <div className="text-xs font-medium text-muted-foreground mb-2">Data Sources</div>
            <div className="grid gap-2">
              {mockDataSources.map((source) => (
                <Button
                  key={source.table}
                  variant={currentSource?.table === source.table ? "default" : "outline"}
                  size="sm"
                  className="justify-start text-xs"
                  onClick={() => {
                    onDataSourceChange({ type: "mock", table: source.table })
                    setDataSourceOpen(false)
                  }}
                >
                  {source.label}
                </Button>
              ))}
              <Button
                variant={(block.props as any)?.source ? "outline" : "secondary"}
                size="sm"
                className="justify-start text-xs"
                onClick={() => {
                  onDataSourceChange(null)
                  setDataSourceOpen(false)
                }}
              >
                Clear data source
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start text-xs"
                onClick={() => {
                  setDataSourceOpen(false)
                  setDataBrowserOpen(true)
                }}
              >
                Browse catalog…
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}

      <Button
        variant="ghost"
        size="icon"
        className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 hover:bg-green-100 transition-all duration-150 ease-out hover:scale-105"
        title="Open full editor"
        onClick={onOpenFullEdit}
      >
        <EditIcon />
      </Button>

      {onExtend && (
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 hover:bg-purple-100 transition-all duration-150 ease-out hover:scale-105"
          title="Extend Block"
          onClick={onExtend}
        >
          <ExtendIcon />
        </Button>
      )}

      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 hover:bg-red-100 transition-all duration-150 ease-out hover:scale-105"
          title="Delete Block"
          onClick={onDelete}
        >
          <DeleteIcon />
        </Button>
      )}
    </div>

      <DataSourceBrowser
        open={isDataBrowserOpen}
        onClose={() => setDataBrowserOpen(false)}
        currentSource={currentSource ?? null}
        onSelect={(source) => {
          onDataSourceChange(source)
          setDataBrowserOpen(false)
        }}
      />
    </>
  )
}
