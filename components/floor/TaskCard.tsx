'use client';

import { motion } from 'framer-motion';
import { Clock, MapPin, AlertTriangle, ChevronRight } from 'lucide-react';
import type { FloorTask } from '@/lib/data/floorTasks';
import { getScheduleStatusColor, getPriorityBadge } from '@/lib/data/floorTasks';

interface TaskCardProps {
  task: FloorTask;
  onClick: () => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
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
    
    if (diffMins < 60) return `${diffMins}m left`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h left`;
    return `${Math.floor(diffMins / 1440)}d left`;
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.995 }}
      className={`w-full text-left bg-white border-l-4 ${statusColors.border} border-t border-r border-b border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-all`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-bold text-base ${statusColors.text}`}>
              {task.title}
            </h3>
            {task.priority !== 'low' && (
              <span className={`${priorityBadge.bg} ${priorityBadge.text} px-2 py-0.5 rounded-full text-xs font-bold`}>
                {priorityBadge.label}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-700 line-clamp-2">
            {task.description}
          </p>
        </div>
        <ChevronRight className={`w-5 h-5 flex-shrink-0 ${statusColors.text}`} />
      </div>

      <div className="flex items-center gap-4 mt-3">
        {/* Time remaining */}
        <div className="flex items-center gap-1.5">
          <Clock className={`w-4 h-4 ${statusColors.text}`} />
          <span className={`text-xs font-bold ${statusColors.text}`}>
            {getTimeRemaining()}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <MapPin className="w-4 h-4 text-slate-600 flex-shrink-0" />
          <span className="text-xs text-slate-600 truncate font-medium">
            {task.location}
          </span>
        </div>

        {/* Schedule status indicator */}
        {(task.scheduleStatus === 'behind' || task.scheduleStatus === 'at-risk') && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-1"
          >
            <AlertTriangle className={`w-4 h-4 ${task.scheduleStatus === 'at-risk' ? 'text-rose-900' : 'text-red-600'}`} />
          </motion.div>
        )}
      </div>

      {/* Progress indicator for stage completion tasks */}
      {task.type === 'stage-completion' && task.stage && (
        <div className="mt-3 pt-3 border-t border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">
              Stage: {task.stage}
            </span>
            <span className="text-xs font-medium text-slate-600">
              ~{task.estimatedDuration}min
            </span>
          </div>
        </div>
      )}
    </motion.button>
  );
}

