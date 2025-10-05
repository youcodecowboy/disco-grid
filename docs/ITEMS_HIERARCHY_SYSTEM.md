# Items Hierarchy & Management System

## Overview

This document outlines the multi-level item management system for fashion manufacturing, designed to handle everything from master SKUs down to individual serialized items and their components. The system is built with domain-agnostic flexibility at its core, allowing users to customize views and data for varying complexity levels.

### Critical Requirement: Mobile Floor App Integration

**The item pages must be mobile-first and optimized for factory floor usage.** Workers on the production floor will scan QR codes on items using mobile devices (phones/tablets) and need immediate access to relevant item information. This creates two parallel use cases:

1. **Desktop/Admin View**: Full malleable grid system with complete data and customization
2. **Mobile/Floor View**: Streamlined, task-focused interface optimized for quick scanning and updates

Both views access the same underlying data but present it differently based on context and screen size.

---

## Floor App Requirements

### Purpose & Context
Factory floor workers need to:
- **Scan QR codes** on items, components, or materials
- **View current status** and next steps quickly
- **Update progress** (mark stages complete, report issues)
- **Access critical info** without scrolling/searching
- **Work offline** (with sync when connection restored)

### Mobile Optimization Strategy

#### Responsive Design Philosophy
1. **Adaptive Layout**: 
   - Desktop: Full malleable grid with all blocks
   - Tablet: Simplified grid with priority blocks
   - Mobile: Single-column, card-based layout with essential info

2. **Progressive Disclosure**:
   - Show critical info first (status, next action, location)
   - Secondary info behind expandable sections
   - Advanced features (editing, bulk actions) require authentication/permissions

3. **Touch-Optimized**:
   - Large tap targets (min 44x44px)
   - Swipe gestures for navigation
   - Pull-to-refresh for updates
   - Haptic feedback for actions

#### Floor App User Interface

**Route:** `/floor/items/[instanceId]` or `/floor/scan`

**Simplified View Components:**

```typescript
type FloorViewMode = "scan" | "view" | "update" | "report"

type FloorItemView = {
  // Emphasized info for quick scanning
  primaryInfo: {
    itemName: string
    itemCode: string
    status: ItemStatus
    currentStage: string
    nextAction: string          // "Move to Assembly" or "QA Inspection Required"
    location: string
    quantity: number
  }
  
  // Quick access actions
  quickActions: {
    markComplete: boolean       // Can worker mark stage complete?
    reportIssue: boolean
    viewDetails: boolean
    scanNext: boolean
  }
  
  // Collapsed by default, expandable
  expandableInfo: {
    attributes: Array<{ field: string; value: string }>
    workflow: WorkflowProgress
    components: ComponentSummary[]
    history: RecentActivity[]
  }
}
```

**Mobile Layout Priorities (Top to Bottom):**

1. **Header Bar** (Fixed)
   - Item code + Status badge
   - Back button, Menu button

2. **Hero Card** (Scrollable)
   - Large item name
   - Visual indicator of current stage (progress bar)
   - "Next Action" prominently displayed
   - Location badge

3. **Quick Info Cards**
   - Quantity
   - Assigned team/owner
   - Timeline (days remaining)

4. **Action Buttons** (Sticky Bottom)
   - Primary: "Mark Complete" / "Update Stage"
   - Secondary: "Report Issue"
   - Tertiary: "View Full Details" (links to full page)

5. **Expandable Sections** (Accordion)
   - Attributes
   - Components (if complex)
   - Activity log
   - Attachments

#### Mobile vs Desktop Behavior

| Feature | Desktop | Mobile (Floor App) |
|---------|---------|-------------------|
| Layout | Malleable grid | Fixed, optimized stack |
| Editing | Inline, full access | Limited to status/progress |
| Blocks | All visible, customizable | Essential only, expandable |
| Navigation | Breadcrumbs, sidebar | Bottom nav, swipe back |
| Actions | Toolbar with many options | Large primary CTAs |
| Scanning | N/A | QR scanner integrated |
| Offline | Optional | Critical requirement |

---

## Item Hierarchy Structure

### Level 1: All Items Page (Master Level)
**Route:** `/app/items/page.tsx`  
**Current State:** Exists but needs enhancement  
**Purpose:** High-level inventory view of all master items/SKUs

#### Data Model
```typescript
type MasterItem = {
  id: string                    // Master SKU ID
  name: string                  // e.g., "Aurora Flight Jacket"
  code: string                  // e.g., "JKT-AURORA-001"
  category: string              // e.g., "Outerwear"
  totalQuantity: number         // Aggregate of all instances
  orders: OrderReference[]      // Connected orders
  status: ItemStatus            // Active, Discontinued, etc.
  thumbnail?: string
  lastUpdated: string
  activeInstances: number       // How many are in production
}

type OrderReference = {
  orderId: string
  orderName: string
  quantity: number
  status: string
}
```

#### Features Required
- **Table View** with master items (current TableMalleable component)
  - Show: Item name, SKU, category, total quantity, # of orders, status, last updated
  - Click row → Navigate to Item View (Level 2)
  
- **Metrics Cards** showing:
  - Total unique master items
  - Total items in production
  - Items by category
  - Low stock alerts

- **Filtering & Search:**
  - By category, status, order
  - Search by name or SKU
  
- **Actions:**
  - Create new master item
  - Bulk operations (archive, categorize)

---

### Level 2: Item View (Batch/Style Level)
**Route:** `/app/items/[itemId]/page.tsx`  
**Current State:** Does not exist - needs to be built  
**Purpose:** View all instances of a master item across orders

#### Data Model
```typescript
type ItemView = {
  masterItem: MasterItem
  instances: ItemInstance[]     // All instances of this item
  aggregateData: {
    totalQuantity: number
    byOrder: Record<string, number>
    byStatus: Record<string, number>
    byLocation: Record<string, number>
  }
}

type ItemInstance = {
  id: string                    // Unique instance ID
  orderId: string
  orderName: string
  quantity: number
  status: ItemStatus
  workflow: string
  currentStage?: string
  location: string
  startDate: string
  endDate: string
  assignedTeam: string
  owner: string
  // All attributes from order creation
  attributes: Array<{ field: string; value: string }>
}
```

#### Features Required

##### Overview Section
- Master item details (name, SKU, description, image)
- Aggregate metrics:
  - Total quantity across all orders
  - Breakdown by order
  - Status distribution (Draft, In Production, Completed)
  - Location distribution

##### Instances Table
- **Columns:** Order name, Quantity, Status, Workflow, Current stage, Location, Team, Owner
- **Click row** → Navigate to Individual Item Page (Level 3)
- **Filtering:** By order, status, location, team
- **Grouping:** Option to group by order or status

##### Attributes Panel
- Show all attributes collected during order creation
- May vary by instance if customized per order
- Editable if in Draft status

##### Timeline Visualization
- Show production timeline across all instances
- Gantt-chart style view of when different batches are in production

##### Related Orders
- List all orders that include this item
- Quick navigation to order details

##### Actions
- Edit master item details
- Create new instance/batch
- Bulk update attributes
- Export data

---

### Level 3: Individual Item Page (Serial Level)
**Route:** `/app/items/[itemId]/[instanceId]/page.tsx`  
**Current State:** Does not exist - needs to be built  
**Purpose:** Detailed view of a specific item instance with full traceability

#### Data Model
```typescript
type IndividualItem = {
  id: string                    // Unique serialized ID
  masterItemId: string
  masterItemName: string
  itemCode: string
  orderId: string
  orderName: string
  
  // Core details from order creation
  quantity: number
  type: "simple" | "complex"
  status: ItemStatus
  summary: string
  
  // Production details
  workflow: string
  workflowStages: WorkflowStage[]
  currentStage?: string
  timeline: { start: string; end: string }
  location: string
  
  // Attributes (malleable/customizable)
  attributes: Array<{ field: string; value: string }>
  
  // Components (if complex)
  components: ComponentProfile[]
  
  // Team & ownership
  assignedTeam: string
  owner: string
  
  // Files & documentation
  attachments: Attachment[]
  
  // Traceability
  traceability: TraceabilityProfile
  digitalPassport?: DigitalPassport
  
  // Notifications
  notifications: NotificationSetting[]
  
  // Label/QR configuration
  labelFields: string[]
  labelLogo: boolean
  qrCode?: string
  
  // Activity log
  activityLog: ActivityEntry[]
}

type WorkflowStage = {
  stage: string
  owner: string
  status: "Planned" | "Active" | "Completed"
  startedAt?: string
  completedAt?: string
  notes?: string
}

type ActivityEntry = {
  id: string
  timestamp: string
  user: string
  action: string
  details: string
}
```

#### Page Layout - Malleable Grid System

**This is the critical innovation:** This page uses the same malleable grid system as the home page, allowing users to customize their view.

##### Default Layout Blocks

**Header Block (Fixed)**
- Item name, code, status badge
- Quick actions: Edit, Duplicate, Archive, Share
- QR code display

**Core Details Block**
- Basic info: Quantity, Type, Order reference
- Timeline: Start/end dates, current stage
- Team: Owner, assigned team
- Location

**Attributes Block (Resizable/Moveable)**
- Malleable table showing all attributes
- Add/edit/remove attributes dynamically
- This makes it domain-agnostic - users define what matters

**Workflow Progress Block**
- Visual stepper showing current stage
- Stage owners and status
- Timeline visualization
- Click to add notes or mark stages complete

**Components Block** (if type === "complex")
- List of sub-components
- Each component clickable → Navigate to Level 4
- Show quantity, status, workflow per component

**Attachments Block**
- List of files (specs, images, certificates)
- Upload new files
- Preview/download

**Traceability Block**
- Digital passport status
- Compliance regions
- Material certificates
- Lifecycle stages
- Carbon accounting (if enabled)

**Activity Timeline Block**
- Chronological log of all actions
- User, timestamp, action type
- Filterable by action type

**Notifications Block**
- Configure alerts (email, SMS, portal)
- Set cadence (stage completion, daily, exceptions)

**Custom Blocks** (User-Added)
- Users can add notes, metrics, charts
- Embed external data sources
- Link related items

##### Grid System Features
- **Edit Mode Toggle:** Switch between view and edit layout
- **Add Block:** Users can add custom widgets/blocks
- **Resize/Move:** Drag and drop blocks
- **Block Library:** Pre-built blocks for common use cases
- **Save Layouts:** Save custom layouts per item type or user preference

##### Mobile Responsive Behavior
When viewed on mobile/tablet (including Floor App):

- **Auto-collapse to single column** on screens <768px
- **Priority blocks show first**: Core details, workflow, quick actions
- **Expandable sections** for secondary data (attributes, attachments)
- **Bottom action bar** replaces toolbar
- **Swipe gestures**: Swipe left/right to navigate between components or stages
- **Touch-optimized controls**: Larger buttons, no hover states
- **Reduced animations** for better performance on lower-end devices

---

### Level 4: Component Level (For Complex Items)
**Route:** `/app/items/[itemId]/[instanceId]/components/[componentId]/page.tsx`  
**Current State:** Does not exist  
**Purpose:** Drill into sub-components of complex items

#### Data Model
```typescript
type ComponentProfile = {
  id: string
  name: string
  parentItemId: string
  quantity: number
  qrMode: string                // "Per unit" | "Per batch"
  notes: string
  workflow: string
  startDate: string
  location: string
  attributes: Array<{ field: string; value: string }>
  digitalPassportEnabled: boolean
  status: ItemStatus
  activityLog: ActivityEntry[]
}
```

#### Features
- **Similar malleable grid layout to Level 3**
- Component-specific attributes
- Independent workflow tracking
- Can have its own QR code
- Link back to parent item
- May have sub-sub-components (recursive if needed)

---

## QR Code Scanning Flow

### Desktop to Mobile Bridge

**Scenario 1: Worker scans QR code on factory floor**

1. Worker opens Floor App on mobile device
2. Taps "Scan" button (or app opens to camera)
3. Scans QR code on garment/component
4. QR code contains: `groovy://item/[itemId]/[instanceId]` or `groovy://component/[componentId]`
5. App parses code and navigates to mobile-optimized item view
6. Shows immediate info: status, next action, location
7. Worker can update status, report issue, or view details

**Scenario 2: Admin generates QR code in desktop app**

1. Admin on Level 3 (Individual Item Page) desktop view
2. Clicks "QR Code Block" or "Generate Label" action
3. System generates QR code containing item URL
4. Admin prints label or sends to label printer
5. QR code gets attached to physical item
6. Workers on floor can now scan and access item data

### QR Code Data Structure

```typescript
type QRCodePayload = {
  version: string              // "v1"
  type: "item" | "component" | "batch"
  id: string                   // Unique ID
  itemCode: string            // Human-readable code
  timestamp: string           // When generated
  checksum: string            // Validation
}

// Encoded as URL: https://app.groovy.com/floor/scan?d=[encoded_payload]
// Or custom scheme: groovy://item/[itemId]/[instanceId]
```

### Offline Capability

**Critical for factory floor usage:**

- **Cache item data** when scanned for first time
- **Queue updates** when offline (mark complete, add notes)
- **Sync on reconnect** with conflict resolution
- **Visual indicator** showing online/offline status
- **Local storage** for recently viewed items (last 50)

---

## Technical Implementation Plan

### Phase 1: Data Structure & API (Week 1-2)
**Goal:** Establish data models and backend structure

#### Tasks
1. **Define TypeScript types** (in `/lib/data/items.ts`)
   - MasterItem, ItemView, IndividualItem, ComponentProfile
   - FloorItemView (mobile-optimized view)
   - QRCodePayload
   - Extend existing ItemProfile from orders/new/types.ts
   
2. **Create mock data generators**
   - Generate master items linked to order data
   - Create instances from SEED_ITEMS
   - Build relationships between orders and items
   - Generate QR codes for test items

3. **Data access layer**
   - Functions to fetch master items
   - Get item instances by master ID
   - Get individual item by instance ID
   - Get components by item ID
   - **Parse QR code and resolve to item**
   - **Lightweight API for mobile (minimal payload)**

4. **Storage strategy**
   - localStorage for prototyping (consistent with current approach)
   - Keys: `groovy:master-items:v1`, `groovy:item-instances:v1`
   - **Service Worker** for offline caching (future)
   - **IndexedDB** for larger mobile cache

---

### Phase 2: Level 1 - All Items Page Enhancement (Week 2-3)
**Goal:** Upgrade existing items page to show master-level view

#### Tasks
1. **Update `/app/items/page.tsx`**
   - Modify data structure to show master items
   - Add "# of Orders" column
   - Add total quantity aggregation
   - Make rows clickable → navigate to Level 2

2. **Add order references**
   - Show which orders include each item
   - Quick link to order details

3. **Update metrics**
   - Show unique master items count
   - Show total instances in production
   - Status breakdown

4. **Navigation**
   - Implement routing to `/items/[itemId]`

---

### Phase 3: Level 2 - Item View Page (Week 3-4)
**Goal:** Build batch/style-level view

#### Tasks
1. **Create `/app/items/[itemId]/page.tsx`**
   - Dynamic route for master item ID
   - Fetch all instances of that item

2. **Build components:**
   - `MasterItemHeader.tsx` - Shows master item details
   - `ItemInstancesTable.tsx` - Lists all instances (reuse TableMalleable)
   - `AggregateMetrics.tsx` - Summary cards
   - `AttributesComparison.tsx` - Compare attributes across instances
   - `ItemTimeline.tsx` - Production timeline visualization

3. **Implement filtering & grouping**
   - Filter by order, status, location
   - Group instances by order or production stage

4. **Add actions**
   - Edit master item
   - Create new instance
   - Export data

---

### Phase 4: Level 3 - Individual Item Page (Week 5-7)
**Goal:** Build the malleable, highly customizable item detail page

#### Tasks

##### 4.1: Page Structure
1. **Create `/app/items/[itemId]/[instanceId]/page.tsx`**
   - Dynamic route with two parameters
   - Fetch individual item data
   - Initialize with default grid layout

##### 4.2: Integrate Grid System
1. **Adapt existing grid system** (`/lib/grid-v2/`)
   - Create item-specific block types
   - Define default layout for item pages
   - Store layouts per item type or user preference

2. **Create Item-Specific Blocks** (`/components/blocks/items/`)
   - `ItemDetailsBlock.tsx` - Core details (quantity, type, order)
   - `AttributesBlock.tsx` - Malleable attributes table
   - `WorkflowProgressBlock.tsx` - Stage tracking
   - `ComponentsListBlock.tsx` - Sub-components (if complex)
   - `AttachmentsBlock.tsx` - Files & documents
   - `TraceabilityBlock.tsx` - Digital passport, compliance
   - `ActivityTimelineBlock.tsx` - Action log
   - `NotificationsBlock.tsx` - Alert configuration
   - `QRCodeBlock.tsx` - Display QR code and label config
   - `RelatedItemsBlock.tsx` - Link to similar items

##### 4.3: Edit Functionality
1. **Inline editing for attributes**
   - Double-click to edit attribute values
   - Add/remove custom attributes
   - Save changes with optimistic updates

2. **Workflow stage updates**
   - Mark stages as complete
   - Add notes to stages
   - Reassign stage owners

3. **File management**
   - Upload attachments
   - Preview images/PDFs
   - Organize by category

##### 4.4: Layout Customization
1. **Edit mode toggle**
   - Switch between view and edit layout modes
   - Same UX as home page grid system

2. **Block management**
   - Add new blocks from library
   - Remove blocks
   - Resize and reposition

3. **Save custom layouts**
   - Save per user
   - Save per item type (e.g., all "Jackets" use same layout)
   - Export/import layout templates

4. **Mobile responsive grid**
   - Auto-collapse grid to single column on mobile
   - Preserve block order priority
   - Touch-optimized interactions

##### 4.5: Navigation
1. **Component navigation**
   - Click component → Navigate to Level 4
   - Breadcrumb navigation

2. **Related items**
   - Link to other items in same order
   - Link to similar items

##### 4.6: Mobile Optimization
1. **Responsive breakpoints**
   - Desktop: >1024px (full malleable grid)
   - Tablet: 768-1024px (simplified grid)
   - Mobile: <768px (single column, expandable sections)

2. **Performance optimization**
   - Lazy load blocks below fold
   - Image optimization (WebP, srcset)
   - Virtual scrolling for long lists
   - Code splitting for mobile bundle

3. **Touch interactions**
   - Swipe to navigate between items/components
   - Pull-to-refresh
   - Bottom sheet modals
   - No hover states (use tap/long-press)

---

### Phase 5: Level 4 - Component Pages (Week 7-8)
**Goal:** Handle sub-components for complex items

#### Tasks
1. **Create `/app/items/[itemId]/[instanceId]/components/[componentId]/page.tsx`**
   - Similar malleable layout to Level 3
   - Adapted for component-level data

2. **Build component-specific blocks**
   - Reuse many blocks from Level 3
   - Add "Parent Item" reference block
   - Component-specific workflow tracking

3. **Recursive handling** (if needed)
   - Support sub-sub-components
   - Display component hierarchy

---

### Phase 6: Integration & Data Flow (Week 8-9)
**Goal:** Connect order creation to item management

#### Tasks
1. **Order → Items link**
   - When order is published, generate item instances
   - Create master items if they don't exist
   - Link instances to master items and orders

2. **Quantity tracking**
   - Aggregate quantities at master level
   - Track status changes
   - Update counts in real-time

3. **Attribute inheritance**
   - Master item attributes flow to instances
   - Allow per-instance customization
   - Component attributes inherit from parent

4. **Workflow propagation**
   - When workflow is assigned in order creation, it flows to items
   - Allow per-instance workflow overrides

---

### Phase 7: Floor App Development (Week 10-12)
**Goal:** Build mobile-first Floor App for factory workers

#### Tasks
1. **Create Floor App routes** (`/floor/`)
   - `/floor/scan` - QR scanner interface
   - `/floor/items/[instanceId]` - Mobile item view
   - `/floor/update` - Quick status update form
   - `/floor/offline` - Offline mode indicator

2. **QR Code Scanner**
   - Camera integration (use `react-qr-scanner` or similar)
   - Parse QR payload and navigate to item
   - Scan history (last 20 scans)
   - Bulk scanning mode (scan multiple items rapidly)

3. **Mobile-Optimized Item View**
   - Simplified single-column layout
   - Large, touch-friendly buttons
   - Essential info above fold
   - Expandable sections for details
   - Bottom action bar (sticky)

4. **Quick Update Interface**
   - Mark stage complete
   - Report issues (predefined categories + notes)
   - Add photo (camera integration)
   - Voice notes (future)

5. **Offline Support**
   - Service Worker for offline access
   - Cache recently viewed items
   - Queue updates for sync
   - Conflict resolution strategy

6. **Authentication & Permissions**
   - Floor workers have limited permissions
   - Can view + update status only
   - Cannot edit attributes or delete items
   - Badge/ID-based login (NFC future)

### Phase 8: Advanced Features (Week 13+)
**Goal:** Add power-user features

#### Tasks
1. **Bulk operations**
   - Select multiple items and update attributes
   - Batch status changes
   - Mass reassignment

2. **Templates & presets**
   - Save item configurations as templates
   - Quick-create items from templates
   - Share templates across teams

3. **Advanced filtering**
   - Multi-dimensional filtering
   - Saved filter views
   - Smart filters (e.g., "Items at risk")

4. **Reporting & analytics**
   - Item-level performance metrics
   - Production efficiency by item type
   - Timeline adherence

5. **Collaboration features**
   - Comments on items
   - @mentions for team members
   - Activity notifications

6. **Digital passport export**
   - Generate customer-facing traceability pages
   - QR code scanning → public passport view
   - Blockchain integration (future)

7. **Floor App Enhancements**
   - Voice commands for hands-free operation
   - AR overlays showing item info in camera view
   - Wearable integration (smartwatches)
   - Multi-language support
   - Accessibility features (high contrast, large text)

---

## Domain-Agnostic Design Principles

### 1. Malleable Attributes
- No hardcoded fields beyond basics (name, code, quantity)
- Users define what attributes matter
- Different item types can have completely different attribute sets

### 2. Flexible Layouts
- Grid-based pages let users customize their view
- Block library supports varying complexity needs
- Save and share layouts across organization

### 3. Hierarchical Flexibility
- Not all items need all levels
- Simple items: Level 1 → Level 3 (skip Level 2)
- Complex items: All levels including recursive components

### 4. Workflow Agnostic
- Items can have any workflow
- Workflows are assigned, not hardcoded
- Support for custom stages and processes

### 5. Extensibility
- Custom blocks for unique needs
- API hooks for external integrations
- Plugin system for industry-specific features

---

## User Flows

### Flow A: Viewing Item Hierarchy
1. User starts on **All Items page** (Level 1)
2. Sees "Aurora Flight Jacket" with quantity 320 across 2 orders
3. Clicks row → Navigate to **Item View** (Level 2)
4. Sees breakdown: Order A has 200 units, Order B has 120 units
5. Clicks instance from Order A → Navigate to **Individual Item Page** (Level 3)
6. Sees full details, including 4 components (shell, lining, zippers, buttons)
7. Clicks "Outer Shell Panels" component → Navigate to **Component Page** (Level 4)
8. Sees component-specific attributes, workflow, and traceability

### Flow B: Creating Items from Orders
1. User creates new order in `/orders/new`
2. Adds item "Aurora Flight Jacket" with quantity 320
3. Configures attributes (fabric, colorway, sizes)
4. Adds components (shell, lining, etc.)
5. Assigns workflow "Cut & Sew Apparel v4"
6. Publishes order
7. System creates:
   - Master item (if doesn't exist) at Level 1
   - Item instance at Level 2 linked to this order
   - Individual item records at Level 3 (may be batch or per-unit depending on QR mode)
   - Component records at Level 4
8. System generates QR codes for each item/component

### Flow C: Customizing Item Page Layout
1. User navigates to an Individual Item Page (Level 3)
2. Clicks "Edit Layout" toggle
3. Grid enters edit mode
4. User adds "Custom Notes" block from block library
5. Resizes "Attributes Block" to take up more space
6. Moves "Activity Timeline" to bottom
7. Clicks "Save Layout"
8. System prompts: "Save for all Jackets or just me?"
9. User selects "All Jackets"
10. All jacket item pages now use this layout

### Flow D: Factory Floor Worker Scanning QR Code
**Context:** Worker on sewing line with smartphone/tablet

1. Worker opens Floor App on mobile device
2. App opens to camera/scanner view
3. Worker scans QR code on jacket shell panel
4. App decodes: `groovy://item/JKT-AURORA-001/instance-001/component-shell`
5. Instantly loads mobile-optimized item view:
   - **Hero card:** "Outer Shell Panels - In Progress"
   - **Current stage:** "Panel Assembly" (60% complete)
   - **Next action:** "Complete assembly and move to QA"
   - **Location:** "Sewing Line A, Station 3"
6. Worker taps "Mark Stage Complete"
7. App shows confirmation: "Ready to move to QA?"
8. Worker taps "Confirm"
9. App updates status, shows success message
10. Next scan ready in <1 second

### Flow E: Mobile vs Desktop Context Switching
**Scenario:** Production manager reviews item on desktop, then checks on floor

1. **Desktop (Morning):**
   - Manager on desktop reviews "Aurora Flight Jacket" instance
   - Sees full malleable grid with all details
   - Notes that Panel Assembly should complete today
   - Customizes layout to emphasize timeline block

2. **Mobile (Afternoon - Factory Floor):**
   - Manager walks to factory floor with tablet
   - Scans QR code on same jacket
   - Sees mobile-optimized view (same data, different layout)
   - Notices stage not marked complete yet
   - Checks expandable "Activity Log" section
   - Sees last update was 2 hours ago
   - Taps "Report Issue" to flag for team lead

3. **Data Consistency:**
   - Both views show same real-time data
   - Updates on mobile immediately reflect on desktop
   - Layout preferences stored per-device-type

---

## Key Technologies & Components

### Routing
- Next.js dynamic routes: `[itemId]`, `[instanceId]`, `[componentId]`
- Nested layouts for consistent navigation

### State Management
- React Context for item data
- localStorage for prototyping
- Future: API + database

### Grid System
- Reuse existing `/lib/grid-v2/` system
- Extend with item-specific block types
- Same drag-and-drop, resize, edit/save UX

### Components
- Reuse existing blocks where applicable (TableMalleable, ActivityTimeline, etc.)
- Create item-specific blocks in `/components/blocks/items/`

### Data Flow
- Orders → Items (on publish)
- Master Items ← Item Instances (aggregation)
- Components ← Parent Items (hierarchy)

---

## Success Metrics

### User Experience
- Users can find any item in <3 clicks from home page
- 80% of users customize at least one item page layout
- Zero complaints about "missing fields" (because they can add their own)

### Performance
- Level 1 page loads with 1000+ master items in <500ms
- Level 3 page (individual item) loads in <300ms
- Grid interactions feel instant (<100ms response)
- **Mobile Floor App** loads scanned item in <1 second
- **Offline mode** works for 100+ cached items
- **QR scan** to item view in <500ms

### Flexibility
- Support 10+ different manufacturing verticals without code changes
- Users create 50+ custom attributes across different item types
- 20+ different custom page layouts across organization

---

## Future Enhancements

### Phase 9+
- **Real-time updates:** WebSocket connections for live status changes (multi-user collaboration)
- **AI insights:** Suggest optimal workflows based on historical data
- **Voice commands:** Hands-free operation for floor workers
- **AR overlays:** Point camera at item to see info overlay
- **Wearable integration:** Smartwatch quick views and notifications
- **Supplier portal:** External partners can view relevant item data
- **Customer portal:** End customers can scan QR codes to see product journey
- **Blockchain integration:** Immutable traceability records
- **IoT integration:** Automatic status updates from factory sensors (RFID, beacons)
- **Advanced analytics:** ML-powered predictions for timelines and bottlenecks
- **Multi-language support:** Auto-translate item info for global teams
- **Accessibility:** Voice-over, high contrast, gesture controls

---

## Conclusion

This hierarchical item system provides the flexibility and depth required for modern manufacturing management. By making Level 3 (Individual Item Pages) highly malleable and customizable, we ensure the system can adapt to any industry, complexity level, or organizational workflow. The clear hierarchy makes navigation intuitive while supporting deep drill-down for traceability and detail-oriented work.

### Mobile-First Philosophy
**The Floor App is not an afterthought—it's a core requirement.** By designing the item pages with mobile optimization from the start, we ensure:

- **Factory floor workers** can scan QR codes and get instant, relevant information
- **Performance** is optimized for mobile devices and spotty connectivity
- **Offline mode** allows work to continue even without internet
- **Responsive design** means the same data structure powers both desktop and mobile views
- **Touch-optimized** interactions make scanning and updating fast and error-free

The desktop malleable grid provides power and flexibility for administrators, while the mobile Floor App provides speed and focus for workers. Both access the same underlying data, ensuring consistency across the organization.

### Implementation Strategy
The phased implementation plan allows us to build incrementally, validating each level before moving deeper into the hierarchy. Starting with enhancing the existing Level 1 page and working our way down ensures we maintain a working system at each step. **Mobile optimization is baked into every phase**, not added later.

**Next Steps:**
1. Review this document and confirm approach
2. Begin Phase 1: Data structure definition (including mobile/floor considerations)
3. Set up project board with tasks from implementation plan
4. Start building with mobile-first responsive design from day one!
