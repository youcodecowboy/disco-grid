'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import type { Note } from './types'
import NotesSidebar from '@/components/notes/NotesSidebar'
import NotesEditor from '@/components/notes/NotesEditor'
import { mockNotes } from '@/lib/notes/mockNotes'
import { createEmptyNote } from '@/lib/notes/noteUtils'
import { LayoutScaffold } from '@/components/grid-v2/LayoutScaffold'
import { Button } from '@/components/ui/button'

const STORAGE_KEY = 'disco-notes'

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load notes from localStorage or use mock data
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // Convert date strings back to Date objects and migrate old notes
        const notesWithDates = parsed.map((note: any) => ({
          ...note,
          // Migrate old notes that don't have new fields
          emoji: note.emoji || undefined,
          author: note.author || 'Current User',
          tags: note.tags || [],
          mentions: note.mentions || [],
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        }))
        setNotes(notesWithDates)
        if (notesWithDates.length > 0) {
          setCurrentNoteId(notesWithDates[0].id)
        }
      } catch (e) {
        console.error('Failed to parse notes from localStorage', e)
        setNotes(mockNotes)
        setCurrentNoteId(mockNotes[0]?.id || null)
      }
    } else {
      setNotes(mockNotes)
      setCurrentNoteId(mockNotes[0]?.id || null)
    }
    setIsLoaded(true)
  }, [])

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (isLoaded && notes.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
    }
  }, [notes, isLoaded])

  const handleNewNote = () => {
    const newNote = createEmptyNote()
    setNotes([newNote, ...notes])
    setCurrentNoteId(newNote.id)
  }

  const handleSelectNote = (noteId: string) => {
    setCurrentNoteId(noteId)
  }

  const handleUpdateNote = (updatedNote: Note) => {
    setNotes(notes.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    ))
  }

  const currentNote = notes.find(note => note.id === currentNoteId) || null

  if (!isLoaded) {
    return (
      <LayoutScaffold pageTitle="Notes" pageSubtext="Create and manage your documents">
        <div className="flex items-center justify-center h-96">
          <div className="text-slate-400">Loading...</div>
        </div>
      </LayoutScaffold>
    )
  }

  return (
    <LayoutScaffold 
      pageTitle="Notes" 
      pageSubtext="Create and manage your documents with embedded data blocks"
      headerActions={
        <Button onClick={handleNewNote} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </Button>
      }
    >
      <div className="flex gap-6 h-[calc(100vh-8rem)] -mx-4 -mt-6">
        <NotesSidebar
          notes={notes}
          currentNoteId={currentNoteId}
          onSelectNote={handleSelectNote}
          onNewNote={handleNewNote}
        />
        {currentNote ? (
          <NotesEditor
            note={currentNote}
            onUpdate={handleUpdateNote}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 bg-white">
            <div className="text-center">
              <p className="text-lg mb-2">No note selected</p>
              <p className="text-sm">Create a new note to get started</p>
            </div>
          </div>
        )}
      </div>
    </LayoutScaffold>
  )
}

