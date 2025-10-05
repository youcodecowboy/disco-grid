"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { LayoutScaffold } from "@/components/grid-v2/LayoutScaffold"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CalendarClock, Clock, Link as LinkIcon, Plus, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const TEAM_OPTIONS = [
  { id: "team-logistics", label: "Logistics" },
  { id: "team-production-ops", label: "Production Ops" },
  { id: "team-receiving", label: "Receiving" },
  { id: "team-quality", label: "Quality" },
  { id: "team-account", label: "Account Team" },
]

const PEOPLE_OPTIONS = [
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

const TASK_TYPES = [
  { id: "inspection", label: "Inspection" },
  { id: "handoff", label: "Handoff" },
  { id: "prep", label: "Preparation" },
  { id: "qa", label: "Quality" },
  { id: "followup", label: "Follow-up" },
]

const PRIORITY_OPTIONS = [
  { id: "critical", label: "Critical" },
  { id: "high", label: "High" },
  { id: "medium", label: "Medium" },
  { id: "low", label: "Low" },
]

const NOTIFICATION_CHANNELS = [
  { id: "in_app", label: "In-app" },
  { id: "email", label: "Email" },
  { id: "sms", label: "SMS" },
  { id: "slack", label: "Slack" },
]

const CHECKLIST_TEMPLATES = [
  {
    id: "standard-readiness",
    label: "Standard readiness",
    description: "Baseline tasks to confirm context, inputs, and tooling are set",
  },
  {
    id: "quality-validation",
    label: "Quality validation",
    description: "Capture evidence, approvals, and variance notes",
  },
  {
    id: "handoff",
    label: "Workflow hand-off",
    description: "Verify prerequisites before moving to the next owner",
  },
]

export default function NewTaskPage() {
  const router = useRouter()
  const [taskName, setTaskName] = useState("")
  const [taskSummary, setTaskSummary] = useState("")
  const [taskType, setTaskType] = useState("")
  const [taskPriority, setTaskPriority] = useState("")
  const [owningTeam, setOwningTeam] = useState("")
  const [primaryAssignee, setPrimaryAssignee] = useState("")
  const [channels, setChannels] = useState<string[]>(["in_app"])
  const [selectedChecklists, setSelectedChecklists] = useState<string[]>([])
  const [deadline, setDeadline] = useState("")
  const [startWindow, setStartWindow] = useState("")
  const [workDuration, setWorkDuration] = useState(60)

  const toggleChannel = (channel: string) => {
    setChannels((prev) =>
      prev.includes(channel) ? prev.filter((item) => item !== channel) : [...prev, channel],
    )
  }

  const toggleChecklist = (templateId: string) => {
    setSelectedChecklists((prev) =>
      prev.includes(templateId)
        ? prev.filter((item) => item !== templateId)
        : [...prev, templateId],
    )
  }

  const timelineSummary = useMemo(() => {
    if (!deadline || !startWindow) {
      return "Define start and due times to preview the timeline."
    }
    const due = new Date(deadline)
    const start = new Date(startWindow)
    if (Number.isNaN(due.getTime()) || Number.isNaN(start.getTime())) {
      return "Define start and due times to preview the timeline."
    }
    const durationHours = Math.max(0, workDuration) / 60
    return `${start.toLocaleString()} → ${due.toLocaleString()} · ${durationHours.toFixed(1)} hr window`
  }, [deadline, startWindow, workDuration])

  const handleCreate = () => {
    router.push("/tasks")
  }

  return (
    <LayoutScaffold
      pageTitle="New Task"
      pageSubtext="Define ownership, schedule, and automation"
      headerActions={
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="text-slate-600" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button className="rounded-full bg-slate-900 px-5 text-white hover:bg-slate-800" onClick={handleCreate}>
            Save task
          </Button>
        </div>
      }
    >
      <div className="space-y-8 py-6">
        <div className="flex flex-col gap-4 rounded-3xl bg-slate-50/70 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">Task blueprint</p>
            <h1 className="text-3xl font-semibold text-slate-900">{taskName.trim() || "Untitled task"}</h1>
            <p className="text-sm text-slate-600 max-w-2xl">
              {taskSummary.trim() || "Add context so assignees know the objective, dependencies, and desired outcome."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-semibold text-slate-700">
              {TEAM_OPTIONS.find((team) => team.id === owningTeam)?.label ?? "Team not set"}
            </Badge>
            <Badge className="rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-semibold text-slate-700">
              {TASK_TYPES.find((option) => option.id === taskType)?.label ?? "Type not set"}
            </Badge>
            <Badge className="rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-semibold text-slate-700">
              Priority: {PRIORITY_OPTIONS.find((option) => option.id === taskPriority)?.label ?? "Not set"}
            </Badge>
          </div>
        </div>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,2.4fr)_minmax(0,1.6fr)]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Task details</h2>
              <p className="mt-2 text-sm text-slate-600">
                Capture the essentials that define how the work shows up in calendars and streams.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Task title</span>
                  <Input value={taskName} onChange={(event) => setTaskName(event.target.value)} placeholder="Task name" />
                </label>
                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Task type</span>
                  <Select value={taskType || undefined} onValueChange={setTaskType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {TASK_TYPES.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Summary</span>
                  <textarea
                    className="min-h-[96px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none"
                    value={taskSummary}
                    onChange={(event) => setTaskSummary(event.target.value)}
                    placeholder="Describe the objective, context, and expected outcome"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Priority</span>
                  <Select value={taskPriority || undefined} onValueChange={setTaskPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITY_OPTIONS.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </label>
                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Effort (minutes)</span>
                  <Input
                    type="number"
                    min={15}
                    step={15}
                    value={workDuration}
                    onChange={(event) => setWorkDuration(Number(event.target.value))}
                  />
                </label>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Ownership & links</h2>
              <p className="mt-2 text-sm text-slate-600">Assign accountability and bind the task to the records it depends on.</p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Owning team</span>
                  <Select value={owningTeam || undefined} onValueChange={setOwningTeam}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team" />
                    </SelectTrigger>
                    <SelectContent>
                      {TEAM_OPTIONS.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </label>
                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Primary owner</span>
                  <Select value={primaryAssignee || undefined} onValueChange={setPrimaryAssignee}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select person" />
                    </SelectTrigger>
                    <SelectContent>
                      {PEOPLE_OPTIONS.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </label>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Watchers & collaborators</p>
                  <Button variant="ghost" size="sm" className="text-xs text-slate-500">
                    <Plus className="mr-2 h-3.5 w-3.5" />Add person
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <p className="text-xs text-slate-500">No collaborators yet. Add people to keep them in the loop.</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Linked records</p>
                <div className="grid gap-3 md:grid-cols-2">
                  <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm text-slate-600 shadow-sm hover:border-slate-300">
                    <LinkIcon className="h-4 w-4 text-slate-500" />
                    Link to planner event
                  </button>
                  <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm text-slate-600 shadow-sm hover:border-slate-300">
                    <LinkIcon className="h-4 w-4 text-slate-500" />
                    Attach to order / item
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Requirements & documentation</h2>
              <p className="mt-2 text-sm text-slate-600">Decide what proof is needed before this task can be marked complete.</p>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Checklist templates</p>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {CHECKLIST_TEMPLATES.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => toggleChecklist(template.id)}
                        className={cn(
                          "rounded-2xl border px-4 py-3 text-left text-sm transition shadow-sm",
                          selectedChecklists.includes(template.id)
                            ? "border-slate-700 bg-slate-900 text-white"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300",
                        )}
                      >
                        <p className="font-semibold leading-tight">{template.label}</p>
                        <p className="mt-1 text-xs text-current/80">{template.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Evidence notes</span>
                  <textarea
                    className="min-h-[96px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none"
                    placeholder="Detail what photos, forms, or sensor proofs are required for sign-off"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Schedule & timeline</h2>
                <Badge className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
                  <CalendarClock className="mr-1 h-3.5 w-3.5" />Timeline
                </Badge>
              </div>

              <div className="mt-5 space-y-4">
                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ready by</span>
                  <Input type="datetime-local" value={deadline} onChange={(event) => setDeadline(event.target.value)} />
                </label>
                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Work window opens</span>
                  <Input type="datetime-local" value={startWindow} onChange={(event) => setStartWindow(event.target.value)} />
                </label>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Guardrail minutes</span>
                    <Input
                      type="number"
                      min={15}
                      step={15}
                      value={workDuration}
                      onChange={(event) => setWorkDuration(Number(event.target.value))}
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Timezone</span>
                    <Select defaultValue="UTC-7">
                      <SelectTrigger>
                        <SelectValue placeholder="Timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC-7">Pacific (UTC-7)</SelectItem>
                        <SelectItem value="UTC-5">Central (UTC-5)</SelectItem>
                        <SelectItem value="UTC-4">Eastern (UTC-4)</SelectItem>
                      </SelectContent>
                    </Select>
                  </label>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-700 shadow-sm">
                  <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <Clock className="h-3.5 w-3.5" /> Timeline preview
                  </span>
                  <p className="mt-2 text-sm text-slate-600">{timelineSummary}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    Calibrated against team availability and planner events. Adjust hours above to update.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Notifications & nudges</h2>
                <Badge className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
                  Escalations
                </Badge>
              </div>
              <p className="mt-2 text-sm text-slate-600">Choose who hears about status changes and when we escalate overdue work.</p>

              <div className="mt-5 space-y-4">
                <div className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Channels</span>
                  <div className="flex flex-wrap gap-2">
                    {NOTIFICATION_CHANNELS.map((channel) => (
                      <button
                        key={channel.id}
                        onClick={() => toggleChannel(channel.id)}
                        className={cn(
                          "rounded-full border px-4 py-2 text-xs font-semibold transition",
                          channels.includes(channel.id)
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300",
                        )}
                      >
                        {channel.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Reminder cadence</span>
                    <Select defaultValue="2h">
                      <SelectTrigger>
                        <SelectValue placeholder="Select cadence" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1h">1 hour before due</SelectItem>
                        <SelectItem value="2h">2 hours before due</SelectItem>
                        <SelectItem value="24h">24 hours before due</SelectItem>
                      </SelectContent>
                    </Select>
                  </label>
                  <label className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Escalate if overdue</span>
                    <Select defaultValue="team-lead">
                      <SelectTrigger>
                        <SelectValue placeholder="Escalation path" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="team-lead">Notify team lead</SelectItem>
                        <SelectItem value="ops-manager">Notify ops manager</SelectItem>
                        <SelectItem value="program">Notify program owner</SelectItem>
                      </SelectContent>
                    </Select>
                  </label>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-xs text-amber-700">
                  <Sparkles className="mr-2 inline h-3 w-3" /> Suggested automation: auto-generate a follow-up checklist when this task completes.
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Dependencies & automation</h2>
              <p className="mt-2 text-sm text-slate-600">Sequence this task alongside upstream/downstream work.</p>

              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Predecessors</span>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 shadow-sm">
                    No predecessors linked yet. Add one from the order or planner views.
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Automation rules</span>
                  <div className="grid gap-3">
                    <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                      <span className="text-slate-600">Auto-create completion digest</span>
                      <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300" />
                    </label>
                    <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                      <span className="text-slate-600">Require evidence upload before closure</span>
                      <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </LayoutScaffold>
  )
}
