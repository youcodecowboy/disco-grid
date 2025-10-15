"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'

interface HeatmapStage {
  id: string
  name: string
  value: number // 0-100 (utilization/capacity percentage)
  count?: number // actual count (e.g., number of orders)
  total?: number // total capacity
}

interface HeatmapV3Props {
  title?: string
  stages?: HeatmapStage[]
  type?: 'manufacturing' | 'construction' | 'generic'
}

// Generate default stages based on type
function generateDefaultStages(type: 'manufacturing' | 'construction' | 'generic'): HeatmapStage[] {
  if (type === 'manufacturing') {
    return [
      { id: '1', name: 'Cutting', value: 35, count: 12, total: 35 },
      { id: '2', name: 'Assembly', value: 68, count: 24, total: 35 },
      { id: '3', name: 'Quality Check', value: 45, count: 16, total: 35 },
      { id: '4', name: 'Painting', value: 82, count: 29, total: 35 },
      { id: '5', name: 'Packaging', value: 58, count: 20, total: 35 },
      { id: '6', name: 'Shipping', value: 25, count: 9, total: 35 },
    ]
  } else if (type === 'construction') {
    return [
      { id: '1', name: 'Concrete', value: 42, count: 850, total: 2000 },
      { id: '2', name: 'Steel', value: 78, count: 1560, total: 2000 },
      { id: '3', name: 'Electrical', value: 33, count: 660, total: 2000 },
      { id: '4', name: 'Plumbing', value: 91, count: 1820, total: 2000 },
      { id: '5', name: 'Drywall', value: 55, count: 1100, total: 2000 },
      { id: '6', name: 'Finishing', value: 18, count: 360, total: 2000 },
    ]
  } else {
    return [
      { id: '1', name: 'Stage 1', value: 45, count: 45, total: 100 },
      { id: '2', name: 'Stage 2', value: 72, count: 72, total: 100 },
      { id: '3', name: 'Stage 3', value: 38, count: 38, total: 100 },
      { id: '4', name: 'Stage 4', value: 85, count: 85, total: 100 },
      { id: '5', name: 'Stage 5', value: 60, count: 60, total: 100 },
      { id: '6', name: 'Stage 6', value: 22, count: 22, total: 100 },
    ]
  }
}

// Get color configuration based on utilization (inverted - low is good, high is bad)
function getCapacityColor(value: number) {
  if (value >= 85) {
    return {
      bg: 'bg-red-500',
      border: 'border-red-600',
      text: 'text-red-900',
      glow: 'rgba(239, 68, 68, 0.4)',
      label: 'Critical',
      ring: 'ring-red-400'
    }
  }
  if (value >= 70) {
    return {
      bg: 'bg-orange-500',
      border: 'border-orange-600',
      text: 'text-orange-900',
      glow: 'rgba(249, 115, 22, 0.4)',
      label: 'High',
      ring: 'ring-orange-400'
    }
  }
  if (value >= 50) {
    return {
      bg: 'bg-amber-400',
      border: 'border-amber-500',
      text: 'text-amber-900',
      glow: 'rgba(251, 191, 36, 0.4)',
      label: 'Moderate',
      ring: 'ring-amber-400'
    }
  }
  if (value >= 30) {
    return {
      bg: 'bg-lime-500',
      border: 'border-lime-600',
      text: 'text-lime-900',
      glow: 'rgba(132, 204, 22, 0.4)',
      label: 'Good',
      ring: 'ring-lime-400'
    }
  }
  return {
    bg: 'bg-emerald-500',
    border: 'border-emerald-600',
    text: 'text-emerald-900',
    glow: 'rgba(16, 185, 129, 0.4)',
    label: 'Excellent',
    ring: 'ring-emerald-400'
  }
}

export default function HeatmapV3({ 
  title, 
  stages,
  type = 'manufacturing'
}: HeatmapV3Props) {
  const stageData = stages || generateDefaultStages(type)
  const [hoveredStage, setHoveredStage] = useState<string | null>(null)

  // Calculate stats
  const avgUtilization = Math.round(stageData.reduce((sum, stage) => sum + stage.value, 0) / stageData.length)
  const criticalStages = stageData.filter(s => s.value >= 85).length
  const goodStages = stageData.filter(s => s.value < 50).length

  return (
    <div className="h-full w-full bg-white rounded-lg overflow-hidden flex flex-col">
      {/* Title Header */}
      {title && (
        <div className="px-6 py-4 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="text-slate-600">
                Avg Utilization: <span className="font-semibold text-slate-900">{avgUtilization}%</span>
              </div>
              {criticalStages > 0 && (
                <div className="flex items-center gap-1.5 text-red-600">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-semibold">{criticalStages} Critical</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stage Cards Grid */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-2 gap-4 h-full">
          {stageData.map((stage, index) => {
            const colorConfig = getCapacityColor(stage.value)
            const isHovered = hoveredStage === stage.id
            const isHighCapacity = stage.value >= 70
            
            return (
              <motion.div
                key={stage.id}
                className={`relative rounded-xl border-2 overflow-hidden cursor-pointer
                         ${colorConfig.border} transition-all duration-300
                         ${isHovered ? 'ring-4 ' + colorConfig.ring : ''}`}
                style={{
                  boxShadow: isHighCapacity ? `0 0 20px ${colorConfig.glow}` : '0 1px 3px rgba(0,0,0,0.1)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
                whileHover={{ scale: 1.02 }}
                onMouseEnter={() => setHoveredStage(stage.id)}
                onMouseLeave={() => setHoveredStage(null)}
              >
                {/* Pulsing background for high capacity */}
                {isHighCapacity && (
                  <motion.div
                    className={`absolute inset-0 ${colorConfig.bg} opacity-20`}
                    animate={{
                      opacity: [0.2, 0.3, 0.2],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}

                {/* Color bar on left */}
                <div className={`absolute left-0 top-0 bottom-0 w-2 ${colorConfig.bg}`} />

                {/* Content */}
                <div className="relative p-4 pl-6">
                  {/* Stage name and status */}
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-lg font-bold text-slate-900">{stage.name}</h4>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full 
                                   ${colorConfig.bg} ${colorConfig.text} bg-opacity-20`}>
                      {colorConfig.label}
                    </span>
                  </div>

                  {/* Utilization percentage */}
                  <div className="mb-2">
                    <div className="text-3xl font-bold text-slate-900">{stage.value}%</div>
                    <div className="text-xs text-slate-500 font-medium">Utilization</div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2 mb-3 overflow-hidden">
                    <motion.div
                      className={colorConfig.bg}
                      initial={{ width: 0 }}
                      animate={{ width: `${stage.value}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                    />
                  </div>

                  {/* Count details */}
                  {stage.count !== undefined && stage.total !== undefined && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">
                        <span className="font-semibold text-slate-900">{stage.count.toLocaleString()}</span>
                        {' / '}{stage.total.toLocaleString()}
                      </span>
                      <span className="text-slate-500">
                        {stage.total - stage.count > 0 ? (
                          <span className="text-emerald-600 font-medium">
                            {(stage.total - stage.count).toLocaleString()} available
                          </span>
                        ) : (
                          <span className="text-red-600 font-medium">At capacity</span>
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* Pulse ring for critical stages */}
                {stage.value >= 85 && (
                  <motion.div
                    className="absolute inset-0 rounded-xl border-4 border-red-500"
                    animate={{
                      opacity: [0.5, 0, 0.5],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Legend Footer */}
      <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-600">Capacity Status</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-emerald-500" />
              <span className="text-xs text-slate-600">0-30% Good</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-amber-400" />
              <span className="text-xs text-slate-600">50-70% Moderate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-red-500" />
              <span className="text-xs text-slate-600">85%+ Critical</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
