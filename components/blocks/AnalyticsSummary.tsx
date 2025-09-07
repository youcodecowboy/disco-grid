import React from 'react'

interface AnalyticsMetric {
  label: string
  value: number | string
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  format?: 'number' | 'percentage' | 'currency' | 'text'
  icon?: string
}

interface AnalyticsSummaryProps {
  title?: string
  data?: {
    metrics: AnalyticsMetric[]
    period: string
    lastUpdated: string
  }
}

export default function AnalyticsSummary({ 
  title = "Analytics Summary", 
  data 
}: AnalyticsSummaryProps) {
  const defaultData = {
    metrics: [
      {
        label: "Team Productivity",
        value: 87,
        change: 12.5,
        changeType: 'increase' as const,
        format: 'percentage' as const,
        icon: "📈"
      },
      {
        label: "Project Completion",
        value: 23,
        change: -2.1,
        changeType: 'decrease' as const,
        format: 'number' as const,
        icon: "✅"
      },
      {
        label: "Resource Utilization",
        value: 94,
        change: 5.2,
        changeType: 'increase' as const,
        format: 'percentage' as const,
        icon: "⚡"
      },
      {
        label: "Team Satisfaction",
        value: 4.8,
        change: 0.3,
        changeType: 'increase' as const,
        format: 'text' as const,
        icon: "😊"
      }
    ],
    period: "Last 30 days",
    lastUpdated: "2 hours ago"
  }

  const analyticsData = data || defaultData

  const formatValue = (value: number | string, format?: string) => {
    if (typeof value === 'string') return value
    
    switch (format) {
      case 'percentage':
        return `${value}%`
      case 'currency':
        return `$${value.toLocaleString()}`
      case 'text':
        return value.toString()
      default:
        return value.toLocaleString()
    }
  }

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600'
      case 'decrease':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return '↗'
      case 'decrease':
        return '↘'
      default:
        return '→'
    }
  }

  return (
    <div className="h-full flex flex-col p-3 sm:p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm font-semibold text-gray-900 truncate flex-1 min-w-0 mr-2">
          {title}
        </h3>
        <div className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs text-gray-500 flex-shrink-0">
          {analyticsData.period}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="flex-1 grid grid-cols-2 gap-2 sm:gap-3">
        {analyticsData.metrics.map((metric, index) => (
          <div 
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-2 sm:p-3 hover:shadow-sm transition-shadow"
          >
            {/* Metric Header */}
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <span className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs text-gray-600 truncate">
                {metric.label}
              </span>
              {metric.icon && (
                <span className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm flex-shrink-0">
                  {metric.icon}
                </span>
              )}
            </div>

            {/* Metric Value */}
            <div className="text-[10px] sm:text-[12px] md:text-[14px] lg:text-base font-bold text-gray-900 mb-1">
              {formatValue(metric.value, metric.format)}
            </div>

            {/* Change Indicator */}
            <div className="flex items-center space-x-1">
              <span className={`text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs font-medium ${getChangeColor(metric.changeType)}`}>
                {getChangeIcon(metric.changeType)}
              </span>
              <span className={`text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs font-medium ${getChangeColor(metric.changeType)}`}>
                {Math.abs(metric.change)}%
              </span>
              <span className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs text-gray-500">
                vs last period
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="text-center">
            <div className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm font-semibold text-gray-900">
              {analyticsData.metrics.filter(m => m.changeType === 'increase').length}
            </div>
            <div className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs text-green-600">
              Improving
            </div>
          </div>
          <div className="text-center">
            <div className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm font-semibold text-gray-900">
              {analyticsData.metrics.filter(m => m.changeType === 'decrease').length}
            </div>
            <div className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs text-red-600">
              Declining
            </div>
          </div>
          <div className="text-center">
            <div className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm font-semibold text-gray-900">
              {analyticsData.metrics.filter(m => m.changeType === 'neutral').length}
            </div>
            <div className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs text-gray-600">
              Stable
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs text-gray-500">
            Updated {analyticsData.lastUpdated}
          </span>
          <button className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs text-blue-600 hover:text-blue-700 font-medium">
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}

