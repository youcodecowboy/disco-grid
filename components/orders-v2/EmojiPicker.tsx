// Simple emoji picker - Notion-style

import { useState } from "react"
import { Smile } from "lucide-react"

type EmojiPickerProps = {
  value?: string
  onChange: (emoji: string) => void
}

const EMOJI_LIBRARY = [
  "📦", "📋", "🏭", "🚀", "⚡", "🎯", "✨", "🔥",
  "💼", "📊", "🎨", "🛠️", "🌟", "💎", "🎪", "🏆",
  "📱", "💻", "🖥️", "⌚", "🔧", "🔨", "📐", "📏",
  "👕", "👔", "👗", "👠", "🧥", "🎽", "👖", "🧦",
  "🪑", "🛋️", "🪟", "🚪", "🏠", "🏢", "🏗️", "🌉",
]

export function EmojiPicker({ value, onChange }: EmojiPickerProps) {
  const [showPicker, setShowPicker] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="w-10 h-10 rounded-lg border border-slate-200 hover:border-slate-300 bg-white flex items-center justify-center text-2xl transition-colors"
        title="Select icon"
      >
        {value || <Smile className="h-5 w-5 text-slate-400" />}
      </button>

      {showPicker && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowPicker(false)}
          />
          
          {/* Picker */}
          <div className="absolute top-full left-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white shadow-xl p-3 z-20">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
              <span className="text-xs font-medium text-slate-700">Choose an icon</span>
              {value && (
                <button
                  onClick={() => {
                    onChange("")
                    setShowPicker(false)
                  }}
                  className="text-xs text-slate-500 hover:text-slate-700"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-8 gap-1">
              {EMOJI_LIBRARY.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onChange(emoji)
                    setShowPicker(false)
                  }}
                  className="w-8 h-8 rounded hover:bg-slate-100 flex items-center justify-center text-xl transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

