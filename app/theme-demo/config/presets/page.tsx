'use client';

/**
 * Theme Presets Config Page
 *
 * Pre-built theme color schemes that can be applied with one click.
 */

import { useEffect } from 'react';
import { ComponentDemoLayout, DemoSection } from '../../_components/component-demo-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAllThemePresets } from '@/lib/constants/theme-presets';
import { getThemeIcon } from '@/lib/constants/theme-icons';
import { useThemeStore } from '@/lib/stores/theme-store';

const themePresets = getAllThemePresets();

export default function ThemePresetsPage() {
  const { activePresetId, applyPreset } = useThemeStore();

  useEffect(() => {
    // Listen for theme changes and reapply active preset
    const handleThemeChange = () => {
      const currentPreset = themePresets.find(p => p.id === activePresetId);
      if (currentPreset) {
        // Reapply preset colors after theme switch
        applyPreset(currentPreset);
      }
    };

    window.addEventListener('themechange', handleThemeChange);
    return () => window.removeEventListener('themechange', handleThemeChange);
  }, [activePresetId, applyPreset]);

  return (
    <ComponentDemoLayout
      title="Theme Presets"
      description="Pre-built color schemes that can be applied with one click. Perfect starting points for your guild&apos;s branding."
    >

      {/* Preset Selection */}
      <DemoSection
        title="Available Presets"
        description="Click a preset to apply it immediately. Each theme includes unique colors and typography."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {themePresets.map((preset) => {
            const themeIcon = getThemeIcon(preset.id);
            const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
            const colors = isDark ? preset.colors.dark : preset.colors.light;

            return (
              <Card
                key={preset.id}
                className={cn(
                  'cursor-pointer transition-all hover:shadow-lg',
                  activePresetId === preset.id && 'ring-2 ring-primary'
                )}
                onClick={() => applyPreset(preset)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {themeIcon && (
                      <div
                        className="w-12 h-12 flex-shrink-0"
                        style={{
                          backgroundColor: `hsl(${colors.primary})`,
                          WebkitMask: `url(${themeIcon.svg}) center/contain no-repeat`,
                          mask: `url(${themeIcon.svg}) center/contain no-repeat`
                        }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <CardTitle
                        className="text-base"
                        style={{
                          fontFamily: `var(--font-heading-${preset.id})`,
                          fontSize: ['horde', 'alliance', 'shadow', 'frost'].includes(preset.id) ? '18px' : '16px'
                        }}
                      >
                        {preset.name}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {preset.description}
                      </CardDescription>
                    </div>
                    {activePresetId === preset.id && (
                      <div className="rounded-full bg-primary p-1 flex-shrink-0">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    variant={activePresetId === preset.id ? 'default' : 'outline'}
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      applyPreset(preset);
                    }}
                  >
                    {activePresetId === preset.id ? 'Active Theme' : 'Apply Theme'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DemoSection>

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

      {/* Customization Note */}
      <DemoSection title="About These Themes">
        <div className="prose prose-sm max-w-none">
          <div className="space-y-3 text-muted-foreground">
            <p>
              Each theme preset includes carefully selected <strong className="text-foreground">colors</strong> and{' '}
              <strong className="text-foreground">typography</strong> that work together to create a cohesive visual identity:
            </p>
            <ul className="space-y-2">
              <li><strong className="text-foreground">Spartan</strong> - Classic gold/bronze with elegant serif headings (Cinzel Decorative)</li>
              <li><strong className="text-foreground">Horde</strong> - Bold crimson with aggressive display font (Metal Mania)</li>
              <li><strong className="text-foreground">Alliance</strong> - Noble blue with decorative rock font (New Rocker)</li>
              <li><strong className="text-foreground">Shadow</strong> - Dark mystical purple with gothic serif (Almendra SC)</li>
              <li><strong className="text-foreground">Nature</strong> - Earthy green with medieval uncial font (Uncial Antiqua)</li>
              <li><strong className="text-foreground">Frost</strong> - Cool icy blue with modern display font (Wendy One)</li>
            </ul>
            <p className="pt-2">
              These presets are starting points that can be further customized using the{' '}
              <strong className="text-foreground">Color Editor</strong> to match your guild&apos;s exact branding.
            </p>
          </div>
        </div>
      </DemoSection>
    </ComponentDemoLayout>
  );
}

