"use client"

import React from 'react'
import { CheckCircle, MessageSquare, Plus, Workflow, Clock } from 'lucide-react'

interface Activity {
  type: 'stage-complete' | 'message' | 'item-created' | 'workflow-assigned'
  itemCode: string
  itemName: string
  stage?: string
  message?: string
  workflow?: string
  user: string
  timestamp: string
  icon?: string
}

interface ItemActivityTimelineProps {
  activities?: Activity[]
  title?: string
}

export default function ItemActivityTimeline({ activities = [], title }: ItemActivityTimelineProps) {
  const getActivityIcon = (type: string) => {
    const icons = {
      'stage-complete': CheckCircle,
      'message': MessageSquare,
      'item-created': Plus,
      'workflow-assigned': Workflow
    }
    return icons[type as keyof typeof icons] || Clock
  }

  const getActivityColor = (type: string) => {
    const colors = {
      'stage-complete': {
        bg: 'bg-green-50',
        icon: 'text-green-600',
        border: 'border-green-200'
      },
      'message': {
        bg: 'bg-blue-50',
        icon: 'text-blue-600',
        border: 'border-blue-200'
      },
      'item-created': {
        bg: 'bg-purple-50',
        icon: 'text-purple-600',
        border: 'border-purple-200'
      },
      'workflow-assigned': {
        bg: 'bg-orange-50',
        icon: 'text-orange-600',
        border: 'border-orange-200'
      }
    }
    return colors[type as keyof typeof colors] || {
      bg: 'bg-slate-50',
      icon: 'text-slate-600',
      border: 'border-slate-200'
    }
  }

  const getActivityDescription = (activity: Activity) => {
    switch (activity.type) {
      case 'stage-complete':
        return `Completed ${activity.stage}`
      case 'message':
        return activity.message
      case 'item-created':
        return 'Item created'
      case 'workflow-assigned':
        return `Assigned to ${activity.workflow}`
      default:
        return 'Activity'
    }
  }

  return (
    <div className="h-full flex flex-col p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">Latest updates and changes</p>
        </div>
        <div className="p-2 bg-slate-50 text-slate-600 rounded-lg">
          <Clock className="h-4 w-4" />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="space-y-3">
          {activities.map((activity, index) => {
            const Icon = getActivityIcon(activity.type)
            const colors = getActivityColor(activity.type)

            return (
              <div 
                key={index}
                className="flex gap-3 group hover:bg-slate-50 -mx-2 px-2 py-2 rounded-lg transition-colors"
              >
                {/* Icon */}
                <div className={`${colors.bg} ${colors.border} border ${colors.icon} rounded-lg p-2 h-fit`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                          {activity.itemCode}
                        </code>
                      </p>
                      <p className="text-xs text-slate-600 truncate">
                        {activity.itemName}
                      </p>
                    </div>
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {activity.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 mb-1">
                    {getActivityDescription(activity)}
                  </p>

                  <p className="text-xs text-slate-500">
                    by {activity.user}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {activities.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Clock className="h-10 w-10 text-slate-300 mb-2" />
            <p className="text-sm font-medium text-slate-900">No recent activity</p>
            <p className="text-xs text-slate-500 mt-1">Activity will appear here as items are updated</p>
          </div>
        )}
      </div>
    </div>
  )
}


