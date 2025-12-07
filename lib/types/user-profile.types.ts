/**
 * User Profile Types
 *
 * Type definitions for user profiles and character requests.
 * Links Discord users to their claimed WoW characters.
 */

import type { ClassType } from './classes.types';
import type { RoleType } from './roles.types';
import type { GuildRank, ProfessionEntry, AttunementMap } from './roster.types';

/**
 * Alt character owned by a user (not in main roster)
 * Alt characters are stored separately from the main guild roster
 */
export interface AltCharacter {
  id: string; // Unique ID for the alt
  ownerId: string; // Discord user ID who owns this alt

  // Character info
  name: string;
  class: ClassType;
  spec?: string;
  role?: RoleType;

  // Optional details
  professions?: ProfessionEntry[];
  attunements?: AttunementMap;
  notes?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * User profile stored in Firestore
 * Document ID is the Discord user ID for fast lookups
 */
export interface UserProfile {
  // Identity (matches Discord auth)
  id: string; // Discord user ID (also Firestore doc ID)
  discordUsername: string;
  displayName: string;
  avatar?: string;

  // Main character - users can claim ONE character from the roster
  mainCharacterId?: string; // Roster member ID of claimed main character

  // Alt characters - user-created, not part of main roster
  altCharacters: AltCharacter[];

  // Legacy field - kept for backward compatibility, will be empty or have max 1 item
  claimedCharacters: string[];

  // Preferences
  preferredRole?: RoleType;

  // Timestamps
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

/**
 * Request status for character addition requests
 */
export type CharacterRequestStatus = 'pending' | 'approved' | 'rejected';

/**
 * Request to add a new character to the roster
 * Used when a user's character is not already in the roster
 */
export interface CharacterRequest {
  id?: string; // Firestore document ID

  // Requester info
  requesterId: string; // Discord user ID
  requesterName: string; // Discord display name

  // Character info (submitted by user)
  characterName: string;
  characterClass: ClassType;
  characterSpec?: string;
  characterRole?: RoleType;

  // Optional details
  professions?: ProfessionEntry[];
  attunements?: AttunementMap;
  notes?: string; // User notes/reason for request

  // Request status
  status: CharacterRequestStatus;
  reviewedBy?: string; // Admin Discord ID who reviewed
  reviewedAt?: string; // ISO date when reviewed
  reviewNotes?: string; // Admin notes on decision

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Create a new character request (omits auto-generated fields)
 */
export type CreateCharacterRequest = Omit<
  CharacterRequest,
  'id' | 'status' | 'reviewedBy' | 'reviewedAt' | 'reviewNotes' | 'createdAt' | 'updatedAt'
>;

/**
 * Create a new user profile (omits auto-generated fields)
 */
export type CreateUserProfile = Omit<UserProfile, 'createdAt' | 'updatedAt'>;

/**
 * Create a new alt character (omits auto-generated fields)
 */
export type CreateAltCharacter = Omit<AltCharacter, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Summary of a user's character claim status
 */
export interface UserCharacterSummary {
  hasProfile: boolean;
  hasClaim: boolean;
  claimedCount: number;
  mainCharacterName?: string;
  pendingRequestCount: number;
}

/**
 * Result of a claim operation
 */
export interface ClaimResult {
  success: boolean;
  message: string;
  characterId?: string;
}
