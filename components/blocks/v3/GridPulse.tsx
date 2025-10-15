"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface PulseCell {
  id: string
  x: number
  y: number
  active: boolean
  intensity: number // 0-100
  label?: string
}

interface GridPulseV3Props {
  title?: string
  rows?: number
  cols?: number
  data?: PulseCell[]
  animationSpeed?: number // ms between waves
}

// Generate grid data
function generateGridData(rows: number, cols: number): PulseCell[] {
  const cells: PulseCell[] = []
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const active = Math.random() > 0.3 // 70% chance of being active
      const intensity = active ? Math.round(20 + Math.random() * 80) : 0
      cells.push({
        id: `${x}-${y}`,
        x,
        y,
        active,
        intensity,
        label: `${String.fromCharCode(65 + x)}${y + 1}`
      })
    }
  }
  return cells
}

export default function GridPulseV3({ 
  title, 
  rows = 8, 
  cols = 12,
  data,
  animationSpeed = 3000 
}: GridPulseV3Props) {
  const [gridData, setGridData] = useState<PulseCell[]>(() => data || generateGridData(rows, cols))
  const [pulseOrigin, setPulseOrigin] = useState<{x: number, y: number} | null>(null)
  const [wavePhase, setWavePhase] = useState(0)

  // Auto-pulse effect
  useEffect(() => {
    const interval = setInterval(() => {
      // Random origin for pulse wave
      const origin = {
        x: Math.floor(Math.random() * cols),
        y: Math.floor(Math.random() * rows)
      }
      setPulseOrigin(origin)
      
      // Update some cells randomly
      setGridData(prev => prev.map(cell => ({
        ...cell,
        active: Math.random() > 0.2,
        intensity: Math.random() > 0.2 ? Math.round(20 + Math.random() * 80) : cell.intensity
      })))

      setWavePhase(p => p + 1)
    }, animationSpeed)

    return () => clearInterval(interval)
  }, [animationSpeed, cols, rows])

  // Calculate stats
  const activeCells = gridData.filter(c => c.active).length
  const totalCells = gridData.length
  const activePercentage = Math.round((activeCells / totalCells) * 100)
  const avgIntensity = Math.round(
    gridData.reduce((sum, cell) => sum + (cell.active ? cell.intensity : 0), 0) / activeCells
  )

  return (
    <div className="h-full w-full bg-slate-900 rounded-lg overflow-hidden flex flex-col">
      {/* Title Header */}
      {title && (
        <div className="px-6 py-4 border-b border-slate-700 bg-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-300">
                  {activeCells}/{totalCells} Active
                </span>
              </div>
              <div className="text-slate-400">
                Avg: <span className="font-semibold text-white">{avgIntensity}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid Container */}
      <div className="flex-1 p-6 flex items-center justify-center overflow-hidden relative">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 to-transparent" />

        {/* Pulse Grid */}
        <div 
          className="grid gap-1.5"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
          }}
        >
          {gridData.map((cell) => {
            // Calculate distance from pulse origin for wave effect
            const distanceFromOrigin = pulseOrigin
              ? Math.sqrt(Math.pow(cell.x - pulseOrigin.x, 2) + Math.pow(cell.y - pulseOrigin.y, 2))
              : 0
            
            const waveDelay = distanceFromOrigin * 0.05

            return (
              <motion.div
                key={cell.id}
                className={`relative rounded-sm ${
                  cell.active ? 'bg-blue-500' : 'bg-slate-700'
                }`}
                style={{
                  width: '24px',
                  height: '24px',
                  boxShadow: cell.active && cell.intensity > 60
                    ? `0 0 ${cell.intensity / 10}px rgba(59, 130, 246, ${cell.intensity / 100})`
                    : 'none'
                }}
                animate={{
                  opacity: cell.active ? 0.3 + (cell.intensity / 100) * 0.7 : 0.1,
                  scale: cell.active ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  opacity: { duration: 0.3 },
                  scale: {
                    duration: 0.6,
                    repeat: Infinity,
                    repeatDelay: 2,
                    delay: waveDelay
                  }
                }}
              >
                {/* Inner glow for high intensity */}
                {cell.active && cell.intensity > 70 && (
                  <motion.div
                    className="absolute inset-0 rounded-sm bg-white"
                    animate={{
                      opacity: [0.3, 0, 0.3],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: waveDelay
                    }}
                  />
                )}

                {/* Pulse rings */}
                {cell.active && cell.intensity > 80 && (
                  <>
                    <motion.div
                      className="absolute inset-0 rounded-sm border-2 border-blue-400"
                      key={`ring1-${wavePhase}`}
                      initial={{ scale: 1, opacity: 0.8 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 1, delay: waveDelay }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-sm border-2 border-cyan-400"
                      key={`ring2-${wavePhase}`}
                      initial={{ scale: 1, opacity: 0.6 }}
                      animate={{ scale: 2.5, opacity: 0 }}
                      transition={{ duration: 1.2, delay: waveDelay + 0.1 }}
                    />
                  </>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Scanning line effect */}
        <motion.div
          className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"
          animate={{
            y: ['0%', '100%'],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Stats Footer */}
      <div className="px-6 py-4 border-t border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <div className="text-xs text-slate-400 mb-1">Activity Rate</div>
              <div className="text-lg font-bold text-white">{activePercentage}%</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-1">High Intensity</div>
              <div className="text-lg font-bold text-emerald-400">
                {gridData.filter(c => c.intensity > 80).length}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-1">Status</div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-semibold text-emerald-400">LIVE</span>
              </div>
            </div>
          </div>

          {/* Color intensity legend */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Intensity:</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded-sm bg-slate-700" />
              <div className="w-4 h-4 rounded-sm bg-blue-500 opacity-30" />
              <div className="w-4 h-4 rounded-sm bg-blue-500 opacity-60" />
              <div className="w-4 h-4 rounded-sm bg-blue-500 opacity-90" />
              <div className="w-4 h-4 rounded-sm bg-blue-400" style={{ boxShadow: '0 0 8px rgba(59, 130, 246, 0.8)' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


