'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, MailOpen, Plus, Send } from 'lucide-react';
import type { FloorMessage } from '@/lib/data/floorMessages';
import { getPriorityColor, getMessageTypeIcon, getSentMessagesByWorker } from '@/lib/data/floorMessages';
import { MessageComposeModal } from './MessageComposeModal';

interface MessagesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: FloorMessage[];
  workerId: string;
  workerName: string;
}

export function MessagesPanel({ isOpen, onClose, messages, workerId, workerName }: MessagesPanelProps) {
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');
  const [composeOpen, setComposeOpen] = useState(false);
  const sentMessages = getSentMessagesByWorker(workerId);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    if (diffMins < 10080) return `${Math.floor(diffMins / 1440)}d ago`;
    return date.toLocaleDateString();
  };

  const handleSendMessage = (to: string, subject: string, message: string, priority: 'low' | 'normal' | 'high') => {
    // In real app, this would send to backend
    alert(`Message sent to ${to}!\n\nSubject: ${subject}\n\nThis would be saved to your Sent folder.`);
  };

  const displayMessages = activeTab === 'inbox' ? messages : sentMessages;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Messages</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setComposeOpen(true)}
                    className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg p-2 transition-colors"
                    title="Compose"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <button
                    onClick={onClose}
                    className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg p-1.5 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('inbox')}
                  className={`flex-1 px-4 py-2 rounded-md font-semibold text-sm transition-all ${
                    activeTab === 'inbox'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Inbox ({messages.length})
                </button>
                <button
                  onClick={() => setActiveTab('sent')}
                  className={`flex-1 px-4 py-2 rounded-md font-semibold text-sm transition-all ${
                    activeTab === 'sent'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sent ({sentMessages.length})
                </button>
              </div>
            </div>

            {/* Messages list */}
            <div className="flex-1 overflow-y-auto">
              {displayMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  {activeTab === 'inbox' ? <Mail className="w-16 h-16 text-slate-300 mb-4" /> : <Send className="w-16 h-16 text-slate-300 mb-4" />}
                  <p className="text-slate-600 font-medium">No {activeTab === 'inbox' ? 'messages' : 'sent messages'}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    {activeTab === 'inbox' ? "You're all caught up!" : "Send your first message!"}
                  </p>
                  {activeTab === 'sent' && (
                    <button
                      onClick={() => setComposeOpen(true)}
                      className="mt-4 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors"
                    >
                      Compose Message
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {displayMessages.map((message) => {
                    const colors = getPriorityColor(message.priority);
                    const isSent = activeTab === 'sent';
                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`${message.read && !isSent ? 'bg-slate-50' : colors.bg} border ${colors.border} rounded-lg p-4 shadow-sm`}
                      >
                        <div className="flex items-start gap-3 mb-2">
                          <div className="flex-shrink-0 text-2xl mt-0.5">
                            {isSent ? <Send className="w-5 h-5 text-blue-600" /> : getMessageTypeIcon(message.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {!message.read && !isSent && (
                                <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                              )}
                              <h3 className={`font-bold text-sm ${colors.text} flex-1`}>
                                {message.subject}
                              </h3>
                            </div>
                            <p className="text-xs text-slate-600 mb-1">
                              {isSent ? `To: ${message.to || 'Management'}` : `${message.from} • ${message.fromRole}`}
                            </p>
                          </div>
                          {isSent ? (
                            <Send className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          ) : message.read ? (
                            <MailOpen className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          ) : (
                            <Mail className={`w-4 h-4 ${colors.text} flex-shrink-0`} />
                          )}
                        </div>
                        
                        <p className="text-sm text-slate-700 leading-relaxed mb-2">
                          {message.message}
                        </p>
                        
                        <div className="text-xs text-slate-500 font-medium">
                          {formatTimestamp(message.timestamp)}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
            
          </motion.div>

          {/* Compose Modal */}
          <MessageComposeModal
            isOpen={composeOpen}
            onClose={() => setComposeOpen(false)}
            onSend={handleSendMessage}
            workerName={workerName}
          />
        </>
      )}
    </AnimatePresence>
  );
}


