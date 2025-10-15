'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { FloorTask } from '@/lib/data/floorTasks';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  activeTasks: FloorTask[];
  upcomingTasks: FloorTask[];
  completedTasks: FloorTask[];
  onTaskClick: (task: FloorTask) => void;
}

export function TaskList({ activeTasks, upcomingTasks, completedTasks, onTaskClick }: TaskListProps) {
  const [showCompleted, setShowCompleted] = useState(false);
  const [showUpcoming, setShowUpcoming] = useState(true);

  return (
    <div className="space-y-4">
      {/* Active Tasks */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide px-1 mb-3">
          Active Tasks ({activeTasks.length})
        </h3>
        
        {activeTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center"
          >
            <p className="text-slate-600 font-medium">No active tasks</p>
            <p className="text-sm text-slate-500 mt-1">Great job! Check back later for new assignments.</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {activeTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <TaskCard task={task} onClick={() => onTaskClick(task)} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Tasks - Collapsible */}
      {upcomingTasks.length > 0 && (
        <div className="pt-4 border-t border-slate-200">
          <button
            onClick={() => setShowUpcoming(!showUpcoming)}
            className="w-full flex items-center justify-between px-1 py-2 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
              Upcoming ({upcomingTasks.length})
            </h3>
            <motion.div
              animate={{ rotate: showUpcoming ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 text-slate-700" />
            </motion.div>
          </button>

          <AnimatePresence>
            {showUpcoming && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-3 mt-3">
                  {upcomingTasks.map((task, index) => {
                    const scheduledDate = task.scheduledFor ? new Date(task.scheduledFor) : null;
                    const timeUntil = scheduledDate ? scheduledDate.getTime() - new Date().getTime() : 0;
                    const hoursUntil = Math.floor(timeUntil / (1000 * 60 * 60));
                    
                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="relative"
                      >
                        <div className="absolute -left-1 top-0 bottom-0 w-1 bg-blue-300 rounded-full" />
                        <div className="pl-3">
                          <TaskCard task={task} onClick={() => onTaskClick(task)} />
                          <div className="mt-2 ml-4 text-xs font-semibold text-blue-600">
                            📅 Scheduled for {hoursUntil < 24 ? `${hoursUntil}h from now` : `${Math.floor(hoursUntil / 24)}d from now`}
                          </div>
                          {task.blockedBy && task.blockedBy.length > 0 && (
                            <div className="mt-1 ml-4 text-xs text-slate-600">
                              ⏳ Waiting on {task.blockedBy.length} other {task.blockedBy.length === 1 ? 'task' : 'tasks'}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Completed Tasks - Collapsible */}
      {completedTasks.length > 0 && (
        <div className="pt-4 border-t border-slate-200">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="w-full flex items-center justify-between px-1 py-2 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
              Completed Today ({completedTasks.length})
            </h3>
            <motion.div
              animate={{ rotate: showCompleted ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 text-slate-700" />
            </motion.div>
          </button>

          <AnimatePresence>
            {showCompleted && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-3 mt-3">
                  {completedTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="opacity-75"
                    >
                      <TaskCard task={task} onClick={() => onTaskClick(task)} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

