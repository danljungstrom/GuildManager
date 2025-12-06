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

export const PROFESSION_CONFIGS: Record<string, ProfessionConfig> = {
  Alchemy: {
    name: 'Alchemy',
    icon: '/icons/professions/alchemy.png',
    category: 'CRAFTING',
    isPrimary: true,
  },
  Blacksmithing: {
    name: 'Blacksmithing',
    icon: '/icons/professions/blacksmithing.png',
    category: 'CRAFTING',
    isPrimary: true,
  },
  Cooking: {
    name: 'Cooking',
    icon: '/icons/professions/cooking.png',
    category: 'CRAFTING',
    isPrimary: false,
  },
  Enchanting: {
    name: 'Enchanting',
    icon: '/icons/professions/enchanting.png',
    category: 'CRAFTING',
    isPrimary: true,
  },
  Engineering: {
    name: 'Engineering',
    icon: '/icons/professions/engineering.png',
    category: 'CRAFTING',
    isPrimary: true,
  },
  Fishing: {
    name: 'Fishing',
    icon: '/icons/professions/fishing.png',
    category: 'GATHERING',
    isPrimary: false,
  },
  Herbalism: {
    name: 'Herbalism',
    icon: '/icons/professions/herbalism.png',
    category: 'GATHERING',
    isPrimary: true,
  },
  Inscription: {
    name: 'Inscription',
    icon: '/icons/professions/inscription.png',
    category: 'CRAFTING',
    isPrimary: true,
  },
  Jewelcrafting: {
    name: 'Jewelcrafting',
    icon: '/icons/professions/jewelcrafting.png',
    category: 'CRAFTING',
    isPrimary: true,
  },
  Leatherworking: {
    name: 'Leatherworking',
    icon: '/icons/professions/leatherworking.png',
    category: 'CRAFTING',
    isPrimary: true,
  },
  Mining: {
    name: 'Mining',
    icon: '/icons/professions/mining.png',
    category: 'GATHERING',
    isPrimary: true,
  },
  Skinning: {
    name: 'Skinning',
    icon: '/icons/professions/skinning.png',
    category: 'GATHERING',
    isPrimary: true,
  },
  Tailoring: {
    name: 'Tailoring',
    icon: '/icons/professions/tailoring.png',
    category: 'CRAFTING',
    isPrimary: true,
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
 * All available skill levels
 */
export const PROFESSION_SKILL_LEVELS: number[] = [0, 75, 150, 225, 300];
