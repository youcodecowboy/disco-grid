# Reports System - Phase 2 Enhancements

## Overview

Enhanced UX improvements to make the report builder more intuitive and functional.

## New Features

### 1. Report Details Section (Top of Sidebar)

**Location:** Top of sidebar, above added blocks list

**Contents:**
- Report title input (editable)
- Recipients selector (who receives this report)
- Creator info display
- Description textarea (optional)
- Tags/category selector
- Collapsible section with header

**Purpose:** Centralize report metadata in one place

### 2. Added Blocks List

**Location:** Below details section, above "+ Add..." buttons

**Features:**
- Shows all blocks added to the report in order
- Each item displays: Block type icon + Custom title or type name
- Click item to edit - reopens configuration panel with current values
- Remove button (×) on each item
- Drag handle icon for future reordering capability
- Current/editing indicator

**Benefits:**
- See what's in the report at a glance
- Quick access to edit any block
- Visual feedback of report structure

### 3. Sticky Footer (Bottom of Sidebar)

**Location:** Fixed at bottom of sidebar, always visible

**Buttons:**
1. **Send Now** - Generate and send report immediately
2. **Schedule Send** - Open scheduling modal for automation
3. **Save as Template** - Save report structure for reuse

**Additional:**
- Program indicator showing if report is scheduled
- Next run time display
- Status badge (Draft, Active, Paused)

### 4. Inline Preview Editing

**Click-to-Edit:**
- Click any block in preview to edit it
- Block highlights with blue border
- Sidebar auto-scrolls to and opens configuration panel
- Shows "Editing: [Block Title]" at top of config
- Changes update preview in real-time
- Save/Cancel buttons in config panel

**Editable Blocks:**
- **KPI Grid:** Click to change metrics, layout
- **Chart:** Click to change type, data source, title
- **Table:** Click to configure columns, filters, limit
- **Heading:** Double-click for inline text editing
- **Timeline:** Click to configure date range
- **Text:** Double-click for inline textarea editing

**Benefits:**
- More intuitive than sidebar-only editing
- Visual feedback on what you're editing
- Faster iteration workflow

### 5. Scheduling Modal

**Triggered by:** "Schedule Send" button

**Configuration Options:**

**Cadence:**
- Daily
- Weekly (select days: Mon, Tue, Wed, Thu, Fri, Sat, Sun)
- Monthly (select day: 1-31 or "Last day")
- Quarterly (select month of quarter)
- Custom (cron expression)

**Time:**
- Time picker (HH:MM)
- Timezone selector

**Recipients:**
- Add from contacts
- Distribution lists
- External emails
- Per-recipient customization

**Format:**
- PDF (default)
- Excel
- HTML (interactive)

**Distribution:**
- Email
- Slack
- SMS (for alerts)
- Webhook

**Advanced:**
- Start date / End date
- Skip weekends
- Skip holidays
- Conditions (only send if data threshold met)

### 6. Save as Template

**Triggered by:** "Save as Template" button

**Options:**
- Template name
- Description
- Category/tags
- Visibility (Private, Team, Organization)
- Default data sources
- Configurable placeholders

**Benefit:** Reuse report structures quickly

## Additional Block Types (Future Roadmap)

### 7. Metric Comparison Block
- Side-by-side comparison (This Month vs Last Month)
- Percentage change
- Color-coded

### 8. Gauge Chart Block
- Single metric with target
- Color zones
- Visual progress

### 9. Heatmap Block
- Activity patterns
- Calendar heatmap
- Intensity visualization

### 10. Leaderboard Block
- Top performers
- Ranked list
- Profile pictures

### 11. Image Block
- Upload or URL
- Captions
- Sizing options

### 12. Divider Block
- Visual separator
- Horizontal line
- Optional label

## Component Changes

### ReportBuilderSidebar (Enhanced)

**New Structure:**
```
┌─────────────────────────────┐
│ Report Details              │ ← New
│  - Title                    │
│  - Recipients               │
│  - Description              │
├─────────────────────────────┤
│ Added Blocks (3)            │ ← New
│  → KPI Grid: Key Metrics    │
│  → Chart: Daily Progress    │
│  → Table: Recent Orders     │
├─────────────────────────────┤
│ + Add KPI Grid              │
│ + Add Chart                 │
│ + Add Table                 │
│ + Add Heading               │
│ + Add Timeline              │
│ + Add Text                  │
├─────────────────────────────┤
│ [Send Now] [Schedule] [⋮]   │ ← New Sticky Footer
└─────────────────────────────┘
```

### New Components to Build

1. **ReportDetailsForm.tsx**
   - Report metadata inputs
   - Recipients selector
   - Tags/category
   
2. **AddedBlocksList.tsx**
   - List of added blocks
   - Click to edit
   - Remove functionality
   
3. **SidebarFooter.tsx**
   - Sticky footer
   - Action buttons
   - Status display
   
4. **SchedulingModal.tsx**
   - Full scheduling interface
   - Cadence configuration
   - Recipients management
   
5. **SaveTemplateModal.tsx**
   - Template name/description
   - Visibility settings

### Enhanced ReportPreview

**New Features:**
- `selectedBlockId` state
- Click handlers on blocks
- Visual highlight for selected block
- Keyboard shortcuts (Delete key)
- Inline editing for text blocks

## Implementation Plan

### Phase 2A - Sidebar Enhancements
1. ✅ Create ReportDetailsForm component
2. ✅ Create AddedBlocksList component
3. ✅ Integrate into ReportBuilderSidebar
4. ✅ Add state management for block selection
5. ✅ Create SidebarFooter component
6. ✅ Make footer sticky

### Phase 2B - Inline Editing
1. ✅ Add click handlers to blocks in preview
2. ✅ Visual highlight for selected block
3. ✅ Sync selection between preview and sidebar
4. ✅ Auto-open config when block clicked
5. ✅ Add "Editing" indicator in sidebar
6. ✅ Real-time preview updates

### Phase 2C - Scheduling & Templates
1. ✅ Create SchedulingModal component
2. ✅ Implement scheduling logic
3. ✅ Create SaveTemplateModal component
4. ✅ Template save functionality
5. ✅ Wire up footer buttons

### Phase 2D - Additional Blocks
1. Metric Comparison block
2. Gauge Chart block
3. Heatmap block
4. Leaderboard block
5. Image block
6. Divider block

## Technical Notes

**State Management:**
```typescript
// Enhanced state
const [reportDetails, setReportDetails] = useState({
  title: 'Untitled Report',
  recipients: [],
  creator: currentUser,
  description: '',
  tags: [],
});

const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
const [editingBlockId, setEditingBlockId] = useState<string | null>(null);

const [schedule, setSchedule] = useState<ScheduleConfig | null>(null);
```

**Block Selection:**
```typescript
const handleBlockClick = (blockId: string) => {
  setSelectedBlockId(blockId);
  setEditingBlockId(blockId);
  // Scroll sidebar to configuration
};
```

**Save as Template:**
```typescript
const handleSaveTemplate = (templateData: TemplateData) => {
  const template = {
    name: templateData.name,
    description: templateData.description,
    blocks: blocks.map(b => ({
      type: b.type,
      config: b.config,
    })),
    category: templateData.category,
    isPublic: templateData.visibility === 'organization',
  };
  // Save to database
};
```

## Design Specifications

### Report Details Section
- Background: slate-50
- Border: slate-200
- Padding: p-4
- Inputs: Full width
- Label style: text-xs text-slate-600

### Added Blocks List
- Max height: 200px with scroll
- Each item: hover:bg-slate-50
- Selected item: bg-blue-50 border-l-2 border-blue-500
- Icons: h-4 w-4 mr-2
- Text: text-sm truncate

### Sticky Footer
- Position: sticky bottom-0
- Background: white
- Border-top: slate-200
- Padding: p-4
- Shadow: shadow-lg
- Buttons: Full width stack on mobile

### Selected Block Highlight
- Border: 2px solid blue-500
- Background: blue-50/10
- Transition: all 150ms

## Success Metrics

- ✅ All metadata editable in sidebar
- ✅ Visual list of added blocks
- ✅ Click-to-edit works smoothly
- ✅ Scheduling modal fully functional
- ✅ Templates can be saved and loaded
- ✅ Sticky footer always accessible
- ✅ Professional, polished UI

