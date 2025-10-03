"use client"

import Link from "next/link"
import { useMemo, useState } from "react"

import { ArrowUpRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { CalendarEvent } from "../types"

type MilestonesStageProps = {
  initialMilestones?: Array<{ day: string; label: string; color: string; milestone: boolean }>
  additionalEvents?: Array<{ day: string; label: string; color: string }>
}

const defaultMilestones = [
  { day: "Oct 8", label: "Aurora – Fabric Cutting", color: "bg-blue-100 text-blue-700", milestone: true },
  { day: "Oct 14", label: "Atlas – Assembly Go-Live", color: "bg-emerald-100 text-emerald-700", milestone: true },
  { day: "Oct 21", label: "Atlas – QA Sprint", color: "bg-amber-100 text-amber-700", milestone: true },
  { day: "Oct 28", label: "Atlas – Ship Prep", color: "bg-emerald-100 text-emerald-700", milestone: true },
]

const defaultAdditionalEvents = [
  { day: "Oct 9", label: "Aurora – Cutting", color: "bg-blue-100 text-blue-700" },
  { day: "Oct 16", label: "Defense Drone Prep", color: "bg-purple-100 text-purple-700" },
  { day: "Oct 18", label: "Retail POP Cut", color: "bg-slate-200 text-slate-700" },
  { day: "Oct 24", label: "Aurora – Ship Prep", color: "bg-emerald-100 text-emerald-700" },
  { day: "Oct 30", label: "Retail POP Assembly", color: "bg-blue-100 text-blue-700" },
]

export function MilestonesStage({ initialMilestones = defaultMilestones, additionalEvents = defaultAdditionalEvents }: MilestonesStageProps) {
  const initialCalendarEvents = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {}
    const pushEvent = (day: string, event: CalendarEvent) => {
      map[day] = map[day] ? [...map[day], event] : [event]
    }
    initialMilestones.forEach((milestone) => pushEvent(milestone.day, milestone))
    additionalEvents.forEach((event) => pushEvent(event.day, event))
    return map
  }, [initialMilestones, additionalEvents])

  const [calendarEvents, setCalendarEvents] = useState(initialCalendarEvents)

  const milestoneHighlights = useMemo(() => {
    const highlights: Array<{ day: string; label: string; color: string }> = []
    Object.entries(calendarEvents).forEach(([day, entries]) => {
      entries.forEach((entry) => {
        if (entry.milestone) {
          highlights.push({ day, label: entry.label, color: entry.color })
        }
      })
    })
    return highlights
  }, [calendarEvents])

  const handleMoveEvent = ({ fromDay, toDay, index }: { fromDay: string; toDay: string; index: number }) => {
    if (fromDay === toDay) return
    setCalendarEvents((prev) => {
      const source = prev[fromDay]
      if (!source) return prev
      const moving = source[index]
      if (!moving) return prev
      const next: Record<string, CalendarEvent[]> = {}
      Object.entries(prev).forEach(([day, entries]) => {
        const filtered = day === fromDay ? entries.filter((_, i) => i !== index) : [...entries]
        if (filtered.length) next[day] = filtered
      })
      next[toDay] = [...(next[toDay] ?? []), moving]
      return next
    })
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,0.6fr)]">
      <section className="space-y-6">
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-lg text-slate-900">
              <span>Production Calendar</span>
              <div className="text-xs text-slate-500">Drag milestones to reschedule across the month.</div>
            </CardTitle>
            <CardDescription className="text-slate-500">
              Milestones appear inline with factory capacity so conflicts surface instantly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {milestoneHighlights.map((milestone) => (
                <span
                  key={milestone.label}
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${milestone.color}`}
                >
                  <span className="h-2 w-2 rounded-full bg-current/60" />
                  {milestone.label} · {milestone.day}
                </span>
              ))}
            </div>
            <CapacityCalendar events={calendarEvents} onMoveEvent={handleMoveEvent} />
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-slate-900">Stakeholders</CardTitle>
              <CardDescription className="text-slate-500">
                Brand portals mirror this roster so access stays scoped.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <StakeholderRow name="Client: Horizon Apparel Co." role="Portal access · Approvals" />
              <StakeholderRow name="Internal: Manufacturing" role="Workflow execution" />
              <StakeholderRow name="Internal: Quality" role="Stage checkpoints" />
              <StakeholderRow name="Logistics" role="Shipment + labeling" />
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-slate-900">Automatic reporting</CardTitle>
              <CardDescription className="text-slate-500">
                Decide how often the client receives production intelligence.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <ReportingRow label="Status digest" cadence="Tue & Fri 09:00" channels="Email + Portal" />
              <ReportingRow label="Exception alerts" cadence="Immediate" channels="SMS to client ops" />
              <ReportingRow label="QA summary" cadence="End of milestone" channels="Portal" />
            </CardContent>
          </Card>
        </div>
      </section>

      <aside className="space-y-4">
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-slate-900">Change control</CardTitle>
            <CardDescription className="text-slate-500">Lock dates once stakeholders sign off.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>• Require QA sign-off before moving to finishing.</p>
            <p>• Notify client if milestones slip more than 48 hours.</p>
            <p>• Production holds auto-create incident tickets.</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-slate-900">Reporting hooks</CardTitle>
            <CardDescription className="text-slate-500">
              Stream milestones straight to analytics dashboards.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-slate-600">
              This order syncs to the Horizon brand portal and broadcasts signals to Mission Control in real time.
            </p>
            <Link href="/reports" className="inline-flex items-center text-sm font-medium text-blue-600">
              View reporting matrix
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </aside>
    </div>
  )
}

type ReportingRowProps = {
  label: string
  cadence: string
  channels: string
}

function ReportingRow({ label, cadence, channels }: ReportingRowProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-600">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">{label}</p>
          <p className="mt-1 text-slate-500">{cadence}</p>
        </div>
        <Badge className="bg-slate-500 text-white">{channels}</Badge>
      </div>
    </div>
  )
}

type StakeholderRowProps = {
  name: string
  role: string
}

function StakeholderRow({ name, role }: StakeholderRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div className="text-sm font-medium text-slate-900">{name}</div>
      <div className="text-xs text-slate-500">{role}</div>
    </div>
  )
}

type CapacityCalendarProps = {
  events: Record<string, CalendarEvent[]>
  weeks?: string[][]
  onMoveEvent?: (payload: { fromDay: string; toDay: string; index: number }) => void
}

const defaultWeeks = [
  ["Oct 6", "Oct 7", "Oct 8", "Oct 9", "Oct 10", "Oct 11", "Oct 12"],
  ["Oct 13", "Oct 14", "Oct 15", "Oct 16", "Oct 17", "Oct 18", "Oct 19"],
  ["Oct 20", "Oct 21", "Oct 22", "Oct 23", "Oct 24", "Oct 25", "Oct 26"],
  ["Oct 27", "Oct 28", "Oct 29", "Oct 30", "Oct 31", "Nov 1", "Nov 2"],
]

function CapacityCalendar({ events, weeks = defaultWeeks, onMoveEvent }: CapacityCalendarProps) {
  return (
    <div className="space-y-3 text-xs text-slate-600">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="px-3 py-2 text-center">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {weeks.flat().map((day) => (
            <div
              key={day}
              className="border-t border-r border-slate-200 px-3 py-3 text-slate-700 last:border-r-0"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault()
                const payload = event.dataTransfer.getData("application/json")
                if (!payload) return
                try {
                  const data = JSON.parse(payload) as { fromDay: string; index: number }
                  if (onMoveEvent) onMoveEvent({ fromDay: data.fromDay, index: data.index, toDay: day })
                } catch (error) {
                  console.warn("Unable to parse calendar drop payload", error)
                }
              }}
            >
              <div className="text-[11px] font-medium text-slate-500">{day}</div>
              <div className="mt-2 space-y-1">
                {events[day]?.map((event, index) => (
                  <div
                    key={`${day}-${event.label}-${index}`}
                    className={`truncate rounded-md px-2 py-1 text-[11px] font-medium ${event.color} ${
                      event.milestone ? "ring-2 ring-blue-400" : ""
                    }`}
                    draggable
                    onDragStart={(eventDrag) => {
                      eventDrag.dataTransfer.setData(
                        "application/json",
                        JSON.stringify({ fromDay: day, index })
                      )
                      eventDrag.dataTransfer.effectAllowed = "move"
                    }}
                  >
                    {event.label}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3">
        <p className="text-[11px] text-slate-500">
          Drag events to rebalance capacity. Conflicts highlight when multiple production lines exceed planned load.
        </p>
      </div>
    </div>
  )
}

