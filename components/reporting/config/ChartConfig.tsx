import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface ChartConfigProps {
  onAdd: (config: any) => void;
}

export default function ChartConfig({ onAdd }: ChartConfigProps) {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');
  const [dataSource, setDataSource] = useState('dailyCompletion');
  const [title, setTitle] = useState('');

  const dataSourceOptions = [
    { value: 'dailyCompletion', label: 'Daily Completion' },
    { value: 'ordersByClient', label: 'Orders by Client' },
    { value: 'statusBreakdown', label: 'Status Breakdown' },
  ];

  const handleAdd = () => {
    onAdd({
      chartType,
      dataSource,
      title: title || getDefaultTitle(),
    });
  };

  const getDefaultTitle = () => {
    const source = dataSourceOptions.find(opt => opt.value === dataSource);
    return source?.label || 'Chart';
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-slate-600 block mb-1.5">Chart Type</label>
        <div className="flex gap-2">
          <button
            onClick={() => setChartType('line')}
            className={`flex-1 px-3 py-2 text-xs rounded border ${
              chartType === 'line'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-slate-200 bg-white text-slate-700'
            }`}
          >
            Line
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`flex-1 px-3 py-2 text-xs rounded border ${
              chartType === 'bar'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-slate-200 bg-white text-slate-700'
            }`}
          >
            Bar
          </button>
          <button
            onClick={() => setChartType('pie')}
            className={`flex-1 px-3 py-2 text-xs rounded border ${
              chartType === 'pie'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-slate-200 bg-white text-slate-700'
            }`}
          >
            Pie
          </button>
        </div>
      </div>

      <div>
        <label className="text-xs text-slate-600 block mb-1.5">Data Source</label>
        <Select value={dataSource} onValueChange={setDataSource}>
          <SelectTrigger className="w-full text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {dataSourceOptions.map((option) => (
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
          placeholder={getDefaultTitle()}
          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <Button onClick={handleAdd} size="sm" className="w-full">
        Add to Report
      </Button>
    </div>
  );
}







