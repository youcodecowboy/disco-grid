"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { EnrichmentQuestion } from "@/lib/playbooks/llm-enrichment/question-generator"

interface PlaybookEnrichmentQuestionsProps {
  questions: EnrichmentQuestion[]
  onAnswer: (questionId: string, answer: string) => void
  onSkip: (questionId: string) => void
  onAcceptIncomplete: () => void
  className?: string
}

export function PlaybookEnrichmentQuestions({
  questions,
  onAnswer,
  onSkip,
  onAcceptIncomplete,
  className
}: PlaybookEnrichmentQuestionsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [skipped, setSkipped] = useState<Set<string>>(new Set())

  if (questions.length === 0) {
    return null
  }

  const currentQuestion = questions[currentIndex]
  const isAnswered = !!answers[currentQuestion.id]
  const isSkipped = skipped.has(currentQuestion.id)
  const progress = ((currentIndex + 1) / questions.length) * 100
  const answeredCount = Object.keys(answers).length
  const skippedCount = skipped.size

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }))
    onAnswer(currentQuestion.id, answer)
  }

  const handleSkip = () => {
    setSkipped(prev => new Set(prev).add(currentQuestion.id))
    onSkip(currentQuestion.id)
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleComplete = () => {
    onAcceptIncomplete()
  }

  const canFinish = answeredCount + skippedCount === questions.length
  const isLastQuestion = currentIndex === questions.length - 1
  const currentAnswer = answers[currentQuestion.id]
  const hasAnswer = currentAnswer && currentAnswer.trim() !== ''
  const canContinue = isLastQuestion && (hasAnswer || isSkipped || canFinish)

  return (
    <div className={cn("rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/30 p-6", className)}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <div className="rounded-xl bg-purple-100 p-2 text-purple-600">
          <MessageSquare className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-slate-900">Complete Your Playbook</h3>
            <span className="text-sm text-slate-500">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>
          <p className="text-sm text-slate-600">
            {currentQuestion.playTitle && (
              <span className="font-medium">Play: {currentQuestion.playTitle}</span>
            )}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
          <span>Progress: {answeredCount} answered, {skippedCount} skipped</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-purple-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className={cn(
            "px-2 py-0.5 rounded-full text-xs font-semibold",
            currentQuestion.priority === 'critical' ? "bg-rose-100 text-rose-700" :
            currentQuestion.priority === 'high' ? "bg-orange-100 text-orange-700" :
            currentQuestion.priority === 'medium' ? "bg-amber-100 text-amber-700" :
            "bg-slate-100 text-slate-700"
          )}>
            {currentQuestion.priority.toUpperCase()}
          </span>
          {currentQuestion.required && (
            <span className="text-xs text-slate-500">Required</span>
          )}
        </div>
        <p className="text-base font-medium text-slate-900 mb-4">
          {currentQuestion.question}
        </p>
      </div>

      {/* Answer input */}
      <div className="mb-6">
        {currentQuestion.options && currentQuestion.options.length > 0 ? (
          // Multiple choice options
          <div className="space-y-2">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className={cn(
                  "w-full text-left rounded-xl border-2 p-4 transition-all",
                  answers[currentQuestion.id] === option
                    ? "border-purple-500 bg-purple-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-50/50"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-900">{option}</span>
                  {answers[currentQuestion.id] === option && (
                    <CheckCircle2 className="h-5 w-5 text-purple-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          // Text input
          <input
            type="text"
            value={currentAnswer || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder="Enter your answer..."
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="rounded-full text-slate-600"
          >
            Skip
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {canFinish && !isLastQuestion && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleComplete}
              className="rounded-full text-slate-600"
            >
              Finish with gaps
            </Button>
          )}
          {isLastQuestion ? (
            <Button
              onClick={handleComplete}
              disabled={!canContinue && !canFinish}
              className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
            >
              Complete Playbook
              <CheckCircle2 className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={currentIndex === questions.length - 1}
              className="rounded-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

