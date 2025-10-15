import type { Note } from "@/app/notes/types"

export const mockNotes: Note[] = [
  {
    id: 'note-1',
    title: 'Weekly Operations Report',
    emoji: '📊',
    author: 'Current User',
    tags: ['weekly', 'operations', 'report'],
    mentions: [
      { id: 'm1', type: 'team', label: 'Operations Team' },
      { id: 'm2', type: 'task', label: 'Q1 Review' },
    ],
    content: [
      { 
        id: 'b1', 
        type: 'h1', 
        content: 'Weekly Operations Report', 
        order: 0 
      },
      { 
        id: 'b2', 
        type: 'text', 
        content: 'Here are the key metrics for this week. Overall performance is trending upward with some areas requiring attention.', 
        order: 1 
      },
      { 
        id: 'b3', 
        type: 'metric.kpi', 
        content: { 
          value: '124', 
          delta: '+12%',
          trend: [100, 105, 110, 115, 118, 120, 124]
        }, 
        order: 2 
      },
      { 
        id: 'b4', 
        type: 'text', 
        content: 'The production line performance shows consistent improvement:', 
        order: 3 
      },
      { 
        id: 'b5', 
        type: 'chart.bar', 
        content: {
          series: [
            {
              name: "Output",
              points: [
                { x: "Mon", y: 24 },
                { x: "Tue", y: 28 },
                { x: "Wed", y: 32 },
                { x: "Thu", y: 30 },
                { x: "Fri", y: 36 },
              ],
            },
          ],
        }, 
        order: 4 
      },
    ],
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-15'),
  },
  {
    id: 'note-2',
    title: 'Project Planning Notes',
    emoji: '🎯',
    author: 'Current User',
    tags: ['planning', 'q1', 'strategy'],
    mentions: [
      { id: 'm3', type: 'client', label: 'Acme Corp' },
      { id: 'm4', type: 'person', label: 'John Smith' },
    ],
    content: [
      { 
        id: 'b1', 
        type: 'h1', 
        content: 'Project Planning Notes', 
        order: 0 
      },
      { 
        id: 'b2', 
        type: 'h2', 
        content: 'Key objectives for Q1 2025', 
        order: 1 
      },
      { 
        id: 'b3', 
        type: 'text', 
        content: '- Improve production efficiency by 15%\n- Reduce material waste\n- Enhance team coordination', 
        order: 2 
      },
      { 
        id: 'b4', 
        type: 'calendar', 
        content: {
          events: [
            { date: "2025-01-20", title: "Sprint Planning" },
            { date: "2025-01-27", title: "Review Meeting" },
          ],
        }, 
        order: 3 
      },
    ],
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-14'),
  },
  {
    id: 'note-3',
    title: 'Meeting Notes - Jan 15',
    emoji: '📝',
    author: 'Current User',
    tags: ['meeting', 'notes'],
    mentions: [
      { id: 'm5', type: 'person', label: 'Sarah Johnson' },
      { id: 'm6', type: 'person', label: 'Mike Chen' },
    ],
    content: [
      { 
        id: 'b1', 
        type: 'h1', 
        content: 'Meeting Notes - Jan 15', 
        order: 0 
      },
      { 
        id: 'b2', 
        type: 'subtitle', 
        content: 'Attendees: John, Sarah, Mike, Lisa', 
        order: 1 
      },
      { 
        id: 'b3', 
        type: 'h3', 
        content: 'Discussion points', 
        order: 2 
      },
      { 
        id: 'b4', 
        type: 'text', 
        content: '- Review current capacity utilization\n- Plan for upcoming material deliveries\n- Address quality concerns', 
        order: 3 
      },
    ],
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15'),
  },
]

