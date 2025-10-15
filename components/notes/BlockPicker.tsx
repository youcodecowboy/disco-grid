'use client'

import { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'
import type { BlockPickerOption } from '@/app/notes/types'

const BLOCK_OPTIONS: BlockPickerOption[] = [
  // Basic
  { type: 'text', label: 'Text', icon: '📝', category: 'basic' },
  
  // Text Formatting
  { type: 'h1', label: 'Heading 1', icon: 'H₁', category: 'formatting' },
  { type: 'h2', label: 'Heading 2', icon: 'H₂', category: 'formatting' },
  { type: 'h3', label: 'Heading 3', icon: 'H₃', category: 'formatting' },
  { type: 'subtitle', label: 'Subtitle', icon: '⊢', category: 'formatting' },
  
  // Metrics
  { type: 'metric.kpi', label: 'KPI', icon: '📈', category: 'metrics' },
  { type: 'metric.chart', label: 'Metric Chart', icon: '📊', category: 'metrics' },
  { type: 'metric.items', label: 'Inventory Metric', icon: '📦', category: 'metrics' },
  { type: 'metric.sparkline', label: 'Trend Metric', icon: '📉', category: 'metrics' },
  
  // Charts
  { type: 'chart.line', label: 'Line Chart', icon: '📈', category: 'charts' },
  { type: 'chart.bar', label: 'Bar Chart', icon: '📊', category: 'charts' },
  { type: 'chart.area', label: 'Area Chart', icon: '🌄', category: 'charts' },
  { type: 'chart.donut', label: 'Donut Chart', icon: '🍩', category: 'charts' },
  
  // Tables
  { type: 'table.editable', label: 'Editable Table', icon: '✏️', category: 'tables' },
  { type: 'table.generic', label: 'Table', icon: '📋', category: 'tables' },
  { type: 'table.malleable', label: 'Data Table', icon: '🗂️', category: 'tables' },
  { type: 'table.orders', label: 'Orders Table', icon: '🧾', category: 'tables' },
  
  // Widgets
  { type: 'calendar', label: 'Calendar', icon: '🗓️', category: 'widgets' },
  { type: 'calendar.mini', label: 'Mini Calendar', icon: '📅', category: 'widgets' },
  { type: 'activity.timeline', label: 'Timeline', icon: '🕒', category: 'widgets' },
  { type: 'v3.kpi', label: 'KPI Card', icon: '💹', category: 'widgets' },
]

interface BlockPickerProps {
  onSelect: (blockType: string) => void
  onClose: () => void
  position?: { top: number; left: number }
}

export default function BlockPicker({ onSelect, onClose, position }: BlockPickerProps) {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const filteredBlocks = BLOCK_OPTIONS.filter(block =>
    block.label.toLowerCase().includes(search.toLowerCase()) ||
    block.type.toLowerCase().includes(search.toLowerCase()) ||
    block.category.toLowerCase().includes(search.toLowerCase())
  )

  // Group blocks by category
  const groupedBlocks = filteredBlocks.reduce((acc, block) => {
    if (!acc[block.category]) {
      acc[block.category] = []
    }
    acc[block.category].push(block)
    return acc
  }, {} as Record<string, BlockPickerOption[]>)

  const categoryOrder: Array<'basic' | 'formatting' | 'metrics' | 'charts' | 'tables' | 'widgets'> = ['basic', 'formatting', 'metrics', 'charts', 'tables', 'widgets']

  // Focus search input on mount
  useEffect(() => {
    searchInputRef.current?.focus()
  }, [])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, filteredBlocks.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filteredBlocks[selectedIndex]) {
          onSelect(filteredBlocks[selectedIndex].type)
        }
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex, filteredBlocks, onSelect, onClose])

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const categoryLabels = {
    basic: 'Basic',
    formatting: 'Text Formatting',
    metrics: 'Metrics',
    charts: 'Charts',
    tables: 'Tables',
    widgets: 'Widgets',
  }

  let globalIndex = 0

  return (
    <div 
      ref={containerRef}
      className="absolute z-50 w-80 mt-1 rounded-lg border border-slate-200 bg-white shadow-lg"
      style={position ? { top: position.top, left: position.left } : {}}
    >
      {/* Search */}
      <div className="p-2 border-b border-slate-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setSelectedIndex(0)
            }}
            placeholder="Search blocks..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-slate-400"
          />
        </div>
      </div>

      {/* Block list */}
      <div className="max-h-96 overflow-y-auto p-2">
        {filteredBlocks.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-400">
            No blocks found
          </div>
        ) : (
          categoryOrder.map(category => {
            const blocks = groupedBlocks[category]
            if (!blocks || blocks.length === 0) return null

            return (
              <div key={category} className="mb-3 last:mb-0">
                <div className="px-2 py-1 text-xs font-medium text-slate-500 uppercase tracking-wide">
                  {categoryLabels[category]}
                </div>
                {blocks.map((block) => {
                  const currentIndex = globalIndex++
                  const isSelected = currentIndex === selectedIndex

                  return (
                    <button
                      key={block.type}
                      onClick={() => onSelect(block.type)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                        isSelected
                          ? 'bg-slate-100 text-slate-900'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-lg">{block.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{block.label}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

