"use client"

interface DataPoint {
  name: string
  value: number
}

interface ChartBarV3Props {
  title?: string
  data?: DataPoint[]
}

export default function ChartBarV3({ title, data = [] }: ChartBarV3Props) {
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

  return (
    <div className="h-full w-full bg-white rounded-lg overflow-hidden flex flex-col p-6">
      {/* Title Header */}
      {title && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        </div>
      )}
      
      {/* Chart Area */}
      <div className="flex-1 flex items-end gap-4 min-h-0">
        {data.map((point, i) => {
          const heightPercent = (point.value / maxValue) * 100
          const colors = [
            'bg-blue-500',
            'bg-purple-500',
            'bg-emerald-500',
            'bg-amber-500',
            'bg-rose-500',
            'bg-cyan-500',
          ]
          const color = colors[i % colors.length]
          
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              {/* Bar */}
              <div className="w-full relative group">
                <div
                  className={`${color} rounded-t-lg transition-all duration-500 ease-out hover:opacity-80 relative`}
                  style={{ height: `${heightPercent}%`, minHeight: '4px' }}
                >
                  {/* Value tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {point.value.toLocaleString()}
                  </div>
                </div>
              </div>
              
              {/* Label */}
              <span className="text-xs text-slate-600 font-medium text-center">
                {point.name}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}



