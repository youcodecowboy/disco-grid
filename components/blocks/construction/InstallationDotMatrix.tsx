"use client"

import type React from "react"

interface InstallationDotMatrixProps {
  title?: string
  data?: {
    installed: number
    total: number
    label: string
  }
}

export default function InstallationDotMatrix({ title, data }: InstallationDotMatrixProps) {
  const {
    installed = 76,
    total = 100,
    label = "Installation Progress"
  } = data || {}

  const percentage = Math.round((installed / total) * 100)
  const dotsTotal = 50 // 10x5 grid
  const dotsFilled = Math.round((installed / total) * dotsTotal)

  return (
    <div className="h-full w-full bg-white p-3 sm:p-4 md:p-6 flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div className="flex items-end justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide truncate">
            {title}
          </h3>
          <p className="text-[10px] sm:text-xs text-slate-500 truncate">
            {label}
          </p>
        </div>
        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-none">
          {percentage}%
        </div>
      </div>

      {/* Dot Matrix */}
      <div className="flex-1 min-h-0 flex items-center justify-center">
        <div className="grid grid-cols-10 gap-1 sm:gap-1.5 md:gap-2">
          {Array.from({ length: dotsTotal }).map((_, idx) => (
            <div
              key={idx}
              className={`
                w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 lg:w-4 lg:h-4 rounded-full transition-all duration-300
                ${idx < dotsFilled 
                  ? "bg-emerald-500" 
                  : "bg-slate-200"
                }
              `}
            />
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="text-center">
          <div className="text-base sm:text-lg md:text-2xl font-bold text-emerald-600">
            {installed}
          </div>
          <div className="text-[10px] sm:text-xs text-slate-500">
            Done
          </div>
        </div>
        <div className="text-center">
          <div className="text-base sm:text-lg md:text-2xl font-bold text-orange-600">
            {total - installed}
          </div>
          <div className="text-[10px] sm:text-xs text-slate-500">
            Left
          </div>
        </div>
        <div className="text-center">
          <div className="text-base sm:text-lg md:text-2xl font-bold text-slate-900">
            {total}
          </div>
          <div className="text-[10px] sm:text-xs text-slate-500">
            Total
          </div>
        </div>
      </div>
    </div>
  )
}