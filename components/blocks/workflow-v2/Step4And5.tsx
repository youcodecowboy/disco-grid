import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Sparkles, AlertCircle, Trash2 } from "lucide-react"

interface Condition {
  id: string
  field: string
  operator: string
  value: string
  action: string
  targetStage?: string
}

interface Notification {
  id: string
  trigger: "start" | "complete" | "error" | "delay"
  recipients: string[]
  channels: ("app" | "email" | "sms")[]
  message: string
}

interface StageData {
  conditions: Condition[]
  notifications: Notification[]
  errorHandling: "retry" | "skip" | "halt" | "reroute"
  maxRetries: number
  timeoutMinutes: number
  [key: string]: any // Allow other properties
}

// Step 4: Conditional Logic & Routing
export function Step4({ data, updateData }: { data: any; updateData: (u: any) => void }) {
  const addCondition = () => {
    const newCondition: Condition = {
      id: `cond-${Date.now()}`,
      field: "status",
      operator: "equals",
      value: "",
      action: "route_to",
      targetStage: "",
    }
    updateData({ conditions: [...data.conditions, newCondition] })
  }

  const updateCondition = (id: string, updates: Partial<Condition>) => {
    updateData({
      conditions: data.conditions.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })
  }

  const removeCondition = (id: string) => {
    updateData({ conditions: data.conditions.filter((c) => c.id !== id) })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-2.5 p-4 bg-purple-50 rounded-xl border border-purple-100">
        <Sparkles className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-purple-900 mb-1">Conditional Routing</p>
          <p className="text-xs text-purple-700">
            Set up if/then rules to route items to different stages based on conditions
          </p>
        </div>
      </div>

      {data.conditions.length === 0 ? (
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-4">No conditions set - items will flow sequentially</p>
          <Button onClick={addCondition} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Condition
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {data.conditions.map((condition, index) => (
            <div key={condition.id} className="p-4 border-2 border-gray-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Condition {index + 1}
                </span>
                <button
                  onClick={() => removeCondition(condition.id)}
                  className="p-1 hover:bg-red-50 rounded"
                >
                  <Trash2 className="h-3.5 w-3.5 text-red-500" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Field</label>
                  <select
                    value={condition.field}
                    onChange={(e) => updateCondition(condition.id, { field: e.target.value })}
                    className="w-full text-xs border rounded-lg px-2 py-1.5"
                  >
                    <option value="status">Status</option>
                    <option value="quantity">Quantity</option>
                    <option value="priority">Priority</option>
                    <option value="quality">Quality</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Operator</label>
                  <select
                    value={condition.operator}
                    onChange={(e) => updateCondition(condition.id, { operator: e.target.value })}
                    className="w-full text-xs border rounded-lg px-2 py-1.5"
                  >
                    <option value="equals">Equals</option>
                    <option value="not_equals">Not Equals</option>
                    <option value="greater_than">Greater Than</option>
                    <option value="less_than">Less Than</option>
                    <option value="contains">Contains</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Value</label>
                  <Input
                    value={condition.value}
                    onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                    placeholder="Value"
                    className="text-xs h-8"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Then → Action
                </label>
                <select
                  value={condition.action}
                  onChange={(e) => updateCondition(condition.id, { action: e.target.value })}
                  className="w-full text-xs border rounded-lg px-2 py-1.5"
                >
                  <option value="route_to">Route to Stage</option>
                  <option value="skip">Skip Stage</option>
                  <option value="halt">Halt Workflow</option>
                  <option value="notify">Send Notification</option>
                </select>
              </div>
            </div>
          ))}

          <Button onClick={addCondition} size="sm" variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Another Condition
          </Button>
        </div>
      )}
    </div>
  )
}

// Step 5: Notifications & Advanced
export function Step5({ data, updateData }: { data: any; updateData: (u: any) => void }) {
  const addNotification = () => {
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      trigger: "complete",
      recipients: [],
      channels: ["app"],
      message: "",
    }
    updateData({ notifications: [...data.notifications, newNotification] })
  }

  const updateNotification = (id: string, updates: Partial<Notification>) => {
    updateData({
      notifications: data.notifications.map((n) => (n.id === id ? { ...n, ...updates } : n)),
    })
  }

  const removeNotification = (id: string) => {
    updateData({ notifications: data.notifications.filter((n) => n.id !== id) })
  }

  const toggleChannel = (id: string, channel: "app" | "email" | "sms") => {
    const notification = data.notifications.find((n) => n.id === id)
    if (!notification) return

    const hasChannel = notification.channels.includes(channel)
    const newChannels = hasChannel
      ? notification.channels.filter((c) => c !== channel)
      : [...notification.channels, channel]

    updateNotification(id, { channels: newChannels })
  }

  return (
    <div className="space-y-5">
      {/* Notifications Section */}
      <div>
        <div className="flex items-start gap-2.5 p-4 bg-green-50 rounded-xl border border-green-100 mb-4">
          <Sparkles className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-900 mb-1">Notifications</p>
            <p className="text-xs text-green-700">
              Automatically notify team members when events occur
            </p>
          </div>
        </div>

        {data.notifications.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600 mb-3">No notifications configured</p>
            <Button onClick={addNotification} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Notification
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {data.notifications.map((notification, index) => (
              <div key={notification.id} className="p-3 border-2 border-gray-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase">
                    Notification {index + 1}
                  </span>
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="p-1 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-500" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Trigger</label>
                    <select
                      value={notification.trigger}
                      onChange={(e) =>
                        updateNotification(notification.id, {
                          trigger: e.target.value as Notification["trigger"],
                        })
                      }
                      className="w-full text-xs border rounded-lg px-2 py-1.5"
                    >
                      <option value="start">On Start</option>
                      <option value="complete">On Complete</option>
                      <option value="error">On Error</option>
                      <option value="delay">On Delay</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Channels</label>
                    <div className="flex gap-1">
                      {(["app", "email", "sms"] as const).map((channel) => (
                        <button
                          key={channel}
                          onClick={() => toggleChannel(notification.id, channel)}
                          className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                            notification.channels.includes(channel)
                              ? "bg-blue-50 border-blue-500 text-blue-700"
                              : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          {channel.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Message</label>
                  <Input
                    value={notification.message}
                    onChange={(e) => updateNotification(notification.id, { message: e.target.value })}
                    placeholder="e.g., Stage completed successfully"
                    className="text-xs h-8"
                  />
                </div>
              </div>
            ))}

            <Button onClick={addNotification} size="sm" variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Another Notification
            </Button>
          </div>
        )}
      </div>

      {/* Advanced Settings */}
      <div className="pt-4 border-t">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Advanced Settings</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Error Handling</label>
            <select
              value={data.errorHandling}
              onChange={(e) => updateData({ errorHandling: e.target.value as StageData["errorHandling"] })}
              className="w-full text-sm border rounded-lg px-3 py-2"
            >
              <option value="retry">Retry automatically</option>
              <option value="skip">Skip this stage</option>
              <option value="halt">Halt workflow</option>
              <option value="reroute">Reroute to alternate path</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Max Retries</label>
              <Input
                type="number"
                value={data.maxRetries}
                onChange={(e) => updateData({ maxRetries: parseInt(e.target.value) || 0 })}
                placeholder="3"
                className="text-sm h-9"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Timeout (min)
              </label>
              <Input
                type="number"
                value={data.timeoutMinutes}
                onChange={(e) => updateData({ timeoutMinutes: parseInt(e.target.value) || 0 })}
                placeholder="0 = none"
                className="text-sm h-9"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
