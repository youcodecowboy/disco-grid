"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import BlockEditModal from "@/components/BlockEditModal"
import TableOrders from "@/components/blocks/TableOrders"
import TableGeneric from "@/components/blocks/TableGeneric"
import MetricKPI from "@/components/blocks/MetricKPI"
import ChartLine from "@/components/blocks/ChartLine"
import ChartBar from "@/components/blocks/ChartBar"
import ChartArea from "@/components/blocks/ChartArea"
import ChartDonut from "@/components/blocks/ChartDonut"
import ActivityTimeline from "@/components/blocks/ActivityTimeline"
import MessagesPreview from "@/components/blocks/MessagesPreview"
import CommandsQuick from "@/components/blocks/CommandsQuick"
import KanbanSimple from "@/components/blocks/KanbanSimple"
import CalendarMini from "@/components/blocks/CalendarMini"

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className || "h-5 w-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
)

const BarChart3Icon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M3 3v18h18" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </svg>
)

const UsersIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const ShoppingCartIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
)

const VaultIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
)

const Grid3X3Icon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <path d="M9 3v18" />
    <path d="M15 3v18" />
    <path d="M3 9h18" />
    <path d="M3 15h18" />
  </svg>
)

const SettingsIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m15.5-6.5L19 7l-1.5 1.5M5 17l1.5-1.5L5 14m14 3l-1.5-1.5L19 17M5 7l1.5 1.5L5 9" />
  </svg>
)

const PlusIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
)

const BotIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </svg>
)

const EditIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
  </svg>
)

const ExpandIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M15 3h6v6" />
    <path d="M9 21H3v-6" />
    <path d="M21 3l-7 7" />
    <path d="M3 21l7-7" />
  </svg>
)

const Trash2Icon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2 2v-7" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
)

const Button = ({
  variant = "default",
  size = "default",
  className = "",
  onClick,
  children,
  ...props
}: {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "icon"
  className?: string
  onClick?: () => void
  children: React.ReactNode
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  }

  const sizeClasses = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3",
    icon: "h-10 w-10",
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

const Avatar = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full ${className}`}>{children}</div>
)

const AvatarFallback = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">{children}</div>
)

type GridPos = {
  x: number
  y: number
  w: number
  h: number
  i: string
}

type BlockType =
  | "empty"
  | "table"
  | "note"
  | "metric"
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

type Block = {
  id: string
  type: BlockType
  title?: string
  props?: Record<string, any>
  extensions?: Block[]
}

type DashboardState = {
  mode: "edit" | "save"
  layout: GridPos[]
  blocks: Record<string, Block>
}

const STORAGE_KEY = "groovy:dash:v1"

const PlanningIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const CuttingIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" />
    <line x1="14.47" y1="14.48" x2="20" y2="20" />
    <line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
)

const SewingIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M12 2L2 7l10 5 10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
)

const FinishingIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M9 11H5a2 2 0 0 0-2 2v3c0 1.1.9 2 2 2h4m6-6h4a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-4m-6 0a2 2 0 0 0-2-2H5m14 0a2 2 0 0 1 2-2h-4" />
    <path d="M9 7h6l4 4H5l4-4z" />
  </svg>
)

const PackingIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="M3.3 7l8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
)

const BellIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

const NotificationIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

const initialState: DashboardState = {
  mode: "edit",
  layout: [
    { x: 0, y: 0, w: 12, h: 4, i: "production-metrics" }, // Full-width production metrics
    { x: 0, y: 4, w: 6, h: 8, i: "production-table" }, // Production items table
    { x: 6, y: 4, w: 6, h: 6, i: "quick-notes" }, // Quick notes
    { x: 6, y: 10, w: 6, h: 8, i: "new-block" }, // New block
    { x: 0, y: 12, w: 6, h: 4, i: "efficiency-metric" }, // Efficiency metric
    { x: 0, y: 16, w: 6, h: 8, i: "production-chart" }, // Production chart (bigger)
    { x: 6, y: 18, w: 6, h: 6, i: "recent-activity" }, // Recent activity (smaller space)
  ],
  blocks: {
    "production-metrics": {
      id: "production-metrics",
      type: "metric",
      title: "Production Pipeline",
      props: {
        stages: [
          { name: "Planning", count: 24, icon: "planning" },
          { name: "Cutting", count: 18, icon: "cutting" },
          { name: "Sewing", count: 32, icon: "sewing" },
          { name: "Finishing", count: 15, icon: "finishing" },
          { name: "Packing", count: 8, icon: "packing" },
        ],
      },
    },
    "production-table": {
      id: "production-table",
      type: "table",
      title: "Production Items",
    },
    "quick-notes": {
      id: "quick-notes",
      type: "note",
      title: "Quick Notes",
      props: {
        body: `Manufacturing Dashboard ✨
• Track production stages
• Monitor item progress
• Manage workflow efficiency
• Real-time status updates`,
      },
    },
    "new-block": {
      id: "new-block",
      type: "empty",
      title: "New Block",
    },
    "efficiency-metric": {
      id: "efficiency-metric",
      type: "metric",
      title: "Production Efficiency",
      props: {
        value: "87.3%",
        delta: "+2.1% vs last week",
      },
    },
    "production-chart": {
      id: "production-chart",
      type: "chart.line",
      title: "Production Trends",
      props: {
        data: [
          { name: "Mon", value: 145 },
          { name: "Tue", value: 162 },
          { name: "Wed", value: 138 },
          { name: "Thu", value: 175 },
          { name: "Fri", value: 189 },
          { name: "Sat", value: 156 },
          { name: "Sun", value: 142 },
        ],
        color: "#3b82f6",
      },
    },
    "recent-activity": {
      id: "recent-activity",
      type: "activity.timeline",
      title: "Recent Activity",
      props: {
        activities: [
          { id: 1, type: "production", message: "Batch #2847 moved to Sewing", time: "2 min ago", status: "info" },
          {
            id: 2,
            type: "quality",
            message: "Quality check completed for Batch #2845",
            time: "15 min ago",
            status: "success",
          },
          { id: 3, type: "delay", message: "Cutting delayed for Batch #2849", time: "1 hour ago", status: "warning" },
          {
            id: 4,
            type: "completion",
            message: "Batch #2843 shipped to customer",
            time: "2 hours ago",
            status: "success",
          },
          {
            id: 5,
            type: "maintenance",
            message: "Sewing machine #3 maintenance scheduled",
            time: "3 hours ago",
            status: "info",
          },
        ],
      },
    },
  },
}

export default function GroovyGrid() {
  const [state, setState] = useState<DashboardState>(initialState)
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [aiInput, setAiInput] = useState("")
  const [activeAiBlock, setActiveAiBlock] = useState<string | null>(null)
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null)
  const [pageTitle, setPageTitle] = useState("Manufacturing Dashboard")
  const [pageSubtext, setPageSubtext] = useState("Track production stages and workflow efficiency")
  const [pageIcon, setPageIcon] = useState("📊")
  const [editingTitle, setEditingTitle] = useState(false)
  const [editingSubtext, setEditingSubtext] = useState(false)
  const [editingIcon, setEditingIcon] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingBlock, setEditingBlock] = useState<Block | null>(null)
  const [resizing, setResizing] = useState<{
    blockId: string
    direction: "se" | "e" | "s"
    startX: number
    startY: number
    startW: number
    startH: number
  } | null>(null)
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [noteContent, setNoteContent] = useState<Record<string, string>>({})
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    localStorage.removeItem(STORAGE_KEY)
    setState(initialState)
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const toggleMode = () => {
    setState((prev) => ({ ...prev, mode: prev.mode === "edit" ? "save" : "edit" }))
  }

  const addBlock = () => {
    const maxY = Math.max(...state.layout.map((item) => item.y + item.h), 0)
    const newId = `b${Date.now()}`

    setState((prev) => ({
      ...prev,
      layout: [...prev.layout, { x: 0, y: maxY, w: 6, h: 8, i: newId }],
      blocks: {
        ...prev.blocks,
        [newId]: {
          id: newId,
          type: "empty",
          title: "New Block",
        },
      },
    }))

    setActiveAiBlock(newId)
    setAiInput("")
  }

  const deleteBlock = (blockId: string) => {
    setState((prev) => ({
      ...prev,
      layout: prev.layout.filter((item) => item.i !== blockId),
      blocks: Object.fromEntries(Object.entries(prev.blocks).filter(([id]) => id !== blockId)),
    }))
  }

  const extendBlock = (blockId: string) => {
    setState((prev) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        [blockId]: {
          ...prev.blocks[blockId],
          extensions: [
            ...(prev.blocks[blockId].extensions || []),
            {
              id: `${blockId}-ext-${Date.now()}`,
              type: "note",
              title: "Extension",
              props: { body: "Extension placeholder" },
            },
          ],
        },
      },
    }))
  }

  const handleAiSubmit = (blockId: string) => {
    const input = aiInput.toLowerCase()
    let newType: BlockType = "empty"

    if (input.includes("table")) newType = "table"
    else if (input.includes("note")) newType = "note"
    else if (input.includes("metric")) newType = "metric"

    setState((prev) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        [blockId]: {
          ...prev.blocks[blockId],
          type: newType,
        },
      },
    }))

    setAiInput("")
    setActiveAiBlock(null)
  }

  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    if (state.mode !== "edit") return
    setDraggedBlock(blockId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (!draggedBlock || !gridRef.current) return

    const rect = gridRef.current.getBoundingClientRect()
    const x = Math.floor((e.clientX - rect.left) / 100)
    const y = Math.floor((e.clientY - rect.top) / 40)

    setState((prev) => ({
      ...prev,
      layout: prev.layout.map((item) =>
        item.i === draggedBlock ? { ...item, x: Math.max(0, Math.min(x, 8)), y: Math.max(0, y) } : item,
      ),
    }))

    setDraggedBlock(null)
  }

  const handleOpenEditModal = (block: Block) => {
    setEditingBlock(block)
    setEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setEditModalOpen(false)
    setEditingBlock(null)
  }

  const handleReplaceBlock = (newBlock: Block) => {
    setState((prev) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        [newBlock.id]: newBlock,
      },
    }))
  }

  const handleAddExtension = (extensionBlock: Block) => {
    if (!editingBlock) return

    setState((prev) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        [editingBlock.id]: {
          ...prev.blocks[editingBlock.id],
          extensions: [...(prev.blocks[editingBlock.id].extensions || []), extensionBlock],
        },
      },
    }))
  }

  const handleNoteEdit = (blockId: string, content: string) => {
    setNoteContent((prev) => ({ ...prev, [blockId]: content }))
    const updatedBlocks = {
      ...state.blocks,
      [blockId]: {
        ...state.blocks[blockId],
        props: {
          ...state.blocks[blockId].props,
          body: content,
        },
      },
    }
    const newState = { ...state, blocks: updatedBlocks }
    setState(newState)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))
  }

  const handleNoteEditStart = (blockId: string) => {
    setEditingNote(blockId)
    setNoteContent((prev) => ({
      ...prev,
      [blockId]: state.blocks[blockId]?.props?.body || "",
    }))
  }

  const handleNoteEditEnd = (blockId: string) => {
    setEditingNote(null)
    const content = noteContent[blockId] || ""
    handleNoteEdit(blockId, content)
  }

  const renderBlockContent = (block: Block) => {
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
      case "table":
        // Enhanced table for production items
        if (block.id === "production-table") {
          return (
            <div className="space-y-2">
              <div className="grid grid-cols-4 gap-2 text-sm font-medium text-muted-foreground border-b pb-2">
                <div>Item ID</div>
                <div>Product</div>
                <div>Stage</div>
                <div>Progress</div>
              </div>
              {[
                ["#P2847", "Cotton T-Shirt", "Sewing", "65%"],
                ["#P2848", "Denim Jacket", "Cutting", "30%"],
                ["#P2849", "Polo Shirt", "Finishing", "90%"],
                ["#P2850", "Hoodie", "Planning", "15%"],
                ["#P2851", "Tank Top", "Packing", "95%"],
                ["#P2852", "Cardigan", "Sewing", "45%"],
              ].map(([id, product, stage, progress], i) => (
                <div key={i} className="grid grid-cols-4 gap-2 text-sm">
                  <div className="font-mono">{id}</div>
                  <div>{product}</div>
                  <div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        stage === "Planning"
                          ? "bg-gray-100 text-gray-800"
                          : stage === "Cutting"
                            ? "bg-orange-100 text-orange-800"
                            : stage === "Sewing"
                              ? "bg-blue-100 text-blue-800"
                              : stage === "Finishing"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-green-100 text-green-800"
                      }`}
                    >
                      {stage}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: progress }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{progress}</span>
                  </div>
                </div>
              ))}
            </div>
          )
        }
        // Default table for other blocks
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-2 text-sm font-medium text-muted-foreground border-b pb-2">
              <div>Order ID</div>
              <div>Customer</div>
              <div>Amount</div>
              <div>Status</div>
            </div>
            {[
              ["#1234", "John Doe", "$299.00", "Completed"],
              ["#1235", "Jane Smith", "$149.50", "Processing"],
              ["#1236", "Bob Johnson", "$89.99", "Shipped"],
              ["#1237", "Alice Brown", "$199.00", "Pending"],
            ].map(([id, customer, amount, status], i) => (
              <div key={i} className="grid grid-cols-4 gap-2 text-sm">
                <div className="font-mono">{id}</div>
                <div>{customer}</div>
                <div>{amount}</div>
                <div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : status === "Processing"
                          ? "bg-yellow-100 text-yellow-800"
                          : status === "Shipped"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )

      case "note":
        if (block.props?.activities) {
          return (
            <div className="space-y-2">
              {block.props.activities.map((activity: any, i: number) => (
                <div key={i} className="flex items-start gap-3 p-2 bg-muted/30 rounded border-l-2 border-l-blue-500">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-foreground">{activity.text}</div>
                    <div className="text-xs text-muted-foreground">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )
        }

        const isEditing = editingNote === block.id
        const currentContent = isEditing ? noteContent[block.id] || "" : block.props?.body || ""

        return (
          <div className="h-full flex flex-col">
            {isEditing ? (
              <div className="flex-1 flex flex-col">
                <textarea
                  value={currentContent}
                  onChange={(e) => setNoteContent((prev) => ({ ...prev, [block.id]: e.target.value }))}
                  onBlur={() => handleNoteEditEnd(block.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setEditingNote(null)
                    }
                  }}
                  className="flex-1 w-full p-3 text-sm bg-transparent border-none outline-none resize-none font-mono leading-relaxed"
                  placeholder="Write your notes here..."
                  autoFocus
                />
                <div className="text-xs text-muted-foreground p-2 border-t">
                  Press Escape to cancel, click outside to save
                </div>
              </div>
            ) : (
              <div
                className="flex-1 p-3 text-sm whitespace-pre-wrap font-mono leading-relaxed cursor-text hover:bg-muted/20 transition-colors"
                onClick={() => handleNoteEditStart(block.id)}
              >
                {currentContent || "Click to add notes..."}
              </div>
            )}
          </div>
        )

      case "metric":
        if (block.props?.stages) {
          return (
            <div className="flex items-center justify-between h-full px-6">
              {block.props.stages.map((stage: any, i: number) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="text-xs text-muted-foreground font-medium mb-2">{stage.name}</div>
                  <div className="flex items-center gap-2">
                    <div className="text-muted-foreground">{renderStageIcon(stage.icon)}</div>
                    <div className="text-2xl font-bold text-foreground">{stage.count}</div>
                  </div>
                </div>
              ))}
            </div>
          )
        }
        // Default metric rendering
        return (
          <div className="p-4 flex flex-col justify-center h-full">
            <div className="text-3xl font-bold text-foreground mb-2 leading-tight">{block.props?.value || "0"}</div>
            <div className="text-xs text-muted-foreground leading-normal">{block.props?.delta || "No change"}</div>
          </div>
        )

      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 8V4H8" />
                <rect width="16" height="12" x="4" y="8" rx="2" />
                <path d="M2 14h2" />
                <path d="M20 14h2" />
                <path d="M15 13v2" />
                <path d="M9 13v2" />
              </svg>
            </div>

            <h2 className="text-xl font-semibold mb-2">Hi, I'm Disco ✨</h2>
            <p className="text-xs text-muted-foreground mb-4 max-w-sm leading-relaxed">
              I'm your AI assistant for building dashboard components. Tell me what you'd like to create and I'll build
              it for you.
            </p>

            <div className="w-full max-w-md space-y-3">
              <div className="relative">
                <Input
                  placeholder="Describe what you want to build..."
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAiSubmit(block.id)
                    }
                  }}
                  className="h-10 text-sm pl-4 pr-12 rounded-lg border-2 focus:border-purple-500 transition-colors"
                  autoFocus
                />
                <Button
                  size="icon"
                  className="absolute right-2 top-1 h-8 w-8 bg-purple-500 hover:bg-purple-600 rounded-md"
                  onClick={() => handleAiSubmit(block.id)}
                  disabled={!aiInput.trim()}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </Button>
              </div>

              <div className="flex flex-wrap gap-1 justify-center">
                {["Sales table", "Revenue chart", "User metrics", "Project notes"].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setAiInput(suggestion.toLowerCase())
                      handleAiSubmit(block.id)
                    }}
                    className="px-3 py-1 text-xs bg-muted hover:bg-muted/80 rounded-md transition-colors font-medium"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )
    }
  }

  const maxY = Math.max(...state.layout.map((item) => item.y + item.h), 0)

  const handleResizeStart = (e: React.MouseEvent, blockId: string, direction: "se" | "e" | "s") => {
    e.preventDefault()
    e.stopPropagation()

    const layoutItem = state.layout.find((item) => item.i === blockId)
    if (!layoutItem) return

    setResizing({
      blockId,
      direction,
      startX: e.clientX,
      startY: e.clientY,
      startW: layoutItem.w,
      startH: layoutItem.h,
    })
  }

  const handleResizeMove = (e: MouseEvent) => {
    if (!resizing) return

    const deltaX = e.clientX - resizing.startX
    const deltaY = e.clientY - resizing.startY

    // Convert pixel movement to grid units (approximately 100px per width unit, 40px per height unit)
    const deltaW = Math.round(deltaX / 100)
    const deltaH = Math.round(deltaY / 40)

    setState((prev) => ({
      ...prev,
      layout: prev.layout.map((item) => {
        if (item.i !== resizing.blockId) return item

        let newW = item.w
        let newH = item.h

        if (resizing.direction === "se" || resizing.direction === "e") {
          newW = Math.max(2, Math.min(12 - item.x, resizing.startW + deltaW))
        }
        if (resizing.direction === "se" || resizing.direction === "s") {
          newH = Math.max(2, Math.min(20, resizing.startH + deltaH))
        }

        return { ...item, w: newW, h: newH }
      }),
    }))
  }

  const handleResizeEnd = () => {
    setResizing(null)
  }

  useEffect(() => {
    if (resizing) {
      document.addEventListener("mousemove", handleResizeMove)
      document.addEventListener("mouseup", handleResizeEnd)
      return () => {
        document.removeEventListener("mousemove", handleResizeMove)
        document.removeEventListener("mouseup", handleResizeEnd)
      }
    }
  }, [resizing])

  const renderStageIcon = (iconType: string) => {
    switch (iconType) {
      case "planning":
        return <PlanningIcon />
      case "cutting":
        return <CuttingIcon />
      case "sewing":
        return <SewingIcon />
      case "finishing":
        return <FinishingIcon />
      case "packing":
        return <PackingIcon />
      default:
        return <PlanningIcon />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-full items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img src="/groovy-logo.png" alt="Groovy" className="h-8" />
            </div>
            <div className="text-sm text-muted-foreground">Dashboard</div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-1.5 text-sm border-2 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none z-10 h-4 w-4" />
            </div>
            <Button variant={state.mode === "edit" ? "default" : "outline"} onClick={toggleMode} className="text-sm">
              {state.mode === "edit" ? "Save" : "Edit"}
            </Button>
            <Button variant="ghost" size="icon" title="Notifications">
              <BellIcon />
            </Button>
            <Avatar className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">U</span>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside
          className={`transition-all duration-200 border-r bg-sidebar ${sidebarExpanded ? "w-60" : "w-16"}`}
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
        >
          <nav className="p-2 space-y-1">
            {[
              { icon: BarChart3Icon, label: "Overview" },
              { icon: ShoppingCartIcon, label: "Orders" },
              { icon: UsersIcon, label: "Customers" },
              { icon: VaultIcon, label: "Vault" },
              { icon: Grid3X3Icon, label: "Apps" },
              { icon: SettingsIcon, label: "Settings" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent cursor-pointer"
              >
                <Icon />
                {sidebarExpanded && <span className="text-sm font-medium">{label}</span>}
              </div>
            ))}
          </nav>

          <div className="absolute bottom-4 left-2 right-2"></div>
        </aside>

        <main className="flex-1 p-4">
          <div className="mb-4 pb-2 border-b-2">
            <div className="flex items-center gap-2 text-lg">
              <BarChart3Icon />
              <span className="font-medium">{pageTitle}</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground">{pageSubtext}</span>
            </div>
          </div>

          <div
            ref={gridRef}
            className={`relative ${
              state.mode === "edit"
                ? "bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:28px_28px]"
                : ""
            }`}
            style={{ minHeight: `${(maxY + 6) * 40 + 100}px` }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="relative">
              {state.layout.map((item) => {
                const block = state.blocks[item.i]
                if (!block) return null

                return (
                  <div
                    key={item.i}
                    className={`absolute group ${state.mode === "edit" ? "cursor-move" : ""}`}
                    style={{
                      left: `calc(${(item.x / 12) * 100}% + ${item.x > 0 ? "8px" : "0px"})`,
                      top: `${item.y * 40 + (item.y > 0 ? 8 : 0)}px`,
                      width: `calc(${(item.w / 12) * 100}% - ${item.x + item.w < 12 ? "8px" : "0px"})`,
                      height: `${item.h * 40 - 8}px`,
                      zIndex: draggedBlock === item.i ? 10 : 1,
                    }}
                    draggable={state.mode === "edit"}
                    onDragStart={(e) => handleDragStart(e, item.i)}
                  >
                    <Card className="h-full shadow-sm border-2 rounded-none relative">
                      {state.mode === "edit" && (
                        <>
                          {/* Bottom-right corner: resize both width and height */}
                          <div
                            className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500/50 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity"
                            onMouseDown={(e) => handleResizeStart(e, item.i, "se")}
                          />
                          {/* Right edge: resize width only */}
                          <div
                            className="absolute top-4 right-0 w-1 h-8 bg-blue-500/30 cursor-e-resize opacity-0 group-hover:opacity-100 transition-opacity"
                            onMouseDown={(e) => handleResizeStart(e, item.i, "e")}
                          />
                          {/* Bottom edge: resize height only */}
                          <div
                            className="absolute bottom-0 left-4 w-8 h-1 bg-blue-500/30 cursor-s-resize opacity-0 group-hover:opacity-100 transition-opacity"
                            onMouseDown={(e) => handleResizeStart(e, item.i, "s")}
                          />
                          <div
                            className="absolute top-2 right-2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation()
                              setState((prev) => ({
                                ...prev,
                                layout: prev.layout.map((layoutItem) =>
                                  layoutItem.i === item.i
                                    ? { ...layoutItem, h: layoutItem.h <= 4 ? 8 : 4 }
                                    : layoutItem,
                                ),
                              }))
                            }}
                          >
                            ⤢
                          </div>
                        </>
                      )}

                      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 border-b-2 h-8">
                        <h3 className="font-medium text-sm">{block.title}</h3>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:bg-yellow-100"
                            onClick={() => {
                              /* TODO: Add notification functionality */
                            }}
                            title="Set Notifications"
                          >
                            <NotificationIcon />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:bg-blue-100"
                            onClick={() => setActiveAiBlock(activeAiBlock === item.i ? null : item.i)}
                            title="AI Assistant"
                          >
                            <BotIcon />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:bg-green-100"
                            onClick={() => handleOpenEditModal(block)}
                            title="Edit Block"
                          >
                            <EditIcon />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:bg-purple-100"
                            onClick={() => extendBlock(item.i)}
                            title="Extend Block"
                          >
                            <ExpandIcon />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:bg-red-100"
                            onClick={() => deleteBlock(item.i)}
                            title="Delete Block"
                          >
                            <Trash2Icon />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0 flex flex-col" style={{ height: "calc(100% - 32px)" }}>
                        <div
                          className={`flex-1 min-h-0 ${block.type !== "metric" ? "p-4" : ""} ${block.type === "metric" ? "" : "overflow-auto"}`}
                        >
                          {renderBlockContent(block)}
                        </div>

                        {block.extensions?.map((ext, i) => (
                          <div key={i}>
                            <hr className="my-4 border-2 border-dashed border-muted-foreground/25" />
                            <div className="space-y-2">
                              <h4 className="text-xs font-medium text-muted-foreground">{ext.title}</h4>
                              {renderBlockContent(ext)}
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
            </div>

            <div
              className="mt-8 border-2 border-dashed border-muted-foreground/25 p-12 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
              onClick={addBlock}
              style={{ position: "relative", top: `${maxY * 40 + 20}px` }}
            >
              <div className="flex flex-col items-center gap-2">
                <PlusIcon />
                <span className="text-sm text-muted-foreground">Add Block</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {editingBlock && (
        <BlockEditModal
          open={editModalOpen}
          onClose={handleCloseEditModal}
          block={editingBlock}
          onReplace={handleReplaceBlock}
          onAddExtension={handleAddExtension}
        />
      )}
    </div>
  )
}
