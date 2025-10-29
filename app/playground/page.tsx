"use client"

import PageTemplate from "@/components/PageTemplate"
import { useMemo } from "react"
import { getPlaygroundPreset } from "@/lib/grid-v2/presets"

export default function PlaygroundPage() {
  const initialState = useMemo(() => getPlaygroundPreset(), [])

  return (
    <PageTemplate
        pageTitle="AI Dashboard Builder"
        pageSubtext="Interactive dashboard with AI-powered component generation"
        storageKey="playground-v3"
        frozenStorageKey="playground-v3-frozen"
        initialState={initialState}
        functionButtons={[
          {
            label: "Reset Dashboard",
            variant: "ghost" as const,
            onClick: () => {
              localStorage.removeItem("playground-v3")
              localStorage.removeItem("playground-v3-frozen")
              window.location.reload()
            },
          },
        ]}
      />
  )
}

