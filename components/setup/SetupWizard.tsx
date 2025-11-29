'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { initializeGuildConfig } from '@/lib/services/guild-config.service';
import { getAllThemePresets } from '@/lib/constants/theme-presets';
import { getThemeIcon } from '@/lib/constants/theme-icons';
import { useGuild } from '@/lib/contexts/GuildContext';
import { useRouter } from 'next/navigation';

export default function SetupWizard() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refreshConfig } = useGuild();
  const router = useRouter();

  const [guildName, setGuildName] = useState('');
  const [selectedThemeId, setSelectedThemeId] = useState('gold');
  const [nameError, setNameError] = useState('');

  const themePresets = getAllThemePresets();

  // Apply theme preview when theme is selected
  useEffect(() => {
    const selectedPreset = themePresets.find(p => p.id === selectedThemeId);
    if (!selectedPreset) return;

    // Determine if we're in dark mode
    const isDark = document.documentElement.classList.contains('dark');
    const colors = isDark ? selectedPreset.colors.dark : selectedPreset.colors.light;

    // Apply CSS variables to the root element
    const root = document.documentElement;
    Object.entries(colors).forEach(([key, value]) => {
      // Convert camelCase to kebab-case (e.g., primaryForeground -> primary-foreground)
      const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      root.style.setProperty(`--${cssVarName}`, value);
    });
  }, [selectedThemeId, themePresets]);

  const validateGuildName = (name: string): boolean => {
    if (!name.trim()) {
      setNameError('Guild name is required');
      return false;
    }
    if (name.length < 2) {
      setNameError('Guild name must be at least 2 characters');
      return false;
    }
    if (name.length > 50) {
      setNameError('Guild name must be less than 50 characters');
      return false;
    }
    setNameError('');
    return true;
  };

  const handleNameNext = () => {
    if (validateGuildName(guildName)) {
      setStep(2);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    setError(null);

    try {
      await initializeGuildConfig({
        name: guildName,
        themePresetId: selectedThemeId,
      });

      // Refresh the guild config context to reflect the new configuration
      await refreshConfig();

      // Redirect to homepage
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save configuration');
      setLoading(false);
    }
  };

  const selectedPreset = themePresets.find(p => p.id === selectedThemeId);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle className="text-3xl">Welcome to GuildManager!</CardTitle>
          <CardDescription>
            Let&apos;s get your guild set up in just a few quick steps
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center gap-2 mb-8">
            <div className={`flex-1 h-2 rounded ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`flex-1 h-2 rounded ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`flex-1 h-2 rounded ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive rounded-md text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Guild Name */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">What&apos;s your guild name?</h2>
                <p className="text-sm text-muted-foreground">
                  This is a quick setup to get you started. You can configure additional details like
                  server, region, faction, and expansion later in admin settings.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Guild Name</Label>
                <Input
                  id="name"
                  value={guildName}
                  onChange={(e) => {
                    setGuildName(e.target.value);
                    if (nameError) validateGuildName(e.target.value);
                  }}
                  onBlur={() => validateGuildName(guildName)}
                  placeholder="Enter your guild name"
                  autoFocus
                />
                {nameError && (
                  <p className="text-sm text-destructive">{nameError}</p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button onClick={handleNameNext} disabled={!guildName.trim()}>
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Theme Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Choose a theme</h2>
                <p className="text-sm text-muted-foreground">
                  Select a color scheme for your guild website. You can fully customize colors later in Theme Settings.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {themePresets.map((preset) => {
                  const themeIcon = getThemeIcon(preset.id);
                  return (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedThemeId(preset.id)}
                      className={`p-4 border-2 rounded-lg text-left transition-all hover:border-primary/50 ${
                        selectedThemeId === preset.id ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          {themeIcon && (
                            <div
                              className="w-12 h-12 flex-shrink-0"
                              dangerouslySetInnerHTML={{ __html: themeIcon.svg }}
                              aria-label={`${preset.name} icon`}
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold">{preset.name}</h3>
                            <p className="text-xs text-muted-foreground">{preset.description}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <div
                            className="h-8 w-8 rounded border"
                            style={{ backgroundColor: `hsl(${preset.colors.light.primary})` }}
                            title="Primary"
                          />
                          <div
                            className="h-8 w-8 rounded border"
                            style={{ backgroundColor: `hsl(${preset.colors.light.accent})` }}
                            title="Accent"
                          />
                          <div
                            className="h-8 w-8 rounded border"
                            style={{ backgroundColor: `hsl(${preset.colors.light.background})` }}
                            title="Background"
                          />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between gap-2 pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setStep(3)}>
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Ready to launch!</h2>
                <p className="text-sm text-muted-foreground">
                  Review your selections and complete the setup.
                </p>
              </div>

              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Guild Name</Label>
                    <p className="text-lg font-semibold">{guildName}</p>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Theme</Label>
                    <div className="flex items-center gap-3 mt-1">
                      {selectedPreset && getThemeIcon(selectedPreset.id) && (
                        <div
                          className="w-12 h-12 flex-shrink-0"
                          dangerouslySetInnerHTML={{ __html: getThemeIcon(selectedPreset.id)!.svg }}
                          aria-label={`${selectedPreset.name} icon`}
                        />
                      )}
                      <div className="flex gap-2">
                        {selectedPreset && (
                          <>
                            <div
                              className="h-8 w-8 rounded border"
                              style={{ backgroundColor: `hsl(${selectedPreset.colors.light.primary})` }}
                            />
                            <div
                              className="h-8 w-8 rounded border"
                              style={{ backgroundColor: `hsl(${selectedPreset.colors.light.accent})` }}
                            />
                          </>
                        )}
                      </div>
                      <span className="font-semibold">{selectedPreset?.name}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">
                      After setup, you can customize all guild details including server, region, faction,
                      expansion, theme colors, and more in the admin settings.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between gap-2 pt-4">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button onClick={handleComplete} disabled={loading} size="lg">
                  {loading ? 'Setting up...' : 'Complete Setup'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
