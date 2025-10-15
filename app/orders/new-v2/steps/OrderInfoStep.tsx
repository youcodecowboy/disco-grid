// Step 1: Order Information - Lego Style with high-level metadata

import { useState, useEffect } from "react"
import { Plus, X, Flag, Building2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { EmojiPicker } from "@/components/orders-v2/EmojiPicker"
import { NewClientModal, type ClientInfo } from "@/components/orders-v2/NewClientModal"
import type { OrderInfo } from "@/lib/orders-v2/types"
import { CONTACT_DIRECTORY, TEAM_DIRECTORY } from "@/lib/orders-v2/types"

const DEFAULT_CLIENTS = [
  "Horizon Apparel Co.",
  "Summit Fabrication Ltd.",
  "Vertex Manufacturing Group",
  "Cascade Design Studios",
  "Meridian Industries",
]

const MOCK_OWNERS = ["L. Medina", "K. Patel", "S. Alvarez", "D. Ishikawa"]

const PRIORITY_OPTIONS = [
  { value: "low" as const, label: "Low", color: "bg-slate-100 text-slate-700 border-slate-200" },
  { value: "medium" as const, label: "Medium", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { value: "high" as const, label: "High", color: "bg-amber-100 text-amber-700 border-amber-200" },
  { value: "urgent" as const, label: "Urgent", color: "bg-rose-100 text-rose-700 border-rose-200" },
]

const COMMON_FLAGS = ["Rush", "Export", "Prototype", "Custom", "Repeat Order", "Large Volume"]

// Generate client code from client name (e.g., "Horizon Apparel Co." → "HAC")
function generateClientCode(clientName: string): string {
  const words = clientName.split(" ").filter(w => w.length > 2) // Filter out short words like "Co."
  if (words.length >= 2) {
    return words.slice(0, 3).map(w => w[0].toUpperCase()).join("")
  }
  return clientName.substring(0, 3).toUpperCase()
}

// Generate suggested order number
function generateOrderNumber(client: string): string {
  if (!client) return ""
  const clientCode = generateClientCode(client)
  const year = new Date().getFullYear()
  // In production, this would query the database for the last order number for this client
  const sequence = Math.floor(Math.random() * 999) + 1 // Mock sequence
  return `${clientCode}-${year}-${sequence.toString().padStart(3, "0")}`
}

type OrderInfoStepProps = {
  orderInfo: OrderInfo
  onChange: (updates: Partial<OrderInfo>) => void
}

export function OrderInfoStep({ orderInfo, onChange }: OrderInfoStepProps) {
  const [showShipDate, setShowShipDate] = useState(!!orderInfo.shipDate)
  const [showContacts, setShowContacts] = useState(orderInfo.contacts.length > 0)
  const [showOwner, setShowOwner] = useState(!!orderInfo.owner)
  const [showTeam, setShowTeam] = useState(!!orderInfo.team)
  const [showContactSelector, setShowContactSelector] = useState(false)
  const [newFlag, setNewFlag] = useState("")
  const [showFlagInput, setShowFlagInput] = useState(false)
  const [showPriorityMenu, setShowPriorityMenu] = useState(false)
  const [showFlagMenu, setShowFlagMenu] = useState(false)
  const [showNewClientModal, setShowNewClientModal] = useState(false)
  const [customClients, setCustomClients] = useState<string[]>([])
  const [hasManuallyEditedName, setHasManuallyEditedName] = useState(false)
  
  // Combined client list: custom clients first, then defaults
  const allClients = [...customClients, ...DEFAULT_CLIENTS]

  // Auto-generate order number and update name when client changes
  useEffect(() => {
    if (orderInfo.client) {
      const newOrderNumber = generateOrderNumber(orderInfo.client)
      
      // Update order number and name if user hasn't manually edited the name
      if (!hasManuallyEditedName) {
        onChange({ 
          orderNumber: newOrderNumber,
          name: newOrderNumber
        })
      } else {
        // Just update the order number, keep the custom name
        onChange({ orderNumber: newOrderNumber })
      }
    }
  }, [orderInfo.client])

  const addContact = (contact: string) => {
    if (!orderInfo.contacts.includes(contact)) {
      onChange({ contacts: [...orderInfo.contacts, contact] })
    }
    setShowContactSelector(false)
  }

  const removeContact = (contact: string) => {
    onChange({ contacts: orderInfo.contacts.filter(c => c !== contact) })
  }

  const addFlag = (flag: string) => {
    if (flag.trim() && !(orderInfo.flags || []).includes(flag)) {
      onChange({ flags: [...(orderInfo.flags || []), flag] })
    }
    setNewFlag("")
    setShowFlagInput(false)
  }

  const removeFlag = (flag: string) => {
    onChange({ flags: (orderInfo.flags || []).filter(f => f !== flag) })
  }

  const handleNewClient = (clientInfo: ClientInfo) => {
    // Add to custom clients list
    setCustomClients([clientInfo.name, ...customClients])
    // Auto-select the new client (this will trigger the useEffect to update the name)
    onChange({ client: clientInfo.name })
    // Reset manual edit flag so the auto-generated name is used
    setHasManuallyEditedName(false)
    // In production, this would also save to database
    console.log("New client created:", clientInfo)
  }

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-4">
      {/* Header Row: Icon + Order Number */}
      <div className="flex items-start gap-3">
        {/* Emoji Picker */}
        <EmojiPicker
          value={orderInfo.symbol}
          onChange={(symbol) => onChange({ symbol })}
        />

        {/* Order Number + Name Container */}
        <div className="flex-1 space-y-1">
          {/* Suggested Order Number */}
          {orderInfo.orderNumber && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded">
                {orderInfo.orderNumber}
              </span>
              <button
                onClick={() => {
                  const newOrderNumber = generateOrderNumber(orderInfo.client)
                  onChange({ 
                    orderNumber: newOrderNumber,
                    // Also update the name field when refreshing
                    name: newOrderNumber
                  })
                  // Refreshing resets the manual edit flag so future client changes update the name
                  setHasManuallyEditedName(false)
                }}
                className="text-xs text-sky-600 hover:text-sky-700"
                title="Generate new number"
              >
                ↻
              </button>
            </div>
          )}

          {/* Order Name - Primary input */}
          <input
            type="text"
            value={orderInfo.name || ""}
            onChange={(e) => {
              onChange({ name: e.target.value })
              // Mark as manually edited once user types
              setHasManuallyEditedName(true)
            }}
            placeholder="Order name..."
            className="w-full text-3xl font-semibold text-slate-900 placeholder-slate-300 bg-transparent border-none outline-none py-1"
            autoFocus
          />
        </div>
      </div>

      {/* High-level metadata tags - Priority + Flags */}
      <div className="flex flex-wrap items-center gap-2 pl-1">
        {/* Priority Badge */}
        {orderInfo.priority ? (
          <Badge
            className={`${PRIORITY_OPTIONS.find(p => p.value === orderInfo.priority)?.color} border rounded-full px-3 py-1 text-xs font-medium cursor-pointer hover:opacity-80`}
            onClick={() => onChange({ priority: undefined })}
          >
            {PRIORITY_OPTIONS.find(p => p.value === orderInfo.priority)?.label}
            <X className="ml-1 h-3 w-3" />
          </Badge>
        ) : (
          <div className="relative">
            <button 
              onClick={() => setShowPriorityMenu(!showPriorityMenu)}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded hover:bg-slate-50"
            >
              <Plus className="h-3 w-3" />
              Priority
            </button>
            {showPriorityMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowPriorityMenu(false)}
                />
                <div className="absolute top-full left-0 mt-1 w-32 rounded-lg border border-slate-200 bg-white shadow-lg py-1 z-20">
                  {PRIORITY_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onChange({ priority: option.value })
                        setShowPriorityMenu(false)
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs ${option.color.replace('bg-', 'hover:bg-')} transition-colors`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Custom Flags */}
        {(orderInfo.flags || []).map((flag) => (
          <Badge
            key={flag}
            className="bg-slate-100 text-slate-700 border border-slate-200 rounded-full px-3 py-1 text-xs cursor-pointer hover:bg-slate-200"
            onClick={() => removeFlag(flag)}
          >
            <Flag className="h-3 w-3 mr-1" />
            {flag}
            <X className="ml-1 h-3 w-3" />
          </Badge>
        ))}

        {/* Add Flag */}
        {showFlagInput ? (
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={newFlag}
              onChange={(e) => setNewFlag(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addFlag(newFlag)
                }
              }}
              onBlur={() => {
                if (newFlag.trim()) addFlag(newFlag)
                else setShowFlagInput(false)
              }}
              placeholder="Flag name..."
              className="text-xs px-2 py-1 rounded border border-slate-300 outline-none focus:border-sky-500 w-24"
              autoFocus
            />
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => setShowFlagMenu(!showFlagMenu)}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded hover:bg-slate-50"
            >
              <Plus className="h-3 w-3" />
              Flag
            </button>
            {showFlagMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowFlagMenu(false)}
                />
                <div className="absolute top-full left-0 mt-1 w-40 rounded-lg border border-slate-200 bg-white shadow-lg py-1 z-20">
                  <div className="px-2 py-1 text-xs text-slate-500 font-medium">Common flags:</div>
                  {COMMON_FLAGS.map((flag) => (
                    <button
                      key={flag}
                      onClick={() => {
                        addFlag(flag)
                        setShowFlagMenu(false)
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      {flag}
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setShowFlagInput(true)
                        setShowFlagMenu(false)
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-sky-600 hover:bg-sky-50"
                    >
                      + Custom flag
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Client - Required */}
      <div className="py-1">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">for</span>
          <Select 
            value={orderInfo.client || ""} 
            onValueChange={(value) => {
              if (value === "__new_client__") {
                setShowNewClientModal(true)
              } else {
                onChange({ client: value })
              }
            }}
          >
            <SelectTrigger className="w-auto border-none shadow-none px-0 text-base font-medium text-slate-700 hover:text-slate-900">
              <SelectValue placeholder="Select client..." />
            </SelectTrigger>
            <SelectContent>
              {/* New Client Option */}
              <SelectItem value="__new_client__" className="text-sky-600 font-medium">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span>+ New Client</span>
                </div>
              </SelectItem>
              
              {/* Divider */}
              {allClients.length > 0 && (
                <div className="h-px bg-slate-200 my-1" />
              )}
              
              {/* Client List */}
              {allClients.map((client) => (
                <SelectItem key={client} value={client}>
                  {client}
                  {customClients.includes(client) && (
                    <span className="ml-2 text-xs text-slate-400">(new)</span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* New Client Modal */}
      <NewClientModal
        open={showNewClientModal}
        onClose={() => setShowNewClientModal(false)}
        onSave={handleNewClient}
      />

      {/* Start Date - Required */}
      <div className="py-1">
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">Starting</span>
          <Input
            type="date"
            value={orderInfo.startDate || ""}
            onChange={(e) => onChange({ startDate: e.target.value })}
            className="flex-1 text-sm h-9"
          />
        </div>
      </div>

      {/* Optional sections */}
      <div className="space-y-2 pt-2">
        {/* Ship Date */}
        {!showShipDate ? (
          <button
            onClick={() => setShowShipDate(true)}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 py-1"
          >
            <Plus className="h-4 w-4" />
            Add ship date
          </button>
        ) : (
          <div className="flex items-center gap-3 py-1">
            <span className="text-sm text-slate-500">Ships</span>
            <Input
              type="date"
              value={orderInfo.shipDate || ""}
              onChange={(e) => onChange({ shipDate: e.target.value })}
              className="flex-1 text-sm h-9"
            />
            <button
              onClick={() => {
                setShowShipDate(false)
                onChange({ shipDate: "" })
              }}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Contacts */}
        {!showContacts ? (
          <button
            onClick={() => setShowContacts(true)}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 py-1"
          >
            <Plus className="h-4 w-4" />
            Add contacts
          </button>
        ) : (
          <div className="space-y-2 py-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Contacts</span>
              <button
                onClick={() => {
                  setShowContacts(false)
                  onChange({ contacts: [] })
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2 pl-6">
              {orderInfo.contacts.map((contact) => (
                <Badge
                  key={contact}
                  className="rounded-full bg-slate-100 text-slate-700 px-3 py-1 text-sm cursor-pointer hover:bg-slate-200"
                  onClick={() => removeContact(contact)}
                >
                  {contact}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
              <div className="relative">
                <button
                  onClick={() => setShowContactSelector(!showContactSelector)}
                  className="text-sm text-slate-400 hover:text-slate-600"
                >
                  <Plus className="h-4 w-4" />
                </button>
                {showContactSelector && (
                  <div className="absolute top-full left-0 mt-1 w-48 rounded-lg border border-slate-200 bg-white shadow-lg p-2 z-10">
                    <div className="space-y-1">
                      {CONTACT_DIRECTORY.filter(c => !orderInfo.contacts.includes(c)).map((contact) => (
                        <button
                          key={contact}
                          onClick={() => addContact(contact)}
                          className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-slate-50"
                        >
                          {contact}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Owner */}
        {!showOwner ? (
          <button
            onClick={() => setShowOwner(true)}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 py-1"
          >
            <Plus className="h-4 w-4" />
            Add owner
          </button>
        ) : (
          <div className="flex items-center gap-3 py-1">
            <span className="text-sm text-slate-500">Owner</span>
            <Select value={orderInfo.owner || ""} onValueChange={(value) => onChange({ owner: value })}>
              <SelectTrigger className="flex-1 h-9 text-sm">
                <SelectValue placeholder="Select owner" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_OWNERS.map((owner) => (
                  <SelectItem key={owner} value={owner}>
                    {owner}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              onClick={() => {
                setShowOwner(false)
                onChange({ owner: "" })
              }}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Team */}
        {!showTeam ? (
          <button
            onClick={() => setShowTeam(true)}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 py-1"
          >
            <Plus className="h-4 w-4" />
            Add team
          </button>
        ) : (
          <div className="flex items-center gap-3 py-1">
            <span className="text-sm text-slate-500">Team</span>
            <Select value={orderInfo.team || ""} onValueChange={(value) => onChange({ team: value })}>
              <SelectTrigger className="flex-1 h-9 text-sm">
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                {TEAM_DIRECTORY.map((team) => (
                  <SelectItem key={team} value={team}>
                    {team}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              onClick={() => {
                setShowTeam(false)
                onChange({ team: "" })
              }}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
