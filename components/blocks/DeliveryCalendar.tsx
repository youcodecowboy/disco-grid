"use client"

import type React from "react"

interface DeliveryEvent {
  date: string
  materials: string[]
  status: "completed" | "scheduled" | "delayed"
}

interface DeliveryCalendarProps {
  month?: string
  year?: number
  deliveries?: DeliveryEvent[]
}

const defaultDeliveries: DeliveryEvent[] = [
  { date: "2025-09-28", materials: ["Steel Pipes"], status: "completed" },
  { date: "2025-09-29", materials: ["Concrete"], status: "completed" },
  { date: "2025-09-30", materials: ["Electrical"], status: "completed" },
  { date: "2025-10-01", materials: ["Rebar"], status: "scheduled" },
  { date: "2025-10-02", materials: ["Steel Beams"], status: "delayed" },
  { date: "2025-10-03", materials: ["Lumber"], status: "scheduled" },
  { date: "2025-10-07", materials: ["Concrete Blocks"], status: "scheduled" },
]

export default function DeliveryCalendar({
  month = "October",
  year = 2025,
  deliveries = defaultDeliveries,
}: DeliveryCalendarProps) {
  // Generate calendar days for October 2025 (starts on Wednesday)
  const daysInMonth = 31
  const startDay = 3 // Wednesday
  const days = Array.from({ length: 42 }, (_, i) => {
    const dayNum = i - startDay + 1
    if (dayNum > 0 && dayNum <= daysInMonth) {
      return dayNum
    }
    return null
  })

  const getDeliveryForDate = (day: number) => {
    const dateStr = `2025-10-${String(day).padStart(2, "0")}`
    return deliveries.find((d) => d.date === dateStr)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 border-green-400 text-green-700"
      case "scheduled":
        return "bg-blue-100 border-blue-400 text-blue-700"
      case "delayed":
        return "bg-red-100 border-red-400 text-red-700"
      default:
        return "bg-slate-100"
    }
  }

  return (
    <div className="h-full w-full bg-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex-shrink-0">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-slate-800">
          Delivery Schedule
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          {month} {year}
        </p>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 min-h-0 flex flex-col p-3 sm:p-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 flex-shrink-0">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-[10px] sm:text-xs md:text-sm font-semibold text-slate-600 py-1"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="flex-1 min-h-0 overflow-auto">
          <div className="grid grid-cols-7 gap-1 sm:gap-2 auto-rows-fr">
            {days.map((day, idx) => {
              const delivery = day ? getDeliveryForDate(day) : null
              return (
                <div
                  key={idx}
                  className={`
                    min-h-[50px] sm:min-h-[60px] md:min-h-[70px]
                    border rounded p-1 sm:p-2
                    ${day ? "bg-white border-slate-200" : "bg-slate-50 border-slate-100"}
                    ${delivery ? getStatusColor(delivery.status) : ""}
                  `}
                >
                  {day && (
                    <>
                      <div className="text-[10px] sm:text-xs md:text-sm font-semibold">
                        {day}
                      </div>
                      {delivery && (
                        <div className="mt-1">
                          {delivery.materials.map((material, i) => (
                            <div
                              key={i}
                              className="text-[8px] sm:text-[10px] md:text-xs truncate mt-0.5"
                            >
                              {material}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex-shrink-0 flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-400" />
          <span className="text-slate-600 font-medium">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-400" />
          <span className="text-slate-600 font-medium">Scheduled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-400" />
          <span className="text-slate-600 font-medium">Delayed</span>
        </div>
      </div>
    </div>
  )
}
