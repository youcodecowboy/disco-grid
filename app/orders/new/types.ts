export type VerticalPreset = {
  id: "fashion" | "construction" | "defense"
  label: string
  summary: string
  defaultAttributes: string[]
}

export type ComponentAttribute = {
  field: string
  value: string
}

export type ComponentProfile = {
  id: string
  name: string
  quantity: number
  qrMode: string
  notes: string
  workflow?: string
  startDate: string
  location: string
  attributes: ComponentAttribute[]
  digitalPassportEnabled: boolean
}

export type Attachment = {
  id: string
  name: string
  category: string
  size: string
  updatedAt: string
}

export type NotificationChannel = "email" | "sms" | "portal"

export type NotificationSetting = {
  channel: NotificationChannel
  label: string
  enabled: boolean
  cadence: string
}

export type OrderInfo = {
  name: string
  client: string
  startDate: string
  shipDate: string
  contacts: string[]
  owner: string
  assignedTeam: string
}

export type TraceabilityProfile = {
  digitalPassportEnabled: boolean
  complianceRegions: string[]
  shareWithPartners: boolean
  includeLifecycleStages: boolean
  includeMaterialCertificates: boolean
  includeCarbonAccounting: boolean
}

export type ItemProfile = {
  id: string
  name: string
  code: string
  quantity: number
  type: "simple" | "complex"
  status: "Draft" | "Ready" | "In Production"
  summary: string
  workflow: string
  workflowStages: Array<{ stage: string; owner: string; status: "Planned" | "Active" | "Ready" }>
  attributes: Array<{ field: string; value: string }>
  components: ComponentProfile[]
  timeline: { start: string; end: string }
  labelFields: string[]
  labelLogo: boolean
  attachments: Attachment[]
  assignedTeam: string
  owner: string
  notifications: NotificationSetting[]
  traceability: TraceabilityProfile
}

export type StageId = "overview" | "milestones" | "items" | "workflows" | "review"

export type CalendarEvent = { label: string; color: string; milestone?: boolean }

export type StandardLabelField = { id: string; label: string }

export type WorkflowTemplate = {
  id: string
  label: string
  summary: string
  duration: string
}

export type NestedOrder = {
  id: string
  label: string
  lifecycle: string
  items: number
  target: string
}

export const VERTICAL_PRESETS: VerticalPreset[] = [
  {
    id: "fashion",
    label: "Fashion Manufacturing",
    summary: "Collect unit-level QA data for garments moving through cut, sew, finish, and pack.",
    defaultAttributes: [
      "SKU",
      "Size run",
      "Material blend",
      "Fabric code",
      "Colorway",
      "Shrinkage %",
      "Stitch program",
      "Wash standard",
      "Compliance batch",
      "Packaging notes",
    ],
  },
  {
    id: "construction",
    label: "Construction Logistics",
    summary: "Forecast deliveries and reconcile what reaches the job site versus what was promised.",
    defaultAttributes: [
      "Material spec",
      "Supplier lot",
      "Location drop zone",
      "Install crew",
      "Inspection cadence",
      "Storage requirements",
      "Delivery window",
      "Warranty term",
      "Safety checklist",
      "Replacement lead time",
    ],
  },
  {
    id: "defense",
    label: "Defense Asset Tracking",
    summary: "Map component readiness and custody for sensitive equipment traceability.",
    defaultAttributes: [
      "Asset classification",
      "Serial seed",
      "Custodian",
      "Maintenance interval",
      "Calibration date",
      "Readiness tier",
      "Storage zone",
      "Compliance directive",
      "Tamper seal",
      "Disposal protocol",
    ],
  },
]

export const CONTACT_DIRECTORY = [
  "L. Medina",
  "K. Patel",
  "Amelia Chen",
  "Ravi Patel",
  "Jordan Li",
  "Priya Singh",
  "N. Hernandez",
]

export const TEAM_DIRECTORY = [
  "Production Ops",
  "Cut & Sew Line A",
  "Cut & Sew Line B",
  "Finishing",
  "Quality",
  "Logistics",
]

export const LOCATION_OPTIONS = [
  "Factory A – Main Floor",
  "Factory B – Sewing",
  "Factory C – Finishing",
  "3PL Staging Warehouse",
  "Partner Mill",
]

export const INITIAL_CLIENTS = [
  "Horizon Apparel Co.",
  "Nova Fashion Group",
  "Nimbus Outerwear",
  "Atlas Activewear",
]

export const NESTED_ORDERS: NestedOrder[] = [
  {
    id: "ORD-24-0929-A1",
    label: "Prototype Batch",
    lifecycle: "Design",
    items: 3,
    target: "Oct 18, 2025",
  },
  {
    id: "ORD-24-0929-A2",
    label: "Pilot Production",
    lifecycle: "Pre-production",
    items: 5,
    target: "Nov 28, 2025",
  },
]

export const ORDER_OWNERS = ["L. Medina", "K. Patel", "S. Alvarez", "D. Ishikawa"]

export const TRACEABILITY_COMPLIANCE_OPTIONS = [
  { id: "eu", label: "European Union", description: "Ecodesign & ESPR digital passport coverage." },
  { id: "usa", label: "United States", description: "FTC textile disclosures and UFLPA compliance." },
  { id: "uk", label: "United Kingdom", description: "Environment Act supply chain transparency." },
  { id: "canada", label: "Canada", description: "Customs traceability & consumer product safety." },
  { id: "global", label: "Global Partners", description: "Share passport with upstream suppliers." },
]

export const SEED_ITEMS: ItemProfile[] = [
  {
    id: "item-001",
    name: "Aurora Flight Jacket",
    code: "JKT-AURORA-001",
    quantity: 320,
    type: "complex",
    status: "Draft",
    summary: "Technical outerwear jacket with detachable liner and RFID care labels.",
    workflow: "Cut & Sew Apparel v4",
    workflowStages: [
      { stage: "Fabric Cutting", owner: "Cut Room", status: "Ready" },
      { stage: "Panel Assembly", owner: "Sewing Line A", status: "Planned" },
      { stage: "Finishing", owner: "Finishing", status: "Planned" },
      { stage: "QA & Pack", owner: "Quality", status: "Planned" },
    ],
    attributes: [
      { field: "SKU", value: "JKT-AURORA-001" },
      { field: "Fabric", value: "Cordura® 210D" },
      { field: "Lining", value: "Recycled mesh" },
      { field: "Colorway", value: "Night Sky" },
      { field: "Size Curve", value: "XS-3XL" },
      { field: "Workflow", value: "Cut & Sew Apparel v4" },
    ],
    components: [
      {
        id: "comp-shell",
        name: "Outer Shell Panels",
        quantity: 6,
        qrMode: "Per panel",
        notes: "Laser cut with reflective piping",
        workflow: "Cut & Sew Apparel v4",
        startDate: "2025-10-08",
        location: "Factory A – Main Floor",
        attributes: [
          { field: "Fabric", value: "Cordura® 210D" },
          { field: "Operation", value: "Panel prep" },
        ],
        digitalPassportEnabled: true,
      },
      {
        id: "comp-liner",
        name: "Detachable Liner",
        quantity: 1,
        qrMode: "Per liner",
        notes: "Quilted insulation, reversible",
        workflow: "Cut & Sew Apparel v4",
        startDate: "2025-10-10",
        location: "Factory B – Sewing",
        attributes: [
          { field: "Fill", value: "Recycled poly" },
          { field: "Quilt pattern", value: "Diamond" },
        ],
        digitalPassportEnabled: true,
      },
      {
        id: "comp-hdw",
        name: "Hardware Kit",
        quantity: 1,
        qrMode: "Bundle",
        notes: "YKK AquaGuard zippers + snaps",
        workflow: "Cut & Sew Apparel v4",
        startDate: "2025-10-12",
        location: "3PL Staging Warehouse",
        attributes: [
          { field: "Supplier", value: "YKK" },
          { field: "Finish", value: "Matte black" },
        ],
        digitalPassportEnabled: true,
      },
      {
        id: "comp-label",
        name: "Care Labels",
        quantity: 1,
        qrMode: "Per label",
        notes: "QR + RFID dual tags",
        workflow: "Tracing & Compliance",
        startDate: "2025-10-11",
        location: "Partner Mill",
        attributes: [
          { field: "Material", value: "Poly blend" },
          { field: "Compliance", value: "ASTM D5489" },
        ],
        digitalPassportEnabled: true,
      },
    ],
    timeline: { start: "Oct 8, 2025", end: "Nov 28, 2025" },
    labelFields: ["code", "attribute:Fabric", "attribute:Colorway", "workflow"],
    labelLogo: true,
    attachments: [
      {
        id: "file-techpack",
        name: "Aurora Flight Jacket Tech Pack.pdf",
        category: "Tech pack",
        size: "4.7 MB",
        updatedAt: "Sep 12",
      },
      {
        id: "file-pattern",
        name: "Pattern V2 DXF",
        category: "Pattern",
        size: "1.3 MB",
        updatedAt: "Sep 10",
      },
    ],
    assignedTeam: "Cut & Sew Line A",
    owner: "Amelia Chen",
    notifications: [
      { channel: "email", label: "Production email", enabled: true, cadence: "Stage completion" },
      { channel: "sms", label: "Line lead SMS", enabled: false, cadence: "Exceptions only" },
      { channel: "portal", label: "Portal updates", enabled: true, cadence: "Daily summary" },
    ],
    traceability: {
      digitalPassportEnabled: true,
      complianceRegions: ["eu", "usa"],
      shareWithPartners: true,
      includeLifecycleStages: true,
      includeMaterialCertificates: true,
      includeCarbonAccounting: true,
    },
  },
  {
    id: "item-002",
    name: "Atlas Cargo Pant",
    code: "PNT-ATLAS-204",
    quantity: 540,
    type: "simple",
    status: "Ready",
    summary: "Workwear cargo pant with reinforced knees and modular pockets.",
    workflow: "Cut & Sew Apparel v4",
    workflowStages: [
      { stage: "Fabric Cutting", owner: "Cut Room", status: "Active" },
      { stage: "Panel Assembly", owner: "Sewing Line B", status: "Active" },
      { stage: "Finishing", owner: "Finishing", status: "Ready" },
      { stage: "QA", owner: "Quality", status: "Planned" },
    ],
    attributes: [
      { field: "SKU", value: "PNT-ATLAS-204" },
      { field: "Fabric", value: "Ripstop 8oz" },
      { field: "Colorway", value: "Field Olive" },
      { field: "Workflow", value: "Cut & Sew Apparel v4" },
      { field: "Labeling", value: "Single QR per unit" },
      { field: "Pocket Kit", value: "Modular set B" },
    ],
    components: [],
    timeline: { start: "Sep 28, 2025", end: "Nov 04, 2025" },
    labelFields: ["code", "attribute:Fabric", "quantity"],
    labelLogo: false,
    attachments: [
      {
        id: "file-spec",
        name: "Atlas Cargo Pant Spec Sheet.pdf",
        category: "Spec sheet",
        size: "3.1 MB",
        updatedAt: "Sep 08",
      },
    ],
    assignedTeam: "Sewing Line B",
    owner: "Ravi Patel",
    notifications: [
      { channel: "email", label: "Production email", enabled: true, cadence: "Daily summary" },
      { channel: "sms", label: "Line lead SMS", enabled: true, cadence: "Stage completion" },
      { channel: "portal", label: "Portal updates", enabled: true, cadence: "Real-time" },
    ],
    traceability: {
      digitalPassportEnabled: false,
      complianceRegions: [],
      shareWithPartners: false,
      includeLifecycleStages: false,
      includeMaterialCertificates: true,
      includeCarbonAccounting: false,
    },
  },
]

export const WORKFLOW_LIBRARY: WorkflowTemplate[] = [
  {
    id: "furniture-assembly-v3",
    label: "Furniture Assembly v3",
    summary: "Modular furniture build with stage-level QA",
    duration: "14 days",
  },
  {
    id: "bench-production-v1",
    label: "Bench Production v1",
    summary: "Lean bench line with inline inspection",
    duration: "10 days",
  },
  {
    id: "premium-finishing-qa",
    label: "Premium Finishing QA",
    summary: "High-touch finishing and polish checks",
    duration: "5 days",
  },
]

export const STANDARD_LABEL_FIELDS: StandardLabelField[] = [
  { id: "code", label: "Item Code" },
  { id: "workflow", label: "Workflow" },
  { id: "quantity", label: "Quantity" },
  { id: "startDate", label: "Start Date" },
  { id: "dueDate", label: "Due Date" },
  { id: "customer", label: "Customer Name" },
]

export const CUSTOMER_NAME = "Horizon Apparel Co."

export function resolveLabelField(fieldId: string, item: ItemProfile, standardFields: StandardLabelField[]): { label: string; value: string } {
  if (fieldId.startsWith("attribute:")) {
    const attributeName = fieldId.split(":", 2)[1]
    const attributeValue = item.attributes.find((attribute) => attribute.field === attributeName)?.value || ""
    return { label: attributeName, value: attributeValue }
  }

  if (fieldId.startsWith("custom:")) {
    const label = fieldId.split(":", 2)[1]
    return { label, value: label }
  }

  const standard = standardFields.find((entry) => entry.id === fieldId)
  if (standard) {
    switch (fieldId) {
      case "code":
        return { label: standard.label, value: item.code }
      case "workflow":
        return { label: standard.label, value: item.workflow }
      case "quantity":
        return { label: standard.label, value: String(item.quantity) }
      case "startDate":
        return { label: standard.label, value: item.timeline.start }
      case "dueDate":
        return { label: standard.label, value: item.timeline.end }
      case "customer":
        return { label: standard.label, value: CUSTOMER_NAME }
      default:
        return { label: standard.label, value: "" }
    }
  }

  return { label: fieldId, value: "" }
}

export const STAGES: Array<{ id: StageId; title: string; description: string }> = [
  {
    id: "overview",
    title: "Order Overview",
    description: "Capture the client, ownership, and promise dates for this order shell.",
  },
  {
    id: "milestones",
    title: "Milestones & Stakeholders",
    description: "Map production checkpoints and signal who is accountable along the way.",
  },
  {
    id: "items",
    title: "Item Builder",
    description: "Shape each item and component, edit attributes, and prep the production table.",
  },
  {
    id: "workflows",
    title: "Workflow Assignment",
    description: "Link items and components to workflow playbooks, with overrides where needed.",
  },
  {
    id: "review",
    title: "Publish & Share",
    description: "Validate what will ship to the portal before generating QR batches.",
  },
]
