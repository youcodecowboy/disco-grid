import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface KPIGridConfigProps {
  onAdd: (config: any) => void;
}

export default function KPIGridConfig({ onAdd }: KPIGridConfigProps) {
  const [layout, setLayout] = useState<'2x2' | '1x4'>('2x2');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    'totalOrders',
    'completionRate',
    'inProduction',
    'onTimeDelivery',
  ]);

  const availableMetrics = [
    { id: 'totalOrders', label: 'Total Orders' },
    { id: 'completedOrders', label: 'Completed Orders' },
    { id: 'completionRate', label: 'Completion Rate' },
    { id: 'inProduction', label: 'In Production' },
    { id: 'overdueOrders', label: 'Overdue Orders' },
    { id: 'onTimeDelivery', label: 'On-Time Delivery' },
    { id: 'totalItems', label: 'Total Items' },
    { id: 'averageOrderValue', label: 'Avg Order Value' },
  ];

  const handleAdd = () => {
    onAdd({
      layout,
      metrics: selectedMetrics,
    });
  };

  const toggleMetric = (metricId: string) => {
    if (selectedMetrics.includes(metricId)) {
      setSelectedMetrics(selectedMetrics.filter(m => m !== metricId));
    } else {
      const maxMetrics = layout === '2x2' ? 4 : 4;
      if (selectedMetrics.length < maxMetrics) {
        setSelectedMetrics([...selectedMetrics, metricId]);
      }
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-slate-600 block mb-1.5">Layout</label>
        <div className="flex gap-2">
          <button
            onClick={() => setLayout('2x2')}
            className={`flex-1 px-3 py-2 text-xs rounded border ${
              layout === '2x2'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-slate-200 bg-white text-slate-700'
            }`}
          >
            2×2 Grid
          </button>
          <button
            onClick={() => setLayout('1x4')}
            className={`flex-1 px-3 py-2 text-xs rounded border ${
              layout === '1x4'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-slate-200 bg-white text-slate-700'
            }`}
          >
            1×4 Row
          </button>
        </div>
      </div>

      <div>
        <label className="text-xs text-slate-600 block mb-1.5">
          Metrics (select {layout === '2x2' ? '4' : '4'})
        </label>
        <div className="space-y-1">
          {availableMetrics.map((metric) => (
            <label
              key={metric.id}
              className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:bg-slate-50 px-2 py-1.5 rounded"
            >
              <input
                type="checkbox"
                checked={selectedMetrics.includes(metric.id)}
                onChange={() => toggleMetric(metric.id)}
                className="rounded border-slate-300"
              />
              {metric.label}
            </label>
          ))}
        </div>
      </div>

      <Button
        onClick={handleAdd}
        size="sm"
        className="w-full"
        disabled={selectedMetrics.length === 0}
      >
        Add to Report
      </Button>
    </div>
  );
}

