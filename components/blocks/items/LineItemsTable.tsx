"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { LineItem } from "@/lib/data/lineItems"
import type { ItemCode } from "@/lib/data/itemCodes"
import { calculateStageDuration } from "@/lib/data/lineItems"

// QR Code Modal Component
function QRCodeModal({ lineItem, onClose }: { lineItem: LineItem; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">QR Code</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* QR Code Display */}
        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-8 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-inner">
            {/* Placeholder QR code - in production, this would be an actual QR code image */}
            <div className="w-full aspect-square bg-gradient-to-br from-gray-900 to-gray-700 rounded flex items-center justify-center">
              <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm-2 8h8v8H3v-8zm2 6h4v-4H5v4zm8-14v8h8V3h-8zm6 6h-4V5h4v4zm-6 4h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm4-4h2v2h-2v-2zm2 2h2v2h-2v-2zm-4 4h2v2h-2v-2z"/>
              </svg>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <div className="text-xs text-gray-500 mb-1">Serial Number</div>
            <div className="font-mono text-sm font-semibold text-gray-900">{lineItem.fullSerialNumber}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Print QR Code
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// Real-time Stage Duration Counter
function StageDurationCounter({ startedAt }: { startedAt: string }) {
  const [duration, setDuration] = useState(calculateStageDuration(startedAt))

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(calculateStageDuration(startedAt))
    }, 1000) // Update every second

    return () => clearInterval(interval)
  }, [startedAt])

  return (
    <div className="font-mono text-sm">
      <span className="text-gray-900 font-semibold">{duration.hours}h</span>
      <span className="text-gray-600"> {duration.minutes}m</span>
      <span className="text-gray-400"> {duration.seconds}s</span>
    </div>
  )
}

// Status badge helper
function getStatusColor(status: LineItem["status"]) {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800 border-green-200"
    case "In Production":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "On Hold":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Failed QC":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

function getScheduleColor(status: LineItem["scheduleStatus"]) {
  switch (status) {
    case "ahead":
      return "text-green-600"
    case "on-time":
      return "text-blue-600"
    case "behind":
      return "text-orange-600"
    case "at-risk":
      return "text-red-600"
    default:
      return "text-gray-600"
  }
}

export function LineItemsTable({ lineItems, itemCode }: { lineItems: LineItem[]; itemCode: ItemCode }) {
  const router = useRouter()
  const [qrModalItem, setQrModalItem] = useState<LineItem | null>(null)
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  const handleRowClick = (lineItem: LineItem) => {
    router.push(`/items/${itemCode.id}/${lineItem.id}`)
  }

  return (
    <>
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header Info */}
        <div className="px-4 py-2 border-b border-gray-200 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-600">
              Showing <span className="font-semibold">{lineItems.length}</span> individual line items
            </div>
            <div className="text-xs text-blue-600 font-medium">
              Click any row to view full item details • Click QR icon to print
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">QR</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[180px]">Serial Number</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[150px]">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[140px]">Current Stage</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[140px]">Time in Stage</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Schedule</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[200px]">Current Location</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[140px]">Last Scanned By</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[120px]">Last Scan</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[200px]">Notes</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y-[3px] divide-gray-100">
              {lineItems.map((lineItem) => (
                <tr
                  key={lineItem.id}
                  className="hover:bg-blue-50/50 cursor-pointer transition-all group"
                  onClick={() => handleRowClick(lineItem)}
                  onMouseEnter={() => setHoveredRow(lineItem.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  {/* QR Code */}
                  <td className="px-4 py-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setQrModalItem(lineItem)
                      }}
                      className="p-2 hover:bg-blue-100 rounded-lg text-gray-600 hover:text-blue-600 transition-all hover:scale-110"
                      title="View/Print QR Code"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm-2 8h8v8H3v-8zm2 6h4v-4H5v4zm8-14v8h8V3h-8zm6 6h-4V5h4v4zm-6 4h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm4-4h2v2h-2v-2zm2 2h2v2h-2v-2zm-4 4h2v2h-2v-2z"/>
                      </svg>
                    </button>
                  </td>

                  {/* Serial Number */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="font-mono text-sm font-semibold text-gray-900">{lineItem.fullSerialNumber}</div>
                        <div className="text-xs text-gray-500">Unit #{lineItem.serialNumber}</div>
                      </div>
                      {hoveredRow === lineItem.id && (
                        <svg className="w-4 h-4 text-blue-500 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full border whitespace-nowrap ${getStatusColor(lineItem.status)}`}>
                      {lineItem.status}
                    </span>
                  </td>

                  {/* Current Stage */}
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900">{lineItem.currentStage}</div>
                  </td>

                  {/* Time in Stage - Real-time counter */}
                  <td className="px-4 py-4">
                    {lineItem.status === "In Production" ? (
                      <StageDurationCounter startedAt={lineItem.currentStageStarted} />
                    ) : (
                      <div className="text-sm text-gray-500">—</div>
                    )}
                  </td>

                  {/* Progress */}
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              lineItem.progress === 100 ? "bg-green-500" :
                              lineItem.progress > 50 ? "bg-blue-500" :
                              "bg-yellow-500"
                            }`}
                            style={{ width: `${lineItem.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-700">{lineItem.progress}%</span>
                      </div>
                    </div>
                  </td>

                  {/* Schedule Status */}
                  <td className="px-4 py-4">
                    <div className={`text-sm font-semibold ${getScheduleColor(lineItem.scheduleStatus)}`}>
                      {lineItem.scheduleStatus === "ahead" && `+${lineItem.daysAheadBehind}d ahead`}
                      {lineItem.scheduleStatus === "on-time" && "On schedule"}
                      {lineItem.scheduleStatus === "behind" && `${Math.abs(lineItem.daysAheadBehind)}d behind`}
                      {lineItem.scheduleStatus === "at-risk" && "At risk"}
                    </div>
                  </td>

                  {/* Current Location */}
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">{lineItem.currentLocation}</div>
                  </td>

                  {/* Last Scanned By */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-semibold text-blue-600">
                        {lineItem.lastScannedBy.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="text-sm text-gray-900">{lineItem.lastScannedBy}</div>
                    </div>
                  </td>

                  {/* Last Scan Time */}
                  <td className="px-4 py-4">
                    <div className="text-xs text-gray-600">
                      {new Date(lineItem.lastScannedAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </div>
                  </td>

                  {/* Notes */}
                  <td className="px-4 py-4">
                    {lineItem.notes ? (
                      <div className="text-xs text-gray-700 line-clamp-2" title={lineItem.notes}>
                        {lineItem.notes}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400 italic">No notes</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code Modal */}
      {qrModalItem && (
        <QRCodeModal lineItem={qrModalItem} onClose={() => setQrModalItem(null)} />
      )}
    </>
  )
}
