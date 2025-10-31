"use client"

import { useState } from "react"
import { Plus, Link } from "lucide-react"
import type { LimboZone, WorkflowStageV3, StageDependency } from "@/lib/workflows-v3/types"
import { DependencyBuilder } from "./DependencyBuilder"

interface LimboZoneCardProps {
  limboZone: LimboZone
  allStages: WorkflowStageV3[]
  onChange: (updated: LimboZone) => void
}

export function LimboZoneCard({ limboZone, allStages, onChange }: LimboZoneCardProps) {
  const [showAddDependency, setShowAddDependency] = useState(false)

  const fromStage = allStages.find(s => s.id === limboZone.betweenStages[0])
  const toStage = allStages.find(s => s.id === limboZone.betweenStages[1])

  const handleAddDependency = (dependency: Partial<StageDependency>) => {
    const newDep: StageDependency = {
      id: `limbo-dep-${Date.now()}`,
      type: dependency.type!,
      description: dependency.description || "",
      details: dependency.details || {}
    }
    onChange({
      ...limboZone,
      dependencies: [...limboZone.dependencies, newDep]
    })
    setShowAddDependency(false)
  }

  const handleUpdateDependency = (depId: string, updates: Partial<StageDependency>) => {
    onChange({
      ...limboZone,
      dependencies: limboZone.dependencies.map(dep =>
        dep.id === depId ? { ...dep, ...updates } : dep
      )
    })
  }

  const handleRemoveDependency = (depId: string) => {
    onChange({
      ...limboZone,
      dependencies: limboZone.dependencies.filter(dep => dep.id !== depId)
    })
  }

  return (
    <div className="rounded-2xl border border-slate-300 bg-slate-50/50 p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="rounded-xl bg-slate-200 p-2 text-slate-600">
          <Link className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h4 className="text-base font-semibold text-slate-800 mb-1">
            Limbo Zone
          </h4>
          <p className="text-sm text-slate-600">
            Between <span className="font-medium">{fromStage?.name || "Stage"}</span> and{" "}
            <span className="font-medium">{toStage?.name || "Stage"}</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Dependencies here don't change item status but block progression to the next stage
          </p>
        </div>
      </div>

      {/* Question prompt */}
      {limboZone.dependencies.length === 0 && !showAddDependency && (
        <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-4 mb-3">
          <p className="text-sm text-slate-700 font-medium text-center">
            Does anything need to happen between {fromStage?.name || "this stage"} and {toStage?.name || "the next stage"}?
          </p>
          <p className="text-xs text-slate-500 text-center mt-1">
            Examples: Change thread, wait for approval, prep machines
          </p>
        </div>
      )}

      {/* Dependencies */}
      <div className="space-y-3">
        {limboZone.dependencies.map((dependency) => (
          <DependencyBuilder
            key={dependency.id}
            dependency={dependency}
            allStages={allStages}
            onChange={(updated) => handleUpdateDependency(dependency.id, updated)}
            onRemove={() => handleRemoveDependency(dependency.id)}
          />
        ))}

        {/* Add dependency button */}
        {!showAddDependency ? (
          <button
            onClick={() => setShowAddDependency(true)}
            className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white p-3 text-sm text-slate-600 hover:border-slate-400 hover:text-slate-900 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add dependency
          </button>
        ) : (
          <DependencyBuilder
            dependency={null}
            allStages={allStages}
            onChange={handleAddDependency}
            onRemove={() => setShowAddDependency(false)}
            isNew
          />
        )}
      </div>
    </div>
  )
}









