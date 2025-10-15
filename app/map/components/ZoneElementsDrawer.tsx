"use client"

import { useState } from "react"
import type { ZoneGroup } from "@/lib/site-map/types"
import { useSiteMap } from "../context/SiteMapContext"

interface ZoneElementsDrawerProps {
  zone: ZoneGroup | null
  onClose: () => void
}

type ElementType = "machine" | "storage" | "equipment" | "station"

interface ZoneElement {
  id: string
  type: ElementType
  name: string
  properties: Record<string, any>
  generatedIds?: string[] // For storage: RACK001-SHELF001-BIN001, etc.
}

const ELEMENT_TYPES = [
  { type: "machine" as ElementType, label: "Machine", icon: "⚙️" },
  { type: "storage" as ElementType, label: "Storage", icon: "📦" },
  { type: "equipment" as ElementType, label: "Equipment", icon: "🔧" },
  { type: "station" as ElementType, label: "Station", icon: "🏭" },
]

// Recommended attributes for each type
const RECOMMENDED_ATTRIBUTES: Record<ElementType, Array<{ key: string; label: string; type?: string }>> = {
  machine: [
    { key: "quantity", label: "Quantity", type: "number" },
    { key: "brand", label: "Brand" },
    { key: "model", label: "Model" },
    { key: "machineType", label: "Machine Type" },
    { key: "yearPurchased", label: "Year Purchased", type: "number" },
    { key: "serialNumber", label: "Serial Number" },
    { key: "lastMaintained", label: "Last Maintained", type: "date" },
    { key: "maintenanceInterval", label: "Maintenance Interval" },
    { key: "capacity", label: "Capacity" },
    { key: "powerRequirement", label: "Power Requirement" },
  ],
  storage: [
    { key: "storageType", label: "Storage Type" },
    { key: "racks", label: "Number of Racks", type: "number" },
    { key: "shelvesPerRack", label: "Shelves per Rack", type: "number" },
    { key: "binsPerShelf", label: "Bins per Shelf", type: "number" },
    { key: "weightCapacity", label: "Weight Capacity per Shelf" },
    { key: "dimensions", label: "Dimensions" },
  ],
  equipment: [
    { key: "quantity", label: "Quantity", type: "number" },
    { key: "brand", label: "Brand" },
    { key: "model", label: "Model" },
    { key: "equipmentType", label: "Equipment Type" },
    { key: "yearPurchased", label: "Year Purchased", type: "number" },
    { key: "serialNumber", label: "Serial Number" },
    { key: "lastInspection", label: "Last Inspection", type: "date" },
  ],
  station: [
    { key: "quantity", label: "Quantity", type: "number" },
    { key: "stationType", label: "Station Type" },
    { key: "capacity", label: "Capacity" },
    { key: "assignedStaff", label: "Assigned Staff" },
    { key: "shiftSchedule", label: "Shift Schedule" },
  ],
}

export function ZoneElementsDrawer({ zone, onClose }: ZoneElementsDrawerProps) {
  const { siteMap, updateElement, addElement, deleteElement, updateZoneGroup, getCurrentFloor } = useSiteMap()
  const [elements, setElements] = useState<ZoneElement[]>([])
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [showZoneInfo, setShowZoneInfo] = useState(false)

  const currentFloor = getCurrentFloor()
  
  if (!zone || !currentFloor) return null

  const handleUpdateZone = (updates: Partial<ZoneGroup>) => {
    updateZoneGroup(currentFloor.id, zone.id, updates)
  }

  const handleAddTeam = (teamName: string) => {
    if (!teamName.trim()) return
    const currentTeams = zone.assignedTeams || []
    if (!currentTeams.includes(teamName.trim())) {
      handleUpdateZone({ assignedTeams: [...currentTeams, teamName.trim()] })
    }
  }

  const handleRemoveTeam = (teamName: string) => {
    const currentTeams = zone.assignedTeams || []
    handleUpdateZone({ assignedTeams: currentTeams.filter((t) => t !== teamName) })
  }

  const handleAddElement = (type: ElementType) => {
    const newElement: ZoneElement = {
      id: `elem-${Date.now()}`,
      type,
      name: "",
      properties: {},
    }
    setElements([...elements, newElement])
    setShowAddMenu(false)
  }

  const handleRemoveElement = (id: string) => {
    setElements(elements.filter((e) => e.id !== id))
  }

  const handleUpdateElement = (id: string, updates: Partial<ZoneElement>) => {
    setElements(elements.map((e) => (e.id === id ? { ...e, ...updates } : e)))
  }

  const handleAddProperty = (elementId: string, key: string, value: string) => {
    setElements(
      elements.map((e) =>
        e.id === elementId ? { ...e, properties: { ...e.properties, [key]: value } } : e
      )
    )
  }

  const handleRemoveProperty = (elementId: string, key: string) => {
    setElements(
      elements.map((e) => {
        if (e.id === elementId) {
          const { [key]: removed, ...rest } = e.properties
          return { ...e, properties: rest }
        }
        return e
      })
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: zone.color }}
              />
              <h2 className="text-xl font-semibold text-gray-900">{zone.name}</h2>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {zone.cells.length} cells • {Math.round(zone.cells.length * 25)} sq ft
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - Lego Style */}
        <div className="flex-1 overflow-auto px-6 py-6">
          <div className="max-w-2xl space-y-6">
            {/* Zone Information Section */}
            <ZoneInfoSection
              zone={zone}
              onUpdate={handleUpdateZone}
              onAddTeam={handleAddTeam}
              onRemoveTeam={handleRemoveTeam}
              showInfo={showZoneInfo}
              setShowInfo={setShowZoneInfo}
            />

            {/* Divider */}
            <div className="border-t border-gray-200" />

            {/* Elements List */}
            {elements.map((element) => (
              <ElementCard
                key={element.id}
                element={element}
                onUpdate={(updates) => handleUpdateElement(element.id, updates)}
                onRemove={() => handleRemoveElement(element.id)}
                onAddProperty={(key, value) => handleAddProperty(element.id, key, value)}
                onRemoveProperty={(key) => handleRemoveProperty(element.id, key)}
              />
            ))}

            {/* Add Element Button */}
            {!showAddMenu ? (
              <button
                onClick={() => setShowAddMenu(true)}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 py-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add machine, storage, or equipment
              </button>
            ) : (
              <div className="space-y-2 py-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Add to zone</span>
                  <button
                    onClick={() => setShowAddMenu(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {ELEMENT_TYPES.map((type) => (
                    <button
                      key={type.type}
                      onClick={() => handleAddElement(type.type)}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
                    >
                      <span className="text-2xl">{type.icon}</span>
                      <span className="text-sm font-medium text-gray-700">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {elements.length === 0 && !showAddMenu && (
              <div className="text-center py-12 text-gray-400">
                <p className="text-sm">This zone is empty</p>
                <p className="text-xs mt-1">Add machines, storage, or equipment to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </>
  )
}

// Generate storage IDs (racks, shelves, bins)
function generateStorageIds(
  racks: number,
  shelvesPerRack: number,
  binsPerShelf: number
): string[] {
  const ids: string[] = []
  
  for (let r = 1; r <= racks; r++) {
    const rackId = `RACK${String(r).padStart(3, "0")}`
    
    for (let s = 1; s <= shelvesPerRack; s++) {
      const shelfId = `${rackId}-SHELF${String(s).padStart(3, "0")}`
      
      if (binsPerShelf > 0) {
        for (let b = 1; b <= binsPerShelf; b++) {
          const binId = `${shelfId}-BIN${String(b).padStart(3, "0")}`
          ids.push(binId)
        }
      } else {
        ids.push(shelfId)
      }
    }
  }
  
  return ids
}

// Generate item IDs based on quantity (e.g., BROTHER001, BROTHER002)
function generateItemIds(baseName: string, quantity: number): string[] {
  const ids: string[] = []
  const sanitizedName = baseName.toUpperCase().replace(/[^A-Z0-9]/g, "")
  
  for (let i = 1; i <= quantity; i++) {
    ids.push(`${sanitizedName}${String(i).padStart(3, "0")}`)
  }
  
  return ids
}

// Element Card Component
function ElementCard({
  element,
  onUpdate,
  onRemove,
  onAddProperty,
  onRemoveProperty,
}: {
  element: ZoneElement
  onUpdate: (updates: Partial<ZoneElement>) => void
  onRemove: () => void
  onAddProperty: (key: string, value: string) => void
  onRemoveProperty: (key: string) => void
}) {
  const [showAddCustom, setShowAddCustom] = useState(false)
  const [showRecommended, setShowRecommended] = useState(false)
  const [newPropKey, setNewPropKey] = useState("")
  const [newPropValue, setNewPropValue] = useState("")

  const typeInfo = ELEMENT_TYPES.find((t) => t.type === element.type)
  const recommendedAttrs = RECOMMENDED_ATTRIBUTES[element.type] || []
  const existingKeys = Object.keys(element.properties)
  const availableRecommended = recommendedAttrs.filter((attr) => !existingKeys.includes(attr.key))

  const handleAddProperty = () => {
    if (newPropKey.trim() && newPropValue.trim()) {
      onAddProperty(newPropKey.trim(), newPropValue.trim())
      setNewPropKey("")
      setNewPropValue("")
    }
  }

  const handleAddRecommended = (key: string, label: string) => {
    onAddProperty(key, "")
    setShowRecommended(false)
  }

  const handlePropertyChange = (key: string, value: string) => {
    onAddProperty(key, value)
    
    // Smart storage logic
    if (element.type === "storage") {
      const racks = key === "racks" ? parseInt(value) : parseInt(element.properties.racks || "0")
      const shelves = key === "shelvesPerRack" ? parseInt(value) : parseInt(element.properties.shelvesPerRack || "0")
      const bins = key === "binsPerShelf" ? parseInt(value) : parseInt(element.properties.binsPerShelf || "0")
      
      if (racks > 0 && shelves > 0) {
        const generatedIds = generateStorageIds(racks, shelves, bins)
        onUpdate({ generatedIds })
      }
    }
    
    // Smart quantity logic for machines, equipment, stations
    if (key === "quantity" && (element.type === "machine" || element.type === "equipment" || element.type === "station")) {
      const quantity = parseInt(value)
      if (quantity > 0 && element.name.trim()) {
        const generatedIds = generateItemIds(element.name, quantity)
        onUpdate({ generatedIds })
      }
    }
  }
  
  // Also regenerate IDs when name changes and quantity exists
  const handleNameChange = (newName: string) => {
    onUpdate({ name: newName })
    
    const quantity = parseInt(element.properties.quantity || "0")
    if (quantity > 0 && newName.trim() && (element.type === "machine" || element.type === "equipment" || element.type === "station")) {
      const generatedIds = generateItemIds(newName, quantity)
      onUpdate({ generatedIds })
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-2xl">{typeInfo?.icon}</span>
          <input
            type="text"
            value={element.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder={`${typeInfo?.label} name...`}
            className="flex-1 text-lg font-semibold text-gray-900 placeholder-gray-300 bg-transparent border-none outline-none"
          />
        </div>
        <button onClick={onRemove} className="text-slate-400 hover:text-slate-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Properties */}
      {Object.entries(element.properties).length > 0 && (
        <div className="space-y-2 pl-6">
          {Object.entries(element.properties).map(([key, value]) => {
            const attrConfig = recommendedAttrs.find((a) => a.key === key)
            const inputType = attrConfig?.type || "text"
            
            return (
              <div key={key} className="flex items-center gap-2 group">
                <label className="text-sm text-gray-600 min-w-[140px] capitalize">
                  {attrConfig?.label || key.replace(/([A-Z])/g, " $1").trim()}:
                </label>
                <input
                  type={inputType}
                  value={value || ""}
                  onChange={(e) => handlePropertyChange(key, e.target.value)}
                  placeholder={`Enter ${attrConfig?.label || key}...`}
                  className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded outline-none focus:border-blue-400 bg-transparent"
                />
                <button
                  onClick={() => onRemoveProperty(key)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Generated IDs (Storage or Item Quantities) */}
      {element.generatedIds && element.generatedIds.length > 0 && (
        <div className="pl-6 mt-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-blue-900">
                {element.type === "storage" 
                  ? `Generated ${element.generatedIds.length} Storage Locations`
                  : `Generated ${element.generatedIds.length} Item IDs`
                }
              </span>
              <button
                className="text-xs text-blue-600 hover:text-blue-800"
                onClick={() => {
                  navigator.clipboard.writeText(element.generatedIds!.join("\n"))
                }}
              >
                Copy All
              </button>
            </div>
            <div className="max-h-32 overflow-y-auto space-y-0.5">
              {element.generatedIds.slice(0, 10).map((id) => (
                <div key={id} className="text-xs font-mono text-blue-700">
                  {id}
                </div>
              ))}
              {element.generatedIds.length > 10 && (
                <div className="text-xs text-blue-600 italic">
                  ... and {element.generatedIds.length - 10} more
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Recommended Attributes */}
      {availableRecommended.length > 0 && !showRecommended && !showAddCustom && (
        <button
          onClick={() => setShowRecommended(true)}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 pl-6 py-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add recommended field
        </button>
      )}

      {/* Recommended Attributes Menu */}
      {showRecommended && (
        <div className="pl-6 space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700">Recommended Fields</span>
            <button
              onClick={() => setShowRecommended(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {availableRecommended.map((attr) => (
              <button
                key={attr.key}
                onClick={() => handleAddRecommended(attr.key, attr.label)}
                className="text-left px-2 py-1.5 text-xs bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 transition-colors"
              >
                {attr.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add Custom Property */}
      {!showAddCustom && !showRecommended && (
        <button
          onClick={() => setShowAddCustom(true)}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 pl-6 py-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add custom field
        </button>
      )}

      {showAddCustom && (
        <div className="pl-6 space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newPropKey}
              onChange={(e) => setNewPropKey(e.target.value)}
              placeholder="Field name"
              className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded outline-none focus:border-gray-400"
            />
            <input
              type="text"
              value={newPropValue}
              onChange={(e) => setNewPropValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddProperty()}
              placeholder="Value"
              className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded outline-none focus:border-gray-400"
            />
            <button
              onClick={handleAddProperty}
              className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              Add
            </button>
          </div>
          <button
            onClick={() => setShowAddCustom(false)}
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}

// Zone Info Section Component
function ZoneInfoSection({
  zone,
  onUpdate,
  onAddTeam,
  onRemoveTeam,
  showInfo,
  setShowInfo,
}: {
  zone: ZoneGroup
  onUpdate: (updates: Partial<ZoneGroup>) => void
  onAddTeam: (teamName: string) => void
  onRemoveTeam: (teamName: string) => void
  showInfo: boolean
  setShowInfo: (show: boolean) => void
}) {
  const [newTeam, setNewTeam] = useState("")

  const handleAddTeam = () => {
    if (newTeam.trim()) {
      onAddTeam(newTeam)
      setNewTeam("")
    }
  }

  return (
    <div className="space-y-3">
      {/* Zone Info Header */}
      <button
        onClick={() => setShowInfo(!showInfo)}
        className="w-full flex items-center justify-between text-left py-2 hover:bg-gray-50 rounded px-2 transition-colors"
      >
        <span className="text-sm font-medium text-gray-700">Zone Information</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${showInfo ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showInfo && (
        <div className="space-y-4 pl-2">
          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <textarea
              value={zone.description || ""}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="What is this zone used for?"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 resize-none"
              rows={2}
            />
          </div>

          {/* Sub Type */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Zone Sub-Type</label>
            <input
              type="text"
              value={zone.subType || ""}
              onChange={(e) => onUpdate({ subType: e.target.value })}
              placeholder={`e.g., ${
                zone.type === "production"
                  ? "Assembly Line, Quality Control"
                  : zone.type === "storage"
                  ? "Cold Storage, Dry Goods"
                  : zone.type === "packing"
                  ? "Final Packaging, Labeling"
                  : zone.type === "office"
                  ? "Administration, Meeting Rooms"
                  : "Specify area type..."
              }`}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400"
            />
          </div>

          {/* Assigned Teams */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">Assigned Teams</label>
            {zone.assignedTeams && zone.assignedTeams.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {zone.assignedTeams.map((team) => (
                  <div
                    key={team}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                  >
                    <span>{team}</span>
                    <button
                      onClick={() => onRemoveTeam(team)}
                      className="hover:text-blue-900"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={newTeam}
                onChange={(e) => setNewTeam(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddTeam()}
                placeholder="Add team name..."
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400"
              />
              <button
                onClick={handleAddTeam}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Supervisor */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Supervisor</label>
            <input
              type="text"
              value={zone.supervisor || ""}
              onChange={(e) => onUpdate({ supervisor: e.target.value })}
              placeholder="Zone supervisor or manager..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400"
            />
          </div>

          {/* Shift Schedule */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Shift Schedule</label>
            <input
              type="text"
              value={zone.shiftSchedule || ""}
              onChange={(e) => onUpdate({ shiftSchedule: e.target.value })}
              placeholder="e.g., 24/7, Day Shift Only, 8am-5pm..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
            <textarea
              value={zone.notes || ""}
              onChange={(e) => onUpdate({ notes: e.target.value })}
              placeholder="Additional notes or instructions..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 resize-none"
              rows={2}
            />
          </div>
        </div>
      )}
    </div>
  )
}

