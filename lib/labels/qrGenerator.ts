/**
 * QR Code Generation Utilities
 * 
 * Generate QR codes with UUID embedding for floor app navigation
 */

import { QRCodeData, QRCodeType, QRCodeFormat } from './types'

/**
 * Generate checksum for QR code validation
 */
function generateChecksum(data: string): string {
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36)
}

/**
 * Create QR code data structure
 */
export function createQRCodeData(
  type: QRCodeType,
  id: string,
  code: string,
  orderId?: string,
  itemCodeId?: string
): QRCodeData {
  const timestamp = new Date().toISOString()
  const checksumInput = `${type}:${id}:${code}:${timestamp}`
  
  return {
    version: "v1",
    type,
    id,
    code,
    orderId,
    itemCodeId,
    timestamp,
    checksum: generateChecksum(checksumInput)
  }
}

/**
 * Encode QR code data into URL format
 */
export function encodeQRData(data: QRCodeData, format: QRCodeFormat = "deep-link"): string {
  switch (format) {
    case "deep-link":
      // Format: groovy://scan?id=UUID&type=lineItem&code=JKT-001
      return `groovy://scan?id=${data.id}&type=${data.type}&code=${encodeURIComponent(data.code)}`
    
    case "web-url":
      // Format: https://app.groovy.com/floor/scan?id=UUID&type=lineItem
      return `https://app.groovy.com/floor/scan?id=${data.id}&type=${data.type}&code=${encodeURIComponent(data.code)}`
    
    case "raw-data":
      // Format: Base64 encoded JSON
      return btoa(JSON.stringify(data))
    
    default:
      return `groovy://scan?id=${data.id}&type=${data.type}`
  }
}

/**
 * Decode QR code data from URL
 */
export function decodeQRData(encoded: string): QRCodeData | null {
  try {
    // Try deep link format
    if (encoded.startsWith('groovy://scan')) {
      const url = new URL(encoded)
      const id = url.searchParams.get('id')
      const type = url.searchParams.get('type') as QRCodeType
      const code = url.searchParams.get('code')
      
      if (id && type && code) {
        return createQRCodeData(type, id, code)
      }
    }
    
    // Try web URL format
    if (encoded.startsWith('https://app.groovy.com/floor/scan')) {
      const url = new URL(encoded)
      const id = url.searchParams.get('id')
      const type = url.searchParams.get('type') as QRCodeType
      const code = url.searchParams.get('code')
      
      if (id && type && code) {
        return createQRCodeData(type, id, code)
      }
    }
    
    // Try base64 JSON format
    try {
      const decoded = JSON.parse(atob(encoded))
      if (decoded.version && decoded.id && decoded.type) {
        return decoded as QRCodeData
      }
    } catch {
      // Not base64 JSON, continue
    }
    
    return null
  } catch (error) {
    console.error('Failed to decode QR data:', error)
    return null
  }
}

/**
 * Validate QR code data structure
 */
export function validateQRData(data: QRCodeData): boolean {
  if (!data.version || !data.type || !data.id || !data.code) {
    return false
  }
  
  if (!['lineItem', 'component', 'itemCode', 'order'].includes(data.type)) {
    return false
  }
  
  // Validate checksum
  const checksumInput = `${data.type}:${data.id}:${data.code}:${data.timestamp}`
  const expectedChecksum = generateChecksum(checksumInput)
  
  return data.checksum === expectedChecksum
}

/**
 * Get QR code size in pixels based on label size
 */
export function getQRCodePixelSize(sizeCategory: "small" | "medium" | "large"): number {
  switch (sizeCategory) {
    case "small": return 128
    case "medium": return 256
    case "large": return 512
    default: return 256
  }
}

/**
 * Convert mm to pixels for print (300 DPI)
 */
export function mmToPixels(mm: number, dpi: number = 300): number {
  return Math.round((mm / 25.4) * dpi)
}

/**
 * Convert inches to pixels for print (300 DPI)
 */
export function inchesToPixels(inches: number, dpi: number = 300): number {
  return Math.round(inches * dpi)
}

