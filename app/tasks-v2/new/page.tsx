"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LayoutScaffold } from "@/components/grid-v2/LayoutScaffold"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Plus,
    X,
    Calendar as CalendarIcon,
    Flag,
    CheckSquare,
    Tag as TagIcon,
    Paperclip
} from "lucide-react"
import { cn } from "@/lib/utils"
import { MOCK_TEAMS, MOCK_USERS } from "@/lib/tasks-v2/mockData"
import type { TaskPriority } from "@/lib/tasks-v2/types"

const PRIORITY_OPTIONS: Array<{ value: TaskPriority; label: string; color: string }> = [
  { value: "critical", label: "Critical", color: "text-rose-600" },
  { value: "high", label: "High", color: "text-orange-600" },
  { value: "medium", label: "Medium", color: "text-amber-600" },
  { value: "low", label: "Low", color: "text-slate-600" },
]

export default function NewTaskPage() {
  const router = useRouter()

  // Core fields
  const [assignees, setAssignees] = useState<string[]>([])
  const [goal, setGoal] = useState("")

  // Optional sections (collapsed by default)
  const [showDescription, setShowDescription] = useState(false)
  const [description, setDescription] = useState("")

  const [showDueDate, setShowDueDate] = useState(false)
  const [dueDate, setDueDate] = useState("")

  const [showPriority, setShowPriority] = useState(false)
  const [priority, setPriority] = useState<TaskPriority>("medium")

  const [showChecklist, setShowChecklist] = useState(false)
  const [checklist, setChecklist] = useState<Array<{ id: string; label: string }>>([])
  const [newChecklistItem, setNewChecklistItem] = useState("")

  const [showTags, setShowTags] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

  const [showFiles, setShowFiles] = useState(false)

  // Person selector state
  const [showPersonSelector, setShowPersonSelector] = useState(false)

  // Auto-determine team from first assignee
  const primaryAssignee = assignees.length > 0 ? MOCK_USERS.find((u) => u.id === assignees[0]) : null
  const autoTeam = primaryAssignee ? MOCK_TEAMS.find((t) => t.id === primaryAssignee.teamId) : null

  const handleAddAssignee = (userId: string) => {
    if (!assignees.includes(userId)) {
      setAssignees([...assignees, userId])
    }
    setShowPersonSelector(false)
  }

  const handleRemoveAssignee = (userId: string) => {
    setAssignees(assignees.filter((id) => id !== userId))
  }

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setChecklist([
        ...checklist,
        {
          id: `check-${Date.now()}`,
          label: newChecklistItem.trim(),
        },
      ])
      setNewChecklistItem("")
    }
  }

  const handleRemoveChecklistItem = (id: string) => {
    setChecklist(checklist.filter((item) => item.id !== id))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleCreateTask = () => {
    if (!goal.trim() || assignees.length === 0) return

    console.log("Creating task:", {
      assignees,
      teamId: autoTeam?.id,
      goal,
      description,
      priority,
      dueDate,
      checklist,
      tags,
    })
    router.push(autoTeam ? `/tasks-v2/team/${autoTeam.id}` : "/tasks-v2")
  }

  const canCreate = goal.trim() && assignees.length > 0

  return (
    <LayoutScaffold
      pageTitle="New Task"
      pageSubtext="Create a task for your team"
      headerActions={
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleCreateTask}
            disabled={!canCreate}
            className="bg-slate-900 text-white hover:bg-slate-800"
          >
            Create task
          </Button>
        </div>
      }
    >
      <div className="max-w-3xl mx-auto py-8 space-y-1">
        {/* Assigned to */}
        <div className="group">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-slate-500">Assigned to</span>
            {assignees.map((userId) => {
              const user = MOCK_USERS.find((u) => u.id === userId)
              if (!user) return null
              return (
                <Badge
                  key={userId}
                  className="rounded-full bg-slate-100 text-slate-700 pl-1 pr-2 py-1 text-sm font-medium hover:bg-slate-200 cursor-pointer"
                  onClick={() => handleRemoveAssignee(userId)}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-5 w-5 rounded-full mr-1.5"
                  />
                  {user.name}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              )
            })}
            <div className="relative">
              <button
                onClick={() => setShowPersonSelector(!showPersonSelector)}
                className="text-sm text-slate-400 hover:text-slate-600 flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                Add person
              </button>
              {showPersonSelector && (
                <div className="absolute top-full left-0 mt-1 w-64 rounded-lg border border-slate-200 bg-white shadow-lg p-2 z-10">
                  <div className="space-y-1">
                    {MOCK_USERS.filter((u) => !assignees.includes(u.id)).map((user) => {
                      const userTeam = MOCK_TEAMS.find((t) => t.id === user.teamId)
                      return (
                        <button
                          key={user.id}
                          onClick={() => handleAddAssignee(user.id)}
                          className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-50 text-left"
                        >
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-6 w-6 rounded-full"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.role}</p>
                          </div>
                          {userTeam && (
                            <div
                              className="h-2 w-2 rounded-full shrink-0"
                              style={{ backgroundColor: userTeam.color }}
                            />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
            {autoTeam && (
              <Badge className="rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-medium">
                <div
                  className="h-1.5 w-1.5 rounded-full mr-1.5"
                  style={{ backgroundColor: autoTeam.color }}
                />
                {autoTeam.name}
              </Badge>
            )}
          </div>
        </div>

        {/* Goal (main task title) */}
        <div>
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="What's the goal?"
            className="w-full text-3xl font-semibold text-slate-900 placeholder-slate-300 bg-transparent border-none outline-none py-2"
            autoFocus
          />
        </div>

        {/* Optional sections */}
        <div className="space-y-2 pt-4">
          {/* Description */}
          {!showDescription ? (
            <button
              onClick={() => setShowDescription(true)}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 py-1"
            >
              <Plus className="h-4 w-4" />
              Add description
            </button>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Description</span>
                <button
                  onClick={() => {
                    setShowDescription(false)
                    setDescription("")
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add context, requirements, or instructions..."
                className="w-full text-sm text-slate-700 placeholder-slate-400 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-slate-400 focus:bg-white min-h-[100px] resize-none"
              />
            </div>
          )}

          {/* Due date */}
          {!showDueDate ? (
            <button
              onClick={() => setShowDueDate(true)}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 py-1"
            >
              <Plus className="h-4 w-4" />
              Add due date
            </button>
          ) : (
            <div className="flex items-center gap-3 py-1">
              <CalendarIcon className="h-4 w-4 text-slate-500" />
              <Input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="flex-1 text-sm h-9"
              />
              <button
                onClick={() => {
                  setShowDueDate(false)
                  setDueDate("")
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Priority */}
          {!showPriority ? (
            <button
              onClick={() => setShowPriority(true)}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 py-1"
            >
              <Plus className="h-4 w-4" />
              Add priority
            </button>
          ) : (
            <div className="flex items-center gap-3 py-1">
              <Flag className="h-4 w-4 text-slate-500" />
              <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                <SelectTrigger className="flex-1 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className={cn("font-medium", option.color)}>{option.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <button
                onClick={() => {
                  setShowPriority(false)
                  setPriority("medium")
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Checklist */}
          {!showChecklist ? (
            <button
              onClick={() => setShowChecklist(true)}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 py-1"
            >
              <Plus className="h-4 w-4" />
              Add checklist
            </button>
          ) : (
            <div className="space-y-2 py-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">Checklist</span>
                </div>
                <button
                  onClick={() => {
                    setShowChecklist(false)
                    setChecklist([])
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-1.5 pl-6">
                {checklist.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 group">
                    <div className="h-4 w-4 rounded border-2 border-slate-300" />
                    <span className="flex-1 text-sm text-slate-700">{item.label}</span>
                    <button
                      onClick={() => handleRemoveChecklistItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={newChecklistItem}
                    onChange={(e) => setNewChecklistItem(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddChecklistItem()}
                    placeholder="Add item..."
                    className="flex-1 text-sm text-slate-700 placeholder-slate-400 bg-transparent border-none outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tags */}
          {!showTags ? (
            <button
              onClick={() => setShowTags(true)}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 py-1"
            >
              <Plus className="h-4 w-4" />
              Add tags
            </button>
          ) : (
            <div className="space-y-2 py-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TagIcon className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">Tags</span>
                </div>
                <button
                  onClick={() => {
                    setShowTags(false)
                    setTags([])
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 flex-wrap pl-6">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    className="rounded bg-slate-100 text-slate-700 text-xs px-2 py-0.5 cursor-pointer hover:bg-slate-200"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag}
                    <X className="ml-1 h-2.5 w-2.5" />
                  </Badge>
                ))}
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                  placeholder="Add tag..."
                  className="text-sm text-slate-700 placeholder-slate-400 bg-transparent border-none outline-none w-24"
                />
              </div>
            </div>
          )}

          {/* Files */}
          {!showFiles ? (
            <button
              onClick={() => setShowFiles(true)}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 py-1"
            >
              <Plus className="h-4 w-4" />
              Add files
            </button>
          ) : (
            <div className="space-y-2 py-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">Files</span>
                </div>
                <button
                  onClick={() => setShowFiles(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="pl-6">
                <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 px-3 py-2 rounded-lg border-2 border-dashed border-slate-200 hover:border-slate-300 w-full">
                  <Plus className="h-4 w-4" />
                  Upload or attach files
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </LayoutScaffold>
  )
}
