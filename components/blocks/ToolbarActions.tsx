"use client"

import { 
  Plus, 
  Download, 
  Upload, 
  RefreshCw, 
  Settings, 
  Share2, 
  Archive,
  Trash2,
  Edit,
  Copy,
  MoreHorizontal
} from "lucide-react"

interface ActionButton {
  id: string
  label: string
  icon: "plus" | "download" | "upload" | "refresh" | "settings" | "share" | "archive" | "trash" | "edit" | "copy" | "more"
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  badge?: string | number
}

interface ToolbarActionsProps {
  title?: string
  data?: {
    actions?: ActionButton[]
    layout?: "horizontal" | "vertical" | "grid"
    alignment?: "left" | "center" | "right"
    showLabels?: boolean
  }
}

const iconMap = {
  plus: Plus,
  download: Download,
  upload: Upload,
  refresh: RefreshCw,
  settings: Settings,
  share: Share2,
  archive: Archive,
  trash: Trash2,
  edit: Edit,
  copy: Copy,
  more: MoreHorizontal,
}

const variantStyles = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  outline: "border border-border bg-background hover:bg-muted text-foreground",
  ghost: "hover:bg-muted text-foreground",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
}

const sizeStyles = {
  sm: "h-6 w-6 text-xs",
  md: "h-8 w-8 text-sm", 
  lg: "h-10 w-10 text-base"
}

export default function ToolbarActions({ 
  title = "Toolbar Actions", 
  data = {} 
}: ToolbarActionsProps) {
  const { 
    actions = [
      { id: "1", label: "Create New", icon: "plus", variant: "primary", size: "md" },
      { id: "2", label: "Export", icon: "download", variant: "outline", size: "md" },
      { id: "3", label: "Refresh", icon: "refresh", variant: "ghost", size: "md" },
      { id: "4", label: "Settings", icon: "settings", variant: "ghost", size: "md" },
      { id: "5", label: "Share", icon: "share", variant: "ghost", size: "md", badge: "2" },
    ],
    layout = "horizontal",
    alignment = "left",
    showLabels = true
  } = data

  const getLayoutClasses = () => {
    if (layout === "vertical") return "flex-col gap-1"
    if (layout === "grid") return "grid grid-cols-2 gap-1"
    return "flex-row gap-1"
  }

  const getAlignmentClasses = () => {
    if (alignment === "center") return "justify-center"
    if (alignment === "right") return "justify-end"
    return "justify-start"
  }

  const handleAction = (actionId: string) => {
    console.log(`Action triggered: ${actionId}`)
  }

  return (
    <div className="h-full flex flex-col" style={{ containerType: "inline-size" }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-foreground truncate">{title}</h3>
        <span className="text-[10px] text-muted-foreground">
          {actions.length} action{actions.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className={`flex ${getLayoutClasses()} ${getAlignmentClasses()} flex-wrap`}>
        {actions.map((action) => {
          const IconComponent = iconMap[action.icon]
          const variant = action.variant || "ghost"
          const size = action.size || "md"
          
          return (
            <div key={action.id} className="relative">
              <button
                onClick={() => handleAction(action.id)}
                disabled={action.disabled}
                className={`
                  relative inline-flex items-center justify-center rounded-md transition-colors
                  focus:outline-none focus:ring-1 focus:ring-primary
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${variantStyles[variant]}
                  ${sizeStyles[size]}
                  ${showLabels && layout === "vertical" ? "flex-col gap-0.5 py-2" : ""}
                  ${showLabels && layout === "horizontal" ? "gap-1 px-2" : ""}
                `}
                title={action.label}
              >
                <IconComponent className={`${
                  size === "sm" ? "h-3 w-3" : 
                  size === "lg" ? "h-5 w-5" : "h-4 w-4"
                } flex-shrink-0`} />
                
                {showLabels && (
                  <span className={`${
                    size === "sm" ? "text-[10px]" : 
                    size === "lg" ? "text-sm" : "text-xs"
                  } font-medium truncate`}>
                    {action.label}
                  </span>
                )}
                
                {action.badge && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground 
                                 text-[10px] font-bold rounded-full flex items-center justify-center">
                    {action.badge}
                  </span>
                )}
              </button>
            </div>
          )
        })}
      </div>
      
      <div className="mt-auto pt-2 text-[10px] text-muted-foreground/60">
        {layout} layout • {showLabels ? 'labels shown' : 'icons only'}
      </div>
    </div>
  )
}
