"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wand2, Send, X, AlertCircle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ComponentRefinementInputProps {
  blockId: string
  currentComponent: {
    type: string
    title: string
    config: Record<string, any>
  }
  onRefine: (result: any) => void
  onCancel: () => void
}

export function ComponentRefinementInput({
  blockId,
  currentComponent,
  onRefine,
  onCancel
}: ComponentRefinementInputProps) {
  const [prompt, setPrompt] = useState('')
  const [isRefining, setIsRefining] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)

  const handleRefine = async () => {
    if (!prompt.trim() || isRefining) return

    setError(null)
    setResult(null)
    setIsRefining(true)

    console.log('🔧 Starting refinement:', prompt.trim())
    console.log('   Current component:', currentComponent)

    try {
      // Add timeout to prevent hanging
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

      const response = await fetch('/api/playground/refine-component', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refinementPrompt: prompt.trim(),
          currentComponent
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      console.log('✅ Refinement API response:', response.status, response.statusText)

      if (!response.ok) {
        console.error('❌ Response not OK:', response.status)
        let errorData
        try {
          errorData = await response.json()
          console.error('❌ API error data:', errorData)
        } catch (e) {
          console.error('❌ Could not parse error response')
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      console.log('📥 Parsing response JSON...')
      const data = await response.json()
      console.log('📦 Refinement result:', JSON.stringify(data, null, 2))

      if (data.success) {
        console.log('✅ Success! Setting result state...')
        setResult(data)
        console.log('✨ Scheduling onRefine call in 1 second...')
        
        // Show result briefly, then apply
        const timeoutId = setTimeout(() => {
          console.log('🎯 Now calling onRefine with data:', data)
          try {
            onRefine({
              ...data,
              refinementPrompt: prompt.trim() // Include the original prompt
            })
            console.log('✅ onRefine called successfully')
          } catch (err) {
            console.error('❌ Error calling onRefine:', err)
          }
        }, 1000)
        console.log('⏰ Timeout scheduled, ID:', timeoutId)
      } else {
        console.error('❌ Refinement failed (success=false):', data.error)
        setError(data.error || 'Failed to refine component')
      }
    } catch (err) {
      console.error('❌ Refinement exception:', err)
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Request timed out. Please try again.')
      } else {
        setError(err instanceof Error ? err.message : 'Network error. Please try again.')
      }
    } finally {
      setIsRefining(false)
      console.log('🏁 Refinement complete')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleRefine()
    } else if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm"
      onClick={(e) => {
        // Close when clicking backdrop
        if (e.target === e.currentTarget) {
          onCancel()
        }
      }}
    >
      <div className="w-full max-w-md mx-4 p-4 bg-white rounded-lg shadow-xl border-2 border-purple-200">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-purple-100 rounded">
            <Wand2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900">Refine Component</h3>
            <p className="text-xs text-gray-500">{currentComponent.title}</p>
          </div>
          <button
            onClick={onCancel}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., 'show only January' or 'change to bar chart'"
              className="flex-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              autoFocus
              disabled={isRefining || !!result}
            />
            {isRefining ? (
              <Button
                onClick={() => {
                  console.log('❌ User cancelled refinement')
                  setIsRefining(false)
                  onCancel()
                }}
                size="sm"
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                Cancel
              </Button>
            ) : (
              <Button
                onClick={handleRefine}
                disabled={!prompt.trim() || !!result}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Examples */}
          {!error && !result && !isRefining && (
            <div className="text-xs text-gray-500">
              <span className="font-medium">Examples:</span> "show only January", "top 5", "change to bar chart"
            </div>
          )}
          
          {/* Loading Status */}
          {isRefining && !result && !error && (
            <div className="text-xs text-purple-600 flex items-center gap-2">
              <Sparkles className="w-3 h-3 animate-pulse" />
              <span>Calling AI... (check console for details)</span>
            </div>
          )}

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-2 bg-red-50 border border-red-200 rounded-md flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-red-900">Error</p>
                  <p className="text-xs text-red-700 mt-0.5">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Display */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-2 bg-green-50 border border-green-200 rounded-md flex items-start gap-2"
              >
                <Sparkles className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-green-900">Applying changes...</p>
                  <p className="text-xs text-green-700 mt-0.5">{result.reasoning}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

