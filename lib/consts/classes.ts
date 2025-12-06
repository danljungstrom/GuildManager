/**
 * WoW Classes Configuration
 *
 * Centralized configuration for all class-related data including
 * available specs, roles, and visual styling.
 */

import type { RoleType } from '@/lib/types/roles.types';
import type { ClassConfig, ClassType } from '@/lib/types/classes.types';

/**
 * Available classes in alphabetical order
 */
export const CLASSES = [
  'Druid',
  'Hunter',
  'Mage',
  'Paladin',
  'Priest',
  'Rogue',
  'Shaman',
  'Warlock',
  'Warrior',
] as const;

/**
 * Class configuration with icons and colors
 * Note: Only includes classes available in Classic WoW
 * Use expansion-specific configs for other classes
 */
export const CLASS_CONFIGS: Partial<Record<ClassType, ClassConfig>> = {
  Druid: {
    name: 'Druid',
    color: 'hsl(28 100% 51%)', // #FF7C0A
    icon: '/icons/classes/druid.png',
    specs: [
      { name: 'Balance', role: 'DPS', icon: '/icons/specs/druid-balance.jpg' },
      { name: 'Feral', role: 'Tank', icon: '/icons/specs/druid-feral.jpg' },
      { name: 'Restoration', role: 'Healer', icon: '/icons/specs/druid-restoration.jpg' },
    ],
  },
  Hunter: {
    name: 'Hunter',
    color: 'hsl(83 52% 65%)', // #AAD372
    icon: '/icons/classes/hunter.png',
    specs: [
      { name: 'Beast Mastery', role: 'DPS', icon: '/icons/specs/hunter-beastmastery.jpg' },
      { name: 'Marksmanship', role: 'DPS', icon: '/icons/specs/hunter-marksmanship.jpg' },
      { name: 'Survival', role: 'DPS', icon: '/icons/specs/hunter-survival.jpg' },
    ],
  },
  Mage: {
    name: 'Mage',
    color: 'hsl(194 87% 58%)', // #3FC7EB
    icon: '/icons/classes/mage.png',
    specs: [
      { name: 'Arcane', role: 'DPS', icon: '/icons/specs/mage-arcane.jpg' },
      { name: 'Fire', role: 'DPS', icon: '/icons/specs/mage-fire.jpg' },
      { name: 'Frost', role: 'DPS', icon: '/icons/specs/mage-frost.jpg' },
    ],
  },
  Paladin: {
    name: 'Paladin',
    color: 'hsl(334 85% 76%)', // #F48CBA
    icon: '/icons/classes/paladin.png',
    specs: [
      { name: 'Holy', role: 'Healer', icon: '/icons/specs/paladin-holy.jpg' },
      { name: 'Protection', role: 'Tank', icon: '/icons/specs/paladin-prot.jpg' },
      { name: 'Retribution', role: 'DPS', icon: '/icons/specs/paladin-retribution.jpg' },
    ],
  },
  Priest: {
    name: 'Priest',
    color: 'hsl(0 0% 100%)', // #FFFFFF
    icon: '/icons/classes/priest.png',
    specs: [
      { name: 'Discipline', role: 'Healer', icon: '/icons/specs/priest-discipline.jpg' },
      { name: 'Holy', role: 'Healer', icon: '/icons/specs/priest-holy.jpg' },
      { name: 'Shadow', role: 'DPS', icon: '/icons/specs/priest-shadow.jpg' },
    ],
  },
  Rogue: {
    name: 'Rogue',
    color: 'hsl(57 100% 69%)', // #FFF468
    icon: '/icons/classes/rogue.png',
    specs: [
      { name: 'Assassination', role: 'DPS', icon: '/icons/specs/rogue-assassination.jpg' },
      { name: 'Combat', role: 'DPS', icon: '/icons/specs/rogue-combat.jpg' },
      { name: 'Subtlety', role: 'DPS', icon: '/icons/specs/rogue-subtlety.jpg' },
    ],
  },
  Shaman: {
    name: 'Shaman',
    color: 'hsl(209 100% 44%)', // #0070DD
    icon: '/icons/classes/shaman.png',
    specs: [
      { name: 'Elemental', role: 'DPS', icon: '/icons/specs/shaman-elemental.jpg' },
      { name: 'Enhancement', role: 'DPS', icon: '/icons/specs/shaman-enhancement.jpg' },
      { name: 'Restoration', role: 'Healer', icon: '/icons/specs/shaman-resto.jpg' },
    ],
  },
  Warlock: {
    name: 'Warlock',
    color: 'hsl(241 69% 73%)', // #8788EE
    icon: '/icons/classes/warlock.png',
    specs: [
      { name: 'Affliction', role: 'DPS', icon: '/icons/specs/warlock-affliction.jpg' },
      { name: 'Demonology', role: 'DPS', icon: '/icons/specs/warlock-demonology.jpg' },
      { name: 'Destruction', role: 'DPS', icon: '/icons/specs/warlock-destruction.jpg' },
    ],
  },
  Warrior: {
    name: 'Warrior',
    color: 'hsl(30 37% 60%)', // #C69B6D
    icon: '/icons/classes/warrior.png',
    specs: [
      { name: 'Arms', role: 'DPS', icon: '/icons/specs/warrior-arms.jpg' },
      { name: 'Fury', role: 'DPS', icon: '/icons/specs/warrior-fury.jpg' },
      { name: 'Protection', role: 'Tank', icon: '/icons/specs/warrior-protection.jpg' },
    ],
  },
  'Death Knight': {
    name: 'Death Knight',
    color: 'hsl(340 75% 35%)', // #C41E3A
    icon: '/icons/classes/deathknight.png',
    specs: [
      { name: 'Blood', role: 'Tank', icon: '/icons/specs/dk-blood.jpg' },
      { name: 'Frost', role: 'DPS', icon: '/icons/specs/dk-frost.jpg' },
      { name: 'Unholy', role: 'DPS', icon: '/icons/specs/dk-unholy.jpg' },
    ],
  },
  'Demon Hunter': {
    name: 'Demon Hunter',
    color: 'hsl(282 80% 38%)', // #A330C9
    icon: '/icons/classes/demonhunter.png',
    specs: [
      { name: 'Havoc', role: 'DPS', icon: '/icons/specs/dh-havoc.jpg' },
      { name: 'Vengeance', role: 'Tank', icon: '/icons/specs/dh-vengeance.jpg' },
    ],
  },
  Monk: {
    name: 'Monk',
    color: 'hsl(115 54% 55%)', // #00FF96
    icon: '/icons/classes/monk.png',
    specs: [
      { name: 'Brewmaster', role: 'Tank', icon: '/icons/specs/monk-brewmaster.jpg' },
      { name: 'Mistweaver', role: 'Healer', icon: '/icons/specs/monk-mistweaver.jpg' },
      { name: 'Windwalker', role: 'DPS', icon: '/icons/specs/monk-windwalker.jpg' },
    ],
  },
  Evoker: {
    name: 'Evoker',
    color: 'hsl(160 65% 48%)', // #33937F
    icon: '/icons/classes/evoker.png',
    specs: [
      { name: 'Devastation', role: 'DPS', icon: '/icons/specs/evoker-devastation.jpg' },
      { name: 'Preservation', role: 'Healer', icon: '/icons/specs/evoker-preservation.jpg' },
      { name: 'Augmentation', role: 'DPS', icon: '/icons/specs/evoker-augmentation.jpg' },
    ],
  },
};

/**
 * Utility Functions for Class Management
 */

/**
 * Get all available classes as an array
 */
export const getAllClasses = (): readonly ClassType[] => CLASSES;

/**
 * Get all available specializations for a class
 */
export const getClassSpecializations = (className: ClassType): string[] => {
  return CLASS_CONFIGS[className]?.specs.map((s) => s.name) || [];
};

/**
 * Get the class color for styling
 */
export const getClassColor = (className: ClassType): string => {
  return CLASS_CONFIGS[className]?.color || 'hsl(0 0% 100%)';
};

/**
 * Get the class icon for UI
 */
export const getClassIcon = (className: ClassType): string => {
  return CLASS_CONFIGS[className]?.icon || '';
};

/**
 * Get the primary role for a class-spec combination
 */
export const getSpecRole = (className: ClassType, spec: string): RoleType | null => {
  const specObj = CLASS_CONFIGS[className]?.specs.find((s) => s.name === spec);
  return specObj ? specObj.role : null;
};

/**
 * Check if a class/spec combination is valid
 */
export const isValidClassSpec = (className: ClassType, spec: string): boolean => {
  return CLASS_CONFIGS[className]?.specs.map((s) => s.name).includes(spec) || false;
};

/**
 * Check if a class name is valid
 */
export const isValidClass = (className: string): className is ClassType => {
  return (CLASSES as readonly string[]).includes(className);
};

/**
 * Get the icon for a class-spec combination
 */
export const getSpecIcon = (className: ClassType, spec: string): string => {
  const classConfig = CLASS_CONFIGS[className];
  if (!classConfig) {
    return CLASS_CONFIGS.Warrior?.icon || '';
  }

  const specObj = classConfig.specs.find((s) => s.name === spec);
  if (!specObj) {
    return classConfig.icon;
  }

  return specObj.icon;
};

/**
 * Get available roles for a class/spec
 */
export const getAvailableRolesForClass = (className: ClassType, spec?: string): RoleType[] => {
  const classConfig = CLASS_CONFIGS[className];
  if (!classConfig) return [];

  if (spec) {
    const specObj = classConfig.specs.find((s) => s.name === spec);
    return specObj ? [specObj.role as RoleType] : [];
  }

  return Array.from(new Set(classConfig.specs.map((s) => s.role as RoleType)));
};
