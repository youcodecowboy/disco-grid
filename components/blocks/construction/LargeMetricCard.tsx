"use client"

import type React from "react"

interface LargeMetricCardProps {
  title?: string
  data?: {
    value: string
    unit?: string
    delta?: string
    subtitle?: string
    trend?: number[]
    color?: "green" | "blue" | "purple" | "orange" | "red"
  }
}

export default function LargeMetricCard({ title, data }: LargeMetricCardProps) {
  const { 
    value = "0", 
    unit = "",
    delta = "", 
    subtitle = "",
    trend = [],
    color = "blue"
  } = data || {}
  
  const isPositive = !delta.startsWith("-")
  
  const colorSchemes = {
    green: {
      bg: "from-emerald-50 to-green-50",
      text: "text-emerald-900",
      bar: "bg-emerald-500",
      delta: isPositive ? "text-emerald-600" : "text-red-600",
      accent: "text-emerald-700"
    },
    blue: {
      bg: "from-blue-50 to-indigo-50",
      text: "text-blue-900",
      bar: "bg-blue-500",
      delta: isPositive ? "text-blue-600" : "text-red-600",
      accent: "text-blue-700"
    },
    purple: {
      bg: "from-purple-50 to-pink-50",
      text: "text-purple-900",
      bar: "bg-purple-500",
      delta: isPositive ? "text-purple-600" : "text-red-600",
      accent: "text-purple-700"
    },
    orange: {
      bg: "from-orange-50 to-amber-50",
      text: "text-orange-900",
      bar: "bg-orange-500",
      delta: isPositive ? "text-orange-600" : "text-red-600",
      accent: "text-orange-700"
    },
    red: {
      bg: "from-red-50 to-rose-50",
      text: "text-red-900",
      bar: "bg-red-500",
      delta: "text-red-600",
      accent: "text-red-700"
    }
  }

  const scheme = colorSchemes[color]

  return (
    <div 
      className={`h-full w-full bg-gradient-to-br ${scheme.bg} flex flex-col justify-between overflow-hidden`}
      style={{ 
        containerType: 'size',
        padding: 'clamp(8px, 3cqw, 24px)'
      }}
    >
      {/* Header with delta */}
      <div className="flex items-start justify-between gap-[1cqw] min-h-0">
        <h3 
          className={`font-bold ${scheme.accent} uppercase tracking-wide truncate flex-1`}
          style={{ fontSize: 'clamp(10px, 3cqw, 16px)' }}
        >
          {title}
        </h3>
        {delta && (
          <div 
            className={`flex items-center gap-[0.5cqw] font-bold ${scheme.delta} flex-shrink-0`}
            style={{ fontSize: 'clamp(10px, 3cqw, 16px)' }}
          >
            {isPositive ? (
              <svg 
                className="flex-shrink-0" 
                style={{ width: 'clamp(8px, 3cqw, 16px)', height: 'clamp(8px, 3cqw, 16px)' }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            ) : (
              <svg 
                className="flex-shrink-0"
                style={{ width: 'clamp(8px, 3cqw, 16px)', height: 'clamp(8px, 3cqw, 16px)' }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
            <span>{delta}</span>
          </div>
        )}
      </div>

      {/* Large Value - scales with container using cqw (container query width) */}
      <div className="flex items-baseline gap-[1cqw] min-h-0 flex-1 items-center">
        <span 
          className={`font-bold ${scheme.text} leading-none`}
          style={{ fontSize: 'clamp(20px, 12cqw, 72px)' }}
        >
          {value}
        </span>
        {unit && (
          <span 
            className={`font-semibold ${scheme.accent} leading-none`}
            style={{ fontSize: 'clamp(14px, 7cqw, 36px)' }}
          >
            {unit}
          </span>
        )}
      </div>
      
      {subtitle && (
        <p 
          className={`${scheme.accent} font-medium truncate`}
          style={{ fontSize: 'clamp(10px, 2.5cqw, 16px)' }}
        >
          {subtitle}
        </p>
      )}

      {/* Mini Sparkline - scales with container height */}
      {trend.length > 0 && (
        <div 
          className="flex items-end gap-[0.5cqw]"
          style={{ height: 'clamp(16px, 8cqh, 48px)' }}
        >
          {trend.map((point, idx) => {
            const max = Math.max(...trend)
            const min = Math.min(...trend)
            const range = max - min
            const normalizedHeight = range > 0 ? ((point - min) / range) * 100 : 50
            
            return (
              <div
                key={idx}
                className={`flex-1 rounded-sm transition-all ${scheme.bar} ${
                  idx === trend.length - 1 ? "opacity-100" : "opacity-40"
                }`}
                style={{ height: `${normalizedHeight}%` }}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}