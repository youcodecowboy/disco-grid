import { cn } from "@/lib/utils"
import { BlockProps, MetricData } from "./types"

interface Props extends BlockProps {
  data: MetricData
  variant?: "kpi" | "chart" | "items"
}

export default function MetricKPI({ title, data, className = "", variant = "kpi" }: Props) {
  const { value = "0", delta = "No change", trend = [], timeRange } = data || {}

  const variantStyles: Record<Required<Props["variant"]>, { wrapper: string; chip: string }> = {
    kpi: {
      wrapper: "bg-card",
      chip: "bg-muted text-muted-foreground",
    },
    chart: {
      wrapper: "bg-gradient-to-br from-blue-50 to-purple-50",
      chip: "bg-blue-100 text-blue-700",
    },
    items: {
      wrapper: "bg-gradient-to-br from-amber-50 to-orange-50",
      chip: "bg-amber-100 text-amber-700",
    },
  }

  const chipLabel = variant === "chart" ? (timeRange ? `Trend • ${timeRange}` : "Trend") : variant === "items" ? "Inventory" : "KPI"

  return (
    <div
      className={cn(
        "h-full flex flex-col overflow-hidden rounded-lg border border-border/60 p-3 transition-colors",
        variantStyles[variant].wrapper,
        className,
      )}
      style={{ containerType: "inline-size" }}
    >
      <div className="flex items-center justify-between gap-2 pb-2">
        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", variantStyles[variant].chip)}>
          {chipLabel}
        </span>
        <span className="text-[11px] text-muted-foreground">{variant === "items" ? "Units" : "Live"}</span>
      </div>

      <div className="flex-1 flex items-center justify-between gap-3 min-w-0">
        <div
          className="font-bold text-gray-900 truncate min-w-0"
          style={{ fontSize: "clamp(1rem, 12cqw, 2.25rem)" }}
        >
          {value}
        </div>

        {Array.isArray(trend) && trend.length > 0 && (
          <div
            className="flex-shrink-0"
            style={{
              height: "clamp(20px, 10cqh, 48px)",
              width: variant === "chart" ? "clamp(72px, 45%, 160px)" : "clamp(48px, 35%, 120px)",
            }}
          >
            <div className="flex items-end gap-1 h-full">
              {trend.map((point: number, index: number) => {
                const max = Math.max(...trend)
                const height = max === 0 ? 0 : (point / max) * 100
                return (
                  <div
                    key={index}
                    className={cn(
                      "flex-1 min-w-0 rounded-sm",
                      variant === "items" ? "bg-amber-400/60" : "bg-blue-500/50",
                    )}
                    style={{ height: `${height}%` }}
                  />
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 pt-2">
        <div
          className="font-medium text-muted-foreground truncate flex-1 min-w-0"
          style={{ fontSize: "clamp(0.65rem, 4.5cqw, 0.9rem)" }}
        >
          {title || (variant === "items" ? "Inventory Metric" : "KPI Metric")}
        </div>
        <div
          className={cn(
            "flex-shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium",
            variant === "items" ? "bg-amber-500/10 text-amber-700" : "bg-emerald-500/10 text-emerald-700",
          )}
        >
          {delta}
        </div>
      </div>
    </div>
  )
}
