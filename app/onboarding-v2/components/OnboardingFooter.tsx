"use client"

/**
 * Onboarding Footer Component
 * 
 * Sticky footer with navigation controls, progress bar, and demo mode toggle
 */

import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import type { SectionId } from '../types';

interface OnboardingFooterProps {
  currentStep: number;
  totalSteps: number;
  canGoBack: boolean;
  canGoNext: boolean;
  onBack: () => void;
  onNext: () => void;
  section: SectionId;
  validationError?: string;
  isExtracting?: boolean;
  demoMode?: boolean;
  onToggleDemoMode?: (enabled: boolean) => void;
}

export function OnboardingFooter({
  currentStep,
  totalSteps,
  canGoBack,
  canGoNext,
  onBack,
  onNext,
  section,
  validationError,
  isExtracting = false,
  demoMode = false,
  onToggleDemoMode,
}: OnboardingFooterProps) {
  // Get the current step within section (mock for now)
  const stepInSection = 1;
  const totalInSection = 5;
  
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
      {/* Progress bar */}
      <div className="h-1 bg-gray-200">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
      
      <div className="px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Left side - Demo mode toggle + Step indicator or validation error */}
          <div className="flex items-center gap-4">
            {/* Demo Mode Toggle */}
            {onToggleDemoMode && section !== 'review' && (
              <button
                onClick={() => onToggleDemoMode(!demoMode)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                  demoMode
                    ? 'bg-purple-50 border-purple-300 text-purple-700'
                    : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                }`}
                type="button"
              >
                <Sparkles className={`h-3.5 w-3.5 ${demoMode ? 'text-purple-600' : 'text-gray-500'}`} />
                <span>{demoMode ? 'Demo Mode: ON' : 'Demo Mode'}</span>
              </button>
            )}
            
            {/* Step indicator or validation error */}
            <div className="text-sm">
              {validationError ? (
                <div className="flex items-center gap-2 text-red-600">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">{validationError}</span>
                </div>
              ) : (
                <div className="text-gray-600">
                  Step <span className="font-semibold">{currentStep + 1}</span> of{' '}
                  <span className="font-semibold">{totalSteps}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Right side - Navigation buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={onBack}
                disabled={!canGoBack || isExtracting}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Go to previous question"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Back</span>
              </button>

              <button
                onClick={onNext}
                disabled={!canGoNext || !!validationError || isExtracting}
                className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Continue to next question"
              >
                {isExtracting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>AI Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Continue</span>
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
        </div>
      </div>
    </footer>
  );
}

