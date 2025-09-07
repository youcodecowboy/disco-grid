"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, X, ChevronDown } from 'lucide-react'

interface FilterItemsProps {
  title?: string
  onFilterChange?: (filters: FilterState) => void
  className?: string
}

interface FilterState {
  search: string
  category: string
  status: string
  priceRange: string
  stockLevel: string
}

export function FilterItems({
  title = "Filter Items",
  onFilterChange,
  className = ""
}: FilterItemsProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    status: '',
    priceRange: '',
    stockLevel: ''
  })

  const [isExpanded, setIsExpanded] = useState(false)

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      category: '',
      status: '',
      priceRange: '',
      stockLevel: ''
    }
    setFilters(clearedFilters)
    onFilterChange?.(clearedFilters)
  }

  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length

  return (
    <div className={`bg-white rounded-lg border ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold text-lg">{title}</h3>
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFiltersCount} active
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs"
          >
            <Filter className="h-3 w-3 mr-1" />
            Filters
            <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Search Bar - Always Visible */}
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

      {/* Advanced Filters - Expandable */}
      {isExpanded && (
        <div className="p-4 space-y-4">
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
    </div>
  )
}
