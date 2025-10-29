"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Send, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getComponentDisplayName } from '@/app/playground/lib/keywordMatcher'
import { AIGenerationProgress } from './AIGenerationProgress'
import type { BlockType } from '@/lib/grid-v2/types'

interface LLMGenerationResult {
  success: boolean
  componentType: BlockType
  confidence: number
  reasoning: string
  config: Record<string, any>
  title: string
  size: { w: number; h: number }
  provenance: 'llm' | 'keyword-fallback'
  model: string
  tokensUsed: number
  error?: string
}

interface AIInputBlockProps {
  onGenerate?: (result: LLMGenerationResult & { prompt: string }) => void
  onPromptChange?: (prompt: string) => void
}

const EXAMPLE_PROMPTS = [
  "Show me a sales trend chart",
  "Create a bar chart comparing products",
  "Display distribution as a pie chart",
  "Add a table of recent orders",
  "Show system health status",
  "Track project progress",
  "Add a KPI card for revenue",
  "Display activity timeline"
]

export function AIInputBlock({ onGenerate, onPromptChange }: AIInputBlockProps) {
  const [prompt, setPrompt] = useState('')
  const [currentExample, setCurrentExample] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCalling, setIsCalling] = useState(false)
  const [pendingResult, setPendingResult] = useState<(LLMGenerationResult & { prompt: string }) | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Rotate example prompts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExample((prev) => (prev + 1) % EXAMPLE_PROMPTS.length)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])
  
  const handleGenerate = async () => {
    if (!prompt.trim() || isCalling) {
      console.log('⚠️ [AI Input] Cannot generate:', { hasPrompt: !!prompt.trim(), isCalling })
      return
    }
    
    console.log('🚀 [AI Input] Starting generation:', prompt.trim())
    setError(null)
    setIsCalling(true)
    
    try {
      console.log('📡 [AI Input] Calling API...')
      
      // Add 30 second timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        console.error('⏱️ [AI Input] Request timeout!')
        controller.abort()
      }, 30000)
      
      const response = await fetch('/api/playground/generate-component', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: prompt.trim()
        }),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      console.log('✅ [AI Input] API response received:', response.status)
      
      const data = await response.json()
      console.log('📦 [AI Input] Response data:', data)
      
      if (data.success) {
        const result = {
          ...data,
          prompt: prompt.trim()
        }
        
        console.log('✨ [AI Input] Success! Starting animation with result:', result)
        // Store the result and start the progress animation
        setPendingResult(result)
        setIsGenerating(true)
        
        // SAFETY: Force complete after 5 seconds if animation doesn't finish
        setTimeout(() => {
          console.warn('⚠️ [AI Input] Animation timeout - forcing completion')
          if (result) {
            onGenerate?.(result)
            setIsGenerating(false)
            setPendingResult(null)
            setPrompt('')
          }
        }, 5000)
      } else {
        console.error('❌ [AI Input] Generation failed:', data.error)
        setError(data.error || 'Failed to generate component')
      }
    } catch (err) {
      console.error('❌ [AI Input] Exception:', err)
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Request timed out. Please try again.')
      } else {
        setError(err instanceof Error ? err.message : 'Network error. Please try again.')
      }
    } finally {
      console.log('🏁 [AI Input] Generation complete, resetting isCalling')
      setIsCalling(false)
    }
  }
  
  const handleGenerationComplete = () => {
    console.log('🎬 [AI Input] Animation complete, calling onGenerate')
    console.log('   Pending result:', pendingResult)
    
    // Call the actual onGenerate callback after the animation completes
    if (pendingResult) {
      console.log('✅ [AI Input] Calling onGenerate callback with result')
      onGenerate?.(pendingResult)
    } else {
      console.warn('⚠️ [AI Input] No pending result to pass to onGenerate')
    }
    
    // Reset state
    console.log('🧹 [AI Input] Resetting state')
    setIsGenerating(false)
    setPendingResult(null)
    setPrompt('')
    setError(null)
  }
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleGenerate()
    }
  }
  
  return (
    <div className="relative h-full w-full flex items-center justify-center p-6">
      {/* Progress Overlay */}
      <AIGenerationProgress 
        isGenerating={isGenerating} 
        onComplete={handleGenerationComplete}
      />
      
      {/* Animated gradient border effect */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50" />
        <motion.div
          className="absolute inset-0 opacity-50"
          animate={{
            background: [
              'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
              'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
              'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            ]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative w-full max-w-2xl">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-center gap-2 mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Sparkles className="w-6 h-6 text-blue-600" />
          </motion.div>
          <h3 className="text-lg font-semibold text-gray-900">
            Describe what you'd like to build
          </h3>
        </motion.div>
        
        {/* Input Area */}
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value)
              onPromptChange?.(e.target.value)
            }}
            onKeyPress={handleKeyPress}
            placeholder={EXAMPLE_PROMPTS[currentExample]}
            className="w-full min-h-[120px] p-4 pr-12 bg-white border-2 border-gray-200 rounded-lg 
                     focus:outline-none focus:border-blue-500 resize-none
                     text-base text-gray-900 placeholder:text-gray-400
                     transition-colors duration-200"
            autoFocus
          />
          
          {/* Loading indicator while calling LLM */}
          <AnimatePresence>
            {isCalling && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                className="absolute top-2 right-2 px-3 py-1 bg-blue-100 text-blue-700 
                         text-xs font-medium rounded-full flex items-center gap-1"
              >
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                Analyzing...
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Actions */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-xs text-gray-500">
            Press Enter to generate
          </div>
          
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isCalling}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 
                     hover:to-purple-700 text-white font-medium px-6 disabled:opacity-50"
          >
            {isCalling ? 'Analyzing...' : 'Generate'}
            <Send className="w-4 h-4 ml-2" />
          </Button>
        </div>
        
        {/* LLM Reasoning Display */}
        <AnimatePresence>
          {pendingResult && !isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200"
            >
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">
                    Selected: {getComponentDisplayName(pendingResult.componentType)}
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    {pendingResult.reasoning}
                  </p>
                  {pendingResult.provenance === 'keyword-fallback' && (
                    <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Keyword fallback (LLM unavailable)
                    </p>
                  )}
                  {pendingResult.provenance === 'llm' && (
                    <p className="text-xs text-green-600 mt-1">
                      ✨ AI-powered selection (confidence: {Math.round(pendingResult.confidence * 100)}%)
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200"
            >
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900">Error</p>
                  <p className="text-xs text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Examples hint */}
        {!pendingResult && !error && (
          <motion.div
            key={currentExample}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 text-center"
          >
            <p className="text-sm text-gray-500">
              <span className="font-medium">Tip:</span> {EXAMPLE_PROMPTS[currentExample]}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

