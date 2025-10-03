"use client"

import { useMemo } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode } from "lucide-react"

import { CUSTOMER_NAME, ItemProfile, StandardLabelField, resolveLabelField } from "../../types"

type LabelPreviewProps = {
  item: ItemProfile
  fields: string[]
  showLogo: boolean
  standardLabelFields: StandardLabelField[]
}

export function LabelPreview({ item, fields, showLogo, standardLabelFields }: LabelPreviewProps) {
  const resolvedFields = useMemo(
    () => fields.map((field) => resolveLabelField(field, item, standardLabelFields)),
    [fields, item, standardLabelFields]
  )

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-blue-900">Label preview</CardTitle>
        <CardDescription className="text-blue-700">
          Real-time QR tag preview updates as attributes and workflows change.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-2xl border border-blue-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="text-xs uppercase tracking-wide text-slate-500">Item</p>
              <p className="text-lg font-semibold text-slate-900">{item.name}</p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-slate-200 bg-slate-100">
              <QrCode className="h-10 w-10 text-slate-700" />
            </div>
          </div>
          <div className="mt-3 space-y-1 text-xs text-slate-600">
            {resolvedFields.length === 0 ? (
              <p className="text-[11px] text-slate-400">Select fields to display on the label.</p>
            ) : (
              resolvedFields.map((field) => (
                <div key={`${field.label}-${field.value}`} className="flex justify-between">
                  <span className="font-medium text-slate-500">{field.label}</span>
                  <span className="text-slate-800">{field.value || "—"}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

