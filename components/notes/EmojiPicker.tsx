'use client'

import { useState, useRef, useEffect } from 'react'
import { Smile } from 'lucide-react'

const EMOJI_CATEGORIES = [
  {
    name: 'Smileys',
    emojis: ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘']
  },
  {
    name: 'Objects',
    emojis: ['📝', '📄', '📃', '📋', '📊', '📈', '📉', '🗂️', '📁', '📂', '🗃️', '📑', '📰', '📓', '📔', '📕']
  },
  {
    name: 'Symbols',
    emojis: ['💡', '⭐', '✨', '🔥', '💥', '✅', '❌', '⚠️', '🎯', '🎨', '🎭', '🎪', '🎬', '🎤', '🎧', '🎼']
  },
  {
    name: 'Nature',
    emojis: ['🌟', '🌈', '🌸', '🌺', '🌻', '🌷', '🌹', '🍀', '🌿', '🌱', '🌴', '🌵', '🌾', '🌳', '🌲', '🍁']
  },
  {
    name: 'Food',
    emojis: ['🍕', '🍔', '🍟', '🌭', '🍿', '🧃', '🥤', '☕', '🍵', '🍰', '🍪', '🍩', '🧁', '🍦', '🍨', '🍧']
  },
]

interface EmojiPickerProps {
  value?: string
  onChange: (emoji: string) => void
}

export default function EmojiPicker({ value, onChange }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-14 h-14 text-3xl hover:bg-slate-100 rounded-lg transition-colors"
        title="Add emoji"
      >
        {value || <Smile className="h-6 w-6 text-slate-400" />}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg border border-slate-200 shadow-lg z-50 p-3">
          <div className="mb-2 text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Pick an emoji
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {EMOJI_CATEGORIES.map((category) => (
              <div key={category.name}>
                <div className="text-xs font-medium text-slate-500 mb-1.5">{category.name}</div>
                <div className="grid grid-cols-8 gap-1">
                  {category.emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        onChange(emoji)
                        setIsOpen(false)
                      }}
                      className="text-2xl hover:bg-slate-100 rounded p-1 transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

