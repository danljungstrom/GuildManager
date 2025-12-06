'use client';

import { useState, useCallback, useEffect } from 'react';
import { useGuild } from '@/lib/contexts/GuildContext';
import { updateGuildConfig } from '@/lib/services/guild-config.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { WoWExpansion, LogoConfig } from '@/lib/types/guild-config.types';
import { useThemeStore } from '@/lib/stores/theme-store';
import { getAllThemePresets, getThemePreset, ThemePreset } from '@/lib/constants/theme-presets';
import { getThemeIcon } from '@/lib/constants/theme-icons';
import { Check, RotateCcw, Database, Trash2, Users, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getMockRosterMembers } from '@/lib/mock/roster-data';
import { populateRosterWithMockData, clearAllRosterMembers, getAllRosterMembers, removeMockRosterMembers, countMockRosterMembers } from '@/lib/firebase/roster';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogoSettings } from '@/components/logo';

// Helper functions to convert between HSL and Hex
function hslToHex(hsl: string): string {
  try {
    const parts = hsl.trim().split(/\s+/);
    if (parts.length < 3) return '#888888';
    
    const h = parseFloat(parts[0]) / 360;
    const s = parseFloat(parts[1].replace('%', '')) / 100;
    const l = parseFloat(parts[2].replace('%', '')) / 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  } catch {
    return '#888888';
  }
}

function hexToHsl(hex: string): string {
  try {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '0 0% 50%';

    const r = parseInt(result[1], 16) / 255;
    const g = parseInt(result[2], 16) / 255;
    const b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  } catch {
    return '0 0% 50%';
  }
}

// Helper to remove undefined values from an object (Firestore doesn't accept undefined)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function removeUndefined<T extends object>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as T;
}

export default function AdminSettingsPage() {
  const { config, refreshConfig } = useGuild();
  const { activePresetId, applyPreset } = useThemeStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data generator state
  const [rosterCount, setRosterCount] = useState(0);
  const [mockCount, setMockCount] = useState(0);
  const [mockDataLoading, setMockDataLoading] = useState(false);
  const [mockDataSuccess, setMockDataSuccess] = useState<string | null>(null);
  const [mockDataError, setMockDataError] = useState<string | null>(null);

  const themePresets = getAllThemePresets();
  const currentPreset = getThemePreset(activePresetId);
  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');

  // Custom color override (not persisted to preset)
  const [customPrimaryColor, setCustomPrimaryColor] = useState('');

  // Logo configuration state
  const [logoConfig, setLogoConfig] = useState<LogoConfig>(() => {
    // Initialize from existing config or defaults
    if (config?.theme.logoConfig) {
      return config.theme.logoConfig;
    }
    // Convert legacy logo format to new format
    if (config?.theme.logoType === 'theme-icon' && config?.theme.logo) {
      return {
        type: 'theme-icon',
        path: config.theme.logo,
        shape: 'none',
        frame: 'none',
      };
    }
    if (config?.theme.logoType === 'custom-image' && config?.theme.logo) {
      return {
        type: 'custom-image',
        path: config.theme.logo,
        shape: 'none',
        frame: 'none',
      };
    }
    // Default to theme icon using active preset
    return {
      type: 'theme-icon',
      path: activePresetId,
      shape: 'none',
      frame: 'none',
    };
  });

  // Reset custom color when preset changes
  useEffect(() => {
    if (currentPreset) {
      const colors = isDark ? currentPreset.colors.dark : currentPreset.colors.light;
      setCustomPrimaryColor(colors.primary);
    }
  }, [activePresetId, currentPreset, isDark]);

  // Sync logoConfig when config loads or changes
  useEffect(() => {
    if (config?.theme.logoConfig) {
      setLogoConfig(config.theme.logoConfig);
    } else if (config?.theme.logoType === 'theme-icon' && config?.theme.logo) {
      setLogoConfig({
        type: 'theme-icon',
        path: config.theme.logo,
        shape: 'none',
        frame: 'none',
      });
    } else if (config?.theme.logoType === 'custom-image' && config?.theme.logo) {
      setLogoConfig({
        type: 'custom-image',
        path: config.theme.logo,
        shape: 'none',
        frame: 'none',
      });
    } else if (activePresetId) {
      // Default to theme icon
      setLogoConfig({
        type: 'theme-icon',
        path: activePresetId,
        shape: 'none',
        frame: 'none',
      });
    }
  }, [config?.theme.logoConfig, config?.theme.logoType, config?.theme.logo, activePresetId]);

  // Load roster count on mount
  useEffect(() => {
    loadRosterCount();
  }, []);

  const loadRosterCount = async () => {
    try {
      const members = await getAllRosterMembers();
      setRosterCount(members.length);
      const mockMembers = await countMockRosterMembers();
      setMockCount(mockMembers);
    } catch (err) {
      console.error('Error loading roster count:', err);
    }
  };

  const handlePopulateMockData = async () => {
    setMockDataLoading(true);
    setMockDataSuccess(null);
    setMockDataError(null);

    try {
      const mockMembers = await getMockRosterMembers();
      const count = await populateRosterWithMockData(mockMembers);

      setMockDataSuccess(`Successfully added ${count} mock members to the roster!`);
      await loadRosterCount();

      setTimeout(() => setMockDataSuccess(null), 5000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to populate mock data';

      // Check if it's a Firebase permission error
      if (errorMessage.includes('permission') || errorMessage.includes('insufficient')) {
        setMockDataError('Firebase permission denied. Please configure Firestore security rules to allow writes. See console for details.');
        console.error('Firebase Security Rules needed. Add this to your Firestore rules:\n\nrules_version = \'2\';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    match /roster/{document=**} {\n      allow read, write: if true; // Development only - replace with proper auth\n    }\n  }\n}');
      } else {
        setMockDataError(errorMessage);
      }
    } finally {
      setMockDataLoading(false);
    }
  };

  const handleRemoveMockData = async () => {
    if (mockCount === 0) {
      setMockDataError('No mock data to remove');
      return;
    }

    setMockDataLoading(true);
    setMockDataSuccess(null);
    setMockDataError(null);

    try {
      const count = await removeMockRosterMembers();
      setMockDataSuccess(`Successfully removed ${count} mock members. Real roster data preserved.`);
      await loadRosterCount();
      setTimeout(() => setMockDataSuccess(null), 5000);
    } catch (err) {
      setMockDataError(err instanceof Error ? err.message : 'Failed to remove mock data');
    } finally {
      setMockDataLoading(false);
    }
  };

  const handleClearRoster = async () => {
    if (!confirm('Are you sure you want to delete ALL roster members? This action cannot be undone!\n\nThis will delete REAL data, not just mock data. Consider using "Remove Mock Data" instead if you only want to clear test data.')) {
      return;
    }

    setMockDataLoading(true);
    setMockDataSuccess(null);
    setMockDataError(null);

    try {
      const count = await clearAllRosterMembers();

      setMockDataSuccess(`Successfully deleted ${count} roster members.`);
      await loadRosterCount();

      setTimeout(() => setMockDataSuccess(null), 5000);
    } catch (err) {
      setMockDataError(err instanceof Error ? err.message : 'Failed to clear roster');
    } finally {
      setMockDataLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    name: config?.metadata.name || '',
    server: config?.metadata.server || '',
    expansion: (config?.metadata.expansion || 'classic') as WoWExpansion,
    enableRaidPlanning: config?.features?.enableRaidPlanning ?? true,
    enableAttunementTracking: config?.features?.enableAttunementTracking ?? true,
    enableProfessionTracking: config?.features?.enableProfessionTracking ?? true,
    enablePublicRoster: config?.features?.enablePublicRoster ?? true,
  });

  // Handle applying a theme preset
  const handleApplyPreset = useCallback(async (preset: ThemePreset) => {
    applyPreset(preset);

    // If the guild is using a theme icon (not a custom image), persist to Firestore
    if (config && config.theme.logoType !== 'custom-image') {
      try {
        await updateGuildConfig({
          theme: {
            ...config.theme,
            logo: preset.id,
            logoType: 'theme-icon',
          },
        });
      } catch (error) {
        console.error('Failed to update guild logo:', error);
      }
    }
  }, [applyPreset, config]);

  // Apply custom color (live preview only)
  const handleCustomColorChange = (value: string) => {
    setCustomPrimaryColor(value);
    // Apply immediately as CSS variable for preview
    document.documentElement.style.setProperty('--primary', value);
  };

  // Handle color picker change (converts hex to HSL)
  const handleColorPickerChange = (hexValue: string) => {
    const hslValue = hexToHsl(hexValue);
    handleCustomColorChange(hslValue);
  };

  // Reset colors to preset defaults
  const handleResetColors = () => {
    if (currentPreset) {
      const colors = isDark ? currentPreset.colors.dark : currentPreset.colors.light;
      setCustomPrimaryColor(colors.primary);
      document.documentElement.style.setProperty('--primary', colors.primary);
    }
  };

  // Cancel all changes and reset to saved values
  const handleCancelChanges = () => {
    // Reset form data to config values
    setFormData({
      name: config?.metadata.name || '',
      server: config?.metadata.server || '',
      expansion: (config?.metadata.expansion || 'classic') as WoWExpansion,
      enableRaidPlanning: config?.features?.enableRaidPlanning ?? true,
      enableAttunementTracking: config?.features?.enableAttunementTracking ?? true,
      enableProfessionTracking: config?.features?.enableProfessionTracking ?? true,
      enablePublicRoster: config?.features?.enablePublicRoster ?? true,
    });
    // Reset colors to preset
    handleResetColors();
    // Reset logo config to saved value
    if (config?.theme.logoConfig) {
      setLogoConfig(config.theme.logoConfig);
    } else if (config?.theme.logoType === 'theme-icon' && config?.theme.logo) {
      setLogoConfig({
        type: 'theme-icon',
        path: config.theme.logo,
        shape: 'none',
        frame: 'none',
      });
    } else if (config?.theme.logoType === 'custom-image' && config?.theme.logo) {
      setLogoConfig({
        type: 'custom-image',
        path: config.theme.logo,
        shape: 'none',
        frame: 'none',
      });
    } else {
      setLogoConfig({
        type: 'theme-icon',
        path: activePresetId,
        shape: 'none',
        frame: 'none',
      });
    }
    setError(null);
    setSuccess(false);
  };

  const handleSave = async () => {
    if (!config) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateGuildConfig({
        metadata: {
          name: formData.name,
          server: formData.server,
          expansion: formData.expansion as WoWExpansion,
        },
        theme: {
          colors: {
            ...config.theme.colors,
            primary: customPrimaryColor,
          },
          logoConfig: {
            type: logoConfig.type,
            path: logoConfig.path,
            shape: logoConfig.shape,
            frame: logoConfig.frame,
            // Only include optional fields if they have values
            ...(logoConfig.artist && { artist: logoConfig.artist }),
            ...(logoConfig.iconColor && { iconColor: logoConfig.iconColor }),
            ...(logoConfig.frameColor && { frameColor: logoConfig.frameColor }),
            ...(logoConfig.glow && logoConfig.glow !== 'none' && { glow: logoConfig.glow }),
            ...(logoConfig.glowColor && { glowColor: logoConfig.glowColor }),
            ...(logoConfig.cropSettings && { cropSettings: logoConfig.cropSettings }),
            // Preserve history - only include entries with required fields
            ...(logoConfig.history?.length && {
              history: logoConfig.history.map(entry => ({
                type: entry.type,
                path: entry.path,
                savedAt: entry.savedAt,
                ...(entry.artist && { artist: entry.artist }),
                ...(entry.shape && entry.shape !== 'none' && { shape: entry.shape }),
                ...(entry.frame && entry.frame !== 'none' && { frame: entry.frame }),
                ...(entry.iconColor && { iconColor: entry.iconColor }),
                ...(entry.frameColor && { frameColor: entry.frameColor }),
                ...(entry.glow && entry.glow !== 'none' && { glow: entry.glow }),
                ...(entry.glowColor && { glowColor: entry.glowColor }),
                ...(entry.cropSettings && { cropSettings: entry.cropSettings }),
              })),
            }),
          } as LogoConfig,
        },
        features: {
          enableRaidPlanning: formData.enableRaidPlanning,
          enableAttunementTracking: formData.enableAttunementTracking,
          enableProfessionTracking: formData.enableProfessionTracking,
          enablePublicRoster: formData.enablePublicRoster,
        },
      });

      await refreshConfig();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and guild configuration
          </p>
        </div>

        <Tabs defaultValue="user" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user">User Settings</TabsTrigger>
            <TabsTrigger value="admin">Admin Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="admin" className="space-y-4">
            <Tabs defaultValue="general" className="space-y-4">
              <TabsList>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="theme">Theme</TabsTrigger>
                <TabsTrigger value="logo">Logo</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="development">Development</TabsTrigger>
              </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Guild Information</CardTitle>
                <CardDescription>
                  Basic information about your guild
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Guild Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expansion">Expansion</Label>
                  <Select value={formData.expansion} onValueChange={(value) => setFormData({ ...formData, expansion: value as WoWExpansion })}>
                    <SelectTrigger id="expansion" className="h-auto py-2">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <img
                            src={`/logos/expansions/${formData.expansion}.png`}
                            alt={formData.expansion}
                            className="w-8 h-8 object-contain"
                          />
                          <span>
                            {formData.expansion === 'classic' && 'Classic'}
                            {formData.expansion === 'tbc' && 'The Burning Crusade'}
                            {formData.expansion === 'wotlk' && 'Wrath of the Lich King'}
                            {formData.expansion === 'cata' && 'Cataclysm'}
                          </span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classic">
                        <div className="flex items-center gap-2">
                          <img src="/logos/expansions/classic.png" alt="Classic" className="w-8 h-8 object-contain" />
                          <span>Classic</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="tbc">
                        <div className="flex items-center gap-2">
                          <img src="/logos/expansions/tbc.png" alt="TBC" className="w-8 h-8 object-contain" />
                          <span>The Burning Crusade</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="wotlk">
                        <div className="flex items-center gap-2">
                          <img src="/logos/expansions/wotlk.png" alt="WotLK" className="w-8 h-8 object-contain" />
                          <span>Wrath of the Lich King</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="cata">
                        <div className="flex items-center gap-2">
                          <img src="/logos/expansions/cata.png" alt="Cata" className="w-8 h-8 object-contain" />
                          <span>Cataclysm</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    This determines available classes, raids, and profession caps throughout the site.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="theme">
            <div className="space-y-4">
              {/* Theme Presets */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Theme Preset</CardTitle>
                  <CardDescription>
                    Choose a preset theme for your guild
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
                    {themePresets.map((preset) => {
                      const themeIcon = getThemeIcon(preset.id);
                      const presetColors = isDark ? preset.colors.dark : preset.colors.light;
                      const isActive = activePresetId === preset.id;

                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleApplyPreset(preset)}
                          className={cn(
                            'relative flex items-center gap-3 p-3 rounded-lg border text-left transition-all hover:bg-muted/50',
                            isActive && 'ring-2 ring-primary bg-muted/30'
                          )}
                        >
                          {themeIcon && (
                            <div
                              className="w-8 h-8 flex-shrink-0"
                              style={{
                                backgroundColor: `hsl(${presetColors.primary})`,
                                WebkitMask: `url(${themeIcon.svg}) center/contain no-repeat`,
                                mask: `url(${themeIcon.svg}) center/contain no-repeat`
                              }}
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{preset.name}</p>
                          </div>
                          {isActive && (
                            <div className="absolute top-1 right-1 rounded-full bg-primary p-0.5">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Custom Color Overrides */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Custom Colors</CardTitle>
                      <CardDescription>
                        Fine-tune colors based on your selected preset
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleResetColors}
                      className="text-muted-foreground"
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Reset
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex gap-2 max-w-sm">
                      <label className="relative w-12 h-10 rounded-md border cursor-pointer overflow-hidden flex-shrink-0">
                        <input
                          type="color"
                          value={hslToHex(customPrimaryColor)}
                          onChange={(e) => handleColorPickerChange(e.target.value)}
                          className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                        />
                        <div
                          className="w-full h-full"
                          style={{ backgroundColor: `hsl(${customPrimaryColor})` }}
                        />
                      </label>
                      <Input
                        id="primaryColor"
                        value={customPrimaryColor}
                        onChange={(e) => handleCustomColorChange(e.target.value)}
                        placeholder="41 40% 60%"
                        className="font-mono text-sm"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Click the color swatch to open the picker. This is used for buttons, links, and accents throughout the site.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="logo">
            <LogoSettings
              config={logoConfig}
              onChange={setLogoConfig}
            />
          </TabsContent>

          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle>Feature Toggles</CardTitle>
                <CardDescription>
                  Enable or disable specific features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Raid Planning</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable raid calendar and planning tools
                    </p>
                  </div>
                  <Switch
                    checked={formData.enableRaidPlanning}
                    onCheckedChange={(checked) => setFormData({ ...formData, enableRaidPlanning: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Attunement Tracking</Label>
                    <p className="text-sm text-muted-foreground">
                      Track member raid attunements
                    </p>
                  </div>
                  <Switch
                    checked={formData.enableAttunementTracking}
                    onCheckedChange={(checked) => setFormData({ ...formData, enableAttunementTracking: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Profession Tracking</Label>
                    <p className="text-sm text-muted-foreground">
                      Track member professions and recipes
                    </p>
                  </div>
                  <Switch
                    checked={formData.enableProfessionTracking}
                    onCheckedChange={(checked) => setFormData({ ...formData, enableProfessionTracking: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Public Roster</Label>
                    <p className="text-sm text-muted-foreground">
                      Make guild roster visible to non-members
                    </p>
                  </div>
                  <Switch
                    checked={formData.enablePublicRoster}
                    onCheckedChange={(checked) => setFormData({ ...formData, enablePublicRoster: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="development">
            <div className="space-y-4">
              {/* Warning Banner */}
              <Alert className="border-yellow-500/50 bg-yellow-500/10">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <AlertDescription className="text-yellow-700 dark:text-yellow-300">
                  <strong>Development Tools:</strong> These tools are for testing and development purposes only. Use with caution in production environments.
                </AlertDescription>
              </Alert>

              {/* Firebase Setup Instructions */}
              <Alert className="border-blue-500/50 bg-blue-500/10">
                <Database className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-blue-700 dark:text-blue-300">
                  <strong>Firebase Setup Required:</strong> To use the mock data generator, configure your Firestore security rules to allow writes.
                  Go to <strong>Firebase Console → Firestore Database → Rules</strong> and add permissions for the <code className="px-1 py-0.5 bg-blue-500/20 rounded">roster</code> collection.
                </AlertDescription>
              </Alert>

              {/* Roster Mock Data Generator */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Roster Mock Data Generator
                  </CardTitle>
                  <CardDescription>
                    Quickly populate your roster with realistic mock data for testing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Users className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Current Roster Size</p>
                        <p className="text-2xl font-bold text-primary">{rosterCount} members</p>
                        {mockCount > 0 && (
                          <p className="text-xs text-muted-foreground">
                            ({mockCount} mock, {rosterCount - mockCount} real)
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadRosterCount}
                      disabled={mockDataLoading}
                    >
                      Refresh
                    </Button>
                  </div>

                  {mockDataSuccess && (
                    <Alert className="border-green-500/50 bg-green-500/10">
                      <Check className="h-4 w-4 text-green-500" />
                      <AlertDescription className="text-green-700 dark:text-green-300">
                        {mockDataSuccess}
                      </AlertDescription>
                    </Alert>
                  )}

                  {mockDataError && (
                    <Alert className="border-destructive/50 bg-destructive/10">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <AlertDescription className="text-destructive">
                        {mockDataError}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-3 pt-2">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Generate Mock Data</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        This will add 15 realistic guild members with diverse classes, specs, roles, and attendance data. Perfect for testing filtering, sorting, and UI layouts.
                      </p>
                      <Button
                        onClick={handlePopulateMockData}
                        disabled={mockDataLoading}
                        className="w-full sm:w-auto"
                      >
                        <Database className="h-4 w-4 mr-2" />
                        {mockDataLoading ? 'Adding Mock Data...' : 'Add 15 Mock Members'}
                      </Button>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="text-sm font-semibold mb-2">Remove Mock Data</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Safely remove only mock/test members from the roster. Real roster data will be preserved.
                      </p>
                      <Button
                        variant="outline"
                        onClick={handleRemoveMockData}
                        disabled={mockDataLoading || mockCount === 0}
                        className="w-full sm:w-auto"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {mockDataLoading ? 'Removing...' : `Remove ${mockCount} Mock Members`}
                      </Button>
                    </div>

                    <div className="pt-4 border-t border-destructive/30">
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-4 w-4" />
                        Danger Zone
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Delete ALL roster members including real data. This cannot be undone! Consider using &quot;Remove Mock Data&quot; instead.
                      </p>
                      <Button
                        variant="destructive"
                        onClick={handleClearRoster}
                        disabled={mockDataLoading || rosterCount === 0}
                        className="w-full sm:w-auto"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {mockDataLoading ? 'Clearing...' : 'Clear ALL Roster Data'}
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-semibold mb-2">Mock Data Details</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• 15 members across all 9 WoW classes</p>
                      <p>• Varied ranks: GM, Officers, Core Raiders, Trials, Social</p>
                      <p>• Realistic specs, gear scores (395-485), and levels (58-60)</p>
                      <p>• Attendance tracking (20%-100%)</p>
                      <p>• Professions, attunements, and extra roles</p>
                      <p>• Unique character names and player names</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

            <div className="sticky bottom-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t py-4 mt-4 flex justify-between items-center">
              <div className="flex-1">
                {success && (
                  <span className="text-sm text-green-500">Settings saved successfully!</span>
                )}
                {error && (
                  <span className="text-sm text-destructive">{error}</span>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancelChanges} disabled={loading}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="user" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Preferences</CardTitle>
                <CardDescription>
                  Personal settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  User settings coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
