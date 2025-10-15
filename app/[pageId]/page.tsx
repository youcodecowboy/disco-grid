"use client"

import { useMemo } from "react"
import { useParams } from "next/navigation"
import PageTemplate from "@/components/PageTemplate"
import { createBlankPreset, getPreset } from "@/lib/grid-v2/presets"

const formatPageName = (pageId: string) =>
  pageId
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())

export default function DynamicPage() {
  const params = useParams()
  const pageId = params.pageId as string
  const storageKey = `page-${pageId}`
  const frozenStorageKey = `page-${pageId}-frozen`
  const pageTitle = formatPageName(pageId)

  const initialState = useMemo(() => {
    const preset = getPreset(pageId)
    if (preset) {
      return preset
    }
    return createBlankPreset(pageTitle)
  }, [pageId, pageTitle])

  return (
    <PageTemplate
      pageTitle={pageTitle}
      pageSubtext="Custom page with AI-powered components"
      storageKey={storageKey}
      frozenStorageKey={frozenStorageKey}
      initialState={initialState}
      functionButtons={[
        {
          label: "Reset Page",
          variant: "ghost" as const,
          onClick: () => {
            if (confirm("Are you sure you want to reset this page? This will clear all content.")) {
              localStorage.removeItem(storageKey)
              localStorage.removeItem(frozenStorageKey)
              window.location.reload()
            }
          },
        },
      ]}
    />
  )
}
