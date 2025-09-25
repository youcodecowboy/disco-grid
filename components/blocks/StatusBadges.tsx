"use client"

import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  XCircle, 
  Info, 
  Zap,
  Pause,
  Play,
  TrendingUp,
  TrendingDown
} from "lucide-react"

interface StatusBadge {
  id: string
  label: string
  status: "success" | "warning" | "error" | "info" | "pending" | "active" | "inactive" | "high" | "low" | "neutral"
  count?: number
  description?: string
  trend?: "up" | "down" | "stable"
}

interface StatusBadgesProps {
  title?: string
  data?: {
    badges?: StatusBadge[]
    layout?: "grid" | "list" | "horizontal"
    showCounts?: boolean
    showIcons?: boolean
    showTrends?: boolean
  }
}

const statusConfig = {
  success: { 
    icon: CheckCircle, 
    bg: "bg-green-100", 
    text: "text-green-800", 
    border: "border-green-200" 
  },
  warning: { 
    icon: AlertCircle, 
    bg: "bg-yellow-100", 
    text: "text-yellow-800", 
    border: "border-yellow-200" 
  },
  error: { 
    icon: XCircle, 
    bg: "bg-red-100", 
    text: "text-red-800", 
    border: "border-red-200" 
  },
  info: { 
    icon: Info, 
    bg: "bg-blue-100", 
    text: "text-blue-800", 
    border: "border-blue-200" 
  },
  pending: { 
    icon: Clock, 
    bg: "bg-gray-100", 
    text: "text-gray-800", 
    border: "border-gray-200" 
  },
  active: { 
    icon: Play, 
    bg: "bg-green-100", 
    text: "text-green-800", 
    border: "border-green-200" 
  },
  inactive: { 
    icon: Pause, 
    bg: "bg-gray-100", 
    text: "text-gray-800", 
    border: "border-gray-200" 
  },
  high: { 
    icon: Zap, 
    bg: "bg-orange-100", 
    text: "text-orange-800", 
    border: "border-orange-200" 
  },
  low: { 
    icon: Clock, 
    bg: "bg-blue-100", 
    text: "text-blue-800", 
    border: "border-blue-200" 
  },
  neutral: { 
    icon: Info, 
    bg: "bg-gray-100", 
    text: "text-gray-800", 
    border: "border-gray-200" 
  }
}

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  stable: null
}

export default function StatusBadges({ 
  title = "Status Badges", 
  data = {} 
}: StatusBadgesProps) {
  const { 
    badges = [
      { id: "1", label: "Active Orders", status: "active", count: 23, trend: "up" },
      { id: "2", label: "Pending Items", status: "pending", count: 8, trend: "stable" },
      { id: "3", label: "Overdue", status: "warning", count: 3, trend: "down" },
      { id: "4", label: "Completed", status: "success", count: 156, trend: "up" },
      { id: "5", label: "Failed", status: "error", count: 2, trend: "down" },
      { id: "6", label: "High Priority", status: "high", count: 5, trend: "up" }
    ],
    layout = "grid",
    showCounts = true,
    showIcons = true,
    showTrends = true
  } = data

  const getLayoutClasses = () => {
    if (layout === "list") return "flex flex-col gap-1"
    if (layout === "horizontal") return "flex flex-row flex-wrap gap-1"
    return "grid grid-cols-2 gap-1"
  }

  return (
    <div className="h-full flex flex-col" style={{ containerType: "inline-size" }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-foreground truncate">{title}</h3>
        <span className="text-[10px] text-muted-foreground">
          {badges.length} status{badges.length !== 1 ? 'es' : ''}
        </span>
      </div>
      
      <div className={`${getLayoutClasses()} flex-1 overflow-y-auto`}>
        {badges.map((badge) => {
          const config = statusConfig[badge.status]
          const IconComponent = config.icon
          const TrendIcon = showTrends && badge.trend ? trendIcons[badge.trend] : null
          
          return (
            <div
              key={badge.id}
              className={`
                inline-flex items-center justify-between px-2 py-1 rounded-md border transition-colors
                ${config.bg} ${config.text} ${config.border}
                hover:opacity-80 cursor-default
                ${layout === "list" ? "w-full" : ""}
              `}
            >
              <div className="flex items-center gap-1 min-w-0 flex-1">
                {showIcons && <IconComponent className="h-3 w-3 flex-shrink-0" />}
                
                <span className={`font-medium truncate ${
                  layout === "horizontal" ? "text-[10px]" : "text-xs"
                }`}>
                  {badge.label}
                </span>
              </div>
              
              <div className="flex items-center gap-1 flex-shrink-0">
                {showCounts && badge.count !== undefined && (
                  <span className={`font-bold ${
                    layout === "horizontal" ? "text-[10px]" : "text-xs"
                  }`}>
                    {badge.count}
                  </span>
                )}
                
                {TrendIcon && (
                  <TrendIcon className={`h-2.5 w-2.5 ${
                    badge.trend === "up" ? "text-green-600" :
                    badge.trend === "down" ? "text-red-600" : "text-gray-500"
                  }`} />
                )}
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="mt-auto pt-2 text-[10px] text-muted-foreground/60">
        Total: {badges.reduce((sum, badge) => sum + (badge.count || 0), 0)} items
      </div>
    </div>
  )
}
