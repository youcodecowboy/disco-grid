import type { Block } from "@/app/page"

interface DataPoint {
  x: string
  y: number
}

interface Series {
  name: string
  points: DataPoint[]
}

interface Props {
  block: Block
}

export default function ChartArea({ block }: Props) {
  const series = block.props?.series || []
  if (series.length === 0) return <div className="p-4 text-center text-muted-foreground">No data</div>

  const s = series[0]
  const maxY = Math.max(...s.points.map((p: DataPoint) => p.y))
  const minY = Math.min(...s.points.map((p: DataPoint) => p.y))
  const range = maxY - minY || 1

  const pathData = s.points
    .map((point: DataPoint, i: number) => {
      const x = (i / (s.points.length - 1)) * 280 + 10
      const y = 140 - ((point.y - minY) / range) * 120
      return `${i === 0 ? "M" : "L"} ${x} ${y}`
    })
    .join(" ")

  const areaPath = `${pathData} L 290 140 L 10 140 Z`

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex-1 relative">
        <svg className="w-full h-full" viewBox="0 0 300 150">
          <path d={areaPath} fill="#3b82f6" fillOpacity="0.1" />
          <path d={pathData} fill="none" stroke="#3b82f6" strokeWidth="2" />
        </svg>
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mt-2">
        {s.points.slice(0, 3).map((point: DataPoint, i: number) => (
          <span key={i}>{new Date(point.x).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
        ))}
      </div>
    </div>
  )
}
