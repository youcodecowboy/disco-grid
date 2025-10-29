"use client"

/**
 * Metrics Selector for Onboarding
 * 
 * Industry-specific KPI recommendations for Analytics section
 */

import { useState } from 'react';
import { Check, BarChart3 } from 'lucide-react';

export interface SelectedMetric {
  id: string;
  name: string;
  category: string;
  priority: 'must-have' | 'nice-to-have';
}

interface MetricsSelectorProps {
  value?: SelectedMetric[];
  onChange: (metrics: SelectedMetric[]) => void;
  industry?: string;
}

const METRICS = [
  // Production
  { id: 'otd', name: 'On-Time Delivery (OTD)', category: 'Production', description: '% of orders delivered on time', industries: ['manufacturing', 'construction', 'logistics'] },
  { id: 'cycle-time', name: 'Cycle Time', category: 'Production', description: 'Average time from start to finish', industries: ['manufacturing', 'logistics'] },
  { id: 'throughput', name: 'Throughput', category: 'Production', description: 'Units produced per period', industries: ['manufacturing'] },
  { id: 'capacity-utilization', name: 'Capacity Utilization', category: 'Production', description: '% of capacity being used', industries: ['manufacturing', 'logistics'] },
  { id: 'downtime', name: 'Equipment Downtime', category: 'Production', description: 'Hours of unplanned downtime', industries: ['manufacturing'] },
  { id: 'wip', name: 'Work In Progress (WIP)', category: 'Production', description: 'Items currently in production', industries: ['manufacturing'] },

  // Quality
  { id: 'first-pass-yield', name: 'First Pass Yield', category: 'Quality', description: '% passing QA on first attempt', industries: ['manufacturing'] },
  { id: 'defect-rate', name: 'Defect Rate', category: 'Quality', description: '% of items with defects', industries: ['manufacturing', 'construction'] },
  { id: 'rework-rate', name: 'Rework Rate', category: 'Quality', description: '% requiring rework', industries: ['manufacturing', 'construction'] },
  { id: 'customer-returns', name: 'Customer Returns', category: 'Quality', description: '% of products returned', industries: ['manufacturing'] },
  { id: 'qa-inspection-time', name: 'QA Inspection Time', category: 'Quality', description: 'Average QA duration', industries: ['manufacturing', 'construction'] },

  // Inventory
  { id: 'inventory-turnover', name: 'Inventory Turnover', category: 'Inventory', description: 'How often inventory is sold/used', industries: ['manufacturing', 'logistics'] },
  { id: 'stock-accuracy', name: 'Stock Accuracy', category: 'Inventory', description: '% accuracy of inventory counts', industries: ['manufacturing', 'logistics'] },
  { id: 'shortage-rate', name: 'Material Shortage Rate', category: 'Inventory', description: '% of shortages causing delays', industries: ['manufacturing'] },
  { id: 'lead-time-variance', name: 'Lead Time Variance', category: 'Inventory', description: 'Deviation from expected lead times', industries: ['manufacturing', 'logistics'] },

  // Operations
  { id: 'labor-efficiency', name: 'Labor Efficiency', category: 'Operations', description: 'Actual vs. standard hours', industries: ['manufacturing', 'construction'] },
  { id: 'cost-per-unit', name: 'Cost Per Unit', category: 'Operations', description: 'Average cost to produce one unit', industries: ['manufacturing'] },
  { id: 'order-fulfillment', name: 'Order Fulfillment Rate', category: 'Operations', description: '% of orders filled completely', industries: ['manufacturing', 'logistics'] },
  { id: 'overtime-hours', name: 'Overtime Hours', category: 'Operations', description: 'Hours worked beyond standard', industries: ['manufacturing', 'construction', 'logistics'] },

  // Safety
  { id: 'safety-incidents', name: 'Safety Incidents', category: 'Safety', description: 'Number of incidents per period', industries: ['manufacturing', 'construction', 'logistics'] },
  { id: 'near-misses', name: 'Near Misses', category: 'Safety', description: 'Number of near-miss events', industries: ['manufacturing', 'construction'] },
  { id: 'days-since-incident', name: 'Days Since Last Incident', category: 'Safety', description: 'Consecutive safe days', industries: ['manufacturing', 'construction', 'logistics'] },

  // Logistics
  { id: 'shipping-accuracy', name: 'Shipping Accuracy', category: 'Logistics', description: '% of orders shipped correctly', industries: ['logistics', 'manufacturing'] },
  { id: 'dock-to-stock', name: 'Dock-to-Stock Time', category: 'Logistics', description: 'Time from receiving to storage', industries: ['logistics'] },
  { id: 'fill-rate', name: 'Fill Rate', category: 'Logistics', description: '% of orders filled from stock', industries: ['logistics', 'manufacturing'] },
];

const PRIORITY_LABELS = [
  { value: 'must-have', label: 'Must Have', color: 'bg-red-100 text-red-700 border-red-300' },
  { value: 'nice-to-have', label: 'Nice to Have', color: 'bg-blue-100 text-blue-700 border-blue-300' },
];

export function MetricsSelector({ value = [], onChange, industry = 'manufacturing' }: MetricsSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(METRICS.map(m => m.category)))];

  // Filter metrics by selected category and industry
  const filteredMetrics = METRICS.filter(metric => {
    const categoryMatch = selectedCategory === 'all' || metric.category === selectedCategory;
    const industryMatch = metric.industries.includes(industry);
    return categoryMatch && industryMatch;
  });

  const isSelected = (metricId: string) => {
    return value.some(m => m.id === metricId);
  };

  const getMetric = (metricId: string) => {
    return value.find(m => m.id === metricId);
  };

  const toggleMetric = (metricId: string, metricName: string, category: string) => {
    if (isSelected(metricId)) {
      // Remove
      onChange(value.filter(m => m.id !== metricId));
    } else {
      // Add with default priority
      onChange([...value, { id: metricId, name: metricName, category, priority: 'nice-to-have' }]);
    }
  };

  const updatePriority = (metricId: string, priority: 'must-have' | 'nice-to-have') => {
    const updated = value.map(m => 
      m.id === metricId ? { ...m, priority } : m
    );
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      {value.length > 0 && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-sm font-medium text-green-900">{value.length} Metrics</div>
                  <div className="text-xs text-green-700">Selected for tracking</div>
                </div>
              </div>
              <div className="border-l border-green-300 pl-6">
                <div className="text-sm font-medium text-green-900">
                  {value.filter(m => m.priority === 'must-have').length} Must-Have
                </div>
                <div className="text-xs text-green-700">Critical KPIs</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat === 'all' ? 'All Categories' : cat}
          </button>
        ))}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filteredMetrics.map(metric => {
          const selected = isSelected(metric.id);
          const selectedMetric = getMetric(metric.id);

          return (
            <div key={metric.id}>
              <button
                type="button"
                onClick={() => toggleMetric(metric.id, metric.name, metric.category)}
                className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                  selected
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-gray-900 mb-1">{metric.name}</div>
                    <div className="text-xs text-gray-600">{metric.description}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      <span className="px-2 py-0.5 bg-gray-100 rounded">{metric.category}</span>
                    </div>
                  </div>
                  {selected && (
                    <div className="ml-2">
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                  )}
                </div>
              </button>

              {/* Priority (shown when selected) */}
              {selected && selectedMetric && (
                <div className="mt-2 flex items-center gap-2">
                  {PRIORITY_LABELS.map(priority => (
                    <button
                      key={priority.value}
                      type="button"
                      onClick={() => updatePriority(metric.id, priority.value as any)}
                      className={`flex-1 px-3 py-1.5 text-xs font-medium border rounded transition-colors ${
                        selectedMetric.priority === priority.value
                          ? priority.color
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {priority.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredMetrics.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <p className="text-gray-600 mb-2">No metrics in this category for your industry</p>
          <p className="text-sm text-gray-500">Try selecting a different category</p>
        </div>
      )}

      {/* Info box */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-900">
          <strong>Tip:</strong> Start with 5-10 "must-have" metrics. You can add more later as your analytics needs grow.
        </p>
      </div>
    </div>
  );
}

