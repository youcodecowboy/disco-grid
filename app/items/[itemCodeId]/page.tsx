"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { MOCK_ITEM_CODES } from "@/lib/data/itemCodes"
import { MOCK_LINE_ITEMS } from "@/lib/data/lineItems"
import { Button } from "@/components/ui/button"
import { LineItemsTable } from "@/components/blocks/items/LineItemsTable"
import { LayoutScaffold } from "@/components/grid-v2"

// Inline editable field component - Modern style
function EditableField({ 
  label, 
  value, 
  onSave,
  colorScheme = "slate"
}: { 
  label: string
  value: string
  onSave: (newValue: string) => void
  colorScheme?: "blue" | "purple" | "slate"
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)

  const handleSave = () => {
    onSave(editValue)
    setIsEditing(false)
  }

  const schemes = {
    blue: "hover:bg-blue-50 border-blue-200 focus:ring-blue-500",
    purple: "hover:bg-purple-50 border-purple-200 focus:ring-purple-500",
    slate: "hover:bg-slate-50 border-slate-200 focus:ring-slate-500"
  }

  if (isEditing) {
    return (
      <div className="flex-1">
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave()
            if (e.key === "Escape") {
              setEditValue(value)
              setIsEditing(false)
            }
          }}
          autoFocus
          className={`w-full px-3 py-1.5 text-sm border-2 rounded-lg ${schemes[colorScheme]} focus:outline-none focus:ring-2`}
        />
      </div>
    )
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={`flex items-center justify-between py-2 px-3 rounded-lg transition-all cursor-pointer group border border-transparent ${schemes[colorScheme]}`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="text-xs uppercase font-semibold text-slate-500 w-24 flex-shrink-0">{label}</span>
        <span className="text-sm font-medium text-slate-900 truncate">{value}</span>
      </div>
      <svg className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    </div>
  )
}

// Team member card for ownership/permissions
function TeamMemberCard({
  name,
  role,
  team,
  avatar,
  permissions,
  onEdit,
  onRemove
}: {
  name: string
  role: string
  team: string
  avatar: string
  permissions: string[]
  onEdit: () => void
  onRemove: () => void
}) {
  const [showPermissions, setShowPermissions] = useState(false)

  return (
    <div className="group bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md hover:border-slate-300 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-slate-900 truncate">{name}</div>
            <div className="text-xs text-slate-500">{role} • {team}</div>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={onEdit}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            title="Edit permissions"
          >
            <svg className="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button 
            onClick={onRemove}
            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
            title="Remove"
          >
            <svg className="w-3.5 h-3.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <button 
        onClick={() => setShowPermissions(!showPermissions)}
        className="mt-3 text-xs text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1"
      >
        <span>Permissions</span>
        <svg className={`w-3 h-3 transition-transform ${showPermissions ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {showPermissions && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {permissions.map((perm, idx) => (
            <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
              {perm}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// Brand access card
function BrandAccessCard({
  brandName,
  contactName,
  role,
  accessLevel,
  onEdit
}: {
  brandName: string
  contactName: string
  role: string
  accessLevel: "full" | "view-only" | "limited"
  onEdit: () => void
}) {
  const accessColors = {
    "full": "bg-green-100 text-green-700",
    "view-only": "bg-blue-100 text-blue-700",
    "limited": "bg-yellow-100 text-yellow-700"
  }

  return (
    <div className="group bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="font-bold text-sm text-purple-900">{brandName}</span>
          </div>
          <div className="text-xs text-purple-700 mb-2">{contactName} • {role}</div>
          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${accessColors[accessLevel]}`}>
            {accessLevel === "full" ? "Full Access" : accessLevel === "view-only" ? "View Only" : "Limited Access"}
          </span>
        </div>
        <button 
          onClick={onEdit}
          className="p-1.5 hover:bg-purple-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          title="Edit access"
        >
          <svg className="w-3.5 h-3.5 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function ItemCodeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"overview" | "items" | "management" | "messages" | "files">("overview")
  
  // Find the item code
  const itemCode = MOCK_ITEM_CODES.find(ic => ic.id === params.itemCodeId) || MOCK_ITEM_CODES[0]
  const lineItems = MOCK_LINE_ITEMS.filter(li => li.itemCodeId === itemCode.id)

  // Calculate stats
  const totalItems = lineItems.length
  const completedItems = lineItems.filter(li => li.status === "Completed").length
  const inProductionItems = lineItems.filter(li => li.status === "In Production").length
  const onHoldItems = lineItems.filter(li => li.status === "On Hold").length
  const aheadSchedule = lineItems.filter(li => li.scheduleStatus === "ahead").length
  const behindSchedule = lineItems.filter(li => li.scheduleStatus === "behind" || li.scheduleStatus === "at-risk").length

  const handleAttributeSave = (field: string, newValue: string) => {
    console.log(`Saving ${field}: ${newValue}`)
  }

  const headerActions = (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => router.push("/items-v2")}
      >
        ← Back
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => alert("Export data")}
      >
        Export
      </Button>
      <Button 
        size="sm"
        onClick={() => alert("Print QR codes")}
      >
        Print QRs
      </Button>
    </div>
  )

  // Mock team members
  const teamMembers = [
    { name: "Lauren Medina", role: "Production Manager", team: "Production Ops", avatar: "LM", permissions: ["Edit", "Delete", "Assign"] },
    { name: "James Chen", role: "QC Lead", team: "Quality Control", avatar: "JC", permissions: ["View", "Comment", "QC Approval"] },
    { name: "Maria Rodriguez", role: "Floor Supervisor", team: "Production Ops", avatar: "MR", permissions: ["View", "Update Status"] },
    { name: "Alex Kim", role: "Logistics Coordinator", team: "Supply Chain", avatar: "AK", permissions: ["View", "Update Location"] },
  ]

  return (
    <LayoutScaffold 
      pageTitle={itemCode.name}
      pageSubtext={`${itemCode.orderName} • Level 2 of 3`}
      headerActions={headerActions}
    >
      {/* Grid background */}
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
          <span className="font-semibold text-slate-900">{itemCode.name}</span>
        </div>

        {/* Tabs - Now at top */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50">
            <div className="flex gap-1 px-4 overflow-x-auto">
              {[
                { key: "overview", label: "Overview" },
                { key: "items", label: `Line Items (${totalItems})` },
                { key: "management", label: "Management" },
                { key: "messages", label: "Messages" },
                { key: "files", label: "Files" }
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
            {/* Overview Tab - All the details */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Quick Stats - Modern Gradient Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100 hover:shadow-lg transition-shadow">
                    <div className="text-xs uppercase font-bold text-blue-700 mb-2">Total</div>
                    <div className="text-3xl font-bold text-blue-900">{totalItems}</div>
                    <div className="text-xs text-blue-600 mt-1">units</div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-5 border border-emerald-100 hover:shadow-lg transition-shadow">
                    <div className="text-xs uppercase font-bold text-emerald-700 mb-2">Done</div>
                    <div className="text-3xl font-bold text-emerald-900">{completedItems}</div>
                    <div className="text-xs text-emerald-600 mt-1">{Math.round((completedItems/totalItems)*100)}%</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100 hover:shadow-lg transition-shadow">
                    <div className="text-xs uppercase font-bold text-purple-700 mb-2">Active</div>
                    <div className="text-3xl font-bold text-purple-900">{inProductionItems}</div>
                    <div className="text-xs text-purple-600 mt-1">in production</div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-5 border border-yellow-100 hover:shadow-lg transition-shadow">
                    <div className="text-xs uppercase font-bold text-yellow-700 mb-2">Hold</div>
                    <div className="text-3xl font-bold text-yellow-900">{onHoldItems}</div>
                    <div className="text-xs text-yellow-600 mt-1">on hold</div>
                  </div>
                  <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-5 border border-teal-100 hover:shadow-lg transition-shadow">
                    <div className="text-xs uppercase font-bold text-teal-700 mb-2">Ahead</div>
                    <div className="text-3xl font-bold text-teal-900">{aheadSchedule}</div>
                    <div className="text-xs text-teal-600 mt-1">on track</div>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-5 border border-red-100 hover:shadow-lg transition-shadow">
                    <div className="text-xs uppercase font-bold text-red-700 mb-2">Risk</div>
                    <div className="text-3xl font-bold text-red-900">{behindSchedule}</div>
                    <div className="text-xs text-red-600 mt-1">at risk</div>
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Left Column - Attributes */}
                  <div className="xl:col-span-2 space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Item Details</h3>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                  itemCode.status === "Completed" ? "bg-green-500 text-white" :
                  itemCode.status === "In Production" ? "bg-blue-500 text-white" :
                  itemCode.status === "Ready" ? "bg-purple-500 text-white" :
                  itemCode.status === "On Hold" ? "bg-yellow-500 text-white" :
                  "bg-slate-500 text-white"
                }`}>
                  {itemCode.status}
                </span>
              </div>
              
              <div className="p-6 space-y-1">
                <div className="py-2 px-3 bg-slate-50 rounded-lg border border-slate-200 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-semibold text-slate-500">Item Code</span>
                    <code className="font-mono text-sm font-bold text-slate-900">{itemCode.code}</code>
                  </div>
                </div>
                <EditableField label="Workflow" value={itemCode.workflow} onSave={(v) => handleAttributeSave("workflow", v)} colorScheme="slate" />
                <EditableField label="Team" value={itemCode.assignedTeam} onSave={(v) => handleAttributeSave("team", v)} colorScheme="slate" />
                <EditableField label="Location" value={itemCode.primaryLocation} onSave={(v) => handleAttributeSave("location", v)} colorScheme="slate" />
              </div>
            </div>

            {/* Variants */}
            <div className="bg-white rounded-2xl border border-blue-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-200 flex items-center justify-between">
                <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wide">Variants</h3>
                <button className="text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors">+ Add</button>
              </div>
              <div className="p-6 space-y-1">
                {itemCode.variantAttributes.map((attr, idx) => (
                  <EditableField
                    key={idx}
                    label={attr.field}
                    value={attr.value}
                    onSave={(v) => handleAttributeSave(`variant_${attr.field}`, v)}
                    colorScheme="blue"
                  />
                ))}
              </div>
            </div>

            {/* Attributes */}
            <div className="bg-white rounded-2xl border border-purple-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-purple-200 flex items-center justify-between">
                <h3 className="text-sm font-bold text-purple-900 uppercase tracking-wide">Attributes</h3>
                <button className="text-xs font-bold text-purple-700 hover:text-purple-900 transition-colors">+ Add</button>
              </div>
              <div className="p-6 space-y-1">
                {itemCode.attributes.map((attr, idx) => (
                  <EditableField
                    key={idx}
                    label={attr.field}
                    value={attr.value}
                    onSave={(v) => handleAttributeSave(`attr_${attr.field}`, v)}
                    colorScheme="purple"
                  />
                ))}
              </div>
            </div>
          </div>

                  {/* Right Column - Team & Brand */}
                  <div className="space-y-6">
                    {/* Team Members - CRM Style */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Team</h3>
                          <p className="text-xs text-slate-600 mt-0.5">{teamMembers.length} members</p>
                        </div>
                        <button 
                          onClick={() => alert("Add team member")}
                          className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors"
                        >
                          + Add
                        </button>
                      </div>
                      <div className="p-4 space-y-3">
                        {teamMembers.map((member, idx) => (
                          <TeamMemberCard
                            key={idx}
                            {...member}
                            onEdit={() => alert(`Edit ${member.name}`)}
                            onRemove={() => alert(`Remove ${member.name}`)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Brand Access */}
                    <div className="bg-white rounded-2xl border border-purple-200 shadow-sm overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-purple-200 flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-purple-900 uppercase tracking-wide">Brand Access</h3>
                          <p className="text-xs text-purple-600 mt-0.5">External visibility</p>
                        </div>
                        <button 
                          onClick={() => alert("Add brand access")}
                          className="px-3 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          + Share
                        </button>
                      </div>
                      <div className="p-4 space-y-3">
                        <BrandAccessCard
                          brandName="Horizon Apparel Co."
                          contactName="Sarah Johnson"
                          role="Merchandiser"
                          accessLevel="view-only"
                          onEdit={() => alert("Edit brand access")}
                        />
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">Timeline</h3>
                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-slate-900">Created</div>
                            <div className="text-xs text-slate-600">{new Date(itemCode.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-slate-900">Due Date</div>
                            <div className="text-xs text-slate-600">{new Date(itemCode.dueDate).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-slate-900">Last Updated</div>
                            <div className="text-xs text-slate-600">{new Date(itemCode.updatedAt).toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Line Items Tab */}
            {activeTab === "items" && (
              <div className="-m-6">
                <LineItemsTable lineItems={lineItems} itemCode={itemCode} />
              </div>
            )}

            {/* Other Tabs */}
            {(activeTab === "management" || activeTab === "messages" || activeTab === "files") && (
              <div className="py-12">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {activeTab === "management" ? "Management Dashboard" : 
                     activeTab === "messages" ? "Messages" : "Files & Documents"}
                  </h3>
                  <p className="text-slate-600 text-sm">Coming soon</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </LayoutScaffold>
  )
}