"use client"

import React from 'react'
import { BlockProps } from './types'

interface SupplierInfo {
  name: string
  avgDays: number
  onTimeRate?: number // 0-100
}

interface SupplierData {
  suppliers?: SupplierInfo[]
}

interface Props extends BlockProps {
  data: SupplierData
}

export default function SupplierLeadTimes({ title = 'Supplier Lead Times', data, className = '', hideTitle }: Props) {
  const list = Array.isArray(data?.suppliers) ? data.suppliers : []

  return (
    <div className={`h-full flex flex-col ${hideTitle ? 'p-2 sm:p-3' : 'p-3 sm:p-4'} ${className}`}>
      {!hideTitle && (
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm font-semibold text-gray-900 truncate">{title}</h3>
          <div className="text-[6px] sm:text-[8px] md:text-[10px] text-gray-500">{list.length} suppliers</div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {list.length === 0 && (
          <div className="text-[6px] sm:text-[8px] md:text-[10px] text-gray-400 italic">No supplier data</div>
        )}
        {list.map((s, i) => (
          <div key={`${s.name}-${i}`} className="border rounded-md p-2 flex flex-col gap-1">
            <div className="text-[8px] sm:text-[10px] md:text-xs font-medium truncate">{s.name}</div>
            <div className="flex items-center justify-between">
              <div className="text-[6px] sm:text-[8px] md:text-[10px] text-gray-600">Avg lead time</div>
              <div className="text-[10px] sm:text-xs md:text-sm font-semibold">{s.avgDays}d</div>
            </div>
            {typeof s.onTimeRate === 'number' && (
              <div>
                <div className="flex items-center justify-between">
                  <div className="text-[6px] sm:text-[8px] md:text-[10px] text-gray-600">On-time</div>
                  <div className="text-[6px] sm:text-[8px] md:text-[10px] font-medium">{s.onTimeRate}%</div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: `${Math.min(100, Math.max(0, s.onTimeRate))}%` }} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
