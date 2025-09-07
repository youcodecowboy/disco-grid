# Component Library Documentation

*Last Updated: September 5, 2025*
*Version: 1.1.0*

## 🎯 Fully Functional Components

### 🧱 MetricKPI (KPI Metric)
**File**: `components/blocks/MetricKPI.tsx`
**Type**: `metric.kpi`

**Features**:
- **Single KPI**: Large value with delta and mini trend bars
- **Responsive**: Uses container queries + `clamp()` to avoid overlap
- **No Inner Header**: Designed to live inside a card header

**Props**:
```ts
interface MetricData { value: string; delta: string; trend: number[] }
```
```tsx
<MetricKPI title="Total Materials" data={{ value: "2,431", delta: "+4.2%", trend: [12,14,13,16,18,21,24] }} />
```

---

### 📝 NoteBlock (Markdown/Activity Note)
**File**: `components/blocks/NoteBlock.tsx`
**Type**: `note`

**Features**:
- **Markdown‑ish rendering**: `#`, `##`, `###`, bullets, and basic `**bold**`
- **Activity list**: Optional `activities` list with timestamp
- **Header control**: Supports `hideTitle` to avoid duplicate titles in cards

**Props**:
```ts
interface NoteData { body?: string; activities?: { text: string; time?: string }[] }
// Common BlockProps now includes: hideTitle?: boolean
```
```tsx
<NoteBlock data={{ body: "# Welcome\n• Drag and resize blocks" }} hideTitle />
```

---

### 📦 Materials Domain

#### InboundWeek
**File**: `components/blocks/InboundWeek.tsx`
**Type**: `materials.inbound.week`

**Features**:
- Weekly calendar of inbound deliveries by day
- Status badges: `confirmed`, `pending`, `delayed`
- Compact, scrollable day lists
- Supports `hideTitle`

**Props**:
```ts
interface DeliveryEvent { date: string; po: string; supplier: string; category: string; items?: number; status?: 'pending'|'confirmed'|'delayed' }
interface InboundWeekData { startDate?: string; deliveries?: DeliveryEvent[] }
```

#### MaterialsUsage
**File**: `components/blocks/MaterialsUsage.tsx`
**Type**: `materials.usage`

**Features**:
- Summary cards: current stock, runout days, runout date
- Utilization progress bar
- Category usage list and “At‑Risk” items
- Supports `hideTitle`

**Props**:
```ts
interface UsageData {
  currentStock: number; dailyUsage: number; projectedRunoutDays: number;
  projectedRunoutDate?: string;
  categories?: { name: string; stock: number; dailyUsage: number }[];
  atRisk?: { name: string; stock: number; dailyUsage: number; runoutDays: number }[];
}
```

#### OverdueShipments
**File**: `components/blocks/OverdueShipments.tsx`
**Type**: `materials.overdue`

**Features**:
- Overdue PO list with supplier, category, ETA, and days overdue
- Severity coloring by days overdue
- Supports `hideTitle`

**Props**:
```ts
interface OverdueItem { po: string; supplier: string; category: string; eta: string; daysOverdue: number }
interface OverdueData { items?: OverdueItem[] }
```

#### SupplierLeadTimes
**File**: `components/blocks/SupplierLeadTimes.tsx`
**Type**: `materials.supplier.leadtime`

**Features**:
- Supplier cards with average lead time and on‑time rate bar
- Supports `hideTitle`

**Props**:
```ts
interface SupplierInfo { name: string; avgDays: number; onTimeRate?: number }
interface SupplierData { suppliers?: SupplierInfo[] }
```

---

### 📋 TableMalleable (Table)
**File**: `components/blocks/TableMalleable.tsx`
**Type**: `table.malleable`

**Features**:
- **Dynamic Columns**: Add/remove columns with different data types
- **Column Types**: Text, Number, Date, Status, Select (dropdown)
- **Inline Editing**: Click any cell to edit directly
- **Excel-like Interface**: Familiar spreadsheet experience
- **Column Configuration**: Edit column properties (name, type, width, required)
- **Data Management**: Add/remove rows and columns dynamically
- **Status Badges**: Color-coded status indicators
- **Date Formatting**: Proper date display and editing
- **Number Formatting**: Locale-aware number formatting
- **Column Name Editing**: Click settings icon in column headers to edit

**Props**:
```typescript
interface TableMalleableProps {
  title?: string
  columns: Column[]
  data: TableData[]
  onDataChange?: (data: TableData[]) => void
  onColumnsChange?: (columns: Column[]) => void
  editable?: boolean
  className?: string
}
```

**Column Types**:
- `text`: Plain text input
- `number`: Numeric values with formatting
- `date`: Date picker with formatting
- `status`: Color-coded status badges
- `select`: Dropdown with custom options

**Usage Example**:
```typescript
<TableMalleable
  title="Table"
  columns={[
    { id: "name", name: "Task Name", type: "text", width: 200 },
    { id: "status", name: "Status", type: "status", width: 120 },
    { id: "priority", name: "Priority", type: "select", width: 100, options: ["Low", "Medium", "High"] },
    { id: "dueDate", name: "Due Date", type: "date", width: 120 },
    { id: "progress", name: "Progress", type: "number", width: 100 }
  ]}
  data={[
    { id: "1", name: "Design Review", status: "active", priority: "High", dueDate: "2024-12-25", progress: 75 }
  ]}
/>
```

---

### 📅 CalendarBlock (Interactive Calendar)
**File**: `components/blocks/CalendarBlock.tsx`
**Type**: `calendar`

**Features**:
- **Month Navigation**: Previous/next month navigation
- **Event Display**: Show events on calendar days
- **Event Types**: Meeting, Deadline, Reminder, Task with color coding
- **Event Management**: Add new events to selected dates
- **Event Details**: View event details for selected dates
- **Today Highlighting**: Current day is highlighted
- **Event Legend**: Color-coded event type legend
- **Responsive Design**: Works across different screen sizes
- **Date Selection**: Click dates to view events

**Props**:
```typescript
interface CalendarBlockProps {
  title?: string
  events?: Event[]
  onEventAdd?: (event: Event) => void
  onEventClick?: (event: Event) => void
  className?: string
}
```

**Event Types**:
- `meeting`: Blue - Team meetings, calls
- `deadline`: Red - Important deadlines
- `reminder`: Yellow - General reminders
- `task`: Green - Tasks and to-dos

**Usage Example**:
```typescript
<CalendarBlock
  title="Team Calendar"
  events={[
    { id: "1", title: "Team Meeting", date: new Date(2024, 11, 20), type: "meeting", description: "Weekly sync" },
    { id: "2", title: "Product Launch", date: new Date(2024, 11, 25), type: "deadline", description: "Final prep" }
  ]}
  onEventAdd={(event) => console.log('New event:', event)}
  onEventClick={(event) => console.log('Event clicked:', event)}
/>
```

---

### 📊 ChartAreaInteractive (Interactive Area Chart)
**File**: `components/blocks/ChartAreaInteractive.tsx`
**Type**: `chart.area.interactive`

**Features**:
- **Interactive Charts**: Hover effects and tooltips
- **Data Filtering**: Filter by different metrics
- **Responsive Design**: Adapts to container size
- **Manufacturing Metrics**: Production, efficiency, quality, delivery data
- **Color-coded Metrics**: Different colors for each metric type
- **Smooth Animations**: Smooth transitions and interactions
- **Recharts Integration**: Built on Recharts library

**Props**:
```typescript
interface ChartAreaInteractiveProps {
  block: Block
}
```

**Data Structure**:
```typescript
const chartData = [
  { date: "Jan", production: 1200, efficiency: 85, quality: 92, delivery: 88 },
  { date: "Feb", production: 1350, efficiency: 87, quality: 94, delivery: 90 },
  // ... more data points
]
```

---

### 📋 TableOrders (Production Table)
**File**: `components/blocks/TableOrders.tsx`
**Type**: `table`

**Features**:
- **Production Tracking**: Track items through manufacturing stages
- **Progress Indicators**: Visual progress bars
- **Status Badges**: Color-coded stage indicators
- **Stage Management**: Planning, Cutting, Sewing, Finishing, Packing
- **Item Details**: Product names, IDs, and progress percentages

**Usage**:
```typescript
<TableOrders block={block} />
```

---

### 📈 Production Pipeline Metrics
**Type**: `metric` with `stages` prop

**Features**:
- **Stage Overview**: Visual representation of production pipeline
- **Count Display**: Number of items in each stage
- **Icon Integration**: Stage-specific icons
- **Compact Layout**: Efficient use of space
- **Real-time Updates**: Dynamic count updates

**Data Structure**:
```typescript
props: {
  stages: [
    { name: "Planning", count: 24, icon: "planning" },
    { name: "Cutting", count: 18, icon: "cutting" },
    { name: "Sewing", count: 32, icon: "sewing" },
    { name: "Finishing", count: 15, icon: "finishing" },
    { name: "Packing", count: 8, icon: "packing" }
  ]
}
```

---

### 📊 Efficiency Metrics (Configurable)
**Type**: `metric` with `value` and `delta` props

**Features**:
- **Single Metric Display**: Large, prominent metric value
- **Delta Indicators**: Change vs previous period
- **Configurable Layout**: Adapts to container size
- **Edit Mode**: Configuration panel for customization
- **Visual Hierarchy**: Clear value and context display

**Data Structure**:
```typescript
props: {
  value: "87.3%",
  delta: "+2.1% vs last week"
}
```

---

### 📝 Welcome Block (see NoteBlock)
Use `NoteBlock` above for markdown/activities. Prefer passing `hideTitle` when the card already contains a header.

---

### 📋 Activity Timeline
**File**: `components/blocks/ActivityTimeline.tsx`
**Type**: `activity.timeline`

**Features**:
- **Chronological Display**: Time-based activity feed
- **Status Indicators**: Color-coded activity types
- **Time Stamps**: Relative time display
- **Activity Types**: Production, quality, delays, completions
- **Compact Layout**: Efficient information display

**Data Structure**:
```typescript
props: {
  activities: [
    { id: 1, type: "production", message: "Batch moved to Sewing", time: "2 min ago", status: "info" },
    { id: 2, type: "quality", message: "Quality check completed", time: "15 min ago", status: "success" }
  ]
}
```

---

## 🧩 Core System Components

### GridCanvas
**File**: `components/GridCanvas.tsx`

**Features**:
- **Grid Layout Management**: Handles component positioning
- **Drag & Drop**: Smooth component movement
- **Resize Handles**: Dynamic component resizing
- **Collision Detection**: Prevents component overlaps
- **Responsive Grid**: Adapts to different screen sizes
- **Visual Feedback**: Drag previews and hover states

### GridCard
**File**: `components/GridCard.tsx`

**Features**:
- **Component Container**: Wraps all block components
- **Control Panel**: Edit, AI, notifications, extend, delete buttons
- **Resize Handles**: Corner and edge resize controls
- **Drag Handle**: Title bar for dragging
- **Content Containment**: Proper overflow handling
- **State Management**: Edit/save mode switching

### BlockEditModal
**File**: `components/BlockEditModal.tsx`

**Features**:
- **Component Configuration**: Edit component properties
- **Real-time Preview**: See changes as you edit
- **Property Controls**: Input fields, selects, color pickers
- **Data Management**: Edit component data and settings
- **Validation**: Input validation and error handling

---

## 🎨 Mock/Placeholder Components

### Chart Components
- **ChartBar** (`chart.bar`): Bar chart visualization
- **ChartLine** (`chart.line`): Line chart with trends
- **ChartDonut** (`chart.donut`): Donut chart for proportions
- **ChartArea** (`chart.area`): Area chart for trends
- ✅ **ChartScatter** (`chart.scatter`): Scatter plot; now wired in BlockRenderer

### UI Components
- **CommandsQuick**: Quick action buttons
- **FilterItems**: Data filtering interface
- **KanbanSimple**: Simple kanban board
- **CalendarMini**: Mini calendar widget
- **MessagesPreview**: Message preview component
- **MetricItems**: Metric display component
- ✅ **MessagesPanel** (`messages.panel`): Conversations list
- ✅ **NotificationsPanel** (`notifications.panel`): Notification list with badges
- ✅ **AnalyticsSummary** (`analytics.summary`): Grid of key stats
- ✅ **CapacityTracker** (`capacity.tracker`): Overall/team utilization

---

## 🚀 Component Development Guidelines

### Creating New Components

1. **File Structure**:
   ```
   components/blocks/ComponentName.tsx
   ```

2. **Component Template**:
   ```typescript
   "use client"
   
   import React from 'react'
   import { Button } from '@/components/ui/button'
   
   interface ComponentNameProps {
     title?: string
     className?: string
     // Add specific props
   }
   
   export function ComponentName({
     title = "Component Title",
     className = "",
     // Destructure props
   }: ComponentNameProps) {
     return (
       <div className={`bg-white rounded-lg border ${className}`}>
         {/* Component content */}
       </div>
     )
   }
   ```

3. **Integration Steps**:
   - Add import to `app/page.tsx`
   - Add block definition to `initialState.blocks`
   - Add layout position to `initialState.layout`
   - Add rendering case to `renderBlockContent`

### Best Practices

1. **Responsive Design**: Use Tailwind responsive classes
2. **Content Containment**: Always use `overflow-hidden` on containers
3. **Accessibility**: Include proper ARIA labels and keyboard navigation
4. **Performance**: Use React.memo for expensive components
5. **Type Safety**: Define proper TypeScript interfaces
6. **Error Handling**: Include error boundaries and fallbacks

---

## 💡 Future Component Ideas

### Data Visualization
- **Heatmap**: Data density visualization
- **Scatter Plot**: Correlation analysis
- **Gantt Chart**: Project timeline management
- **Funnel Chart**: Conversion tracking
- **Radar Chart**: Multi-dimensional analysis

### Interactive Components
- **Kanban Board**: Full kanban with drag & drop
- **Gantt Timeline**: Project management timeline
- **Data Grid**: Advanced spreadsheet functionality
- **Form Builder**: Dynamic form creation
- **Workflow Designer**: Visual workflow creation

### Communication
- **Chat Interface**: Real-time messaging
- **Notification Center**: Centralized notifications
- **Comment System**: Component-level comments
- **Collaboration Tools**: Multi-user features

### Analytics
- **Dashboard Builder**: Custom dashboard creation
- **Report Generator**: Automated report creation
- **Data Connectors**: External data integration
- **Alert System**: Automated alerts and notifications

---

## 📝 Recent Updates

### September 5, 2025
- ✅ Added: `metric.kpi` (KPI card) with responsive scaling
- ✅ Added: `note` via `NoteBlock` with `hideTitle` support
- ✅ Added materials blocks: `materials.inbound.week`, `materials.usage`, `materials.overdue`, `materials.supplier.leadtime`
- ✅ Wired: `chart.scatter`, `messages.panel`, `notifications.panel`, `analytics.summary`, `capacity.tracker`
- ✅ Header behavior: Components can receive `hideTitle` to suppress internal headers; card header is canonical

### December 19, 2024
- ✅ Added TableMalleable: Table with dynamic columns and inline editing
- ✅ Added CalendarBlock: Interactive calendar with event management
- ✅ Enhanced ChartAreaInteractive: Improved data filtering and responsiveness
- ✅ Updated Component Library: Comprehensive documentation for all components
- ✅ Fixed Dashboard Persistence: localStorage persistence for saved layouts

### Planned Updates
- 🔄 **Advanced Table Features**: Sorting, filtering, pagination
- 🔄 **Calendar Enhancements**: Recurring events, event categories
- 🔄 **Chart Improvements**: More chart types and customization options
- 🔄 **Component Templates**: Pre-built component templates
- 🔄 **Data Integration**: API connectors and real-time data

---

*This documentation is maintained as part of the Groovy dashboard development process. Components are continuously improved and new features are added based on user feedback and development needs.*
