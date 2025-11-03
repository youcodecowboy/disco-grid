'use client';

import { format } from 'date-fns';
import { User, Bot, Loader2 } from 'lucide-react';
import type { DiscoMessage as DiscoMessageType } from '@/lib/disco/types';

interface DiscoMessageProps {
  message: DiscoMessageType;
}

export function DiscoMessage({ message }: DiscoMessageProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';
  const isAction = message.type === 'action';

  if (message.isLoading) {
    return (
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-blue-600" />
        </div>
        <div className="flex-1">
          <div className="bg-slate-100 rounded-lg px-4 py-3 inline-block">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
              <span className="text-sm text-slate-500">Disco is thinking...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSystem) {
    return (
      <div className="flex items-center justify-center my-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 max-w-sm">
          <p className="text-sm text-blue-900 text-center">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? 'bg-blue-600' : 'bg-slate-100'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-slate-600" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 ${isUser ? 'flex flex-col items-end' : ''}`}>
        <div
          className={`rounded-lg px-4 py-3 max-w-[80%] ${
            isUser
              ? 'bg-blue-600 text-white'
              : isAction
              ? 'bg-amber-50 border border-amber-200 text-amber-900'
              : 'bg-slate-100 text-slate-900'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          
          {isAction && message.action && (
            <div className="mt-2 pt-2 border-t border-amber-300">
              <p className="text-xs font-semibold text-amber-800">
                Action: {message.action.replace('_', ' ')}
              </p>
            </div>
          )}
        </div>
        
        {/* Timestamp */}
        <span className="text-xs text-slate-500 mt-1 px-1">
          {format(message.timestamp, 'HH:mm')}
        </span>
      </div>
    </div>
  );
}

