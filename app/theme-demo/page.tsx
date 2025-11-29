/**
 * Theme Demo Overview Page
 *
 * Introduction and quick navigation to all design system sections.
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Palette,
  Box,
  Settings,
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const metadata = {
  title: 'Theme Demo - GuildManager',
  description: 'Complete design system and component showcase',
};

const sections = [
  {
    title: 'Tokens',
    description: 'Design tokens including colors and typography',
    icon: Palette,
    items: [
      { name: 'Colors', href: '/theme-demo/tokens/colors', description: 'Color palette and CSS variables' },
      { name: 'Typography', href: '/theme-demo/tokens/typography', description: 'Text styles and formatting' },
    ],
  },
  {
    title: 'Components',
    description: 'UI component library with live examples',
    icon: Box,
    items: [
      { name: 'Input', href: '/theme-demo/components/input', description: 'Text input fields' },
      { name: 'Switch', href: '/theme-demo/components/switch', description: 'Toggle switches' },
      { name: 'Badge', href: '/theme-demo/components/badge', description: 'Labels and status badges' },
      { name: 'Button', href: '/theme-demo/components/button', description: 'Action buttons' },
      { name: 'Dropdown Menu', href: '/theme-demo/components/dropdown-menu', description: 'Contextual menus' },
      { name: 'Tab Nav Links', href: '/theme-demo/components/tab-nav-links', description: 'Navigation tabs' },
      { name: 'Breadcrumb', href: '/theme-demo/components/breadcrumb', description: 'Navigation breadcrumbs' },
    ],
  },
  {
    title: 'Configuration',
    description: 'Theme customization and presets',
    icon: Settings,
    items: [
      { name: 'Color Editor', href: '/theme-demo/config/colors', description: 'Interactive color customization' },
      { name: 'Preview', href: '/theme-demo/config/preview', description: 'See all components together' },
      { name: 'Presets', href: '/theme-demo/config/presets', description: 'Pre-built color schemes' },
    ],
  },
  {
    title: 'Reference',
    description: 'Documentation and guidelines',
    icon: BookOpen,
    items: [
      { name: 'Documentation', href: '/theme-demo/reference', description: 'Complete design system reference' },
    ],
  },
];

export default function ThemeDemoPage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="space-y-4 pb-8 border-b-2 border-primary/20">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 px-4 py-1.5 text-sm font-medium text-primary border border-primary/30 shadow-sm">
          <Sparkles className="h-4 w-4" />
          <span>Design System Showcase</span>
        </div>
        <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
          GuildManager Design System
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          A comprehensive design system built with Next.js, Tailwind CSS, and shadcn/ui.
          Explore components, customize themes, and discover WoW-specific UI elements.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link href="/theme-demo/config/colors">
            <Palette className="mr-2 h-5 w-5" />
            Customize Theme
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/theme-demo/components/button">
            <Box className="mr-2 h-5 w-5" />
            Browse Components
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/theme-demo/reference">
            <BookOpen className="mr-2 h-5 w-5" />
            Documentation
          </Link>
        </Button>
      </div>

      {/* Features Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 pt-4">
        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
          <CardHeader>
            <CardTitle className="text-base text-primary">Customizable</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Edit theme colors in real-time using CSS custom properties. No rebuild required.
            </p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
          <CardHeader>
            <CardTitle className="text-base text-primary">Accessible</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Built on Radix UI with full keyboard navigation and screen reader support.
            </p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
          <CardHeader>
            <CardTitle className="text-base text-primary">Responsive</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Mobile-first design that works seamlessly across all devices and screen sizes.
            </p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
          <CardHeader>
            <CardTitle className="text-base text-primary">Type-Safe</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Full TypeScript coverage with detailed prop types for excellent DX.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sections */}
      <div className="space-y-8 pt-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title} className="border-primary/20 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
              <CardHeader className="border-b border-primary/10">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 p-2.5 border border-primary/30">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-primary">{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group flex items-center justify-between rounded-lg border border-primary/20 p-4 transition-all duration-200 hover:bg-primary/5 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-all duration-200 group-hover:translate-x-1" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tech Stack */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm shadow-lg">
        <CardHeader className="border-b border-primary/10">
          <CardTitle className="text-primary">Built With Modern Tools</CardTitle>
          <CardDescription>
            Leveraging the best frameworks and libraries for a world-class developer experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Next.js 15</p>
              <p className="text-xs text-muted-foreground">React framework with App Router</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Tailwind CSS v4</p>
              <p className="text-xs text-muted-foreground">Utility-first CSS framework</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">shadcn/ui</p>
              <p className="text-xs text-muted-foreground">Accessible component primitives</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">TypeScript</p>
              <p className="text-xs text-muted-foreground">Type-safe JavaScript</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg shadow-primary/10">
        <CardHeader>
          <CardTitle>Get Started</CardTitle>
          <CardDescription>
            Begin exploring the design system with these recommended paths
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary text-primary-foreground w-6 h-6 flex items-center justify-center text-sm font-medium shrink-0">
                1
              </div>
              <div>
                <p className="text-sm font-medium">Explore Components</p>
                <p className="text-sm text-muted-foreground">
                  Browse the component library to see all available UI elements with live examples
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary text-primary-foreground w-6 h-6 flex items-center justify-center text-sm font-medium shrink-0">
                2
              </div>
              <div>
                <p className="text-sm font-medium">Customize Your Theme</p>
                <p className="text-sm text-muted-foreground">
                  Use the Color Editor to create a custom color scheme or choose from pre-built presets
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary text-primary-foreground w-6 h-6 flex items-center justify-center text-sm font-medium shrink-0">
                3
              </div>
              <div>
                <p className="text-sm font-medium">Review Documentation</p>
                <p className="text-sm text-muted-foreground">
                  Read the complete reference guide for implementation details and best practices
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
