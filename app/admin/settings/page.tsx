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
import { WoWExpansion } from '@/lib/types/guild-config.types';
import { GuildLogo } from '@/components/ui/guild-logo';
import { useThemeStore } from '@/lib/stores/theme-store';
import { getAllThemePresets, getThemePreset, ThemePreset } from '@/lib/constants/theme-presets';
import { getThemeIcon } from '@/lib/constants/theme-icons';
import { Check, RotateCcw, Database, Trash2, Users, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getMockRosterMembers } from '@/lib/mock/roster-data';
import { populateRosterWithMockData, clearAllRosterMembers, getAllRosterMembers } from '@/lib/firebase/roster';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

export default function AdminSettingsPage() {
  const { config, refreshConfig } = useGuild();
  const { activePresetId, applyPreset } = useThemeStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data generator state
  const [rosterCount, setRosterCount] = useState(0);
  const [mockDataLoading, setMockDataLoading] = useState(false);
  const [mockDataSuccess, setMockDataSuccess] = useState<string | null>(null);
  const [mockDataError, setMockDataError] = useState<string | null>(null);

  const themePresets = getAllThemePresets();
  const currentPreset = getThemePreset(activePresetId);
  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');

  // Custom color override (not persisted to preset)
  const [customPrimaryColor, setCustomPrimaryColor] = useState('');

  // Reset custom color when preset changes
  useEffect(() => {
    if (currentPreset) {
      const colors = isDark ? currentPreset.colors.dark : currentPreset.colors.light;
      setCustomPrimaryColor(colors.primary);
    }
  }, [activePresetId, currentPreset, isDark]);

  // Load roster count on mount
  useEffect(() => {
    loadRosterCount();
  }, []);

  const loadRosterCount = async () => {
    try {
      const members = await getAllRosterMembers();
      setRosterCount(members.length);
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

  const handleClearRoster = async () => {
    if (!confirm('Are you sure you want to delete ALL roster members? This action cannot be undone!')) {
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
                <TabsTrigger value="branding">Logo & Branding</TabsTrigger>
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
                    <SelectTrigger id="expansion">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classic">Classic</SelectItem>
                      <SelectItem value="tbc">The Burning Crusade</SelectItem>
                      <SelectItem value="wotlk">Wrath of the Lich King</SelectItem>
                    </SelectContent>
                  </Select>
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

          <TabsContent value="branding">
            <Card>
              <CardHeader>
                <CardTitle>Logo & Branding</CardTitle>
                <CardDescription>
                  Customize your guild&apos;s visual identity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-semibold">Current Logo</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Your guild is currently using the {config?.theme.logoType === 'theme-icon' ? 'theme icon' : 'custom logo'}
                    </p>
                    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border">
                      <div className="w-16 h-16 flex items-center justify-center bg-background rounded-lg border">
                        <GuildLogo size="md" className="w-16 h-16" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {config?.theme.logoType === 'theme-icon'
                            ? `${config?.theme.logo?.charAt(0).toUpperCase()}${config?.theme.logo?.slice(1)} Theme Icon`
                            : 'Custom Logo'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {config?.theme.logoType === 'theme-icon'
                            ? 'Default theme icon from your selected color scheme'
                            : 'Custom uploaded image'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="mt-0.5">
                        <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                          Custom Logo Upload - Coming Soon
                        </p>
                        <div className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                          <p>The custom logo upload feature is planned for a future release. When implemented, you will be able to:</p>
                          <ul className="list-disc list-inside ml-2 space-y-1">
                            <li>Upload custom images (PNG, JPG, SVG, WebP)</li>
                            <li>Preview your logo before saving</li>
                            <li>Toggle frame borders for images without transparency</li>
                            <li>Automatically detect image transparency</li>
                            <li>Store logos securely in Firebase Storage</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* TODO: Implement custom logo upload
                      - File input accepting PNG, JPG, SVG, WebP
                      - Image preview with frame toggle
                      - Upload to Firebase Storage
                      - Update guild config with logo URL
                      - Automatic transparency detection
                      - Image optimization and resizing
                      - Validation (file size, dimensions, format)
                  */}

                  <div className="space-y-3 opacity-50 pointer-events-none">
                    <Label htmlFor="logoUpload" className="text-base font-semibold">
                      Upload Custom Logo (Coming Soon)
                    </Label>
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <svg className="w-12 h-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-sm text-muted-foreground">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, SVG or WebP (max. 2MB)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <Switch id="logoFrame" disabled />
                      <Label htmlFor="logoFrame" className="text-sm">
                        Add frame border (for images without transparency)
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2 text-destructive">
                        <Trash2 className="h-4 w-4" />
                        Danger Zone
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Clear all roster members from the database. This action cannot be undone!
                      </p>
                      <Button
                        variant="destructive"
                        onClick={handleClearRoster}
                        disabled={mockDataLoading || rosterCount === 0}
                        className="w-full sm:w-auto"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {mockDataLoading ? 'Clearing...' : 'Clear All Roster Data'}
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

            <div className="sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 mt-4 flex justify-between items-center">
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
