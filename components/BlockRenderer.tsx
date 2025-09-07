import React from "react"
import { Block } from "@/lib/useGridSystem"
import TableOrders from "@/components/blocks/TableOrders"
import TableGeneric from "@/components/blocks/TableGeneric"
import MetricKPI from "@/components/blocks/MetricKPI"
import ChartLine from "@/components/blocks/ChartLine"
import ChartBar from "@/components/blocks/ChartBar"
import ChartArea from "@/components/blocks/ChartArea"
import ChartDonut from "@/components/blocks/ChartDonut"
import { ChartAreaInteractive } from "@/components/blocks/ChartAreaInteractive"
import { TableMalleable } from "@/components/blocks/TableMalleable"
import { CalendarBlock } from "@/components/blocks/CalendarBlock"
import ActivityTimeline from "@/components/blocks/ActivityTimeline"
import MessagesPreview from "@/components/blocks/MessagesPreview"
import CommandsQuick from "@/components/blocks/CommandsQuick"
import KanbanSimple from "@/components/blocks/KanbanSimple"
import CalendarMini from "@/components/blocks/CalendarMini"
import ChartScatter from "@/components/blocks/ChartScatter"
import MessagesPanel from "@/components/blocks/MessagesPanel"
import CapacityTracker from "@/components/blocks/CapacityTracker"
import NotificationsPanel from "@/components/blocks/NotificationsPanel"
import AnalyticsSummary from "@/components/blocks/AnalyticsSummary"
// Materials-specific blocks
import InboundWeek from "@/components/blocks/InboundWeek"
import MaterialsUsage from "@/components/blocks/MaterialsUsage"
import OverdueShipments from "@/components/blocks/OverdueShipments"
import SupplierLeadTimes from "@/components/blocks/SupplierLeadTimes"
// Content blocks
import NoteBlock from "@/components/blocks/NoteBlock"

interface BlockRendererProps {
  block: Block
  showFilters?: boolean
}

export default function BlockRenderer({ block, showFilters = false }: BlockRendererProps) {
  // Helper function to normalize data for TableMalleable
  const normalizeTableData = (props: any) => {
    if (!props) return { columns: [], data: [] }
    
    // If props has columns and data, use them directly
    if (props.columns && props.data) {
      return {
        columns: Array.isArray(props.columns) ? props.columns : [],
        data: Array.isArray(props.data) ? props.data : []
      }
    }
    
    // If props has columns and rows, convert rows to data
    if (props.columns && props.rows) {
      const columns = Array.isArray(props.columns) ? props.columns : []
      const rows = Array.isArray(props.rows) ? props.rows : []
      
      // Convert simple column names to column objects if needed
      const normalizedColumns = columns.map((col: any, index: number) => {
        if (typeof col === 'string') {
          return { id: `col-${index}`, name: col, type: 'text' as const }
        }
        return col
      })
      
      // Convert row arrays to objects
      const normalizedData = rows.map((row: any, index: number) => {
        if (Array.isArray(row)) {
          const obj: any = { id: `row-${index}` }
          normalizedColumns.forEach((col: any, colIndex: number) => {
            obj[col.id] = row[colIndex] || ''
          })
          return obj
        }
        return row
      })
      
      return { columns: normalizedColumns, data: normalizedData }
    }
    
    return { columns: [], data: [] }
  }

  switch (block.type) {
    case "table.orders":
      return <TableOrders block={block} />
    case "table.generic":
      return <TableGeneric block={block} />
    case "metric.kpi":
      return <MetricKPI title={block.title} data={block.props} />
    case "metric.chart":
      return <MetricKPI title={block.title} data={block.props} />
    case "metric.items":
      return <MetricKPI title={block.title} data={block.props} />
    case "chart.line":
      return <ChartLine block={block} />
    case "chart.bar":
      return <ChartBar block={block} />
    case "chart.area":
      return <ChartArea block={block} />
    case "chart.donut":
      return <ChartDonut block={block} />
    case "chart.area.interactive":
      return <ChartAreaInteractive data={block.props} />
    case "chart.scatter":
      return <ChartScatter data={block.props} />
    case "table.malleable":
      const tableData = normalizeTableData(block.props)
      return (
        <TableMalleable
          title={block.title}
          columns={tableData.columns}
          data={tableData.data}
          showFilters={showFilters}
          hideTitle
        />
      )
    case "messages.panel":
      return <MessagesPanel title={block.title} data={block.props} />
    case "capacity.tracker":
      return <CapacityTracker title={block.title} data={block.props} />
    case "notifications.panel":
      return <NotificationsPanel title={block.title} data={block.props} />
    case "analytics.summary":
      return <AnalyticsSummary title={block.title} data={block.props} />
    case "note":
      return <NoteBlock title={block.title} data={block.props} hideTitle />
    case "calendar":
      return <CalendarBlock title={block.title} {...(block.props || {})} />
    case "calendar.mini":
      return <CalendarMini title={block.title} data={block.props} />
    // Materials domain
    case "materials.inbound.week":
      return <InboundWeek title={block.title} data={block.props} hideTitle />
    case "materials.usage":
      return <MaterialsUsage title={block.title} data={block.props} hideTitle />
    case "materials.overdue":
      return <OverdueShipments title={block.title} data={block.props} hideTitle />
    case "materials.supplier.leadtime":
      return <SupplierLeadTimes title={block.title} data={block.props} hideTitle />
    case "activity.timeline":
      return <ActivityTimeline title={block.title} data={block.props} />
    case "messages.preview":
      return <MessagesPreview block={block} />
    case "commands.quick":
      return <CommandsQuick block={block} />
    case "kanban.simple":
      return <KanbanSimple block={block} />
    default:
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Unknown block type: {block.type}
        </div>
      )
  }
}
