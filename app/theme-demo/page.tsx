/**
 * Theme Demo Page
 *
 * Comprehensive showcase of the design system including:
 * - Color palette with CSS variables
 * - All UI components in various states
 * - WoW-specific components
 * - Live theme editing controls
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ColorPalette } from '@/components/theme-demo/ColorPalette';
import { ComponentShowcase } from '@/components/theme-demo/ComponentShowcase';
import { ThemeControls } from '@/components/theme-demo/ThemeControls';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Theme Demo - GuildManager',
  description: 'Complete design system and component showcase',
};

export default function ThemeDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <h1 className="text-xl font-bold text-primary">Theme Demo</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/roster">Roster</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Introduction */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Design System & Theme Demo</h2>
            <p className="text-lg text-muted-foreground">
              A comprehensive showcase of all UI components, color systems, and WoW-specific
              elements. This page serves as living documentation for the GuildManager design
              system.
            </p>
          </div>

          <Separator className="my-8" />

          {/* Theme Controls */}
          <section>
            <h3 className="text-2xl font-bold tracking-tight mb-4">Theme Customization</h3>
            <p className="text-muted-foreground mb-6">
              Preview how administrators can customize the theme in real-time. These controls
              simulate the admin interface for guild branding.
            </p>
            <ThemeControls />
          </section>

          <Separator className="my-8" />

          {/* Color Palette */}
          <section>
            <h3 className="text-2xl font-bold tracking-tight mb-4">Color Palette</h3>
            <p className="text-muted-foreground mb-6">
              All colors are defined using CSS custom properties (CSS variables) in HSL format,
              allowing runtime customization without rebuilding the application.
            </p>
            <ColorPalette />
          </section>

          <Separator className="my-8" />

          {/* Component Showcase */}
          <section>
            <h3 className="text-2xl font-bold tracking-tight mb-4">Component Library</h3>
            <p className="text-muted-foreground mb-6">
              Complete showcase of all UI components including shadcn/ui base components and
              custom WoW-specific components.
            </p>
            <ComponentShowcase />
          </section>

          <Separator className="my-8" />

          {/* Design System Notes */}
          <section className="pb-16">
            <h3 className="text-2xl font-bold tracking-tight mb-4">Design System Notes</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="p-6 rounded-lg border bg-card">
                <h4 className="font-semibold mb-3">Responsive Design</h4>
                <p className="text-sm text-muted-foreground">
                  All components are fully responsive and adapt to mobile, tablet, and desktop
                  viewports using Tailwind's responsive utilities.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <h4 className="font-semibold mb-3">Accessibility</h4>
                <p className="text-sm text-muted-foreground">
                  Components are built on Radix UI primitives which provide excellent keyboard
                  navigation and ARIA support out of the box.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <h4 className="font-semibold mb-3">Dark Mode</h4>
                <p className="text-sm text-muted-foreground">
                  Full dark mode support using CSS variables. Toggle dark mode using the controls
                  above to see all components adapt automatically.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <h4 className="font-semibold mb-3">Type Safety</h4>
                <p className="text-sm text-muted-foreground">
                  All components are fully typed with TypeScript, providing excellent developer
                  experience and preventing runtime errors.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
