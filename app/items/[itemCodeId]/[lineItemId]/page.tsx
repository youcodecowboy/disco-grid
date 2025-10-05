"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { MOCK_ITEM_CODES } from "@/lib/data/itemCodes"
import { MOCK_LINE_ITEMS, calculateStageDuration } from "@/lib/data/lineItems"
import { Button } from "@/components/ui/button"
import { LayoutScaffold } from "@/components/grid-v2"

interface StageInput {
  type: string
  label: string
  fields?: string[]
  required: boolean
}

interface StageInfo {
  nextStage: string
  inputs: StageInput[]
}

// Dynamic Stage Block Component
const CurrentStageBlock = ({ lineItem }: { lineItem: any }) => {
  const [duration, setDuration] = useState(calculateStageDuration(lineItem.currentStageStarted))
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(calculateStageDuration(lineItem.currentStageStarted))
    }, 1000)
    return () => clearInterval(interval)
  }, [lineItem.currentStageStarted])

  const getStageInfo = (stage: string): StageInfo => {
    const requirements: Record<string, StageInfo> = {
      "Sewing": {
        nextStage: "Washing",
        inputs: [
          { type: "scan", label: "Scan to confirm completion", required: true },
          { type: "form", label: "Stitch quality check", fields: ["Pass/Fail", "Notes"], required: true },
          { type: "photo", label: "Photo of completed stitching", required: false }
        ]
      },
      "Washing": {
        nextStage: "QC",
        inputs: [
          { type: "scan", label: "Scan washing completion", required: true },
          { type: "form", label: "Wash cycle details", fields: ["Cycle Type", "Temperature"], required: true }
        ]
      },
      "Cutting": {
        nextStage: "Sewing",
        inputs: [
          { type: "scan", label: "Scan cut pieces", required: true },
          { type: "form", label: "Material verification", fields: ["Fabric Type", "Batch Number"], required: true }
        ]
      },
      "Finishing": {
        nextStage: "QC",
        inputs: [
          { type: "scan", label: "Scan finished item", required: true },
          { type: "photo", label: "Final product photo", required: true }
        ]
      }
    }
    return requirements[stage] || { nextStage: "Unknown", inputs: [] }
  }

  const currentStageInfo = getStageInfo(lineItem.currentStage)

  const getStatusColor = (status: string): string => {
    if (status === "ahead") return "from-emerald-500 to-green-600"
    if (status === "on-time") return "from-blue-500 to-indigo-600"
    if (status === "behind") return "from-orange-500 to-red-500"
    if (status === "at-risk") return "from-red-500 to-rose-600"
    return "from-slate-500 to-slate-600"
  }

  const colorClass = getStatusColor(lineItem.scheduleStatus)

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl overflow-hidden">
      <div className={`bg-gradient-to-r ${colorClass} px-6 py-8 text-white`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="text-xs uppercase font-bold tracking-wider opacity-90 mb-2">Current Stage</div>
            <h2 className="text-4xl font-bold mb-3">{lineItem.currentStage}</h2>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-mono font-bold">{duration.hours}h {duration.minutes}m {duration.seconds}s</span>
              </div>
              <div className={`px-3 py-1 rounded-full font-bold text-xs bg-white bg-opacity-20`}>
                {lineItem.scheduleStatus === "ahead" ? `+${lineItem.daysAheadBehind}d ahead` :
                 lineItem.scheduleStatus === "on-time" ? "On schedule" :
                 `${Math.abs(lineItem.daysAheadBehind)}d behind`}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs opacity-90 mb-1">Progress</div>
            <div className="text-3xl font-bold">{lineItem.progress}%</div>
          </div>
        </div>
        
        <div className="bg-black bg-opacity-20 backdrop-blur-sm rounded-xl px-4 py-3 border border-white border-opacity-30">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span className="text-sm font-semibold text-white">Next: {currentStageInfo.nextStage}</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Required Actions</h3>
          <div className="space-y-3">
            {currentStageInfo.inputs.map((input, idx) => (
              <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {input.type === "scan" && (
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm-2 8h8v8H3v-8zm2 6h4v-4H5v4zm8-14v8h8V3h-8zm6 6h-4V5h4v4zm-6 4h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm4-4h2v2h-2v-2zm2 2h2v2h-2v-2zm-4 4h2v2h-2v-2z"/>
                        </svg>
                      </div>
                    )}
                    {input.type === "form" && (
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    )}
                    {input.type === "photo" && (
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-slate-900">{input.label}</div>
                      {input.type === "form" && input.fields && (
                        <div className="text-xs text-slate-600 mt-1">Fields: {input.fields.join(", ")}</div>
                      )}
                    </div>
                  </div>
                  {input.required && (
                    <span className="text-xs font-bold text-red-600">REQUIRED</span>
                  )}
                </div>
                
                {input.type === "scan" && (
                  <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm-2 8h8v8H3v-8zm2 6h4v-4H5v4zm8-14v8h8V3h-8zm6 6h-4V5h4v4zm-6 4h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm4-4h2v2h-2v-2zm2 2h2v2h-2v-2zm-4 4h2v2h-2v-2z"/>
                    </svg>
                    Open Scanner
                  </button>
                )}
                {input.type === "form" && (
                  <button className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors">
                    Fill Form
                  </button>
                )}
                {input.type === "photo" && (
                  <button className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Take Photo
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl">
          Mark Stage Complete
        </button>
      </div>
    </div>
  )
}

// Item Identity Card Component - Comprehensive Source of Truth
const ItemIdentityCard = ({ lineItem, itemCode }: { lineItem: any; itemCode: any }) => {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="text-xs uppercase font-bold text-slate-300 mb-1">Item Code</div>
            <h1 className="text-xl font-bold text-white mb-2">{itemCode.name}</h1>
            <code className="text-xs font-mono bg-white bg-opacity-20 text-white px-3 py-1 rounded-lg inline-block">
              {lineItem.fullSerialNumber}
            </code>
          </div>
          <span className={`px-3 py-1.5 text-xs font-bold rounded-full ${
            lineItem.status === "Completed" ? "bg-green-500 text-white" :
            lineItem.status === "In Production" ? "bg-blue-500 text-white" :
            lineItem.status === "On Hold" ? "bg-yellow-500 text-white" :
            "bg-slate-500 text-white"
          }`}>
            {lineItem.status}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-3 border border-slate-200">
            <div className="text-xs text-slate-500 mb-1">Unit Number</div>
            <div className="text-lg font-bold text-slate-900">#{lineItem.serialNumber}</div>
          </div>
          <div className="bg-white rounded-xl p-3 border border-slate-200">
            <div className="text-xs text-slate-500 mb-1">Progress</div>
            <div className="text-lg font-bold text-slate-900">{lineItem.progress}%</div>
          </div>
          <div className="bg-white rounded-xl p-3 border border-slate-200">
            <div className="text-xs text-slate-500 mb-1">Order</div>
            <div className="text-xs font-semibold text-slate-900">{itemCode.orderName}</div>
          </div>
          <div className="bg-white rounded-xl p-3 border border-slate-200">
            <div className="text-xs text-slate-500 mb-1">Type</div>
            <div className="text-xs font-semibold text-slate-900 capitalize">{itemCode.type}</div>
          </div>
        </div>

        {/* Variant Attributes */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
          <h3 className="text-xs font-bold text-blue-900 uppercase mb-3">Variant Specifications</h3>
          <div className="space-y-2">
            {itemCode.variantAttributes.map((attr: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between py-1.5 border-b border-blue-100 last:border-0">
                <span className="text-xs font-medium text-blue-700">{attr.field}</span>
                <span className="text-sm font-bold text-blue-900">{attr.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Product Attributes */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
          <h3 className="text-xs font-bold text-purple-900 uppercase mb-3">Product Attributes</h3>
          <div className="space-y-2">
            {itemCode.attributes.map((attr: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between py-1.5 border-b border-purple-100 last:border-0">
                <span className="text-xs font-medium text-purple-700">{attr.field}</span>
                <span className="text-xs font-semibold text-purple-900">{attr.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Item Timeline */}
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <h3 className="text-xs font-bold text-slate-900 uppercase mb-3">Item Timeline</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-slate-900">Created</div>
                <div className="text-xs text-slate-600">{new Date(lineItem.createdAt).toLocaleString()}</div>
              </div>
            </div>

            {lineItem.startedAt && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-900">Production Started</div>
                  <div className="text-xs text-slate-600">{new Date(lineItem.startedAt).toLocaleString()}</div>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-slate-900">Expected Completion</div>
                <div className="text-xs text-slate-600">{new Date(itemCode.dueDate).toLocaleString()}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-slate-900">Last Updated</div>
                <div className="text-xs text-slate-600">{new Date(lineItem.updatedAt).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stage History Summary */}
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <h3 className="text-xs font-bold text-slate-900 uppercase mb-3">Stage History</h3>
          <div className="space-y-2">
            {lineItem.stageHistory.map((stage: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs font-semibold text-green-900">{stage.stage}</span>
                </div>
                <span className="text-xs text-green-700">{stage.duration}m</span>
              </div>
            ))}
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-blue-900">{lineItem.currentStage}</span>
              </div>
              <span className="text-xs text-blue-700">In Progress</span>
            </div>
          </div>
        </div>

        {/* Production Details */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
          <h3 className="text-xs font-bold text-slate-900 uppercase mb-3">Production Details</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">Workflow</span>
              <span className="text-xs font-semibold text-slate-900">{itemCode.workflow}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">Team</span>
              <span className="text-xs font-semibold text-slate-900">{itemCode.assignedTeam}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">Location</span>
              <span className="text-xs font-semibold text-slate-900">{lineItem.currentLocation}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">Last Scanned By</span>
              <span className="text-xs font-semibold text-slate-900">{lineItem.lastScannedBy}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LineItemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"overview" | "attributes" | "components" | "history">("overview")
  const [noteText, setNoteText] = useState("")
  
  const lineItem = MOCK_LINE_ITEMS.find(li => li.id === params.lineItemId) || MOCK_LINE_ITEMS[0]
  const itemCode = MOCK_ITEM_CODES.find(ic => ic.id === lineItem.itemCodeId) || MOCK_ITEM_CODES[0]

  // Mock data for new sections
  const qrStats = {
    totalScans: 47,
    lastScan: new Date(lineItem.lastScannedAt),
    lastScannedBy: lineItem.lastScannedBy,
    firstScan: new Date(lineItem.createdAt)
  }

  const workflowStages = ["Cutting", "Sewing", "Washing", "QC", "Packing"]
  const currentStageIndex = workflowStages.indexOf(lineItem.currentStage)

  const mockMessages = [
    { from: "Lauren Medina", message: "This batch needs priority attention", time: "2 hours ago", type: "urgent" },
    { from: "Quality Team", message: "QC check scheduled for tomorrow", time: "1 day ago", type: "info" }
  ]

  const clientInfo = {
    brandName: "Horizon Apparel Co.",
    contactName: "Sarah Johnson",
    role: "Merchandiser",
    email: "sarah@horizon.com"
  }

  const ownershipTeam = [
    { name: "Lauren Medina", role: "Production Manager", team: "Production Ops" },
    { name: "James Chen", role: "QC Lead", team: "Quality Control" }
  ]

  const headerActions = (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => router.push(`/items/${itemCode.id}`)}
      >
        ← Back
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => alert("Print QR code")}
      >
        Print QR
      </Button>
    </div>
  )

  return (
    <LayoutScaffold 
      pageTitle={`Unit #${lineItem.serialNumber}`}
      pageSubtext={`${itemCode.name} • Level 3 of 3`}
      headerActions={headerActions}
    >
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.02] z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <button onClick={() => router.push("/items-v2")} className="hover:text-blue-600 transition-colors">
            All Items
          </button>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <button onClick={() => router.push(`/items/${itemCode.id}`)} className="hover:text-blue-600 transition-colors">
            {itemCode.name}
          </button>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="font-semibold text-slate-900">Unit #{lineItem.serialNumber}</span>
        </div>

        {/* Workflow Progress Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase">Workflow Progress</h3>
              <p className="text-xs text-slate-600 mt-0.5">{itemCode.workflow}</p>
            </div>
            <div className="text-sm font-bold text-slate-900">
              Stage {currentStageIndex + 1} of {workflowStages.length}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {workflowStages.map((stage, idx) => (
              <div key={idx} className="flex-1 flex items-center">
                <div className="flex-1">
                  <div className={`h-2 rounded-full ${
                    idx < currentStageIndex ? "bg-green-500" :
                    idx === currentStageIndex ? "bg-blue-500" :
                    "bg-slate-200"
                  }`} />
                  <div className="text-xs mt-1 text-center font-medium">
                    {stage}
                  </div>
                </div>
                {idx < workflowStages.length - 1 && (
                  <svg className={`w-4 h-4 mx-1 ${
                    idx < currentStageIndex ? "text-green-500" : "text-slate-300"
                  }`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Grid - Optimized Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Identity Card (Comprehensive Source of Truth) */}
          <div className="lg:col-span-4">
            <ItemIdentityCard lineItem={lineItem} itemCode={itemCode} />
          </div>

          {/* Middle Column - Primary Actions & Context */}
          <div className="lg:col-span-5 space-y-6">
            {/* Dynamic Stage Block */}
            <CurrentStageBlock lineItem={lineItem} />

            {/* Notes Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase mb-3">Item Notes</h3>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add notes about this item..."
                className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                rows={3}
              />
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-slate-500">Notes are visible to all team members</span>
                <Button size="sm" onClick={() => alert("Note saved")}>
                  Save Note
                </Button>
              </div>
            </div>

            {/* Messages Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase">Messages</h3>
                <button className="text-xs text-blue-600 hover:text-blue-800 font-semibold">
                  + New Message
                </button>
              </div>
              <div className="space-y-3">
                {mockMessages.map((msg, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border-l-4 ${
                    msg.type === "urgent" ? "bg-red-50 border-red-500" : "bg-blue-50 border-blue-500"
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-bold text-slate-900">{msg.from}</span>
                      <span className="text-xs text-slate-500">{msg.time}</span>
                    </div>
                    <p className="text-sm text-slate-700">{msg.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Compact Info Cards */}
          <div className="lg:col-span-3 space-y-6">
            {/* QR Code Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase mb-4">QR Code</h3>
              <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 mb-4">
                <div className="aspect-square bg-gradient-to-br from-slate-900 to-slate-700 rounded-lg flex items-center justify-center">
                  <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm-2 8h8v8H3v-8zm2 6h4v-4H5v4zm8-14v8h8V3h-8zm6 6h-4V5h4v4zm-6 4h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm4-4h2v2h-2v-2zm2 2h2v2h-2v-2zm-4 4h2v2h-2v-2z"/>
                  </svg>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs text-slate-500 mb-1">Total Scans</div>
                  <div className="text-2xl font-bold text-slate-900">{qrStats.totalScans}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs text-slate-500 mb-1">Last Scanned By</div>
                  <div className="text-sm font-semibold text-slate-900">{qrStats.lastScannedBy}</div>
                  <div className="text-xs text-slate-600 mt-1">
                    {qrStats.lastScan.toLocaleString()}
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors">
                Reprint QR Code
              </button>
            </div>

            {/* Client Information */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-purple-900 uppercase mb-4">Client</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-purple-600 mb-1">Brand</div>
                  <div className="text-sm font-bold text-purple-900">{clientInfo.brandName}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-600 mb-1">Contact Person</div>
                  <div className="text-sm font-semibold text-purple-900">{clientInfo.contactName}</div>
                  <div className="text-xs text-purple-700">{clientInfo.role}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-600 mb-1">Email</div>
                  <a href={`mailto:${clientInfo.email}`} className="text-sm text-purple-600 hover:text-purple-800 underline">
                    {clientInfo.email}
                  </a>
                </div>
              </div>
              <button className="w-full mt-4 py-2 bg-purple-600 text-white text-sm font-bold rounded-lg hover:bg-purple-700 transition-colors">
                Contact Client
              </button>
            </div>

            {/* Ownership */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase mb-4">Ownership</h3>
              <div className="space-y-3">
                {ownershipTeam.map((owner, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {owner.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-900 truncate">{owner.name}</div>
                      <div className="text-xs text-slate-600">{owner.role}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors">
                + Add Owner
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50">
            <div className="flex gap-1 px-4 overflow-x-auto">
              {[
                { key: "overview", label: "Overview" },
                { key: "attributes", label: "Attributes" },
                { key: "components", label: itemCode.type === "complex" ? "Components" : "Components (0)" },
                { key: "history", label: "History" }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-6 py-3 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
                    activeTab === tab.key
                      ? "text-blue-600 border-blue-600"
                      : "text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs uppercase font-bold text-blue-700">Current Location</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-blue-900">{lineItem.currentLocation}</div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs uppercase font-bold text-purple-700">Last Scanned By</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-purple-900">{lineItem.lastScannedBy}</div>
                    <div className="text-xs text-purple-600 mt-1">
                      {new Date(lineItem.lastScannedAt).toLocaleString()}
                    </div>
                  </div>

                  <div className={`bg-gradient-to-br rounded-xl p-5 border ${
                    lineItem.scheduleStatus === "ahead" ? "from-emerald-50 to-green-50 border-emerald-100" :
                    lineItem.scheduleStatus === "on-time" ? "from-blue-50 to-indigo-50 border-blue-100" :
                    "from-red-50 to-rose-50 border-red-100"
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        lineItem.scheduleStatus === "ahead" ? "bg-emerald-500" :
                        lineItem.scheduleStatus === "on-time" ? "bg-blue-500" :
                        "bg-red-500"
                      }`}>
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <div className={`text-xs uppercase font-bold ${
                          lineItem.scheduleStatus === "ahead" ? "text-emerald-700" :
                          lineItem.scheduleStatus === "on-time" ? "text-blue-700" :
                          "text-red-700"
                        }`}>Schedule Status</div>
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${
                      lineItem.scheduleStatus === "ahead" ? "text-emerald-900" :
                      lineItem.scheduleStatus === "on-time" ? "text-blue-900" :
                      "text-red-900"
                    }`}>
                      {lineItem.scheduleStatus === "ahead" ? `${lineItem.daysAheadBehind}d Ahead` :
                       lineItem.scheduleStatus === "on-time" ? "On Schedule" :
                       `${Math.abs(lineItem.daysAheadBehind)}d Behind`}
                    </div>
                  </div>
                </div>

                {lineItem.notes && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-yellow-800">Item Notes</p>
                        <p className="mt-1 text-sm text-yellow-700">{lineItem.notes}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "attributes" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="text-xs uppercase font-bold text-slate-500 mb-2">Created</div>
                    <div className="text-sm font-semibold text-slate-900">
                      {new Date(lineItem.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="text-xs uppercase font-bold text-slate-500 mb-2">Last Updated</div>
                    <div className="text-sm font-semibold text-slate-900">
                      {new Date(lineItem.updatedAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h3 className="text-sm font-bold text-blue-900 uppercase">GPS Coordinates</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-blue-600 mb-1">Latitude</div>
                      <code className="text-sm font-mono font-semibold text-blue-900">34.0522° N</code>
                    </div>
                    <div>
                      <div className="text-xs text-blue-600 mb-1">Longitude</div>
                      <code className="text-sm font-mono font-semibold text-blue-900">118.2437° W</code>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "components" && (
              <div className="py-12 text-center">
                <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {itemCode.type === "complex" ? "Components" : "Simple Item"}
                </h3>
                <p className="text-slate-600 text-sm">
                  {itemCode.type === "complex" ? "Complex item components coming soon" : "This item has no sub-components"}
                </p>
              </div>
            )}

            {activeTab === "history" && (
              <div className="space-y-4">
                {lineItem.stageHistory.map((stage: any, idx: number) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      {idx < lineItem.stageHistory.length - 1 && (
                        <div className="w-0.5 h-full bg-slate-200 flex-1 my-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-bold text-slate-900">{stage.stage}</h3>
                          <span className="text-xs font-semibold text-green-600">Completed</span>
                        </div>
                        <div className="text-xs text-slate-600 space-y-1">
                          <div>Started: {new Date(stage.startedAt).toLocaleString()}</div>
                          <div>Completed: {new Date(stage.completedAt).toLocaleString()}</div>
                          <div>Duration: {stage.duration} minutes</div>
                          <div>By: {stage.completedBy}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-bold text-blue-900">{lineItem.currentStage}</h3>
                        <span className="text-xs font-semibold text-blue-600">In Progress</span>
                      </div>
                      <div className="text-xs text-blue-600">
                        Started: {new Date(lineItem.currentStageStarted).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </LayoutScaffold>
  )
}
