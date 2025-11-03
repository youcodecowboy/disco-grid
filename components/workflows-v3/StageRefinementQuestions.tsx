"use client"

import { useState, useEffect } from "react"
import { WorkflowStageV3 } from "@/lib/workflows-v3/types"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles, CheckCircle2 } from "lucide-react"

interface StageRefinementQuestionsProps {
  stage: WorkflowStageV3
  onStageUpdate: (updatedStage: WorkflowStageV3) => void
}

interface RefinementQuestion {
  id: string
  question: string
  field: string // Which field this question is trying to fill
  context: string // What's missing
}

export function StageRefinementQuestions({ stage, onStageUpdate }: StageRefinementQuestionsProps) {
  const [questions, setQuestions] = useState<RefinementQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answer, setAnswer] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Analyze the stage to determine what questions to ask
  const analyzeStage = () => {
    const missingQuestions: RefinementQuestion[] = []

    // Check if team assignment is missing
    if (!stage.teamId || stage.teamId === '') {
      missingQuestions.push({
        id: 'team',
        question: `Which team or department is responsible for the "${stage.name}" stage?`,
        field: 'teamId',
        context: 'No team assigned'
      })
    }

    // Check if inputs are missing or vague
    if (!stage.inputs || stage.inputs.length === 0) {
      missingQuestions.push({
        id: 'inputs',
        question: `What input or action is required to BEGIN the "${stage.name}" stage? (e.g., QR scan, form submission, photo upload)`,
        field: 'inputs',
        context: 'No inputs defined'
      })
    }

    // Check if outputs are missing
    if (!stage.outputs || stage.outputs.length === 0) {
      missingQuestions.push({
        id: 'outputs',
        question: `What output or task marks the COMPLETION of the "${stage.name}" stage?`,
        field: 'outputs',
        context: 'No outputs defined'
      })
    }

    // Check if dependencies might be needed
    if (!stage.dependencies || stage.dependencies.length === 0) {
      missingQuestions.push({
        id: 'dependencies',
        question: `Are there any conditions or dependencies that must be met before "${stage.name}" can start? (e.g., previous tasks, approvals, time delays, material arrival). Answer "none" if there are no dependencies.`,
        field: 'dependencies',
        context: 'No dependencies defined'
      })
    }

    // Check if estimated duration is missing
    if (!stage.estimatedDuration || stage.estimatedDuration === 0) {
      missingQuestions.push({
        id: 'duration',
        question: `How long does the "${stage.name}" stage typically take? (Provide a number in minutes)`,
        field: 'estimatedDuration',
        context: 'No duration estimate'
      })
    }

    return missingQuestions
  }

  // Run analysis when stage changes
  useEffect(() => {
    const newQuestions = analyzeStage()
    setQuestions(newQuestions)
    setCurrentQuestionIndex(0)
    setAnswer("")
  }, [stage.id]) // Only re-analyze when stage ID changes

  // Process the user's answer
  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      alert("Please provide an answer")
      return
    }

    const currentQuestion = questions[currentQuestionIndex]
    setIsProcessing(true)

    try {
      // Call LLM to interpret the answer and update the stage
      const response = await fetch('/api/nlp/workflow/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage,
          question: currentQuestion.question,
          answer: answer.trim(),
          field: currentQuestion.field
        })
      })

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to process answer')
      }

      console.log('✅ Answer processed:', data)

      // Update the stage with the new information
      onStageUpdate(data.updatedStage)

      // Move to next question or finish
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setAnswer("")
      } else {
        // All questions answered, re-analyze to see if we need more
        const newQuestions = analyzeStage()
        if (newQuestions.length > 0) {
          setQuestions(newQuestions)
          setCurrentQuestionIndex(0)
          setAnswer("")
        } else {
          // No more questions
          setQuestions([])
        }
      }
    } catch (error) {
      console.error("Failed to process answer:", error)
      alert(error instanceof Error ? error.message : "Failed to process answer. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmitAnswer()
    }
  }

  // Don't render if no questions
  if (questions.length === 0) {
    return (
      <div className="px-6 py-3 border-t border-green-200 bg-green-50">
        <div className="flex items-center gap-2 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4" />
          <span className="font-medium">Stage information complete</span>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="px-6 py-4 border-t border-purple-200 bg-purple-50">
      {/* Progress indicator */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-purple-600 mb-1">
          <span className="font-medium flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Refinement Questions
          </span>
          <span>{currentQuestionIndex + 1} of {questions.length}</span>
        </div>
        <div className="w-full bg-purple-200 rounded-full h-1.5">
          <div 
            className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current question */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-purple-900 mb-1">
            {currentQuestion.question}
          </label>
          <p className="text-xs text-purple-600 mb-2">
            Missing: {currentQuestion.context}
          </p>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your answer..."
            className="flex-1 px-3 py-2 border border-purple-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isProcessing}
          />
          <Button
            onClick={handleSubmitAnswer}
            disabled={isProcessing || !answer.trim()}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing
              </>
            ) : (
              <>
                Submit
                <span className="ml-2 text-xs opacity-70">⌘↵</span>
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-purple-600">
          Press <kbd className="px-1.5 py-0.5 bg-purple-200 rounded text-purple-800">Cmd+Enter</kbd> to submit
        </p>
      </div>
    </div>
  )
}













