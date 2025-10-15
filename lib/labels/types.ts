/**
 * Label System Types
 * 
 * Core type definitions for QR codes, labels, templates, scans, and print jobs
 */

// ============================================================================
// QR Code Types
// ============================================================================

export type QRCodeType = "lineItem" | "component" | "itemCode" | "order"

export type QRCodeData = {
  version: "v1"
  type: QRCodeType
  id: string                 // UUID of the entity (line item, component, etc.)
  code: string              // Human-readable code (e.g., "JKT-AURORA-M-001")
  orderId?: string
  itemCodeId?: string
  timestamp: string          // Generation timestamp
  checksum: string          // For validation
}

export type QRCodeFormat = "deep-link" | "web-url" | "raw-data"

// ============================================================================
// Label Types
// ============================================================================

export type LabelStatus = "generated" | "printed" | "active" | "damaged" | "replaced"

export type Label = {
  id: string
  entityId: string           // ID of line item, component, etc.
  entityType: QRCodeType
  qrData: QRCodeData
  qrCodeUrl: string          // Data URL of the QR code image
  
  templateId: string
  
  status: LabelStatus
  printCount: number         // How many times this label has been printed
  
  lastPrintedAt?: string
  lastScannedAt?: string
  
  createdAt: string
  updatedAt: string
}

// ============================================================================
// Label Template Types
// ============================================================================

export type LabelOrientation = "portrait" | "landscape"
export type LabelUnit = "mm" | "inches"
export type QRCodeSize = "small" | "medium" | "large"
export type LogoAlignment = "top-left" | "top-center" | "top-right" | "custom"
export type TextAlignment = "left" | "center" | "right"
export type FontWeight = "normal" | "bold"

export type LabelDimensions = {
  width: number
  height: number
  unit: LabelUnit
}

export type LogoConfig = {
  enabled: boolean
  position: { x: number; y: number }  // in mm from top-left
  size: { width: number; height: number }
  alignment: LogoAlignment
}

export type QRCodeConfig = {
  position: { x: number; y: number }
  size: number             // width/height in mm (square)
  errorCorrection: "L" | "M" | "Q" | "H"
}

export type TextElement = {
  id: string
  type: "field" | "static"
  fieldId?: string         // e.g., "code", "attribute:Fabric", "serialNumber"
  staticText?: string
  label?: string           // Optional label to show before value (e.g., "SKU:")
  position: { x: number; y: number }
  style: {
    fontFamily: string
    fontSize: number       // in pt
    fontWeight: FontWeight
    color: string          // hex color
    alignment: TextAlignment
  }
  maxWidth?: number        // text wrapping width in mm
}

export type LabelStyling = {
  backgroundColor: string
  borderEnabled: boolean
  borderWidth?: number
  borderColor?: string
  padding: number          // in mm
}

export type LabelTemplate = {
  id: string
  name: string
  type: "item-type" | "organization-default" | "custom"
  itemType?: string        // "jacket", "component", etc.
  
  orientation: LabelOrientation
  dimensions: LabelDimensions
  
  logo: LogoConfig
  qrCode: QRCodeConfig
  textElements: TextElement[]
  styling: LabelStyling
  
  isDefault: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
}

// ============================================================================
// Scan Tracking Types
// ============================================================================

export type ScanAction = "view" | "update-stage" | "report-issue" | "move-location" | "qc-check"

export type ScanEvent = {
  id: string
  labelId: string
  entityId: string           // Line item, component, etc.
  entityType: QRCodeType
  entityName: string         // Human-readable name
  
  action: ScanAction
  location: string
  scannedBy: string
  scannedByRole: string
  
  notes?: string
  metadata?: Record<string, any>  // Additional context
  
  timestamp: string
  
  // Device info
  deviceId?: string
  deviceType?: "mobile" | "desktop" | "tablet"
  offline?: boolean          // Was scan performed offline?
}

export type ScanAnalytics = {
  totalScans: number
  scansToday: number
  uniqueItemsScanned: number
  mostScannedItem: { id: string; name: string; count: number } | null
  scansByHour: Record<string, number>
  scansByLocation: Record<string, number>
  scansByUser: Record<string, number>
  scansByAction: Record<ScanAction, number>
}

// ============================================================================
// Print Job Types
// ============================================================================

export type PrintJobStatus = "pending" | "processing" | "completed" | "failed" | "cancelled"
export type PrintJobType = "single" | "batch-order" | "batch-itemcode" | "batch-selection"

export type PrintJob = {
  id: string
  name: string
  type: PrintJobType
  
  labelIds: string[]
  labelCount: number
  
  templateId: string
  
  // PDF generation config
  labelsPerRow: number
  labelsPerSheet: number
  
  status: PrintJobStatus
  progress: number           // 0-100
  
  pdfUrl?: string            // URL to generated PDF
  
  createdBy: string
  createdAt: string
  startedAt?: string
  completedAt?: string
  
  error?: string
}

// ============================================================================
// Label Inventory Types
// ============================================================================

export type LabelInventory = {
  total: number
  byStatus: Record<LabelStatus, number>
  byType: Record<QRCodeType, number>
  generated: number
  printed: number
  active: number
  pendingReprint: number
}

