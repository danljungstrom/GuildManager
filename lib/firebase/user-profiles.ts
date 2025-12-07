/**
 * User Profiles Firebase Operations
 *
 * CRUD operations for user profiles in Firestore.
 * Links Discord users to their claimed WoW characters.
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  deleteField,
  query,
  where,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from './config';
import type {
  UserProfile,
  CreateUserProfile,
  AltCharacter,
  CreateAltCharacter,
} from '@/lib/types/user-profile.types';
import { updateRosterMember } from './roster';

const USERS_COLLECTION = 'users';

/**
 * Get a user profile by Discord ID
 * Returns null if profile doesn't exist
 */
export async function getUserProfile(discordId: string): Promise<UserProfile | null> {
  if (!db) {
    console.error('Firebase not initialized');
    return null;
  }

  try {
    const userRef = doc(db, USERS_COLLECTION, discordId);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as UserProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

/**
 * Create or update a user profile
 * Uses Discord ID as document ID for fast lookups
 */
export async function createUserProfile(
  profile: CreateUserProfile
): Promise<UserProfile> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  try {
    const now = new Date().toISOString();
    const profileData = {
      ...profile,
      createdAt: now,
      updatedAt: now,
    };

    // Use Discord ID as document ID
    const userRef = doc(db, USERS_COLLECTION, profile.id);
    await setDoc(userRef, profileData);

    return profileData as UserProfile;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw new Error('Failed to create user profile');
  }
}

/**
 * Update an existing user profile
 */
export async function updateUserProfile(
  discordId: string,
  updates: Partial<UserProfile>
): Promise<void> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  try {
    const userRef = doc(db, USERS_COLLECTION, discordId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }
}

/**
 * Claim a character for a user (main character only)
 * Users can only claim ONE character from the roster as their main.
 * Updates both the user profile and the roster member.
 */
export async function claimCharacter(
  discordId: string,
  characterId: string,
  discordUsername: string,
  displayName: string,
  avatar?: string
): Promise<{ success: boolean; message: string }> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  try {
    const now = new Date().toISOString();

    // Check if user profile exists, create if not
    let profile = await getUserProfile(discordId);

    if (!profile) {
      // Create new profile with empty altCharacters array
      profile = await createUserProfile({
        id: discordId,
        discordUsername,
        displayName,
        avatar,
        claimedCharacters: [],
        altCharacters: [],
      });
    }

    // Users can only claim ONE main character
    if (profile.mainCharacterId) {
      return { success: false, message: 'You already have a main character. You can only claim one character from the roster.' };
    }

    // Check if character is already claimed by this user (legacy check)
    if (profile.claimedCharacters?.includes(characterId)) {
      return { success: false, message: 'You have already claimed this character' };
    }

    // Update roster member with claim info
    await updateRosterMember(characterId, {
      claimedBy: discordId,
      claimDate: now,
    });

    // Set this character as the main (and only) claimed character
    const userRef = doc(db, USERS_COLLECTION, discordId);
    await updateDoc(userRef, {
      claimedCharacters: [characterId], // Only one character allowed
      mainCharacterId: characterId,
      updatedAt: now,
    });

    return { success: true, message: 'Character claimed as your main!' };
  } catch (error) {
    console.error('Error claiming character:', error);
    throw new Error('Failed to claim character');
  }
}

/**
 * Unclaim the main character from a user
 * Updates both the user profile and the roster member
 */
export async function unclaimCharacter(
  discordId: string,
  characterId: string
): Promise<{ success: boolean; message: string }> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  try {
    const now = new Date().toISOString();
    const profile = await getUserProfile(discordId);

    if (!profile) {
      return { success: false, message: 'User profile not found' };
    }

    if (profile.mainCharacterId !== characterId) {
      return { success: false, message: 'This is not your main character' };
    }

    // Remove claim from roster member - use deleteField() to remove fields
    const rosterRef = doc(db, 'roster', characterId);
    await updateDoc(rosterRef, {
      claimedBy: deleteField(),
      claimDate: deleteField(),
      updatedAt: now,
    });

    // Clear main character from profile
    const userRef = doc(db, USERS_COLLECTION, discordId);
    await updateDoc(userRef, {
      claimedCharacters: [],
      mainCharacterId: null,
      updatedAt: now,
    });

    return { success: true, message: 'Main character unclaimed successfully' };
  } catch (error) {
    console.error('Error unclaiming character:', error);
    throw new Error('Failed to unclaim character');
  }
}

/**
 * Check if user has a main character claimed
 */
export async function hasMainCharacter(discordId: string): Promise<boolean> {
  const profile = await getUserProfile(discordId);
  return !!profile?.mainCharacterId;
}

/**
 * Get all unclaimed characters from the roster
 */
export async function getUnclaimedCharacters(): Promise<string[]> {
  if (!db) {
    console.error('Firebase not initialized');
    return [];
  }

  try {
    // Query roster members where claimedBy is null or doesn't exist
    const rosterRef = collection(db, 'roster');
    const snapshot = await getDocs(rosterRef);

    const unclaimedIds: string[] = [];
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (!data.claimedBy) {
        unclaimedIds.push(doc.id);
      }
    });

    return unclaimedIds;
  } catch (error) {
    console.error('Error fetching unclaimed characters:', error);
    return [];
  }
}

/**
 * Check if a character is already claimed
 */
export async function isCharacterClaimed(characterId: string): Promise<boolean> {
  if (!db) {
    console.error('Firebase not initialized');
    return false;
  }

  try {
    const rosterRef = doc(db, 'roster', characterId);
    const snapshot = await getDoc(rosterRef);

    if (!snapshot.exists()) {
      return false;
    }

    const data = snapshot.data();
    return !!data.claimedBy;
  } catch (error) {
    console.error('Error checking character claim status:', error);
    return false;
  }
}

/**
 * Get who claimed a specific character
 */
export async function getCharacterClaimant(characterId: string): Promise<string | null> {
  if (!db) {
    console.error('Firebase not initialized');
    return null;
  }

  try {
    const rosterRef = doc(db, 'roster', characterId);
    const snapshot = await getDoc(rosterRef);

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data();
    return data.claimedBy || null;
  } catch (error) {
    console.error('Error getting character claimant:', error);
    return null;
  }
}

/**
 * Admin: Force unclaim a character (removes claim regardless of owner)
 */
export async function adminUnclaimCharacter(
  characterId: string,
  adminId: string
): Promise<{ success: boolean; message: string }> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  try {
    const now = new Date().toISOString();

    // Get current claimant
    const rosterRef = doc(db, 'roster', characterId);
    const rosterSnapshot = await getDoc(rosterRef);

    if (!rosterSnapshot.exists()) {
      return { success: false, message: 'Character not found' };
    }

    const rosterData = rosterSnapshot.data();
    const claimantId = rosterData.claimedBy;

    if (!claimantId) {
      return { success: false, message: 'Character is not claimed' };
    }

    // Remove claim from roster member - use deleteField() to remove fields
    await updateDoc(rosterRef, {
      claimedBy: deleteField(),
      claimDate: deleteField(),
      updatedAt: now,
    });

    // Remove from claimant's profile
    const userRef = doc(db, USERS_COLLECTION, claimantId);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      const updateData: Record<string, unknown> = {
        claimedCharacters: arrayRemove(characterId),
        updatedAt: now,
      };

      if (userData.mainCharacterId === characterId) {
        const remainingChars = (userData.claimedCharacters || []).filter(
          (id: string) => id !== characterId
        );
        updateData.mainCharacterId = remainingChars.length > 0 ? remainingChars[0] : null;
      }

      await updateDoc(userRef, updateData);
    }

    return { success: true, message: 'Character unclaimed by admin' };
  } catch (error) {
    console.error('Error admin unclaiming character:', error);
    throw new Error('Failed to admin unclaim character');
  }
}

/**
 * Delete a user profile
 * Also removes all character claims
 */
export async function deleteUserProfile(discordId: string): Promise<void> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  try {
    const profile = await getUserProfile(discordId);

    if (profile) {
      // Unclaim main character if exists
      if (profile.mainCharacterId) {
        const rosterRef = doc(db, 'roster', profile.mainCharacterId);
        await updateDoc(rosterRef, {
          claimedBy: deleteField(),
          claimDate: deleteField(),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    // Delete the profile (alts are stored within the profile, so they're deleted automatically)
    const userRef = doc(db, USERS_COLLECTION, discordId);
    await deleteDoc(userRef);
  } catch (error) {
    console.error('Error deleting user profile:', error);
    throw new Error('Failed to delete user profile');
  }
}

// ==========================================
// Alt Character Functions
// ==========================================

/**
 * Generate a unique ID for alt characters
 */
function generateAltId(): string {
  return `alt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Add an alt character to a user's profile
 * Requires the user to have a main character first
 */
export async function addAltCharacter(
  discordId: string,
  altData: CreateAltCharacter
): Promise<{ success: boolean; message: string; alt?: AltCharacter }> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  try {
    const profile = await getUserProfile(discordId);

    if (!profile) {
      return { success: false, message: 'User profile not found' };
    }

    // User must have a main character before adding alts
    if (!profile.mainCharacterId) {
      return { success: false, message: 'You must claim a main character before adding alts' };
    }

    const now = new Date().toISOString();
    const newAlt: AltCharacter = {
      ...altData,
      id: generateAltId(),
      ownerId: discordId,
      createdAt: now,
      updatedAt: now,
    };

    // Remove undefined values as Firestore doesn't accept them
    const cleanedAlt = Object.fromEntries(
      Object.entries(newAlt).filter(([, value]) => value !== undefined)
    ) as unknown as AltCharacter;

    const updatedAlts = [...(profile.altCharacters || []), cleanedAlt];

    const userRef = doc(db, USERS_COLLECTION, discordId);
    await updateDoc(userRef, {
      altCharacters: updatedAlts,
      updatedAt: now,
    });

    return { success: true, message: 'Alt character added!', alt: newAlt };
  } catch (error) {
    console.error('Error adding alt character:', error);
    throw new Error('Failed to add alt character');
  }
}

/**
 * Update an existing alt character
 */
export async function updateAltCharacter(
  discordId: string,
  altId: string,
  updates: Partial<Omit<AltCharacter, 'id' | 'ownerId' | 'createdAt'>>
): Promise<{ success: boolean; message: string }> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  try {
    const profile = await getUserProfile(discordId);

    if (!profile) {
      return { success: false, message: 'User profile not found' };
    }

    const altIndex = (profile.altCharacters || []).findIndex(alt => alt.id === altId);
    if (altIndex === -1) {
      return { success: false, message: 'Alt character not found' };
    }

    const now = new Date().toISOString();
    const updatedAlts = [...profile.altCharacters];
    const updatedAlt = {
      ...updatedAlts[altIndex],
      ...updates,
      updatedAt: now,
    };

    // Remove undefined values as Firestore doesn't accept them
    updatedAlts[altIndex] = Object.fromEntries(
      Object.entries(updatedAlt).filter(([, value]) => value !== undefined)
    ) as unknown as AltCharacter;

    const userRef = doc(db, USERS_COLLECTION, discordId);
    await updateDoc(userRef, {
      altCharacters: updatedAlts,
      updatedAt: now,
    });

    return { success: true, message: 'Alt character updated!' };
  } catch (error) {
    console.error('Error updating alt character:', error);
    throw new Error('Failed to update alt character');
  }
}

/**
 * Delete an alt character from a user's profile
 */
export async function deleteAltCharacter(
  discordId: string,
  altId: string
): Promise<{ success: boolean; message: string }> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  try {
    const profile = await getUserProfile(discordId);

    if (!profile) {
      return { success: false, message: 'User profile not found' };
    }

    const altIndex = (profile.altCharacters || []).findIndex(alt => alt.id === altId);
    if (altIndex === -1) {
      return { success: false, message: 'Alt character not found' };
    }

    const now = new Date().toISOString();
    const updatedAlts = profile.altCharacters.filter(alt => alt.id !== altId);

    const userRef = doc(db, USERS_COLLECTION, discordId);
    await updateDoc(userRef, {
      altCharacters: updatedAlts,
      updatedAt: now,
    });

    return { success: true, message: 'Alt character deleted!' };
  } catch (error) {
    console.error('Error deleting alt character:', error);
    throw new Error('Failed to delete alt character');
  }
}

/**
 * Get all alt characters for a user
 */
export async function getUserAlts(discordId: string): Promise<AltCharacter[]> {
  const profile = await getUserProfile(discordId);
  return profile?.altCharacters || [];
}

/**
 * Get all alt characters from all users (for alts roster view)
 */
export async function getAllAltCharacters(): Promise<AltCharacter[]> {
  if (!db) {
    console.error('Firebase not initialized');
    return [];
  }

  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const snapshot = await getDocs(usersRef);

    const allAlts: AltCharacter[] = [];
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (data.altCharacters && Array.isArray(data.altCharacters)) {
        allAlts.push(...data.altCharacters);
      }
    });

    return allAlts;
  } catch (error) {
    console.error('Error fetching all alt characters:', error);
    return [];
  }
}
