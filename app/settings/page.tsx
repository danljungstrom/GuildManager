'use client';

import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Palette, LogIn, Check, RotateCcw, Database, Trash2, Users, AlertTriangle, Shield, User } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AdminContext';
import { useGuild } from '@/lib/contexts/GuildContext';
import { PERMISSION_LABELS, PermissionLevel } from '@/lib/types/auth.types';
import { MyCharacters } from '@/components/user/MyCharacters';
import { MyCharacterRequests } from '@/components/user/MyCharacterRequests';
import { ClaimCharacterDialog } from '@/components/user/ClaimCharacterDialog';
import { AddAltDialog } from '@/components/user/AddAltDialog';
import { CharacterEditDialog } from '@/components/user/CharacterEditDialog';
import { updateGuildConfig } from '@/lib/services/guild-config.service';
import { WoWExpansion, LogoConfig } from '@/lib/types/guild-config.types';
import { useThemeStore } from '@/lib/stores/theme-store';
import { getAllThemePresets, getThemePreset, ThemePreset } from '@/lib/constants/theme-presets';
import { getThemeIcon } from '@/lib/constants/theme-icons';
import { cn } from '@/lib/utils';
import { getMockRosterMembers } from '@/lib/mock/roster-data';
import { populateRosterWithMockData, clearAllRosterMembers, getAllRosterMembers, removeMockRosterMembers, countMockRosterMembers } from '@/lib/firebase/roster';
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

export default function UserSettingsPage() {
  const { user, isAuthenticated, loading: authLoading, loginWithDiscord, isAdmin } = useAuth();
  const { config, refreshConfig } = useGuild();
  const { activePresetId, applyPreset } = useThemeStore();

  // Dialog states
  const [claimDialogOpen, setClaimDialogOpen] = useState(false);
  const [addAltDialogOpen, setAddAltDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCharacterId, setEditingCharacterId] = useState<string | null>(null);
  const [editingAltId, setEditingAltId] = useState<string | null>(null);

  // Refresh key to trigger data reload
  const [refreshKey, setRefreshKey] = useState(0);

  // Admin settings state
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
    if (config?.theme.logoConfig) {
      return config.theme.logoConfig;
    }
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
    return {
      type: 'theme-icon',
      path: activePresetId,
      shape: 'none',
      frame: 'none',
    };
  });

  // Form data for guild settings
  const [formData, setFormData] = useState({
    name: config?.metadata.name || '',
    server: config?.metadata.server || '',
    expansion: (config?.metadata.expansion || 'classic') as WoWExpansion,
    enableRaidPlanning: config?.features?.enableRaidPlanning ?? true,
    enableAttunementTracking: config?.features?.enableAttunementTracking ?? true,
    enableProfessionTracking: config?.features?.enableProfessionTracking ?? true,
    enablePublicRoster: config?.features?.enablePublicRoster ?? true,
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
      setLogoConfig({
        type: 'theme-icon',
        path: activePresetId,
        shape: 'none',
        frame: 'none',
      });
    }
  }, [config?.theme.logoConfig, config?.theme.logoType, config?.theme.logo, activePresetId]);

  // Update form data when config changes
  useEffect(() => {
    if (config) {
      setFormData({
        name: config.metadata.name || '',
        server: config.metadata.server || '',
        expansion: (config.metadata.expansion || 'classic') as WoWExpansion,
        enableRaidPlanning: config.features?.enableRaidPlanning ?? true,
        enableAttunementTracking: config.features?.enableAttunementTracking ?? true,
        enableProfessionTracking: config.features?.enableProfessionTracking ?? true,
        enablePublicRoster: config.features?.enablePublicRoster ?? true,
      });
    }
  }, [config]);

  // Load roster count on mount (for admin tab)
  useEffect(() => {
    if (isAdmin) {
      loadRosterCount();
    }
  }, [isAdmin]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleEditClick = (characterId: string) => {
    setEditingCharacterId(characterId);
    setEditingAltId(null);
    setEditDialogOpen(true);
  };

  const handleEditAltClick = (altId: string) => {
    setEditingAltId(altId);
    setEditingCharacterId(null);
    // TODO: Create AltEditDialog for editing alts
    // For now, just log it
    console.log('Edit alt:', altId);
  };

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

      if (errorMessage.includes('permission') || errorMessage.includes('insufficient')) {
        setMockDataError('Firebase permission denied. Please configure Firestore security rules to allow writes.');
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

  // Handle applying a theme preset
  const handleApplyPreset = useCallback(async (preset: ThemePreset) => {
    applyPreset(preset);

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

  const handleCustomColorChange = (value: string) => {
    setCustomPrimaryColor(value);
    document.documentElement.style.setProperty('--primary', value);
  };

  const handleColorPickerChange = (hexValue: string) => {
    const hslValue = hexToHsl(hexValue);
    handleCustomColorChange(hslValue);
  };

  const handleResetColors = () => {
    if (currentPreset) {
      const colors = isDark ? currentPreset.colors.dark : currentPreset.colors.light;
      setCustomPrimaryColor(colors.primary);
      document.documentElement.style.setProperty('--primary', colors.primary);
    }
  };

  const handleCancelChanges = () => {
    setFormData({
      name: config?.metadata.name || '',
      server: config?.metadata.server || '',
      expansion: (config?.metadata.expansion || 'classic') as WoWExpansion,
      enableRaidPlanning: config?.features?.enableRaidPlanning ?? true,
      enableAttunementTracking: config?.features?.enableAttunementTracking ?? true,
      enableProfessionTracking: config?.features?.enableProfessionTracking ?? true,
      enablePublicRoster: config?.features?.enablePublicRoster ?? true,
    });
    handleResetColors();
    if (config?.theme.logoConfig) {
      setLogoConfig(config.theme.logoConfig);
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
            ...(logoConfig.artist && { artist: logoConfig.artist }),
            ...(logoConfig.iconColor && { iconColor: logoConfig.iconColor }),
            ...(logoConfig.frameColor && { frameColor: logoConfig.frameColor }),
            ...(logoConfig.glow && logoConfig.glow !== 'none' && { glow: logoConfig.glow }),
            ...(logoConfig.glowColor && { glowColor: logoConfig.glowColor }),
            ...(logoConfig.cropSettings && { cropSettings: logoConfig.cropSettings }),
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

  if (authLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-4 w-64 bg-muted rounded" />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-64 bg-muted rounded" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account and preferences
          </p>
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Log in with Discord to access your settings and manage your characters
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={loginWithDiscord} size="lg">
              <LogIn className="h-5 w-5 mr-2" />
              Sign in with Discord
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User settings content (shared between tabbed and non-tabbed views)
  const userSettingsContent = (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Left column - Profile and Characters */}
      <div className="lg:col-span-2 space-y-6">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your Discord account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={user?.avatar}
                  alt={user?.displayName}
                />
                <AvatarFallback className="text-lg">
                  {user?.displayName?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{user?.displayName}</h3>
                  <Badge variant="outline">
                    {PERMISSION_LABELS[user?.permissionLevel ?? 0]}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">@{user?.discordUsername}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* My Characters */}
        <div key={refreshKey}>
          <MyCharacters
            onClaimClick={() => setClaimDialogOpen(true)}
            onAddAltClick={() => setAddAltDialogOpen(true)}
            onEditClick={handleEditClick}
            onEditAltClick={handleEditAltClick}
          />
        </div>

        {/* Character Requests */}
        <MyCharacterRequests />
      </div>

      {/* Right column - Coming Soon features */}
      <div className="space-y-6">
        <Card className="opacity-60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>Coming Soon</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Configure notification preferences for raids, events, and announcements.
            </p>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              Appearance
            </CardTitle>
            <CardDescription>Coming Soon</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Customize your theme preferences, dark mode, and UI density.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold text-primary">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account{isAdmin && ' and guild configuration'}
        </p>
      </div>

      {/* Non-admin: show content directly without tabs */}
      {!isAdmin && (
        <div className="space-y-6">
          {userSettingsContent}
        </div>
      )}

      {/* Admin: show tabs */}
      {isAdmin && (
        <Tabs defaultValue="user" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user" className="gap-2">
              <User className="h-4 w-4" />
              User
            </TabsTrigger>
            <TabsTrigger value="admin" className="gap-2">
              <Shield className="h-4 w-4" />
              Admin
            </TabsTrigger>
          </TabsList>

          {/* User Settings Tab */}
          <TabsContent value="user" className="space-y-6">
            {userSettingsContent}
          </TabsContent>

          {/* Admin Settings Tab */}
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
                          This is used for buttons, links, and accents throughout the site.
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
                  <Alert className="border-yellow-500/50 bg-yellow-500/10">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <AlertDescription className="text-yellow-700 dark:text-yellow-300">
                      <strong>Development Tools:</strong> These tools are for testing and development purposes only.
                    </AlertDescription>
                  </Alert>

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
                            Add 15 realistic guild members with diverse classes, specs, and roles.
                          </p>
                          <Button
                            onClick={handlePopulateMockData}
                            disabled={mockDataLoading}
                          >
                            <Database className="h-4 w-4 mr-2" />
                            {mockDataLoading ? 'Adding...' : 'Add 15 Mock Members'}
                          </Button>
                        </div>

                        <div className="pt-4 border-t">
                          <h4 className="text-sm font-semibold mb-2">Remove Mock Data</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            Safely remove only mock/test members. Real data preserved.
                          </p>
                          <Button
                            variant="outline"
                            onClick={handleRemoveMockData}
                            disabled={mockDataLoading || mockCount === 0}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove {mockCount} Mock Members
                          </Button>
                        </div>

                        <div className="pt-4 border-t border-destructive/30">
                          <h4 className="text-sm font-semibold mb-2 text-destructive">Danger Zone</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            Delete ALL roster members. This cannot be undone!
                          </p>
                          <Button
                            variant="destructive"
                            onClick={handleClearRoster}
                            disabled={mockDataLoading || rosterCount === 0}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Clear ALL Roster Data
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            {/* Save/Cancel buttons for admin settings */}
            <div className="sticky bottom-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t py-4 flex justify-between items-center">
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
        </Tabs>
      )}

      {/* Dialogs */}
      <ClaimCharacterDialog
        open={claimDialogOpen}
        onOpenChange={setClaimDialogOpen}
        onSuccess={handleRefresh}
      />

      <AddAltDialog
        open={addAltDialogOpen}
        onOpenChange={setAddAltDialogOpen}
        onSuccess={handleRefresh}
      />

      <CharacterEditDialog
        characterId={editingCharacterId}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={handleRefresh}
      />
    </div>
  );
}
