"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Workflow, Save, FolderOpen, Check, Lock, Unlock, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import { LayoutScaffold } from "@/components/grid-v2/LayoutScaffold"
import StageBlockWizard from "@/components/blocks/workflow-v2/StageBlockWizard"

type NodePosition = "top" | "right" | "bottom" | "left"

interface StageBlock {
  id: string
  position: { x: number; y: number }
  isConfigured: boolean
  data?: any
  isDragging: boolean
}

interface Connection {
  id: string
  from: string
  to: string
  fromNode: NodePosition
  toNode: NodePosition
  type: "sequential" | "conditional" | "parallel"
}

interface SavedWorkflow {
  id: string
  name: string
  blocks: StageBlock[]
  connections: Connection[]
  createdAt: string
  updatedAt: string
  isLocked: boolean
}

export default function WorkflowGridTest() {
  const router = useRouter()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [blocks, setBlocks] = useState<StageBlock[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [connectingFrom, setConnectingFrom] = useState<{ blockId: string; node: NodePosition } | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)
  
  // Workflow management
  const [workflowName, setWorkflowName] = useState("Untitled Workflow")
  const [workflowId, setWorkflowId] = useState<string | null>(null)
  const [isLocked, setIsLocked] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [savedWorkflows, setSavedWorkflows] = useState<SavedWorkflow[]>([])

  // Calculate next position with proper spacing
  const getNextPosition = () => {
    if (blocks.length === 0) return { x: 100, y: 100 }
    
    const cols = 3
    const stageWidth = 420
    const stageHeight = 600
    const gapX = 80
    const gapY = 80
    
    const col = blocks.length % cols
    const row = Math.floor(blocks.length / cols)
    
    return {
      x: 100 + col * (stageWidth + gapX),
      y: 100 + row * (stageHeight + gapY),
    }
  }

  // Load saved workflows from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("workflow-library")
    if (saved) {
      try {
        const workflows = JSON.parse(saved)
        setSavedWorkflows(workflows)
        
        // Check if we should auto-load a workflow from URL
        const params = new URLSearchParams(window.location.search)
        const loadId = params.get("load")
        if (loadId) {
          const workflow = workflows.find((w: SavedWorkflow) => w.id === loadId)
          if (workflow) {
            loadWorkflow(workflow)
          }
        }
      } catch (e) {
        console.error("Failed to load workflows:", e)
      }
    }
  }, [])

  const addNewStage = () => {
    if (isLocked) {
      alert("This workflow is locked. Unlock it to make changes.")
      return
    }
    const position = getNextPosition()
    const newBlock: StageBlock = {
      id: `stage-${Date.now()}`,
      position,
      isConfigured: false,
      isDragging: false,
    }
    setBlocks([...blocks, newBlock])
    setSelectedId(newBlock.id)
  }

  const handleComplete = (id: string, data: any) => {
    setBlocks(
      blocks.map((b) =>
        b.id === id ? { ...b, isConfigured: true, data } : b
      )
    )
  }

  const handleDelete = (id: string) => {
    if (isLocked) {
      alert("This workflow is locked. Unlock it to make changes.")
      return
    }
    setBlocks(blocks.filter((b) => b.id !== id))
    setConnections(connections.filter((c) => c.from !== id && c.to !== id))
    if (selectedId === id) setSelectedId(null)
  }

  // Workflow management functions
  const saveWorkflow = () => {
    if (blocks.length === 0) {
      alert("Add at least one stage before saving.")
      return
    }
    
    const workflow: SavedWorkflow = {
      id: workflowId || `wf-${Date.now()}`,
      name: workflowName,
      blocks,
      connections,
      createdAt: workflowId ? savedWorkflows.find((w) => w.id === workflowId)?.createdAt || new Date().toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isLocked,
    }
    
    const existing = savedWorkflows.filter((w) => w.id !== workflow.id)
    const updated = [...existing, workflow]
    setSavedWorkflows(updated)
    localStorage.setItem("workflow-library", JSON.stringify(updated))
    
    if (!workflowId) {
      setWorkflowId(workflow.id)
    }
    setLastSaved(new Date())
    alert(`"${workflowName}" saved successfully!`)
  }

  const loadWorkflow = (workflow: SavedWorkflow) => {
    setWorkflowId(workflow.id)
    setWorkflowName(workflow.name)
    setBlocks(workflow.blocks)
    setConnections(workflow.connections)
    setIsLocked(workflow.isLocked)
    setLastSaved(new Date(workflow.updatedAt))
  }

  const newWorkflow = () => {
    if (blocks.length > 0 && !confirm("Start new workflow? Unsaved changes will be lost.")) {
      return
    }
    setWorkflowId(null)
    setWorkflowName("Untitled Workflow")
    setBlocks([])
    setConnections([])
    setIsLocked(false)
    setLastSaved(null)
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const toggleLock = () => {
    if (!isLocked && blocks.length === 0) {
      alert("Add at least one stage before locking the workflow.")
      return
    }
    setIsLocked(!isLocked)
  }

  const handleDragStart = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const block = blocks.find((b) => b.id === id)
    if (!block) return

    const canvasRect = canvasRef.current?.getBoundingClientRect()
    if (!canvasRect) return

    setDragOffset({
      x: (e.clientX - canvasRect.left) / zoom - block.position.x,
      y: (e.clientY - canvasRect.top) / zoom - block.position.y,
    })
    setDraggedId(id)
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, isDragging: true } : b)))
  }

  const handleDragMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - panStart.x
      const deltaY = e.clientY - panStart.y
      setPan({ x: pan.x + deltaX, y: pan.y + deltaY })
      setPanStart({ x: e.clientX, y: e.clientY })
      return
    }

    if (!draggedId || !canvasRef.current) return

    const canvasRect = canvasRef.current.getBoundingClientRect()
    const newX = (e.clientX - canvasRect.left) / zoom - dragOffset.x
    const newY = (e.clientY - canvasRect.top) / zoom - dragOffset.y

    setBlocks(
      blocks.map((b) =>
        b.id === draggedId
          ? { ...b, position: { x: Math.max(0, newX), y: Math.max(0, newY) } }
          : b
      )
    )
  }

  const handleDragEnd = () => {
    if (isPanning) {
      setIsPanning(false)
    }
    if (draggedId) {
      setBlocks(blocks.map((b) => (b.id === draggedId ? { ...b, isDragging: false } : b)))
      setDraggedId(null)
    }
  }

  // Removed scroll zoom - was annoying during navigation

  const handleCanvasPanStart = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
      // Middle mouse or Shift+Click to pan
      setIsPanning(true)
      setPanStart({ x: e.clientX, y: e.clientY })
    }
  }

  // Get absolute position of a node on a block
  const getNodePosition = (blockId: string, node: NodePosition): { x: number; y: number } | null => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block) return null

    const blockWidth = 420
    const blockHeight = 580
    const nodeSize = 5

    let x = block.position.x
    let y = block.position.y

    switch (node) {
      case "top":
        return { x: x + blockWidth / 2, y: y }
      case "right":
        return { x: x + blockWidth, y: y + blockHeight / 2 }
      case "bottom":
        return { x: x + blockWidth / 2, y: y + blockHeight }
      case "left":
        return { x: x, y: y + blockHeight / 2 }
    }
  }

  // Handle node click to start or complete connection
  const handleNodeClick = (blockId: string, node: NodePosition, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!connectingFrom) {
      // Start connection
      setConnectingFrom({ blockId, node })
      console.log('Connection started from:', blockId, node)
    } else {
      // Complete connection (can't connect to same block)
      if (connectingFrom.blockId !== blockId) {
        const newConnection: Connection = {
          id: `conn-${Date.now()}`,
          from: connectingFrom.blockId,
          to: blockId,
          fromNode: connectingFrom.node,
          toNode: node,
          type: "sequential",
        }
        setConnections([...connections, newConnection])
        console.log('Connection created:', connectingFrom, '→', blockId, node)
      } else {
        console.log('Cannot connect to same block')
      }
      setConnectingFrom(null)
    }
  }

  // Generate SVG path with smart routing (orthogonal lines)
  const generatePath = (
    fromPos: { x: number; y: number },
    toPos: { x: number; y: number },
    fromNode: NodePosition,
    toNode: NodePosition
  ): string => {
    const offsetDistance = 40 // How far to extend from node before turning

    let startX = fromPos.x
    let startY = fromPos.y
    let endX = toPos.x
    let endY = toPos.y

    // Calculate offset points based on node direction
    let offset1X = startX
    let offset1Y = startY
    let offset2X = endX
    let offset2Y = endY

    // Offset from starting node
    switch (fromNode) {
      case "top":
        offset1Y = startY - offsetDistance
        break
      case "right":
        offset1X = startX + offsetDistance
        break
      case "bottom":
        offset1Y = startY + offsetDistance
        break
      case "left":
        offset1X = startX - offsetDistance
        break
    }

    // Offset to ending node
    switch (toNode) {
      case "top":
        offset2Y = endY - offsetDistance
        break
      case "right":
        offset2X = endX + offsetDistance
        break
      case "bottom":
        offset2Y = endY + offsetDistance
        break
      case "left":
        offset2X = endX - offsetDistance
        break
    }

    // Build path with rounded corners
    const midX = (offset1X + offset2X) / 2
    const midY = (offset1Y + offset2Y) / 2

    // Determine if we need vertical or horizontal mid-segment
    const isVerticalFirst = fromNode === "top" || fromNode === "bottom"
    const cornerRadius = 20

    if (isVerticalFirst) {
      // Vertical first, then horizontal, then vertical
      return `
        M ${startX} ${startY}
        L ${startX} ${offset1Y}
        L ${startX} ${midY}
        L ${endX} ${midY}
        L ${endX} ${offset2Y}
        L ${endX} ${endY}
      `
    } else {
      // Horizontal first, then vertical, then horizontal
      return `
        M ${startX} ${startY}
        L ${offset1X} ${startY}
        L ${midX} ${startY}
        L ${midX} ${endY}
        L ${offset2X} ${endY}
        L ${endX} ${endY}
      `
    }
  }

  return (
    <LayoutScaffold
      pageTitle="Workflow Builder"
      headerActions={
        <div className="flex items-center gap-3">
          {/* Status Badges */}
          {lastSaved && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700 font-medium">
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            </div>
          )}

          {isLocked && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
              <Lock className="h-4 w-4 text-amber-600" />
              <span className="text-sm text-amber-700 font-medium">Locked</span>
            </div>
          )}

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setZoom(Math.max(0.3, zoom - 0.1))}
              className="px-2 py-1 hover:bg-gray-200 rounded"
            >
              −
            </button>
            <span className="text-xs font-medium text-gray-700 min-w-[3rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(Math.min(2, zoom + 0.1))}
              className="px-2 py-1 hover:bg-gray-200 rounded"
            >
              +
            </button>
            <button
              onClick={() => {
                setZoom(1)
                setPan({ x: 0, y: 0 })
              }}
              className="px-2 py-1 hover:bg-gray-200 rounded text-xs"
            >
              Reset
            </button>
          </div>

          <Button onClick={addNewStage} className="bg-blue-600 hover:bg-blue-700" disabled={isLocked}>
            <Plus className="h-4 w-4 mr-2" />
            Add Stage
          </Button>
        </div>
      }
    >
      {/* Workflow Controls & Library Link */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 border rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between gap-6">
          {/* Left: Current Workflow Info */}
          <div className="flex items-start gap-4 flex-1">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <Workflow className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              {/* Editable Workflow Name */}
              <Input
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                placeholder="Workflow name"
                className="text-xl font-bold text-gray-900 mb-2 border-0 px-0 h-auto bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-white/50 rounded px-2 py-1 transition-colors"
                disabled={isLocked}
              />
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span><strong>{blocks.length}</strong> stages</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span><strong>{connections.length}</strong> connections</span>
                </div>
                {lastSaved && (
                  <div className="flex items-center gap-1.5 text-green-600">
                    <Check className="h-3.5 w-3.5" />
                    <span>Saved {lastSaved.toLocaleTimeString()}</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600">
                Add stages, configure each one (5-step wizard), and connect them to build your custom workflow.
              </p>
            </div>
          </div>

          {/* Right: Quick Actions */}
          <div className="flex flex-col gap-3 min-w-[280px]">
            <Button
              onClick={() => router.push("/workflows-library")}
              size="lg"
              variant="outline"
              className="w-full justify-start bg-white hover:bg-gray-50 border-2"
            >
              <FolderOpen className="h-5 w-5 mr-3" />
              <div className="text-left flex-1">
                <div className="font-semibold">Workflow Library</div>
                <div className="text-xs text-gray-500">{savedWorkflows.length} saved workflows</div>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </Button>

            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={saveWorkflow}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button
                onClick={toggleLock}
                size="sm"
                variant="outline"
                className={`bg-white ${isLocked ? "border-amber-300 text-amber-700" : ""}`}
              >
                {isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
              </Button>
              <Button
                onClick={newWorkflow}
                size="sm"
                variant="outline"
                className="bg-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                New
              </Button>
            </div>
          </div>
        </div>
      </div>


      {/* Canvas */}
      <div
        ref={canvasRef}
        className="relative min-h-[1000px] bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:32px_32px] rounded-2xl border-2 border-gray-200 overflow-hidden"
        style={{
          cursor: isPanning ? "grabbing" : "default",
          backgroundSize: `${32 * zoom}px ${32 * zoom}px`,
        }}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onMouseDown={handleCanvasPanStart}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setConnectingFrom(null)
          }
        }}
      >
        {/* Zoom/Pan Container */}
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
            width: "100%",
            minHeight: "1000px",
            position: "relative",
          }}
        >
        {/* SVG Layer for Connections */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          style={{ minHeight: "1000px" }}
        >
          <defs>
            {/* Gradient for pulse animation */}
            <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0">
                <animate
                  attributeName="stop-opacity"
                  values="0;1;0"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="50%" stopColor="#3B82F6" stopOpacity="1">
                <animate
                  attributeName="stop-opacity"
                  values="0;1;0"
                  dur="2s"
                  repeatCount="indefinite"
                  begin="0.5s"
                />
              </stop>
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0">
                <animate
                  attributeName="stop-opacity"
                  values="0;1;0"
                  dur="2s"
                  repeatCount="indefinite"
                  begin="1s"
                />
              </stop>
            </linearGradient>

            {/* Arrow marker */}
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="#3B82F6" />
            </marker>
          </defs>

          {/* Draw connections */}
          {connections.map((conn) => {
            const fromPos = getNodePosition(conn.from, conn.fromNode)
            const toPos = getNodePosition(conn.to, conn.toNode)

            if (!fromPos || !toPos) return null

            const path = generatePath(fromPos, toPos, conn.fromNode, conn.toNode)

            return (
              <g key={conn.id}>
                {/* Base path */}
                <path
                  d={path}
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  opacity="0.3"
                />
                {/* Animated pulse path */}
                <path
                  d={path}
                  fill="none"
                  stroke="url(#pulseGradient)"
                  strokeWidth="3"
                  markerEnd="url(#arrowhead)"
                  strokeLinecap="round"
                >
                  <animate
                    attributeName="stroke-dasharray"
                    values="0,1000;1000,0"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </path>
              </g>
            )
          })}

          {/* Preview line while connecting */}
          {connectingFrom && (
            <circle
              cx={getNodePosition(connectingFrom.blockId, connectingFrom.node)?.x || 0}
              cy={getNodePosition(connectingFrom.blockId, connectingFrom.node)?.y || 0}
              r="8"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              opacity="0.5"
            >
              <animate attributeName="r" values="8;12;8" dur="1s" repeatCount="indefinite" />
            </circle>
          )}
        </svg>

        {blocks.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm border max-w-md">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Workflow className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No stages yet</h3>
              <p className="text-sm text-gray-600 mb-4">
                Click "Add Stage" in the header to create your first workflow stage
              </p>
              <Button onClick={addNewStage} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add First Stage
              </Button>
            </div>
          </div>
        )}

        {blocks.map((block, index) => (
          <div
            key={block.id}
            className={`absolute ${block.isDragging ? "cursor-grabbing z-50" : "z-10"}`}
            style={{
              left: `${block.position.x}px`,
              top: `${block.position.y}px`,
              width: "420px",
            }}
          >
            {/* Drag Handle - positioned to avoid nodes */}
            <div
              className="absolute top-4 left-12 right-12 h-12 z-20 cursor-grab active:cursor-grabbing"
              onMouseDown={(e) => handleDragStart(e, block.id)}
              style={{ 
                pointerEvents: "auto",
                // Visual indicator (optional - can be removed)
                // backgroundColor: 'rgba(59, 130, 246, 0.1)',
                // borderRadius: '8px'
              }}
              title="Drag to move"
            />
            <StageBlockWizard
              id={block.id}
              stageNumber={index + 1}
              isConfigured={block.isConfigured}
              initialData={block.data}
              onComplete={(data) => handleComplete(block.id, data)}
              onDelete={() => handleDelete(block.id)}
              isSelected={selectedId === block.id}
              onSelect={() => setSelectedId(block.id)}
              onNodeClick={(node, e) => handleNodeClick(block.id, node, e)}
              isConnecting={!!connectingFrom}
              connectingNode={connectingFrom?.blockId === block.id ? connectingFrom.node : null}
            />
          </div>
        ))}
        </div>
      </div>

      {/* Info Panel */}
      <div className="fixed bottom-6 right-6 bg-white rounded-2xl shadow-lg border p-5 max-w-xs z-50">
        <h3 className="font-semibold text-sm text-gray-900 mb-3">Workflow Progress</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1.5">
              <span>Configured Stages</span>
              <span className="font-medium text-gray-900">
                {blocks.filter((b) => b.isConfigured).length} / {blocks.length}
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                style={{
                  width: `${
                    blocks.length > 0
                      ? (blocks.filter((b) => b.isConfigured).length / blocks.length) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          {blocks.length > 0 && (
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1.5">
                <span>Connections</span>
                <span className="font-medium text-gray-900">{connections.length}</span>
              </div>
            </div>
          )}

          {connectingFrom && (
            <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-700 font-medium">
                Click another node to connect
              </p>
            </div>
          )}

          {blocks.length > 0 && (
            <div className="pt-3 border-t space-y-1">
              <div className="text-xs text-gray-500">
                {connectingFrom
                  ? "Click a node on another stage to complete connection"
                  : "Click colored node to start connecting"}
              </div>
              <div className="text-xs text-gray-400">
                Use +/− buttons to zoom • Shift+drag to pan
              </div>
            </div>
          )}
        </div>
      </div>
    </LayoutScaffold>
  )
}
