'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Package, ShoppingCart, Workflow, Users, Layers, CheckSquare, MessageSquare } from 'lucide-react';
import { DataSource } from '../types';
import { useState, useEffect } from 'react';
import { SparklineChart } from './SparklineChart';

interface DataSourceCardProps {
  source: DataSource;
  onToggleSource: (id: string) => void;
  onToggleTable: (sourceId: string, tableId: string) => void;
}

const iconMap: Record<string, any> = {
  'ShoppingCart': ShoppingCart,
  'Package': Package,
  'Workflow': Workflow,
  'Users': Users,
  'Layers': Layers,
  'CheckSquare': CheckSquare,
  'MessageSquare': MessageSquare
};

export function DataSourceCard({ source, onToggleSource, onToggleTable }: DataSourceCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const Icon = iconMap[source.icon] || Package;
  
  const getQualityColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 50) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };
  
  const getQualityBadge = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  };
  
  const getFreshnessColor = (date: Date) => {
    const minutesAgo = (new Date().getTime() - date.getTime()) / 1000 / 60;
    if (minutesAgo < 60) return 'bg-green-500';
    if (minutesAgo < 1440) return 'bg-yellow-500';
    return 'bg-orange-500';
  };
  
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: source.available ? 1.01 : 1 }}
      transition={{ duration: 0.2 }}
      className={`relative rounded-md border transition-all ${
        source.selected
          ? 'border-blue-500 bg-blue-50/30 shadow-md shadow-blue-500/10'
          : 'border-gray-200 bg-white hover:border-gray-300'
      } ${!source.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={() => source.available && onToggleSource(source.id)}
    >
      {/* Live indicator */}
      {source.isLive && source.recentCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 z-10"
        >
          <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
            +{source.recentCount}
          </div>
        </motion.div>
      )}
      
      <div className="p-3">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-1">
            <div className={`p-1.5 rounded-md ${source.selected ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <Icon className={`h-4 w-4 ${source.selected ? 'text-blue-600' : 'text-gray-600'}`} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-gray-900">{source.name}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${getQualityColor(source.qualityScore)}`}>
                  {getQualityBadge(source.qualityScore)}
                </span>
                {source.isLive && (
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.6, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                    className="flex items-center gap-0.5 text-[10px] text-green-600"
                  >
                    <div className="w-1 h-1 rounded-full bg-green-500" />
                    Live
                  </motion.div>
                )}
              </div>
            </div>
          </div>
          
          {/* Selection indicator */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {source.selected ? (
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
            ) : (
              <Circle className="h-5 w-5 text-gray-400" />
            )}
          </motion.div>
        </div>
        
        {/* Metrics */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <div className="text-[10px] text-gray-600 mb-0.5">Total Records</div>
            <motion.div
              key={source.totalRecords}
              initial={{ scale: 1.2, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-lg font-bold text-gray-900"
            >
              {source.totalRecords.toLocaleString()}
            </motion.div>
          </div>
          <div>
            <div className="text-[10px] text-gray-600 mb-0.5">Today</div>
            <div className="text-lg font-bold text-blue-600">
              +{source.recordsToday}
            </div>
          </div>
        </div>
        
        {/* Activity Chart */}
        <div className="mb-3">
          <div className="text-[10px] text-gray-600 mb-1.5">Last 7 Days Activity</div>
          <SparklineChart data={source.recentActivity} color={source.selected ? '#3b82f6' : '#9ca3af'} height={30} />
        </div>
        
        {/* Quality Metrics */}
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-gray-600">Quality Score</span>
            <span className="font-semibold text-gray-900">{source.qualityScore}%</span>
          </div>
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${source.qualityScore}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`h-full ${
                source.qualityScore >= 90 ? 'bg-green-500' :
                source.qualityScore >= 70 ? 'bg-blue-500' :
                source.qualityScore >= 50 ? 'bg-orange-500' : 'bg-red-500'
              }`}
            />
          </div>
        </div>
        
        {/* Last Updated */}
        <div className="flex items-center justify-between text-[10px] text-gray-600 mb-2">
          <span>Last Updated</span>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${mounted ? getFreshnessColor(source.lastUpdated) : 'bg-gray-400'}`} />
            <span className="font-medium">{mounted ? getTimeAgo(source.lastUpdated) : '--'}</span>
          </div>
        </div>
        
        {/* Issues */}
        {source.issues.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded p-2 mb-3">
            <div className="text-xs text-orange-800">
              {source.issues.map((issue, i) => (
                <div key={i}>⚠️ {issue}</div>
              ))}
            </div>
          </div>
        )}
        
        {/* Tables Expansion */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="w-full flex items-center justify-between text-sm text-gray-700 hover:text-gray-900 font-medium"
        >
          <span>{source.tables.length} Tables</span>
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        
        {/* Tables List */}
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 space-y-2"
          >
            {source.tables.map((table) => (
              <div
                key={table.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleTable(source.id, table.id);
                }}
                className={`flex items-center justify-between p-2 rounded border ${
                  table.selected ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'
                } hover:border-blue-400 cursor-pointer`}
              >
                <div className="flex items-center gap-2">
                  {table.selected ? (
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Circle className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="text-sm font-medium text-gray-900">{table.name}</span>
                </div>
                <div className="text-xs text-gray-600">
                  {table.recordCount.toLocaleString()}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

