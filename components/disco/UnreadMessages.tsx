'use client';

import { useState } from 'react';
import { MessageSquare, Bell, User, Clock } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: 'urgent' | 'normal' | 'system';
  read: boolean;
}

export function UnreadMessages() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Mission Control',
      content: 'New materials arrived at dock 3. Please scan and verify.',
      timestamp: '2m ago',
      type: 'urgent',
      read: false
    },
    {
      id: '2',
      sender: 'Sarah Chen',
      content: 'Can you check the status of batch #1234?',
      timestamp: '15m ago',
      type: 'normal',
      read: false
    },
    {
      id: '3',
      sender: 'System',
      content: 'Equipment maintenance scheduled for tomorrow 8 AM',
      timestamp: '1h ago',
      type: 'system',
      read: true
    },
    {
      id: '4',
      sender: 'Mike Rodriguez',
      content: 'Great work on the quality check today!',
      timestamp: '2h ago',
      type: 'normal',
      read: true
    }
  ]);

  const unreadCount = messages.filter(msg => !msg.read).length;

  const markAsRead = (id: string) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, read: true } : msg
    ));
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'border-l-red-500 bg-red-50';
      case 'system': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-300 bg-white';
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'urgent': return <Bell size={16} className="text-red-600" />;
      case 'system': return <MessageSquare size={16} className="text-blue-600" />;
      default: return <User size={16} className="text-gray-600" />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
        {unreadCount > 0 && (
          <div className="flex items-center space-x-1">
            <Bell size={16} className="text-red-600" />
            <span className="text-sm font-medium text-red-600">{unreadCount}</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3">
        {messages.slice(0, 3).map((message) => (
          <div
            key={message.id}
            className={`p-3 rounded-lg border-l-4 transition-all cursor-pointer ${
              message.read ? 'opacity-75' : ''
            } ${getMessageTypeColor(message.type)}`}
            onClick={() => markAsRead(message.id)}
          >
            <div className="flex items-start space-x-2">
              <div className="mt-0.5">
                {getMessageTypeIcon(message.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {message.sender}
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Clock size={12} />
                    <span>{message.timestamp}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 line-clamp-2">
                  {message.content}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {messages.length > 3 && (
          <div className="text-center">
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all messages ({messages.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
