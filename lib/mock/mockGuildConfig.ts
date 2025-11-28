/**
 * Mock Guild Configuration
 *
 * This provides sample guild configuration data for development and testing.
 * In production, this would be loaded from Firestore.
 */

import type { GuildConfig } from '@/lib/types/guild-config.types';
import { DEFAULT_THEME_COLORS } from '@/lib/types/guild-config.types';

export const mockGuildConfig: GuildConfig = {
  id: 'demo-guild-001',
  metadata: {
    name: 'Seios Aner',
    server: 'Defias Pillager',
    region: 'EU',
    faction: 'Alliance',
    expansion: 'classic',
    description:
      'A semi-hardcore raiding guild focused on progression while maintaining a friendly atmosphere.',
    website: 'https://example.com',
    discordInvite: 'https://discord.gg/example',
    recruitmentMessage:
      'Currently recruiting healers and tanks for our progression team!',
  },
  theme: {
    colors: DEFAULT_THEME_COLORS,
    darkMode: true,
    borderRadius: '0.75rem',
  },
  features: {
    enableRaidPlanning: true,
    enableAttunementTracking: true,
    enableProfessionTracking: true,
    enablePublicRoster: true,
  },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: new Date().toISOString(),
};

/**
 * Alternative theme configurations for demonstration
 */
export const alternativeThemes = {
  horde: {
    ...mockGuildConfig,
    metadata: {
      ...mockGuildConfig.metadata,
      name: 'For The Horde',
      faction: 'Horde' as const,
    },
    theme: {
      ...mockGuildConfig.theme,
      colors: {
        ...DEFAULT_THEME_COLORS,
        primary: '0 84% 40%', // Red theme for Horde
        accent: '0 84% 40%',
      },
    },
  },
  tbc: {
    ...mockGuildConfig,
    metadata: {
      ...mockGuildConfig.metadata,
      expansion: 'tbc' as const,
    },
    theme: {
      ...mockGuildConfig.theme,
      colors: {
        ...DEFAULT_THEME_COLORS,
        primary: '142 76% 36%', // Green theme for TBC
        accent: '142 76% 36%',
      },
    },
  },
  wotlk: {
    ...mockGuildConfig,
    metadata: {
      ...mockGuildConfig.metadata,
      expansion: 'wotlk' as const,
    },
    theme: {
      ...mockGuildConfig.theme,
      colors: {
        ...DEFAULT_THEME_COLORS,
        primary: '200 100% 50%', // Blue theme for WotLK
        accent: '200 100% 50%',
      },
    },
  },
};
