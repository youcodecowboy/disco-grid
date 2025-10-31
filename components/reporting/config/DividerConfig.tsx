import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface DividerConfigProps {
  onAdd: (config: any) => void;
}

export default function DividerConfig({ onAdd }: DividerConfigProps) {
  const [label, setLabel] = useState('');
  const [style, setStyle] = useState<'solid' | 'dashed' | 'dotted'>('solid');

  const handleAdd = () => {
    onAdd({
      label: label || undefined,
      style,
    });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-slate-600 block mb-1.5">
          Label (optional)
        </label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Section label..."
          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="text-xs text-slate-600 block mb-1.5">Style</label>
        <Select value={style} onValueChange={(value: any) => setStyle(value)}>
          <SelectTrigger className="w-full text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solid" className="text-xs">Solid</SelectItem>
            <SelectItem value="dashed" className="text-xs">Dashed</SelectItem>
            <SelectItem value="dotted" className="text-xs">Dotted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="text-xs text-slate-500">
        Adds a visual separator between sections
      </div>

      <Button onClick={handleAdd} size="sm" className="w-full">
        Add to Report
      </Button>
    </div>
  );
}








