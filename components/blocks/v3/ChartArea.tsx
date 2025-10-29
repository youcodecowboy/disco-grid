"use client"

import { useState } from 'react'

interface DataPoint {
  name: string
  value: number
}

interface ChartAreaV3Props {
  title?: string
  data?: DataPoint[]
}

// Format large numbers nicely
function formatValue(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
  return value.toFixed(0)
}

export default function ChartAreaV3({ title, data = [] }: ChartAreaV3Props) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)

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

  const maxValue = Math.max(...data.map(d => d.value))
  const minValue = Math.min(...data.map(d => d.value))
  const range = maxValue - minValue || 1
  const padding = range * 0.1 // 10% padding at top
  const adjustedMax = maxValue + padding
  const adjustedRange = adjustedMax - minValue

  // Calculate Y-axis labels (4 evenly spaced values)
  const yAxisLabels = [0, 0.33, 0.67, 1].map(percent => 
    minValue + (adjustedRange * percent)
  ).reverse()

  return (
    <div className="h-full w-full bg-white rounded-lg overflow-hidden flex flex-col">
      {/* Title Header */}
      {title && (
        <div className="px-4 py-3 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        </div>
      )}
      
      {/* Chart Area with Y-axis */}
      <div className="flex-1 relative min-h-0 p-4 flex gap-2">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between py-1" style={{ width: '50px' }}>
          {yAxisLabels.map((value, i) => (
            <span key={i} className="text-xs text-slate-400 font-medium text-right">
              {formatValue(value)}
            </span>
          ))}
        </div>

        {/* Chart */}
        <div className="flex-1 relative">
          <svg 
            className="w-full h-full" 
            viewBox="0 0 600 240" 
            preserveAspectRatio="none"
          >
            {/* Grid lines */}
            {[0, 0.33, 0.67, 1].map((percent, i) => (
              <line
                key={i}
                x1="0"
                y1={220 - percent * 200}
                x2="600"
                y2={220 - percent * 200}
                stroke="#f1f5f9"
                strokeWidth="1"
              />
            ))}

            {/* Gradient definition */}
            <defs>
              <linearGradient id={`area-gradient-${title || 'default'}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {/* Area fill */}
            <path
              d={`
                M 0 220
                ${data.map((point, i) => {
                  const x = (i / (data.length - 1)) * 600
                  const y = 220 - ((point.value - minValue) / adjustedRange) * 200
                  return `L ${x} ${y}`
                }).join(' ')}
                L 600 220
                Z
              `}
              fill={`url(#area-gradient-${title || 'default'})`}
            />

            {/* Line */}
            <path
              d={data.map((point, i) => {
                const x = (i / (data.length - 1)) * 600
                const y = 220 - ((point.value - minValue) / adjustedRange) * 200
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
              }).join(' ')}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points with hover */}
            {data.map((point, i) => {
              const x = (i / (data.length - 1)) * 600
              const y = 220 - ((point.value - minValue) / adjustedRange) * 200
              const isHovered = hoveredPoint === i
              return (
                <g key={i}>
                  {/* Larger invisible circle for better hover target */}
                  <circle
                    cx={x}
                    cy={y}
                    r="16"
                    fill="transparent"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredPoint(i)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {/* Visible point - only show on hover */}
                  {isHovered && (
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      fill="#3b82f6"
                      stroke="white"
                      strokeWidth="2"
                    />
                  )}
                </g>
              )
            })}
          </svg>
          
          {/* Tooltip positioned absolutely */}
          {hoveredPoint !== null && (
            <div
              className="absolute pointer-events-none"
              style={{
                left: `${(hoveredPoint / (data.length - 1)) * 100}%`,
                top: `${100 - ((data[hoveredPoint].value - minValue) / adjustedRange) * 100}%`,
                transform: 'translate(-50%, -120%)'
              }}
            >
              <div className="bg-slate-900 text-white px-3 py-2 rounded-lg shadow-lg text-xs font-medium whitespace-nowrap">
                <div className="text-slate-300 mb-0.5">{data[hoveredPoint].name}</div>
                <div className="text-sm font-semibold">{formatValue(data[hoveredPoint].value)}</div>
              </div>
              {/* Arrow */}
              <div 
                className="w-0 h-0 mx-auto"
                style={{
                  borderLeft: '4px solid transparent',
                  borderRight: '4px solid transparent',
                  borderTop: '4px solid #0f172a'
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="px-4 pb-3" style={{ marginLeft: '50px' }}>
        <div className="flex justify-between">
          {data.map((point, i) => {
            // Show all labels if 6 or fewer, otherwise show first, middle, last
            const showLabel = data.length <= 6 || i === 0 || i === Math.floor(data.length / 2) || i === data.length - 1
            return (
              <span 
                key={i} 
                className="text-xs text-slate-500 font-medium"
                style={{ 
                  flex: 1, 
                  textAlign: i === 0 ? 'left' : i === data.length - 1 ? 'right' : 'center',
                  visibility: showLabel ? 'visible' : 'hidden'
                }}
              >
                {point.name}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}

