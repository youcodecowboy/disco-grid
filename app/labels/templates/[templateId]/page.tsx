"use client"

/**
 * Label Template Editor Page
 */

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { Plus, Trash2, Save, ArrowLeft, Bell } from 'lucide-react'
import { getTemplateById, saveTemplate, getDefaultTemplate } from '@/lib/labels/labelTemplates'
import { LabelTemplate, TextElement } from '@/lib/labels/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QRCodeGenerator } from '@/components/labels/QRCodeGenerator'
import { createQRCodeData } from '@/lib/labels/qrGenerator'
import Image from 'next/image'

export default function LabelTemplateEditorPage() {
  const params = useParams()
  const router = useRouter()
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const templateId = params.templateId as string
  
  const [template, setTemplate] = useState<LabelTemplate | null>(null)
  
  useEffect(() => {
    if (templateId === 'new') {
      const defaultTemplate = getDefaultTemplate()
      setTemplate({
        ...defaultTemplate,
        id: `template-${Date.now()}`,
        name: 'New Template',
        type: 'custom',
        isDefault: false,
        createdBy: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    } else {
      const loaded = getTemplateById(templateId)
      if (loaded) {
        // Ensure QR code position is within label bounds
        const adjustedTemplate = { ...loaded }
        const maxQrX = adjustedTemplate.dimensions.width - adjustedTemplate.qrCode.size - 2
        const maxQrY = adjustedTemplate.dimensions.height - adjustedTemplate.qrCode.size - 2
        
        if (adjustedTemplate.qrCode.position.x > maxQrX || adjustedTemplate.qrCode.position.y > maxQrY) {
          // QR is out of bounds, reposition based on orientation
          if (adjustedTemplate.orientation === 'portrait') {
            adjustedTemplate.qrCode.position = { 
              x: Math.max(2, (adjustedTemplate.dimensions.width - adjustedTemplate.qrCode.size) / 2), 
              y: adjustedTemplate.dimensions.height - adjustedTemplate.qrCode.size - 8
            }
          } else {
            adjustedTemplate.qrCode.position = { 
              x: adjustedTemplate.dimensions.width - adjustedTemplate.qrCode.size - 8, 
              y: 8 
            }
          }
        }
        
        setTemplate(adjustedTemplate)
      } else {
        alert('Template not found')
        router.push('/labels/templates')
      }
    }
  }, [templateId, router])
  
  if (!template) {
    return <div>Loading...</div>
  }
  
  // Sample data for preview
  const sampleData = {
    id: 'SAMPLE-001',
    name: 'Sample Item',
    code: 'SAMPLE-001',
    serialNumber: '001',
    orderId: 'ORD-001',
    itemCodeId: 'IC-001',
    attributes: [
      { field: 'Fabric', value: 'Cotton' },
      { field: 'Color', value: 'Blue' }
    ]
  }
  
  const qrData = createQRCodeData('lineItem', sampleData.id, sampleData.code)
  
  const resolveFieldValue = (fieldId?: string): string => {
    if (!fieldId) return 'Sample Value'
    if (fieldId.startsWith('attribute:')) {
      const attrName = fieldId.split(':')[1]
      return sampleData.attributes.find(a => a.field === attrName)?.value || 'N/A'
    }
    return (sampleData as any)[fieldId] || 'N/A'
  }
  
  const handleSave = () => {
    saveTemplate(template)
    alert('Template saved!')
    router.push('/labels/templates')
  }
  
  const handleAddTextField = () => {
    // Calculate smart positioning for new field
    const startY = template.logo.enabled ? template.logo.position.y + template.logo.size.height + 3 : 5
    const lineHeight = 8 // Approximate line height in mm
    const margin = 5
    
    // Find the next available Y position
    let nextY = startY
    const existingYPositions = template.textElements.map(el => el.position.y).sort((a, b) => a - b)
    
    if (existingYPositions.length > 0) {
      // Position below the last text element
      nextY = existingYPositions[existingYPositions.length - 1] + lineHeight
    }
    
    // Make sure it doesn't go off the bottom of the label
    const maxY = template.dimensions.height - 10 // Leave 10mm margin at bottom
    if (nextY > maxY) {
      nextY = startY // Wrap back to top if we're out of space
    }
    
    const newElement: TextElement = {
      id: `text-${Date.now()}`,
      type: 'field',
      fieldId: 'name',
      position: { x: margin, y: nextY },
      style: {
        fontFamily: 'Arial',
        fontSize: 9,
        fontWeight: 'normal',
        color: '#000000',
        alignment: 'left'
      }
    }
    
    setTemplate({
      ...template,
      textElements: [...template.textElements, newElement]
    })
  }
  
  const handleRemoveTextField = (id: string) => {
    setTemplate({
      ...template,
      textElements: template.textElements.filter(el => el.id !== id)
    })
  }
  
  const handleAutoArrangeFields = () => {
    // Auto-arrange all text fields in a neat stack
    const startY = template.logo.enabled ? template.logo.position.y + template.logo.size.height + 3 : 5
    const lineHeight = 8
    const margin = 5
    
    const rearrangedElements = template.textElements.map((el, idx) => ({
      ...el,
      position: { x: margin, y: startY + (idx * lineHeight) }
    }))
    
    setTemplate({
      ...template,
      textElements: rearrangedElements
    })
  }
  
  const isElementOutOfBounds = (element: TextElement): boolean => {
    const maxX = template.dimensions.width - 5
    const maxY = template.dimensions.height - 5
    return element.position.x > maxX || element.position.y > maxY || element.position.x < 0 || element.position.y < 0
  }
  
  const handleUpdateTextField = (id: string, updates: Partial<TextElement>) => {
    setTemplate({
      ...template,
      textElements: template.textElements.map(el =>
        el.id === id ? { ...el, ...updates } : el
      )
    })
  }
  
  const availableFields = [
    { id: 'name', label: 'Item Name' },
    { id: 'code', label: 'Item Code' },
    { id: 'serialNumber', label: 'Serial Number' },
    { id: 'attribute:Fabric', label: 'Fabric' },
    { id: 'attribute:Color', label: 'Color' },
  ]
  
  // Calculate scale for preview to fit nicely
  // Convert mm to pixels: 1mm = 3.78px at 96 DPI
  const MM_TO_PX = 3.78
  const maxPreviewWidth = 500
  
  // Calculate actual size in pixels
  const actualWidthPx = template.dimensions.width * MM_TO_PX
  const actualHeightPx = template.dimensions.height * MM_TO_PX
  
  // Calculate scale to fit in preview area
  const scale = Math.min(maxPreviewWidth / actualWidthPx, 2.5)
  const previewWidth = actualWidthPx * scale
  const previewHeight = actualHeightPx * scale
  
  // Helper to convert mm to scaled pixels
  const mmToPreviewPx = (mm: number) => mm * MM_TO_PX * scale
  
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 h-14 border-b bg-background/95 backdrop-blur">
        <div className="flex h-full items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/labels/templates')}
              className="p-2 hover:bg-slate-100 rounded-md"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="text-sm font-medium">{template.name}</div>
          </div>

          <div className="flex items-center gap-4">
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <Save className="mr-2 h-4 w-4" />
              Save Template
            </Button>
            <button className="p-2 hover:bg-slate-100 rounded-md">
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <Sidebar 
          sidebarExpanded={sidebarExpanded}
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
        />

        <main className="flex-1 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Editor Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Template Settings</CardTitle>
                  <CardDescription>Configure label dimensions and basic settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Template Name</label>
                    <input
                      type="text"
                      value={template.name}
                      onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Orientation</label>
                    <div className="mt-2 flex gap-3">
                      <button
                        onClick={() => {
                          const newWidth = 101.6
                          const newHeight = 50.8
                          const qrSize = template.qrCode.size
                          
                          setTemplate({ 
                            ...template, 
                            orientation: 'landscape',
                            dimensions: { ...template.dimensions, width: newWidth, height: newHeight },
                            qrCode: {
                              ...template.qrCode,
                              position: { 
                                x: newWidth - qrSize - 4,  // Right side with margin
                                y: 8
                              }
                            },
                            logo: {
                              ...template.logo,
                              position: { x: 5, y: 5 }
                            },
                            textElements: template.textElements.map((el, idx) => ({
                              ...el,
                              position: { x: 5, y: 20 + (idx * 10) }
                            }))
                          })
                        }}
                        className={`flex-1 rounded-md border px-3 py-2 text-sm ${
                          template.orientation === 'landscape' 
                            ? 'border-blue-500 bg-blue-50 text-blue-900' 
                            : 'border-slate-300 bg-white text-slate-700'
                        }`}
                      >
                        Landscape (4" × 2")
                      </button>
                      <button
                        onClick={() => {
                          const newWidth = 50.8
                          const newHeight = 101.6
                          const qrSize = template.qrCode.size
                          
                          setTemplate({ 
                            ...template, 
                            orientation: 'portrait',
                            dimensions: { ...template.dimensions, width: newWidth, height: newHeight },
                            qrCode: {
                              ...template.qrCode,
                              position: { 
                                x: Math.max(2, (newWidth - qrSize) / 2), 
                                y: newHeight - qrSize - 8
                              }
                            },
                            logo: {
                              ...template.logo,
                              position: { x: 5, y: 5 }
                            },
                            textElements: template.textElements.map((el, idx) => ({
                              ...el,
                              position: { x: 5, y: 20 + (idx * 10) }
                            }))
                          })
                        }}
                        className={`flex-1 rounded-md border px-3 py-2 text-sm ${
                          template.orientation === 'portrait' 
                            ? 'border-blue-500 bg-blue-50 text-blue-900' 
                            : 'border-slate-300 bg-white text-slate-700'
                        }`}
                      >
                        Portrait (2" × 4")
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Width (mm)</label>
                      <input
                        type="number"
                        value={template.dimensions.width}
                        onChange={(e) => setTemplate({
                          ...template,
                          dimensions: { ...template.dimensions, width: Number(e.target.value) }
                        })}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Height (mm)</label>
                      <input
                        type="number"
                        value={template.dimensions.height}
                        onChange={(e) => setTemplate({
                          ...template,
                          dimensions: { ...template.dimensions, height: Number(e.target.value) }
                        })}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={template.logo.enabled}
                        onChange={(e) => setTemplate({
                          ...template,
                          logo: { ...template.logo, enabled: e.target.checked }
                        })}
                        className="rounded"
                      />
                      Show Groovy Logo
                    </label>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Text Fields</CardTitle>
                      <CardDescription>Add and configure label information</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAutoArrangeFields} size="sm" variant="ghost" title="Auto-arrange all fields">
                        Auto-Arrange
                      </Button>
                      <Button onClick={handleAddTextField} size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Field
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {template.textElements.map((element) => {
                    const outOfBounds = isElementOutOfBounds(element)
                    return (
                      <div 
                        key={element.id} 
                        className={`border rounded-lg p-3 space-y-2 ${outOfBounds ? 'border-red-300 bg-red-50' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1">
                            <select
                              value={element.fieldId || ''}
                              onChange={(e) => handleUpdateTextField(element.id, { fieldId: e.target.value })}
                              className="flex-1 rounded-md border border-slate-300 px-2 py-1 text-sm"
                            >
                              <option value="">Select Field</option>
                              {availableFields.map(field => (
                                <option key={field.id} value={field.id}>{field.label}</option>
                              ))}
                            </select>
                            {outOfBounds && (
                              <span className="text-xs font-medium text-red-600 whitespace-nowrap">
                                Out of bounds!
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveTextField(element.id)}
                            className="ml-2 p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <label className="text-slate-600">Font Size</label>
                          <input
                            type="number"
                            value={element.style.fontSize}
                            onChange={(e) => handleUpdateTextField(element.id, {
                              style: { ...element.style, fontSize: Number(e.target.value) }
                            })}
                            className="w-full rounded border border-slate-300 px-2 py-1 mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-slate-600">Weight</label>
                          <select
                            value={element.style.fontWeight}
                            onChange={(e) => handleUpdateTextField(element.id, {
                              style: { ...element.style, fontWeight: e.target.value as 'normal' | 'bold' }
                            })}
                            className="w-full rounded border border-slate-300 px-2 py-1 mt-1"
                          >
                            <option value="normal">Normal</option>
                            <option value="bold">Bold</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-slate-600">Y Position</label>
                          <input
                            type="number"
                            value={element.position.y}
                            onChange={(e) => handleUpdateTextField(element.id, {
                              position: { ...element.position, y: Number(e.target.value) }
                            })}
                            className="w-full rounded border border-slate-300 px-2 py-1 mt-1"
                          />
                        </div>
                      </div>
                    </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>
            
            {/* Preview Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Label Preview</CardTitle>
                  <CardDescription>Real-time preview of your label design</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center p-8 bg-slate-50 rounded-lg overflow-x-auto">
                    <div
                      className="relative bg-white"
                      style={{
                        width: `${previewWidth}px`,
                        height: `${previewHeight}px`,
                        backgroundColor: template.styling.backgroundColor,
                        border: template.styling.borderEnabled 
                          ? `${template.styling.borderWidth * scale}px solid ${template.styling.borderColor}`
                          : '1px solid #e2e8f0',
                        padding: `${mmToPreviewPx(template.styling.padding)}px`
                      }}
                    >
                      {/* Logo */}
                      {template.logo.enabled && (
                        <div
                          className="absolute"
                          style={{
                            left: `${mmToPreviewPx(template.logo.position.x)}px`,
                            top: `${mmToPreviewPx(template.logo.position.y)}px`,
                            width: `${mmToPreviewPx(template.logo.size.width)}px`,
                            height: `${mmToPreviewPx(template.logo.size.height)}px`
                          }}
                        >
                          <Image
                            src="/groovy-logo.png"
                            alt="Logo"
                            width={Math.round(mmToPreviewPx(template.logo.size.width))}
                            height={Math.round(mmToPreviewPx(template.logo.size.height))}
                            className="object-contain w-full h-full"
                          />
                        </div>
                      )}
                      
                      {/* QR Code */}
                      <div
                        className="absolute"
                        style={{
                          left: `${mmToPreviewPx(template.qrCode.position.x)}px`,
                          top: `${mmToPreviewPx(template.qrCode.position.y)}px`,
                          width: `${mmToPreviewPx(template.qrCode.size)}px`,
                          height: `${mmToPreviewPx(template.qrCode.size)}px`
                        }}
                      >
                        <QRCodeGenerator
                          data={qrData}
                          size={mmToPreviewPx(template.qrCode.size)}
                          level={template.qrCode.errorCorrection}
                          includeMargin={false}
                        />
                      </div>
                      
                      {/* Text Elements */}
                      {template.textElements.map((element) => {
                        const outOfBounds = isElementOutOfBounds(element)
                        return (
                          <div
                            key={element.id}
                            className="absolute whitespace-nowrap"
                            style={{
                              left: `${mmToPreviewPx(element.position.x)}px`,
                              top: `${mmToPreviewPx(element.position.y)}px`,
                              fontFamily: element.style.fontFamily,
                              fontSize: `${element.style.fontSize * scale}pt`,
                              fontWeight: element.style.fontWeight,
                              color: outOfBounds ? '#ef4444' : element.style.color,
                              textAlign: element.style.alignment,
                              outline: outOfBounds ? '2px dashed #ef4444' : 'none',
                              padding: outOfBounds ? '2px' : '0'
                            }}
                            title={outOfBounds ? 'This field is outside label bounds!' : ''}
                          >
                            {element.type === 'static' 
                              ? element.staticText 
                              : resolveFieldValue(element.fieldId)}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  
                  <p className="mt-4 text-center text-xs text-slate-500">
                    Preview scaled to fit • Actual size: {template.dimensions.width} × {template.dimensions.height}mm
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

