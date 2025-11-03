'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataSourcePicker } from '@/components/dashboard-generation/DataSourcePicker'
import {
    generateFollowUpQuestions,
    canGenerateDashboard,
    formatAnswersForAPI,
    type Question,
    type Answer
} from '@/lib/dashboard-generation/questions'

interface DashboardCreationWizardProps {
  dashboardId: string
  dashboardName: string
  onComplete: (dashboardState: any) => void
}

export function DashboardCreationWizard({
  dashboardId,
  dashboardName,
  onComplete
}: DashboardCreationWizardProps) {
  const [step, setStep] = useState<'initial' | 'questions' | 'generating'>('initial')
  const [initialPrompt, setInitialPrompt] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Answer[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentQuestion = questions[currentQuestionIndex]

  const handleInitialSubmit = () => {
    if (!initialPrompt.trim()) return

    // Generate follow-up questions based on the initial prompt
    const followUpQuestions = generateFollowUpQuestions(initialPrompt)
    setQuestions(followUpQuestions)
    setStep('questions')
  }

  const handleAnswer = (value: string | string[]) => {
    if (!currentQuestion) return

    // Update or add answer
    const existingIndex = answers.findIndex(a => a.questionId === currentQuestion.id)
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      value
    }

    if (existingIndex >= 0) {
      const updatedAnswers = [...answers]
      updatedAnswers[existingIndex] = newAnswer
      setAnswers(updatedAnswers)
    } else {
      setAnswers([...answers, newAnswer])
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const canProceed = () => {
    if (!currentQuestion) return false
    
    const answer = answers.find(a => a.questionId === currentQuestion.id)
    
    if (currentQuestion.required) {
      return answer && answer.value && (
        Array.isArray(answer.value) ? answer.value.length > 0 : answer.value.trim().length > 0
      )
    }
    
    return true
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setStep('generating')
    setError(null)

    try {
      const formattedAnswers = formatAnswersForAPI(initialPrompt, answers)
      
      const response = await fetch('/api/dashboard/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dashboardId,
          dashboardName,
          ...formattedAnswers
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate dashboard')
      }

      const result = await response.json()
      
      if (result.success) {
        // Wait a moment for effect, then complete
        setTimeout(() => {
          onComplete(result.state)
        }, 1500)
      } else {
        throw new Error(result.error || 'Failed to generate dashboard')
      }
    } catch (err) {
      console.error('Dashboard generation error:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate dashboard')
      setIsGenerating(false)
      setStep('questions')
    }
  }

  const renderQuestionInput = (question: Question) => {
    const currentAnswer = answers.find(a => a.questionId === question.id)

    switch (question.type) {
      case 'text':
        return (
          <textarea
            value={currentAnswer?.value as string || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder={question.placeholder}
            className="w-full min-h-[100px] p-4 bg-white border-2 border-gray-200 rounded-lg 
                     focus:outline-none focus:border-blue-500 resize-none text-base"
            autoFocus
          />
        )

      case 'buttons':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {question.options?.map((option) => {
              const isSelected = currentAnswer?.value === option.value
              return (
                <motion.button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {option.icon && <div className="text-2xl mb-2">{option.icon}</div>}
                  <div className="font-medium text-sm">{option.label}</div>
                </motion.button>
              )
            })}
          </div>
        )

      case 'data-source':
        return (
          <DataSourcePicker
            onSelect={handleAnswer}
            selected={Array.isArray(currentAnswer?.value) ? currentAnswer.value : []}
          />
        )

      default:
        return null
    }
  }

  // Initial prompt screen
  if (step === 'initial') {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-3xl"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 text-blue-600" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create {dashboardName}
            </h1>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-semibold mb-2 text-gray-900">
              What would you like this dashboard to display?
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Describe the components, metrics, and data you want to visualize. 
              Be as specific as possible.
            </p>

            <textarea
              value={initialPrompt}
              onChange={(e) => setInitialPrompt(e.target.value)}
              placeholder="e.g., I want a dashboard showing sales metrics with a revenue chart, top products table, and customer analytics..."
              className="w-full min-h-[150px] p-4 bg-white border-2 border-gray-200 rounded-lg 
                       focus:outline-none focus:border-blue-500 resize-none text-base mb-4"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleInitialSubmit()
                }
              }}
            />

            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Press Cmd/Ctrl + Enter to continue
              </p>
              <Button
                onClick={handleInitialSubmit}
                disabled={!initialPrompt.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 
                         hover:to-purple-700 text-white font-medium px-8"
              >
                Continue
                <Send className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Example prompts */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Sales dashboard with revenue charts and customer tables',
              'Production monitoring with efficiency metrics and timeline',
              'Analytics dashboard showing KPIs and trend visualizations',
              'Inventory overview with stock levels and order tracking'
            ].map((example, i) => (
              <button
                key={i}
                onClick={() => setInitialPrompt(example)}
                className="text-left p-3 bg-white/60 hover:bg-white border border-gray-200 
                         rounded-lg text-sm text-gray-700 transition-colors"
              >
                💡 {example}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  // Questions screen
  if (step === 'questions') {
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100
    const isLastQuestion = currentQuestionIndex === questions.length - 1
    const canGenerate = canGenerateDashboard(answers, questions)

    return (
      <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl"
        >
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(progress)}% complete
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Question card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                {currentQuestion?.question}
              </h2>

              {currentQuestion && renderQuestionInput(currentQuestion)}

              {/* Error message */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex items-center justify-between mt-6">
                <Button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  variant="outline"
                >
                  Previous
                </Button>

                <div className="flex gap-2">
                  {!isLastQuestion && (
                    <Button
                      onClick={handleNext}
                      disabled={!canProceed()}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Next
                    </Button>
                  )}

                  {isLastQuestion && (
                    <Button
                      onClick={handleGenerate}
                      disabled={!canGenerate || isGenerating}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 
                               hover:to-purple-700 text-white font-medium px-8"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          Generate Dashboard
                          <Sparkles className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Answer summary */}
          {answers.length > 0 && (
            <div className="mt-6 p-4 bg-white/60 rounded-lg border border-gray-200">
              <p className="text-xs font-medium text-gray-700 mb-2">Your selections:</p>
              <div className="flex flex-wrap gap-2">
                {answers.map((answer, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    {Array.isArray(answer.value) ? answer.value.join(', ') : answer.value}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    )
  }

  // Generating screen
  if (step === 'generating') {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block mb-6"
          >
            <Sparkles className="w-16 h-16 text-blue-600" />
          </motion.div>

          <h2 className="text-3xl font-bold mb-3 text-gray-900">
            Generating Your Dashboard
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Creating your custom dashboard with AI-powered components based on your requirements...
          </p>

          <div className="flex items-center justify-center gap-2">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 bg-blue-500 rounded-full"
            />
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              className="w-2 h-2 bg-purple-500 rounded-full"
            />
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              className="w-2 h-2 bg-blue-500 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    )
  }

  return null
}









