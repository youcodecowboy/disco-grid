'use client';

import { motion } from 'framer-motion';
import { Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SelectionSummaryProps {
  selectedSourceCount: number;
  totalSourceCount: number;
  selectedRecordCount: number;
  averageQuality: number;
  meetsMinimum: boolean;
  onBuildAdapter: () => void;
  isTraining: boolean;
}

export function SelectionSummary({
  selectedSourceCount,
  totalSourceCount,
  selectedRecordCount,
  averageQuality,
  meetsMinimum,
  onBuildAdapter,
  isTraining
}: SelectionSummaryProps) {
  const MINIMUM_RECORDS = 10000;
  const progress = Math.min((selectedRecordCount / MINIMUM_RECORDS) * 100, 100);
  const recordsNeeded = Math.max(MINIMUM_RECORDS - selectedRecordCount, 0);
  
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-xl"
    >
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between gap-6">
          {/* Left side - Selection info */}
          <div className="flex items-center gap-4">
            {/* Sources */}
            <div>
              <div className="text-[10px] text-gray-600 mb-0.5 uppercase tracking-wide">Selected Sources</div>
              <div className="text-base font-bold text-gray-900">
                {selectedSourceCount} <span className="text-xs text-gray-500">of {totalSourceCount}</span>
              </div>
            </div>
            
            {/* Records */}
            <div>
              <div className="text-[10px] text-gray-600 mb-0.5 uppercase tracking-wide">Total Records</div>
              <motion.div
                key={selectedRecordCount}
                initial={{ scale: 1.2, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-base font-bold text-blue-600"
              >
                {selectedRecordCount.toLocaleString()}
              </motion.div>
            </div>
            
            {/* Quality */}
            <div>
              <div className="text-[10px] text-gray-600 mb-0.5 uppercase tracking-wide">Avg Quality</div>
              <div className={`text-base font-bold ${
                averageQuality >= 90 ? 'text-green-600' :
                averageQuality >= 70 ? 'text-blue-600' :
                averageQuality >= 50 ? 'text-orange-600' : 'text-red-600'
              }`}>
                {averageQuality}%
              </div>
            </div>
          </div>
          
          {/* Center - Progress bar */}
          <div className="flex-1 max-w-md">
            <div className="mb-1 flex items-center justify-between text-[10px]">
              <span className="text-gray-600">
                {meetsMinimum ? 'Ready to build' : `Need ${recordsNeeded.toLocaleString()} more records`}
              </span>
              <span className="font-semibold text-gray-900">{progress.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className={`h-full ${meetsMinimum ? 'bg-green-500' : 'bg-orange-500'}`}
              />
            </div>
            {meetsMinimum && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 flex items-center gap-1 text-[10px] text-green-600"
              >
                <CheckCircle className="h-2.5 w-2.5" />
                <span>Ready for training</span>
              </motion.div>
            )}
            {!meetsMinimum && selectedRecordCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 flex items-center gap-1 text-[10px] text-orange-600"
              >
                <AlertCircle className="h-2.5 w-2.5" />
                <span>Need 10,000+ records</span>
              </motion.div>
            )}
          </div>
          
          {/* Right side - Action button */}
          <div>
            <Button
              onClick={onBuildAdapter}
              disabled={!meetsMinimum || isTraining}
              className={`h-10 px-6 text-sm font-semibold ${
                meetsMinimum && !isTraining
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                  : ''
              }`}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isTraining ? 'Training...' : 'Build LoRa Adapter'}
            </Button>
            {meetsMinimum && !isTraining && (
              <div className="text-[10px] text-gray-500 mt-0.5 text-center">
                ~20 seconds
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

