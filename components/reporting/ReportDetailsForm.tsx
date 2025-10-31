import { useState } from 'react';
import { ChevronDown, ChevronUp, User, Users, FileText } from 'lucide-react';

interface ReportDetails {
  title: string;
  recipients: string[];
  creator: string;
  description: string;
  tags: string[];
}

interface ReportDetailsFormProps {
  details: ReportDetails;
  onUpdate: (details: ReportDetails) => void;
}

export default function ReportDetailsForm({ details, onUpdate }: ReportDetailsFormProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleChange = (field: keyof ReportDetails, value: any) => {
    onUpdate({ ...details, [field]: value });
  };

  return (
    <div className="border-b border-slate-200 mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-slate-500" />
          Report Details
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-slate-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          {/* Title */}
          <div>
            <label className="text-xs text-slate-600 block mb-1.5">
              Report Title
            </label>
            <input
              type="text"
              value={details.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Weekly Production Summary"
              className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Recipients */}
          <div>
            <label className="text-xs text-slate-600 block mb-1.5">
              Recipients
            </label>
            <div className="flex items-center gap-2 px-3 py-1.5 text-sm border border-slate-200 rounded bg-slate-50">
              <Users className="h-4 w-4 text-slate-400" />
              <span className="text-slate-600 text-xs">
                {details.recipients.length === 0 ? 'Add recipients...' : `${details.recipients.length} recipients`}
              </span>
            </div>
          </div>

          {/* Creator */}
          <div>
            <label className="text-xs text-slate-600 block mb-1.5">
              Created by
            </label>
            <div className="flex items-center gap-2 px-3 py-1.5 text-sm border border-slate-200 rounded bg-slate-50">
              <User className="h-4 w-4 text-slate-400" />
              <span className="text-slate-600 text-xs">{details.creator}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-slate-600 block mb-1.5">
              Description (optional)
            </label>
            <textarea
              value={details.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe what this report shows..."
              rows={2}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}








