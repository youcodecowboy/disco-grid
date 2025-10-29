"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { WorkflowStageV3 } from "@/lib/workflows-v3/types"
import { ArrowRight } from "lucide-react"

interface StageInfoSectionProps {
  stage: WorkflowStageV3
  allStages: WorkflowStageV3[]
  onChange: (updated: WorkflowStageV3) => void
}

export function StageInfoSection({ stage, allStages, onChange }: StageInfoSectionProps) {
  const previousStages = allStages.filter(s => s.sequence < stage.sequence)
  const parallelStages = allStages.filter(s => 
    s.sequence === stage.sequence && s.id !== stage.id
  )

  return (
    <div className="space-y-4">
      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Description (optional)
        </label>
        <textarea
          value={stage.description || ""}
          onChange={(e) => onChange({ ...stage, description: e.target.value })}
          placeholder="Describe what happens in this stage..."
          rows={2}
          className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm bg-white"
        />
      </div>

      {/* Type: Sequential or Parallel */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Execution Type
        </label>
        <Select
          value={stage.type}
          onValueChange={(value: "sequential" | "parallel") => onChange({ ...stage, type: value })}
        >
          <SelectTrigger className="w-full rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sequential">
              <div>
                <div className="font-medium">Sequential</div>
                <div className="text-xs text-slate-500">Must happen in order, one after another</div>
              </div>
            </SelectItem>
            <SelectItem value="parallel">
              <div>
                <div className="font-medium">Parallel</div>
                <div className="text-xs text-slate-500">Can run alongside other stages</div>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sequential: Show sequence info */}
      {stage.type === "sequential" && (
        <div className="rounded-xl bg-purple-50 p-4 border border-purple-200">
          <div className="flex items-center gap-2 text-sm text-purple-900">
            <span className="font-semibold">Stage {stage.sequence}</span>
            {previousStages.length > 0 && (
              <>
                <span>happens after</span>
                <ArrowRight className="h-4 w-4" />
                <Badge className="bg-purple-600 text-white">
                  Stage {stage.sequence - 1}
                </Badge>
              </>
            )}
          </div>
        </div>
      )}

      {/* Parallel: Show parallel stages */}
      {stage.type === "parallel" && parallelStages.length > 0 && (
        <div className="rounded-xl bg-amber-50 p-4 border border-amber-200">
          <div className="text-sm text-amber-900">
            <span className="font-semibold">Can run alongside:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {parallelStages.map(s => (
                <Badge key={s.id} className="bg-amber-600 text-white">
                  {s.name || `Stage ${s.sequence}`}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Team Assignment */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Assigned Team (optional)
        </label>
        <input
          type="text"
          value={stage.assignedTeam || ""}
          onChange={(e) => onChange({ ...stage, assignedTeam: e.target.value })}
          placeholder="e.g., Cutting Team, Sewing Team, QA Team"
          className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm bg-white"
        />
      </div>

      {/* Role Assignment */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Assigned Role (optional)
        </label>
        <input
          type="text"
          value={stage.assignedRole || ""}
          onChange={(e) => onChange({ ...stage, assignedRole: e.target.value })}
          placeholder="e.g., Cutter, Sewer, QA Inspector"
          className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm bg-white"
        />
      </div>

      {/* Estimated Duration */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Estimated Duration (optional)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={stage.estimatedDuration || ""}
            onChange={(e) => onChange({ ...stage, estimatedDuration: parseInt(e.target.value) || undefined })}
            placeholder="30"
            min="1"
            className="w-32 rounded-xl border border-slate-200 px-4 py-2 text-sm bg-white"
          />
          <span className="text-sm text-slate-600">minutes</span>
        </div>
      </div>
    </div>
  )
}





