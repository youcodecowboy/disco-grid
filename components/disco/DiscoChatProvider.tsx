'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { DiscoChatButton } from './DiscoChatButton';
import { DiscoChatDrawer } from './DiscoChatDrawer';
import { useDiscoChatStore } from '@/lib/disco/store/useDiscoChatStore';

export function DiscoChatProvider() {
  const pathname = usePathname();
  const { setCurrentPage, initialize } = useDiscoChatStore();

  // Update current page when route changes
  useEffect(() => {
    setCurrentPage(pathname);
  }, [pathname, setCurrentPage]);

  // Initialize on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <>
      <DiscoChatButton />
      <DiscoChatDrawer />
    </>
  );
}

