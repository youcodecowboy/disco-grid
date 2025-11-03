"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, QrCode, FileText, Camera, MapPin, Clock } from "lucide-react"
import type { WorkflowStageV3, StageInput, StageInputType } from "@/lib/workflows-v3/types"

interface StageInputsSectionProps {
  stage: WorkflowStageV3
  onChange: (updated: WorkflowStageV3) => void
}

const INPUT_TYPES = [
  { value: "qr_scan", label: "QR Scan", icon: QrCode, description: "Scan QR code to begin" },
  { value: "form", label: "Form", icon: FileText, description: "Fill out form data" },
  { value: "photo", label: "Photo", icon: Camera, description: "Take a photo" },
  { value: "location_check", label: "Location Check", icon: MapPin, description: "Verify location" },
  { value: "time_delay", label: "Time Delay", icon: Clock, description: "Wait for time" },
]

export function StageInputsSection({ stage, onChange }: StageInputsSectionProps) {
  const [showAddInput, setShowAddInput] = useState(false)

  const handleAddInput = (type: StageInputType) => {
    const newInput: StageInput = {
      id: `input-${Date.now()}`,
      type,
      label: "",
      required: true
    }
    onChange({ ...stage, inputs: [...stage.inputs, newInput] })
    setShowAddInput(false)
  }

  const handleUpdateInput = (inputId: string, updates: Partial<StageInput>) => {
    onChange({
      ...stage,
      inputs: stage.inputs.map(input =>
        input.id === inputId ? { ...input, ...updates } : input
      )
    })
  }

  const handleRemoveInput = (inputId: string) => {
    onChange({
      ...stage,
      inputs: stage.inputs.filter(input => input.id !== inputId)
    })
  }

  const getIconForType = (type: StageInputType) => {
    const typeConfig = INPUT_TYPES.find(t => t.value === type)
    return typeConfig?.icon || FileText
  }

  return (
    <div className="space-y-3">
      {stage.inputs.length === 0 && !showAddInput && (
        <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-center">
          <p className="text-sm text-slate-600">No inputs added yet. Add what needs to happen to BEGIN this stage.</p>
        </div>
      )}

      {/* Existing inputs */}
      {stage.inputs.map((input) => {
        const Icon = getIconForType(input.type)
        return (
          <div key={input.id} className="group rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                <Icon className="h-4 w-4" />
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <Select
                    value={input.type}
                    onValueChange={(value: StageInputType) => handleUpdateInput(input.id, { type: value })}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INPUT_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="h-4 w-4" />
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={input.required}
                      onChange={(e) => handleUpdateInput(input.id, { required: e.target.checked })}
                      className="rounded border-slate-300"
                    />
                    Required
                  </label>
                </div>

                <input
                  type="text"
                  value={input.label}
                  onChange={(e) => handleUpdateInput(input.id, { label: e.target.value })}
                  placeholder="Input label (e.g., 'Scan fabric roll QR code')"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>

              <button
                onClick={() => handleRemoveInput(input.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )
      })}

      {/* Add input button or type selector */}
      {!showAddInput ? (
        <button
          onClick={() => setShowAddInput(true)}
          className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white p-3 text-sm text-slate-600 hover:border-slate-400 hover:text-slate-900 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add input
        </button>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-700">Select input type:</span>
            <button
              onClick={() => setShowAddInput(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {INPUT_TYPES.map(type => (
              <button
                key={type.value}
                onClick={() => handleAddInput(type.value as StageInputType)}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-3 text-left hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <type.icon className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-sm font-medium text-slate-900">{type.label}</div>
                  <div className="text-xs text-slate-500">{type.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}













