// Disco AI Showcase - State Management with Zustand

import { create } from 'zustand';
import { DataSource, DiscoModelState, TrainingProgress, ScanningModelConfig, TabType } from '../types';
import { generateMockDataSources, generateInitialModelState, generateDefaultScanningConfig } from '../lib/mockData';

interface DiscoStore {
  // Current tab
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  
  // Model state
  modelState: DiscoModelState;
  setModelState: (state: DiscoModelState) => void;
  
  // Data sources
  dataSources: DataSource[];
  setDataSources: (sources: DataSource[]) => void;
  toggleSource: (id: string) => void;
  toggleTable: (sourceId: string, tableId: string) => void;
  updateSource: (id: string, updates: Partial<DataSource>) => void;
  
  // Selection computed values
  getSelectedRecordCount: () => number;
  getSelectedSourceCount: () => number;
  getAverageQuality: () => number;
  getMeetsMinimum: () => boolean;
  
  // Training
  isTraining: boolean;
  trainingProgress: TrainingProgress | null;
  startTraining: () => void;
  updateTrainingProgress: (progress: TrainingProgress) => void;
  completeTraining: (newModelState: DiscoModelState) => void;
  cancelTraining: () => void;
  
  // Real-time updates
  lastUpdate: Date;
  liveUpdatesEnabled: boolean;
  toggleLiveUpdates: () => void;
  updateTimestamps: () => void;
  
  // Configuration
  scanningConfig: ScanningModelConfig;
  updateScanningConfig: (config: Partial<ScanningModelConfig>) => void;
  
  // Initialize
  initialize: () => void;
}

export const useDiscoStore = create<DiscoStore>((set, get) => ({
  // Initial state
  activeTab: 'model-builder',
  modelState: generateInitialModelState(),
  dataSources: generateMockDataSources(),
  isTraining: false,
  trainingProgress: null,
  lastUpdate: new Date(),
  liveUpdatesEnabled: true,
  scanningConfig: generateDefaultScanningConfig(),
  
  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  setModelState: (modelState) => set({ modelState }),
  
  setDataSources: (dataSources) => set({ dataSources }),
  
  toggleSource: (id) => set((state) => ({
    dataSources: state.dataSources.map(source =>
      source.id === id 
        ? { 
            ...source, 
            selected: !source.selected,
            tables: source.tables.map(table => ({ ...table, selected: !source.selected }))
          }
        : source
    )
  })),
  
  toggleTable: (sourceId, tableId) => set((state) => ({
    dataSources: state.dataSources.map(source =>
      source.id === sourceId
        ? {
            ...source,
            tables: source.tables.map(table =>
              table.id === tableId ? { ...table, selected: !table.selected } : table
            ),
            selected: source.tables.some(t => t.id === tableId ? !t.selected : t.selected)
          }
        : source
    )
  })),
  
  updateSource: (id, updates) => set((state) => ({
    dataSources: state.dataSources.map(source =>
      source.id === id ? { ...source, ...updates } : source
    )
  })),
  
  // Computed values
  getSelectedRecordCount: () => {
    const { dataSources } = get();
    return dataSources.reduce((total, source) => {
      if (!source.selected) return total;
      return total + source.tables
        .filter(table => table.selected)
        .reduce((sum, table) => sum + table.recordCount, 0);
    }, 0);
  },
  
  getSelectedSourceCount: () => {
    const { dataSources } = get();
    return dataSources.filter(source => source.selected).length;
  },
  
  getAverageQuality: () => {
    const { dataSources } = get();
    const selectedSources = dataSources.filter(source => source.selected);
    if (selectedSources.length === 0) return 0;
    const totalQuality = selectedSources.reduce((sum, source) => sum + source.qualityScore, 0);
    return Math.round(totalQuality / selectedSources.length);
  },
  
  getMeetsMinimum: () => {
    return get().getSelectedRecordCount() >= 10000;
  },
  
  // Training
  startTraining: () => set({ isTraining: true }),
  
  updateTrainingProgress: (trainingProgress) => set({ trainingProgress }),
  
  completeTraining: (newModelState) => set({
    isTraining: false,
    trainingProgress: null,
    modelState: newModelState
  }),
  
  cancelTraining: () => set({
    isTraining: false,
    trainingProgress: null
  }),
  
  // Live updates
  toggleLiveUpdates: () => set((state) => ({
    liveUpdatesEnabled: !state.liveUpdatesEnabled
  })),
  
  updateTimestamps: () => set({ lastUpdate: new Date() }),
  
  // Configuration
  updateScanningConfig: (config) => set((state) => ({
    scanningConfig: { ...state.scanningConfig, ...config }
  })),
  
  // Initialize
  initialize: () => {
    set({
      dataSources: generateMockDataSources(),
      modelState: generateInitialModelState(),
      scanningConfig: generateDefaultScanningConfig()
    });
  }
}));

