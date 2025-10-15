'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, TrendingUp, Zap, Database } from 'lucide-react';
import { DiscoModelState } from '../types';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  modelState: DiscoModelState;
  recordsUsed: number;
  trainingTime: number;
  onClose: () => void;
  onViewDetails: () => void;
}

export function SuccessModal({ isOpen, modelState, recordsUsed, trainingTime, onClose, onViewDetails }: SuccessModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
          {/* Confetti effect */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: '50%',
                    y: '50%',
                    scale: 0,
                    rotate: 0
                  }}
                  animate={{
                    x: `${Math.random() * 100}%`,
                    y: `${Math.random() * 100}%`,
                    scale: [0, 1, 0],
                    rotate: Math.random() * 360
                  }}
                  transition={{
                    duration: 2,
                    ease: 'easeOut'
                  }}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 5)]
                  }}
                />
              ))}
            </div>
          )}
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden relative"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%_100%] p-8 text-white text-center">
              <motion.div
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear'
                }}
                className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%_100%]"
              />
              
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors z-10"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', duration: 0.8 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-4"
                >
                  <Sparkles className="h-10 w-10 text-white" />
                </motion.div>
                
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold mb-2"
                >
                  Your Custom Adapter is Ready!
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-blue-100"
                >
                  Successfully trained on your data
                </motion.p>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-8">
              {/* Model Version Badge */}
              <div className="text-center mb-6">
                <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg">
                  Custom Adapter {modelState.version}
                </div>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-blue-50 rounded-lg p-4 text-center"
                >
                  <Database className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-sm text-blue-900 mb-1">Records Used</div>
                  <div className="text-xl font-bold text-blue-900">{recordsUsed.toLocaleString()}</div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-purple-50 rounded-lg p-4 text-center"
                >
                  <Zap className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-sm text-purple-900 mb-1">Training Time</div>
                  <div className="text-xl font-bold text-purple-900">{formatTime(trainingTime)}</div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-green-50 rounded-lg p-4 text-center"
                >
                  <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <div className="text-sm text-green-900 mb-1">Quality Score</div>
                  <div className="text-xl font-bold text-green-900">{modelState.qualityScore}%</div>
                </motion.div>
              </div>
              
              {/* Improvements */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Improvements vs. Standard</span>
                  <span className="text-lg font-bold text-green-600">+{Math.floor((modelState.accuracy - 82) / 82 * 100)}% Accuracy</span>
                </div>
              </motion.div>
              
              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={onClose}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start Using
                </Button>
                <Button
                  onClick={() => {
                    onClose();
                    onViewDetails();
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  View Details
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

