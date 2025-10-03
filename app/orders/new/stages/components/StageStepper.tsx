"use client"

import { CheckCircle2, Circle } from "lucide-react"

type StageStepperProps = {
  stages: Array<{ id: string; title: string; description: string }>
  activeIndex: number
  itemsRemaining?: number
  onStepSelect: (index: number) => void
}

export function StageStepper({ stages, activeIndex, itemsRemaining, onStepSelect }: StageStepperProps) {
  return (
    <nav className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <ol className="flex flex-wrap items-center gap-4">
        {stages.map((stage, index) => {
          const status = index < activeIndex ? "complete" : index === activeIndex ? "current" : "upcoming"
          return (
            <li key={stage.id} className="flex items-center gap-3">
              <button
                onClick={() => onStepSelect(index)}
                className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition ${
                  status === "complete"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : status === "current"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 text-slate-500 hover:border-blue-200"
                }`}
              >
                {status === "complete" ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                <span className="hidden sm:inline">{stage.title}</span>
                <span className="sm:hidden">Step {index + 1}</span>
              </button>
              {index < stages.length - 1 && <div className="hidden h-px w-10 bg-slate-200 lg:block" />}
            </li>
          )
        })}
        {typeof itemsRemaining === "number" && itemsRemaining > 0 && (
          <li className="ml-auto text-xs text-slate-500">{itemsRemaining} more item(s) queued</li>
        )}
      </ol>
    </nav>
  )
}




