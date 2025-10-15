'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, AlertCircle } from 'lucide-react';

interface MessageComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (to: string, subject: string, message: string, priority: 'low' | 'normal' | 'high') => void;
  workerName: string;
}

export function MessageComposeModal({ isOpen, onClose, onSend, workerName }: MessageComposeModalProps) {
  const [to, setTo] = useState('Management');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high'>('normal');

  const handleSend = () => {
    if (!subject.trim() || !message.trim()) {
      alert('Please fill in both subject and message');
      return;
    }

    onSend(to, subject, message, priority);
    
    // Reset form
    setSubject('');
    setMessage('');
    setPriority('normal');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-w-2xl w-full mx-0 sm:mx-4 max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
              <h2 className="text-lg font-bold text-slate-900">New Message</h2>
              <button
                onClick={onClose}
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg p-1.5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* To field */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  To
                </label>
                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none text-slate-900 font-medium"
                >
                  <option value="Management">Management</option>
                  <option value="Production Manager">Production Manager</option>
                  <option value="QC Lead">QC Lead</option>
                  <option value="Operations Team">Operations Team</option>
                  <option value="Safety Department">Safety Department</option>
                  <option value="HR Department">HR Department</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Priority
                </label>
                <div className="flex gap-2 bg-slate-100 rounded-lg p-1">
                  {(['low', 'normal', 'high'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`flex-1 px-4 py-2 rounded-md font-semibold text-sm transition-all ${
                        priority === p
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="What's this about?"
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none text-slate-900"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none text-slate-900 resize-none"
                />
              </div>

              {/* Help text */}
              <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <AlertCircle className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600">
                  Messages are sent to management and will be reviewed promptly. For emergencies, use the emergency contact system.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 p-4 flex gap-3 flex-shrink-0">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

