# Quick Edit Controls Plan — 24/09/25 12:45

## Objectives
- Consolidate block chrome actions into a consistent control panel without redundant icons.
- Provide an inline quick-edit surface for common tweaks (variant swap, timeframe, density, data source binding) before opening the full Block Edit modal.
- Support future AI/onboarding flows by ensuring quick edits rely on registry metadata (variants, controls, schemas).

## Control Panel Layout
- Buttons: Toggle Size (`CollapseIcon`), Quick Edit (main entry point), Notifications (optional/placeholder), AI Assistant (optional), Extend, Delete.
- Remove legacy expand icon; reuse the existing collapse toggle and style it consistently with other buttons.
- Quick Edit button opens a popover aligned to the block header.

## Quick Edit Popover
- Sections determined by `definition.controls`:
  - `variant`: show registry `variants` as pill buttons with icons; selecting swaps the block type via `updateBlock`.
  - `timeRange`: standard presets (7d/14d/30d); updates props (validated via schema).
  - `density` / `columns`: for tables, allow toggling compact view or adding/removing columns using registry metadata (`defaultProps`, schema info).
  - `datasource`: anchors to separate Data Source modal trigger.
- Include “Open Full Editor” link to launch `BlockEditModal`.
- Use `Command`/popover components for future keyboard shortcuts.

## Data Source Selector (stub UI)
- New icon on control panel (database glyph).
- Clicking opens a modal with a sidebar listing mock data sources (e.g., `orders`, `items`, `suppliers`).
- Selecting a table shows columns + preview; choosing applies a prop like `{ source: { type: 'mock', table: 'orders' } }` validated by schema.
- For now, wiring can stay in-memory; later it will integrate with DataProvider.

## Registry Support
- Extend block definitions with `controls` metadata (e.g., `['variant', 'timeRange']`).
- Additional schema refinements for new props (`source`, `density`, etc.).
- Expand registry coverage to blocks still missing entries (tabs, filter.items, workflow cards), and add domain tags (construction, fashion, defense) for onboarding mapping.

## Additional Block Families to Consider
- **Workflow Blocks**: Stage progress, DAG summary, rule triggers.
- **Financial Blocks**: Revenue trend, cost breakdown, margin KPIs.
- **Compliance/Safety**: Incident counters, audit timeline, checklists.
- **Field Ops**: Geo map pins, crew roster, equipment availability.
- **AI Insights**: Narrative summary card, anomaly detector, recommendations list.

## Implementation Notes (24/09/25 13:05)
- Registry definitions advertise `controls` arrays and richer defaults; `QuickEditControls` renders popovers for variants, time range, density, column helpers, and mock data-source binding.
- `GridCard` exposes a customizable control slot, and the v2 `/app/v2` route wires quick edits via `replaceBlockType`, `updateBlock`, and schema validation.
- Data-source picker now applies table-specific mock datasets via `getMockPropsForSource`, while persisting the selected source for future DataProvider integration.

## Remaining Enhancements
- Extend quick edits beyond tables/charts (e.g., calendar range, capacity thresholds).
- Persist quick-edit preferences per role/page via registry metadata.
- Implement dedicated UI variants (e.g., distinct metric/chart components) so variant swaps deliver visible changes.
- Once real data sources exist, swap the mock selector for provider-driven lists.

## Implementation Update (24/09/25 15:47)
- `QuickEditControls` now launches a dedicated Data Source Browser modal that lists catalogued tables by domain, while the inline popover retains fast presets and a clear action.
- Data bindings call the registry helper `setBlockProps`, cloning mock datasets and preserving density/time-range selections so blocks refresh correctly when toggling between sources.
- Metric blocks respond to variant swaps (`metric.kpi`, `metric.chart`, `metric.items`) with tailored chrome and chip styling, clarifying quick-edit feedback.
- `TableMalleable` honours the `density` prop to shrink row height/text when the compact toggle is used.
- Added documentation + TODO hooks for refactoring `BlockEditModal` into the planned stepper so the control bar icons open the richer editor.

## Implementation Update (24/09/25 16:25)
- Introduced a v2-specific `BlockEditModal` that follows the Type → Data → Presentation stepper, sourcing block metadata directly from the registry and previewing changes live.
- Modal consumes the new `DataProvider` context/hook to enumerate mock catalog sources today, paving the way for real providers later.
- Applying changes now swaps block types via `setBlockConfig`, so chart/table conversions respect default sizing and schema validation.
- Expanded the registry with additional chart, metric, and table variants so quick-edit + modal menus have richer coverage out of the box.
- Step 1 now includes a category sidebar to keep the growing block catalog navigable as we scale toward dozens of block families.

*Drafted 24/09/25 12:45.*
