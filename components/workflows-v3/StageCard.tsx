"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    ChevronDown,
    ChevronRight,
    X,
    CheckCircle2,
    Layers,
    Circle
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { WorkflowStageV3 } from "@/lib/workflows-v3/types"
import { StageInfoSection } from "./StageInfoSection"
import { StageInputsSection } from "./StageInputsSection"
import { StageDependenciesSection } from "./StageDependenciesSection"
import { StageOutputsSection } from "./StageOutputsSection"
import { StageRefinementQuestions } from "./StageRefinementQuestions"

interface StageCardProps {
  stage: WorkflowStageV3
  allStages: WorkflowStageV3[]
  onChange: (updated: WorkflowStageV3) => void
  onRemove: () => void
  onComplete: () => void
}

export function StageCard({ stage, allStages, onChange, onRemove, onComplete }: StageCardProps) {
  const [isExpanded, setIsExpanded] = useState(stage.isExpanded)

  const toggleExpanded = () => {
    const newExpanded = !isExpanded
    setIsExpanded(newExpanded)
    onChange({ ...stage, isExpanded: newExpanded })
  }

  const handleComplete = () => {
    onChange({ ...stage, isComplete: true, isExpanded: false })
    setIsExpanded(false)
    onComplete()
  }

  // Check if stage has minimum required info
  const hasName = stage.name.trim().length > 0
  const hasInput = stage.inputs.length > 0
  const hasOutput = stage.outputs.length > 0
  const isConfigurable = hasName && hasInput && hasOutput

  if (!isExpanded) {
    // Collapsed state
    return (
      <div
        onClick={toggleExpanded}
        className="rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-slate-300"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              {/* Sequence badge */}
              <Badge className="rounded-full bg-blue-100 text-blue-700 text-xs font-bold px-2">
                {stage.sequence}
              </Badge>

              {/* Stage name */}
              <h3 className="text-lg font-bold text-slate-900">
                {stage.name || "Untitled Stage"}
              </h3>

              {/* Type badge */}
              <Badge className={cn(
                "rounded-full text-xs",
                stage.type === "sequential" 
                  ? "bg-purple-100 text-purple-700"
                  : "bg-amber-100 text-amber-700"
              )}>
                {stage.type === "sequential" ? "Sequential" : "Parallel"}
              </Badge>

              {/* Complete badge */}
              {stage.isComplete && (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              )}
            </div>

            {/* Summary row */}
            <div className="flex items-center gap-4 text-sm text-slate-600">
              {stage.assignedTeam && (
                <span className="font-medium">Team: {stage.assignedTeam}</span>
              )}
              {stage.inputs.length > 0 && (
                <span>Input: {stage.inputs[0].label}</span>
              )}
              {stage.outputs.length > 0 && (
                <span>Output: {stage.outputs[0].label}</span>
              )}
              {stage.dependencies.length > 0 && (
                <span>{stage.dependencies.length} {stage.dependencies.length === 1 ? 'dependency' : 'dependencies'}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                toggleExpanded()
              }}
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Expanded state
  return (
    <div className="rounded-2xl border-2 border-blue-300 bg-white shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white p-5 border-b border-slate-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Sequence badge */}
            <Badge className="rounded-full bg-blue-600 text-white text-sm font-bold px-3 py-1">
              Stage {stage.sequence}
            </Badge>

            {/* Icon */}
            <div className="rounded-xl bg-blue-100 p-2 text-blue-600">
              <Layers className="h-5 w-5" />
            </div>

            {/* Title input */}
            <input
              type="text"
              value={stage.name}
              onChange={(e) => onChange({ ...stage, name: e.target.value })}
              placeholder="Stage name (e.g., Cutting, Sewing, QA)"
              className="text-xl font-bold text-slate-900 placeholder-slate-400 bg-transparent border-none outline-none min-w-[300px]"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleExpanded}
              className="rounded-full"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Sections Container */}
      <div className="p-6 space-y-6">
        {/* Section 1: Stage Info (Top Bun) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <Circle className="h-4 w-4 text-slate-400" />
            <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
              Section 1: Stage Info
            </h4>
            <span className="text-xs text-slate-500">(Top Bun)</span>
          </div>
          <StageInfoSection
            stage={stage}
            allStages={allStages}
            onChange={onChange}
          />
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200" />

        {/* Section 2: Inputs (Lettuce) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <Circle className="h-4 w-4 text-slate-400" />
            <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
              Section 2: Inputs
            </h4>
            <span className="text-xs text-slate-500">(What begins this stage)</span>
          </div>
          <StageInputsSection
            stage={stage}
            onChange={onChange}
          />
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200" />

        {/* Section 3: Dependencies (Meat - The Core) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <Circle className="h-4 w-4 text-slate-400" />
            <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
              Section 3: Dependencies
            </h4>
            <span className="text-xs text-slate-500">(The meat - core logic)</span>
          </div>
          <StageDependenciesSection
            stage={stage}
            allStages={allStages}
            onChange={onChange}
          />
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200" />

        {/* Section 4: Outputs (Bottom Bun) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <Circle className="h-4 w-4 text-slate-400" />
            <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
              Section 4: Outputs
            </h4>
            <span className="text-xs text-slate-500">(What completes this stage)</span>
          </div>
          <StageOutputsSection
            stage={stage}
            onChange={onChange}
          />
        </div>
      </div>

      {/* Refinement Questions - appears just before footer */}
      <StageRefinementQuestions
        stage={stage}
        onStageUpdate={onChange}
      />

      {/* Footer */}
      <div className="bg-slate-50 p-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">
            {!isConfigurable && (
              <span className="text-amber-600 font-medium">
                ⚠️ Add stage name, at least one input, and one output to complete
              </span>
            )}
          </div>

          <Button
            onClick={handleComplete}
            disabled={!isConfigurable}
            className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Complete stage configuration
          </Button>
        </div>
      </div>
    </div>
  )
}

