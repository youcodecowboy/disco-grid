"use client"

/**
 * Integrations Grid for Onboarding
 * 
 * ERP/MRP selection with logos and priority levels
 */

import { useState } from 'react';
import { Check } from 'lucide-react';

export interface Integration {
  system: string;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
}

interface IntegrationsGridProps {
  value?: Integration[];
  onChange: (integrations: Integration[]) => void;
}

const INTEGRATION_OPTIONS = [
  { id: 'sap', name: 'SAP ERP', category: 'Enterprise ERP', description: 'Full enterprise resource planning' },
  { id: 'netsuite', name: 'NetSuite', category: 'Cloud ERP', description: 'Cloud-based ERP and financials' },
  { id: 'odoo', name: 'Odoo', category: 'Open Source ERP', description: 'Modular business management' },
  { id: 'microsoft-dynamics', name: 'Microsoft Dynamics', category: 'Enterprise ERP', description: 'Business applications suite' },
  { id: 'oracle', name: 'Oracle ERP Cloud', category: 'Enterprise ERP', description: 'Complete cloud applications' },
  { id: 'sage', name: 'Sage', category: 'SMB ERP', description: 'Accounting and business management' },
  { id: 'infor', name: 'Infor CloudSuite', category: 'Industry ERP', description: 'Industry-specific ERP' },
  { id: 'ifs', name: 'IFS Applications', category: 'Enterprise ERP', description: 'Service-centric ERP' },
  { id: 'syspro', name: 'SYSPRO', category: 'Manufacturing ERP', description: 'Manufacturing and distribution' },
  { id: 'epicor', name: 'Epicor', category: 'Manufacturing ERP', description: 'Industry-focused ERP' },
  { id: 'fishbowl', name: 'Fishbowl', category: 'Inventory', description: 'Manufacturing inventory management' },
  { id: 'quickbooks', name: 'QuickBooks', category: 'Accounting', description: 'Accounting software' },
  { id: 'xero', name: 'Xero', category: 'Accounting', description: 'Online accounting' },
  { id: 'acumatica', name: 'Acumatica', category: 'Cloud ERP', description: 'Cloud ERP platform' },
  { id: 'shopify', name: 'Shopify', category: 'E-commerce', description: 'E-commerce platform' },
  { id: 'woocommerce', name: 'WooCommerce', category: 'E-commerce', description: 'WordPress e-commerce' },
  { id: 'salesforce', name: 'Salesforce', category: 'CRM', description: 'Customer relationship management' },
  { id: 'hubspot', name: 'HubSpot', category: 'CRM', description: 'Marketing and sales CRM' },
  { id: 'other', name: 'Other', category: 'Custom', description: 'Custom or proprietary system' },
];

const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-700 border-gray-300' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  { value: 'high', label: 'High', color: 'bg-red-100 text-red-700 border-red-300' },
];

export function IntegrationsGrid({ value = [], onChange }: IntegrationsGridProps) {
  const [notesFor, setNotesFor] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  const isSelected = (systemId: string) => {
    return value.some(integration => integration.system.toLowerCase() === systemId.toLowerCase());
  };

  const getIntegration = (systemId: string) => {
    return value.find(integration => integration.system.toLowerCase() === systemId.toLowerCase());
  };

  const toggleIntegration = (systemId: string, systemName: string) => {
    if (isSelected(systemId)) {
      // Remove
      onChange(value.filter(integration => integration.system.toLowerCase() !== systemId.toLowerCase()));
    } else {
      // Add with default priority
      onChange([...value, { system: systemName, priority: 'medium' }]);
    }
  };

  const updatePriority = (systemId: string, priority: 'low' | 'medium' | 'high') => {
    const updated = value.map(integration => 
      integration.system.toLowerCase() === systemId.toLowerCase()
        ? { ...integration, priority }
        : integration
    );
    onChange(updated);
  };

  const saveNotes = (systemId: string) => {
    const updated = value.map(integration =>
      integration.system.toLowerCase() === systemId.toLowerCase()
        ? { ...integration, notes: tempNotes }
        : integration
    );
    onChange(updated);
    setNotesFor(null);
    setTempNotes('');
  };

  // Group by category
  const categories = Array.from(new Set(INTEGRATION_OPTIONS.map(opt => opt.category)));

  return (
    <div className="space-y-6">
      {/* Summary */}
      {value.length > 0 && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-blue-900">
                {value.length} Integration{value.length !== 1 ? 's' : ''} Selected
              </div>
              <div className="text-xs text-blue-700 mt-1">
                {value.filter(i => i.priority === 'high').length} high priority,{' '}
                {value.filter(i => i.priority === 'medium').length} medium,{' '}
                {value.filter(i => i.priority === 'low').length} low
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integrations by Category */}
      {categories.map(category => {
        const options = INTEGRATION_OPTIONS.filter(opt => opt.category === category);
        
        return (
          <div key={category}>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">{category}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {options.map(option => {
                const selected = isSelected(option.id);
                const integration = getIntegration(option.id);

                return (
                  <div key={option.id}>
                    <button
                      type="button"
                      onClick={() => toggleIntegration(option.id, option.name)}
                      className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                        selected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="font-semibold text-sm text-gray-900">{option.name}</div>
                          <div className="text-xs text-gray-600 mt-0.5">{option.description}</div>
                        </div>
                        {selected && (
                          <div className="ml-2">
                            <Check className="h-5 w-5 text-blue-600" />
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Priority & Notes (shown when selected) */}
                    {selected && integration && (
                      <div className="mt-2 space-y-2">
                        {/* Priority Selector */}
                        <div className="flex items-center gap-1">
                          {PRIORITY_LEVELS.map(level => (
                            <button
                              key={level.value}
                              type="button"
                              onClick={() => updatePriority(option.id, level.value as any)}
                              className={`flex-1 px-2 py-1 text-xs font-medium border rounded transition-colors ${
                                integration.priority === level.value
                                  ? level.color
                                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              {level.label}
                            </button>
                          ))}
                        </div>

                        {/* Notes Toggle/Editor */}
                        {notesFor === option.id ? (
                          <div className="space-y-1">
                            <textarea
                              value={tempNotes}
                              onChange={(e) => setTempNotes(e.target.value)}
                              placeholder="e.g., Current version, contact person, API key location..."
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded resize-none"
                              rows={2}
                            />
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={() => saveNotes(option.id)}
                                className="flex-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setNotesFor(null);
                                  setTempNotes('');
                                }}
                                className="flex-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setNotesFor(option.id);
                              setTempNotes(integration.notes || '');
                            }}
                            className="w-full px-2 py-1 text-xs text-blue-600 hover:text-blue-700 underline text-left"
                          >
                            {integration.notes ? 'Edit notes' : '+ Add notes'}
                          </button>
                        )}

                        {integration.notes && notesFor !== option.id && (
                          <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                            {integration.notes}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Empty State */}
      {value.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <p className="text-gray-600 mb-2">No integrations selected</p>
          <p className="text-sm text-gray-500">Click any system above to select it</p>
        </div>
      )}

      {/* Info box */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-900">
          <strong>Tip:</strong> Select all systems you currently use or plan to integrate with. Priority levels help us plan the integration roadmap.
        </p>
      </div>
    </div>
  );
}

