import type { Block } from "@/app/page"

interface Slice {
  label: string
  value: number
}

interface Props {
  block: Block
}

export default function ChartDonut({ block }: Props) {
  const slices = block.props?.slices || []
  if (slices.length === 0) return <div className="p-4 text-center text-muted-foreground">No data</div>

  const total = slices.reduce((sum: number, slice: Slice) => sum + slice.value, 0)
  const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"]

  let currentAngle = 0
  const paths = slices.map((slice: Slice, i: number) => {
    const angle = (slice.value / total) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    currentAngle += angle

    const startX = 50 + 35 * Math.cos((startAngle - 90) * (Math.PI / 180))
    const startY = 50 + 35 * Math.sin((startAngle - 90) * (Math.PI / 180))
    const endX = 50 + 35 * Math.cos((endAngle - 90) * (Math.PI / 180))
    const endY = 50 + 35 * Math.sin((endAngle - 90) * (Math.PI / 180))

    const largeArcFlag = angle > 180 ? 1 : 0

    return {
      path: `M 50 50 L ${startX} ${startY} A 35 35 0 ${largeArcFlag} 1 ${endX} ${endY} Z`,
      color: colors[i % colors.length],
      label: slice.label,
      value: slice.value,
    }
  })

  return (
    <div className="p-4 h-full flex items-center gap-4" style={{ containerType: "inline-size" }}>
      <div className="flex-shrink-0">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="35" fill="none" stroke="#f1f5f9" strokeWidth="2" />
          {paths.map((path, i) => (
            <path key={i} d={path.path} fill={path.color} />
          ))}
          <circle cx="50" cy="50" r="15" fill="white" />
        </svg>
      </div>
      <div className="flex-1 space-y-1">
        {paths.map((path, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: path.color }} />
            <span className="flex-1">{path.label}</span>
            <span className="font-medium">{path.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
