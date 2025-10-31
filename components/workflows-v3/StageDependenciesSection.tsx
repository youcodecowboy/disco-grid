"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import type { WorkflowStageV3, StageDependency, StageDependencyType } from "@/lib/workflows-v3/types"
import { DependencyBuilder } from "./DependencyBuilder"

interface StageDependenciesSectionProps {
  stage: WorkflowStageV3
  allStages: WorkflowStageV3[]
  onChange: (updated: WorkflowStageV3) => void
}

export function StageDependenciesSection({ stage, allStages, onChange }: StageDependenciesSectionProps) {
  const [showAddDependency, setShowAddDependency] = useState(false)

  const handleAddDependency = (type: StageDependencyType) => {
    const newDependency: StageDependency = {
      id: `dep-${Date.now()}`,
      type,
      description: "",
      details: {} as any
    }
    onChange({ ...stage, dependencies: [...stage.dependencies, newDependency] })
    setShowAddDependency(false)
  }

  const handleUpdateDependency = (depId: string, updates: Partial<StageDependency>) => {
    onChange({
      ...stage,
      dependencies: stage.dependencies.map(dep =>
        dep.id === depId ? { ...dep, ...updates } : dep
      )
    })
  }

  const handleRemoveDependency = (depId: string) => {
    onChange({
      ...stage,
      dependencies: stage.dependencies.filter(dep => dep.id !== depId)
    })
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
        <p className="text-sm text-amber-900">
          <strong>Dependencies are the core logic</strong> of your workflow. They define what must happen before this stage can begin or complete. Add task completions, approvals, time delays, capacity checks, and more.
        </p>
      </div>

      {stage.dependencies.length === 0 && !showAddDependency && (
        <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-center">
          <p className="text-sm text-slate-600">No dependencies added yet. Add what must happen before this stage can start.</p>
        </div>
      )}

      {/* Existing dependencies */}
      {stage.dependencies.map((dependency) => (
        <div key={dependency.id} className="group">
          <DependencyBuilder
            dependency={dependency}
            allStages={allStages}
            onChange={(updated) => handleUpdateDependency(dependency.id, updated)}
            onRemove={() => handleRemoveDependency(dependency.id)}
          />
        </div>
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
          onChange={(dep) => {
            if (dep) {
              handleAddDependency(dep.type)
            }
          }}
          onRemove={() => setShowAddDependency(false)}
          isNew
        />
      )}
    </div>
  )
}









