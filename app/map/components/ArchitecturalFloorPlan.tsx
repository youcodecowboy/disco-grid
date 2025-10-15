"use client"

import { useState, useRef, useEffect, type MouseEvent } from "react"
import { useSiteMap } from "../context/SiteMapContext"
import { ZoneElementsDrawer } from "./ZoneElementsDrawer"

const CELL_SIZE = 40 // pixels per grid cell (5ft x 5ft)
const GRID_TO_FEET = 5 // each grid cell = 5ft

// Zone types with colors
const ZONE_TYPES = [
  { id: "production", name: "Production", color: "#3b82f6", icon: "🏭" },
  { id: "storage", name: "Storage", color: "#f59e0b", icon: "📦" },
  { id: "packing", name: "Packing", color: "#8b5cf6", icon: "📮" },
  { id: "office", name: "Office", color: "#10b981", icon: "🏢" },
  { id: "mixed", name: "Mixed Use", color: "#6b7280", icon: "🔄" },
  { id: "shipping", name: "Shipping/Receiving", color: "#ef4444", icon: "🚚" },
]

type ToolMode = "select" | "zone"

interface ArchitecturalFloorPlanProps {
  toolMode: ToolMode
}

export function ArchitecturalFloorPlan({ toolMode }: ArchitecturalFloorPlanProps) {
  const {
    siteMap,
    getCurrentFloor,
    updateFloorDimensions,
    paintZone,
    clearZones,
    getZoneGroups,
    selectZoneGroup,
    deleteZoneGroup,
  } = useSiteMap()
  const [selectedZoneGroupId, setSelectedZoneGroupId] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [showDimensionEditor, setShowDimensionEditor] = useState(false)
  const [selectedZoneType, setSelectedZoneType] = useState(ZONE_TYPES[0])
  const [isDrawingZone, setIsDrawingZone] = useState(false)
  const [zoneDrawStart, setZoneDrawStart] = useState<{ x: number; y: number } | null>(null)
  const [zoneDrawCurrent, setZoneDrawCurrent] = useState<{ x: number; y: number } | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const currentFloor = getCurrentFloor()
  if (!currentFloor) {
    return <div className="flex items-center justify-center h-full text-gray-500">No floor selected</div>
  }

  // Fallback for legacy data without dimensions
  const { width: floorWidth, height: floorHeight } = currentFloor.dimensions || { width: 100, height: 80 }
  const gridWidth = Math.ceil(floorWidth / GRID_TO_FEET)
  const gridHeight = Math.ceil(floorHeight / GRID_TO_FEET)
  const baseCanvasWidth = gridWidth * CELL_SIZE
  const baseCanvasHeight = gridHeight * CELL_SIZE
  
  // Calculate zoom to fit canvas in container
  const [fitZoom, setFitZoom] = useState(1)
  
  // Recalculate fit zoom when dimensions change or container resizes
  useEffect(() => {
    const calculateFitZoom = () => {
      if (!containerRef.current) return 1
      
      const containerRect = containerRef.current.getBoundingClientRect()
      const padding = 64 // 32px padding on each side
      const availableWidth = containerRect.width - padding
      const availableHeight = containerRect.height - padding
      
      const zoomX = availableWidth / baseCanvasWidth
      const zoomY = availableHeight / baseCanvasHeight
      
      // Use the smaller zoom to ensure it fits in both dimensions
      return Math.min(zoomX, zoomY, 1) // Cap at 1 so we don't zoom in by default
    }
    
    const updateFitZoom = () => {
      const newFitZoom = calculateFitZoom()
      setFitZoom(newFitZoom)
      setZoom(newFitZoom) // Reset to fit when dimensions change
    }
    
    // Update immediately and on window resize
    updateFitZoom()
    window.addEventListener("resize", updateFitZoom)
    return () => window.removeEventListener("resize", updateFitZoom)
  }, [baseCanvasWidth, baseCanvasHeight])
  
  // Apply zoom
  const canvasWidth = baseCanvasWidth * zoom
  const canvasHeight = baseCanvasHeight * zoom
  const cellSize = CELL_SIZE * zoom

  // Calculate square footage
  const squareFootage = floorWidth * floorHeight

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, fitZoom))
  const handleZoomReset = () => setZoom(fitZoom)

  const handleUpdateDimensions = (width: number, height: number) => {
    if (width && height && width >= 10 && height >= 10) {
      updateFloorDimensions(currentFloor.id, width, height)
      setShowDimensionEditor(false)
    }
  }

  // Get zones and zone groups for current floor
  const floorZones = siteMap.zones[currentFloor.id] || []
  const zoneGroups = getZoneGroups(currentFloor.id)
  const selectedZone = selectedZoneGroupId ? selectZoneGroup(currentFloor.id, selectedZoneGroupId) : null

  // Helper to convert canvas position to grid coordinates
  const canvasToGrid = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return null
    const rect = canvasRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    const gridX = Math.floor((x / canvasWidth) * gridWidth)
    const gridY = Math.floor((y / canvasHeight) * gridHeight)
    return { gridX, gridY }
  }

  // Zone drawing handlers (rectangle selection)
  const handleCanvasMouseDown = (e: MouseEvent) => {
    if (toolMode === "zone") {
      setIsDrawingZone(true)
      const coords = canvasToGrid(e.clientX, e.clientY)
      if (coords) {
        setZoneDrawStart({ x: coords.gridX, y: coords.gridY })
        setZoneDrawCurrent({ x: coords.gridX, y: coords.gridY })
      }
    }
  }

  const handleCanvasMouseMove = (e: MouseEvent) => {
    if (toolMode === "zone" && isDrawingZone && zoneDrawStart) {
      const coords = canvasToGrid(e.clientX, e.clientY)
      if (coords) {
        setZoneDrawCurrent({ x: coords.gridX, y: coords.gridY })
      }
    }
  }

  const handleCanvasMouseUp = () => {
    if (toolMode === "zone" && isDrawingZone && zoneDrawStart && zoneDrawCurrent) {
      // Create zone from rectangle
      const minX = Math.max(0, Math.min(zoneDrawStart.x, zoneDrawCurrent.x))
      const maxX = Math.min(gridWidth - 1, Math.max(zoneDrawStart.x, zoneDrawCurrent.x))
      const minY = Math.max(0, Math.min(zoneDrawStart.y, zoneDrawCurrent.y))
      const maxY = Math.min(gridHeight - 1, Math.max(zoneDrawStart.y, zoneDrawCurrent.y))

      const cells: { x: number; y: number }[] = []
      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          cells.push({ x, y })
        }
      }

      if (cells.length > 0) {
        paintZone(currentFloor.id, cells, selectedZoneType.id, selectedZoneType.color)
      }

      setZoneDrawStart(null)
      setZoneDrawCurrent(null)
    }
    
    setIsDrawingZone(false)
  }

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Canvas */}
      <div ref={containerRef} className="flex-1 overflow-auto p-8 flex items-center justify-center">
        <div
          ref={canvasRef}
          className={`relative bg-white shadow-lg border-2 border-gray-300 ${
            toolMode === "zone" ? "cursor-crosshair" : "cursor-default"
          }`}
          style={{ width: canvasWidth, height: canvasHeight }}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
        >
          {/* Grid background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
              `,
              backgroundSize: `${cellSize}px ${cellSize}px`,
            }}
          />

          {/* Grid labels */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Horizontal labels (top) */}
            {Array.from({ length: gridWidth + 1 }).map((_, i) => (
              <div
                key={`h-${i}`}
                className="absolute top-0 text-gray-400"
                style={{ 
                  left: i * cellSize - 10, 
                  top: -20,
                  fontSize: `${Math.max(10, 12 * zoom)}px`
                }}
              >
                {i * GRID_TO_FEET}'
              </div>
            ))}
            {/* Vertical labels (left) */}
            {Array.from({ length: gridHeight + 1 }).map((_, i) => (
              <div
                key={`v-${i}`}
                className="absolute left-0 text-gray-400"
                style={{ 
                  top: i * cellSize - 8, 
                  left: -30,
                  fontSize: `${Math.max(10, 12 * zoom)}px`
                }}
              >
                {i * GRID_TO_FEET}'
              </div>
            ))}
          </div>

          {/* Zone drawing preview */}
          {isDrawingZone && zoneDrawStart && zoneDrawCurrent && (
            <div
              className="absolute pointer-events-none"
              style={{
                left: (Math.min(zoneDrawStart.x, zoneDrawCurrent.x) / gridWidth) * canvasWidth,
                top: (Math.min(zoneDrawStart.y, zoneDrawCurrent.y) / gridHeight) * canvasHeight,
                width: (Math.abs(zoneDrawCurrent.x - zoneDrawStart.x) + 1) * cellSize,
                height: (Math.abs(zoneDrawCurrent.y - zoneDrawStart.y) + 1) * cellSize,
                backgroundColor: selectedZoneType.color,
                opacity: 0.3,
                border: `2px dashed ${selectedZoneType.color}`,
                borderRadius: "4px",
              }}
            />
          )}

          {/* Zone layer (colored cells) */}
          {floorZones.map((zone, idx) => {
            const isSelected = zone.zoneGroupId === selectedZoneGroupId
            return (
              <div
                key={`${zone.x}-${zone.y}-${idx}`}
                className={`absolute ${toolMode === "select" ? "cursor-pointer hover:opacity-70" : "pointer-events-none"}`}
                style={{
                  left: (zone.x / gridWidth) * canvasWidth,
                  top: (zone.y / gridHeight) * canvasHeight,
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: zone.zoneColor,
                  opacity: isSelected ? 0.7 : 0.4,
                  border: isSelected ? `2px solid ${zone.zoneColor}` : "none",
                  pointerEvents: toolMode === "select" ? "auto" : "none",
                }}
                onClick={(e) => {
                  if (toolMode === "select") {
                    e.stopPropagation()
                    // Open drawer to add elements to this zone
                    setSelectedZoneGroupId(zone.zoneGroupId)
                  }
                }}
              />
            )
          })}

          {/* Zone group labels */}
          {zoneGroups.map((group) => {
            // Calculate center of zone group
            const avgX = group.cells.reduce((sum, cell) => sum + cell.x, 0) / group.cells.length
            const avgY = group.cells.reduce((sum, cell) => sum + cell.y, 0) / group.cells.length
            const centerX = (avgX / gridWidth) * canvasWidth
            const centerY = (avgY / gridHeight) * canvasHeight
            const isSelected = group.id === selectedZoneGroupId

            return (
              <div
                key={group.id}
                className="absolute pointer-events-none"
                style={{
                  left: centerX,
                  top: centerY,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  className="px-2 py-1 rounded shadow-md font-bold text-white whitespace-nowrap"
                  style={{
                    backgroundColor: group.color,
                    fontSize: `${10 * zoom}px`,
                    border: isSelected ? "2px solid white" : "none",
                  }}
                >
                  {group.name}
                </div>
              </div>
            )
          })}

        </div>
      </div>

      {/* Floating Controls Overlay */}
      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
        {/* Left: Zone Type Selector (only in zone mode) */}
        {toolMode === "zone" && (
          <div className="flex items-center gap-2 bg-white shadow-lg rounded-lg border border-gray-200 px-4 py-2 pointer-events-auto">
            <span className="text-sm text-gray-600 font-medium">Zone Type:</span>
            <div className="flex gap-2">
              {ZONE_TYPES.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZoneType(zone)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedZoneType.id === zone.id
                      ? "ring-2 ring-gray-900 scale-105"
                      : "opacity-70 hover:opacity-100"
                  }`}
                  style={{
                    backgroundColor: zone.color,
                    color: "white",
                  }}
                  title={zone.name}
                >
                  {zone.icon} {zone.name}
                </button>
              ))}
            </div>
            {floorZones.length > 0 && (
              <button
                onClick={() => {
                  if (confirm(`Clear all zones on ${currentFloor.name}?`)) {
                    clearZones(currentFloor.id)
                    setSelectedZoneGroupId(null)
                  }
                }}
                className="ml-2 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-medium transition-colors"
              >
                Clear Zones
              </button>
            )}
          </div>
        )}

        {/* Right: Dimensions and Zoom */}
        <div className="ml-auto flex items-center gap-4">
          {/* Dimensions */}
          <div className="relative bg-white shadow-lg rounded-lg border border-gray-200 px-4 py-2 pointer-events-auto">
            <button
              onClick={() => setShowDimensionEditor(!showDimensionEditor)}
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors"
            >
              <span className="font-semibold text-gray-900">{floorWidth}' × {floorHeight}'</span>
              <span className="text-xs text-gray-400">({squareFootage.toLocaleString()} sq ft)</span>
            </button>
            
            {/* Dimension Editor */}
            {showDimensionEditor && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowDimensionEditor(false)} />
                <div className="absolute bottom-full left-0 mb-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-20 p-4">
                  <div className="text-sm font-semibold text-gray-900 mb-3">Floor Dimensions</div>
                  <DimensionEditor
                    width={floorWidth}
                    height={floorHeight}
                    onSave={handleUpdateDimensions}
                    onCancel={() => setShowDimensionEditor(false)}
                  />
                </div>
              </>
            )}
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-white shadow-lg rounded-lg border border-gray-200 pointer-events-auto">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= fitZoom}
              className="px-3 py-2 hover:bg-gray-50 disabled:opacity-30 text-gray-700 rounded-l-lg text-sm font-medium transition-colors"
            >
              −
            </button>
            <button
              onClick={handleZoomReset}
              className="px-3 py-2 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors min-w-[80px] border-x border-gray-200"
              title="Reset to fit screen"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="px-3 py-2 hover:bg-gray-50 disabled:opacity-30 text-gray-700 rounded-r-lg text-sm font-medium transition-colors"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Zone Elements Drawer */}
      <ZoneElementsDrawer zone={selectedZone || null} onClose={() => setSelectedZoneGroupId(null)} />
    </div>
  )
}

// Dimension Editor Component
function DimensionEditor({
  width,
  height,
  onSave,
  onCancel,
}: {
  width: number
  height: number
  onSave: (width: number, height: number) => void
  onCancel: () => void
}) {
  const [newWidth, setNewWidth] = useState(width)
  const [newHeight, setNewHeight] = useState(height)

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Width (feet)</label>
        <input
          type="number"
          value={newWidth}
          onChange={(e) => setNewWidth(Number(e.target.value))}
          min="10"
          max="1000"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Height (feet)</label>
        <input
          type="number"
          value={newHeight}
          onChange={(e) => setNewHeight(Number(e.target.value))}
          min="10"
          max="1000"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="text-xs text-gray-500">
        Area: {(newWidth * newHeight).toLocaleString()} sq ft
      </div>
      <div className="flex gap-2 pt-2">
        <button
          onClick={() => onSave(newWidth, newHeight)}
          className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

