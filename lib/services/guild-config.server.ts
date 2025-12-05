/**
 * Server-only guild config utilities
 * These functions are optimized for server-side rendering and static generation
 */

import { cache } from 'react';
import { getGuildConfig } from './guild-config.service';

/**
 * Cached server-side guild config fetcher
 * Uses React cache() to deduplicate requests within a single render
 */
export const getGuildConfigCached = cache(async () => {
  return await getGuildConfig();
});
