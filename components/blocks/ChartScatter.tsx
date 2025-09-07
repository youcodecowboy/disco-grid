import React from 'react'

interface ScatterPoint {
  x: number
  y: number
  label?: string
  category?: string
  size?: number
}

interface ChartScatterProps {
  title?: string
  data?: {
    points: ScatterPoint[]
    xAxis: {
      label: string
      min: number
      max: number
    }
    yAxis: {
      label: string
      min: number
      max: number
    }
    categories?: string[]
  }
}

export default function ChartScatter({ 
  title = "Scatter Plot", 
  data 
}: ChartScatterProps) {
  const defaultData = {
    points: [
      { x: 20, y: 85, label: "Team A", category: "Engineering", size: 8 },
      { x: 35, y: 92, label: "Team B", category: "Design", size: 6 },
      { x: 50, y: 78, label: "Team C", category: "Product", size: 10 },
      { x: 65, y: 95, label: "Team D", category: "Engineering", size: 7 },
      { x: 80, y: 88, label: "Team E", category: "Design", size: 9 },
      { x: 25, y: 82, label: "Team F", category: "Product", size: 5 },
      { x: 45, y: 90, label: "Team G", category: "Engineering", size: 8 },
      { x: 70, y: 75, label: "Team H", category: "Design", size: 6 },
      { x: 30, y: 87, label: "Team I", category: "Product", size: 7 },
      { x: 55, y: 93, label: "Team J", category: "Engineering", size: 9 }
    ],
    xAxis: {
      label: "Workload",
      min: 0,
      max: 100
    },
    yAxis: {
      label: "Performance",
      min: 0,
      max: 100
    },
    categories: ["Engineering", "Design", "Product"]
  }

  const chartData = data || defaultData
  const { points, xAxis, yAxis, categories } = chartData

  // Calculate chart dimensions
  const chartWidth = 100
  const chartHeight = 100
  const padding = 10

  // Scale points to chart coordinates
  const scaleX = (value: number) => {
    return ((value - xAxis.min) / (xAxis.max - xAxis.min)) * (chartWidth - 2 * padding) + padding
  }

  const scaleY = (value: number) => {
    return chartHeight - (((value - yAxis.min) / (yAxis.max - yAxis.min)) * (chartHeight - 2 * padding) + padding)
  }

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'Engineering':
        return 'fill-blue-500'
      case 'Design':
        return 'fill-purple-500'
      case 'Product':
        return 'fill-green-500'
      default:
        return 'fill-gray-500'
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
          {points.length} points
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex-1 relative">
        <svg 
          className="w-full h-full" 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid Lines */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f3f4f6" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Axes */}
          <line 
            x1={padding} y1={padding} x2={padding} y2={chartHeight - padding} 
            stroke="#d1d5db" strokeWidth="1"
          />
          <line 
            x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} 
            stroke="#d1d5db" strokeWidth="1"
          />

          {/* Axis Labels */}
          <text 
            x={chartWidth / 2} y={chartHeight - 2} 
            textAnchor="middle" 
            className="text-[4px] sm:text-[6px] md:text-[8px] lg:text-[10px] fill-gray-600"
          >
            {xAxis.label}
          </text>
          <text 
            x={2} y={chartHeight / 2} 
            textAnchor="middle" 
            transform={`rotate(-90, 2, ${chartHeight / 2})`}
            className="text-[4px] sm:text-[6px] md:text-[8px] lg:text-[10px] fill-gray-600"
          >
            {yAxis.label}
          </text>

          {/* Data Points */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={scaleX(point.x)}
              cy={scaleY(point.y)}
              r={point.size ? point.size / 10 : 0.8}
              className={`${getCategoryColor(point.category)} opacity-80 hover:opacity-100 transition-opacity cursor-pointer`}
            >
              <title>{point.label || `Point ${index + 1}`}</title>
            </circle>
          ))}

          {/* Trend Line (simplified) */}
          <path
            d={`M ${scaleX(20)} ${scaleY(85)} L ${scaleX(80)} ${scaleY(88)}`}
            stroke="#3b82f6"
            strokeWidth="1"
            strokeDasharray="2,2"
            fill="none"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* Legend */}
      {categories && categories.length > 0 && (
        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {categories.map((category, index) => (
              <div key={index} className="flex items-center space-x-1">
                <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${getCategoryColor(category)}`} />
                <span className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs text-gray-600">
                  {category}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="text-center">
            <div className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs font-medium text-gray-900">
              {Math.round(points.reduce((sum, p) => sum + p.x, 0) / points.length)}
            </div>
            <div className="text-[4px] sm:text-[6px] md:text-[8px] lg:text-[10px] text-gray-500">
              Avg {xAxis.label}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs font-medium text-gray-900">
              {Math.round(points.reduce((sum, p) => sum + p.y, 0) / points.length)}
            </div>
            <div className="text-[4px] sm:text-[6px] md:text-[8px] lg:text-[10px] text-gray-500">
              Avg {yAxis.label}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

