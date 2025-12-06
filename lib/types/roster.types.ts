/**
 * Roster Data Types
 *
 * Type definitions for guild member roster data, including character info,
 * raid attendance, professions, attunements, and administrative metadata.
 */

import type { ClassType } from './classes.types';
import type { RoleType, ExtraRoleType } from './roles.types';
import type { Profession } from './professions.types';

/**
 * Guild rank hierarchy
 * From highest to lowest authority
 */
export const GUILD_RANKS = ['GM', 'Officer', 'Core', 'Trial', 'Social'] as const;
export type GuildRank = (typeof GUILD_RANKS)[number];

/**
 * Raid attendance status
 */
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

/**
 * Profession entry with skill level
 */
export interface ProfessionEntry {
  profession: Profession;
  skill: number; // 0-300 (Classic WoW)
}

/**
 * Attunement tracking
 * Key is the attunement identifier (e.g., 'mc', 'onyxia', 'bwl')
 * Value is completion status
 */
export type AttunementMap = Record<string, boolean>;

/**
 * Available attunements for Classic WoW
 */
export interface Attunement {
  name: string; // Internal key (e.g., 'mc')
  displayName: string; // Display name (e.g., 'Molten Core')
  released: boolean; // Is currently available
  color: string; // Color for UI display
}

/**
 * Default attunements for Classic WoW
 */
export const CLASSIC_ATTUNEMENTS: Attunement[] = [
  { name: 'mc', displayName: 'Molten Core', released: true, color: '#FF6600' },
  { name: 'onyxia', displayName: 'Onyxia', released: true, color: '#A335EE' },
  { name: 'bwl', displayName: 'Blackwing Lair', released: true, color: '#C41F3B' },
  { name: 'aq20', displayName: 'AQ20', released: true, color: '#FFD700' },
  { name: 'aq40', displayName: 'AQ40', released: true, color: '#FF8C00' },
  { name: 'naxx', displayName: 'Naxxramas', released: true, color: '#00FFBA' },
];

/**
 * Gear information
 */
export interface GearInfo {
  gearScore?: number; // Overall gear score
  mainHandIlvl?: number;
  offHandIlvl?: number;
  headIlvl?: number;
  chestIlvl?: number;
  legsIlvl?: number;
}

/**
 * Complete guild member roster entry
 */
export interface RosterMember {
  // Identity
  id?: string; // Firestore document ID
  name: string; // Character name

  // Core attributes
  rank: GuildRank;
  class: ClassType;
  spec?: string; // Primary spec
  offSpec?: string; // Secondary spec
  role?: RoleType; // Primary raid role

  // Character details
  level?: number; // Character level (1-60 for Classic)
  race?: string; // Character race (not critical for initial implementation)

  // Gear and progression
  gearInfo?: GearInfo;
  attunements: AttunementMap;
  professions: ProfessionEntry[];

  // Raid tracking
  attendance?: {
    percentage: number; // Overall attendance percentage (0-100)
    lastRaid?: string; // ISO date string
    totalRaids?: number;
    attendedRaids?: number;
  };

  // Guild roles and responsibilities
  extraRoles?: ExtraRoleType[];

  // Metadata
  joinDate?: string; // ISO date string
  notes?: string; // Freeform admin notes
  playerName?: string; // Player's actual name (if different from character)
  altCharacters?: string[]; // List of alt character names

  // Timestamps
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string

  // Development/Testing
  isMock?: boolean; // True if this is mock/test data (can be safely deleted)
}

/**
 * Partial update type for efficient roster updates
 */
export type RosterMemberUpdate = Partial<RosterMember>;

/**
 * Filter criteria for roster display
 */
export interface RosterFilters {
  classes: ClassType[];
  roles: RoleType[];
  ranks: GuildRank[];
  attunements?: string[]; // Filter by specific attunements
  searchQuery?: string; // Text search
}

/**
 * Sort configuration
 */
export type RosterSortField =
  | 'name'
  | 'rank'
  | 'class'
  | 'level'
  | 'gearScore'
  | 'attendance'
  | 'joinDate';

export type RosterSortDirection = 'asc' | 'desc';

export interface RosterSort {
  field: RosterSortField;
  direction: RosterSortDirection;
}

/**
 * Utility type for creating new roster members
 * Omits auto-generated fields like id, createdAt, updatedAt
 */
export type CreateRosterMember = Omit<
  RosterMember,
  'id' | 'createdAt' | 'updatedAt'
>;

/**
 * Default empty roster member for form initialization
 */
export const DEFAULT_ROSTER_MEMBER: CreateRosterMember = {
  name: '',
  rank: 'Core',
  class: 'Warrior',
  spec: '',
  role: undefined,
  attunements: {},
  professions: [],
  notes: '',
};

/**
 * Initialize attunements map with default false values
 */
export function initializeAttunements(): AttunementMap {
  return CLASSIC_ATTUNEMENTS.reduce((acc, attunement) => {
    acc[attunement.name] = false;
    return acc;
  }, {} as AttunementMap);
}

/**
 * Get display name for a guild rank
 */
export function getRankDisplayName(rank: GuildRank): string {
  const displayNames: Record<GuildRank, string> = {
    GM: 'Guild Master',
    Officer: 'Officer',
    Core: 'Core Raider',
    Trial: 'Trial',
    Social: 'Social',
  };
  return displayNames[rank] || rank;
}

/**
 * Get rank order for sorting (lower number = higher rank)
 */
export function getRankOrder(rank: GuildRank): number {
  return GUILD_RANKS.indexOf(rank);
}

/**
 * Check if a member matches filter criteria
 */
export function memberMatchesFilters(
  member: RosterMember,
  filters: RosterFilters
): boolean {
  // Class filter
  if (filters.classes.length > 0 && !filters.classes.includes(member.class)) {
    return false;
  }

  // Role filter
  if (filters.roles.length > 0 && member.role && !filters.roles.includes(member.role)) {
    return false;
  }

  // Rank filter
  if (filters.ranks.length > 0 && !filters.ranks.includes(member.rank)) {
    return false;
  }

  // Attunement filter (member must have all specified attunements)
  if (filters.attunements && filters.attunements.length > 0) {
    const hasAllAttunements = filters.attunements.every(
      (attunement) => member.attunements[attunement] === true
    );
    if (!hasAllAttunements) {
      return false;
    }
  }

  // Search query (searches name and player name)
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    const nameMatch = member.name.toLowerCase().includes(query);
    const playerNameMatch = member.playerName?.toLowerCase().includes(query);
    if (!nameMatch && !playerNameMatch) {
      return false;
    }
  }

  return true;
}

/**
 * Sort roster members according to sort configuration
 */
export function sortRosterMembers(
  members: RosterMember[],
  sort: RosterSort
): RosterMember[] {
  return [...members].sort((a, b) => {
    let comparison = 0;

    switch (sort.field) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'rank':
        comparison = getRankOrder(a.rank) - getRankOrder(b.rank);
        break;
      case 'class':
        comparison = a.class.localeCompare(b.class);
        break;
      case 'level':
        comparison = (a.level || 0) - (b.level || 0);
        break;
      case 'gearScore':
        comparison = (a.gearInfo?.gearScore || 0) - (b.gearInfo?.gearScore || 0);
        break;
      case 'attendance':
        comparison =
          (a.attendance?.percentage || 0) - (b.attendance?.percentage || 0);
        break;
      case 'joinDate':
        const dateA = a.joinDate ? new Date(a.joinDate).getTime() : 0;
        const dateB = b.joinDate ? new Date(b.joinDate).getTime() : 0;
        comparison = dateA - dateB;
        break;
      default:
        comparison = 0;
    }

    return sort.direction === 'asc' ? comparison : -comparison;
  });
}

/**
 * Calculate overall attendance percentage from raid data
 */
export function calculateAttendancePercentage(
  attendedRaids: number,
  totalRaids: number
): number {
  if (totalRaids === 0) return 0;
  return Math.round((attendedRaids / totalRaids) * 100);
}

/**
 * Get attendance status color for UI display
 */
export function getAttendanceColor(percentage: number): string {
  if (percentage >= 90) return 'hsl(122 45% 44%)'; // Green
  if (percentage >= 75) return 'hsl(41 40% 60%)'; // Gold
  if (percentage >= 50) return 'hsl(28 100% 51%)'; // Orange
  return 'hsl(0 55% 42%)'; // Red
}
