import NodeCache from "node-cache";

// Create a cache instance with default TTL of 5 minutes and check period of 10 minutes
const cache = new NodeCache({
  stdTTL: 300,
  checkperiod: 600,
  useClones: false,
});

/**
 * Generic cache wrapper for async functions
 * @param key Cache key
 * @param ttl Time to live in seconds
 * @param callback Function to execute if cache miss
 * @returns Cached or fresh data
 */
export async function getCachedData<T>(
  key: string,
  ttl: number,
  callback: () => Promise<T>
): Promise<T> {
  // Check if data exists in cache
  const cachedData = cache.get<T>(key);
  if (cachedData !== undefined) {
    return cachedData;
  }

  // If not in cache, execute callback to get fresh data
  const freshData = await callback();

  // Store in cache
  cache.set(key, freshData, ttl);

  return freshData;
}

/**
 * Invalidate a specific cache key
 * @param key Cache key to invalidate
 */
export function invalidateCache(key: string): void {
  cache.del(key);
}

/**
 * Invalidate multiple cache keys by pattern
 * @param pattern Regex pattern to match keys
 */
export function invalidateCacheByPattern(pattern: RegExp): void {
  const keys = cache.keys();
  const matchingKeys = keys.filter((key) => pattern.test(key));

  if (matchingKeys.length > 0) {
    cache.del(matchingKeys);
  }
}

/**
 * Flush the entire cache
 */
export function flushCache(): void {
  cache.flushAll();
}

export default {
  getCachedData,
  invalidateCache,
  invalidateCacheByPattern,
  flushCache,
};
