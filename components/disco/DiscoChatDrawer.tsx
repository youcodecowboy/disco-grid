'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, History } from 'lucide-react';
import { useDiscoChatStore } from '@/lib/disco/store/useDiscoChatStore';
import { DiscoMessage } from './DiscoMessage';
import { DiscoChatInput } from './DiscoChatInput';
import { DiscoActionConfirmation } from './DiscoActionConfirmation';
import { DiscoChatHistorySidebar } from './DiscoChatHistorySidebar';

export function DiscoChatDrawer() {
  const { isOpen, closeDrawer, messages, pendingAction, toggleHistorySidebar, createNewSession } = useDiscoChatStore();

  return (
    <>
      <DiscoChatHistorySidebar />
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">Disco</h2>
                      <p className="text-xs text-blue-100">AI Assistant</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={createNewSession}
                      className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                      aria-label="New chat"
                      title="New Chat"
                    >
                      <Sparkles className="w-5 h-5" />
                    </button>
                    <button
                      onClick={toggleHistorySidebar}
                      className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                      aria-label="Chat history"
                      title="Chat History"
                    >
                      <History className="w-5 h-5" />
                    </button>
                    <button
                      onClick={closeDrawer}
                      className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                      aria-label="Close chat"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {messages.map((message) => (
                  <DiscoMessage key={message.id} message={message} />
                ))}
              </div>

              {/* Action Confirmation */}
              {pendingAction && (
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                  <DiscoActionConfirmation action={pendingAction} />
                </div>
              )}

              {/* Input */}
              <div className="px-6 py-4 border-t border-slate-200 bg-white flex-shrink-0">
                <DiscoChatInput />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

