"use client"

/**
 * Labels Dashboard Page
 * 
 * Central hub for QR code and label management
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { QrCode, Printer, Tag, TrendingUp, Search, Settings, Bell } from 'lucide-react'
import { BulkLabelPrintTable } from '@/components/labels/BulkLabelPrintTable'
import { LabelPreviewCard } from '@/components/labels/LabelPreviewCard'
import { getAllScanEvents, getScanAnalytics } from '@/lib/labels/scanTracking'
import { getDefaultTemplate } from '@/lib/labels/labelTemplates'
import { getPrintableItemsWithStatus, markItemsAsPrinted } from '@/lib/labels/printQueue'
import { MOCK_ITEM_CODES } from '@/lib/data/itemCodes'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LabelsPage() {
  const router = useRouter()
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [showPrintModal, setShowPrintModal] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  
  // Load data
  const scans = getAllScanEvents()
  const analytics = getScanAnalytics()
  const defaultTemplate = getDefaultTemplate()
  const printableItems = getPrintableItemsWithStatus(MOCK_ITEM_CODES)
  
  // Sample item data for preview
  const sampleItemData = {
    id: 'LINE-JKT-M-001',
    name: 'Aurora Flight Jacket - Medium',
    code: 'JKT-AURORA-M-001',
    serialNumber: '001',
    orderId: 'ORD-2025-001',
    itemCodeId: 'IC-001',
    attributes: [
      { field: 'Fabric', value: 'Cordura® 210D' },
      { field: 'Colorway', value: 'Night Sky' }
    ]
  }
  
  // Calculate print metrics
  const totalItems = printableItems.length
  const fullyPrintedItems = printableItems.filter(i => i.printedQuantity === i.totalQuantity).length
  const partiallyPrintedItems = printableItems.filter(i => i.printedQuantity > 0 && i.printedQuantity < i.totalQuantity).length
  const unprintedItems = printableItems.filter(i => i.printedQuantity === 0).length
  
  // Handler functions
  const handlePrintSelected = (selectedIds: string[]) => {
    const selectedItems = printableItems.filter(item => selectedIds.includes(item.id))
    const totalLabels = selectedItems.reduce((sum, item) => 
      sum + (item.totalQuantity - item.printedQuantity), 0
    )
    
    // Simulate print job
    const confirmed = confirm(
      `Print ${totalLabels} labels for ${selectedIds.length} item(s)?\n\n` +
      selectedItems.map(item => 
        `• ${item.name}: ${item.totalQuantity - item.printedQuantity} labels`
      ).join('\n')
    )
    
    if (confirmed) {
      // Mark as printed
      const quantities: Record<string, number> = {}
      selectedItems.forEach(item => {
        quantities[item.id] = item.totalQuantity
      })
      markItemsAsPrinted(selectedIds, quantities)
      
      alert(`Print job queued! ${totalLabels} labels will be printed.\n\nRefresh the page to see updated print status.`)
      window.location.reload()
    }
  }
  
  const handleManageTemplates = () => {
    router.push('/labels/templates')
  }
  
  const handleViewAnalytics = () => {
    window.location.href = '/labels/analytics'
  }
  
  const handleCreateTemplate = () => {
    alert('Create new template - This will open the template designer')
  }
  
  const handleSelectTemplate = (templateName: string) => {
    alert(`Selected template: ${templateName}`)
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-full items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img src="/groovy-logo.png" alt="Groovy" className="h-8" />
            </div>
            <div className="text-sm text-muted-foreground">QR & Label Management</div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search labels..."
                className="pl-10 pr-4 py-1.5 text-sm border-2 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none z-10 h-4 w-4" />
            </div>
            <button className="p-2 hover:bg-slate-100 rounded-md" title="Notifications">
              <Bell className="h-5 w-5" />
            </button>
            <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">U</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <Sidebar 
          sidebarExpanded={sidebarExpanded}
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
        />

        <main className="flex-1 flex flex-col bg-background">
          {/* Page Header */}
          <div className="border-b bg-card">
            <div className="px-8 py-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">QR & Label Management</h1>
                <p className="text-muted-foreground mt-1">
                  Manage QR codes, print labels, and track scans across your production floor
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            <div className="space-y-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Tag className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
              <p className="text-xs text-slate-500">
                Item codes ready for labels
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fully Printed</CardTitle>
              <QrCode className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fullyPrintedItems}</div>
              <p className="text-xs text-slate-500">
                All labels printed
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{partiallyPrintedItems}</div>
              <p className="text-xs text-slate-500">Partially printed</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Not Printed</CardTitle>
              <Printer className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unprintedItems}</div>
              <p className="text-xs text-slate-500">
                Ready to print
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common label and QR code operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <button 
                onClick={() => window.location.href = '#bulk-print'}
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 text-left transition-colors hover:bg-slate-50"
              >
                <div className="rounded-lg bg-blue-100 p-2">
                  <Printer className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-slate-900">Bulk Print</div>
                  <div className="text-sm text-slate-500">Select items below to print</div>
                </div>
              </button>
              
              <button 
                onClick={handleManageTemplates}
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 text-left transition-colors hover:bg-slate-50"
              >
                <div className="rounded-lg bg-purple-100 p-2">
                  <Settings className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-slate-900">Manage Templates</div>
                  <div className="text-sm text-slate-500">Create and edit label designs</div>
                </div>
              </button>
              
              <button 
                onClick={handleViewAnalytics}
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 text-left transition-colors hover:bg-slate-50"
              >
                <div className="rounded-lg bg-green-100 p-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-slate-900">View Analytics</div>
                  <div className="text-sm text-slate-500">Scan patterns and insights</div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
        
        {/* Bulk Label Printing */}
        <div id="bulk-print">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Label Printing</CardTitle>
              <CardDescription>
                Select items to print labels. Each selection includes all line items for that item code.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BulkLabelPrintTable 
                items={printableItems} 
                onPrintSelected={handlePrintSelected}
              />
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mt-6">
          {/* Label Preview - Now takes full width */}
          <div className="lg:col-span-2">
          
            <LabelPreviewCard
              template={defaultTemplate}
              itemData={sampleItemData}
              showControls={true}
            />
            
            {/* Templates Quick Access */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base">Label Templates</CardTitle>
                <CardDescription>Saved label designs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <button 
                    onClick={() => handleSelectTemplate('Standard Label')}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-left text-sm hover:bg-slate-50"
                  >
                    <div className="font-medium">Standard Label</div>
                    <div className="text-xs text-slate-500">Logo + QR + Details</div>
                  </button>
                  <button 
                    onClick={() => handleSelectTemplate('Component Tag')}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-left text-sm hover:bg-slate-50"
                  >
                    <div className="font-medium">Component Tag</div>
                    <div className="text-xs text-slate-500">Compact component label</div>
                  </button>
                  <button 
                    onClick={() => handleSelectTemplate('Minimal QR')}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-left text-sm hover:bg-slate-50"
                  >
                    <div className="font-medium">Minimal QR</div>
                    <div className="text-xs text-slate-500">QR code only</div>
                  </button>
                </div>
                
                <button 
                  onClick={handleCreateTemplate}
                  className="mt-3 w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Create New Template
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

