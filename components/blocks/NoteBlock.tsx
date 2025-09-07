"use client"

import React from "react"
import { BlockProps } from "./types"

interface NoteData {
  body?: string
  activities?: Array<{ text: string; time?: string }>
}

interface Props extends BlockProps {
  data?: NoteData
}

export default function NoteBlock({ title, data, className = "", hideTitle }: Props) {
  const body = data?.body || ""
  const activities = Array.isArray(data?.activities) ? data?.activities : []

  // Minimal markdown-ish renderer without external deps
  const renderMarkdown = (text: string) => {
    return text.split("\n").map((line, index) => {
      if (line.startsWith("# ")) {
        return (
          <h1 key={index} className="text-lg font-bold mb-2">
            {line.substring(2)}
          </h1>
        )
      }
      if (line.startsWith("## ")) {
        return (
          <h2 key={index} className="text-base font-semibold mb-2 mt-3">
            {line.substring(3)}
          </h2>
        )
      }
      if (line.startsWith("### ")) {
        return (
          <h3 key={index} className="text-sm font-medium mb-1 mt-2">
            {line.substring(4)}
          </h3>
        )
      }
      if (line.startsWith("• ")) {
        return (
          <li key={index} className="ml-4 mb-1 text-sm">
            {line.substring(2)}
          </li>
        )
      }
      if (line.trim() === "") {
        return <div key={index} className="h-2" />
      }
      // Basic bold with **text**
      if (line.includes("**")) {
        const parts = line.split("**")
        return (
          <p key={index} className="mb-2 text-sm">
            {parts.map((part, i) => (i % 2 === 0 ? part : <strong key={i}>{part}</strong>))}
          </p>
        )
      }

      return (
        <p key={index} className="mb-2 text-sm">
          {line}
        </p>
      )
    })
  }

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {!hideTitle && title && (
        <div className="px-3 py-2 border-b text-xs font-medium text-muted-foreground truncate">
          {title}
        </div>
      )}
      <div className={`flex-1 ${hideTitle ? 'p-2 sm:p-3' : 'p-3'} overflow-auto text-sm leading-relaxed`}>
        {activities.length > 0 ? (
          <div className="space-y-2">
            {activities.map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-2 bg-muted/30 rounded border-l-2 border-l-blue-500">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-foreground">{a.text}</div>
                  {a.time && <div className="text-xs text-muted-foreground">{a.time}</div>}
                </div>
              </div>
            ))}
          </div>
        ) : body ? (
          <div>{renderMarkdown(body)}</div>
        ) : (
          <div className="text-muted-foreground">No content</div>
        )}
      </div>
    </div>
  )
}
