'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Camera, QrCode, FileText, Clock, MapPin, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface StageInput {
  id: string;
  type: 'qr-scan' | 'photo' | 'text' | 'number' | 'checkbox';
  label: string;
  required: boolean;
  completed: boolean;
}

interface StageCardProps {
  stageName: string;
  stageDescription: string;
  currentProgress: number;
  scheduleStatus: 'ahead' | 'on-time' | 'behind' | 'at-risk';
  estimatedDuration: number;
  location: string;
  inputs: StageInput[];
  onComplete: () => void;
}

export function StageCard({
  stageName,
  stageDescription,
  currentProgress,
  scheduleStatus,
  estimatedDuration,
  location,
  inputs,
  onComplete
}: StageCardProps) {
  const [completedInputs, setCompletedInputs] = useState<Set<string>>(
    new Set(inputs.filter(i => i.completed).map(i => i.id))
  );

  const statusColors = {
    'ahead': { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-900', progress: 'bg-green-500' },
    'on-time': { bg: 'bg-yellow-50', border: 'border-yellow-500', text: 'text-yellow-900', progress: 'bg-yellow-500' },
    'behind': { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-900', progress: 'bg-red-500' },
    'at-risk': { bg: 'bg-rose-50', border: 'border-rose-900', text: 'text-rose-900', progress: 'bg-rose-900' }
  };

  const colors = statusColors[scheduleStatus];

  const getInputIcon = (type: StageInput['type']) => {
    switch (type) {
      case 'qr-scan': return QrCode;
      case 'photo': return Camera;
      case 'text': return FileText;
      case 'number': return FileText;
      case 'checkbox': return CheckCircle;
    }
  };

  const toggleInput = (inputId: string) => {
    setCompletedInputs(prev => {
      const next = new Set(prev);
      if (next.has(inputId)) {
        next.delete(inputId);
      } else {
        next.add(inputId);
      }
      return next;
    });
  };

  const requiredInputs = inputs.filter(i => i.required);
  const completedRequired = requiredInputs.filter(i => completedInputs.has(i.id)).length;
  const canComplete = completedRequired === requiredInputs.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${colors.bg} border-l-4 ${colors.border} border-t border-r border-b border-slate-200 rounded-lg overflow-hidden shadow-lg`}
    >
      {/* Header */}
      <div className="p-5 border-b border-slate-300">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h2 className={`text-2xl font-bold ${colors.text} mb-1`}>
              {stageName}
            </h2>
            <p className="text-sm text-slate-700">
              {stageDescription}
            </p>
          </div>
          {(scheduleStatus === 'behind' || scheduleStatus === 'at-risk') && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AlertCircle className={`w-6 h-6 ${colors.text}`} />
            </motion.div>
          )}
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className={colors.text}>Stage Progress</span>
            <span className={colors.text}>{currentProgress}%</span>
          </div>
          <div className="h-2 bg-white/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${currentProgress}%` }}
              transition={{ duration: 0.5 }}
              className={`h-full ${colors.progress}`}
            />
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-4 mt-3 text-sm">
          <div className="flex items-center gap-1.5">
            <Clock className={`w-4 h-4 ${colors.text}`} />
            <span className={`font-bold ${colors.text}`}>~{estimatedDuration}min</span>
          </div>
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <MapPin className="w-4 h-4 text-slate-600 flex-shrink-0" />
            <span className="text-slate-700 truncate font-medium">{location}</span>
          </div>
        </div>
      </div>

      {/* Inputs */}
      <div className="p-5">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">
          Required Actions ({completedRequired}/{requiredInputs.length})
        </h3>
        
        <div className="space-y-3 mb-5">
          {inputs.map((input) => {
            const Icon = getInputIcon(input.type);
            const isCompleted = completedInputs.has(input.id);
            
            return (
              <button
                key={input.id}
                onClick={() => toggleInput(input.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                  isCompleted
                    ? 'bg-green-50 border-green-500'
                    : 'bg-white border-slate-300 hover:border-slate-400'
                }`}
              >
                <div className={`p-2 rounded-lg ${isCompleted ? 'bg-green-100' : 'bg-slate-100'}`}>
                  <Icon className={`w-5 h-5 ${isCompleted ? 'text-green-700' : 'text-slate-600'}`} />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${isCompleted ? 'text-green-900' : 'text-slate-900'}`}>
                      {input.label}
                    </span>
                    {input.required && !isCompleted && (
                      <span className="text-xs font-bold text-red-600 uppercase">Required</span>
                    )}
                  </div>
                </div>
                {isCompleted && (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                )}
              </button>
            );
          })}
        </div>

        {/* Complete button */}
        <motion.button
          whileHover={canComplete ? { scale: 1.02 } : {}}
          whileTap={canComplete ? { scale: 0.98 } : {}}
          onClick={canComplete ? onComplete : undefined}
          disabled={!canComplete}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
            canComplete
              ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 shadow-lg hover:shadow-xl'
              : 'bg-slate-200 text-slate-500 cursor-not-allowed'
          }`}
        >
          {canComplete ? 'Complete Stage' : `Complete ${requiredInputs.length - completedRequired} more required ${requiredInputs.length - completedRequired === 1 ? 'action' : 'actions'}`}
        </motion.button>
      </div>
    </motion.div>
  );
}

