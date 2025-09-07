import { BlockProps, ActivityData } from "./types"

interface Props extends BlockProps {
  data: ActivityData
}

export default function ActivityTimeline({ title, data, className = "" }: Props) {
  const activities = data?.activities || []

  return (
    <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
      {activities.map((activity, index) => (
        <div key={activity.id || index} className="flex items-start gap-3">
          <div
            className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
              activity.status === "success"
                ? "bg-green-500"
                : activity.status === "warning"
                  ? "bg-orange-500"
                  : activity.status === "error"
                    ? "bg-red-500"
                    : "bg-blue-500"
            }`}
          />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium">{activity.action}</div>
            <div className="text-xs text-muted-foreground">{activity.time}</div>
          </div>
          <div
            className={`px-2 py-0.5 rounded-full text-xs ${
              activity.status === "success"
                ? "bg-green-100 text-green-800"
                : activity.status === "warning"
                  ? "bg-orange-100 text-orange-800"
                : activity.status === "error"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
            }`}
          >
            {activity.type || "info"}
          </div>
        </div>
      ))}
    </div>
  )
}
