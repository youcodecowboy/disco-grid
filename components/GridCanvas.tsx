"use client"

import React, { useRef, ReactNode } from "react"

interface GridCanvasProps {
  children: ReactNode
  mode: "edit" | "save"
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  maxY: number
  dragPreview?: { x: number; y: number; w: number; h: number } | null
  className?: string
}

export default function GridCanvas({
  children,
  mode,
  onDragOver,
  onDrop,
  maxY,
  dragPreview,
  className = ""
}: GridCanvasProps) {
  const gridRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={gridRef}
      className={`relative ${
        mode === "edit"
          ? "bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:28px_28px]"
          : ""
      } ${className}`}
      style={{ minHeight: `${(maxY + 6) * 40 + 100}px` }}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Drag Preview Indicator */}
      {dragPreview && mode === "edit" && (
        <div
          className="absolute pointer-events-none z-20"
          style={{
            left: `calc(${(dragPreview.x / 12) * 100}% + ${dragPreview.x > 0 ? "8px" : "0px"})`,
            top: `${dragPreview.y * 40 + (dragPreview.y > 0 ? 8 : 0)}px`,
            width: `calc(${(dragPreview.w / 12) * 100}% - ${dragPreview.x + dragPreview.w < 12 ? "8px" : "0px"})`,
            height: `${dragPreview.h * 40 - 8}px`,
          }}
        >
          <div className="w-full h-full border-2 border-blue-500 border-dashed bg-blue-50/30 rounded-lg shadow-lg animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-lg"></div>
            <div className="absolute top-2 left-2 text-xs text-blue-600 font-medium bg-white/80 px-2 py-1 rounded">
              Drop here
            </div>
          </div>
        </div>
      )}
      
      {children}
    </div>
  )
}
