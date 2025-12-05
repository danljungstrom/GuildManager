/**
 * Theme Demo Layout
 *
 * Server component wrapper for theme demo section
 * Uses the shadcn collapsible sidebar for the theme-demo section.
 */

import { ThemeDemoLayoutClient } from './ThemeDemoLayoutClient';

export default function ThemeDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeDemoLayoutClient>{children}</ThemeDemoLayoutClient>;
}
