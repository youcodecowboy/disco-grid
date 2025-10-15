'use client'

import { useState, useCallback } from 'react'
import { X } from 'lucide-react'
import type { Note, NoteBlock } from '@/app/notes/types'
import NoteHeader from './NoteHeader'
import TextBlock from './TextBlock'
import AddBlockButton from './AddBlockButton'
import BlockPicker from './BlockPicker'
import BlockRenderer from '@/components/BlockRenderer'
import EditableTable from './EditableTable'
import { blockRegistry } from '@/lib/block-registry/definitions'
import {
    generateBlockId,
    insertBlockAt,
    removeBlockAt,
    updateBlockAt,
    createTextBlock
} from '@/lib/notes/noteUtils'

interface NotesEditorProps {
  note: Note
  onUpdate: (note: Note) => void
}

export default function NotesEditor({ note, onUpdate }: NotesEditorProps) {
  const [showBlockPicker, setShowBlockPicker] = useState<number | null>(null)
  const [hoveredBlockIndex, setHoveredBlockIndex] = useState<number | null>(null)

  const updateNote = useCallback((updates: Partial<Note>) => {
    onUpdate({ ...note, ...updates, updatedAt: new Date() })
  }, [note, onUpdate])

  const handleBlockChange = (index: number, content: string) => {
    const updatedBlocks = updateBlockAt(note.content, index, { content })
    updateNote({ content: updatedBlocks })
  }

  const handleAddBlockAfter = (index: number, blockType: string) => {
    const newBlock = createBlockFromType(blockType, index + 1)
    const updatedBlocks = insertBlockAt(note.content, newBlock, index + 1)
    updateNote({ content: updatedBlocks })
    setShowBlockPicker(null)
  }

  const handleRemoveBlock = (index: number) => {
    if (note.content.length === 1) {
      // Don't remove the last block, just clear it
      const updatedBlocks = updateBlockAt(note.content, index, { content: '' })
      updateNote({ content: updatedBlocks })
    } else {
      const updatedBlocks = removeBlockAt(note.content, index)
      updateNote({ content: updatedBlocks })
    }
  }

  const handleEnter = (index: number) => {
    const newBlock = createTextBlock(index + 1)
    const updatedBlocks = insertBlockAt(note.content, newBlock, index + 1)
    updateNote({ content: updatedBlocks })
  }

  const handleBackspace = (index: number) => {
    if (index > 0) {
      handleRemoveBlock(index)
    }
  }

  const handleTab = (index: number) => {
    setShowBlockPicker(index)
  }

  const handleSlash = (index: number) => {
    setShowBlockPicker(index)
  }

  const handleConvertBlock = (index: number, blockType: string) => {
    const currentBlock = note.content[index]
    const newBlock = createBlockFromType(blockType, index, currentBlock.content as string)
    const updatedBlocks = updateBlockAt(note.content, index, newBlock)
    updateNote({ content: updatedBlocks })
    setShowBlockPicker(null)
  }

  function createBlockFromType(type: string, order: number, initialContent?: string): NoteBlock {
    const blockDef = blockRegistry[type as keyof typeof blockRegistry]
    
    if (type === 'text' || type === 'h1' || type === 'h2' || type === 'h3' || type === 'subtitle') {
      return {
        id: generateBlockId(),
        type: type as any,
        content: initialContent || '',
        order,
      }
    }

    // Special handling for editable tables
    if (type === 'table.editable') {
      return {
        id: generateBlockId(),
        type: type as any,
        content: {
          columns: ['Column 1', 'Column 2', 'Column 3'],
          rows: [
            { id: 'row-1', cells: [{ value: '' }, { value: '' }, { value: '' }] },
            { id: 'row-2', cells: [{ value: '' }, { value: '' }, { value: '' }] },
          ]
        },
        order,
      }
    }

    // For data blocks, use default props from registry
    return {
      id: generateBlockId(),
      type: type as any,
      content: blockDef?.defaultProps || {},
      order,
    }
  }

  const renderBlock = (block: NoteBlock, index: number) => {
    const isHovered = hoveredBlockIndex === index
    const isShowingPicker = showBlockPicker === index

    if (block.type === 'text' || block.type === 'h1' || block.type === 'h2' || block.type === 'h3' || block.type === 'subtitle') {
      return (
        <div
          key={block.id}
          className="relative group"
          onMouseEnter={() => setHoveredBlockIndex(index)}
          onMouseLeave={() => setHoveredBlockIndex(null)}
        >
          <div className="flex items-start gap-2">
            {/* Add block button - shows on hover */}
            <div className="absolute -left-8 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <AddBlockButton onClick={() => setShowBlockPicker(index)} />
            </div>

            <div className="flex-1 min-w-0">
              <TextBlock
                value={block.content as string}
                onChange={(value) => handleBlockChange(index, value)}
                onEnter={() => handleEnter(index)}
                onBackspace={() => handleBackspace(index)}
                onTab={() => handleTab(index)}
                onSlash={() => handleSlash(index)}
                blockType={block.type as any}
                placeholder={index === 0 ? "Start typing or type / for commands" : "Type / for commands"}
                autoFocus={index === note.content.length - 1 && block.content === ''}
              />
            </div>

            {/* Remove button - shows on hover for non-empty blocks */}
            {block.content && (
              <button
                onClick={() => handleRemoveBlock(index)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-600 mt-2"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Block picker */}
          {isShowingPicker && (
            <div className="relative">
              <BlockPicker
                onSelect={(blockType) => {
                  if (block.content === '' || block.content === '/') {
                    handleConvertBlock(index, blockType)
                  } else {
                    handleAddBlockAfter(index, blockType)
                  }
                }}
                onClose={() => setShowBlockPicker(null)}
              />
            </div>
          )}
        </div>
      )
    }

    // Special handling for editable tables
    if (block.type === 'table.editable') {
      return (
        <div
          key={block.id}
          className="relative group my-4"
          onMouseEnter={() => setHoveredBlockIndex(index)}
          onMouseLeave={() => setHoveredBlockIndex(null)}
        >
          <div className="flex items-start gap-2">
            {/* Add block button - shows on hover */}
            <div className="absolute -left-8 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <AddBlockButton onClick={() => setShowBlockPicker(index)} />
            </div>

            <div className="flex-1 min-w-0 border border-slate-200 rounded-lg overflow-hidden p-4">
              <EditableTable
                data={block.content as any}
                onChange={(newData) => handleBlockChange(index, newData)}
              />
            </div>

            {/* Remove button */}
            <button
              onClick={() => handleRemoveBlock(index)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-600 mt-4"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Block picker */}
          {isShowingPicker && (
            <div className="relative mt-2">
              <BlockPicker
                onSelect={(blockType) => handleAddBlockAfter(index, blockType)}
                onClose={() => setShowBlockPicker(null)}
              />
            </div>
          )}
        </div>
      )
    }

    // Render data blocks using BlockRenderer
    return (
      <div
        key={block.id}
        className="relative group my-4"
        onMouseEnter={() => setHoveredBlockIndex(index)}
        onMouseLeave={() => setHoveredBlockIndex(null)}
      >
        <div className="flex items-start gap-2">
          {/* Add block button - shows on hover */}
          <div className="absolute -left-8 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <AddBlockButton onClick={() => setShowBlockPicker(index)} />
          </div>

          <div className="flex-1 min-w-0 border border-slate-200 rounded-lg overflow-hidden">
            <BlockRenderer
              block={{
                id: block.id,
                type: block.type as any,
                title: blockRegistry[block.type as keyof typeof blockRegistry]?.defaultTitle,
                props: block.content as Record<string, any>,
              }}
            />
          </div>

          {/* Remove button */}
          <button
            onClick={() => handleRemoveBlock(index)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-600 mt-4"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Block picker */}
        {isShowingPicker && (
          <div className="relative mt-2">
            <BlockPicker
              onSelect={(blockType) => handleAddBlockAfter(index, blockType)}
              onClose={() => setShowBlockPicker(null)}
            />
          </div>
        )}
      </div>
    )
  }

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400">
        <p>Select a note to start editing</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="max-w-3xl mx-auto py-8 px-8">
        {/* Enhanced Header with emoji, tags, mentions */}
        <NoteHeader note={note} onUpdate={updateNote} />

        {/* Content blocks */}
        <div className="space-y-1">
          {note.content.map((block, index) => renderBlock(block, index))}
        </div>
      </div>
    </div>
  )
}

