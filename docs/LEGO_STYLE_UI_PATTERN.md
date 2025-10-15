# Lego Style UI Pattern 🧱

## Overview

The "Lego Style" UI pattern is a flexible, additive interface design that emphasizes malleability and progressive disclosure. Instead of overwhelming users with large forms or rigid wizards, it presents a minimal starting point and allows users to "build" their input by adding only the components they need, when they need them.

**Key Philosophy**: Start minimal, build organically, remove freely.

## Core Principles

### 1. **Minimal by Default**
- Show only the absolute essentials on load
- Everything else is hidden until explicitly requested
- No overwhelming forms or endless scrolling
- Clean, focused starting state

### 2. **Additive Interface**
- Users add sections with `+ Add [feature]` buttons
- Each addition expands in-place (no navigation, no modals)
- Sections appear exactly where they're needed in the flow
- Progressive disclosure keeps cognitive load low

### 3. **Fully Reversible**
- Every added section has an `×` remove button
- Removing a section clears its data (with optional confirmation)
- Nothing is permanent or locked in
- Users can restructure their input at any time

### 4. **Inline & Natural**
- Inputs appear inline within the document flow
- No separate edit modes or states
- Keyboard-friendly (Enter to add items, etc.)
- Hover states reveal actions

### 5. **Visual Hierarchy**
- Most important elements are largest/most prominent
- Secondary actions are subtle but discoverable
- Consistent spacing creates natural rhythm
- Typography guides the eye

## Design System

### Visual Components

#### Add Buttons (`+ Add X`)
```tsx
<button className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 py-1">
  <Plus className="h-4 w-4" />
  Add description
</button>
```

**Characteristics**:
- Small text (text-sm)
- Subtle gray (text-slate-400)
- Hover to darker gray (hover:text-slate-600)
- Small icon (h-4 w-4)
- Minimal padding (py-1)

#### Remove Buttons (`×`)
```tsx
<button className="text-slate-400 hover:text-slate-600">
  <X className="h-4 w-4" />
</button>
```

**Characteristics**:
- Icon-only (no text)
- Same color scheme as add buttons
- Positioned at section header level
- Consistent size (h-4 w-4)

#### Section Headers
```tsx
<div className="flex items-center justify-between">
  <div className="flex items-center gap-2">
    <Icon className="h-4 w-4 text-slate-500" />
    <span className="text-sm font-medium text-slate-700">Section Name</span>
  </div>
  <button>
    <X className="h-4 w-4" />
  </button>
</div>
```

**Characteristics**:
- Small icons and text
- Medium font weight for labels
- Flex layout with space-between
- Icon + text combo for clarity

#### Badge Chips (for selected items)
```tsx
<Badge className="rounded-full bg-slate-100 text-slate-700 pl-1 pr-2 py-1 text-sm font-medium hover:bg-slate-200 cursor-pointer">
  <img src={avatar} className="h-5 w-5 rounded-full mr-1.5" />
  {name}
  <X className="ml-1 h-3 w-3" />
</Badge>
```

**Characteristics**:
- Rounded-full for pill shape
- Light background (bg-slate-100)
- Contains image/icon + text + remove
- Hover state for interactivity
- Small padding

#### Inline Inputs (transparent, borderless)
```tsx
<input
  type="text"
  className="w-full text-3xl font-semibold text-slate-900 placeholder-slate-300 bg-transparent border-none outline-none py-2"
  placeholder="What's the goal?"
/>
```

**Characteristics**:
- No border or background (bg-transparent, border-none)
- No outline on focus (outline-none)
- Large for primary inputs (text-3xl)
- Subtle placeholder (placeholder-slate-300)
- Feels like writing in a document

#### Dropdown Selectors (on-demand)
```tsx
<div className="relative">
  <button onClick={() => setShowDropdown(!showDropdown)}>
    + Add person
  </button>
  {showDropdown && (
    <div className="absolute top-full left-0 mt-1 w-64 rounded-lg border border-slate-200 bg-white shadow-lg p-2 z-10">
      {/* Dropdown content */}
    </div>
  )}
</div>
```

**Characteristics**:
- Appears below trigger button
- Rounded corners (rounded-lg)
- Subtle shadow (shadow-lg)
- Clean white background
- Small padding (p-2)

### Layout Patterns

#### Centered Document Layout
```tsx
<div className="max-w-3xl mx-auto py-8 space-y-1">
  {/* Content */}
</div>
```

**Characteristics**:
- Max width for readability (max-w-3xl)
- Centered (mx-auto)
- Vertical spacing between sections (space-y-1)
- Breathing room at top (py-8)

#### Inline Expansion Pattern
```tsx
{!showSection ? (
  <button onClick={() => setShowSection(true)}>
    + Add section
  </button>
) : (
  <div className="space-y-2 py-1">
    <SectionHeader />
    <SectionContent />
  </div>
)}
```

**Pattern**:
- Conditional rendering based on state
- Button to show, content replaces button
- Consistent spacing (space-y-2, py-1)
- No animations needed (instant feels snappier)

#### Nested List Pattern (for checklists, tags)
```tsx
<div className="space-y-2 py-1">
  <SectionHeader />
  <div className="pl-6">
    {items.map(item => (
      <div className="flex items-center gap-2 group">
        <ItemContent />
        <button className="opacity-0 group-hover:opacity-100">
          <X className="h-3 w-3" />
        </button>
      </div>
    ))}
    <InlineAddInput />
  </div>
</div>
```

**Characteristics**:
- Left padding for hierarchy (pl-6)
- Group hover to reveal actions (group, opacity-0, group-hover:opacity-100)
- Inline add input at bottom
- Small spacing between items

## Color System

### Text Colors
- **Primary**: `text-slate-900` (main content)
- **Secondary**: `text-slate-700` (labels, less important)
- **Tertiary**: `text-slate-500` (icons, metadata)
- **Subtle**: `text-slate-400` (add buttons, hints)
- **Placeholder**: `text-slate-300` (input placeholders)

### Background Colors
- **Primary**: `bg-white` (main background)
- **Subtle**: `bg-slate-50` (textareas, secondary sections)
- **Chip**: `bg-slate-100` (badges, tags)
- **Hover**: `bg-slate-200` (hover state on chips)
- **Transparent**: `bg-transparent` (inline inputs)

### Border Colors
- **Default**: `border-slate-200` (standard borders)
- **Focus**: `border-slate-400` (focus state)

### Sizing Scale
- **Icons**: `h-4 w-4` (standard), `h-3 w-3` (small, like remove in badges)
- **Avatars**: `h-5 w-5` (in chips), `h-6 w-6` (in dropdowns)
- **Text**: `text-sm` (labels, secondary), `text-3xl` (primary input)
- **Padding**: `py-1` (minimal), `py-2` (standard), `p-2` (containers)

## Implementation Pattern

### State Management Structure
```tsx
// Core required fields
const [requiredField1, setRequiredField1] = useState("")
const [requiredField2, setRequiredField2] = useState([])

// Optional sections - track visibility + data
const [showOptional1, setShowOptional1] = useState(false)
const [optional1Data, setOptional1Data] = useState("")

const [showOptional2, setShowOptional2] = useState(false)
const [optional2Data, setOptional2Data] = useState([])
```

### Add/Remove Pattern
```tsx
// Add section
const handleAddSection = () => {
  setShowSection(true)
}

// Remove section (with data clearing)
const handleRemoveSection = () => {
  setShowSection(false)
  setSectionData(initialValue) // Clear data
}
```

### Inline List Management
```tsx
// For checklists, tags, etc.
const [items, setItems] = useState<Item[]>([])
const [newItemInput, setNewItemInput] = useState("")

const handleAddItem = () => {
  if (newItemInput.trim()) {
    setItems([...items, { id: generateId(), value: newItemInput.trim() }])
    setNewItemInput("")
  }
}

const handleRemoveItem = (id: string) => {
  setItems(items.filter(item => item.id !== id))
}

// In JSX
<input
  value={newItemInput}
  onChange={(e) => setNewItemInput(e.target.value)}
  onKeyPress={(e) => e.key === "Enter" && handleAddItem()}
  placeholder="Add item..."
/>
```

## When to Use Lego Style

### ✅ Perfect For:
- **Creation forms** where users need flexibility
- **Configuration interfaces** with many optional settings
- **Builder tools** where users construct something
- **Editing interfaces** where not all fields apply
- **Customization panels** with varying needs

### ❌ Not Ideal For:
- **Simple forms** with only 2-3 fields (just show them all)
- **Strict workflows** that require specific order
- **Data display** (use this for input, not output)
- **Critical fields** that must always be filled

## Accessibility Considerations

### Keyboard Navigation
- All add/remove buttons are keyboard accessible
- Enter key adds items to lists
- Tab order follows logical flow
- Focus states are clear

### Screen Readers
```tsx
<button aria-label="Add description section">
  <Plus className="h-4 w-4" />
  Add description
</button>

<button aria-label="Remove description section">
  <X className="h-4 w-4" />
</button>
```

### Visual Clarity
- Sufficient color contrast (4.5:1 minimum)
- Clear hover states
- Icon + text for important actions
- Consistent patterns throughout

## Responsive Behavior

### Mobile Adaptations
- Maintain full functionality on mobile
- Dropdowns become bottom sheets on small screens
- Touch targets at least 44x44px
- Simplified spacing for narrow viewports

```tsx
<button className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 py-1 md:py-0.5">
  <Plus className="h-5 w-5 md:h-4 md:w-4" />
  Add description
</button>
```

## Animation Guidelines

### When to Animate
- ❌ Don't animate section appearance (instant feels snappier)
- ✅ Animate hover states (subtle)
- ✅ Animate drag-and-drop (if applicable)
- ✅ **Animate drawer/modal open** (essential for good UX)

### Animation Specs

**For inline sections (inside Lego forms):**
```css
/* No animation - instant feels snappier */
```

**For drawers and modals:**
```tsx
// Backdrop
<div className="fixed inset-0 bg-black/20 z-40 animate-in fade-in duration-200">

// Drawer sliding from right
<div className="fixed inset-y-0 right-0 ... animate-in slide-in-from-right duration-300">

// Drawer sliding from left
<div className="fixed inset-y-0 left-0 ... animate-in slide-in-from-left duration-300">
```

**Timing:**
- Backdrop: 200ms (quick fade)
- Drawer: 300ms (smooth slide)
- Hover states: 150ms
- Use ease-in-out for natural feel
- Only animate opacity, transform, colors

## Real-World Example: Task Creation

```tsx
export default function LegoStyleForm() {
  // Required fields - always visible
  const [assignees, setAssignees] = useState<string[]>([])
  const [goal, setGoal] = useState("")

  // Optional sections
  const [showDescription, setShowDescription] = useState(false)
  const [description, setDescription] = useState("")
  
  const [showDueDate, setShowDueDate] = useState(false)
  const [dueDate, setDueDate] = useState("")
  
  const [showChecklist, setShowChecklist] = useState(false)
  const [checklist, setChecklist] = useState<Item[]>([])

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-1">
      {/* Required: Assignees */}
      <div className="group">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-slate-500">Assigned to</span>
          {assignees.map(id => (
            <AssigneeBadge key={id} id={id} onRemove={() => removeAssignee(id)} />
          ))}
          <AddPersonButton onAdd={addAssignee} />
        </div>
      </div>

      {/* Required: Goal */}
      <div>
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="What's the goal?"
          className="w-full text-3xl font-semibold text-slate-900 placeholder-slate-300 bg-transparent border-none outline-none py-2"
        />
      </div>

      {/* Optional sections */}
      <div className="space-y-2 pt-4">
        {/* Description */}
        {!showDescription ? (
          <button
            onClick={() => setShowDescription(true)}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 py-1"
          >
            <Plus className="h-4 w-4" />
            Add description
          </button>
        ) : (
          <DescriptionSection
            value={description}
            onChange={setDescription}
            onRemove={() => {
              setShowDescription(false)
              setDescription("")
            }}
          />
        )}

        {/* More optional sections... */}
      </div>
    </div>
  )
}
```

## Benefits of Lego Style

### For Users
- **Less overwhelming**: Start with just what's needed
- **Faster**: Skip irrelevant fields entirely
- **Flexible**: Add/remove as situation changes
- **Discoverable**: See what's available without it being forced
- **Intuitive**: Mimics document writing, not form-filling

### For Development
- **Modular**: Each section is self-contained component
- **Testable**: Sections can be tested independently
- **Maintainable**: Easy to add new optional sections
- **Consistent**: Pattern repeats across entire app
- **State-driven**: Simple boolean flags control visibility

## Component Library

### Reusable Building Blocks

```tsx
// Add Button
export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 py-1"
    >
      <Plus className="h-4 w-4" />
      {label}
    </button>
  )
}

// Remove Button
export function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-slate-400 hover:text-slate-600">
      <X className="h-4 w-4" />
    </button>
  )
}

// Section Header
export function SectionHeader({ 
  icon: Icon, 
  label, 
  onRemove 
}: { 
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-slate-500" />
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </div>
      <RemoveButton onClick={onRemove} />
    </div>
  )
}

// Badge Chip
export function BadgeChip({
  avatar,
  label,
  onRemove
}: {
  avatar?: string;
  label: string;
  onRemove: () => void;
}) {
  return (
    <Badge className="rounded-full bg-slate-100 text-slate-700 pl-1 pr-2 py-1 text-sm font-medium hover:bg-slate-200 cursor-pointer">
      {avatar && (
        <img src={avatar} alt="" className="h-5 w-5 rounded-full mr-1.5" />
      )}
      {label}
      <X className="ml-1 h-3 w-3" onClick={onRemove} />
    </Badge>
  )
}
```

## Extending the Pattern

### Adding New Sections
1. Add state for visibility: `const [showX, setShowX] = useState(false)`
2. Add state for data: `const [xData, setXData] = useState(initialValue)`
3. Add button in optional sections list
4. Create conditional section content
5. Include remove handler that clears both states

### Nesting Sections
- Sections can contain subsections
- Use additional left padding for hierarchy (pl-6, pl-12)
- Maintain same add/remove patterns
- Keep depth shallow (max 2-3 levels)

## Future Enhancements

### Potential Additions
- **Drag-to-reorder**: Reorder optional sections
- **Templates**: Save common configurations
- **Keyboard shortcuts**: Cmd+K to add sections
- **Section search**: Quick-add via search
- **Auto-save**: Persist state as user builds
- **Undo/Redo**: History of section changes

## Conclusion

The Lego Style UI pattern creates a powerful, flexible interface that respects user agency and reduces cognitive load. By starting minimal and allowing organic growth, it aligns perfectly with modern UX principles while maintaining a clean, document-like aesthetic.

**Key Takeaway**: Give users building blocks, not a blueprint. Let them construct what they need, when they need it.

