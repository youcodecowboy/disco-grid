# Block Registry Expansion Plan — 24/09/25 12:25

## Goals
1. Prop validation: ensure each block type declares a schema so invalid props warn (dev) and fail gracefully (prod fallback).
2. Registry coverage: enumerate every current block and capture default sizing/props/variants for construction, fashion, defense, etc.
3. Quick edit affordances: enable inline toggles (e.g., switch chart type) without opening the full modal, powered by registry metadata.
4. Component container power: converge on a single block shell that supports title editing, quick actions, data bindings, and variant swapping.
5. Maintain `/docs/block-library-backlog.md` to track future families before implementation (layout, navigation, forms, charts, etc.).

## Prop Validation Strategy
- **Library**: adopt `zod` (already used elsewhere) or lightweight custom validators mapped per block type.
- **Integration points**:
  - Extend `lib/block-registry/definitions.ts` to include `schema` for `props` and optional `extensions`.
  - `createBlockConfig` should validate overrides during creation and log developer warnings (`console.warn`) when values mismatch.
  - `useGrid` (and legacy `PageTemplate`) should gate updates through validation to avoid persisting corrupt state.
- **Dev-only messages**: wrap warnings in `if (process.env.NODE_ENV !== 'production')` to avoid noisy logs in demo builds.

## Registry Coverage Tasks
- Metrics: `metric.chart`, `metric.items`, `analytics.summary`, etc.
- Charts: `chart.area`, `chart.donut`, `chart.scatter`, `chart.area.interactive`.
- Tables & Collections: `table.generic`, `table.orders`, `table.items`, plus backlog entries (`table.pivot`, `list.generic`, `card.list`, `gallery`, `directory`).
- Layout & Composition: `layout.container`, `layout.split`, `layout.grid`, `layout.drawer`, `layout.carousel`, etc.
- Navigation & Context: `nav.breadcrumbs`, `nav.tree`, `nav.quicksearch`, `filter.panel`, `toolbar.actions`, `status.badges`.
- Workflows/Activity: workflow builder cards, `activity.timeline`, `timeline.events`, `checklist`.
- Domain-specific: `materials.*` set (done) with future fixture packs for other industries.
- Messaging & Collaboration: `messages.preview`, `messages.panel`, plus backlog (`comments.thread`, `mention.list`).
- System utilities: `commands.quick`, `notifications.panel`, `capacity.tracker`, `help.tour`, `i18n.switcher`, `sandbox.block`.

## Quick Edit & Variant Swapping
- Registry now exposes `variants` metadata (e.g., `chart.line` ↔ `chart.bar` ↔ `chart.donut`) and `controls` arrays (see `docs/quick-edit-plan.md`). Use these to render quick-edit icons in the block chrome.
- Block shell quick edit drawer should read metadata to know which knobs to surface (variant/timeRange/datasource/etc.).
- Ensure edits run through the validation pipeline and update block props via `updateBlock`, so schemas continue to gate invalid data.
- Chart controls: allow swapping visualization type, timeframe, aggregation.
- Table controls: add/remove columns, change density, toggle grouping without opening the full modal.

## Container Enhancements
- Provide structured slots for quick actions (e.g., `onVariantChange`, `onDataSourceChange`).
- Registry metadata should signal required controls: e.g., `controls: ['variant', 'datasource', 'timeRange']`.
- Long-term: unify `BlockEditModal` to read schemas and control definitions from the registry for truly declarative forms.

## Open Questions
- Do we support block families (e.g., `chart.*`) with shared schemas or per-type definitions?
- Should onboarding pick concrete variants or ask high-level questions and let runtime map to blocks via tags?

## Immediate Next Steps
1. (Done 24/09/25) Added Zod schemas + defaults; registry now validates overrides in `createBlockConfig`/`updateBlock`.
2. (Done 24/09/25) Registry coverage includes charts, tables, materials, kanban, filters, and tabs with default props + variants.
3. (Done 24/09/25) Quick edit spec implemented via `components/grid-v2/QuickEditControls.tsx`; legacy dashboard still uses fallback icons.
4. Expand quick edit controls for workflows/compliance blocks and propagate to legacy pages once stabilized.
5. Layout & Nav phase (24/09/25):
   - (Done 24/09/25 16:55) Step 1 — Implement `layout.container`, `layout.split`, `layout.stack`, `layout.grid`.
   - (Done 25/09/25 13:21) Step 1a — Align slot editors with registry metadata + preserve nested blocks during quick edits.
   - Step 2 — Implement `nav.breadcrumbs`, `nav.quicksearch`, `filter.panel`, `toolbar.actions`, `status.badges`.

*Drafted 24/09/25 12:25.*
