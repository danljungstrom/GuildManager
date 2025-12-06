/**
 * Expansion Configurations Index
 *
 * Centralized exports for all expansion-specific configurations
 */

export * from './classes';
export * from './raids';
export * from './professions';

import type { WoWExpansion } from '@/lib/types/guild-config.types';

/**
 * Expansion display names
 */
export const EXPANSION_NAMES: Record<WoWExpansion, string> = {
  classic: 'Classic',
  tbc: 'The Burning Crusade',
  wotlk: 'Wrath of the Lich King',
  cata: 'Cataclysm',
};

/**
 * Expansion short names
 */
export const EXPANSION_SHORT_NAMES: Record<WoWExpansion, string> = {
  classic: 'Classic',
  tbc: 'TBC',
  wotlk: 'WotLK',
  cata: 'Cata',
};

/**
 * Get display name for an expansion
 */
export function getExpansionName(expansion: WoWExpansion): string {
  return EXPANSION_NAMES[expansion] || expansion;
}

/**
 * Get short name for an expansion
 */
export function getExpansionShortName(expansion: WoWExpansion): string {
  return EXPANSION_SHORT_NAMES[expansion] || expansion;
}

/**
 * All available expansions in chronological order
 */
export const ALL_EXPANSIONS: readonly WoWExpansion[] = [
  'classic',
  'tbc',
  'wotlk',
  'cata',
] as const;
