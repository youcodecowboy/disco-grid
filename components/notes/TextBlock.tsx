'use client'

import { useEffect, useRef, useState } from 'react'

interface TextBlockProps {
  value: string
  onChange: (value: string) => void
  onEnter: () => void
  onBackspace: () => void
  onTab: () => void
  onSlash: () => void
  blockType?: 'text' | 'h1' | 'h2' | 'h3' | 'subtitle'
  placeholder?: string
  autoFocus?: boolean
}

export default function TextBlock({
  value,
  onChange,
  onEnter,
  onBackspace,
  onTab,
  onSlash,
  blockType = 'text',
  placeholder = 'Type / for commands',
  autoFocus = false,
}: TextBlockProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [lastValue, setLastValue] = useState(value)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = textarea.scrollHeight + 'px'
    }
  }, [value])

  // Auto-focus if requested
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [autoFocus])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter key - create new block
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onEnter()
    }

    // Backspace on empty block - remove it
    if (e.key === 'Backspace' && value === '') {
      e.preventDefault()
      onBackspace()
    }

    // Tab key - open block picker
    if (e.key === 'Tab') {
      e.preventDefault()
      onTab()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    onChange(newValue)

    // Check if user typed '/'
    if (newValue.endsWith('/') && lastValue.length < newValue.length) {
      onSlash()
    }

    setLastValue(newValue)
  }

  const baseClasses = "w-full text-slate-900 placeholder-slate-300 bg-transparent border-none outline-none resize-none py-2"
  
  const typeClasses = {
    text: "text-base",
    h1: "text-4xl font-bold",
    h2: "text-3xl font-bold",
    h3: "text-2xl font-semibold",
    subtitle: "text-lg text-slate-600 italic",
  }

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className={`${baseClasses} ${typeClasses[blockType]}`}
      rows={1}
    />
  )
}

