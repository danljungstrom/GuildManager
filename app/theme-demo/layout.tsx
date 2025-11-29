'use client';

/**
 * Theme Demo Layout
 *
 * Provides persistent sidebar navigation for the entire theme-demo section.
 */

import { useState, useEffect } from 'react';
import { Sidebar, MobileSidebar } from './_components/sidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { applyStoredTheme } from '@/lib/stores/theme-store';

export default function ThemeDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Apply stored theme on mount
  useEffect(() => {
    applyStoredTheme();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:border-r lg:border-primary/20 lg:bg-card/80 lg:backdrop-blur-md lg:shadow-2xl lg:shadow-primary/5">
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
        <MobileSidebar
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 lg:pl-64">
          {/* Mobile Header */}
          <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-4 py-3 lg:hidden shadow-lg shadow-primary/5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
            <h1 className="text-lg font-bold text-primary">Theme Demo</h1>
          </header>

          {/* Content Area */}
          <main className="w-full">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
