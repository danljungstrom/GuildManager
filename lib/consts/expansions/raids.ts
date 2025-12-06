/**
 * Expansion-Specific Raid Configurations
 *
 * Defines all raids available for each expansion with metadata
 */

import type { WoWExpansion } from '@/lib/types/guild-config.types';

export interface RaidConfig {
  id: string; // Unique identifier (e.g., 'mc', 'bwl')
  name: string; // Display name (e.g., 'Molten Core')
  shortName?: string; // Abbreviated name (e.g., 'MC')
  maxPlayers: number; // Raid size (10, 20, 25, 40)
  minLevel?: number; // Minimum character level
  icon?: string; // Path to raid icon
  color?: string; // Theme color for UI
  bosses?: string[]; // List of boss names
  attunementRequired?: boolean;
  attunementId?: string; // Links to attunement tracking
  releasePhase?: number; // Which content phase it was released
  difficulty?: 'Normal' | 'Heroic' | 'Mythic' | 'Flex'; // For later expansions
}

/**
 * Classic WoW Raids
 */
export const CLASSIC_RAIDS: RaidConfig[] = [
  {
    id: 'mc',
    name: 'Molten Core',
    shortName: 'MC',
    maxPlayers: 40,
    minLevel: 60,
    color: 'hsl(14 100% 50%)', // Orange/Red
    releasePhase: 1,
    attunementRequired: true,
    attunementId: 'mc',
    bosses: [
      'Lucifron',
      'Magmadar',
      'Gehennas',
      'Garr',
      'Shazzrah',
      'Baron Geddon',
      'Sulfuron Harbinger',
      'Golemagg the Incinerator',
      'Majordomo Executus',
      'Ragnaros',
    ],
  },
  {
    id: 'onyxia',
    name: "Onyxia's Lair",
    shortName: 'Ony',
    maxPlayers: 40,
    minLevel: 60,
    color: 'hsl(270 60% 40%)', // Purple
    releasePhase: 1,
    attunementRequired: true,
    attunementId: 'onyxia',
    bosses: ['Onyxia'],
  },
  {
    id: 'bwl',
    name: 'Blackwing Lair',
    shortName: 'BWL',
    maxPlayers: 40,
    minLevel: 60,
    color: 'hsl(0 70% 30%)', // Dark Red
    releasePhase: 3,
    attunementRequired: true,
    attunementId: 'bwl',
    bosses: [
      'Razorgore the Untamed',
      'Vaelastrasz the Corrupt',
      'Broodlord Lashlayer',
      'Firemaw',
      'Ebonroc',
      'Flamegor',
      'Chromaggus',
      'Nefarian',
    ],
  },
  {
    id: 'aq20',
    name: 'Ruins of Ahn\'Qiraj',
    shortName: 'AQ20',
    maxPlayers: 20,
    minLevel: 60,
    color: 'hsl(50 80% 50%)', // Gold
    releasePhase: 5,
    attunementRequired: false,
    bosses: [
      'Kurinnaxx',
      'General Rajaxx',
      'Moam',
      'Buru the Gorger',
      'Ayamiss the Hunter',
      'Ossirian the Unscarred',
    ],
  },
  {
    id: 'aq40',
    name: 'Temple of Ahn\'Qiraj',
    shortName: 'AQ40',
    maxPlayers: 40,
    minLevel: 60,
    color: 'hsl(30 70% 40%)', // Bronze
    releasePhase: 5,
    attunementRequired: true,
    attunementId: 'aq40',
    bosses: [
      'The Prophet Skeram',
      'Silithid Royalty',
      'Battleguard Sartura',
      'Fankriss the Unyielding',
      'Viscidus',
      'Princess Huhuran',
      'Twin Emperors',
      'Ouro',
      'C\'Thun',
    ],
  },
  {
    id: 'naxx',
    name: 'Naxxramas',
    shortName: 'Naxx',
    maxPlayers: 40,
    minLevel: 60,
    color: 'hsl(180 50% 40%)', // Teal/Plague
    releasePhase: 6,
    attunementRequired: false,
    bosses: [
      'Anub\'Rekhan',
      'Grand Widow Faerlina',
      'Maexxna',
      'Noth the Plaguebringer',
      'Heigan the Unclean',
      'Loatheb',
      'Instructor Razuvious',
      'Gothik the Harvester',
      'The Four Horsemen',
      'Patchwerk',
      'Grobbulus',
      'Gluth',
      'Thaddius',
      'Sapphiron',
      'Kel\'Thuzad',
    ],
  },
  {
    id: 'zg',
    name: 'Zul\'Gurub',
    shortName: 'ZG',
    maxPlayers: 20,
    minLevel: 60,
    color: 'hsl(120 50% 40%)', // Green (jungle)
    releasePhase: 4,
    attunementRequired: false,
    bosses: [
      'High Priestess Jeklik',
      'High Priest Venoxis',
      'High Priestess Mar\'li',
      'Bloodlord Mandokir',
      'Edge of Madness',
      'High Priest Thekal',
      'High Priestess Arlokk',
      'Jin\'do the Hexxer',
      'Hakkar',
    ],
  },
];

/**
 * The Burning Crusade Raids
 */
export const TBC_RAIDS: RaidConfig[] = [
  {
    id: 'karazhan',
    name: 'Karazhan',
    shortName: 'Kara',
    maxPlayers: 10,
    minLevel: 70,
    color: 'hsl(270 40% 35%)', // Purple
    releasePhase: 1,
    attunementRequired: true,
    attunementId: 'karazhan',
  },
  {
    id: 'gruul',
    name: "Gruul's Lair",
    shortName: 'Gruul',
    maxPlayers: 25,
    minLevel: 70,
    color: 'hsl(30 50% 40%)', // Brown/Stone
    releasePhase: 1,
    attunementRequired: false,
  },
  {
    id: 'magtheridon',
    name: "Magtheridon's Lair",
    shortName: 'Mag',
    maxPlayers: 25,
    minLevel: 70,
    color: 'hsl(0 70% 40%)', // Red
    releasePhase: 1,
    attunementRequired: false,
  },
  {
    id: 'ssc',
    name: 'Serpentshrine Cavern',
    shortName: 'SSC',
    maxPlayers: 25,
    minLevel: 70,
    color: 'hsl(200 60% 40%)', // Blue
    releasePhase: 2,
    attunementRequired: true,
    attunementId: 'ssc',
  },
  {
    id: 'tk',
    name: 'The Eye (Tempest Keep)',
    shortName: 'TK',
    maxPlayers: 25,
    minLevel: 70,
    color: 'hsl(280 50% 50%)', // Purple/Arcane
    releasePhase: 2,
    attunementRequired: true,
    attunementId: 'tk',
  },
  {
    id: 'bt',
    name: 'Black Temple',
    shortName: 'BT',
    maxPlayers: 25,
    minLevel: 70,
    color: 'hsl(120 40% 25%)', // Dark Green
    releasePhase: 3,
    attunementRequired: true,
    attunementId: 'bt',
  },
  {
    id: 'hyjal',
    name: 'Hyjal Summit',
    shortName: 'Hyjal',
    maxPlayers: 25,
    minLevel: 70,
    color: 'hsl(30 70% 50%)', // Orange (fire)
    releasePhase: 3,
    attunementRequired: true,
    attunementId: 'hyjal',
  },
  {
    id: 'za',
    name: "Zul'Aman",
    shortName: 'ZA',
    maxPlayers: 10,
    minLevel: 70,
    color: 'hsl(15 60% 45%)', // Red/Orange
    releasePhase: 4,
    attunementRequired: false,
  },
  {
    id: 'swp',
    name: 'Sunwell Plateau',
    shortName: 'SWP',
    maxPlayers: 25,
    minLevel: 70,
    color: 'hsl(50 80% 60%)', // Gold/Light
    releasePhase: 5,
    attunementRequired: false,
  },
];

/**
 * Wrath of the Lich King Raids
 */
export const WOTLK_RAIDS: RaidConfig[] = [
  {
    id: 'naxx-wotlk',
    name: 'Naxxramas',
    shortName: 'Naxx',
    maxPlayers: 25,
    minLevel: 80,
    color: 'hsl(180 50% 40%)',
    releasePhase: 1,
    difficulty: 'Normal',
  },
  {
    id: 'naxx-10',
    name: 'Naxxramas (10)',
    shortName: 'Naxx 10',
    maxPlayers: 10,
    minLevel: 80,
    color: 'hsl(180 50% 40%)',
    releasePhase: 1,
    difficulty: 'Normal',
  },
  {
    id: 'os',
    name: 'Obsidian Sanctum',
    shortName: 'OS',
    maxPlayers: 25,
    minLevel: 80,
    color: 'hsl(0 60% 30%)',
    releasePhase: 1,
  },
  {
    id: 'eoe',
    name: 'Eye of Eternity',
    shortName: 'EoE',
    maxPlayers: 25,
    minLevel: 80,
    color: 'hsl(210 70% 50%)',
    releasePhase: 1,
  },
  {
    id: 'ulduar',
    name: 'Ulduar',
    shortName: 'Uld',
    maxPlayers: 25,
    minLevel: 80,
    color: 'hsl(45 50% 45%)',
    releasePhase: 2,
  },
  {
    id: 'toc',
    name: 'Trial of the Crusader',
    shortName: 'ToC',
    maxPlayers: 25,
    minLevel: 80,
    color: 'hsl(220 60% 50%)',
    releasePhase: 3,
    difficulty: 'Normal',
  },
  {
    id: 'toc-heroic',
    name: 'Trial of the Grand Crusader',
    shortName: 'ToGC',
    maxPlayers: 25,
    minLevel: 80,
    color: 'hsl(220 60% 40%)',
    releasePhase: 3,
    difficulty: 'Heroic',
  },
  {
    id: 'icc',
    name: 'Icecrown Citadel',
    shortName: 'ICC',
    maxPlayers: 25,
    minLevel: 80,
    color: 'hsl(200 40% 35%)',
    releasePhase: 4,
    difficulty: 'Normal',
  },
  {
    id: 'rs',
    name: 'Ruby Sanctum',
    shortName: 'RS',
    maxPlayers: 25,
    minLevel: 80,
    color: 'hsl(0 70% 50%)',
    releasePhase: 5,
  },
];

/**
 * Cataclysm Raids
 */
export const CATA_RAIDS: RaidConfig[] = [
  {
    id: 'bwd',
    name: 'Blackwing Descent',
    shortName: 'BWD',
    maxPlayers: 25,
    minLevel: 85,
    color: 'hsl(0 60% 30%)',
    releasePhase: 1,
    difficulty: 'Normal',
  },
  {
    id: 'bot',
    name: 'The Bastion of Twilight',
    shortName: 'BoT',
    maxPlayers: 25,
    minLevel: 85,
    color: 'hsl(280 50% 40%)',
    releasePhase: 1,
    difficulty: 'Normal',
  },
  {
    id: 'tot4w',
    name: 'Throne of the Four Winds',
    shortName: 'To4W',
    maxPlayers: 25,
    minLevel: 85,
    color: 'hsl(200 60% 50%)',
    releasePhase: 1,
    difficulty: 'Normal',
  },
  {
    id: 'fl',
    name: 'Firelands',
    shortName: 'FL',
    maxPlayers: 25,
    minLevel: 85,
    color: 'hsl(15 80% 50%)',
    releasePhase: 2,
    difficulty: 'Normal',
  },
  {
    id: 'ds',
    name: 'Dragon Soul',
    shortName: 'DS',
    maxPlayers: 25,
    minLevel: 85,
    color: 'hsl(45 60% 40%)',
    releasePhase: 3,
    difficulty: 'Normal',
  },
];

/**
 * All expansion raids mapping
 */
export const EXPANSION_RAIDS: Record<WoWExpansion, RaidConfig[]> = {
  classic: CLASSIC_RAIDS,
  tbc: TBC_RAIDS,
  wotlk: WOTLK_RAIDS,
  cata: CATA_RAIDS,
};

/**
 * Get all raids for a specific expansion
 */
export function getRaidsForExpansion(expansion: WoWExpansion): RaidConfig[] {
  return EXPANSION_RAIDS[expansion] || [];
}

/**
 * Get a specific raid by ID
 */
export function getRaidById(raidId: string, expansion: WoWExpansion): RaidConfig | null {
  const raids = EXPANSION_RAIDS[expansion];
  return raids.find((r) => r.id === raidId) || null;
}

/**
 * Get raids by max players (for filtering)
 */
export function getRaidsBySize(expansion: WoWExpansion, maxPlayers: number): RaidConfig[] {
  return EXPANSION_RAIDS[expansion].filter((r) => r.maxPlayers === maxPlayers);
}

/**
 * Get all unique raid sizes for an expansion
 */
export function getRaidSizesForExpansion(expansion: WoWExpansion): number[] {
  const raids = EXPANSION_RAIDS[expansion];
  return Array.from(new Set(raids.map((r) => r.maxPlayers))).sort((a, b) => a - b);
}
