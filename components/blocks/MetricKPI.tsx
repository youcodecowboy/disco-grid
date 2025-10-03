import { cn } from "@/lib/utils"
import { BlockProps, MetricData } from "./types"

interface Props extends BlockProps {
  data: MetricData
  variant?: "kpi" | "chart" | "items"
}

export default function MetricKPI({ title, data, className = "", variant = "kpi" }: Props) {
  const { value = "0", delta = "", trend = [], timeRange } = data || {}

  const variantStyles: Record<Required<Props["variant"]>, { wrapper: string; chip: string; bar: string }> = {
    kpi: {
      wrapper: "bg-white/90 ring-slate-200/70",
      chip: "bg-slate-900/5 text-slate-600",
      bar: "bg-blue-500/60",
    },
    chart: {
      wrapper: "bg-gradient-to-br from-blue-500/10 via-white to-white ring-blue-200/70",
      chip: "bg-blue-500/10 text-blue-700",
      bar: "bg-blue-500/70",
    },
    items: {
      wrapper: "bg-gradient-to-br from-amber-400/10 via-white to-white ring-amber-200/70",
      chip: "bg-amber-500/10 text-amber-700",
      bar: "bg-amber-400/70",
    },
  }

  const chipLabel =
    variant === "chart" ? (timeRange ? `Trend · ${timeRange}` : "Trend") : variant === "items" ? "Inventory" : "Live"

  const deltaPositive = !delta.startsWith("-")
  const deltaClasses = delta
    ? deltaPositive
      ? "bg-emerald-500/10 text-emerald-700"
      : "bg-rose-500/10 text-rose-600"
    : "bg-slate-900/5 text-slate-500"

  const formattedTitle = title || (variant === "items" ? "Inventory metric" : "Key metric")

  return (
    <div
      className={cn(
        "relative flex h-full flex-col justify-between rounded-2xl p-5 text-slate-900 ring-1 shadow-sm transition-colors hover:shadow-md",
        variantStyles[variant].wrapper,
        className
      )}
      style={{ containerType: "inline-size" }}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold leading-tight text-slate-900">{formattedTitle}</span>
        <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium", variantStyles[variant].chip)}>
          {chipLabel}
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="flex flex-col gap-2">
          <span className="block text-3xl font-semibold leading-none" style={{ fontSize: "clamp(1.6rem, 10cqw, 2.6rem)" }}>
            {value}
          </span>
          {delta && (
            <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium", deltaClasses)}>
              {delta}
            </span>
          )}
        </div>

        {Array.isArray(trend) && trend.length > 0 && (
          <div
            className="flex-1 flex-shrink-0"
            style={{
              maxWidth: "clamp(72px, 35cqw, 140px)",
              minHeight: "clamp(36px, 12cqh, 60px)",
            }}
          >
            <div className="flex h-full items-end gap-1">
              {trend.map((point: number, index: number) => {
                const max = Math.max(...trend)
                const height = max === 0 ? 0 : (point / max) * 100
                return (
                  <div
                    key={index}
                    className={cn("flex-1 min-w-0 rounded-sm", variantStyles[variant].bar)}
                    style={{ height: `${height}%` }}
                  />
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 text-xs uppercase tracking-wide text-slate-500">
        {variant === "items" ? "Units" : "Performance"}
      </div>
    </div>
  )
}
