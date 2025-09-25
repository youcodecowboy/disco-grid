import type { Block } from "@/app/page"

interface DataPoint {
  name: string
  value: number
}

interface Props {
  block: Block
}

export default function ChartLine({ block }: Props) {
  const data = block.props?.data || []
  const color = block.props?.color || "#3b82f6"

  if (data.length === 0) return <div className="p-4 text-center text-muted-foreground">No data</div>

  const maxY = Math.max(...data.map((p: DataPoint) => p.value))
  const minY = Math.min(...data.map((p: DataPoint) => p.value))
  const range = maxY - minY || 1

  return (
    <div className="p-2 h-full flex flex-col" style={{ containerType: "inline-size" }}>
      <div className="flex-1 relative">
        <svg className="w-full h-full" viewBox="0 0 320 120" preserveAspectRatio="xMidYMid meet">
          <path
            d={data
              .map((point: DataPoint, i: number) => {
                const x = (i / (data.length - 1)) * 300 + 10
                const y = 100 - ((point.value - minY) / range) * 80
                return `${i === 0 ? "M" : "L"} ${x} ${y}`
              })
              .join(" ")}
            fill="none"
            stroke={color}
            strokeWidth="2"
          />
          {/* Add dots for each data point */}
          {data.map((point: DataPoint, i: number) => {
            const x = (i / (data.length - 1)) * 300 + 10
            const y = 100 - ((point.value - minY) / range) * 80
            return <circle key={i} cx={x} cy={y} r="3" fill={color} />
          })}
        </svg>
      </div>
      <div className="flex justify-between text-xs text-muted-foreground px-1">
        {data.map((point: DataPoint, i: number) => (
          <span key={i} className="truncate">
            {point.name}
          </span>
        ))}
      </div>
    </div>
  )
}
