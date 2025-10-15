"use client"

/**
 * Scan History Table Component
 * 
 * Displays recent QR code scans with filtering and sorting
 */

import { useState, useMemo } from 'react'
import { ScanEvent } from '@/lib/labels/types'
import { formatDistanceToNow } from 'date-fns'
import { Search, Download } from 'lucide-react'

interface ScanHistoryTableProps {
  scans: ScanEvent[]
  maxRows?: number
}

export function ScanHistoryTable({ scans, maxRows }: ScanHistoryTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterAction, setFilterAction] = useState<string>('all')
  
  // Handle export to CSV
  const handleExport = (scans: ScanEvent[]) => {
    const headers = ['Timestamp', 'Item', 'Type', 'Action', 'Location', 'Scanned By', 'Role', 'Notes']
    const rows = scans.map(s => [
      new Date(s.timestamp).toLocaleString(),
      s.entityName,
      s.entityType,
      s.action,
      s.location,
      s.scannedBy,
      s.scannedByRole,
      s.notes || ''
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `scan-history-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  
  // Filter and search scans
  const filteredScans = useMemo(() => {
    let filtered = scans
    
    // Filter by action
    if (filterAction !== 'all') {
      filtered = filtered.filter(s => s.action === filterAction)
    }
    
    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(s =>
        s.entityName.toLowerCase().includes(query) ||
        s.scannedBy.toLowerCase().includes(query) ||
        s.location.toLowerCase().includes(query)
      )
    }
    
    // Sort by most recent
    filtered = [...filtered].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    
    // Limit rows if specified
    if (maxRows) {
      filtered = filtered.slice(0, maxRows)
    }
    
    return filtered
  }, [scans, searchQuery, filterAction, maxRows])
  
  const getActionBadge = (action: string) => {
    const badges = {
      'view': 'bg-blue-100 text-blue-800',
      'update-stage': 'bg-green-100 text-green-800',
      'report-issue': 'bg-red-100 text-red-800',
      'move-location': 'bg-purple-100 text-purple-800',
      'qc-check': 'bg-yellow-100 text-yellow-800'
    }
    return badges[action as keyof typeof badges] || 'bg-gray-100 text-gray-800'
  }
  
  const getActionLabel = (action: string) => {
    const labels = {
      'view': 'View',
      'update-stage': 'Stage Update',
      'report-issue': 'Issue Report',
      'move-location': 'Location Move',
      'qc-check': 'QC Check'
    }
    return labels[action as keyof typeof labels] || action
  }
  
  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search scans..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-slate-300 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">All Actions</option>
          <option value="view">View</option>
          <option value="update-stage">Stage Update</option>
          <option value="report-issue">Issue Report</option>
          <option value="move-location">Location Move</option>
          <option value="qc-check">QC Check</option>
        </select>
        
        <button 
          onClick={() => handleExport(filteredScans)}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          title="Export to CSV"
        >
          <Download className="h-4 w-4" />
        </button>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Time</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Item</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Action</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Location</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Scanned By</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredScans.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No scans found
                </td>
              </tr>
            ) : (
              filteredScans.map((scan) => (
                <tr key={scan.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-600">
                    {formatDistanceToNow(new Date(scan.timestamp), { addSuffix: true })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{scan.entityName}</div>
                    <div className="text-xs text-slate-500">{scan.entityType}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getActionBadge(scan.action)}`}>
                      {getActionLabel(scan.action)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{scan.location}</td>
                  <td className="px-4 py-3">
                    <div className="text-slate-900">{scan.scannedBy}</div>
                    <div className="text-xs text-slate-500">{scan.scannedByRole}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {scan.notes ? (
                      <span className="line-clamp-1" title={scan.notes}>
                        {scan.notes}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {maxRows && filteredScans.length === maxRows && (
        <p className="text-center text-sm text-slate-500">
          Showing {maxRows} most recent scans. <a href="/labels/analytics" className="text-blue-600 hover:underline">View all →</a>
        </p>
      )}
    </div>
  )
}

