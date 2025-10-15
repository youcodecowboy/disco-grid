// Step 2-N: Item Builder - Lego Style

import { useState, useMemo } from "react"
import { Plus, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ComplexityToggle } from "@/components/orders-v2/ComplexityToggle"
import { AttributeBuilder } from "@/components/orders-v2/AttributeBuilder"
import { DigitalPassportSection } from "@/components/orders-v2/DigitalPassportSection"
import { ComponentBuilder } from "@/components/orders-v2/ComponentBuilder"
import { calculateRequiredMonths, FACTORY_CAPACITY } from "@/lib/orders-v2/capacityUtils"
import type { ItemProfile, ItemAttribute, Component } from "@/lib/orders-v2/types"
import { WORKFLOW_LIBRARY, VERTICAL_PRESETS, STANDARD_LABEL_FIELDS, LOCATION_OPTIONS } from "@/lib/orders-v2/types"

type ItemBuilderStepProps = {
  item: ItemProfile
  itemIndex: number
  totalItems: number
  onChange: (updates: Partial<ItemProfile>) => void
}

export function ItemBuilderStep({ item, itemIndex, totalItems, onChange }: ItemBuilderStepProps) {
  const [showAttributes, setShowAttributes] = useState((item.attributes || []).length > 0)
  const [showWorkflow, setShowWorkflow] = useState(!!item.workflow)
  const [showDigitalPassport, setShowDigitalPassport] = useState(item.traceability?.enabled || false)
  const [showTimeline, setShowTimeline] = useState(!!item.timeline)
  const [showLabelFields, setShowLabelFields] = useState((item.labelFields || []).length > 0)
  const [showAttachments, setShowAttachments] = useState((item.attachments || []).length > 0)

  // Combine all preset suggestions from all industries for maximum coverage
  const presetSuggestions = useMemo(() => {
    const allSuggestions = VERTICAL_PRESETS.flatMap(preset => preset.defaultAttributes)
    // Remove duplicates and return
    return Array.from(new Set(allSuggestions))
  }, [])

  // Calculate capacity hint
  const capacityHint = useMemo(() => {
    if (item.quantity === 0) return null
    const requiredMonths = calculateRequiredMonths(item.quantity)
    const percentage = (item.quantity / FACTORY_CAPACITY) * 100
    
    if (percentage > 100) {
      return {
        type: "error" as const,
        message: `${item.quantity.toLocaleString()} units - ${requiredMonths} months required (above capacity)`
      }
    } else if (percentage > 80) {
      return {
        type: "warning" as const,
        message: `${item.quantity.toLocaleString()} units - ${Math.round(percentage)}% of monthly capacity`
      }
    }
    return {
      type: "info" as const,
      message: `${item.quantity.toLocaleString()} units - ${Math.round(percentage)}% of monthly capacity`
    }
  }, [item.quantity])

  // Handlers
  const handleAddAttribute = (field: string, value: string) => {
    const newAttr: ItemAttribute = {
      id: `attr-${Date.now()}`,
      field,
      value
    }
    onChange({ attributes: [...(item.attributes || []), newAttr] })
  }

  const handleRemoveAttribute = (id: string) => {
    onChange({ attributes: (item.attributes || []).filter(attr => attr.id !== id) })
  }

  const handleTraceabilityChange = (updates: Partial<ItemProfile["traceability"]>) => {
    onChange({ traceability: { ...item.traceability, ...updates } })
  }

  const handleAddComponent = () => {
    const newComponent: Component = {
      id: `comp-${Date.now()}`,
      name: "",
      quantity: 0,
      workflow: "",
      qrMode: "unique",
      notes: "",
      attributes: []
    }
    onChange({ components: [...(item.components || []), newComponent] })
  }

  const handleUpdateComponent = (componentId: string, updates: Partial<Component>) => {
    onChange({
      components: (item.components || []).map(comp =>
        comp.id === componentId ? { ...comp, ...updates } : comp
      )
    })
  }

  const handleRemoveComponent = (componentId: string) => {
    onChange({ components: (item.components || []).filter(comp => comp.id !== componentId) })
  }

  const toggleLabelField = (fieldId: string) => {
    const labelFields = item.labelFields || []
    const exists = labelFields.find(f => f.id === fieldId)
    if (exists) {
      onChange({
        labelFields: labelFields.filter(f => f.id !== fieldId)
      })
    } else {
      const field = STANDARD_LABEL_FIELDS.find(f => f.id === fieldId)
      if (field) {
        onChange({
          labelFields: [...labelFields, { ...field, enabled: true }]
        })
      }
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-1">
      {/* Item indicator */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
        <span>Item {itemIndex + 1} of {totalItems}</span>
      </div>

      {/* Item Name - Primary input */}
      <div>
        <input
          type="text"
          value={item.name || ""}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="What's this item called?"
          className="w-full text-3xl font-semibold text-slate-900 placeholder-slate-300 bg-transparent border-none outline-none py-2"
          autoFocus
        />
      </div>

      {/* Complexity Toggle */}
      <div className="py-4">
        <ComplexityToggle
          value={item.complexity}
          onChange={(complexity) => onChange({ complexity })}
        />
      </div>

      {/* Always visible fields */}
      <div className="space-y-3 py-2">
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">Code</span>
          <Input
            type="text"
            value={item.code || ""}
            onChange={(e) => onChange({ code: e.target.value })}
            placeholder="SKU-001"
            className="flex-1 h-9 text-sm"
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">Quantity</span>
            <Input
              type="number"
              value={item.quantity || ""}
              onChange={(e) => onChange({ quantity: parseInt(e.target.value) || 0 })}
              placeholder="0"
              className="flex-1 h-9 text-sm"
            />
          </div>
          {capacityHint && (
            <p className={`text-xs pl-20 ${
              capacityHint.type === "error" ? "text-rose-600" :
              capacityHint.type === "warning" ? "text-amber-600" :
              "text-slate-500"
            }`}>
              {capacityHint.message}
            </p>
          )}
        </div>
      </div>

      {/* Optional sections */}
      <div className="space-y-2 pt-4">
        {/* Attributes */}
        {!showAttributes ? (
          <button
            onClick={() => setShowAttributes(true)}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 py-1"
          >
            <Plus className="h-4 w-4" />
            Add attributes
          </button>
        ) : (
          <div className="space-y-2 py-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Attributes</span>
              <button
                onClick={() => {
                  setShowAttributes(false)
                  onChange({ attributes: [] })
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="pl-6">
              <AttributeBuilder
                attributes={item.attributes || []}
                onAdd={handleAddAttribute}
                onRemove={handleRemoveAttribute}
                presetSuggestions={presetSuggestions}
              />
            </div>
          </div>
        )}

        {/* Workflow */}
        {!showWorkflow ? (
          <button
            onClick={() => setShowWorkflow(true)}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 py-1"
          >
            <Plus className="h-4 w-4" />
            Add workflow
          </button>
        ) : (
          <div className="flex items-center gap-3 py-1">
            <span className="text-sm text-slate-500">Workflow</span>
            <Select value={item.workflow || ""} onValueChange={(value) => onChange({ workflow: value })}>
              <SelectTrigger className="flex-1 h-9 text-sm">
                <SelectValue placeholder="Select workflow" />
              </SelectTrigger>
              <SelectContent>
                {WORKFLOW_LIBRARY.map((workflow) => (
                  <SelectItem key={workflow.id} value={workflow.id}>
                    <div>
                      <div className="font-medium">{workflow.label}</div>
                      <div className="text-xs text-slate-500">{workflow.duration}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              onClick={() => {
                setShowWorkflow(false)
                onChange({ workflow: undefined })
              }}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Digital Passport */}
        {!showDigitalPassport ? (
          <button
            onClick={() => setShowDigitalPassport(true)}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 py-1"
          >
            <Plus className="h-4 w-4" />
            Add digital passport
          </button>
        ) : (
          <div className="py-1 pl-6">
            <DigitalPassportSection
              traceability={item.traceability}
              onChange={handleTraceabilityChange}
              onRemove={() => {
                setShowDigitalPassport(false)
                onChange({
                  traceability: {
                    enabled: false,
                    complianceRegions: [],
                    shareWithPartners: false,
                    includeLifecycleStages: false,
                    includeMaterialCertificates: false,
                    includeCarbonAccounting: false,
                  }
                })
              }}
            />
          </div>
        )}

        {/* Timeline */}
        {!showTimeline ? (
          <button
            onClick={() => setShowTimeline(true)}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 py-1"
          >
            <Plus className="h-4 w-4" />
            Add timeline
          </button>
        ) : (
          <div className="space-y-2 py-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Timeline</span>
              <button
                onClick={() => {
                  setShowTimeline(false)
                  onChange({ timeline: undefined })
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2 pl-6">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-16">Start</span>
                <Input
                  type="date"
                  value={item.timeline?.start || ""}
                  onChange={(e) => onChange({ 
                    timeline: { ...item.timeline, start: e.target.value, end: item.timeline?.end || "", location: item.timeline?.location || "" }
                  })}
                  className="flex-1 h-9 text-sm"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-16">End</span>
                <Input
                  type="date"
                  value={item.timeline?.end || ""}
                  onChange={(e) => onChange({ 
                    timeline: { ...item.timeline, end: e.target.value, start: item.timeline?.start || "", location: item.timeline?.location || "" }
                  })}
                  className="flex-1 h-9 text-sm"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-16">Location</span>
                <Select 
                  value={item.timeline?.location || ""} 
                  onValueChange={(value) => onChange({ 
                    timeline: { ...item.timeline, location: value, start: item.timeline?.start || "", end: item.timeline?.end || "" }
                  })}
                >
                  <SelectTrigger className="flex-1 h-9 text-sm">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATION_OPTIONS.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Label Fields */}
        {!showLabelFields ? (
          <button
            onClick={() => setShowLabelFields(true)}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 py-1"
          >
            <Plus className="h-4 w-4" />
            Add label fields
          </button>
        ) : (
          <div className="space-y-2 py-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Label Fields</span>
              <button
                onClick={() => {
                  setShowLabelFields(false)
                  onChange({ labelFields: [], includeLogo: false })
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2 pl-6">
              {STANDARD_LABEL_FIELDS.map((field) => (
                <label key={field.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(item.labelFields || []).some(f => f.id === field.id)}
                    onChange={() => toggleLabelField(field.id)}
                    className="h-4 w-4 rounded border-slate-300 text-sky-500"
                  />
                  <span className="text-sm text-slate-700">{field.label}</span>
                </label>
              ))}
              <label className="flex items-center gap-2 cursor-pointer pt-2 border-t border-slate-100">
                <input
                  type="checkbox"
                  checked={item.includeLogo}
                  onChange={(e) => onChange({ includeLogo: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-sky-500"
                />
                <span className="text-sm text-slate-700">Include logo</span>
              </label>
            </div>
          </div>
        )}

        {/* Attachments */}
        {!showAttachments ? (
          <button
            onClick={() => setShowAttachments(true)}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 py-1"
          >
            <Plus className="h-4 w-4" />
            Add attachments
          </button>
        ) : (
          <div className="space-y-2 py-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Attachments</span>
              <button
                onClick={() => {
                  setShowAttachments(false)
                  onChange({ attachments: [] })
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="pl-6">
              <button className="w-full text-sm text-slate-500 hover:text-slate-700 px-3 py-2 rounded-lg border-2 border-dashed border-slate-200 hover:border-slate-300">
                <Plus className="inline h-4 w-4 mr-2" />
                Upload files
              </button>
            </div>
          </div>
        )}

        {/* Components (only for complex items) */}
        {item.complexity === "complex" && (
          <>
            {(item.components || []).length === 0 ? (
              <button
                onClick={handleAddComponent}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 py-1"
              >
                <Plus className="h-4 w-4" />
                Add component
              </button>
            ) : (
              <div className="space-y-3 py-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700">Components</span>
                </div>
                <div className="space-y-3 pl-6">
                  {(item.components || []).map((component, idx) => (
                    <ComponentBuilder
                      key={component.id}
                      component={component}
                      index={idx}
                      onChange={(updates) => handleUpdateComponent(component.id, updates)}
                      onRemove={() => handleRemoveComponent(component.id)}
                    />
                  ))}
                  <button
                    onClick={handleAddComponent}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600"
                  >
                    <Plus className="h-4 w-4" />
                    Add another component
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

