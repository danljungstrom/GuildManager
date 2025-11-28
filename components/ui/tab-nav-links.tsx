'use client';

/**
 * Tab Nav Links Component
 *
 * Navigation tabs component using links instead of controlled state.
 * Useful for page-level navigation where each tab represents a different route.
 */

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface TabNavLinksProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const TabNavLinks = React.forwardRef<HTMLDivElement, TabNavLinksProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabNavLinks.displayName = 'TabNavLinks';

export interface TabNavLinkProps
  extends React.ComponentPropsWithoutRef<typeof Link> {
  active?: boolean;
}

const TabNavLink = React.forwardRef<HTMLAnchorElement, TabNavLinkProps>(
  ({ className, active, ...props }, ref) => {
    return (
      <Link
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          active
            ? 'bg-background text-foreground shadow'
            : 'hover:bg-background/50 hover:text-foreground',
          className
        )}
        {...props}
      />
    );
  }
);
TabNavLink.displayName = 'TabNavLink';

export { TabNavLinks, TabNavLink };
