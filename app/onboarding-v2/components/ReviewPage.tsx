"use client"

/**
 * Review Page Component
 * 
 * Comprehensive review of all collected data before generation
 */

import { Edit2, Check, AlertCircle } from 'lucide-react';
import type { GenerationContractV1 } from '../types.contract';

interface ReviewPageProps {
  contract: Partial<GenerationContractV1>;
  onEdit: (sectionId: string, questionId?: string) => void;
}

export function ReviewPage({ contract, onEdit }: ReviewPageProps) {
  const sections = [
    {
      id: 'company',
      title: 'Company Profile',
      items: [
        { label: 'Company Name', value: contract.company?.name },
        { label: 'Industry', value: contract.company?.industry },
        { label: 'Team Size', value: contract.company?.size },
        { label: 'Facilities', value: contract.company?.facilities },
        { label: 'Locations', value: contract.company?.locations?.map(l => l.city).join(', ') },
      ],
    },
    {
      id: 'operations',
      title: 'Operations Setup',
      items: [
        { label: 'Operational Model', value: contract.operations?.model },
        { label: 'Monthly Capacity', value: contract.operations?.monthlyCapacity ? `${contract.operations.monthlyCapacity.toLocaleString()} units/month` : undefined },
        { label: 'Shifts Per Day', value: contract.operations?.shiftsPerDay },
        { label: 'Lead Time', value: contract.operations?.leadTimes?.avgDays ? `${contract.operations.leadTimes.avgDays} days` : undefined },
      ],
    },
    {
      id: 'items',
      title: 'Items & SKUs',
      items: [
        { label: 'Categories', value: contract.items?.categories?.join(', ') },
        { label: 'Tracking Level', value: contract.items?.trackingLevel },
        { label: 'Custom Attributes', value: contract.items?.attributes ? `${contract.items.attributes.length} attributes configured` : undefined },
      ],
    },
    {
      id: 'workflows',
      title: 'Workflows',
      items: [
        { label: 'Workflow Stages', value: contract.workflows?.stages ? `${contract.workflows.stages.length} stages` : 'Not configured' },
        { label: 'Total Duration', value: contract.workflows?.stages?.length ? `${contract.workflows.stages.reduce((sum, s) => sum + (s.durationHours || 0), 0)} hours` : undefined },
        { label: 'QA Checkpoints', value: contract.workflows?.stages?.filter(s => s.quality?.checkpoint).length || 0 },
      ],
    },
    {
      id: 'sites',
      title: 'Site Map',
      items: [
        { label: 'Floors', value: contract.sites?.floors ? `${contract.sites.floors.length} floors` : 'Not mapped' },
        { label: 'Total Zones', value: contract.sites?.floors?.reduce((sum, f) => sum + (f.zones?.length || 0), 0) },
      ],
    },
    {
      id: 'teams',
      title: 'Teams & Access',
      items: [
        { label: 'Departments', value: contract.teams?.departments ? `${contract.teams.departments.length} departments` : undefined },
        { label: 'Total Roles', value: contract.teams?.departments?.reduce((sum, d) => sum + (d.roles?.length || 0), 0) },
        { label: 'Floor App Enabled', value: contract.teams?.floorAppEnabled ? 'Yes' : 'No' },
      ],
    },
    {
      id: 'integrations',
      title: 'Integrations',
      items: [
        { label: 'Configured', value: contract.integrations ? 'Yes' : 'Not configured' },
        { label: 'Systems', value: contract.integrations?.systems ? `${contract.integrations.systems.length} systems` : undefined },
        { label: 'API Access', value: contract.integrations?.apiAccess ? 'Enabled' : 'Disabled' },
      ],
    },
    {
      id: 'analytics',
      title: 'Analytics & Metrics',
      items: [
        { label: 'Key Metrics', value: contract.analytics?.keyMetrics ? `${contract.analytics.keyMetrics.length} KPIs` : undefined },
        { label: 'Audiences', value: contract.analytics?.audience?.join(', ') },
        { label: 'Chart Preference', value: contract.analytics?.chartPreference },
        { label: 'Report Frequency', value: contract.analytics?.reportFrequency },
      ],
    },
  ];

  // Calculate completion
  const completedSections = sections.filter(section => 
    section.items.some(item => item.value !== undefined && item.value !== null && item.value !== '')
  ).length;
  
  const completionPercent = Math.round((completedSections / sections.length) * 100);

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Review Your Configuration</h2>
            <p className="text-blue-100 mb-4">
              You're almost done! Review your responses below before we generate your personalized workspace.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5" />
                <span className="font-semibold">{completedSections}/{sections.length} Sections Complete</span>
              </div>
              <div className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">
                {completionPercent}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section) => {
          const hasData = section.items.some(item => item.value !== undefined && item.value !== null && item.value !== '');
          const isEmpty = !hasData;

          return (
            <div
              key={section.id}
              className={`p-5 border-2 rounded-xl transition-all ${
                isEmpty
                  ? 'border-gray-200 bg-gray-50'
                  : 'border-green-200 bg-green-50'
              }`}
            >
              {/* Section Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {isEmpty ? (
                    <AlertCircle className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Check className="h-5 w-5 text-green-600" />
                  )}
                  <h3 className="font-semibold text-gray-900">{section.title}</h3>
                </div>
                <button
                  onClick={() => onEdit(section.id)}
                  className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                  title="Edit section"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>

              {/* Section Items */}
              <div className="space-y-2">
                {section.items.map((item, index) => (
                  <div key={index}>
                    {item.value !== undefined && item.value !== null && item.value !== '' ? (
                      <div>
                        <div className="text-xs text-gray-600 mb-0.5">{item.label}</div>
                        <div className="text-sm font-medium text-gray-900">{item.value}</div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic">
                        {item.label}: Not configured
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {isEmpty && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => onEdit(section.id)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Configure this section →
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Data Completeness Warning */}
      {completionPercent < 100 && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-yellow-900 mb-1">Some sections are incomplete</div>
              <div className="text-sm text-yellow-800">
                While you can proceed with generation, having more complete data will result in a better personalized workspace. 
                Consider filling out the remaining sections for the best experience.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generation Info */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <div className="font-medium text-blue-900 mb-1">What happens next?</div>
            <div className="text-sm text-blue-800">
              Once you click "Generate Application", we'll create your personalized workspace based on the configuration above. 
              This typically takes 15-20 seconds. You'll be able to customize everything further after generation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

