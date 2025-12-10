/**
 * Server-only roster utilities
 * These functions are optimized for server-side rendering with caching
 */

import { unstable_cache } from 'next/cache';
import { getAllRosterMembers } from './roster';

// Cache duration: longer in dev to reduce Firestore reads during HMR
const CACHE_DURATION = process.env.NODE_ENV === 'development' ? 300 : 30; // 5 min dev, 30 sec prod

/**
 * Cached server-side roster fetcher
 * Uses Next.js unstable_cache for time-based revalidation across requests
 *
 * This significantly reduces Firestore reads:
 * - Before: Every roster page load = N reads (1 per roster member)
 * - After: N reads per CACHE_DURATION seconds
 */
export const getAllRosterMembersCached = unstable_cache(
  async () => {
    return await getAllRosterMembers();
  },
  ['roster-members'], // Cache key
  {
    revalidate: CACHE_DURATION,
    tags: ['roster-members'], // For manual invalidation via revalidateTag('roster-members')
  }
);
