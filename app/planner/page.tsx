"use client"

import { useEffect, useMemo, useState } from "react"

import Sidebar from "@/components/Sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  ArrowRight,
  Filter,
  GripVertical,
  Info,
  PlusCircle,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react"

import { LOCATION_OPTIONS, TEAM_DIRECTORY } from "../orders/new/types"

type DateKey = string

type PlannerEventCategory = "pickup" | "dropoff" | "production" | "milestone" | "task" | "workflow"

type PlannerEvent = {
  id: string
  title: string
  category: PlannerEventCategory
  start: DateKey
  end: DateKey
  location: string
  owner: string
  notes: string
  unitsPlanned: number
  estimatedValue: number
  workflowId: string
  orderId: string
  clientId: string
  notifications: {
    email: boolean
    sms: boolean
    portal: boolean
    slack: boolean
  }
}

type CalendarDay = {
  date: Date
  key: DateKey
  isCurrentMonth: boolean
  isToday: boolean
}

type WeekSummary = {
  units: number
  value: number
  events: number
  capacity: number
  utilization: number
  valueProgress: number
}

type WeekSegment = {
  event: PlannerEvent
  startIndex: number
  span: number
  row: number
  isStart: boolean
  isEnd: boolean
}

const WORKFLOW_FILTERS = [
  { id: "all", label: "All workflows" },
  { id: "cut-sew", label: "Cut & Sew Apparel v4" },
  { id: "tracing", label: "Tracing & Compliance" },
  { id: "qa", label: "QA Sprint" },
]

const ORDER_FILTERS = [
  { id: "all", label: "All orders" },
  { id: "ord-aurora", label: "Aurora Flight Jacket" },
  { id: "ord-atlas", label: "Atlas Cargo Pant" },
  { id: "ord-halo", label: "Halo Accessories" },
]

const CLIENT_FILTERS = [
  { id: "all", label: "All clients" },
  { id: "horizon", label: "Horizon Apparel Co." },
  { id: "atlas", label: "Atlas Activewear" },
  { id: "nova", label: "Nova Fashion Group" },
]

const WORKFLOW_OPTIONS = WORKFLOW_FILTERS.filter((option) => option.id !== "all")
const ORDER_OPTIONS = ORDER_FILTERS.filter((option) => option.id !== "all")
const CLIENT_OPTIONS = CLIENT_FILTERS.filter((option) => option.id !== "all")

const CATEGORY_META: Record<PlannerEventCategory, { label: string; color: string; dot: string; badge: string }> = {
  pickup: {
    label: "Pick-up",
    color: "bg-purple-100 text-purple-700 border border-purple-200",
    dot: "bg-purple-500",
    badge: "bg-purple-500 text-white",
  },
  dropoff: {
    label: "Drop-off",
    color: "bg-amber-100 text-amber-700 border border-amber-200",
    dot: "bg-amber-500",
    badge: "bg-amber-500 text-white",
  },
  production: {
    label: "Production",
    color: "bg-sky-100 text-sky-700 border border-sky-200",
    dot: "bg-sky-500",
    badge: "bg-sky-500 text-white",
  },
  milestone: {
    label: "Milestone",
    color: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
    badge: "bg-emerald-500 text-white",
  },
  task: {
    label: "Task",
    color: "bg-slate-100 text-slate-700 border border-slate-200",
    dot: "bg-slate-500",
    badge: "bg-slate-600 text-white",
  },
  workflow: {
    label: "Workflow stage",
    color: "bg-rose-100 text-rose-700 border border-rose-200",
    dot: "bg-rose-500",
    badge: "bg-rose-500 text-white",
  },
}

const NOTIFICATION_CHANNELS: Array<{
  key: keyof PlannerEvent["notifications"]
  label: string
  helper: string
}> = [
  { key: "email", label: "Email", helper: "Send daily digest" },
  { key: "sms", label: "SMS", helper: "Instant alert" },
  { key: "portal", label: "Portal", helper: "Client dashboard" },
  { key: "slack", label: "Slack", helper: "Ops channel" },
]

const INITIAL_EVENTS: PlannerEvent[] = [
  {
    id: "evt-001",
    title: "Fabric pick-up – Aurora jackets",
    category: "pickup",
    start: "2025-10-07",
    end: "2025-10-07",
    location: "Port of Oakland",
    owner: "Logistics",
    notes: "Customs cleared 06:00. Arrange reefers for temperature control.",
    unitsPlanned: 320,
    estimatedValue: 128_000,
    workflowId: "cut-sew",
    orderId: "ord-aurora",
    clientId: "horizon",
    notifications: { email: true, sms: true, portal: false, slack: true },
  },
  {
    id: "evt-002",
    title: "Line A production sprint",
    category: "production",
    start: "2025-10-09",
    end: "2025-10-14",
    location: "Factory A – Main Floor",
    owner: "Production Ops",
    notes: "Run 2 shifts/day. QA pulls at 15:00 daily.",
    unitsPlanned: 540,
    estimatedValue: 216_000,
    workflowId: "cut-sew",
    orderId: "ord-aurora",
    clientId: "horizon",
    notifications: { email: true, sms: false, portal: true, slack: true },
  },
  {
    id: "evt-003",
    title: "Client portal review",
    category: "milestone",
    start: "2025-10-16",
    end: "2025-10-16",
    location: "Horizon HQ (virtual)",
    owner: "Account Team",
    notes: "Share updated QR previews + production burndown.",
    unitsPlanned: 0,
    estimatedValue: 0,
    workflowId: "tracing",
    orderId: "ord-aurora",
    clientId: "horizon",
    notifications: { email: true, sms: false, portal: true, slack: false },
  },
  {
    id: "evt-004",
    title: "Bulk drop-off – Finished jackets",
    category: "dropoff",
    start: "2025-10-22",
    end: "2025-10-24",
    location: "3PL Staging Warehouse",
    owner: "Logistics",
    notes: "Staggered delivery windows to avoid dock congestion.",
    unitsPlanned: 320,
    estimatedValue: 128_000,
    workflowId: "cut-sew",
    orderId: "ord-aurora",
    clientId: "horizon",
    notifications: { email: true, sms: true, portal: false, slack: false },
  },
  {
    id: "evt-005",
    title: "QA checklist – Atlas pockets",
    category: "task",
    start: "2025-10-18",
    end: "2025-10-18",
    location: "Quality Lab",
    owner: "Quality",
    notes: "Verify reinforced stitching on pocket seams and log defects.",
    unitsPlanned: 180,
    estimatedValue: 72_000,
    workflowId: "qa",
    orderId: "ord-atlas",
    clientId: "atlas",
    notifications: { email: true, sms: false, portal: true, slack: true },
  },
  {
    id: "evt-006",
    title: "Workflow stage · QA & Pack",
    category: "workflow",
    start: "2025-10-19",
    end: "2025-10-21",
    location: "Quality Mezzanine",
    owner: "Quality",
    notes: "Align QA gate with portal stage trigger before shipment release.",
    unitsPlanned: 240,
    estimatedValue: 96_000,
    workflowId: "qa",
    orderId: "ord-aurora",
    clientId: "horizon",
    notifications: { email: true, sms: false, portal: true, slack: false },
  },
]

const todayKey = toDateKey(new Date())

const MS_PER_DAY = 1000 * 60 * 60 * 24

export default function PlannerPage() {
  const [currentMonth, setCurrentMonth] = useState<Date>(() => new Date(2025, 9, 1))
  const [events, setEvents] = useState<PlannerEvent[]>(INITIAL_EVENTS)
  const [drawerState, setDrawerState] = useState<{ open: boolean; mode: "view" | "create"; eventId?: string }>({
    open: false,
    mode: "view",
    eventId: undefined,
  })
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [filters, setFilters] = useState({ workflow: "all", order: "all", client: "all" })
  const [draftEvent, setDraftEvent] = useState({
    title: "",
    category: "production" as PlannerEventCategory,
    start: todayKey,
    duration: 1,
    location: LOCATION_OPTIONS[0] ?? "",
    owner: TEAM_DIRECTORY[0] ?? "",
    notes: "",
    unitsPlanned: 100,
    estimatedValue: 50_000,
    workflowId: WORKFLOW_OPTIONS[0]?.id ?? "",
    orderId: ORDER_OPTIONS[0]?.id ?? "",
    clientId: CLIENT_OPTIONS[0]?.id ?? "",
  })
  const [dailyCapacity, setDailyCapacity] = useState(400)
  const [weeklyRevenueTarget, setWeeklyRevenueTarget] = useState(200_000)
  const [showSettings, setShowSettings] = useState(false)

  const calendarDays = useMemo(() => buildCalendarGrid(currentMonth), [currentMonth])
  const weeks = useMemo(() => {
    const chunked: CalendarDay[][] = []
    for (let index = 0; index < calendarDays.length; index += 7) {
      chunked.push(calendarDays.slice(index, index + 7))
    }
    return chunked
  }, [calendarDays])
  const monthLabel = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(currentMonth)

  const visibleEvents = useMemo(
    () =>
      events.filter((event) => {
        const workflowMatch = filters.workflow === "all" || event.workflowId === filters.workflow
        const orderMatch = filters.order === "all" || event.orderId === filters.order
        const clientMatch = filters.client === "all" || event.clientId === filters.client
        return workflowMatch && orderMatch && clientMatch
      }),
    [events, filters]
  )

  const groupedEvents = useMemo(() => {
    const map: Record<DateKey, PlannerEvent[]> = {}
    calendarDays.forEach((day) => {
      map[day.key] = visibleEvents.filter((event) => isDateWithinRange(day.key, event.start, event.end))
    })
    return map
  }, [calendarDays, visibleEvents])

  const weeklySummaries = useMemo(
    () => weeks.map((week) => computeWeekSummary(week, visibleEvents, dailyCapacity, weeklyRevenueTarget)),
    [weeks, visibleEvents, dailyCapacity, weeklyRevenueTarget]
  )

  const totals = useMemo(() => computePlannerTotals(visibleEvents), [visibleEvents])

  const selectedEvent = useMemo(() => {
    if (drawerState.mode !== "view" || !drawerState.eventId) return null
    return events.find((event) => event.id === drawerState.eventId) ?? null
  }, [drawerState.mode, drawerState.eventId, events])

  useEffect(() => {
    if (drawerState.mode === "view" && drawerState.eventId) {
      const exists = events.some((event) => event.id === drawerState.eventId)
      if (!exists) {
        setDrawerState({ open: false, mode: "view", eventId: undefined })
      }
    }
  }, [drawerState.mode, drawerState.eventId, events])

  const handleMonthChange = (direction: 1 | -1) => {
    setCurrentMonth((prev) => addMonths(prev, direction))
  }

  const handleDrop = (dateKey: DateKey, eventId: string) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id !== eventId) return event
        const diff = dayDiff(dateKey, event.start)
        if (diff === 0) return event
        const newStart = toDateKey(addDays(parseDateKey(event.start), diff))
        const newEnd = toDateKey(addDays(parseDateKey(event.end), diff))
        return { ...event, start: newStart, end: newEnd }
      })
    )
  }

  const handleDurationChange = (eventId: string, delta: 1 | -1) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id !== eventId) return event
        const currentDuration = Math.max(1, differenceInDays(event.end, event.start) + 1)
        const nextDuration = Math.max(1, currentDuration + delta)
        const newEnd = toDateKey(addDays(parseDateKey(event.start), nextDuration - 1))
        return { ...event, end: newEnd }
      })
    )
  }

  const handleNotificationToggle = (
    eventId: string,
    channel: keyof PlannerEvent["notifications"]
  ) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id !== eventId) return event
        return {
          ...event,
          notifications: {
            ...event.notifications,
            [channel]: !event.notifications[channel],
          },
        }
      })
    )
  }

  const handleEventFieldChange = (
    eventId: string,
    updates: Partial<Omit<PlannerEvent, "id" | "notifications">>
  ) => {
    setEvents((prev) => prev.map((event) => (event.id === eventId ? { ...event, ...updates } : event)))
  }

  const handleEventMetricChange = (
    eventId: string,
    key: "unitsPlanned" | "estimatedValue",
    value: number
  ) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId ? { ...event, [key]: Math.max(0, Number.isFinite(value) ? value : 0) } : event
      )
    )
  }

  const handleEventDateChange = (
    eventId: string,
    key: "start" | "end",
    value: DateKey
  ) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id !== eventId) return event
        if (key === "start") {
          const duration = Math.max(0, differenceInDays(event.end, event.start))
          const newEnd = toDateKey(addDays(parseDateKey(value), duration))
          return { ...event, start: value, end: newEnd }
        }
        if (value < event.start) return event
        return { ...event, end: value }
      })
    )
  }

  const handleDraftChange = (key: keyof typeof draftEvent, value: string | number) => {
    setDraftEvent((prev) => ({ ...prev, [key]: value }))
  }

  const handleCreateEvent = () => {
    if (!draftEvent.title.trim()) return
    const id = `evt-${Date.now()}`
    const start = draftEvent.start
    const end = toDateKey(addDays(parseDateKey(start), Math.max(0, draftEvent.duration - 1)))

    const newEvent: PlannerEvent = {
      id,
      title: draftEvent.title.trim(),
      category: draftEvent.category,
      start,
      end,
      location: draftEvent.location,
      owner: draftEvent.owner,
      notes: draftEvent.notes.trim(),
      unitsPlanned: Math.max(0, Math.round(draftEvent.unitsPlanned)),
      estimatedValue: Math.max(0, Math.round(draftEvent.estimatedValue)),
      workflowId: draftEvent.workflowId,
      orderId: draftEvent.orderId,
      clientId: draftEvent.clientId,
      notifications: { email: true, sms: false, portal: true, slack: false },
    }

    setEvents((prev) => [newEvent, ...prev])
    setDrawerState({ open: true, mode: "view", eventId: id })
  }

  const handleDeleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId))
    setDrawerState({ open: false, mode: "view", eventId: undefined })
  }

  const openEventDrawer = (eventId: string) => {
    setDrawerState({ open: true, mode: "view", eventId })
  }

  const openCreateDrawer = () => {
    const nowKey = toDateKey(new Date())
    setDraftEvent({
      title: "",
      category: filters.workflow === "all" ? ("production" as PlannerEventCategory) : "workflow",
      start: nowKey,
      duration: 1,
      location: LOCATION_OPTIONS[0] ?? "",
      owner: TEAM_DIRECTORY[0] ?? "",
      notes: "",
      unitsPlanned: 100,
      estimatedValue: 50_000,
      workflowId:
        filters.workflow !== "all"
          ? filters.workflow
          : WORKFLOW_OPTIONS[0]?.id ?? "",
      orderId:
        filters.order !== "all"
          ? filters.order
          : ORDER_OPTIONS[0]?.id ?? "",
      clientId:
        filters.client !== "all"
          ? filters.client
          : CLIENT_OPTIONS[0]?.id ?? "",
    })
    setDrawerState({ open: true, mode: "create", eventId: undefined })
  }

  const closeDrawer = () => {
    setDrawerState((prev) => ({ ...prev, open: false }))
  }

  const rowHeight = 38
  const topOffset = 44

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <Sidebar
          sidebarExpanded={sidebarExpanded}
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
        />
        <div className="flex flex-1 flex-col bg-slate-50">
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="flex h-14 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <img src="/groovy-logo.png" alt="Groovy" className="h-8" />
            <div className="h-6 w-px bg-slate-300" />
            <h1 className="text-lg font-semibold text-slate-900">Production Planner</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setCurrentMonth(new Date())}>
              Today
            </Button>
            <Button variant="outline" onClick={() => setShowSettings(true)}>
              <SlidersHorizontal className="mr-2 h-4 w-4" /> Capacity settings
            </Button>
            <Button onClick={openCreateDrawer}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add event
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 bg-white px-8 py-4 text-sm text-slate-600">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
                <Filter className="h-3.5 w-3.5" />
                <span>Filter by</span>
              </div>
              <select
                value={filters.workflow}
                onChange={(event) => setFilters((prev) => ({ ...prev, workflow: event.target.value }))}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                {WORKFLOW_FILTERS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select
                value={filters.order}
                onChange={(event) => setFilters((prev) => ({ ...prev, order: event.target.value }))}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                {ORDER_FILTERS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select
                value={filters.client}
                onChange={(event) => setFilters((prev) => ({ ...prev, client: event.target.value }))}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                {CLIENT_FILTERS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="ml-auto flex items-center gap-6 text-xs text-slate-500">
                <span>
                  Planned units: <span className="font-semibold text-slate-900">{totals.units.toLocaleString()}</span>
                </span>
                <span>
                  Projected revenue: <span className="font-semibold text-slate-900">{formatCurrency(totals.value)}</span>
                </span>
                <span className="hidden md:inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                  <GripVertical className="h-3.5 w-3.5 text-slate-400" /> Drag the handle to reschedule events.
                </span>
              </div>
            </div>
      </header>

          <main className="flex-1 overflow-hidden pt-6">
            <div className="flex h-full flex-col overflow-hidden px-6 py-6">
              <Card className="flex h-full flex-col border-slate-200">
                <CardHeader className="border-b border-slate-200 pb-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl text-slate-900">{monthLabel}</CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Drop events onto new slots, extend their duration, and monitor capacity week over week.
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleMonthChange(-1)}>
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleMonthChange(1)}>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto px-0">
                  <div className="min-w-[1200px] px-4 py-5">
                    <div className="grid grid-cols-[repeat(7,minmax(0,1fr))_200px] text-xs font-medium uppercase tracking-wide text-slate-500">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day} className="px-3 py-2 text-center">
                          {day}
                        </div>
                      ))}
                      <div className="px-3 py-2 text-center">Weekly totals</div>
                    </div>

                    <div className="divide-y divide-slate-200 border border-slate-200">
                      {weeks.map((week, weekIndex) => {
                        const summary = weeklySummaries[weekIndex]
                        const { segments, rows } = buildWeekLayout(week, visibleEvents)
                        const minHeight = topOffset + rows * (rowHeight + 8) + 112

                        return (
                          <div
                            key={week[0]?.key ?? `week-${weekIndex}`}
                            className="relative grid grid-cols-[repeat(7,minmax(0,1fr))_200px]"
                            style={{ minHeight }}
                          >
                            {week.map((day, dayIndex) => {
                              const dayEvents = groupedEvents[day.key] ?? []
                              const isLastColumn = dayIndex === 6
                              return (
                                <div
                                  key={day.key}
                                  className={`relative flex flex-col border-r border-slate-200 bg-white px-3 pb-3 ${
                                    day.isCurrentMonth ? "" : "bg-slate-50/60 text-slate-400"
                                  } ${day.isToday ? "ring-2 ring-blue-400" : ""} ${isLastColumn ? "" : ""}`}
                                  onDragOver={(event) => event.preventDefault()}
                                  onDrop={(event) => {
                                    event.preventDefault()
                                    try {
                                      const payload = JSON.parse(event.dataTransfer.getData("application/json")) as {
                                        eventId: string
                                      }
                                      if (payload?.eventId) handleDrop(day.key, payload.eventId)
                                    } catch (error) {
                                      console.warn("Unable to parse planner drag payload", error)
                                    }
                                  }}
                                >
                                  <div className="flex items-center justify-between pt-3 text-slate-500">
                                    <span className="text-sm font-semibold text-slate-600">{day.date.getDate()}</span>
                                    {day.isToday && <Badge className="bg-blue-500 text-white">Today</Badge>}
                                  </div>
                                  <div className="mt-3 flex-1 rounded-lg border border-dashed border-slate-200 bg-slate-50/60" />
                                  {dayEvents.length === 0 && (
                                    <span className="pointer-events-none pt-2 text-[11px] text-slate-300">Drop to schedule</span>
                                  )}
                                </div>
                              )
                            })}

                            <div className="flex flex-col gap-3 border-l border-slate-200 bg-slate-50 px-4 py-4 text-xs text-slate-600">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] uppercase tracking-wide text-slate-500">Week {weekIndex + 1}</span>
                                <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                                  {summary.events} events
                                </Badge>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-slate-600">
                                  <span>Units scheduled</span>
                                  <span className="font-semibold text-slate-900">{Math.round(summary.units).toLocaleString()}</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                                  <div
                                    className="h-full rounded-full bg-blue-500"
                                    style={{ width: `${Math.min(100, summary.utilization * 100)}%` }}
                                  />
                                </div>
                                <p className="text-[11px] text-slate-400">
                                  Capacity {Math.round(summary.utilization * 100)}% of {summary.capacity.toLocaleString()} units
                                </p>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-slate-600">
                                  <span>Revenue booked</span>
                                  <span className="font-semibold text-slate-900">{formatCurrency(summary.value)}</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-blue-100">
                                  <div
                                    className="h-full rounded-full bg-blue-600"
                                    style={{ width: `${Math.min(100, summary.valueProgress * 100)}%` }}
                                  />
                                </div>
                                <p className="text-[11px] text-slate-400">
                                  Target {formatCurrency(weeklyRevenueTarget)}
                                </p>
                              </div>
                            </div>

                            <div
                              className="pointer-events-none absolute"
                              style={{ top: topOffset, left: 0, right: 220 }}
                            >
                              {segments.map((segment) => {
                                const leftPercent = (segment.startIndex / week.length) * 100
                                const widthPercent = (segment.span / week.length) * 100
                                const meta = CATEGORY_META[segment.event.category]
                                const isSelected =
                                  drawerState.mode === "view" && drawerState.eventId === segment.event.id
                                const canDrag = segment.isStart
                                const clampedWidth = Math.max(0, Math.min(100, widthPercent))
                                const widthStyle = `calc(${clampedWidth}% - 0.6rem)`
                                const leftStyle = `calc(${leftPercent}% + 0.3rem)`
                                return (
                                  <button
                                    key={`${segment.event.id}-${segment.startIndex}`}
                                    type="button"
                                    onClick={() => openEventDrawer(segment.event.id)}
                                    draggable={canDrag}
                                    onDragStart={(dragEvent) => {
                                      if (!canDrag) return
                                      dragEvent.dataTransfer.setData(
                                        "application/json",
                                        JSON.stringify({ eventId: segment.event.id })
                                      )
                                      dragEvent.dataTransfer.effectAllowed = "move"
                                    }}
                                    className={`pointer-events-auto flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-xs shadow-sm transition ${
                                      meta.color
                                    } ${isSelected ? "ring-2 ring-blue-400" : ""}`}
                                    style={{
                                      position: "absolute",
                                      left: leftStyle,
                                      width: widthStyle,
                                      top: segment.row * (rowHeight + 8),
                                    }}
                                  >
                                    <div className="flex items-center gap-2">
                                      {canDrag ? (
                                        <GripVertical className="h-3.5 w-3.5 text-slate-400" />
                                      ) : (
                                        <span className="text-[10px] text-slate-400">↔</span>
                                      )}
                                      {!segment.isStart && <span className="text-[10px] text-slate-500">←</span>}
                                      <span className="font-semibold text-slate-900">{segment.event.title}</span>
                                      {!segment.isEnd && <span className="text-[10px] text-slate-500">→</span>}
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] text-slate-500">
                                      <span>{formatRange(segment.event.start, segment.event.end)}</span>
                                      {segment.event.unitsPlanned > 0 && (
                                        <span>{segment.event.unitsPlanned.toLocaleString()} units</span>
                                      )}
                                    </div>
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                      {Object.entries(CATEGORY_META).map(([category, meta]) => (
                        <span key={category} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1">
                          <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                          {meta.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>

      <PlannerDrawer
        open={drawerState.open}
        mode={drawerState.mode}
        event={selectedEvent}
        draft={draftEvent}
        onClose={closeDrawer}
        onDraftChange={handleDraftChange}
        onCreate={handleCreateEvent}
        onFieldChange={(updates) => {
          if (!selectedEvent) return
          handleEventFieldChange(selectedEvent.id, updates)
        }}
        onDateChange={(key, value) => {
          if (!selectedEvent) return
          handleEventDateChange(selectedEvent.id, key, value)
        }}
        onMetricChange={(key, value) => {
          if (!selectedEvent) return
          handleEventMetricChange(selectedEvent.id, key, value)
        }}
        onNotificationToggle={(channel) => {
          if (!selectedEvent) return
          handleNotificationToggle(selectedEvent.id, channel)
        }}
        onDurationChange={(delta) => {
          if (!selectedEvent) return
          handleDurationChange(selectedEvent.id, delta)
        }}
        onDelete={() => {
          if (!selectedEvent) return
          handleDeleteEvent(selectedEvent.id)
        }}
      />

      <PlannerSettingsModal
        open={showSettings}
        dailyCapacity={dailyCapacity}
        weeklyRevenueTarget={weeklyRevenueTarget}
        setDailyCapacity={setDailyCapacity}
        setWeeklyRevenueTarget={setWeeklyRevenueTarget}
        onClose={() => setShowSettings(false)}
      />
    </div>
  )
}

type PlannerDrawerProps = {
  open: boolean
  mode: "view" | "create"
  event: PlannerEvent | null
  draft: {
    title: string
    category: PlannerEventCategory
    start: DateKey
    duration: number
    location: string
    owner: string
    notes: string
    unitsPlanned: number
    estimatedValue: number
    workflowId: string
    orderId: string
    clientId: string
  }
  onClose: () => void
  onDraftChange: (key: keyof PlannerDrawerProps["draft"], value: string | number) => void
  onCreate: () => void
  onFieldChange: (updates: Partial<Omit<PlannerEvent, "id" | "notifications">>) => void
  onDateChange: (key: "start" | "end", value: DateKey) => void
  onMetricChange: (key: "unitsPlanned" | "estimatedValue", value: number) => void
  onNotificationToggle: (channel: keyof PlannerEvent["notifications"]) => void
  onDurationChange: (delta: 1 | -1) => void
  onDelete: () => void
}

function PlannerDrawer({
  open,
  mode,
  event,
  draft,
  onClose,
  onDraftChange,
  onCreate,
  onFieldChange,
  onDateChange,
  onMetricChange,
  onNotificationToggle,
  onDurationChange,
  onDelete,
}: PlannerDrawerProps) {
  const title = mode === "create" ? "Create planner event" : event?.title ?? "Event"
  const subtitle =
    mode === "create"
      ? "Schedule a production sprint, logistics move, or workflow touchpoint."
      : event
        ? `${formatRange(event.start, event.end)} · ${event.owner}`
        : ""

  return (
    <div
      className={`fixed inset-0 z-50 flex transition-opacity duration-300 ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <aside
        className={`h-full w-full max-w-[420px] transform bg-white shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            <p className="text-xs text-slate-500">{subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            {mode === "view" && event && (
              <Button variant="ghost" size="icon" onClick={onDelete} title="Delete event">
                <Trash2 className="h-4 w-4 text-slate-400" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="h-full overflow-y-auto px-6 py-5 text-sm text-slate-600">
          {mode === "view" && event && (
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-slate-500">Title</span>
                <Input value={event.title} onChange={(eventInput) => onFieldChange({ title: eventInput.target.value })} />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wide text-slate-500">Category</span>
                  <select
                    value={event.category}
                    onChange={(eventInput) => onFieldChange({ category: eventInput.target.value as PlannerEventCategory })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                  >
                    {Object.entries(CATEGORY_META).map(([key, meta]) => (
                      <option key={key} value={key}>
                        {meta.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wide text-slate-500">Owner</span>
                  <select
                    value={event.owner}
                    onChange={(eventInput) => onFieldChange({ owner: eventInput.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                  >
                    {TEAM_DIRECTORY.map((team) => (
                      <option key={team} value={team}>
                        {team}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wide text-slate-500">Workflow</span>
                  <select
                    value={event.workflowId}
                    onChange={(eventInput) => onFieldChange({ workflowId: eventInput.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                  >
                    {WORKFLOW_OPTIONS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wide text-slate-500">Order</span>
                  <select
                    value={event.orderId}
                    onChange={(eventInput) => onFieldChange({ orderId: eventInput.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                  >
                    {ORDER_OPTIONS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-slate-500">Client</span>
                <select
                  value={event.clientId}
                  onChange={(eventInput) => onFieldChange({ clientId: eventInput.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                >
                  {CLIENT_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wide text-slate-500">Start date</span>
                  <Input type="date" value={event.start} onChange={(eventInput) => onDateChange("start", eventInput.target.value)} />
                </div>
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wide text-slate-500">End date</span>
                  <Input type="date" value={event.end} onChange={(eventInput) => onDateChange("end", eventInput.target.value)} />
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Duration:</span>
                <span className="font-medium text-slate-900">
                  {differenceInDays(event.end, event.start) + 1} day
                  {differenceInDays(event.end, event.start) + 1 === 1 ? "" : "s"}
                </span>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon" onClick={() => onDurationChange(-1)}>
                    <ArrowLeft className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => onDurationChange(1)}>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-slate-500">Location</span>
                <select
                  value={event.location}
                  onChange={(eventInput) => onFieldChange({ location: eventInput.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                >
                  {LOCATION_OPTIONS.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wide text-slate-500">Units planned</span>
                  <Input
                    type="number"
                    min={0}
                    value={event.unitsPlanned}
                    onChange={(eventInput) => onMetricChange("unitsPlanned", Number(eventInput.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wide text-slate-500">Estimated value</span>
                  <Input
                    type="number"
                    min={0}
                    value={event.estimatedValue}
                    onChange={(eventInput) => onMetricChange("estimatedValue", Number(eventInput.target.value) || 0)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-slate-500">Notes</span>
                <textarea
                  value={event.notes}
                  onChange={(eventInput) => onFieldChange({ notes: eventInput.target.value })}
                  className="min-h-[140px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                  placeholder="Add prep steps, dependencies, or reminders"
                />
              </div>
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-wide text-slate-500">Notifications</span>
                <div className="grid gap-2 md:grid-cols-2">
                  {NOTIFICATION_CHANNELS.map((channel) => (
                    <label
                      key={channel.key}
                      className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs hover:border-blue-200"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-900">{channel.label}</span>
                        <span className="text-[11px] text-slate-500">{channel.helper}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={event.notifications[channel.key]}
                        onChange={() => onNotificationToggle(channel.key)}
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {mode === "create" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-slate-500">Title</span>
                <Input
                  value={draft.title}
                  onChange={(eventInput) => onDraftChange("title", eventInput.target.value)}
                  placeholder="e.g. Production sprint – Line B"
                />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wide text-slate-500">Category</span>
                  <select
                    value={draft.category}
                    onChange={(eventInput) => onDraftChange("category", eventInput.target.value as PlannerEventCategory)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                  >
                    {Object.entries(CATEGORY_META).map(([key, meta]) => (
                      <option key={key} value={key}>
                        {meta.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wide text-slate-500">Owner</span>
                  <select
                    value={draft.owner}
                    onChange={(eventInput) => onDraftChange("owner", eventInput.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                  >
                    {TEAM_DIRECTORY.map((team) => (
                      <option key={team} value={team}>
                        {team}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wide text-slate-500">Workflow</span>
                  <select
                    value={draft.workflowId}
                    onChange={(eventInput) => onDraftChange("workflowId", eventInput.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                  >
                    {WORKFLOW_OPTIONS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wide text-slate-500">Order</span>
                  <select
                    value={draft.orderId}
                    onChange={(eventInput) => onDraftChange("orderId", eventInput.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                  >
                    {ORDER_OPTIONS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-slate-500">Client</span>
                <select
                  value={draft.clientId}
                  onChange={(eventInput) => onDraftChange("clientId", eventInput.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                >
                  {CLIENT_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wide text-slate-500">Start date</span>
                  <Input type="date" value={draft.start} onChange={(eventInput) => onDraftChange("start", eventInput.target.value)} />
                </div>
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wide text-slate-500">Duration (days)</span>
                  <Input
                    type="number"
                    min={1}
                    value={draft.duration}
                    onChange={(eventInput) => onDraftChange("duration", Math.max(1, Number(eventInput.target.value) || 1))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-slate-500">Location</span>
                <select
                  value={draft.location}
                  onChange={(eventInput) => onDraftChange("location", eventInput.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                >
                  {LOCATION_OPTIONS.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wide text-slate-500">Units planned</span>
                  <Input
                    type="number"
                    min={0}
                    value={draft.unitsPlanned}
                    onChange={(eventInput) => onDraftChange("unitsPlanned", Math.max(0, Number(eventInput.target.value) || 0))}
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wide text-slate-500">Estimated value</span>
                  <Input
                    type="number"
                    min={0}
                    value={draft.estimatedValue}
                    onChange={(eventInput) => onDraftChange("estimatedValue", Math.max(0, Number(eventInput.target.value) || 0))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-slate-500">Notes</span>
                <textarea
                  value={draft.notes}
                  onChange={(eventInput) => onDraftChange("notes", eventInput.target.value)}
                  placeholder="Add prep steps, dependencies, or hand-offs"
                  className="min-h-[140px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                />
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={onCreate}>Create event</Button>
              </div>
            </div>
          )}
        </div>
      </aside>
      <div
        className={`flex-1 bg-slate-900/30 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
    </div>
  )
}

type PlannerSettingsModalProps = {
  open: boolean
  dailyCapacity: number
  weeklyRevenueTarget: number
  setDailyCapacity: (capacity: number) => void
  setWeeklyRevenueTarget: (value: number) => void
  onClose: () => void
}

function PlannerSettingsModal({
  open,
  dailyCapacity,
  weeklyRevenueTarget,
  setDailyCapacity,
  setWeeklyRevenueTarget,
  onClose,
}: PlannerSettingsModalProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-40 flex items-start justify-end bg-slate-900/40 p-6">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">Capacity settings</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4 text-sm text-slate-600">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-slate-500">Daily production capacity</span>
            <Input
              type="number"
              min={0}
              value={dailyCapacity}
              onChange={(event) => setDailyCapacity(Math.max(0, Number(event.target.value) || 0))}
            />
            <p className="text-xs text-slate-500">Used to calculate unit utilization across each calendar week.</p>
          </div>
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-slate-500">Weekly revenue target</span>
            <Input
              type="number"
              min={0}
              value={weeklyRevenueTarget}
              onChange={(event) => setWeeklyRevenueTarget(Math.max(0, Number(event.target.value) || 0))}
            />
            <p className="text-xs text-slate-500">Visualized as progress bars inside the weekly totals column.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs text-slate-500">
            <p>Settings apply to the current planner view. Workflow-specific limits and client overrides will arrive soon.</p>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function buildCalendarGrid(focusDate: Date): CalendarDay[] {
  const startOfMonth = new Date(focusDate.getFullYear(), focusDate.getMonth(), 1)
  const startDay = startOfMonth.getDay()
  const gridStart = addDays(startOfMonth, -startDay)
  const days: CalendarDay[] = []

  for (let index = 0; index < 42; index += 1) {
    const date = addDays(gridStart, index)
    const key = toDateKey(date)
    days.push({
      date,
      key,
      isCurrentMonth: date.getMonth() === focusDate.getMonth(),
      isToday: key === todayKey,
    })
  }

  return days
}

function buildWeekLayout(week: CalendarDay[], events: PlannerEvent[]): { segments: WeekSegment[]; rows: number } {
  const segments: WeekSegment[] = []
  if (week.length === 0) return { segments, rows: 0 }
  const weekStart = week[0].key
  const weekEnd = week[week.length - 1].key
  const occupancy: boolean[][] = []

  events.forEach((event) => {
    if (event.end < weekStart || event.start > weekEnd) return
    const rawStart = dayDiff(event.start, weekStart)
    const rawEnd = dayDiff(event.end, weekStart)
    const startIndex = Math.max(0, rawStart)
    const endIndex = Math.min(week.length - 1, rawEnd)
    if (endIndex < 0 || startIndex > week.length - 1) return
    const span = endIndex - startIndex + 1
    if (span <= 0) return

    let row = 0
    while (true) {
      if (!occupancy[row]) occupancy[row] = Array(week.length).fill(false)
      const conflict = occupancy[row].slice(startIndex, startIndex + span).some(Boolean)
      if (!conflict) {
        for (let index = startIndex; index < startIndex + span; index += 1) {
          occupancy[row][index] = true
        }
        break
      }
      row += 1
    }

    segments.push({
      event,
      startIndex,
      span,
      row,
      isStart: event.start >= weekStart,
      isEnd: event.end <= weekEnd,
    })
  })

  return { segments, rows: occupancy.length }
}

function addDays(date: Date, amount: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return next
}

function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1)
}

function toDateKey(date: Date): DateKey {
  return date.toISOString().slice(0, 10)
}

function parseDateKey(key: DateKey): Date {
  const [year, month, day] = key.split("-").map(Number)
  return new Date(year, month - 1, day)
}

function dayDiff(a: DateKey, b: DateKey): number {
  const diff = parseDateKey(a).getTime() - parseDateKey(b).getTime()
  return Math.round(diff / MS_PER_DAY)
}

function differenceInDays(end: DateKey, start: DateKey): number {
  const diff = parseDateKey(end).getTime() - parseDateKey(start).getTime()
  return Math.round(diff / MS_PER_DAY)
}

function overlapInDays(rangeStart: DateKey, rangeEnd: DateKey, windowStart: DateKey, windowEnd: DateKey): number {
  const start = Math.max(parseDateKey(rangeStart).getTime(), parseDateKey(windowStart).getTime())
  const end = Math.min(parseDateKey(rangeEnd).getTime(), parseDateKey(windowEnd).getTime())
  if (end < start) return 0
  return Math.round((end - start) / MS_PER_DAY) + 1
}

function isDateWithinRange(day: DateKey, start: DateKey, end: DateKey): boolean {
  return day >= start && day <= end
}

function formatRange(start: DateKey, end: DateKey): string {
  if (start === end) return formatDateLabel(parseDateKey(start))
  return `${formatDateLabel(parseDateKey(start))} – ${formatDateLabel(parseDateKey(end))}`
}

function formatDateLabel(date: Date): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date)
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    value
  )
}

function computeWeekSummary(
  week: CalendarDay[],
  events: PlannerEvent[],
  dailyCapacity: number,
  weeklyRevenueTarget: number
): WeekSummary {
  if (week.length === 0) {
    return { units: 0, value: 0, events: 0, capacity: dailyCapacity * 7, utilization: 0, valueProgress: 0 }
  }

  const windowStart = week[0].key
  const windowEnd = week[week.length - 1].key

  let units = 0
  let value = 0
  let eventCount = 0

  events.forEach((event) => {
    const overlap = overlapInDays(event.start, event.end, windowStart, windowEnd)
    if (overlap <= 0) return
    eventCount += 1
    const duration = Math.max(1, differenceInDays(event.end, event.start) + 1)
    units += (event.unitsPlanned / duration) * overlap
    value += (event.estimatedValue / duration) * overlap
  })

  const capacity = dailyCapacity * week.length
  const utilization = capacity > 0 ? units / capacity : 0
  const valueProgress = weeklyRevenueTarget > 0 ? value / weeklyRevenueTarget : 0

  return {
    units,
    value,
    events: eventCount,
    capacity,
    utilization,
    valueProgress,
  }
}

function computePlannerTotals(events: PlannerEvent[]) {
  return events.reduce(
    (acc, event) => {
      acc.units += event.unitsPlanned
      acc.value += event.estimatedValue
      return acc
    },
    { units: 0, value: 0 }
  )
}
