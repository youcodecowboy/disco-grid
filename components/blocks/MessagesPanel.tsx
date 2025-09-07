import React from 'react'

interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
  avatar?: string
  status: 'sent' | 'delivered' | 'read'
  type: 'text' | 'file' | 'image'
}

interface Conversation {
  id: string
  title: string
  participants: string[]
  lastMessage: Message
  unreadCount: number
  isActive: boolean
}

interface MessagesPanelProps {
  title?: string
  data?: {
    conversations: Conversation[]
    activeConversation?: Conversation
  }
}

export default function MessagesPanel({ 
  title = "Messages", 
  data 
}: MessagesPanelProps) {
  const defaultData = {
    conversations: [
      {
        id: '1',
        title: 'Engineering Team',
        participants: ['John', 'Sarah', 'Mike', 'Lisa'],
        lastMessage: {
          id: 'msg1',
          sender: 'John Smith',
          content: 'Updated the API documentation',
          timestamp: '2 min ago',
          status: 'read' as const,
          type: 'text' as const
        },
        unreadCount: 0,
        isActive: true
      },
      {
        id: '2',
        title: 'Design Team',
        participants: ['Sarah', 'David', 'Emma'],
        lastMessage: {
          id: 'msg2',
          sender: 'Sarah Johnson',
          content: 'New mockups are ready for review',
          timestamp: '15 min ago',
          status: 'delivered' as const,
          type: 'file' as const
        },
        unreadCount: 2,
        isActive: false
      },
      {
        id: '3',
        title: 'Product Planning',
        participants: ['Mike', 'Maria', 'Alex'],
        lastMessage: {
          id: 'msg3',
          sender: 'Mike Wilson',
          content: 'Q2 roadmap meeting tomorrow',
          timestamp: '1 hour ago',
          status: 'read' as const,
          type: 'text' as const
        },
        unreadCount: 0,
        isActive: false
      },
      {
        id: '4',
        title: 'DevOps Alerts',
        participants: ['Alex', 'John'],
        lastMessage: {
          id: 'msg4',
          sender: 'Alex Chen',
          content: 'Deployment completed successfully',
          timestamp: '2 hours ago',
          status: 'read' as const,
          type: 'text' as const
        },
        unreadCount: 0,
        isActive: false
      }
    ]
  }

  const messagesData = data || defaultData

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'read':
        return '✓✓'
      case 'delivered':
        return '✓'
      default:
        return '○'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'file':
        return '📎'
      case 'image':
        return '🖼️'
      default:
        return ''
    }
  }

  return (
    <div className="h-full flex flex-col p-3 sm:p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm font-semibold text-gray-900 truncate flex-1 min-w-0 mr-2">
          {title}
        </h3>
        <button className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs text-blue-600 hover:text-blue-700 font-medium flex-shrink-0">
          New Chat
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 space-y-2 sm:space-y-3 overflow-y-auto">
        {messagesData.conversations.map((conversation) => (
          <div 
            key={conversation.id}
            className={`p-2 sm:p-3 rounded-lg border cursor-pointer transition-colors ${
              conversation.isActive 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            {/* Conversation Header */}
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <div className="flex items-center space-x-1 sm:space-x-2 flex-1 min-w-0">
                <span className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm font-medium truncate">
                  {conversation.title}
                </span>
                {conversation.unreadCount > 0 && (
                  <div className="bg-red-500 text-white text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex-shrink-0">
                    {conversation.unreadCount}
                  </div>
                )}
              </div>
              <span className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs text-gray-500 flex-shrink-0">
                {conversation.lastMessage.timestamp}
              </span>
            </div>

            {/* Last Message */}
            <div className="flex items-start space-x-2">
              {/* Avatar Placeholder */}
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-300 rounded-full flex-shrink-0 mt-0.5"></div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
                  <span className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs font-medium text-gray-700 truncate">
                    {conversation.lastMessage.sender}
                  </span>
                  <span className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs text-gray-400">
                    {getStatusIcon(conversation.lastMessage.status)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <span className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs text-gray-600 truncate">
                    {conversation.lastMessage.content}
                  </span>
                  {getTypeIcon(conversation.lastMessage.type) && (
                    <span className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs flex-shrink-0">
                      {getTypeIcon(conversation.lastMessage.type)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Participants */}
            <div className="mt-1 sm:mt-2 flex items-center">
              <span className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs text-gray-500">
                {conversation.participants.length} participants
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs text-gray-600">
            {messagesData.conversations.length} conversations
          </span>
          <button className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs text-blue-600 hover:text-blue-700 font-medium">
            View All
          </button>
        </div>
      </div>
    </div>
  )
}

