"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MapZone {
  id: string
  name: string
  x: number // percentage position
  y: number // percentage position
  status: 'active' | 'warning' | 'inactive' | 'success'
  value?: string
  count?: number
}

interface MapSiteV3Props {
  title?: string
  zones?: MapZone[]
  backgroundImage?: string
}

const defaultZones: MapZone[] = [
  { id: '1', name: 'Zone A', x: 20, y: 25, status: 'active', value: '85%', count: 12 },
  { id: '2', name: 'Zone B', x: 45, y: 30, status: 'success', value: '100%', count: 8 },
  { id: '3', name: 'Zone C', x: 70, y: 35, status: 'warning', value: '65%', count: 15 },
  { id: '4', name: 'Zone D', x: 35, y: 55, status: 'active', value: '78%', count: 10 },
  { id: '5', name: 'Zone E', x: 60, y: 60, status: 'inactive', value: '0%', count: 0 },
  { id: '6', name: 'Zone F', x: 80, y: 70, status: 'success', value: '95%', count: 6 },
]

const statusConfig = {
  active: {
    color: 'bg-blue-500',
    ringColor: 'ring-blue-400',
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-300',
    textColor: 'text-blue-700',
    dotColor: '#3b82f6',
    label: 'Active'
  },
  success: {
    color: 'bg-emerald-500',
    ringColor: 'ring-emerald-400',
    bgLight: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    textColor: 'text-emerald-700',
    dotColor: '#10b981',
    label: 'Complete'
  },
  warning: {
    color: 'bg-amber-500',
    ringColor: 'ring-amber-400',
    bgLight: 'bg-amber-50',
    borderColor: 'border-amber-300',
    textColor: 'text-amber-700',
    dotColor: '#f59e0b',
    label: 'Warning'
  },
  inactive: {
    color: 'bg-slate-400',
    ringColor: 'ring-slate-300',
    bgLight: 'bg-slate-50',
    borderColor: 'border-slate-300',
    textColor: 'text-slate-600',
    dotColor: '#94a3b8',
    label: 'Inactive'
  }
}

export default function MapSiteV3({ title, zones = defaultZones, backgroundImage }: MapSiteV3Props) {
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [hoveredZone, setHoveredZone] = useState<string | null>(null)

  const selectedZoneData = zones.find(z => z.id === selectedZone)

  return (
    <div className="h-full w-full bg-white rounded-lg overflow-hidden flex flex-col">
      {/* Title Header */}
      {title && (
        <div className="px-6 py-4 border-b border-slate-200 bg-white">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        </div>
      )}

      {/* Map Container */}
      <div className="flex-1 relative bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 overflow-hidden">
        {/* Background Image (optional) */}
        {backgroundImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-15"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        )}

        {/* Grid Pattern */}
        <div className="absolute inset-0">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgb(148 163 184 / 0.1)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Zones */}
        <div className="absolute inset-0">
          {zones.map((zone) => {
            const config = statusConfig[zone.status]
            const isSelected = selectedZone === zone.id
            const isHovered = hoveredZone === zone.id

            return (
              <motion.div
                key={zone.id}
                className="absolute"
                style={{
                  left: `${zone.x}%`,
                  top: `${zone.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: parseInt(zone.id) * 0.1, type: 'spring', stiffness: 200 }}
              >
                {/* Pulsing Ring (for active/warning statuses) */}
                {(zone.status === 'active' || zone.status === 'warning') && (
                  <motion.div
                    className={`absolute inset-0 rounded-full ${config.color} opacity-20`}
                    style={{ width: '48px', height: '48px', left: '-16px', top: '-16px' }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}

                {/* Main Marker */}
                <motion.button
                  className={`relative w-4 h-4 rounded-full ${config.color} shadow-lg 
                             ring-4 ${config.ringColor} ring-opacity-30
                             transition-all duration-200 cursor-pointer
                             ${isSelected || isHovered ? 'scale-150 ring-8' : ''}`}
                  onClick={() => setSelectedZone(isSelected ? null : zone.id)}
                  onMouseEnter={() => setHoveredZone(zone.id)}
                  onMouseLeave={() => setHoveredZone(null)}
                  whileHover={{ scale: 1.5 }}
                  whileTap={{ scale: 1.2 }}
                >
                  {/* Inner glow */}
                  <div className="absolute inset-0 rounded-full bg-white opacity-40" />
                </motion.button>

                {/* Zone Label (show on hover or select) */}
                <AnimatePresence>
                  {(isHovered || isSelected) && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none"
                    >
                      <div className={`px-2 py-1 rounded-md ${config.bgLight} ${config.borderColor} 
                                    border shadow-lg backdrop-blur-sm`}>
                        <p className={`text-xs font-semibold ${config.textColor}`}>
                          {zone.name}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Connection Lines (when selected) */}
                {isSelected && (
                  <motion.svg
                    className="absolute pointer-events-none"
                    style={{
                      width: '200px',
                      height: '200px',
                      left: '-100px',
                      top: '-100px'
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke={config.dotColor}
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      opacity="0.3"
                    />
                  </motion.svg>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 flex gap-3 bg-white/90 backdrop-blur-sm 
                      px-4 py-2 rounded-lg shadow-lg border border-slate-200">
          {Object.entries(statusConfig).map(([key, config]) => {
            const count = zones.filter(z => z.status === key).length
            if (count === 0) return null
            
            return (
              <div key={key} className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${config.color}`} />
                <span className="text-xs font-medium text-slate-700">
                  {config.label} ({count})
                </span>
              </div>
            )
          })}
        </div>

        {/* Stats Panel */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm 
                      px-4 py-3 rounded-lg shadow-lg border border-slate-200">
          <div className="flex flex-col gap-1">
            <div className="text-2xl font-bold text-slate-900">
              {zones.length}
            </div>
            <div className="text-xs text-slate-600 font-medium">
              Total Zones
            </div>
          </div>
        </div>
      </div>

      {/* Details Panel (when zone selected) */}
      <AnimatePresence>
        {selectedZoneData && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-200 bg-white overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-1">
                    {selectedZoneData.name}
                  </h4>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                                   ${statusConfig[selectedZoneData.status].bgLight}
                                   ${statusConfig[selectedZoneData.status].textColor}`}>
                    <div className={`w-2 h-2 rounded-full ${statusConfig[selectedZoneData.status].color}`} />
                    {statusConfig[selectedZoneData.status].label}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedZone(null)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-sm text-slate-600 mb-1">Progress</div>
                  <div className="text-2xl font-bold text-slate-900">{selectedZoneData.value}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-sm text-slate-600 mb-1">Items</div>
                  <div className="text-2xl font-bold text-slate-900">{selectedZoneData.count}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


