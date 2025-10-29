# AI Playground - Component Request Guide

**What can you build?** Everything! Just describe it naturally.

The AI Playground uses Llama-3.2-3B to understand your intent and select the perfect visualization. Here's what's available and how to ask for it.

---

## 📊 Charts (7 types)

### Area Chart - `v3.chart.area`
**Best for:** Trends over time, historical data, growth patterns

**How to ask:**
- "Show me sales trends over time"
- "Revenue growth for the last 6 months"
- "How have signups been trending?"
- "Display website traffic history"

**What the AI looks for:**
- Keywords: `trend`, `over time`, `growth`, `timeline`, `historical`, `since`, `past`
- Time-based requests

**Smart config:**
- Sets `timeFilter` (day/week/month/quarter/year)
- Configures `dataSource` from your description
- Adds appropriate `aggregation` (sum, avg, count)

---

### Bar Chart - `v3.chart.bar`
**Best for:** Comparisons, rankings, top/bottom lists

**How to ask:**
- "Compare top 5 products by revenue"
- "Show me best performing regions"
- "Which items sell the most?"
- "Rank teams by output"

**What the AI looks for:**
- Keywords: `compare`, `top`, `bottom`, `ranking`, `versus`, `vs`, `best`, `worst`
- Comparative language

**Smart config:**
- Sets `limit` (defaults to 5 for "top X")
- Configures `sortBy` and `sortOrder` automatically
- Extracts the comparison metric

---

### Donut Chart - `v3.chart.donut`
**Best for:** Distributions, percentages, parts of a whole

**How to ask:**
- "Order status breakdown"
- "Show percentage of users by region"
- "Category distribution"
- "Split revenue by product line"

**What the AI looks for:**
- Keywords: `breakdown`, `percentage`, `distribution`, `share`, `split`, `proportion`
- Categorical grouping

**Smart config:**
- Sets `groupBy` field
- Configures aggregation for counts or sums

---

### Sankey Diagram - `v3.chart.sankey`
**Best for:** Flows, funnels, journey mapping, conversions

**How to ask:**
- "Show conversion funnel"
- "Customer journey from visit to purchase"
- "Material flow through production"
- "Lead to customer conversion"

**What the AI looks for:**
- Keywords: `flow`, `funnel`, `journey`, `conversion`, `path`, `from...to`
- Process-oriented language

---

### Radar Chart - `v3.chart.radar`
**Best for:** Multi-dimensional comparisons, performance across metrics

**How to ask:**
- "Compare team performance across metrics"
- "Product ratings spider chart"
- "Multi-dimensional analysis"
- "Performance across categories"

**What the AI looks for:**
- Keywords: `performance across`, `multiple metrics`, `compare dimensions`, `radar`, `spider`
- Multiple attribute comparisons

---

### Sparkline - `v3.chart.sparkline`
**Best for:** Mini inline trends, compact metrics

**How to ask:**
- "Small trend indicator"
- "Compact sales sparkline"
- "Mini chart for dashboard"

**What the AI looks for:**
- Keywords: `sparkline`, `mini chart`, `trend line`, `micro chart`, `inline`
- Requests for compact visualizations

---

### Wave Chart - `v3.chart.wave`
**Best for:** Real-time streaming data, live monitoring

**How to ask:**
- "Real-time production monitoring"
- "Live streaming data"
- "Continuous update chart"
- "Oscilloscope-style view"

**What the AI looks for:**
- Keywords: `wave`, `real-time`, `live chart`, `streaming`, `oscilloscope`
- Real-time data needs

---

## 📋 Tables & Lists (2 types)

### Data Table - `v3.table`
**Best for:** Detailed records, comprehensive lists, sortable data

**How to ask:**
- "Show me all orders"
- "List of customers with details"
- "Table of inventory items"
- "Detailed product records"

**What the AI looks for:**
- Keywords: `table`, `list`, `data`, `rows`, `records`, `entries`, `spreadsheet`
- Requests for detailed information

**Smart config:**
- Configures sortable columns
- Sets appropriate data source

---

### Activity Timeline - `v3.activity.timeline`
**Best for:** Recent events, activity feeds, chronological updates

**How to ask:**
- "Recent activity"
- "What's happening?"
- "Show me latest updates"
- "Event log"
- "Timeline of changes"

**What the AI looks for:**
- Keywords: `activity`, `feed`, `timeline`, `recent`, `updates`, `events`, `log`, `history`
- Chronological information requests

**Smart config:**
- Sets `limit` (default 10 recent items)
- Configures `sortOrder: desc` for newest first

---

## 📈 Metrics & KPIs (3 types)

### KPI Card - `v3.kpi`
**Best for:** Single important numbers, key metrics

**How to ask:**
- "KPI card for revenue"
- "Show total orders"
- "Single metric for conversion rate"
- "Quick stat for active users"

**What the AI looks for:**
- Keywords: `kpi`, `metric`, `total`, `count`, `single number`, `stat`
- Focus on one value

**Smart config:**
- Extracts metric name
- Configures trend indicators

---

### Animated Counter - `v3.counter.animated`
**Best for:** Live counting metrics, tickers, animated numbers

**How to ask:**
- "Animated counter for sales"
- "Live ticker of signups"
- "Counting metric with animation"
- "Dynamic number display"

**What the AI looks for:**
- Keywords: `counter`, `animated`, `ticker`, `live count`, `counting metric`
- Emphasis on animation or live updates

---

### Large Metric Card - `construction.metric.large`
**Best for:** Prominent single metrics, dashboard highlights

**How to ask:**
- "Large metric card"
- "Prominent display of revenue"
- "Big number for conversions"

**What the AI looks for:**
- Requests for prominent or large displays
- Single-value focus

---

## 🗺️ Specialized Components (11 types)

### Site Map - `v3.map.site`
**Best for:** Floor plans, facility maps, zone visualization

**How to ask:**
- "Site map of facility"
- "Floor plan with zones"
- "Location map of areas"
- "Facility layout visualization"

**What the AI looks for:**
- Keywords: `site map`, `location map`, `zone map`, `floor plan`, `facility map`
- Spatial layout requests

---

### Heatmap - `v3.heatmap`
**Best for:** Capacity monitoring, utilization, intensity visualization

**How to ask:**
- "Production stage capacity heatmap"
- "Utilization across zones"
- "Manufacturing stage performance"
- "Bottleneck visualization"

**What the AI looks for:**
- Keywords: `heatmap`, `capacity`, `utilization`, `production stages`, `bottleneck`
- Intensity or capacity focus

---

### Calendar Heatmap - `v3.calendar.heatmap`
**Best for:** Activity over time, contribution calendars, daily patterns

**How to ask:**
- "Activity calendar"
- "Contribution calendar like GitHub"
- "Daily activity heatmap"
- "Year-long pattern view"

**What the AI looks for:**
- Keywords: `calendar heatmap`, `activity calendar`, `contribution calendar`, `daily activity`
- Day-by-day patterns

---

### Kanban Board - `v3.kanban`
**Best for:** Task boards, workflow stages, project management

**How to ask:**
- "Kanban board for tasks"
- "Project workflow board"
- "Task pipeline"
- "Stage-based task view"

**What the AI looks for:**
- Keywords: `kanban`, `board`, `workflow`, `pipeline`, `stages`, `task board`
- Stage-based organization

---

### Status Grid - `v3.status.grid`
**Best for:** System health, service status, uptime monitoring

**How to ask:**
- "System health dashboard"
- "Service status grid"
- "Uptime monitoring"
- "Online/offline status"

**What the AI looks for:**
- Keywords: `status`, `health`, `monitoring`, `system`, `uptime`, `online`, `offline`
- Health/availability focus

---

### Progress Tracker - `v3.progress.tracker`
**Best for:** Task progress, milestones, completion tracking

**How to ask:**
- "Track project completion"
- "Milestone progress"
- "Task completion status"
- "Project phase tracker"

**What the AI looks for:**
- Keywords: `progress`, `tasks`, `completion`, `checklist`, `todo`, `tracking`, `milestones`
- Progress/completion focus

---

### Pulse Grid - `v3.grid.pulse`
**Best for:** Live activity monitoring, real-time grid updates

**How to ask:**
- "Pulse grid for activity"
- "Live monitoring grid"
- "Real-time activity matrix"

**What the AI looks for:**
- Keywords: `pulse grid`, `activity grid`, `live grid`, `monitoring grid`
- Real-time visual emphasis

---

### Network Graph - `v3.graph.network`
**Best for:** Relationships, connections, organizational charts

**How to ask:**
- "Network of relationships"
- "Connection map"
- "Organization chart"
- "Collaboration network"

**What the AI looks for:**
- Keywords: `network`, `relationship`, `connection map`, `org chart`, `collaboration`
- Relationship/connection focus

---

### 3D Card Stack - `v3.cards.3d`
**Best for:** Metric cards with depth, layered visualizations

**How to ask:**
- "3D card stack"
- "Layered metric cards"
- "Stacked visualization"

**What the AI looks for:**
- Keywords: `3d cards`, `card stack`, `stacked cards`, `card carousel`
- 3D/layered emphasis

---

## 🎯 How the AI Understands Your Request

### 1. Intent Analysis
The AI analyzes your request to understand:
- **What you want to see** (data type)
- **How you want to see it** (visualization type)
- **What timeframe** (if applicable)
- **What comparisons** (if any)

### 2. Data Source Detection
The AI extracts data entities from your description:

| You say | AI extracts |
|---------|-------------|
| "sales trends" | dataSource: "sales", metric: "revenue" |
| "product performance" | dataSource: "products", metric: varies |
| "customer signups" | dataSource: "customers", metric: "count" |
| "order status" | dataSource: "orders", groupBy: "status" |

### 3. Smart Configuration
Based on your request, the AI automatically configures:

**Time filters:**
- "last 6 months" → `timeFilter: "month"`
- "this quarter" → `timeFilter: "quarter"`
- "daily for a week" → `timeFilter: "day"`

**Sorting & Limits:**
- "top 5" → `limit: 5, sortOrder: "desc"`
- "worst performing" → `sortOrder: "asc"`
- "ranked by" → `sortBy: [metric], sortOrder: "desc"`

**Aggregations:**
- "total revenue" → `aggregation: "sum"`
- "average rating" → `aggregation: "avg"`
- "number of orders" → `aggregation: "count"`

### 4. Title Generation
The AI creates contextual titles:

| Your prompt | Generated title |
|-------------|----------------|
| "Show me sales trends for the last 6 months" | "Sales Trends (Last 6 Months)" |
| "Compare top 5 products by revenue" | "Top 5 Products by Revenue" |
| "Order status breakdown" | "Orders by Status" |
| "What's happening?" | "Recent Activity Timeline" |

---

## 💡 Pro Tips

### Natural Language Works Best
✅ **Good:** "I want to see how our revenue has been changing month over month"  
❌ **Less good:** "revenue chart"

The AI understands context, so be descriptive!

### Be Specific About Time
✅ **Good:** "Sales trends for the last 6 months"  
⚠️ **Okay:** "Sales trends" (AI will guess timeframe)

### Comparisons Are Easy
✅ **Good:** "Compare top 10 products by sales volume"  
✅ **Good:** "Which regions perform best?"  
✅ **Good:** "Show me product A versus product B"

### Vague Requests Work Too
✅ "What's happening?" → Activity Timeline  
✅ "How are we doing?" → KPI or Trend Chart  
✅ "Show me everything" → Data Table

The AI is smart enough to infer reasonable defaults!

---

## 🔍 Examples by Use Case

### Sales Dashboard
- "Monthly sales trends" → Area Chart
- "Top 10 products by revenue" → Bar Chart
- "Revenue by region breakdown" → Donut Chart
- "Total sales this month" → KPI Card

### Operations Monitoring
- "Production stage capacity" → Heatmap
- "System health status" → Status Grid
- "Facility zone map" → Site Map
- "Recent activity log" → Activity Timeline

### Project Management
- "Task completion progress" → Progress Tracker
- "Project workflow board" → Kanban
- "Team performance across metrics" → Radar Chart
- "Milestone timeline" → Timeline

### Analytics
- "User conversion funnel" → Sankey Diagram
- "Daily activity patterns" → Calendar Heatmap
- "Team collaboration network" → Network Graph
- "Real-time metrics" → Animated Counter

---

## 🤖 Under the Hood

**Model:** Llama-3.2-3B-Instruct-Turbo  
**Confidence threshold:** 0.7  
**Fallback:** Keyword matching (if LLM fails)  
**Avg response time:** 3-5 seconds  
**Token usage:** ~2200 tokens per request  
**Cost:** ~$0.0001 per component

The AI provides:
- ✅ Component selection reasoning
- ✅ Confidence score (0-1)
- ✅ Provenance tracking (LLM vs keyword)
- ✅ Automatic configuration
- ✅ Contextual titles

---

## 📚 Component Categories Quick Reference

```
📊 CHARTS (7)
├── Area ────────── Trends over time
├── Bar ─────────── Comparisons & rankings
├── Donut ───────── Distributions & percentages
├── Sankey ──────── Flows & funnels
├── Radar ───────── Multi-dimensional comparison
├── Sparkline ───── Mini inline trends
└── Wave ────────── Real-time streaming

📋 TABLES (2)
├── Data Table ──── Detailed records
└── Activity ────── Recent events

📈 METRICS (3)
├── KPI Card ────── Single important number
├── Counter ─────── Animated live metric
└── Large Metric ── Prominent display

🗺️ SPECIALIZED (11)
├── Site Map ────── Floor plans & zones
├── Heatmap ─────── Capacity & utilization
├── Calendar ────── Daily activity patterns
├── Kanban ──────── Task workflow
├── Status Grid ─── System health
├── Progress ────── Completion tracking
├── Pulse Grid ──── Live activity matrix
├── Network ─────── Relationships & connections
└── 3D Cards ────── Layered metrics
```

---

**Total components available: 22+**

**Just describe what you want to see, and the AI figures out the rest!** 🎨✨

