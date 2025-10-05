"use client"

import { Device } from "@/lib/data/teams"
import { Smartphone, Battery, BatteryLow, BatteryWarning, Wifi, WifiOff, AlertTriangle } from "lucide-react"

type DeviceFleetStatusProps = {
  devices: Device[]
}

export default function DeviceFleetStatus({ devices }: DeviceFleetStatusProps) {
  // Ensure devices is an array
  const safeDevices = Array.isArray(devices) ? devices : []
  const totalDevices = safeDevices.length
  const onlineDevices = safeDevices.filter(d => d.connectivity === "Online").length
  const lowBatteryDevices = safeDevices.filter(d => (d.batteryLevel ?? 100) < 20).length
  const criticalAlerts = safeDevices.filter(d => d.alerts.some(a => a.severity === "Critical" && !a.acknowledged)).length

  const getBatteryIcon = (level: number | undefined, status: string) => {
    if (!level) return <Battery className="w-4 h-4 text-slate-400" />
    if (level < 10) return <BatteryWarning className="w-4 h-4 text-red-600" />
    if (level < 20) return <BatteryLow className="w-4 h-4 text-orange-600" />
    return <Battery className="w-4 h-4 text-green-600" />
  }

  const getConnectivityIcon = (status: string) => {
    if (status === "Online") return <Wifi className="w-3 h-3 text-green-600" />
    return <WifiOff className="w-3 h-3 text-slate-400" />
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-violet-50 to-purple-50">
        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-violet-600" />
          Device Fleet Status
        </h3>
        <p className="text-xs text-slate-600 mt-1">{totalDevices} devices deployed</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 p-6 border-b border-slate-100">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{onlineDevices}</div>
          <p className="text-xs text-slate-600 mt-1">Online</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{lowBatteryDevices}</div>
          <p className="text-xs text-slate-600 mt-1">Low Battery</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{criticalAlerts}</div>
          <p className="text-xs text-slate-600 mt-1">Alerts</p>
        </div>
      </div>

      {/* Device List */}
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-2">
          {safeDevices.slice(0, 10).map(device => {
            const hasAlert = device.alerts.length > 0

            return (
              <div
                key={device.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                  hasAlert
                    ? "border-orange-200 bg-orange-50 hover:bg-orange-100"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {/* Device Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-3 h-3 text-slate-400" />
                    <span className="text-sm font-medium text-slate-900">{device.name}</span>
                    {getConnectivityIcon(device.connectivity)}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">{device.type}</p>
                </div>

                {/* Battery */}
                <div className="flex-shrink-0 flex items-center gap-2">
                  {getBatteryIcon(device.batteryLevel, device.batteryStatus)}
                  <span className="text-xs font-medium text-slate-700">
                    {device.batteryLevel ?? "N/A"}%
                  </span>
                </div>

                {/* Alert Indicator */}
                {hasAlert && (
                  <AlertTriangle className="flex-shrink-0 w-4 h-4 text-orange-600" />
                )}
              </div>
            )
          })}
        </div>

        {safeDevices.length > 10 && (
          <button className="w-full mt-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors">
            View all {safeDevices.length} devices →
          </button>
        )}
      </div>
    </div>
  )
}
