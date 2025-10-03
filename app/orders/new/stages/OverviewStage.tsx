"use client"

import { useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { OrderInfo, VerticalPreset } from "../types"

type OverviewStageProps = {
  preset: VerticalPreset
  orderInfo: OrderInfo
  onOrderInfoChange: <K extends keyof OrderInfo>(key: K, value: OrderInfo[K]) => void
  contactDirectory: string[]
  clientOptions: string[]
  onCreateClient: () => void
  onAddContact: (contact: string) => void
  onRemoveContact: (contact: string) => void
  teamDirectory: string[]
  orderOwners: string[]
}

export function OverviewStage({
  preset,
  orderInfo,
  onOrderInfoChange,
  contactDirectory,
  clientOptions,
  onCreateClient,
  onAddContact,
  onRemoveContact,
  teamDirectory,
  orderOwners,
}: OverviewStageProps) {
  const [contactInput, setContactInput] = useState("")

  const contactMatches = useMemo(
    () => contactDirectory.filter((contact) => contact.toLowerCase().includes(contactInput.toLowerCase())),
    [contactDirectory, contactInput]
  )

  const handleContactSubmit = () => {
    if (!contactInput.trim()) return
    onAddContact(contactInput)
    setContactInput("")
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-slate-100/60 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Order Blueprint</p>
            <Input
              type="text"
              value={orderInfo.name}
              onChange={(event) => onOrderInfoChange("name", event.target.value)}
              className="h-11 text-2xl font-semibold text-slate-900"
            />
            <p className="text-xs uppercase tracking-[0.22em] text-blue-500">Preset: {preset.label}</p>
            <p className="text-sm text-slate-600">
              Pin down who we’re building for and who on our side drives the production run.
            </p>
          </div>
          <Badge className="bg-emerald-500 text-white">Draft</Badge>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wide text-slate-500">Client</span>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={orderInfo.client}
                onChange={(event) => onOrderInfoChange("client", event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm md:flex-1"
              >
                {clientOptions.map((client) => (
                  <option key={client} value={client}>
                    {client}
                  </option>
                ))}
              </select>
              <Button variant="secondary" className="md:h-10" onClick={onCreateClient}>
                New client
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wide text-slate-500">Assigned team</span>
            <select
              value={orderInfo.assignedTeam}
              onChange={(event) => onOrderInfoChange("assignedTeam", event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              {teamDirectory.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wide text-slate-500">Owner</span>
            <select
              value={orderInfo.owner}
              onChange={(event) => onOrderInfoChange("owner", event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              {orderOwners.map((owner) => (
                <option key={owner} value={owner}>
                  {owner}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wide text-slate-500">Production window</span>
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={orderInfo.startDate}
                onChange={(event) => onOrderInfoChange("startDate", event.target.value)}
                className="h-9"
              />
              <span className="text-slate-400">→</span>
              <Input
                type="date"
                value={orderInfo.shipDate}
                onChange={(event) => onOrderInfoChange("shipDate", event.target.value)}
                className="h-9"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <span className="text-xs uppercase tracking-wide text-slate-500">Key contacts</span>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-1 gap-2">
              <Input
                type="text"
                value={contactInput}
                onChange={(event) => setContactInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault()
                    handleContactSubmit()
                  }
                }}
                list="contact-options"
                placeholder="Search contacts"
                className="h-9"
              />
              <Button variant="secondary" className="h-9" onClick={handleContactSubmit}>
                Add
              </Button>
            </div>
            <datalist id="contact-options">
              {contactDirectory.map((contact) => (
                <option key={contact} value={contact} />
              ))}
            </datalist>
          </div>
          <div className="flex flex-wrap gap-2">
            {orderInfo.contacts.map((contact) => (
              <span
                key={contact}
                className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
              >
                {contact}
                <button className="text-blue-500 hover:text-blue-700" onClick={() => onRemoveContact(contact)}>
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">
            {contactMatches.slice(0, 5).map((contact) => (
              <button
                key={contact}
                className="rounded-full bg-slate-200 px-3 py-1 hover:bg-slate-300"
                onClick={() => onAddContact(contact)}
              >
                {contact}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Card className="border-dashed border-slate-300 bg-slate-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-slate-900">Order context</CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Textile presets loaded from onboarding — switching industries updates attribute templates automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-xs text-slate-500">
          <ul className="list-disc space-y-1 pl-4">
            <li>Contacts receive milestone digests and QR label previews.</li>
            <li>Owner and team control workflow permissions across later stages.</li>
            <li>Client metadata flows into labels and brand portal sharing.</li>
          </ul>
        </CardContent>
      </Card>
    </section>
  )
}




