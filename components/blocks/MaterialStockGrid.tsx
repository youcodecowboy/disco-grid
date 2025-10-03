"use client"

import type React from "react"

interface StockItem {
  name: string
  zone: string
  stock: number
  capacity: number
  status: "full" | "good" | "low" | "critical"
}

interface MaterialStockGridProps {
  items?: StockItem[]
}

const defaultItems: StockItem[] = [
  { name: "Steel Pipes", zone: "Zone C", stock: 24, capacity: 100, status: "low" },
  { name: "Concrete Blocks", zone: "Zone B", stock: 65, capacity: 500, status: "critical" },
  { name: "Rebar Bundle", zone: "Zone D", stock: 23, capacity: 80, status: "low" },
  { name: "Electrical", zone: "Zone A", stock: 70, capacity: 300, status: "low" },
  { name: "Lumber 2x4", zone: "Storage", stock: 450, capacity: 500, status: "good" },
  { name: "Drywall", zone: "Storage", stock: 280, capacity: 300, status: "good" },
  { name: "Roofing", zone: "Zone E", stock: 85, capacity: 100, status: "good" },
  { name: "Insulation", zone: "Storage", stock: 195, capacity: 200, status: "full" },
]

export default function MaterialStockGrid({ items = defaultItems }: MaterialStockGridProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "full":
        return "from-emerald-500 to-green-600"
      case "good":
        return "from-blue-500 to-blue-600"
      case "low":
        return "from-amber-500 to-orange-600"
      case "critical":
        return "from-red-500 to-red-600"
      default:
        return "from-slate-400 to-slate-500"
    }
  }

  const getPercentage = (stock: number, capacity: number) => {
    return Math.round((stock / capacity) * 100)
  }

  return (
    <div className="h-full w-full bg-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex-shrink-0">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-slate-800">
          Material Stock Levels
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Current inventory across all zones
        </p>
      </div>

      {/* Grid */}
      <div className="flex-1 min-h-0 overflow-auto p-3 sm:p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {items.map((item, idx) => {
            const percentage = getPercentage(item.stock, item.capacity)
            return (
              <div
                key={idx}
                className="bg-slate-50 rounded-lg border border-slate-200 p-3 sm:p-4 hover:shadow-md transition-shadow"
              >
                {/* Material name */}
                <h4 className="text-xs sm:text-sm md:text-base font-semibold text-slate-800 mb-1 truncate">
                  {item.name}
                </h4>

                {/* Zone */}
                <p className="text-[10px] sm:text-xs md:text-sm text-slate-500 mb-3">
                  {item.zone}
                </p>

                {/* Stock visualization */}
                <div className="relative mb-3">
                  {/* Background bar */}
                  <div className="w-full h-3 sm:h-4 bg-slate-200 rounded-full overflow-hidden">
                    {/* Fill bar */}
                    <div
                      className={`h-full bg-gradient-to-r ${getStatusColor(item.status)} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                {/* Stock numbers */}
                <div className="flex items-baseline justify-between mb-2">
                  <div>
                    <span className="text-base sm:text-lg md:text-xl font-bold text-slate-800">
                      {item.stock}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-400 ml-1">
                      / {item.capacity}
                    </span>
                  </div>
                  <div className="text-sm sm:text-base font-semibold text-slate-600">
                    {percentage}%
                  </div>
                </div>

                {/* Status badge */}
                <div>
                  <span
                    className={`
                      inline-block px-2 sm:px-2.5 py-1 rounded text-[10px] sm:text-xs font-semibold
                      ${
                        item.status === "full"
                          ? "bg-green-100 text-green-700"
                          : item.status === "good"
                            ? "bg-blue-100 text-blue-700"
                            : item.status === "low"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                      }
                    `}
                  >
                    {item.status.toUpperCase()}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex-shrink-0">
        <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span className="text-slate-600 font-medium">1 Full</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span className="text-slate-600 font-medium">3 Good</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-amber-500" />
            <span className="text-slate-600 font-medium">3 Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-500" />
            <span className="text-slate-600 font-medium">1 Critical</span>
          </div>
        </div>
      </div>
    </div>
  )
}
