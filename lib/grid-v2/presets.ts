import type { GridState } from "./types"

const dashboardPreset: GridState = {
  mode: "edit",
  layout: [
    { i: "overview", x: 0, y: 0, w: 4, h: 6 },
    { i: "orders", x: 4, y: 0, w: 4, h: 6 },
    { i: "activity", x: 8, y: 0, w: 4, h: 6 },
    { i: "layout-container", x: 0, y: 6, w: 6, h: 8 },
    { i: "empty-layout", x: 6, y: 6, w: 6, h: 8 },
    { i: "nav-showcase", x: 0, y: 14, w: 12, h: 6 },
    { i: "form-showcase", x: 0, y: 20, w: 6, h: 10 },
    { i: "table", x: 6, y: 20, w: 6, h: 8 },
  ],
  blocks: {
    overview: {
      id: "overview",
      type: "metric.kpi",
      title: "WIP Items",
      props: { value: "126", delta: "+12%", trend: [90, 95, 100, 110, 120, 123, 126] },
    },
    orders: {
      id: "orders",
      type: "metric.chart",
      title: "Orders Ready",
      props: { value: "34", delta: "+4%", trend: [20, 21, 24, 26, 28, 30, 34] },
    },
    activity: {
      id: "activity",
      type: "activity.timeline",
      title: "Activity",
      props: {
        activities: [
          { time: "2h", user: "J. Smith", action: "Completed QA", status: "success" },
          { time: "3h", user: "S. Lee", action: "Started Sewing", status: "info" },
          { time: "5h", user: "M. Patel", action: "Flagged issue", status: "warning" },
        ],
      },
    },
    "layout-container": {
      id: "layout-container",
      type: "layout.container",
      title: "Metrics Section",
      props: {
        padding: "md",
        background: "surface",
        border: true,
        description: "Container for key metrics and charts.",
      },
      slots: {
        primary: {
          id: "primary-metric",
          type: "metric.kpi",
          title: "Revenue",
          props: { value: "$45.2K", delta: "+8.3%", trend: [35, 38, 42, 40, 43, 45, 45] },
        },
        secondary: null,
      },
    },
    "empty-layout": {
      id: "empty-layout",
      type: "layout.split",
      title: "Empty Split Layout",
      props: {
        direction: "horizontal",
        ratio: 60,
        primaryTitle: "Primary Pane",
        secondaryTitle: "Secondary Pane",
      },
      slots: {
        primary: null,
        secondary: null,
      },
    },
    "nav-showcase": {
      id: "nav-showcase",
      type: "layout.grid",
      title: "Navigation Components",
      props: {
        columns: 2,
        gap: "md",
        areas: [
          { id: "tile-1", title: "Breadcrumbs" },
          { id: "tile-2", title: "Quick Search" },
          { id: "tile-3", title: "Status Badges" },
          { id: "tile-4", title: "Toolbar" },
        ],
      },
      slots: {
        "tile-1": {
          id: "breadcrumbs-demo",
          type: "nav.breadcrumbs",
          title: "Breadcrumbs Demo",
          props: {
            items: [
              { id: "1", label: "Home", href: "/" },
              { id: "2", label: "Products", href: "/products" },
              { id: "3", label: "T-Shirts", isActive: true },
            ],
            showHome: true,
            separator: "chevron",
          },
        },
        "tile-2": {
          id: "search-demo",
          type: "nav.quicksearch",
          title: "Search Demo",
          props: {
            placeholder: "Search orders, items...",
            recentSearches: ["Order #1234", "Acme Denim"],
            showRecent: true,
          },
        },
        "tile-3": {
          id: "badges-demo",
          type: "status.badges",
          title: "Status Demo",
          props: {
            badges: [
              { id: "1", label: "Active", status: "success", count: 15, trend: "up" },
              { id: "2", label: "Issues", status: "warning", count: 2, trend: "down" },
            ],
            layout: "grid",
            showCounts: true,
            showTrends: true,
          },
        },
        "tile-4": {
          id: "toolbar-demo",
          type: "toolbar.actions",
          title: "Toolbar Demo",
          props: {
            actions: [
              { id: "1", label: "New", icon: "plus", variant: "primary", size: "md" },
              { id: "2", label: "Export", icon: "download", variant: "outline", size: "md" },
              { id: "3", label: "Settings", icon: "settings", variant: "ghost", size: "md" },
            ],
            layout: "horizontal",
            showLabels: true,
          },
        },
      },
    },
    "form-showcase": {
      id: "form-showcase",
      type: "form.builder",
      title: "Contact Form",
      props: {
        description: "Fill out this form to get in touch with us.",
        submitLabel: "Send Message",
        isMultiStep: false,
      },
      slots: {
        "element-0": {
          id: "name-section",
          type: "form.section",
          title: "Personal Information",
          props: {
            heading: "Personal Information",
            description: "Please provide your contact details",
            divider: true,
            spacing: "md",
          },
        },
        "element-1": {
          id: "name-input",
          type: "form.input",
          title: "Full Name",
          props: {
            label: "Full Name",
            placeholder: "Enter your full name",
            type: "text",
            required: true,
            helpText: "Please provide your legal name",
          },
        },
        "element-2": {
          id: "email-input",
          type: "form.input",
          title: "Email",
          props: {
            label: "Email Address",
            placeholder: "Enter your email",
            type: "email",
            required: true,
            helpText: "We'll never share your email",
          },
        },
        "element-3": null,
        "element-4": null,
      },
    },
    table: {
      id: "table",
      type: "table.malleable",
      title: "Orders",
      props: {
        columns: ["Order", "Customer", "Status", "Amount"],
        rows: [
          ["#1234", "Acme Denim", "Cutting", "$1,240"],
          ["#1235", "Northwind", "Finishing", "$980"],
          ["#1236", "Horizon", "QA", "$1,720"],
        ],
      },
    },
  },
}

const onboardingPreset: GridState = {
  mode: "edit",
  layout: [
    { i: "onboarding-intro", x: 0, y: 0, w: 12, h: 5 },
    { i: "onboarding-steps", x: 0, y: 5, w: 8, h: 24 },
    { i: "onboarding-summary", x: 8, y: 5, w: 4, h: 10 },
    { i: "onboarding-support", x: 8, y: 15, w: 4, h: 14 },
  ],
  blocks: {
    "onboarding-intro": {
      id: "onboarding-intro",
      type: "note",
      title: "Welcome",
      props: {
        body: `# Configure Your Demo Facility\n\nThis guided onboarding captures the essentials in five quick steps. Provide a few details about your facility, production focus, and SKU structure so we can generate a tailored workspace.`,
      },
    },
    "onboarding-steps": {
      id: "onboarding-steps",
      type: "layout.stack",
      title: "Onboarding Wizard",
      props: {
        direction: "vertical",
        gap: "md",
        sections: [
          { id: "section-1", title: "Step 1 — Facility", description: "Where should we deploy the factory app?" },
          { id: "section-2", title: "Step 2 — Operations", description: "What are we tracking?" },
          { id: "section-3", title: "Step 3 — Team & Capacity", description: "Tell us about throughput." },
          { id: "section-4", title: "Step 4 — Floorplan", description: "Upload a reference layout." },
          { id: "section-5", title: "Step 5 — SKU Builder", description: "Define the products we’ll manage." },
        ],
      },
      slots: {
        "section-1": {
          id: "step-facility",
          type: "form.builder",
          title: "Facility Location",
          props: {
            description: "Capture the primary facility details to ground the workspace.",
            submitLabel: "Save Facility",
            isMultiStep: true,
            currentStep: 1,
          },
          slots: {
            "element-0": {
              id: "facility-section",
              type: "form.section",
              title: "Facility Details",
              props: {
                heading: "Facility Location",
                description: "We’ll use this to personalize dashboards and default timezones.",
                divider: true,
                spacing: "md",
              },
            },
            "element-1": {
              id: "facility-name",
              type: "form.input",
              title: "Facility Name",
              props: {
                label: "Facility name",
                placeholder: "e.g. South Plant",
                required: true,
                helpText: "Use the name operators will recognize on site.",
              },
            },
            "element-2": {
              id: "facility-address",
              type: "form.input",
              title: "Address",
              props: {
                label: "Street address",
                placeholder: "123 Industrial Way",
                required: true,
              },
            },
            "element-3": {
              id: "facility-city",
              type: "form.input",
              title: "City",
              props: {
                label: "City",
                placeholder: "Enter city",
              },
            },
            "element-4": {
              id: "facility-region",
              type: "form.select",
              title: "Region",
              props: {
                label: "Region",
                placeholder: "Choose region",
                options: ["North America", "Europe", "APAC", "LATAM", "Middle East"],
              },
            },
            "element-5": {
              id: "facility-timezone",
              type: "form.select",
              title: "Timezone",
              props: {
                label: "Primary timezone",
                placeholder: "Select timezone",
                options: ["UTC-08", "UTC-05", "UTC", "UTC+01", "UTC+05:30"],
              },
            },
          },
        },
        "section-2": {
          id: "step-operations",
          type: "form.builder",
          title: "Operations Focus",
          props: {
            description: "Tell us what you manufacture or monitor so we can seed the right templates.",
            submitLabel: "Save Operations",
            isMultiStep: true,
            currentStep: 2,
          },
          slots: {
            "element-0": {
              id: "operations-section",
              type: "form.section",
              title: "Production Focus",
              props: {
                heading: "Production Focus",
                description: "Choose the workflows we should emphasise in Mission Control.",
                divider: true,
                spacing: "md",
              },
            },
            "element-1": {
              id: "operations-industry",
              type: "form.select",
              title: "Industry",
              props: {
                label: "Which domain best describes your operation?",
                placeholder: "Select industry",
                options: ["Manufacturing", "Construction", "Field Ops", "Logistics", "Defense"],
              },
            },
            "element-2": {
              id: "operations-assets",
              type: "form.checkbox",
              title: "Tracked Assets",
              props: {
                label: "Assets to monitor",
                type: "multiple",
                options: [
                  "Work-in-progress",
                  "Tools & equipment",
                  "Consumables",
                  "Kits / containers",
                  "Finished goods",
                ],
                helpText: "Pick everything you’d like to trace in the demo.",
              },
            },
            "element-3": {
              id: "operations-kpi",
              type: "form.select",
              title: "Priority KPI",
              props: {
                label: "What’s the top KPI you watch daily?",
                placeholder: "Select KPI",
                options: ["Throughput", "On-time delivery", "Scrap rate", "Utilization", "Inventory turns"],
              },
            },
          },
        },
        "section-3": {
          id: "step-capacity",
          type: "form.builder",
          title: "Team & Capacity",
          props: {
            description: "Rough sizing helps us set realistic demo volumes.",
            submitLabel: "Save Capacity",
            isMultiStep: true,
            currentStep: 3,
          },
          slots: {
            "element-0": {
              id: "capacity-section",
              type: "form.section",
              title: "Team & Throughput",
              props: {
                heading: "Team & Throughput",
                description: "These inputs downstream into scheduling and alerts.",
                divider: true,
                spacing: "md",
              },
            },
            "element-1": {
              id: "capacity-team-size",
              type: "form.input",
              title: "Team Size",
              props: {
                label: "How many operators?",
                placeholder: "e.g. 45",
                type: "number",
                helpText: "Use total headcount across shifts.",
              },
            },
            "element-2": {
              id: "capacity-shifts",
              type: "form.input",
              title: "Shift Count",
              props: {
                label: "Shifts per day",
                placeholder: "e.g. 3",
                type: "number",
              },
            },
            "element-3": {
              id: "capacity-throughput",
              type: "form.input",
              title: "Daily Capacity",
              props: {
                label: "Units produced per day",
                placeholder: "e.g. 120",
                type: "number",
              },
            },
          },
        },
        "section-4": {
          id: "step-floorplan",
          type: "form.builder",
          title: "Floorplan",
          props: {
            description: "Upload a snapshot of the floor so we can seed demo zones.",
            submitLabel: "Save Floorplan",
            isMultiStep: true,
            currentStep: 4,
          },
          slots: {
            "element-0": {
              id: "floorplan-section",
              type: "form.section",
              title: "Floorplan",
              props: {
                heading: "Floorplan Upload",
                description: "Add a lightweight drawing or photo—nothing fancy required.",
                divider: true,
                spacing: "md",
              },
            },
            "element-1": {
              id: "floorplan-upload",
              type: "form.upload",
              title: "Upload",
              props: {
                label: "Floorplan image",
                accept: "image/png,image/jpeg,application/pdf",
                helpText: "PNG, JPG, or PDF up to 10MB.",
              },
            },
            "element-2": {
              id: "floorplan-zones",
              type: "form.input",
              title: "Zone Count",
              props: {
                label: "How many logical zones?",
                placeholder: "e.g. 6",
                type: "number",
              },
            },
            "element-3": {
              id: "floorplan-notes",
              type: "form.textarea",
              title: "Zone Notes",
              props: {
                label: "Highlight critical areas",
                placeholder: "Receiving, inspection, staging...",
                rows: 3,
              },
            },
          },
        },
        "section-5": {
          id: "step-sku",
          type: "form.builder",
          title: "SKU Builder",
          props: {
            description: "Define how you identify the things we’ll track.",
            submitLabel: "Save SKU Settings",
            isMultiStep: true,
            currentStep: 5,
          },
          slots: {
            "element-0": {
              id: "sku-section",
              type: "form.section",
              title: "SKU Configuration",
              props: {
                heading: "SKU Builder",
                description: "We’ll use this to auto-generate templates and naming rules.",
                divider: true,
                spacing: "md",
              },
            },
            "element-1": {
              id: "sku-prefix",
              type: "form.input",
              title: "SKU Prefix",
              props: {
                label: "SKU prefix",
                placeholder: "e.g. DNM",
                helpText: "Used for autogenerated IDs.",
              },
            },
            "element-2": {
              id: "sku-categories",
              type: "form.select",
              title: "Item Categories",
              props: {
                label: "Primary categories",
                placeholder: "Select categories",
                multiple: true,
                options: ["Raw materials", "Sub-assemblies", "Finished goods", "Tooling", "Consumables"],
              },
            },
            "element-3": {
              id: "sku-attributes",
              type: "form.checkbox",
              title: "Label Attributes",
              props: {
                label: "Include attributes",
                type: "multiple",
                options: ["Expiry date", "Serial number", "Lot / batch", "Owner", "Maintenance interval"],
              },
            },
            "element-4": {
              id: "sku-batch-size",
              type: "form.input",
              title: "Default Batch Size",
              props: {
                label: "Default batch size",
                placeholder: "e.g. 25",
                type: "number",
              },
            },
          },
        },
      },
    },
    "onboarding-summary": {
      id: "onboarding-summary",
      type: "layout.container",
      title: "Progress",
      props: {
        padding: "sm",
        description: "Quick glimpse of what we’ve captured so far.",
      },
      slots: {
        primary: {
          id: "onboarding-status",
          type: "status.badges",
          title: "Completion",
          props: {
            badges: [
              { id: "step-1", label: "Facility", status: "success", count: 1, trend: "up" },
              { id: "step-2", label: "Operations", status: "success", count: 1, trend: "up" },
              { id: "step-3", label: "Capacity", status: "active", count: 1, trend: "stable" },
              { id: "step-4", label: "Floorplan", status: "pending", count: 1, trend: "stable" },
              { id: "step-5", label: "SKU", status: "pending", count: 1, trend: "stable" },
            ],
            layout: "grid",
            showCounts: true,
            showTrends: true,
          },
        },
        secondary: {
          id: "onboarding-note",
          type: "note",
          title: "Summary",
          props: {
            body: `## Demo Checklist\n• Capture one facility\n• Select up to five asset types\n• Provide baseline throughput\n• Drop a floorplan image\n• Define SKU defaults`,
          },
        },
      },
    },
    "onboarding-support": {
      id: "onboarding-support",
      type: "note",
      title: "Need Help?",
      props: {
        body: `### Tips\n• Skim through each step—fields already have sensible defaults.\n• Upload any image for the floorplan; we’ll auto-generate demo zones.\n• You can revisit these settings later via the onboarding history tab.`,
      },
    },
  },
}

const playgroundPreset: GridState = {
  mode: "edit",
  layout: [
    { i: "revenue-kpi", x: 0, y: 0, w: 3, h: 4 },
    { i: "orders-kpi", x: 3, y: 0, w: 3, h: 4 },
    { i: "items-kpi", x: 6, y: 0, w: 3, h: 4 },
    { i: "completion-kpi", x: 9, y: 0, w: 3, h: 4 },
    { i: "sales-chart", x: 0, y: 4, w: 8, h: 8 },
    { i: "activity-timeline", x: 8, y: 4, w: 4, h: 8 },
    { i: "orders-table", x: 0, y: 12, w: 6, h: 8 },
    { i: "ai-builder", x: 6, y: 12, w: 6, h: 8 },
  ],
  blocks: {
    "revenue-kpi": {
      id: "revenue-kpi",
      type: "construction.metric.large",
      title: "Revenue",
      props: {
        value: "248.5",
        unit: "K",
        delta: "+18.2%",
        subtitle: "Monthly total",
        trend: [180, 195, 210, 220, 230, 240, 248],
        color: "blue",
      },
    },
    "orders-kpi": {
      id: "orders-kpi",
      type: "construction.metric.large",
      title: "Active Orders",
      props: {
        value: "127",
        delta: "+12",
        subtitle: "In production",
        trend: [95, 102, 108, 115, 118, 122, 127],
        color: "green",
      },
    },
    "items-kpi": {
      id: "items-kpi",
      type: "construction.metric.large",
      title: "Items in Production",
      props: {
        value: "1,842",
        delta: "+156",
        subtitle: "This week",
        trend: [1450, 1520, 1600, 1680, 1750, 1800, 1842],
        color: "purple",
      },
    },
    "completion-kpi": {
      id: "completion-kpi",
      type: "construction.metric.large",
      title: "Completion Rate",
      props: {
        value: "94.2",
        unit: "%",
        delta: "+2.1%",
        subtitle: "Quality target",
        trend: [88, 90, 91, 92, 93, 93.5, 94.2],
        color: "green",
      },
    },
    "sales-chart": {
      id: "sales-chart",
      type: "v3.chart.area",
      title: "Revenue Trend",
      props: {
        data: [
          { name: "Jan", value: 180000 },
          { name: "Feb", value: 195000 },
          { name: "Mar", value: 210000 },
          { name: "Apr", value: 220000 },
          { name: "May", value: 230000 },
          { name: "Jun", value: 240000 },
          { name: "Jul", value: 248500 },
        ],
      },
    },
    "activity-timeline": {
      id: "activity-timeline",
      type: "v3.activity.timeline",
      title: "Recent Activity",
      props: {
        activities: [
          { time: "5m", user: "J. Smith", action: "Completed Order #4521", status: "success" },
          { time: "12m", user: "M. Chen", action: "Updated item status", status: "info" },
          { time: "28m", user: "A. Johnson", action: "Created new order", status: "info" },
          { time: "1h", user: "S. Kumar", action: "Flagged quality issue", status: "warning" },
          { time: "2h", user: "R. Martinez", action: "Shipped order #4518", status: "success" },
        ],
      },
    },
    "orders-table": {
      id: "orders-table",
      type: "v3.table",
      title: "Recent Orders",
      props: {
        columns: ["Order #", "Customer", "Status", "Value"],
        rows: [
          ["#4521", "Acme Corp", "Completed", "$12,400"],
          ["#4520", "TechStart Inc", "In Production", "$8,900"],
          ["#4519", "Global Mfg", "Cutting", "$15,200"],
          ["#4518", "Northwind", "Shipped", "$6,750"],
          ["#4517", "Horizon Ltd", "QA", "$9,840"],
        ],
      },
    },
    "ai-builder": {
      id: "ai-builder",
      type: "ai.input",
      title: "AI Component Builder",
      props: {
        placeholder: "Describe a component to add to your dashboard...",
      },
    },
  },
}

function cloneState(state: GridState): GridState {
  if (typeof structuredClone === "function") {
    return structuredClone(state)
  }
  return JSON.parse(JSON.stringify(state)) as GridState
}

const presetMap: Record<string, GridState> = {
  dashboard: dashboardPreset,
  v2: dashboardPreset,
  onboarding: onboardingPreset,
  playground: playgroundPreset,
}

export function getDashboardPreset(): GridState {
  return cloneState(dashboardPreset)
}

export function getOnboardingPreset(): GridState {
  return cloneState(onboardingPreset)
}

export function getPlaygroundPreset(): GridState {
  return cloneState(playgroundPreset)
}

export function getPreset(name: string): GridState | null {
  const preset = presetMap[name.toLowerCase()]
  return preset ? cloneState(preset) : null
}

export function createBlankPreset(title: string): GridState {
  const safeTitle = title || "New Page"
  const instructions = `# Welcome to ${safeTitle}\n\nThis is your custom dashboard powered by AI. Get started by:\n\n• **Using the AI Builder** below to describe components\n• **Adding blocks** with the + button at the bottom\n• **Dragging & resizing** components on the grid\n• **Editing** any component with the toolbar\n\nYou have access to 50+ component types including charts, tables, metrics, forms, and more!`

  return {
    mode: "edit",
    layout: [
      { i: "welcome", x: 0, y: 0, w: 8, h: 8 },
      { i: "ai-builder", x: 8, y: 0, w: 4, h: 8 },
      { i: "sample-metric-1", x: 0, y: 8, w: 3, h: 4 },
      { i: "sample-metric-2", x: 3, y: 8, w: 3, h: 4 },
      { i: "sample-metric-3", x: 6, y: 8, w: 3, h: 4 },
      { i: "sample-metric-4", x: 9, y: 8, w: 3, h: 4 },
    ],
    blocks: {
      welcome: {
        id: "welcome",
        type: "note",
        title: safeTitle,
        props: {
          body: instructions,
        },
      },
      "ai-builder": {
        id: "ai-builder",
        type: "ai.input",
        title: "AI Component Builder",
        props: {
          placeholder: "Describe a component to add to your dashboard...",
        },
      },
      "sample-metric-1": {
        id: "sample-metric-1",
        type: "construction.metric.large",
        title: "Total Items",
        props: {
          value: "0",
          delta: "Ready",
          subtitle: "Get started",
          trend: [0, 0, 0, 0, 0, 0, 0],
          color: "blue",
        },
      },
      "sample-metric-2": {
        id: "sample-metric-2",
        type: "construction.metric.large",
        title: "Active Orders",
        props: {
          value: "0",
          delta: "Ready",
          subtitle: "Get started",
          trend: [0, 0, 0, 0, 0, 0, 0],
          color: "green",
        },
      },
      "sample-metric-3": {
        id: "sample-metric-3",
        type: "construction.metric.large",
        title: "Completion Rate",
        props: {
          value: "0",
          unit: "%",
          delta: "Ready",
          subtitle: "Get started",
          trend: [0, 0, 0, 0, 0, 0, 0],
          color: "purple",
        },
      },
      "sample-metric-4": {
        id: "sample-metric-4",
        type: "construction.metric.large",
        title: "Revenue",
        props: {
          value: "0",
          unit: "K",
          delta: "Ready",
          subtitle: "Get started",
          trend: [0, 0, 0, 0, 0, 0, 0],
          color: "orange",
        },
      },
    },
  }
}
