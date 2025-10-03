"use client"

import type React from "react"

interface Delivery {
  time: string
  material: string
  status: "completed" | "in-transit" | "scheduled"
  gate: string
}

interface DeliveryTimelineCardProps {
  title?: string
  data?: {
    date: string
    deliveries: Delivery[]
  }
}

export default function DeliveryTimelineCard({ title, data }: DeliveryTimelineCardProps) {
  const {
    date = "Today",
    deliveries = []
  } = data || {}

  const getTruckIcon = (status: string) => {
    const color = status === "completed" ? "text-green-600" : status === "in-transit" ? "text-blue-600" : "text-slate-400"
    return (
      <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    )
  }

  const getStatusPill = (status: string) => {
    switch (status) {
      case "completed":
        return <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">✓</span>
      case "in-transit":
        return <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">→</span>
      case "scheduled":
        return <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">○</span>
      default:
        return null
    }
  }

  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-50 to-white p-3 sm:p-4 md:p-6 flex flex-col overflow-hidden gap-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide truncate">
            {title}
          </h3>
          <p className="text-[10px] sm:text-xs text-slate-500 truncate">
            {date}
          </p>
        </div>
        <span className="inline-flex px-2 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 flex-shrink-0">
          {deliveries.filter(d => d.status === "in-transit").length} IN TRANSIT
        </span>
      </div>

      {/* Timeline */}
      <div className="flex-1 min-h-0 overflow-auto space-y-2 sm:space-y-3">
        {deliveries.map((delivery, idx) => (
          <div key={idx} className="flex items-center gap-2 sm:gap-3">
            {/* Time */}
            <div className="w-10 sm:w-12 flex-shrink-0 text-right">
              <span className="text-[10px] sm:text-xs font-bold text-slate-700">
                {delivery.time}
              </span>
            </div>

            {/* Icon */}
            <div className="flex-shrink-0">
              {getTruckIcon(delivery.status)}
            </div>

            {/* Content */}
            <div className={`
              flex-1 min-w-0 rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 border
              ${delivery.status === "completed" ? "bg-green-50 border-green-200" : ""}
              ${delivery.status === "in-transit" ? "bg-blue-50 border-blue-200" : ""}
              ${delivery.status === "scheduled" ? "bg-slate-50 border-slate-200" : ""}
            `}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {delivery.material}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-slate-500 truncate">
                    {delivery.gate}
                  </p>
                </div>
                {getStatusPill(delivery.status)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Footer */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center border-t border-slate-200 pt-3">
        <div>
          <div className="text-base sm:text-lg md:text-xl font-bold text-green-600">
            {deliveries.filter(d => d.status === "completed").length}
          </div>
          <div className="text-[10px] sm:text-xs text-slate-500">Done</div>
        </div>
        <div>
          <div className="text-base sm:text-lg md:text-xl font-bold text-blue-600">
            {deliveries.filter(d => d.status === "in-transit").length}
          </div>
          <div className="text-[10px] sm:text-xs text-slate-500">Coming</div>
        </div>
        <div>
          <div className="text-base sm:text-lg md:text-xl font-bold text-slate-600">
            {deliveries.filter(d => d.status === "scheduled").length}
          </div>
          <div className="text-[10px] sm:text-xs text-slate-500">Later</div>
        </div>
      </div>
    </div>
  )
}