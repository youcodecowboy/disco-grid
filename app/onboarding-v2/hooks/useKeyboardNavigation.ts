/**
 * Keyboard Navigation Hook
 * 
 * Provides keyboard shortcuts for navigating the onboarding flow
 */

import { useEffect } from 'react';

interface KeyboardNavigationOptions {
  onNext: () => void;
  onBack: () => void;
  canGoNext: boolean;
  canGoBack: boolean;
  isModalOpen?: boolean;
}

export function useKeyboardNavigation({
  onNext,
  onBack,
  canGoNext,
  canGoBack,
  isModalOpen = false,
}: KeyboardNavigationOptions) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't handle keyboard shortcuts if a modal is open
      if (isModalOpen) return;

      // Don't handle if user is typing in an input/textarea
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      switch (event.key) {
        case 'ArrowRight':
        case 'Enter':
          if (canGoNext && !event.shiftKey) {
            event.preventDefault();
            onNext();
          }
          break;

        case 'ArrowLeft':
          if (canGoBack) {
            event.preventDefault();
            onBack();
          }
          break;

        case 'Tab':
          // Allow default Tab behavior for accessibility
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onNext, onBack, canGoNext, canGoBack, isModalOpen]);
}

