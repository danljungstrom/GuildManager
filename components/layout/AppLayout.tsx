import * as React from 'react';
import { AppLayoutClient } from './AppLayoutClient';
import type { ThemeMode } from '@/lib/utils/theme-cookie';

interface AppLayoutProps {
  children: React.ReactNode;
  initialTheme: ThemeMode;
}

/**
 * Server component wrapper for layout
 * Passes server-detected theme to client
 */
export function AppLayout({ children, initialTheme }: AppLayoutProps) {
  return (
    <AppLayoutClient initialTheme={initialTheme}>
      {children}
    </AppLayoutClient>
  );
}
