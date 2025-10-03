"use client"

import { Fragment, useMemo, useState } from "react"

import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

import { ItemProfile, NotificationChannel, NotificationSetting, StandardLabelField } from "../types"
import { LabelPreview } from "./components/LabelPreview"

export type ItemStageProps = {
  items: ItemProfile[]
  activeItemIndex: number
  onItemSelect: (index: number) => void
  selectedItem: ItemProfile | undefined
  presetAttributes: string[]
  onAddItem: () => void
  onUpdateItemField: (itemId: string, field: "name" | "code" | "summary" | "quantity", value: string) => void
  onUpdateTimeline: (itemId: string, key: "start" | "end", value: string) => void
  onUpdateComponentField: (
    itemId: string,
    componentId: string,
    field: "name" | "quantity" | "qrMode" | "notes" | "workflow",
    value: string
  ) => void
  onAddComponent: (itemId: string) => void
  onAttributeChange: (itemId: string, attributeField: string, value: string) => void
  onAddAttribute: (itemId: string, fieldLabel?: string) => void
  onAddAttachment: (itemId: string, category?: string) => void
  onRemoveAttachment: (itemId: string, attachmentId: string) => void
  onAssignTeam: (itemId: string, team: string) => void
  onAssignOwner: (itemId: string, owner: string) => void
  onNotificationChange: (itemId: string, channel: NotificationChannel, updates: Partial<NotificationSetting>) => void
  onToggleType: (itemId: string, type: "simple" | "complex") => void
  teams: string[]
  onToggleLabelField: (itemId: string, fieldId: string) => void
  onAddCustomLabelField: (itemId: string, label: string) => void
  onToggleLabelLogo: (itemId: string, enabled: boolean) => void
  standardLabelFields: StandardLabelField[]
  traceabilityOptions: Array<{ id: string; label: string; description: string }>
  onTraceabilityChange: (itemId: string, updates: Partial<ItemProfile["traceability"]>) => void
  onTraceabilityRegionToggle: (itemId: string, regionId: string) => void
}

export function ItemStage({
  items,
  activeItemIndex,
  onItemSelect,
  selectedItem,
  presetAttributes,
  onAddItem,
  onUpdateItemField,
  onUpdateTimeline,
  onUpdateComponentField,
  onAddComponent,
  onAttributeChange,
  onAddAttribute,
  onAddAttachment,
  onRemoveAttachment,
  onAssignTeam,
  onAssignOwner,
  onNotificationChange,
  onToggleType,
  teams,
  onToggleLabelField,
  onAddCustomLabelField,
  onToggleLabelLogo,
  standardLabelFields,
  traceabilityOptions,
  onTraceabilityChange,
  onTraceabilityRegionToggle,
}: ItemStageProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
      <section className="space-y-4">
        <Header
          items={items}
          activeItemIndex={activeItemIndex}
          onAddItem={onAddItem}
          onAddAttribute={onAddAttribute}
        />

        <ItemsTable
          items={items}
          activeItemIndex={activeItemIndex}
          onItemSelect={onItemSelect}
          onUpdateItemField={onUpdateItemField}
          onUpdateTimeline={onUpdateTimeline}
          onUpdateComponentField={onUpdateComponentField}
          onAddComponent={onAddComponent}
          onToggleType={onToggleType}
        />

        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-xs text-slate-600">
          Need to import from CSV or BOM? Drop a file to auto-create rows and component trees with the right columns.
        </div>

        {selectedItem ? (
          <TraceabilityPanel
            item={selectedItem}
            complianceOptions={traceabilityOptions}
            onTraceabilityChange={onTraceabilityChange}
            onTraceabilityRegionToggle={onTraceabilityRegionToggle}
          />
        ) : (
          <Card className="border-dashed border-slate-300 bg-white/60 p-6 text-sm text-slate-500">
            Select an item to configure traceability and passport compliance.
          </Card>
        )}
      </section>

      <aside className="space-y-4">
        {selectedItem ? (
          <ItemDetailPanel
            item={selectedItem}
            presetAttributes={presetAttributes}
            onAttributeChange={onAttributeChange}
            onAddAttribute={onAddAttribute}
            onUpdateTimeline={onUpdateTimeline}
            onUpdateItemField={onUpdateItemField}
            onAddAttachment={onAddAttachment}
            onRemoveAttachment={onRemoveAttachment}
            onAssignTeam={onAssignTeam}
            onAssignOwner={onAssignOwner}
            onNotificationChange={onNotificationChange}
            teams={teams}
            onToggleLabelField={onToggleLabelField}
            onAddCustomLabelField={onAddCustomLabelField}
            onToggleLabelLogo={onToggleLabelLogo}
            standardLabelFields={standardLabelFields}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
            Select an item to view details.
          </div>
        )}
      </aside>
    </div>
  )
}

type HeaderProps = {
  items: ItemProfile[]
  activeItemIndex: number
  onAddItem: () => void
  onAddAttribute: (itemId: string, fieldLabel?: string) => void
}

function Header({ items, activeItemIndex, onAddItem, onAddAttribute }: HeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Items & components</h3>
        <p className="text-sm text-slate-600">Track every asset in a CRM-style grid with infinite depth.</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="text-xs"
          onClick={() => {
            const current = items[activeItemIndex]
            if (!current) return
            const label = window.prompt("Name this attribute column")?.trim()
            if (!label) return
            onAddAttribute(current.id, label)
          }}
          disabled={!items[activeItemIndex]}
        >
          Add column
        </Button>
        <Button onClick={onAddItem}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add item
        </Button>
      </div>
    </div>
  )
}

type ItemsTableProps = {
  items: ItemProfile[]
  activeItemIndex: number
  onItemSelect: (index: number) => void
  onUpdateItemField: (itemId: string, field: "name" | "code" | "summary" | "quantity", value: string) => void
  onUpdateTimeline: (itemId: string, key: "start" | "end", value: string) => void
  onUpdateComponentField: (
    itemId: string,
    componentId: string,
    field: "name" | "quantity" | "qrMode" | "notes" | "workflow",
    value: string
  ) => void
  onAddComponent: (itemId: string) => void
  onToggleType: (itemId: string, type: "simple" | "complex") => void
}

function ItemsTable({
  items,
  activeItemIndex,
  onItemSelect,
  onUpdateItemField,
  onUpdateTimeline,
  onUpdateComponentField,
  onAddComponent,
  onToggleType,
}: ItemsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3 text-left">Item / Component</th>
            <th className="px-4 py-3 text-left">Type</th>
            <th className="px-4 py-3 text-left">Quantity</th>
            <th className="px-4 py-3 text-left">Workflow</th>
            <th className="px-4 py-3 text-left">Start</th>
            <th className="px-4 py-3 text-left">Due</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item, index) => (
            <Fragment key={item.id}>
              <ItemRow
                item={item}
                isActive={index === activeItemIndex}
                index={index}
                onItemSelect={onItemSelect}
                onUpdateItemField={onUpdateItemField}
                onUpdateTimeline={onUpdateTimeline}
                onToggleType={onToggleType}
              />
              {item.type === "complex" && item.components.length > 0 &&
                item.components.map((component) => (
                  <ComponentRow
                    key={`${item.id}-${component.id}`}
                    itemId={item.id}
                    componentId={component.id}
                    name={component.name}
                    quantity={component.quantity}
                    workflow={component.workflow || item.workflow}
                    onUpdateComponentField={onUpdateComponentField}
                  />
                ))}
              {item.type === "complex" && (
                <AddComponentRow itemId={item.id} itemName={item.name} onAddComponent={onAddComponent} />
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

type ItemRowProps = {
  item: ItemProfile
  isActive: boolean
  index: number
  onItemSelect: (index: number) => void
  onUpdateItemField: (itemId: string, field: "name" | "code" | "summary" | "quantity", value: string) => void
  onUpdateTimeline: (itemId: string, key: "start" | "end", value: string) => void
  onToggleType: (itemId: string, type: "simple" | "complex") => void
}

function ItemRow({ item, isActive, index, onItemSelect, onUpdateItemField, onUpdateTimeline, onToggleType }: ItemRowProps) {
  return (
    <tr
      onClick={() => onItemSelect(index)}
      className={`cursor-pointer transition hover:bg-blue-50/40 ${isActive ? "bg-blue-50/60" : "bg-white"}`}
    >
      <td className="px-4 py-3">
        <div className="flex flex-col gap-1">
          <Input
            value={item.name}
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => onUpdateItemField(item.id, "name", event.target.value)}
            className="h-8 text-sm"
          />
          <Input
            value={item.code}
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => onUpdateItemField(item.id, "code", event.target.value)}
            className="h-8 text-xs"
          />
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          {(["simple", "complex"] as const).map((typeOption) => (
            <button
              key={typeOption}
              onClick={(event) => {
                event.stopPropagation()
                onToggleType(item.id, typeOption)
              }}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                item.type === typeOption
                  ? typeOption === "complex"
                    ? "bg-indigo-500 text-white"
                    : "bg-slate-500 text-white"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {typeOption === "complex" ? "Complex" : "Simple"}
            </button>
          ))}
        </div>
      </td>
      <td className="px-4 py-3">
        <Input
          type="number"
          value={item.quantity}
          onClick={(event) => event.stopPropagation()}
          onChange={(event) => onUpdateItemField(item.id, "quantity", event.target.value)}
          className="h-8"
        />
      </td>
      <td className="px-4 py-3 text-xs text-slate-500">Set in workflow stage</td>
      <td className="px-4 py-3">
        <Input
          value={item.timeline.start}
          placeholder="Set"
          onClick={(event) => event.stopPropagation()}
          onChange={(event) => onUpdateTimeline(item.id, "start", event.target.value)}
          className="h-8"
        />
      </td>
      <td className="px-4 py-3">
        <Input
          value={item.timeline.end}
          placeholder="Set"
          onClick={(event) => event.stopPropagation()}
          onChange={(event) => onUpdateTimeline(item.id, "end", event.target.value)}
          className="h-8"
        />
      </td>
    </tr>
  )
}

type ComponentRowProps = {
  itemId: string
  componentId: string
  name: string
  quantity: number
  workflow: string
  onUpdateComponentField: (
    itemId: string,
    componentId: string,
    field: "name" | "quantity" | "qrMode" | "notes" | "workflow",
    value: string
  ) => void
}

function ComponentRow({ itemId, componentId, name, quantity, workflow, onUpdateComponentField }: ComponentRowProps) {
  return (
    <tr className="bg-slate-50/70 text-xs text-slate-600">
      <td className="px-8 py-2">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
          <Input
            value={name}
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => onUpdateComponentField(itemId, componentId, "name", event.target.value)}
            className="h-7 text-xs"
          />
        </div>
      </td>
      <td className="px-4 py-2">Component</td>
      <td className="px-4 py-2">
        <Input
          type="number"
          value={quantity}
          onClick={(event) => event.stopPropagation()}
          onChange={(event) => onUpdateComponentField(itemId, componentId, "quantity", event.target.value)}
          className="h-7"
        />
      </td>
      <td className="px-4 py-2">
        <Input value={workflow} readOnly onClick={(event) => event.stopPropagation()} className="h-7 text-xs" />
      </td>
      <td className="px-4 py-2 text-slate-500" colSpan={2}>
        —
      </td>
    </tr>
  )
}

type AddComponentRowProps = {
  itemId: string
  itemName: string
  onAddComponent: (itemId: string) => void
}

function AddComponentRow({ itemId, itemName, onAddComponent }: AddComponentRowProps) {
  return (
    <tr className="bg-slate-50 text-xs text-blue-600">
      <td className="px-8 py-3" colSpan={6}>
        <button
          className="flex items-center gap-2"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onAddComponent(itemId)
          }}
        >
          <PlusCircle className="h-3.5 w-3.5" />
          Add component to {itemName}
        </button>
      </td>
    </tr>
  )
}

type ItemDetailPanelProps = {
  item: ItemProfile
  presetAttributes: string[]
  onAttributeChange: (itemId: string, attributeField: string, value: string) => void
  onAddAttribute: (itemId: string, fieldLabel?: string) => void
  onUpdateTimeline: (itemId: string, key: "start" | "end", value: string) => void
  onUpdateItemField: (itemId: string, field: "name" | "code" | "summary" | "quantity", value: string) => void
  onAddAttachment: (itemId: string, category?: string) => void
  onRemoveAttachment: (itemId: string, attachmentId: string) => void
  onAssignTeam: (itemId: string, team: string) => void
  onAssignOwner: (itemId: string, owner: string) => void
  onNotificationChange: (itemId: string, channel: NotificationChannel, updates: Partial<NotificationSetting>) => void
  teams: string[]
  onToggleLabelField: (itemId: string, fieldId: string) => void
  onAddCustomLabelField: (itemId: string, label: string) => void
  onToggleLabelLogo: (itemId: string, enabled: boolean) => void
  standardLabelFields: StandardLabelField[]
}

function ItemDetailPanel({
  item,
  presetAttributes,
  onAttributeChange,
  onAddAttribute,
  onUpdateTimeline,
  onUpdateItemField,
  onAddAttachment,
  onRemoveAttachment,
  onAssignTeam,
  onAssignOwner,
  onNotificationChange,
  teams,
  onToggleLabelField,
  onAddCustomLabelField,
  onToggleLabelLogo,
  standardLabelFields,
}: ItemDetailPanelProps) {
  const remainingAttributes = useMemo(
    () => presetAttributes.filter((attribute) => !item.attributes.some((entry) => entry.field === attribute)),
    [presetAttributes, item.attributes]
  )
  const [tab, setTab] = useState<"attributes" | "files" | "ownership" | "notifications" | "label">("attributes")
  const attributeOptions = useMemo(
    () =>
      Array.from(new Set(item.attributes.map((attribute) => attribute.field))).map((field) => ({
        id: `attribute:${field}`,
        label: field,
      })),
    [item.attributes]
  )
  const availableFields = useMemo(() => [...standardLabelFields, ...attributeOptions], [attributeOptions, standardLabelFields])

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-slate-900">{item.name}</CardTitle>
        <CardDescription className="text-slate-500">Zoomed profile · adjust details and alerts.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-slate-600">
        <Summary item={item} onUpdateTimeline={onUpdateTimeline} />

        <Tabs tab={tab} onTabChange={setTab} />

        {tab === "attributes" && (
          <AttributesTab
            item={item}
            remainingAttributes={remainingAttributes}
            onAddAttribute={onAddAttribute}
            onAttributeChange={onAttributeChange}
            onUpdateItemField={onUpdateItemField}
          />
        )}

        {tab === "files" && (
          <FilesTab item={item} onAddAttachment={onAddAttachment} onRemoveAttachment={onRemoveAttachment} />
        )}

        {tab === "ownership" && (
          <OwnershipTab item={item} teams={teams} onAssignTeam={onAssignTeam} onAssignOwner={onAssignOwner} />
        )}

        {tab === "notifications" && (
          <NotificationsTab item={item} onNotificationChange={onNotificationChange} />
        )}

        {tab === "label" && (
          <LabelTab
            item={item}
            availableFields={availableFields}
            onToggleLabelField={onToggleLabelField}
            onAddCustomLabelField={onAddCustomLabelField}
            onToggleLabelLogo={onToggleLabelLogo}
            standardLabelFields={standardLabelFields}
          />
        )}
      </CardContent>
    </Card>
  )
}

type SummaryProps = {
  item: ItemProfile
  onUpdateTimeline: (itemId: string, key: "start" | "end", value: string) => void
}

function Summary({ item, onUpdateTimeline }: SummaryProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span>
          Quantity:
          <strong className="ml-1 text-slate-900">{item.quantity}</strong>
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            value={item.timeline.start}
            placeholder="Start"
            onChange={(event) => onUpdateTimeline(item.id, "start", event.target.value)}
            className="h-8 w-28"
          />
          <span className="text-slate-400">→</span>
          <Input
            value={item.timeline.end}
            placeholder="Due"
            onChange={(event) => onUpdateTimeline(item.id, "end", event.target.value)}
            className="h-8 w-28"
          />
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <span>Unique ID: {item.code}</span>
        <span>Workflow: {item.workflow}</span>
      </div>
    </div>
  )
}

type TabsProps = {
  tab: "attributes" | "files" | "ownership" | "notifications" | "label"
  onTabChange: (tab: "attributes" | "files" | "ownership" | "notifications" | "label") => void
}

function Tabs({ tab, onTabChange }: TabsProps) {
  const tabs = useMemo(
    () => [
      { value: "attributes", label: "Attributes" },
      { value: "files", label: "Files" },
      { value: "ownership", label: "Ownership" },
      { value: "notifications", label: "Notifications" },
      { value: "label", label: "Label Preview" },
    ] as const,
    []
  )

  return (
    <div className="flex items-center gap-2">
      {tabs.map((entry) => (
        <button
          key={entry.value}
          onClick={() => onTabChange(entry.value)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            tab === entry.value ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          }`}
        >
          {entry.label}
        </button>
      ))}
    </div>
  )
}

type AttributesTabProps = {
  item: ItemProfile
  remainingAttributes: string[]
  onAddAttribute: (itemId: string, fieldLabel?: string) => void
  onAttributeChange: (itemId: string, attributeField: string, value: string) => void
  onUpdateItemField: (itemId: string, field: "name" | "code" | "summary" | "quantity", value: string) => void
}

function AttributesTab({ item, remainingAttributes, onAddAttribute, onAttributeChange, onUpdateItemField }: AttributesTabProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-slate-500">Attribute columns</span>
        <Button
          variant="ghost"
          className="h-8 px-2 text-xs text-blue-600 hover:bg-blue-50"
          onClick={() => {
            const label = window.prompt("Name this attribute column")?.trim()
            if (!label) return
            onAddAttribute(item.id, label)
          }}
        >
          Add column
        </Button>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="min-w-full text-xs">
          <tbody className="divide-y divide-slate-200">
            {item.attributes.map((attribute) => (
              <tr key={attribute.field}>
                <td className="bg-slate-50 px-3 py-2 font-medium text-slate-700">{attribute.field}</td>
                <td className="px-3 py-2">
                  <Input
                    value={attribute.value}
                    placeholder="Set value"
                    onChange={(event) => onAttributeChange(item.id, attribute.field, event.target.value)}
                    className="h-8"
                  />
                </td>
              </tr>
            ))}
            {remainingAttributes.map((attribute) => (
              <tr key={attribute}>
                <td className="bg-slate-50 px-3 py-2 font-medium text-slate-500">{attribute}</td>
                <td className="px-3 py-2">
                  <button className="text-blue-600 hover:underline" onClick={() => onAddAttribute(item.id, attribute)}>
                    Add field
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-1">
        <span className="text-xs uppercase tracking-wide text-slate-500">Item notes</span>
        <textarea
          value={item.summary}
          onChange={(event) => onUpdateItemField(item.id, "summary", event.target.value)}
          className="min-h-[96px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          placeholder="Add production notes or special instructions"
        />
      </div>
    </div>
  )
}

type FilesTabProps = {
  item: ItemProfile
  onAddAttachment: (itemId: string, category?: string) => void
  onRemoveAttachment: (itemId: string, attachmentId: string) => void
}

function FilesTab({ item, onAddAttachment, onRemoveAttachment }: FilesTabProps) {
  return (
    <div className="space-y-3 text-xs text-slate-600">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-slate-500">Design files</span>
        <Button variant="secondary" className="h-8 px-3 text-xs" onClick={() => onAddAttachment(item.id, "Design file")}>
          Attach file
        </Button>
      </div>
      {item.attachments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
          No attachments added yet.
        </div>
      ) : (
        <div className="space-y-2">
          {item.attachments.map((attachment) => (
            <div key={attachment.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-900">{attachment.name}</span>
                <span className="text-[11px] text-slate-500">
                  {attachment.category} · {attachment.size} · Updated {attachment.updatedAt}
                </span>
              </div>
              <button className="text-blue-600 hover:underline" onClick={() => onRemoveAttachment(item.id, attachment.id)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

type OwnershipTabProps = {
  item: ItemProfile
  teams: string[]
  onAssignTeam: (itemId: string, team: string) => void
  onAssignOwner: (itemId: string, owner: string) => void
}

function OwnershipTab({ item, teams, onAssignTeam, onAssignOwner }: OwnershipTabProps) {
  return (
    <div className="space-y-4 text-xs text-slate-600">
      <div>
        <label className="text-xs uppercase tracking-wide text-slate-500">Assigned team</label>
        <select
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          value={item.assignedTeam}
          onChange={(event) => onAssignTeam(item.id, event.target.value)}
        >
          <option value="">Select team</option>
          {teams.map((team) => (
            <option key={team} value={team}>
              {team}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs uppercase tracking-wide text-slate-500">Owner</label>
        <Input
          value={item.owner}
          placeholder="Assign owner"
          onChange={(event) => onAssignOwner(item.id, event.target.value)}
          className="mt-2 h-8"
        />
      </div>
    </div>
  )
}

type NotificationsTabProps = {
  item: ItemProfile
  onNotificationChange: (itemId: string, channel: NotificationChannel, updates: Partial<NotificationSetting>) => void
}

function NotificationsTab({ item, onNotificationChange }: NotificationsTabProps) {
  return (
    <div className="space-y-3 text-xs text-slate-600">
      {item.notifications.map((notification) => (
        <div key={notification.channel} className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-900">{notification.label}</span>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={notification.enabled}
                onChange={(event) => onNotificationChange(item.id, notification.channel, { enabled: event.target.checked })}
              />
              <span className="text-[11px] text-slate-500">Enabled</span>
            </label>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wide text-slate-500">Cadence</span>
            <Input
              value={notification.cadence}
              onChange={(event) => onNotificationChange(item.id, notification.channel, { cadence: event.target.value })}
              className="h-8"
            />
          </div>
        </div>
      ))}
    </div>
  )
}

type LabelTabProps = {
  item: ItemProfile
  availableFields: Array<{ id: string; label: string }>
  onToggleLabelField: (itemId: string, fieldId: string) => void
  onAddCustomLabelField: (itemId: string, label: string) => void
  onToggleLabelLogo: (itemId: string, enabled: boolean) => void
  standardLabelFields: StandardLabelField[]
}

function LabelTab({
  item,
  availableFields,
  onToggleLabelField,
  onAddCustomLabelField,
  onToggleLabelLogo,
  standardLabelFields,
}: LabelTabProps) {
  return (
    <div className="space-y-4 text-xs text-slate-600">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-900">Label configuration</h3>
        <label className="flex items-center gap-2 text-[11px] text-slate-500">
          <input
            type="checkbox"
            checked={item.labelLogo}
            onChange={(event) => onToggleLabelLogo(item.id, event.target.checked)}
          />
          Include client logo
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <span className="text-xs uppercase tracking-wide text-slate-500">Available fields</span>
          {availableFields.map((field) => (
            <label key={field.id} className="flex items-center justify-between gap-3 text-xs text-slate-600">
              <span>{field.label}</span>
              <input type="checkbox" checked={item.labelFields.includes(field.id)} onChange={() => onToggleLabelField(item.id, field.id)} />
            </label>
          ))}
        </div>
        <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-3">
          <span className="text-xs uppercase tracking-wide text-slate-500">Custom text</span>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. Handling instructions"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault()
                  const value = (event.target as HTMLInputElement).value.trim()
                  if (value) {
                    onAddCustomLabelField(item.id, value)
                    ;(event.target as HTMLInputElement).value = ""
                  }
                }
              }}
              className="h-8"
            />
            <Button
              variant="secondary"
              className="h-8"
              onClick={() => {
                const input = window.prompt("Custom label text")?.trim()
                if (input) onAddCustomLabelField(item.id, input)
              }}
            >
              Add
            </Button>
          </div>
          <p className="text-[11px] text-slate-500">
            Custom entries print as static text on the label—add handling instructions, hotline numbers, or lot notes.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <LabelPreview
          item={item}
          fields={item.labelFields}
          showLogo={item.labelLogo}
          standardLabelFields={standardLabelFields}
        />
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-slate-900">Label policy</CardTitle>
            <CardDescription className="text-slate-500">
              Ensure label fields align with the active traceability profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-slate-600">
            <p>
              Digital passports inherit label data when enabled. Include lifecycle stages or material certificates to
              surface sustainability metrics.
            </p>
            <p>
              Need a custom export? Add static text fields or reuse item attributes as label tokens.
            </p>
            <p className="text-[11px] text-slate-500">
              Tip: Keep labels under 6 data points for legibility on 2×2 in. stickers.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

type TraceabilityPanelProps = {
  item: ItemProfile
  complianceOptions: Array<{ id: string; label: string; description: string }>
  onTraceabilityChange: (itemId: string, updates: Partial<ItemProfile["traceability"]>) => void
  onTraceabilityRegionToggle: (itemId: string, regionId: string) => void
}

function TraceabilityPanel({
  item,
  complianceOptions,
  onTraceabilityChange,
  onTraceabilityRegionToggle,
}: TraceabilityPanelProps) {
  const { traceability } = item

  const toggleBoolean = (key: keyof ItemProfile["traceability"]) => {
    const value = traceability[key]
    if (typeof value === "boolean") {
      onTraceabilityChange(item.id, { [key]: !value } as Partial<ItemProfile["traceability"]>)
    }
  }

  const booleanSettings: Array<{
    key: keyof ItemProfile["traceability"]
    label: string
    description: string
  }> = [
    {
      key: "shareWithPartners",
      label: "Share with partners",
      description: "Expose passports to clients and upstream suppliers automatically.",
    },
    {
      key: "includeLifecycleStages",
      label: "Lifecycle stages",
      description: "Publish stage completion timeline alongside the passport.",
    },
    {
      key: "includeMaterialCertificates",
      label: "Material certificates",
      description: "Embed fabric and chemical certificates for each component.",
    },
    {
      key: "includeCarbonAccounting",
      label: "Carbon accounting",
      description: "Attach CO₂e per stage for sustainability reporting.",
    },
  ]

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-slate-900">Traceability & passport</CardTitle>
        <CardDescription className="text-slate-500">
          Govern how this item reports provenance and compliance signals across the order.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 text-sm text-slate-600">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs">
          <div>
            <p className="text-sm font-semibold text-slate-900">Digital product passport</p>
            <p className="text-slate-500">
              Applies to this item{item.components.length ? " and all components" : ""} once published.
            </p>
          </div>
          <label className="inline-flex items-center gap-2 text-slate-500">
            <input
              type="checkbox"
              checked={traceability.digitalPassportEnabled}
              onChange={(event) =>
                onTraceabilityChange(item.id, { digitalPassportEnabled: event.target.checked })
              }
            />
            <span className="text-xs font-medium">
              {traceability.digitalPassportEnabled ? "Enabled" : "Disabled"}
            </span>
          </label>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs uppercase tracking-wide text-slate-500">Compliance regions</h4>
          <div className="grid gap-2 md:grid-cols-2">
            {complianceOptions.map((option) => {
              const active = traceability.complianceRegions.includes(option.id)
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onTraceabilityRegionToggle(item.id, option.id)}
                  className={`rounded-xl border px-3 py-2 text-left transition ${
                    active
                      ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                      : "border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-blue-50/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold">{option.label}</span>
                    {active && <Badge className="bg-blue-500 text-white">Active</Badge>}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{option.description}</p>
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs uppercase tracking-wide text-slate-500">Passport content</h4>
          <div className="grid gap-2 md:grid-cols-2">
            {booleanSettings.map((setting) => (
              <label
                key={setting.key}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs hover:border-blue-200"
              >
                <input
                  type="checkbox"
                  checked={Boolean(traceability[setting.key])}
                  onChange={() => toggleBoolean(setting.key)}
                  className="mt-1"
                />
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-slate-900">{setting.label}</span>
                  <p className="text-slate-500">{setting.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-xs text-slate-600">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-slate-900">Component coverage</span>
            <Badge className="bg-slate-500 text-white">{item.components.length} linked</Badge>
          </div>
          {item.components.length === 0 ? (
            <p className="mt-2 text-slate-500">
              Components will inherit this passport configuration as they are added.
            </p>
          ) : (
            <ul className="mt-3 space-y-1">
              {item.components.slice(0, 4).map((component) => (
                <li key={component.id} className="flex items-center justify-between gap-3">
                  <span className="text-slate-600">{component.name}</span>
                  <Badge
                    className={`text-xs ${
                      component.digitalPassportEnabled
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-300 text-slate-700"
                    }`}
                  >
                    {component.digitalPassportEnabled ? "Included" : "Off"}
                  </Badge>
                </li>
              ))}
              {item.components.length > 4 && (
                <li className="text-[11px] text-slate-500">+{item.components.length - 4} more components</li>
              )}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
