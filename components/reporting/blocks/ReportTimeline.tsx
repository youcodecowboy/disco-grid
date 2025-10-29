import { Calendar, AlertCircle, CheckCircle } from 'lucide-react';

interface TimelineEvent {
  id: string;
  title: string;
  client: string;
  date: string;
  status: 'on-track' | 'at-risk' | 'overdue';
  itemsCount?: number;
}

interface ReportTimelineProps {
  events: TimelineEvent[];
  title?: string;
}

export default function ReportTimeline({ events, title }: ReportTimelineProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'at-risk':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'overdue':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div>
      {title && (
        <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
      )}
      <div className="space-y-3">
        {events.map((event, index) => (
          <div key={event.id} className="relative">
            {/* Timeline line */}
            {index < events.length - 1 && (
              <div className="absolute left-4 top-8 bottom-0 w-px bg-slate-200" />
            )}
            
            {/* Event card */}
            <div className="flex gap-4">
              {/* Timeline dot */}
              <div className="flex-shrink-0 mt-1">
                <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center ${
                  event.status === 'on-track' ? 'border-green-500 bg-green-50' :
                  event.status === 'at-risk' ? 'border-amber-500 bg-amber-50' :
                  'border-red-500 bg-red-50'
                }`}>
                  {event.status === 'on-track' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : event.status === 'at-risk' ? (
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </div>

              {/* Event content */}
              <div className="flex-1 bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium text-slate-900">
                      {event.title}
                    </div>
                    <div className="text-sm text-slate-600">
                      {event.client}
                    </div>
                  </div>
                  <div className={`text-xs font-medium px-2 py-1 rounded-full border ${getStatusColor(event.status)}`}>
                    {event.status === 'on-track' ? 'On Track' :
                     event.status === 'at-risk' ? 'At Risk' : 'Overdue'}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(event.date)}
                  </div>
                  {event.itemsCount && (
                    <div>
                      {event.itemsCount} items
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}







