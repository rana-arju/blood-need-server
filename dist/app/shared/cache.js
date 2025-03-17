"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCachedData = getCachedData;
exports.invalidateCache = invalidateCache;
exports.invalidateCacheByPattern = invalidateCacheByPattern;
exports.flushCache = flushCache;
const node_cache_1 = __importDefault(require("node-cache"));
// Create a cache instance with default TTL of 5 minutes and check period of 10 minutes
const cache = new node_cache_1.default({
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
async function getCachedData(key, ttl, callback) {
    // Check if data exists in cache
    const cachedData = cache.get(key);
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
function invalidateCache(key) {
    cache.del(key);
}
/**
 * Invalidate multiple cache keys by pattern
 * @param pattern Regex pattern to match keys
 */
function invalidateCacheByPattern(pattern) {
    const keys = cache.keys();
    const matchingKeys = keys.filter((key) => pattern.test(key));
    if (matchingKeys.length > 0) {
        cache.del(matchingKeys);
    }
}
/**
 * Flush the entire cache
 */
function flushCache() {
    cache.flushAll();
}
exports.default = {
    getCachedData,
    invalidateCache,
    invalidateCacheByPattern,
    flushCache,
};
