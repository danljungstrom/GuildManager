'use client';

import { useGlobalKeyboardShortcuts } from '@/lib/hooks/use-keyboard-shortcuts';

/**
 * Provider component that enables global keyboard shortcuts
 */
export function KeyboardShortcutsProvider() {
  useGlobalKeyboardShortcuts();
  return null;
}
