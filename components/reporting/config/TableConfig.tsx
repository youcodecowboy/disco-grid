import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface TableConfigProps {
  onAdd: (config: any) => void;
}

export default function TableConfig({ onAdd }: TableConfigProps) {
  const [title, setTitle] = useState('');
  const [limit, setLimit] = useState('10');

  const handleAdd = () => {
    onAdd({
      title: title || 'Recent Orders',
      limit: parseInt(limit) || 10,
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
          placeholder="Recent Orders"
          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="text-xs text-slate-600 block mb-1.5">
          Number of Rows
        </label>
        <input
          type="number"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          min="1"
          max="50"
          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="text-xs text-slate-500">
        Will show order data with client, status, items, and deadline
      </div>

      <Button onClick={handleAdd} size="sm" className="w-full">
        Add to Report
      </Button>
    </div>
  );
}








