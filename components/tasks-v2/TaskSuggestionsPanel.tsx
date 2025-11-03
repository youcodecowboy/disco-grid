"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, RefreshCw, CheckCircle2, X, Clock, Users, MapPin, ChevronDown } from "lucide-react"
import type { SuggestedTask } from "@/lib/tasks-v2/types"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"

interface TaskSuggestionsPanelProps {
  suggestions: SuggestedTask[]
  isLoading?: boolean
  lastAnalyzedAt?: string
  onRefresh?: () => void
  onApprove?: (suggestionId: string) => void
  onDismiss?: (suggestionId: string) => void
}

export function TaskSuggestionsPanel({
  suggestions,
  isLoading = false,
  lastAnalyzedAt,
  onRefresh,
  onApprove,
  onDismiss
}: TaskSuggestionsPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  console.log('🎯 TaskSuggestionsPanel render:', {
    suggestionsCount: suggestions.length,
    expandedId,
    onApprove: typeof onApprove,
    onDismiss: typeof onDismiss
  })

  if (suggestions.length === 0 && !isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-600" />
            <h2 className="text-lg font-semibold text-slate-900">AI Task Suggestions</h2>
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
          <Sparkles className="h-12 w-12 mx-auto mb-3 text-slate-300" />
          <p className="text-sm">No suggestions available</p>
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
    <div className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50/30 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-600" />
          <h2 className="text-lg font-semibold text-slate-900">AI Task Suggestions</h2>
          <Badge className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
            {suggestions.length}
          </Badge>
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
              className="text-amber-700 hover:text-amber-800"
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
              Refresh
            </Button>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <RefreshCw className="h-8 w-8 mx-auto mb-3 text-amber-600 animate-spin" />
          <p className="text-sm text-slate-600">Analyzing operational context...</p>
        </div>
      )}

      {!isLoading && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {suggestions.map((suggestion) => {
            const isExpanded = expandedId === suggestion.id
            return (
              <SuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                expanded={isExpanded}
                onToggleExpand={() => {
                  console.log('🔄 Toggling expand for:', suggestion.id, 'Currently:', isExpanded)
                  setExpandedId(prev => prev === suggestion.id ? null : suggestion.id)
                }}
                onApprove={() => {
                  console.log('✅ Approve clicked for:', suggestion.id)
                  onApprove?.(suggestion.id)
                }}
                onDismiss={() => {
                  console.log('❌ Dismiss clicked for:', suggestion.id)
                  onDismiss?.(suggestion.id)
                }}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

function SuggestionCard({
  suggestion,
  expanded,
  onToggleExpand,
  onApprove,
  onDismiss
}: {
  suggestion: SuggestedTask
  expanded: boolean
  onToggleExpand: () => void
  onApprove: () => void
  onDismiss: () => void
}) {
  const confidence = Math.round(suggestion.confidence * 100)
  const confidenceColor =
    confidence >= 85 ? "bg-emerald-100 text-emerald-700" :
    confidence >= 70 ? "bg-amber-100 text-amber-700" :
    "bg-slate-100 text-slate-700"

  const priorityColors = {
    critical: "bg-red-100 text-red-700",
    high: "bg-orange-100 text-orange-700",
    medium: "bg-blue-100 text-blue-700",
    low: "bg-slate-100 text-slate-700"
  }

  const handleExpandClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('🔍 Expand button clicked!', suggestion.id, 'Currently:', expanded)
    onToggleExpand()
  }

  const handleApproveClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('✅ Approve button clicked!', suggestion.id)
    onApprove()
  }

  const handleDismissClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('❌ Dismiss button clicked!', suggestion.id)
    onDismiss()
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-amber-200 bg-white/80 p-4 shadow-sm hover:shadow-md transition-all relative",
        expanded && "ring-2 ring-amber-300"
      )}
      style={{ pointerEvents: 'auto', zIndex: 1 }}
    >
      {/* Clickable header */}
      <button
        type="button"
        className="w-full text-left cursor-pointer mb-2 focus:outline-none focus:ring-2 focus:ring-amber-300 rounded p-1 -m-1"
        onClick={handleExpandClick}
        onMouseDown={(e) => {
          console.log('🖱️ Mouse down on expand button')
          e.stopPropagation()
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 flex-1">
            {suggestion.title}
          </h3>
          <div className="flex items-center gap-2 shrink-0">
            <ChevronDown className={cn(
              "h-4 w-4 text-slate-400 transition-transform",
              expanded && "rotate-180"
            )} />
            <Badge className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", confidenceColor)}>
              {confidence}%
            </Badge>
          </div>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="mt-3 space-y-3 pt-3 border-t border-amber-100 animate-in fade-in">
          {suggestion.description && (
            <p className="text-xs text-slate-600">{suggestion.description}</p>
          )}

          <div>
            <p className="text-xs font-semibold text-slate-700 mb-1">AI Reasoning:</p>
            <p className="text-xs text-slate-600 leading-relaxed">{suggestion.rationale}</p>
          </div>

          {suggestion.expectedOutcome && (
            <div>
              <p className="text-xs font-semibold text-slate-700 mb-1">Expected Outcome:</p>
              <p className="text-xs text-slate-600">{suggestion.expectedOutcome}</p>
            </div>
          )}

          {suggestion.highlights && suggestion.highlights.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-700 mb-1">Highlights:</p>
              <ul className="text-xs text-slate-600 space-y-1">
                {suggestion.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-1">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 text-xs">
            {suggestion.suggestedDueDate && (
              <div className="flex items-center gap-1 text-slate-600">
                <Clock className="h-3 w-3" />
                <span>{format(parseISO(suggestion.suggestedDueDate), "MMM d")}</span>
              </div>
            )}
            {suggestion.estimatedMinutes && (
              <div className="flex items-center gap-1 text-slate-600">
                <Clock className="h-3 w-3" />
                <span>{Math.round(suggestion.estimatedMinutes / 60)}h</span>
              </div>
            )}
          </div>
          
          {/* Show additional fields if present */}
          {suggestion.checklist && suggestion.checklist.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-700 mb-1">Suggested Checklist:</p>
              <ul className="text-xs text-slate-600 space-y-1">
                {suggestion.checklist.slice(0, 3).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>{item.label}</span>
                  </li>
                ))}
                {suggestion.checklist.length > 3 && (
                  <li className="text-slate-400">+{suggestion.checklist.length - 3} more</li>
                )}
              </ul>
            </div>
          )}
          
          {suggestion.location && (
            <div className="flex items-center gap-1 text-xs text-slate-600">
              <MapPin className="h-3 w-3" />
              <span>{suggestion.location}</span>
            </div>
          )}
          
          {suggestion.workflowContext && (
            <div className="text-xs text-slate-600">
              <span className="font-semibold">Workflow:</span> {suggestion.workflowContext.workflowName}
              {suggestion.workflowContext.stageName && (
                <span className="text-slate-400"> → {suggestion.workflowContext.stageName}</span>
              )}
            </div>
          )}
          
          {suggestion.tags && suggestion.tags.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              {suggestion.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} className="rounded-full bg-slate-100 text-slate-600 px-1.5 py-0.5 text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Assignees and team info */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-3 mt-2">
        <div className="flex items-center gap-1 flex-wrap">
          {/* Show assignees */}
          {suggestion.recommendedAssignees && suggestion.recommendedAssignees.length > 0 ? (
            <>
              <Users className="h-3 w-3" />
              {suggestion.recommendedAssignees.slice(0, 2).map((assignee) => (
                <span key={assignee.userId} className="font-medium">
                  {assignee.userName}
                </span>
              ))}
              {suggestion.recommendedAssignees.length > 2 && (
                <span className="text-slate-400">+{suggestion.recommendedAssignees.length - 2}</span>
              )}
            </>
          ) : suggestion.recommendedAssignee ? (
            <>
              <Users className="h-3 w-3" />
              <span className="font-medium">{suggestion.recommendedAssignee.name}</span>
            </>
          ) : null}
          
          {/* Show team */}
          {suggestion.recommendedTeamLabel && (
            <>
              <span className="text-slate-300">•</span>
              <div
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: "#3b82f6"
                }}
              />
              <span className="font-medium">{suggestion.recommendedTeamLabel}</span>
            </>
          )}
          
          {/* Priority badge */}
          <Badge className={cn("rounded-full px-1.5 py-0.5 text-xs", priorityColors[suggestion.priority])}>
            {suggestion.priority}
          </Badge>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 mt-3" style={{ pointerEvents: 'auto' }}>
        <button
          type="button"
          className="flex-1 flex items-center justify-center gap-1 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 h-8 text-xs font-medium transition-colors active:scale-95"
          onClick={handleApproveClick}
          onMouseDown={(e) => {
            console.log('🖱️ Mouse down on approve button')
            e.stopPropagation()
          }}
        >
          <CheckCircle2 className="h-3 w-3" />
          Approve
        </button>
        <button
          type="button"
          className="flex-1 flex items-center justify-center gap-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 h-8 text-xs font-medium transition-colors active:scale-95"
          onClick={handleDismissClick}
          onMouseDown={(e) => {
            console.log('🖱️ Mouse down on dismiss button')
            e.stopPropagation()
          }}
        >
          <X className="h-3 w-3" />
          Dismiss
        </button>
      </div>
    </div>
  )
}
