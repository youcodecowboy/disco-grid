"use client"

import React from 'react'
import { BlockProps } from './types'
import { format, parseISO } from 'date-fns'

interface OverdueItem {
  po: string
  supplier: string
  category: string
  eta: string // ISO date
  daysOverdue: number
}

interface OverdueData {
  items?: OverdueItem[]
}

interface Props extends BlockProps {
  data: OverdueData
}

export default function OverdueShipments({ title = 'Overdue Shipments', data, className = '', hideTitle }: Props) {
  const items = Array.isArray(data?.items) ? data.items : []

  const colorForDays = (d: number) => (d >= 14 ? 'text-red-700 bg-red-100' : d >= 7 ? 'text-orange-700 bg-orange-100' : 'text-yellow-700 bg-yellow-100')

  return (
    <div className={`h-full flex flex-col ${hideTitle ? 'p-2 sm:p-3' : 'p-3 sm:p-4'} ${className}`}>
      {!hideTitle && (
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm font-semibold text-gray-900 truncate">{title}</h3>
          <div className="text-[6px] sm:text-[8px] md:text-[10px] text-gray-500">{items.length} total</div>
        </div>
      )}
      <div className="space-y-2 overflow-auto">
        {items.length === 0 && (
          <div className="text-[6px] sm:text-[8px] md:text-[10px] text-gray-400 italic">No overdue shipments</div>
        )}
        {items.map((it, i) => (
          <div key={`${it.po}-${i}`} className="border rounded-md p-2">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-[8px] sm:text-[10px] md:text-xs font-medium truncate">{it.po} • {it.supplier}</div>
                <div className="text-[6px] sm:text-[8px] md:text-[10px] text-gray-600 truncate">{it.category} • ETA {format(parseISO(it.eta), 'MMM d')}</div>
              </div>
              <div className={`text-[6px] sm:text-[8px] md:text-[10px] px-2 py-0.5 rounded-full font-medium ${colorForDays(it.daysOverdue)}`}>
                {it.daysOverdue}d overdue
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
