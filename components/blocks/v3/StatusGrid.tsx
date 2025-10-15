"use client"

interface StatusItem {
  name: string
  status: "online" | "warning" | "offline" | "maintenance"
  value?: string
}

interface StatusGridV3Props {
  title?: string
  items?: StatusItem[]
}

export default function StatusGridV3({ title, items = [] }: StatusGridV3Props) {
  if (items.length === 0) {
    items = [
      { name: "System A", status: "online", value: "100%" },
      { name: "System B", status: "online", value: "98%" },
      { name: "System C", status: "warning", value: "75%" },
      { name: "System D", status: "online", value: "100%" },
    ]
  }

  const statusConfig = {
    online: {
      color: "bg-emerald-500",
      bgLight: "bg-emerald-50",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-700",
      label: "Online"
    },
    warning: {
      color: "bg-amber-500",
      bgLight: "bg-amber-50",
      borderColor: "border-amber-200",
      textColor: "text-amber-700",
      label: "Warning"
    },
    offline: {
      color: "bg-red-500",
      bgLight: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-700",
      label: "Offline"
    },
    maintenance: {
      color: "bg-blue-500",
      bgLight: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
      label: "Maintenance"
    }
  }

  return (
    <div className="h-full w-full bg-white rounded-lg overflow-hidden flex flex-col">
      {/* Title Header */}
      {title && (
        <div className="px-6 pt-6 pb-2">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        </div>
      )}
      
      <div className="flex-1 p-6 pt-4">
        <div className="grid grid-cols-2 gap-4 h-full">
        {items.map((item, i) => {
          const config = statusConfig[item.status]
          return (
            <div
              key={i}
              className={`${config.bgLight} ${config.borderColor} border-2 rounded-lg p-4 flex flex-col justify-between transition-all hover:shadow-md`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-slate-900 text-sm">{item.name}</h4>
                <div className={`${config.color} w-2.5 h-2.5 rounded-full animate-pulse`} />
              </div>

              {/* Value */}
              {item.value && (
                <div className="text-2xl font-bold text-slate-900 mb-2">
                  {item.value}
                </div>
              )}

              {/* Status label */}
              <div className={`text-xs font-medium ${config.textColor}`}>
                {config.label}
              </div>
            </div>
          )
        })}
      </div>
      </div>
    </div>
  )
}



