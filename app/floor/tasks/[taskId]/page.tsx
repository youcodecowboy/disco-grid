'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Clock,
    MapPin, AlertCircle,
    CheckCircle,
    Send,
    FileText,
    ExternalLink
} from 'lucide-react';
import { FloorHeader } from '@/components/floor/FloorHeader';
import { FloorFooter } from '@/components/floor/FloorFooter';
import { QRScannerModal } from '@/components/floor/QRScannerModal';
import { MessagesPanel } from '@/components/floor/MessagesPanel';
import { MenuPanel } from '@/components/floor/MenuPanel';
import { CURRENT_FLOOR_WORKER } from '@/lib/data/floorWorkers';
import { getMessagesByWorker, getUnreadMessageCount } from '@/lib/data/floorMessages';
import { getTaskById, getScheduleStatusColor, getPriorityBadge } from '@/lib/data/floorTasks';

// Mock comments data
const MOCK_COMMENTS = [
  {
    id: 'comment-1',
    author: 'Lauren Medina',
    role: 'Production Manager',
    message: 'Please prioritize this - deadline moved up by 2 days.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    avatar: 'LM'
  },
  {
    id: 'comment-2',
    author: 'James Chen',
    role: 'QC Lead',
    message: 'Make sure to check the fabric alignment on this batch.',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    avatar: 'JC'
  }
];

export default function FloorTaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [scannerOpen, setScannerOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [notes, setNotes] = useState('Check zipper alignment before completing.');

  const worker = CURRENT_FLOOR_WORKER;
  const messages = getMessagesByWorker(worker.id);
  const unreadCount = getUnreadMessageCount(worker.id);
  
  const task = getTaskById(params.taskId as string);

  if (!task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-24">
        <FloorHeader />
        <div className="max-w-4xl mx-auto px-4 py-6">
          <p className="text-slate-600">Task not found</p>
        </div>
      </div>
    );
  }

  const statusColors = getScheduleStatusColor(task.scheduleStatus);
  const priorityBadge = getPriorityBadge(task.priority);

  const getTimeRemaining = () => {
    const now = new Date();
    const due = new Date(task.dueDate);
    const diffMs = due.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 0) {
      const overdue = Math.abs(diffMins);
      if (overdue < 60) return `${overdue}m overdue`;
      return `${Math.floor(overdue / 60)}h overdue`;
    }
    
    if (diffMins < 60) return `${diffMins}m remaining`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h remaining`;
    return `${Math.floor(diffMins / 1440)}d remaining`;
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: `comment-${Date.now()}`,
      author: worker.name,
      role: worker.role,
      message: newComment,
      timestamp: new Date().toISOString(),
      avatar: worker.avatar
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  const handleCompleteTask = () => {
    alert(`Task "${task.title}" marked as complete!\n\nIn a real app, this would:\n- Update task status\n- Record completion time\n- Update worker metrics\n- Trigger notifications`);
    router.push('/floor');
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-24">
      <FloorHeader />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto px-4 py-6 space-y-6"
      >
        {/* Back button */}
        <button
          onClick={() => router.push('/floor')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        {/* Task Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`bg-white border-l-4 ${statusColors.border} border-t border-r border-b border-slate-200 rounded-lg p-6 shadow-sm`}
        >
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-slate-900">
                  {task.title}
                </h1>
                <span className={`${priorityBadge.bg} ${priorityBadge.text} px-3 py-1 rounded-full text-xs font-bold`}>
                  {priorityBadge.label}
                </span>
              </div>
              <p className="text-slate-600 text-sm mb-3">
                {task.description}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <Clock className={`w-4 h-4 ${statusColors.text}`} />
                  <span className={`font-bold ${statusColors.text}`}>
                    {getTimeRemaining()}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-600" />
                  <span className="text-slate-600 font-medium">{task.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Task Meta Info */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200">
            <div>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                Task Type
              </p>
              <p className="text-sm font-medium text-slate-900 capitalize">
                {task.type.replace('-', ' ')}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                Estimated Duration
              </p>
              <p className="text-sm font-medium text-slate-900">
                ~{task.estimatedDuration} minutes
              </p>
            </div>
            {task.stage && (
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                  Workflow Stage
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {task.stage}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                Due Date
              </p>
              <p className="text-sm font-medium text-slate-900">
                {new Date(task.dueDate).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Assigned By */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
        >
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">
            Assigned By
          </h2>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold">
              LM
            </div>
            <div>
              <p className="font-semibold text-slate-900">Lauren Medina</p>
              <p className="text-sm text-slate-600">Production Manager</p>
            </div>
          </div>
        </motion.div>

        {/* Related Item Link */}
        {task.lineItemId && task.itemCodeId && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
          >
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">
              Related Item
            </h2>
            <button
              onClick={() => router.push(`/floor/items/${task.itemCodeId}`)}
              className="flex items-center justify-between w-full p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-900">View Item Details</p>
                  <p className="text-xs text-slate-600">Item Code: {task.itemCodeId}</p>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-slate-400" />
            </button>
          </motion.div>
        )}

        {/* Notes */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
        >
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">
            Notes
          </h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your notes here..."
            rows={3}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none text-slate-900 resize-none"
          />
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-slate-500">
              Notes are saved automatically
            </p>
            <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors text-sm">
              Save Notes
            </button>
          </div>
        </motion.div>

        {/* Comments */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
        >
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">
            Comments ({comments.length})
          </h2>

          {/* Add Comment */}
          <div className="mb-6">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                {worker.avatar}
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={2}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none text-slate-900 resize-none"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>Post Comment</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-center text-slate-500 py-8">No comments yet</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 p-4 bg-slate-50 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                    {comment.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-slate-900">{comment.author}</p>
                      <span className="text-xs text-slate-500">•</span>
                      <p className="text-xs text-slate-600">{comment.role}</p>
                      <span className="text-xs text-slate-500">•</span>
                      <p className="text-xs text-slate-500">{formatTimestamp(comment.timestamp)}</p>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {comment.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-2 gap-3"
        >
          <button
            onClick={() => alert('Report Issue - Coming soon')}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg transition-colors"
          >
            <AlertCircle className="w-5 h-5" />
            <span>Report Issue</span>
          </button>
          <button
            onClick={handleCompleteTask}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Complete Task</span>
          </button>
        </motion.div>
      </motion.main>

      <FloorFooter
        onScanClick={() => setScannerOpen(true)}
        onMessagesClick={() => setMessagesOpen(true)}
        onMenuClick={() => setMenuOpen(true)}
        unreadCount={unreadCount}
      />

      <QRScannerModal isOpen={scannerOpen} onClose={() => setScannerOpen(false)} />
      <MessagesPanel isOpen={messagesOpen} onClose={() => setMessagesOpen(false)} messages={messages} workerId={worker.id} workerName={worker.name} />
      <MenuPanel isOpen={menuOpen} onClose={() => setMenuOpen(false)} worker={worker} />
    </div>
  );
}

