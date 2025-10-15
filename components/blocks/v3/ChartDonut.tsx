"use client"

interface DataPoint {
  name: string
  value: number
}

interface ChartDonutV3Props {
  title?: string
  data?: DataPoint[]
}

export default function ChartDonutV3({ title, data = [] }: ChartDonutV3Props) {
  if (data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-slate-500 text-sm">No data available</p>
        </div>
      </div>
    )
  }

  const total = data.reduce((sum, d) => sum + d.value, 0)
  const colors = [
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#10b981', // emerald
    '#f59e0b', // amber
    '#ef4444', // red
    '#06b6d4', // cyan
  ]

  // Calculate paths for donut chart
  let currentAngle = -90 // Start at top
  const segments = data.map((point, i) => {
    const percentage = (point.value / total) * 100
    const angle = (point.value / total) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    currentAngle = endAngle

    // Convert to radians
    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180

    // Calculate path
    const outerRadius = 90
    const innerRadius = 60
    
    const x1 = 100 + outerRadius * Math.cos(startRad)
    const y1 = 100 + outerRadius * Math.sin(startRad)
    const x2 = 100 + outerRadius * Math.cos(endRad)
    const y2 = 100 + outerRadius * Math.sin(endRad)
    const x3 = 100 + innerRadius * Math.cos(endRad)
    const y3 = 100 + innerRadius * Math.sin(endRad)
    const x4 = 100 + innerRadius * Math.cos(startRad)
    const y4 = 100 + innerRadius * Math.sin(startRad)

    const largeArc = angle > 180 ? 1 : 0

    const path = `
      M ${x1} ${y1}
      A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}
      Z
    `

    return {
      path,
      color: colors[i % colors.length],
      name: point.name,
      value: point.value,
      percentage: percentage.toFixed(1)
    }
  })

  return (
    <div className="h-full w-full bg-white rounded-lg overflow-hidden flex flex-col p-6">
      {/* Title Header */}
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        </div>
      )}
      
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-8 max-w-full">
        {/* Donut Chart */}
        <div className="relative flex-shrink-0" style={{ width: '200px', height: '200px' }}>
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {segments.map((segment, i) => (
              <g key={i}>
                <path
                  d={segment.path}
                  fill={segment.color}
                  className="transition-opacity hover:opacity-80 cursor-pointer"
                />
              </g>
            ))}
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <div className="text-3xl font-bold text-slate-900">{total}</div>
            <div className="text-xs text-slate-500">Total</div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-3">
          {segments.map((segment, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: segment.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-900 truncate">
                  {segment.name}
                </div>
                <div className="text-xs text-slate-500">
                  {segment.value.toLocaleString()} ({segment.percentage}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  )
}



