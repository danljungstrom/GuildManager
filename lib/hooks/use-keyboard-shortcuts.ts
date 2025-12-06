/**
 * Keyboard Shortcuts Hook
 *
 * Provides global keyboard shortcuts for power users
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const matchingShortcut = shortcuts.find(
        (shortcut) =>
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          event.ctrlKey === (shortcut.ctrlKey || false) &&
          event.shiftKey === (shortcut.shiftKey || false) &&
          event.altKey === (shortcut.altKey || false)
      );

      if (matchingShortcut) {
        event.preventDefault();
        matchingShortcut.action();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts, enabled]);
}

/**
 * Global keyboard shortcuts for the app
 */
export function useGlobalKeyboardShortcuts() {
  const router = useRouter();

  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'k',
      ctrlKey: true,
      action: () => {
        // TODO: Open command palette / search
        console.log('Command palette (Ctrl+K)');
      },
      description: 'Open command palette',
    },
    {
      key: 'r',
      ctrlKey: true,
      action: () => router.push('/roster'),
      description: 'Go to roster',
    },
    {
      key: 'h',
      ctrlKey: true,
      action: () => router.push('/'),
      description: 'Go to home',
    },
    {
      key: '/',
      ctrlKey: true,
      action: () => {
        // TODO: Focus search
        console.log('Focus search (Ctrl+/)');
      },
      description: 'Focus search',
    },
  ];

  useKeyboardShortcuts(shortcuts);
}
