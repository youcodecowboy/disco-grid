"use client"

import PageTemplate from "@/components/PageTemplate"
import type { GridState } from "@/lib/useGridSystem"
import { MOCK_ITEM_CODES, getItemCodeProgress } from "@/lib/data/itemCodes"

type DashboardState = GridState

// Calculate real metrics from Item Codes data
const totalItemCodes = MOCK_ITEM_CODES.length
const totalLineItems = MOCK_ITEM_CODES.reduce((sum, ic) => sum + ic.quantity, 0)
const inProductionCount = MOCK_ITEM_CODES.filter(ic => ic.status === "In Production").length
const completedCount = MOCK_ITEM_CODES.filter(ic => ic.status === "Completed" || ic.status === "Ready").length
const avgProgress = Math.round(
  MOCK_ITEM_CODES.reduce((sum, ic) => sum + getItemCodeProgress(ic), 0) / MOCK_ITEM_CODES.length
)
const totalCompleted = MOCK_ITEM_CODES.reduce((sum, ic) => sum + ic.lineItemsCompleted, 0)

const itemsInitialState: DashboardState = {
  mode: "save",
  layout: [
    // Top row - Item Code metrics
    { i: "metric-item-codes", x: 0, y: 0, w: 3, h: 4 },
    { i: "metric-line-items", x: 3, y: 0, w: 3, h: 4 },
    { i: "metric-in-production", x: 6, y: 0, w: 3, h: 4 },
    { i: "metric-avg-progress", x: 9, y: 0, w: 3, h: 4 },
    
    // Main items table - Item Codes view (MUCH LARGER for comprehensive data)
    { i: "items-table-main", x: 0, y: 4, w: 12, h: 32 },
    
    // Bottom row - Workflow and Activity
    { i: "workflow-overview", x: 0, y: 36, w: 6, h: 8 },
    { i: "recent-activity", x: 6, y: 36, w: 6, h: 8 },
    
    // Analytics
    { i: "item-analytics", x: 0, y: 44, w: 12, h: 6 },
  ],
  blocks: {
    "metric-item-codes": {
      id: "metric-item-codes",
      type: "construction.metric.large",
      title: "Item Codes",
      props: {
        value: totalItemCodes.toString(),
        delta: `${inProductionCount} active`,
        subtitle: "Unique item variants",
        trend: [5, 6, 7, 7, 8, 8],
        color: "blue"
      },
    },
    "metric-line-items": {
      id: "metric-line-items",
      type: "construction.metric.large",
      title: "Total Line Items",
      props: {
        value: totalLineItems.toLocaleString(),
        delta: `${totalCompleted} done`,
        subtitle: "Individual units tracked",
        trend: [1100, 1150, 1200, 1250, 1280, 1300],
        color: "purple"
      },
    },
    "metric-in-production": {
      id: "metric-in-production",
      type: "construction.metric.large",
      title: "In Production",
      props: {
        value: inProductionCount.toString(),
        delta: `${completedCount} ready`,
        subtitle: "Active item codes",
        trend: [4, 5, 6, 6, 6, 6],
        color: "orange"
      },
    },
    "metric-avg-progress": {
      id: "metric-avg-progress",
      type: "construction.metric.large",
      title: "Avg Progress",
      props: {
        value: `${avgProgress}%`,
        delta: "+8% this week",
        subtitle: "Overall completion",
        trend: [45, 50, 55, 58, 60, 62],
        color: "green"
      },
    },
    "items-table-main": {
      id: "items-table-main",
      type: "items.itemcodes.table",
      title: "Item Codes • Click any row to view line items",
      props: {
        itemCodes: MOCK_ITEM_CODES,
      },
    },
    "workflow-overview": {
      id: "workflow-overview",
      type: "items.workflow.overview",
      title: "Workflow Distribution",
      props: {
        workflows: [
          { 
            name: "Cut & Sew Apparel v4", 
            itemCount: 6,
            activeItems: 5,
            completedToday: 89,
            color: "blue"
          },
          { 
            name: "Premium Finishing QA", 
            itemCount: 1,
            activeItems: 1,
            completedToday: 12,
            color: "purple"
          },
          { 
            name: "Bench Production v1", 
            itemCount: 1,
            activeItems: 0,
            completedToday: 0,
            color: "green"
          },
        ],
      },
    },
    "recent-activity": {
      id: "recent-activity",
      type: "items.activity.timeline",
      title: "Recent Activity",
      props: {
        activities: [
          {
            type: "stage-complete",
            itemCode: "JKT-AURORA-M-001",
            itemName: "Aurora Flight Jacket - Medium",
            stage: "Sewing",
            user: "Sewing Line A",
            timestamp: "3 minutes ago",
            icon: "check"
          },
          {
            type: "message",
            itemCode: "VEST-TAC-STD-001",
            itemName: "Tactical Vest - Standard",
            message: "Material cutting in progress",
            user: "Defense Team",
            timestamp: "12 minutes ago",
            icon: "message"
          },
          {
            type: "item-created",
            itemCode: "BAG-CROSS-BLK-001",
            itemName: "Leather Crossbody Bag",
            user: "A. Moretti",
            timestamp: "28 minutes ago",
            icon: "plus"
          },
          {
            type: "workflow-assigned",
            itemCode: "HD-METRO-M-001",
            itemName: "Metro Hoodie - Medium",
            workflow: "Knit & Finish Workflow",
            user: "System",
            timestamp: "45 minutes ago",
            icon: "workflow"
          },
          {
            type: "stage-complete",
            itemCode: "JEAN-SEL-32X34-001",
            itemName: "Selvedge Denim Jean",
            stage: "QC & Pack",
            user: "Quality Team",
            timestamp: "1 hour ago",
            icon: "check"
          },
        ],
      },
    },
    "item-analytics": {
      id: "item-analytics",
      type: "analytics.summary",
      title: "Item Performance Metrics",
      props: {
        metrics: [
          {
            label: "Avg completion time",
            value: 18.5,
            change: -2.3,
            changeType: "decrease" as const,
            format: "text" as const,
            icon: "⏱",
          },
          {
            label: "On-time delivery rate",
            value: 94,
            change: 3.2,
            changeType: "increase" as const,
            format: "percentage" as const,
            icon: "📦",
          },
          {
            label: "Items with components",
            value: 58,
            change: 12,
            changeType: "increase" as const,
            format: "percentage" as const,
            icon: "🔧",
          },
          {
            label: "Workflow efficiency",
            value: 87,
            change: 5.1,
            changeType: "increase" as const,
            format: "percentage" as const,
            icon: "⚡",
          },
        ],
        period: "Last 30 days",
        lastUpdated: "Updated 3 minutes ago",
      },
    },
  },
}

export default function ItemsV2Page() {
  return (
    <PageTemplate
      pageTitle="Items Management"
      pageSubtext="Track item codes and drill into individual line items • Level 1 of 3"
      storageKey="items-v2-dashboard-itemcodes-v1"
      frozenStorageKey="items-v2-dashboard-itemcodes-frozen-v1"
      initialState={itemsInitialState}
      showFilters={true}
      functionButtons={[
        {
          label: "Print QR labels",
          variant: "default",
          onClick: () => alert("Print QR code labels for all line items"),
        },
        {
          label: "Export data",
          variant: "outline",
          onClick: () => alert("Export item codes data"),
        },
        {
          label: "View orders",
          variant: "outline",
          onClick: () => alert("Navigate to orders page"),
        },
      ]}
    />
  )
}


