'use client';

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Bell, Palette, LogIn, Check, RotateCcw, Database, Trash2, Users, AlertTriangle, Shield, User, Save, X, ChevronDown, Image } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AdminContext';
import { useGuild } from '@/lib/contexts/GuildContext';
import { PERMISSION_LABELS, PermissionLevel } from '@/lib/types/auth.types';
import { MyCharacters } from '@/components/user/MyCharacters';
import { MyCharacterRequests } from '@/components/user/MyCharacterRequests';
import { ClaimCharacterDialog } from '@/components/user/ClaimCharacterDialog';
import { AddAltDialog } from '@/components/user/AddAltDialog';
import { CharacterEditDialog } from '@/components/user/CharacterEditDialog';
import { updateGuildConfig } from '@/lib/services/guild-config.service';
import { WoWExpansion, LogoConfig, SavedCustomTheme } from '@/lib/types/guild-config.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useThemeStore, darkenHsl } from '@/lib/stores/theme-store';
import { getAllThemePresets, getThemePreset, ThemePreset } from '@/lib/constants/theme-presets';
import { getThemeIcon } from '@/lib/constants/theme-icons';
import { cn } from '@/lib/utils';
import { getMockRosterMembers } from '@/lib/mock/roster-data';
import { populateRosterWithMockData, clearAllRosterMembers, getAllRosterMembers, removeMockRosterMembers, countMockRosterMembers } from '@/lib/firebase/roster';
import { LogoSettings, LogoPreview } from '@/components/logo';
import { DiscordRoleSettings } from '@/components/admin/DiscordRoleSettings';
import { hslToHex, hexToHsl } from '@/lib/utils/color-conversion';

export default function UserSettingsPage() {
  const { user, isAuthenticated, loading: authLoading, loginWithDiscord, isAdmin } = useAuth();
  const { config, refreshConfig } = useGuild();
  const { activePresetId, applyPreset, setActivePreset } = useThemeStore();

  // Dialog states
  const [claimDialogOpen, setClaimDialogOpen] = useState(false);
  const [addAltDialogOpen, setAddAltDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCharacterId, setEditingCharacterId] = useState<string | null>(null);
  const [editingAltId, setEditingAltId] = useState<string | null>(null);
  const [overwriteCustomDialogOpen, setOverwriteCustomDialogOpen] = useState(false);

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

  // Custom theme colors state (muted and border derive from secondary)
  const [isCustomTheme, setIsCustomTheme] = useState(false);
  const [customColors, setCustomColors] = useState({
    primary: '',
    secondary: '',
    background: '',
    sidebar: '',
  });

  // Save custom theme dialog state
  const [saveThemeDialogOpen, setSaveThemeDialogOpen] = useState(false);
  const [newThemeName, setNewThemeName] = useState('');

  // Collapsible section states - all collapsed by default
  const [logoSectionOpen, setLogoSectionOpen] = useState(false);
  const [colorsSectionOpen, setColorsSectionOpen] = useState(false);
  const [typographySectionOpen, setTypographySectionOpen] = useState(false);

  // Get saved custom themes from config
  const savedCustomThemes = config?.theme.customThemes || [];

  // Delete custom theme confirmation
  const [deleteThemeId, setDeleteThemeId] = useState<string | null>(null);
  const themeToDelete = deleteThemeId ? savedCustomThemes.find(t => t.id === deleteThemeId) : null;

  // Track the active custom theme ID (if user selected a saved custom theme)
  // Initialize from config.theme.preset if it's a saved custom theme ID
  const [activeCustomThemeId, setActiveCustomThemeId] = useState<string | null>(() => {
    if (!config?.theme.preset) return null;
    // Check if preset is a saved custom theme ID
    const savedThemes = config?.theme.customThemes || [];
    const matchedTheme = savedThemes.find(t => t.id === config.theme.preset);
    return matchedTheme ? config.theme.preset : null;
  });

  // Font selections
  const [headingFont, setHeadingFont] = useState('spartan');
  const [bodyFont, setBodyFont] = useState('lexend');

  // Available heading fonts with theme associations
  const headingFonts = [
    { id: 'spartan', name: 'Cinzel Decorative', theme: 'Spartan', cssVar: 'var(--font-heading-spartan)' },
    { id: 'horde', name: 'Metal Mania', theme: 'Horde', cssVar: 'var(--font-heading-horde)' },
    { id: 'alliance', name: 'New Rocker', theme: 'Alliance', cssVar: 'var(--font-heading-alliance)' },
    { id: 'shadow', name: 'Almendra SC', theme: 'Shadow', cssVar: 'var(--font-heading-shadow)' },
    { id: 'nature', name: 'Uncial Antiqua', theme: 'Nature', cssVar: 'var(--font-heading-nature)' },
    { id: 'frost', name: 'Wendy One', theme: 'Frost', cssVar: 'var(--font-heading-frost)' },
    { id: 'holy', name: 'Grenze Gotisch', theme: 'Holy', cssVar: 'var(--font-heading-holy)' },
    { id: 'ember', name: 'Fascinate Inline', theme: 'Ember', cssVar: 'var(--font-heading-ember)' },
    { id: 'custom', name: 'Tilt Prism', theme: 'Bland', cssVar: 'var(--font-heading-custom)' },
  ];

  // Available body fonts
  const bodyFonts = [
    { id: 'inter', name: 'Inter', cssVar: 'var(--font-body)' },
    { id: 'lexend', name: 'Lexend', cssVar: 'var(--font-lexend)' },
    { id: 'raleway', name: 'Raleway', cssVar: 'var(--font-raleway)' },
    { id: 'montserrat', name: 'Montserrat', cssVar: 'var(--font-montserrat)' },
    { id: 'open-sans', name: 'Open Sans', cssVar: 'var(--font-open-sans)' },
    { id: 'lato', name: 'Lato', cssVar: 'var(--font-lato)' },
    { id: 'geist', name: 'Geist', cssVar: 'var(--font-geist)' },
  ];

  // Font scale factors for fonts that render smaller
  const fontScales: Record<string, number> = {
    ember: 1.3, // Pirata One renders smaller
  };

  // Track if custom colors have been initialized to prevent overwriting user choices
  const [customColorsInitialized, setCustomColorsInitialized] = useState(false);

  // Initialize custom colors from config or preset (only on initial load)
  useEffect(() => {
    if (customColorsInitialized) return; // Don't overwrite user choices

    // Get sidebar color from CSS variable or use background as fallback
    const getSidebarColor = () => {
      if (typeof window !== 'undefined') {
        const computed = getComputedStyle(document.documentElement).getPropertyValue('--sidebar-background').trim();
        return computed || '';
      }
      return '';
    };

    // Check if we have a saved custom theme to restore
    if (config?.theme.preset) {
      const savedThemes = config?.theme.customThemes || [];
      const matchedTheme = savedThemes.find(t => t.id === config.theme.preset);

      if (matchedTheme) {
        // Restore saved custom theme
        const sidebarColor = matchedTheme.colors.sidebar || darkenHsl(matchedTheme.colors.background, 0.3);
        setCustomColors({
          primary: matchedTheme.colors.primary,
          secondary: matchedTheme.colors.secondary,
          background: matchedTheme.colors.background,
          sidebar: sidebarColor,
        });
        setHeadingFont(matchedTheme.headingFont);
        setBodyFont(matchedTheme.bodyFont);
        setIsCustomTheme(false);
        setActiveCustomThemeId(matchedTheme.id);
        setActivePreset('custom');

        // Apply to CSS
        document.documentElement.style.setProperty('--primary', matchedTheme.colors.primary);
        document.documentElement.style.setProperty('--accent', matchedTheme.colors.primary);
        document.documentElement.style.setProperty('--ring', matchedTheme.colors.primary);
        document.documentElement.style.setProperty('--secondary', matchedTheme.colors.secondary);
        document.documentElement.style.setProperty('--muted', matchedTheme.colors.secondary);
        document.documentElement.style.setProperty('--border', matchedTheme.colors.secondary);
        document.documentElement.style.setProperty('--background', matchedTheme.colors.background);
        document.documentElement.style.setProperty('--card', matchedTheme.colors.background);
        document.documentElement.style.setProperty('--sidebar-background', sidebarColor);

        // Apply fonts
        const hFont = headingFonts.find(f => f.id === matchedTheme.headingFont);
        const bFont = bodyFonts.find(f => f.id === matchedTheme.bodyFont);
        if (hFont) {
          document.documentElement.style.setProperty('--font-heading', hFont.cssVar);
          document.documentElement.style.setProperty('--font-heading-scale', String(fontScales[matchedTheme.headingFont] || 1));
        }
        if (bFont) {
          document.documentElement.style.setProperty('--font-body', bFont.cssVar);
        }

        // Apply logo if saved
        if (matchedTheme.logoConfig) {
          setLogoConfig(matchedTheme.logoConfig);
        }

        setCustomColorsInitialized(true);
        return;
      }
    }

    if (config?.theme.colors) {
      const configColors = config.theme.colors;

      // Use the saved preset field if available, otherwise fall back to color comparison
      if (config.theme.preset) {
        // Explicit preset saved - use it directly
        setIsCustomTheme(config.theme.preset === 'custom');
      } else {
        // Legacy: infer from color comparison (for backwards compatibility)
        const presetColors = currentPreset ? (isDark ? currentPreset.colors.dark : currentPreset.colors.light) : null;
        const hasCustomColors = presetColors && (
          configColors.primary !== presetColors.primary ||
          configColors.secondary !== presetColors.secondary ||
          configColors.accent !== presetColors.accent
        );
        setIsCustomTheme(hasCustomColors || false);
      }

      const sidebarFromCss = getSidebarColor();
      setCustomColors({
        primary: configColors.primary || '',
        secondary: configColors.secondary || '',
        background: configColors.background || '',
        sidebar: sidebarFromCss || darkenHsl(configColors.background || '220 9% 8%', 0.3),
      });
      setCustomColorsInitialized(true);
    } else if (currentPreset) {
      const colors = isDark ? currentPreset.colors.dark : currentPreset.colors.light;
      const sidebarFromCss = getSidebarColor();
      setCustomColors({
        primary: colors.primary,
        secondary: colors.secondary,
        background: colors.background,
        sidebar: sidebarFromCss || darkenHsl(colors.background, 0.3),
      });
      setCustomColorsInitialized(true);
    }
  }, [config?.theme.colors, config?.theme.preset, config?.theme.customThemes, currentPreset, isDark, customColorsInitialized, setActivePreset]);

  // Legacy alias for compatibility
  const customPrimaryColor = customColors.primary;

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

  // Track if logoConfig has been initialized to avoid overwriting local changes
  const [logoConfigInitialized, setLogoConfigInitialized] = useState(false);

  // Handle logo changes - marks theme as modified
  const handleLogoChange = useCallback((newConfig: LogoConfig) => {
    setLogoConfig(newConfig);
    setIsCustomTheme(true); // Mark as modified when logo changes
  }, []);

  // Sync logoConfig only on initial load (not on every config change)
  useEffect(() => {
    if (logoConfigInitialized) return; // Don't overwrite local changes

    if (config?.theme.logoConfig) {
      setLogoConfig(config.theme.logoConfig);
      setLogoConfigInitialized(true);
    } else if (config?.theme.logoType === 'theme-icon' && config?.theme.logo) {
      setLogoConfig({
        type: 'theme-icon',
        path: config.theme.logo,
        shape: 'none',
        frame: 'none',
      });
      setLogoConfigInitialized(true);
    } else if (config?.theme.logoType === 'custom-image' && config?.theme.logo) {
      setLogoConfig({
        type: 'custom-image',
        path: config.theme.logo,
        shape: 'none',
        frame: 'none',
      });
      setLogoConfigInitialized(true);
    } else if (activePresetId && config) {
      setLogoConfig({
        type: 'theme-icon',
        path: activePresetId,
        shape: 'none',
        frame: 'none',
      });
      setLogoConfigInitialized(true);
    }
  }, [config?.theme.logoConfig, config?.theme.logoType, config?.theme.logo, activePresetId, logoConfigInitialized, config]);

  // Auto-save logo config when it changes (after initialization)
  // Skip when editing a saved custom theme - those changes are saved via the Save button
  useEffect(() => {
    if (!logoConfigInitialized || !config) return;
    // Don't auto-save when editing a saved custom theme
    if (activeCustomThemeId) return;

    const saveLogoConfig = async () => {
      try {
        await updateGuildConfig({
          theme: {
            ...config.theme,
            logoConfig: {
              type: logoConfig.type,
              path: logoConfig.path,
              shape: logoConfig.shape || 'none',
              frame: logoConfig.frame || 'none',
              ...(logoConfig.artist && { artist: logoConfig.artist }),
              ...(logoConfig.iconColor && { iconColor: logoConfig.iconColor }),
              ...(logoConfig.frameColor && { frameColor: logoConfig.frameColor }),
              ...(logoConfig.glow && logoConfig.glow !== 'none' && { glow: logoConfig.glow }),
              ...(logoConfig.glowColor && { glowColor: logoConfig.glowColor }),
              ...(logoConfig.cropSettings && { cropSettings: logoConfig.cropSettings }),
              ...(logoConfig.history && logoConfig.history.length > 0 && {
                history: logoConfig.history.map(entry => ({
                  type: entry.type,
                  path: entry.path,
                  savedAt: entry.savedAt,
                  shape: entry.shape || 'none',
                  frame: entry.frame || 'none',
                  ...(entry.artist && { artist: entry.artist }),
                  ...(entry.iconColor && { iconColor: entry.iconColor }),
                  ...(entry.frameColor && { frameColor: entry.frameColor }),
                  ...(entry.glow && entry.glow !== 'none' && { glow: entry.glow }),
                  ...(entry.glowColor && { glowColor: entry.glowColor }),
                  ...(entry.cropSettings && { cropSettings: entry.cropSettings }),
                })),
              }),
            } as LogoConfig,
          },
        });
      } catch (err) {
        console.error('Failed to auto-save logo config:', err);
      }
    };

    saveLogoConfig();
  }, [logoConfig, logoConfigInitialized, config, activeCustomThemeId]);

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
    setIsCustomTheme(false);
    setActiveCustomThemeId(null); // Clear any selected custom theme

    // Update custom colors to match the preset
    const colors = isDark ? preset.colors.dark : preset.colors.light;
    const sidebarColor = darkenHsl(colors.background, 0.3); // 30% darker than background
    setCustomColors({
      primary: colors.primary,
      secondary: colors.secondary,
      background: colors.background,
      sidebar: sidebarColor,
    });

    // Apply CSS variables immediately
    document.documentElement.style.setProperty('--primary', colors.primary);
    document.documentElement.style.setProperty('--accent', colors.primary); // accent = primary
    document.documentElement.style.setProperty('--ring', colors.primary);
    document.documentElement.style.setProperty('--secondary', colors.secondary);
    document.documentElement.style.setProperty('--muted', colors.secondary); // muted = secondary
    document.documentElement.style.setProperty('--border', colors.secondary); // border = secondary
    document.documentElement.style.setProperty('--background', colors.background);
    document.documentElement.style.setProperty('--card', colors.background);
    document.documentElement.style.setProperty('--sidebar-background', sidebarColor);

    // Set heading font to match preset
    setHeadingFont(preset.id);
    document.documentElement.style.setProperty('--font-heading', preset.typography.headingFont);
    // Apply font scale if needed
    const scale = fontScales[preset.id] || 1;
    document.documentElement.style.setProperty('--font-heading-scale', String(scale));

    // Reset logo to preset's theme-icon
    // This ensures switching presets gives the expected theme icon
    if (config) {
      try {
        await updateGuildConfig({
          theme: {
            ...config.theme,
            preset: preset.id,
            logo: preset.id,
            logoType: 'theme-icon',
          },
        });
        // Reset local logoConfig state to theme-icon with no custom colors
        setLogoConfig(prev => ({
          type: 'theme-icon',
          path: preset.id,
          shape: prev.shape || 'none',
          frame: prev.frame || 'none',
          // Clear frozen colors so they follow the new theme
          iconColor: undefined,
          frameColor: prev.frameColor,
          glow: prev.glow || 'none',
          glowColor: prev.glowColor,
        }));
      } catch (error) {
        console.error('Failed to update guild logo:', error);
      }
    }
  }, [applyPreset, config, isDark]);

  // Handle changing a custom color (marks theme as modified)
  const handleCustomColorChange = (colorKey: keyof typeof customColors, hexValue: string) => {
    const hslValue = hexToHsl(hexValue);
    const newColors = { ...customColors, [colorKey]: hslValue };
    setCustomColors(newColors);
    setIsCustomTheme(true); // Mark as modified (activeCustomThemeId stays set if editing a saved theme)

    // Apply to CSS variable
    const cssVarMap: Record<string, string> = {
      primary: '--primary',
      secondary: '--secondary',
      background: '--background',
      sidebar: '--sidebar-background',
    };
    if (cssVarMap[colorKey]) {
      document.documentElement.style.setProperty(cssVarMap[colorKey], hslValue);
    }

    // When primary changes, also update accent and ring
    if (colorKey === 'primary') {
      document.documentElement.style.setProperty('--accent', hslValue);
      document.documentElement.style.setProperty('--ring', hslValue);
    }

    // When secondary changes, also update muted and border
    if (colorKey === 'secondary') {
      document.documentElement.style.setProperty('--muted', hslValue);
      document.documentElement.style.setProperty('--border', hslValue);
    }

    // When background changes, also update card
    if (colorKey === 'background') {
      document.documentElement.style.setProperty('--card', hslValue);
    }
  };

  // Handle font changes
  const handleHeadingFontChange = (fontId: string) => {
    setHeadingFont(fontId);
    const font = headingFonts.find(f => f.id === fontId);
    if (font) {
      document.documentElement.style.setProperty('--font-heading', font.cssVar);
      // Apply font scale if needed
      const scale = fontScales[fontId] || 1;
      document.documentElement.style.setProperty('--font-heading-scale', String(scale));
    }
    // Mark as modified
    setIsCustomTheme(true);
  };

  const handleBodyFontChange = (fontId: string) => {
    setBodyFont(fontId);
    const font = bodyFonts.find(f => f.id === fontId);
    if (font) {
      document.documentElement.style.setProperty('--font-body', font.cssVar);
    }
    // Mark as modified
    setIsCustomTheme(true);
  };

  // Check if current settings differ from the current preset or saved custom theme
  const isThemeModified = useCallback(() => {
    // If editing a saved custom theme, compare against that
    if (activeCustomThemeId) {
      const savedTheme = savedCustomThemes.find(t => t.id === activeCustomThemeId);
      if (savedTheme) {
        const colorsDiffer =
          customColors.primary !== savedTheme.colors.primary ||
          customColors.secondary !== savedTheme.colors.secondary ||
          customColors.background !== savedTheme.colors.background;
        const fontsDiffer =
          headingFont !== savedTheme.headingFont ||
          bodyFont !== savedTheme.bodyFont;
        // Compare logo config (stringify for deep comparison)
        const logoDiffer = JSON.stringify(logoConfig) !== JSON.stringify(savedTheme.logoConfig);
        return colorsDiffer || fontsDiffer || logoDiffer;
      }
    }

    // Otherwise compare against current preset
    if (!currentPreset) return false;
    const presetColors = isDark ? currentPreset.colors.dark : currentPreset.colors.light;
    const colorsDiffer =
      customColors.primary !== presetColors.primary ||
      customColors.secondary !== presetColors.secondary ||
      customColors.background !== presetColors.background;
    const fontsDiffer =
      headingFont !== currentPreset.id ||
      bodyFont !== 'lexend';
    return colorsDiffer || fontsDiffer;
  }, [currentPreset, isDark, customColors, headingFont, bodyFont, activeCustomThemeId, savedCustomThemes, logoConfig]);

  // Reset a single color to preset or custom theme default
  const handleResetColor = (colorKey: 'primary' | 'secondary' | 'background' | 'sidebar') => {
    let newValue: string;
    let referenceColors: { primary: string; secondary: string; background: string; sidebar?: string };
    let referenceSidebar: string;

    // Check if editing a saved custom theme
    if (activeCustomThemeId) {
      const savedTheme = savedCustomThemes.find(t => t.id === activeCustomThemeId);
      if (savedTheme) {
        referenceColors = savedTheme.colors;
        referenceSidebar = savedTheme.colors.sidebar || darkenHsl(savedTheme.colors.background, 0.3);

        if (colorKey === 'sidebar') {
          newValue = referenceSidebar;
        } else {
          newValue = referenceColors[colorKey];
        }
      } else {
        return; // Theme not found
      }
    } else if (activePresetId === 'custom') {
      // Bland theme
      referenceColors = {
        primary: '220 9% 46%',
        secondary: '220 9% 18%',
        background: '220 9% 8%',
      };
      referenceSidebar = darkenHsl('220 9% 8%', 0.3);

      if (colorKey === 'sidebar') {
        newValue = referenceSidebar;
      } else {
        newValue = referenceColors[colorKey];
      }
    } else if (currentPreset) {
      // Regular preset
      const presetColors = isDark ? currentPreset.colors.dark : currentPreset.colors.light;
      referenceColors = presetColors;
      referenceSidebar = darkenHsl(presetColors.background, 0.3);

      if (colorKey === 'sidebar') {
        newValue = referenceSidebar;
      } else {
        newValue = presetColors[colorKey];
      }
    } else {
      return; // No reference colors available
    }

    const newColors = { ...customColors, [colorKey]: newValue };
    setCustomColors(newColors);

    // Apply to CSS
    const cssVarMap: Record<string, string> = {
      primary: '--primary',
      secondary: '--secondary',
      background: '--background',
      sidebar: '--sidebar-background',
    };
    document.documentElement.style.setProperty(cssVarMap[colorKey], newValue);

    if (colorKey === 'primary') {
      document.documentElement.style.setProperty('--accent', newValue);
      document.documentElement.style.setProperty('--ring', newValue);
    }
    if (colorKey === 'secondary') {
      document.documentElement.style.setProperty('--muted', newValue);
      document.documentElement.style.setProperty('--border', newValue);
    }
    if (colorKey === 'background') {
      document.documentElement.style.setProperty('--card', newValue);
    }

    // Check if still modified after reset
    const stillModified =
      (colorKey !== 'primary' && newColors.primary !== referenceColors.primary) ||
      (colorKey !== 'secondary' && newColors.secondary !== referenceColors.secondary) ||
      (colorKey !== 'background' && newColors.background !== referenceColors.background) ||
      (colorKey !== 'sidebar' && newColors.sidebar !== referenceSidebar);

    if (!stillModified) {
      setIsCustomTheme(false);
    }
  };

  // Reset heading font to preset default
  const handleResetHeadingFont = () => {
    if (!currentPreset) return;
    setHeadingFont(currentPreset.id);
    document.documentElement.style.setProperty('--font-heading', currentPreset.typography.headingFont);
    const scale = fontScales[currentPreset.id] || 1;
    document.documentElement.style.setProperty('--font-heading-scale', String(scale));

    // Check if still modified
    const presetColors = isDark ? currentPreset.colors.dark : currentPreset.colors.light;
    const stillModified =
      customColors.primary !== presetColors.primary ||
      customColors.secondary !== presetColors.secondary ||
      customColors.background !== presetColors.background ||
      bodyFont !== 'lexend';
    if (!stillModified) {
      setIsCustomTheme(false);
    }
  };

  // Reset body font to default
  const handleResetBodyFont = () => {
    setBodyFont('lexend');
    document.documentElement.style.setProperty('--font-body', 'var(--font-lexend)');

    // Check if still modified
    if (currentPreset) {
      const presetColors = isDark ? currentPreset.colors.dark : currentPreset.colors.light;
      const stillModified =
        customColors.primary !== presetColors.primary ||
        customColors.secondary !== presetColors.secondary ||
        customColors.background !== presetColors.background ||
        headingFont !== currentPreset.id;
      if (!stillModified) {
        setIsCustomTheme(false);
      }
    }
  };

  // Reset all to preset/custom theme defaults
  const handleResetColors = () => {
    // Check if a saved custom theme is active
    if (activeCustomThemeId) {
      const savedTheme = savedCustomThemes.find(t => t.id === activeCustomThemeId);
      if (savedTheme) {
        const sidebarColor = savedTheme.colors.sidebar || darkenHsl(savedTheme.colors.background, 0.3);
        setCustomColors({
          primary: savedTheme.colors.primary,
          secondary: savedTheme.colors.secondary,
          background: savedTheme.colors.background,
          sidebar: sidebarColor,
        });
        setIsCustomTheme(false);
        // Apply saved theme colors
        document.documentElement.style.setProperty('--primary', savedTheme.colors.primary);
        document.documentElement.style.setProperty('--accent', savedTheme.colors.primary);
        document.documentElement.style.setProperty('--ring', savedTheme.colors.primary);
        document.documentElement.style.setProperty('--secondary', savedTheme.colors.secondary);
        document.documentElement.style.setProperty('--muted', savedTheme.colors.secondary);
        document.documentElement.style.setProperty('--border', savedTheme.colors.secondary);
        document.documentElement.style.setProperty('--background', savedTheme.colors.background);
        document.documentElement.style.setProperty('--card', savedTheme.colors.background);
        document.documentElement.style.setProperty('--sidebar-background', sidebarColor);
        // Reset fonts to saved theme defaults
        setHeadingFont(savedTheme.headingFont);
        setBodyFont(savedTheme.bodyFont);
        const hFont = headingFonts.find(f => f.id === savedTheme.headingFont);
        if (hFont) {
          document.documentElement.style.setProperty('--font-heading', hFont.cssVar);
          document.documentElement.style.setProperty('--font-heading-scale', String(fontScales[savedTheme.headingFont] || 1));
        }
        const bFont = bodyFonts.find(f => f.id === savedTheme.bodyFont);
        if (bFont) {
          document.documentElement.style.setProperty('--font-body', bFont.cssVar);
        }
        // Reset logo to saved theme's logo
        if (savedTheme.logoConfig) {
          setLogoConfig(savedTheme.logoConfig);
        }
        return;
      }
    }

    // Check if Bland theme is active
    if (activePresetId === 'custom') {
      const blandColors = {
        primary: '220 9% 46%',
        secondary: '220 9% 18%',
        background: '220 9% 8%',
        sidebar: darkenHsl('220 9% 8%', 0.3),
      };
      setCustomColors(blandColors);
      setIsCustomTheme(false);
      // Apply Bland colors
      document.documentElement.style.setProperty('--primary', blandColors.primary);
      document.documentElement.style.setProperty('--accent', blandColors.primary);
      document.documentElement.style.setProperty('--ring', blandColors.primary);
      document.documentElement.style.setProperty('--secondary', blandColors.secondary);
      document.documentElement.style.setProperty('--muted', blandColors.secondary);
      document.documentElement.style.setProperty('--border', blandColors.secondary);
      document.documentElement.style.setProperty('--background', blandColors.background);
      document.documentElement.style.setProperty('--card', blandColors.background);
      document.documentElement.style.setProperty('--sidebar-background', blandColors.sidebar);
      // Reset fonts to Bland defaults
      setHeadingFont('custom');
      setBodyFont('lexend');
      document.documentElement.style.setProperty('--font-heading', 'var(--font-heading-custom)');
      document.documentElement.style.setProperty('--font-body', 'var(--font-lexend)');
      document.documentElement.style.setProperty('--font-heading-scale', '1');
      return;
    }

    // Reset to current preset
    if (!currentPreset) return;

    const colors = isDark ? currentPreset.colors.dark : currentPreset.colors.light;
    const sidebarColor = darkenHsl(colors.background, 0.3);

    setCustomColors({
      primary: colors.primary,
      secondary: colors.secondary,
      background: colors.background,
      sidebar: sidebarColor,
    });
    setIsCustomTheme(false);

    // Apply preset colors
    document.documentElement.style.setProperty('--primary', colors.primary);
    document.documentElement.style.setProperty('--accent', colors.primary);
    document.documentElement.style.setProperty('--ring', colors.primary);
    document.documentElement.style.setProperty('--secondary', colors.secondary);
    document.documentElement.style.setProperty('--muted', colors.secondary);
    document.documentElement.style.setProperty('--border', colors.secondary);
    document.documentElement.style.setProperty('--background', colors.background);
    document.documentElement.style.setProperty('--card', colors.background);
    document.documentElement.style.setProperty('--sidebar-background', sidebarColor);

    // Reset fonts to preset defaults
    setHeadingFont(currentPreset.id);
    setBodyFont('lexend');
    document.documentElement.style.setProperty('--font-heading', currentPreset.typography.headingFont);
    document.documentElement.style.setProperty('--font-body', 'var(--font-lexend)');
    const scale = fontScales[currentPreset.id] || 1;
    document.documentElement.style.setProperty('--font-heading-scale', String(scale));
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

  // Check if we need confirmation before saving (when overwriting existing custom theme)
  const handleSaveClick = () => {
    if (!config) return;

    // Check if we're saving a custom theme and there's already a saved custom theme
    const hasExistingCustomTheme = config.theme.preset === 'custom';

    if (isCustomTheme && hasExistingCustomTheme) {
      // Show confirmation dialog
      setOverwriteCustomDialogOpen(true);
    } else {
      // Proceed with save directly
      handleSave();
    }
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
          // Preserve all existing theme properties
          ...config.theme,
          preset: isCustomTheme ? 'custom' : activePresetId, // Save whether user is in custom mode or a preset
          colors: {
            ...config.theme.colors,
            primary: customColors.primary,
            secondary: customColors.secondary,
            accent: customColors.primary, // Derived from primary
            background: customColors.background,
            muted: customColors.secondary, // Derived from secondary
            border: customColors.secondary, // Derived from secondary
          },
          logoConfig: {
            type: logoConfig.type,
            path: logoConfig.path,
            shape: logoConfig.shape || 'none',
            frame: logoConfig.frame || 'none',
            ...(logoConfig.artist && { artist: logoConfig.artist }),
            ...(logoConfig.iconColor && { iconColor: logoConfig.iconColor }),
            ...(logoConfig.frameColor && { frameColor: logoConfig.frameColor }),
            ...(logoConfig.glow && logoConfig.glow !== 'none' && { glow: logoConfig.glow }),
            ...(logoConfig.glowColor && { glowColor: logoConfig.glowColor }),
            ...(logoConfig.cropSettings && { cropSettings: logoConfig.cropSettings }),
            ...(logoConfig.history && logoConfig.history.length > 0 && {
              history: logoConfig.history.map(entry => ({
                type: entry.type,
                path: entry.path,
                savedAt: entry.savedAt,
                shape: entry.shape || 'none',
                frame: entry.frame || 'none',
                ...(entry.artist && { artist: entry.artist }),
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
          <TabsContent value="admin" className="space-y-4 pb-16">
            <Tabs defaultValue="general" className="space-y-4">
              <TabsList>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="theme">Theme</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="discord">Discord</TabsTrigger>
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
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Theme Preset</CardTitle>
                          <CardDescription>
                            Choose a base theme, then customize below
                          </CardDescription>
                        </div>
                        {isThemeModified() && (
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-amber-500 border-amber-500/50">
                              Modified
                            </Badge>
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
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-3 grid-cols-3">
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
                        {/* Bland theme - neutral starting point */}
                        <button
                          type="button"
                          onClick={() => {
                            const blandColors = {
                              primary: '220 9% 46%',
                              secondary: '220 9% 18%',
                              background: '220 9% 8%',
                              sidebar: darkenHsl('220 9% 8%', 0.3),
                            };
                            setCustomColors(blandColors);
                            setIsCustomTheme(false);
                            setActivePreset('custom');
                            setActiveCustomThemeId(null);
                            // Apply colors to CSS
                            document.documentElement.style.setProperty('--primary', blandColors.primary);
                            document.documentElement.style.setProperty('--accent', blandColors.primary);
                            document.documentElement.style.setProperty('--ring', blandColors.primary);
                            document.documentElement.style.setProperty('--secondary', blandColors.secondary);
                            document.documentElement.style.setProperty('--muted', blandColors.secondary);
                            document.documentElement.style.setProperty('--border', blandColors.secondary);
                            document.documentElement.style.setProperty('--background', blandColors.background);
                            document.documentElement.style.setProperty('--card', blandColors.background);
                            document.documentElement.style.setProperty('--sidebar-background', blandColors.sidebar);
                            // Set Tilt Prism as the heading font for Bland theme
                            setHeadingFont('custom');
                            setBodyFont('lexend');
                            document.documentElement.style.setProperty('--font-heading', 'var(--font-heading-custom)');
                            document.documentElement.style.setProperty('--font-body', 'var(--font-lexend)');
                            document.documentElement.style.setProperty('--font-heading-scale', '1');
                          }}
                          className={cn(
                            'relative flex items-center gap-3 p-3 rounded-lg border text-left transition-all hover:bg-muted/50',
                            activePresetId === 'custom' && !activeCustomThemeId && 'ring-2 ring-primary bg-muted/30'
                          )}
                        >
                          <div
                            className="w-8 h-8 flex-shrink-0"
                            style={{
                              backgroundColor: 'hsl(220 9% 46%)',
                              WebkitMask: `url(${getThemeIcon('custom')?.svg}) center/contain no-repeat`,
                              mask: `url(${getThemeIcon('custom')?.svg}) center/contain no-repeat`
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">Bland</p>
                          </div>
                          {activePresetId === 'custom' && !activeCustomThemeId && (
                            <div className="absolute top-1 right-1 rounded-full bg-primary p-0.5">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                          )}
                        </button>
                      </div>

                      {/* Custom Themes Section */}
                      {savedCustomThemes.length > 0 && (
                        <div className="pt-3 border-t">
                          <p className="text-sm font-medium mb-3 text-muted-foreground">Saved Custom Themes</p>
                          <div className="grid gap-3 grid-cols-3">
                            {savedCustomThemes.map((theme) => (
                              <button
                                key={theme.id}
                                type="button"
                                onClick={async () => {
                                  // Apply the saved custom theme
                                  setCustomColors({
                                    primary: theme.colors.primary,
                                    secondary: theme.colors.secondary,
                                    background: theme.colors.background,
                                    sidebar: theme.colors.sidebar || darkenHsl(theme.colors.background, 0.3),
                                  });
                                  setHeadingFont(theme.headingFont);
                                  setBodyFont(theme.bodyFont);
                                  setIsCustomTheme(false);
                                  setActiveCustomThemeId(theme.id);
                                  setActivePreset('custom');
                                  // Apply to CSS
                                  document.documentElement.style.setProperty('--primary', theme.colors.primary);
                                  document.documentElement.style.setProperty('--accent', theme.colors.primary);
                                  document.documentElement.style.setProperty('--ring', theme.colors.primary);
                                  document.documentElement.style.setProperty('--secondary', theme.colors.secondary);
                                  document.documentElement.style.setProperty('--muted', theme.colors.secondary);
                                  document.documentElement.style.setProperty('--border', theme.colors.secondary);
                                  document.documentElement.style.setProperty('--background', theme.colors.background);
                                  document.documentElement.style.setProperty('--card', theme.colors.background);
                                  document.documentElement.style.setProperty('--sidebar-background', theme.colors.sidebar || darkenHsl(theme.colors.background, 0.3));
                                  // Apply fonts
                                  const hFont = headingFonts.find(f => f.id === theme.headingFont);
                                  const bFont = bodyFonts.find(f => f.id === theme.bodyFont);
                                  if (hFont) {
                                    document.documentElement.style.setProperty('--font-heading', hFont.cssVar);
                                    document.documentElement.style.setProperty('--font-heading-scale', String(fontScales[theme.headingFont] || 1));
                                  }
                                  if (bFont) {
                                    document.documentElement.style.setProperty('--font-body', bFont.cssVar);
                                  }
                                  // Apply logo if saved
                                  if (theme.logoConfig) {
                                    setLogoConfig(theme.logoConfig);
                                  }
                                  // Persist the selection to config
                                  if (config) {
                                    try {
                                      await updateGuildConfig({
                                        theme: {
                                          ...config.theme,
                                          preset: theme.id, // Save the custom theme ID
                                        },
                                      });
                                    } catch (err) {
                                      console.error('Failed to save theme selection:', err);
                                    }
                                  }
                                }}
                                className={cn(
                                  'relative flex items-center gap-3 p-3 rounded-lg border text-left transition-all hover:bg-muted/50 group',
                                  activeCustomThemeId === theme.id && 'ring-2 ring-primary bg-muted/30'
                                )}
                              >
                                {theme.logoConfig && theme.logoConfig.type !== 'none' ? (
                                  <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                                    <LogoPreview config={theme.logoConfig} size="xs" />
                                  </div>
                                ) : (
                                  <div
                                    className="w-8 h-8 rounded flex-shrink-0"
                                    style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
                                  />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{theme.name}</p>
                                </div>
                                {activeCustomThemeId === theme.id && (
                                  <div className="absolute top-1 right-1 rounded-full bg-primary p-0.5">
                                    <Check className="h-3 w-3 text-primary-foreground" />
                                  </div>
                                )}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteThemeId(theme.id);
                                  }}
                                  className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/20 rounded transition-opacity"
                                  title="Delete theme"
                                >
                                  <Trash2 className="h-3 w-3 text-destructive" />
                                </button>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Save buttons */}
                      {isThemeModified() && (
                        <div className="pt-2 border-t flex justify-end gap-2">
                          {/* Save button - only when editing an existing custom theme */}
                          {activeCustomThemeId && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={async () => {
                                if (!config || !activeCustomThemeId) return;
                                const existingTheme = savedCustomThemes.find(t => t.id === activeCustomThemeId);
                                if (!existingTheme) return;

                                // Build resolved logo config (freeze colors if needed)
                                let resolvedLogoConfig = { ...logoConfig };

                                // Only resolve theme-icon if it has a valid base preset
                                if (logoConfig.type === 'theme-icon') {
                                  // Use the saved theme's basePreset to resolve, or fall back to path if it's a valid preset
                                  const basePreset = existingTheme.basePreset;
                                  const themeIcon = getThemeIcon(basePreset) || getThemeIcon(logoConfig.path || '');
                                  if (themeIcon) {
                                    resolvedLogoConfig = {
                                      ...logoConfig,
                                      type: 'library-icon',
                                      path: themeIcon.svg,
                                    };
                                  } else {
                                    // If we can't resolve, keep the existing saved logo
                                    if (existingTheme.logoConfig) {
                                      resolvedLogoConfig = { ...existingTheme.logoConfig };
                                    }
                                  }
                                }

                                // Freeze theme colors to actual values for saved custom themes
                                if (resolvedLogoConfig.type !== 'none' && resolvedLogoConfig.type !== 'custom-image') {
                                  if (!resolvedLogoConfig.iconColor || resolvedLogoConfig.iconColor === '__theme__') {
                                    resolvedLogoConfig.iconColor = customColors.primary;
                                  }
                                  if (resolvedLogoConfig.frameColor === '__theme__' || (resolvedLogoConfig.frame && resolvedLogoConfig.frame !== 'none' && !resolvedLogoConfig.frameColor)) {
                                    resolvedLogoConfig.frameColor = customColors.primary;
                                  }
                                  if (resolvedLogoConfig.glowColor === '__theme__' || (resolvedLogoConfig.glow && resolvedLogoConfig.glow !== 'none' && !resolvedLogoConfig.glowColor)) {
                                    resolvedLogoConfig.glowColor = customColors.primary;
                                  }
                                }

                                const updatedTheme = {
                                  ...existingTheme,
                                  colors: {
                                    primary: customColors.primary,
                                    secondary: customColors.secondary,
                                    background: customColors.background,
                                    sidebar: customColors.sidebar,
                                  },
                                  headingFont,
                                  bodyFont,
                                  logoConfig: resolvedLogoConfig,
                                };
                                const updatedThemes = savedCustomThemes.map(t =>
                                  t.id === activeCustomThemeId ? updatedTheme : t
                                );
                                await updateGuildConfig({
                                  theme: {
                                    ...config.theme,
                                    customThemes: updatedThemes,
                                  },
                                });
                                await refreshConfig();
                                // Update local logoConfig to match the saved (resolved) version
                                setLogoConfig(resolvedLogoConfig);
                                setIsCustomTheme(false);
                                toast.success(`Theme "${existingTheme.name}" updated`);
                              }}
                            >
                              <Save className="h-4 w-4 mr-1" />
                              Save
                            </Button>
                          )}
                          {/* Save As button - always available when modified */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSaveThemeDialogOpen(true)}
                          >
                            <Save className="h-4 w-4 mr-1" />
                            {activeCustomThemeId ? 'Save As...' : 'Save as Custom Theme'}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Customization Section Header */}
                  <h3 className="text-sm font-medium text-muted-foreground pt-2">Customize Theme</h3>

                  {/* Logo Settings Card */}
                  <Collapsible open={logoSectionOpen} onOpenChange={setLogoSectionOpen}>
                    <Card>
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Image className="h-5 w-5 text-muted-foreground" />
                              <CardTitle className="text-base">Logo</CardTitle>
                            </div>
                            <ChevronDown className={cn(
                              "h-4 w-4 text-muted-foreground transition-transform duration-200",
                              logoSectionOpen && "rotate-180"
                            )} />
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="pt-0">
                          <LogoSettings
                            config={logoConfig}
                            onChange={handleLogoChange}
                          />
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>

                  {/* Colors Card */}
                  <Collapsible open={colorsSectionOpen} onOpenChange={setColorsSectionOpen}>
                    <Card>
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Palette className="h-5 w-5 text-muted-foreground" />
                              <CardTitle className="text-base">Colors</CardTitle>
                            </div>
                            <ChevronDown className={cn(
                              "h-4 w-4 text-muted-foreground transition-transform duration-200",
                              colorsSectionOpen && "rotate-180"
                            )} />
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="pt-0">
                          <div className="grid gap-4 sm:grid-cols-2">
                            {/* Primary Color */}
                            <div className="flex items-center justify-between p-3 rounded-lg border">
                              <div className="flex items-center gap-3">
                                <label className="relative w-10 h-10 rounded-md border cursor-pointer overflow-hidden flex-shrink-0">
                                  <input
                                    type="color"
                                    value={hslToHex(customColors.primary)}
                                    onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                                    className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                                  />
                                  <div className="w-full h-full" style={{ backgroundColor: `hsl(${customColors.primary})` }} />
                                </label>
                                <div>
                                  <p className="text-sm font-medium">Primary</p>
                                  <p className="text-xs text-muted-foreground">Buttons, links, accents</p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleResetColor('primary')}
                                title="Reset to preset"
                              >
                                <RotateCcw className="h-3 w-3" />
                              </Button>
                            </div>

                            {/* Secondary Color */}
                            <div className="flex items-center justify-between p-3 rounded-lg border">
                              <div className="flex items-center gap-3">
                                <label className="relative w-10 h-10 rounded-md border cursor-pointer overflow-hidden flex-shrink-0">
                                  <input
                                    type="color"
                                    value={hslToHex(customColors.secondary)}
                                    onChange={(e) => handleCustomColorChange('secondary', e.target.value)}
                                    className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                                  />
                                  <div className="w-full h-full" style={{ backgroundColor: `hsl(${customColors.secondary})` }} />
                                </label>
                                <div>
                                  <p className="text-sm font-medium">Secondary</p>
                                  <p className="text-xs text-muted-foreground">Borders, muted elements</p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleResetColor('secondary')}
                                title="Reset to preset"
                              >
                                <RotateCcw className="h-3 w-3" />
                              </Button>
                            </div>

                            {/* Background Color */}
                            <div className="flex items-center justify-between p-3 rounded-lg border">
                              <div className="flex items-center gap-3">
                                <label className="relative w-10 h-10 rounded-md border cursor-pointer overflow-hidden flex-shrink-0">
                                  <input
                                    type="color"
                                    value={hslToHex(customColors.background)}
                                    onChange={(e) => handleCustomColorChange('background', e.target.value)}
                                    className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                                  />
                                  <div className="w-full h-full" style={{ backgroundColor: `hsl(${customColors.background})` }} />
                                </label>
                                <div>
                                  <p className="text-sm font-medium">Background</p>
                                  <p className="text-xs text-muted-foreground">Page background</p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleResetColor('background')}
                                title="Reset to preset"
                              >
                                <RotateCcw className="h-3 w-3" />
                              </Button>
                            </div>

                            {/* Sidebar Color */}
                            <div className="flex items-center justify-between p-3 rounded-lg border">
                              <div className="flex items-center gap-3">
                                <label className="relative w-10 h-10 rounded-md border cursor-pointer overflow-hidden flex-shrink-0">
                                  <input
                                    type="color"
                                    value={hslToHex(customColors.sidebar)}
                                    onChange={(e) => handleCustomColorChange('sidebar', e.target.value)}
                                    className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                                  />
                                  <div className="w-full h-full" style={{ backgroundColor: `hsl(${customColors.sidebar})` }} />
                                </label>
                                <div>
                                  <p className="text-sm font-medium">Sidebar</p>
                                  <p className="text-xs text-muted-foreground">Sidebar background</p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleResetColor('sidebar')}
                                title="Reset to preset"
                              >
                                <RotateCcw className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>

                  {/* Typography Card */}
                  <Collapsible open={typographySectionOpen} onOpenChange={setTypographySectionOpen}>
                    <Card>
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground font-serif text-lg leading-none">Aa</span>
                              <CardTitle className="text-base">Typography</CardTitle>
                            </div>
                            <ChevronDown className={cn(
                              "h-4 w-4 text-muted-foreground transition-transform duration-200",
                              typographySectionOpen && "rotate-180"
                            )} />
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="pt-0">
                          <div className="grid gap-4 sm:grid-cols-2">
                            {/* Heading Font */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label>Heading Font</Label>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={handleResetHeadingFont}
                                  title="Reset to preset"
                                >
                                  <RotateCcw className="h-3 w-3" />
                                </Button>
                              </div>
                              <Select value={headingFont} onValueChange={handleHeadingFontChange}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {headingFonts.map((font) => (
                                    <SelectItem key={font.id} value={font.id}>
                                      <span style={{ fontFamily: font.cssVar }}>
                                        {font.name} <span className="text-muted-foreground">({font.theme})</span>
                                      </span>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Body Font */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label>Body Font</Label>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={handleResetBodyFont}
                                  title="Reset to default"
                                >
                                  <RotateCcw className="h-3 w-3" />
                                </Button>
                              </div>
                              <Select value={bodyFont} onValueChange={handleBodyFontChange}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {bodyFonts.map((font) => (
                                    <SelectItem key={font.id} value={font.id}>
                                      <span style={{ fontFamily: font.cssVar }}>{font.name}</span>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                </div>
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

              <TabsContent value="discord">
                <div className="space-y-4">
                  {/* Discord Membership Requirement */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Access Control
                      </CardTitle>
                      <CardDescription>
                        Control who can access your guild website
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="require-discord">Require Discord Membership</Label>
                          <p className="text-sm text-muted-foreground">
                            Users must be a member of your Discord server to view the site.
                            Non-members will see a login prompt.
                          </p>
                        </div>
                        <Switch
                          id="require-discord"
                          checked={config?.discord?.requireDiscordMembership ?? false}
                          onCheckedChange={async (checked) => {
                            if (!config) return;
                            try {
                              await updateGuildConfig({
                                discord: {
                                  ...config.discord,
                                  enabled: config.discord?.enabled ?? true,
                                  roleMappings: config.discord?.roleMappings ?? [],
                                  requireDiscordMembership: checked,
                                },
                              });
                              await refreshConfig();
                            } catch (err) {
                              console.error('Failed to update setting:', err);
                            }
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Discord Role Permissions */}
                  <DiscordRoleSettings />
                </div>
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
            <div className="sticky bottom-0 z-50 -mx-6 px-6 py-4 mt-4 backdrop-blur-md flex justify-end items-center gap-4">
              {success && (
                <span className="text-sm text-green-500">Settings saved successfully!</span>
              )}
              {error && (
                <span className="text-sm text-destructive">{error}</span>
              )}
              <Button variant="outline" onClick={handleCancelChanges} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleSaveClick} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
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

      {/* Save Custom Theme Dialog */}
      <Dialog open={saveThemeDialogOpen} onOpenChange={setSaveThemeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Custom Theme</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="theme-name">Theme Name</Label>
              <Input
                id="theme-name"
                placeholder="My Custom Theme"
                value={newThemeName}
                onChange={(e) => setNewThemeName(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg border bg-muted/30">
              {/* Logo preview */}
              <LogoPreview
                config={logoConfig.type === 'theme-icon'
                  ? { ...logoConfig, path: activePresetId }
                  : logoConfig
                }
                size="md"
              />
              {/* Color swatches */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded" style={{ backgroundColor: `hsl(${customColors.primary})` }} />
                  <span className="text-xs text-muted-foreground">Primary</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded" style={{ backgroundColor: `hsl(${customColors.secondary})` }} />
                  <span className="text-xs text-muted-foreground">Secondary</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded border" style={{ backgroundColor: `hsl(${customColors.background})` }} />
                  <span className="text-xs text-muted-foreground">Background</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setSaveThemeDialogOpen(false);
              setNewThemeName('');
            }}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (!config || !newThemeName.trim()) return;

                // Resolve theme-icon to library-icon with the actual icon path
                // Also freeze icon color if using theme color (undefined means theme color)
                let resolvedLogoConfig = { ...logoConfig };
                if (logoConfig.type === 'theme-icon') {
                  const themeIcon = getThemeIcon(activePresetId);
                  if (themeIcon) {
                    resolvedLogoConfig = {
                      ...logoConfig,
                      type: 'library-icon',
                      path: themeIcon.svg,
                    };
                  }
                }
                // Freeze colors to current primary if using theme color (undefined or THEME_COLOR_MARKER)
                if (resolvedLogoConfig.type !== 'none' && resolvedLogoConfig.type !== 'custom-image') {
                  // Freeze icon color
                  if (!resolvedLogoConfig.iconColor) {
                    resolvedLogoConfig.iconColor = customColors.primary;
                  }
                  // Freeze frame color if using theme color
                  if (resolvedLogoConfig.frameColor === '__theme__' || (resolvedLogoConfig.frame && resolvedLogoConfig.frame !== 'none' && !resolvedLogoConfig.frameColor)) {
                    resolvedLogoConfig.frameColor = customColors.primary;
                  }
                  // Freeze glow color if using theme color
                  if (resolvedLogoConfig.glowColor === '__theme__' || (resolvedLogoConfig.glow && resolvedLogoConfig.glow !== 'none' && !resolvedLogoConfig.glowColor)) {
                    resolvedLogoConfig.glowColor = customColors.primary;
                  }
                }

                const newTheme: SavedCustomTheme = {
                  id: `custom-${Date.now()}`,
                  name: newThemeName.trim(),
                  basePreset: activePresetId,
                  colors: {
                    primary: customColors.primary,
                    secondary: customColors.secondary,
                    background: customColors.background,
                    sidebar: customColors.sidebar,
                  },
                  headingFont,
                  bodyFont,
                  logoConfig: resolvedLogoConfig,
                  createdAt: new Date().toISOString(),
                };
                const updatedThemes = [...savedCustomThemes, newTheme];
                await updateGuildConfig({
                  theme: {
                    ...config.theme,
                    customThemes: updatedThemes,
                    preset: newTheme.id, // Select the new custom theme
                  },
                });
                await refreshConfig();
                // Select the newly saved theme
                setActiveCustomThemeId(newTheme.id);
                // Update local logoConfig to match the saved (resolved) version
                setLogoConfig(resolvedLogoConfig);
                setIsCustomTheme(false);
                setActivePreset('custom');
                setSaveThemeDialogOpen(false);
                setNewThemeName('');
              }}
              disabled={!newThemeName.trim()}
            >
              Save Theme
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Custom Theme Confirmation Dialog */}
      <AlertDialog open={!!deleteThemeId} onOpenChange={(open) => !open && setDeleteThemeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Custom Theme?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{themeToDelete?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => {
                if (!config || !deleteThemeId) return;
                const themeName = themeToDelete?.name;
                const updatedThemes = savedCustomThemes.filter(t => t.id !== deleteThemeId);
                await updateGuildConfig({
                  theme: {
                    ...config.theme,
                    customThemes: updatedThemes,
                  },
                });
                await refreshConfig();
                if (activeCustomThemeId === deleteThemeId) {
                  setActiveCustomThemeId(null);
                }
                setDeleteThemeId(null);
                toast.success(`Theme "${themeName}" deleted`);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Overwrite Custom Theme Confirmation Dialog */}
      <AlertDialog open={overwriteCustomDialogOpen} onOpenChange={setOverwriteCustomDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Overwrite Custom Theme?</AlertDialogTitle>
            <AlertDialogDescription>
              You already have a custom theme saved. Saving now will overwrite your existing custom theme settings with the current colors and fonts.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSave}>
              Overwrite
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
