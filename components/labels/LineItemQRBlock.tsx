"use client"

/**
 * Line Item QR Code Block
 * 
 * Displays QR code for a line item with download and reprint options
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { QRCodeGenerator } from './QRCodeGenerator'
import { createQRCodeData } from '@/lib/labels/qrGenerator'
import { Printer, Download, RefreshCw } from 'lucide-react'

interface LineItemQRBlockProps {
  lineItem: {
    id: string
    fullSerialNumber: string
    itemCodeId: string
    orderId: string
  }
  showControls?: boolean
  size?: 'small' | 'medium' | 'large'
}

export function LineItemQRBlock({
  lineItem,
  showControls = true,
  size = 'medium'
}: LineItemQRBlockProps) {
  const qrData = createQRCodeData(
    'lineItem',
    lineItem.id,
    lineItem.fullSerialNumber,
    lineItem.orderId,
    lineItem.itemCodeId
  )
  
  const getSizePixels = () => {
    switch (size) {
      case 'small': return 128
      case 'medium': return 256
      case 'large': return 512
      default: return 256
    }
  }
  
  const handleDownloadQR = () => {
    const svgElement = document.querySelector(`#qr-lineitem-${lineItem.id} svg`)
    if (!svgElement) return
    
    const svgData = new XMLSerializer().serializeToString(svgElement)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    const qrSize = getSizePixels()
    
    img.onload = () => {
      canvas.width = qrSize
      canvas.height = qrSize
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')
      
      const downloadLink = document.createElement('a')
      downloadLink.download = `qr-${lineItem.fullSerialNumber}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }
  
  const handlePrintLabel = () => {
    alert(`Print label for ${lineItem.fullSerialNumber}`)
  }
  
  const handleReprintLabel = () => {
    alert(`Reprint label for ${lineItem.fullSerialNumber}`)
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code</CardTitle>
        <CardDescription>Scan to view item on floor app</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          {/* QR Code */}
          <div id={`qr-lineitem-${lineItem.id}`} className="rounded-lg border-2 border-slate-200 bg-white p-4">
            <QRCodeGenerator
              data={qrData}
              size={getSizePixels()}
              level="M"
              includeMargin={true}
            />
          </div>
          
          {/* Item Code */}
          <div className="text-center">
            <div className="text-sm font-medium text-slate-900">{lineItem.fullSerialNumber}</div>
            <div className="text-xs text-slate-500">Serial Number</div>
          </div>
          
          {/* Controls */}
          {showControls && (
            <div className="flex w-full gap-2">
              <button 
                onClick={handleDownloadQR}
                className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                title="Download QR Code"
              >
                <Download className="mx-auto h-4 w-4" />
              </button>
              <button 
                onClick={handlePrintLabel}
                className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                title="Print Label"
              >
                <Printer className="mx-auto h-4 w-4" />
              </button>
              <button 
                onClick={handleReprintLabel}
                className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                title="Reprint Label"
              >
                <RefreshCw className="mx-auto h-4 w-4" />
              </button>
            </div>
          )}
          
          {/* Floor App URL */}
          <div className="w-full rounded-md bg-slate-50 p-3">
            <div className="text-xs font-medium text-slate-700 mb-1">Floor App URL:</div>
            <code className="block text-[10px] text-slate-600 break-all">
              groovy://scan?id={qrData.id}&type={qrData.type}
            </code>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

