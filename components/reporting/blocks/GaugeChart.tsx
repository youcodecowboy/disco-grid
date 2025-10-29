interface GaugeChartProps {
  value: number;
  max: number;
  title?: string;
  label: string;
  colorZones?: {
    min: number;
    max: number;
    color: string;
  }[];
}

export default function GaugeChart({ value, max, title, label, colorZones }: GaugeChartProps) {
  const percentage = (value / max) * 100;
  
  const getColor = () => {
    if (colorZones) {
      const zone = colorZones.find(z => value >= z.min && value <= z.max);
      if (zone) return zone.color;
    }
    // Default colors based on percentage
    if (percentage >= 90) return '#10b981'; // green
    if (percentage >= 70) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  const color = getColor();
  const rotation = (percentage / 100) * 180 - 90; // -90 to 90 degrees

  return (
    <div>
      {title && (
        <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
      )}
      <div className="flex flex-col items-center py-8">
        {/* Gauge */}
        <div className="relative w-64 h-32">
          {/* Background arc */}
          <svg className="w-full h-full" viewBox="0 0 200 100">
            <path
              d="M 20 90 A 80 80 0 0 1 180 90"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="20"
              strokeLinecap="round"
            />
            {/* Colored arc */}
            <path
              d="M 20 90 A 80 80 0 0 1 180 90"
              fill="none"
              stroke={color}
              strokeWidth="20"
              strokeLinecap="round"
              strokeDasharray={`${(percentage / 100) * 251.2} 251.2`}
            />
            {/* Needle */}
            <line
              x1="100"
              y1="90"
              x2="100"
              y2="30"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
              transform={`rotate(${rotation} 100 90)`}
            />
            {/* Center dot */}
            <circle cx="100" cy="90" r="6" fill={color} />
          </svg>
        </div>

        {/* Value */}
        <div className="text-center mt-4">
          <div className="text-4xl font-bold" style={{ color }}>
            {value}
            <span className="text-2xl text-slate-400 ml-1">/ {max}</span>
          </div>
          <div className="text-sm text-slate-600 mt-1">{label}</div>
          <div className="text-xs text-slate-500 mt-1">
            {percentage.toFixed(1)}% of target
          </div>
        </div>
      </div>
    </div>
  );
}







