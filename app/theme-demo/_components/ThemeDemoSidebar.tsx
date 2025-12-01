'use client';

/**
 * Theme Demo Sidebar Component
 *
 * Uses the shadcn collapsible sidebar for the theme-demo section.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Palette,
  Type,
  Box,
  BookOpen,
  Home,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navigationSections: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { title: 'Introduction', href: '/theme-demo', icon: Home },
      { title: 'Documentation', href: '/theme-demo/reference', icon: BookOpen },
    ],
  },
  {
    title: 'Tokens',
    items: [
      { title: 'Colors', href: '/theme-demo/tokens/colors', icon: Palette },
      { title: 'Typography', href: '/theme-demo/tokens/typography', icon: Type },
    ],
  },
  {
    title: 'Components',
    items: [
      { title: 'Input', href: '/theme-demo/components/input', icon: Box },
      { title: 'Switch', href: '/theme-demo/components/switch', icon: Box },
      { title: 'Badge', href: '/theme-demo/components/badge', icon: Box },
      { title: 'Button', href: '/theme-demo/components/button', icon: Box },
      { title: 'Dropdown Menu', href: '/theme-demo/components/dropdown-menu', icon: Box },
      { title: 'Tab Nav Links', href: '/theme-demo/components/tab-nav-links', icon: Box },
      { title: 'Breadcrumb', href: '/theme-demo/components/breadcrumb', icon: Box },
    ],
  },
  {
    title: 'Config',
    items: [
      { title: 'Theme Picker', href: '/theme-demo/config/presets', icon: Palette },
    ],
  },
];

export function ThemeDemoSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="relative overflow-hidden border-b border-sidebar-border bg-gradient-to-b from-primary/5 via-primary/[0.02] to-transparent">
        <div className="flex items-center gap-3 px-2 py-4">
          {isCollapsed ? (
            <div className="flex flex-col items-center justify-center w-full gap-2">
              <SidebarTrigger className="w-8 h-8" />
              <Palette className="h-6 w-6 text-primary" />
            </div>
          ) : (
            <>
              <div className="shrink-0">
                <Palette className="h-6 w-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="truncate text-base font-semibold text-primary">
                  Design System
                </h1>
                <p className="text-xs text-muted-foreground truncate">
                  Component library
                </p>
              </div>
              <SidebarTrigger className="-mr-1" />
            </>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navigationSections.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                      >
                        <Link href={item.href}>
                          <Icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="relative overflow-hidden border-t border-sidebar-border bg-gradient-to-t from-primary/5 via-primary/[0.02] to-transparent">
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-2 py-3">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="Back to Home"
            >
              <Link href="/">
                <Home className="h-4 w-4" />
              </Link>
            </Button>
            <ThemeToggle collapsed />
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2 px-2 py-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="flex-1 border-primary/30 hover:bg-primary/10 hover:border-primary/50"
            >
              <Link href="/">
                Back to Home
              </Link>
            </Button>
            <ThemeToggle />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
