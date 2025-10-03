"use client"

import PageTemplate from "@/components/PageTemplate"
import type { DashboardState } from "@/lib/useGridSystem"

const METRIC_TREND_WIP = [64, 72, 80, 76, 88, 92]
const METRIC_TREND_READY = [18, 22, 20, 26, 30, 34]
const METRIC_TREND_ON_TIME = [88, 90, 92, 93, 95, 96]
const METRIC_TREND_UTIL = [84, 83, 85, 86, 83, 82]

const THROUGHPUT_SERIES = [
  {
    name: "Jackets",
    points: [
      { x: "2025-08-26", y: 420 },
      { x: "2025-09-02", y: 480 },
      { x: "2025-09-09", y: 440 },
      { x: "2025-09-16", y: 510 },
      { x: "2025-09-23", y: 560 },
      { x: "2025-09-30", y: 590 },
    ],
  },
  {
    name: "Pants",
    points: [
      { x: "2025-08-26", y: 360 },
      { x: "2025-09-02", y: 390 },
      { x: "2025-09-09", y: 410 },
      { x: "2025-09-16", y: 430 },
      { x: "2025-09-23", y: 460 },
      { x: "2025-09-30", y: 480 },
    ],
  },
  {
    name: "Accessories",
    points: [
      { x: "2025-08-26", y: 180 },
      { x: "2025-09-02", y: 210 },
      { x: "2025-09-09", y: 190 },
      { x: "2025-09-16", y: 220 },
      { x: "2025-09-23", y: 250 },
      { x: "2025-09-30", y: 270 },
    ],
  },
]

const QUALITY_SERIES = [
  {
    name: "Yield",
    points: [
      { x: "Cutting", y: 98 },
      { x: "Assembly", y: 94 },
      { x: "Finishing", y: 92 },
      { x: "QA", y: 96 },
      { x: "Packing", y: 97 },
    ],
  },
]

const RECENT_ITEMS_COLUMNS = [
  { id: "product", name: "Product", type: "text", width: 200 },
  { id: "stage", name: "Stage", type: "text", width: 120 },
  { id: "dueDate", name: "Due", type: "date", width: 110 },
  { id: "owner", name: "Owner", type: "text", width: 140 },
  { id: "status", name: "Status", type: "status", width: 120, options: ["on-track", "watch", "starting", "priority"] },
]

const RECENT_ITEMS_DATA = [
  {
    id: "aur-1092",
    product: "Aurora Flight Jacket",
    stage: "QA",
    dueDate: "2025-10-14",
    owner: "Line A",
    status: "on-track",
  },
  {
    id: "atx-7845",
    product: "Atlas Cargo Pant",
    stage: "Assembly",
    dueDate: "2025-10-18",
    owner: "Line B",
    status: "watch",
  },
  {
    id: "hal-6721",
    product: "Halo Rain Shell",
    stage: "Cutting",
    dueDate: "2025-10-20",
    owner: "Line C",
    status: "starting",
  },
  {
    id: "vlt-3419",
    product: "Volt Thermal Vest",
    stage: "Finishing",
    dueDate: "2025-10-12",
    owner: "Line D",
    status: "priority",
  },
]

const MESSAGES_DATA = {
  conversations: [
    {
      id: "1",
      title: "Quality Ops",
      participants: ["Jordan", "Alicia", "QA night shift"],
      lastMessage: {
        id: "msg-1",
        sender: "Jordan (QA Supervisor)",
        content: "Need extra coverage on seam variance for jackets batch.",
        timestamp: "5 min ago",
        status: "sent" as const,
        type: "text" as const,
      },
      unreadCount: 2,
      isActive: true,
    },
    {
      id: "2",
      title: "Supplier Portal",
      participants: ["Logistics", "Procurement"],
      lastMessage: {
        id: "msg-2",
        sender: "YKK Staging",
        content: "Hardware kit pallet #98 scanned for delivery 10/08.",
        timestamp: "32 min ago",
        status: "delivered" as const,
        type: "file" as const,
      },
      unreadCount: 0,
      isActive: false,
    },
    {
      id: "3",
      title: "Mission Control",
      participants: ["Ops", "QA", "Client"],
      lastMessage: {
        id: "msg-3",
        sender: "Automated Alert",
        content: "Batch AUR-1089 cleared QA and moved to packing.",
        timestamp: "1 hour ago",
        status: "read" as const,
        type: "text" as const,
      },
      unreadCount: 0,
      isActive: false,
    },
  ],
}

const ANALYTICS_METRICS = [
  { label: "Cut & Sew throughput", value: 1860, change: 4.2, changeType: "increase" as const, format: "number" as const, icon: "🧵" },
  { label: "Defect rate", value: 2.4, change: -0.8, changeType: "decrease" as const, format: "percentage" as const, icon: "✅" },
  { label: "Average cycle time", value: 3.8, change: -0.3, changeType: "decrease" as const, format: "text" as const, icon: "⏱" },
  { label: "Supplier OTIF", value: 93, change: 2.1, changeType: "increase" as const, format: "percentage" as const, icon: "🚚" },
]

const manufacturingInitialState: DashboardState = {
  mode: "save",
  layout: [
    { i: "metric-wip", x: 0, y: 0, w: 3, h: 4 },
    { i: "metric-ready", x: 3, y: 0, w: 3, h: 4 },
    { i: "metric-ontime", x: 6, y: 0, w: 3, h: 4 },
    { i: "metric-utilization", x: 9, y: 0, w: 3, h: 4 },
    { i: "throughput-chart", x: 0, y: 4, w: 8, h: 8 },
    { i: "quality-chart", x: 8, y: 4, w: 4, h: 8 },
    { i: "recent-items", x: 0, y: 12, w: 8, h: 8 },
    { i: "messages-alerts", x: 8, y: 12, w: 4, h: 8 },
    { i: "analytics-summary", x: 0, y: 20, w: 12, h: 6 },
  ],
  blocks: {
    "metric-wip": {
      id: "metric-wip",
      type: "metric.items",
      title: "WIP units",
      props: { value: "1,280", delta: "+6.8%", trend: METRIC_TREND_WIP, timeRange: "Last 6 days" },
    },
    "metric-ready": {
      id: "metric-ready",
      type: "metric.chart",
      title: "Orders ready",
      props: { value: "34", delta: "+4.0%", trend: METRIC_TREND_READY, timeRange: "Ready for shipment" },
    },
    "metric-ontime": {
      id: "metric-ontime",
      type: "metric.kpi",
      title: "On-time shipments",
      props: { value: "96%", delta: "+2.3%", trend: METRIC_TREND_ON_TIME, timeRange: "Rolling 7 day" },
    },
    "metric-utilization": {
      id: "metric-utilization",
      type: "metric.kpi",
      title: "Line utilization",
      props: { value: "82%", delta: "-1.4%", trend: METRIC_TREND_UTIL, timeRange: "Lines A-D" },
    },
    "throughput-chart": {
      id: "throughput-chart",
      type: "chart.area",
      title: "Throughput velocity",
      props: { series: THROUGHPUT_SERIES },
    },
    "quality-chart": {
      id: "quality-chart",
      type: "chart.bar",
      title: "Yield by stage",
      props: { series: QUALITY_SERIES },
    },
    "recent-items": {
      id: "recent-items",
      type: "table.malleable",
      title: "Recent builds",
      props: {
        columns: RECENT_ITEMS_COLUMNS,
        data: RECENT_ITEMS_DATA,
        density: "comfortable",
      },
    },
    "messages-alerts": {
      id: "messages-alerts",
      type: "messages.panel",
      title: "Messages & alerts",
      props: MESSAGES_DATA,
    },
    "analytics-summary": {
      id: "analytics-summary",
      type: "analytics.summary",
      title: "Production stats",
      props: {
        metrics: ANALYTICS_METRICS,
        period: "Last 7 days",
        lastUpdated: "Updated 5 minutes ago",
      },
    },
  },
}

export default function ManufacturingDashboardPage() {
  return (
    <PageTemplate
      pageTitle="Mission Control"
      pageSubtext="Manufacturing overview · Fashion"
      storageKey="dashboard-v2-manufacturing"
      frozenStorageKey="dashboard-v2-manufacturing-frozen"
      initialState={manufacturingInitialState}
      functionButtons={[
        {
          label: "Export report",
          variant: "outline",
          onClick: () => console.log("export manufacturing dashboard"),
        },
      ]}
    />
  )
}
