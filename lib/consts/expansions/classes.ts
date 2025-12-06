/**
 * Expansion-Specific Class Configurations
 *
 * Defines which classes and specs are available for each expansion
 */

import type { ClassType } from '@/lib/types/classes.types';
import type { WoWExpansion } from '@/lib/types/guild-config.types';

/**
 * Class availability per expansion
 */
export const EXPANSION_CLASSES: Record<WoWExpansion, readonly ClassType[]> = {
  classic: [
    'Druid',
    'Hunter',
    'Mage',
    'Paladin',
    'Priest',
    'Rogue',
    'Shaman',
    'Warlock',
    'Warrior',
  ],
  tbc: [
    'Druid',
    'Hunter',
    'Mage',
    'Paladin',
    'Priest',
    'Rogue',
    'Shaman',
    'Warlock',
    'Warrior',
  ],
  wotlk: [
    'Death Knight', // New in WotLK
    'Druid',
    'Hunter',
    'Mage',
    'Paladin',
    'Priest',
    'Rogue',
    'Shaman',
    'Warlock',
    'Warrior',
  ],
  cata: [
    'Death Knight',
    'Druid',
    'Hunter',
    'Mage',
    'Paladin',
    'Priest',
    'Rogue',
    'Shaman',
    'Warlock',
    'Warrior',
  ],
};

/**
 * Spec availability per expansion per class
 */
export const EXPANSION_SPECS: Record<
  WoWExpansion,
  Partial<Record<ClassType, readonly string[]>>
> = {
  classic: {
    Druid: ['Balance', 'Feral Combat', 'Restoration'],
    Hunter: ['Beast Mastery', 'Marksmanship', 'Survival'],
    Mage: ['Arcane', 'Fire', 'Frost'],
    Paladin: ['Holy', 'Protection', 'Retribution'],
    Priest: ['Discipline', 'Holy', 'Shadow'],
    Rogue: ['Assassination', 'Combat', 'Subtlety'],
    Shaman: ['Elemental', 'Enhancement', 'Restoration'],
    Warlock: ['Affliction', 'Demonology', 'Destruction'],
    Warrior: ['Arms', 'Fury', 'Protection'],
  },
  tbc: {
    Druid: ['Balance', 'Feral', 'Restoration'], // Feral Combat split into Feral
    Hunter: ['Beast Mastery', 'Marksmanship', 'Survival'],
    Mage: ['Arcane', 'Fire', 'Frost'],
    Paladin: ['Holy', 'Protection', 'Retribution'],
    Priest: ['Discipline', 'Holy', 'Shadow'],
    Rogue: ['Assassination', 'Combat', 'Subtlety'],
    Shaman: ['Elemental', 'Enhancement', 'Restoration'],
    Warlock: ['Affliction', 'Demonology', 'Destruction'],
    Warrior: ['Arms', 'Fury', 'Protection'],
  },
  wotlk: {
    'Death Knight': ['Blood', 'Frost', 'Unholy'],
    Druid: ['Balance', 'Feral', 'Restoration'],
    Hunter: ['Beast Mastery', 'Marksmanship', 'Survival'],
    Mage: ['Arcane', 'Fire', 'Frost'],
    Paladin: ['Holy', 'Protection', 'Retribution'],
    Priest: ['Discipline', 'Holy', 'Shadow'],
    Rogue: ['Assassination', 'Combat', 'Subtlety'],
    Shaman: ['Elemental', 'Enhancement', 'Restoration'],
    Warlock: ['Affliction', 'Demonology', 'Destruction'],
    Warrior: ['Arms', 'Fury', 'Protection'],
  },
  cata: {
    'Death Knight': ['Blood', 'Frost', 'Unholy'],
    Druid: ['Balance', 'Feral', 'Guardian', 'Restoration'], // Guardian split from Feral
    Hunter: ['Beast Mastery', 'Marksmanship', 'Survival'],
    Mage: ['Arcane', 'Fire', 'Frost'],
    Paladin: ['Holy', 'Protection', 'Retribution'],
    Priest: ['Discipline', 'Holy', 'Shadow'],
    Rogue: ['Assassination', 'Combat', 'Subtlety'],
    Shaman: ['Elemental', 'Enhancement', 'Restoration'],
    Warlock: ['Affliction', 'Demonology', 'Destruction'],
    Warrior: ['Arms', 'Fury', 'Protection'],
  },
};

/**
 * Get available classes for an expansion
 */
export function getClassesForExpansion(expansion: WoWExpansion): readonly ClassType[] {
  return EXPANSION_CLASSES[expansion] || EXPANSION_CLASSES.classic;
}

/**
 * Get available specs for a class in a specific expansion
 */
export function getSpecsForExpansion(
  expansion: WoWExpansion,
  className: ClassType
): readonly string[] {
  return EXPANSION_SPECS[expansion]?.[className] || [];
}

/**
 * Check if a class is available in an expansion
 */
export function isClassAvailableInExpansion(
  className: ClassType,
  expansion: WoWExpansion
): boolean {
  return EXPANSION_CLASSES[expansion].includes(className);
}

/**
 * Check if a spec is available for a class in an expansion
 */
export function isSpecAvailableInExpansion(
  className: ClassType,
  spec: string,
  expansion: WoWExpansion
): boolean {
  const specs = EXPANSION_SPECS[expansion]?.[className] || [];
  return specs.includes(spec);
}
