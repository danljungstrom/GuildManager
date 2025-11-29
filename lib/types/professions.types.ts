/**
 * Profession types for global use
 */

export type Profession =
  | 'Alchemy'
  | 'Blacksmithing'
  | 'Cooking'
  | 'Enchanting'
  | 'Engineering'
  | 'Fishing'
  | 'Herbalism'
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
