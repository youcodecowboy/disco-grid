# Items Data Model - Detailed Schema

## Overview
This document defines the complete data architecture for the item management system, addressing the relationship between orders, item profiles, line items, components, and workflows.

---

## Core Hierarchy

```
Order (published/accepted)
├── Item Code: "Aurora Jacket - M" (qty 200)
│   ├── Line Item #001 (created immediately on order acceptance)
│   │   ├── Line Component #001-A (Denim Panel - has QR)
│   │   └── Line Component #001-B (Leather Panel - has QR)
│   ├── Line Item #002 (created immediately, has QR)
│   ├── ...
│   └── Line Item #200
│
├── Item Code: "Aurora Jacket - L" (qty 200)
│   ├── Line Item #201
│   ├── ...
│   └── Line Item #400
│
└── Item Code: "Aurora Jacket - XL" (qty 100)
    ├── Line Item #401
    ├── ...
    └── Line Item #500
```

**Key Points:**
- Different sizes/colors = Different item codes (separate line items on UI)
- All line items + QR codes generated **immediately** when order is accepted
- UI aggregates for clean display, data remains granular
- Components get their own QR codes (full traceability)

---

## 1. Order

**Purpose:** Container for item profiles and order-level metadata

```typescript
type Order = {
  id: string                     // "ORD-2025-001"
  name: string                   // "Aurora Apparel Production Run"
  client: string                 // "Horizon Apparel Co."
  status: "Draft" | "Published" | "In Production" | "Completed" | "Cancelled"
  startDate: string
  shipDate: string
  contacts: string[]
  owner: string
  assignedTeam: string
  itemProfiles: ItemProfile[]    // Items in this order
  createdAt: string
  updatedAt: string
}
```

**Key Points:**
- Order contains **Item Codes** (which are item profiles with specific variants)
- When order is **accepted/published**, all line items are created immediately
- QR codes generated immediately so labels can be printed
- Line items are NOT created on-demand - they exist from order acceptance

---

## 2. Item Code (Item Profile)

**Purpose:** Defines WHAT to make and HOW to make it. This represents a specific variant (e.g., "Aurora Jacket - M") within an order. Each distinct variant gets its own item code.

```typescript
type ItemCode = {
  id: string                     // "ITEM-CODE-001"
  orderId: string                // Parent order
  
  // Basic info
  name: string                   // "Aurora Flight Jacket - Medium"
  code: string                   // "JKT-AURORA-M-001" (unique item code for this variant)
  quantity: number               // 200 (how many of THIS variant to produce)
  type: "simple" | "complex"     // Simple or has components
  summary: string
  
  // Variant differentiation (what makes this unique)
  variantAttributes: Array<{
    field: string                // "Size", "Color"
    value: string                // "Medium", "Navy Blue"
  }>
  
  // Workflow (governs production logic)
  workflow: string               // "Cut & Sew Apparel v4"
  workflowId: string             // Link to workflow definition
  
  // Attributes (global template - applies to all line items)
  attributes: Array<{
    field: string                // "Fabric", "Colorway", "Size Curve"
    value: string                // "Cordura® 210D", "Night Sky", "XS-3XL"
  }>
  
  // Components (if complex)
  componentProfiles: ComponentProfile[]
  
  // Timeline
  timeline: {
    start: string
    end: string
  }
  
  // Team & ownership
  assignedTeam: string
  owner: string
  
  // QR/Label configuration
  labelFields: string[]          // What to print on labels
  labelLogo: boolean
  
  // Traceability
  traceability: TraceabilityProfile
  
  // Attachments (specs, designs, etc.)
  attachments: Attachment[]
  
  // Tracking (updated as production progresses)
  lineItemsCompleted: number     // How many completed (0-200)
  lineItemsInProduction: number  // How many currently being worked on
  
  // QR Code generation
  qrCodesGenerated: boolean      // True when all line items + QR codes created
  qrBatchId: string              // Reference to QR code print batch
  
  createdAt: string
  updatedAt: string
  acceptedAt?: string            // When order was accepted (triggers line item creation)
}
```

**Key Points:**
- Created during order creation in order flow
- **When order is accepted:** System immediately creates all line items + QR codes
- Each distinct variant (size, color, etc.) is a separate item code
- Example: "Aurora Jacket - M" (200), "Aurora Jacket - L" (200) = 2 item codes
- Users define which attributes warrant separation (size, color = yes; fabric type = shared)

---

## 3. Line Item (Physical Unit)

**Purpose:** Represents a single physical item with unique ID and QR code. Created **immediately** when order is accepted so QR labels can be printed.

```typescript
type LineItem = {
  id: string                     // "LINE-JKT-M-001-042" (unique serial number)
  itemCodeId: string             // Links to parent item code (e.g., "Aurora Jacket - M")
  orderId: string                // Links to order
  
  // Identity
  qrCode: string                 // Unique QR code content (generated immediately)
  qrCodeUrl: string              // URL to QR code image for printing
  serialNumber: number           // 42 (this is #42 out of 200 for size M)
  fullSerialNumber: string       // "JKT-AURORA-M-042" (human-readable)
  
  // Status tracking
  status: "Not Started" | "In Production" | "Completed" | "On Hold" | "Failed QC"
  currentStage: string           // "Panel Assembly"
  currentStageProgress: number   // 0-100%
  
  // Workflow tracking (inherits from item profile, but tracked per line item)
  workflowId: string             // Inherited from item profile
  workflowStages: Array<{
    stageId: string
    stageName: string
    status: "Pending" | "In Progress" | "Completed" | "Blocked"
    startedAt?: string
    completedAt?: string
    completedBy?: string         // Worker who scanned/completed
    inputs: StageInput[]         // What was submitted at this stage
  }>
  
  // Location tracking
  currentLocation: string        // "Sewing Line A, Station 3"
  locationHistory: Array<{
    location: string
    timestamp: string
    movedBy: string
  }>
  
  // Components (if complex item)
  lineComponents: LineComponent[]
  
  // Activity log
  activityLog: ActivityEntry[]
  
  // Timestamps
  createdAt: string              // When line item was created (= order accepted time)
  startedAt?: string             // When production started (first scan)
  completedAt?: string           // When fully complete
  updatedAt: string
}
```

**Key Points:**
- Created **immediately when order is accepted** (all 200 line items for size M)
- QR codes generated immediately so labels can be printed
- Has unique ID and QR code from creation
- Tracks workflow progress individually
- Attributes inherited from ItemCode (no per-unit overrides needed - variants handled at ItemCode level)

**Creation Timing:**
- ✅ **Order Accepted** → Generate all line items + QR codes
- ✅ Labels can be printed immediately
- ✅ Production can start when ready
- ❌ No lazy/on-demand creation

---

## 4. Component Profile (Template)

**Purpose:** Defines a component within an item code (e.g., "Denim Panel", "Leather Panel"). Only relevant for `type: "complex"` items.

```typescript
type ComponentProfile = {
  id: string                     // "COMP-PROF-001"
  itemCodeId: string             // Parent item code
  
  name: string                   // "Denim Panel"
  quantity: number               // 1 per jacket (or could be 4 if jacket has 4 panels)
  
  // Workflow (can be DIFFERENT from parent item)
  workflow: string               // "Textile Processing Workflow"
  workflowId: string
  
  // Attributes (component-specific)
  attributes: Array<{
    field: string                // "Panel Type", "Dye Color"
    value: string
  }>
  
  // QR configuration
  hasQrCode: boolean             // True for most components (strongly encouraged)
  qrMode: "Per unit" | "Per batch"  // Default: "Per unit" - each component gets QR
  
  // Note: Per-unit QR codes are strongly encouraged for traceability
  // Exception: Bulk items (e.g., box of bullets as one unit)
  
  // Dependencies (what stage must complete before assembly?)
  readyForAssemblyStage: string  // "Textile Processing Complete"
  
  location: string
  digitalPassportEnabled: boolean
  
  createdAt: string
}
```

**Key Points:**
- Defined at item code level (global template)
- Can have DIFFERENT workflow than parent item
- When line item is created (on order acceptance), component profiles spawn line components
- Each component gets own QR code (default behavior - strongly encouraged)

---

## 5. Line Component (Physical Component)

**Purpose:** Physical instance of a component attached to a specific line item

```typescript
type LineComponent = {
  id: string                     // "LINE-COMP-JKT-M-042-A"
  lineItemId: string             // Parent line item
  componentProfileId: string     // Links to component template
  itemCodeId: string             // Grandparent item code
  orderId: string                // Great-grandparent order
  
  name: string                   // "Denim Panel"
  qrCode: string                 // Own QR code (strongly encouraged, default behavior)
  qrCodeUrl: string              // URL to QR code image for printing
  serialNumber: string           // "042-A" (component A of line item 42)
  fullSerialNumber: string       // "JKT-AURORA-M-042-DENIM" (human-readable)
  
  // Status tracking (independent from parent line item)
  status: "Not Started" | "In Production" | "Completed" | "Ready for Assembly"
  currentStage: string           // Current stage in component workflow
  
  // Workflow tracking (component has own workflow)
  workflowId: string             // Different from parent item's workflow
  workflowStages: Array<{
    stageId: string
    stageName: string
    status: "Pending" | "In Progress" | "Completed"
    startedAt?: string
    completedAt?: string
    completedBy?: string
    inputs: StageInput[]
  }>
  
  // Location
  currentLocation: string        // May be different from parent item
  
  // Assembly tracking
  assembledIntoParent: boolean   // False until assembly stage
  assembledAt?: string
  assembledBy?: string
  
  // Activity
  activityLog: ActivityEntry[]
  
  createdAt: string
  completedAt?: string
  updatedAt: string
}
```

**Key Points:**
- Created when parent line item is created (on order acceptance)
- Has **independent workflow** from parent
- **Gets own QR code** (default behavior - strongly encouraged for traceability)
- QR code generated immediately with parent line item
- Tracks when it's assembled into parent item
- Example: Firearm with 10 components = 10 QR codes + 1 parent QR = 11 labels printed

---

## 6. Workflow Definition

**Purpose:** Defines the stages and rules for production processes

```typescript
type Workflow = {
  id: string                     // "WF-CUT-SEW-V4"
  name: string                   // "Cut & Sew Apparel v4"
  version: string                // "v4"
  industry: string               // "Fashion Manufacturing"
  description: string
  
  stages: WorkflowStage[]
  
  // Parallel stage support (for components)
  parallelGroups?: Array<{
    name: string                 // "Component Production"
    stages: string[]             // Stage IDs that run in parallel
    mergeStage: string           // Stage where they converge (e.g., "Assembly")
  }>
  
  createdAt: string
  updatedAt: string
  isActive: boolean
}

type WorkflowStage = {
  id: string                     // "stage-cutting"
  name: string                   // "Cutting"
  order: number                  // 1, 2, 3...
  description: string            // "Cut fabric panels to pattern"
  
  // Stage requirements
  inputRequirements: InputRequirement[]
  completionRule: "all" | "any"  // All inputs required or any one?
  
  // Dependencies
  dependsOn?: string[]           // Stage IDs that must complete first
  
  // Estimated duration
  estimatedDuration?: number     // Minutes
  
  // Permissions
  allowedRoles: string[]         // Who can complete this stage
  
  // Location requirements
  requiredLocation?: string      // Must be at specific location to scan
}

type InputRequirement = {
  id: string
  type: "scan" | "form" | "photo" | "measurement" | "signature" | "file_upload"
  label: string                  // "Scan completed item"
  description?: string
  required: boolean
  
  // For type="form"
  formSchema?: FormField[]
  
  // For type="photo"
  photoConfig?: {
    minCount: number             // Min # of photos
    maxCount: number             // Max # of photos
    requireGPS: boolean          // Require location metadata
  }
  
  // For type="measurement"
  measurementConfig?: {
    fields: Array<{
      name: string               // "Length", "Width"
      unit: string               // "cm", "inches"
      min?: number
      max?: number
    }>
  }
  
  // Validations
  validations?: Validation[]
}

type FormField = {
  id: string
  label: string
  type: "text" | "number" | "select" | "checkbox" | "date"
  required: boolean
  options?: string[]             // For type="select"
  defaultValue?: string
  validation?: Validation
}

type Validation = {
  rule: "min" | "max" | "regex" | "fileSize" | "custom"
  value: any
  errorMessage: string
}
```

**Key Points:**
- Workflows are reusable across many items
- Stages have flexible input requirements (scan, form, photo, etc.)
- Supports parallel stages (for components)
- Can enforce location, role, and dependency requirements

---

## 7. Stage Input (Captured Data)

**Purpose:** Records what was submitted when completing a stage

```typescript
type StageInput = {
  id: string
  stageId: string                // Which stage
  lineItemId: string             // Which line item (or component)
  inputRequirementId: string     // Which requirement was fulfilled
  
  // Captured data (varies by type)
  type: "scan" | "form" | "photo" | "measurement" | "signature"
  data: any                      // JSON blob of captured data
  
  // For type="scan"
  scanData?: {
    qrCode: string
    timestamp: string
    gps?: { lat: number; lon: number }
  }
  
  // For type="form"
  formData?: Record<string, any>
  
  // For type="photo"
  photoData?: {
    urls: string[]               // Photo URLs
    thumbnails: string[]
    gps?: { lat: number; lon: number }
  }
  
  // For type="measurement"
  measurementData?: Record<string, number>
  
  // Metadata
  submittedBy: string            // User ID
  submittedAt: string
  deviceInfo?: {
    deviceId: string
    platform: "mobile" | "desktop"
    online: boolean              // Was it submitted offline?
  }
}
```

**Key Points:**
- Captures all data submitted at each stage
- Flexible schema for different input types
- Tracks offline submissions

---

## Workflow-Item Interaction

### Example: Hybrid Jacket with Components

**Item Profile:**
- Name: "Hybrid Jacket"
- Quantity: 100
- Workflow: "Complex Assembly Workflow"
- Components:
  - Component Profile A: "Denim Panel" → Workflow: "Textile Processing"
  - Component Profile B: "Leather Panel" → Workflow: "Leather Processing"

**When Line Item #042 is created:**
1. System creates `LineItem #042` (parent jacket)
2. System creates `LineComponent #042-A` (denim panel)
3. System creates `LineComponent #042-B` (leather panel)
4. Each has own workflow tracking

**Production Flow:**
1. Worker at textile station scans denim panel QR → `#042-A`
   - Shows "Textile Processing" workflow
   - Worker completes: Cutting → Sewing → Dyeing
   - Component status: "Ready for Assembly"

2. Worker at leather station scans leather panel QR → `#042-B`
   - Shows "Leather Processing" workflow
   - Worker completes: Tanning → Cutting → Edging
   - Component status: "Ready for Assembly"

3. Worker at assembly station scans parent jacket QR → `#042`
   - System checks: Are all components ready?
   - Denim panel: ✅ Ready
   - Leather panel: ✅ Ready
   - Allows worker to complete "Assembly" stage
   - Marks both components as `assembledIntoParent: true`

4. Parent item continues through remaining stages:
   - Finishing
   - QC
   - Packing

---

## Data Relationships

```
Order
  └── ItemCode (1:many) - One per variant (size, color, etc.)
      ├── ComponentProfile (1:many) - Defined in order flow
      └── LineItem (1:many) - Created immediately on order acceptance
          └── LineComponent (1:many) - Created with parent line item
              └── References ComponentProfile

Workflow (reusable)
  └── WorkflowStage (1:many)
      └── InputRequirement (1:many)

LineItem (created immediately on order acceptance)
  └── WorkflowStages (copies from Workflow, tracks progress)
      └── StageInput (captures submitted data)

LineComponent (created with parent line item)
  └── WorkflowStages (different workflow from parent)
      └── StageInput

UI Display Hierarchy (Items Page):
- Level 1: Shows ItemCode rows (not individual line items)
  - "Aurora Jacket - M" (200 units) - ONE ROW
  - "Aurora Jacket - L" (200 units) - ONE ROW
- Level 2: Click into ItemCode → See all 200 line items
  - LINE-JKT-M-001, LINE-JKT-M-002, etc.
- Level 3: Click line item → See full details + components
```

---

## Confirmed Decisions (Based on User Requirements):

### ✅ **1. Line Items Created Immediately on Order Acceptance**
- When order status changes to "Accepted/Published"
- System generates ALL line items + QR codes instantly
- Labels can be printed right away
- No lazy creation, no on-demand generation

### ✅ **2. Variant Handling - Separate Item Codes**
- Different sizes/colors = Different item codes
- "Aurora Jacket - M" (200 units) = 1 item code
- "Aurora Jacket - L" (200 units) = 1 item code
- User defines which attributes warrant separation during order creation
- UI shows one row per item code on Items Page

### ✅ **3. Component QR Codes - Strongly Encouraged**
- Default: Every component gets own QR code
- Example: Firearm with 10 components = 10 component QR codes + 1 parent = 11 labels
- Exception: Bulk items (box of bullets = one unit)
- Volume is encouraged (usage-based pricing model)

### ✅ **4. Workflow Merging**
- Components have independent workflows until assembly
- Assembly is a stage in parent workflow that requires all components complete
- System checks component readiness before allowing assembly completion

### ✅ **5. Offline Sync Strategy**
- Floor app works fully offline
- Actions queued locally (IndexedDB)
- Auto-sync when connection restored
- Hardware shipped to factories for reliable operation

---

## Implementation Notes:

### Order Acceptance Flow:
```typescript
async function acceptOrder(orderId: string) {
  const order = await getOrder(orderId)
  
  // For each item code in order
  for (const itemCode of order.itemCodes) {
    // Generate all line items
    for (let i = 1; i <= itemCode.quantity; i++) {
      const lineItem = createLineItem(itemCode, i)
      
      // Generate components if complex
      if (itemCode.type === "complex") {
        for (const compProfile of itemCode.componentProfiles) {
          const lineComp = createLineComponent(lineItem, compProfile)
          await generateQRCode(lineComp) // Generate component QR
        }
      }
      
      await generateQRCode(lineItem) // Generate line item QR
    }
  }
  
  // Mark order as ready for production
  order.status = "Accepted"
  order.qrCodesGenerated = true
  
  // Trigger label printing
  await sendToLabelPrinter(order)
}
```

### UI Display Strategy:
- **Items Page (Level 1):** Shows item codes, not line items (clean view)
- **Item View (Level 2):** Click item code → See all line items for that code
- **Line Item Details (Level 3):** Click line item → Full details + components

This keeps the UI manageable while maintaining full granularity in the data layer.
