"use client"

interface KPICardV3Props {
  title?: string
  value?: string
  change?: string
  trend?: "up" | "down" | "neutral"
  subtitle?: string
}

export default function KPICardV3({ 
  title = "Metric", 
  value = "0", 
  change = "+0%",
  trend = "neutral",
  subtitle = "Description"
}: KPICardV3Props) {
  const trendColors = {
    up: "text-emerald-600 bg-emerald-50",
    down: "text-red-600 bg-red-50",
    neutral: "text-slate-600 bg-slate-50"
  }

  const trendIcons = {
    up: "↑",
    down: "↓",
    neutral: "→"
  }

  return (
    <div className="h-full w-full bg-gradient-to-br from-white to-slate-50 rounded-lg p-6 flex flex-col justify-between border border-slate-200">
      {/* Header */}
      <div>
        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1">
          {title}
        </h3>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>

      {/* Value */}
      <div className="my-4">
        <div className="text-4xl font-bold text-slate-900 leading-none">
          {value}
        </div>
      </div>

      {/* Change indicator */}
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-semibold ${trendColors[trend]}`}>
          <span>{trendIcons[trend]}</span>
          {change}
        </span>
      </div>
    </div>
  )
}


















