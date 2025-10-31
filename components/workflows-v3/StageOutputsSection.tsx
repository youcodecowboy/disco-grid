"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, QrCode, FileText, Camera, UserCheck, Ruler, Hash, FileSignature } from "lucide-react"
import type { WorkflowStageV3, StageOutput, StageOutputType } from "@/lib/workflows-v3/types"

interface StageOutputsSectionProps {
  stage: WorkflowStageV3
  onChange: (updated: WorkflowStageV3) => void
}

const OUTPUT_TYPES = [
  { value: "qr_scan", label: "QR Scan", icon: QrCode, description: "Scan to mark complete" },
  { value: "form_submit", label: "Form Submit", icon: FileText, description: "Submit form data" },
  { value: "photo", label: "Photo", icon: Camera, description: "Take completion photo" },
  { value: "approval", label: "Approval", icon: UserCheck, description: "Get approval/sign-off" },
  { value: "measurement", label: "Measurement", icon: Ruler, description: "Record measurements" },
  { value: "count", label: "Count", icon: Hash, description: "Count items" },
  { value: "sign_off", label: "Sign Off", icon: FileSignature, description: "Digital signature" },
]

export function StageOutputsSection({ stage, onChange }: StageOutputsSectionProps) {
  const [showAddOutput, setShowAddOutput] = useState(false)

  const handleAddOutput = (type: StageOutputType) => {
    const newOutput: StageOutput = {
      id: `output-${Date.now()}`,
      type,
      label: "",
      required: true
    }
    onChange({ ...stage, outputs: [...stage.outputs, newOutput] })
    setShowAddOutput(false)
  }

  const handleUpdateOutput = (outputId: string, updates: Partial<StageOutput>) => {
    onChange({
      ...stage,
      outputs: stage.outputs.map(output =>
        output.id === outputId ? { ...output, ...updates } : output
      )
    })
  }

  const handleRemoveOutput = (outputId: string) => {
    onChange({
      ...stage,
      outputs: stage.outputs.filter(output => output.id !== outputId)
    })
  }

  const getIconForType = (type: StageOutputType) => {
    const typeConfig = OUTPUT_TYPES.find(t => t.value === type)
    return typeConfig?.icon || FileText
  }

  return (
    <div className="space-y-3">
      {stage.outputs.length === 0 && !showAddOutput && (
        <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-center">
          <p className="text-sm text-slate-600">No outputs added yet. Add what needs to happen to COMPLETE this stage.</p>
        </div>
      )}

      {/* Existing outputs */}
      {stage.outputs.map((output) => {
        const Icon = getIconForType(output.type)
        return (
          <div key={output.id} className="group rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600">
                <Icon className="h-4 w-4" />
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <Select
                    value={output.type}
                    onValueChange={(value: StageOutputType) => handleUpdateOutput(output.id, { type: value })}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {OUTPUT_TYPES.map(type => (
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
                      checked={output.required}
                      onChange={(e) => handleUpdateOutput(output.id, { required: e.target.checked })}
                      className="rounded border-slate-300"
                    />
                    Required
                  </label>
                </div>

                <input
                  type="text"
                  value={output.label}
                  onChange={(e) => handleUpdateOutput(output.id, { label: e.target.value })}
                  placeholder="Output label (e.g., 'Quality inspection checklist')"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>

              <button
                onClick={() => handleRemoveOutput(output.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )
      })}

      {/* Add output button or type selector */}
      {!showAddOutput ? (
        <button
          onClick={() => setShowAddOutput(true)}
          className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white p-3 text-sm text-slate-600 hover:border-slate-400 hover:text-slate-900 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add output
        </button>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-700">Select output type:</span>
            <button
              onClick={() => setShowAddOutput(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {OUTPUT_TYPES.map(type => (
              <button
                key={type.value}
                onClick={() => handleAddOutput(type.value as StageOutputType)}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-3 text-left hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
              >
                <type.icon className="h-5 w-5 text-emerald-600" />
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









