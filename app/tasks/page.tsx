"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { LayoutScaffold } from "@/components/grid-v2/LayoutScaffold"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    addMonths,
    differenceInHours,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    formatDistanceToNow,
    isSameDay,
    isSameMonth,
    parseISO,
    startOfMonth,
    startOfWeek,
} from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarClock, ChevronLeft, ChevronRight, Filter, Sparkles } from "lucide-react"

type TaskStatus = "draft" | "scheduled" | "in_progress" | "blocked" | "review" | "completed" | "archived"
type TaskPriority = "critical" | "high" | "medium" | "low"
type TaskSource = "planner" | "order" | "manual"
type TaskContextType =
  | "order"
  | "item"
  | "workflow"
  | "asset"
  | "team"
  | "planner_event"
  | "message"
  | "document"
  | "custom"

type TaskAssignment = {
  userId: string
  name: string
  role: "owner" | "collaborator" | "watcher"
  requiredAck: boolean
  acknowledgedAt?: string | null
}

type TaskContextLink = {
  type: TaskContextType
  referenceId: string
  label: string
  role: "primary" | "supporting"
}

type TaskScheduleSlot = {
  calendarId: string
  start: string
  end: string
  isAllDay?: boolean
  location?: string
  plannerEventId?: string
}

type TaskCardData = {
  id: string
  title: string
  summary: string
  status: TaskStatus
  priority: TaskPriority
  source: TaskSource
  owningTeamId: string
  owningTeamLabel: string
  schedule?: TaskScheduleSlot
  assignments: TaskAssignment[]
  contexts: TaskContextLink[]
  checklistCount?: { completed: number; total: number }
  completedAt?: string
}

type SuggestedTask = {
  id: string
  title: string
  rationale: string
  recommendedTeamId: string
  recommendedTeamLabel: string
  recommendedAssignee?: { userId: string; name: string }
  due: string
  origin: "order" | "planner" | "signal"
  expectedOutcome: string
  highlights: string[]
  confidence: number
  linkedContext: string
}

const BASE_MONTH = parseISO("2025-10-01T00:00:00-07:00")
const SIMULATION_NOW = parseISO("2025-10-05T09:00:00-07:00")
const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const TEAM_OPTIONS = [
  { id: "all", label: "All teams" },
  { id: "team-logistics", label: "Logistics" },
  { id: "team-production-ops", label: "Production Ops" },
  { id: "team-account", label: "Account Team" },
  { id: "team-material-planning", label: "Material Planning" },
  { id: "team-receiving", label: "Receiving" },
  { id: "team-quality", label: "Quality" },
]

const PEOPLE_OPTIONS = [
  { id: "all", label: "Everyone" },
  { id: "lauren-medina", label: "Lauren Medina" },
  { id: "jordan-li", label: "Jordan Li" },
  { id: "ravi-patel", label: "Ravi Patel" },
  { id: "priya-singh", label: "Priya Singh" },
  { id: "amelia-chen", label: "Amelia Chen" },
  { id: "karan-patel", label: "Karan Patel" },
  { id: "sasha-nguyen", label: "Sasha Nguyen" },
  { id: "noah-ortega", label: "Noah Ortega" },
  { id: "emily-zhao", label: "Emily Zhao" },
]

const PLANNER_EVENTS: Record<
  string,
  {
    id: string
    title: string
    start: string
    end: string
    location: string
    ownerTeam: string
    ownerTeamId: string
    orderId?: string
    clientId?: string
  }
> = {
  "evt-001": {
    id: "evt-001",
    title: "Fabric pick-up – Aurora jackets",
    start: "2025-10-07T08:00:00-07:00",
    end: "2025-10-07T09:30:00-07:00",
    location: "Port of Oakland",
    ownerTeam: "Logistics",
    ownerTeamId: "team-logistics",
    orderId: "ord-aurora",
    clientId: "horizon",
  },
  "evt-003": {
    id: "evt-003",
    title: "Client portal review",
    start: "2025-10-16T09:00:00-07:00",
    end: "2025-10-16T09:45:00-07:00",
    location: "Horizon HQ (virtual)",
    ownerTeam: "Account Team",
    ownerTeamId: "team-account",
    orderId: "ord-aurora",
    clientId: "horizon",
  },
}

const STATUS_META: Record<TaskStatus, { label: string; badge: string }> = {
  draft: { label: "Draft", badge: "bg-slate-100 text-slate-600" },
  scheduled: { label: "Scheduled", badge: "bg-gradient-to-r from-sky-100 to-sky-50 text-sky-700 border border-sky-200" },
  in_progress: { label: "In progress", badge: "bg-gradient-to-r from-indigo-100 to-indigo-50 text-indigo-700 border border-indigo-200" },
  blocked: { label: "Blocked", badge: "bg-gradient-to-r from-rose-100 to-rose-50 text-rose-700 border border-rose-200" },
  review: { label: "Review", badge: "bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border border-amber-200" },
  completed: { label: "Completed", badge: "bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border border-emerald-200" },
  archived: { label: "Archived", badge: "bg-slate-200 text-slate-600" },
}

const STATUS_DOT_COLOR: Record<TaskStatus, string> = {
  draft: "bg-slate-400",
  scheduled: "bg-sky-500",
  in_progress: "bg-indigo-500",
  blocked: "bg-rose-500",
  review: "bg-amber-500",
  completed: "bg-emerald-500",
  archived: "bg-slate-300",
}

const PRIORITY_META: Record<TaskPriority, { label: string; badge: string }> = {
  critical: { label: "Critical", badge: "bg-rose-600 text-white" },
  high: { label: "High", badge: "bg-orange-500 text-white" },
  medium: { label: "Medium", badge: "bg-amber-200 text-amber-800" },
  low: { label: "Low", badge: "bg-slate-200 text-slate-700" },
}

const SOURCE_META: Record<TaskSource, { label: string; badge: string }> = {
  planner: { label: "Planner", badge: "bg-sky-500/10 text-sky-600 border border-sky-200" },
  order: { label: "Order", badge: "bg-indigo-500/10 text-indigo-600 border border-indigo-200" },
  manual: { label: "Manual", badge: "bg-slate-500/10 text-slate-600 border border-slate-200" },
}

const SAMPLE_TASKS: TaskCardData[] = [
  {
    id: "task-evt-001-receive",
    title: "Receive inbound fabric delivery",
    summary: "Meet carrier, verify documentation, and log inbound QA testing.",
    status: "scheduled",
    priority: "high",
    source: "planner",
    owningTeamId: "team-logistics",
    owningTeamLabel: "Logistics",
    schedule: {
      calendarId: "cal-logistics",
      start: PLANNER_EVENTS["evt-001"].start,
      end: PLANNER_EVENTS["evt-001"].end,
      location: PLANNER_EVENTS["evt-001"].location,
      plannerEventId: "evt-001",
    },
    assignments: [
      { userId: "lauren-medina", name: "Lauren Medina", role: "owner", requiredAck: true },
      { userId: "jordan-li", name: "Jordan Li", role: "collaborator", requiredAck: false },
    ],
    contexts: [
      { type: "planner_event", referenceId: "evt-001", label: PLANNER_EVENTS["evt-001"].title, role: "primary" },
      { type: "order", referenceId: "ord-aurora", label: "Aurora Flight Jacket", role: "supporting" },
      { type: "team", referenceId: "team-logistics", label: "Logistics", role: "primary" },
    ],
    checklistCount: { completed: 1, total: 3 },
  },
  {
    id: "task-inspection-lineA",
    title: "Line A launch readiness inspection",
    summary: "Confirm equipment checks, staffing, and safety walkthroughs before the sprint.",
    status: "in_progress",
    priority: "critical",
    source: "order",
    owningTeamId: "team-production-ops",
    owningTeamLabel: "Production Ops",
    schedule: {
      calendarId: "cal-production",
      start: "2025-10-08T06:30:00-07:00",
      end: "2025-10-08T07:30:00-07:00",
      location: "Factory A – Main Floor",
    },
    assignments: [
      {
        userId: "ravi-patel",
        name: "Ravi Patel",
        role: "owner",
        requiredAck: true,
        acknowledgedAt: "2025-10-04T12:12:00-07:00",
      },
      { userId: "priya-singh", name: "Priya Singh", role: "collaborator", requiredAck: false },
    ],
    contexts: [
      { type: "order", referenceId: "ord-aurora", label: "Aurora Flight Jacket", role: "primary" },
      { type: "workflow", referenceId: "cut-sew", label: "Cut & Sew Apparel v4", role: "supporting" },
      { type: "team", referenceId: "team-production-ops", label: "Production Ops", role: "primary" },
    ],
    checklistCount: { completed: 2, total: 5 },
  },
  {
    id: "task-evt-003-briefing",
    title: "Prep client briefing deck",
    summary: "Align messaging, compile burndown charts, and attach latest QR previews.",
    status: "blocked",
    priority: "medium",
    source: "planner",
    owningTeamId: "team-account",
    owningTeamLabel: "Account Team",
    schedule: {
      calendarId: "cal-client",
      start: PLANNER_EVENTS["evt-003"].start,
      end: PLANNER_EVENTS["evt-003"].end,
      location: PLANNER_EVENTS["evt-003"].location,
      plannerEventId: "evt-003",
    },
    assignments: [
      { userId: "amelia-chen", name: "Amelia Chen", role: "owner", requiredAck: true },
      { userId: "karan-patel", name: "Karan Patel", role: "watcher", requiredAck: false },
    ],
    contexts: [
      { type: "planner_event", referenceId: "evt-003", label: PLANNER_EVENTS["evt-003"].title, role: "primary" },
      { type: "message", referenceId: "msg-aurora-briefing", label: "Client briefing thread", role: "supporting" },
      { type: "team", referenceId: "team-account", label: "Account Team", role: "primary" },
    ],
    checklistCount: { completed: 0, total: 4 },
  },
  {
    id: "task-quality-signoff",
    title: "QA sprint sign-off review",
    summary: "Audit sample pulls, log variances, and release the sprint for shipment.",
    status: "completed",
    priority: "medium",
    source: "order",
    owningTeamId: "team-quality",
    owningTeamLabel: "Quality",
    schedule: {
      calendarId: "cal-quality",
      start: "2025-10-04T08:30:00-07:00",
      end: "2025-10-04T09:15:00-07:00",
      location: "Quality Lab",
    },
    assignments: [
      {
        userId: "emily-zhao",
        name: "Emily Zhao",
        role: "owner",
        requiredAck: true,
        acknowledgedAt: "2025-10-04T07:45:00-07:00",
      },
    ],
    contexts: [
      { type: "order", referenceId: "ord-aurora", label: "Aurora Flight Jacket", role: "primary" },
      { type: "workflow", referenceId: "qa", label: "QA Sprint", role: "supporting" },
      { type: "team", referenceId: "team-quality", label: "Quality", role: "primary" },
    ],
    checklistCount: { completed: 4, total: 4 },
    completedAt: "2025-10-04T09:05:00-07:00",
  },
]

const SUGGESTED_TASKS: SuggestedTask[] = [
  {
    id: "suggestion-material-po",
    title: "Submit Aurora fabric purchase order",
    rationale: "New Aurora order confirmed – material plan needs locking to keep sewing start on schedule.",
    recommendedTeamId: "team-material-planning",
    recommendedTeamLabel: "Material Planning",
    recommendedAssignee: { userId: "sasha-nguyen", name: "Sasha Nguyen" },
    due: "2025-10-06T12:00:00-07:00",
    origin: "order",
    expectedOutcome: "PO released to suppliers with confirmed yardage, lead times, and cost approvals.",
    highlights: [
      "Order OR-aurora kicked off 4 hours ago",
      "Historical cadence: PO issued within 1 day of order approval",
      "No active PO exists for the selected fabric codes",
    ],
    confidence: 0.86,
    linkedContext: "Aurora Flight Jacket • Order",
  },
  {
    id: "suggestion-receiving-prep",
    title: "Prep Dock 2 for Aurora delivery",
    rationale: "Planner event EVT-001 scheduled; receiving bay needs staffing confirmation and staging.",
    recommendedTeamId: "team-receiving",
    recommendedTeamLabel: "Receiving",
    recommendedAssignee: { userId: "noah-ortega", name: "Noah Ortega" },
    due: "2025-10-07T06:30:00-07:00",
    origin: "planner",
    expectedOutcome: "Dock layout ready with scanners, pallet tags, and inspection checklist before truck arrival.",
    highlights: [
      "Inbound load estimated at 320 units",
      "Last delivery flagged a staging bottleneck",
      "Receiving shift calendar shows open coverage gap",
    ],
    confidence: 0.78,
    linkedContext: "Fabric pick-up – Aurora jackets",
  },
  {
    id: "suggestion-shrinkage-tests",
    title: "Schedule shrinkage test batch",
    rationale: "Historical data shows shrinkage validation within 12 hours of fabric intake for Aurora line.",
    recommendedTeamId: "team-quality",
    recommendedTeamLabel: "Quality",
    recommendedAssignee: { userId: "emily-zhao", name: "Emily Zhao" },
    due: "2025-10-07T16:00:00-07:00",
    origin: "signal",
    expectedOutcome: "10-piece shrinkage panel prepared, logged, and results uploaded to quality vault.",
    highlights: [
      "Cut plan indicates high-heat wash step",
      "Fabric supplier flagged lot variance in prior shipment",
      "No shrinkage test scheduled in planner for current week",
    ],
    confidence: 0.73,
    linkedContext: "Aurora Flight Jacket • Quality",
  },
]

export default function TasksPage() {
  const router = useRouter()
  const [teamFilter, setTeamFilter] = useState("all")
  const [personFilter, setPersonFilter] = useState("all")
  const [sidebarTab, setSidebarTab] = useState<"active" | "suggested">("active")
  const [monthOffset, setMonthOffset] = useState(0)

  const referenceMonth = useMemo(() => addMonths(BASE_MONTH, monthOffset), [monthOffset])

  const filteredTasks = useMemo(() => {
    return SAMPLE_TASKS.filter((task) => {
      const teamMatch = teamFilter === "all" || task.owningTeamId === teamFilter
      const personMatch =
        personFilter === "all" || task.assignments.some((assignment) => assignment.userId === personFilter)
      return teamMatch && personMatch
    })
  }, [teamFilter, personFilter])

  const filteredSuggestions = useMemo(() => {
    return SUGGESTED_TASKS.filter((suggestion) => {
      const teamMatch = teamFilter === "all" || suggestion.recommendedTeamId === teamFilter
      const personMatch =
        personFilter === "all" || suggestion.recommendedAssignee?.userId === personFilter
      return teamMatch && personMatch
    })
  }, [teamFilter, personFilter])

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(referenceMonth), { weekStartsOn: 1 })
    const end = endOfWeek(endOfMonth(referenceMonth), { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [referenceMonth])

  const tasksByDay = useMemo(() => {
    const map = new Map<string, TaskCardData[]>()
    filteredTasks.forEach((task) => {
      if (!task.schedule) return
      const key = format(parseISO(task.schedule.start), "yyyy-MM-dd")
      if (!map.has(key)) {
        map.set(key, [])
      }
      map.get(key)!.push(task)
    })
    return map
  }, [filteredTasks])

  const suggestionsByDay = useMemo(() => {
    const map = new Map<string, SuggestedTask[]>()
    filteredSuggestions.forEach((suggestion) => {
      const key = format(parseISO(suggestion.due), "yyyy-MM-dd")
      if (!map.has(key)) {
        map.set(key, [])
      }
      map.get(key)!.push(suggestion)
    })
    return map
  }, [filteredSuggestions])

  const activeTasks = useMemo(
    () => filteredTasks.filter((task) => task.status !== "completed" && task.status !== "archived"),
    [filteredTasks]
  )

  const blockedCount = useMemo(
    () => filteredTasks.filter((task) => task.status === "blocked").length,
    [filteredTasks]
  )

  const ackPendingCount = useMemo(() => {
    return filteredTasks.reduce((total, task) => {
      const pending = task.assignments.some(
        (assignment) => assignment.role === "owner" && assignment.requiredAck && !assignment.acknowledgedAt
      )
      return pending ? total + 1 : total
    }, 0)
  }, [filteredTasks])

  const dueSoonCount = useMemo(() => {
    return filteredTasks.filter((task) => {
      if (!task.schedule) return false
      const hoursUntilStart = differenceInHours(parseISO(task.schedule.start), SIMULATION_NOW)
      return hoursUntilStart >= 0 && hoursUntilStart <= 48
    }).length
  }, [filteredTasks])

  const monthLabel = format(referenceMonth, "MMMM yyyy")

  const filteredSuggestionConfidence = filteredSuggestions.length
    ? Math.round(
        (filteredSuggestions.reduce((sum, suggestion) => sum + suggestion.confidence, 0) /
          filteredSuggestions.length) *
          100
      )
    : 0

  const summaryCards = [
    {
      id: "active",
      label: "Active workload",
      value: activeTasks.length,
      bgClass: "border-sky-200 bg-sky-50/80",
      meta:
        dueSoonCount > 0
          ? `${dueSoonCount} due in 48h${blockedCount > 0 ? ` · ${blockedCount} blocked` : ""}`
          : blockedCount > 0
          ? `${blockedCount} blocked`
          : "All clear",
    },
    {
      id: "ack",
      label: "Owner acknowledgements",
      value: ackPendingCount,
      bgClass: "border-indigo-200 bg-indigo-50/70",
      meta:
        ackPendingCount > 0
          ? `${ackPendingCount} owner${ackPendingCount === 1 ? "" : "s"} awaiting confirmation`
          : "All owners up to speed",
    },
    {
      id: "suggested",
      label: "Suggestion queue",
      value: filteredSuggestions.length,
      bgClass: "border-amber-200 bg-amber-50/70",
      meta:
        filteredSuggestions.length > 0
          ? `${filteredSuggestionConfidence}% avg confidence`
          : "No new recommendations right now",
    },
  ]

  const baseTasks = SAMPLE_TASKS
  const teamScopedTasks =
    teamFilter === "all"
      ? baseTasks
      : baseTasks.filter((task) => task.owningTeamId === teamFilter)

  const personScopedTasks =
    personFilter === "all"
      ? teamScopedTasks
      : teamScopedTasks.filter((task) =>
          task.assignments.some((assignment) => assignment.userId === personFilter)
        )

  const computeActiveCount = (tasks: TaskCardData[]) =>
    tasks.filter((task) => task.status !== "completed" && task.status !== "archived").length

  const computeBlockedCount = (tasks: TaskCardData[]) =>
    tasks.filter((task) => task.status === "blocked").length

  const computeCompletedCount = (tasks: TaskCardData[]) =>
    tasks.filter((task) => task.status === "completed").length

  const computeCompletionRate = (tasks: TaskCardData[]) => {
    if (!tasks.length) return null
    return Math.round((computeCompletedCount(tasks) / tasks.length) * 100)
  }

  const computeDueSoonCount = (tasks: TaskCardData[]) =>
    tasks.filter((task) => {
      if (!task.schedule) return false
      const hoursUntilStart = differenceInHours(parseISO(task.schedule.start), SIMULATION_NOW)
      return hoursUntilStart >= 0 && hoursUntilStart <= 48
    }).length

  const computeOverdueCount = (tasks: TaskCardData[]) =>
    tasks.filter(
      (task) =>
        task.schedule && parseISO(task.schedule.start) < SIMULATION_NOW && task.status !== "completed"
    ).length

  const describeUrgency = (dueSoon: number, blocked: number, overdue: number) => {
    const segments: string[] = []
    if (dueSoon > 0) segments.push(`${dueSoon} due in 48h`)
    if (blocked > 0) segments.push(`${blocked} blocked`)
    if (overdue > 0) segments.push(`${overdue} overdue`)
    return segments.length ? segments.join(" · ") : "Nothing urgent right now."
  }

  const ownerAssignmentsFor = (tasks: TaskCardData[]) =>
    tasks.flatMap((task) =>
      task.assignments.filter((assignment) => assignment.role === "owner" && assignment.requiredAck)
    )

  const computeOwnerCoverage = (tasks: TaskCardData[]) => {
    const assignments = ownerAssignmentsFor(tasks)
    if (!assignments.length) return null
    const acknowledged = assignments.filter((assignment) => assignment.acknowledgedAt).length
    return Math.round((acknowledged / assignments.length) * 100)
  }

  const orgCompletedCount = computeCompletedCount(baseTasks)
  const orgCompletionRate = computeCompletionRate(baseTasks)
  const orgOverdueCount = computeOverdueCount(baseTasks)
  const orgOnTimeRate = baseTasks.length
    ? Math.round(((baseTasks.length - orgOverdueCount) / baseTasks.length) * 100)
    : null
  const orgOwnerAssignments = ownerAssignmentsFor(baseTasks)
  const orgOwnerAssignmentsCount = orgOwnerAssignments.length
  const orgOwnerAcknowledgedCount = orgOwnerAssignments.filter((assignment) => assignment.acknowledgedAt).length
  const orgOwnerCoverage = computeOwnerCoverage(baseTasks)
  const orgSuggestionCount = SUGGESTED_TASKS.length
  const orgSuggestionConfidence = orgSuggestionCount
    ? Math.round((SUGGESTED_TASKS.reduce((sum, suggestion) => sum + suggestion.confidence, 0) / orgSuggestionCount) * 100)
    : null

  const teamCompletedCount = computeCompletedCount(teamScopedTasks)
  const teamCompletionRate = computeCompletionRate(teamScopedTasks)
  const teamActiveCount = computeActiveCount(teamScopedTasks)
  const teamBlockedCount = computeBlockedCount(teamScopedTasks)
  const teamDueSoonCount = computeDueSoonCount(teamScopedTasks)
  const teamOverdueCount = computeOverdueCount(teamScopedTasks)
  const teamOwnerAssignments = ownerAssignmentsFor(teamScopedTasks)
  const teamOwnerAssignmentsCount = teamOwnerAssignments.length
  const teamOwnerAcknowledgedCount = teamOwnerAssignments.filter((assignment) => assignment.acknowledgedAt).length
  const teamOwnerCoverage = computeOwnerCoverage(teamScopedTasks)
  const teamSuggestions =
    teamFilter === "all"
      ? SUGGESTED_TASKS
      : SUGGESTED_TASKS.filter((suggestion) => suggestion.recommendedTeamId === teamFilter)
  const teamSuggestionCount = teamSuggestions.length
  const teamSuggestionConfidence = teamSuggestionCount
    ? Math.round((teamSuggestions.reduce((sum, suggestion) => sum + suggestion.confidence, 0) / teamSuggestionCount) * 100)
    : null

  const personCompletedCount = computeCompletedCount(personScopedTasks)
  const personCompletionRate = computeCompletionRate(personScopedTasks)
  const personActiveCount = computeActiveCount(personScopedTasks)
  const personBlockedCount = computeBlockedCount(personScopedTasks)
  const personDueSoonCount = computeDueSoonCount(personScopedTasks)
  const personOverdueCount = computeOverdueCount(personScopedTasks)
  const personOwnerAssignments = ownerAssignmentsFor(personScopedTasks)
  const personOwnerAcknowledgedCount = personOwnerAssignments.filter((assignment) => assignment.acknowledgedAt).length
  const personOwnerCoverage = computeOwnerCoverage(personScopedTasks)
  const personLastCompletedAt = personScopedTasks
    .filter((task) => task.completedAt)
    .reduce<Date | null>((latest, task) => {
      const completedAt = parseISO(task.completedAt as string)
      return !latest || completedAt > latest ? completedAt : latest
    }, null)
  const personLastCompletedLabel = personLastCompletedAt ? format(personLastCompletedAt, "MMM d · h:mm a") : "—"
  const personLastCompletedRelative = personLastCompletedAt
    ? formatDistanceToNow(personLastCompletedAt, { addSuffix: true })
    : null
  const personSuggestionCount =
    personFilter === "all"
      ? filteredSuggestions.length
      : SUGGESTED_TASKS.filter((suggestion) => suggestion.recommendedAssignee?.userId === personFilter).length

  const personOption = PEOPLE_OPTIONS.find((option) => option.id === personFilter)
  const personTitle = personFilter === "all" ? "All teammates" : personOption?.label ?? "Selected teammate"
  const personSubtitle =
    personFilter === "all"
      ? "Aggregated across current filters."
      : `${personScopedTasks.length} task${personScopedTasks.length === 1 ? "" : "s"} in focus` +
        (personSuggestionCount > 0 ? ` · ${personSuggestionCount} suggestion${personSuggestionCount === 1 ? "" : "s"}` : "")

  const personCompletionDelta =
    personCompletionRate !== null && teamCompletionRate !== null ? personCompletionRate - teamCompletionRate : null

  const teamOption = TEAM_OPTIONS.find((option) => option.id === teamFilter)
  const teamTitle = teamFilter === "all" ? "All teams" : teamOption?.label ?? "Selected team"
  const teamSubtitle = `${teamActiveCount} active · ${teamBlockedCount} blocked · ${teamSuggestionCount} suggestion${teamSuggestionCount === 1 ? "" : "s"}`

  const teamCompletionDelta =
    teamCompletionRate !== null && orgCompletionRate !== null ? teamCompletionRate - orgCompletionRate : null

  const personMetrics = [
    {
      label: "Completion rate",
      value: personCompletionRate === null ? "—" : `${personCompletionRate}%`,
      hint:
        personScopedTasks.length > 0
          ? `${personCompletedCount}/${personScopedTasks.length} closed` +
            (personCompletionDelta !== null
              ? ` (${personCompletionDelta >= 0 ? "+" : ""}${personCompletionDelta}% vs team)`
              : "")
          : "No tasks selected yet.",
    },
    {
      label: "Active tasks",
      value: `${personActiveCount}`,
      hint: describeUrgency(personDueSoonCount, personBlockedCount, personOverdueCount),
    },
    {
      label: "Owner acknowledgements",
      value: personOwnerCoverage === null ? "—" : `${personOwnerCoverage}%`,
      hint:
        personOwnerAssignments.length > 0
          ? `${personOwnerAcknowledgedCount}/${personOwnerAssignments.length} confirmed`
          : "No owner sign-offs assigned.",
    },
    {
      label: "Last completion",
      value: personLastCompletedLabel,
      hint: personLastCompletedRelative ?? "Complete a task to seed history.",
    },
  ]

  const teamMetrics = [
    {
      label: "Completion rate",
      value: teamCompletionRate === null ? "—" : `${teamCompletionRate}%`,
      hint:
        teamScopedTasks.length > 0
          ? `${teamCompletedCount}/${teamScopedTasks.length} closed` +
            (teamCompletionDelta !== null
              ? ` (${teamCompletionDelta >= 0 ? "+" : ""}${teamCompletionDelta}% vs org)`
              : "")
          : "Team has no tracked tasks yet.",
    },
    {
      label: "Active tasks",
      value: `${teamActiveCount}`,
      hint: describeUrgency(teamDueSoonCount, teamBlockedCount, teamOverdueCount),
    },
    {
      label: "Owner acknowledgements",
      value: teamOwnerCoverage === null ? "—" : `${teamOwnerCoverage}%`,
      hint:
        teamOwnerAssignmentsCount > 0
          ? `${teamOwnerAcknowledgedCount}/${teamOwnerAssignmentsCount} confirmed`
          : "No owner sign-offs tracked.",
    },
    {
      label: "Suggestion queue",
      value: `${teamSuggestionCount}`,
      hint:
        teamSuggestionCount > 0
          ? `${teamSuggestionConfidence}% avg confidence`
          : "No tailored recommendations right now.",
    },
  ]

  const orgMetrics = [
    {
      label: "Completion rate",
      value: orgCompletionRate === null ? "—" : `${orgCompletionRate}%`,
      hint: `${orgCompletedCount}/${baseTasks.length} closed`,
    },
    {
      label: "On-time readiness",
      value: orgOnTimeRate === null ? "—" : `${orgOnTimeRate}%`,
      hint:
        orgOverdueCount > 0
          ? `${orgOverdueCount} task${orgOverdueCount === 1 ? "" : "s"} overdue`
          : "All scheduled work on pace.",
    },
    {
      label: "Owner acknowledgements",
      value: orgOwnerCoverage === null ? "—" : `${orgOwnerCoverage}%`,
      hint:
        orgOwnerAssignmentsCount > 0
          ? `${orgOwnerAcknowledgedCount}/${orgOwnerAssignmentsCount} confirmed`
          : "No owner sign-offs tracked.",
    },
    {
      label: "Suggestion queue",
      value: `${orgSuggestionCount}`,
      hint:
        orgSuggestionCount > 0
          ? `${orgSuggestionConfidence}% avg confidence`
          : "No suggestions generated yet.",
    },
  ]

  return (
    <LayoutScaffold
      pageTitle="Taskmaster"
      pageSubtext="Task orchestration hub"
      headerActions={
        <Button
          className="rounded-full bg-slate-900 px-4 text-white hover:bg-slate-800"
          onClick={() => router.push("/tasks/new")}
        >
          New task
        </Button>
      }
    >
      <div className="space-y-8 py-6">
        <header className="flex flex-col gap-6 rounded-3xl bg-slate-50/80 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="rounded-3xl bg-sky-500/15 p-3 text-sky-600">
                <CalendarClock className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-semibold text-slate-900">Taskmaster Orchestrator</h1>
                <p className="text-sm text-slate-600 max-w-xl">
                  Keep the floor synchronized around orders, planner events, and AI-suggested work. Approve new tasks, monitor
                  live progress, and spot blockers before they ripple.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
              <Filter className="h-3.5 w-3.5" />
              Filters
            </div>
            <Select value={teamFilter} onValueChange={setTeamFilter}>
              <SelectTrigger className="rounded-full border border-slate-200 bg-white/80 px-4 shadow-sm" size="default">
                <SelectValue placeholder="Team" />
              </SelectTrigger>
              <SelectContent>
                {TEAM_OPTIONS.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={personFilter} onValueChange={setPersonFilter}>
              <SelectTrigger className="rounded-full border border-slate-200 bg-white/80 px-4 shadow-sm" size="default">
                <SelectValue placeholder="Person" />
              </SelectTrigger>
              <SelectContent>
                {PEOPLE_OPTIONS.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-3">
          {summaryCards.map((card) => (
            <div
              key={card.id}
              className={cn(
                "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition",
                card.bgClass,
              )}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{card.label}</p>
              <p className="mt-2 text-4xl font-semibold text-slate-900">{card.value}</p>
              <p className="mt-3 text-sm text-slate-600">{card.meta}</p>
            </div>
          ))}
        </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Calendar</p>
                    <p className="text-2xl font-semibold text-slate-900">{monthLabel}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setMonthOffset((prev) => prev - 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-100"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setMonthOffset((prev) => prev + 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-100"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

              <div className="mt-6 grid grid-cols-7 gap-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                {WEEKDAY_LABELS.map((label) => (
                  <div key={label}>{label}</div>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-7 gap-3">
                {calendarDays.map((day) => {
                  const dayKey = format(day, "yyyy-MM-dd")
                  const cellTasks = (tasksByDay.get(dayKey) ?? []).sort((a, b) => {
                    const aTime = a.schedule ? parseISO(a.schedule.start).getTime() : 0
                    const bTime = b.schedule ? parseISO(b.schedule.start).getTime() : 0
                    return aTime - bTime
                  })
                  const cellSuggestions = suggestionsByDay.get(dayKey) ?? []
                  const isOutside = !isSameMonth(day, referenceMonth)
                  const isToday = isSameDay(day, SIMULATION_NOW)

                  return (
                    <div
                      key={day.toISOString()}
                      className={cn(
                        "min-h-[140px] rounded-2xl border p-3 transition",
                        isOutside
                          ? "border-dashed border-slate-200 bg-slate-50 text-slate-400"
                          : "border-slate-200 bg-gradient-to-br from-white via-white to-slate-50",
                        isToday && "ring-2 ring-sky-300"
                      )}
                    >
                      <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                        <span>{format(day, "d")}</span>
                        {isToday && (
                          <span className="rounded-full bg-sky-100 px-2 py-1 text-[10px] font-semibold uppercase text-sky-600">
                            Today
                          </span>
                        )}
                      </div>

                      <div className="mt-3 space-y-2 text-xs">
                        {cellTasks.slice(0, 2).map((task) => (
                          <div
                            key={`${dayKey}-${task.id}`}
                            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-slate-700 shadow-sm"
                          >
                            <span className={cn("h-2.5 w-2.5 rounded-full", STATUS_DOT_COLOR[task.status])} />
                            <span className="font-medium leading-tight line-clamp-2">{task.title}</span>
                          </div>
                        ))}
                        {cellTasks.length > 2 && (
                          <div className="text-[11px] text-slate-500">+{cellTasks.length - 2} more</div>
                        )}

                        {cellSuggestions.slice(0, 1).map((suggestion) => (
                          <div
                            key={`${dayKey}-${suggestion.id}`}
                            className="flex items-start gap-2 rounded-2xl border border-amber-300/70 bg-amber-50/90 px-3 py-2 text-amber-800 shadow-sm"
                          >
                            <Sparkles className="mt-0.5 h-3 w-3" />
                            <div className="leading-snug">
                              <p className="font-semibold line-clamp-2">{suggestion.title}</p>
                              <p className="text-[11px] text-amber-700/80">{suggestion.recommendedTeamLabel}</p>
                            </div>
                          </div>
                        ))}
                        {cellSuggestions.length > 1 && (
                          <div className="text-[11px] font-medium text-amber-600">
                            +{cellSuggestions.length - 1} more suggestion
                            {cellSuggestions.length - 1 > 1 ? "s" : ""}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="grid gap-6 lg:grid-cols-2">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Person focus</p>
                        <h3 className="text-lg font-semibold text-slate-900">{personTitle}</h3>
                        <p className="text-xs text-slate-500">{personSubtitle}</p>
                      </div>
                    </div>
                    <dl className="mt-4 space-y-4">
                      {personMetrics.map((metric) => (
                        <div
                          key={metric.label}
                          className="flex items-baseline justify-between gap-6 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0"
                        >
                          <div>
                            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{metric.label}</dt>
                            {metric.hint && <p className="mt-1 text-xs text-slate-500">{metric.hint}</p>}
                          </div>
                          <dd className="text-right text-lg font-semibold text-slate-900">{metric.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Team pulse</p>
                        <h3 className="text-lg font-semibold text-slate-900">{teamTitle}</h3>
                        <p className="text-xs text-slate-500">{teamSubtitle}</p>
                      </div>
                    </div>
                    <dl className="mt-4 space-y-4">
                      {teamMetrics.map((metric) => (
                        <div
                          key={metric.label}
                          className="flex items-baseline justify-between gap-6 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0"
                        >
                          <div>
                            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{metric.label}</dt>
                            {metric.hint && <p className="mt-1 text-xs text-slate-500">{metric.hint}</p>}
                          </div>
                          <dd className="text-right text-lg font-semibold text-slate-900">{metric.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
                <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Organization baseline</p>
                      <h3 className="text-lg font-semibold text-slate-900">Groovy platform</h3>
                    </div>
                    <span className="text-xs font-medium text-slate-500">{baseTasks.length} tasks tracked</span>
                  </div>
                  <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                    {orgMetrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="flex items-baseline justify-between gap-4 border-b border-slate-200 pb-3 last:border-b-0 last:pb-0"
                      >
                        <div>
                          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{metric.label}</dt>
                          {metric.hint && <p className="mt-1 text-xs text-slate-500">{metric.hint}</p>}
                        </div>
                        <dd className="text-right text-lg font-semibold text-slate-900">{metric.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>

            <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Task streams</p>
                  <h2 className="text-xl font-semibold text-slate-900">Control queue</h2>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {activeTasks.length} active
                </div>
              </div>

              <div className="mt-4 flex gap-2 rounded-full bg-slate-100 p-1 text-sm font-semibold text-slate-500">
                <button
                  onClick={() => setSidebarTab("active")}
                  className={cn(
                    "flex-1 rounded-full px-4 py-2 transition",
                    sidebarTab === "active" && "bg-white text-slate-900 shadow"
                  )}
                >
                  Live tasks
                </button>
                <button
                  onClick={() => setSidebarTab("suggested")}
                  className={cn(
                    "flex-1 rounded-full px-4 py-2 transition",
                    sidebarTab === "suggested" && "bg-white text-slate-900 shadow"
                  )}
                >
                  Suggested
                </button>
              </div>

              <div className="mt-4 flex-1 space-y-4 overflow-y-auto pr-1">
                {sidebarTab === "active" ? (
                  activeTasks.length > 0 ? (
                    activeTasks.map((task) => <ActiveTaskCard key={task.id} task={task} />)
                  ) : (
                    <EmptyState
                      title="No active tasks in this view"
                      message="Use filters or approve suggested work to populate the stream."
                    />
                  )
                ) : filteredSuggestions.length > 0 ? (
                  filteredSuggestions.map((suggestion) => (
                    <SuggestedTaskCard key={suggestion.id} suggestion={suggestion} />
                  ))
                ) : (
                  <EmptyState
                    title="No suggested tasks right now"
                    message="As orders evolve we'll surface fresh recommendations here."
                  />
                )}
              </div>
            </div>
          </section>
        </div>
    </LayoutScaffold>
  )
}

type ActiveTaskCardProps = {
  task: TaskCardData
}

function ActiveTaskCard({ task }: ActiveTaskCardProps) {
  const statusMeta = STATUS_META[task.status]
  const priorityMeta = PRIORITY_META[task.priority]
  const sourceMeta = SOURCE_META[task.source]
  const scheduleLabel = task.schedule ? format(parseISO(task.schedule.start), "MMM d · h:mm a") : "To be scheduled"
  const progressPercent = task.checklistCount
    ? Math.round((task.checklistCount.completed / Math.max(task.checklistCount.total, 1)) * 100)
    : null
  const ownerAckPending = task.assignments.some(
    (assignment) => assignment.role === "owner" && assignment.requiredAck && !assignment.acknowledgedAt
  )

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 p-5 text-slate-800 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{task.owningTeamLabel}</p>
          <h3 className="text-lg font-semibold leading-snug text-slate-900">{task.title}</h3>
          <p className="text-sm text-slate-500">{task.summary}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge className={cn("rounded-full px-3 py-1 text-[11px] font-semibold", statusMeta.badge)}>
            {statusMeta.label}
          </Badge>
          <Badge className={cn("rounded-full px-3 py-1 text-[11px] font-semibold", priorityMeta.badge)}>
            {priorityMeta.label}
          </Badge>
          <Badge className={cn("rounded-full px-3 py-1 text-[11px]", sourceMeta.badge)}>{sourceMeta.label}</Badge>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
        <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">{scheduleLabel}</span>
        {task.schedule?.location && (
          <span className="rounded-full border border-slate-200 px-3 py-1 text-slate-500">
            {task.schedule.location}
          </span>
        )}
        {task.schedule?.plannerEventId && (
          <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sky-700">
            Linked planner event
          </span>
        )}
      </div>

      {progressPercent !== null && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Checklist progress</span>
            <span className="font-semibold text-slate-700">{progressPercent}%</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 to-sky-600"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 text-xs text-slate-600">
        {task.assignments.map((assignment) => (
          <span
            key={`${task.id}-${assignment.userId}`}
            className={cn(
              "rounded-full px-3 py-1",
              assignment.role === "owner"
                ? "bg-emerald-500/10 font-medium text-emerald-700"
                : "bg-slate-100 text-slate-600"
            )}
          >
            {assignment.role === "owner"
              ? `Owner • ${assignment.name}`
              : assignment.role === "collaborator"
              ? `Collaborator • ${assignment.name}`
              : `Watcher • ${assignment.name}`}
          </span>
        ))}
      </div>

      {ownerAckPending && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-[12px] text-amber-700">
          Owner acknowledgement still pending
        </div>
      )}

      {task.contexts.length > 0 && (
        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          {task.contexts
            .filter((context) => context.role === "primary")
            .map((context) => (
              <span
                key={`${task.id}-${context.type}-${context.referenceId}`}
                className="rounded-full border border-slate-200 px-3 py-1"
              >
                {context.label}
              </span>
            ))}
        </div>
      )}
    </div>
  )
}

type SuggestedTaskCardProps = {
  suggestion: SuggestedTask
}

function SuggestedTaskCard({ suggestion }: SuggestedTaskCardProps) {
  const dueLabel = format(parseISO(suggestion.due), "MMM d · h:mm a")
  const confidencePercent = Math.round(suggestion.confidence * 100)

  return (
    <div className="space-y-4 rounded-2xl border border-amber-300/70 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-5 text-amber-900 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-700">
            <Sparkles className="h-3.5 w-3.5" />
            Suggested task
          </div>
          <h3 className="text-lg font-semibold leading-snug">{suggestion.title}</h3>
          <p className="text-sm text-amber-800/80">{suggestion.rationale}</p>
        </div>
        <Badge className="rounded-full border border-amber-400 bg-amber-100 px-3 py-1 text-[11px] font-semibold text-amber-800">
          {confidencePercent}% confidence
        </Badge>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-amber-800/80">
        <span className="rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-900">
          {suggestion.recommendedTeamLabel}
        </span>
        {suggestion.recommendedAssignee && (
          <span className="rounded-full border border-amber-200 bg-white/80 px-3 py-1 text-amber-800">
            {suggestion.recommendedAssignee.name}
          </span>
        )}
        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-800">
          Due {dueLabel}
        </span>
        <span className="rounded-full border border-amber-200 bg-white/70 px-3 py-1 text-amber-700">
          {suggestion.linkedContext}
        </span>
      </div>

      <div className="space-y-2 text-sm text-amber-900">
        <p className="font-semibold">Expected outcome</p>
        <p className="text-sm text-amber-800/80">{suggestion.expectedOutcome}</p>
      </div>

      <ul className="space-y-1 text-xs text-amber-700">
        {suggestion.highlights.map((highlight) => (
          <li key={highlight} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
            <span>{highlight}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-3">
        <Button className="rounded-full bg-emerald-600 px-5 text-white hover:bg-emerald-500" onClick={() => undefined}>
          Approve
        </Button>
        <Button
          variant="outline"
          className="rounded-full border border-amber-400 bg-white px-5 text-amber-700 hover:bg-amber-100"
          onClick={() => undefined}
        >
          Dismiss
        </Button>
      </div>
    </div>
  )
}

type EmptyStateProps = {
  title: string
  message: string
}

function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-6 text-center text-sm text-slate-500">
      <p className="font-semibold text-slate-600">{title}</p>
      <p className="mt-2 text-slate-500">{message}</p>
    </div>
  )
}
