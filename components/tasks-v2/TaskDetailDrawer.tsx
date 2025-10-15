"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    X,
    Calendar,
    User,
    Tag,
    Link as LinkIcon, CheckCircle2,
    AlertCircle,
    MoreHorizontal,
    Paperclip,
    Send
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Task, TaskStatus, TaskPriority } from "@/lib/tasks-v2/types"
import { format, parseISO } from "date-fns"

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

interface TaskDetailDrawerProps {
  task: Task
  open: boolean
  onClose: () => void
  onUpdate?: (task: Task) => void
}

export function TaskDetailDrawer({ task, open, onClose, onUpdate }: TaskDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<"details" | "activity" | "comments">("details")
  const [commentText, setCommentText] = useState("")
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title)

  const statusMeta = STATUS_META[task.status]
  const priorityMeta = PRIORITY_META[task.priority]

  const completedChecklist = task.checklist.filter((item) => item.done).length
  const totalChecklist = task.checklist.length
  const checklistProgress = totalChecklist > 0 ? (completedChecklist / totalChecklist) * 100 : 0

  const handleSaveTitle = () => {
    if (editedTitle.trim() && onUpdate) {
      onUpdate({ ...task, title: editedTitle.trim() })
    }
    setIsEditingTitle(false)
  }

  const handleToggleChecklistItem = (itemId: string) => {
    if (onUpdate) {
      const updatedChecklist = task.checklist.map((item) =>
        item.id === itemId ? { ...item, done: !item.done } : item
      )
      onUpdate({ ...task, checklist: updatedChecklist })
    }
  }

  const handleAddComment = () => {
    if (commentText.trim()) {
      // In a real app, this would save to backend
      console.log("Adding comment:", commentText)
      setCommentText("")
    }
  }

  if (!open) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl z-50 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-slate-200 px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onBlur={handleSaveTitle}
                    onKeyPress={(e) => e.key === "Enter" && handleSaveTitle()}
                    className="text-xl font-semibold"
                    autoFocus
                  />
                </div>
              ) : (
                <h2
                  className="text-xl font-semibold text-slate-900 cursor-pointer hover:text-slate-700"
                  onClick={() => setIsEditingTitle(true)}
                >
                  {task.title}
                </h2>
              )}
              <div className="flex items-center gap-2 mt-2">
                <Badge className={cn("rounded-full px-3 py-1 text-xs font-semibold", statusMeta.color)}>
                  {statusMeta.label}
                </Badge>
                <Badge className={cn("rounded-full px-3 py-1 text-xs font-semibold", priorityMeta.color)}>
                  {priorityMeta.label}
                </Badge>
                {task.owningTeamLabel && (
                  <Badge className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                    {task.owningTeamLabel}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 px-6">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab("details")}
              className={cn(
                "px-4 py-3 text-sm font-medium transition-colors border-b-2",
                activeTab === "details"
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              )}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={cn(
                "px-4 py-3 text-sm font-medium transition-colors border-b-2",
                activeTab === "activity"
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              )}
            >
              Activity
            </button>
            <button
              onClick={() => setActiveTab("comments")}
              className={cn(
                "px-4 py-3 text-sm font-medium transition-colors border-b-2",
                activeTab === "comments"
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              )}
            >
              Comments
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {activeTab === "details" && (
            <div className="space-y-6">
              {/* Description */}
              {task.description && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">Description</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">{task.description}</p>
                </div>
              )}

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4">
                {/* Assignees */}
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                    <User className="h-3.5 w-3.5" />
                    Assignees
                  </div>
                  <div className="space-y-2">
                    {task.assignments.map((assignment) => (
                      <div key={assignment.userId} className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-slate-200 overflow-hidden">
                          {assignment.userAvatar && (
                            <img
                              src={assignment.userAvatar}
                              alt={assignment.userName}
                              className="h-full w-full"
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{assignment.userName}</p>
                          <p className="text-xs text-slate-500 capitalize">{assignment.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Due date */}
                {task.dueWindow?.end && (
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                      <Calendar className="h-3.5 w-3.5" />
                      Due date
                    </div>
                    <p className="text-sm text-slate-700">
                      {format(parseISO(task.dueWindow.end), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                )}
              </div>

              {/* Checklist */}
              {task.checklist.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-slate-900">Checklist</h3>
                    <span className="text-xs text-slate-600 font-medium">
                      {completedChecklist} / {totalChecklist}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 mb-4">
                    <div
                      className="h-full rounded-full bg-sky-500 transition-all"
                      style={{ width: `${checklistProgress}%` }}
                    />
                  </div>
                  <div className="space-y-2">
                    {task.checklist.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 hover:bg-slate-100 transition-colors cursor-pointer"
                        onClick={() => handleToggleChecklistItem(item.id)}
                      >
                        <div
                          className={cn(
                            "mt-0.5 h-4 w-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                            item.done
                              ? "bg-sky-500 border-sky-500"
                              : "border-slate-300 bg-white"
                          )}
                        >
                          {item.done && <CheckCircle2 className="h-3 w-3 text-white" />}
                        </div>
                        <span
                          className={cn(
                            "text-sm flex-1",
                            item.done ? "text-slate-500 line-through" : "text-slate-700"
                          )}
                        >
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {task.tags.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                    <Tag className="h-3.5 w-3.5" />
                    Tags
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag) => (
                      <Badge
                        key={tag}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Linked contexts */}
              {task.contexts.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                    <LinkIcon className="h-3.5 w-3.5" />
                    Linked items
                  </div>
                  <div className="space-y-2">
                    {task.contexts.map((context) => (
                      <div
                        key={context.id}
                        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                      >
                        <span className="text-xs font-medium text-slate-500 capitalize">
                          {context.type}
                        </span>
                        <span className="text-sm text-slate-700">{context.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Blockers */}
              {task.blockers.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-rose-600 mb-2">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Blockers
                  </div>
                  <div className="space-y-2">
                    {task.blockers.map((blocker) => (
                      <div
                        key={blocker.id}
                        className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2"
                      >
                        <p className="text-sm font-medium text-rose-900">{blocker.label}</p>
                        {blocker.description && (
                          <p className="text-xs text-rose-700 mt-1">{blocker.description}</p>
                        )}
                        {blocker.notes && (
                          <p className="text-xs text-rose-600 mt-1">{blocker.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "activity" && (
            <div className="space-y-4">
              <ActivityItem
                icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                title="Task created"
                timestamp={task.createdAt}
                actor="System"
              />
              {task.assignments.map((assignment) => (
                <ActivityItem
                  key={assignment.userId}
                  icon={<User className="h-4 w-4 text-sky-600" />}
                  title={`Assigned to ${assignment.userName}`}
                  timestamp={task.createdAt}
                  actor="System"
                />
              ))}
              {task.completedAt && (
                <ActivityItem
                  icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                  title="Task completed"
                  timestamp={task.completedAt}
                  actor="System"
                />
              )}
            </div>
          )}

          {activeTab === "comments" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-500">
                No comments yet. Be the first to comment!
              </div>
            </div>
          )}
        </div>

        {/* Footer - Comment input (only show on comments tab) */}
        {activeTab === "comments" && (
          <div className="border-t border-slate-200 px-6 py-4 bg-slate-50">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-slate-200 flex-shrink-0" />
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none resize-none"
                  rows={3}
                />
                <div className="flex items-center justify-between mt-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="h-4 w-4 mr-2" />
                    Attach
                  </Button>
                  <Button
                    size="sm"
                    className="rounded-full bg-slate-900 text-white hover:bg-slate-800"
                    onClick={handleAddComment}
                    disabled={!commentText.trim()}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function ActivityItem({
  icon,
  title,
  timestamp,
  actor,
}: {
  icon: React.ReactNode
  title: string
  timestamp: string
  actor: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-900">{title}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-slate-500">{actor}</span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-500">
            {format(parseISO(timestamp), "MMM d 'at' h:mm a")}
          </span>
        </div>
      </div>
    </div>
  )
}

