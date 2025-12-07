import { RoleMapping } from './auth.types';

/**
 * Guild Configuration Types
 *
 * Defines the structure for guild configuration including
 * branding, theming, and metadata that can be customized
 * by administrators at runtime.
 */

export type WoWRegion = 'US' | 'EU' | 'KR' | 'TW' | 'CN';
export type WoWExpansion = 'classic' | 'tbc' | 'wotlk' | 'cata';
export type WoWFaction = 'Alliance' | 'Horde';

/**
 * Discord integration settings
 */
export interface DiscordSettings {
  enabled: boolean;
  guildId?: string; // Discord server ID
  guildName?: string; // For display
  roleMappings: RoleMapping[];
  // Owner is the person who set up the site - always has SuperAdmin
  ownerId?: string; // Discord user ID of the site owner
  // Access control
  requireDiscordMembership?: boolean; // If true, users must be in the Discord server to access the site
}

/**
 * Theme color configuration
 * All colors should be in HSL format for CSS custom properties
 * Format: "hue saturation% lightness%" (e.g., "41 40% 60%")
 */
export interface ThemeColors {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
}

/**
 * Typography configuration for theme
 * Defines which fonts to use for headings and body text
 */
export interface ThemeTypography {
  headingFont: string; // CSS variable name, e.g., 'var(--font-heading-gold)'
  bodyFont: string;    // CSS variable name, e.g., 'var(--font-body)'
}

/**
 * Logo shape options
 * 'none' means no background/container - just the raw icon
 */
export type LogoShape = 'none' | 'circle' | 'square' | 'rounded';

/**
 * Logo frame style options
 */
export type LogoFrame = 'none' | 'simple' | 'ornate' | 'celtic' | 'chain' | 'runic' | 'thorns' | 'dragon';

/**
 * Logo glow style options
 */
export type LogoGlow = 'none' | 'soft' | 'medium' | 'intense' | 'pulse';

/**
 * Logo type options
 */
export type LogoType = 'library-icon' | 'custom-image' | 'theme-icon' | 'none';

/**
 * Crop settings for custom images
 * Allows editing crop/zoom after upload without re-uploading
 */
export interface CropSettings {
  x: number;      // X offset percentage (0-100)
  y: number;      // Y offset percentage (0-100)
  zoom: number;   // Zoom level (1-3)
}

/**
 * A saved logo entry for history - stores full logo config for reverting
 */
export interface LogoHistoryEntry {
  type: LogoType;
  path?: string;
  artist?: string;
  shape?: LogoShape;
  frame?: LogoFrame;
  iconColor?: string;
  frameColor?: string;
  glow?: LogoGlow;
  glowColor?: string;
  cropSettings?: CropSettings; // For custom images
  savedAt: string; // ISO date string
}

/**
 * Logo configuration
 */
export interface LogoConfig {
  type: LogoType;
  path?: string; // Icon path (e.g., "lorc/sword") or image URL
  artist?: string; // Artist name for attribution (library icons)
  shape?: LogoShape;
  frame?: LogoFrame;
  iconColor?: string; // HSL color for the icon (default: primary)
  frameColor?: string; // HSL color for the frame (default: based on frame type)
  glow?: LogoGlow; // Glow effect style
  glowColor?: string; // HSL color for the glow (default: frameColor or primary)
  cropSettings?: CropSettings; // Crop/zoom settings for custom images
  history?: LogoHistoryEntry[]; // Previous icons for reverting (max 5)
}

/**
 * Saved custom theme created by user
 */
export interface SavedCustomTheme {
  id: string; // Unique identifier
  name: string; // User-defined name
  basePreset: string; // Which preset it was based on
  colors: {
    primary: string;
    secondary: string;
    background: string;
    sidebar?: string; // Sidebar color (defaults to darkened background)
  };
  headingFont: string; // Font ID (e.g., 'spartan', 'horde')
  bodyFont: string; // Font ID (e.g., 'lexend', 'raleway')
  logoConfig?: LogoConfig; // Logo settings for this theme
  createdAt: string; // ISO timestamp
}

/**
 * Theme configuration including colors and styling preferences
 */
export interface ThemeConfig {
  colors: ThemeColors;
  typography?: ThemeTypography; // Optional typography configuration
  darkMode?: boolean;
  preset?: string; // Active preset ID or saved custom theme ID
  customThemes?: SavedCustomTheme[]; // User-saved custom themes
  // Legacy logo fields (for backwards compatibility)
  logo?: string;
  logoType?: 'theme-icon' | 'custom-image';
  logoFrame?: boolean;
  // New logo config
  logoConfig?: LogoConfig;
  favicon?: string;
  customCSS?: string;
  borderRadius?: string;
}

/**
 * Guild metadata and settings
 * Required fields are only those needed for initial setup (name)
 * Other fields can be configured later in admin settings
 */
export interface GuildMetadata {
  name: string;
  server?: string;
  region?: WoWRegion;
  faction?: WoWFaction;
  expansion?: WoWExpansion;
  description?: string;
  website?: string;
  discordInvite?: string;
  recruitmentMessage?: string;
}

/**
 * Complete guild configuration
 * This is the top-level configuration object that administrators can edit
 */
export interface GuildConfig {
  id: string;
  metadata: GuildMetadata;
  theme: ThemeConfig;
  discord?: DiscordSettings;
  features?: {
    enableRaidPlanning?: boolean;
    enableAttunementTracking?: boolean;
    enableProfessionTracking?: boolean;
    enablePublicRoster?: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Default Discord settings
 */
export const DEFAULT_DISCORD_SETTINGS: DiscordSettings = {
  enabled: true,
  roleMappings: [],
};

/**
 * Default theme colors (can be overridden by guild config)
 */
export const DEFAULT_THEME_COLORS: ThemeColors = {
  primary: '41 40% 60%',
  primaryForeground: '20 14.3% 4.1%',
  secondary: '24 9.8% 10%',
  secondaryForeground: '60 9.1% 97.8%',
  accent: '41 40% 60%',
  accentForeground: '20 14.3% 4.1%',
  background: '0 0% 100%',
  foreground: '20 14.3% 4.1%',
  card: '0 0% 100%',
  cardForeground: '20 14.3% 4.1%',
  muted: '60 4.8% 95.9%',
  mutedForeground: '25 5.3% 44.7%',
  border: '20 5.9% 90%',
  input: '20 5.9% 90%',
  ring: '41 40% 60%',
};

/**
 * Default dark mode theme colors
 */
export const DEFAULT_DARK_THEME_COLORS: ThemeColors = {
  primary: '41 40% 60%',
  primaryForeground: '20 14.3% 4.1%',
  secondary: '12 6.5% 15.1%',
  secondaryForeground: '60 9.1% 97.8%',
  accent: '12 6.5% 15.1%',
  accentForeground: '60 9.1% 97.8%',
  background: '20 14.3% 4.1%',
  foreground: '60 9.1% 97.8%',
  card: '20 14.3% 4.1%',
  cardForeground: '60 9.1% 97.8%',
  muted: '12 6.5% 15.1%',
  mutedForeground: '24 5.4% 63.9%',
  border: '12 6.5% 15.1%',
  input: '12 6.5% 15.1%',
  ring: '41 40% 60%',
};
