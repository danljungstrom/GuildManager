'use client';

/**
 * Sidebar Navigation Component
 *
 * Persistent navigation for the theme-demo section with responsive behavior.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Palette,
  Type,
  Box,
  BookOpen,
  ChevronRight,
  Home,
  X,
} from 'lucide-react';

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
      //{ title: 'Color Editor', href: '/theme-demo/config/colors', icon: Settings },
    ],
  },
];

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn('flex flex-col h-full', className)}>
      {/* Sidebar Header */}
      <div className="px-6 py-4 border-b border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
        <h2 className="text-lg font-bold text-primary tracking-wide">Design System</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Component library & theme configuration
        </p>
      </div>

      <Separator className="bg-primary/20" />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-6">
          {navigationSections.map((section) => (
            <div key={section.title}>
              <h3 className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200',
                        isActive
                          ? 'bg-gradient-to-r from-primary/15 to-primary/5 text-primary font-medium border-l-2 border-primary shadow-sm'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:translate-x-1'
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1">{item.title}</span>
                      {isActive && <ChevronRight className="h-4 w-4 shrink-0 text-primary" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      <Separator className="bg-primary/20" />

      {/* Sidebar Footer */}
      <div className="px-4 py-4 space-y-2 border-t border-primary/20 bg-gradient-to-t from-primary/5 to-transparent">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs text-muted-foreground font-medium">Theme</span>
          <ThemeToggle />
        </div>
        <Button variant="outline" size="sm" asChild className="w-full border-primary/30 hover:bg-primary/10 hover:border-primary/50">
          <Link href="/">
            Back to Home
          </Link>
        </Button>
      </div>
    </aside>
  );
}

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-72 bg-background border-r shadow-lg">
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-lg font-bold text-primary">Design System</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <Sidebar onNavigate={onClose} />
      </div>
    </>
  );
}
