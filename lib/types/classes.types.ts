/**
 * Class and spec types for global use
 */
import { CLASSES } from '@/lib/consts/classes';
import type { RoleType } from '@/lib/types/roles.types';

/**
 * All possible WoW classes across all expansions
 */
export type ClassType =
  | (typeof CLASSES)[number]
  | 'Death Knight' // WotLK+
  | 'Demon Hunter' // Legion+
  | 'Monk' // MoP+
  | 'Evoker'; // Dragonflight+

export interface ClassSpecConfig {
  name: string;
  role: RoleType;
  icon: string;
}

export interface ClassConfig {
  name: ClassType;
  color: string;
  icon: string;
  specs: ClassSpecConfig[];
}
