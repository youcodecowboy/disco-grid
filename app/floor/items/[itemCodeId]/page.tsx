'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Package } from 'lucide-react';
import { FloorHeader } from '@/components/floor/FloorHeader';
import { FloorFooter } from '@/components/floor/FloorFooter';
import { StageCard } from '@/components/floor/StageCard';
import { QRScannerModal } from '@/components/floor/QRScannerModal';
import { MessagesPanel } from '@/components/floor/MessagesPanel';
import { MenuPanel } from '@/components/floor/MenuPanel';
import { CURRENT_FLOOR_WORKER } from '@/lib/data/floorWorkers';
import { MOCK_ITEM_CODES } from '@/lib/data/itemCodes';
import { MOCK_LINE_ITEMS } from '@/lib/data/lineItems';
import { getMessagesByWorker, getUnreadMessageCount } from '@/lib/data/floorMessages';

export default function FloorItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [scannerOpen, setScannerOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const worker = CURRENT_FLOOR_WORKER;
  const messages = getMessagesByWorker(worker.id);
  const unreadCount = getUnreadMessageCount(worker.id);

  // Find the item code
  const itemCode = MOCK_ITEM_CODES.find(ic => ic.id === params.itemCodeId) || MOCK_ITEM_CODES[0];
  
  // Get line items for this item code (in production status)
  const lineItems = MOCK_LINE_ITEMS.filter(
    li => li.itemCodeId === itemCode.id && li.status === 'In Production'
  );
  
  // For demo, use the first in-production line item
  const currentLineItem = lineItems[0] || MOCK_LINE_ITEMS[0];

  // Mock stage inputs based on current stage
  const getStageInputs = (stageName: string) => {
    const baseInputs = [
      {
        id: 'input-qr',
        type: 'qr-scan' as const,
        label: 'Scan item QR code',
        required: true,
        completed: true
      }
    ];

    switch (stageName.toLowerCase()) {
      case 'cutting':
        return [
          ...baseInputs,
          {
            id: 'input-fabric',
            type: 'qr-scan' as const,
            label: 'Scan fabric roll',
            required: true,
            completed: false
          },
          {
            id: 'input-photo-before',
            type: 'photo' as const,
            label: 'Photo before cutting',
            required: false,
            completed: false
          }
        ];
      case 'sewing':
        return [
          ...baseInputs,
          {
            id: 'input-pieces',
            type: 'number' as const,
            label: 'Count cut pieces',
            required: true,
            completed: false
          },
          {
            id: 'input-photo-progress',
            type: 'photo' as const,
            label: 'Progress photo',
            required: false,
            completed: false
          },
          {
            id: 'input-quality-check',
            type: 'checkbox' as const,
            label: 'Quality check passed',
            required: true,
            completed: false
          }
        ];
      case 'finishing':
        return [
          ...baseInputs,
          {
            id: 'input-inspection',
            type: 'checkbox' as const,
            label: 'Visual inspection',
            required: true,
            completed: false
          },
          {
            id: 'input-photo-final',
            type: 'photo' as const,
            label: 'Final product photo',
            required: true,
            completed: false
          },
          {
            id: 'input-packaging',
            type: 'checkbox' as const,
            label: 'Packaging complete',
            required: true,
            completed: false
          }
        ];
      default:
        return baseInputs;
    }
  };

  const stageInputs = getStageInputs(currentLineItem.currentStage);

  const handleStageComplete = () => {
    alert(`Stage "${currentLineItem.currentStage}" completed!\n\nIn a real app, this would:\n- Update line item status\n- Record completion in history\n- Move to next stage\n- Update worker metrics`);
    router.push('/floor');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-24">
      {/* Header */}
      <FloorHeader />

      {/* Main Content */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto px-4 py-6 space-y-6"
      >
        {/* Back button */}
        <button
          onClick={() => router.push('/floor')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        {/* Item Info Banner */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-3">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900 mb-1">
                {itemCode.name}
              </h1>
              <p className="text-sm text-slate-600 mb-2">
                {itemCode.orderName} • Code: {itemCode.code}
              </p>
              <p className="text-sm text-slate-700 font-medium">
                Line Item: {currentLineItem.fullSerialNumber}
              </p>
            </div>
            <button
              onClick={() => router.push(`/items/${itemCode.id}`)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Full Details</span>
            </button>
          </div>

          {/* Progress Overview */}
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-700">Overall Progress</span>
              <span className="text-sm font-bold text-blue-600">{currentLineItem.progress}%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${currentLineItem.progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-blue-500 to-blue-700"
              />
            </div>
          </div>
        </motion.div>

        {/* Current Stage Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-bold text-slate-900 mb-3">Current Stage</h2>
          <StageCard
            stageName={currentLineItem.currentStage}
            stageDescription={`Complete the ${currentLineItem.currentStage.toLowerCase()} stage for this item`}
            currentProgress={currentLineItem.progress}
            scheduleStatus={currentLineItem.scheduleStatus}
            estimatedDuration={90}
            location={currentLineItem.currentLocation}
            inputs={stageInputs}
            onComplete={handleStageComplete}
          />
        </motion.div>

        {/* Stage History */}
        {currentLineItem.stageHistory.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
          >
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">
              Completed Stages
            </h3>
            <div className="space-y-3">
              {currentLineItem.stageHistory.map((history, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-green-900">{history.stage}</div>
                    <div className="text-xs text-green-700">
                      Completed by {history.completedBy} • {history.duration}min
                    </div>
                  </div>
                  <div className="text-xs text-green-600 font-medium">
                    {new Date(history.completedAt || '').toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Notes */}
        {currentLineItem.notes && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-amber-50 border border-amber-200 rounded-xl p-4"
          >
            <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wide mb-2">
              Item Notes
            </h3>
            <p className="text-sm text-amber-800">{currentLineItem.notes}</p>
          </motion.div>
        )}
      </motion.main>

      {/* Footer */}
      <FloorFooter
        onScanClick={() => setScannerOpen(true)}
        onMessagesClick={() => setMessagesOpen(true)}
        onMenuClick={() => setMenuOpen(true)}
        unreadCount={unreadCount}
      />

      {/* Modals/Panels */}
      <QRScannerModal isOpen={scannerOpen} onClose={() => setScannerOpen(false)} />
      <MessagesPanel isOpen={messagesOpen} onClose={() => setMessagesOpen(false)} messages={messages} workerId={worker.id} workerName={worker.name} />
      <MenuPanel isOpen={menuOpen} onClose={() => setMenuOpen(false)} worker={worker} />
    </div>
  );
}

