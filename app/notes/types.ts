import type { BlockType } from "@/lib/grid-v2/types"

export interface Note {
  id: string
  title: string
  emoji?: string
  author: string
  tags: string[]
  mentions: NoteMention[]
  content: NoteBlock[]
  createdAt: Date
  updatedAt: Date
}

export interface NoteMention {
  id: string
  type: 'person' | 'team' | 'task' | 'client' | 'order'
  label: string
}

export interface NoteBlock {
  id: string
  type: 'text' | 'h1' | 'h2' | 'h3' | 'subtitle' | 'table.editable' | BlockType
  content: string | Record<string, any>
  order: number
  formatting?: TextFormatting
}

export interface TextFormatting {
  bold?: boolean
  italic?: boolean
  underline?: boolean
}

export interface BlockPickerOption {
  type: string
  label: string
  icon: string
  category: 'basic' | 'formatting' | 'metrics' | 'charts' | 'tables' | 'widgets'
}

