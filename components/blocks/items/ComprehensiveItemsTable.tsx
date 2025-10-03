"use client"

import React, { useState, useMemo } from 'react'
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Eye, 
  MessageSquare, 
  MoreVertical,
  ExternalLink,
  Package,
  X,
  Download,
  RefreshCw,
  Settings2,
  Calendar,
  Bookmark,
  Columns3
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'

interface ItemData {
  id: string
  itemCode: string
  itemName: string
  order: string
  customer: string
  workflow: string
  stage: string
  quantity: number
  completed: number
  progress: number
  assignedTo: string
  dueDate: string
  status: 'on-track' | 'watch' | 'starting' | 'priority'
  components: number
  hasMessages: boolean
  priority: 'low' | 'normal' | 'high'
}

interface ComprehensiveItemsTableProps {
  data?: ItemData[]
  title?: string
  enableFiltering?: boolean
  enableSearch?: boolean
  showWorkflows?: boolean
  showMessaging?: boolean
  onItemClick?: (item: ItemData) => void
}

export default function ComprehensiveItemsTable({
  data = [],
  title,
  enableFiltering = true,
  enableSearch = true,
  showWorkflows = true,
  showMessaging = true,
  onItemClick
}: ComprehensiveItemsTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [workflowFilter, setWorkflowFilter] = useState<string>('all')
  const [customerFilter, setCustomerFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState<string>('all')
  const [progressFilter, setProgressFilter] = useState<string>('all')
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)
  
  // Calculate useful metrics
  const lastUpdatedItem = useMemo(() => {
    if (data.length === 0) return null
    // Simulate getting the most recently updated item
    return data[0] // In real app, sort by updated timestamp
  }, [data])
  
  const avgProgress = useMemo(() => {
    if (data.length === 0) return 0
    return Math.round(data.reduce((sum, item) => sum + item.progress, 0) / data.length)
  }, [data])
  
  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState({
    itemCode: true,
    itemName: true,
    order: true,
    customer: true,
    workflow: true,
    stage: true,
    progress: true,
    status: true,
    actions: true
  })

  // Filter and search logic
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const searchableText = `${item.itemCode} ${item.itemName} ${item.order} ${item.customer}`.toLowerCase()
        if (!searchableText.includes(query)) return false
      }

      // Status filter
      if (statusFilter !== 'all' && item.status !== statusFilter) return false

      // Workflow filter
      if (workflowFilter !== 'all' && item.workflow !== workflowFilter) return false

      // Customer filter
      if (customerFilter !== 'all' && item.customer !== customerFilter) return false

      // Progress filter
      if (progressFilter !== 'all') {
        if (progressFilter === 'not-started' && item.progress > 0) return false
        if (progressFilter === 'in-progress' && (item.progress === 0 || item.progress === 100)) return false
        if (progressFilter === 'completed' && item.progress !== 100) return false
        if (progressFilter === 'at-risk' && item.progress >= 50) return false
      }

      // Date range filter
      if (dateRange !== 'all') {
        const dueDate = new Date(item.dueDate)
        const now = new Date()
        const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        
        if (dateRange === 'overdue' && daysDiff >= 0) return false
        if (dateRange === 'today' && daysDiff !== 0) return false
        if (dateRange === 'this-week' && (daysDiff < 0 || daysDiff > 7)) return false
        if (dateRange === 'this-month' && (daysDiff < 0 || daysDiff > 30)) return false
      }

      return true
    })
  }, [data, searchQuery, statusFilter, workflowFilter, customerFilter, progressFilter, dateRange])

  // Get unique options for filters
  const uniqueWorkflows = useMemo(() => Array.from(new Set(data.map(item => item.workflow))), [data])
  const uniqueCustomers = useMemo(() => Array.from(new Set(data.map(item => item.customer))), [data])

  const getStatusColor = (status: string) => {
    const colors = {
      'on-track': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'watch': 'bg-amber-100 text-amber-800 border-amber-200',
      'starting': 'bg-blue-100 text-blue-800 border-blue-200',
      'priority': 'bg-red-100 text-red-800 border-red-200'
    }
    return colors[status as keyof typeof colors] || 'bg-slate-100 text-slate-800'
  }

  const activeFiltersCount = (
    (statusFilter !== 'all' ? 1 : 0) + 
    (workflowFilter !== 'all' ? 1 : 0) +
    (customerFilter !== 'all' ? 1 : 0) +
    (progressFilter !== 'all' ? 1 : 0) +
    (dateRange !== 'all' ? 1 : 0)
  )

  const clearAllFilters = () => {
    setStatusFilter('all')
    setWorkflowFilter('all')
    setCustomerFilter('all')
    setProgressFilter('all')
    setDateRange('all')
  }

  return (
    <div className="flex h-full flex-col">
      {/* Enhanced Header with futuristic design */}
      <div className="flex flex-col gap-3 pb-4 border-b border-slate-200/60">
        {/* Top row - Title and actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">{title}</h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {filteredData.length.toLocaleString()} of {data.length.toLocaleString()} items
                  {autoRefresh && <span className="ml-2 text-emerald-600">● Live</span>}
                </p>
              </div>
            </div>
            
            {/* Quick metrics */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider">Avg Progress</span>
                <span className="text-xs font-bold text-slate-900">{avgProgress}%</span>
              </div>
              {lastUpdatedItem && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider">Last Updated</span>
                  <span className="text-xs font-bold text-slate-900">{lastUpdatedItem.itemCode}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider">On Track</span>
                <span className="text-xs font-bold text-emerald-900">
                  {data.filter(i => i.status === 'on-track').length}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 border border-red-200">
                <span className="text-[10px] font-semibold text-red-700 uppercase tracking-wider">Priority</span>
                <span className="text-xs font-bold text-red-900">
                  {data.filter(i => i.status === 'priority').length}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Auto-refresh toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`h-8 px-3 text-xs rounded-full border-slate-300 ${autoRefresh ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : ''}`}
            >
              <RefreshCw className={`mr-1.5 h-3 w-3 ${autoRefresh ? 'animate-spin' : ''}`} />
              {autoRefresh ? 'Live' : 'Refresh'}
            </Button>

            {/* Column selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 px-3 text-xs rounded-full border-slate-300">
                  <Columns3 className="mr-1.5 h-3 w-3" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {Object.entries(visibleColumns).map(([key, value]) => (
                  <DropdownMenuCheckboxItem
                    key={key}
                    checked={value}
                    onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, [key]: checked }))}
                  >
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Export */}
            <Button variant="outline" size="sm" className="h-8 px-3 text-xs rounded-full border-slate-300">
              <Download className="mr-1.5 h-3 w-3" />
              Export
            </Button>

            {/* Filters toggle */}
            {enableFiltering && (
              <Button
                variant={isFiltersExpanded ? "default" : "outline"}
                size="sm"
                onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
                className={`h-8 px-3 text-xs rounded-full ${isFiltersExpanded ? 'bg-slate-900 text-white' : 'border-slate-300'}`}
              >
                <Filter className="mr-1.5 h-3 w-3" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2 h-4 px-1.5 text-[10px] bg-white/20">
                    {activeFiltersCount}
                  </Badge>
                )}
                <ChevronDown className={`ml-1.5 h-3 w-3 transition-transform ${isFiltersExpanded ? 'rotate-180' : ''}`} />
              </Button>
            )}
          </div>
        </div>

        {/* Search Bar - Always visible with enhanced design */}
        {enableSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search items by code, name, order, or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 h-10 bg-slate-50/50 border-slate-200 rounded-full text-sm placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Advanced Filters - Enhanced with more options */}
        {enableFiltering && isFiltersExpanded && (
          <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-200/60 space-y-4">
            {/* Filter pills for quick access */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Quick Filters:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStatusFilter('priority')}
                className="h-7 px-3 text-xs rounded-full border-red-200 hover:bg-red-50"
              >
                Priority Items
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDateRange('overdue')}
                className="h-7 px-3 text-xs rounded-full border-amber-200 hover:bg-amber-50"
              >
                Overdue
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setProgressFilter('at-risk')}
                className="h-7 px-3 text-xs rounded-full border-orange-200 hover:bg-orange-50"
              >
                At Risk
              </Button>
            </div>

            {/* Filter grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9 text-sm rounded-lg border-slate-300">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="on-track">On Track</SelectItem>
                    <SelectItem value="watch">Watch</SelectItem>
                    <SelectItem value="starting">Starting</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Workflow */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">Workflow</label>
                <Select value={workflowFilter} onValueChange={setWorkflowFilter}>
                  <SelectTrigger className="h-9 text-sm rounded-lg border-slate-300">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Workflows</SelectItem>
                    {uniqueWorkflows.map(workflow => (
                      <SelectItem key={workflow} value={workflow}>{workflow}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Customer */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">Customer</label>
                <Select value={customerFilter} onValueChange={setCustomerFilter}>
                  <SelectTrigger className="h-9 text-sm rounded-lg border-slate-300">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    {uniqueCustomers.map(customer => (
                      <SelectItem key={customer} value={customer}>{customer}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Progress */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">Progress</label>
                <Select value={progressFilter} onValueChange={setProgressFilter}>
                  <SelectTrigger className="h-9 text-sm rounded-lg border-slate-300">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Progress</SelectItem>
                    <SelectItem value="not-started">Not Started (0%)</SelectItem>
                    <SelectItem value="in-progress">In Progress (1-99%)</SelectItem>
                    <SelectItem value="at-risk">At Risk (&lt;50%)</SelectItem>
                    <SelectItem value="completed">Completed (100%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Due Date */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">Due Date</label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="h-9 text-sm rounded-lg border-slate-300">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="today">Due Today</SelectItem>
                    <SelectItem value="this-week">This Week</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active filters display and clear */}
            {activeFiltersCount > 0 && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Active:</span>
                  {statusFilter !== 'all' && (
                    <Badge variant="outline" className="text-xs rounded-full pl-2 pr-1 py-0.5">
                      Status: {statusFilter}
                      <button onClick={() => setStatusFilter('all')} className="ml-1 hover:text-red-600">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {workflowFilter !== 'all' && (
                    <Badge variant="outline" className="text-xs rounded-full pl-2 pr-1 py-0.5">
                      Workflow: {workflowFilter.substring(0, 20)}...
                      <button onClick={() => setWorkflowFilter('all')} className="ml-1 hover:text-red-600">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {customerFilter !== 'all' && (
                    <Badge variant="outline" className="text-xs rounded-full pl-2 pr-1 py-0.5">
                      Customer: {customerFilter}
                      <button onClick={() => setCustomerFilter('all')} className="ml-1 hover:text-red-600">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {progressFilter !== 'all' && (
                    <Badge variant="outline" className="text-xs rounded-full pl-2 pr-1 py-0.5">
                      Progress: {progressFilter}
                      <button onClick={() => setProgressFilter('all')} className="ml-1 hover:text-red-600">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {dateRange !== 'all' && (
                    <Badge variant="outline" className="text-xs rounded-full pl-2 pr-1 py-0.5">
                      Date: {dateRange}
                      <button onClick={() => setDateRange('all')} className="ml-1 hover:text-red-600">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-7 px-3 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-sm border-b border-slate-200 z-10">
            <tr>
              {visibleColumns.itemCode && (
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider w-32">
                  Item Code
                </th>
              )}
              {visibleColumns.itemName && (
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider min-w-[200px]">
                  Item Name
                </th>
              )}
              {visibleColumns.order && (
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  Order
                </th>
              )}
              {visibleColumns.customer && (
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  Customer
                </th>
              )}
              {visibleColumns.workflow && (
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  Workflow
                </th>
              )}
              {visibleColumns.stage && (
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  Stage
                </th>
              )}
              {visibleColumns.progress && (
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  Progress
                </th>
              )}
              {visibleColumns.status && (
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  Status
                </th>
              )}
              {visibleColumns.actions && (
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider w-24">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {filteredData.map((item) => (
              <tr 
                key={item.id} 
                className="hover:bg-slate-50/50 transition-colors group cursor-pointer border-l-2 border-transparent hover:border-l-blue-500"
                onClick={() => onItemClick?.(item)}
              >
                {visibleColumns.itemCode && (
                  <td className={`px-4 py-3 ${item.priority === 'high' ? 'border-l-4 border-red-500' : ''}`}>
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono font-bold text-slate-900">
                        {item.itemCode}
                      </code>
                      {item.components > 0 && (
                        <Badge variant="outline" className="text-[10px] px-1 py-0 rounded-full border-slate-300">
                          <Package className="h-2.5 w-2.5 mr-0.5" />
                          {item.components}
                        </Badge>
                      )}
                    </div>
                  </td>
                )}
                
                {visibleColumns.itemName && (
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold text-slate-900">{item.itemName}</div>
                    <div className="text-xs text-slate-500">{item.assignedTo}</div>
                  </td>
                )}
                
                {visibleColumns.order && (
                  <td className="px-4 py-3">
                    <button 
                      className="text-sm text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 font-medium"
                      onClick={(e) => {
                        e.stopPropagation()
                        console.log('Navigate to order:', item.order)
                      }}
                    >
                      {item.order}
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </td>
                )}
                
                {visibleColumns.customer && (
                  <td className="px-4 py-3">
                    <button 
                      className="text-sm text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 font-medium"
                      onClick={(e) => {
                        e.stopPropagation()
                        console.log('Navigate to customer:', item.customer)
                      }}
                    >
                      {item.customer}
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </td>
                )}
                
                {visibleColumns.workflow && (
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-xs rounded-full border-slate-300">
                      {item.workflow}
                    </Badge>
                  </td>
                )}
                
                {visibleColumns.stage && (
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-700 font-medium">{item.stage}</span>
                  </td>
                )}
                
                {visibleColumns.progress && (
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            item.progress >= 90 ? 'bg-gradient-to-r from-emerald-500 to-green-600' :
                            item.progress >= 60 ? 'bg-gradient-to-r from-blue-500 to-indigo-600' :
                            item.progress >= 30 ? 'bg-gradient-to-r from-amber-500 to-orange-600' :
                            'bg-slate-400'
                          }`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-700 min-w-[40px] text-right">
                        {item.progress}%
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                      {item.completed.toLocaleString()} / {item.quantity.toLocaleString()}
                    </div>
                  </td>
                )}
                
                {visibleColumns.status && (
                  <td className="px-4 py-3">
                    <Badge className={`${getStatusColor(item.status)} rounded-full text-xs font-semibold`}>
                      {item.status.replace('-', ' ')}
                    </Badge>
                  </td>
                )}
                
                {visibleColumns.actions && (
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation()
                          onItemClick?.(item)
                        }}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      
                      {showMessaging && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-7 w-7 p-0 rounded-full relative ${item.hasMessages ? 'text-blue-600' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            console.log('Open messages for item:', item.id)
                          }}
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          {item.hasMessages && (
                            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
                          )}
                        </Button>
                      )}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 rounded-full"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => console.log('View details:', item.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => console.log('Edit item:', item.id)}>
                            <Settings2 className="mr-2 h-4 w-4" />
                            Edit item
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => console.log('View components:', item.id)}>
                            <Package className="mr-2 h-4 w-4" />
                            View components ({item.components})
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => console.log('Print label:', item.id)}>
                            Print label
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => console.log('Export data:', item.id)}>
                            <Download className="mr-2 h-4 w-4" />
                            Export data
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <Package className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-900">No items found</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              {searchQuery || activeFiltersCount > 0 
                ? 'Try adjusting your search criteria or clearing some filters to see more results.'
                : 'Create your first item to get started with tracking.'
              }
            </p>
            {(searchQuery || activeFiltersCount > 0) && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="mt-4 rounded-full"
              >
                Clear all filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
