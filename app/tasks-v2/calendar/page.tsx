"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { LayoutScaffold } from "@/components/grid-v2/LayoutScaffold"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    CalendarDays,
    Filter,
    Home,
    ChevronRight,
    Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { MOCK_TASKS, SUGGESTED_TASKS, SYSTEM_ANALYTICS, MOCK_TEAMS } from "@/lib/tasks-v2/mockData"
import type { Task, SuggestedTask } from "@/lib/tasks-v2/types"
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek, addMonths } from "date-fns"
import { TaskCreationDrawer } from "@/components/tasks-v2/TaskCreationDrawer"

export default function TasksV2CalendarPage() {
  const router = useRouter()
  const [selectedTeam, setSelectedTeam] = useState<string>("all")
  const [monthOffset, setMonthOffset] = useState(0)
  const [showTaskCreation, setShowTaskCreation] = useState(false)

  const referenceMonth = useMemo(() => {
    const base = new Date("2025-10-01T00:00:00-07:00")
    return addMonths(base, monthOffset)
  }, [monthOffset])

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

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(referenceMonth), { weekStartsOn: 1 })
    const end = endOfWeek(endOfMonth(referenceMonth), { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [referenceMonth])

  const tasksByDay = useMemo(() => {
    const map = new Map<string, Task[]>()
    filteredTasks.forEach((task) => {
      if (!task.schedule) return
      const key = format(parseISO(task.schedule.start), "yyyy-MM-dd")
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(task)
    })
    return map
  }, [filteredTasks])

  const suggestionsByDay = useMemo(() => {
    const map = new Map<string, SuggestedTask[]>()
    filteredSuggestions.forEach((suggestion) => {
      const key = format(parseISO(suggestion.suggestedDueDate), "yyyy-MM-dd")
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(suggestion)
    })
    return map
  }, [filteredSuggestions])

  return (
    <LayoutScaffold
      pageTitle="Taskmaster v2"
      pageSubtext="Unified task management across all teams"
      headerActions={
        <Button
          className="rounded-full bg-slate-900 px-4 text-white hover:bg-slate-800"
          onClick={() => setShowTaskCreation(true)}
        >
          New task
        </Button>
      }
    >
      <div className="space-y-6 py-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Home className="h-4 w-4" />
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-slate-900">Calendar</span>
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

              {/* Calendar Tab - Active */}
              <button
                className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors bg-slate-900 text-white shadow-sm"
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

          {/* Tab Content - Calendar */}
          <div className="p-6">
            {/* Header with filters */}
            <header className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-sky-500/10 p-2.5 text-sky-600">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Task Calendar</h2>
                  <p className="text-sm text-slate-600">View all tasks and suggestions across time</p>
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

            {/* Calendar */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  {format(referenceMonth, "MMMM yyyy")}
                </h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMonthOffset((prev) => prev - 1)}
                  >
                    ←
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMonthOffset(0)}
                  >
                    Today
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMonthOffset((prev) => prev + 1)}
                  >
                    →
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day) => {
                  const dayKey = format(day, "yyyy-MM-dd")
                  const cellTasks = tasksByDay.get(dayKey) || []
                  const cellSuggestions = suggestionsByDay.get(dayKey) || []
                  const isOutside = !isSameMonth(day, referenceMonth)
                  const isToday = isSameDay(day, new Date("2025-10-10T09:00:00-07:00"))

                  return (
                    <div
                      key={day.toISOString()}
                      className={cn(
                        "min-h-[120px] rounded-xl border p-2 transition",
                        isOutside
                          ? "border-dashed border-slate-200 bg-slate-50 text-slate-400"
                          : "border-slate-200 bg-white",
                        isToday && "ring-2 ring-sky-300"
                      )}
                    >
                      <div className="flex items-center justify-between text-sm font-semibold mb-2">
                        <span className={cn(isOutside ? "text-slate-400" : "text-slate-700")}>
                          {format(day, "d")}
                        </span>
                        {isToday && (
                          <span className="rounded-full bg-sky-100 px-1.5 py-0.5 text-[10px] font-semibold text-sky-600">
                            Today
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5 text-xs">
                        {cellTasks.slice(0, 3).map((task) => (
                          <div
                            key={task.id}
                            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 py-1 shadow-sm cursor-pointer hover:border-slate-300"
                            style={{
                              borderLeftWidth: "3px",
                              borderLeftColor: task.owningTeamColor,
                            }}
                          >
                            <span className="truncate text-slate-700 font-medium leading-tight">
                              {task.title}
                            </span>
                          </div>
                        ))}
                        {cellTasks.length > 3 && (
                          <div className="text-[11px] text-slate-500">+{cellTasks.length - 3} more</div>
                        )}

                        {cellSuggestions.slice(0, 1).map((suggestion) => (
                          <div
                            key={suggestion.id}
                            className="flex items-start gap-1.5 rounded-lg border border-amber-300/70 bg-amber-50/90 px-2 py-1 shadow-sm"
                          >
                            <Sparkles className="mt-0.5 h-3 w-3 text-amber-600 shrink-0" />
                            <span className="truncate text-amber-800 font-medium leading-tight">
                              {suggestion.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
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


