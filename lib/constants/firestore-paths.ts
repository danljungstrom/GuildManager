/**
 * Firestore document paths
 *
 * Centralized constants for Firestore paths to make it easy
 * to change document locations in the future.
 */

export const FIRESTORE_PATHS = {
  GUILD_CONFIG: 'config/guild',
  MEMBERS: 'members',
  RAIDS: 'raids',
} as const;
