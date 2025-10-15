'use client';

import { MessageSquare, QrCode, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

interface FloorFooterProps {
  onScanClick: () => void;
  onMessagesClick: () => void;
  onMenuClick: () => void;
  unreadCount?: number;
}

export function FloorFooter({ 
  onScanClick, 
  onMessagesClick, 
  onMenuClick,
  unreadCount = 0 
}: FloorFooterProps) {
  return (
    <motion.footer 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-blue-600 shadow-lg"
    >
      <div className="grid grid-cols-3 gap-0">
        {/* Messages */}
        <button
          onClick={onMessagesClick}
          className="relative flex flex-col items-center justify-center py-3 px-4 hover:bg-blue-700 transition-colors"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-white text-blue-600 text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <span className="text-xs font-medium text-blue-100 mt-1.5">Messages</span>
        </button>

        {/* QR Scanner - Large center button */}
        <button
          onClick={onScanClick}
          className="relative flex flex-col items-center justify-center py-2 px-4"
        >
          <motion.div
            whileTap={{ scale: 0.95 }}
            className="bg-white rounded-xl p-3 transition-colors hover:bg-blue-50"
          >
            <QrCode className="w-8 h-8 text-blue-600" strokeWidth={2.5} />
          </motion.div>
          <span className="text-xs font-semibold text-white mt-1.5">Scan</span>
        </button>

        {/* Menu */}
        <button
          onClick={onMenuClick}
          className="flex flex-col items-center justify-center py-3 px-4 hover:bg-blue-700 transition-colors"
        >
          <Menu className="w-5 h-5 text-white" />
          <span className="text-xs font-medium text-blue-100 mt-1.5">Menu</span>
        </button>
      </div>
    </motion.footer>
  );
}

