'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export function FloorHeader() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-blue-600"
    >
      <div className="flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/groovy-logo.png"
            alt="Groovy"
            width={120}
            height={36}
            className="h-7 w-auto brightness-0 invert"
            priority
          />
        </div>

        {/* Live Clock */}
        <div className="flex flex-col items-end">
          <div className="font-mono text-lg font-semibold text-white">
            {formatTime(time)}
          </div>
          <div className="text-xs text-blue-100 font-medium">
            {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>
    </motion.header>
  );
}

