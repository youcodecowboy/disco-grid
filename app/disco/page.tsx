'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Settings, TrendingUp, ChevronRight } from 'lucide-react';
import { LayoutScaffold } from '@/components/grid-v2/LayoutScaffold';
import { useDiscoStore } from './store/useDiscoStore';
import { ModelStatusHeader } from './components/ModelStatusHeader';
import { DataSourceGrid } from './components/DataSourceGrid';
import { SelectionSummary } from './components/SelectionSummary';
import { TrainingModal } from './components/TrainingModal';
import { SuccessModal } from './components/SuccessModal';
import { ModelSummaryModal } from './components/ModelSummaryModal';
import { ConfigurationTab } from './components/ConfigurationTab';
import { simulateDataUpdate } from './lib/mockData';
import { TrainingProgress, TrainingStage } from './types';

type TabType = 'model-builder' | 'configuration' | 'performance';

export default function DiscoPage() {
  const {
    activeTab,
    setActiveTab,
    modelState,
    setModelState,
    dataSources,
    setDataSources,
    toggleSource,
    toggleTable,
    updateSource,
    getSelectedRecordCount,
    getSelectedSourceCount,
    getAverageQuality,
    getMeetsMinimum,
    isTraining,
    trainingProgress,
    startTraining: setIsTraining,
    updateTrainingProgress,
    completeTraining,
    cancelTraining,
    liveUpdatesEnabled,
    scanningConfig,
    updateScanningConfig,
    initialize
  } = useDiscoStore();
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [trainingRecords, setTrainingRecords] = useState(0);
  const [trainingDuration, setTrainingDuration] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  // Initialize on mount
  useEffect(() => {
    initialize();
    setMounted(true);
  }, [initialize]);
  
  // Simulate live data updates
  useEffect(() => {
    if (!liveUpdatesEnabled) return;
    
    const interval = setInterval(() => {
      const updatedSources = simulateDataUpdate(dataSources);
      setDataSources(updatedSources);
    }, 3000); // Update every 3 seconds
    
    return () => clearInterval(interval);
  }, [liveUpdatesEnabled, dataSources, setDataSources]);
  
  // Training simulation
  const startTraining = async () => {
    const recordCount = getSelectedRecordCount();
    setTrainingRecords(recordCount);
    setIsTraining(); // Set training mode in store
    
    const stages: { stage: TrainingStage; duration: number; endProgress: number }[] = [
      { stage: 'collecting', duration: 3000, endProgress: 20 },
      { stage: 'processing', duration: 4000, endProgress: 40 },
      { stage: 'extracting', duration: 3000, endProgress: 60 },
      { stage: 'training', duration: 5000, endProgress: 80 },
      { stage: 'validating', duration: 3000, endProgress: 95 },
      { stage: 'deploying', duration: 2000, endProgress: 100 },
    ];
    
    const startTime = new Date();
    let totalElapsed = 0;
    
    for (const { stage, duration, endProgress } of stages) {
      const stageStartTime = Date.now();
      const stepCount = 20;
      const stepDuration = duration / stepCount;
      const prevProgress = stages[stages.findIndex(s => s.stage === stage) - 1]?.endProgress || 0;
      
      for (let i = 0; i <= stepCount; i++) {
        const progress = prevProgress + ((endProgress - prevProgress) * (i / stepCount));
        
        const stageData: any = {};
        
        // Stage-specific data
        if (stage === 'collecting' || stage === 'processing') {
          stageData.recordsProcessed = Math.floor((recordCount * progress) / 100);
          stageData.totalRecords = recordCount;
        } else if (stage === 'training') {
          stageData.currentLoss = Math.max(0.1, 2.5 - (progress / 100) * 2.3);
          stageData.currentAccuracy = Math.min(98, 70 + (progress / 100) * 28);
        } else if (stage === 'validating') {
          stageData.testsCompleted = Math.floor(45 * (progress - 80) / 15);
          stageData.totalTests = 45;
        }
        
        const trainingProgress: TrainingProgress = {
          stage,
          progress,
          currentAction: getStageAction(stage, progress),
          startTime,
          estimatedComplete: new Date(startTime.getTime() + 20000),
          stageData
        };
        
        updateTrainingProgress(trainingProgress);
        
        await new Promise(resolve => setTimeout(resolve, stepDuration));
        totalElapsed += stepDuration;
      }
    }
    
    // Training complete!
    setTrainingDuration(Math.floor(totalElapsed / 1000));
    
    const newModelState = {
      ...modelState,
      version: 'v1.0',
      type: 'custom' as const,
      trainingRecords: recordCount,
      trainingDate: new Date(),
      trainingDuration: Math.floor(totalElapsed / 1000),
      qualityScore: getAverageQuality(),
      accuracy: Math.min(98, 82 + Math.floor(Math.random() * 16)),
      responseTime: Math.max(150, 340 - Math.floor(Math.random() * 190)),
      successRate: Math.min(99, 94 + Math.floor(Math.random() * 5)),
      status: 'active' as const,
      lastUpdated: new Date(),
      nextTraining: null
    };
    
    completeTraining(newModelState);
    setShowSuccessModal(true);
  };
  
  const getStageAction = (stage: TrainingStage, progress: number): string => {
    switch (stage) {
      case 'collecting':
        return progress < 10 ? 'Connecting to data sources...' : 'Collecting data from selected sources...';
      case 'processing':
        return progress < 30 ? 'Cleaning and validating records...' : 'Organizing data structures...';
      case 'extracting':
        return progress < 50 ? 'Analyzing patterns...' : 'Extracting key features...';
      case 'training':
        return progress < 70 ? 'Training neural network...' : 'Optimizing model parameters...';
      case 'validating':
        return 'Running validation tests...';
      case 'deploying':
        return 'Finalizing your custom adapter...';
      default:
        return 'Processing...';
    }
  };
  
  const tabs = [
    { id: 'model-builder' as TabType, label: 'LoRa Model Builder', icon: Sparkles },
    { id: 'configuration' as TabType, label: 'AI Configuration', icon: Settings },
    { id: 'performance' as TabType, label: 'Performance', icon: TrendingUp },
  ];
  
  return (
    <LayoutScaffold
      pageTitle="Disco AI"
      pageSubtext="Mission Control for your personalized AI"
    >
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
          <span className="hover:text-blue-600 transition-colors cursor-pointer">AI Tools</span>
          <ChevronRight className="w-4 h-4" />
          <span className="font-semibold text-slate-900">Disco AI</span>
        </div>
        
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-4">
          <div className="border-b border-slate-200 bg-slate-50">
            <div className="flex gap-1 px-4 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-sm font-semibold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-blue-600'
                      : 'text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Model Status Header - shown on all tabs */}
        <ModelStatusHeader modelState={modelState} />
        
        {/* Tab Content */}
        {activeTab === 'model-builder' && (
          <div>
            {/* Overview Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-4 gap-3 mb-4"
            >
              <div className="bg-white rounded-md border border-gray-200 p-3">
                <div className="text-[10px] text-gray-600 mb-0.5 uppercase tracking-wide">Total Sources</div>
                <div className="text-lg font-bold text-gray-900">{dataSources.length}</div>
              </div>
              <div className="bg-white rounded-md border border-gray-200 p-3">
                <div className="text-[10px] text-gray-600 mb-0.5 uppercase tracking-wide">Total Records</div>
                <div className="text-lg font-bold text-blue-600">
                  {dataSources.reduce((sum, s) => sum + s.totalRecords, 0).toLocaleString()}
                </div>
              </div>
              <div className="bg-white rounded-md border border-gray-200 p-3">
                <div className="text-[10px] text-gray-600 mb-0.5 uppercase tracking-wide">Avg Quality</div>
                <div className="text-lg font-bold text-green-600">
                  {Math.round(dataSources.reduce((sum, s) => sum + s.qualityScore, 0) / dataSources.length)}%
                </div>
              </div>
              <div className="bg-white rounded-md border border-gray-200 p-3">
                <div className="text-[10px] text-gray-600 mb-0.5 uppercase tracking-wide">Last Sync</div>
                <div className="text-xs font-bold text-gray-900">
                  {mounted ? new Date(Math.max(...dataSources.map(s => s.lastUpdated.getTime()))).toLocaleTimeString() : '--:--:--'}
                </div>
              </div>
            </motion.div>
            
            {/* Data Source Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-base font-bold text-gray-900 mb-3">Select Training Data</h2>
              <DataSourceGrid
                sources={dataSources}
                onToggleSource={toggleSource}
                onToggleTable={toggleTable}
              />
            </motion.div>
            
            {/* Selection Summary */}
            <SelectionSummary
              selectedSourceCount={getSelectedSourceCount()}
              totalSourceCount={dataSources.length}
              selectedRecordCount={getSelectedRecordCount()}
              averageQuality={getAverageQuality()}
              meetsMinimum={getMeetsMinimum()}
              onBuildAdapter={startTraining}
              isTraining={isTraining}
            />
          </div>
        )}
        
        {activeTab === 'configuration' && (
          <ConfigurationTab
            config={scanningConfig}
            onUpdateConfig={updateScanningConfig}
          />
        )}
        
        {activeTab === 'performance' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-gray-200 p-8 text-center"
          >
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">Performance Analytics</h3>
            <p className="text-sm text-gray-600">Coming soon - View detailed model performance metrics and insights</p>
          </motion.div>
        )}
      </div>
      
      {/* Training Modal */}
      <TrainingModal
        isOpen={isTraining}
        progress={trainingProgress}
        onCancel={cancelTraining}
      />
      
      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        modelState={modelState}
        recordsUsed={trainingRecords}
        trainingTime={trainingDuration}
        onClose={() => setShowSuccessModal(false)}
        onViewDetails={() => setShowSummaryModal(true)}
      />
      
      {/* Model Summary Modal */}
      <ModelSummaryModal
        isOpen={showSummaryModal}
        modelState={modelState}
        recordsUsed={trainingRecords}
        trainingTime={trainingDuration}
        onClose={() => setShowSummaryModal(false)}
      />
    </LayoutScaffold>
  );
}
