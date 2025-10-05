// Mock data for orders system

export type OrderStatus = 
  | "Draft"
  | "Pending"
  | "Accepted"
  | "In Production"
  | "Completed"
  | "Cancelled"

export type Order = {
  id: string
  name: string
  client: string
  status: OrderStatus
  
  // Timeline
  startDate: string
  shipDate: string
  createdAt: string
  updatedAt: string
  completedAt?: string
  
  // Team & ownership
  owner: string
  assignedTeam: string
  contacts: string[]
  
  // Progress tracking
  totalItemCodes: number
  totalLineItems: number
  completedLineItems: number
  progressPercent: number
  
  // Metadata
  tags: string[]
  priority: "low" | "normal" | "high"
  orderValue?: number
}

export const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-2025-001",
    name: "Aurora Apparel Production Run",
    client: "Horizon Apparel Co.",
    status: "In Production",
    startDate: "2025-10-04",
    shipDate: "2025-11-27",
    createdAt: "2025-09-20T10:00:00Z",
    updatedAt: "2025-10-05T14:30:00Z",
    owner: "L. Medina",
    assignedTeam: "Production Ops",
    contacts: ["L. Medina", "K. Patel"],
    totalItemCodes: 12,
    totalLineItems: 2400,
    completedLineItems: 1080,
    progressPercent: 45,
    tags: ["Fashion", "Urgent"],
    priority: "high",
    orderValue: 125000
  },
  {
    id: "ORD-2025-002",
    name: "Winter Collection - Premium Jackets",
    client: "Nordic Fashion House",
    status: "Accepted",
    startDate: "2025-10-10",
    shipDate: "2025-12-15",
    createdAt: "2025-09-25T09:15:00Z",
    updatedAt: "2025-10-04T16:20:00Z",
    owner: "M. Chen",
    assignedTeam: "Production Ops",
    contacts: ["M. Chen", "A. Johnson"],
    totalItemCodes: 8,
    totalLineItems: 1200,
    completedLineItems: 0,
    progressPercent: 0,
    tags: ["Fashion", "Premium"],
    priority: "normal",
    orderValue: 89000
  },
  {
    id: "ORD-2025-003",
    name: "Construction Workwear Batch Q4",
    client: "BuildRight Industries",
    status: "In Production",
    startDate: "2025-09-15",
    shipDate: "2025-10-30",
    createdAt: "2025-08-10T11:30:00Z",
    updatedAt: "2025-10-05T09:45:00Z",
    owner: "R. Santos",
    assignedTeam: "Workwear Division",
    contacts: ["R. Santos", "J. Martinez"],
    totalItemCodes: 15,
    totalLineItems: 3500,
    completedLineItems: 2800,
    progressPercent: 80,
    tags: ["Workwear", "High Volume"],
    priority: "high",
    orderValue: 210000
  },
  {
    id: "ORD-2025-004",
    name: "Tactical Gear - Military Contract",
    client: "Defense Solutions Ltd.",
    status: "Pending",
    startDate: "2025-10-20",
    shipDate: "2026-01-15",
    createdAt: "2025-09-30T14:00:00Z",
    updatedAt: "2025-10-02T10:15:00Z",
    owner: "K. Patel",
    assignedTeam: "Tactical Division",
    contacts: ["K. Patel", "D. Anderson"],
    totalItemCodes: 25,
    totalLineItems: 5000,
    completedLineItems: 0,
    progressPercent: 0,
    tags: ["Defense", "Compliance Required"],
    priority: "high",
    orderValue: 450000
  },
  {
    id: "ORD-2025-005",
    name: "Spring Denim Collection",
    client: "Denim & Co.",
    status: "Draft",
    startDate: "2025-11-01",
    shipDate: "2026-02-01",
    createdAt: "2025-10-01T08:20:00Z",
    updatedAt: "2025-10-05T11:00:00Z",
    owner: "L. Medina",
    assignedTeam: "Production Ops",
    contacts: ["L. Medina"],
    totalItemCodes: 10,
    totalLineItems: 1800,
    completedLineItems: 0,
    progressPercent: 0,
    tags: ["Fashion", "Denim"],
    priority: "normal",
    orderValue: 95000
  },
  {
    id: "ORD-2025-006",
    name: "Corporate Uniforms - Tech Startup",
    client: "InnovateTech Inc.",
    status: "Completed",
    startDate: "2025-08-01",
    shipDate: "2025-09-15",
    createdAt: "2025-07-10T13:45:00Z",
    updatedAt: "2025-09-15T17:30:00Z",
    completedAt: "2025-09-15T17:30:00Z",
    owner: "A. Johnson",
    assignedTeam: "Production Ops",
    contacts: ["A. Johnson", "S. Kim"],
    totalItemCodes: 6,
    totalLineItems: 500,
    completedLineItems: 500,
    progressPercent: 100,
    tags: ["Corporate", "Small Batch"],
    priority: "normal",
    orderValue: 25000
  },
  {
    id: "ORD-2025-007",
    name: "Athletic Wear - Marathon Series",
    client: "RunFast Athletics",
    status: "In Production",
    startDate: "2025-09-20",
    shipDate: "2025-11-10",
    createdAt: "2025-08-28T10:10:00Z",
    updatedAt: "2025-10-05T15:20:00Z",
    owner: "M. Chen",
    assignedTeam: "Athletic Division",
    contacts: ["M. Chen", "T. Rodriguez"],
    totalItemCodes: 18,
    totalLineItems: 2200,
    completedLineItems: 660,
    progressPercent: 30,
    tags: ["Athletic", "Performance"],
    priority: "normal",
    orderValue: 110000
  },
  {
    id: "ORD-2025-008",
    name: "Safety Vests - Construction Fleet",
    client: "SafeWork Supplies",
    status: "Accepted",
    startDate: "2025-10-12",
    shipDate: "2025-11-05",
    createdAt: "2025-09-18T12:25:00Z",
    updatedAt: "2025-10-03T14:40:00Z",
    owner: "R. Santos",
    assignedTeam: "Workwear Division",
    contacts: ["R. Santos"],
    totalItemCodes: 4,
    totalLineItems: 1000,
    completedLineItems: 0,
    progressPercent: 0,
    tags: ["Safety", "High Visibility"],
    priority: "normal",
    orderValue: 32000
  },
  {
    id: "ORD-2025-009",
    name: "Luxury Outerwear Collection",
    client: "Prestige Fashion Group",
    status: "Cancelled",
    startDate: "2025-09-10",
    shipDate: "2025-11-20",
    createdAt: "2025-08-15T09:50:00Z",
    updatedAt: "2025-09-28T11:30:00Z",
    owner: "L. Medina",
    assignedTeam: "Production Ops",
    contacts: ["L. Medina", "K. Patel"],
    totalItemCodes: 12,
    totalLineItems: 800,
    completedLineItems: 120,
    progressPercent: 15,
    tags: ["Fashion", "Luxury"],
    priority: "low",
    orderValue: 180000
  },
  {
    id: "ORD-2025-010",
    name: "School Uniforms - District Order",
    client: "Riverside School District",
    status: "Completed",
    startDate: "2025-07-01",
    shipDate: "2025-08-20",
    createdAt: "2025-06-05T08:00:00Z",
    updatedAt: "2025-08-20T16:00:00Z",
    completedAt: "2025-08-20T16:00:00Z",
    owner: "A. Johnson",
    assignedTeam: "Production Ops",
    contacts: ["A. Johnson"],
    totalItemCodes: 20,
    totalLineItems: 4500,
    completedLineItems: 4500,
    progressPercent: 100,
    tags: ["Education", "Recurring"],
    priority: "normal",
    orderValue: 67500
  },
  {
    id: "ORD-2025-011",
    name: "Restaurant Apparel - Chain Expansion",
    client: "Gourmet Dining Group",
    status: "In Production",
    startDate: "2025-09-25",
    shipDate: "2025-10-25",
    createdAt: "2025-09-05T13:20:00Z",
    updatedAt: "2025-10-05T12:15:00Z",
    owner: "M. Chen",
    assignedTeam: "Hospitality Division",
    contacts: ["M. Chen", "P. Wilson"],
    totalItemCodes: 9,
    totalLineItems: 1500,
    completedLineItems: 900,
    progressPercent: 60,
    tags: ["Hospitality", "Branded"],
    priority: "high",
    orderValue: 45000
  },
  {
    id: "ORD-2025-012",
    name: "Medical Scrubs - Hospital Network",
    client: "HealthCare Supplies Inc.",
    status: "Accepted",
    startDate: "2025-10-15",
    shipDate: "2025-12-01",
    createdAt: "2025-09-22T10:30:00Z",
    updatedAt: "2025-10-04T09:00:00Z",
    owner: "K. Patel",
    assignedTeam: "Medical Division",
    contacts: ["K. Patel", "L. Medina"],
    totalItemCodes: 14,
    totalLineItems: 3200,
    completedLineItems: 0,
    progressPercent: 0,
    tags: ["Medical", "Compliance Required"],
    priority: "normal",
    orderValue: 128000
  }
]

// Helper functions
export function getOrdersByStatus(status: OrderStatus): Order[] {
  return MOCK_ORDERS.filter(order => order.status === status)
}

export function getOrderStatusColor(status: OrderStatus): string {
  switch (status) {
    case "Draft":
      return "bg-gray-100 text-gray-800"
    case "Pending":
      return "bg-yellow-100 text-yellow-800"
    case "Accepted":
      return "bg-blue-100 text-blue-800"
    case "In Production":
      return "bg-purple-100 text-purple-800"
    case "Completed":
      return "bg-green-100 text-green-800"
    case "Cancelled":
      return "bg-red-100 text-red-800"
  }
}

export function getOrderPriorityColor(priority: "low" | "normal" | "high"): string {
  switch (priority) {
    case "low":
      return "text-gray-500"
    case "normal":
      return "text-blue-500"
    case "high":
      return "text-red-500"
  }
}

export function isOrderOverdue(order: Order): boolean {
  if (order.status === "Completed" || order.status === "Cancelled") {
    return false
  }
  return new Date(order.shipDate) < new Date()
}

export function getDaysUntilShip(order: Order): number {
  const now = new Date()
  const shipDate = new Date(order.shipDate)
  const diffTime = shipDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}
