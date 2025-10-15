"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'

interface RadarDataPoint {
  label: string
  value: number // 0-100
  color?: string
}

interface RadarDataset {
  name: string
  data: RadarDataPoint[]
  color: string
  fillOpacity?: number
}

interface RadarV3Props {
  title?: string
  datasets?: RadarDataset[]
  maxValue?: number
}

// Generate default radar data (e.g., team performance metrics)
function generateDefaultData(): RadarDataset[] {
  return [
    {
      name: 'Current Quarter',
      color: 'rgb(59, 130, 246)',
      fillOpacity: 0.3,
      data: [
        { label: 'Speed', value: 85 },
        { label: 'Quality', value: 78 },
        { label: 'Cost', value: 65 },
        { label: 'Innovation', value: 82 },
        { label: 'Customer Sat', value: 90 },
        { label: 'Team Morale', value: 75 },
      ]
    },
    {
      name: 'Previous Quarter',
      color: 'rgb(168, 85, 247)',
      fillOpacity: 0.2,
      data: [
        { label: 'Speed', value: 70 },
        { label: 'Quality', value: 72 },
        { label: 'Cost', value: 68 },
        { label: 'Innovation', value: 65 },
        { label: 'Customer Sat', value: 85 },
        { label: 'Team Morale', value: 70 },
      ]
    }
  ]
}

export default function ChartRadarV3({ 
  title, 
  datasets,
  maxValue = 100
}: RadarV3Props) {
  const radarData = datasets || generateDefaultData()
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null)
  const [hoveredDataset, setHoveredDataset] = useState<string | null>(null)

  // SVG dimensions
  const size = 400
  const center = size / 2
  const radius = size / 2 - 60
  const numPoints = radarData[0]?.data.length || 6
  const angleStep = (2 * Math.PI) / numPoints

  // Calculate point position
  const getPointPosition = (index: number, value: number) => {
    const angle = angleStep * index - Math.PI / 2
    const distance = (value / maxValue) * radius
    return {
      x: center + distance * Math.cos(angle),
      y: center + distance * Math.sin(angle)
    }
  }

  // Generate path for dataset
  const getDatasetPath = (dataset: RadarDataset): string => {
    const points = dataset.data.map((point, i) => {
      const pos = getPointPosition(i, point.value)
      return `${pos.x},${pos.y}`
    })
    return `M${points.join('L')}Z`
  }

  // Grid circles (levels)
  const gridLevels = [20, 40, 60, 80, 100]

  return (
    <div className="h-full w-full bg-white rounded-lg overflow-hidden flex flex-col">
      {/* Title Header */}
      {title && (
        <div className="px-6 py-4 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <div className="flex gap-4">
              {radarData.map(dataset => (
                <div key={dataset.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: dataset.color }}
                  />
                  <span className="text-sm text-slate-600">{dataset.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Radar Chart */}
      <div className="flex-1 p-6 overflow-auto flex items-center justify-center bg-slate-50">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full"
          style={{ maxWidth: '500px', maxHeight: '500px' }}
        >
          {/* Grid circles */}
          <g>
            {gridLevels.map((level, i) => {
              const r = (level / maxValue) * radius
              return (
                <motion.circle
                  key={level}
                  cx={center}
                  cy={center}
                  r={r}
                  fill="none"
                  stroke="rgb(226, 232, 240)"
                  strokeWidth={1}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                />
              )
            })}
          </g>

          {/* Axis lines */}
          <g>
            {radarData[0]?.data.map((point, i) => {
              const pos = getPointPosition(i, maxValue)
              return (
                <motion.line
                  key={i}
                  x1={center}
                  y1={center}
                  x2={pos.x}
                  y2={pos.y}
                  stroke="rgb(226, 232, 240)"
                  strokeWidth={1}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                />
              )
            })}
          </g>

          {/* Data polygons */}
          <g>
            {radarData.map((dataset, datasetIndex) => {
              const isHovered = hoveredDataset === dataset.name
              
              return (
                <motion.path
                  key={dataset.name}
                  d={getDatasetPath(dataset)}
                  fill={dataset.color}
                  fillOpacity={isHovered ? (dataset.fillOpacity || 0.3) + 0.2 : dataset.fillOpacity || 0.3}
                  stroke={dataset.color}
                  strokeWidth={2}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: datasetIndex * 0.2 + 0.5 }}
                  onMouseEnter={() => setHoveredDataset(dataset.name)}
                  onMouseLeave={() => setHoveredDataset(null)}
                  className="cursor-pointer"
                />
              )
            })}
          </g>

          {/* Data points */}
          <g>
            {radarData.map((dataset, datasetIndex) => {
              return dataset.data.map((point, pointIndex) => {
                const pos = getPointPosition(pointIndex, point.value)
                const pointId = `${dataset.name}-${pointIndex}`
                const isHovered = hoveredPoint === pointId || hoveredDataset === dataset.name

                return (
                  <motion.circle
                    key={pointId}
                    cx={pos.x}
                    cy={pos.y}
                    r={isHovered ? 6 : 4}
                    fill={dataset.color}
                    stroke="white"
                    strokeWidth={2}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: datasetIndex * 0.2 + pointIndex * 0.05 + 0.7 }}
                    onMouseEnter={() => setHoveredPoint(pointId)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    className="cursor-pointer drop-shadow-md"
                  />
                )
              })
            })}
          </g>

          {/* Labels */}
          <g>
            {radarData[0]?.data.map((point, i) => {
              const pos = getPointPosition(i, maxValue + 15)
              
              return (
                <motion.text
                  key={i}
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm font-semibold fill-slate-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.05 + 1 }}
                >
                  {point.label}
                </motion.text>
              )
            })}
          </g>

          {/* Hover tooltip */}
          {hoveredPoint && (() => {
            const [datasetName, pointIndexStr] = hoveredPoint.split('-')
            const pointIndex = parseInt(pointIndexStr)
            const dataset = radarData.find(d => d.name === datasetName)
            const point = dataset?.data[pointIndex]
            
            if (!point || !dataset) return null
            
            const pos = getPointPosition(pointIndex, point.value)
            
            return (
              <motion.g
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <rect
                  x={pos.x - 50}
                  y={pos.y - 50}
                  width={100}
                  height={40}
                  fill="rgb(15, 23, 42)"
                  rx={6}
                  className="drop-shadow-xl"
                />
                <text
                  x={pos.x}
                  y={pos.y - 35}
                  textAnchor="middle"
                  className="text-xs font-semibold fill-white"
                >
                  {dataset.name}
                </text>
                <text
                  x={pos.x}
                  y={pos.y - 20}
                  textAnchor="middle"
                  className="text-sm font-bold fill-white"
                >
                  {point.value}
                </text>
              </motion.g>
            )
          })()}
        </svg>
      </div>

      {/* Footer Stats */}
      <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
        <div className="grid grid-cols-3 gap-4 text-center">
          {radarData.map(dataset => {
            const avg = Math.round(dataset.data.reduce((sum, p) => sum + p.value, 0) / dataset.data.length)
            const max = Math.max(...dataset.data.map(p => p.value))
            
            return (
              <div key={dataset.name} className="text-sm">
                <div className="font-semibold text-slate-900">{dataset.name}</div>
                <div className="text-xs text-slate-600 mt-1">
                  Avg: <span className="font-semibold">{avg}</span> • Max: <span className="font-semibold">{max}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}


