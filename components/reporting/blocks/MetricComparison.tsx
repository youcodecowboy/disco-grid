import { TrendingUp, TrendingDown } from 'lucide-react';

interface ComparisonData {
  label: string;
  current: number | string;
  previous: number | string;
  change: number;
  format?: 'number' | 'percent' | 'currency';
}

interface MetricComparisonProps {
  title?: string;
  comparisons: ComparisonData[];
  labels: {
    current: string;
    previous: string;
  };
}

export default function MetricComparison({ title, comparisons, labels }: MetricComparisonProps) {
  const formatValue = (value: number | string, format?: string) => {
    if (typeof value === 'string') return value;
    if (format === 'currency') return `$${value.toLocaleString()}`;
    if (format === 'percent') return `${value}%`;
    return value.toLocaleString();
  };

  return (
    <div>
      {title && (
        <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
      )}
      <div className="overflow-hidden border border-slate-200 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Metric
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                {labels.current}
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                {labels.previous}
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                Change
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {comparisons.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="px-4 py-3 text-slate-900 font-medium">
                  {item.label}
                </td>
                <td className="px-4 py-3 text-right text-slate-900 font-semibold">
                  {formatValue(item.current, item.format)}
                </td>
                <td className="px-4 py-3 text-right text-slate-600">
                  {formatValue(item.previous, item.format)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className={`inline-flex items-center gap-1 ${
                    item.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.change >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span className="font-medium">
                      {item.change >= 0 ? '+' : ''}{item.change}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}








