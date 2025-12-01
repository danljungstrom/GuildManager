'use client';

import { Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useThemeStore } from '@/lib/stores/theme-store';
import { getThemePreset } from '@/lib/constants/theme-presets';

interface ThemeToggleProps {
  collapsed?: boolean;
}

export function ThemeToggle({ collapsed = false }: ThemeToggleProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const activePresetId = useThemeStore((state) => state.activePresetId);

  useEffect(() => {
    // Check initial theme
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = (checked?: boolean) => {
    // If called from switch, use the checked value; if from button, toggle
    const newTheme = checked !== undefined 
      ? (checked ? 'dark' : 'light')
      : (theme === 'dark' ? 'light' : 'dark');
    setTheme(newTheme);

    // Toggle dark class
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Reapply the current theme preset with the new light/dark colors
    const preset = getThemePreset(activePresetId);
    if (preset) {
      const colors = newTheme === 'dark' ? preset.colors.dark : preset.colors.light;
      
      // Apply color variables
      Object.entries(colors).forEach(([key, value]) => {
        const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        document.documentElement.style.setProperty(cssVarName, value);
      });

      // Apply typography (font) variables
      if (preset.typography) {
        document.documentElement.style.setProperty('--font-heading', preset.typography.headingFont);
      }
    }

    // Dispatch event so other components can react
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: newTheme } }));
  };

  // Collapsed mode - show button with current theme icon
  if (collapsed) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => toggleTheme()}
        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {theme === 'dark' ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
      </Button>
    );
  }

  // Expanded mode - show switch with both icons
  return (
    <div className="flex items-center gap-2">
      <Sun className="h-4 w-4 text-muted-foreground" />
      <Switch
        checked={theme === 'dark'}
        onCheckedChange={toggleTheme}
        aria-label="Toggle theme"
      />
      <Moon className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}
