# Order Creation Suite Blueprint — 29/09/25 14:12

## Mission
- Deliver a flagship authoring environment for orders, items, and components that feels distinct from the rest of the app and communicates its power.
- Let teams spin up rich, hierarchical inventory structures (order → items → components) with minimal friction while preserving data integrity and auditability.
- Provide deep workflow hooks so every manufactured asset is born with an execution path, QR coverage, and status visibility.
- Reinforce Groovy as a logic-driven item management platform where granular QR-linked rules govern every asset from creation to completion.

## Experience Principles
- **Living Canvas**: Large-format layout with generous spacing, columnar sections, and persistent "Create" affordances; page should keep stretching as content grows.
- **Progressive Zoom**: Smooth transitions between order-level overview, item tables, and component drill-downs; always reveal context breadcrumbs.
- **Hyper-Malleable Schema**: Encourage fast creation of bespoke attributes, components, and workflow assignments without modal churn.
- **Trust & Traceability**: Surface IDs, QR previews, and workflow status inline so users never doubt what will be stamped or produced.

## Entity Hierarchy Overview
- **Order**: Container for customer context, production timelines, fulfillment promises, reporting hooks, and brand portal access controls so clients only see their own data.
- **Item**: Primary production unit; can be simple (no components) or complex (component tree) with its own QR code and workflow binding. Item complexity is locked at creation to preserve downstream rules.
- **Component**: Sub-parts belonging to a complex item; inherits metadata, generates QR codes when needed, and rolls up completion signals.
- **Workflow**: Rule set and lifecycle definition applied per item to govern production steps, quality gates, and notifications.

## Order Shell (Top Section)
- Hero panel pinned at top of sidebar navigation as "New Order" entry point; clicking opens dedicated page distinct from existing dashboards.
- Editable hero collects: client (searchable select with "new client" modal), order name, production window, assigned internal team, owner, and contact chips sourced from the directory search.
- Contacts added via quick search/suggestions; chips can be removed and define who receives milestone + label notifications.
- Timeline inputs capture start/end + promised ship date; ownership/team controls feed permissions downstream.
- Optional metadata (commercial references, SLAs, comm cadence) remains available in expandable panels for future iterations.

## Order Composition Section
- Columnar table for item families (e.g., item name, SKU/template, quantity, workflow template, status).
- Inline controls to clone templates, create item groups, or nest sub-orders when an order must contain child orders with independent lifecycles.
- Bulk actions: assign workflow to selected items, set default QR schema, duplicate item with variant tweaks, archive/cancel.
- Multi-stage authoring spine: Overview → Milestones → Item Builder → Workflow Assignment → Review.

## Item Builder Workspace
- Each item expands into a panel or drawer showing:
  - Core attributes: name, description, type (simple/complex), quantity per component, target completion, owner.
  - Attribute columns surfaced in a CRM-style grid with editable cells and quick-add controls (text, numeric, select, tag, file, calculated).
  - Starter attribute templates driven by onboarding vertical (fashion manufacturing, construction, defense) pre-populate 10–20 rich fields (e.g., SKU, size, material, fabric code, shrinkage %, compliance tags) that teams can extend.
  - QR configuration: format preview, code generation rules, placement notes, scanning instructions.
- Detail tabs for Files, Ownership, and Notifications manage design documents, team assignments, and alert cadences without leaving the canvas.
- Item type toggle (simple ↔ complex) lives inline; adding components auto-switches to complex while attempting to downgrade warns about existing subrows.
- **Component Grid (only for complex items)**:
  - Drag-to-add rows/columns representing components; each component inherits defaults but can override attributes.
  - Relationship tagging: parent-child mapping, assembly order, dependencies.
  - Bulk operations to generate components from templates (e.g., “4 identical legs”).
  - Infinite add pattern: as components are added, new rows appear immediately so builders can keep extending without modal pauses.
- Metadata versioning for items/components to track changes pre-production vs. post-production locks.

## Milestones & Capacity Stage
- Calendar-first layout (≈70% width) visualises factory load; milestone chips sit above the grid and render directly on the schedule.
- Events are draggable in future iterations; milestone entries render with rings to distinguish them from ambient factory work.
- Secondary column carries stakeholder roster, automatic reporting cadence, and change-control reminders.

## Workflow Integration
- Workflow selector that searches existing library (filters: domain, complexity, duration, required capabilities).
- Inline workflow creation wizard (name, stages, automation hooks) without leaving the order screen.
- Visual badge per item indicating workflow health (draft, published, blocked) and stage progress.
- Option to bind multiple workflows to a complex item (e.g., manufacturing + QA) with precedence rules.
- Dedicated workflow-assignment stage enables bulk propagation and component-level overrides before final review.

## Label Preview & Configuration
- Label designer now lives inside the item detail tab: toggle dataset tokens (code, workflow, dates, attributes) and inject custom text chips inline.
- Live QR preview renders the selected fields with optional client branding, while traceability rules sit beneath for quick adjustments.
- Per-item selections persist and surface again in the final review summary + QR batch payloads.

## Data Integrity & IDs
- Deterministic ID scheme: order ID, item ID (scoped to order), component ID (scoped to item), each with human-readable slug + UUID.
- Real-time collision detection when cloning or importing templates.
- Automatic QR batch generation per item/component, with export hooks (PDF/PNG/CSV) and integration placeholders for printers.
- Activity log capturing creation, edits, workflow bindings, and QR exports for audit trails.

## UI & Interaction Patterns
- Sidebar entry: persistent "Create New Order" button anchored at top above other navigation groups.
- Layout: three-column grid (Order Summary | Item List | Detail Canvas) that collapses gracefully on smaller viewports.
- Always-on "Add Item" CTA pinned at bottom of item list; similar "Add Component" inside component grid.
- Stage navigation footer sticks to the bottom of the viewport so Back/Next actions remain accessible during long forms.
- Keyboard shortcuts for rapid entry (e.g., `Cmd+Enter` to save section, `/` to add attribute).
- Snapshot previews (hover cards) for workflows and QR codes to reduce navigation.
- Support autosave with explicit publish/finalize state to prevent accidental partial deployment.

## Integrations & Extensibility
- Hooks to link order items to inventory systems, cost tracking, or analytics dashboards (future connectors).
- Placeholder APIs for ingesting CSV/BOM data to pre-populate items/components.
- Template system: save item/component configurations as reusable blueprints accessible from library sidebar.

## Compliance & Permissions Considerations
- Role-based access: define who can create orders, edit items, approve workflows, lock components.
- Change approvals: optional review gates before an item/component goes live for production.
- Record retention: ensure generated IDs/QRs persist even if order is archived.
- Brand/tenant isolation: customer portals scoped to a single order hierarchy so external viewers see only their assigned orders and nested items.

## Implementation Signals
- Requires new data models (Order, Item, Component, WorkflowLink) with state machines and history tables.
- Build dedicated React surface (likely under `/app/orders/new`) with design system variants tailored for the living-canvas feel.
- Extend QR service/utilities for nested asset generation and previews.
- Need schema-driven form builder utilities to support on-the-fly attribute creation and validation.
- Implement state management for per-stage edits (items, workflows, labels) so the multi-step wizard stays reactive without losing context.

## Open Questions
- How do we handle bulk workflow creation or mapping when hundreds of items are created at once?
- What is the expected performance ceiling (max items/components per order) we must support interactively?
- Do components ever need independent fulfillment/delivery tracking separate from their parent item?
- How will users manage versioning between draft/prototype orders vs. production-ready releases?

## Next Steps
- Validate hierarchy assumptions and workflow requirements with stakeholders.
- Prototype layout wireframes to nail the living-canvas feel and navigation model.
- Define data model diagrams + API contracts for orders/items/components/workflow links.
- Explore QR code service needs (batch generation, printing integrations).
- Chart onboarding flow for new workflows created inside this surface.

*Drafted 29/09/25 14:12.*
