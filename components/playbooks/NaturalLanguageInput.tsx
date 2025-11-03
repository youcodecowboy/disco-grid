"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { PlaybookEnrichmentQuestions } from "./PlaybookEnrichmentQuestions"
import { mapAnswerToPlaybookField, applyUpdateToPlaybook } from "@/lib/playbooks/llm-enrichment/playbook-updater"
import type { EnrichmentQuestion } from "@/lib/playbooks/llm-enrichment/question-generator"

interface NaturalLanguageInputProps {
  onGenerate: (description: string, generatedData?: any) => Promise<void>
  onRefine?: (instruction: string, operations: any) => Promise<void>
  disabled?: boolean
  className?: string
  existingPlaybook?: any // For refinement mode
}

export function NaturalLanguageInput({ onGenerate, onRefine, disabled, className, existingPlaybook }: NaturalLanguageInputProps) {
  const [description, setDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRefining, setIsRefining] = useState(false)
  const [generatedPlaybook, setGeneratedPlaybook] = useState<any>(null)
  const [enrichmentQuestions, setEnrichmentQuestions] = useState<EnrichmentQuestion[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isEnriching, setIsEnriching] = useState(false)
  const [enrichmentComplete, setEnrichmentComplete] = useState(false)
  
  // Only enable refine mode if playbook has plays
  const hasExistingPlays = existingPlaybook?.plays && existingPlaybook.plays.length > 0
  const [mode, setMode] = useState<'create' | 'refine'>(hasExistingPlays ? 'refine' : 'create')
  
  // Auto-switch to refine mode when plays are added
  useEffect(() => {
    if (hasExistingPlays && mode === 'create') {
      setMode('refine')
    }
  }, [hasExistingPlays, mode])
  
  // Ensure mode is valid based on current state
  const currentMode = hasExistingPlays ? mode : 'create'

  const handleRefine = async () => {
    if (!existingPlaybook || !onRefine) return

    if (!description.trim() || description.trim().length < 10) {
      alert("Please provide an instruction (at least 10 characters)")
      return
    }

    setIsRefining(true)
    try {
      const response = await fetch('/api/nlp/playbook/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playbook: existingPlaybook,
          instruction: description.trim()
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Refinement API error:', errorText)
        throw new Error(`API returned ${response.status}: ${errorText}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to refine playbook')
      }

      console.log('✅ Refinement operations:', data.operations)
      console.log('📝 Summary:', data.summary)

      await onRefine(description.trim(), data.operations)
      setDescription("")
    } catch (error) {
      console.error("Refinement error:", error)
      alert(error instanceof Error ? error.message : "Failed to refine playbook. Please try again.")
    } finally {
      setIsRefining(false)
    }
  }

  const handleGenerate = async () => {
    if (currentMode === 'refine') {
      return handleRefine()
    }

    if (!description.trim() || description.trim().length < 50) {
      alert("Please provide a more detailed description (at least 50 characters)")
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/nlp/playbook/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          description: description.trim()
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API error:', errorText)
        throw new Error(`API returned ${response.status}: ${errorText}`)
      }

      const responseText = await response.text()
      console.log('📄 Raw response:', responseText.substring(0, 200) + '...')

      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError)
        console.error('Response text:', responseText)
        throw new Error('Invalid JSON response from server. Check console for details.')
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate playbook')
      }

      console.log('✅ Playbook generated:', data)
      
      // Store generated playbook
      setGeneratedPlaybook(data)
      
      // Analyze playbook for gaps and generate questions
      setIsEnriching(true)
      try {
        const enrichResponse = await fetch('/api/nlp/playbook/enrich', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            playbook: {
              suggestedName: data.suggestedName,
              suggestedDescription: data.suggestedDescription,
              plays: data.plays || []
            },
            originalInput: description.trim()
          })
        })

        if (enrichResponse.ok) {
          const enrichData = await enrichResponse.json()
          console.log('📊 Enrichment response:', {
            success: enrichData.success,
            questionsLength: enrichData.questions?.length || 0,
            questions: enrichData.questions,
            completeness: enrichData.completeness
          })
          
          if (enrichData.success && enrichData.questions && enrichData.questions.length > 0) {
            console.log('✅ Setting enrichment questions:', enrichData.questions.length)
            setEnrichmentQuestions(enrichData.questions)
            setEnrichmentComplete(false)
            console.log('📋 Enrichment questions set:', enrichData.questions)
            if (enrichData.tokenUsage) {
              console.log('💰 Enrichment token usage:', enrichData.tokenUsage)
              console.log(`   Cost: $${enrichData.tokenUsage.cost.toFixed(6)}`)
            }
          } else {
            console.log('ℹ️ No enrichment questions needed, playbook is complete')
            setEnrichmentComplete(true)
            await onGenerate(description.trim(), data)
            setDescription("")
            // Switch to refine mode after generation
            if (hasExistingPlays || (data.plays && data.plays.length > 0)) {
              setMode('refine')
            }
          }
        } else {
          const errorText = await enrichResponse.text()
          console.error('❌ Enrichment API error:', enrichResponse.status, errorText)
        }
      } catch (enrichError) {
        console.error('❌ Enrichment failed:', enrichError)
        setEnrichmentComplete(true)
        await onGenerate(description.trim(), data)
        setDescription("")
        // Switch to refine mode after generation
        if (hasExistingPlays || (data.plays && data.plays.length > 0)) {
          setMode('refine')
        }
      } finally {
        setIsEnriching(false)
      }
    } catch (error) {
      console.error("Generation error:", error)
      alert(error instanceof Error ? error.message : "Failed to generate playbook. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleGenerate()
    }
  }

  const handleQuestionAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
    
    // Apply answer to playbook immediately
    if (generatedPlaybook && enrichmentQuestions.length > 0) {
      const question = enrichmentQuestions.find(q => q.id === questionId)
      if (question) {
        const update = mapAnswerToPlaybookField(question, answer)
        if (update) {
          const updatedPlaybook = applyUpdateToPlaybook({
            suggestedName: generatedPlaybook.suggestedName,
            suggestedDescription: generatedPlaybook.suggestedDescription,
            plays: generatedPlaybook.plays || []
          }, update)
          setGeneratedPlaybook({
            ...generatedPlaybook,
            plays: updatedPlaybook.plays
          })
        }
      }
    }
  }

  const handleQuestionSkip = (questionId: string) => {
    console.log('Skipped question:', questionId)
  }

  const handleAcceptIncomplete = async () => {
    if (generatedPlaybook) {
      setEnrichmentComplete(true)
      await onGenerate(description.trim(), generatedPlaybook)
      setDescription("")
      setEnrichmentQuestions([])
      setAnswers({})
      setGeneratedPlaybook(null)
      // Switch to refine mode after generation
      setMode('refine')
    }
  }

  const handleCompleteEnrichment = async () => {
    if (generatedPlaybook) {
      setEnrichmentComplete(true)
      await onGenerate(description.trim(), generatedPlaybook)
      setDescription("")
      setEnrichmentQuestions([])
      setAnswers({})
      setGeneratedPlaybook(null)
      // Switch to refine mode after generation
      setMode('refine')
    }
  }

  // Check if we can proceed (all critical questions answered)
  const criticalQuestions = enrichmentQuestions.filter(q => q.priority === 'critical' || q.priority === 'high')
  const answeredCritical = criticalQuestions.filter(q => answers[q.id]).length
  const canProceed = criticalQuestions.length === 0 || answeredCritical === criticalQuestions.length

  console.log('🔍 NaturalLanguageInput render state:', {
    enrichmentQuestionsLength: enrichmentQuestions.length,
    enrichmentComplete,
    isEnriching,
    isGenerating,
    shouldShowQuestions: enrichmentQuestions.length > 0 && !enrichmentComplete
  })

  // Show enrichment questions if we have them and haven't completed
  if (enrichmentQuestions.length > 0 && !enrichmentComplete) {
    return (
      <PlaybookEnrichmentQuestions
        questions={enrichmentQuestions}
        onAnswer={handleQuestionAnswer}
        onSkip={handleQuestionSkip}
        onAcceptIncomplete={handleAcceptIncomplete}
        className={className}
      />
    )
  }

  return (
    <div className={cn("rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/30 p-6", className)}>
      <div className="flex items-start gap-3 mb-4">
        <div className="rounded-xl bg-purple-100 p-2 text-purple-600">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-bold text-slate-900">
              {currentMode === 'refine' ? 'Refine Playbook' : 'Natural Language Playbook Generation'}
            </h3>
            {hasExistingPlays && (
              <button
                onClick={() => setMode(currentMode === 'create' ? 'refine' : 'create')}
                className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200"
              >
                {currentMode === 'refine' ? 'Switch to Create' : 'Switch to Refine'}
              </button>
            )}
          </div>
          <p className="text-sm text-slate-600 mt-1">
            {currentMode === 'refine' 
              ? 'Describe changes you want to make to this playbook. Add, edit, or remove plays using natural language.'
              : 'Describe your automation scenario in plain English. The AI will generate plays with triggers, task templates, assignments, and dependencies automatically.'}
          </p>
        </div>
      </div>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder={currentMode === 'refine' 
          ? "Example: Add a new play to notify the warehouse team when fabric arrives. Change the 'Order fabric' play to trigger when items enter cutting stage instead."
          : "Example: When an order is accepted, we need to: 1. Order fabric from supplier (assigned to Procurement team, high priority) 2. Order trims and accessories (assigned to Procurement team, high priority) 3. Finalize and grade pattern (assigned to Pattern Maker role, critical priority) 4. After pattern is finalized, print patterns for all sizes (assigned to Technical Team) 5. Schedule fabric inspection 3 days after order acceptance (assigned to QC Inspector role)"}
        rows={currentMode === 'refine' ? 4 : 6}
        disabled={disabled || isGenerating || isEnriching || isRefining}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
      />

      <div className="flex items-center justify-between mt-4">
        <div className="text-xs text-slate-500">
          {description.length} characters • Min {currentMode === 'refine' ? '10' : '50'} required
          {((currentMode === 'refine' && description.length >= 10) || (currentMode === 'create' && description.length >= 50)) && (
            <span className="text-emerald-600 ml-2">✓ Ready to {currentMode === 'refine' ? 'refine' : 'generate'}</span>
          )}
        </div>

        <Button
          onClick={handleGenerate}
          disabled={disabled || isGenerating || isEnriching || isRefining || 
            (currentMode === 'refine' ? description.trim().length < 10 : description.trim().length < 50)}
          className="rounded-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          {(isGenerating || isEnriching || isRefining) ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isRefining ? 'Refining playbook...' : isEnriching ? 'Analyzing playbook...' : 'Generating plays...'}
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              {currentMode === 'refine' ? 'Refine playbook' : 'Generate playbook'}
            </>
          )}
        </Button>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-500">
          <strong>Tip:</strong> {currentMode === 'refine' 
            ? 'You can add plays ("add a new play to..."), edit existing plays ("change the Order fabric play to..."), or remove plays ("remove the Schedule inspection play").'
            : 'Include details about triggers (when order is accepted, when item enters a stage, etc.), task assignments (teams, roles, or specific people), priorities, and dependencies between plays. The more detail you provide, the better the generated playbook.'}
        </p>
      </div>
    </div>
  )
}

