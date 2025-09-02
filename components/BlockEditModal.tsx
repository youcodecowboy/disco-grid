"use client"

import { useState, useEffect } from "react"
import type { Block } from "@/app/page"
import { defaultPropsForType, defaultTitleForType } from "@/lib/mock"

// Import all block renderers
import TableOrders from "./blocks/TableOrders"
import TableGeneric from "./blocks/TableGeneric"
import MetricKPI from "./blocks/MetricKPI"
import ChartLine from "./blocks/ChartLine"
import ChartBar from "./blocks/ChartBar"
import ChartArea from "./blocks/ChartArea"
import ChartDonut from "./blocks/ChartDonut"
import ActivityTimeline from "./blocks/ActivityTimeline"
import MessagesPreview from "./blocks/MessagesPreview"
import CommandsQuick from "./blocks/CommandsQuick"
import KanbanSimple from "./blocks/KanbanSimple"
import CalendarMini from "./blocks/CalendarMini"

interface Props {
  open: boolean
  onClose: () => void
  block: Block
  onReplace: (next: Block) => void
  onAddExtension: (next: Block) => void
}

type BlockType =
  | "table.orders"
  | "table.generic"
  | "metric.kpi"
  | "chart.line"
  | "chart.bar"
  | "chart.area"
  | "chart.donut"
  | "activity.timeline"
  | "messages.preview"
  | "commands.quick"
  | "kanban.simple"
  | "calendar.mini"

interface ComponentItem {
  type: BlockType
  name: string
  category: string
  icon: string
}

const COMPONENTS: ComponentItem[] = [
  // Data
  { type: "table.orders", name: "Table — Orders", category: "Data", icon: "📋" },
  { type: "table.generic", name: "Table — Generic", category: "Data", icon: "📊" },

  // KPIs
  { type: "metric.kpi", name: "KPI Metric", category: "KPIs", icon: "📈" },
  { type: "chart.donut", name: "Donut Breakdown", category: "KPIs", icon: "🍩" },

  // Trends
  { type: "chart.line", name: "Line Chart", category: "Trends", icon: "📈" },
  { type: "chart.bar", name: "Bar Chart", category: "Trends", icon: "📊" },
  { type: "chart.area", name: "Area Chart", category: "Trends", icon: "🏔️" },

  // Ops & Comms
  { type: "activity.timeline", name: "Recent Activity", category: "Ops & Comms", icon: "⏰" },
  { type: "messages.preview", name: "Messages Preview", category: "Ops & Comms", icon: "💬" },
  { type: "commands.quick", name: "Quick Commands", category: "Ops & Comms", icon: "⚡" },

  // Boards & Time
  { type: "kanban.simple", name: "Kanban", category: "Boards & Time", icon: "📋" },
  { type: "calendar.mini", name: "Mini Calendar", category: "Boards & Time", icon: "📅" },
]

const CATEGORIES = ["Data", "KPIs", "Trends", "Ops & Comms", "Boards & Time"]

export default function BlockEditModal({ open, onClose, block, onReplace, onAddExtension }: Props) {
  const [activeTab, setActiveTab] = useState<"browse" | "ai">("browse")
  const [selectedType, setSelectedType] = useState<BlockType | null>(null)
  const [aiInput, setAiInput] = useState("")
  const [previewBlock, setPreviewBlock] = useState<Block | null>(null)

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

  // Update preview when selection changes
  useEffect(() => {
    if (selectedType) {
      setPreviewBlock({
        id: "preview",
        type: selectedType as any,
        title: defaultTitleForType(selectedType),
        props: defaultPropsForType(selectedType, block.id),
      })
    } else {
      setPreviewBlock(null)
    }
  }, [selectedType, block.id])

  const handleAiSubmit = () => {
    const input = aiInput.toLowerCase()
    let mappedType: BlockType | null = null

    // Keyword mapping
    if (input.includes("line")) mappedType = "chart.line"
    else if (input.includes("bar")) mappedType = "chart.bar"
    else if (input.includes("area")) mappedType = "chart.area"
    else if (input.includes("donut") || input.includes("pie")) mappedType = "chart.donut"
    else if (input.includes("table orders")) mappedType = "table.orders"
    else if (input.includes("table")) mappedType = "table.generic"
    else if (input.includes("metric") || input.includes("kpi")) mappedType = "metric.kpi"
    else if (input.includes("activity") || input.includes("timeline") || input.includes("events"))
      mappedType = "activity.timeline"
    else if (input.includes("message") || input.includes("inbox") || input.includes("email") || input.includes("dm"))
      mappedType = "messages.preview"
    else if (input.includes("command") || input.includes("quick actions") || input.includes("run"))
      mappedType = "commands.quick"
    else if (input.includes("kanban") || input.includes("board") || input.includes("todo")) mappedType = "kanban.simple"
    else if (input.includes("calendar")) mappedType = "calendar.mini"

    if (mappedType) {
      setSelectedType(mappedType)
      setActiveTab("browse")
    }
  }

  const renderBlockPreview = (block: Block) => {
    switch (block.type) {
      case "table.orders":
        return <TableOrders block={block} />
      case "table.generic":
        return <TableGeneric block={block} />
      case "metric.kpi":
        return <MetricKPI block={block} />
      case "chart.line":
        return <ChartLine block={block} />
      case "chart.bar":
        return <ChartBar block={block} />
      case "chart.area":
        return <ChartArea block={block} />
      case "chart.donut":
        return <ChartDonut block={block} />
      case "activity.timeline":
        return <ActivityTimeline block={block} />
      case "messages.preview":
        return <MessagesPreview block={block} />
      case "commands.quick":
        return <CommandsQuick block={block} />
      case "kanban.simple":
        return <KanbanSimple block={block} />
      case "calendar.mini":
        return <CalendarMini block={block} />
      default:
        return <div className="p-4 text-center text-muted-foreground">Select a component</div>
    }
  }

  const handleReplace = () => {
    if (previewBlock) {
      onReplace({
        ...previewBlock,
        id: block.id,
      })
      onClose()
    }
  }

  const handleAddExtension = () => {
    if (previewBlock) {
      onAddExtension({
        ...previewBlock,
        id: `${block.id}-ext-${Date.now()}`,
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
          <h2 className="text-lg font-semibold">Edit Block</h2>
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
            {/* Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("browse")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "browse"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Browse
              </button>
              <button
                onClick={() => setActiveTab("ai")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "ai"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                AI
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === "browse" ? (
                <div className="space-y-6">
                  {CATEGORIES.map((category) => (
                    <div key={category}>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">{category}</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {COMPONENTS.filter((comp) => comp.category === category).map((component) => (
                          <button
                            key={component.type}
                            onClick={() => setSelectedType(component.type)}
                            className={`p-3 rounded-lg border text-left transition-all hover:shadow-sm ${
                              selectedType === component.type
                                ? "border-blue-500 bg-blue-50 shadow-sm"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">{component.icon}</span>
                              <span className="text-sm font-medium">{component.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Describe what you want to create</label>
                    <input
                      type="text"
                      placeholder="e.g., line chart of active orders last 7 days"
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAiSubmit()
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoFocus
                    />
                  </div>
                  <button
                    onClick={handleAiSubmit}
                    disabled={!aiInput.trim()}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Generate Component
                  </button>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Keywords that work:</p>
                    <p>• "line", "bar", "area", "donut/pie" → charts</p>
                    <p>• "table orders", "table" → data tables</p>
                    <p>• "metric", "kpi" → key metrics</p>
                    <p>• "activity", "timeline" → recent events</p>
                    <p>• "message", "inbox" → communications</p>
                    <p>• "command", "quick actions" → action buttons</p>
                    <p>• "kanban", "board" → task management</p>
                    <p>• "calendar" → date/time view</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="w-1/2 flex flex-col">
            <div className="p-6 border-b">
              <h3 className="text-sm font-medium text-muted-foreground">Preview</h3>
            </div>
            <div className="flex-1 p-6">
              <div className="h-full border rounded-lg bg-white shadow-sm">
                {previewBlock ? (
                  <div className="h-full">
                    <div className="border-b p-3">
                      <h4 className="text-sm font-medium">{previewBlock.title}</h4>
                    </div>
                    <div className="h-[calc(100%-48px)]">{renderBlockPreview(previewBlock)}</div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    Select a component to preview
                  </div>
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
