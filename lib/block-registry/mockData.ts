import type { BlockType } from "@/lib/grid-v2/types"

type SourceKey = "orders" | "items" | "suppliers" | "production_runs"

type MockDataMap = Partial<Record<SourceKey, Partial<Record<BlockType, Record<string, unknown>>>>> & {
  default?: Partial<Record<BlockType, Record<string, unknown>>>
}

function clone<T>(value: T): T {
  if (typeof structuredClone === "function") {
    return structuredClone(value)
  }
  return JSON.parse(JSON.stringify(value)) as T
}

const baseTrend = [120, 132, 128, 136, 144, 155, 162]

export const mockDataMap: MockDataMap = {
  orders: {
    "metric.kpi": { value: "245", delta: "+6%", trend: baseTrend },
    "metric.chart": { value: "245", delta: "+6%", trend: baseTrend },
    "metric.items": { value: "245", delta: "+6", trend: baseTrend },
    "metric.sparkline": { value: "$245k", trend: "+6.4%", trendDirection: "up" },
    "chart.line": {
      data: [
        { name: "Mon", value: 120 },
        { name: "Tue", value: 132 },
        { name: "Wed", value: 128 },
        { name: "Thu", value: 136 },
        { name: "Fri", value: 144 },
        { name: "Sat", value: 155 },
        { name: "Sun", value: 162 },
      ],
      color: "#2563eb",
    },
    "chart.line.forecast": {
      data: [
        { name: "Week 1", value: 118 },
        { name: "Week 2", value: 126 },
        { name: "Week 3", value: 135 },
        { name: "Week 4", value: 143 },
        { name: "Week 5", value: 151 },
        { name: "Week 6", value: 160 },
      ],
      color: "#8b5cf6",
    },
    "chart.bar": {
      series: [
        {
          name: "Orders",
          points: [
            { x: "2025-01-01", y: 24 },
            { x: "2025-01-02", y: 28 },
            { x: "2025-01-03", y: 32 },
            { x: "2025-01-04", y: 30 },
            { x: "2025-01-05", y: 36 },
          ],
        },
        {
          name: "Capacity",
          points: [
            { x: "2025-01-01", y: 20 },
            { x: "2025-01-02", y: 22 },
            { x: "2025-01-03", y: 27 },
            { x: "2025-01-04", y: 25 },
            { x: "2025-01-05", y: 31 },
          ],
        },
      ],
    },
    "chart.bar.utilization": {
      series: [
        {
          name: "Capacity",
          points: [
            { x: "2025-01-01", y: 40 },
            { x: "2025-01-02", y: 42 },
            { x: "2025-01-03", y: 44 },
            { x: "2025-01-04", y: 45 },
            { x: "2025-01-05", y: 45 },
          ],
        },
        {
          name: "Actual",
          points: [
            { x: "2025-01-01", y: 32 },
            { x: "2025-01-02", y: 38 },
            { x: "2025-01-03", y: 41 },
            { x: "2025-01-04", y: 39 },
            { x: "2025-01-05", y: 43 },
          ],
        },
      ],
    },
    "chart.donut": {
      slices: [
        { label: "Ready", value: 18 },
        { label: "Processing", value: 9 },
        { label: "Delayed", value: 4 },
        { label: "Blocked", value: 2 },
      ],
    },
    "chart.donut.utilization": {
      slices: [
        { label: "Running", value: 48 },
        { label: "Setup", value: 18 },
        { label: "Maintenance", value: 12 },
        { label: "Idle", value: 22 },
      ],
    },
    "table.orders": {
      orders: [
        { id: "#1234", customer: "Acme Denim", amount: "$1,240", status: "Cutting" },
        { id: "#1235", customer: "Northwind", amount: "$980", status: "Finishing" },
        { id: "#1236", customer: "Horizon", amount: "$1,720", status: "QA" },
        { id: "#1237", customer: "Atlas", amount: "$860", status: "Ready" },
      ],
    },
    "table.malleable": {
      columns: ["Order", "Customer", "Status", "Amount"],
      rows: [
        ["#1234", "Acme Denim", "Cutting", "$1,240"],
        ["#1235", "Northwind", "Finishing", "$980"],
        ["#1236", "Horizon", "QA", "$1,720"],
        ["#1237", "Atlas", "Ready", "$860"],
      ],
    },
  },
  items: {
    "metric.kpi": { value: "1,542", delta: "-2%", trend: [1600, 1580, 1550, 1542, 1530, 1525, 1542] },
    "metric.sparkline": { value: "1,542 units", trend: "-2%", trendDirection: "down" },
    "chart.bar": {
      series: [
        {
          name: "In Stock",
          points: [
            { x: "2025-01-01", y: 320 },
            { x: "2025-01-02", y: 310 },
            { x: "2025-01-03", y: 305 },
            { x: "2025-01-04", y: 315 },
            { x: "2025-01-05", y: 318 },
          ],
        },
      ],
    },
    "chart.bar.utilization": {
      series: [
        {
          name: "Capacity",
          points: [
            { x: "2025-01-01", y: 280 },
            { x: "2025-01-02", y: 285 },
            { x: "2025-01-03", y: 288 },
            { x: "2025-01-04", y: 290 },
            { x: "2025-01-05", y: 292 },
          ],
        },
        {
          name: "Actual",
          points: [
            { x: "2025-01-01", y: 240 },
            { x: "2025-01-02", y: 252 },
            { x: "2025-01-03", y: 248 },
            { x: "2025-01-04", y: 260 },
            { x: "2025-01-05", y: 266 },
          ],
        },
      ],
    },
    "table.malleable": {
      columns: ["Item", "Category", "Status", "Location"],
      rows: [
        ["Widget A", "Mechanical", "Ready", "Line 3"],
        ["Widget B", "Electrical", "Awaiting QA", "Line 2"],
        ["Widget C", "Mechanical", "Staging", "Dock"],
      ],
    },
    "table.items": {
      items: [
        {
          id: "itm-101",
          name: "Composite Panel",
          description: "Prepped for assembly",
          category: "Sub-assembly",
          stock: 84,
          price: 9.5,
          status: "In Stock",
          lastUpdated: "2025-01-16",
          supplier: "Alpha Composites",
          sku: "CMP-221",
        },
        {
          id: "itm-102",
          name: "Bearing Kit",
          description: "Pack of 25",
          category: "Hardware",
          stock: 18,
          price: 22.75,
          status: "Low Stock",
          lastUpdated: "2025-01-15",
          supplier: "Motion Supply",
          sku: "BRG-025",
        },
      ],
      showColumnCustomization: true,
    },
  },
  suppliers: {
    "chart.line": {
      data: [
        { name: "Week 1", value: 92 },
        { name: "Week 2", value: 95 },
        { name: "Week 3", value: 93 },
        { name: "Week 4", value: 97 },
      ],
      color: "#16a34a",
    },
    "materials.supplier.leadtime": {
      suppliers: [
        { name: "North Mills", avgDays: 7, onTimeRate: 0.92 },
        { name: "Allied", avgDays: 5, onTimeRate: 0.88 },
        { name: "Summit", avgDays: 6, onTimeRate: 0.95 },
      ],
    },
  },
  production_runs: {
    "activity.timeline": {
      activities: [
        { id: "1", action: "Run 482 started", time: "08:15", status: "success", type: "start" },
        { id: "2", action: "QC flagged defect", time: "09:05", status: "warning", type: "qa" },
        { id: "3", action: "Rework completed", time: "09:45", status: "success", type: "rework" },
      ],
    },
    "analytics.summary": {
      cards: [
        { label: "Throughput", value: "2,431", delta: "+4.2%" },
        { label: "Yield", value: "97%", delta: "+1.1%" },
        { label: "Downtime", value: "1.5h", delta: "-0.4h" },
      ],
    },
    "chart.area.cumulative": {
      series: [
        {
          name: "Completed",
          points: [
            { x: "2025-01-01", y: 55 },
            { x: "2025-01-02", y: 88 },
            { x: "2025-01-03", y: 129 },
            { x: "2025-01-04", y: 172 },
            { x: "2025-01-05", y: 218 },
          ],
        },
        {
          name: "Forecast",
          points: [
            { x: "2025-01-01", y: 60 },
            { x: "2025-01-02", y: 96 },
            { x: "2025-01-03", y: 140 },
            { x: "2025-01-04", y: 188 },
            { x: "2025-01-05", y: 240 },
          ],
        },
      ],
    },
    "chart.donut.utilization": {
      slices: [
        { label: "Running", value: 52 },
        { label: "Setup", value: 16 },
        { label: "Maintenance", value: 10 },
        { label: "Idle", value: 22 },
      ],
    },
    "chart.scatter.capacity": {
      points: [
        { x: 68, y: 93, label: "Line A", category: "Assembly", size: 7 },
        { x: 82, y: 90, label: "Line B", category: "Finishing", size: 8 },
        { x: 59, y: 84, label: "Line C", category: "Cut", size: 6 },
        { x: 74, y: 88, label: "Line D", category: "Pack", size: 5 },
      ],
      xAxis: { label: "Utilization %", min: 0, max: 100 },
      yAxis: { label: "Yield %", min: 0, max: 100 },
      categories: ["Assembly", "Finishing", "Cut", "Pack"],
    },
  },
  default: {
    "metric.kpi": { value: "128", delta: "+1%", trend: baseTrend },
    "metric.sparkline": { value: "128", trend: "+1%", trendDirection: "neutral" },
    "chart.line": { data: baseTrend.map((v, idx) => ({ name: `P${idx + 1}`, value: v })), color: "#6366f1" },
    "chart.line.forecast": { data: baseTrend.map((v, idx) => ({ name: `W${idx + 1}`, value: v + 4 })), color: "#8b5cf6" },
    "table.malleable": {
      columns: ["Name", "Status", "Owner"],
      rows: [
        ["Sample", "Active", "Jamie"],
        ["Example", "Draft", "Alex"],
      ],
    },
    "chart.bar.utilization": {
      series: [
        {
          name: "Capacity",
          points: baseTrend.map((v, idx) => ({ x: `2025-01-0${idx + 1}`, y: v / 2 })),
        },
        {
          name: "Actual",
          points: baseTrend.map((v, idx) => ({ x: `2025-01-0${idx + 1}`, y: v / 2 - 6 })),
        },
      ],
    },
    "chart.area.cumulative": {
      series: [
        {
          name: "Completed",
          points: baseTrend.map((v, idx) => ({ x: `2025-01-0${idx + 1}`, y: v * 2 })),
        },
      ],
    },
    "chart.donut.utilization": {
      slices: [
        { label: "Running", value: 40 },
        { label: "Setup", value: 20 },
        { label: "Maintenance", value: 12 },
        { label: "Idle", value: 28 },
      ],
    },
    "chart.scatter.capacity": {
      points: [
        { x: 60, y: 90, label: "Unit A", size: 6 },
        { x: 75, y: 88, label: "Unit B", size: 7 },
        { x: 55, y: 83, label: "Unit C", size: 5 },
      ],
    },
    "table.items": {
      items: [
        {
          id: "itm-001",
          name: "Sample Item",
          description: "Demo inventory row",
          category: "General",
          stock: 42,
          price: 12.5,
          status: "In Stock",
          lastUpdated: "2025-01-10",
          supplier: "Demo Supplier",
          sku: "SMP-001",
        },
      ],
    },
    "layout.container": {
      padding: "md",
      background: "surface",
      border: true,
      description: "Container for detail blocks.",
    },
    "layout.split": {
      direction: "horizontal",
      ratio: 60,
      primaryTitle: "Primary",
      secondaryTitle: "Secondary",
    },
    "layout.stack": {
      direction: "vertical",
      gap: "md",
      sections: [
        { id: "one", title: "Summary", description: "Top-level snapshot" },
        { id: "two", title: "Details", description: "Supporting information" },
      ],
    },
    "layout.grid": {
      columns: 2,
      gap: "md",
      areas: [
        { id: "a", title: "Tile A" },
        { id: "b", title: "Tile B" },
        { id: "c", title: "Tile C" },
        { id: "d", title: "Tile D" },
      ],
    },
    "nav.breadcrumbs": {
      items: [
        { id: "1", label: "Home", href: "/" },
        { id: "2", label: "Products", href: "/products" },
        { id: "3", label: "Category", isActive: true }
      ],
      showHome: true,
      separator: "chevron"
    },
    "nav.quicksearch": {
      placeholder: "Search...",
      recentSearches: ["Recent query", "Another search"],
      showRecent: true
    },
    "filter.panel": {
      groups: [
        {
          id: "status",
          label: "Status",
          type: "multiselect",
          options: [
            { id: "active", label: "Active", count: 8 },
            { id: "pending", label: "Pending", count: 3 }
          ]
        }
      ],
      showClearAll: true
    },
    "toolbar.actions": {
      actions: [
        { id: "1", label: "Create", icon: "plus", variant: "primary", size: "md" },
        { id: "2", label: "Export", icon: "download", variant: "outline", size: "md" }
      ],
      layout: "horizontal",
      showLabels: true
    },
    "status.badges": {
      badges: [
        { id: "1", label: "Active", status: "active", count: 15, trend: "up" },
        { id: "2", label: "Issues", status: "warning", count: 2, trend: "down" }
      ],
      layout: "grid",
      showCounts: true,
      showTrends: true
    },
    "form.builder": {
      description: "Complete this form to get started",
      submitLabel: "Submit Form",
      isMultiStep: false,
      elements: []
    },
    "form.input": {
      label: "Full Name",
      placeholder: "Enter your full name",
      type: "text",
      required: true,
      helpText: "Please provide your legal name"
    },
    "form.select": {
      label: "Department",
      placeholder: "Select your department",
      required: true,
      options: ["Engineering", "Sales", "Marketing", "Support"],
      multiple: false
    },
    "form.textarea": {
      label: "Additional Comments",
      placeholder: "Any additional information...",
      required: false,
      rows: 4,
      helpText: "Optional feedback or comments"
    },
    "form.checkbox": {
      label: "I agree to the terms and conditions",
      required: true,
      checked: false,
      type: "single"
    },
    "form.upload": {
      label: "Upload Resume",
      required: false,
      helpText: "Upload your resume (PDF or DOC)",
      accept: ".pdf,.doc,.docx",
      multiple: false,
      maxSize: 5,
      maxFiles: 1
    },
    "form.section": {
      heading: "Personal Information",
      description: "Please provide your basic information",
      divider: true,
      spacing: "md"
    },
  },
}

export function getMockPropsForSource(type: BlockType, source?: { table: string } | null) {
  if (!source) return undefined
  const table = source.table as SourceKey
  const mockForTable = mockDataMap[table]?.[type]
  if (mockForTable) return clone(mockForTable)
  const fallback = mockDataMap.default?.[type]
  return fallback ? clone(fallback) : undefined
}
