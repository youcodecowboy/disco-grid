"use client"

import PageTemplate from "@/components/PageTemplate"
import type { GridState } from "@/lib/useGridSystem"

type DashboardState = GridState

const itemsInitialState: DashboardState = {
  mode: "save",
  layout: [
    // Top row - Item metrics
    { i: "metric-total-items", x: 0, y: 0, w: 3, h: 4 },
    { i: "metric-in-production", x: 3, y: 0, w: 3, h: 4 },
    { i: "metric-completed", x: 6, y: 0, w: 3, h: 4 },
    { i: "metric-value", x: 9, y: 0, w: 3, h: 4 },
    
    // Main items table - comprehensive view (MUCH LARGER for thousands of items)
    { i: "items-table-main", x: 0, y: 4, w: 12, h: 32 },
    
    // Bottom row - Workflow and Activity
    { i: "workflow-overview", x: 0, y: 36, w: 6, h: 8 },
    { i: "recent-activity", x: 6, y: 36, w: 6, h: 8 },
    
    // Analytics
    { i: "item-analytics", x: 0, y: 44, w: 12, h: 6 },
  ],
  blocks: {
    "metric-total-items": {
      id: "metric-total-items",
      type: "construction.metric.large",
      title: "Total Items",
      props: {
        value: "2,847",
        delta: "+156",
        subtitle: "Active in system",
        trend: [2420, 2550, 2620, 2710, 2780, 2847],
        color: "blue"
      },
    },
    "metric-in-production": {
      id: "metric-in-production",
      type: "construction.metric.large",
      title: "In Production",
      props: {
        value: "1,284",
        delta: "+89",
        subtitle: "Currently being tracked",
        trend: [980, 1050, 1120, 1180, 1240, 1284],
        color: "orange"
      },
    },
    "metric-completed": {
      id: "metric-completed",
      type: "construction.metric.large",
      title: "Completed",
      props: {
        value: "1,563",
        delta: "+67",
        subtitle: "This month",
        trend: [1280, 1340, 1420, 1480, 1520, 1563],
        color: "green"
      },
    },
    "metric-value": {
      id: "metric-value",
      type: "construction.metric.large",
      title: "Total Value",
      props: {
        value: "$1.2M",
        delta: "+$125K",
        subtitle: "Inventory value",
        trend: [980000, 1020000, 1080000, 1140000, 1180000, 1200000],
        color: "purple"
      },
    },
    "items-table-main": {
      id: "items-table-main",
      type: "items.table.comprehensive",
      title: "Items Management",
      props: {
        enableFiltering: true,
        enableSearch: true,
        enableGrouping: true,
        showWorkflows: true,
        showMessaging: true,
        columns: [
          { id: "itemCode", name: "Item Code", type: "text", width: 140, pinned: true },
          { id: "itemName", name: "Item Name", type: "text", width: 220 },
          { id: "order", name: "Order", type: "link", width: 150, linkTo: "orders" },
          { id: "customer", name: "Customer", type: "link", width: 180, linkTo: "customers" },
          { id: "workflow", name: "Workflow", type: "badge", width: 160 },
          { id: "stage", name: "Current Stage", type: "status", width: 140 },
          { id: "quantity", name: "Qty", type: "number", width: 80 },
          { id: "completed", name: "Completed", type: "number", width: 100 },
          { id: "progress", name: "Progress", type: "progress", width: 120 },
          { id: "assignedTo", name: "Assigned To", type: "text", width: 140 },
          { id: "dueDate", name: "Due Date", type: "date", width: 120 },
          { id: "status", name: "Status", type: "status", width: 120 },
          { id: "actions", name: "Actions", type: "actions", width: 120 },
        ],
        data: [
          {
            id: "item-001",
            itemCode: "JKT-AURORA-001",
            itemName: "Aurora Flight Jacket",
            order: "ORD-24-1089",
            customer: "Horizon Apparel Co.",
            workflow: "Cut & Sew Apparel v4",
            stage: "Panel Assembly",
            quantity: 320,
            completed: 240,
            progress: 75,
            assignedTo: "Sewing Line A",
            dueDate: "2025-11-28",
            status: "on-track",
            components: 4,
            hasMessages: true,
            priority: "high"
          },
          {
            id: "item-002",
            itemCode: "PNT-ATLAS-204",
            itemName: "Atlas Cargo Pant",
            order: "ORD-24-1090",
            customer: "Horizon Apparel Co.",
            workflow: "Cut & Sew Apparel v4",
            stage: "Finishing",
            quantity: 540,
            completed: 486,
            progress: 90,
            assignedTo: "Finishing Team",
            dueDate: "2025-11-04",
            status: "on-track",
            components: 0,
            hasMessages: false,
            priority: "normal"
          },
          {
            id: "item-003",
            itemCode: "VST-VOLT-342",
            itemName: "Volt Thermal Vest",
            order: "ORD-24-1091",
            customer: "Nova Fashion Group",
            workflow: "Cut & Sew Apparel v4",
            stage: "QA & Pack",
            quantity: 280,
            completed: 266,
            progress: 95,
            assignedTo: "Quality Team",
            dueDate: "2025-10-12",
            status: "priority",
            components: 2,
            hasMessages: true,
            priority: "high"
          },
          {
            id: "item-004",
            itemCode: "SHL-HALO-672",
            itemName: "Halo Rain Shell",
            order: "ORD-24-1092",
            customer: "Nimbus Outerwear",
            workflow: "Cut & Sew Apparel v4",
            stage: "Fabric Cutting",
            quantity: 180,
            completed: 36,
            progress: 20,
            assignedTo: "Cut Room",
            dueDate: "2025-10-20",
            status: "starting",
            components: 3,
            hasMessages: false,
            priority: "normal"
          },
          {
            id: "item-005",
            itemCode: "HOD-APEX-891",
            itemName: "Apex Performance Hoodie",
            order: "ORD-24-1093",
            customer: "Atlas Activewear",
            workflow: "Cut & Sew Apparel v4",
            stage: "Panel Assembly",
            quantity: 420,
            completed: 189,
            progress: 45,
            assignedTo: "Sewing Line B",
            dueDate: "2025-11-15",
            status: "watch",
            components: 1,
            hasMessages: true,
            priority: "normal"
          },
          {
            id: "item-006",
            itemCode: "JGR-NOVA-445",
            itemName: "Nova Jogger Pant",
            order: "ORD-24-1094",
            customer: "Atlas Activewear",
            workflow: "Cut & Sew Apparel v4",
            stage: "Finishing",
            quantity: 360,
            completed: 320,
            progress: 89,
            assignedTo: "Finishing Team",
            dueDate: "2025-11-08",
            status: "on-track",
            components: 0,
            hasMessages: false,
            priority: "normal"
          },
          {
            id: "item-007",
            itemCode: "BZR-TITAN-223",
            itemName: "Titan Blazer",
            order: "ORD-24-1095",
            customer: "Nova Fashion Group",
            workflow: "Premium Finishing QA",
            stage: "Quality Inspection",
            quantity: 120,
            completed: 108,
            progress: 90,
            assignedTo: "QA Premium",
            dueDate: "2025-10-25",
            status: "on-track",
            components: 5,
            hasMessages: true,
            priority: "high"
          },
          {
            id: "item-008",
            itemCode: "TSH-BASIC-789",
            itemName: "Basic Cotton Tee",
            order: "ORD-24-1096",
            customer: "Horizon Apparel Co.",
            workflow: "Cut & Sew Apparel v4",
            stage: "Panel Assembly",
            quantity: 840,
            completed: 588,
            progress: 70,
            assignedTo: "Sewing Line C",
            dueDate: "2025-10-30",
            status: "on-track",
            components: 0,
            hasMessages: false,
            priority: "low"
          },
        ],
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
            itemCode: "JKT-AURORA-001",
            itemName: "Aurora Flight Jacket",
            stage: "Fabric Cutting",
            user: "Cut Room Team",
            timestamp: "5 minutes ago",
            icon: "check"
          },
          {
            type: "message",
            itemCode: "VST-VOLT-342",
            itemName: "Volt Thermal Vest",
            message: "QA inspection completed - approved",
            user: "Jordan (QA Supervisor)",
            timestamp: "18 minutes ago",
            icon: "message"
          },
          {
            type: "item-created",
            itemCode: "TSH-BASIC-789",
            itemName: "Basic Cotton Tee",
            user: "Amelia Chen",
            timestamp: "32 minutes ago",
            icon: "plus"
          },
          {
            type: "workflow-assigned",
            itemCode: "BZR-TITAN-223",
            itemName: "Titan Blazer",
            workflow: "Premium Finishing QA",
            user: "System",
            timestamp: "1 hour ago",
            icon: "workflow"
          },
          {
            type: "stage-complete",
            itemCode: "PNT-ATLAS-204",
            itemName: "Atlas Cargo Pant",
            stage: "Panel Assembly",
            user: "Sewing Line B",
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
      pageSubtext="Track and manage all items across orders and workflows"
      storageKey="items-v2-dashboard-v2-fixed"
      frozenStorageKey="items-v2-dashboard-frozen-v2-fixed"
      initialState={itemsInitialState}
      showFilters={true}
      functionButtons={[
        {
          label: "Create item",
          variant: "default",
          onClick: () => console.log("create new item"),
        },
        {
          label: "Export list",
          variant: "outline",
          onClick: () => console.log("export items list"),
        },
        {
          label: "Print labels",
          variant: "outline",
          onClick: () => console.log("print item labels"),
        },
      ]}
    />
  )
}


