"use client"

import type React from "react"

interface WorksiteMetricProps {
  title?: string
  data?: {
    value: string
    delta: string
    trend?: number[]
    timeRange?: string
  }
}

export default function WorksiteMetric({ title, data }: WorksiteMetricProps) {
  const { value = "0", delta = "", trend = [], timeRange = "" } = data || {}
  
  const isPositive = !delta.startsWith("-")
  const trendValue = trend.length > 0 ? trend[trend.length - 1] - trend[0] : 0
  const trendPercentage = trend.length > 0 ? ((trendValue / trend[0]) * 100).toFixed(1) : 0

  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden flex flex-col">
      {/* Header with title and time */}
      <div className="px-4 pt-3 pb-2 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <h4 className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wide">
            {title}
          </h4>
          <span className="text-[10px] sm:text-xs text-slate-500 font-medium">
            {timeRange}
          </span>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 px-4 py-3 flex items-center justify-between">
        {/* Value */}
        <div className="flex flex-col">
          <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-none mb-2">
            {value}
          </div>
          
          {/* Delta */}
          {delta && (
            <div className={`
              inline-flex items-center gap-1 text-xs sm:text-sm font-semibold
              ${isPositive ? "text-emerald-400" : "text-red-400"}
            `}>
              <svg 
                className="w-3 h-3 sm:w-4 sm:h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {isPositive ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                )}
              </svg>
              <span>{delta}</span>
            </div>
          )}
        </div>

        {/* Mini sparkline */}
        {trend.length > 0 && (
          <div className="flex items-end gap-0.5 h-full max-h-[60px] ml-4">
            {trend.map((point, idx) => {
              const max = Math.max(...trend)
              const min = Math.min(...trend)
              const range = max - min
              const normalizedHeight = range > 0 ? ((point - min) / range) * 100 : 50
              
              return (
                <div
                  key={idx}
                  className={`
                    w-1.5 sm:w-2 rounded-t transition-all
                    ${isPositive ? "bg-emerald-500/60" : "bg-red-500/60"}
                    ${idx === trend.length - 1 ? "bg-opacity-100 ring-1 ring-white/30" : ""}
                  `}
                  style={{ height: `${normalizedHeight}%` }}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}



