"use client"

import { useState, useEffect } from "react"
import { useSiteMap } from "../context/SiteMapContext"
import type { SiteElement } from "@/lib/site-map/types"

interface ElementDetailsDrawerProps {
  elementId: string | null
  onClose: () => void
}

export function ElementDetailsDrawer({ elementId, onClose }: ElementDetailsDrawerProps) {
  const { siteMap, updateElement } = useSiteMap()
  const element = elementId ? siteMap.elements[elementId] : null

  const [formData, setFormData] = useState<Partial<SiteElement>>({})

  // Load element data into form
  useEffect(() => {
    if (element) {
      setFormData(element)
    }
  }, [element])

  // Smart storage zone generator - always define the effect, but only run logic when needed
  useEffect(() => {
    if (element?.type === "storage" && formData.properties?.racks && formData.properties?.shelvesPerRack) {
      const racks = formData.properties.racks
      const shelvesPerRack = formData.properties.shelvesPerRack
      const capacityPerShelf = formData.properties.capacityPerShelf || 10

      const zones: any[] = []
      for (let rack = 1; rack <= racks; rack++) {
        for (let shelf = 1; shelf <= shelvesPerRack; shelf++) {
          zones.push({
            id: `${element.id}-R${rack}-S${shelf}`,
            label: `Rack ${rack} - Shelf ${shelf}`,
            rackNumber: rack,
            shelfNumber: shelf,
            capacity: capacityPerShelf,
            occupied: 0,
          })
        }
      }

      setFormData((prev) => ({
        ...prev,
        properties: {
          ...(prev.properties || {}),
          zones,
          totalZones: zones.length,
        },
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [element?.type, element?.id, formData.properties?.racks, formData.properties?.shelvesPerRack, formData.properties?.capacityPerShelf])

  // Early return AFTER all hooks
  if (!element || !elementId) return null

  const handleSave = () => {
    updateElement(elementId, formData)
    onClose()
  }

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePropertyChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      properties: { ...(prev.properties || {}), [key]: value },
    }))
  }

  const renderTypeSpecificFields = () => {
    switch (element.type) {
      case "storage":
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                <strong>Smart Storage:</strong> Configure racks and shelves, and we'll automatically generate zone IDs
                for each storage location.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Racks</label>
              <input
                type="number"
                min="1"
                value={formData.properties?.racks || 4}
                onChange={(e) => handlePropertyChange("racks", parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shelves per Rack</label>
              <input
                type="number"
                min="1"
                value={formData.properties?.shelvesPerRack || 5}
                onChange={(e) => handlePropertyChange("shelvesPerRack", parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Capacity per Shelf</label>
              <input
                type="number"
                min="1"
                value={formData.properties?.capacityPerShelf || 10}
                onChange={(e) => handlePropertyChange("capacityPerShelf", parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Items each shelf can hold</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Storage Type</label>
              <select
                value={formData.properties?.storageType || "shelving"}
                onChange={(e) => handlePropertyChange("storageType", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="shelving">Shelving</option>
                <option value="pallet-rack">Pallet Rack</option>
                <option value="bin">Bin Storage</option>
                <option value="drawer">Drawer System</option>
                <option value="cabinet">Cabinet</option>
              </select>
            </div>

            {formData.properties?.zones && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Generated Storage Zones</h4>
                <p className="text-sm text-gray-600 mb-3">
                  {formData.properties.zones.length} zones ({formData.properties.racks} racks ×{" "}
                  {formData.properties.shelvesPerRack} shelves)
                </p>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {formData.properties.zones.slice(0, 10).map((zone: any) => (
                    <div key={zone.id} className="text-xs bg-white p-2 rounded border border-gray-200">
                      <span className="font-medium text-gray-900">{zone.id}</span> - {zone.label} (Capacity:{" "}
                      {zone.capacity})
                    </div>
                  ))}
                  {formData.properties.zones.length > 10 && (
                    <p className="text-xs text-gray-500 italic">+ {formData.properties.zones.length - 10} more...</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )

      case "machine":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Machine Model</label>
              <input
                type="text"
                value={formData.properties?.model || ""}
                onChange={(e) => handlePropertyChange("model", e.target.value)}
                placeholder="e.g., Haas VF-2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year Installed</label>
              <input
                type="number"
                value={formData.properties?.year || new Date().getFullYear()}
                onChange={(e) => handlePropertyChange("year", parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Serial Number</label>
              <input
                type="text"
                value={formData.properties?.serialNumber || ""}
                onChange={(e) => handlePropertyChange("serialNumber", e.target.value)}
                placeholder="Machine serial number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Schedule</label>
              <select
                value={formData.properties?.maintenanceSchedule || "monthly"}
                onChange={(e) => handlePropertyChange("maintenanceSchedule", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
              </select>
            </div>
          </div>
        )

      case "zone":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Zone Capacity (people)</label>
              <input
                type="number"
                min="1"
                value={formData.properties?.capacity || 10}
                onChange={(e) => handlePropertyChange("capacity", parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Workstations</label>
              <input
                type="number"
                min="0"
                value={formData.properties?.workstations || 4}
                onChange={(e) => handlePropertyChange("workstations", parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Zone Type</label>
              <select
                value={formData.properties?.zoneType || "production"}
                onChange={(e) => handlePropertyChange("zoneType", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="production">Production</option>
                <option value="assembly">Assembly</option>
                <option value="qa">Quality Assurance</option>
                <option value="inspection">Inspection</option>
                <option value="packaging">Packaging</option>
                <option value="office">Office</option>
              </select>
            </div>
          </div>
        )

      case "production-line":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Stations</label>
              <input
                type="number"
                min="1"
                value={formData.properties?.stations || 8}
                onChange={(e) => handlePropertyChange("stations", parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Throughput (units/hour)</label>
              <input
                type="number"
                min="1"
                value={formData.properties?.throughput || 50}
                onChange={(e) => handlePropertyChange("throughput", parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Line Type</label>
              <select
                value={formData.properties?.lineType || "manual"}
                onChange={(e) => handlePropertyChange("lineType", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="manual">Manual</option>
                <option value="semi-automated">Semi-Automated</option>
                <option value="automated">Fully Automated</option>
              </select>
            </div>
          </div>
        )

      case "station":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Equipment</label>
              <input
                type="text"
                value={formData.properties?.equipment?.join(", ") || ""}
                onChange={(e) => handlePropertyChange("equipment", e.target.value.split(",").map((s) => s.trim()))}
                placeholder="e.g., MIG Welder, TIG Welder"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Comma-separated list</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Station Type</label>
              <select
                value={formData.properties?.stationType || "assembly"}
                onChange={(e) => handlePropertyChange("stationType", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="assembly">Assembly</option>
                <option value="welding">Welding</option>
                <option value="cutting">Cutting</option>
                <option value="painting">Painting</option>
                <option value="inspection">Inspection</option>
                <option value="packaging">Packaging</option>
              </select>
            </div>
          </div>
        )

      case "equipment":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Equipment Model</label>
              <input
                type="text"
                value={formData.properties?.model || ""}
                onChange={(e) => handlePropertyChange("model", e.target.value)}
                placeholder="Model number or name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specifications</label>
              <input
                type="text"
                value={formData.properties?.capacity || ""}
                onChange={(e) => handlePropertyChange("capacity", e.target.value)}
                placeholder="e.g., 37 kW"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-[480px] bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{element.icon}</span>
                <h2 className="text-xl font-bold text-gray-900">{element.name}</h2>
              </div>
              <p className="text-sm text-gray-500 capitalize">{element.type.replace("-", " ")}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              title="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Basic Information</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description || ""}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status || "active"}
                onChange={(e) => handleFieldChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            {element.type === "storage" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Capacity</label>
                <input
                  type="number"
                  value={formData.capacity || 0}
                  onChange={(e) => handleFieldChange("capacity", parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Overall storage capacity</p>
              </div>
            )}
          </div>

          {/* Type-specific fields */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              {element.type.replace("-", " ")} Details
            </h3>
            {renderTypeSpecificFields()}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  )
}

