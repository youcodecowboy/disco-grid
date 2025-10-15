"use client"

interface DataPoint {
  name: string
  value: number
}

interface ChartAreaV3Props {
  title?: string
  data?: DataPoint[]
}

export default function ChartAreaV3({ title, data = [] }: ChartAreaV3Props) {
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
  const minValue = Math.min(...data.map(d => d.value))
  const range = maxValue - minValue || 1

  return (
    <div className="h-full w-full bg-white rounded-lg overflow-hidden flex flex-col">
      {/* Title Header */}
      {title && (
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        </div>
      )}
      
      {/* Chart Area */}
      <div className="flex-1 relative min-h-0 p-4">
        <svg 
          className="w-full h-full" 
          viewBox="0 0 400 200" 
          preserveAspectRatio="xMidYMid meet"
          style={{ maxHeight: '100%' }}
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((percent, i) => (
            <line
              key={i}
              x1="10"
              y1={190 - percent * 170}
              x2="390"
              y2={190 - percent * 170}
              stroke="#e2e8f0"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}

          {/* Area fill */}
          <defs>
            <linearGradient id={`gradient-${data[0]?.name || 'default'}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          <path
            d={`
              M 10 190
              ${data.map((point, i) => {
                const x = 10 + (i / (data.length - 1)) * 380
                const y = 190 - ((point.value - minValue) / range) * 170
                return `L ${x} ${y}`
              }).join(' ')}
              L 390 190
              Z
            `}
            fill={`url(#gradient-${data[0]?.name || 'default'})`}
          />

          {/* Line */}
          <path
            d={data.map((point, i) => {
              const x = 10 + (i / (data.length - 1)) * 380
              const y = 190 - ((point.value - minValue) / range) * 170
              return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
            }).join(' ')}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {data.map((point, i) => {
            const x = 10 + (i / (data.length - 1)) * 380
            const y = 190 - ((point.value - minValue) / range) * 170
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3.5"
                fill="#3b82f6"
                stroke="white"
                strokeWidth="2"
              />
            )
          })}
        </svg>
      </div>

      {/* X-axis labels - compact */}
      <div className="flex justify-between px-6 pb-3">
        {data.map((point, i) => {
          // Show first, middle, last for datasets > 5
          const showLabel = data.length <= 5 || i === 0 || i === Math.floor(data.length / 2) || i === data.length - 1
          return showLabel ? (
            <span key={i} className="text-[10px] text-slate-500 font-medium">
              {point.name}
            </span>
          ) : <span key={i} />
        })}
      </div>
    </div>
  )
}

