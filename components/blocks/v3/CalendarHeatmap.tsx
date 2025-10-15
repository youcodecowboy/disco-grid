"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'

interface HeatmapDay {
  date: string // YYYY-MM-DD
  value: number // 0-100
  count?: number
}

interface CalendarHeatmapV3Props {
  title?: string
  data?: HeatmapDay[]
  months?: number // Number of months to show (default 6)
}

// Generate default data for the last N months
function generateDefaultData(months: number = 6): HeatmapDay[] {
  const data: HeatmapDay[] = []
  const today = new Date()
  const daysToGenerate = months * 30

  for (let i = daysToGenerate; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // Generate realistic pattern (weekdays more active, random intensity)
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const baseValue = isWeekend ? 20 : 60
    const randomness = Math.random() * 40
    const value = Math.min(100, Math.max(0, baseValue + randomness))
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value),
      count: Math.round(value / 10)
    })
  }

  return data
}

// Get color based on value
function getHeatColor(value: number): string {
  if (value === 0) return 'bg-slate-100'
  if (value < 25) return 'bg-emerald-200'
  if (value < 50) return 'bg-emerald-400'
  if (value < 75) return 'bg-emerald-600'
  return 'bg-emerald-700'
}

function getHeatColorRGB(value: number): string {
  if (value === 0) return 'rgb(241, 245, 249)'
  if (value < 25) return 'rgb(167, 243, 208)'
  if (value < 50) return 'rgb(52, 211, 153)'
  if (value < 75) return 'rgb(5, 150, 105)'
  return 'rgb(4, 120, 87)'
}

export default function CalendarHeatmapV3({ 
  title, 
  data,
  months = 6
}: CalendarHeatmapV3Props) {
  const heatmapData = data || generateDefaultData(months)
  const [hoveredDay, setHoveredDay] = useState<HeatmapDay | null>(null)

  // Organize data by weeks
  const weeks: HeatmapDay[][] = []
  let currentWeek: HeatmapDay[] = []
  
  heatmapData.forEach((day, index) => {
    const date = new Date(day.date)
    const dayOfWeek = date.getDay()
    
    // Start new week on Sunday
    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek)
      currentWeek = []
    }
    
    // Pad beginning of first week
    if (index === 0 && dayOfWeek !== 0) {
      for (let i = 0; i < dayOfWeek; i++) {
        currentWeek.push({ date: '', value: -1 }) // Empty placeholder
      }
    }
    
    currentWeek.push(day)
  })
  
  if (currentWeek.length > 0) {
    weeks.push(currentWeek)
  }

  // Calculate stats
  const totalDays = heatmapData.filter(d => d.value > 0).length
  const totalCount = heatmapData.reduce((sum, d) => sum + (d.count || 0), 0)
  const avgPerDay = totalDays > 0 ? Math.round(totalCount / totalDays) : 0
  const maxDay = heatmapData.reduce((max, d) => d.value > max.value ? d : max, heatmapData[0])

  // Month labels
  const monthLabels: string[] = []
  let lastMonth = ''
  weeks.forEach((week, weekIndex) => {
    const firstValidDay = week.find(d => d.value >= 0)
    if (firstValidDay && firstValidDay.date) {
      const date = new Date(firstValidDay.date)
      const monthName = date.toLocaleDateString('en-US', { month: 'short' })
      if (monthName !== lastMonth && weekIndex % 4 === 0) {
        monthLabels.push(monthName)
        lastMonth = monthName
      } else {
        monthLabels.push('')
      }
    } else {
      monthLabels.push('')
    }
  })

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="h-full w-full bg-white rounded-lg overflow-hidden flex flex-col">
      {/* Title Header */}
      {title && (
        <div className="px-6 py-4 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="text-slate-600">
                <span className="font-semibold text-slate-900">{totalDays}</span> active days
              </div>
              <div className="text-slate-600">
                Avg: <span className="font-semibold text-slate-900">{avgPerDay}</span> per day
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="flex-1 p-6 overflow-auto flex items-center justify-center">
        <div className="relative">
          {/* Month labels */}
          <div className="flex gap-1 mb-2 ml-8">
            {monthLabels.map((label, i) => (
              <div key={i} className="text-xs text-slate-500 font-medium" style={{ width: '14px' }}>
                {label}
              </div>
            ))}
          </div>

          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col gap-1 mr-2">
              {dayLabels.map((day, i) => (
                <div
                  key={day}
                  className="text-xs text-slate-500 font-medium h-3.5 flex items-center"
                  style={{ display: i % 2 === 1 ? 'flex' : 'none' }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => {
                    const isHovered = hoveredDay?.date === day.date
                    const isEmpty = day.value < 0

                    if (isEmpty) {
                      return <div key={dayIndex} className="w-3.5 h-3.5" />
                    }

                    return (
                      <motion.div
                        key={dayIndex}
                        className={`w-3.5 h-3.5 rounded-sm cursor-pointer
                                 ${getHeatColor(day.value)}
                                 ${isHovered ? 'ring-2 ring-slate-900 ring-offset-1' : ''}
                                 transition-all`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          delay: (weekIndex * 7 + dayIndex) * 0.002,
                          type: 'spring',
                          stiffness: 500
                        }}
                        whileHover={{ scale: 1.3 }}
                        onMouseEnter={() => setHoveredDay(day)}
                        onMouseLeave={() => setHoveredDay(null)}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Hover tooltip */}
          {hoveredDay && hoveredDay.value >= 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute z-10 pointer-events-none"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="bg-slate-900 text-white px-3 py-2 rounded-lg shadow-xl whitespace-nowrap">
                <div className="text-xs font-semibold">
                  {new Date(hoveredDay.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
                <div className="text-sm font-bold mt-1">
                  {hoveredDay.count} {hoveredDay.count === 1 ? 'item' : 'items'}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Legend Footer */}
      <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-600">Less</span>
          <div className="flex gap-1">
            <div className="w-3.5 h-3.5 rounded-sm bg-slate-100" />
            <div className="w-3.5 h-3.5 rounded-sm bg-emerald-200" />
            <div className="w-3.5 h-3.5 rounded-sm bg-emerald-400" />
            <div className="w-3.5 h-3.5 rounded-sm bg-emerald-600" />
            <div className="w-3.5 h-3.5 rounded-sm bg-emerald-700" />
          </div>
          <span className="text-xs font-medium text-slate-600">More</span>
        </div>
      </div>
    </div>
  )
}


