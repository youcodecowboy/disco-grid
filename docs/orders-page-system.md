# Orders Page & Integration System

**Created:** October 5, 2025  
**Status:** Planning Document

---

## Mission

Transform order management from a sidebar action into a full-featured hub where teams can view, filter, manage, and create orders with the same dynamic, table-driven experience that makes the Items page powerful. The orders page becomes the command center for all order activity while the existing "New Order" flow remains the comprehensive authoring environment.

---

## Core Philosophy

- **Orders Page = Overview & Management**: Browse all orders, filter by status, search, bulk actions, quick insights
- **Create Order Flow = Deep Authoring**: The existing multi-stage wizard (`/app/orders/new`) remains for comprehensive order creation
- **Seamless Integration**: "Create New Order" button on orders page launches the existing flow, returns to orders page on completion
- **Items-Inspired UX**: Apply the same dynamic table patterns, scroll behavior, and visual design that makes Items page excellent

---

## Page Structure

### Location
- **Route:** `/app/orders/page.tsx`
- **Navigation:** Sidebar entry "Orders" (replaces or augments "New Order" button)
- **Entry Points:**
  - Direct navigation from sidebar
  - Deep links from dashboard cards, notifications, reports
  - Post-creation redirect from new order flow

### Layout Pattern

```
┌─────────────────────────────────────────────────────────────┐
│  Header: Orders • Manage production orders                  │
│  [Create New Order]  [Search...]  [Filter] [Export]         │
├─────────────────────────────────────────────────────────────┤
│  Tabs: [All] [Draft] [Pending] [Accepted] [In Production]  │
│        [Completed] [Cancelled]                               │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Dynamic Orders Table (scrollable, sortable)         │  │
│  │  - Actions column (view, edit, message, clone)       │  │
│  │  - Order name & ID                                    │  │
│  │  - Client/Customer                                     │  │
│  │  - Status badge                                        │  │
│  │  - Progress bar                                        │  │
│  │  - Item count                                          │  │
│  │  - Timeline (start → ship date)                       │  │
│  │  - Assigned team & owner                              │  │
│  │  - Value/Priority indicators                          │  │
│  └───────────────────────────────────────────────────────┘  │
│  Footer: Showing X orders • Y total items • Quick stats    │
└─────────────────────────────────────────────────────────────┘
```

---

## Tab System

### Order Status Tabs

**All**  
- Default view, shows all orders regardless of status
- Quick filters available (client, team, date range)

**Draft**  
- Orders created but not yet finalized
- "Continue Editing" action prominent
- Can be deleted without audit trail

**Pending**  
- Orders awaiting approval or review
- Shows pending actions (who needs to approve)
- Notification badges if user action required

**Accepted**  
- Orders approved and ready for production
- Line items and QR codes generated
- Labels ready to print
- "Start Production" CTA if not yet started

**In Production**  
- Active manufacturing orders
- Progress bars showing completion %
- Real-time status updates from floor scans
- Milestones and blockers highlighted

**Completed**  
- Finished orders, shipped or delivered
- Archive actions available
- Analytics and performance metrics

**Cancelled**  
- Cancelled/archived orders
- Reason tracking
- Restore option for recent cancellations

---

## Table Structure

### Core Columns (Always Visible)

**Actions**  
- 👁️ View: Navigate to order detail page
- ✏️ Edit: Jump into order editing flow
- ✉️ Message: Send notification to stakeholders
- 📋 Clone: Duplicate order for new production run
- 🔔 Alerts: Configure notifications

**Order Info**  
- Order name (primary, bold)
- Order ID (secondary, monospace badge)
- Client name (tertiary, linked to Rolodex)

**Status**  
- Color-coded badge matching order lifecycle
- Hover tooltip with last status change timestamp

**Progress**  
- Visual progress bar (0-100%)
- Calculated from item codes and line items
- Shows: "45/200 items completed" on hover

**Items**  
- Count of item codes (variants)
- Total line items (physical units)
- Expandable to show item breakdown

**Timeline**  
- Start date → Ship date
- Days remaining indicator
- Red flag if overdue
- Milestone markers

**Team & Ownership**  
- Assigned team name
- Owner avatar + name
- Contact chips (hover to see full list)

**Value/Priority**  
- Optional: Order value ($)
- Priority flag (high/normal/low)
- Custom tags

### Extended Columns (Horizontal Scroll)

Like Items page, support horizontal scroll for additional attributes:

- **Production Details**: Factory location, line assignment, shift
- **Commercial**: PO number, contract reference, billing status
- **Compliance**: Certifications required, audit status
- **Custom Attributes**: User-defined fields from order creation

---

## Key Interactions

### Row Click Behavior
- Click anywhere on row → Navigate to order detail page
- Individual action buttons stop propagation (don't navigate)
- Hover row shows subtle highlight + chevron indicator

### Create New Order Button
- Prominent button in page header (primary action)
- Launches existing `/app/orders/new` flow
- On completion, redirects back to orders page with success toast
- New order appears at top of "Accepted" or "Draft" tab

### Bulk Actions (Multi-Select)
- Checkbox column for selecting multiple orders
- Bulk actions bar appears when 1+ selected:
  - Assign to team
  - Export batch
  - Send message to all stakeholders
  - Apply tags
  - Cancel orders (with confirmation)

### Filters & Search
- **Search**: Order name, ID, client name, item names (fuzzy matching)
- **Quick Filters**:
  - Client/Customer dropdown
  - Assigned team dropdown
  - Owner dropdown
  - Date range picker (start date, ship date, or custom)
  - Status multi-select
- **Advanced Filters**: Modal with full query builder

### Sort & Group
- Click column headers to sort (asc/desc)
- Support grouping by: Client, Team, Status, Week (timeline)
- Collapsible groups with aggregate stats

### Export
- Export current filtered view to CSV/Excel
- Include selected columns only
- Option to include nested item data

---

## Integration with Order Creation Flow

### Current Flow (Preserved)
The existing multi-stage order creation wizard at `/app/orders/new` remains fully intact:

1. **Overview Stage**: Order info, client, contacts, timeline
2. **Milestones Stage**: Calendar planning, capacity visualization
3. **Item Stage**: Item codes, variants, attributes, components
4. **Workflow Stage**: Workflow assignment, parallel processing rules
5. **Review Stage**: Final validation, QR preview, publish

### How They Connect

**From Orders Page → New Order Flow:**
- User clicks "Create New Order" button
- Navigates to `/app/orders/new`
- Wizard starts at Overview stage
- User completes all stages
- On final "Publish" click:
  - Order saved to database
  - Line items + QR codes generated
  - System redirects to `/app/orders?status=accepted&highlight={orderId}`
  - Success toast: "Order created! Line items and labels ready."

**From New Order Flow → Orders Page:**
- Breadcrumb navigation: "Orders > New Order"
- "Cancel" button returns to orders page with confirmation
- "Save Draft" creates draft order, returns to orders page

**Editing Existing Orders:**
- From orders page, click Edit action
- Launches order editor (same UI as creation, pre-populated)
- Can modify stages that aren't locked by production status
- Example: Can't edit item codes if line items already in production
- Save returns to orders page

**Cloning Orders:**
- Clone action duplicates order structure
- Strips IDs, resets dates, clears production data
- Opens in new order flow pre-filled with cloned data
- User can modify before publishing

---

## Order Detail Page

For full order visibility, consider a dedicated detail view:

**Route:** `/app/orders/[orderId]/page.tsx`

**Layout:**
```
┌──────────────────────────────────────────────────┐
│ Order: Aurora Apparel Production Run             │
│ [Edit Order] [Message Stakeholders] [Export]     │
├──────────────────────────────────────────────────┤
│ Overview Panel:                                   │
│ - Order info card (client, dates, team, status)  │
│ - Progress metrics (items, completion, timeline) │
│ - Activity timeline (recent scans, milestones)   │
├──────────────────────────────────────────────────┤
│ Tabs:                                             │
│ - Items: Full item codes table (nested)          │
│ - Timeline: Milestones, deadlines, events        │
│ - Files: Specs, designs, contracts               │
│ - Messages: Communication log                    │
│ - Activity: Full audit log                       │
│ - Analytics: Production metrics, efficiency      │
└──────────────────────────────────────────────────┘
```

**Items Tab (Nested Table):**
- Shows all item codes for this order
- Click item code → Drill into line items (same as Items page)
- Can filter, search, export just items from this order

---

## Data Model Alignment

### Order Entity (Matches Existing Schema)

```typescript
type Order = {
  id: string                     // "ORD-2025-001"
  name: string                   // "Aurora Apparel Production Run"
  client: string                 // "Horizon Apparel Co." (linked to Rolodex)
  status: OrderStatus
  
  // Timeline
  startDate: string
  shipDate: string
  createdAt: string
  updatedAt: string
  completedAt?: string
  
  // Team & ownership
  owner: string                  // Links to user/contact in Rolodex
  assignedTeam: string           // Links to team entity
  contacts: string[]             // Stakeholder IDs (from Rolodex)
  
  // Progress tracking
  totalItemCodes: number         // Count of item variants
  totalLineItems: number         // Sum of all quantities
  completedLineItems: number     // How many done
  progressPercent: number        // 0-100
  
  // Relationships
  itemCodes: ItemCode[]          // Nested item codes
  milestones: Milestone[]
  files: Attachment[]
  
  // Metadata
  tags: string[]
  priority: "low" | "normal" | "high"
  customAttributes: Record<string, any>
}

type OrderStatus = 
  | "Draft"           // Being authored, not finalized
  | "Pending"         // Awaiting approval
  | "Accepted"        // Approved, line items generated
  | "In Production"   // Active manufacturing
  | "Completed"       // All items done, shipped
  | "Cancelled"       // Cancelled/archived
```

### Status Transitions

```
Draft 
  → (User publishes) → Pending
  → (Approval) → Accepted
  → (First line item starts) → In Production
  → (All line items complete) → Completed

Any status → (User cancels) → Cancelled
```

### Orders Table Query Pattern

The orders page needs efficient queries to populate the table:

```typescript
// Get orders for table view
async function getOrdersForTable(filters: {
  status?: OrderStatus[]
  client?: string
  team?: string
  owner?: string
  dateRange?: { start: string; end: string }
  search?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
  limit?: number
  offset?: number
}) {
  // Returns paginated list of orders with:
  // - Order core info
  // - Aggregated progress stats
  // - Related entities (client, owner, team names)
  // - No deep nesting (efficient for table rendering)
}
```

---

## UI Implementation Notes

### Component Reusability

**Leverage Existing Components:**
- `ItemCodesTable` → Create similar `OrdersTable` component
- `TableMalleable` → Use for flexible column configuration
- `MetricKPI` → Summary cards above table
- `FilterPanel` → Advanced filtering UI

**New Components Needed:**
- `OrdersTable`: Main table with all columns, actions, sorting
- `OrderStatusBadge`: Colored status indicator
- `OrderProgressBar`: Visual progress with tooltip
- `OrderActions`: Action buttons (view, edit, message, etc.)
- `OrderFilters`: Filter bar with search, dropdowns, date picker
- `BulkActionBar`: Appears when orders selected

### Table Features (Inspired by Items Page)

✅ **Sticky header** during scroll  
✅ **Horizontal scroll** for extended columns  
✅ **Row hover** shows highlight + chevron  
✅ **Action buttons** stop click propagation  
✅ **Progress bars** with hover tooltips  
✅ **Color-coded badges** for status  
✅ **Sortable columns** (click header)  
✅ **Responsive** (collapses gracefully on mobile)  
✅ **Footer stats** showing aggregate metrics  

### Performance Considerations

- **Pagination**: Load 50 orders at a time (infinite scroll or page buttons)
- **Virtual scrolling**: For large datasets (1000+ orders)
- **Lazy load relationships**: Don't fetch full item trees unless needed
- **Debounced search**: Wait 300ms before firing search query
- **Cached filters**: Remember last filter state in localStorage

---

## Visual Design

### Status Color Palette

- **Draft**: `bg-gray-100 text-gray-800` 🔘
- **Pending**: `bg-yellow-100 text-yellow-800` ⏳
- **Accepted**: `bg-blue-100 text-blue-800` ✅
- **In Production**: `bg-purple-100 text-purple-800` 🔧
- **Completed**: `bg-green-100 text-green-800` ✅
- **Cancelled**: `bg-red-100 text-red-800` ❌

### Header Hierarchy
- Page title: `text-2xl font-bold`
- Section headers: `text-lg font-semibold`
- Table headers: `text-xs uppercase tracking-wide text-gray-500`
- Row content: `text-sm text-gray-900`

### Spacing & Layout
- Match Items page spacing patterns
- Use same card shadows, borders, and rounded corners
- Consistent padding: `px-4 py-3` for cells
- Table row height: `min-h-[60px]` for comfortable clicking

---

## Integration Points with Rolodex

Orders page needs to display relationships defined in Rolodex:

**Client Display:**
- Show client name from Rolodex
- Click client name → Open Rolodex entry for that client
- If client not in Rolodex, show "Add to Rolodex" prompt

**Owner & Contacts:**
- Display owner avatar + name (from Rolodex internal contacts)
- Show contact chips (hover to see full list)
- Click contact → View contact details

**Team Assignment:**
- Dropdown to assign teams (sourced from team directory)
- Shows team members when hovering team name

**Filtering by Relationship:**
- Filter by client (dropdown of all clients in Rolodex)
- Filter by contact (dropdown of stakeholders)
- Filter by team

See `rolodex-system.md` for full contact/relationship data model.

---

## Notifications & Messages

### Message Actions from Orders Page

When user clicks "Message" action:
- Opens modal/drawer with message composer
- Pre-populated recipients: Order contacts + owner
- Can add additional recipients from Rolodex
- Message types:
  - Status update
  - Milestone reminder
  - Issue report
  - Custom message
- Sends via channels: Email, SMS, in-app notification

### Notification Configuration

Users can set up automatic notifications per order:
- Milestone reached
- Order status changed
- Items completed
- Blockers detected
- Overdue alerts

---

## Analytics & Reporting

### Quick Stats (Above Table)
- Total orders (current filtered view)
- Orders in production
- Orders overdue
- Completion rate this month

### Exportable Metrics
- Order velocity (orders/week)
- Average production time
- On-time delivery rate
- Client breakdown
- Team performance

### Dashboard Integration
- Orders page feeds data to main dashboard
- Cards on dashboard link back to orders page with filters applied
- Example: "12 Overdue Orders" card → `/app/orders?status=in_production&overdue=true`

---

## Mobile Experience

**Responsive Breakpoints:**
- Desktop: Full table with all columns
- Tablet: Hide extended columns, keep core info
- Mobile: Card-based layout (stack order info vertically)

**Mobile-Specific Features:**
- Swipe actions on cards (view, message, edit)
- Pull-to-refresh
- Floating "Create Order" FAB button
- Simplified filters (modal instead of inline)

---

## Permissions & Access Control

### Role-Based Visibility
- **Admin**: See all orders, edit any order
- **Manager**: See team orders, edit assigned orders
- **Operator**: See assigned orders, view-only
- **Client**: See only their orders (via client portal)

### Action Permissions
- **Create Order**: Manager, Admin
- **Edit Order**: Owner, Manager, Admin (with status restrictions)
- **Cancel Order**: Manager, Admin (with approval if in production)
- **Message Stakeholders**: Anyone with order access
- **Export Data**: Manager, Admin

---

## Future Enhancements

**Phase 2 Features (Not MVP):**
- Gantt chart view (timeline visualization)
- Kanban board view (drag orders between status columns)
- Advanced analytics dashboard
- Client portal access (scoped view for external stakeholders)
- Automated workflow triggers (e.g., send email when order accepted)
- Integration with inventory/materials system
- Forecasting & capacity planning tools

**AI/Automation Ideas:**
- Auto-suggest optimal team assignment based on capacity
- Predict completion date based on historical data
- Detect anomalies (orders taking unusually long)
- Smart search (natural language queries)

---

## Implementation Checklist

### Backend/Data
- [ ] Define Order entity schema (align with existing)
- [ ] Create orders table/collection in database
- [ ] Implement query functions (getOrders, getOrderById, etc.)
- [ ] Add status transition logic
- [ ] Set up relationships with Items, Rolodex, Teams

### Frontend Components
- [ ] Create `/app/orders/page.tsx` main page
- [ ] Build `OrdersTable` component
- [ ] Build `OrderStatusBadge`, `OrderProgressBar`, `OrderActions`
- [ ] Build `OrderFilters` component
- [ ] Build `BulkActionBar` component
- [ ] Create tab navigation component

### Integration
- [ ] Update sidebar to show "Orders" link
- [ ] Add redirect from new order flow completion
- [ ] Add breadcrumb navigation
- [ ] Link orders page to order detail page
- [ ] Connect with Rolodex for client/contact data
- [ ] Connect with Items page for drill-down

### UX Polish
- [ ] Add loading states (skeleton table)
- [ ] Add empty states ("No orders yet")
- [ ] Add error states (failed to load)
- [ ] Add success toasts (order created, edited, etc.)
- [ ] Add confirmation modals (delete, cancel)
- [ ] Test responsive behavior
- [ ] Test accessibility (keyboard nav, screen readers)

### Testing
- [ ] Unit tests for table filtering, sorting
- [ ] Integration tests for order creation flow
- [ ] E2E tests for full order lifecycle
- [ ] Performance tests with large datasets

---

## Open Questions

1. **Approval Workflow**: Do orders in "Pending" status need multi-step approval (e.g., manager → finance → exec)?
2. **Order Versioning**: If an order is edited after acceptance, do we track versions?
3. **Client Portal Access**: Should clients have direct access to orders page, or a separate scoped view?
4. **Bulk Edit**: Can users bulk-edit orders (e.g., change all to new ship date)?
5. **Archiving**: When/how are completed orders archived? Keep forever or auto-archive after X months?

---

## Success Metrics

**How we'll know this is working:**
- Users spend less time searching for orders (measure time to find)
- Faster order status updates (measure edit → save time)
- Increased order throughput (more orders created/week)
- Reduced errors (fewer cancelled orders due to mistakes)
- User satisfaction (NPS score for order management)

---

*Document created October 5, 2025. This planning doc should be validated with stakeholders before implementation begins.*
