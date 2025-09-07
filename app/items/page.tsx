"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { generateId } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import BlockEditModal from "@/components/BlockEditModal"
import TableOrders from "@/components/blocks/TableOrders"
import TableGeneric from "@/components/blocks/TableGeneric"
import MetricKPI from "@/components/blocks/MetricKPI"
import ChartLine from "@/components/blocks/ChartLine"
import ChartBar from "@/components/blocks/ChartBar"
import ChartArea from "@/components/blocks/ChartArea"
import ChartDonut from "@/components/blocks/ChartDonut"
import { ChartAreaInteractive } from "@/components/blocks/ChartAreaInteractive"
import { TableMalleable } from "@/components/blocks/TableMalleable"
import { CalendarBlock } from "@/components/blocks/CalendarBlock"
import ActivityTimeline from "@/components/blocks/ActivityTimeline"
import MessagesPreview from "@/components/blocks/MessagesPreview"
import CommandsQuick from "@/components/blocks/CommandsQuick"
import KanbanSimple from "@/components/blocks/KanbanSimple"
import CalendarMini from "@/components/blocks/CalendarMini"
import { FilterItems } from "@/components/blocks/FilterItems"
import { MetricChart } from "@/components/blocks/MetricChart"
import Sidebar from "@/components/Sidebar"

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
  | "metric.chart"
  | "table.orders"
  | "table.malleable"
  | "chart.area.interactive"
  | "activity.timeline"
  | "filter.items"

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
    { x: 0, y: 0, w: 3, h: 4, i: "total-items" },
    { x: 3, y: 0, w: 3, h: 4, i: "categories" },
    { x: 6, y: 0, w: 3, h: 4, i: "low-stock" },
    { x: 9, y: 0, w: 3, h: 4, i: "total-value" },
    { x: 0, y: 4, w: 12, h: 8, i: "items-table" },
    { x: 0, y: 12, w: 3, h: 6, i: "welcome-items" },
    { x: 0, y: 18, w: 12, h: 6, i: "items-analytics" },
  ],
  blocks: {
    "total-items": {
      id: "total-items",
      type: "metric.chart",
      title: "Total Items",
      props: {
        value: "1,247",
        trend: "+12% vs last month",
        trendDirection: "up",
        description: "Growing inventory base"
      },
    },
    "categories": {
      id: "categories",
      type: "metric.chart",
      title: "Categories",
      props: {
        value: "89",
        trend: "+3 new",
        trendDirection: "up",
        description: "Expanding product range"
      },
    },
    "low-stock": {
      id: "low-stock",
      type: "metric.chart",
      title: "Low Stock",
      props: {
        value: "23",
        trend: "-5 items",
        trendDirection: "down",
        description: "Improving stock levels"
      },
    },
    "total-value": {
      id: "total-value",
      type: "metric.chart",
      title: "Total Value",
      props: {
        value: "$45.2K",
        trend: "+8.5%",
        trendDirection: "up",
        description: "Strong value growth"
      },
    },

    "items-table": {
      id: "items-table",
      type: "table.malleable",
      title: "Inventory Items",
      props: {
        columns: [
          { id: "name", name: "Item Name", type: "text", width: 200 },
          { id: "sku", name: "SKU", type: "text", width: 120 },
          { id: "category", name: "Category", type: "select", width: 120, options: ["Clothing", "Accessories", "Footwear", "Electronics", "Home & Garden"] },
          { id: "stock", name: "Stock Level", type: "number", width: 100 },
          { id: "price", name: "Price", type: "number", width: 100 },
          { id: "status", name: "Status", type: "status", width: 100 },
          { id: "lastUpdated", name: "Last Updated", type: "date", width: 120 }
        ],
        data: [
          { id: "1", name: "Denim Jeans", sku: "DJ-001", category: "Clothing", stock: 156, price: 89.99, status: "active", lastUpdated: "2024-12-19" },
          { id: "2", name: "Cotton T-Shirt", sku: "CT-002", category: "Clothing", stock: 89, price: 24.99, status: "active", lastUpdated: "2024-12-18" },
          { id: "3", name: "Leather Belt", sku: "LB-003", category: "Accessories", stock: 12, price: 45.00, status: "pending", lastUpdated: "2024-12-17" },
          { id: "4", name: "Sneakers", sku: "SN-004", category: "Footwear", stock: 67, price: 129.99, status: "active", lastUpdated: "2024-12-16" },
          { id: "5", name: "Hoodie", sku: "HD-005", category: "Clothing", stock: 34, price: 59.99, status: "active", lastUpdated: "2024-12-15" },
          { id: "6", name: "Wireless Headphones", sku: "WH-006", category: "Electronics", stock: 8, price: 199.99, status: "pending", lastUpdated: "2024-12-14" },
          { id: "7", name: "Coffee Mug", sku: "CM-007", category: "Home & Garden", stock: 45, price: 12.99, status: "active", lastUpdated: "2024-12-13" },
          { id: "8", name: "Running Shoes", sku: "RS-008", category: "Footwear", stock: 23, price: 89.99, status: "active", lastUpdated: "2024-12-12" }
        ]
      }
    },
    "welcome-items": {
      id: "welcome-items",
      type: "note",
      title: "🎯 Welcome to Items Management",
      props: {
        body: `# Welcome to Your Items Dashboard! 📦

**Groovy Items** is your intelligent inventory management system where you can track, organize, and optimize your product catalog.

## ✨ What You Can Do:

**📋 Manage Inventory** - Use the table below to add, edit, and organize your items
**📊 Track Metrics** - Monitor stock levels, categories, and inventory value
**📈 View Analytics** - See trends and patterns in your inventory data
**🎨 Customize Views** - Resize, move, and customize any component

## 🎮 Getting Started:

**📝 Add New Items:**
• Click "Add Row" in the table to add new items
• Use the settings icon in column headers to customize columns
• Click any cell to edit item details directly

**📊 Monitor Stock:**
• Watch the metrics cards for real-time inventory overview
• Use the analytics chart to spot trends
• Set up alerts for low stock items

**🔍 Organize Efficiently:**
• Filter by category, status, or stock level
• Sort by any column to find items quickly
• Use the search to locate specific items

## 💡 Pro Tips:
• **Double-click** any title to edit it instantly
• **Drag and drop** components to rearrange your workspace
• **Resize** components to see more or less detail
• **Use AI** to create new components and insights

*This is YOUR inventory workspace - make it perfect for your business!* ✨`
      }
    },
    "items-analytics": {
      id: "items-analytics",
      type: "chart.area.interactive",
      title: "📈 Inventory Analytics",
    },
  },
}

export default function ItemsPage() {
  const [state, setState] = useState<DashboardState>(initialState)
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [aiInput, setAiInput] = useState("")
  const [activeAiBlock, setActiveAiBlock] = useState<string | null>(null)
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null)
  const [pageTitle, setPageTitle] = useState("Items Management")
  const [pageSubtext, setPageSubtext] = useState("Manage inventory and product catalog")
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
  const [dragPreview, setDragPreview] = useState<{ x: number; y: number; w: number; h: number } | null>(null)
  const [contentHeights, setContentHeights] = useState<Record<string, number>>({})
  const [savedState, setSavedState] = useState<DashboardState | null>(null)
  const [isFrozen, setIsFrozen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [metrics, setMetrics] = useState([
    { name: "Production Efficiency", value: "87.3%", delta: "+2.1%", icon: "⚡" },
    { name: "Quality Score", value: "94.2%", delta: "+1.8%", icon: "🎯" },
    { name: "On-Time Delivery", value: "91.7%", delta: "+3.2%", icon: "🚚" },
    { name: "Cost per Unit", value: "$12.45", delta: "-5.1%", icon: "💰" }
  ])
  const gridRef = useRef<HTMLDivElement>(null)
  const isFixingOverlaps = useRef(false)

  useEffect(() => {
    // Load saved state from localStorage if it exists
    const savedState = localStorage.getItem('groovy:items:v4')
    const frozenState = localStorage.getItem('groovy:items:frozen')
    
    if (frozenState) {
      // If there's a frozen state, load it and set frozen mode
      try {
        const parsedState = JSON.parse(frozenState)
        setState(parsedState)
        setIsFrozen(true)
        setSavedState(parsedState)
      } catch (error) {
        console.error('Error loading frozen state:', error)
        setState(initialState)
        setIsFrozen(false)
      }
    } else if (savedState) {
      // Load regular saved state
      try {
        const parsedState = JSON.parse(savedState)
        setState(parsedState)
        setIsFrozen(false)
      } catch (error) {
        console.error('Error loading saved state:', error)
        setState(initialState)
        setIsFrozen(false)
      }
    } else {
      setState(initialState)
      setIsFrozen(false)
    }
  }, [])

  // Fix overlaps whenever layout changes
  useEffect(() => {
    // Only run if we're not already in the middle of fixing overlaps
    if (state.layout.length > 0 && !isFixingOverlaps.current) {
      fixLayoutOverlaps()
    }
  }, [state.layout])

  // Function to reset items page to initial state
  const resetItemsPage = () => {
    if (confirm("Are you sure you want to reset the items page? This will clear all saved state.")) {
      setState(initialState)
      setIsFrozen(false)
      setSavedState(null)
      localStorage.removeItem('groovy:items:v4')
      localStorage.removeItem('groovy:items:frozen')
    }
  }

  useEffect(() => {
    // Only save to localStorage if not in frozen mode, or if it's a frozen state being saved
    if (!isFrozen || state.mode === "save") {
      localStorage.setItem('groovy:items:v4', JSON.stringify(state))
    }
  }, [state, isFrozen])

  const toggleMode = () => {
    if (state.mode === "edit") {
      // Save and freeze the current state
      const frozenState = { ...state, mode: "save" }
      setSavedState(frozenState)
      setIsFrozen(true)
      setState(frozenState)
      
      // Save to localStorage
      localStorage.setItem('groovy:items:v4', JSON.stringify(frozenState))
      localStorage.setItem('groovy:items:frozen', JSON.stringify(frozenState))
    } else {
      // Unfreeze and return to edit mode
      const editState = { ...state, mode: "edit" }
      setIsFrozen(false)
      setState(editState)
      
      // Update localStorage
      localStorage.setItem('groovy:items:v4', JSON.stringify(editState))
      localStorage.removeItem('groovy:items:frozen')
    }
  }

  // Function to check for overlaps and fix them
  const fixLayoutOverlaps = () => {
    if (isFixingOverlaps.current) return
    
    isFixingOverlaps.current = true
    
    setState((prev) => {
      const newLayout = [...prev.layout]
      let hasChanges = false
      
      // Create a sorted copy instead of mutating the original
      const sortedLayout = [...newLayout].sort((a, b) => a.y - b.y)
      
      for (let i = 0; i < sortedLayout.length; i++) {
        const current = sortedLayout[i]
        const currentIndex = newLayout.findIndex(item => item.i === current.i)
        
        // Check for overlaps with previous blocks
        for (let j = 0; j < i; j++) {
          const previous = sortedLayout[j]
          
          // Check if blocks overlap horizontally and vertically
          const horizontalOverlap = !(current.x >= previous.x + previous.w || current.x + current.w <= previous.x)
          const verticalOverlap = !(current.y >= previous.y + previous.h || current.y + current.h <= previous.y)
          
          if (horizontalOverlap && verticalOverlap) {
            // Move current block down to avoid overlap
            const newY = previous.y + previous.h
            newLayout[currentIndex] = { ...current, y: newY }
            hasChanges = true
            break
          }
        }
      }
      
      return hasChanges ? { ...prev, layout: newLayout } : prev
    })
    
    // Reset the flag after a short delay to allow the state update to complete
    setTimeout(() => {
      isFixingOverlaps.current = false
    }, 100)
  }

  // Function to automatically adjust layout when content needs more space
  const adjustLayoutForContent = (blockId: string, requiredHeight: number) => {
    setState((prev) => {
      const newLayout = [...prev.layout]
      const blockIndex = newLayout.findIndex(item => item.i === blockId)
      
      if (blockIndex !== -1) {
        const currentBlock = newLayout[blockIndex]
        const currentHeight = currentBlock.h
        const heightDiff = Math.max(0, requiredHeight - currentHeight)
        
        if (heightDiff > 0) {
          // Increase this block's height
          newLayout[blockIndex] = { ...currentBlock, h: requiredHeight }
          
          // Push down all blocks below this one
          for (let i = 0; i < newLayout.length; i++) {
            if (i !== blockIndex && newLayout[i].y >= currentBlock.y + currentHeight) {
              newLayout[i] = { ...newLayout[i], y: newLayout[i].y + heightDiff }
            }
          }
        }
      }
      
      return { ...prev, layout: newLayout }
    })
  }

  const addBlock = () => {
    const maxY = Math.max(...state.layout.map((item) => item.y + item.h), 0)
    const newId = generateId("b")

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
              id: generateId(`${blockId}-ext`),
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
    
    const layoutItem = state.layout.find((item) => item.i === blockId)
    if (!layoutItem) return

    setDraggedBlock(blockId)
    setDragPreview({ x: layoutItem.x, y: layoutItem.y, w: layoutItem.w, h: layoutItem.h })
    
    e.dataTransfer.effectAllowed = "move"
    
    // Add smooth transition class to the dragged element
    const draggedElement = e.currentTarget as HTMLElement
    draggedElement.style.transition = "none"
    draggedElement.style.opacity = "0.8"
    draggedElement.style.transform = "rotate(2deg) scale(1.02)"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    
    if (!draggedBlock || !gridRef.current) return

    const rect = gridRef.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // Calculate grid position with more accurate calculations
    // Account for the actual grid layout and spacing
    const totalWidth = rect.width
    const gridUnitWidth = totalWidth / 12 // 12-column grid
    const rowHeight = 40 // Height of one grid row
    
    // Calculate grid coordinates more precisely
    const newX = Math.max(0, Math.min(11, Math.floor(mouseX / gridUnitWidth)))
    const newY = Math.max(0, Math.floor(mouseY / rowHeight))

    // Update preview position smoothly
    setDragPreview((prev) => {
      if (!prev) return null
      
      const layoutItem = state.layout.find((item) => item.i === draggedBlock)
      if (!layoutItem) return prev

      return {
        x: newX,
        y: newY,
        w: layoutItem.w,
        h: layoutItem.h
      }
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (!draggedBlock || !gridRef.current || !dragPreview) return

    // Update the layout with the new position
    setState((prev) => ({
      ...prev,
      layout: prev.layout.map((item) =>
        item.i === draggedBlock ? { ...item, x: dragPreview.x, y: dragPreview.y } : item,
      ),
    }))

    // Reset drag state
    setDraggedBlock(null)
    setDragPreview(null)

    // Remove transition effects from the dragged element
    const draggedElement = e.currentTarget as HTMLElement
    draggedElement.style.transition = ""
    draggedElement.style.opacity = ""
    draggedElement.style.transform = ""
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
        // For production chart, render slideshow flip component with proper charts
        if (block.id === "production-chart") {
          
          const slides = [
            {
              title: "Weekly Production",
              icon: "📊",
              color: "blue",
              data: [145, 162, 138, 175, 189, 156, 142],
              change: "+12%",
              changeType: "positive",
              description: "Units produced this week"
            },
            {
              title: "Efficiency Rate",
              icon: "⚡",
              color: "green",
              data: [87, 89, 85, 92, 94, 91, 88],
              change: "+5%",
              changeType: "positive",
              description: "Production efficiency percentage"
            },
            {
              title: "Quality Score",
              icon: "🎯",
              color: "purple",
              data: [95, 97, 94, 98, 99, 96, 95],
              change: "+2%",
              changeType: "positive",
              description: "Quality control metrics"
            },
            {
              title: "On-Time Delivery",
              icon: "🚚",
              color: "orange",
              data: [92, 95, 88, 96, 98, 94, 91],
              change: "+3%",
              changeType: "positive",
              description: "Delivery performance"
            }
          ]

          const currentSlideData = slides[currentSlide]
          const colorClasses = {
            blue: "from-blue-500 to-blue-600",
            green: "from-green-500 to-green-600", 
            purple: "from-purple-500 to-purple-600",
            orange: "from-orange-500 to-orange-600"
          }

          return (
            <div className="h-full flex flex-col p-4">
              {/* Header with navigation */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{currentSlideData.icon}</span>
                  <h3 className="font-semibold text-foreground">{currentSlideData.title}</h3>
                </div>
                <div className="flex items-center gap-1">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentSlide ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Chart content */}
              <div className="flex-1 flex flex-col">
                <div className="flex-1 flex items-end justify-between gap-2 mb-4">
                  {currentSlideData.data.map((value, i) => {
                    const maxValue = Math.max(...currentSlideData.data)
                    const heightPercentage = (value / maxValue) * 100
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div 
                          className={`w-full bg-gradient-to-t ${colorClasses[currentSlideData.color as keyof typeof colorClasses]} rounded-t transition-all duration-500 min-h-[20px]`}
                          style={{ height: `${Math.max(heightPercentage, 10)}%` }}
                        />
                        <div className="text-xs text-muted-foreground mt-2">
                          {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">{currentSlideData.description}</div>
                  <div className={`text-sm font-medium ${
                    currentSlideData.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {currentSlideData.change} vs last week
                  </div>
                </div>
              </div>
            </div>
          )
        }
        
        // Use the actual ChartLine component for other line charts
        return <ChartLine block={block} />
      case "chart.bar":
        return <ChartBar block={block} />
      case "chart.area":
        return <ChartArea block={block} />
              case "chart.donut":
          return <ChartDonut block={block} />
        case "chart.area.interactive":
          return <ChartAreaInteractive block={block} />
              case "table.malleable":
        return (
          <TableMalleable
            title={block.title}
            columns={block.props?.columns || []}
            data={block.props?.data || []}
            className="h-full"
            showFilters={true}
          />
        )
      case "calendar":
        return (
          <CalendarBlock
            title={block.title}
            events={block.props?.events || []}
            className="h-full"
          />
        )
      case "metric.chart":
        return (
          <MetricChart
            title={block.title || "Metric"}
            value={block.props?.value || "0"}
            trend={block.props?.trend || "0%"}
            trendDirection={block.props?.trendDirection || "neutral"}
            description={block.props?.description}
            className="h-full"
          />
        )
      case "filter.items":
        return (
          <FilterItems
            title={block.title}
            onFilterChange={(filters) => {
              console.log('Filters changed:', filters)
              // Here you would filter the table data based on the filters
            }}
            className="h-full"
          />
        )
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

        // Simple markdown-like rendering for welcome content
        const renderMarkdown = (text: string) => {
          return text
            .split('\n')
            .map((line, index) => {
              // Headers
              if (line.startsWith('# ')) {
                return <h1 key={index} className="text-xl font-bold text-foreground mb-2">{line.substring(2)}</h1>
              }
              if (line.startsWith('## ')) {
                return <h2 key={index} className="text-lg font-semibold text-foreground mb-2 mt-4">{line.substring(3)}</h2>
              }
              if (line.startsWith('### ')) {
                return <h3 key={index} className="text-base font-medium text-foreground mb-1 mt-3">{line.substring(4)}</h3>
              }
              
              // Bold text
              if (line.includes('**')) {
                const parts = line.split('**')
                return (
                  <p key={index} className="mb-2">
                    {parts.map((part, i) => 
                      i % 2 === 0 ? part : <strong key={i} className="font-bold">{part}</strong>
                    )}
                  </p>
                )
              }
              
              // Bullet points
              if (line.startsWith('• ')) {
                return <li key={index} className="ml-4 mb-1 text-sm">{line.substring(2)}</li>
              }
              if (line.startsWith('1. ')) {
                return <li key={index} className="ml-4 mb-1 text-sm list-decimal">{line.substring(3)}</li>
              }
              
              // Italic text
              if (line.startsWith('*') && line.endsWith('*')) {
                return <p key={index} className="text-sm italic text-muted-foreground mb-2">{line.substring(1, line.length - 1)}</p>
              }
              
              // Empty lines
              if (line.trim() === '') {
                return <div key={index} className="h-2"></div>
              }
              
              // Regular text
              return <p key={index} className="text-sm mb-2">{line}</p>
            })
        }

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
                className="flex-1 p-3 text-sm leading-relaxed cursor-text hover:bg-muted/20 transition-colors overflow-auto"
                onClick={() => handleNoteEditStart(block.id)}
              >
                {block.id === "welcome-groovy"
                  ? renderMarkdown(currentContent)
                  : <div className="whitespace-pre-wrap font-mono">{currentContent || "Click to add notes..."}</div>
                }
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
        // Enhanced metric rendering for the 87% efficiency metric
        if (block.id === "efficiency-metric") {

          return (
            <div className="h-full flex flex-col">
              {/* Header with configure button */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                <h3 className="text-sm font-medium text-foreground">Key Metrics</h3>
                {state.mode === "edit" && (
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {isEditing ? "Done" : "Configure"}
                  </button>
                )}
              </div>
              
              {/* Metrics - Compact horizontal layout */}
              <div className="flex items-center justify-between flex-1 px-4 py-2">
                {metrics.map((metric, i) => (
                  <div 
                    key={i} 
                    className={`flex flex-col items-center text-center p-2 rounded transition-all cursor-pointer ${
                      isEditing ? 'ring-1 ring-blue-300 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => isEditing && console.log('Edit metric:', metric.name)}
                  >
                    <div className="text-xs text-muted-foreground font-medium mb-1">{metric.name}</div>
                    <div className="flex items-center gap-1 mb-1">
                      <div className="text-sm">{metric.icon}</div>
                      <div className="text-lg font-bold text-foreground">{metric.value}</div>
                    </div>
                    <div className="text-xs text-green-600">{metric.delta}</div>
                    {isEditing && (
                      <div className="text-xs text-blue-600 mt-1">Click to edit</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        }
        
        // Default metric rendering for other metrics
        return (
          <div className="p-4 flex flex-col justify-center h-full">
            <div className="text-3xl font-bold text-foreground mb-2 leading-tight">{block.props?.value || "0"}</div>
            <div className="text-xs text-muted-foreground leading-normal">{block.props?.delta || "No change"}</div>
          </div>
        )
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
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 8V4H8" />
                <rect width="16" height="12" x="4" y="8" rx="2" />
                <path d="M2 14h2" />
                <path d="M20 14h2" />
                <path d="M15 13v2" />
                <path d="M9 13v2" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Create Something Amazing! 🚀
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm leading-relaxed">
              I'm your AI assistant for building dashboard components. Just describe what you want and I'll create it for you instantly!
            </p>

            <div className="w-full max-w-md space-y-4">
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
                  className="h-12 text-base pl-4 pr-12 rounded-lg border-2 focus:border-purple-500 transition-colors shadow-sm"
                  autoFocus
                />
                <Button
                  size="icon"
                  className="absolute right-2 top-1 h-10 w-10 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-md shadow-sm"
                  onClick={() => handleAiSubmit(block.id)}
                  disabled={!aiInput.trim()}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </Button>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Try these examples:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    { text: "📊 Sales Dashboard", color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
                    { text: "📈 Revenue Chart", color: "bg-green-100 text-green-700 hover:bg-green-200" },
                    { text: "👥 Team Overview", color: "bg-purple-100 text-purple-700 hover:bg-purple-200" },
                    { text: "📝 Project Notes", color: "bg-orange-100 text-orange-700 hover:bg-orange-200" }
                  ].map((suggestion) => (
                    <button
                      key={suggestion.text}
                      onClick={() => {
                        setAiInput(suggestion.text.toLowerCase())
                        handleAiSubmit(block.id)
                      }}
                      className={`px-3 py-2 text-xs rounded-lg transition-colors font-medium ${suggestion.color}`}
                    >
                      {suggestion.text}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-xs text-muted-foreground mt-4">
                💡 <strong>Pro tip:</strong> Be specific! "Create a chart showing monthly revenue with customer segments" works better than "make a chart"
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

    if (state.mode !== "edit" || isFrozen) return

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
            <Button 
              variant={state.mode === "edit" ? "default" : isFrozen ? "secondary" : "outline"} 
              onClick={toggleMode} 
              className={`text-sm ${isFrozen ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}`}
            >
              {state.mode === "edit" ? "Save & Freeze" : isFrozen ? "Frozen" : "Edit"}
            </Button>
            <Button 
              variant="outline" 
              onClick={resetItemsPage}
              className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Reset Items Page"
            >
              Reset
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
        <Sidebar 
          sidebarExpanded={sidebarExpanded}
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
        />

        <main className="flex-1 p-4">
          <div className="mb-4 pb-2 border-b-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-lg">
                <BarChart3Icon />
                <span className="font-medium">{pageTitle}</span>
                <span className="text-muted-foreground">/</span>
                <span className="text-muted-foreground">{pageSubtext}</span>
              </div>
              {isFrozen && (
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Dashboard Frozen - Layout Saved
                </div>
              )}
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
            {/* Drag Preview Indicator */}
            {dragPreview && state.mode === "edit" && (
              <div
                className="absolute pointer-events-none z-20"
                style={{
                  left: `calc(${(dragPreview.x / 12) * 100}% + ${dragPreview.x > 0 ? "8px" : "0px"})`,
                  top: `${dragPreview.y * 40 + (dragPreview.y > 0 ? 8 : 0)}px`,
                  width: `calc(${(dragPreview.w / 12) * 100}% - ${dragPreview.x + dragPreview.w < 12 ? "8px" : "0px"})`,
                  height: `${dragPreview.h * 40 - 8}px`,
                }}
              >
                <div className="w-full h-full border-2 border-blue-500 border-dashed bg-blue-50/30 rounded-lg shadow-lg animate-pulse">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-lg"></div>
                  <div className="absolute top-2 left-2 text-xs text-blue-600 font-medium bg-white/80 px-2 py-1 rounded">
                    Drop here
                  </div>
                </div>
              </div>
            )}
            <div className="relative">
              {state.layout.map((item) => {
                const block = state.blocks[item.i]
                if (!block) return null

                return (
                  <div
                    key={item.i}
                    className={`absolute group transition-all duration-200 ease-out ${state.mode === "edit" ? "cursor-move" : ""} ${draggedBlock === item.i ? "z-30" : "z-10"}`}
                    style={{
                      left: `calc(${(item.x / 12) * 100}% + ${item.x > 0 ? "8px" : "0px"})`,
                      top: `${item.y * 40 + (item.y > 0 ? 8 : 0)}px`,
                      width: `calc(${(item.w / 12) * 100}% - ${item.x + item.w < 12 ? "8px" : "0px"})`,
                      height: `${item.h * 40 - 8}px`,
                      transform: draggedBlock === item.i ? "rotate(2deg) scale(1.02)" : "rotate(0deg) scale(1)",
                      opacity: draggedBlock === item.i ? 0.8 : 1,
                      filter: draggedBlock === item.i ? "drop-shadow(0 10px 20px rgba(0,0,0,0.2))" : "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                    }}
                    draggable={state.mode === "edit"}
                    onDragStart={(e) => handleDragStart(e, item.i)}
                  >
                    <Card className="h-full shadow-sm border-2 rounded-none relative">
                      {state.mode === "edit" && !isFrozen && (
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

                      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-2 sm:px-3 md:px-4 border-b-2 h-6 sm:h-7 md:h-8">
                        <h3 className="font-medium text-[8px] sm:text-[10px] md:text-xs lg:text-sm truncate flex-shrink-0">{block.title}</h3>
                        {state.mode === "edit" && !isFrozen && (
                          <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 ${
                              isFrozen ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-100'
                            }`}
                            onClick={() => {
                              if (!isFrozen) {
                                /* TODO: Add notification functionality */
                              }
                            }}
                            title="Set Notifications"
                            disabled={isFrozen}
                          >
                            <NotificationIcon />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 ${
                              isFrozen ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-100'
                            }`}
                            onClick={() => !isFrozen && setActiveAiBlock(activeAiBlock === item.i ? null : item.i)}
                            title="AI Assistant"
                            disabled={isFrozen}
                          >
                            <BotIcon />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 ${
                              isFrozen ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-100'
                            }`}
                            onClick={() => !isFrozen && handleOpenEditModal(block)}
                            title="Edit Block"
                            disabled={isFrozen}
                          >
                            <EditIcon />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 ${
                              isFrozen ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-100'
                            }`}
                            onClick={() => !isFrozen && extendBlock(item.i)}
                            title="Extend Block"
                            disabled={isFrozen}
                          >
                            <ExpandIcon />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 ${
                              isFrozen ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-100'
                            }`}
                            onClick={() => !isFrozen && deleteBlock(item.i)}
                            title="Delete Block"
                            disabled={isFrozen}
                          >
                            <Trash2Icon />
                          </Button>
                        </div>
                        )}
                      </CardHeader>
                      <CardContent className="p-0 flex flex-col min-h-0" style={{ height: "calc(100% - 32px)" }}>
                        <div
                          className={`flex-1 min-h-0 ${block.type !== "metric" ? "p-4" : ""} ${block.type === "metric" ? "" : "overflow-auto"} flex flex-col`}
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
