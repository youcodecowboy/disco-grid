"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, CheckCircle } from 'lucide-react'

interface AIGenerationProgressProps {
  isGenerating: boolean
  onComplete?: () => void
}

const GENERATION_STEPS = [
  { message: "Understanding your request...", duration: 300 },
  { message: "Selecting component type...", duration: 400 },
  { message: "Generating visualization...", duration: 400 },
  { message: "Populating data...", duration: 400 },
]

export function AIGenerationProgress({ isGenerating, onComplete }: AIGenerationProgressProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  
  useEffect(() => {
    if (!isGenerating) {
      setCurrentStep(0)
      setProgress(0)
      setIsComplete(false)
      return
    }
    
    console.log('🎬 [Progress] Animation started')
    
    let stepTimer: NodeJS.Timeout
    let progressTimer: NodeJS.Timeout
    let currentStepIndex = 0
    let currentProgress = 0
    
    const runStep = () => {
      if (currentStepIndex < GENERATION_STEPS.length) {
        setCurrentStep(currentStepIndex)
        
        const step = GENERATION_STEPS[currentStepIndex]
        const progressPerStep = 100 / GENERATION_STEPS.length
        const targetProgress = (currentStepIndex + 1) * progressPerStep
        
        // Smoothly update progress
        const progressIncrement = (targetProgress - currentProgress) / (step.duration / 16)
        
        progressTimer = setInterval(() => {
          currentProgress = Math.min(currentProgress + progressIncrement, targetProgress)
          setProgress(currentProgress)
        }, 16)
        
        stepTimer = setTimeout(() => {
          clearInterval(progressTimer)
          currentStepIndex++
          
          if (currentStepIndex >= GENERATION_STEPS.length) {
            console.log('✅ [Progress] All steps complete, showing success')
            setProgress(100)
            setIsComplete(true)
            
            // Call onComplete after showing success state
            setTimeout(() => {
              console.log('🎉 [Progress] Calling onComplete callback')
              onComplete?.()
            }, 500)
          } else {
            console.log(`📍 [Progress] Step ${currentStepIndex} complete, moving to next`)
            runStep()
          }
        }, step.duration)
      }
    }
    
    runStep()
    
    return () => {
      clearTimeout(stepTimer)
      clearInterval(progressTimer)
    }
  }, [isGenerating, onComplete])
  
  if (!isGenerating) return null
  
  return (
    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
      <div className="w-full max-w-md px-8">
        {/* Icon */}
        <motion.div
          className="flex justify-center mb-6"
          animate={isComplete ? {} : { rotate: 360 }}
          transition={isComplete ? {} : { duration: 2, repeat: Infinity, ease: "linear" }}
        >
          {isComplete ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              <CheckCircle className="w-12 h-12 text-green-500" />
            </motion.div>
          ) : (
            <Sparkles className="w-12 h-12 text-blue-600" />
          )}
        </motion.div>
        
        {/* Message */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <p className="text-base font-medium text-gray-900">
            {isComplete ? "✨ Component generated!" : GENERATION_STEPS[currentStep]?.message}
          </p>
        </motion.div>
        
        {/* Progress Bar */}
        <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut" }}
          />
        </div>
        
        {/* Progress Percentage */}
        <div className="text-center mt-2">
          <span className="text-sm font-medium text-gray-600">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  )
}

