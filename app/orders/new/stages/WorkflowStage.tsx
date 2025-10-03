"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { ItemProfile } from "../types"

type WorkflowStageProps = {
  items: ItemProfile[]
  activeItemIndex: number
  onItemSelect: (index: number) => void
  workflowLibrary: Array<{ id: string; label: string; summary: string; duration: string }>
  onItemWorkflowChange: (itemId: string, workflowName: string, propagate?: boolean) => void
  onComponentWorkflowChange: (itemId: string, componentId: string, workflowName: string) => void
}

export function WorkflowStage({
  items,
  activeItemIndex,
  onItemSelect,
  workflowLibrary,
  onItemWorkflowChange,
  onComponentWorkflowChange,
}: WorkflowStageProps) {
  const item = items[activeItemIndex]

  return (
    <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-900">Items</h3>
        <div className="grid gap-2">
          {items.map((candidate, index) => {
            const active = index === activeItemIndex
            return (
              <button
                key={candidate.id}
                onClick={() => onItemSelect(index)}
                className={`rounded-2xl border px-3 py-3 text-left transition ${
                  active ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-blue-200"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm font-medium text-slate-900">{candidate.name}</div>
                  <Badge className="bg-slate-500 text-white text-xs">{candidate.workflow}</Badge>
                </div>
                <p className="mt-1 text-xs text-slate-500">{candidate.summary}</p>
              </button>
            )
          })}
        </div>
      </aside>

      {item ? (
        <section className="space-y-6">
          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Primary workflow</p>
                  <CardTitle className="text-xl text-slate-900">{item.name}</CardTitle>
                  <CardDescription className="text-slate-600">
                    Select a workflow from the library or propagate a new one.
                  </CardDescription>
                </div>
                <div className="text-xs text-slate-500">Components: {item.components.length || "None"}</div>
              </div>
            </CardHeader>
            <CardContent className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_200px]">
              <div>
                <label className="text-xs uppercase tracking-wide text-slate-500">Workflow template</label>
                <select
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                  value={item.workflow}
                  onChange={(event) => onItemWorkflowChange(item.id, event.target.value, true)}
                >
                  {!workflowLibrary.some((option) => option.label === item.workflow) && (
                    <option value={item.workflow}>{item.workflow}</option>
                  )}
                  {workflowLibrary.map((option) => (
                    <option key={option.id} value={option.label}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                <p>
                  {workflowLibrary.find((workflow) => workflow.label === item.workflow)?.summary ||
                    "Lookup details in Workflow Library."}
                </p>
                <p className="mt-2 font-medium text-slate-700">
                  Duration:
                  <span className="ml-1">
                    {workflowLibrary.find((workflow) => workflow.label === item.workflow)?.duration ?? "--"}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          {item.components.length > 0 && (
            <Card className="border-slate-200">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-slate-900">Component overrides</CardTitle>
                  <Button
                    variant="ghost"
                    className="h-8 px-2 text-xs text-blue-600 hover:bg-blue-50"
                    onClick={() => onItemWorkflowChange(item.id, item.workflow, true)}
                  >
                    Apply parent workflow to all
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <table className="mt-4 min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-3 py-2 text-left">Component</th>
                      <th className="px-3 py-2 text-left">Workflow</th>
                      <th className="px-3 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                    {item.components.map((component) => {
                      const value = component.workflow || item.workflow
                      return (
                        <tr key={component.id}>
                          <td className="px-3 py-2 font-medium text-slate-700">{component.name}</td>
                          <td className="px-3 py-2">
                            <select
                              className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1"
                              value={value}
                              onChange={(event) =>
                                onComponentWorkflowChange(item.id, component.id, event.target.value)
                              }
                            >
                              <option value={item.workflow}>Same as item ({item.workflow})</option>
                              {workflowLibrary.map((option) => (
                                <option key={option.id} value={option.label}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-3 py-2 text-right">
                            <button
                              className="text-blue-600 hover:underline"
                              onClick={() => onComponentWorkflowChange(item.id, component.id, item.workflow)}
                            >
                              Reset to item workflow
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
        </section>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
          Select an item to configure workflows.
        </div>
      )}
    </div>
  )
}




