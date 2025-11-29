'use client';

/**
 * Color Editor Config Page
 *
 * Interactive editor for customizing theme colors in real-time.
 */

import { useState, useEffect } from 'react';
import { ComponentDemoLayout, DemoSection } from '../../_components/component-demo-layout';
import { CodeBlock } from '../../_components/code-block';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { RotateCcw } from 'lucide-react';
import { DEFAULT_THEME_COLORS, DEFAULT_DARK_THEME_COLORS } from '@/lib/types/guild-config.types';

interface ColorValue {
  h: number;
  s: number;
  l: number;
}

function parseHSL(hsl: string): ColorValue {
  const [h, s, l] = hsl.split(' ').map((v) => parseFloat(v.replace('%', '')));
  return { h, s, l };
}

function formatHSL(color: ColorValue): string {
  return `${color.h} ${color.s}% ${color.l}%`;
}

export default function ColorEditorPage() {
  const [colors, setColors] = useState<Record<string, ColorValue>>({});
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Detect current theme
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);

    // Initialize colors from current theme defaults
    const themeDefaults = isDarkMode ? DEFAULT_DARK_THEME_COLORS : DEFAULT_THEME_COLORS;
    const initialColors: Record<string, ColorValue> = {};
    Object.entries(themeDefaults).forEach(([key, value]) => {
      initialColors[key] = parseHSL(value);
    });
    setColors(initialColors);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Apply colors to CSS variables
    Object.entries(colors).forEach(([key, value]) => {
      const cssVarName = `--${key
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase()}`;
      document.documentElement.style.setProperty(cssVarName, formatHSL(value));
    });
  }, [colors, mounted]);

  useEffect(() => {
    // Listen for theme changes from toggle
    const handleThemeChange = (e: CustomEvent) => {
      const newIsDark = e.detail.theme === 'dark';
      setIsDark(newIsDark);

      // Reset colors to new theme defaults
      const themeDefaults = newIsDark ? DEFAULT_DARK_THEME_COLORS : DEFAULT_THEME_COLORS;
      const newColors: Record<string, ColorValue> = {};
      Object.entries(themeDefaults).forEach(([key, value]) => {
        newColors[key] = parseHSL(value);
      });
      setColors(newColors);
    };

    window.addEventListener('themechange', handleThemeChange as EventListener);
    return () => window.removeEventListener('themechange', handleThemeChange as EventListener);
  }, []);

  const updateColor = (key: string, property: keyof ColorValue, value: number) => {
    setColors((prev) => ({
      ...prev,
      [key]: { ...prev[key], [property]: value },
    }));
  };

  const resetColors = () => {
    const themeDefaults = isDark ? DEFAULT_DARK_THEME_COLORS : DEFAULT_THEME_COLORS;
    const initialColors: Record<string, ColorValue> = {};
    Object.entries(themeDefaults).forEach(([key, value]) => {
      initialColors[key] = parseHSL(value);
    });
    setColors(initialColors);
  };

  const resetColor = (key: string) => {
    const themeDefaults = isDark ? DEFAULT_DARK_THEME_COLORS : DEFAULT_THEME_COLORS;
    const defaultValue = themeDefaults[key as keyof typeof themeDefaults];
    if (defaultValue) {
      setColors((prev) => ({
        ...prev,
        [key]: parseHSL(defaultValue),
      }));
    }
  };

  if (!mounted) {
    return (
      <ComponentDemoLayout
        title="Color Editor"
        description="Interactive editor for customizing theme colors in real-time."
      >
        <div className="text-center py-8 text-muted-foreground">Loading color editor...</div>
      </ComponentDemoLayout>
    );
  }

  const renderColorEditor = (key: string, label: string) => {
    const color = colors[key];
    if (!color) return null;

    return (
      <Card key={key} className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-semibold">{label}</Label>
              <p className="text-xs text-muted-foreground font-mono">
                --{key.replace(/([A-Z])/g, '-$1').toLowerCase()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-md border-2 border-border shadow-sm"
                style={{ backgroundColor: `hsl(${formatHSL(color)})` }}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => resetColor(key)}
                title="Reset to default"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Hue</Label>
                <span className="text-xs font-mono text-muted-foreground">{color.h}°</span>
              </div>
              <Slider
                value={[color.h]}
                onValueChange={(value) => updateColor(key, 'h', value[0])}
                max={360}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Saturation</Label>
                <span className="text-xs font-mono text-muted-foreground">{color.s}%</span>
              </div>
              <Slider
                value={[color.s]}
                onValueChange={(value) => updateColor(key, 's', value[0])}
                max={100}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Lightness</Label>
                <span className="text-xs font-mono text-muted-foreground">{color.l}%</span>
              </div>
              <Slider
                value={[color.l]}
                onValueChange={(value) => updateColor(key, 'l', value[0])}
                max={100}
                step={1}
              />
            </div>

            <div className="pt-2">
              <Label className="text-xs">HSL Value</Label>
              <Input
                value={formatHSL(color)}
                readOnly
                className="font-mono text-xs mt-1"
              />
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <ComponentDemoLayout
      title="Color Editor"
      description="Interactive editor for customizing theme colors in real-time. Changes are applied immediately to the entire page."
    >
      {/* Live Preview */}
      <DemoSection
        title="Live Preview"
        description="See how your color changes affect components in real-time"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button>Primary Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge>Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
          <Card className="p-4">
            <h4 className="font-semibold mb-2">Card Component</h4>
            <p className="text-sm text-muted-foreground">
              This card uses the theme colors you&apos;re editing. Notice how the background,
              border, and text colors update as you adjust the sliders below.
            </p>
          </Card>
        </div>
      </DemoSection>

      {/* Reset All */}
      <div className="flex justify-end">
        <Button variant="outline" onClick={resetColors}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset All Colors
        </Button>
      </div>

      {/* Primary Colors */}
      <DemoSection
        title="Primary Colors"
        description="Main brand colors used throughout the application"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {renderColorEditor('primary', 'Primary')}
          {renderColorEditor('primaryForeground', 'Primary Foreground')}
          {renderColorEditor('secondary', 'Secondary')}
          {renderColorEditor('secondaryForeground', 'Secondary Foreground')}
        </div>
      </DemoSection>

      {/* Background Colors */}
      <DemoSection
        title="Background Colors"
        description="Page and component backgrounds"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {renderColorEditor('background', 'Background')}
          {renderColorEditor('foreground', 'Foreground')}
          {renderColorEditor('card', 'Card')}
          {renderColorEditor('cardForeground', 'Card Foreground')}
        </div>
      </DemoSection>

      {/* Accent Colors */}
      <DemoSection
        title="Accent & Muted Colors"
        description="Accent highlights and muted elements"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {renderColorEditor('accent', 'Accent')}
          {renderColorEditor('accentForeground', 'Accent Foreground')}
          {renderColorEditor('muted', 'Muted')}
          {renderColorEditor('mutedForeground', 'Muted Foreground')}
        </div>
      </DemoSection>

      {/* Border & Input Colors */}
      <DemoSection
        title="Border & Input Colors"
        description="Form elements and borders"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {renderColorEditor('border', 'Border')}
          {renderColorEditor('input', 'Input')}
          {renderColorEditor('ring', 'Focus Ring')}
        </div>
      </DemoSection>

      {/* Export Code */}
      <DemoSection
        title="Export Configuration"
        description="Copy this configuration to use in your theme"
      >
        <CodeBlock
          code={`// Add to app/globals.css
:root {
${Object.entries(colors)
  .map(([key, value]) => {
    const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    return `  --${cssVar}: ${formatHSL(value)};`;
  })
  .join('\n')}
}`}
        />
      </DemoSection>

      {/* Usage Notes */}
      <DemoSection title="Usage Notes">
        <div className="prose prose-sm max-w-none">
          <ul className="space-y-2 text-muted-foreground">
            <li>All colors use HSL format for easy manipulation</li>
            <li>Changes are applied in real-time using CSS custom properties</li>
            <li>Foreground colors should have sufficient contrast with their background pairs</li>
            <li>Use the preview section to test color combinations</li>
            <li>Click the reset icon on individual colors to restore defaults</li>
            <li>Export the configuration when you&apos;re satisfied with your colors</li>
          </ul>
        </div>
      </DemoSection>
    </ComponentDemoLayout>
  );
}
