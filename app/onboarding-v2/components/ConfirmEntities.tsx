"use client"

/**
 * Confirm Entities Component
 * 
 * Review and edit NLP-extracted entities before applying to contract
 */

import { useState, useEffect } from 'react';
import { Check, X, Edit2, Trash2 } from 'lucide-react';
import type { EntityExtraction } from '../lib/nlp.intents';
import type { Confidence } from '../types.contract';

interface ConfirmEntitiesProps {
  entities: EntityExtraction[];
  onConfirm: (confirmedEntities: EntityExtraction[]) => void;
  onSkip: () => void;
}

interface EditableEntity extends EntityExtraction {
  id: string;
  isEditing: boolean;
  isDeleted: boolean;
}

export function ConfirmEntities({ entities, onConfirm, onSkip }: ConfirmEntitiesProps) {
  const [editableEntities, setEditableEntities] = useState<EditableEntity[]>([]);


  // Initialize editable entities from props
  useEffect(() => {
    setEditableEntities(
      entities.map((entity, index) => ({
        ...entity,
        id: `entity-${index}`,
        isEditing: false,
        isDeleted: false,
      }))
    );
  }, [entities]);

  const getConfidenceColor = (confidence: Confidence) => {
    if (confidence >= 3) return 'bg-green-100 border-green-300 text-green-800';
    if (confidence >= 2) return 'bg-blue-100 border-blue-300 text-blue-800';
    return 'bg-yellow-100 border-yellow-300 text-yellow-800';
  };

  const getConfidenceLabel = (confidence: Confidence) => {
    if (confidence >= 3) return 'High';
    if (confidence >= 2) return 'Medium';
    return 'Low';
  };

  const getProvenanceBadge = (provenance?: string) => {
    if (provenance === 'llm') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
          <span>🤖</span>
          <span>AI</span>
        </span>
      );
    } else if (provenance === 'keyword') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
          <span>🔤</span>
          <span>Pattern</span>
        </span>
      );
    }
    return null;
  };

  const getEntityTypeLabel = (type: string): string => {
    const labels: { [key: string]: string } = {
      company: 'Company Name',
      product: 'Product Type',
      industry: 'Industry',
      location: 'Location',
      team_size: 'Team Size',
      capacity: 'Monthly Capacity',
      ops_model: 'Operations Model',
      shifts: 'Shifts per Day',
      lead_time: 'Lead Time',
      department: 'Department',
      workflow_stage: 'Workflow Stage',
      kpi: 'KPI',
    };
    
    return labels[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatValue = (entity: EditableEntity): string => {
    if (typeof entity.value === 'object') {
      if (entity.value.city) {
        return entity.value.state 
          ? `${entity.value.city}, ${entity.value.state}`
          : entity.value.city;
      }
      return JSON.stringify(entity.value);
    }
    return String(entity.value);
  };

  const handleToggleEdit = (id: string) => {
    setEditableEntities(entities =>
      entities.map(e =>
        e.id === id ? { ...e, isEditing: !e.isEditing } : e
      )
    );
  };

  const handleUpdateValue = (id: string, newValue: string) => {
    setEditableEntities(entities =>
      entities.map(e =>
        e.id === id ? { ...e, value: newValue } : e
      )
    );
  };

  const handleUpdateConfidence = (id: string, newConfidence: Confidence) => {
    setEditableEntities(entities =>
      entities.map(e =>
        e.id === id ? { ...e, confidence: newConfidence } : e
      )
    );
  };

  const handleDelete = (id: string) => {
    setEditableEntities(entities =>
      entities.map(e =>
        e.id === id ? { ...e, isDeleted: true } : e
      )
    );
  };

  const handleUndo = (id: string) => {
    setEditableEntities(entities =>
      entities.map(e =>
        e.id === id ? { ...e, isDeleted: false } : e
      )
    );
  };

  const handleConfirm = () => {
    const confirmedEntities = editableEntities
      .filter(e => !e.isDeleted)
      .map(({ id, isEditing, isDeleted, ...entity }) => entity);
    
    onConfirm(confirmedEntities);
  };

  const activeEntities = editableEntities.filter(e => !e.isDeleted);
  const deletedEntities = editableEntities.filter(e => e.isDeleted);
  const hasChanges = deletedEntities.length > 0 || editableEntities.some(e => e.isEditing);

  if (editableEntities.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <X className="h-8 w-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No entities detected
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            We couldn't extract structured information from your input.
            <br />
            Try being more specific or continue to fill in manually.
          </p>
          <button
            onClick={onSkip}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Continue manually
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Confirm Extracted Information
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Review the information we extracted. You can edit or remove any item.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">
                {activeEntities.length} {activeEntities.length === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>
        </div>

        {/* Entity List */}
        <div className="divide-y divide-gray-200">
          {activeEntities.map((entity) => (
            <div
              key={entity.id}
              className={`p-5 transition-colors ${
                entity.isEditing ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Type Label */}
                <div className="flex-shrink-0 w-36">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {getEntityTypeLabel(entity.type)}
                  </div>
                </div>

                {/* Value */}
                <div className="flex-1">
                  {entity.isEditing ? (
                    <input
                      type="text"
                      value={formatValue(entity)}
                      onChange={(e) => handleUpdateValue(entity.id, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-blue-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <div className="text-base font-medium text-gray-900">
                      {formatValue(entity)}
                    </div>
                  )}
                  
                  {entity.rawText && (
                    <div className="text-xs text-gray-500 mt-1">
                      From: "{entity.rawText}"
                    </div>
                  )}
                </div>

                {/* Confidence and Provenance */}
                <div className="flex-shrink-0 flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${getConfidenceColor(entity.confidence)}`}>
                    {entity.confidence >= 3 && <Check className="h-3 w-3" />}
                    {getConfidenceLabel(entity.confidence)}
                  </span>
                  {getProvenanceBadge(entity.provenance)}
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 flex items-center gap-1">
                  <button
                    onClick={() => handleToggleEdit(entity.id)}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Edit value"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(entity.id)}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Deleted Items (undo option) */}
        {deletedEntities.length > 0 && (
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-3">
            <div className="text-xs text-gray-600 mb-2">
              Removed items ({deletedEntities.length}):
            </div>
            <div className="flex flex-wrap gap-2">
              {deletedEntities.map((entity) => (
                <button
                  key={entity.id}
                  onClick={() => handleUndo(entity.id)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-300 rounded-md text-xs text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <span className="line-through">{getEntityTypeLabel(entity.type)}</span>
                  <span className="text-blue-600 font-medium">Undo</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onSkip}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              Skip and enter manually
            </button>
            <div className="flex items-center gap-3">
              {hasChanges && (
                <span className="text-xs text-gray-600">
                  You have unsaved changes
                </span>
              )}
              <button
                onClick={handleConfirm}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Check className="h-4 w-4" />
                <span>Confirm & Apply</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        These values will be automatically filled into the relevant sections.
        <br />
        You can always edit them later in the onboarding process.
      </div>
    </div>
  );
}

