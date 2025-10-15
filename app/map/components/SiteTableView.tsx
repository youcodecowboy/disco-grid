"use client"

import { useState } from "react"
import { useSiteMap } from "../context/SiteMapContext"
import type { SiteElementType, SiteElement } from "@/lib/site-map/types"

const elementTypes: { type: SiteElementType; label: string; icon: string }[] = [
  { type: "machine", label: "Machines", icon: "⚙️" },
  { type: "storage", label: "Storage", icon: "📦" },
  { type: "zone", label: "Zones", icon: "🏢" },
  { type: "production-line", label: "Production Lines", icon: "🏭" },
  { type: "station", label: "Stations", icon: "🔧" },
  { type: "equipment", label: "Equipment", icon: "🔨" },
]

export function SiteTableView() {
  const { getElementsByType, updateElement, deleteElement, siteMap } = useSiteMap()
  const [activeTab, setActiveTab] = useState<SiteElementType>("machine")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<SiteElement>>({})

  const elements = getElementsByType(activeTab)

  const handleEdit = (element: SiteElement) => {
    setEditingId(element.id)
    setEditForm(element)
  }

  const handleSave = () => {
    if (editingId) {
      updateElement(editingId, editForm)
      setEditingId(null)
      setEditForm({})
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditForm({})
  }

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete "${name}"? This action cannot be undone.`)) {
      deleteElement(id)
    }
  }

  const getFloorName = (floorId: string) => {
    const floor = siteMap.floors.find((f) => f.id === floorId)
    return floor?.name || floorId
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-1 px-6">
          {elementTypes.map((type) => {
            const count = getElementsByType(type.type).length
            return (
              <button
                key={type.type}
                onClick={() => setActiveTab(type.type)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === type.type
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span>{type.icon}</span>
                <span>{type.label}</span>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-6">
        {elements.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <span className="text-4xl mb-4">
              {elementTypes.find((t) => t.type === activeTab)?.icon}
            </span>
            <p className="text-lg font-medium">No {elementTypes.find((t) => t.type === activeTab)?.label.toLowerCase()} yet</p>
            <p className="text-sm mt-2">Switch to Map View to add elements</p>
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Floor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  {activeTab === "storage" && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Capacity
                    </th>
                  )}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {elements.map((element) => {
                  const isEditing = editingId === element.id

                  return (
                    <tr key={element.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.name || ""}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{element.icon}</span>
                            <span className="text-sm font-medium text-gray-900">{element.name}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.description || ""}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <span className="text-sm text-gray-600">{element.description || "—"}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{getFloorName(element.floor)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isEditing ? (
                          <select
                            value={editForm.status || "active"}
                            onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                            className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="maintenance">Maintenance</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              element.status === "active"
                                ? "bg-green-100 text-green-800"
                                : element.status === "maintenance"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {element.status}
                          </span>
                        )}
                      </td>
                      {activeTab === "storage" && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editForm.capacity || 0}
                              onChange={(e) => setEditForm({ ...editForm, capacity: parseInt(e.target.value) })}
                              className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <span className="text-sm text-gray-900">{element.capacity || "—"}</span>
                          )}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {isEditing ? (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={handleSave}
                              className="text-green-600 hover:text-green-900 font-medium"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancel}
                              className="text-gray-600 hover:text-gray-900 font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(element)}
                              className="text-blue-600 hover:text-blue-900 font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(element.id, element.name)}
                              className="text-red-600 hover:text-red-900 font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

