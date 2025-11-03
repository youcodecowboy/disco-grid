"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, CheckSquare, PlusSquare, UserCheck, Calendar, Clock, Users, Layers, Hash, Filter } from "lucide-react"
import type { StageDependency, StageDependencyType, WorkflowStageV3 } from "@/lib/workflows-v3/types"
import { DEPENDENCY_TYPES } from "@/lib/workflows-v3/dependencyTypes"

interface DependencyBuilderProps {
  dependency: StageDependency | null
  allStages: WorkflowStageV3[]
  onChange: (updated: Partial<StageDependency>) => void
  onRemove: () => void
  isNew?: boolean
}

const ICON_MAP = {
  CheckSquare,
  PlusSquare,
  UserCheck,
  Calendar,
  Clock,
  Users,
  Layers,
  Hash,
  Filter
}

export function DependencyBuilder({ dependency, allStages, onChange, onRemove, isNew }: DependencyBuilderProps) {
  const [selectedType, setSelectedType] = useState<StageDependencyType | null>(
    dependency?.type || null
  )

  if (isNew && !selectedType) {
    // Show type selector
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-700">Select dependency type:</span>
          <button
            onClick={onRemove}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {Object.values(DEPENDENCY_TYPES).map(type => {
            const IconComponent = ICON_MAP[type.icon as keyof typeof ICON_MAP]
            return (
              <button
                key={type.type}
                onClick={() => {
                  setSelectedType(type.type)
                  onChange({ type: type.type, description: type.label, details: {} as any })
                }}
                className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 text-left hover:border-amber-300 hover:bg-amber-50 transition-colors"
              >
                {IconComponent && <IconComponent className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />}
                <div>
                  <div className="text-sm font-medium text-slate-900">{type.label}</div>
                  <div className="text-xs text-slate-500">{type.description}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  if (!dependency && !selectedType) return null

  const depType = dependency?.type || selectedType!
  const typeConfig = DEPENDENCY_TYPES[depType]
  const IconComponent = ICON_MAP[typeConfig.icon as keyof typeof ICON_MAP]

  return (
    <div className="rounded-xl border border-amber-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-amber-100 p-2 text-amber-600">
          {IconComponent && <IconComponent className="h-5 w-5" />}
        </div>

        <div className="flex-1 space-y-3">
          {/* Type selector */}
          <div className="flex items-center gap-2">
            <Select
              value={depType}
              onValueChange={(value: StageDependencyType) => onChange({ type: value })}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(DEPENDENCY_TYPES).map(type => {
                  const Icon = ICON_MAP[type.icon as keyof typeof ICON_MAP]
                  return (
                    <SelectItem key={type.type} value={type.type}>
                      <div className="flex items-center gap-2">
                        {Icon && <Icon className="h-4 w-4" />}
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <input
            type="text"
            value={dependency?.description || ""}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder={`Describe this ${typeConfig.label.toLowerCase()}...`}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />

          {/* Type-specific configuration */}
          <DependencyConfig
            type={depType}
            details={dependency?.details || {}}
            allStages={allStages}
            onChange={(details) => onChange({ details })}
          />
        </div>

        <button
          onClick={onRemove}
          className="text-slate-400 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// Type-specific configuration component
function DependencyConfig({
  type,
  details,
  allStages,
  onChange
}: {
  type: StageDependencyType
  details: any
  allStages: WorkflowStageV3[]
  onChange: (details: any) => void
}) {
  switch (type) {
    case "task_completion":
      return (
        <div className="space-y-2">
          <input
            type="text"
            value={details.taskTitle || ""}
            onChange={(e) => onChange({ ...details, taskTitle: e.target.value })}
            placeholder="Task title"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
      )

    case "approval":
      return (
        <div className="space-y-2">
          <input
            type="text"
            value={details.approverRole || ""}
            onChange={(e) => onChange({ ...details, approverRole: e.target.value })}
            placeholder="Approver role (e.g., Manager, Supervisor)"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
      )

    case "time_based":
      return (
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={details.delayAmount || ""}
            onChange={(e) => onChange({ ...details, delayAmount: parseInt(e.target.value) || 0 })}
            placeholder="Amount"
            min="1"
            className="w-24 rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <Select
            value={details.delayUnit || "hours"}
            onValueChange={(value) => onChange({ ...details, delayUnit: value })}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minutes">Minutes</SelectItem>
              <SelectItem value="hours">Hours</SelectItem>
              <SelectItem value="days">Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )

    case "capacity_based":
      return (
        <div className="space-y-2">
          <input
            type="text"
            value={details.teamName || ""}
            onChange={(e) => onChange({ ...details, teamName: e.target.value })}
            placeholder="Team name"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={details.thresholdPercent || ""}
              onChange={(e) => onChange({ ...details, thresholdPercent: parseInt(e.target.value) || 0 })}
              placeholder="50"
              min="1"
              max="100"
              className="w-24 rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
            <span className="text-sm text-slate-600">% capacity required</span>
          </div>
        </div>
      )

    case "quantity_threshold":
      return (
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={details.quantity || ""}
            onChange={(e) => onChange({ ...details, quantity: parseInt(e.target.value) || 0 })}
            placeholder="Quantity"
            min="1"
            className="w-32 rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <span className="text-sm text-slate-600">items must complete previous stage</span>
        </div>
      )

    case "custom_condition":
      return (
        <div className="space-y-2">
          <input
            type="text"
            value={details.attributeName || ""}
            onChange={(e) => onChange({ ...details, attributeName: e.target.value })}
            placeholder="Attribute name (e.g., fabricType, priority)"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <div className="flex items-center gap-2">
            <Select
              value={details.operator || "equals"}
              onValueChange={(value) => onChange({ ...details, operator: value })}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equals">Equals</SelectItem>
                <SelectItem value="not_equals">Not Equals</SelectItem>
                <SelectItem value="contains">Contains</SelectItem>
                <SelectItem value="greater">Greater</SelectItem>
                <SelectItem value="less">Less</SelectItem>
              </SelectContent>
            </Select>
            <input
              type="text"
              value={details.value || ""}
              onChange={(e) => onChange({ ...details, value: e.target.value })}
              placeholder="Value"
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
        </div>
      )

    default:
      return null
  }
}













