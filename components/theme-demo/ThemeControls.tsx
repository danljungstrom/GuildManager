'use client';

/**
 * ThemeControls Component
 *
 * Simulates the admin theme editing interface with live preview.
 * Allows changing theme colors and toggling dark mode.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockGuildConfig, alternativeThemes } from '@/lib/mock/mockGuildConfig';
import type { ThemeColors } from '@/lib/types/guild-config.types';
import { DEFAULT_THEME_COLORS, DEFAULT_DARK_THEME_COLORS } from '@/lib/types/guild-config.types';

type ThemeName = 'default' | 'horde' | 'tbc' | 'wotlk';

export function ThemeControls() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTheme, setActiveTheme] = useState<ThemeName>('default');

  const applyThemeColors = (themeName: ThemeName, isDarkMode: boolean = darkMode) => {
    const themes = {
      default: mockGuildConfig,
      ...alternativeThemes,
    };
    const theme = themes[themeName];
    if (!theme) return;

    const root = document.documentElement;
    const colors = theme.theme.colors;

    // Apply light mode colors to :root
    Object.entries(colors).forEach(([key, value]) => {
      // Convert camelCase to kebab-case (e.g., primaryForeground -> primary-foreground)
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      root.style.setProperty(`--${cssKey}`, value);
    });

    // If in dark mode, also apply appropriate dark mode colors
    if (isDarkMode) {
      const darkColors = {
        ...DEFAULT_DARK_THEME_COLORS,
        primary: colors.primary,
        primaryForeground: colors.primaryForeground,
        accent: colors.accent,
        accentForeground: colors.accentForeground,
        ring: colors.ring,
      };

      Object.entries(darkColors).forEach(([key, value]) => {
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        root.style.setProperty(`--${cssKey}`, value);
      });
    }
  };

  // Load saved theme from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme-demo-theme') as ThemeName | null;
      const savedDarkMode = localStorage.getItem('theme-demo-dark-mode');

      if (savedDarkMode !== null) {
        const isDark = savedDarkMode === 'true';
        setDarkMode(isDark);
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }

        if (savedTheme && ['default', 'horde', 'tbc', 'wotlk'].includes(savedTheme)) {
          setActiveTheme(savedTheme);
          applyThemeColors(savedTheme, isDark);
        }
      } else if (savedTheme && ['default', 'horde', 'tbc', 'wotlk'].includes(savedTheme)) {
        setActiveTheme(savedTheme);
        applyThemeColors(savedTheme, true);
      }
    }
  }, []);

  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
    if (typeof window !== 'undefined') {
      if (checked) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme-demo-dark-mode', String(checked));
      // Reapply theme colors to ensure proper dark/light mode colors
      applyThemeColors(activeTheme);
    }
  };

  const applyTheme = (themeName: ThemeName) => {
    setActiveTheme(themeName);
    applyThemeColors(themeName);

    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme-demo-theme', themeName);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Controls</CardTitle>
        <CardDescription>
          Simulate admin theme editing. These controls would update guild config in Firestore.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="dark-mode">Dark Mode</Label>
            <p className="text-sm text-muted-foreground">
              Toggle between light and dark themes
            </p>
          </div>
          <Switch
            id="dark-mode"
            checked={darkMode}
            onCheckedChange={handleDarkModeToggle}
          />
        </div>

        {/* Preset Themes */}
        <div className="space-y-3">
          <Label>Preset Themes</Label>
          <p className="text-sm text-muted-foreground">
            Apply pre-configured themes for different guilds and expansions
          </p>
          <Tabs value={activeTheme} onValueChange={(value) => applyTheme(value as ThemeName)} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="default">Default</TabsTrigger>
              <TabsTrigger value="horde">Horde</TabsTrigger>
              <TabsTrigger value="tbc">TBC</TabsTrigger>
              <TabsTrigger value="wotlk">WotLK</TabsTrigger>
            </TabsList>
            <TabsContent value="default" className="space-y-3">
              <div className="p-4 rounded-lg border bg-card">
                <h4 className="font-medium mb-2">Default Alliance Theme</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Classic gold and bronze color scheme inspired by WoW
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded border" style={{ backgroundColor: 'hsl(41 40% 60%)' }} />
                  <span className="text-xs text-muted-foreground">Primary: Gold/Bronze</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="horde" className="space-y-3">
              <div className="p-4 rounded-lg border bg-card">
                <h4 className="font-medium mb-2">Horde Theme</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Red color scheme for Horde guilds
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded border" style={{ backgroundColor: 'hsl(0 84% 40%)' }} />
                  <span className="text-xs text-muted-foreground">Primary: Crimson Red</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="tbc" className="space-y-3">
              <div className="p-4 rounded-lg border bg-card">
                <h4 className="font-medium mb-2">The Burning Crusade</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Green fel-energy inspired theme for TBC guilds
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded border" style={{ backgroundColor: 'hsl(142 76% 36%)' }} />
                  <span className="text-xs text-muted-foreground">Primary: Fel Green</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="wotlk" className="space-y-3">
              <div className="p-4 rounded-lg border bg-card">
                <h4 className="font-medium mb-2">Wrath of the Lich King</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Icy blue theme for WotLK guilds
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded border" style={{ backgroundColor: 'hsl(200 100% 50%)' }} />
                  <span className="text-xs text-muted-foreground">Primary: Frost Blue</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Guild Info */}
        <div className="space-y-3">
          <Label>Current Guild Configuration</Label>
          <div className="p-4 rounded-lg border bg-card space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Guild Name:</span>
              <span className="font-medium">{mockGuildConfig.metadata.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Server:</span>
              <span className="font-medium">{mockGuildConfig.metadata.server}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Region:</span>
              <span className="font-medium">{mockGuildConfig.metadata.region}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Faction:</span>
              <span className="font-medium">{mockGuildConfig.metadata.faction}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Expansion:</span>
              <span className="font-medium uppercase">{mockGuildConfig.metadata.expansion}</span>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="p-4 rounded-lg border bg-muted/50">
          <p className="text-sm text-muted-foreground">
            <strong>Live Theme Switching:</strong> The theme controls above actively update CSS custom properties in real-time.
            Try switching between themes and toggling dark mode to see instant visual updates across all components.
            Your preferences are saved to localStorage and will persist between sessions.
          </p>
        </div>

        {/* Active Theme Indicator */}
        <div className="p-4 rounded-lg border bg-primary/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Active Theme</p>
              <p className="text-xs text-muted-foreground mt-1">
                Currently applied: <strong className="capitalize">{activeTheme}</strong> ({darkMode ? 'Dark' : 'Light'} mode)
              </p>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
