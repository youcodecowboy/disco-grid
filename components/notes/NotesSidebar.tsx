'use client'

import { FileText } from 'lucide-react'
import type { Note } from '@/app/notes/types'
import { formatDate } from '@/lib/notes/noteUtils'

interface NotesSidebarProps {
  notes: Note[]
  currentNoteId: string | null
  onSelectNote: (noteId: string) => void
  onNewNote: () => void
}

export default function NotesSidebar({
  notes,
  currentNoteId,
  onSelectNote,
  onNewNote,
}: NotesSidebarProps) {
  return (
    <div className="w-72 border-r border-slate-200 bg-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="text-sm font-semibold text-slate-700">
          All Notes
          <span className="ml-2 text-xs text-slate-400">({notes.length})</span>
        </div>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No notes yet</p>
            <p className="text-xs mt-1">Create your first note to get started</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {notes.map((note) => {
              const isActive = note.id === currentNoteId
              const preview = note.content.find(b => (b.type === 'text' || b.type === 'heading') && b.content)
              const previewText = preview ? (preview.content as string).slice(0, 60) : 'Empty note'

              return (
                <button
                  key={note.id}
                  onClick={() => onSelectNote(note.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-slate-100 border border-slate-200'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="font-medium text-slate-900 mb-1 truncate">
                    {note.title || 'Untitled'}
                  </div>
                  <div className="text-xs text-slate-500 mb-1.5 truncate">
                    {previewText}
                  </div>
                  <div className="text-xs text-slate-400">
                    {formatDate(note.updatedAt)}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

