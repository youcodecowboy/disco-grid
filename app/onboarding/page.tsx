"use client"

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { gridContainerClass } from "@/lib/grid/container"
import { cn } from "@/lib/utils"
import { useGrid, type GridState } from "@/lib/grid-v2"
import { GridSurface, BlockShell } from "@/components/grid-v2"
import type { GridCoordinates } from "@/lib/grid-v2/types"
import { CheckCircle2 } from "lucide-react"

const STEP_ORDER = [
  "path",
  "company",
  "style",
  "systems",
  "capacity",
  "items",
  "operations",
  "floorplan",
  "summary",
] as const

type StepId = (typeof STEP_ORDER)[number]

const stepCopy: Record<StepId, { title: string; description: string }> = {
  path: {
    title: "Choose Your Track",
    description: "Pick the industry so we can branch into the right demo experience.",
  },
  company: {
    title: "Company Profile",
    description: "Introduce your brand so the workspace instantly feels like yours.",
  },
  style: {
    title: "Style Preferences",
    description: "Theme, density, and layout vibe feed straight into Mission Control.",
  },
  systems: {
    title: "Systems & Process",
    description: "Tell us how you work today so we can wire the right integrations and flows.",
  },
  capacity: {
    title: "Volume & Demand",
    description: "Throughput, traceability, and order modes calibrate the data layer.",
  },
  items: {
    title: "Items & SKUs",
    description: "Tell us what you track so tables, labels, and analytics are pre-built.",
  },
  operations: {
    title: "Operations Setup",
    description: "Teams, scanning, bins, and brand visibility seed the workspace defaults.",
  },
  floorplan: {
    title: "Floorplan Sketch",
    description: "Paint your zones—production, QA, staging—so we can wire maps and queues.",
  },
  summary: {
    title: "Summary",
    description: "Review everything we’ll generate for your demo workspace.",
  },
}

const stepIncompleteHint: Partial<Record<StepId, string>> = {
  company: "Add your name, HQ, and go-live target to continue.",
  capacity: "Pick how you track capacity so alerts make sense.",
  items: "Select what you produce or categories before continuing.",
}

const groupValidators: Record<string, (state: OnboardingState) => boolean> = {
  "path-0": (state) => state.path === "manufacturing",
  "company-1": (state) => Boolean(state.companyName.trim()),
  "company-2": (state) => Boolean(state.goLiveTarget.trim()),
  "capacity-2": (state) => state.capacityTracking !== null,
  "items-0": (state) => Boolean(state.orderMode),
  "items-1": (state) => Boolean(state.skuStrategy),
  "items-3": (state) => state.assets.length > 0 || state.skuCategories.length > 0,
  "operations-0": () => true,
}

type ZoneKey = "production" | "qa" | "staging" | "storage" | "shipping" | "unassigned"

const zonePalette: Array<{ id: ZoneKey; label: string; color: string; border: string }> = [
  { id: "production", label: "Production", color: "bg-blue-500", border: "border-blue-500" },
  { id: "qa", label: "Quality", color: "bg-emerald-500", border: "border-emerald-500" },
  { id: "staging", label: "Staging", color: "bg-amber-500", border: "border-amber-500" },
  { id: "storage", label: "Storage", color: "bg-violet-500", border: "border-violet-500" },
  { id: "shipping", label: "Shipping", color: "bg-rose-500", border: "border-rose-500" },
  { id: "unassigned", label: "Clear", color: "bg-muted", border: "border-border" },
]

const FLOOR_ROWS = 6
const FLOOR_COLS = 16
const CELL_SQFT = 80

type DemoPath = "manufacturing" | "construction" | "defense" | null

type InventorySystemChoice = "none" | "off-the-shelf" | "custom"
type IntegrationPriority = "low" | "medium" | "high"
type CapacityTracking = "headcount" | "machine" | "backlog"
type FloorUnit = "sqft" | "sqm"
type ChartPreference = "trends" | "counters" | "balanced"
type TraceabilityLevel = "unit" | "lot" | "kit"
type ProcessPreset = "apparel" | "assembly"
type OrderMode = "make-to-order" | "make-to-stock"
type ItemsPerLineMode = "per-unit" | "per-batch"
type VariantComplexity = "simple" | "detailed"
type ScanningMethod = "qr" | "barcode"

interface FloorPlan {
  id: string
  name: string
  grid: ZoneKey[][]
}

interface OnboardingState {
  path: DemoPath
  companyName: string
  logoDataUrl: string | null
  headquarters: string
  multiSite: boolean
  goLiveTarget: string
  primaryContactRole: string
  complianceSelections: string[]
  theme: "light" | "dark"
  accent: "sky" | "amber" | "emerald" | "violet"
  density: "comfortable" | "compact"
  layoutPreference: "cards" | "tables"
  styleMood: "calm" | "bold"
  motionPreference: "subtle" | "lively"
  assets: string[]
  monthlyItems: number
  teamSize: number
  shifts: string
  capacityTracking: CapacityTracking | null
  seasonalSpikes: boolean
  peakMonths: string[]
  skuPrefix: string
  skuCategories: string[]
  skuAttributes: string[]
  traceability: TraceabilityLevel
  processPreset: ProcessPreset
  orderMode: OrderMode
  itemsPerLineMode: ItemsPerLineMode
  variantComplexity: VariantComplexity
  inventorySystem: InventorySystemChoice
  inventorySystemNotes: string
  erpSystem: InventorySystemChoice
  erpSystemName: string
  integrationPriority: IntegrationPriority
  skuStrategy: "import" | "create" | "hybrid"
  existingSkuNotes: string
  brandPortalEnabled: boolean
  brandPortalData: string[]
  scanningMethod: ScanningMethod
  labelFields: string[]
  binsEnabled: boolean
  binTypes: string[]
  teamSeeds: string[]
  accessScope: string[]
  slaLeadTime: number
  slaCheckpoints: string[]
  queueThreshold: number
  dashboardAudience: string[]
  chartPreference: ChartPreference
  floors: FloorPlan[]
  activeFloorId: string
  floorplanUnits: FloorUnit
  hasFloorplanAssets: boolean
  floorplanAssetNotes: string
}

const initialGrid = (): ZoneKey[][] =>
  Array.from({ length: FLOOR_ROWS }, () => Array.from({ length: FLOOR_COLS }, () => "unassigned" as ZoneKey))

const initialFloor: FloorPlan = {
  id: "floor-1",
  name: "Floor 1",
  grid: initialGrid(),
}

const initialState: OnboardingState = {
  path: null,
  companyName: "",
  logoDataUrl: null,
  headquarters: "",
  multiSite: false,
  goLiveTarget: "",
  primaryContactRole: "Operations Lead",
  complianceSelections: [],
  theme: "light",
  accent: "sky",
  density: "comfortable",
  layoutPreference: "cards",
  styleMood: "calm",
  motionPreference: "subtle",
  assets: [],
  monthlyItems: 1200,
  teamSize: 25,
  shifts: "2",
  capacityTracking: null,
  seasonalSpikes: false,
  peakMonths: [],
  skuPrefix: "",
  skuCategories: [],
  skuAttributes: [],
  traceability: "unit",
  processPreset: "apparel",
  orderMode: "make-to-order",
  itemsPerLineMode: "per-unit",
  variantComplexity: "simple",
  inventorySystem: "none",
  inventorySystemNotes: "",
  erpSystem: "none",
  erpSystemName: "",
  integrationPriority: "medium",
  skuStrategy: "create",
  existingSkuNotes: "",
  brandPortalEnabled: true,
  brandPortalData: ["status", "counts", "photos"],
  scanningMethod: "qr",
  labelFields: ["Order ID", "SKU", "Size", "QR"],
  binsEnabled: true,
  binTypes: ["Storage"],
  teamSeeds: ["Operations", "Quality"],
  accessScope: ["Site"],
  slaLeadTime: 14,
  slaCheckpoints: [],
  queueThreshold: 50,
  dashboardAudience: ["Operations"],
  chartPreference: "balanced",
  floors: [initialFloor],
  activeFloorId: initialFloor.id,
  floorplanUnits: "sqft",
  hasFloorplanAssets: false,
  floorplanAssetNotes: "",
}

type OnboardingAction =
  | { type: "update"; payload: Partial<OnboardingState> }
  | { type: "toggleAsset"; asset: string }
  | { type: "toggleSkuCategory"; category: string }
  | { type: "toggleSkuAttribute"; attribute: string }
  | { type: "setLogo"; dataUrl: string | null }
  | { type: "setFloorCell"; floorId: string; row: number; col: number; zone: ZoneKey }
  | { type: "addFloor" }
  | { type: "renameFloor"; floorId: string; name: string }
  | { type: "setActiveFloor"; floorId: string }
  | { type: "toggleCompliance"; compliance: string }
  | { type: "togglePeakMonth"; month: string }
  | { type: "toggleBrandData"; dataPoint: string }
  | { type: "toggleLabelField"; field: string }
  | { type: "toggleBinType"; binType: string }
  | { type: "toggleTeamSeed"; team: string }
  | { type: "toggleAccessScope"; scope: string }
  | { type: "toggleSlaCheckpoint"; checkpoint: string }
  | { type: "toggleDashboardAudience"; audience: string }

function onboardingReducer(state: OnboardingState, action: OnboardingAction): OnboardingState {
  switch (action.type) {
    case "update":
      return { ...state, ...action.payload }
    case "toggleAsset": {
      const exists = state.assets.includes(action.asset)
      return {
        ...state,
        assets: exists ? state.assets.filter((item) => item !== action.asset) : [...state.assets, action.asset],
      }
    }
    case "toggleSkuCategory": {
      const exists = state.skuCategories.includes(action.category)
      return {
        ...state,
        skuCategories: exists
          ? state.skuCategories.filter((item) => item !== action.category)
          : [...state.skuCategories, action.category],
      }
    }
    case "toggleSkuAttribute": {
      const exists = state.skuAttributes.includes(action.attribute)
      return {
        ...state,
        skuAttributes: exists
          ? state.skuAttributes.filter((item) => item !== action.attribute)
          : [...state.skuAttributes, action.attribute],
      }
    }
    case "toggleCompliance": {
      const exists = state.complianceSelections.includes(action.compliance)
      return {
        ...state,
        complianceSelections: exists
          ? state.complianceSelections.filter((item) => item !== action.compliance)
          : [...state.complianceSelections, action.compliance],
      }
    }
    case "togglePeakMonth": {
      const exists = state.peakMonths.includes(action.month)
      return {
        ...state,
        peakMonths: exists ? state.peakMonths.filter((month) => month !== action.month) : [...state.peakMonths, action.month],
      }
    }
    case "toggleBrandData": {
      const exists = state.brandPortalData.includes(action.dataPoint)
      return {
        ...state,
        brandPortalData: exists
          ? state.brandPortalData.filter((item) => item !== action.dataPoint)
          : [...state.brandPortalData, action.dataPoint],
      }
    }
    case "toggleLabelField": {
      const exists = state.labelFields.includes(action.field)
      return {
        ...state,
        labelFields: exists ? state.labelFields.filter((field) => field !== action.field) : [...state.labelFields, action.field],
      }
    }
    case "toggleBinType": {
      const exists = state.binTypes.includes(action.binType)
      return {
        ...state,
        binTypes: exists ? state.binTypes.filter((bin) => bin !== action.binType) : [...state.binTypes, action.binType],
      }
    }
    case "toggleTeamSeed": {
      const exists = state.teamSeeds.includes(action.team)
      return {
        ...state,
        teamSeeds: exists ? state.teamSeeds.filter((team) => team !== action.team) : [...state.teamSeeds, action.team],
      }
    }
    case "toggleAccessScope": {
      const exists = state.accessScope.includes(action.scope)
      return {
        ...state,
        accessScope: exists ? state.accessScope.filter((scope) => scope !== action.scope) : [...state.accessScope, action.scope],
      }
    }
    case "toggleSlaCheckpoint": {
      const exists = state.slaCheckpoints.includes(action.checkpoint)
      return {
        ...state,
        slaCheckpoints: exists
          ? state.slaCheckpoints.filter((item) => item !== action.checkpoint)
          : [...state.slaCheckpoints, action.checkpoint],
      }
    }
    case "toggleDashboardAudience": {
      const exists = state.dashboardAudience.includes(action.audience)
      return {
        ...state,
        dashboardAudience: exists
          ? state.dashboardAudience.filter((item) => item !== action.audience)
          : [...state.dashboardAudience, action.audience],
      }
    }
    case "setLogo":
      return { ...state, logoDataUrl: action.dataUrl }
    case "setFloorCell": {
      const floors = state.floors.map((floor) => {
        if (floor.id !== action.floorId) return floor
        const nextGrid = floor.grid.map((row, rIdx) =>
          row.map((zone, cIdx) => (rIdx === action.row && cIdx === action.col ? action.zone : zone)),
        )
        return { ...floor, grid: nextGrid }
      })
      return { ...state, floors }
    }
    case "addFloor": {
      if (state.floors.length >= 4) return state
      const newFloor: FloorPlan = {
        id: `floor-${state.floors.length + 1}`,
        name: `Floor ${state.floors.length + 1}`,
        grid: initialGrid(),
      }
      return {
        ...state,
        floors: [...state.floors, newFloor],
        activeFloorId: newFloor.id,
      }
    }
    case "renameFloor":
      return {
        ...state,
        floors: state.floors.map((floor) =>
          floor.id === action.floorId ? { ...floor, name: action.name } : floor,
        ),
      }
    case "setActiveFloor":
      return { ...state, activeFloorId: action.floorId }
    default:
      return state
  }
}

const accentOptions = [
  { id: "sky", label: "Sky", swatch: "bg-sky-500" },
  { id: "amber", label: "Amber", swatch: "bg-amber-500" },
  { id: "emerald", label: "Emerald", swatch: "bg-emerald-500" },
  { id: "violet", label: "Violet", swatch: "bg-violet-500" },
]

const layoutPreferences = [
  { id: "cards", label: "Card-centric", description: "Highlights KPIs and summaries first" },
  { id: "tables", label: "Table-centric", description: "Dense grids for operators" },
]

const styleMoodOptions: Array<{ id: "calm" | "bold"; label: string; description: string }> = [
  { id: "calm", label: "Calm", description: "Soft shadows, gentle gradients" },
  { id: "bold", label: "Bold", description: "Higher contrast, crisp dividers" },
]

const motionPreferenceOptions: Array<{ id: "subtle" | "lively"; label: string; description: string }> = [
  { id: "subtle", label: "Subtle", description: "Minimal motion, focus on clarity" },
  { id: "lively", label: "Lively", description: "Micro-animations and progress cues" },
]

const assetOptions = [
  "Work-in-progress",
  "Tools & equipment",
  "Consumables",
  "Kits & containers",
  "Finished goods",
]

const skuCategories = [
  "Raw materials",
  "Sub-assemblies",
  "Finished goods",
  "Tooling",
  "Consumables",
]

const skuAttributes = [
  "Expiry date",
  "Serial number",
  "Lot / batch",
  "Owner",
  "Maintenance interval",
]

const complianceOptions = ["ISO 9001", "OSHA", "ITAR", "FDA", "SOC 2"]

const inventorySystemOptions: Array<{ id: InventorySystemChoice; label: string; description: string }> = [
  { id: "none", label: "None", description: "We’re starting fresh" },
  { id: "off-the-shelf", label: "Off-the-shelf", description: "We use a commercial tool" },
  { id: "custom", label: "Custom", description: "Internal system or spreadsheets" },
]

const integrationPriorityOptions: Array<{ id: IntegrationPriority; label: string }> = [
  { id: "low", label: "Backlog" },
  { id: "medium", label: "Soon" },
  { id: "high", label: "Day 1" },
]

const erpVendorExamples = ["NetSuite", "SAP", "Oracle", "Microsoft Dynamics", "Other"]

const traceabilityOptions: Array<{ id: TraceabilityLevel; label: string; description: string }> = [
  { id: "unit", label: "Unit level", description: "Each garment tracked individually" },
  { id: "lot", label: "Lot / batch", description: "Batches move together" },
  { id: "kit", label: "Kit & container", description: "Parent kits with child items" },
]

const processPresetOptions: Array<{ id: ProcessPreset; label: string; description: string }> = [
  {
    id: "apparel",
    label: "Fashion manufacturing",
    description: "Cutting → Sewing → Wash → Finishing → QC → Pack",
  },
  { id: "assembly", label: "Generic assembly", description: "Receive → Assemble → Test → Ship" },
]

const orderModeOptions: Array<{ id: OrderMode; label: string; description: string }> = [
  { id: "make-to-order", label: "Make to order", description: "Orders drive production" },
  { id: "make-to-stock", label: "Make to stock", description: "Replenish based on inventory" },
]

const itemsPerLineOptions: Array<{ id: ItemsPerLineMode; label: string }> = [
  { id: "per-unit", label: "Per unit" },
  { id: "per-batch", label: "Per batch" },
]

const variantComplexityOptions: Array<{ id: VariantComplexity; label: string; description: string }> = [
  { id: "simple", label: "Simple sizes", description: "Sizes / colors only" },
  { id: "detailed", label: "Detailed options", description: "Custom measurements, trims, etc." },
]

const brandDataOptions = ["status", "counts", "photos", "shipping"]

const scanningOptions: Array<{ id: ScanningMethod; label: string; description: string }> = [
  { id: "qr", label: "QR codes", description: "Fast scans, works with cameras" },
  { id: "barcode", label: "1D barcode", description: "Compatible with gun scanners" },
]

const labelFieldOptions = ["Order ID", "SKU", "Size", "QR", "Brand", "Lot"]

const binTypeOptions = ["Storage", "Washing", "In-process"]

const teamSeedOptions = ["Operations", "Quality", "Packing", "Shipping", "Admin"]

const accessScopeOptions = ["Site", "Floor", "Zone", "Order"]

const slaCheckpointOptions = ["Cutting", "Sewing", "Wash", "Finishing", "QC", "Pack"]

const monthOptions = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const dashboardAudienceOptions = ["Operations", "Executives", "Quality", "Partners", "Warehouse"]

const chartPreferenceOptions: Array<{ id: ChartPreference; label: string; description: string }> = [
  { id: "trends", label: "Trend charts", description: "Line + area charts first" },
  { id: "counters", label: "Live counters", description: "Metrics and gauges first" },
  { id: "balanced", label: "Balanced", description: "Mix of trends and counters" },
]

interface BlockCardDefinition {
  id: string
  title: string
  layout: GridCoordinates
  group: number
}

const stepDefinitions: Record<StepId, BlockCardDefinition[]> = {
  path: [
    { id: "path-manufacturing", title: "Manufacturing", group: 0, layout: { x: 0, y: 0, w: 4, h: 8 } },
    { id: "path-construction", title: "Construction", group: 0, layout: { x: 4, y: 0, w: 4, h: 8 } },
    { id: "path-defense", title: "Defense", group: 0, layout: { x: 8, y: 0, w: 4, h: 8 } },
    { id: "path-note", title: "What to Expect", group: 1, layout: { x: 0, y: 8, w: 12, h: 4 } },
  ],
  company: [
    { id: "company-logo", title: "Logo", group: 0, layout: { x: 0, y: 0, w: 4, h: 8 } },
    { id: "company-info", title: "Company Details", group: 1, layout: { x: 4, y: 0, w: 4, h: 8 } },
    { id: "company-readiness", title: "Readiness", group: 2, layout: { x: 8, y: 0, w: 4, h: 8 } },
    { id: "company-sites", title: "Sites", group: 3, layout: { x: 0, y: 8, w: 4, h: 5 } },
    { id: "company-story", title: "Mission", group: 4, layout: { x: 4, y: 8, w: 8, h: 5 } },
  ],
  style: [
    { id: "style-heading", title: "Design Overview", group: 0, layout: { x: 0, y: 0, w: 12, h: 4 } },
    { id: "style-theme", title: "Theme", group: 0, layout: { x: 0, y: 5, w: 3, h: 6 } },
    { id: "style-accent", title: "Accent", group: 1, layout: { x: 3, y: 5, w: 3, h: 6 } },
    { id: "style-density", title: "Density", group: 2, layout: { x: 6, y: 5, w: 3, h: 6 } },
    { id: "style-layout", title: "Layout Focus", group: 3, layout: { x: 9, y: 5, w: 3, h: 6 } },
    { id: "style-mood", title: "Mood", group: 4, layout: { x: 0, y: 12, w: 6, h: 5 } },
    { id: "style-motion", title: "Motion", group: 5, layout: { x: 6, y: 12, w: 6, h: 5 } },
    { id: "style-preview", title: "Preview", group: 6, layout: { x: 0, y: 18, w: 12, h: 6 } },
  ],
  systems: [
    { id: "systems-inventory", title: "Inventory System", group: 0, layout: { x: 0, y: 0, w: 4, h: 7 } },
    { id: "systems-erp", title: "ERP / MRP", group: 1, layout: { x: 4, y: 0, w: 4, h: 7 } },
    { id: "systems-integration", title: "Integration Priority", group: 2, layout: { x: 8, y: 0, w: 4, h: 7 } },
    { id: "systems-traceability", title: "Traceability", group: 3, layout: { x: 0, y: 7, w: 6, h: 6 } },
    { id: "systems-process", title: "Process Preset", group: 4, layout: { x: 6, y: 7, w: 6, h: 6 } },
  ],
  capacity: [
    { id: "capacity-volume", title: "Volume", group: 0, layout: { x: 0, y: 0, w: 6, h: 7 } },
    { id: "capacity-team", title: "Team", group: 1, layout: { x: 6, y: 0, w: 6, h: 7 } },
    { id: "capacity-method", title: "Capacity Tracking", group: 2, layout: { x: 0, y: 7, w: 6, h: 5 } },
    { id: "capacity-seasonality", title: "Seasonality", group: 3, layout: { x: 6, y: 7, w: 6, h: 5 } },
    { id: "capacity-summary", title: "Snapshot", group: 4, layout: { x: 0, y: 12, w: 12, h: 4 } },
  ],
  items: [
    { id: "items-order-mode", title: "Order & Item Mode", group: 0, layout: { x: 0, y: 0, w: 6, h: 6 } },
    { id: "items-strategy", title: "SKU Strategy", group: 1, layout: { x: 6, y: 0, w: 6, h: 6 } },
    { id: "items-prefix", title: "SKU Prefix", group: 2, layout: { x: 0, y: 6, w: 4, h: 5 } },
    { id: "items-assets", title: "Tracked Assets", group: 3, layout: { x: 4, y: 6, w: 8, h: 5 } },
    { id: "items-categories", title: "Categories", group: 4, layout: { x: 0, y: 11, w: 6, h: 5 } },
    { id: "items-attributes", title: "Attributes", group: 5, layout: { x: 6, y: 11, w: 6, h: 5 } },
  ],
  operations: [
    { id: "operations-heading", title: "Team Structure", group: 0, layout: { x: 0, y: 0, w: 12, h: 4 } },
    { id: "operations-brand", title: "Brand Portal", group: 0, layout: { x: 0, y: 5, w: 4, h: 6 } },
    { id: "operations-scanning", title: "Scanning & Labels", group: 1, layout: { x: 4, y: 5, w: 4, h: 6 } },
    { id: "operations-bins", title: "Bins & Locations", group: 2, layout: { x: 8, y: 5, w: 4, h: 6 } },
    { id: "operations-teams", title: "Teams & Access", group: 3, layout: { x: 0, y: 12, w: 6, h: 6 } },
    { id: "operations-sla", title: "SLA & Alerts", group: 4, layout: { x: 6, y: 12, w: 6, h: 6 } },
    { id: "operations-dashboard", title: "Dashboard Focus", group: 5, layout: { x: 0, y: 19, w: 12, h: 5 } },
  ],
  floorplan: [
    { id: "floor-grid", title: "Floorplan", group: 0, layout: { x: 0, y: 0, w: 8, h: 9 } },
    { id: "floor-palette", title: "Zones", group: 1, layout: { x: 8, y: 0, w: 4, h: 5 } },
    { id: "floor-floors", title: "Floors", group: 2, layout: { x: 8, y: 5, w: 4, h: 4 } },
    { id: "floor-assets", title: "Assets", group: 3, layout: { x: 0, y: 9, w: 8, h: 4 } },
    { id: "floor-units", title: "Units", group: 4, layout: { x: 8, y: 9, w: 4, h: 4 } },
    { id: "floor-notes", title: "Usage", group: 5, layout: { x: 0, y: 13, w: 12, h: 3 } },
  ],
  summary: [
    { id: "summary-company", title: "Company", group: 0, layout: { x: 0, y: 0, w: 6, h: 7 } },
    { id: "summary-operations", title: "Operations", group: 1, layout: { x: 6, y: 0, w: 6, h: 7 } },
    { id: "summary-sku", title: "Items", group: 2, layout: { x: 0, y: 7, w: 6, h: 7 } },
    { id: "summary-floorplan", title: "Floorplan", group: 3, layout: { x: 6, y: 7, w: 6, h: 7 } },
    { id: "summary-blocks", title: "Suggested Blocks", group: 4, layout: { x: 0, y: 14, w: 12, h: 5 } },
  ],
}

const STEP_VERTICAL_GAP = 4

interface FlowBlock extends BlockCardDefinition {
  step: StepId
}

interface FlowGroup {
  step: StepId
  order: number
  key: string
  blocks: FlowBlock[]
}

const FLOW_GROUPS: FlowGroup[] = (() => {
  let offset = 0
  const groups: FlowGroup[] = []

  STEP_ORDER.forEach((step) => {
    const defs = stepDefinitions[step]
    const map = new Map<number, FlowBlock[]>()
    let stepMaxY = 0

    defs.forEach((def) => {
      const adjustedLayout = { ...def.layout, y: def.layout.y + offset }
      const block: FlowBlock = { ...def, layout: adjustedLayout, step }
      const list = map.get(def.group) ?? []
      list.push(block)
      map.set(def.group, list)
      stepMaxY = Math.max(stepMaxY, adjustedLayout.y + adjustedLayout.h)
    })

    const sortedOrders = Array.from(map.keys()).sort((a, b) => a - b)
    sortedOrders.forEach((order) => {
      groups.push({ step, order, key: `${step}-${order}`, blocks: map.get(order)! })
    })

    offset = stepMaxY + STEP_VERTICAL_GAP
  })

  return groups
})()

const FLOW_BLOCKS: FlowBlock[] = FLOW_GROUPS.flatMap((group) => group.blocks)
const FLOW_BLOCK_MAP = new Map<string, FlowBlock>(FLOW_BLOCKS.map((block) => [block.id, block]))

const BLOCK_HEIGHT_OVERRIDES: Record<string, number> = {
  "path-note": 5,
  "style-heading": 6,
  "operations-heading": 6,
}

function inferMinHeight(block: FlowBlock) {
  const override = BLOCK_HEIGHT_OVERRIDES[block.id]
  if (override !== undefined) {
    return override
  }

  const width = block.layout.w

  if (block.step === "floorplan") {
    return 10
  }

  if (block.step === "summary") {
    return 7
  }

  if (width >= 10) {
    return 7
  }

  if (width >= 6) {
    return 8
  }

  return 8
}

function useOnboardingReducer() {
  return useReducer(onboardingReducer, initialState)
}

export default function OnboardingPage() {
  const [state, dispatch] = useOnboardingReducer()
  const [visibleGroupCount, setVisibleGroupCount] = useState(1)
  const [activeGroupIndex, setActiveGroupIndex] = useState(0)
  const [activeZone, setActiveZone] = useState<ZoneKey>("production")

  const activeGroup = FLOW_GROUPS[activeGroupIndex] ?? FLOW_GROUPS[0]
  const currentStep = activeGroup?.step ?? STEP_ORDER[0]
  const stepIndex = STEP_ORDER.indexOf(currentStep)
  const progress = Math.min((visibleGroupCount / FLOW_GROUPS.length) * 100, 100)

  const initialGridState = useMemo(() => {
    const layout = FLOW_BLOCKS.map((block) => {
      const minHeight = inferMinHeight(block)
      const height = Math.max(block.layout.h, minHeight)
      return { ...block.layout, h: height, i: block.id }
    })
    const blocks = Object.fromEntries(
      FLOW_BLOCKS.map((block) => [block.id, { id: block.id, type: "note", title: block.title }]),
    )
    return { mode: "edit", layout, blocks }
  }, [])

  const blockGroupIndex = useMemo(() => {
    const map = new Map<string, number>()
    FLOW_GROUPS.forEach((group, index) => {
      group.blocks.forEach((block) => map.set(block.id, index))
    })
    return map
  }, [])

  const minHeightForLayout = useCallback((item: GridCoordinates) => {
    const block = FLOW_BLOCK_MAP.get(item.i)
    return block ? inferMinHeight(block) : 4
  }, [])

  const {
    state: gridState,
    dragPreview,
    draggedBlock,
    gridRef,
    maxY,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleResizeStart,
    resizing,
  } = useGrid(initialGridState, undefined, {
    autoFit: true,
    minHeight: minHeightForLayout,
  })

  const visibleIds = useMemo(() => {
    const ids = new Set<string>()
    for (let i = 0; i < visibleGroupCount; i++) {
      FLOW_GROUPS[i]?.blocks.forEach((block) => ids.add(block.id))
    }
    return ids
  }, [visibleGroupCount])

  const completedIds = useMemo(() => {
    const ids = new Set<string>()
    for (let i = 0; i < activeGroupIndex; i++) {
      FLOW_GROUPS[i]?.blocks.forEach((block) => ids.add(block.id))
    }
    return ids
  }, [activeGroupIndex])

  const activeIds = useMemo(() => {
    const ids = new Set<string>()
    activeGroup?.blocks.forEach((block) => ids.add(block.id))
    return ids
  }, [activeGroup])

  const activeAccentClass = useMemo(() => {
    switch (state.accent) {
      case "amber":
        return "ring-amber-400 shadow-[0_12px_30px_rgba(217,119,6,0.18)]"
      case "emerald":
        return "ring-emerald-400 shadow-[0_12px_30px_rgba(5,150,105,0.18)]"
      case "violet":
        return "ring-violet-400 shadow-[0_12px_30px_rgba(139,92,246,0.20)]"
      default:
        return "ring-sky-400 shadow-[0_12px_30px_rgba(14,116,144,0.18)]"
    }
  }, [state.accent])

  const stepStatus = useMemo(() => {
    return STEP_ORDER.map((step) => {
      const indices: number[] = []
      FLOW_GROUPS.forEach((group, idx) => {
        if (group.step === step) {
          indices.push(idx)
        }
      })

      if (!indices.length) {
        return {
          step,
          firstIndex: -1,
          lastIndex: -1,
          reachable: false,
          completed: false,
          isActive: step === currentStep,
        }
      }

      const firstIndex = indices[0]
      const lastIndex = indices[indices.length - 1]

      return {
        step,
        firstIndex,
        lastIndex,
        reachable: firstIndex < visibleGroupCount,
        completed: lastIndex < activeGroupIndex,
        isActive: step === currentStep,
      }
    })
  }, [activeGroupIndex, currentStep, visibleGroupCount])

  const blockRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const headerRef = useRef<HTMLElement | null>(null)
  const autoScrollEnabledRef = useRef(false)

  useEffect(() => {
    if (!autoScrollEnabledRef.current) return

    const focusBlock = activeGroup?.blocks[0]
    if (!focusBlock) {
      autoScrollEnabledRef.current = false
      return
    }

    const element = blockRefs.current[focusBlock.id]
    if (!element) {
      autoScrollEnabledRef.current = false
      return
    }

    const headerHeight = headerRef.current?.offsetHeight ?? 0
    const offset = headerHeight + 24

    const scrollToTarget = () => {
      const rect = element.getBoundingClientRect()
      const targetTop = rect.top + window.scrollY - offset
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0)
      window.scrollTo({
        top: Math.min(Math.max(targetTop, 0), maxScroll),
        behavior: "smooth",
      })
      autoScrollEnabledRef.current = false
    }

    const frame = window.requestAnimationFrame(scrollToTarget)
    return () => window.cancelAnimationFrame(frame)
  }, [activeGroup, activeGroupIndex, visibleGroupCount])

  const validator = groupValidators[activeGroup?.key ?? ""] ?? (() => true)
  const atLastGroup = activeGroupIndex >= FLOW_GROUPS.length - 1
  const nextDisabled = atLastGroup || !validator(state)

  const handleNext = () => {
    if (atLastGroup) return
    if (!validator(state)) return
    autoScrollEnabledRef.current = true
    const nextIndex = Math.min(activeGroupIndex + 1, FLOW_GROUPS.length - 1)
    setVisibleGroupCount((count) => Math.max(count, nextIndex + 1))
    setActiveGroupIndex(nextIndex)
  }

  const handleBack = () => {
    if (activeGroupIndex === 0) return
    autoScrollEnabledRef.current = true
    setActiveGroupIndex((index) => Math.max(index - 1, 0))
  }

  const handleBlockActivate = (blockId: string) => {
    const targetGroup = blockGroupIndex.get(blockId)
    if (targetGroup === undefined) return
    if (targetGroup >= visibleGroupCount) return
    autoScrollEnabledRef.current = true
    setActiveGroupIndex(targetGroup)
  }

  const handleStepJump = (step: StepId) => {
    const target = stepStatus.find((status) => status.step === step)
    if (!target || !target.reachable || target.firstIndex === -1) return
    autoScrollEnabledRef.current = true
    setActiveGroupIndex(target.firstIndex)
  }

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30 text-foreground",
        state.theme === "dark" && "bg-slate-950 text-slate-100",
      )}
    >
      <header
        ref={headerRef}
        className="sticky top-0 z-50 border-b bg-background/85 backdrop-blur shadow-sm supports-[backdrop-filter]:bg-background/60"
      >
        <div className={gridContainerClass("flex items-center justify-between gap-4 px-6 py-3", "wide")}>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 overflow-hidden rounded-full border bg-card shadow-sm">
              {state.logoDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={state.logoDataUrl} alt={state.companyName || "Company logo"} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-muted-foreground">
                  {state.companyName ? state.companyName.charAt(0).toUpperCase() : "?"}
                </div>
              )}
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Groovy Onboarding</p>
              <h1 className="text-xl font-semibold">
                {state.companyName ? `${state.companyName} Workspace` : "Let’s build your workspace"}
              </h1>
              {state.headquarters && (
                <p className="text-xs text-muted-foreground">Based in {state.headquarters}</p>
              )}
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Step {stepIndex + 1} / {STEP_ORDER.length}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-40">
        <div className={gridContainerClass("px-6 pt-8 pb-12 space-y-8", "full")}>
          <StepBreadcrumbs activeStep={currentStep} stepStatus={stepStatus} onJump={handleStepJump} />

          <Card className="shadow-lg border-border/70">
            <CardHeader className="pb-0">
              <h2 className="text-lg font-semibold">{stepCopy[currentStep].title}</h2>
              <p className="text-sm text-muted-foreground">{stepCopy[currentStep].description}</p>
            </CardHeader>
            <CardContent className="pt-8 pb-4">
              <div className="relative">
                <GridSurface
                  ref={gridRef}
                  mode="edit"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  maxY={maxY}
                  dragPreview={dragPreview}
                  className="relative w-full"
                >
                  {gridState.layout.map((item) => {
                    const block = gridState.blocks[item.i]
                    const renderer = blockRenderers[item.i]
                    const meta = FLOW_BLOCK_MAP.get(item.i)

                    if (!meta || !visibleIds.has(item.i)) {
                      return null
                    }

                    const isActive = activeIds.has(item.i)
                    const isCompleted = completedIds.has(item.i)
                    const dimmed = !isActive && isCompleted
                    const stepNumber = STEP_ORDER.indexOf(meta.step) + 1
                    const stepBadge = `Step ${stepNumber}`

                    return (
                      <BlockShell
                        key={item.i}
                        ref={(element) => {
                          blockRefs.current[item.i] = element
                        }}
                        blockId={item.i}
                        title={block?.title || meta.title}
                        mode="edit"
                        gridPos={item}
                        draggedBlock={draggedBlock}
                        onDragStart={handleDragStart}
                        onResizeStart={handleResizeStart}
                        controls={null}
                        className={cn(
                          "transition-opacity duration-300",
                          isActive && `ring-2 ring-offset-2 ${activeAccentClass}`,
                          !isActive && !isCompleted && "opacity-30",
                          dimmed && "opacity-60 hover:opacity-90 cursor-pointer",
                        )}
                        onActivate={dimmed ? handleBlockActivate : undefined}
                        stepLabel={stepBadge}
                      >
                        {renderer ? (
                          renderer({
                            state,
                            dispatch,
                            activeZone,
                            setActiveZone,
                            handleNext,
                          })
                        ) : null}
                      </BlockShell>
                    )
                  })}
                </GridSurface>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="sticky bottom-0 z-50 border-t bg-background/95 backdrop-blur shadow-lg supports-[backdrop-filter]:bg-background/70">
        <div className={gridContainerClass("px-6 py-4", "full")}
        >
          <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full bg-sky-500 transition-all",
                state.accent === "amber" && "bg-amber-500",
                state.accent === "emerald" && "bg-emerald-500",
                state.accent === "violet" && "bg-violet-500",
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Step {stepIndex + 1} of {STEP_ORDER.length}
            </div>
            <div className="flex flex-col items-stretch gap-2 sm:items-end">
              <div className="flex items-center gap-2">
                <Button variant="ghost" disabled={stepIndex === 0} onClick={handleBack}>
                  Back
                </Button>
                {currentStep !== "summary" ? (
                  <Button onClick={handleNext} disabled={nextDisabled}>
                    Next
                  </Button>
                ) : (
                  <Button className="font-semibold">
                    Generate my workspace
                  </Button>
                )}
              </div>
              {nextDisabled && currentStep !== "summary" && stepIncompleteHint[currentStep] && (
                <p className="text-xs text-destructive sm:text-right">{stepIncompleteHint[currentStep]}</p>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

interface RendererContext {
  state: OnboardingState
  dispatch: React.Dispatch<OnboardingAction>
  activeZone: ZoneKey
  setActiveZone: (zone: ZoneKey) => void
  handleNext: () => void
}

type Renderer = (ctx: RendererContext) => JSX.Element

const blockRenderers: Record<string, Renderer> = {
  "path-manufacturing": ({ state, dispatch, handleNext }) => (
    <IndustryCard
      title="Fashion Manufacturing"
      description="We’ll wire sample data, workflows, and KPIs for apparel production."
      active={state.path === "manufacturing"}
      onSelect={() => {
        dispatch({
          type: "update",
          payload: { path: "manufacturing" },
        })
      }}
    >
      <Button
        className="w-full font-semibold tracking-wide shadow-sm"
        size="lg"
        onClick={handleNext}
        disabled={state.path !== "manufacturing"}
      >
        Load manufacturing demo
      </Button>
    </IndustryCard>
  ),
  "path-construction": () => (
    <IndustryCard
      title="Construction"
      description="Coming soon — jobsite logistics, permits, inspections."
      active={false}
      disabled
    />
  ),
  "path-defense": () => (
    <IndustryCard
      title="Defense"
      description="Coming soon — readiness, compliance, secure asset controls."
      active={false}
      disabled
    />
  ),
  "path-note": () => (
    <div className="space-y-2 text-sm text-muted-foreground">
      <p>
        Each card sits on the same malleable grid you’ll use later—drag them around, resize them, or collapse them. Once you pick a track, the remaining steps tailor questions for that vertical.
      </p>
      <p className="text-xs uppercase tracking-wide">Tip: this demo showcases the fashion manufacturing pathway.</p>
    </div>
  ),

  "company-logo": ({ state, dispatch }) => (
    <div className="flex h-full flex-col gap-3">
      <p className="text-sm text-muted-foreground">Upload a logo so Mission Control carries your branding.</p>
      <UploadDropzone onFileSelected={(file) => handleLogoUpload(file, dispatch)} preview={state.logoDataUrl} />
    </div>
  ),
  "company-info": ({ state, dispatch }) => (
    <div className="space-y-3">
      <LabeledInput
        label="Company name"
        placeholder="e.g. Groovy Manufacturing"
        value={state.companyName}
        onChange={(value) => dispatch({ type: "update", payload: { companyName: value } })}
      />
      <LabeledInput
        label="Headquarters"
        placeholder="City, Country"
        value={state.headquarters}
        onChange={(value) => dispatch({ type: "update", payload: { headquarters: value } })}
      />
      <ToggleRow
        label="Multiple production sites?"
        value={state.multiSite}
        onToggle={() => dispatch({ type: "update", payload: { multiSite: !state.multiSite } })}
        trueLabel="Yes"
        falseLabel="No"
      />
    </div>
  ),
  "company-readiness": ({ state, dispatch }) => (
    <div className="space-y-3 text-sm">
      <LabeledInput
        label="Target go-live window"
        placeholder="e.g. Q2 2025"
        value={state.goLiveTarget}
        onChange={(value) => dispatch({ type: "update", payload: { goLiveTarget: value } })}
      />
      <LabeledInput
        label="Primary contact role"
        placeholder="Operations Lead, Plant Manager, etc."
        value={state.primaryContactRole}
        onChange={(value) => dispatch({ type: "update", payload: { primaryContactRole: value } })}
      />
      <ChipSelector
        label="Compliance needs"
        options={complianceOptions}
        selected={state.complianceSelections}
        onToggle={(option) => dispatch({ type: "toggleCompliance", compliance: option })}
      />
    </div>
  ),
  "company-sites": ({ state }) => (
    <div className="h-full space-y-2 text-sm">
      <p className="text-muted-foreground">We’ll spin up location-aware dashboards.</p>
      <div className="rounded-lg border bg-card/70 p-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">Snapshot</p>
        <p className="mt-1 text-sm font-semibold">{state.headquarters || "HQ TBD"}</p>
        <p className="text-xs text-muted-foreground">Sites: {state.multiSite ? "Multiple" : "Single"}</p>
      </div>
      <p className="text-xs text-muted-foreground">
        Address powers timezone defaults, regional compliance packs, and reporting filters.
      </p>
    </div>
  ),
  "company-story": () => (
    <div className="h-full rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
      Drop a short mission statement or leave notes for the solutions team. This card travels with the engagement file.
    </div>
  ),

  "style-heading": () => (
    <div className="flex h-full flex-col justify-center gap-3 rounded-xl border border-dashed border-primary/20 bg-primary/5 p-5 text-sm text-muted-foreground">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">Design Sprint</p>
      <p>
        We’ll tailor the demo’s look and feel. Pick the theme, accent, and layout density so the workspace matches the vibe you want to showcase.
      </p>
      <p className="text-xs text-muted-foreground/80">
        Expect a handful of quick choices—color, spacing, motion—and we’ll refresh the preview as you go.
      </p>
    </div>
  ),

  "style-theme": ({ state, dispatch }) => (
    <SelectableCard
      title="Theme"
      description="Light keeps things bright. Dark is ideal for control rooms."
      layout="column"
      active
      onClick={() => undefined}
    >
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant={state.theme === "light" ? "default" : "outline"}
          onClick={() => dispatch({ type: "update", payload: { theme: "light" } })}
        >
          Light
        </Button>
        <Button
          variant={state.theme === "dark" ? "default" : "outline"}
          onClick={() => dispatch({ type: "update", payload: { theme: "dark" } })}
        >
          Dark
        </Button>
      </div>
    </SelectableCard>
  ),
  "style-accent": ({ state, dispatch }) => (
    <SelectableCard title="Accent" description="Set the highlight color.">
      <div className="flex flex-wrap gap-2">
        {accentOptions.map((accent) => (
          <button
            key={accent.id}
            type="button"
            onClick={() => dispatch({ type: "update", payload: { accent: accent.id } })}
            className={cn(
              "h-10 w-10 rounded-full border-2",
              accent.id === state.accent ? "border-foreground" : "border-transparent",
              accent.swatch,
            )}
          />
        ))}
      </div>
    </SelectableCard>
  ),
  "style-density": ({ state, dispatch }) => (
    <SelectableCard title="Density" description="Choose spacing preference.">
      <div className="flex gap-2">
        <Button
          variant={state.density === "comfortable" ? "default" : "outline"}
          onClick={() => dispatch({ type: "update", payload: { density: "comfortable" } })}
        >
          Comfortable
        </Button>
        <Button
          variant={state.density === "compact" ? "default" : "outline"}
          onClick={() => dispatch({ type: "update", payload: { density: "compact" } })}
        >
          Compact
        </Button>
      </div>
    </SelectableCard>
  ),
  "style-layout": ({ state, dispatch }) => (
    <SelectableCard title="Layout" description="What type of components should dominate?">
      <div className="flex flex-col gap-2">
        {layoutPreferences.map((pref) => (
          <Button
            key={pref.id}
            variant={state.layoutPreference === pref.id ? "default" : "outline"}
            onClick={() => dispatch({ type: "update", payload: { layoutPreference: pref.id } })}
            className="justify-start"
          >
            <div className="text-left">
              <p className="text-sm font-semibold">{pref.label}</p>
              <p className="text-xs text-muted-foreground">{pref.description}</p>
            </div>
          </Button>
        ))}
      </div>
    </SelectableCard>
  ),
  "style-mood": ({ state, dispatch }) => (
    <SelectableCard title="Mood" description="Dial how bold the interface should feel.">
      <div className="flex flex-col gap-2">
        {styleMoodOptions.map((mood) => (
          <Button
            key={mood.id}
            variant={state.styleMood === mood.id ? "default" : "outline"}
            onClick={() => dispatch({ type: "update", payload: { styleMood: mood.id } })}
            className="justify-start"
          >
            <div className="text-left">
              <p className="text-sm font-semibold">{mood.label}</p>
              <p className="text-xs text-muted-foreground">{mood.description}</p>
            </div>
          </Button>
        ))}
      </div>
    </SelectableCard>
  ),
  "style-motion": ({ state, dispatch }) => (
    <SelectableCard title="Motion" description="Let the UI breathe or keep it still.">
      <div className="flex flex-col gap-2">
        {motionPreferenceOptions.map((option) => (
          <Button
            key={option.id}
            variant={state.motionPreference === option.id ? "default" : "outline"}
            onClick={() => dispatch({ type: "update", payload: { motionPreference: option.id } })}
            className="justify-start"
          >
            <div className="text-left">
              <p className="text-sm font-semibold">{option.label}</p>
              <p className="text-xs text-muted-foreground">{option.description}</p>
            </div>
          </Button>
        ))}
      </div>
    </SelectableCard>
  ),
  "style-preview": ({ state }) => (
    <div className={cn("h-full rounded-xl border bg-card p-4", state.theme === "dark" && "bg-slate-900 text-slate-100")}
    >
      <p className="text-xs uppercase tracking-wide text-muted-foreground">Live preview</p>
      <div className="mt-3 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span>Orders Ready</span>
          <span className="text-muted-foreground">Today</span>
        </div>
        <div className="rounded-lg bg-background p-4 text-4xl font-semibold">126</div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className={cn("h-2 w-2 rounded-full", accentToBg(state.accent))}></span>
          <span>+12% vs last week</span>
        </div>
        <div className="space-y-2 pt-3 text-xs">
          <p>Queue depth</p>
          <div className="h-2 w-full rounded-full bg-muted">
            <div className={cn("h-full rounded-full", accentToBg(state.accent))} style={{ width: state.density === "compact" ? "82%" : "64%" }} />
          </div>
        </div>
      </div>
    </div>
  ),

  "systems-inventory": ({ state, dispatch }) => (
    <SelectableCard
      title="Inventory source of truth"
      description="Helps us plan integrations and import paths."
    >
      <div className="space-y-3">
        <div className="flex flex-col gap-2">
          {inventorySystemOptions.map((option) => (
            <Button
              key={option.id}
              variant={state.inventorySystem === option.id ? "default" : "outline"}
              onClick={() => dispatch({ type: "update", payload: { inventorySystem: option.id } })}
              className="justify-start"
            >
              <div className="text-left">
                <p className="text-sm font-semibold">{option.label}</p>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </div>
            </Button>
          ))}
        </div>
        {state.inventorySystem !== "none" && (
          <LabeledInput
            label="Describe the setup"
            placeholder="Vendor, spreadsheets, custom tooling..."
            value={state.inventorySystemNotes}
            onChange={(value) => dispatch({ type: "update", payload: { inventorySystemNotes: value } })}
          />
        )}
      </div>
    </SelectableCard>
  ),
  "systems-erp": ({ state, dispatch }) => (
    <SelectableCard title="ERP / MRP" description="Optional: note what drives orders upstream.">
      <div className="space-y-3">
        <div className="flex flex-col gap-2">
          {inventorySystemOptions.map((option) => (
            <Button
              key={option.id}
              variant={state.erpSystem === option.id ? "default" : "outline"}
              onClick={() => dispatch({ type: "update", payload: { erpSystem: option.id } })}
              className="justify-start"
            >
              <div className="text-left">
                <p className="text-sm font-semibold">{option.label}</p>
                <p className="text-xs text-muted-foreground">
                  {option.id === "none" ? "We’ll generate orders inside Groovy" : "We’ll prep connectors"}
                </p>
              </div>
            </Button>
          ))}
        </div>
        {state.erpSystem !== "none" && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">Which platform?</label>
            <div className="grid grid-cols-2 gap-2">
              {erpVendorExamples.map((vendor) => (
                <Button
                  key={vendor}
                  variant={state.erpSystemName === vendor ? "default" : "outline"}
                  onClick={() =>
                    dispatch({
                      type: "update",
                      payload: { erpSystemName: vendor === "Other" ? state.erpSystemName : vendor },
                    })
                  }
                >
                  {vendor}
                </Button>
              ))}
            </div>
            <Input
              placeholder="Vendor name or notes"
              value={state.erpSystemName}
              onChange={(event) => dispatch({ type: "update", payload: { erpSystemName: event.target.value } })}
            />
          </div>
        )}
      </div>
    </SelectableCard>
  ),
  "systems-integration": ({ state, dispatch }) => (
    <SelectableCard title="Integration priority" description="When should we wire data flows?">
      <div className="flex gap-2">
        {integrationPriorityOptions.map((option) => (
          <Button
            key={option.id}
            variant={state.integrationPriority === option.id ? "default" : "outline"}
            onClick={() => dispatch({ type: "update", payload: { integrationPriority: option.id } })}
            className="flex-1"
          >
            {option.label}
          </Button>
        ))}
      </div>
    </SelectableCard>
  ),
  "systems-traceability": ({ state, dispatch }) => (
    <SelectableCard title="Traceability" description="Choose how granular we track items.">
      <div className="flex flex-col gap-2">
        {traceabilityOptions.map((option) => (
          <Button
            key={option.id}
            variant={state.traceability === option.id ? "default" : "outline"}
            onClick={() => dispatch({ type: "update", payload: { traceability: option.id } })}
            className="justify-start"
          >
            <div className="text-left">
              <p className="text-sm font-semibold">{option.label}</p>
              <p className="text-xs text-muted-foreground">{option.description}</p>
            </div>
          </Button>
        ))}
      </div>
    </SelectableCard>
  ),
  "systems-process": ({ state, dispatch }) => (
    <SelectableCard title="Process preset" description="We’ll load the workflow as read-only for the demo.">
      <div className="flex flex-col gap-2">
        {processPresetOptions.map((option) => (
          <Button
            key={option.id}
            variant={state.processPreset === option.id ? "default" : "outline"}
            onClick={() => dispatch({ type: "update", payload: { processPreset: option.id } })}
            className="justify-start"
          >
            <div className="text-left">
              <p className="text-sm font-semibold">{option.label}</p>
              <p className="text-xs text-muted-foreground">{option.description}</p>
            </div>
          </Button>
        ))}
      </div>
    </SelectableCard>
  ),

  "capacity-volume": ({ state, dispatch }) => (
    <SliderField
      label="Items managed per month"
      min={0}
      max={1000000}
      step={1000}
      value={state.monthlyItems}
      onChange={(value) => dispatch({ type: "update", payload: { monthlyItems: value } })}
      formatter={(value) => `${value.toLocaleString()} units`}
    />
  ),
  "capacity-team": ({ state, dispatch }) => (
    <div className="space-y-4">
      <SliderField
        label="Active team members"
        min={0}
        max={1000}
        step={5}
        value={state.teamSize}
        onChange={(value) => dispatch({ type: "update", payload: { teamSize: value } })}
        formatter={(value) => `${value} people`}
      />
      <div>
        <label className="text-xs font-semibold text-muted-foreground">Shifts per day</label>
        <div className="mt-2 flex gap-2">
          {['1', '2', '3', '24/7'].map((shift) => (
            <Button
              key={shift}
              variant={state.shifts === shift ? "default" : "outline"}
              onClick={() => dispatch({ type: "update", payload: { shifts: shift } })}
            >
              {shift}
            </Button>
          ))}
        </div>
      </div>
    </div>
  ),
  "capacity-method": ({ state, dispatch }) => (
    <SelectableCard
      title="How do you track capacity?"
      description="We’ll tune dashboards and alerts based on this."
    >
      <div className="flex flex-col gap-2">
        {[
          { id: "headcount" as CapacityTracking, label: "Headcount", helper: "People allocation drives throughput" },
          { id: "machine" as CapacityTracking, label: "Machine time", helper: "Stations and runtimes drive output" },
          { id: "backlog" as CapacityTracking, label: "Order backlog", helper: "Queue depth controls pacing" },
        ].map((option) => (
          <Button
            key={option.id}
            variant={state.capacityTracking === option.id ? "default" : "outline"}
            onClick={() => dispatch({ type: "update", payload: { capacityTracking: option.id } })}
            className="justify-start"
          >
            <div className="text-left">
              <p className="text-sm font-semibold">{option.label}</p>
              <p className="text-xs text-muted-foreground">{option.helper}</p>
            </div>
          </Button>
        ))}
      </div>
    </SelectableCard>
  ),
  "capacity-seasonality": ({ state, dispatch }) => (
    <SelectableCard title="Seasonality" description="Flag spikes so we load the right presets.">
      <div className="space-y-3">
        <ToggleRow
          label="Do you experience seasonal surges?"
          value={state.seasonalSpikes}
          onToggle={() => dispatch({ type: "update", payload: { seasonalSpikes: !state.seasonalSpikes } })}
          trueLabel="Yes"
          falseLabel="No"
        />
        {state.seasonalSpikes && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">Peak months</p>
            <div className="flex flex-wrap gap-2">
              {monthOptions.map((month) => (
                <Button
                  key={month}
                  variant={state.peakMonths.includes(month) ? "default" : "outline"}
                  size="sm"
                  onClick={() => dispatch({ type: "togglePeakMonth", month })}
                >
                  {month}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </SelectableCard>
  ),
  "capacity-summary": ({ state }) => (
    <div className="text-sm text-muted-foreground space-y-2">
      <p>
        <strong>{state.monthlyItems.toLocaleString()}</strong> items/month • <strong>{state.teamSize}</strong> operators • <strong>{state.shifts}</strong> shifts
      </p>
      <p className="text-xs">
        Capacity lens: <strong>{state.capacityTracking ? state.capacityTracking.replace("-", " ") : "Choose one"}</strong>
      </p>
      {state.seasonalSpikes && (
        <p className="text-xs">
          Peak months: {state.peakMonths.length ? state.peakMonths.join(", ") : "Mark at least one"}
        </p>
      )}
    </div>
  ),

  "items-order-mode": ({ state, dispatch }) => (
    <SelectableCard title="Orders & production" description="Set how we generate work and size batches.">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {orderModeOptions.map((option) => (
            <Button
              key={option.id}
              variant={state.orderMode === option.id ? "default" : "outline"}
              onClick={() => dispatch({ type: "update", payload: { orderMode: option.id } })}
              className="justify-start"
            >
              <div className="text-left">
                <p className="text-sm font-semibold">{option.label}</p>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </div>
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {itemsPerLineOptions.map((option) => (
            <Button
              key={option.id}
              variant={state.itemsPerLineMode === option.id ? "default" : "outline"}
              onClick={() => dispatch({ type: "update", payload: { itemsPerLineMode: option.id } })}
            >
              {option.label}
            </Button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {variantComplexityOptions.map((option) => (
            <Button
              key={option.id}
              variant={state.variantComplexity === option.id ? "default" : "outline"}
              onClick={() => dispatch({ type: "update", payload: { variantComplexity: option.id } })}
              className="justify-start"
            >
              <div className="text-left">
                <p className="text-sm font-semibold">{option.label}</p>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </SelectableCard>
  ),
  "items-strategy": ({ state, dispatch }) => (
    <SelectableCard title="SKU strategy" description="Help us understand how you want to seed catalog data.">
      <div className="space-y-3">
        <div className="flex gap-2">
          {[
            { id: "create" as const, label: "Build fresh" },
            { id: "import" as const, label: "Import existing" },
            { id: "hybrid" as const, label: "Mix of both" },
          ].map((option) => (
            <Button
              key={option.id}
              variant={state.skuStrategy === option.id ? "default" : "outline"}
              onClick={() => dispatch({ type: "update", payload: { skuStrategy: option.id } })}
              className="flex-1"
            >
              {option.label}
            </Button>
          ))}
        </div>
        <label className="text-xs font-semibold text-muted-foreground">Notes / import formats</label>
        <textarea
          className="w-full resize-none rounded-lg border bg-background p-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          rows={3}
          placeholder="CSV, XLSX, API, etc."
          value={state.existingSkuNotes}
          onChange={(event) => dispatch({ type: "update", payload: { existingSkuNotes: event.target.value } })}
        />
      </div>
    </SelectableCard>
  ),

  "items-prefix": ({ state, dispatch }) => (
    <LabeledInput
      label="SKU prefix"
      placeholder="e.g. GRO"
      value={state.skuPrefix}
      onChange={(value) => dispatch({ type: "update", payload: { skuPrefix: value.toUpperCase() } })}
      uppercase
    />
  ),
  "items-assets": ({ state, dispatch }) => (
    <ChipSelector
      label="What do you produce?"
      options={assetOptions}
      selected={state.assets}
      onToggle={(option) => dispatch({ type: "toggleAsset", asset: option })}
    />
  ),
  "items-categories": ({ state, dispatch }) => (
    <ChipSelector
      label="Primary categories"
      options={skuCategories}
      selected={state.skuCategories}
      onToggle={(option) => dispatch({ type: "toggleSkuCategory", category: option })}
    />
  ),
  "items-attributes": ({ state, dispatch }) => (
    <ChipSelector
      label="Label attributes"
      options={skuAttributes}
      selected={state.skuAttributes}
      onToggle={(option) => dispatch({ type: "toggleSkuAttribute", attribute: option })}
    />
  ),

  "operations-heading": () => (
    <div className="flex h-full flex-col justify-center gap-3 rounded-xl border border-dashed border-blue-300/40 bg-blue-500/5 p-5 text-sm text-muted-foreground">
      <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Team Structure</p>
      <p>
        Up next: decide who gets access, how work is routed, and which alerts matter. These choices wire the roles, scanning defaults, and escalation rules in the generated workspace.
      </p>
      <p className="text-xs text-muted-foreground/80">
        We’ll start with brand-facing visibility, then move into labels, binning, teams, and SLA safeguards.
      </p>
    </div>
  ),

  "operations-brand": ({ state, dispatch }) => (
    <SelectableCard title="Brand portal" description="Share live status with partners when enabled.">
      <div className="space-y-3">
        <ToggleRow
          label="Enable brand portal"
          value={state.brandPortalEnabled}
          onToggle={() => dispatch({ type: "update", payload: { brandPortalEnabled: !state.brandPortalEnabled } })}
          trueLabel="On"
          falseLabel="Off"
        />
        {state.brandPortalEnabled && (
          <ChipSelector
            label="What can partners see?"
            options={brandDataOptions}
            selected={state.brandPortalData}
            onToggle={(option) => dispatch({ type: "toggleBrandData", dataPoint: option })}
          />
        )}
      </div>
    </SelectableCard>
  ),
  "operations-scanning": ({ state, dispatch }) => (
    <SelectableCard title="Scanning & labels" description="Pick defaults for the factory app.">
      <div className="space-y-3">
        <div className="flex gap-2">
          {scanningOptions.map((option) => (
            <Button
              key={option.id}
              variant={state.scanningMethod === option.id ? "default" : "outline"}
              onClick={() => dispatch({ type: "update", payload: { scanningMethod: option.id } })}
              className="flex-1"
            >
              <div>
                <p className="text-sm font-semibold">{option.label}</p>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </div>
            </Button>
          ))}
        </div>
        <ChipSelector
          label="Label contents"
          options={labelFieldOptions}
          selected={state.labelFields}
          onToggle={(option) => dispatch({ type: "toggleLabelField", field: option })}
        />
      </div>
    </SelectableCard>
  ),
  "operations-bins": ({ state, dispatch }) => (
    <SelectableCard title="Bins & locations" description="Enable if you stage items in bins or racks.">
      <div className="space-y-3">
        <ToggleRow
          label="Use bins"
          value={state.binsEnabled}
          onToggle={() => dispatch({ type: "update", payload: { binsEnabled: !state.binsEnabled } })}
          trueLabel="Yes"
          falseLabel="No"
        />
        {state.binsEnabled && (
          <ChipSelector
            label="Bin types"
            options={binTypeOptions}
            selected={state.binTypes}
            onToggle={(option) => dispatch({ type: "toggleBinType", binType: option })}
          />
        )}
      </div>
    </SelectableCard>
  ),
  "operations-teams": ({ state, dispatch }) => (
    <SelectableCard title="Teams & access" description="Seed the org chart so we can scope dashboards.">
      <div className="space-y-3">
        <ChipSelector
          label="Core teams"
          options={teamSeedOptions}
          selected={state.teamSeeds}
          onToggle={(option) => dispatch({ type: "toggleTeamSeed", team: option })}
        />
        <ChipSelector
          label="Access scope"
          options={accessScopeOptions}
          selected={state.accessScope}
          onToggle={(option) => dispatch({ type: "toggleAccessScope", scope: option })}
        />
      </div>
    </SelectableCard>
  ),
  "operations-sla": ({ state, dispatch }) => (
    <SelectableCard title="SLA & alerts" description="We’ll prime KPIs and alert thresholds.">
      <div className="space-y-3">
        <SliderField
          label="Quoted lead time (days)"
          min={1}
          max={120}
          step={1}
          value={state.slaLeadTime}
          onChange={(value) => dispatch({ type: "update", payload: { slaLeadTime: value } })}
          formatter={(value) => `${value} days`}
        />
        <SliderField
          label="Queue alert threshold"
          min={10}
          max={500}
          step={10}
          value={state.queueThreshold}
          onChange={(value) => dispatch({ type: "update", payload: { queueThreshold: value } })}
          formatter={(value) => `${value} items`}
        />
        <ChipSelector
          label="Critical checkpoints"
          options={slaCheckpointOptions}
          selected={state.slaCheckpoints}
          onToggle={(option) => dispatch({ type: "toggleSlaCheckpoint", checkpoint: option })}
        />
      </div>
    </SelectableCard>
  ),
  "operations-dashboard": ({ state, dispatch }) => (
    <SelectableCard title="Dashboard focus" description="Who do we design Mission Control for first?">
      <div className="space-y-3">
        <ChipSelector
          label="Primary audience"
          options={dashboardAudienceOptions}
          selected={state.dashboardAudience}
          onToggle={(option) => dispatch({ type: "toggleDashboardAudience", audience: option })}
        />
        <div className="flex gap-2">
          {chartPreferenceOptions.map((option) => (
            <Button
              key={option.id}
              variant={state.chartPreference === option.id ? "default" : "outline"}
              onClick={() => dispatch({ type: "update", payload: { chartPreference: option.id } })}
              className="flex-1 justify-start"
            >
              <div>
                <p className="text-sm font-semibold">{option.label}</p>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </SelectableCard>
  ),

  "floor-grid": ({ state, dispatch, activeZone }) => {
    const activeFloor = state.floors.find((floor) => floor.id === state.activeFloorId) ?? state.floors[0]
    const cellsPainted = activeFloor.grid.flat().filter((cell) => cell !== "unassigned").length
    const baseSqft = cellsPainted * CELL_SQFT
    const estimatedArea = state.floorplanUnits === "sqft" ? baseSqft : Math.round(baseSqft * 0.092903)
    const unitLabel = state.floorplanUnits === "sqft" ? "sq ft" : "sq m"
    return (
      <div className="space-y-3">
        <div className="rounded-xl border bg-card p-3 shadow-inner">
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${FLOOR_COLS}, minmax(0, 1fr))` }}>
            {activeFloor.grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <button
                  key={`cell-${rowIndex}-${colIndex}`}
                  type="button"
                  className={cn(
                    "aspect-square rounded-sm border transition",
                    zonePalette.find((zone) => zone.id === cell)?.border ?? "border-border/60",
                    zonePalette.find((zone) => zone.id === cell)?.color ?? "bg-muted",
                  )}
                  onClick={() =>
                    dispatch({
                      type: "setFloorCell",
                      floorId: activeFloor.id,
                      row: rowIndex,
                      col: colIndex,
                      zone: activeZone,
                    })
                  }
                />
              )),
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Painted area ~ <strong>{estimatedArea.toLocaleString()}</strong> {unitLabel}. We’ll use zones to power live maps, storage allocation, and routing rules.
        </p>
      </div>
    )
  },
  "floor-palette": ({ activeZone, setActiveZone }) => (
    <div className="space-y-2">
      {zonePalette.map((zone) => (
        <button
          key={zone.id}
          type="button"
          onClick={() => setActiveZone(zone.id)}
          className={cn(
            "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left transition",
            zone.id === activeZone ? "border-foreground bg-card shadow" : "border-border",
          )}
        >
          <span className="text-sm font-medium">{zone.label}</span>
          <span className={cn("h-4 w-12 rounded-full", zone.color)}></span>
        </button>
      ))}
    </div>
  ),
  "floor-floors": ({ state, dispatch }) => (
    <div className="space-y-3 text-sm">
      <div className="flex items-center justify-between">
        <span className="font-medium">Floors</span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => dispatch({ type: "addFloor" })}
          disabled={state.floors.length >= 4}
        >
          Add
        </Button>
      </div>
      <div className="space-y-2">
        {state.floors.map((floor) => (
          <div key={floor.id} className="flex items-center gap-2">
            <Button
              variant={state.activeFloorId === floor.id ? "default" : "outline"}
              size="sm"
              onClick={() => dispatch({ type: "setActiveFloor", floorId: floor.id })}
            >
              {floor.name}
            </Button>
            <Input
              value={floor.name}
              onChange={(event) => dispatch({ type: "renameFloor", floorId: floor.id, name: event.target.value })}
              className="h-8"
            />
          </div>
        ))}
      </div>
    </div>
  ),
  "floor-assets": ({ state, dispatch }) => (
    <SelectableCard
      title="Existing assets"
      description="Let us know if you have drawings we should reference."
    >
      <div className="space-y-3">
        <ToggleRow
          label="We have a CAD / floorplan file"
          value={state.hasFloorplanAssets}
          onToggle={() => dispatch({ type: "update", payload: { hasFloorplanAssets: !state.hasFloorplanAssets } })}
          trueLabel="Yes"
          falseLabel="No"
        />
        {state.hasFloorplanAssets && (
          <textarea
            className="w-full resize-none rounded-lg border bg-background p-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            rows={3}
            placeholder="Upload filename, SharePoint link, or notes"
            value={state.floorplanAssetNotes}
            onChange={(event) => dispatch({ type: "update", payload: { floorplanAssetNotes: event.target.value } })}
          />
        )}
      </div>
    </SelectableCard>
  ),
  "floor-units": ({ state, dispatch }) => (
    <SelectableCard title="Units" description="We’ll label zones in your preferred unit.">
      <div className="flex gap-2">
        {[
          { id: "sqft" as FloorUnit, label: "Square feet" },
          { id: "sqm" as FloorUnit, label: "Square meters" },
        ].map((option) => (
          <Button
            key={option.id}
            variant={state.floorplanUnits === option.id ? "default" : "outline"}
            onClick={() => dispatch({ type: "update", payload: { floorplanUnits: option.id } })}
            className="flex-1"
          >
            {option.label}
          </Button>
        ))}
      </div>
    </SelectableCard>
  ),
  "floor-notes": () => (
    <div className="text-xs text-muted-foreground space-y-1">
      <p>We convert zones into routing rules, map overlays, and station dashboards.</p>
      <p>Multiple floors let us build floor selectors and escalated alerts per level.</p>
    </div>
  ),

  "summary-company": ({ state }) => (
    <SummaryCardContent
      rows={[
        { label: "Path", value: state.path ? state.path.toUpperCase() : "Not selected" },
        { label: "Company", value: state.companyName || "TBD" },
        { label: "Headquarters", value: state.headquarters || "TBD" },
        { label: "Go-live", value: state.goLiveTarget || "TBD" },
        {
          label: "Compliance",
          value: state.complianceSelections.length ? state.complianceSelections.join(", ") : "None",
        },
      ]}
    />
  ),
  "summary-operations": ({ state }) => (
    (() => {
      const inventoryLabel = inventorySystemOptions.find((option) => option.id === state.inventorySystem)?.label ?? "Groovy"
      const erpLabel =
        state.erpSystem === "none"
          ? "Not linked"
          : (state.erpSystemName ||
              inventorySystemOptions.find((option) => option.id === state.erpSystem)?.label) ?? "ERP connected"
      return (
        <SummaryCardContent
          rows={[
            { label: "Inventory", value: inventoryLabel },
            { label: "ERP", value: erpLabel },
            {
              label: "Capacity",
              value: `${state.monthlyItems.toLocaleString()} / ${state.teamSize} people (${state.capacityTracking ? state.capacityTracking.replace(/-/g, " ") : "select"})`,
            },
            {
              label: "Portal",
              value: state.brandPortalEnabled
                ? `Enabled • ${state.brandPortalData.join(", ")}`
                : "Disabled",
            },
          ]}
        />
      )
    })()
  ),
  "summary-sku": ({ state }) => (
    <SummaryCardContent
      rows={[
        { label: "Prefix", value: state.skuPrefix || "Not set" },
        {
          label: "Categories",
          value: state.skuCategories.length ? state.skuCategories.join(", ") : "None",
        },
        {
          label: "Attributes",
          value: state.skuAttributes.length ? state.skuAttributes.join(", ") : "None",
        },
        {
          label: "Production",
          value: `${state.orderMode.replace(/-/g, " ")} • ${state.itemsPerLineMode.replace(/-/g, " ")}`,
        },
      ]}
    />
  ),
  "summary-floorplan": ({ state }) => (
    <div className="space-y-3">
      {state.floors.map((floor) => {
        const cells = floor.grid.flat().filter((zone) => zone !== "unassigned").length
        const baseSqft = cells * CELL_SQFT
        const units = state.floorplanUnits === "sqft" ? "sq ft" : "sq m"
        const area = state.floorplanUnits === "sqft" ? baseSqft : Math.round(baseSqft * 0.092903)
        return (
          <div key={floor.id} className="space-y-1 text-xs">
            <p className="font-semibold text-muted-foreground">{floor.name}</p>
            <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${FLOOR_COLS}, minmax(0, 1fr))` }}>
              {floor.grid.map((row, rIdx) =>
                row.map((zone, cIdx) => (
                  <div
                    key={`summary-${floor.id}-${rIdx}-${cIdx}`}
                    className={cn("aspect-square", zonePalette.find((item) => item.id === zone)?.color ?? "bg-muted")}
                  />
                )),
              )}
            </div>
            <p className="text-muted-foreground">{area.toLocaleString()} {units} in zones</p>
          </div>
        )
      })}
    </div>
  ),
  "summary-blocks": ({ state }) => (
    <div className="text-sm text-muted-foreground">
      <p className="font-semibold text-foreground">We’ll generate:</p>
      <ul className="mt-2 list-disc pl-5">
        {buildSuggestedBlocks(state).map((block) => (
          <li key={block}>{block}</li>
        ))}
      </ul>
    </div>
  ),
}

function IndustryCard({
  title,
  description,
  active,
  onSelect,
  disabled,
  children,
}: {
  title: string
  description: string
  active: boolean
  onSelect?: () => void
  disabled?: boolean
  children?: React.ReactNode
}) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      onSelect?.()
    }
  }

  return (
    <div
      role={disabled ? undefined : "button"}
      tabIndex={disabled ? -1 : 0}
      onClick={disabled ? undefined : onSelect}
      onKeyDown={handleKeyDown}
      className={cn(
        "group relative flex h-full w-full flex-col rounded-xl border p-5 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        active
          ? "border-primary bg-primary/10 shadow-[0_12px_28px_rgba(14,116,144,0.18)]"
          : "border-border hover:border-primary/40 hover:shadow-sm",
        disabled && "cursor-not-allowed opacity-50",
      )}
      aria-pressed={active}
    >
      {active && (
        <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-2 py-1 text-[10px] font-semibold uppercase tracking-wide">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Selected
        </span>
      )}
      <div className="flex-1 space-y-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children && (
        <div className="mt-4" onClick={(event) => event.stopPropagation()}>
          {children}
        </div>
      )}
    </div>
  )
}

function LabeledInput({
  label,
  value,
  onChange,
  placeholder,
  uppercase,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  uppercase?: boolean
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-muted-foreground">{label}</label>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={uppercase ? "uppercase" : undefined}
      />
    </div>
  )
}

function ToggleRow({
  label,
  value,
  onToggle,
  trueLabel,
  falseLabel,
}: {
  label: string
  value: boolean
  onToggle: () => void
  trueLabel: string
  falseLabel: string
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2">
      <span className="text-sm font-medium">{label}</span>
      <Button variant="outline" onClick={onToggle}>
        {value ? trueLabel : falseLabel}
      </Button>
    </div>
  )
}

function SelectableCard({
  title,
  description,
  children,
  layout = "row",
  active,
  onClick,
}: {
  title: string
  description: string
  children: React.ReactNode
  layout?: "row" | "column"
  active?: boolean
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      role="presentation"
      className={cn(
        "flex h-full flex-col gap-3 rounded-xl border p-4 transition",
        active ? "border-foreground bg-card shadow" : "border-border bg-background",
        onClick && "cursor-pointer hover:border-foreground/60",
        layout === "column" ? "items-start" : "",
      )}
    >
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  )
}

function UploadDropzone({ onFileSelected, preview }: { onFileSelected: (file: File | null) => void; preview: string | null }) {
  return (
    <label className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/20 text-center transition hover:border-foreground">
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="Uploaded logo" className="h-full w-full rounded-lg object-contain p-3" />
      ) : (
        <div className="space-y-2">
          <p className="text-sm font-medium">Drag & drop logo</p>
          <p className="text-xs text-muted-foreground">or click to browse</p>
        </div>
      )}
      <input
        type="file"
        accept="image/png,image/jpeg,image/svg+xml"
        className="hidden"
        onChange={(event) => onFileSelected(event.target.files?.[0] ?? null)}
      />
    </label>
  )
}

function SliderField({
  label,
  min,
  max,
  step,
  value,
  onChange,
  formatter,
}: {
  label: string
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
  formatter: (value: number) => string
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm font-medium">
        <span>{label}</span>
        <span className="text-muted-foreground">{formatter(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-sky-500"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatter(min)}</span>
        <span>{formatter(max)}</span>
      </div>
    </div>
  )
}

function ChipSelector({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string
  options: string[]
  selected: string[]
  onToggle: (option: string) => void
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={option}
            type="button"
            variant={selected.includes(option) ? "default" : "outline"}
            onClick={() => onToggle(option)}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  )
}

interface StepStatusInfo {
  step: StepId
  firstIndex: number
  lastIndex: number
  reachable: boolean
  completed: boolean
  isActive: boolean
}

function StepBreadcrumbs({
  activeStep,
  stepStatus,
  onJump,
}: {
  activeStep: StepId
  stepStatus: StepStatusInfo[]
  onJump: (step: StepId) => void
}) {
  return (
    <nav className="flex flex-wrap gap-2 text-xs text-muted-foreground">
      {stepStatus.map(({ step, reachable, completed, isActive }) => {
        const disabled = !reachable && !isActive
        return (
          <button
            key={step}
            type="button"
            onClick={() => !disabled && onJump(step)}
            className={cn(
              "flex items-center gap-2 rounded-full border px-3 py-1 transition",
              isActive
                ? "border-foreground text-foreground"
                : completed
                  ? "border-emerald-400 text-emerald-600"
                  : disabled
                    ? "border-border/60 text-muted-foreground/60 cursor-not-allowed"
                    : "border-border",
            )}
            disabled={disabled}
          >
            <span className="font-semibold uppercase">{stepCopy[step].title}</span>
          </button>
        )
      })}
    </nav>
  )
}

function SummaryCardContent({ rows }: { rows: Array<{ label: string; value: string }> }) {
  return (
    <div className="space-y-2 text-sm">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between">
          <span className="text-muted-foreground">{row.label}</span>
          <span className="font-medium text-foreground/90 ml-4 truncate" title={row.value}>
            {row.value}
          </span>
        </div>
      ))}
    </div>
  )
}

function buildSuggestedBlocks(state: OnboardingState): string[] {
  const base = ["Executive overview", "Live capacity", "Work orders", "Alerts feed"]
  if (state.assets.includes("Tools & equipment")) base.push("Tool custody")
  if (state.assets.includes("Consumables")) base.push("Expiry tracker")
  if (state.layoutPreference === "tables") base.push("Order pipeline table")
  if (state.floors.some((floor) => floor.grid.flat().includes("production"))) base.push("Production timeline")
  if (state.floors.some((floor) => floor.grid.flat().includes("qa"))) base.push("QA queue board")
  if (state.brandPortalEnabled) base.push("Brand portal overview")
  if (state.scanningMethod === "qr") base.push("Scan kiosk")
  if (state.binsEnabled) base.push("Bin manager")
  return base
}

function handleLogoUpload(file: File | null, dispatch: React.Dispatch<OnboardingAction>) {
  if (!file) {
    dispatch({ type: "setLogo", dataUrl: null })
    return
  }
  const reader = new FileReader()
  reader.onload = (event) => {
    const result = event.target?.result
    if (typeof result === "string") {
      dispatch({ type: "setLogo", dataUrl: result })
    }
  }
  reader.readAsDataURL(file)
}

function accentToBg(accent: string) {
  switch (accent) {
    case "amber":
      return "bg-amber-500"
    case "emerald":
      return "bg-emerald-500"
    case "violet":
      return "bg-violet-500"
    default:
      return "bg-sky-500"
  }
}
