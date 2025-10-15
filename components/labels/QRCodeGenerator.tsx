"use client"

/**
 * QR Code Generator Component
 * 
 * Generates actual QR codes using qrcode.react library with UUID embedding
 */

import { QRCodeSVG } from 'qrcode.react'
import { QRCodeData, QRCodeFormat } from '@/lib/labels/types'
import { encodeQRData } from '@/lib/labels/qrGenerator'

interface QRCodeGeneratorProps {
  data: QRCodeData
  size?: number
  format?: QRCodeFormat
  level?: "L" | "M" | "Q" | "H"
  includeMargin?: boolean
  className?: string
}

export function QRCodeGenerator({
  data,
  size = 256,
  format = 'deep-link',
  level = 'M',
  includeMargin = true,
  className = ''
}: QRCodeGeneratorProps) {
  const encodedData = encodeQRData(data, format)
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <QRCodeSVG
        value={encodedData}
        size={size}
        level={level}
        includeMargin={includeMargin}
        className="rounded-sm"
      />
    </div>
  )
}

/**
 * Downloadable QR Code Component
 * Includes download button
 */
interface DownloadableQRCodeProps extends QRCodeGeneratorProps {
  filename?: string
}

export function DownloadableQRCode({
  data,
  size = 256,
  format = 'deep-link',
  level = 'M',
  filename,
  ...props
}: DownloadableQRCodeProps) {
  const handleDownload = () => {
    const svgElement = document.querySelector(`#qr-${data.id} svg`)
    if (!svgElement) {
      console.error('QR code SVG not found')
      return
    }
    
    const svgData = new XMLSerializer().serializeToString(svgElement)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = size
      canvas.height = size
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')
      
      const downloadLink = document.createElement('a')
      downloadLink.download = filename || `qr-${data.code}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }
    
    img.onerror = () => {
      console.error('Failed to load QR code image')
    }
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }
  
  return (
    <div className="space-y-2">
      <div id={`qr-${data.id}`}>
        <QRCodeGenerator data={data} size={size} format={format} level={level} {...props} />
      </div>
      <button
        onClick={handleDownload}
        className="w-full rounded-md bg-slate-900 px-3 py-1.5 text-sm text-white hover:bg-slate-800"
      >
        Download QR Code
      </button>
    </div>
  )
}

