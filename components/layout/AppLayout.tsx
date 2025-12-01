'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useGuild } from '@/lib/contexts/GuildContext';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { applyStoredTheme } from '@/lib/stores/theme-store';

interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * Conditional layout that shows the sidebar only when guild is configured
 * During setup wizard, no sidebar is shown
 * Theme-demo has its own layout and sidebar
 */
export function AppLayout({ children }: AppLayoutProps) {
  const { config, loading } = useGuild();
  const pathname = usePathname();

  // Apply stored theme on mount
  useEffect(() => {
    applyStoredTheme();
  }, []);

  // Theme-demo has its own layout - don't wrap with AppSidebar
  const isThemeDemo = pathname?.startsWith('/theme-demo');
  if (isThemeDemo) {
    return (
      <main className="min-h-screen w-full">
        {children}
      </main>
    );
  }

  // During loading or when no config exists (setup wizard), don't show sidebar
  if (loading || !config) {
    return (
      <main className="min-h-screen w-full">
        {children}
      </main>
    );
  }

  // Normal layout with sidebar
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="min-h-screen w-full">
        {children}
      </main>
    </SidebarProvider>
  );
}
