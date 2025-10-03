"use client"

import { useMemo, useState } from "react"
import Sidebar from "@/components/Sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import {
  CONTACT_DIRECTORY,
  INITIAL_CLIENTS,
  ItemProfile,
  LOCATION_OPTIONS,
  NotificationChannel,
  NotificationSetting,
  OrderInfo,
  ORDER_OWNERS,
  SEED_ITEMS,
  STANDARD_LABEL_FIELDS,
  STAGES,
  StageId,
  TEAM_DIRECTORY,
  VERTICAL_PRESETS,
  VerticalPreset,
  WORKFLOW_LIBRARY,
  TRACEABILITY_COMPLIANCE_OPTIONS,
} from "./types"
import { StageStepper } from "./stages/components/StageStepper"
import { OverviewStage } from "./stages/OverviewStage"
import { MilestonesStage } from "./stages/MilestonesStage"
import { ItemStage } from "./stages/ItemStage"
import { WorkflowStage } from "./stages/WorkflowStage"
import { ReviewStage } from "./stages/ReviewStage"


export default function NewOrderPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [stageIndex, setStageIndex] = useState(0)
  const [items, setItems] = useState<ItemProfile[]>(SEED_ITEMS)
  const [activeItemIndex, setActiveItemIndex] = useState(0)
  const [clientOptions, setClientOptions] = useState(INITIAL_CLIENTS)
  const [orderInfo, setOrderInfo] = useState<OrderInfo>({
    name: "Aurora Apparel Production Run",
    client: "Horizon Apparel Co.",
    startDate: "2025-10-04",
    shipDate: "2025-11-27",
    contacts: ["L. Medina", "K. Patel"],
    owner: "L. Medina",
    assignedTeam: "Production Ops",
  })

  const industryId: VerticalPreset["id"] = "fashion"

  const activePreset = useMemo(
    () => VERTICAL_PRESETS.find((preset) => preset.id === industryId) ?? VERTICAL_PRESETS[0],
    [industryId]
  )

  const selectedItem = items[activeItemIndex]

  const updateItem = (itemId: string, updater: (item: ItemProfile) => ItemProfile) => {
    setItems((prev) => prev.map((item) => (item.id === itemId ? updater(item) : item)))
  }

  const handleItemFieldChange = (
    itemId: string,
    field: "name" | "code" | "summary" | "quantity",
    value: string
  ) => {
    updateItem(itemId, (item) => ({
      ...item,
      [field]: field === "quantity" ? Number(value) || 0 : value,
    }))
  }

  const handleItemTimelineChange = (itemId: string, key: "start" | "end", value: string) => {
    updateItem(itemId, (item) => ({
      ...item,
      timeline: { ...item.timeline, [key]: value },
    }))
  }

  const handleComponentFieldChange = (
    itemId: string,
    componentId: string,
    field: "name" | "quantity" | "qrMode" | "notes" | "workflow",
    value: string
  ) => {
    updateItem(itemId, (item) => ({
      ...item,
      components: item.components.map((component) =>
        component.id === componentId
          ? {
              ...component,
              [field]: field === "quantity" ? Number(value) || 0 : value,
            }
          : component
      ),
    }))
  }

  const handleAddComponent = (itemId: string) => {
    updateItem(itemId, (item) => ({
      ...item,
      components: [
        ...item.components,
        {
          id: `comp-${item.components.length + 1}-${Date.now()}`,
          name: "New component",
          quantity: 1,
          qrMode: "Per unit",
          notes: "",
          workflow: item.workflow,
          startDate: item.timeline.start,
          location: LOCATION_OPTIONS[0] ?? "",
          attributes: [],
          digitalPassportEnabled: item.traceability.digitalPassportEnabled,
        },
      ],
      type: "complex",
    }))
  }

  const handleAttributeChange = (itemId: string, attributeField: string, value: string) => {
    updateItem(itemId, (item) => ({
      ...item,
      attributes: item.attributes.map((attribute) =>
        attribute.field === attributeField ? { ...attribute, value } : attribute
      ),
    }))
  }

  const handleAddAttribute = (itemId: string, fieldLabel?: string) => {
    updateItem(itemId, (item) => ({
      ...item,
      attributes: [
        ...item.attributes,
        {
          field: fieldLabel ?? `Custom Field ${item.attributes.length + 1}`,
          value: "",
        },
      ],
    }))
  }

  const handleItemWorkflowChange = (itemId: string, workflowName: string, propagate = false) => {
    updateItem(itemId, (item) => ({
      ...item,
      workflow: workflowName,
      components: propagate
        ? item.components.map((component) => ({ ...component, workflow: workflowName }))
        : item.components,
    }))
  }

  const handleComponentWorkflowChange = (itemId: string, componentId: string, workflowName: string) => {
    handleComponentFieldChange(itemId, componentId, "workflow", workflowName)
  }

  const handleLabelFieldToggle = (itemId: string, fieldId: string) => {
    updateItem(itemId, (item) => {
      const exists = item.labelFields.includes(fieldId)
      return {
        ...item,
        labelFields: exists
          ? item.labelFields.filter((field) => field !== fieldId)
          : [...item.labelFields, fieldId],
      }
    })
  }

  const handleAddCustomLabelField = (itemId: string, label: string) => {
    if (!label.trim()) return
    const token = `custom:${label.trim()}`
    updateItem(itemId, (item) => ({
      ...item,
      labelFields: item.labelFields.includes(token)
        ? item.labelFields
        : [...item.labelFields, token],
    }))
  }

  const handleLabelLogoToggle = (itemId: string, enabled: boolean) => {
    updateItem(itemId, (item) => ({
      ...item,
      labelLogo: enabled,
    }))
  }

  const handleItemTypeToggle = (itemId: string, type: "simple" | "complex") => {
    updateItem(itemId, (item) => {
      if (type === "simple" && item.components.length > 0) {
        window.alert("Delete components to convert this item to simple mode.")
        return item
      }
      return {
        ...item,
        type,
      }
    })
  }

  const handleComponentAttributeChange = (
    itemId: string,
    componentId: string,
    attributeField: string,
    value: string
  ) => {
    updateItem(itemId, (item) => ({
      ...item,
      components: item.components.map((component) =>
        component.id === componentId
          ? {
              ...component,
              attributes: component.attributes.map((attribute) =>
                attribute.field === attributeField ? { ...attribute, value } : attribute
              ),
            }
          : component
      ),
    }))
  }

  const handleAddComponentAttribute = (itemId: string, componentId: string, fieldLabel: string) => {
    updateItem(itemId, (item) => ({
      ...item,
      components: item.components.map((component) =>
        component.id === componentId
          ? {
              ...component,
              attributes: [...component.attributes, { field: fieldLabel, value: "" }],
            }
          : component
      ),
    }))
  }

  const handleOrderInfoChange = <K extends keyof OrderInfo>(key: K, value: OrderInfo[K]) => {
    setOrderInfo((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleCreateClient = () => {
    const name = window.prompt("New client name")?.trim()
    if (!name) return
    setClientOptions((prev) => (prev.includes(name) ? prev : [...prev, name]))
    handleOrderInfoChange("client", name)
  }

  const handleAddContact = (contact: string) => {
    const trimmed = contact.trim()
    if (!trimmed) return
    setOrderInfo((prev) =>
      prev.contacts.includes(trimmed)
        ? prev
        : {
            ...prev,
            contacts: [...prev.contacts, trimmed],
          }
    )
  }

  const handleRemoveContact = (contact: string) => {
    setOrderInfo((prev) => ({
      ...prev,
      contacts: prev.contacts.filter((entry) => entry !== contact),
    }))
  }

  const handleAssignTeam = (itemId: string, team: string) => {
    updateItem(itemId, (item) => ({
      ...item,
      assignedTeam: team,
    }))
  }

  const handleAssignOwner = (itemId: string, owner: string) => {
    updateItem(itemId, (item) => ({
      ...item,
      owner,
    }))
  }

  const handleTraceabilityChange = (
    itemId: string,
    updates: Partial<ItemProfile["traceability"]>
  ) => {
    updateItem(itemId, (item) => {
      const nextTraceability = { ...item.traceability, ...updates }
      const shouldPropagate = Object.prototype.hasOwnProperty.call(updates, "digitalPassportEnabled")
      return {
        ...item,
        traceability: nextTraceability,
        components: shouldPropagate
          ? item.components.map((component) => ({
              ...component,
              digitalPassportEnabled: Boolean(nextTraceability.digitalPassportEnabled),
            }))
          : item.components,
      }
    })
  }

  const handleTraceabilityRegionToggle = (itemId: string, regionId: string) => {
    updateItem(itemId, (item) => {
      const regions = item.traceability.complianceRegions.includes(regionId)
        ? item.traceability.complianceRegions.filter((entry) => entry !== regionId)
        : [...item.traceability.complianceRegions, regionId]
      return {
        ...item,
        traceability: {
          ...item.traceability,
          complianceRegions: regions,
        },
      }
    })
  }

  const handleAddAttachment = (itemId: string, category: string = "Supporting file") => {
    updateItem(itemId, (item) => ({
      ...item,
      attachments: [
        ...item.attachments,
        {
          id: `att-${Date.now()}`,
          name: `${item.name} ${category} ${item.attachments.length + 1}.pdf`,
          category,
          size: "—",
          updatedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        },
      ],
    }))
  }

  const handleRemoveAttachment = (itemId: string, attachmentId: string) => {
    updateItem(itemId, (item) => ({
      ...item,
      attachments: item.attachments.filter((attachment) => attachment.id !== attachmentId),
    }))
  }

  const handleNotificationChange = (
    itemId: string,
    channel: NotificationChannel,
    updates: Partial<NotificationSetting>
  ) => {
    updateItem(itemId, (item) => ({
      ...item,
      notifications: item.notifications.map((notification) =>
        notification.channel === channel ? { ...notification, ...updates } : notification
      ),
    }))
  }

  const goToStage = (index: number) => {
    setStageIndex(Math.min(Math.max(index, 0), STAGES.length - 1))
  }

  const goNextStage = () => {
    if (STAGES[stageIndex]?.id === "items" && activeItemIndex < items.length - 1) {
      setActiveItemIndex((prev) => Math.min(prev + 1, items.length - 1))
      return
    }
    setStageIndex((prev) => Math.min(prev + 1, STAGES.length - 1))
  }

  const goPrevStage = () => {
    if (STAGES[stageIndex]?.id === "items" && activeItemIndex > 0) {
      setActiveItemIndex((prev) => Math.max(prev - 1, 0))
      return
    }
    setStageIndex((prev) => Math.max(prev - 1, 0))
  }

  const handleAddItem = () => {
    const newIndex = items.length
    const newItem: ItemProfile = {
      id: `item-${String(newIndex + 1).padStart(3, "0")}`,
      name: "Untitled Item",
      code: `ITEM-${newIndex + 1}`,
      quantity: 1,
      type: "complex",
      status: "Draft",
      summary: "Outline attributes and workflow to generate its QR profile.",
      workflow: "Select workflow",
      workflowStages: [],
      attributes: activePreset.defaultAttributes.map((field) => ({ field, value: "" })),
      components: [],
      timeline: { start: "", end: "" },
      labelFields: ["code", "quantity", "workflow"],
      labelLogo: false,
      attachments: [],
      assignedTeam: "",
      owner: "",
      notifications: [
        { channel: "email", label: "Production email", enabled: true, cadence: "Stage completion" },
        { channel: "sms", label: "SMS alerts", enabled: false, cadence: "Exceptions only" },
        { channel: "portal", label: "Portal updates", enabled: true, cadence: "Daily summary" },
      ],
      traceability: {
        digitalPassportEnabled: false,
        complianceRegions: [],
        shareWithPartners: false,
        includeLifecycleStages: true,
        includeMaterialCertificates: true,
        includeCarbonAccounting: false,
      },
    }

    setItems((prev) => [...prev, newItem])
    setActiveItemIndex(newIndex)
    setStageIndex(STAGES.findIndex((stage) => stage.id === "items"))
  }

  const stage = STAGES[stageIndex]

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 h-14 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="flex h-full items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <img src="/groovy-logo.png" alt="Groovy" className="h-8" />
            <div className="h-6 w-px bg-slate-300" />
            <h1 className="text-lg font-semibold text-slate-900">New Order Suite</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Input
                placeholder="Search orders"
                className="w-72 pl-10"
                aria-label="Search orders"
              />
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
            <Button variant="ghost" className="hidden md:inline-flex">
              View Drafts
            </Button>
            <Button>Save Draft</Button>
          </div>
        </div>
      </header>

      <div className="flex">
        <Sidebar
          sidebarExpanded={sidebarExpanded}
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
        />

        <main className="flex-1 overflow-y-auto bg-slate-50">
          <div className="space-y-10 px-6 py-10 md:px-10 lg:px-16 xl:px-24">
            <StageStepper
                stages={STAGES}
                activeIndex={stageIndex}
                itemsRemaining={
                  STAGES[stageIndex]?.id === "items" ? items.length - activeItemIndex - 1 : undefined
                }
                onStepSelect={goToStage}
              />

              <Card className="w-full border-slate-200 bg-white shadow-lg">
                <CardHeader className="border-b border-slate-200 pb-4">
                  <CardTitle className="flex items-center justify-between text-2xl font-semibold text-slate-900">
                    <span>{stage.title}</span>
                    <Badge className="bg-blue-500 text-white">Stage {stageIndex + 1} of {STAGES.length}</Badge>
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-500">{stage.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pt-6 pb-32">
                  {stage.id === "overview" && (
                    <OverviewStage
                      preset={activePreset}
                      orderInfo={orderInfo}
                      onOrderInfoChange={handleOrderInfoChange}
                      contactDirectory={CONTACT_DIRECTORY}
                      clientOptions={clientOptions}
                      onCreateClient={handleCreateClient}
                      onAddContact={handleAddContact}
                      onRemoveContact={handleRemoveContact}
                      teamDirectory={TEAM_DIRECTORY}
                      orderOwners={ORDER_OWNERS}
                    />
                  )}

                  {stage.id === "milestones" && <MilestonesStage />}

                  {stage.id === "items" && (
                    <ItemStage
                      items={items}
                      activeItemIndex={activeItemIndex}
                      onItemSelect={setActiveItemIndex}
                      selectedItem={selectedItem}
                      presetAttributes={activePreset.defaultAttributes}
                      onAddItem={handleAddItem}
                      onUpdateItemField={handleItemFieldChange}
                      onUpdateTimeline={handleItemTimelineChange}
                      onUpdateComponentField={handleComponentFieldChange}
                      onAddComponent={handleAddComponent}
                      onAttributeChange={handleAttributeChange}
                      onAddAttribute={handleAddAttribute}
                      onAddAttachment={handleAddAttachment}
                      onRemoveAttachment={handleRemoveAttachment}
                      onAssignTeam={handleAssignTeam}
                      onAssignOwner={handleAssignOwner}
                      onNotificationChange={handleNotificationChange}
                      onToggleType={handleItemTypeToggle}
                      teams={TEAM_DIRECTORY}
                      onToggleLabelField={handleLabelFieldToggle}
                      onAddCustomLabelField={handleAddCustomLabelField}
                      onToggleLabelLogo={handleLabelLogoToggle}
                      standardLabelFields={STANDARD_LABEL_FIELDS}
                      traceabilityOptions={TRACEABILITY_COMPLIANCE_OPTIONS}
                      onTraceabilityChange={handleTraceabilityChange}
                      onTraceabilityRegionToggle={handleTraceabilityRegionToggle}
                    />
                  )}

                  {stage.id === "workflows" && (
                    <WorkflowStage
                      items={items}
                      activeItemIndex={activeItemIndex}
                      onItemSelect={setActiveItemIndex}
                      workflowLibrary={WORKFLOW_LIBRARY}
                      onItemWorkflowChange={handleItemWorkflowChange}
                      onComponentWorkflowChange={handleComponentWorkflowChange}
                    />
                  )}

                  {stage.id === "review" && (
                    <ReviewStage
                      items={items}
                      presetName={activePreset.label}
                      onAddItem={handleAddItem}
                      standardLabelFields={STANDARD_LABEL_FIELDS}
                    />
                  )}
                </CardContent>
              </Card>
          </div>

          <footer className="sticky bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 py-4 md:px-10 lg:px-16 xl:px-24">
              <div className="text-xs text-slate-500">
                Autosaves to order draft. Publishing generates immutable IDs and QR batches.
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" onClick={goPrevStage} disabled={stageIndex === 0 && activeItemIndex === 0}>
                  Back
                </Button>
                <Button onClick={goNextStage}>
                  {stage.id === "review" ? "Publish Order" : getPrimaryCtaLabel(stage.id, activeItemIndex, items)}
                </Button>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}

function getPrimaryCtaLabel(stage: StageId, activeItemIndex: number, items: ItemProfile[]) {
  if (stage === "overview") return "Continue to milestones"
  if (stage === "milestones") return "Continue to items"
  if (stage === "items") {
    const hasMoreItems = activeItemIndex < items.length - 1
    return hasMoreItems ? "Next item" : "Review workflows"
  }
  if (stage === "workflows") return "Review order"
  return "Next"
}
