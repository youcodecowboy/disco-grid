export type GridCoordinates = {
  x: number
  y: number
  w: number
  h: number
  i: string
}

export type BlockType =
  | "empty"
  | "note"
  | "table"
  | "table.orders"
  | "table.generic"
  | "table.malleable"
  | "metric"
  | "metric.kpi"
  | "metric.chart"
  | "metric.items"
  | "metric.sparkline"
  | "chart.line"
  | "chart.bar"
  | "chart.area"
  | "chart.donut"
  | "chart.area.interactive"
  | "chart.scatter"
  | "chart.bar.utilization"
  | "chart.line.forecast"
  | "chart.area.cumulative"
  | "chart.donut.utilization"
  | "chart.scatter.capacity"
  | "calendar"
  | "calendar.mini"
  | "activity.timeline"
  | "messages.preview"
  | "messages.panel"
  | "commands.quick"
  | "kanban.simple"
  | "capacity.tracker"
  | "notifications.panel"
  | "analytics.summary"
  | "materials.inbound.week"
  | "materials.usage"
  | "materials.overdue"
  | "materials.supplier.leadtime"
  | "tabs"
  | "filter.items"
  | "table.items"
  | "layout.container"
  | "layout.split"
  | "layout.stack"
  | "layout.grid"
  | "nav.breadcrumbs"
  | "nav.quicksearch"
  | "filter.panel"
  | "toolbar.actions"
  | "status.badges"
  // Form components
  | "form.builder"
  | "form.input"
  | "form.select"
  | "form.textarea"
  | "form.checkbox"
  | "form.upload"
  | "form.section"

export type BlockConfig = {
  id: string
  type: BlockType
  title?: string
  props?: Record<string, any>
  extensions?: BlockConfig[]
  slots?: Record<string, BlockConfig | null>
}

export type GridState = {
  mode: "edit" | "save"
  layout: GridCoordinates[]
  blocks: Record<string, BlockConfig>
}
