"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface DataSource {
  table: string
  label: string
  description?: string
  sampleFields?: string[]
}

interface CatalogGroup {
  id: string
  label: string
  sources: DataSource[]
}

const SOURCE_CATALOG: CatalogGroup[] = [
  {
    id: "operations",
    label: "Operations",
    sources: [
      {
        table: "orders",
        label: "Orders",
        description: "Order headers with status, customer, and promised dates.",
        sampleFields: ["id", "customer", "status", "due_date"],
      },
      {
        table: "production_runs",
        label: "Production Runs",
        description: "Run-level progress, throughput, and stage timing.",
        sampleFields: ["run_id", "workflow", "stage", "owner"],
      },
      {
        table: "workflow_events",
        label: "Workflow Events",
        description: "Stage transitions and scan events for each item.",
        sampleFields: ["event_id", "item_id", "stage", "timestamp"],
      },
    ],
  },
  {
    id: "inventory",
    label: "Inventory",
    sources: [
      {
        table: "items",
        label: "Items",
        description: "Item catalog with templates, custody, and status.",
        sampleFields: ["item_id", "template", "status", "zone"],
      },
      {
        table: "kits",
        label: "Kits",
        description: "Kit containers plus child items and readiness state.",
        sampleFields: ["kit_id", "contents", "owner", "ready"],
      },
      {
        table: "zones",
        label: "Floorplan Zones",
        description: "Facility zones with capacity and current load.",
        sampleFields: ["zone_id", "name", "capacity", "occupancy"],
      },
    ],
  },
  {
    id: "materials",
    label: "Materials",
    sources: [
      {
        table: "suppliers",
        label: "Suppliers",
        description: "Supplier master with lead time and on-time metrics.",
        sampleFields: ["supplier_id", "name", "lead_time_days", "on_time_rate"],
      },
      {
        table: "inbound_shipments",
        label: "Inbound Shipments",
        description: "Planned arrivals, carrier, and receiving status.",
        sampleFields: ["shipment_id", "eta", "status", "carrier"],
      },
      {
        table: "material_usage",
        label: "Material Usage",
        description: "Consumption rates and reorder thresholds.",
        sampleFields: ["sku", "category", "daily_usage", "days_on_hand"],
      },
    ],
  },
]

interface DataSourceBrowserProps {
  open: boolean
  onClose: () => void
  onSelect: (source: { type: string; table: string }) => void
  currentSource?: { type: string; table: string } | null
}

export function DataSourceBrowser({ open, onClose, onSelect, currentSource }: DataSourceBrowserProps) {
  const [activeGroup, setActiveGroup] = useState(SOURCE_CATALOG[0]?.id ?? "")
  const [query, setQuery] = useState("")

  const filteredCatalog = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return SOURCE_CATALOG

    return SOURCE_CATALOG.map((group) => ({
      ...group,
      sources: group.sources.filter((source) => {
        const haystack = [source.label, source.description, ...(source.sampleFields ?? [])]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
        return haystack.includes(q)
      }),
    })).filter((group) => group.sources.length > 0)
  }, [query])

  if (!open) return null

  const activeSources = filteredCatalog.find((group) => group.id === activeGroup)?.sources ?? []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background border rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col">
        <header className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-base font-semibold">Select a data source</h2>
            <p className="text-sm text-muted-foreground">Mock bindings today, DataProvider wiring later.</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close data source browser">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </header>

        <div className="flex flex-1 min-h-0">
          <aside className="w-56 border-r px-4 py-4 space-y-2 overflow-y-auto">
            {filteredCatalog.map((group) => {
              const isActive = group.id === activeGroup
              return (
                <button
                  key={group.id}
                  className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive ? "bg-muted text-foreground" : "hover:bg-muted"
                  }`}
                  onClick={() => setActiveGroup(group.id)}
                >
                  <div className="font-medium">{group.label}</div>
                  <div className="text-xs text-muted-foreground">{group.sources.length} sources</div>
                </button>
              )
            })}
          </aside>

          <main className="flex-1 px-6 py-6 overflow-y-auto space-y-4">
            <div className="flex items-center gap-3">
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search tables, fields, or descriptions"
                className="max-w-md"
              />
              {currentSource && (
                <span className="text-sm text-muted-foreground">
                  Active: {currentSource.table}
                </span>
              )}
            </div>

            {activeSources.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                No sources match that search. Try a different term or switch categories.
              </div>
            ) : (
              <div className="space-y-3">
                {activeSources.map((source) => {
                  const isSelected = currentSource?.table === source.table
                  return (
                    <div
                      key={source.table}
                      className={`rounded-xl border px-4 py-4 transition shadow-sm ${
                        isSelected ? "border-primary bg-primary/10" : "border-border hover:border-foreground/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-sm font-semibold">{source.label}</div>
                          {source.description && (
                            <p className="text-sm text-muted-foreground mt-1">{source.description}</p>
                          )}
                          {source.sampleFields && source.sampleFields.length > 0 && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              <span className="font-medium">Fields:</span> {source.sampleFields.join(", ")}
                            </div>
                          )}
                        </div>
                        <Button
                          variant={isSelected ? "default" : "outline"}
                          onClick={() => {
                            onSelect({ type: "mock", table: source.table })
                            onClose()
                          }}
                        >
                          {isSelected ? "Selected" : "Use source"}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
