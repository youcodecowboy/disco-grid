// Inline attribute builder - Lego Style

import { useState } from "react"
import { Plus, X } from "lucide-react"
import type { ItemAttribute } from "@/lib/orders-v2/types"

type AttributeBuilderProps = {
  attributes: ItemAttribute[]
  onAdd: (field: string, value: string) => void
  onRemove: (id: string) => void
  presetSuggestions?: string[]
}

export function AttributeBuilder({ attributes, onAdd, onRemove, presetSuggestions }: AttributeBuilderProps) {
  const [newField, setNewField] = useState("")
  const [newValue, setNewValue] = useState("")
  const [isAddingField, setIsAddingField] = useState(true)

  // Filter out already-used field names from suggestions
  const usedFields = attributes.map(attr => attr.field.toLowerCase())
  const availableSuggestions = (presetSuggestions || []).filter(
    suggestion => !usedFields.includes(suggestion.toLowerCase())
  )

  const handleAddAttribute = () => {
    if (newField.trim() && newValue.trim()) {
      onAdd(newField.trim(), newValue.trim())
      setNewField("")
      setNewValue("")
      setIsAddingField(true)
    }
  }

  const handleFieldKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newField.trim()) {
      e.preventDefault()
      setIsAddingField(false)
    }
  }

  const handleValueKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newValue.trim()) {
      e.preventDefault()
      handleAddAttribute()
    }
  }

  return (
    <div className="space-y-2">
      {/* Existing attributes */}
      {attributes.map((attr) => (
        <div key={attr.id} className="flex items-center gap-2 group">
          <div className="flex-1 text-sm text-slate-700">
            <span className="font-medium">{attr.field}:</span> {attr.value}
          </div>
          <button
            onClick={() => onRemove(attr.id)}
            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}

      {/* Add new attribute */}
      <div className="flex items-center gap-2">
        <Plus className="h-4 w-4 text-slate-400" />
        {isAddingField ? (
          <input
            type="text"
            value={newField}
            onChange={(e) => setNewField(e.target.value)}
            onKeyPress={handleFieldKeyPress}
            placeholder="Field name (press Enter)"
            className="flex-1 text-sm text-slate-700 placeholder-slate-400 bg-transparent border-none outline-none"
            autoFocus
          />
        ) : (
          <div className="flex-1 flex items-center gap-2">
            <span className="text-sm text-slate-700 font-medium">{newField}:</span>
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              onKeyPress={handleValueKeyPress}
              placeholder="Value (press Enter)"
              className="flex-1 text-sm text-slate-700 placeholder-slate-400 bg-transparent border-none outline-none"
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Encouraging message */}
      {attributes.length === 0 && (
        <div className="pt-1">
          <p className="text-xs text-slate-500 italic">
            💡 Add as many attributes as possible for the best item tracking and traceability
          </p>
        </div>
      )}

      {/* Preset suggestions - always show available suggestions */}
      {availableSuggestions.length > 0 && (
        <div className="pt-2">
          <p className="text-xs text-slate-500 mb-2">
            {attributes.length === 0 ? "Suggested fields:" : "More suggested fields:"}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {availableSuggestions.slice(0, 8).map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setNewField(suggestion)
                  setIsAddingField(false)
                }}
                className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

