/**
 * WoW Professions Configuration
 *
 * Comprehensive configuration for all WoW professions including
 * skill levels, categories, and relationships.
 */

import type {
  Profession,
  ProfessionConfig,
  ProfessionSkillTier,
} from '@/lib/types/professions.types';

import type { WoWExpansion } from '@/lib/types/guild-config.types';

export const PROFESSION_CONFIGS: Record<string, ProfessionConfig> = {
  Alchemy: {
    name: 'Alchemy',
    icon: '/icons/professions/alchemy.png',
    category: 'CRAFTING',
    isPrimary: true,
    minExpansion: 'classic',
  },
  Blacksmithing: {
    name: 'Blacksmithing',
    icon: '/icons/professions/blacksmithing.png',
    category: 'CRAFTING',
    isPrimary: true,
    minExpansion: 'classic',
  },
  Cooking: {
    name: 'Cooking',
    icon: '/icons/professions/cooking.png',
    category: 'CRAFTING',
    isPrimary: false,
    minExpansion: 'classic',
  },
  Enchanting: {
    name: 'Enchanting',
    icon: '/icons/professions/enchanting.png',
    category: 'CRAFTING',
    isPrimary: true,
    minExpansion: 'classic',
  },
  Engineering: {
    name: 'Engineering',
    icon: '/icons/professions/engineering.png',
    category: 'CRAFTING',
    isPrimary: true,
    minExpansion: 'classic',
  },
  Fishing: {
    name: 'Fishing',
    icon: '/icons/professions/fishing.png',
    category: 'GATHERING',
    isPrimary: false,
    minExpansion: 'classic',
  },
  Herbalism: {
    name: 'Herbalism',
    icon: '/icons/professions/herbalism.png',
    category: 'GATHERING',
    isPrimary: true,
    minExpansion: 'classic',
  },
  Inscription: {
    name: 'Inscription',
    icon: '/icons/professions/inscription.png',
    category: 'CRAFTING',
    isPrimary: true,
    minExpansion: 'wotlk',
  },
  Jewelcrafting: {
    name: 'Jewelcrafting',
    icon: '/icons/professions/jewelcrafting.png',
    category: 'CRAFTING',
    isPrimary: true,
    minExpansion: 'tbc',
  },
  Leatherworking: {
    name: 'Leatherworking',
    icon: '/icons/professions/leatherworking.png',
    category: 'CRAFTING',
    isPrimary: true,
    minExpansion: 'classic',
  },
  Mining: {
    name: 'Mining',
    icon: '/icons/professions/mining.png',
    category: 'GATHERING',
    isPrimary: true,
    minExpansion: 'classic',
  },
  Skinning: {
    name: 'Skinning',
    icon: '/icons/professions/skinning.png',
    category: 'GATHERING',
    isPrimary: true,
    minExpansion: 'classic',
  },
  Tailoring: {
    name: 'Tailoring',
    icon: '/icons/professions/tailoring.png',
    category: 'CRAFTING',
    isPrimary: true,
    minExpansion: 'classic',
  },
};

/**
 * Profession skill tiers and their associated colors and labels.
 */
export const PROFESSION_SKILL_TIERS: ProfessionSkillTier[] = [
  { min: 300, label: 'Master', color: '#ffd700' },
  { min: 225, label: 'Expert', color: '#c0c0c0' },
  { min: 150, label: 'Artisan', color: '#cd7f32' },
  { min: 75, label: 'Journeyman', color: '#8b4513' },
  { min: 0, label: 'Apprentice', color: '#8b4513' },
];

/**
 * Get the skill tier config for a given skill level.
 */
export function getProfessionSkillTier(skillLevel: number): ProfessionSkillTier {
  return (
    PROFESSION_SKILL_TIERS.find((tier) => skillLevel >= tier.min) ||
    PROFESSION_SKILL_TIERS[PROFESSION_SKILL_TIERS.length - 1]
  );
}

/**
 * Get the config for a profession
 */
export const getProfessionConfig = (profession: Profession): ProfessionConfig => {
  return PROFESSION_CONFIGS[profession];
};

/**
 * Get the icon for a profession
 */
export const getProfessionIcon = (profession: Profession): string => {
  return PROFESSION_CONFIGS[profession]?.icon || '';
};

/**
 * All available professions as a string array
 */
export const PROFESSIONS: string[] = Object.keys(PROFESSION_CONFIGS);

/**
 * Expansion order for comparison
 */
const EXPANSION_ORDER: WoWExpansion[] = ['classic', 'tbc', 'wotlk', 'cata'];

/**
 * Check if a profession is available for a given expansion
 */
export function isProfessionAvailable(profession: Profession, expansion: WoWExpansion): boolean {
  const config = PROFESSION_CONFIGS[profession];
  if (!config) return false;

  const profExpansionIndex = EXPANSION_ORDER.indexOf(config.minExpansion);
  const currentExpansionIndex = EXPANSION_ORDER.indexOf(expansion);

  return profExpansionIndex <= currentExpansionIndex;
}

/**
 * Get professions available for a specific expansion
 */
export function getProfessionsForExpansion(expansion: WoWExpansion): Profession[] {
  return (Object.keys(PROFESSION_CONFIGS) as Profession[]).filter(
    (profession) => isProfessionAvailable(profession, expansion)
  );
}

/**
 * All available skill levels
 */
export const PROFESSION_SKILL_LEVELS: number[] = [0, 75, 150, 225, 300];
