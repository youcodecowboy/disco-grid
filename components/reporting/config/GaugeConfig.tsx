import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface GaugeConfigProps {
  onAdd: (config: any) => void;
}

export default function GaugeConfig({ onAdd }: GaugeConfigProps) {
  const [metric, setMetric] = useState('completion_rate');
  const [title, setTitle] = useState('');

  const metricOptions = [
    { value: 'completion_rate', label: 'Completion Rate', max: 100 },
    { value: 'efficiency', label: 'Efficiency', max: 100 },
    { value: 'on_time_delivery', label: 'On-Time Delivery', max: 100 },
    { value: 'quality_score', label: 'Quality Score', max: 100 },
  ];

  const handleAdd = () => {
    const selectedMetric = metricOptions.find(m => m.value === metric);
    onAdd({
      metric,
      title: title || selectedMetric?.label,
      max: selectedMetric?.max || 100,
    });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-slate-600 block mb-1.5">Metric</label>
        <Select value={metric} onValueChange={setMetric}>
          <SelectTrigger className="w-full text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {metricOptions.map((option) => (
              <SelectItem key={option.value} value={option.value} className="text-xs">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-xs text-slate-600 block mb-1.5">
          Title (optional)
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Auto-generated"
          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="text-xs text-slate-500">
        Displays a single metric with target visualization
      </div>

      <Button onClick={handleAdd} size="sm" className="w-full">
        Add to Report
      </Button>
    </div>
  );
}







