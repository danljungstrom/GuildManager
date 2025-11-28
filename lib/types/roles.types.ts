/**
 * Role types for global use
 */
import { ROLES, EXTRA_ROLES } from '@/lib/consts/roles';

/**
 * Type-safe role types
 */
export type RoleType = (typeof ROLES)[number];
export type ExtraRoleType = (typeof EXTRA_ROLES)[number];

export interface RoleConfig {
  key: RoleType;
  displayName: string;
  color: string;
  icon: string;
}
