import type { Block } from "@/app/page"

interface CalendarDay {
  date: number
  events: number
  isToday: boolean
}

interface Props {
  block: Block
}

export default function CalendarMini({ block }: Props) {
  const { month = "January 2024", days = [] } = block.props || {}
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"]

  return (
    <div className="p-4">
      <div className="text-xs font-medium text-center mb-3">{month}</div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day, i) => (
          <div key={i} className="text-xs text-muted-foreground text-center p-1">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day: CalendarDay, i: number) => (
          <div
            key={i}
            className={`text-xs text-center p-1 rounded relative ${
              day.isToday ? "bg-blue-500 text-white" : "hover:bg-muted/50"
            }`}
          >
            {day.date}
            {day.events > 0 && (
              <div className="flex justify-center gap-0.5 mt-0.5">
                {Array.from({ length: Math.min(day.events, 3) }, (_, i) => (
                  <div key={i} className="w-1 h-1 bg-blue-500 rounded-full" />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
