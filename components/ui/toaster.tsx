'use client';

import { Toaster as SonnerToaster } from 'sonner';
import { useEffect, useState } from 'react';

/**
 * Toast Notification System
 *
 * Themed toast notifications using Sonner.
 * Automatically adapts to light/dark mode.
 */
export function Toaster() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Detect initial theme
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');

    // Listen for theme changes
    const handleThemeChange = (e: CustomEvent) => {
      setTheme(e.detail.theme);
    };

    window.addEventListener('themechange', handleThemeChange as EventListener);

    return () => {
      window.removeEventListener('themechange', handleThemeChange as EventListener);
    };
  }, []);

  return (
    <SonnerToaster
      theme={theme}
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: 'bg-background border-border',
          title: 'text-foreground',
          description: 'text-muted-foreground',
          actionButton: 'bg-primary text-primary-foreground',
          cancelButton: 'bg-muted text-muted-foreground',
          error: 'border-destructive/50 bg-destructive/10',
          success: 'border-primary/50 bg-primary/10',
          warning: 'border-yellow-500/50 bg-yellow-500/10',
          info: 'border-blue-500/50 bg-blue-500/10',
        },
      }}
      richColors
    />
  );
}
