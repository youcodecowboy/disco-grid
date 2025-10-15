"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, ChevronUp, GripVertical, Plus, X, AlertCircle } from "lucide-react"
import type { Play, PlayDependency, TaskPriority } from "@/lib/playbooks/types"
import { TriggerBuilder } from "./TriggerBuilder"
import { AssignmentPicker } from "./AssignmentPicker"

interface PlayCardProps {
  play: Play
  allPlays: Play[] // For dependency selection
  onChange: (play: Play) => void
  onRemove: () => void
}

export function PlayCard({ play, allPlays, onChange, onRemove }: PlayCardProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [showDescription, setShowDescription] = useState(!!play.description)

  // Filter out current play from dependency options
  const availableDependencies = allPlays.filter((p) => p.id !== play.id)

  const handleAddDependency = (playId: string) => {
    const dependencyPlay = allPlays.find((p) => p.id === playId)
    if (!dependencyPlay) return

    const newDependency: PlayDependency = {
      playId: dependencyPlay.id,
      playTitle: dependencyPlay.title,
      type: "finish_to_start",
    }

    onChange({
      ...play,
      dependencies: [...play.dependencies, newDependency],
    })
  }

  const handleRemoveDependency = (playId: string) => {
    onChange({
      ...play,
      dependencies: play.dependencies.filter((d) => d.playId !== playId),
    })
  }

  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start gap-3 p-4 border-b border-slate-100">
        <button
          type="button"
          className="text-slate-400 hover:text-slate-600 cursor-grab mt-1"
          title="Drag to reorder (future feature)"
        >
          <GripVertical className="h-5 w-5" />
        </button>

        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={play.title}
            onChange={(e) => onChange({ ...play, title: e.target.value })}
            placeholder="Play title (e.g., Order fabric from supplier)"
            className="w-full text-lg font-semibold text-slate-900 placeholder-slate-300 bg-transparent border-none outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-slate-600"
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>

          <button
            type="button"
            onClick={onRemove}
            className="text-slate-400 hover:text-rose-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Body */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Trigger Section */}
          <section>
            <TriggerBuilder
              value={play.trigger}
              onChange={(trigger) => onChange({ ...play, trigger })}
            />
          </section>

          {/* Task Details Section */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Task Details
            </h3>

            {/* Task Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Task Title</label>
              <input
                type="text"
                value={play.taskTemplate.title}
                onChange={(e) =>
                  onChange({
                    ...play,
                    taskTemplate: { ...play.taskTemplate, title: e.target.value },
                  })
                }
                placeholder="What task should be created?"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              />
            </div>

            {/* Task Description (Optional) */}
            {!showDescription ? (
              <button
                type="button"
                onClick={() => setShowDescription(true)}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 py-1"
              >
                <Plus className="h-4 w-4" />
                Add task description
              </button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">Task Description</label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDescription(false)
                      onChange({
                        ...play,
                        taskTemplate: { ...play.taskTemplate, description: undefined },
                      })
                    }}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <textarea
                  value={play.taskTemplate.description || ""}
                  onChange={(e) =>
                    onChange({
                      ...play,
                      taskTemplate: { ...play.taskTemplate, description: e.target.value },
                    })
                  }
                  placeholder="Add detailed instructions for the task..."
                  rows={3}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm bg-slate-50"
                />
              </div>
            )}

            {/* Priority & Duration Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Priority</label>
                <Select
                  value={play.taskTemplate.priority}
                  onValueChange={(val) =>
                    onChange({
                      ...play,
                      taskTemplate: { ...play.taskTemplate, priority: val as TaskPriority },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-rose-500" />
                        Critical
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-orange-500" />
                        High
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-amber-500" />
                        Medium
                      </div>
                    </SelectItem>
                    <SelectItem value="low">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-slate-400" />
                        Low
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Est. Duration</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={play.taskTemplate.estimatedMinutes || ""}
                    onChange={(e) =>
                      onChange({
                        ...play,
                        taskTemplate: {
                          ...play.taskTemplate,
                          estimatedMinutes: parseInt(e.target.value) || undefined,
                        },
                      })
                    }
                    placeholder="60"
                    className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm"
                  />
                  <span className="text-sm text-slate-600">minutes</span>
                </div>
              </div>
            </div>
          </section>

          {/* Assignment Section */}
          <section>
            <AssignmentPicker
              value={play.assignment}
              onChange={(assignment) => onChange({ ...play, assignment })}
            />
          </section>

          {/* Dependencies Section */}
          <section className="space-y-3">
            <label className="text-sm font-medium text-slate-700">Dependencies</label>

            {play.dependencies.length > 0 && (
              <div className="space-y-2">
                {play.dependencies.map((dep) => (
                  <div
                    key={dep.playId}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
                  >
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      <span className="text-sm text-slate-700">
                        Waits for <strong>{dep.playTitle}</strong> to complete
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDependency(dep.playId)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {availableDependencies.length > 0 && (
              <Select
                value=""
                onValueChange={(val) => handleAddDependency(val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Add dependency..." />
                </SelectTrigger>
                <SelectContent>
                  {availableDependencies
                    .filter((p) => !play.dependencies.some((d) => d.playId === p.id))
                    .map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}

            {play.dependencies.length === 0 && availableDependencies.length === 0 && (
              <p className="text-xs text-slate-500">
                Add more plays to this playbook to create dependencies
              </p>
            )}

            {play.dependencies.length === 0 && availableDependencies.length > 0 && (
              <p className="text-xs text-slate-500">
                No dependencies - this task will trigger immediately when conditions are met
              </p>
            )}
          </section>

          {/* Status Badge */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Badge
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                play.enabled
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {play.enabled ? "Enabled" : "Disabled"}
            </Badge>

            <button
              type="button"
              onClick={() => onChange({ ...play, enabled: !play.enabled })}
              className="text-xs font-medium text-sky-600 hover:text-sky-700"
            >
              {play.enabled ? "Disable" : "Enable"}
            </button>
          </div>
        </div>
      )}

      {/* Collapsed Summary */}
      {!isExpanded && (
        <div className="p-4 flex items-center gap-3 text-sm text-slate-600">
          <Badge className="rounded-full bg-slate-100 text-slate-700 text-xs px-2 py-0.5">
            {play.trigger.type.replace(/_/g, " ")}
          </Badge>
          <span>→</span>
          <span className="text-slate-900 font-medium">{play.taskTemplate.title}</span>
        </div>
      )}
    </div>
  )
}

