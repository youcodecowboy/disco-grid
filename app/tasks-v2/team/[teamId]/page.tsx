"use client"

import { useState, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { LayoutScaffold } from "@/components/grid-v2/LayoutScaffold"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    LayoutList,
    LayoutGrid,
    Search, Plus,
    MoreHorizontal,
    Calendar as CalendarIcon,
    CalendarDays,
    AlertCircle,
    CheckCircle2,
    Clock,
    Home,
    ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { MOCK_TASKS, MOCK_TEAMS, MOCK_USERS } from "@/lib/tasks-v2/mockData"
import type { Task, TaskStatus, TaskPriority, ViewMode } from "@/lib/tasks-v2/types"
import { format, parseISO } from "date-fns"
import { TaskDetailDrawer } from "@/components/tasks-v2/TaskDetailDrawer"
import { TaskCreationDrawer } from "@/components/tasks-v2/TaskCreationDrawer"

const STATUS_META: Record<TaskStatus, { label: string; color: string }> = {
  draft: { label: "Draft", color: "bg-slate-100 text-slate-600" },
  scheduled: { label: "Scheduled", color: "bg-sky-100 text-sky-700" },
  in_progress: { label: "In Progress", color: "bg-indigo-100 text-indigo-700" },
  blocked: { label: "Blocked", color: "bg-rose-100 text-rose-700" },
  review: { label: "Review", color: "bg-amber-100 text-amber-700" },
  completed: { label: "Completed", color: "bg-emerald-100 text-emerald-700" },
  archived: { label: "Archived", color: "bg-slate-200 text-slate-600" },
}

const PRIORITY_META: Record<TaskPriority, { label: string; color: string }> = {
  critical: { label: "Critical", color: "bg-rose-500 text-white" },
  high: { label: "High", color: "bg-orange-500 text-white" },
  medium: { label: "Medium", color: "bg-amber-200 text-amber-800" },
  low: { label: "Low", color: "bg-slate-200 text-slate-700" },
}

export default function TeamTasksPage() {
  const router = useRouter()
  const params = useParams()
  const teamId = params.teamId as string

  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showTaskCreation, setShowTaskCreation] = useState(false)

  const team = MOCK_TEAMS.find((t) => t.id === teamId)
  const teamTasks = MOCK_TASKS.filter((t) => t.owningTeamId === teamId)

  const filteredTasks = useMemo(() => {
    return teamTasks.filter((task) => {
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      if (statusFilter !== "all" && task.status !== statusFilter) {
        return false
      }
      if (priorityFilter !== "all" && task.priority !== priorityFilter) {
        return false
      }
      if (assigneeFilter !== "all") {
        const hasAssignee = task.assignments.some((a) => a.userId === assigneeFilter)
        if (!hasAssignee) return false
      }
      return true
    })
  }, [teamTasks, searchQuery, statusFilter, priorityFilter, assigneeFilter])

  const activeTasks = filteredTasks.filter((t) => !["completed", "archived"].includes(t.status))
  const completedTasks = filteredTasks.filter((t) => t.status === "completed")
  const blockedTasks = filteredTasks.filter((t) => t.status === "blocked")

  if (!team) {
    return (
      <LayoutScaffold pageTitle="Team Not Found" pageSubtext="">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-slate-600">Team not found</p>
            <Button className="mt-4" onClick={() => router.push("/tasks-v2")}>
              Back to overview
            </Button>
          </div>
        </div>
      </LayoutScaffold>
    )
  }

  return (
    <LayoutScaffold
      pageTitle={team.name}
      pageSubtext="Manage tasks and collaborate with your team"
      headerActions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => router.push("/tasks-v2")}
          >
            ← Back to overview
          </Button>
          <Button
            className="rounded-full bg-slate-900 px-4 text-white hover:bg-slate-800"
            onClick={() => setShowTaskCreation(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            New task
          </Button>
        </div>
      }
    >
      <div className="space-y-6 py-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Home className="h-4 w-4 cursor-pointer hover:text-slate-900" onClick={() => router.push("/tasks-v2")} />
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-slate-900">{team.name}</span>
        </div>

        {/* Team Tabs Navigation */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 px-2 py-2 overflow-x-auto">
            <div className="flex items-center gap-1 min-w-max">
              {/* Overview Tab */}
              <button
                onClick={() => router.push("/tasks-v2")}
                className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors text-slate-600 hover:text-slate-900 hover:bg-slate-50"
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
              {MOCK_TEAMS.map((t) => {
                const isActive = t.id === teamId
                const teamTasks = MOCK_TASKS.filter((task) => task.owningTeamId === t.id)
                const activeCount = teamTasks.filter((task) => !["completed", "archived"].includes(task.status)).length

                return (
                  <button
                    key={t.id}
                    onClick={() => router.push(`/tasks-v2/team/${t.id}`)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: t.color }}
                    />
                    <span>{t.name}</span>
                    {activeCount > 0 && (
                      <Badge className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-semibold",
                        isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
                      )}>
                        {activeCount}
                      </Badge>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tab Content - Team View */}
          <div className="p-6 space-y-6">
        {/* Team header with metrics */}
        <header className="border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm rounded-xl">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="h-16 w-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
                style={{ backgroundColor: team.color }}
              >
                {team.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{team.name}</h1>
                <p className="text-sm text-slate-600 mt-1">{teamTasks.length} total tasks</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Completion rate</p>
                <p className="text-2xl font-bold text-slate-900">
                  {teamTasks.length > 0 ? Math.round((completedTasks.length / teamTasks.length) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
              <div className="rounded-lg bg-indigo-100 p-2 text-indigo-600">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{activeTasks.length}</p>
                <p className="text-xs text-slate-600">Active tasks</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
              <div className="rounded-lg bg-rose-100 p-2 text-rose-600">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{blockedTasks.length}</p>
                <p className="text-xs text-slate-600">Blocked</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
              <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{completedTasks.length}</p>
                <p className="text-xs text-slate-600">Completed</p>
              </div>
            </div>
          </div>
        </header>

        {/* Toolbar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* View mode toggle */}
              <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "rounded-md p-2 transition-colors",
                    viewMode === "list"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  <LayoutList className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("kanban")}
                  className={cn(
                    "rounded-md p-2 transition-colors",
                    viewMode === "kanban"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-[240px] rounded-full pl-9"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] rounded-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {Object.entries(STATUS_META).map(([status, meta]) => (
                    <SelectItem key={status} value={status}>
                      {meta.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[140px] rounded-full">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All priorities</SelectItem>
                  {Object.entries(PRIORITY_META).map(([priority, meta]) => (
                    <SelectItem key={priority} value={priority}>
                      {meta.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                <SelectTrigger className="w-[140px] rounded-full">
                  <SelectValue placeholder="Assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All assignees</SelectItem>
                  {MOCK_USERS.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Task list/kanban view */}
        {viewMode === "list" ? (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Task
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Assignee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Due date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Progress
                    </th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTasks.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <p className="text-sm text-slate-500">No tasks match your filters</p>
                      </td>
                    </tr>
                  ) : (
                    filteredTasks.map((task) => <TaskRow key={task.id} task={task} onTaskClick={setSelectedTask} />)
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <KanbanView tasks={filteredTasks} teamColor={team.color} onTaskClick={setSelectedTask} />
        )}

        {/* Task detail drawer */}
        {selectedTask && (
          <TaskDetailDrawer
            task={selectedTask}
            open={!!selectedTask}
            onClose={() => setSelectedTask(null)}
            onUpdate={(updatedTask) => {
              setSelectedTask(updatedTask)
              // In a real app, this would update the backend
            }}
          />
        )}

        {/* Task creation drawer */}
        <TaskCreationDrawer
          open={showTaskCreation}
          onClose={() => setShowTaskCreation(false)}
          defaultTeamId={teamId}
        />
          </div>
        </div>
      </div>
    </LayoutScaffold>
  )
}

function TaskRow({ task, onTaskClick }: { task: Task; onTaskClick: (task: Task) => void }) {
  const statusMeta = STATUS_META[task.status]
  const priorityMeta = PRIORITY_META[task.priority]
  const progress =
    task.checklist.length > 0
      ? Math.round((task.checklist.filter((c) => c.done).length / task.checklist.length) * 100)
      : 0

  return (
    <tr className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => onTaskClick(task)}>
      <td className="px-6 py-4">
        <div>
          <p className="font-medium text-slate-900">{task.title}</p>
          {task.description && (
            <p className="text-sm text-slate-500 line-clamp-1 mt-0.5">{task.description}</p>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <Badge className={cn("rounded-full px-3 py-1 text-xs font-semibold", statusMeta.color)}>
          {statusMeta.label}
        </Badge>
      </td>
      <td className="px-6 py-4">
        <Badge className={cn("rounded-full px-3 py-1 text-xs font-semibold", priorityMeta.color)}>
          {priorityMeta.label}
        </Badge>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {task.assignments.slice(0, 2).map((assignment) => (
            <div key={assignment.userId} className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-slate-200 overflow-hidden">
                {assignment.userAvatar && (
                  <img src={assignment.userAvatar} alt={assignment.userName} className="h-full w-full" />
                )}
              </div>
              <span className="text-sm text-slate-700">{assignment.userName}</span>
            </div>
          ))}
          {task.assignments.length > 2 && (
            <span className="text-xs text-slate-500">+{task.assignments.length - 2}</span>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        {task.dueWindow?.end ? (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <CalendarIcon className="h-4 w-4" />
            {format(parseISO(task.dueWindow.end), "MMM d, h:mm a")}
          </div>
        ) : (
          <span className="text-sm text-slate-400">No due date</span>
        )}
      </td>
      <td className="px-6 py-4">
        {task.checklist.length > 0 ? (
          <div className="flex items-center gap-2">
            <div className="h-2 w-24 rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-sky-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-slate-600">{progress}%</span>
          </div>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        )}
      </td>
      <td className="px-6 py-4">
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  )
}

function KanbanView({ tasks, teamColor, onTaskClick }: { tasks: Task[]; teamColor: string; onTaskClick: (task: Task) => void }) {
  const statuses: TaskStatus[] = ["draft", "scheduled", "in_progress", "review", "blocked", "completed"]

  const tasksByStatus = statuses.reduce((acc, status) => {
    acc[status] = tasks.filter((t) => t.status === status)
    return acc
  }, {} as Record<TaskStatus, Task[]>)

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {statuses.map((status) => {
          const statusMeta = STATUS_META[status]
          const statusTasks = tasksByStatus[status] || []

          return (
            <div key={status} className="w-80 flex-shrink-0">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: teamColor }} />
                      <h3 className="font-semibold text-slate-900">{statusMeta.label}</h3>
                    </div>
                    <Badge className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                      {statusTasks.length}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3 p-4 max-h-[600px] overflow-y-auto">
                  {statusTasks.length === 0 ? (
                    <div className="rounded-xl border-2 border-dashed border-slate-200 p-6 text-center">
                      <p className="text-sm text-slate-400">No tasks</p>
                    </div>
                  ) : (
                    statusTasks.map((task) => <KanbanCard key={task.id} task={task} onClick={() => onTaskClick(task)} />)
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full rounded-xl border-2 border-dashed border-slate-200 hover:border-slate-300"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add task
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function KanbanCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const priorityMeta = PRIORITY_META[task.priority]
  const progress =
    task.checklist.length > 0
      ? Math.round((task.checklist.filter((c) => c.done).length / task.checklist.length) * 100)
      : 0

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <h4 className="text-sm font-semibold text-slate-900 line-clamp-2">{task.title}</h4>
        <Badge className={cn("rounded-full px-2 py-0.5 text-xs font-semibold shrink-0", priorityMeta.color)}>
          {priorityMeta.label}
        </Badge>
      </div>

      {task.description && (
        <p className="text-xs text-slate-600 line-clamp-2 mb-3">{task.description}</p>
      )}

      {task.checklist.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
            <span>Progress</span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-sky-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {task.assignments.slice(0, 3).map((assignment) => (
            <div key={assignment.userId} className="h-6 w-6 rounded-full bg-slate-200 overflow-hidden" title={assignment.userName}>
              {assignment.userAvatar && (
                <img src={assignment.userAvatar} alt={assignment.userName} className="h-full w-full" />
              )}
            </div>
          ))}
        </div>
        {task.dueWindow?.end && (
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <CalendarIcon className="h-3 w-3" />
            {format(parseISO(task.dueWindow.end), "MMM d")}
          </div>
        )}
      </div>

      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {task.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

