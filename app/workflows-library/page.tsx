"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Workflow,
    Plus,
    Search,
    Lock,
    Trash2,
    Edit2,
    Calendar,
    Link as LinkIcon,
    ArrowLeft
} from "lucide-react"
import { LayoutScaffold } from "@/components/grid-v2/LayoutScaffold"

interface SavedWorkflow {
  id: string
  name: string
  blocks: any[]
  connections: any[]
  createdAt: string
  updatedAt: string
  isLocked: boolean
}

export default function WorkflowLibraryPage() {
  const router = useRouter()
  const [workflows, setWorkflows] = useState<SavedWorkflow[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("workflow-library")
    if (saved) {
      try {
        setWorkflows(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load workflows:", e)
      }
    }
  }, [])

  const filteredWorkflows = workflows.filter((w) =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const deleteWorkflow = (id: string) => {
    const workflow = workflows.find((w) => w.id === id)
    if (!workflow) return

    if (confirm(`Delete "${workflow.name}"? This cannot be undone.`)) {
      const updated = workflows.filter((w) => w.id !== id)
      setWorkflows(updated)
      localStorage.setItem("workflow-library", JSON.stringify(updated))
    }
  }

  const duplicateWorkflow = (id: string) => {
    const workflow = workflows.find((w) => w.id === id)
    if (!workflow) return

    const duplicate: SavedWorkflow = {
      ...workflow,
      id: `wf-${Date.now()}`,
      name: `${workflow.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isLocked: false,
    }

    const updated = [...workflows, duplicate]
    setWorkflows(updated)
    localStorage.setItem("workflow-library", JSON.stringify(updated))
  }

  return (
    <LayoutScaffold
      pageTitle="Workflow Library"
      headerActions={
        <div className="flex items-center gap-3">
          <Button
            onClick={() => router.push("/workflows-grid-test")}
            size="sm"
            variant="outline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Builder
          </Button>
          <Button
            onClick={() => router.push("/workflows-grid-test")}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Workflow
          </Button>
        </div>
      }
    >
      {/* Header Section */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 border rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <Workflow className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Workflow Library</h2>
              <p className="text-sm text-gray-600 mb-3">
                Manage and organize all your saved workflows. Load, edit, duplicate, or delete workflows.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-gray-700">
                    <strong>{workflows.length}</strong> total workflows
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <span className="text-gray-700">
                    <strong>{workflows.filter((w) => w.isLocked).length}</strong> locked
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="w-80">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search workflows..."
                className="pl-9"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Workflows Table */}
      {filteredWorkflows.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed">
          <Workflow className="h-20 w-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchQuery ? "No workflows found" : "No workflows yet"}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery
              ? "Try a different search term"
              : "Create your first workflow to get started"}
          </p>
          {!searchQuery && (
            <Button
              onClick={() => router.push("/workflows-grid-test")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Workflow
            </Button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Workflow Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Stages
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Connections
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredWorkflows
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .map((workflow) => (
                  <tr
                    key={workflow.id}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Workflow className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{workflow.name}</div>
                          <div className="text-xs text-gray-500">ID: {workflow.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1">
                          {workflow.blocks.slice(0, 3).map((block, idx) => (
                            <div
                              key={idx}
                              className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 border-2 border-white flex items-center justify-center text-xs font-semibold text-white"
                            >
                              {idx + 1}
                            </div>
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {workflow.blocks.length}
                        </span>
                        {workflow.blocks.length > 3 && (
                          <span className="text-xs text-gray-500">stages</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">
                          {workflow.connections.length}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {workflow.isLocked ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-lg">
                          <Lock className="h-3.5 w-3.5 text-amber-600" />
                          <span className="text-xs font-medium text-amber-700">Locked</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-lg">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <span className="text-xs font-medium text-green-700">Active</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="font-medium">
                            {new Date(workflow.updatedAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(workflow.updatedAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          onClick={() => router.push(`/workflows-grid-test?load=${workflow.id}`)}
                          size="sm"
                          variant="outline"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Edit2 className="h-3.5 w-3.5 mr-1.5" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => duplicateWorkflow(workflow.id)}
                          size="sm"
                          variant="outline"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Plus className="h-3.5 w-3.5 mr-1.5" />
                          Duplicate
                        </Button>
                        <Button
                          onClick={() => deleteWorkflow(workflow.id)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:bg-red-50 hover:border-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </LayoutScaffold>
  )
}
