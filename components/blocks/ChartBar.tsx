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

export default function ChartBar({ block }: Props) {
  const series = block.props?.series || []
  if (series.length === 0) return <div className="p-4 text-center text-muted-foreground">No data</div>

  const allPoints = series.flatMap((s: Series) => s.points)
  const maxY = Math.max(...allPoints.map((p: DataPoint) => p.y))

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex-1 flex items-end justify-between gap-1">
        {series[0]?.points.map((point: DataPoint, i: number) => (
          <div key={i} className="flex flex-col items-center gap-1 flex-1">
            <div className="flex gap-0.5 items-end h-24">
              {series.map((s: Series, seriesIndex: number) => (
                <div
                  key={seriesIndex}
                  className={`w-3 ${seriesIndex === 0 ? "bg-blue-500" : "bg-red-500"}`}
                  style={{ height: `${(s.points[i].y / maxY) * 100}%` }}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(point.x).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
