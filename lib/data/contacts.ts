// Rolodex - Contact Management System

export type ContactCategory = 
  | "Client"
  | "Vendor"
  | "Internal"
  | "Prospect"
  | "Partner"
  | "Other"

export type RelationshipStrength = "Strong" | "Moderate" | "Weak" | "Unknown"

export type Contact = {
  id: string
  name: string
  displayName?: string
  avatar?: string
  organization?: string
  title?: string
  
  // Contact Info
  email: string
  phone?: string
  website?: string
  
  // Categorization
  category: ContactCategory
  tags: string[]
  relationshipStrength: RelationshipStrength
  
  // Activity
  lastContactDate?: string
  lastOrderDate?: string
  activeOrders?: number
  totalOrders?: number
  totalValue?: number
  
  // Metadata
  notes?: string
  createdAt: string
  updatedAt: string
}

export const MOCK_CONTACTS: Contact[] = [
  // Clients
  {
    id: "CNT-001",
    name: "Horizon Apparel Co.",
    displayName: "Horizon Apparel",
    avatar: undefined,
    organization: "Horizon Apparel Co.",
    title: undefined,
    email: "orders@horizonapparel.com",
    phone: "+1 (555) 123-4567",
    website: "https://horizonapparel.com",
    category: "Client",
    tags: ["Fashion", "Regular", "Net 30"],
    relationshipStrength: "Strong",
    lastContactDate: "2025-10-05",
    lastOrderDate: "2025-10-04",
    activeOrders: 1,
    totalOrders: 8,
    totalValue: 892000,
    notes: "Long-term client. Prefers rush orders with premium quality.",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2025-10-05T14:30:00Z"
  },
  {
    id: "CNT-002",
    name: "Nordic Fashion House",
    displayName: "Nordic Fashion",
    email: "purchasing@nordicfashion.no",
    phone: "+47 123 45 678",
    website: "https://nordicfashion.no",
    category: "Client",
    tags: ["Fashion", "Premium", "International"],
    relationshipStrength: "Strong",
    lastContactDate: "2025-10-04",
    lastOrderDate: "2025-10-04",
    activeOrders: 1,
    totalOrders: 5,
    totalValue: 445000,
    createdAt: "2024-06-20T09:15:00Z",
    updatedAt: "2025-10-04T16:20:00Z"
  },
  {
    id: "CNT-003",
    name: "BuildRight Industries",
    email: "procurement@buildright.com",
    phone: "+1 (555) 234-5678",
    website: "https://buildright.com",
    category: "Client",
    tags: ["Construction", "High Volume", "Recurring"],
    relationshipStrength: "Strong",
    lastContactDate: "2025-10-05",
    lastOrderDate: "2025-09-15",
    activeOrders: 1,
    totalOrders: 12,
    totalValue: 1250000,
    createdAt: "2023-11-10T11:30:00Z",
    updatedAt: "2025-10-05T09:45:00Z"
  },
  {
    id: "CNT-004",
    name: "Defense Solutions Ltd.",
    email: "contracts@defensesolutions.mil",
    phone: "+1 (555) 345-6789",
    category: "Client",
    tags: ["Defense", "Government", "Compliance"],
    relationshipStrength: "Moderate",
    lastContactDate: "2025-10-02",
    activeOrders: 1,
    totalOrders: 2,
    totalValue: 650000,
    notes: "Requires strict compliance and documentation.",
    createdAt: "2025-08-01T14:00:00Z",
    updatedAt: "2025-10-02T10:15:00Z"
  },
  {
    id: "CNT-005",
    name: "Denim & Co.",
    email: "hello@denimandco.com",
    phone: "+1 (555) 456-7890",
    website: "https://denimandco.com",
    category: "Client",
    tags: ["Fashion", "Denim Specialist"],
    relationshipStrength: "Moderate",
    lastContactDate: "2025-10-05",
    activeOrders: 1,
    totalOrders: 3,
    totalValue: 285000,
    createdAt: "2025-03-15T08:20:00Z",
    updatedAt: "2025-10-05T11:00:00Z"
  },
  {
    id: "CNT-006",
    name: "RunFast Athletics",
    email: "orders@runfastathletics.com",
    phone: "+1 (555) 567-8901",
    website: "https://runfastathletics.com",
    category: "Client",
    tags: ["Athletic", "Performance Wear"],
    relationshipStrength: "Strong",
    lastContactDate: "2025-10-05",
    lastOrderDate: "2025-09-20",
    activeOrders: 1,
    totalOrders: 6,
    totalValue: 540000,
    createdAt: "2024-09-10T10:10:00Z",
    updatedAt: "2025-10-05T15:20:00Z"
  },

  // Vendors
  {
    id: "CNT-007",
    name: "Premium Fabrics Supply",
    email: "sales@premiumfabrics.com",
    phone: "+1 (555) 678-9012",
    website: "https://premiumfabrics.com",
    category: "Vendor",
    tags: ["Textiles", "Reliable", "Quick Delivery"],
    relationshipStrength: "Strong",
    lastContactDate: "2025-10-03",
    notes: "Primary fabric supplier. 2-week lead time.",
    createdAt: "2023-05-20T09:00:00Z",
    updatedAt: "2025-10-03T14:00:00Z"
  },
  {
    id: "CNT-008",
    name: "Global Hardware Co.",
    email: "orders@globalhardware.com",
    phone: "+1 (555) 789-0123",
    category: "Vendor",
    tags: ["Hardware", "Zippers", "Buttons"],
    relationshipStrength: "Strong",
    lastContactDate: "2025-09-28",
    createdAt: "2023-08-15T11:00:00Z",
    updatedAt: "2025-09-28T10:30:00Z"
  },
  {
    id: "CNT-009",
    name: "Dye Masters Inc.",
    email: "support@dyemasters.com",
    phone: "+1 (555) 890-1234",
    website: "https://dyemasters.com",
    category: "Vendor",
    tags: ["Dyeing", "Finishing", "Eco-Friendly"],
    relationshipStrength: "Moderate",
    lastContactDate: "2025-09-25",
    createdAt: "2024-02-10T13:00:00Z",
    updatedAt: "2025-09-25T09:00:00Z"
  },
  {
    id: "CNT-010",
    name: "Logistics Pro",
    email: "dispatch@logisticspro.com",
    phone: "+1 (555) 901-2345",
    category: "Vendor",
    tags: ["Shipping", "Freight", "International"],
    relationshipStrength: "Strong",
    lastContactDate: "2025-10-04",
    notes: "Handles all international shipping.",
    createdAt: "2023-03-01T08:00:00Z",
    updatedAt: "2025-10-04T16:00:00Z"
  },

  // Internal
  {
    id: "CNT-011",
    name: "Laura Medina",
    displayName: "L. Medina",
    email: "l.medina@company.com",
    phone: "+1 (555) 111-2222",
    organization: "Groovy Manufacturing",
    title: "Production Manager",
    category: "Internal",
    tags: ["Management", "Production"],
    relationshipStrength: "Strong",
    lastContactDate: "2025-10-05",
    createdAt: "2023-01-10T09:00:00Z",
    updatedAt: "2025-10-05T17:00:00Z"
  },
  {
    id: "CNT-012",
    name: "Kevin Patel",
    displayName: "K. Patel",
    email: "k.patel@company.com",
    phone: "+1 (555) 222-3333",
    organization: "Groovy Manufacturing",
    title: "Operations Lead",
    category: "Internal",
    tags: ["Operations", "Tactical Division"],
    relationshipStrength: "Strong",
    lastContactDate: "2025-10-05",
    createdAt: "2023-02-15T10:00:00Z",
    updatedAt: "2025-10-05T16:30:00Z"
  },
  {
    id: "CNT-013",
    name: "Maria Chen",
    displayName: "M. Chen",
    email: "m.chen@company.com",
    phone: "+1 (555) 333-4444",
    organization: "Groovy Manufacturing",
    title: "Quality Control Supervisor",
    category: "Internal",
    tags: ["QC", "Athletic Division"],
    relationshipStrength: "Strong",
    lastContactDate: "2025-10-05",
    createdAt: "2023-03-20T11:00:00Z",
    updatedAt: "2025-10-05T15:00:00Z"
  },
  {
    id: "CNT-014",
    name: "Roberto Santos",
    displayName: "R. Santos",
    email: "r.santos@company.com",
    phone: "+1 (555) 444-5555",
    organization: "Groovy Manufacturing",
    title: "Workwear Division Lead",
    category: "Internal",
    tags: ["Management", "Workwear"],
    relationshipStrength: "Strong",
    lastContactDate: "2025-10-05",
    createdAt: "2023-04-10T09:30:00Z",
    updatedAt: "2025-10-05T14:45:00Z"
  },

  // Prospects
  {
    id: "CNT-015",
    name: "Urban Streetwear Brands",
    email: "info@urbanstreetwear.com",
    phone: "+1 (555) 555-6666",
    website: "https://urbanstreetwear.com",
    category: "Prospect",
    tags: ["Fashion", "Streetwear", "High Potential"],
    relationshipStrength: "Weak",
    lastContactDate: "2025-09-28",
    notes: "Interested in 500-unit trial order.",
    createdAt: "2025-09-15T10:00:00Z",
    updatedAt: "2025-09-28T14:00:00Z"
  },
  {
    id: "CNT-016",
    name: "EcoWear Initiative",
    email: "contact@ecowear.org",
    phone: "+1 (555) 666-7777",
    website: "https://ecowear.org",
    category: "Prospect",
    tags: ["Sustainable", "Organic", "Environmental"],
    relationshipStrength: "Moderate",
    lastContactDate: "2025-10-01",
    notes: "Looking for certified organic manufacturing.",
    createdAt: "2025-08-20T11:00:00Z",
    updatedAt: "2025-10-01T09:00:00Z"
  },
  {
    id: "CNT-017",
    name: "Fitness First Retail",
    email: "sourcing@fitnessfirst.com",
    phone: "+1 (555) 777-8888",
    category: "Prospect",
    tags: ["Athletic", "Retail Chain"],
    relationshipStrength: "Weak",
    lastContactDate: "2025-09-20",
    notes: "Requested samples and pricing.",
    createdAt: "2025-09-10T13:00:00Z",
    updatedAt: "2025-09-20T16:00:00Z"
  },

  // Partners
  {
    id: "CNT-018",
    name: "TechThread Solutions",
    email: "partnerships@techthread.io",
    phone: "+1 (555) 888-9999",
    website: "https://techthread.io",
    category: "Partner",
    tags: ["Technology", "Software", "Integration"],
    relationshipStrength: "Strong",
    lastContactDate: "2025-10-02",
    notes: "Technology partner for QR and tracking systems.",
    createdAt: "2024-05-10T10:00:00Z",
    updatedAt: "2025-10-02T11:00:00Z"
  },
  {
    id: "CNT-019",
    name: "Sustainable Textiles Alliance",
    email: "info@sustainabletextiles.org",
    phone: "+1 (555) 999-0000",
    website: "https://sustainabletextiles.org",
    category: "Partner",
    tags: ["Sustainability", "Certification", "Non-Profit"],
    relationshipStrength: "Moderate",
    lastContactDate: "2025-09-15",
    notes: "Strategic partner for sustainability certifications.",
    createdAt: "2024-07-01T09:00:00Z",
    updatedAt: "2025-09-15T14:00:00Z"
  },
  {
    id: "CNT-020",
    name: "Manufacturing Excellence Institute",
    email: "contact@mfginstitute.edu",
    phone: "+1 (555) 000-1111",
    category: "Partner",
    tags: ["Education", "Training", "Workforce Development"],
    relationshipStrength: "Moderate",
    lastContactDate: "2025-08-30",
    notes: "Training and certification partner.",
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2025-08-30T15:00:00Z"
  }
]

// Helper functions
export function getContactsByCategory(category: ContactCategory): Contact[] {
  return MOCK_CONTACTS.filter(contact => contact.category === category)
}

export function getCategoryColor(category: ContactCategory): string {
  switch (category) {
    case "Client":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "Vendor":
      return "bg-purple-100 text-purple-800 border-purple-200"
    case "Internal":
      return "bg-green-100 text-green-800 border-green-200"
    case "Prospect":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Partner":
      return "bg-pink-100 text-pink-800 border-pink-200"
    case "Other":
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function getRelationshipColor(strength: RelationshipStrength): string {
  switch (strength) {
    case "Strong":
      return "text-green-600"
    case "Moderate":
      return "text-yellow-600"
    case "Weak":
      return "text-orange-600"
    case "Unknown":
      return "text-gray-400"
  }
}

export function getRelationshipIcon(strength: RelationshipStrength): string {
  switch (strength) {
    case "Strong":
      return "★★★"
    case "Moderate":
      return "★★☆"
    case "Weak":
      return "★☆☆"
    case "Unknown":
      return "☆☆☆"
  }
}

export function getAvatarInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

export function getAvatarColor(name: string): string {
  // Generate a consistent color based on name
  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-red-500",
    "bg-teal-500"
  ]
  
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
  return colors[index]
}
