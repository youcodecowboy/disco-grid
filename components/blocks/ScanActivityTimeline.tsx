"use client"

import type React from "react"

interface ScanActivity {
  time: string
  user: string
  action: string
  location: string
  material: string
  count: number
}

interface ScanActivityTimelineProps {
  activities?: ScanActivity[]
}

const defaultActivities: ScanActivity[] = [
  {
    time: "14:32",
    user: "Jake M.",
    action: "Scanned In",
    location: "Gate B",
    material: "Steel Pipes",
    count: 100,
  },
  {
    time: "14:18",
    user: "Maria L.",
    action: "Installed",
    location: "Zone C",
    material: "Steel Pipe",
    count: 4,
  },
  {
    time: "13:55",
    user: "Carlos R.",
    action: "Moved",
    location: "Zone C → Staging",
    material: "Steel Pipes",
    count: 24,
  },
  {
    time: "13:22",
    user: "Maria L.",
    action: "Installed",
    location: "Zone C",
    material: "Steel Pipe",
    count: 8,
  },
  {
    time: "12:45",
    user: "Derek T.",
    action: "Scanned In",
    location: "Gate A",
    material: "Concrete Blocks",
    count: 250,
  },
  {
    time: "12:10",
    user: "Jake M.",
    action: "Quality Check",
    location: "Zone B",
    material: "Concrete Blocks",
    count: 150,
  },
  {
    time: "11:30",
    user: "Maria L.",
    action: "Installed",
    location: "Zone C",
    material: "Steel Pipe",
    count: 12,
  },
  {
    time: "10:55",
    user: "Carlos R.",
    action: "Moved",
    location: "Zone D → Zone C",
    material: "Rebar Bundle",
    count: 15,
  },
]

export default function ScanActivityTimeline({
  activities = defaultActivities,
}: ScanActivityTimelineProps) {
  const getActionColor = (action: string) => {
    switch (action) {
      case "Scanned In":
        return "bg-blue-500"
      case "Installed":
        return "bg-green-500"
      case "Moved":
        return "bg-amber-500"
      case "Quality Check":
        return "bg-purple-500"
      default:
        return "bg-slate-400"
    }
  }

  return (
    <div className="h-full w-full bg-gradient-to-b from-slate-50 to-white p-3 sm:p-4 md:p-6 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="mb-3 sm:mb-4 flex-shrink-0">
        <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-slate-800">
          Scan Activity
        </h3>
        <p className="text-[8px] sm:text-[10px] md:text-xs text-slate-500 mt-0.5">
          Real-time material tracking
        </p>
      </div>

      {/* Timeline */}
      <div className="flex-1 min-h-0 overflow-auto">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-slate-200" />

          {/* Activities */}
          <div className="space-y-3 sm:space-y-4">
            {activities.map((activity, idx) => (
              <div key={idx} className="relative flex gap-3 sm:gap-4">
                {/* Time */}
                <div className="w-10 sm:w-14 flex-shrink-0 text-right">
                  <span className="text-[8px] sm:text-[10px] md:text-xs font-medium text-slate-600">
                    {activity.time}
                  </span>
                </div>

                {/* Dot */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`
                      w-3 h-3 sm:w-4 sm:h-4 rounded-full ${getActionColor(activity.action)}
                      ring-4 ring-white relative z-10
                    `}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-2 sm:pb-3">
                  <div className="bg-white rounded-lg border border-slate-200 p-2 sm:p-3 shadow-sm">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-slate-800 truncate">
                          {activity.action}
                        </p>
                        <p className="text-[8px] sm:text-[10px] md:text-xs text-slate-600 truncate">
                          {activity.material} × {activity.count}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[8px] sm:text-[10px] md:text-xs text-slate-500">
                          {activity.user}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[8px] sm:text-[10px] md:text-xs text-slate-500">
                      <svg
                        className="w-2.5 h-2.5 sm:w-3 sm:h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="truncate">{activity.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats footer */}
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-200 flex-shrink-0">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="text-center">
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">247</p>
            <p className="text-[8px] sm:text-[10px] md:text-xs text-slate-500">Today</p>
          </div>
          <div className="text-center">
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">189</p>
            <p className="text-[8px] sm:text-[10px] md:text-xs text-slate-500">Installed</p>
          </div>
          <div className="text-center">
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">58</p>
            <p className="text-[8px] sm:text-[10px] md:text-xs text-slate-500">In Transit</p>
          </div>
        </div>
      </div>
    </div>
  )
}



