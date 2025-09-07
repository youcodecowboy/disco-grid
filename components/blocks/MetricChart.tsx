"use client"

import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface MetricChartProps {
  title: string
  value: string
  trend: string
  trendDirection: 'up' | 'down' | 'neutral'
  description?: string
  className?: string
}

export function MetricChart({
  title,
  value,
  trend,
  trendDirection,
  description,
  className = ""
}: MetricChartProps) {
  const getTrendIcon = () => {
    switch (trendDirection) {
      case 'up':
        return <TrendingUp className="h-2 w-2 text-green-600" />
      case 'down':
        return <TrendingDown className="h-2 w-2 text-red-600" />
      default:
        return null
    }
  }

  const getTrendColor = () => {
    switch (trendDirection) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className={`h-full flex flex-col p-2 ${className}`}>
      {/* First line: METRIC + GRAPH */}
      <div className="flex-1 flex items-center justify-between">
        {/* Metric value */}
        <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
          {value}
        </div>
        
        {/* Graph */}
        <div className="h-6 sm:h-8 md:h-10 w-16 sm:w-20 md:w-24">
          <svg width="100%" height="100%" viewBox="0 0 100 20" className="overflow-visible">
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={trendDirection === 'up' ? '#10B981' : '#EF4444'} stopOpacity="0.3" />
                <stop offset="100%" stopColor={trendDirection === 'up' ? '#10B981' : '#EF4444'} stopOpacity="0.1" />
              </linearGradient>
            </defs>
            
            <path
              d={trendDirection === 'up' 
                ? "M0,12 Q10,10 20,8 Q30,6 40,4 Q50,2 60,3 Q70,5 80,6 Q90,7 100,5"
                : "M0,3 Q10,5 20,7 Q30,9 40,12 Q50,15 60,13 Q70,11 80,9 Q90,8 100,10"
              }
              fill="url(#chartGradient)"
              stroke={trendDirection === 'up' ? '#10B981' : '#EF4444'}
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Second line: NAME + TREND */}
      <div className="flex items-center justify-between">
        {/* Title */}
        <div className="text-[10px] sm:text-xs font-medium text-gray-600 truncate">
          {title}
        </div>
        
        {/* Trend indicator */}
        <div className={`flex items-center gap-1 text-[10px] sm:text-xs ${getTrendColor()}`}>
          {getTrendIcon()}
          <span>{trend}</span>
        </div>
      </div>
    </div>
  )
}
