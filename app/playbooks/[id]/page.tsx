"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { LayoutScaffold } from "@/components/grid-v2/LayoutScaffold"
import { Button } from "@/components/ui/button"
import { Plus, Save, X } from "lucide-react"
import { PlayCard } from "@/components/playbooks/PlayCard"
import { NaturalLanguageInput } from "@/components/playbooks/NaturalLanguageInput"
import { MOCK_PLAYBOOKS } from "@/lib/playbooks/mockData"
import { transformLLMResponseToPlaybook } from "@/lib/playbooks/llm-transformer"
import { applyRefinementOperations } from "@/lib/playbooks/llm-enrichment/refinement-transformer"
import type { Playbook, Play } from "@/lib/playbooks/types"

export default function PlaybookBuilderPage() {
  const router = useRouter()
  const params = useParams()
  const playbookId = params.id as string

  // Load playbook (in real app, fetch from backend)
  const [playbook, setPlaybook] = useState<Playbook | null>(null)
  const [showDescription, setShowDescription] = useState(false)

  useEffect(() => {
    if (playbookId === "new") {
      // Check if this is a Disco-generated playbook
      const discoPlaybook = sessionStorage.getItem('disco-generated-playbook')
      if (discoPlaybook) {
        try {
          const data = JSON.parse(discoPlaybook)
          // Create playbook with Disco-generated data
          const newPlaybook: Playbook = {
            id: data.id || `playbook-${Date.now()}`,
            name: data.name || "",
            description: data.description,
            plays: [],
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: "user-001",
            lastModifiedBy: "user-001",
          }
          
          setPlaybook(newPlaybook)
          setShowDescription(!!data.description)
          
          // Store generated data to process after playbook is set
          if (data.generatedData) {
            // Use a ref or state to trigger generation after component mounts
            window.dispatchEvent(new CustomEvent('disco-playbook-ready', { 
              detail: { description: data.description || '', generatedData: data.generatedData } 
            }))
          }
          
          // Clear sessionStorage after using it
          sessionStorage.removeItem('disco-generated-playbook')
        } catch (e) {
          console.error('Failed to parse Disco playbook data:', e)
          // Fall through to create new playbook
          setPlaybook({
            id: `playbook-${Date.now()}`,
            name: "",
            description: undefined,
            plays: [],
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: "user-001",
            lastModifiedBy: "user-001",
          })
        }
      } else {
        // Create new playbook
        setPlaybook({
          id: `playbook-${Date.now()}`,
          name: "",
          description: undefined,
          plays: [],
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: "user-001",
          lastModifiedBy: "user-001",
        })
      }
    } else {
      // Load existing playbook
      const existing = MOCK_PLAYBOOKS.find((pb) => pb.id === playbookId)
      if (existing) {
        setPlaybook(existing)
        setShowDescription(!!existing.description)
      }
    }
  }, [playbookId])

  // Listen for Disco-generated playbook data
  useEffect(() => {
    const handleDiscoPlaybookReady = (event: CustomEvent) => {
      if (playbook && event.detail?.generatedData) {
        handleGenerate(event.detail.description, event.detail.generatedData)
      }
    }

    window.addEventListener('disco-playbook-ready', handleDiscoPlaybookReady as EventListener)
    return () => {
      window.removeEventListener('disco-playbook-ready', handleDiscoPlaybookReady as EventListener)
    }
  }, [playbook])

  const handleAddPlay = () => {
    if (!playbook) return

    const newPlay: Play = {
      id: `play-${Date.now()}`,
      playbookId: playbook.id,
      sequence: playbook.plays.length + 1,
      title: "",
      trigger: {
        type: "order_accepted",
      },
      taskTemplate: {
        title: "",
        priority: "medium",
      },
      assignment: {
        type: "role_team",
        mode: "team",
      },
      dependencies: [],
      enabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "user-001",
    }

    setPlaybook({
      ...playbook,
      plays: [...playbook.plays, newPlay],
    })
  }

  const handleUpdatePlay = (playId: string, updatedPlay: Play) => {
    if (!playbook) return

    setPlaybook({
      ...playbook,
      plays: playbook.plays.map((p) => (p.id === playId ? updatedPlay : p)),
    })
  }

  const handleRemovePlay = (playId: string) => {
    if (!playbook) return

    setPlaybook({
      ...playbook,
      plays: playbook.plays.filter((p) => p.id !== playId),
    })
  }

  const handleSave = () => {
    // In real implementation, save to backend
    console.log("Saving playbook:", playbook)
    alert("Playbook saved! (mock)")
    router.push("/playbooks")
  }

  const handleRefine = async (instruction: string, operations: any) => {
    if (!playbook) return

    try {
      console.log(`🔧 Applying refinement: "${instruction}"`)
      console.log(`📋 Operations to apply:`, operations)
      
      // Apply refinement operations
      const { updatedPlaybook, changes } = applyRefinementOperations(playbook, operations)

      setPlaybook(updatedPlaybook)

      console.log(`✅ Applied ${operations.length} refinement operations:`)
      changes.forEach(change => console.log(`  - ${change}`))
      
      if (changes.some(c => c.startsWith('Failed'))) {
        console.warn('⚠️ Some operations failed. Check errors above.')
      }
    } catch (error) {
      console.error("Failed to apply refinement:", error)
      alert("Failed to apply refinement. Please check the console for details.")
    }
  }

  const handleGenerate = async (description: string, generatedData?: any) => {
    if (!playbook || !generatedData) return

    try {
      // Format API response to match transformer input
      const llmResponse = {
        success: generatedData.success || true,
        suggestedName: generatedData.suggestedName,
        suggestedDescription: generatedData.suggestedDescription,
        plays: generatedData.plays || []
      }

      // Transform LLM response to Playbook structure
      const { playbook: playbookData, plays, issues } = transformLLMResponseToPlaybook(
        llmResponse,
        playbook.id,
        playbook.createdBy
      )

      // Update playbook name and description if provided
      const updatedPlaybook: Playbook = {
        ...playbook,
        name: playbookData.name || playbook.name || "Untitled Playbook",
        description: playbookData.description || playbook.description,
        plays: [...playbook.plays, ...plays],
        updatedAt: new Date().toISOString(),
      }

      setPlaybook(updatedPlaybook)

      if (issues.length > 0) {
        console.warn("Transformation issues:", issues)
      }

      // Show success message
      console.log(`✅ Added ${plays.length} plays to playbook`)
    } catch (error) {
      console.error("Failed to process generated playbook:", error)
      alert("Failed to process generated playbook. Please check the console for details.")
    }
  }

  if (!playbook) {
    return (
      <LayoutScaffold
        pageTitle="Loading..."
        pageSubtext="Loading playbook..."
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-slate-600">Loading...</div>
        </div>
      </LayoutScaffold>
    )
  }

  return (
    <LayoutScaffold
      pageTitle={playbookId === "new" ? "New Playbook" : "Edit Playbook"}
      pageSubtext={`${playbook.plays.length} ${playbook.plays.length === 1 ? "play" : "plays"}`}
      headerActions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/playbooks")}
            className="rounded-full"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="rounded-full bg-slate-900 text-white hover:bg-slate-800"
          >
            <Save className="mr-2 h-4 w-4" />
            Save playbook
          </Button>
        </div>
      }
    >
      {/* Main Content */}
      <div className="mx-auto max-w-4xl py-6 space-y-6">
        {/* Playbook Name */}
        <div>
          <input
            type="text"
            value={playbook.name}
            onChange={(e) => setPlaybook({ ...playbook, name: e.target.value })}
            placeholder="Playbook name (e.g., Order Acceptance Playbook)"
            className="w-full text-4xl font-bold text-slate-900 placeholder-slate-300 bg-transparent border-none outline-none"
          />
        </div>

        {/* Playbook Description (Optional) */}
        {!showDescription ? (
          <button
            type="button"
            onClick={() => setShowDescription(true)}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 py-1"
          >
            <Plus className="h-4 w-4" />
            Add description
          </button>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Description</label>
              <button
                type="button"
                onClick={() => {
                  setShowDescription(false)
                  setPlaybook({ ...playbook, description: undefined })
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <textarea
              value={playbook.description || ""}
              onChange={(e) => setPlaybook({ ...playbook, description: e.target.value })}
              placeholder="Describe what this playbook does and when it should be used..."
              rows={3}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-white"
            />
          </div>
        )}

        {/* Natural Language Input - Always Available */}
        <NaturalLanguageInput 
          onGenerate={handleGenerate}
          onRefine={handleRefine}
          existingPlaybook={playbook}
        />

        {/* Divider */}
        <div className="border-t border-slate-200 my-8" />

        {/* Plays Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Plays</h2>
            <span className="text-sm text-slate-600">
              {playbook.plays.length} {playbook.plays.length === 1 ? "play" : "plays"}
            </span>
          </div>

          {playbook.plays.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
              <div className="mx-auto max-w-md space-y-3">
                <h3 className="text-lg font-semibold text-slate-900">No plays yet</h3>
                <p className="text-sm text-slate-600">
                  Add your first play to define what tasks should be created and when they should
                  trigger.
                </p>
              </div>
            </div>
          )}

          {/* Play Cards */}
          <div className="space-y-4">
            {playbook.plays.map((play) => (
              <PlayCard
                key={play.id}
                play={play}
                allPlays={playbook.plays}
                onChange={(updatedPlay) => handleUpdatePlay(play.id, updatedPlay)}
                onRemove={() => handleRemovePlay(play.id)}
              />
            ))}
          </div>

          {/* Add Play Button */}
          <button
            type="button"
            onClick={handleAddPlay}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-white p-6 text-slate-600 hover:border-slate-400 hover:text-slate-900 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span className="font-medium">Add play</span>
          </button>
        </div>

        {/* Bottom Spacing */}
        <div className="h-24" />
      </div>
    </LayoutScaffold>
  )
}

