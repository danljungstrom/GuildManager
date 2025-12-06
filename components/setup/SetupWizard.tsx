'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { initializeGuildConfig } from '@/lib/services/guild-config.service';
import { getAllThemePresets } from '@/lib/constants/theme-presets';
import { getThemeIcon } from '@/lib/constants/theme-icons';
import { useGuild } from '@/lib/contexts/GuildContext';
import { useAuth } from '@/lib/contexts/AdminContext';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertCircle, CheckCircle2, LogOut } from 'lucide-react';
import { toastSuccess, toastError } from '@/lib/utils/toast';
import type { WoWExpansion } from '@/lib/types/guild-config.types';

// Discord icon component
function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  );
}

export default function SetupWizard() {
  const [step, setStep] = useState(0); // Start at step 0 (auth)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refreshConfig } = useGuild();
  const { user, isAuthenticated, loading: authLoading, loginWithDiscord, logout } = useAuth();
  const router = useRouter();

  const [guildName, setGuildName] = useState('');
  const [nameFieldTouched, setNameFieldTouched] = useState(false);
  const [selectedExpansion, setSelectedExpansion] = useState<WoWExpansion>('classic');
  const [selectedThemeId, setSelectedThemeId] = useState('spartan');
  const [nameError, setNameError] = useState('');

  const themePresets = getAllThemePresets();

  // Don't auto-advance - let user confirm their account

  // Apply theme preview when theme is selected
  useEffect(() => {
    const selectedPreset = themePresets.find(p => p.id === selectedThemeId);
    if (!selectedPreset) return;

    // Determine if we're in dark mode
    const isDark = document.documentElement.classList.contains('dark');
    const colors = isDark ? selectedPreset.colors.dark : selectedPreset.colors.light;

    // Apply CSS variables to the root element
    const root = document.documentElement;

    // Apply color variables
    Object.entries(colors).forEach(([key, value]) => {
      // Convert camelCase to kebab-case (e.g., primaryForeground -> primary-foreground)
      const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      root.style.setProperty(`--${cssVarName}`, value);
    });

    // Apply typography (font) variables
    if (selectedPreset.typography) {
      root.style.setProperty('--font-heading', selectedPreset.typography.headingFont);
    }
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
    setNameFieldTouched(true);
    if (validateGuildName(guildName)) {
      setStep(2);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    setError(null);

    try {
      // Include the owner's Discord ID in the config
      await initializeGuildConfig({
        name: guildName,
        expansion: selectedExpansion,
        themePresetId: selectedThemeId,
        ownerId: user?.id, // Set the current user as owner
      });

      // Refresh the guild config context to reflect the new configuration
      await refreshConfig();

      toastSuccess('Guild setup complete!', {
        description: `Welcome to ${guildName}`,
      });

      // Redirect to homepage
      router.push('/');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save configuration';
      toastError('Setup failed', {
        description: errorMessage,
      });
      setError(errorMessage);
      setLoading(false);
    }
  };

  const selectedPreset = themePresets.find(p => p.id === selectedThemeId);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-heading">Welcome to GuildManager!</CardTitle>
          <CardDescription>
            Let&apos;s get your guild set up in just a few quick steps
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center gap-2 mb-8">
            <div className={`flex-1 h-2 rounded ${step >= 0 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`flex-1 h-2 rounded ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`flex-1 h-2 rounded ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`flex-1 h-2 rounded ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`flex-1 h-2 rounded ${step >= 4 ? 'bg-primary' : 'bg-muted'}`} />
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive rounded-md text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Step 0: Discord Authentication */}
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2 font-heading">Sign in with Discord</h2>
                <p className="text-sm text-muted-foreground">
                  First, sign in with your Discord account. You&apos;ll become the site owner 
                  with full admin access.
                </p>
              </div>

              {authLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : isAuthenticated && user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-primary/10 rounded-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} alt={user.displayName} />
                      <AvatarFallback>{user.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{user.displayName}</p>
                      <p className="text-sm text-muted-foreground">@{user.discordUsername}</p>
                    </div>
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  
                  <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                    <AlertCircle className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div className="text-sm text-muted-foreground">
                      This account will become the <strong className="text-foreground">site owner</strong> with 
                      permanent Super Admin access. Make sure this is the correct account before continuing.
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      onClick={logout}
                      className="flex-1"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Switch Account
                    </Button>
                    <Button 
                      onClick={() => setStep(1)} 
                      className="flex-1"
                    >
                      Continue as {user.displayName}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                    <AlertCircle className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div className="text-sm text-muted-foreground">
                      Your Discord roles will determine who can access admin features.
                      You can configure role permissions after setup.
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white"
                    size="lg"
                    onClick={loginWithDiscord}
                  >
                    <DiscordIcon className="mr-2 h-5 w-5" />
                    Continue with Discord
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 1: Guild Name */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2 font-heading">What&apos;s your guild name?</h2>
                <p className="text-sm text-muted-foreground">
                  This is a quick setup to get you started. You can configure additional details like
                  server, region, and faction later in admin settings.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="font-heading">Guild Name</Label>
                <Input
                  id="name"
                  value={guildName}
                  onChange={(e) => {
                    setGuildName(e.target.value);
                    if (nameFieldTouched) validateGuildName(e.target.value);
                  }}
                  onBlur={() => {
                    setNameFieldTouched(true);
                    validateGuildName(guildName);
                  }}
                  placeholder="Enter your guild name"
                  autoFocus
                />
                {nameFieldTouched && nameError && (
                  <p className="text-sm text-destructive">{nameError}</p>
                )}
              </div>

              <div className="flex justify-between gap-2 pt-4">
                <Button variant="outline" onClick={() => setStep(0)}>
                  Back
                </Button>
                <Button onClick={handleNameNext} disabled={!guildName.trim()}>
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Expansion Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2 font-heading">Which expansion?</h2>
                <p className="text-sm text-muted-foreground">
                  Select your WoW expansion. This determines available classes, raids, and profession caps.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expansion" className="font-heading">Expansion</Label>
                <Select value={selectedExpansion} onValueChange={(value) => setSelectedExpansion(value as WoWExpansion)}>
                  <SelectTrigger id="expansion">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="tbc">The Burning Crusade</SelectItem>
                    <SelectItem value="wotlk">Wrath of the Lich King</SelectItem>
                    <SelectItem value="cata">Cataclysm</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  You can change this later in admin settings if needed.
                </p>
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

          {/* Step 3: Theme Selection */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2 font-heading">Choose a theme</h2>
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
                              style={{
                                backgroundColor: `hsl(${preset.colors.light.primary})`,
                                WebkitMask: `url(${themeIcon.svg}) center/contain no-repeat`,
                                mask: `url(${themeIcon.svg}) center/contain no-repeat`
                              }}
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h3
                              className="font-semibold"
                              style={{
                                fontFamily: `var(--font-heading-${preset.id})`,
                                fontSize: ['horde', 'alliance', 'shadow', 'frost'].includes(preset.id) ? '18px' : '16px'
                              }}
                            >
                              {preset.name}
                            </h3>
                            <p className="text-xs text-muted-foreground">{preset.description}</p>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between gap-2 pt-4">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button onClick={() => setStep(4)}>
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2 font-heading">Ready to launch!</h2>
                <p className="text-sm text-muted-foreground">
                  Review your selections and complete the setup.
                </p>
              </div>

              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <Label className="text-muted-foreground font-heading">Guild Name</Label>
                    <p className="text-lg font-semibold font-heading">{guildName}</p>
                  </div>

                  <div>
                    <Label className="text-muted-foreground font-heading">Expansion</Label>
                    <p className="text-lg font-semibold">
                      {selectedExpansion === 'classic' && 'Classic'}
                      {selectedExpansion === 'tbc' && 'The Burning Crusade'}
                      {selectedExpansion === 'wotlk' && 'Wrath of the Lich King'}
                      {selectedExpansion === 'cata' && 'Cataclysm'}
                    </p>
                  </div>

                  <div>
                    <Label className="text-muted-foreground font-heading">Theme</Label>
                    <div className="flex items-center gap-3 mt-1">
                      {selectedPreset && getThemeIcon(selectedPreset.id) && (
                        <div
                          className="w-12 h-12 flex-shrink-0"
                          style={{
                            backgroundColor: `hsl(${selectedPreset.colors.light.primary})`,
                            WebkitMask: `url(${getThemeIcon(selectedPreset.id)!.svg}) center/contain no-repeat`,
                            mask: `url(${getThemeIcon(selectedPreset.id)!.svg}) center/contain no-repeat`
                          }}
                        />
                      )}
                      <span
                        className="font-semibold"
                        style={{
                          fontFamily: selectedPreset ? `var(--font-heading-${selectedPreset.id})` : undefined,
                          fontSize: selectedPreset && ['horde', 'alliance', 'shadow', 'frost'].includes(selectedPreset.id) ? '18px' : '16px'
                        }}
                      >
                        {selectedPreset?.name}
                      </span>
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
                <Button variant="outline" onClick={() => setStep(3)}>
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
