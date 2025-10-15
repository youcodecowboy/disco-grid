// Final Step: Review & Calendar

import { useMemo } from "react"
import { AlertCircle, CheckCircle2, Calendar as CalendarIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { OrderInfo, ItemProfile } from "@/lib/orders-v2/types"
import { checkCapacityWarnings } from "@/lib/orders-v2/capacityUtils"
import { WORKFLOW_LIBRARY } from "@/lib/orders-v2/types"

type ReviewCalendarStepProps = {
  orderInfo: OrderInfo
  items: ItemProfile[]
  onEditOrderInfo: () => void
  onEditItem: (index: number) => void
}

export function ReviewCalendarStep({ orderInfo, items, onEditOrderInfo, onEditItem }: ReviewCalendarStepProps) {
  const warnings = useMemo(() => checkCapacityWarnings(items), [items])
  
  const workflows = useMemo(() => {
    const uniqueWorkflows = new Set<string>()
    items.forEach(item => {
      if (item.workflow) uniqueWorkflows.add(item.workflow)
      item.components.forEach(comp => {
        if (comp.workflow) uniqueWorkflows.add(comp.workflow)
      })
    })
    return Array.from(uniqueWorkflows)
  }, [items])

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      {/* Order Summary */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Order Summary</h2>
          <button
            onClick={onEditOrderInfo}
            className="text-sm text-sky-600 hover:text-sky-700"
          >
            Edit
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="space-y-3">
            {/* Order Name with Icon */}
            <div className="flex items-start gap-3">
              {orderInfo.symbol && (
                <span className="text-2xl">{orderInfo.symbol}</span>
              )}
              <div className="flex-1">
                {orderInfo.orderNumber && (
                  <p className="text-xs font-mono text-slate-500 mb-1">{orderInfo.orderNumber}</p>
                )}
                <p className="text-lg font-semibold text-slate-900">{orderInfo.name}</p>
                {/* Priority and Flags */}
                {(orderInfo.priority || (orderInfo.flags || []).length > 0) && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {orderInfo.priority && (
                      <Badge className={
                        orderInfo.priority === "low" ? "bg-slate-100 text-slate-700" :
                        orderInfo.priority === "medium" ? "bg-blue-100 text-blue-700" :
                        orderInfo.priority === "high" ? "bg-amber-100 text-amber-700" :
                        "bg-rose-100 text-rose-700"
                      }>
                        {orderInfo.priority.charAt(0).toUpperCase() + orderInfo.priority.slice(1)}
                      </Badge>
                    )}
                    {(orderInfo.flags || []).map(flag => (
                      <Badge key={flag} className="bg-slate-100 text-slate-700 text-xs">
                        {flag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500">Client</p>
              <p className="text-base font-medium text-slate-700">{orderInfo.client}</p>
            </div>
            {orderInfo.startDate && (
              <div>
                <p className="text-sm text-slate-500">Start Date</p>
                <p className="text-base text-slate-700">{new Date(orderInfo.startDate).toLocaleDateString()}</p>
              </div>
            )}
            {orderInfo.shipDate && (
              <div>
                <p className="text-sm text-slate-500">Ship Date</p>
                <p className="text-base text-slate-700">{new Date(orderInfo.shipDate).toLocaleDateString()}</p>
              </div>
            )}
            {orderInfo.contacts.length > 0 && (
              <div>
                <p className="text-sm text-slate-500 mb-1">Contacts</p>
                <div className="flex flex-wrap gap-1.5">
                  {orderInfo.contacts.map(contact => (
                    <Badge key={contact} className="bg-slate-100 text-slate-700 text-xs">
                      {contact}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Items Summary */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Items ({items.length})</h2>
        
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-base font-semibold text-slate-900">{item.name || `Item ${index + 1}`}</h3>
                    <Badge className={`text-xs ${item.complexity === "simple" ? "bg-sky-100 text-sky-700" : "bg-purple-100 text-purple-700"}`}>
                      {item.complexity === "simple" ? "Simple" : "Complex"}
                    </Badge>
                    {item.workflow && (
                      <Badge className="text-xs bg-slate-100 text-slate-600">
                        {WORKFLOW_LIBRARY.find(w => w.id === item.workflow)?.label}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Code:</span>{" "}
                      <span className="text-slate-700">{item.code || "—"}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Quantity:</span>{" "}
                      <span className="text-slate-700">{item.quantity.toLocaleString()}</span>
                    </div>
                    {item.complexity === "complex" && (
                      <div>
                        <span className="text-slate-500">Components:</span>{" "}
                        <span className="text-slate-700">{item.components.length}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => onEditItem(index)}
                  className="text-sm text-sky-600 hover:text-sky-700"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline & Capacity */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-1">Timeline & Capacity Planning</h2>
          <p className="text-sm text-slate-500">Smart scheduling based on your workflows and production capacity</p>
        </div>

        {/* Workflows Used */}
        {workflows.length > 0 && (
          <div className="rounded-xl bg-sky-50 border border-sky-200 p-4">
            <p className="text-sm font-medium text-sky-900 mb-2">Workflows in use:</p>
            <div className="flex flex-wrap gap-2">
              {workflows.map(workflowId => {
                const workflow = WORKFLOW_LIBRARY.find(w => w.id === workflowId)
                const itemsUsingWorkflow = items.filter(i => 
                  i.workflow === workflowId || 
                  i.components.some(c => c.workflow === workflowId)
                )
                return (
                  <Badge key={workflowId} className="bg-white border border-sky-300 text-sky-700 text-sm">
                    {workflow?.label} ({itemsUsingWorkflow.length} {itemsUsingWorkflow.length === 1 ? 'item' : 'items'})
                  </Badge>
                )
              })}
            </div>
          </div>
        )}

        {/* Capacity Warnings */}
        <div className="space-y-2">
          {warnings.map((warning, idx) => (
            <div
              key={idx}
              className={`rounded-xl border p-4 flex items-start gap-3 ${
                warning.type === "error" ? "bg-rose-50 border-rose-200" :
                warning.type === "warning" ? "bg-amber-50 border-amber-200" :
                "bg-emerald-50 border-emerald-200"
              }`}
            >
              {warning.type === "error" ? (
                <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              ) : warning.type === "warning" ? (
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  warning.type === "error" ? "text-rose-900" :
                  warning.type === "warning" ? "text-amber-900" :
                  "text-emerald-900"
                }`}>
                  {warning.message}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Simplified Calendar Placeholder */}
        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-12">
          <div className="text-center">
            <CalendarIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Interactive Timeline</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Visual timeline with draggable workflow stages will be displayed here, showing existing orders and capacity planning.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

