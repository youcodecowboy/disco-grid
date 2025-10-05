type OrderProgressBarProps = {
  progressPercent: number
  completedItems: number
  totalItems: number
  className?: string
}

export function OrderProgressBar({ 
  progressPercent, 
  completedItems, 
  totalItems, 
  className = "" 
}: OrderProgressBarProps) {
  const getProgressColor = (percent: number) => {
    if (percent === 100) return "bg-green-500"
    if (percent > 50) return "bg-blue-500"
    if (percent > 0) return "bg-yellow-500"
    return "bg-gray-300"
  }

  return (
    <div className={`w-32 ${className}`}>
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progressPercent)}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-xs font-medium text-gray-700 min-w-[36px] text-right">
          {progressPercent}%
        </span>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {completedItems.toLocaleString()} / {totalItems.toLocaleString()} items
      </div>
    </div>
  )
}
