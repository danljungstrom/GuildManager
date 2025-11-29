/**
 * Class and spec types for global use
 */
import { CLASSES } from '@/lib/consts/classes';
import type { RoleType } from '@/lib/types/roles.types';

/**
 * Type-safe class type derived from CLASSES array
 */
export type ClassType = (typeof CLASSES)[number];

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
