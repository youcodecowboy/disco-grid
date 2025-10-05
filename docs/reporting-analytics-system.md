# Analytics & Reporting System Blueprint — 10/05/25

## Mission
Build a domain-agnostic analytics and reporting hub that transforms raw operational data into actionable insights, customizable reports, and automated distribution systems. The core focus is on **report building**—empowering users to compose, schedule, and share beautifully formatted reports without technical expertise.

## Experience Principles
- **Report-First Architecture**: While analytics visualizations are powerful, the system's primary job is enabling users to build, customize, and distribute reports.
- **Grid-as-Canvas**: The report builder uses the existing grid system where users drag analytics components onto a page that becomes the actual report.
- **Component-Based Assembly**: Analytics blocks (charts, tables, KPIs) are building blocks that snap together to form comprehensive reports.
- **Schedule Once, Run Forever**: Configure reports to generate and send automatically at any cadence—daily, weekly, monthly, or custom intervals.
- **Domain Agnostic**: Works for fashion production reports, construction progress updates, armory inventory summaries, or any operational domain.
- **Progressive Complexity**: Start with simple drag-and-drop report building, evolve toward natural language report generation.

## Core Philosophy

**Analytics vs. Reporting:**
- **Analytics Section**: Explore data interactively, build custom dashboards, create unlimited custom views
- **Reporting Tool**: Package analytics into formatted reports, schedule distribution, manage recipients
- **Grid System**: Already handles custom dashboards; reporting adds structured templates and automation

**This System Focuses On:**
1. **Report Builder**: Visual canvas where you compose reports from analytics blocks
2. **Data Source Flexibility**: Connect any data (orders, items, teams, tasks, custom) to report components
3. **Scheduled Distribution**: Create "every Friday production report" that auto-generates and emails
4. **Template Library**: Save common report structures as templates for reuse
5. **Recipient Management**: Define who gets what reports, via which channels

---

## Primary Personas & Jobs

### Operations Manager
**Goal:** Send weekly production summaries to brand clients  
**Job:** Create recurring report showing:
- Orders completed this week
- Items in production
- Quality metrics
- Upcoming deadlines

**Workflow:**
1. Click "Create Report"
2. Drag "Orders Table" block onto canvas
3. Configure filters (date range: last 7 days, status: completed)
4. Drag "KPI Grid" showing efficiency, defect rate, on-time delivery
5. Add "Timeline" showing upcoming milestones
6. Schedule: "Every Friday at 5pm"
7. Recipients: Brand client contacts + internal stakeholders
8. Preview, save, done

### Executive
**Goal:** Monthly performance overview  
**Job:** Receive automated report with:
- Revenue/order volume trends
- Team performance leaderboard
- Capacity utilization charts
- Year-over-year comparisons

**Workflow:**
- Pre-built "Executive Monthly Summary" template
- Customizes data sources (which teams, which facilities)
- Adds custom KPIs specific to their priorities
- Schedules for last business day of each month
- Report auto-generates, emails as PDF

### Client/Brand Representative
**Goal:** Stay informed on order progress  
**Job:** Receive production updates without logging into system

**Workflow:**
- Operations manager creates "Client Order Update" report
- Shows only data for specific client's orders
- Includes progress bars, completion photos, timeline
- Auto-sends every Monday and Thursday
- Client clicks through to see detailed items if needed

### Data Analyst
**Goal:** Ad-hoc reporting for specific investigations  
**Job:** Build custom one-time reports for troubleshooting

**Workflow:**
- Use report builder for quick visual composition
- Add filters, breakdowns, comparisons
- Export as PDF or share link
- If useful, save as template for future use

---

## Core Entities

### 1. Report
**Purpose:** Packaged collection of analytics components with defined data sources, formatting, and distribution rules

```typescript
type Report = {
  id: string                        // "RPT-2025-001"
  name: string                      // "Weekly Production Summary"
  description?: string
  
  // Report structure (the actual content)
  template: ReportTemplate          // Layout and blocks
  
  // Data configuration
  dataSources: DataSourceConfig[]   // Which data feeds the report
  filters: FilterConfig[]           // Applied to all components
  dateRange: DateRangeConfig        // Dynamic (last 7 days) or fixed
  
  // Visual settings
  theme: "light" | "dark" | "brand"
  format: "pdf" | "html" | "dashboard"
  orientation: "portrait" | "landscape"
  includeTableOfContents: boolean
  includeFooter: boolean
  
  // Scheduling & automation
  schedule?: ScheduleConfig         // null = one-time/manual
  lastGenerated?: string
  nextGeneration?: string
  
  // Distribution
  distribution: DistributionConfig  // Who gets it, how
  
  // Status & tracking
  status: "Draft" | "Active" | "Paused" | "Archived"
  runs: ReportRun[]                 // History of generations
  
  // Ownership
  createdBy: string
  owner: string
  sharedWith: string[]
  
  // Metadata
  tags: string[]
  category: string                  // "Production", "Financial", "Quality", etc.
  isTemplate: boolean               // Can be cloned by others
  
  createdAt: string
  updatedAt: string
}
```

### 2. Report Template
**Purpose:** The visual structure and component layout that defines how the report looks

```typescript
type ReportTemplate = {
  id: string
  name: string
  
  // Grid-based layout (reuses existing grid system)
  layout: GridState                 // Uses lib/grid-v2/types.ts
  
  // Components on the report
  blocks: ReportBlock[]             // Each block is an analytics component
  
  // Page settings
  pages: number                     // Support multi-page reports
  pageBreaks: string[]              // Block IDs where page breaks occur
  
  // Header/Footer
  header?: ReportSection
  footer?: ReportSection
  
  // Styling
  styles: {
    fonts: FontConfig
    colors: ColorPalette
    spacing: SpacingConfig
    branding?: BrandingConfig       // Logo, company colors, etc.
  }
}

type ReportBlock = {
  id: string
  type: AnalyticsBlockType          // Chart, table, KPI, text, image, etc.
  title?: string
  dataSource: string                // Which data feeds this block
  config: BlockConfig               // Block-specific settings
  position: GridCoordinates         // Where on report canvas
  filters?: FilterConfig[]          // Block-level filters
  
  // Interactivity (for HTML/dashboard format)
  interactive: boolean
  drillDown?: DrillDownConfig
}

type AnalyticsBlockType =
  // Charts
  | "chart.line"
  | "chart.bar"
  | "chart.pie"
  | "chart.donut"
  | "chart.area"
  | "chart.scatter"
  | "chart.heatmap"
  | "chart.gauge"
  | "chart.waterfall"
  | "chart.combo"                   // Multiple series, mixed types
  
  // Tables
  | "table.data"                    // Standard data table
  | "table.summary"                 // Aggregated metrics table
  | "table.comparison"              // Side-by-side comparison
  
  // KPIs & Metrics
  | "metric.kpi"                    // Single large number
  | "metric.grid"                   // Grid of KPIs
  | "metric.comparison"             // This month vs. last month
  | "metric.trend"                  // Number + sparkline
  | "metric.leaderboard"            // Top performers list
  
  // Specialized
  | "timeline.events"
  | "calendar.heatmap"
  | "map.geographic"                // If location data available
  | "progress.tracker"              // Visual progress indicator
  
  // Content
  | "text.heading"
  | "text.paragraph"
  | "text.bullet"
  | "image"
  | "divider"
  | "spacer"
```

### 3. Data Source Config
**Purpose:** Defines where report components pull their data from

```typescript
type DataSourceConfig = {
  id: string
  name: string
  type: DataSourceType
  
  // Connection details
  source: string                    // "orders", "items", "teams", "tasks", "custom"
  query?: QueryConfig               // If dynamic
  staticData?: any[]                // If pre-computed
  
  // Refresh settings
  refreshMode: "realtime" | "scheduled" | "static"
  refreshInterval?: number          // Minutes
  lastRefreshed?: string
  
  // Transformations
  aggregations?: AggregationConfig[]
  calculations?: CalculationConfig[]
  
  // Relationships
  joins?: JoinConfig[]              // Combine multiple sources
}

type DataSourceType =
  | "orders"
  | "items"
  | "line_items"
  | "teams"
  | "people"
  | "tasks"
  | "devices"
  | "scans"
  | "workflows"
  | "custom"                        // User-uploaded CSV or API
  | "formula"                       // Computed from other sources

type QueryConfig = {
  entity: string                    // "orders", "items", etc.
  filters: FilterExpression[]
  groupBy?: string[]
  aggregates?: AggregateFunction[]
  sortBy?: string
  limit?: number
}

type AggregationConfig = {
  field: string
  operation: "sum" | "avg" | "min" | "max" | "count" | "distinct"
  as: string                        // Alias for result
}

type CalculationConfig = {
  name: string
  formula: string                   // "revenue - cost", "completed / total * 100"
  format?: "number" | "percent" | "currency"
}
```

### 4. Schedule Config
**Purpose:** Defines when and how often reports auto-generate

```typescript
type ScheduleConfig = {
  enabled: boolean
  
  // Frequency
  frequency: "once" | "daily" | "weekly" | "monthly" | "quarterly" | "yearly" | "custom"
  
  // Specific timing (depends on frequency)
  time?: string                     // "17:00" (5pm)
  timezone: string                  // "America/New_York"
  
  // For weekly
  daysOfWeek?: Array<"Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday">
  
  // For monthly
  dayOfMonth?: number               // 1-31, or "last"
  
  // For custom (cron-like)
  cronExpression?: string
  
  // Constraints
  startDate?: string                // Don't run before this
  endDate?: string                  // Stop running after this
  skipWeekends?: boolean
  skipHolidays?: boolean
  
  // Dynamic date ranges (for report content)
  reportPeriod: "last_day" | "last_week" | "last_month" | "last_quarter" | "last_year" | "custom"
}
```

### 5. Distribution Config
**Purpose:** Who receives reports and via which channels

```typescript
type DistributionConfig = {
  enabled: boolean
  
  // Recipients
  recipients: Recipient[]
  
  // Channels
  channels: DistributionChannel[]
  
  // Formatting
  attachmentFormat?: "pdf" | "excel" | "csv"
  includeLink?: boolean             // Link to interactive dashboard
  embedInEmail?: boolean            // Inline HTML instead of attachment
  
  // Security
  requireAuth?: boolean             // Require login to view
  expiresAfter?: number             // Days until link expires
  password?: string                 // Password-protect PDF
  
  // Notifications
  notifyOnFailure?: boolean
  notifyOnSuccess?: boolean
}

type Recipient = {
  id: string
  type: "person" | "team" | "contact" | "email"
  value: string                     // User ID, email, or team ID
  name: string
  role?: string                     // For context: "Brand Manager", "Stakeholder"
  
  // Customization
  personalizedView?: boolean        // Filter report to only their relevant data
  filters?: FilterConfig[]          // Applied on top of base report
}

type DistributionChannel = {
  type: "email" | "sms" | "slack" | "webhook" | "internal"
  config: Record<string, any>
  
  // For email
  subject?: string
  message?: string
  from?: string
  replyTo?: string
}
```

### 6. Report Run
**Purpose:** Historical record of each time a report was generated

```typescript
type ReportRun = {
  id: string
  reportId: string
  
  // Execution
  startedAt: string
  completedAt?: string
  duration: number                  // Seconds
  status: "queued" | "running" | "completed" | "failed"
  error?: string
  
  // Output
  outputFormat: "pdf" | "html" | "excel"
  fileUrl?: string                  // Where generated file is stored
  fileSize?: number                 // Bytes
  
  // Distribution
  distributionStatus: DistributionStatus[]
  
  // Data snapshot
  dataCapturedAt: string            // When data was queried
  dataPoints: number                // How many records included
  
  // Metadata
  triggeredBy: "schedule" | "manual" | "api"
  triggeredByUser?: string
}

type DistributionStatus = {
  recipientId: string
  channel: string
  status: "sent" | "delivered" | "opened" | "failed"
  sentAt: string
  deliveredAt?: string
  openedAt?: string
  error?: string
}
```

---

## Report Builder: Visual Composition System

### The Canvas Experience (Modal)

**Trigger:** Click "Create Report" button on `/app/reports` page  
**Format:** Full-screen modal overlay

**Layout:**

```
┌─────────────────────────────────────────────────────────────────┐
│ [×] Report Builder: "Weekly Production Summary"                 │
│     [Save Draft] [Preview] [Schedule] [Cancel]                  │
├─────────────────────────────────────────────────────────────────┤
│ Left Panel:           │  Canvas (Grid Surface)                  │
│ Component Library     │                                          │
│                       │  ┌────────────────────────────────────┐ │
│ 📊 Charts             │  │ Header: Weekly Production Summary  │ │
│  - Line Chart         │  ├────────────────────────────────────┤ │
│  - Bar Chart          │  │ [KPI Grid: 4 metrics]              │ │
│  - Pie/Donut          │  │  Completed | In Prod | Overdue | % │ │
│  - Area Chart         │  ├────────────────────────────────────┤ │
│  - Scatter            │  │ [Orders Table: Last 7 days]        │ │
│                       │  │  Client | Order | Status | Items   │ │
│ 📈 Metrics            │  ├────────────────────────────────────┤ │
│  - KPI Card           │  │ [Chart: Completion Trend]          │ │
│  - KPI Grid           │  │  (Line chart showing daily)        │ │
│  - Leaderboard        │  ├────────────────────────────────────┤ │
│  - Comparison         │  │ [Timeline: Upcoming Milestones]    │ │
│  - Trend Sparkline    │  └────────────────────────────────────┘ │
│                       │                                          │
│ 📋 Tables             │  Right Panel:                            │
│  - Data Table         │  Block Configuration                     │
│  - Summary Table      │  (When block selected)                   │
│  - Comparison         │                                          │
│                       │  Data Source: [Orders ▼]                │
│ 📝 Content            │  Date Range: [Last 7 days ▼]            │
│  - Heading            │  Filters: [+ Add Filter]                 │
│  - Text               │  Sort By: [Created Date ▼]              │
│  - Image              │  Limit: [50]                             │
│  - Divider            │                                          │
└─────────────────────────────────────────────────────────────────┘
```

**Why Modal vs. Full Page:**
- Keeps context of reports page visible (can see existing reports)
- Focused composition experience without navigation overhead
- Follows pattern: Reports page = management, Modal = creation
- Similar to how order creation is a dedicated flow while orders page is for browsing

### Drag & Drop Workflow

**Step 1: Start Building**
- From reports page, click "Create New Report" button
- Modal opens with:
  - Blank canvas (default)
  - Pre-built templates (Production Report, Team Performance, Client Update, etc.)
  - Clone existing report
- Choose starting point and modal opens with canvas

**Step 2: Add Components**
- Drag component from library onto canvas
- Component snaps to grid
- Auto-suggests data source based on component type
- Opens configuration panel

**Step 3: Configure Component**
- Select data source
- Configure filters (date range, status, team, etc.)
- Choose aggregation/grouping
- Style appearance (colors, labels, format)
- Set title and description

**Step 4: Arrange Layout**
- Resize components by dragging edges
- Reorder by dragging to new positions
- Add page breaks for multi-page reports
- Adjust spacing and alignment

**Step 5: Preview & Test**
- Click "Preview" to see rendered report
- Test with different date ranges
- Verify data accuracy
- Check PDF/HTML output

**Step 6: Schedule & Distribute**
- Configure schedule (frequency, time, timezone)
- Add recipients (individuals, teams, external contacts)
- Choose distribution channels (email, Slack, etc.)
- Set format (PDF, HTML, Excel)
- Preview sample email

**Step 7: Save & Activate**
- Click "Save Draft" to save without activating
- Click "Schedule" to activate recurring generation
- Modal closes, returns to reports page
- New report appears in list with status (Draft/Active)
- Can view run history and delivery status from reports page

---

## Data Source Management

### Built-In Data Sources

**Orders:**
- All orders data
- Fields: name, client, status, dates, items, team, owner
- Filters: status, client, team, date range
- Aggregations: count, total value, completion rate

**Items & Line Items:**
- Item codes and variants
- Line items (physical units)
- Fields: name, SKU, quantity, workflow stage, status, scanned count
- Filters: order, item type, workflow, status, date
- Aggregations: count, completion %, defect rate

**Teams & People:**
- Team performance data
- Individual metrics
- Fields: name, efficiency, tasks completed, items scanned, quality score
- Filters: team, department, role, status
- Aggregations: average efficiency, total output, rankings

**Tasks:**
- All tasks from Task Master
- Fields: title, assignee, team, status, priority, due date
- Filters: status, assignee, team, overdue
- Aggregations: completion rate, average completion time

**Scans & Activity:**
- QR scan events
- Workflow stage completions
- Fields: who, what, when, where (location/device)
- Filters: date range, person, team, item
- Aggregations: scan volume, frequency, patterns

**Custom Data:**
- User-uploaded CSV
- External API connections (future)
- Manual data entry
- Calculated fields from formulas

### Data Source Configuration UI

When user adds a component, they see:

```
┌───────────────────────────────────────┐
│ Configure Data Source                  │
├───────────────────────────────────────┤
│ Source Type:                           │
│ ○ Orders                               │
│ ○ Items                                │
│ ○ Teams                                │
│ ○ Tasks                                │
│ ○ Custom Data                          │
│                                        │
│ Date Range:                            │
│ [Last 7 days ▼]                        │
│  - Today                               │
│  - Last 7 days                         │
│  - Last 30 days                        │
│  - This month                          │
│  - Last month                          │
│  - Custom range...                     │
│                                        │
│ Filters:                               │
│ [+ Add Filter]                         │
│  Status = "In Production"              │
│  Team = "Sewing Line A"                │
│                                        │
│ Group By: [Client ▼]                   │
│ Sort By: [Created Date ▼] [Desc ▼]    │
│ Limit: [50]                            │
│                                        │
│ [Preview Data] [Apply]                 │
└───────────────────────────────────────┘
```

### Dynamic Date Ranges (Critical for Scheduled Reports)

**Fixed vs. Rolling:**
- **Fixed**: "January 1-31, 2025" (never changes)
- **Rolling**: "Last 7 days" (updates each run)

**Rolling Range Options:**
- Today
- Yesterday
- Last 7 days
- Last 30 days
- Last 90 days
- This week (Mon-Sun)
- Last week
- This month
- Last month
- This quarter
- Last quarter
- This year
- Last year

**Why This Matters:**
"Every Friday production report" uses rolling "last 7 days" so each Friday it shows that week's data.

---

## Template Library

### Pre-Built Templates

**Production Summary**
- KPI grid: Completed, in production, overdue, efficiency
- Orders table: Recent completions
- Timeline: Upcoming deadlines
- Trend chart: Daily completion volume

**Client Order Update**
- Client-specific filter
- Order status summary
- Item progress bars
- Photos/attachments section
- Next milestones

**Team Performance Report**
- Team leaderboard
- Efficiency trends
- Task completion rates
- Quality metrics
- Device usage stats

**Executive Monthly Summary**
- High-level KPIs
- Revenue/order volume trends
- Capacity utilization
- Year-over-year comparisons
- Strategic insights

**Quality Assurance Report**
- Defect rate trends
- Rework analysis
- Top issues breakdown
- Corrective actions tracking
- Inspection pass rates

**Inventory & Materials**
- Stock levels
- Inbound deliveries
- Usage rates
- Low stock alerts
- Supplier lead times

### Saving Custom Templates

Users can save their report layouts as templates:

```typescript
function saveAsTemplate(report: Report) {
  return {
    ...report.template,
    isTemplate: true,
    createdBy: currentUser.id,
    sharedWith: ["team", "organization", "public"],
    category: "Production", // or "Quality", "Financial", etc.
  }
}
```

Templates appear in "Start from Template" when creating new reports.

---

## Scheduling & Automation

### Schedule Configuration Interface

```
┌─────────────────────────────────────────┐
│ Schedule Report Generation               │
├─────────────────────────────────────────┤
│ Frequency:                               │
│ ○ One-time (manual only)                │
│ ● Recurring                              │
│                                          │
│ Repeat Every:                            │
│ [Weekly ▼]                               │
│  - Daily                                 │
│  - Weekly                                │
│  - Monthly                               │
│  - Quarterly                             │
│  - Yearly                                │
│  - Custom (cron)                         │
│                                          │
│ On These Days:                           │
│ ☐ Monday  ☐ Tuesday  ☐ Wednesday        │
│ ☐ Thursday  ☑ Friday  ☐ Saturday        │
│ ☐ Sunday                                 │
│                                          │
│ At Time: [5:00 PM ▼]                     │
│ Timezone: [America/New_York ▼]          │
│                                          │
│ Report Period (data shown):              │
│ [Last 7 days ▼]                          │
│                                          │
│ Start Date: [Today ▼]                    │
│ End Date: [No end date ▼]                │
│                                          │
│ Options:                                 │
│ ☑ Skip weekends                          │
│ ☐ Skip holidays                          │
│                                          │
│ Next Generation:                         │
│ Friday, October 10, 2025 at 5:00 PM     │
│                                          │
│ [Cancel] [Save Schedule]                 │
└─────────────────────────────────────────┘
```

### Common Schedule Examples

**Daily Morning Briefing**
- Frequency: Daily
- Time: 7:00 AM
- Period: Yesterday's data
- Recipients: Management team

**Weekly Production Report**
- Frequency: Weekly (Friday)
- Time: 5:00 PM
- Period: Last 7 days
- Recipients: Brand clients + internal stakeholders

**Monthly Performance Review**
- Frequency: Monthly (last business day)
- Time: 4:00 PM
- Period: This month
- Recipients: Executives

**Quarterly Business Review**
- Frequency: Quarterly
- Time: Last day of quarter, 12:00 PM
- Period: This quarter
- Recipients: Board members

### Automation Engine

**How It Works:**
1. Scheduler checks every minute for reports due to run
2. When report due:
   - Query data sources with current filters/date ranges
   - Render report components
   - Generate output file (PDF, HTML, Excel)
   - Execute distribution (send emails, post to Slack, etc.)
   - Log run in ReportRun table
3. Mark next generation time
4. Send notifications on success/failure

**Reliability:**
- Retry failed generations (up to 3 times)
- Queue system prevents overload
- Timeout protection (max 5 minutes per report)
- Email admins on repeated failures

---

## Distribution System

### Recipient Management

**Adding Recipients:**

```
┌─────────────────────────────────────────┐
│ Report Distribution                      │
├─────────────────────────────────────────┤
│ Recipients:                              │
│                                          │
│ [+ Add Recipient]                        │
│                                          │
│ Internal Recipients:                     │
│  👤 Sarah Johnson (Operations Manager)   │
│     ✉️ Email  📱 SMS  🔔 In-App          │
│                                          │
│  👤 Mike Chen (Team Lead)                │
│     ✉️ Email  🔔 In-App                  │
│                                          │
│ External Recipients:                     │
│  📧 client@horizonapparel.com            │
│     ✉️ Email only                        │
│     Filter: Only their orders            │
│                                          │
│ Teams:                                   │
│  👥 Sewing Line A (8 members)            │
│     ✉️ Email  🔔 In-App                  │
│                                          │
│ Format & Delivery:                       │
│ Attachment: [PDF ▼]                      │
│  - PDF                                   │
│  - Excel                                 │
│  - CSV                                   │
│                                          │
│ ☑ Include link to interactive dashboard │
│ ☑ Embed preview in email body            │
│ ☐ Require login to view                  │
│ ☐ Password protect files                 │
│                                          │
│ Email Settings:                          │
│ Subject: Weekly Production Report        │
│ Message:                                 │
│ ┌─────────────────────────────────────┐ │
│ │ Hi team,                            │ │
│ │                                     │ │
│ │ Attached is this week's production  │ │
│ │ summary. Key highlights:            │ │
│ │ - 287 items completed               │ │
│ │ - 94% on-time delivery              │ │
│ │                                     │ │
│ │ Let me know if you have questions.  │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ [Send Test] [Save]                       │
└─────────────────────────────────────────┘
```

### Personalized Views

**Concept:** Each recipient can see a filtered version of the report

**Example:**
- Base Report: "All Orders"
- Client A receives: Only their orders
- Client B receives: Only their orders
- Internal team: All orders

**Implementation:**
```typescript
type PersonalizedRecipient = {
  recipientId: string
  filters: FilterConfig[]  // Applied on top of base report
}

// When generating report for this recipient:
const data = await queryDataSource({
  ...baseFilters,
  ...recipient.filters
})
```

### Multi-Channel Distribution

**Email:**
- Default method
- Supports HTML inline or PDF attachment
- Customizable subject and body
- Can include links to interactive dashboard

**SMS:**
- Short summary message
- Link to full report
- For urgent/high-priority alerts

**Slack:**
- Post to channel or DM
- Embed charts inline (as images)
- Attach PDF
- Interactive buttons (view dashboard, re-run, etc.)

**Webhook:**
- POST report data to external system
- JSON payload
- For integration with other tools (Zapier, custom apps)

**Internal Dashboard:**
- Report appears in user's "Reports" section
- No email sent
- Notification badge

---

## Report Formats

### PDF Format

**Benefits:**
- Universally readable
- Preserves formatting
- Professional appearance
- Can be printed

**Features:**
- Page breaks
- Headers/footers (logo, page numbers, date)
- Table of contents
- Embedded charts as images
- Watermarks (draft, confidential, etc.)

**Export Process:**
1. Render report components to HTML
2. Apply styles (fonts, colors, spacing)
3. Convert to PDF using library (jsPDF, Puppeteer)
4. Add metadata (title, author, created date)
5. Save to file storage
6. Attach to email or make available for download

### HTML Format

**Benefits:**
- Interactive (hover, click, expand)
- Real-time data (if embedded in app)
- Responsive (works on mobile)
- Faster rendering

**Features:**
- Clickable charts (drill-down)
- Expandable tables
- Filters (if interactive dashboard)
- Print-friendly CSS

**Use Cases:**
- In-app viewing
- Email body (embed inline)
- Shareable links

### Excel Format

**Benefits:**
- Data can be analyzed further
- Users can create their own charts
- Easy to pivot, sort, filter

**Features:**
- Multiple sheets (one per data table)
- Formatted headers
- Frozen headers
- Auto-filter enabled
- Pre-formatted cells (currency, dates, etc.)

**Use Cases:**
- Financial reports
- Raw data exports
- Ad-hoc analysis needs

---

## Analytics Components (Report Building Blocks)

### Chart Types

**Line Chart**
- **Use Case:** Trends over time (completion rate, efficiency, volume)
- **Config Options:**
  - Multiple series
  - Line styles (solid, dashed, dotted)
  - Fill area under line
  - Data points visible or not
  - Y-axis scale (linear, log)
  - Annotations (events, milestones)

**Bar Chart**
- **Use Case:** Comparisons (team performance, order volume by client)
- **Config Options:**
  - Vertical or horizontal
  - Grouped or stacked
  - Color per category
  - Data labels on bars
  - Sorting (asc, desc, custom)

**Pie/Donut Chart**
- **Use Case:** Proportions (order status breakdown, time allocation)
- **Config Options:**
  - Slice colors
  - Show percentages
  - Explode slices
  - Legend position
  - Donut hole size

**Area Chart**
- **Use Case:** Cumulative trends (total items produced over time)
- **Config Options:**
  - Stacked or overlapping
  - Opacity
  - Gradient fills

**Scatter Plot**
- **Use Case:** Correlations (efficiency vs. volume, time vs. quality)
- **Config Options:**
  - Bubble size (3rd dimension)
  - Color categories
  - Trend line
  - Axis scales

**Heatmap**
- **Use Case:** Patterns (scan activity by hour/day, capacity by team/week)
- **Config Options:**
  - Color scale
  - Cell annotations
  - Grid density

**Gauge Chart**
- **Use Case:** Single metric with target (efficiency at 87% of 100% goal)
- **Config Options:**
  - Min/max range
  - Target indicator
  - Color zones (red/yellow/green)

### Metric/KPI Components

**KPI Card (Single Metric)**
- Large number
- Label
- Optional: trend indicator (↑ 12% from last week)
- Optional: sparkline
- Optional: comparison (vs. target, vs. last period)

**KPI Grid (Multiple Metrics)**
- 2x2, 3x3, or custom grid
- Each cell is a KPI card
- Uniform styling
- Quick visual summary

**Leaderboard**
- Ranked list (top teams, top performers)
- Name, metric, rank position
- Optional: avatars, badges
- Limit to top N

**Comparison Card**
- Side-by-side comparison
- "This Month vs. Last Month"
- "Team A vs. Team B"
- Shows delta and % change

**Trend Metric**
- Number + sparkline
- Compact
- Shows direction (up/down/flat)

### Table Components

**Data Table**
- Raw data rows
- Columns: any fields from data source
- Sorting, pagination (if long)
- Conditional formatting (highlight rows/cells)
- Aggregation footer (totals, averages)

**Summary Table**
- Aggregated data
- Example: "Orders by Client" (client name, order count, total value)
- Compact
- Ideal for categorical breakdowns

**Comparison Table**
- Two time periods or groups side-by-side
- Shows deltas
- Example: "This Month vs. Last Month" (orders, items, efficiency)

### Content Components

**Heading**
- Section titles
- Report title
- Styled text (H1, H2, H3)

**Paragraph/Text**
- Narrative explanations
- Executive summary
- Methodology notes
- Custom markdown or rich text

**Image**
- Logos, photos, diagrams
- Upload or URL
- Captions

**Divider**
- Visual separator between sections
- Horizontal line

**Spacer**
- Vertical whitespace
- Adjust report density

---

## Report Management Interface

### Reports Landing Page

**Route:** `/app/reports`  
**Layout Type:** Standard page (not malleable grid)  
**Purpose:** Browse, manage, and view reports; creation happens in modal

**Layout:**

```
┌─────────────────────────────────────────────────────────────┐
│ Reports & Analytics                                          │
│ [Create New Report] [Browse Templates] [View Runs]           │
├─────────────────────────────────────────────────────────────┤
│ Tabs: [My Reports] [Scheduled] [Templates] [Run History]    │
├─────────────────────────────────────────────────────────────┤
│ My Reports:                                                  │
│                                                              │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ 📊 Weekly Production Summary                         │   │
│ │ Status: ✅ Active  |  Next Run: Friday 5pm            │   │
│ │ Last Sent: Oct 3, 5pm  |  Recipients: 12             │   │
│ │ [View] [Edit] [Run Now] [Pause] [⋮]                  │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                              │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ 📈 Monthly Executive Summary                         │   │
│ │ Status: ✅ Active  |  Next Run: Oct 31, 4pm           │   │
│ │ Last Sent: Sep 30, 4pm  |  Recipients: 5             │   │
│ │ [View] [Edit] [Run Now] [⋮]                          │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                              │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ 📋 Client Order Update - Horizon Apparel             │   │
│ │ Status: ⏸ Paused                                      │   │
│ │ Last Sent: Sep 25, 10am  |  Recipients: 3            │   │
│ │ [View] [Edit] [Resume] [Delete]                      │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Design Notes:**
- Fixed layout with cards/list (similar to Orders page, Items page)
- "Create New Report" button opens full-screen modal with canvas
- "Edit" button re-opens modal with existing report loaded
- Main page stays clean and focused on report management

### Report Actions

**View:**
- Opens last generated version
- Shows in web viewer (HTML format)
- Can download PDF/Excel

**Edit:**
- Opens report builder modal (same as "Create")
- Loads existing report layout and configuration
- Can modify layout, data sources, schedule
- Changes apply to future runs
- Modal workflow maintains consistency

**Run Now:**
- Manually triggers generation
- Uses current data
- Sends to all recipients
- Useful for testing or ad-hoc updates

**Pause:**
- Stops scheduled generation
- Can resume later
- Doesn't delete report

**Duplicate:**
- Clone report structure
- Allows modifications before saving
- Useful for creating variations

**Delete:**
- Soft delete (archive)
- Can restore within 30 days
- Hard delete after 30 days

### Run History

**View all report runs:**

```
┌─────────────────────────────────────────────────────────────┐
│ Report Run History: "Weekly Production Summary"              │
├─────────────────────────────────────────────────────────────┤
│ Date         Status      Duration  Recipients  Downloads     │
│ ─────────────────────────────────────────────────────────── │
│ Oct 3, 5pm   ✅ Success   2.3s      12          8            │
│ Sep 26, 5pm  ✅ Success   2.1s      12          10           │
│ Sep 19, 5pm  ⚠️ Partial   3.2s      12          7 (2 failed) │
│ Sep 12, 5pm  ✅ Success   2.5s      12          11           │
│ Sep 5, 5pm   ❌ Failed    -         -           -            │
│ Aug 29, 5pm  ✅ Success   2.4s      12          9            │
│                                                              │
│ [View Details] [Download PDF] [Resend]                       │
└─────────────────────────────────────────────────────────────┘
```

**Run Details:**
- Execution log
- Data snapshot (how many records)
- Distribution status per recipient (sent, delivered, opened)
- Error messages (if failed)
- Generated files (download)

---

## Future Enhancements

### Phase 2: Natural Language Report Building

**Vision:** User types what they want, AI generates report

**Example:**
> "Create a weekly report showing orders completed in the last 7 days, broken down by client, with a chart of daily completion volume, and send it to all managers every Friday at 5pm."

**AI Actions:**
1. Parse intent: create report, weekly schedule, specific data sources
2. Generate report template:
   - Data table: orders (filtered: completed, last 7 days, grouped by client)
   - Chart: bar chart (x: date, y: count of orders)
3. Configure schedule: weekly, Friday, 5pm
4. Set recipients: all users with "Manager" role
5. Present draft for user approval
6. User tweaks if needed, then activates

**Implementation:**
- Use GPT-4 or similar LLM
- Structured prompts with examples
- Map natural language → report template JSON
- UI to refine AI-generated reports

### Phase 3: Interactive Dashboards

**Beyond Static Reports:**
- Real-time data (no need to regenerate)
- Users can adjust filters, date ranges
- Drill-down: click chart → see underlying data
- Collaborative: multiple users view same dashboard
- Embeddable: share link with stakeholders

**How It Differs from Reports:**
- Reports = snapshots at point in time, distributed
- Dashboards = live, interactive, self-service

### Phase 4: Predictive Analytics

**Add ML-powered insights:**
- Forecast future order volume
- Predict delays based on current progress
- Anomaly detection (orders taking unusually long)
- Recommendations (reassign work, adjust deadlines)

**Use Cases:**
- "Based on current pace, this order will be 3 days late. Suggestions: add 2 more workers or extend deadline."
- "Team A efficiency dropped 15% this week. Possible causes: new members, equipment issue, complex items."

### Phase 5: Integration with External BI Tools

**Export to:**
- Tableau
- Power BI
- Looker
- Google Data Studio

**Via:**
- Direct database connection
- API endpoints
- Scheduled exports (CSV, JSON)

---

## MVP/Demo Approach

### Minimal Reporting Blocks Library

For initial demo and proof of concept, start with a focused set of "reporting blocks" rather than the full component library:

**Essential Blocks (Demo Set):**

1. **KPI Grid Block** (4 metrics in 2x2 grid)
   - Shows: Completed Orders, In Production, Overdue, Efficiency %
   - Data source: Orders
   - Configuration: Choose which 4 metrics to display

2. **Orders Table Block**
   - Filtered data table showing recent orders
   - Columns: Client, Order Name, Status, Items, Timeline
   - Configuration: Date range filter, status filter, limit

3. **Trend Chart Block** (Line chart)
   - Daily/weekly trend line
   - Data source: Orders completion over time
   - Configuration: Date range, metric to plot

4. **Text/Header Block**
   - Report title and section headers
   - Configuration: Text content, heading level

5. **Timeline Block** (Upcoming milestones)
   - Shows next 5-10 upcoming deadlines
   - Data source: Orders with ship dates
   - Configuration: Days ahead to show

**Single Example Report: "Weekly Production Summary"**

Pre-built template that demonstrates the system:
- Header: "Weekly Production Summary"
- KPI Grid: 4 key metrics
- Orders Table: Completed orders (last 7 days)
- Trend Chart: Daily completion volume
- Timeline: Upcoming deadlines (next 14 days)

**Why This Approach:**
- Proves the modal canvas concept
- Shows drag-and-drop functionality
- Demonstrates data source flexibility
- Provides working example for user testing
- Foundation for expanding to full library later

**Future Expansion:**
- Add more chart types (bar, pie, scatter)
- Add specialized blocks (leaderboards, heatmaps, gauges)
- Add more table variations
- Build template library
- Eventually: Full component catalog with 20+ blocks

### Implementation Focus for Demo

**Phase 1: Core Infrastructure**
- Report builder modal component
- Canvas/grid surface (reuse grid-v2)
- Component drag-and-drop
- Single data source connector (Orders)

**Phase 2: Minimal Block Set**
- Build only the 5 essential blocks listed above
- Each block has basic configuration panel
- Focus on polish and usability

**Phase 3: One Working Example**
- Pre-populate "Weekly Production Summary" template
- Working data connections
- Functional preview
- Save/load capability

**Phase 4: Prove the Concept**
- User can modify the example report
- Can create new blank report
- Can drag blocks onto canvas
- Can configure data sources
- Preview looks good

**No Need for Demo:**
- Full scheduling system (can fake it)
- Email distribution (can fake it)
- PDF generation (HTML preview is enough)
- Excel export
- Template library (just one example)
- 20+ block types (just 5)

**This Gets Us:**
- Visual proof of report builder modal
- Working canvas composition
- Real data connections
- Enough to show stakeholders and get feedback
- Foundation to build full system on

---

## Technical Implementation

### Architecture

**Components:**
1. **Report Builder Modal** (`/components/ReportBuilderModal.tsx`)
   - Full-screen modal overlay
   - Drag-and-drop canvas (reuses grid-v2)
   - Component library sidebar (left panel)
   - Configuration panels (right panel)
   - Preview mode
   - Triggered from "Create Report" button on `/app/reports` page

2. **Data Engine** (`/lib/reporting/dataEngine.ts`)
   - Query builder
   - Data source connectors
   - Aggregation/calculation logic
   - Caching layer

3. **Rendering Engine** (`/lib/reporting/renderer.ts`)
   - Render report template → HTML
   - Chart rendering (using Recharts, Chart.js, etc.)
   - Table rendering (using existing table components)
   - Export to PDF (Puppeteer or jsPDF)
   - Export to Excel (ExcelJS)

4. **Scheduler** (`/lib/reporting/scheduler.ts`)
   - Cron-like scheduling
   - Job queue (BullMQ or similar)
   - Retry logic
   - Logging

5. **Distribution Engine** (`/lib/reporting/distribution.ts`)
   - Email sending (via SendGrid, SES, etc.)
   - Slack integration
   - SMS (Twilio)
   - Webhook dispatcher

6. **Storage** (using Convex [[memory:5163741]])
   - Reports table
   - ReportRuns table
   - ReportTemplates table
   - Generated files (S3, Cloudflare R2, or similar)

### Data Flow

**Report Creation:**
```
User → Report Builder → Save Report → Database (Convex)
```

**Scheduled Generation:**
```
Scheduler → Check due reports → 
  Data Engine (query data) → 
  Rendering Engine (generate PDF/HTML) → 
  Storage (save file) → 
  Distribution Engine (send emails) → 
  Log ReportRun
```

**Manual Generation:**
```
User clicks "Run Now" → 
  Trigger generation (same as scheduled) → 
  Show success toast → 
  Redirect to view report
```

### Key Libraries

**Charts:**
- Recharts (React-based, easy)
- Chart.js (flexible, widely used)
- Victory (beautiful, animated)
- Visx (D3-powered, advanced)

**PDF Generation:**
- jsPDF (client-side, simple)
- Puppeteer (server-side, renders HTML to PDF, high-quality)
- react-pdf (React components → PDF)

**Excel Export:**
- ExcelJS (full-featured)
- xlsx (SheetJS, lightweight)

**Scheduling:**
- node-cron (simple)
- BullMQ (robust, Redis-based, recommended for production)
- Agenda (MongoDB-based alternative)

**Email:**
- SendGrid
- AWS SES
- Postmark
- Resend (new, developer-friendly)

---

## Database Schema (Convex)

### Tables

**reports**
- id (string)
- name (string)
- description (string, optional)
- template (object: ReportTemplate)
- dataSources (array: DataSourceConfig[])
- schedule (object: ScheduleConfig, optional)
- distribution (object: DistributionConfig)
- status (string: "Draft" | "Active" | "Paused" | "Archived")
- createdBy (string: user ID)
- owner (string: user ID)
- sharedWith (array: user IDs)
- tags (array: strings)
- category (string)
- isTemplate (boolean)
- createdAt (timestamp)
- updatedAt (timestamp)

**reportRuns**
- id (string)
- reportId (string, foreign key)
- startedAt (timestamp)
- completedAt (timestamp, optional)
- duration (number, seconds)
- status (string: "queued" | "running" | "completed" | "failed")
- error (string, optional)
- outputFormat (string: "pdf" | "html" | "excel")
- fileUrl (string, optional)
- fileSize (number, bytes)
- distributionStatus (array: DistributionStatus[])
- dataCapturedAt (timestamp)
- dataPoints (number)
- triggeredBy (string: "schedule" | "manual" | "api")
- triggeredByUser (string, user ID, optional)

**reportTemplates** (or just filter `reports` where `isTemplate = true`)
- id (string)
- name (string)
- description (string)
- template (object: ReportTemplate)
- category (string)
- createdBy (string: user ID)
- sharedWith (array: "team" | "organization" | "public")
- usageCount (number)
- rating (number, 1-5, optional)
- createdAt (timestamp)

### Indexes

- reports: by owner, by status, by category
- reportRuns: by reportId, by status, by startedAt (for history queries)
- reportTemplates: by category, by createdBy

---

## Security & Permissions

### Access Control

**Who Can Create Reports:**
- Managers, Admins
- Optional: Allow all users, but with review/approval workflow

**Who Can View Reports:**
- Report creator/owner
- Users in `sharedWith` array
- Recipients (if they have accounts)
- Public reports (if enabled)

**Who Can Edit Reports:**
- Report owner
- Admins

**Who Can Schedule Reports:**
- Report owner
- Admins

**Data Permissions:**
- Reports respect user permissions
- If user can't view orders, report shouldn't show orders
- Personalized views filter data per recipient

### Data Privacy

**External Recipients (Clients):**
- Only see data relevant to them
- Can't access raw data sources
- Links expire after X days
- Optional: password-protect PDFs

**Sensitive Data:**
- Financial data, personal info → restricted access
- Watermarks on confidential reports
- Audit trail: who viewed/downloaded reports

---

## Performance Considerations

### Caching

**Data Queries:**
- Cache frequently used queries
- TTL based on data freshness needs
- Invalidate on data updates

**Rendered Reports:**
- Cache rendered HTML/PDF
- Regenerate only when data changes or schedule triggers
- Serve cached version for "View" action

### Optimization

**Large Datasets:**
- Pagination for tables
- Sampling for charts (don't plot 100k points)
- Aggregation at query level (not client-side)

**PDF Generation:**
- Limit image sizes
- Compress PDFs
- Use efficient fonts (system fonts, not custom)

**Distribution:**
- Batch emails (don't send one by one)
- Rate limiting (respect email service limits)
- Parallel processing (multiple recipients simultaneously)

---

## Success Metrics

### Adoption
- 80%+ of managers create at least one report
- 50+ active scheduled reports within 6 months
- Average 3 reports per user

### Usage
- 90%+ of scheduled reports run successfully
- <5% distribution failures
- Average report generation time <5 seconds

### Engagement
- 70%+ of recipients open emails with reports
- 40%+ click through to interactive dashboards
- Users spend 10+ minutes reviewing reports weekly

### Business Impact
- Reduced time to compile reports (from hours to minutes)
- Faster decision-making (real-time data)
- Increased client satisfaction (proactive updates)

---

## Open Questions

1. **File Storage:** Where to store generated PDFs/Excel files? S3? Cloudflare R2? Convex file storage?
2. **Scheduling Service:** Run in-app (Node.js cron) or external (AWS Lambda, cron job)? Need to consider scale.
3. **Email Service:** Which provider? SendGrid (robust, expensive), Resend (new, affordable), AWS SES (cheap, complex)?
4. **Chart Rendering for PDF:** Server-side (Puppeteer screenshots) or client-side (canvas to image)? Trade-offs: quality vs. performance.
5. **Report Versioning:** If user edits report, do past runs still reference old template? How to handle breaking changes?
6. **Multi-Tenancy:** If multiple orgs use system, how to isolate report data? Separate databases? Row-level security?
7. **Report Collaboration:** Can multiple users co-edit a report (like Figma)? Or lock-based editing?
8. **Approval Workflow:** Some orgs require reports to be approved before sending. Do we need approval steps?

---

## Component Architecture for Demo

### Key Components

**Main Page (`/app/reports/page.tsx`):**
- Standard page layout (not malleable grid)
- Reports list (cards or table)
- "Create Report" button triggers modal
- Tabs: My Reports, Scheduled, Templates, Run History

**Report Builder Modal (`/components/ReportBuilderModal.tsx`):**
- Full-screen modal overlay
- Three-panel layout: Library (left), Canvas (center), Config (right)
- Canvas uses grid-v2 system
- Save/Preview/Schedule actions in header

**Reporting Blocks (5 for demo):**
1. `components/blocks/reporting/KPIGrid.tsx`
2. `components/blocks/reporting/OrdersTable.tsx`
3. `components/blocks/reporting/TrendChart.tsx`
4. `components/blocks/reporting/Header.tsx`
5. `components/blocks/reporting/Timeline.tsx`

**Shared/Reused Components:**
- Grid system from `lib/grid-v2`
- Existing chart library (Recharts or similar)
- Table components (base styling)
- UI primitives (Button, Modal, Input, Select from `components/ui`)

---

## Implementation Roadmap

### Phase 0: Foundation (Weeks 1-2)
- Define TypeScript types (Report, ReportTemplate, etc.)
- Set up Convex tables (reports, reportRuns)
- Create mock data generators
- Build basic CRUD operations

### Phase 1: Report Builder UI (Weeks 3-5)
- Build report builder page (`/app/reports/builder`)
- Implement drag-and-drop canvas (reuse grid-v2)
- Create component library sidebar
- Add configuration panels
- Preview mode

### Phase 2: Data Engine (Weeks 6-7)
- Build data source connectors (orders, items, teams, tasks)
- Implement query builder with filters, aggregations
- Add dynamic date range logic
- Caching layer

### Phase 3: Rendering Engine (Weeks 8-9)
- Render report template → HTML
- Integrate chart library (Recharts)
- Integrate table components
- Export to PDF (using Puppeteer)
- Export to Excel (using ExcelJS)

### Phase 4: Scheduler (Weeks 10-11)
- Build scheduling service (BullMQ or cron)
- Implement job queue
- Add retry logic
- Logging and monitoring

### Phase 5: Distribution (Weeks 12-13)
- Email integration (SendGrid or Resend)
- Personalized views (filter per recipient)
- Multi-channel support (Slack, SMS)
- Delivery tracking (sent, opened)

### Phase 6: Reports Management (Weeks 14-15)
- Build reports landing page (`/app/reports`)
- Report list, filters, search
- Run history view
- Manual "Run Now" action
- Pause/resume/delete reports

### Phase 7: Templates (Weeks 16-17)
- Create pre-built templates (Production, Executive, etc.)
- "Save as Template" functionality
- Template library browse/search
- Clone template to new report

### Phase 8: Polish & Testing (Weeks 18-20)
- Performance optimization (caching, batch processing)
- Error handling (graceful failures)
- User testing and feedback
- Documentation and training materials
- Launch to pilot users

### Phase 9: Advanced Features (Post-Launch)
- Natural language report building (AI)
- Interactive dashboards
- Predictive analytics
- Integration with external BI tools

---

## Next Steps

1. **Stakeholder Review:** Validate vision, priorities, and feature set
2. **Design Mockups:** Create detailed wireframes for report builder, reports page, and key flows
3. **Technical Spike:** Test PDF generation libraries, chart rendering, and Convex integration
4. **Build Mock Data:** Generate sample reports to use for prototyping
5. **Begin Phase 0:** Implement TypeScript types and Convex tables
6. **Pilot Use Case:** Choose one report type (e.g., "Weekly Production Summary") to build end-to-end as proof of concept

---

*Document created: October 5, 2025*  
*Status: Planning - Awaiting Review*  
*Next Review: After stakeholder validation and technical feasibility assessment*
