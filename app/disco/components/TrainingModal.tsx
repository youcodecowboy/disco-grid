'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Database, Brain, CheckCircle, Loader2 } from 'lucide-react';
import { TrainingProgress } from '../types';
import { Button } from '@/components/ui/button';

interface TrainingModalProps {
  isOpen: boolean;
  progress: TrainingProgress | null;
  onCancel: () => void;
}

const stageConfig = {
  collecting: {
    title: 'Collecting Data',
    description: 'Gathering data from selected sources...',
    icon: Database,
    color: 'blue'
  },
  processing: {
    title: 'Processing Data',
    description: 'Cleaning and organizing records...',
    icon: Loader2,
    color: 'purple'
  },
  extracting: {
    title: 'Extracting Features',
    description: 'Identifying patterns and relationships...',
    icon: Brain,
    color: 'green'
  },
  training: {
    title: 'Training Model',
    description: 'Building your custom LoRa adapter...',
    icon: Brain,
    color: 'orange'
  },
  validating: {
    title: 'Validating Model',
    description: 'Running validation tests...',
    icon: CheckCircle,
    color: 'green'
  },
  deploying: {
    title: 'Deploying',
    description: 'Finalizing your custom adapter...',
    icon: CheckCircle,
    color: 'blue'
  }
};

export function TrainingModal({ isOpen, progress, onCancel }: TrainingModalProps) {
  if (!progress) return null;
  
  const stage = stageConfig[progress.stage];
  const StageIcon = stage.icon;
  
  const getElapsedTime = () => {
    const seconds = Math.floor((new Date().getTime() - progress.startTime.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const getEstimatedRemaining = () => {
    const remaining = Math.floor((progress.estimatedComplete.getTime() - new Date().getTime()) / 1000);
    if (remaining <= 0) return 'Almost done...';
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')} remaining`;
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <button
                onClick={onCancel}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-2xl font-bold mb-2">Building Your Custom Adapter</h2>
              <p className="text-blue-100">Training your personalized AI model...</p>
            </div>
            
            {/* Content */}
            <div className="p-8">
              {/* Current Stage */}
              <div className="text-center mb-8">
                <motion.div
                  animate={{
                    rotate: stage.icon === Loader2 ? 360 : 0,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
                  }}
                  className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-${stage.color}-400 to-${stage.color}-600 mb-4`}
                >
                  <StageIcon className="h-10 w-10 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{stage.title}</h3>
                <p className="text-gray-600">{progress.currentAction}</p>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-semibold text-gray-900">{progress.progress.toFixed(0)}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.progress}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                  />
                </div>
              </div>
              
              {/* Stage-specific data */}
              {progress.stageData.recordsProcessed && progress.stageData.totalRecords && (
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-900">Records Processed</span>
                    <span className="font-semibold text-blue-900">
                      {progress.stageData.recordsProcessed.toLocaleString()} / {progress.stageData.totalRecords.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
              
              {progress.stageData.currentAccuracy && (
                <div className="bg-green-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-900">Current Accuracy</span>
                    <span className="font-semibold text-green-900">
                      {progress.stageData.currentAccuracy.toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}
              
              {progress.stageData.testsCompleted && progress.stageData.totalTests && (
                <div className="bg-purple-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-purple-900">Validation Tests</span>
                    <span className="font-semibold text-purple-900">
                      {progress.stageData.testsCompleted} / {progress.stageData.totalTests}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Time info */}
              <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t border-gray-200">
                <span>Elapsed: {getElapsedTime()}</span>
                <span>{getEstimatedRemaining()}</span>
              </div>
            </div>
            
            {/* Footer */}
            <div className="bg-gray-50 px-8 py-4 flex justify-end">
              <Button
                onClick={onCancel}
                variant="outline"
                className="text-gray-700"
              >
                Cancel Training
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

