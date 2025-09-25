"use client"

import { useState } from "react"
import { Filter, X, ChevronDown } from "lucide-react"

interface FilterOption {
  id: string
  label: string
  count?: number
}

interface FilterGroup {
  id: string
  label: string
  type: "select" | "multiselect" | "date" | "range"
  options?: FilterOption[]
  value?: string | string[]
  min?: number
  max?: number
}

interface FilterPanelProps {
  title?: string
  data?: {
    groups?: FilterGroup[]
    activeFilters?: { groupId: string; value: string | string[] }[]
    showClearAll?: boolean
  }
}

export default function FilterPanel({ 
  title = "Filter Panel", 
  data = {} 
}: FilterPanelProps) {
  const { 
    groups = [
      {
        id: "status",
        label: "Status",
        type: "multiselect",
        options: [
          { id: "active", label: "Active", count: 12 },
          { id: "pending", label: "Pending", count: 5 },
          { id: "completed", label: "Completed", count: 23 }
        ]
      },
      {
        id: "category",
        label: "Category",
        type: "select",
        options: [
          { id: "clothing", label: "Clothing", count: 15 },
          { id: "accessories", label: "Accessories", count: 8 },
          { id: "footwear", label: "Footwear", count: 6 }
        ]
      },
      {
        id: "price",
        label: "Price Range",
        type: "range",
        min: 0,
        max: 1000
      }
    ],
    activeFilters = [
      { groupId: "status", value: ["active", "pending"] },
      { groupId: "category", value: "clothing" }
    ],
    showClearAll = true
  } = data

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(["status"]))
  const [localFilters, setLocalFilters] = useState(activeFilters)

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId)
    } else {
      newExpanded.add(groupId)
    }
    setExpandedGroups(newExpanded)
  }

  const getActiveCount = () => {
    return localFilters.filter(filter => {
      if (Array.isArray(filter.value)) {
        return filter.value.length > 0
      }
      return filter.value !== null && filter.value !== ""
    }).length
  }

  const clearAllFilters = () => {
    setLocalFilters([])
  }

  return (
    <div className="h-full flex flex-col" style={{ containerType: "inline-size" }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-foreground truncate">{title}</h3>
        <div className="flex items-center gap-1">
          <Filter className="h-3 w-3 text-muted-foreground" />
          {getActiveCount() > 0 && (
            <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
              {getActiveCount()}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex-1 space-y-3 overflow-y-auto">
        {groups.map((group) => {
          const isExpanded = expandedGroups.has(group.id)
          const activeFilter = localFilters.find(f => f.groupId === group.id)
          
          return (
            <div key={group.id} className="border border-border rounded-lg">
              <button
                onClick={() => toggleGroup(group.id)}
                className="w-full flex items-center justify-between p-2 text-left hover:bg-muted/50 transition-colors"
              >
                <span className="text-xs font-medium text-foreground">{group.label}</span>
                <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
              
              {isExpanded && (
                <div className="p-2 pt-0 border-t border-border">
                  {group.type === "multiselect" && group.options && (
                    <div className="space-y-1">
                      {group.options.map((option) => (
                        <label key={option.id} className="flex items-center gap-2 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            className="h-3 w-3 text-primary"
                            checked={Array.isArray(activeFilter?.value) && activeFilter.value.includes(option.id)}
                            onChange={() => {}}
                          />
                          <span className="flex-1 text-foreground">{option.label}</span>
                          {option.count && (
                            <span className="text-muted-foreground">({option.count})</span>
                          )}
                        </label>
                      ))}
                    </div>
                  )}
                  
                  {group.type === "select" && group.options && (
                    <select 
                      className="w-full text-xs border border-border rounded px-2 py-1 bg-background"
                      value={typeof activeFilter?.value === "string" ? activeFilter.value : ""}
                      onChange={() => {}}
                    >
                      <option value="">All {group.label}</option>
                      {group.options.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label} {option.count && `(${option.count})`}
                        </option>
                      ))}
                    </select>
                  )}
                  
                  {group.type === "range" && (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          className="flex-1 text-xs border border-border rounded px-2 py-1 bg-background"
                          min={group.min}
                          max={group.max}
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          className="flex-1 text-xs border border-border rounded px-2 py-1 bg-background"
                          min={group.min}
                          max={group.max}
                        />
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Range: ${group.min} - ${group.max}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
      
      {showClearAll && getActiveCount() > 0 && (
        <div className="mt-3 pt-2 border-t border-border">
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3 w-3" />
            Clear all filters
          </button>
        </div>
      )}
      
      <div className="mt-auto pt-2 text-[10px] text-muted-foreground/60">
        {getActiveCount()} active filter{getActiveCount() !== 1 ? 's' : ''}
      </div>
    </div>
  )
}
