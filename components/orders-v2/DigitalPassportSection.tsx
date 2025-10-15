// Digital Product Passport configuration - Lego Style

import { X } from "lucide-react"
import type { TraceabilityProfile } from "@/lib/orders-v2/types"
import { TRACEABILITY_COMPLIANCE_OPTIONS } from "@/lib/orders-v2/types"

type DigitalPassportSectionProps = {
  traceability: TraceabilityProfile
  onChange: (updates: Partial<TraceabilityProfile>) => void
  onRemove: () => void
}

export function DigitalPassportSection({ traceability, onChange, onRemove }: DigitalPassportSectionProps) {
  const toggleRegion = (regionId: string) => {
    const regions = traceability.complianceRegions.includes(regionId)
      ? traceability.complianceRegions.filter(r => r !== regionId)
      : [...traceability.complianceRegions, regionId]
    onChange({ complianceRegions: regions })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">Digital Product Passport</span>
        </div>
        <button
          onClick={onRemove}
          className="text-slate-400 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Enable toggle */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-sm font-semibold text-slate-900">Enable Passport</p>
            <p className="text-xs text-slate-500">Activate digital traceability for this item</p>
          </div>
          <input
            type="checkbox"
            checked={traceability.enabled}
            onChange={(e) => onChange({ enabled: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
          />
        </label>
      </div>

      {traceability.enabled && (
        <>
          {/* Compliance regions */}
          <div className="space-y-2 pl-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Compliance Regions
            </p>
            {TRACEABILITY_COMPLIANCE_OPTIONS.map((option) => (
              <label
                key={option.id}
                className="flex items-start gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={traceability.complianceRegions.includes(option.id)}
                  onChange={() => toggleRegion(option.id)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">{option.label}</p>
                  <p className="text-xs text-slate-500">{option.description}</p>
                </div>
              </label>
            ))}
          </div>

          {/* Additional options */}
          <div className="space-y-2 pl-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Additional Options
            </p>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={traceability.shareWithPartners}
                onChange={(e) => onChange({ shareWithPartners: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
              />
              <span className="text-sm text-slate-700">Share with partners</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={traceability.includeLifecycleStages}
                onChange={(e) => onChange({ includeLifecycleStages: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
              />
              <span className="text-sm text-slate-700">Include lifecycle stages</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={traceability.includeMaterialCertificates}
                onChange={(e) => onChange({ includeMaterialCertificates: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
              />
              <span className="text-sm text-slate-700">Include material certificates</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={traceability.includeCarbonAccounting}
                onChange={(e) => onChange({ includeCarbonAccounting: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
              />
              <span className="text-sm text-slate-700">Include carbon accounting</span>
            </label>
          </div>
        </>
      )}
    </div>
  )
}

