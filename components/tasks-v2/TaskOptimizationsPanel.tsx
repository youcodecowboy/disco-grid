"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Sparkles, ArrowRight, Calendar, Users, TrendingUp, CheckCircle2, X, AlertCircle } from "lucide-react"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"

export interface TaskOptimization {
  taskId: string
  taskTitle: string
  action: 'reschedule' | 'reassign' | 'reprioritize' | 'split' | 'merge'
  currentValue: any
  suggestedValue: any
  rationale: string
  confidence: number
  expectedImpact: string
  requiresApproval: boolean
  canAutoApply: boolean
  processedAt?: string
}

interface TaskOptimizationsPanelProps {
  optimizations: TaskOptimization[]
  isLoading?: boolean
  lastAnalyzedAt?: string
  onRefresh?: () => void
  onApply?: (taskId: string) => void
  onReject?: (taskId: string) => void
}

export function TaskOptimizationsPanel({
  optimizations,
  isLoading = false,
  lastAnalyzedAt,
  onRefresh,
  onApply,
  onReject
}: TaskOptimizationsPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const autoApplied = optimizations.filter(o => o.canAutoApply)
  const pending = optimizations.filter(o => !o.canAutoApply)

  if (optimizations.length === 0 && !isLoading) {
    return (
      <div className="rounded-3xl border border-blue-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-900">Task Optimizations</h2>
          </div>
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="text-slate-600"
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
              Refresh
            </Button>
          )}
        </div>
        <div className="text-center py-8 text-slate-500">
          <TrendingUp className="h-12 w-12 mx-auto mb-3 text-slate-300" />
          <p className="text-sm">No optimizations available</p>
          {lastAnalyzedAt && (
            <p className="text-xs mt-2 text-slate-400">
              Last analyzed: {format(parseISO(lastAnalyzedAt), "MMM d, h:mm a")}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50/30 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-slate-900">Task Optimizations</h2>
          <Badge className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
            {pending.length} pending
          </Badge>
          {autoApplied.length > 0 && (
            <Badge className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              {autoApplied.length} auto-applied
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {lastAnalyzedAt && (
            <span className="text-xs text-slate-500">
              {format(parseISO(lastAnalyzedAt), "MMM d, h:mm a")}
            </span>
          )}
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="text-blue-700 hover:text-blue-800"
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
              Refresh
            </Button>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <RefreshCw className="h-8 w-8 mx-auto mb-3 text-blue-600 animate-spin" />
          <p className="text-sm text-slate-600">Analyzing task optimizations...</p>
        </div>
      )}

      {!isLoading && (
        <div className="space-y-3">
          {pending.map((optimization) => (
            <OptimizationCard
              key={optimization.taskId}
              optimization={optimization}
              expanded={expandedId === optimization.taskId}
              onExpand={() => setExpandedId(expandedId === optimization.taskId ? null : optimization.taskId)}
              onApply={() => onApply?.(optimization.taskId)}
              onReject={() => onReject?.(optimization.taskId)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function OptimizationCard({
  optimization,
  expanded,
  onExpand,
  onApply,
  onReject
}: {
  optimization: TaskOptimization
  expanded: boolean
  onExpand: () => void
  onApply: () => void
  onReject: () => void
}) {
  const confidence = Math.round(optimization.confidence * 100)
  const confidenceColor =
    confidence >= 85 ? "bg-emerald-100 text-emerald-700" :
    confidence >= 70 ? "bg-blue-100 text-blue-700" :
    "bg-slate-100 text-slate-700"

  const actionIcons = {
    reschedule: Calendar,
    reassign: Users,
    reprioritize: TrendingUp,
    split: ArrowRight,
    merge: ArrowRight
  }

  const actionLabels = {
    reschedule: "Reschedule",
    reassign: "Reassign",
    reprioritize: "Change Priority",
    split: "Split Task",
    merge: "Merge Tasks"
  }

  const ActionIcon = actionIcons[optimization.action]

  const formatValue = (value: any, action: string): string => {
    if (action === 'reschedule') {
      try {
        return format(parseISO(value), "MMM d, h:mm a")
      } catch {
        return String(value)
      }
    }
    if (action === 'reprioritize') {
      return String(value).charAt(0).toUpperCase() + String(value).slice(1)
    }
    return String(value)
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-blue-200 bg-white p-4 shadow-sm hover:shadow-md transition-all cursor-pointer",
        expanded && "ring-2 ring-blue-300"
      )}
      onClick={onExpand}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-start gap-2 flex-1">
          <div className="rounded-lg bg-blue-100 p-2 mt-0.5">
            <ActionIcon className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 line-clamp-1">
              {optimization.taskTitle}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              {actionLabels[optimization.action]}
            </p>
          </div>
        </div>
        <Badge className={cn("rounded-full px-2 py-0.5 text-xs font-semibold shrink-0", confidenceColor)}>
          {confidence}%
        </Badge>
      </div>

      {expanded && (
        <div className="mt-3 space-y-3 pt-3 border-t border-blue-100">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Current:</span>
              <span className="font-medium text-slate-700">{formatValue(optimization.currentValue, optimization.action)}</span>
            </div>
            <ArrowRight className="h-4 w-4 text-blue-500" />
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Suggested:</span>
              <span className="font-medium text-blue-700">{formatValue(optimization.suggestedValue, optimization.action)}</span>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-700 mb-1">AI Reasoning:</p>
            <p className="text-xs text-slate-600 leading-relaxed">{optimization.rationale}</p>
          </div>

          {optimization.expectedImpact && (
            <div>
              <p className="text-xs font-semibold text-slate-700 mb-1">Expected Impact:</p>
              <p className="text-xs text-blue-600">{optimization.expectedImpact}</p>
            </div>
          )}

          {optimization.requiresApproval && (
            <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 rounded-lg p-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>This optimization requires approval before applying</span>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 mt-3">
        <Button
          size="sm"
          className="flex-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 h-8 text-xs"
          onClick={(e) => {
            e.stopPropagation()
            onApply()
          }}
        >
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Apply
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="flex-1 rounded-full h-8 text-xs"
          onClick={(e) => {
            e.stopPropagation()
            onReject()
          }}
        >
          <X className="h-3 w-3 mr-1" />
          Reject
        </Button>
      </div>
    </div>
  )
}

