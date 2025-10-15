'use client';

import { DataSource } from '../types';
import { DataSourceCard } from './DataSourceCard';

interface DataSourceGridProps {
  sources: DataSource[];
  onToggleSource: (id: string) => void;
  onToggleTable: (sourceId: string, tableId: string) => void;
}

export function DataSourceGrid({ sources, onToggleSource, onToggleTable }: DataSourceGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-20">
      {sources.map((source) => (
        <DataSourceCard
          key={source.id}
          source={source}
          onToggleSource={onToggleSource}
          onToggleTable={onToggleTable}
        />
      ))}
    </div>
  );
}

