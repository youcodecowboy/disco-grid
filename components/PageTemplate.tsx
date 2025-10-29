"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { cn, generateId } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import BlockEditModal from "@/components/BlockEditModal"
import BlockRenderer from "@/components/BlockRenderer"
import Sidebar from "@/components/Sidebar"
import { ComponentRefinementInput } from "@/components/blocks/ComponentRefinementInput"
import { AnimatePresence, motion } from "framer-motion"
import { generateChartData, generateTableData, generateMetricData } from "@/app/playground/lib/mockDataGenerator"

// Common icons used across pages
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

const BellIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

const PlusIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
)

const NotificationIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
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

const Wand2Icon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
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

const Avatar = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-full ${className}`}>
    {children}
  </div>
)

const AvatarFallback = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
    {children}
  </div>
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
  | "metric.chart"
  | "metric.items"
  | "table.malleable"
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

interface PageTemplateProps {
  pageTitle: string
  pageSubtext: string
  storageKey: string
  frozenStorageKey: string
  initialState: DashboardState
  showFilters?: boolean
  resetFunction?: () => void
  functionButtons?: Array<{
    label: string
    variant?: "default" | "outline" | "secondary" | "ghost"
    onClick: () => void
  }>
}

export default function PageTemplate({
  pageTitle,
  pageSubtext,
  storageKey,
  frozenStorageKey,
  initialState,
  showFilters = false,
  resetFunction,
  functionButtons = []
}: PageTemplateProps) {
  const [state, setState] = useState<DashboardState>(initialState)
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [activeAiBlock, setActiveAiBlock] = useState<string | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingBlock, setEditingBlock] = useState<Block | null>(null)
  // Inline title editing state
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null)
  const [titleInput, setTitleInput] = useState<string>("")
  // Component refinement state
  const [refiningBlock, setRefiningBlock] = useState<string | null>(null)
  const [showRefinementBadge, setShowRefinementBadge] = useState<Record<string, boolean>>({})
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null)
  const [dragPreview, setDragPreview] = useState<{ x: number; y: number; w: number; h: number } | null>(null)
  const [savedState, setSavedState] = useState<DashboardState | null>(null)
  const [isFrozen, setIsFrozen] = useState(false)
  const [activeControlPanel, setActiveControlPanel] = useState<string | null>(null)
  const [expandedColorPicker, setExpandedColorPicker] = useState<string | null>(null)
  const [resizing, setResizing] = useState<{
    blockId: string
    direction: "se" | "e" | "s"
    startX: number
    startY: number
    startW: number
    startH: number
  } | null>(null)
  const [contentHeights, setContentHeights] = useState<Record<string, number>>({})
  const gridRef = useRef<HTMLDivElement>(null)
  const isFixingOverlaps = useRef(false)

  // Calculate max Y position for grid height
  const maxY = Math.max(...state.layout.map(item => item.y + item.h), 0)

  useEffect(() => {
    // Load saved state from localStorage if it exists
    const savedState = localStorage.getItem(storageKey)
    const frozenState = localStorage.getItem(frozenStorageKey)
    
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
  }, [storageKey, frozenStorageKey, initialState])

  // Fix overlaps whenever layout changes
  useEffect(() => {
    // Only run if we're not already in the middle of fixing overlaps
    if (state.layout.length > 0 && !isFixingOverlaps.current) {
      fixLayoutOverlaps()
    }
  }, [state.layout])

  // Function to reset page to initial state
  const resetPage = () => {
    if (confirm("Are you sure you want to reset this page? This will clear all saved state.")) {
      setState(initialState)
      setIsFrozen(false)
      setSavedState(null)
      localStorage.removeItem(storageKey)
      localStorage.removeItem(frozenStorageKey)
      if (resetFunction) {
        resetFunction()
      }
    }
  }

  useEffect(() => {
    // Only save to localStorage if not in frozen mode, or if it's a frozen state being saved
    if (!isFrozen || state.mode === "save") {
      localStorage.setItem(storageKey, JSON.stringify(state))
    }
  }, [state, isFrozen, storageKey])

  const toggleMode = () => {
    if (state.mode === "edit") {
      // Save and freeze the current state
      const frozenState = { ...state, mode: "save" }
      setSavedState(frozenState)
      setIsFrozen(true)
      setState(frozenState)
      
      // Save to localStorage
      localStorage.setItem(storageKey, JSON.stringify(frozenState))
      localStorage.setItem(frozenStorageKey, JSON.stringify(frozenState))
    } else {
      // Unfreeze and return to edit mode
      const editState = { ...state, mode: "edit" }
      setIsFrozen(false)
      setState(editState)
      
      // Update localStorage
      localStorage.setItem(storageKey, JSON.stringify(editState))
      localStorage.removeItem(frozenStorageKey)
    }
  }

  // Title editing helpers
  const beginEditTitle = (blockId: string) => {
    if (isFrozen || state.mode !== "edit") return
    const current = state.blocks[blockId]?.title || ""
    setEditingTitleId(blockId)
    setTitleInput(current)
  }

  const commitEditTitle = () => {
    if (!editingTitleId) return
    const newTitle = titleInput.trim()
    setState(prev => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        [editingTitleId]: { ...prev.blocks[editingTitleId], title: newTitle }
      }
    }))
    setEditingTitleId(null)
  }

  const cancelEditTitle = () => {
    setEditingTitleId(null)
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
    const newBlock: Block = {
      id: generateId("b"),
      type: "ai.input",
      title: "AI Component Builder",
      props: { placeholder: "Describe what you'd like to build..." }
    }

    const newPos: GridPos = {
      i: newBlock.id,
      x: 0,
      y: maxY + 1,
      w: 6,
      h: 8
    }

    setState(prev => ({
      ...prev,
      layout: [...prev.layout, newPos],
      blocks: { ...prev.blocks, [newBlock.id]: newBlock }
    }))
  }

  const deleteBlock = (blockId: string) => {
    setState(prev => ({
      ...prev,
      layout: prev.layout.filter(item => item.i !== blockId),
      blocks: Object.fromEntries(
        Object.entries(prev.blocks).filter(([id]) => id !== blockId)
      )
    }))
  }

  const extendBlock = (blockId: string) => {
    const newExtension: Block = {
      id: generateId(`${blockId}-ext`),
      type: "metric.kpi",
      title: "Extension",
      props: { value: "0", delta: "+0%", trend: [1, 2, 3, 4, 5, 6, 7] }
    }

    setState(prev => ({
      ...prev,
      blocks: { ...prev.blocks, [newExtension.id]: newExtension }
    }))
  }

  const handleOpenEditModal = (block: Block) => {
    setEditingBlock(block)
    setEditModalOpen(true)
  }

  const handleReplaceBlock = (newBlock: Block) => {
    setState(prev => ({
      ...prev,
      blocks: { ...prev.blocks, [newBlock.id]: newBlock }
    }))
  }

  const handleAddExtension = (extensionBlock: Block) => {
    if (!editingBlock) return

    setState(prev => ({
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

  const handleComponentRefinement = (blockId: string, refinement: any) => {
    console.log('🔧 Applying refinement:', blockId, refinement)
    
    setState(prev => {
      const currentBlock = prev.blocks[blockId]
      if (!currentBlock) {
        console.error('❌ Block not found:', blockId)
        return prev
      }

      console.log('📦 Current block before refinement:', currentBlock)

      // Merge config changes
      let updatedConfig = {
        ...currentBlock.props,
        ...refinement.configChanges,
        _aiRefinements: [
          ...(currentBlock.props?._aiRefinements || []),
          {
            prompt: refinement.refinementPrompt,
            modificationType: refinement.modificationType,
            reasoning: refinement.reasoning,
            timestamp: new Date().toISOString()
          }
        ],
        _lastRefinement: Date.now() // Force React to detect change
      }

      // Regenerate mock data if the refinement changes filters or limits
      const componentType = refinement.newComponentType || currentBlock.type
      if (refinement.configChanges && Object.keys(refinement.configChanges).length > 0) {
        // Determine limit from refinement or existing config
        const limit = refinement.configChanges.limit || updatedConfig.limit
        console.log('🔄 Regenerating mock data for refinement...')
        console.log('   Config changes:', refinement.configChanges)
        console.log('   Limit:', limit)
        console.log('   Component type:', componentType)
        
        // Regenerate data based on new config
        if (componentType === 'v3.chart.area' || componentType === 'v3.chart.bar') {
          // Generate chart data with the specified limit
          const chartData = generateChartData(refinement.refinementPrompt, updatedConfig.dataSource, limit)
          updatedConfig = { ...updatedConfig, data: chartData }
          console.log(`✨ Regenerated ${chartData.length} data points for ${componentType}`)
        } else if (componentType === 'v3.chart.donut') {
          // Generate chart data with the specified limit and transform for donut
          console.log('🍩 [Refinement] Regenerating donut data with limit:', limit)
          const chartData = generateChartData(refinement.refinementPrompt, updatedConfig.dataSource, limit)
          console.log('🍩 [Refinement] Raw chart data:', chartData)
          
          // Transform and validate
          const donutData = chartData.map((item: any) => ({
            name: item.date || 'Unknown',
            value: typeof item.value === 'number' ? item.value : 0
          }))
          
          // Validate no undefined values
          const hasInvalid = donutData.some(d => 
            d.name === undefined || d.value === undefined || isNaN(d.value)
          )
          
          if (hasInvalid) {
            console.error('❌ [Refinement Donut] Invalid data:', donutData)
          } else {
            console.log(`✅ [Refinement] Generated ${donutData.length} valid donut data points`)
            console.log('   Sample:', donutData.slice(0, 2))
          }
          
          updatedConfig = {
            ...updatedConfig,
            data: donutData
          }
        } else if (componentType === 'v3.table') {
          const tableData = generateTableData(refinement.refinementPrompt, updatedConfig.dataSource)
          updatedConfig = {
            ...updatedConfig,
            columns: tableData.columns.map((col: any) => col.name),
            rows: (limit ? tableData.data.slice(0, limit) : tableData.data).map((row: any) => 
              tableData.columns.map((col: any) => {
                const value = row[col.id]
                if (value === null || value === undefined) return ''
                if (typeof value === 'number') return value.toLocaleString()
                return String(value)
              })
            )
          }
          console.log(`✨ Regenerated ${updatedConfig.rows.length} table rows`)
        }
      }

      // Update block (use newComponentType/newTitle if provided, otherwise keep current)
      const updatedBlock = {
        ...currentBlock,
        type: componentType,
        title: refinement.newTitle !== null ? refinement.newTitle : currentBlock.title,
        props: updatedConfig
      }

      console.log('✅ Updated block:', updatedBlock)
      console.log('🔄 Title change:', currentBlock.title, '=>', updatedBlock.title)

      const newState = {
        ...prev,
        blocks: {
          ...prev.blocks,
          [blockId]: updatedBlock
        }
      }

      console.log('💾 New state will save to localStorage')
      return newState
    })

    // Show refinement badge
    setShowRefinementBadge(prev => ({ ...prev, [blockId]: true }))
    
    // Hide badge after 5 seconds
    setTimeout(() => {
      setShowRefinementBadge(prev => ({ ...prev, [blockId]: false }))
    }, 5000)
    
    // Close refinement input after a brief delay to see the success message
    setTimeout(() => {
      setRefiningBlock(null)
      console.log('🎉 Refinement complete!')
    }, 100)
  }

  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    if (state.mode !== "edit" || isFrozen) return
    
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

    // Update preview position smoothly - only if position actually changed
    setDragPreview((prev) => {
      if (!prev) return null
      
      // Don't update if position hasn't changed (prevents infinite re-renders)
      if (prev.x === newX && prev.y === newY) return prev
      
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

    // Calculate new dimensions
    let newW = resizing.startW
    let newH = resizing.startH

    if (resizing.direction === "se" || resizing.direction === "e") {
      const currentItem = state.layout.find(item => item.i === resizing.blockId)
      if (currentItem) {
        newW = Math.max(2, Math.min(12 - currentItem.x, resizing.startW + deltaW))
      }
    }
    if (resizing.direction === "se" || resizing.direction === "s") {
      newH = Math.max(2, Math.min(20, resizing.startH + deltaH))
    }

    // Only update state if dimensions actually changed
    const currentItem = state.layout.find(item => item.i === resizing.blockId)
    if (currentItem && (currentItem.w !== newW || currentItem.h !== newH)) {
      setState((prev) => ({
        ...prev,
        layout: prev.layout.map((item) => {
          if (item.i !== resizing.blockId) return item
          return { ...item, w: newW, h: newH }
        }),
      }))
    }
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
              onClick={resetPage}
              className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Reset Page"
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
          <div className="mb-2 pb-2 border-b-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-lg">
                <BarChart3Icon />
                <span className="font-medium">{pageTitle}</span>
                <span className="text-muted-foreground">/</span>
                <span className="text-muted-foreground">{pageSubtext}</span>
              </div>
              <div className="flex items-center gap-2">
                {functionButtons.map((button, index) => (
                  <Button
                    key={index}
                    variant={button.variant || "default"}
                    onClick={button.onClick}
                    className="text-sm"
                  >
                    {button.label}
                  </Button>
                ))}
                {isFrozen && (
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Dashboard Frozen - Layout Saved
                  </div>
                )}
              </div>
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
                    className={`absolute transition-all duration-200 ease-out ${state.mode === "edit" ? "cursor-move" : ""} ${draggedBlock === item.i ? "z-30" : activeControlPanel === item.i ? "z-40" : "z-10"}`}
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
                    <Card
                      className={cn(
                        "group relative flex h-full flex-col rounded-none border-2 border-slate-200 bg-white shadow-sm transition",
                        block.type?.startsWith("metric") && "border-none bg-transparent shadow-none",
                        block.type?.startsWith("table") && "border-none bg-white shadow-none",
                        block.type?.startsWith("construction.") && "border-none bg-transparent shadow-none rounded-none p-0",
                        block.type?.startsWith("worksite.") && "border-none bg-transparent shadow-none rounded-none p-0",
                        block.type?.startsWith("analytics.") && "border-none bg-transparent shadow-none rounded-none p-0",
                        block.type?.startsWith("ai.") && "border-none bg-transparent shadow-none rounded-none p-0",
                        block.type?.startsWith("chart.") && "border-none bg-white shadow-none",
                        block.type?.startsWith("v3.") && "border-none bg-transparent shadow-none rounded-none p-0"
                      )}
                      onMouseEnter={() => setActiveControlPanel(item.i)}
                    >
                      {state.mode === "edit" && !isFrozen && (
                        <>
                          {/* Bottom-right corner: resize both width and height */}
                          <div
                            className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500/50 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity z-40"
                            onMouseDown={(e) => handleResizeStart(e, item.i, "se")}
                          />
                          {/* Right edge: resize width only */}
                          <div
                            className="absolute top-4 right-0 w-1 h-8 bg-blue-500/30 cursor-e-resize opacity-0 group-hover:opacity-100 transition-opacity z-40"
                            onMouseDown={(e) => handleResizeStart(e, item.i, "e")}
                          />
                          {/* Bottom edge: resize height only */}
                          <div
                            className="absolute bottom-0 left-4 w-8 h-1 bg-blue-500/30 cursor-s-resize opacity-0 group-hover:opacity-100 transition-opacity z-40"
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

                      {!(state.mode === "save" && (block.type?.startsWith("metric") || block.type?.startsWith("table") || block.type?.startsWith("construction.") || block.type?.startsWith("worksite.") || block.type?.startsWith("analytics.") || block.type?.startsWith("ai.") || block.type?.startsWith("chart.") || block.type?.startsWith("v3."))) && (
                        <CardHeader
                          className={cn(
                            "flex flex-row items-center justify-between space-y-0 border-b-2 px-4 h-8",
                            (block.type?.startsWith("metric") || block.type?.startsWith("table") || block.type?.startsWith("construction.") || block.type?.startsWith("worksite.") || block.type?.startsWith("analytics.") || block.type?.startsWith("ai.") || block.type?.startsWith("chart.") || block.type?.startsWith("v3.")) && "absolute -top-10 left-0 right-0 z-50 border border-slate-300 bg-white/95 backdrop-blur-sm rounded-t-lg shadow-lg h-auto px-2 py-1 transition-opacity duration-200 pointer-events-none",
                            (block.type?.startsWith("metric") || block.type?.startsWith("table") || block.type?.startsWith("construction.") || block.type?.startsWith("worksite.") || block.type?.startsWith("analytics.") || block.type?.startsWith("ai.") || block.type?.startsWith("chart.") || block.type?.startsWith("v3.")) && activeControlPanel === item.i ? "opacity-100" : "opacity-0"
                          )}
                        >
                          {!block.type?.startsWith("construction.") && !block.type?.startsWith("worksite.") && !block.type?.startsWith("analytics.") && !block.type?.startsWith("metric") && !block.type?.startsWith("ai.") && !block.type?.startsWith("chart.") && !block.type?.startsWith("v3.") && (
                            editingTitleId === item.i ? (
                              <input
                                value={titleInput}
                                onChange={(e) => setTitleInput(e.target.value)}
                                onBlur={commitEditTitle}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") commitEditTitle()
                                  if (e.key === "Escape") cancelEditTitle()
                                }}
                                className="flex-1 min-w-0 pr-2 text-sm font-medium bg-transparent outline-none border-b border-dashed border-transparent focus:border-muted-foreground/40"
                                autoFocus
                              />
                            ) : (
                              <h3
                                className={`font-medium text-sm truncate flex-1 min-w-0 pr-2 ${state.mode === "edit" && !isFrozen ? "cursor-text" : ""}`}
                                title={block.title}
                                onDoubleClick={() => beginEditTitle(item.i)}
                              >
                                {block.title}
                              </h3>
                            )
                          )}
                          {state.mode === "edit" && !isFrozen && (
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {/* Color Picker for Construction Metrics - Collapsible */}
                            {block.type?.startsWith("construction.metric") && (() => {
                              const colorMap: Record<string, string> = {
                                blue: 'bg-blue-500',
                                green: 'bg-green-500',
                                purple: 'bg-purple-500',
                                orange: 'bg-orange-500',
                                red: 'bg-red-500',
                                amber: 'bg-amber-500',
                                cyan: 'bg-cyan-500',
                                rose: 'bg-rose-500',
                              }
                              const colors = ['blue', 'green', 'purple', 'orange', 'red', 'amber', 'cyan', 'rose']
                              const activeColor = (block.props as any)?.color || 'blue'
                              const isExpanded = expandedColorPicker === item.i
                              
                              return (
                                <div className="flex items-center gap-1 border-r border-slate-300 pr-2">
                                  {/* Active color dot */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setExpandedColorPicker(isExpanded ? null : item.i)
                                    }}
                                    className={`w-5 h-5 rounded-full ${colorMap[activeColor]} ring-2 ring-slate-900 ring-offset-1 transition-all pointer-events-auto hover:scale-110`}
                                    title={`Color: ${activeColor} (click to ${isExpanded ? 'collapse' : 'expand'})`}
                                  />
                                  
                                  {/* Expand/collapse button */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setExpandedColorPicker(isExpanded ? null : item.i)
                                    }}
                                    className="w-4 h-4 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors pointer-events-auto"
                                    title={isExpanded ? 'Collapse' : 'Expand colors'}
                                  >
                                    <svg 
                                      className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                      fill="none" 
                                      stroke="currentColor" 
                                      viewBox="0 0 24 24"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </button>
                                  
                                  {/* All color options - only show when expanded */}
                                  {isExpanded && (
                                    <div className="flex items-center gap-1 ml-1 pl-1 border-l border-slate-300">
                                      {colors.filter(c => c !== activeColor).map((color) => (
                                        <button
                                          key={color}
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            setState(prev => ({
                                              ...prev,
                                              blocks: {
                                                ...prev.blocks,
                                                [item.i]: {
                                                  ...block,
                                                  props: {
                                                    ...block.props,
                                                    color
                                                  }
                                                }
                                              }
                                            }))
                                            setExpandedColorPicker(null) // Auto-collapse after selection
                                          }}
                                          className={`w-5 h-5 rounded-full ${colorMap[color]} transition-all pointer-events-auto hover:scale-110 hover:ring-2 hover:ring-slate-400 hover:ring-offset-1`}
                                          title={color}
                                        />
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )
                            })()}
                            {/* Refine Button (for AI-generated components) */}
                            {block.props?._aiGenerated && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className={`h-7 w-7 pointer-events-auto ${
                                  isFrozen ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-100'
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (!isFrozen) setRefiningBlock(item.i)
                                }}
                                title="Refine with AI"
                                disabled={isFrozen}
                              >
                                <Wand2Icon />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`h-7 w-7 pointer-events-auto ${
                                isFrozen ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-100'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation()
                                if (!isFrozen) handleOpenEditModal(block)
                              }}
                              title="Edit Block"
                              disabled={isFrozen}
                            >
                              <EditIcon />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`h-7 w-7 pointer-events-auto ${
                                isFrozen ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-100'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation()
                                !isFrozen && setActiveAiBlock(activeAiBlock === item.i ? null : item.i)
                              }}
                              title="AI Assistant"
                              disabled={isFrozen}
                            >
                              <BotIcon />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`h-7 w-7 pointer-events-auto ${
                                isFrozen ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-100'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation()
                                !isFrozen && extendBlock(item.i)
                              }}
                              title="Extend Block"
                              disabled={isFrozen}
                            >
                              <ExpandIcon />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`h-7 w-7 pointer-events-auto ${
                                isFrozen ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-100'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation()
                                !isFrozen && deleteBlock(item.i)
                              }}
                              title="Delete Block"
                              disabled={isFrozen}
                            >
                              <Trash2Icon />
                            </Button>
                          </div>
                          )}
                        </CardHeader>
                      )}
                      <CardContent
                        className={cn(
                          "flex flex-1 flex-col min-h-0 p-0",
                          block.type?.startsWith("metric") && "p-0",
                          block.type?.startsWith("table") && "p-0",
                          block.type?.startsWith("construction.") && "p-0",
                          block.type?.startsWith("worksite.") && "p-0",
                          block.type?.startsWith("analytics.") && "p-0",
                          block.type?.startsWith("items.") && "p-0",
                          block.type?.startsWith("ai.") && "p-0",
                          block.type?.startsWith("chart.") && "p-0",
                          block.type?.startsWith("v3.") && "p-0"
                        )}
                      >
                        {(() => {
                          const type = block.type || ""
                          const isMetric = type.startsWith("metric")
                          const isTable = type.startsWith("table")
                          const isConstruction = type.startsWith("construction.")
                          const isWorksite = type.startsWith("worksite.")
                          const isAnalytics = type.startsWith("analytics.")
                          const isItems = type.startsWith("items.")
                          const isMessages = type.startsWith("messages")
                          const allowScroll = isTable || isMessages || isItems

                          // Enhance AI input blocks with generation callback
                          const enhancedBlock = block.type === "ai.input" ? {
                            ...block,
                            props: {
                              ...block.props,
                              onGenerate: async (result: any) => {
                                console.log('🎯 [PageTemplate] onGenerate called with result:', result)
                                
                                try {
                                  // Use LLM-generated title (or fallback to suggested/prompt)
                                  const title = result.title || result.suggestedTitle || result.prompt
                                  console.log('📝 [PageTemplate] Component title:', title)
                                  console.log('🔧 [PageTemplate] Component type:', result.componentType)
                                  
                                  // Generate smart mock data based on data source
                                  let mockProps: any = {}
                                
                                const dataSource = result.dataSource
                                
                                // Generate data based on component type
                                if (result.componentType === 'v3.chart.area' || 
                                    result.componentType === 'v3.chart.bar') {
                                  const chartData = generateChartData(result.prompt, dataSource)
                                  mockProps = { data: chartData }
                                } else if (result.componentType === 'v3.chart.donut') {
                                  // For donut charts, transform the data for category distribution
                                  console.log('🍩 [Donut] Generating chart data...')
                                  const chartData = generateChartData(result.prompt, dataSource)
                                  console.log('🍩 [Donut] Raw chart data:', chartData)
                                  
                                  // Transform and validate
                                  const donutData = chartData.map((item: any) => ({
                                    name: item.date || 'Unknown',
                                    value: typeof item.value === 'number' ? item.value : 0
                                  }))
                                  
                                  // Validate no undefined values
                                  const hasInvalid = donutData.some(d => 
                                    d.name === undefined || d.value === undefined || isNaN(d.value)
                                  )
                                  
                                  if (hasInvalid) {
                                    console.error('❌ [Donut] Invalid data detected:', donutData)
                                    throw new Error('Donut data contains invalid values')
                                  }
                                  
                                  console.log('✅ [Donut] Validated data:', donutData)
                                  mockProps = { data: donutData }
                                } else if (result.componentType === 'v3.table') {
                                  const tableData = generateTableData(result.prompt, dataSource)
                                  // Transform to v3 table format (columns: string[], rows: string[][])
                                  mockProps = {
                                    columns: tableData.columns.map((col: any) => col.name),
                                    rows: tableData.data.map((row: any) => 
                                      tableData.columns.map((col: any) => {
                                        const value = row[col.id]
                                        if (value === null || value === undefined) return ''
                                        if (typeof value === 'number') return value.toLocaleString()
                                        return String(value)
                                      })
                                    )
                                  }
                                } else if (result.componentType === 'v3.activity.timeline') {
                                  mockProps = {
                                    activities: [
                                      { time: "2m", user: "John Doe", action: `Updated ${dataSource?.label || 'item'}`, status: "info" },
                                      { time: "5m", user: "Jane Smith", action: `Created new ${dataSource?.label || 'item'}`, status: "success" },
                                      { time: "10m", user: "Bob Johnson", action: `Modified ${dataSource?.label || 'item'}`, status: "warning" },
                                    ]
                                  }
                                } else if (result.componentType === 'v3.kpi') {
                                  const metricData = generateMetricData(result.prompt, dataSource)
                                  mockProps = {
                                    title: dataSource?.label || "Metric",
                                    value: metricData.value,
                                    change: metricData.delta,
                                    trend: "up",
                                    subtitle: "vs last month"
                                  }
                                } else if (result.componentType === 'v3.status.grid') {
                                  mockProps = {
                                    items: [
                                      { name: `${dataSource?.label || 'System'} A`, status: "online", value: "100%" },
                                      { name: `${dataSource?.label || 'System'} B`, status: "online", value: "98%" },
                                      { name: `${dataSource?.label || 'System'} C`, status: "warning", value: "75%" },
                                      { name: `${dataSource?.label || 'System'} D`, status: "online", value: "100%" },
                                    ]
                                  }
                                } else if (result.componentType === 'v3.progress.tracker') {
                                  mockProps = {
                                    tasks: [
                                      { name: `${dataSource?.label || 'Task'} - Phase 1`, completed: true, dueDate: "Mar 1" },
                                      { name: `${dataSource?.label || 'Task'} - Phase 2`, completed: true, dueDate: "Mar 15" },
                                      { name: `${dataSource?.label || 'Task'} - Phase 3`, completed: false, dueDate: "Mar 20" },
                                      { name: `${dataSource?.label || 'Task'} - Phase 4`, completed: false, dueDate: "Mar 25" },
                                    ]
                                  }
                                } else if (result.componentType === 'construction.metric.large') {
                                  const metricData = generateMetricData(result.prompt, dataSource)
                                  mockProps = {
                                    value: metricData.value,
                                    delta: metricData.delta,
                                    subtitle: "This month",
                                    trend: metricData.trend,
                                    color: "blue"
                                  }
                                } else if (result.componentType === 'v3.map.site') {
                                  // Generate default zones for site map
                                  mockProps = {
                                    zones: [
                                      { id: '1', name: `${dataSource?.label || 'Zone'} A`, x: 20, y: 25, status: 'active', value: '85%', count: 12 },
                                      { id: '2', name: `${dataSource?.label || 'Zone'} B`, x: 45, y: 30, status: 'success', value: '100%', count: 8 },
                                      { id: '3', name: `${dataSource?.label || 'Zone'} C`, x: 70, y: 35, status: 'warning', value: '65%', count: 15 },
                                      { id: '4', name: `${dataSource?.label || 'Zone'} D`, x: 35, y: 55, status: 'active', value: '78%', count: 10 },
                                      { id: '5', name: `${dataSource?.label || 'Zone'} E`, x: 60, y: 60, status: 'inactive', value: '0%', count: 0 },
                                      { id: '6', name: `${dataSource?.label || 'Zone'} F`, x: 80, y: 70, status: 'success', value: '95%', count: 6 },
                                    ]
                                  }
                                } else if (result.componentType === 'v3.heatmap') {
                                  // Detect type based on data source or keywords
                                  const isManufacturing = result.prompt.toLowerCase().includes('manufacturing') || 
                                                        result.prompt.toLowerCase().includes('production') ||
                                                        result.prompt.toLowerCase().includes('assembly') ||
                                                        dataSource?.type === 'products'
                                  const isConstruction = result.prompt.toLowerCase().includes('construction') || 
                                                       result.prompt.toLowerCase().includes('material') ||
                                                       result.prompt.toLowerCase().includes('building')
                                  
                                  mockProps = {
                                    type: isConstruction ? 'construction' : (isManufacturing ? 'manufacturing' : 'generic')
                                  }
                                } else if (result.componentType === 'v3.grid.pulse') {
                                  // Pulse grid uses auto-generated data
                                  mockProps = {
                                    rows: 8,
                                    cols: 12,
                                    animationSpeed: 2500
                                  }
                                } else if (result.componentType === 'v3.kanban') {
                                  // Kanban auto-generates default columns
                                  mockProps = {}
                                } else if (result.componentType === 'v3.calendar.heatmap') {
                                  // Calendar heatmap auto-generates activity data
                                  mockProps = {
                                    months: 6
                                  }
                                } else if (result.componentType === 'v3.counter.animated') {
                                  // Animated counter with data source-aware values
                                  const metricData = generateMetricData(result.prompt, dataSource)
                                  const numericValue = parseInt(metricData.value.replace(/[^0-9]/g, '')) || 1234
                                  const deltaValue = parseInt(metricData.delta.replace(/[^0-9]/g, '')) || 50
                                  
                                  mockProps = {
                                    value: numericValue,
                                    previousValue: numericValue - deltaValue,
                                    prefix: dataSource?.type === 'revenue' || dataSource?.type === 'sales' ? '$' : '',
                                    suffix: dataSource?.type === 'revenue' || dataSource?.type === 'sales' ? 'K' : '',
                                    subtitle: `${dataSource?.label || 'Total'} this month`,
                                    trend: 'up' as const,
                                    sparklineData: metricData.trend
                                  }
                                } else if (result.componentType === 'v3.chart.sankey') {
                                  // Sankey diagram auto-generates flow data
                                  mockProps = {}
                                } else if (result.componentType === 'v3.chart.radar') {
                                  // Radar chart auto-generates comparison data
                                  mockProps = {}
                                } else if (result.componentType === 'v3.graph.network') {
                                  // Network graph auto-generates relationship data
                                  mockProps = {}
                                } else if (result.componentType === 'v3.cards.3d') {
                                  // 3D card stack auto-generates card data
                                  mockProps = {}
                                } else if (result.componentType === 'v3.chart.sparkline') {
                                  // Sparkline auto-generates trend data
                                  mockProps = {}
                                } else if (result.componentType === 'v3.chart.wave') {
                                  // Wave chart auto-generates real-time data
                                  mockProps = {}
                                }

                                // Update the state directly with LLM config and metadata
                                console.log('💾 [PageTemplate] Creating block with props:', mockProps)
                                setState(prev => ({
                                  ...prev,
                                  blocks: {
                                    ...prev.blocks,
                                    [item.i]: {
                                      id: item.i,
                                      type: result.componentType,
                                      title,
                                      props: {
                                        ...mockProps,
                                        ...result.config, // Include LLM-generated config
                                        _aiGenerated: true,
                                        _aiReasoning: result.reasoning,
                                        _aiProvenance: result.provenance,
                                        _aiModel: result.model,
                                        _aiPrompt: result.prompt
                                      }
                                    }
                                  }
                                }))
                                console.log('✅ [PageTemplate] Block created successfully!')
                                
                                } catch (error) {
                                  console.error('❌ [PageTemplate] Error in onGenerate:', error)
                                  console.error('   Stack:', error instanceof Error ? error.stack : 'No stack')
                                  console.error('   Result that caused error:', result)
                                  alert(`Failed to generate component: ${error instanceof Error ? error.message : 'Unknown error'}`)
                                }
                              }
                            }
                          } : block

                          return (
                            <div
                              className={`${
                                isMetric || isTable || isConstruction || isWorksite || isAnalytics || isItems ? "p-0" : "p-4"
                              } flex-1 min-h-0 flex flex-col ${allowScroll ? "overflow-auto" : "overflow-hidden"} relative`}
                            >
                              <BlockRenderer block={enhancedBlock} showFilters={showFilters} />
                              
                              {/* Refinement Config Display (shows active filters/modifications) */}
                              <AnimatePresence>
                                {block.props?._aiRefinements && block.props._aiRefinements.length > 0 && showRefinementBadge[item.i] && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute bottom-2 left-2 right-2 p-2 bg-purple-50/95 backdrop-blur-sm border border-purple-200 rounded text-xs space-y-1 shadow-lg"
                                  >
                                    <div className="font-medium text-purple-900 flex items-center gap-1">
                                      <Wand2Icon />
                                      <span>AI Refinements Applied:</span>
                                    </div>
                                    {block.props._aiRefinements.slice(-2).map((ref: any, idx: number) => (
                                      <div key={idx} className="text-purple-700 pl-5">
                                        • {ref.prompt}
                                      </div>
                                    ))}
                                    {block.props._aiRefinements.length > 2 && (
                                      <div className="text-purple-600 pl-5 italic">
                                        +{block.props._aiRefinements.length - 2} more
                                      </div>
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              
                              {/* Refinement Input Overlay */}
                              <AnimatePresence>
                                {refiningBlock === item.i && (
                                  <ComponentRefinementInput
                                    blockId={item.i}
                                    currentComponent={{
                                      type: block.type,
                                      title: block.title,
                                      config: block.props || {}
                                    }}
                                    onRefine={(result) => handleComponentRefinement(item.i, result)}
                                    onCancel={() => setRefiningBlock(null)}
                                  />
                                )}
                              </AnimatePresence>
                            </div>
                          )
                        })()}

                        {block.extensions?.map((ext, i) => (
                          <div key={i}>
                            <hr className="my-4 border-2 border-dashed border-muted-foreground/25" />
                            <div className="space-y-2">
                              <h4 className="text-xs font-medium text-muted-foreground">{ext.title}</h4>
                              <BlockRenderer block={ext} showFilters={showFilters} />
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

      <BlockEditModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false)
          setEditingBlock(null)
        }}
        block={editingBlock}
        onReplace={handleReplaceBlock}
        onAddExtension={handleAddExtension}
      />
    </div>
  )
}
