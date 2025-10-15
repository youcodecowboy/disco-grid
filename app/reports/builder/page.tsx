'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutScaffold } from '@/components/grid-v2/LayoutScaffold';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Send, Calendar, Save } from 'lucide-react';
import ReportBuilderSidebar from '@/components/reporting/ReportBuilderSidebar';
import ReportPreview from '@/components/reporting/ReportPreview';
import SchedulingModal from '@/components/reporting/SchedulingModal';
import SaveTemplateModal from '@/components/reporting/SaveTemplateModal';

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

export default function ReportBuilderPage() {
  const router = useRouter();
  
  // Report state
  const [reportDetails, setReportDetails] = useState<ReportDetails>({
    title: 'Untitled Report',
    recipients: [],
    creator: 'Current User',
    description: '',
    tags: [],
  });
  
  const [blocks, setBlocks] = useState<ReportBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  
  // Modal state
  const [showSchedulingModal, setShowSchedulingModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const handleAddBlock = (type: string, config: any) => {
    const newBlock: ReportBlock = {
      id: `block-${Date.now()}`,
      type,
      config,
      title: config.title || undefined,
    };
    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  const handleRemoveBlock = (blockId: string) => {
    setBlocks(blocks.filter(b => b.id !== blockId));
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  };

  const handleSelectBlock = (blockId: string) => {
    setSelectedBlockId(blockId);
  };

  const handleSendNow = () => {
    console.log('Sending report now:', { reportDetails, blocks });
    alert('Report generated and sent!');
  };

  const handleSchedule = () => {
    setShowSchedulingModal(true);
  };

  const handleSaveSchedule = (schedule: any) => {
    console.log('Schedule saved:', schedule);
    alert('Report scheduled successfully!');
  };

  const handleSaveTemplate = () => {
    setShowTemplateModal(true);
  };

  const handleTemplateSave = (template: any) => {
    console.log('Template saved:', template);
    alert(`Template "${template.name}" saved successfully!`);
  };

  return (
    <>
      <LayoutScaffold
        pageTitle={reportDetails.title || 'Report Builder'}
        pageSubtext="Create beautiful reports with data visualizations"
        headerActions={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/reports')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports
          </Button>
        }
      >
        <div className="flex h-[calc(100vh-8rem)] pb-20">
          <ReportBuilderSidebar
            onAddBlock={handleAddBlock}
            blocks={blocks}
            selectedBlockId={selectedBlockId}
            onSelectBlock={handleSelectBlock}
            onRemoveBlock={handleRemoveBlock}
            details={reportDetails}
            onUpdateDetails={setReportDetails}
          />
          <ReportPreview
            reportTitle={reportDetails.title}
            onTitleChange={(title) => setReportDetails({ ...reportDetails, title })}
            blocks={blocks}
            onRemoveBlock={handleRemoveBlock}
            selectedBlockId={selectedBlockId}
            onSelectBlock={handleSelectBlock}
          />
        </div>

        {/* Modals */}
        <SchedulingModal
          isOpen={showSchedulingModal}
          onClose={() => setShowSchedulingModal(false)}
          onSave={handleSaveSchedule}
        />

        <SaveTemplateModal
          isOpen={showTemplateModal}
          onClose={() => setShowTemplateModal(false)}
          onSave={handleTemplateSave}
        />
      </LayoutScaffold>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white px-8 py-4 flex items-center justify-between shadow-lg z-50">
        <div className="flex items-center gap-2">
          <div className="text-sm text-slate-600">
            <span className="font-medium">{blocks.length}</span> blocks added
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleSaveTemplate}
          >
            <Save className="h-4 w-4 mr-2" />
            Save as Template
          </Button>
          
          <Button
            variant="outline"
            onClick={handleSchedule}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Send
          </Button>
          
          <Button
            onClick={handleSendNow}
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4 mr-2" />
            Send Now
          </Button>
        </div>
      </div>
    </>
  );
}
