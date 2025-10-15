'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, CheckCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QRScannerModal({ isOpen, onClose }: QRScannerModalProps) {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ success: boolean; itemCode?: string; message: string } | null>(null);

  // Mock scan function - in real app would use device camera
  const handleScan = () => {
    setScanning(true);
    
    // Simulate scanning delay
    setTimeout(() => {
      setScanning(false);
      
      // Mock successful scan - in real app would parse QR code
      const mockItemCodes = ['IC-001', 'IC-002', 'IC-003'];
      const randomCode = mockItemCodes[Math.floor(Math.random() * mockItemCodes.length)];
      
      setScanResult({
        success: true,
        itemCode: randomCode,
        message: 'Item scanned successfully!'
      });

      // Navigate after short delay
      setTimeout(() => {
        router.push(`/floor/items/${randomCode}`);
        onClose();
        setScanResult(null);
      }, 1500);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget && !scanning) {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Scan QR Code</h2>
              {!scanning && (
                <button
                  onClick={onClose}
                  className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Scanner Area */}
            <div className="p-6">
              {scanResult ? (
                // Scan result
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-8"
                >
                  {scanResult.success ? (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-green-900 mb-2">
                        Success!
                      </h3>
                      <p className="text-slate-600 mb-4">{scanResult.message}</p>
                      <p className="text-sm font-mono font-bold text-blue-600">
                        {scanResult.itemCode}
                      </p>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-red-900 mb-2">
                        Scan Failed
                      </h3>
                      <p className="text-slate-600">{scanResult.message}</p>
                    </>
                  )}
                </motion.div>
              ) : (
                <>
                  {/* Camera viewfinder mockup */}
                  <div className="relative aspect-square bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl overflow-hidden mb-6">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {scanning ? (
                        <motion.div
                          animate={{ 
                            y: ['-100%', '100%'],
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity,
                            ease: "linear"
                          }}
                          className="absolute w-full h-1 bg-blue-500 shadow-lg shadow-blue-500/50"
                        />
                      ) : (
                        <Camera className="w-24 h-24 text-white/30" />
                      )}
                    </div>
                    
                    {/* Scanning frame corners */}
                    <div className="absolute inset-8 border-2 border-white/50 rounded-lg">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-lg" />
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-lg" />
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-lg" />
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-lg" />
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="text-center mb-6">
                    <p className="text-slate-700 font-medium mb-2">
                      {scanning ? 'Scanning...' : 'Position QR code within frame'}
                    </p>
                    <p className="text-sm text-slate-500">
                      {scanning ? 'Please hold steady' : 'Tap the button below to scan'}
                    </p>
                  </div>

                  {/* Scan button */}
                  <button
                    onClick={handleScan}
                    disabled={scanning}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-4 rounded-xl hover:from-blue-600 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                  >
                    {scanning ? (
                      <motion.span
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        Scanning...
                      </motion.span>
                    ) : (
                      'Start Scan'
                    )}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

