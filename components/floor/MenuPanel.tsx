'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Clock, Award, Settings, LogOut, HelpCircle, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { FloorWorker } from '@/lib/data/floorWorkers';
import { calculateShiftDuration } from '@/lib/data/floorWorkers';

interface MenuPanelProps {
  isOpen: boolean;
  onClose: () => void;
  worker: FloorWorker;
}

export function MenuPanel({ isOpen, onClose, worker }: MenuPanelProps) {
  const router = useRouter();
  const shiftDuration = calculateShiftDuration(worker.shiftStart);

  const menuItems = [
    {
      icon: User,
      label: 'Profile',
      action: () => alert('Profile - Coming soon')
    },
    {
      icon: Calendar,
      label: 'Calendar',
      action: () => {
        router.push('/floor/calendar');
        onClose();
      }
    },
    {
      icon: Clock,
      label: 'Time & Attendance',
      action: () => alert('Time & Attendance - Coming soon')
    },
    {
      icon: Award,
      label: 'Performance',
      action: () => {
        router.push('/floor/performance');
        onClose();
      }
    },
    {
      icon: Settings,
      label: 'Settings',
      action: () => alert('Settings - Coming soon')
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      action: () => alert('Help - Coming soon')
    }
  ];

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
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header with worker info */}
            <div className="bg-white border-b border-slate-200 px-6 py-6 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Menu</h2>
                <button
                  onClick={onClose}
                  className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg p-1.5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Worker card */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {worker.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">{worker.name}</h3>
                    <p className="text-sm text-slate-600">{worker.role}</p>
                    <p className="text-xs text-slate-500">{worker.team}</p>
                  </div>
                </div>

                {/* Shift info */}
                <div className="flex items-center justify-between text-sm pt-3 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-700 font-medium">On shift</span>
                  </div>
                  <span className="text-slate-900 font-semibold">
                    {shiftDuration.hours}h {shiftDuration.minutes}m
                  </span>
                </div>
              </div>
            </div>

            {/* Menu items */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition-colors text-left"
                  >
                    <item.icon className="w-5 h-5 text-slate-600" />
                    <span className="font-medium text-slate-900">{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Current location */}
              <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-xs uppercase font-bold text-slate-600 mb-1">
                  Current Location
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {worker.currentLocation}
                </p>
              </div>
            </div>

            {/* Logout button */}
            <div className="p-4 border-t border-slate-200 flex-shrink-0">
              <button
                onClick={() => alert('Logout - Coming soon')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

