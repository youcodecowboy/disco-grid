"use client"

/**
 * Workflow Stages Builder for Onboarding
 * 
 * Drag-to-reorder workflow stages with durations and owners
 */

import { useState } from 'react';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';

export interface WorkflowStage {
  name: string;
  durationHours?: number;
  ownerDept?: string;
  quality?: {
    checkpoint: boolean;
    criteria?: string[];
  } | null;
}

interface WorkflowStagesBuilderProps {
  value?: WorkflowStage[];
  onChange: (stages: WorkflowStage[]) => void;
}

const DEFAULT_STAGES: WorkflowStage[] = [
  { name: 'Cutting', durationHours: 8, ownerDept: 'Production' },
  { name: 'Sewing', durationHours: 16, ownerDept: 'Production' },
  { name: 'Quality Control', durationHours: 4, ownerDept: 'Quality', quality: { checkpoint: true, criteria: [] } },
  { name: 'Packing', durationHours: 4, ownerDept: 'Logistics' },
  { name: 'Shipping', durationHours: 2, ownerDept: 'Logistics' },
];

const DEPARTMENTS = [
  'Production',
  'Quality',
  'Logistics',
  'Warehouse',
  'Engineering',
  'Planning',
  'Other',
];

export function WorkflowStagesBuilder({ value, onChange }: WorkflowStagesBuilderProps) {
  const stages = value && value.length > 0 ? value : DEFAULT_STAGES;
  const [newStage, setNewStage] = useState<Partial<WorkflowStage>>({
    name: '',
    durationHours: undefined,
    ownerDept: 'Production',
    quality: null,
  });
  const [expandedStage, setExpandedStage] = useState<number | null>(null);

  const addStage = () => {
    if (!newStage.name) return;

    const stage: WorkflowStage = {
      name: newStage.name,
      durationHours: newStage.durationHours,
      ownerDept: newStage.ownerDept || 'Production',
      quality: newStage.quality || null,
    };

    onChange([...stages, stage]);

    // Reset form
    setNewStage({
      name: '',
      durationHours: undefined,
      ownerDept: 'Production',
      quality: null,
    });
  };

  const removeStage = (index: number) => {
    const updated = stages.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateStage = (index: number, updates: Partial<WorkflowStage>) => {
    const updated = [...stages];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const moveStage = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const updated = [...stages];
      [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
      onChange(updated);
    } else if (direction === 'down' && index < stages.length - 1) {
      const updated = [...stages];
      [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      onChange(updated);
    }
  };

  const toggleQualityCheckpoint = (index: number) => {
    const stage = stages[index];
    if (stage.quality?.checkpoint) {
      updateStage(index, { quality: null });
    } else {
      updateStage(index, { quality: { checkpoint: true, criteria: [] } });
    }
  };

  const getTotalDuration = () => {
    return stages.reduce((sum, stage) => sum + (stage.durationHours || 0), 0);
  };

  return (
    <div className="space-y-4">
      {/* Summary Bar */}
      <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-6">
          <div>
            <div className="text-sm text-blue-900 font-medium">{stages.length} Stages</div>
            <div className="text-xs text-blue-700">Total Process</div>
          </div>
          <div className="border-l border-blue-300 pl-6">
            <div className="text-sm text-blue-900 font-medium">
              {getTotalDuration()}h
            </div>
            <div className="text-xs text-blue-700">Estimated Duration</div>
          </div>
          <div className="border-l border-blue-300 pl-6">
            <div className="text-sm text-blue-900 font-medium">
              {stages.filter(s => s.quality?.checkpoint).length} QA
            </div>
            <div className="text-xs text-blue-700">Quality Checkpoints</div>
          </div>
        </div>
      </div>

      {/* Stages List */}
      <div className="space-y-2">
        {stages.map((stage, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-colors"
          >
            {/* Stage Header */}
            <div className="flex items-center gap-3 p-3">
              {/* Reorder buttons */}
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => moveStage(index, 'up')}
                  disabled={index === 0}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 14l5-5 5 5z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => moveStage(index, 'down')}
                  disabled={index === stages.length - 1}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                </button>
              </div>

              {/* Stage number */}
              <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold text-gray-700">
                {index + 1}
              </div>

              {/* Stage name */}
              <div className="flex-1">
                <input
                  type="text"
                  value={stage.name}
                  onChange={(e) => updateStage(index, { name: e.target.value })}
                  className="w-full px-2 py-1 text-sm font-medium bg-transparent border-none focus:outline-none focus:ring-0"
                  placeholder="Stage name"
                />
              </div>

              {/* Duration */}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={stage.durationHours || ''}
                  onChange={(e) => updateStage(index, { durationHours: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                  className="w-16 px-2 py-1 text-xs text-center border border-gray-300 rounded"
                />
                <span className="text-xs text-gray-600">hours</span>
              </div>

              {/* Owner */}
              <select
                value={stage.ownerDept || ''}
                onChange={(e) => updateStage(index, { ownerDept: e.target.value })}
                className="px-3 py-1 text-xs border border-gray-300 rounded bg-white"
              >
                <option value="">No owner</option>
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>

              {/* QA Checkpoint toggle */}
              <button
                type="button"
                onClick={() => toggleQualityCheckpoint(index)}
                className={`p-1 rounded transition-colors ${
                  stage.quality?.checkpoint
                    ? 'text-green-600 hover:text-green-700'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                title={stage.quality?.checkpoint ? 'Quality checkpoint enabled' : 'Enable quality checkpoint'}
              >
                <CheckCircle2 className="h-5 w-5" />
              </button>

              {/* Expand/Delete buttons */}
              <button
                type="button"
                onClick={() => setExpandedStage(expandedStage === index ? null : index)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <svg className={`h-4 w-4 transition-transform ${expandedStage === index ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => removeStage(index)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Expanded Details */}
            {expandedStage === index && stage.quality?.checkpoint && (
              <div className="px-3 pb-3 pt-0 border-t border-gray-100">
                <div className="p-3 bg-green-50 rounded-lg">
                  <label className="block text-xs font-medium text-green-900 mb-2">
                    Quality Criteria (Optional)
                  </label>
                  <textarea
                    value={(stage.quality?.criteria || []).join('\n')}
                    onChange={(e) => {
                      const criteria = e.target.value.split('\n').filter(c => c.trim());
                      updateStage(index, {
                        quality: { checkpoint: true, criteria }
                      });
                    }}
                    placeholder="Enter criteria, one per line&#10;e.g.,&#10;Visual inspection passed&#10;Measurements within tolerance&#10;No defects found"
                    className="w-full px-3 py-2 text-xs border border-green-200 rounded bg-white"
                    rows={3}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Stage Form */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-end gap-2">
          <div className="flex-1 grid grid-cols-4 gap-2">
            <input
              type="text"
              value={newStage.name}
              onChange={(e) => setNewStage({ ...newStage, name: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && addStage()}
              placeholder="Stage name (e.g., Inspection)"
              className="col-span-2 px-3 py-2 text-sm border border-gray-300 rounded-lg"
            />
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={newStage.durationHours || ''}
                onChange={(e) => setNewStage({ ...newStage, durationHours: parseFloat(e.target.value) || 0 })}
                placeholder="Hours"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
              />
            </div>
            <select
              value={newStage.ownerDept}
              onChange={(e) => setNewStage({ ...newStage, ownerDept: e.target.value })}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
            >
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={addStage}
            disabled={!newStage.name}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Stage
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter or click "Add Stage" to add a new workflow step
        </p>
      </div>

      {/* Info box */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-900">
          <strong>Tip:</strong> Use the arrows to reorder stages. Add quality checkpoints to stages where you need to verify work before proceeding.
        </p>
      </div>
    </div>
  );
}

