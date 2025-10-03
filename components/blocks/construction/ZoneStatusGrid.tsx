"use client"

import type React from "react"
import { useState } from "react"

interface Zone {
  id: string
  name: string
  materials: string[]
  count: number
  status: "active" | "warning" | "idle"
  lastScan: string
}

interface ZoneStatusGridProps {
  title?: string
  data?: {
    zones: Zone[]
  }
}

export default function ZoneStatusGrid({ title, data }: ZoneStatusGridProps) {
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  
  const zones: Zone[] = data?.zones || [
    { id: "a", name: "Zone A", materials: ["Electrical"], count: 250, status: "active", lastScan: "2m" },
    { id: "b", name: "Zone B", materials: ["Concrete"], count: 500, status: "active", lastScan: "5m" },
    { id: "c", name: "Zone C", materials: ["Steel"], count: 100, status: "active", lastScan: "1m" },
    { id: "d", name: "Zone D", materials: ["Rebar"], count: 45, status: "warning", lastScan: "15m" },
  ]

  const getStatusGradient = (status: string) => {
    switch (status) {
      case "active": return "from-emerald-500 to-green-600"
      case "warning": return "from-orange-500 to-amber-600"
      case "idle": return "from-slate-400 to-slate-500"
      default: return "from-slate-400 to-slate-500"
    }
  }

  return (
    <div className="h-full w-full bg-slate-900 p-3 sm:p-4 md:p-6 flex flex-col overflow-hidden gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide">
          {title || "Live Zones"}
        </h3>
        <span className="text-[10px] sm:text-xs text-slate-400 font-medium">
          {zones.filter(z => z.status === "active").length} Active
        </span>
      </div>

      {/* Zone Grid */}
      <div className="flex-1 min-h-0 grid grid-cols-2 gap-2 sm:gap-3">
        {zones.map((zone) => (
          <button
            key={zone.id}
            onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
            className={`
              relative bg-gradient-to-br ${getStatusGradient(zone.status)} rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4
              transition-all duration-200 hover:scale-105 cursor-pointer
              ${selectedZone === zone.id ? "ring-2 ring-white/30 scale-105" : ""}
            `}
          >
            {/* Status Dot */}
            <div className="absolute top-2 right-2">
              <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/90 ${zone.status === "active" ? "animate-pulse" : ""}`} />
            </div>

            {/* Zone Info */}
            <div className="text-left space-y-1 sm:space-y-2">
              <h4 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white truncate">
                {zone.name}
              </h4>
              <p className="text-[10px] sm:text-xs text-white/70 truncate">
                {zone.materials[0]}
              </p>
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                {zone.count}
              </div>
              <div className="text-[8px] sm:text-[10px] text-white/60">
                {zone.lastScan}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] sm:text-xs border-t border-white/10 pt-2 sm:pt-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-slate-300">Active</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-orange-500" />
            <span className="text-slate-300">Alert</span>
          </div>
        </div>
        <span className="text-slate-400 text-[10px]">
          {selectedZone ? `${zones.find(z => z.id === selectedZone)?.name}` : "Click zone"}
        </span>
      </div>
    </div>
  )
}