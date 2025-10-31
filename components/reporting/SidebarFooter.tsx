import { Send, Calendar, Save, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarFooterProps {
  onSendNow: () => void;
  onSchedule: () => void;
  onSaveTemplate: () => void;
  isScheduled?: boolean;
  nextRun?: string;
}

export default function SidebarFooter({
  onSendNow,
  onSchedule,
  onSaveTemplate,
  isScheduled = false,
  nextRun,
}: SidebarFooterProps) {
  return (
    <div className="sticky bottom-0 border-t border-slate-200 bg-white px-4 py-4 shadow-lg">
      {isScheduled && nextRun && (
        <div className="mb-3 px-3 py-2 bg-blue-50 rounded text-xs text-blue-700 border border-blue-200">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            <span>Next run: {nextRun}</span>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Button
          onClick={onSendNow}
          size="sm"
          variant="outline"
          className="w-full"
        >
          <Send className="h-4 w-4 mr-2" />
          Send Now
        </Button>

        <Button
          onClick={onSchedule}
          size="sm"
          variant="outline"
          className="w-full"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Send
        </Button>

        <div className="flex gap-2">
          <Button
            onClick={onSaveTemplate}
            size="sm"
            variant="ghost"
            className="flex-1 text-xs"
          >
            <Save className="h-3 w-3 mr-1.5" />
            Save as Template
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="px-2"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}








