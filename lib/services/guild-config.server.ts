/**
 * Server-only guild config utilities
 * These functions are optimized for server-side rendering and static generation
 */

import { unstable_cache } from 'next/cache';
import { getGuildConfig } from './guild-config.service';

// Cache duration: longer in dev to reduce Firestore reads during HMR
const CACHE_DURATION = process.env.NODE_ENV === 'development' ? 300 : 60; // 5 min dev, 1 min prod

/**
 * Cached server-side guild config fetcher
 * Uses Next.js unstable_cache for time-based revalidation across requests
 *
 * This significantly reduces Firestore reads:
 * - Before: Every page load = 1 Firestore read
 * - After: 1 read per CACHE_DURATION seconds
 */
export const getGuildConfigCached = unstable_cache(
  async () => {
    return await getGuildConfig();
  },
  ['guild-config'], // Cache key
  {
    revalidate: CACHE_DURATION,
    tags: ['guild-config'], // For manual invalidation via revalidateTag('guild-config')
  }
);
