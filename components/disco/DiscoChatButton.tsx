'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';
import { useDiscoChatStore } from '@/lib/disco/store/useDiscoChatStore';

export function DiscoChatButton() {
  const { isOpen, toggleDrawer } = useDiscoChatStore();

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleDrawer}
          className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          aria-label="Open Disco chat"
        >
          <MessageSquare className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

