import type { BlockConfig } from "@/lib/grid-v2/types"
import type { Block as LegacyBlock } from "@/lib/useGridSystem"
import TableOrders from "@/components/blocks/TableOrders"
import TableGeneric from "@/components/blocks/TableGeneric"
import MetricKPI from "@/components/blocks/MetricKPI"
import { MetricChart } from "@/components/blocks/MetricChart"
import ChartLine from "@/components/blocks/ChartLine"
import ChartBar from "@/components/blocks/ChartBar"
import ChartArea from "@/components/blocks/ChartArea"
import ChartDonut from "@/components/blocks/ChartDonut"
import { ChartAreaInteractive } from "@/components/blocks/ChartAreaInteractive"
import { TableMalleable } from "@/components/blocks/TableMalleable"
import TableItems from "@/components/blocks/TableItems"
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
import { TabsBlock } from "@/components/blocks/TabsBlock"
import { LayoutContainer } from "@/components/blocks/LayoutContainer"
import { LayoutSplit } from "@/components/blocks/LayoutSplit"
import { LayoutStack } from "@/components/blocks/LayoutStack"
import { LayoutGridBlock } from "@/components/blocks/LayoutGridBlock"
// Navigation components
import NavBreadcrumbs from "@/components/blocks/NavBreadcrumbs"
import NavQuickSearch from "@/components/blocks/NavQuickSearch"
import FilterPanel from "@/components/blocks/FilterPanel"
import ToolbarActions from "@/components/blocks/ToolbarActions"
import StatusBadges from "@/components/blocks/StatusBadges"
// Form components
import FormBuilder from "@/components/blocks/FormBuilder"
import FormInput from "@/components/blocks/FormInput"
import FormSelect from "@/components/blocks/FormSelect"
import FormTextarea from "@/components/blocks/FormTextarea"
import FormCheckbox from "@/components/blocks/FormCheckbox"
import FormUpload from "@/components/blocks/FormUpload"
import FormSection from "@/components/blocks/FormSection"
// Teams & People blocks
import TeamPerformanceLeaderboard from "@/components/blocks/TeamPerformanceLeaderboard"
import TopPerformersList from "@/components/blocks/TopPerformersList"
import DeviceFleetStatus from "@/components/blocks/DeviceFleetStatus"
import TeamsActivityFeed from "@/components/blocks/TeamsActivityFeed"
import TeamsTable from "@/components/blocks/TeamsTable"
import PeopleTable from "@/components/blocks/PeopleTable"
// Construction/Worksite components
import SiteMapBlock from "@/components/blocks/SiteMapBlock"
import DeliveryCalendar from "@/components/blocks/DeliveryCalendar"
import ScanActivityTimeline from "@/components/blocks/ScanActivityTimeline"
import MaterialStockGrid from "@/components/blocks/MaterialStockGrid"
import WorksiteMetric from "@/components/blocks/WorksiteMetric"
// New construction components
import LargeMetricCard from "@/components/blocks/construction/LargeMetricCard"
import MaterialProgressCard from "@/components/blocks/construction/MaterialProgressCard"
import ZoneStatusGrid from "@/components/blocks/construction/ZoneStatusGrid"
import InstallationDotMatrix from "@/components/blocks/construction/InstallationDotMatrix"
import DeliveryTimelineCard from "@/components/blocks/construction/DeliveryTimelineCard"
import SiteMapGrid from "@/components/blocks/construction/SiteMapGrid"
// Items-specific components
import ComprehensiveItemsTable from "@/components/blocks/items/ComprehensiveItemsTable"
import { ItemCodesTableV2 } from "@/components/blocks/items/ItemCodesTableV2"
import WorkflowOverview from "@/components/blocks/items/WorkflowOverview"
import ItemActivityTimeline from "@/components/blocks/items/ItemActivityTimeline"
// AI Playground components
import { AIInputBlock } from "@/components/blocks/AIInputBlock"
// Site Map components
import { MachineBlock } from "@/components/blocks/site/MachineBlock"
import { StorageBlock } from "@/components/blocks/site/StorageBlock"
import { ZoneBlock } from "@/components/blocks/site/ZoneBlock"
import { ProductionLineBlock } from "@/components/blocks/site/ProductionLineBlock"
import { StationBlock } from "@/components/blocks/site/StationBlock"
import { EquipmentBlock } from "@/components/blocks/site/EquipmentBlock"

interface BlockRendererProps {
  block: BlockConfig
  showFilters?: boolean
  isEditing?: boolean
}

export default function BlockRenderer({ block, showFilters = false, isEditing = false }: BlockRendererProps) {
  const legacyBlock = block as unknown as LegacyBlock

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
      return <TableOrders block={legacyBlock} />
    case "table.generic":
      return <TableGeneric block={legacyBlock} isEditing={isEditing} />
    case "metric.kpi":
      return <MetricKPI title={block.title} data={block.props} variant="kpi" />
    case "metric.chart":
      return <MetricKPI title={block.title} data={block.props} variant="chart" />
    case "metric.items":
      return <MetricKPI title={block.title} data={block.props} variant="items" />
    case "metric.sparkline":
      return (
        <MetricChart
          title={block.title || "Metric"}
          value={(block.props as any)?.value ?? "0"}
          trend={(block.props as any)?.trend ?? ""}
          trendDirection={(block.props as any)?.trendDirection ?? "neutral"}
          description={(block.props as any)?.description}
        />
      )
    case "chart.line":
    case "chart.line.forecast":
      return <ChartLine block={block} />
    case "chart.bar":
    case "chart.bar.utilization":
      return <ChartBar block={block} />
    case "chart.area":
    case "chart.area.cumulative":
      return <ChartArea block={block} />
    case "chart.donut":
    case "chart.donut.utilization":
      return <ChartDonut block={block} />
    case "chart.area.interactive":
      return <ChartAreaInteractive data={block.props} />
    case "chart.scatter":
    case "chart.scatter.capacity":
      return <ChartScatter data={block.props} />
    case "table.malleable":
      const tableData = normalizeTableData(block.props)
      return (
        <TableMalleable
          title={block.title}
          source={(block.props as any)?.source}
          columns={tableData.columns}
          data={tableData.data}
          showFilters={showFilters}
          density={(block.props as any)?.density}
          editable={(block.props as any)?.editable ?? isEditing}
        />
      )
    case "table.items":
      return (
        <TableItems
          items={(block.props as any)?.items}
          showColumnCustomization={(block.props as any)?.showColumnCustomization ?? true}
        />
      )
    
    case "table.teams":
      return (
        <TeamsTable
          teams={(block.props as any)?.teams || []}
          people={(block.props as any)?.people || []}
          showActions={(block.props as any)?.showActions ?? true}
        />
      )
    
    case "table.people":
      return (
        <PeopleTable
          people={(block.props as any)?.people || []}
          showActions={(block.props as any)?.showActions ?? true}
        />
      )
    
    case "teams.leaderboard":
      return (
        <TeamPerformanceLeaderboard
          teams={(block.props as any)?.teams || []}
          limit={(block.props as any)?.limit ?? 5}
        />
      )
    
    case "teams.top-performers":
      return (
        <TopPerformersList
          people={(block.props as any)?.people || []}
          limit={(block.props as any)?.limit ?? 8}
        />
      )
    
    case "teams.devices":
      return (
        <DeviceFleetStatus
          devices={(block.props as any)?.devices || []}
        />
      )
    
    case "teams.activity":
      return (
        <TeamsActivityFeed
          people={(block.props as any)?.people || []}
          devices={(block.props as any)?.devices || []}
          limit={(block.props as any)?.limit ?? 12}
        />
      )
    case "layout.container": {
      const props = block.props as any
      return (
        <LayoutContainer
          title={block.title || props?.title}
          description={props?.description}
          padding={props?.padding}
          background={props?.background}
          border={props?.border}
          slots={block.slots}
          onSlotClick={props?.onSlotClick}
          isEditMode={props?.isEditMode}
          renderSlot={(slotId, child) => (
            <BlockRenderer
              key={`${block.id}-${slotId}`}
              block={{ ...child, props: { ...child.props } }}
              showFilters={showFilters}
              isEditing={isEditing}
            />
          )}
        />
      )
    }
    case "layout.split": {
      const props = block.props as any
      return (
        <LayoutSplit
          direction={props?.direction}
          ratio={props?.ratio}
          primaryTitle={props?.primaryTitle}
          secondaryTitle={props?.secondaryTitle}
          slots={block.slots}
          onSlotClick={props?.onSlotClick}
          isEditMode={props?.isEditMode}
          renderSlot={(_, child) => (
            <BlockRenderer
              block={{ ...child, props: { ...child.props } }}
              showFilters={showFilters}
              isEditing={isEditing}
            />
          )}
        />
      )
    }
    case "layout.stack": {
      const props = block.props as any
      return (
        <LayoutStack
          direction={props?.direction}
          gap={props?.gap}
          sections={props?.sections}
          slots={block.slots}
          onSlotClick={props?.onSlotClick}
          isEditMode={props?.isEditMode}
          renderSlot={(slotId, child) => (
            <BlockRenderer
              key={`${block.id}-${slotId}`}
              block={{ ...child, props: { ...child.props } }}
              showFilters={showFilters}
              isEditing={isEditing}
            />
          )}
        />
      )
    }
    case "layout.grid": {
      const props = block.props as any
      return (
        <LayoutGridBlock
          columns={props?.columns}
          gap={props?.gap}
          areas={props?.areas}
          slots={block.slots}
          onSlotClick={props?.onSlotClick}
          isEditMode={props?.isEditMode}
          renderSlot={(slotId, child) => (
            <BlockRenderer
              key={`${block.id}-${slotId}`}
              block={{ ...child, props: { ...child.props } }}
              showFilters={showFilters}
              isEditing={isEditing}
            />
          )}
        />
      )
    }
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
      return <MessagesPreview block={legacyBlock} />
    case "commands.quick":
      return <CommandsQuick block={legacyBlock} />
    case "kanban.simple":
      return <KanbanSimple block={legacyBlock} />
    case "tabs":
      return <TabsBlock title={block.title} data={block.props} />
    case "nav.breadcrumbs":
      return <NavBreadcrumbs title={block.title} data={block.props} />
    case "nav.quicksearch":
      return <NavQuickSearch title={block.title} data={block.props} />
    case "filter.panel":
      return <FilterPanel title={block.title} data={block.props} />
    case "toolbar.actions":
      return <ToolbarActions title={block.title} data={block.props} />
    case "status.badges":
      return <StatusBadges title={block.title} data={block.props} />
    case "form.builder": {
      const props = block.props as any
      return (
        <FormBuilder
          title={block.title || props?.title}
          data={block.props}
          slots={block.slots}
          onSlotClick={props?.onSlotClick}
          isEditMode={props?.isEditMode}
          renderSlot={(slotId, child) => (
            <BlockRenderer
              key={`${block.id}-${slotId}`}
              block={{ ...child, props: { ...child.props } }}
              showFilters={showFilters}
            />
          )}
        />
      )
    }
    case "form.input":
      return <FormInput title={block.title} data={block.props} />
    case "form.select":
      return <FormSelect title={block.title} data={block.props} />
    case "form.textarea":
      return <FormTextarea title={block.title} data={block.props} />
    case "form.checkbox":
      return <FormCheckbox title={block.title} data={block.props} />
    case "form.upload":
      return <FormUpload title={block.title} data={block.props} />
    case "form.section":
      return <FormSection title={block.title} data={block.props} />
    // Construction/Worksite components
    case "worksite.sitemap":
      return <SiteMapBlock zones={block.props?.zones} />
    case "worksite.delivery.calendar":
      return <DeliveryCalendar {...block.props} />
    case "worksite.scan.timeline":
      return <ScanActivityTimeline activities={block.props?.activities} />
    case "worksite.stock.grid":
      return <MaterialStockGrid items={block.props?.items} />
    case "worksite.metric":
      return <WorksiteMetric title={block.title} data={block.props} />
    // New construction components
    case "construction.metric.large":
      return <LargeMetricCard title={block.title} data={block.props} />
    case "construction.material.progress":
      return <MaterialProgressCard title={block.title} data={block.props} />
    case "construction.zone.status":
      return <ZoneStatusGrid title={block.title} data={block.props} />
    case "construction.site.map":
      return <SiteMapGrid title={block.title} data={block.props} />
    case "construction.installation.dots":
      return <InstallationDotMatrix title={block.title} data={block.props} />
    case "construction.delivery.timeline":
      return <DeliveryTimelineCard title={block.title} data={block.props} />
    // Items-specific components
    case "items.table.comprehensive":
      return <ComprehensiveItemsTable title={block.title} {...block.props} />
    case "items.itemcodes.table":
      return <ItemCodesTableV2 block={block} />
    case "items.workflow.overview":
      return <WorkflowOverview title={block.title} {...block.props} />
    case "items.activity.timeline":
      return <ItemActivityTimeline title={block.title} {...block.props} />
    // AI Playground components
    case "ai.input":
      return (
        <AIInputBlock 
          onGenerate={block.props?.onGenerate}
          onPromptChange={block.props?.onPromptChange}
        />
      )
    // V3 Components
    case "v3.chart.area":
      const ChartAreaV3 = require("@/components/blocks/v3/ChartArea").default
      return <ChartAreaV3 title={block.title} data={block.props?.data} />
    case "v3.chart.bar":
      const ChartBarV3 = require("@/components/blocks/v3/ChartBar").default
      return <ChartBarV3 title={block.title} data={block.props?.data} />
    case "v3.chart.donut":
      const ChartDonutV3 = require("@/components/blocks/v3/ChartDonut").default
      return <ChartDonutV3 title={block.title} data={block.props?.data} />
    case "v3.activity.timeline":
      const ActivityTimelineV3 = require("@/components/blocks/v3/ActivityTimeline").default
      return <ActivityTimelineV3 title={block.title} activities={block.props?.activities} />
    case "v3.table":
      const DataTableV3 = require("@/components/blocks/v3/DataTable").default
      return <DataTableV3 title={block.title} columns={block.props?.columns} rows={block.props?.rows} />
    case "v3.kpi":
      const KPICardV3 = require("@/components/blocks/v3/KPICard").default
      return <KPICardV3 title={block.props?.title} value={block.props?.value} change={block.props?.change} trend={block.props?.trend} subtitle={block.props?.subtitle} />
    case "v3.status.grid":
      const StatusGridV3 = require("@/components/blocks/v3/StatusGrid").default
      return <StatusGridV3 title={block.title} items={block.props?.items} />
    case "v3.progress.tracker":
      const ProgressTrackerV3 = require("@/components/blocks/v3/ProgressTracker").default
      return <ProgressTrackerV3 title={block.title} tasks={block.props?.tasks} />
    case "v3.map.site":
      const MapSiteV3 = require("@/components/blocks/v3/MapSite").default
      return <MapSiteV3 title={block.title} zones={block.props?.zones} backgroundImage={block.props?.backgroundImage} />
    case "v3.heatmap":
      const HeatmapV3 = require("@/components/blocks/v3/Heatmap").default
      return <HeatmapV3 title={block.title} data={block.props?.data} rows={block.props?.rows} cols={block.props?.cols} />
    case "v3.grid.pulse":
      const GridPulseV3 = require("@/components/blocks/v3/GridPulse").default
      return <GridPulseV3 title={block.title} rows={block.props?.rows} cols={block.props?.cols} data={block.props?.data} />
    case "v3.kanban":
      const KanbanV3 = require("@/components/blocks/v3/Kanban").default
      return <KanbanV3 title={block.title} columns={block.props?.columns} />
    case "v3.calendar.heatmap":
      const CalendarHeatmapV3 = require("@/components/blocks/v3/CalendarHeatmap").default
      return <CalendarHeatmapV3 title={block.title} data={block.props?.data} months={block.props?.months} />
    case "v3.counter.animated":
      const CounterAnimatedV3 = require("@/components/blocks/v3/CounterAnimated").default
      return <CounterAnimatedV3 title={block.title} value={block.props?.value} previousValue={block.props?.previousValue} 
              prefix={block.props?.prefix} suffix={block.props?.suffix} subtitle={block.props?.subtitle} 
              trend={block.props?.trend} sparklineData={block.props?.sparklineData} />
    case "v3.chart.sankey":
      const ChartSankeyV3 = require("@/components/blocks/v3/ChartSankey").default
      return <ChartSankeyV3 title={block.title} nodes={block.props?.nodes} links={block.props?.links} />
    case "v3.chart.radar":
      const ChartRadarV3 = require("@/components/blocks/v3/ChartRadar").default
      return <ChartRadarV3 title={block.title} datasets={block.props?.datasets} maxValue={block.props?.maxValue} />
    case "v3.graph.network":
      const GraphNetworkV3 = require("@/components/blocks/v3/GraphNetwork").default
      return <GraphNetworkV3 title={block.title} nodes={block.props?.nodes} edges={block.props?.edges} />
    case "v3.cards.3d":
      const Cards3DV3 = require("@/components/blocks/v3/Cards3D").default
      return <Cards3DV3 title={block.title} cards={block.props?.cards} />
    case "v3.chart.sparkline":
      const ChartSparklineV3 = require("@/components/blocks/v3/ChartSparkline").default
      return <ChartSparklineV3 title={block.title} data={block.props?.data} color={block.props?.color} 
              showValue={block.props?.showValue} showTrend={block.props?.showTrend} height={block.props?.height} />
    case "v3.chart.wave":
      const ChartWaveV3 = require("@/components/blocks/v3/ChartWave").default
      return <ChartWaveV3 title={block.title} data={block.props?.data} color={block.props?.color} 
              maxPoints={block.props?.maxPoints} updateInterval={block.props?.updateInterval} />
    // Site Map components
    case "site.machine":
      return <MachineBlock block={block} />
    case "site.storage":
      return <StorageBlock block={block} />
    case "site.zone":
      return <ZoneBlock block={block} />
    case "site.production-line":
      return <ProductionLineBlock block={block} />
    case "site.station":
      return <StationBlock block={block} />
    case "site.equipment":
      return <EquipmentBlock block={block} />
    default:
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Unknown block type: {block.type}
        </div>
      )
  }
}
