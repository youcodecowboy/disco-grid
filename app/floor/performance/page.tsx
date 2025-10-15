'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, CheckCircle, QrCode, Clock, Award, Target } from 'lucide-react';
import { FloorHeader } from '@/components/floor/FloorHeader';
import { FloorFooter } from '@/components/floor/FloorFooter';
import { QRScannerModal } from '@/components/floor/QRScannerModal';
import { MessagesPanel } from '@/components/floor/MessagesPanel';
import { MenuPanel } from '@/components/floor/MenuPanel';
import { CURRENT_FLOOR_WORKER } from '@/lib/data/floorWorkers';
import { getMessagesByWorker, getUnreadMessageCount } from '@/lib/data/floorMessages';
import { getActiveTasksByWorker, getCompletedTasksByWorker } from '@/lib/data/floorTasks';

type Period = 'today' | 'week' | 'month';

export default function FloorPerformancePage() {
  const router = useRouter();
  const [period, setPeriod] = useState<Period>('week');
  const [scannerOpen, setScannerOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const worker = CURRENT_FLOOR_WORKER;
  const messages = getMessagesByWorker(worker.id);
  const unreadCount = getUnreadMessageCount(worker.id);
  const activeTasks = getActiveTasksByWorker(worker.id);
  const completedTasks = getCompletedTasksByWorker(worker.id);

  const metrics = {
    today: worker.todayMetrics,
    week: worker.weekMetrics,
    month: worker.monthMetrics
  };

  const currentMetrics = metrics[period];

  // Calculate trends (mock data for demo)
  const trends = {
    tasksCompleted: 12,
    itemsScanned: 8,
    qualityScore: 2,
    efficiencyRating: 3
  };

  // Performance goals (mock)
  const goals = {
    tasksCompleted: 250,
    itemsScanned: 700,
    qualityScore: 95,
    efficiencyRating: 92
  };

  const calculateProgress = (current: number, goal: number) => {
    return Math.min(100, Math.round((current / goal) * 100));
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

        {/* Header */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Performance</h1>
          <p className="text-sm text-slate-600">
            Track your progress and see how you're doing
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1">
          {(['today', 'week', 'month'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 px-4 py-2 rounded-md font-semibold text-sm transition-all ${
                period === p
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {p === 'today' ? 'Today' : p === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Tasks Completed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Tasks Completed</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-slate-900">{currentMetrics.tasksCompleted}</p>
                  {period === 'month' && trends.tasksCompleted > 0 && (
                    <span className="flex items-center gap-1 text-sm font-semibold text-green-600">
                      <TrendingUp className="w-4 h-4" />
                      +{trends.tasksCompleted}%
                    </span>
                  )}
                </div>
              </div>
            </div>
            {period === 'month' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Monthly Goal</span>
                  <span className="font-bold text-slate-900">
                    {currentMetrics.tasksCompleted} / {goals.tasksCompleted}
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${calculateProgress(currentMetrics.tasksCompleted, goals.tasksCompleted)}%` }}
                  />
                </div>
              </div>
            )}
          </motion.div>

          {/* Items Scanned */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <QrCode className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Items Scanned</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-slate-900">{currentMetrics.itemsScanned}</p>
                  {period === 'month' && trends.itemsScanned > 0 && (
                    <span className="flex items-center gap-1 text-sm font-semibold text-green-600">
                      <TrendingUp className="w-4 h-4" />
                      +{trends.itemsScanned}%
                    </span>
                  )}
                </div>
              </div>
            </div>
            {period === 'month' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Monthly Goal</span>
                  <span className="font-bold text-slate-900">
                    {currentMetrics.itemsScanned} / {goals.itemsScanned}
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${calculateProgress(currentMetrics.itemsScanned, goals.itemsScanned)}%` }}
                  />
                </div>
              </div>
            )}
          </motion.div>

          {/* Quality Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Quality Score</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-slate-900">{currentMetrics.qualityScore}%</p>
                  {period === 'month' && trends.qualityScore > 0 && (
                    <span className="flex items-center gap-1 text-sm font-semibold text-green-600">
                      <TrendingUp className="w-4 h-4" />
                      +{trends.qualityScore}%
                    </span>
                  )}
                </div>
              </div>
            </div>
            {period === 'month' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Target</span>
                  <span className="font-bold text-slate-900">{goals.qualityScore}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all"
                    style={{ width: `${calculateProgress(currentMetrics.qualityScore, goals.qualityScore)}%` }}
                  />
                </div>
              </div>
            )}
          </motion.div>

          {/* Efficiency Rating */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Efficiency</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-slate-900">{currentMetrics.efficiencyRating}%</p>
                  {period === 'month' && trends.efficiencyRating > 0 && (
                    <span className="flex items-center gap-1 text-sm font-semibold text-green-600">
                      <TrendingUp className="w-4 h-4" />
                      +{trends.efficiencyRating}%
                    </span>
                  )}
                </div>
              </div>
            </div>
            {period === 'month' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Target</span>
                  <span className="font-bold text-slate-900">{goals.efficiencyRating}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full transition-all"
                    style={{ width: `${calculateProgress(currentMetrics.efficiencyRating, goals.efficiencyRating)}%` }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Hours Worked */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-teal-50 rounded-lg">
              <Clock className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Hours Worked</p>
              <p className="text-3xl font-bold text-slate-900">{currentMetrics.hoursWorked.toFixed(1)}h</p>
            </div>
          </div>
        </motion.div>

        {/* Current Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
        >
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">Current Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-medium text-slate-700">Active Tasks</span>
              <span className="text-lg font-bold text-blue-600">{activeTasks.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-medium text-slate-700">Completed Today</span>
              <span className="text-lg font-bold text-green-600">{completedTasks.length}</span>
            </div>
          </div>
        </motion.div>

        {/* Performance Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
        >
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">Insights</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-900 text-sm">Great Quality Performance</p>
                <p className="text-xs text-green-700 mt-1">
                  Your quality score is above target. Keep up the excellent work!
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Target className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-blue-900 text-sm">On Track This Month</p>
                <p className="text-xs text-blue-700 mt-1">
                  You're on pace to meet all your monthly goals. Stay focused!
                </p>
              </div>
            </div>
          </div>
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

