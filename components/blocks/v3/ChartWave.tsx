"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface WaveDataPoint {
  time: number
  value: number
}

interface ChartWaveV3Props {
  title?: string
  data?: WaveDataPoint[]
  color?: string
  maxPoints?: number
  updateInterval?: number // ms
}

export default function ChartWaveV3({
  title = 'Real-time Data',
  data,
  color = 'rgb(16, 185, 129)',
  maxPoints = 50,
  updateInterval = 500
}: ChartWaveV3Props) {
  const [waveData, setWaveData] = useState<WaveDataPoint[]>(
    data || Array.from({ length: maxPoints }, (_, i) => ({
      time: i,
      value: 50 + Math.sin(i / 5) * 20 + (Math.random() - 0.5) * 10
    }))
  )
  const [isPaused, setIsPaused] = useState(false)

  // Auto-update wave data
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setWaveData(prev => {
        const newPoint: WaveDataPoint = {
          time: prev[prev.length - 1].time + 1,
          value: 50 + Math.sin(prev[prev.length - 1].time / 5) * 20 + (Math.random() - 0.5) * 15
        }
        
        const newData = [...prev, newPoint]
        if (newData.length > maxPoints) {
          newData.shift()
        }
        
        return newData
      })
    }, updateInterval)

    return () => clearInterval(interval)
  }, [isPaused, maxPoints, updateInterval])

  // Calculate stats
  const values = waveData.map(d => d.value)
  const currentValue = values[values.length - 1]
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const avgValue = values.reduce((sum, v) => sum + v, 0) / values.length

  // SVG dimensions
  const svgWidth = 800
  const svgHeight = 300
  const padding = 40

  // Generate wave path
  const points = waveData.map((d, i) => {
    const x = (i / (maxPoints - 1)) * (svgWidth - padding * 2) + padding
    const y = svgHeight - padding - ((d.value - minValue) / (maxValue - minValue)) * (svgHeight - padding * 2)
    return { x, y, value: d.value }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const areaPath = `${linePath} L${svgWidth - padding},${svgHeight - padding} L${padding},${svgHeight - padding} Z`

  return (
    <div className="h-full w-full bg-slate-900 rounded-lg overflow-hidden flex flex-col">
      {/* Title Header */}
      {title && (
        <div className="px-6 py-4 border-b border-slate-700 bg-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              {/* Live indicator */}
              <div className="flex items-center gap-2">
                {!isPaused && (
                  <motion.div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color }}
                    animate={{
                      opacity: [0.4, 1, 0.4],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
                <span className="text-xs text-slate-400">{isPaused ? 'Paused' : 'Live'}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-400">
                Current: <span className="font-semibold text-white">{currentValue.toFixed(1)}</span>
              </div>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium transition-colors"
              >
                {isPaused ? 'Resume' : 'Pause'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wave Chart */}
      <div className="flex-1 p-6 overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full"
        >
          {/* Grid lines */}
          <g opacity={0.1}>
            {[0, 25, 50, 75, 100].map(percent => {
              const y = svgHeight - padding - (percent / 100) * (svgHeight - padding * 2)
              return (
                <line
                  key={percent}
                  x1={padding}
                  y1={y}
                  x2={svgWidth - padding}
                  y2={y}
                  stroke="white"
                  strokeWidth={1}
                />
              )
            })}
          </g>

          {/* Area gradient */}
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity={0.6} />
              <stop offset="100%" stopColor={color} stopOpacity={0.05} />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <motion.path
            d={areaPath}
            fill="url(#waveGradient)"
            animate={{
              d: areaPath
            }}
            transition={{
              duration: 0.3,
              ease: 'easeOut'
            }}
          />

          {/* Glow effect */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Line */}
          <motion.path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            animate={{
              d: linePath
            }}
            transition={{
              duration: 0.3,
              ease: 'easeOut'
            }}
          />

          {/* Current value indicator */}
          <motion.circle
            cx={points[points.length - 1]?.x || 0}
            cy={points[points.length - 1]?.y || 0}
            r={6}
            fill={color}
            stroke="white"
            strokeWidth={2}
            animate={{
              cx: points[points.length - 1]?.x || 0,
              cy: points[points.length - 1]?.y || 0,
              scale: isPaused ? 1 : [1, 1.3, 1]
            }}
            transition={{
              scale: {
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            className="drop-shadow-lg"
          />

          {/* Y-axis labels */}
          {[minValue, avgValue, maxValue].map((value, i) => {
            const y = svgHeight - padding - ((value - minValue) / (maxValue - minValue)) * (svgHeight - padding * 2)
            return (
              <text
                key={i}
                x={padding - 10}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                className="text-xs fill-slate-400"
              >
                {value.toFixed(0)}
              </text>
            )
          })}
        </svg>
      </div>

      {/* Footer Stats */}
      <div className="px-6 py-4 border-t border-slate-700 bg-slate-800">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xs text-slate-400 mb-1">Current</div>
            <div className="text-lg font-bold text-white">{currentValue.toFixed(1)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400 mb-1">Average</div>
            <div className="text-lg font-bold text-white">{avgValue.toFixed(1)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400 mb-1">Min</div>
            <div className="text-lg font-bold text-white">{minValue.toFixed(1)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400 mb-1">Max</div>
            <div className="text-lg font-bold text-white">{maxValue.toFixed(1)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}


