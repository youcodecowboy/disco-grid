import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface MetricComparisonConfigProps {
  onAdd: (config: any) => void;
}

export default function MetricComparisonConfig({ onAdd }: MetricComparisonConfigProps) {
  const [title, setTitle] = useState('This Month vs Last Month');

  const handleAdd = () => {
    onAdd({
      title,
      labels: {
        current: 'This Month',
        previous: 'Last Month',
      },
    });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-slate-600 block mb-1.5">
          Title (optional)
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="This Month vs Last Month"
          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="text-xs text-slate-500">
        Compares key metrics between two time periods
      </div>

      <Button onClick={handleAdd} size="sm" className="w-full">
        Add to Report
      </Button>
    </div>
  );
}








