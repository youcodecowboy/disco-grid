"use client"

import React from 'react'
import { BlockProps } from './types'
import { format, addDays, parseISO } from 'date-fns'

interface CategoryUsage {
  name: string
  stock: number
  dailyUsage: number
}

interface AtRiskItem {
  name: string
  stock: number
  dailyUsage: number
  runoutDays: number
}

interface UsageData {
  currentStock: number
  dailyUsage: number
  projectedRunoutDays: number
  projectedRunoutDate?: string
  categories?: CategoryUsage[]
  atRisk?: AtRiskItem[]
}

interface Props extends BlockProps {
  data: UsageData
}

export default function MaterialsUsage({ title = 'Usage & Runout', data, className = '', hideTitle }: Props) {
  const currentStock = data?.currentStock ?? 0
  const dailyUsage = data?.dailyUsage ?? 0
  const projectedRunoutDays = data?.projectedRunoutDays ?? (dailyUsage > 0 ? Math.round(currentStock / dailyUsage) : 0)
  const runoutDate = data?.projectedRunoutDate
    ? parseISO(data.projectedRunoutDate)
    : addDays(new Date(), projectedRunoutDays)
  const categories = Array.isArray(data?.categories) ? data.categories : []
  const atRisk = Array.isArray(data?.atRisk) ? data.atRisk : []

  const utilizationPct = currentStock > 0 && dailyUsage > 0 ? Math.min(100, Math.round((dailyUsage / Math.max(currentStock, dailyUsage)) * 100)) : 0

  return (
    <div className={`h-full flex flex-col ${hideTitle ? 'p-2 sm:p-3' : 'p-3 sm:p-4'} ${className}`}>
      {/* Header */}
      {!hideTitle && (
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h3 className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm font-semibold text-gray-900 truncate flex-1 min-w-0 mr-2">
            {title}
          </h3>
          <div className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs text-gray-500">
            Daily usage: {dailyUsage.toLocaleString()}
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-2 sm:mb-3">
        <div className="border rounded-md p-2">
          <div className="text-[6px] sm:text-[8px] md:text-[10px] text-gray-500">Current Stock</div>
          <div className="text-[10px] sm:text-xs md:text-sm font-semibold">{currentStock.toLocaleString()}</div>
        </div>
        <div className="border rounded-md p-2">
          <div className="text-[6px] sm:text-[8px] md:text-[10px] text-gray-500">Runout (days)</div>
          <div className="text-[10px] sm:text-xs md:text-sm font-semibold">{projectedRunoutDays}</div>
        </div>
        <div className="border rounded-md p-2">
          <div className="text-[6px] sm:text-[8px] md:text-[10px] text-gray-500">Est. Runout Date</div>
          <div className="text-[10px] sm:text-xs md:text-sm font-semibold">{format(runoutDate, 'MMM d, yyyy')}</div>
        </div>
      </div>

      {/* Overall Utilization */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <div className="text-[6px] sm:text-[8px] md:text-[10px] text-gray-600">Utilization</div>
          <div className="text-[6px] sm:text-[8px] md:text-[10px] text-gray-600">{utilizationPct}%</div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${utilizationPct}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 min-h-0">
        {/* Category Usage */}
        <div className="border rounded-md p-2 flex flex-col min-h-0">
          <div className="text-[8px] sm:text-[10px] md:text-xs font-medium mb-2">Category Usage</div>
          <div className="space-y-2 overflow-auto">
            {categories.length === 0 && (
              <div className="text-[6px] sm:text-[8px] md:text-[10px] text-gray-400 italic">No category data</div>
            )}
            {categories.map((c, i) => {
              const pct = c.stock > 0 ? Math.min(100, Math.round((c.dailyUsage / c.stock) * 100)) : 0
              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="text-[6px] sm:text-[8px] md:text-[10px] text-gray-700 truncate">{c.name}</div>
                    <div className="text-[6px] sm:text-[8px] md:text-[10px] text-gray-500">{c.dailyUsage.toLocaleString()}/day</div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* At-Risk Items */}
        <div className="border rounded-md p-2 flex flex-col min-h-0">
          <div className="text-[8px] sm:text-[10px] md:text-xs font-medium mb-2">At-Risk Items</div>
          <div className="space-y-2 overflow-auto">
            {atRisk.length === 0 && (
              <div className="text-[6px] sm:text-[8px] md:text-[10px] text-gray-400 italic">No at-risk items</div>
            )}
            {atRisk.map((it, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="min-w-0">
                  <div className="text-[6px] sm:text-[8px] md:text-[10px] text-gray-700 truncate">{it.name}</div>
                  <div className="text-[6px] sm:text-[8px] md:text-[10px] text-gray-500 truncate">{it.stock.toLocaleString()} in stock • {it.dailyUsage.toLocaleString()}/day</div>
                </div>
                <div className={`text-[6px] sm:text-[8px] md:text-[10px] font-medium ${it.runoutDays <= 7 ? 'text-red-600' : it.runoutDays <= 14 ? 'text-orange-600' : 'text-gray-700'}`}>
                  {it.runoutDays}d
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
