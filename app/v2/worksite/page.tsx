"use client"

import PageTemplate from "@/components/PageTemplate"
import type { DashboardState } from "@/lib/useGridSystem"

const worksiteInitialState: DashboardState = {
  mode: "save",
  layout: [
    // Top row - Large metrics (inspired by finance cards)
    { i: "metric-scans", x: 0, y: 0, w: 3, h: 4 },
    { i: "metric-installed", x: 3, y: 0, w: 3, h: 4 },
    { i: "metric-efficiency", x: 6, y: 0, w: 3, h: 4 },
    { i: "metric-safety", x: 9, y: 0, w: 3, h: 4 },
    
    // Second row - Tron-inspired site map and Installation dot matrix
    { i: "site-map", x: 0, y: 4, w: 7, h: 12 },
    { i: "installation-dots", x: 7, y: 4, w: 5, h: 12 },
    
    // Third row - Delivery timeline and Material progress
    { i: "delivery-timeline", x: 0, y: 16, w: 7, h: 10 },
    { i: "material-progress", x: 7, y: 16, w: 5, h: 10 },
    
    // Bottom row - Activity and Analytics
    { i: "scan-timeline", x: 0, y: 26, w: 6, h: 8 },
    { i: "analytics-summary", x: 6, y: 26, w: 6, h: 8 },
  ],
  blocks: {
    "metric-scans": {
      id: "metric-scans",
      type: "construction.metric.large",
      title: "Scans Today",
      props: {
        value: "247",
        delta: "+18",
        subtitle: "Items tracked",
        trend: [180, 195, 210, 225, 235, 247],
        color: "blue"
      },
    },
    "metric-installed": {
      id: "metric-installed",
      type: "construction.metric.large",
      title: "Installed",
      props: {
        value: "189",
        delta: "+12",
        subtitle: "This shift",
        trend: [145, 158, 165, 172, 181, 189],
        color: "green"
      },
    },
    "metric-efficiency": {
      id: "metric-efficiency",
      type: "construction.metric.large",
      title: "Efficiency Rate",
      props: {
        value: "76",
        unit: "%",
        delta: "+5.1",
        subtitle: "Week over week",
        trend: [62, 65, 68, 71, 74, 76],
        color: "purple"
      },
    },
    "metric-safety": {
      id: "metric-safety",
      type: "construction.metric.large",
      title: "Safety Score",
      props: {
        value: "100",
        unit: "%",
        delta: "0",
        subtitle: "Zero incidents",
        trend: [98, 100, 100, 100, 100, 100],
        color: "green"
      },
    },
    "site-map": {
      id: "site-map",
      type: "construction.site.map",
      title: "Site Map",
      props: {
        // Items are auto-populated by the component with sample data
      },
    },
    "installation-dots": {
      id: "installation-dots",
      type: "construction.installation.dots",
      title: "Steel Pipes",
      props: {
        installed: 76,
        total: 100,
        label: "Zone C Installation Progress",
        items: [
          { name: "4\" Pipes", count: 60, installed: 48 },
          { name: "6\" Pipes", count: 40, installed: 28 },
        ]
      },
    },
    "delivery-timeline": {
      id: "delivery-timeline",
      type: "construction.delivery.timeline",
      title: "Today's Deliveries",
      props: {
        date: "September 30, 2025",
        deliveries: [
          { time: "06:30", material: "Steel Pipes × 100", status: "completed", gate: "Gate B" },
          { time: "09:15", material: "Concrete Blocks × 250", status: "completed", gate: "Gate A" },
          { time: "11:00", material: "Electrical Conduit", status: "in-transit", gate: "Gate B" },
          { time: "14:30", material: "Rebar Bundles × 35", status: "scheduled", gate: "Gate A" },
          { time: "16:00", material: "Lumber × 500ft", status: "scheduled", gate: "Gate B" },
        ]
      },
    },
    "material-progress": {
      id: "material-progress",
      type: "construction.material.progress",
      title: "Material Stock",
      props: {
        materials: [
          { name: "Steel Pipes", current: 76, total: 100, zone: "Zone C", status: "good" },
          { name: "Concrete Blocks", current: 65, total: 500, zone: "Zone B", status: "critical" },
          { name: "Rebar Bundles", current: 23, total: 80, zone: "Zone D", status: "low" },
          { name: "Electrical", current: 180, total: 250, zone: "Zone A", status: "good" },
        ]
      },
    },
    "scan-timeline": {
      id: "scan-timeline",
      type: "worksite.scan.timeline",
      title: "Recent Activity",
      props: {},
    },
    "analytics-summary": {
      id: "analytics-summary",
      type: "analytics.summary",
      title: "Site Performance",
      props: {
        metrics: [
          {
            label: "On-time delivery",
            value: 96,
            change: 3.2,
            changeType: "increase" as const,
            format: "percentage" as const,
            icon: "🚛",
          },
          {
            label: "GPS accuracy",
            value: 99.7,
            change: 0.3,
            changeType: "increase" as const,
            format: "percentage" as const,
            icon: "📍",
          },
          {
            label: "Scan-to-install",
            value: 4.2,
            change: -0.9,
            changeType: "decrease" as const,
            format: "text" as const,
            icon: "⏱",
          },
          {
            label: "Worker efficiency",
            value: 94,
            change: 2.1,
            changeType: "increase" as const,
            format: "percentage" as const,
            icon: "👷",
          },
        ],
        period: "Last 7 days",
        lastUpdated: "Updated 2 minutes ago",
      },
    },
  },
}

export default function WorksiteDashboardPage() {
  return (
    <PageTemplate
      pageTitle="Worksite Command"
      pageSubtext="Live construction site tracking & logistics"
      storageKey="dashboard-v2-worksite-v23"
      frozenStorageKey="dashboard-v2-worksite-frozen-v23"
      initialState={worksiteInitialState}
      functionButtons={[
        {
          label: "Print labels",
          variant: "outline",
          onClick: () => console.log("print material labels"),
        },
        {
          label: "Site report",
          variant: "outline",
          onClick: () => console.log("export worksite report"),
        },
      ]}
    />
  )
}