"use client"

/**
 * Bulk Label Print Table Component
 * 
 * Select items for bulk label printing, track print status, queue multiple items
 */

import { useState, useMemo } from 'react'
import { Printer, CheckCircle, AlertCircle, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface PrintableItem {
  id: string
  itemCodeId: string
  name: string
  code: string
  orderId: string
  orderName: string
  totalQuantity: number
  printedQuantity: number
  lastPrintedAt?: string
}

interface BulkLabelPrintTableProps {
  items: PrintableItem[]
  onPrintSelected: (selectedIds: string[]) => void
}

export function BulkLabelPrintTable({ items, onPrintSelected }: BulkLabelPrintTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  
  // Filter items by search
  const filteredItems = useMemo(() => {
    if (!searchQuery) return items
    
    const query = searchQuery.toLowerCase()
    return items.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.code.toLowerCase().includes(query) ||
      item.orderName.toLowerCase().includes(query)
    )
  }, [items, searchQuery])
  
  // Calculate totals
  const selectedItems = filteredItems.filter(item => selectedIds.has(item.id))
  const totalLabelsSelected = selectedItems.reduce((sum, item) => sum + item.totalQuantity, 0)
  const totalLabelsToPrint = selectedItems.reduce((sum, item) => 
    sum + (item.totalQuantity - item.printedQuantity), 0
  )
  
  // Toggle selection
  const toggleItem = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }
  
  // Toggle all
  const toggleAll = () => {
    if (selectedIds.size === filteredItems.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredItems.map(item => item.id)))
    }
  }
  
  // Handle print
  const handlePrint = () => {
    if (selectedIds.size === 0) return
    onPrintSelected(Array.from(selectedIds))
  }
  
  // Get print status badge
  const getPrintStatus = (item: PrintableItem) => {
    const percentage = (item.printedQuantity / item.totalQuantity) * 100
    
    if (percentage === 0) {
      return {
        label: 'Not Printed',
        className: 'bg-slate-100 text-slate-700',
        icon: null
      }
    } else if (percentage === 100) {
      return {
        label: 'Complete',
        className: 'bg-green-100 text-green-800',
        icon: <CheckCircle className="h-3 w-3" />
      }
    } else {
      return {
        label: `${item.printedQuantity}/${item.totalQuantity}`,
        className: 'bg-yellow-100 text-yellow-800',
        icon: <AlertCircle className="h-3 w-3" />
      }
    }
  }
  
  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-slate-300 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-600">
              <span className="font-semibold">{selectedIds.size}</span> items selected
              <span className="mx-2">•</span>
              <span className="font-semibold">{totalLabelsToPrint}</span> labels to print
            </div>
            <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
              <Printer className="mr-2 h-4 w-4" />
              Print {totalLabelsToPrint} Labels
            </Button>
          </div>
        )}
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedIds.size === filteredItems.length && filteredItems.length > 0}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Item</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Order</th>
              <th className="px-4 py-3 text-center font-medium text-slate-700">Quantity</th>
              <th className="px-4 py-3 text-center font-medium text-slate-700">Print Status</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Last Printed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No items found
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const status = getPrintStatus(item)
                const isSelected = selectedIds.has(item.id)
                const remainingToPrint = item.totalQuantity - item.printedQuantity
                
                return (
                  <tr 
                    key={item.id} 
                    className={`hover:bg-slate-50 ${isSelected ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleItem(item.id)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.code}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{item.orderName}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="font-medium text-slate-900">{item.totalQuantity}</div>
                      {remainingToPrint > 0 && (
                        <div className="text-xs text-slate-500">
                          {remainingToPrint} to print
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}>
                          {status.icon}
                          {status.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {item.lastPrintedAt ? (
                        <span className="text-xs">
                          {new Date(item.lastPrintedAt).toLocaleDateString()} at{' '}
                          {new Date(item.lastPrintedAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Never</span>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Summary */}
      {selectedIds.size > 0 && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <Printer className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <div className="font-medium text-blue-900">Ready to Print</div>
              <div className="mt-1 text-sm text-blue-700">
                {selectedIds.size} item{selectedIds.size !== 1 ? 's' : ''} selected • {' '}
                {totalLabelsSelected} total labels • {' '}
                {totalLabelsToPrint} new labels to print
              </div>
              <div className="mt-2 text-xs text-blue-600">
                Labels will be queued for printing. Already printed labels will not be duplicated.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

