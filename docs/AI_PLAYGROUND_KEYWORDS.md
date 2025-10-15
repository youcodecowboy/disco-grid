# AI Playground Keywords Reference

This document lists all the natural language keywords that the AI Playground recognizes and maps to specific components. Simply type a prompt containing these keywords into the AI Input Block to generate the corresponding component.

---

## 📊 Charts

### Bar Chart (`v3.chart.bar`)
**Default Size:** 6 columns × 8 rows

**Keywords:**
- `bar chart`
- `bar graph`
- `comparison`
- `compare`
- `ranking`
- `versus`
- `vs`
- `top`
- `bottom`

**Example Prompts:**
- "Show me a bar chart comparing products"
- "Display top 5 sales by region"
- "Compare revenue versus expenses"

---

### Donut Chart (`v3.chart.donut`)
**Default Size:** 6 columns × 8 rows

**Keywords:**
- `donut`
- `pie chart`
- `distribution`
- `breakdown`
- `percentage`
- `portion`
- `share`
- `split`

**Example Prompts:**
- "Show distribution of sales by category"
- "Display market share as a pie chart"
- "Break down expenses by percentage"

---

### Area/Line Chart (`v3.chart.area`)
**Default Size:** 8 columns × 8 rows

**Keywords:**
- `line chart`
- `area chart`
- `trend`
- `over time`
- `timeline`
- `growth`
- `time series`
- `sales`
- `revenue`
- `chart` *(generic fallback)*
- `graph` *(generic fallback)*
- `visualization` *(generic fallback)*
- `visual` *(generic fallback)*
- `plot` *(generic fallback)*

**Example Prompts:**
- "Show me sales trend over time"
- "Display revenue growth this year"
- "Create a line chart of monthly orders"

---

## 📋 Data Display

### Data Table (`v3.table`)
**Default Size:** 6 columns × 8 rows

**Keywords:**
- `table`
- `list`
- `data`
- `rows`
- `records`
- `entries`
- `spreadsheet`
- `orders`

**Example Prompts:**
- "Show me a table of recent orders"
- "List all customers with their data"
- "Display records in a spreadsheet"

---

### Activity Timeline (`v3.activity.timeline`)
**Default Size:** 4 columns × 8 rows

**Keywords:**
- `activity`
- `feed`
- `timeline`
- `recent`
- `updates`
- `events`
- `log`
- `history`

**Example Prompts:**
- "Show recent activity feed"
- "Display timeline of updates"
- "Create an event log"

---

## 📈 Metrics & KPIs

### KPI Card V3 (`v3.kpi`)
**Default Size:** 4 columns × 4 rows

**Keywords:**
- `kpi card`
- `simple metric`
- `single value`
- `quick stat`

**Example Prompts:**
- "Add a KPI card for revenue"
- "Show quick stat for total orders"
- "Display single value metric"

---

### Construction Metric Large (`construction.metric.large`)
**Default Size:** 3 columns × 4 rows

**Keywords:**
- `metric`
- `kpi`
- `total`
- `count`
- `number`
- `stat`
- `statistic`

**Example Prompts:**
- "Show total orders metric"
- "Display count of active users"
- "Add a KPI for revenue"

---

## 🔧 Monitoring & Tracking

### Status Grid (`v3.status.grid`)
**Default Size:** 6 columns × 6 rows

**Keywords:**
- `status`
- `health`
- `monitoring`
- `system`
- `uptime`
- `online`
- `offline`
- `availability`

**Example Prompts:**
- "Show system health status"
- "Display server monitoring grid"
- "Track uptime and availability"

---

### Progress Tracker (`v3.progress.tracker`)
**Default Size:** 4 columns × 8 rows

**Keywords:**
- `progress`
- `tasks`
- `completion`
- `checklist`
- `todo`
- `to do`
- `tracking`
- `milestones`

**Example Prompts:**
- "Show project progress tracker"
- "Display task completion checklist"
- "Track milestones and todos"

---

## 🎯 How Keyword Matching Works

### Priority System
Keywords are matched with different priorities:
- **Priority 11** (Highest): Specific component keywords (e.g., "bar chart", "donut", "kpi card")
- **Priority 10** (High): General category keywords (e.g., "table", "status", "progress")
- **Priority 5** (Low): Generic fallback keywords (e.g., "chart", "graph")

### Confidence Scoring
- Each keyword match increases confidence
- More specific keywords = higher initial confidence (0.95)
- Generic keywords = lower confidence (0.7)
- Multiple matching keywords boost confidence by +0.05 per additional match

### Best Match Selection
The system selects the component with:
1. Highest priority match
2. Highest confidence score (if priorities are equal)

---

## 🧠 Smart Data Source Detection

The AI Playground now intelligently detects what type of data you're asking for and generates appropriate mock data and titles!

### Supported Data Sources

**Business Data:**
- **Customers** - Keywords: customer, customers, client, clients, buyer, buyers
- **Orders** - Keywords: order, orders, purchase, purchases, booking, bookings
- **Products** - Keywords: product, products, item, items, inventory, stock
- **Sales** - Keywords: sale, sales, selling
- **Revenue** - Keywords: revenue, income, earnings

**User & Team Data:**
- **Users** - Keywords: user, users, member, members, account, accounts
- **Employees** - Keywords: employee, employees, staff, team member
- **Projects** - Keywords: project, projects, initiative, initiatives
- **Tasks** - Keywords: task, tasks, todo, todos, to-do

**Financial Data:**
- **Transactions** - Keywords: transaction, transactions, payment, payments
- **Invoices** - Keywords: invoice, invoices, bill, bills
- **Leads** - Keywords: lead, leads, prospect, prospects

### Context Detection

The system also detects:

**Time Context:**
- recent, latest, new, this month, this week, today
- all, every, total, complete list
- active, current, ongoing, in progress
- pending, waiting, queue
- completed, finished, done, closed

**Action Type:**
- view, show, display, see
- list, table, all, every
- analyze, analysis, chart, graph, trend
- track, monitor, watch

### Contextual Title Generation

Instead of generic titles, you get smart titles based on your request:

**Examples:**
- "show me active customers" → **"Active Customers"**
- "list all orders" → **"All Orders"**
- "recent user activity" → **"Recent Users Activity"**
- "sales trend over time" → **"Sales Over Time"**
- "top products chart" → **"Top Products"**
- "total revenue metric" → **"Total Revenue"**

### Smart Mock Data

Each data source generates appropriate mock data:

**Customers Table:**
- Name, Email, Company, Status, Lifetime Value
- Realistic customer names and company data

**Orders Table:**
- Order ID, Customer, Amount, Status, Date
- Realistic order amounts and statuses

**Products Table:**
- Product, SKU, Category, Stock, Price
- Various product categories with inventory levels

**And more!** Each of the 12+ data sources has custom-tailored columns and data.

---

## 💡 Tips for Best Results

1. **Be Specific**: Use exact component names when you know what you want
   - ✅ "bar chart" → Bar Chart
   - ❌ "chart" → Area Chart (default)

2. **Use Action Words**: Include what you want to show/display/track
   - ✅ "Show distribution as pie chart"
   - ✅ "Display system health status"

3. **Combine Keywords**: Multiple relevant keywords increase accuracy
   - ✅ "Show progress tracking with tasks and milestones"

4. **Natural Language**: Write as you would speak
   - ✅ "I need a bar chart comparing top products"
   - ✅ "Can you show me system uptime status?"

5. **Mention the Data Source**: Include what type of data you want to see
   - ✅ "table of active customers" → Customers table with appropriate columns
   - ✅ "chart of sales over time" → Sales data with realistic values
   - ✅ "total revenue metric" → Revenue formatted as currency
   - ❌ "table of data" → Generic table with "Item 1", "Item 2"

6. **Add Context**: Time and status keywords help generate better titles
   - ✅ "recent orders" → "Recent Orders"
   - ✅ "all active users" → "All Active Users"
   - ✅ "pending transactions" → "Pending Transactions"

---

## 📦 Component Summary

| Component | Type | Size | Category | Best For |
|-----------|------|------|----------|----------|
| Bar Chart | `v3.chart.bar` | 6×8 | Charts | Comparisons, rankings |
| Donut Chart | `v3.chart.donut` | 6×8 | Charts | Distributions, percentages |
| Area Chart | `v3.chart.area` | 8×8 | Charts | Trends, time series |
| Data Table | `v3.table` | 6×8 | Data | Lists, records |
| Activity Timeline | `v3.activity.timeline` | 4×8 | Data | Feeds, events, logs |
| KPI Card V3 | `v3.kpi` | 4×4 | Metrics | Simple single values |
| Construction Metric | `construction.metric.large` | 3×4 | Metrics | KPIs with sparklines |
| Status Grid | `v3.status.grid` | 6×6 | Monitoring | System health |
| Progress Tracker | `v3.progress.tracker` | 4×8 | Tracking | Tasks, milestones |

---

## 🚀 Coming Soon

### Phase 2: Interactive & Spatial Components

**1. Interactive Site Map (`v3.map.site`)**
- **Visual**: Isometric or blueprint-style map with animated location markers
- **Features**: 
  - Clickable zones with data overlays
  - Heat map visualization for activity/density
  - Animated pathways showing flow
  - Status indicators with pulsing animations
- **Keywords**: "site map", "location map", "zone map", "floor plan", "area map"
- **Use Cases**: Construction sites, warehouse layouts, office floor plans, facility management
- **Demo Impact**: ⭐⭐⭐⭐⭐ - Extremely visual and impressive
- **Implementation**: Static background image + SVG overlay (no API keys needed)

**2. Heatmap Grid (`v3.heatmap`)**
- **Visual**: Color-gradient grid showing intensity/activity levels
- **Features**:
  - Smooth color transitions with Framer Motion
  - Hover tooltips with detailed values
  - Time-lapse animation capability
  - Legend with gradient scale
- **Keywords**: "heatmap", "density map", "activity map", "intensity grid"
- **Use Cases**: Website traffic, warehouse activity, customer behavior, system load
- **Demo Impact**: ⭐⭐⭐⭐⭐ - Very futuristic and data-rich

**3. 3D Card Stack (`v3.cards.3d`)**
- **Visual**: Stacked cards with 3D perspective and parallax effects
- **Features**:
  - Smooth card transitions on hover
  - Expandable cards with detailed views
  - Drag-to-reorder with physics
  - Flip animations for two-sided cards
- **Keywords**: "card stack", "deck", "showcase", "portfolio"
- **Use Cases**: Product showcases, team members, project portfolios
- **Demo Impact**: ⭐⭐⭐⭐⭐ - Very modern and interactive

---

### Phase 3: Time & Scheduling Components

**4. Calendar Heatmap (`v3.calendar.heatmap`)**
- **Visual**: GitHub-style contribution calendar with color intensity
- **Features**:
  - Year/month/week views
  - Hover details with metrics
  - Animated day-by-day fill
  - Color themes for different data types
- **Keywords**: "calendar heatmap", "activity calendar", "contribution calendar", "daily activity"
- **Use Cases**: User activity, sales patterns, shift schedules, habit tracking
- **Demo Impact**: ⭐⭐⭐⭐ - Familiar pattern, easy to understand

**5. Gantt Timeline (`v3.timeline.gantt`)**
- **Visual**: Horizontal bars showing tasks/phases over time
- **Features**:
  - Draggable task bars
  - Dependencies shown with animated connectors
  - Progress indicators within bars
  - Milestone markers
- **Keywords**: "gantt chart", "project timeline", "schedule", "roadmap"
- **Use Cases**: Project management, construction phases, product roadmap
- **Demo Impact**: ⭐⭐⭐⭐ - Professional and widely recognized

**6. Kanban Board (`v3.kanban`)**
- **Visual**: Draggable cards across columns with smooth animations
- **Features**:
  - Drag-and-drop between columns
  - Card count badges
  - Priority indicators
  - Smooth layout transitions
- **Keywords**: "kanban", "board", "workflow", "pipeline", "stages"
- **Use Cases**: Task management, sales pipeline, workflow states
- **Demo Impact**: ⭐⭐⭐⭐ - Popular UI pattern

---

### Phase 4: Real-time & Live Data Components

**7. Live Metrics Stream (`v3.stream.live`)**
- **Visual**: Scrolling list of live updates with fade-in animations
- **Features**:
  - Auto-scrolling feed
  - Color-coded event types
  - Timestamp animations
  - Expandable detail views
- **Keywords**: "live feed", "real-time stream", "live updates", "activity stream"
- **Use Cases**: Transaction monitoring, system logs, user activity
- **Demo Impact**: ⭐⭐⭐⭐⭐ - Creates sense of real-time action

**8. Animated Counter (`v3.counter.animated`)**
- **Visual**: Large number that counts up/down with smooth easing
- **Features**:
  - Number increment animations
  - Sparkline background
  - Glowing effect on changes
  - Comparison to previous period
- **Keywords**: "counter", "ticker", "live count", "animated number"
- **Use Cases**: Sales totals, active users, inventory levels
- **Demo Impact**: ⭐⭐⭐⭐ - Satisfying to watch

**9. Pulse Grid (`v3.grid.pulse`)**
- **Visual**: Grid of cells that pulse/light up based on activity
- **Features**:
  - Wave animations across grid
  - Color intensity based on value
  - Ripple effects on updates
  - Synchronized animations
- **Keywords**: "pulse grid", "activity grid", "live grid", "monitoring grid"
- **Use Cases**: Server monitoring, IoT devices, sensor networks
- **Demo Impact**: ⭐⭐⭐⭐⭐ - Very futuristic and eye-catching

---

### Phase 5: Advanced Visualizations

**10. Sankey Diagram (`v3.flow.sankey`)**
- **Visual**: Flowing ribbons showing data flow between nodes
- **Features**:
  - Animated flow particles
  - Hover to highlight paths
  - Smooth transitions
  - Color-coded flows
- **Keywords**: "flow diagram", "sankey", "flow chart", "data flow"
- **Use Cases**: Budget allocation, traffic sources, supply chain
- **Demo Impact**: ⭐⭐⭐⭐⭐ - Very impressive and sophisticated

**11. Network Graph (`v3.network.graph`)**
- **Visual**: Connected nodes with force-directed layout
- **Features**:
  - Physics-based positioning
  - Interactive node dragging
  - Animated connections
  - Cluster highlighting
- **Keywords**: "network graph", "relationship map", "connection graph", "node graph"
- **Use Cases**: Social networks, dependencies, organizational structure
- **Demo Impact**: ⭐⭐⭐⭐⭐ - Very dynamic and complex-looking

**12. Radar/Spider Chart (`v3.chart.radar`)**
- **Visual**: Multi-axis polygon chart with gradient fills
- **Features**:
  - Animated drawing effect
  - Multiple data series overlay
  - Hover for individual values
  - Smooth shape morphing
- **Keywords**: "radar chart", "spider chart", "star chart", "multi-axis"
- **Use Cases**: Skill assessments, product comparisons, performance metrics
- **Demo Impact**: ⭐⭐⭐⭐ - Unique and professional

---

### Phase 6: Media & Rich Content

**13. Image Gallery Grid (`v3.gallery.masonry`)**
- **Visual**: Pinterest-style masonry layout with lazy loading
- **Features**:
  - Staggered animation on load
  - Lightbox view on click
  - Hover zoom effects
  - Smooth layout transitions
- **Keywords**: "gallery", "image grid", "photo grid", "portfolio"
- **Use Cases**: Product photos, team photos, project images
- **Demo Impact**: ⭐⭐⭐⭐ - Visually rich

**14. Video Player Card (`v3.media.video`)**
- **Visual**: Embedded video with custom controls
- **Features**:
  - Thumbnail with play overlay
  - Progress indicator
  - Duration display
  - Auto-pause on scroll out
- **Keywords**: "video player", "video card", "media player"
- **Use Cases**: Tutorial videos, product demos, announcements
- **Demo Impact**: ⭐⭐⭐ - Familiar but useful

---

### Phase 7: Notifications & Alerts

**15. Notification Center (`v3.notifications.center`)**
- **Visual**: Sliding panel with categorized notifications
- **Features**:
  - Slide-in animations
  - Grouped by type/time
  - Mark as read transitions
  - Badge counters
- **Keywords**: "notifications", "alerts", "inbox", "messages center"
- **Use Cases**: System alerts, user messages, updates
- **Demo Impact**: ⭐⭐⭐⭐ - Interactive and practical

**16. Alert Ticker (`v3.ticker.alert`)**
- **Visual**: Horizontal scrolling text with icons
- **Features**:
  - Smooth continuous scroll
  - Color-coded severity
  - Pausable on hover
  - Click to expand
- **Keywords**: "ticker", "alert banner", "news ticker", "scrolling alerts"
- **Use Cases**: Breaking news, system alerts, announcements
- **Demo Impact**: ⭐⭐⭐ - Creates urgency and movement

---

### 🎯 Priority Recommendations for Next Implementation

**Tier 1 (Highest Impact for Demos):**
1. **Interactive Site Map** - Extremely visual, shows spatial intelligence
2. **Pulse Grid** - Very futuristic, great for live monitoring demos
3. **3D Card Stack** - Modern, interactive, wow factor
4. **Heatmap Grid** - Data-dense, professional looking

**Tier 2 (Strong Professional Appeal):**
5. **Kanban Board** - Widely recognized, highly interactive
6. **Sankey Diagram** - Sophisticated, impressive data flow
7. **Network Graph** - Complex-looking, very dynamic

**Tier 3 (Quick Wins):**
8. **Calendar Heatmap** - Easy to implement, immediately useful
9. **Animated Counter** - Simple but satisfying
10. **Radar Chart** - Unique shape, professional

---

### 💡 Implementation Notes

**For Map Components:**
- Use static PNG/SVG backgrounds (like `/construction-site-map.png`)
- No API keys needed - perfect for demos
- Can use free blueprint images or generate custom SVGs
- Overlay with interactive elements using absolute positioning

**For Animations:**
- Leverage Framer Motion for smooth transitions
- Use CSS transforms for performance
- Implement loading skeletons for perceived speed
- Add micro-interactions for polish

**For Real-time Effects:**
- Use `setInterval` for mock updates in demos
- Implement smooth number transitions with easing
- Add glow/pulse effects with CSS animations
- Use color shifts to indicate changes

---

*Last Updated: October 9, 2025 (Evening - Added Smart Data Source Detection & Expanded Coming Soon Roadmap)*


