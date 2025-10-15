"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    GitBranch,
    CheckCircle2,
    PackageCheck,
    PackageX,
    Calendar,
    Clock,
    Gauge,
    ArrowLeft,
    Zap,
} from "lucide-react"
import type { TriggerCondition, TriggerType } from "@/lib/playbooks/types"
import { TRIGGER_TYPE_OPTIONS } from "@/lib/playbooks/mockData"
import { MOCK_TEAMS } from "@/lib/tasks-v2/mockData"

interface TriggerBuilderProps {
  value: TriggerCondition | null
  onChange: (trigger: TriggerCondition) => void
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  GitBranch,
  CheckCircle2,
  PackageCheck,
  PackageX,
  Calendar,
  Clock,
  Gauge,
  ArrowLeft,
}

export function TriggerBuilder({ value, onChange }: TriggerBuilderProps) {
  const [triggerType, setTriggerType] = useState<TriggerType | "">(value?.type || "")

  const handleTypeChange = (type: TriggerType) => {
    setTriggerType(type)
    
    // Create default trigger based on type
    let defaultTrigger: TriggerCondition
    
    switch (type) {
      case "workflow_stage_change":
        defaultTrigger = {
          type: "workflow_stage_change",
          workflowId: "",
          workflowName: "",
          stageId: "",
          stageName: "",
          condition: "enters",
        }
        break
      case "task_completion":
        defaultTrigger = {
          type: "task_completion",
        }
        break
      case "order_accepted":
        defaultTrigger = {
          type: "order_accepted",
        }
        break
      case "order_completed":
        defaultTrigger = {
          type: "order_completed",
        }
        break
      case "date_based":
        defaultTrigger = {
          type: "date_based",
          mode: "relative_to_order",
          relativeOffset: {
            days: 1,
            relativeTo: "order_accepted",
          },
        }
        break
      case "time_based":
        defaultTrigger = {
          type: "time_based",
          frequency: "daily",
          time: "09:00",
          timezone: "America/New_York",
        }
        break
      case "capacity_based":
        defaultTrigger = {
          type: "capacity_based",
          teamId: "",
          teamName: "",
          thresholdType: "below",
          thresholdPercent: 50,
        }
        break
      case "order_completion_previous":
        defaultTrigger = {
          type: "order_completion_previous",
          lookbackOrders: 1,
        }
        break
      default:
        return
    }
    
    onChange(defaultTrigger)
  }

  return (
    <div className="space-y-3">
      {/* Trigger Type Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Trigger Event</label>
        <Select
          value={triggerType}
          onValueChange={(val) => handleTypeChange(val as TriggerType)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a trigger event..." />
          </SelectTrigger>
          <SelectContent>
            {TRIGGER_TYPE_OPTIONS.map((option) => {
              const Icon = iconMap[option.icon] || Zap
              return (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-slate-500" />
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Trigger Configuration based on type */}
      {value && <TriggerConfig trigger={value} onChange={onChange} />}
    </div>
  )
}

function TriggerConfig({
  trigger,
  onChange,
}: {
  trigger: TriggerCondition
  onChange: (trigger: TriggerCondition) => void
}) {
  switch (trigger.type) {
    case "workflow_stage_change":
      return <WorkflowStageTriggerConfig trigger={trigger} onChange={onChange} />
    case "task_completion":
      return <TaskCompletionTriggerConfig trigger={trigger} onChange={onChange} />
    case "order_accepted":
      return <OrderAcceptedTriggerConfig />
    case "order_completed":
      return <OrderCompletedTriggerConfig trigger={trigger} onChange={onChange} />
    case "date_based":
      return <DateBasedTriggerConfig trigger={trigger} onChange={onChange} />
    case "time_based":
      return <TimeBasedTriggerConfig trigger={trigger} onChange={onChange} />
    case "capacity_based":
      return <CapacityBasedTriggerConfig trigger={trigger} onChange={onChange} />
    case "order_completion_previous":
      return <OrderCompletionPreviousTriggerConfig trigger={trigger} onChange={onChange} />
    default:
      return null
  }
}

// Individual trigger config components

function WorkflowStageTriggerConfig({
  trigger,
  onChange,
}: {
  trigger: Extract<TriggerCondition, { type: "workflow_stage_change" }>
  onChange: (trigger: TriggerCondition) => void
}) {
  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3">
      <div className="flex items-center gap-2 text-xs text-slate-600">
        <Zap className="h-3 w-3" />
        <span>When item...</span>
      </div>
      
      <Select
        value={trigger.condition}
        onValueChange={(val) => onChange({ ...trigger, condition: val as typeof trigger.condition })}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="enters">Enters stage</SelectItem>
          <SelectItem value="exits">Exits stage</SelectItem>
          <SelectItem value="completes">Completes stage</SelectItem>
        </SelectContent>
      </Select>

      <input
        type="text"
        placeholder="Workflow name (e.g., Cut & Sew v4)"
        value={trigger.workflowName}
        onChange={(e) => onChange({ ...trigger, workflowName: e.target.value })}
        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
      />

      <input
        type="text"
        placeholder="Stage name (e.g., Cutting)"
        value={trigger.stageName}
        onChange={(e) => onChange({ ...trigger, stageName: e.target.value })}
        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
      />
    </div>
  )
}

function TaskCompletionTriggerConfig({
  trigger,
  onChange,
}: {
  trigger: Extract<TriggerCondition, { type: "task_completion" }>
  onChange: (trigger: TriggerCondition) => void
}) {
  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3">
      <div className="flex items-center gap-2 text-xs text-slate-600">
        <Zap className="h-3 w-3" />
        <span>When task completes...</span>
      </div>
      
      <input
        type="text"
        placeholder="Task title or description"
        value={trigger.taskTitle || ""}
        onChange={(e) => onChange({ ...trigger, taskTitle: e.target.value })}
        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
      />
      
      <p className="text-xs text-slate-500">
        Leave blank to trigger on any task completion, or specify a task title
      </p>
    </div>
  )
}

function OrderAcceptedTriggerConfig() {
  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3">
      <div className="flex items-center gap-2 text-xs text-emerald-700">
        <PackageCheck className="h-3 w-3" />
        <span>Triggers when any order is accepted</span>
      </div>
    </div>
  )
}

function OrderCompletedTriggerConfig({
  trigger,
  onChange,
}: {
  trigger: Extract<TriggerCondition, { type: "order_completed" }>
  onChange: (trigger: TriggerCondition) => void
}) {
  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3">
      <div className="flex items-center gap-2 text-xs text-slate-600">
        <Zap className="h-3 w-3" />
        <span>When order completes...</span>
      </div>
      
      <input
        type="text"
        placeholder="Order ID (leave blank for any order)"
        value={trigger.orderId || ""}
        onChange={(e) => onChange({ ...trigger, orderId: e.target.value || undefined })}
        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
      />
    </div>
  )
}

function DateBasedTriggerConfig({
  trigger,
  onChange,
}: {
  trigger: Extract<TriggerCondition, { type: "date_based" }>
  onChange: (trigger: TriggerCondition) => void
}) {
  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3">
      <div className="flex items-center gap-2 text-xs text-slate-600">
        <Zap className="h-3 w-3" />
        <span>Date trigger...</span>
      </div>
      
      <Select
        value={trigger.mode}
        onValueChange={(val) =>
          onChange({
            ...trigger,
            mode: val as typeof trigger.mode,
          })
        }
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="specific_date">Specific date</SelectItem>
          <SelectItem value="relative_to_order">Relative to order</SelectItem>
        </SelectContent>
      </Select>

      {trigger.mode === "specific_date" && (
        <input
          type="date"
          value={trigger.specificDate?.split("T")[0] || ""}
          onChange={(e) =>
            onChange({ ...trigger, specificDate: e.target.value ? `${e.target.value}T00:00:00Z` : undefined })
          }
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
        />
      )}

      {trigger.mode === "relative_to_order" && trigger.relativeOffset && (
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            value={trigger.relativeOffset.days}
            onChange={(e) =>
              onChange({
                ...trigger,
                relativeOffset: {
                  ...trigger.relativeOffset!,
                  days: parseInt(e.target.value) || 0,
                },
              })
            }
            className="w-20 rounded-md border border-slate-200 px-3 py-2 text-sm"
          />
          <span className="text-sm text-slate-600">days after</span>
          <Select
            value={trigger.relativeOffset.relativeTo}
            onValueChange={(val) =>
              onChange({
                ...trigger,
                relativeOffset: {
                  ...trigger.relativeOffset!,
                  relativeTo: val as typeof trigger.relativeOffset.relativeTo,
                },
              })
            }
          >
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="order_accepted">Order accepted</SelectItem>
              <SelectItem value="order_start">Order start</SelectItem>
              <SelectItem value="order_due">Order due date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}

function TimeBasedTriggerConfig({
  trigger,
  onChange,
}: {
  trigger: Extract<TriggerCondition, { type: "time_based" }>
  onChange: (trigger: TriggerCondition) => void
}) {
  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3">
      <div className="flex items-center gap-2 text-xs text-slate-600">
        <Zap className="h-3 w-3" />
        <span>Repeating schedule...</span>
      </div>
      
      <Select
        value={trigger.frequency}
        onValueChange={(val) => onChange({ ...trigger, frequency: val as typeof trigger.frequency })}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
        </SelectContent>
      </Select>

      {trigger.frequency === "weekly" && (
        <Select
          value={trigger.weekday?.toString() || "1"}
          onValueChange={(val) => onChange({ ...trigger, weekday: parseInt(val) })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Monday</SelectItem>
            <SelectItem value="2">Tuesday</SelectItem>
            <SelectItem value="3">Wednesday</SelectItem>
            <SelectItem value="4">Thursday</SelectItem>
            <SelectItem value="5">Friday</SelectItem>
            <SelectItem value="6">Saturday</SelectItem>
            <SelectItem value="0">Sunday</SelectItem>
          </SelectContent>
        </Select>
      )}

      {trigger.frequency === "monthly" && (
        <input
          type="number"
          min="1"
          max="31"
          placeholder="Day of month (1-31)"
          value={trigger.dayOfMonth || ""}
          onChange={(e) => onChange({ ...trigger, dayOfMonth: parseInt(e.target.value) || undefined })}
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
        />
      )}

      <input
        type="time"
        value={trigger.time}
        onChange={(e) => onChange({ ...trigger, time: e.target.value })}
        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
      />
    </div>
  )
}

function CapacityBasedTriggerConfig({
  trigger,
  onChange,
}: {
  trigger: Extract<TriggerCondition, { type: "capacity_based" }>
  onChange: (trigger: TriggerCondition) => void
}) {
  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3">
      <div className="flex items-center gap-2 text-xs text-slate-600">
        <Zap className="h-3 w-3" />
        <span>When team capacity...</span>
      </div>
      
      <Select
        value={trigger.teamId}
        onValueChange={(val) => {
          const team = MOCK_TEAMS.find((t) => t.id === val)
          onChange({ ...trigger, teamId: val, teamName: team?.name || "" })
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select team..." />
        </SelectTrigger>
        <SelectContent>
          {MOCK_TEAMS.map((team) => (
            <SelectItem key={team.id} value={team.id}>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: team.color }} />
                {team.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <Select
          value={trigger.thresholdType}
          onValueChange={(val) => onChange({ ...trigger, thresholdType: val as typeof trigger.thresholdType })}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="below">Below</SelectItem>
            <SelectItem value="above">Above</SelectItem>
          </SelectContent>
        </Select>

        <input
          type="number"
          min="0"
          max="100"
          value={trigger.thresholdPercent}
          onChange={(e) => onChange({ ...trigger, thresholdPercent: parseInt(e.target.value) || 0 })}
          className="w-20 rounded-md border border-slate-200 px-3 py-2 text-sm text-right"
        />
        <span className="text-sm text-slate-600">%</span>
      </div>
    </div>
  )
}

function OrderCompletionPreviousTriggerConfig({
  trigger,
  onChange,
}: {
  trigger: Extract<TriggerCondition, { type: "order_completion_previous" }>
  onChange: (trigger: TriggerCondition) => void
}) {
  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3">
      <div className="flex items-center gap-2 text-xs text-slate-600">
        <Zap className="h-3 w-3" />
        <span>When previous order completes...</span>
      </div>
      
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="1"
          value={trigger.lookbackOrders}
          onChange={(e) => onChange({ ...trigger, lookbackOrders: parseInt(e.target.value) || 1 })}
          className="w-20 rounded-md border border-slate-200 px-3 py-2 text-sm"
        />
        <span className="text-sm text-slate-600">order(s) back</span>
      </div>
      
      <p className="text-xs text-slate-500">
        1 = immediately previous order, 2 = two orders back, etc.
      </p>
    </div>
  )
}

