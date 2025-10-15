'use client';

import { motion } from 'framer-motion';
import { CheckCircle, QrCode, Clock, Award, TrendingUp } from 'lucide-react';
import type { WorkerMetrics } from '@/lib/data/floorWorkers';

interface MetricsCardProps {
  metrics: WorkerMetrics;
  period: 'today' | 'week' | 'month';
}

export function MetricsCard({ metrics, period }: MetricsCardProps) {
  const metricItems = [
    {
      icon: CheckCircle,
      label: 'Tasks',
      value: metrics.tasksCompleted,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      icon: QrCode,
      label: 'Scans',
      value: metrics.itemsScanned,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      icon: Clock,
      label: 'Hours',
      value: metrics.hoursWorked.toFixed(1),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      icon: Award,
      label: 'Quality',
      value: `${metrics.qualityScore}%`,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      icon: TrendingUp,
      label: 'Efficiency',
      value: `${metrics.efficiencyRating}%`,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200'
    }
  ];

  const getPeriodLabel = () => {
    switch (period) {
      case 'today': return 'Today';
      case 'week': return 'This Week';
      case 'month': return 'This Month';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="grid grid-cols-5 gap-4">
        {metricItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex flex-col items-center"
          >
            <item.icon className="w-5 h-5 text-slate-400 mb-2" strokeWidth={2} />
            <div className="text-2xl font-bold text-slate-900 mb-1">
              {item.value}
            </div>
            <div className="text-xs font-medium text-slate-600 uppercase tracking-wide text-center">
              {item.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

