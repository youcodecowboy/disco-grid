import React from 'react'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  timestamp: string
  read: boolean
  priority: 'low' | 'medium' | 'high'
}

interface NotificationsPanelProps {
  title?: string
  data?: {
    notifications: Notification[]
    unreadCount: number
  }
}

export default function NotificationsPanel({ 
  title = "Notifications", 
  data 
}: NotificationsPanelProps) {
  const defaultData = {
    notifications: [
      {
        id: '1',
        title: 'Team Meeting',
        message: 'Weekly team sync in 15 minutes',
        type: 'info' as const,
        timestamp: '2 min ago',
        read: false,
        priority: 'medium' as const
      },
      {
        id: '2',
        title: 'Project Deadline',
        message: 'Q1 deliverables due tomorrow',
        type: 'warning' as const,
        timestamp: '1 hour ago',
        read: false,
        priority: 'high' as const
      },
      {
        id: '3',
        title: 'New Team Member',
        message: 'Sarah Johnson joined Engineering team',
        type: 'success' as const,
        timestamp: '3 hours ago',
        read: true,
        priority: 'low' as const
      },
      {
        id: '4',
        title: 'System Alert',
        message: 'Database maintenance scheduled',
        type: 'info' as const,
        timestamp: '1 day ago',
        read: true,
        priority: 'low' as const
      }
    ],
    unreadCount: 2
  }

  const notificationsData = data || defaultData

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return '🔴'
      case 'medium':
        return '🟡'
      default:
        return '🟢'
    }
  }

  return (
    <div className="h-full flex flex-col p-3 sm:p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm font-semibold text-gray-900 truncate flex-1 min-w-0 mr-2">
          {title}
        </h3>
        {notificationsData.unreadCount > 0 && (
          <div className="bg-red-500 text-white text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex-shrink-0">
            {notificationsData.unreadCount}
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="flex-1 space-y-2 sm:space-y-3 overflow-y-auto">
        {notificationsData.notifications.map((notification) => (
          <div 
            key={notification.id}
            className={`p-2 sm:p-3 rounded-lg border ${getTypeStyles(notification.type)} ${
              !notification.read ? 'ring-2 ring-blue-200' : ''
            }`}
          >
            {/* Notification Header */}
            <div className="flex items-start justify-between mb-1 sm:mb-2">
              <div className="flex items-center space-x-1 sm:space-x-2 flex-1 min-w-0">
                <span className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm font-medium truncate">
                  {notification.title}
                </span>
                <span className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs flex-shrink-0">
                  {getPriorityIcon(notification.priority)}
                </span>
              </div>
              <span className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs opacity-75 flex-shrink-0">
                {notification.timestamp}
              </span>
            </div>

            {/* Notification Message */}
            <p className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs leading-relaxed">
              {notification.message}
            </p>

            {/* Read Status */}
            {!notification.read && (
              <div className="mt-1 sm:mt-2 flex items-center">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full"></div>
                <span className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs ml-1 sm:ml-2 font-medium">
                  Unread
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs text-gray-600">
            {notificationsData.notifications.length} total
          </span>
          <button className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs text-blue-600 hover:text-blue-700 font-medium">
            View All
          </button>
        </div>
      </div>
    </div>
  )
}

