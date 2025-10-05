# Workflow V2: Manual Visual Builder — 05/10/25

## Mission
- Transform workflow creation from AI-only templating to a powerful manual visual builder where users construct workflows by placing and connecting stage blocks on a grid canvas.
- Provide a flowchart-like experience where workflows become living visual diagrams that govern how items move through production stages.
- Enable deep configuration of each stage with inputs, outputs, timing rules, team assignments, conditional logic, and sequential/async execution patterns.
- Build workflows that become the governing ruleset for items assigned to them, ensuring every production unit follows the defined path from start to finish.
- Support industry-agnostic workflows: fashion manufacturing (cutting → sewing → washing → finishing), construction (framing → electrical → plumbing → inspection), defense (assembly → testing → certification → packaging).

## Vision: Workflows as Visual Operating Systems

Workflows in Groovy Grid V2 are **visual operating systems** for manufacturing and operational processes. Instead of abstract text configurations, workflows are:
- **Visual Flowcharts**: Beautiful node-based diagrams with stages as cards and connections as arrows
- **Interactive Builders**: Drag-and-drop stage creation with live connection drawing
- **Rule Engines**: Each stage defines inputs, outputs, timing, teams, and conditional logic
- **Execution Paths**: Items follow the visual path, moving through stages as defined by the diagram
- **Domain-Agnostic Templates**: Same system works for denim, t-shirts, construction, aerospace, or any sequential/parallel process

## Core Philosophy

### 1. Workflows Are Stages + Connections
A workflow is composed of:
- **Stages** (nodes): Individual process steps (e.g., "Cutting", "Sewing", "QA Check")
- **Connections** (edges): Arrows showing the flow between stages
- **Rules**: Logic governing how items move through the workflow
- **Metadata**: Timing, team assignments, locations, instructions

### 2. Sequential vs. Asynchronous Execution
- **Sequential**: Steps must happen in order (e.g., cut before sew before wash)
- **Asynchronous**: Steps can happen in any order once prerequisites are met (e.g., attach button or back patch after sewing)
- **Conditional**: Steps trigger based on item attributes (e.g., only wash denim, not t-shirts)
- **Parallel**: Multiple stages can execute simultaneously (e.g., QA inspection while packaging)

### 3. Inputs and Outputs Govern Stages
Each stage has **entry conditions** (inputs) and **exit conditions** (outputs):
- **Input Example**: Scan QR code to begin stage
- **Output Example**: Fill form with measurements to complete stage
- **Validation**: Stage cannot complete until all output requirements are met
- **Tracking**: System records timestamps, user actions, and data captured at each stage

## Workflow Builder UX

### Page Layout: `/app/workflows/page.tsx`

```typescript
interface WorkflowsPageV2 {
  // Three-column layout
  sidebar: WorkflowLibrary        // Left: saved workflows, templates, search
  canvas: WorkflowCanvas          // Center: visual builder with grid and stage blocks
  inspector: StageInspector       // Right: selected stage configuration panel
}
```

### Layout Structure
```
┌─────────────────────────────────────────────────────────────────┐
│ Header: Search | New Workflow | Save | Publish | Run             │
├─────────┬─────────────────────────────────────────┬──────────────┤
│         │                                         │              │
│ Library │         Canvas / Grid Surface           │  Inspector   │
│         │                                         │              │
│ Saved:  │   ┌─────────┐        ┌─────────┐      │  Stage Name  │
│ ◉ Denim │   │ Cutting │──────▶ │ Sewing  │      │  ──────────  │
│ ◉ Tees  │   │ Stage   │        │ Stage   │      │              │
│ ◉ Jeans │   └─────────┘        └─────────┘      │  [Config]    │
│         │        │                   │           │  [Inputs]    │
│ Add:    │        │                   │           │  [Outputs]   │
│ + Stage │        ▼                   ▼           │  [Team]      │
│ + Block │   ┌─────────┐        ┌─────────┐      │  [Timing]    │
│         │   │ Washing │        │Finishing│      │              │
│         │   └─────────┘        └─────────┘      │              │
│         │                                         │              │
└─────────┴─────────────────────────────────────────┴──────────────┘
```

## Stage Block Architecture

### Stage Block Component

```typescript
interface WorkflowStage {
  id: string
  workflowId: string
  
  // Core identity
  name: string                      // "Cutting", "Sewing", "QA Check"
  description: string
  type: StageType
  icon?: string
  color?: string                    // Visual differentiation
  
  // Position on canvas
  position: {
    x: number                       // Grid X coordinate
    y: number                       // Grid Y coordinate
    w: number                       // Width in grid units (default: 3)
    h: number                       // Height in grid units (default: 4)
  }
  
  // Execution rules
  executionType: "sequential" | "async" | "parallel"
  sequencePosition?: number         // Only for sequential stages
  prerequisites: string[]           // Stage IDs that must complete first
  allowSkip: boolean                // Can this stage be skipped?
  isOptional: boolean
  
  // Conditional logic
  conditions?: StageCondition[]     // When does this stage apply?
  
  // Inputs (entry requirements)
  inputs: StageInput[]
  
  // Outputs (exit requirements)
  outputs: StageOutput[]
  
  // Team & location
  assignedTeam?: string             // Team ID
  assignedRole?: string             // "Cutter", "Sewer", "QA Inspector"
  location?: string                 // Physical location
  workstation?: string              // Specific machine or area
  
  // Timing
  estimatedDuration: number         // Minutes
  maxDuration?: number              // SLA deadline
  buffer?: number                   // Extra time allowed
  
  // Instructions & notes
  instructions: string              // Step-by-step guide
  safetyNotes?: string
  qualityStandards?: string
  attachments?: Attachment[]        // Images, PDFs, videos
  
  // Notifications
  notifications: NotificationRule[]
  
  // Quality control
  qcRequired: boolean
  qcCriteria?: QCCriteria[]
  
  // Status tracking
  status: "draft" | "published" | "archived"
  
  // Metadata
  createdAt: string
  updatedAt: string
  createdBy: string
  version: number
}

type StageType = 
  | "process"      // Standard work step
  | "decision"     // QC gate or approval
  | "input"        // Data collection point
  | "output"       // Completion checkpoint
  | "wait"         // Time delay or external trigger
  | "automation"   // Automated action

type StageCondition = {
  field: string                     // Item attribute to check
  operator: "equals" | "contains" | "greater" | "less"
  value: any
  logic?: "AND" | "OR"
}

// Example: Only apply washing stage to denim items
// { field: "material", operator: "equals", value: "denim" }
```

### Stage Inputs (Entry Requirements)

```typescript
type StageInput = {
  id: string
  type: InputType
  label: string
  description?: string
  required: boolean
  validation?: ValidationRule[]
}

type InputType = 
  | "qr-scan"           // Scan item QR code
  | "barcode-scan"      // Scan barcode
  | "rfid-scan"         // RFID tag read
  | "photo"             // Take photo
  | "text"              // Enter text
  | "number"            // Enter number
  | "select"            // Choose from options
  | "checkbox"          // Yes/No toggle
  | "signature"         // Digital signature
  | "timestamp"         // Auto-capture time
  | "location"          // GPS or manual location
  | "approval"          // Manager approval

// Examples:
const cuttingInput: StageInput = {
  id: "cut-001",
  type: "qr-scan",
  label: "Scan fabric roll QR code",
  required: true
}

const sewingInput: StageInput = {
  id: "sew-001",
  type: "photo",
  label: "Photo of cut pieces before sewing",
  required: false
}
```

### Stage Outputs (Exit Requirements)

```typescript
type StageOutput = {
  id: string
  type: OutputType
  label: string
  description?: string
  required: boolean
  options?: string[]            // For select/radio outputs
  validation?: ValidationRule[]
}

type OutputType = 
  | "qr-scan"           // Scan to mark complete
  | "form"              // Fill out form
  | "measurement"       // Record measurements
  | "photo"             // Take completion photo
  | "signature"         // Sign off
  | "count"             // Count items
  | "weight"            // Weigh items
  | "timestamp"         // Auto-complete time
  | "approval"          // Get approval
  | "notes"             // Add notes

// Examples:
const cuttingOutput: StageOutput = {
  id: "cut-out-001",
  type: "measurement",
  label: "Record cut piece dimensions",
  required: true
}

const finishingOutput: StageOutput = {
  id: "finish-out-001",
  type: "form",
  label: "Quality inspection checklist",
  required: true,
  options: ["Pass", "Fail", "Rework"]
}
```

### Workflow Connections

```typescript
type WorkflowConnection = {
  id: string
  workflowId: string
  
  fromStageId: string
  toStageId: string
  
  // Connection type
  type: ConnectionType
  
  // Conditional routing
  condition?: StageCondition
  label?: string                // Display label on arrow
  
  // Visual styling
  style: "solid" | "dashed" | "dotted"
  color?: string
  thickness?: number
  
  // Priority (for multiple connections from same stage)
  priority: number
}

type ConnectionType = 
  | "sequential"        // A must complete before B starts
  | "parallel"          // A and B can run simultaneously
  | "conditional"       // A → B only if condition met
  | "fallback"          // A → B if main path fails

// Example: Sequential connection
{
  fromStageId: "cutting-001",
  toStageId: "sewing-001",
  type: "sequential",
  style: "solid"
}

// Example: Conditional connection
{
  fromStageId: "sewing-001",
  toStageId: "washing-001",
  type: "conditional",
  condition: { field: "material", operator: "equals", value: "denim" },
  label: "If denim",
  style: "dashed"
}
```

## Workflow Builder Features

### 1. Stage Library Panel (Left Sidebar)

```typescript
interface StageLibraryPanel {
  // Saved workflows
  workflows: SavedWorkflow[]
  
  // Stage templates
  templates: StageTemplate[]
  
  // Quick add buttons
  addStageButton: () => void
  
  // Categories
  categories: {
    process: StageTemplate[]
    quality: StageTemplate[]
    data: StageTemplate[]
    approval: StageTemplate[]
  }
}

type StageTemplate = {
  id: string
  name: string
  icon: string
  color: string
  defaultConfig: Partial<WorkflowStage>
}

// Stage templates
const templates: StageTemplate[] = [
  {
    id: "tpl-cutting",
    name: "Cutting",
    icon: "scissors",
    color: "blue",
    defaultConfig: {
      type: "process",
      estimatedDuration: 15,
      inputs: [{ type: "qr-scan", label: "Scan fabric", required: true }],
      outputs: [{ type: "measurement", label: "Cut dimensions", required: true }]
    }
  },
  {
    id: "tpl-qc",
    name: "QC Check",
    icon: "check-circle",
    color: "green",
    defaultConfig: {
      type: "decision",
      qcRequired: true,
      outputs: [{ type: "approval", label: "Pass/Fail", required: true }]
    }
  },
  // ... more templates
]
```

### 2. Canvas Grid Surface (Center)

```typescript
interface WorkflowCanvas {
  // Grid configuration
  gridConfig: {
    columns: 12
    rowHeight: 40
    gap: 8
  }
  
  // Workflow being edited
  workflow: Workflow
  stages: WorkflowStage[]
  connections: WorkflowConnection[]
  
  // Interaction state
  mode: "view" | "edit" | "connect"
  selectedStageId?: string
  draggedStageId?: string
  connectionStart?: { stageId: string; anchor: "top" | "right" | "bottom" | "left" }
  
  // Actions
  addStage: (template: StageTemplate, position: { x: number; y: number }) => void
  updateStage: (stageId: string, updates: Partial<WorkflowStage>) => void
  deleteStage: (stageId: string) => void
  moveStage: (stageId: string, position: { x: number; y: number }) => void
  
  connectStages: (from: string, to: string, type: ConnectionType) => void
  deleteConnection: (connectionId: string) => void
}
```

**Canvas Features:**
- **Grid Background**: Visual 12-column grid with 40px rows
- **Drag & Drop**: Drag stage templates from library to canvas
- **Stage Cards**: Visual blocks showing stage name, icon, type, and status
- **Connection Drawing**: Click stage → click target to draw arrow
- **Auto-Layout**: Option to automatically arrange stages in optimal layout
- **Zoom & Pan**: Canvas can zoom in/out and pan for large workflows
- **Minimap**: Small overview map for navigation

### 3. Stage Inspector Panel (Right Sidebar)

```typescript
interface StageInspectorPanel {
  selectedStage?: WorkflowStage
  
  // Configuration tabs
  tabs: {
    basic: BasicConfigTab
    inputs: InputsConfigTab
    outputs: OutputsConfigTab
    team: TeamConfigTab
    timing: TimingConfigTab
    conditions: ConditionsConfigTab
    notifications: NotificationsConfigTab
  }
}

type BasicConfigTab = {
  name: string
  description: string
  type: StageType
  executionType: "sequential" | "async" | "parallel"
  icon: string
  color: string
}

type InputsConfigTab = {
  inputs: StageInput[]
  addInput: (input: StageInput) => void
  removeInput: (id: string) => void
  reorderInputs: (order: string[]) => void
}

type OutputsConfigTab = {
  outputs: StageOutput[]
  addOutput: (output: StageOutput) => void
  removeOutput: (id: string) => void
  reorderOutputs: (order: string[]) => void
}

type TeamConfigTab = {
  assignedTeam?: string
  assignedRole?: string
  location?: string
  workstation?: string
  requiredSkills?: string[]
  preferredWorkers?: string[]
}

type TimingConfigTab = {
  estimatedDuration: number
  maxDuration?: number
  buffer?: number
  slaAlerts?: boolean
  overtimeRules?: string
}

type ConditionsConfigTab = {
  conditions: StageCondition[]
  addCondition: () => void
  removeCondition: (index: number) => void
  logicOperator: "AND" | "OR"
}

type NotificationsConfigTab = {
  notifications: NotificationRule[]
  addNotification: () => void
  removeNotification: (id: string) => void
}
```

**Inspector Features:**
- **Tabbed Interface**: Organize configuration by category
- **Live Preview**: Changes reflect immediately on canvas
- **Validation**: Real-time validation of inputs/outputs
- **Templates**: Save configured stages as templates
- **Help Text**: Contextual help for each field

## Visual Design System

### Stage Block Visual Design

```typescript
interface StageBlockVisual {
  // Container
  card: {
    width: "calc((w / 12) * 100% - 8px)"
    height: "(h * 40 - 8)px"
    borderRadius: "12px"
    shadow: "0 2px 8px rgba(0,0,0,0.1)"
    border: "2px solid"
    borderColor: statusColor
  }
  
  // Header
  header: {
    icon: string                    // Stage type icon
    name: string                    // Stage name
    badge: string                   // Sequential position or type
    color: themeColor
  }
  
  // Body
  body: {
    inputs: InputIndicator[]        // Visual list of inputs
    outputs: OutputIndicator[]      // Visual list of outputs
    estimatedTime: string           // "~15 min"
    team: TeamBadge                 // Assigned team
  }
  
  // Footer
  footer: {
    status: StatusBadge             // Draft, Published, Active
    connections: ConnectionAnchors  // Top, Right, Bottom, Left anchors
  }
  
  // Connection anchors (for drawing arrows)
  anchors: {
    top: { x: "50%", y: "0%" }
    right: { x: "100%", y: "50%" }
    bottom: { x: "50%", y: "100%" }
    left: { x: "0%", y: "50%" }
  }
}
```

### Stage Colors by Type

```typescript
const stageTypeColors = {
  process: {
    bg: "bg-blue-50",
    border: "border-blue-500",
    text: "text-blue-900",
    icon: "text-blue-600"
  },
  decision: {
    bg: "bg-orange-50",
    border: "border-orange-500",
    text: "text-orange-900",
    icon: "text-orange-600"
  },
  input: {
    bg: "bg-purple-50",
    border: "border-purple-500",
    text: "text-purple-900",
    icon: "text-purple-600"
  },
  output: {
    bg: "bg-green-50",
    border: "border-green-500",
    text: "text-green-900",
    icon: "text-green-600"
  },
  wait: {
    bg: "bg-gray-50",
    border: "border-gray-500",
    text: "text-gray-900",
    icon: "text-gray-600"
  },
  automation: {
    bg: "bg-pink-50",
    border: "border-pink-500",
    text: "text-pink-900",
    icon: "text-pink-600"
  }
}
```

### Connection Arrow Design

```typescript
interface ConnectionArrow {
  // SVG path
  path: string                      // Curved bezier path
  
  // Styling
  stroke: string                    // Color
  strokeWidth: number               // Thickness
  strokeDasharray?: string          // Dashed/dotted patterns
  
  // Arrowhead
  markerEnd: "arrow"
  
  // Label (optional)
  label?: {
    text: string
    position: { x: number; y: number }
    background: string
  }
  
  // Hover state
  hover: {
    stroke: "blue"
    strokeWidth: strokeWidth + 1
    cursor: "pointer"
  }
}

// Arrow styles
const connectionStyles = {
  sequential: {
    stroke: "#3b82f6",              // blue
    strokeWidth: 2,
    strokeDasharray: "none"
  },
  parallel: {
    stroke: "#10b981",              // green
    strokeWidth: 2,
    strokeDasharray: "none"
  },
  conditional: {
    stroke: "#f59e0b",              // orange
    strokeWidth: 2,
    strokeDasharray: "5,5"
  },
  fallback: {
    stroke: "#6b7280",              // gray
    strokeWidth: 2,
    strokeDasharray: "2,2"
  }
}
```

## Workflow Creation Flow

### Step 1: Create New Workflow

```typescript
type WorkflowMetadata = {
  name: string                      // "Denim Manufacturing Workflow"
  description: string
  industry: string                  // "Fashion", "Construction", "Defense"
  category: string                  // "Manufacturing", "QA", "Shipping"
  tags: string[]
  version: string
  status: "draft" | "published" | "archived"
}

// User clicks "New Workflow" button
// Modal appears:
{
  title: "Create New Workflow",
  fields: [
    { type: "text", label: "Workflow Name", required: true },
    { type: "textarea", label: "Description" },
    { type: "select", label: "Industry", options: industries },
    { type: "tags", label: "Tags" }
  ]
}
```

### Step 2: Add Stages

**Method 1: Drag from Library**
1. User drags stage template from left panel
2. Drops onto canvas grid
3. Stage appears at drop location
4. Inspector opens with stage config

**Method 2: Quick Add Button**
1. User clicks "+ Add Stage" button
2. Dropdown shows stage templates
3. User selects template
4. Stage appears in next available position
5. Inspector opens with stage config

**Method 3: Duplicate Existing**
1. User right-clicks existing stage
2. Selects "Duplicate"
3. Copy appears next to original
4. User can modify as needed

### Step 3: Configure Stages

**Using Inspector Panel:**
1. Click stage to select
2. Inspector shows configuration tabs
3. User fills out:
   - Basic info (name, description, type)
   - Inputs (what's required to start)
   - Outputs (what's required to complete)
   - Team assignment
   - Timing estimates
   - Conditional logic
   - Notifications

### Step 4: Connect Stages

**Method 1: Click-to-Connect**
1. User clicks "Connect Mode" button
2. Clicks source stage (highlights connection anchors)
3. Clicks target stage
4. Arrow drawn automatically
5. Connection inspector opens to set type

**Method 2: Drag Connection**
1. User hovers over stage (connection anchors appear)
2. Drags from anchor point
3. Drops on target stage anchor
4. Arrow drawn, inspector opens

**Method 3: Context Menu**
1. Right-click stage
2. Select "Connect to..."
3. List of available stages appears
4. Select target, arrow drawn

### Step 5: Set Execution Rules

**Sequential Stages:**
- Stages connected in sequence auto-number (1, 2, 3...)
- Arrows show "solid" lines
- System enforces order at runtime

**Async Stages:**
- Stages not connected in sequence can run in any order
- Arrows show "dashed" lines
- System allows parallel execution

**Conditional Stages:**
- Set conditions in inspector
- Arrows labeled with condition (e.g., "If Denim")
- System evaluates condition at runtime

**Parallel Stages:**
- Multiple arrows from one stage
- All targets can run simultaneously
- System waits for all to complete before next sequential stage

### Step 6: Save & Publish

```typescript
type WorkflowVersion = {
  workflowId: string
  version: number
  status: "draft" | "published" | "archived"
  
  // Validation
  isValid: boolean
  validationErrors: ValidationError[]
  
  // Publishing
  publishedAt?: string
  publishedBy?: string
  
  // Usage tracking
  assignedToItems: string[]         // Item IDs using this workflow
  completionStats: WorkflowStats
}

// Save as draft
workflow.save("draft")

// Validate before publishing
const validation = workflow.validate()
if (validation.errors.length > 0) {
  // Show errors to user
  showErrors(validation.errors)
} else {
  // Publish workflow
  workflow.publish()
}
```

## Example Workflows

### Example 1: Denim Manufacturing Workflow

```typescript
const denimWorkflow: Workflow = {
  id: "wf-denim-001",
  name: "Denim Manufacturing Workflow",
  description: "Complete denim production from cutting to packaging",
  industry: "Fashion Manufacturing",
  
  stages: [
    {
      id: "stage-001",
      name: "Fabric Inspection",
      type: "input",
      position: { x: 1, y: 1, w: 3, h: 4 },
      inputs: [
        { type: "qr-scan", label: "Scan fabric roll", required: true }
      ],
      outputs: [
        { type: "form", label: "Fabric quality report", required: true }
      ],
      executionType: "sequential",
      sequencePosition: 1,
      estimatedDuration: 10
    },
    {
      id: "stage-002",
      name: "Cutting",
      type: "process",
      position: { x: 5, y: 1, w: 3, h: 4 },
      inputs: [
        { type: "qr-scan", label: "Scan cutting order", required: true }
      ],
      outputs: [
        { type: "measurement", label: "Cut piece dimensions", required: true },
        { type: "photo", label: "Photo of cut pieces", required: false }
      ],
      executionType: "sequential",
      sequencePosition: 2,
      assignedTeam: "cutting-team",
      assignedRole: "Cutter",
      estimatedDuration: 20
    },
    {
      id: "stage-003",
      name: "Sewing",
      type: "process",
      position: { x: 1, y: 6, w: 3, h: 4 },
      inputs: [
        { type: "qr-scan", label: "Scan cut pieces", required: true }
      ],
      outputs: [
        { type: "form", label: "Sewing completion checklist", required: true },
        { type: "photo", label: "Photo of sewn garment", required: true }
      ],
      executionType: "sequential",
      sequencePosition: 3,
      assignedTeam: "sewing-team",
      assignedRole: "Sewer",
      estimatedDuration: 45
    },
    {
      id: "stage-004",
      name: "Washing",
      type: "process",
      position: { x: 5, y: 6, w: 3, h: 4 },
      inputs: [
        { type: "qr-scan", label: "Scan garment", required: true }
      ],
      outputs: [
        { type: "timestamp", label: "Wash completion time", required: true }
      ],
      executionType: "sequential",
      sequencePosition: 4,
      conditions: [
        { field: "requiresWashing", operator: "equals", value: true }
      ],
      assignedTeam: "washing-team",
      estimatedDuration: 60
    },
    {
      id: "stage-005",
      name: "Finishing - Attach Buttons",
      type: "process",
      position: { x: 1, y: 11, w: 3, h: 4 },
      inputs: [
        { type: "qr-scan", label: "Scan garment", required: true }
      ],
      outputs: [
        { type: "photo", label: "Photo of button attachment", required: true }
      ],
      executionType: "async",                    // Can happen before or after back patch
      prerequisites: ["stage-004"],              // Must happen after washing
      assignedTeam: "finishing-team",
      estimatedDuration: 15
    },
    {
      id: "stage-006",
      name: "Finishing - Attach Back Patch",
      type: "process",
      position: { x: 5, y: 11, w: 3, h: 4 },
      inputs: [
        { type: "qr-scan", label: "Scan garment", required: true }
      ],
      outputs: [
        { type: "photo", label: "Photo of back patch", required: true }
      ],
      executionType: "async",                    // Can happen before or after buttons
      prerequisites: ["stage-004"],              // Must happen after washing
      assignedTeam: "finishing-team",
      estimatedDuration: 15
    },
    {
      id: "stage-007",
      name: "Final QC",
      type: "decision",
      position: { x: 3, y: 16, w: 3, h: 4 },
      inputs: [
        { type: "qr-scan", label: "Scan garment", required: true }
      ],
      outputs: [
        { type: "approval", label: "Pass/Fail/Rework", required: true, options: ["Pass", "Fail", "Rework"] },
        { type: "notes", label: "QC notes", required: false }
      ],
      executionType: "sequential",
      sequencePosition: 5,
      prerequisites: ["stage-005", "stage-006"], // Must happen after both finishing stages
      qcRequired: true,
      assignedTeam: "qa-team",
      assignedRole: "QA Inspector",
      estimatedDuration: 10
    },
    {
      id: "stage-008",
      name: "Packaging",
      type: "output",
      position: { x: 3, y: 21, w: 3, h: 4 },
      inputs: [
        { type: "qr-scan", label: "Scan garment", required: true }
      ],
      outputs: [
        { type: "count", label: "Items in package", required: true },
        { type: "qr-scan", label: "Scan shipping label", required: true }
      ],
      executionType: "sequential",
      sequencePosition: 6,
      assignedTeam: "packaging-team",
      estimatedDuration: 5
    }
  ],
  
  connections: [
    { fromStageId: "stage-001", toStageId: "stage-002", type: "sequential" },
    { fromStageId: "stage-002", toStageId: "stage-003", type: "sequential" },
    { fromStageId: "stage-003", toStageId: "stage-004", type: "conditional", 
      condition: { field: "requiresWashing", operator: "equals", value: true } },
    { fromStageId: "stage-004", toStageId: "stage-005", type: "parallel" },
    { fromStageId: "stage-004", toStageId: "stage-006", type: "parallel" },
    { fromStageId: "stage-005", toStageId: "stage-007", type: "sequential" },
    { fromStageId: "stage-006", toStageId: "stage-007", type: "sequential" },
    { fromStageId: "stage-007", toStageId: "stage-008", type: "sequential" }
  ]
}
```

**Visual Representation:**
```
Fabric Inspection → Cutting → Sewing → Washing → ┌─ Attach Buttons ──┐
                                                   │                   │
                                                   └─ Attach Back Patch ┘
                                                   │                   │
                                                   └──── Final QC ─────┘
                                                            │
                                                        Packaging
```

### Example 2: T-Shirt Workflow (No Washing)

```typescript
const tshirtWorkflow: Workflow = {
  id: "wf-tshirt-001",
  name: "T-Shirt Manufacturing Workflow",
  description: "T-shirt production without washing stage",
  industry: "Fashion Manufacturing",
  
  stages: [
    { name: "Fabric Inspection", sequencePosition: 1 },
    { name: "Cutting", sequencePosition: 2 },
    { name: "Sewing", sequencePosition: 3 },
    { name: "Screen Printing", sequencePosition: 4 },  // Instead of washing
    { name: "Folding", sequencePosition: 5 },
    { name: "Final QC", sequencePosition: 6 },
    { name: "Packaging", sequencePosition: 7 }
  ]
}
```

## Runtime Execution

### Item Assignment to Workflow

```typescript
type ItemWorkflowAssignment = {
  itemId: string
  workflowId: string
  workflowVersion: number
  
  // Current state
  currentStageId?: string
  currentStageStatus: "not-started" | "in-progress" | "completed" | "blocked"
  
  // Stage completion tracking
  stageCompletions: StageCompletion[]
  
  // Overall progress
  progress: number                  // 0-100%
  startedAt?: string
  completedAt?: string
  
  // Performance metrics
  estimatedCompletionTime: string
  actualCompletionTime?: string
  isOnTime: boolean
  isLate: boolean
  delayMinutes?: number
}

type StageCompletion = {
  stageId: string
  status: "pending" | "in-progress" | "completed" | "skipped" | "failed"
  
  // Timestamps
  startedAt?: string
  completedAt?: string
  duration?: number                 // Minutes
  
  // User who performed stage
  completedBy?: string
  
  // Captured data
  inputs: Record<string, any>       // Input data captured
  outputs: Record<string, any>      // Output data captured
  
  // Photos/attachments
  photos: string[]                  // URLs
  attachments: string[]             // URLs
  
  // Notes
  notes?: string
  issues?: string[]
}
```

### Stage Execution Rules

```typescript
class WorkflowEngine {
  // Check if stage can start
  canStartStage(itemId: string, stageId: string): boolean {
    const item = getItem(itemId)
    const workflow = getWorkflow(item.workflowId)
    const stage = workflow.stages.find(s => s.id === stageId)
    
    // Check prerequisites
    if (stage.prerequisites.length > 0) {
      const allPrereqsComplete = stage.prerequisites.every(prereqId => {
        return item.stageCompletions.find(sc => 
          sc.stageId === prereqId && sc.status === "completed"
        )
      })
      if (!allPrereqsComplete) return false
    }
    
    // Check conditions
    if (stage.conditions && stage.conditions.length > 0) {
      const conditionsMet = stage.conditions.every(condition => {
        return evaluateCondition(item, condition)
      })
      if (!conditionsMet) return false
    }
    
    // Check sequential order
    if (stage.executionType === "sequential" && stage.sequencePosition) {
      const previousSequence = stage.sequencePosition - 1
      if (previousSequence > 0) {
        const previousStage = workflow.stages.find(s => 
          s.sequencePosition === previousSequence
        )
        if (previousStage) {
          const previousComplete = item.stageCompletions.find(sc =>
            sc.stageId === previousStage.id && sc.status === "completed"
          )
          if (!previousComplete) return false
        }
      }
    }
    
    return true
  }
  
  // Get available next stages
  getAvailableStages(itemId: string): WorkflowStage[] {
    const item = getItem(itemId)
    const workflow = getWorkflow(item.workflowId)
    
    return workflow.stages.filter(stage => {
      // Skip completed stages
      const completion = item.stageCompletions.find(sc => sc.stageId === stage.id)
      if (completion && completion.status === "completed") return false
      
      // Check if can start
      return this.canStartStage(itemId, stage.id)
    })
  }
  
  // Start stage
  startStage(itemId: string, stageId: string, userId: string): void {
    const item = getItem(itemId)
    const stage = getStage(stageId)
    
    // Validate can start
    if (!this.canStartStage(itemId, stageId)) {
      throw new Error("Cannot start stage: prerequisites not met")
    }
    
    // Create stage completion record
    const completion: StageCompletion = {
      stageId,
      status: "in-progress",
      startedAt: new Date().toISOString(),
      completedBy: userId,
      inputs: {},
      outputs: {},
      photos: [],
      attachments: []
    }
    
    item.stageCompletions.push(completion)
    item.currentStageId = stageId
    item.currentStageStatus = "in-progress"
    
    // Send notifications
    if (stage.notifications.length > 0) {
      stage.notifications.forEach(notification => {
        if (notification.trigger === "stage-start") {
          sendNotification(notification, item, stage)
        }
      })
    }
    
    saveItem(item)
  }
  
  // Complete stage
  completeStage(
    itemId: string, 
    stageId: string, 
    outputs: Record<string, any>,
    photos: string[] = [],
    notes?: string
  ): void {
    const item = getItem(itemId)
    const stage = getStage(stageId)
    
    // Validate all required outputs provided
    const missingOutputs = stage.outputs
      .filter(output => output.required)
      .filter(output => !outputs[output.id])
    
    if (missingOutputs.length > 0) {
      throw new Error(`Missing required outputs: ${missingOutputs.map(o => o.label).join(", ")}`)
    }
    
    // Update completion record
    const completion = item.stageCompletions.find(sc => sc.stageId === stageId)
    if (!completion) {
      throw new Error("Stage not started")
    }
    
    completion.status = "completed"
    completion.completedAt = new Date().toISOString()
    completion.outputs = outputs
    completion.photos = photos
    completion.notes = notes
    
    // Calculate duration
    if (completion.startedAt) {
      const start = new Date(completion.startedAt)
      const end = new Date()
      completion.duration = Math.round((end.getTime() - start.getTime()) / 60000) // Minutes
    }
    
    // Update item progress
    const completedCount = item.stageCompletions.filter(sc => sc.status === "completed").length
    const totalStages = getWorkflow(item.workflowId).stages.length
    item.progress = Math.round((completedCount / totalStages) * 100)
    
    // Check if workflow complete
    if (completedCount === totalStages) {
      item.completedAt = new Date().toISOString()
    }
    
    // Send notifications
    if (stage.notifications.length > 0) {
      stage.notifications.forEach(notification => {
        if (notification.trigger === "stage-complete") {
          sendNotification(notification, item, stage)
        }
      })
    }
    
    saveItem(item)
  }
}
```

## Integration with Items System

When an item is created and assigned a workflow:

1. **Workflow Assignment**: Item gets workflowId and workflowVersion
2. **Stage Initialization**: System creates pending stage completions for all stages
3. **QR Code Integration**: Item QR code includes workflow information
4. **Scanner Integration**: Mobile scanner shows available stages for scanned item
5. **Real-time Updates**: Stage progress updates reflect on item detail pages

## Mobile Worker Experience

```typescript
interface MobileWorkerApp {
  // Scanner opens to this view
  scanItem: () => {
    // Scan QR code
    itemId: string
    
    // Show item details
    itemName: string
    currentStage: string
    nextStages: WorkflowStage[]
    
    // Actions
    actions: [
      { label: "Start Stage", stageId: string },
      { label: "Continue Stage", stageId: string },
      { label: "Complete Stage", stageId: string }
    ]
  }
  
  // Stage execution view
  executeStage: (stageId: string) => {
    // Show stage details
    stageName: string
    instructions: string
    
    // Capture inputs
    inputs: StageInput[]
    
    // Capture outputs
    outputs: StageOutput[]
    
    // Actions
    buttons: [
      { label: "Cancel" },
      { label: "Complete Stage", action: () => completeStage() }
    ]
  }
}
```

## Analytics & Reporting

```typescript
interface WorkflowAnalytics {
  // Workflow performance
  workflows: {
    id: string
    name: string
    totalItems: number
    completedItems: number
    averageCompletionTime: number
    onTimeRate: number
    bottleneckStage: string
  }[]
  
  // Stage performance
  stages: {
    id: string
    name: string
    averageDuration: number
    estimatedDuration: number
    efficiencyRate: number
    failureRate: number
    mostCommonIssues: string[]
  }[]
  
  // Team performance
  teams: {
    teamId: string
    teamName: string
    stagesCompleted: number
    averageStageTime: number
    qualityScore: number
  }[]
}
```

## Implementation Plan

### Phase 1: Core Builder (Week 1-2)
- [ ] Workflow page layout (sidebar, canvas, inspector)
- [ ] Stage library panel with templates
- [ ] Drag-and-drop stage placement on grid canvas
- [ ] Basic stage configuration (name, type, description)
- [ ] Connection drawing (click-to-connect)
- [ ] Save/load workflows

### Phase 2: Stage Configuration (Week 3-4)
- [ ] Inputs configuration (QR scan, photo, form, etc.)
- [ ] Outputs configuration (measurements, approval, notes, etc.)
- [ ] Team assignment
- [ ] Timing estimation
- [ ] Instructions and attachments

### Phase 3: Advanced Logic (Week 5-6)
- [ ] Conditional logic (if/then rules)
- [ ] Sequential vs. async execution
- [ ] Prerequisites and dependencies
- [ ] Validation rules
- [ ] Notification rules

### Phase 4: Runtime Execution (Week 7-8)
- [ ] Workflow engine
- [ ] Item-to-workflow assignment
- [ ] Stage execution tracking
- [ ] Progress calculation
- [ ] Mobile worker interface

### Phase 5: Analytics & Optimization (Week 9-10)
- [ ] Workflow analytics dashboard
- [ ] Bottleneck detection
- [ ] Performance metrics
- [ ] Workflow templates library
- [ ] Auto-layout optimization

## Success Metrics

1. **Creation Speed**: Time to build a 10-stage workflow < 5 minutes
2. **Adoption**: 80% of new orders assigned custom workflows within 1 month
3. **Completion Rate**: 95% of workflow stages completed on time
4. **User Satisfaction**: 4.5/5 rating from builders and workers
5. **Flexibility**: Support for 20+ different industry workflows

## Future Enhancements

- **AI Workflow Suggestions**: Analyze historical data to suggest optimizations
- **Workflow Versioning**: Track changes and roll back if needed
- **Workflow Templates Marketplace**: Share workflows between organizations
- **Real-time Collaboration**: Multiple users editing workflow simultaneously
- **Workflow Simulation**: Test workflow before publishing
- **Integration APIs**: Connect to external systems (ERP, MES, etc.)
- **Mobile Workflow Builder**: Build workflows on tablet/mobile
- **Voice-Guided Workflows**: Voice instructions for hands-free operation

---

*This document defines Workflow V2: a manual visual builder that transforms workflow creation from abstract configuration into an intuitive, visual, flowchart-like experience where businesses can design their operating systems as beautiful, interactive diagrams.*
