"use client"

import React, { useState, useCallback, useMemo } from 'react'
import { Plus, X, Edit3, Settings, Trash2, Save, RotateCcw, Search, Filter, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { cn, generateId } from '@/lib/utils'

export interface Column {
  id: string
  name: string
  type: 'text' | 'number' | 'date' | 'status' | 'select'
  options?: string[] // For select type
  width?: number
  required?: boolean
}

export interface TableData {
  id: string
  [key: string]: any
}

interface FilterState {
  search: string
  category: string
  status: string
  priceRange: string
  stockLevel: string
}

interface TableMalleableProps {
  title?: string
  columns: Column[]
  data: TableData[]
  onDataChange?: (data: TableData[]) => void
  onColumnsChange?: (columns: Column[]) => void
  editable?: boolean
  className?: string
  showFilters?: boolean
  hideTitle?: boolean
}

export function TableMalleable({
  title = "Table",
  columns,
  data,
  onDataChange,
  onColumnsChange,
  editable = true,
  className = "",
  showFilters = false,
  hideTitle = false
}: TableMalleableProps) {
  const [localData, setLocalData] = useState<TableData[]>(data)
  const [localColumns, setLocalColumns] = useState<Column[]>(columns)
  const [editingCell, setEditingCell] = useState<{ rowId: string; columnId: string } | null>(null)
  const [editingValue, setEditingValue] = useState<string>("")
  const [showColumnEditor, setShowColumnEditor] = useState(false)
  const [editingColumn, setEditingColumn] = useState<Column | null>(null)
  
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    status: '',
    priceRange: '',
    stockLevel: ''
  })
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false)

  // Update local data when props change
  React.useEffect(() => {
    setLocalData(data)
  }, [data])

  React.useEffect(() => {
    setLocalColumns(columns)
  }, [columns])

  // Filter logic
  const filteredData = useMemo(() => {
    if (!showFilters) return localData
    
    return localData.filter(row => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const searchableFields = Object.values(row).join(' ').toLowerCase()
        if (!searchableFields.includes(searchLower)) return false
      }
      
      // Category filter
      if (filters.category && row.category !== filters.category) return false
      
      // Status filter
      if (filters.status && row.status !== filters.status) return false
      
      // Price range filter
      if (filters.priceRange) {
        const price = parseFloat(row.price?.replace(/[^0-9.]/g, '') || '0')
        const [min, max] = filters.priceRange.split('-').map(p => parseFloat(p) || 0)
        if (filters.priceRange === '100+') {
          if (price < 100) return false
        } else if (price < min || price > max) return false
      }
      
      // Stock level filter
      if (filters.stockLevel) {
        const stock = parseInt(row.stock || '0')
        if (filters.stockLevel === 'low-stock' && stock > 20) return false
        if (filters.stockLevel === 'out-of-stock' && stock > 0) return false
        if (filters.stockLevel === 'in-stock' && stock <= 0) return false
      }
      
      return true
    })
  }, [localData, filters, showFilters])

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      status: '',
      priceRange: '',
      stockLevel: ''
    })
  }

  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length

  const handleCellEdit = useCallback((rowId: string, columnId: string, value: any) => {
    setLocalData(prev => 
      prev.map(row => 
        row.id === rowId 
          ? { ...row, [columnId]: value }
          : row
      )
    )
    
    if (onDataChange) {
      const updatedData = localData.map(row => 
        row.id === rowId 
          ? { ...row, [columnId]: value }
          : row
      )
      onDataChange(updatedData)
    }
  }, [localData, onDataChange])

  const handleAddRow = useCallback(() => {
    const newRow: TableData = {
      id: generateId("row"),
      ...Object.fromEntries(localColumns.map(col => [col.id, col.type === 'number' ? 0 : '']))
    }
    const updatedData = [...localData, newRow]
    setLocalData(updatedData)
    if (onDataChange) onDataChange(updatedData)
  }, [localData, localColumns, onDataChange])

  const handleDeleteRow = useCallback((rowId: string) => {
    const updatedData = localData.filter(row => row.id !== rowId)
    setLocalData(updatedData)
    if (onDataChange) onDataChange(updatedData)
  }, [localData, onDataChange])

  const handleAddColumn = useCallback(() => {
    const newColumn: Column = {
      id: generateId("col"),
      name: `Column ${localColumns.length + 1}`,
      type: 'text',
      width: 150
    }
    const updatedColumns = [...localColumns, newColumn]
    setLocalColumns(updatedColumns)
    
    // Add empty values for new column to all rows
    const updatedData = localData.map(row => ({
      ...row,
      [newColumn.id]: ''
    }))
    setLocalData(updatedData)
    
    if (onColumnsChange) onColumnsChange(updatedColumns)
    if (onDataChange) onDataChange(updatedData)
  }, [localColumns, localData, onColumnsChange, onDataChange])

  const handleDeleteColumn = useCallback((columnId: string) => {
    const updatedColumns = localColumns.filter(col => col.id !== columnId)
    setLocalColumns(updatedColumns)
    
    // Remove column data from all rows
    const updatedData = localData.map(row => {
      const { [columnId]: removed, ...rest } = row
      return rest
    })
    setLocalData(updatedData)
    
    if (onColumnsChange) onColumnsChange(updatedColumns)
    if (onDataChange) onDataChange(updatedData)
  }, [localColumns, localData, onColumnsChange, onDataChange])

  const handleColumnEdit = useCallback((columnId: string, updates: Partial<Column>) => {
    const updatedColumns = localColumns.map(col => 
      col.id === columnId ? { ...col, ...updates } : col
    )
    setLocalColumns(updatedColumns)
    if (onColumnsChange) onColumnsChange(updatedColumns)
  }, [localColumns, onColumnsChange])

  const renderCell = (row: TableData, column: Column) => {
    const value = row[column.id]
    
    if (editingCell?.rowId === row.id && editingCell?.columnId === column.id) {
      return (
        <Input
          value={editingValue}
          onChange={(e) => setEditingValue(e.target.value)}
          onBlur={() => {
            handleCellEdit(row.id, column.id, editingValue)
            setEditingCell(null)
            setEditingValue("")
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleCellEdit(row.id, column.id, editingValue)
              setEditingCell(null)
              setEditingValue("")
            }
            if (e.key === 'Escape') {
              setEditingCell(null)
              setEditingValue("")
            }
          }}
          autoFocus
          className="h-8 text-sm"
        />
      )
    }

    switch (column.type) {
      case 'number':
        return (
          <div className="text-right font-mono">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
        )
      
      case 'date':
        return (
          <div className="text-sm">
            {value ? format(new Date(value), 'MMM dd, yyyy') : '-'}
          </div>
        )
      
      case 'status':
        const statusColors = {
          'active': 'bg-green-100 text-green-800',
          'inactive': 'bg-gray-100 text-gray-800',
          'pending': 'bg-yellow-100 text-yellow-800',
          'completed': 'bg-blue-100 text-blue-800',
          'cancelled': 'bg-red-100 text-red-800'
        }
        return (
          <Badge className={statusColors[value as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
            {value || 'Unknown'}
          </Badge>
        )
      
      case 'select':
        return (
          <div className="text-sm">
            {value || '-'}
          </div>
        )
      
      default:
        return (
          <div className="text-sm truncate">
            {value || '-'}
          </div>
        )
    }
  }

  const renderColumnHeader = (column: Column) => {
    return (
      <div className="flex items-center justify-between group">
        <span className="font-medium text-sm truncate">{column.name}</span>
        {editable && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditingColumn(column)
                setShowColumnEditor(true)
              }}
              className="h-6 w-6 p-0"
            >
              <Settings className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg border ${className}`}>
      {/* Header */}
      {!hideTitle && (
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold text-lg">{title}</h3>
        <div className="flex items-center gap-2">
          {showFilters && (
            <div className="flex items-center gap-2">
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {activeFiltersCount} active
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
                className="text-xs"
              >
                <Filter className="h-3 w-3 mr-1" />
                Filters
                <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${isFiltersExpanded ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          )}
          {editable && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddColumn}
                className="text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Column
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddRow}
                className="text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Row
              </Button>
            </>
          )}
        </div>
      </div>
      )}

      {/* Search Bar - Always Visible when filters are enabled */}
      {showFilters && (
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search items by name, SKU, or description..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
        </div>
      )}

      {/* Advanced Filters - Expandable */}
      {showFilters && isFiltersExpanded && (
        <div className="p-4 border-b space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  <SelectItem value="Clothing">Clothing</SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                  <SelectItem value="Footwear">Footwear</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Price Range</label>
              <Select value={filters.priceRange} onValueChange={(value) => handleFilterChange('priceRange', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All prices" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All prices</SelectItem>
                  <SelectItem value="0-25">$0 - $25</SelectItem>
                  <SelectItem value="25-50">$25 - $50</SelectItem>
                  <SelectItem value="50-100">$50 - $100</SelectItem>
                  <SelectItem value="100+">$100+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Stock Level Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Stock Level</label>
              <Select value={filters.stockLevel} onValueChange={(value) => handleFilterChange('stockLevel', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All stock levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All stock levels</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-500">Active filters:</span>
              {filters.category && (
                <Badge variant="outline" className="text-xs">
                  Category: {filters.category}
                  <button
                    onClick={() => handleFilterChange('category', '')}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.status && (
                <Badge variant="outline" className="text-xs">
                  Status: {filters.status}
                  <button
                    onClick={() => handleFilterChange('status', '')}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.priceRange && (
                <Badge variant="outline" className="text-xs">
                  Price: {filters.priceRange}
                  <button
                    onClick={() => handleFilterChange('priceRange', '')}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.stockLevel && (
                <Badge variant="outline" className="text-xs">
                  Stock: {filters.stockLevel}
                  <button
                    onClick={() => handleFilterChange('stockLevel', '')}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs text-red-600 hover:text-red-700"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              {localColumns.map((column) => (
                <th
                  key={column.id}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ width: column.width || 'auto' }}
                >
                  {renderColumnHeader(column)}
                </th>
              ))}
              {editable && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {localColumns.map((column) => (
                  <td
                    key={column.id}
                    className="px-4 py-3 text-sm"
                    onClick={() => {
                      if (editable) {
                        setEditingCell({ rowId: row.id, columnId: column.id })
                        setEditingValue(String(row[column.id] || ''))
                      }
                    }}
                    style={{ cursor: editable ? 'pointer' : 'default' }}
                  >
                    {renderCell(row, column)}
                  </td>
                ))}
                {editable && (
                  <td className="px-4 py-3 text-sm">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRow(row.id)}
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Column Editor Popover */}
      {editingColumn && (
        <Popover open={showColumnEditor} onOpenChange={setShowColumnEditor}>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <h4 className="font-medium">Edit Column</h4>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={editingColumn.name}
                  onChange={(e) => setEditingColumn({ ...editingColumn, name: e.target.value })}
                  placeholder="Column name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select
                  value={editingColumn.type}
                  onValueChange={(value: any) => setEditingColumn({ ...editingColumn, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="select">Select</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {editingColumn.type === 'select' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Options (comma-separated)</label>
                  <Input
                    value={editingColumn.options?.join(', ') || ''}
                    onChange={(e) => setEditingColumn({
                      ...editingColumn,
                      options: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })}
                    placeholder="Option 1, Option 2, Option 3"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Width (px)</label>
                <Input
                  type="number"
                  value={editingColumn.width || 150}
                  onChange={(e) => setEditingColumn({ ...editingColumn, width: parseInt(e.target.value) || 150 })}
                  placeholder="150"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="required"
                  checked={editingColumn.required || false}
                  onChange={(e) => setEditingColumn({ ...editingColumn, required: e.target.checked })}
                />
                <label htmlFor="required" className="text-sm">Required</label>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteColumn(editingColumn.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete Column
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowColumnEditor(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      handleColumnEdit(editingColumn.id, editingColumn)
                      setShowColumnEditor(false)
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
