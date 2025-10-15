import { useState, useEffect } from 'react';
import { Plus, X, Grid, BarChart3, Table, Type, Calendar, FileText, Gauge, Image, Minus, Space } from 'lucide-react';
import KPIGridConfig from './config/KPIGridConfig';
import ChartConfig from './config/ChartConfig';
import TableConfig from './config/TableConfig';
import MetricComparisonConfig from './config/MetricComparisonConfig';
import GaugeConfig from './config/GaugeConfig';
import ImageConfig from './config/ImageConfig';
import DividerConfig from './config/DividerConfig';
import ReportDetailsForm from './ReportDetailsForm';
import AddedBlocksList from './AddedBlocksList';

interface ReportBlock {
  id: string;
  type: string;
  config: any;
  title?: string;
}

interface ReportDetails {
  title: string;
  recipients: string[];
  creator: string;
  description: string;
  tags: string[];
}

interface ReportBuilderSidebarProps {
  onAddBlock: (type: string, config: any) => void;
  blocks: ReportBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string) => void;
  onRemoveBlock: (blockId: string) => void;
  details: ReportDetails;
  onUpdateDetails: (details: ReportDetails) => void;
}

export default function ReportBuilderSidebar({
  onAddBlock,
  blocks,
  selectedBlockId,
  onSelectBlock,
  onRemoveBlock,
  details,
  onUpdateDetails,
}: ReportBuilderSidebarProps) {
  const [showKPIGrid, setShowKPIGrid] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [showHeading, setShowHeading] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showGauge, setShowGauge] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showDivider, setShowDivider] = useState(false);
  const [showSpacer, setShowSpacer] = useState(false);

  const [headingText, setHeadingText] = useState('');
  const [textContent, setTextContent] = useState('');
  const [spacerSize, setSpacerSize] = useState<'small' | 'medium' | 'large'>('medium');

  // When a block is selected, open its configuration if it exists
  useEffect(() => {
    if (selectedBlockId) {
      const block = blocks.find(b => b.id === selectedBlockId);
      if (block) {
        // Close all sections first
        setShowKPIGrid(false);
        setShowChart(false);
        setShowTable(false);
        setShowHeading(false);
        setShowTimeline(false);
        setShowText(false);
        setShowComparison(false);
        setShowGauge(false);
        setShowImage(false);
        setShowDivider(false);
        setShowSpacer(false);

        // Open the relevant section based on block type
        switch (block.type) {
          case 'kpi-grid':
            setShowKPIGrid(true);
            break;
          case 'chart':
            setShowChart(true);
            break;
          case 'table':
            setShowTable(true);
            break;
          case 'heading':
            setShowHeading(true);
            setHeadingText(block.config.text || '');
            break;
          case 'text':
            setShowText(true);
            setTextContent(block.config.content || '');
            break;
          case 'timeline':
            setShowTimeline(true);
            break;
          case 'comparison':
            setShowComparison(true);
            break;
          case 'gauge':
            setShowGauge(true);
            break;
          case 'image':
            setShowImage(true);
            break;
          case 'divider':
            setShowDivider(true);
            break;
          case 'spacer':
            setShowSpacer(true);
            break;
        }
      }
    }
  }, [selectedBlockId, blocks]);

  const handleAddKPIGrid = (config: any) => {
    onAddBlock('kpi-grid', config);
    setShowKPIGrid(false);
  };

  const handleAddChart = (config: any) => {
    onAddBlock('chart', config);
    setShowChart(false);
  };

  const handleAddTable = (config: any) => {
    onAddBlock('table', config);
    setShowTable(false);
  };

  const handleAddHeading = () => {
    if (headingText.trim()) {
      onAddBlock('heading', { text: headingText.trim() });
      setHeadingText('');
      setShowHeading(false);
    }
  };

  const handleAddTimeline = () => {
    onAddBlock('timeline', {
      title: 'Upcoming Deadlines',
      daysAhead: 30,
    });
    setShowTimeline(false);
  };

  const handleAddText = () => {
    if (textContent.trim()) {
      onAddBlock('text', { content: textContent.trim() });
      setTextContent('');
      setShowText(false);
    }
  };

  const handleAddComparison = (config: any) => {
    onAddBlock('comparison', config);
    setShowComparison(false);
  };

  const handleAddGauge = (config: any) => {
    onAddBlock('gauge', config);
    setShowGauge(false);
  };

  const handleAddImage = (config: any) => {
    onAddBlock('image', config);
    setShowImage(false);
  };

  const handleAddDivider = (config: any) => {
    onAddBlock('divider', config);
    setShowDivider(false);
  };

  const handleAddSpacer = () => {
    onAddBlock('spacer', { size: spacerSize });
    setShowSpacer(false);
  };

  return (
    <div className="w-96 bg-white border-r border-slate-200 flex flex-col h-full">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Report Details */}
        <ReportDetailsForm
          details={details}
          onUpdate={onUpdateDetails}
        />

        {/* Added Blocks List */}
        <AddedBlocksList
          blocks={blocks}
          selectedBlockId={selectedBlockId}
          onSelectBlock={onSelectBlock}
          onRemoveBlock={onRemoveBlock}
        />

        {/* Add Blocks Section */}
        <div className="px-6 pb-6">
          <div className="mb-3">
            <h3 className="text-xs font-medium text-slate-600">Add Blocks</h3>
          </div>

          <div className="space-y-1">
            {/* KPI Grid */}
            {!showKPIGrid ? (
              <button
                onClick={() => setShowKPIGrid(true)}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 py-1 w-full"
              >
                <Plus className="h-4 w-4" />
                Add KPI Grid
              </button>
            ) : (
              <div className="space-y-2 py-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Grid className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">KPI Grid</span>
                  </div>
                  <button
                    onClick={() => setShowKPIGrid(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="pl-6">
                  <KPIGridConfig onAdd={handleAddKPIGrid} />
                </div>
              </div>
            )}

            {/* Chart */}
            {!showChart ? (
              <button
                onClick={() => setShowChart(true)}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 py-1 w-full"
              >
                <Plus className="h-4 w-4" />
                Add Chart
              </button>
            ) : (
              <div className="space-y-2 py-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">Chart</span>
                  </div>
                  <button
                    onClick={() => setShowChart(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="pl-6">
                  <ChartConfig onAdd={handleAddChart} />
                </div>
              </div>
            )}

            {/* Table */}
            {!showTable ? (
              <button
                onClick={() => setShowTable(true)}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 py-1 w-full"
              >
                <Plus className="h-4 w-4" />
                Add Table
              </button>
            ) : (
              <div className="space-y-2 py-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Table className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">Table</span>
                  </div>
                  <button
                    onClick={() => setShowTable(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="pl-6">
                  <TableConfig onAdd={handleAddTable} />
                </div>
              </div>
            )}

            {/* Heading */}
            {!showHeading ? (
              <button
                onClick={() => setShowHeading(true)}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 py-1 w-full"
              >
                <Plus className="h-4 w-4" />
                Add Heading
              </button>
            ) : (
              <div className="space-y-2 py-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Type className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">Heading</span>
                  </div>
                  <button
                    onClick={() => {
                      setShowHeading(false);
                      setHeadingText('');
                    }}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="pl-6 space-y-3">
                  <input
                    type="text"
                    value={headingText}
                    onChange={(e) => setHeadingText(e.target.value)}
                    placeholder="Section heading..."
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <button
                    onClick={handleAddHeading}
                    disabled={!headingText.trim()}
                    className="w-full px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add to Report
                  </button>
                </div>
              </div>
            )}

            {/* Timeline */}
            {!showTimeline ? (
              <button
                onClick={() => setShowTimeline(true)}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 py-1 w-full"
              >
                <Plus className="h-4 w-4" />
                Add Timeline
              </button>
            ) : (
              <div className="space-y-2 py-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">Timeline</span>
                  </div>
                  <button
                    onClick={() => setShowTimeline(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="pl-6 space-y-3">
                  <div className="text-xs text-slate-500">
                    Shows upcoming order deadlines for the next 30 days
                  </div>
                  <button
                    onClick={handleAddTimeline}
                    className="w-full px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded hover:bg-slate-800"
                  >
                    Add to Report
                  </button>
                </div>
              </div>
            )}

            {/* Text */}
            {!showText ? (
              <button
                onClick={() => setShowText(true)}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 py-1 w-full"
              >
                <Plus className="h-4 w-4" />
                Add Text
              </button>
            ) : (
              <div className="space-y-2 py-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">Text</span>
                  </div>
                  <button
                    onClick={() => {
                      setShowText(false);
                      setTextContent('');
                    }}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="pl-6 space-y-3">
                  <textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Add paragraph text..."
                    rows={4}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    autoFocus
                  />
                  <button
                    onClick={handleAddText}
                    disabled={!textContent.trim()}
                    className="w-full px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add to Report
                  </button>
                </div>
              </div>
            )}

            {/* Metric Comparison */}
            {!showComparison ? (
              <button
                onClick={() => setShowComparison(true)}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 py-1 w-full"
              >
                <Plus className="h-4 w-4" />
                Add Metric Comparison
              </button>
            ) : (
              <div className="space-y-2 py-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">Metric Comparison</span>
                  </div>
                  <button
                    onClick={() => setShowComparison(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="pl-6">
                  <MetricComparisonConfig onAdd={handleAddComparison} />
                </div>
              </div>
            )}

            {/* Gauge */}
            {!showGauge ? (
              <button
                onClick={() => setShowGauge(true)}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 py-1 w-full"
              >
                <Plus className="h-4 w-4" />
                Add Gauge
              </button>
            ) : (
              <div className="space-y-2 py-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">Gauge</span>
                  </div>
                  <button
                    onClick={() => setShowGauge(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="pl-6">
                  <GaugeConfig onAdd={handleAddGauge} />
                </div>
              </div>
            )}

            {/* Image */}
            {!showImage ? (
              <button
                onClick={() => setShowImage(true)}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 py-1 w-full"
              >
                <Plus className="h-4 w-4" />
                Add Image
              </button>
            ) : (
              <div className="space-y-2 py-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">Image</span>
                  </div>
                  <button
                    onClick={() => setShowImage(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="pl-6">
                  <ImageConfig onAdd={handleAddImage} />
                </div>
              </div>
            )}

            {/* Divider */}
            {!showDivider ? (
              <button
                onClick={() => setShowDivider(true)}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 py-1 w-full"
              >
                <Plus className="h-4 w-4" />
                Add Divider
              </button>
            ) : (
              <div className="space-y-2 py-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Minus className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">Divider</span>
                  </div>
                  <button
                    onClick={() => setShowDivider(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="pl-6">
                  <DividerConfig onAdd={handleAddDivider} />
                </div>
              </div>
            )}

            {/* Spacer */}
            {!showSpacer ? (
              <button
                onClick={() => setShowSpacer(true)}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 py-1 w-full"
              >
                <Plus className="h-4 w-4" />
                Add Spacer
              </button>
            ) : (
              <div className="space-y-2 py-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Space className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">Spacer</span>
                  </div>
                  <button
                    onClick={() => setShowSpacer(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="pl-6 space-y-3">
                  <div>
                    <label className="text-xs text-slate-600 block mb-1.5">Size</label>
                    <select
                      value={spacerSize}
                      onChange={(e) => setSpacerSize(e.target.value as any)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                  <button
                    onClick={handleAddSpacer}
                    className="w-full px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded hover:bg-slate-800"
                  >
                    Add to Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
