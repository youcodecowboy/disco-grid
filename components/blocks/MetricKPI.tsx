import type { Block } from "@/app/page"

interface Props {
  block: Block
}

export default function MetricKPI({ block }: Props) {
  const { value = "0", delta = "No change", trend = [] } = block.props || {}

  return (
    <div className="p-4 flex flex-col justify-center h-full">
      <div className="text-3xl font-bold text-foreground mb-2 leading-tight">{value}</div>
      <div className="text-xs text-muted-foreground mb-3 leading-normal">{delta}</div>
      {trend.length > 0 && (
        <div className="flex items-end gap-0.5 h-8">
          {trend.map((point: number, i: number) => (
            <div
              key={i}
              className="bg-muted-foreground/20 flex-1 min-w-0"
              style={{ height: `${(point / Math.max(...trend)) * 100}%` }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
