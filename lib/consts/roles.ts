import type { RoleType, ExtraRoleType, RoleConfig } from '@/lib/types/roles.types';

/**
 * Raid Role Management Configuration
 *
 * Defines all available raid roles and guild positions with proper
 * type safety and utility functions.
 */

/**
 * Primary raid roles
 * These represent the main roles needed for raid composition
 */
export const ROLES = ['Tank', 'DPS', 'Healer'] as const;

/**
 * Extra roles that can be assigned to guild members
 * These roles provide additional responsibilities or titles
 */
export const EXTRA_ROLES = ['Raid Leader', 'Class Leader', 'Main Tank', 'Enchanter'] as const;

export const ROLE_CONFIGS: Record<RoleType, RoleConfig> = {
  Tank: {
    key: 'Tank',
    displayName: 'Tank',
    color: 'hsl(195 48% 38%)',
    icon: '/icons/roles/tank.png',
  },
  DPS: {
    key: 'DPS',
    displayName: 'DPS',
    color: 'hsl(0 55% 42%)',
    icon: '/icons/roles/dps.png',
  },
  Healer: {
    key: 'Healer',
    displayName: 'Healer',
    color: 'hsl(122 45% 44%)',
    icon: '/icons/roles/healer.png',
  },
};

/**
 * Utility Functions for Role Management
 */

/**
 * Get all available roles as an array
 */
export const getAllRoles = (): readonly RoleType[] => ROLES;

/**
 * Get all available extra roles as an array
 */
export const getAllExtraRoles = (): readonly ExtraRoleType[] => EXTRA_ROLES;

/**
 * Get the display name for a role
 */
export const getRoleDisplayName = (role: RoleType): string => {
  return ROLE_CONFIGS[role]?.displayName || role;
};

/**
 * Get the color for a role
 */
export const getRoleColor = (role: RoleType): string => {
  return ROLE_CONFIGS[role]?.color || 'hsl(0 0% 100%)';
};

/**
 * Get the icon for a role
 */
export const getRoleIcon = (role: RoleType): string => {
  return ROLE_CONFIGS[role]?.icon || '';
};

/**
 * Check if a role is valid
 */
export const isValidRole = (role: string): role is RoleType => {
  return (ROLES as readonly string[]).includes(role);
};

/**
 * Check if an extra role is valid
 */
export const isValidExtraRole = (role: string): role is ExtraRoleType => {
  return (EXTRA_ROLES as readonly string[]).includes(role);
};
