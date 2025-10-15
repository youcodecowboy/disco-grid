'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { FloorHeader } from '@/components/floor/FloorHeader';
import { FloorFooter } from '@/components/floor/FloorFooter';
import { QRScannerModal } from '@/components/floor/QRScannerModal';
import { MessagesPanel } from '@/components/floor/MessagesPanel';
import { MenuPanel } from '@/components/floor/MenuPanel';
import { CURRENT_FLOOR_WORKER } from '@/lib/data/floorWorkers';
import { getMessagesByWorker, getUnreadMessageCount } from '@/lib/data/floorMessages';
import {
    getEventsForWeek,
    getEventsForDay,
    getWeekDays,
    getCurrentWeekStart,
    getEventTypeColor
} from '@/lib/data/floorCalendar';
import type { CalendarEvent } from '@/lib/data/floorCalendar';

export default function FloorCalendarPage() {
  const router = useRouter();
  const [weekStart, setWeekStart] = useState(getCurrentWeekStart());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [scannerOpen, setScannerOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const worker = CURRENT_FLOOR_WORKER;
  const messages = getMessagesByWorker(worker.id);
  const unreadCount = getUnreadMessageCount(worker.id);

  const weekDays = getWeekDays(weekStart);
  const weekEvents = getEventsForWeek(worker.id, weekStart);
  const selectedDayEvents = getEventsForDay(worker.id, selectedDate);

  const goToPreviousWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(newStart.getDate() - 7);
    setWeekStart(newStart);
  };

  const goToNextWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(newStart.getDate() + 7);
    setWeekStart(newStart);
  };

  const goToToday = () => {
    const today = new Date();
    setWeekStart(getCurrentWeekStart());
    setSelectedDate(today);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const dateStr = date.toISOString().split('T')[0];
    return weekEvents.filter(event => event.date === dateStr);
  };

  const formatWeekRange = () => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    const startMonth = weekStart.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = weekEnd.toLocaleDateString('en-US', { month: 'short' });
    const startDay = weekStart.getDate();
    const endDay = weekEnd.getDate();
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay}-${endDay}`;
    }
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
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

        {/* Calendar Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-slate-900">Calendar</h1>
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              Today
            </button>
          </div>

          {/* Week navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={goToPreviousWeek}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-slate-700" />
            </button>
            <h2 className="text-lg font-bold text-slate-700">
              {formatWeekRange()}
            </h2>
            <button
              onClick={goToNextWeek}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-slate-700" />
            </button>
          </div>
        </div>

        {/* Week grid */}
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, index) => {
            const dayEvents = getEventsForDate(day);
            const hasMilestones = dayEvents.some(e => e.type === 'milestone' || e.type === 'deadline');
            const today = isToday(day);
            const selected = isSelected(day);

            return (
              <motion.button
                key={index}
                onClick={() => setSelectedDate(day)}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-xl border-2 transition-all ${
                  selected
                    ? 'bg-blue-500 border-blue-600 shadow-lg'
                    : today
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`text-xs font-semibold mb-1 ${
                  selected ? 'text-blue-100' : 'text-slate-600'
                }`}>
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className={`text-xl font-bold mb-2 ${
                  selected ? 'text-white' : today ? 'text-blue-600' : 'text-slate-900'
                }`}>
                  {day.getDate()}
                </div>
                {dayEvents.length > 0 && (
                  <div className="flex flex-col gap-0.5">
                    {dayEvents.slice(0, 3).map((event, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full ${
                          event.type === 'milestone' || event.type === 'deadline'
                            ? 'bg-red-400'
                            : event.scheduleStatus === 'at-risk' || event.scheduleStatus === 'behind'
                            ? 'bg-orange-400'
                            : selected
                            ? 'bg-white/70'
                            : 'bg-blue-400'
                        }`}
                      />
                    ))}
                    {dayEvents.length > 3 && (
                      <div className={`text-xs font-bold mt-1 ${
                        selected ? 'text-white' : 'text-slate-600'
                      }`}>
                        +{dayEvents.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Selected day events */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>

          {selectedDayEvents.length === 0 ? (
            <div className="text-center py-8 text-slate-600">
              <p className="font-medium">No events scheduled</p>
              <p className="text-sm text-slate-500 mt-1">Enjoy your free time!</p>
            </div>
          ) : (
              <div className="space-y-2">
              {selectedDayEvents.map((event) => {
                const colors = getEventTypeColor(event.type);
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`${colors.bg} border-l-4 ${colors.border} border-t border-r border-b border-slate-200 rounded-lg p-4`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full ${colors.accent} mt-2 flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-semibold ${colors.text}`}>
                            {event.title}
                          </h4>
                          {event.priority === 'critical' && (
                            <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded">
                              CRITICAL
                            </span>
                          )}
                        </div>
                        {event.description && (
                          <p className="text-sm text-slate-600 mb-2">
                            {event.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          {event.allDay ? (
                            <span className="font-medium">All Day</span>
                          ) : (
                            <span className="font-medium">
                              {event.startTime} - {event.endTime}
                            </span>
                          )}
                          {event.location && (
                            <span>{event.location}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
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

