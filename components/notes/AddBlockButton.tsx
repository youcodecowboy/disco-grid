import { Plus } from "lucide-react"

interface AddBlockButtonProps {
  onClick: () => void
  className?: string
}

export default function AddBlockButton({ onClick, className = "" }: AddBlockButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 py-1 transition-colors ${className}`}
      aria-label="Add block"
    >
      <Plus className="h-4 w-4" />
    </button>
  )
}

