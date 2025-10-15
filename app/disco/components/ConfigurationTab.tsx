'use client';

import { motion } from 'framer-motion';
import { ScanningModelConfig } from '../types';
import { Settings, Zap, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConfigurationTabProps {
  config: ScanningModelConfig;
  onUpdateConfig: (config: Partial<ScanningModelConfig>) => void;
}

export function ConfigurationTab({ config, onUpdateConfig }: ConfigurationTabProps) {
  const toggleRecordType = (type: string) => {
    const updated = config.recordTypes.map(rt =>
      rt.type === type ? { ...rt, enabled: !rt.enabled } : rt
    );
    onUpdateConfig({ recordTypes: updated });
  };
  
  const toggleAction = (action: keyof typeof config.actions) => {
    onUpdateConfig({
      actions: {
        ...config.actions,
        [action]: !config.actions[action]
      }
    });
  };
  
  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <h2 className="text-lg font-bold text-gray-900 mb-1">AI Configuration</h2>
        <p className="text-sm text-gray-600">Configure specialized AI models for different use cases</p>
      </motion.div>
      
      {/* Scanning Model Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg border border-gray-200 p-4 mb-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-md bg-blue-100">
            <Settings className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Scanning Model</h3>
            <p className="text-xs text-gray-600">AI that processes data at the input layer</p>
          </div>
        </div>
        
        {/* Record Types */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">What to Scan</h4>
          <div className="grid grid-cols-2 gap-2">
            {config.recordTypes.map((rt) => (
              <motion.button
                key={rt.type}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => toggleRecordType(rt.type)}
                className={`flex items-center justify-between p-3 rounded-md border transition-all ${
                  rt.enabled
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {rt.enabled ? (
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                  )}
                  <span className={`text-sm font-medium ${rt.enabled ? 'text-blue-900' : 'text-gray-700'}`}>
                    {rt.type}
                  </span>
                </div>
                {rt.recommended && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                    Recommended
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>
        
        {/* Scan Frequency */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Scan Frequency</h4>
          <div className="grid grid-cols-4 gap-2">
            {['realtime', '5min', '15min', '1hour'].map((freq) => (
              <motion.button
                key={freq}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onUpdateConfig({ frequency: freq as any })}
                className={`p-2 rounded-md border text-sm font-medium transition-all ${
                  config.frequency === freq
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {freq === 'realtime' ? 'Real-time' : freq === '5min' ? 'Every 5m' : freq === '15min' ? 'Every 15m' : 'Every Hour'}
              </motion.button>
            ))}
          </div>
        </div>
        
        {/* Actions */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Scan Actions</h4>
          <div className="space-y-1.5">
            {Object.entries(config.actions).map(([key, value]) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.005 }}
                onClick={() => toggleAction(key as any)}
                className={`w-full flex items-center justify-between p-2.5 rounded-md border transition-all ${
                  value
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {value ? (
                    <Zap className="h-4 w-4 text-green-600" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                  )}
                  <span className={`text-sm font-medium ${value ? 'text-green-900' : 'text-gray-700'}`}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* Save Button */}
      <div className="flex justify-end mt-4">
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-9 px-6 text-sm">
          Save Configuration
        </Button>
      </div>
    </div>
  );
}

