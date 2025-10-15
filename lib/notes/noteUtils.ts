import type { Note, NoteBlock } from "@/app/notes/types"

export function generateNoteId(): string {
  return `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function generateBlockId(): string {
  return `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function createEmptyNote(): Note {
  return {
    id: generateNoteId(),
    title: 'Untitled',
    author: 'Current User',
    tags: [],
    mentions: [],
    content: [
      {
        id: generateBlockId(),
        type: 'text',
        content: '',
        order: 0,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

export function createTextBlock(order: number): NoteBlock {
  return {
    id: generateBlockId(),
    type: 'text',
    content: '',
    order,
  }
}

export function createHeadingBlock(content: string, order: number, level: 'h1' | 'h2' | 'h3' = 'h1'): NoteBlock {
  return {
    id: generateBlockId(),
    type: level,
    content,
    order,
  }
}

export function formatDate(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    return 'Today'
  } else if (days === 1) {
    return 'Yesterday'
  } else if (days < 7) {
    return `${days} days ago`
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }
}

export function reorderBlocks(blocks: NoteBlock[]): NoteBlock[] {
  return blocks.map((block, index) => ({
    ...block,
    order: index,
  }))
}

export function insertBlockAt(blocks: NoteBlock[], newBlock: NoteBlock, index: number): NoteBlock[] {
  const updated = [...blocks]
  updated.splice(index, 0, newBlock)
  return reorderBlocks(updated)
}

export function removeBlockAt(blocks: NoteBlock[], index: number): NoteBlock[] {
  const updated = [...blocks]
  updated.splice(index, 1)
  return reorderBlocks(updated)
}

export function updateBlockAt(blocks: NoteBlock[], index: number, updates: Partial<NoteBlock>): NoteBlock[] {
  const updated = [...blocks]
  updated[index] = { ...updated[index], ...updates }
  return updated
}

export function getBlockTitle(block: NoteBlock): string {
  if (block.type === 'text' || block.type === 'heading') {
    const content = block.content as string
    return content.slice(0, 50) + (content.length > 50 ? '...' : '')
  }
  return block.type
}

