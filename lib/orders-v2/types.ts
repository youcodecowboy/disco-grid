// Order Builder V2 - Type Definitions
// Extends existing order types with V2-specific enhancements

export type ItemComplexity = "simple" | "complex"

export type OrderInfo = {
  name: string
  client: string
  startDate: string // Required
  shipDate?: string
  contacts: string[]
  owner?: string
  team?: string
  // New high-level metadata
  orderNumber?: string // Auto-suggested, e.g. HAC-2025-001
  symbol?: string // Emoji icon
  priority?: "low" | "medium" | "high" | "urgent"
  flags?: string[] // Custom tags like "Rush", "Export", etc.
}

export type ComponentAttribute = {
  id: string
  field: string
  value: string
}

export type Component = {
  id: string
  name: string
  quantity: number
  workflow?: string
  qrMode: string
  notes: string
  attributes: ComponentAttribute[]
}

export type ItemAttribute = {
  id: string
  field: string
  value: string
}

export type TraceabilityProfile = {
  enabled: boolean
  complianceRegions: string[]
  shareWithPartners: boolean
  includeLifecycleStages: boolean
  includeMaterialCertificates: boolean
  includeCarbonAccounting: boolean
}

export type LabelField = {
  id: string
  label: string
  enabled: boolean
}

export type ItemProfile = {
  id: string
  name: string
  code: string
  quantity: number
  complexity: ItemComplexity
  workflow?: string
  attributes: ItemAttribute[]
  traceability: TraceabilityProfile
  timeline?: {
    start: string
    end: string
    location: string
  }
  labelFields: LabelField[]
  includeLogo: boolean
  components: Component[]
  attachments: string[]
}

export type TimelineBlock = {
  id: string
  itemId: string
  itemName: string
  stageName: string
  startDate: Date
  endDate: Date
  workflow: string
  color: string
}

export type CapacityWarning = {
  type: "info" | "warning" | "error"
  message: string
  itemIds: string[]
}

export type WizardStep = "order-info" | "item" | "review"

export const FACTORY_CAPACITY = 10000 // units per month

// Reuse from existing types
export { WORKFLOW_LIBRARY, CONTACT_DIRECTORY, TEAM_DIRECTORY, TRACEABILITY_COMPLIANCE_OPTIONS, VERTICAL_PRESETS, STANDARD_LABEL_FIELDS, LOCATION_OPTIONS } from "@/app/orders/new/types"

