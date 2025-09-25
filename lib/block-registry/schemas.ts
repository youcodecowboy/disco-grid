import { z } from "zod"

const noteSchema = z
  .object({
    body: z.string().optional(),
    hideTitle: z.boolean().optional(),
    activities: z
      .array(
        z.object({
          id: z.string().optional(),
          text: z.string(),
          time: z.string().optional(),
          status: z.string().optional(),
          type: z.string().optional(),
        }),
      )
      .optional(),
  })
  .passthrough()

const metricSchema = z
  .object({
    value: z.string().optional(),
    delta: z.string().optional(),
    trend: z.array(z.number()).optional(),
  })
  .passthrough()

const metricSparkSchema = z
  .object({
    value: z.string().optional(),
    trend: z.string().optional(),
    trendDirection: z.enum(["up", "down", "neutral"]).optional(),
    description: z.string().optional(),
  })
  .passthrough()

const layoutContainerSchema = z
  .object({
    padding: z.enum(["none", "xs", "sm", "md", "lg"]).optional(),
    background: z.enum(["surface", "muted", "subtle"]).optional(),
    border: z.boolean().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
  })
  .passthrough()

const layoutSplitSchema = z
  .object({
    direction: z.enum(["horizontal", "vertical"]).default("horizontal"),
    ratio: z.number().min(10).max(90).optional(),
    primaryTitle: z.string().optional(),
    secondaryTitle: z.string().optional(),
  })
  .passthrough()

const layoutStackSchema = z
  .object({
    direction: z.enum(["vertical", "horizontal"]).optional(),
    gap: z.enum(["xs", "sm", "md", "lg"]).optional(),
    sections: z
      .array(
        z.object({
          id: z.string(),
          title: z.string(),
          description: z.string().optional(),
        }),
      )
      .optional(),
  })
  .passthrough()

const layoutGridSchema = z
  .object({
    columns: z.number().min(1).max(4).optional(),
    gap: z.enum(["xs", "sm", "md", "lg"]).optional(),
    areas: z
      .array(
        z.object({
          id: z.string(),
          title: z.string(),
          span: z.string().optional(),
        }),
      )
      .optional(),
  })
  .passthrough()

const lineSeriesSchema = z
  .object({
    name: z.string(),
    value: z.number(),
  })
  .passthrough()

const chartLineSchema = z
  .object({
    data: z.array(lineSeriesSchema).optional(),
    color: z.string().optional(),
  })
  .passthrough()

const barPointSchema = z
  .object({
    x: z.string(),
    y: z.number(),
  })
  .passthrough()

const barSeriesSchema = z
  .object({
    name: z.string().optional(),
    points: z.array(barPointSchema),
  })
  .passthrough()

const chartBarSchema = z
  .object({
    series: z.array(barSeriesSchema).optional(),
  })
  .passthrough()

const chartAreaSchema = chartBarSchema

const donutSliceSchema = z
  .object({
    label: z.string(),
    value: z.number(),
  })
  .passthrough()

const chartDonutSchema = z
  .object({
    slices: z.array(donutSliceSchema).optional(),
  })
  .passthrough()

const chartScatterSchema = z
  .object({
    points: z
      .array(
        z.object({
          x: z.number(),
          y: z.number(),
          label: z.string().optional(),
        }),
      )
      .optional(),
  })
  .passthrough()

const tableColumnSchema = z.union([
  z.string(),
  z
    .object({
      id: z.string(),
      name: z.string(),
      type: z.string().optional(),
      options: z.array(z.string()).optional(),
      width: z.number().optional(),
      required: z.boolean().optional(),
    })
    .passthrough(),
])

const tableRowSchema = z.union([z.array(z.any()), z.record(z.any())])

const tableMalleableSchema = z
  .object({
    columns: z.array(tableColumnSchema).optional(),
    rows: z.array(tableRowSchema).optional(),
    data: z.array(z.record(z.any())).optional(),
  })
  .passthrough()

const tableItemsSchema = z
  .object({
    items: z
      .array(
        z
          .object({
            id: z.string(),
            name: z.string(),
            description: z.string().optional(),
            category: z.string().optional(),
            stock: z.number().optional(),
            price: z.number().optional(),
            status: z.enum(["In Stock", "Low Stock", "Out of Stock"]).optional(),
            lastUpdated: z.string().optional(),
            supplier: z.string().optional(),
            sku: z.string().optional(),
          })
          .passthrough(),
      )
      .optional(),
    showColumnCustomization: z.boolean().optional(),
  })
  .passthrough()

const tabsSchema = z
  .object({
    tabs: z
      .array(
        z
          .object({
            id: z.string(),
            label: z.string(),
            description: z.string().optional(),
            content: z.string().optional(),
          })
          .passthrough(),
      )
      .optional(),
    defaultTab: z.string().optional(),
  })
  .passthrough()

const activityTimelineSchema = z
  .object({
    activities: z
      .array(
        z.object({
          id: z.string().optional(),
          user: z.string().optional(),
          action: z.string(),
          time: z.string().optional(),
          status: z.string().optional(),
          type: z.string().optional(),
        }),
      )
      .optional(),
  })
  .passthrough()

const commandsQuickSchema = z
  .object({
    commands: z.array(z.string()).optional(),
  })
  .passthrough()

const messagesPanelSchema = z
  .object({
    conversations: z
      .array(
        z.object({
          id: z.string(),
          title: z.string(),
          participants: z.array(z.string()),
          lastMessage: z
            .object({
              id: z.string(),
              sender: z.string(),
              content: z.string(),
              timestamp: z.string(),
              status: z.string(),
              type: z.string(),
            })
            .passthrough(),
          unreadCount: z.number().optional(),
          isActive: z.boolean().optional(),
        }),
      )
      .optional(),
    activeConversation: z.any().optional(),
  })
  .passthrough()

const messagesPreviewSchema = z
  .object({
    messages: z
      .array(
        z.object({
          id: z.string(),
          sender: z.string(),
          subject: z.string().optional(),
          preview: z.string().optional(),
          time: z.string().optional(),
          unread: z.boolean().optional(),
        }),
      )
      .optional(),
  })
  .passthrough()

const analyticsSummarySchema = z
  .object({
    cards: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
          delta: z.string().optional(),
        }),
      )
      .optional(),
  })
  .passthrough()

const materialsUsageSchema = z
  .object({
    currentStock: z.number().optional(),
    dailyUsage: z.number().optional(),
    projectedRunoutDays: z.number().optional(),
    projectedRunoutDate: z.string().optional(),
    categories: z
      .array(
        z.object({
          name: z.string(),
          stock: z.number(),
          dailyUsage: z.number(),
        }),
      )
      .optional(),
    atRisk: z
      .array(
        z.object({
          name: z.string(),
          stock: z.number(),
          dailyUsage: z.number(),
          runoutDays: z.number(),
        }),
      )
      .optional(),
  })
  .passthrough()

const inboundWeekSchema = z
  .object({
    deliveries: z
      .array(
        z.object({
          date: z.string(),
          po: z.string().optional(),
          supplier: z.string().optional(),
          category: z.string().optional(),
          items: z.number().optional(),
          status: z.string().optional(),
        }),
      )
      .optional(),
  })
  .passthrough()

const overdueShipmentsSchema = z
  .object({
    items: z
      .array(
        z.object({
          po: z.string(),
          supplier: z.string(),
          category: z.string().optional(),
          eta: z.string().optional(),
          daysOverdue: z.number(),
        }),
      )
      .optional(),
  })
  .passthrough()

const supplierLeadSchema = z
  .object({
    suppliers: z
      .array(
        z.object({
          name: z.string(),
          avgDays: z.number(),
          onTimeRate: z.number().optional(),
        }),
      )
      .optional(),
  })
  .passthrough()

const tableGenericSchema = tableMalleableSchema
const tableOrdersSchema = tableMalleableSchema

const calendarSchema = z
  .object({
    events: z.array(z.object({ date: z.string(), title: z.string().optional() })).optional(),
  })
  .passthrough()

const calendarMiniSchema = z
  .object({
    month: z.string().optional(),
    days: z
      .array(
        z.object({
          date: z.number(),
          events: z.number().optional(),
          isToday: z.boolean().optional(),
        }),
      )
      .optional(),
  })
  .passthrough()

const capacityTrackerSchema = z
  .object({
    totalCapacity: z.number().optional(),
    usedCapacity: z.number().optional(),
    availableCapacity: z.number().optional(),
    teams: z
      .array(
        z.object({
          name: z.string(),
          capacity: z.number(),
          used: z.number(),
          color: z.string().optional(),
        }),
      )
      .optional(),
    overallUtilization: z.number().optional(),
  })
  .passthrough()

const notificationsPanelSchema = z
  .object({
    notifications: z
      .array(
        z.object({
          id: z.string().optional(),
          title: z.string(),
          body: z.string().optional(),
          time: z.string().optional(),
          status: z.string().optional(),
        }),
      )
      .optional(),
  })
  .passthrough()

const navBreadcrumbsSchema = z
  .object({
    items: z
      .array(
        z.object({
          id: z.string(),
          label: z.string(),
          href: z.string().optional(),
          isActive: z.boolean().optional(),
        }),
      )
      .optional(),
    showHome: z.boolean().optional(),
    separator: z.enum(["chevron", "slash"]).optional(),
  })
  .passthrough()

const navQuickSearchSchema = z
  .object({
    placeholder: z.string().optional(),
    recentSearches: z.array(z.string()).optional(),
    popularResults: z
      .array(
        z.object({
          id: z.string(),
          title: z.string(),
          type: z.string(),
          description: z.string().optional(),
          url: z.string().optional(),
          timestamp: z.string().optional(),
        }),
      )
      .optional(),
    showRecent: z.boolean().optional(),
  })
  .passthrough()

const filterPanelSchema = z
  .object({
    groups: z
      .array(
        z.object({
          id: z.string(),
          label: z.string(),
          type: z.enum(["select", "multiselect", "date", "range"]),
          options: z
            .array(
              z.object({
                id: z.string(),
                label: z.string(),
                count: z.number().optional(),
              }),
            )
            .optional(),
          value: z.union([z.string(), z.array(z.string())]).optional(),
          min: z.number().optional(),
          max: z.number().optional(),
        }),
      )
      .optional(),
    activeFilters: z
      .array(
        z.object({
          groupId: z.string(),
          value: z.union([z.string(), z.array(z.string())]),
        }),
      )
      .optional(),
    showClearAll: z.boolean().optional(),
  })
  .passthrough()

const toolbarActionsSchema = z
  .object({
    actions: z
      .array(
        z.object({
          id: z.string(),
          label: z.string(),
          icon: z.enum(["plus", "download", "upload", "refresh", "settings", "share", "archive", "trash", "edit", "copy", "more"]),
          variant: z.enum(["primary", "secondary", "outline", "ghost", "destructive"]).optional(),
          size: z.enum(["sm", "md", "lg"]).optional(),
          disabled: z.boolean().optional(),
          badge: z.union([z.string(), z.number()]).optional(),
        }),
      )
      .optional(),
    layout: z.enum(["horizontal", "vertical", "grid"]).optional(),
    alignment: z.enum(["left", "center", "right"]).optional(),
    showLabels: z.boolean().optional(),
  })
  .passthrough()

const statusBadgesSchema = z
  .object({
    badges: z
      .array(
        z.object({
          id: z.string(),
          label: z.string(),
          status: z.enum(["success", "warning", "error", "info", "pending", "active", "inactive", "high", "low", "neutral"]),
          count: z.number().optional(),
          description: z.string().optional(),
          trend: z.enum(["up", "down", "stable"]).optional(),
        }),
      )
      .optional(),
    layout: z.enum(["grid", "list", "horizontal"]).optional(),
    showCounts: z.boolean().optional(),
    showIcons: z.boolean().optional(),
    showTrends: z.boolean().optional(),
  })
  .passthrough()

const formBuilderSchema = z
  .object({
    elements: z
      .array(
        z.object({
          id: z.string(),
          type: z.enum(["input", "textarea", "select", "checkbox", "radio", "upload", "section", "step"]),
          label: z.string().optional(),
          placeholder: z.string().optional(),
          required: z.boolean().optional(),
          options: z.array(z.string()).optional(),
          value: z.any().optional(),
        }),
      )
      .optional(),
    submitLabel: z.string().optional(),
    description: z.string().optional(),
    isMultiStep: z.boolean().optional(),
    currentStep: z.number().optional(),
  })
  .passthrough()

const formInputSchema = z
  .object({
    label: z.string().optional(),
    placeholder: z.string().optional(),
    type: z.enum(["text", "email", "password", "number", "tel", "url"]).optional(),
    required: z.boolean().optional(),
    value: z.string().optional(),
    helpText: z.string().optional(),
  })
  .passthrough()

const formSelectSchema = z
  .object({
    label: z.string().optional(),
    placeholder: z.string().optional(),
    required: z.boolean().optional(),
    options: z.array(z.string()).optional(),
    value: z.string().optional(),
    helpText: z.string().optional(),
    multiple: z.boolean().optional(),
  })
  .passthrough()

const formTextareaSchema = z
  .object({
    label: z.string().optional(),
    placeholder: z.string().optional(),
    required: z.boolean().optional(),
    value: z.string().optional(),
    helpText: z.string().optional(),
    rows: z.number().optional(),
    maxLength: z.number().optional(),
  })
  .passthrough()

const formCheckboxSchema = z
  .object({
    label: z.string().optional(),
    required: z.boolean().optional(),
    checked: z.boolean().optional(),
    helpText: z.string().optional(),
    options: z.array(z.string()).optional(),
    type: z.enum(["single", "multiple"]).optional(),
  })
  .passthrough()

const formUploadSchema = z
  .object({
    label: z.string().optional(),
    required: z.boolean().optional(),
    helpText: z.string().optional(),
    accept: z.string().optional(),
    multiple: z.boolean().optional(),
    maxSize: z.number().optional(),
    maxFiles: z.number().optional(),
  })
  .passthrough()

const formSectionSchema = z
  .object({
    heading: z.string().optional(),
    description: z.string().optional(),
    divider: z.boolean().optional(),
    spacing: z.enum(["sm", "md", "lg"]).optional(),
  })
  .passthrough()

export const blockPropSchemas = {
  note: noteSchema,
  "metric.kpi": metricSchema,
  "metric.chart": metricSchema,
  "metric.items": metricSchema,
  "metric.sparkline": metricSparkSchema,
  "chart.line": chartLineSchema,
  "chart.bar": chartBarSchema,
  "chart.area": chartAreaSchema,
  "chart.donut": chartDonutSchema,
  "chart.scatter": chartScatterSchema,
  "chart.bar.utilization": chartBarSchema,
  "chart.line.forecast": chartLineSchema,
  "chart.area.cumulative": chartAreaSchema,
  "chart.donut.utilization": chartDonutSchema,
  "chart.scatter.capacity": chartScatterSchema,
  "table.malleable": tableMalleableSchema,
  "table.generic": tableGenericSchema,
  "table.orders": tableOrdersSchema,
  "table.items": tableItemsSchema,
  tabs: tabsSchema,
  "layout.container": layoutContainerSchema,
  "layout.split": layoutSplitSchema,
  "layout.stack": layoutStackSchema,
  "layout.grid": layoutGridSchema,
  "activity.timeline": activityTimelineSchema,
  "commands.quick": commandsQuickSchema,
  "messages.panel": messagesPanelSchema,
  "messages.preview": messagesPreviewSchema,
  "analytics.summary": analyticsSummarySchema,
  "materials.usage": materialsUsageSchema,
  "materials.inbound.week": inboundWeekSchema,
  "materials.overdue": overdueShipmentsSchema,
  "materials.supplier.leadtime": supplierLeadSchema,
  "calendar": calendarSchema,
  "calendar.mini": calendarMiniSchema,
  "capacity.tracker": capacityTrackerSchema,
  "notifications.panel": notificationsPanelSchema,
  "nav.breadcrumbs": navBreadcrumbsSchema,
  "nav.quicksearch": navQuickSearchSchema,
  "filter.panel": filterPanelSchema,
  "toolbar.actions": toolbarActionsSchema,
  "status.badges": statusBadgesSchema,
  "form.builder": formBuilderSchema,
  "form.input": formInputSchema,
  "form.select": formSelectSchema,
  "form.textarea": formTextareaSchema,
  "form.checkbox": formCheckboxSchema,
  "form.upload": formUploadSchema,
  "form.section": formSectionSchema,
} as const

export type BlockPropsSchemas = typeof blockPropSchemas
