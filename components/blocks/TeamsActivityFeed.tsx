"use client"

import { Person, Device } from "@/lib/data/teams"
import { Package, CheckCircle, Scan, Clock } from "lucide-react"
import Image from "next/image"

type ActivityEntry = {
  id: string
  person: Person
  device?: Device
  action: "scan" | "task_complete" | "item_complete"
  target: string
  timestamp: string
}

type TeamsActivityFeedProps = {
  people: Person[]
  devices: Device[]
  limit?: number
}

export default function TeamsActivityFeed({ people, devices, limit = 12 }: TeamsActivityFeedProps) {
  // Ensure arrays are safe
  const safePeople = Array.isArray(people) ? people : []
  const safeDevices = Array.isArray(devices) ? devices : []
  
  // Generate mock activity from people data
  const activities: ActivityEntry[] = safePeople.slice(0, limit).map((person, idx) => {
    const device = safeDevices.find(d => d.assignedToPersonId === person.id)
    const actions: ActivityEntry["action"][] = ["scan", "task_complete", "item_complete"]
    const action = actions[idx % 3]
    
    return {
      id: `activity-${idx}`,
      person,
      device,
      action,
      target: action === "scan" ? "JKT-AURORA-M-042" : action === "task_complete" ? "Quality Check - Panel Assembly" : "Hybrid Jacket - Unit #042",
      timestamp: new Date(Date.now() - idx * 5 * 60 * 1000).toISOString()
    }
  })

  const getActionIcon = (action: string) => {
    switch (action) {
      case "scan": return <Scan className="w-3 h-3" />
      case "task_complete": return <CheckCircle className="w-3 h-3" />
      case "item_complete": return <Package className="w-3 h-3" />
      default: return null
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "scan": return "bg-blue-100 text-blue-700"
      case "task_complete": return "bg-green-100 text-green-700"
      case "item_complete": return "bg-purple-100 text-purple-700"
      default: return "bg-slate-100 text-slate-700"
    }
  }

  const getActionText = (action: string) => {
    switch (action) {
      case "scan": return "scanned"
      case "task_complete": return "completed task"
      case "item_complete": return "completed item"
      default: return "updated"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const mins = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000)
    if (mins < 1) return "Just now"
    if (mins < 60) return `${mins}m ago`
    if (mins < 1440) return `${Math.floor(mins / 60)}h ago`
    return `${Math.floor(mins / 1440)}d ago`
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
        <h3 className="text-sm font-semibold text-slate-900">Live Activity Feed</h3>
        <p className="text-xs text-slate-600 mt-1">Real-time team actions</p>
      </div>

      {/* Activity List */}
      <div className="flex-1 overflow-auto">
        <div className="divide-y divide-slate-100">
          {activities.map(activity => (
            <div
              key={activity.id}
              className="flex items-start gap-3 px-6 py-3 hover:bg-slate-50 transition-colors"
            >
              {/* Avatar */}
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200">
                  {activity.person.avatar && (
                    <Image
                      src={activity.person.avatar}
                      alt={activity.person.name}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <p className="text-sm text-slate-900">
                      <span className="font-semibold">{activity.person.name}</span>
                      {" "}
                      <span className="text-slate-600">{getActionText(activity.action)}</span>
                    </p>
                    <p className="text-xs text-slate-700 font-mono mt-0.5 bg-slate-100 inline-block px-2 py-0.5 rounded">
                      {activity.target}
                    </p>
                  </div>
                  <div className={`flex-shrink-0 px-2 py-1 rounded-md ${getActionColor(activity.action)} flex items-center gap-1.5 text-xs font-medium`}>
                    {getActionIcon(activity.action)}
                    {activity.action.replace("_", " ")}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimestamp(activity.timestamp)}</span>
                  {activity.device && (
                    <>
                      <span>•</span>
                      <span>{activity.device.name}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-slate-200 bg-slate-50">
        <button className="w-full text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors">
          View full activity log →
        </button>
      </div>
    </div>
  )
}
