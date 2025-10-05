/**
 * Line Items Mock Data
 * 
 * Line Items are individual physical units with unique IDs and QR codes
 * Created when order is accepted - each has its own tracking and workflow progress
 */

export type LineItemStatus = "Not Started" | "In Production" | "Completed" | "On Hold" | "Failed QC"

export type LineItem = {
  id: string
  itemCodeId: string             // Parent item code
  orderId: string
  
  // Identity
  serialNumber: number           // 1, 2, 3... (sequence within item code)
  fullSerialNumber: string       // "JKT-AURORA-M-001"
  qrCode: string                 // Unique QR code
  qrCodeUrl: string              // URL to QR image
  
  // Current status
  status: LineItemStatus
  currentStage: string           // "Sewing", "Cutting", etc.
  currentStageStarted: string    // When entered current stage
  stageHistory: Array<{
    stage: string
    startedAt: string
    completedAt?: string
    duration?: number            // Minutes
    completedBy?: string
  }>
  
  // Progress
  progress: number               // 0-100%
  
  // Performance
  scheduleStatus: "ahead" | "on-time" | "behind" | "at-risk"
  daysAheadBehind: number        // +2 (ahead) or -3 (behind)
  
  // Location & tracking
  currentLocation: string
  lastScannedBy: string
  lastScannedAt: string
  
  // Notes (item-specific, not global attributes)
  notes: string
  
  // Timestamps
  createdAt: string
  startedAt?: string
  completedAt?: string
  updatedAt: string
}

// Generate line items for Aurora Flight Jacket - Medium (Item Code IC-001)
export const MOCK_LINE_ITEMS: LineItem[] = [
  {
    id: "LINE-JKT-M-001",
    itemCodeId: "IC-001",
    orderId: "ORD-2025-001",
    serialNumber: 1,
    fullSerialNumber: "JKT-AURORA-M-001",
    qrCode: "QR-JKT-AURORA-M-001",
    qrCodeUrl: "/qr/JKT-AURORA-M-001.png",
    status: "In Production",
    currentStage: "Sewing",
    currentStageStarted: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    stageHistory: [
      {
        stage: "Cutting",
        startedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        duration: 120,
        completedBy: "Cut Room Team"
      }
    ],
    progress: 45,
    scheduleStatus: "on-time",
    daysAheadBehind: 0,
    currentLocation: "Factory A - Sewing Line A - Station 3",
    lastScannedBy: "Maria Rodriguez",
    lastScannedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 min ago
    notes: "Check zipper alignment before finishing",
    createdAt: "2025-10-02T09:00:00Z",
    startedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: "LINE-JKT-M-002",
    itemCodeId: "IC-001",
    orderId: "ORD-2025-001",
    serialNumber: 2,
    fullSerialNumber: "JKT-AURORA-M-002",
    qrCode: "QR-JKT-AURORA-M-002",
    qrCodeUrl: "/qr/JKT-AURORA-M-002.png",
    status: "In Production",
    currentStage: "Sewing",
    currentStageStarted: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    stageHistory: [
      {
        stage: "Cutting",
        startedAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
        duration: 115,
        completedBy: "Cut Room Team"
      }
    ],
    progress: 40,
    scheduleStatus: "on-time",
    daysAheadBehind: 0,
    currentLocation: "Factory A - Sewing Line A - Station 5",
    lastScannedBy: "James Chen",
    lastScannedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 min ago
    notes: "",
    createdAt: "2025-10-02T09:00:00Z",
    startedAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  },
  {
    id: "LINE-JKT-M-003",
    itemCodeId: "IC-001",
    orderId: "ORD-2025-001",
    serialNumber: 3,
    fullSerialNumber: "JKT-AURORA-M-003",
    qrCode: "QR-JKT-AURORA-M-003",
    qrCodeUrl: "/qr/JKT-AURORA-M-003.png",
    status: "In Production",
    currentStage: "Finishing",
    currentStageStarted: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min ago
    stageHistory: [
      {
        stage: "Cutting",
        startedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        duration: 118,
        completedBy: "Cut Room Team"
      },
      {
        stage: "Sewing",
        startedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        duration: 360,
        completedBy: "Sewing Line A"
      }
    ],
    progress: 85,
    scheduleStatus: "ahead",
    daysAheadBehind: 1,
    currentLocation: "Factory A - Finishing - Station 2",
    lastScannedBy: "Sarah Johnson",
    lastScannedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 min ago
    notes: "Quality check passed - excellent work",
    createdAt: "2025-10-02T09:00:00Z",
    startedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  },
  {
    id: "LINE-JKT-M-004",
    itemCodeId: "IC-001",
    orderId: "ORD-2025-001",
    serialNumber: 4,
    fullSerialNumber: "JKT-AURORA-M-004",
    qrCode: "QR-JKT-AURORA-M-004",
    qrCodeUrl: "/qr/JKT-AURORA-M-004.png",
    status: "Completed",
    currentStage: "Completed",
    currentStageStarted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    stageHistory: [
      {
        stage: "Cutting",
        startedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
        duration: 120,
        completedBy: "Cut Room Team"
      },
      {
        stage: "Sewing",
        startedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 380,
        completedBy: "Sewing Line B"
      },
      {
        stage: "Finishing",
        startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 90,
        completedBy: "Finishing Team"
      },
      {
        stage: "QC",
        startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
        duration: 30,
        completedBy: "QC Team"
      }
    ],
    progress: 100,
    scheduleStatus: "ahead",
    daysAheadBehind: 2,
    currentLocation: "Warehouse - Ready to Ship",
    lastScannedBy: "QC Team",
    lastScannedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Perfect quality - ready for shipment",
    createdAt: "2025-10-02T09:00:00Z",
    startedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "LINE-JKT-M-005",
    itemCodeId: "IC-001",
    orderId: "ORD-2025-001",
    serialNumber: 5,
    fullSerialNumber: "JKT-AURORA-M-005",
    qrCode: "QR-JKT-AURORA-M-005",
    qrCodeUrl: "/qr/JKT-AURORA-M-005.png",
    status: "On Hold",
    currentStage: "Sewing",
    currentStageStarted: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    stageHistory: [
      {
        stage: "Cutting",
        startedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        duration: 125,
        completedBy: "Cut Room Team"
      }
    ],
    progress: 35,
    scheduleStatus: "at-risk",
    daysAheadBehind: -1,
    currentLocation: "Factory A - Sewing Line B - Station 1",
    lastScannedBy: "Production Manager",
    lastScannedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // 20 min ago
    notes: "HOLD: Fabric defect detected - awaiting replacement panel",
    createdAt: "2025-10-02T09:00:00Z",
    startedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString()
  }
]

export function getLineItemsByItemCode(itemCodeId: string): LineItem[] {
  return MOCK_LINE_ITEMS.filter(li => li.itemCodeId === itemCodeId)
}

export function getLineItemById(id: string): LineItem | undefined {
  return MOCK_LINE_ITEMS.find(li => li.id === id)
}

export function calculateStageDuration(startedAt: string): {
  hours: number
  minutes: number
  seconds: number
  total: number
} {
  const start = new Date(startedAt)
  const now = new Date()
  const diffMs = now.getTime() - start.getTime()
  const totalSeconds = Math.floor(diffMs / 1000)
  
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  
  return {
    hours,
    minutes,
    seconds,
    total: totalSeconds
  }
}
