"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LayoutScaffold } from "@/components/grid-v2/LayoutScaffold"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    CalendarDays,
    Filter,
    Sparkles,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Clock,
    Users,
    Home,
    ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { MOCK_TASKS, SUGGESTED_TASKS, SYSTEM_ANALYTICS, MOCK_TEAMS } from "@/lib/tasks-v2/mockData"
import type { SuggestedTask } from "@/lib/tasks-v2/types"
import { TaskCreationDrawer } from "@/components/tasks-v2/TaskCreationDrawer"
import { TaskSuggestionsPanel } from "@/components/tasks-v2/TaskSuggestionsPanel"
import { TaskOptimizationsPanel, type TaskOptimization } from "@/components/tasks-v2/TaskOptimizationsPanel"

export default function TasksV2OverviewPage() {
  const router = useRouter()
  const [selectedTeam, setSelectedTeam] = useState<string>("all")
  const [showTaskCreation, setShowTaskCreation] = useState(false)
  const [llmSuggestions, setLlmSuggestions] = useState<SuggestedTask[]>([])
  const [llmOptimizations, setLlmOptimizations] = useState<TaskOptimization[]>([])
  const [isLoadingLLM, setIsLoadingLLM] = useState(false)
  const [lastAnalyzedAt, setLastAnalyzedAt] = useState<string | undefined>()

  const analytics = SYSTEM_ANALYTICS

  const filteredTasks = useMemo(() => {
    return MOCK_TASKS.filter((task) => {
      if (selectedTeam !== "all" && task.owningTeamId !== selectedTeam) return false
      return true
    })
  }, [selectedTeam])

  const filteredSuggestions = useMemo(() => {
    return SUGGESTED_TASKS.filter((suggestion) => {
      if (selectedTeam !== "all" && suggestion.recommendedTeamId !== selectedTeam) return false
      return true
    })
  }, [selectedTeam])

  const activeTasks = filteredTasks.filter((t) => !["completed", "archived"].includes(t.status))
  const blockedTasks = filteredTasks.filter((t) => t.status === "blocked")
  const completedTasks = filteredTasks.filter((t) => t.status === "completed")

  // Load LLM suggestions from API on mount (only if not already loaded)
  useEffect(() => {
    // Don't auto-refresh on mount - user can click refresh button
    // This prevents expensive API calls on every page load
  }, [])

  const refreshLLMSuggestions = async () => {
    setIsLoadingLLM(true)
    try {
      const response = await fetch('/api/tasks-v2/llm-suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timeHorizon: 7,
          teamIds: selectedTeam !== 'all' ? [selectedTeam] : undefined,
          strategy: 'optimized'
        })
      })

      const data = await response.json()
      
      if (data.success) {
        // Update state directly from API response
        setLlmSuggestions(data.suggestions || [])
        setLlmOptimizations(data.optimizations || [])
        setLastAnalyzedAt(data.metadata?.contextCollectedAt || new Date().toISOString())
      } else {
        console.error('Failed to refresh suggestions:', data.error)
      }
    } catch (error) {
      console.error('Error refreshing suggestions:', error)
    } finally {
      setIsLoadingLLM(false)
    }
  }

  const handleApproveSuggestion = (suggestionId: string) => {
    // Remove from UI (in production, would call API to mark as approved)
    setLlmSuggestions(prev => prev.filter(s => s.id !== suggestionId))
    // TODO: Call API to persist approval
  }

  const handleDismissSuggestion = (suggestionId: string) => {
    // Remove from UI (in production, would call API to mark as dismissed)
    setLlmSuggestions(prev => prev.filter(s => s.id !== suggestionId))
    // TODO: Call API to persist dismissal
  }

  const handleApplyOptimization = (taskId: string) => {
    // Remove from UI (in production, would call API to apply optimization)
    setLlmOptimizations(prev => prev.filter(o => o.taskId !== taskId))
    // TODO: Call API to apply optimization to task
  }

  const handleRejectOptimization = (taskId: string) => {
    // Remove from UI (in production, would call API to mark as rejected)
    setLlmOptimizations(prev => prev.filter(o => o.taskId !== taskId))
    // TODO: Call API to persist rejection
  }

  // Combine static suggestions with LLM suggestions
  const allSuggestions = useMemo(() => {
    return [...filteredSuggestions, ...llmSuggestions]
  }, [filteredSuggestions, llmSuggestions])

  return (
    <LayoutScaffold
      pageTitle="Taskmaster v2"
      pageSubtext="Unified task management across all teams"
      headerActions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshLLMSuggestions}
            disabled={isLoadingLLM}
            className="rounded-full"
          >
            <Sparkles className={cn("h-4 w-4 mr-2", isLoadingLLM && "animate-pulse")} />
            {isLoadingLLM ? "Analyzing..." : "Refresh AI"}
          </Button>
          <Button
            className="rounded-full bg-slate-900 px-4 text-white hover:bg-slate-800"
            onClick={() => setShowTaskCreation(true)}
          >
            New task
          </Button>
        </div>
      }
    >
      <div className="space-y-6 py-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Home className="h-4 w-4" />
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-slate-900">Overview</span>
        </div>

        {/* Team Tabs Navigation */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 px-2 py-2 overflow-x-auto">
            <div className="flex items-center gap-1 min-w-max">
              {/* Overview Tab - Active */}
              <button
                className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors bg-slate-900 text-white shadow-sm"
              >
                <Home className="h-4 w-4" />
                Overview
              </button>

              {/* Calendar Tab */}
              <button
                onClick={() => router.push("/tasks-v2/calendar")}
                className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              >
                <CalendarDays className="h-4 w-4" />
                Calendar
              </button>

              {/* Team Tabs */}
              {MOCK_TEAMS.map((team) => {
                const teamAnalytics = analytics.teamAnalytics.find((a) => a.teamId === team.id)
                const activeCount = teamAnalytics?.activeTasks || 0

                return (
                  <button
                    key={team.id}
                    onClick={() => router.push(`/tasks-v2/team/${team.id}`)}
                    className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  >
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: team.color }}
                    />
                    <span>{team.name}</span>
                    {activeCount > 0 && (
                      <Badge className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                        {activeCount}
                      </Badge>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tab Content - Overview */}
          <div className="p-6 space-y-6">
            {/* Header with filters */}
            <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-sky-500/10 p-2.5 text-sky-600">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Task Overview</h2>
                  <p className="text-sm text-slate-600">Monitor progress, spot blockers, and coordinate across teams</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
                  <Filter className="h-3.5 w-3.5" />
                  Filters
                </div>
                <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                  <SelectTrigger className="rounded-full border border-slate-200 bg-white px-4 shadow-sm w-[180px]">
                    <SelectValue placeholder="All teams" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All teams</SelectItem>
                    {MOCK_TEAMS.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </header>

            {/* Metrics cards */}
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                icon={<Clock className="h-5 w-5" />}
                label="Active tasks"
                value={activeTasks.length}
                subtitle={`${filteredTasks.length} total`}
                iconBg="bg-sky-100"
                iconColor="text-sky-600"
              />
              <MetricCard
                icon={<AlertCircle className="h-5 w-5" />}
                label="Blocked"
                value={blockedTasks.length}
                subtitle="Needs attention"
                iconBg="bg-rose-100"
                iconColor="text-rose-600"
              />
              <MetricCard
                icon={<CheckCircle2 className="h-5 w-5" />}
                label="Completed"
                value={completedTasks.length}
                subtitle={`${Math.round((completedTasks.length / filteredTasks.length) * 100)}% rate`}
                iconBg="bg-emerald-100"
                iconColor="text-emerald-600"
              />
              <MetricCard
                icon={<Sparkles className="h-5 w-5" />}
                label="Suggestions"
                value={allSuggestions.length}
                subtitle={`${llmSuggestions.length > 0 ? Math.round(llmSuggestions.reduce((sum, s) => sum + s.confidence, 0) / llmSuggestions.length * 100) : Math.round(analytics.averageSuggestionConfidence * 100)}% confidence`}
                iconBg="bg-amber-100"
                iconColor="text-amber-600"
              />
            </section>

            {/* AI Task Suggestions */}
            {(llmSuggestions.length > 0 || isLoadingLLM) && (
              <TaskSuggestionsPanel
                suggestions={llmSuggestions}
                isLoading={isLoadingLLM}
                lastAnalyzedAt={lastAnalyzedAt}
                onRefresh={refreshLLMSuggestions}
                onApprove={handleApproveSuggestion}
                onDismiss={handleDismissSuggestion}
              />
            )}

            {/* Static Suggested tasks (fallback) */}
            {filteredSuggestions.length > 0 && llmSuggestions.length === 0 && (
              <div className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50/30 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-600" />
                    <h2 className="text-lg font-semibold text-slate-900">Suggested Tasks</h2>
                    <Badge className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                      {filteredSuggestions.length}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="text-amber-700 hover:text-amber-800">
                    View all
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredSuggestions.map((suggestion) => (
                    <SuggestionCard key={suggestion.id} suggestion={suggestion} />
                  ))}
                </div>
              </div>
            )}

            {/* Task Optimizations */}
            {(llmOptimizations.length > 0 || isLoadingLLM) && (
              <TaskOptimizationsPanel
                optimizations={llmOptimizations}
                isLoading={isLoadingLLM}
                lastAnalyzedAt={lastAnalyzedAt}
                onRefresh={refreshLLMSuggestions}
                onApply={handleApplyOptimization}
                onReject={handleRejectOptimization}
              />
            )}

            {/* Main content grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Team Performance */}
              <section className="space-y-6">

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-slate-600" />
                    <h2 className="text-lg font-semibold text-slate-900">Team Performance</h2>
                  </div>

                  <div className="space-y-4">
                    {analytics.teamAnalytics.map((team) => (
                      <div key={team.teamId} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: team.teamColor }}
                            />
                            <span className="text-sm font-medium text-slate-700">{team.teamName}</span>
                          </div>
                          <span className="text-sm font-semibold text-slate-900">
                            {Math.round(team.completionRate)}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <span>{team.activeTasks} active</span>
                          <span>•</span>
                          <span>{team.completedTasks} done</span>
                          {team.blockedTasks > 0 && (
                            <>
                              <span>•</span>
                              <span className="text-rose-600">{team.blockedTasks} blocked</span>
                            </>
                          )}
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${team.completionRate}%`,
                              backgroundColor: team.teamColor,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full rounded-full"
                      onClick={() => router.push("/teams")}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      View team details
                    </Button>
                  </div>
                </div>
              </section>

              {/* Quick Links & Actions */}
              <section className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Access</h2>
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start rounded-xl"
                      onClick={() => router.push("/tasks-v2/calendar")}
                    >
                      <CalendarDays className="mr-3 h-4 w-4" />
                      View Calendar
                    </Button>
                    {MOCK_TEAMS.map((team) => (
                      <Button
                        key={team.id}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start rounded-xl"
                        onClick={() => router.push(`/tasks-v2/team/${team.id}`)}
                      >
                        <div
                          className="h-2 w-2 rounded-full mr-3"
                          style={{ backgroundColor: team.color }}
                        />
                        {team.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Task Creation Drawer */}
      <TaskCreationDrawer
        open={showTaskCreation}
        onClose={() => setShowTaskCreation(false)}
      />
    </LayoutScaffold>
  )
}

function MetricCard({
  icon,
  label,
  value,
  subtitle,
  iconBg,
  iconColor,
}: {
  icon: React.ReactNode
  label: string
  value: number
  subtitle: string
  iconBg: string
  iconColor: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className={cn("rounded-xl p-2", iconBg, iconColor)}>{icon}</div>
      </div>
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
        <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
      </div>
    </div>
  )
}

function SuggestionCard({ suggestion }: { suggestion: SuggestedTask }) {
  const confidence = Math.round(suggestion.confidence * 100)

  return (
    <div className="rounded-2xl border border-amber-200 bg-white/80 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">{suggestion.title}</h3>
        <Badge className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 shrink-0">
          {confidence}%
        </Badge>
      </div>
      <p className="text-xs text-slate-600 line-clamp-2 mb-3">{suggestion.rationale}</p>
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
        <div
          className="h-2 w-2 rounded-full"
          style={{
            backgroundColor: MOCK_TEAMS.find((t) => t.id === suggestion.recommendedTeamId)?.color,
          }}
        />
        <span className="font-medium">{suggestion.recommendedTeamLabel}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" className="flex-1 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 h-8 text-xs">
          Approve
        </Button>
        <Button size="sm" variant="ghost" className="flex-1 rounded-full h-8 text-xs">
          Dismiss
        </Button>
      </div>
    </div>
  )
}
