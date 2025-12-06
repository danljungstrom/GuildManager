/**
 * Profession types for global use
 */

import type { WoWExpansion } from './guild-config.types';

export type Profession =
  | 'Alchemy'
  | 'Blacksmithing'
  | 'Cooking'
  | 'Enchanting'
  | 'Engineering'
  | 'Fishing'
  | 'Herbalism'
  | 'Inscription'
  | 'Jewelcrafting'
  | 'Leatherworking'
  | 'Mining'
  | 'Skinning'
  | 'Tailoring';

export type ProfessionCategory = 'CRAFTING' | 'GATHERING';

export interface ProfessionConfig {
  name: Profession;
  icon: string;
  category: ProfessionCategory;
  isPrimary: boolean;
  /** First expansion where this profession is available */
  minExpansion: WoWExpansion;
}

export interface ProfessionSkillTier {
  min: number;
  label: string;
  color: string;
}

export interface CharacterProfession {
  profession: Profession;
  skill: number;
}
