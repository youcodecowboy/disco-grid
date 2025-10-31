"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare, ChevronLeft, ChevronRight, XCircle, CheckCircle2, ArrowRight, Users, Link2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { QrCode, FileText, Camera, MapPin, Clock, UserCheck, Ruler, Hash, FileSignature } from "lucide-react"
import type { StageInputType, StageOutputType } from "@/lib/workflows-v3/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface EnrichmentQuestion {
  id: string
  question: string
  type: 'input' | 'output' | 'team' | 'dependency' | 'description' | 'general'
  stageIndex?: number
  stageName?: string
  limboZoneIndex?: number
  field?: string
  options?: string[]
  required: boolean
  priority: 'critical' | 'high' | 'medium' | 'low'
}

interface WorkflowEnrichmentQuestionsProps {
  questions: EnrichmentQuestion[]
  onAnswer: (questionId: string, answer: string) => void
  onSkip: (questionId: string) => void
  onAcceptIncomplete: () => void
  className?: string
}

const INPUT_TYPES = [
  { value: "qr_scan", label: "QR Scan", icon: QrCode, description: "Scan QR code to begin" },
  { value: "form", label: "Form", icon: FileText, description: "Fill out form data" },
  { value: "photo", label: "Photo", icon: Camera, description: "Take a photo" },
  { value: "location_check", label: "Location Check", icon: MapPin, description: "Verify location" },
  { value: "time_delay", label: "Time Delay", icon: Clock, description: "Wait for time" },
]

const OUTPUT_TYPES = [
  { value: "qr_scan", label: "QR Scan", icon: QrCode, description: "Scan to mark complete" },
  { value: "form_submit", label: "Form Submit", icon: FileText, description: "Submit form data" },
  { value: "photo", label: "Photo", icon: Camera, description: "Take completion photo" },
  { value: "approval", label: "Approval", icon: UserCheck, description: "Get approval/sign-off" },
  { value: "measurement", label: "Measurement", icon: Ruler, description: "Record measurements" },
  { value: "count", label: "Count", icon: Hash, description: "Count items" },
  { value: "sign_off", label: "Sign Off", icon: FileSignature, description: "Digital signature" },
]

export function WorkflowEnrichmentQuestions({
  questions,
  onAnswer,
  onSkip,
  onAcceptIncomplete,
  className
}: WorkflowEnrichmentQuestionsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [skipped, setSkipped] = useState<Set<string>>(new Set())
  const [isNewTask, setIsNewTask] = useState(false)
  const [newTaskName, setNewTaskName] = useState('')
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    assignedTeam: '',
    dueDate: '',
    isRecurring: false,
    recurringPattern: '',
    priority: 'medium' as 'critical' | 'high' | 'medium' | 'low'
  })
  const [taskCreated, setTaskCreated] = useState(false)

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
    
    // Auto-advance to next question
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      // Reset new task state when moving to next question
      setIsNewTask(false)
      setNewTaskName('')
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      // Reset new task state when going back
      setIsNewTask(false)
      setNewTaskName('')
    }
  }

  const handleComplete = () => {
    // User wants to finish - accept incomplete and proceed
    onAcceptIncomplete()
  }

  const canFinish = answeredCount + skippedCount === questions.length
  const isLastQuestion = currentIndex === questions.length - 1
  
  // Check if current question is answered (works for all question types)
  const currentAnswer = answers[currentQuestion.id]
  const hasAnswer = currentAnswer && (typeof currentAnswer === 'string' ? currentAnswer.trim() !== '' : true)
  const canContinue = isLastQuestion && (hasAnswer || isSkipped || canFinish)

  // Render input type selector
  if (currentQuestion.type === 'input') {
    return (
      <div className={cn("rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/30 p-6", className)}>
        {/* Header */}
        <div className="flex items-start gap-3 mb-6">
          <div className="rounded-xl bg-blue-100 p-2 text-blue-600">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-slate-900">Complete Your Workflow</h3>
              <span className="text-sm text-slate-500">
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>
            <p className="text-sm text-slate-600">
              {currentQuestion.stageName && (
                <span className="font-medium">Stage: {currentQuestion.stageName}</span>
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
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <p className="text-base font-medium text-slate-900 mb-4">
            {currentQuestion.question}
          </p>
          <p className="text-sm text-slate-600">
            Select how workers will START this stage:
          </p>
        </div>

        {/* Input type selection grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {INPUT_TYPES.map(type => {
            const Icon = type.icon
            const isSelected = answers[currentQuestion.id] === type.value
            return (
              <button
                key={type.value}
                onClick={() => handleAnswer(type.value)}
                className={cn(
                  "flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all",
                  isSelected
                    ? "border-blue-500 bg-blue-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
                )}
              >
                <div className={cn(
                  "rounded-lg p-2 flex-shrink-0",
                  isSelected ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-600"
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900 mb-1">
                    {type.label}
                  </div>
                  <div className="text-xs text-slate-500">
                    {type.description}
                  </div>
                </div>
                {isSelected && (
                  <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                )}
              </button>
            )
          })}
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
                Complete Workflow
                <CheckCircle2 className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
                className="rounded-full bg-blue-600 hover:bg-blue-700 text-white"
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

  // Render output type selector
  if (currentQuestion.type === 'output') {
    return (
      <div className={cn("rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/30 p-6", className)}>
        {/* Header */}
        <div className="flex items-start gap-3 mb-6">
          <div className="rounded-xl bg-blue-100 p-2 text-blue-600">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-slate-900">Complete Your Workflow</h3>
              <span className="text-sm text-slate-500">
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>
            <p className="text-sm text-slate-600">
              {currentQuestion.stageName && (
                <span className="font-medium">Stage: {currentQuestion.stageName}</span>
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
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <p className="text-base font-medium text-slate-900 mb-4">
            {currentQuestion.question}
          </p>
          <p className="text-sm text-slate-600">
            Select how workers will COMPLETE this stage:
          </p>
        </div>

        {/* Output type selection grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {OUTPUT_TYPES.map(type => {
            const Icon = type.icon
            const isSelected = answers[currentQuestion.id] === type.value
            return (
              <button
                key={type.value}
                onClick={() => handleAnswer(type.value)}
                className={cn(
                  "flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all",
                  isSelected
                    ? "border-emerald-500 bg-emerald-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50"
                )}
              >
                <div className={cn(
                  "rounded-lg p-2 flex-shrink-0",
                  isSelected ? "bg-emerald-600 text-white" : "bg-emerald-100 text-emerald-600"
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900 mb-1">
                    {type.label}
                  </div>
                  <div className="text-xs text-slate-500">
                    {type.description}
                  </div>
                </div>
                {isSelected && (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                )}
              </button>
            )
          })}
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
                Complete Workflow
                <CheckCircle2 className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
                className="rounded-full bg-blue-600 hover:bg-blue-700 text-white"
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

  // Mock tasks/events that "already exist" in the system
  const MOCK_EXISTING_TASKS = [
    "Fabric Inspection",
    "Material Preparation",
    "Order Review",
    "Quality Check",
    "Machine Setup",
    "Manager Approval",
    "Supervisor Sign-off",
    "Client Approval",
    "Material Delivery",
    "Equipment Maintenance",
    "Training Session",
    "Safety Inspection",
    "Inventory Check",
    "Document Review",
    "Budget Approval"
  ]

  const MOCK_EXISTING_EVENTS = [
    "Material Delivery Event",
    "Machine Maintenance Event",
    "Training Session Event",
    "Production Start Event",
    "Quality Audit Event"
  ]

  // Render dependency questions with dropdown + new task toggle
  if (currentQuestion.type === 'dependency') {
    const currentAnswer = answers[currentQuestion.id] || ''
    const dependencyIsAnswered = !!currentAnswer

    const handleDependencySelect = (value: string) => {
      if (value === '__new__') {
        setIsNewTask(true)
      } else {
        setIsNewTask(false)
        handleAnswer(value)
      }
    }

  const handleNewTaskSubmit = () => {
    // Validate required fields
    if (!newTaskData.title.trim()) {
      return
    }
    
    // Format task data as JSON string for answer
    const taskAnswer = JSON.stringify({
      title: newTaskData.title,
      description: newTaskData.description,
      assignedTo: newTaskData.assignedTo,
      assignedTeam: newTaskData.assignedTeam,
      dueDate: newTaskData.dueDate,
      isRecurring: newTaskData.isRecurring,
      recurringPattern: newTaskData.recurringPattern,
      priority: newTaskData.priority
    })
    
    handleAnswer(taskAnswer)
    
    // Add to mock list for future questions (in memory)
    if (!MOCK_EXISTING_TASKS.includes(newTaskData.title.trim())) {
      MOCK_EXISTING_TASKS.push(newTaskData.title.trim())
    }
    
    setTaskCreated(true)
    setIsNewTask(false)
  }

    return (
      <div className={cn("rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/30 p-6", className)}>
        {/* Header */}
        <div className="flex items-start gap-3 mb-6">
          <div className="rounded-xl bg-blue-100 p-2 text-blue-600">
            <Link2 className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-slate-900">Complete Your Workflow</h3>
              <span className="text-sm text-slate-500">
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>
            <p className="text-sm text-slate-600">
              {currentQuestion.stageName && (
                <span className="font-medium">Stage: {currentQuestion.stageName}</span>
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
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <p className="text-base font-medium text-slate-900 mb-4">
            {currentQuestion.question}
          </p>
          <p className="text-sm text-slate-600">
            Select an existing task or event, or create a new one:
          </p>
        </div>

        {/* Dependency selection */}
        <div className="mb-6 space-y-4">
          {!isNewTask && !currentAnswer ? (
            <>
              {/* Existing tasks dropdown */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select existing task or event:
                </label>
                <select
                  value={currentAnswer || ''}
                  onChange={(e) => handleDependencySelect(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select a task or event --</option>
                  <optgroup label="Tasks">
                    {MOCK_EXISTING_TASKS.map(task => (
                      <option key={task} value={task}>{task}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Events">
                    {MOCK_EXISTING_EVENTS.map(event => (
                      <option key={event} value={event}>{event}</option>
                    ))}
                  </optgroup>
                  <option value="__new__">➕ Create new task...</option>
                </select>
              </div>
            </>
          ) : isNewTask ? (
            <>
              {/* New task creation form */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-700">
                    Create new task:
                  </label>
                  <button
                    onClick={() => {
                      setIsNewTask(false)
                      setNewTaskData({
                        title: '',
                        description: '',
                        assignedTo: '',
                        assignedTeam: '',
                        dueDate: '',
                        isRecurring: false,
                        recurringPattern: '',
                        priority: 'medium'
                      })
                      setTaskCreated(false)
                    }}
                    className="text-sm text-slate-500 hover:text-slate-700"
                  >
                    ← Back to selection
                  </button>
                </div>

                <div className="space-y-3 bg-white rounded-xl border border-slate-200 p-4">
                  {/* Task Title */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Task Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newTaskData.title}
                      onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
                      placeholder="e.g., Material Quality Check"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={newTaskData.description}
                      onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })}
                      placeholder="What needs to be done?"
                      rows={3}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  {/* Assigned To - Team or Person */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Assigned Team
                      </label>
                      <input
                        type="text"
                        value={newTaskData.assignedTeam}
                        onChange={(e) => setNewTaskData({ ...newTaskData, assignedTeam: e.target.value })}
                        placeholder="e.g., Quality Team"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Assigned To (Person)
                      </label>
                      <input
                        type="text"
                        value={newTaskData.assignedTo}
                        onChange={(e) => setNewTaskData({ ...newTaskData, assignedTo: e.target.value })}
                        placeholder="e.g., John Doe"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Due Date */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={newTaskData.dueDate}
                      onChange={(e) => setNewTaskData({ ...newTaskData, dueDate: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={newTaskData.priority}
                      onChange={(e) => setNewTaskData({ ...newTaskData, priority: e.target.value as any })}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>

                  {/* Recurring */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newTaskData.isRecurring}
                        onChange={(e) => setNewTaskData({ ...newTaskData, isRecurring: e.target.checked })}
                        className="rounded border-slate-300"
                      />
                      <span className="text-sm font-medium text-slate-700">Recurring Task</span>
                    </label>
                    {newTaskData.isRecurring && (
                      <select
                        value={newTaskData.recurringPattern}
                        onChange={(e) => setNewTaskData({ ...newTaskData, recurringPattern: e.target.value })}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select pattern...</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="custom">Custom</option>
                      </select>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-2">
                    <Button
                      onClick={handleNewTaskSubmit}
                      disabled={!newTaskData.title.trim()}
                      className="rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Create Task
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : taskCreated && currentAnswer ? (
            <>
              {/* Task created confirmation */}
              <div className="rounded-xl border-2 border-emerald-500 bg-emerald-50 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-emerald-900 mb-1">
                      Task created successfully!
                    </p>
                    {(() => {
                      try {
                        const taskData = JSON.parse(currentAnswer)
                        return (
                          <div className="text-sm text-emerald-700 space-y-1">
                            <p><strong>Title:</strong> {taskData.title}</p>
                            {taskData.assignedTeam && <p><strong>Team:</strong> {taskData.assignedTeam}</p>}
                            {taskData.assignedTo && <p><strong>Assigned to:</strong> {taskData.assignedTo}</p>}
                            {taskData.dueDate && <p><strong>Due:</strong> {new Date(taskData.dueDate).toLocaleDateString()}</p>}
                          </div>
                        )
                      } catch {
                        return <p className="text-sm text-emerald-700">{currentAnswer}</p>
                      }
                    })()}
                  </div>
                  <button
                    onClick={() => {
                      handleAnswer('')
                      setTaskCreated(false)
                      setIsNewTask(true)
                    }}
                    className="text-sm text-emerald-600 hover:text-emerald-700"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Selected task display */}
              <div className="rounded-xl border-2 border-blue-500 bg-blue-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Selected:</p>
                      <p className="text-sm text-slate-600">{currentAnswer}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleAnswer('')
                      setIsNewTask(false)
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Change
                  </button>
                </div>
              </div>
            </>
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
              disabled={!hasAnswer && !isSkipped && !canFinish}
              className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
            >
              Complete Workflow
              <CheckCircle2 className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={currentIndex === questions.length - 1}
              className="rounded-full bg-blue-600 hover:bg-blue-700 text-white"
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

  // Render general/description questions with text input (fallback)
  return (
    <div className={cn("rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/30 p-6", className)}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <div className="rounded-xl bg-blue-100 p-2 text-blue-600">
          <MessageSquare className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-slate-900">Complete Your Workflow</h3>
            <span className="text-sm text-slate-500">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>
          <p className="text-sm text-slate-600">
            {currentQuestion.stageName && (
              <span className="font-medium">Stage: {currentQuestion.stageName}</span>
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
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <p className="text-base font-medium text-slate-900 mb-4">
          {currentQuestion.question}
        </p>
      </div>

      {/* Text input */}
      <div className="mb-6">
        <input
          type="text"
          value={answers[currentQuestion.id] || ''}
          onChange={(e) => handleAnswer(e.target.value)}
          placeholder="Enter your answer..."
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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
          {canFinish && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleComplete}
              className="rounded-full text-slate-600"
            >
              Finish with gaps
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
            className="rounded-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
