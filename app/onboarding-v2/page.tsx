"use client"

/**
 * Onboarding V2 Main Page
 * 
 * Comprehensive onboarding system with natural language processing,
 * step-by-step progression, and personalized application generation.
 * 
 * Updated: Industry-specific routing with intelligent question engine
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from './store/onboardingStore';
import { OnboardingHeader } from './components/OnboardingHeader';
import { OnboardingFooter } from './components/OnboardingFooter';
import { StepContainer } from './components/StepContainer';
import { GenerationModal } from './components/GenerationModal';
import { WelcomeModal } from './components/WelcomeModal';
import { generateApplication } from './lib/generation';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { loadQuestionsForIndustry } from './lib/question-loader';
import { shouldShowQuestion } from './lib/question-engine';
import { getContractForIndustry } from './lib/contract-factory';
import { generateDemoContract } from './lib/demo-data';

export default function OnboardingV2Page() {
  const router = useRouter();
  const {
    contract,
    uiState,
    loadProgress,
    jumpToStep,
    updateContract,
    startGeneration,
    updateGenerationProgress,
    completeGeneration,
    setDemoMode,
    setDevMode,
  } = useOnboardingStore();
  
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showEntityConfirmation, setShowEntityConfirmation] = useState(false);
  const [isExtractingNLP, setIsExtractingNLP] = useState(false);
  
  // Load questions based on selected industry and sub-industry
  const allQuestions = loadQuestionsForIndustry(
    contract.company.industry,
    contract.company.subIndustry || undefined
  );
  
  // Filter to only visible questions using intelligent question engine
  // Type assertion needed due to different Question type definitions
  const visibleQuestions = allQuestions.filter(q => 
    shouldShowQuestion(q as any, contract, allQuestions as any)
  );
  
  // CRITICAL: Use visibleQuestions for navigation, not allQuestions
  // This ensures we only navigate through questions that should actually be shown
  const currentQuestion = visibleQuestions[uiState.currentStep];
  
  // Check if we should show entity confirmation after current NLP input
  const shouldShowConfirmation = 
    currentQuestion?.type === 'nlp_input' && 
    (contract as any).metadata?.extractedEntities?.length > 0;
  
  // Validate current question
  const [validationError, setValidationError] = useState<string | undefined>();
  
  const validateCurrentQuestion = () => {
    if (!currentQuestion || !currentQuestion.required) {
      return true;
    }
    
    if (!currentQuestion.mapsTo) {
      return true;
    }
    
    // For wildcard paths (like "company.*"), check metadata instead
    if (currentQuestion.mapsTo.includes('*')) {
      const metadataKey = `rawInput_${currentQuestion.id}`;
      const value = (contract as any).metadata?.[metadataKey];
      
      if (!value || value === '' || (typeof value === 'string' && value.trim().length < (currentQuestion.minLength || 10))) {
        setValidationError('Please provide more details (at least a few sentences)');
        return false;
      }
      
      setValidationError(undefined);
      return true;
    }
    
    // Get current value from contract
    const path = currentQuestion.mapsTo.split('.');
    let value: any = contract;
    
    for (const key of path) {
      value = value?.[key];
    }
    
    // Check if value is provided
    const isEmpty = value === undefined || 
                    value === null || 
                    value === '' ||
                    (Array.isArray(value) && value.length === 0);
    
    if (isEmpty) {
      setValidationError('This field is required');
      return false;
    }
    
    setValidationError(undefined);
    return true;
  };

  // Handle industry change - reload contract and questions
  useEffect(() => {
    const currentIndustry = contract.company.industry;
    
    // If industry just got selected (not empty), reload contract with industry-specific fields
    if (currentIndustry && !contract.manufacturingExt && !contract.constructionExt && !contract.defenseExt) {
      const industryContract = getContractForIndustry(
        currentIndustry,
        contract.company.subIndustry,
        contract.metadata.idempotencyKey
      );
      
      // Merge with existing contract data
      updateContract({
        ...industryContract,
        company: contract.company, // Keep existing company data
        metadata: contract.metadata, // Keep existing metadata
      });
    }
  }, [contract.company.industry, contract.company.subIndustry]);
  
  // Handle demo mode toggle
  const handleDemoModeToggle = (enabled: boolean) => {
    setDemoMode(enabled);
    
    if (enabled) {
      // Load demo contract
      const demoContract = generateDemoContract();
      updateContract(demoContract);
      
      // Jump to first question
      jumpToStep(0);
    } else {
      // Reset to empty contract
      const emptyContract = getContractForIndustry(
        contract.company.industry || 'manufacturing',
        contract.company.subIndustry,
        contract.metadata.idempotencyKey
      );
      updateContract(emptyContract);
      jumpToStep(0);
    }
  };
  
  // Handle dev mode toggle
  const handleDevModeToggle = (enabled: boolean) => {
    setDevMode(enabled);
  };
  
  // Check for saved progress on mount
  useEffect(() => {
    setMounted(true);
    
    const hasSavedProgress = loadProgress();
    if (hasSavedProgress) {
      setShowResumePrompt(true);
    }
  }, [loadProgress]);
  
  // Handle generation complete
  useEffect(() => {
    if (uiState.isGenerating && uiState.generationProgress === 100) {
      // Wait a moment then show welcome modal
      setTimeout(() => {
        completeGeneration();
        setShowWelcomeModal(true);
      }, 500);
    }
  }, [uiState.isGenerating, uiState.generationProgress, completeGeneration]);
  
  // Handle welcome modal close - redirect to playground
  const handleWelcomeClose = () => {
    setShowWelcomeModal(false);
    router.push('/playground');
  };
  
  // Calculate progress based on ALL loaded questions (not filtered)
  // This gives accurate total count regardless of filtering
  // Use visibleQuestions for total count - this is what user actually sees
  const totalQuestions = visibleQuestions.length;
  const progress = Math.round(((uiState.currentStep + 1) / totalQuestions) * 100);
  
  // Debug logging
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    const opsLoaded = allQuestions.filter(q => q.section === 'operations');
    const opsVisible = visibleQuestions.filter(q => q.section === 'operations');
    console.log(`[Onboarding] 📊 Question Summary:`);
    console.log(`  Total loaded: ${allQuestions.length}, Visible: ${visibleQuestions.length}`);
    console.log(`  Current step: ${uiState.currentStep + 1} of ${visibleQuestions.length}`);
    console.log(`  Current question: ${currentQuestion?.id || 'none'} (section: ${currentQuestion?.section || 'none'})`);
    console.log(`  Operations loaded: ${opsLoaded.length}, Operations visible: ${opsVisible.length}`);
    if (opsVisible.length > 0) {
      console.log(`  Operations question IDs (visible):`, opsVisible.map((q: any) => q.id).slice(0, 10));
    }
    if (opsLoaded.length !== opsVisible.length) {
      console.warn(`  ⚠️ ${opsLoaded.length - opsVisible.length} operations questions filtered out!`);
      const filteredOps = opsLoaded.filter(q => !opsVisible.includes(q));
      console.warn(`  Filtered out:`, filteredOps.map((q: any) => q.id));
    }
  }
  
  // Handle next
  const handleNext = async () => {
    // Skip validation in dev mode
    if (!uiState.devMode) {
      // Validate before proceeding
      if (!validateCurrentQuestion()) {
        return;
      }
    }

    // Check if this is the last question or review step
    if (currentQuestion?.id === 'review_confirm' || currentQuestion?.type === 'final_confirmation') {
      // Start generation process
      handleStartGeneration();
      return;
    }

    // Skip NLP extraction in dev mode
    if (!uiState.devMode) {
      // If current question is NLP input or enriched_text, extract entities first
      if (currentQuestion?.type === 'nlp_input' || currentQuestion?.type === 'enriched_text') {
        const extractFn = (window as any).__nlpExtractFunction;
        if (extractFn) {
          setIsExtractingNLP(true);
          
          try {
            const result = await extractFn();
            setIsExtractingNLP(false);
            
            if (result.success && result.entities.length > 0) {
              // Show entity confirmation
              setShowEntityConfirmation(true);
              return;
            }
          } catch (error) {
            console.error('Extraction error:', error);
            setIsExtractingNLP(false);
            // Continue anyway on error
          }
        }
      }
    }

    // If we just finished entity confirmation, clear the flag and extracted entities
    if (showEntityConfirmation) {
      setShowEntityConfirmation(false);
      // Clear extracted entities from metadata after confirmation
      updateContract({
        metadata: {
          ...(contract as any).metadata,
          extractedEntities: [],
        },
      } as any);
    }

    // Move to next visible question (simple increment since we're using visibleQuestions)
    if (uiState.currentStep < visibleQuestions.length - 1) {
      jumpToStep(uiState.currentStep + 1);
      setValidationError(undefined);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Reached end - mark onboarding as complete
      markOnboardingComplete();
    }
  };

  // Handle generation
  const handleStartGeneration = async () => {
    startGeneration();
    
    // Run the actual generation
    const result = await generateApplication(contract, (progress, status) => {
      updateGenerationProgress(progress);
    });
    
    if (result.success) {
      // Store generated data in contract metadata
      updateContract({
        metadata: {
          ...(contract as any).metadata,
          generatedData: result.data,
          generatedAt: new Date().toISOString(),
        },
      } as any);
    } else {
      console.error('Generation failed:', result.error);
    }
  };
  
  // Handle back
  const handleBack = () => {
    // If showing entity confirmation, go back to the NLP input
    if (showEntityConfirmation) {
      setShowEntityConfirmation(false);
      setValidationError(undefined);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Move to previous visible question (simple decrement since we're using visibleQuestions)
    if (uiState.currentStep > 0) {
      jumpToStep(uiState.currentStep - 1);
      setValidationError(undefined);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Clear validation error when question changes or value updates
  useEffect(() => {
    setValidationError(undefined);
  }, [uiState.currentStep, contract]);

  // Keyboard navigation
  useKeyboardNavigation({
    onNext: handleNext,
    onBack: handleBack,
    canGoNext: uiState.currentStep < visibleQuestions.length - 1,
    canGoBack: uiState.currentStep > 0,
    isModalOpen: uiState.isGenerating || showWelcomeModal || showResumePrompt,
  });
  
  // Loading state
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Resume prompt
  if (showResumePrompt) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Welcome back!
            </h2>
            <p className="text-slate-600 mb-6">
              We found your saved progress from last time.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => setShowResumePrompt(false)}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Resume where I left off
              </button>
              <button
                onClick={() => {
                  useOnboardingStore.getState().resetProgress();
                  setShowResumePrompt(false);
                }}
                className="w-full px-6 py-3 bg-white text-slate-700 border-2 border-slate-200 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
              >
                Start over
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {/* Demo Mode Banner */}
      {uiState.demoMode && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-6 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-semibold">Demo Mode Active</span>
              <span className="text-xs opacity-90">· Viewing Fashion Manufacturing Example: "Denim Collective"</span>
            </div>
            <button
              onClick={() => handleDemoModeToggle(false)}
              className="text-xs hover:underline opacity-90"
            >
              Exit Demo Mode
            </button>
          </div>
        </div>
      )}
      
      <div className={`min-h-screen flex flex-col bg-gray-50 ${uiState.demoMode ? 'pt-10' : ''}`} role="main" aria-label="Onboarding wizard">
            {/* Header */}
            <OnboardingHeader
              progress={progress}
              section={currentQuestion?.section || 'welcome'}
              allQuestions={allQuestions}
            />

            {/* Main content */}
            <main className="flex-1 pb-16 pt-28" role="form" aria-label="Onboarding form">
              {showEntityConfirmation ? (
                <StepContainer 
                  question={{ 
                    id: 'confirm_entities_dynamic',
                    type: 'confirm_entities',
                    section: currentQuestion?.section || 'company',
                    prompt: 'Confirm Extracted Information',
                    subtitle: 'Review and edit the information we detected',
                    helper: 'You can edit any field or remove items that don\'t look right.',
                    required: false,
                    mapsTo: null,
                  } as any}
                  allQuestions={allQuestions}
                />
              ) : (
                <StepContainer question={currentQuestion} allQuestions={allQuestions} />
              )}
            </main>

            {/* Footer */}
            <OnboardingFooter
              currentStep={uiState.currentStep}
              totalSteps={visibleQuestions.length}
              canGoBack={uiState.currentStep > 0}
              canGoNext={uiState.currentStep < visibleQuestions.length - 1}
              onBack={handleBack}
              onNext={handleNext}
              section={currentQuestion?.section || 'welcome'}
              validationError={validationError}
              isExtracting={isExtractingNLP}
              demoMode={uiState.demoMode}
              onToggleDemoMode={handleDemoModeToggle}
              devMode={uiState.devMode}
              onToggleDevMode={handleDevModeToggle}
            />

            {/* Keyboard shortcut hint */}
            {!uiState.isGenerating && !showWelcomeModal && (
              <div 
                className="fixed bottom-20 right-6 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-75 pointer-events-none"
                role="status"
                aria-label="Keyboard shortcuts"
              >
                <div className="flex items-center gap-3">
                  <span>←/→ Navigate</span>
                  <span>Enter Continue</span>
                </div>
              </div>
            )}
          </div>
      
      {/* Generation Modal */}
      {uiState.isGenerating && (
        <GenerationModal
          progress={uiState.generationProgress}
          contract={contract}
        />
      )}
      
      {/* Welcome Modal */}
      {showWelcomeModal && (
        <WelcomeModal
          contract={contract}
          onClose={handleWelcomeClose}
        />
      )}
    </>
  );
}

