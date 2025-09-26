# Working To-Do List

_Status tags: [ ] = Not started, [~] = In progress, [x] = Complete._
_Current baseline reference: grid/state management lives in `components/PageTemplate.tsx` + `lib/useGridSystem.ts`; block data schemas documented in `BLOCK_DATA_STRUCTURES.md` and `COMPONENT_LIBRARY.md`; deterministic sample data lives in `lib/mock.ts`._
_Reminder: Avoid introducing new numeric breakpoints/sizes; reuse existing design tokens and viewport-derived values throughout._
_Documentation rule: every feature change must create/update the matching doc entry before completion._

## A. Must-Have Loop for the Demo

### 0. Platform Scaffolding
- [ ] Establish shared TypeScript contracts for: Org, User, Facility, Floorplan, Order, ItemTemplate, Item, Kit, Workflow, Stage, Rule, Event, Scan, ShareGrant.
  - existing: block-level interfaces are duplicated inside components (e.g. `components/blocks/TableOrders.tsx`); no shared domain contracts yet.
- [ ] Implement `DataProvider` interface with swappable backends.
  - [ ] `MockProvider` using in-memory state, seeded JSON, deterministic IDs/events.
  - [ ] `ApiProvider` placeholder wiring for future fetch/RPC.
  - [ ] Single `useData()` hook that hides provider selection.
  - existing: `lib/mock.ts` supplies deterministic mock datasets, but there is no provider abstraction or global hook.
- [ ] Ship lightweight event bus for publishing mock live events (scans, stage completes) to dashboards.
  - existing: no centralized pub/sub; components read static props.
- [ ] Add frontend role/tenant guard with ABAC rules (factory vs brand vs admin) and impersonation toggle.
  - existing: navigation in `components/Sidebar.tsx` is unguarded; impersonation not implemented.

### 1. Landing → Onboarding Wizard
- [ ] Build invite/accept screen supporting token-based magic link + role selection.
- [ ] Create multi-step onboarding wizard (fast-path demo defaults).
  - [ ] Company profile & use-case selection module.
  - [ ] Data preferences module (charts, tables, theme, density, units).
  - [ ] Facility model module (single/multi site, floorplan lite builder).
    - [ ] Upload floorplan image.
    - [ ] Draw and name zones, persist geometry JSON.
  - [ ] Item model module for template selection and required fields.
  - [ ] Workflow needs module to pick starter templates.
  - [ ] Rules module for IF-THEN starter automations.
- [ ] Generate app presets from wizard answers.
  - [ ] Mission Control preset (pages + components).
  - [ ] Factory App preset.
  - [ ] Produce `GenerationSummary` artifact.
  - [x] Seed demo onboarding preset (5-step wizard + helper panels) accessible via dynamic pages. (25/09/25 13:30)
- [x] Audit onboarding component coverage: confirm form builder, navigation, and layout blocks meet wizard requirements (25/09/25 13:30)
- [~] Build interactive onboarding wizard (branding → style → industry → capacity → SKU → floorplan → summary) with bespoke components. (25/09/25 13:45)
  - [ ] Keep `docs/onboarding-plan.md` + `docs/onboarding-backlog.md` updated as wizard layout/logic shifts.


### 2. Mission Control (Generated Canvas Pages)
- [ ] Auto-create pages: Overview, Orders, Items, Workflows, Analytics.
- [ ] Populate Overview with KPIs (WIP, readiness, expiries, alerts) and recent events feed.
- [ ] Orders page: data table + "Create Order" action.
- [ ] Items page: data table + "Create Item/Kit" action.
- [ ] Workflows page: list view + "Create Workflow" action.
- [ ] Analytics page: charts wired to event bus for fake live data.
- [ ] Canvas loader consumes saved layout preset per page and supports randomize preset action.

### 3. Orders (Create & Share)
- [ ] Implement minimal Create Order form (customer/brand, line items, due date).
- [ ] Order detail view showing lines, per-stage status, event timeline.
- [ ] Share-to-brand flow creating order-scoped `ShareGrant` and "Preview as brand" view.

### 4. Items & Kits (Create & Manage)
- [ ] Create Item flow with template selection and attribute entry.
- [ ] Support optional Kit creation with child items.
- [ ] Render printable labels (QR/Code128) with "Print sample" modal.
- [ ] Item detail view covering traits, custody, current stage, and history.

### 5. Workflow Builder (Sequential + Parallel + Rules)
- [ ] Model workflows as DAG of stages with inputs/outputs and rules.
- [ ] Editor UX with sequential lane and support for inserting parallel groups.
- [ ] Gate nodes for IF-THEN conditions (field/counter/zone/time triggers).
- [ ] Resource rule support (e.g., belt_loops queue thresholds).
- [ ] Validate & publish flow that emits `WorkflowSpec` JSON.

### 6. Factory Floor App (Operator Role)
- [ ] Work queue filtered by user/zone/stage assignments.
- [ ] Scan screen (keyboard/QR sim) that resolves item and displays required stage actions.
- [ ] Stage form runner rendering dynamic inputs defined per stage.
- [ ] Offline simulation toggle that queues events and synchronizes via `DataProvider`.
- [ ] Zone view listing items by floorplan zone with quick actions.

### 7. Analytics & Live Telemetry
- [ ] KPI cards (WIP count, items past SLA, readiness %, expiry buckets).
- [ ] Charts (throughput by stage, time-in-stage, queue depth).
- [ ] Event feed subscribing to event bus with order/item filters.

## B. Enhancements to Existing Areas

### Grid / Canvas (Mission Control)
_Current state: Teams and Materials pages already consume `PageTemplate`; Home and Items still embed bespoke grid logic in `app/page.tsx` and `app/items/page.tsx`._
- [~] Persist and version layouts per role with snapshot/rollback.
  - existing: `components/PageTemplate.tsx` persists to `localStorage` and supports frozen snapshots via `storageKey`/`frozenStorageKey`; lacks role-aware storage + history.
- [~] Formalize component config schema for onboarding output mapping.
  - existing: schema docs live in `BLOCK_DATA_STRUCTURES.md`; runtime validation layer still missing.
- [ ] Implement shared cross-page filters propagated via context.
  - existing: isolated filter blocks (e.g. `components/blocks/FilterItems.tsx`) do not sync across canvases yet.

### Workflow Builder UX
_Current state: `app/workflows/page.tsx` offers sequential workflow cards with template seeding and a mock runner; DAG/parallel tooling still pending._
- [ ] Visualize conditional logic with gate UI (IF → THEN routing/alerts/assignments).
- [ ] Enable parallel lane creation/merge and show WIP counters per lane.
- [ ] Curate Stage I/O library with consistent props for common inputs/outputs.
- [ ] Add validation for cycles, missing edges, orphan stages, incompatible I/O.
- [ ] Support versioning (draft vs published) and diffing between versions.

### Factory App
- [ ] Form renderer supporting Stage-defined input types (text, number, select, photo, signature).
- [ ] Scan simulator for fake QR input and optional auto-demo loop.
- [ ] Queue logic prioritizing by SLA/age and respecting workflow rules.

### Sharing & Permissions
- [ ] Scope guards restricting brand users to shared orders/items and masking sensitive fields.
- [ ] Manage share tokens (revoke, expire, audit views).

## C. Phased Roadmap & Scaffolding

### Phase 0 — Skeleton & Contracts
_Current state: dashboard mocks in `lib/mock.ts` cover orders/KPIs but not full fixture packs or typed contracts._
- [ ] Finalize TS types for WorkflowSpec, Stage, Rule, Condition, Event, ItemTemplate, Item, Order, ShareGrant, Facility, Zone.
- [ ] Implement `DataProvider` + event bus scaffolding.
- [ ] Seed fixture packs: Textile Finishing, Generic Assembly, Jobsite Gate + Kit Checkout.

### Phase 1 — Onboarding → App Generation
- [ ] Build wizard pages and validators.
- [ ] Implement floorplan mini-builder (upload, draw rectangles/polygons, name zones, persist geometry JSON).
- [ ] Build generator mapping answers to item templates, workflow presets, canvas presets, and permission defaults.

### Phase 2 — Orders, Items, Kits, Sharing
- [ ] Deliver CRUD forms and detail pages for orders/items/kits.
- [ ] Add label preview (QR).
- [ ] Implement share flows and "Preview as brand" experience.

### Phase 3 — Workflow Builder
- [ ] Build DAG editor with lanes, gates, and counters.
- [ ] Define stage I/O palette and schema.
- [ ] Validate/publish pipeline persisting `WorkflowSpec`.

### Phase 4 — Factory Floor App
- [ ] Implement work queue, scan screen, and form runner.
- [ ] Add offline toggle and sync handling.
- [ ] Build zone view tied to floorplan.

### Phase 5 — Analytics & Demo Polish
- [ ] Wire KPI cards and charts to event bus.
- [ ] Author demo script covering full loop.
- [ ] Create "Reset demo" utility for wipe + reseed.

## D. Grid Standardization Workstreams (do not build yet)

### 0) Context Priming
- [x] Capture priming notes emphasising grid-first component engine, reuse of existing numeric tokens, and Dashboard parity. (Prep step before any implementation.) — see `docs/grid-priming.md`.

### 1) Repo Sweep & Grid Inventory
- [x] Create `/docs/grid-inventory.md` summarizing current grid/canvas implementations. (24/09/25 10:44)
  - [x] List files/modules providing grid behavior (e.g. `components/PageTemplate.tsx`, `lib/useGridSystem.ts`, `app/*/page.tsx`).
  - [x] Document layout-driving props/state (`x`,`y`,`w`,`h`, etc.) with source references.
  - [x] Explain responsiveness mechanisms (breakpoints, container queries, CSS vars) already in use.
  - [x] Note existing block constraints, design tokens, spacing utilities without adding new numbers.

### 2) Normalize Container & Viewport Rules
- [x] Define shared container contract (single source) using existing tokens; ensure max width scales with viewport while preserving Dashboard visuals. (Container variants + `LayoutScaffold` ready 24/09/25 11:27.)
- [ ] Apply container/viewport rules across app without altering numeric constants.
  - [x] Document the contract in `/docs/grid-container-contract.md`. (24/09/25 11:08)

- [Quick Edit Plan] `docs/quick-edit-plan.md` captures control panel/variant/data source roadmap (24/09/25 12:45).
### 3) Block Registry & Quick Edit Contracts
- [x] Implement registry that registers block type, default titles/props, categories, sizing, and schema-backed validation for reuse across grids (24/09/25 12:30).
- [x] Surface developer-friendly console warnings + prop schema validation (dev-only) — powered by Zod in `createBlockConfig`/`useGrid` (24/09/25 12:30).
- [x] Author `/docs/block-registry.md` describing registration workflow and layout handoff. (24/09/25 12:14)
- [x] Deliver quick edit controls backed by registry metadata (variant swap, density, time range) and mock data bindings, including catalog browser modal + dataset refresh bugfix. (24/09/25 15:47)
- [x] Rework `BlockEditModal` into compact stepper (type → data → styling) for the v2 grid, with registry-driven preview + mock data bindings. (24/09/25 16:25)
- [x] Extend registry coverage with additional chart/metric/table variants + seeded mock datasets. (24/09/25 16:35)
- [ ] Flesh out the remaining block families captured in `/docs/block-library-backlog.md` (layout, navigation, forms, charts, maps, governance, etc.).
- [ ] Layout & Nav phase (24/09/25):
- [x] Step 1 — Layout primitives: `layout.container`, `layout.split`, `layout.stack`, `layout.grid` (registry + components + mock data + docs). (24/09/25 16:55)
  - [x] Step 1a — Layout slot editing: Layout blocks support click-to-edit with slot modal + persistence across quick edits. (25/09/25 13:21)
- [x] Step 2 — Navigation/context shells: `nav.breadcrumbs`, `nav.quicksearch`, `filter.panel`, `toolbar.actions`, `status.badges` (25/01/25 17:30).
- [~] Step 3 — Form Builder & Input Components: `form.builder`, `form.input`, `form.select`, `form.textarea`, `form.checkbox`, `form.upload`, `form.section` wired with dynamic slots; remaining backlog items (`form.stepper`, `form.matrix`, etc.) still outstanding (25/01/25 17:45).
  - [x] Align registry slot definitions with dynamic `element-*` slots used by `FormBuilder` so added controls persist (25/09/25 13:21)
  - [x] Ensure `BlockRenderer`/grid state preserve nested slots when quick-edit updates props (25/09/25 13:21)
  - [x] Consolidate form element rendering so `FormBuilder` can manage multi-field layouts without extra wrapper blocks (25/09/25 13:21)
- [x] Step 4 — Page Creator System: Dynamic page creation with blank templates, page management interface, and v2 grid integration (25/01/25 18:00).
  - [x] Step 4a — Sidebar-based Page Navigation: Moved from directory approach to sidebar-based new page creation with consistent layout (25/01/25 18:15).
- [x] Implement quick-edit popover + control metadata (variants/timeRange/datasource) per `docs/quick-edit-plan.md`. (24/09/25 12:50)
- [x] Add data-source modal stub tied to registry schemas. (24/09/25 12:50)
- [x] Expand registry coverage for remaining block families (tabs, filter items, workflow widgets) and document domain tags. (24/09/25 12:50)
- [ ] Build dedicated visual variants (e.g., metric chart cards, quick charts) so swaps render distinct UIs.
- [ ] Replace mock data source bindings with real DataProvider integration once available.
- [x] Scaffold `DataProvider` interface, mock provider, and React context/hooks so pages can enumerate sources ahead of backend wiring. (24/09/25 16:25)

### 4) Component Engine Contract
- [ ] Define serializable `PageSpec` (blocks + layout + filters) powering rendering via existing grid physics.
- [ ] Provide render utility that consumes `PageSpec` + filters; ensure Dashboard can be described via `PageSpec` without visual changes.
- [ ] Document mapping in `/docs/page-spec.md`.

### 5) Viewport-Aware Constraints
- [ ] Add shared helper enforcing viewport/token-derived block min/max constraints; confirm drag/resize respects limits at breakpoints.
- [ ] Document opt-in model in `/docs/block-constraints.md`.

### 6) Data Layer Awareness
- [ ] Introduce lightweight data binding contract (source/query/params) that passes through to existing data hooks without fetching.
- [ ] Confirm Dashboard blocks can declare bindings without behavior changes.
- [ ] Document contract in `/docs/data-binding.md`.

### 7) Dashboard as Golden Example
- [ ] Refactor `app/page.tsx` to load via `PageSpec` + component engine while preserving visuals/behavior.
- [ ] Verify extreme viewport responsiveness stays intact post-refactor.
- [ ] Add `/docs/dashboard-reference.md` explaining canonical status.

### 8) QA Checklist & Guardrails
- [ ] Add `/docs/grid-qa.md` capturing regression tests/checklist (reload/breakpoint stability, drag constraints, overflow checks, registry errors).
- [ ] Introduce unit/integration assertions covering layout persistence, constraints, viewport toggling, and registry error messaging.

### 9) Developer Ergonomics & Affordances
- [ ] Implement dev-only Block Palette, Layout Inspector overlay, and Breakpoint Simulator toggles (no production payload impact).
- [ ] Document tools in `/docs/dev-tools.md`.

### 10) Onboarding Grid Scaffold
- [ ] Create placeholder onboarding page using component engine + container rules with stub "append block" action.
- [ ] Document onboarding plan + persistence approach in `/docs/onboarding-plan.md`.
