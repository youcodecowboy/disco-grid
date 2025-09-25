"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import BlockRenderer from "@/components/BlockRenderer"
import { listBlockDefinitions, getBlockDefinition, createBlockConfig, getMockPropsForSource } from "@/lib/block-registry"
import type { BlockConfig, BlockType } from "@/lib/grid-v2/types"
import type { BlockDefinition } from "@/lib/block-registry"
import { useDataSources } from "@/lib/data/hooks"
import type { DataBinding } from "@/lib/data/types"

type Step = 1 | 2 | 3

interface BlockEditModalProps {
  open: boolean
  block: BlockConfig | null
  onClose: () => void
  onReplace: (next: BlockConfig) => void
  onAddExtension: (next: BlockConfig) => void
}

const timeRangeOptions = [
  { value: "7d", label: "Last 7 days" },
  { value: "14d", label: "Last 14 days" },
  { value: "30d", label: "Last 30 days" },
]

const densityOptions = [
  { value: "comfortable", label: "Comfort" },
  { value: "compact", label: "Compact" },
]

const getVariantDefinitions = (definition?: BlockDefinition) => {
  if (!definition?.variants) return []
  return definition.variants
    .map((type) => ({ type, definition: getBlockDefinition(type) }))
    .filter((entry): entry is { type: BlockType; definition: BlockDefinition } => Boolean(entry.definition))
}

const mapByCategory = (definitions: BlockDefinition[]) => {
  return definitions.reduce((acc, def) => {
    const category = def.category || "General"
    if (!acc.has(category)) {
      acc.set(category, [])
    }
    acc.get(category)!.push(def)
    return acc
  }, new Map<string, BlockDefinition[]>())
}

const cleanId = (id: string) => id.replace(/[^a-zA-Z0-9-_]/g, "-")

export function BlockEditModal({ open, block, onClose, onReplace, onAddExtension }: BlockEditModalProps) {
  const [step, setStep] = useState<Step>(1)
  const allDefinitions = useMemo(() => listBlockDefinitions(), [])
  const definitionsByCategory = useMemo(() => mapByCategory(allDefinitions), [allDefinitions])
  const categoryList = useMemo(() => Array.from(definitionsByCategory.keys()), [definitionsByCategory])

  const initialDefinition = useMemo(() => {
    if (block) {
      return getBlockDefinition(block.type) ?? allDefinitions[0]
    }
    return allDefinitions[0]
  }, [block, allDefinitions])

  const [selectedType, setSelectedType] = useState<BlockType>(initialDefinition?.type ?? "note")
  const [customTitle, setCustomTitle] = useState<string>(block?.title ?? initialDefinition?.defaultTitle ?? "Untitled")
  const [selectedSource, setSelectedSource] = useState<DataBinding["source"] | null>(
    (block?.props as any)?.source?.table ? `mock:${(block?.props as any).source.table}` : null,
  )
  const [timeRange, setTimeRange] = useState<string | undefined>((block?.props as any)?.timeRange)
  const [density, setDensity] = useState<string | undefined>((block?.props as any)?.density)
  const [activeCategory, setActiveCategory] = useState<string>(categoryList[0] ?? "")

  const { sources } = useDataSources()

  const activeDefinition = useMemo(() => getBlockDefinition(selectedType), [selectedType])

  useEffect(() => {
    if (!open) return
    setStep(1)
    setSelectedType(initialDefinition?.type ?? "note")
    setCustomTitle(block?.title ?? initialDefinition?.defaultTitle ?? "Untitled")
    setSelectedSource((block?.props as any)?.source?.table ? `mock:${(block?.props as any).source.table}` : null)
    setTimeRange((block?.props as any)?.timeRange)
    setDensity((block?.props as any)?.density)
    if (categoryList.length) {
      const currentCategory = Array.from(definitionsByCategory.entries()).find(([_, defs]) =>
        defs.some((definition) => definition.type === (initialDefinition?.type ?? "note")),
      )?.[0]
      setActiveCategory(currentCategory ?? categoryList[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, block?.id])

  useEffect(() => {
    if (!categoryList.length) return
    if (!categoryList.includes(activeCategory)) {
      setActiveCategory(categoryList[0])
    }
  }, [categoryList, activeCategory])

  const previewBlock = useMemo(() => {
    const base = createBlockConfig(selectedType, {
      id: block?.id ?? "preview",
      title: customTitle,
    })

    let mergedProps = { ...(base.props || {}) }

    if (selectedSource) {
      const [, table] = selectedSource.split(":")
      const mockProps = getMockPropsForSource(selectedType, { type: "mock", table })
      if (mockProps) {
        mergedProps = { ...mergedProps, ...mockProps }
      }
      mergedProps = { ...mergedProps, source: { type: "mock", table } }
    }

    if (timeRange && activeDefinition?.controls?.includes("timeRange")) {
      mergedProps = { ...mergedProps, timeRange }
    }

    if (density && activeDefinition?.controls?.includes("density")) {
      mergedProps = { ...mergedProps, density }
    }

    return {
      ...base,
      title: customTitle || base.title,
      props: mergedProps,
    }
  }, [selectedType, customTitle, selectedSource, timeRange, density, activeDefinition, block?.id])

  if (!open || !activeDefinition) return null

  const variants = getVariantDefinitions(activeDefinition)
  const controls = activeDefinition.controls ?? []

  const handleApply = () => {
    onReplace(previewBlock)
    onClose()
  }

  const handleAddExtension = () => {
    onAddExtension({
      ...previewBlock,
      id: `${previewBlock.id}-ext-${cleanId(previewBlock.type)}-${Date.now()}`,
    })
    onClose()
  }

  const renderStepContent = () => {
    if (step === 1) {
      const definitionsForCategory = definitionsByCategory.get(activeCategory) ?? []
      return (
        <div className="flex gap-4">
          <nav className="w-48 flex-shrink-0 space-y-1 overflow-y-auto max-h-[420px] pr-1" aria-label="Block categories">
            {categoryList.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`w-full text-left text-xs font-medium px-3 py-2 rounded-md transition-colors ${
                  category === activeCategory ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                {category}
              </button>
            ))}
          </nav>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto max-h-[420px] pr-1">
            {definitionsForCategory.map((definition) => (
              <button
                key={definition.type}
                className={`border rounded-lg p-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  definition.type === selectedType ? "border-primary bg-primary/10" : "border-border hover:border-foreground/40"
                }`}
                onClick={() => {
                  setSelectedType(definition.type)
                  setCustomTitle(definition.defaultTitle ?? customTitle)
                }}
              >
                <div className="text-sm font-semibold">{definition.label}</div>
                {definition.description && (
                  <p className="text-xs text-muted-foreground mt-1">{definition.description}</p>
                )}
              </button>
            ))}
            {definitionsForCategory.length === 0 && (
              <div className="text-xs text-muted-foreground border border-dashed rounded-md p-4">
                No blocks registered for this category yet.
              </div>
            )}
          </div>
        </div>
      )
    }

    if (step === 2) {
      return (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium">Data source</h3>
            <p className="text-xs text-muted-foreground">Choose what dataset should hydrate this block.</p>
          </div>
          <div className="space-y-3">
            {sources.length === 0 && (
              <div className="border border-dashed rounded-lg px-4 py-6 text-sm text-muted-foreground">
                No data sources registered yet. Mock provider scaffolding is ready—add a provider to populate this list.
              </div>
            )}
            {sources.map((source) => {
              const sourceId = source.id
              const isSelected = selectedSource === sourceId
              return (
                <button
                  key={source.id}
                  className={`w-full text-left border rounded-lg px-4 py-3 transition ${
                    isSelected ? "border-primary bg-primary/10" : "border-border hover:border-foreground/40"
                  }`}
                  onClick={() => setSelectedSource(sourceId)}
                >
                  <div className="font-semibold text-sm">{source.label}</div>
                  {source.description && (
                    <p className="text-xs text-muted-foreground mt-1">{source.description}</p>
                  )}
                  {source.fields && source.fields.length > 0 && (
                    <p className="text-[11px] text-muted-foreground mt-2">
                      Fields: {source.fields.slice(0, 6).join(", ")}
                      {source.fields.length > 6 ? "…" : ""}
                    </p>
                  )}
                </button>
              )
            })}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedSource(null)}>
                Clear selection
              </Button>
              <Button variant="link" size="sm" className="px-0">
                Manage providers (coming soon)
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Title</label>
          <Input value={customTitle} onChange={(event) => setCustomTitle(event.target.value)} placeholder="Block title" />
        </div>

        {variants.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Variants</h3>
            <div className="flex flex-wrap gap-2">
              {[{ type: activeDefinition.type, definition: activeDefinition }, ...variants].map(({ type, definition }) => (
                <Button
                  key={type}
                  variant={type === selectedType ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                  onClick={() => setSelectedType(type)}
                >
                  {definition.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {controls.includes("timeRange") && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Time range</h3>
            <div className="flex flex-wrap gap-2">
              {timeRangeOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={timeRange === option.value ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                  onClick={() => setTimeRange(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {controls.includes("density") && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Table density</h3>
            <div className="flex gap-2">
              {densityOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={density === option.value ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                  onClick={() => setDensity(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const stepLabel = (value: Step, label: string) => (
    <div className={`flex items-center gap-2 ${step === value ? "text-foreground" : "text-muted-foreground"}`}>
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs font-medium ${
          step === value ? "border-primary bg-primary text-primary-foreground" : "border-border"
        }`}
      >
        {value}
      </span>
      <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background rounded-xl border shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        <header className="flex items-center justify-between border-b px-6 py-4">
          <div className="space-y-1">
            <h2 className="text-base font-semibold">Edit block</h2>
            <p className="text-xs text-muted-foreground">Configure type, data, and presentation. Registry-backed for consistency.</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] flex-1 min-h-0">
          <div className="border-b lg:border-b-0 lg:border-r px-6 py-6 overflow-y-auto">
            <div className="flex items-center gap-3 pb-6 border-b mb-6">
              {stepLabel(1, "Type")}
              <div className="h-px flex-1 bg-border" />
              {stepLabel(2, "Data")}
              <div className="h-px flex-1 bg-border" />
              {stepLabel(3, "Presentation")}
            </div>

            {renderStepContent()}
          </div>

          <aside className="px-6 py-6 overflow-y-auto bg-muted/40">
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium">Preview</h3>
                <p className="text-xs text-muted-foreground">Live render powered by the registry + mock data.</p>
              </div>
              <div className="border rounded-lg bg-background p-4 min-h-[320px]">
                <BlockRenderer block={previewBlock} />
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div><span className="font-medium">Type:</span> {activeDefinition.label}</div>
                {selectedSource ? <div><span className="font-medium">Data:</span> {selectedSource}</div> : <div>No data source selected</div>}
              </div>
            </div>
          </aside>
        </div>

        <footer className="flex items-center justify-between border-t px-6 py-4 bg-muted/30">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep((prev) => Math.max(1, (prev - 1) as Step))} disabled={step === 1}>
              Back
            </Button>
            <Button variant="outline" onClick={() => setStep((prev) => Math.min(3, (prev + 1) as Step))} disabled={step === 3}>
              Next
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleAddExtension}>
              Save as extension
            </Button>
            <Button onClick={handleApply}>Apply changes</Button>
          </div>
        </footer>
      </div>
    </div>
  )
}
