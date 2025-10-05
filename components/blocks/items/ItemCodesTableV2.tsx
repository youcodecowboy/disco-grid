"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ItemCode, getItemCodeProgress, getItemCodeStatusColor } from "@/lib/data/itemCodes"

export type ItemCodesTableV2Props = {
  block?: {
    id: string
    title?: string
    props?: any
  }
}

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
)

const MailIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
)

const BellIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
)

const ChevronRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

export function ItemCodesTableV2({ block }: ItemCodesTableV2Props) {
  const router = useRouter()
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)
  
  // Get itemCodes from block props or use empty array
  const itemCodes: ItemCode[] = block?.props?.itemCodes || []

  const handleViewItem = (itemCode: ItemCode, e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/items/${itemCode.id}`)
  }

  const handleSendMessage = (itemCode: ItemCode, e: React.MouseEvent) => {
    e.stopPropagation()
    alert(`Send message about: ${itemCode.name}`)
  }

  const handleEditItem = (itemCode: ItemCode, e: React.MouseEvent) => {
    e.stopPropagation()
    alert(`Edit: ${itemCode.name}`)
  }

  const handleSetNotifications = (itemCode: ItemCode, e: React.MouseEvent) => {
    e.stopPropagation()
    alert(`Set notifications for: ${itemCode.name}`)
  }

  const handleRowClick = (itemCode: ItemCode) => {
    router.push(`/items/${itemCode.id}`)
  }

  // Calculate live metrics
  const lastUpdated = itemCodes.length > 0 
    ? itemCodes.reduce((latest, ic) => new Date(ic.updatedAt) > new Date(latest.updatedAt) ? ic : latest)
    : null
  const atRisk = itemCodes.filter(ic => 
    new Date(ic.dueDate) < new Date() && ic.status !== "Completed" && ic.status !== "Ready"
  ).length
  const activeToday = itemCodes.reduce((sum, ic) => sum + ic.lineItemsInProduction, 0)

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Live Metrics Bar */}
      <div className="px-4 py-2 border-b border-gray-200 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
        <div className="flex items-center justify-between gap-4">
          {/* Left side - Quick stats */}
          <div className="flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Total:</span>
              <span className="font-semibold text-gray-900">{itemCodes.length} codes</span>
              <span className="text-gray-400">•</span>
              <span className="font-semibold text-gray-900">{itemCodes.reduce((sum, ic) => sum + ic.quantity, 0)} units</span>
            </div>
            
            {activeToday > 0 && (
              <>
                <div className="h-4 w-px bg-gray-300" />
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-gray-600">{activeToday} active now</span>
                </div>
              </>
            )}
            
            {atRisk > 0 && (
              <>
                <div className="h-4 w-px bg-gray-300" />
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-red-600 font-medium">{atRisk} at risk</span>
                </div>
              </>
            )}
          </div>

          {/* Right side - Last updated */}
          <div className="flex items-center gap-6 text-xs">
            {lastUpdated && (
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Last updated: <span className="font-medium text-gray-900">{lastUpdated.name}</span></span>
                <span className="text-gray-400">• {new Date(lastUpdated.updatedAt).toLocaleTimeString()}</span>
              </div>
            )}
            
            <div className="text-blue-600 font-medium">
              ← → Scroll to see all attributes
            </div>
          </div>
        </div>
      </div>

      {/* Table with horizontal scroll - edge to edge */}
      <div className="flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Header */}
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[180px]">Item Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[130px]">Code</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[140px]">Progress</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[150px]">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[140px]">Workflow</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[140px]">Location</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-blue-50 border-l-2 border-blue-200">Variants</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-purple-50 border-l-2 border-purple-200" colSpan={4}>Attributes</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="bg-white divide-y-[3px] divide-gray-100">
            {itemCodes.map((itemCode) => {
              const progress = getItemCodeProgress(itemCode)
              const isHovered = hoveredRow === itemCode.id

              return (
                <tr
                  key={itemCode.id}
                  className="hover:bg-blue-50/50 cursor-pointer transition-all group"
                  onClick={() => handleRowClick(itemCode)}
                  onMouseEnter={() => setHoveredRow(itemCode.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  {/* Actions */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleViewItem(itemCode, e)}
                        className="p-1 hover:bg-blue-100 rounded text-gray-600 hover:text-blue-600 transition-colors"
                        title="View"
                      >
                        <EyeIcon />
                      </button>
                      <button
                        onClick={(e) => handleSendMessage(itemCode, e)}
                        className="p-1 hover:bg-green-100 rounded text-gray-600 hover:text-green-600 transition-colors"
                        title="Message"
                      >
                        <MailIcon />
                      </button>
                      <button
                        onClick={(e) => handleEditItem(itemCode, e)}
                        className="p-1 hover:bg-yellow-100 rounded text-gray-600 hover:text-yellow-600 transition-colors"
                        title="Edit"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={(e) => handleSetNotifications(itemCode, e)}
                        className="p-1 hover:bg-purple-100 rounded text-gray-600 hover:text-purple-600 transition-colors"
                        title="Notify"
                      >
                        <BellIcon />
                      </button>
                    </div>
                  </td>

                  {/* Item Name */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{itemCode.name}</div>
                        <div className="text-xs text-gray-500">{itemCode.orderName}</div>
                      </div>
                      {isHovered && (
                        <ChevronRightIcon />
                      )}
                    </div>
                  </td>

                  {/* Code */}
                  <td className="px-4 py-4">
                    <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{itemCode.code}</code>
                  </td>

                  {/* Quantity */}
                  <td className="px-4 py-4">
                    <div className="text-sm font-semibold">{itemCode.quantity}</div>
                    <div className="text-xs text-gray-500">{itemCode.lineItemsCompleted} done</div>
                  </td>

                  {/* Progress */}
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${progress === 100 ? "bg-green-500" : progress > 50 ? "bg-blue-500" : "bg-yellow-500"}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{progress}%</span>
                      </div>
                      {itemCode.lineItemsInProduction > 0 && (
                        <div className="text-xs text-blue-600">{itemCode.lineItemsInProduction} active</div>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getItemCodeStatusColor(itemCode.status)}`}>
                      {itemCode.status}
                    </span>
                  </td>

                  {/* Workflow */}
                  <td className="px-4 py-4 text-sm text-gray-900">{itemCode.workflow}</td>

                  {/* Team */}
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">{itemCode.assignedTeam}</div>
                    <div className="text-xs text-gray-500">{itemCode.owner}</div>
                  </td>

                  {/* Location */}
                  <td className="px-4 py-4 text-sm text-gray-900">{itemCode.primaryLocation}</td>

                  {/* Variants */}
                  <td className="px-4 py-4 bg-blue-50/30 border-l-2 border-blue-200">
                    <div className="space-y-1">
                      {itemCode.variantAttributes.map((attr, idx) => (
                        <div key={idx} className="text-xs">
                          <span className="font-medium text-blue-900">{attr.field}:</span>{" "}
                          <span className="text-blue-700">{attr.value}</span>
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Attributes */}
                  {itemCode.attributes.slice(0, 4).map((attr, idx) => (
                    <td key={idx} className="px-4 py-4 bg-purple-50/30 border-l border-purple-100">
                      <div className="text-xs">
                        <div className="font-medium text-purple-900">{attr.field}</div>
                        <div className="text-purple-700">{attr.value}</div>
                      </div>
                    </td>
                  ))}

                  {/* Due Date */}
                  <td className="px-4 py-4">
                    <div className="text-sm">{new Date(itemCode.dueDate).toLocaleDateString()}</div>
                    {new Date(itemCode.dueDate) < new Date() && itemCode.status !== "Completed" && (
                      <div className="text-xs text-red-600 font-medium">Overdue</div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
