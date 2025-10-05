/**
 * Item Codes Mock Data
 * 
 * Item Codes represent variants of items (e.g., "Aurora Jacket - M")
 * Each item code has a quantity and spawns that many line items when order is accepted.
 */

export type ItemCodeStatus = "Draft" | "Ready" | "In Production" | "Completed" | "On Hold"

export type ItemCode = {
  id: string
  orderId: string
  orderName: string
  
  // Basic info
  name: string                    // "Aurora Flight Jacket - Medium"
  code: string                    // "JKT-AURORA-M-001"
  quantity: number                // 200 (how many of this variant)
  type: "simple" | "complex"
  status: ItemCodeStatus
  
  // Variant differentiation (what makes this unique)
  variantAttributes: Array<{
    field: string
    value: string
  }>
  
  // Shared attributes (apply to all line items)
  attributes: Array<{
    field: string
    value: string
  }>
  
  // Workflow
  workflow: string
  workflowId: string
  
  // Progress tracking
  lineItemsCompleted: number      // How many of quantity are done
  lineItemsInProduction: number   // How many currently being worked
  currentStageDistribution: Record<string, number>  // How many in each stage
  
  // Timeline
  startDate: string
  dueDate: string
  
  // Team
  assignedTeam: string
  owner: string
  
  // Location
  primaryLocation: string
  
  // Traceability
  qrCodesGenerated: boolean
  qrBatchId?: string
  
  // Timestamps
  createdAt: string
  updatedAt: string
  acceptedAt?: string
}

// Mock Item Codes
export const MOCK_ITEM_CODES: ItemCode[] = [
  {
    id: "IC-001",
    orderId: "ORD-2025-001",
    orderName: "Aurora Apparel Production Run",
    name: "Aurora Flight Jacket",
    code: "JKT-AURORA-M-001",
    quantity: 200,
    type: "complex",
    status: "In Production",
    variantAttributes: [
      { field: "Size", value: "Medium" },
      { field: "Color", value: "Navy Blue" }
    ],
    attributes: [
      { field: "Fabric", value: "Cordura® 210D" },
      { field: "Lining", value: "Recycled mesh" },
      { field: "Season", value: "Fall/Winter 2025" },
      { field: "Style", value: "Technical Outerwear" }
    ],
    workflow: "Cut & Sew Apparel v4",
    workflowId: "WF-001",
    lineItemsCompleted: 87,
    lineItemsInProduction: 56,
    currentStageDistribution: {
      "Cutting": 12,
      "Sewing": 28,
      "Finishing": 16,
      "QC": 0
    },
    startDate: "2025-10-04",
    dueDate: "2025-11-15",
    assignedTeam: "Production Ops",
    owner: "L. Medina",
    primaryLocation: "Factory A - Building 2",
    qrCodesGenerated: true,
    qrBatchId: "QB-2025-001",
    createdAt: "2025-10-01T10:00:00Z",
    updatedAt: "2025-10-05T14:23:00Z",
    acceptedAt: "2025-10-02T09:00:00Z"
  },
  {
    id: "IC-002",
    orderId: "ORD-2025-001",
    orderName: "Aurora Apparel Production Run",
    name: "Aurora Flight Jacket",
    code: "JKT-AURORA-L-001",
    quantity: 200,
    type: "complex",
    status: "In Production",
    variantAttributes: [
      { field: "Size", value: "Large" },
      { field: "Color", value: "Navy Blue" }
    ],
    attributes: [
      { field: "Fabric", value: "Cordura® 210D" },
      { field: "Lining", value: "Recycled mesh" },
      { field: "Season", value: "Fall/Winter 2025" },
      { field: "Style", value: "Technical Outerwear" }
    ],
    workflow: "Cut & Sew Apparel v4",
    workflowId: "WF-001",
    lineItemsCompleted: 92,
    lineItemsInProduction: 64,
    currentStageDistribution: {
      "Cutting": 8,
      "Sewing": 34,
      "Finishing": 22,
      "QC": 0
    },
    startDate: "2025-10-04",
    dueDate: "2025-11-15",
    assignedTeam: "Production Ops",
    owner: "L. Medina",
    primaryLocation: "Factory A - Building 2",
    qrCodesGenerated: true,
    qrBatchId: "QB-2025-001",
    createdAt: "2025-10-01T10:00:00Z",
    updatedAt: "2025-10-05T14:28:00Z",
    acceptedAt: "2025-10-02T09:00:00Z"
  },
  {
    id: "IC-003",
    orderId: "ORD-2025-001",
    orderName: "Aurora Apparel Production Run",
    name: "Aurora Flight Jacket",
    code: "JKT-AURORA-XL-001",
    quantity: 100,
    type: "complex",
    status: "In Production",
    variantAttributes: [
      { field: "Size", value: "Extra Large" },
      { field: "Color", value: "Navy Blue" }
    ],
    attributes: [
      { field: "Fabric", value: "Cordura® 210D" },
      { field: "Lining", value: "Recycled mesh" },
      { field: "Season", value: "Fall/Winter 2025" },
      { field: "Style", value: "Technical Outerwear" }
    ],
    workflow: "Cut & Sew Apparel v4",
    workflowId: "WF-001",
    lineItemsCompleted: 34,
    lineItemsInProduction: 28,
    currentStageDistribution: {
      "Cutting": 6,
      "Sewing": 14,
      "Finishing": 8,
      "QC": 0
    },
    startDate: "2025-10-04",
    dueDate: "2025-11-15",
    assignedTeam: "Production Ops",
    owner: "L. Medina",
    primaryLocation: "Factory A - Building 2",
    qrCodesGenerated: true,
    qrBatchId: "QB-2025-001",
    createdAt: "2025-10-01T10:00:00Z",
    updatedAt: "2025-10-05T14:15:00Z",
    acceptedAt: "2025-10-02T09:00:00Z"
  },
  {
    id: "IC-004",
    orderId: "ORD-2025-002",
    orderName: "Urban Streetwear Collection",
    name: "Metro Hoodie",
    code: "HD-METRO-M-001",
    quantity: 150,
    type: "simple",
    status: "In Production",
    variantAttributes: [
      { field: "Size", value: "Medium" },
      { field: "Color", value: "Charcoal Gray" }
    ],
    attributes: [
      { field: "Fabric", value: "Organic Cotton Blend" },
      { field: "Weight", value: "320gsm" },
      { field: "Season", value: "Spring 2025" },
      { field: "Style", value: "Casual Streetwear" }
    ],
    workflow: "Knit & Finish Workflow",
    workflowId: "WF-002",
    lineItemsCompleted: 112,
    lineItemsInProduction: 32,
    currentStageDistribution: {
      "Knitting": 0,
      "Dyeing": 18,
      "Assembly": 14,
      "Finishing": 0
    },
    startDate: "2025-09-15",
    dueDate: "2025-10-30",
    assignedTeam: "Knitwear Team",
    owner: "K. Patel",
    primaryLocation: "Factory B - Floor 1",
    qrCodesGenerated: true,
    qrBatchId: "QB-2025-002",
    createdAt: "2025-09-10T08:00:00Z",
    updatedAt: "2025-10-05T11:45:00Z",
    acceptedAt: "2025-09-12T10:00:00Z"
  },
  {
    id: "IC-005",
    orderId: "ORD-2025-002",
    orderName: "Urban Streetwear Collection",
    name: "Metro Hoodie",
    code: "HD-METRO-L-001",
    quantity: 150,
    type: "simple",
    status: "Ready",
    variantAttributes: [
      { field: "Size", value: "Large" },
      { field: "Color", value: "Charcoal Gray" }
    ],
    attributes: [
      { field: "Fabric", value: "Organic Cotton Blend" },
      { field: "Weight", value: "320gsm" },
      { field: "Season", value: "Spring 2025" },
      { field: "Style", value: "Casual Streetwear" }
    ],
    workflow: "Knit & Finish Workflow",
    workflowId: "WF-002",
    lineItemsCompleted: 150,
    lineItemsInProduction: 0,
    currentStageDistribution: {},
    startDate: "2025-09-15",
    dueDate: "2025-10-30",
    assignedTeam: "Knitwear Team",
    owner: "K. Patel",
    primaryLocation: "Factory B - Floor 1",
    qrCodesGenerated: true,
    qrBatchId: "QB-2025-002",
    createdAt: "2025-09-10T08:00:00Z",
    updatedAt: "2025-10-02T16:30:00Z",
    acceptedAt: "2025-09-12T10:00:00Z"
  },
  {
    id: "IC-006",
    orderId: "ORD-2025-003",
    orderName: "Defense Contract - Tactical Gear",
    name: "Tactical Vest - Standard",
    code: "VEST-TAC-STD-001",
    quantity: 500,
    type: "complex",
    status: "In Production",
    variantAttributes: [
      { field: "Size", value: "Standard (Adjustable)" },
      { field: "Color", value: "Coyote Brown" }
    ],
    attributes: [
      { field: "Material", value: "Mil-Spec 500D Cordura" },
      { field: "Plate Carrier", value: "NIJ Level IIIA" },
      { field: "MOLLE System", value: "Yes" },
      { field: "Contract", value: "DOD-2025-TG-001" }
    ],
    workflow: "Defense Manufacturing Protocol",
    workflowId: "WF-003",
    lineItemsCompleted: 0,
    lineItemsInProduction: 89,
    currentStageDistribution: {
      "Material Cutting": 45,
      "Assembly": 32,
      "Reinforcement": 12,
      "QC Inspection": 0
    },
    startDate: "2025-10-01",
    dueDate: "2025-12-15",
    assignedTeam: "Defense Manufacturing",
    owner: "M. Rodriguez",
    primaryLocation: "Secure Facility C",
    qrCodesGenerated: true,
    qrBatchId: "QB-2025-003",
    createdAt: "2025-09-25T07:00:00Z",
    updatedAt: "2025-10-05T15:10:00Z",
    acceptedAt: "2025-09-28T08:00:00Z"
  },
  {
    id: "IC-007",
    orderId: "ORD-2025-004",
    orderName: "Premium Denim Line",
    name: "Selvedge Denim Jean",
    code: "JEAN-SEL-32X34-001",
    quantity: 80,
    type: "simple",
    status: "Ready",
    variantAttributes: [
      { field: "Waist", value: "32" },
      { field: "Inseam", value: "34" },
      { field: "Wash", value: "Dark Indigo" }
    ],
    attributes: [
      { field: "Fabric", value: "Japanese Selvedge Denim" },
      { field: "Weight", value: "14oz" },
      { field: "Fit", value: "Slim Straight" },
      { field: "Made In", value: "USA" }
    ],
    workflow: "Premium Denim Workflow",
    workflowId: "WF-004",
    lineItemsCompleted: 80,
    lineItemsInProduction: 0,
    currentStageDistribution: {},
    startDate: "2025-08-20",
    dueDate: "2025-10-01",
    assignedTeam: "Premium Line",
    owner: "T. Chen",
    primaryLocation: "Factory D - Heritage Building",
    qrCodesGenerated: true,
    qrBatchId: "QB-2025-004",
    createdAt: "2025-08-15T09:00:00Z",
    updatedAt: "2025-09-28T13:20:00Z",
    acceptedAt: "2025-08-18T10:00:00Z"
  },
  {
    id: "IC-008",
    orderId: "ORD-2025-005",
    orderName: "Accessories Spring Collection",
    name: "Leather Crossbody Bag",
    code: "BAG-CROSS-BLK-001",
    quantity: 120,
    type: "complex",
    status: "In Production",
    variantAttributes: [
      { field: "Color", value: "Black" },
      { field: "Size", value: "Standard" }
    ],
    attributes: [
      { field: "Material", value: "Full-Grain Leather" },
      { field: "Hardware", value: "Antique Brass" },
      { field: "Lining", value: "Recycled Polyester" },
      { field: "Origin", value: "Italian Leather" }
    ],
    workflow: "Leather Goods Workflow",
    workflowId: "WF-005",
    lineItemsCompleted: 23,
    lineItemsInProduction: 54,
    currentStageDistribution: {
      "Cutting": 12,
      "Stitching": 28,
      "Hardware Attachment": 14,
      "Final Assembly": 0
    },
    startDate: "2025-09-20",
    dueDate: "2025-11-10",
    assignedTeam: "Leather Goods",
    owner: "A. Moretti",
    primaryLocation: "Factory E - Leather Workshop",
    qrCodesGenerated: true,
    qrBatchId: "QB-2025-005",
    createdAt: "2025-09-15T11:00:00Z",
    updatedAt: "2025-10-05T10:35:00Z",
    acceptedAt: "2025-09-18T09:30:00Z"
  }
]

// Helper functions
export function getItemCodeProgress(itemCode: ItemCode): number {
  return Math.round((itemCode.lineItemsCompleted / itemCode.quantity) * 100)
}

export function getItemCodeStatusColor(status: ItemCodeStatus): string {
  const colors: Record<ItemCodeStatus, string> = {
    "Draft": "bg-gray-100 text-gray-800",
    "Ready": "bg-green-100 text-green-800",
    "In Production": "bg-blue-100 text-blue-800",
    "Completed": "bg-purple-100 text-purple-800",
    "On Hold": "bg-yellow-100 text-yellow-800"
  }
  return colors[status]
}

export function getItemCodesByOrder(orderId: string): ItemCode[] {
  return MOCK_ITEM_CODES.filter(ic => ic.orderId === orderId)
}

export function getItemCodeById(id: string): ItemCode | undefined {
  return MOCK_ITEM_CODES.find(ic => ic.id === id)
}
