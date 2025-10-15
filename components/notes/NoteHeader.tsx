'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Plus, User, Users as UsersIcon, CheckSquare, Briefcase, ShoppingCart } from 'lucide-react'
import type { Note, NoteMention } from '@/app/notes/types'
import EmojiPicker from './EmojiPicker'
import { formatDate } from '@/lib/notes/noteUtils'

interface NoteHeaderProps {
  note: Note
  onUpdate: (updates: Partial<Note>) => void
}

const MENTION_TYPES = [
  { type: 'person' as const, icon: User, label: 'Person', color: 'bg-blue-100 text-blue-700' },
  { type: 'team' as const, icon: UsersIcon, label: 'Team', color: 'bg-purple-100 text-purple-700' },
  { type: 'task' as const, icon: CheckSquare, label: 'Task', color: 'bg-green-100 text-green-700' },
  { type: 'client' as const, icon: Briefcase, label: 'Client', color: 'bg-amber-100 text-amber-700' },
  { type: 'order' as const, icon: ShoppingCart, label: 'Order', color: 'bg-rose-100 text-rose-700' },
]

export default function NoteHeader({ note, onUpdate }: NoteHeaderProps) {
  const [showMentionPicker, setShowMentionPicker] = useState(false)
  const [showTagInput, setShowTagInput] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [newMentionLabel, setNewMentionLabel] = useState('')
  const [selectedMentionType, setSelectedMentionType] = useState<NoteMention['type'] | null>(null)
  const tagInputRef = useRef<HTMLInputElement>(null)
  const mentionInputRef = useRef<HTMLInputElement>(null)

  // Ensure note has required fields (migration safety)
  const tags = note.tags || []
  const mentions = note.mentions || []

  useEffect(() => {
    if (showTagInput && tagInputRef.current) {
      tagInputRef.current.focus()
    }
  }, [showTagInput])

  useEffect(() => {
    if (selectedMentionType && mentionInputRef.current) {
      mentionInputRef.current.focus()
    }
  }, [selectedMentionType])

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      onUpdate({ tags: [...tags, newTag.trim()] })
      setNewTag('')
      setShowTagInput(false)
    }
  }

  const handleRemoveTag = (tag: string) => {
    onUpdate({ tags: tags.filter(t => t !== tag) })
  }

  const handleAddMention = () => {
    if (newMentionLabel.trim() && selectedMentionType) {
      const newMention: NoteMention = {
        id: `mention-${Date.now()}`,
        type: selectedMentionType,
        label: newMentionLabel.trim(),
      }
      onUpdate({ mentions: [...mentions, newMention] })
      setNewMentionLabel('')
      setSelectedMentionType(null)
      setShowMentionPicker(false)
    }
  }

  const handleRemoveMention = (mentionId: string) => {
    onUpdate({ mentions: mentions.filter(m => m.id !== mentionId) })
  }

  const getMentionConfig = (type: NoteMention['type']) => {
    return MENTION_TYPES.find(t => t.type === type)
  }

  return (
    <div className="mb-6 pb-6 border-b border-slate-200">
      {/* Top row: Emoji + Title */}
      <div className="flex items-start gap-3 mb-4">
        <EmojiPicker
          value={note.emoji}
          onChange={(emoji) => onUpdate({ emoji })}
        />
        <div className="flex-1">
          <input
            type="text"
            value={note.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Untitled"
            className="w-full text-4xl font-bold text-slate-900 placeholder-slate-300 bg-transparent border-none outline-none"
          />
        </div>
      </div>

      {/* Subtitle: Author and date */}
      <div className="text-sm text-slate-500 mb-4 ml-[68px]">
        Created by <span className="font-medium text-slate-700">{note.author || 'Current User'}</span> • {formatDate(note.createdAt)}
        {note.updatedAt.getTime() !== note.createdAt.getTime() && (
          <> • Updated {formatDate(note.updatedAt)}</>
        )}
      </div>

      {/* Mentions section */}
      <div className="ml-[68px] mb-3">
        <div className="flex items-center flex-wrap gap-2">
          {mentions.map((mention) => {
            const config = getMentionConfig(mention.type)
            if (!config) return null
            const Icon = config.icon
            return (
              <div
                key={mention.id}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-sm font-medium ${config.color}`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{mention.label}</span>
                <button
                  onClick={() => handleRemoveMention(mention.id)}
                  className="ml-1 hover:opacity-70"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )
          })}

          {!showMentionPicker && !selectedMentionType && (
            <button
              onClick={() => setShowMentionPicker(true)}
              className="flex items-center gap-1.5 px-2 py-1 text-sm text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add mention</span>
            </button>
          )}

          {showMentionPicker && !selectedMentionType && (
            <div className="flex items-center gap-2">
              {MENTION_TYPES.map((mentionType) => {
                const Icon = mentionType.icon
                return (
                  <button
                    key={mentionType.type}
                    onClick={() => setSelectedMentionType(mentionType.type)}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-sm font-medium ${mentionType.color} hover:opacity-80 transition-opacity`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{mentionType.label}</span>
                  </button>
                )
              })}
              <button
                onClick={() => setShowMentionPicker(false)}
                className="p-1 hover:bg-slate-100 rounded"
              >
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>
          )}

          {selectedMentionType && (
            <div className="flex items-center gap-2">
              <input
                ref={mentionInputRef}
                type="text"
                value={newMentionLabel}
                onChange={(e) => setNewMentionLabel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddMention()
                  if (e.key === 'Escape') {
                    setSelectedMentionType(null)
                    setNewMentionLabel('')
                  }
                }}
                placeholder={`Enter ${selectedMentionType} name...`}
                className="px-2 py-1 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-slate-400"
              />
              <button
                onClick={handleAddMention}
                className="px-2 py-1 text-sm bg-slate-900 text-white rounded-md hover:bg-slate-800"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setSelectedMentionType(null)
                  setNewMentionLabel('')
                }}
                className="p-1 hover:bg-slate-100 rounded"
              >
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tags section */}
      <div className="ml-[68px]">
        <div className="flex items-center flex-wrap gap-2">
          {tags.map((tag) => (
            <div
              key={tag}
              className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium"
            >
              <span>#{tag}</span>
              <button
                onClick={() => handleRemoveTag(tag)}
                className="hover:opacity-70"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          {!showTagInput ? (
            <button
              onClick={() => setShowTagInput(true)}
              className="flex items-center gap-1.5 px-2 py-1 text-sm text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add tag</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <input
                ref={tagInputRef}
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddTag()
                  if (e.key === 'Escape') {
                    setShowTagInput(false)
                    setNewTag('')
                  }
                }}
                placeholder="Tag name..."
                className="px-2 py-1 text-sm border border-slate-300 rounded-full focus:outline-none focus:border-slate-400"
              />
              <button
                onClick={handleAddTag}
                className="px-2 py-1 text-sm bg-slate-900 text-white rounded-full hover:bg-slate-800"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowTagInput(false)
                  setNewTag('')
                }}
                className="p-1 hover:bg-slate-100 rounded"
              >
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

