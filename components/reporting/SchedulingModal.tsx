import { useState } from 'react';
import { X, Calendar, Clock, Users, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface SchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (schedule: ScheduleConfig) => void;
}

interface ScheduleConfig {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'custom';
  time: string;
  daysOfWeek?: string[];
  dayOfMonth?: number;
  recipients: string[];
  format: 'pdf' | 'excel' | 'html';
  channels: string[];
}

export default function SchedulingModal({ isOpen, onClose, onSave }: SchedulingModalProps) {
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly' | 'custom'>('weekly');
  const [time, setTime] = useState('09:00');
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>(['Friday']);
  const [format, setFormat] = useState<'pdf' | 'excel' | 'html'>('pdf');

  if (!isOpen) return null;

  const handleSave = () => {
    const schedule: ScheduleConfig = {
      frequency,
      time,
      daysOfWeek: frequency === 'weekly' ? daysOfWeek : undefined,
      recipients: [],
      format,
      channels: ['email'],
    };
    onSave(schedule);
    onClose();
  };

  const toggleDayOfWeek = (day: string) => {
    if (daysOfWeek.includes(day)) {
      setDaysOfWeek(daysOfWeek.filter(d => d !== day));
    } else {
      setDaysOfWeek([...daysOfWeek, day]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Schedule Report</h2>
              <p className="text-xs text-slate-500">Set up automatic report generation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            {/* Frequency */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">
                Frequency
              </label>
              <Select value={frequency} onValueChange={(value: any) => setFrequency(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Days of Week (for weekly) */}
            {frequency === 'weekly' && (
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">
                  Days of Week
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <button
                      key={day}
                      onClick={() => toggleDayOfWeek(day)}
                      className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                        daysOfWeek.includes(day)
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Time */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">
                <Clock className="h-4 w-4 inline mr-1" />
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Format */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">
                <FileText className="h-4 w-4 inline mr-1" />
                Report Format
              </label>
              <Select value={format} onValueChange={(value: any) => setFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                  <SelectItem value="html">HTML (Interactive)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Recipients */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">
                <Users className="h-4 w-4 inline mr-1" />
                Recipients
              </label>
              <div className="px-4 py-3 border border-slate-200 rounded bg-slate-50">
                <p className="text-xs text-slate-500">
                  Recipients will be added from report details
                </p>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="text-xs font-medium text-blue-900 mb-2">Schedule Preview</div>
              <div className="text-sm text-blue-700">
                {frequency === 'daily' && `Report will be sent daily at ${time}`}
                {frequency === 'weekly' && `Report will be sent every ${daysOfWeek.join(', ')} at ${time}`}
                {frequency === 'monthly' && `Report will be sent monthly at ${time}`}
                {frequency === 'quarterly' && `Report will be sent quarterly at ${time}`}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Schedule
          </Button>
        </div>
      </div>
    </div>
  );
}

