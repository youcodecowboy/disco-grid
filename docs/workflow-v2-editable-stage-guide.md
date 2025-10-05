# Workflow V2: Editable Stage Block Guide

## 🎯 The Problem We Solved

**Previous Issues:**
1. ❌ **Double-wrapping:** Stage block wrapped in Card + BlockShell + GridCard made nodes inaccessible
2. ❌ **Not malleable:** Fixed display, couldn't easily edit inputs/outputs
3. ❌ **No inline editing:** Had to use separate panels to modify stages

## ✅ The Solution

**New EditableStageBlock Component:**
- ✅ **Single component** - No card wrappers, direct rendering
- ✅ **Inline editing** - Edit name, add/remove inputs/outputs right on the stage
- ✅ **Accessible nodes** - Connection anchors are direct DOM elements
- ✅ **Completely malleable** - Everything is editable when selected

## 🧪 Test Lab Page

Navigate to **"Workflow Test Lab"** in the sidebar to test the new component.

**URL:** `http://localhost:3004/workflows-test`

## Features to Test

### 1. **Selection System**
- Click the stage to select it
- Border changes from 2px to 4px with blue ring
- Edit controls appear when selected

### 2. **Inline Name Editing**
- Click the edit icon (✏️) next to stage name when selected
- Name becomes an input field
- Type new name
- Press Enter to save or Escape to cancel

### 3. **Add Inputs**
- Click the `+` button next to "Inputs" (appears when selected)
- Form appears with:
  - Type dropdown (QR Scan, Photo, Form, Measurement, etc.)
  - Label input field
  - Required checkbox
- Press Enter or click "Add" to add
- Press Escape or click "Cancel" to cancel

### 4. **Remove Inputs**
- Hover over any input item
- Click the X button that appears
- Input is removed immediately

### 5. **Add Outputs**
- Same as inputs but for the Outputs section
- Click `+` button next to "Outputs"
- Fill form and add

### 6. **Remove Outputs**
- Hover over any output item
- Click the X button that appears
- Output is removed immediately

### 7. **Edit Metadata** (when selected)
- **Duration:** Input field with clock icon
- **Team/Role:** Input field with users icon
- **Location:** Input field with map pin icon
- All update in real-time

### 8. **Connection Anchors**
- 4 colored dots at card edges (top, right, bottom, left)
- Hover to see scale-up effect
- Click stops propagation (ready for connection drawing)
- Direct DOM elements with data attributes:
  - `data-anchor="top|right|bottom|left"`
  - `data-stage-id="stage-id"`

### 9. **Delete Stage**
- Trash icon appears when selected
- Click to delete
- Confirmation dialog appears

## Component Architecture

### Direct Rendering (No Wrappers)
```tsx
<div className="relative h-full">
  {/* Connection Anchors - Direct DOM elements */}
  <div data-anchor="top" data-stage-id={id} />
  
  {/* Header with inline editing */}
  <div className="p-3">
    {isEditingName ? <Input /> : <h3 onClick={edit} />}
  </div>
  
  {/* Body with malleable lists */}
  <div className="p-3">
    <InputsList onAdd={...} onRemove={...} />
    <OutputsList onAdd={...} onRemove={...} />
    <MetadataInputs when={isSelected} />
  </div>
</div>
```

### State Management
All state is **local** to the component:
- `localName` - Editable name
- `localInputs` - Array of inputs
- `localOutputs` - Array of outputs
- Changes propagate via `onChange` callback

### Callbacks
```tsx
interface Props {
  onSelect?: (id: string) => void       // When stage is clicked
  onChange?: (id: string, updates) => void  // When any property changes
  onDelete?: (id: string) => void       // When delete is clicked
}
```

## Connection Anchor Implementation

### Anchor Elements
```tsx
<div
  className={`absolute -top-2 left-1/2 w-4 h-4 rounded-full ${config.color} border-2 border-white cursor-pointer hover:scale-125`}
  data-anchor="top"
  data-stage-id={id}
  onClick={(e) => e.stopPropagation()}
/>
```

### Why This Works
1. **Absolute positioning** - Anchors are positioned relative to stage container
2. **Data attributes** - Easy to query for connection drawing
3. **Stop propagation** - Click doesn't select the stage
4. **Hover scale** - Visual feedback
5. **z-index: 20** - Always on top for clicking

### Query Anchors
```javascript
// Get all anchors for a stage
const anchors = document.querySelectorAll(`[data-stage-id="${stageId}"][data-anchor]`)

// Get top anchor of a stage
const topAnchor = document.querySelector(`[data-stage-id="${stageId}"][data-anchor="top"]`)

// Get position
const rect = topAnchor.getBoundingClientRect()
const centerX = rect.left + rect.width / 2
const centerY = rect.top + rect.height / 2
```

## Input/Output Form

### Add Form Component
Appears inline when `+` button is clicked:
```tsx
<InputOutputForm
  onAdd={(type, label, required) => handleAdd(type, label, required)}
  onCancel={() => setShowForm(false)}
/>
```

### Form Features
- Type dropdown with all input/output types
- Label text input (autofocus)
- Required checkbox
- Add/Cancel buttons
- Keyboard shortcuts:
  - Enter to submit
  - Escape to cancel

### Type Options
```tsx
const types = [
  { value: "qr-scan", label: "QR Scan", icon: QrCode },
  { value: "photo", label: "Photo", icon: Camera },
  { value: "form", label: "Form", icon: FileText },
  { value: "measurement", label: "Measurement", icon: FileText },
  { value: "approval", label: "Approval", icon: CheckCircle },
  { value: "timestamp", label: "Timestamp", icon: Clock },
  { value: "signature", label: "Signature", icon: Edit2 },
  { value: "count", label: "Count", icon: FileText },
]
```

## Visual Design

### Selection States
```
Unselected:
- border-2
- No ring
- No edit controls visible

Selected:
- border-4
- ring-4 ring-blue-300
- Edit controls appear
- Metadata inputs appear
- Add/remove buttons appear
```

### Color Coding
Same as before:
- Process: Blue (`bg-blue-50`, `border-blue-500`)
- Decision: Orange
- Input: Purple
- Output: Green
- Wait: Gray
- Automation: Pink

### Hover States
- **Stage:** Slight shadow increase
- **Inputs/Outputs:** X button fades in
- **Anchors:** Scale up 125%
- **Buttons:** Color intensifies

## Real-Time Updates

All changes propagate immediately through `onChange`:

```tsx
// Add input
const newInput = { id, type, label, required }
const updated = [...localInputs, newInput]
setLocalInputs(updated)
onChange?.(id, { inputs: updated })

// Update metadata
onChange?.(id, { estimatedDuration: value })
```

Parent component receives all updates and can:
- Update its state
- Persist to database
- Sync with other components
- Validate changes

## Next Steps for Connection Drawing

### Phase 2A: Visual Connection Layer

**SVG Overlay:**
```tsx
<svg className="absolute inset-0 pointer-events-none z-10">
  {connections.map(conn => (
    <path
      d={calculateBezierPath(conn)}
      stroke={getConnectionColor(conn)}
      strokeWidth="2"
      fill="none"
    />
  ))}
</svg>
```

**Connection Drawing Mode:**
1. Click source anchor → enters "connecting" mode
2. Mouse follows to target
3. Click target anchor → creates connection
4. Escape cancels

**Data Structure:**
```tsx
interface Connection {
  id: string
  fromStageId: string
  fromAnchor: "top" | "right" | "bottom" | "left"
  toStageId: string
  toAnchor: "top" | "right" | "bottom" | "left"
  type: "sequential" | "conditional" | "parallel"
}
```

## Testing Checklist

Run through these on `/workflows-test`:

- [ ] Click to select (border changes to thick + ring)
- [ ] Click edit icon to edit name
- [ ] Type new name and press Enter
- [ ] Press Escape while editing to cancel
- [ ] Click + button next to Inputs
- [ ] Select type from dropdown
- [ ] Enter label and press Enter
- [ ] See new input appear
- [ ] Hover over input to see X button
- [ ] Click X to remove input
- [ ] Repeat for Outputs
- [ ] Edit duration field
- [ ] Edit team/role field
- [ ] Edit location field
- [ ] See all changes in JSON output below
- [ ] Hover over anchors to see scale effect
- [ ] Click anchor (doesn't select stage)
- [ ] Click delete button
- [ ] Confirm deletion dialog

## Benefits of This Approach

### 1. **Accessibility**
- Connection anchors are real DOM elements
- Can be queried, clicked, positioned from
- No wrapper interference

### 2. **Malleability**
- Everything is editable inline
- No separate panels needed
- Immediate visual feedback

### 3. **Simplicity**
- Single component, no nesting
- Clear state management
- Easy to understand and modify

### 4. **Performance**
- No unnecessary wrapper re-renders
- Local state for editing
- Callback-based updates

### 5. **Extensibility**
- Easy to add new input/output types
- Easy to add new metadata fields
- Connection drawing can read anchors directly

---

**Status:** Phase 1B - Editable Stage Component Complete ✅

**Next:** Phase 2A - Connection Drawing System

*Navigate to `/workflows-test` to try it out!*
