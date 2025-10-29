"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface NaturalLanguageInputProps {
  onGenerate: (description: string, generatedData?: any) => Promise<void>
  disabled?: boolean
  className?: string
}

export function NaturalLanguageInput({ onGenerate, disabled, className }: NaturalLanguageInputProps) {
  const [description, setDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!description.trim() || description.trim().length < 50) {
      alert("Please provide a more detailed description (at least 50 characters)")
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/nlp/workflow/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          description: description.trim()
        })
      })

      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API error:', errorText)
        throw new Error(`API returned ${response.status}: ${errorText}`)
      }

      // Get response text first to see what we're dealing with
      const responseText = await response.text()
      console.log('📄 Raw response:', responseText.substring(0, 200) + '...')

      // Try to parse JSON
      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError)
        console.error('Response text:', responseText)
        throw new Error('Invalid JSON response from server. Check console for details.')
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate workflow')
      }

      console.log('✅ Workflow generated:', data)
      
      // Pass the generated data to parent
      await onGenerate(description.trim(), data)
      
      // Clear description after successful generation
      setDescription("")
    } catch (error) {
      console.error("Generation error:", error)
      alert(error instanceof Error ? error.message : "Failed to generate workflow. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleGenerate()
    }
  }

  return (
    <div className={cn("rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/30 p-6", className)}>
      <div className="flex items-start gap-3 mb-4">
        <div className="rounded-xl bg-blue-100 p-2 text-blue-600">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900">Natural Language Workflow Generation</h3>
          <p className="text-sm text-slate-600 mt-1">
            Describe your manufacturing process in plain English. The AI will generate workflow stages, dependencies, and inputs/outputs automatically.
          </p>
        </div>
      </div>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Example: We run a denim factory. Our process starts with fabric inspection, then cutting, sewing, washing, finishing with buttons and patches, QA inspection, and finally packaging. Between cutting and sewing, the fabric needs to rest for 2 hours. The sewing team needs manager approval before starting production..."
        rows={6}
        disabled={disabled || isGenerating}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
      />

      <div className="flex items-center justify-between mt-4">
        <div className="text-xs text-slate-500">
          {description.length} characters • Min 50 required
          {description.length >= 50 && <span className="text-emerald-600 ml-2">✓ Ready to generate</span>}
        </div>

        <Button
          onClick={handleGenerate}
          disabled={disabled || isGenerating || description.trim().length < 50}
          className="rounded-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating stages...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate workflow
            </>
          )}
        </Button>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-500">
          <strong>Tip:</strong> Include details about stage sequences, team assignments, dependencies (approvals, time delays, task completions), and any special requirements. The more detail you provide, the better the generated workflow.
        </p>
      </div>
    </div>
  )
}

