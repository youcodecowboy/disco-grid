"use client"

import PageTemplate from "@/components/PageTemplate"
import { DashboardState } from "@/lib/useGridSystem"

// Materials page initial state using standardized blocks and PageTemplate
const materialsInitialState: DashboardState = {
  mode: "edit",
  layout: [
    { i: "materials-total", x: 0, y: 0, w: 3, h: 2 },
    { i: "materials-inbound", x: 3, y: 0, w: 3, h: 2 },
    { i: "materials-suppliers", x: 6, y: 0, w: 3, h: 2 },
    { i: "materials-inbound-week", x: 0, y: 2, w: 6, h: 8 },
    { i: "materials-usage", x: 6, y: 2, w: 6, h: 8 },
    { i: "materials-inventory", x: 0, y: 10, w: 12, h: 8 },
    { i: "materials-overdue", x: 0, y: 18, w: 6, h: 4 },
    { i: "materials-supplier-leadtime", x: 6, y: 18, w: 6, h: 4 },
    { i: "materials-welcome", x: 0, y: 22, w: 12, h: 3 }
  ],
  blocks: {
    "materials-total": {
      id: "materials-total",
      type: "metric.kpi",
      title: "Total Materials",
      props: { value: "2,431", delta: "+4.2%", trend: [12, 14, 13, 16, 18, 21, 24] }
    },
    "materials-inbound": {
      id: "materials-inbound",
      type: "metric.kpi",
      title: "Inbound Shipments",
      props: { value: "27", delta: "+3", trend: [8, 9, 7, 10, 11, 12, 13] }
    },
    "materials-suppliers": {
      id: "materials-suppliers",
      type: "metric.kpi",
      title: "Active Suppliers",
      props: { value: "18", delta: "+1", trend: [14, 14, 15, 16, 17, 17, 18] }
    },

    // Inbound week calendar
    "materials-inbound-week": {
      id: "materials-inbound-week",
      type: "materials.inbound.week",
      title: "Inbound Shipments (Week)",
      props: {
        deliveries: [
          { date: "2025-01-06", po: "PO-1043", supplier: "BlueRiver Textiles", category: "Fabric", items: 500, status: "pending" },
          { date: "2025-01-07", po: "PO-1044", supplier: "ZipCo", category: "Accessory", items: 2000, status: "confirmed" },
          { date: "2025-01-08", po: "PO-1046", supplier: "TrimWorld", category: "Trim", items: 1200, status: "pending" },
          { date: "2025-01-09", po: "PO-1047", supplier: "DyeWorks", category: "Dye", items: 40, status: "delayed" },
          { date: "2025-01-10", po: "PO-1048", supplier: "PackIt Co", category: "Packaging", items: 1000, status: "confirmed" }
        ]
      }
    },

    // Usage & runout
    "materials-usage": {
      id: "materials-usage",
      type: "materials.usage",
      title: "Usage & Runout",
      props: {
        currentStock: 2480,
        dailyUsage: 165,
        projectedRunoutDays: 15,
        categories: [
          { name: "Fabric", stock: 1240, dailyUsage: 85 },
          { name: "Accessory", stock: 540, dailyUsage: 40 },
          { name: "Trim", stock: 300, dailyUsage: 25 },
          { name: "Dye", stock: 120, dailyUsage: 6 },
          { name: "Packaging", stock: 280, dailyUsage: 9 }
        ],
        atRisk: [
          { name: "Navy Thread #40", stock: 210, dailyUsage: 25, runoutDays: 8 },
          { name: "Indigo Dye", stock: 80, dailyUsage: 6, runoutDays: 13 }
        ]
      }
    },

    // Inventory table (malleable)
    "materials-inventory": {
      id: "materials-inventory",
      type: "table.malleable",
      title: "Materials Inventory",
      props: {
        columns: [
          { id: "name", name: "Name", type: "text", width: 200 },
          { id: "sku", name: "SKU", type: "text", width: 120 },
          { id: "category", name: "Category", type: "select", width: 140, options: ["Fabric", "Accessory", "Trim", "Dye", "Packaging"] },
          { id: "stock", name: "Stock", type: "number", width: 100 },
          { id: "price", name: "Unit Cost", type: "number", width: 100 },
          { id: "status", name: "Status", type: "status", width: 120 },
          { id: "lastUpdated", name: "Last Updated", type: "date", width: 140 }
        ],
        data: [
          { id: "m1", name: "12oz Denim", sku: "FAB-DNM-12", category: "Fabric", stock: 1240, price: 2.45, status: "active", lastUpdated: "2025-01-02" },
          { id: "m2", name: "Brass Zipper 7in", sku: "ACC-ZPR-07", category: "Accessory", stock: 540, price: 0.35, status: "active", lastUpdated: "2025-01-03" },
          { id: "m3", name: "Navy Thread #40", sku: "TRM-THR-40N", category: "Trim", stock: 210, price: 0.08, status: "pending", lastUpdated: "2024-12-30" },
          { id: "m4", name: "Indigo Dye", sku: "DYE-IND-01", category: "Dye", stock: 80, price: 15.5, status: "active", lastUpdated: "2024-12-28" },
          { id: "m5", name: "Box 12x9x3", sku: "PKG-BOX-1293", category: "Packaging", stock: 420, price: 0.42, status: "active", lastUpdated: "2025-01-01" }
        ]
      }
    },

    // Overdue shipments
    "materials-overdue": {
      id: "materials-overdue",
      type: "materials.overdue",
      title: "Overdue Shipments",
      props: {
        items: [
          { po: 'PO-1007', supplier: 'BlueRiver Textiles', category: 'Fabric', eta: '2024-12-30', daysOverdue: 3 },
          { po: 'PO-1008', supplier: 'TrimWorld', category: 'Trim', eta: '2024-12-24', daysOverdue: 9 }
        ]
      }
    },

    // Supplier lead times
    "materials-supplier-leadtime": {
      id: "materials-supplier-leadtime",
      type: "materials.supplier.leadtime",
      title: "Supplier Lead Times",
      props: {
        suppliers: [
          { name: 'BlueRiver Textiles', avgDays: 7, onTimeRate: 92 },
          { name: 'ZipCo', avgDays: 5, onTimeRate: 88 },
          { name: 'TrimWorld', avgDays: 9, onTimeRate: 81 }
        ]
      }
    },

    // Welcome / guidance content
    "materials-welcome": {
      id: "materials-welcome",
      type: "note",
      title: "Welcome to Materials",
      props: {
        body: `# 📦 Materials Management

Use the tables to manage your materials and track inbound purchase orders.

• Drag and resize blocks to arrange your workspace
• Use Filters on tables to view by Category, Status, Price, or Stock
• Add extensions to blocks for supplier notes, QC checklists, or reorder rules
• Save & Freeze to lock the layout for your team
`
      }
    }
  }
}

export default function MaterialsPage() {
  return (
    <PageTemplate
      pageTitle="Materials"
      pageSubtext="Inventory and inbound purchase orders"
      storageKey="groovy:materials:v3"
      frozenStorageKey="groovy:materials:frozen:v3"
      initialState={materialsInitialState}
      showFilters={true}
      functionButtons={[
        {
          label: "Add Material",
          variant: "default",
          onClick: () => {
            // TODO: Integrate add material modal or AI prompt
            console.log("Add Material clicked")
          }
        },
        {
          label: "Manage Suppliers",
          variant: "outline",
          onClick: () => {
            // TODO: Integrate suppliers management modal
            console.log("Manage Suppliers clicked")
          }
        }
      ]}
    />
  )
}
