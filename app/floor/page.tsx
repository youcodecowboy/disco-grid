'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { FloorHeader } from '@/components/floor/FloorHeader';
import { FloorFooter } from '@/components/floor/FloorFooter';
import { MetricsCard } from '@/components/floor/MetricsCard';
import { TaskList } from '@/components/floor/TaskList';
import { QRScannerModal } from '@/components/floor/QRScannerModal';
import { MessagesPanel } from '@/components/floor/MessagesPanel';
import { MenuPanel } from '@/components/floor/MenuPanel';
import { CURRENT_FLOOR_WORKER } from '@/lib/data/floorWorkers';
import { getActiveTasksByWorker, getUpcomingTasksByWorker, getCompletedTasksByWorker } from '@/lib/data/floorTasks';
import { getMessagesByWorker, getUnreadMessageCount } from '@/lib/data/floorMessages';
import { useRouter } from 'next/navigation';

type MetricsPeriod = 'today' | 'week' | 'month';

export default function FloorPage() {
  const router = useRouter();
  const [metricsPeriod, setMetricsPeriod] = useState<MetricsPeriod>('today');
  const [scannerOpen, setScannerOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const worker = CURRENT_FLOOR_WORKER;
  const activeTasks = getActiveTasksByWorker(worker.id);
  const upcomingTasks = getUpcomingTasksByWorker(worker.id);
  const completedTasks = getCompletedTasksByWorker(worker.id);
  const messages = getMessagesByWorker(worker.id);
  const unreadCount = getUnreadMessageCount(worker.id);

  const metrics = {
    today: worker.todayMetrics,
    week: worker.weekMetrics,
    month: worker.monthMetrics
  };

  const handleTaskClick = (task: any) => {
    // Navigate to task detail page
    router.push(`/floor/tasks/${task.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-24">
      {/* Header */}
      <FloorHeader />

      {/* Main Content */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto px-4 py-6 space-y-6"
      >
        {/* Metrics Period Selector */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Performance</h2>
          <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1">
            {(['today', 'week', 'month'] as MetricsPeriod[]).map((period) => (
              <button
                key={period}
                onClick={() => setMetricsPeriod(period)}
                className={`px-3 py-1.5 rounded-md font-semibold text-xs transition-all ${
                  metricsPeriod === period
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {period === 'today' ? 'Today' : period === 'week' ? '7d' : '30d'}
              </button>
            ))}
          </div>
        </div>

        {/* Metrics Cards */}
        <MetricsCard metrics={metrics[metricsPeriod]} period={metricsPeriod} />

        {/* Task List */}
        <TaskList
          activeTasks={activeTasks}
          upcomingTasks={upcomingTasks}
          completedTasks={completedTasks}
          onTaskClick={handleTaskClick}
        />

        {/* Quick Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
        >
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setScannerOpen(true)}
              className="flex flex-col items-center justify-center gap-2 px-4 py-4 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <span className="text-sm font-medium text-slate-900">Scan Item</span>
            </button>
            <button
              onClick={() => router.push('/floor/calendar')}
              className="flex flex-col items-center justify-center gap-2 px-4 py-4 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Calendar className="w-5 h-5 text-slate-600" />
              <span className="text-sm font-medium text-slate-900">Calendar</span>
            </button>
            <button
              onClick={() => alert('Report Issue - Coming soon')}
              className="flex flex-col items-center justify-center gap-2 px-4 py-4 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <span className="text-sm font-medium text-slate-900">Report Issue</span>
            </button>
          </div>
        </motion.div>
      </motion.main>

      {/* Footer */}
      <FloorFooter
        onScanClick={() => setScannerOpen(true)}
        onMessagesClick={() => setMessagesOpen(true)}
        onMenuClick={() => setMenuOpen(true)}
        unreadCount={unreadCount}
      />

      {/* Modals/Panels */}
      <QRScannerModal isOpen={scannerOpen} onClose={() => setScannerOpen(false)} />
      <MessagesPanel isOpen={messagesOpen} onClose={() => setMessagesOpen(false)} messages={messages} workerId={worker.id} workerName={worker.name} />
      <MenuPanel isOpen={menuOpen} onClose={() => setMenuOpen(false)} worker={worker} />
    </div>
  );
}

