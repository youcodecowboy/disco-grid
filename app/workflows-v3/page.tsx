"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { LayoutScaffold } from "@/components/grid-v2/LayoutScaffold"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Plus,
    Power,
    PowerOff,
    Clock,
    ChevronRight,
    Package,
    TrendingUp,
    Activity,
    Filter,
    Home,
    Layers,
    Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { MOCK_WORKFLOW_SUMMARIES } from "@/lib/workflows-v3/mockData"
import type { WorkflowV3Summary } from "@/lib/workflows-v3/types"

export default function WorkflowsV3Page() {
  const router = useRouter()
  const [workflows, setWorkflows] = useState<WorkflowV3Summary[]>(MOCK_WORKFLOW_SUMMARIES)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [clientFilter, setClientFilter] = useState<string>("all")

  const handleToggleActive = (id: string) => {
    setWorkflows((prev) =>
      prev.map((wf) => (wf.id === id ? { ...wf, active: !wf.active } : wf))
    )
  }

  const handleCreateNew = () => {
    router.push("/workflows-v3/new")
  }

  const filteredWorkflows = useMemo(() => {
    return workflows.filter((wf) => {
      if (statusFilter === "active" && !wf.active) return false
      if (statusFilter === "inactive" && wf.active) return false
      if (clientFilter !== "all" && wf.clientName !== clientFilter) return false
      return true
    })
  }, [workflows, statusFilter, clientFilter])

  const activeWorkflows = workflows.filter((w) => w.active)
  const totalActiveItems = workflows.reduce((sum, w) => sum + w.activeItemCount, 0)
  const totalExecutions = workflows.reduce((sum, w) => sum + w.totalExecutions, 0)
  const averageCompletionRate = workflows.length > 0
    ? Math.round(workflows.reduce((sum, w) => sum + (w.completionRate || 0), 0) / workflows.length)
    : 0

  // Get unique clients for filter
  const uniqueClients = Array.from(new Set(workflows.map(w => w.clientName).filter(Boolean)))

  return (
    <LayoutScaffold
      pageTitle="Workflows V3"
      pageSubtext="Form-based workflow creation with natural language intelligence"
      headerActions={
        <Button
          className="rounded-full bg-slate-900 px-4 text-white hover:bg-slate-800"
          onClick={handleCreateNew}
        >
          <Plus className="mr-2 h-4 w-4" />
          New workflow
        </Button>
      }
    >
      <div className="space-y-6 py-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Home className="h-4 w-4" />
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-slate-900">Workflow Library</span>
        </div>

        {/* Main Content Container */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Header Section */}
          <div className="p-6 space-y-6">
            {/* Header with filters */}
            <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-blue-500/10 p-2.5 text-blue-600">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Workflow Overview</h2>
                  <p className="text-sm text-slate-600">
                    Monitor workflow performance, execution metrics, and active items
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
                    <SelectValue placeholder="All workflows" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All workflows</SelectItem>
                    <SelectItem value="active">Active only</SelectItem>
                    <SelectItem value="inactive">Inactive only</SelectItem>
                  </SelectContent>
                </Select>
                {uniqueClients.length > 0 && (
                  <Select value={clientFilter} onValueChange={setClientFilter}>
                    <SelectTrigger className="rounded-full border border-slate-200 bg-white px-4 shadow-sm w-[180px]">
                      <SelectValue placeholder="All clients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All clients</SelectItem>
                      {uniqueClients.map(client => (
                        <SelectItem key={client} value={client!}>{client}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </header>

            {/* Metrics cards */}
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                icon={<Activity className="h-5 w-5" />}
                label="Active Workflows"
                value={activeWorkflows.length}
                subtitle={`${workflows.length} total`}
                iconBg="bg-blue-100"
                iconColor="text-blue-600"
              />
              <MetricCard
                icon={<Package className="h-5 w-5" />}
                label="Active Items"
                value={totalActiveItems}
                subtitle="In production now"
                iconBg="bg-emerald-100"
                iconColor="text-emerald-600"
              />
              <MetricCard
                icon={<Zap className="h-5 w-5" />}
                label="Total Executions"
                value={totalExecutions.toLocaleString()}
                subtitle="All-time"
                iconBg="bg-amber-100"
                iconColor="text-amber-600"
              />
              <MetricCard
                icon={<TrendingUp className="h-5 w-5" />}
                label="Avg Completion"
                value={`${averageCompletionRate}%`}
                subtitle="Success rate"
                iconBg="bg-purple-100"
                iconColor="text-purple-600"
              />
            </section>
          </div>
        </div>

        {/* Workflows Grid */}
        {filteredWorkflows.length === 0 ? (
          <EmptyState onCreateNew={handleCreateNew} statusFilter={statusFilter} />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">All Workflows</h3>
              <Badge className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                {filteredWorkflows.length} {filteredWorkflows.length === 1 ? "workflow" : "workflows"}
              </Badge>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {filteredWorkflows.map((workflow) => (
                <WorkflowCard
                  key={workflow.id}
                  workflow={workflow}
                  onEdit={() => router.push(`/workflows-v3/${workflow.id}`)}
                  onToggleActive={() => handleToggleActive(workflow.id)}
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

function WorkflowCard({
  workflow,
  onEdit,
  onToggleActive,
}: {
  workflow: WorkflowV3Summary
  onEdit: () => void
  onToggleActive: () => void
}) {
  const formattedDate = new Date(workflow.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  const lastExecutionText = workflow.lastExecutionAt 
    ? formatTimeAgo(new Date(workflow.lastExecutionAt))
    : "Never executed"

  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all hover:border-slate-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-slate-900">{workflow.name}</h3>
          </div>
          {workflow.description && (
            <p className="text-sm text-slate-600 line-clamp-2">{workflow.description}</p>
          )}
          {workflow.clientName && (
            <Badge className="mt-2 rounded-full bg-purple-100 text-purple-700 text-xs">
              {workflow.clientName}
            </Badge>
          )}
        </div>

        <button
          type="button"
          onClick={onToggleActive}
          className={cn(
            "ml-4 rounded-full p-2 transition-colors",
            workflow.active
              ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
              : "bg-slate-100 text-slate-400 hover:bg-slate-200"
          )}
          title={workflow.active ? "Active - click to disable" : "Inactive - click to enable"}
        >
          {workflow.active ? <Power className="h-5 w-5" /> : <PowerOff className="h-5 w-5" />}
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="rounded-xl bg-blue-50 p-3 text-center">
          <div className="text-xs font-semibold text-blue-600 mb-0.5">Stages</div>
          <div className="text-lg font-bold text-blue-900">{workflow.stageCount}</div>
        </div>
        <div className="rounded-xl bg-emerald-50 p-3 text-center">
          <div className="text-xs font-semibold text-emerald-600 mb-0.5">Active</div>
          <div className="text-lg font-bold text-emerald-900">{workflow.activeItemCount}</div>
        </div>
        <div className="rounded-xl bg-amber-50 p-3 text-center">
          <div className="text-xs font-semibold text-amber-600 mb-0.5">Rate</div>
          <div className="text-lg font-bold text-amber-900">{workflow.completionRate || 0}%</div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
        <div className="flex items-center gap-1.5 text-slate-600">
          <Clock className="h-4 w-4 text-blue-600" />
          <span className="font-semibold text-slate-900">{lastExecutionText}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600">
          <Activity className="h-4 w-4 text-purple-600" />
          <span className="font-semibold text-slate-900">{workflow.totalExecutions.toLocaleString()}</span>
          <span>executions</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <Badge
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold",
              workflow.active
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-600"
            )}
          >
            {workflow.active ? "Active" : "Inactive"}
          </Badge>
          <span className="text-xs text-slate-500">Updated {formattedDate}</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="rounded-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          Edit workflow
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
            <Activity className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No {statusFilter} workflows</h3>
          <p className="text-sm text-slate-600">
            There are no {statusFilter} workflows to display. Try changing your filter.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
      <div className="mx-auto max-w-md space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
          <Layers className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">No workflows yet</h3>
        <p className="text-sm text-slate-600">
          Create your first workflow using natural language to describe your process.
          The system will automatically generate stages and dependencies for you.
        </p>
        <Button
          onClick={onCreateNew}
          className="rounded-full bg-slate-900 px-6 text-white hover:bg-slate-800"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create your first workflow
        </Button>
      </div>
    </div>
  )
}

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}













