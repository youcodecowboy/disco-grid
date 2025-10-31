import { TrendingUp, TrendingDown, Package, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface KPIMetric {
  label: string;
  value: string | number;
  trend?: number; // percentage change
  icon?: 'package' | 'check' | 'clock' | 'alert';
  trendLabel?: string;
}

interface KPIGridProps {
  metrics: KPIMetric[];
  layout?: '2x2' | '1x4';
}

const iconMap = {
  package: Package,
  check: CheckCircle,
  clock: Clock,
  alert: AlertCircle,
};

export default function KPIGrid({ metrics, layout = '2x2' }: KPIGridProps) {
  const gridClass = layout === '2x2' 
    ? 'grid grid-cols-2 gap-6' 
    : 'grid grid-cols-4 gap-4';

  return (
    <div className={gridClass}>
      {metrics.map((metric, index) => {
        const Icon = metric.icon ? iconMap[metric.icon] : Package;
        
        return (
          <div 
            key={index} 
            className="bg-slate-50 rounded-lg p-6 border border-slate-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="text-sm font-medium text-slate-600">
                {metric.label}
              </div>
              {metric.icon && (
                <div className="bg-white rounded-lg p-2 border border-slate-200">
                  <Icon className="h-4 w-4 text-slate-500" />
                </div>
              )}
            </div>
            
            <div className="text-3xl font-bold text-slate-900 mb-2">
              {metric.value}
            </div>
            
            {metric.trend !== undefined && (
              <div className="flex items-center gap-1 text-xs">
                {metric.trend >= 0 ? (
                  <>
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-green-600 font-medium">
                      +{metric.trend}%
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3 text-red-600" />
                    <span className="text-red-600 font-medium">
                      {metric.trend}%
                    </span>
                  </>
                )}
                {metric.trendLabel && (
                  <span className="text-slate-500 ml-1">{metric.trendLabel}</span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}








