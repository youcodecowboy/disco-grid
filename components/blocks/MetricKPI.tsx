import { BlockProps, MetricData } from "./types"

interface Props extends BlockProps {
  data: MetricData
}

export default function MetricKPI({ title, data, className = "" }: Props) {
  const { value = "0", delta = "No change", trend = [] } = data || {}

  return (
    <div
      className="h-full flex flex-col p-2 overflow-hidden"
      style={{ containerType: "inline-size" }}
    >
      {/* First line: METRIC + GRAPH */}
      <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
        {/* Metric value */}
        <div
          className="font-bold text-gray-900 truncate min-w-0"
          // Clamp by container width: min 1rem, scale with 12cqw, max 1.75rem
          // This keeps numbers readable but prevents overflow at small widths
          style={{ fontSize: "clamp(1rem, 12cqw, 1.75rem)" }}
        >
          {value}
        </div>
        
        {/* Trend chart */}
        {Array.isArray(trend) && trend.length > 0 && (
          <div
            className="flex-shrink-0"
            style={{
              height: "clamp(16px, 8cqh, 40px)",
              width: "clamp(48px, 35%, 96px)",
            }}
          >
            <div className="flex items-end gap-1 h-full">
              {trend.map((point: number, i: number) => (
                <div
                  key={i}
                  className="bg-gray-300 flex-1 min-w-0 rounded-sm"
                  style={{ height: `${(point / Math.max(...trend)) * 100}%` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

              {/* Second line: NAME + TREND */}
        <div className="flex items-center justify-between min-h-0 gap-2">
          {/* Title - Better responsive scaling */}
          <div
            className="font-medium text-gray-600 truncate flex-1 min-w-0"
            style={{ fontSize: "clamp(0.5rem, 4.5cqw, 0.75rem)" }}
          >
            {title || "KPI Metric"}
          </div>
          
          {/* Delta indicator */}
          <div
            className="text-gray-600 flex-shrink-0"
            style={{ fontSize: "clamp(0.5rem, 4.5cqw, 0.75rem)" }}
          >
            {delta}
          </div>
        </div>
    </div>
  )
}
