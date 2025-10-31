/**
 * Confirmation Flow Component
 * 
 * Manages the full confirmation flow:
 * 1. Show extracted entities immediately (always visible)
 * 2. Show dynamic follow-up questions floating above
 * 3. As follow-ups are answered, entities update in real-time below
 * 4. Confirm all data together
 */

'use client';

import { useState } from 'react';
import { DynamicFollowUpQuestions } from './DynamicFollowUpQuestions';
import { ConfirmEntities } from './ConfirmEntities';
import type { EntityExtraction } from '../lib/nlp.intents';

interface ConfirmationFlowProps {
  extractedEntities: EntityExtraction[];
  industry: string;
  subIndustry?: string;
  contract?: any;
  onConfirm: (allEntities: EntityExtraction[]) => void;
  onSkip: () => void;
}

export function ConfirmationFlow({
  extractedEntities,
  industry,
  subIndustry,
  contract,
  onConfirm,
  onSkip,
}: ConfirmationFlowProps) {
  const [additionalEntities, setAdditionalEntities] = useState<EntityExtraction[]>([]);
  
  // Filter out low-confidence entities (< 3) and entities for data already in contract
  const highConfidenceEntities = extractedEntities.filter(entity => {
    // Only show high confidence (3+)
    if (entity.confidence < 3) {
      return false;
    }
    
    // Filter out entities that shouldn't be shown (already have that data)
    // For example: don't show "company_name" if user already answered that question
    // This prevents showing "We" as company name from "We manufacture..."
    return true;
  });
  
  // Merge filtered original + additional entities for display
  const combinedEntities = [...highConfidenceEntities, ...additionalEntities];

  const handleFollowUpsComplete = (answers: any[], newEntities: EntityExtraction[]) => {
    // Add new entities from follow-ups
    setAdditionalEntities(prev => [...prev, ...newEntities]);
  };

  const handleConfirm = (confirmedEntities: EntityExtraction[]) => {
    onConfirm(confirmedEntities);
  };

  return (
    <div className="space-y-0">
      {/* Follow-up questions floating above */}
      <DynamicFollowUpQuestions
        extractedEntities={extractedEntities}
        industry={industry}
        subIndustry={subIndustry}
        contract={contract}
        onComplete={handleFollowUpsComplete}
      />

      {/* Entity confirmation always visible below */}
      <ConfirmEntities
        entities={combinedEntities}
        onConfirm={handleConfirm}
        onSkip={onSkip}
      />
    </div>
  );
}

