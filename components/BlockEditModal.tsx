"use client"

import { useState, useEffect, useMemo } from "react"
import type { Block } from "@/app/page"
import { defaultPropsForType, defaultTitleForType, mockSeries, mockSlices, mockKPI } from "@/lib/mock"
import { generateId } from "@/lib/utils"
import BlockRenderer from "@/components/BlockRenderer"

interface Props {
  open: boolean
  onClose: () => void
  block: Block | null
  onReplace: (next: Block) => void
  onAddExtension: (next: Block) => void
}

type BlockType =
  | "table.orders"
  | "table.malleable"
  | "calendar"
  | "chart.area.interactive"
  | "activity.timeline"
  | "metric"
  | "metric.kpi"
  | "note"
  | "capacity.tracker"
  | "notifications.panel"
  | "messages.panel"
  | "chart.scatter"
  | "analytics.summary"
  | "metric.chart"
  | "metric.items"
  | "chart.line"
  | "chart.bar"
  | "chart.area"
  | "chart.donut"
  | "calendar.mini"
  | "messages.preview"
  | "commands.quick"
  | "kanban.simple"

interface ComponentItem {
  type: BlockType
  name: string
  category: string
  icon: string
}

const COMPONENTS: ComponentItem[] = [
  // Data & Tables
  { type: "table.malleable", name: "Table", category: "Data & Tables", icon: "📊" },
  { type: "table.orders", name: "Orders Table", category: "Data & Tables", icon: "📋" },

  // Charts (Core types)
  { type: "chart.area", name: "Area Chart", category: "Analytics & Charts", icon: "📈" },
  { type: "chart.line", name: "Line Chart", category: "Analytics & Charts", icon: "📈" },
  { type: "chart.bar", name: "Bar Chart", category: "Analytics & Charts", icon: "📊" },
  { type: "chart.donut", name: "Donut Chart", category: "Analytics & Charts", icon: "🍩" },
  { type: "chart.scatter", name: "Scatter Plot", category: "Analytics & Charts", icon: "🟣" },

  // Metrics & KPIs
  { type: "metric.kpi", name: "KPI Card", category: "Metrics & KPIs", icon: "🎯" },

  // Communication & Activity
  { type: "activity.timeline", name: "Activity Timeline", category: "Communication & Activity", icon: "⏰" },
  { type: "messages.panel", name: "Messages Panel", category: "Communication & Activity", icon: "💬" },
  { type: "notifications.panel", name: "Notifications", category: "Communication & Activity", icon: "🔔" },

  // Planning & Time
  { type: "calendar", name: "Calendar", category: "Planning & Time", icon: "📅" },

  // Content
  { type: "note", name: "Note", category: "Content", icon: "📝" },
]

const CATEGORIES = ["Analytics & Charts", "Metrics & KPIs", "Data & Tables", "Communication & Activity", "Planning & Time", "Content"]

// Data catalog for step 2
const DATA_CATALOG = {
  Materials: [
    { key: "lead_time", label: "Lead Time (days)", kind: "timeseries" },
    { key: "inbound_shipments", label: "Inbound Shipments", kind: "timeseries" },
    { key: "category_share", label: "Category Share", kind: "distribution" },
  ],
  Suppliers: [
    { key: "on_time_rate", label: "On-time Rate (%)", kind: "timeseries" },
    { key: "avg_lead_time", label: "Avg Lead Time (days)", kind: "timeseries" },
  ],
  Operations: [
    { key: "efficiency", label: "Efficiency (%)", kind: "timeseries" },
    { key: "throughput", label: "Throughput", kind: "timeseries" },
  ],
} as const

type CatalogCategory = keyof typeof DATA_CATALOG
type CatalogMetric = typeof DATA_CATALOG[CatalogCategory][number]

export default function BlockEditModal({ open, onClose, block, onReplace, onAddExtension }: Props) {
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedType, setSelectedType] = useState<BlockType | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<CatalogCategory>("Materials")
  const [selectedMetricKey, setSelectedMetricKey] = useState<string>(DATA_CATALOG.Materials[0].key)
  const [timeRange, setTimeRange] = useState<"7d" | "14d" | "30d">("30d")
  const [dataSource] = useState<"mock">("mock")
  const [previewBlock, setPreviewBlock] = useState<Block | null>(null)
  const [previewSize, setPreviewSize] = useState<"s" | "m" | "l">("m")

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (open) {
      document.addEventListener("keydown", handleEsc)
      return () => document.removeEventListener("keydown", handleEsc)
    }
  }, [open, onClose])

  // Build props from type + data selection
  const buildProps = (type: BlockType, seed: string) => {
    const days = timeRange === "7d" ? 7 : timeRange === "14d" ? 14 : 30
    const metric = Object.values(DATA_CATALOG)
      .flat()
      .find(m => m.key === selectedMetricKey)
    const metricLabel = metric?.label || "Metric"

    switch (type) {
      case "chart.area":
      case "chart.bar":
        return { series: mockSeries(`${seed}:${selectedMetricKey}`, days, 1).map(s => ({ ...s, name: metricLabel })) }
      case "chart.line": {
        const s = mockSeries(`${seed}:${selectedMetricKey}`, days, 1)[0]
        return { data: s.points.map(p => ({ name: p.x.slice(5), value: p.y })) }
      }
      case "chart.donut":
        return { slices: mockSlices(`${seed}:${selectedMetricKey}`, ["A", "B", "C", "D"]) }
      case "chart.scatter":
        return defaultPropsForType("chart.scatter", seed)
      case "metric.kpi":
        return mockKPI(`${seed}:${selectedMetricKey}`, metricLabel)
      case "table.malleable":
        return defaultPropsForType("table.malleable", seed)
      case "table.orders":
        return defaultPropsForType("table.orders", seed)
      case "calendar":
        return defaultPropsForType("calendar", seed)
      case "activity.timeline":
        return defaultPropsForType("activity.timeline", seed)
      case "note":
        return defaultPropsForType("note", seed)
      default:
        return {}
    }
  }

  const computedTitle = useMemo(() => {
    if (!selectedType) return ""
    const base = defaultTitleForType(selectedType)
    const metric = Object.values(DATA_CATALOG).flat().find(m => m.key === selectedMetricKey)?.label
    return metric ? `${base} • ${metric}` : base
  }, [selectedType, selectedMetricKey])

  // Update preview when selections change
  useEffect(() => {
    if (selectedType && block) {
      setPreviewBlock({
        id: "preview",
        type: selectedType as any,
        title: computedTitle,
        props: buildProps(selectedType, block.id),
      })
    } else {
      setPreviewBlock(null)
    }
  }, [selectedType, selectedMetricKey, timeRange, dataSource, block?.id, computedTitle])

  // Placeholder for future AI
  const handleAiSubmit = () => {
    /* reserved for future AI */
  }

  const renderBlockPreview = (blk: Block | null) => {
    if (!blk) return <div className="p-4 text-center text-muted-foreground">No block selected</div>
    return <div className="h-full p-2"><BlockRenderer block={blk} /></div>
  }

  // Data inspector for step 2 to improve preview clarity
  const renderDataPreview = () => {
    if (!previewBlock) return null
    const type = previewBlock.type as BlockType
    const p: any = previewBlock.props || {}

    const sectionTitle = (title: string) => (
      <div className="text-xs font-medium text-muted-foreground mt-3 mb-1">{title}</div>
    )

    // Lightweight table renderer
    const Table = ({ columns, rows }: { columns: string[]; rows: (string | number)[][] }) => (
      <div className="border rounded overflow-hidden">
        <div className="grid" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0,1fr))` }}>
          {columns.map((c, i) => (
            <div key={i} className="px-2 py-1 text-[11px] font-medium bg-gray-50 border-b border-r last:border-r-0">
              {c}
            </div>
          ))}
          {rows.slice(0, 6).map((r, ri) =>
            r.map((cell, ci) => (
              <div key={`${ri}-${ci}`} className="px-2 py-1 text-[11px] border-b border-r last:border-r-0 truncate">
                {typeof cell === 'number' ? cell.toLocaleString() : String(cell)}
              </div>
            ))
          )}
        </div>
      </div>
    )

    switch (type) {
      case "chart.area":
      case "chart.bar": {
        const s = Array.isArray(p.series) && p.series[0]
        if (!s) return null
        const vals = s.points.map((pt: any) => pt.y)
        const avg = Math.round(vals.reduce((a: number, b: number) => a + b, 0) / Math.max(1, vals.length))
        const min = Math.min(...vals), max = Math.max(...vals)
        return (
          <div>
            {sectionTitle("Sample Data")}
            <Table columns={["Date", s.name || "Value"]} rows={s.points.slice(0, 6).map((pt: any) => [pt.x, pt.y])} />
            <div className="flex gap-2 mt-2 text-[11px] text-gray-600">
              <span className="px-2 py-0.5 bg-gray-100 rounded">Avg: {avg}</span>
              <span className="px-2 py-0.5 bg-gray-100 rounded">Min: {min}</span>
              <span className="px-2 py-0.5 bg-gray-100 rounded">Max: {max}</span>
            </div>
          </div>
        )
      }
      case "chart.line": {
        const d = Array.isArray(p.data) ? p.data : []
        return (
          <div>
            {sectionTitle("Sample Data")}
            <Table columns={["Label", "Value"]} rows={d.slice(0, 8).map((pt: any) => [pt.name, pt.value])} />
          </div>
        )
      }
      case "chart.donut": {
        const s = Array.isArray(p.slices) ? p.slices : []
        const total = s.reduce((a: number, b: any) => a + b.value, 0)
        return (
          <div>
            {sectionTitle("Distribution")}
            <Table columns={["Label", "Value", "%"]} rows={s.slice(0, 6).map((x: any) => [x.label, x.value, `${Math.round((x.value / Math.max(1,total)) * 100)}%`])} />
          </div>
        )
      }
      case "chart.scatter": {
        const pts = Array.isArray(p.points) ? p.points : []
        return (
          <div>
            {sectionTitle("Points")}
            <Table columns={["x", "y"]} rows={pts.slice(0, 8).map((pt: any) => [pt.x, pt.y])} />
          </div>
        )
      }
      case "metric.kpi": {
        return (
          <div className="text-[11px] text-gray-700">
            {sectionTitle("KPI")}
            <div className="flex gap-2">
              <span className="px-2 py-0.5 bg-gray-100 rounded">Value: {p.value}</span>
              <span className="px-2 py-0.5 bg-gray-100 rounded">Delta: {p.delta}</span>
            </div>
          </div>
        )
      }
      case "table.malleable": {
        const cols = (p.columns || []).map((c: any) => c.name || c.id)
        const rows = (p.data || []).slice(0, 5).map((row: any) => cols.map((name: any, i: number) => row[(p.columns[i] || {}).id]))
        return (
          <div>
            {sectionTitle("Rows (sample)")}
            <Table columns={cols.slice(0, 5)} rows={rows.map(r => r.slice(0, 5))} />
          </div>
        )
      }
      default:
        return null
    }
  }

  const handleReplace = () => {
    if (previewBlock && block) {
      onReplace({
        ...previewBlock,
        id: block.id,
      })
      onClose()
    }
  }

  const handleAddExtension = () => {
    if (previewBlock && block) {
      onAddExtension({
        ...previewBlock,
        id: generateId(`${block.id}-ext`),
      })
      onClose()
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl border shadow-lg max-w-5xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">Component Library</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close modal"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 min-h-0">
          {/* Left Panel */}
          <div className="w-1/2 border-r flex flex-col">
            {/* Stepper */}
            <div className="flex items-center gap-2 p-4 border-b text-xs">
              <div className={`px-2 py-1 rounded ${step === 1 ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>1. Type</div>
              <div className="text-gray-400">→</div>
              <div className={`px-2 py-1 rounded ${step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>2. Data</div>
            </div>

            {/* Step Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {step === 1 && (
                <div className="space-y-6">
                  {CATEGORIES.map((category) => (
                    <div key={category}>
                      <h3 className="text-xs font-medium text-muted-foreground mb-2">{category}</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {COMPONENTS.filter((comp) => comp.category === category).map((component) => (
                          <button
                            key={component.type}
                            onClick={() => {
                              setSelectedType(component.type)
                              setStep(2)
                            }}
                            className={`p-3 rounded-lg border text-left transition-all hover:shadow-sm ${
                              selectedType === component.type ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{component.icon}</span>
                              <span className="text-sm font-medium">{component.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {/* Category */}
                    <div>
                      <label className="block text-xs font-medium mb-1">Category</label>
                      <select
                        className="w-full h-8 text-sm border rounded px-2"
                        value={selectedCategory}
                        onChange={(e) => {
                          const cat = e.target.value as CatalogCategory
                          setSelectedCategory(cat)
                          setSelectedMetricKey(DATA_CATALOG[cat][0].key)
                        }}
                      >
                        {Object.keys(DATA_CATALOG).map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    {/* Metric */}
                    <div>
                      <label className="block text-xs font-medium mb-1">Metric</label>
                      <select
                        className="w-full h-8 text-sm border rounded px-2"
                        value={selectedMetricKey}
                        onChange={(e) => setSelectedMetricKey(e.target.value)}
                      >
                        {DATA_CATALOG[selectedCategory].map((m) => (
                          <option key={m.key} value={m.key}>{m.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Time Range */}
                    <div>
                      <label className="block text-xs font-medium mb-1">Time Range</label>
                      <select
                        className="w-full h-8 text-sm border rounded px-2"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value as any)}
                      >
                        <option value="7d">Last 7 days</option>
                        <option value="14d">Last 14 days</option>
                        <option value="30d">Last 30 days</option>
                      </select>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="text-xs text-muted-foreground">
                    Data source: Mock. The component will render with seeded mock data for reproducibility.
                  </div>

                  {/* Back to Type */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      className="text-xs text-blue-600 hover:underline"
                      onClick={() => setStep(1)}
                    >
                      ← Change type
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="w-1/2 flex flex-col">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Preview</h3>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Size</span>
                  <div className="inline-flex rounded border overflow-hidden">
                    {(["s","m","l"] as const).map(sz => (
                      <button key={sz} onClick={() => setPreviewSize(sz)} className={`px-2 py-1 ${previewSize===sz? 'bg-blue-600 text-white' : 'bg-white'} border-r last:border-r-0`}>{sz.toUpperCase()}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 p-6 space-y-4 overflow-auto">
              <div className="border rounded-lg bg-white shadow-sm">
                {previewBlock ? (
                  <div className="h-full">
                    <div className="border-b p-3">
                      <h4 className="text-sm font-medium">{previewBlock.title}</h4>
                    </div>
                    <div className="p-2" style={{ height: previewSize==='s' ? 160 : previewSize==='m' ? 240 : 320 }}>
                      {renderBlockPreview(previewBlock)}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground p-10">
                    Select a component to preview
                  </div>
                )}
              </div>
              {/* Data inspector */}
              <div className="border rounded-lg bg-white p-3">
                <div className="text-sm font-medium mb-2">Data Preview</div>
                {renderDataPreview() || (
                  <div className="text-xs text-muted-foreground">No data to display for this component.</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleAddExtension}
              disabled={!previewBlock}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add as Extension
            </button>
            <button
              onClick={handleReplace}
              disabled={!previewBlock}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Replace Block
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
