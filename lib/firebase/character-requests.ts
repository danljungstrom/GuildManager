/**
 * Character Requests Firebase Operations
 *
 * CRUD operations for character addition requests in Firestore.
 * Allows users to request new characters to be added to the roster.
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import type {
  CharacterRequest,
  CreateCharacterRequest,
  CharacterRequestStatus,
} from '@/lib/types/user-profile.types';
import { createRosterMember } from './roster';
import { claimCharacter } from './user-profiles';

const REQUESTS_COLLECTION = 'character-requests';

/**
 * Create a new character request
 */
export async function createCharacterRequest(
  request: CreateCharacterRequest
): Promise<CharacterRequest> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  try {
    const now = new Date().toISOString();
    const requestData = {
      ...request,
      status: 'pending' as CharacterRequestStatus,
      createdAt: now,
      updatedAt: now,
    };

    const requestsRef = collection(db, REQUESTS_COLLECTION);
    const docRef = await addDoc(requestsRef, requestData);

    return {
      id: docRef.id,
      ...requestData,
    };
  } catch (error) {
    console.error('Error creating character request:', error);
    throw new Error('Failed to create character request');
  }
}

/**
 * Get a character request by ID
 */
export async function getCharacterRequest(
  requestId: string
): Promise<CharacterRequest | null> {
  if (!db) {
    console.error('Firebase not initialized');
    return null;
  }

  try {
    const requestRef = doc(db, REQUESTS_COLLECTION, requestId);
    const snapshot = await getDoc(requestRef);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as CharacterRequest;
  } catch (error) {
    console.error('Error fetching character request:', error);
    return null;
  }
}

/**
 * Get all requests for a specific user
 */
export async function getUserCharacterRequests(
  discordId: string
): Promise<CharacterRequest[]> {
  if (!db) {
    console.error('Firebase not initialized');
    return [];
  }

  try {
    const requestsRef = collection(db, REQUESTS_COLLECTION);
    const q = query(
      requestsRef,
      where('requesterId', '==', discordId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CharacterRequest[];
  } catch (error) {
    console.error('Error fetching user character requests:', error);
    return [];
  }
}

/**
 * Get all pending requests (for admin review)
 */
export async function getPendingCharacterRequests(): Promise<CharacterRequest[]> {
  if (!db) {
    console.error('Firebase not initialized');
    return [];
  }

  try {
    const requestsRef = collection(db, REQUESTS_COLLECTION);
    const q = query(
      requestsRef,
      where('status', '==', 'pending'),
      orderBy('createdAt', 'asc')
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CharacterRequest[];
  } catch (error) {
    console.error('Error fetching pending character requests:', error);
    return [];
  }
}

/**
 * Get all requests (for admin view)
 */
export async function getAllCharacterRequests(): Promise<CharacterRequest[]> {
  if (!db) {
    console.error('Firebase not initialized');
    return [];
  }

  try {
    const requestsRef = collection(db, REQUESTS_COLLECTION);
    const q = query(requestsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CharacterRequest[];
  } catch (error) {
    console.error('Error fetching all character requests:', error);
    return [];
  }
}

/**
 * Approve a character request
 * Creates the roster member and auto-claims it for the requester
 */
export async function approveCharacterRequest(
  requestId: string,
  adminId: string,
  reviewNotes?: string
): Promise<{ success: boolean; message: string; characterId?: string }> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  try {
    const request = await getCharacterRequest(requestId);
    if (!request) {
      return { success: false, message: 'Request not found' };
    }

    if (request.status !== 'pending') {
      return { success: false, message: 'Request has already been reviewed' };
    }

    const now = new Date().toISOString();

    // Create the roster member
    const newMember = await createRosterMember({
      name: request.characterName,
      class: request.characterClass,
      spec: request.characterSpec,
      role: request.characterRole,
      professions: request.professions || [],
      attunements: request.attunements || {},
      rank: 'Trial', // New members start as Trial
      notes: `Added via character request by ${request.requesterName}`,
    });

    if (!newMember.id) {
      return { success: false, message: 'Failed to create roster member' };
    }

    // Auto-claim the character for the requester
    await claimCharacter(
      request.requesterId,
      newMember.id,
      request.requesterName,
      request.requesterName
    );

    // Update the request status
    const requestRef = doc(db, REQUESTS_COLLECTION, requestId);
    await updateDoc(requestRef, {
      status: 'approved',
      reviewedBy: adminId,
      reviewedAt: now,
      reviewNotes: reviewNotes || 'Approved',
      updatedAt: now,
    });

    return {
      success: true,
      message: 'Character request approved and character created',
      characterId: newMember.id,
    };
  } catch (error) {
    console.error('Error approving character request:', error);
    throw new Error('Failed to approve character request');
  }
}

/**
 * Reject a character request
 */
export async function rejectCharacterRequest(
  requestId: string,
  adminId: string,
  reviewNotes: string
): Promise<{ success: boolean; message: string }> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  try {
    const request = await getCharacterRequest(requestId);
    if (!request) {
      return { success: false, message: 'Request not found' };
    }

    if (request.status !== 'pending') {
      return { success: false, message: 'Request has already been reviewed' };
    }

    const now = new Date().toISOString();
    const requestRef = doc(db, REQUESTS_COLLECTION, requestId);
    await updateDoc(requestRef, {
      status: 'rejected',
      reviewedBy: adminId,
      reviewedAt: now,
      reviewNotes,
      updatedAt: now,
    });

    return { success: true, message: 'Character request rejected' };
  } catch (error) {
    console.error('Error rejecting character request:', error);
    throw new Error('Failed to reject character request');
  }
}

/**
 * Cancel a pending request (user can cancel their own request)
 */
export async function cancelCharacterRequest(
  requestId: string,
  discordId: string
): Promise<{ success: boolean; message: string }> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  try {
    const request = await getCharacterRequest(requestId);
    if (!request) {
      return { success: false, message: 'Request not found' };
    }

    if (request.requesterId !== discordId) {
      return { success: false, message: 'You can only cancel your own requests' };
    }

    if (request.status !== 'pending') {
      return { success: false, message: 'Can only cancel pending requests' };
    }

    const requestRef = doc(db, REQUESTS_COLLECTION, requestId);
    await deleteDoc(requestRef);

    return { success: true, message: 'Request cancelled' };
  } catch (error) {
    console.error('Error cancelling character request:', error);
    throw new Error('Failed to cancel character request');
  }
}

/**
 * Delete a request (admin only)
 */
export async function deleteCharacterRequest(
  requestId: string
): Promise<void> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  try {
    const requestRef = doc(db, REQUESTS_COLLECTION, requestId);
    await deleteDoc(requestRef);
  } catch (error) {
    console.error('Error deleting character request:', error);
    throw new Error('Failed to delete character request');
  }
}

/**
 * Get count of pending requests (for admin badge)
 */
export async function getPendingRequestCount(): Promise<number> {
  if (!db) {
    console.error('Firebase not initialized');
    return 0;
  }

  try {
    const requestsRef = collection(db, REQUESTS_COLLECTION);
    const q = query(requestsRef, where('status', '==', 'pending'));
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error('Error counting pending requests:', error);
    return 0;
  }
}
