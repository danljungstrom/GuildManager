'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useGuild } from '@/lib/contexts/GuildContext';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { applyStoredTheme } from '@/lib/stores/theme-store';
import type { ThemeMode } from '@/lib/utils/theme-cookie';

interface AppLayoutClientProps {
  children: React.ReactNode;
  initialTheme: ThemeMode;
}

/**
 * Client-side layout wrapper
 * Handles theme application and conditional sidebar rendering
 * Uses server-fetched guild config and theme (no loading/flash)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function AppLayoutClient({ children, initialTheme }: AppLayoutClientProps) {
  const { config } = useGuild();
  const pathname = usePathname();

  // Apply stored theme on mount (for guild-specific theme colors)
  // Note: initialTheme is used by the server to set the correct theme class on HTML element
  // before hydration, preventing flash of wrong theme
  useEffect(() => {
    applyStoredTheme();
  }, []);

  // Theme-demo has its own layout - don't wrap with AppSidebar
  const isThemeDemo = pathname?.startsWith('/theme-demo');
  if (isThemeDemo) {
    return (
      <main role="main" className="min-h-screen w-full">
        {children}
      </main>
    );
  }

  // When no config exists (setup wizard), don't show sidebar
  if (!config) {
    return (
      <main role="main" className="min-h-screen w-full">
        {children}
      </main>
    );
  }

  // Normal layout with sidebar
  return (
    <SidebarProvider>
      <AppSidebar />
      <main role="main" className="min-h-screen w-full">
        {children}
      </main>
    </SidebarProvider>
  );
}
