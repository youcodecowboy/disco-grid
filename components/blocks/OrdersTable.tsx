"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Order, getOrderPriorityColor, isOrderOverdue, getDaysUntilShip } from "@/lib/data/orders"
import { OrderStatusBadge } from "./OrderStatusBadge"
import { OrderProgressBar } from "./OrderProgressBar"

type OrdersTableProps = {
  orders: Order[]
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

const CopyIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
)

const ChevronRightIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
)

const FlagIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
  </svg>
)

export function OrdersTable({ orders, className = "" }: OrdersTableProps) {
  const router = useRouter()
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  const handleViewOrder = (order: Order, e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: Navigate to order detail page
    alert(`View order: ${order.name}`)
  }

  const handleEditOrder = (order: Order, e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/orders/new?edit=${order.id}`)
  }

  const handleSendMessage = (order: Order, e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: Open message modal
    alert(`Send message about: ${order.name}`)
  }

  const handleCloneOrder = (order: Order, e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: Clone order flow
    alert(`Clone order: ${order.name}`)
  }

  const handleRowClick = (order: Order) => {
    // TODO: Navigate to order detail page
    alert(`Opening order detail: ${order.name}`)
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[250px]">
                  Order Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[180px]">
                  Client
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[160px]">
                  Progress
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[180px]">
                  Timeline
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                  Team
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => {
                const isHovered = hoveredRow === order.id
                const overdue = isOrderOverdue(order)
                const daysUntilShip = getDaysUntilShip(order)

                return (
                  <tr
                    key={order.id}
                    className="hover:bg-blue-50 cursor-pointer transition-colors group border-b-[3px] border-gray-100"
                    onClick={() => handleRowClick(order)}
                    onMouseEnter={() => setHoveredRow(order.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    {/* Actions */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => handleViewOrder(order, e)}
                          className="p-1.5 hover:bg-blue-100 rounded transition-colors text-gray-600 hover:text-blue-600"
                          title="View Details"
                        >
                          <EyeIcon />
                        </button>
                        <button
                          onClick={(e) => handleEditOrder(order, e)}
                          className="p-1.5 hover:bg-yellow-100 rounded transition-colors text-gray-600 hover:text-yellow-600"
                          title="Edit Order"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={(e) => handleSendMessage(order, e)}
                          className="p-1.5 hover:bg-green-100 rounded transition-colors text-gray-600 hover:text-green-600"
                          title="Send Message"
                        >
                          <MailIcon />
                        </button>
                        <button
                          onClick={(e) => handleCloneOrder(order, e)}
                          className="p-1.5 hover:bg-purple-100 rounded transition-colors text-gray-600 hover:text-purple-600"
                          title="Clone Order"
                        >
                          <CopyIcon />
                        </button>
                      </div>
                    </td>

                    {/* Order Name */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{order.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            {order.tags.map((tag, idx) => (
                              <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        {isHovered && (
                          <ChevronRightIcon className="w-3.5 h-3.5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                        )}
                      </div>
                    </td>

                    {/* Order ID */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded inline-block">
                        {order.id}
                      </div>
                    </td>

                    {/* Client */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                        {order.client}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <OrderStatusBadge status={order.status} />
                    </td>

                    {/* Progress */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <OrderProgressBar
                        progressPercent={order.progressPercent}
                        completedItems={order.completedLineItems}
                        totalItems={order.totalLineItems}
                      />
                    </td>

                    {/* Items */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="font-semibold">{order.totalItemCodes} codes</div>
                        <div className="text-xs text-gray-500">
                          {order.totalLineItems.toLocaleString()} units
                        </div>
                      </div>
                    </td>

                    {/* Timeline */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center gap-1">
                          <span>{new Date(order.startDate).toLocaleDateString()}</span>
                          <span className="text-gray-400">→</span>
                          <span className={overdue ? "text-red-600 font-semibold" : ""}>
                            {new Date(order.shipDate).toLocaleDateString()}
                          </span>
                        </div>
                        {overdue ? (
                          <div className="text-xs text-red-600 font-medium mt-1">
                            Overdue by {Math.abs(daysUntilShip)} days
                          </div>
                        ) : daysUntilShip <= 7 && order.status !== "Completed" ? (
                          <div className="text-xs text-orange-600 font-medium mt-1">
                            {daysUntilShip} days remaining
                          </div>
                        ) : (
                          <div className="text-xs text-gray-500 mt-1">
                            {daysUntilShip} days remaining
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Team */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.assignedTeam}</div>
                    </td>

                    {/* Owner */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-600">
                          {order.owner.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="text-sm text-gray-900">{order.owner}</div>
                      </div>
                    </td>

                    {/* Value */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      {order.orderValue && (
                        <div className="text-sm font-medium text-gray-900">
                          ${order.orderValue.toLocaleString()}
                        </div>
                      )}
                    </td>

                    {/* Priority */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <FlagIcon className={`${getOrderPriorityColor(order.priority)}`} />
                        <span className={`text-sm font-medium capitalize ${getOrderPriorityColor(order.priority)}`}>
                          {order.priority}
                        </span>
                      </div>
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
            Showing {orders.length} orders • {orders.reduce((sum, o) => sum + o.totalLineItems, 0).toLocaleString()} total line items
          </div>
          <div className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
            → Scroll horizontally to see all details
          </div>
        </div>
      </div>
    </div>
  )
}
