"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { matchPromptToComponent, getComponentDisplayName } from '@/app/playground/lib/keywordMatcher'
import { AIGenerationProgress } from './AIGenerationProgress'
import type { MatchResult } from '@/app/playground/lib/keywordMatcher'

interface AIInputBlockProps {
  onGenerate?: (result: MatchResult & { prompt: string }) => void
  onPromptChange?: (prompt: string, match: MatchResult | null) => void
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
  const [detectedComponent, setDetectedComponent] = useState<MatchResult | null>(null)
  const [currentExample, setCurrentExample] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [pendingResult, setPendingResult] = useState<(MatchResult & { prompt: string }) | null>(null)
  
  // Rotate example prompts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExample((prev) => (prev + 1) % EXAMPLE_PROMPTS.length)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])
  
  // Detect component as user types
  useEffect(() => {
    if (prompt.trim().length > 3) {
      const match = matchPromptToComponent(prompt)
      setDetectedComponent(match)
      onPromptChange?.(prompt, match)
    } else {
      setDetectedComponent(null)
      onPromptChange?.(prompt, null)
    }
  }, [prompt, onPromptChange])
  
  const handleGenerate = () => {
    if (!prompt.trim() || !detectedComponent) return
    
    const result = {
      ...detectedComponent,
      prompt: prompt.trim()
    }
    
    // Store the result and start the progress animation
    setPendingResult(result)
    setIsGenerating(true)
  }
  
  const handleGenerationComplete = () => {
    // Call the actual onGenerate callback after the animation completes
    if (pendingResult) {
      onGenerate?.(pendingResult)
    }
    
    // Reset state
    setIsGenerating(false)
    setPendingResult(null)
    setPrompt('')
    setDetectedComponent(null)
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
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={EXAMPLE_PROMPTS[currentExample]}
            className="w-full min-h-[120px] p-4 pr-12 bg-white border-2 border-gray-200 rounded-lg 
                     focus:outline-none focus:border-blue-500 resize-none
                     text-base text-gray-900 placeholder:text-gray-400
                     transition-colors duration-200"
            autoFocus
          />
          
          {/* Detected Component Badge */}
          <AnimatePresence>
            {detectedComponent && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                className="absolute top-2 right-2 px-3 py-1 bg-blue-100 text-blue-700 
                         text-xs font-medium rounded-full flex items-center gap-1"
              >
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                {getComponentDisplayName(detectedComponent.componentType)}
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
            disabled={!prompt.trim() || !detectedComponent}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 
                     hover:to-purple-700 text-white font-medium px-6"
          >
            Generate
            <Send className="w-4 h-4 ml-2" />
          </Button>
        </div>
        
        {/* Examples hint */}
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
      </div>
    </div>
  )
}

