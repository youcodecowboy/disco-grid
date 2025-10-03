"use client"

import type React from "react"

interface MaterialProgressCardProps {
  title?: string
  data?: {
    materials: Array<{
      name: string
      current: number
      total: number
      zone: string
      status: "critical" | "low" | "good" | "full"
    }>
  }
}

export default function MaterialProgressCard({ title, data }: MaterialProgressCardProps) {
  const { materials = [] } = data || {}

  const getStatusGradient = (status: string) => {
    switch (status) {
      case "critical": return "from-red-500 to-red-600"
      case "low": return "from-orange-500 to-orange-600"
      case "good": return "from-blue-500 to-blue-600"
      case "full": return "from-green-500 to-green-600"
      default: return "from-slate-400 to-slate-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical": return "bg-red-100 text-red-700"
      case "low": return "bg-orange-100 text-orange-700"
      case "good": return "bg-blue-100 text-blue-700"
      case "full": return "bg-green-100 text-green-700"
      default: return "bg-slate-100 text-slate-700"
    }
  }

  return (
    <div className="h-full w-full bg-white p-3 sm:p-4 md:p-6 flex flex-col overflow-hidden gap-3">
      {/* Header */}
      <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
        {title}
      </h3>

      {/* Material List */}
      <div className="flex-1 min-h-0 space-y-3 sm:space-y-4 overflow-auto">
        {materials.map((material, idx) => {
          const percentage = Math.round((material.current / material.total) * 100)
          
          return (
            <div key={idx} className="space-y-1.5 sm:space-y-2">
              {/* Name and Percentage */}
              <div className="flex items-baseline justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                    {material.name}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-slate-500 truncate">
                    {material.zone}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">
                    {percentage}%
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-500">
                    {material.current}/{material.total}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-2 sm:h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getStatusGradient(material.status)} rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Status Badge */}
              <div>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold ${getStatusColor(material.status)}`}>
                  {material.status.toUpperCase()}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}