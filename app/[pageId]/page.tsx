"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import PageTemplate from "@/components/PageTemplate"
import { DashboardCreationWizard } from "@/components/DashboardCreationWizard"
import { createBlankPreset, getPreset } from "@/lib/grid-v2/presets"
import {
    loadDashboard,
    saveDashboard,
    getDashboardMetadata,
    deleteDashboard as deleteDashboardStorage,
    type DashboardState
} from "@/lib/dashboard-generation/storage"

const formatPageName = (pageId: string) =>
  pageId
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())

export default function DynamicPage() {
  const params = useParams()
  const router = useRouter()
  const pageId = params.pageId as string
  const [isLoading, setIsLoading] = useState(true)
  const [isDashboard, setIsDashboard] = useState(false)
  const [dashboardState, setDashboardState] = useState<DashboardState | null>(null)
  const [dashboardName, setDashboardName] = useState("")
  
  // Check if this is a dashboard from the new system
  useEffect(() => {
    const checkDashboard = async () => {
      // Check if this pageId is a dashboard
      const metadata = getDashboardMetadata(pageId)
      
      if (metadata) {
        setIsDashboard(true)
        setDashboardName(metadata.name)
        
        // Try to load existing dashboard state
        const existingState = loadDashboard(pageId)
        setDashboardState(existingState)
      }
      
      setIsLoading(false)
    }
    
    checkDashboard()
  }, [pageId])

  const handleDashboardComplete = (state: DashboardState) => {
    // Save the generated dashboard
    saveDashboard(pageId, state, {
      isGenerated: true,
      timestamp: Date.now()
    })
    
    // Update local state to show the dashboard
    setDashboardState(state)
  }

  const handleDeleteDashboard = () => {
    if (confirm(`Are you sure you want to delete "${dashboardName}"? This cannot be undone.`)) {
      deleteDashboardStorage(pageId)
      router.push('/playground')
    }
  }

  // For old system compatibility (non-dashboard pages)
  const storageKey = `page-${pageId}`
  const frozenStorageKey = `page-${pageId}-frozen`
  const pageTitle = isDashboard ? dashboardName : formatPageName(pageId)

  const initialState = useMemo(() => {
    if (isDashboard && dashboardState) {
      return dashboardState
    }
    
    const preset = getPreset(pageId)
    if (preset) {
      // Convert GridState to DashboardState
      return {
        mode: preset.mode,
        layout: preset.layout,
        blocks: preset.blocks as any // Type compatibility
      }
    }
    
    const blankPreset = createBlankPreset(pageTitle)
    return {
      mode: blankPreset.mode,
      layout: blankPreset.layout,
      blocks: blankPreset.blocks as any // Type compatibility
    }
  }, [pageId, pageTitle, isDashboard, dashboardState])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show wizard if it's a dashboard but has no state yet
  if (isDashboard && !dashboardState) {
    return (
      <DashboardCreationWizard
        dashboardId={pageId}
        dashboardName={dashboardName}
        onComplete={handleDashboardComplete}
      />
    )
  }

  // Show the dashboard or regular page template
  return (
    <PageTemplate
      pageTitle={pageTitle}
      pageSubtext={isDashboard ? "AI-generated custom dashboard" : "Custom page with AI-powered components"}
      storageKey={isDashboard ? `dashboard-${pageId}` : storageKey}
      frozenStorageKey={isDashboard ? `dashboard-${pageId}-frozen` : frozenStorageKey}
      initialState={initialState}
      functionButtons={[
        {
          label: isDashboard ? "Delete Dashboard" : "Reset Page",
          variant: "ghost" as const,
          onClick: isDashboard ? handleDeleteDashboard : () => {
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
