"use client"

import { useState } from "react"
import Sidebar from "@/components/Sidebar"
import { SiteMapProvider, useSiteMap } from "./context/SiteMapContext"
import { ArchitecturalFloorPlan } from "./components/ArchitecturalFloorPlan"
import { SiteTableView } from "./components/SiteTableView"

function MapPageContent() {
  const { viewMode, setViewMode, siteMap, switchFloor, addFloor, deleteFloor, resetToDefault } = useSiteMap()
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [toolMode, setToolMode] = useState<"select" | "zone">("select")

  const currentFloor = siteMap.floors.find((f) => f.id === siteMap.activeFloorId)

  const handleAddFloor = () => {
    const newFloorNumber = siteMap.floors.length + 1
    const newFloor = {
      id: `floor-${Date.now()}`,
      name: `Floor ${newFloorNumber}`,
      level: newFloorNumber,
      gridState: {
        mode: "edit" as const,
        layout: [],
        blocks: {},
      },
      dimensions: { width: 100, height: 80 }, // Default dimensions
    }
    addFloor(newFloor)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        sidebarExpanded={sidebarExpanded}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with Groovy Logo */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/groovy-logo.png" alt="Groovy" className="h-8" />
              <div className="border-l border-gray-300 pl-4">
                <h1 className="text-xl font-bold text-gray-900">{siteMap.name}</h1>
                {siteMap.description && <p className="text-xs text-gray-500 mt-0.5">{siteMap.description}</p>}
              </div>
            </div>
            <button
              onClick={resetToDefault}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-colors"
            >
              Reset to Default
            </button>
          </div>
        </div>
        
                {/* Controls bar */}
                <div className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    {/* Left side - View mode toggle */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 border border-gray-300 rounded-lg overflow-hidden">
                        <button
                          onClick={() => setViewMode("map")}
                          className={`px-4 py-2 text-sm font-medium transition-colors ${
                            viewMode === "map" 
                              ? "bg-gray-900 text-white" 
                              : "bg-white text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          Map
                        </button>
                        <button
                          onClick={() => setViewMode("table")}
                          className={`px-4 py-2 text-sm font-medium transition-colors ${
                            viewMode === "table" 
                              ? "bg-gray-900 text-white" 
                              : "bg-white text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          Table
                        </button>
                      </div>
                    </div>

                    {/* Right side - Floor selector and tools (only in map view) */}
                    {viewMode === "map" && (
                      <div className="flex items-center gap-4">
                        {/* Tool Mode Selector */}
                        <div className="flex items-center gap-1 border border-gray-300 rounded-lg overflow-hidden">
                          <button
                            onClick={() => setToolMode("select")}
                            className={`px-4 py-2 text-sm font-medium transition-colors ${
                              toolMode === "select" 
                                ? "bg-gray-900 text-white" 
                                : "bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            Select
                          </button>
                          <button
                            onClick={() => setToolMode("zone")}
                            className={`px-4 py-2 text-sm font-medium transition-colors ${
                              toolMode === "zone" 
                                ? "bg-gray-900 text-white" 
                                : "bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            Draw Zones
                          </button>
                        </div>

                        <div className="h-6 w-px bg-gray-300" />

                        {/* Floor selector */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">Floor:</span>
                          <div className="relative">
                            <select
                              value={siteMap.activeFloorId}
                              onChange={(e) => {
                                if (e.target.value === "__add_new__") {
                                  handleAddFloor()
                                } else {
                                  switchFloor(e.target.value)
                                }
                              }}
                              className="px-4 py-2 pr-8 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer min-w-[180px]"
                            >
                              <option value="__add_new__" className="text-blue-600 font-semibold">
                                + Add New Floor
                              </option>
                              <option disabled>──────────</option>
                              {siteMap.floors.map((floor) => (
                                <option key={floor.id} value={floor.id}>
                                  {floor.name}
                                </option>
                              ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>

                          {/* Delete floor button (only if more than 1 floor) */}
                          {siteMap.floors.length > 1 && currentFloor && (
                            <button
                              onClick={() => {
                                if (confirm(`Delete ${currentFloor.name}? All elements on this floor will be removed.`)) {
                                  deleteFloor(currentFloor.id)
                                }
                              }}
                              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                            >
                              Delete Floor
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {viewMode === "map" ? <ArchitecturalFloorPlan toolMode={toolMode} /> : <SiteTableView />}
        </div>
      </div>
    </div>
  )
}

export default function MapPage() {
  return (
    <SiteMapProvider>
      <MapPageContent />
    </SiteMapProvider>
  )
}

