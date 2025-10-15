"use client"

interface Activity {
  time: string
  user: string
  action: string
  status: "success" | "info" | "warning" | "error"
}

interface ActivityTimelineV3Props {
  title?: string
  activities?: Activity[]
}

const statusConfig = {
  success: {
    color: "bg-emerald-500",
    icon: "✓",
    bgLight: "bg-emerald-50",
    textColor: "text-emerald-700"
  },
  info: {
    color: "bg-blue-500",
    icon: "ℹ",
    bgLight: "bg-blue-50",
    textColor: "text-blue-700"
  },
  warning: {
    color: "bg-amber-500",
    icon: "⚠",
    bgLight: "bg-amber-50",
    textColor: "text-amber-700"
  },
  error: {
    color: "bg-red-500",
    icon: "✕",
    bgLight: "bg-red-50",
    textColor: "text-red-700"
  }
}

export default function ActivityTimelineV3({ title, activities = [] }: ActivityTimelineV3Props) {
  if (activities.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg">
        <div className="text-center">
          <div className="text-4xl mb-2">📋</div>
          <p className="text-slate-500 text-sm">No activities yet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full bg-white rounded-lg flex flex-col">
      {/* Title Header */}
      {title && (
        <div className="px-6 pt-6 pb-2 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const config = statusConfig[activity.status]
            return (
              <div key={index} className="relative flex gap-4">
                {/* Timeline line */}
                {index < activities.length - 1 && (
                  <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-slate-200" />
                )}

                {/* Status icon */}
                <div className={`relative flex-shrink-0 w-8 h-8 rounded-full ${config.color} flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
                  {config.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 mb-1">
                        {activity.action}
                      </p>
                      <p className="text-xs text-slate-600">
                        by <span className="font-medium">{activity.user}</span>
                      </p>
                    </div>
                    <span className="flex-shrink-0 text-xs text-slate-500 font-medium">
                      {activity.time}
                    </span>
                  </div>
                  
                  {/* Status badge */}
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${config.bgLight} ${config.textColor} text-xs font-medium mt-2`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${config.color}`} />
                    {activity.status}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}


