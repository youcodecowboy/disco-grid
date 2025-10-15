import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface ImageConfigProps {
  onAdd: (config: any) => void;
}

export default function ImageConfig({ onAdd }: ImageConfigProps) {
  const [imageUrl, setImageUrl] = useState('https://placehold.co/600x400/e2e8f0/64748b?text=Report+Image');
  const [caption, setCaption] = useState('');
  const [size, setSize] = useState<'small' | 'medium' | 'large' | 'full'>('medium');

  const handleAdd = () => {
    onAdd({
      src: imageUrl,
      caption: caption || undefined,
      size,
    });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-slate-600 block mb-1.5">
          Image URL
        </label>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://..."
          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="text-xs text-slate-600 block mb-1.5">Size</label>
        <Select value={size} onValueChange={(value: any) => setSize(value)}>
          <SelectTrigger className="w-full text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small" className="text-xs">Small</SelectItem>
            <SelectItem value="medium" className="text-xs">Medium</SelectItem>
            <SelectItem value="large" className="text-xs">Large</SelectItem>
            <SelectItem value="full" className="text-xs">Full Width</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-xs text-slate-600 block mb-1.5">
          Caption (optional)
        </label>
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Add a caption..."
          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <Button onClick={handleAdd} size="sm" className="w-full">
        Add to Report
      </Button>
    </div>
  );
}

