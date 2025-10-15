// Component Builder for complex items - Mini Lego form

import { useState } from "react"
import { ChevronDown, ChevronRight, X, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AttributeBuilder } from "./AttributeBuilder"
import type { Component, ComponentAttribute } from "@/lib/orders-v2/types"
import { WORKFLOW_LIBRARY } from "@/lib/orders-v2/types"

type ComponentBuilderProps = {
  component: Component
  index: number
  onChange: (updates: Partial<Component>) => void
  onRemove: () => void
}

export function ComponentBuilder({ component, index, onChange, onRemove }: ComponentBuilderProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [showWorkflow, setShowWorkflow] = useState(!!component.workflow)
  const [showNotes, setShowNotes] = useState(!!component.notes)
  const [showAttributes, setShowAttributes] = useState(component.attributes.length > 0)

  const handleAddAttribute = (field: string, value: string) => {
    const newAttr: ComponentAttribute = {
      id: `comp-attr-${Date.now()}`,
      field,
      value
    }
    onChange({ attributes: [...component.attributes, newAttr] })
  }

  const handleRemoveAttribute = (id: string) => {
    onChange({ attributes: component.attributes.filter(attr => attr.id !== id) })
  }

  return (
    <div className="rounded-xl border-2 border-slate-200 bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-500 hover:text-slate-700"
        >
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        <div className="flex-1">
          <Input
            type="text"
            value={component.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder={`Component ${index + 1} name`}
            className="border-none shadow-none px-0 font-medium text-slate-900 h-auto"
          />
        </div>
        <button
          onClick={onRemove}
          className="text-slate-400 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 space-y-3">
          {/* Basic fields */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 w-20">Quantity</span>
            <Input
              type="number"
              value={component.quantity || ""}
              onChange={(e) => onChange({ quantity: parseInt(e.target.value) || 0 })}
              placeholder="0"
              className="flex-1 h-8 text-sm"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 w-20">QR Mode</span>
            <Select value={component.qrMode} onValueChange={(value) => onChange({ qrMode: value })}>
              <SelectTrigger className="flex-1 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unique">Unique per unit</SelectItem>
                <SelectItem value="batch">Batch code</SelectItem>
                <SelectItem value="shared">Shared code</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Optional sections */}
          <div className="space-y-2 pt-2">
            {/* Workflow */}
            {!showWorkflow ? (
              <button
                onClick={() => setShowWorkflow(true)}
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-600"
              >
                <Plus className="h-3 w-3" />
                Add workflow
              </button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-700">Workflow</span>
                  <button
                    onClick={() => {
                      setShowWorkflow(false)
                      onChange({ workflow: undefined })
                    }}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
                <Select value={component.workflow} onValueChange={(value) => onChange({ workflow: value })}>
                  <SelectTrigger className="w-full h-8 text-xs">
                    <SelectValue placeholder="Select workflow" />
                  </SelectTrigger>
                  <SelectContent>
                    {WORKFLOW_LIBRARY.map((workflow) => (
                      <SelectItem key={workflow.id} value={workflow.id}>
                        {workflow.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Notes */}
            {!showNotes ? (
              <button
                onClick={() => setShowNotes(true)}
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-600"
              >
                <Plus className="h-3 w-3" />
                Add notes
              </button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-700">Notes</span>
                  <button
                    onClick={() => {
                      setShowNotes(false)
                      onChange({ notes: "" })
                    }}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
                <textarea
                  value={component.notes}
                  onChange={(e) => onChange({ notes: e.target.value })}
                  placeholder="Add notes about this component..."
                  className="w-full text-xs text-slate-700 placeholder-slate-400 bg-white border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-slate-400 min-h-[60px] resize-none"
                />
              </div>
            )}

            {/* Attributes */}
            {!showAttributes ? (
              <button
                onClick={() => setShowAttributes(true)}
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-600"
              >
                <Plus className="h-3 w-3" />
                Add attributes
              </button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-700">Attributes</span>
                  <button
                    onClick={() => {
                      setShowAttributes(false)
                      onChange({ attributes: [] })
                    }}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
                <div className="text-xs">
                  <AttributeBuilder
                    attributes={component.attributes}
                    onAdd={handleAddAttribute}
                    onRemove={handleRemoveAttribute}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

