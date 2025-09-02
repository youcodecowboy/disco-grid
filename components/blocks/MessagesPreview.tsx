import type { Block } from "@/app/page"

interface Message {
  id: number
  sender: string
  subject: string
  preview: string
  time: string
  unread: boolean
}

interface Props {
  block: Block
}

export default function MessagesPreview({ block }: Props) {
  const messages = block.props?.messages || []

  return (
    <div className="divide-y max-h-64 overflow-y-auto">
      {messages.map((message: Message) => (
        <div
          key={message.id}
          className={`p-3 hover:bg-muted/50 cursor-pointer ${message.unread ? "bg-blue-50/50" : ""}`}
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium flex-shrink-0">
              {message.sender
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className={`text-xs truncate ${message.unread ? "font-medium" : ""}`}>{message.sender}</div>
                <div className="text-xs text-muted-foreground">{message.time}</div>
              </div>
              <div className={`text-xs truncate ${message.unread ? "font-medium" : ""}`}>{message.subject}</div>
              <div className="text-xs text-muted-foreground truncate">{message.preview}</div>
            </div>
            {message.unread && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />}
          </div>
        </div>
      ))}
    </div>
  )
}
