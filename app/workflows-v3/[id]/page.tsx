"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { LayoutScaffold } from "@/components/grid-v2/LayoutScaffold"
import { Button } from "@/components/ui/button"
import { Save, Plus, Power, PowerOff } from "lucide-react"
import { NaturalLanguageInput } from "@/components/workflows-v3/NaturalLanguageInput"
import { StageCard } from "@/components/workflows-v3/StageCard"
import { LimboZoneCard } from "@/components/workflows-v3/LimboZoneCard"
import { createEmptyWorkflow, createEmptyStage, createEmptyLimboZone, getWorkflowById } from "@/lib/workflows-v3/mockData"
import type { WorkflowV3, WorkflowStageV3, LimboZone } from "@/lib/workflows-v3/types"

export default function WorkflowBuilderPage() {
  const router = useRouter()
  const params = useParams()
  const workflowId = params.id as string
  const [workflow, setWorkflow] = useState<WorkflowV3 | null>(null)
  const lastStageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (workflowId === "new") {
      setWorkflow(createEmptyWorkflow())
    } else {
      // Check if this is a Disco-generated workflow
      const discoWorkflow = sessionStorage.getItem('disco-generated-workflow')
      if (discoWorkflow) {
        try {
          const data = JSON.parse(discoWorkflow)
          if (data.id === workflowId) {
            // We have a Disco-generated workflow, create it with the generated data
            const newWorkflow = createEmptyWorkflow()
            newWorkflow.id = workflowId
            newWorkflow.name = data.name
            newWorkflow.description = data.description
            newWorkflow.industry = data.industry
            
            // Set workflow first
            setWorkflow(newWorkflow)
            
            // Store generated data to use after workflow is set
            setTimeout(() => {
              if (data.generatedData) {
                // Use the current workflow state
                setWorkflow(current => {
                  if (!current) return null
                  // Call handleGenerate logic inline
                  const generatedData = data.generatedData
                  if (generatedData?.stages) {
                    const newStages: WorkflowStageV3[] = generatedData.stages.map((genStage: any, index: number) => {
                      const stageId = `stage-${Date.now()}-${index}`
                      return {
                        id: stageId,
                        workflowId: current.id,
                        sequence: genStage.sequence || index + 1,
                        name: genStage.name || "",
                        description: genStage.description,
                        type: genStage.type || "sequential",
                        parallelWith: genStage.parallelWith || [],
                        inputs: (genStage.suggestedInputs || []).map((type: string, idx: number) => ({
                          id: `input-${stageId}-${idx}`,
                          type: type as any,
                          label: `${type.replace('_', ' ')} input`,
                          required: true
                        })),
                        dependencies: (genStage.dependencies || []).map((dep: any, idx: number) => ({
                          id: `dep-${stageId}-${idx}`,
                          type: dep.type,
                          description: dep.description || "",
                          details: dep.details || {}
                        })),
                        outputs: (genStage.suggestedOutputs || []).map((type: string, idx: number) => ({
                          id: `output-${stageId}-${idx}`,
                          type: type as any,
                          label: `${type.replace('_', ' ')} output`,
                          required: true
                        })),
                        assignedTeam: genStage.suggestedTeam,
                        isExpanded: false,
                        isComplete: true,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                      }
                    })
                    
                    const llmLimboZones: LimboZone[] = (generatedData.limboZones || []).map((lz: any, index: number) => {
                      const fromStage = newStages.find(s => s.name === lz.betweenStages[0])
                      const toStage = newStages.find(s => s.name === lz.betweenStages[1])
                      if (!fromStage || !toStage) return null
                      return {
                        id: `limbo-${Date.now()}-${index}`,
                        workflowId: current.id,
                        betweenStages: [fromStage.id, toStage.id],
                        dependencies: (lz.dependencies || []).map((dep: any, idx: number) => ({
                          id: `limbo-dep-${Date.now()}-${idx}`,
                          type: dep.type,
                          description: dep.description || "",
                          details: dep.details || {}
                        }))
                      }
                    }).filter(Boolean) as LimboZone[]
                    
                    const sortedStages = [...newStages].sort((a, b) => a.sequence - b.sequence)
                    const existingLimboZonePairs = new Set(
                      llmLimboZones.map(lz => `${lz.betweenStages[0]}-${lz.betweenStages[1]}`)
                    )
                    const autoLimboZones: LimboZone[] = []
                    for (let i = 0; i < sortedStages.length - 1; i++) {
                      const fromStage = sortedStages[i]
                      const toStage = sortedStages[i + 1]
                      const limboKey = `${fromStage.id}-${toStage.id}`
                      if (!existingLimboZonePairs.has(limboKey)) {
                        const limboZone = createEmptyLimboZone(current.id, fromStage.id, toStage.id)
                        autoLimboZones.push(limboZone)
                        existingLimboZonePairs.add(limboKey)
                      }
                    }
                    
                    return {
                      ...current,
                      name: generatedData.suggestedName || current.name,
                      industry: generatedData.suggestedIndustry || current.industry,
                      stages: newStages,
                      limboZones: [...llmLimboZones, ...autoLimboZones]
                    }
                  }
                  return current
                })
              }
            }, 100)
            
            // Clear sessionStorage after using it
            sessionStorage.removeItem('disco-generated-workflow')
            return
          }
        } catch (e) {
          console.error('Failed to parse Disco workflow data:', e)
        }
      }
      
      // Load existing workflow
      const existing = getWorkflowById(workflowId)
      if (existing) {
        setWorkflow(existing)
      } else {
        // Workflow not found, create empty one
        setWorkflow(createEmptyWorkflow())
      }
    }
  }, [workflowId])

  const handleGenerate = async (description: string, generatedData?: any) => {
    if (!workflow) return

    console.log('🤖 Processing generated workflow:', generatedData)

    // If we have generated data, convert it to workflow stages
    if (generatedData?.stages) {
      const newStages: WorkflowStageV3[] = generatedData.stages.map((genStage: any, index: number) => {
        const stageId = `stage-${Date.now()}-${index}`
        
        return {
          id: stageId,
          workflowId: workflow.id,
          sequence: genStage.sequence || index + 1,
          name: genStage.name || "",
          description: genStage.description,
          type: genStage.type || "sequential",
          parallelWith: genStage.parallelWith || [],
          inputs: (genStage.suggestedInputs || []).map((type: string, idx: number) => ({
            id: `input-${stageId}-${idx}`,
            type: type as any,
            label: `${type.replace('_', ' ')} input`,
            required: true
          })),
          dependencies: (genStage.dependencies || []).map((dep: any, idx: number) => ({
            id: `dep-${stageId}-${idx}`,
            type: dep.type,
            description: dep.description || "",
            details: dep.details || {}
          })),
          outputs: (genStage.suggestedOutputs || []).map((type: string, idx: number) => ({
            id: `output-${stageId}-${idx}`,
            type: type as any,
            label: `${type.replace('_', ' ')} output`,
            required: true
          })),
          assignedTeam: genStage.suggestedTeam,
          isExpanded: false,
          isComplete: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      })

      // Create limbo zones from LLM response
      const llmLimboZones: LimboZone[] = (generatedData.limboZones || []).map((lz: any, index: number) => {
        // Find stage IDs by name
        const fromStage = newStages.find(s => s.name === lz.betweenStages[0])
        const toStage = newStages.find(s => s.name === lz.betweenStages[1])

        if (!fromStage || !toStage) return null

        return {
          id: `limbo-${Date.now()}-${index}`,
          workflowId: workflow.id,
          betweenStages: [fromStage.id, toStage.id],
          dependencies: (lz.dependencies || []).map((dep: any, idx: number) => ({
            id: `limbo-dep-${Date.now()}-${idx}`,
            type: dep.type,
            description: dep.description || "",
            details: dep.details || {}
          }))
        }
      }).filter(Boolean) as LimboZone[]

      // Automatically create limbo zones between consecutive stages (if they don't already exist)
      // This ensures every pair of consecutive stages has a limbo zone, just like handleAddStage does
      const autoLimboZones: LimboZone[] = []
      const existingLimboZonePairs = new Set(
        llmLimboZones.map(lz => `${lz.betweenStages[0]}-${lz.betweenStages[1]}`)
      )

      // Sort stages by sequence to ensure correct order
      const sortedStages = [...newStages].sort((a, b) => a.sequence - b.sequence)

      // Create limbo zone between each pair of consecutive stages
      for (let i = 0; i < sortedStages.length - 1; i++) {
        const fromStage = sortedStages[i]
        const toStage = sortedStages[i + 1]
        const limboKey = `${fromStage.id}-${toStage.id}`

        // Only create if limbo zone doesn't already exist
        if (!existingLimboZonePairs.has(limboKey)) {
          const limboZone = createEmptyLimboZone(workflow.id, fromStage.id, toStage.id)
          autoLimboZones.push(limboZone)
          existingLimboZonePairs.add(limboKey) // Track to avoid duplicates
        }
      }

      // Combine LLM-generated limbo zones with auto-generated ones
      const newLimboZones = [...llmLimboZones, ...autoLimboZones]

      // Update workflow with suggested name and generated stages
      setWorkflow({
        ...workflow,
        name: generatedData.suggestedName || workflow.name,
        industry: generatedData.suggestedIndustry || workflow.industry,
        stages: newStages,
        limboZones: newLimboZones
      })

      console.log(`✅ Generated ${newStages.length} stages and ${newLimboZones.length} limbo zones`)
    }
  }

  const handleAddStage = () => {
    if (!workflow) return

    const newSequence = workflow.stages.length + 1
    const newStage = createEmptyStage(workflow.id, newSequence)
    
    // If there's a previous stage, create a limbo zone
    const newLimboZones = [...workflow.limboZones]
    if (workflow.stages.length > 0) {
      const previousStage = workflow.stages[workflow.stages.length - 1]
      const limboZone = createEmptyLimboZone(workflow.id, previousStage.id, newStage.id)
      newLimboZones.push(limboZone)
    }

    setWorkflow({
      ...workflow,
      stages: [...workflow.stages, newStage],
      limboZones: newLimboZones
    })

    // Scroll to new stage after a brief delay
    setTimeout(() => {
      lastStageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    }, 100)
  }

  const handleUpdateStage = (stageId: string, updatedStage: WorkflowStageV3) => {
    if (!workflow) return
    setWorkflow({
      ...workflow,
      stages: workflow.stages.map(s => s.id === stageId ? updatedStage : s)
    })
  }

  const handleRemoveStage = (stageId: string) => {
    if (!workflow) return
    
    // Remove stage and any limbo zones connected to it
    setWorkflow({
      ...workflow,
      stages: workflow.stages.filter(s => s.id !== stageId),
      limboZones: workflow.limboZones.filter(lz => 
        !lz.betweenStages.includes(stageId)
      )
    })
  }

  const handleCompleteStage = (stageId: string) => {
    // Auto-scroll to next stage or limbo zone
    setTimeout(() => {
      const stageIndex = workflow?.stages.findIndex(s => s.id === stageId)
      if (stageIndex !== undefined && stageIndex !== -1 && workflow) {
        if (stageIndex < workflow.stages.length - 1) {
          // Scroll to limbo zone or next stage
          const nextElement = document.querySelector(`[data-stage-id="${workflow.stages[stageIndex + 1].id}"]`)
          nextElement?.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }
    }, 300)
  }

  const handleUpdateLimboZone = (limboId: string, updatedLimbo: LimboZone) => {
    if (!workflow) return
    setWorkflow({
      ...workflow,
      limboZones: workflow.limboZones.map(lz => lz.id === limboId ? updatedLimbo : lz)
    })
  }

  const handleSave = () => {
    // TODO: Check for enrichment gaps before allowing save
    // For now, basic validation
    if (!workflow || workflow.stages.length === 0) {
      alert("Please add at least one stage before saving.")
      return
    }
    
    console.log("Saving workflow:", workflow)
    alert("Workflow saved! (mock)")
    router.push("/workflows-v3")
  }

  const handleToggleActive = () => {
    if (!workflow) return
    setWorkflow({ ...workflow, active: !workflow.active })
  }

  if (!workflow) {
    return (
      <LayoutScaffold pageTitle="Loading..." pageSubtext="Loading workflow...">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-slate-600">Loading...</div>
        </div>
      </LayoutScaffold>
    )
  }

  return (
    <LayoutScaffold
      pageTitle={workflowId === "new" ? "New Workflow" : "Edit Workflow"}
      pageSubtext={`${workflow.stages.length} ${workflow.stages.length === 1 ? "stage" : "stages"}`}
      headerActions={
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleActive}
            className={workflow.active ? "text-emerald-600 hover:text-emerald-700" : "text-slate-600"}
          >
            {workflow.active ? <Power className="h-4 w-4 mr-2" /> : <PowerOff className="h-4 w-4 mr-2" />}
            {workflow.active ? "Active" : "Inactive"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/workflows-v3")}
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
            Save workflow
          </Button>
        </div>
      }
    >
      <div className="mx-auto max-w-4xl py-6 space-y-6">
        {/* Workflow Name */}
        <div>
          <input
            type="text"
            value={workflow.name}
            onChange={(e) => setWorkflow({ ...workflow, name: e.target.value })}
            placeholder="Workflow name (e.g., Denim Manufacturing Workflow)"
            className="w-full text-4xl font-bold text-slate-900 placeholder-slate-300 bg-transparent border-none outline-none"
          />
        </div>

        {/* Workflow Description (Optional) */}
        <div>
          <textarea
            value={workflow.description || ""}
            onChange={(e) => setWorkflow({ ...workflow, description: e.target.value })}
            placeholder="Describe this workflow... (optional)"
            rows={2}
            className="w-full text-base text-slate-600 placeholder-slate-400 bg-transparent border-none outline-none resize-none"
          />
        </div>

        {/* Natural Language Input - Always Available */}
        <NaturalLanguageInput onGenerate={handleGenerate} />

        {/* Divider */}
        {workflow.stages.length > 0 && (
          <div className="border-t border-slate-200 my-8" />
        )}

        {/* Stages and Limbo Zones */}
        <div className="space-y-6">
          {workflow.stages.map((stage, index) => {
            // Find limbo zone after this stage
            const limboZone = workflow.limboZones.find(lz => lz.betweenStages[0] === stage.id)
            const isLastStage = index === workflow.stages.length - 1

            return (
              <div key={stage.id} data-stage-id={stage.id} ref={isLastStage ? lastStageRef : null}>
                {/* Stage Card */}
                <StageCard
                  stage={stage}
                  allStages={workflow.stages}
                  onChange={(updated) => handleUpdateStage(stage.id, updated)}
                  onRemove={() => handleRemoveStage(stage.id)}
                  onComplete={() => handleCompleteStage(stage.id)}
                />

                {/* Limbo Zone (if exists) */}
                {limboZone && (
                  <div className="my-6">
                    <LimboZoneCard
                      limboZone={limboZone}
                      allStages={workflow.stages}
                      onChange={(updated) => handleUpdateLimboZone(limboZone.id, updated)}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Add Stage Button (Endless) */}
        <button
          onClick={handleAddStage}
          className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-white p-6 text-slate-600 hover:border-slate-400 hover:text-slate-900 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span className="font-medium">Add stage</span>
        </button>

        {/* Bottom Spacing */}
        <div className="h-24" />
      </div>
    </LayoutScaffold>
  )
}

