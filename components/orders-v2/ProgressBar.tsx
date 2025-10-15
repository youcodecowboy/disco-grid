// Minimal progress bar for wizard

type ProgressBarProps = {
  progress: number
  currentStep: number
  totalSteps: number
}

export function ProgressBar({ progress, currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Step {currentStep + 1} of {totalSteps}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-1 w-full rounded-full bg-slate-200 overflow-hidden">
        <div 
          className="h-full bg-sky-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

