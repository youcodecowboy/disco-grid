'use client';

import { motion } from 'framer-motion';
import { Sparkles, Zap, Clock, Database } from 'lucide-react';
import { DiscoModelState } from '../types';
import { useEffect, useState } from 'react';

interface ModelStatusHeaderProps {
  modelState: DiscoModelState;
}

export function ModelStatusHeader({ modelState }: ModelStatusHeaderProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const getStatusColor = () => {
    switch (modelState.type) {
      case 'custom':
        return 'from-blue-500 to-purple-600';
      case 'training':
        return 'from-orange-500 to-red-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };
  
  const getStatusDot = () => {
    switch (modelState.type) {
      case 'custom':
        return 'bg-blue-500';
      case 'training':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const getVersionLabel = () => {
    switch (modelState.type) {
      case 'custom':
        return `Custom Adapter ${modelState.version}`;
      case 'training':
        return 'Training...';
      default:
        return `Standard ${modelState.version}`;
    }
  };
  
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };
  
  if (!mounted) {
    return (
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-4 gap-4">
            <div className="h-20 bg-gray-100 rounded"></div>
            <div className="h-20 bg-gray-100 rounded"></div>
            <div className="h-20 bg-gray-100 rounded"></div>
            <div className="h-20 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden bg-white rounded-lg border border-gray-200 p-4 mb-4"
    >
      {/* Gradient border effect for custom models */}
      {modelState.type === 'custom' && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-20"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear'
          }}
          style={{ backgroundSize: '200% 200%' }}
        />
      )}
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <motion.div
              animate={modelState.type === 'custom' ? {
                rotate: [0, 360],
              } : {}}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear'
              }}
            >
              <Sparkles className="h-5 w-5 text-blue-600" />
            </motion.div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Model Status</h2>
            </div>
          </div>
          
          {/* Version Badge */}
          <div className={`relative px-3 py-1 rounded-md bg-gradient-to-r ${getStatusColor()} text-white text-sm font-semibold`}>
            <div className="flex items-center gap-2">
              <motion.div
                className={`w-1.5 h-1.5 rounded-full ${getStatusDot()}`}
                animate={modelState.type === 'training' ? {
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.6, 1]
                } : {}}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
              {getVersionLabel()}
            </div>
          </div>
        </div>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Training Records */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-md p-3"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Database className="h-3.5 w-3.5 text-blue-600" />
              <span className="text-[10px] font-semibold text-blue-900 uppercase tracking-wide">
                Training Data
              </span>
            </div>
            <div className="text-lg font-bold text-blue-900">
              {modelState.trainingRecords > 0 
                ? modelState.trainingRecords.toLocaleString() 
                : 'Standard'
              }
            </div>
            {modelState.trainingRecords > 0 && (
              <div className="text-[10px] text-blue-700 mt-0.5">records</div>
            )}
          </motion.div>
          
          {/* Accuracy */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-br from-green-50 to-green-100 rounded-md p-3"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Zap className="h-3.5 w-3.5 text-green-600" />
              <span className="text-[10px] font-semibold text-green-900 uppercase tracking-wide">
                Accuracy
              </span>
            </div>
            <div className="text-lg font-bold text-green-900">
              {modelState.accuracy}%
            </div>
            <div className="text-[10px] text-green-700 mt-0.5">
              Quality: {modelState.qualityScore}%
            </div>
          </motion.div>
          
          {/* Response Time */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-md p-3"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="h-3.5 w-3.5 text-purple-600" />
              <span className="text-[10px] font-semibold text-purple-900 uppercase tracking-wide">
                Response Time
              </span>
            </div>
            <div className="text-lg font-bold text-purple-900">
              {modelState.responseTime}ms
            </div>
            <div className="text-[10px] text-purple-700 mt-0.5">average</div>
          </motion.div>
          
          {/* Last Updated */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-md p-3"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="h-3.5 w-3.5 text-orange-600" />
              <span className="text-[10px] font-semibold text-orange-900 uppercase tracking-wide">
                Last Updated
              </span>
            </div>
            <div className="text-sm font-bold text-orange-900">
              {mounted ? getTimeAgo(modelState.lastUpdated) : '--'}
            </div>
            <div className="text-[10px] text-orange-700 mt-0.5">
              Success: {modelState.successRate}%
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

