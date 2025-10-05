# Workflow V2 Visual Showcase

## 🎨 What We Built

A beautiful, interactive visual workflow builder that turns manufacturing processes into flowchart-style diagrams.

## Stage Block Designs

### Process Stage (Blue) 🔵
```
┌─────────────────────────────────────┐
│ ●  Connection Anchor (Top)          │
├─────────────────────────────────────┤
│ ⚙️  Cutting                → Seq    │
│ Process • Step 2                    │
│ Cut fabric pieces according to...   │
│                                     │
│ ● Inputs (1)                        │
│ [📱 Scan order*]                    │
│                                     │
│ ● Outputs (2)                       │
│ [📏 Cut dimensions*] [📷 Photo]     │
│                                     │
│ ⏱️ ~20m    👥 Cutter                │
│ 📍 Cutting Floor                    │
│ ● Published                         │
└─────────────────────────────────────┘
  ● Connection Anchors (Left, Right, Bottom)
```

### Decision Stage (Orange) 🟠
```
┌─────────────────────────────────────┐
│ ●  Connection Anchor (Top)          │
├─────────────────────────────────────┤
│ ⚠️  Final QC                → Seq    │
│ Decision • Step 5                   │
│ Comprehensive quality inspection... │
│                                     │
│ ● Inputs (1)                        │
│ [📱 Scan garment*]                  │
│                                     │
│ ● Outputs (2)                       │
│ [✅ Pass/Fail*] [📝 QC notes]       │
│                                     │
│ ⏱️ ~10m    👥 QA Inspector          │
│ 📍 QC Station                       │
│ ● Published                         │
└─────────────────────────────────────┘
  ● Connection Anchors (Left, Right, Bottom)
```

### Input Stage (Purple) 🟣
```
┌─────────────────────────────────────┐
│ ●  Connection Anchor (Top)          │
├─────────────────────────────────────┤
│ 📄 Fabric Inspection        → Seq   │
│ Input • Step 1                      │
│ Inspect fabric rolls for quality... │
│                                     │
│ ● Inputs (1)                        │
│ [📱 Scan fabric roll*]              │
│                                     │
│ ● Outputs (1)                       │
│ [📝 Quality report*]                │
│                                     │
│ ⏱️ ~10m    👥 QA Inspector          │
│ 📍 Receiving Area                   │
│ ● Published                         │
└─────────────────────────────────────┘
  ● Connection Anchors (Left, Right, Bottom)
```

### Output Stage (Green) 🟢
```
┌─────────────────────────────────────┐
│ ●  Connection Anchor (Top)          │
├─────────────────────────────────────┤
│ ✅ Packaging                 → Seq   │
│ Output • Step 6                     │
│ Package completed garment for...    │
│                                     │
│ ● Inputs (1)                        │
│ [📱 Scan garment*]                  │
│                                     │
│ ● Outputs (2)                       │
│ [📦 Package count*] [📱 Label*]     │
│                                     │
│ ⏱️ ~5m     👥 Packaging Team        │
│ 📍 Shipping Area                    │
│ ● Published                         │
└─────────────────────────────────────┘
  ● Connection Anchors (Left, Right, Bottom)
```

### Async Stage (Process with Async Badge) 🟣
```
┌─────────────────────────────────────┐
│ ●  Connection Anchor (Top)          │
├─────────────────────────────────────┤
│ ⚙️  Attach Buttons           ⇄ Asy  │
│ Process                             │
│ Attach buttons to garment           │
│                                     │
│ ● Inputs (1)                        │
│ [📱 Scan garment*]                  │
│                                     │
│ ● Outputs (1)                       │
│ [📷 Button photo*]                  │
│                                     │
│ ⏱️ ~15m    👥 Finishing Team        │
│ 📍 Finishing Area                   │
│ ● Published                         │
└─────────────────────────────────────┘
  ● Connection Anchors (Left, Right, Bottom)
```

## Full Workflow Canvas Layout

### Denim Manufacturing Workflow

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║  Workflows V2 > Denim Manufacturing Workflow                                  ║
║  [+ Add Stage] [💾 Save] [▶ Test Run] [👁 Preview]                           ║
╚═══════════════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────────────┐
│ Denim Manufacturing Workflow                                                │
│ Complete denim production from cutting to packaging • 8 stages • ~3h       │
│ Status: Published                                                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 🔵 Process  🟠 Decision  🟣 Input  🟢 Output                               │
│ → Sequential  ⇄ Async  ⇉ Parallel                                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌──── GRID CANVAS (Edit Mode - Drag & Drop Enabled) ────────────────────────┐
│                                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                   │
│  │ 🟣 Fabric   │    │ 🔵 Cutting  │    │ 🔵 Sewing   │                   │
│  │ Inspection  │───▶│             │───▶│             │                   │
│  │ → Seq #1    │    │ → Seq #2    │    │ → Seq #3    │                   │
│  │             │    │             │    │             │                   │
│  │ In: [📱]    │    │ In: [📱]    │    │ In: [📱]    │                   │
│  │ Out: [📝]   │    │ Out: [📏📷] │    │ Out: [📝📷] │                   │
│  │             │    │             │    │             │                   │
│  │ ~10m QA     │    │ ~20m Cutter │    │ ~45m Sewer  │                   │
│  └─────────────┘    └─────────────┘    └─────────────┘                   │
│        │                  │                  │                             │
│        │                  │                  │                             │
│        └──────────────────┴──────────────────┘                             │
│                           │                                                │
│                           ▼                                                │
│                    ┌─────────────┐                                         │
│                    │ 🔵 Washing  │                                         │
│                    │             │                                         │
│                    │ → Seq #4    │                                         │
│                    │             │                                         │
│                    │ In: [📱]    │                                         │
│                    │ Out: [⏰]   │                                         │
│                    │             │                                         │
│                    │ ~60m Wash   │                                         │
│                    └─────────────┘                                         │
│                           │                                                │
│                           ├────────────────┬──────────────────┐            │
│                           ▼                ▼                  ▼            │
│                    ┌─────────────┐  ┌─────────────┐                       │
│                    │ 🔵 Attach   │  │ 🔵 Attach   │                       │
│                    │ Buttons     │  │ Back Patch  │                       │
│                    │ ⇄ Async     │  │ ⇄ Async     │                       │
│                    │             │  │             │                       │
│                    │ In: [📱]    │  │ In: [📱]    │                       │
│                    │ Out: [📷]   │  │ Out: [📷]   │                       │
│                    │             │  │             │                       │
│                    │ ~15m Finish │  │ ~15m Finish │                       │
│                    └─────────────┘  └─────────────┘                       │
│                           │                │                               │
│                           └────────┬───────┘                               │
│                                    ▼                                       │
│                             ┌─────────────┐      ┌─────────────┐          │
│                             │ 🟠 Final QC │─────▶│ 🟢 Package  │          │
│                             │             │      │             │          │
│                             │ → Seq #5    │      │ → Seq #6    │          │
│                             │             │      │             │          │
│                             │ In: [📱]    │      │ In: [📱]    │          │
│                             │ Out: [✅📝] │      │ Out: [📦📱] │          │
│                             │             │      │             │          │
│                             │ ~10m QA     │      │ ~5m Package │          │
│                             └─────────────┘      └─────────────┘          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 💡 Quick Tips:                                                              │
│ • Click "Edit Layout" to enable drag-and-drop repositioning                │
│ • Click a stage card to select it and view details                         │
│ • Drag stages around to arrange your workflow visually                     │
│ • Connection anchors (dots) will be used to draw arrows between stages     │
│ • Sequential stages (→) must complete in order, Async (⇄) can be any order │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Color Coding System

### Stage Types
- 🔵 **Blue (Process):** Standard work steps - `bg-blue-50 border-blue-500`
- 🟠 **Orange (Decision):** QC gates, approvals - `bg-orange-50 border-orange-500`
- 🟣 **Purple (Input):** Data collection - `bg-purple-50 border-purple-500`
- 🟢 **Green (Output):** Completion points - `bg-green-50 border-green-500`
- ⚫ **Gray (Wait):** Time delays - `bg-gray-50 border-gray-500`
- 🩷 **Pink (Automation):** Automated actions - `bg-pink-50 border-pink-500`

### Execution Types
- **→ Sequential** (Blue): Must happen in order
- **⇄ Async** (Purple): Can happen in any order after prerequisites
- **⇉ Parallel** (Green): Multiple stages execute simultaneously

### Status Indicators
- **● Green Dot:** Completed stage
- **● Blue Dot:** Active stage
- **● Gray Dot:** Pending stage

### Required Field Indicator
- **Red asterisk (*):** Required input/output field

## Icon Legend

### Stage Types
- ⚙️ Settings icon - Process stages
- ⚠️ Alert icon - Decision stages
- 📄 File icon - Input stages
- ✅ Check icon - Output stages
- ⏱️ Timer icon - Wait stages
- ⚡ Zap icon - Automation stages

### Input/Output Types
- 📱 QR Code icon - QR/Barcode scanning
- 📷 Camera icon - Photo capture
- 📝 File icon - Text/Form input
- 📏 Ruler icon - Measurements
- ✅ Check icon - Approval/Decision
- 📦 Package icon - Count/Quantity
- ⏰ Clock icon - Timestamp
- 🖊️ Pen icon - Signature

### Metadata
- ⏱️ Clock icon - Estimated duration
- 👥 Users icon - Assigned team/role
- 📍 Map pin icon - Location
- ● Dot - Status indicator

## Interactive Features

### Selection State
When a stage is selected:
```
┌═════════════════════════════════════┐ ← Thick border (4px)
║ ●  Connection Anchor (Top)          ║
╠═════════════════════════════════════╣
║ ⚙️  Cutting                → Seq    ║
║ Process • Step 2                    ║
║                                     ║
║ [SELECTED STATE]                    ║
║ - Border: 4px blue                  ║
║ - Ring: 4px blue glow               ║
║ - Shadow: Large                     ║
║                                     ║
╚═════════════════════════════════════╝
```

### Hover State
- Slight shadow increase
- Border color intensifies
- Cursor changes to pointer

### Drag State
- Opacity: 50%
- Dashed blue preview box shows drop location
- "Drop here" label on preview
- Smooth animation

## Grid System

### Layout
- **12 columns** across the canvas
- **40px** row height
- **8px** gutters between blocks
- **Default stage size:** 3 columns × 8 rows (approx. 240px × 312px)

### Grid Background (Edit Mode)
- Light gray grid lines
- 28px × 28px cells
- Subtle but visible for alignment

### Positioning
- Stages snap to grid
- Collision detection prevents overlaps
- Auto-resolution pushes overlapping stages down

## Connection Anchors

Each stage has 4 connection points:

```
              ● Top Anchor
              │
    ● Left ───┼─── Right ●
              │
              ● Bottom Anchor
```

**Visual Style:**
- Small colored circles (4px diameter)
- Positioned at card edges
- Color matches stage status (gray/blue/green)
- 2px white border for visibility
- Will be interactive in Phase 2 (connection drawing)

## Workflow Flow Patterns

### Sequential Flow
```
[Stage 1] ──→ [Stage 2] ──→ [Stage 3]
```
- Solid arrows
- Must complete in order
- Blue color

### Async Flow
```
                ┌──→ [Stage A] ──┐
[Stage Start] ──┤                ├──→ [Stage End]
                └──→ [Stage B] ──┘
```
- Dashed arrows
- Can complete in any order
- Purple color
- Both must complete before next sequential stage

### Conditional Flow
```
[Stage Start] ──→ [Stage A] (if condition met)
              └──→ [Stage B] (otherwise)
```
- Dotted arrows with labels
- Only one path executes
- Orange color
- Label shows condition

## Real-World Example: Denim Workflow

### Flow Description

1. **Fabric Inspection** (Sequential #1)
   - Worker scans fabric roll QR code
   - Fills out quality inspection form
   - System records timestamp and inspector

2. **Cutting** (Sequential #2)
   - Worker scans cutting order QR
   - Cuts fabric pieces per pattern
   - Records dimensions and takes photo
   - Cannot start until inspection complete

3. **Sewing** (Sequential #3)
   - Worker scans cut pieces QR
   - Sews pieces together
   - Fills out sewing checklist
   - Takes photo of completed garment
   - Cannot start until cutting complete

4. **Washing** (Sequential #4)
   - Worker scans garment QR
   - Washes and treats denim
   - System auto-records completion time
   - Cannot start until sewing complete

5. **Finishing - Async Phase**
   - **Attach Buttons** (Async)
     - Can start after washing
     - Can be done before or after back patch
     - Worker scans garment, attaches buttons, takes photo
   
   - **Attach Back Patch** (Async)
     - Can start after washing
     - Can be done before or after buttons
     - Worker scans garment, attaches patch, takes photo

6. **Final QC** (Sequential #5)
   - Cannot start until BOTH buttons AND patch complete
   - QA inspector scans garment
   - Performs comprehensive quality check
   - Marks Pass/Fail/Rework
   - Adds optional notes

7. **Packaging** (Sequential #6)
   - Cannot start until QC passes
   - Worker scans garment QR
   - Counts items in package
   - Scans shipping label
   - Marks order complete

### Timing
- **Total Duration:** ~165 minutes (2h 45m)
- **Critical Path:** Inspection → Cutting → Sewing → Washing → Finishing → QC → Package
- **Parallel Time Savings:** Finishing stages can overlap (saves ~0 time but provides flexibility)

---

**This visual showcase demonstrates the beautiful, intuitive design of Workflow V2 Phase 1!**

*Navigate to `/workflows-v2` to see it in action.*
