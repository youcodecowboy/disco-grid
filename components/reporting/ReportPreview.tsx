import { X } from 'lucide-react';
import KPIGrid from './blocks/KPIGrid';
import ReportChart from './blocks/ReportChart';
import ReportTable from './blocks/ReportTable';
import ReportHeading from './blocks/ReportHeading';
import ReportTimeline from './blocks/ReportTimeline';
import ReportText from './blocks/ReportText';
import MetricComparison from './blocks/MetricComparison';
import GaugeChart from './blocks/GaugeChart';
import ImageBlock from './blocks/ImageBlock';
import Divider from './blocks/Divider';
import Spacer from './blocks/Spacer';
import { sampleKPIs, sampleChartData, sampleOrders, sampleTimeline, sampleComparison, sampleGauge } from '@/lib/reporting/sampleData';
import Image from 'next/image';

interface ReportBlock {
  id: string;
  type: string;
  config: any;
}

interface ReportPreviewProps {
  reportTitle: string;
  onTitleChange: (title: string) => void;
  blocks: ReportBlock[];
  onRemoveBlock: (blockId: string) => void;
  selectedBlockId?: string | null;
  onSelectBlock?: (blockId: string) => void;
}

export default function ReportPreview({
  reportTitle,
  onTitleChange,
  blocks,
  onRemoveBlock,
  selectedBlockId,
  onSelectBlock,
}: ReportPreviewProps) {
  
  const renderBlock = (block: ReportBlock) => {
    switch (block.type) {
      case 'kpi-grid':
        return renderKPIGrid(block.config);
      case 'chart':
        return renderChart(block.config);
      case 'table':
        return renderTable(block.config);
      case 'heading':
        return <ReportHeading text={block.config.text} level={2} />;
      case 'timeline':
        return <ReportTimeline events={sampleTimeline} title={block.config.title} />;
      case 'text':
        return <ReportText content={block.config.content} />;
      case 'comparison':
        return <MetricComparison title={block.config.title} comparisons={sampleComparison} labels={block.config.labels} />;
      case 'gauge':
        return renderGauge(block.config);
      case 'image':
        return <ImageBlock src={block.config.src} caption={block.config.caption} size={block.config.size} />;
      case 'divider':
        return <Divider label={block.config.label} style={block.config.style} />;
      case 'spacer':
        return <Spacer size={block.config.size} />;
      default:
        return null;
    }
  };

  const renderKPIGrid = (config: any) => {
    const metricsData = {
      totalOrders: { label: 'Total Orders', value: sampleKPIs.totalOrders, trend: 12, trendLabel: 'vs last week', icon: 'package' as const },
      completedOrders: { label: 'Completed', value: sampleKPIs.completedOrders, trend: 8, trendLabel: 'vs last week', icon: 'check' as const },
      completionRate: { label: 'Completion Rate', value: `${sampleKPIs.completionRate}%`, trend: 3, trendLabel: 'vs last week', icon: 'check' as const },
      inProduction: { label: 'In Production', value: sampleKPIs.inProduction, icon: 'clock' as const },
      overdueOrders: { label: 'Overdue', value: sampleKPIs.overdueOrders, trend: -25, trendLabel: 'vs last week', icon: 'alert' as const },
      onTimeDelivery: { label: 'On-Time Delivery', value: `${sampleKPIs.onTimeDelivery}%`, trend: 5, trendLabel: 'vs last week', icon: 'check' as const },
      totalItems: { label: 'Total Items', value: sampleKPIs.totalItems, icon: 'package' as const },
      averageOrderValue: { label: 'Avg Order Value', value: `$${(sampleKPIs.averageOrderValue / 1000).toFixed(1)}k`, trend: 7, trendLabel: 'vs last week' },
    };

    const selectedMetrics = config.metrics.map((id: string) => metricsData[id as keyof typeof metricsData]);

    return <KPIGrid metrics={selectedMetrics} layout={config.layout} />;
  };

  const renderChart = (config: any) => {
    let data: any[] = [];
    let chartConfig: any = {};

    if (config.dataSource === 'dailyCompletion') {
      data = sampleChartData.dailyCompletion;
      chartConfig = {
        xAxis: 'date',
        yAxis: 'completed',
        dataKey: 'target',
      };
    } else if (config.dataSource === 'ordersByClient') {
      data = sampleChartData.ordersByClient;
      chartConfig = {
        xAxis: 'client',
        yAxis: 'orders',
      };
    } else if (config.dataSource === 'statusBreakdown') {
      data = sampleChartData.statusBreakdown;
      chartConfig = {
        dataKey: 'value',
        nameKey: 'name',
      };
    }

    return (
      <ReportChart
        type={config.chartType}
        data={data}
        config={chartConfig}
        title={config.title}
      />
    );
  };

  const renderTable = (config: any) => {
    const columns = [
      { key: 'client', label: 'Client', width: '25%' },
      { key: 'orderName', label: 'Order', width: '30%' },
      { key: 'status', label: 'Status', width: '15%' },
      { key: 'itemsCount', label: 'Items', width: '10%' },
      { key: 'deadline', label: 'Deadline', width: '20%' },
    ];

    const limitedData = sampleOrders.slice(0, config.limit || 10);

    return <ReportTable data={limitedData} columns={columns} title={config.title} />;
  };

  const renderGauge = (config: any) => {
    const gaugeData = config.metric ? sampleGauge[config.metric as keyof typeof sampleGauge] : sampleGauge.completionRate;
    return (
      <GaugeChart
        value={gaugeData.value}
        max={gaugeData.max}
        label={gaugeData.label}
        title={config.title}
        colorZones={gaugeData.colorZones}
      />
    );
  };

  return (
    <div className="flex-1 bg-slate-50 p-8 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
        {/* Report Header */}
        <div className="border-b border-slate-200 px-12 py-8 relative">
          {/* Groovy Logo */}
          <div className="absolute top-8 right-12">
            <Image
              src="/groovy-logo.png"
              alt="Groovy"
              width={80}
              height={80}
              className="object-contain opacity-90"
            />
          </div>
          
          <input
            type="text"
            value={reportTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            className="text-3xl font-bold text-slate-900 bg-transparent border-none outline-none w-full placeholder-slate-300 pr-24"
            placeholder="Untitled Report"
          />
          <div className="mt-2 text-sm text-slate-500">
            Generated {new Date().toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </div>
        </div>

        {/* Report Body */}
        <div className="px-12 py-8">
          {blocks.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-slate-400 mb-2">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-slate-600 font-medium mb-1">Start building your report</p>
              <p className="text-sm text-slate-500">
                Use the sidebar to add KPI grids, charts, tables, and more
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {blocks.map((block) => {
                const isSelected = selectedBlockId === block.id;
                
                return (
                  <div
                    key={block.id}
                    className={`relative group cursor-pointer rounded-lg transition-all ${
                      isSelected ? 'ring-2 ring-blue-500 bg-blue-50/10' : ''
                    }`}
                    onClick={() => onSelectBlock?.(block.id)}
                  >
                    {/* Block content */}
                    <div onClick={(e) => e.stopPropagation()}>
                      {renderBlock(block)}
                    </div>
                    
                    {/* Hover actions */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveBlock(block.id);
                        }}
                        className="p-1.5 bg-white rounded-lg shadow-md border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                        title="Remove block"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {/* Selected indicator */}
                    {isSelected && (
                      <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-12 bg-blue-500 rounded-r" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Report Footer */}
        {blocks.length > 0 && (
          <div className="border-t border-slate-200 px-12 py-6 text-xs text-slate-500 text-center">
            End of Report
          </div>
        )}
      </div>
    </div>
  );
}

