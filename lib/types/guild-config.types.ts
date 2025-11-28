/**
 * Guild Configuration Types
 *
 * Defines the structure for guild configuration including
 * branding, theming, and metadata that can be customized
 * by administrators at runtime.
 */

export type WoWRegion = 'US' | 'EU' | 'KR' | 'TW' | 'CN';
export type WoWExpansion = 'classic' | 'tbc' | 'wotlk' | 'cata' | 'retail';
export type WoWFaction = 'Alliance' | 'Horde';

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
 * Theme configuration including colors and styling preferences
 */
export interface ThemeConfig {
  colors: ThemeColors;
  darkMode?: boolean;
  logo?: string;
  favicon?: string;
  customCSS?: string;
  borderRadius?: string;
}

/**
 * Guild metadata and settings
 */
export interface GuildMetadata {
  name: string;
  server: string;
  region: WoWRegion;
  faction: WoWFaction;
  expansion: WoWExpansion;
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
