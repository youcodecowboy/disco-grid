"use client"

/**
 * Lego Attribute Builder for Onboarding
 * 
 * Additive UI for building custom attributes - "Lego style" pattern
 */

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export interface Attribute {
  key: string;
  type: 'text' | 'number' | 'date' | 'dropdown' | 'checkbox';
  required: boolean;
  values?: string[];
}

interface LegoAttributeBuilderProps {
  value?: Attribute[];
  onChange: (attributes: Attribute[]) => void;
  defaults?: Attribute[];
}

const ATTRIBUTE_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'checkbox', label: 'Checkbox' },
];

const DEFAULT_ATTRIBUTES: Attribute[] = [
  { key: 'Name', type: 'text', required: true },
  { key: 'Code', type: 'text', required: true },
  { key: 'Quantity', type: 'number', required: true },
];

export function LegoAttributeBuilder({ value, onChange, defaults = DEFAULT_ATTRIBUTES }: LegoAttributeBuilderProps) {
  const attributes = value || defaults;
  const [newAttribute, setNewAttribute] = useState<Partial<Attribute>>({
    key: '',
    type: 'text',
    required: false,
  });
  const [editingDropdownIndex, setEditingDropdownIndex] = useState<number | null>(null);
  const [dropdownValues, setDropdownValues] = useState('');

  const addAttribute = () => {
    if (!newAttribute.key) return;

    const attribute: Attribute = {
      key: newAttribute.key,
      type: newAttribute.type || 'text',
      required: newAttribute.required || false,
      values: newAttribute.type === 'dropdown' ? [] : undefined,
    };

    onChange([...attributes, attribute]);

    // Reset form
    setNewAttribute({
      key: '',
      type: 'text',
      required: false,
    });
  };

  const removeAttribute = (index: number) => {
    const updated = attributes.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateAttribute = (index: number, updates: Partial<Attribute>) => {
    const updated = [...attributes];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const moveAttribute = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const updated = [...attributes];
      [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
      onChange(updated);
    } else if (direction === 'down' && index < attributes.length - 1) {
      const updated = [...attributes];
      [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      onChange(updated);
    }
  };

  const saveDropdownValues = (index: number) => {
    const values = dropdownValues.split(',').map(v => v.trim()).filter(v => v);
    updateAttribute(index, { values });
    setEditingDropdownIndex(null);
    setDropdownValues('');
  };

  return (
    <div className="space-y-4">
      {/* Attributes List */}
      {attributes.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <p className="text-gray-600 mb-2">No attributes added yet</p>
          <p className="text-sm text-gray-500">Add your first custom attribute below</p>
        </div>
      ) : (
        <div className="space-y-2">
          {attributes.map((attr, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 border rounded-lg bg-white transition-colors ${
                defaults.some(d => d.key === attr.key)
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Drag handle */}
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => moveAttribute(index, 'up')}
                  disabled={index === 0}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 14l5-5 5 5z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => moveAttribute(index, 'down')}
                  disabled={index === attributes.length - 1}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                </button>
              </div>

              {/* Attribute name */}
              <div className="flex-1">
                <input
                  type="text"
                  value={attr.key}
                  onChange={(e) => updateAttribute(index, { key: e.target.value })}
                  className="w-full px-2 py-1 text-sm font-medium bg-transparent border-none focus:outline-none focus:ring-0"
                  placeholder="Attribute name"
                />
              </div>

              {/* Type selector */}
              <select
                value={attr.type}
                onChange={(e) => updateAttribute(index, { type: e.target.value as Attribute['type'] })}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded bg-white"
              >
                {ATTRIBUTE_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>

              {/* Dropdown values editor */}
              {attr.type === 'dropdown' && (
                <>
                  {editingDropdownIndex === index ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={dropdownValues}
                        onChange={(e) => setDropdownValues(e.target.value)}
                        placeholder="Option 1, Option 2, Option 3"
                        className="px-2 py-1 text-xs border border-gray-300 rounded w-48"
                      />
                      <button
                        type="button"
                        onClick={() => saveDropdownValues(index)}
                        className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingDropdownIndex(index);
                        setDropdownValues((attr.values || []).join(', '));
                      }}
                      className="px-2 py-1 text-xs text-blue-600 hover:text-blue-700 underline"
                    >
                      {attr.values && attr.values.length > 0 
                        ? `${attr.values.length} options` 
                        : 'Add options'}
                    </button>
                  )}
                </>
              )}

              {/* Required toggle */}
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={attr.required}
                  onChange={(e) => updateAttribute(index, { required: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-xs text-gray-600">Required</span>
              </label>

              {/* Delete button (only for non-default attributes) */}
              {!defaults.some(d => d.key === attr.key) && (
                <button
                  type="button"
                  onClick={() => removeAttribute(index)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Attribute Form */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newAttribute.key}
            onChange={(e) => setNewAttribute({ ...newAttribute, key: e.target.value })}
            onKeyPress={(e) => e.key === 'Enter' && addAttribute()}
            placeholder="Attribute name (e.g., Serial Number, Color, Size)"
            className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
          <select
            value={newAttribute.type}
            onChange={(e) => setNewAttribute({ ...newAttribute, type: e.target.value as Attribute['type'] })}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
          >
            {ATTRIBUTE_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          <label className="flex items-center gap-1.5 whitespace-nowrap cursor-pointer">
            <input
              type="checkbox"
              checked={newAttribute.required}
              onChange={(e) => setNewAttribute({ ...newAttribute, required: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">Required</span>
          </label>
          <button
            type="button"
            onClick={addAttribute}
            disabled={!newAttribute.key}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Attribute
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter or click "Add Attribute" to add a new field
        </p>
      </div>

      {/* Info box */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-900">
          <strong>Tip:</strong> These attributes will appear on every item. You can reorder them using the arrows, and make them required to ensure data consistency.
        </p>
      </div>
    </div>
  );
}

