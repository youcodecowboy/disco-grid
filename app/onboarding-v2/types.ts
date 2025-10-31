/**
 * UI-Specific Types for Onboarding V2
 * 
 * These types extend the GenerationContract with UI metadata
 * and component-specific types.
 */

import type { GenerationContractV1 } from './types.contract';

export type QuestionType =
  | 'welcome_screen'
  | 'nlp_input'
  | 'confirm_entities'
  | 'text_input'
  | 'enriched_text'
  | 'dynamic_list'
  | 'file_upload'
  | 'multiple_choice'
  | 'yes_no'
  | 'month_selector'
  | 'lego_attribute_builder'
  | 'lego_attributes'
  | 'lego_component_builder'
  | 'editable_list'
  | 'floor_plan_builder'
  | 'workflow_stages'
  | 'integrations_grid'
  | 'teams_builder'
  | 'metrics_selector'
  | 'integration_grid'
  | 'task_checklist'
  | 'gap_filling'
  | 'review_summary'
  | 'final_confirmation'
  | 'confirm_number'
  | 'department_sizes'
  | 'role_counts'
  | 'supervisors_list'
  | 'color_picker'
  | 'grid_layout_builder';

export type SectionId =
  | 'welcome'
  | 'company'
  | 'operations'
  | 'items'
  | 'workflows'
  | 'sites'
  | 'teams'
  | 'integrations'
  | 'analytics'
  | 'review';

export type ExtractionContext = 
  | 'company_profile'
  | 'operations'
  | 'items_products'
  | 'workflows'
  | 'sites_facilities'
  | 'teams_departments'
  | 'integrations'
  | 'analytics_metrics'
  | 'playbooks_tasks'
  | 'general';

export interface Question {
  id: string;
  type: QuestionType;
  section: SectionId;
  promptContext?: ExtractionContext; // LLM prompt to use for this question
  prompt: string;
  subtitle?: string;
  helper?: string;
  placeholder?: string;
  required: boolean;
  mapsTo: string | null;
  options?: ChoiceOption[];
  multiSelect?: boolean;
  accept?: string;
  minLength?: number;
  maxLength?: number;
  maxItems?: number; // For dynamic_list
  defaultAttributes?: any[];
  conditional?: {
    dependsOn: string;
    showIf: any;
  };
  clarificationOptions?: {
    question: string;
    options: Array<{ value: string; label: string }>;
  }; // For enriched_text
  cta?: string;
  industries?: string[]; // Filter by industry
  subIndustries?: string[]; // Filter by sub-industry
  skipIfCommitted?: boolean; // Skip if contract field is already committed
}

export interface ChoiceOption {
  value: string | number;
  label: string;
  description?: string;
  icon?: string;
}

export interface Section {
  id: SectionId;
  name: string;
  icon?: string;
  questions: string[];
}

export interface OnboardingUIState {
  currentStep: number;
  currentQuestionId: string;
  isGenerating: boolean;
  generationProgress: number;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved?: Date;
  visitedSteps: Set<number>;
  offlineMode: boolean;
  demoMode: boolean; // Demo mode for investor presentations
  devMode: boolean; // Dev mode: skip validation, allow free navigation
}

export interface OnboardingStore {
  contract: GenerationContractV1;
  uiState: OnboardingUIState;
  
  // Actions
  updateContract: (updates: Partial<GenerationContractV1>) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  jumpToStep: (step: number) => void;
  jumpToQuestion: (questionId: string) => void;
  
  // Generation
  startGeneration: () => void;
  updateGenerationProgress: (progress: number) => void;
  completeGeneration: () => void;
  
  // Persistence
  saveProgress: () => void;
  loadProgress: () => boolean;
  resetProgress: () => void;
  
  // Offline & Demo
  setOfflineMode: (offline: boolean) => void;
  setDemoMode: (enabled: boolean) => void;
  setDevMode: (enabled: boolean) => void;
  queueUpdate: (update: any) => void;
  flushQueue: () => void;
}

export interface StepConfig {
  questionId: string;
  isVisible: boolean;
  isRequired: boolean;
  isComplete: boolean;
  confidence: number;
}

export interface GenerationStage {
  name: string;
  duration: number;
  action: string;
  progress: { start: number; end: number };
}

