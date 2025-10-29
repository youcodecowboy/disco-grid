"use client"

/**
 * Onboarding Header Component
 * 
 * Standard header matching the app's design
 */

import { useOnboardingStore } from '../store/onboardingStore';
import { Check, X } from 'lucide-react';
import type { SectionId } from '../types';
import questionsData from '../content/questions.en.json';

interface OnboardingHeaderProps {
  progress: number;
  section: SectionId;
}

const SECTIONS: Array<{ id: SectionId; name: string }> = [
  { id: 'company', name: 'Company' },
  { id: 'operations', name: 'Operations' },
  { id: 'items', name: 'Items' },
  { id: 'workflows', name: 'Workflows' },
  { id: 'sites', name: 'Sites' },
  { id: 'teams', name: 'Teams' },
  { id: 'integrations', name: 'Integrations' },
  { id: 'analytics', name: 'Analytics' },
  { id: 'review', name: 'Review' },
];

export function OnboardingHeader({ progress, section }: OnboardingHeaderProps) {
  const { uiState, jumpToQuestion, jumpToStep, getSectionCompletion } = useOnboardingStore();
  const questions = Object.values(questionsData);
  
  // Format last saved time
  const getTimeSince = (date?: Date) => {
    if (!date) return '';
    
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 120) return '1 min ago';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };
  
  // Check which sections are completed
  const completedSections = new Set<SectionId>();
  SECTIONS.forEach((s) => {
    const status = getSectionCompletion(s.id, questions);
    if (status.completed) {
      completedSections.add(s.id);
    }
  });
  
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Main header bar */}
      <div className="flex h-14 items-center justify-between px-6">
        {/* Left side - Logo and title */}
        <div className="flex items-center gap-4">
          <img src="/groovy-logo.png" alt="Groovy" className="h-8" />
          <div className="border-l border-gray-300 pl-4">
            <h1 className="text-sm font-semibold text-gray-900">Workspace Setup</h1>
          </div>
        </div>
        
        {/* Right side - Save status and progress */}
        <div className="flex items-center gap-6">
          {/* Auto-save indicator */}
          <div className="flex items-center gap-2 text-xs text-gray-600">
            {uiState.saveStatus === 'saving' && (
              <>
                <div className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Saving...</span>
              </>
            )}
            
            {uiState.saveStatus === 'saved' && (
              <>
                <Check className="h-3 w-3 text-green-600" />
                <span>Saved {getTimeSince(uiState.lastSaved)}</span>
              </>
            )}
            
            {uiState.saveStatus === 'error' && (
              <>
                <X className="h-3 w-3 text-red-600" />
                <span>Save failed</span>
              </>
            )}
          </div>
          
          {/* Progress indicator */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">
              {progress}%
            </span>
            <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Section navigation tabs */}
      {section !== 'welcome' && (
        <div className="flex items-center gap-1.5 px-6 py-2.5 border-t border-gray-100 overflow-x-auto bg-gray-50">
          {SECTIONS.map((s, index) => {
            const isActive = s.id === section;
            const isCompleted = completedSections.has(s.id);
            const isAccessible = isCompleted || isActive || index === 0;
            
            return (
              <button
                key={s.id}
                onClick={() => {
                  if (isAccessible) {
                    // Find first question in this section and navigate to it
                    const firstQuestionIndex = questions.findIndex((q: any) => q.section === s.id);
                    if (firstQuestionIndex !== -1) {
                      jumpToStep(firstQuestionIndex);
                    }
                  }
                }}
                disabled={!isAccessible}
                className={`
                  px-4 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap
                  ${isActive 
                    ? 'bg-blue-100 text-blue-700' 
                    : isCompleted
                    ? 'bg-green-50 text-green-700 hover:bg-green-100'
                    : isAccessible
                    ? 'text-gray-600 hover:bg-gray-100'
                    : 'text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                {s.name}
                {isCompleted && ' ✓'}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}

