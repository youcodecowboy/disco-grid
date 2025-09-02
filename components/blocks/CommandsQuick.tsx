"use client"

import type { Block } from "@/app/page"

interface Props {
  block: Block
}

export default function CommandsQuick({ block }: Props) {
  const commands = block.props?.commands || []

  const handleCommand = (command: string) => {
    // Simple toast notification
    const toast = document.createElement("div")
    toast.className = "fixed top-4 right-4 bg-black text-white px-4 py-2 rounded-md text-sm z-50 transition-opacity"
    toast.textContent = `${command} (stub)`
    document.body.appendChild(toast)

    setTimeout(() => {
      toast.style.opacity = "0"
      setTimeout(() => document.body.removeChild(toast), 300)
    }, 2000)
  }

  return (
    <div className="p-4 grid grid-cols-2 gap-2">
      {commands.map((command: string, i: number) => (
        <button
          key={i}
          onClick={() => handleCommand(command)}
          className="px-3 py-2 text-xs bg-muted hover:bg-muted/80 rounded-md transition-colors text-left"
        >
          {command}
        </button>
      ))}
    </div>
  )
}
