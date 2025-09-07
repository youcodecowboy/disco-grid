"use client"

import React from 'react'
import { BlockProps } from './types'
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns'

interface DeliveryEvent {
  date: string // ISO date string
  po: string
  supplier: string
  category: string
  items?: number
  status?: 'pending' | 'confirmed' | 'delayed'
}

interface InboundWeekData {
  startDate?: string // optional ISO, defaults to current week
  deliveries?: DeliveryEvent[]
}

interface Props extends BlockProps {
  data: InboundWeekData
}

const statusStyles: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-800 border-green-200',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  delayed: 'bg-red-100 text-red-800 border-red-200',
}

export default function InboundWeek({ title = 'Inbound Shipments (Week)', data, className = '', hideTitle }: Props) {
  const today = new Date()
  const weekStart = data?.startDate ? startOfWeek(parseISO(data.startDate), { weekStartsOn: 1 }) : startOfWeek(today, { weekStartsOn: 1 })
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const deliveries = Array.isArray(data?.deliveries) ? data.deliveries : []

  const byDay = days.map((day) => ({
    date: day,
    events: deliveries.filter((ev) => isSameDay(parseISO(ev.date), day)),
  }))

  return (
    <div className={`h-full flex flex-col ${hideTitle ? 'p-2 sm:p-3' : 'p-3 sm:p-4'} ${className}`}>
      {!hideTitle && (
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h3 className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm font-semibold text-gray-900 truncate flex-1 min-w-0 mr-2">
            {title}
          </h3>
          <div className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs text-gray-500">
            {format(days[0], 'MMM d')} – {format(days[6], 'MMM d')}
          </div>
        </div>
      )}

      <div className="grid grid-cols-7 gap-2 flex-1 min-h-0">
        {byDay.map(({ date, events }, idx) => (
          <div key={idx} className="flex flex-col border rounded-md p-1.5 sm:p-2 overflow-hidden">
            <div className="flex items-center justify-between mb-1">
              <div className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs font-medium text-gray-700">
                {format(date, 'EEE')}
              </div>
              <div className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs text-gray-500">
                {format(date, 'd')}
              </div>
            </div>

            <div className="space-y-1 overflow-auto">
              {events.length === 0 ? (
                <div className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs text-gray-400 italic">No deliveries</div>
              ) : (
                events.map((ev, i) => (
                  <div
                    key={`${ev.po}-${i}`}
                    className={`border rounded px-1.5 py-1 ${statusStyles[ev.status || 'pending'] || statusStyles['pending']}`}
                    title={`${ev.po} • ${ev.supplier}`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <div className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs font-medium truncate">{ev.po}</div>
                      {typeof ev.items === 'number' && (
                        <div className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs opacity-80">{ev.items}</div>
                      )}
                    </div>
                    <div className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-[10px] truncate">{ev.supplier}</div>
                    <div className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-[10px] opacity-80 truncate">{ev.category}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
