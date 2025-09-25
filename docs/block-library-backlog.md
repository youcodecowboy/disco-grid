# Block Library Backlog — 24/09/25 16:40

The list below captures the block families we still need to design/implement. Each entry should eventually receive:
- Registry definition (type, defaults, schema, variants, controls)
- Component implementation (or composition of existing primitives)
- Quick-edit metadata for small tweaks (layout toggles, density, etc.)
- Mock data seeds so the block renders immediately when added via the editor

## Layout & Composition
- [x] `layout.container`
- [x] `layout.split`
- [x] `layout.stack`
- [x] `layout.grid`
- [ ] `layout.drawer`
- [ ] `layout.modal`
- [ ] `layout.accordion`
- [ ] `layout.carousel`

## Navigation & Context
- [x] `nav.breadcrumbs`
- [ ] `nav.tree`
- [x] `nav.quicksearch`
- [x] `filter.panel`
- [x] `toolbar.actions`
- [x] `status.badges`

## Input & Forms
- [x] `form.builder` (main form container with slots)
- [x] `form.input` (text, email, number, etc.)
- [x] `form.select` (dropdown with options)
- [x] `form.textarea` (multi-line text)
- [x] `form.checkbox` (single or multiple)
- [x] `form.upload` (file upload with drag-drop)
- [x] `form.section` (form section dividers)
- [ ] `form.simple`
- [ ] `form.stepper`
- [ ] `form.matrix`
- [ ] `form.signature`
- [ ] `form.richtext`
- [ ] `form.selector`
- [ ] `form.controls`

## Lists, Tables & Collections
- `list.generic`
- `table.pivot`
- `card.list`
- `gallery`
- `directory`

## Metrics & Counters
- `metric.counter`
- `metric.progress`
- `metric.gauge`
- `metric.delta`

## Charts (additional agnostic shells)
- `chart.histogram`
- `chart.pareto`
- `chart.control`
- `chart.heatmap`

## Time, Schedule & Planning
- `schedule.board`
- `gantt`
- `timeline.events`
- `checklist`

## Maps & Layout Views
- `map.floorplan`
- `map.geo`
- `map.heat`
- `zones.legend`

## Scanning, Devices & Output
- `scan.input`
- `scan.rfid.session`
- `label.designer`
- `print.queue`
- `device.status`
- `camera.capture`

## Governance, Sharing & Audit
- `access.matrix`
- `share.manager`
- `audit.ledger`
- `approvals.panel`

## Rules, Logic & Graphs
- `logic.builder`
- `graph.network`
- `graph.dag.viewer`

## Files, Docs & Media
- `file.viewer`
- `image.viewer`
- `image.annotate`
- `attachments.panel`

## Collaboration & Comms
- `comments.thread`
- `mention.list`

## System & Utilities
- `help.tour`
- `i18n.switcher`
- `sandbox.block`

*Drafted 24/09/25 16:40.*
