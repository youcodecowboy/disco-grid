"use client"

import type { BlockConfig } from "@/lib/grid-v2/types"
import type { SiteElementStatus } from "@/lib/site-map/types"

interface EquipmentBlockProps {
  block: BlockConfig
  onEdit?: () => void
}

export function EquipmentBlock({ block, onEdit }: EquipmentBlockProps) {
  const name = block.props?.name || block.title || "Equipment"
  const icon = block.props?.icon || "🔨"
  const status = (block.props?.status || "active") as SiteElementStatus
  const description = block.props?.description || ""
  const color = block.props?.color || "#ef4444"

  const statusColors = {
    active: "bg-green-500",
    inactive: "bg-gray-400",
    maintenance: "bg-yellow-500",
  }

  return (
    <div
      className="h-full w-full rounded-lg border-2 shadow-sm hover:shadow-md transition-all cursor-pointer p-3 flex flex-col items-center justify-center gap-2 relative"
      style={{ borderColor: color, backgroundColor: `${color}10` }}
      onClick={onEdit}
      title={description}
    >
      {/* Status indicator */}
      <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${statusColors[status]}`}></div>

      {/* Icon */}
      <div className="text-3xl" style={{ color }}>
        {icon}
      </div>

      {/* Name */}
      <div className="text-sm font-medium text-center text-gray-900 line-clamp-2">{name}</div>

      {/* Type label */}
      <div className="text-xs text-gray-500">Equipment</div>
    </div>
  )
}

