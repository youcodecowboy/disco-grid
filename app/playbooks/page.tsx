"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { LayoutScaffold } from "@/components/grid-v2/LayoutScaffold"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Zap,
    Plus,
    Power,
    PowerOff,
    Clock,
    ChevronRight,
    Users,
    CheckCircle2,
    TrendingUp,
    Activity,
    Target, AlertCircle,
    Filter,
    Home,
    Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"
import { MOCK_PLAYBOOK_SUMMARIES } from "@/lib/playbooks/mockData"
import type { PlaybookSummary } from "@/lib/playbooks/types"

export default function PlaybooksPage() {
  const router = useRouter()
  const [playbooks, setPlaybooks] = useState<PlaybookSummary[]>(MOCK_PLAYBOOK_SUMMARIES)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const handleToggleActive = (id: string) => {
    setPlaybooks((prev) =>
      prev.map((pb) => (pb.id === id ? { ...pb, active: !pb.active } : pb))
    )
  }

  const handleCreateNew = () => {
    router.push("/playbooks/new")
  }

  const filteredPlaybooks = useMemo(() => {
    return playbooks.filter((pb) => {
      if (statusFilter === "active") return pb.active
      if (statusFilter === "inactive") return !pb.active
      return true
    })
  }, [playbooks, statusFilter])

  const activePlaybooks = playbooks.filter((p) => p.active)
  const totalTasksCreated = playbooks.reduce((sum, p) => sum + (p.totalTasksCreated || 0), 0)
  const totalCompletedTasks = playbooks.reduce((sum, p) => sum + (p.completedTasks || 0), 0)
  const totalPeopleInvolved = [...new Set(playbooks.flatMap(p => Array(p.peopleInvolved || 0).fill(null)))].length
  const averageEfficiency = playbooks.length > 0
    ? Math.round(playbooks.reduce((sum, p) => sum + (p.efficiencyScore || 0), 0) / playbooks.length)
    : 0

  return (
    <LayoutScaffold
      pageTitle="Playbooks"
      pageSubtext="Automate task creation with intelligent, repeatable workflows"
      headerActions={
        <Button
          className="rounded-full bg-slate-900 px-4 text-white hover:bg-slate-800"
          onClick={handleCreateNew}
        >
          <Plus className="mr-2 h-4 w-4" />
          New playbook
        </Button>
      }
    >
      <div className="space-y-6 py-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Home className="h-4 w-4" />
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-slate-900">Overview</span>
        </div>

        {/* Main Content Container */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Header Section */}
          <div className="p-6 space-y-6">
            {/* Header with filters */}
            <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-purple-500/10 p-2.5 text-purple-600">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Automation Overview</h2>
                  <p className="text-sm text-slate-600">
                    Monitor playbook performance, task execution, and efficiency metrics
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
                  <Filter className="h-3.5 w-3.5" />
                  Filters
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="rounded-full border border-slate-200 bg-white px-4 shadow-sm w-[180px]">
                    <SelectValue placeholder="All playbooks" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All playbooks</SelectItem>
                    <SelectItem value="active">Active only</SelectItem>
                    <SelectItem value="inactive">Inactive only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </header>

            {/* Metrics cards */}
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                icon={<Activity className="h-5 w-5" />}
                label="Active Playbooks"
                value={activePlaybooks.length}
                subtitle={`${playbooks.length} total`}
                iconBg="bg-purple-100"
                iconColor="text-purple-600"
              />
              <MetricCard
                icon={<CheckCircle2 className="h-5 w-5" />}
                label="Tasks Created"
                value={totalTasksCreated}
                subtitle={`${totalCompletedTasks} completed`}
                iconBg="bg-emerald-100"
                iconColor="text-emerald-600"
              />
              <MetricCard
                icon={<Users className="h-5 w-5" />}
                label="People Involved"
                value={totalPeopleInvolved}
                subtitle="Across all playbooks"
                iconBg="bg-sky-100"
                iconColor="text-sky-600"
              />
              <MetricCard
                icon={<TrendingUp className="h-5 w-5" />}
                label="Avg Efficiency"
                value={`${averageEfficiency}%`}
                subtitle="Overall performance"
                iconBg="bg-amber-100"
                iconColor="text-amber-600"
              />
            </section>

            {/* System Performance Overview */}
            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-50/30 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-slate-600" />
                  <h2 className="text-lg font-semibold text-slate-900">Playbook Performance</h2>
                </div>
              </div>
              <div className="grid gap-6 lg:grid-cols-3">
                {filteredPlaybooks.map((playbook) => (
                  <PerformanceCard key={playbook.id} playbook={playbook} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Playbooks Grid */}
        {filteredPlaybooks.length === 0 ? (
          <EmptyState onCreateNew={handleCreateNew} statusFilter={statusFilter} />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">All Playbooks</h3>
              <Badge className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                {filteredPlaybooks.length} {filteredPlaybooks.length === 1 ? "playbook" : "playbooks"}
              </Badge>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {filteredPlaybooks.map((playbook) => (
                <PlaybookCard
                  key={playbook.id}
                  playbook={playbook}
                  onEdit={() => router.push(`/playbooks/${playbook.id}`)}
                  onToggleActive={() => handleToggleActive(playbook.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
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
  value: number | string
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

function PerformanceCard({ playbook }: { playbook: PlaybookSummary }) {
  const completionRate = playbook.totalTasksCreated && playbook.completedTasks
    ? Math.round((playbook.completedTasks / playbook.totalTasksCreated) * 100)
    : 0

  const getEfficiencyColor = (score?: number) => {
    if (!score) return "text-slate-600"
    if (score >= 90) return "text-emerald-600"
    if (score >= 75) return "text-sky-600"
    if (score >= 60) return "text-amber-600"
    return "text-rose-600"
  }

  const getEfficiencyBg = (score?: number) => {
    if (!score) return "bg-slate-100"
    if (score >= 90) return "bg-emerald-100"
    if (score >= 75) return "bg-sky-100"
    if (score >= 60) return "bg-amber-100"
    return "bg-rose-100"
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-900 line-clamp-1">{playbook.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-semibold",
                playbook.active
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-600"
              )}
            >
              {playbook.active ? "Active" : "Inactive"}
            </Badge>
            <span className="text-xs text-slate-500">
              {playbook.playCount} {playbook.playCount === 1 ? "play" : "plays"}
            </span>
          </div>
        </div>
        <div
          className={cn(
            "rounded-xl p-2 text-center min-w-[64px]",
            getEfficiencyBg(playbook.efficiencyScore)
          )}
        >
          <div className={cn("text-xl font-bold", getEfficiencyColor(playbook.efficiencyScore))}>
            {playbook.efficiencyScore || 0}
          </div>
          <div className="text-[10px] font-semibold text-slate-600 uppercase">Score</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-lg bg-white border border-slate-200 p-2">
          <div className="text-slate-500 mb-0.5">Tasks</div>
          <div className="font-bold text-slate-900">{playbook.totalTasksCreated || 0}</div>
        </div>
        <div className="rounded-lg bg-white border border-slate-200 p-2">
          <div className="text-slate-500 mb-0.5">People</div>
          <div className="font-bold text-slate-900">{playbook.peopleInvolved || 0}</div>
        </div>
        <div className="rounded-lg bg-white border border-slate-200 p-2">
          <div className="text-slate-500 mb-0.5">Avg Time</div>
          <div className="font-bold text-slate-900">{playbook.averageTaskCompletionTime || 0}m</div>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600">Completion Rate</span>
          <span className="font-semibold text-slate-900">{completionRate}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-100">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              completionRate >= 90 ? "bg-emerald-500" :
              completionRate >= 75 ? "bg-sky-500" :
              completionRate >= 60 ? "bg-amber-500" : "bg-rose-500"
            )}
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {playbook.recentExecutions !== undefined && (
        <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-1 border-t border-slate-100">
          <Activity className="h-3.5 w-3.5" />
          <span>{playbook.recentExecutions} executions in last 30 days</span>
        </div>
      )}
    </div>
  )
}

function PlaybookCard({
  playbook,
  onEdit,
  onToggleActive,
}: {
  playbook: PlaybookSummary
  onEdit: () => void
  onToggleActive: () => void
}) {
  const formattedDate = new Date(playbook.lastModified).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  const completionRate = playbook.totalTasksCreated && playbook.completedTasks
    ? Math.round((playbook.completedTasks / playbook.totalTasksCreated) * 100)
    : 0

  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all hover:border-slate-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-slate-900">{playbook.name}</h3>
            {playbook.efficiencyScore && playbook.efficiencyScore >= 90 && (
              <Sparkles className="h-5 w-5 text-amber-500" />
            )}
          </div>
          {playbook.description && (
            <p className="text-sm text-slate-600 line-clamp-2">{playbook.description}</p>
          )}
        </div>

        <button
          type="button"
          onClick={onToggleActive}
          className={cn(
            "ml-4 rounded-full p-2 transition-colors",
            playbook.active
              ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
              : "bg-slate-100 text-slate-400 hover:bg-slate-200"
          )}
          title={playbook.active ? "Active - click to disable" : "Inactive - click to enable"}
        >
          {playbook.active ? <Power className="h-5 w-5" /> : <PowerOff className="h-5 w-5" />}
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="rounded-xl bg-purple-50 p-3 text-center">
          <div className="text-xs font-semibold text-purple-600 mb-0.5">Plays</div>
          <div className="text-lg font-bold text-purple-900">{playbook.playCount}</div>
        </div>
        <div className="rounded-xl bg-emerald-50 p-3 text-center">
          <div className="text-xs font-semibold text-emerald-600 mb-0.5">Tasks</div>
          <div className="text-lg font-bold text-emerald-900">{playbook.totalTasksCreated || 0}</div>
        </div>
        <div className="rounded-xl bg-sky-50 p-3 text-center">
          <div className="text-xs font-semibold text-sky-600 mb-0.5">People</div>
          <div className="text-lg font-bold text-sky-900">{playbook.peopleInvolved || 0}</div>
        </div>
        <div className="rounded-xl bg-amber-50 p-3 text-center">
          <div className="text-xs font-semibold text-amber-600 mb-0.5">Score</div>
          <div className="text-lg font-bold text-amber-900">{playbook.efficiencyScore || 0}</div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
        <div className="flex items-center gap-1.5 text-slate-600">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span className="font-semibold text-slate-900">{completionRate}%</span>
          <span>completion</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600">
          <Clock className="h-4 w-4 text-sky-600" />
          <span className="font-semibold text-slate-900">{playbook.averageTaskCompletionTime || 0}m</span>
          <span>avg time</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600">
          <Activity className="h-4 w-4 text-purple-600" />
          <span className="font-semibold text-slate-900">{playbook.recentExecutions || 0}</span>
          <span>recent runs</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <Badge
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold",
              playbook.active
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-600"
            )}
          >
            {playbook.active ? "Active" : "Inactive"}
          </Badge>
          <span className="text-xs text-slate-500">Updated {formattedDate}</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="rounded-full text-purple-600 hover:text-purple-700 hover:bg-purple-50"
        >
          Edit playbook
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function EmptyState({ 
  onCreateNew,
  statusFilter 
}: { 
  onCreateNew: () => void
  statusFilter: string
}) {
  if (statusFilter !== "all") {
    return (
      <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
        <div className="mx-auto max-w-md space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <AlertCircle className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No {statusFilter} playbooks</h3>
          <p className="text-sm text-slate-600">
            There are no {statusFilter} playbooks to display. Try changing your filter.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
      <div className="mx-auto max-w-md space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100">
          <Zap className="h-8 w-8 text-purple-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">No playbooks yet</h3>
        <p className="text-sm text-slate-600">
          Create your first playbook to automate task creation based on triggers like workflow
          stages, order acceptance, or time schedules.
        </p>
        <Button
          onClick={onCreateNew}
          className="rounded-full bg-slate-900 px-6 text-white hover:bg-slate-800"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create your first playbook
        </Button>
      </div>
    </div>
  )
}
