'use client';

import { format } from 'date-fns';
import { X, Trash2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDiscoChatStore } from '@/lib/disco/store/useDiscoChatStore';
import { Button } from '@/components/ui/button';

export function DiscoChatHistorySidebar() {
  const {
    showHistorySidebar,
    toggleHistorySidebar,
    sessions,
    currentSessionId,
    loadSession,
    deleteSession,
    createNewSession,
  } = useDiscoChatStore();

  return (
    <AnimatePresence>
      {showHistorySidebar && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleHistorySidebar}
            className="fixed inset-0 bg-black/20 z-45"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 shadow-xl z-50 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-4 flex items-center justify-between">
              <h3 className="font-semibold text-sm">Chat History</h3>
              <button
                onClick={toggleHistorySidebar}
                className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-1.5 transition-colors"
                aria-label="Close history"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* New Chat Button */}
            <div className="px-4 py-3 border-b border-slate-200">
              <Button
                onClick={() => {
                  createNewSession();
                  toggleHistorySidebar();
                }}
                size="sm"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Chat
              </Button>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto py-2">
              {sessions.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-slate-500">
                  No chat history
                </div>
              ) : (
                <div className="space-y-1 px-2">
                  {sessions
                    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
                    .map((session) => (
                      <div
                        key={session.id}
                        className={`group relative rounded-lg p-3 cursor-pointer transition-colors ${
                          session.id === currentSessionId
                            ? 'bg-blue-50 border border-blue-200'
                            : 'hover:bg-slate-50 border border-transparent'
                        }`}
                        onClick={() => {
                          loadSession(session.id);
                          toggleHistorySidebar();
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">
                              {session.title}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {format(session.updatedAt, 'MMM d, h:mm a')}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Delete "${session.title}"?`)) {
                                deleteSession(session.id);
                              }
                            }}
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 p-1 rounded transition-opacity"
                            aria-label="Delete chat"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

