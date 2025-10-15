// Quick client creation modal - Lego Style

import { useState } from "react"
import { X, Building2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type NewClientModalProps = {
  open: boolean
  onClose: () => void
  onSave: (client: ClientInfo) => void
}

export type ClientInfo = {
  name: string
  contactName: string
  email: string
  phone?: string
  location?: string
}

export function NewClientModal({ open, onClose, onSave }: NewClientModalProps) {
  const [clientData, setClientData] = useState<ClientInfo>({
    name: "",
    contactName: "",
    email: "",
    phone: "",
    location: "",
  })

  const handleSave = () => {
    if (clientData.name.trim() && clientData.contactName.trim() && clientData.email.trim()) {
      onSave(clientData)
      // Reset and close
      setClientData({
        name: "",
        contactName: "",
        email: "",
        phone: "",
        location: "",
      })
      onClose()
    }
  }

  const handleClose = () => {
    setClientData({
      name: "",
      contactName: "",
      email: "",
      phone: "",
      location: "",
    })
    onClose()
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40 animate-in fade-in duration-200"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-sky-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">New Client</h2>
                <p className="text-xs text-slate-500">Add a new client to your directory</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <div className="p-6 space-y-4">
            {/* Company Name - Required */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <Input
                type="text"
                value={clientData.name}
                onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                placeholder="e.g., Horizon Apparel Co."
                className="h-10"
                autoFocus
              />
            </div>

            {/* Contact Name - Required */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Contact Person <span className="text-rose-500">*</span>
              </label>
              <Input
                type="text"
                value={clientData.contactName}
                onChange={(e) => setClientData({ ...clientData, contactName: e.target.value })}
                placeholder="e.g., Sarah Chen"
                className="h-10"
              />
            </div>

            {/* Email - Required */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Email <span className="text-rose-500">*</span>
              </label>
              <Input
                type="email"
                value={clientData.email}
                onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                placeholder="e.g., sarah@horizonapparel.com"
                className="h-10"
              />
            </div>

            {/* Phone - Optional */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Phone <span className="text-slate-400 text-xs">(optional)</span>
              </label>
              <Input
                type="tel"
                value={clientData.phone}
                onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                placeholder="e.g., +1 (555) 123-4567"
                className="h-10"
              />
            </div>

            {/* Location - Optional */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Location <span className="text-slate-400 text-xs">(optional)</span>
              </label>
              <Input
                type="text"
                value={clientData.location}
                onChange={(e) => setClientData({ ...clientData, location: e.target.value })}
                placeholder="e.g., San Francisco, CA"
                className="h-10"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={handleClose}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!clientData.name.trim() || !clientData.contactName.trim() || !clientData.email.trim()}
              className="rounded-full bg-sky-600 hover:bg-sky-700 text-white"
            >
              Add Client
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

