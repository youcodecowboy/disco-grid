'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutScaffold } from '@/components/grid-v2/LayoutScaffold';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Plus,
    Calendar,
    TrendingUp,
    FileText,
    Play,
    Eye,
    Send,
    Clock,
    CheckCircle,
    Home,
    ChevronRight,
    Inbox,
    Zap,
    BarChart3,
    Users,
    Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type TabType = 'overview' | 'inbox' | 'my-reports' | 'scheduled' | 'templates';

export default function ReportsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Mock analytics data
  const analytics = {
    totalReports: 24,
    activeSchedules: 8,
    reportsThisMonth: 156,
    avgOpenRate: 87,
    scheduledToday: 3,
    unreadInbox: 5,
  };

  // Mock reports data
  const myReports = [
    {
      id: '1',
      name: 'Weekly Production Summary',
      status: 'Active',
      schedule: 'Every Friday at 5:00 PM',
      lastRun: '2 hours ago',
      nextRun: 'Tomorrow at 5:00 PM',
      recipients: 12,
      openRate: 95,
      category: 'Production',
      icon: BarChart3,
    },
    {
      id: '2',
      name: 'Monthly Executive Dashboard',
      status: 'Active',
      schedule: 'Last day of month at 4:00 PM',
      lastRun: '3 days ago',
      nextRun: 'Oct 31 at 4:00 PM',
      recipients: 5,
      openRate: 100,
      category: 'Executive',
      icon: TrendingUp,
    },
    {
      id: '3',
      name: 'Client Order Update - Horizon Apparel',
      status: 'Paused',
      schedule: 'Bi-weekly on Monday',
      lastRun: '1 week ago',
      nextRun: '—',
      recipients: 3,
      openRate: 92,
      category: 'Client',
      icon: FileText,
    },
    {
      id: '4',
      name: 'Team Performance Report',
      status: 'Active',
      schedule: 'Weekly on Wednesday at 9:00 AM',
      lastRun: 'Yesterday',
      nextRun: 'Nov 13 at 9:00 AM',
      recipients: 8,
      openRate: 78,
      category: 'Team',
      icon: Users,
    },
  ];

  const inboxReports = [
    {
      id: 'i1',
      title: 'Weekly Production Summary',
      sender: 'Sarah Johnson',
      received: '2 hours ago',
      isRead: false,
      category: 'Production',
    },
    {
      id: 'i2',
      title: 'Quality Metrics Update',
      sender: 'Mike Chen',
      received: '5 hours ago',
      isRead: false,
      category: 'Quality',
    },
    {
      id: 'i3',
      title: 'Monthly Executive Dashboard',
      sender: 'Operations Team',
      received: 'Yesterday',
      isRead: true,
      category: 'Executive',
    },
    {
      id: 'i4',
      title: 'Client Order Update',
      sender: 'Account Manager',
      received: '2 days ago',
      isRead: true,
      category: 'Client',
    },
  ];

  const templates = [
    {
      id: 't1',
      name: 'Weekly Production Summary',
      description: 'KPIs, charts, and tables for weekly production review',
      category: 'Production',
      uses: 45,
      creator: 'Sarah Johnson',
    },
    {
      id: 't2',
      name: 'Executive Monthly Review',
      description: 'High-level metrics and trends for leadership',
      category: 'Executive',
      uses: 23,
      creator: 'Operations Team',
    },
    {
      id: 't3',
      name: 'Client Update Template',
      description: 'Order status and timeline for client communication',
      category: 'Client',
      uses: 67,
      creator: 'Account Team',
    },
    {
      id: 't4',
      name: 'Team Performance Dashboard',
      description: 'Metrics and leaderboards for team management',
      category: 'Team',
      uses: 34,
      creator: 'HR Team',
    },
  ];

  const recentActivity = [
    { id: 'r1', action: 'Generated', report: 'Weekly Production Summary', time: '2 hours ago', user: 'Sarah Johnson' },
    { id: 'r2', action: 'Sent', report: 'Client Order Update', time: '5 hours ago', user: 'System' },
    { id: 'r3', action: 'Opened', report: 'Monthly Dashboard', time: 'Yesterday', user: 'Mike Chen' },
    { id: 'r4', action: 'Created', report: 'New QA Report', time: '2 days ago', user: 'Quality Team' },
  ];

  const scheduledReports = myReports.filter(r => r.status === 'Active');

  return (
    <LayoutScaffold
      pageTitle="Reports & Analytics"
      pageSubtext="Create, schedule, and distribute intelligent reports"
      headerActions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/reports/templates')}
          >
            <FileText className="h-4 w-4 mr-2" />
            Browse Templates
          </Button>
          <Button
            size="sm"
            onClick={() => router.push('/reports/builder')}
            className="bg-slate-900 hover:bg-slate-800"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Report
          </Button>
        </div>
      }
    >
      <div className="space-y-6 py-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Home className="h-4 w-4" />
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-slate-900">Overview</span>
        </div>

        {/* Tab Navigation */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 px-2 py-2 overflow-x-auto">
            <div className="flex items-center gap-1 min-w-max">
              <button
                onClick={() => setActiveTab('overview')}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                  activeTab === 'overview'
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <Home className="h-4 w-4" />
                Overview
              </button>

              <button
                onClick={() => setActiveTab('inbox')}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors relative",
                  activeTab === 'inbox'
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <Inbox className="h-4 w-4" />
                Inbox
                {analytics.unreadInbox > 0 && (
                  <Badge className="ml-1 bg-blue-500 text-white text-xs px-1.5 py-0">
                    {analytics.unreadInbox}
                  </Badge>
                )}
              </button>

              <button
                onClick={() => setActiveTab('my-reports')}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                  activeTab === 'my-reports'
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <FileText className="h-4 w-4" />
                My Reports
                <Badge variant="outline" className="ml-1 text-xs">
                  {analytics.totalReports}
                </Badge>
              </button>

              <button
                onClick={() => setActiveTab('scheduled')}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                  activeTab === 'scheduled'
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <Zap className="h-4 w-4" />
                Scheduled
                <Badge variant="outline" className="ml-1 text-xs">
                  {analytics.activeSchedules}
                </Badge>
              </button>

              <button
                onClick={() => setActiveTab('templates')}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                  activeTab === 'templates'
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <FileText className="h-4 w-4" />
                Templates
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Analytics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-900">Total Reports</span>
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-blue-900">{analytics.totalReports}</div>
                    <div className="text-xs text-blue-700 mt-1">
                      {analytics.activeSchedules} active schedules
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-900">Generated This Month</span>
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="text-3xl font-bold text-green-900">{analytics.reportsThisMonth}</div>
                    <div className="text-xs text-green-700 mt-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +23% from last month
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-purple-900">Avg Open Rate</span>
                      <Eye className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="text-3xl font-bold text-purple-900">{analytics.avgOpenRate}%</div>
                    <div className="text-xs text-purple-700 mt-1">
                      Across all reports
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-4 border border-amber-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-amber-900">Scheduled Today</span>
                      <Clock className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="text-3xl font-bold text-amber-900">{analytics.scheduledToday}</div>
                    <div className="text-xs text-amber-700 mt-1">
                      Next at 5:00 PM
                    </div>
                  </div>
                </div>

                {/* Recent Reports & Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Reports */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-slate-900">Recent Reports</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab('my-reports')}
                        className="text-xs"
                      >
                        View all
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {myReports.slice(0, 4).map((report) => {
                        const Icon = report.icon;
                        return (
                          <div
                            key={report.id}
                            className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
                            onClick={() => router.push(`/reports/${report.id}`)}
                          >
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                              <Icon className="h-5 w-5 text-slate-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <div className="font-medium text-sm text-slate-900 truncate">
                                  {report.name}
                                </div>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-xs",
                                    report.status === 'Active'
                                      ? "border-green-300 text-green-700 bg-green-50"
                                      : "border-slate-300 text-slate-600"
                                  )}
                                >
                                  {report.status}
                                </Badge>
                              </div>
                              <div className="text-xs text-slate-500 mt-0.5">
                                Last run {report.lastRun} · {report.openRate}% open rate
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-slate-900">Recent Activity</h3>
                    </div>
                    <div className="space-y-3">
                      {recentActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start gap-3 p-3 rounded-lg border border-slate-200"
                        >
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                            activity.action === 'Generated' ? "bg-blue-100" :
                            activity.action === 'Sent' ? "bg-green-100" :
                            activity.action === 'Opened' ? "bg-purple-100" :
                            "bg-slate-100"
                          )}>
                            {activity.action === 'Generated' && <Play className="h-4 w-4 text-blue-600" />}
                            {activity.action === 'Sent' && <Send className="h-4 w-4 text-green-600" />}
                            {activity.action === 'Opened' && <Eye className="h-4 w-4 text-purple-600" />}
                            {activity.action === 'Created' && <Plus className="h-4 w-4 text-slate-600" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-slate-900">
                              <span className="font-medium">{activity.action}</span> {activity.report}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              {activity.user} · {activity.time}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Inbox Tab */}
            {activeTab === 'inbox' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Report Inbox</h3>
                    <p className="text-sm text-slate-500">Reports sent to you</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark all as read
                  </Button>
                </div>

                <div className="space-y-2">
                  {inboxReports.map((report) => (
                    <div
                      key={report.id}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer",
                        report.isRead
                          ? "border-slate-200 bg-white hover:border-slate-300"
                          : "border-blue-200 bg-blue-50/50 hover:border-blue-300"
                      )}
                      onClick={() => {/* Open report */}}
                    >
                      <div className={cn(
                        "w-2 h-2 rounded-full flex-shrink-0",
                        report.isRead ? "bg-slate-300" : "bg-blue-500"
                      )} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={cn(
                            "font-medium text-sm truncate",
                            report.isRead ? "text-slate-700" : "text-slate-900"
                          )}>
                            {report.title}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {report.category}
                          </Badge>
                        </div>
                        <div className="text-xs text-slate-500">
                          From {report.sender} · {report.received}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* My Reports Tab */}
            {activeTab === 'my-reports' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">My Reports</h3>
                    <p className="text-sm text-slate-500">Reports you've created</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {myReports.map((report) => {
                    const Icon = report.icon;
                    return (
                      <div
                        key={report.id}
                        className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all"
                      >
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center flex-shrink-0 border border-slate-200">
                          <Icon className="h-6 w-6 text-slate-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="font-semibold text-slate-900 truncate">
                              {report.name}
                            </div>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs",
                                report.status === 'Active'
                                  ? "border-green-300 text-green-700 bg-green-50"
                                  : "border-slate-300 text-slate-600"
                              )}
                            >
                              {report.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {report.category}
                            </Badge>
                          </div>
                          <div className="text-sm text-slate-600 mb-2">
                            {report.schedule}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Last run: {report.lastRun}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Next: {report.nextRun}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {report.recipients} recipients
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {report.openRate}% open rate
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/reports/builder?edit=${report.id}`)}
                          >
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Scheduled Tab */}
            {activeTab === 'scheduled' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Scheduled Reports</h3>
                    <p className="text-sm text-slate-500">Automated report generation</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {scheduledReports.map((report) => {
                    const Icon = report.icon;
                    return (
                      <div
                        key={report.id}
                        className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 hover:border-slate-300 bg-white"
                      >
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center flex-shrink-0 border border-blue-200">
                          <Icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-900 mb-1">
                            {report.name}
                          </div>
                          <div className="text-sm text-slate-600 mb-2 flex items-center gap-2">
                            <Zap className="h-4 w-4 text-amber-500" />
                            {report.schedule}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Next run: {report.nextRun}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {report.recipients} recipients
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Pause Schedule
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Templates Tab */}
            {activeTab === 'templates' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Report Templates</h3>
                    <p className="text-sm text-slate-500">Pre-built templates to get started quickly</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group"
                      onClick={() => router.push(`/reports/builder?template=${template.id}`)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                            {template.name}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {template.category}
                          </Badge>
                        </div>
                        <div className="text-xs text-slate-500">
                          {template.uses} uses
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">
                        {template.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-slate-500">
                          By {template.creator}
                        </div>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          Use Template
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </LayoutScaffold>
  );
}
