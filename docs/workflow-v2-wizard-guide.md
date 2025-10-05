# Workflow V2: Stage Builder Wizard Guide

## 🎯 The New Approach

Based on feedback, we've transformed the stage builder into a **guided multi-step wizard** that makes it obvious and intuitive to create workflow stages.

## ✨ Key Features

### Multi-Step Wizard Flow
Instead of showing everything at once, users are guided through 4 clear steps:

1. **Basic Information** - Name, type, execution, metadata
2. **Inputs** - What's needed to START the stage
3. **Outputs** - What's needed to COMPLETE the stage  
4. **Review** - Beautiful summary before completing

### Visual Icon Selection
Instead of text lists, users select inputs/outputs by **clicking large icon cards**:
- QR Scan 📱
- Photo 📷
- Form 📝
- Measurement 📏
- Approval ✅
- Timestamp ⏰
- Signature ✍️
- Count #️⃣

### Clear Instructions
Each step has:
- Progress bar showing where you are (1/4, 2/4, etc.)
- Step title and description
- Help text explaining what to do
- Visual feedback when selecting options

## 🧪 Testing the Wizard

Navigate to **"Wizard Test"** in sidebar or visit:
**URL:** `http://localhost:3004/workflows-wizard-test`

## Step-by-Step Guide

### Step 1: Basic Information

**What you configure:**
- ✏️ **Stage Name** (required) - e.g., "Cutting", "Sewing", "QC Check"
- 🎨 **Stage Type** - Select from 6 visual cards:
  - **Process** (blue) - Standard work step
  - **Decision** (orange) - QC gate or approval
  - **Input** (purple) - Data collection point
  - **Output** (green) - Completion checkpoint
  - **Wait** (gray) - Time delay
  - **Automation** (pink) - Automated action

- 🔄 **Execution Flow** - Select from 3 options:
  - **Sequential** (→) - Must happen in order
  - **Async** (⇄) - Can happen in any order
  - **Parallel** (⇉) - Runs simultaneously

- 📝 **Description** (optional) - Describe what happens
- ⏱️ **Duration** - Estimated time in minutes
- 👥 **Team/Role** - Who performs this stage
- 📍 **Location** - Where this happens

**UI Features:**
- Large clickable cards for type selection
- Selected items show checkmark
- Color-coded by type
- Three-column grid for metadata

### Step 2: Inputs

**What you configure:**
- Click icon cards to select required inputs
- Each click toggles on/off
- Selected items show with checkmark
- Blue theme (inputs = start requirements)

**Help Banner:**
> "What's needed to start this stage?"
> "Select all the inputs required before workers can begin this stage. Click icons to toggle."

**Icon Grid:**
- 2-column grid of large cards
- Each card shows:
  - Large icon
  - Type label
  - Description text
  - Checkmark when selected

**Selected Summary:**
At bottom, shows all selected inputs as badges with icons

**Example Workflow:**
```
For "Cutting" stage, you might select:
✅ QR Scan - "Scan fabric roll"
✅ Form - "Cutting instructions"
```

### Step 3: Outputs

**What you configure:**
- Same as inputs but for completion requirements
- Green theme (outputs = finish requirements)

**Help Banner:**
> "What's needed to complete this stage?"
> "Select all the outputs required before workers can mark this stage as done."

**Example Workflow:**
```
For "Cutting" stage, you might select:
✅ Measurement - "Cut piece dimensions"
✅ Photo - "Photo of cut pieces"
✅ Count - "Number of pieces cut"
```

### Step 4: Review

**What you see:**
- **Hero Card** - Beautiful gradient card with:
  - Large stage icon
  - Stage name
  - Type and execution badges
  - Description

- **Metadata Grid** - 3 cards showing:
  - Duration with clock icon
  - Team/Role with user icon
  - Location with pin icon

- **Inputs/Outputs Grid** - 2 columns:
  - **Blue panel** - All inputs with icons
  - **Green panel** - All outputs with icons

- **Completion Banner** - Green success message:
  > "Stage configuration complete! Click 'Complete Stage' to add this to your workflow."

## 🎨 Visual Design System

### Progress Bar
- 4 segments at top
- Filled segments are blue
- Current and future segments are gray
- Chevron arrows between segments

### Step Navigation
- "Cancel" or "Back" on left
- "Next" or "Complete Stage" on right
- Next button disabled if step incomplete
- Smooth transitions between steps

### Color Coding
**Inputs (Step 2):**
- Blue accents (`bg-blue-50`, `border-blue-500`)
- Help banner with blue background
- Selected items have blue checkmark

**Outputs (Step 3):**
- Green accents (`bg-green-50`, `border-green-500`)
- Help banner with green background
- Selected items have green checkmark

**Stage Types:**
- Process: Blue
- Decision: Orange
- Input: Purple
- Output: Green
- Wait: Gray
- Automation: Pink

### Interactive States
**Unselected Card:**
- Gray border (`border-gray-200`)
- Gray icon background
- Hover: Border darkens

**Selected Card:**
- Colored border (type-specific)
- Colored icon background
- Checkmark in corner
- Colored text

### Empty States
When no items selected:
- Large gray icon
- Helper text
- Centered layout

## 📊 Component Architecture

### Props
```tsx
interface StageBuilderWizardProps {
  initialData?: Partial<StageData>  // Pre-fill wizard
  onComplete: (data: StageData) => void  // When done
  onCancel: () => void  // When cancelled
}
```

### State Management
All state is local to wizard:
```tsx
const [step, setStep] = useState(1)  // Current step (1-4)
const [data, setData] = useState<StageData>({
  name: "",
  description: "",
  type: "process",
  executionType: "sequential",
  assignedRole: "",
  location: "",
  estimatedDuration: 0,
  inputs: [],
  outputs: [],
  conditions: [],
})
```

### Step Components
Each step is a separate component:
- `Step1BasicInfo` - Form fields for basic details
- `Step2Inputs` - Icon grid for input selection
- `Step3Outputs` - Icon grid for output selection
- `Step4Review` - Beautiful summary view

### Data Flow
1. User fills Step 1 → Updates `data.name`, `data.type`, etc.
2. User selects inputs in Step 2 → Adds to `data.inputs[]`
3. User selects outputs in Step 3 → Adds to `data.outputs[]`
4. User reviews Step 4 → Sees all data
5. User clicks "Complete" → Calls `onComplete(data)`

## 🚀 Integration Flow

### Usage in Test Page
```tsx
const [showWizard, setShowWizard] = useState(false)
const [stages, setStages] = useState<Stage[]>([])

const handleStageComplete = (stageData) => {
  const newStage = { id: generateId(), ...stageData }
  setStages([...stages, newStage])
  setShowWizard(false)
}

return (
  <>
    <Button onClick={() => setShowWizard(true)}>
      Create Stage
    </Button>
    
    {showWizard && (
      <Modal>
        <StageBuilderWizard
          onComplete={handleStageComplete}
          onCancel={() => setShowWizard(false)}
        />
      </Modal>
    )}
  </>
)
```

### Modal Display
Wizard is shown in a modal overlay:
- Fixed positioning
- Black backdrop (50% opacity)
- Centered modal
- 80% viewport height
- Max width 3xl (768px)

## 💡 UX Improvements Over Previous Version

### Before (Inline Editing):
- ❌ Everything visible at once = overwhelming
- ❌ Unclear what to do first
- ❌ Hard to see progress
- ❌ Inputs/outputs were text-based
- ❌ No guidance or help

### Now (Wizard):
- ✅ One step at a time = focused
- ✅ Clear progression (Step 1 → 2 → 3 → 4)
- ✅ Progress bar shows where you are
- ✅ Inputs/outputs are visual icons
- ✅ Help text at every step
- ✅ Beautiful summary before completing
- ✅ Can't proceed without required fields

## 🎯 Example Workflow

### Creating a "Cutting" Stage

**Step 1: Basic Info**
1. Type "Cutting" as stage name
2. Select "Process" type (blue card)
3. Select "Sequential" execution (→)
4. Type "Cut fabric pieces according to pattern"
5. Enter "20" for duration
6. Enter "Cutter" for role
7. Enter "Cutting Floor" for location
8. Click "Next"

**Step 2: Inputs**
1. Read help: "What's needed to start this stage?"
2. Click "QR Scan" card - ✅
3. Click "Form" card - ✅
4. See selected items at bottom
5. Click "Next"

**Step 3: Outputs**
1. Read help: "What's needed to complete this stage?"
2. Click "Measurement" card - ✅
3. Click "Photo" card - ✅
4. See selected items at bottom
5. Click "Next"

**Step 4: Review**
1. See beautiful summary card
2. Verify all details correct
3. See inputs: QR Scan, Form
4. See outputs: Measurement, Photo
5. Click "Complete Stage"

**Result:**
- Wizard closes
- New stage appears in list
- Ready to create next stage or link stages

## 🔄 Next Steps

This wizard creates **stage data objects**. Next, we need:

1. **Canvas Placement** - Drop completed stages onto grid canvas
2. **Connection Drawing** - Link stages together with arrows
3. **Stage Summary Cards** - Compact view of completed stages
4. **Edit Mode** - Click stage to reopen wizard and edit

## 📝 Testing Checklist

- [ ] Open wizard modal
- [ ] Enter stage name (required)
- [ ] Select stage type (6 options)
- [ ] Select execution type (3 options)
- [ ] Add description, duration, team, location
- [ ] Click "Next" to go to Step 2
- [ ] See progress bar update (1/4 → 2/4)
- [ ] See blue help banner for inputs
- [ ] Click input type icons (toggle on/off)
- [ ] See selected inputs at bottom
- [ ] Click "Next" to go to Step 3
- [ ] See green help banner for outputs
- [ ] Click output type icons (toggle on/off)
- [ ] See selected outputs at bottom
- [ ] Click "Next" to go to Step 4
- [ ] See beautiful review summary
- [ ] Verify all data correct
- [ ] Click "Complete Stage"
- [ ] See stage added to list
- [ ] Click "Add Another Stage" to create more
- [ ] Create 3-4 stages total
- [ ] See all stages in grid view

---

**Status:** Phase 1C - Stage Builder Wizard Complete ✅

**Next:** Phase 2 - Canvas Integration & Connection Drawing

*Navigate to `/workflows-wizard-test` to try it out!*
