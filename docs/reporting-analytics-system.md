# Analytics & Reporting System Blueprint — 10/05/25
**Updated: 10/09/25 - Enhanced with AI Recommendations & Advanced Distribution**

## Mission
Build a domain-agnostic analytics and reporting hub that transforms raw operational data into actionable insights, customizable reports, and automated distribution systems. The core focus is on **intelligent report building**—empowering users to compose, schedule, and share beautifully formatted reports without technical expertise, enhanced with AI-powered recommendations and sophisticated cadence management.

## Experience Principles
- **Report-First Architecture**: While analytics visualizations are powerful, the system's primary job is enabling users to build, customize, and distribute reports.
- **Grid-as-Canvas**: The report builder uses the existing grid system where users drag analytics components onto a page that becomes the actual report.
- **AI-Guided Assembly**: As users select data sources, the system intelligently recommends report types, formats, and visualizations based on common patterns and best practices.
- **Component-Based Assembly**: Analytics blocks (charts, tables, KPIs) are building blocks that snap together to form comprehensive reports.
- **Schedule Once, Run Forever**: Configure reports to generate and send automatically at any cadence—daily, weekly, monthly, or custom intervals.
- **Intelligent Contact Management**: Sophisticated recipient systems that understand relationships, roles, and data access permissions.
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

## AI-Powered Report Recommendations

### Intelligence Layer

**Vision:** Transform report creation from manual assembly to AI-assisted composition where the system learns from data patterns, user behavior, and industry best practices to suggest optimal report structures.

### How AI Recommendations Work

**Step 1: Data Source Selection**
When user selects one or more data sources, the AI analyzes:
- Data types and structure (time series, categorical, hierarchical)
- Volume and granularity
- Relationships between selected sources
- Historical usage patterns for these data types

**Step 2: Pattern Recognition**
The system identifies:
- Common report types for this data combination
- Industry-standard visualizations
- Reports other users created with similar data
- Seasonal or temporal patterns in the data

**Step 3: Intelligent Suggestions**
Present user with:
- 3-5 recommended report templates
- Suggested visualization types for each data field
- Optimal grouping and aggregation strategies
- Recommended cadence based on data freshness
- Suggested recipients based on data ownership and access patterns

### Recommendation Engine Architecture

```typescript
type AIRecommendation = {
  id: string
  confidence: number                    // 0-100, how confident is this suggestion
  reportType: string                    // "Production Summary", "Quality Analysis", etc.
  reasoning: string                     // "Based on 45 similar reports created by operations teams"
  
  suggestedBlocks: SuggestedBlock[]     // Recommended components
  suggestedSchedule: ScheduleConfig     // Recommended cadence
  suggestedRecipients: string[]         // Recommended distribution list
  
  similarReports: string[]              // IDs of similar existing reports
  usageCount: number                    // How many times this pattern has been used
  averageRating: number                 // User feedback on this recommendation
}

type SuggestedBlock = {
  type: AnalyticsBlockType              // Chart, table, KPI, etc.
  dataSource: string
  config: Partial<BlockConfig>          // Pre-configured settings
  position: GridCoordinates             // Suggested placement
  reasoning: string                     // "Line charts work best for time series data"
  alternatives: AnalyticsBlockType[]    // Other valid options
}
```

### Smart Data Analysis

**When User Selects "Orders" Data Source:**

**AI Analysis:**
- Detects: Time-stamped data with status field
- Identifies: Order volume, completion rates, client distribution
- Recognizes: Production workflow pattern

**Recommendations Generated:**

1. **"Weekly Production Summary" (95% confidence)**
   - Suggested blocks:
     - KPI Grid: Total orders, completion rate, average time, on-time %
     - Trend Line: Orders completed over time
     - Bar Chart: Orders by client
     - Status Table: Current orders in production
   - Suggested schedule: Weekly, Friday 5pm
   - Reasoning: "This is the most common report type for order data, created by 78% of operations managers"

2. **"Client Performance Report" (88% confidence)**
   - Suggested blocks:
     - Client leaderboard: By order volume
     - Comparison table: This month vs last month per client
     - Heatmap: Order frequency by client and week
   - Suggested schedule: Monthly, last business day
   - Reasoning: "Great for tracking client relationships and identifying top customers"

3. **"Production Velocity Dashboard" (82% confidence)**
   - Suggested blocks:
     - Gauge: Current completion rate vs target
     - Waterfall chart: Orders moving through stages
     - Timeline: Upcoming delivery deadlines
   - Suggested schedule: Daily, 8am
   - Reasoning: "Real-time production tracking for fast-paced environments"

**When User Selects "Orders + Items + Teams" (Multiple Sources):**

**AI Analysis:**
- Detects: Production operation with team assignments
- Identifies: Relationships between orders, line items, and team performance
- Recognizes: Opportunity for cross-referential analysis

**Recommendations Generated:**

1. **"Comprehensive Production Report" (92% confidence)**
   - Suggested blocks:
     - KPI Grid: Orders, items, team count, efficiency
     - Team leaderboard: By items completed
     - Orders table: With assigned teams and item counts
     - Scatter plot: Team efficiency vs order complexity
   - Suggested schedule: Weekly
   - Reasoning: "Combining these data sources enables full production oversight"

2. **"Team Performance Deep Dive" (87% confidence)**
   - Focus: Team-centric view
   - Suggested blocks:
     - Team comparison table
     - Items per team trend
     - Quality metrics by team
     - Workload distribution chart
   - Suggested schedule: Bi-weekly
   - Reasoning: "Perfect for team management and capacity planning"

### Smart Visualization Selection

**AI Logic for Visualization Recommendations:**

```typescript
function recommendVisualizationType(dataProfile: DataProfile): VisualizationRecommendation[] {
  const recommendations: VisualizationRecommendation[] = []
  
  // Time series data → Line or area chart
  if (dataProfile.hasTimestamp && dataProfile.isSequential) {
    recommendations.push({
      type: "chart.line",
      confidence: 95,
      reasoning: "Time series data displays trends most clearly with line charts",
      alternatives: ["chart.area", "chart.bar"]
    })
  }
  
  // Categorical with values → Bar chart
  if (dataProfile.hasCategorical && dataProfile.hasNumericValues) {
    recommendations.push({
      type: "chart.bar",
      confidence: 90,
      reasoning: "Bar charts excel at comparing values across categories",
      alternatives: ["chart.pie", "table.summary"]
    })
  }
  
  // Proportions/percentages → Pie or donut
  if (dataProfile.isProportional && dataProfile.categoryCount <= 8) {
    recommendations.push({
      type: "chart.donut",
      confidence: 85,
      reasoning: "Donut charts show part-to-whole relationships clearly",
      alternatives: ["chart.pie", "metric.grid"]
    })
  }
  
  // Large number of records → Table with pagination
  if (dataProfile.recordCount > 100) {
    recommendations.push({
      type: "table.data",
      confidence: 88,
      reasoning: "Tables handle large datasets better than visual charts",
      alternatives: ["chart.heatmap"]
    })
  }
  
  // Single metric → KPI card
  if (dataProfile.isSingleValue) {
    recommendations.push({
      type: "metric.kpi",
      confidence: 92,
      reasoning: "Single values deserve prominent KPI display",
      alternatives: ["metric.trend", "chart.gauge"]
    })
  }
  
  // Comparison of two periods → Comparison chart/table
  if (dataProfile.hasTwoTimeRanges) {
    recommendations.push({
      type: "metric.comparison",
      confidence: 90,
      reasoning: "Period-over-period comparisons are most meaningful side-by-side",
      alternatives: ["table.comparison", "chart.bar"]
    })
  }
  
  // Hierarchical data → Tree or sunburst
  if (dataProfile.isHierarchical) {
    recommendations.push({
      type: "chart.sunburst",
      confidence: 78,
      reasoning: "Hierarchical data benefits from nested visualizations",
      alternatives: ["table.data", "chart.treemap"]
    })
  }
  
  // Geographic data → Map
  if (dataProfile.hasGeolocation) {
    recommendations.push({
      type: "map.geographic",
      confidence: 94,
      reasoning: "Location data is best displayed on maps",
      alternatives: ["table.data"]
    })
  }
  
  return recommendations.sort((a, b) => b.confidence - a.confidence)
}
```

### Learning from Usage Patterns

**System Learns:**
1. **User Preferences:** Tracks which recommendations users accept/reject
2. **Report Success:** Monitors which reports get viewed, shared, and generate positive feedback
3. **Industry Patterns:** Identifies domain-specific reporting norms
4. **Seasonal Trends:** Recognizes time-based reporting needs (quarterly reviews, year-end summaries)

**Feedback Loop:**
```typescript
type RecommendationFeedback = {
  recommendationId: string
  accepted: boolean                     // Did user use this recommendation?
  modified: boolean                     // Did user tweak it?
  modifications?: string[]              // What changes did they make?
  userRating?: number                   // 1-5 stars
  reportPerformance?: {
    viewCount: number
    shareCount: number
    recipientEngagement: number         // Average open/click rate
  }
}

// AI adjusts future recommendations based on feedback
function adjustRecommendationWeights(feedback: RecommendationFeedback[]) {
  // Patterns that get accepted more → higher confidence
  // Modifications get incorporated into future suggestions
  // Low-performing reports → lower confidence for similar patterns
}
```

### Contextual Intelligence

**Domain Detection:**
System recognizes operational context and tailors recommendations:

**Fashion/Apparel Production:**
- Recommends production reports, quality tracking, client updates
- Suggests grouping by: collection, season, client, item type
- Typical cadence: Weekly production, monthly client reviews

**Construction:**
- Recommends project progress, safety reports, resource allocation
- Suggests grouping by: project, contractor, phase, location
- Typical cadence: Daily progress, weekly stakeholder updates

**Manufacturing:**
- Recommends throughput, quality control, inventory reports
- Suggests grouping by: product line, shift, machine, defect type
- Typical cadence: Shift reports, daily summaries, monthly KPIs

**Service Operations:**
- Recommends SLA compliance, ticket resolution, customer satisfaction
- Suggests grouping by: client, team, ticket type, severity
- Typical cadence: Real-time dashboards, weekly summaries

### Smart Schedule Recommendations

**AI Analyzes Data Freshness to Suggest Cadence:**

```typescript
function recommendSchedule(dataSource: DataSourceConfig): ScheduleRecommendation {
  const updateFrequency = analyzeDataUpdateFrequency(dataSource)
  const businessContext = detectBusinessContext(dataSource)
  
  if (updateFrequency === "real-time") {
    return {
      frequency: "daily",
      time: "08:00",
      reasoning: "Data updates continuously; daily morning reports keep teams informed",
      alternatives: ["hourly", "twice-daily"]
    }
  }
  
  if (updateFrequency === "daily") {
    return {
      frequency: "weekly",
      daysOfWeek: ["Friday"],
      time: "17:00",
      reasoning: "Weekly summaries capture trends without overwhelming recipients",
      alternatives: ["daily", "bi-weekly"]
    }
  }
  
  if (updateFrequency === "weekly") {
    return {
      frequency: "monthly",
      dayOfMonth: "last",
      time: "16:00",
      reasoning: "Monthly reports align with business cycles and strategic planning",
      alternatives: ["weekly", "quarterly"]
    }
  }
  
  if (businessContext === "executive") {
    return {
      frequency: "monthly",
      dayOfMonth: "last",
      reasoning: "Executives prefer high-level monthly summaries",
      alternatives: ["quarterly"]
    }
  }
  
  if (businessContext === "operational") {
    return {
      frequency: "daily",
      time: "08:00",
      reasoning: "Operations teams need daily visibility",
      alternatives: ["twice-daily", "weekly"]
    }
  }
  
  if (businessContext === "client-facing") {
    return {
      frequency: "weekly",
      daysOfWeek: ["Monday", "Thursday"],
      reasoning: "Clients appreciate regular updates without daily noise",
      alternatives: ["weekly", "bi-weekly"]
    }
  }
  
  return {
    frequency: "weekly",
    daysOfWeek: ["Friday"],
    time: "17:00",
    reasoning: "Weekly Friday reports are the most common pattern",
    alternatives: ["daily", "monthly"]
  }
}
```

### Smart Recipient Recommendations

**AI Suggests Recipients Based On:**

1. **Data Ownership:** Who owns/manages the data in the report?
2. **Role Matching:** Operations reports → operations managers
3. **Historical Patterns:** Who typically receives similar reports?
4. **Org Structure:** Manager gets report, team gets summary
5. **Access Permissions:** Only suggest recipients who can view this data

```typescript
function recommendRecipients(report: Report): RecipientRecommendation[] {
  const recommendations: RecipientRecommendation[] = []
  
  // Analyze report content
  const dataOwners = identifyDataOwners(report.dataSources)
  const relevantRoles = mapDataToRoles(report.dataSources)
  const similarReportRecipients = findSimilarReportRecipients(report)
  
  // Data owners always recommended (high confidence)
  recommendations.push(...dataOwners.map(owner => ({
    recipient: owner,
    confidence: 95,
    reasoning: "Manages the data included in this report",
    role: "Primary Owner"
  })))
  
  // Role-based recommendations
  if (report.category === "Production") {
    recommendations.push(...findUsersByRole("Operations Manager").map(user => ({
      recipient: user,
      confidence: 88,
      reasoning: "Production reports typically go to operations managers",
      role: "Stakeholder"
    })))
  }
  
  if (report.category === "Executive") {
    recommendations.push(...findUsersByRole("Executive").map(user => ({
      recipient: user,
      confidence: 92,
      reasoning: "Executive-level summary",
      role: "Leadership"
    })))
  }
  
  // Pattern-based recommendations
  const frequentRecipients = findFrequentRecipients(similarReportRecipients)
  recommendations.push(...frequentRecipients.map(recip => ({
    recipient: recip.user,
    confidence: recip.frequency * 100,
    reasoning: `Receives ${recip.count} similar reports`,
    role: "Regular Recipient"
  })))
  
  // External stakeholders (if data includes client info)
  if (containsClientData(report)) {
    const clientContacts = findClientContacts(report)
    recommendations.push(...clientContacts.map(contact => ({
      recipient: contact,
      confidence: 85,
      reasoning: "Client stakeholder for orders in this report",
      role: "External Client"
    })))
  }
  
  return recommendations.sort((a, b) => b.confidence - a.confidence)
}
```

### Interactive Recommendation UI

**In Report Builder:**

```
┌─────────────────────────────────────────────────────────────┐
│ Report Builder: New Report                                   │
│                                                              │
│ Step 1: Select Data Sources                                 │
│ ☑ Orders                                                     │
│ ☑ Items                                                      │
│ ☐ Teams                                                      │
│ ☐ Tasks                                                      │
│                                                              │
│ 🤖 AI Recommendations (based on your selection):            │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ ⭐ Weekly Production Summary (95% match)                 ││
│ │                                                          ││
│ │ Based on 78 similar reports created by ops managers     ││
│ │                                                          ││
│ │ Includes:                                                ││
│ │ • KPI Grid: Orders completed, in production, overdue    ││
│ │ • Trend Chart: Daily completion volume                  ││
│ │ • Table: Orders by client with item counts              ││
│ │ • Timeline: Upcoming deadlines                           ││
│ │                                                          ││
│ │ Suggested Schedule: Weekly, Friday 5pm                  ││
│ │ Suggested Recipients: Operations team (8 people)        ││
│ │                                                          ││
│ │ [Use This Template] [Customize] [Show Others]           ││
│ └─────────────────────────────────────────────────────────┘│
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Client Performance Report (88% match)                    ││
│ │ [View Details]                                           ││
│ └─────────────────────────────────────────────────────────┘│
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Production Velocity Dashboard (82% match)                ││
│ │ [View Details]                                           ││
│ └─────────────────────────────────────────────────────────┘│
│                                                              │
│ [Start from Scratch] [See All Templates]                    │
└─────────────────────────────────────────────────────────────┘
```

**Continuous Recommendations:**

Even after initial setup, AI continues to suggest improvements:
- "Add a comparison chart to see month-over-month change"
- "78% of similar reports include a team leaderboard"
- "Consider scheduling this report bi-weekly instead of weekly based on data update frequency"
- "Recipients who receive similar reports: Sarah Johnson, Mike Chen"

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

## Advanced Cadence & Notification Management

### Intelligent Scheduling System

**Beyond Basic Scheduling:** The reporting system provides sophisticated cadence management that goes far beyond "send every Friday at 5pm."

### Multi-Level Cadence Architecture

```typescript
type AdvancedScheduleConfig = {
  // Base schedule (existing)
  baseSchedule: ScheduleConfig
  
  // Conditional scheduling
  conditions?: ScheduleCondition[]
  
  // Adaptive scheduling
  adaptive?: AdaptiveScheduleConfig
  
  // Event-triggered schedules
  triggers?: EventTrigger[]
  
  // Pause/resume rules
  pauseRules?: PauseRule[]
  
  // Notification preferences
  notifications: NotificationConfig
}

type ScheduleCondition = {
  id: string
  type: "data_threshold" | "business_rule" | "calendar_event"
  
  // Only send report if condition is met
  condition: string                     // "order_count > 10", "has_overdue_items"
  action: "send" | "skip" | "modify"
  
  // Modify report if condition true
  modification?: {
    addWarning?: boolean
    highlightSection?: string
    changeRecipients?: string[]
  }
}

type AdaptiveScheduleConfig = {
  enabled: boolean
  
  // Adjust frequency based on data activity
  adaptToDataVolume: boolean            // More data → more frequent reports
  
  // Learn optimal send times
  optimizeForEngagement: boolean        // Send when recipients most likely to open
  
  // Reduce noise during quiet periods
  skipIfNoChanges: boolean              // Don't send if data unchanged
  skipIfBelowThreshold: boolean         // Don't send if metrics below threshold
  
  // Holiday/weekend intelligence
  respectBusinessHours: boolean
  shiftAroundHolidays: boolean          // Move Friday report to Thursday before holiday
}

type EventTrigger = {
  id: string
  type: "data_event" | "system_event" | "external_event"
  
  // Trigger report when event occurs
  event: string                         // "order_completed", "milestone_reached", "deadline_approaching"
  
  // Optional: Additional conditions
  conditions?: string[]
  
  // Throttling (don't spam)
  minTimeBetweenTriggers: number        // Hours
  maxTriggersPerDay: number
  
  // Custom recipients for this trigger
  recipientsOverride?: string[]
}

type PauseRule = {
  id: string
  reason: string
  
  // Date range pause
  startDate?: string
  endDate?: string
  
  // Conditional pause
  condition?: string                    // "during_year_end_close", "when_audit_active"
  
  // Resume automatically
  autoResume: boolean
}
```

### Conditional Report Sending

**Smart Rules that Decide Whether to Send:**

**Example 1: Volume-Based Sending**
```typescript
{
  condition: "order_count >= 5",
  action: "send",
  reasoning: "Only send report if there are at least 5 orders to review"
}
// If < 5 orders, skip this run
```

**Example 2: Threshold Alerts**
```typescript
{
  condition: "overdue_percentage > 20",
  action: "modify",
  modification: {
    addWarning: true,
    highlightSection: "overdue_orders",
    changeRecipients: ["operations_manager", "ceo"]  // Escalate
  }
}
// If >20% overdue, add warning banner and notify leadership
```

**Example 3: Change Detection**
```typescript
{
  condition: "data_changed_since_last_run",
  action: "send",
  reasoning: "No need to send if data hasn't changed"
}
// Skip sending identical reports
```

### Event-Triggered Reporting

**Automatic Reports Based on Business Events:**

**Production Milestone Triggers:**
```typescript
{
  type: "data_event",
  event: "order_completed",
  conditions: [
    "order.value > 50000",           // Only for large orders
    "order.client === 'VIP'"          // Or VIP clients
  ],
  minTimeBetweenTriggers: 1,         // Max 1 per hour
  recipients: ["client_contact", "account_manager"]
}
// Sends completion report automatically when big order finishes
```

**Deadline Warnings:**
```typescript
{
  type: "system_event",
  event: "deadline_approaching",
  conditions: [
    "days_until_deadline <= 3",
    "completion_percentage < 80"
  ],
  recipients: ["production_manager", "team_lead"]
}
// Alert if order at risk of missing deadline
```

**Quality Issues:**
```typescript
{
  type: "data_event",
  event: "defect_rate_spike",
  conditions: [
    "current_defect_rate > (average_defect_rate * 1.5)"
  ],
  maxTriggersPerDay: 2,
  recipients: ["quality_manager", "production_lead"]
}
// Immediate alert when quality drops
```

### Adaptive Scheduling Intelligence

**System Learns Optimal Send Times:**

1. **Engagement Analysis:**
   - Track when recipients open reports
   - Identify patterns (e.g., "Sarah opens reports Monday morning")
   - Adjust send times to maximize engagement

2. **Data Activity Patterns:**
   - If production ramps up, increase report frequency
   - During slow periods, reduce frequency
   - Seasonal adjustments (busy season vs. slow season)

3. **Noise Reduction:**
   - Skip reports when data unchanged
   - Combine multiple minor updates into single report
   - Reduce frequency if open rates decline

**Example: Adaptive Daily Report**
```typescript
{
  baseSchedule: {
    frequency: "daily",
    time: "09:00"
  },
  adaptive: {
    enabled: true,
    optimizeForEngagement: true,      // Learns best send time
    skipIfNoChanges: true,             // Don't send if data unchanged
    adaptToDataVolume: true            // More activity = keep daily, less = reduce to weekly
  }
}

// System behavior:
// - Week 1: Sends daily at 9am (baseline)
// - Week 2: Notices recipient opens at 7am, shifts to 7am
// - Week 3: Data unchanged 3 days, skips those days
// - Week 4: Low activity detected, suggests weekly instead
```

### Advanced Notification System

```typescript
type NotificationConfig = {
  // Pre-send notifications
  preSendNotification?: {
    enabled: boolean
    minutesBefore: number              // "Report generating in 10 minutes"
    recipients: string[]               // Who gets the heads-up
  }
  
  // Post-send confirmations
  postSendConfirmation: {
    enabled: boolean
    includeMetrics: boolean            // Show data summary in notification
    notifyOnlyOwner: boolean           // Or all recipients
  }
  
  // Failure alerts
  failureAlerts: {
    enabled: boolean
    recipients: string[]               // Who to notify on failure
    retryAttempts: number
    escalateAfter: number              // Minutes before escalating
    escalateTo: string[]               // Escalation contacts
  }
  
  // Engagement tracking
  engagementTracking: {
    enabled: boolean
    notifyOnLowEngagement: boolean     // Alert if nobody opens report
    threshold: number                  // Hours to wait before alert
  }
  
  // Digest mode
  digest: {
    enabled: boolean
    combineMultipleReports: boolean    // Bundle multiple reports into single email
    frequency: "daily" | "weekly"
  }
  
  // Quiet hours
  quietHours: {
    enabled: boolean
    startTime: string                  // "22:00"
    endTime: string                    // "07:00"
    timezone: string
    action: "delay" | "skip"           // Delay until morning or skip entirely
  }
  
  // Preference overrides
  recipientPreferences: {
    allowUnsubscribe: boolean
    allowFrequencyChange: boolean      // Let recipients choose their cadence
    allowChannelSelection: boolean     // Let recipients choose email vs Slack vs SMS
  }
}
```

### Notification Scenarios

**Scenario 1: Critical Production Report**
```typescript
{
  preSendNotification: {
    enabled: true,
    minutesBefore: 15,
    recipients: ["production_manager"],
    message: "Production report generating in 15 minutes"
  },
  failureAlerts: {
    enabled: true,
    recipients: ["system_admin", "production_manager"],
    retryAttempts: 3,
    escalateAfter: 30,
    escalateTo: ["cto"]
  },
  quietHours: {
    enabled: true,
    action: "delay"                    // Don't send middle of night
  }
}
```

**Scenario 2: Low-Priority Weekly Summary**
```typescript
{
  postSendConfirmation: {
    enabled: true,
    includeMetrics: true,              // "Report sent with 23 orders, 89% completion"
    notifyOnlyOwner: true
  },
  digest: {
    enabled: true,
    combineMultipleReports: true       // Combine with other weekly reports
  },
  engagementTracking: {
    enabled: true,
    notifyOnLowEngagement: true,
    threshold: 48                      // Alert if nobody opens in 2 days
  }
}
```

### Recipient Notification Preferences

**User-Controlled Notification Settings:**

Each recipient can customize how they receive reports:

```typescript
type RecipientPreferences = {
  userId: string
  
  // Channel preferences
  preferredChannel: "email" | "slack" | "sms" | "in-app"
  fallbackChannel?: "email" | "sms"
  
  // Frequency preferences
  frequencyOverride?: {
    reportId: string
    preferredFrequency: "real-time" | "daily" | "weekly" | "monthly" | "never"
  }[]
  
  // Digest preferences
  enableDigest: boolean
  digestFrequency: "daily" | "weekly"
  digestTime: string
  
  // Quiet hours
  doNotDisturb: {
    enabled: boolean
    startTime: string
    endTime: string
    exceptUrgent: boolean              // Allow urgent reports through
  }
  
  // Report filtering
  onlyIfRelevant: boolean              // Only send if user's data included
  minimumThreshold?: number            // Only send if > N items
  
  // Format preferences
  preferredFormat: "pdf" | "html" | "excel"
  embedInEmail: boolean                // Inline vs attachment
  
  // Unsubscribe
  unsubscribed: string[]               // Report IDs user unsubscribed from
}
```

**User Interface for Preferences:**

```
┌─────────────────────────────────────────┐
│ Report Notification Preferences         │
├─────────────────────────────────────────┤
│ Weekly Production Summary                │
│                                          │
│ Delivery Method:                         │
│ ● Email     ○ Slack     ○ SMS           │
│                                          │
│ Frequency:                               │
│ ○ Every time (default)                  │
│ ● Weekly digest                         │
│ ○ Monthly summary only                  │
│ ○ Unsubscribe                           │
│                                          │
│ Format:                                  │
│ ● PDF attachment                        │
│ ○ Excel spreadsheet                     │
│ ○ Inline in email                       │
│                                          │
│ Filters:                                 │
│ ☑ Only send if > 10 orders              │
│ ☑ Only send if my team mentioned        │
│ ☐ Only send if overdue items present    │
│                                          │
│ Quiet Hours:                             │
│ ☑ Don't send between 10pm - 7am         │
│ ☑ Allow urgent alerts                   │
│                                          │
│ [Save Preferences]                       │
└─────────────────────────────────────────┘
```

### Multi-Cadence Support

**Single Report, Multiple Cadences:**

A report can have different schedules for different recipient groups:

```typescript
type MultiCadenceReport = {
  reportId: string
  
  schedules: {
    // Internal team: Daily
    internal: {
      recipients: ["operations_team"],
      schedule: { frequency: "daily", time: "08:00" }
    },
    
    // Management: Weekly
    management: {
      recipients: ["executives"],
      schedule: { frequency: "weekly", daysOfWeek: ["Friday"], time: "16:00" }
    },
    
    // Clients: Bi-weekly
    clients: {
      recipients: ["client_contacts"],
      schedule: { frequency: "custom", interval: 14, unit: "days" }
    },
    
    // Board: Monthly
    board: {
      recipients: ["board_members"],
      schedule: { frequency: "monthly", dayOfMonth: "last", time: "12:00" }
    }
  }
}
```

### Integration with Task/Planner System

**Automatic Reporting Layer:**

The reporting system integrates with the Task Master and Planner to provide automatic report generation based on project/task activity.

**Task Completion Reports:**
- Automatically generate report when task marked complete
- Include: task details, completion time, team members, blockers resolved
- Send to: task assignee, manager, stakeholders

**Project Milestone Reports:**
- Trigger when project reaches milestone
- Include: milestone details, timeline analysis, next steps
- Send to: project team, sponsors, clients

**Capacity Planning Reports:**
- Daily/weekly team capacity reports
- Include: tasks assigned, tasks completed, upcoming workload
- Send to: team leads, resource managers

**Overdue Alerts:**
- Automatic daily report of overdue tasks
- Include: overdue items, responsible parties, escalation recommendations
- Send to: managers, optionally team members

```typescript
type TaskPlannerReportIntegration = {
  // Automatic report triggers
  triggers: {
    taskCompleted: {
      enabled: boolean
      reportTemplate: string           // Which report to generate
      recipients: "assignee" | "manager" | "stakeholders" | "custom"
    },
    
    milestoneReached: {
      enabled: boolean
      reportTemplate: string
      recipients: string[]
    },
    
    deadlineApproaching: {
      enabled: boolean
      daysBeforeDeadline: number
      reportTemplate: string
      escalationThreshold: number      // Escalate if > N items at risk
    },
    
    overdueItems: {
      enabled: boolean
      schedule: ScheduleConfig
      reportTemplate: string
      includeDetails: boolean
    }
  },
  
  // Data flow
  dataMapping: {
    tasksSource: string
    projectsSource: string
    capacitySource: string
  }
}
```

**Example: Task Completion Auto-Report**

When task "Design Spring Collection" completed:

1. System detects completion event
2. Generates report automatically:
   - Task name and details
   - Completion time vs deadline
   - Time spent vs estimated
   - Team members involved
   - Deliverables attached
   - Next dependent tasks
3. Sends to:
   - Task assignee (confirmation)
   - Manager (visibility)
   - Client (if external-facing)
   - Next task assignee (heads up)

---

## Enhanced Contact Management System

### Intelligent Recipient Management

**Beyond Simple Email Lists:** The reporting system includes a sophisticated contact management system that understands organizational structure, relationships, data access permissions, and communication preferences.

### Contact Repository

```typescript
type Contact = {
  id: string
  type: "internal_user" | "external_client" | "team" | "distribution_list"
  
  // Basic info
  name: string
  email: string
  phone?: string
  
  // Organization
  organization?: string
  department?: string
  role?: string
  title?: string
  
  // Relationship mapping
  reportsTo?: string                   // Manager ID
  manages?: string[]                   // Direct reports
  teams?: string[]                     // Team memberships
  
  // Data access
  accessLevel: "full" | "limited" | "custom"
  dataFilters?: FilterConfig[]         // What data can they see?
  
  // Communication preferences (defined above)
  preferences: RecipientPreferences
  
  // Report subscriptions
  subscribedReports: string[]          // Reports they're on
  ownedReports: string[]               // Reports they created
  
  // Engagement metrics
  engagementStats: {
    averageOpenRate: number
    averageResponseTime: number        // Minutes to open report
    lastOpenedReport: string           // Timestamp
    preferredFormat: "pdf" | "html" | "excel"
    mostEngagedReportType: string
  }
  
  // Relationship to data
  dataOwnership: {
    ownsOrders?: string[]              // Order IDs they own
    ownsClients?: string[]             // Client IDs they manage
    ownsTeams?: string[]               // Teams they lead
  }
  
  // Contact status
  status: "active" | "inactive" | "out_of_office"
  outOfOffice?: {
    startDate: string
    endDate: string
    delegate?: string                  // Who receives reports while away
  }
  
  // Metadata
  createdAt: string
  lastContacted: string
}
```

### Smart Contact Selection

**When Adding Recipients to Report:**

System provides intelligent suggestions and filtering:

```
┌─────────────────────────────────────────────────────────────┐
│ Add Recipients to Report                                     │
├─────────────────────────────────────────────────────────────┤
│ Search: [____________________________] 🔍                    │
│                                                              │
│ 🤖 Suggested Recipients:                                     │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ ✓ Sarah Johnson - Operations Manager                    ││
│ │   💼 Manages production data                             ││
│ │   📊 Receives 8 similar reports                          ││
│ │   ⭐ 95% open rate                                       ││
│ │   [Add]                                                  ││
│ └──────────────────────────────────────────────────────────┘│
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ ✓ Mike Chen - Team Lead (Sewing Line A)                 ││
│ │   👥 Leads team with data in this report                 ││
│ │   📊 Receives 3 similar reports                          ││
│ │   ⭐ 87% open rate                                       ││
│ │   [Add]                                                  ││
│ └──────────────────────────────────────────────────────────┘│
│                                                              │
│ Filter By:                                                   │
│ ☑ Internal Users    ☐ External Clients    ☐ Teams          │
│ ☑ Has data access   ☐ Currently subscribed                 │
│                                                              │
│ Browse By:                                                   │
│ • By Department: [Operations ▼]                             │
│ • By Role: [Manager ▼]                                      │
│ • By Team: [Sewing Line A ▼]                                │
│ • By Client: [Horizon Apparel ▼]                            │
│                                                              │
│ Selected Recipients (12):                                    │
│ • Sarah Johnson (Operations Manager) - Email, Weekly        │
│ • Mike Chen (Team Lead) - Slack, Daily                      │
│ • Production Team (8 members) - Email, Weekly Digest        │
│ • client@horizonapparel.com - Email, Bi-weekly, Filtered    │
│                                                              │
│ [Add All Suggested] [Clear] [Save]                           │
└─────────────────────────────────────────────────────────────┘
```

### Distribution Lists

**Pre-Defined Recipient Groups:**

```typescript
type DistributionList = {
  id: string
  name: string
  description: string
  
  // Members
  members: string[]                    // Contact IDs
  
  // Dynamic membership
  dynamicRules?: {
    includeRoles?: string[]            // All "Manager" roles
    includeDepartments?: string[]      // All "Operations" department
    includeTeams?: string[]            // All "Sewing Line A" team
    excludeUsers?: string[]            // Except these specific users
  }
  
  // List settings
  allowSelfSubscribe: boolean          // Users can join themselves
  allowSelfUnsubscribe: boolean        // Users can leave themselves
  requireApproval: boolean             // Owner must approve additions
  owner: string                        // List administrator
  
  // List-level preferences (overridable per member)
  defaultPreferences: RecipientPreferences
  
  createdAt: string
  updatedAt: string
}
```

**Pre-Built Lists:**
- "All Managers"
- "Operations Team"
- "Executive Leadership"
- "Client Contacts"
- "Quality Assurance Team"
- "Production Floor" (all production workers)

**Dynamic List Example:**
```typescript
{
  name: "Production Leadership",
  dynamicRules: {
    includeRoles: ["Operations Manager", "Production Supervisor", "Team Lead"],
    includeDepartments: ["Production", "Operations"],
    excludeUsers: ["user_123"]  // On leave
  }
}
// Auto-updates as org changes
```

### Personalized Data Filtering

**Each Recipient Sees Only Relevant Data:**

```typescript
type PersonalizedReportView = {
  recipientId: string
  baseReportId: string
  
  // Applied filters
  filters: {
    // Show only orders they own
    ownershipFilter?: {
      field: "owner" | "client" | "team"
      value: string                    // Their user ID, client ID, or team ID
    },
    
    // Show only their department's data
    departmentFilter?: {
      department: string
    },
    
    // Custom filters per recipient
    customFilters?: FilterConfig[]
  },
  
  // Redactions (hide sensitive data)
  redactions?: {
    hideFinancialData?: boolean
    hidePersonalInfo?: boolean
    hideConfidentialClients?: string[]
  },
  
  // Custom branding (for external recipients)
  branding?: {
    logo: string
    colors: ColorPalette
    companyName: string
  }
}
```

**Example: Client Receives Filtered Report**

Base Report: "All Production Orders"
- Contains: 50 orders from 10 clients

Client "Horizon Apparel" receives:
- Filtered view: Only their 5 orders
- Redacted: No other clients visible, no cost data
- Branded: Horizon Apparel logo in header
- Format: PDF, bi-weekly, Friday afternoon

### Contact Relationship Intelligence

**System Understands Org Structure:**

```typescript
type ContactRelationships = {
  contactId: string
  
  // Hierarchical relationships
  manager?: string                     // Direct manager
  managerChain?: string[]              // Up to CEO
  directReports?: string[]
  allReports?: string[]                // Including indirect
  
  // Peer relationships
  peers?: string[]                     // Same level, same department
  crossFunctionalPeers?: string[]      // Same level, different department
  
  // Team relationships
  primaryTeam?: string
  additionalTeams?: string[]
  teamRole?: "lead" | "member" | "support"
  
  // Client relationships
  managedClients?: string[]            // External clients they manage
  clientContacts?: string[]            // External contacts they work with
  
  // Project relationships
  activeProjects?: string[]
  projectRole?: Record<string, "owner" | "contributor" | "stakeholder">
}
```

**Use Cases:**

**Escalation Chains:**
If report shows critical issue, auto-escalate up management chain:
1. Send to team member (informational)
2. If not acknowledged in 30 min, send to manager
3. If still not acknowledged, send to director
4. Emergency: send to executive

**Team Roll-Ups:**
Team Lead receives detailed report, their manager receives summary:
- Team Lead: All individual task details
- Manager: High-level metrics + exceptions only
- Executive: Just the KPIs

**Client Account Structure:**
Account Manager receives full report, client receives filtered version:
- Account Manager: All order data, costs, internal notes
- Client Contact: Only their orders, no costs, no internal notes
- Client Executive: High-level summary only

### Out-of-Office Delegation

**Automatic Report Forwarding:**

When recipient sets out-of-office:

```typescript
{
  contact: "sarah_johnson",
  status: "out_of_office",
  outOfOffice: {
    startDate: "2025-10-15",
    endDate: "2025-10-22",
    delegate: "mike_chen",              // Reports go to Mike while Sarah away
    notification: true,                 // Mike notified he's covering
    copyToDelegate: true,               // Mike added to recipient list
    pauseForRecipient: false            // Sarah still gets reports (will see when back)
  }
}
```

When report scheduled during this period:
- Sarah's preferences: Deliver to delegate (Mike)
- Mike receives: "Report: Weekly Production (covering for Sarah Johnson)"
- Sarah receives: Paused, will receive digest when returns

### Contact Engagement Analytics

**Track and Optimize Recipient List:**

```typescript
type ContactEngagementReport = {
  reportId: string
  period: string
  
  recipients: {
    contactId: string
    name: string
    
    // Engagement metrics
    reportsSent: number
    reportsOpened: number
    openRate: number                   // Percentage
    averageOpenDelay: number           // Minutes until open
    clickThroughRate: number           // Clicked links in report
    
    // Actions
    downloaded: number
    shared: number
    providedFeedback: number
    
    // Alerts
    lowEngagement: boolean             // Open rate < 20%
    neverOpened: boolean               // Zero opens
    bounced: boolean                   // Email bounced
    unsubscribed: boolean
    
    // Recommendations
    suggestedAction: "keep" | "reduce_frequency" | "change_format" | "remove"
  }[]
  
  // Report-level insights
  insights: {
    averageOpenRate: number
    bestSendTime: string               // When most recipients open
    mostEngagedRecipients: string[]    // Top 5
    leastEngagedRecipients: string[]   // Bottom 5
    suggestedOptimizations: string[]   // AI suggestions
  }
}
```

**UI for Engagement Review:**

```
┌─────────────────────────────────────────────────────────────┐
│ Report Engagement: Weekly Production Summary                 │
│ Last 30 Days                                                 │
├─────────────────────────────────────────────────────────────┤
│ Overall Metrics:                                             │
│ • 12 recipients                                              │
│ • 72% average open rate                                      │
│ • Best send time: Friday 4pm                                 │
│                                                              │
│ Recipient Performance:                                       │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ ✅ Sarah Johnson - 95% open rate (opens within 10 min)  ││
│ │ ✅ Mike Chen - 87% open rate                             ││
│ │ ⚠️  Jane Doe - 45% open rate (suggest weekly → monthly) ││
│ │ ❌ John Smith - 0% opens (remove from list?)            ││
│ │ 📧 client@example.com - Email bounced (update contact)  ││
│ └──────────────────────────────────────────────────────────┘│
│                                                              │
│ 🤖 AI Recommendations:                                       │
│ • Remove 2 recipients with zero engagement                   │
│ • Move 3 recipients to monthly digest                        │
│ • Best send time: Friday 4pm (vs current 5pm)                │
│ • Add "Production Team" distribution list                    │
│                                                              │
│ [Apply Recommendations] [View Details] [Export]              │
└─────────────────────────────────────────────────────────────┘
```

### Contact Data Enrichment

**System Continuously Enriches Contact Data:**

1. **Engagement Patterns:** Learn when each contact engages
2. **Preferred Formats:** Track which formats they use (PDF vs Excel)
3. **Interest Areas:** Identify which sections they view most
4. **Response Times:** How quickly they act on report data
5. **Collaboration Patterns:** Who they share reports with
6. **Device Preferences:** Mobile vs desktop viewing

This data feeds back into:
- Optimal send time recommendations
- Format suggestions
- Content personalization
- Recipient list optimization

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
