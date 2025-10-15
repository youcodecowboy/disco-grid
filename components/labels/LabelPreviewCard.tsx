"use client"

/**
 * Label Preview Card Component
 * 
 * Shows live preview of label with actual QR code, logo, and configured text elements
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LabelTemplate, QRCodeData } from '@/lib/labels/types'
import { QRCodeGenerator } from './QRCodeGenerator'
import { createQRCodeData } from '@/lib/labels/qrGenerator'
import Image from 'next/image'

interface LabelPreviewCardProps {
  template: LabelTemplate
  itemData: {
    id: string
    name: string
    code: string
    serialNumber?: string
    orderId?: string
    itemCodeId?: string
    [key: string]: any
  }
  showControls?: boolean
}

export function LabelPreviewCard({
  template,
  itemData,
  showControls = true
}: LabelPreviewCardProps) {
  // Create QR code data
  const qrData = createQRCodeData(
    'lineItem',
    itemData.id,
    itemData.code,
    itemData.orderId,
    itemData.itemCodeId
  )
  
  // Calculate scale for preview (showing at 50% size for screen viewing)
  const scale = 0.5
  const previewWidth = template.dimensions.width * scale
  const previewHeight = template.dimensions.height * scale
  
  // Resolve field values
  const resolveFieldValue = (fieldId?: string): string => {
    if (!fieldId) return ''
    
    // Handle nested attributes (e.g., "attribute:Fabric")
    if (fieldId.startsWith('attribute:')) {
      const attrName = fieldId.split(':')[1]
      return itemData.attributes?.find((a: any) => a.field === attrName)?.value || ''
    }
    
    // Direct field access
    return itemData[fieldId] || ''
  }
  
  // Handle print
  const handlePrint = async (template: LabelTemplate, itemData: any, qrData: QRCodeData) => {
    // Get QR code as data URL
    const svgElement = document.querySelector('.label-preview-qr svg')
    if (!svgElement) {
      alert('QR code not found. Please try again.')
      return
    }
    
    const svgData = new XMLSerializer().serializeToString(svgElement)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    // Convert mm to pixels (assuming 96 DPI for screen, we'll use higher for print)
    const dpi = 300
    const mmToPixel = (mm: number) => (mm / 25.4) * dpi
    
    const labelWidthPx = mmToPixel(template.dimensions.width)
    const labelHeightPx = mmToPixel(template.dimensions.height)
    const qrSizePx = mmToPixel(template.qrCode.size)
    
    img.onload = () => {
      // Create QR code canvas
      canvas.width = qrSizePx
      canvas.height = qrSizePx
      ctx?.drawImage(img, 0, 0, qrSizePx, qrSizePx)
      const qrDataUrl = canvas.toDataURL('image/png')
      
      // Generate print HTML
      const printWindow = window.open('', '_blank')
      if (!printWindow) return
      
      const { width, height, unit } = template.dimensions
      
      const textElementsHtml = template.textElements.map(element => {
        const value = resolveFieldValue(element.fieldId)
        const displayText = element.type === 'static' 
          ? element.staticText 
          : element.label 
            ? `${element.label} ${value}`
            : value
        
        return `
          <div style="
            position: absolute;
            left: ${element.position.x}mm;
            top: ${element.position.y}mm;
            font-family: ${element.style.fontFamily};
            font-size: ${element.style.fontSize}pt;
            font-weight: ${element.style.fontWeight};
            color: ${element.style.color};
            text-align: ${element.style.alignment};
            white-space: nowrap;
          ">${displayText}</div>
        `
      }).join('')
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Label - ${itemData.code}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            @page {
              size: ${width}mm ${height}mm;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
            }
            .label {
              position: relative;
              width: ${width}mm;
              height: ${height}mm;
              background: ${template.styling.backgroundColor};
              padding: ${template.styling.padding}mm;
              ${template.styling.borderEnabled ? `border: ${template.styling.borderWidth}px solid ${template.styling.borderColor};` : ''}
              page-break-after: always;
            }
            .logo {
              position: absolute;
              left: ${template.logo.position.x}mm;
              top: ${template.logo.position.y}mm;
              width: ${template.logo.size.width}mm;
              height: ${template.logo.size.height}mm;
            }
            .qr-code {
              position: absolute;
              left: ${template.qrCode.position.x}mm;
              top: ${template.qrCode.position.y}mm;
              width: ${template.qrCode.size}mm;
              height: ${template.qrCode.size}mm;
            }
            @media print {
              body { margin: 0; padding: 0; }
              .label { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="label">
            ${template.logo.enabled ? `
              <img src="/groovy-logo.png" class="logo" alt="Logo" />
            ` : ''}
            <img src="${qrDataUrl}" class="qr-code" alt="QR Code" />
            ${textElementsHtml}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                setTimeout(function() {
                  window.close();
                }, 100);
              }, 500);
            }
          </script>
        </body>
        </html>
      `)
      printWindow.document.close()
    }
    
    img.onerror = () => {
      alert('Failed to generate QR code for printing')
    }
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }
  
  // Handle edit template
  const handleEditTemplate = (templateId: string) => {
    window.location.href = `/labels/templates/${templateId}`
  }
  
  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-blue-900">Label Preview</CardTitle>
        <CardDescription className="text-blue-700">
          {template.name} - {template.dimensions.width} × {template.dimensions.height} {template.dimensions.unit}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border-2 border-blue-200 bg-white p-4">
          {/* Label canvas */}
          <div
            className="relative mx-auto"
            style={{
              width: `${previewWidth}mm`,
              height: `${previewHeight}mm`,
              backgroundColor: template.styling.backgroundColor,
              border: template.styling.borderEnabled 
                ? `${template.styling.borderWidth}px solid ${template.styling.borderColor}` 
                : 'none',
              padding: `${template.styling.padding * scale}mm`
            }}
          >
            {/* Logo */}
            {template.logo.enabled && (
              <div
                className="absolute"
                style={{
                  left: `${template.logo.position.x * scale}mm`,
                  top: `${template.logo.position.y * scale}mm`,
                  width: `${template.logo.size.width * scale}mm`,
                  height: `${template.logo.size.height * scale}mm`
                }}
              >
                <Image
                  src="/groovy-logo.png"
                  alt="Groovy Logo"
                  width={template.logo.size.width * 3.78} // Convert mm to px at 96 DPI
                  height={template.logo.size.height * 3.78}
                  className="object-contain"
                />
              </div>
            )}
            
            {/* QR Code */}
            <div
              className="absolute label-preview-qr"
              style={{
                left: `${template.qrCode.position.x * scale}mm`,
                top: `${template.qrCode.position.y * scale}mm`,
                width: `${template.qrCode.size * scale}mm`,
                height: `${template.qrCode.size * scale}mm`
              }}
            >
              <QRCodeGenerator
                data={qrData}
                size={template.qrCode.size * 3.78} // Convert mm to px
                level={template.qrCode.errorCorrection}
                includeMargin={false}
              />
            </div>
            
            {/* Text Elements */}
            {template.textElements.map((element) => {
              const value = resolveFieldValue(element.fieldId)
              const displayText = element.type === 'static' 
                ? element.staticText 
                : element.label 
                  ? `${element.label} ${value}`
                  : value
              
              return (
                <div
                  key={element.id}
                  className="absolute whitespace-nowrap"
                  style={{
                    left: `${element.position.x * scale}mm`,
                    top: `${element.position.y * scale}mm`,
                    fontFamily: element.style.fontFamily,
                    fontSize: `${element.style.fontSize * scale}pt`,
                    fontWeight: element.style.fontWeight,
                    color: element.style.color,
                    textAlign: element.style.alignment,
                    maxWidth: element.maxWidth ? `${element.maxWidth * scale}mm` : undefined,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {displayText}
                </div>
              )
            })}
          </div>
          
          {/* Info text */}
          <p className="mt-3 text-center text-xs text-slate-500">
            Preview shown at 50% scale
          </p>
        </div>
        
        {showControls && (
          <div className="mt-4 flex gap-2">
            <button 
              onClick={() => handlePrint(template, itemData, qrData)}
              className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Print Label
            </button>
            <button 
              onClick={() => handleEditTemplate(template.id)}
              className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Edit Template
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

