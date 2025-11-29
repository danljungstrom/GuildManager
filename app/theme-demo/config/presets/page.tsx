'use client';

/**
 * Theme Presets Config Page
 *
 * Pre-built theme color schemes that can be applied with one click.
 */

import { useState, useEffect } from 'react';
import { ComponentDemoLayout, DemoSection } from '../../_components/component-demo-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ThemeColors } from '@/lib/types/guild-config.types';
import { DEFAULT_THEME_COLORS, DEFAULT_DARK_THEME_COLORS } from '@/lib/types/guild-config.types';

interface ThemePreset {
  id: string;
  name: string;
  description: string;
  colors: Partial<ThemeColors>;
  preview: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const themePresets: ThemePreset[] = [
  {
    id: 'default',
    name: 'Default (Gold)',
    description: 'Classic WoW-inspired gold and bronze theme',
    colors: {
      primary: '41 40% 60%',
      primaryForeground: '20 14.3% 4.1%',
      accent: '41 40% 60%',
      accentForeground: '20 14.3% 4.1%',
      ring: '41 40% 60%',
    },
    preview: {
      primary: 'hsl(41 40% 60%)',
      secondary: 'hsl(24 9.8% 10%)',
      accent: 'hsl(41 40% 60%)',
    },
  },
  {
    id: 'alliance-blue',
    name: 'Alliance Blue',
    description: 'Noble blue theme inspired by the Alliance faction',
    colors: {
      primary: '217 91% 60%',
      primaryForeground: '0 0% 100%',
      accent: '43 100% 65%',
      accentForeground: '20 14.3% 4.1%',
      ring: '217 91% 60%',
    },
    preview: {
      primary: 'hsl(217 91% 60%)',
      secondary: 'hsl(217 91% 20%)',
      accent: 'hsl(43 100% 65%)',
    },
  },
  {
    id: 'horde-red',
    name: 'Horde Red',
    description: 'Bold red theme inspired by the Horde faction',
    colors: {
      primary: '0 70% 50%',
      primaryForeground: '0 0% 100%',
      accent: '25 100% 50%',
      accentForeground: '0 0% 100%',
      ring: '0 70% 50%',
    },
    preview: {
      primary: 'hsl(0 70% 50%)',
      secondary: 'hsl(0 70% 20%)',
      accent: 'hsl(25 100% 50%)',
    },
  },
  {
    id: 'emerald-dream',
    name: 'Emerald Dream',
    description: 'Nature-inspired green theme for Druid guilds',
    colors: {
      primary: '142 76% 36%',
      primaryForeground: '0 0% 100%',
      accent: '28 100% 51%',
      accentForeground: '0 0% 100%',
      ring: '142 76% 36%',
    },
    preview: {
      primary: 'hsl(142 76% 36%)',
      secondary: 'hsl(142 71% 15%)',
      accent: 'hsl(28 100% 51%)',
    },
  },
  {
    id: 'arcane-purple',
    name: 'Arcane Purple',
    description: 'Mystical purple theme for Mage and Warlock guilds',
    colors: {
      primary: '270 50% 50%',
      primaryForeground: '0 0% 100%',
      accent: '200 80% 50%',
      accentForeground: '0 0% 100%',
      ring: '270 50% 50%',
    },
    preview: {
      primary: 'hsl(270 50% 50%)',
      secondary: 'hsl(270 50% 20%)',
      accent: 'hsl(200 80% 50%)',
    },
  },
];

export default function ThemePresetsPage() {
  const [activePreset, setActivePreset] = useState<string>('default');

  const applyPreset = (preset: ThemePreset) => {
    setActivePreset(preset.id);

    // Apply only the preset colors (primary/accent)
    // Background/foreground are controlled by theme (dark/light)
    Object.entries(preset.colors).forEach(([key, value]) => {
      const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      document.documentElement.style.setProperty(cssVarName, value);
    });
  };

  useEffect(() => {
    // Listen for theme changes and reapply active preset
    const handleThemeChange = () => {
      const currentPreset = themePresets.find(p => p.id === activePreset);
      if (currentPreset) {
        // Reapply preset colors after theme switch
        applyPreset(currentPreset);
      }
    };

    window.addEventListener('themechange', handleThemeChange);
    return () => window.removeEventListener('themechange', handleThemeChange);
  }, [activePreset]);

  return (
    <ComponentDemoLayout
      title="Theme Presets"
      description="Pre-built color schemes that can be applied with one click. Perfect starting points for your guild's branding."
    >
      {/* Live Preview */}
      <DemoSection
        title="Current Theme Preview"
        description="See how the selected preset looks on actual components"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button>Primary Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge>Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Sample Card</CardTitle>
              <CardDescription>
                This card shows how the selected theme preset affects components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Card content with muted foreground text demonstrating theme application.
              </p>
            </CardContent>
          </Card>
        </div>
      </DemoSection>

      {/* Preset Selection */}
      <DemoSection
        title="Available Presets"
        description="Click a preset to apply it immediately"
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {themePresets.map((preset) => (
            <Card
              key={preset.id}
              className={cn(
                'cursor-pointer transition-all hover:shadow-lg',
                activePreset === preset.id && 'ring-2 ring-primary'
              )}
              onClick={() => applyPreset(preset)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{preset.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {preset.description}
                    </CardDescription>
                  </div>
                  {activePreset === preset.id && (
                    <div className="rounded-full bg-primary p-1">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Color Preview</p>
                  <div className="flex gap-2">
                    <div
                      className="h-10 flex-1 rounded border"
                      style={{ backgroundColor: preset.preview.primary }}
                      title="Primary"
                    />
                    <div
                      className="h-10 flex-1 rounded border"
                      style={{ backgroundColor: preset.preview.secondary }}
                      title="Secondary"
                    />
                    <div
                      className="h-10 flex-1 rounded border"
                      style={{ backgroundColor: preset.preview.accent }}
                      title="Accent"
                    />
                  </div>
                  <Button
                    variant={activePreset === preset.id ? 'default' : 'outline'}
                    size="sm"
                    className="w-full mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      applyPreset(preset);
                    }}
                  >
                    {activePreset === preset.id ? 'Active' : 'Apply Theme'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DemoSection>

      {/* Customization Note */}
      <DemoSection title="Customization">
        <div className="prose prose-sm max-w-none">
          <div className="space-y-3 text-muted-foreground">
            <p>
              These presets are starting points that you can customize further using the{' '}
              <strong className="text-foreground">Color Editor</strong>.
            </p>
            <ol className="space-y-2">
              <li>Select a preset that's close to your desired look</li>
              <li>Navigate to the Color Editor page</li>
              <li>Fine-tune individual colors to match your guild's branding</li>
              <li>Export the final configuration when satisfied</li>
            </ol>
          </div>
        </div>
      </DemoSection>

      {/* Faction Themes */}
      <DemoSection title="Faction-Specific Themes">
        <div className="prose prose-sm max-w-none">
          <div className="space-y-3 text-muted-foreground">
            <p>
              <strong className="text-foreground">Alliance Blue</strong> - Perfect for Alliance
              guilds, featuring the iconic blue and gold color scheme.
            </p>
            <p>
              <strong className="text-foreground">Horde Red</strong> - Ideal for Horde guilds,
              with bold red tones and orange accents.
            </p>
            <p>
              These faction themes create instant brand recognition and help establish your
              guild's identity in the WoW community.
            </p>
          </div>
        </div>
      </DemoSection>

      {/* Class Themes */}
      <DemoSection title="Class-Themed Presets">
        <div className="prose prose-sm max-w-none">
          <div className="space-y-3 text-muted-foreground">
            <p>
              <strong className="text-foreground">Emerald Dream</strong> - Nature-inspired green
              palette perfect for Druid-focused guilds.
            </p>
            <p>
              <strong className="text-foreground">Arcane Purple</strong> - Mystical theme suited
              for Mage and Warlock guilds emphasizing magical prowess.
            </p>
            <p>
              Class-themed presets help guilds with specific class focuses establish a unique
              visual identity.
            </p>
          </div>
        </div>
      </DemoSection>
    </ComponentDemoLayout>
  );
}
