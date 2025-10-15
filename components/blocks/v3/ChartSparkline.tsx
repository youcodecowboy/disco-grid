"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'

interface SparklineDataPoint {
  value: number
  label?: string
}

interface ChartSparklineV3Props {
  title?: string
  data?: SparklineDataPoint[]
  color?: string
  showValue?: boolean
  showTrend?: boolean
  height?: number
}

// Generate default sparkline data
function generateDefaultData(points: number = 30): SparklineDataPoint[] {
  const data: SparklineDataPoint[] = []
  let value = 50

  for (let i = 0; i < points; i++) {
    value += (Math.random() - 0.4) * 10
    value = Math.max(20, Math.min(80, value))
    data.push({ value })
  }

  return data
}

export default function ChartSparklineV3({
  title = 'Activity',
  data,
  color = 'rgb(59, 130, 246)',
  showValue = true,
  showTrend = true,
  height = 60
}: ChartSparklineV3Props) {
  const sparklineData = data || generateDefaultData()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Calculate stats
  const values = sparklineData.map(d => d.value)
  const currentValue = values[values.length - 1]
  const previousValue = values[values.length - 2]
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const avgValue = values.reduce((sum, v) => sum + v, 0) / values.length
  const trend = currentValue > previousValue ? 'up' : currentValue < previousValue ? 'down' : 'neutral'
  const trendPercent = previousValue ? (((currentValue - previousValue) / previousValue) * 100).toFixed(1) : '0'

  // SVG dimensions
  const svgWidth = 300
  const svgHeight = height
  const padding = 4

  // Generate path
  const points = sparklineData.map((d, i) => {
    const x = (i / (sparklineData.length - 1)) * (svgWidth - padding * 2) + padding
    const y = svgHeight - ((d.value - minValue) / (maxValue - minValue)) * (svgHeight - padding * 2) - padding
    return { x, y, value: d.value }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const areaPath = `${linePath} L${svgWidth - padding},${svgHeight} L${padding},${svgHeight} Z`

  // Trend colors
  const trendColors = {
    up: { text: 'text-emerald-600', bg: 'bg-emerald-50', icon: '↑' },
    down: { text: 'text-red-600', bg: 'bg-red-50', icon: '↓' },
    neutral: { text: 'text-slate-600', bg: 'bg-slate-50', icon: '→' }
  }
  const trendConfig = trendColors[trend]

  return (
    <div className="h-full w-full bg-white rounded-lg overflow-hidden flex flex-col border border-slate-200 hover:shadow-lg transition-shadow">
      {/* Header with value and trend */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-slate-600">{title}</h4>
          {showValue && (
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {currentValue.toFixed(1)}
            </div>
          )}
        </div>

        {showTrend && (
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold
                        ${trendConfig.bg} ${trendConfig.text}`}>
            <span className="text-base">{trendConfig.icon}</span>
            <span>{Math.abs(parseFloat(trendPercent))}%</span>
          </div>
        )}
      </div>

      {/* Sparkline Chart */}
      <div className="flex-1 px-4 pb-3">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Area fill */}
          <motion.path
            d={areaPath}
            fill={color}
            fillOpacity={0.1}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />

          {/* Line */}
          <motion.path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />

          {/* Hover indicator line */}
          {hoveredIndex !== null && (
            <motion.line
              x1={points[hoveredIndex].x}
              y1={padding}
              x2={points[hoveredIndex].x}
              y2={svgHeight - padding}
              stroke={color}
              strokeWidth={1}
              strokeDasharray="2,2"
              opacity={0.5}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
            />
          )}

          {/* Data points (show on hover) */}
          {points.map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r={hoveredIndex === i ? 4 : 0}
              fill={color}
              stroke="white"
              strokeWidth={2}
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHoveredIndex(i)}
            />
          ))}

          {/* Invisible hover areas for better interaction */}
          {points.map((point, i) => (
            <rect
              key={`hover-${i}`}
              x={point.x - 5}
              y={0}
              width={10}
              height={svgHeight}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
            />
          ))}

          {/* Hover tooltip */}
          {hoveredIndex !== null && (
            <g>
              <rect
                x={points[hoveredIndex].x - 30}
                y={points[hoveredIndex].y - 35}
                width={60}
                height={25}
                fill="rgb(15, 23, 42)"
                rx={4}
                className="drop-shadow-lg"
              />
              <text
                x={points[hoveredIndex].x}
                y={points[hoveredIndex].y - 18}
                textAnchor="middle"
                className="text-xs font-bold fill-white"
              >
                {points[hoveredIndex].value.toFixed(1)}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Footer Stats */}
      <div className="px-4 py-2 border-t border-slate-100 bg-slate-50">
        <div className="flex items-center justify-between text-xs">
          <div className="text-slate-600">
            Min: <span className="font-semibold text-slate-900">{minValue.toFixed(1)}</span>
          </div>
          <div className="text-slate-600">
            Avg: <span className="font-semibold text-slate-900">{avgValue.toFixed(1)}</span>
          </div>
          <div className="text-slate-600">
            Max: <span className="font-semibold text-slate-900">{maxValue.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}


