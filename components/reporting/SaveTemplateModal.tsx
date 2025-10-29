import { useState } from 'react';
import { X, Save, Lock, Users, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface SaveTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: TemplateData) => void;
}

interface TemplateData {
  name: string;
  description: string;
  category: string;
  visibility: 'private' | 'team' | 'organization';
}

export default function SaveTemplateModal({ isOpen, onClose, onSave }: SaveTemplateModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('production');
  const [visibility, setVisibility] = useState<'private' | 'team' | 'organization'>('private');

  if (!isOpen) return null;

  const handleSave = () => {
    const template: TemplateData = {
      name,
      description,
      category,
      visibility,
    };
    onSave(template);
    onClose();
    // Reset form
    setName('');
    setDescription('');
    setCategory('production');
    setVisibility('private');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Save className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Save as Template</h2>
              <p className="text-xs text-slate-500">Reuse this report structure</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-4">
          {/* Template Name */}
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-2">
              Template Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Weekly Production Summary Template"
              className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this template is for..."
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-2">
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="production">Production</SelectItem>
                <SelectItem value="executive">Executive</SelectItem>
                <SelectItem value="quality">Quality</SelectItem>
                <SelectItem value="client">Client Updates</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Visibility */}
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-2">
              Visibility
            </label>
            <div className="space-y-2">
              <label className="flex items-start gap-3 p-3 border border-slate-200 rounded cursor-pointer hover:bg-slate-50">
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  checked={visibility === 'private'}
                  onChange={() => setVisibility('private')}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Lock className="h-4 w-4" />
                    Private
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Only you can use this template
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border border-slate-200 rounded cursor-pointer hover:bg-slate-50">
                <input
                  type="radio"
                  name="visibility"
                  value="team"
                  checked={visibility === 'team'}
                  onChange={() => setVisibility('team')}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Users className="h-4 w-4" />
                    Team
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Your team members can use this template
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border border-slate-200 rounded cursor-pointer hover:bg-slate-50">
                <input
                  type="radio"
                  name="visibility"
                  value="organization"
                  checked={visibility === 'organization'}
                  onChange={() => setVisibility('organization')}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Building className="h-4 w-4" />
                    Organization
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Everyone in the organization can use this template
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Save Template
          </Button>
        </div>
      </div>
    </div>
  );
}







