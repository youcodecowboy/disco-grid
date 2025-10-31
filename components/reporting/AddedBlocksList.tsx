import { Grid, BarChart3, Table, Type, Calendar, FileText, X, Edit } from 'lucide-react';

interface AddedBlock {
  id: string;
  type: string;
  title?: string;
}

interface AddedBlocksListProps {
  blocks: AddedBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string) => void;
  onRemoveBlock: (blockId: string) => void;
}

const blockIcons: Record<string, any> = {
  'kpi-grid': Grid,
  'chart': BarChart3,
  'table': Table,
  'heading': Type,
  'timeline': Calendar,
  'text': FileText,
};

const blockLabels: Record<string, string> = {
  'kpi-grid': 'KPI Grid',
  'chart': 'Chart',
  'table': 'Table',
  'heading': 'Heading',
  'timeline': 'Timeline',
  'text': 'Text',
};

export default function AddedBlocksList({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onRemoveBlock,
}: AddedBlocksListProps) {
  if (blocks.length === 0) {
    return null;
  }

  return (
    <div className="border-b border-slate-200 mb-4 pb-4">
      <div className="px-4 mb-2">
        <div className="text-xs font-medium text-slate-600">
          Added Blocks ({blocks.length})
        </div>
      </div>

      <div className="space-y-0.5 max-h-48 overflow-y-auto px-4">
        {blocks.map((block, index) => {
          const Icon = blockIcons[block.type] || FileText;
          const label = block.title || blockLabels[block.type] || 'Block';
          const isSelected = block.id === selectedBlockId;

          return (
            <div
              key={block.id}
              className={`group flex items-center justify-between px-3 py-2 rounded text-sm cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-blue-50 border-l-2 border-blue-500'
                  : 'hover:bg-slate-50'
              }`}
              onClick={() => onSelectBlock(block.id)}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-slate-400 text-xs w-4 text-right">
                  {index + 1}
                </span>
                <Icon className="h-4 w-4 text-slate-500 flex-shrink-0" />
                <span className="text-slate-700 text-xs truncate">{label}</span>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectBlock(block.id);
                  }}
                  className="p-1 hover:bg-slate-200 rounded"
                  title="Edit"
                >
                  <Edit className="h-3 w-3 text-slate-500" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveBlock(block.id);
                  }}
                  className="p-1 hover:bg-red-100 rounded"
                  title="Remove"
                >
                  <X className="h-3 w-3 text-slate-500 hover:text-red-600" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}








