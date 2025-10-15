"use client"

/**
 * Label Templates Management Page
 */

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { Plus, Edit, Copy, Trash2, Bell } from 'lucide-react'
import { getAllTemplates, duplicateTemplate, deleteTemplate } from '@/lib/labels/labelTemplates'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function LabelTemplatesPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const router = useRouter()
  const templates = getAllTemplates()
  
  const handleEdit = (templateId: string) => {
    router.push(`/labels/templates/${templateId}`)
  }
  
  const handleDuplicate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      const newTemplate = duplicateTemplate(templateId, `${template.name} (Copy)`)
      if (newTemplate) {
        alert(`Template duplicated as "${newTemplate.name}"`)
        window.location.reload()
      }
    }
  }
  
  const handleDelete = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (template && confirm(`Delete template "${template.name}"?`)) {
      deleteTemplate(templateId)
      window.location.reload()
    }
  }
  
  const handleCreateNew = () => {
    router.push('/labels/templates/new')
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
            <div className="text-sm text-muted-foreground">Label Templates</div>
          </div>

          <div className="flex items-center gap-4">
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
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Label Templates</h1>
                  <p className="text-muted-foreground mt-1">
                    Create and manage label designs for different item types
                  </p>
                </div>
                <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Template
                </Button>
              </div>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="flex-1 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {template.orientation} • {template.dimensions.width} × {template.dimensions.height} {template.dimensions.unit}
                        </CardDescription>
                      </div>
                      {template.isDefault && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                          Default
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    {/* Template Preview Placeholder */}
                    <div className="aspect-video rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center">
                      <div className="text-center text-xs text-slate-400">
                        <div className="font-medium">Template Preview</div>
                        <div className="mt-1">{template.textElements.length} fields</div>
                      </div>
                    </div>
                    
                    {/* Template Info */}
                    <div className="text-xs text-slate-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Logo:</span>
                        <span className="font-medium">{template.logo.enabled ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>QR Size:</span>
                        <span className="font-medium">{template.qrCode.size}mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Text Fields:</span>
                        <span className="font-medium">{template.textElements.length}</span>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleEdit(template.id)}
                        className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDuplicate(template.id)}
                        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        title="Duplicate"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      {!template.isDefault && (
                        <button
                          onClick={() => handleDelete(template.id)}
                          className="rounded-md border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

