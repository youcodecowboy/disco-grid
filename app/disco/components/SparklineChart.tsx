'use client';

import { motion } from 'framer-motion';

interface SparklineChartProps {
  data: number[];
  color?: string;
  height?: number;
}

export function SparklineChart({ data, color = '#3b82f6', height = 40 }: SparklineChartProps) {
  if (data.length === 0) return null;
  
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  
  const pathD = `M ${points.split(' ').map((point, i) => {
    const [x, y] = point.split(',');
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ')}`;
  
  return (
    <div className="relative" style={{ height: `${height}px` }}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        className="absolute inset-0"
      >
        {/* Area fill */}
        <motion.path
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          d={`${pathD} L 100 ${height} L 0 ${height} Z`}
          fill={color}
        />
        
        {/* Line */}
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          d={pathD}
          stroke={color}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Points */}
        {data.map((value, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = height - ((value - min) / range) * height;
          return (
            <motion.circle
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              cx={x}
              cy={y}
              r="1.5"
              fill={color}
            />
          );
        })}
      </svg>
    </div>
  );
}

