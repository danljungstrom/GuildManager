'use client';

import { useEffect } from 'react';
import { ThemeDemoSidebar } from './_components/ThemeDemoSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { applyStoredTheme } from '@/lib/stores/theme-store';

export function ThemeDemoLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  // Apply stored theme on mount
  useEffect(() => {
    applyStoredTheme();
  }, []);

  return (
    <SidebarProvider defaultOpen={true}>
      <ThemeDemoSidebar />
      <main className="min-h-screen w-full">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-4 py-3 md:hidden shadow-lg shadow-primary/5">
          <SidebarTrigger />
          <h1 className="text-lg font-bold text-primary">Design System</h1>
        </header>

        {/* Content Area */}
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
