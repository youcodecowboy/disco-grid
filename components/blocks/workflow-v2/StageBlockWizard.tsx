"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    QrCode,
    Camera,
    FileText,
    CheckCircle,
    Clock,
    Users,
    MapPin,
    ChevronRight,
    ChevronLeft,
    Zap,
    Timer,
    Hash,
    Edit2,
    Settings,
    AlertCircle,
    Check,
    Trash2,
    Sparkles
} from "lucide-react"
import { Step4, Step5 } from "./Step4And5"

type StageType = "process" | "decision" | "input" | "output" | "wait" | "automation"
type ExecutionType = "sequential" | "async" | "parallel"
type InputOutputType = "qr-scan" | "photo" | "form" | "measurement" | "approval" | "timestamp"

interface InputOutput {
  id: string
  type: InputOutputType
  label: string
  required: boolean
}

interface Condition {
  id: string
  field: string
  operator: string
  value: string
  action: string
  targetStage?: string
}

interface Notification {
  id: string
  trigger: "start" | "complete" | "error" | "delay"
  recipients: string[]
  channels: ("app" | "email" | "sms")[]
  message: string
}

interface StageData {
  name: string
  type: StageType
  executionType: ExecutionType
  assignedRole: string
  location: string
  estimatedDuration: number
  inputs: InputOutput[]
  outputs: InputOutput[]
  conditions: Condition[]
  notifications: Notification[]
  errorHandling: "retry" | "skip" | "halt" | "reroute"
  maxRetries: number
  timeoutMinutes: number
}

interface StageBlockWizardProps {
  id: string
  stageNumber?: number
  isConfigured?: boolean
  initialData?: Partial<StageData>
  onComplete?: (data: StageData) => void
  onDelete?: () => void
  isSelected?: boolean
  onSelect?: () => void
  onNodeClick?: (node: "top" | "right" | "bottom" | "left", e: React.MouseEvent) => void
  isConnecting?: boolean
  connectingNode?: "top" | "right" | "bottom" | "left" | null
}

const stageTypeOptions = [
  { value: "process" as const, label: "Process", icon: Settings, gradient: "from-blue-500 to-blue-600" },
  { value: "decision" as const, label: "Decision", icon: AlertCircle, gradient: "from-orange-500 to-orange-600" },
  { value: "input" as const, label: "Input", icon: FileText, gradient: "from-purple-500 to-purple-600" },
  { value: "output" as const, label: "Output", icon: CheckCircle, gradient: "from-green-500 to-green-600" },
  { value: "wait" as const, label: "Wait", icon: Timer, gradient: "from-gray-500 to-gray-600" },
  { value: "automation" as const, label: "Automation", icon: Zap, gradient: "from-pink-500 to-pink-600" },
]

const inputOutputTypes = [
  { value: "qr-scan" as const, label: "QR Scan", icon: QrCode, color: "blue" },
  { value: "photo" as const, label: "Photo", icon: Camera, color: "purple" },
  { value: "form" as const, label: "Form", icon: FileText, color: "green" },
  { value: "measurement" as const, label: "Measure", icon: Hash, color: "orange" },
  { value: "approval" as const, label: "Approve", icon: CheckCircle, color: "emerald" },
  { value: "timestamp" as const, label: "Time", icon: Clock, color: "slate" },
]

const stageColors = {
  process: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", dot: "bg-blue-500" },
  decision: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", dot: "bg-orange-500" },
  input: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", dot: "bg-purple-500" },
  output: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", dot: "bg-green-500" },
  wait: { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-700", dot: "bg-gray-500" },
  automation: { bg: "bg-pink-50", border: "border-pink-200", text: "text-pink-700", dot: "bg-pink-500" },
}

export default function StageBlockWizard({
  id,
  stageNumber,
  isConfigured = false,
  initialData,
  onComplete,
  onDelete,
  isSelected = false,
  onSelect,
  onNodeClick,
  isConnecting = false,
  connectingNode = null,
}: StageBlockWizardProps) {
  const [step, setStep] = useState(isConfigured ? 0 : 1)
  const [data, setData] = useState<StageData>({
    name: initialData?.name || "",
    type: initialData?.type || "process",
    executionType: initialData?.executionType || "sequential",
    assignedRole: initialData?.assignedRole || "",
    location: initialData?.location || "",
    estimatedDuration: initialData?.estimatedDuration || 0,
    inputs: initialData?.inputs || [],
    outputs: initialData?.outputs || [],
    conditions: initialData?.conditions || [],
    notifications: initialData?.notifications || [],
    errorHandling: initialData?.errorHandling || "retry",
    maxRetries: initialData?.maxRetries || 3,
    timeoutMinutes: initialData?.timeoutMinutes || 0,
  })

  const updateData = (updates: Partial<StageData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }

  const handleNext = () => {
    if (step === 5) {
      setStep(0)
      onComplete?.(data)
    } else {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleEdit = () => setStep(1)

  const canProceed = () => {
    if (step === 1) return data.name.trim().length > 0
    return true
  }

  const config = stageTypeOptions.find((t) => t.value === data.type)
  const colors = stageColors[data.type]
  const Icon = config?.icon || Settings

  // Execution type colors
  const executionColors = {
    sequential: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      dot: "bg-blue-500",
      header: "bg-gradient-to-r from-blue-50 to-blue-100",
    },
    async: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-700",
      dot: "bg-purple-500",
      header: "bg-gradient-to-r from-purple-50 to-purple-100",
    },
    parallel: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-700",
      dot: "bg-orange-500",
      header: "bg-gradient-to-r from-orange-50 to-orange-100",
    },
  }

  const execColors = executionColors[data.executionType]

  // Summary View (Configured)
  if (step === 0) {
    return (
      <div
        className={`w-full min-h-[580px] flex flex-col bg-white rounded-2xl shadow-sm transition-all ${
          isSelected ? "ring-2 ring-blue-400 shadow-lg" : "hover:shadow-md"
        }`}
        onClick={onSelect}
      >
        {/* Connection Anchors */}
        <div 
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onNodeClick?.("top", e)
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className={`absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full ${colors.dot} border-2 border-white shadow-md cursor-pointer hover:scale-110 transition-transform z-50 ${isConnecting && connectingNode !== "top" ? "ring-2 ring-blue-400 ring-offset-1 scale-110" : ""}`} 
          style={{ pointerEvents: "auto" }}
          title="Connect from top"
        />
        <div 
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onNodeClick?.("right", e)
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className={`absolute top-1/2 -right-2 -translate-y-1/2 w-6 h-6 rounded-full ${colors.dot} border-2 border-white shadow-md cursor-pointer hover:scale-110 transition-transform z-50 ${isConnecting && connectingNode !== "right" ? "ring-2 ring-blue-400 ring-offset-1 scale-110" : ""}`} 
          style={{ pointerEvents: "auto" }}
          title="Connect from right"
        />
        <div 
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onNodeClick?.("bottom", e)
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full ${colors.dot} border-2 border-white shadow-md cursor-pointer hover:scale-110 transition-transform z-50 ${isConnecting && connectingNode !== "bottom" ? "ring-2 ring-blue-400 ring-offset-1 scale-110" : ""}`} 
          style={{ pointerEvents: "auto" }}
          title="Connect from bottom"
        />
        <div 
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onNodeClick?.("left", e)
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className={`absolute top-1/2 -left-2 -translate-y-1/2 w-6 h-6 rounded-full ${colors.dot} border-2 border-white shadow-md cursor-pointer hover:scale-110 transition-transform z-50 ${isConnecting && connectingNode !== "left" ? "ring-2 ring-blue-400 ring-offset-1 scale-110" : ""}`} 
          style={{ pointerEvents: "auto" }}
          title="Connect from left"
        />

        {/* Header */}
        <div className={`px-6 py-5 border-b ${execColors.border} ${execColors.header} rounded-t-2xl flex-shrink-0`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {stageNumber && (
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${colors.text} bg-white mb-2.5 shadow-sm`}>
                  Stage {stageNumber}
                </div>
              )}
              <h3 className="text-lg font-bold text-gray-900 mb-1.5">{data.name}</h3>
              <div className="flex items-center gap-2.5">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${colors.bg} border ${colors.border}`}>
                  <Icon className={`h-3.5 w-3.5 ${colors.text}`} />
                  <span className={`text-xs font-medium ${colors.text}`}>{config?.label}</span>
                </div>
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${execColors.bg} border ${execColors.border}`}>
                  <div className={`w-2 h-2 rounded-full ${execColors.dot}`}></div>
                  <span className={`text-xs font-medium ${execColors.text} capitalize`}>{data.executionType}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={(e) => {
                  e.stopPropagation()
                  handleEdit()
                }} 
                className="text-xs bg-white"
              >
                <Edit2 className="h-3.5 w-3.5 mr-1.5" />
                Edit
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={(e) => {
                  e.stopPropagation()
                  if (confirm('Delete this stage? This cannot be undone.')) {
                    onDelete?.()
                  }
                }} 
                className="text-xs text-red-600 hover:bg-red-50 hover:border-red-300 bg-white"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content - Clickable Summary Sections */}
        <div className="flex-1 px-6 py-5 space-y-3 overflow-y-auto">
          {/* Basic Info Section */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setStep(1)
            }}
            className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-gray-900">Basic Information</div>
              <Edit2 className="h-4 w-4 text-gray-400 group-hover:text-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              {data.estimatedDuration > 0 && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{data.estimatedDuration}m duration</span>
                </div>
              )}
              {data.assignedRole && (
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  <span className="truncate">{data.assignedRole}</span>
                </div>
              )}
              {data.location && (
                <div className="flex items-center gap-1.5 col-span-2">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="truncate">{data.location}</span>
                </div>
              )}
              <div className={`flex items-center gap-1.5 col-span-2 ${execColors.text}`}>
                <Zap className="h-3.5 w-3.5" />
                <span className="capitalize font-medium">{data.executionType} execution</span>
              </div>
            </div>
          </button>

          {/* Entry Requirements Section */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setStep(2)
            }}
            className="w-full text-left p-4 bg-blue-50 hover:bg-blue-100 rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="text-sm font-semibold text-blue-900">Entry Requirements</div>
                <div className="text-xs font-medium text-blue-600 bg-blue-200 px-2 py-0.5 rounded-full">
                  {data.inputs.length}
                </div>
              </div>
              <Edit2 className="h-4 w-4 text-blue-400 group-hover:text-blue-600" />
            </div>
            {data.inputs.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {data.inputs.map((input) => {
                  const typeInfo = inputOutputTypes.find((t) => t.value === input.type)
                  const InputIcon = typeInfo?.icon || FileText
                  return (
                    <div key={input.id} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      <InputIcon className="h-3 w-3" />
                      {typeInfo?.label}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-xs text-blue-600">No requirements set</div>
            )}
          </button>

          {/* Completion Requirements Section */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setStep(3)
            }}
            className="w-full text-left p-4 bg-green-50 hover:bg-green-100 rounded-xl border-2 border-green-200 hover:border-green-400 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="text-sm font-semibold text-green-900">Completion Requirements</div>
                <div className="text-xs font-medium text-green-600 bg-green-200 px-2 py-0.5 rounded-full">
                  {data.outputs.length}
                </div>
              </div>
              <Edit2 className="h-4 w-4 text-green-400 group-hover:text-green-600" />
            </div>
            {data.outputs.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {data.outputs.map((output) => {
                  const typeInfo = inputOutputTypes.find((t) => t.value === output.type)
                  const OutputIcon = typeInfo?.icon || FileText
                  return (
                    <div key={output.id} className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                      <OutputIcon className="h-3 w-3" />
                      {typeInfo?.label}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-xs text-green-600">No requirements set</div>
            )}
          </button>

          {/* Conditional Logic Section */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setStep(4)
            }}
            className="w-full text-left p-4 bg-purple-50 hover:bg-purple-100 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="text-sm font-semibold text-purple-900">Conditional Logic</div>
                <div className="text-xs font-medium text-purple-600 bg-purple-200 px-2 py-0.5 rounded-full">
                  {data.conditions.length}
                </div>
              </div>
              <Edit2 className="h-4 w-4 text-purple-400 group-hover:text-purple-600" />
            </div>
            {data.conditions.length > 0 ? (
              <div className="space-y-1">
                {data.conditions.slice(0, 2).map((condition) => (
                  <div key={condition.id} className="text-xs text-purple-700 bg-purple-100 px-2 py-1 rounded">
                    IF {condition.field} {condition.operator} "{condition.value}"
                  </div>
                ))}
                {data.conditions.length > 2 && (
                  <div className="text-xs text-purple-600">+{data.conditions.length - 2} more</div>
                )}
              </div>
            ) : (
              <div className="text-xs text-purple-600">No conditions set</div>
            )}
          </button>

          {/* Notifications & Advanced Section */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setStep(5)
            }}
            className="w-full text-left p-4 bg-amber-50 hover:bg-amber-100 rounded-xl border-2 border-amber-200 hover:border-amber-400 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="text-sm font-semibold text-amber-900">Notifications & Advanced</div>
                <div className="text-xs font-medium text-amber-600 bg-amber-200 px-2 py-0.5 rounded-full">
                  {data.notifications.length}
                </div>
              </div>
              <Edit2 className="h-4 w-4 text-amber-400 group-hover:text-amber-600" />
            </div>
            {data.notifications.length > 0 ? (
              <div className="space-y-1">
                {data.notifications.slice(0, 2).map((notif) => (
                  <div key={notif.id} className="text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded">
                    On {notif.trigger}: {notif.channels.join(", ")}
                  </div>
                ))}
                {data.notifications.length > 2 && (
                  <div className="text-xs text-amber-600">+{data.notifications.length - 2} more</div>
                )}
              </div>
            ) : (
              <div className="text-xs text-amber-600">No notifications set</div>
            )}
            <div className="text-xs text-amber-700 mt-2">
              Error handling: <span className="font-medium capitalize">{data.errorHandling}</span>
            </div>
          </button>
        </div>
      </div>
    )
  }

  // Wizard Steps
  return (
    <div className="w-full min-h-[580px] flex flex-col bg-white rounded-2xl shadow-lg border border-gray-100">
      {/* Connection Anchors - Always Visible */}
      <div 
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onNodeClick?.("top", e)
        }}
        onMouseDown={(e) => e.stopPropagation()}
        className={`absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full ${colors.dot} border-2 border-white shadow-md cursor-pointer hover:scale-110 transition-transform z-50 ${isConnecting && connectingNode !== "top" ? "ring-2 ring-blue-400 ring-offset-1 scale-110" : ""}`} 
        style={{ pointerEvents: "auto" }}
        title="Connect from top"
      />
      <div 
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onNodeClick?.("right", e)
        }}
        onMouseDown={(e) => e.stopPropagation()}
        className={`absolute top-1/2 -right-2 -translate-y-1/2 w-6 h-6 rounded-full ${colors.dot} border-2 border-white shadow-md cursor-pointer hover:scale-110 transition-transform z-50 ${isConnecting && connectingNode !== "right" ? "ring-2 ring-blue-400 ring-offset-1 scale-110" : ""}`} 
        style={{ pointerEvents: "auto" }}
        title="Connect from right"
      />
      <div 
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onNodeClick?.("bottom", e)
        }}
        onMouseDown={(e) => e.stopPropagation()}
        className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full ${colors.dot} border-2 border-white shadow-md cursor-pointer hover:scale-110 transition-transform z-50 ${isConnecting && connectingNode !== "bottom" ? "ring-2 ring-blue-400 ring-offset-1 scale-110" : ""}`} 
        style={{ pointerEvents: "auto" }}
        title="Connect from bottom"
      />
      <div 
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onNodeClick?.("left", e)
        }}
        onMouseDown={(e) => e.stopPropagation()}
        className={`absolute top-1/2 -left-2 -translate-y-1/2 w-6 h-6 rounded-full ${colors.dot} border-2 border-white shadow-md cursor-pointer hover:scale-110 transition-transform z-50 ${isConnecting && connectingNode !== "left" ? "ring-2 ring-blue-400 ring-offset-1 scale-110" : ""}`} 
        style={{ pointerEvents: "auto" }}
        title="Connect from left"
      />
      
      {/* Header */}
      <div className={`px-6 py-4 border-b ${execColors.border} ${execColors.header} rounded-t-2xl flex-shrink-0`}>
        <div className="flex items-center justify-between mb-3">
          {stageNumber && (
            <div className="inline-flex items-center px-3 py-1 bg-white rounded-full text-xs font-semibold text-blue-600 shadow-sm">
              Stage {stageNumber}
            </div>
          )}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-1.5 w-6 rounded-full transition-all ${
                  s === step ? "bg-blue-500" : s < step ? "bg-blue-300" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">
            Step {step} of 5
          </div>
          <div className="text-base font-semibold text-gray-900">
            {step === 1 && "Basic Information"}
            {step === 2 && "Entry Requirements"}
            {step === 3 && "Completion Requirements"}
            {step === 4 && "Conditional Logic & Routing"}
            {step === 5 && "Notifications & Advanced"}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 min-h-0 overflow-y-auto">
        {step === 1 && <Step1 data={data} updateData={updateData} />}
        {step === 2 && <Step2 data={data} updateData={updateData} />}
        {step === 3 && <Step3 data={data} updateData={updateData} />}
        {step === 4 && <Step4 data={data} updateData={updateData} />}
        {step === 5 && <Step5 data={data} updateData={updateData} />}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t bg-gray-50 rounded-b-2xl flex justify-between gap-3 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          disabled={step === 1}
          className="text-sm"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <Button
          size="sm"
          onClick={handleNext}
          disabled={!canProceed()}
          className="text-sm bg-blue-600 hover:bg-blue-700"
        >
          {step === 5 ? (
            <>
              <Check className="h-4 w-4 mr-1" />
              Complete
            </>
          ) : (
            <>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

// Step 1: Basic Info
function Step1({ data, updateData }: { data: StageData; updateData: (u: Partial<StageData>) => void }) {
  return (
    <div className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
          Stage Name <span className="text-red-500">*</span>
        </label>
        <Input
          value={data.name}
          onChange={(e) => updateData({ name: e.target.value })}
          placeholder="e.g., Cutting, Sewing, QC Check"
          className="text-sm h-11 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          autoFocus
        />
      </div>

      {/* Type */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
          Stage Type
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          {stageTypeOptions.map((option) => {
            const Icon = option.icon
            const selected = data.type === option.value
            return (
              <button
                key={option.value}
                onClick={() => updateData({ type: option.value })}
                className={`relative p-3 rounded-xl border-2 transition-all ${
                  selected
                    ? "border-blue-500 bg-blue-50 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${option.gradient} text-white flex-shrink-0`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{option.label}</span>
                </div>
                {selected && (
                  <div className="absolute top-2 right-2">
                    <Check className="h-4 w-4 text-blue-600" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Execution Type */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
          Execution Type
        </label>
        <div className="flex gap-2">
          {[
            { value: "sequential" as const, label: "Sequential" },
            { value: "async" as const, label: "Async" },
            { value: "parallel" as const, label: "Parallel" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => updateData({ executionType: option.value })}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium border-2 transition-all ${
                data.executionType === option.value
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            <Clock className="h-3 w-3 inline mr-1" />
            Duration (min)
          </label>
          <Input
            type="number"
            value={data.estimatedDuration || ""}
            onChange={(e) => updateData({ estimatedDuration: parseInt(e.target.value) || 0 })}
            placeholder="30"
            className="text-sm h-10 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            <Users className="h-3 w-3 inline mr-1" />
            Team / Person
          </label>
          <Input
            value={data.assignedRole}
            onChange={(e) => updateData({ assignedRole: e.target.value })}
            placeholder="Cutting Team"
            className="text-sm h-10 rounded-lg"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">
          <MapPin className="h-3 w-3 inline mr-1" />
          Location
        </label>
        <Input
          value={data.location}
          onChange={(e) => updateData({ location: e.target.value })}
          placeholder="e.g., Zone A - Cutting Floor"
          className="text-sm h-10 rounded-lg"
        />
      </div>
    </div>
  )
}

// Step 2: Inputs
function Step2({ data, updateData }: { data: StageData; updateData: (u: Partial<StageData>) => void }) {
  const selectedTypes = new Set(data.inputs.map((i) => i.type))

  const toggleType = (type: InputOutputType) => {
    if (selectedTypes.has(type)) {
      updateData({ inputs: data.inputs.filter((i) => i.type !== type) })
    } else {
      const typeInfo = inputOutputTypes.find((t) => t.value === type)
      const newInput: InputOutput = {
        id: `in-${Date.now()}`,
        type,
        label: typeInfo?.label || type,
        required: true,
      }
      updateData({ inputs: [...data.inputs, newInput] })
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-2.5 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-900 mb-1">Entry Requirements</p>
          <p className="text-xs text-blue-700">
            Select what workers need to do or scan <strong>before starting</strong> this stage
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {inputOutputTypes.map((type) => {
          const Icon = type.icon
          const selected = selectedTypes.has(type.value)
          return (
            <button
              key={type.value}
              onClick={() => toggleType(type.value)}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                selected
                  ? "border-blue-500 bg-blue-50 shadow-sm"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Icon className={`h-7 w-7 mx-auto mb-2 ${selected ? "text-blue-600" : "text-gray-400"}`} />
              <div className="text-xs font-medium text-gray-900">{type.label}</div>
              {selected && (
                <div className="absolute top-2 right-2">
                  <Check className="h-4 w-4 text-blue-600" />
                </div>
              )}
            </button>
          )
        })}
      </div>

      {selectedTypes.size > 0 && (
        <div className="text-xs text-gray-500 text-center pt-2 border-t">
          {selectedTypes.size} requirement{selectedTypes.size !== 1 && "s"} selected
        </div>
      )}
    </div>
  )
}

// Step 3: Outputs
function Step3({ data, updateData }: { data: StageData; updateData: (u: Partial<StageData>) => void }) {
  const selectedTypes = new Set(data.outputs.map((o) => o.type))

  const toggleType = (type: InputOutputType) => {
    if (selectedTypes.has(type)) {
      updateData({ outputs: data.outputs.filter((o) => o.type !== type) })
    } else {
      const typeInfo = inputOutputTypes.find((t) => t.value === type)
      const newOutput: InputOutput = {
        id: `out-${Date.now()}`,
        type,
        label: typeInfo?.label || type,
        required: true,
      }
      updateData({ outputs: [...data.outputs, newOutput] })
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-2.5 p-4 bg-green-50 rounded-xl border border-green-100">
        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-green-900 mb-1">Completion Requirements</p>
          <p className="text-xs text-green-700">
            Select what workers need to do or capture <strong>before completing</strong> this stage
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {inputOutputTypes.map((type) => {
          const Icon = type.icon
          const selected = selectedTypes.has(type.value)
          return (
            <button
              key={type.value}
              onClick={() => toggleType(type.value)}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                selected
                  ? "border-green-500 bg-green-50 shadow-sm"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Icon className={`h-7 w-7 mx-auto mb-2 ${selected ? "text-green-600" : "text-gray-400"}`} />
              <div className="text-xs font-medium text-gray-900">{type.label}</div>
              {selected && (
                <div className="absolute top-2 right-2">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
              )}
            </button>
          )
        })}
      </div>

      {selectedTypes.size > 0 && (
        <div className="text-xs text-gray-500 text-center pt-2 border-t">
          {selectedTypes.size} requirement{selectedTypes.size !== 1 && "s"} selected
        </div>
      )}
    </div>
  )
}