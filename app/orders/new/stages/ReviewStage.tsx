"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { ItemProfile, StandardLabelField, resolveLabelField } from "../types"
import { LabelPreview } from "./components/LabelPreview"

type ReviewStageProps = {
  items: ItemProfile[]
  presetName: string
  onAddItem: () => void
  standardLabelFields: StandardLabelField[]
}

export function ReviewStage({ items, presetName, onAddItem, standardLabelFields }: ReviewStageProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section className="space-y-4">
        <Card className="border-slate-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-900">Ready to publish</h3>
            <p className="mt-2 text-sm text-slate-600">
              Items, workflows, and QR rules will lock once published. You can still duplicate the order for future batches.
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-slate-900">Items & workflows</CardTitle>
            <CardDescription className="text-slate-500">
              Review configured assets before generating QR codes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">Workflow: {item.workflow}</p>
                  </div>
                  <Badge className="bg-slate-500 text-white">Qty {item.quantity}</Badge>
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  Components: {item.components.length || "None"} · Attribute fields: {item.attributes.length}
                </div>
                <div className="mt-2 text-[11px] text-slate-500">
                  Label fields: {item.labelFields.length > 0
                    ? renderLabelFieldList(item, standardLabelFields)
                    : "None"}
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full" onClick={onAddItem}>
              Add another item
            </Button>
          </CardContent>
        </Card>
      </section>

      <aside className="space-y-4">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-base text-slate-900">Preset</CardTitle>
            <CardDescription className="text-slate-500">{presetName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>• Client portal scoped to this order hierarchy.</p>
            <p>• All items inherit QR naming (`{`OrderID-ItemID-ComponentID`}`).</p>
            <p>• Publishing notifies stakeholders + locks milestones.</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-base text-slate-900">Next actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>1. Trigger QR batch generator (PDF + API).</p>
            <p>2. Share order link with Horizon portal.</p>
            <p>3. Monitor workflow readiness from Mission Control.</p>
          </CardContent>
        </Card>
        {items[0] && (
          <LabelPreview
            item={items[0]}
            fields={items[0].labelFields}
            showLogo={items[0].labelLogo}
            standardLabelFields={standardLabelFields}
          />
        )}
      </aside>
    </div>
  )
}

function renderLabelFieldList(item: ItemProfile, standardFields: StandardLabelField[]) {
  return item.labelFields
    .map((fieldId) => resolveLabelField(fieldId, item, standardFields).label)
    .join(", ")
}

