/**
 * Expansion-Specific Profession Configurations
 *
 * Defines which professions are available and their max skill levels per expansion
 */

import type { Profession } from '@/lib/types/professions.types';
import type { WoWExpansion } from '@/lib/types/guild-config.types';

export interface ProfessionLimits {
  maxSkill: number; // Maximum skill level for this expansion
  professions: readonly Profession[]; // Available professions
}

/**
 * Profession availability and skill caps per expansion
 */
export const EXPANSION_PROFESSIONS: Record<WoWExpansion, ProfessionLimits> = {
  classic: {
    maxSkill: 300,
    professions: [
      'Alchemy',
      'Blacksmithing',
      'Cooking',
      'Enchanting',
      'Engineering',
      'Fishing',
      'Herbalism',
      'Leatherworking',
      'Mining',
      'Skinning',
      'Tailoring',
    ],
  },
  tbc: {
    maxSkill: 375,
    professions: [
      'Alchemy',
      'Blacksmithing',
      'Cooking',
      'Enchanting',
      'Engineering',
      'Fishing',
      'Herbalism',
      'Jewelcrafting', // Added in TBC
      'Leatherworking',
      'Mining',
      'Skinning',
      'Tailoring',
    ],
  },
  wotlk: {
    maxSkill: 450,
    professions: [
      'Alchemy',
      'Blacksmithing',
      'Cooking',
      'Enchanting',
      'Engineering',
      'Fishing',
      'Herbalism',
      'Inscription', // Added in WotLK
      'Jewelcrafting',
      'Leatherworking',
      'Mining',
      'Skinning',
      'Tailoring',
    ],
  },
  cata: {
    maxSkill: 525,
    professions: [
      'Alchemy',
      'Blacksmithing',
      'Cooking',
      'Enchanting',
      'Engineering',
      'Fishing',
      'Herbalism',
      'Inscription',
      'Jewelcrafting',
      'Leatherworking',
      'Mining',
      'Skinning',
      'Tailoring',
    ],
  },
};

/**
 * Skill tier thresholds per expansion
 * Used for displaying profession mastery levels
 */
export const PROFESSION_SKILL_TIERS: Record<
  WoWExpansion,
  Array<{ min: number; max: number; label: string; color: string }>
> = {
  classic: [
    { min: 1, max: 74, label: 'Apprentice', color: 'hsl(0 0% 60%)' },
    { min: 75, max: 149, label: 'Journeyman', color: 'hsl(120 40% 50%)' },
    { min: 150, max: 224, label: 'Artisan', color: 'hsl(210 50% 50%)' },
    { min: 225, max: 299, label: 'Expert', color: 'hsl(270 50% 50%)' },
    { min: 300, max: 300, label: 'Master', color: 'hsl(30 80% 50%)' },
  ],
  tbc: [
    { min: 1, max: 74, label: 'Apprentice', color: 'hsl(0 0% 60%)' },
    { min: 75, max: 149, label: 'Journeyman', color: 'hsl(120 40% 50%)' },
    { min: 150, max: 224, label: 'Artisan', color: 'hsl(210 50% 50%)' },
    { min: 225, max: 299, label: 'Expert', color: 'hsl(270 50% 50%)' },
    { min: 300, max: 374, label: 'Master', color: 'hsl(30 80% 50%)' },
    { min: 375, max: 375, label: 'Grand Master', color: 'hsl(15 90% 50%)' },
  ],
  wotlk: [
    { min: 1, max: 74, label: 'Apprentice', color: 'hsl(0 0% 60%)' },
    { min: 75, max: 149, label: 'Journeyman', color: 'hsl(120 40% 50%)' },
    { min: 150, max: 224, label: 'Artisan', color: 'hsl(210 50% 50%)' },
    { min: 225, max: 299, label: 'Expert', color: 'hsl(270 50% 50%)' },
    { min: 300, max: 374, label: 'Master', color: 'hsl(30 80% 50%)' },
    { min: 375, max: 449, label: 'Grand Master', color: 'hsl(15 90% 50%)' },
    { min: 450, max: 450, label: 'Illustrious Grand Master', color: 'hsl(0 100% 50%)' },
  ],
  cata: [
    { min: 1, max: 74, label: 'Apprentice', color: 'hsl(0 0% 60%)' },
    { min: 75, max: 149, label: 'Journeyman', color: 'hsl(120 40% 50%)' },
    { min: 150, max: 224, label: 'Artisan', color: 'hsl(210 50% 50%)' },
    { min: 225, max: 299, label: 'Expert', color: 'hsl(270 50% 50%)' },
    { min: 300, max: 374, label: 'Master', color: 'hsl(30 80% 50%)' },
    { min: 375, max: 449, label: 'Grand Master', color: 'hsl(15 90% 50%)' },
    { min: 450, max: 524, label: 'Illustrious Grand Master', color: 'hsl(0 100% 50%)' },
    { min: 525, max: 525, label: 'Zen Master', color: 'hsl(280 70% 50%)' },
  ],
};

/**
 * Get available professions for an expansion
 */
export function getProfessionsForExpansion(expansion: WoWExpansion): readonly Profession[] {
  return EXPANSION_PROFESSIONS[expansion]?.professions || EXPANSION_PROFESSIONS.classic.professions;
}

/**
 * Get maximum skill level for an expansion
 */
export function getMaxSkillForExpansion(expansion: WoWExpansion): number {
  return EXPANSION_PROFESSIONS[expansion]?.maxSkill || 300;
}

/**
 * Get skill tier info for a given skill level in an expansion
 */
export function getSkillTier(
  skill: number,
  expansion: WoWExpansion
): { label: string; color: string } | null {
  const tiers = PROFESSION_SKILL_TIERS[expansion] || PROFESSION_SKILL_TIERS.classic;
  const tier = tiers.find((t) => skill >= t.min && skill <= t.max);
  return tier ? { label: tier.label, color: tier.color } : null;
}

/**
 * Check if a profession is available in an expansion
 */
export function isProfessionAvailableInExpansion(
  profession: Profession,
  expansion: WoWExpansion
): boolean {
  return EXPANSION_PROFESSIONS[expansion]?.professions.includes(profession) || false;
}

/**
 * Validate profession skill level for expansion
 */
export function isValidSkillLevel(skill: number, expansion: WoWExpansion): boolean {
  const maxSkill = getMaxSkillForExpansion(expansion);
  return skill >= 0 && skill <= maxSkill;
}

/**
 * Get skill percentage (for progress bars)
 */
export function getSkillPercentage(skill: number, expansion: WoWExpansion): number {
  const maxSkill = getMaxSkillForExpansion(expansion);
  return Math.min(100, Math.round((skill / maxSkill) * 100));
}
