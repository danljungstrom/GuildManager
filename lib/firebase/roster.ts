/**
 * Roster Firebase Operations
 *
 * CRUD operations for guild member roster data in Firestore.
 * Handles all database interactions for roster management.
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  query,
  where,
} from 'firebase/firestore';
import { db } from './config';
import type {
  RosterMember,
  CreateRosterMember,
  RosterMemberUpdate,
} from '@/lib/types/roster.types';

const ROSTER_COLLECTION = 'roster';

/**
 * Get all roster members from Firestore
 */
export async function getAllRosterMembers(): Promise<RosterMember[]> {
  if (!db) {
    console.error('Firebase not initialized');
    return [];
  }

  try {
    const rosterRef = collection(db, ROSTER_COLLECTION);
    const snapshot = await getDocs(rosterRef);

    const members: RosterMember[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as RosterMember[];

    return members;
  } catch (error) {
    console.error('Error fetching roster members:', error);
    // Return empty array instead of throwing - let the caller handle fallback
    return [];
  }
}

/**
 * Get a single roster member by ID
 */
export async function getRosterMemberById(
  id: string
): Promise<RosterMember | null> {
  if (!db) {
    console.error('Firebase not initialized');
    return null;
  }

  try {
    const memberRef = doc(db, ROSTER_COLLECTION, id);
    const snapshot = await getDoc(memberRef);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as RosterMember;
  } catch (error) {
    console.error('Error fetching roster member:', error);
    throw new Error('Failed to fetch roster member');
  }
}

/**
 * Get roster members by class
 */
export async function getRosterMembersByClass(
  className: string
): Promise<RosterMember[]> {
  if (!db) {
    console.error('Firebase not initialized');
    return [];
  }

  try {
    const rosterRef = collection(db, ROSTER_COLLECTION);
    const q = query(rosterRef, where('class', '==', className));
    const snapshot = await getDocs(q);

    const members: RosterMember[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as RosterMember[];

    return members;
  } catch (error) {
    console.error('Error fetching roster members by class:', error);
    throw new Error('Failed to fetch roster members by class');
  }
}

/**
 * Get roster members by rank
 */
export async function getRosterMembersByRank(
  rank: string
): Promise<RosterMember[]> {
  if (!db) {
    console.error('Firebase not initialized');
    return [];
  }

  try {
    const rosterRef = collection(db, ROSTER_COLLECTION);
    const q = query(rosterRef, where('rank', '==', rank));
    const snapshot = await getDocs(q);

    const members: RosterMember[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as RosterMember[];

    return members;
  } catch (error) {
    console.error('Error fetching roster members by rank:', error);
    throw new Error('Failed to fetch roster members by rank');
  }
}

/**
 * Create a new roster member
 */
export async function createRosterMember(
  member: CreateRosterMember
): Promise<RosterMember> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  try {
    const now = new Date().toISOString();
    const memberData = {
      ...member,
      createdAt: now,
      updatedAt: now,
    };

    const rosterRef = collection(db, ROSTER_COLLECTION);
    const docRef = await addDoc(rosterRef, memberData);

    return {
      id: docRef.id,
      ...memberData,
    } as RosterMember;
  } catch (error) {
    console.error('Error creating roster member:', error);
    throw new Error('Failed to create roster member');
  }
}

/**
 * Update an existing roster member
 * Only updates the fields provided in the updates object
 */
export async function updateRosterMember(
  id: string,
  updates: RosterMemberUpdate
): Promise<void> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  try {
    const memberRef = doc(db, ROSTER_COLLECTION, id);

    // Add updated timestamp
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(memberRef, updateData);
  } catch (error) {
    console.error('Error updating roster member:', error);
    throw new Error('Failed to update roster member');
  }
}

/**
 * Delete a roster member
 */
export async function deleteRosterMember(id: string): Promise<void> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  try {
    const memberRef = doc(db, ROSTER_COLLECTION, id);
    await deleteDoc(memberRef);
  } catch (error) {
    console.error('Error deleting roster member:', error);
    throw new Error('Failed to delete roster member');
  }
}

/**
 * Batch create multiple roster members (useful for initial setup or imports)
 */
export async function batchCreateRosterMembers(
  members: CreateRosterMember[]
): Promise<RosterMember[]> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  try {
    const now = new Date().toISOString();
    const createdMembers: RosterMember[] = [];

    // Note: For large batches, consider using Firestore batch writes
    // For simplicity, using sequential creates here
    for (const member of members) {
      const memberData = {
        ...member,
        createdAt: now,
        updatedAt: now,
      };

      const rosterRef = collection(db, ROSTER_COLLECTION);
      const docRef = await addDoc(rosterRef, memberData);

      createdMembers.push({
        id: docRef.id,
        ...memberData,
      } as RosterMember);
    }

    return createdMembers;
  } catch (error) {
    console.error('Error batch creating roster members:', error);
    throw new Error('Failed to batch create roster members');
  }
}

/**
 * Check if a character name already exists in the roster
 */
export async function checkCharacterNameExists(
  name: string,
  excludeId?: string
): Promise<boolean> {
  if (!db) {
    console.error('Firebase not initialized');
    return false;
  }

  try {
    const rosterRef = collection(db, ROSTER_COLLECTION);
    const q = query(rosterRef, where('name', '==', name));
    const snapshot = await getDocs(q);

    // If excludeId is provided, filter it out (for edit operations)
    if (excludeId) {
      return snapshot.docs.some((doc) => doc.id !== excludeId);
    }

    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking character name:', error);
    return false;
  }
}

/**
 * Get roster statistics
 */
export async function getRosterStatistics() {
  if (!db) {
    console.error('Firebase not initialized');
    return null;
  }

  try {
    const members = await getAllRosterMembers();

    const totalMembers = members.length;
    const coreRaiders = members.filter((m) => m.rank === 'Core').length;
    const officers = members.filter((m) => m.rank === 'Officer').length;
    const trials = members.filter((m) => m.rank === 'Trial').length;

    // Class distribution
    const classCounts = members.reduce((acc, member) => {
      acc[member.class] = (acc[member.class] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Role distribution
    const roleCounts = members.reduce((acc, member) => {
      if (member.role) {
        acc[member.role] = (acc[member.role] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Average level
    const levels = members.filter((m) => m.level).map((m) => m.level!);
    const avgLevel =
      levels.length > 0
        ? Math.round(levels.reduce((sum, level) => sum + level, 0) / levels.length)
        : 0;

    // Average attendance
    const attendancePercentages = members
      .filter((m) => m.attendance?.percentage !== undefined)
      .map((m) => m.attendance!.percentage);
    const avgAttendance =
      attendancePercentages.length > 0
        ? Math.round(
            attendancePercentages.reduce((sum, pct) => sum + pct, 0) /
              attendancePercentages.length
          )
        : 0;

    return {
      totalMembers,
      coreRaiders,
      officers,
      trials,
      classCounts,
      roleCounts,
      avgLevel,
      avgAttendance,
    };
  } catch (error) {
    console.error('Error calculating roster statistics:', error);
    return null;
  }
}

/**
 * Batch populate roster with mock data (for development/testing)
 * Uses Firestore batch writes for better performance
 */
export async function populateRosterWithMockData(
  members: Omit<RosterMember, 'id'>[]
): Promise<number> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  try {
    const now = new Date().toISOString();
    const batch = writeBatch(db);
    const rosterRef = collection(db, ROSTER_COLLECTION);

    // Firestore batch limit is 500 operations
    const batchSize = 500;
    let count = 0;

    for (let i = 0; i < members.length; i++) {
      const memberData = {
        ...members[i],
        createdAt: now,
        updatedAt: now,
      };

      const docRef = doc(rosterRef);
      batch.set(docRef, memberData);
      count++;

      // Commit batch every 500 operations or at the end
      if ((i + 1) % batchSize === 0 || i === members.length - 1) {
        await batch.commit();
      }
    }

    return count;
  } catch (error) {
    console.error('Error populating roster with mock data:', error);
    throw new Error('Failed to populate roster with mock data');
  }
}

/**
 * Clear all roster members (for development/testing)
 * WARNING: This deletes ALL roster data!
 */
export async function clearAllRosterMembers(): Promise<number> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  try {
    const rosterRef = collection(db, ROSTER_COLLECTION);
    const snapshot = await getDocs(rosterRef);

    const batch = writeBatch(db);
    let count = 0;
    const batchSize = 500;

    snapshot.docs.forEach((document, index) => {
      batch.delete(document.ref);
      count++;

      // Commit batch every 500 operations
      if ((index + 1) % batchSize === 0) {
        batch.commit();
      }
    });

    // Commit remaining operations
    if (count % batchSize !== 0) {
      await batch.commit();
    }

    return count;
  } catch (error) {
    console.error('Error clearing roster members:', error);
    throw new Error('Failed to clear roster members');
  }
}

/**
 * Remove only mock roster members (those with isMock: true)
 * Safe operation that preserves real roster data
 */
export async function removeMockRosterMembers(): Promise<number> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  try {
    const rosterRef = collection(db, ROSTER_COLLECTION);
    const q = query(rosterRef, where('isMock', '==', true));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return 0;
    }

    const batch = writeBatch(db);
    let count = 0;

    snapshot.docs.forEach((document) => {
      batch.delete(document.ref);
      count++;
    });

    await batch.commit();
    return count;
  } catch (error) {
    console.error('Error removing mock roster members:', error);
    throw new Error('Failed to remove mock roster members');
  }
}

/**
 * Count mock roster members
 */
export async function countMockRosterMembers(): Promise<number> {
  if (!db) {
    console.error('Firebase not initialized');
    return 0;
  }

  try {
    const rosterRef = collection(db, ROSTER_COLLECTION);
    const q = query(rosterRef, where('isMock', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error('Error counting mock roster members:', error);
    return 0;
  }
}
