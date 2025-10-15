// Simple vs Complex item toggle

import { cn } from "@/lib/utils"
import type { ItemComplexity } from "@/lib/orders-v2/types"

type ComplexityToggleProps = {
  value: ItemComplexity
  onChange: (complexity: ItemComplexity) => void
}

export function ComplexityToggle({ value, onChange }: ComplexityToggleProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-slate-700">Item Type</p>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onChange("simple")}
          className={cn(
            "rounded-xl border-2 p-4 text-left transition-all",
            value === "simple"
              ? "border-sky-500 bg-sky-50 shadow-sm"
              : "border-slate-200 bg-white hover:border-slate-300"
          )}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="text-2xl">📦</div>
            {value === "simple" && (
              <div className="h-5 w-5 rounded-full bg-sky-500 flex items-center justify-center">
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Simple Item</h3>
          <p className="text-xs text-slate-600">Single unit with one QR code. No sub-components.</p>
        </button>

        <button
          type="button"
          onClick={() => onChange("complex")}
          className={cn(
            "rounded-xl border-2 p-4 text-left transition-all",
            value === "complex"
              ? "border-sky-500 bg-sky-50 shadow-sm"
              : "border-slate-200 bg-white hover:border-slate-300"
          )}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="text-2xl">🧩</div>
            {value === "complex" && (
              <div className="h-5 w-5 rounded-full bg-sky-500 flex items-center justify-center">
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Complex Item</h3>
          <p className="text-xs text-slate-600">Multiple components, each with its own QR code.</p>
        </button>
      </div>
    </div>
  )
}

