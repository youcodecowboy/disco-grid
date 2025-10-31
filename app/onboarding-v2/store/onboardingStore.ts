/**
 * Onboarding V2 Store
 * 
 * Zustand store managing the Generation Contract and UI state.
 * Includes auto-save, localStorage persistence, and offline support.
 */

import { create } from 'zustand';
import type { GenerationContractV1 } from '../types.contract';
import type { OnboardingStore, OnboardingUIState } from '../types';
import { createEmptyContract } from '../types.contract';
import { generateIdempotencyKey } from '../lib/idempotency';

const STORAGE_KEY_PREFIX = 'groovy:onboarding-v2';
const AUTO_SAVE_INTERVAL = 10000; // 10 seconds

/**
 * Get user-scoped storage key
 */
function getStorageKey(userId?: string): string {
  return userId
    ? `${STORAGE_KEY_PREFIX}:${userId}:progress`
    : `${STORAGE_KEY_PREFIX}:progress`;
}

/**
 * Save contract to localStorage
 */
function saveToStorage(contract: GenerationContractV1, userId?: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const key = getStorageKey(userId);
    const data = {
      contract,
      savedAt: new Date().toISOString(),
      version: '1.0.0',
    };
    
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

/**
 * Load contract from localStorage
 */
function loadFromStorage(userId?: string): GenerationContractV1 | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const key = getStorageKey(userId);
    const item = localStorage.getItem(key);
    
    if (!item) return null;
    
    const data = JSON.parse(item);
    return data.contract;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
}

/**
 * Clear saved progress
 */
function clearStorage(userId?: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const key = getStorageKey(userId);
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
}

/**
 * Initial UI state
 */
const initialUIState: OnboardingUIState = {
  currentStep: 0,
  currentQuestionId: 'welcome',
  isGenerating: false,
  generationProgress: 0,
  saveStatus: 'idle',
  lastSaved: undefined,
  visitedSteps: new Set([0]),
  offlineMode: false,
  demoMode: false, // Demo mode for investor presentations
  devMode: false, // Dev mode: skip validation, allow free navigation
};

/**
 * Create the onboarding store
 */
export const useOnboardingStore = create<OnboardingStore>((set, get) => {
  // Auto-save interval
  let autoSaveInterval: NodeJS.Timeout | null = null;
  
  // Start auto-save
  const startAutoSave = () => {
    if (autoSaveInterval) return;
    
    autoSaveInterval = setInterval(() => {
      const { contract, uiState } = get();
      
      // Don't save during generation
      if (uiState.isGenerating) return;
      
      set({ uiState: { ...uiState, saveStatus: 'saving' } });
      
      saveToStorage(contract);
      
      set({
        uiState: {
          ...uiState,
          saveStatus: 'saved',
          lastSaved: new Date(),
        },
      });
    }, AUTO_SAVE_INTERVAL);
  };
  
  // Start auto-save if in browser
  if (typeof window !== 'undefined') {
    startAutoSave();
  }
  
  return {
    contract: createEmptyContract(generateIdempotencyKey()),
    uiState: initialUIState,
    
        /**
         * Update contract (partial update)
         */
        updateContract: (updates) => {
          set((state) => {
            const newContract = {
              ...state.contract,
              ...updates,
              metadata: {
                ...state.contract.metadata,
                ...(updates.metadata || {}),
                lastStep: state.uiState.currentQuestionId,
              },
            };
            return { contract: newContract };
          });
        },
    
    /**
     * Set current step
     */
    setCurrentStep: (step) => {
      set((state) => {
        const visitedSteps = new Set(state.uiState.visitedSteps);
        visitedSteps.add(step);
        
        return {
          uiState: {
            ...state.uiState,
            currentStep: step,
            visitedSteps,
          },
        };
      });
    },
    
    /**
     * Go to next step
     */
    nextStep: () => {
      set((state) => {
        const nextStep = state.uiState.currentStep + 1;
        const visitedSteps = new Set(state.uiState.visitedSteps);
        visitedSteps.add(nextStep);
        
        return {
          uiState: {
            ...state.uiState,
            currentStep: nextStep,
            visitedSteps,
          },
        };
      });
    },
    
    /**
     * Go to previous step
     */
    previousStep: () => {
      set((state) => {
        const prevStep = Math.max(0, state.uiState.currentStep - 1);
        
        return {
          uiState: {
            ...state.uiState,
            currentStep: prevStep,
          },
        };
      });
    },
    
    /**
     * Jump to specific step
     */
    jumpToStep: (step) => {
      set((state) => {
        const visitedSteps = new Set(state.uiState.visitedSteps);
        visitedSteps.add(step);
        
        return {
          uiState: {
            ...state.uiState,
            currentStep: step,
            visitedSteps,
          },
        };
      });
    },
    
    /**
     * Jump to specific question
     */
    jumpToQuestion: (questionId) => {
      set((state) => ({
        uiState: {
          ...state.uiState,
          currentQuestionId: questionId,
        },
      }));
    },
    
    /**
     * Start generation process
     */
    startGeneration: () => {
      set((state) => ({
        uiState: {
          ...state.uiState,
          isGenerating: true,
          generationProgress: 0,
        },
        contract: {
          ...state.contract,
          metadata: {
            ...state.contract.metadata,
            completedAt: new Date().toISOString(),
          },
        },
      }));
    },
    
    /**
     * Update generation progress
     */
    updateGenerationProgress: (progress) => {
      set((state) => ({
        uiState: {
          ...state.uiState,
          generationProgress: progress,
        },
      }));
    },
    
    /**
     * Complete generation
     */
    completeGeneration: () => {
      set((state) => ({
        uiState: {
          ...state.uiState,
          isGenerating: false,
          generationProgress: 100,
        },
      }));
    },
    
    /**
     * Manually save progress
     */
    saveProgress: () => {
      const { contract, uiState } = get();
      
      set({ uiState: { ...uiState, saveStatus: 'saving' } });
      
      saveToStorage(contract);
      
      set({
        uiState: {
          ...uiState,
          saveStatus: 'saved',
          lastSaved: new Date(),
        },
      });
    },
    
    /**
     * Load saved progress
     */
    loadProgress: () => {
      const saved = loadFromStorage();
      
      if (saved) {
        set({
          contract: saved,
          uiState: {
            ...initialUIState,
            currentQuestionId: saved.metadata.lastStep,
          },
        });
        return true;
      }
      
      return false;
    },
    
    /**
     * Reset progress (start over)
     */
    resetProgress: () => {
      clearStorage();
      
      set({
        contract: createEmptyContract(generateIdempotencyKey()),
        uiState: initialUIState,
      });
    },
    
    /**
     * Set offline mode
     */
    setOfflineMode: (offline) => {
      set((state) => ({
        uiState: {
          ...state.uiState,
          offlineMode: offline,
        },
      }));
    },
    
    /**
     * Toggle demo mode
     */
    setDemoMode: (enabled) => {
      set((state) => ({
        uiState: {
          ...state.uiState,
          demoMode: enabled,
        },
      }));
    },
    
    /**
     * Set dev mode (skip validation, allow free navigation)
     */
    setDevMode: (enabled) => {
      set((state) => ({
        uiState: {
          ...state.uiState,
          devMode: enabled,
        },
      }));
    },
    
    /**
     * Queue update for offline sync (stub for now)
     */
    queueUpdate: (update) => {
      // TODO: Implement offline queue
      console.log('Queued update:', update);
    },
    
    /**
     * Flush offline queue (stub for now)
     */
    flushQueue: () => {
      // TODO: Implement queue flushing
      console.log('Flushing queue...');
    },
    
    /**
     * Get section completion status
     */
    getSectionCompletion: (sectionId, questions) => {
      const { contract } = get();
      const sectionQuestions = questions.filter((q: any) => q.section === sectionId && q.required);
      
      if (sectionQuestions.length === 0) {
        return { completed: false, answered: 0, total: 0 };
      }
      
      let answeredCount = 0;
      
      sectionQuestions.forEach((q: any) => {
        if (!q.mapsTo) return;
        
        const path = q.mapsTo.split('.');
        let value: any = contract;
        
        for (const key of path) {
          value = value?.[key];
        }
        
        const isAnswered = value !== undefined && value !== null && value !== '' &&
                          !(Array.isArray(value) && value.length === 0);
        
        if (isAnswered) {
          answeredCount++;
        }
      });
      
      return {
        completed: answeredCount === sectionQuestions.length,
        answered: answeredCount,
        total: sectionQuestions.length,
      };
    },
  };
});

