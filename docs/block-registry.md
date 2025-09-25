# Block Registry — 24/09/25 12:14

## Purpose
Centralize block metadata (labels, categories, default sizing/props) so every grid surface can render, catalog, and generate blocks consistently. This registry powers the v2 grid engine and will feed onboarding flows when they scaffold pages automatically.

## Location
- Types: `lib/block-registry/types.ts`
- Schemas: `lib/block-registry/schemas.ts`
- Definitions: `lib/block-registry/definitions.ts`
- Helpers: `lib/block-registry/index.ts`

## Definition Shape
```ts
interface BlockDefinition {
  type: BlockType
  label: string
  category: BlockCategory
  description?: string
  defaultSize?: { w: number; h: number }
  defaultTitle?: string
  defaultProps?: BlockConfig['props']
  icon?: string
  schema?: ZodTypeAny
  variants?: BlockType[]
  controls?: string[]
}
```

Helper functions:
- `getBlockDefinition(type)` → returns metadata (or `undefined`).
- `listBlockDefinitions()` → ordered array for palettes/catalogs.
- `defaultBlockSize(type)` → returns size token, falls back to `{ w: 6, h: 8 }`.
- `createBlockConfig(type, overrides?)` → merges registry defaults with overrides and validates via the Zod schema.
- `getBlockVariants(type)` → variant list for quick-edit swapping.

## Current Coverage (24/09/25 16:35)
| Type | Label | Category | Default Size |
| --- | --- | --- | --- |
| `note` | AI Prompt | content | 4x4 |
| `metric.kpi` | KPI | metrics | 3x4 |
| `metric.chart` | Metric Chart | metrics | 3x4 |
| `metric.items` | Inventory Metric | metrics | 3x4 |
| `metric.sparkline` | Trend Metric | metrics | 3x4 |
| `chart.line` | Line Chart | charts | 6x8 |
| `chart.line.forecast` | Line • Forecast | charts | 6x8 |
| `chart.bar` | Bar Chart | charts | 6x8 |
| `chart.bar.utilization` | Bar • Utilization | charts | 6x8 |
| `chart.area` | Area Chart | charts | 6x8 |
| `chart.area.cumulative` | Area • Cumulative | charts | 6x8 |
| `chart.donut` | Donut Chart | charts | 4x6 |
| `chart.donut.utilization` | Donut • Allocation | charts | 4x6 |
| `chart.scatter` | Scatter Plot | charts | 6x8 |
| `chart.scatter.capacity` | Scatter • Capacity | charts | 6x8 |
| `chart.area.interactive` | Interactive Area | charts | 6x9 |
| `table.malleable` | Data Table | tables | 8x10 |
| `table.generic` | Generic Table | tables | 8x8 |
| `table.orders` | Orders Table | tables | 8x8 |
| `table.items` | Items Table | tables | 10x10 |
| `layout.container` | Container | layout | 8x8 |
| `layout.split` | Split View | layout | 10x9 |
| `layout.stack` | Stack | layout | 8x9 |
| `layout.grid` | Nested Grid | layout | 10x9 |
| `activity.timeline` | Activity Timeline | activity | 4x8 |
| `calendar` | Calendar | system | 4x8 |
| `calendar.mini` | Mini Calendar | system | 3x6 |
| `messages.preview` | Messages Preview | messages | 4x6 |
| `messages.panel` | Message Panel | messages | 4x8 |
| `analytics.summary` | Analytics Summary | metrics | 4x8 |
| `capacity.tracker` | Capacity Tracker | metrics | 4x8 |
| `notifications.panel` | Notifications | system | 3x6 |
| `commands.quick` | Quick Commands | system | 4x4 |
| `kanban.simple` | Kanban Board | system | 6x8 |
| `tabs` | Tabbed Container | system | 6x6 |
| `filter.items` | Items Filter | system | 3x6 |
| `materials.usage` | Materials Usage | materials | 6x10 |
| `materials.inbound.week` | Inbound Week | materials | 4x8 |
| `materials.overdue` | Overdue Shipments | materials | 4x8 |
| `materials.supplier.leadtime` | Supplier Lead Times | materials | 4x8 |

Each definition includes human-readable labels, optional default props, and category tags for future palettes.

## Runtime Usage (v2 grid)
- `useGrid` calls `createBlockConfig` in `addBlock` / `extendBlock` / `updateBlock` so new blocks inherit defaults, pass schema validation, and keep layout sizing in sync.
- `/app/v2/page.tsx` uses `createBlockConfig('note')` for the default AI prompt block when adding new components.
- `components/grid-v2/QuickEditControls.tsx` reads `variants`/`controls` metadata to deliver inline quick edits (variant swap, time range, density, datasource) before opening the full modal.
- Future pages should call `createBlockConfig` whenever seeding blocks, ensuring uniform styling, validation, and metadata.
- Selecting a mock data source in the quick-edit panel pipes through `getMockPropsForSource`, applying sample datasets per block type so blocks update immediately while we build out real data providers.
- Data-source catalog browser (24/09/25 15:47) reuses the registry helpers (`setBlockProps`, `getMockPropsForSource`) to clone datasets, persist preserved props (density/timeRange), and keep the block metadata aligned with the selected binding.
- The v2 `BlockEditModal` (24/09/25 16:25) uses `listBlockDefinitions()` and `createBlockConfig()` to drive its stepper UI, ensuring apply/save actions hydrate blocks with validated defaults and appropriate sizing.
- Layout primitives (`layout.container`, `layout.split`, `layout.stack`, `layout.grid`) now render via dedicated components so onboarding can compose nested dashboards without bespoke wrappers.
- Layout/form slots honor registry metadata—`BlockRenderer` passes `renderSlot` helpers so nested blocks persist through quick edits and data-source swaps. (25/09/25 13:21)

## Next Steps
- Hook quick-edit controls into `variants`/`controls` metadata so users can swap chart styles or tweak key props without opening the full modal.
- Surface `listBlockDefinitions()` in a dev-only palette so page authors can drag from the catalog.
- Drive `BlockEditModal` from registry schemas to auto-render prop forms in the future.

*Documented 24/09/25 12:14.*
