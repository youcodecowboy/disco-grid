"use client"

import type React from "react"
import { useState } from "react"

interface ZoneData {
  id: string
  name: string
  color: string
  materials: {
    steel?: number
    concrete?: number
    electrical?: number
    rebar?: number
    installed?: number
  }
  status: "active" | "warning" | "normal"
}

const zones: ZoneData[] = [
  {
    id: "zone-a",
    name: "Zone A",
    color: "#3b82f6",
    materials: { electrical: 250 },
    status: "active",
  },
  {
    id: "zone-b",
    name: "Zone B",
    color: "#6b7280",
    materials: { concrete: 500 },
    status: "active",
  },
  {
    id: "zone-c",
    name: "Zone C",
    color: "#3b82f6",
    materials: { steel: 100, installed: 76 },
    status: "active",
  },
  {
    id: "zone-d",
    name: "Zone D",
    color: "#ef4444",
    materials: { rebar: 45 },
    status: "warning",
  },
  {
    id: "zone-e",
    name: "Zone E",
    color: "#8b5cf6",
    materials: {},
    status: "normal",
  },
]

export default function SiteMapBlock() {
  const [selectedZone, setSelectedZone] = useState<string | null>(null)

  return (
    <div className="h-full w-full bg-slate-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-slate-800 border-b border-slate-700 flex-shrink-0">
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-white">
          Live Site Map
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Click zones to view details
        </p>
      </div>

      {/* Main Grid - 2 columns on larger screens */}
      <div className="flex-1 min-h-0 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-5 gap-4 overflow-auto">
        {/* Zone Cards */}
        {zones.map((zone) => (
          <div
            key={zone.id}
            onClick={() => setSelectedZone(zone.id === selectedZone ? null : zone.id)}
            className={`
              relative bg-slate-800 rounded-lg border-2 p-4 cursor-pointer
              transition-all duration-200 hover:scale-105
              ${selectedZone === zone.id ? "ring-4 ring-blue-500 scale-105" : ""}
              ${zone.status === "active" ? "border-green-500" : zone.status === "warning" ? "border-amber-500" : "border-slate-600"}
            `}
            style={{
              borderColor: zone.status === "active" ? "#10b981" : zone.status === "warning" ? "#f59e0b" : "#64748b"
            }}
          >
            {/* Status Indicator */}
            <div className="absolute top-2 right-2">
              <div
                className={`
                  w-3 h-3 rounded-full
                  ${zone.status === "active" ? "bg-green-500 animate-pulse" : zone.status === "warning" ? "bg-amber-500 animate-pulse" : "bg-slate-500"}
                `}
              />
            </div>

            {/* Zone Name */}
            <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3">
              {zone.name}
            </h4>

            {/* Materials List */}
            <div className="space-y-2">
              {zone.materials.steel !== undefined && (
                <div className="bg-blue-900/50 rounded p-2">
                  <div className="text-xs text-blue-300">Steel Pipes</div>
                  <div className="text-xl sm:text-2xl font-bold text-white">
                    {zone.materials.steel}
                    {zone.materials.installed !== undefined && (
                      <span className="text-sm text-green-400 ml-2">
                        ({zone.materials.installed} installed)
                      </span>
                    )}
                  </div>
                </div>
              )}
              {zone.materials.concrete !== undefined && (
                <div className="bg-gray-900/50 rounded p-2">
                  <div className="text-xs text-gray-300">Concrete Blocks</div>
                  <div className="text-xl sm:text-2xl font-bold text-white">
                    {zone.materials.concrete}
                  </div>
                </div>
              )}
              {zone.materials.electrical !== undefined && (
                <div className="bg-amber-900/50 rounded p-2">
                  <div className="text-xs text-amber-300">Electrical</div>
                  <div className="text-xl sm:text-2xl font-bold text-white">
                    {zone.materials.electrical}
                  </div>
                </div>
              )}
              {zone.materials.rebar !== undefined && (
                <div className="bg-red-900/50 rounded p-2">
                  <div className="text-xs text-red-300">Rebar Bundles</div>
                  <div className="text-xl sm:text-2xl font-bold text-white">
                    {zone.materials.rebar}
                  </div>
                </div>
              )}
              {Object.keys(zone.materials).length === 0 && (
                <div className="bg-slate-700/50 rounded p-2">
                  <div className="text-xs text-slate-400">No materials</div>
                  <div className="text-lg text-slate-500">Available</div>
                </div>
              )}
            </div>

            {/* Location Type */}
            <div className="mt-3 pt-3 border-t border-slate-700">
              <div className="text-[10px] sm:text-xs text-slate-400">
                {zone.id === "zone-a" && "Main Building"}
                {zone.id === "zone-b" && "Storage Yard"}
                {zone.id === "zone-c" && "Fabrication Area"}
                {zone.id === "zone-d" && "East Lot"}
                {zone.id === "zone-e" && "North Storage"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer with Gates */}
      <div className="p-4 bg-slate-800 border-t border-slate-700 flex-shrink-0">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="text-slate-300">Gate B Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-slate-600" />
              <span className="text-slate-400">Gate A Standby</span>
            </div>
          </div>
          <div className="text-slate-400">
            {selectedZone ? `Selected: ${zones.find(z => z.id === selectedZone)?.name}` : "Click zone to select"}
          </div>
        </div>
      </div>
    </div>
  )
}