"use client"

import type React from "react"
import { useState } from "react"
import { X } from "lucide-react"

interface ScannedItem {
  id: string
  name: string
  type: string
  gps: { lat: number; lng: number }
  gridX: number
  gridY: number
  color: string
  scanTime: string
  quantity?: number
  zone?: string
  status?: "in-transit" | "delivered" | "installed"
  scannedBy?: string
}

interface SiteMapGridProps {
  title?: string
  data?: {
    items: ScannedItem[]
  }
}

export default function SiteMapGrid({ title, data }: SiteMapGridProps) {
  const [hoveredItem, setHoveredItem] = useState<ScannedItem | null>(null)
  const [selectedItem, setSelectedItem] = useState<ScannedItem | null>(null)
  
  // Default sample data - construction site with full details
  const defaultItems: ScannedItem[] = [
    // Steel beams - cyan
    { id: "s1", name: "Steel Beam #247", type: "Steel", gps: { lat: 40.7580, lng: -73.9855 }, gridX: 5, gridY: 3, color: "cyan", scanTime: "2m ago", quantity: 12, zone: "Zone C", status: "delivered", scannedBy: "Mike R." },
    { id: "s2", name: "Steel Beam #248", type: "Steel", gps: { lat: 40.7581, lng: -73.9856 }, gridX: 6, gridY: 3, color: "cyan", scanTime: "2m ago", quantity: 8, zone: "Zone C", status: "installed", scannedBy: "Mike R." },
    { id: "s3", name: "Steel Beam #249", type: "Steel", gps: { lat: 40.7582, lng: -73.9857 }, gridX: 7, gridY: 3, color: "cyan", scanTime: "3m ago", quantity: 15, zone: "Zone C", status: "delivered", scannedBy: "Sarah K." },
    { id: "s4", name: "Steel Beam #250", type: "Steel", gps: { lat: 40.7583, lng: -73.9858 }, gridX: 8, gridY: 3, color: "cyan", scanTime: "5m ago", quantity: 10, zone: "Zone C", status: "delivered", scannedBy: "Mike R." },
    
    // Electrical - blue
    { id: "e1", name: "Conduit Box A-12", type: "Electrical", gps: { lat: 40.7590, lng: -73.9860 }, gridX: 3, gridY: 8, color: "blue", scanTime: "1m ago", quantity: 45, zone: "Zone A", status: "installed", scannedBy: "Jane S." },
    { id: "e2", name: "Conduit Box A-13", type: "Electrical", gps: { lat: 40.7591, lng: -73.9861 }, gridX: 4, gridY: 8, color: "blue", scanTime: "1m ago", quantity: 30, zone: "Zone A", status: "delivered", scannedBy: "Jane S." },
    { id: "e3", name: "Wire Spool #45", type: "Electrical", gps: { lat: 40.7592, lng: -73.9862 }, gridX: 10, gridY: 7, color: "blue", scanTime: "8m ago", quantity: 500, zone: "Zone A", status: "delivered", scannedBy: "Tom H." },
    { id: "e4", name: "Wire Spool #46", type: "Electrical", gps: { lat: 40.7593, lng: -73.9863 }, gridX: 11, gridY: 7, color: "blue", scanTime: "9m ago", quantity: 350, zone: "Zone A", status: "in-transit", scannedBy: "Admin" },
    
    // Concrete - green
    { id: "c1", name: "Concrete Block Pallet", type: "Concrete", gps: { lat: 40.7595, lng: -73.9865 }, gridX: 15, gridY: 4, color: "green", scanTime: "12m ago", quantity: 200, zone: "Zone B", status: "delivered", scannedBy: "Carlos M." },
    { id: "c2", name: "Cement Bags (50)", type: "Concrete", gps: { lat: 40.7596, lng: -73.9866 }, gridX: 16, gridY: 4, color: "green", scanTime: "15m ago", quantity: 50, zone: "Zone B", status: "delivered", scannedBy: "Carlos M." },
    { id: "c3", name: "Concrete Block Pallet", type: "Concrete", gps: { lat: 40.7597, lng: -73.9867 }, gridX: 15, gridY: 5, color: "green", scanTime: "18m ago", quantity: 150, zone: "Zone B", status: "installed", scannedBy: "David P." },
    { id: "c4", name: "Mixing Equipment", type: "Concrete", gps: { lat: 40.7598, lng: -73.9868 }, gridX: 17, gridY: 5, color: "green", scanTime: "20m ago", quantity: 1, zone: "Zone B", status: "delivered", scannedBy: "Carlos M." },
    
    // Rebar - orange
    { id: "r1", name: "Rebar Bundle #12", type: "Rebar", gps: { lat: 40.7575, lng: -73.9850 }, gridX: 2, gridY: 2, color: "orange", scanTime: "4m ago", quantity: 25, zone: "Zone D", status: "delivered", scannedBy: "Lisa W." },
    { id: "r2", name: "Rebar Bundle #13", type: "Rebar", gps: { lat: 40.7576, lng: -73.9851 }, gridX: 3, gridY: 2, color: "orange", scanTime: "4m ago", quantity: 20, zone: "Zone D", status: "installed", scannedBy: "Lisa W." },
    { id: "r3", name: "Rebar Bundle #14", type: "Rebar", gps: { lat: 40.7577, lng: -73.9852 }, gridX: 2, gridY: 3, color: "orange", scanTime: "6m ago", quantity: 30, zone: "Zone D", status: "delivered", scannedBy: "John D." },
    
    // Lumber - amber
    { id: "l1", name: "Wood Planks (100)", type: "Lumber", gps: { lat: 40.7600, lng: -73.9870 }, gridX: 12, gridY: 10, color: "amber", scanTime: "25m ago", quantity: 100, zone: "Zone E", status: "delivered", scannedBy: "Alex B." },
    { id: "l2", name: "Plywood Sheets", type: "Lumber", gps: { lat: 40.7601, lng: -73.9871 }, gridX: 13, gridY: 10, color: "amber", scanTime: "28m ago", quantity: 75, zone: "Zone E", status: "delivered", scannedBy: "Alex B." },
    { id: "l3", name: "2x4 Studs", type: "Lumber", gps: { lat: 40.7602, lng: -73.9872 }, gridX: 14, gridY: 10, color: "amber", scanTime: "30m ago", quantity: 200, zone: "Zone E", status: "installed", scannedBy: "Rachel F." },
    
    // Insulation - purple
    { id: "i1", name: "Insulation Roll", type: "Insulation", gps: { lat: 40.7585, lng: -73.9875 }, gridX: 8, gridY: 12, color: "purple", scanTime: "10m ago", quantity: 40, zone: "Zone F", status: "delivered", scannedBy: "Nina P." },
    { id: "i2", name: "Insulation Roll", type: "Insulation", gps: { lat: 40.7586, lng: -73.9876 }, gridX: 9, gridY: 12, color: "purple", scanTime: "11m ago", quantity: 35, zone: "Zone F", status: "installed", scannedBy: "Nina P." },
    
    // Roofing - rose
    { id: "ro1", name: "Roofing Tiles Box", type: "Roofing", gps: { lat: 40.7570, lng: -73.9845 }, gridX: 5, gridY: 14, color: "rose", scanTime: "35m ago", quantity: 120, zone: "Zone G", status: "delivered", scannedBy: "Mark T." },
    { id: "ro2", name: "Shingles Pallet", type: "Roofing", gps: { lat: 40.7571, lng: -73.9846 }, gridX: 6, gridY: 14, color: "rose", scanTime: "40m ago", quantity: 80, zone: "Zone G", status: "in-transit", scannedBy: "Admin" },
  ]

  const items = data?.items || defaultItems

  // Create 20x15 grid
  const GRID_COLS = 20
  const GRID_ROWS = 15

  // Color mapping - vibrant colors for light mode
  const colorClasses = {
    cyan: "bg-cyan-500 shadow-cyan-500/40",
    blue: "bg-blue-500 shadow-blue-500/40",
    green: "bg-green-500 shadow-green-500/40",
    orange: "bg-orange-500 shadow-orange-500/40",
    amber: "bg-amber-500 shadow-amber-500/40",
    purple: "bg-purple-500 shadow-purple-500/40",
    rose: "bg-rose-500 shadow-rose-500/40",
  }

  // Create a map of grid positions to items
  const gridMap = new Map<string, ScannedItem[]>()
  items.forEach(item => {
    const key = `${item.gridX}-${item.gridY}`
    if (!gridMap.has(key)) {
      gridMap.set(key, [])
    }
    gridMap.get(key)?.push(item)
  })

  // Material type legend
  const legend = [
    { type: "Steel", color: "cyan", count: items.filter(i => i.type === "Steel").length },
    { type: "Electrical", color: "blue", count: items.filter(i => i.type === "Electrical").length },
    { type: "Concrete", color: "green", count: items.filter(i => i.type === "Concrete").length },
    { type: "Rebar", color: "orange", count: items.filter(i => i.type === "Rebar").length },
    { type: "Lumber", color: "amber", count: items.filter(i => i.type === "Lumber").length },
    { type: "Insulation", color: "purple", count: items.filter(i => i.type === "Insulation").length },
    { type: "Roofing", color: "rose", count: items.filter(i => i.type === "Roofing").length },
  ].filter(l => l.count > 0)

  const statusColors = {
    "in-transit": "bg-blue-100 text-blue-700 border-blue-300",
    "delivered": "bg-green-100 text-green-700 border-green-300",
    "installed": "bg-slate-100 text-slate-700 border-slate-300",
  }

  return (
    <div className="h-full w-full bg-slate-50 border-2 border-slate-200 rounded-xl flex overflow-hidden relative shadow-sm">
      {/* Main Map Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Construction Site Blueprint Map */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/construction-site-map.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.25,
          }}
        />
        
        {/* Overlay tint for better contrast with dots */}
        <div className="absolute inset-0 bg-white/20" />

        {/* Header */}
        <div className="relative z-10 px-2 py-1.5 sm:px-3 sm:py-2 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider">
              📍 {title || "Manhattan Construction Site"}
            </h3>
            <span className="text-[8px] sm:text-[10px] text-slate-500 font-mono">
              {items.length} ITEMS • LIVE
            </span>
          </div>
        </div>

        {/* Grid Map */}
        <div className="flex-1 min-h-0 relative p-1 sm:p-2">
          <div className="h-full w-full grid gap-0" style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`, gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)` }}>
            {Array.from({ length: GRID_ROWS }).map((_, row) =>
              Array.from({ length: GRID_COLS }).map((_, col) => {
                const key = `${col}-${row}`
                const cellItems = gridMap.get(key) || []
                const hasItems = cellItems.length > 0
                const firstItem = cellItems[0]

                return (
                  <div
                    key={key}
                    className="relative flex items-center justify-center group"
                    onMouseEnter={() => firstItem && setHoveredItem(firstItem)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={() => firstItem && setSelectedItem(firstItem)}
                  >
                    {hasItems && (
                      <>
                        {/* Glowing Dot - clickable */}
                        <button
                          className={`
                            w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 rounded-full
                            ${colorClasses[firstItem.color as keyof typeof colorClasses]}
                            shadow-lg animate-pulse
                            group-hover:scale-150 hover:ring-2 hover:ring-white/80
                            transition-all duration-200 cursor-pointer
                            ${selectedItem?.id === firstItem.id ? 'ring-2 ring-slate-900 scale-150' : ''}
                          `}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedItem(firstItem)
                          }}
                        />
                        
                        {/* Item count badge */}
                        {cellItems.length > 1 && (
                          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white/90 rounded-full flex items-center justify-center pointer-events-none">
                            <span className="text-[6px] sm:text-[7px] font-bold text-slate-900">{cellItems.length}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )
              })
            )}
          </div>

          {/* Hover Tooltip - Fixed positioning at top */}
          {hoveredItem && !selectedItem && (
            <div className="absolute top-2 left-2 right-2 bg-white/95 border-2 border-slate-300 rounded-lg p-2 backdrop-blur-sm shadow-xl pointer-events-none z-20">
              <div className="flex items-start gap-2">
                <div className={`w-2 h-2 sm:w-3 sm:h-3 mt-0.5 rounded-full ${colorClasses[hoveredItem.color as keyof typeof colorClasses]} shadow-lg flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <h4 className="text-[10px] sm:text-xs font-bold text-slate-900 truncate">{hoveredItem.name}</h4>
                  <p className="text-[8px] sm:text-[10px] text-slate-600 font-mono">
                    {hoveredItem.gps.lat.toFixed(4)}, {hoveredItem.gps.lng.toFixed(4)}
                  </p>
                </div>
                <span className="text-[8px] text-slate-500">Click for details</span>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="relative z-10 px-2 py-1.5 sm:px-3 sm:py-2 border-t border-slate-200 bg-white/90 backdrop-blur-sm">
          <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1">
            {legend.map(({ type, color, count }) => (
              <div key={type} className="flex items-center gap-1">
                <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${colorClasses[color as keyof typeof colorClasses]} shadow-sm`} />
                <span className="text-[8px] sm:text-[10px] text-slate-700 font-medium">{type}</span>
                <span className="text-[8px] sm:text-[10px] text-slate-500">({count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Panel - Slides in from right */}
      {selectedItem && (
        <div className="w-64 border-l-2 border-slate-300 bg-white flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
          {/* Panel Header */}
          <div className="px-3 py-2 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 uppercase">Item Details</h4>
            <button
              onClick={() => setSelectedItem(null)}
              className="p-1 hover:bg-slate-200 rounded transition-colors"
            >
              <X className="w-3 h-3 text-slate-600" />
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-auto p-3 space-y-3">
            {/* Item Name */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${colorClasses[selectedItem.color as keyof typeof colorClasses]} shadow-md`} />
                <h5 className="text-sm font-bold text-slate-900">{selectedItem.name}</h5>
              </div>
              <div className={`inline-block px-2 py-1 rounded-full text-[10px] font-medium border ${statusColors[selectedItem.status || "delivered"]}`}>
                {selectedItem.status?.toUpperCase()}
              </div>
            </div>

            {/* Details Grid */}
            <div className="space-y-2">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span className="text-[10px] text-slate-500 font-medium">Type</span>
                <span className="text-[10px] text-slate-900 font-semibold">{selectedItem.type}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span className="text-[10px] text-slate-500 font-medium">Quantity</span>
                <span className="text-[10px] text-slate-900 font-semibold">{selectedItem.quantity || "N/A"} units</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span className="text-[10px] text-slate-500 font-medium">Zone</span>
                <span className="text-[10px] text-slate-900 font-semibold">{selectedItem.zone || "Unknown"}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span className="text-[10px] text-slate-500 font-medium">Scanned By</span>
                <span className="text-[10px] text-slate-900 font-semibold">{selectedItem.scannedBy || "Unknown"}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span className="text-[10px] text-slate-500 font-medium">Last Scan</span>
                <span className="text-[10px] text-slate-900 font-semibold">{selectedItem.scanTime}</span>
              </div>
            </div>

            {/* GPS Coordinates */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2">
              <div className="text-[9px] text-slate-500 font-medium mb-1 uppercase">GPS Coordinates</div>
              <div className="font-mono text-[10px] text-slate-700">
                Lat: {selectedItem.gps.lat.toFixed(6)}<br />
                Lng: {selectedItem.gps.lng.toFixed(6)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-1.5 pt-2">
              <button className="w-full px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-semibold rounded transition-colors">
                View Full History
              </button>
              <button className="w-full px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold rounded transition-colors">
                Print Label
              </button>
              <button className="w-full px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold rounded transition-colors">
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
