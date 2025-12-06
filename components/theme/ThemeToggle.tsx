'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { setThemeCookie, getClientTheme, type ThemeMode } from '@/lib/utils/theme-cookie';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'default' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
}

/**
 * Theme Toggle Component
 *
 * Toggles between light and dark theme using cookies for SSR support.
 * No flash of wrong theme on page load.
 */
export function ThemeToggle({ className, size = 'icon', variant = 'ghost' }: ThemeToggleProps) {
  const [theme, setTheme] = React.useState<ThemeMode>('dark');
  const [mounted, setMounted] = React.useState(false);

  // Get initial theme from cookie after mount
  React.useEffect(() => {
    setTheme(getClientTheme());
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';

    // Update cookie
    setThemeCookie(newTheme);

    // Update HTML class
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);

    // Update state
    setTheme(newTheme);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={toggleTheme}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
