/**
 * Icon Library Types
 *
 * Types for the game-icons.net icon library used for guild logo selection.
 */

/**
 * Single icon data
 */
export interface IconData {
  name: string;
  artist: string;
  tags: string[];
  path: string; // Relative path: "artist/icon-name"
}

/**
 * Full icon library data structure
 */
export interface IconLibrary {
  generatedAt: string;
  totalIcons: number;
  icons: Record<string, IconData>; // path -> icon data
  tagIndex: Record<string, string[]>; // tag -> icon paths
  artistIndex: Record<string, string[]>; // artist -> icon paths
}

/**
 * Icon search/filter criteria
 */
export interface IconFilterCriteria {
  search?: string; // Search by name
  tags?: string[]; // Filter by tags (AND logic)
  artists?: string[]; // Filter by artists
}

/**
 * Common WoW-related tags for filtering
 */
export const WOW_RELEVANT_TAGS = [
  // Combat
  'weapon',
  'sword',
  'axe',
  'shield',
  'armor',
  'blade',
  'bow',
  'arrow',
  'spear',

  // Magic
  'magic',
  'fire',
  'ice',
  'lightning',
  'skull',
  'death',

  // Creatures
  'creature',
  'animal',
  'dragon',
  'wolf',
  'bird',

  // Fantasy
  'medieval-fantasy',
  'helmet',
  'crown',
  'castle',
  'tower',

  // Nature
  'nature',
  'tree',
  'leaf',
  'moon',
  'sun',
  'star',

  // Symbols
  'symbol',
  'emblem',
  'cross',
  'abstract',

  // Misc
  'potion',
  'scroll',
  'book',
  'gem',
  'ring',
] as const;

export type WoWRelevantTag = typeof WOW_RELEVANT_TAGS[number];
