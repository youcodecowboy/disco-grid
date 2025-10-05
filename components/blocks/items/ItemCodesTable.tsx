"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ItemCode, getItemCodeProgress, getItemCodeStatusColor } from "@/lib/data/itemCodes"

type ItemCodesTableProps = {
  itemCodes: ItemCode[]
  className?: string
}

const EyeIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
)

const MailIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const EditIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
)

const BellIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
)

const ChevronRightIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

export function ItemCodesTable({ itemCodes, className = "" }: ItemCodesTableProps) {
  const router = useRouter()
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  const handleViewItem = (itemCode: ItemCode, e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/items/${itemCode.id}`)
  }

  const handleSendMessage = (itemCode: ItemCode, e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: Open message modal
    alert(`Send message about: ${itemCode.name}`)
  }

  const handleEditItem = (itemCode: ItemCode, e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: Open edit modal
    alert(`Edit: ${itemCode.name}`)
  }

  const handleSetNotifications = (itemCode: ItemCode, e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: Open notifications modal
    alert(`Set notifications for: ${itemCode.name}`)
  }

  const handleRowClick = (itemCode: ItemCode) => {
    router.push(`/items/${itemCode.id}`)
  }

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Table Container with Horizontal Scroll */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-full inline-block align-middle">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Header */}
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                  Item Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">
                  Item Code
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                  Workflow
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                  Team
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                {/* Variant Attributes */}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50 border-l-2 border-blue-200">
                  Variants
                </th>
                {/* Shared Attributes */}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-purple-50 border-l-2 border-purple-200" colSpan={4}>
                  Attributes
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {itemCodes.map((itemCode) => {
                const progress = getItemCodeProgress(itemCode)
                const isHovered = hoveredRow === itemCode.id

                return (
                  <tr
                    key={itemCode.id}
                    className="hover:bg-blue-50 cursor-pointer transition-colors group border-b-[3px] border-gray-100"
                    onClick={() => handleRowClick(itemCode)}
                    onMouseEnter={() => setHoveredRow(itemCode.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    {/* Actions */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => handleViewItem(itemCode, e)}
                          className="p-1.5 hover:bg-blue-100 rounded transition-colors text-gray-600 hover:text-blue-600"
                          title="View Details"
                        >
                          <EyeIcon />
                        </button>
                        <button
                          onClick={(e) => handleSendMessage(itemCode, e)}
                          className="p-1.5 hover:bg-green-100 rounded transition-colors text-gray-600 hover:text-green-600"
                          title="Send Message"
                        >
                          <MailIcon />
                        </button>
                        <button
                          onClick={(e) => handleEditItem(itemCode, e)}
                          className="p-1.5 hover:bg-yellow-100 rounded transition-colors text-gray-600 hover:text-yellow-600"
                          title="Edit Item"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={(e) => handleSetNotifications(itemCode, e)}
                          className="p-1.5 hover:bg-purple-100 rounded transition-colors text-gray-600 hover:text-purple-600"
                          title="Notifications"
                        >
                          <BellIcon />
                        </button>
                      </div>
                    </td>

                    {/* Item Name */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{itemCode.name}</div>
                          <div className="text-xs text-gray-500">{itemCode.orderName}</div>
                        </div>
                        {isHovered && (
                          <ChevronRightIcon className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                    </td>

                    {/* Item Code */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                        {itemCode.code}
                      </div>
                    </td>

                    {/* Quantity */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="font-semibold">{itemCode.quantity}</div>
                        <div className="text-xs text-gray-500">
                          {itemCode.lineItemsCompleted} done
                        </div>
                      </div>
                    </td>

                    {/* Progress */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="w-24">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                progress === 100
                                  ? "bg-green-500"
                                  : progress > 50
                                  ? "bg-blue-500"
                                  : "bg-yellow-500"
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-700 min-w-[32px]">
                            {progress}%
                          </span>
                        </div>
                        {itemCode.lineItemsInProduction > 0 && (
                          <div className="text-xs text-blue-600 mt-1">
                            {itemCode.lineItemsInProduction} in progress
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getItemCodeStatusColor(itemCode.status)}`}>
                        {itemCode.status}
                      </span>
                    </td>

                    {/* Workflow */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{itemCode.workflow}</div>
                    </td>

                    {/* Team */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{itemCode.assignedTeam}</div>
                      <div className="text-xs text-gray-500">{itemCode.owner}</div>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{itemCode.primaryLocation}</div>
                    </td>

                    {/* Type */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        itemCode.type === "complex"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {itemCode.type}
                      </span>
                    </td>

                    {/* Variant Attributes */}
                    <td className="px-4 py-4 whitespace-nowrap bg-blue-50/30 border-l-2 border-blue-200">
                      <div className="space-y-1">
                        {itemCode.variantAttributes.map((attr, idx) => (
                          <div key={idx} className="text-xs">
                            <span className="font-medium text-blue-900">{attr.field}:</span>{" "}
                            <span className="text-blue-700">{attr.value}</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Shared Attributes (showing first 4 in horizontal scroll) */}
                    {itemCode.attributes.slice(0, 4).map((attr, idx) => (
                      <td key={idx} className="px-4 py-4 whitespace-nowrap bg-purple-50/30 border-l border-purple-100">
                        <div className="text-xs">
                          <div className="font-medium text-purple-900">{attr.field}</div>
                          <div className="text-purple-700">{attr.value}</div>
                        </div>
                      </td>
                    ))}

                    {/* Due Date */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(itemCode.dueDate).toLocaleDateString()}
                      </div>
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

      {/* Footer Info */}
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-500">
        <div className="flex items-center justify-between">
          <div>
            Showing {itemCodes.length} item codes • {itemCodes.reduce((sum, ic) => sum + ic.quantity, 0)} total line items
          </div>
          <div className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
            → Scroll horizontally to see all attributes
          </div>
        </div>
      </div>
    </div>
  )
}
